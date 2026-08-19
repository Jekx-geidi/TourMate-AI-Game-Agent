import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, type SimulationSession } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GamificationService } from '../gamification/gamification.service';
import {
  XP_POLICY_VERSION,
  calculateFirstCompletionXp,
  calculateReplayXp,
} from '../gamification/xp-policy.util';
import type { SubmitSimulationAnswerDto } from './dto/submit-simulation-answer.dto';
import { buildDeterministicFeedback } from './simulation-feedback.util';
import {
  parseLearningTags,
  parseRubricPoints,
  parseScoringWeights,
} from './simulation-json.util';
import { SimulationScoringService } from './simulation-scoring.service';
import { resultBandFor } from './simulation.constants';
import { SimulationCoachService } from './simulation-coach.service';

const P2002_UNIQUE_CONSTRAINT = 'P2002';

function isUniqueConstraintError(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === P2002_UNIQUE_CONSTRAINT
  );
}

@Injectable()
export class SimulationSessionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scoringService: SimulationScoringService,
    private readonly gamificationService: GamificationService,
    private readonly coachService: SimulationCoachService,
  ) {}

  async startSession(
    userId: string,
    slug: string,
    requestedVersion: number | undefined,
    idempotencyKey: string | undefined,
  ) {
    const version = await this.getPublishedVersionOrThrow(
      slug,
      requestedVersion,
    );

    const existingActive = await this.prisma.simulationSession.findFirst({
      where: { userId, simulationVersionId: version.id, status: 'IN_PROGRESS' },
      orderBy: { startedAt: 'desc' },
    });
    if (existingActive) {
      return this.buildSessionView(existingActive, version);
    }

    if (idempotencyKey) {
      const existingByKey = await this.prisma.simulationSession.findUnique({
        where: { startRequestKey: idempotencyKey },
      });
      if (existingByKey && existingByKey.userId === userId) {
        return this.buildSessionView(existingByKey, version);
      }
    }

    let session: SimulationSession | null = null;
    try {
      session = await this.prisma.simulationSession.create({
        data: {
          userId,
          simulationVersionId: version.id,
          startRequestKey: idempotencyKey || undefined,
        },
      });
    } catch (error) {
      if (isUniqueConstraintError(error) && idempotencyKey) {
        session = await this.prisma.simulationSession.findUnique({
          where: { startRequestKey: idempotencyKey },
        });
        if (!session || session.userId !== userId) throw error;
      } else {
        throw error;
      }
    }

    if (!session) {
      throw new Error('Failed to start or resume the mission session.');
    }

    return this.buildSessionView(session, version);
  }

  async getOwnedSession(userId: string, sessionId: string) {
    const session = await this.loadOwnedSessionOrThrow(userId, sessionId);
    const version = await this.loadVersionWithSteps(
      session.simulationVersionId,
    );

    if (session.status === 'COMPLETED') {
      const result = await this.prisma.simulationResult.findUnique({
        where: { sessionId },
      });
      return {
        sessionId: session.id,
        status: session.status,
        mission: this.missionSummary(version),
        resultId: result?.id ?? null,
      };
    }

    return this.buildSessionView(session, version);
  }

  async submitAnswer(
    userId: string,
    sessionId: string,
    dto: SubmitSimulationAnswerDto,
    idempotencyKey: string | undefined,
  ) {
    const session = await this.loadOwnedSessionOrThrow(userId, sessionId);
    if (session.status !== 'IN_PROGRESS') {
      throw new ConflictException({
        code: 'SIMULATION_SESSION_NOT_ACTIVE',
        message: 'This mission session is no longer active.',
      });
    }

    const version = await this.loadVersionWithSteps(
      session.simulationVersionId,
    );
    const expectedOrderIndex = session.currentStepOrder + 1;
    const expectedStep = version.steps.find(
      (step) => step.orderIndex === expectedOrderIndex,
    );

    if (!expectedStep || expectedStep.id !== dto.stepId) {
      throw new ConflictException({
        code: 'SIMULATION_STEP_CONFLICT',
        message:
          'This mission has already advanced. Refresh to continue from the current step.',
      });
    }

    const selectedOption = expectedStep.options.find(
      (option) => option.id === dto.optionId,
    );
    if (!selectedOption) {
      throw new ConflictException({
        code: 'SIMULATION_OPTION_INVALID',
        message: 'That option is not valid for the current step.',
      });
    }

    let decisionAlreadyExisted = false;
    try {
      await this.prisma.simulationDecision.create({
        data: {
          sessionId,
          stepId: expectedStep.id,
          optionId: selectedOption.id,
          requestKey: idempotencyKey || undefined,
        },
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        decisionAlreadyExisted = true;
      } else {
        throw error;
      }
    }

    const updatedSession = decisionAlreadyExisted
      ? session
      : await this.prisma.simulationSession.update({
          where: { id: sessionId },
          data: { currentStepOrder: expectedOrderIndex },
        });

    const nextOrderIndex = updatedSession.currentStepOrder + 1;
    const nextStep = version.steps.find(
      (step) => step.orderIndex === nextOrderIndex,
    );
    const canComplete = updatedSession.currentStepOrder >= version.steps.length;

    return {
      accepted: true,
      decision: { stepId: expectedStep.id, optionId: selectedOption.id },
      progress: {
        current: updatedSession.currentStepOrder,
        total: version.steps.length,
      },
      nextStep: nextStep ? this.stepView(nextStep) : null,
      canComplete,
    };
  }

  async completeSession(userId: string, sessionId: string) {
    const txResult = await this.prisma.$transaction(async (tx) => {
      const session = await tx.simulationSession.findFirst({
        where: { id: sessionId, userId },
        include: {
          result: true,
          decisions: true,
          simulationVersion: {
            include: {
              simulation: true,
              steps: {
                include: { options: true },
                orderBy: { orderIndex: 'asc' },
              },
              relatedLessons: {
                include: { lesson: true },
                orderBy: { orderIndex: 'asc' },
                take: 1,
              },
            },
          },
        },
      });

      if (!session) {
        throw new NotFoundException({
          code: 'SIMULATION_SESSION_NOT_FOUND',
          message: 'Mission session not found.',
        });
      }

      if (session.result) {
        return { session, result: session.result, isRetry: true as const };
      }

      if (session.status !== 'IN_PROGRESS') {
        throw new ConflictException({
          code: 'SIMULATION_SESSION_NOT_ACTIVE',
          message: 'This mission session is no longer active.',
        });
      }

      const version = session.simulationVersion;
      if (session.decisions.length < version.steps.length) {
        throw new ConflictException({
          code: 'SIMULATION_INCOMPLETE',
          message: 'Answer every required step before completing this mission.',
        });
      }

      const scoringSteps = version.steps.map((step) => ({
        stepId: step.id,
        options: step.options.map((option) => ({
          id: option.id,
          optionKey: option.optionKey,
          rubricPoints: parseRubricPoints(option.rubricPoints),
          learningTags: parseLearningTags(option.learningTags),
        })),
      }));
      const scoringDecisions = session.decisions.map((decision) => ({
        stepId: decision.stepId,
        optionId: decision.optionId,
      }));
      const scoringWeights = parseScoringWeights(version.scoringWeights);

      const score = this.scoringService.calculate({
        steps: scoringSteps,
        decisions: scoringDecisions,
        scoringWeights,
      });
      const resultBand = resultBandFor(score.overallScore);

      const relatedLesson = version.relatedLessons[0]
        ? {
            id: version.relatedLessons[0].lesson.id,
            title: version.relatedLessons[0].lesson.title,
            route: `/subjects/${version.relatedLessons[0].lesson.subjectId}/lessons?lesson=${version.relatedLessons[0].lesson.id}`,
          }
        : null;

      const deterministicFeedback = buildDeterministicFeedback({
        overallScore: score.overallScore,
        categoryScores: score.categoryScores,
        steps: scoringSteps,
        decisions: scoringDecisions,
        relatedLesson,
      });

      const priorCompletions = await tx.simulationSession.findMany({
        where: {
          userId,
          id: { not: sessionId },
          simulationVersion: { simulationId: version.simulationId },
          result: { isNot: null },
        },
        include: { result: true },
      });
      const isFirstCompletion = priorCompletions.length === 0;
      const priorBestScore = priorCompletions.reduce<number | null>(
        (best, prior) => {
          const priorScore = prior.result?.overallScore ?? null;
          if (priorScore === null) return best;
          return best === null ? priorScore : Math.max(best, priorScore);
        },
        null,
      );
      const isNewPersonalBest =
        priorBestScore === null || score.overallScore > priorBestScore;

      const xpAwarded = isFirstCompletion
        ? calculateFirstCompletionXp(score.overallScore)
        : calculateReplayXp(score.overallScore, priorBestScore);

      const resultSnapshot = {
        missionTitle: version.simulation.title,
        missionVersion: version.version,
        role: version.role,
        scoringWeights,
        decisions: session.decisions.map((decision) => {
          const step = version.steps.find((s) => s.id === decision.stepId);
          const option = step?.options.find((o) => o.id === decision.optionId);
          return {
            stepTitle: step?.title ?? null,
            optionKey: option?.optionKey ?? null,
            optionText: option?.text ?? null,
          };
        }),
      };

      const result = await tx.simulationResult.create({
        data: {
          sessionId,
          overallScore: score.overallScore,
          categoryScores: score.categoryScores,
          resultBand,
          scorePolicyVersion: version.scorePolicyVersion,
          deterministicFeedback:
            deterministicFeedback as unknown as Prisma.InputJsonValue,
          feedbackSource: 'DETERMINISTIC_FALLBACK',
          xpAwarded,
          resultSnapshot,
        },
      });

      for (const code of Object.keys(score.categoryScores) as Array<
        keyof typeof score.categoryScores
      >) {
        const competency = await tx.competency.findUnique({ where: { code } });
        if (!competency) continue;
        await tx.competencyEvidence.create({
          data: {
            userId,
            competencyId: competency.id,
            resultId: result.id,
            score: score.categoryScores[code],
            weight: scoringWeights[code] ?? 0,
            evidence:
              deterministicFeedback.strengths.find((s) => s.competency === code)
                ?.evidence ??
              deterministicFeedback.improvements.find(
                (i) => i.competency === code,
              )?.suggestion ??
              `Category score: ${score.categoryScores[code]}%.`,
          },
        });
      }

      const reward = await this.gamificationService.awardXpOnce(tx, {
        userId,
        type: 'SIMULATION_COMPLETED',
        idempotencyKey: `simulation_completion:${sessionId}`,
        xpDelta: xpAwarded,
        sourceType: 'simulation_session',
        sourceId: sessionId,
        policyVersion: XP_POLICY_VERSION,
        metadata: {
          overallScore: score.overallScore,
          isFirstCompletion,
          isNewPersonalBest,
        },
      });

      await tx.simulationSession.update({
        where: { id: sessionId },
        data: { status: 'COMPLETED', completedAt: new Date() },
      });

      return {
        session,
        result,
        isRetry: false as const,
        reward,
        isNewPersonalBest,
        missionTitle: version.simulation.title,
        role: version.role,
      };
    });

    return this.attachCoachFeedbackAndRespond(txResult);
  }

  async getResult(userId: string, sessionId: string) {
    const session = await this.loadOwnedSessionOrThrow(userId, sessionId);
    const result = await this.prisma.simulationResult.findUnique({
      where: { sessionId },
    });

    if (!result) {
      throw new ConflictException({
        code: 'SIMULATION_INCOMPLETE',
        message: 'Complete this mission to view its result.',
      });
    }

    return this.buildResultResponse(session.id, result);
  }

  private async attachCoachFeedbackAndRespond(
    txResult:
      | { session: { id: string }; result: { id: string }; isRetry: true }
      | {
          session: { id: string };
          result: Awaited<
            ReturnType<PrismaService['simulationResult']['create']>
          >;
          isRetry: false;
          reward: Awaited<ReturnType<GamificationService['awardXpOnce']>>;
          isNewPersonalBest: boolean;
          missionTitle: string;
          role: string;
        },
  ) {
    if (txResult.isRetry) {
      const fullResult = await this.prisma.simulationResult.findUniqueOrThrow({
        where: { id: txResult.result.id },
      });
      return this.buildResultResponse(txResult.session.id, fullResult);
    }

    const { session, result, reward, isNewPersonalBest, missionTitle, role } =
      txResult;
    const deterministicFeedback =
      result.deterministicFeedback as unknown as ReturnType<
        typeof buildDeterministicFeedback
      >;

    const coach = await this.coachService.generateCoachFeedback({
      missionTitle,
      role,
      overallScore: result.overallScore,
      categoryScores: result.categoryScores as Record<string, number>,
      deterministicFeedback,
    });

    const updatedResult = await this.prisma.simulationResult.update({
      where: { id: result.id },
      data: {
        aiFeedback: coach.content as unknown as Prisma.InputJsonValue,
        feedbackSource: coach.source,
        aiProviderId: coach.providerId,
        aiModelId: coach.modelId,
        aiPromptVersion: coach.promptVersion,
      },
    });

    return {
      resultId: updatedResult.id,
      sessionId: session.id,
      overallScore: updatedResult.overallScore,
      resultBand: updatedResult.resultBand,
      categoryScores: updatedResult.categoryScores,
      deterministicFeedback: updatedResult.deterministicFeedback,
      coachFeedback: {
        status: 'READY',
        source: coach.source,
        content: coach.content,
      },
      reward: {
        xpAwarded: reward.xpDelta,
        totalXp: reward.totalXp,
        level: reward.level,
        newPersonalBest: isNewPersonalBest,
      },
    };
  }

  private buildResultResponse(
    sessionId: string,
    result: {
      id: string;
      overallScore: number;
      resultBand: string;
      categoryScores: unknown;
      deterministicFeedback: unknown;
      aiFeedback: unknown;
      feedbackSource: string;
      xpAwarded: number;
    },
  ) {
    return {
      resultId: result.id,
      sessionId,
      overallScore: result.overallScore,
      resultBand: result.resultBand,
      categoryScores: result.categoryScores,
      deterministicFeedback: result.deterministicFeedback,
      coachFeedback: {
        status: 'READY',
        source: result.feedbackSource,
        content: result.aiFeedback ?? result.deterministicFeedback,
      },
      reward: {
        xpAwarded: result.xpAwarded,
        totalXp: null,
        level: null,
        newPersonalBest: null,
      },
    };
  }

  private async loadOwnedSessionOrThrow(userId: string, sessionId: string) {
    const session = await this.prisma.simulationSession.findFirst({
      where: { id: sessionId, userId },
    });
    if (!session) {
      throw new NotFoundException({
        code: 'SIMULATION_SESSION_NOT_FOUND',
        message: 'Mission session not found.',
      });
    }
    return session;
  }

  private async loadVersionWithSteps(versionId: string) {
    const version = await this.prisma.simulationVersion.findUniqueOrThrow({
      where: { id: versionId },
      include: {
        simulation: true,
        steps: { include: { options: true }, orderBy: { orderIndex: 'asc' } },
      },
    });
    return version;
  }

  private async getPublishedVersionOrThrow(
    slug: string,
    requestedVersion?: number,
  ) {
    const simulation = await this.prisma.simulation.findUnique({
      where: { slug },
    });
    if (!simulation || simulation.status !== 'PUBLISHED') {
      throw new NotFoundException({
        code: 'SIMULATION_NOT_FOUND',
        message: 'This mission is not available.',
      });
    }

    const version = await this.prisma.simulationVersion.findFirst({
      where: {
        simulationId: simulation.id,
        publishedAt: { not: null },
        ...(requestedVersion ? { version: requestedVersion } : {}),
      },
      orderBy: { version: 'desc' },
      include: {
        simulation: true,
        steps: { include: { options: true }, orderBy: { orderIndex: 'asc' } },
      },
    });

    if (!version) {
      throw new NotFoundException({
        code: 'SIMULATION_NOT_PUBLISHED',
        message: 'This mission is not available.',
      });
    }
    return version;
  }

  private missionSummary(version: {
    simulation: { slug: string; title: string };
    version: number;
    role: string;
  }) {
    return {
      slug: version.simulation.slug,
      title: version.simulation.title,
      version: version.version,
      role: version.role,
    };
  }

  private buildSessionView(
    session: { id: string; status: string; currentStepOrder: number },
    version: {
      simulation: { slug: string; title: string };
      version: number;
      role: string;
      steps: Array<{
        id: string;
        orderIndex: number;
        title: string;
        prompt: string;
        guidance: string | null;
        options: Array<{ id: string; text: string }>;
      }>;
    },
  ) {
    const expectedOrderIndex = session.currentStepOrder + 1;
    const expectedStep = version.steps.find(
      (step) => step.orderIndex === expectedOrderIndex,
    );

    return {
      sessionId: session.id,
      status: session.status,
      mission: this.missionSummary(version),
      progress: {
        current: session.currentStepOrder,
        total: version.steps.length,
      },
      step: expectedStep ? this.stepView(expectedStep) : null,
      canComplete: session.currentStepOrder >= version.steps.length,
    };
  }

  private stepView(step: {
    id: string;
    orderIndex: number;
    title: string;
    prompt: string;
    guidance: string | null;
    options: Array<{ id: string; text: string }>;
  }) {
    return {
      id: step.id,
      order: step.orderIndex,
      title: step.title,
      prompt: step.prompt,
      guidance: step.guidance,
      options: step.options.map((option) => ({
        id: option.id,
        text: option.text,
      })),
    };
  }
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { AmadeusAttempt, AmadeusSession, Prisma } from '@prisma/client';
import { GamificationService } from '../gamification/gamification.service';
import { levelForXp } from '../gamification/xp-policy.util';
import { PrismaService } from '../prisma/prisma.service';
import {
  AMADEUS_BASE_XP_BY_DIFFICULTY,
  AmadeusDifficulty,
  MAX_AMADEUS_COMBO,
} from './amadeus.constants';
import { scoreCommand } from './amadeus-scoring.util';
import { SubmitCommandDto } from './dto/submit-command.dto';

const XP_POLICY_VERSION = 'v1';

@Injectable()
export class AmadeusService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gamification: GamificationService,
  ) {}

  async listScenarios(difficulty?: string) {
    const scenarios = await this.prisma.amadeusScenario.findMany({
      where: difficulty ? { difficulty } : undefined,
      orderBy: { createdAt: 'asc' },
      include: { _count: { select: { steps: true } } },
    });

    return scenarios.map((scenario) => ({
      slug: scenario.slug,
      title: scenario.title,
      difficulty: scenario.difficulty,
      category: scenario.category,
      stepCount: scenario._count.steps,
    }));
  }

  async getScenarioBySlug(slug: string) {
    const scenario = await this.prisma.amadeusScenario.findUnique({
      where: { slug },
      include: { steps: { orderBy: { orderIndex: 'asc' } } },
    });
    if (!scenario) throw new NotFoundException('Scenario not found');

    return {
      slug: scenario.slug,
      title: scenario.title,
      difficulty: scenario.difficulty,
      category: scenario.category,
      brief: scenario.briefJson,
      stepCount: scenario.steps.length,
    };
  }

  async startSession(userId: string, slug: string, requestKey?: string) {
    if (requestKey) {
      const existing = await this.prisma.amadeusSession.findUnique({
        where: { startRequestKey: requestKey },
      });
      if (existing) return this.getOwnedSession(userId, existing.id);
    }

    const scenario = await this.prisma.amadeusScenario.findUnique({ where: { slug } });
    if (!scenario) throw new NotFoundException('Scenario not found');

    const session = await this.prisma.amadeusSession.create({
      data: { userId, scenarioId: scenario.id, startRequestKey: requestKey },
    });

    return this.getOwnedSession(userId, session.id);
  }

  async getOwnedSession(userId: string, sessionId: string) {
    const session = await this.prisma.amadeusSession.findFirst({
      where: { id: sessionId, userId },
      include: {
        scenario: { include: { steps: { orderBy: { orderIndex: 'asc' } } } },
        attempts: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (!session) throw new NotFoundException('Session not found');

    const currentStep =
      session.status === 'IN_PROGRESS'
        ? session.scenario.steps.find((step) => step.orderIndex === session.currentStepOrder)
        : undefined;

    return {
      id: session.id,
      status: session.status,
      combo: session.combo,
      scenario: {
        slug: session.scenario.slug,
        title: session.scenario.title,
        difficulty: session.scenario.difficulty,
        brief: session.scenario.briefJson,
        stepCount: session.scenario.steps.length,
      },
      currentStep: currentStep
        ? {
            orderIndex: currentStep.orderIndex,
            title: currentStep.title,
            instruction: currentStep.instruction,
            hints: currentStep.hints,
          }
        : null,
      history: session.attempts.map((attempt) => ({
        stepId: attempt.stepId,
        tier: attempt.tier,
        xpAwarded: attempt.xpAwarded,
        createdAt: attempt.createdAt,
      })),
      completedAt: session.completedAt,
    };
  }

  async submitCommand(userId: string, sessionId: string, dto: SubmitCommandDto) {
    return this.prisma.$transaction(async (tx) => {
      const session = await tx.amadeusSession.findFirst({
        where: { id: sessionId, userId },
        include: { scenario: { include: { steps: { orderBy: { orderIndex: 'asc' } } } } },
      });
      if (!session) throw new NotFoundException('Session not found');

      const existingAttempt = await tx.amadeusAttempt.findUnique({
        where: { requestKey: dto.requestKey },
      });
      if (existingAttempt) {
        return this.buildSubmitResult(tx, session, existingAttempt, false);
      }

      if (session.status !== 'IN_PROGRESS') {
        throw new BadRequestException('This session has already finished');
      }

      const currentStep = session.scenario.steps.find(
        (step) => step.orderIndex === session.currentStepOrder,
      );
      if (!currentStep) {
        throw new BadRequestException('No active step for this session');
      }

      const scored = scoreCommand(dto.command, currentStep.requiredTokens as string[][]);

      const comboAtAnswer =
        scored.tier === 'WRONG' ? 0 : Math.min(session.combo + 1, MAX_AMADEUS_COMBO);
      const comboMultiplier = Math.max(comboAtAnswer, 1);
      const difficulty = session.scenario.difficulty as AmadeusDifficulty;
      const xpAwarded = Math.round(
        AMADEUS_BASE_XP_BY_DIFFICULTY[difficulty] * scored.tierXpMultiplier * comboMultiplier,
      );

      const attempt = await tx.amadeusAttempt.create({
        data: {
          sessionId: session.id,
          stepId: currentStep.id,
          rawCommand: dto.command,
          tier: scored.tier,
          xpAwarded,
          comboAtAnswer,
          requestKey: dto.requestKey,
        },
      });

      // A recognized (non-WRONG) attempt advances the workflow -- Simple
      // mode is high-tolerance by design (docs section 17); only a totally
      // unrecognized command keeps the player on the same step to retry.
      const advances = scored.tier !== 'WRONG';
      const isLastStep = currentStep.orderIndex === session.scenario.steps.length - 1;
      const completingNow = advances && isLastStep;

      await tx.amadeusSession.update({
        where: { id: session.id },
        data: {
          combo: comboAtAnswer,
          currentStepOrder: advances ? currentStep.orderIndex + 1 : session.currentStepOrder,
          status: completingNow ? 'COMPLETED' : session.status,
          completedAt: completingNow ? new Date() : session.completedAt,
        },
      });

      if (xpAwarded > 0) {
        await this.gamification.awardXpOnce(tx, {
          userId,
          type: 'AMADEUS_COMMAND_SCORED',
          idempotencyKey: `amadeus_command:${dto.requestKey}`,
          xpDelta: xpAwarded,
          sourceType: 'amadeus_attempt',
          sourceId: attempt.id,
          policyVersion: XP_POLICY_VERSION,
          metadata: { tier: scored.tier, scenarioSlug: session.scenario.slug, stepId: currentStep.id },
        });
      }

      return this.buildSubmitResult(tx, session, attempt, true);
    });
  }

  private async buildSubmitResult(
    tx: Prisma.TransactionClient,
    session: AmadeusSession & { scenario: { steps: { orderIndex: number }[] } },
    attempt: AmadeusAttempt,
    created: boolean,
  ) {
    const profile = await this.gamification.getOrCreateProfile(tx, session.userId);
    const updated = await tx.amadeusSession.findUniqueOrThrow({
      where: { id: session.id },
      include: { scenario: { include: { steps: { orderBy: { orderIndex: 'asc' } } } } },
    });

    const nextStep =
      updated.status === 'IN_PROGRESS'
        ? updated.scenario.steps.find((step) => step.orderIndex === updated.currentStepOrder)
        : undefined;

    return {
      attemptId: attempt.id,
      created,
      tier: attempt.tier,
      xpAwarded: attempt.xpAwarded,
      comboAtAnswer: attempt.comboAtAnswer,
      sessionStatus: updated.status,
      nextStep: nextStep
        ? {
            orderIndex: nextStep.orderIndex,
            title: nextStep.title,
            instruction: nextStep.instruction,
            hints: nextStep.hints,
          }
        : null,
      totalXp: profile.xp,
      level: levelForXp(profile.xp).level,
    };
  }
}

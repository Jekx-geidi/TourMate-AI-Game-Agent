import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { ListSimulationsQueryDto } from './dto/list-simulations-query.dto';

export interface SimulationCatalogItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  subject: { id: string; code: string; name: string } | null;
  difficulty: string;
  competencies: unknown;
  stepCount: number;
  learnerStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  latestScore: number | null;
  bestScore: number | null;
}

@Injectable()
export class SimulationsService {
  constructor(private readonly prisma: PrismaService) {}

  async listPublished(userId: string, query: ListSimulationsQueryDto) {
    const simulations = await this.prisma.simulation.findMany({
      where: {
        status: 'PUBLISHED',
        ...(query.subjectId ? { subjectId: query.subjectId } : {}),
      },
      include: {
        subject: true,
        versions: {
          where: { publishedAt: { not: null } },
          orderBy: { version: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const items: SimulationCatalogItem[] = [];
    for (const simulation of simulations) {
      const version = simulation.versions[0];
      if (!version) continue; // published Simulation with no published version yet

      const learnerStatus = await this.getLearnerStatusSummary(
        userId,
        version.id,
      );
      items.push({
        id: simulation.id,
        slug: simulation.slug,
        title: simulation.title,
        summary: simulation.summary,
        subject: simulation.subject
          ? {
              id: simulation.subject.id,
              code: simulation.subject.code,
              name: simulation.subject.title,
            }
          : null,
        difficulty: simulation.difficulty,
        competencies: version.competencyCodes,
        stepCount: version.estimatedStepCount,
        learnerStatus: learnerStatus.status,
        latestScore: learnerStatus.latestScore,
        bestScore: learnerStatus.bestScore,
      });
    }

    return { items, page: 1, limit: items.length, total: items.length };
  }

  async getBySlug(userId: string, slug: string) {
    const simulation = await this.prisma.simulation.findUnique({
      where: { slug },
      include: { subject: true },
    });

    if (!simulation || simulation.status !== 'PUBLISHED') {
      throw new NotFoundException({
        code: 'SIMULATION_NOT_FOUND',
        message: 'This mission is not available.',
      });
    }

    const version = await this.prisma.simulationVersion.findFirst({
      where: { simulationId: simulation.id, publishedAt: { not: null } },
      orderBy: { version: 'desc' },
      include: {
        steps: { orderBy: { orderIndex: 'asc' } },
        relatedLessons: {
          include: { lesson: true },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!version) {
      throw new NotFoundException({
        code: 'SIMULATION_NOT_PUBLISHED',
        message: 'This mission is not available.',
      });
    }

    const activeSession = await this.prisma.simulationSession.findFirst({
      where: { userId, simulationVersionId: version.id, status: 'IN_PROGRESS' },
      orderBy: { startedAt: 'desc' },
    });

    const learnerStatus = await this.getLearnerStatusSummary(
      userId,
      version.id,
    );

    return {
      id: simulation.id,
      slug: simulation.slug,
      version: version.version,
      title: simulation.title,
      role: version.role,
      context: version.context,
      objectives: version.objectives,
      competencies: version.competencyCodes,
      difficulty: simulation.difficulty,
      stepCount: version.steps.length,
      relatedLessons: version.relatedLessons.map((relation) => ({
        id: relation.lesson.id,
        title: relation.lesson.title,
        route: `/subjects/${relation.lesson.subjectId}/lessons?lesson=${relation.lesson.id}`,
      })),
      learner: {
        status: learnerStatus.status,
        activeSessionId: activeSession?.id ?? null,
        attemptCount: learnerStatus.attemptCount,
        latestScore: learnerStatus.latestScore,
        bestScore: learnerStatus.bestScore,
      },
    };
  }

  private async getLearnerStatusSummary(userId: string, versionId: string) {
    const sessions = await this.prisma.simulationSession.findMany({
      where: { userId, simulationVersionId: versionId },
      include: { result: true },
      orderBy: { startedAt: 'desc' },
    });

    if (sessions.length === 0) {
      return {
        status: 'NOT_STARTED' as const,
        attemptCount: 0,
        latestScore: null,
        bestScore: null,
      };
    }

    const completed = sessions.filter((session) => session.result);
    const inProgress = sessions.some(
      (session) => session.status === 'IN_PROGRESS',
    );

    const latestScore = completed[0]?.result?.overallScore ?? null;
    const bestScore = completed.reduce<number | null>((best, session) => {
      const score = session.result?.overallScore ?? null;
      if (score === null) return best;
      return best === null ? score : Math.max(best, score);
    }, null);

    return {
      status: inProgress ? ('IN_PROGRESS' as const) : ('COMPLETED' as const),
      attemptCount: completed.length,
      latestScore,
      bestScore,
    };
  }
}

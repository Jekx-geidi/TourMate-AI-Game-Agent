import { Injectable } from '@nestjs/common';
import type { GameProfile, Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { ActivityEventType } from '../simulations/simulation.constants';
import { levelForXp } from './xp-policy.util';

// Structurally satisfied by both PrismaService and an interactive-transaction
// client, so award logic can run either standalone or inside a caller's
// transaction (e.g. simulation completion) without duplicating this code.
type Db = Pick<PrismaClient, 'gameProfile' | 'activityEvent'>;

export interface AwardXpParams {
  userId: string;
  type: ActivityEventType;
  idempotencyKey: string;
  xpDelta: number;
  sourceType?: string;
  sourceId?: string;
  policyVersion?: string;
  metadata?: Record<string, unknown>;
}

export interface AwardXpResult {
  created: boolean;
  xpDelta: number;
  totalXp: number;
  level: number;
}

@Injectable()
export class GamificationService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyProfile(userId: string) {
    const profile = await this.getOrCreateProfile(this.prisma, userId);
    const recentEvents = await this.prisma.activityEvent.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    const { level, xpToNextLevel } = levelForXp(profile.xp);

    return {
      xp: profile.xp,
      level,
      xpToNextLevel,
      streak: profile.streakCount,
      recentEvents: recentEvents.map((event) => ({
        type: event.type,
        xpDelta: event.xpDelta,
        sourceType: event.sourceType,
        createdAt: event.createdAt,
      })),
    };
  }

  async getLeaderboard(userId: string, limit = 20) {
    const top = await this.prisma.gameProfile.findMany({
      orderBy: { xp: 'desc' },
      take: limit,
      include: { user: { select: { id: true, name: true, avatarUrl: true } } },
    });

    const entries = top.map((profile, index) => ({
      rank: index + 1,
      userId: profile.userId,
      name: profile.user.name,
      avatarUrl: profile.user.avatarUrl,
      xp: profile.xp,
      level: profile.level,
      isCurrentUser: profile.userId === userId,
    }));

    const me = entries.find((entry) => entry.isCurrentUser);
    let myRank = me?.rank ?? null;

    if (!me) {
      const myProfile = await this.getOrCreateProfile(this.prisma, userId);
      const higherCount = await this.prisma.gameProfile.count({
        where: { xp: { gt: myProfile.xp } },
      });
      myRank = higherCount + 1;
    }

    return { entries, myRank };
  }

  async getOrCreateProfile(client: Db, userId: string): Promise<GameProfile> {
    const existing = await client.gameProfile.findUnique({ where: { userId } });
    if (existing) return existing;

    // Uniqueness on userId makes this race-safe: a losing concurrent create
    // falls back to reading the row the winner created.
    try {
      return await client.gameProfile.create({ data: { userId } });
    } catch {
      return client.gameProfile.findUniqueOrThrow({ where: { userId } });
    }
  }

  /**
   * Award XP exactly once for a given idempotency key. Safe to call inside
   * the caller's own transaction (e.g. simulation completion) by passing the
   * transaction client instead of `this.prisma`. A retried call with the same
   * idempotencyKey returns the previously recorded outcome rather than
   * awarding XP again.
   */
  async awardXpOnce(client: Db, params: AwardXpParams): Promise<AwardXpResult> {
    const existingEvent = await client.activityEvent.findUnique({
      where: { idempotencyKey: params.idempotencyKey },
    });

    if (existingEvent) {
      const profile = await this.getOrCreateProfile(client, params.userId);
      return {
        created: false,
        xpDelta: existingEvent.xpDelta,
        totalXp: profile.xp,
        level: levelForXp(profile.xp).level,
      };
    }

    await client.activityEvent.create({
      data: {
        userId: params.userId,
        type: params.type,
        idempotencyKey: params.idempotencyKey,
        xpDelta: params.xpDelta,
        sourceType: params.sourceType,
        sourceId: params.sourceId,
        policyVersion: params.policyVersion,
        metadata: params.metadata as Prisma.InputJsonValue | undefined,
      },
    });

    await this.getOrCreateProfile(client, params.userId);
    const updated = await client.gameProfile.update({
      where: { userId: params.userId },
      data: {
        xp: { increment: params.xpDelta },
        lastActiveOn: new Date(),
      },
    });

    const { level } = levelForXp(updated.xp);
    if (level !== updated.level) {
      await client.gameProfile.update({
        where: { userId: params.userId },
        data: { level },
      });
    }

    return {
      created: true,
      xpDelta: params.xpDelta,
      totalXp: updated.xp,
      level,
    };
  }
}

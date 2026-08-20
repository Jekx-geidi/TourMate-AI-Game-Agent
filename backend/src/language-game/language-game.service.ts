import { Injectable, NotFoundException } from '@nestjs/common';
import type { GameAttempt, VocabWord } from '@prisma/client';
import { GamificationService } from '../gamification/gamification.service';
import { levelForXp } from '../gamification/xp-policy.util';
import { PrismaService } from '../prisma/prisma.service';
import {
  baseXpForDifficulty,
  LanguageGameMode,
  MAX_COMBO_MULTIPLIER,
  SupportedLanguageCode,
} from './language-game.constants';
import { scoreAnswer } from './language-game-scoring.util';
import { SubmitLanguageGameAnswerDto } from './dto/submit-language-game-answer.dto';

const XP_POLICY_VERSION = 'v1';

@Injectable()
export class LanguageGameService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gamification: GamificationService,
  ) {}

  /**
   * Returns a random word the requesting user did not just see (best-effort
   * anti-repeat), with only the fields needed for the requested mode's
   * prompt — the answer field is never sent to the client.
   */
  async getNextWord(userId: string, language: SupportedLanguageCode, mode: LanguageGameMode) {
    const total = await this.prisma.vocabWord.count({ where: { languageCode: language } });
    if (total === 0) {
      throw new NotFoundException(`No vocabulary is seeded for language "${language}" yet`);
    }

    const lastAttempt = await this.prisma.gameAttempt.findFirst({
      where: { userId, vocabWord: { languageCode: language } },
      orderBy: { createdAt: 'desc' },
      select: { vocabWordId: true },
    });

    const where =
      lastAttempt && total > 1
        ? { languageCode: language, id: { not: lastAttempt.vocabWordId } }
        : { languageCode: language };

    const eligibleCount = await this.prisma.vocabWord.count({ where });
    const skip = Math.floor(Math.random() * eligibleCount);
    const [word] = await this.prisma.vocabWord.findMany({ where, skip, take: 1 });

    return this.toPublicWord(word, mode);
  }

  private toPublicWord(word: VocabWord, mode: LanguageGameMode) {
    return {
      id: word.id,
      languageCode: word.languageCode,
      mode,
      category: word.category,
      difficulty: word.difficulty,
      prompt: mode === 'READING' ? word.script : word.promptEnglish,
      romanization: mode === 'READING' ? word.romanization : null,
    };
  }

  async submitAnswer(userId: string, dto: SubmitLanguageGameAnswerDto) {
    return this.prisma.$transaction(async (tx) => {
      const existingAttempt = await tx.gameAttempt.findUnique({
        where: { requestKey: dto.requestKey },
      });
      if (existingAttempt) {
        const word = await tx.vocabWord.findUniqueOrThrow({
          where: { id: existingAttempt.vocabWordId },
        });
        const profile = await this.gamification.getOrCreateProfile(tx, userId);
        return this.buildResult(existingAttempt, word, profile.xp, false);
      }

      const word = await tx.vocabWord.findUnique({ where: { id: dto.wordId } });
      if (!word) {
        throw new NotFoundException('Vocabulary word not found');
      }

      const acceptedAnswers =
        dto.mode === 'READING' ? (word.englishAnswers as string[]) : [word.script];
      const scored = scoreAnswer(dto.answer, acceptedAnswers);

      const lastAttempt = await tx.gameAttempt.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: { comboAtAnswer: true },
      });
      const previousCombo = lastAttempt?.comboAtAnswer ?? 0;
      const comboAtAnswer =
        scored.tier === 'WRONG' ? 0 : Math.min(previousCombo + 1, MAX_COMBO_MULTIPLIER);
      const comboMultiplier = Math.max(comboAtAnswer, 1);

      const xpAwarded = Math.round(
        baseXpForDifficulty(word.difficulty) * scored.tierXpMultiplier * comboMultiplier,
      );

      const attempt = await tx.gameAttempt.create({
        data: {
          userId,
          vocabWordId: word.id,
          mode: dto.mode,
          rawAnswer: dto.answer,
          normalizedAnswer: scored.normalizedAnswer,
          tier: scored.tier,
          similarity: scored.similarity,
          xpAwarded,
          comboAtAnswer,
          requestKey: dto.requestKey,
        },
      });

      let totalXp: number;
      if (xpAwarded > 0) {
        const xpResult = await this.gamification.awardXpOnce(tx, {
          userId,
          type: 'LANGUAGE_GAME_ANSWERED',
          idempotencyKey: `language_game_answer:${dto.requestKey}`,
          xpDelta: xpAwarded,
          sourceType: 'game_attempt',
          sourceId: attempt.id,
          policyVersion: XP_POLICY_VERSION,
          metadata: { mode: dto.mode, tier: scored.tier, wordId: word.id },
        });
        totalXp = xpResult.totalXp;
      } else {
        const profile = await this.gamification.getOrCreateProfile(tx, userId);
        totalXp = profile.xp;
      }

      return this.buildResult(attempt, word, totalXp, true);
    });
  }

  /**
   * Recent non-perfect attempts for the "Mistake Review" progress feature
   * (docs pasted 2026-08-20 section 8) -- lets a learner revisit exactly
   * what they got wrong, not just an aggregate score.
   */
  async getMistakes(userId: string, limit = 20) {
    const attempts = await this.prisma.gameAttempt.findMany({
      where: { userId, tier: { not: 'PERFECT' } },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { vocabWord: true },
    });

    return {
      mistakes: attempts.map((attempt) => ({
        attemptId: attempt.id,
        mode: attempt.mode,
        tier: attempt.tier,
        yourAnswer: attempt.rawAnswer,
        prompt: attempt.mode === 'READING' ? attempt.vocabWord.script : attempt.vocabWord.promptEnglish,
        correctAnswer:
          attempt.mode === 'READING'
            ? (attempt.vocabWord.englishAnswers as string[])[0]
            : attempt.vocabWord.script,
        romanization: attempt.vocabWord.romanization,
        createdAt: attempt.createdAt,
      })),
    };
  }

  private buildResult(
    attempt: GameAttempt,
    word: VocabWord,
    totalXp: number,
    created: boolean,
  ) {
    return {
      attemptId: attempt.id,
      created,
      tier: attempt.tier,
      similarity: attempt.similarity,
      xpAwarded: attempt.xpAwarded,
      comboAtAnswer: attempt.comboAtAnswer,
      correctAnswer: attempt.mode === 'READING' ? (word.englishAnswers as string[])[0] : word.script,
      romanization: attempt.mode === 'READING' ? word.romanization : null,
      totalXp,
      level: levelForXp(totalXp).level,
    };
  }
}

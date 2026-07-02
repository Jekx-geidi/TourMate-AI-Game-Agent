import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProgressDto } from './dto/update-progress.dto';

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.progress.findMany({
      where: { userId },
      include: { subject: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  update(userId: string, dto: UpdateProgressDto) {
    return this.prisma.progress.upsert({
      where: {
        userId_subjectId_category: {
          userId,
          subjectId: dto.subjectId,
          category: dto.category,
        },
      },
      update: {
        percent: dto.percent,
      },
      create: {
        userId,
        subjectId: dto.subjectId,
        category: dto.category,
        percent: dto.percent,
      },
      include: { subject: true },
    });
  }

  async summary(userId: string) {
    const [progress, notes, quizResults, allUserQuizResults] =
      await Promise.all([
        this.prisma.progress.findMany({
          where: { userId, category: 'overall' },
          include: { subject: true },
          orderBy: { updatedAt: 'desc' },
        }),
        this.prisma.note.findMany({
          where: { userId },
          include: { subject: true },
          orderBy: { updatedAt: 'desc' },
          take: 5,
        }),
        this.prisma.quizResult.findMany({
          where: { userId },
          include: { quiz: { include: { subject: true } } },
          orderBy: { createdAt: 'desc' },
          take: 5,
        }),
        this.prisma.quizResult.findMany({
          where: { userId },
        }),
      ]);

    const totalNotes = notes.length;
    const quizAverage =
      allUserQuizResults.length === 0
        ? 0
        : Math.round(
            (allUserQuizResults.reduce(
              (sum, result) => sum + (result.score / result.total) * 100,
              0,
            ) /
              allUserQuizResults.length) *
              10,
          ) / 10;
    const overallProgress =
      progress.length === 0
        ? 0
        : Math.round(
            progress.reduce((sum, item) => sum + item.percent, 0) /
              progress.length,
          );

    return {
      studyStreak: Math.max(2, Math.min(12, progress.length + notes.length)),
      totalNotes,
      quizAverage,
      overallProgress,
      subjectProgress: progress,
      recentNotes: notes,
      recentQuizResults: quizResults,
      recommendedActivity:
        overallProgress < 50
          ? 'Try one short lesson and a quick review quiz today.'
          : 'You are doing well. Want a challenge quiz or a flashcard sprint?',
    };
  }
}

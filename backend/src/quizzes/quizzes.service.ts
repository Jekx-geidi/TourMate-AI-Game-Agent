import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { getEncouragingMessage } from '../common/utils/study-message.util';
import { SubmitQuizDto } from './dto/submit-quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(private readonly prisma: PrismaService) {}

  findBySubject(subjectId: string) {
    return this.prisma.quiz.findMany({
      where: { subjectId },
      include: {
        questions: true,
      },
    });
  }

  async findOne(quizId: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        subject: true,
        questions: true,
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found.');
    }

    return quiz;
  }

  async submit(userId: string, quizId: string, dto: SubmitQuizDto) {
    const quiz = await this.findOne(quizId);
    const answerMap = new Map(
      dto.answers.map((answer) => [answer.questionId, answer.answer]),
    );

    const results = quiz.questions.map((question) => {
      const studentAnswer = answerMap.get(question.id) ?? '';
      const isCorrect = studentAnswer === question.answer;

      return {
        questionId: question.id,
        question: question.question,
        selectedAnswer: studentAnswer,
        correctAnswer: question.answer,
        isCorrect,
        explanation: question.explanation,
        options: {
          A: question.optionA,
          B: question.optionB,
          C: question.optionC,
          D: question.optionD,
        },
      };
    });

    const score = results.filter((result) => result.isCorrect).length;
    const total = quiz.questions.length;
    const percentage = total === 0 ? 0 : Math.round((score / total) * 100);

    await this.prisma.quizResult.create({
      data: {
        userId,
        quizId,
        score,
        total,
      },
    });

    await this.prisma.progress.upsert({
      where: {
        userId_subjectId_category: {
          userId,
          subjectId: dto.subjectId,
          category: 'overall',
        },
      },
      update: {
        percent: Math.min(100, percentage),
      },
      create: {
        userId,
        subjectId: dto.subjectId,
        category: 'overall',
        percent: Math.min(100, percentage),
      },
    });

    return {
      score,
      total,
      percentage,
      message: getEncouragingMessage(score, total),
      results,
    };
  }
}

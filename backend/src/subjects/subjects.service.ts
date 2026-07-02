import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.subject.findMany({
      orderBy: { code: 'asc' },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
          take: 1,
        },
        quizzes: true,
        flashcards: true,
      },
    });
  }

  async findOne(id: string) {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
      include: {
        lessons: { orderBy: { order: 'asc' } },
        quizzes: {
          include: {
            questions: true,
          },
        },
        flashcards: true,
      },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found.');
    }

    return subject;
  }

  async findByCode(code: string) {
    const subject = await this.prisma.subject.findUnique({
      where: { code },
      include: {
        lessons: { orderBy: { order: 'asc' } },
        quizzes: true,
        flashcards: true,
      },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found.');
    }

    return subject;
  }

  async findLessons(id: string) {
    await this.ensureSubject(id);

    return this.prisma.lesson.findMany({
      where: { subjectId: id },
      orderBy: { order: 'asc' },
    });
  }

  private async ensureSubject(id: string) {
    const exists = await this.prisma.subject.findUnique({ where: { id } });

    if (!exists) {
      throw new NotFoundException('Subject not found.');
    }
  }
}

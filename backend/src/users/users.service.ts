import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        notes: {
          orderBy: { updatedAt: 'desc' },
          take: 5,
          include: { subject: true },
        },
        quizResults: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: { quiz: { include: { subject: true } } },
        },
        progress: {
          orderBy: { updatedAt: 'desc' },
          include: { subject: true },
        },
      },
    });
  }

  create(data: { name: string; email: string; password: string }) {
    return this.prisma.user.create({ data });
  }
}

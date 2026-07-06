import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

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

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Please log in again to continue.');
    }

    const data: { name?: string; email?: string; password?: string } = {};

    if (dto.name && dto.name !== user.name) {
      data.name = dto.name;
    }

    if (dto.email && dto.email !== user.email) {
      const existing = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (existing) {
        throw new BadRequestException('That email is already in use.');
      }
      data.email = dto.email;
    }

    if (dto.newPassword) {
      if (!dto.currentPassword) {
        throw new BadRequestException(
          'Enter your current password to set a new one.',
        );
      }
      const matches = await bcrypt.compare(dto.currentPassword, user.password);
      if (!matches) {
        throw new BadRequestException('Your current password is not correct.');
      }
      data.password = await bcrypt.hash(dto.newPassword, 10);
    }

    if (Object.keys(data).length === 0) {
      return { id: user.id, name: user.name, email: user.email };
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data,
    });

    return { id: updated.id, name: updated.name, email: updated.email };
  }
}

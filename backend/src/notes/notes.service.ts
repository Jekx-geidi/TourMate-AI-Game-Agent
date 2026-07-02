import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string, filters?: { subjectId?: string; search?: string }) {
    return this.prisma.note.findMany({
      where: {
        userId,
        subjectId: filters?.subjectId,
        OR: filters?.search
          ? [
              { title: { contains: filters.search, mode: 'insensitive' } },
              { content: { contains: filters.search, mode: 'insensitive' } },
            ]
          : undefined,
      },
      orderBy: { updatedAt: 'desc' },
      include: { subject: true },
    });
  }

  create(userId: string, dto: CreateNoteDto) {
    return this.prisma.note.create({
      data: {
        ...dto,
        userId,
      },
      include: { subject: true },
    });
  }

  async update(userId: string, id: string, dto: UpdateNoteDto) {
    const note = await this.prisma.note.findUnique({ where: { id } });
    this.assertOwnership(note, userId);

    return this.prisma.note.update({
      where: { id },
      data: dto,
      include: { subject: true },
    });
  }

  async remove(userId: string, id: string) {
    const note = await this.prisma.note.findUnique({ where: { id } });
    this.assertOwnership(note, userId);

    await this.prisma.note.delete({ where: { id } });
    return { message: 'Note deleted successfully.' };
  }

  private assertOwnership(
    note: { id: string; userId: string } | null,
    userId: string,
  ) {
    if (!note) {
      throw new NotFoundException('Note not found.');
    }

    if (note.userId !== userId) {
      throw new ForbiddenException('You cannot access another student’s note.');
    }
  }
}

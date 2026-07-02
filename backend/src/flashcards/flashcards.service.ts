import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { UpdateFlashcardDto } from './dto/update-flashcard.dto';

@Injectable()
export class FlashcardsService {
  constructor(private readonly prisma: PrismaService) {}

  findBySubject(subjectId: string) {
    return this.prisma.flashcard.findMany({
      where: { subjectId },
      orderBy: { createdAt: 'asc' },
    });
  }

  create(dto: CreateFlashcardDto) {
    return this.prisma.flashcard.create({ data: dto });
  }

  async update(id: string, dto: UpdateFlashcardDto) {
    await this.ensureFlashcard(id);
    return this.prisma.flashcard.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.ensureFlashcard(id);
    await this.prisma.flashcard.delete({ where: { id } });
    return { message: 'Flashcard deleted successfully.' };
  }

  private async ensureFlashcard(id: string) {
    const flashcard = await this.prisma.flashcard.findUnique({ where: { id } });
    if (!flashcard) {
      throw new NotFoundException('Flashcard not found.');
    }
  }
}

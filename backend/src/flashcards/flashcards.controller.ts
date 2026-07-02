import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { UpdateFlashcardDto } from './dto/update-flashcard.dto';
import { FlashcardsService } from './flashcards.service';

@Controller('flashcards')
export class FlashcardsController {
  constructor(private readonly flashcardsService: FlashcardsService) {}

  @Get('subject/:subjectId')
  findBySubject(@Param('subjectId') subjectId: string) {
    return this.flashcardsService.findBySubject(subjectId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateFlashcardDto) {
    return this.flashcardsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFlashcardDto) {
    return this.flashcardsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.flashcardsService.remove(id);
  }
}

import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AiService } from './ai.service';
import { ChatDto } from './dto/chat.dto';
import { GenerateContentDto } from './dto/generate-content.dto';

@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  chat(@CurrentUser() user: { sub: string }, @Body() dto: ChatDto) {
    return this.aiService.chat(user.sub, dto);
  }

  @Post('generate-quiz')
  generateQuiz(
    @CurrentUser() user: { sub: string },
    @Body() dto: GenerateContentDto,
  ) {
    return this.aiService.generateQuiz(user.sub, dto);
  }

  @Post('generate-notes')
  generateNotes(
    @CurrentUser() user: { sub: string },
    @Body() dto: GenerateContentDto,
  ) {
    return this.aiService.generateNotes(user.sub, dto);
  }

  @Post('generate-flashcards')
  generateFlashcards(
    @CurrentUser() user: { sub: string },
    @Body() dto: GenerateContentDto,
  ) {
    return this.aiService.generateFlashcards(user.sub, dto);
  }

  @Post('study-plan')
  studyPlan(
    @CurrentUser() user: { sub: string },
    @Body() dto: GenerateContentDto,
  ) {
    return this.aiService.studyPlan(user.sub, dto);
  }
}

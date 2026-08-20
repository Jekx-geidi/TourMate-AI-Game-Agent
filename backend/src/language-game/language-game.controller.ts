import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { NextWordQueryDto } from './dto/next-word-query.dto';
import { SubmitLanguageGameAnswerDto } from './dto/submit-language-game-answer.dto';
import { LanguageGameService } from './language-game.service';

@UseGuards(JwtAuthGuard)
@Controller('language-games')
export class LanguageGameController {
  constructor(private readonly languageGameService: LanguageGameService) {}

  @Get('words/next')
  getNextWord(@CurrentUser() user: { sub: string }, @Query() query: NextWordQueryDto) {
    return this.languageGameService.getNextWord(user.sub, query.language, query.mode);
  }

  @Post('answers')
  submitAnswer(
    @CurrentUser() user: { sub: string },
    @Body() dto: SubmitLanguageGameAnswerDto,
  ) {
    return this.languageGameService.submitAnswer(user.sub, dto);
  }

  @Get('mistakes')
  getMistakes(@CurrentUser() user: { sub: string }) {
    return this.languageGameService.getMistakes(user.sub);
  }
}

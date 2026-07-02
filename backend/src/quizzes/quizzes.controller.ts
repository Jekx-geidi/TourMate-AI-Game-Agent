import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { QuizzesService } from './quizzes.service';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get('subject/:subjectId')
  findBySubject(@Param('subjectId') subjectId: string) {
    return this.quizzesService.findBySubject(subjectId);
  }

  @Get(':quizId')
  findOne(@Param('quizId') quizId: string) {
    return this.quizzesService.findOne(quizId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':quizId/submit')
  submit(
    @CurrentUser() user: { sub: string },
    @Param('quizId') quizId: string,
    @Body() dto: SubmitQuizDto,
  ) {
    return this.quizzesService.submit(user.sub, quizId, dto);
  }
}

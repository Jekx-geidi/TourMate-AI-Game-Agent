import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AgentService } from './agent.service';

@UseGuards(JwtAuthGuard)
@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Get('status')
  status(@CurrentUser() user: { sub: string }) {
    return this.agentService.status(user.sub);
  }

  @Post('chat')
  chat(
    @CurrentUser() user: { sub: string },
    @Body() body: { message: string; subjectCode?: string; subjectId?: string },
  ) {
    return this.agentService.chat(user.sub, body);
  }

  @Post('study-review')
  studyReview(
    @CurrentUser() user: { sub: string },
    @Body() body: { message: string; subjectCode?: string },
  ) {
    return this.agentService.studyReview(user.sub, body);
  }
}

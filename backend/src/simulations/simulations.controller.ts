import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ListSimulationsQueryDto } from './dto/list-simulations-query.dto';
import { StartSimulationSessionDto } from './dto/start-simulation-session.dto';
import { SubmitSimulationAnswerDto } from './dto/submit-simulation-answer.dto';
import { SimulationSessionsService } from './simulation-sessions.service';
import { SimulationsService } from './simulations.service';

@UseGuards(JwtAuthGuard)
@Controller()
export class SimulationsController {
  constructor(
    private readonly simulationsService: SimulationsService,
    private readonly sessionsService: SimulationSessionsService,
  ) {}

  @Get('simulations')
  list(
    @CurrentUser() user: { sub: string },
    @Query() query: ListSimulationsQueryDto,
  ) {
    return this.simulationsService.listPublished(user.sub, query);
  }

  @Get('simulations/:slug')
  getBySlug(@CurrentUser() user: { sub: string }, @Param('slug') slug: string) {
    return this.simulationsService.getBySlug(user.sub, slug);
  }

  @Post('simulations/:slug/sessions')
  startSession(
    @CurrentUser() user: { sub: string },
    @Param('slug') slug: string,
    @Body() dto: StartSimulationSessionDto,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    return this.sessionsService.startSession(
      user.sub,
      slug,
      dto.version,
      idempotencyKey,
    );
  }

  @Get('simulation-sessions/:sessionId')
  getSession(
    @CurrentUser() user: { sub: string },
    @Param('sessionId') sessionId: string,
  ) {
    return this.sessionsService.getOwnedSession(user.sub, sessionId);
  }

  @Post('simulation-sessions/:sessionId/answers')
  submitAnswer(
    @CurrentUser() user: { sub: string },
    @Param('sessionId') sessionId: string,
    @Body() dto: SubmitSimulationAnswerDto,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    return this.sessionsService.submitAnswer(
      user.sub,
      sessionId,
      dto,
      idempotencyKey,
    );
  }

  @Post('simulation-sessions/:sessionId/complete')
  complete(
    @CurrentUser() user: { sub: string },
    @Param('sessionId') sessionId: string,
  ) {
    return this.sessionsService.completeSession(user.sub, sessionId);
  }

  @Get('simulation-sessions/:sessionId/result')
  getResult(
    @CurrentUser() user: { sub: string },
    @Param('sessionId') sessionId: string,
  ) {
    return this.sessionsService.getResult(user.sub, sessionId);
  }
}

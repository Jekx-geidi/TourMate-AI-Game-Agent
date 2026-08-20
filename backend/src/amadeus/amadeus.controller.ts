import { Body, Controller, Get, Headers, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AmadeusService } from './amadeus.service';
import { ListScenariosQueryDto } from './dto/list-scenarios-query.dto';
import { SubmitCommandDto } from './dto/submit-command.dto';

@UseGuards(JwtAuthGuard)
@Controller('amadeus')
export class AmadeusController {
  constructor(private readonly amadeusService: AmadeusService) {}

  @Get('scenarios')
  list(@Query() query: ListScenariosQueryDto) {
    return this.amadeusService.listScenarios(query.difficulty);
  }

  @Get('scenarios/:slug')
  getBySlug(@Param('slug') slug: string) {
    return this.amadeusService.getScenarioBySlug(slug);
  }

  @Post('scenarios/:slug/sessions')
  startSession(
    @CurrentUser() user: { sub: string },
    @Param('slug') slug: string,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    return this.amadeusService.startSession(user.sub, slug, idempotencyKey);
  }

  @Get('sessions/:sessionId')
  getSession(@CurrentUser() user: { sub: string }, @Param('sessionId') sessionId: string) {
    return this.amadeusService.getOwnedSession(user.sub, sessionId);
  }

  @Post('sessions/:sessionId/commands')
  submitCommand(
    @CurrentUser() user: { sub: string },
    @Param('sessionId') sessionId: string,
    @Body() dto: SubmitCommandDto,
  ) {
    return this.amadeusService.submitCommand(user.sub, sessionId, dto);
  }
}

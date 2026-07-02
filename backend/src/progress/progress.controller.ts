import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { ProgressService } from './progress.service';

@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  findAll(@CurrentUser() user: { sub: string }) {
    return this.progressService.findAll(user.sub);
  }

  @Post('update')
  update(@CurrentUser() user: { sub: string }, @Body() dto: UpdateProgressDto) {
    return this.progressService.update(user.sub, dto);
  }

  @Get('summary')
  summary(@CurrentUser() user: { sub: string }) {
    return this.progressService.summary(user.sub);
  }
}

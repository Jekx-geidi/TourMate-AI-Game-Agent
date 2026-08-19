import { Module } from '@nestjs/common';
import { GamificationModule } from '../gamification/gamification.module';
import { SimulationCoachService } from './simulation-coach.service';
import { SimulationScoringService } from './simulation-scoring.service';
import { SimulationSessionsService } from './simulation-sessions.service';
import { SimulationsController } from './simulations.controller';
import { SimulationsService } from './simulations.service';

@Module({
  imports: [GamificationModule],
  controllers: [SimulationsController],
  providers: [
    SimulationsService,
    SimulationSessionsService,
    SimulationScoringService,
    SimulationCoachService,
  ],
  exports: [SimulationsService, SimulationSessionsService],
})
export class SimulationsModule {}

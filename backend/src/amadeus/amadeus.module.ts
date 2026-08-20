import { Module } from '@nestjs/common';
import { GamificationModule } from '../gamification/gamification.module';
import { AmadeusController } from './amadeus.controller';
import { AmadeusService } from './amadeus.service';

@Module({
  imports: [GamificationModule],
  controllers: [AmadeusController],
  providers: [AmadeusService],
  exports: [AmadeusService],
})
export class AmadeusModule {}

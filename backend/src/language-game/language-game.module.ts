import { Module } from '@nestjs/common';
import { GamificationModule } from '../gamification/gamification.module';
import { LanguageGameController } from './language-game.controller';
import { LanguageGameService } from './language-game.service';

@Module({
  imports: [GamificationModule],
  controllers: [LanguageGameController],
  providers: [LanguageGameService],
  exports: [LanguageGameService],
})
export class LanguageGameModule {}

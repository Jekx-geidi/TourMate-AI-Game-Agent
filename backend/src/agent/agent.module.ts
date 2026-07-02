import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';

@Module({
  imports: [AiModule],
  controllers: [AgentController],
  providers: [AgentService],
})
export class AgentModule {}

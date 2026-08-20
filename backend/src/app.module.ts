import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AgentModule } from './agent/agent.module';
import { AiModule } from './ai/ai.module';
import { AmadeusModule } from './amadeus/amadeus.module';
import { AuthModule } from './auth/auth.module';
import { FlashcardsModule } from './flashcards/flashcards.module';
import { GamificationModule } from './gamification/gamification.module';
import { LanguageGameModule } from './language-game/language-game.module';
import { LessonsModule } from './lessons/lessons.module';
import { NotesModule } from './notes/notes.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProgressModule } from './progress/progress.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { SimulationsModule } from './simulations/simulations.module';
import { SubjectsModule } from './subjects/subjects.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    SubjectsModule,
    LessonsModule,
    NotesModule,
    QuizzesModule,
    FlashcardsModule,
    ProgressModule,
    AiModule,
    AgentModule,
    GamificationModule,
    SimulationsModule,
    LanguageGameModule,
    AmadeusModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

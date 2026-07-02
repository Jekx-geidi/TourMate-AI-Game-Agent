import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AgentModule } from './agent/agent.module';
import { AiModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
import { FlashcardsModule } from './flashcards/flashcards.module';
import { LessonsModule } from './lessons/lessons.module';
import { NotesModule } from './notes/notes.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProgressModule } from './progress/progress.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { SubjectsModule } from './subjects/subjects.module';
import { UsersModule } from './users/users.module';

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
  ],
})
export class AppModule {}

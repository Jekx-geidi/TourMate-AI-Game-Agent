import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AgentService {
  constructor(
    private readonly aiService: AiService,
    private readonly prisma: PrismaService,
  ) {}

  async status(userId: string) {
    const [providerStatus, studyActivity] = await Promise.all([
      this.aiService.getStatus(),
      this.prisma.chatLog.count({ where: { userId } }),
    ]);

    return {
      ...providerStatus,
      studyActivitySummary: `You have ${studyActivity} AI study interaction${studyActivity === 1 ? '' : 's'} so far.`,
    };
  }

  chat(
    userId: string,
    body: { message: string; subjectCode?: string; subjectId?: string },
  ) {
    return this.aiService.chat(userId, body);
  }

  async studyReview(
    userId: string,
    body: { message: string; subjectCode?: string },
  ) {
    const response = await this.aiService.studyPlan(userId, {
      prompt: `Create a review and next-step study suggestion for: ${body.message}`,
      subjectCode: body.subjectCode,
    });

    return {
      ...response,
      summary:
        'How are your studies today? Here is a short review and a next action you can try.',
    };
  }
}

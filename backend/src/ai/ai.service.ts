import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import { ChatDto } from './dto/chat.dto';
import { GenerateContentDto } from './dto/generate-content.dto';

const TOURMATE_SYSTEM_PROMPT = `You are TourMate AI, a warm and hospitable study companion for BS Tourism Management students.
Speak in simple, friendly, encouraging English.
Help the student understand Tourism, Airline Management, MICE, Foreign Language, PE, and Tourism Elective subjects.
Always support the student emotionally and academically.
Ask how their studies are going, what they achieved today, and what they want to improve.
Never shame the student.
Never encourage cheating or academic dishonesty.
Explain difficult concepts using examples from tourism, hotels, airlines, events, maps, countries, destinations, customer service, and real-life travel situations.
When the student asks for answers, explain the reasoning so they can learn.
When useful, offer a short quiz or flashcard review.
Keep explanations clear and beginner-friendly.`;

type ProviderName = 'hermes' | 'openrouter' | 'local';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private lastProvider: ProviderName = 'local';
  private lastCheckedAt: string | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async chat(userId: string, dto: ChatDto) {
    const { reply, provider } = await this.askProvider(
      dto.message,
      dto.subjectCode,
      'chat',
    );

    await this.prisma.chatLog.create({
      data: {
        userId,
        subjectId: dto.subjectId ?? null,
        message: dto.message,
        reply,
        provider,
      },
    });

    return {
      reply,
      provider,
    };
  }

  async generateQuiz(_userId: string, dto: GenerateContentDto) {
    const { reply, provider } = await this.askProvider(
      `Create 5 short multiple choice quiz questions based on this study content:\n${dto.prompt}`,
      dto.subjectCode,
      'generate-quiz',
    );

    return { reply, provider };
  }

  async generateNotes(_userId: string, dto: GenerateContentDto) {
    const { reply, provider } = await this.askProvider(
      `Summarize this study content into simple review notes:\n${dto.prompt}`,
      dto.subjectCode,
      'generate-notes',
    );

    return { reply, provider };
  }

  async generateFlashcards(_userId: string, dto: GenerateContentDto) {
    const { reply, provider } = await this.askProvider(
      `Turn this study content into 5 short flashcards with a front and back:\n${dto.prompt}`,
      dto.subjectCode,
      'generate-flashcards',
    );

    return { reply, provider };
  }

  async studyPlan(_userId: string, dto: GenerateContentDto) {
    const { reply, provider } = await this.askProvider(
      `Create a short study plan for this topic:\n${dto.prompt}`,
      dto.subjectCode,
      'study-plan',
    );

    return { reply, provider };
  }

  async getStatus() {
    const hermesUrl = this.configService.get<string>('HERMES_AGENT_URL');
    const openRouterKey = this.configService.get<string>('OPENROUTER_API_KEY');

    let hermesConnected = false;
    const openRouterReady = Boolean(openRouterKey);

    if (hermesUrl) {
      try {
        await axios.get(hermesUrl, { timeout: 3000 });
        hermesConnected = true;
      } catch {
        hermesConnected = false;
      }
    }

    return {
      hermesStatus: hermesConnected ? 'connected' : 'not_connected',
      openRouterStatus: openRouterReady ? 'ready' : 'not_configured',
      currentProvider: hermesConnected
        ? 'hermes'
        : openRouterReady
          ? 'openrouter'
          : 'local',
      lastCheckedTime: this.lastCheckedAt,
      lastAiResponseProvider: this.lastProvider,
      message: hermesConnected
        ? 'Hermes Agent is connected. TourMate AI will use Hermes first.'
        : 'Hermes Agent is not connected yet. TourMate AI is using OpenRouter fallback.',
    };
  }

  private async askProvider(
    message: string,
    subjectCode?: string,
    mode:
      | 'chat'
      | 'generate-quiz'
      | 'generate-notes'
      | 'generate-flashcards'
      | 'study-plan' = 'chat',
  ) {
    const hermesUrl = this.configService.get<string>('HERMES_AGENT_URL');
    const openRouterKey = this.configService.get<string>('OPENROUTER_API_KEY');

    this.lastCheckedAt = new Date().toISOString();

    if (hermesUrl) {
      try {
        const hermesResponse = await axios.post(
          hermesUrl,
          {
            systemPrompt: TOURMATE_SYSTEM_PROMPT,
            message,
            subjectCode,
            mode,
          },
          { timeout: 10000 },
        );

        const reply = this.normalizeReply(hermesResponse.data);
        this.lastProvider = 'hermes';
        return { reply, provider: 'hermes' as const };
      } catch (error) {
        this.logger.warn(
          `Hermes request failed, falling back: ${String(error)}`,
        );
      }
    }

    if (openRouterKey) {
      try {
        const response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model:
              this.configService.get<string>('OPENROUTER_MODEL') ??
              'openai/gpt-4o-mini',
            messages: [
              { role: 'system', content: TOURMATE_SYSTEM_PROMPT },
              {
                role: 'user',
                content: `Subject: ${subjectCode ?? 'General Tourism Study'}\n${message}`,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${openRouterKey}`,
              'HTTP-Referer':
                this.configService.get<string>('OPENROUTER_SITE_URL') ??
                'http://localhost:5173',
              'X-Title':
                this.configService.get<string>('OPENROUTER_APP_NAME') ??
                'TourMate AI',
            },
            timeout: 15000,
          },
        );

        const reply =
          response.data?.choices?.[0]?.message?.content ??
          this.localFallback(message, subjectCode, mode);
        this.lastProvider = 'openrouter';
        return { reply, provider: 'openrouter' as const };
      } catch (error) {
        this.logger.warn(
          `OpenRouter request failed, using local fallback: ${String(error)}`,
        );
      }
    }

    const reply = this.localFallback(message, subjectCode, mode);
    this.lastProvider = 'local';
    return { reply, provider: 'local' as const };
  }

  private normalizeReply(payload: unknown) {
    if (typeof payload === 'string') {
      return payload;
    }

    if (payload && typeof payload === 'object') {
      const candidate = payload as Record<string, unknown>;
      return (
        (typeof candidate.reply === 'string' && candidate.reply) ||
        (typeof candidate.message === 'string' && candidate.message) ||
        JSON.stringify(candidate)
      );
    }

    return 'How are your studies today? I can help you review the topic step by step.';
  }

  private localFallback(message: string, subjectCode?: string, mode?: string) {
    const intros: Record<string, string> = {
      NMICE:
        'MICE means Meetings, Incentives, Conferences, and Exhibitions. It is a tourism segment built around organized business events.',
      AIRMGT:
        'Airline Management focuses on airline operations, passenger service, safety, and airport coordination.',
      FOLA01:
        'Foreign Language 1 helps tourism students communicate warmly with guests using simple practical phrases.',
      TMEL03:
        'Tourism Elective 3 highlights sustainable tourism, ecotourism, and responsible destination growth.',
      TMEL04:
        'Tourism Elective 4 explores heritage, culture, innovation, and tourism product development.',
      TMEL02:
        'Tourism Elective 2 focuses on marketing, itineraries, travel agencies, and customer service.',
      PAFIT3:
        'PAFIT3 supports wellness, safety, and healthy routines that help students stay energized.',
    };

    const base =
      intros[subjectCode ?? ''] ??
      'TourMate AI is ready to help you study tourism topics in a simple and encouraging way.';

    if (mode === 'generate-quiz') {
      return `${base}\n\nQuick quiz idea:\n1. What is the main idea of this topic?\n2. Why does it matter in tourism practice?\n3. Give one real-life example.\n4. What key term should you remember?\n5. How would you explain it to a classmate?`;
    }

    if (mode === 'generate-flashcards') {
      return `${base}\n\nFlashcard format:\n- Front: Main concept\n  Back: Simple meaning\n- Front: Key example\n  Back: Why it matters\n- Front: Important term\n  Back: Clear definition`;
    }

    if (mode === 'study-plan') {
      return `${base}\n\nStudy plan:\n1. Read one short lesson.\n2. Write three key terms.\n3. Answer one practice question.\n4. Review with flashcards.\n5. End with one reflection: What did you achieve today?`;
    }

    if (mode === 'generate-notes') {
      return `${base}\n\nSimple review notes:\n- Main idea: ${message.slice(0, 120)}\n- Key term: Focus on the core definition.\n- Real-life use: Connect it to tourism service, travel, events, or hospitality.\n- Quick review question: How would you explain this in simple words?`;
    }

    return `${base}\n\nHere is a simple explanation based on your question: ${message}\n\nStart with the main definition, then connect it to a real tourism situation. How are your studies today, and do you want a quick review or a challenge quiz next?`;
  }
}

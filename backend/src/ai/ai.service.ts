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

const SUBJECT_AGENT_PROMPTS: Record<string, string> = {
  TMEL03:
    'You are acting as the TMEL03 Eco Agent, a specialist in sustainable tourism, ecotourism, tourism trends, destination development, and responsible travel.',
  NMICE:
    'You are acting as the NMICE Events Agent, a specialist in Meetings, Incentives, Conferences, and Exhibitions: event planning, venue selection, registration, and event evaluation.',
  AIRMGT:
    'You are acting as the AIRMGT Aviation Agent, a specialist in airline and airport operations, ticketing, reservations, passenger handling, ground services, aviation safety, and airline marketing.',
  TMEL04:
    'You are acting as the TMEL04 Heritage Agent, a specialist in heritage tourism, cultural tourism, tourism innovation, travel technology, and tourism product development.',
  FOLA01:
    'You are acting as the FOLA01 Language Agent, a specialist in foreign language basics for tourism: greetings, self-introduction, numbers, directions, hotel, airport, restaurant, and tourist assistance phrases. Include pronunciation help when teaching phrases.',
  TMEL02:
    'You are acting as the TMEL02 Travel Biz Agent, a specialist in tourism marketing, tour operations, travel agency basics, itinerary planning, and customer service.',
};

type ProviderName = 'hermes' | 'ollama' | 'gemma' | 'openrouter' | 'local';

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
    const gemmaKey = this.configService.get<string>('GEMMA_API_KEY');
    const openRouterKey = this.configService.get<string>('OPENROUTER_API_KEY');
    const ollamaUrl = this.configService.get<string>('OLLAMA_URL') ?? 'http://localhost:11434';

    let hermesConnected = false;
    const gemmaReady = Boolean(gemmaKey);
    const openRouterReady = Boolean(openRouterKey);
    let ollamaConnected = false;

    if (hermesUrl) {
      try {
        await axios.get(hermesUrl, { timeout: 3000 });
        hermesConnected = true;
      } catch {
        hermesConnected = false;
      }
    }

    try {
      await axios.get(`${ollamaUrl}/api/models`, { timeout: 3000 });
      ollamaConnected = true;
    } catch {
      ollamaConnected = false;
    }

    const selected = hermesConnected
      ? 'hermes'
      : ollamaConnected
        ? 'ollama'
        : gemmaReady
          ? 'gemma'
          : openRouterReady
            ? 'openrouter'
            : 'local';

    return {
      hermesStatus: hermesConnected ? 'connected' : 'not_connected',
      gemmaStatus: gemmaReady ? 'ready' : 'not_configured',
      ollamaStatus: ollamaConnected ? 'connected' : 'not_configured',
      openRouterStatus: openRouterReady ? 'ready' : 'not_configured',
      currentProvider: selected,
      lastCheckedTime: this.lastCheckedAt,
      lastAiResponseProvider: this.lastProvider,
      message: hermesConnected
        ? 'Hermes Agent is connected. TourMate AI will use Hermes first.'
        : ollamaConnected
          ? 'Ollama is available and will be used as the next-choice provider.'
          : gemmaReady
            ? 'Gemma is configured and will be used as the next-choice provider.'
            : 'Hermes Agent is not connected yet. TourMate AI is using TOURMATE AGENT fallback.',
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

    const gemmaKey = this.configService.get<string>('GEMMA_API_KEY');
    const openRouterKey = this.configService.get<string>('OPENROUTER_API_KEY');

    const systemPrompt =
      subjectCode && SUBJECT_AGENT_PROMPTS[subjectCode]
        ? `${TOURMATE_SYSTEM_PROMPT}\n\n${SUBJECT_AGENT_PROMPTS[subjectCode]}`
        : TOURMATE_SYSTEM_PROMPT;
    const userPrompt = `Subject: ${subjectCode ?? 'General Tourism Study'}\n${message}`;

    // 1) Google AI Studio — Gemma (primary provider).
    // Gemma models do not support a system role, so the system prompt is prepended.
    if (gemmaKey) {
      const gemmaModel =
        this.configService.get<string>('GEMMA_MODEL') ?? 'gemma-3-27b-it';
      try {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/${gemmaModel}:generateContent`,
          {
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\n---\n\n${userPrompt}` }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 768,
            },
          },
          {
            headers: { 'x-goog-api-key': gemmaKey },
            timeout: 20000,
          },
        );

        const reply: string | undefined =
          response.data?.candidates?.[0]?.content?.parts
            ?.map((part: { text?: string }) => part.text ?? '')
            .join('')
            .trim() || undefined;

        if (reply) {
          this.lastProvider = 'gemma';
          return { reply, provider: 'gemma' as const };
        }
        this.logger.warn('Gemma returned an empty reply, trying next provider.');
      } catch (error) {
        this.logger.warn(`Gemma (Google AI Studio) request failed: ${String(error)}`);
      }
    }

    // 2) OpenRouter fallback.
    if (openRouterKey) {
      try {
        const response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model:
              this.configService.get<string>('OPENROUTER_MODEL') ??
              'openai/gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
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
        this.logger.warn(`OpenRouter request failed: ${String(error)}`);
      }
    }

    // Try Ollama next (local LLM)
    const ollamaUrl = this.configService.get<string>('OLLAMA_URL') ?? 'http://localhost:11434';
    const ollamaModel = this.configService.get<string>('OLLAMA_MODEL') ?? 'ollama-v3';

    try {
      const prompt = `Subject: ${subjectCode ?? 'General Tourism Study'}\n${message}`;

      const response = await axios.post(
        `${ollamaUrl}/api/generate`,
        {
          model: ollamaModel,
          prompt,
        },
        { timeout: 20000 },
      );

      // Parse common Ollama response shapes
      const data = response.data || {};
      const replyText =
        data?.choices?.[0]?.content || data?.choices?.[0]?.text || data?.text || data?.result?.[0]?.content ||
        (typeof data === 'string' ? data : JSON.stringify(data));

      const reply = this.normalizeReply(replyText);
      this.lastProvider = 'ollama';
      return { reply, provider: 'ollama' as const };
    } catch (err) {
      this.logger.warn(`Ollama request failed, falling back: ${String(err)}`);
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

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { validateCoachFeedbackShape } from './simulation-coach-validation.util';
import type { CompetencyCode, FeedbackSource } from './simulation.constants';
import type { CoachFeedback, DeterministicFeedback } from './simulation.types';

// NOTE (scope decision): this is a small, self-contained AI call rather than
// a full multi-provider gateway. The existing backend/src/ai/ai.service.ts
// tutor chain (Gemma -> OpenRouter -> Ollama -> local, ~55s worst case) is
// left untouched to avoid disturbing working behavior; simulation coaching
// only needs a single fast, bounded, optional call before falling back to
// the deterministic result, which is always authoritative. Consolidating
// every provider behind one AiGateway (per docs/TDD.md section 17) is
// deferred to a follow-up task -- see the final implementation report.

export const COACH_PROMPT_VERSION = 'simulation-coach-v1';
const COACH_TIMEOUT_MS = 6000;

const COACH_SYSTEM_PROMPT = `You are the TourMate Quest coaching assistant. You turn a completed tourism
career-simulation result into concise, supportive, educational feedback for a
BS Tourism Management student.

Rules you must follow:
- This is educational simulation feedback, not an official evaluation.
- Use ONLY the mission evidence provided below. Do not invent airline policy,
  legal rights, visa rules, compensation amounts, or emergency procedures.
- Do not state or imply a numeric score; the score is calculated separately.
- Be concise, respectful, and actionable. No shame, insults, or stereotypes.
- Respond with ONLY a single JSON object matching this exact shape, no markdown fences:
{"summary": string, "strengths": [{"competency": string, "evidence": string}], "improvements": [{"competency": string, "suggestion": string}], "nextAction": string}
- "strengths" and "improvements" must each have at most 3 items.
- "competency" must be one of: communication, service-recovery, safety-policy-awareness, problem-solving, professionalism.`;

interface GemmaGenerateContentResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

export interface CoachRequestParams {
  missionTitle: string;
  role: string;
  overallScore: number;
  categoryScores: Record<CompetencyCode, number>;
  deterministicFeedback: DeterministicFeedback;
}

export interface CoachOutcome {
  source: FeedbackSource;
  content: CoachFeedback;
  providerId: string | null;
  modelId: string | null;
  promptVersion: string;
}

@Injectable()
export class SimulationCoachService {
  private readonly logger = new Logger(SimulationCoachService.name);

  constructor(private readonly configService: ConfigService) {}

  async generateCoachFeedback(
    params: CoachRequestParams,
  ): Promise<CoachOutcome> {
    const gemmaKey = this.configService.get<string>('GEMMA_API_KEY');
    if (!gemmaKey) {
      return this.deterministicOutcome(params);
    }

    try {
      const raw = await this.callGemma(gemmaKey, params);
      const parsed = this.parseAndValidate(raw);
      if (!parsed) {
        this.logger.warn(
          'Simulation coach: AI output failed validation, using deterministic fallback.',
        );
        return this.deterministicOutcome(params);
      }

      return {
        source: 'AI',
        content: parsed,
        providerId: 'gemma',
        modelId:
          this.configService.get<string>('GEMMA_MODEL') ?? 'gemma-3-27b-it',
        promptVersion: COACH_PROMPT_VERSION,
      };
    } catch (error) {
      this.logger.warn(
        `Simulation coach: provider call failed, using deterministic fallback: ${String(error)}`,
      );
      return this.deterministicOutcome(params);
    }
  }

  private deterministicOutcome(params: CoachRequestParams): CoachOutcome {
    const feedback = params.deterministicFeedback;
    return {
      source: 'DETERMINISTIC_FALLBACK',
      content: {
        summary: feedback.summary,
        strengths: feedback.strengths,
        improvements: feedback.improvements,
        nextAction: feedback.nextAction.label,
      },
      providerId: null,
      modelId: null,
      promptVersion: COACH_PROMPT_VERSION,
    };
  }

  private async callGemma(
    gemmaKey: string,
    params: CoachRequestParams,
  ): Promise<string> {
    const model =
      this.configService.get<string>('GEMMA_MODEL') ?? 'gemma-3-27b-it';
    const userPrompt = this.buildUserPrompt(params);

    const response = await axios.post<GemmaGenerateContentResponse>(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        contents: [
          {
            role: 'user',
            parts: [{ text: `${COACH_SYSTEM_PROMPT}\n\n---\n\n${userPrompt}` }],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 500,
        },
      },
      {
        headers: { 'x-goog-api-key': gemmaKey },
        timeout: COACH_TIMEOUT_MS,
      },
    );

    const text = response.data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? '')
      .join('')
      .trim();

    if (!text) {
      throw new Error('Empty response from Gemma coaching request.');
    }
    return text;
  }

  private buildUserPrompt(params: CoachRequestParams): string {
    return [
      `Mission: ${params.missionTitle}`,
      `Student role: ${params.role}`,
      `Category scores: ${JSON.stringify(params.categoryScores)}`,
      `Deterministic strengths: ${JSON.stringify(params.deterministicFeedback.strengths)}`,
      `Deterministic improvements: ${JSON.stringify(params.deterministicFeedback.improvements)}`,
      'Write the JSON feedback object now.',
    ].join('\n');
  }

  private parseAndValidate(raw: string): CoachFeedback | null {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      return null;
    }

    return validateCoachFeedbackShape(parsed);
  }
}

export type LanguageGameMode = 'READING' | 'WRITING';
export type SupportedLanguageCode = 'ja' | 'ko';
export type ScoreTier = 'PERFECT' | 'GREAT' | 'CLOSE' | 'ALMOST' | 'WRONG';

export interface NextWord {
  id: string;
  languageCode: SupportedLanguageCode;
  mode: LanguageGameMode;
  category: string | null;
  difficulty: number;
  prompt: string;
  romanization: string | null;
}

export interface AnswerResult {
  attemptId: string;
  created: boolean;
  tier: ScoreTier;
  similarity: number;
  xpAwarded: number;
  comboAtAnswer: number;
  correctAnswer: string;
  romanization: string | null;
  totalXp: number;
  level: number;
}

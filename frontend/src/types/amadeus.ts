export type AmadeusDifficulty = 'SIMPLE' | 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
export type AmadeusTier = 'PERFECT' | 'GREAT' | 'CLOSE' | 'ALMOST' | 'WRONG';
export type AmadeusSessionStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';

export interface AmadeusScenarioSummary {
  slug: string;
  title: string;
  difficulty: AmadeusDifficulty;
  category: string;
  stepCount: number;
}

export interface AmadeusStep {
  orderIndex: number;
  title: string;
  instruction: string;
  hints: string[];
}

export interface AmadeusSession {
  id: string;
  status: AmadeusSessionStatus;
  combo: number;
  scenario: {
    slug: string;
    title: string;
    difficulty: AmadeusDifficulty;
    brief: Record<string, string>;
    stepCount: number;
  };
  currentStep: AmadeusStep | null;
  history: Array<{ stepId: string; tier: AmadeusTier; xpAwarded: number; createdAt: string }>;
  completedAt: string | null;
}

export interface AmadeusCommandResult {
  attemptId: string;
  created: boolean;
  tier: AmadeusTier;
  xpAwarded: number;
  comboAtAnswer: number;
  sessionStatus: AmadeusSessionStatus;
  nextStep: AmadeusStep | null;
  totalXp: number;
  level: number;
}

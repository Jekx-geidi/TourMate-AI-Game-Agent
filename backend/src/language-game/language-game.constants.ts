// docs/PRD.md §2.4 / §2.5 — deterministic scoring tiers and XP inputs for the
// Reading and Writing games. Kept in application code (not Prisma enums) for
// the same cross-connector reason documented in simulation.constants.ts.

export const LANGUAGE_GAME_MODES = ['READING', 'WRITING'] as const;
export type LanguageGameMode = (typeof LANGUAGE_GAME_MODES)[number];

export const SCORE_TIERS = ['PERFECT', 'GREAT', 'CLOSE', 'ALMOST', 'WRONG'] as const;
export type ScoreTier = (typeof SCORE_TIERS)[number];

// docs/PRD.md §2.4 scoring table.
export const TIER_XP_MULTIPLIER: Record<ScoreTier, number> = {
  PERFECT: 1.0,
  GREAT: 0.9,
  CLOSE: 0.6,
  ALMOST: 0.3,
  WRONG: 0,
};

// docs/UXS.md §1 states the tiers directly in terms of edit distance ("one
// character wrong" -> Great, "two characters wrong" -> Close), not a fixed
// similarity percentage -- a length-normalized ratio would unfairly punish
// short words (a 1-edit typo on a 5-character word is only 80% similar by
// ratio, but the spec calls that GREAT). So tiering is edit-distance-first;
// `similarity` is still computed and stored for display/analytics only.
export const TIER_DISTANCE_THRESHOLDS: { tier: ScoreTier; maxDistance: number }[] = [
  { tier: 'GREAT', maxDistance: 1 },
  { tier: 'CLOSE', maxDistance: 2 },
  { tier: 'ALMOST', maxDistance: 4 },
];

// docs/UXS.md §3 combo ladder: 1x through 5x.
export const MAX_COMBO_MULTIPLIER = 5;

// docs/PRD.md §2.5: XP = base(difficulty) * tier multiplier * combo multiplier.
export function baseXpForDifficulty(difficulty: number): number {
  return 10 * Math.max(1, difficulty);
}

export const SUPPORTED_LANGUAGE_CODES = ['ja', 'ko'] as const;
export type SupportedLanguageCode = (typeof SUPPORTED_LANGUAGE_CODES)[number];

export function isLanguageGameMode(value: string): value is LanguageGameMode {
  return (LANGUAGE_GAME_MODES as readonly string[]).includes(value);
}

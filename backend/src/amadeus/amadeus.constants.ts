// Amadeus Practice (Reservation Lab) -- docs pasted 2026-08-20, sections
// 11-30. This is an educational reservation-console *simulator*: scenarios
// check whether the player's typed command includes the trip details the
// brief asked for (a fill-in-the-template exercise), not real Amadeus
// cryptic command syntax. Per section 15/42 of those docs: never assert
// scraped/invented production commands as authoritative.

export const AMADEUS_DIFFICULTIES = ['SIMPLE', 'EASY', 'MEDIUM', 'HARD', 'EXPERT'] as const;
export type AmadeusDifficulty = (typeof AMADEUS_DIFFICULTIES)[number];

export const AMADEUS_SESSION_STATUSES = ['IN_PROGRESS', 'COMPLETED', 'ABANDONED'] as const;
export type AmadeusSessionStatus = (typeof AMADEUS_SESSION_STATUSES)[number];

export const AMADEUS_TIERS = ['PERFECT', 'GREAT', 'CLOSE', 'ALMOST', 'WRONG'] as const;
export type AmadeusTier = (typeof AMADEUS_TIERS)[number];

export const AMADEUS_TIER_XP_MULTIPLIER: Record<AmadeusTier, number> = {
  PERFECT: 1.0,
  GREAT: 0.9,
  CLOSE: 0.6,
  ALMOST: 0.3,
  WRONG: 0,
};

// docs section 27: base XP per successful task, by difficulty.
export const AMADEUS_BASE_XP_BY_DIFFICULTY: Record<AmadeusDifficulty, number> = {
  SIMPLE: 10,
  EASY: 15,
  MEDIUM: 25,
  HARD: 40,
  EXPERT: 60,
};

export const MAX_AMADEUS_COMBO = 5;

export function isAmadeusDifficulty(value: string): value is AmadeusDifficulty {
  return (AMADEUS_DIFFICULTIES as readonly string[]).includes(value);
}

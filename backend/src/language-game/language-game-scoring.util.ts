import {
  ScoreTier,
  TIER_DISTANCE_THRESHOLDS,
  TIER_XP_MULTIPLIER,
} from './language-game.constants';

// docs/PRD.md §2.4: normalize before scoring — trim, collapse whitespace,
// lowercase, and NFKC-normalize so full-width/half-width variants (common in
// Japanese/Korean typed input) compare equal to their canonical form.
export function normalizeAnswer(value: string): string {
  return value.normalize('NFKC').trim().toLowerCase().replace(/\s+/g, ' ');
}

// Standard Levenshtein edit distance, O(n*m) with a 2-row rolling buffer.
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let previousRow = Array.from({ length: b.length + 1 }, (_, i) => i);
  let currentRow = new Array(b.length + 1).fill(0);

  for (let i = 1; i <= a.length; i += 1) {
    currentRow[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      currentRow[j] = Math.min(
        previousRow[j] + 1,
        currentRow[j - 1] + 1,
        previousRow[j - 1] + cost,
      );
    }
    [previousRow, currentRow] = [currentRow, previousRow];
  }

  return previousRow[b.length];
}

export function similarityRatio(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshteinDistance(a, b) / maxLen;
}

export interface ScoredAnswer {
  normalizedAnswer: string;
  tier: ScoreTier;
  similarity: number;
  tierXpMultiplier: number;
  matchedAnswer: string | null;
}

/**
 * Deterministic answer scoring for the Reading and Writing games
 * (docs/PRD.md §2.4). An exact match to any accepted answer is always
 * PERFECT; otherwise the tier follows the best fuzzy-match similarity
 * against the accepted answers, so a single-character typo scores GREAT
 * rather than WRONG.
 */
export function scoreAnswer(rawAnswer: string, acceptedAnswers: string[]): ScoredAnswer {
  const normalizedAnswer = normalizeAnswer(rawAnswer);
  const normalizedAccepted = acceptedAnswers.map((answer) => ({
    original: answer,
    normalized: normalizeAnswer(answer),
  }));

  if (normalizedAnswer.length === 0) {
    return {
      normalizedAnswer,
      tier: 'WRONG',
      similarity: 0,
      tierXpMultiplier: TIER_XP_MULTIPLIER.WRONG,
      matchedAnswer: null,
    };
  }

  const exactMatch = normalizedAccepted.find((a) => a.normalized === normalizedAnswer);
  if (exactMatch) {
    return {
      normalizedAnswer,
      tier: 'PERFECT',
      similarity: 1,
      tierXpMultiplier: TIER_XP_MULTIPLIER.PERFECT,
      matchedAnswer: exactMatch.original,
    };
  }

  // Pick the closest accepted answer by edit distance (ties broken by
  // whichever is checked first), then tier off that distance directly.
  let best: { distance: number; similarity: number; original: string | null } = {
    distance: Infinity,
    similarity: 0,
    original: null,
  };
  for (const candidate of normalizedAccepted) {
    const distance = levenshteinDistance(normalizedAnswer, candidate.normalized);
    if (distance < best.distance) {
      best = {
        distance,
        similarity: similarityRatio(normalizedAnswer, candidate.normalized),
        original: candidate.original,
      };
    }
  }

  const tier =
    TIER_DISTANCE_THRESHOLDS.find((entry) => best.distance <= entry.maxDistance)?.tier ?? 'WRONG';

  return {
    normalizedAnswer,
    tier,
    similarity: best.similarity,
    tierXpMultiplier: TIER_XP_MULTIPLIER[tier],
    matchedAnswer: tier === 'WRONG' ? null : best.original,
  };
}

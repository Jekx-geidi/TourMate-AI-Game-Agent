import {
  COMPETENCY_CODES,
  type RubricPoints,
  type ScoringWeights,
} from './simulation.constants';

// Defensive parsing for JSON columns: validated at write time (seed) but
// re-validated here too, per docs/TDD.md section 9 ("do not trust database
// JSON merely because it came from a seed").

export function parseRubricPoints(value: unknown): RubricPoints {
  const result: RubricPoints = {};
  if (!value || typeof value !== 'object') return result;

  const record = value as Record<string, unknown>;
  for (const code of COMPETENCY_CODES) {
    const point = record[code];
    if (
      typeof point === 'number' &&
      Number.isInteger(point) &&
      point >= 0 &&
      point <= 4
    ) {
      result[code] = point as 0 | 1 | 2 | 3 | 4;
    }
  }
  return result;
}

export function parseLearningTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry): entry is string => typeof entry === 'string')
    .slice(0, 10);
}

export function parseScoringWeights(value: unknown): ScoringWeights {
  const weights = {} as ScoringWeights;
  const record = (value && typeof value === 'object' ? value : {}) as Record<
    string,
    unknown
  >;

  for (const code of COMPETENCY_CODES) {
    const weight = record[code];
    weights[code] = typeof weight === 'number' ? weight : 0;
  }
  return weights;
}

export function parseStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === 'string');
}

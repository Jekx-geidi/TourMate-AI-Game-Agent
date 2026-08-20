// Application-level "enums" for the simulation/gamification domain.
//
// The Prisma schema stores these as plain String columns (see the comment in
// prisma/schema.prisma) because prisma/schema.local.prisma targets SQLite for
// local development, and the SQLite connector does not support Prisma enums.
// These constants are the single source of truth for allowed values; every
// read/write path must validate against them rather than trusting stored
// strings blindly.

export const SIMULATION_STATUSES = ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const;
export type SimulationStatus = (typeof SIMULATION_STATUSES)[number];

export const SIMULATION_DIFFICULTIES = [
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED',
] as const;
export type SimulationDifficulty = (typeof SIMULATION_DIFFICULTIES)[number];

export const SIMULATION_SESSION_STATUSES = [
  'IN_PROGRESS',
  'COMPLETED',
  'ABANDONED',
] as const;
export type SimulationSessionStatus =
  (typeof SIMULATION_SESSION_STATUSES)[number];

export const FEEDBACK_SOURCES = ['AI', 'DETERMINISTIC_FALLBACK'] as const;
export type FeedbackSource = (typeof FEEDBACK_SOURCES)[number];

export const ACTIVITY_EVENT_TYPES = [
  'LEGACY_GAME_STATE_IMPORT',
  'LESSON_COMPLETED',
  'QUIZ_COMPLETED',
  'SIMULATION_COMPLETED',
  'SIMULATION_PERSONAL_BEST',
  'ACHIEVEMENT_UNLOCKED',
  'MANUAL_ADJUSTMENT',
  'LANGUAGE_GAME_ANSWERED',
  'AMADEUS_COMMAND_SCORED',
] as const;
export type ActivityEventType = (typeof ACTIVITY_EVENT_TYPES)[number];

// First-slice competency taxonomy (docs/IA.md section 17.4).
export const COMPETENCY_CODES = [
  'communication',
  'service-recovery',
  'safety-policy-awareness',
  'problem-solving',
  'professionalism',
] as const;
export type CompetencyCode = (typeof COMPETENCY_CODES)[number];

export const COMPETENCY_LABELS: Record<CompetencyCode, string> = {
  communication: 'Communication',
  'service-recovery': 'Service Recovery',
  'safety-policy-awareness': 'Safety & Policy Awareness',
  'problem-solving': 'Problem-Solving',
  professionalism: 'Professionalism',
};

export type RubricPoints = Partial<Record<CompetencyCode, 0 | 1 | 2 | 3 | 4>>;

// docs/TDD.md section 8.9 / CLAUDE.md section 8: weights must sum to 100.
export type ScoringWeights = Record<CompetencyCode, number>;

export const DEFAULT_SCORE_POLICY_VERSION = 'v1';

export const RESULT_BANDS = [
  'SERVICE_READY',
  'ON_TRACK',
  'DEVELOPING',
  'PRACTICE_RECOMMENDED',
] as const;
export type ResultBand = (typeof RESULT_BANDS)[number];

export function resultBandFor(score: number): ResultBand {
  if (score >= 90) return 'SERVICE_READY';
  if (score >= 75) return 'ON_TRACK';
  if (score >= 60) return 'DEVELOPING';
  return 'PRACTICE_RECOMMENDED';
}

export const RESULT_BAND_LABELS: Record<ResultBand, string> = {
  SERVICE_READY: 'Service Ready',
  ON_TRACK: 'On Track',
  DEVELOPING: 'Developing',
  PRACTICE_RECOMMENDED: 'Practice Recommended',
};

export function isCompetencyCode(value: string): value is CompetencyCode {
  return (COMPETENCY_CODES as readonly string[]).includes(value);
}

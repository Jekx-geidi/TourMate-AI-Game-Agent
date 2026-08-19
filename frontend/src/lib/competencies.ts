import type { CompetencyCode } from '../types';

// Mirrors backend/src/simulations/simulation.constants.ts COMPETENCY_LABELS.
// Kept as a small frontend-local copy rather than a shared package, since the
// only thing the UI needs is the learner-facing label per stable code.
export const COMPETENCY_LABELS: Record<CompetencyCode, string> = {
  communication: 'Communication',
  'service-recovery': 'Service Recovery',
  'safety-policy-awareness': 'Safety & Policy Awareness',
  'problem-solving': 'Problem-Solving',
  professionalism: 'Professionalism',
};

export const RESULT_BAND_LABELS: Record<string, string> = {
  SERVICE_READY: 'Service Ready',
  ON_TRACK: 'On Track',
  DEVELOPING: 'Developing',
  PRACTICE_RECOMMENDED: 'Practice Recommended',
};

export const RESULT_BAND_HINT: Record<string, string> = {
  SERVICE_READY: 'Consistently strong decisions for this level.',
  ON_TRACK: 'Strong foundation with targeted improvements.',
  DEVELOPING: 'Some effective decisions; review the specific gaps below.',
  PRACTICE_RECOMMENDED: 'Repeat the related learning and replay the mission.',
};

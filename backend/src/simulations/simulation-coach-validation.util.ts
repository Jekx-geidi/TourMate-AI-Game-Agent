import { isCompetencyCode } from './simulation.constants';
import type { CoachFeedback } from './simulation.types';

const MAX_ITEMS = 3;
const MAX_TEXT_LENGTH = 400;

/**
 * Validates an untrusted (typically AI-generated) value against the
 * CoachFeedback contract. Kept as a standalone pure function so it is
 * directly unit-testable without reaching into service internals.
 */
export function validateCoachFeedbackShape(
  value: unknown,
): CoachFeedback | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Record<string, unknown>;

  if (
    typeof candidate.summary !== 'string' ||
    candidate.summary.length === 0 ||
    candidate.summary.length > MAX_TEXT_LENGTH
  ) {
    return null;
  }
  if (
    typeof candidate.nextAction !== 'string' ||
    candidate.nextAction.length > MAX_TEXT_LENGTH
  ) {
    return null;
  }
  if (
    !Array.isArray(candidate.strengths) ||
    candidate.strengths.length > MAX_ITEMS
  ) {
    return null;
  }
  if (
    !Array.isArray(candidate.improvements) ||
    candidate.improvements.length > MAX_ITEMS
  ) {
    return null;
  }

  const strengths: CoachFeedback['strengths'] = [];
  for (const entry of candidate.strengths) {
    if (!entry || typeof entry !== 'object') return null;
    const { competency, evidence } = entry as Record<string, unknown>;
    if (typeof competency !== 'string' || !isCompetencyCode(competency))
      return null;
    if (typeof evidence !== 'string' || evidence.length > MAX_TEXT_LENGTH)
      return null;
    strengths.push({ competency, evidence });
  }

  const improvements: CoachFeedback['improvements'] = [];
  for (const entry of candidate.improvements) {
    if (!entry || typeof entry !== 'object') return null;
    const { competency, suggestion } = entry as Record<string, unknown>;
    if (typeof competency !== 'string' || !isCompetencyCode(competency))
      return null;
    if (typeof suggestion !== 'string' || suggestion.length > MAX_TEXT_LENGTH)
      return null;
    improvements.push({ competency, suggestion });
  }

  return {
    summary: candidate.summary,
    strengths,
    improvements,
    nextAction: candidate.nextAction,
  };
}

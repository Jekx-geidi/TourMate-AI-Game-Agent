import {
  COMPETENCY_CODES,
  COMPETENCY_LABELS,
  type CompetencyCode,
} from './simulation.constants';
import type {
  DeterministicFeedback,
  ScoringDecisionInput,
  ScoringStepInput,
} from './simulation.types';

const STRENGTH_THRESHOLD = 75;
const IMPROVEMENT_THRESHOLD = 60;
const MAX_STRENGTHS = 3;
const MAX_IMPROVEMENTS = 3;

export interface RelatedLessonRef {
  id: string;
  title: string;
  route: string;
}

/**
 * Reviewed-template feedback derived only from stored rubric evidence, so it
 * exists even when AI coaching is disabled or fails (docs/TDD.md section 14.4).
 */
export function buildDeterministicFeedback(params: {
  overallScore: number;
  categoryScores: Record<CompetencyCode, number>;
  steps: ScoringStepInput[];
  decisions: ScoringDecisionInput[];
  relatedLesson?: RelatedLessonRef | null;
}): DeterministicFeedback {
  const { overallScore, categoryScores, steps, decisions, relatedLesson } =
    params;
  const stepsById = new Map(steps.map((step) => [step.stepId, step]));

  const evidenceByCategory = new Map<CompetencyCode, string[]>();
  for (const decision of decisions) {
    const step = stepsById.get(decision.stepId);
    const option = step?.options.find((o) => o.id === decision.optionId);
    if (!option) continue;

    for (const code of COMPETENCY_CODES) {
      const points = option.rubricPoints[code] ?? 0;
      if (points >= 3) {
        const tags = option.learningTags ?? [];
        const existing = evidenceByCategory.get(code) ?? [];
        evidenceByCategory.set(code, [...existing, ...tags]);
      }
    }
  }

  const ranked = COMPETENCY_CODES.map((code) => ({
    code,
    score: categoryScores[code] ?? 0,
  })).sort((a, b) => b.score - a.score);

  const strengths = ranked
    .filter((entry) => entry.score >= STRENGTH_THRESHOLD)
    .slice(0, MAX_STRENGTHS)
    .map((entry) => ({
      competency: entry.code,
      evidence: describeEvidence(
        entry.code,
        evidenceByCategory.get(entry.code),
      ),
    }));

  const improvements = [...ranked]
    .reverse()
    .filter((entry) => entry.score < IMPROVEMENT_THRESHOLD)
    .slice(0, MAX_IMPROVEMENTS)
    .map((entry) => ({
      competency: entry.code,
      suggestion: describeImprovement(entry.code),
    }));

  const summary = buildSummary(
    overallScore,
    strengths.length,
    improvements.length,
  );
  const nextAction = buildNextAction(overallScore, improvements, relatedLesson);

  return { summary, strengths, improvements, nextAction };
}

function describeEvidence(
  code: CompetencyCode,
  tags: string[] | undefined,
): string {
  const label = COMPETENCY_LABELS[code];
  if (!tags || tags.length === 0) {
    return `Consistently strong decisions in ${label.toLowerCase()}.`;
  }
  const uniqueTags = Array.from(new Set(tags)).slice(0, 2);
  return `${label}: ${uniqueTags.map(humanizeTag).join('; ')}.`;
}

function describeImprovement(code: CompetencyCode): string {
  const label = COMPETENCY_LABELS[code];
  return `Review ${label.toLowerCase()} — look for a safer, more thorough option next time.`;
}

function humanizeTag(tag: string): string {
  return tag.replace(/-/g, ' ');
}

function buildSummary(
  overallScore: number,
  strengthCount: number,
  improvementCount: number,
): string {
  if (improvementCount === 0) {
    return `Strong result at ${overallScore}%. Your decisions showed consistent, service-ready judgment.`;
  }
  if (strengthCount === 0) {
    return `You scored ${overallScore}%. This mission highlighted a few areas worth reviewing before your next attempt.`;
  }
  return `You scored ${overallScore}%, with solid strengths and a few clear areas to practice next.`;
}

function buildNextAction(
  overallScore: number,
  improvements: DeterministicFeedback['improvements'],
  relatedLesson?: RelatedLessonRef | null,
): DeterministicFeedback['nextAction'] {
  if (overallScore < STRENGTH_THRESHOLD && relatedLesson) {
    return {
      type: 'LESSON',
      id: relatedLesson.id,
      label: `Review "${relatedLesson.title}"`,
      route: relatedLesson.route,
    };
  }

  if (improvements.length > 0) {
    return {
      type: 'REPLAY',
      label: 'Replay this mission to improve your weakest area',
    };
  }

  return {
    type: 'PASSPORT',
    label: 'View your Career Passport',
  };
}

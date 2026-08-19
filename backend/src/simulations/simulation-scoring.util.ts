import { COMPETENCY_CODES, type CompetencyCode } from './simulation.constants';
import type { ScoringInput, ScoringResult } from './simulation.types';

export class SimulationScoringError extends Error {}

function assertValidWeights(weights: Record<string, number>): void {
  const sum = COMPETENCY_CODES.reduce(
    (total, code) => total + (weights[code] ?? 0),
    0,
  );
  if (sum !== 100) {
    throw new SimulationScoringError(
      `Scoring weights must sum to 100, got ${sum}.`,
    );
  }
}

function assertValidPoints(points: number, context: string): void {
  if (!Number.isInteger(points) || points < 0 || points > 4) {
    throw new SimulationScoringError(
      `Invalid rubric point value at ${context}: expected an integer from 0 to 4, got ${points}.`,
    );
  }
}

/**
 * Deterministic mission scoring per docs/TDD.md section 14.2.
 *
 * For each competency: earned = selected option's points; maximum = the
 * highest points any option at that step offers for that competency (the
 * best the student could have chosen). This rewards the actual decision
 * against what was achievable at each step, not against a global maximum.
 */
export function calculateSimulationScore(input: ScoringInput): ScoringResult {
  assertValidWeights(input.scoringWeights);

  const stepsById = new Map(input.steps.map((step) => [step.stepId, step]));
  if (input.decisions.length !== input.steps.length) {
    throw new SimulationScoringError(
      `Expected exactly one decision per required step: ${input.steps.length} steps, ${input.decisions.length} decisions.`,
    );
  }

  const earned: Record<CompetencyCode, number> = {
    communication: 0,
    'service-recovery': 0,
    'safety-policy-awareness': 0,
    'problem-solving': 0,
    professionalism: 0,
  };
  const maximum: Record<CompetencyCode, number> = { ...earned };

  for (const decision of input.decisions) {
    const step = stepsById.get(decision.stepId);
    if (!step) {
      throw new SimulationScoringError(
        `Decision references step ${decision.stepId}, which does not belong to this mission version.`,
      );
    }

    const selectedOption = step.options.find(
      (option) => option.id === decision.optionId,
    );
    if (!selectedOption) {
      throw new SimulationScoringError(
        `Decision references option ${decision.optionId}, which does not belong to step ${decision.stepId}.`,
      );
    }

    for (const code of COMPETENCY_CODES) {
      const bestAtStep = Math.max(
        0,
        ...step.options.map((option) => {
          const points = option.rubricPoints[code] ?? 0;
          assertValidPoints(
            points,
            `step ${step.stepId} option ${option.optionKey} (${code})`,
          );
          return points;
        }),
      );
      maximum[code] += bestAtStep;
      earned[code] += selectedOption.rubricPoints[code] ?? 0;
    }
  }

  const categoryScores = {} as Record<CompetencyCode, number>;
  for (const code of COMPETENCY_CODES) {
    categoryScores[code] =
      maximum[code] === 0
        ? 0
        : Math.round((earned[code] / maximum[code]) * 100);
  }

  const overallScore = Math.round(
    COMPETENCY_CODES.reduce(
      (total, code) =>
        total +
        (categoryScores[code] * (input.scoringWeights[code] ?? 0)) / 100,
      0,
    ),
  );

  return { overallScore, categoryScores };
}

import type {
  CompetencyCode,
  RubricPoints,
  ScoringWeights,
} from './simulation.constants';

export interface ScoringOptionInput {
  id: string;
  optionKey: string;
  rubricPoints: RubricPoints;
  learningTags?: string[];
}

export interface ScoringStepInput {
  stepId: string;
  options: ScoringOptionInput[];
}

export interface ScoringDecisionInput {
  stepId: string;
  optionId: string;
}

export interface ScoringInput {
  steps: ScoringStepInput[];
  decisions: ScoringDecisionInput[];
  scoringWeights: ScoringWeights;
}

export interface ScoringResult {
  overallScore: number;
  categoryScores: Record<CompetencyCode, number>;
}

export interface DeterministicNextAction {
  type: 'LESSON' | 'REPLAY' | 'PASSPORT';
  id?: string;
  label: string;
  route?: string;
}

export interface DeterministicFeedback {
  summary: string;
  strengths: Array<{ competency: CompetencyCode; evidence: string }>;
  improvements: Array<{ competency: CompetencyCode; suggestion: string }>;
  nextAction: DeterministicNextAction;
}

export interface CoachFeedback {
  summary: string;
  strengths: Array<{ competency: CompetencyCode; evidence: string }>;
  improvements: Array<{ competency: CompetencyCode; suggestion: string }>;
  nextAction: string;
}

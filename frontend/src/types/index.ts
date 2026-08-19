export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
};

export type Lesson = {
  id: string;
  title: string;
  content: string;
  summary?: string | null;
  order: number;
};

export type QuizQuestion = {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: string;
  explanation: string;
};

export type Quiz = {
  id: string;
  subjectId: string;
  title: string;
  type: string;
  questions: QuizQuestion[];
};

export type FlashcardItem = {
  id: string;
  subjectId: string;
  front: string;
  back: string;
  category?: string | null;
};

export type Subject = {
  id: string;
  code: string;
  title: string;
  description: string;
  icon?: string | null;
  color?: string | null;
  lessons: Lesson[];
  quizzes: Quiz[];
  flashcards: FlashcardItem[];
};

export type Note = {
  id: string;
  title: string;
  content: string;
  subjectId: string;
  subject: Subject;
  createdAt: string;
  updatedAt: string;
};

export type QuizResult = {
  id: string;
  score: number;
  total: number;
  createdAt: string;
  quiz: Quiz & { subject: Subject };
};

export type ProgressItem = {
  id: string;
  subjectId: string;
  category: string;
  percent: number;
  updatedAt: string;
  subject: Subject;
};

export type ProgressSummary = {
  studyStreak: number;
  totalNotes: number;
  quizAverage: number;
  overallProgress: number;
  subjectProgress: ProgressItem[];
  recentNotes: Note[];
  recentQuizResults: QuizResult[];
  recommendedActivity: string;
};

export type AgentStatus = {
  hermesStatus: string;
  openRouterStatus: string;
  currentProvider: string;
  lastCheckedTime: string | null;
  lastAiResponseProvider: string;
  message: string;
  studyActivitySummary: string;
};

// --- TourMate Quest: missions / simulations ---

export type CompetencyCode =
  | 'communication'
  | 'service-recovery'
  | 'safety-policy-awareness'
  | 'problem-solving'
  | 'professionalism';

export type LearnerMissionStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export type SimulationCatalogItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  subject: { id: string; code: string; name: string } | null;
  difficulty: string;
  competencies: CompetencyCode[];
  stepCount: number;
  learnerStatus: LearnerMissionStatus;
  latestScore: number | null;
  bestScore: number | null;
};

export type SimulationListResponse = {
  items: SimulationCatalogItem[];
  page: number;
  limit: number;
  total: number;
};

export type SimulationRelatedLesson = { id: string; title: string; route: string };

export type SimulationDetail = {
  id: string;
  slug: string;
  version: number;
  title: string;
  role: string;
  context: string;
  objectives: string[];
  competencies: CompetencyCode[];
  difficulty: string;
  stepCount: number;
  relatedLessons: SimulationRelatedLesson[];
  learner: {
    status: LearnerMissionStatus;
    activeSessionId: string | null;
    attemptCount: number;
    latestScore: number | null;
    bestScore: number | null;
  };
};

export type SimulationStepOption = { id: string; text: string };

export type SimulationStepView = {
  id: string;
  order: number;
  title: string;
  prompt: string;
  guidance?: string | null;
  options: SimulationStepOption[];
};

export type SimulationMissionSummary = {
  slug: string;
  title: string;
  version: number;
  role: string;
};

export type SimulationSessionView = {
  sessionId: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  mission: SimulationMissionSummary;
  progress?: { current: number; total: number };
  step: SimulationStepView | null;
  canComplete?: boolean;
  resultId?: string | null;
};

export type SubmitAnswerResponse = {
  accepted: boolean;
  decision: { stepId: string; optionId: string };
  progress: { current: number; total: number };
  nextStep: SimulationStepView | null;
  canComplete: boolean;
};

export type DeterministicFeedback = {
  summary: string;
  strengths: Array<{ competency: CompetencyCode; evidence: string }>;
  improvements: Array<{ competency: CompetencyCode; suggestion: string }>;
  nextAction: { type: 'LESSON' | 'REPLAY' | 'PASSPORT'; id?: string; label: string; route?: string };
};

export type CoachFeedback = {
  summary: string;
  strengths: Array<{ competency: CompetencyCode; evidence: string }>;
  improvements: Array<{ competency: CompetencyCode; suggestion: string }>;
  nextAction: string;
};

export type SimulationResultResponse = {
  resultId: string;
  sessionId: string;
  overallScore: number;
  resultBand: 'SERVICE_READY' | 'ON_TRACK' | 'DEVELOPING' | 'PRACTICE_RECOMMENDED';
  categoryScores: Record<CompetencyCode, number>;
  deterministicFeedback: DeterministicFeedback;
  coachFeedback: {
    status: 'READY';
    source: 'AI' | 'DETERMINISTIC_FALLBACK';
    content: CoachFeedback;
  };
  reward: {
    xpAwarded: number;
    totalXp: number | null;
    level: number | null;
    newPersonalBest: boolean | null;
  };
};

export type GamificationProfile = {
  xp: number;
  level: number;
  xpToNextLevel: number;
  streak: number;
  recentEvents: Array<{
    type: string;
    xpDelta: number;
    sourceType: string | null;
    createdAt: string;
  }>;
};

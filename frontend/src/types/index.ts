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

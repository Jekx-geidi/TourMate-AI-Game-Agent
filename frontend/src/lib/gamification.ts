export type GameEvent =
  | 'game-completed'
  | 'quiz-completed'
  | 'perfect-score'
  | 'country-explored'
  | 'agent-question'
  | 'flag-correct'
  | 'map-correct'
  | 'match-completed';

export type DailyChallenge = {
  id: string;
  label: string;
  event: GameEvent;
  target: number;
  xp: number;
  icon: string;
};

export const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: 'explore-countries',
    label: 'Explore 3 countries on the world map',
    event: 'country-explored',
    target: 3,
    xp: 30,
    icon: 'map',
  },
  {
    id: 'complete-game',
    label: 'Complete any subject game',
    event: 'game-completed',
    target: 1,
    xp: 25,
    icon: 'gamepad',
  },
  {
    id: 'finish-quiz',
    label: 'Finish a quiz',
    event: 'quiz-completed',
    target: 1,
    xp: 25,
    icon: 'quiz',
  },
  {
    id: 'ask-agent',
    label: 'Ask a subject agent a question',
    event: 'agent-question',
    target: 1,
    xp: 20,
    icon: 'bot',
  },
  {
    id: 'flag-streak',
    label: 'Answer 5 flag questions correctly',
    event: 'flag-correct',
    target: 5,
    xp: 30,
    icon: 'flag',
  },
];

export type Badge = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export const BADGES: Badge[] = [
  { id: 'first-steps', title: 'First Steps', description: 'Complete your first game', icon: 'footprints' },
  { id: 'globe-trotter', title: 'Globe Trotter', description: 'Explore 10 countries on the map', icon: 'globe' },
  { id: 'quiz-whiz', title: 'Quiz Whiz', description: 'Finish 5 quizzes', icon: 'brain' },
  { id: 'perfectionist', title: 'Perfectionist', description: 'Score 100% on a quiz', icon: 'medal' },
  { id: 'flag-master', title: 'Flag Master', description: 'Answer 20 flag questions correctly', icon: 'flag' },
  { id: 'navigator', title: 'Navigator', description: 'Find 10 countries in the map challenge', icon: 'compass' },
  { id: 'curious-mind', title: 'Curious Mind', description: 'Ask agents 10 questions', icon: 'message' },
  { id: 'rising-star', title: 'Rising Star', description: 'Reach level 5', icon: 'star' },
];

export const LEVEL_TITLES = [
  'Backpacker',
  'Sightseer',
  'Explorer',
  'Tour Guide',
  'Travel Planner',
  'Destination Expert',
  'Tourism Pro',
  'Globetrotter',
  'World Ambassador',
  'Tourism Legend',
];

export const XP_PER_LEVEL = 150;

export function levelForXp(xp: number) {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const title = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];
  const currentLevelXp = xp % XP_PER_LEVEL;
  return { level, title, currentLevelXp, nextLevelXp: XP_PER_LEVEL };
}

export type GameStats = {
  xp: number;
  counters: Partial<Record<GameEvent, number>>;
  countriesExplored: string[];
  earnedBadges: string[];
  dailyDate: string;
  dailyProgress: Record<string, number>;
  claimedChallenges: string[];
};

export const EMPTY_STATS: GameStats = {
  xp: 0,
  counters: {},
  countriesExplored: [],
  earnedBadges: [],
  dailyDate: '',
  dailyProgress: {},
  claimedChallenges: [],
};

export function evaluateBadges(stats: GameStats): string[] {
  const counters = stats.counters;
  const { level } = levelForXp(stats.xp);
  const unlocked: string[] = [];
  if ((counters['game-completed'] ?? 0) >= 1) unlocked.push('first-steps');
  if (stats.countriesExplored.length >= 10) unlocked.push('globe-trotter');
  if ((counters['quiz-completed'] ?? 0) >= 5) unlocked.push('quiz-whiz');
  if ((counters['perfect-score'] ?? 0) >= 1) unlocked.push('perfectionist');
  if ((counters['flag-correct'] ?? 0) >= 20) unlocked.push('flag-master');
  if ((counters['map-correct'] ?? 0) >= 10) unlocked.push('navigator');
  if ((counters['agent-question'] ?? 0) >= 10) unlocked.push('curious-mind');
  if (level >= 5) unlocked.push('rising-star');
  return unlocked;
}

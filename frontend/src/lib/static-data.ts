export const learningCategories = [
  {
    title: 'Study Mode',
    description: 'A playable study board with focus rounds, lesson quests, notes, and review checkpoints.',
    route: 'study',
  },
  {
    title: 'Practice Mode',
    description: 'Quizzes, true-or-false style thinking, flashcards, and mock-exam review.',
    route: 'quiz',
  },
  {
    title: 'Game Mode',
    description: 'Signature subject challenge, term matching, timed quiz rush, and flashcard games — all earning XP.',
    route: 'games',
  },
  {
    title: 'Subject Agent',
    description: 'A dedicated AI agent for this subject. Ask questions, request quizzes, get simple explanations.',
    route: 'tutor',
  },
  {
    title: 'Tourism Special Mode',
    description: 'Maps, flags, capitals, airport codes, and destination learning.',
    route: 'maps-flags',
    global: true,
  },
  {
    title: 'Language Mode',
    description: 'Greetings, phrases, translation practice, and conversation support.',
    route: 'language',
    global: true,
  },
];

export const flagChoices = [
  { flag: '🇵🇭', country: 'Philippines' },
  { flag: '🇯🇵', country: 'Japan' },
  { flag: '🇰🇷', country: 'South Korea' },
  { flag: '🇹🇭', country: 'Thailand' },
  { flag: '🇸🇬', country: 'Singapore' },
  { flag: '🇫🇷', country: 'France' },
  { flag: '🇮🇹', country: 'Italy' },
  { flag: '🇺🇸', country: 'United States' },
];

export const airportCodes = [
  { code: 'MNL', airport: 'Manila Ninoy Aquino International Airport' },
  { code: 'CEB', airport: 'Mactan-Cebu International Airport' },
  { code: 'NRT', airport: 'Narita International Airport' },
  { code: 'HND', airport: 'Haneda Airport' },
  { code: 'ICN', airport: 'Incheon International Airport' },
  { code: 'SIN', airport: 'Singapore Changi Airport' },
  { code: 'BKK', airport: 'Suvarnabhumi Airport' },
  { code: 'LAX', airport: 'Los Angeles International Airport' },
  { code: 'JFK', airport: 'John F. Kennedy International Airport' },
];

export const languagePhrases = [
  'Hello',
  'Good morning',
  'Thank you',
  'Where is the airport?',
  'How much is this?',
  'I have a reservation.',
  'Can you help me?',
  'Welcome to our hotel.',
  'Please follow me.',
  'Enjoy your stay.',
];

export const matchPairs = [
  { term: 'MICE', definition: 'Meetings, Incentives, Conferences, and Exhibitions' },
  { term: 'Itinerary', definition: 'A travel schedule or plan' },
  { term: 'Ground Handling', definition: 'Airport services for passengers and aircraft' },
  { term: 'Ecotourism', definition: 'Responsible travel to natural areas' },
];

export const destinationCards = [
  {
    country: 'Philippines',
    capital: 'Manila',
    destination: 'Boracay',
    continent: 'Asia',
    latitude: 11.9674,
    longitude: 121.9248,
  },
  {
    country: 'Japan',
    capital: 'Tokyo',
    destination: 'Kyoto',
    continent: 'Asia',
    latitude: 35.0116,
    longitude: 135.7681,
  },
  {
    country: 'France',
    capital: 'Paris',
    destination: 'French Riviera',
    continent: 'Europe',
    latitude: 43.7102,
    longitude: 7.262,
  },
  {
    country: 'United States',
    capital: 'Washington, D.C.',
    destination: 'New York City',
    continent: 'North America',
    latitude: 40.7128,
    longitude: -74.006,
  },
];

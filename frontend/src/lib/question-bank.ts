import { ALL_AIRPORTS, COUNTRIES } from './country-data';
import { SUBJECT_GAMES } from './subject-games';

export type QuizMethod = 'multiple' | 'identification' | 'truefalse';

export type BankQuestion = {
  id: string;
  topic: string;
  type: QuizMethod;
  prompt: string;
  options?: string[];
  answer: string;
  explanation: string;
};

export const QUIZ_METHODS: Array<{ id: QuizMethod | 'mixed'; label: string; hint: string }> = [
  { id: 'multiple', label: 'Multiple choice', hint: 'Pick the right answer out of four' },
  { id: 'identification', label: 'Identification', hint: 'Type the answer yourself' },
  { id: 'truefalse', label: 'True or False', hint: 'Decide if the statement is correct' },
  { id: 'mixed', label: 'Mixed', hint: 'A shuffle of every question style' },
];

// Deterministic decoy picker: walks the pool starting after the item's own index.
function decoys(pool: string[], correct: string, seed: number, count = 3): string[] {
  const unique = [...new Set(pool)].filter((item) => item !== correct);
  const picked: string[] = [];
  for (let step = 0; picked.length < count && step < unique.length; step += 1) {
    const candidate = unique[(seed + step * 7 + 1) % unique.length];
    if (!picked.includes(candidate)) picked.push(candidate);
  }
  return picked;
}

function buildBank(): BankQuestion[] {
  const questions: BankQuestion[] = [];
  const add = (question: Omit<BankQuestion, 'id'> & { id?: string }) => {
    questions.push({ ...question, id: `q${questions.length}` });
  };

  const capitals = COUNTRIES.map((c) => c.capital);
  const names = COUNTRIES.map((c) => c.name);
  const currencies = COUNTRIES.map((c) => c.currency);
  const languages = COUNTRIES.map((c) => c.languages);
  const continents = [...new Set(COUNTRIES.map((c) => c.continent))];

  COUNTRIES.forEach((country, index) => {
    const wrongCapital = capitals[(index + 11) % capitals.length];
    const wrongCountry = names[(index + 17) % names.length];

    // --- World Capitals
    add({
      topic: 'World Capitals',
      type: 'multiple',
      prompt: `What is the capital of ${country.name}?`,
      options: [country.capital, ...decoys(capitals, country.capital, index)],
      answer: country.capital,
      explanation: `${country.capital} is the capital of ${country.name}.`,
    });
    add({
      topic: 'World Capitals',
      type: 'multiple',
      prompt: `${country.capital} is the capital of which country?`,
      options: [country.name, ...decoys(names, country.name, index + 3)],
      answer: country.name,
      explanation: `${country.capital} is the capital of ${country.name}.`,
    });
    add({
      topic: 'World Capitals',
      type: 'identification',
      prompt: `Type the capital city of ${country.name}.`,
      answer: country.capital,
      explanation: `The capital of ${country.name} is ${country.capital}.`,
    });
    const capitalTrue = index % 2 === 0;
    add({
      topic: 'World Capitals',
      type: 'truefalse',
      prompt: `True or False: The capital of ${country.name} is ${capitalTrue ? country.capital : wrongCapital}.`,
      answer: capitalTrue ? 'True' : 'False',
      explanation: `The capital of ${country.name} is ${country.capital}.`,
    });

    // --- Countries & Continents
    add({
      topic: 'Countries & Continents',
      type: 'multiple',
      prompt: `${country.name} is located in which continent or region?`,
      options: [country.continent, ...decoys(continents, country.continent, index)],
      answer: country.continent,
      explanation: `${country.name} is in ${country.continent}.`,
    });
    const contTrue = index % 2 === 1;
    const wrongContinent = continents[(index + 2) % continents.length];
    add({
      topic: 'Countries & Continents',
      type: 'truefalse',
      prompt: `True or False: ${country.name} is located in ${contTrue ? country.continent : wrongContinent === country.continent ? continents[(index + 3) % continents.length] : wrongContinent}.`,
      answer: contTrue ? 'True' : 'False',
      explanation: `${country.name} is in ${country.continent}.`,
    });

    // --- Currencies
    add({
      topic: 'Currencies',
      type: 'multiple',
      prompt: `Which currency is used in ${country.name}?`,
      options: [country.currency, ...decoys(currencies, country.currency, index)],
      answer: country.currency,
      explanation: `${country.name} uses the ${country.currency}.`,
    });
    const currencyTrue = index % 2 === 0;
    const wrongCurrency = currencies[(index + 23) % currencies.length];
    add({
      topic: 'Currencies',
      type: 'truefalse',
      prompt: `True or False: ${country.name} uses the ${currencyTrue ? country.currency : wrongCurrency === country.currency ? currencies[(index + 29) % currencies.length] : wrongCurrency}.`,
      answer: currencyTrue ? 'True' : 'False',
      explanation: `${country.name} uses the ${country.currency}.`,
    });

    // --- Languages
    add({
      topic: 'Languages',
      type: 'multiple',
      prompt: `Which language(s) are mainly spoken in ${country.name}?`,
      options: [country.languages, ...decoys(languages, country.languages, index)],
      answer: country.languages,
      explanation: `${country.name}: ${country.languages}.`,
    });

    // --- Greetings
    add({
      topic: 'Greetings',
      type: 'multiple',
      prompt: `In which country would a local greet you with "${country.greeting}"?`,
      options: [country.name, ...decoys(names, country.name, index + 7)],
      answer: country.name,
      explanation: `"${country.greeting}" is a common greeting in ${country.name}.`,
    });

    // --- Food & Cuisine
    country.food.forEach((dish, dishIndex) => {
      add({
        topic: 'Food & Cuisine',
        type: 'multiple',
        prompt: `${dish} is a famous dish from which country?`,
        options: [country.name, ...decoys(names, country.name, index + dishIndex * 5)],
        answer: country.name,
        explanation: `${dish} comes from ${country.name}.`,
      });
    });
    const foodTrue = index % 2 === 0;
    add({
      topic: 'Food & Cuisine',
      type: 'truefalse',
      prompt: `True or False: ${country.food[0]} is a well-known dish from ${foodTrue ? country.name : wrongCountry}.`,
      answer: foodTrue ? 'True' : 'False',
      explanation: `${country.food[0]} is from ${country.name}.`,
    });

    // --- Famous Destinations
    country.destinations.forEach((destination, destIndex) => {
      add({
        topic: 'Famous Destinations',
        type: 'multiple',
        prompt: `In which country is "${destination}" found?`,
        options: [country.name, ...decoys(names, country.name, index + destIndex * 9)],
        answer: country.name,
        explanation: `${destination} is in ${country.name}.`,
      });
    });
  });

  // --- Airport Codes
  const airportCountries = ALL_AIRPORTS.map((a) => a.country);
  const codes = ALL_AIRPORTS.map((a) => a.code);
  ALL_AIRPORTS.forEach((airport, index) => {
    add({
      topic: 'Airport Codes',
      type: 'multiple',
      prompt: `The airport code ${airport.code} belongs to an airport in which country?`,
      options: [airport.country, ...decoys(airportCountries, airport.country, index)],
      answer: airport.country,
      explanation: `${airport.code} is ${airport.name} (${airport.country}).`,
    });
    add({
      topic: 'Airport Codes',
      type: 'multiple',
      prompt: `Which IATA code belongs to ${airport.name}?`,
      options: [airport.code, ...decoys(codes, airport.code, index + 4)],
      answer: airport.code,
      explanation: `${airport.name} uses the code ${airport.code}.`,
    });
    add({
      topic: 'Airport Codes',
      type: 'identification',
      prompt: `Type the 3-letter IATA code of ${airport.name} (${airport.country}).`,
      answer: airport.code,
      explanation: `${airport.name} uses the code ${airport.code}.`,
    });
    const airportTrue = index % 2 === 0;
    const wrongAirportCountry = airportCountries[(index + 13) % airportCountries.length];
    add({
      topic: 'Airport Codes',
      type: 'truefalse',
      prompt: `True or False: ${airport.code} is an airport code in ${airportTrue ? airport.country : wrongAirportCountry === airport.country ? airportCountries[(index + 19) % airportCountries.length] : wrongAirportCountry}.`,
      answer: airportTrue ? 'True' : 'False',
      explanation: `${airport.code} is ${airport.name} in ${airport.country}.`,
    });
  });

  // --- Subject term banks
  Object.entries(SUBJECT_GAMES).forEach(([code, config]) => {
    const topic = `${code} Subject Terms`;
    const rights = config.matchPairs.map((pair) => pair.right);
    const lefts = config.matchPairs.map((pair) => pair.left);
    config.matchPairs.forEach((pair, index) => {
      add({
        topic,
        type: 'multiple',
        prompt: `${code}: What does "${pair.left}" refer to?`,
        options: [pair.right, ...decoys(rights, pair.right, index)],
        answer: pair.right,
        explanation: `${pair.left}: ${pair.right}.`,
      });
      add({
        topic,
        type: 'multiple',
        prompt: `${code}: Which term matches this description? "${pair.right}"`,
        options: [pair.left, ...decoys(lefts, pair.left, index + 2)],
        answer: pair.left,
        explanation: `${pair.left}: ${pair.right}.`,
      });
      const pairTrue = index % 2 === 0;
      const wrongRight = rights[(index + 1) % rights.length];
      add({
        topic,
        type: 'truefalse',
        prompt: `True or False (${code}): "${pair.left}" means "${pairTrue ? pair.right : wrongRight}".`,
        answer: pairTrue ? 'True' : 'False',
        explanation: `${pair.left}: ${pair.right}.`,
      });
    });
  });

  return questions;
}

export const QUESTION_BANK: BankQuestion[] = buildBank();

export const QUIZ_TOPICS = [...new Set(QUESTION_BANK.map((q) => q.topic))].map((topic) => ({
  topic,
  count: QUESTION_BANK.filter((q) => q.topic === topic).length,
}));

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

export function buildQuiz(
  topics: string[],
  method: QuizMethod | 'mixed',
  count: number,
): BankQuestion[] {
  const pool = QUESTION_BANK.filter(
    (q) =>
      (topics.length === 0 || topics.includes(q.topic)) &&
      (method === 'mixed' || q.type === method),
  );
  return shuffle(pool)
    .slice(0, count)
    .map((q) => (q.options ? { ...q, options: shuffle(q.options) } : q));
}

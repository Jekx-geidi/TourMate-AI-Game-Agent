import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// Standalone, upsert-based seed for the Reading/Writing game vocabulary
// (docs/BRD.md v2.0). Never deletes existing rows -- safe to re-run against
// a database that already has real attempts recorded against these words.
const prisma = new PrismaClient();

interface VocabSeed {
  languageCode: 'ja';
  script: string;
  romanization: string;
  promptEnglish: string;
  englishAnswers: string[];
  category: string;
  difficulty: number;
}

// Tourism-service vocabulary: greetings, hospitality phrases, food, transport,
// and numbers a BS Tourism Management student would actually use with guests.
const JAPANESE_WORDS: VocabSeed[] = [
  {
    languageCode: 'ja',
    script: 'こんにちは',
    romanization: 'Konnichiwa',
    promptEnglish: 'Hello',
    englishAnswers: ['hello', 'hi', 'good afternoon'],
    category: 'greetings',
    difficulty: 1,
  },
  {
    languageCode: 'ja',
    script: 'おはようございます',
    romanization: 'Ohayou gozaimasu',
    promptEnglish: 'Good morning',
    englishAnswers: ['good morning'],
    category: 'greetings',
    difficulty: 1,
  },
  {
    languageCode: 'ja',
    script: 'こんばんは',
    romanization: 'Konbanwa',
    promptEnglish: 'Good evening',
    englishAnswers: ['good evening'],
    category: 'greetings',
    difficulty: 1,
  },
  {
    languageCode: 'ja',
    script: 'ありがとう',
    romanization: 'Arigatou',
    promptEnglish: 'Thanks',
    englishAnswers: ['thanks', 'thank you'],
    category: 'greetings',
    difficulty: 1,
  },
  {
    languageCode: 'ja',
    script: 'すみません',
    romanization: 'Sumimasen',
    promptEnglish: 'Excuse me',
    englishAnswers: ['excuse me', 'sorry'],
    category: 'greetings',
    difficulty: 1,
  },
  {
    languageCode: 'ja',
    script: 'いらっしゃいませ',
    romanization: 'Irasshaimase',
    promptEnglish: 'Welcome',
    englishAnswers: ['welcome'],
    category: 'hospitality',
    difficulty: 2,
  },
  {
    languageCode: 'ja',
    script: 'よろしくお願いします',
    romanization: 'Yoroshiku onegaishimasu',
    promptEnglish: 'Nice to meet you',
    englishAnswers: ['nice to meet you', 'please treat me well', 'pleased to meet you'],
    category: 'hospitality',
    difficulty: 3,
  },
  {
    languageCode: 'ja',
    script: 'チェックイン',
    romanization: 'Chekku in',
    promptEnglish: 'Check-in',
    englishAnswers: ['check-in', 'check in'],
    category: 'hospitality',
    difficulty: 1,
  },
  {
    languageCode: 'ja',
    script: 'パスポート',
    romanization: 'Pasupooto',
    promptEnglish: 'Passport',
    englishAnswers: ['passport'],
    category: 'hospitality',
    difficulty: 1,
  },
  {
    languageCode: 'ja',
    script: '予約',
    romanization: 'Yoyaku',
    promptEnglish: 'Reservation',
    englishAnswers: ['reservation', 'booking'],
    category: 'hospitality',
    difficulty: 2,
  },
  {
    languageCode: 'ja',
    script: 'ホテル',
    romanization: 'Hoteru',
    promptEnglish: 'Hotel',
    englishAnswers: ['hotel'],
    category: 'hospitality',
    difficulty: 1,
  },
  {
    languageCode: 'ja',
    script: '空港',
    romanization: 'Kuukou',
    promptEnglish: 'Airport',
    englishAnswers: ['airport'],
    category: 'transport',
    difficulty: 1,
  },
  {
    languageCode: 'ja',
    script: '電車',
    romanization: 'Densha',
    promptEnglish: 'Train',
    englishAnswers: ['train'],
    category: 'transport',
    difficulty: 1,
  },
  {
    languageCode: 'ja',
    script: 'タクシー',
    romanization: 'Takushii',
    promptEnglish: 'Taxi',
    englishAnswers: ['taxi', 'cab'],
    category: 'transport',
    difficulty: 1,
  },
  {
    languageCode: 'ja',
    script: '荷物',
    romanization: 'Nimotsu',
    promptEnglish: 'Luggage',
    englishAnswers: ['luggage', 'baggage'],
    category: 'transport',
    difficulty: 2,
  },
  {
    languageCode: 'ja',
    script: '出口',
    romanization: 'Deguchi',
    promptEnglish: 'Exit',
    englishAnswers: ['exit'],
    category: 'transport',
    difficulty: 1,
  },
  {
    languageCode: 'ja',
    script: '入口',
    romanization: 'Iriguchi',
    promptEnglish: 'Entrance',
    englishAnswers: ['entrance'],
    category: 'transport',
    difficulty: 1,
  },
  {
    languageCode: 'ja',
    script: '美味しい',
    romanization: 'Oishii',
    promptEnglish: 'Delicious',
    englishAnswers: ['delicious', 'tasty'],
    category: 'food',
    difficulty: 2,
  },
  {
    languageCode: 'ja',
    script: 'レストラン',
    romanization: 'Resutoran',
    promptEnglish: 'Restaurant',
    englishAnswers: ['restaurant'],
    category: 'food',
    difficulty: 1,
  },
  {
    languageCode: 'ja',
    script: 'お水',
    romanization: 'Omizu',
    promptEnglish: 'Water',
    englishAnswers: ['water'],
    category: 'food',
    difficulty: 1,
  },
  {
    languageCode: 'ja',
    script: 'メニュー',
    romanization: 'Menyuu',
    promptEnglish: 'Menu',
    englishAnswers: ['menu'],
    category: 'food',
    difficulty: 1,
  },
  {
    languageCode: 'ja',
    script: 'いち',
    romanization: 'Ichi',
    promptEnglish: 'One',
    englishAnswers: ['one', '1'],
    category: 'numbers',
    difficulty: 1,
  },
  {
    languageCode: 'ja',
    script: 'に',
    romanization: 'Ni',
    promptEnglish: 'Two',
    englishAnswers: ['two', '2'],
    category: 'numbers',
    difficulty: 1,
  },
  {
    languageCode: 'ja',
    script: 'さん',
    romanization: 'San',
    promptEnglish: 'Three',
    englishAnswers: ['three', '3'],
    category: 'numbers',
    difficulty: 1,
  },
];

async function main() {
  for (const word of JAPANESE_WORDS) {
    await prisma.vocabWord.upsert({
      where: { languageCode_script: { languageCode: word.languageCode, script: word.script } },
      create: word,
      update: {
        romanization: word.romanization,
        promptEnglish: word.promptEnglish,
        englishAnswers: word.englishAnswers,
        category: word.category,
        difficulty: word.difficulty,
      },
    });
  }

  const total = await prisma.vocabWord.count({ where: { languageCode: 'ja' } });
  console.log('Language game vocabulary seed complete.', {
    seeded: JAPANESE_WORDS.length,
    totalJapaneseWordsInDb: total,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

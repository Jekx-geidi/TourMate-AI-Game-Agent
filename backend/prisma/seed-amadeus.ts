import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// Standalone, upsert-based seed for the first Amadeus Practice vertical
// slice (docs pasted 2026-08-20, section 53: "Build one complete vertical
// slice before creating dozens of scenarios"). Never deletes existing rows.
const prisma = new PrismaClient();

interface StepSeed {
  orderIndex: number;
  intent: string;
  title: string;
  instruction: string;
  requiredTokens: string[][];
  hints: string[];
}

const SCENARIO = {
  slug: 'mnl-nrt-basic-reservation',
  title: 'Manila to Tokyo Reservation',
  difficulty: 'SIMPLE',
  category: 'PNR_BASIC',
  briefJson: {
    passengerName: 'Maria Santos',
    origin: 'MNL',
    destination: 'NRT',
    travelDate: '18SEP',
  },
};

const STEPS: StepSeed[] = [
  {
    orderIndex: 0,
    intent: 'CHECK_AVAILABILITY',
    title: 'Check availability',
    instruction:
      'Maria Santos wants to fly from Manila (MNL) to Tokyo Narita (NRT) on 18SEP. Type a command requesting availability for this route and date.',
    requiredTokens: [['MNL'], ['NRT'], ['18SEP']],
    hints: [
      'Include the origin airport code: MNL.',
      'Include the destination airport code: NRT.',
      'Include the travel date: 18SEP.',
    ],
  },
  {
    orderIndex: 1,
    intent: 'SELECT_SEGMENT',
    title: 'Select a flight',
    instruction: 'Select flight option 1 from the availability results.',
    requiredTokens: [
      ['SELECT', 'CHOOSE', 'PICK'],
      ['1', 'ONE'],
    ],
    hints: ['Use a word like SELECT, CHOOSE, or PICK.', 'Reference option 1.'],
  },
  {
    orderIndex: 2,
    intent: 'ADD_PASSENGER',
    title: 'Add the passenger',
    instruction: 'Add passenger Maria Santos to the reservation.',
    requiredTokens: [['SANTOS'], ['MARIA']],
    hints: [
      "Include the passenger's last name: SANTOS.",
      "Include the passenger's first name: MARIA.",
    ],
  },
  {
    orderIndex: 3,
    intent: 'COMPLETE_PNR',
    title: 'Finish the reservation',
    instruction: 'Complete and save the reservation.',
    requiredTokens: [['END', 'SAVE', 'FINISH', 'COMPLETE']],
    hints: ['Use a word like END, SAVE, FINISH, or COMPLETE to close out the reservation.'],
  },
];

async function main() {
  const scenario = await prisma.amadeusScenario.upsert({
    where: { slug: SCENARIO.slug },
    create: SCENARIO,
    update: {
      title: SCENARIO.title,
      difficulty: SCENARIO.difficulty,
      category: SCENARIO.category,
      briefJson: SCENARIO.briefJson,
    },
  });

  for (const step of STEPS) {
    await prisma.amadeusScenarioStep.upsert({
      where: { scenarioId_orderIndex: { scenarioId: scenario.id, orderIndex: step.orderIndex } },
      create: { ...step, scenarioId: scenario.id },
      update: {
        intent: step.intent,
        title: step.title,
        instruction: step.instruction,
        requiredTokens: step.requiredTokens,
        hints: step.hints,
      },
    });
  }

  console.log('Amadeus Practice seed complete.', {
    scenario: scenario.slug,
    steps: STEPS.length,
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

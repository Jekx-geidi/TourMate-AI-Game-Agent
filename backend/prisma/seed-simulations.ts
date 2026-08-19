import type { PrismaClient } from '@prisma/client';

// Idempotent, upsert-based seed for the first TourMate Quest mission
// (docs/PLAN.md Phase 2, docs/CLAUDE.md section 7 curriculum draft). Safe to
// re-run: re-running never duplicates the competency rows or the mission's
// identity, and a published version is never mutated in place -- only a new
// version would be added for content changes (docs/TDD.md section 8.3).

const COMPETENCIES = [
  {
    code: 'communication',
    name: 'Communication',
    description: 'Clear, calm, and respectful communication with a guest or passenger.',
  },
  {
    code: 'service-recovery',
    name: 'Service Recovery',
    description: 'Turning a service disruption into a constructive, guest-centered outcome.',
  },
  {
    code: 'safety-policy-awareness',
    name: 'Safety & Policy Awareness',
    description: 'Following approved procedures instead of inventing policy, compensation, or safety rules.',
  },
  {
    code: 'problem-solving',
    name: 'Problem-Solving',
    description: 'Identifying practical, feasible next steps under real constraints.',
  },
  {
    code: 'professionalism',
    name: 'Professionalism',
    description: 'Maintaining composure, boundaries, and workplace conduct under pressure.',
  },
] as const;

const SCORING_WEIGHTS = {
  communication: 25,
  'service-recovery': 25,
  'safety-policy-awareness': 20,
  'problem-solving': 20,
  professionalism: 10,
};

const OBJECTIVES = [
  "Acknowledge a distressed passenger's concern with empathy and professionalism.",
  'Communicate confirmed flight information clearly, without inventing policy or promises.',
  'Present approved next-step options and escalate appropriately when needed.',
  'Maintain composure and set respectful boundaries during continued frustration.',
  'Close the interaction with a clear next step and proper documentation.',
];

interface StepDefinition {
  title: string;
  prompt: string;
  guidance?: string;
  options: Array<{
    key: string;
    text: string;
    consequence: string;
    rubricPoints: Partial<Record<(typeof COMPETENCIES)[number]['code'], 0 | 1 | 2 | 3 | 4>>;
    learningTags: string[];
  }>;
}

const STEPS: StepDefinition[] = [
  {
    title: 'Open the interaction',
    prompt:
      'The passenger approaches visibly upset and says the delay will make them miss a connecting flight. What do you do first?',
    options: [
      {
        key: 'A',
        text: 'Acknowledge their concern calmly, then verify the booking and flight details through the approved system.',
        consequence: 'The passenger feels heard and you have accurate information before saying anything further.',
        rubricPoints: { communication: 4, 'service-recovery': 3, 'safety-policy-awareness': 4, 'problem-solving': 3, professionalism: 4 },
        learningTags: ['acknowledges-concern', 'verifies-before-promising', 'avoids-speculation'],
      },
      {
        key: 'B',
        text: 'Say you understand, then move straight to looking for a solution without checking the booking yet.',
        consequence: 'The passenger appreciates the warmth, but you risk offering an option that turns out to be wrong.',
        rubricPoints: { communication: 3, 'service-recovery': 2, 'safety-policy-awareness': 2, 'problem-solving': 2, professionalism: 3 },
        learningTags: ['acknowledges-concern'],
      },
      {
        key: 'C',
        text: 'Tell them delays happen and there is nothing you can do right now.',
        consequence: 'The passenger becomes more frustrated and feels dismissed.',
        rubricPoints: { communication: 1, 'service-recovery': 1, 'safety-policy-awareness': 1, 'problem-solving': 1, professionalism: 1 },
        learningTags: ['dismisses-concern'],
      },
      {
        key: 'D',
        text: 'Blame the ground crew for the delay and promise a free rebooking before checking anything.',
        consequence: 'You may promise something the airline cannot actually provide, and blaming a colleague looks unprofessional.',
        rubricPoints: { communication: 0, 'service-recovery': 0, 'safety-policy-awareness': 0, 'problem-solving': 0, professionalism: 0 },
        learningTags: ['blames-others', 'promises-before-checking'],
      },
    ],
  },
  {
    title: 'Establish what is known',
    prompt: 'You have the booking open. How do you explain the situation to the passenger?',
    options: [
      {
        key: 'A',
        text: 'Explain the confirmed delay in plain language, clearly separating confirmed facts from estimates, then check the connection and re-accommodation options.',
        consequence: 'The passenger understands exactly what is known and what is still uncertain.',
        rubricPoints: { communication: 4, 'service-recovery': 4, 'safety-policy-awareness': 3, 'problem-solving': 4, professionalism: 3 },
        learningTags: ['plain-language', 'distinguishes-confirmed-vs-estimate', 'checks-reaccommodation'],
      },
      {
        key: 'B',
        text: 'Give the passenger your best guess at the new arrival time as if it were confirmed.',
        consequence: 'If the estimate changes, the passenger will feel misled even though you meant well.',
        rubricPoints: { communication: 2, 'service-recovery': 2, 'safety-policy-awareness': 2, 'problem-solving': 2, professionalism: 2 },
        learningTags: ['conflates-estimate-as-fact'],
      },
      {
        key: 'C',
        text: 'Give a vague answer like "it will probably be fine" without checking anything specific.',
        consequence: 'The passenger has no useful information to plan around.',
        rubricPoints: { communication: 1, 'service-recovery': 1, 'safety-policy-awareness': 1, 'problem-solving': 1, professionalism: 1 },
        learningTags: ['vague-response'],
      },
      {
        key: 'D',
        text: 'Tell the passenger they are entitled to a specific cash compensation amount.',
        consequence: 'You have invented a policy that may not exist, which can create a real service and legal problem.',
        rubricPoints: { communication: 0, 'service-recovery': 0, 'safety-policy-awareness': 0, 'problem-solving': 0, professionalism: 0 },
        learningTags: ['invents-policy'],
      },
    ],
  },
  {
    title: 'Offer practical next steps',
    prompt: 'The passenger asks what can actually be done about the missed connection. How do you respond?',
    options: [
      {
        key: 'A',
        text: 'Present the approved re-accommodation options clearly, prioritize the safest and most feasible one, confirm the passenger understands, and escalate to an authorized colleague if the case needs it.',
        consequence: 'The passenger leaves with a clear, workable next step.',
        rubricPoints: { communication: 3, 'service-recovery': 4, 'safety-policy-awareness': 4, 'problem-solving': 4, professionalism: 3 },
        learningTags: ['presents-approved-options', 'escalates-appropriately'],
      },
      {
        key: 'B',
        text: 'Offer one option quickly without confirming whether the passenger actually understood or agreed.',
        consequence: 'The passenger may act on an option that does not actually fit their situation.',
        rubricPoints: { communication: 2, 'service-recovery': 3, 'safety-policy-awareness': 3, 'problem-solving': 2, professionalism: 2 },
        learningTags: ['single-option-no-confirmation'],
      },
      {
        key: 'C',
        text: 'List several options in confusing technical terms without explaining any of them.',
        consequence: 'The passenger is more confused than before.',
        rubricPoints: { communication: 1, 'service-recovery': 1, 'safety-policy-awareness': 1, 'problem-solving': 1, professionalism: 1 },
        learningTags: ['confusing-options'],
      },
      {
        key: 'D',
        text: 'Promise a specific upgrade or outcome that is not part of any approved procedure.',
        consequence: 'This creates an unauthorized commitment the airline may not be able to honor.',
        rubricPoints: { communication: 0, 'service-recovery': 0, 'safety-policy-awareness': 0, 'problem-solving': 0, professionalism: 0 },
        learningTags: ['promises-unapproved-outcome'],
      },
    ],
  },
  {
    title: 'Handle continued frustration',
    prompt: 'The passenger is still upset and starts raising their voice. How do you respond?',
    options: [
      {
        key: 'A',
        text: 'Stay calm and empathetic, set a respectful boundary if the behavior becomes abusive, restate what can be done now, and ask an authorized colleague for help if needed.',
        consequence: 'The interaction stays professional and the passenger regains some composure.',
        rubricPoints: { communication: 4, 'service-recovery': 3, 'safety-policy-awareness': 3, 'problem-solving': 3, professionalism: 4 },
        learningTags: ['remains-calm', 'sets-respectful-boundary', 'seeks-assistance-per-procedure'],
      },
      {
        key: 'B',
        text: 'Keep apologizing repeatedly without adding any new information.',
        consequence: 'The apologies start to feel empty and do not resolve anything.',
        rubricPoints: { communication: 2, 'service-recovery': 2, 'safety-policy-awareness': 2, 'problem-solving': 1, professionalism: 2 },
        learningTags: ['apologizes-without-substance'],
      },
      {
        key: 'C',
        text: 'Become visibly defensive and stop actively listening.',
        consequence: 'The passenger feels unheard and the situation escalates further.',
        rubricPoints: { communication: 1, 'service-recovery': 1, 'safety-policy-awareness': 1, 'problem-solving': 1, professionalism: 1 },
        learningTags: ['becomes-defensive'],
      },
      {
        key: 'D',
        text: 'Argue back and match the passenger’s tone.',
        consequence: 'This turns a service problem into a conflict and can put you or the passenger at risk.',
        rubricPoints: { communication: 0, 'service-recovery': 0, 'safety-policy-awareness': 0, 'problem-solving': 0, professionalism: 0 },
        learningTags: ['escalates-conflict'],
      },
    ],
  },
  {
    title: 'Close and document',
    prompt: 'The passenger is ready to move on. How do you end the interaction?',
    options: [
      {
        key: 'A',
        text: 'Summarize the selected next step, provide the correct service point or channel, confirm there is nothing else urgent, and record the interaction using approved procedures.',
        consequence: 'The passenger leaves with clarity, and there is a proper record of what happened.',
        rubricPoints: { communication: 4, 'service-recovery': 4, 'safety-policy-awareness': 4, 'problem-solving': 3, professionalism: 4 },
        learningTags: ['summarizes-next-step', 'records-per-procedure'],
      },
      {
        key: 'B',
        text: 'End the conversation as soon as the passenger seems calmer, without a clear summary.',
        consequence: 'The passenger may be unsure exactly what happens next.',
        rubricPoints: { communication: 2, 'service-recovery': 2, 'safety-policy-awareness': 2, 'problem-solving': 2, professionalism: 2 },
        learningTags: ['abrupt-close'],
      },
      {
        key: 'C',
        text: 'Resolve the situation verbally but skip recording any service notes.',
        consequence: 'The next colleague who assists this passenger has no record of what already happened.',
        rubricPoints: { communication: 2, 'service-recovery': 2, 'safety-policy-awareness': 1, 'problem-solving': 2, professionalism: 2 },
        learningTags: ['no-documentation'],
      },
      {
        key: 'D',
        text: 'Tell the passenger it is "not your problem anymore" once they step away from your counter.',
        consequence: 'This is dismissive and can seriously damage the airline’s reputation with this passenger.',
        rubricPoints: { communication: 0, 'service-recovery': 0, 'safety-policy-awareness': 0, 'problem-solving': 0, professionalism: 0 },
        learningTags: ['dismissive-close'],
      },
    ],
  },
];

export interface SeedSimulationsOptions {
  airmgtSubjectId?: string;
  relatedLessonId?: string;
}

export async function seedDelayedFlightMission(
  prisma: PrismaClient,
  options: SeedSimulationsOptions = {},
) {
  for (const competency of COMPETENCIES) {
    await prisma.competency.upsert({
      where: { code: competency.code },
      update: { name: competency.name, description: competency.description },
      create: competency,
    });
  }

  const simulation = await prisma.simulation.upsert({
    where: { slug: 'delayed-flight-passenger-assistance' },
    update: {
      title: 'Delayed Flight Passenger Assistance',
      summary: 'Practice service recovery, communication, and professionalism during a passenger delay.',
      subjectId: options.airmgtSubjectId,
      difficulty: 'BEGINNER',
      status: 'PUBLISHED',
    },
    create: {
      slug: 'delayed-flight-passenger-assistance',
      title: 'Delayed Flight Passenger Assistance',
      summary: 'Practice service recovery, communication, and professionalism during a passenger delay.',
      subjectId: options.airmgtSubjectId,
      difficulty: 'BEGINNER',
      status: 'PUBLISHED',
    },
  });

  const existingVersion = await prisma.simulationVersion.findUnique({
    where: { simulationId_version: { simulationId: simulation.id, version: 1 } },
  });
  if (existingVersion) {
    return { simulation, version: existingVersion, created: false };
  }

  const version = await prisma.simulationVersion.create({
    data: {
      simulationId: simulation.id,
      version: 1,
      role: 'Airport customer-service trainee',
      context:
        'A passenger is upset because a delayed flight may cause them to miss a connecting flight. Respond professionally without inventing policy or promising an unauthorized outcome.',
      objectives: OBJECTIVES,
      competencyCodes: COMPETENCIES.map((c) => c.code),
      scoringWeights: SCORING_WEIGHTS,
      scorePolicyVersion: 'v1',
      estimatedStepCount: STEPS.length,
      publishedAt: new Date(),
      steps: {
        create: STEPS.map((step, index) => ({
          orderIndex: index + 1,
          title: step.title,
          prompt: step.prompt,
          guidance: step.guidance ?? null,
          options: {
            create: step.options.map((option) => ({
              optionKey: option.key,
              text: option.text,
              consequence: option.consequence,
              rubricPoints: option.rubricPoints,
              learningTags: option.learningTags,
            })),
          },
        })),
      },
      ...(options.relatedLessonId
        ? {
            relatedLessons: {
              create: [{ lessonId: options.relatedLessonId, relationType: 'RECOMMENDED', orderIndex: 0 }],
            },
          }
        : {}),
    },
  });

  return { simulation, version, created: true };
}

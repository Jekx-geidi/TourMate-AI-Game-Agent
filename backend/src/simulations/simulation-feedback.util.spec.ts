import { buildDeterministicFeedback } from './simulation-feedback.util';

const STEPS = [
  {
    stepId: 'step-1',
    options: [
      {
        id: 'opt-1-best',
        optionKey: 'A',
        rubricPoints: {
          communication: 4,
          'service-recovery': 4,
          'safety-policy-awareness': 4,
          'problem-solving': 4,
          professionalism: 4,
        },
        learningTags: ['acknowledges-concern', 'verifies-before-promising'],
      },
      { id: 'opt-1-worst', optionKey: 'B', rubricPoints: {}, learningTags: [] },
    ],
  },
];

describe('buildDeterministicFeedback', () => {
  it('produces a strengths-only summary and a passport action for a strong result with no related lesson', () => {
    const feedback = buildDeterministicFeedback({
      overallScore: 95,
      categoryScores: {
        communication: 100,
        'service-recovery': 100,
        'safety-policy-awareness': 100,
        'problem-solving': 100,
        professionalism: 100,
      },
      steps: STEPS,
      decisions: [{ stepId: 'step-1', optionId: 'opt-1-best' }],
      relatedLesson: null,
    });

    expect(feedback.improvements).toHaveLength(0);
    expect(feedback.strengths.length).toBeGreaterThan(0);
    expect(feedback.strengths[0].evidence).toMatch(
      /acknowledges concern|verifies before promising/,
    );
    expect(feedback.nextAction.type).toBe('PASSPORT');
  });

  it('recommends the related lesson when the score is below the strength threshold', () => {
    const feedback = buildDeterministicFeedback({
      overallScore: 55,
      categoryScores: {
        communication: 40,
        'service-recovery': 50,
        'safety-policy-awareness': 60,
        'problem-solving': 55,
        professionalism: 70,
      },
      steps: STEPS,
      decisions: [{ stepId: 'step-1', optionId: 'opt-1-worst' }],
      relatedLesson: {
        id: 'lesson-1',
        title: 'Passenger Handling and Ground Services',
        route: '/subjects/x/lessons/lesson-1',
      },
    });

    expect(feedback.improvements.length).toBeGreaterThan(0);
    expect(feedback.nextAction).toMatchObject({
      type: 'LESSON',
      id: 'lesson-1',
    });
  });

  it('never returns more than three strengths or three improvements', () => {
    const feedback = buildDeterministicFeedback({
      overallScore: 50,
      categoryScores: {
        communication: 10,
        'service-recovery': 20,
        'safety-policy-awareness': 30,
        'problem-solving': 40,
        professionalism: 50,
      },
      steps: STEPS,
      decisions: [{ stepId: 'step-1', optionId: 'opt-1-worst' }],
      relatedLesson: null,
    });

    expect(feedback.strengths.length).toBeLessThanOrEqual(3);
    expect(feedback.improvements.length).toBeLessThanOrEqual(3);
  });
});

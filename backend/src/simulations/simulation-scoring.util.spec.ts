import {
  calculateSimulationScore,
  SimulationScoringError,
} from './simulation-scoring.util';
import type { ScoringInput } from './simulation.types';

const WEIGHTS = {
  communication: 25,
  'service-recovery': 25,
  'safety-policy-awareness': 20,
  'problem-solving': 20,
  professionalism: 10,
};

function buildInput(overrides: Partial<ScoringInput> = {}): ScoringInput {
  const steps = [
    {
      stepId: 'step-1',
      options: [
        {
          id: 'opt-1-best',
          optionKey: 'A',
          rubricPoints: {
            communication: 4,
            'service-recovery': 3,
            'safety-policy-awareness': 4,
            'problem-solving': 3,
            professionalism: 4,
          },
        },
        {
          id: 'opt-1-worst',
          optionKey: 'B',
          rubricPoints: {
            communication: 0,
            'service-recovery': 0,
            'safety-policy-awareness': 0,
            'problem-solving': 0,
            professionalism: 0,
          },
        },
      ],
    },
    {
      stepId: 'step-2',
      options: [
        {
          id: 'opt-2-best',
          optionKey: 'A',
          rubricPoints: {
            communication: 4,
            'service-recovery': 4,
            'safety-policy-awareness': 3,
            'problem-solving': 4,
            professionalism: 3,
          },
        },
        {
          id: 'opt-2-worst',
          optionKey: 'B',
          rubricPoints: {
            communication: 1,
            'service-recovery': 1,
            'safety-policy-awareness': 1,
            'problem-solving': 1,
            professionalism: 1,
          },
        },
      ],
    },
  ];

  return {
    steps,
    decisions: [
      { stepId: 'step-1', optionId: 'opt-1-best' },
      { stepId: 'step-2', optionId: 'opt-2-best' },
    ],
    scoringWeights: WEIGHTS,
    ...overrides,
  };
}

describe('calculateSimulationScore', () => {
  it('returns 100 for every category when the best option is chosen at every step', () => {
    const result = calculateSimulationScore(buildInput());

    expect(result.categoryScores).toEqual({
      communication: 100,
      'service-recovery': 100,
      'safety-policy-awareness': 100,
      'problem-solving': 100,
      professionalism: 100,
    });
    expect(result.overallScore).toBe(100);
  });

  it('returns 0 for every category when every choice scores zero points', () => {
    const zeroPoints = {
      communication: 0 as const,
      'service-recovery': 0 as const,
      'safety-policy-awareness': 0 as const,
      'problem-solving': 0 as const,
      professionalism: 0 as const,
    };
    const input = buildInput({
      steps: [
        {
          stepId: 'step-1',
          options: [
            {
              id: 'opt-1-best',
              optionKey: 'A',
              rubricPoints: { ...zeroPoints, communication: 4 },
            },
            { id: 'opt-1-worst', optionKey: 'B', rubricPoints: zeroPoints },
          ],
        },
        {
          stepId: 'step-2',
          options: [
            {
              id: 'opt-2-best',
              optionKey: 'A',
              rubricPoints: { ...zeroPoints, communication: 4 },
            },
            { id: 'opt-2-worst', optionKey: 'B', rubricPoints: zeroPoints },
          ],
        },
      ],
      decisions: [
        { stepId: 'step-1', optionId: 'opt-1-worst' },
        { stepId: 'step-2', optionId: 'opt-2-worst' },
      ],
    });

    const result = calculateSimulationScore(input);

    expect(result.overallScore).toBe(0);
    expect(
      Object.values(result.categoryScores).every((score) => score === 0),
    ).toBe(true);
  });

  it('computes exact category and overall scores for a known mixed path', () => {
    const input = buildInput({
      decisions: [
        { stepId: 'step-1', optionId: 'opt-1-best' },
        { stepId: 'step-2', optionId: 'opt-2-worst' },
      ],
    });

    const result = calculateSimulationScore(input);

    // communication: earned 4+1=5, max 4+4=8 -> round(5/8*100)=63
    expect(result.categoryScores.communication).toBe(63);
    // service-recovery: earned 3+1=4, max 3+4=7 -> round(4/7*100)=57
    expect(result.categoryScores['service-recovery']).toBe(57);
    // safety-policy-awareness: earned 4+1=5, max 4+3=7 -> round(5/7*100)=71
    expect(result.categoryScores['safety-policy-awareness']).toBe(71);
    // problem-solving: earned 3+1=4, max 3+4=7 -> round(4/7*100)=57
    expect(result.categoryScores['problem-solving']).toBe(57);
    // professionalism: earned 4+1=5, max 4+3=7 -> round(5/7*100)=71
    expect(result.categoryScores.professionalism).toBe(71);

    // overall = round(63*0.25 + 57*0.25 + 71*0.20 + 57*0.20 + 71*0.10)
    //         = round(15.75 + 14.25 + 14.2 + 11.4 + 7.1) = round(62.7) = 63
    expect(result.overallScore).toBe(63);
  });

  it('is a pure function: the same decisions always produce the same result', () => {
    const input = buildInput();
    const first = calculateSimulationScore(input);
    const second = calculateSimulationScore(input);
    expect(second).toEqual(first);
  });

  it('rejects weights that do not sum to 100', () => {
    const input = buildInput({
      scoringWeights: { ...WEIGHTS, communication: 26 },
    });

    expect(() => calculateSimulationScore(input)).toThrow(
      SimulationScoringError,
    );
  });

  it('rejects an out-of-range rubric point value', () => {
    const input = buildInput();
    input.steps[0].options[0].rubricPoints.communication = 5;

    expect(() => calculateSimulationScore(input)).toThrow(
      SimulationScoringError,
    );
  });

  it('rejects a missing required decision', () => {
    const input = buildInput({
      decisions: [{ stepId: 'step-1', optionId: 'opt-1-best' }],
    });

    expect(() => calculateSimulationScore(input)).toThrow(
      SimulationScoringError,
    );
  });

  it('rejects a decision that references an option outside its step', () => {
    const input = buildInput({
      decisions: [
        { stepId: 'step-1', optionId: 'opt-2-best' },
        { stepId: 'step-2', optionId: 'opt-2-best' },
      ],
    });

    expect(() => calculateSimulationScore(input)).toThrow(
      SimulationScoringError,
    );
  });

  it('rejects a decision that references an unknown step', () => {
    const input = buildInput({
      decisions: [
        { stepId: 'step-unknown', optionId: 'opt-1-best' },
        { stepId: 'step-2', optionId: 'opt-2-best' },
      ],
    });

    expect(() => calculateSimulationScore(input)).toThrow(
      SimulationScoringError,
    );
  });
});

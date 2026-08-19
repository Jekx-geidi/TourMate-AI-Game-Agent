import { validateCoachFeedbackShape } from './simulation-coach-validation.util';

describe('validateCoachFeedbackShape', () => {
  it('accepts a well-formed AI output shape', () => {
    const result = validateCoachFeedbackShape({
      summary: 'Nice work overall.',
      strengths: [{ competency: 'communication', evidence: 'Calm and clear.' }],
      improvements: [
        { competency: 'problem-solving', suggestion: 'Consider more options.' },
      ],
      nextAction: 'Review the related lesson.',
    });

    expect(result).toEqual({
      summary: 'Nice work overall.',
      strengths: [{ competency: 'communication', evidence: 'Calm and clear.' }],
      improvements: [
        { competency: 'problem-solving', suggestion: 'Consider more options.' },
      ],
      nextAction: 'Review the related lesson.',
    });
  });

  it('rejects output referencing an unknown competency code', () => {
    const result = validateCoachFeedbackShape({
      summary: 'Nice work overall.',
      strengths: [{ competency: 'not-a-real-competency', evidence: 'x' }],
      improvements: [],
      nextAction: 'Try again.',
    });

    expect(result).toBeNull();
  });

  it('rejects output with more than three strengths', () => {
    const result = validateCoachFeedbackShape({
      summary: 'Nice work overall.',
      strengths: [
        { competency: 'communication', evidence: 'a' },
        { competency: 'service-recovery', evidence: 'b' },
        { competency: 'problem-solving', evidence: 'c' },
        { competency: 'professionalism', evidence: 'd' },
      ],
      improvements: [],
      nextAction: 'Try again.',
    });

    expect(result).toBeNull();
  });

  it('rejects a missing summary', () => {
    const result = validateCoachFeedbackShape({
      strengths: [],
      improvements: [],
      nextAction: 'Try again.',
    });

    expect(result).toBeNull();
  });

  it('rejects a non-object input', () => {
    expect(validateCoachFeedbackShape(null)).toBeNull();
    expect(validateCoachFeedbackShape('a string')).toBeNull();
    expect(validateCoachFeedbackShape(42)).toBeNull();
  });

  it('rejects an oversized text field', () => {
    const result = validateCoachFeedbackShape({
      summary: 'x'.repeat(500),
      strengths: [],
      improvements: [],
      nextAction: 'Try again.',
    });

    expect(result).toBeNull();
  });
});

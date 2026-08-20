import { scoreCommand } from './amadeus-scoring.util';

const AVAILABILITY_SLOTS = [['MNL'], ['NRT'], ['18SEP']];

describe('scoreCommand', () => {
  it('scores all required slots present as PERFECT', () => {
    expect(scoreCommand('AN 18SEP MNL NRT', AVAILABILITY_SLOTS).tier).toBe('PERFECT');
  });

  it('is case- and whitespace-insensitive', () => {
    expect(scoreCommand('  an   18sep   mnl   nrt  ', AVAILABILITY_SLOTS).tier).toBe('PERFECT');
  });

  it('accepts any synonym within a slot', () => {
    const slots = [['SELECT', 'CHOOSE', 'PICK'], ['1']];
    expect(scoreCommand('CHOOSE OPTION 1', slots).tier).toBe('PERFECT');
  });

  it('scores 2/3 slots as CLOSE', () => {
    const result = scoreCommand('AN 18SEP MNL', AVAILABILITY_SLOTS);
    expect(result.tier).toBe('CLOSE');
    expect(result.missingSlotHintIndexes).toEqual([1]);
  });

  it('scores 3/4 slots as GREAT', () => {
    const slots = [['MNL'], ['NRT'], ['18SEP'], ['SANTOS']];
    expect(scoreCommand('AN 18SEP MNL NRT', slots).tier).toBe('GREAT');
  });

  it('scores 1/3 slots as ALMOST', () => {
    expect(scoreCommand('AN MNL', AVAILABILITY_SLOTS).tier).toBe('ALMOST');
  });

  it('scores no matching slots as WRONG', () => {
    expect(scoreCommand('HELLO THERE', AVAILABILITY_SLOTS).tier).toBe('WRONG');
  });

  it('scores an empty command as WRONG', () => {
    expect(scoreCommand('   ', AVAILABILITY_SLOTS).tier).toBe('WRONG');
  });

  it('treats a scenario with no required slots as trivially PERFECT', () => {
    expect(scoreCommand('anything', []).tier).toBe('PERFECT');
  });
});

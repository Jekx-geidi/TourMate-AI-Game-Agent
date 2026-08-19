import {
  calculateFirstCompletionXp,
  calculateReplayXp,
  levelForXp,
} from './xp-policy.util';

describe('calculateFirstCompletionXp', () => {
  it('returns 40 for a 0% completion (base + bonus, no score component)', () => {
    expect(calculateFirstCompletionXp(0)).toBe(40);
  });

  it('returns 60 for a perfect 100% completion', () => {
    expect(calculateFirstCompletionXp(100)).toBe(60);
  });

  it('returns a value in the documented 40-60 range for a mid score', () => {
    const xp = calculateFirstCompletionXp(63);
    expect(xp).toBeGreaterThanOrEqual(40);
    expect(xp).toBeLessThanOrEqual(60);
    expect(xp).toBe(20 + Math.floor(63 / 5) + 20);
  });
});

describe('calculateReplayXp', () => {
  it('returns 0 when there is no prior best', () => {
    expect(calculateReplayXp(80, null)).toBe(0);
  });

  it('returns 0 when the replay does not improve the personal best', () => {
    expect(calculateReplayXp(70, 80)).toBe(0);
    expect(calculateReplayXp(80, 80)).toBe(0);
  });

  it('awards capped XP for a new personal best', () => {
    expect(calculateReplayXp(85, 80)).toBe(11); // 10 + floor(5/5)
    expect(calculateReplayXp(100, 0)).toBe(20); // capped at 20
  });
});

describe('levelForXp', () => {
  it('is level 1 at 0 xp', () => {
    expect(levelForXp(0)).toMatchObject({ level: 1, xpToNextLevel: 100 });
  });

  it('stays level 1 just below the level-2 threshold', () => {
    expect(levelForXp(99)).toMatchObject({ level: 1, xpToNextLevel: 1 });
  });

  it('reaches level 2 exactly at its threshold', () => {
    expect(levelForXp(100)).toMatchObject({ level: 2, xpToNextLevel: 150 });
  });

  it('reaches the last tabled level at its threshold', () => {
    expect(levelForXp(1000)).toMatchObject({ level: 6 });
  });

  it('extends level progression beyond the table using a flat XP step', () => {
    expect(levelForXp(1300)).toMatchObject({ level: 7, xpToNextLevel: 300 });
    expect(levelForXp(1600)).toMatchObject({ level: 8, xpToNextLevel: 300 });
  });
});

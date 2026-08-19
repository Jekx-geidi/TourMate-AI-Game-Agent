// XP and level policy per docs/TDD.md section 15 and docs/PLAN.md section 9.
// Kept as a pure, framework-free module so it is trivially unit-testable and
// so both the completion transaction and any future display code compute
// levels identically from a single source of truth.

export const XP_POLICY_VERSION = 'v1';

const FIRST_COMPLETION_BASE_XP = 20;
const FIRST_COMPLETION_BONUS_XP = 20;
const REPLAY_BASE_XP = 10;
const REPLAY_XP_CAP = 20;

export function calculateFirstCompletionXp(overallScore: number): number {
  return (
    FIRST_COMPLETION_BASE_XP +
    Math.floor(overallScore / 5) +
    FIRST_COMPLETION_BONUS_XP
  );
}

/**
 * Replay XP follows the first-slice anti-farming policy: only a new personal
 * best earns XP, and the amount is capped regardless of the improvement size.
 */
export function calculateReplayXp(
  newScore: number,
  previousBestScore: number | null,
): number {
  if (previousBestScore === null || newScore <= previousBestScore) {
    return 0;
  }
  const improvement = newScore - previousBestScore;
  return Math.min(REPLAY_XP_CAP, REPLAY_BASE_XP + Math.floor(improvement / 5));
}

// Cumulative XP required to REACH each level. Level 1 starts at 0 XP.
// Beyond the table, each further level costs a flat EXTRA_LEVEL_STEP more.
const LEVEL_THRESHOLDS = [0, 100, 250, 450, 700, 1000];
const EXTRA_LEVEL_STEP = 300;

export interface LevelInfo {
  level: number;
  currentLevelThreshold: number;
  nextLevelThreshold: number;
  xpToNextLevel: number;
}

export function levelForXp(xp: number): LevelInfo {
  const safeXp = Math.max(0, xp);

  let level = LEVEL_THRESHOLDS.length;
  let currentLevelThreshold = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];

  for (let i = 0; i < LEVEL_THRESHOLDS.length; i += 1) {
    if (safeXp < LEVEL_THRESHOLDS[i]) {
      level = i;
      currentLevelThreshold = LEVEL_THRESHOLDS[i - 1] ?? 0;
      const nextLevelThreshold = LEVEL_THRESHOLDS[i];
      return {
        level,
        currentLevelThreshold,
        nextLevelThreshold,
        xpToNextLevel: nextLevelThreshold - safeXp,
      };
    }
  }

  // Beyond the table: extend with a flat per-level XP step indefinitely.
  const xpBeyondTable = safeXp - currentLevelThreshold;
  const extraLevelsCompleted = Math.floor(xpBeyondTable / EXTRA_LEVEL_STEP);
  level = LEVEL_THRESHOLDS.length + extraLevelsCompleted;
  const thisLevelThreshold =
    currentLevelThreshold + extraLevelsCompleted * EXTRA_LEVEL_STEP;
  const nextLevelThreshold = thisLevelThreshold + EXTRA_LEVEL_STEP;

  return {
    level,
    currentLevelThreshold: thisLevelThreshold,
    nextLevelThreshold,
    xpToNextLevel: nextLevelThreshold - safeXp,
  };
}

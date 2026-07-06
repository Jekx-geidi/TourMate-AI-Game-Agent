import { useMemo, useState } from 'react';
import { GameResult } from './GameResult';

export type MatchPair = { left: string; right: string };

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

export function MatchingGame({
  pairs,
  onFinish,
  xpReward = 25,
}: {
  pairs: MatchPair[];
  onFinish: (result: { correct: number; total: number; misses: number }) => void;
  xpReward?: number;
}) {
  const [round, setRound] = useState(0);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [misses, setMisses] = useState(0);
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  const rightOrder = useMemo(() => shuffle(pairs.map((pair) => pair.right)), [pairs, round]);
  const leftOrder = useMemo(() => shuffle(pairs.map((pair) => pair.left)), [pairs, round]);

  const handleRight = (right: string) => {
    if (!selectedLeft || matched.includes(right)) return;
    const pair = pairs.find((item) => item.left === selectedLeft);
    if (pair?.right === right) {
      const nextMatched = [...matched, right];
      setMatched(nextMatched);
      setSelectedLeft(null);
      if (nextMatched.length === pairs.length && !finished) {
        setFinished(true);
        onFinish({ correct: pairs.length, total: pairs.length, misses });
      }
    } else {
      setMisses((current) => current + 1);
      setWrongFlash(right);
      window.setTimeout(() => setWrongFlash(null), 450);
    }
  };

  const reset = () => {
    setRound((current) => current + 1);
    setSelectedLeft(null);
    setMatched([]);
    setMisses(0);
    setFinished(false);
  };

  if (finished) {
    const accuracy = Math.round((pairs.length / (pairs.length + misses)) * 100);
    return (
      <GameResult
        mood={misses === 0 ? 'perfect' : 'great'}
        headline={misses === 0 ? 'Perfect match!' : 'All matched!'}
        detail={`You matched all ${pairs.length} pairs with ${misses} miss${misses === 1 ? '' : 'es'} (${accuracy}% accuracy).`}
        xpEarned={xpReward}
        onPlayAgain={reset}
      />
    );
  }

  const isLeftMatched = (left: string) =>
    matched.includes(pairs.find((pair) => pair.left === left)?.right ?? '');

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
        Matched {matched.length}/{pairs.length} · Misses: {misses}
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          {leftOrder.map((left) => (
            <button
              key={left}
              type="button"
              disabled={isLeftMatched(left)}
              onClick={() => setSelectedLeft(left)}
              className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                isLeftMatched(left)
                  ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 line-through'
                  : selectedLeft === left
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/40 text-violet-800 dark:text-violet-300 ring-2 ring-violet-300'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-violet-300 hover:bg-violet-50/50 dark:hover:bg-violet-900/20'
              }`}
            >
              {left}
            </button>
          ))}
        </div>
        <div className="grid gap-2">
          {rightOrder.map((right) => (
            <button
              key={right}
              type="button"
              disabled={matched.includes(right)}
              onClick={() => handleRight(right)}
              className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                matched.includes(right)
                  ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                  : wrongFlash === right
                    ? 'border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-violet-300 hover:bg-violet-50/50 dark:hover:bg-violet-900/20'
              }`}
            >
              {right}
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs text-slate-400">
        Tip: click a term on the left, then click its match on the right.
      </p>
    </div>
  );
}

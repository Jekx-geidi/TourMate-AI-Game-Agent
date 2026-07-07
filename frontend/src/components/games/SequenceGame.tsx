import { useMemo, useState } from 'react';
import { GameResult } from './GameResult';

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

export function SequenceGame({
  steps,
  prompt,
  onFinish,
  xpReward = 30,
}: {
  steps: string[];
  prompt: string;
  onFinish: (result: { strikes: number; total: number }) => void;
  xpReward?: number;
}) {
  const [round, setRound] = useState(0);
  const [placed, setPlaced] = useState<string[]>([]);
  const [strikes, setStrikes] = useState(0);
  const [shakeStep, setShakeStep] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  const options = useMemo(() => shuffle(steps), [steps, round]);
  const remaining = options.filter((step) => !placed.includes(step));

  const handlePick = (step: string) => {
    const expected = steps[placed.length];
    if (step === expected) {
      const nextPlaced = [...placed, step];
      setPlaced(nextPlaced);
      if (nextPlaced.length === steps.length && !finished) {
        setFinished(true);
        onFinish({ strikes, total: steps.length });
      }
    } else {
      setStrikes((current) => current + 1);
      setShakeStep(step);
      window.setTimeout(() => setShakeStep(null), 450);
    }
  };

  const reset = () => {
    setRound((current) => current + 1);
    setPlaced([]);
    setStrikes(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <GameResult
        mood={strikes <= 1 ? 'perfect' : strikes <= 3 ? 'great' : 'good'}
        headline={strikes === 0 ? 'Flawless planning!' : 'Sequence complete!'}
        detail={`You ordered all ${steps.length} steps with ${strikes} mistake${strikes === 1 ? '' : 's'}.`}
        xpEarned={xpReward}
        onPlayAgain={reset}
      />
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600 dark:text-slate-400">{prompt}</p>
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
        Step {placed.length + 1} of {steps.length} Â· Mistakes: {strikes}
      </p>
      <div className="grid gap-2">
        {placed.map((step, index) => (
          <div
            key={step}
            className="flex items-center gap-3 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2.5 text-sm font-semibold text-emerald-700 dark:text-emerald-300"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs text-white">
              {index + 1}
            </span>
            {step}
          </div>
        ))}
      </div>
      <div className="grid gap-2">
        {remaining.map((step) => (
          <button
            key={step}
            type="button"
            onClick={() => handlePick(step)}
            className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
              shakeStep === step
                ? 'border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-cyan-300 hover:bg-cyan-50/50 dark:hover:bg-cyan-900/20'
            }`}
          >
            {step}
          </button>
        ))}
      </div>
    </div>
  );
}

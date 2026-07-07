import { useState } from 'react';
import { Button } from '../ui/button';
import { GameResult } from './GameResult';

export type ScenarioOption = { text: string; feedback: string; points: number };
export type Scenario = { situation: string; options: ScenarioOption[] };

export function ScenarioGame({
  scenarios,
  role,
  onFinish,
  xpReward = 35,
}: {
  scenarios: Scenario[];
  role: string;
  onFinish: (result: { score: number; max: number }) => void;
  xpReward?: number;
}) {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const maxScore = scenarios.length * 10;
  const scenario = scenarios[index];

  const pick = (optionIndex: number) => {
    if (choice !== null) return;
    setChoice(optionIndex);
    setScore((current) => current + scenario.options[optionIndex].points);
  };

  const next = () => {
    if (index + 1 >= scenarios.length) {
      setFinished(true);
      onFinish({ score: score, max: maxScore });
      return;
    }
    setIndex((current) => current + 1);
    setChoice(null);
  };

  const reset = () => {
    setIndex(0);
    setChoice(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const percent = Math.round((score / maxScore) * 100);
    const rating =
      percent >= 90
        ? 'Outstanding decision-making!'
        : percent >= 70
          ? 'Great judgment â€” almost expert level.'
          : percent >= 50
            ? 'Good effort â€” review the feedback and try again.'
            : 'Keep practicing â€” every expert started somewhere.';
    return (
      <GameResult
        mood={percent >= 90 ? 'perfect' : percent >= 70 ? 'great' : 'good'}
        headline={`${score}/${maxScore} points`}
        detail={rating}
        xpEarned={xpReward}
        onPlayAgain={reset}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="rounded-full bg-cyan-100 dark:bg-cyan-900/40 px-3 py-1 text-xs font-bold uppercase tracking-wide text-cyan-800 dark:text-cyan-300">
          {role}
        </p>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Scenario {index + 1}/{scenarios.length} Â· Score: {score}
        </p>
      </div>
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-4">
        <p className="text-sm leading-6 text-slate-800 dark:text-slate-200">{scenario.situation}</p>
      </div>
      <div className="grid gap-2">
        {scenario.options.map((option, optionIndex) => {
          const isPicked = choice === optionIndex;
          const revealed = choice !== null;
          const isBest = option.points === 10;
          return (
            <button
              key={option.text}
              type="button"
              disabled={revealed}
              onClick={() => pick(optionIndex)}
              className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                revealed && isPicked
                  ? option.points >= 7
                    ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                    : 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
                  : revealed && isBest
                    ? 'border-emerald-300 bg-emerald-50/60 text-emerald-700 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 enabled:hover:border-cyan-300 enabled:hover:bg-cyan-50/50 dark:hover:bg-cyan-900/20'
              }`}
            >
              {option.text}
              {revealed && isPicked ? (
                <span className="mt-2 block text-xs font-semibold">
                  +{option.points} points â€” {option.feedback}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      {choice !== null ? (
        <Button onClick={next}>
          {index + 1 >= scenarios.length ? 'See final score' : 'Next scenario'}
        </Button>
      ) : null}
    </div>
  );
}

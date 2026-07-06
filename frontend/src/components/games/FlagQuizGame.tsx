import { useMemo, useState } from 'react';
import { COUNTRIES } from '../../lib/country-data';
import type { CountryProfile } from '../../lib/country-data';
import { useGame } from '../../hooks/use-game';
import { GameResult } from './GameResult';

const ROUNDS = 10;

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

function buildRounds() {
  return shuffle(COUNTRIES)
    .slice(0, ROUNDS)
    .map((answer) => {
      const decoys = shuffle(COUNTRIES.filter((country) => country.id !== answer.id)).slice(0, 3);
      return { answer, options: shuffle([answer, ...decoys]) };
    });
}

export function FlagQuizGame() {
  const { addXp, recordEvent } = useGame();
  const [gameKey, setGameKey] = useState(0);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<CountryProfile | null>(null);
  const [finished, setFinished] = useState(false);

  const rounds = useMemo(() => buildRounds(), [gameKey]);
  const current = rounds[index];

  const pick = (option: CountryProfile) => {
    if (picked) return;
    setPicked(option);
    const correct = option.id === current.answer.id;
    const finalScore = correct ? score + 1 : score;
    if (correct) {
      setScore(finalScore);
      recordEvent('flag-correct');
    }
    window.setTimeout(() => {
      if (index + 1 >= rounds.length) {
        setFinished(true);
        addXp(15 + finalScore * 3, 'Flag Quiz finished');
        recordEvent('game-completed');
      } else {
        setIndex((value) => value + 1);
        setPicked(null);
      }
    }, 1100);
  };

  const reset = () => {
    setGameKey((value) => value + 1);
    setIndex(0);
    setScore(0);
    setPicked(null);
    setFinished(false);
  };

  if (finished) {
    return (
      <GameResult
        mood={score === ROUNDS ? 'perfect' : score >= 7 ? 'great' : 'good'}
        headline={`${score}/${ROUNDS} flags identified!`}
        detail={
          score === ROUNDS
            ? 'Flag Master status achieved!'
            : 'Explore the world map to learn more flags, then try again.'
        }
        xpEarned={15 + score * 3}
        onPlayAgain={reset}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Flag {index + 1}/{rounds.length} · Score: {score}
        </p>
      </div>
      <p className="text-center text-8xl">{current.answer.flag}</p>
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">Which country does this flag belong to?</p>
      <div className="grid gap-2 md:grid-cols-2">
        {current.options.map((option) => {
          const revealed = picked !== null;
          const isAnswer = option.id === current.answer.id;
          const isPicked = picked?.id === option.id;
          return (
            <button
              key={option.id}
              type="button"
              disabled={revealed}
              onClick={() => pick(option)}
              className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                revealed && isAnswer
                  ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                  : revealed && isPicked
                    ? 'border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 enabled:hover:border-violet-300 enabled:hover:bg-violet-50/50 dark:hover:bg-violet-900/20'
              }`}
            >
              {option.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

import { useMemo, useState } from 'react';
import { COUNTRIES } from '../../lib/country-data';
import type { CountryProfile } from '../../lib/country-data';
import { getFlagImageSrcSet, getFlagImageUrl } from '../../lib/flag-images';
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
  const flagImage = getFlagImageUrl(current.answer.name, 320);
  const flagImageSrcSet = getFlagImageSrcSet(current.answer.name);

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
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Flag {index + 1}/{rounds.length} | Score: {score}
        </p>
        <div className="h-2 w-40 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-amber-400 transition-all duration-500"
            style={{ width: `${((index + 1) / rounds.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-cyan-100 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-900 p-5 text-white shadow-pop dark:border-cyan-900/70">
        <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-amber-300/20" />
        <div className="relative mx-auto flex min-h-48 max-w-md items-center justify-center">
          {flagImage ? (
            <img
              src={flagImage}
              srcSet={flagImageSrcSet}
              sizes="(min-width: 768px) 320px, 80vw"
              alt={`Flag of ${current.answer.name}`}
              className="max-h-52 w-full max-w-sm rounded-xl object-contain shadow-2xl ring-4 ring-white/20"
              loading="eager"
            />
          ) : (
            <p className="text-center text-4xl font-black">{current.answer.name}</p>
          )}
        </div>
      </div>

      <p className="text-center text-sm font-semibold text-slate-600 dark:text-slate-300">
        Which country does this flag belong to?
      </p>
      <div className="grid gap-3 md:grid-cols-2">
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
              className={`min-h-14 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                revealed && isAnswer
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : revealed && isPicked
                    ? 'border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                    : 'border-slate-200 bg-white text-slate-700 shadow-sm enabled:hover:-translate-y-0.5 enabled:hover:border-cyan-300 enabled:hover:bg-cyan-50/50 enabled:hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-cyan-900/20'
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

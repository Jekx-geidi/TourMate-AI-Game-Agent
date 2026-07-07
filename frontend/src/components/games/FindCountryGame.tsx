import { useState } from 'react';
import { Crosshair } from 'lucide-react';
import { CLICKABLE_COUNTRIES } from '../../lib/country-data';
import type { CountryProfile } from '../../lib/country-data';
import { useGame } from '../../hooks/use-game';
import { WorldMap } from '../WorldMap';
import type { MapCountry } from '../WorldMap';
import { GameResult } from './GameResult';

const ROUNDS = 5;
const MAX_ATTEMPTS = 3;

function randomTarget(exclude?: string): CountryProfile {
  const pool = CLICKABLE_COUNTRIES.filter((country) => country.id !== exclude);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function FindCountryGame() {
  const { addXp, recordEvent } = useGame();
  const [target, setTarget] = useState<CountryProfile>(() => randomTarget());
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [flash, setFlash] = useState<{ id: string; color: string } | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);

  const advance = (found: boolean) => {
    const finalScore = found ? score + 1 : score;
    if (found) setScore(finalScore);
    window.setTimeout(() => {
      if (round >= ROUNDS) {
        setFinished(true);
        addXp(20 + finalScore * 5, 'Map Challenge finished');
        recordEvent('game-completed');
      } else {
        setRound((current) => current + 1);
        setTarget(randomTarget(target.id));
        setAttempts(0);
        setMessage(null);
        setRevealed(false);
        setFlash(null);
      }
    }, 1400);
  };

  const handleClick = (clicked: MapCountry) => {
    if (revealed || finished) return;
    if (clicked.id === target.id) {
      setFlash({ id: clicked.id, color: '#22c55e' });
      setMessage(`Correct! That is ${target.name} ${target.flag}`);
      setRevealed(true);
      recordEvent('map-correct');
      advance(true);
      return;
    }
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setFlash({ id: clicked.id, color: '#f43f5e' });
    window.setTimeout(() => setFlash((current) => (current?.id === clicked.id ? null : current)), 600);
    if (nextAttempts >= MAX_ATTEMPTS) {
      setMessage(`Out of tries! ${target.name} is highlighted in green.`);
      setFlash({ id: target.id, color: '#22c55e' });
      setRevealed(true);
      advance(false);
    } else {
      setMessage(`That was ${clicked.name} â€” try again! (${MAX_ATTEMPTS - nextAttempts} tries left)`);
    }
  };

  const reset = () => {
    setTarget(randomTarget());
    setRound(1);
    setScore(0);
    setAttempts(0);
    setFlash(null);
    setMessage(null);
    setRevealed(false);
    setFinished(false);
  };

  if (finished) {
    return (
      <GameResult
        mood={score === ROUNDS ? 'perfect' : score >= 3 ? 'great' : 'good'}
        headline={`You found ${score}/${ROUNDS} countries!`}
        detail={
          score === ROUNDS
            ? 'A true navigator â€” you know your world map!'
            : 'Explore the map in Explorer mode and try again to beat your score.'
        }
        xpEarned={20 + score * 5}
        onPlayAgain={reset}
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-slate-100">
          <Crosshair className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
          Find: <span className="text-cyan-700 dark:text-cyan-300">{target.name}</span>
        </p>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Round {round}/{ROUNDS} Â· Score: {score}
        </p>
      </div>
      {message ? (
        <p
          className={`rounded-xl px-4 py-2 text-sm font-semibold ${
            message.startsWith('Correct')
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
              : message.startsWith('Out of')
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
          }`}
        >
          {message}
        </p>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">Click the country on the map. You have 3 tries.</p>
      )}
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
        <WorldMap
          onCountryClick={handleClick}
          showMarkers={false}
          getFill={(id) => (flash && flash.id === id ? flash.color : undefined)}
        />
      </div>
    </div>
  );
}

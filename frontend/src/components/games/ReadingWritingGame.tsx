import { useCallback, useEffect, useState } from 'react';
import { Lightbulb, Star, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { languageGameService } from '../../services/language-game.service';
import type { AnswerResult, LanguageGameMode, NextWord, ScoreTier } from '../../types/language-game';

const TIER_COPY: Record<ScoreTier, { label: string; stars: number; hint: string }> = {
  PERFECT: { label: 'Perfect', stars: 3, hint: 'Exactly right!' },
  GREAT: { label: 'Great', stars: 2, hint: 'Almost perfect.' },
  CLOSE: { label: 'Close', stars: 1, hint: "You're almost there." },
  ALMOST: { label: 'Almost', stars: 0, hint: 'Recognizable, but not quite.' },
  WRONG: { label: 'Wrong', stars: 0, hint: 'Try again next time.' },
};

function TierBadge({ tier }: { tier: ScoreTier }) {
  const copy = TIER_COPY[tier];
  if (tier === 'WRONG') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-sm font-bold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
        <X className="h-4 w-4" aria-hidden="true" />
        {copy.label}
      </span>
    );
  }
  if (tier === 'ALMOST') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
        <Lightbulb className="h-4 w-4" aria-hidden="true" />
        {copy.label}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
      {Array.from({ length: copy.stars }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-current" aria-hidden="true" />
      ))}
      {copy.label}
    </span>
  );
}

export function ReadingWritingGame({ languageCode = 'ja' as const, languageName = 'Japanese' }) {
  const [mode, setMode] = useState<LanguageGameMode>('READING');
  const [word, setWord] = useState<NextWord | null>(null);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNextWord = useCallback(async (nextMode: LanguageGameMode) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setAnswer('');
    try {
      const next = await languageGameService.getNextWord(languageCode, nextMode);
      setWord(next);
    } catch {
      setError('No vocabulary is available for this game yet. Please try again later.');
      setWord(null);
    } finally {
      setLoading(false);
    }
  }, [languageCode]);

  useEffect(() => {
    void loadNextWord(mode);
  }, [mode, loadNextWord]);

  const submit = async () => {
    if (!word || !answer.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const requestKey =
        typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const response = await languageGameService.submitAnswer({
        wordId: word.id,
        mode,
        answer: answer.trim(),
        requestKey,
      });
      setResult(response);
    } catch {
      setError("Sorry, that answer couldn't be submitted. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {languageName} Reading &amp; Writing
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Server-graded practice — every correct answer earns real, saved XP.
          </p>
        </div>
        <div
          role="tablist"
          aria-label="Game mode"
          className="flex gap-2 rounded-full bg-slate-100 p-1 dark:bg-slate-800"
        >
          {(['READING', 'WRITING'] as const).map((option) => (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={mode === option}
              onClick={() => setMode(option)}
              className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
                mode === option
                  ? 'bg-white text-cyan-700 shadow dark:bg-slate-900 dark:text-cyan-300'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {option === 'READING' ? 'Reading' : 'Writing'}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <p role="alert" className="rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">Loading a word...</p>
      ) : word ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-cyan-100 bg-cyan-50/60 p-6 text-center dark:border-cyan-900/60 dark:bg-cyan-950/40">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-700 dark:text-cyan-300">
              {mode === 'READING' ? `Translate this ${languageName} word` : 'Write this in ' + languageName}
            </p>
            <p className="mt-2 text-3xl font-black text-slate-900 dark:text-slate-100">{word.prompt}</p>
            {word.romanization ? (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">"{word.romanization}"</p>
            ) : null}
          </div>

          {result ? (
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 text-center dark:border-slate-700 dark:bg-slate-900">
              <TierBadge tier={result.tier} />
              <p className="text-sm text-slate-600 dark:text-slate-400">{TIER_COPY[result.tier].hint}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Correct answer:{' '}
                <span className="font-bold text-slate-800 dark:text-slate-200">{result.correctAnswer}</span>
              </p>
              {result.xpAwarded > 0 ? (
                <p className="inline-block rounded-full bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-1.5 text-sm font-bold text-amber-700 ring-1 ring-amber-200 dark:from-amber-900/40 dark:to-orange-900/40 dark:text-amber-300 dark:ring-amber-800">
                  +{result.xpAwarded} XP · Combo {result.comboAtAnswer}x
                </p>
              ) : null}
              <div>
                <Button onClick={() => void loadNextWord(mode)}>Next word</Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <Input
                key={word.id}
                autoFocus
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    void submit();
                  }
                }}
                placeholder={mode === 'READING' ? 'Type the English meaning...' : `Type in ${languageName}...`}
                aria-label={
                  mode === 'READING' ? 'Type the English meaning' : `Type the answer in ${languageName}`
                }
                disabled={submitting}
              />
              <Button onClick={() => void submit()} disabled={submitting || !answer.trim()}>
                Submit
              </Button>
            </div>
          )}
        </div>
      ) : null}
    </Card>
  );
}

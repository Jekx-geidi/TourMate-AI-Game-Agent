import type { LucideIcon } from 'lucide-react';
import { BookOpen, Star, ThumbsUp, Trophy } from 'lucide-react';
import { Button } from '../ui/button';

export type ResultMood = 'perfect' | 'great' | 'good' | 'study';

const MOODS: Record<ResultMood, { icon: LucideIcon; gradient: string }> = {
  perfect: { icon: Trophy, gradient: 'from-amber-300 via-amber-400 to-orange-500' },
  great: { icon: Star, gradient: 'from-violet-400 via-purple-500 to-fuchsia-500' },
  good: { icon: ThumbsUp, gradient: 'from-sky-400 via-blue-500 to-indigo-500' },
  study: { icon: BookOpen, gradient: 'from-emerald-300 via-emerald-400 to-teal-500' },
};

export function GameResult({
  mood,
  headline,
  detail,
  xpEarned,
  onPlayAgain,
}: {
  mood: ResultMood;
  headline: string;
  detail: string;
  xpEarned: number;
  onPlayAgain: () => void;
}) {
  const { icon: Icon, gradient } = MOODS[mood];
  return (
    <div className="rounded-2xl border border-violet-200 dark:border-violet-800/60 bg-gradient-to-br from-violet-50 dark:from-violet-950/40 to-fuchsia-50 dark:to-fuchsia-950/30 p-6 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white dark:bg-slate-900 shadow-pop">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${gradient} shadow-inner`}
        >
          <Icon className="h-8 w-8 text-white drop-shadow" />
        </div>
      </div>
      <h4 className="mt-4 text-2xl font-black text-slate-900 dark:text-slate-100">{headline}</h4>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{detail}</p>
      <p className="mt-3 inline-block rounded-full bg-gradient-to-r from-amber-100 dark:from-amber-900/40 to-orange-100 dark:to-orange-900/40 px-4 py-1.5 text-sm font-bold text-amber-700 dark:text-amber-300 ring-1 ring-amber-200 dark:ring-amber-800">
        +{xpEarned} XP earned
      </p>
      <div className="mt-4">
        <Button onClick={onPlayAgain}>Play again</Button>
      </div>
    </div>
  );
}

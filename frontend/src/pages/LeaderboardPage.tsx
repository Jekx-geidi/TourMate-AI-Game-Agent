import { useQuery } from '@tanstack/react-query';
import { Trophy } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Mascot } from '../components/Mascot';
import { Card } from '../components/ui/card';
import { gamificationService } from '../services/gamification.service';
import type { Leaderboard } from '../types';

const RANK_MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

export function LeaderboardPage() {
  const { data, isLoading, isError } = useQuery<Leaderboard>({
    queryKey: ['gamification', 'leaderboard'],
    queryFn: gamificationService.leaderboard,
  });

  if (isLoading) return <LoadingSpinner label="Loading the leaderboard..." />;

  if (isError || !data) {
    return (
      <Card>
        <p role="alert" className="text-sm font-semibold text-rose-600 dark:text-rose-400">
          Couldn't load the leaderboard right now. Please try again later.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div className="flex items-center gap-3">
          <Mascot pose="chatSuccess" alt="" size="avatar" />
          <div>
            <h1 className="text-4xl font-black text-slate-950 dark:text-white">Leaderboard</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Top learners ranked by total XP.
            </p>
          </div>
        </div>
        {data.myRank ? (
          <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">
            Your current rank: #{data.myRank}
          </p>
        ) : null}
      </Card>

      <Card className="space-y-2">
        {data.entries.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No XP has been earned yet. Play a game to take the top spot!
          </p>
        ) : (
          <ol className="space-y-2">
            {data.entries.map((entry) => (
              <li
                key={entry.userId}
                className={`flex items-center gap-4 rounded-2xl px-4 py-3 ${
                  entry.isCurrentUser
                    ? 'bg-cyan-50 ring-1 ring-cyan-200 dark:bg-cyan-950/40 dark:ring-cyan-800'
                    : 'bg-slate-50 dark:bg-slate-800/60'
                }`}
              >
                <span className="w-8 shrink-0 text-center text-lg font-black text-slate-500 dark:text-slate-400">
                  {RANK_MEDAL[entry.rank] ?? entry.rank}
                </span>
                {entry.avatarUrl ? (
                  <img
                    src={entry.avatarUrl}
                    alt=""
                    className="h-9 w-9 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                    <Trophy className="h-4 w-4" aria-hidden="true" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                    {entry.name}
                    {entry.isCurrentUser ? ' (you)' : ''}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Level {entry.level}</p>
                </div>
                <span className="shrink-0 text-sm font-bold text-amber-700 dark:text-amber-300">
                  {entry.xp} XP
                </span>
              </li>
            ))}
          </ol>
        )}
      </Card>
    </div>
  );
}

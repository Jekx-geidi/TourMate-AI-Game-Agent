import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Mascot } from '../components/Mascot';
import { Card } from '../components/ui/card';
import { gamificationService } from '../services/gamification.service';
import type { GamificationProfile } from '../types';

// TourMate is game-first, not subject-first (per the pasted PRDs) -- this
// page only shows server-backed XP/level/streak now, not subject percentages.
export function ProgressPage() {
  const gameProfileQuery = useQuery<GamificationProfile>({
    queryKey: ['gamification', 'me'],
    queryFn: gamificationService.me,
  });

  if (gameProfileQuery.isLoading) return <LoadingSpinner label="Loading your progress..." />;

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div className="flex items-center gap-3">
          <Mascot pose="coolHead" alt="" size="avatar" />
          <h1 className="text-4xl font-black text-slate-950 dark:text-white">Progress</h1>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Track your XP, level, streak, and overall growth.
        </p>
      </Card>

      {gameProfileQuery.data ? (
        <Card className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">
            Level and experience
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Level</p>
              <p className="mt-1 text-3xl font-black text-slate-950 dark:text-white">
                {gameProfileQuery.data.level}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total XP</p>
              <p className="mt-1 text-3xl font-black text-slate-950 dark:text-white">
                {gameProfileQuery.data.xp}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">XP to next level</p>
              <p className="mt-1 text-3xl font-black text-slate-950 dark:text-white">
                {gameProfileQuery.data.xpToNextLevel}
              </p>
            </div>
          </div>
          {gameProfileQuery.data.recentEvents.length > 0 ? (
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                Recent activity
              </p>
              <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                {gameProfileQuery.data.recentEvents.map((event, index) => (
                  <li key={index}>
                    {event.xpDelta > 0 ? `+${event.xpDelta} XP` : `${event.xpDelta} XP`} · {event.type.replace(/_/g, ' ').toLowerCase()}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Card>
      ) : null}
    </div>
  );
}


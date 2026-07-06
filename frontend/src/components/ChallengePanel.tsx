import type { LucideIcon } from 'lucide-react';
import {
  Bot,
  Brain,
  ClipboardList,
  Compass,
  Flag,
  Footprints,
  Gamepad2,
  Globe2,
  Map,
  Medal,
  MessageCircle,
  Star,
  Target,
} from 'lucide-react';
import { useGame } from '../hooks/use-game';
import { BADGES, DAILY_CHALLENGES } from '../lib/gamification';
import { Card } from './ui/card';

const ICONS: Record<string, LucideIcon> = {
  map: Map,
  gamepad: Gamepad2,
  quiz: ClipboardList,
  bot: Bot,
  flag: Flag,
  footprints: Footprints,
  globe: Globe2,
  brain: Brain,
  medal: Medal,
  compass: Compass,
  message: MessageCircle,
  star: Star,
};

function IconChip({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Star;
  return <Icon className={className ?? 'h-4 w-4'} />;
}

export function ChallengePanel() {
  const { stats, level } = useGame();

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
          <span className="rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 p-1.5 text-white shadow-pop">
            <Target className="h-4 w-4" />
          </span>
          Daily challenges
        </h2>
        <span className="rounded-full bg-violet-100 dark:bg-violet-900/40 px-3 py-1 text-xs font-bold text-violet-800 dark:text-violet-300">
          Lv {level.level} · {level.title}
        </span>
      </div>
      <div className="space-y-3">
        {DAILY_CHALLENGES.map((challenge) => {
          const progress = Math.min(stats.dailyProgress[challenge.id] ?? 0, challenge.target);
          const done = stats.claimedChallenges.includes(challenge.id);
          return (
            <div
              key={challenge.id}
              className={`rounded-2xl border p-3 ${
                done ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40' : 'border-violet-100 dark:border-violet-900/60 bg-violet-50/50'
              }`}
            >
              <div className="flex items-center justify-between gap-2 text-sm">
                <p
                  className={`flex items-center gap-2 font-semibold ${
                    done ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <span
                    className={`rounded-lg p-1.5 text-white shadow ${
                      done
                        ? 'bg-gradient-to-br from-emerald-400 to-emerald-600'
                        : 'bg-gradient-to-br from-violet-400 to-fuchsia-500'
                    }`}
                  >
                    <IconChip name={challenge.icon} className="h-3.5 w-3.5" />
                  </span>
                  {challenge.label}
                </p>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${
                    done ? 'bg-emerald-600 text-white' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  {done ? 'Done!' : `+${challenge.xp} XP`}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className={`h-full rounded-full transition-all ${done ? 'bg-emerald-500' : 'bg-violet-500'}`}
                    style={{ width: `${(progress / challenge.target) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {progress}/{challenge.target}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Badges</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {BADGES.map((badge) => {
            const earned = stats.earnedBadges.includes(badge.id);
            return (
              <span
                key={badge.id}
                title={`${badge.title} — ${badge.description}`}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  earned
                    ? 'bg-gradient-to-r from-amber-100 dark:from-amber-900/40 to-orange-100 dark:to-orange-900/40 text-amber-800 dark:text-amber-300 ring-1 ring-amber-300 dark:ring-amber-700'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                <IconChip name={badge.icon} className="h-3.5 w-3.5" />
                {badge.title}
              </span>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

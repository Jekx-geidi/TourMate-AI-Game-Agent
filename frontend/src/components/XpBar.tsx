import { Zap } from 'lucide-react';
import { useGame } from '../hooks/use-game';

export function XpBar() {
  const { stats, level, toasts } = useGame();

  return (
    <div className="relative flex items-center gap-3 rounded-full bg-white/15 px-4 py-2 backdrop-blur">
      <Zap className="h-4 w-4 shrink-0 text-amber-300" />
      <div className="min-w-[130px]">
        <div className="flex items-center justify-between gap-3 text-xs font-bold">
          <span className="text-white">Lv {level.level} · {level.title}</span>
          <span className="text-white/70">{stats.xp} XP</span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/25">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-200 to-cyan-400 transition-all duration-500"
            style={{ width: `${(level.currentLevelXp / level.nextLevelXp) * 100}%` }}
          />
        </div>
      </div>
      <div className="pointer-events-none absolute right-0 top-full z-30 mt-3 flex w-72 flex-col items-end gap-1">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="animate-bounce rounded-full bg-gradient-to-r from-slate-950 to-cyan-700 px-3 py-1.5 text-xs font-bold text-white shadow-pop"
          >
            +{toast.amount} XP · {toast.reason}
          </div>
        ))}
      </div>
    </div>
  );
}

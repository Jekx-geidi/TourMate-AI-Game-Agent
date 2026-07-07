import { useEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Award, Bell, Flame, Info, Target, TrendingUp } from 'lucide-react';
import type { AppNotification } from '../hooks/use-game';
import { useGame } from '../hooks/use-game';

const CATEGORY_ICONS: Record<AppNotification['category'], LucideIcon> = {
  level: TrendingUp,
  badge: Award,
  challenge: Target,
  streak: Flame,
  info: Info,
};

function timeAgo(iso: string) {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function NotificationBell() {
  const { notifications, unreadCount, markAllRead, clearNotifications } = useGame();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        aria-label="Notifications"
        className="relative rounded-2xl bg-white/15 p-2.5 text-white backdrop-blur transition hover:bg-white/25"
        onClick={() => {
          setOpen((value) => {
            if (!value) markAllRead();
            return !value;
          });
        }}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-1 text-[10px] font-black text-white shadow">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-40 mt-2 w-80 max-w-[90vw] overflow-hidden rounded-2xl border border-cyan-100 bg-white shadow-2xl dark:border-cyan-900/60 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Notifications</p>
            <button
              type="button"
              className="text-xs font-semibold text-cyan-600 hover:underline dark:text-cyan-400"
              onClick={clearNotifications}
            >
              Clear all
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-slate-400">
                No notifications yet. Play games, finish quizzes, and level up to see updates here!
              </p>
            ) : (
              notifications.map((item) => {
                const Icon = CATEGORY_ICONS[item.category];
                return (
                  <div
                    key={item.id}
                    className="flex gap-3 border-b border-slate-50 px-4 py-3 last:border-b-0 dark:border-slate-800/60"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-500 text-white shadow">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {item.title}
                      </p>
                      <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                        {item.detail}
                      </p>
                      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                        {timeAgo(item.time)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

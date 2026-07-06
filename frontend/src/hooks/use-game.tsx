import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { GameEvent, GameStats } from '../lib/gamification';
import {
  BADGES,
  DAILY_CHALLENGES,
  EMPTY_STATS,
  evaluateBadges,
  levelForXp,
} from '../lib/gamification';
import { useAuth } from './use-auth';

type XpToast = { id: number; amount: number; reason: string };

export type AppNotification = {
  id: string;
  category: 'level' | 'badge' | 'challenge' | 'streak' | 'info';
  title: string;
  detail: string;
  time: string;
  read: boolean;
};

type GameContextValue = {
  stats: GameStats;
  level: ReturnType<typeof levelForXp>;
  toasts: XpToast[];
  notifications: AppNotification[];
  unreadCount: number;
  notificationsEnabled: boolean;
  addXp: (amount: number, reason: string) => void;
  recordEvent: (event: GameEvent, meta?: { countryId?: string }) => void;
  notify: (category: AppNotification['category'], title: string, detail: string) => void;
  markAllRead: () => void;
  clearNotifications: () => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  resetProgress: () => void;
};

const GameContext = createContext<GameContextValue | null>(null);

const todayStamp = () => new Date().toISOString().slice(0, 10);

function loadStats(key: string): GameStats {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { ...EMPTY_STATS, dailyDate: todayStamp() };
    const parsed = { ...EMPTY_STATS, ...(JSON.parse(raw) as GameStats) };
    if (parsed.dailyDate !== todayStamp()) {
      parsed.dailyDate = todayStamp();
      parsed.dailyProgress = {};
      parsed.claimedChallenges = [];
    }
    return parsed;
  } catch {
    return { ...EMPTY_STATS, dailyDate: todayStamp() };
  }
}

function loadNotifications(key: string): AppNotification[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as AppNotification[]) : [];
  } catch {
    return [];
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const storageKey = `tourmate_game_${user?.id ?? 'guest'}`;
  const notifKey = `tourmate_notifs_${user?.id ?? 'guest'}`;
  const [stats, setStats] = useState<GameStats>(() => loadStats(storageKey));
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    loadNotifications(notifKey),
  );
  const [notificationsEnabled, setNotificationsEnabledState] = useState(
    () => localStorage.getItem('tourmate_notifications') !== 'off',
  );
  const [toasts, setToasts] = useState<XpToast[]>([]);
  const toastId = useRef(0);
  const previousSnapshot = useRef<{ level: number; badges: string[]; challenges: string[] } | null>(
    null,
  );

  useEffect(() => {
    setStats(loadStats(storageKey));
    setNotifications(loadNotifications(notifKey));
    previousSnapshot.current = null;
  }, [storageKey, notifKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(stats));
  }, [stats, storageKey]);

  useEffect(() => {
    localStorage.setItem(notifKey, JSON.stringify(notifications.slice(0, 40)));
  }, [notifications, notifKey]);

  const notify = useCallback(
    (category: AppNotification['category'], title: string, detail: string) => {
      if (!notificationsEnabled) return;
      setNotifications((current) => [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          category,
          title,
          detail,
          time: new Date().toISOString(),
          read: false,
        },
        ...current.slice(0, 39),
      ]);
    },
    [notificationsEnabled],
  );

  // Watch stats and raise notifications for level ups, new badges, and finished challenges.
  useEffect(() => {
    const snapshot = {
      level: levelForXp(stats.xp).level,
      badges: stats.earnedBadges,
      challenges: stats.claimedChallenges,
    };
    const previous = previousSnapshot.current;
    previousSnapshot.current = snapshot;
    if (!previous) return;

    if (snapshot.level > previous.level) {
      const { title } = levelForXp(stats.xp);
      notify('level', `Level up! You reached Level ${snapshot.level}`, `New rank: ${title}. Keep exploring!`);
    }
    for (const badgeId of snapshot.badges) {
      if (!previous.badges.includes(badgeId)) {
        const badge = BADGES.find((item) => item.id === badgeId);
        if (badge) notify('badge', `Badge earned: ${badge.title}`, badge.description);
      }
    }
    for (const challengeId of snapshot.challenges) {
      if (!previous.challenges.includes(challengeId)) {
        const challenge = DAILY_CHALLENGES.find((item) => item.id === challengeId);
        if (challenge) {
          notify('challenge', 'Daily challenge complete!', `${challenge.label} (+${challenge.xp} XP)`);
        }
      }
    }
  }, [stats, notify]);

  const pushToast = useCallback(
    (amount: number, reason: string) => {
      if (!notificationsEnabled) return;
      toastId.current += 1;
      const id = toastId.current;
      setToasts((current) => [...current, { id, amount, reason }]);
      window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
      }, 2600);
    },
    [notificationsEnabled],
  );

  const applyUpdate = useCallback((updater: (previous: GameStats) => GameStats) => {
    setStats((previous) => {
      const base =
        previous.dailyDate === todayStamp()
          ? previous
          : { ...previous, dailyDate: todayStamp(), dailyProgress: {}, claimedChallenges: [] };
      const next = updater(base);
      const badges = evaluateBadges(next);
      const newBadges = badges.filter((badge) => !next.earnedBadges.includes(badge));
      if (newBadges.length > 0) {
        return { ...next, earnedBadges: [...next.earnedBadges, ...newBadges] };
      }
      return next;
    });
  }, []);

  const addXp = useCallback(
    (amount: number, reason: string) => {
      if (amount <= 0) return;
      applyUpdate((previous) => ({ ...previous, xp: previous.xp + amount }));
      pushToast(amount, reason);
    },
    [applyUpdate, pushToast],
  );

  const recordEvent = useCallback(
    (event: GameEvent, meta?: { countryId?: string }) => {
      applyUpdate((previous) => {
        const counters = {
          ...previous.counters,
          [event]: (previous.counters[event] ?? 0) + 1,
        };
        let countriesExplored = previous.countriesExplored;
        if (event === 'country-explored' && meta?.countryId) {
          if (previous.countriesExplored.includes(meta.countryId)) {
            return { ...previous, counters };
          }
          countriesExplored = [...previous.countriesExplored, meta.countryId];
        }

        let xpGain = 0;
        const dailyProgress = { ...previous.dailyProgress };
        const claimedChallenges = [...previous.claimedChallenges];
        for (const challenge of DAILY_CHALLENGES) {
          if (challenge.event !== event) continue;
          const progress = Math.min((dailyProgress[challenge.id] ?? 0) + 1, challenge.target);
          dailyProgress[challenge.id] = progress;
          if (progress >= challenge.target && !claimedChallenges.includes(challenge.id)) {
            claimedChallenges.push(challenge.id);
            xpGain += challenge.xp;
            pushToast(challenge.xp, `Challenge complete: ${challenge.label}`);
          }
        }

        return {
          ...previous,
          counters,
          countriesExplored,
          dailyProgress,
          claimedChallenges,
          xp: previous.xp + xpGain,
        };
      });
    },
    [applyUpdate, pushToast],
  );

  const value = useMemo<GameContextValue>(
    () => ({
      stats,
      level: levelForXp(stats.xp),
      toasts,
      notifications,
      unreadCount: notifications.filter((item) => !item.read).length,
      notificationsEnabled,
      addXp,
      recordEvent,
      notify,
      markAllRead: () =>
        setNotifications((current) => current.map((item) => ({ ...item, read: true }))),
      clearNotifications: () => setNotifications([]),
      setNotificationsEnabled: (enabled: boolean) => {
        setNotificationsEnabledState(enabled);
        localStorage.setItem('tourmate_notifications', enabled ? 'on' : 'off');
      },
      resetProgress: () => {
        setStats({ ...EMPTY_STATS, dailyDate: todayStamp() });
        setNotifications([]);
      },
    }),
    [stats, toasts, notifications, notificationsEnabled, addXp, recordEvent, notify],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};

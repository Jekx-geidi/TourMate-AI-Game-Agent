import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  GraduationCap,
  Languages,
  MessageCircle,
  Plane,
  Trophy,
  User,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

// TourMate is now a game-first tourism app (docs/BRD.md v2.0), organized as
// HOME / PLAY / PROGRESS / ACCOUNT. Only routes that are actually built are
// listed here -- the rest of the proposed IA (Reservation Lab, Hospitality,
// Travel Agency, Tour Operations, Daily Shift, Career Mode, Skill Mastery,
// Certifications, Achievements, Mistake Review) isn't real yet, so it isn't
// linked yet either. The old Subjects/Maps & Flags/Quiz Studio routes still
// exist and work, just aren't part of primary nav anymore.
const GROUPS = [
  {
    label: 'Home',
    links: [{ to: '/dashboard', label: 'Dashboard', icon: GraduationCap }],
  },
  {
    label: 'Play',
    links: [
      { to: '/language', label: 'Language Games', icon: Languages },
      { to: '/ai-tutor', label: 'AI Tutor', icon: MessageCircle },
      { to: '/simulations', label: 'Airline Academy', icon: Plane },
    ],
  },
  {
    label: 'Progress',
    links: [
      { to: '/progress', label: 'Progress', icon: ClipboardList },
      { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    ],
  },
  {
    label: 'Account',
    links: [{ to: '/profile', label: 'Profile', icon: User }],
  },
];

export function Sidebar({
  collapsed = false,
  onToggleCollapse,
  onNavigate,
  className,
}: {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        'glass-panel rounded-[1.75rem] p-3 shadow-soft transition-all',
        collapsed ? 'w-[76px]' : 'w-64',
        className,
      )}
    >
      {onToggleCollapse ? (
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'mb-2 flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-[#2E50E6] transition hover:bg-[#FFE9F1] dark:text-[#FFE9F1] dark:hover:bg-white/10',
            collapsed ? 'w-full justify-center' : 'w-full justify-end',
          )}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : (
            <>
              Hide <ChevronLeft className="h-4 w-4" />
            </>
          )}
        </button>
      ) : null}
      <nav className="grid gap-3">
        {GROUPS.map((group) => (
          <div key={group.label} className="grid gap-1.5">
            {collapsed ? null : (
              <p className="px-4 pt-1 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#2E50E6]/50 dark:text-[#FFE9F1]/40">
                {group.label}
              </p>
            )}
            {group.links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                title={link.label}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition',
                    collapsed && 'justify-center px-0',
                    isActive
                      ? 'bg-gradient-to-r from-[#E62E6B] via-[#2E50E6] to-[#00C351] text-white shadow-pop'
                      : 'text-[#2E50E6]/80 hover:bg-[#FFE9F1] hover:text-[#E62E6B] dark:text-[#FFE9F1]/70 dark:hover:bg-white/10 dark:hover:text-white',
                  )
                }
              >
                <link.icon className="h-5 w-5 shrink-0" />
                {collapsed ? null : link.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}

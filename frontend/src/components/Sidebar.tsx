import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Gamepad2,
  Globe,
  GraduationCap,
  Languages,
  MessageCircle,
  Plane,
  User,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: GraduationCap },
  { to: '/subjects', label: 'Subjects', icon: BookOpen },
  { to: '/maps-flags', label: 'Maps & Flags', icon: Globe },
  { to: '/quiz-studio', label: 'Quiz Studio', icon: ClipboardList },
  { to: '/language', label: 'Language', icon: Languages },
  { to: '/ai-tutor', label: 'AI Tutor', icon: MessageCircle },
  { to: '/agent-status', label: 'Agent Status', icon: Plane },
  { to: '/progress', label: 'Progress', icon: Gamepad2 },
  { to: '/profile', label: 'Profile', icon: User },
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
            'mb-2 flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-cyan-700 transition hover:bg-slate-100 dark:text-cyan-300 dark:hover:bg-slate-800/80',
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
      <nav className="grid gap-1.5">
        {links.map((link) => (
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
                  ? 'bg-gradient-to-r from-slate-950 to-cyan-700 text-white shadow-pop'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-cyan-700 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-cyan-300',
              )
            }
          >
            <link.icon className="h-5 w-5 shrink-0" />
            {collapsed ? null : link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

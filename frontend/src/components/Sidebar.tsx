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
  Target,
  User,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: GraduationCap },
  { to: '/subjects', label: 'Subjects', icon: BookOpen },
  { to: '/simulations', label: 'Missions', icon: Target },
  { to: '/maps-flags', label: 'Maps & Flags', icon: Globe },
  { to: '/quiz-studio', label: 'Quiz Studio', icon: ClipboardList },
  { to: '/language', label: 'Language', icon: Languages },
  { to: '/ai-tutor', label: 'AI Tutor', icon: MessageCircle },
  { to: '/agent-status', label: 'Agent Status', icon: Plane },
  { to: '/progress', label: 'Career Passport', icon: Gamepad2 },
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
                  ? 'bg-gradient-to-r from-[#E62E6B] via-[#2E50E6] to-[#00C351] text-white shadow-pop'
                  : 'text-[#2E50E6]/80 hover:bg-[#FFE9F1] hover:text-[#E62E6B] dark:text-[#FFE9F1]/70 dark:hover:bg-white/10 dark:hover:text-white',
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

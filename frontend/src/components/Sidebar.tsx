import {
  BookOpen,
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
  { to: '/language', label: 'Language', icon: Languages },
  { to: '/ai-tutor', label: 'AI Tutor', icon: MessageCircle },
  { to: '/agent-status', label: 'Agent Status', icon: Plane },
  { to: '/progress', label: 'Progress', icon: Gamepad2 },
  { to: '/profile', label: 'Profile', icon: User },
];

export function Sidebar() {
  return (
    <aside className="glass-panel rounded-3xl p-4">
      <nav className="grid gap-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition',
                isActive
                  ? 'bg-teal-700 text-white'
                  : 'text-slate-700 hover:bg-slate-100',
              )
            }
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}


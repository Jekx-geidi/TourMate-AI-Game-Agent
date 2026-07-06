import { LogOut, Menu, Moon, Sun } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { useAuth } from '../hooks/use-auth';
import { useTheme } from '../hooks/use-theme';
import { NotificationBell } from './NotificationBell';
import { Button } from './ui/button';
import { XpBar } from './XpBar';

export function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 brand-gradient-r shadow-pop">
      <div className="mx-auto flex max-w-none items-center justify-between gap-3 px-3 py-3 sm:px-6 sm:py-4 lg:px-6">
        <div className="flex items-center gap-2">
          {onMenuClick ? (
            <button
              type="button"
              aria-label="Open menu"
              className="rounded-2xl bg-white/15 p-2.5 text-white backdrop-blur transition hover:bg-white/25 lg:hidden"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </button>
          ) : null}
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="rounded-2xl bg-white p-1 shadow-md">
              <img src={logo} alt="TourMate Game logo" className="h-10 w-10" />
            </div>
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-white">
                TourMate <span className="text-amber-300">Game</span>
              </p>
              <p className="hidden text-xs text-white/75 sm:block">
                Learn tourism by playing
              </p>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:block">
            <XpBar />
          </div>
          <button
            type="button"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="rounded-2xl bg-white/15 p-2.5 text-white backdrop-blur transition hover:bg-white/25"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <NotificationBell />
          <Button
            variant="ghost"
            className="px-3 text-white hover:bg-white/15 dark:text-white dark:hover:bg-white/15"
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
          >
            <LogOut className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
      <div className="px-3 pb-3 md:hidden">
        <XpBar />
      </div>
    </header>
  );
}

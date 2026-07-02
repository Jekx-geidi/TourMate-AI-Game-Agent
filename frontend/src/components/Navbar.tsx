import { BookOpen, LogOut, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import { Button } from './ui/button';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 border-b border-white/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-teal-700 to-blue-600 p-3 text-white">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-700">
              TourMate AI
            </p>
            <p className="text-sm text-slate-600">Study companion for tourism students</p>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <div className="hidden rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 sm:flex">
            <Sparkles className="mr-2 h-4 w-4 text-amber-500" />
            Welcome back, {user?.name ?? 'Student'}!
          </div>
          <Button
            variant="ghost"
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}


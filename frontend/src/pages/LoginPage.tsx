import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, Sparkles, Trophy } from 'lucide-react';
import axios from 'axios';
import logo from '../assets/logo.svg';
import { DotGridBackground } from '../components/DotGridBackground';
import { ErrorMessage } from '../components/ErrorMessage';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { useAuth } from '../hooks/use-auth';
import { authService } from '../services/auth.service';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('student@tourmate.ai');
  const [password, setPassword] = useState('Tourmate123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f8ff] px-4 py-8 sm:px-6 sm:py-12">
      <DotGridBackground />
      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <section className="relative overflow-hidden rounded-[2rem] border border-[#151a66]/10 bg-white/70 p-8 shadow-soft backdrop-blur-xl sm:p-10 lg:p-12">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#151a66]/25 to-transparent" />
            <div className="flex items-center gap-4">
              <img src={logo} alt="TourMate AI logo" className="h-16 w-16 rounded-2xl bg-white p-2 shadow-soft" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.42em] text-[#151a66]/70">
                  TourMate AI
                </p>
                <h1 className="mt-2 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
                  Return to your travel learning cockpit.
                </h1>
              </div>
            </div>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Pick up your study streak, revisit lessons, and keep building confidence across
              tourism, airline management, MICE, maps, flags, and language practice.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-[#151a66]/10 bg-white/80 p-4">
                <Compass className="h-8 w-8 text-[#151a66]" />
                <p className="mt-4 text-sm font-semibold text-slate-900">Guided study paths</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Move from lessons to practice without losing momentum.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-sky-200/70 bg-sky-50/80 p-4">
                <Sparkles className="h-8 w-8 text-sky-600" />
                <p className="mt-4 text-sm font-semibold text-slate-900">AI-backed review</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Ask for quick explanations, drills, and study plans anytime.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-emerald-200/70 bg-emerald-50/80 p-4">
                <Trophy className="h-8 w-8 text-emerald-600" />
                <p className="mt-4 text-sm font-semibold text-slate-900">XP and challenges</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Keep your streak alive with goals, quizzes, and games.
                </p>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <Link className="font-semibold text-[#151a66] underline-offset-4 hover:underline" to="/welcome">
                View landing page
              </Link>
              <span className="text-slate-300">/</span>
              <Link className="font-semibold text-[#151a66] underline-offset-4 hover:underline" to="/register">
                Create account
              </Link>
            </div>
          </section>

          <Card className="relative w-full max-w-xl justify-self-center space-y-6 border border-white/80 bg-white/88 p-8 shadow-[0_30px_80px_-36px_rgba(21,26,102,0.35)] backdrop-blur-xl sm:p-10">
            <div className="text-center">
              <img src={logo} alt="TourMate AI logo" className="mx-auto h-24 w-24" />
              <p className="mt-4 text-sm font-bold uppercase tracking-[0.42em] text-[#151a66]">
                Student Login
              </p>
              <h2 className="mt-3 text-3xl font-black text-slate-950">Welcome back, explorer!</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Log in to continue your journey. Your XP, badges, notes, and challenges are ready.
              </p>
            </div>
            {error ? <ErrorMessage message={error} /> : null}
            <div className="space-y-4">
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
            <Button
              className="w-full bg-[#151a66] text-white shadow-[0_18px_45px_-18px_rgba(21,26,102,0.65)] hover:bg-[#0f1451]"
              disabled={loading}
              onClick={async () => {
                try {
                  setLoading(true);
                  setError('');
                  const response = await authService.login({ email, password });
                  login(response.accessToken, response.user);
                  navigate(location.state?.from ?? '/dashboard');
                } catch (error) {
                  if (axios.isAxiosError(error)) {
                    if (!error.response) {
                      setError(
                        'Unable to reach the backend. Is the backend running on http://localhost:4000?',
                      );
                    } else if (error.response.status === 401) {
                      setError('Email or password is incorrect.');
                    } else {
                      setError('Login failed. Please try again.');
                    }
                  } else {
                    setError('Login failed. Please try again.');
                  }
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </Button>
            <p className="text-sm text-slate-600">
              New here?{' '}
              <Link className="font-semibold text-[#151a66]" to="/register">
                Create an account
              </Link>
            </p>
            <p className="text-center text-xs text-slate-400">
              By continuing you agree to the{' '}
              <Link to="/terms" className="underline">
                Terms & Conditions
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="underline">
                Privacy Policy
              </Link>
              .
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

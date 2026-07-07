import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Compass, Sparkles, Trophy } from 'lucide-react';
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
    <div className="relative min-h-screen overflow-hidden bg-slate-50 px-3 py-4 sm:px-6 sm:py-8">
      <DotGridBackground />
      <div className="relative mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl items-center sm:min-h-[calc(100vh-4rem)]">
        <div className="grid w-full gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          <section className="relative order-2 overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/80 p-5 shadow-soft backdrop-blur-xl sm:p-8 lg:order-1 lg:p-12">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
            <div className="flex items-center justify-between gap-3">
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700 transition hover:border-cyan-200 hover:bg-cyan-50"
                to="/welcome"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Link>
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
                to="/register"
              >
                Need an account
              </Link>
            </div>
            <div className="mt-5 flex items-start gap-3 sm:gap-4">
              <img src={logo} alt="TourMate AI logo" className="h-14 w-14 rounded-2xl bg-white p-2 shadow-soft sm:h-16 sm:w-16" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.42em] text-cyan-700">
                  TourMate AI
                </p>
                <h1 className="mt-2 text-3xl font-black leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
                  Return to your travel learning cockpit.
                </h1>
              </div>
            </div>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 lg:text-lg">
              Pick up your study streak, revisit lessons, and keep building confidence across
              tourism, airline management, MICE, maps, flags, and language practice.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-4">
              <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/85 p-4">
                <Compass className="h-8 w-8 text-cyan-700" />
                <p className="mt-4 text-sm font-semibold text-slate-900">Guided study paths</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Move from lessons to practice without losing momentum.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/85 p-4">
                <Sparkles className="h-8 w-8 text-cyan-700" />
                <p className="mt-4 text-sm font-semibold text-slate-900">AI-backed review</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Ask for quick explanations, drills, and study plans anytime.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/85 p-4">
                <Trophy className="h-8 w-8 text-cyan-700" />
                <p className="mt-4 text-sm font-semibold text-slate-900">XP and challenges</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Keep your streak alive with goals, quizzes, and games.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <Link className="font-semibold text-cyan-700 underline-offset-4 hover:underline" to="/welcome">
                View landing page
              </Link>
              <span className="text-slate-300">/</span>
              <Link className="font-semibold text-cyan-700 underline-offset-4 hover:underline" to="/register">
                Create account
              </Link>
            </div>
          </section>

          <Card className="relative order-1 w-full max-w-xl justify-self-center space-y-5 border border-slate-200/80 bg-white/90 p-5 shadow-soft backdrop-blur-xl sm:p-8 lg:order-2 lg:p-10">
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
            <div className="flex items-center gap-3">
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-cyan-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700 transition hover:border-cyan-200 hover:bg-cyan-100/70"
                to="/welcome"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Link>
            </div>
            <div className="text-center">
              <img src={logo} alt="TourMate AI logo" className="mx-auto h-20 w-20 sm:h-24 sm:w-24" />
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.42em] text-cyan-700 sm:text-sm">
                Student Login
              </p>
              <h2 className="mt-3 text-2xl font-black text-slate-950 sm:text-3xl">
                Welcome back, explorer!
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Log in to continue your journey. Your XP, badges, notes, and challenges are ready.
              </p>
            </div>
            {error ? <ErrorMessage message={error} /> : null}
            <div className="space-y-3">
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
            <Button
              className="w-full"
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
                        'Unable to reach the TourMate API. Check that your deployed app can reach its /api backend.',
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
              <Link className="font-semibold text-cyan-700" to="/register">
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

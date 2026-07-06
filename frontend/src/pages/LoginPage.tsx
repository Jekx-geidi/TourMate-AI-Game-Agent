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
import { supabase } from '../lib/supabase';
import { authService } from '../services/auth.service';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('student@tourmate.ai');
  const [password, setPassword] = useState('Tourmate123!');
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);

  const ensureSupabase = () => {
    if (!supabase) {
      throw new Error(
        'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
      );
    }
    return supabase;
  };

  const handleSendCode = async () => {
    if (!email.trim()) {
      setError('Enter your email first so we know where to send the code.');
      return;
    }

    try {
      setSendingCode(true);
      setError('');
      setNotice('');
      const client = ensureSupabase();
      const { error } = await client.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: false,
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) {
        throw error;
      }

      setNotice(`A Supabase login code or magic link was sent to ${email.trim()}.`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ??
            'We could not send the login code right now.',
        );
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('We could not send the login code right now.');
      }
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyCodeLogin = async () => {
    try {
      setVerifyingCode(true);
      setError('');
      setNotice('');
      const client = ensureSupabase();
      const { data, error } = await client.auth.verifyOtp({
        email: email.trim(),
        token: otpCode.trim(),
        type: 'email',
      });

      if (error) {
        throw error;
      }

      const accessToken = data.session?.access_token;

      if (!accessToken) {
        throw new Error(
          'Supabase verification succeeded, but no session token was returned.',
        );
      }

      const response = await authService.supabaseLogin({ accessToken });
      login(response.accessToken, response.user);
      navigate(location.state?.from ?? '/dashboard');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        setError(
          Array.isArray(message)
            ? message.join(', ')
            : message ?? 'Code login failed. Please try again.',
        );
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Code login failed. Please try again.');
      }
    } finally {
      setVerifyingCode(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fcf8ff] px-4 py-8 sm:px-6 sm:py-12">
      <DotGridBackground />
      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <section className="relative overflow-hidden rounded-[2rem] border border-violet-200/70 bg-white/72 p-8 shadow-soft backdrop-blur-xl sm:p-10 lg:p-12">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400/60 to-transparent" />
            <div className="absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-fuchsia-300/20 blur-3xl" />
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="flex items-center gap-4">
              <img src={logo} alt="TourMate AI logo" className="h-16 w-16 rounded-2xl bg-white p-2 shadow-soft" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.42em] text-violet-700/80">
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
              <div className="rounded-[1.5rem] border border-violet-200/80 bg-gradient-to-br from-violet-50 to-fuchsia-50 p-4">
                <Compass className="h-8 w-8 text-violet-600" />
                <p className="mt-4 text-sm font-semibold text-slate-900">Guided study paths</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Move from lessons to practice without losing momentum.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-cyan-200/80 bg-gradient-to-br from-cyan-50 to-sky-50 p-4">
                <Sparkles className="h-8 w-8 text-cyan-600" />
                <p className="mt-4 text-sm font-semibold text-slate-900">AI-backed review</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Ask for quick explanations, drills, and study plans anytime.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-fuchsia-200/80 bg-gradient-to-br from-fuchsia-50 to-violet-50 p-4">
                <Trophy className="h-8 w-8 text-fuchsia-600" />
                <p className="mt-4 text-sm font-semibold text-slate-900">XP and challenges</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Keep your streak alive with goals, quizzes, and games.
                </p>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <Link className="font-semibold text-violet-700 underline-offset-4 hover:underline" to="/welcome">
                View landing page
              </Link>
              <span className="text-slate-300">/</span>
              <Link className="font-semibold text-violet-700 underline-offset-4 hover:underline" to="/register">
                Create account
              </Link>
            </div>
          </section>

          <Card className="relative w-full max-w-xl justify-self-center space-y-6 border border-violet-200/70 bg-white/88 p-8 shadow-[0_30px_80px_-36px_rgba(124,58,237,0.30)] backdrop-blur-xl sm:p-10">
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400/60 to-transparent" />
            <div className="text-center">
              <img src={logo} alt="TourMate AI logo" className="mx-auto h-24 w-24" />
              <p className="mt-4 text-sm font-bold uppercase tracking-[0.42em] text-violet-700">
                Student Login
              </p>
              <h2 className="mt-3 inline-block rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 px-5 py-2 text-3xl font-black text-white shadow-pop">
                Welcome back, explorer!
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Log in to continue your journey. Your XP, badges, notes, and challenges are ready.
              </p>
            </div>
            {error ? <ErrorMessage message={error} /> : null}
            {notice ? (
              <div className="rounded-[1.5rem] border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-800">
                {notice}
              </div>
            ) : null}
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
              className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 text-white shadow-[0_18px_45px_-18px_rgba(168,85,247,0.55)] hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-600"
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
              <Link className="font-semibold text-violet-700" to="/register">
                Create an account
              </Link>
            </p>
            <div className="space-y-4 rounded-[1.75rem] border border-violet-200/70 bg-violet-50/60 p-5">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.32em] text-violet-700">
                  Email Code Login
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Send a Supabase OTP to your email, then enter the 6-digit code
                  to sign in without your password.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <Input
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="6-digit code"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="sm:min-w-[160px]"
                  disabled={sendingCode}
                  onClick={() => void handleSendCode()}
                >
                  {sendingCode ? 'Sending...' : 'Send Code'}
                </Button>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full border-violet-300 text-violet-700 hover:bg-violet-100"
                disabled={verifyingCode}
                onClick={() => void handleVerifyCodeLogin()}
              >
                {verifyingCode ? 'Verifying...' : 'Verify Code & Log In'}
              </Button>
            </div>
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

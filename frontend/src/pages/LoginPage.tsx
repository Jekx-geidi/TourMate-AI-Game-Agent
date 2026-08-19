import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import axios from 'axios';
import logo from '../assets/logo.svg';
import { ErrorMessage } from '../components/ErrorMessage';
import { GradientWavesBackground } from '../components/GradientWavesBackground';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { PasswordInput } from '../components/ui/password-input';
import { useAuth } from '../hooks/use-auth';
import { supabase } from '../lib/supabase';
import { authService } from '../services/auth.service';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    if (!supabase) return;
    setGoogleLoading(true);
    setError('');
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (oauthError) {
      setError(oauthError.message);
      setGoogleLoading(false);
    }
    // On success the browser navigates away to Google, so nothing else runs here.
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await authService.login({ email, password });
      login(response.accessToken, response.user, rememberMe);
      navigate(location.state?.from ?? '/dashboard');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (!err.response) {
          setError('Unable to reach the server. Please try again in a moment.');
        } else if (err.response.status === 401) {
          setError('Email or password is incorrect.');
        } else {
          const message = err.response.data?.message;
          setError(
            (Array.isArray(message) ? message.join(', ') : message) ??
              'Login failed. Please try again.',
          );
        }
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="palette-screen relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 dark:bg-[#0A0A0F]">
      <GradientWavesBackground waveColor="#bc20b6" horizonColor="#27c3ff" />
      <div className="relative w-full max-w-sm">
        <Link
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#2E50E6] transition hover:text-[#E62E6B] dark:text-[#FFE9F1] dark:hover:text-white"
          to="/welcome"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="palette-panel rounded-2xl border p-7 sm:p-8 dark:border-white/10 dark:bg-[#0A0A0F]/90">
          <div className="mb-6 text-center">
            <img
              src={logo}
              alt="TourMate AI"
              className="palette-ring mx-auto h-14 w-auto rounded-2xl"
            />
            <h1 className="mt-4 text-xl font-semibold text-[#E62E6B] dark:text-[#FFE9F1]">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-[#2E50E6]/75 dark:text-[#FFE9F1]/70">
              Log in to continue to TourMate AI.
            </p>
          </div>

          {error ? (
            <div className="mb-4">
              <ErrorMessage message={error} />
            </div>
          ) : null}

          {supabase ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-xl"
                disabled={googleLoading}
                onClick={() => void handleGoogleLogin()}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47c-.28 1.5-1.13 2.77-2.4 3.63v3.02h3.89c2.28-2.1 3.56-5.2 3.56-8.84z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.89-3.02c-1.08.72-2.46 1.15-4.04 1.15-3.1 0-5.73-2.1-6.67-4.92H1.3v3.09C3.26 21.3 7.3 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.33 14.31A7.2 7.2 0 0 1 4.96 12c0-.8.14-1.58.37-2.31V6.6H1.3A11.98 11.98 0 0 0 0 12c0 1.94.46 3.77 1.3 5.4l4.03-3.09z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.77c1.76 0 3.34.61 4.58 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0 7.3 0 3.26 2.7 1.3 6.6l4.03 3.09C6.27 6.87 8.9 4.77 12 4.77z"
                  />
                </svg>
                {googleLoading ? 'Redirecting…' : 'Continue with Google'}
              </Button>
              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#2E50E6]/15 dark:bg-white/10" />
                <p className="text-xs font-semibold uppercase tracking-wide text-[#2E50E6]/60 dark:text-[#FFE9F1]/50">
                  or continue with email
                </p>
                <div className="h-px flex-1 bg-[#2E50E6]/15 dark:bg-white/10" />
              </div>
            </>
          ) : null}

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              void handleLogin();
            }}
          >
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#2E50E6] dark:text-[#FFE9F1]">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#2E50E6] dark:text-[#FFE9F1]">
                Password
              </label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                autoComplete="current-password"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-[#2E50E6]/80 dark:text-[#FFE9F1]/70">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-[#2E50E6]/30 text-[#2E50E6] focus:ring-[#2E50E6]"
              />
              Remember me
            </label>
            <Button
              type="submit"
              className="w-full rounded-xl"
              disabled={loading}
            >
              {loading ? 'Logging in…' : 'Log in'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[#2E50E6]/75 dark:text-[#FFE9F1]/70">
            New here?{' '}
            <Link className="font-medium text-[#E62E6B] hover:underline dark:text-white" to="/register">
              Create an account
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-[#2E50E6]/65 dark:text-[#FFE9F1]/60">
          By continuing you agree to the{' '}
          <Link to="/terms" className="underline">
            Terms
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

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
import { authService } from '../services/auth.service';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await authService.login({ email, password });
      login(response.accessToken, response.user);
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

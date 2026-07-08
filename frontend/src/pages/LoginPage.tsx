import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import axios from 'axios';
import logo from '../assets/logo.svg';
import { ErrorMessage } from '../components/ErrorMessage';
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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="w-full max-w-sm">
        <Link
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          to="/welcome"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 text-center">
            <img
              src={logo}
              alt="TourMate AI"
              className="mx-auto h-12 w-12"
            />
            <h1 className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
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
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
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
              variant="dark"
              className="w-full rounded-xl dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
              disabled={loading}
            >
              {loading ? 'Logging in…' : 'Log in'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            New here?{' '}
            <Link className="font-medium text-slate-900 hover:underline dark:text-slate-100" to="/register">
              Create an account
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
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

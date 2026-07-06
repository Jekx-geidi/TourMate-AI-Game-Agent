import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.svg';
import { AuroraBackground } from '../components/AuroraBackground';
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
    <div className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:py-12">
      <AuroraBackground />
      <Card className="w-full max-w-lg space-y-6">
        <div className="text-center">
          <img src={logo} alt="TourMate Game logo" className="mx-auto h-28 w-28" />
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-100">
            Tour<span className="text-violet-600 dark:text-violet-400">Mate</span>
          </p>
          <p className="text-xs font-bold uppercase tracking-[0.5em] text-fuchsia-600">Game</p>
          <h1 className="mt-4 text-xl font-bold text-slate-950 dark:text-white">Welcome back, explorer!</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Log in to continue your journey — your XP, badges, and challenges are waiting.
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
        <p className="text-sm text-slate-600 dark:text-slate-400">
          New here?{' '}
          <Link className="font-semibold text-blue-600" to="/register">
            Create an account
          </Link>
        </p>
        <p className="text-center text-xs text-slate-400">
          By continuing you agree to the{' '}
          <Link to="/terms" className="underline">Terms & Conditions</Link> and{' '}
          <Link to="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </Card>
    </div>
  );
}

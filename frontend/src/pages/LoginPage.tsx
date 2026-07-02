import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-700">
            Welcome Back
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">Log in to TourMate AI</h1>
          <p className="mt-2 text-sm text-slate-600">
            How are your studies today? Let’s continue where you left off.
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
            } catch {
              setError('Login failed. Please double-check your email and password.');
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </Button>
        <p className="text-sm text-slate-600">
          New here?{' '}
          <Link className="font-semibold text-blue-600" to="/register">
            Create an account
          </Link>
        </p>
      </Card>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorMessage } from '../components/ErrorMessage';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { useAuth } from '../hooks/use-auth';
import { authService } from '../services/auth.service';

export function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-xl space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-violet-700 dark:text-violet-300">
            Start Your Journey
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">Create your account</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Build your own tourism study space with notes, quizzes, games, and AI help.
          </p>
        </div>
        {error ? <ErrorMessage message={error} /> : null}
        <div className="grid gap-4">
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Name"
          />
          <Input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
          />
          <Input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Password"
          />
          <Input
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            placeholder="Confirm password"
          />
        </div>
        <Button
          className="w-full"
          disabled={loading}
          onClick={async () => {
            try {
              setLoading(true);
              setError('');
              const response = await authService.register(form);
              login(response.accessToken, response.user);
              navigate('/dashboard');
            } catch {
              setError('Registration failed. Please review your information and try again.');
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? 'Creating account...' : 'Register'}
        </Button>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{' '}
          <Link className="font-semibold text-blue-600" to="/login">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
}


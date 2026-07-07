import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import axios from 'axios';
import { DotGridBackground } from '../components/DotGridBackground';
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

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await authService.register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      login(response.accessToken, response.user);
      navigate('/dashboard');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        setError(
          Array.isArray(message)
            ? message.join(', ')
            : message ?? 'Registration failed. Please try again.',
        );
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fcf8ff] px-3 py-4 sm:px-4 sm:py-10">
      <DotGridBackground />
      <div className="relative mx-auto flex min-h-[calc(100vh-2rem)] max-w-3xl items-center justify-center sm:min-h-[calc(100vh-5rem)]">
        <Card className="w-full max-w-2xl space-y-5 border border-violet-200/70 bg-white/90 p-5 shadow-[0_30px_80px_-36px_rgba(124,58,237,0.30)] backdrop-blur-xl sm:p-8">
          <div className="flex items-center gap-3">
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-700 transition hover:border-fuchsia-200 hover:bg-fuchsia-50"
              to="/welcome"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Link>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-700 sm:text-sm">
              Start Your Journey
            </p>
            <h1 className="mt-3 text-2xl font-bold text-slate-950 sm:text-3xl">
              Create your account
            </h1>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Create your TourMate AI account with your name, email, and password.
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
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              placeholder="Confirm password"
            />
          </div>
          <Button
            className="w-full"
            disabled={loading}
            onClick={() => void handleRegister()}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
          <p className="text-sm text-slate-600">
            Already have an account?{' '}
            <Link className="font-semibold text-violet-700" to="/login">
              Log in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}

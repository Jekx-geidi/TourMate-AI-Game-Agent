import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import axios from 'axios';
import logo from '../assets/logo.svg';
import { ErrorMessage } from '../components/ErrorMessage';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { PasswordInput } from '../components/ui/password-input';
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
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

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
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (!err.response) {
          setError('Unable to reach the server. Please try again in a moment.');
        } else {
          const message = err.response.data?.message;
          setError(
            (Array.isArray(message) ? message.join(', ') : message) ??
              'Registration failed. Please try again.',
          );
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="palette-screen flex min-h-screen items-center justify-center px-4 py-10 dark:bg-[#19053B]">
      <div className="w-full max-w-sm">
        <Link
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#49316B] transition hover:text-[#19053B] dark:text-[#FBEAFF] dark:hover:text-white"
          to="/welcome"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="palette-panel rounded-2xl border p-7 sm:p-8 dark:border-white/10 dark:bg-[#19053B]/90">
          <div className="mb-6 text-center">
            <img src={logo} alt="TourMate AI" className="palette-ring mx-auto h-14 w-14 rounded-2xl" />
            <h1 className="mt-4 text-xl font-semibold text-[#19053B] dark:text-[#FBEAFF]">
              Create your account
            </h1>
            <p className="mt-1 text-sm text-[#49316B]/75 dark:text-[#FBEAFF]/70">
              Start learning with TourMate AI.
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
              void handleRegister();
            }}
          >
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#49316B] dark:text-[#FBEAFF]">Name</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                autoComplete="name"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#49316B] dark:text-[#FBEAFF]">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#49316B] dark:text-[#FBEAFF]">
                Password
              </label>
              <PasswordInput
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="At least 8 characters"
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#49316B] dark:text-[#FBEAFF]">
                Confirm password
              </label>
              <PasswordInput
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                placeholder="Re-enter your password"
                autoComplete="new-password"
              />
            </div>
            <Button
              type="submit"
              className="w-full rounded-xl"
              disabled={loading}
            >
              {loading ? 'Creating account…' : 'Create account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[#49316B]/75 dark:text-[#FBEAFF]/70">
            Already have an account?{' '}
            <Link className="font-medium text-[#19053B] hover:underline dark:text-white" to="/login">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

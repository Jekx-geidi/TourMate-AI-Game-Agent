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
import { supabase } from '../lib/supabase';
import { authService } from '../services/auth.service';

function describeError(err: unknown, fallback: string) {
  if (axios.isAxiosError(err)) {
    if (!err.response) return 'Unable to reach the server. Please try again in a moment.';
    const message = err.response.data?.message;
    return (Array.isArray(message) ? message.join(', ') : message) ?? fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState<'form' | 'code'>('form');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignup = async () => {
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
  };

  const handleRequestCode = async () => {
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await authService.requestRegisterCode({ email: form.email.trim() });
      setStep('code');
    } catch (err) {
      setError(describeError(err, 'Could not send a verification code. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await authService.register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        code: code.trim(),
      });

      login(response.accessToken, response.user);
      navigate('/dashboard');
    } catch (err) {
      setError(describeError(err, 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setLoading(true);
      setError('');
      await authService.requestRegisterCode({ email: form.email.trim() });
    } catch (err) {
      setError(describeError(err, 'Could not resend the code. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="palette-screen flex min-h-screen items-center justify-center px-4 py-10 dark:bg-[#0A0A0F]">
      <div className="w-full max-w-sm">
        <Link
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#2E50E6] transition hover:text-[#E62E6B] dark:text-[#FFE9F1] dark:hover:text-white"
          to="/welcome"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="palette-panel rounded-2xl border p-7 sm:p-8 dark:border-white/10 dark:bg-[#0A0A0F]/90">
          <div className="mb-6 text-center">
            <img src={logo} alt="TourMate AI" className="palette-ring mx-auto h-14 w-auto rounded-2xl" />
            <h1 className="mt-4 text-xl font-semibold text-[#E62E6B] dark:text-[#FFE9F1]">
              {step === 'form' ? 'Create your account' : 'Check your email'}
            </h1>
            <p className="mt-1 text-sm text-[#2E50E6]/75 dark:text-[#FFE9F1]/70">
              {step === 'form'
                ? 'Start learning with TourMate AI.'
                : `Enter the 6-digit code we sent to ${form.email.trim()}.`}
            </p>
          </div>

          {error ? (
            <div className="mb-4">
              <ErrorMessage message={error} />
            </div>
          ) : null}

          {step === 'form' && supabase ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-xl"
                disabled={googleLoading}
                onClick={() => void handleGoogleSignup()}
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

          {step === 'form' ? (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                void handleRequestCode();
              }}
            >
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#2E50E6] dark:text-[#FFE9F1]">Name</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#2E50E6] dark:text-[#FFE9F1]">Email</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#2E50E6] dark:text-[#FFE9F1]">
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
                <label className="text-sm font-medium text-[#2E50E6] dark:text-[#FFE9F1]">
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
                {loading ? 'Sending code…' : 'Send verification code'}
              </Button>
            </form>
          ) : (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                void handleVerifyAndRegister();
              }}
            >
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#2E50E6] dark:text-[#FFE9F1]">
                  Verification code
                </label>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  inputMode="numeric"
                  maxLength={6}
                  autoComplete="one-time-code"
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full rounded-xl" disabled={loading || code.trim().length !== 6}>
                {loading ? 'Verifying…' : 'Verify and create account'}
              </Button>
              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  className="font-medium text-[#2E50E6] hover:underline dark:text-[#FFE9F1]"
                  onClick={() => setStep('form')}
                >
                  Change email
                </button>
                <button
                  type="button"
                  className="font-medium text-[#2E50E6] hover:underline dark:text-[#FFE9F1] disabled:opacity-50"
                  disabled={loading}
                  onClick={() => void handleResendCode()}
                >
                  Resend code
                </button>
              </div>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-[#2E50E6]/75 dark:text-[#FFE9F1]/70">
            Already have an account?{' '}
            <Link className="font-medium text-[#E62E6B] hover:underline dark:text-white" to="/login">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DotGridBackground } from '../components/DotGridBackground';
import { ErrorMessage } from '../components/ErrorMessage';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { useAuth } from '../hooks/use-auth';
import { supabase } from '../lib/supabase';
import { authService } from '../services/auth.service';

export function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    verificationCode: '',
  });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);

  const ensureSupabase = () => {
    if (!supabase) {
      throw new Error(
        'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
      );
    }
    return supabase;
  };

  const handleSendCode = async () => {
    if (!form.email.trim()) {
      setError('Enter your email first so we know where to send the code.');
      return;
    }

    try {
      setSendingCode(true);
      setError('');
      setNotice('');
      const client = ensureSupabase();
      const { error } = await client.auth.signInWithOtp({
        email: form.email.trim(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/register`,
        },
      });

      if (error) {
        throw error;
      }

      setNotice(
        `A Supabase login code or magic link was sent to ${form.email.trim()}.`,
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ??
            'We could not send the verification code right now.',
        );
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('We could not send the verification code right now.');
      }
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyAndRegister = async () => {
    try {
      setLoading(true);
      setError('');
      setNotice('');

      const client = ensureSupabase();
      const { data, error } = await client.auth.verifyOtp({
        email: form.email.trim(),
        token: form.verificationCode.trim(),
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

      const response = await authService.supabaseRegister({
        name: form.name.trim(),
        accessToken,
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
    <div className="relative min-h-screen overflow-hidden bg-[#fcf8ff] px-4 py-12">
      <DotGridBackground />
      <div className="relative mx-auto flex min-h-[calc(100vh-6rem)] max-w-3xl items-center justify-center">
        <Card className="w-full max-w-2xl space-y-6 border border-violet-200/70 bg-white/90 p-8 shadow-[0_30px_80px_-36px_rgba(124,58,237,0.30)] backdrop-blur-xl">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-violet-700">
              Start Your Journey
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-950">
              Create your account
            </h1>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Enter your email, request a Supabase login code, then verify it to
              create your TourMate AI account.
            </p>
          </div>
          {error ? <ErrorMessage message={error} /> : null}
          {notice ? (
            <div className="rounded-[1.5rem] border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-800">
              {notice}
            </div>
          ) : null}
          <div className="grid gap-4">
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Name"
            />
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <Input
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value, verificationCode: '' })
                }
                placeholder="Email"
              />
              <Button
                type="button"
                className="sm:min-w-[170px]"
                disabled={sendingCode}
                onClick={() => void handleSendCode()}
              >
                {sendingCode ? 'Sending...' : 'Send Code'}
              </Button>
            </div>
            <Input
              value={form.verificationCode}
              onChange={(e) =>
                setForm({ ...form, verificationCode: e.target.value })
              }
              placeholder="6-digit verification code"
            />
          </div>
          <Button
            className="w-full"
            disabled={loading}
            onClick={() => void handleVerifyAndRegister()}
          >
            {loading ? 'Verifying...' : 'Verify & Register'}
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

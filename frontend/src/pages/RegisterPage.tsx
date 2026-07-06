import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    verificationCode: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);

  const handleSendCode = async () => {
    if (!form.email.trim()) {
      setError('Enter your email first so we know where to send the code.');
      return;
    }

    try {
      setSendingCode(true);
      setError('');
      const response = await authService.requestRegisterCode({
        email: form.email.trim(),
      });
      setNotice(
        response.message ?? 'A verification code has been sent to your email.',
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ??
            'We could not send the verification code right now.',
        );
      } else {
        setError('We could not send the verification code right now.');
      }
    } finally {
      setSendingCode(false);
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
              Enter your email, request a verification code, then finish creating
              your TourMate AI account. No Google sign-in needed.
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
            onClick={async () => {
              try {
                setLoading(true);
                setError('');
                setNotice('');
                const response = await authService.register(form);
                login(response.accessToken, response.user);
                navigate('/dashboard');
              } catch (error) {
                if (axios.isAxiosError(error)) {
                  const message = error.response?.data?.message;
                  setError(
                    Array.isArray(message)
                      ? message.join(', ')
                      : message ??
                          'Registration failed. Please review your information and try again.',
                  );
                } else {
                  setError(
                    'Registration failed. Please review your information and try again.',
                  );
                }
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? 'Creating account...' : 'Verify & Register'}
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

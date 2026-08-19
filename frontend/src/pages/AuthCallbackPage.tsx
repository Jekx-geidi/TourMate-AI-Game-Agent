import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuth } from '../hooks/use-auth';
import { apiErrorMessage } from '../lib/http';
import { supabase } from '../lib/supabase';
import { authService } from '../services/auth.service';

// Landing point for the Supabase OAuth redirect (e.g. Google). The Supabase
// client parses the access token out of the URL itself; this page just waits
// for that session, then exchanges it for TourMate's own JWT the same way
// every other login path does.
export function AuthCallbackPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const handled = useRef(false);

  useEffect(() => {
    if (!supabase) {
      setError('Google sign-in is not configured yet.');
      return;
    }

    const completeSignIn = async (accessToken: string) => {
      if (handled.current) return;
      handled.current = true;
      try {
        const response = await authService.continueWithSupabase(accessToken);
        login(response.accessToken, response.user, true);
        navigate('/dashboard', { replace: true });
      } catch (err) {
        setError(apiErrorMessage(err, 'Google sign-in failed. Please try again.'));
      }
    };

    void supabase.auth.getSession().then(({ data }) => {
      if (data.session?.access_token) {
        void completeSignIn(data.session.access_token);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.access_token) {
        void completeSignIn(session.access_token);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [login, navigate]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-4 text-center">
          <ErrorMessage message={error} />
          <button
            type="button"
            className="text-sm font-semibold text-[#2E50E6] hover:underline"
            onClick={() => navigate('/login')}
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  return <LoadingSpinner label="Finishing sign-in..." />;
}

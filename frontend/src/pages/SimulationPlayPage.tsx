import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { apiErrorMessage, isHttpStatus } from '../lib/http';
import { newIdempotencyKey, simulationsService } from '../services/simulations.service';
import type { SimulationSessionView } from '../types';

const SESSION_QUERY_KEY = (slug: string) => ['simulation-session', 'by-slug', slug];

export function SimulationPlayPage() {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const pendingAnswerKey = useRef<string | null>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);

  const sessionQuery = useQuery<SimulationSessionView>({
    queryKey: SESSION_QUERY_KEY(slug),
    // Starting is idempotent: it creates a session or resumes the existing
    // in-progress one, which is exactly what a refresh/direct visit needs.
    queryFn: () => simulationsService.start(slug),
    retry: false,
  });

  useEffect(() => {
    setSelectedOptionId(null);
    stepHeadingRef.current?.focus();
  }, [sessionQuery.data?.step?.id]);

  const answerMutation = useMutation({
    mutationFn: async () => {
      const session = sessionQuery.data;
      if (!session?.step || !selectedOptionId) {
        throw new Error('Select an option before continuing.');
      }
      if (!pendingAnswerKey.current) {
        pendingAnswerKey.current = newIdempotencyKey();
      }
      return simulationsService.submitAnswer(
        session.sessionId,
        session.step.id,
        selectedOptionId,
        pendingAnswerKey.current,
      );
    },
    onSuccess: (response) => {
      pendingAnswerKey.current = null;
      queryClient.setQueryData<SimulationSessionView | undefined>(SESSION_QUERY_KEY(slug), (previous) =>
        previous
          ? {
              ...previous,
              step: response.nextStep,
              progress: response.progress,
              canComplete: response.canComplete,
            }
          : previous,
      );
    },
    onError: (error) => {
      if (isHttpStatus(error, 409)) {
        // The server's expected step moved on (stale conflict). Trust and
        // render the canonical server state rather than retrying blindly.
        pendingAnswerKey.current = null;
        void queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEY(slug) });
      }
    },
  });

  const completeMutation = useMutation({
    mutationFn: () => {
      const session = sessionQuery.data;
      if (!session) throw new Error('No active session.');
      return simulationsService.complete(session.sessionId);
    },
    onSuccess: (result) => {
      navigate(`/simulation-sessions/${result.sessionId}/results`);
    },
  });

  if (sessionQuery.isLoading) return <LoadingSpinner label="Loading mission..." />;
  if (sessionQuery.isError || !sessionQuery.data) {
    return <ErrorMessage message="We could not load this mission session. Please return to Missions and try again." />;
  }

  const session = sessionQuery.data;

  if (session.status === 'COMPLETED') {
    return <Navigate to={`/simulation-sessions/${session.sessionId}/results`} replace />;
  }

  const step = session.step;
  const progress = session.progress ?? { current: 0, total: step ? 1 : 0 };

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Card className="space-y-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-700 dark:text-cyan-300">
            {session.mission.title} · {session.mission.role}
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
            Step {Math.min(progress.current + (step ? 1 : 0), progress.total)} of {progress.total}
          </p>
        </div>

        {step ? (
          <div className="space-y-4" aria-live="polite">
            <h1
              ref={stepHeadingRef}
              tabIndex={-1}
              className="text-2xl font-black text-slate-950 outline-none dark:text-white"
            >
              {step.title}
            </h1>
            <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{step.prompt}</p>
            {step.guidance ? (
              <p className="text-xs italic text-slate-500 dark:text-slate-500">{step.guidance}</p>
            ) : null}

            <fieldset className="space-y-3">
              <legend className="sr-only">Choose your response</legend>
              {step.options.map((option) => (
                <label
                  key={option.id}
                  className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#2E50E6]/20 bg-white p-4 text-sm transition hover:border-[#00C351]/60 has-[:checked]:border-[#00C351] has-[:checked]:bg-[#FFE9F1] dark:border-white/10 dark:bg-[#0A0A0F]/60 dark:has-[:checked]:bg-white/10"
                >
                  <input
                    type="radio"
                    name="step-option"
                    value={option.id}
                    checked={selectedOptionId === option.id}
                    onChange={() => setSelectedOptionId(option.id)}
                    disabled={answerMutation.isPending}
                    className="mt-1 h-4 w-4 accent-[#E62E6B]"
                  />
                  <span className="text-slate-800 dark:text-slate-100">{option.text}</span>
                </label>
              ))}
            </fieldset>

            {answerMutation.isError && !isHttpStatus(answerMutation.error, 409) ? (
              <ErrorMessage message={apiErrorMessage(answerMutation.error, 'We could not submit that answer. Please try again.')} />
            ) : null}

            <Button
              onClick={() => answerMutation.mutate()}
              disabled={!selectedOptionId || answerMutation.isPending}
            >
              {answerMutation.isPending ? 'Submitting...' : 'Continue'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h1 ref={stepHeadingRef} tabIndex={-1} className="text-2xl font-black text-slate-950 outline-none dark:text-white">
              All decisions recorded
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              You have answered every step of this mission. Complete it to see your results.
            </p>
            {completeMutation.isError ? (
              <ErrorMessage message={apiErrorMessage(completeMutation.error, 'We could not complete this mission. Please try again.')} />
            ) : null}
            <Button onClick={() => completeMutation.mutate()} disabled={completeMutation.isPending}>
              {completeMutation.isPending ? 'Completing...' : 'View my result'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

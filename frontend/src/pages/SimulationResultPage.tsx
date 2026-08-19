import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { CompetencyBreakdown } from '../components/simulations/CompetencyBreakdown';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { RESULT_BAND_HINT, RESULT_BAND_LABELS } from '../lib/competencies';
import { simulationsService } from '../services/simulations.service';
import type { SimulationResultResponse } from '../types';

export function SimulationResultPage() {
  const { sessionId = '' } = useParams();
  const navigate = useNavigate();

  const resultQuery = useQuery<SimulationResultResponse>({
    queryKey: ['simulation-result', sessionId],
    queryFn: () => simulationsService.getResult(sessionId),
  });

  if (resultQuery.isLoading) return <LoadingSpinner label="Loading your result..." />;
  if (resultQuery.isError || !resultQuery.data) {
    return <ErrorMessage message="We could not load this result. It may not be ready yet, or you may not have access to it." />;
  }

  const result = resultQuery.data;
  const nextAction = result.deterministicFeedback.nextAction;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Card className="space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-300">
            Mission complete
          </p>
          <h1 className="mt-2 text-4xl font-black text-slate-950 dark:text-white">
            {result.overallScore}%
          </h1>
          <p className="mt-1 text-lg font-bold text-slate-800 dark:text-slate-100">
            {RESULT_BAND_LABELS[result.resultBand] ?? result.resultBand}
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {RESULT_BAND_HINT[result.resultBand]}
          </p>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
            This is learning guidance, not an official grade.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">
            Category breakdown
          </h2>
          <div className="mt-3">
            <CompetencyBreakdown scores={result.categoryScores} />
          </div>
        </div>

        <div className="space-y-3 rounded-2xl bg-[#FFE9F1] p-4 dark:bg-white/5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wide text-[#2E50E6] dark:text-[#FFE9F1]/80">
              Coaching feedback
            </h2>
            <span className="text-xs font-semibold text-[#2E50E6]/70 dark:text-[#FFE9F1]/60">
              {result.coachFeedback.source === 'AI' ? 'AI-generated' : 'Reviewed guidance'}
            </span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-200">{result.coachFeedback.content.summary}</p>

          {result.coachFeedback.content.strengths.length > 0 ? (
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">Strengths</p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
                {result.coachFeedback.content.strengths.map((item) => (
                  <li key={item.competency}>{item.evidence}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {result.coachFeedback.content.improvements.length > 0 ? (
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                Areas to improve
              </p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
                {result.coachFeedback.content.improvements.map((item) => (
                  <li key={item.competency}>{item.suggestion}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {result.reward.xpAwarded > 0 || result.reward.newPersonalBest ? (
          <div className="flex items-center justify-between rounded-2xl border border-[#00C351]/40 bg-white p-4 text-sm font-semibold text-slate-800 dark:bg-[#0A0A0F]/60 dark:text-slate-100">
            <span>+{result.reward.xpAwarded} XP</span>
            {result.reward.newPersonalBest ? <span>New personal best!</span> : null}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          {nextAction.type === 'LESSON' && nextAction.route ? (
            <Link to={nextAction.route}>
              <Button variant="outline">{nextAction.label}</Button>
            </Link>
          ) : null}
          <Button variant="outline" onClick={() => navigate('/progress')}>
            View Career Passport
          </Button>
          <Button onClick={() => navigate('/simulations')}>Back to Missions</Button>
        </div>
      </Card>
    </div>
  );
}

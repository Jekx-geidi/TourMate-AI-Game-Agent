import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { COMPETENCY_LABELS } from '../lib/competencies';
import { simulationsService } from '../services/simulations.service';
import type { SimulationDetail } from '../types';

export function SimulationDetailPage() {
  const { slug = '' } = useParams();
  const navigate = useNavigate();

  const detailQuery = useQuery<SimulationDetail>({
    queryKey: ['simulations', 'detail', slug],
    queryFn: () => simulationsService.getBySlug(slug),
  });

  if (detailQuery.isLoading) return <LoadingSpinner label="Loading mission..." />;
  if (detailQuery.isError || !detailQuery.data) {
    return <ErrorMessage message="This mission is not available right now." />;
  }

  const mission = detailQuery.data;
  const primaryLabel =
    mission.learner.status === 'IN_PROGRESS'
      ? 'Resume mission'
      : mission.learner.status === 'COMPLETED'
        ? 'Replay mission'
        : 'Start mission';

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500 dark:text-slate-400">
        <Link to="/simulations" className="hover:underline">
          Missions
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-800 dark:text-slate-100">{mission.title}</span>
      </nav>

      <Card className="space-y-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-300">
            {mission.difficulty} · {mission.stepCount} decision steps
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">{mission.title}</h1>
          <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">Role: {mission.role}</p>
        </div>

        <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">{mission.context}</p>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">
            Learning objectives
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-400">
            {mission.objectives.map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">
            Competencies practiced
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {mission.competencies.map((code) => (
              <span
                key={code}
                className="rounded-full bg-[#FFE9F1] px-3 py-1 text-xs font-semibold text-[#2E50E6] dark:bg-white/10 dark:text-[#FFE9F1]/80"
              >
                {COMPETENCY_LABELS[code] ?? code}
              </span>
            ))}
          </div>
        </div>

        {mission.relatedLessons.length > 0 ? (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">
              Related lesson
            </h2>
            <Link to={mission.relatedLessons[0].route} className="mt-2 inline-block text-sm font-semibold text-cyan-700 hover:underline dark:text-cyan-300">
              {mission.relatedLessons[0].title}
            </Link>
          </div>
        ) : null}

        {mission.learner.attemptCount > 0 ? (
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Attempts so far: {mission.learner.attemptCount}
            {mission.learner.bestScore !== null ? ` · Best score: ${mission.learner.bestScore}%` : ''}
            {mission.learner.latestScore !== null ? ` · Latest score: ${mission.learner.latestScore}%` : ''}
          </p>
        ) : null}

        <p className="text-xs text-slate-500 dark:text-slate-500">
          Results are learning guidance to help you practice, not an official grade.
        </p>

        <Button onClick={() => navigate(`/simulations/${slug}/play`)}>{primaryLabel}</Button>
      </Card>
    </div>
  );
}

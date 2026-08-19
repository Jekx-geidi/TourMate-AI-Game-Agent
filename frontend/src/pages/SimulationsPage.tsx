import { useQuery } from '@tanstack/react-query';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SimulationCard } from '../components/simulations/SimulationCard';
import { simulationsService } from '../services/simulations.service';
import type { SimulationListResponse } from '../types';

export function SimulationsPage() {
  const { data, isLoading, isError } = useQuery<SimulationListResponse>({
    queryKey: ['simulations', 'list'],
    queryFn: () => simulationsService.list(),
  });

  if (isLoading) return <LoadingSpinner label="Loading missions..." />;
  if (isError || !data) {
    return <ErrorMessage message="We could not load the missions catalog right now." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-700 dark:text-cyan-300">
          Missions
        </p>
        <h1 className="mt-3 text-4xl font-black text-slate-950 dark:text-white">
          Practice real tourism workplace decisions.
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
          Each mission is a short, branching scenario. Your decisions are scored against a
          transparent rubric, and results are learning guidance, not official grades.
        </p>
      </div>

      {data.items.length === 0 ? (
        <EmptyState
          title="No missions available yet"
          description="Check back soon, or continue your studies in Learn while missions are added."
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {data.items.map((simulation) => (
            <SimulationCard key={simulation.id} simulation={simulation} />
          ))}
        </div>
      )}
    </div>
  );
}

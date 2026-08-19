import { ArrowRight, Plane, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { SimulationCatalogItem } from '../../types';
import { COMPETENCY_LABELS } from '../../lib/competencies';

const STATUS_LABEL: Record<SimulationCatalogItem['learnerStatus'], string> = {
  NOT_STARTED: 'Not started',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Completed',
};

export function SimulationCard({ simulation }: { simulation: SimulationCatalogItem }) {
  const actionLabel =
    simulation.learnerStatus === 'IN_PROGRESS'
      ? 'Resume mission'
      : simulation.learnerStatus === 'COMPLETED'
        ? 'Replay mission'
        : 'Start mission';

  return (
    <Link to={`/simulations/${simulation.slug}`}>
      <div className="group relative h-full overflow-hidden rounded-[1.75rem] border border-[#2E50E6]/15 bg-white p-6 text-[#E62E6B] shadow-soft transition duration-200 hover:-translate-y-1 hover:border-[#00C351]/60 hover:shadow-pop dark:border-white/10 dark:bg-[#0A0A0F]/80 dark:text-[#FFE9F1]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#E62E6B] via-[#2E50E6] to-[#00C351]" />
        <div className="relative flex h-full flex-col">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFE9F1] text-[#2E50E6] ring-1 ring-[#2E50E6]/15 dark:bg-white/10 dark:text-[#00C351] dark:ring-white/10">
              <Plane className="h-6 w-6" />
            </div>
            <span className="rounded-full bg-[#2E50E6]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#2E50E6] dark:bg-white/10 dark:text-[#00C351]">
              {STATUS_LABEL[simulation.learnerStatus]}
            </span>
          </div>

          {simulation.subject ? (
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#2E50E6] dark:text-[#00C351]">
              {simulation.subject.code}
            </p>
          ) : null}
          <h3 className="mt-2 text-xl font-bold">{simulation.title}</h3>
          <p className="mt-3 flex-1 text-sm leading-6 text-[#2E50E6]/75 dark:text-[#FFE9F1]/70">
            {simulation.summary}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {simulation.competencies.slice(0, 3).map((code) => (
              <span
                key={code}
                className="rounded-full bg-[#FFE9F1] px-2.5 py-1 text-xs font-semibold text-[#2E50E6] dark:bg-white/10 dark:text-[#FFE9F1]/80"
              >
                {COMPETENCY_LABELS[code] ?? code}
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs font-semibold text-[#2E50E6]/70 dark:text-[#FFE9F1]/60">
            <span>{simulation.stepCount} decision steps</span>
            {simulation.bestScore !== null ? <span>Best: {simulation.bestScore}%</span> : null}
          </div>

          <div className="mt-5 inline-flex items-center gap-2 self-start rounded-full bg-[#E62E6B] px-4 py-2 text-sm font-bold text-white shadow-pop transition group-hover:bg-[#2E50E6]">
            {actionLabel}
            {simulation.learnerStatus === 'COMPLETED' ? (
              <RefreshCw className="h-4 w-4 transition group-hover:rotate-90" />
            ) : (
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

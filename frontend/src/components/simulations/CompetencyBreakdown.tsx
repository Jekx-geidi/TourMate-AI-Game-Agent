import type { CompetencyCode } from '../../types';
import { COMPETENCY_LABELS } from '../../lib/competencies';

export function CompetencyBreakdown({ scores }: { scores: Record<CompetencyCode, number> }) {
  const entries = Object.entries(scores) as Array<[CompetencyCode, number]>;

  return (
    <div className="space-y-3" role="table" aria-label="Category score breakdown">
      {entries.map(([code, score]) => (
        <div key={code} role="row" className="space-y-1">
          <div role="cell" className="flex items-center justify-between text-sm font-semibold text-slate-800 dark:text-slate-100">
            <span>{COMPETENCY_LABELS[code] ?? code}</span>
            <span>{score}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={score}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${COMPETENCY_LABELS[code] ?? code}: ${score} percent`}
            className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#E62E6B] via-[#2E50E6] to-[#00C351]"
              style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

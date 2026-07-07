import type { ReactNode } from 'react';

export function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: ReactNode;
  tone?: number;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white p-6 text-slate-900 shadow-soft dark:border-slate-700/70 dark:bg-slate-900 dark:text-slate-100"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-slate-950 to-cyan-700" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-extrabold text-cyan-700 dark:text-cyan-300">{value}</p>
          <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{hint}</p>
        </div>
        <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-700 ring-1 ring-cyan-100 dark:bg-cyan-950/30 dark:text-cyan-300 dark:ring-cyan-900/50">{icon}</div>
      </div>
    </div>
  );
}

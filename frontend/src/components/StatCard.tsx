import type { ReactNode } from 'react';
import { cardGradient } from '../lib/palette';

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = 0,
}: {
  label: string;
  value: string;
  hint: string;
  icon: ReactNode;
  tone?: number;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[1.75rem] p-6 text-white shadow-pop ${cardGradient(tone)}`}
    >
      <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/15" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-white/80">{label}</p>
          <p className="mt-2 text-3xl font-extrabold">{value}</p>
          <p className="mt-2 text-xs leading-5 text-white/80">{hint}</p>
        </div>
        <div className="rounded-2xl bg-white/25 p-3 backdrop-blur">{icon}</div>
      </div>
    </div>
  );
}

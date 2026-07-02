import type { ReactNode } from 'react';
import { Card } from './ui/card';

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
}) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
          <p className="mt-2 text-sm text-slate-600">{hint}</p>
        </div>
        <div className="rounded-2xl bg-teal-50 p-3 text-teal-700">{icon}</div>
      </div>
    </Card>
  );
}


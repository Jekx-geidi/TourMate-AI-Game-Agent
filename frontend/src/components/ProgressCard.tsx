import { Card } from './ui/card';

export function ProgressCard({
  label,
  percent,
}: {
  label: string;
  percent: number;
}) {
  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-slate-900 dark:text-slate-100">{label}</p>
        <span className="text-sm font-medium text-cyan-700 dark:text-cyan-300">{percent}%</span>
      </div>
      <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-slate-950 to-cyan-700"
          style={{ width: `${percent}%` }}
        />
      </div>
    </Card>
  );
}


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
        <p className="font-semibold text-slate-900">{label}</p>
        <span className="text-sm font-medium text-teal-700">{percent}%</span>
      </div>
      <div className="h-3 rounded-full bg-slate-100">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-teal-600 to-blue-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </Card>
  );
}


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
        <p className="font-semibold text-[#E62E6B] dark:text-[#FFE9F1]">{label}</p>
        <span className="text-sm font-medium text-[#2E50E6] dark:text-[#00C351]">{percent}%</span>
      </div>
      <div className="h-3 rounded-full bg-[#FFE9F1] dark:bg-white/10">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-[#E62E6B] via-[#2E50E6] to-[#00C351]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </Card>
  );
}


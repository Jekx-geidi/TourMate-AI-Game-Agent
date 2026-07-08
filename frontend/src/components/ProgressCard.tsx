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
        <p className="font-semibold text-[#19053B] dark:text-[#FBEAFF]">{label}</p>
        <span className="text-sm font-medium text-[#49316B] dark:text-[#00C9A9]">{percent}%</span>
      </div>
      <div className="h-3 rounded-full bg-[#FBEAFF] dark:bg-white/10">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-[#19053B] via-[#49316B] to-[#00C9A9]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </Card>
  );
}


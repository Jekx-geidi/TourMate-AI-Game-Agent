import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ProgressCard } from '../components/ProgressCard';
import { Card } from '../components/ui/card';
import { progressService } from '../services/progress.service';
import type { ProgressSummary } from '../types';

export function ProgressPage() {
  const { data, isLoading } = useQuery<ProgressSummary>({
    queryKey: ['progress-summary'],
    queryFn: progressService.summary,
  });

  if (isLoading || !data) return <LoadingSpinner label="Loading your progress..." />;

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <h1 className="text-4xl font-black text-slate-950">Progress</h1>
        <p className="text-sm text-slate-600">
          Track your quiz consistency, subject momentum, and overall growth.
        </p>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className="text-sm text-slate-500">Overall progress</p>
          <p className="mt-2 text-4xl font-black text-teal-700">{data.overallProgress}%</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Quiz average</p>
          <p className="mt-2 text-4xl font-black text-blue-600">{data.quizAverage}%</p>
        </Card>
      </div>
      <div className="grid gap-4">
        {data.subjectProgress.map((item) => (
          <ProgressCard
            key={item.id}
            label={`${item.subject.code} - ${item.subject.title}`}
            percent={item.percent}
          />
        ))}
      </div>
    </div>
  );
}


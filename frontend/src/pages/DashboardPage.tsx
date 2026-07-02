import { useQuery } from '@tanstack/react-query';
import { BookOpen, NotebookPen, Sparkles, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ProgressCard } from '../components/ProgressCard';
import { StatCard } from '../components/StatCard';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useAuth } from '../hooks/use-auth';
import { progressService } from '../services/progress.service';
import type { ProgressSummary } from '../types';

export function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading, isError } = useQuery<ProgressSummary>({
    queryKey: ['progress-summary'],
    queryFn: progressService.summary,
  });

  if (isLoading) return <LoadingSpinner label="Building your study dashboard..." />;
  if (isError || !data) return <ErrorMessage message="We could not load your dashboard right now." />;

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-white via-teal-50 to-sky-50">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-700">
          Dashboard
        </p>
        <h1 className="mt-3 text-4xl font-black text-slate-950">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-4 text-lg text-slate-600">How are your studies today?</p>
        <p className="text-sm text-slate-500">What did you achieve today?</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/subjects">
            <Button>Continue learning</Button>
          </Link>
          <Link to="/ai-tutor">
            <Button variant="outline">Open AI Tutor</Button>
          </Link>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Study streak" value={`${data.studyStreak} days`} hint="Consistency creates confidence." icon={<Trophy className="h-5 w-5" />} />
        <StatCard label="Total notes" value={`${data.totalNotes}`} hint="Your review ideas are building up." icon={<NotebookPen className="h-5 w-5" />} />
        <StatCard label="Quiz average" value={`${data.quizAverage}%`} hint="Nice work. Keep sharpening your fundamentals." icon={<BookOpen className="h-5 w-5" />} />
        <StatCard label="Overall progress" value={`${data.overallProgress}%`} hint={data.recommendedActivity} icon={<Sparkles className="h-5 w-5" />} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Subject progress</h2>
          <div className="grid gap-4">
            {data.subjectProgress.map((item) => (
              <ProgressCard key={item.id} label={`${item.subject.code} - ${item.subject.title}`} percent={item.percent} />
            ))}
          </div>
        </Card>
        <div className="space-y-6">
          <Card className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">Recommended activity</h2>
            <p className="text-sm text-slate-600">{data.recommendedActivity}</p>
          </Card>
          <Card className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">Recent notes</h2>
            {data.recentNotes.map((note) => (
              <div key={note.id} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">{note.title}</p>
                <p className="mt-1 text-sm text-slate-500">{note.subject.code}</p>
              </div>
            ))}
          </Card>
          <Card className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">Recent quiz results</h2>
            {data.recentQuizResults.map((result) => (
              <div key={result.id} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">{result.quiz.subject.code}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {result.score}/{result.total}
                </p>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}


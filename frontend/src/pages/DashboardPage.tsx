import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Globe2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import mascotHero from '../assets/mascot-hero.png';
import { ChallengePanel } from '../components/ChallengePanel';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ProgressCard } from '../components/ProgressCard';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useAuth } from '../hooks/use-auth';
import { useGame } from '../hooks/use-game';
import { progressService } from '../services/progress.service';
import type { ProgressSummary } from '../types';

export function DashboardPage() {
  const { user } = useAuth();
  const { notify } = useGame();
  const { data, isLoading, isError } = useQuery<ProgressSummary>({
    queryKey: ['progress-summary'],
    queryFn: progressService.summary,
  });

  useEffect(() => {
    if (!data) return;
    const key = `tourmate_last_streak_${user?.id ?? 'guest'}`;
    const last = Number(localStorage.getItem(key) ?? '-1');
    if (data.studyStreak !== last) {
      localStorage.setItem(key, String(data.studyStreak));
      if (last >= 0 && data.studyStreak > last) {
        notify(
          'streak',
          `Study streak: ${data.studyStreak} day${data.studyStreak === 1 ? '' : 's'}!`,
          'Your streak grew — come back tomorrow to keep it alive.',
        );
      }
    }
  }, [data, notify, user?.id]);

  if (isLoading) return <LoadingSpinner label="Building your study dashboard..." />;
  if (isError || !data) return <ErrorMessage message="We could not load your dashboard right now." />;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[2rem] brand-gradient p-8 text-white shadow-pop">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-black/10" />
        <div className="relative">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-wrap items-center gap-5">
              <img
                src={mascotHero}
                alt="TourMate mascot"
                className="h-20 w-20 shrink-0 rounded-full border-4 border-white/30 bg-white/10 object-cover shadow-lg sm:h-28 sm:w-28"
              />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/70">
                  Dashboard
                </p>
                <h1 className="mt-3 text-4xl font-black">Welcome back, {user?.name}!</h1>
                <p className="mt-3 text-lg text-white/85">How are your studies today?</p>
                <p className="text-sm text-white/70">What did you achieve today?</p>
              </div>
            </div>
            <Link to="/subjects">
              <Button variant="white">Continue learning</Button>
            </Link>
          </div>
          <div className="mt-8 grid max-w-xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { value: `${data.studyStreak}`, label: 'Day streak' },
              { value: `${data.totalNotes}`, label: 'Notes' },
              { value: `${data.quizAverage}%`, label: 'Quiz avg' },
              { value: `${data.overallProgress}%`, label: 'Progress' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-extrabold">{stat.value}</p>
                <p className="mt-1 text-xs font-medium text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/ai-tutor">
              <Button variant="glass">Open AI Tutor</Button>
            </Link>
            <Link to="/maps-flags">
              <Button variant="glass">
                <Globe2 className="mr-2 h-4 w-4" />
                Explore the world map
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Subject progress</h2>
          <div className="grid gap-4">
            {data.subjectProgress.map((item) => (
              <ProgressCard key={item.id} label={`${item.subject.code} - ${item.subject.title}`} percent={item.percent} />
            ))}
          </div>
        </Card>
        <div className="space-y-6">
          <ChallengePanel />
          <Card className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Recommended activity</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">{data.recommendedActivity}</p>
          </Card>
          <Card className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Recent notes</h2>
            {data.recentNotes.map((note) => (
              <div key={note.id} className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4">
                <p className="font-semibold text-slate-900 dark:text-slate-100">{note.title}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{note.subject.code}</p>
              </div>
            ))}
          </Card>
          <Card className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Recent quiz results</h2>
            {data.recentQuizResults.map((result) => (
              <div key={result.id} className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4">
                <p className="font-semibold text-slate-900 dark:text-slate-100">{result.quiz.subject.code}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
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


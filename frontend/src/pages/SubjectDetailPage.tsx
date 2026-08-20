import { useQuery } from '@tanstack/react-query';
import { Bot, Gamepad2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Mascot } from '../components/Mascot';
import { CategoryCard } from '../components/CategoryCard';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ProgressCard } from '../components/ProgressCard';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { learningCategories } from '../lib/static-data';
import { progressService } from '../services/progress.service';
import { subjectsService } from '../services/subjects.service';
import type { ProgressSummary, Subject } from '../types';

export function SubjectDetailPage() {
  const { id = '' } = useParams();
  const subjectQuery = useQuery<Subject>({
    queryKey: ['subject', id],
    queryFn: () => subjectsService.get(id),
  });
  const summaryQuery = useQuery<ProgressSummary>({
    queryKey: ['progress-summary'],
    queryFn: progressService.summary,
  });

  if (subjectQuery.isLoading) return <LoadingSpinner label="Preparing your subject hub..." />;
  if (subjectQuery.isError || !subjectQuery.data) return <ErrorMessage message="This subject could not be loaded." />;

  const subject = subjectQuery.data;
  const progress =
    summaryQuery.data?.subjectProgress.find((item) => item.subjectId === subject.id)?.percent ?? 0;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[2rem] brand-gradient p-8 text-white shadow-pop">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-black/10" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-5">
            <Mascot
              pose="hero"
              alt="TourMate mascot"
              className="h-20 w-20 shrink-0 rounded-full border-4 border-white/30 bg-white/10 object-cover shadow-lg sm:h-28 sm:w-28"
            />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/70">
                {subject.code}
              </p>
              <h1 className="mt-3 text-4xl font-black">{subject.title}</h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-white/85">{subject.description}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to={`/subjects/${subject.id}/lessons`}>
              <Button variant="white">Start lesson</Button>
            </Link>
            <Link to={`/subjects/${subject.id}/tutor`}>
              <Button variant="glass">
                <Bot className="mr-2 h-4 w-4" />
                Ask the Subject Agent
              </Button>
            </Link>
            <Link to={`/subjects/${subject.id}/games`}>
              <Button variant="glass">
                <Gamepad2 className="mr-2 h-4 w-4" />
                Play games
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <ProgressCard label="Current subject progress" percent={progress} />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {learningCategories.map((category, index) => {
          const href = category.global
            ? `/${category.route}`
            : `/subjects/${subject.id}/${category.route}`;

          return (
            <CategoryCard
              key={category.title}
              title={category.title}
              description={category.description}
              href={href}
              tone={index}
            />
          );
        })}
      </div>

      <Card className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Recent lesson highlights</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {subject.lessons.slice(0, 3).map((lesson) => (
            <Card key={lesson.id} className="bg-slate-50 dark:bg-slate-800/60">
              <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">Lesson {lesson.order}</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{lesson.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{lesson.summary}</p>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}


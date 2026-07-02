import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
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
      <Card className="bg-gradient-to-br from-white via-sky-50 to-teal-50">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-700">
          {subject.code}
        </p>
        <h1 className="mt-3 text-4xl font-black text-slate-950">{subject.title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{subject.description}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to={`/subjects/${subject.id}/lessons`}>
            <Button>Start lesson</Button>
          </Link>
          <Link to="/ai-tutor">
            <Button variant="outline">Ask AI Tutor</Button>
          </Link>
        </div>
      </Card>

      <ProgressCard label="Current subject progress" percent={progress} />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {learningCategories.map((category) => {
          const href = category.global
            ? `/${category.route}`
            : `/subjects/${subject.id}/${category.route}`;

          return (
            <CategoryCard
              key={category.title}
              title={category.title}
              description={category.description}
              href={href}
            />
          );
        })}
      </div>

      <Card className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Recent lesson highlights</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {subject.lessons.slice(0, 3).map((lesson) => (
            <Card key={lesson.id} className="bg-slate-50">
              <p className="text-sm font-semibold text-teal-700">Lesson {lesson.order}</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">{lesson.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{lesson.summary}</p>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}


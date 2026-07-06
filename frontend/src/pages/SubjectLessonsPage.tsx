import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ErrorMessage } from '../components/ErrorMessage';
import { LessonCard } from '../components/LessonCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Card } from '../components/ui/card';
import { subjectsService } from '../services/subjects.service';
import type { Lesson } from '../types';

export function SubjectLessonsPage() {
  const { id = '' } = useParams();
  const { data, isLoading, isError } = useQuery<Lesson[]>({
    queryKey: ['subject-lessons', id],
    queryFn: () => subjectsService.lessons(id),
  });
  const [selectedId, setSelectedId] = useState<string>();

  if (isLoading) return <LoadingSpinner label="Loading lessons..." />;
  if (isError || !data) return <ErrorMessage message="We could not load the lessons for this subject." />;

  const selected = data.find((lesson) => lesson.id === selectedId) ?? data[0];

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <div className="space-y-4">
        {data.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            active={lesson.id === selected.id}
            onClick={() => setSelectedId(lesson.id)}
          />
        ))}
      </div>
      <Card className="space-y-5">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-700 dark:text-violet-300">
          Lesson {selected.order}
        </p>
        <h1 className="text-3xl font-black text-slate-950 dark:text-white">{selected.title}</h1>
        <p className="rounded-2xl bg-violet-50 dark:bg-violet-950/40 p-4 text-sm leading-6 text-violet-800 dark:text-violet-300">
          {selected.summary}
        </p>
        <p className="whitespace-pre-line text-base leading-8 text-slate-700 dark:text-slate-300">
          {selected.content}
        </p>
      </Card>
    </div>
  );
}


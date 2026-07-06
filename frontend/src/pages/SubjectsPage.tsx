import { useQuery } from '@tanstack/react-query';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SubjectCard } from '../components/SubjectCard';
import { subjectsService } from '../services/subjects.service';
import type { Subject } from '../types';

export function SubjectsPage() {
  const { data, isLoading, isError } = useQuery<Subject[]>({
    queryKey: ['subjects'],
    queryFn: subjectsService.list,
  });

  if (isLoading) return <LoadingSpinner label="Loading subjects..." />;
  if (isError || !data) return <ErrorMessage message="We could not load the subjects right now." />;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-700 dark:text-violet-300">
          Subjects
        </p>
        <h1 className="mt-3 text-4xl font-black text-slate-950 dark:text-white">
          Choose a subject and start a focused study path.
        </h1>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {data.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </div>
    </div>
  );
}


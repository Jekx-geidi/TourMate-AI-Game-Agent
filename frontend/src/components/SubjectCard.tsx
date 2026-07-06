import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { gradientForKey } from '../lib/palette';
import type { Subject } from '../types';

export function SubjectCard({ subject }: { subject: Subject }) {
  return (
    <Link to={`/subjects/${subject.id}`}>
      <div
        className={`group relative h-full overflow-hidden rounded-[1.75rem] p-6 text-white shadow-pop transition duration-200 hover:-translate-y-1 hover:shadow-2xl ${gradientForKey(subject.code)}`}
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/15" />
        <div className="pointer-events-none absolute -bottom-14 -left-8 h-32 w-32 rounded-full bg-black/5" />
        <div className="relative">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/25 backdrop-blur">
            <BookOpen className="h-6 w-6" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/80">
            {subject.code}
          </p>
          <h3 className="mt-3 text-xl font-bold">{subject.title}</h3>
          <p className="mt-3 text-sm leading-6 text-white/85">{subject.description}</p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white dark:bg-slate-900 px-4 py-2 text-sm font-bold text-slate-800 dark:text-slate-200">
            Start learning
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}

import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Subject } from '../types';

export function SubjectCard({ subject }: { subject: Subject }) {
  return (
    <Link to={`/subjects/${subject.id}`}>
      <div
        className="group relative h-full overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white p-6 text-slate-900 shadow-soft transition duration-200 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-pop dark:border-slate-700/70 dark:bg-slate-900 dark:text-slate-100"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-slate-950 to-cyan-700" />
        <div className="relative">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700 ring-1 ring-cyan-100 dark:bg-cyan-950/30 dark:text-cyan-300 dark:ring-cyan-900/50">
            <BookOpen className="h-6 w-6" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-700 dark:text-cyan-300">
            {subject.code}
          </p>
          <h3 className="mt-3 text-xl font-bold">{subject.title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{subject.description}</p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-pop transition group-hover:bg-cyan-700">
            Start learning
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}

import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Subject } from '../types';

export function SubjectCard({ subject }: { subject: Subject }) {
  return (
    <Link to={`/subjects/${subject.id}`}>
      <div
        className="group relative h-full overflow-hidden rounded-[1.75rem] border border-[#2E50E6]/15 bg-white p-6 text-[#E62E6B] shadow-soft transition duration-200 hover:-translate-y-1 hover:border-[#00C351]/60 hover:shadow-pop dark:border-white/10 dark:bg-[#0A0A0F]/80 dark:text-[#FFE9F1]"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#E62E6B] via-[#2E50E6] to-[#00C351]" />
        <div className="relative">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFE9F1] text-[#2E50E6] ring-1 ring-[#2E50E6]/15 dark:bg-white/10 dark:text-[#00C351] dark:ring-white/10">
            <BookOpen className="h-6 w-6" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#2E50E6] dark:text-[#00C351]">
            {subject.code}
          </p>
          <h3 className="mt-3 text-xl font-bold">{subject.title}</h3>
          <p className="mt-3 text-sm leading-6 text-[#2E50E6]/75 dark:text-[#FFE9F1]/70">{subject.description}</p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#E62E6B] px-4 py-2 text-sm font-bold text-white shadow-pop transition group-hover:bg-[#2E50E6]">
            Start learning
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}

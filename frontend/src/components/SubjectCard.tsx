import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Subject } from '../types';
import { Card } from './ui/card';

export function SubjectCard({ subject }: { subject: Subject }) {
  return (
    <Link to={`/subjects/${subject.id}`}>
      <Card className="group h-full transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
          <BookOpen className="h-6 w-6" />
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-700">
          {subject.code}
        </p>
        <h3 className="mt-3 text-xl font-bold text-slate-900">{subject.title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{subject.description}</p>
        <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600">
          Start learning <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </div>
      </Card>
    </Link>
  );
}


import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CategoryCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
  tone?: number;
}) {
  return (
    <Link to={href}>
      <div
        className="group relative h-full overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white p-6 text-slate-900 shadow-soft transition duration-200 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-pop dark:border-slate-700/70 dark:bg-slate-900 dark:text-slate-100"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-slate-950 to-cyan-700" />
        <div className="relative">
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-1.5 text-sm font-bold text-white shadow-pop transition group-hover:bg-cyan-700">
            Open mode <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}

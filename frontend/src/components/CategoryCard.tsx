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
        className="group relative h-full overflow-hidden rounded-[1.75rem] border border-[#49316B]/15 bg-white p-6 text-[#19053B] shadow-soft transition duration-200 hover:-translate-y-1 hover:border-[#00C9A9]/60 hover:shadow-pop dark:border-white/10 dark:bg-[#19053B]/80 dark:text-[#FBEAFF]"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#19053B] via-[#49316B] to-[#00C9A9]" />
        <div className="relative">
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-[#49316B]/75 dark:text-[#FBEAFF]/70">{description}</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#19053B] px-4 py-1.5 text-sm font-bold text-white shadow-pop transition group-hover:bg-[#49316B]">
            Open mode <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}

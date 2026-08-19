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
        className="group relative h-full overflow-hidden rounded-[1.75rem] border border-[#2E50E6]/15 bg-white p-6 text-[#E62E6B] shadow-soft transition duration-200 hover:-translate-y-1 hover:border-[#00C351]/60 hover:shadow-pop dark:border-white/10 dark:bg-[#0A0A0F]/80 dark:text-[#FFE9F1]"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#E62E6B] via-[#2E50E6] to-[#00C351]" />
        <div className="relative">
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-[#2E50E6]/75 dark:text-[#FFE9F1]/70">{description}</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#E62E6B] px-4 py-1.5 text-sm font-bold text-white shadow-pop transition group-hover:bg-[#2E50E6]">
            Open mode <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}

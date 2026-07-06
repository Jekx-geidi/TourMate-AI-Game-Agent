import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cardGradient } from '../lib/palette';

export function CategoryCard({
  title,
  description,
  href,
  tone = 0,
}: {
  title: string;
  description: string;
  href: string;
  tone?: number;
}) {
  return (
    <Link to={href}>
      <div
        className={`group relative h-full overflow-hidden rounded-[1.75rem] p-6 text-white shadow-pop transition duration-200 hover:-translate-y-1 ${cardGradient(tone)}`}
      >
        <div className="pointer-events-none absolute -bottom-10 -right-8 h-28 w-28 rounded-full bg-white/15" />
        <div className="relative">
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-white/85">{description}</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-bold backdrop-blur transition group-hover:bg-white/30">
            Open mode <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}

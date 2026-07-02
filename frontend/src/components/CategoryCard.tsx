import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from './ui/card';

export function CategoryCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link to={href}>
      <Card className="h-full transition duration-200 hover:-translate-y-1">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-teal-700">
          Open mode <ArrowRight className="h-4 w-4" />
        </div>
      </Card>
    </Link>
  );
}


import type { ReactNode } from 'react';
import { Card } from './ui/card';

export function GameCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card className="space-y-4">
      <div>
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
      </div>
      {children}
    </Card>
  );
}


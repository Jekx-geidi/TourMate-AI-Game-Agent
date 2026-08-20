import type { ReactNode } from 'react';
import { Mascot } from './Mascot';
import type { MascotPose } from '../assets/mascots';
import { Card } from './ui/card';

export function EmptyState({
  title,
  description,
  action,
  pose,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  pose?: MascotPose;
}) {
  return (
    <Card className="text-center">
      {pose ? <Mascot pose={pose} alt="" className="mx-auto mb-3 h-20 w-20" /> : null}
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </Card>
  );
}


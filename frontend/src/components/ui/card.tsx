import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'glass-panel rounded-3xl border border-slate-200/80 p-6 shadow-soft',
        className,
      )}
      {...props}
    />
  );
}


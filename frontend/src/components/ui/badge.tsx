import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-violet-50 dark:bg-violet-950/40 px-3 py-1 text-xs font-semibold text-violet-700 dark:text-violet-300',
        className,
      )}
      {...props}
    />
  );
}

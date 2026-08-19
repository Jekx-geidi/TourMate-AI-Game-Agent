import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-[#FFE9F1] px-3 py-1 text-xs font-semibold text-[#2E50E6] dark:bg-white/10 dark:text-[#FFE9F1]',
        className,
      )}
      {...props}
    />
  );
}

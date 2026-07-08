import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-[#FBEAFF] px-3 py-1 text-xs font-semibold text-[#49316B] dark:bg-white/10 dark:text-[#FBEAFF]',
        className,
      )}
      {...props}
    />
  );
}

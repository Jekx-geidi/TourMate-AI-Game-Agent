import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full rounded-xl border border-[#49316B]/20 bg-white px-4 py-3 text-sm text-[#19053B] outline-none transition placeholder:text-[#49316B]/45 focus:border-[#00C9A9] focus:ring-2 focus:ring-[#00C9A9]/20 dark:border-white/10 dark:bg-[#19053B] dark:text-[#FBEAFF] dark:focus:ring-[#00C9A9]/20',
        className,
      )}
      {...props}
    />
  );
}


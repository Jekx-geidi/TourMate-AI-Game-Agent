import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full rounded-xl border border-[#2E50E6]/20 bg-white px-4 py-3 text-sm text-[#E62E6B] outline-none transition placeholder:text-[#2E50E6]/45 focus:border-[#00C351] focus:ring-2 focus:ring-[#00C351]/20 dark:border-white/10 dark:bg-[#0A0A0F] dark:text-[#FFE9F1] dark:focus:ring-[#00C351]/20',
        className,
      )}
      {...props}
    />
  );
}


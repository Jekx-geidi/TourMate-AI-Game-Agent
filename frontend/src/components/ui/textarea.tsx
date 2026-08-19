import type { TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'w-full rounded-2xl border border-[#2E50E6]/20 bg-white px-4 py-3 text-sm text-[#E62E6B] outline-none transition focus:border-[#00C351] focus:ring-2 focus:ring-[#00C351]/20 dark:border-white/10 dark:bg-[#0A0A0F] dark:text-[#FFE9F1] dark:focus:ring-[#00C351]/20',
        className,
      )}
      {...props}
    />
  );
}


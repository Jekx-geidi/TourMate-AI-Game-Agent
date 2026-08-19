import { useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../lib/utils';

export function PasswordInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? 'text' : 'password'}
        className={cn(
          'w-full rounded-xl border border-[#2E50E6]/20 bg-white px-4 py-3 pr-12 text-sm text-[#E62E6B] outline-none transition placeholder:text-[#2E50E6]/45 focus:border-[#00C351] focus:ring-2 focus:ring-[#00C351]/20 dark:border-white/10 dark:bg-[#0A0A0F] dark:text-[#FFE9F1] dark:focus:ring-[#00C351]/20',
          className,
        )}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-[#2E50E6]/55 transition hover:text-[#E62E6B] dark:text-[#FFE9F1]/55 dark:hover:text-white"
      >
        {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
}

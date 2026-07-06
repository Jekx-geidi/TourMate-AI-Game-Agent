import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-300 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-pop hover:from-violet-700 hover:to-fuchsia-600',
        secondary:
          'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-pop hover:from-blue-500 hover:to-indigo-600',
        ghost:
          'bg-transparent text-slate-700 hover:bg-violet-50 dark:text-slate-300 dark:hover:bg-violet-900/30',
        outline:
          'border border-violet-200 bg-white text-violet-700 hover:bg-violet-50 dark:border-violet-800/60 dark:bg-slate-900 dark:text-violet-300 dark:hover:bg-violet-900/30',
        amber:
          'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-pop hover:from-amber-500 hover:to-orange-600',
        white: 'bg-white text-violet-700 shadow-md hover:bg-violet-50',
        glass: 'bg-white/15 text-white backdrop-blur hover:bg-white/25',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />;
}


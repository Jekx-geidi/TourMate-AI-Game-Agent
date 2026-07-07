import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-200 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-slate-950 to-cyan-700 text-white shadow-pop hover:from-slate-900 hover:to-cyan-600',
        secondary:
          'bg-gradient-to-r from-cyan-700 to-blue-700 text-white shadow-pop hover:from-cyan-600 hover:to-blue-600',
        ghost:
          'bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/80',
        outline:
          'border border-slate-300 bg-white text-slate-800 hover:border-cyan-300 hover:bg-cyan-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-cyan-700 dark:hover:bg-cyan-950/30',
        amber:
          'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-pop hover:from-amber-600 hover:to-orange-600',
        white: 'bg-white text-slate-900 shadow-md hover:bg-cyan-50',
        glass: 'bg-white/12 text-white backdrop-blur hover:bg-white/22',
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

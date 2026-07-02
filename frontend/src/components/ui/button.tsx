import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-teal-700 text-white shadow-soft hover:bg-teal-800',
        secondary: 'bg-blue-600 text-white hover:bg-blue-700',
        ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
        outline: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
        amber: 'bg-amber-500 text-slate-950 hover:bg-amber-400',
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


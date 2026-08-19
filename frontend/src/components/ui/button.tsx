import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#00C351]/35 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-[#E62E6B] via-[#2E50E6] to-[#00C351] text-white shadow-pop hover:brightness-110',
        secondary:
          'bg-gradient-to-r from-[#2E50E6] to-[#00C351] text-white shadow-pop hover:brightness-110',
        ghost:
          'bg-transparent text-[#2E50E6] hover:bg-[#FFE9F1] dark:text-[#FFE9F1] dark:hover:bg-white/10',
        outline:
          'border border-[#2E50E6]/25 bg-white text-[#E62E6B] hover:border-[#00C351] hover:bg-[#FFE9F1] dark:border-[#FFE9F1]/20 dark:bg-[#0A0A0F] dark:text-[#FFE9F1] dark:hover:border-[#00C351] dark:hover:bg-[#2E50E6]/60',
        dark: 'bg-[#E62E6B] text-white hover:bg-[#2E50E6]',
        amber:
          'bg-gradient-to-r from-[#2E50E6] to-[#00C351] text-white shadow-pop hover:brightness-110',
        white: 'bg-white text-[#E62E6B] shadow-md hover:bg-[#FFE9F1]',
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

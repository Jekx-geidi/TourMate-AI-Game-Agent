import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#00C9A9]/35 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-[#19053B] via-[#49316B] to-[#00C9A9] text-white shadow-pop hover:brightness-110',
        secondary:
          'bg-gradient-to-r from-[#49316B] to-[#00C9A9] text-white shadow-pop hover:brightness-110',
        ghost:
          'bg-transparent text-[#49316B] hover:bg-[#FBEAFF] dark:text-[#FBEAFF] dark:hover:bg-white/10',
        outline:
          'border border-[#49316B]/25 bg-white text-[#19053B] hover:border-[#00C9A9] hover:bg-[#FBEAFF] dark:border-[#FBEAFF]/20 dark:bg-[#19053B] dark:text-[#FBEAFF] dark:hover:border-[#00C9A9] dark:hover:bg-[#49316B]/60',
        dark: 'bg-[#19053B] text-white hover:bg-[#49316B]',
        amber:
          'bg-gradient-to-r from-[#49316B] to-[#00C9A9] text-white shadow-pop hover:brightness-110',
        white: 'bg-white text-[#19053B] shadow-md hover:bg-[#FBEAFF]',
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

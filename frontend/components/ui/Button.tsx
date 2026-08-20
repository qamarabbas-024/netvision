import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'cyan' | 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'cyan',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#121316] disabled:opacity-50 disabled:cursor-not-allowed select-none font-sans';

    const variants = {
      primary: 'bg-[#2563eb] hover:bg-[#3b82f6] text-white shadow-sm font-bold focus:ring-[#2563eb]',
      cyan: 'bg-[#38bdf8] hover:bg-[#7dd3fc] text-[#121316] font-bold shadow-sm focus:ring-[#38bdf8]',
      secondary: 'bg-[#14151a] hover:bg-[#1b1e26] text-[#e2e4e9] border border-[#2a2e39] hover:border-zinc-500 font-semibold focus:ring-zinc-500',
      ghost: 'bg-transparent hover:bg-[#1b1e26] text-[#949ba8] hover:text-white font-medium focus:ring-zinc-500',
      danger: 'bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold focus:ring-rose-500',
      outline: 'bg-transparent border border-[#2a2e39] text-[#38bdf8] hover:bg-[#14151a] hover:border-[#38bdf8]/50 focus:ring-[#38bdf8]',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon ? rightIcon : null}
      </button>
    );
  }
);

Button.displayName = 'Button';

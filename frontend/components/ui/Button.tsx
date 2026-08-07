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
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#09090b] disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const variants = {
      cyan: 'bg-[#00f0ff] hover:bg-[#00f0ff]/90 text-black shadow-glow-cyan focus:ring-[#00f0ff]',
      primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-glow-blue focus:ring-blue-500',
      secondary: 'bg-[#181820] hover:bg-[#272732] text-zinc-200 border border-[#272732] focus:ring-zinc-500',
      ghost: 'bg-transparent hover:bg-white/5 text-zinc-300 hover:text-white focus:ring-zinc-500',
      danger: 'bg-rose-600 hover:bg-rose-500 text-white focus:ring-rose-500',
      outline: 'bg-transparent border border-[#00f0ff]/40 text-[#00f0ff] hover:bg-[#00f0ff]/10 focus:ring-[#00f0ff]',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-5 py-2.5 text-sm gap-2',
      lg: 'px-7 py-3.5 text-base gap-2.5',
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

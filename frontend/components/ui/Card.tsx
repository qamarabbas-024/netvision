import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: 'cyan' | 'blue' | 'purple' | 'emerald' | 'rose' | 'none';
  interactive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, glowColor = 'none', interactive = false, children, ...props }, ref) => {
    const glowClasses = {
      cyan: 'hover:border-[#00f0ff]/40',
      blue: 'hover:border-blue-500/40',
      purple: 'hover:border-purple-500/40',
      emerald: 'hover:border-emerald-500/40',
      rose: 'hover:border-rose-500/40',
      none: '',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'glass-panel rounded-xl p-5 sm:p-6 border border-[#272732] transition-colors duration-150',
          interactive && 'hover:border-zinc-700 cursor-pointer',
          glowClasses[glowColor],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn('flex flex-col gap-1 mb-4', className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, children, ...props }) => (
  <h3 className={cn('text-lg font-bold text-white tracking-tight', className)} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => (
  <p className={cn('text-xs text-zinc-400 leading-relaxed', className)} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn('w-full', className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn('mt-6 pt-4 border-t border-[#272732]/60 flex items-center justify-between', className)} {...props}>
    {children}
  </div>
);

import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: 'cyan' | 'blue' | 'purple' | 'emerald' | 'rose' | 'none';
  interactive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, glowColor = 'none', interactive = false, children, ...props }, ref) => {
    const glowClasses = {
      cyan: 'hover:border-[#00f0ff]/50 hover:shadow-glow-cyan',
      blue: 'hover:border-blue-500/50 hover:shadow-glow-blue',
      purple: 'hover:border-purple-500/50 hover:shadow-glow-purple',
      emerald: 'hover:border-emerald-500/50',
      rose: 'hover:border-rose-500/50',
      none: '',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'glass-panel rounded-2xl p-6 border border-[#272732] transition-all duration-300',
          interactive && 'hover:-translate-y-1 cursor-pointer',
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

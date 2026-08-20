import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: 'cyan' | 'blue' | 'purple' | 'emerald' | 'rose' | 'none';
  interactive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, glowColor = 'none', interactive = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'surface-2 rounded-xl p-5 sm:p-6 shadow-instrument transition-all duration-150',
          interactive && 'hover:border-[#38bdf8]/40 hover:bg-[#1f222c] cursor-pointer',
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
  <h3 className={cn('text-base sm:text-lg font-bold text-[#f4f5f7] tracking-tight font-sans', className)} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => (
  <p className={cn('text-xs text-[#949ba8] leading-relaxed font-sans', className)} {...props}>
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

import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'cyan' | 'emerald' | 'purple' | 'amber' | 'rose' | 'neutral' | 'blue';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'cyan', dot = false, children, ...props }) => {
  const variants = {
    cyan: 'bg-[#14151a] text-[#38bdf8] border-[#2a2e39]',
    blue: 'bg-[#2563eb]/10 text-[#60a5fa] border-[#2563eb]/30',
    emerald: 'bg-[#10b981]/10 text-[#34d399] border-[#10b981]/30',
    purple: 'bg-[#818cf8]/10 text-[#a5b4fc] border-[#818cf8]/30',
    amber: 'bg-[#f59e0b]/10 text-[#fbbf24] border-[#f59e0b]/30',
    rose: 'bg-[#ef4444]/10 text-[#f87171] border-[#ef4444]/30',
    neutral: 'bg-[#14151a] text-[#949ba8] border-[#2a2e39]',
  };

  const dotColors = {
    cyan: 'bg-[#38bdf8]',
    blue: 'bg-[#2563eb]',
    emerald: 'bg-[#10b981]',
    purple: 'bg-[#818cf8]',
    amber: 'bg-[#f59e0b]',
    rose: 'bg-[#ef4444]',
    neutral: 'bg-[#646c7d]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold border tracking-wider uppercase font-mono select-none',
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full inline-block', dotColors[variant])} />}
      {children}
    </span>
  );
};

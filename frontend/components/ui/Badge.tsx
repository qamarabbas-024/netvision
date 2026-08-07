import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'cyan' | 'emerald' | 'purple' | 'amber' | 'rose' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'cyan', children, ...props }) => {
  const variants = {
    cyan: 'bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/30',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    neutral: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide uppercase',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps {
  value: number; // 0 to 100
  label?: string;
  showPercent?: boolean;
  variant?: 'cyan' | 'blue' | 'emerald' | 'purple';
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  label,
  showPercent = true,
  variant = 'cyan',
  className,
}) => {
  const normalizedValue = Math.min(100, Math.max(0, value));

  const fillColors = {
    cyan: 'bg-[#00f0ff]',
    blue: 'bg-blue-500',
    emerald: 'bg-emerald-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className={cn('w-full flex flex-col gap-1.5', className)}>
      {label || showPercent ? (
        <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
          <span>{label}</span>
          {showPercent ? <span className="font-mono text-white">{Math.round(normalizedValue)}%</span> : null}
        </div>
      ) : null}
      <div className="w-full h-2.5 rounded-full bg-[#181820] border border-[#272732] overflow-hidden p-0.5">
        <div
          className={cn('h-full rounded-full transition-all duration-500', fillColors[variant])}
          style={{ width: `${normalizedValue}%` }}
        />
      </div>
    </div>
  );
};

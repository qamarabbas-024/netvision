import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps {
  value: number; // 0 to 100
  label?: string;
  showPercent?: boolean;
  variant?: 'cyan' | 'blue' | 'emerald' | 'purple' | 'amber';
  className?: string;
  size?: 'sm' | 'md';
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  label,
  showPercent = true,
  variant = 'cyan',
  className,
  size = 'md',
}) => {
  const normalizedValue = Math.min(100, Math.max(0, value));

  const fillColors = {
    cyan: 'bg-[#38bdf8]',
    blue: 'bg-[#2563eb]',
    emerald: 'bg-[#10b981]',
    purple: 'bg-[#818cf8]',
    amber: 'bg-[#f59e0b]',
  };

  return (
    <div className={cn('w-full flex flex-col gap-1.5 font-sans', className)}>
      {label || showPercent ? (
        <div className="flex items-center justify-between text-xs font-semibold text-[#8e95a5] font-mono">
          <span>{label}</span>
          {showPercent ? <span className="text-[#f4f5f7] font-bold">{Math.round(normalizedValue)}%</span> : null}
        </div>
      ) : null}
      <div
        className={cn(
          'w-full bg-[#14151a] border border-[#2a2e39] rounded-md overflow-hidden p-0.5',
          size === 'sm' ? 'h-1.5' : 'h-2'
        )}
      >
        <div
          className={cn('h-full rounded-sm transition-all duration-300', fillColors[variant])}
          style={{ width: `${normalizedValue}%` }}
        />
      </div>
    </div>
  );
};

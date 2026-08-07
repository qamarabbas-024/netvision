import React from 'react';
import { cn } from '@/lib/utils';

export interface CircularProgressProps {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 80,
  strokeWidth = 8,
  label,
  className,
}) => {
  const normalizedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#181820"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated Progress Fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#00f0ff"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-700 ease-out shadow-glow-cyan"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center font-mono">
        <span className="text-xs font-bold text-white">{Math.round(normalizedValue)}%</span>
        {label ? <span className="text-[9px] text-zinc-500">{label}</span> : null}
      </div>
    </div>
  );
};

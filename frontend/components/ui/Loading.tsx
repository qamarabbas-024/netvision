import React from 'react';
import { cn } from '@/lib/utils';
import { Activity } from 'lucide-react';

export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className,
}) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
  };

  return (
    <div
      className={cn(
        'border-[#00f0ff] border-t-transparent rounded-full animate-spin',
        sizes[size],
        className
      )}
    />
  );
};

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('animate-pulse rounded-xl bg-zinc-800/60 border border-zinc-700/30', className)} />
);

export const PulsePacketLoader: React.FC<{ label?: string }> = ({ label = 'Dispatching Packet Stream...' }) => (
  <div className="flex flex-col items-center justify-center gap-4 py-12">
    <div className="relative flex items-center justify-center">
      <div className="w-16 h-16 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] shadow-glow-cyan animate-pulse">
        <Activity className="w-8 h-8" />
      </div>
      <div className="absolute inset-0 rounded-2xl border border-[#00f0ff] animate-ping opacity-20" />
    </div>
    <p className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest animate-pulse">{label}</p>
  </div>
);

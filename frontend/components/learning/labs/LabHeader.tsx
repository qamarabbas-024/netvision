'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Clock, RotateCcw } from 'lucide-react';

export interface LabHeaderProps {
  title: string;
  type: 'GUIDED' | 'ASSISTED' | 'CHALLENGE' | 'TROUBLESHOOTING_INCIDENT' | string;
  difficulty: string;
  estimatedMinutes: number;
  onReset?: () => void;
}

export const LabHeader: React.FC<LabHeaderProps> = ({
  title,
  type,
  difficulty,
  estimatedMinutes,
  onReset,
}) => {
  const getTypeBadge = () => {
    switch (type.toUpperCase()) {
      case 'ASSISTED':
        return <Badge variant="purple">ASSISTED LAB</Badge>;
      case 'CHALLENGE':
        return <Badge variant="amber">CHALLENGE LAB</Badge>;
      case 'TROUBLESHOOTING_INCIDENT':
        return <Badge variant="rose">TROUBLESHOOTING INCIDENT</Badge>;
      default:
        return <Badge variant="cyan">GUIDED LAB</Badge>;
    }
  };

  return (
    <header className="glass-panel border-b border-[#272732]/80 p-5 sm:p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex flex-col gap-1.5 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          {getTypeBadge()}
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-zinc-400 bg-white/5 border border-white/10 uppercase">
            {difficulty}
          </span>
          <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#00f0ff]" /> {estimatedMinutes} mins
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight truncate">{title}</h2>
      </div>

      {onReset && (
        <button
          onClick={onReset}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono shrink-0 border border-[#272732]"
          title="Reset Lab State"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Lab
        </button>
      )}
    </header>
  );
};

'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Activity } from 'lucide-react';

export interface LabProgressProps {
  completedStepsCount: number;
  totalStepsCount: number;
}

export const LabProgress: React.FC<LabProgressProps> = ({
  completedStepsCount,
  totalStepsCount,
}) => {
  const percent = totalStepsCount > 0 ? Math.round((completedStepsCount / totalStepsCount) * 100) : 0;

  return (
    <div className="flex items-center justify-between gap-4 p-4 glass-panel rounded-2xl border border-[#272732]">
      <div className="flex items-center gap-2">
        <Badge variant="cyan">PROGRESS</Badge>
        <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
          <Activity className="w-3.5 h-3.5 text-[#00f0ff]" /> Lab Diagnostics Step {completedStepsCount} of {totalStepsCount}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-32 bg-zinc-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#00f0ff] to-emerald-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-xs font-mono text-zinc-300 font-bold">{percent}%</span>
      </div>
    </div>
  );
};

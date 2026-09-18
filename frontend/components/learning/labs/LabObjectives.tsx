'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Target, CheckCircle2 } from 'lucide-react';

export interface LabObjectivesProps {
  objectives: string[];
}

export const LabObjectives: React.FC<LabObjectivesProps> = ({ objectives }) => {
  if (!objectives || objectives.length === 0) return null;

  return (
    <Card className="p-5 glass-panel-glow border-[#00f0ff]/30 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Badge variant="cyan">OBJECTIVES</Badge>
        <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
          <Target className="w-3.5 h-3.5 text-[#00f0ff]" /> Lab Deliverables
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {objectives.map((obj, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5 text-xs text-zinc-200">
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-950/80 border border-cyan-800 text-cyan-300 shrink-0 mt-0.5">
              OBJ {idx + 1}
            </span>
            <span className="leading-snug">{obj}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import { LessonRecapItem } from '@/types/learning';

export interface LessonRecapProps {
  recaps: LessonRecapItem[];
}

export const LessonRecap: React.FC<LessonRecapProps> = ({ recaps }) => {
  if (!recaps || recaps.length === 0) return null;

  return (
    <Card className="p-6 glass-panel-glow border-emerald-500/30 flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Badge variant="emerald">QUICK RECAP</Badge>
        <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
          <RotateCcw className="w-3.5 h-3.5 text-emerald-400" /> Essential Summary Points
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {recaps.map((r) => (
          <div key={r.id} className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-xs text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{r.point}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

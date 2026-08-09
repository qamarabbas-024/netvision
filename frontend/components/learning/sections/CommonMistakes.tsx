'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { LessonMistakeItem } from '@/types/learning';

export interface CommonMistakesProps {
  mistakes: LessonMistakeItem[];
}

export const CommonMistakes: React.FC<CommonMistakesProps> = ({ mistakes }) => {
  if (!mistakes || mistakes.length === 0) return null;

  return (
    <Card className="p-6 glass-panel-glow border-amber-500/30 flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Badge variant="amber">COMMON MISTAKES & PITFALLS</Badge>
        <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Avoid These Misconceptions
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {mistakes.map((m) => (
          <div key={m.id} className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col gap-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-400 shrink-0" /> {m.mistake}
            </h4>
            <p className="text-xs text-amber-200 leading-relaxed"><strong className="text-rose-300">Why Wrong:</strong> {m.whyWrong}</p>
            <p className="text-xs text-emerald-300 leading-relaxed flex items-center gap-1.5 mt-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong className="text-emerald-400">Correct Approach:</strong> {m.correctApproach}</span>
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};

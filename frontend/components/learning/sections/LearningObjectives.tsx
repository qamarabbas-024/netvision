'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, Target } from 'lucide-react';
import { LessonObjectiveItem } from '@/types/learning';

export interface LearningObjectivesProps {
  objectives: LessonObjectiveItem[] | string[];
}

export const LearningObjectives: React.FC<LearningObjectivesProps> = ({ objectives }) => {
  if (!objectives || objectives.length === 0) return null;

  return (
    <Card className="p-6 glass-panel-glow border-[#00f0ff]/30 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Badge variant="cyan">OBJECTIVES</Badge>
        <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
          <Target className="w-3.5 h-3.5 text-[#00f0ff]" /> What You Will Master
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {objectives.map((obj, idx) => {
          const text = typeof obj === 'string' ? obj : obj.text;
          return (
            <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5 text-xs text-zinc-200">
              <CheckCircle2 className="w-4 h-4 text-[#00f0ff] shrink-0 mt-0.5" />
              <span className="leading-snug">{text}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { BookOpen } from 'lucide-react';

export interface LessonIntroductionProps {
  introduction?: string | null;
  simpleExplanation?: string | null;
}

export const LessonIntroduction: React.FC<LessonIntroductionProps> = ({
  introduction,
  simpleExplanation,
}) => {
  if (!introduction && !simpleExplanation) return null;

  return (
    <Card className="p-6 glass-panel-glow border-[#00f0ff]/30 flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Badge variant="cyan">INTRODUCTION</Badge>
        <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5 text-[#00f0ff]" /> Concept Overview
        </span>
      </div>

      {simpleExplanation && (
        <Alert variant="info" title="Simplified Takeaway">
          {simpleExplanation}
        </Alert>
      )}

      {introduction && (
        <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
          {introduction}
        </div>
      )}
    </Card>
  );
};

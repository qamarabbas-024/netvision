'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Layers } from 'lucide-react';
import { LessonConceptItem } from '@/types/learning';

export interface ConceptSectionProps {
  concepts: LessonConceptItem[];
  technicalExplanation?: string | null;
}

export const ConceptSection: React.FC<ConceptSectionProps> = ({ concepts, technicalExplanation }) => {
  if ((!concepts || concepts.length === 0) && !technicalExplanation) return null;

  return (
    <Card className="p-6 glass-panel-glow border-[#00f0ff]/30 flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Badge variant="purple">CONCEPTS & TECHNICAL EXPLANATION</Badge>
        <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-purple-400" /> Architectural Breakdown
        </span>
      </div>

      {technicalExplanation && (
        <div className="p-4 rounded-2xl bg-[#09090b] border border-[#272732] text-xs text-zinc-300 leading-relaxed font-mono whitespace-pre-line">
          {technicalExplanation}
        </div>
      )}

      {concepts && concepts.length > 0 && (
        <div className="flex flex-col gap-3">
          {concepts.map((c) => (
            <div key={c.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00f0ff]" /> {c.title}
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">{c.summary}</p>
              {c.explanation && <p className="text-[11px] text-zinc-400 leading-relaxed">{c.explanation}</p>}
              {c.technicalDetails && (
                <div className="p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 font-mono text-[11px] text-[#00f0ff]">
                  {c.technicalDetails}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

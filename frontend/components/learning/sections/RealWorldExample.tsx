'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Sparkles, Globe } from 'lucide-react';
import { LessonExampleItem } from '@/types/learning';

export interface RealWorldExampleProps {
  analogy?: string | null;
  examples?: LessonExampleItem[];
}

export const RealWorldExample: React.FC<RealWorldExampleProps> = ({ analogy, examples }) => {
  if (!analogy && (!examples || examples.length === 0)) return null;

  return (
    <Card className="p-6 glass-panel-glow border-purple-500/30 flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Badge variant="purple">REAL-WORLD ANALOGY & EXAMPLES</Badge>
        <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
          <Globe className="w-3.5 h-3.5 text-purple-400" /> Intuitive Mental Models
        </span>
      </div>

      {analogy && (
        <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-start gap-4">
          <Sparkles className="w-6 h-6 text-purple-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Intuitive Analogy</h4>
            <p className="text-xs text-purple-200 leading-relaxed">{analogy}</p>
          </div>
        </div>
      )}

      {examples && examples.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {examples.map((ex) => (
            <div key={ex.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2">
              <span className="text-xs font-bold text-white">{ex.title}</span>
              <p className="text-xs text-zinc-300 leading-relaxed"><strong className="text-purple-300">Scenario:</strong> {ex.scenario}</p>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{ex.explanation}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

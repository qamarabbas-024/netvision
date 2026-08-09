'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Eye, CheckCircle2 } from 'lucide-react';

export interface ExpectedResultProps {
  observations: string[];
}

export const ExpectedResult: React.FC<ExpectedResultProps> = ({ observations }) => {
  if (!observations || observations.length === 0) return null;

  return (
    <Card className="p-5 glass-panel-glow border-[#00f0ff]/30 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Badge variant="cyan">EXPECTED OBSERVATIONS</Badge>
        <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
          <Eye className="w-3.5 h-3.5 text-[#00f0ff]" /> Diagnostic Telemetry Indicators
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {observations.map((obs, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 text-xs text-zinc-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{obs}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

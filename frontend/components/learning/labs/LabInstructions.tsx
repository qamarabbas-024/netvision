'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Terminal, Network } from 'lucide-react';

export interface LabInstructionsProps {
  instructions: string;
  environmentSummary?: string;
}

export const LabInstructions: React.FC<LabInstructionsProps> = ({
  instructions,
  environmentSummary,
}) => {
  return (
    <Card className="p-5 glass-panel-glow border-[#00f0ff]/30 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Badge variant="cyan">INSTRUCTIONS</Badge>
        <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
          <Terminal className="w-3.5 h-3.5 text-[#00f0ff]" /> Lab Execution Steps
        </span>
      </div>

      {environmentSummary && (
        <div className="p-3 rounded-xl bg-[#09090b] border border-purple-500/30 text-xs text-purple-200 font-mono flex items-center gap-2">
          <Network className="w-4 h-4 text-purple-400 shrink-0" />
          <span>Environment: {environmentSummary}</span>
        </div>
      )}

      <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
        {instructions}
      </div>
    </Card>
  );
};

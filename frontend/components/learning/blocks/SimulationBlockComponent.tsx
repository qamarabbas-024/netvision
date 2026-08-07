import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SimulationEngineCanvas } from '@/components/simulation/SimulationEngineCanvas';
import { SimulationBlock, AnimationBlock } from '@/types/learning';

export const SimulationBlockComponent: React.FC<{ block: SimulationBlock | AnimationBlock }> = ({ block }) => {
  const instructionText = 'instruction' in block ? block.instruction : block.description;

  return (
    <Card className="p-6 flex flex-col gap-4 glass-panel-glow border-[#00f0ff]/30">
      <div className="flex items-center justify-between">
        <Badge variant="cyan">EMBEDDED SIMULATION ENGINE</Badge>
        <span className="text-xs font-mono text-zinc-400">Protocol: {block.protocol}</span>
      </div>

      <p className="text-xs text-zinc-300 leading-relaxed font-semibold">{instructionText}</p>

      {/* Embedded Simulation Canvas */}
      <SimulationEngineCanvas />
    </Card>
  );
};

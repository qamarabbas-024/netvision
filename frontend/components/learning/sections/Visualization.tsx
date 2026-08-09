'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Eye } from 'lucide-react';
import { VisualRegistry } from '@/components/visuals/VisualRegistry';
import { InteractiveControlPanel } from '../blocks/InteractiveControlPanel';

export interface VisualizationProps {
  topicSlug: string;
  visualizationType?: string | null;
}

export const Visualization: React.FC<VisualizationProps> = ({ topicSlug, visualizationType }) => {
  const targetSlug = visualizationType || topicSlug;

  return (
    <Card className="p-6 glass-panel-glow border-[#00f0ff]/30 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="cyan">VISUALIZATION & INTERACTIVE CONTROLS</Badge>
          <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-[#00f0ff]" /> Live Packet Flow Animation
          </span>
        </div>
      </div>

      <VisualRegistry topicSlug={targetSlug} />

      <InteractiveControlPanel topicSlug={targetSlug} />
    </Card>
  );
};

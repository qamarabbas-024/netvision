import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { IntroductionBlock } from '@/types/learning';
import { Clock, Layers } from 'lucide-react';

export const IntroductionBlockComponent: React.FC<{ block: IntroductionBlock; title: string }> = ({
  block,
  title,
}) => {
  return (
    <Card className="p-8 glass-panel-glow border-[#00f0ff]/30">
      <div className="flex items-center gap-3 mb-4">
        <Badge variant={block.level === 'BEGINNER' ? 'cyan' : block.level === 'INTERMEDIATE' ? 'purple' : 'rose'}>
          {block.level}
        </Badge>
        <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-[#00f0ff]" /> {block.estimatedMinutes} Mins Estimated
        </span>
      </div>

      <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">{title}</h1>
      <p className="text-sm text-zinc-300 leading-relaxed max-w-2xl">{block.tagline}</p>
    </Card>
  );
};

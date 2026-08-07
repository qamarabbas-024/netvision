import React from 'react';
import { Card } from '@/components/ui/Card';
import { ObjectivesBlock } from '@/types/learning';
import { CheckCircle2, Target } from 'lucide-react';

export const ObjectivesBlockComponent: React.FC<{ block: ObjectivesBlock }> = ({ block }) => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-[#00f0ff]" />
        <h3 className="text-base font-bold text-white">Learning Objectives</h3>
      </div>

      <div className="flex flex-col gap-3">
        {block.objectives.map((obj, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="text-xs text-zinc-300 leading-relaxed">{obj}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TechnicalDataCard } from '../blocks/TechnicalDataCard';
import { FileText } from 'lucide-react';

export interface CheatsheetProps {
  cheatsheet?: any;
}

export const Cheatsheet: React.FC<CheatsheetProps> = ({ cheatsheet }) => {
  if (!cheatsheet) return null;

  const items = Array.isArray(cheatsheet)
    ? cheatsheet
    : Object.entries(cheatsheet).map(([key, val]) => ({
        title: key,
        value: typeof val === 'string' ? val : JSON.stringify(val),
      }));

  return (
    <Card className="p-6 glass-panel-glow border-[#00f0ff]/30 flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Badge variant="cyan">QUICK CHEATSHEET</Badge>
        <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
          <FileText className="w-3.5 h-3.5 text-[#00f0ff]" /> Quick Reference Card
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item: any, idx: number) => (
          <TechnicalDataCard
            key={idx}
            title={item.title || `Param ${idx + 1}`}
            value={item.value || item.code || String(item)}
            type={item.type || 'protocol'}
            description={item.description}
          />
        ))}
      </div>
    </Card>
  );
};

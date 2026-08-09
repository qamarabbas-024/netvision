'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Terminal } from 'lucide-react';
import { LessonCommandItem } from '@/types/learning';
import { CommandCard } from '../blocks/CommandCard';

export interface CommandPanelProps {
  commands: LessonCommandItem[];
}

export const CommandPanel: React.FC<CommandPanelProps> = ({ commands }) => {
  if (!commands || commands.length === 0) return null;

  return (
    <Card className="p-6 glass-panel-glow border-[#00f0ff]/30 flex flex-col gap-5">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <Badge variant="cyan">COMMAND REFERENCE</Badge>
          <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
            <Terminal className="w-3.5 h-3.5 text-[#00f0ff]" /> CLI Terminal Diagnostic Commands
          </span>
        </div>
        <span className="text-xs font-mono text-zinc-500">{commands.length} Commands Available</span>
      </div>

      <div className="flex flex-col gap-4">
        {commands.map((c, idx) => (
          <CommandCard
            key={c.id || idx}
            command={{
              command: c.command,
              operatingSystem: 'ALL',
              category: c.category || 'Diagnostic',
              purpose: c.description || 'Terminal diagnostic command for network verification.',
              syntax: c.command,
              example: c.command,
              expectedOutput: c.exampleOutput || null,
              explanation: c.description || 'Executes packet telemetry check.',
            }}
            compact={false}
          />
        ))}
      </div>
    </Card>
  );
};

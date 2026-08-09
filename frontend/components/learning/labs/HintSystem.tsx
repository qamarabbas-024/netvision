'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Lightbulb, Unlock } from 'lucide-react';

export interface HintSystemProps {
  hints: string[];
  onUnlockHint?: (count: number) => void;
}

export const HintSystem: React.FC<HintSystemProps> = ({ hints, onUnlockHint }) => {
  const [unlockedCount, setUnlockedCount] = useState<number>(0);

  if (!hints || hints.length === 0) return null;

  const handleUnlock = () => {
    if (unlockedCount < hints.length) {
      const next = unlockedCount + 1;
      setUnlockedCount(next);
      if (onUnlockHint) onUnlockHint(next);
    }
  };

  return (
    <Card className="p-5 glass-panel-glow border-amber-500/30 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="amber">HINT SYSTEM</Badge>
          <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Progressive Lab Guidance
          </span>
        </div>

        {unlockedCount < hints.length && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUnlock}
            className="text-amber-300 border-amber-500/30 hover:bg-amber-500/10 text-xs font-mono"
            leftIcon={<Unlock className="w-3.5 h-3.5 text-amber-400" />}
          >
            Unlock Hint ({unlockedCount}/{hints.length})
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2.5">
        {hints.slice(0, unlockedCount).map((hintText, idx) => (
          <div key={idx} className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 leading-relaxed flex items-start gap-2.5">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 block font-mono text-[11px]">Hint #{idx + 1}:</strong>
              <span>{hintText}</span>
            </div>
          </div>
        ))}

        {unlockedCount === 0 && (
          <p className="text-xs text-zinc-500 italic">
            Stuck? Click "Unlock Hint" above to reveal step-by-step diagnostic hints (-5 pts penalty per hint).
          </p>
        )}
      </div>
    </Card>
  );
};

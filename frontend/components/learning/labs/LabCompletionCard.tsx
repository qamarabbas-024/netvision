'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Award, ArrowRight, RotateCcw } from 'lucide-react';

export interface LabCompletionCardProps {
  title: string;
  score: number;
  hintsUsedCount: number;
  onRetry?: () => void;
  onContinue?: () => void;
}

export const LabCompletionCard: React.FC<LabCompletionCardProps> = ({
  title,
  score,
  hintsUsedCount,
  onRetry,
  onContinue,
}) => {
  return (
    <Card className="p-8 glass-panel-glow border-emerald-500/30 flex flex-col gap-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-glow-emerald">
        <Award className="w-8 h-8" />
      </div>

      <div>
        <Badge variant="emerald">PRACTICAL LAB COMPLETED</Badge>
        <h3 className="text-2xl font-extrabold text-white mt-2">{title}</h3>
        <p className="text-xs text-zinc-400 mt-1">
          Target network state criteria satisfied. Final diagnostic score: <strong className="text-emerald-400">{score}%</strong> ({hintsUsedCount} hints used).
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-[#272732]">
        {onRetry && (
          <Button variant="secondary" onClick={onRetry} leftIcon={<RotateCcw className="w-4 h-4" />}>
            Replay Lab
          </Button>
        )}
        {onContinue && (
          <Button variant="cyan" size="lg" onClick={onContinue} rightIcon={<ArrowRight className="w-4 h-4" />}>
            Continue Learning
          </Button>
        )}
      </div>
    </Card>
  );
};

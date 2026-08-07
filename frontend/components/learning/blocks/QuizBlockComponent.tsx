'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CheckCircle2 } from 'lucide-react';
import { QuizBlock } from '@/types/learning';

export const QuizBlockComponent: React.FC<{ block: QuizBlock }> = ({ block }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  return (
    <Card className="p-8 glass-panel-glow border-[#00f0ff]/30 flex flex-col gap-6">
      <Badge variant="cyan">MASTERY CHECK QUIZ</Badge>

      <h2 className="text-xl font-bold text-white leading-snug">{block.question}</h2>

      <div className="flex flex-col gap-3">
        {block.options.map((opt, idx) => {
          const isSelected = selectedIdx === idx;
          const isCorrect = idx === block.correctOptionIndex;
          let styleClass = 'bg-[#181820] border-[#272732] text-zinc-300 hover:border-zinc-500';

          if (submitted) {
            if (isCorrect) styleClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
            else if (isSelected && !isCorrect) styleClass = 'bg-rose-500/20 border-rose-500 text-rose-300';
          } else if (isSelected) {
            styleClass = 'bg-[#00f0ff]/10 border-[#00f0ff] text-[#00f0ff] font-bold shadow-glow-cyan';
          }

          return (
            <button
              key={idx}
              onClick={() => !submitted && setSelectedIdx(idx)}
              className={`p-4 rounded-xl border text-left text-sm font-mono transition-all ${styleClass}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <div className="flex justify-end">
          <Button variant="cyan" disabled={selectedIdx === null} onClick={() => setSubmitted(true)}>
            Submit Answer
          </Button>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-[#121217] border border-emerald-500/30 text-xs text-zinc-300">
          <span className="text-emerald-400 font-bold flex items-center gap-1 mb-1">
            <CheckCircle2 className="w-4 h-4" /> Explanation:
          </span>
          <p className="leading-relaxed">{block.explanation}</p>
        </div>
      )}
    </Card>
  );
};

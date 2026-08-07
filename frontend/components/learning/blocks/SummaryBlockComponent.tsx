import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Award, ArrowRight } from 'lucide-react';
import { SummaryBlock } from '@/types/learning';

export const SummaryBlockComponent: React.FC<{ block: SummaryBlock }> = ({ block }) => {
  return (
    <Card className="p-8 glass-panel-glow border-[#00f0ff]/40 text-center flex flex-col items-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#00f0ff] to-[#3b82f6] flex items-center justify-center text-black shadow-glow-cyan mb-4">
        <Award className="w-8 h-8" />
      </div>

      <h2 className="text-2xl font-extrabold text-white mb-2">Lesson Completed! 🎉</h2>
      <p className="text-xs text-zinc-400 max-w-sm mb-6">
        Great work! You have completed all interactive blocks for this lesson.
      </p>

      <div className="p-4 rounded-xl bg-[#121217] border border-[#272732] font-mono text-xs mb-6">
        <span className="text-zinc-500 block text-[10px]">XP EARNED</span>
        <span className="text-lg font-bold text-[#00f0ff]">+{block.xpReward} XP</span>
      </div>

      {block.nextLessonSlug ? (
        <Link href={`/courses/tcp-ip-protocol-suite/lessons/${block.nextLessonSlug}`}>
          <Button variant="cyan" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
            Advance to Next Lesson
          </Button>
        </Link>
      ) : null}
    </Card>
  );
};

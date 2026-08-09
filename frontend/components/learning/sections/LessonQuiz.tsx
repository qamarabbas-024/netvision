'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Quiz } from '../Quiz';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface LessonQuizProps {
  quiz?: {
    id: string;
    title: string;
    passingScore?: number;
    questions: Array<{
      id: string;
      questionText: string;
      options: string[];
    }>;
  } | null;
  onComplete?: (score: number, passed: boolean) => void;
  onContinue?: () => void;
}

export const LessonQuiz: React.FC<LessonQuizProps> = ({ quiz, onComplete, onContinue }) => {
  if (!quiz) {
    return (
      <Card className="p-8 text-center space-y-4 glass-panel border-[#272732]">
        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
        <h3 className="text-xl font-bold text-white">No Quiz Required</h3>
        <p className="text-xs text-zinc-400">You can proceed directly to lesson completion summary.</p>
        {onContinue && (
          <Button variant="cyan" onClick={onContinue}>
            Proceed to Summary
          </Button>
        )}
      </Card>
    );
  }

  return (
    <Quiz
      quiz={quiz}
      onComplete={onComplete}
      onContinueLesson={onContinue}
    />
  );
};

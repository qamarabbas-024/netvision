import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Award, RotateCcw, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

export interface QuizResultProps {
  quizTitle: string;
  score: number;
  passed: boolean;
  passingScore: number;
  correctCount: number;
  totalQuestions: number;
  results: Array<{
    questionId: string;
    questionText: string;
    selectedOption: number;
    correctOption: number;
    isCorrect: boolean;
    explanation?: string;
  }>;
  onRetry: () => void;
  onContinue?: () => void;
}

export const QuizResult: React.FC<QuizResultProps> = ({
  quizTitle,
  score,
  passed,
  passingScore,
  correctCount,
  totalQuestions,
  results,
  onRetry,
  onContinue,
}) => {
  return (
    <Card className="p-8 glass-panel-glow border-[#00f0ff]/30 flex flex-col gap-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-5 text-center md:text-left">
          <div
            className={`w-16 h-16 rounded-3xl flex items-center justify-center shrink-0 ${
              passed
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-glow-emerald'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-glow-rose'
            }`}
          >
            <Award className="w-8 h-8" />
          </div>

          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <Badge variant={passed ? 'emerald' : 'rose'}>
                {passed ? 'Passed Assessment' : 'Needs Review'}
              </Badge>
              <span className="text-xs font-mono text-zinc-500">
                Passing Threshold: {passingScore}%
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">{quizTitle} Results</h2>
            <p className="text-xs text-zinc-400 mt-1">
              You answered {correctCount} out of {totalQuestions} questions correctly.
            </p>
          </div>
        </div>

        <div className="text-center md:text-right">
          <span className="text-4xl font-extrabold text-white tracking-tight font-mono">
            {score}%
          </span>
          <span className="text-xs text-zinc-400 block mt-1 font-mono">Final Score</span>
        </div>
      </div>

      {/* Itemized Questions Breakdown */}
      <div className="flex flex-col gap-4">
        <h3 className="text-base font-bold text-white tracking-tight">Question Item Breakdown</h3>

        {results.map((res, idx) => (
          <div
            key={res.questionId || idx}
            className={`p-5 rounded-2xl border flex flex-col gap-2 ${
              res.isCorrect
                ? 'bg-emerald-500/5 border-emerald-500/20'
                : 'bg-rose-500/5 border-rose-500/20'
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {res.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
                <h4 className="text-sm font-semibold text-white">
                  {idx + 1}. {res.questionText}
                </h4>
              </div>
              <Badge variant={res.isCorrect ? 'emerald' : 'rose'}>
                {res.isCorrect ? 'Correct' : 'Incorrect'}
              </Badge>
            </div>

            {res.explanation && (
              <p className="text-xs text-zinc-300 ml-8 bg-black/20 p-3 rounded-xl border border-white/5">
                <strong className="text-[#00f0ff]">Explanation:</strong> {res.explanation}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#272732]">
        <Button variant="secondary" onClick={onRetry} leftIcon={<RotateCcw className="w-4 h-4" />}>
          Retry Assessment
        </Button>

        {onContinue && (
          <Button variant="cyan" size="lg" onClick={onContinue} rightIcon={<ArrowRight className="w-4 h-4" />}>
            Continue to Next Lesson
          </Button>
        )}
      </div>
    </Card>
  );
};

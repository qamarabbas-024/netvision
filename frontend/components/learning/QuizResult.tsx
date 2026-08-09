'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Award, RotateCcw, ArrowRight, CheckCircle2, XCircle, AlertTriangle, BookOpen, Target } from 'lucide-react';

export interface QuizResultProps {
  quizTitle: string;
  score: number;
  passed: boolean;
  passingScore: number;
  correctCount: number;
  totalQuestions: number;
  weakConcepts?: string[];
  recommendations?: string[];
  results: Array<{
    questionId: string;
    questionText: string;
    selectedOption: number;
    correctOption: number;
    isCorrect: boolean;
    explanation?: string;
    whyCorrect?: string;
    whyWrong?: string;
    concept?: string;
    cognitiveLevel?: string;
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
  weakConcepts = [],
  recommendations = [],
  results,
  onRetry,
  onContinue,
}) => {
  return (
    <Card className="p-6 sm:p-8 glass-panel-glow border-[#00f0ff]/30 flex flex-col gap-8">
      {/* Header Result Banner */}
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
                {passed ? 'Mastery Achieved' : 'Concept Review Recommended'}
              </Badge>
              <span className="text-xs font-mono text-zinc-500">
                Passing Threshold: {passingScore}%
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">{quizTitle} Evaluation</h2>
            <p className="text-xs text-zinc-400 mt-1">
              You answered {correctCount} out of {totalQuestions} questions correctly.
            </p>
          </div>
        </div>

        <div className="text-center md:text-right">
          <span className="text-4xl font-extrabold text-white tracking-tight font-mono">
            {score}%
          </span>
          <span className="text-xs text-zinc-400 block mt-1 font-mono">Mastery Score</span>
        </div>
      </div>

      {/* Weak Concepts Diagnostic Review Box */}
      {weakConcepts.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            Identified Concepts Requiring Review:
          </div>

          <div className="flex flex-wrap gap-2">
            {weakConcepts.map((concept, idx) => (
              <span key={idx} className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-200 border border-amber-500/40 text-xs font-mono font-bold flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-amber-400" /> {concept}
              </span>
            ))}
          </div>

          {recommendations.length > 0 && (
            <div className="mt-1 space-y-1">
              {recommendations.map((rec, idx) => (
                <p key={idx} className="text-xs text-amber-200 leading-relaxed flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" /> {rec}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Itemized Questions Breakdown */}
      <div className="flex flex-col gap-4">
        <h3 className="text-base font-bold text-white tracking-tight">Question Diagnostic Breakdown</h3>

        {results.map((res, idx) => (
          <div
            key={res.questionId || idx}
            className={`p-5 rounded-2xl border flex flex-col gap-3 ${
              res.isCorrect
                ? 'bg-emerald-500/5 border-emerald-500/20'
                : 'bg-rose-500/5 border-rose-500/20'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
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
              <div className="flex items-center gap-2">
                {res.concept && (
                  <span className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                    {res.concept}
                  </span>
                )}
                <Badge variant={res.isCorrect ? 'emerald' : 'rose'}>
                  {res.isCorrect ? 'Correct' : 'Incorrect'}
                </Badge>
              </div>
            </div>

            {res.explanation && (
              <div className="p-3.5 rounded-xl bg-[#09090b] border border-white/10 text-xs text-zinc-300 space-y-1 ml-8">
                <span className="font-bold text-[#00f0ff] uppercase tracking-wider block">
                  Explanation & Rationales:
                </span>
                <p className="leading-relaxed">{res.explanation}</p>
              </div>
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

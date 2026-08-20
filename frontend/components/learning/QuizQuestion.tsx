'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { CheckCircle2, XCircle, Brain, Target } from 'lucide-react';

export interface QuizQuestionProps {
  questionNumber: number;
  totalQuestions: number;
  question: {
    id: string;
    questionText: string;
    options: string[];
    cognitiveLevel?: string;
    questionType?: string;
    concept?: string;
    difficulty?: string;
    points?: number;
  };
  selectedOption: number | null;
  onSelectOption: (optionIndex: number) => void;
  resultFeedback?: {
    isCorrect: boolean;
    correctOption: number;
    explanation?: string;
    whyCorrect?: string;
    whyWrong?: string;
  };
  isSubmitting?: boolean;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  questionNumber,
  totalQuestions,
  question,
  selectedOption,
  onSelectOption,
  resultFeedback,
  isSubmitting = false,
}) => {
  const getCognitiveBadge = (level?: string) => {
    switch (level?.toUpperCase()) {
      case 'RECALL':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">L1: RECALL</span>;
      case 'APPLICATION':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">L3: APPLICATION</span>;
      case 'TROUBLESHOOTING':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">L4: TROUBLESHOOTING</span>;
      case 'EXPERT_REASONING':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">L5: EXPERT REASONING</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">L2: UNDERSTANDING</span>;
    }
  };

  return (
    <Card className="p-6 sm:p-8 glass-panel-glow border-[#00f0ff]/30 flex flex-col gap-6">
      {/* Question Header Meta */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#272732] pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest font-semibold">
            Question {questionNumber} of {totalQuestions}
          </span>
          {getCognitiveBadge(question.cognitiveLevel)}
          {question.concept && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-zinc-400 bg-white/5 border border-white/10 flex items-center gap-1">
              <Target className="w-3 h-3 text-[#00f0ff]" /> {question.concept}
            </span>
          )}
        </div>

        {resultFeedback && (
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
              resultFeedback.isCorrect
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
            }`}
          >
            {resultFeedback.isCorrect ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> Correct (+{question.points || 10} pts)
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" /> Incorrect
              </>
            )}
          </span>
        )}
      </div>

      {/* Question Text */}
      <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
        {question.questionText}
      </h3>

      {/* Options List */}
      <div className="flex flex-col gap-3" role="radiogroup" aria-label={`Question ${questionNumber}: ${question.questionText}`}>
        {question.options.map((optionText, idx) => {
          const isSelected = selectedOption === idx;
          let optionStyle =
            'bg-[#181820]/70 border-[#272732] hover:border-[#00f0ff]/50 text-zinc-200';

          if (resultFeedback) {
            if (idx === resultFeedback.correctOption) {
              optionStyle =
                'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold shadow-glow-emerald';
            } else if (isSelected && !resultFeedback.isCorrect) {
              optionStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 font-semibold';
            } else {
              optionStyle = 'bg-[#181820]/40 border-zinc-800 text-zinc-500 opacity-60';
            }
          } else if (isSelected) {
            optionStyle =
              'bg-[#00f0ff]/15 border-[#00f0ff] text-white font-semibold shadow-glow-cyan';
          }

          return (
            <button
              key={idx}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`Option ${String.fromCharCode(65 + idx)}: ${optionText}`}
              disabled={!!resultFeedback || isSubmitting}
              onClick={() => onSelectOption(idx)}
              className={`w-full p-3.5 sm:p-4 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b] ${optionStyle}`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <span
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 ${
                    isSelected
                      ? 'bg-[#00f0ff] text-black'
                      : 'bg-white/5 border border-white/10 text-zinc-400'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-xs sm:text-sm leading-relaxed break-word-all">{optionText}</span>
              </div>

              {resultFeedback && idx === resultFeedback.correctOption && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" aria-label="Correct answer" />
              )}
              {resultFeedback && isSelected && !resultFeedback.isCorrect && (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0" aria-label="Incorrect answer" />
              )}
            </button>
          );
        })}
      </div>

      {/* Result Feedback & Explanations */}
      {resultFeedback?.explanation && (
        <div className="p-4 rounded-2xl bg-[#09090b] border border-[#272732] text-xs text-zinc-300 space-y-2">
          <span className="font-bold text-[#00f0ff] uppercase tracking-wider block flex items-center gap-1.5">
            <Brain className="w-4 h-4 text-[#00f0ff]" /> Concept Explanation & Analysis:
          </span>
          <p className="leading-relaxed">{resultFeedback.explanation}</p>
        </div>
      )}
    </Card>
  );
};

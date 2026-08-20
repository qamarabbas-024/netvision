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
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30">L1: RECALL</span>;
      case 'APPLICATION':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30">L3: APPLICATION</span>;
      case 'TROUBLESHOOTING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30">L4: TROUBLESHOOTING</span>;
      case 'EXPERT_REASONING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#818cf8]/10 text-[#818cf8] border border-[#818cf8]/30">L5: EXPERT REASONING</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30">L2: UNDERSTANDING</span>;
    }
  };

  return (
    <Card className="p-5 sm:p-6 surface-2 border border-[#2a2e39] rounded-xl flex flex-col gap-5 shadow-instrument">
      {/* Question Header Meta */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2a2e39] pb-3.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-[#38bdf8] uppercase tracking-wider font-semibold">
            Question {questionNumber} of {totalQuestions}
          </span>
          {getCognitiveBadge(question.cognitiveLevel)}
          {question.concept && (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-[#8e95a5] bg-[#14151a] border border-[#2a2e39] flex items-center gap-1">
              <Target className="w-3 h-3 text-[#38bdf8]" /> {question.concept}
            </span>
          )}
        </div>

        {resultFeedback && (
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded ${
              resultFeedback.isCorrect
                ? 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30'
                : 'bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/30'
            }`}
          >
            {resultFeedback.isCorrect ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+{question.points || 10} pts)
              </>
            ) : (
              <>
                <XCircle className="w-3.5 h-3.5" /> Incorrect
              </>
            )}
          </span>
        )}
      </div>

      {/* Question Text */}
      <h3 className="text-base sm:text-lg font-bold text-[#f4f5f7] leading-snug">
        {question.questionText}
      </h3>

      {/* Options List */}
      <div className="flex flex-col gap-2.5" role="radiogroup" aria-label={`Question ${questionNumber}: ${question.questionText}`}>
        {question.options.map((optionText, idx) => {
          const isSelected = selectedOption === idx;
          let optionStyle =
            'bg-[#14151a] border-[#2a2e39] hover:border-[#38bdf8]/40 text-[#c4c9d4]';

          if (resultFeedback) {
            if (idx === resultFeedback.correctOption) {
              optionStyle =
                'bg-[#10b981]/15 border-[#10b981] text-[#10b981] font-semibold';
            } else if (isSelected && !resultFeedback.isCorrect) {
              optionStyle = 'bg-[#ef4444]/15 border-[#ef4444] text-[#ef4444] font-semibold';
            } else {
              optionStyle = 'bg-[#14151a] border-[#2a2e39] text-[#646c7d] opacity-50';
            }
          } else if (isSelected) {
            optionStyle =
              'bg-[#1b1e26] border-[#38bdf8] text-[#f4f5f7] font-semibold shadow-inner';
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
              className={`w-full p-3 sm:p-3.5 rounded-lg border text-left transition-all flex items-start justify-between gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38bdf8] ${optionStyle}`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <span
                  className={`w-6 h-6 rounded flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 ${
                    isSelected
                      ? 'bg-[#2563eb] text-white'
                      : 'bg-[#1b1e26] border border-[#2a2e39] text-[#8e95a5]'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-xs sm:text-sm leading-relaxed break-word-all">{optionText}</span>
              </div>

              {resultFeedback && idx === resultFeedback.correctOption && (
                <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" aria-label="Correct answer" />
              )}
              {resultFeedback && isSelected && !resultFeedback.isCorrect && (
                <XCircle className="w-4 h-4 text-[#ef4444] shrink-0 mt-0.5" aria-label="Incorrect answer" />
              )}
            </button>
          );
        })}
      </div>

      {/* Result Feedback & Explanations */}
      {resultFeedback?.explanation && (
        <div className="p-3.5 rounded-lg bg-[#14151a] border border-[#2a2e39] text-xs text-[#8e95a5] space-y-1.5">
          <span className="font-bold text-[#38bdf8] uppercase tracking-wider block flex items-center gap-1.5 text-[11px] font-mono">
            <Brain className="w-3.5 h-3.5 text-[#38bdf8]" /> Concept Analysis:
          </span>
          <p className="leading-relaxed text-[#c4c9d4]">{resultFeedback.explanation}</p>
        </div>
      )}
    </Card>
  );
};

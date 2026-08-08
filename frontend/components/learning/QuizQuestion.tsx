import React from 'react';
import { Card } from '@/components/ui/Card';
import { CheckCircle2, XCircle } from 'lucide-react';

export interface QuizQuestionProps {
  questionNumber: number;
  totalQuestions: number;
  question: {
    id: string;
    questionText: string;
    options: string[];
  };
  selectedOption: number | null;
  onSelectOption: (optionIndex: number) => void;
  resultFeedback?: {
    isCorrect: boolean;
    correctOption: number;
    explanation?: string;
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
  return (
    <Card className="p-8 glass-panel-glow border-[#00f0ff]/30">
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest font-semibold">
          Question {questionNumber} of {totalQuestions}
        </span>
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
                <CheckCircle2 className="w-4 h-4" /> Correct (+100 XP)
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" /> Incorrect
              </>
            )}
          </span>
        )}
      </div>

      <h3 className="text-xl font-bold text-white leading-snug mb-8">
        {question.questionText}
      </h3>

      <div className="flex flex-col gap-4 mb-8">
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
              disabled={!!resultFeedback || isSubmitting}
              onClick={() => onSelectOption(idx)}
              className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-4 ${optionStyle}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                    isSelected
                      ? 'bg-[#00f0ff] text-black'
                      : 'bg-white/5 border border-white/10 text-zinc-400'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-sm leading-relaxed">{optionText}</span>
              </div>

              {resultFeedback && idx === resultFeedback.correctOption && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              )}
              {resultFeedback && isSelected && !resultFeedback.isCorrect && (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {resultFeedback?.explanation && (
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-zinc-300 space-y-1">
          <span className="font-bold text-[#00f0ff] uppercase tracking-wider block">
            Explanation:
          </span>
          <p>{resultFeedback.explanation}</p>
        </div>
      )}
    </Card>
  );
};

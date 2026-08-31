import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Award, RotateCcw, ArrowRight, CheckCircle2, XCircle, AlertTriangle, BookOpen, Target, Sparkles } from 'lucide-react';

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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Celebratory confetti burst when passed
  useEffect(() => {
    if (!passed || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 600;
    canvas.height = 250;

    const colors = ['#00f0ff', '#10b981', '#a855f7', '#f59e0b', '#3b82f6'];
    const particles = Array.from({ length: 60 }, () => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.8) * 10,
      size: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.2,
    }));

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach((p) => {
        if (p.alpha <= 0) return;
        alive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25; // gravity
        p.rotation += p.vRot;
        p.alpha -= 0.015;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      if (alive) {
        animId = requestAnimationFrame(render);
      }
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [passed]);

  return (
    <Card className="p-6 sm:p-8 surface-2 border border-[#2a2e39] rounded-xl flex flex-col gap-6 shadow-instrument relative overflow-hidden">
      {/* Particle Canvas Overlay */}
      {passed && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none z-20 w-full h-full"
        />
      )}
      {/* Header Result Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-5 sm:p-6 rounded-xl bg-[#14151a] border border-[#2a2e39]">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
              passed
                ? 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30'
                : 'bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/30'
            }`}
          >
            <Award className="w-7 h-7" />
          </div>

          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <Badge variant={passed ? 'emerald' : 'rose'} dot={true}>
                {passed ? 'Mastery Achieved' : 'Review Recommended'}
              </Badge>
              <span className="text-xs font-mono text-[#8e95a5]">
                Passing Threshold: {passingScore}%
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#f4f5f7]">{quizTitle} Evaluation</h2>
            <p className="text-xs text-[#8e95a5] mt-0.5">
              You answered {correctCount} out of {totalQuestions} questions correctly.
            </p>
          </div>
        </div>

        <div className="text-center md:text-right">
          <span className="text-3xl sm:text-4xl font-extrabold text-[#f4f5f7] tracking-tight font-mono">
            {score}%
          </span>
          <span className="text-xs text-[#8e95a5] block mt-0.5 font-mono">Mastery Score</span>
        </div>
      </div>

      {/* Weak Concepts Diagnostic Review Box */}
      {weakConcepts.length > 0 && (
        <div className="p-4 rounded-xl bg-[#f59e0b]/5 border border-[#f59e0b]/20 flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-[#f59e0b] font-bold text-xs font-mono">
            <AlertTriangle className="w-4 h-4 text-[#f59e0b] shrink-0" />
            Concepts Identified for Review:
          </div>

          <div className="flex flex-wrap gap-2">
            {weakConcepts.map((concept, idx) => (
              <span key={idx} className="px-2.5 py-0.5 rounded-md bg-[#14151a] text-[#f59e0b] border border-[#f59e0b]/30 text-xs font-mono font-bold flex items-center gap-1.5">
                <Target className="w-3 h-3 text-[#f59e0b]" /> {concept}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Question Review List */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-[#f4f5f7] uppercase tracking-wider font-mono">Question Diagnostic Breakdown</h3>
        {results?.map((res, idx) => (
          <div
            key={res.questionId || idx}
            className={`p-4 rounded-xl border flex flex-col gap-2.5 ${
              res.isCorrect
                ? 'bg-[#10b981]/5 border-[#10b981]/20'
                : 'bg-[#ef4444]/5 border-[#ef4444]/20'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="text-xs sm:text-sm font-semibold text-[#f4f5f7] leading-snug">
                {idx + 1}. {res.questionText}
              </span>
              <span
                className={`text-xs font-bold font-mono px-2 py-0.5 rounded shrink-0 ${
                  res.isCorrect
                    ? 'bg-[#10b981]/15 text-[#10b981]'
                    : 'bg-[#ef4444]/15 text-[#ef4444]'
                }`}
              >
                {res.isCorrect ? 'PASS' : 'FAIL'}
              </span>
            </div>

            {res.explanation && (
              <p className="text-xs text-[#8e95a5] leading-relaxed pt-2 border-t border-[#2a2e39]">
                <strong className="text-[#c4c9d4]">Explanation: </strong> {res.explanation}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#2a2e39]">
        <Button
          variant="secondary"
          size="md"
          onClick={onRetry}
          leftIcon={<RotateCcw className="w-4 h-4" />}
          className="w-full sm:w-auto text-xs font-semibold"
        >
          Retry Diagnostic Quiz
        </Button>

        {onContinue && (
          <Button
            variant="primary"
            size="md"
            onClick={onContinue}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto font-bold text-xs px-6 py-2.5 shadow-sm"
          >
            Continue Lesson →
          </Button>
        )}
      </div>
    </Card>
  );
};

import React, { useState } from 'react';
import { QuizQuestion } from './QuizQuestion';
import { QuizResult } from './QuizResult';
import { Button } from '@/components/ui/Button';
import { submitQuizApi } from '@/lib/api';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Alert } from '@/components/ui/Alert';

export interface QuizProps {
  quiz: {
    id: string;
    title: string;
    passingScore?: number;
    questions?: Array<{
      id: string;
      questionText: string;
      options: string[];
    }>;
  };
  onComplete?: (score: number, passed: boolean) => void;
  onContinueLesson?: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ quiz, onComplete, onContinueLesson }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<any | null>(null);

  const questions = quiz?.questions || [];

  if (questions.length === 0) {
    return (
      <EmptyState
        title="No Quiz Questions Available"
        description="Assessment questions for this lesson are being finalized by curriculum engineering."
        actionLabel={onContinueLesson ? "Continue Lesson" : undefined}
        onAction={onContinueLesson}
      />
    );
  }

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const currentSelection = currentQuestion ? (selectedAnswers[currentQuestion.id] ?? null) : null;
  const allAnswered = questions.every((q) => selectedAnswers[q.id] !== undefined);

  const handleSelectOption = (optionIndex: number) => {
    if (!currentQuestion) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);
    try {
      const res = await submitQuizApi(quiz.id, selectedAnswers);
      setQuizResult(res);
      if (onComplete) {
        onComplete(res.score, res.passed);
      }
    } catch (err: any) {
      console.error('Quiz submission error:', err);
      setSubmissionError(err?.message || 'Failed to submit quiz score to server. Please try submitting again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setSubmissionError(null);
    setQuizResult(null);
  };

  if (quizResult) {
    return (
      <QuizResult
        quizTitle={quiz.title}
        score={quizResult.score}
        passed={quizResult.passed}
        passingScore={quizResult.passingScore || quiz.passingScore || 80}
        correctCount={quizResult.correctCount}
        totalQuestions={quizResult.totalQuestions}
        weakConcepts={quizResult.weakConcepts}
        recommendations={quizResult.recommendations}
        results={quizResult.results}
        onRetry={handleRetry}
        onContinue={onContinueLesson}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Progress Dots */}
      <div className="flex items-center justify-between gap-4 p-4 glass-panel rounded-2xl border border-[#272732]">
        <span className="text-xs font-bold text-white font-mono">{quiz.title}</span>
        <div className="flex items-center gap-1.5">
          {questions.map((q, idx) => (
            <button
              key={q.id || idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentIndex === idx
                  ? 'bg-[#00f0ff] ring-4 ring-[#00f0ff]/20'
                  : selectedAnswers[q.id] !== undefined
                  ? 'bg-emerald-400'
                  : 'bg-zinc-700'
              }`}
              title={`Question ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {submissionError && (
        <Alert variant="error" title="Submission Error">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1">
            <p className="text-xs text-rose-200">{submissionError}</p>
            <Button variant="secondary" size="sm" onClick={handleSubmit} leftIcon={<RefreshCw className="w-3 h-3" />}>
              Retry Submit
            </Button>
          </div>
        </Alert>
      )}

      {/* Active Question */}
      {currentQuestion && (
        <QuizQuestion
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          question={currentQuestion}
          selectedOption={currentSelection}
          onSelectOption={handleSelectOption}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Footer Controls */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          onClick={handlePrev}
          disabled={currentIndex === 0 || isSubmitting}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Previous
        </Button>

        {isLastQuestion ? (
          <Button
            variant="cyan"
            size="lg"
            onClick={handleSubmit}
            disabled={!allAnswered || isSubmitting}
            rightIcon={
              isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )
            }
          >
            {isSubmitting ? 'Evaluating Server Score...' : 'Submit Assessment'}
          </Button>
        ) : (
          <Button
            variant="cyan"
            onClick={handleNext}
            disabled={currentSelection === null || isSubmitting}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Next Question
          </Button>
        )}
      </div>
    </div>
  );
};

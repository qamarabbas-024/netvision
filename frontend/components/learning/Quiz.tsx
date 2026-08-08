import React, { useState } from 'react';
import { QuizQuestion } from './QuizQuestion';
import { QuizResult } from './QuizResult';
import { Button } from '@/components/ui/Button';
import { submitQuizApi } from '@/lib/api';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

export interface QuizProps {
  quiz: {
    id: string;
    title: string;
    passingScore?: number;
    questions: Array<{
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
  const [quizResult, setQuizResult] = useState<any | null>(null);

  const currentQuestion = quiz.questions[currentIndex];
  const isLastQuestion = currentIndex === quiz.questions.length - 1;
  const currentSelection = selectedAnswers[currentQuestion?.id] ?? null;
  const allAnswered = quiz.questions.every((q) => selectedAnswers[q.id] !== undefined);

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) setCurrentIndex((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await submitQuizApi(quiz.id, selectedAnswers);
      setQuizResult(res);
      if (onComplete) {
        onComplete(res.score, res.passed);
      }
    } catch (err) {
      console.error('Quiz submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
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
          {quiz.questions.map((q, idx) => (
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

      {/* Active Question */}
      {currentQuestion && (
        <QuizQuestion
          questionNumber={currentIndex + 1}
          totalQuestions={quiz.questions.length}
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

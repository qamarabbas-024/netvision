import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PlayCircle, CheckCircle2, Clock, HelpCircle } from 'lucide-react';

export interface LessonCardProps {
  courseSlug: string;
  lesson: {
    id: string;
    title: string;
    slug: string;
    type: string;
    durationMinutes: number;
    completed?: boolean;
    active?: boolean;
    score?: number | null;
    hasQuiz?: boolean;
  };
}

export const LessonCard: React.FC<LessonCardProps> = ({ courseSlug, lesson }) => {
  const isQuiz = lesson.type === 'QUIZ' || lesson.hasQuiz;

  return (
    <div
      className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
        lesson.active
          ? 'bg-[#00f0ff]/10 border-[#00f0ff]/40 shadow-glow-cyan'
          : lesson.completed
          ? 'bg-emerald-500/5 border-emerald-500/20'
          : 'bg-[#181820]/60 border-[#272732] hover:border-zinc-700'
      }`}
    >
      <div className="flex items-center gap-3">
        {lesson.completed ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        ) : lesson.active ? (
          <PlayCircle className="w-5 h-5 text-[#00f0ff] shrink-0 animate-pulse" />
        ) : isQuiz ? (
          <HelpCircle className="w-5 h-5 text-amber-400 shrink-0" />
        ) : (
          <Clock className="w-5 h-5 text-zinc-500 shrink-0" />
        )}

        <div>
          <h4 className="text-sm font-semibold text-white group-hover:text-[#00f0ff] transition-colors">
            {lesson.title}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={isQuiz ? 'amber' : 'cyan'}>{lesson.type}</Badge>
            <span className="text-[11px] font-mono text-zinc-500">
              {lesson.durationMinutes} min
            </span>
            {lesson.score !== undefined && lesson.score !== null && (
              <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                Score: {lesson.score}%
              </span>
            )}
          </div>
        </div>
      </div>

      <Link href={`/courses/${courseSlug}/lessons/${lesson.slug}`}>
        <Button variant={lesson.active ? 'cyan' : lesson.completed ? 'secondary' : 'ghost'} size="sm">
          {lesson.completed ? 'Review Lesson' : lesson.active ? 'Continue' : 'Start Lesson'}
        </Button>
      </Link>
    </div>
  );
};

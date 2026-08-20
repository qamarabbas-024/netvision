'use client';

import React from 'react';
import Link from 'next/link';
import { DifficultyBadge } from './DifficultyBadge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import {
  Layers,
  Router,
  SwitchCamera,
  ShieldCheck,
  Clock,
  BookOpen,
  CheckCircle2,
  Bookmark,
  ArrowRight,
  Lock,
  Box,
  HelpCircle,
} from 'lucide-react';

export interface CourseCardProps {
  course: {
    id: string;
    slug: string;
    code?: string;
    title: string;
    tagline: string;
    category: string;
    description?: string;
    level: 'FOUNDATIONAL' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | string;
    icon?: string;
    estimatedHours: number;
    lessonsCount: number;
    labsCount?: number;
    completedLessons?: number;
    progressPercent?: number;
    prerequisites?: string[];
    isLocked?: boolean;
  };
  isBookmarked?: boolean;
  onToggleBookmark?: (id: string, e: React.MouseEvent) => void;
  onSelectCourse?: () => void;
  compact?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isBookmarked = false,
  onToggleBookmark,
  onSelectCourse,
  compact = false,
}) => {
  const renderIcon = (name?: string) => {
    switch (name) {
      case 'Router':
      case 'DNSIcon':
      case 'Binary':
        return <Router className="w-5 h-5 text-[#38bdf8]" />;
      case 'Switch':
      case 'Cpu':
        return <SwitchCamera className="w-5 h-5 text-[#818cf8]" />;
      case 'ShieldCheck':
      case 'Shield':
        return <ShieldCheck className="w-5 h-5 text-[#ef4444]" />;
      default:
        return <Layers className="w-5 h-5 text-[#38bdf8]" />;
    }
  };

  const progressPercent = course.progressPercent ?? 0;
  const completedLessons = course.completedLessons ?? 0;
  const totalLessons = course.lessonsCount || 1;
  const isCompleted = progressPercent === 100 || completedLessons >= totalLessons;
  const isStarted = progressPercent > 0 && !isCompleted;
  const isLocked = course.isLocked ?? false;

  // Determine CTA label & variant
  let ctaText = 'Start Course';
  let ctaVariant: 'primary' | 'secondary' | 'ghost' | 'outline' = 'primary';
  let ctaIcon = <ArrowRight className="w-3.5 h-3.5" />;

  if (isLocked) {
    ctaText = 'Requirements';
    ctaVariant = 'ghost';
    ctaIcon = <Lock className="w-3.5 h-3.5 text-[#646c7d]" />;
  } else if (isCompleted) {
    ctaText = 'Review Course';
    ctaVariant = 'secondary';
    ctaIcon = <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />;
  } else if (isStarted) {
    ctaText = 'Continue';
    ctaVariant = 'primary';
    ctaIcon = <ArrowRight className="w-3.5 h-3.5" />;
  }

  return (
    <div className="surface-2 p-5 sm:p-6 rounded-xl border border-[#2a2e39] hover:border-[#38bdf8]/40 hover:bg-[#1f222c] transition-all flex flex-col justify-between h-full group relative shadow-instrument font-sans">
      <div>
        {/* Header Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-2">
            {course.code && (
              <span className="px-2 py-0.5 rounded-md bg-[#14151a] border border-[#2a2e39] text-[10px] font-mono font-bold text-[#38bdf8]">
                {course.code}
              </span>
            )}
            <DifficultyBadge level={course.level} />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isCompleted ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded-md border border-[#10b981]/30">
                <CheckCircle2 className="w-3 h-3" />
                PASSED
              </span>
            ) : isStarted ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#38bdf8] bg-[#38bdf8]/10 px-2 py-0.5 rounded-md border border-[#38bdf8]/30">
                IN PROGRESS
              </span>
            ) : isLocked ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#646c7d] bg-[#14151a] px-2 py-0.5 rounded-md border border-[#2a2e39]">
                <Lock className="w-3 h-3" />
                LOCKED
              </span>
            ) : null}

            {onToggleBookmark && (
              <button
                type="button"
                onClick={(e) => onToggleBookmark(course.id, e)}
                className="text-[#646c7d] hover:text-[#38bdf8] transition-colors p-1"
                title="Bookmark Course"
                aria-label={`Bookmark course ${course.title}`}
              >
                <Bookmark
                  className={`w-4 h-4 ${isBookmarked ? 'text-[#38bdf8] fill-[#38bdf8]' : ''}`}
                />
              </button>
            )}
          </div>
        </div>

        {/* Title & Icon */}
        <div className="flex items-start gap-3 mb-2.5 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-[#14151a] border border-[#2a2e39] flex items-center justify-center shrink-0">
            {renderIcon(course.icon)}
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-mono text-[#8e95a5] block uppercase tracking-wider truncate mb-0.5">
              {course.category}
            </span>
            <h3 className="text-base font-bold text-[#f4f5f7] group-hover:text-[#38bdf8] transition-colors leading-snug">
              {course.title}
            </h3>
          </div>
        </div>

        {/* Tagline / "Why It Matters" */}
        <p className="text-xs text-[#8e95a5] line-clamp-2 mb-3.5 leading-relaxed">
          {course.tagline}
        </p>

        {/* Prerequisites notice if present */}
        {course.prerequisites && course.prerequisites.length > 0 && (
          <div className="mb-3.5 px-2.5 py-1.5 rounded-md bg-[#14151a] border border-[#2a2e39] text-[10px] text-[#8e95a5] flex items-center gap-2">
            <span className="font-mono text-[#646c7d] font-bold">PREREQ:</span>
            <span className="text-[#c4c9d4] font-medium truncate">
              {course.prerequisites.join(', ')}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Metrics & Primary CTA */}
      <div className="pt-3.5 border-t border-[#2a2e39] flex flex-col gap-3">
        {/* Course-Scoped Progress Bar if started */}
        {isStarted && (
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-[#646c7d]">COMPLETION</span>
              <span className="text-[#38bdf8] font-bold">
                {completedLessons}/{totalLessons} ({progressPercent}%)
              </span>
            </div>
            <Progress value={progressPercent} />
          </div>
        )}

        {/* Metadata Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#8e95a5] font-mono">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#646c7d]" />
            {course.estimatedHours}h Total
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-[#646c7d]" />
            {totalLessons} Lessons
          </span>
          {course.labsCount !== undefined && course.labsCount > 0 && (
            <span className="flex items-center gap-1 text-[#38bdf8]">
              <Box className="w-3 h-3" />
              {course.labsCount} Labs
            </span>
          )}
          <span className="flex items-center gap-1 text-[#f59e0b]">
            <HelpCircle className="w-3 h-3" />
            Quiz
          </span>
        </div>

        {/* Primary CTA */}
        <Link
          href={`/courses/${course.slug}`}
          onClick={onSelectCourse}
          className="w-full"
        >
          <Button
            variant={ctaVariant}
            size="sm"
            className="w-full justify-center text-xs font-bold"
            rightIcon={ctaIcon}
          >
            {ctaText}
          </Button>
        </Link>
      </div>
    </div>
  );
};

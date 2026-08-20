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
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isBookmarked = false,
  onToggleBookmark,
  onSelectCourse,
}) => {
  const renderIcon = (name?: string) => {
    switch (name) {
      case 'Router':
      case 'DNSIcon':
      case 'Binary':
        return <Router className="w-6 h-6 text-[#00f0ff]" />;
      case 'Switch':
      case 'Cpu':
        return <SwitchCamera className="w-6 h-6 text-purple-400" />;
      case 'ShieldCheck':
      case 'Shield':
        return <ShieldCheck className="w-6 h-6 text-rose-400" />;
      default:
        return <Layers className="w-6 h-6 text-[#00f0ff]" />;
    }
  };

  const progressPercent = course.progressPercent ?? 0;
  const completedLessons = course.completedLessons ?? 0;
  const totalLessons = course.lessonsCount || 1;
  const isCompleted = progressPercent === 100 || completedLessons >= totalLessons;
  const isStarted = progressPercent > 0 && !isCompleted;
  const isLocked = course.isLocked ?? false;

  // Determine CTA label & variant
  let ctaText = 'Start Learning →';
  let ctaVariant: 'cyan' | 'secondary' | 'ghost' | 'outline' = 'cyan';
  let ctaIcon = <ArrowRight className="w-4 h-4" />;

  if (isLocked) {
    ctaText = 'View Requirements →';
    ctaVariant = 'ghost';
    ctaIcon = <Lock className="w-4 h-4 text-zinc-500" />;
  } else if (isCompleted) {
    ctaText = 'Review Course';
    ctaVariant = 'secondary';
    ctaIcon = <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
  } else if (isStarted) {
    ctaText = 'Continue Learning →';
    ctaVariant = 'cyan';
    ctaIcon = <ArrowRight className="w-4 h-4" />;
  }

  return (
    <div className="bg-[#15181e] p-5 sm:p-6 rounded-xl border border-[#232732] hover:border-[#00c8f8]/50 hover:bg-[#181c23] transition-all duration-150 flex flex-col justify-between h-full group relative overflow-hidden">
      <div>
        {/* Header Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            {course.code && (
              <span className="px-2 py-0.5 rounded bg-[#111317] border border-[#232732] text-[10px] font-mono font-bold text-[#00c8f8]">
                {course.code}
              </span>
            )}
            <DifficultyBadge level={course.level} />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isCompleted ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" />
                COMPLETED
              </span>
            ) : isStarted ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-[#00c8f8] bg-[#00c8f8]/10 px-2 py-0.5 rounded border border-[#00c8f8]/20">
                IN PROGRESS
              </span>
            ) : isLocked ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-zinc-500 bg-[#111317] px-2 py-0.5 rounded border border-[#232732]">
                <Lock className="w-3 h-3" />
                LOCKED
              </span>
            ) : null}

            {onToggleBookmark && (
              <button
                type="button"
                onClick={(e) => onToggleBookmark(course.id, e)}
                className="text-zinc-500 hover:text-[#00c8f8] transition-colors p-1"
                title="Bookmark Course"
                aria-label={`Bookmark course ${course.title}`}
              >
                <Bookmark
                  className={`w-4 h-4 ${isBookmarked ? 'text-[#00c8f8] fill-[#00c8f8]' : ''}`}
                />
              </button>
            )}
          </div>
        </div>

        {/* Title & Icon */}
        <div className="flex items-start gap-3.5 mb-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#111317] border border-[#232732] flex items-center justify-center shrink-0 text-[#00c8f8]">
            {renderIcon(course.icon)}
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-mono text-[#64748b] block uppercase tracking-wider truncate mb-0.5">
              {course.category}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#f3f4f6] group-hover:text-[#00c8f8] transition-colors leading-snug font-sans">
              {course.title}
            </h3>
          </div>
        </div>

        {/* Tagline / "Why It Matters" */}
        <p className="text-xs text-[#94a3b8] line-clamp-2 mb-4 leading-relaxed font-sans">
          {course.tagline}
        </p>

        {/* Prerequisites notice if present */}
        {course.prerequisites && course.prerequisites.length > 0 && (
          <div className="mb-4 px-2.5 py-1.5 rounded-lg bg-[#111317] border border-[#232732] text-[11px] text-[#94a3b8] flex items-center gap-2">
            <span className="font-mono text-[#64748b]">PREREQ:</span>
            <span className="text-zinc-300 font-medium truncate">
              {course.prerequisites.join(', ')}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Metrics & Primary CTA */}
      <div className="pt-4 border-t border-[#232732] flex flex-col gap-3.5">
        {/* Course-Scoped Progress Bar if started */}
        {isStarted && (
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-[#64748b]">PROGRESS</span>
              <span className="text-[#00c8f8] font-bold">
                {completedLessons}/{totalLessons} ({progressPercent}%)
              </span>
            </div>
            <Progress value={progressPercent} />
          </div>
        )}

        {/* Metadata Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#94a3b8] font-mono">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#64748b]" />
            {course.estimatedHours}h Total
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#64748b]" />
            {totalLessons} Lessons
          </span>
          {course.labsCount !== undefined && course.labsCount > 0 && (
            <span className="flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-[#00c8f8]" />
              {course.labsCount} Labs
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
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
            size="md"
            className={`w-full justify-center rounded-lg font-semibold text-xs ${
              ctaVariant === 'cyan'
                ? 'bg-[#00c8f8] text-[#0f1115] hover:bg-[#38bdf8] font-bold'
                : 'bg-[#111317] border-[#232732] text-zinc-300 hover:text-white'
            }`}
            rightIcon={ctaIcon}
          >
            {ctaText}
          </Button>
        </Link>
      </div>
    </div>
  );
};

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
    <div className="glass-panel p-6 rounded-3xl border border-[#272732] hover:border-[#00f0ff]/40 hover:shadow-glow-cyan transition-all duration-200 flex flex-col justify-between h-full group relative overflow-hidden">
      <div>
        {/* Header Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            {course.code && (
              <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono font-bold text-zinc-400">
                {course.code}
              </span>
            )}
            <DifficultyBadge level={course.level} />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isCompleted ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" />
                Completed
              </span>
            ) : isStarted ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00f0ff] bg-[#00f0ff]/10 px-2.5 py-0.5 rounded-full border border-[#00f0ff]/20">
                In Progress
              </span>
            ) : isLocked ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-500 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                <Lock className="w-3 h-3" />
                Locked
              </span>
            ) : null}

            {onToggleBookmark && (
              <button
                onClick={(e) => onToggleBookmark(course.id, e)}
                className="text-zinc-500 hover:text-[#00f0ff] transition-colors p-1"
                title="Bookmark Course"
              >
                <Bookmark
                  className={`w-4 h-4 ${isBookmarked ? 'text-[#00f0ff] fill-[#00f0ff]' : ''}`}
                />
              </button>
            )}
          </div>
        </div>

        {/* Title & Icon */}
        <div className="flex items-start gap-3.5 mb-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            {renderIcon(course.icon)}
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-mono text-zinc-500 block uppercase tracking-wider truncate">
              {course.category}
            </span>
            <h3 className="text-lg font-bold text-white group-hover:text-[#00f0ff] transition-colors leading-tight">
              {course.title}
            </h3>
          </div>
        </div>

        {/* Tagline / "Why It Matters" */}
        <p className="text-xs text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
          {course.tagline}
        </p>

        {/* Prerequisites notice if present */}
        {course.prerequisites && course.prerequisites.length > 0 && (
          <div className="mb-4 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-zinc-400 flex items-center gap-2">
            <span className="font-mono text-zinc-500">Prereq:</span>
            <span className="text-zinc-300 font-semibold truncate">
              {course.prerequisites.join(', ')}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Metrics & Primary CTA */}
      <div className="pt-4 border-t border-[#272732]/60 flex flex-col gap-4">
        {/* Course-Scoped Progress Bar if started */}
        {isStarted && (
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-zinc-400">Course Progress</span>
              <span className="text-[#00f0ff] font-bold">
                {completedLessons} / {totalLessons} lessons ({progressPercent}%)
              </span>
            </div>
            <Progress value={progressPercent} />
          </div>
        )}

        {/* Metadata Badges Row */}
        <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            {course.estimatedHours}h Total
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-zinc-500" />
            {totalLessons} Lessons
          </span>
          {course.labsCount !== undefined && course.labsCount > 0 && (
            <span className="flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-purple-400" />
              {course.labsCount} Labs
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            Quiz
          </span>
        </div>

        {/* Primary CTA (Single dominating button) */}
        <Link
          href={`/courses/${course.slug}`}
          onClick={onSelectCourse}
          className="w-full"
        >
          <Button
            variant={ctaVariant}
            size="md"
            className="w-full justify-center group-hover:scale-[1.01] transition-transform"
            rightIcon={ctaIcon}
          >
            {ctaText}
          </Button>
        </Link>
      </div>
    </div>
  );
};

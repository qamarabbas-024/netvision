'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  PlayCircle,
  Lock,
  BookOpen,
  HelpCircle,
  Terminal,
  Layers,
  X,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SidebarLessonItem {
  id: string;
  slug: string;
  title: string;
  order: number;
  durationMinutes: number;
  completed?: boolean;
  active?: boolean;
  locked?: boolean;
  hasQuiz?: boolean;
  hasLab?: boolean;
  score?: number | null;
}

export interface SidebarModuleItem {
  id: string;
  title: string;
  order: number;
  lessons: SidebarLessonItem[];
}

export interface LearningSidebarProps {
  course: {
    id: string;
    slug: string;
    title: string;
    code?: string;
    level?: string;
    progressPercent?: number;
    completedLessons?: number;
    lessonsCount?: number;
    modules: SidebarModuleItem[];
  };
  currentLessonSlug?: string;
  onSelectLesson?: (lessonSlug: string) => void;
}

const STORAGE_KEY = 'netvision_learning_sidebar_collapsed';

export const LearningSidebar: React.FC<LearningSidebarProps> = ({
  course,
  currentLessonSlug,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setIsCollapsed(stored === 'true');
      }
    }
  }, []);

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, String(nextState));
    }
  };

  // Calculate global index numbers across modules (e.g. 01, 02, 03)
  let lessonCounter = 0;

  return (
    <>
      {/* Mobile Sticky Top Strip with Drawer Trigger */}
      <div className="lg:hidden flex items-center justify-between p-3 glass-panel border-b border-[#272732] rounded-2xl mb-4">
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="flex items-center gap-2.5 text-xs font-bold text-white hover:text-[#00f0ff] transition-colors"
        >
          <Menu className="w-4 h-4 text-[#00f0ff]" />
          <span>Course Menu</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span className="text-[#00f0ff] font-bold">
            {course.completedLessons ?? 0}/{course.lessonsCount ?? 0}
          </span>
          <span>Lessons</span>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative w-80 max-w-[85vw] h-full bg-[#121217] border-r border-[#272732] p-4 flex flex-col z-10 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#272732] mb-4">
              <div>
                <span className="text-[10px] font-mono text-[#00f0ff] uppercase font-bold">
                  {course.code || 'COURSE SYLLABUS'}
                </span>
                <h3 className="text-sm font-bold text-white truncate max-w-[180px]">
                  {course.title}
                </h3>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4 flex-1">
              {course.modules.map((mod) => (
                <div key={mod.id} className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase text-zinc-500 tracking-wider px-2">
                    {mod.title}
                  </span>
                  {mod.lessons.map((les) => {
                    lessonCounter++;
                    const formattedNum = String(lessonCounter).padStart(2, '0');
                    const isActive = les.slug === currentLessonSlug || les.active;

                    return (
                      <Link
                        key={les.id}
                        href={`/courses/${course.slug}/lessons/${les.slug}`}
                        onClick={() => setMobileDrawerOpen(false)}
                        className={cn(
                          'p-2.5 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all',
                          isActive
                            ? 'bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/40 shadow-glow-cyan'
                            : les.completed
                            ? 'bg-emerald-500/5 text-zinc-300 border-emerald-500/20 hover:text-white'
                            : 'bg-white/5 text-zinc-400 border-white/5 hover:text-white hover:bg-white/10'
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="font-mono text-[11px] text-zinc-500 shrink-0">
                            {formattedNum}
                          </span>
                          <span className="truncate">{les.title}</span>
                        </div>
                        {les.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : isActive ? (
                          <PlayCircle className="w-4 h-4 text-[#00f0ff] shrink-0 animate-pulse" />
                        ) : les.locked ? (
                          <Lock className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Desktop IDE-Style Collapsible Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col glass-panel border border-[#272732]/80 rounded-3xl transition-all duration-300 relative shrink-0 sticky top-20 max-h-[calc(100vh-6rem)] overflow-hidden',
          isCollapsed ? 'w-16 p-2' : 'w-72 p-4'
        )}
      >
        {/* Sidebar Header & Collapse Toggle */}
        <div className="flex items-center justify-between pb-3 border-b border-[#272732]/80 mb-3 shrink-0">
          {!isCollapsed && (
            <div className="min-w-0 pr-2">
              <span className="text-[10px] font-mono text-[#00f0ff] uppercase font-bold block truncate">
                {course.code || 'COURSE SYLLABUS'}
              </span>
              <h3 className="text-xs font-bold text-white truncate" title={course.title}>
                {course.title}
              </h3>
            </div>
          )}

          <button
            onClick={toggleCollapse}
            className={cn(
              'p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors border border-white/10 shrink-0',
              isCollapsed && 'mx-auto'
            )}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-[#00f0ff]" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Course Progress Indicator (Expanded) */}
        {!isCollapsed && (course.progressPercent !== undefined || course.completedLessons !== undefined) && (
          <div className="mb-4 p-2.5 rounded-2xl bg-[#121217] border border-[#272732] flex flex-col gap-1.5 shrink-0">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-zinc-400">Course Progress</span>
              <span className="text-[#00f0ff] font-bold">
                {course.completedLessons ?? 0}/{course.lessonsCount ?? 0} ({course.progressPercent ?? 0}%)
              </span>
            </div>
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00f0ff] to-[#3b82f6] transition-all duration-300"
                style={{ width: `${course.progressPercent ?? 0}%` }}
              />
            </div>
          </div>
        )}

        {/* Modules & Lessons Scrollable Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
          {(() => {
            let desktopIndex = 0;
            return course.modules.map((mod) => (
              <div key={mod.id} className="flex flex-col gap-1">
                {!isCollapsed && (
                  <span className="text-[10px] font-mono font-bold uppercase text-zinc-500 tracking-wider px-2 block mb-1 truncate">
                    {mod.title}
                  </span>
                )}

                {mod.lessons.map((les) => {
                  desktopIndex++;
                  const formattedNum = String(desktopIndex).padStart(2, '0');
                  const isActive = les.slug === currentLessonSlug || les.active;

                  if (isCollapsed) {
                    return (
                      <Link
                        key={les.id}
                        href={`/courses/${course.slug}/lessons/${les.slug}`}
                        className={cn(
                          'w-10 h-10 rounded-xl mx-auto flex items-center justify-center text-xs font-mono font-bold transition-all relative group',
                          isActive
                            ? 'bg-[#00f0ff] text-black shadow-glow-cyan'
                            : les.completed
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : les.locked
                            ? 'bg-white/5 text-zinc-600 border border-white/5'
                            : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                        )}
                        title={`${formattedNum}. ${les.title}`}
                      >
                        {les.completed && !isActive ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : les.locked ? (
                          <Lock className="w-3.5 h-3.5 text-zinc-600" />
                        ) : (
                          formattedNum
                        )}

                        {/* Hover Tooltip */}
                        <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#181820] text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#272732] shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                          <span className="text-[#00f0ff] mr-1.5 font-mono">{formattedNum}</span>
                          {les.title}
                        </div>
                      </Link>
                    );
                  }

                  return (
                    <Link
                      key={les.id}
                      href={`/courses/${course.slug}/lessons/${les.slug}`}
                      className={cn(
                        'p-2.5 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all group',
                        isActive
                          ? 'bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/40 shadow-glow-cyan font-bold'
                          : les.completed
                          ? 'bg-emerald-500/5 text-zinc-300 border-emerald-500/20 hover:text-white hover:bg-emerald-500/10'
                          : les.locked
                          ? 'bg-white/5 text-zinc-500 border-white/5 cursor-not-allowed opacity-60'
                          : 'bg-white/5 text-zinc-400 border-white/5 hover:text-white hover:bg-white/10'
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <span className="font-mono text-[11px] text-zinc-500 group-hover:text-zinc-400 shrink-0">
                          {formattedNum}
                        </span>
                        <span className="truncate">{les.title}</span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {les.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : isActive ? (
                          <PlayCircle className="w-4 h-4 text-[#00f0ff] animate-pulse" />
                        ) : les.locked ? (
                          <Lock className="w-3.5 h-3.5 text-zinc-600" />
                        ) : (
                          <span className="text-[10px] font-mono text-zinc-600">
                            {les.durationMinutes}m
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            ));
          })()}
        </div>
      </aside>
    </>
  );
};

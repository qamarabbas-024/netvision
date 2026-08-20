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
      <div className="lg:hidden flex items-center justify-between p-3 surface-2 border border-[#2a2e39] rounded-xl mb-4 font-sans">
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="flex items-center gap-2 text-xs font-bold text-[#f4f5f7] hover:text-[#38bdf8] transition-colors"
        >
          <Menu className="w-4 h-4 text-[#38bdf8]" />
          <span>Course Menu</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-[#8e95a5]">
          <span className="text-[#38bdf8] font-bold">
            {course.completedLessons ?? 0}/{course.lessonsCount ?? 0}
          </span>
          <span>Lessons</span>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex font-sans">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative w-80 max-w-[85vw] h-full bg-[#16181f] border-r border-[#2a2e39] p-4 flex flex-col z-10 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#2a2e39] mb-4">
              <div>
                <span className="text-[10px] font-mono text-[#38bdf8] uppercase font-bold">
                  {course.code || 'COURSE SYLLABUS'}
                </span>
                <h3 className="text-sm font-bold text-[#f4f5f7] truncate max-w-[180px]">
                  {course.title}
                </h3>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-[#8e95a5] hover:text-[#f4f5f7] bg-[#14151a] border border-[#2a2e39]"
                aria-label="Close syllabus menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-4 flex-1">
              {course.modules.map((mod) => (
                <div key={mod.id} className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#646c7d] tracking-wider px-2">
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
                          'p-2.5 rounded-lg border flex items-center justify-between text-xs font-semibold transition-all',
                          isActive
                            ? 'bg-[#14151a] text-[#38bdf8] border-[#38bdf8]/40 shadow-inner font-bold'
                            : les.completed
                            ? 'bg-[#10b981]/5 text-[#c4c9d4] border-[#10b981]/20 hover:text-white'
                            : 'bg-white/5 text-[#8e95a5] border-[#2a2e39] hover:text-white hover:bg-white/10'
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="font-mono text-[11px] text-[#646c7d] shrink-0">
                            {formattedNum}
                          </span>
                          <span className="truncate">{les.title}</span>
                        </div>
                        {les.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
                        ) : isActive ? (
                          <PlayCircle className="w-4 h-4 text-[#38bdf8] shrink-0 animate-pulse" />
                        ) : les.locked ? (
                          <Lock className="w-3.5 h-3.5 text-[#646c7d] shrink-0" />
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
          'hidden lg:flex flex-col surface-2 border border-[#2a2e39] rounded-xl transition-all duration-300 relative shrink-0 sticky top-20 max-h-[calc(100vh-6rem)] overflow-hidden font-sans',
          isCollapsed ? 'w-16 p-2' : 'w-72 p-4'
        )}
      >
        {/* Sidebar Header & Collapse Toggle */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2a2e39] mb-3 shrink-0">
          {!isCollapsed && (
            <div className="min-w-0 pr-2">
              <span className="text-[10px] font-mono text-[#38bdf8] uppercase font-bold block truncate">
                {course.code || 'COURSE SYLLABUS'}
              </span>
              <h3 className="text-xs font-bold text-[#f4f5f7] truncate" title={course.title}>
                {course.title}
              </h3>
            </div>
          )}

          <button
            onClick={toggleCollapse}
            className={cn(
              'p-1.5 rounded-lg bg-[#14151a] hover:bg-[#1b1e26] text-[#8e95a5] hover:text-[#f4f5f7] transition-colors border border-[#2a2e39] shrink-0',
              isCollapsed && 'mx-auto'
            )}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-[#38bdf8]" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Course Progress Indicator (Expanded) */}
        {!isCollapsed && (course.progressPercent !== undefined || course.completedLessons !== undefined) && (
          <div className="mb-4 p-2.5 rounded-lg bg-[#14151a] border border-[#2a2e39] flex flex-col gap-1.5 shrink-0">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-[#8e95a5]">Course Progress</span>
              <span className="text-[#38bdf8] font-bold">
                {course.completedLessons ?? 0}/{course.lessonsCount ?? 0} ({course.progressPercent ?? 0}%)
              </span>
            </div>
            <div className="h-1.5 w-full bg-[#121316] rounded-md overflow-hidden p-0.5 border border-[#2a2e39]">
              <div
                className="h-full bg-[#2563eb] rounded-sm transition-all duration-300"
                style={{ width: `${course.progressPercent ?? 0}%` }}
              />
            </div>
          </div>
        )}

        {/* Modules & Lessons Scrollable Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {(() => {
            let desktopIndex = 0;
            return course.modules.map((mod) => (
              <div key={mod.id} className="flex flex-col gap-1">
                {!isCollapsed && (
                  <span className="text-[10px] font-mono font-bold uppercase text-[#646c7d] tracking-wider px-2 block mb-1 truncate">
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
                          'w-9 h-9 rounded-lg mx-auto flex items-center justify-center text-xs font-mono font-bold transition-all relative group',
                          isActive
                            ? 'bg-[#2563eb] text-white shadow-sm'
                            : les.completed
                            ? 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30'
                            : 'text-[#8e95a5] hover:text-[#f4f5f7] hover:bg-[#14151a]'
                        )}
                        title={les.title}
                      >
                        {les.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                        ) : (
                          formattedNum
                        )}
                      </Link>
                    );
                  }

                  return (
                    <Link
                      key={les.id}
                      href={`/courses/${course.slug}/lessons/${les.slug}`}
                      className={cn(
                        'p-2 rounded-lg border flex items-center justify-between text-xs font-semibold transition-all',
                        isActive
                          ? 'bg-[#14151a] text-[#38bdf8] border-[#38bdf8]/40 shadow-inner font-bold'
                          : les.completed
                          ? 'bg-[#10b981]/5 text-[#c4c9d4] border-[#10b981]/20 hover:text-white'
                          : 'bg-transparent text-[#8e95a5] border-transparent hover:text-white hover:bg-[#14151a]'
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-[11px] text-[#646c7d] shrink-0">
                          {formattedNum}
                        </span>
                        <span className="truncate">{les.title}</span>
                      </div>
                      {les.completed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                      ) : isActive ? (
                        <PlayCircle className="w-3.5 h-3.5 text-[#38bdf8] shrink-0 animate-pulse" />
                      ) : les.locked ? (
                        <Lock className="w-3.5 h-3.5 text-[#646c7d] shrink-0" />
                      ) : null}
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

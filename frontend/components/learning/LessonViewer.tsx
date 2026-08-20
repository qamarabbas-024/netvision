'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Quiz } from './Quiz';
import { VisualRegistry } from '@/components/visuals/VisualRegistry';
import { InteractiveControlPanel } from './blocks/InteractiveControlPanel';
import { GuidedPracticeTerminal } from './blocks/GuidedPracticeTerminal';
import { BreakFixScenarioCard } from './blocks/BreakFixScenarioCard';
import { LessonContentRenderer } from './LessonContentRenderer';
import { LearningSidebar } from './LearningSidebar';
import { completeLessonApi, toggleSaveLessonApi, getSavedLessonsApi } from '@/lib/api';
import { GuestProgressService } from '@/services/GuestProgressService';
import { useAuthStore } from '@/stores/authStore';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Bookmark,
  Award,
  BookOpen,
  Sparkles,
  Eye,
  Lock,
} from 'lucide-react';

export interface LessonViewerProps {
  lesson: {
    id: string;
    title: string;
    slug: string;
    type: string;
    durationMinutes: number;
    isCompleted?: boolean;
    completed?: boolean;
    score?: number | null;
    course: {
      id: string;
      title: string;
      slug: string;
      level: string;
      modules?: any[];
    };
    module: {
      id: string;
      title: string;
    };
    content?: any;
    objectives?: any[];
    concepts?: any[];
    examples?: any[];
    commands?: any[];
    labs?: any[];
    practice?: any[];
    mistakes?: any[];
    recaps?: any[];
    quiz?: any;
  };
  onMarkComplete?: () => void;
  nextLessonSlug?: string;
  initialStage?: string;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({
  lesson,
  onMarkComplete,
  nextLessonSlug,
  initialStage,
}) => {
  const { isAuthenticated } = useAuthStore();

  // 4 Core Flow Stages: Learn -> Practice -> Quiz -> Mastery
  const stages = ['learn', 'practice', 'quiz', 'mastery'] as const;
  type StageType = (typeof stages)[number];

  const defaultStage =
    initialStage && (stages as readonly string[]).includes(initialStage)
      ? (initialStage as StageType)
      : 'learn';

  const isInitiallyCompleted = lesson.isCompleted ?? lesson.completed ?? false;
  const [activeStage, setActiveStage] = useState<StageType>(defaultStage);
  const [completedStages, setCompletedStages] = useState<Set<string>>(
    new Set(isInitiallyCompleted ? stages : ['learn'])
  );
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  const resolvedNextLessonSlug =
    nextLessonSlug ||
    (() => {
      if (!lesson.course?.modules) return undefined;
      const allL: any[] = [];
      lesson.course.modules.forEach((mod: any) => {
        if (mod.lessons) {
          mod.lessons.forEach((l: any) => allL.push(l));
        }
      });
      const currentIndex = allL.findIndex((l) => l.slug === lesson.slug);
      if (currentIndex !== -1 && currentIndex < allL.length - 1) {
        return allL[currentIndex + 1].slug;
      }
      return undefined;
    })();

  const triggerLessonCompletion = async () => {
    try {
      if (!isAuthenticated) {
        GuestProgressService.markLessonCompleted(lesson.id, lesson.slug);
      } else {
        await completeLessonApi(lesson.id);
      }
    } catch (e) {
      console.warn('Lesson completion update failed:', e);
    }
    if (onMarkComplete) {
      onMarkComplete();
    }
  };

  useEffect(() => {
    if (activeStage === 'mastery') {
      setCompletedStages(new Set(stages));
      triggerLessonCompletion();
    }
  }, [activeStage]);

  useEffect(() => {
    const guestState = GuestProgressService.getProgress();
    if (guestState.bookmarkedLessonIds.includes(lesson.id)) {
      setIsBookmarked(true);
    }
    getSavedLessonsApi()
      .then((savedList) => {
        if (Array.isArray(savedList)) {
          const found = savedList.some(
            (s: any) => s.lessonId === lesson.id || s.lesson?.id === lesson.id || s.id === lesson.id
          );
          if (found) setIsBookmarked(true);
        }
      })
      .catch(() => null);
  }, [lesson.id]);

  const markStageDone = (stg: StageType) => {
    setCompletedStages((prev) => new Set(prev).add(stg));
  };

  const handleNextStage = () => {
    markStageDone(activeStage);
    const currentIndex = stages.indexOf(activeStage);
    if (currentIndex < stages.length - 1) {
      setActiveStage(stages[currentIndex + 1]);
    }
  };

  const handlePrevStage = () => {
    const currentIndex = stages.indexOf(activeStage);
    if (currentIndex > 0) {
      setActiveStage(stages[currentIndex - 1]);
    }
  };

  const handleQuizComplete = async (score: number, passed: boolean) => {
    markStageDone('quiz');
    if (passed) {
      await triggerLessonCompletion();
    }
  };

  const handleToggleBookmark = async () => {
    const nextState = GuestProgressService.toggleBookmark(lesson.id);
    setIsBookmarked(nextState);
    try {
      await toggleSaveLessonApi(lesson.id);
    } catch (e) {
      console.warn('Backend bookmark toggle failed:', e);
    }
  };

  const sidebarModules = lesson.course.modules && lesson.course.modules.length > 0
    ? lesson.course.modules.map((m: any) => ({
        id: m.id,
        title: m.title,
        order: m.order || 1,
        lessons: (m.lessons || []).map((l: any) => ({
          id: l.id,
          slug: l.slug,
          title: l.title,
          order: l.order || 1,
          durationMinutes: l.durationMinutes || 15,
          completed: l.completed ?? false,
          active: l.slug === lesson.slug,
          locked: false,
        })),
      }))
    : [
        {
          id: lesson.module.id || 'mod-1',
          title: lesson.module.title || 'Module 1',
          order: 1,
          lessons: [
            {
              id: lesson.id,
              slug: lesson.slug,
              title: lesson.title,
              order: 1,
              durationMinutes: lesson.durationMinutes || 15,
              completed: lesson.isCompleted ?? false,
              active: true,
              locked: false,
            },
          ],
        },
      ];

  const sidebarCourse = {
    id: lesson.course.id,
    slug: lesson.course.slug,
    title: lesson.course.title,
    level: lesson.course.level,
    modules: sidebarModules,
  };

  const hasPractice = !!(
    (lesson.practice && lesson.practice.length > 0) ||
    (lesson.content?.practice && lesson.content.practice.length > 0) ||
    (lesson.labs && lesson.labs.length > 0)
  );

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Network Instrument Lesson Header */}
      <header className="bg-[#181a1f] p-3.5 sm:p-4 rounded-xl border border-[#2a2e39] flex items-center justify-between gap-4 sticky top-4 z-30 shadow-instrument">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/courses/${lesson.course.slug}`}
            className="p-2 rounded-lg bg-[#14151a] border border-[#2a2e39] hover:border-[#38bdf8]/40 text-[#8e95a5] hover:text-white transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38bdf8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121316]"
            aria-label="Back to Course Syllabus"
            title="Back to Course Syllabus"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
              <span className="text-[#8e95a5] truncate">
                {lesson.course.title}
              </span>
              <span className="text-zinc-600">•</span>
              <span className="px-1.5 py-0.5 rounded bg-[#14151a] border border-[#2a2e39] text-[10px] text-[#38bdf8] font-bold uppercase">
                {lesson.course.level}
              </span>
              <span className="text-[#8e95a5]">
                {lesson.durationMinutes || 15} MIN
              </span>
              {isInitiallyCompleted && (
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  VERIFIED ✓
                </span>
              )}
            </div>
            <h1 className="text-base sm:text-lg font-bold text-[#f4f5f7] tracking-tight truncate mt-0.5 font-sans">
              {lesson.title}
            </h1>
          </div>
        </div>

        {/* Instrument Mode Tabs */}
        <div className="hidden lg:flex items-center gap-1 bg-[#14151a] p-1 rounded-lg border border-[#2a2e39]" role="tablist" aria-label="Lesson Stages">
          {stages.map((stg) => {
            const isDone = completedStages.has(stg);
            const isActive = activeStage === stg;
            const labels = {
              learn: '01 THEORY & MODEL',
              practice: '02 LAB WORKBENCH',
              quiz: '03 DIAGNOSTICS',
              mastery: '04 SUMMARY',
            };

            return (
              <button
                key={stg}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveStage(stg)}
                className={`px-3 py-1.5 rounded text-[11px] font-mono font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38bdf8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121316] ${
                  isActive
                    ? 'bg-[#2563eb] text-white font-bold shadow-sm'
                    : isDone
                    ? 'text-emerald-400 hover:text-white'
                    : 'text-[#8e95a5] hover:text-white'
                }`}
              >
                {isDone && !isActive && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />}
                {labels[stg]}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleToggleBookmark}
          aria-label={isBookmarked ? 'Remove bookmark from lesson' : 'Bookmark lesson for review'}
          className="p-2 rounded-lg bg-[#14151a] border border-[#2a2e39] hover:border-[#38bdf8]/40 text-[#8e95a5] hover:text-[#38bdf8] transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38bdf8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121316]"
          title="Bookmark Lesson"
        >
          <Bookmark
            className={`w-4 h-4 ${
              isBookmarked ? 'text-[#38bdf8] fill-[#38bdf8]' : ''
            }`}
          />
        </button>
      </header>

      {/* Main Two-Column Layout */}
      <div className="flex gap-6 items-start">
        {/* Collapsible Sidebar */}
        <LearningSidebar course={sidebarCourse} currentLessonSlug={lesson.slug} />

        {/* Main Content Body */}
        <main className="flex-1 min-w-0">
          {/* STAGE 1: LEARN & SEE */}
          {activeStage === 'learn' && (
            <div className="space-y-6">
              <LessonContentRenderer
                lesson={lesson}
                onStartLab={() => setActiveStage(hasPractice ? 'practice' : 'quiz')}
                onProceedToQuiz={() => setActiveStage(hasPractice ? 'practice' : 'quiz')}
              />

              <div className="flex items-center justify-between pt-6 border-t border-[#2a2e39]">
                <span className="text-xs text-[#8e95a5] font-mono">Stage 1 of 4: Conceptual Understanding</span>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setActiveStage(hasPractice ? 'practice' : 'quiz')}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="font-bold text-xs px-5 py-2.5 shadow-sm"
                >
                  {hasPractice ? 'Next: Practice Exercises →' : 'Next: Knowledge Check Quiz →'}
                </Button>
              </div>
            </div>
          )}

          {/* STAGE 2: PRACTICE */}
          {activeStage === 'practice' && (
            <div className="space-y-6">
              <Card className="p-5 sm:p-6 surface-2 border border-[#2a2e39] rounded-xl space-y-3 shadow-instrument">
                <div className="flex items-center justify-between">
                  <Badge variant="cyan" dot={true}>STAGE 2: PRACTICE WORKBENCH</Badge>
                  <span className="text-xs font-mono text-[#8e95a5]">Interactive Diagnostics</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#f4f5f7]">Self-Paced Practice & Terminal Diagnostics</h2>
                <p className="text-xs sm:text-sm text-[#8e95a5] leading-relaxed">
                  Apply your understanding by executing real diagnostic commands and inspecting protocol states.
                </p>
              </Card>

              <GuidedPracticeTerminal
                topicSlug={lesson.slug}
                instructions={
                  lesson.content?.practicalActivity?.instructions ||
                  `Run diagnostic commands in the terminal to verify protocol configuration.`
                }
              />

              <div className="flex items-center justify-between pt-6 border-t border-[#2a2e39]">
                <Button
                  variant="ghost"
                  onClick={() => setActiveStage('learn')}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                  className="text-xs text-[#8e95a5] hover:text-[#f4f5f7]"
                >
                  Back to Lesson Content
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setActiveStage('quiz')}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="font-bold text-xs px-5 py-2.5 shadow-sm"
                >
                  Next: Knowledge Check Quiz →
                </Button>
              </div>
            </div>
          )}

          {/* STAGE 3: QUIZ */}
          {activeStage === 'quiz' && (
            <div className="space-y-6">
              {lesson.quiz ? (
                <Quiz
                  quiz={lesson.quiz}
                  onComplete={handleQuizComplete}
                  onContinueLesson={() => setActiveStage('mastery')}
                />
              ) : (
                <Card className="p-6 text-center space-y-3 surface-2 border border-[#2a2e39] rounded-xl shadow-instrument">
                  <CheckCircle2 className="w-10 h-10 text-[#10b981] mx-auto" />
                  <h3 className="text-base sm:text-lg font-bold text-[#f4f5f7]">
                    No Quiz Required for this Lesson
                  </h3>
                  <p className="text-xs text-[#8e95a5] max-w-sm mx-auto">
                    You have reviewed all technical concepts and can proceed directly to mastery summary.
                  </p>
                  <Button variant="primary" onClick={() => setActiveStage('mastery')} className="font-bold text-xs">
                    Proceed to Mastery Summary
                  </Button>
                </Card>
              )}
            </div>
          )}

          {/* STAGE 4: MASTERY & COMPLETION */}
          {activeStage === 'mastery' && (
            <Card className="p-8 sm:p-10 surface-2 border border-[#2a2e39] rounded-xl text-center flex flex-col items-center gap-6 shadow-elevated">
              <div className="w-16 h-16 rounded-full bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 flex items-center justify-center">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <Badge variant="emerald" dot={true} className="mb-2 font-mono">
                  LESSON COMPLETE
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f4f5f7] mb-2">
                  Lesson Completed
                </h2>
                <p className="text-xs sm:text-sm text-[#8e95a5] max-w-md mx-auto">
                  You have successfully completed the technical evaluation for{' '}
                  <strong className="text-[#f4f5f7]">{lesson.title}</strong>.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-6 border-t border-[#2a2e39] w-full justify-center">
                <Link href={`/courses/${lesson.course.slug}`}>
                  <Button variant="secondary" leftIcon={<BookOpen className="w-4 h-4" />} className="text-xs font-semibold">
                    Course Syllabus
                  </Button>
                </Link>

                {resolvedNextLessonSlug ? (
                  <Link href={`/courses/${lesson.course.slug}/lessons/${resolvedNextLessonSlug}`}>
                    <Button
                      variant="primary"
                      size="md"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                      className="font-bold text-xs px-6 py-2.5 shadow-sm"
                    >
                      Continue to Next Lesson →
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/courses/${lesson.course.slug}`}>
                    <Button
                      variant="primary"
                      size="md"
                      rightIcon={<CheckCircle2 className="w-4 h-4" />}
                      className="font-bold text-xs px-6 py-2.5 shadow-sm"
                    >
                      Module Complete ✓
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

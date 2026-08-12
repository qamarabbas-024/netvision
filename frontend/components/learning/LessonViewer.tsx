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
import { completeLessonApi } from '@/lib/api';
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

  const stages = [
    'learn',
    'understand',
    'see',
    'interact',
    'practice',
    'breakfix',
    'quiz',
    'mastery',
  ] as const;
  type StageType = (typeof stages)[number];

  const defaultStage =
    initialStage && stages.includes(initialStage as StageType)
      ? (initialStage as StageType)
      : 'learn';

  const [activeStage, setActiveStage] = useState<StageType>(defaultStage);
  const [completedStages, setCompletedStages] = useState<Set<string>>(
    new Set(lesson.isCompleted ? stages : ['learn'])
  );
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  useEffect(() => {
    // Check local guest bookmark status
    const guestState = GuestProgressService.getProgress();
    if (guestState.bookmarkedLessonIds.includes(lesson.id)) {
      setIsBookmarked(true);
    }
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
      try {
        if (!isAuthenticated) {
          GuestProgressService.markLessonCompleted(lesson.id, lesson.slug, score);
        } else {
          await completeLessonApi(lesson.id);
        }
      } catch (e) {
        console.warn('Lesson completion update failed:', e);
      }
      if (onMarkComplete) {
        onMarkComplete();
      }
    }
  };

  const handleToggleBookmark = () => {
    const nextState = GuestProgressService.toggleBookmark(lesson.id);
    setIsBookmarked(nextState);
  };

  // Build sidebar course modules structure safely
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
          locked: false, // Completed lessons always reviewable!
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

  return (
    <div className="flex flex-col gap-6">
      {/* Top Bar Header */}
      <header className="glass-panel border-b border-[#272732]/80 p-3.5 sm:p-4 rounded-3xl flex items-center justify-between gap-3 sm:gap-4 sticky top-4 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <Link
            href={`/courses/${lesson.course.slug}`}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors shrink-0"
            title="Back to Course Syllabus"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 truncate">
                {lesson.course.title}
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-[10px] sm:text-[11px] font-mono text-[#00f0ff] uppercase shrink-0 font-bold">
                {lesson.course.level}
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
              {lesson.title}
            </h1>
          </div>
        </div>

        {/* Stepper Navigation */}
        <div className="hidden xl:flex items-center gap-1 glass-panel p-1 rounded-2xl border border-[#272732]">
          {stages.map((stg, idx) => {
            const isDone = completedStages.has(stg);
            const isActive = activeStage === stg;
            return (
              <button
                key={stg}
                onClick={() => setActiveStage(stg)}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-mono font-semibold uppercase tracking-wider transition-all flex items-center gap-1 ${
                  isActive
                    ? 'bg-[#00f0ff] text-black shadow-glow-cyan font-bold'
                    : isDone
                    ? 'text-emerald-400 hover:text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {isDone && !isActive && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                {idx + 1}. {stg}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleToggleBookmark}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-[#00f0ff] transition-colors shrink-0"
          title="Bookmark Lesson"
        >
          <Bookmark
            className={`w-4 h-4 sm:w-5 sm:h-5 ${
              isBookmarked ? 'text-[#00f0ff] fill-[#00f0ff]' : ''
            }`}
          />
        </button>
      </header>

      {/* Mobile Stepper Selector */}
      <div className="xl:hidden flex items-center justify-between gap-2 p-2.5 rounded-2xl glass-panel border border-[#272732]">
        <span className="text-xs font-mono font-bold text-[#00f0ff] uppercase px-1 truncate">
          Stage {stages.indexOf(activeStage) + 1} / {stages.length}: {activeStage.toUpperCase()}
        </span>
        <select
          value={activeStage}
          onChange={(e) => setActiveStage(e.target.value as StageType)}
          className="bg-[#121217] text-white border border-[#272732] rounded-xl px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-[#00f0ff] shrink-0"
        >
          {stages.map((stg, idx) => (
            <option key={stg} value={stg}>
              {idx + 1}. {stg.toUpperCase()} {completedStages.has(stg) ? '✓' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Main Two-Column Layout: Collapsible Sidebar + Lesson Content */}
      <div className="flex gap-6 items-start">
        {/* IDE-Style Collapsible Sidebar */}
        <LearningSidebar course={sidebarCourse} currentLessonSlug={lesson.slug} />

        {/* Main Lesson Content Area */}
        <main className="flex-1 min-w-0">
          {/* STAGE 1: LEARN (THEORY & TECHNICAL BREAKDOWN) */}
          {activeStage === 'learn' && (
            <div className="space-y-6">
              <LessonContentRenderer
                lesson={lesson}
                onStartLab={() => setActiveStage('practice')}
                onProceedToQuiz={() => setActiveStage('quiz')}
              />
            </div>
          )}

          {/* STAGE 2: UNDERSTAND (MENTAL MODEL & ANALOGY) */}
          {activeStage === 'understand' && (
            <Card className="p-8 glass-panel-glow border-[#00f0ff]/30 flex flex-col gap-6">
              <Badge variant="purple">STAGE 2: UNDERSTAND (MENTAL MODEL)</Badge>
              <h2 className="text-2xl font-extrabold text-white">
                Intuitive Mental Model & Real-World Analogy
              </h2>

              <div className="p-6 rounded-3xl bg-purple-500/10 border border-purple-500/30 flex items-start gap-4">
                <Sparkles className="w-8 h-8 text-purple-400 shrink-0 mt-1" />
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white">Real-World Parallel</h3>
                  <p className="text-sm text-purple-200 leading-relaxed">
                    {lesson.content?.analogy ||
                      'Think of packet switching like an international mailing system: addresses ensure delivery while routing hubs transfer parcels.'}
                  </p>
                </div>
              </div>

              {lesson.content?.keyConcepts && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Key Architectural Principles
                  </h3>
                  {lesson.content.keyConcepts.map((kc: string, idx: number) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 text-xs text-zinc-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#00f0ff] shrink-0" />
                      <span>{kc}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-[#272732]">
                <Button
                  variant="ghost"
                  onClick={handlePrevStage}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Previous
                </Button>
                <Button
                  variant="cyan"
                  size="lg"
                  onClick={handleNextStage}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Next: Protocol Visualizer →
                </Button>
              </div>
            </Card>
          )}

          {/* STAGE 3: SEE (PROTOCOL ANIMATION) */}
          {activeStage === 'see' && (
            <Card className="p-8 glass-panel-glow border-[#00f0ff]/30 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <Badge variant="cyan">STAGE 3: SEE (VISUAL FLOW)</Badge>
                <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-[#00f0ff]" /> Live Packet Protocol Flow
                </span>
              </div>

              <h2 className="text-2xl font-extrabold text-white">
                Interactive Visual Protocol Flow
              </h2>

              <VisualRegistry topicSlug={lesson.slug} />

              <div className="flex items-center justify-between pt-4 border-t border-[#272732]">
                <Button
                  variant="ghost"
                  onClick={handlePrevStage}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Previous
                </Button>
                <Button
                  variant="cyan"
                  size="lg"
                  onClick={handleNextStage}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Next: Parameter Controls →
                </Button>
              </div>
            </Card>
          )}

          {/* STAGE 4: INTERACT (DYNAMIC CONTROL PANEL) */}
          {activeStage === 'interact' && (
            <div className="flex flex-col gap-6">
              <InteractiveControlPanel topicSlug={lesson.slug} />

              <div className="flex items-center justify-between p-4 rounded-2xl glass-panel border border-[#272732]">
                <Button
                  variant="ghost"
                  onClick={handlePrevStage}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Previous
                </Button>
                <Button
                  variant="cyan"
                  size="lg"
                  onClick={handleNextStage}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Next: Guided CLI Practice →
                </Button>
              </div>
            </div>
          )}

          {/* STAGE 5: PRACTICE (GUIDED CLI TERMINAL) */}
          {activeStage === 'practice' && (
            <div className="flex flex-col gap-6">
              <GuidedPracticeTerminal
                topicSlug={lesson.slug}
                instructions={
                  lesson.content?.practicalActivity?.instructions ||
                  `Run diagnostic commands in the simulated terminal below to verify configuration.`
                }
              />

              <div className="flex items-center justify-between p-4 rounded-2xl glass-panel border border-[#272732]">
                <Button
                  variant="ghost"
                  onClick={handlePrevStage}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Previous
                </Button>
                <Button
                  variant="cyan"
                  size="lg"
                  onClick={handleNextStage}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Next: Troubleshooting Scenario →
                </Button>
              </div>
            </div>
          )}

          {/* STAGE 6: BREAK / FIX (TROUBLESHOOTING) */}
          {activeStage === 'breakfix' && (
            <div className="flex flex-col gap-6">
              <BreakFixScenarioCard topicSlug={lesson.slug} />

              <div className="flex items-center justify-between p-4 rounded-2xl glass-panel border border-[#272732]">
                <Button
                  variant="ghost"
                  onClick={handlePrevStage}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Previous
                </Button>
                <Button
                  variant="cyan"
                  size="lg"
                  onClick={handleNextStage}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Next: Knowledge Check Quiz →
                </Button>
              </div>
            </div>
          )}

          {/* STAGE 7: QUIZ (CHALLENGE-FOCUSED KNOWLEDGE CHECK) */}
          {activeStage === 'quiz' && (
            <div className="flex flex-col gap-6">
              {lesson.quiz ? (
                <Quiz
                  quiz={lesson.quiz}
                  onComplete={handleQuizComplete}
                  onContinueLesson={() => setActiveStage('mastery')}
                />
              ) : (
                <Card className="p-8 text-center space-y-4 glass-panel border-[#272732]">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h3 className="text-xl font-bold text-white">
                    No Quiz Required for this Lesson
                  </h3>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                    You have reviewed all technical concepts and can proceed directly to mastery summary.
                  </p>
                  <Button variant="cyan" onClick={() => setActiveStage('mastery')}>
                    Proceed to Mastery Summary
                  </Button>
                </Card>
              )}
            </div>
          )}

          {/* STAGE 8: MASTERY (SUMMARY & NEXT LESSON NAVIGATION) */}
          {activeStage === 'mastery' && (
            <Card className="p-8 glass-panel-glow border-[#00f0ff]/30 text-center flex flex-col items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-glow-emerald">
                <Award className="w-10 h-10" />
              </div>

              <div>
                <Badge variant="emerald" className="mb-2">
                  STAGE 8: LESSON MASTERY ACHIEVED
                </Badge>
                <h2 className="text-3xl font-extrabold text-white mb-2">
                  Lesson Completed!
                </h2>
                <p className="text-sm text-zinc-400 max-w-md mx-auto">
                  You have successfully completed the technical evaluation for{' '}
                  <strong className="text-white">{lesson.title}</strong>.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-[#272732] w-full justify-center">
                <Link href={`/courses/${lesson.course.slug}`}>
                  <Button variant="secondary" leftIcon={<BookOpen className="w-4 h-4" />}>
                    Back to Course Syllabus
                  </Button>
                </Link>

                {nextLessonSlug ? (
                  <Link href={`/courses/${lesson.course.slug}/lessons/${nextLessonSlug}`}>
                    <Button
                      variant="cyan"
                      size="lg"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Continue to Next Lesson
                    </Button>
                  </Link>
                ) : (
                  <Link href="/courses">
                    <Button
                      variant="cyan"
                      size="lg"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Browse Course Catalog
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

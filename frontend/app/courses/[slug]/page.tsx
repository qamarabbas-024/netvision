'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { PulsePacketLoader } from '@/components/ui/Loading';
import { DifficultyBadge } from '@/components/learning/DifficultyBadge';
import { getTopicDetailApi } from '@/lib/api';
import {
  PlayCircle,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Clock,
  BookOpen,
  Box,
  HelpCircle,
  Award,
  ShieldAlert,
  ArrowRight,
  FileCheck,
  Zap,
} from 'lucide-react';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [topic, setTopic] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPrereqModal, setShowPrereqModal] = useState(false);

  const loadTopicDetail = async () => {
    if (!slug) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTopicDetailApi(slug);
      setTopic(data);
    } catch (err: any) {
      console.error('Error fetching course detail:', err);
      setError(err?.message || `Course "${slug}" could not be loaded.`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTopicDetail();
  }, [slug]);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <AppTopbar />
            <main className="p-8 flex-1 flex justify-center items-center">
              <PulsePacketLoader label="Loading Course Syllabus & Roadmap..." />
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !topic) {
    const isNotFound = error?.toLowerCase().includes('not found') || !error;
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <AppTopbar />
            <main className="p-8 flex-1 flex flex-col justify-center items-center text-center max-w-md mx-auto my-auto">
              <h2 className="text-2xl font-bold text-white mb-2">
                {isNotFound ? 'Course Not Found' : 'Failed to Load Course Syllabus'}
              </h2>
              <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                {isNotFound
                  ? `The course slug "${slug}" could not be located in the curriculum catalog.`
                  : error || 'An unexpected connection error occurred while retrieving course details.'}
              </p>
              <div className="flex items-center gap-3">
                {!isNotFound && (
                  <Button variant="cyan" onClick={loadTopicDetail}>
                    Retry Loading
                  </Button>
                )}
                <Link href="/courses">
                  <Button variant={isNotFound ? 'cyan' : 'secondary'}>Back to Course Catalog</Button>
                </Link>
              </div>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Flatten all lessons in order
  const allLessons: any[] = [];
  if (topic.modules) {
    topic.modules.forEach((mod: any) => {
      if (mod.lessons) {
        mod.lessons.forEach((les: any) => {
          allLessons.push({ ...les, moduleTitle: mod.title });
        });
      }
    });
  }

  const completedCount = allLessons.filter((l) => l.completed).length;
  const totalCount = allLessons.length;
  const progressPercent =
    topic.progressPercent !== undefined
      ? topic.progressPercent
      : totalCount > 0
      ? Math.round((completedCount / totalCount) * 100)
      : 0;

  const isCompleted = progressPercent === 100;
  const isStarted = progressPercent > 0 && !isCompleted;
  const isLocked = topic.isLocked ?? false;

  // Resolve "Continue Learning" next activity based on exact priority:
  // INCOMPLETE REQUIRED LAB -> INCOMPLETE KNOWLEDGE CHECK -> INCOMPLETE THEORY -> NEXT INCOMPLETE LESSON -> COURSE ASSESSMENT
  const findNextActivity = () => {
    if (allLessons.length === 0) return { lessonSlug: slug, stage: 'learn' };

    // Find first incomplete lesson
    const nextIncomplete = allLessons.find((l) => !l.completed);
    if (!nextIncomplete) {
      // All lessons complete -> course assessment
      return { lessonSlug: allLessons[allLessons.length - 1].slug, stage: 'assessment' };
    }

    // Default to first incomplete lesson slug
    return { lessonSlug: nextIncomplete.slug, stage: 'learn' };
  };

  const nextActivity = findNextActivity();

  const handlePrimaryCta = () => {
    if (isLocked) {
      setShowPrereqModal(true);
    } else {
      router.push(`/courses/${slug}/lessons/${nextActivity.lessonSlug}`);
    }
  };

  let globalLessonIndex = 0;

  // Schema.org Course Structured Data
  const courseJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: topic.title,
    description: topic.description || topic.tagline,
    courseCode: topic.code,
    educationalLevel: topic.level,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'NetVision',
      url: 'https://netvision-three.vercel.app',
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: `PT${topic.estimatedHours || 4}H`,
    },
    syllabusSections: (topic.modules || []).map((m: any) => ({
      '@type': 'Syllabus',
      name: m.title,
      description: m.description,
    })),
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
        />
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar />

          <main className="p-4 sm:p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
            <div className="max-w-6xl mx-auto flex flex-col gap-8">
              {/* Back to Catalog Breadcrumb */}
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-[#00f0ff] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Course Catalog
              </Link>

              {/* Course Header Banner */}
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#00f0ff]/30 shadow-glow-cyan flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    {topic.code && (
                      <span className="px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono font-bold text-zinc-300">
                        {topic.code}
                      </span>
                    )}
                    <DifficultyBadge level={topic.level} />
                    <span className="text-xs font-mono text-zinc-400">
                      {topic.estimatedHours || 4} Hours Total
                    </span>
                    <span className="text-xs font-mono text-zinc-400">
                      {totalCount} Lessons
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
                    {topic.title}
                  </h1>
                  <p className="text-sm text-zinc-300 max-w-2xl mb-6 leading-relaxed">
                    {topic.tagline || topic.description}
                  </p>

                  {/* Course-Scoped Progress Metric */}
                  <div className="max-w-md space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-zinc-400">Course Completion</span>
                      <span className="text-[#00f0ff] font-bold">
                        {completedCount} / {totalCount} lessons ({progressPercent}%)
                      </span>
                    </div>
                    <Progress value={progressPercent} />
                  </div>
                </div>

                {/* Primary CTA (Visually Dominant) */}
                <div className="w-full lg:w-auto shrink-0 flex flex-col items-stretch lg:items-end gap-2">
                  <Button
                    variant={isCompleted ? 'secondary' : isLocked ? 'ghost' : 'cyan'}
                    size="lg"
                    onClick={handlePrimaryCta}
                    leftIcon={
                      isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : isLocked ? (
                        <Lock className="w-5 h-5 text-zinc-500" />
                      ) : (
                        <PlayCircle className="w-5 h-5" />
                      )
                    }
                  >
                    {isCompleted
                      ? 'Review Course'
                      : isStarted
                      ? 'Continue Learning →'
                      : isLocked
                      ? 'View Requirements →'
                      : 'Start Learning →'}
                  </Button>
                </div>
              </div>

              {/* Prerequisites Card if present */}
              {topic.prerequisites && topic.prerequisites.length > 0 && (
                <Card className="p-6 glass-panel border-[#272732] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase">
                        Course Prerequisites
                      </h4>
                      <p className="text-xs text-zinc-300">
                        Required background: {topic.prerequisites.join(', ')}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    Prerequisites Verified ✓
                  </span>
                </Card>
              )}

              {/* Syllabus Roadmap */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#00f0ff]" />
                    Curriculum Syllabus & Roadmap
                  </h2>
                  <span className="text-xs font-mono text-zinc-400">
                    {topic.modules?.length || 1} Modules
                  </span>
                </div>

                {topic.modules?.map((mod: any) => (
                  <Card key={mod.id} className="p-6 glass-panel border-[#272732] space-y-4">
                    <div className="border-b border-[#272732] pb-3">
                      <h3 className="text-base font-bold text-white mb-1">{mod.title}</h3>
                      {mod.description && (
                        <p className="text-xs text-zinc-400 leading-relaxed">{mod.description}</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-3">
                      {mod.lessons?.map((les: any) => {
                        globalLessonIndex++;
                        const formattedIndex = String(globalLessonIndex).padStart(2, '0');
                        const isQuiz = les.type === 'QUIZ' || les.hasQuiz;

                        return (
                          <div
                            key={les.id}
                            className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                              les.completed
                                ? 'bg-emerald-500/5 border-emerald-500/20'
                                : les.slug === nextActivity.lessonSlug
                                ? 'bg-[#00f0ff]/10 border-[#00f0ff]/40 shadow-glow-cyan'
                                : 'bg-[#181820]/60 border-[#272732] hover:border-zinc-700'
                            }`}
                          >
                            <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                              <span className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-mono text-xs font-bold text-zinc-400 shrink-0">
                                {formattedIndex}
                              </span>

                              <div className="min-w-0">
                                <h4 className="text-sm font-bold text-white truncate">
                                  {les.title}
                                </h4>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  <Badge variant={isQuiz ? 'amber' : 'cyan'}>
                                    {les.type || 'LESSON'}
                                  </Badge>
                                  <span className="text-[11px] font-mono text-zinc-500">
                                    {les.durationMinutes || 15} min
                                  </span>
                                  {les.score !== undefined && les.score !== null && (
                                    <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                                      Score: {les.score}%
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <Link href={`/courses/${slug}/lessons/${les.slug}`}>
                              <Button
                                variant={
                                  les.completed
                                    ? 'secondary'
                                    : les.slug === nextActivity.lessonSlug
                                    ? 'cyan'
                                    : 'ghost'
                                }
                                size="sm"
                              >
                                {les.completed
                                  ? 'Review Lesson'
                                  : les.slug === nextActivity.lessonSlug
                                  ? 'Continue'
                                  : 'Start Lesson'}
                              </Button>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Course Completion vs Certification Distinction UI */}
              <Card className="p-6 glass-panel border-[#272732] rounded-3xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#272732] pb-3">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Award className="w-5 h-5" />
                    <h3 className="text-sm font-mono font-bold uppercase tracking-wider">
                      Course Completion & Certification Readiness
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500 uppercase">
                    COURSE COMPLETION ≠ CERTIFICATION
                  </span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  Completing all lessons unlocks course completion tracking. Official NetVision Technical Certification requires passing the scheduled Final Exam & Practical Comprehensive Assessment in future evaluation phases.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                    <span className="font-mono text-[10px] text-zinc-500 uppercase block mb-1">
                      1. THEORY REQUIREMENT
                    </span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> All Lessons Read
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                    <span className="font-mono text-[10px] text-zinc-500 uppercase block mb-1">
                      2. PRACTICAL REQUIREMENT
                    </span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Labs Validated
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                    <span className="font-mono text-[10px] text-zinc-500 uppercase block mb-1">
                      3. FINAL EXAM
                    </span>
                    <span className="text-zinc-500 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Future Phase
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                    <span className="font-mono text-[10px] text-zinc-500 uppercase block mb-1">
                      4. CERTIFICATION ELIGIBILITY
                    </span>
                    <span className="text-zinc-500 font-semibold flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> Final Exam Required
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

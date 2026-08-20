'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { RouterIcon, DNSIcon } from '@/components/ui/Icons';
import { getUserProgressApi, getTopicsApi } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { PulsePacketLoader } from '@/components/ui/Loading';
import {
  Flame,
  Zap,
  PlayCircle,
  CheckCircle2,
  Award,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [userProgress, setUserProgress] = useState<any>(null);
  const [topicsCatalog, setTopicsCatalog] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const [progressData, catalogData] = await Promise.all([
        getUserProgressApi().catch((err) => {
          console.warn('Could not fetch user progress:', err);
          return null;
        }),
        getTopicsApi().catch((err) => {
          console.warn('Could not fetch topics catalog:', err);
          return [];
        }),
      ]);
      if (progressData) setUserProgress(progressData);
      if (catalogData) setTopicsCatalog(catalogData);
      if (!progressData && (!catalogData || catalogData.length === 0)) {
        setLoadError('Unable to connect to learning server. Please check your connection.');
      }
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setLoadError(err?.message || 'Failed to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const progress = userProgress || {
    completedLessons: 0,
    totalLessons: 30,
    overallProgressPercent: 0,
    studyStreak: 0,
    totalXp: 0,
    certificatesEarned: 0,
    currentCourse: null,
    badges: { earned: 0, total: 5, items: [] },
    recentLessons: [],
  };

  // Determine active course context
  const activeCourse = progress.currentCourse || (topicsCatalog.length > 0 ? topicsCatalog[0] : null) || {
    title: 'Computer & Digital Information Foundations',
    slug: 'net-101-digital-foundations',
    code: 'NET-101',
    completedLessons: 0,
    totalLessons: 5,
    progressPercent: 0,
    nextLessonSlug: 'what-is-binary',
  };

  const activeTitle = activeCourse.title || 'Computer & Digital Information Foundations';
  const activeSlug = activeCourse.slug || 'net-101-digital-foundations';
  const activeCode = activeCourse.code || 'NET-101';
  const activeCompleted = activeCourse.completedLessons ?? 0;
  const activeTotal = activeCourse.totalLessons || activeCourse.lessonsCount || 5;
  const activePercent = activeCourse.progressPercent ?? 0;
  const activeNextLesson = activeCourse.nextLessonSlug || 'what-is-binary';

  // Extract earned badges
  const badgeItems = progress?.badges?.items?.length
    ? progress.badges.items
    : [
        { id: '1', title: 'First Step', description: 'Complete your first lesson', badgeIcon: 'Zap', unlocked: false },
        { id: '2', title: 'Knowledge Check', description: 'Pass your first knowledge check', badgeIcon: 'CheckSquare', unlocked: false },
        { id: '3', title: 'Perfect Score', description: 'Score 100% on a quiz', badgeIcon: 'Award', unlocked: false },
        { id: '4', title: 'Lab Master', description: 'Complete an interactive CLI lab', badgeIcon: 'Terminal', unlocked: false },
      ];

  // Recommended next courses from catalog
  const recommendedCourses = topicsCatalog
    .filter((t) => t.slug !== activeSlug && (t.progressPercent || 0) < 100)
    .slice(0, 2);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex font-sans">
        {/* Left Sidebar */}
        <AppSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navigation */}
          <AppTopbar />

          {/* Dashboard Body */}
          <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
            {isLoading ? (
              <div className="py-24 flex justify-center items-center">
                <PulsePacketLoader label="Loading Learner Dashboard & Progress..." />
              </div>
            ) : (
              <div className="max-w-7xl mx-auto flex flex-col gap-6 sm:gap-8">
                {loadError && (
                  <div className="p-4 rounded-xl glass-panel border border-amber-500/30 bg-amber-500/5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                      <p className="text-xs text-amber-200">{loadError}</p>
                    </div>
                    <Button variant="secondary" size="sm" onClick={loadDashboardData} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
                      Retry
                    </Button>
                  </div>
                )}

                {/* 1. WHERE AM I? - Identity & Guest Notice */}
                {!isAuthenticated && (
                  <div className="bg-[#15181e] p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 font-mono text-[10px] font-bold">
                        GUEST
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-[#f3f4f6] font-sans">Guest Session Active</h4>
                        <p className="text-xs text-[#94a3b8] font-sans">
                          Your learning progress is saved locally. Create an account to claim progress permanently and earn verifiable certificates.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                      <Link href="/login" className="flex-1 sm:flex-initial">
                        <Button variant="ghost" size="sm" className="w-full text-xs text-zinc-300">Sign In</Button>
                      </Link>
                      <Link href="/register" className="flex-1 sm:flex-initial">
                        <Button variant="cyan" size="sm" className="w-full text-xs bg-[#00c8f8] text-[#0f1115] font-bold">Create Account</Button>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Header Profile Bar */}
                <div className="bg-[#15181e] p-5 sm:p-6 rounded-xl border border-[#232732] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-[#111317] text-[#00c8f8] border border-[#232732] mb-2">
                      {isAuthenticated ? 'LEARNER // ACTIVE' : 'LEARNER // GUEST_SESSION'}
                    </div>
                    <h1 className="text-xl sm:text-3xl font-extrabold text-[#f3f4f6] tracking-tight font-sans">
                      Welcome{isAuthenticated && (user?.fullName || user?.username) ? `, ${user.fullName || user.username}` : ''}
                    </h1>
                    <p className="text-xs sm:text-sm text-[#94a3b8] mt-1 font-sans">
                      Track active course progress, resume technical lessons, and verify earned credentials.
                    </p>
                  </div>

                  {/* Compact XP & Streak Banner */}
                  <div className="flex items-center gap-3 w-full md:w-auto font-mono">
                    <div className="p-3 rounded-lg bg-[#111317] border border-[#232732] flex items-center gap-3 flex-1 md:flex-initial">
                      <div className="w-8 h-8 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                        <Flame className="w-4 h-4 fill-amber-400" />
                      </div>
                      <div>
                        <span className="text-[10px] text-[#64748b] block uppercase">Streak</span>
                        <span className="text-sm font-bold text-[#f3f4f6]">{progress.studyStreak ?? 0} Days</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-[#111317] border border-[#232732] flex items-center gap-3 flex-1 md:flex-initial">
                      <div className="w-8 h-8 rounded bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] text-[#64748b] block uppercase">Total XP</span>
                        <span className="text-sm font-bold text-[#f3f4f6]">{progress.totalXp ?? 0} XP</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2 & 3. WHAT AM I LEARNING? & WHAT SHOULD I DO NEXT? (HERO CONTINUE LEARNING CARD) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                  {/* Hero Active Course Card */}
                  <Card className="lg:col-span-8 p-6 bg-[#15181e] border border-[#232732] rounded-xl flex flex-col justify-between shadow-subtle">
                    <div>
                      <div className="flex items-center justify-between mb-3 gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-[#111317] border border-[#232732] text-[10px] font-mono font-bold text-[#00c8f8]">
                            CURRENT COURSE
                          </span>
                          <span className="text-xs font-mono text-[#00c8f8] font-semibold">{activeCode}</span>
                        </div>
                        <span className="text-xs font-mono text-[#64748b]">
                          {activeCompleted} of {activeTotal} Lessons
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-bold text-[#f3f4f6] mb-2 font-sans">
                        {activeTitle}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#94a3b8] mb-6 leading-relaxed font-sans">
                        Resume where you left off. Interactive protocol animations, worked calculation problems, and CLI diagnostic labs.
                      </p>

                      {/* Course Progress Bar */}
                      <Progress value={activePercent} label="Course Completion" className="mb-6" />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#232732]">
                      <div className="flex items-center gap-2 text-xs text-[#94a3b8] font-mono">
                        <Clock className="w-4 h-4 text-[#00c8f8]" />
                        <span>{activePercent}% Course Complete</span>
                      </div>

                      {/* HERO PRIMARY ACTION: CONTINUE LEARNING */}
                      <Link href={`/courses/${activeSlug}/lessons/${activeNextLesson}`} className="w-full sm:w-auto">
                        <Button
                          variant="cyan"
                          rightIcon={<PlayCircle className="w-4 h-4" />}
                          className="w-full justify-center bg-[#00c8f8] text-[#0f1115] hover:bg-[#38bdf8] font-bold rounded-lg px-5 text-xs"
                        >
                          Continue Learning →
                        </Button>
                      </Link>
                    </div>
                  </Card>

                  {/* Compact Key Stats Overview */}
                  <div className="lg:col-span-4 grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[#15181e] border border-[#232732] flex flex-col justify-between">
                      <BookOpen className="w-5 h-5 text-[#00c8f8] mb-3" />
                      <div>
                        <span className="text-xl font-bold text-[#f3f4f6] font-mono block">
                          {progress.completedLessons ?? 0}
                        </span>
                        <span className="text-xs text-[#94a3b8] font-sans">Completed Lessons</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#15181e] border border-[#232732] flex flex-col justify-between">
                      <Zap className="w-5 h-5 text-purple-400 mb-3" />
                      <div>
                        <span className="text-xl font-bold text-[#f3f4f6] font-mono block">
                          {progress.simulationsRun ?? 0}
                        </span>
                        <span className="text-xs text-[#94a3b8] font-sans">Simulations Run</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#15181e] border border-[#232732] flex flex-col justify-between">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-3" />
                      <div>
                        <span className="text-xl font-bold text-[#f3f4f6] font-mono block">
                          {progress.quizAverageScore ?? 0}%
                        </span>
                        <span className="text-xs text-[#94a3b8] font-sans">Quiz Average</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#15181e] border border-[#232732] flex flex-col justify-between">
                      <Award className="w-5 h-5 text-amber-400 mb-3" />
                      <div>
                        <span className="text-xl font-bold text-[#f3f4f6] font-mono block">
                          {progress.certificatesEarned ?? 0}
                        </span>
                        <span className="text-xs text-[#94a3b8] font-sans">Certificates Earned</span>
                      </div>
                    </div>
                  </div>
                </div>

              {/* 4. WHAT HAVE I ACHIEVED? - Activity Timeline & Earned Badges */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                {/* Recent Activity Timeline */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white font-sans">Recent Activity Timeline</h3>
                    <Link href="/courses" className="text-xs font-semibold text-[#00f0ff] hover:underline font-sans">
                      View Full Curriculum
                    </Link>
                  </div>

                  <div className="flex flex-col gap-3">
                    {progress.recentLessons && progress.recentLessons.length > 0 ? (
                      progress.recentLessons.map((item: any) => (
                        <Link
                          key={item.id}
                          href={`/courses/${item.courseSlug || 'net-101-digital-foundations'}/lessons/${item.slug || item.id}`}
                          className="glass-panel p-4 rounded-xl border border-[#272732] hover:border-zinc-700 transition-colors flex items-center justify-between gap-4 cursor-pointer group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <RouterIcon size={16} />
                            <div className="min-w-0">
                              <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#00f0ff] transition-colors truncate font-sans">
                                {item.title}
                              </h4>
                              <span className="text-[11px] text-zinc-400 font-mono">
                                {item.courseTitle || 'Networking'} • {item.durationMinutes || 15} min
                              </span>
                            </div>
                          </div>

                          <div>
                            {item.status === 'COMPLETED' ? (
                              <Badge variant="emerald">Completed</Badge>
                            ) : item.status === 'IN_PROGRESS' ? (
                              <Badge variant="cyan">In Progress</Badge>
                            ) : (
                              <Badge variant="neutral">Up Next</Badge>
                            )}
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="glass-panel p-6 rounded-xl border border-[#272732] text-center flex flex-col items-center gap-3">
                        <BookOpen className="w-8 h-8 text-zinc-500" />
                        <div>
                          <h4 className="text-sm font-bold text-white mb-1 font-sans">No Lessons Completed Yet</h4>
                          <p className="text-xs text-zinc-400 font-sans">Select a lesson from the curriculum to start your learning journey.</p>
                        </div>
                        <Link href="/courses">
                          <Button variant="cyan" size="sm">Explore Curriculum →</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Achievements Showcase */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white font-sans">Earned Achievements</h3>
                    <span className="text-xs text-zinc-400 font-mono">
                      {progress?.badges?.earned ?? 0} / {progress?.badges?.total ?? 5} Unlocked
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {badgeItems.map((ach: any, idx: number) => (
                      <div
                        key={ach.id || idx}
                        className={`p-3.5 rounded-xl glass-panel border flex flex-col items-center text-center gap-1.5 ${
                          ach.unlocked ? 'border-[#00f0ff]/40 bg-[#00f0ff]/5' : 'border-[#272732] opacity-50'
                        }`}
                      >
                        <span className="text-2xl">
                          {ach.badgeIcon === 'Zap'
                            ? '⚡'
                            : ach.badgeIcon === 'CheckSquare'
                            ? '☑️'
                            : ach.badgeIcon === 'Terminal'
                            ? '💻'
                            : ach.badgeIcon === 'CheckCircle2'
                            ? '🎓'
                            : '🏆'}
                        </span>
                        <h4 className="text-xs font-bold text-white font-sans">{ach.title || ach.name}</h4>
                        <p className="text-[10px] text-zinc-400 font-sans leading-tight">{ach.description || ach.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended Next Courses */}
              {recommendedCourses.length > 0 && (
                <div className="flex flex-col gap-4 pt-4 border-t border-[#272732]">
                  <h3 className="text-base font-bold text-white font-sans">Recommended Next Pathways</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendedCourses.map((course: any) => (
                      <Link key={course.id || course.slug} href={`/courses/${course.slug}`}>
                        <div className="glass-panel p-5 rounded-xl border border-[#272732] hover:border-zinc-700 transition-all flex items-center justify-between group cursor-pointer">
                          <div className="flex items-center gap-3">
                            <RouterIcon size={18} />
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="cyan">{course.level || 'BEGINNER'}</Badge>
                                <span className="text-[11px] font-mono text-zinc-400">{course.code}</span>
                              </div>
                              <h4 className="text-sm font-bold text-white group-hover:text-[#00f0ff] transition-colors font-sans">
                                {course.title}
                              </h4>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-[#00f0ff] group-hover:translate-x-1 transition-all" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

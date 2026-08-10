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
import { RouterIcon, SwitchIcon, DNSIcon, PacketIcon } from '@/components/ui/Icons';
import { getUserProgressApi } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
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
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [userProgress, setUserProgress] = useState<any>({
    completedLessons: 0,
    totalLessons: 35,
    overallProgressPercent: 0,
    studyStreak: 0,
    totalXp: 0,
    simulationsRun: 0,
    quizAverageScore: 0,
    certificatesEarned: 0,
    badges: { earned: 0, total: 5, items: [] },
    recentLessons: [],
  });

  useEffect(() => {
    getUserProgressApi().then((data) => {
      if (data) {
        setUserProgress(data);
      }
    });
  }, []);

  const badgeItems = userProgress?.badges?.items?.length
    ? userProgress.badges.items
    : [
        { title: 'First Step', description: 'Completed your first lesson', badgeIcon: 'Zap', unlocked: false },
        { title: 'First Knowledge Check', description: 'Passed your first quiz', badgeIcon: 'CheckSquare', unlocked: false },
        { title: 'Perfect Score', description: 'Scored 100% on a quiz', badgeIcon: 'Award', unlocked: false },
        { title: 'First Lab Completed', description: 'Completed your first lab', badgeIcon: 'Terminal', unlocked: false },
      ];

  const recommended = [
    {
      title: 'DNS Hierarchy & Recursive Queries',
      category: 'Core Protocols',
      duration: '15 min',
      level: 'INTERMEDIATE',
      icon: <DNSIcon size={18} />,
    },
    {
      title: 'Stateful Firewall Inspection',
      category: 'Cyber Security',
      duration: '18 min',
      level: 'ADVANCED',
      icon: <ShieldCheck className="w-5 h-5 text-rose-400" />,
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex">
        {/* Left Sidebar */}
        <AppSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navigation */}
          <AppTopbar />

          {/* Dashboard Body */}
          <main className="p-4 sm:p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
            <div className="max-w-7xl mx-auto flex flex-col gap-6 sm:gap-8">
              {/* Guest UX Banner */}
              {!isAuthenticated && (
                <div className="glass-panel p-5 rounded-2xl border border-[#00f0ff]/30 bg-[#00f0ff]/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] shrink-0">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Learning as Guest</h4>
                      <p className="text-xs text-zinc-400">
                        Your learning progress is saved on this device. Log in or create an account anytime to sync progress across devices and claim certificates.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
                    <Link href="/login" className="flex-1 sm:flex-initial">
                      <Button variant="ghost" size="sm" className="w-full">Log In</Button>
                    </Link>
                    <Link href="/register" className="flex-1 sm:flex-initial">
                      <Button variant="cyan" size="sm" className="w-full">Create Account</Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Welcome Header */}
              <div className="glass-panel p-5 sm:p-8 rounded-3xl border border-[#00f0ff]/30 shadow-glow-cyan flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] text-xs font-mono font-bold uppercase mb-3">
                    <Zap className="w-3.5 h-3.5" />
                    {isAuthenticated ? 'Level 4 Networking Learner' : 'Guest Learner'}
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                    Welcome{isAuthenticated && (user?.fullName || user?.username) ? `, ${user.fullName || user.username}` : ''}! ⚡
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
                    You're on a <strong className="text-amber-400">{userProgress?.studyStreak ?? 0}-Day Study Streak</strong>! Keep learning visually to unlock course completion certificates.
                  </p>
                </div>

                <div className="relative z-10 flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 w-full lg:w-auto">
                  {/* Streak Box */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-[#121217] border border-[#272732] flex items-center gap-3 flex-1 sm:flex-initial">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                      <Flame className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-400 animate-bounce" />
                    </div>
                    <div>
                      <span className="text-[10px] sm:text-xs text-zinc-500 block font-mono">STREAK</span>
                      <span className="text-base sm:text-lg font-bold text-white">{userProgress?.studyStreak ?? 0} Days</span>
                    </div>
                  </div>

                  {/* XP Box */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-[#121217] border border-[#272732] flex items-center gap-3 flex-1 sm:flex-initial">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                      <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] sm:text-xs text-zinc-500 block font-mono">TOTAL XP</span>
                      <span className="text-base sm:text-lg font-bold text-white font-mono">{userProgress?.totalXp ?? 0} XP</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Course & Stats Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Active "Continue Learning" Card */}
                <Card className="lg:col-span-8 p-6 glass-panel-glow border-[#00f0ff]/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="cyan">CURRENT COURSE</Badge>
                      <span className="text-xs font-mono text-zinc-400">{userProgress?.completedLessons ?? 0} of {userProgress?.totalLessons ?? 35} Lessons</span>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">
                      TCP/IP Protocol Suite & Handshakes
                    </h2>
                    <p className="text-xs text-zinc-400 max-w-lg mb-6 leading-relaxed">
                      Next up: Interactive 3-way handshake simulation. Dispatch SYN, SYN-ACK, and ACK packets across client and server nodes.
                    </p>

                    <Progress value={userProgress?.overallProgressPercent ?? 0} label="Course Progress" className="mb-6" />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#272732]">
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <Clock className="w-4 h-4 text-[#00f0ff]" />
                      <span>{userProgress?.overallProgressPercent ?? 0}% Complete</span>
                    </div>
                    <Link href="/simulations">
                      <Button variant="cyan" leftIcon={<PlayCircle className="w-4 h-4" />}>
                        Resume Learning
                      </Button>
                    </Link>
                  </div>
                </Card>

                {/* Performance Stats Cards */}
                <div className="lg:col-span-4 grid grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl glass-panel border border-[#272732] flex flex-col justify-between">
                    <BookOpen className="w-6 h-6 text-[#00f0ff] mb-2" />
                    <div>
                      <span className="text-2xl font-bold text-white font-mono block">
                        {userProgress?.completedLessons ?? 0}
                      </span>
                      <span className="text-xs text-zinc-400">Completed Lessons</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl glass-panel border border-[#272732] flex flex-col justify-between">
                    <Zap className="w-6 h-6 text-purple-400 mb-2" />
                    <div>
                      <span className="text-2xl font-bold text-white font-mono block">
                        {userProgress?.simulationsRun ?? 0}
                      </span>
                      <span className="text-xs text-zinc-400">Simulations Run</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl glass-panel border border-[#272732] flex flex-col justify-between">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 mb-2" />
                    <div>
                      <span className="text-2xl font-bold text-white font-mono block">
                        {userProgress?.quizAverageScore ?? 0}%
                      </span>
                      <span className="text-xs text-zinc-400">Quiz Avg Score</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl glass-panel border border-[#272732] flex flex-col justify-between">
                    <Award className="w-6 h-6 text-amber-400 mb-2" />
                    <div>
                      <span className="text-2xl font-bold text-white font-mono block">
                        {userProgress?.certificatesEarned ?? 0}
                      </span>
                      <span className="text-xs text-zinc-400">Certificates Earned</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Grid: Recent Lessons & Achievements */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Recent Lessons */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Recent Lessons & Labs</h3>
                    <Link href="/courses" className="text-xs font-semibold text-[#00f0ff] hover:underline">
                      View Syllabus
                    </Link>
                  </div>

                  <div className="flex flex-col gap-3">
                    {(userProgress?.recentLessons?.length ? userProgress.recentLessons : [
                      { id: '1', title: 'Understanding MAC vs. IP Addresses', courseTitle: 'Networking Fundamentals', durationMinutes: 12, status: 'COMPLETED' },
                      { id: '2', title: 'TCP 3-Way Handshake Simulation', courseTitle: 'TCP/IP Protocol Suite', durationMinutes: 15, status: 'IN_PROGRESS' },
                    ]).map((item: any) => (
                      <div
                        key={item.id}
                        className="glass-panel p-4 rounded-2xl border border-[#272732] hover:border-[#00f0ff]/30 transition-colors flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <RouterIcon size={16} />
                          <div>
                            <h4 className="text-sm font-bold text-white">{item.title}</h4>
                            <span className="text-xs text-zinc-500 font-mono">{item.courseTitle || 'Networking'} • {item.durationMinutes || 15} min</span>
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
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Achievements Showcase */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Earned Badges</h3>
                    <span className="text-xs text-zinc-400 font-mono">
                      {userProgress?.badges?.earned ?? 0} / {userProgress?.badges?.total ?? 5} Unlocked
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {badgeItems.map((ach: any, idx: number) => (
                      <div
                        key={ach.id || idx}
                        className={`p-4 rounded-2xl glass-panel border flex flex-col items-center text-center gap-2 ${
                          ach.unlocked ? 'border-[#00f0ff]/30 bg-[#00f0ff]/5' : 'border-[#272732] opacity-50'
                        }`}
                      >
                        <span className="text-3xl">{ach.badgeIcon === 'Zap' ? '⚡' : ach.badgeIcon === 'CheckSquare' ? '☑️' : ach.badgeIcon === 'Terminal' ? '💻' : ach.badgeIcon === 'CheckCircle2' ? '🎓' : '🏆'}</span>
                        <h4 className="text-xs font-bold text-white">{ach.title || ach.name}</h4>
                        <p className="text-[10px] text-zinc-400">{ach.description || ach.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended Next Lessons */}
              <div className="flex flex-col gap-4 pt-4 border-t border-[#272732]/60">
                <h3 className="text-lg font-bold text-white">Recommended Next For You</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommended.map((rec, idx) => (
                    <div
                      key={idx}
                      className="glass-panel p-6 rounded-2xl border border-[#272732] hover:border-[#00f0ff]/40 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        {rec.icon}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="cyan">{rec.category}</Badge>
                            <span className="text-[11px] font-mono text-zinc-500">{rec.duration}</span>
                          </div>
                          <h4 className="text-sm font-bold text-white group-hover:text-[#00f0ff] transition-colors">
                            {rec.title}
                          </h4>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-[#00f0ff] group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Award, Flame, Trophy, User, ShieldCheck, CheckCircle2, Lock, Zap, AlertTriangle, RefreshCw } from 'lucide-react';
import { getMyAchievementsApi, getUserProgressApi, AchievementItem } from '@/lib/api';
import { PulsePacketLoader } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuthStore } from '@/stores/authStore';

export default function AchievementsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadAchievementsData = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const [achData, progData] = await Promise.all([
        getMyAchievementsApi(),
        getUserProgressApi(),
      ]);
      if (achData?.achievements) {
        setAchievements(achData.achievements);
      }
      if (progData) {
        setUserStats(progData);
      }
    } catch (err: any) {
      console.error('Failed to load achievements data:', err);
      setLoadError(err?.message || 'Failed to load achievements and leaderboard metrics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAchievementsData();
  }, []);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length || 10;
  const totalPoints = achievements.filter((a) => a.unlocked).reduce((sum, a) => sum + a.points, 0);

  const currentLearnerName = user?.fullName || user?.username || (isAuthenticated ? 'Authenticated Learner' : 'Guest Learner');
  const currentLearnerStreak = `${userStats?.studyStreak ?? 0} ${userStats?.studyStreak === 1 ? 'Day' : 'Days'}`;
  const currentLearnerXp = `${totalPoints} XP`;

  return (
    <ProtectedRoute>
      <div className="min-h-screen surface-0 text-[#f4f5f7] flex font-sans">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar />

          <main className="p-4 sm:p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
            {isLoading ? (
              <div className="py-24 flex justify-center items-center">
                <PulsePacketLoader label="Loading Achievement Badges & Learner Standing..." />
              </div>
            ) : loadError ? (
              <div className="p-8 surface-2 rounded-xl border border-[#ef4444]/30 text-center flex flex-col items-center gap-4 max-w-md mx-auto my-auto shadow-instrument">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#f4f5f7] mb-1">Failed to Load Achievements</h3>
                <p className="text-xs text-[#8e95a5] mb-2">{loadError}</p>
                <Button variant="primary" size="sm" onClick={loadAchievementsData} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
                  Retry Connection
                </Button>
              </div>
            ) : (
            <div className="max-w-6xl mx-auto flex flex-col gap-6 sm:gap-8">
              <div>
                <span className="text-xs font-mono text-[#38bdf8] uppercase tracking-widest font-semibold block mb-1">
                  MASTERY & MILESTONES
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#f4f5f7] tracking-tight">
                  Curriculum Achievements
                </h1>
                <p className="text-xs sm:text-sm text-[#8e95a5] mt-1 max-w-xl leading-relaxed">
                  Earned recognition for completing technical milestones, diagnostic labs, and knowledge assessments.
                </p>
              </div>

              {/* User Achievements Summary Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-5 surface-2 border border-[#2a2e39] rounded-xl flex items-center gap-4 shadow-instrument">
                  <div className="w-11 h-11 rounded-lg bg-[#38bdf8]/10 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8] shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#8e95a5] uppercase block">Badges Unlocked</span>
                    <span className="text-xl sm:text-2xl font-bold text-[#f4f5f7] font-mono">{unlockedCount} / {totalCount}</span>
                  </div>
                </Card>

                <Card className="p-5 surface-2 border border-[#2a2e39] rounded-xl flex items-center gap-4 shadow-instrument">
                  <div className="w-11 h-11 rounded-lg bg-[#818cf8]/10 border border-[#818cf8]/30 flex items-center justify-center text-[#818cf8] shrink-0">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#8e95a5] uppercase block">Achievement XP</span>
                    <span className="text-xl sm:text-2xl font-bold text-[#f4f5f7] font-mono">{totalPoints} XP</span>
                  </div>
                </Card>

                <Card className="p-5 surface-2 border border-[#2a2e39] rounded-xl flex items-center gap-4 shadow-instrument">
                  <div className="w-11 h-11 rounded-lg bg-[#f59e0b]/10 border border-[#f59e0b]/30 flex items-center justify-center text-[#f59e0b] shrink-0">
                    <Flame className="w-6 h-6 fill-[#f59e0b]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#8e95a5] uppercase block">Active Streak</span>
                    <span className="text-xl sm:text-2xl font-bold text-[#f4f5f7] font-mono">{userStats?.studyStreak ?? 0} Days</span>
                  </div>
                </Card>
              </div>

              {/* Achievement Badges Catalog Grid */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-[#f4f5f7]">Milestone Badges</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((ach) => (
                    <div
                      key={ach.id}
                      className={`p-5 rounded-xl border transition-all surface-2 shadow-instrument ${
                        ach.unlocked
                          ? 'border-[#38bdf8]/40 bg-[#1b1e26]'
                          : 'border-[#2a2e39] opacity-75'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          ach.unlocked
                            ? 'bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30'
                            : 'bg-[#14151a] text-[#646c7d] border border-[#2a2e39]'
                        }`}>
                          <Award className="w-4 h-4" />
                        </div>
                        <Badge variant={ach.unlocked ? 'cyan' : 'neutral'} dot={ach.unlocked}>
                          {ach.unlocked ? `+${ach.points} XP` : `${ach.points} XP`}
                        </Badge>
                      </div>

                      <h3 className="text-sm font-bold text-[#f4f5f7] mb-1">{ach.title}</h3>
                      <p className="text-xs text-[#8e95a5] leading-relaxed mb-3">{ach.description}</p>

                      <div className="flex items-center justify-between pt-3 border-t border-[#2a2e39] text-[10px] font-mono">
                        <span className="text-[#8e95a5] uppercase">{ach.category}</span>
                        {ach.unlocked ? (
                          <span className="text-[#10b981] flex items-center gap-1 font-bold">
                            <CheckCircle2 className="w-3 h-3" /> UNLOCKED
                          </span>
                        ) : (
                          <span className="text-[#646c7d] flex items-center gap-1">
                            <Lock className="w-3 h-3" /> LOCKED
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal Learner Standing */}
              <Card className="p-5 sm:p-6 surface-2 border border-[#2a2e39] rounded-xl shadow-instrument">
                <div className="flex items-center gap-2 mb-4 border-b border-[#2a2e39] pb-3">
                  <Trophy className="w-5 h-5 text-[#f59e0b]" />
                  <h2 className="text-base sm:text-lg font-bold text-[#f4f5f7]">Learner Standing</h2>
                </div>

                <div className="p-4 rounded-lg bg-[#14151a] border border-[#2a2e39] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-[#818cf8]/10 border border-[#818cf8]/30 flex items-center justify-center text-[#818cf8]">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#f4f5f7]">{currentLearnerName}</h4>
                      <span className="text-xs text-[#8e95a5] font-mono">
                        {isAuthenticated ? (user?.role === 'ADMIN' ? 'Administrator' : 'Active Learner') : 'Guest Session'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 font-mono text-xs">
                    <span className="text-[#f59e0b] flex items-center gap-1">
                      <Flame className="w-4 h-4 fill-[#f59e0b]" /> {currentLearnerStreak}
                    </span>
                    <span className="text-[#38bdf8] font-bold">{currentLearnerXp}</span>
                  </div>
                </div>

                <p className="text-[10px] font-mono text-[#646c7d] mt-3 text-center">
                  Standings reflect server-verified achievement XP and activity streaks for your active session.
                </p>
              </Card>
            </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

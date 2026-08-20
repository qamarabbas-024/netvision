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
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar />

          <main className="p-4 sm:p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
            {isLoading ? (
              <div className="py-24 flex justify-center items-center">
                <PulsePacketLoader label="Loading Achievement Badges & Learner Standing..." />
              </div>
            ) : loadError ? (
              <div className="p-12 glass-panel rounded-3xl border border-rose-500/30 text-center flex flex-col items-center gap-4 max-w-md mx-auto my-auto">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Failed to Load Achievements</h3>
                <p className="text-xs text-zinc-400 mb-2">{loadError}</p>
                <Button variant="cyan" size="sm" onClick={loadAchievementsData} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
                  Retry Connection
                </Button>
              </div>
            ) : (
            <div className="max-w-6xl mx-auto flex flex-col gap-8">
              <div>
                <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest font-semibold block mb-1">
                  Gamification & Mastery
                </span>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  Achievements & Leaderboard
                </h1>
                <p className="text-sm text-zinc-400 mt-1 max-w-xl">
                  Unlock official networking achievement badges through hands-on practice, quiz mastery, and curriculum progression.
                </p>
              </div>

              {/* User Achievements Summary Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-6 glass-panel-glow border-[#00f0ff]/30 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-zinc-400 block">BADGES UNLOCKED</span>
                    <span className="text-2xl font-bold text-white font-mono">{unlockedCount} / {totalCount}</span>
                  </div>
                </Card>

                <Card className="p-6 glass-panel border-[#272732] flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-zinc-400 block">ACHIEVEMENT XP</span>
                    <span className="text-2xl font-bold text-white font-mono">{totalPoints} XP</span>
                  </div>
                </Card>

                <Card className="p-6 glass-panel border-[#272732] flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Flame className="w-6 h-6 fill-amber-400" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-zinc-400 block">ACTIVE STREAK</span>
                    <span className="text-2xl font-bold text-white font-mono">{userStats?.studyStreak ?? 0} Days</span>
                  </div>
                </Card>
              </div>

              {/* Achievement Badges Catalog Grid */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Curriculum Achievement Badges</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((ach) => (
                    <div
                      key={ach.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        ach.unlocked
                          ? 'glass-panel-glow border-[#00f0ff]/40 bg-[#00f0ff]/5'
                          : 'glass-panel border-[#272732] opacity-75'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          ach.unlocked
                            ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40'
                            : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                        }`}>
                          <Award className="w-5 h-5" />
                        </div>
                        <Badge variant={ach.unlocked ? 'cyan' : 'neutral'}>
                          {ach.unlocked ? `+${ach.points} XP` : `${ach.points} XP`}
                        </Badge>
                      </div>

                      <h3 className="text-sm font-bold text-white mb-1">{ach.title}</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed mb-3">{ach.description}</p>

                      <div className="flex items-center justify-between pt-3 border-t border-[#272732] text-[11px] font-mono">
                        <span className="text-zinc-500 uppercase">{ach.category}</span>
                        {ach.unlocked ? (
                          <span className="text-emerald-400 flex items-center gap-1 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                          </span>
                        ) : (
                          <span className="text-zinc-500 flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5" /> Locked
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal Learner Standing & Metrics */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Trophy className="w-6 h-6 text-amber-400" />
                  <h2 className="text-xl font-bold text-white">Your Learner Standing</h2>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="p-4 rounded-xl border bg-[#00f0ff]/10 border-[#00f0ff]/40 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs bg-amber-400 text-black">
                        ★
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{currentLearnerName}</h4>
                        <span className="text-xs text-zinc-500 font-mono">
                          {isAuthenticated ? (user?.role === 'ADMIN' ? 'Administrator' : 'Active Learner') : 'Guest Session'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 font-mono text-xs">
                      <span className="text-amber-400 flex items-center gap-1">
                        <Flame className="w-4 h-4 fill-amber-400" /> {currentLearnerStreak}
                      </span>
                      <span className="text-[#00f0ff] font-bold">{currentLearnerXp}</span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] font-mono text-zinc-500 mt-4 text-center">
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

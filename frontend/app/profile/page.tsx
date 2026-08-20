'use client';

import React, { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/stores/authStore';
import { getUserProgressApi, StudentDashboardMetrics } from '@/lib/api';
import { Flame, Award, BookOpen, Clock, ShieldCheck, User as UserIcon, RefreshCw, AlertTriangle } from 'lucide-react';
import { PulsePacketLoader } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuthStore();
  const [metrics, setMetrics] = useState<StudentDashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadProfileMetrics = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await getUserProgressApi();
      if (data) setMetrics(data);
    } catch (err: any) {
      console.warn('Could not load profile metrics:', err);
      setLoadError(err?.message || 'Failed to sync learner metrics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfileMetrics();
  }, []);

  const displayName = user?.fullName || user?.username || (isAuthenticated ? 'NetVision Learner' : 'Guest Learner');
  const displayHandle = user?.username ? `@${user.username}` : (isAuthenticated ? '@learner' : '@guest');
  const roleLabel = user?.role || (isAuthenticated ? 'STUDENT' : 'GUEST');

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar />

          <main className="p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
            {isLoading ? (
              <div className="py-24 flex justify-center items-center">
                <PulsePacketLoader label="Loading Learner Profile & Metrics..." />
              </div>
            ) : (
            <div className="max-w-6xl mx-auto flex flex-col gap-8">
              {loadError && (
                <div className="p-4 rounded-xl glass-panel border border-amber-500/30 bg-amber-500/5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                    <p className="text-xs text-amber-200">{loadError}</p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={loadProfileMetrics} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
                    Retry
                  </Button>
                </div>
              )}

              {/* Profile Banner */}
              <div className="glass-panel p-8 rounded-3xl border border-[#00f0ff]/30 shadow-glow-cyan flex flex-col sm:flex-row items-center gap-6">
                <Avatar name={displayName} size="lg" status={isAuthenticated ? 'online' : 'offline'} className="w-20 h-20 text-2xl" />
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-2">
                    <h1 className="text-2xl font-extrabold text-white">{displayName}</h1>
                    <Badge variant="cyan">{displayHandle}</Badge>
                    <Badge variant={roleLabel === 'ADMIN' ? 'rose' : 'emerald'}>{roleLabel}</Badge>
                  </div>
                  <p className="text-xs text-zinc-400 font-mono">
                    {isAuthenticated ? 'Authenticated NetVision Learner • Progress Synced' : 'Guest Learner • Local Session'}
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <Card className="p-6 text-center">
                  <Flame className="w-6 h-6 text-amber-400 mx-auto mb-2 fill-amber-400" />
                  <span className="text-2xl font-bold font-mono text-white block">{metrics?.studyStreak ?? 0} Days</span>
                  <span className="text-xs text-zinc-400">Current Streak</span>
                </Card>

                <Card className="p-6 text-center">
                  <Award className="w-6 h-6 text-[#00f0ff] mx-auto mb-2" />
                  <span className="text-2xl font-bold font-mono text-white block">{metrics?.totalXp ?? 0} XP</span>
                  <span className="text-xs text-zinc-400">Total Experience</span>
                </Card>

                <Card className="p-6 text-center">
                  <BookOpen className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <span className="text-2xl font-bold font-mono text-white block">{metrics?.completedLessons ?? 0}</span>
                  <span className="text-xs text-zinc-400">Lessons Completed</span>
                </Card>

                <Card className="p-6 text-center">
                  <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <span className="text-2xl font-bold font-mono text-white block">{metrics?.certificatesEarned ?? 0}</span>
                  <span className="text-xs text-zinc-400">Certificates Earned</span>
                </Card>
              </div>
            </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

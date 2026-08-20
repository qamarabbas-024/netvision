'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';
import { getUserProgressApi, StudentDashboardMetrics } from '@/lib/api';
import { Flame, Award, BookOpen, ShieldCheck, RefreshCw, AlertTriangle, ArrowRight, Lock } from 'lucide-react';
import { PulsePacketLoader } from '@/components/ui/Loading';

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
      <div className="min-h-screen surface-0 text-[#f4f5f7] flex font-sans">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar />

          <main className="p-4 sm:p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
            {isLoading ? (
              <div className="py-24 flex justify-center items-center">
                <PulsePacketLoader label="Loading Learner Profile & Metrics..." />
              </div>
            ) : (
            <div className="max-w-5xl mx-auto flex flex-col gap-6 sm:gap-8">
              {loadError && (
                <div className="p-4 rounded-xl surface-2 border border-[#f59e0b]/30 bg-[#f59e0b]/5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-[#f59e0b] shrink-0" />
                    <p className="text-xs text-[#f59e0b]">{loadError}</p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={loadProfileMetrics} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
                    Retry
                  </Button>
                </div>
              )}

              {/* Profile Header Banner */}
              <div className="surface-2 p-6 sm:p-8 rounded-xl border border-[#2a2e39] shadow-instrument flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <Avatar name={displayName} size="lg" status={isAuthenticated ? 'online' : 'offline'} className="w-20 h-20 text-2xl shrink-0" />
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-2">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-[#f4f5f7] tracking-tight">{displayName}</h1>
                    <Badge variant="cyan" dot={true}>{displayHandle}</Badge>
                    <Badge variant={roleLabel === 'ADMIN' ? 'rose' : 'emerald'}>{roleLabel}</Badge>
                  </div>
                  <p className="text-xs text-[#8e95a5] font-mono leading-relaxed">
                    {isAuthenticated
                      ? `Account verified • Progress synced with NetVision server`
                      : 'Local guest session active • Progress stored in browser storage'}
                  </p>

                  {!isAuthenticated && (
                    <div className="mt-4 pt-4 border-t border-[#2a2e39] flex flex-col sm:flex-row items-center justify-between gap-3">
                      <span className="text-xs text-[#8e95a5]">
                        Create an account to claim your certificates and sync progress across devices.
                      </span>
                      <Link href="/register">
                        <Button variant="primary" size="sm" className="font-bold text-xs shrink-0">
                          Create Free Account
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Overview Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card className="p-4 sm:p-5 surface-2 border border-[#2a2e39] rounded-xl text-center shadow-instrument flex flex-col justify-between">
                  <Flame className="w-5 h-5 text-[#f59e0b] mx-auto mb-2 fill-[#f59e0b]" />
                  <div>
                    <span className="text-xl sm:text-2xl font-bold font-mono text-[#f4f5f7] block">{metrics?.studyStreak ?? 0} Days</span>
                    <span className="text-xs text-[#8e95a5]">Study Streak</span>
                  </div>
                </Card>

                <Card className="p-4 sm:p-5 surface-2 border border-[#2a2e39] rounded-xl text-center shadow-instrument flex flex-col justify-between">
                  <Award className="w-5 h-5 text-[#38bdf8] mx-auto mb-2" />
                  <div>
                    <span className="text-xl sm:text-2xl font-bold font-mono text-[#f4f5f7] block">{metrics?.totalXp ?? 0} XP</span>
                    <span className="text-xs text-[#8e95a5]">Total Experience</span>
                  </div>
                </Card>

                <Card className="p-4 sm:p-5 surface-2 border border-[#2a2e39] rounded-xl text-center shadow-instrument flex flex-col justify-between">
                  <BookOpen className="w-5 h-5 text-[#818cf8] mx-auto mb-2" />
                  <div>
                    <span className="text-xl sm:text-2xl font-bold font-mono text-[#f4f5f7] block">{metrics?.completedLessons ?? 0}</span>
                    <span className="text-xs text-[#8e95a5]">Lessons Completed</span>
                  </div>
                </Card>

                <Card className="p-4 sm:p-5 surface-2 border border-[#2a2e39] rounded-xl text-center shadow-instrument flex flex-col justify-between">
                  <ShieldCheck className="w-5 h-5 text-[#10b981] mx-auto mb-2" />
                  <div>
                    <span className="text-xl sm:text-2xl font-bold font-mono text-[#f4f5f7] block">{metrics?.certificatesEarned ?? 0}</span>
                    <span className="text-xs text-[#8e95a5]">Certificates</span>
                  </div>
                </Card>
              </div>

              {/* Quick Navigation Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/achievements">
                  <div className="surface-2 p-5 rounded-xl border border-[#2a2e39] hover:border-[#38bdf8]/40 hover:bg-[#1f222c] transition-all flex items-center justify-between group cursor-pointer shadow-instrument">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-[#14151a] border border-[#2a2e39] flex items-center justify-center text-[#f59e0b] group-hover:scale-105 transition-transform">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#f4f5f7] group-hover:text-[#38bdf8] transition-colors">Achievements & Badges</h3>
                        <p className="text-xs text-[#8e95a5]">View unlocked curriculum badges and milestones</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#646c7d] group-hover:text-[#38bdf8] group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                </Link>

                <Link href="/certificates">
                  <div className="surface-2 p-5 rounded-xl border border-[#2a2e39] hover:border-[#38bdf8]/40 hover:bg-[#1f222c] transition-all flex items-center justify-between group cursor-pointer shadow-instrument">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-[#14151a] border border-[#2a2e39] flex items-center justify-center text-[#10b981] group-hover:scale-105 transition-transform">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#f4f5f7] group-hover:text-[#38bdf8] transition-colors">Verified Certificates</h3>
                        <p className="text-xs text-[#8e95a5]">Inspect and download official course certificates</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#646c7d] group-hover:text-[#38bdf8] group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                </Link>
              </div>
            </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

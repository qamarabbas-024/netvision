'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/stores/authStore';
import { Calendar, Flame, Award, BookOpen, Clock } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar />

          <main className="p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
            <div className="max-w-6xl mx-auto flex flex-col gap-8">
              {/* Profile Banner */}
              <div className="glass-panel p-8 rounded-3xl border border-[#00f0ff]/30 shadow-glow-cyan flex flex-col sm:flex-row items-center gap-6">
                <Avatar name={user?.username || 'Alex Rivers'} size="lg" status="online" className="w-20 h-20 text-2xl" />
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-2">
                    <h1 className="text-2xl font-extrabold text-white">{user?.fullName || 'Alex Rivers'}</h1>
                    <Badge variant="cyan">@{user?.username || 'alex_netrunner'}</Badge>
                    <Badge variant="emerald">{user?.role || 'STUDENT'}</Badge>
                  </div>
                  <p className="text-xs text-zinc-400 font-mono">
                    Member since August 2026 • Computer Science Major
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <Card className="p-6 text-center">
                  <Flame className="w-6 h-6 text-amber-400 mx-auto mb-2 fill-amber-400" />
                  <span className="text-2xl font-bold font-mono text-white block">7 Days</span>
                  <span className="text-xs text-zinc-400">Current Streak</span>
                </Card>

                <Card className="p-6 text-center">
                  <Award className="w-6 h-6 text-[#00f0ff] mx-auto mb-2" />
                  <span className="text-2xl font-bold font-mono text-white block">1,450 XP</span>
                  <span className="text-xs text-zinc-400">Total Experience</span>
                </Card>

                <Card className="p-6 text-center">
                  <BookOpen className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <span className="text-2xl font-bold font-mono text-white block">18</span>
                  <span className="text-xs text-zinc-400">Lessons Completed</span>
                </Card>

                <Card className="p-6 text-center">
                  <Clock className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <span className="text-2xl font-bold font-mono text-white block">24 hrs</span>
                  <span className="text-xs text-zinc-400">Study Time</span>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

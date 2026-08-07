'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Award, Flame, Trophy, User } from 'lucide-react';

export default function AchievementsPage() {
  const leaderboard = [
    { rank: 1, name: 'Alex Rivers', xp: '4,850 XP', streak: '14 Days', level: 'Lvl 8' },
    { rank: 2, name: 'Elena Rostova', xp: '4,200 XP', streak: '12 Days', level: 'Lvl 7' },
    { rank: 3, name: 'Marcus Vance', xp: '3,950 XP', streak: '9 Days', level: 'Lvl 6' },
    { rank: 4, name: 'Sarah Chen', xp: '3,600 XP', streak: '7 Days', level: 'Lvl 6' },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar />

          <main className="p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
            <div className="max-w-6xl mx-auto flex flex-col gap-8">
              <div>
                <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest font-semibold block mb-1">
                  Gamification & XP Rankings
                </span>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  Leaderboard & Achievements
                </h1>
              </div>

              {/* Global Leaderboard Table */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Trophy className="w-6 h-6 text-amber-400" />
                  <h2 className="text-xl font-bold text-white">Global Learner Standings</h2>
                </div>

                <div className="flex flex-col gap-3">
                  {leaderboard.map((u) => (
                    <div
                      key={u.rank}
                      className={`p-4 rounded-xl border flex items-center justify-between ${
                        u.rank === 1 ? 'bg-[#00f0ff]/10 border-[#00f0ff]/40' : 'bg-[#181820] border-[#272732]'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs ${u.rank === 1 ? 'bg-amber-400 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                          #{u.rank}
                        </span>
                        <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{u.name}</h4>
                          <span className="text-xs text-zinc-500 font-mono">{u.level}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 font-mono text-xs">
                        <span className="text-amber-400 flex items-center gap-1">
                          <Flame className="w-4 h-4 fill-amber-400" /> {u.streak}
                        </span>
                        <span className="text-[#00f0ff] font-bold">{u.xp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

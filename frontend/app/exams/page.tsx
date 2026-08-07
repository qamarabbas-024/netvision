'use client';

import React from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Clock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function ExamsPage() {
  const exams = [
    {
      title: 'NetVision Certified Network Associate (NCNA)',
      level: 'Level 1 Foundation',
      questions: 30,
      duration: '45 mins',
      passingScore: '80%',
      icon: <ShieldCheck className="w-8 h-8 text-[#00f0ff]" />,
    },
    {
      title: 'NetVision Certified Subnetting & Routing Professional',
      level: 'Level 2 Intermediate',
      questions: 40,
      duration: '60 mins',
      passingScore: '85%',
      icon: <ShieldCheck className="w-8 h-8 text-purple-400" />,
    },
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
                  Timed Certification Practice
                </span>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  Certification Exam Simulator
                </h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {exams.map((ex, idx) => (
                  <Card key={idx} className="p-8 glass-panel-glow border-[#00f0ff]/30 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="cyan">{ex.level}</Badge>
                        <span className="text-xs font-mono text-zinc-400">Pass Score: {ex.passingScore}</span>
                      </div>

                      <div className="flex items-center gap-4 mb-4">
                        {ex.icon}
                        <h3 className="text-xl font-bold text-white">{ex.title}</h3>
                      </div>

                      <div className="flex items-center gap-6 text-xs text-zinc-400 font-mono mb-8">
                        <span>{ex.questions} Questions</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-[#00f0ff]" />
                          <span>{ex.duration}</span>
                        </div>
                      </div>
                    </div>

                    <Link href="/courses">
                      <Button variant="cyan" size="lg" className="w-full" rightIcon={<ArrowRight className="w-5 h-5" />}>
                        Start Exam Simulation
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

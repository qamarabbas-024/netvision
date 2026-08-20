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
      icon: <ShieldCheck className="w-7 h-7 text-[#38bdf8]" />,
    },
    {
      title: 'NetVision Certified Subnetting & Routing Professional',
      level: 'Level 2 Intermediate',
      questions: 40,
      duration: '60 mins',
      passingScore: '85%',
      icon: <ShieldCheck className="w-7 h-7 text-[#818cf8]" />,
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen surface-0 text-[#f4f5f7] flex font-sans">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar />

          <main className="p-4 sm:p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
            <div className="max-w-6xl mx-auto flex flex-col gap-6 sm:gap-8">
              <div>
                <span className="text-xs font-mono text-[#38bdf8] uppercase tracking-widest font-semibold block mb-1">
                  TIMED CERTIFICATION PRACTICE
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#f4f5f7] tracking-tight">
                  Certification Exam Simulator
                </h1>
                <p className="text-xs sm:text-sm text-[#8e95a5] mt-1 max-w-xl leading-relaxed">
                  Timed comprehensive evaluations testing end-to-end theoretical principles, topology configuration, and packet analysis.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {exams.map((ex, idx) => (
                  <Card key={idx} className="p-6 sm:p-8 surface-2 border border-[#2a2e39] rounded-xl flex flex-col justify-between shadow-instrument">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="cyan" dot={true}>{ex.level}</Badge>
                        <span className="text-xs font-mono text-[#8e95a5]">Passing Score: {ex.passingScore}</span>
                      </div>

                      <div className="flex items-center gap-3.5 mb-4">
                        <div className="w-11 h-11 rounded-lg bg-[#14151a] border border-[#2a2e39] flex items-center justify-center shrink-0">
                          {ex.icon}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-[#f4f5f7] leading-snug">{ex.title}</h3>
                      </div>

                      <div className="flex items-center gap-6 text-xs text-[#8e95a5] font-mono mb-6">
                        <span>{ex.questions} Questions</span>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#38bdf8]" />
                          <span>{ex.duration}</span>
                        </div>
                      </div>
                    </div>

                    <Link href="/courses">
                      <Button variant="primary" size="md" className="w-full justify-center font-bold text-xs shadow-sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
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

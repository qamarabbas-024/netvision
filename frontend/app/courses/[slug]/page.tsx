'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { RouterIcon, SwitchIcon, PacketIcon } from '@/components/ui/Icons';
import { PlayCircle, CheckCircle2, Clock, BookOpen, Award, ArrowRight, ArrowLeft } from 'lucide-react';

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const courseData = {
    title: 'TCP/IP Protocol Suite & Handshakes',
    slug: 'tcp-ip-protocol-suite',
    tagline: 'Master packet encapsulation, IP addressing, TCP handshakes, and ICMP Ping.',
    level: 'BEGINNER' as const,
    estimatedHours: 8,
    progress: 65,
    modules: [
      {
        id: 'mod-1',
        title: 'Module 1: IP Packet Framing & Headers',
        description: 'Understand IPv4 vs. IPv6 packet headers, TTL expiration, and payload structure.',
        lessons: [
          { id: 'les-1', title: '1.1 Introduction to IP Packets', type: 'THEORY', duration: '10 min', completed: true },
          { id: 'les-2', title: '1.2 Unpacking IP Header Fields', type: 'ANIMATION', duration: '12 min', completed: true },
          { id: 'les-3', title: '1.3 TTL Expiration Lab', type: 'INTERACTIVE_SIMULATION', duration: '15 min', completed: true },
        ],
      },
      {
        id: 'mod-2',
        title: 'Module 2: TCP 3-Way Handshake',
        description: 'Simulate connection establishment using SYN, SYN-ACK, and ACK flags.',
        lessons: [
          { id: 'les-4', title: '2.1 TCP vs. UDP Connection Models', type: 'THEORY', duration: '12 min', completed: true },
          { id: 'les-5', title: '2.2 Interactive Handshake Simulator', type: 'INTERACTIVE_SIMULATION', duration: '20 min', completed: false, active: true },
          { id: 'les-6', title: '2.3 Connection Teardown (FIN/ACK)', type: 'ANIMATION', duration: '10 min', completed: false },
          { id: 'les-7', title: '2.4 Module 2 Assessment Quiz', type: 'QUIZ', duration: '15 min', completed: false },
        ],
      },
      {
        id: 'mod-3',
        title: 'Module 3: ICMP Ping & Diagnostic Tools',
        description: 'Build ICMP Echo Request and Echo Reply packet flows across multi-hop networks.',
        lessons: [
          { id: 'les-8', title: '3.1 How Ping Works Under the Hood', type: 'THEORY', duration: '10 min', completed: false },
          { id: 'les-9', title: '3.2 Multi-Hop Ping Sandbox', type: 'SANDBOX_LAB', duration: '25 min', completed: false },
        ],
      },
    ],
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar />

          <main className="p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
            <div className="max-w-6xl mx-auto flex flex-col gap-8">
              {/* Back Button */}
              <Link href="/courses" className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-[#00f0ff] transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Course Catalog
              </Link>

              {/* Course Header Banner */}
              <div className="glass-panel p-8 rounded-3xl border border-[#00f0ff]/30 shadow-glow-cyan flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="cyan">{courseData.level}</Badge>
                    <span className="text-xs font-mono text-zinc-400">{courseData.estimatedHours} Hours Total</span>
                  </div>

                  <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">{courseData.title}</h1>
                  <p className="text-sm text-zinc-400 max-w-xl mb-6">{courseData.tagline}</p>

                  <Progress value={courseData.progress} label="Overall Completion" className="max-w-md" />
                </div>

                <Link href={`/courses/${slug}/lessons/tcp-handshake-simulation`}>
                  <Button variant="cyan" size="lg" leftIcon={<PlayCircle className="w-5 h-5" />}>
                    Resume Active Lesson
                  </Button>
                </Link>
              </div>

              {/* Syllabus Module List */}
              <div className="flex flex-col gap-6">
                <h2 className="text-xl font-bold text-white tracking-tight">Course Syllabus & Modules</h2>

                {courseData.modules.map((mod) => (
                  <Card key={mod.id} className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-white mb-1">{mod.title}</h3>
                      <p className="text-xs text-zinc-400">{mod.description}</p>
                    </div>

                    <div className="flex flex-col gap-3">
                      {mod.lessons.map((les) => (
                        <div
                          key={les.id}
                          className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                            les.active
                              ? 'bg-[#00f0ff]/10 border-[#00f0ff]/40 shadow-glow-cyan'
                              : les.completed
                              ? 'bg-emerald-500/5 border-emerald-500/20'
                              : 'bg-[#181820]/60 border-[#272732]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {les.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                            ) : les.active ? (
                              <PlayCircle className="w-5 h-5 text-[#00f0ff] shrink-0 animate-pulse" />
                            ) : (
                              <Clock className="w-5 h-5 text-zinc-500 shrink-0" />
                            )}

                            <div>
                              <h4 className="text-sm font-semibold text-white">{les.title}</h4>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Badge variant="neutral">{les.type}</Badge>
                                <span className="text-[11px] font-mono text-zinc-500">{les.duration}</span>
                              </div>
                            </div>
                          </div>

                          <Link href={`/courses/${slug}/lessons/tcp-handshake-simulation`}>
                            <Button variant={les.active ? 'cyan' : 'ghost'} size="sm">
                              {les.completed ? 'Review' : les.active ? 'Continue' : 'Start'}
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
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

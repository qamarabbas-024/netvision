'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Layers, Box, Activity, Zap, ShieldCheck, Award } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Layers className="w-6 h-6 text-[#00f0ff]" />,
      glow: 'cyan' as const,
      title: 'Interactive 60 FPS Simulations',
      desc: 'Step-by-step visual animation of DNS lookup, ARP table resolution, TCP handshakes, and ICMP Ping.',
    },
    {
      icon: <Box className="w-6 h-6 text-blue-400" />,
      glow: 'blue' as const,
      title: 'Drag & Drop Sandbox Lab',
      desc: 'Connect PCs, Routers, Switches, and Firewalls in a full-featured visual topology builder.',
    },
    {
      icon: <Activity className="w-6 h-6 text-purple-400" />,
      glow: 'purple' as const,
      title: 'Visual Packet Header Inspector',
      desc: 'Pause moving packets to unpack Layer 2 MAC addresses, Layer 3 IP routing, and Layer 4 Ports.',
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      glow: 'none' as const,
      title: 'Bite-Sized 5-Minute Lessons',
      desc: 'Learn complex concepts without text overload through guided visual intuition prompts.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-rose-400" />,
      glow: 'none' as const,
      title: 'Network Break & Repair Scenarios',
      desc: 'Master real troubleshooting by diagnosing and repairing broken subnet masks and blocked ports.',
    },
    {
      icon: <Award className="w-6 h-6 text-emerald-400" />,
      glow: 'emerald' as const,
      title: 'Verifiable Certificates',
      desc: 'Earn shareable cryptographic certificates upon completing course pathways and passing quizzes.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-net-grid-pattern relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest font-semibold mb-2 block">
            Engineered For Visual Intuition
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3 font-sans">
            Core Learning Engine Features
          </h2>
          <p className="text-zinc-300 text-sm font-sans">
            Replace abstract textbook diagrams with interactive simulations, real terminal commands, and immediate feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((f, idx) => (
            <Card key={idx} glowColor={f.glow} interactive className="p-6">
              <CardHeader className="mb-2">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 shrink-0">
                  {f.icon}
                </div>
                <CardTitle className="text-base font-bold text-white mb-1.5 font-sans">{f.title}</CardTitle>
                <CardDescription className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">{f.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

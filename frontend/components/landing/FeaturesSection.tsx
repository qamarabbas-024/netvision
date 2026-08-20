'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Layers, Box, Activity, Zap, ShieldCheck, Award } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Layers className="w-5 h-5 text-[#38bdf8]" />,
      title: 'Interactive 60 FPS Simulations',
      desc: 'Step-by-step visual animation of DNS lookup, ARP table resolution, TCP handshakes, and ICMP Ping.',
    },
    {
      icon: <Box className="w-5 h-5 text-[#60a5fa]" />,
      title: 'Drag & Drop Sandbox Lab',
      desc: 'Connect PCs, Routers, Switches, and Firewalls in a full-featured visual topology builder.',
    },
    {
      icon: <Activity className="w-5 h-5 text-[#a78bfa]" />,
      title: 'Visual Packet Header Inspector',
      desc: 'Pause moving packets to unpack Layer 2 MAC addresses, Layer 3 IP routing, and Layer 4 Ports.',
    },
    {
      icon: <Zap className="w-5 h-5 text-[#fbbf24]" />,
      title: 'Bite-Sized 5-Minute Lessons',
      desc: 'Learn complex concepts without text overload through guided visual intuition prompts.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#f87171]" />,
      title: 'Network Break & Repair Scenarios',
      desc: 'Master real troubleshooting by diagnosing and repairing broken subnet masks and blocked ports.',
    },
    {
      icon: <Award className="w-5 h-5 text-[#34d399]" />,
      title: 'Verifiable Certificates',
      desc: 'Earn shareable cryptographic certificates upon completing course pathways and passing quizzes.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-net-grid-pattern relative surface-0 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-mono text-[#38bdf8] uppercase tracking-widest font-semibold mb-2 block">
            ENGINEERED FOR VISUAL INTUITION
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f4f5f7] tracking-tight mb-3">
            Core Learning Engine Features
          </h2>
          <p className="text-[#8e95a5] text-sm leading-relaxed">
            Replace abstract textbook diagrams with interactive simulations, real terminal commands, and immediate feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {features.map((f, idx) => (
            <Card key={idx} interactive className="p-5">
              <CardHeader className="mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#14151a] border border-[#2a2e39] flex items-center justify-center mb-3.5 shrink-0">
                  {f.icon}
                </div>
                <CardTitle className="text-base font-bold text-[#f4f5f7] mb-1.5">{f.title}</CardTitle>
                <CardDescription className="text-xs text-[#8e95a5] leading-relaxed">{f.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

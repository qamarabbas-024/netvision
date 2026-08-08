'use client';

import React from 'react';
import Link from 'next/link';
import { Cpu, Layers, GraduationCap, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function DocsIndexPage() {
  const docs = [
    {
      title: 'Platform Architecture Specification',
      slug: 'architecture',
      icon: <Cpu className="w-6 h-6 text-[#00f0ff]" />,
      desc: 'Monorepo architecture, NestJS REST API, Prisma PostgreSQL schema, JWT session persistence, and security boundary isolation.',
    },
    {
      title: 'NetVision Design System',
      slug: 'design-system',
      icon: <Layers className="w-6 h-6 text-purple-400" />,
      desc: 'Dark theme tokens, glassmorphism UI components, cyan glow visual indicators, typography standards, and state animations.',
    },
    {
      title: 'Visual Pedagogy Blueprint',
      slug: 'pedagogy-blueprint',
      icon: <GraduationCap className="w-6 h-6 text-emerald-400" />,
      desc: 'The 13-step teaching methodology: Hard concept -> Simple explanation -> Interactive visual -> Real networking CLI & packet values -> 80% Quiz mastery.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] p-8 bg-net-grid-pattern">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        <div className="flex items-center justify-between border-b border-[#272732] pb-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00f0ff] to-[#3b82f6] flex items-center justify-center shadow-glow-cyan">
              <Cpu className="w-6 h-6 text-black font-bold" />
            </div>
            <span className="font-extrabold text-2xl text-white">
              Net<span className="text-[#00f0ff]">Vision</span> Documentation
            </span>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-white">NetVision Platform Documentation</h1>
          <p className="text-sm text-zinc-400 mt-2">
            Explore comprehensive architectural blueprints, design system specifications, and our core visual learning pedagogy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {docs.map((d) => (
            <Card key={d.slug} className="p-6 flex flex-col justify-between glass-panel border-[#272732] hover:border-[#00f0ff]/40 transition-all">
              <div className="flex flex-col gap-4">
                <div className="p-3 rounded-2xl bg-white/5 w-fit">{d.icon}</div>
                <h2 className="text-lg font-bold text-white leading-snug">{d.title}</h2>
                <p className="text-xs text-zinc-400 leading-relaxed">{d.desc}</p>
              </div>
              <Link href={`/docs/${d.slug}`} className="mt-6">
                <Button variant="cyan" size="sm" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Explore Document
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

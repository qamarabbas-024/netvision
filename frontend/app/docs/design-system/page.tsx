'use client';

import React from 'react';
import Link from 'next/link';
import { Layers, ArrowLeft, Palette, Sparkles, Layout } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function DesignSystemDocPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] p-8 bg-net-grid-pattern">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <div className="flex items-center justify-between border-b border-[#272732] pb-6">
          <Link href="/docs" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Back to Documentation
          </Link>
          <span className="text-xs font-mono text-purple-400 uppercase font-semibold">Design System</span>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Layers className="w-8 h-8 text-purple-400" /> NetVision Design System Specification
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Visual tokens, glassmorphism panel standards, color palettes, micro-interactions, and typography hierarchy powering the NetVision interactive laboratory.
          </p>
        </div>

        <Card className="p-8 glass-panel border-[#272732] flex flex-col gap-6">
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#00f0ff]" /> 1. Color Tokens & Aesthetic Palette
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#09090b] border border-[#272732] flex flex-col gap-1">
                <div className="w-full h-8 rounded-lg bg-[#00f0ff] mb-1" />
                <span className="text-xs font-bold text-white">Cyan Glow</span>
                <span className="text-[10px] font-mono text-zinc-500">#00F0FF</span>
              </div>
              <div className="p-4 rounded-xl bg-[#09090b] border border-[#272732] flex flex-col gap-1">
                <div className="w-full h-8 rounded-lg bg-[#3b82f6] mb-1" />
                <span className="text-xs font-bold text-white">Electric Blue</span>
                <span className="text-[10px] font-mono text-zinc-500">#3B82F6</span>
              </div>
              <div className="p-4 rounded-xl bg-[#09090b] border border-[#272732] flex flex-col gap-1">
                <div className="w-full h-8 rounded-lg bg-emerald-400 mb-1" />
                <span className="text-xs font-bold text-white">Emerald Pass</span>
                <span className="text-[10px] font-mono text-zinc-500">#34D399</span>
              </div>
              <div className="p-4 rounded-xl bg-[#09090b] border border-[#272732] flex flex-col gap-1">
                <div className="w-full h-8 rounded-lg bg-rose-500 mb-1" />
                <span className="text-xs font-bold text-white">Rose Alert</span>
                <span className="text-[10px] font-mono text-zinc-500">#F43F5E</span>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-3 pt-6 border-t border-[#272732]">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" /> 2. Component Badges & Variants
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="cyan">Cyan Token</Badge>
              <Badge variant="emerald">Verified Active</Badge>
              <Badge variant="rose">Admin Access</Badge>
              <Badge variant="purple">Interactive Lab</Badge>
              <Badge variant="amber">Protocol State</Badge>
            </div>
          </section>

          <section className="flex flex-col gap-3 pt-6 border-t border-[#272732]">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layout className="w-5 h-5 text-indigo-400" /> 3. Glassmorphism & Micro-Interactions
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Every panel utilizes semi-transparent backdrop blur (`glass-panel`), fine borders (`#272732`), and hover glow transitions (`shadow-glow-cyan`) to create a state-of-the-art laboratory environment.
            </p>
          </section>
        </Card>
      </div>
    </div>
  );
}

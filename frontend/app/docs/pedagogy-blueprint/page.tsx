'use client';

import React from 'react';
import Link from 'next/link';
import { GraduationCap, ArrowLeft, CheckCircle2, Target, Zap } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export default function PedagogyBlueprintDocPage() {
  const steps = [
    '1. What is it?',
    '2. Why does it exist?',
    '3. What problem does it solve?',
    '4. Simple explanation',
    '5. Real-world analogy',
    '6. Interactive visualization',
    '7. Technical explanation',
    '8. Real networking example',
    '9. Important technical values',
    '10. Common mistakes',
    '11. Mini knowledge check',
    '12. Summary',
    '13. Final assessment (80% Mastery Threshold)',
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] p-8 bg-net-grid-pattern">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <div className="flex items-center justify-between border-b border-[#272732] pb-6">
          <Link href="/docs" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Back to Documentation
          </Link>
          <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">Pedagogy Blueprint</span>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-emerald-400" /> NetVision Educational Pedagogy Blueprint
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Our structured 13-stage beginner learning formula, protocol-specific visual state machines, technical data callouts, and 80% score mastery enforcement.
          </p>
        </div>

        <Card className="p-8 glass-panel border-[#272732] flex flex-col gap-6">
          <section className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-[#00f0ff]" /> 1. The 13-Step Lesson Teaching Structure
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              To eliminate giant academic text blocks, every beginner networking lesson strictly adheres to this 13-step teaching progression:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {steps.map((s, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-3 pt-6 border-t border-[#272732]">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" /> 2. Technical Data & Command Callouts
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Useful technical numbers, IP/MAC addresses, TCP ports, Wireshark packet fields, and CLI commands are never buried inside paragraphs. They receive dedicated visual code cards with one-click copy buttons.
            </p>
          </section>

          <section className="flex flex-col gap-3 pt-6 border-t border-[#272732]">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-purple-400" /> 3. 80% Assessment Pass Threshold
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Assessment quizzes require an 80% minimum score to record lesson completion in the database. Wrong answers receive clear, instructive feedback identifying student misconceptions without misleading positive messages.
            </p>
          </section>
        </Card>
      </div>
    </div>
  );
}

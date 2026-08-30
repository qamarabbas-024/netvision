'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Layers, Globe, Shield, Terminal } from 'lucide-react';
import { CURRICULUM_STEPS, CurriculumStep } from '@/data/curriculumData';
import { CourseModal } from './CourseModal';

interface CurriculumSectionProps {
  onStartLab: () => void;
}

export const CurriculumSection: React.FC<CurriculumSectionProps> = ({ onStartLab }) => {
  const [selectedStep, setSelectedStep] = useState<CurriculumStep | null>(null);

  const featuredCourses = [
    {
      code: 'NET-101',
      slug: 'net-101-digital-foundations',
      level: 'FOUNDATIONAL',
      levelColor: 'text-[#38bdf8] bg-[#0284c7]/15 border-[#0284c7]/30',
      icon: <Layers className="w-4 h-4 text-[#38bdf8]" />,
      title: 'Digital & Physical Foundations',
      summary: 'Understand the core concepts of digital communications, signal processing, and basic electronics.',
      bullets: [
        'Network layers in OSI model',
        'Cohesive packet flow & fiber physics',
      ],
      stepNumber: '01',
    },
    {
      code: 'NET-201',
      slug: 'net-201-layer2-ethernet',
      level: 'BEGINNER',
      levelColor: 'text-[#34d399] bg-[#10b981]/15 border-[#10b981]/30',
      icon: <Terminal className="w-4 h-4 text-[#34d399]" />,
      title: 'Network Architecture & Frameworks',
      summary: 'Explore the design of scalable, resilient networks and the application of modern architectural principles.',
      bullets: [
        'Understanding the layered frame design',
        'Routing metrics & IPv4/IPv6 addressing',
      ],
      stepNumber: '02',
    },
    {
      code: 'NET-301',
      slug: 'net-301-vlan-switching',
      level: 'BEGINNER',
      levelColor: 'text-[#34d399] bg-[#10b981]/15 border-[#10b981]/30',
      icon: <Globe className="w-4 h-4 text-[#34d399]" />,
      title: 'IPv4 Addressing & Classless Subnetting',
      summary: 'Master the principles of IPv4 addressing, variable length subnet masks (VLSM), and efficient network planning.',
      bullets: [
        'Calculate IP / SM / CIDR notation in real time',
        'Design scalable subnets & routing tables',
      ],
      stepNumber: '03',
    },
    {
      code: 'NET-401',
      slug: 'net-401-bgp-routing',
      level: 'ADVANCED',
      levelColor: 'text-[#f87171] bg-[#ef4444]/15 border-[#ef4444]/30',
      icon: <Shield className="w-4 h-4 text-[#f87171]" />,
      title: 'Autonomous & Cloud Networking',
      summary: 'Deep-dive into autonomous systems, BGP routing protocols, overlay networks, and zero-trust perimeter defense.',
      bullets: [
        'Multi-hop BGP route tables',
        'VXLAN programmable packet filtering',
      ],
      stepNumber: '04',
    },
  ];

  return (
    <section id="structured-curriculum-pathway" className="relative w-full bg-[#0b0f17] border-b border-[#1e293b]/70 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-bold font-mono text-[#38bdf8] uppercase tracking-wider">
              SCATTER 07 // NEXT GEN ACTUAL STUDY
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              The Seven-Stage Mastery Pathway
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-normal">
              The seven-step track teaches complex networking topologies and scenarios that build solid intuition from protocol needs all the way to enterprise-grade cloud architecture.
            </p>
          </div>

          <Link
            href="/courses"
            className="px-4 py-2.5 rounded-xl bg-[#0f172a] border border-[#10b981]/40 text-[#34d399] hover:bg-[#10b981]/15 text-xs font-mono font-bold transition-all flex items-center gap-2 self-start md:self-end shrink-0"
          >
            <span>Explore Full Courses Catalog</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Featured Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredCourses.map((course) => (
            <div
              key={course.code}
              onClick={() => {
                const step = CURRICULUM_STEPS.find((s) => s.stepNumber === course.stepNumber) || CURRICULUM_STEPS[0];
                setSelectedStep(step);
              }}
              className="group relative bg-[#0f172a]/90 hover:bg-[#111c30] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between shadow-lg"
            >
              <div>
                {/* Header Tag Row */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                  <span className="text-xs font-mono font-bold text-slate-300">
                    {course.code}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full border text-[10px] font-mono font-bold flex items-center gap-1 ${course.levelColor}`}>
                    <span>•</span>
                    <span>{course.level}</span>
                  </span>
                </div>

                {/* Icon box */}
                <div className="w-8 h-8 rounded-lg bg-[#090d16] border border-slate-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  {course.icon}
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-100 group-hover:text-white leading-snug mb-2">
                  {course.title}
                </h3>

                {/* Summary */}
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                  {course.summary}
                </p>

                {/* Bullets */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                  {course.bullets.map((b, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 shrink-0 mt-1.5" />
                      <span className="leading-snug">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono">
                <span className="text-[#38bdf8] group-hover:text-[#22d3ee] font-semibold flex items-center gap-1">
                  <span>Start Module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-[10px] text-slate-500">
                  Hands On Labs Included
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Course Modal */}
      <CourseModal
        step={selectedStep}
        onClose={() => setSelectedStep(null)}
        onStartLab={onStartLab}
      />
    </section>
  );
};

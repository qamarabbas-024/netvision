'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Layers, Globe, Shield, Terminal, Cpu, Award } from 'lucide-react';
import { CURRICULUM_STEPS, CurriculumStep } from '@/data/curriculumData';
import { FLAGSHIP_5_COURSES } from '@netvision/shared';
import { CourseModal } from './CourseModal';

interface CurriculumSectionProps {
  onStartLab: () => void;
}

export const CurriculumSection: React.FC<CurriculumSectionProps> = ({ onStartLab }) => {
  const [selectedStep, setSelectedStep] = useState<CurriculumStep | null>(null);

  const featuredCourses = [
    {
      code: 'NV-C01',
      slug: 'foundations-network-architecture',
      image: '/courses/net-101.png',
      level: 'FOUNDATIONAL',
      levelColor: 'text-[#38bdf8] bg-[#0284c7]/15 border-[#0284c7]/30',
      icon: <Layers className="w-4 h-4 text-[#38bdf8]" />,
      title: 'Foundations & Network Architecture',
      summary: 'Understand core digital communications, binary arithmetic, signal processing, and layered reference models.',
      bullets: [
        'Binary, hex & physical signal representation',
        'Layered OSI 7-layer & TCP/IP PDU encapsulation',
      ],
      stepNumber: '01',
    },
    {
      code: 'NV-C02',
      slug: 'ethernet-switching-ip-networking',
      image: '/courses/net-201.png',
      level: 'BEGINNER',
      levelColor: 'text-[#34d399] bg-[#10b981]/15 border-[#10b981]/30',
      icon: <Terminal className="w-4 h-4 text-[#34d399]" />,
      title: 'Ethernet, Switching & IP Networking',
      summary: 'Master Layer 2 Ethernet framing, enterprise VLANs, Spanning Tree loop prevention, and IPv4 CIDR subnetting.',
      bullets: [
        'Ethernet 802.3 headers, MAC learning & STP loop prevention',
        'IPv4 binary addressing, CIDR prefixes & VLSM calculations',
      ],
      stepNumber: '02',
    },
    {
      code: 'NV-C03',
      slug: 'transport-routing-network-services',
      image: '/courses/net-301.png',
      level: 'INTERMEDIATE',
      levelColor: 'text-[#38bdf8] bg-[#0284c7]/15 border-[#0284c7]/30',
      icon: <Globe className="w-4 h-4 text-[#38bdf8]" />,
      title: 'Transport, Routing & Network Services',
      summary: 'Master core IP services (ARP, DNS, DHCP), TCP/UDP transport sockets, static routing, and OSPFv2 dynamic routing.',
      bullets: [
        'ARP, ICMP, DNS resolution & DHCP DORA leases',
        'TCP 3-way handshakes, static routes & OSPFv2 SPF convergence',
      ],
      stepNumber: '03',
    },
    {
      code: 'NV-C04',
      slug: 'network-security-secure-connectivity',
      image: '/courses/net-401.png',
      level: 'INTERMEDIATE',
      levelColor: 'text-[#f59e0b] bg-[#f59e0b]/15 border-[#f59e0b]/30',
      icon: <Shield className="w-4 h-4 text-[#f59e0b]" />,
      title: 'Network Security & Secure Connectivity',
      summary: 'Master perimeter firewalls, IPv4 ACLs, NAT/PAT translation, and site-to-site IPsec VPN encryption.',
      bullets: [
        'Standard & extended ACLs with stateful connection tracking',
        'NAT/PAT translation pools & IPsec cryptographic tunnels',
      ],
      stepNumber: '04',
    },
    {
      code: 'NV-C05',
      slug: 'network-engineering-automation-troubleshooting',
      image: '/courses/net-201.png',
      level: 'ADVANCED',
      levelColor: 'text-[#f87171] bg-[#ef4444]/15 border-[#ef4444]/30',
      icon: <Cpu className="w-4 h-4 text-[#f87171]" />,
      title: 'Network Engineering, Automation & Diagnostics',
      summary: 'Master Wireshark PCAP packet inspection, multi-layer incident diagnostics, and Python NetDevOps automation.',
      bullets: [
        'Raw PCAP packet stream forensics & TCP window anomalies',
        'Multi-layer incident workflows & programmatic network automation',
      ],
      stepNumber: '05',
    },
  ];

  return (
    <section id="structured-curriculum-pathway" className="relative w-full bg-[#0b0f17] border-b border-[#1e293b]/70 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-bold font-mono text-[#38bdf8] uppercase tracking-wider">
              CANONICAL CURRICULUM // 5 FLAGSHIP SPECIALIZATIONS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              The Flagship Certification Pathway
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              A comprehensive progressive track across five foundational to advanced networking programs—culminating in the Master Capstone examination.
            </p>
          </div>

          <Link
            href="/courses"
            className="px-4 py-2.5 rounded-xl bg-[#0f172a] border border-[#10b981]/40 text-[#34d399] hover:bg-[#10b981]/15 text-xs font-mono font-bold transition-all flex items-center gap-2 self-start md:self-end shrink-0 cursor-pointer"
          >
            <span>Explore Full Courses Catalog</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 5 Flagship Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
          {featuredCourses.map((course) => (
            <div
              key={course.code}
              onClick={() => {
                const step = CURRICULUM_STEPS.find((s) => s.code === course.code) || CURRICULUM_STEPS[0];
                setSelectedStep(step);
              }}
              className="group relative bg-[#0f172a]/90 hover:bg-[#111c30] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between shadow-lg overflow-hidden"
            >
              <div>
                {/* Course Visual Banner */}
                <div className="relative w-full h-28 mb-4 rounded-xl overflow-hidden border border-slate-800/80 bg-[#070a10] flex items-center justify-center">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
                  
                  {/* Floating Tag */}
                  <span className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full border text-[10px] font-mono font-bold flex items-center gap-1 backdrop-blur-md ${course.levelColor}`}>
                    <span>•</span>
                    <span>{course.level}</span>
                  </span>
                </div>

                {/* Header Tag Row */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/60">
                  <span className="text-xs font-mono font-bold text-slate-300">
                    {course.code}
                  </span>
                  <div className="w-6 h-6 rounded-md bg-[#090d16] border border-slate-800 flex items-center justify-center">
                    {course.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-slate-100 group-hover:text-white leading-snug mb-2 line-clamp-2">
                  {course.title}
                </h3>

                {/* Summary */}
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3">
                  {course.summary}
                </p>

                {/* Bullets */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                  {course.bullets.map((b, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 shrink-0 mt-1.5" />
                      <span className="leading-snug">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono">
                <Link
                  href={`/courses/${course.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-[#38bdf8] group-hover:text-[#22d3ee] font-semibold flex items-center gap-1"
                >
                  <span>Start Course</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[10px] text-slate-500">
                  Interactive Labs
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Master Capstone Final Milestone Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0f172a] via-[#111c30] to-[#0f172a] border border-[#38bdf8]/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-1">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full border text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/40 border-cyan-800/40">
                  FINAL BENCHMARK
                </span>
                <span className="text-xs font-mono text-slate-400">CREDENTIAL: NV-NET-MASTERY</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                The Master Capstone Examination &amp; Engineering Credential
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Demonstrate complete mastery across all 5 flagship specializations. A 120-minute server-authoritative examination covering multi-protocol theory (40%), practical incident diagnostics (35%), and PCAP packet forensics (25%) with a mandatory 85% passing threshold.
              </p>
            </div>
          </div>
          <Link
            href="/certifications/capstone"
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>View Capstone Blueprint</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
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

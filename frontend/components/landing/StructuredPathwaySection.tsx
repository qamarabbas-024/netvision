'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Lock } from 'lucide-react';

export const StructuredPathwaySection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Digital Foundations',
      desc: 'Bits, bytes, media, topology basics',
    },
    {
      num: '02',
      title: 'Network Fundamentals',
      desc: 'OSI, TCP/IP, Ethernet, addressing',
    },
    {
      num: '03',
      title: 'Local Networking',
      desc: 'Switching, VLANs, trunking',
    },
    {
      num: '04',
      title: 'IP Networking',
      desc: 'IPv4, subnetting, routing basics',
    },
    {
      num: '05',
      title: 'Transport & Services',
      desc: 'TCP, UDP, DNS, DHCP, ICMP',
    },
    {
      num: '06',
      title: 'Routing & Engineering',
      desc: 'OSPF, ACLs, BGP, advanced topics',
    },
    {
      num: '07',
      title: 'Master Credential',
      desc: 'Complete all & earn NV Professional Cert',
      isCredential: true,
    },
  ];

  return (
    <section className="py-12 bg-net-grid-pattern bg-[#070a10] border-b border-[#1b2230] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Callout Card */}
          <div className="lg:col-span-3 p-6 sm:p-7 rounded-2xl bg-[#0c1017] border border-[#1e293b] flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-[11px] font-mono font-bold text-[#22c55e] uppercase tracking-widest block mb-2">
                STRUCTURED LEARNING PATHWAY
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-3">
                From Basics to Expert
              </h2>
              <p className="text-xs text-[#94a3b8] leading-relaxed mb-6">
                Follow a carefully designed path that builds real networking intuition step by step.
              </p>
            </div>

            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>View All 38 Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Connected 7-Stage Progression Flow */}
          <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5 items-stretch">
            {steps.map((s, idx) => (
              <Link
                key={s.num}
                href={s.isCredential ? '/certificates' : '/courses'}
                className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all shadow-sm cursor-pointer ${
                  s.isCredential
                    ? 'bg-[#062419] border-[#22c55e]/60 text-white hover:border-[#22c55e] hover:shadow-lg hover:shadow-emerald-950/40'
                    : 'bg-[#0c1017] border-[#1e293b] hover:border-[#22c55e]/50 hover:bg-[#0e1420]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-mono font-extrabold ${
                        s.isCredential ? 'text-[#22c55e]' : 'text-[#38bdf8]'
                      }`}
                    >
                      {s.num}
                    </span>
                    {s.isCredential && <Lock className="w-3 h-3 text-[#22c55e]" />}
                  </div>

                  <h3 className="text-xs font-bold text-white mb-1 leading-snug">
                    {s.title}
                  </h3>

                  <p className="text-[10px] text-[#94a3b8] leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden lg:block pt-2 text-[9px] font-mono text-[#22c55e]/40">
                    ───›
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

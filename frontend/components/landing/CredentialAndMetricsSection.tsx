'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Box, Network, GitBranch, Users, Clock, QrCode } from 'lucide-react';

export const CredentialAndMetricsSection: React.FC = () => {
  return (
    <section className="py-12 bg-[#070a10] border-b border-[#1b2230] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Card 1: Prove Your Competence & Certificate Preview */}
          <div className="lg:col-span-5 p-6 sm:p-7 rounded-2xl bg-[#0c1017] border border-[#1e293b] flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-[11px] font-mono font-bold text-[#22c55e] uppercase tracking-widest block mb-2">
                EARN VERIFIABLE CREDENTIALS
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-3">
                Prove Your Competence
              </h2>
              <p className="text-xs text-[#94a3b8] leading-relaxed mb-6">
                All certificates are cryptographically verifiable and backed by NetVision&apos;s secure infrastructure.
              </p>

              {/* Certificate Preview Card Miniature */}
              <div className="p-4 rounded-xl bg-[#080d16] border border-[#1e293b] mb-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#1e293b] mb-2">
                  <span className="text-[10px] font-mono text-[#94a3b8]">NetVision Professional Certificate</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30">
                    VERIFIED
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">Network Engineering</h3>
                    <div className="font-serif italic text-[#22d3ee] text-xs">Qamar Abbas</div>
                    <span className="text-[9px] font-mono text-[#64748b]">Founder & Director, NetVision</span>
                  </div>

                  <div className="w-11 h-11 rounded-lg bg-[#0f172a] border border-[#1e293b] flex items-center justify-center text-[#22c55e]">
                    <QrCode className="w-7 h-7" />
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/certificates"
              className="text-xs font-mono font-bold text-[#22c55e] hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>View Certificates</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: Platform Metrics Grid */}
          <div className="lg:col-span-4 p-6 sm:p-7 rounded-2xl bg-[#0c1017] border border-[#1e293b] flex flex-col justify-center shadow-sm">
            <div className="grid grid-cols-5 gap-2 text-center">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg bg-[#0f172a] border border-[#1e293b] flex items-center justify-center text-[#38bdf8] mb-2">
                  <Box className="w-4 h-4" />
                </div>
                <strong className="text-sm sm:text-base font-extrabold text-white">16+</strong>
                <span className="text-[10px] font-mono text-[#64748b]">Courses</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg bg-[#0f172a] border border-[#1e293b] flex items-center justify-center text-[#22c55e] mb-2">
                  <Network className="w-4 h-4" />
                </div>
                <strong className="text-sm sm:text-base font-extrabold text-white">50+</strong>
                <span className="text-[10px] font-mono text-[#64748b]">Simulations</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg bg-[#0f172a] border border-[#1e293b] flex items-center justify-center text-[#22c55e] mb-2">
                  <GitBranch className="w-4 h-4" />
                </div>
                <strong className="text-sm sm:text-base font-extrabold text-white">100+</strong>
                <span className="text-[10px] font-mono text-[#64748b]">Labs</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg bg-[#0f172a] border border-[#1e293b] flex items-center justify-center text-[#a855f7] mb-2">
                  <Users className="w-4 h-4" />
                </div>
                <strong className="text-sm sm:text-base font-extrabold text-white">10K+</strong>
                <span className="text-[10px] font-mono text-[#64748b]">Learners</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg bg-[#0f172a] border border-[#1e293b] flex items-center justify-center text-[#22c55e] mb-2">
                  <Clock className="w-4 h-4" />
                </div>
                <strong className="text-sm sm:text-base font-extrabold text-white">99.9%</strong>
                <span className="text-[10px] font-mono text-[#64748b]">Uptime</span>
              </div>
            </div>
          </div>

          {/* Card 3: Ready to Start? Bottom CTA */}
          <div className="lg:col-span-3 p-6 sm:p-7 rounded-2xl bg-[#0c1017] border border-[#1e293b] flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-[11px] font-mono font-bold text-[#22c55e] uppercase tracking-widest block mb-2">
                READY TO START?
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-2">
                Jump into networking now.
              </h2>
              <p className="text-xs text-[#94a3b8] leading-relaxed mb-6">
                No account needed. Start learning instantly.
              </p>
            </div>

            <Link href="/courses">
              <button
                type="button"
                className="w-full px-5 py-3 rounded-lg bg-[#22c55e] text-[#062817] hover:bg-[#16a34a] font-bold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Start Interactive Learning</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

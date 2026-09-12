'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  BorderBeam,
  GlowBorderCard,
  CyberGlitchText,
  CopyButton,
  Link001,
  Link002,
  Link003,
  Link004,
} from '@/components/ui';
import { Terminal, Shield, Network, Zap, CheckCircle2, Layers } from 'lucide-react';

export const RegistryComponentsShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardsRef.current) return;
    const cards = cardsRef.current.children;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        },
      }
    );
  }, []);

  return (
    <section
      ref={containerRef}
      id="motion-component-showcase"
      className="relative py-20 bg-[#080c14] border-t border-b border-[#1e293b]/70 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-cyan-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono font-medium text-cyan-400">
            <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Modern Animated UI Registry Integration</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white text-balance">
            Next-Gen Interface Power with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">
              <CyberGlitchText text="Vengeance UI & Skiper UI" scrambleDuration={35} />
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed text-pretty">
            Curated motion design components engineered for enterprise network observatories, live packet forensics, and low-latency interactive simulation dashboards.
          </p>
        </div>

        {/* 3-Column Component Showcase Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: GlowBorderCard with Network Telemetry */}
          <div className="relative group">
            <GlowBorderCard
              width="100%"
              height="auto"
              borderRadius="1rem"
              animationDuration={5}
              gradientColors={['#06b6d4', '#10b981', '#3b82f6']}
              className="bg-[#0e131f]/90 border border-slate-800 p-6 flex flex-col justify-between h-full min-h-[300px]"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                    <Network className="w-4 h-4" />
                    <span>eBPF Telemetry Core</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                    ACTIVE
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white">
                  Real-time Packet Filter Hook
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Kernel-space packet parsing at 100Gbps line rate with integrated XDP fast-path and TC classifier probes.
                </p>

                {/* Interactive CLI code snippet with CopyButton */}
                <div className="p-3 bg-[#060a12] rounded-lg border border-slate-800/80 flex items-center justify-between font-mono text-[11px] text-cyan-300">
                  <code>tc qdisc add dev eth0 clsact</code>
                  <CopyButton code="tc qdisc add dev eth0 clsact" />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400 tabular-nums">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 0 dropped packets
                </span>
                <span className="tabular-nums">Latency: 0.12µs</span>
              </div>
            </GlowBorderCard>
          </div>

          {/* Card 2: BorderBeam Container with Master Capstone Blueprint */}
          <div className="relative rounded-2xl bg-[#0e131f]/90 border border-slate-800 p-6 flex flex-col justify-between h-full min-h-[300px] overflow-hidden group shadow-xl">
            <BorderBeam size={220} duration={10} delay={2} colorFrom="#10b981" colorTo="#38bdf8" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                  <Shield className="w-4 h-4" />
                  <span>Authoritative Certification</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-mono font-bold tabular-nums">
                  PASS: 85%
                </span>
              </div>

              <h3 className="text-lg font-bold text-white">
                NV-NET-MASTERY Capstone
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed text-pretty">
                120-minute server-graded examination testing 40% Theory, 35% Multi-layer practical troubleshooting, and 25% Packet forensics.
              </p>

              <div className="p-3 bg-[#060a12] rounded-lg border border-slate-800/80 space-y-1.5 font-mono text-[11px] tabular-nums">
                <div className="flex justify-between text-slate-300">
                  <span>Theory Weight:</span>
                  <span className="text-emerald-400 font-semibold">40%</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Incident Challenge:</span>
                  <span className="text-cyan-400 font-semibold">35%</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Packet Forensics:</span>
                  <span className="text-blue-400 font-semibold">25%</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400 relative z-10">
              <span className="text-emerald-400 font-bold">Cryptographically Verified</span>
              <span>SHA-256</span>
            </div>
          </div>

          {/* Card 3: Skiper UI Micro-Interaction Links & Interactive Showcase */}
          <div className="relative rounded-2xl bg-[#0e131f]/90 border border-slate-800 p-6 flex flex-col justify-between h-full min-h-[300px] group shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold uppercase tracking-wider">
                  <Layers className="w-4 h-4" />
                  <span>Skiper UI Motion Suite</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold">
                  MICRO-HOVER
                </span>
              </div>

              <h3 className="text-lg font-bold text-white">
                Kinetic Navigation Transitions
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed text-pretty">
                Hover over the protocol links below to experience Skiper UI&apos;s dynamic fluid underline and cursor transitions:
              </p>

              <div className="pt-2 space-y-3 font-mono text-xs">
                <Link001 href="/simulations" className="text-cyan-300 hover:text-cyan-200">
                  → BGP-4 &amp; EVPN VXLAN Overlay Lab
                </Link001>
                <Link002 href="/troubleshooting" className="text-emerald-300 hover:text-emerald-200">
                  → Spanning Tree BPDU Loop Root Cause
                </Link002>
                <Link003 href="/certificates" className="text-blue-300 hover:text-blue-200">
                  → Public Credential Verification Engine
                </Link003>
                <Link004 href="/sandbox" className="text-purple-300 hover:text-purple-200">
                  → FRR Routing &amp; Linux Network Namespaces
                </Link004>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="text-purple-400 font-semibold">GSAP + Motion.dev Powered</span>
              <span className="tabular-nums">60 FPS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PlayCircle, ArrowRight, Radio, Server, Monitor, Activity, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-28 pb-24 overflow-hidden bg-net-grid-pattern border-b border-[#232732]">
      {/* Subtle Architectural Atmosphere */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-[#0284c7]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Editorial Typography & Technical Framing */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 flex flex-col items-start text-left"
        >
          {/* Engineering Studio Badge */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-[#232732] bg-[#15181e] text-[11px] font-mono text-[#00c8f8] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00c8f8]" />
            <span className="tracking-widest uppercase font-semibold">NETWORK STUDIO // CURRICULUM V2</span>
          </div>

          {/* Large Editorial Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#f3f4f6] leading-[1.1] mb-6 font-sans">
            Master Computer Networking <br />
            <span className="text-[#00c8f8] font-normal tracking-tight">
              By Seeing It In Action.
            </span>
          </h1>

          {/* Subtitle with High-Legibility Whitespace */}
          <p className="text-base sm:text-lg text-[#94a3b8] font-normal leading-relaxed max-w-xl mb-8 font-sans">
            Observe real packet movement across network topologies, dissect protocol headers in real time, configure live diagnostic labs, and build rigorous technical intuition.
          </p>

          {/* Studio CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mb-10">
            <Link href="/courses" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="cyan"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto justify-center bg-[#00c8f8] text-[#0f1115] hover:bg-[#38bdf8] font-bold rounded-lg px-6 shadow-sm"
              >
                Start Learning
              </Button>
            </Link>
            <Link href="/sandbox" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="secondary"
                leftIcon={<PlayCircle className="w-4 h-4 text-[#00c8f8]" />}
                className="w-full sm:w-auto justify-center bg-[#15181e] border-[#232732] hover:border-[#00c8f8]/40 text-[#e2e8f0] font-semibold rounded-lg px-6"
              >
                Explore Sandbox
              </Button>
            </Link>
          </div>

          {/* Architectural Metadata Ticker */}
          <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-[#232732] text-xs font-mono text-[#64748b] w-full">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-zinc-300">Guest Access Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00c8f8]" />
              <span className="text-zinc-300">16 Structured Courses</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-zinc-300">20+ Diagnostic Labs</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Architectural Topology Schematic Workbench */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="lg:col-span-5 w-full"
        >
          <div className="bg-[#15181e] rounded-xl border border-[#232732] shadow-elevated overflow-hidden">
            {/* Workbench Top Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#111317] border-b border-[#232732]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00c8f8]" />
                <span className="text-[11px] font-mono text-[#94a3b8] uppercase tracking-wider font-semibold">
                  TOPOLOGY_VIEW // LAB-01
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#64748b]">
                STATUS: 60 FPS • LIVE
              </span>
            </div>

            {/* Topology Diagram Canvas */}
            <div className="relative h-60 w-full bg-[#0f1115] flex items-center justify-between px-6 sm:px-8 border-b border-[#232732] overflow-hidden">
              {/* Hairline Schematic Interconnect Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
                <line x1="18%" y1="50%" x2="50%" y2="50%" stroke="#232732" strokeWidth="1" />
                <line x1="18%" y1="50%" x2="50%" y2="50%" stroke="#00c8f8" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />
                <line x1="50%" y1="50%" x2="82%" y2="50%" stroke="#232732" strokeWidth="1" />
                <line x1="50%" y1="50%" x2="82%" y2="50%" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />
              </svg>

              {/* Node 1: Host PC */}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <div className="w-11 h-11 rounded-lg bg-[#15181e] border border-[#232732] flex items-center justify-center text-emerald-400">
                  <Monitor className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-[#f3f4f6] font-semibold mt-1">Host-A</span>
                <span className="text-[9px] font-mono text-[#64748b]">192.168.1.10</span>
              </div>

              {/* Node 2: Gateway Router */}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-lg bg-[#15181e] border border-[#00c8f8]/40 flex items-center justify-center text-[#00c8f8]">
                  <Radio className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono text-[#00c8f8] font-bold mt-1">Router-R1</span>
                <span className="text-[9px] font-mono text-[#64748b]">10.0.0.1</span>
              </div>

              {/* Node 3: Cloud Web Server */}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <div className="w-11 h-11 rounded-lg bg-[#15181e] border border-[#232732] flex items-center justify-center text-purple-400">
                  <Server className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-[#f3f4f6] font-semibold mt-1">Server-01</span>
                <span className="text-[9px] font-mono text-[#64748b]">172.16.0.5</span>
              </div>
            </div>

            {/* Packet Header Inspector Bar */}
            <div className="p-3.5 bg-[#111317] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-[#e2e8f0]">
                <Activity className="w-3.5 h-3.5 text-[#00c8f8] shrink-0" />
                <span className="text-[11px]">ENCAPSULATION: <strong className="text-[#00c8f8]">IPv4 / TCP [SYN]</strong></span>
              </div>
              <div className="text-[10px] text-[#94a3b8]">
                L4_SEQ: <span className="text-emerald-400 font-bold">1000</span> • ACK: <span className="text-zinc-500">0</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

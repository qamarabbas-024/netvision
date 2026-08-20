'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PlayCircle, ArrowRight, Radio, Server, Monitor, Activity } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-24 sm:pt-28 pb-20 sm:pb-24 overflow-hidden bg-net-grid-pattern border-b border-[#2a2e39] surface-0 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Editorial Instrumentation Typography */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 flex flex-col items-start text-left"
        >
          {/* Engineering Lab Instrument Badge */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#16181f] border border-[#2a2e39] text-[11px] font-mono text-[#38bdf8] mb-6">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span className="tracking-widest uppercase font-bold">NETWORK INSTRUMENT // LAB_ENGINE_V1</span>
          </div>

          {/* Large Technical Display Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#f4f5f7] leading-[1.1] mb-6 font-sans">
            Learn networking by <br />
            <span className="text-[#38bdf8] font-extrabold tracking-tight">
              seeing how it works.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#8e95a5] font-normal leading-relaxed max-w-xl mb-8 font-sans">
            Interactive networking education with real packet visualizers, live CLI diagnostic labs, and structured technical progression from physical bits to advanced routing.
          </p>

          {/* Laboratory CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mb-10 font-sans">
            <Link href="/courses" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="primary"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto justify-center px-6 py-3 text-sm font-bold shadow-sm"
              >
                Start Learning
              </Button>
            </Link>
            <Link href="/sandbox" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="secondary"
                leftIcon={<PlayCircle className="w-4 h-4 text-[#38bdf8]" />}
                className="w-full sm:w-auto justify-center px-6 py-3 text-sm font-semibold"
              >
                Open Sandbox Lab
              </Button>
            </Link>
          </div>

          {/* Instrument Telemetry Ticker */}
          <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-[#2a2e39] text-xs font-mono text-[#8e95a5] w-full">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              <span className="text-[#c4c9d4]">GUEST_ACCESS: 100% OPEN</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
              <span className="text-[#c4c9d4]">16 PROGRESSIVE COURSES</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
              <span className="text-[#c4c9d4]">DETERMINISTIC SIMULATIONS</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Interactive Protocol Logic Analyzer Console */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="lg:col-span-5 w-full"
        >
          <div className="surface-2 rounded-xl border border-[#2a2e39] shadow-elevated overflow-hidden font-mono">
            {/* Instrument Bezel Top Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#14151a] border-b border-[#2a2e39]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
                <span className="text-[11px] text-[#f4f5f7] uppercase tracking-wider font-bold">
                  INSTRUMENT: LOGIC_ANALYZER // CH-01
                </span>
              </div>
              <span className="text-[10px] text-[#8e95a5]">
                SAMPLE_RATE: 60 Hz
              </span>
            </div>

            {/* Topology Diagram Oscilloscope Canvas */}
            <div className="relative h-60 w-full bg-[#121316] flex items-center justify-between px-6 sm:px-8 border-b border-[#2a2e39] overflow-hidden">
              {/* Hairline Schematic Interconnect Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
                <line x1="18%" y1="50%" x2="50%" y2="50%" stroke="#2a2e39" strokeWidth="1" />
                <line x1="18%" y1="50%" x2="50%" y2="50%" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />
                <line x1="50%" y1="50%" x2="82%" y2="50%" stroke="#2a2e39" strokeWidth="1" />
                <line x1="50%" y1="50%" x2="82%" y2="50%" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />
              </svg>

              {/* Node 1: Host PC */}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <div className="w-11 h-11 rounded-lg bg-[#14151a] border border-[#2a2e39] flex items-center justify-center text-[#10b981]">
                  <Monitor className="w-5 h-5" />
                </div>
                <span className="text-[10px] text-[#f4f5f7] font-semibold mt-1">Host-A</span>
                <span className="text-[9px] text-[#8e95a5]">192.168.1.10</span>
              </div>

              {/* Node 2: Gateway Router */}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-lg bg-[#14151a] border border-[#38bdf8]/50 flex items-center justify-center text-[#38bdf8]">
                  <Radio className="w-6 h-6" />
                </div>
                <span className="text-[10px] text-[#38bdf8] font-bold mt-1">Router-R1</span>
                <span className="text-[9px] text-[#8e95a5]">10.0.0.1</span>
              </div>

              {/* Node 3: Cloud Web Server */}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <div className="w-11 h-11 rounded-lg bg-[#14151a] border border-[#2a2e39] flex items-center justify-center text-[#818cf8]">
                  <Server className="w-5 h-5" />
                </div>
                <span className="text-[10px] text-[#f4f5f7] font-semibold mt-1">Server-01</span>
                <span className="text-[9px] text-[#8e95a5]">172.16.0.5</span>
              </div>
            </div>

            {/* Telemetry Stream Output Bar */}
            <div className="p-3 bg-[#14151a] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[#f4f5f7]">
                <Activity className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                <span className="text-[11px]">HEADER: <strong className="text-[#38bdf8]">IPv4 / TCP [SYN]</strong></span>
              </div>
              <div className="text-[10px] text-[#8e95a5]">
                SEQ: <span className="text-[#10b981] font-bold">0x000003E8</span> • ACK: <span className="text-[#646c7d]">0x00000000</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

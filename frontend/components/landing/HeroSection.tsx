'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PlayCircle, ArrowRight, Zap, Radio, Server, Monitor, Activity } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-24 pb-20 overflow-hidden bg-net-grid-pattern">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-gradient-to-b from-[#00f0ff]/15 via-[#3b82f6]/5 to-transparent blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Text & CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 flex flex-col items-start text-left"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/5 text-[#00f0ff] text-xs font-semibold uppercase tracking-wider mb-6 shadow-glow-cyan">
            <Zap className="w-3.5 h-3.5 animate-pulse" />
            <span>The World's Best Free Visual Learning Platform</span>
          </div>

          {/* Main Display Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
            Learn Networking by <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00f0ff] via-[#3b82f6] to-[#8b5cf6]">
              Seeing It In Action.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-zinc-400 font-normal leading-relaxed max-w-xl mb-8">
            Stop memorizing dry theory. Watch packets flow in real-time, build live network topologies, simulate protocols step-by-step, and repair broken networks.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-12">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" variant="cyan" rightIcon={<ArrowRight className="w-5 h-5" />} className="w-full sm:w-auto justify-center">
                Start Learning Free
              </Button>
            </Link>
            <a href="#demo" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" leftIcon={<PlayCircle className="w-5 h-5 text-[#00f0ff]" />} className="w-full sm:w-auto justify-center">
                Try Interactive Demo
              </Button>
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-6 border-t border-[#272732]/60 text-xs text-zinc-400 font-medium w-full">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>100% Free Forever</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00f0ff]" />
              <span>Zero Install Required</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>Beginner Friendly</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Dynamic Interactive Packet Flow Visualizer Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:col-span-5 w-full"
        >
          <div className="glass-panel-glow rounded-3xl p-4 sm:p-6 border border-[#00f0ff]/30 shadow-2xl relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 sm:pb-4 mb-4 sm:mb-6 border-b border-[#272732]/80">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[10px] sm:text-xs font-mono text-[#00f0ff] uppercase tracking-wider font-semibold">
                Live Simulation Engine • 60 FPS
              </span>
            </div>

            {/* Interactive Network Topology Visual */}
            <div className="relative h-56 sm:h-64 w-full bg-[#09090b]/80 rounded-2xl border border-[#272732] flex items-center justify-between px-3 sm:px-8 overflow-hidden">
              {/* Animated Connecting Cables */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line x1="18%" y1="50%" x2="50%" y2="50%" stroke="#00f0ff" strokeWidth="2" strokeDasharray="6 4" className="animate-pulse" />
                <line x1="50%" y1="50%" x2="82%" y2="50%" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6 4" className="animate-pulse" />
              </svg>

              {/* Node 1: Client PC */}
              <div className="relative z-10 flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg">
                  <Monitor className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-mono text-zinc-300 font-bold">Client PC</span>
                <span className="text-[8px] sm:text-[9px] font-mono text-zinc-500">192.168.1.10</span>
              </div>

              {/* Node 2: Router */}
              <div className="relative z-10 flex flex-col items-center gap-1.5">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff] shadow-glow-cyan">
                  <Radio className="w-6 h-6 sm:w-8 sm:h-8 animate-spin" style={{ animationDuration: '10s' }} />
                </div>
                <span className="text-[10px] sm:text-[11px] font-mono text-zinc-300 font-bold">Router</span>
                <span className="text-[8px] sm:text-[9px] font-mono text-zinc-500">10.0.0.1</span>
              </div>

              {/* Node 3: Web Server */}
              <div className="relative z-10 flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-lg">
                  <Server className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-mono text-zinc-300 font-bold truncate max-w-[80px] sm:max-w-none text-center">Web Server</span>
                <span className="text-[8px] sm:text-[9px] font-mono text-zinc-500">172.16.0.5</span>
              </div>
            </div>

            {/* Live Packet Header Inspection Bar */}
            <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 rounded-xl bg-[#121217] border border-[#272732] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-xs font-mono">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00f0ff] animate-pulse shrink-0" />
                <span className="text-zinc-300 text-[11px] sm:text-xs">Protocol: <strong className="text-[#00f0ff]">TCP SYN</strong></span>
              </div>
              <div className="text-zinc-400 text-[10px] sm:text-[11px]">
                Payload: <span className="text-emerald-400">Seq=100 Ack=0</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

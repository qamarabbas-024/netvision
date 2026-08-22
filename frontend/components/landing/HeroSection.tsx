'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PlayCircle, ArrowRight, Activity, Sparkles, Shield, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Interactive3DTopology } from './Interactive3DTopology';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-20 sm:pt-24 pb-16 sm:pb-20 overflow-hidden bg-net-grid-pattern border-b border-[var(--border-hairline)] bg-[var(--surface-0)] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Column: Editorial Instrumentation Typography */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-5 flex flex-col items-start text-left"
        >
          {/* Engineering Lab Instrument Badge */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[var(--surface-1)] border border-[var(--border-hairline)] text-[11px] font-mono text-[var(--accent-cyan)] mb-5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="tracking-widest uppercase font-bold">NETVISION // 3D_TOPOLOGY_ENGINE</span>
          </div>

          {/* Large Technical Display Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--foreground)] leading-[1.15] mb-5 font-sans">
            Learn networking by <br />
            <span className="text-[var(--accent-cyan)] font-extrabold tracking-tight">
              seeing how it works.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base leading-relaxed max-w-lg mb-7 font-sans text-[var(--text-muted)]">
            Explore computer networking in real-time 3D. Inspect live packet streams, change network variables, diagnose real outages, and earn verifiable industry credentials.
          </p>

          {/* Laboratory CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-8 font-sans">
            <Link href="/courses" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="primary"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto justify-center px-6 py-3 text-sm font-bold shadow-lg shadow-[var(--accent-cyan)]/20"
              >
                Explore Curriculum
              </Button>
            </Link>
            <Link href="/sandbox" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="secondary"
                leftIcon={<PlayCircle className="w-4 h-4 text-[var(--accent-cyan)]" />}
                className="w-full sm:w-auto justify-center px-6 py-3 text-sm font-semibold"
              >
                Launch Sandbox Lab
              </Button>
            </Link>
          </div>

          {/* Instrument Telemetry Ticker */}
          <div className="flex flex-wrap items-center gap-5 pt-5 border-t border-[var(--border-hairline)] text-xs font-mono text-[var(--text-muted)] w-full">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>GUEST_ACCESS: 100% OPEN</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)]" />
              <span>16 COURSES (NET-101 TO 404)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span>NV-NET CERTIFIED</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: 3D Isometric Interactive Topology Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="lg:col-span-7 w-full"
        >
          <Interactive3DTopology />
        </motion.div>
      </div>
    </section>
  );
};

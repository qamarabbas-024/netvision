'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, RefreshCw, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';
import { NetworkCanvas } from '../3d/NetworkCanvas';
import { NetworkDevice, NetworkScenario } from '@/types/network';

interface HeroSectionProps {
  onExploreCurriculum: () => void;
  onEnterInteractiveNetwork: () => void;
  onSelectDevice: (device: NetworkDevice | null) => void;
  onPacketClick: (packetId: string) => void;
  currentStageId: number;
  scenario: NetworkScenario;
  onScenarioChange: (scenario: NetworkScenario) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreCurriculum,
  onEnterInteractiveNetwork,
  onSelectDevice,
  onPacketClick,
  currentStageId,
  scenario,
  onScenarioChange,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredDevice, setHoveredDevice] = useState<NetworkDevice | null>(null);

  return (
    <section id="hero-3d-network-observatory" className="relative w-full overflow-hidden bg-[#0b0f17] border-b border-[#1e293b]/60 pt-10 pb-16 lg:pt-16 lg:pb-24">
      {/* Background radial glow & technical grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[520px]">
          
          {/* Left Column: Headline, Supporting Text, CTAs */}
          <div className="lg:col-span-5 space-y-6 z-10">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10b981]/15 border border-[#10b981]/30 text-xs font-mono font-semibold text-[#34d399]">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <span>Interactive Computer Networking Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold tracking-tight text-white leading-[1.12]">
              Learn networking by{' '}
              <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                seeing how it works.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-md">
              See packets move. Change network variables. Understand what the network is actually doing.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              {/* Primary CTA (Links to full Courses Catalog) */}
              <Link
                id="hero-explore-curriculum-btn"
                href="/courses"
                className="px-6 py-3.5 rounded-xl bg-[#22d3ee]/20 text-[#38bdf8] hover:bg-[#22d3ee]/30 border border-[#0ea5e9]/50 font-bold text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(14,165,233,0.2)] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Explore Curriculum</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Secondary CTA (Links to Interactive Sandbox Lab) */}
              <Link
                id="hero-enter-interactive-btn"
                href="/sandbox"
                className="px-6 py-3.5 rounded-xl bg-[#111827]/90 hover:bg-slate-800/80 border border-slate-700/80 hover:border-slate-500 text-slate-200 font-semibold text-sm transition-all"
              >
                Enter Interactive Sandbox
              </Link>
            </div>

            {/* Hovered Device Tooltip (if hovering) */}
            {hoveredDevice && (
              <div className="p-3.5 bg-[#0b1320] border border-[#06b6d4]/40 rounded-xl shadow-lg animate-fadeIn text-xs font-mono">
                <div className="flex items-center justify-between text-[#34d399] font-bold">
                  <span>{hoveredDevice.name}</span>
                  <span className="text-slate-400 text-[10px]">{hoveredDevice.ip}</span>
                </div>
                <div className="text-slate-300 text-[11px] mt-1">{hoveredDevice.description}</div>
              </div>
            )}
          </div>

          {/* Center & Right Column: Isometric 3D Network Canvas */}
          <div className="lg:col-span-7 relative h-[440px] sm:h-[500px] lg:h-[560px] rounded-2xl bg-[#090d16]/90 border border-slate-800/80 overflow-hidden shadow-2xl flex flex-col justify-between">
            
            {/* Top Interactive Scenario Controls Overlay */}
            <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
              <div className="flex items-center gap-1.5 p-1 bg-[#0b1320]/90 backdrop-blur-md border border-slate-800 rounded-xl">
                <button
                  onClick={() => onScenarioChange('healthy')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    scenario === 'healthy'
                      ? 'bg-[#10b981]/20 border border-[#10b981] text-[#34d399] shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Healthy (100% UP)</span>
                </button>

                <button
                  onClick={() => onScenarioChange('degraded')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    scenario === 'degraded'
                      ? 'bg-amber-500/20 border border-amber-500 text-amber-300 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Degraded (Jitter)</span>
                </button>

                <button
                  onClick={() => onScenarioChange('packet_loss')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    scenario === 'packet_loss'
                      ? 'bg-rose-500/20 border border-rose-500 text-rose-300 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Packet Loss (Drop)</span>
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0b1320]/80 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live 3D WebGL</span>
              </div>
            </div>

            {/* 3D WebGL Canvas */}
            <div className="w-full h-full">
              <NetworkCanvas
                currentStageId={currentStageId}
                scenario={scenario}
                isPaused={isPaused}
                onSelectDevice={onSelectDevice}
                onHoverDevice={setHoveredDevice}
                onPacketClick={onPacketClick}
              />
            </div>

            {/* Bottom 3D Canvas Telemetry Footer */}
            <div className="absolute bottom-3 left-4 right-4 z-20 pointer-events-none flex items-center justify-between text-[11px] font-mono text-slate-400 bg-[#0b1320]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">CLICK NODES</span>
                <span>to inspect FIB/CAM hardware state</span>
              </div>
              <div className="text-slate-500 hidden sm:block">
                DRAG to rotate // SCROLL to zoom
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

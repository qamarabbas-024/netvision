'use client';

import React, { useState } from 'react';
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
  const [isPaused] = useState(false);
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
              {/* Primary CTA */}
              <button
                id="hero-explore-curriculum-btn"
                onClick={onExploreCurriculum}
                className="px-6 py-3.5 rounded-xl bg-[#22d3ee]/20 text-[#38bdf8] hover:bg-[#22d3ee]/30 border border-[#0ea5e9]/50 font-bold text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(14,165,233,0.2)] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Explore Curriculum</span>
              </button>

              {/* Secondary CTA */}
              <button
                id="hero-enter-interactive-btn"
                onClick={onEnterInteractiveNetwork}
                className="px-6 py-3.5 rounded-xl bg-[#111827]/90 hover:bg-slate-800/80 border border-slate-700/80 hover:border-slate-500 text-slate-200 font-semibold text-sm transition-all"
              >
                Enter Interactive Network
              </button>
            </div>

            {/* Hovered Device Tooltip (if hovering) */}
            {hoveredDevice && (
              <div className="p-3 bg-[#0b1320] border border-[#06b6d4]/40 rounded-xl shadow-lg animate-fadeIn text-xs font-mono">
                <div className="flex items-center justify-between text-[#34d399] font-bold">
                  <span>{hoveredDevice.name}</span>
                  <span className="text-slate-400 text-[10px]">{hoveredDevice.ip}</span>
                </div>
                <div className="text-slate-300 text-[11px] mt-1">{hoveredDevice.description}</div>
              </div>
            )}
          </div>

          {/* Center & Right Column: Isometric 3D Network Canvas */}
          <div className="lg:col-span-7 relative h-[420px] sm:h-[500px] lg:h-[560px] rounded-2xl bg-[#090d16]/90 border border-slate-800/80 overflow-hidden shadow-2xl">
            <NetworkCanvas
              currentStageId={currentStageId}
              scenario={scenario}
              isPaused={isPaused}
              onSelectDevice={onSelectDevice}
              onHoverDevice={setHoveredDevice}
              onPacketClick={onPacketClick}
            />

            {/* Overlay Label: Edge Gateway 530 badge */}
            <div className="absolute top-6 right-6 pointer-events-none hidden sm:flex flex-col items-end z-20">
              <div className="px-3 py-1 rounded-lg bg-[#0b1320]/80 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Edge Gateway 530</span>
              </div>
              <div className="text-[10px] font-mono text-slate-500 mt-1">
                Edge Gateway 520 / 530 Cluster
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

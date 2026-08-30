'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Monitor,
  Layers,
  Settings,
  Wrench,
  Maximize2,
  ShieldCheck,
  Activity,
  AlertTriangle
} from 'lucide-react';
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

  const featureItems = [
    { label: 'Learn networking', href: '/courses', icon: <BookOpen className="w-3.5 h-3.5 text-[#34d399]" /> },
    { label: 'Course Simulations', href: '/simulations', icon: <Monitor className="w-3.5 h-3.5 text-[#38bdf8]" /> },
    { label: 'Sandbox Lab', href: '/sandbox', icon: <Layers className="w-3.5 h-3.5 text-[#34d399]" /> },
    { label: 'Learning Solutions', href: '/courses', icon: <Settings className="w-3.5 h-3.5 text-[#34d399]" /> },
    { label: 'Troubleshooting', href: '/troubleshooting', icon: <Wrench className="w-3.5 h-3.5 text-[#38bdf8]" /> },
    { label: 'Feature Capability', href: '/docs', icon: <Maximize2 className="w-3.5 h-3.5 text-[#34d399]" /> },
  ];

  return (
    <section id="hero-3d-network-observatory" className="relative w-full overflow-hidden bg-[#0b0f17] border-b border-[#1e293b]/70 pt-8 pb-14 lg:pt-14 lg:pb-20">
      {/* Background technical grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-15 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Supporting Text, CTAs, 2x3 Feature Grid */}
          <div className="lg:col-span-5 space-y-6 z-10">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#061e1b] border border-[#10b981]/40 text-xs font-mono font-medium text-[#34d399]">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <span>Interactive Packet Simulation &amp; 3D Topology</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[50px] font-extrabold tracking-tight text-white leading-[1.14]">
              Learn networking by{' '}
              <span className="block mt-1">
                seeing how it{' '}
                <span className="relative inline-block text-[#22d3ee] font-black underline decoration-[#06b6d4] decoration-wavy decoration-2 underline-offset-8 drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]">
                  works
                </span>
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-md">
              Visualize live packet dynamics, inject network faults, and build real intuition from physical bitstreams to cloud routing.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              {/* Primary CTA */}
              <Link
                id="hero-start-learning-btn"
                href="/courses"
                className="px-6 py-3 rounded-xl bg-[#10b981] hover:bg-[#059669] text-[#051a14] hover:text-white font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Start Learning
              </Link>

              {/* Secondary CTA */}
              <button
                onClick={onExploreCurriculum}
                className="px-5 py-3 rounded-xl bg-[#0b1320] hover:bg-slate-800/80 border border-slate-700/80 hover:border-slate-500 text-slate-200 hover:text-white font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Explore Curriculum</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2x3 Feature Matrix Grid matching the blueprint image */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800/80">
              {featureItems.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="group p-2.5 rounded-xl bg-[#090d16]/80 hover:bg-[#0f172a] border border-slate-800/80 hover:border-[#10b981]/40 transition-all flex items-center gap-2"
                >
                  <div className="shrink-0 p-1.5 rounded-lg bg-[#06131c] border border-slate-800 group-hover:border-[#10b981]/40">
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-300 group-hover:text-white leading-tight">
                    {item.label}
                  </span>
                </Link>
              ))}
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

          {/* Right Column: Isometric 3D Network Canvas */}
          <div className="lg:col-span-7 relative h-[480px] sm:h-[540px] lg:h-[580px] rounded-2xl bg-[#070b12] border border-slate-800/80 overflow-hidden shadow-2xl flex flex-col justify-between">
            
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
                  <span>Healthy</span>
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
                  <span>Degraded</span>
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
                  <span>Loss</span>
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0b1320]/80 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>3D WebGL Mesh</span>
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
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-slate-200">INTERACTIVE 3D TOPOLOGY</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <span>SCENARIO: <strong className="text-[#34d399] uppercase">{scenario}</strong></span>
                <span>NODES: <strong className="text-[#38bdf8]">6 ACTIVE</strong></span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  ArrowRight,
  ShieldCheck,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Terminal,
  Cpu,
  Table,
  Eye,
} from 'lucide-react';
import { NetworkDevice, NetworkScenario } from '@/types/network';
import { NETWORK_DEVICES } from '@/data/networkTopologyData';
import { BorderBeam, CyberGlitchText, AnimatedRays } from '@/components/ui';

const NetworkCanvas = dynamic(
  () => import('../3d/NetworkCanvas').then((mod) => mod.NetworkCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950/40 text-xs font-mono text-zinc-400 gap-2">
        <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
        <span>Initializing 3D WebGL Topology...</span>
      </div>
    ),
  }
);

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
  onEnterInteractiveNetwork: _onEnterInteractiveNetwork,
  onSelectDevice,
  onPacketClick,
  currentStageId,
  scenario,
  onScenarioChange,
}) => {
  const [isPaused] = useState(false);
  const [hoveredDevice, setHoveredDevice] = useState<NetworkDevice | null>(null);
  const [isAccessibleView, setIsAccessibleView] = useState(false);
  const [scenarioAnnouncement, setScenarioAnnouncement] = useState(
    'Network topology running in healthy state: all 6 nodes active, 0% packet loss.'
  );

  const handleScenarioChange = (newScenario: NetworkScenario) => {
    onScenarioChange(newScenario);
    if (newScenario === 'healthy') {
      setScenarioAnnouncement(
        'Scenario updated to Healthy: All 6 nodes operational, 0% packet loss, nominal round-trip latency 1.1ms.'
      );
    } else if (newScenario === 'degraded') {
      setScenarioAnnouncement(
        'Scenario updated to Degraded: Elevated latency and packet jitter detected on Core Router WAN link, round-trip time 45ms.'
      );
    } else if (newScenario === 'packet_loss') {
      setScenarioAnnouncement(
        'Scenario updated to Packet Loss: 25% drop rate injected between Core Router and Perimeter Firewall.'
      );
    }
  };

  return (
    <section id="hero-3d-network-observatory" className="relative w-full overflow-hidden bg-[#0b0f17] border-b border-[#1e293b]/70 pt-8 pb-14 lg:pt-14 lg:pb-20">
      {/* Background technical grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-15 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
      <AnimatedRays className="opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Supporting Text, CTAs, Technical Specs */}
          <div className="lg:col-span-5 space-y-6 z-10">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#061e1b] border border-[#10b981]/40 text-xs font-mono font-medium text-[#34d399]">
              <span className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <CyberGlitchText text="Interactive Packet Simulation & 3D Topology" scrambleDuration={30} />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[50px] font-extrabold tracking-tight text-white leading-[1.14] text-balance">
              Learn networking by{' '}
              <span className="block mt-1">
                seeing how it{' '}
                <span className="relative inline-block text-[#22d3ee] font-black underline decoration-[#06b6d4] decoration-wavy decoration-2 underline-offset-8 drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]">
                  works
                </span>
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-md text-pretty">
              Visualize live packet dynamics, inject network faults, and build real intuition from physical bitstreams to cloud routing.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              {/* Primary CTA */}
              <Link
                id="hero-start-learning-btn"
                href="/courses"
                className="px-6 py-3 rounded-xl bg-[#10b981] hover:bg-[#059669] text-[#051a14] hover:text-white font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f17]"
              >
                Start Learning
              </Link>

              {/* Secondary CTA */}
              <button
                type="button"
                onClick={onExploreCurriculum}
                className="px-5 py-3 rounded-xl bg-[#0b1320] hover:bg-slate-800/80 border border-slate-700/80 hover:border-slate-500 text-slate-200 hover:text-white font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f17]"
              >
                <span>Explore Curriculum</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Refined Technical Capability Badges (Replacing cluttered 2x3 matrix) */}
            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-400">
              <div className="p-2.5 rounded-xl bg-[#090d16]/80 border border-slate-800/80 flex flex-col gap-1">
                <span className="text-[#34d399] font-bold flex items-center gap-1 tabular-nums">
                  <CheckCircle2 className="w-3 h-3 text-[#34d399]" /> 5 Courses
                </span>
                <span className="text-[10px] text-slate-400">+ Master Capstone</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#090d16]/80 border border-slate-800/80 flex flex-col gap-1">
                <span className="text-[#38bdf8] font-bold flex items-center gap-1 tabular-nums">
                  <Cpu className="w-3 h-3 text-[#38bdf8]" /> WebGL Engine
                </span>
                <span className="text-[10px] text-slate-400 tabular-nums">60 FPS 3D Render</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#090d16]/80 border border-slate-800/80 flex flex-col gap-1">
                <span className="text-[#a78bfa] font-bold flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-[#a78bfa]" /> Live CLI
                </span>
                <span className="text-[10px] text-slate-400">Deterministic Labs</span>
              </div>
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

          {/* Right Column: Isometric 3D Network Canvas with Accessible Alternative */}
          <div
            role="region"
            aria-label="Interactive Network Topology Observatory"
            className="lg:col-span-7 relative h-[480px] sm:h-[540px] lg:h-[580px] rounded-2xl bg-[#070b12] border border-slate-800/80 overflow-hidden shadow-2xl flex flex-col justify-between"
          >
            <BorderBeam size={320} duration={14} delay={0} colorFrom="#10b981" colorTo="#06b6d4" />

            {/* Accessible Live Region for Screen Readers */}
            <div role="status" aria-live="polite" className="sr-only">
              {scenarioAnnouncement}
            </div>

            {/* Screen Reader Full Topology Summary */}
            <div className="sr-only">
              Interactive 3D network topology visualization with 6 active nodes: Workstation Client (192.168.1.10),
              Enterprise Switch (192.168.1.2), Core Central Router (192.168.1.1), Perimeter Firewall (10.0.0.2), Web
              Application Server (142.250.72.14), and Database Storage Cluster (172.16.0.5). Current operating scenario:
              {scenario}. Use the Accessible Matrix view to navigate every node and telemetry metric by keyboard.
            </div>
            
            {/* Top Interactive Scenario Controls Overlay */}
            <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
              <div className="flex items-center gap-1.5 p-1 bg-[#0b1320]/90 backdrop-blur-md border border-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => handleScenarioChange('healthy')}
                  aria-pressed={scenario === 'healthy'}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    scenario === 'healthy'
                      ? 'bg-[#10b981]/20 border border-[#10b981] text-[#34d399] shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Healthy</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleScenarioChange('degraded')}
                  aria-pressed={scenario === 'degraded'}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    scenario === 'degraded'
                      ? 'bg-amber-500/20 border border-amber-500 text-amber-300 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Degraded</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleScenarioChange('packet_loss')}
                  aria-pressed={scenario === 'packet_loss'}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    scenario === 'packet_loss'
                      ? 'bg-rose-500/20 border border-rose-500 text-rose-300 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Loss</span>
                </button>
              </div>

              {/* Accessible Alternative Toggle (Table Matrix vs 3D Canvas) */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="hero-toggle-accessible-view-btn"
                  onClick={() => setIsAccessibleView((prev) => !prev)}
                  aria-label={isAccessibleView ? 'Switch to 3D Canvas View' : 'Switch to Accessible Topology Matrix View'}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0b1320]/90 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 font-mono text-xs font-semibold backdrop-blur-sm transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  {isAccessibleView ? (
                    <>
                      <Eye className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                      <span>3D Canvas</span>
                    </>
                  ) : (
                    <>
                      <Table className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                      <span>Accessible Matrix</span>
                    </>
                  )}
                </button>

                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0b1320]/80 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                  <span>3D WebGL Mesh</span>
                </div>
              </div>
            </div>

            {/* View Switching: 3D WebGL Canvas OR Accessible Structured Topology View */}
            {isAccessibleView ? (
              <div
                id="accessible-topology-matrix"
                tabIndex={0}
                aria-label="Accessible Network Topology Node Details"
                className="w-full h-full pt-16 pb-12 px-4 sm:px-6 overflow-y-auto space-y-4 font-sans text-xs bg-[#070b12]"
              >
                <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-cyan-300 flex items-start gap-2.5">
                  <Table className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h3 className="font-bold text-slate-100">Accessible Topology Representation</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Keyboard and screen-reader accessible representation of all 6 active nodes, their addressing,
                      and hardware layers. Click or press Enter on any node to view detailed packet buffers.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {NETWORK_DEVICES.map((dev) => {
                    const isDegraded = scenario === 'degraded' && (dev.id === 'router' || dev.id === 'firewall');
                    const isLoss = scenario === 'packet_loss' && dev.id === 'firewall';
                    const nodeStatus = isLoss ? 'Packet Drops (25%)' : isDegraded ? 'High Latency (45ms)' : 'Healthy';
                    const statusColor = isLoss
                      ? 'text-rose-400 bg-rose-950/40 border-rose-500/40'
                      : isDegraded
                      ? 'text-amber-400 bg-amber-950/40 border-amber-500/40'
                      : 'text-emerald-400 bg-emerald-950/40 border-emerald-500/40';

                    return (
                      <div
                        key={dev.id}
                        className="p-3 rounded-xl bg-[#0b1320] border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-100 text-sm">{dev.name}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${statusColor}`}>
                              {nodeStatus}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            <span>IP: <strong className="text-cyan-300">{dev.ip}</strong></span>
                            <span className="mx-2">•</span>
                            <span>MAC: {dev.mac}</span>
                            <span className="mx-2">•</span>
                            <span>{dev.layer}</span>
                          </div>
                          <p className="text-[11px] text-slate-300 line-clamp-1">{dev.role}</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => onSelectDevice(dev)}
                          aria-label={`Inspect detailed configuration of ${dev.name}`}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-600 text-slate-200 hover:text-white font-mono text-xs font-semibold shrink-0 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                        >
                          Inspect Node →
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
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
            )}

            {/* Bottom 3D Canvas Telemetry Footer */}
            <div className="absolute bottom-3 left-4 right-4 z-20 pointer-events-none flex items-center justify-between text-[11px] font-mono text-slate-400 bg-[#0b1320]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                <span className="text-slate-200 font-medium">
                  {isAccessibleView ? 'TOPOLOGY DATA VIEW' : 'INTERACTIVE 3D TOPOLOGY'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 tabular-nums">
                <span>
                  SCENARIO: <strong className="text-[#34d399] uppercase">{scenario}</strong>
                </span>
                <span>
                  NODES: <strong className="text-[#38bdf8]">6 ACTIVE</strong>
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

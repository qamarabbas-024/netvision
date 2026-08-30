'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Pause, Maximize2, ShieldAlert, CheckCircle2, Search, Activity, ArrowRight, RefreshCw, Layers } from 'lucide-react';
import { NetworkScenario } from '@/types/network';

interface LiveObservatorySectionProps {
  onOpenTerminal: () => void;
  scenario: NetworkScenario;
  onScenarioChange: (scenario: NetworkScenario) => void;
}

export const LiveObservatorySection: React.FC<LiveObservatorySectionProps> = ({
  onOpenTerminal,
  scenario,
  onScenarioChange,
}) => {
  const [activeTab, setActiveTab] = useState<'routing' | 'resilient' | 'hands_on' | 'convergence'>('routing');
  const [isSimulationPaused, setIsSimulationPaused] = useState(false);
  const [isSimulatingDegradation, setIsSimulatingDegradation] = useState(scenario !== 'healthy');
  const [activeStep, setActiveStep] = useState(1);
  const [, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    setIsSimulatingDegradation(scenario !== 'healthy');
  }, [scenario]);

  const handleToggleDegradation = () => {
    if (isSimulatingDegradation) {
      setIsSimulatingDegradation(false);
      onScenarioChange('healthy');
    } else {
      setIsSimulatingDegradation(true);
      onScenarioChange('degraded');
    }
  };

  const handleTabClick = (tab: 'routing' | 'resilient' | 'hands_on' | 'convergence') => {
    setActiveTab(tab);
    if (tab === 'routing') {
      setIsSimulatingDegradation(true);
      onScenarioChange('degraded');
    } else if (tab === 'convergence') {
      setIsSimulatingDegradation(false);
      onScenarioChange('healthy');
    }
  };

  return (
    <section id="live-observatory-section" className="relative w-full bg-[#070a10] border-b border-[#1e293b]/70 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Eyebrow and Title */}
        <div className="space-y-3 mb-8">
          <div className="text-xs font-bold font-mono text-[#38bdf8] uppercase tracking-wider">
            THE INTERACTIVE OBSERVATORY
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Step Inside the Live Network
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
            Experience real topology dynamics in live network communication. Packets, framing, routing loop detection, and self-healing convergence in real time.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-3 font-mono text-xs">
            <button
              onClick={() => handleTabClick('routing')}
              className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'routing'
                  ? 'bg-[#10b981]/20 border-[#10b981] text-[#34d399] font-bold shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                  : 'bg-[#0f172a] border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-[10px] text-emerald-500 font-bold">[SIM]</span>
              <span>Routing Loops</span>
            </button>

            <Link
              href="/sandbox"
              className="px-3 py-1.5 rounded-lg border bg-[#0f172a] border-slate-800 text-slate-400 hover:text-[#22d3ee] hover:border-[#06b6d4]/50 transition-all flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Resilient Sandbox Labs →</span>
            </Link>

            <Link
              href="/courses"
              className="px-3 py-1.5 rounded-lg border bg-[#0f172a] border-slate-800 text-slate-400 hover:text-purple-300 hover:border-purple-500/50 transition-all flex items-center gap-1.5"
            >
              <span>Hands-On Courses →</span>
            </Link>

            <button
              onClick={() => handleTabClick('convergence')}
              className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'convergence'
                  ? 'bg-[#10b981]/20 border-[#10b981] text-[#34d399] font-bold'
                  : 'bg-[#0f172a] border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Fast Convergence</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Left Progression Card & Right Live Topology Observatory */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Card: Understand. Fix. Verify. */}
          <div className="lg:col-span-5 bg-[#0b0f17] border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="space-y-5">
              {/* Badge */}
              <div className="inline-block px-2.5 py-1 rounded-md bg-[#10b981]/15 border border-[#10b981]/30 text-[#34d399] text-[10px] font-mono font-bold tracking-wider uppercase">
                [LIVE LAB // MASTERY PROGRESSION]
              </div>

              {/* Headline */}
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Understand. Fix. Verify.
              </h3>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                Understand root causality before taking action. Parse packet paths and network conditions in the terminal before executing configuration changes.
              </p>

              {/* 3 Step Progression List */}
              <div className="space-y-3 pt-2">
                {/* Step 1 */}
                <div
                  onClick={() => setActiveStep(1)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    activeStep === 1
                      ? 'bg-[#0f1a2e] border-emerald-500/50 shadow-md'
                      : 'bg-[#090d16] border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-xs">
                    <Search className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">1. Discover and observe</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      Inspect real packet traces and record live telemetry across nodes.
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div
                  onClick={() => {
                    setActiveStep(2);
                    setIsSimulatingDegradation(true);
                    onScenarioChange('degraded');
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    activeStep === 2
                      ? 'bg-[#0f1a2e] border-cyan-500/50 shadow-md'
                      : 'bg-[#090d16] border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5 text-xs">
                    <ShieldAlert className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">2. Find the root cause</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      Isolate routing loops, MTU mismatches, or degraded links.
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div
                  onClick={() => {
                    setActiveStep(3);
                    setIsSimulatingDegradation(false);
                    onScenarioChange('healthy');
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    activeStep === 3
                      ? 'bg-[#0f1a2e] border-emerald-500/50 shadow-md'
                      : 'bg-[#090d16] border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">3. Verify &amp; recover</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      Confirm dynamic reconvergence and zero packet drop failover.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between">
              <button
                onClick={onOpenTerminal}
                className="text-xs font-mono font-semibold text-[#34d399] hover:text-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Launch Debug Terminal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <Link
                href="/troubleshooting"
                className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>All Scenarios →</span>
              </Link>
            </div>
          </div>

          {/* Right Card: Interactive 2D Network Observatory Canvas */}
          <div className="lg:col-span-7 bg-[#0b0f17] border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xl relative overflow-hidden font-mono">
            
            {/* Top Toolbar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-slate-200 text-[11px] tracking-wide">
                  INTERACTIVE NETWORK OBSERVATORY
                </span>
                <span className="text-slate-500 text-[10px] hidden sm:inline">Changes: Live Observed</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSimulationPaused(!isSimulationPaused)}
                  className="px-2.5 py-1 rounded bg-[#111827] border border-slate-800 text-slate-300 hover:text-white text-[10px] flex items-center gap-1 cursor-pointer"
                >
                  {isSimulationPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-amber-400" />}
                  <span>{isSimulationPaused ? 'Resume' : 'Pause'}</span>
                </button>
                <Link
                  href="/sandbox"
                  className="p-1 rounded bg-[#111827] border border-slate-800 text-slate-400 hover:text-white flex items-center"
                  title="Open Fullscreen Sandbox Lab"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Simulated Live Topology Canvas */}
            <div className="relative h-[320px] sm:h-[360px] my-3 rounded-xl bg-[#070b12] border border-slate-800/60 overflow-hidden flex items-center justify-center">
              
              {/* Background Grid Lines */}
              <div className="absolute inset-0 bg-tech-grid opacity-15 pointer-events-none" />

              {/* Interactive SVG Network Graph */}
              <svg className="w-full h-full" viewBox="0 0 600 340">
                <defs>
                  <linearGradient id="linkGradHealthy" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="linkGradDegraded" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0.9" />
                  </linearGradient>
                </defs>

                {/* Graph Links */}
                {/* Host to Switch 1 */}
                <line x1="90" y1="230" x2="220" y2="140" stroke="#10b981" strokeWidth="2" strokeDasharray="4 2" />
                
                {/* Switch 1 to Router */}
                <line
                  x1="220"
                  y1="140"
                  x2="350"
                  y2="220"
                  stroke={isSimulatingDegradation ? 'url(#linkGradDegraded)' : '#10b981'}
                  strokeWidth="2.5"
                  strokeDasharray={isSimulatingDegradation ? '3 3' : 'none'}
                />

                {/* Switch 1 to Switch 2 */}
                <line x1="220" y1="140" x2="440" y2="140" stroke="#06b6d4" strokeWidth="2" />

                {/* Router to Switch 2 */}
                <line x1="350" y1="220" x2="440" y2="140" stroke="#10b981" strokeWidth="2" />

                {/* Switch 2 to Server */}
                <line x1="440" y1="140" x2="520" y2="70" stroke="#10b981" strokeWidth="2.5" />

                {/* Animated traveling packet dots */}
                {!isSimulationPaused && (
                  <>
                    <circle r="4" fill="#34d399" className="animate-ping" cx="220" cy="140" />
                    <circle r="3" fill="#22d3ee">
                      <animateMotion path="M 90 230 L 220 140 L 440 140 L 520 70" dur="3s" repeatCount="indefinite" />
                    </circle>
                    <circle r="3" fill="#10b981">
                      <animateMotion path="M 220 140 L 350 220 L 440 140" dur="2.4s" repeatCount="indefinite" />
                    </circle>
                  </>
                )}

                {/* Node 1: Host-Node */}
                <g
                  transform="translate(90, 230)"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredNode('Host-Client')}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <circle r="18" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                  <text y="4" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold">H1</text>
                  <text y="30" textAnchor="middle" fill="#94a3b8" fontSize="9">Host-Node</text>
                  <text y="40" textAnchor="middle" fill="#64748b" fontSize="7">10.0.10.2</text>
                </g>

                {/* Node 2: Edge-Switch-1 */}
                <g
                  transform="translate(220, 140)"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredNode('Edge-Switch-1')}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <circle r="22" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
                  <rect x="-10" y="-10" width="20" height="20" fill="none" stroke="#22d3ee" strokeWidth="1.5" rx="3" />
                  <text y="34" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontWeight="bold">Edge-Switch-1</text>
                  <text y="44" textAnchor="middle" fill="#64748b" fontSize="7">10.0.1.1</text>
                </g>

                {/* Node 3: Multi-Scope Router */}
                <g
                  transform="translate(350, 220)"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredNode('Multi-Scope-Router')}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <circle r="24" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                  <circle r="14" fill="none" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 2" />
                  <text y="36" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontWeight="bold">Multi-Scope-Router</text>
                  <text y="46" textAnchor="middle" fill="#64748b" fontSize="7">10.0.254.1</text>
                </g>

                {/* Node 4: Edge-Switch-2 */}
                <g
                  transform="translate(440, 140)"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredNode('Edge-Switch-2')}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <circle r="22" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
                  <rect x="-10" y="-10" width="20" height="20" fill="none" stroke="#22d3ee" strokeWidth="1.5" rx="3" />
                  <text y="34" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontWeight="bold">Edge-Switch-2</text>
                  <text y="44" textAnchor="middle" fill="#64748b" fontSize="7">10.0.2.1</text>
                </g>

                {/* Node 5: Server / Core Setup */}
                <g
                  transform="translate(520, 70)"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredNode('Core-Server')}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <rect x="-18" y="-18" width="36" height="36" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                  <text y="4" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold">SRV</text>
                  <text y="28" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontWeight="bold">Core Server</text>
                  <text y="38" textAnchor="middle" fill="#64748b" fontSize="7">10.0.100.5</text>
                </g>
              </svg>

              {/* Status Overlay Float Box */}
              <div className="absolute top-4 right-4 bg-[#0b1320]/90 border border-slate-700/80 rounded-xl p-3.5 shadow-2xl max-w-xs text-left z-20 backdrop-blur-md">
                <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${isSimulatingDegradation ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`} />
                    <span className="text-[11px] font-bold text-slate-100">
                      {isSimulatingDegradation ? 'Link Degradation Active' : 'Network Restored (100% UP)'}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono">IS-IS / BGP</span>
                </div>

                <p className="text-[10px] text-slate-300 mt-2 leading-relaxed">
                  {isSimulatingDegradation
                    ? 'Packets rerouted through backup Edge-Switch-2 ring with 0.94ms jitter.'
                    : 'Routing actively verified: packet transmitted via switch to server at 0.48 ms.'}
                </p>

                <button
                  onClick={handleToggleDegradation}
                  className={`mt-2.5 w-full py-1.5 px-2.5 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isSimulatingDegradation
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                  }`}
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{isSimulatingDegradation ? 'Restore Healthy Topology' : 'Simulate Link Degradation'}</span>
                </button>
              </div>
            </div>

            {/* Bottom Live Bar */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400">
              <div>
                <span className="text-emerald-400">Dispatched HTTP/3 packet from host. </span>
                <span className="text-slate-500">LATENCY: </span>
                <span className="text-emerald-400 font-bold">0.60 ms</span>
                <span className="text-slate-500">, LINKS: </span>
                <span className="text-emerald-400 font-bold">7/7 UP</span>
              </div>
              <div className="text-slate-500">
                TOPOLOGY: <span className="text-cyan-400 font-semibold">DUAL-CORE MESH</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

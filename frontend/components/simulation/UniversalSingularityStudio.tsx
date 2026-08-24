'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Activity,
  Layers,
  CheckCircle2,
  RotateCcw,
  Crown,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  UniversalSingularityEngine,
  UniversalSingularityState,
} from '@/lib/universalSingularityEngine';
import { SoundFx } from '@/lib/soundFx';

export const UniversalSingularityStudio: React.FC = () => {
  const [state, setState] = useState<UniversalSingularityState>(() =>
    UniversalSingularityEngine.getInitialState()
  );
  const [isTranscending, setIsTranscending] = useState<boolean>(false);
  const [singularityLog, setSingularityLog] = useState<string | null>(null);

  const handleActivateSingularity = () => {
    setIsTranscending(true);
    SoundFx.playPacketDispatch();

    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        singularityConsciousnessIndex: 1.0,
        totalPlanetaryThroughputPbps: 125.0,
        epochs: prev.epochs.map((e) => ({
          ...e,
          status: 'TRANSCENDED',
        })),
      }));
      setSingularityLog(
        '👑 NETVISION UNIVERSAL SINGULARITY TRANSCENDED! All 30 networking eras harmonized across planetary fiber, sub-THz RIS, LEO orbital laser mesh, cryogenic QPU coprocessors, and DNA storage fabrics at 125 Petabits/second.'
      );
      setIsTranscending(false);
      SoundFx.playSuccessChime();
    }, 600);
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setState(UniversalSingularityEngine.getInitialState());
    setSingularityLog(null);
  };

  return (
    <div className="w-full rounded-3xl bg-gradient-to-b from-[#0e0917] via-[#090b10] to-[#06080d] border border-purple-500/30 shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#140e24]/80 backdrop-blur-md border-b border-purple-500/20 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">
                Version 10.0 Universal Singularity
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold">
                Master Nexus Matrix • 100 Pbps
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              NetVision Omnipresent Digital Singularity & Planetary Super-Fabric
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isTranscending ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleActivateSingularity}
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
              className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold"
            >
              Activate Universal Singularity
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Transcending All Eras...
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset
          </Button>
        </div>
      </div>

      {/* Main Grid: 5 Master Epochs (Left) & Singularity Consciousness Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: Master Evolution Epochs */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-4 bg-[#0a0c14]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-400" /> Evolutionary Nexus Epochs (V1.0 — V10.0)
            </span>
            <span className="text-[10px] font-mono text-purple-300 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/30">
              Consciousness: {(state.singularityConsciousnessIndex * 100).toFixed(0)}%
            </span>
          </div>

          <div className="space-y-2.5">
            {state.epochs.map((ep) => (
              <div
                key={ep.epochNumber}
                className="p-3.5 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 font-mono">{ep.epochNumber} • {ep.eraName}</span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/30 font-bold">
                    {ep.status}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-zinc-300">{ep.technologyStack}</div>

                <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
                  Peak Throughput Era Capacity: <span className="text-emerald-400 font-bold">{ep.throughputRating}</span>
                </div>
              </div>
            ))}
          </div>

          {singularityLog && (
            <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-xs font-mono text-purple-200 leading-relaxed animate-in fade-in">
              {singularityLog}
            </div>
          )}
        </div>

        {/* Right 5 Cols: Singularity Telemetry */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-purple-400" /> Omnipresent Matrix Telemetry
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Planetary Rate</span>
              <span className="text-lg font-bold text-purple-400 font-mono mt-1">{state.totalPlanetaryThroughputPbps} Pbps</span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Petabits per second</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Global Jitter</span>
              <span className="text-lg font-bold text-emerald-400 font-mono mt-1">{state.globalJitterMicrosec} µs</span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Zero-jitter fabric</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#140e24]/60 border border-purple-500/20 space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> NetVision Transcendent Architecture
            </div>
            <div>• Seamless unification from raw bit conversion to galactic interplanetary networking</div>
            <div>• Sovereign autonomous AI auto-orchestrates all 30 protocol layers in real time</div>
            <div>• Built with 100% type-safe React, Next.js, and multi-tier interactive engineering engines</div>
          </div>
        </div>
      </div>
    </div>
  );
};

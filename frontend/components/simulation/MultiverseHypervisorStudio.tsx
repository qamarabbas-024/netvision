'use client';

import React, { useState } from 'react';
import {
  Layers,
  Activity,
  CheckCircle2,
  Zap,
  RotateCcw,
  Orbit,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  MultiverseHypervisorEngine,
  MultiverseState,
} from '@/lib/multiverseHypervisorEngine';
import { SoundFx } from '@/lib/soundFx';

export const MultiverseHypervisorStudio: React.FC = () => {
  const [state, setState] = useState<MultiverseState>(() =>
    MultiverseHypervisorEngine.getInitialState()
  );
  const [isReconciling, setIsReconciling] = useState<boolean>(false);
  const [multiLog, setMultiLog] = useState<string | null>(null);

  const handleReconcileTimelines = () => {
    setIsReconciling(true);
    SoundFx.playPacketDispatch();

    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        optimalConvergencePct: 99.9,
        universes: prev.universes.map((u) => ({
          ...u,
          status: 'SYNCHRONIZED',
          entropyPpm: Math.max(2, u.entropyPpm - 6),
        })),
      }));
      setMultiLog(
        '🌌 Bayesian Cross-Universe Consensus achieved! Merged optimal photonics from Universe-β and quantum security from Universe-α into prime production reality. 99.9% timeline convergence.'
      );
      setIsReconciling(false);
      SoundFx.playSuccessChime();
    }, 600);
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setState(MultiverseHypervisorEngine.getInitialState());
    setMultiLog(null);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00f0ff]">
            <Orbit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
                Version 9.9 Multi-Verse Hypervisor
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                4 Parallel Universes • 60 Hz Lockstep
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Universal Multi-Verse Cross-Simulation Hypervisor & Timeline Consensus
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isReconciling ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleReconcileTimelines}
              leftIcon={<Zap className="w-3.5 h-3.5" />}
            >
              Reconcile Multi-Verse Timelines
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Reconciling Realities...
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset
          </Button>
        </div>
      </div>

      {/* Main Grid: 4 Parallel Universes (Left) & Cross-Timeline Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: Universe Quadrants */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#00f0ff]" /> Parallel Simulation Branches
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
              Convergence: {state.optimalConvergencePct}%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {state.universes.map((u) => (
              <div
                key={u.universeId}
                className="p-3.5 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 font-mono">{u.universeId}</span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 font-bold">
                    Weight: {u.consensusWeightPct}%
                  </span>
                </div>

                <div className="text-xs font-bold text-white font-mono">{u.codename}</div>
                <div className="text-[10px] font-mono text-zinc-400">{u.focusDomain}</div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-400 mt-1 pt-1 border-t border-zinc-800">
                  <div>Rate: <span className="text-emerald-400 font-bold">{u.throughputScoreGbps}G</span></div>
                  <div>Entropy: <span className="text-cyan-300 font-bold">{u.entropyPpm} ppm</span></div>
                </div>
              </div>
            ))}
          </div>

          {multiLog && (
            <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs font-mono text-cyan-200 leading-relaxed animate-in fade-in">
              {multiLog}
            </div>
          )}
        </div>

        {/* Right 5 Cols: Hypervisor Physics */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" /> Hypervisor Consensus Engine
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Lockstep Sync</span>
              <span className="text-lg font-bold text-emerald-400 font-mono mt-1">{state.frameRateHz} FPS</span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Deterministic clocking</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Branches Active</span>
              <span className="text-lg font-bold text-cyan-400 font-mono mt-1">{state.totalParallelUniverses}</span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Simultaneous realities</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Multi-Verse Hypervisor Logic
            </div>
            <div>• Simulates disparate architectural paradigms in parallel sandbox branches</div>
            <div>• Bayesian state reconciliation merges optimal decisions without downtime</div>
            <div>• Eliminates trial-and-error risks in mission-critical planetary production networks</div>
          </div>
        </div>
      </div>
    </div>
  );
};

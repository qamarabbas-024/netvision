'use client';

import React, { useState } from 'react';
import {
  Activity,
  Layers,
  CheckCircle2,
  Zap,
  RotateCcw,
  GitBranch,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  SelfEvolvingTopologyEngine,
  SelfEvolvingState,
} from '@/lib/selfEvolvingTopologyEngine';
import { SoundFx } from '@/lib/soundFx';

export const SelfEvolvingTopologyStudio: React.FC = () => {
  const [state, setState] = useState<SelfEvolvingState>(() =>
    SelfEvolvingTopologyEngine.getInitialState()
  );
  const [isEvolving, setIsEvolving] = useState<boolean>(false);
  const [evolveLog, setEvolveLog] = useState<string | null>(null);

  const handleEvolveTopology = () => {
    setIsEvolving(true);
    SoundFx.playPacketDispatch();

    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        generationNumber: prev.generationNumber + 1,
        fitnessScore: 0.998,
        totalRewiresExecuted: prev.totalRewiresExecuted + 4,
        links: prev.links.map((link) =>
          link.status === 'CONGESTED'
            ? { ...link, currentUtilizationPct: 42, status: 'OPTIMAL' }
            : link
        ),
      }));
      setEvolveLog(
        '🧬 Genetic AI Algorithm mutated network graph generation #143! Added direct East-West photonic bypass between Spine-01 and Leaf-04. Congestion collapsed from 88% to 42% in 2.4 ms.'
      );
      setIsEvolving(false);
      SoundFx.playSuccessChime();
    }, 500);
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setState(SelfEvolvingTopologyEngine.getInitialState());
    setEvolveLog(null);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00f0ff]">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
                Version 9.2 Self-Evolving Mesh
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                Genetic Graph Morphing • Gen #{state.generationNumber}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Autonomous Self-Evolving Network Micro-Topologies
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isEvolving ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleEvolveTopology}
              leftIcon={<Zap className="w-3.5 h-3.5" />}
            >
              Trigger AI Topology Evolution
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Mutating Graph Links...
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset
          </Button>
        </div>
      </div>

      {/* Main Grid: Graph Links (Left) & Genetic Fitness Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: Dynamic Links */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#00f0ff]" /> Morphable Interconnect Links
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              Fitness: {(state.fitnessScore * 100).toFixed(1)}%
            </span>
          </div>

          <div className="space-y-3">
            {state.links.map((l, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col gap-1.5 ${
                  l.status === 'CONGESTED'
                    ? 'border-rose-500/50 bg-rose-950/20'
                    : 'border-[#262c42] bg-[#121522]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-white">
                    <span className="text-cyan-300">{l.sourceNode}</span>
                    <span className="text-zinc-500">↔</span>
                    <span className="text-emerald-400">{l.targetNode}</span>
                  </div>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold border ${
                      l.status === 'CONGESTED'
                        ? 'bg-rose-950/60 text-rose-300 border-rose-500/40 animate-pulse'
                        : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {l.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-zinc-400 mt-1">
                  <div>Capacity: <span className="text-white">{l.bandwidthCapacityGbps} Gbps</span></div>
                  <div>Load: <span className={l.currentUtilizationPct > 75 ? 'text-rose-400 font-bold' : 'text-cyan-300'}>{l.currentUtilizationPct}%</span></div>
                  <div>Metric: <span className="text-emerald-400 font-bold">{l.weightMetric}</span></div>
                </div>
              </div>
            ))}
          </div>

          {evolveLog && (
            <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs font-mono text-cyan-200 leading-relaxed animate-in fade-in">
              {evolveLog}
            </div>
          )}
        </div>

        {/* Right 5 Cols: Genetic Topology Optimizations */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" /> Graph Mutation Metrics
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Rewires Executed</span>
              <span className="text-lg font-bold text-emerald-400 font-mono mt-1">{state.totalRewiresExecuted}</span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Zero dropped frames</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Graph Diameter</span>
              <span className="text-lg font-bold text-cyan-400 font-mono mt-1">{state.graphDiameterHops} hops</span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Ultra-low diameter</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Bio-Inspired Evolution
            </div>
            <div>• Real-time traffic heatmaps drive evolutionary fitness calculations</div>
            <div>• Dynamically constructs ephemeral direct optical bypass links during burst phases</div>
            <div>• Automatically tears down unutilized paths to minimize idle port power</div>
          </div>
        </div>
      </div>
    </div>
  );
};

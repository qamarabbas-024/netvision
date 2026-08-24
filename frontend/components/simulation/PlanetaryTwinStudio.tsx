'use client';

import React, { useState } from 'react';
import {
  Globe,
  Activity,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Crown,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  PlanetaryTwinEngine,
  PlanetaryTwinState,
} from '@/lib/planetaryTwinEngine';
import { SoundFx } from '@/lib/soundFx';

export const PlanetaryTwinStudio: React.FC = () => {
  const [state, setState] = useState<PlanetaryTwinState>(() =>
    PlanetaryTwinEngine.getInitialState()
  );
  const [isHealing, setIsHealing] = useState<boolean>(false);
  const [healingLog, setHealingLog] = useState<string | null>(null);

  const handleTriggerSelfHealing = () => {
    setIsHealing(true);
    SoundFx.playPacketDispatch();

    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        autonomousAgentCorrections: prev.autonomousAgentCorrections + 8,
        totalPlanetaryThroughputTbps: +(prev.totalPlanetaryThroughputTbps + 24.8).toFixed(1),
      }));
      setHealingLog(
        '🌐 Planetary Autonomous Orchestrator executed closed-loop optimization in 3.8 ms across Space Lasers, Subsea Fiber, Terrestrial DWDM, and GPU AI Fabrics. 0 packet drops across 867.4 Tbps global traffic.'
      );
      setIsHealing(false);
      SoundFx.playSuccessChime();
    }, 600);
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setState(PlanetaryTwinEngine.getInitialState());
    setHealingLog(null);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00f0ff]">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
                Version 8.0 Planetary Digital Twin
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                Universal Multi-Layer NOC
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Planetary Digital Reality Twin & Autonomous Infrastructure Matrix
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isHealing ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleTriggerSelfHealing}
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Trigger Planetary AI Self-Healing
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Optimizing Planetary Fabric...
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset
          </Button>
        </div>
      </div>

      {/* Main Grid: Multi-Layer Planetary Dimensions (Left) & Global Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: Multi-Layer Dimensions */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#00f0ff]" /> Unified Planetary Network Dimensions
            </span>
            <span className="text-[10px] font-mono text-emerald-400">
              Global Health: {state.globalHealthScorePct}%
            </span>
          </div>

          <div className="space-y-3">
            {state.layers.map((layer) => (
              <div
                key={layer.dimension}
                className="p-3.5 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono">{layer.title}</span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-bold">
                    {layer.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-zinc-400 mt-1">
                  <div>Nodes: <span className="text-white font-bold">{layer.activeNodes}</span></div>
                  <div>Throughput: <span className="text-cyan-300 font-bold">{layer.aggregateThroughputTbps} Tbps</span></div>
                  <div>SLA: <span className="text-emerald-400">{layer.slaHealthPct}%</span></div>
                </div>
              </div>
            ))}
          </div>

          {healingLog && (
            <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs font-mono text-cyan-200 leading-relaxed animate-in fade-in">
              {healingLog}
            </div>
          )}
        </div>

        {/* Right 5 Cols: Global Telemetry Deck */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" /> Planetary Matrix Telemetry
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Planetary Throughput</span>
              <span className="text-lg font-bold text-cyan-400 font-mono mt-1">
                {state.totalPlanetaryThroughputTbps} Tbps
              </span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Global aggregate traffic</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">AI Corrections</span>
              <span className="text-lg font-bold text-emerald-400 font-mono mt-1">
                {state.autonomousAgentCorrections}
              </span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Zero-touch self-heals</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Planetary Digital Twin Matrix
            </div>
            <div>• Real-time digital replica mirroring terrestrial, space, subsea, and quantum infrastructure</div>
            <div>• Predictive AI graph models forecast fiber cuts and solar storm degradation before outages occur</div>
            <div>• Autonomous closed-loop routing preserves sub-50ms latency across any two points on Earth</div>
          </div>
        </div>
      </div>
    </div>
  );
};

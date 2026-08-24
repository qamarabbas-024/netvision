'use client';

import React, { useState } from 'react';
import {
  Layers,
  Activity,
  CheckCircle2,
  Zap,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  UecEngine,
  UecTransportState,
} from '@/lib/uecEngine';
import { SoundFx } from '@/lib/soundFx';

export const UltraEthernetStudio: React.FC = () => {
  const [state, setState] = useState<UecTransportState>(() =>
    UecEngine.getInitialState()
  );
  const [isSpraying, setIsSpraying] = useState<boolean>(false);
  const [sprayResult, setSprayResult] = useState<string | null>(null);

  const handleSprayPackets = () => {
    setIsSpraying(true);
    SoundFx.playPacketDispatch();

    setState((prev) => ({
      ...prev,
      totalPacketsSprayed: prev.totalPacketsSprayed + 10000,
      trimmedPacketsRecovered: prev.trimmedPacketsRecovered + 4,
      spines: prev.spines.map((spine) => ({
        ...spine,
        packetsSprayed: spine.packetsSprayed + 2500,
      })),
    }));

    setTimeout(() => {
      setSprayResult(
        '⚡ 10,000 Packets sprayed uniformly across all 4 Spines (2,500 pkts/spine). 0% Flow Hash Collision. Hardware NIC reassembled out-of-order sequence in 1.2 µs.'
      );
      setIsSpraying(false);
      SoundFx.playSuccessChime();
    }, 500);
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setState(UecEngine.getInitialState());
    setSprayResult(null);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00f0ff]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
                Version 7.2 Ultra Ethernet (UEC)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                Packet Spraying • In-Network Computing
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Next-Gen AI Fabric Multipath Spraying & INC Reduction
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isSpraying ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleSprayPackets}
              leftIcon={<Zap className="w-3.5 h-3.5" />}
            >
              Dispatch 10,000 Packet Spray
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Spraying across Spines...
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset
          </Button>
        </div>
      </div>

      {/* Main Grid: Spine Multipath Grid (Left) & UEC vs Legacy Metrics (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: Spine Multipath */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#00f0ff]" /> 800G Spine Packet Spray Distribution
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
              Total Sprayed: {state.totalPacketsSprayed.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {state.spines.map((spine) => (
              <div
                key={spine.pathId}
                className="p-3.5 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono">{spine.spineName}</span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                    {spine.latencyUs} µs
                  </span>
                </div>

                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400">Packets:</span>
                  <span className="text-cyan-300 font-bold">{spine.packetsSprayed.toLocaleString()}</span>
                </div>

                <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> In-Network Math (INC) Enabled
                </div>
              </div>
            ))}
          </div>

          {sprayResult && (
            <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs font-mono text-cyan-200 leading-relaxed animate-in fade-in">
              {sprayResult}
            </div>
          )}
        </div>

        {/* Right 5 Cols: UEC Advantages */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" /> UEC vs Legacy RoCEv2
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Flow Hash Collisions</span>
              <span className="text-lg font-bold text-emerald-400 font-mono mt-1">0%</span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Per-packet spraying</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Trimmed Pkts Recovered</span>
              <span className="text-lg font-bold text-cyan-400 font-mono mt-1">
                {state.trimmedPacketsRecovered}
              </span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Header-only fast ECN</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Ultra Ethernet Innovations
            </div>
            <div>• Eliminates ECMP flow hash elephant polarization collisions</div>
            <div>• Selective packet trimming converts packet drops into instantaneous feedback</div>
            <div>• In-Network Computing (INC) computes gradient AllReduce inside switches</div>
          </div>
        </div>
      </div>
    </div>
  );
};

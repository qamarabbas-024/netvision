'use client';

import React, { useState, useEffect } from 'react';
import {
  Clock,
  Activity,
  Layers,
  Zap,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  TsnEngine,
  TsnCycleProfile,
} from '@/lib/tsnEngine';
import { SoundFx } from '@/lib/soundFx';

export const TsnDeterministicStudio: React.FC = () => {
  const [profile] = useState<TsnCycleProfile>(() => TsnEngine.getInitialProfile());
  const [activeSlot, setActiveSlot] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [lastBurstResult, setLastBurstResult] = useState<string | null>(null);

  // Microsecond cyclic clock simulation
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setActiveSlot((prev) => (prev + 1) % 3);
    }, 900);
    return () => clearInterval(interval);
  }, [isSimulating]);

  const handleDispatchBurst = () => {
    SoundFx.playPacketDispatch();
    setLastBurstResult('⚡ LiDAR Emergency Braking Packet scheduled in Queue 7 Window. Zero buffer queuing delay (0.18 µs wire latency, 0.00 µs jitter). Collision avoided.');
    setTimeout(() => {
      SoundFx.playSuccessChime();
    }, 300);
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setLastBurstResult(null);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                Version 6.3 Time-Sensitive Networking
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
                IEEE 802.1Qbv TAS Shaper
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Deterministic Gate Control Lists (GCL) & Microsecond Scheduling
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleDispatchBurst}
            leftIcon={<Zap className="w-3.5 h-3.5" />}
          >
            Dispatch Critical Sensor Burst
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset
          </Button>
        </div>
      </div>

      {/* Main Grid: GCL Gate Timeline (Left) & Real-Time Jitter Benchmarks (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: GCL Cyclic Timeline */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" /> Cyclic Schedule (T_cycle = {profile.cycleTimeUs} µs)
            </span>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
              Guard Band: {profile.guardBandUs} µs Active
            </span>
          </div>

          {/* Queue Gate States */}
          <div className="space-y-3">
            {profile.queues.map((q, idx) => {
              const isActiveSlot = activeSlot === idx;
              return (
                <div
                  key={q.queueId}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col gap-2 ${
                    isActiveSlot
                      ? 'border-amber-400 bg-amber-950/20 shadow-glow-cyan'
                      : 'border-[#262c42] bg-[#121522]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white font-mono">
                        Queue #{q.queueId} (Pri {q.priority}) — {q.trafficType}
                      </span>
                    </div>

                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded border font-bold ${
                        isActiveSlot
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 animate-pulse'
                          : 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                      }`}
                    >
                      {isActiveSlot ? 'GATE: OPEN' : 'GATE: CLOSED'}
                    </span>
                  </div>

                  {/* Progress Bar of Slot Allocation */}
                  <div className="w-full h-2 rounded-full bg-black/50 overflow-hidden">
                    <div
                      style={{ width: `${(q.allocatedTimeUs / profile.cycleTimeUs) * 100}%` }}
                      className={`h-full rounded-full transition-all ${
                        isActiveSlot ? 'bg-amber-400' : 'bg-zinc-700'
                      }`}
                    />
                  </div>

                  <span className="text-[10px] font-mono text-zinc-400">
                    Allocated Window: {q.allocatedTimeUs} µs / {profile.cycleTimeUs} µs
                  </span>
                </div>
              );
            })}
          </div>

          {lastBurstResult && (
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs font-mono text-amber-200 animate-in fade-in">
              {lastBurstResult}
            </div>
          )}
        </div>

        {/* Right 5 Cols: Jitter & TSN Physics */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-amber-400" /> Real-Time Latency & Jitter
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">TSN Deterministic Jitter</span>
              <span className="text-lg font-bold text-emerald-400 font-mono mt-1">0.18 µs</span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Bounded Max Jitter</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Standard Ethernet</span>
              <span className="text-lg font-bold text-rose-400 font-mono mt-1">450.0 µs</span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Unbounded FIFO Queue</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> IEEE 802.1Qbv Industrial Applications
            </div>
            <div>• Autonomous Vehicle drive-by-wire & LiDAR sensors</div>
            <div>• Smart Factory industrial robotic motion synchronization</div>
            <div>• Aerospace avionics ARINC-664 Ethernet replacement</div>
          </div>
        </div>
      </div>
    </div>
  );
};

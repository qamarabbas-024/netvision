'use client';

import React, { useState } from 'react';
import {
  Zap,
  Activity,
  Layers,
  CheckCircle2,
  RotateCcw,
  Timer,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  HollowCoreEngine,
  FiberPhysicsProfile,
} from '@/lib/hollowCoreEngine';
import { SoundFx } from '@/lib/soundFx';

export const HollowCoreFiberStudio: React.FC = () => {
  const [profiles] = useState<FiberPhysicsProfile[]>(() =>
    HollowCoreEngine.getProfiles()
  );
  const [isRacing, setIsRacing] = useState<boolean>(false);
  const [raceResult, setRaceResult] = useState<string | null>(null);

  const routeDistanceKm = 1200; // Chicago -> New York

  const handleDispatchRace = () => {
    setIsRacing(true);
    SoundFx.playPacketDispatch();

    setTimeout(() => {
      setRaceResult(
        '🚀 Hollow-Core Air-Core Fiber arrived in 4.00 ms vs Standard Silica Glass in 5.88 ms over 1,200 km! 1.88 ms speed-of-light advantage secured the HFT arbitrage order.'
      );
      setIsRacing(false);
      SoundFx.playSuccessChime();
    }, 500);
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setRaceResult(null);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                Version 8.5 Hollow-Core Fiber
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
                Speed of Light • 3.33 µs/km
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Hollow-Core Fiber (NANF) & Speed-of-Light Optical Physics
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isRacing ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleDispatchRace}
              leftIcon={<Zap className="w-3.5 h-3.5" />}
            >
              Dispatch HFT Trade Packet (1,200 km)
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Transmitting Optical Photons...
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset
          </Button>
        </div>
      </div>

      {/* Main Grid: Fiber Physics Comparison (Left) & Speed-of-Light Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: Physics Profiles */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" /> Optical Waveguide Physics
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
              Target Link: Chicago (CME) ↔ New York (NASDAQ)
            </span>
          </div>

          <div className="space-y-3">
            {profiles.map((p) => {
              const latencyMs = ((p.propagationLatencyUsPerKm * routeDistanceKm) / 1000).toFixed(2);
              const isHcf = p.id === 'hcf-nanf';

              return (
                <div
                  key={p.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col gap-2 ${
                    isHcf
                      ? 'border-amber-500/50 bg-amber-950/20'
                      : 'border-[#262c42] bg-[#121522]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-mono">{p.name}</span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold border ${
                        isHcf
                          ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                          : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                      }`}
                    >
                      Refractive Index n = {p.refractiveIndex}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-zinc-400">
                    <div>Light Speed: <span className="text-white">{p.lightSpeedKmPerSec.toLocaleString()} km/s</span></div>
                    <div>Latency/km: <span className={isHcf ? 'text-amber-400 font-bold' : 'text-zinc-400'}>{p.propagationLatencyUsPerKm} µs</span></div>
                    <div>1,200 km Transit: <span className={isHcf ? 'text-emerald-400 font-bold text-xs' : 'text-rose-400 font-bold text-xs'}>{latencyMs} ms</span></div>
                  </div>
                </div>
              );
            })}
          </div>

          {raceResult && (
            <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs font-mono text-amber-200 leading-relaxed animate-in fade-in">
              {raceResult}
            </div>
          )}
        </div>

        {/* Right 5 Cols: Physics Principles */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-amber-400" /> Waveguide Physics Breakdown
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#121522] border border-[#262c42] space-y-2 text-[11px] font-mono text-zinc-400">
            <span className="text-white font-bold block">Key Hollow-Core Discoveries:</span>
            <div>• Light travels in air 46% faster than in solid silica glass ($c/1.0003$ vs $c/1.468$)</div>
            <div>• Cuts optical transmission delay by 1.56 microseconds for every kilometer</div>
            <div>• Near-zero non-linear Kerr effect allows transmitting 10x higher optical laser power without signal distortion</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Production Applications
            </div>
            <div>• HFT exchanges connect matching engines via hollow core to eliminate microsecond arb latency</div>
            <div>• Distributed AI superclusters span metro campuses without interconnect bottleneck</div>
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import {
  Satellite,
  Activity,
  Layers,
  CheckCircle2,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  OrbitalDatacenterEngine,
  OrbitalDatacenterState,
} from '@/lib/orbitalDatacenterEngine';
import { SoundFx } from '@/lib/soundFx';

export const OrbitalDatacenterStudio: React.FC = () => {
  const [state, setState] = useState<OrbitalDatacenterState>(() =>
    OrbitalDatacenterEngine.getInitialState()
  );
  const [isComputing, setIsComputing] = useState<boolean>(false);
  const [spaceLog, setSpaceLog] = useState<string | null>(null);

  const handleDispatchSpaceTask = () => {
    setIsComputing(true);
    SoundFx.playPacketDispatch();

    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        totalSpaceComputePflops: +(prev.totalSpaceComputePflops + 2.4).toFixed(1),
      }));
      setSpaceLog(
        '🛰️ Space Compute Workload processed in orbit across 200 Gbps Optical Laser crosslinks! 95% downlink payload filtered on-orbit with 0 Watts terrestrial water cooling.'
      );
      setIsComputing(false);
      SoundFx.playSuccessChime();
    }, 500);
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setState(OrbitalDatacenterEngine.getInitialState());
    setSpaceLog(null);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00f0ff]">
            <Satellite className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
                Version 9.7 Orbital Data Centers
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                LEO 600km • 200 Gbps OISL • PUE 1.002
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Zero-Gravity Orbital Data Center Satellite Mesh & Space Compute
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isComputing ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleDispatchSpaceTask}
              leftIcon={<Zap className="w-3.5 h-3.5" />}
            >
              Dispatch Space Laser Task
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Processing on Orbit...
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset
          </Button>
        </div>
      </div>

      {/* Main Grid: Orbital Pods (Left) & Space Physics Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: Pods */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#00f0ff]" /> Active Space Compute Pods (LEO)
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
              {state.constellationName}
            </span>
          </div>

          <div className="space-y-3">
            {state.pods.map((pod) => (
              <div
                key={pod.podId}
                className="p-3.5 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono">{pod.name}</span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 font-bold">
                    Alt: {pod.orbitalAltitudeKm} km
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-zinc-400 mt-1">
                  <div>Solar Power: <span className="text-amber-400 font-bold">{pod.solarPowerGenerationWatts} W</span></div>
                  <div>Laser Crosslink: <span className="text-emerald-400 font-bold">{pod.oislBandwidthGbps} Gbps</span></div>
                  <div>Edge TPU: <span className="text-white font-bold">{pod.edgeInferenceTops} TOPS</span></div>
                </div>
              </div>
            ))}
          </div>

          {spaceLog && (
            <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs font-mono text-cyan-200 leading-relaxed animate-in fade-in">
              {spaceLog}
            </div>
          )}
        </div>

        {/* Right 5 Cols: Space Physics & Efficiency */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" /> Space Thermodynamics & PUE
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Cooling PUE</span>
              <span className="text-lg font-bold text-emerald-400 font-mono mt-1">{state.coolingPueRatio}</span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Deep space 3K radiative</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Space Compute</span>
              <span className="text-lg font-bold text-cyan-400 font-mono mt-1">{state.totalSpaceComputePflops} PFLOPS</span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Solar-powered TPUs</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Orbital Compute Benefits
            </div>
            <div>• Infinite 24/7 solar energy in dawn-dusk sun-synchronous orbits</div>
            <div>• Zero water consumption or terrestrial land footprint for mega data centers</div>
            <div>• Optical Inter-Satellite Lasers provide low-latency global mesh transport</div>
          </div>
        </div>
      </div>
    </div>
  );
};

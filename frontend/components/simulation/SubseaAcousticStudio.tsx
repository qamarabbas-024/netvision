'use client';

import React, { useState } from 'react';
import {
  Waves,
  Activity,
  CheckCircle2,
  Zap,
  RotateCcw,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  SubseaAcousticEngine,
  SubseaCableState,
} from '@/lib/subseaAcousticEngine';
import { SoundFx } from '@/lib/soundFx';

export const SubseaAcousticStudio: React.FC = () => {
  const [state, setState] = useState<SubseaCableState>(() =>
    SubseaAcousticEngine.getInitialState()
  );
  const [isSeismicActive, setIsSeismicActive] = useState<boolean>(false);
  const [dasLog, setDasLog] = useState<string | null>(null);

  const handleSimulateSeismicStrain = () => {
    setIsSeismicActive(true);
    SoundFx.playPacketDrop();

    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        acousticAnomaliesDetected: prev.acousticAnomaliesDetected + 1,
        repeaters: prev.repeaters.map((r, idx) => ({
          ...r,
          acousticStrainNanostrain: idx === 2 ? 482 : r.acousticStrainNanostrain,
          status: idx === 2 ? 'HIGH_STRAIN_ALERT' : 'NOMINAL',
        })),
      }));
      setDasLog(
        '🌊 Distributed Acoustic Sensing (DAS) alert at Km 3,412 (Mid-Atlantic Ridge, 4,800m depth)! Rayleigh backscatter phase shift detected 482 nε tectonic vibration. Optical traffic proactively steered to alternate fiber pair.'
      );
      setIsSeismicActive(false);
      SoundFx.playSuccessChime();
    }, 500);
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setState(SubseaAcousticEngine.getInitialState());
    setDasLog(null);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00f0ff]">
            <Waves className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
                Version 8.3 Subsea Cable Sensing
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                DAS Rayleigh Backscatter • OTDR
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Transoceanic Submarine Fiber & Distributed Acoustic Sensing
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isSeismicActive ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleSimulateSeismicStrain}
              leftIcon={<Zap className="w-3.5 h-3.5" />}
            >
              Simulate Subsea Tectonic Strain
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Analyzing Rayleigh Waves...
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset
          </Button>
        </div>
      </div>

      {/* Main Grid: Submersible Repeaters (Left) & DAS Acoustic Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: Repeaters */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#00f0ff]" /> Transoceanic Repeater Array ({state.totalLengthKm.toLocaleString()} km)
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
              Capacity: {state.capacityTbps} Tbps
            </span>
          </div>

          <div className="space-y-3">
            {state.repeaters.map((r) => (
              <div
                key={r.repeaterId}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col gap-2 ${
                  r.status === 'HIGH_STRAIN_ALERT'
                    ? 'border-amber-400 bg-amber-950/20 shadow-glow-cyan'
                    : 'border-[#262c42] bg-[#121522]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono">{r.repeaterId}</span>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold border ${
                      r.status === 'HIGH_STRAIN_ALERT'
                        ? 'bg-amber-950/60 text-amber-300 border-amber-500/40 animate-pulse'
                        : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {r.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-zinc-400">
                  <div>Position: <span className="text-white">Km {r.kmPosition}</span></div>
                  <div>Depth: <span className="text-cyan-300">{r.oceanDepthMeters} m</span></div>
                  <div>Acoustic Strain: <span className={r.acousticStrainNanostrain > 50 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>{r.acousticStrainNanostrain} nε</span></div>
                </div>
              </div>
            ))}
          </div>

          {dasLog && (
            <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs font-mono text-cyan-200 leading-relaxed animate-in fade-in">
              {dasLog}
            </div>
          )}
        </div>

        {/* Right 5 Cols: DAS Acoustic Physics */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" /> Rayleigh Backscattering Physics
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#121522] border border-[#262c42] space-y-2 text-[11px] font-mono text-zinc-400">
            <span className="text-white font-bold block">Distributed Sensing Capabilities:</span>
            <div>• Converts thousands of kilometers of dark optical fiber into high-density seismic microphones</div>
            <div>• Detects acoustic vibrations from earthquakes, ship anchors, and marine wildlife</div>
            <div>• Optical Time-Domain Reflectometry (OTDR) locates micro-bends with sub-meter accuracy</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Proactive Cable Protection
            </div>
            <div>• Early warning of anchor drags triggers vessel radio alerts before cables are snagged</div>
            <div>• Real-time fault diversion switches live traffic before physical fiber severance</div>
          </div>
        </div>
      </div>
    </div>
  );
};

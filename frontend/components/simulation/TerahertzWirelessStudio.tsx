'use client';

import React, { useState } from 'react';
import {
  Activity,
  Layers,
  CheckCircle2,
  Zap,
  RotateCcw,
  Wifi,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  TerahertzWirelessEngine,
  TerahertzState,
} from '@/lib/terahertzWirelessEngine';
import { SoundFx } from '@/lib/soundFx';

export const TerahertzWirelessStudio: React.FC = () => {
  const [state, setState] = useState<TerahertzState>(() =>
    TerahertzWirelessEngine.getInitialState()
  );
  const [isAligning, setIsAligning] = useState<boolean>(false);
  const [thzLog, setThzLog] = useState<string | null>(null);

  const handleAlignRis = () => {
    setIsAligning(true);
    SoundFx.playPacketDispatch();

    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        totalWirelessThroughputGbps: 180,
        sectors: prev.sectors.map((s) =>
          s.risReflectionAssisted
            ? { ...s, throughputGbps: 100, status: 'RIS_REFLECTED' }
            : s
        ),
      }));
      setThzLog(
        '✨ 1,024-Element Metamaterial RIS phase shifted in 0.8 µs! Bypassed skyscraper obstruction and delivered 100 Gbps wireless backhaul over 300 GHz carrier.'
      );
      setIsAligning(false);
      SoundFx.playSuccessChime();
    }, 500);
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setState(TerahertzWirelessEngine.getInitialState());
    setThzLog(null);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00f0ff]">
            <Wifi className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
                Version 9.3 Terahertz Wireless Backhaul
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                300 GHz • RIS Metamaterials • 100 Gbps
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Terahertz (THz) Wireless & Reconfigurable Intelligent Surfaces
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isAligning ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleAlignRis}
              leftIcon={<Zap className="w-3.5 h-3.5" />}
            >
              Align RIS Metamaterial Phase
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Phase-Shifting Meta-Atoms...
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset
          </Button>
        </div>
      </div>

      {/* Main Grid: THz Sectors (Left) & Wireless Physics Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: THz Beam Sectors */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#00f0ff]" /> Sub-THz Point-to-Point Sectors
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
              {state.frequencyBand}
            </span>
          </div>

          <div className="space-y-3">
            {state.sectors.map((s) => (
              <div
                key={s.sectorId}
                className="p-3.5 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono">{s.sectorId}</span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 font-bold">
                    {(s.carrierFrequencyThz * 1000).toFixed(0)} GHz Carrier
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-zinc-400 mt-1">
                  <div>Bandwidth: <span className="text-white font-bold">{s.bandwidthGhz} GHz</span></div>
                  <div>Throughput: <span className="text-emerald-400 font-bold">{s.throughputGbps} Gbps</span></div>
                  <div>H2O Loss: <span className="text-amber-400">{s.h2oAbsorptionDbPerKm} dB/km</span></div>
                </div>
              </div>
            ))}
          </div>

          {thzLog && (
            <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs font-mono text-cyan-200 leading-relaxed animate-in fade-in">
              {thzLog}
            </div>
          )}
        </div>

        {/* Right 5 Cols: Wireless Physics & Metamaterials */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" /> Terahertz Wave Propagation
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Aggregate Rate</span>
              <span className="text-lg font-bold text-cyan-400 font-mono mt-1">{state.totalWirelessThroughputGbps} Gbps</span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Fiber-equivalent wireless</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">RIS Meta-Atoms</span>
              <span className="text-lg font-bold text-emerald-400 font-mono mt-1">{state.risElementsActive}</span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Passive phase steering</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> 6G Sub-THz Innovations
            </div>
            <div>• Closes the bandwidth gap between optical fiber and wireless links</div>
            <div>• Reconfigurable Intelligent Surfaces act as smart passive mirrors in dense cities</div>
            <div>• Enables rapid disaster connectivity where fiber trenching is impossible</div>
          </div>
        </div>
      </div>
    </div>
  );
};

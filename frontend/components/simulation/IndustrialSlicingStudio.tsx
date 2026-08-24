'use client';

import React, { useState } from 'react';
import {
  Factory,
  Activity,
  Layers,
  CheckCircle2,
  Zap,
  RotateCcw,
  Bot,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  IndustrialSlicingEngine,
  IndustrialFactoryState,
} from '@/lib/industrialSlicingEngine';
import { SoundFx } from '@/lib/soundFx';

export const IndustrialSlicingStudio: React.FC = () => {
  const [state, setState] = useState<IndustrialFactoryState>(() =>
    IndustrialSlicingEngine.getInitialState()
  );
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [sliceLog, setSliceLog] = useState<string | null>(null);

  const handleSimulateCongestion = () => {
    setIsSimulating(true);
    SoundFx.playPacketDispatch();

    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        slices: prev.slices.map((slice) =>
          slice.sliceType === 'URLLC'
            ? { ...slice, slaLatencyMs: 0.79, jitterMicrosec: 11, status: 'GUARANTEED_SLA' }
            : slice.sliceType === 'EMBB'
            ? { ...slice, slaLatencyMs: 16.8, status: 'CONGESTION_PRESSURE' }
            : slice
        ),
      }));
      setSliceLog(
        '🏭 5G RRM Dynamic Slicing active! During 8K video traffic burst, URLLC robotics slice maintained deterministic 0.79 ms latency with zero dropped control packets.'
      );
      setIsSimulating(false);
      SoundFx.playSuccessChime();
    }, 500);
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setState(IndustrialSlicingEngine.getInitialState());
    setSliceLog(null);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Factory className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                Version 8.8 5G Network Slicing
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
                URLLC • eMBB • mMTC • Rel-18
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Private 5G/6G Industrial Network Slicing & Deterministic QoS
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isSimulating ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleSimulateCongestion}
              leftIcon={<Zap className="w-3.5 h-3.5" />}
            >
              Simulate Video Burst (Isolate URLLC)
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Reallocating Resource Blocks...
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset
          </Button>
        </div>
      </div>

      {/* Main Grid: S-NSSAI Slices (Left) & QoS Isolation Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: S-NSSAI Slices */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" /> Active 5G S-NSSAI Network Slices
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
              {state.factorySite}
            </span>
          </div>

          <div className="space-y-3">
            {state.slices.map((s) => (
              <div
                key={s.sstSdHex}
                className="p-3.5 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-white">
                    <span className="text-amber-400 font-bold">{s.sliceType}</span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-zinc-300">{s.name}</span>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30 font-bold">
                    {s.sstSdHex}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-zinc-400">
                  <div>RB Bandwidth: <span className="text-white font-bold">{s.allocatedRbPct}%</span></div>
                  <div>Latency SLA: <span className={s.sliceType === 'URLLC' ? 'text-emerald-400 font-bold' : 'text-cyan-300'}>{s.slaLatencyMs} ms</span></div>
                  <div>Jitter: <span className="text-cyan-300">{s.jitterMicrosec} µs</span></div>
                </div>
              </div>
            ))}
          </div>

          {sliceLog && (
            <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs font-mono text-amber-200 leading-relaxed animate-in fade-in">
              {sliceLog}
            </div>
          )}
        </div>

        {/* Right 5 Cols: URLLC Determinism */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-amber-400" /> Industrial Robotics Determinism
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#121522] border border-[#262c42] flex items-center gap-3">
            <Bot className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white font-mono">Synchronized AGVs & Arms</div>
              <div className="text-[10px] font-mono text-zinc-400">{state.activeRobotsCount} Industrial Units Connected</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> 3GPP Rel-18 URLLC Guarantees
            </div>
            <div>• Time-Sensitive Communication (TSC) synchronized via IEEE 802.1AS gPTP</div>
            <div>• Dedicated radio scheduler pre-empts eMBB frames to guarantee microsecond URLLC delivery</div>
            <div>• Zero packet loss ($10^{-6}$ error rate) eliminates cable tethers in gigafactories</div>
          </div>
        </div>
      </div>
    </div>
  );
};

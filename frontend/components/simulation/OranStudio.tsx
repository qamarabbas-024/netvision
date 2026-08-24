'use client';

import React, { useState } from 'react';
import {
  Radio,
  Activity,
  Layers,
  CheckCircle2,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  OranEngine,
  OranXApp,
  OranCellSite,
} from '@/lib/oranEngine';
import { SoundFx } from '@/lib/soundFx';

export const OranStudio: React.FC = () => {
  const [xApps] = useState<OranXApp[]>(() => OranEngine.getInitialXApps());
  const [cells, setCells] = useState<OranCellSite[]>(() => OranEngine.getInitialCells());
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationLog, setOptimizationLog] = useState<string | null>(null);

  const handleOptimizeBeamforming = () => {
    setIsOptimizing(true);
    SoundFx.playPacketDispatch();

    setTimeout(() => {
      setCells((prev) =>
        prev.map((cell) => ({
          ...cell,
          beamformingGainDbi: +(cell.beamformingGainDbi + 2.5).toFixed(1),
          spectralEfficiencyBpsHz: +(cell.spectralEfficiencyBpsHz + 1.8).toFixed(1),
          prbUtilizationPct: Math.max(30, cell.prbUtilizationPct - 15),
        }))
      );
      setOptimizationLog(
        '⚡ Near-RT RIC E2 telemetry executed AI Beamforming weights update in 7.4 ms. +2.5 dBi beam directivity gain, +1.8 bps/Hz spectral efficiency across 425 connected UEs.'
      );
      setIsOptimizing(false);
      SoundFx.playSuccessChime();
    }, 500);
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setCells(OranEngine.getInitialCells());
    setOptimizationLog(null);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                Version 7.4 5G/6G O-RAN
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
                Near-RT RIC • E2 Interface • xApps
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Open Radio Access Network & AI-Driven RIC Controller
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isOptimizing ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleOptimizeBeamforming}
              leftIcon={<Zap className="w-3.5 h-3.5" />}
            >
              Execute AI Beamforming xApp
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Optimizing Phase Arrays...
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset
          </Button>
        </div>
      </div>

      {/* Main Grid: Cell Sites & O-RAN Pipeline (Left) & xApps & RIC Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 6 Cols: Disaggregated Cell Sites */}
        <div className="lg:col-span-6 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" /> Disaggregated gNodeB Sites (O-RU / O-DU / O-CU)
            </span>
          </div>

          <div className="space-y-3">
            {cells.map((cell) => (
              <div
                key={cell.siteId}
                className="p-3.5 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono">{cell.siteId}</span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30 font-bold">
                    {cell.cellType}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-400">
                  <div>Active UEs: <span className="text-white">{cell.connectedUsers}</span></div>
                  <div>Beam Gain: <span className="text-emerald-400 font-bold">{cell.beamformingGainDbi} dBi</span></div>
                  <div>Efficiency: <span className="text-cyan-300 font-bold">{cell.spectralEfficiencyBpsHz} bps/Hz</span></div>
                  <div>PRB Load: <span className="text-amber-300">{cell.prbUtilizationPct}%</span></div>
                </div>
              </div>
            ))}
          </div>

          {optimizationLog && (
            <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs font-mono text-amber-200 leading-relaxed animate-in fade-in">
              {optimizationLog}
            </div>
          )}
        </div>

        {/* Right 6 Cols: Active xApps */}
        <div className="lg:col-span-6 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-amber-400" /> Near-RT RIC AI xApps Engine
            </span>
          </div>

          <div className="space-y-2.5">
            {xApps.map((app) => (
              <div
                key={app.id}
                className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col gap-1 text-xs font-mono"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{app.name}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                    Loop: {app.targetControlLoop}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400">{app.gainMetric}</span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> O-RAN Alliance Standards
            </div>
            <div>• Disaggregates proprietary cellular base stations into modular software components</div>
            <div>• E2 interface streams sub-millisecond radio metrics into AI controllers</div>
            <div>• xApps perform dynamic interference cancellation across 5G NR carriers</div>
          </div>
        </div>
      </div>
    </div>
  );
};

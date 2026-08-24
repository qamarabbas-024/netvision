'use client';

import React, { useState } from 'react';
import {
  Activity,
  Layers,
  CheckCircle2,
  Zap,
  RotateCcw,
  Sun,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  OpticalMemsEngine,
  OpticalMemsState,
} from '@/lib/opticalMemsEngine';
import { SoundFx } from '@/lib/soundFx';

export const OpticalMemsStudio: React.FC = () => {
  const [state, setState] = useState<OpticalMemsState>(() =>
    OpticalMemsEngine.getInitialState()
  );
  const [isTilting, setIsTilting] = useState<boolean>(false);
  const [memsLog, setMemsLog] = useState<string | null>(null);

  const handleTiltMirrors = () => {
    setIsTilting(true);
    SoundFx.playPacketDispatch();

    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        links: prev.links.map((link, idx) => ({
          ...link,
          egressPort: idx === 0 ? 'OPT-OUT-102' : idx === 1 ? 'OPT-OUT-210' : 'OPT-OUT-004',
          mirrorAngleDeg: +(link.mirrorAngleDeg * -1.2).toFixed(2),
        })),
      }));
      setMemsLog(
        '✨ 3D Optical MEMS Micro-Mirrors tilted in 1.8 ns! Photons redirected at line rate without Optical-to-Electrical-to-Optical (O-E-O) conversion. Zero packet queues or buffer bloat.'
      );
      setIsTilting(false);
      SoundFx.playSuccessChime();
    }, 500);
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setState(OpticalMemsEngine.getInitialState());
    setMemsLog(null);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00f0ff]">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
                Version 8.6 Optical MEMS Switch
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                Zero O-E-O • 1.8 ns Photonic OCS
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Programmable 3D Optical MEMS & Silicon Photonic Matrix
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isTilting ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleTiltMirrors}
              leftIcon={<Zap className="w-3.5 h-3.5" />}
            >
              Tilt MEMS Mirrors (Switch Photons)
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Tilting Photonic Crossbar...
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset
          </Button>
        </div>
      </div>

      {/* Main Grid: Optical Links (Left) & Silicon Photonic Physics (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: Photonic Crossbar */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#00f0ff]" /> 3D Micro-Mirror Deflection Array
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
              {state.portMatrixDim}
            </span>
          </div>

          <div className="space-y-3">
            {state.links.map((link) => (
              <div
                key={link.ingressPort}
                className="p-3.5 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-white">
                    <span className="text-cyan-300">{link.ingressPort}</span>
                    <span className="text-zinc-500">➔</span>
                    <span className="text-emerald-400">{link.egressPort}</span>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 font-bold">
                    {link.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-zinc-400">
                  <div>Wavelength: <span className="text-white">{link.wavelengthNm} nm</span></div>
                  <div>Mirror Angle: <span className="text-cyan-300 font-bold">{link.mirrorAngleDeg}°</span></div>
                  <div>Insertion Loss: <span className="text-emerald-400">{link.insertionLossDb} dB</span></div>
                </div>
              </div>
            ))}
          </div>

          {memsLog && (
            <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs font-mono text-cyan-200 leading-relaxed animate-in fade-in">
              {memsLog}
            </div>
          )}
        </div>

        {/* Right 5 Cols: All-Optical Physics Advantages */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" /> Photonic Domain Metrics
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Switching Delay</span>
              <span className="text-lg font-bold text-emerald-400 font-mono mt-1">{state.switchingLatencyNs} ns</span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Light-speed deflection</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">O-E-O Overhead</span>
              <span className="text-lg font-bold text-cyan-400 font-mono mt-1">0 Watts</span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Zero silicon heat</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Optical Circuit Switching (OCS)
            </div>
            <div>• Replaces power-hungry electronic SerDes with pure optical path routing</div>
            <div>• Protocol-agnostic: switches 100G, 400G, 800G, or 1.6T without hardware changes</div>
            <div>• Essential backbone for Next-Gen AI GPU Supercluster interconnects (Google Jupiter / Apollo)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

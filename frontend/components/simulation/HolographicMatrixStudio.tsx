'use client';

import React, { useState } from 'react';
import {
  Activity,
  Layers,
  CheckCircle2,
  Zap,
  RotateCcw,
  Glasses,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  HolographicMatrixEngine,
  HolographicMatrixState,
} from '@/lib/holographicMatrixEngine';
import { SoundFx } from '@/lib/soundFx';

export const HolographicMatrixStudio: React.FC = () => {
  const [state, setState] = useState<HolographicMatrixState>(() =>
    HolographicMatrixEngine.getInitialState()
  );
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [holoLog, setHoloLog] = useState<string | null>(null);

  const handleEngageStream = () => {
    setIsStreaming(true);
    SoundFx.playPacketDispatch();

    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        totalVoxelRateBillionSec: 1.4,
        channels: prev.channels.map((c) => ({
          ...c,
          motionToPhotonLatencyMs: +(c.motionToPhotonLatencyMs - 0.4).toFixed(1),
          status: 'SYNC_LOCKED',
        })),
      }));
      setHoloLog(
        '👓 Volumetric 3D Light-Field locked! Transmitting 1.4 Billion Voxels/sec with 4.4 ms Motion-to-Photon latency across IEEE 802.1Qch CQF synchronized buffers.'
      );
      setIsStreaming(false);
      SoundFx.playSuccessChime();
    }, 500);
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setState(HolographicMatrixEngine.getInitialState());
    setHoloLog(null);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00f0ff]">
            <Glasses className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
                Version 9.5 Holographic Telepresence
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                1.2B Voxel/s • M2P &lt; 5ms
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Deterministic 3D Volumetric Telepresence & Spatial Light-Field Matrix
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isStreaming ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleEngageStream}
              leftIcon={<Zap className="w-3.5 h-3.5" />}
            >
              Engage 1.2B Voxel Stream
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Locking Spatial Light-Field...
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset
          </Button>
        </div>
      </div>

      {/* Main Grid: Light-Field Channels (Left) & Spatial Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: Channels */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#00f0ff]" /> Volumetric Camera Array Channels
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
              {state.telepresenceSession}
            </span>
          </div>

          <div className="space-y-3">
            {state.channels.map((c) => (
              <div
                key={c.channelId}
                className="p-3.5 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono">{c.channelId}</span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 font-bold">
                    {c.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-zinc-400 mt-1">
                  <div>Angle: <span className="text-white font-bold">{c.cameraArrayAngleDeg}°</span></div>
                  <div>Density: <span className="text-cyan-300 font-bold">{c.voxelDensityMpps} MP/s</span></div>
                  <div>M2P Delay: <span className="text-emerald-400 font-bold">{c.motionToPhotonLatencyMs} ms</span></div>
                </div>
              </div>
            ))}
          </div>

          {holoLog && (
            <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs font-mono text-cyan-200 leading-relaxed animate-in fade-in">
              {holoLog}
            </div>
          )}
        </div>

        {/* Right 5 Cols: Spatial Metrics */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" /> Spatial Stream Telemetry
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Total Voxel Rate</span>
              <span className="text-lg font-bold text-cyan-400 font-mono mt-1">{state.totalVoxelRateBillionSec} B/s</span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Billion points per sec</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">CQF Cycle Time</span>
              <span className="text-lg font-bold text-emerald-400 font-mono mt-1">{state.cqfCycleIntervalMicrosec} µs</span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Deterministic pacing</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Spatial Immersion Guarantees
            </div>
            <div>• Sub-7ms Motion-to-Photon delay prevents vestibular mismatch nausea</div>
            <div>• IEEE 802.1Qch Cyclic Queuing & Forwarding guarantees zero packet jitter</div>
            <div>• Volumetric depth compression dynamically scales with user visual gaze tracking</div>
          </div>
        </div>
      </div>
    </div>
  );
};

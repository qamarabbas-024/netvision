'use client';

import React, { useState } from 'react';
import { Wifi, Radio, Zap, ShieldCheck, Activity, ArrowRight, Play } from 'lucide-react';
import { scheduleMpquicPacket, MpquicPath, MpquicSchedulerMode } from '@/lib/mpquicSchedulerEngine';

export const MpquicSchedulerStudio: React.FC = () => {
  const [paths] = useState<MpquicPath[]>([
    { id: 'path-wifi', name: 'Wi-Fi 7 (320MHz)', medium: 'WIFI_7', rttMs: 4.2, bandwidthMbps: 2400, packetLossRate: 0.001, activeBytesTransferred: 48920194 },
    { id: 'path-5g', name: '5G mmWave Standalone', medium: '5G_CELLULAR', rttMs: 12.8, bandwidthMbps: 1800, packetLossRate: 0.004, activeBytesTransferred: 31289100 },
  ]);

  const [mode, setMode] = useState<MpquicSchedulerMode>('MIN_RTT');
  const decision = scheduleMpquicPacket(paths, mode);

  return (
    <div className="surface-1 rounded-2xl border border-[#2a2e39] p-6 text-[#f4f5f7] font-sans shadow-instrument flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2e39] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#22c55e]">
              EPOCH XV // MULTIPATH QUIC (MPQUIC) SCHEDULER
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Multipath QUIC Stream Bonding & Scheduling Studio
          </h2>
          <p className="text-xs text-[#8e95a5]">
            Aggregate Wi-Fi 7 and 5G cellular links concurrently with zero connection drops during seamless network migration.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          {(['MIN_RTT', 'ROUND_ROBIN', 'REDUNDANT_LOSSLESS'] as MpquicSchedulerMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 rounded-lg border font-bold cursor-pointer transition-all ${
                mode === m
                  ? 'bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e]/30'
                  : 'bg-[#1a1f2c] text-[#8e95a5] border-[#2a2e39]'
              }`}
            >
              {m.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Concurrent Paths Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {paths.map((p) => (
          <div key={p.id} className="p-4 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-[#1e293b] mb-2">
                <div className="flex items-center gap-2 font-bold text-white">
                  {p.medium === 'WIFI_7' ? <Wifi className="w-4 h-4 text-[#38bdf8]" /> : <Radio className="w-4 h-4 text-[#22c55e]" />}
                  <span>{p.name}</span>
                </div>
                <span className="text-[#22c55e] font-bold">RTT: {p.rttMs} ms</span>
              </div>
              <span className="text-[10px] text-[#64748b]">BANDWIDTH CAPACITY:</span>
              <strong className="text-white text-sm block mb-1">{p.bandwidthMbps} Mbps</strong>
            </div>

            <div className="text-[11px] text-[#8e95a5] border-t border-[#1e293b] pt-2 flex justify-between">
              <span>Loss Rate: <strong className="text-[#22c55e]">{(p.packetLossRate * 100).toFixed(2)}%</strong></span>
              <span>Transferred: <strong className="text-[#38bdf8]">{(p.activeBytesTransferred / 1024 / 1024).toFixed(1)} MB</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Real-Time Scheduler Decision */}
      <div className="p-4 rounded-xl bg-[#090d14] border border-[#1e293b] font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-[#64748b] block">SCHEDULER ENGINE DECISION:</span>
          <strong className="text-white text-xs">{decision.reason}</strong>
        </div>

        <div className="p-2.5 rounded-lg bg-[#020617] border border-[#22c55e]/30 text-[#22c55e] font-bold text-xs">
          Total Bonded Bandwidth: 4.2 Gbps
        </div>
      </div>
    </div>
  );
};

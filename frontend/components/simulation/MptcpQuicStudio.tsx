'use client';

import React, { useState } from 'react';
import {
  Wifi,
  Radio,
  Zap,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  MptcpQuicEngine,
  MptcpSubflow,
} from '@/lib/mptcpQuicEngine';
import { SoundFx } from '@/lib/soundFx';

export const MptcpQuicStudio: React.FC = () => {
  const [subflows, setSubflows] = useState<MptcpSubflow[]>(() =>
    MptcpQuicEngine.getInitialSubflows()
  );
  const [isSevered, setIsSevered] = useState<boolean>(false);
  const [migrationStatus, setMigrationStatus] = useState<string | null>(null);

  const totalBandwidth = subflows
    .filter((s) => s.status === 'ACTIVE')
    .reduce((acc, s) => acc + s.bandwidthMbps, 0);

  const handleSeverWifi = () => {
    SoundFx.playPacketDrop();
    setIsSevered(true);
    setSubflows((prev) =>
      prev.map((s) => (s.id === 'sub-wifi' ? { ...s, status: 'DISCONNECTED' } : s))
    );
    setMigrationStatus(
      'QUIC Connection ID (0x7F4A8C91) dynamically migrated from 192.168.1.105:443 -> 100.64.42.18:443 without 4-tuple reset. 0 frames dropped.'
    );
    setTimeout(() => {
      SoundFx.playSuccessChime();
    }, 400);
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setIsSevered(false);
    setSubflows(MptcpQuicEngine.getInitialSubflows());
    setMigrationStatus(null);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00f0ff]">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
                Version 6.9 MP-TCP & QUIC
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                RFC 8684 Subflows • RFC 9000
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Multi-Path TCP Bandwidth Aggregation & QUIC Migration
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isSevered ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleSeverWifi}
              leftIcon={<AlertTriangle className="w-3.5 h-3.5 text-amber-300" />}
            >
              Sever Wi-Fi (Simulate Walking Outdoors)
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              Restore Wi-Fi Subflow
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: Dual Subflows (Left) & QUIC Migration Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 6 Cols: Subflow Interfaces */}
        <div className="lg:col-span-6 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#00f0ff]" /> Simultaneous Subflow Links
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
              Aggregated: {totalBandwidth} Mbps
            </span>
          </div>

          <div className="space-y-3">
            {subflows.map((s) => (
              <div
                key={s.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col gap-1.5 ${
                  s.status === 'ACTIVE'
                    ? 'border-cyan-500/50 bg-cyan-950/20'
                    : 'border-rose-500/40 bg-rose-950/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {s.id === 'sub-wifi' ? <Wifi className="w-4 h-4 text-[#00f0ff]" /> : <Radio className="w-4 h-4 text-purple-400" />}
                    <span className="text-xs font-bold text-white font-mono">{s.interfaceName}</span>
                  </div>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold border ${
                      s.status === 'ACTIVE'
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                        : 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    {s.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-400 mt-1">
                  <div>IP: <span className="text-white">{s.ipAddress}</span></div>
                  <div>Speed: <span className="text-cyan-300 font-bold">{s.status === 'ACTIVE' ? `${s.bandwidthMbps} Mbps` : '0 Mbps'}</span></div>
                  <div>Latency: <span className="text-emerald-400">{s.rttMs} ms</span></div>
                  <div>Protocol: <span className="text-purple-300">MP_JOIN</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 6 Cols: QUIC Migration Telemetry */}
        <div className="lg:col-span-6 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" /> QUIC Connection ID Migration
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                isSevered
                  ? 'bg-purple-950/60 text-purple-300 border-purple-500/40 animate-pulse'
                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
              }`}
            >
              {isSevered ? 'MIGRATED TO 5G' : 'DUAL-PATH AGGREGATED'}
            </span>
          </div>

          {migrationStatus ? (
            <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/30 text-xs font-mono text-purple-200 leading-relaxed animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mb-1" />
              {migrationStatus}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#121522] border border-[#262c42] text-xs font-mono text-zinc-400">
              Click "Sever Wi-Fi" to observe QUIC dynamic 64-bit Connection ID migration without resetting active streams.
            </div>
          )}

          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> MP-TCP & QUIC Innovations
            </div>
            <div>• MP-TCP aggregates multiple PHY links into a unified TCP socket</div>
            <div>• QUIC uses connection IDs decoupled from IP 4-tuples for seamless mobility</div>
            <div>• Zero-RTT crypto handshakes eliminate round-trip connection overhead</div>
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import {
  Route,
  Radio,
  Activity,
  Layers,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  SdwanEngine,
  WanTransportPath,
  SdwanTrafficClass,
} from '@/lib/sdwanEngine';
import { SoundFx } from '@/lib/soundFx';

export const SdwanTrafficStudio: React.FC = () => {
  const [transports, setTransports] = useState<WanTransportPath[]>(() => SdwanEngine.getInitialTransports());
  const [trafficClasses] = useState<SdwanTrafficClass[]>(() => SdwanEngine.getTrafficClasses());
  const [selectedClass, setSelectedClass] = useState<SdwanTrafficClass>(trafficClasses[0]);
  const [isDegraded, setIsDegraded] = useState<boolean>(false);
  const [steeringLog, setSteeringLog] = useState<string | null>(null);

  const handleInjectDegradation = () => {
    SoundFx.playPacketDrop();
    setIsDegraded(true);
    setSteeringLog('⚠️ DIA Broadband Jitter Spike (45ms) & 12% Packet Loss. SD-WAN Controller dynamically steered VoIP EF traffic to Private MPLS. FEC reconstructed 18 dropped frames.');

    setTransports((prev) =>
      prev.map((t) =>
        t.id === 'wan-dia'
          ? { ...t, latencyMs: 85, jitterMs: 45, packetLossPercent: 12.4, health: 'DEGRADED' }
          : t
      )
    );
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setIsDegraded(false);
    setSteeringLog(null);
    setTransports(SdwanEngine.getInitialTransports());
    SoundFx.playSuccessChime();
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Route className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">
                Version 5.2 SD-WAN
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono font-bold">
                Dynamic SLA Path Steering
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Forward Error Correction (FEC) & WAN Brownout Failover
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isDegraded ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleInjectDegradation}
              leftIcon={<AlertTriangle className="w-3.5 h-3.5 text-amber-300" />}
            >
              Inject Broadband Brownout
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              Restore Normal WAN SLA
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: Multi-Transport WAN Paths (Left) & Application Steering Policy (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: WAN Transports Matrix */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-400" /> Active WAN Overlays
            </span>
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-500/30">
              BFD Telemetry Polling (100ms)
            </span>
          </div>

          <div className="space-y-3">
            {transports.map((t) => (
              <div
                key={t.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col gap-2 ${
                  t.health === 'DEGRADED'
                    ? 'border-amber-500/50 bg-amber-950/20'
                    : 'border-[#262c42] bg-[#121522]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Radio className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-white">{t.name}</span>
                  </div>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                      t.health === 'DEGRADED'
                        ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40 animate-pulse'
                        : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {t.health}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-[10px] font-mono text-zinc-400 pt-2 border-t border-[#262c42]/60">
                  <div>Latency: <span className="text-white font-bold">{t.latencyMs}ms</span></div>
                  <div>Jitter: <span className="text-white font-bold">{t.jitterMs}ms</span></div>
                  <div>Loss: <span className={t.packetLossPercent > 1 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>{t.packetLossPercent}%</span></div>
                  <div>BW: <span className="text-indigo-300">{t.bandwidthMbps} Mbps</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: Application SLA & Steering Telemetry */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-indigo-400" /> Application SLA Policy
            </span>
            <span className="text-[10px] font-mono text-emerald-400">
              FEC Recovery: ACTIVE
            </span>
          </div>

          {/* Traffic Class Selectors */}
          <div className="space-y-2">
            {trafficClasses.map((tc) => {
              const isSelected = selectedClass.id === tc.id;
              return (
                <button
                  key={tc.id}
                  onClick={() => {
                    SoundFx.playTerminalKeyPress();
                    setSelectedClass(tc);
                  }}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between text-xs font-mono ${
                    isSelected
                      ? 'border-indigo-400 bg-indigo-950/40 text-white'
                      : 'border-[#262c42] bg-[#121522] text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-white">{tc.name}</span>
                    <span className="text-[10px] text-zinc-500">{tc.dscpTag}</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 text-indigo-300">
                    Max RTT: {tc.maxLatency}ms
                  </span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Telemetry Notification Box */}
          {steeringLog ? (
            <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-xs font-mono text-indigo-200 leading-relaxed animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mb-1" />
              {steeringLog}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#10131e] border border-[#202538] text-center text-xs font-mono text-zinc-500">
              All WAN transports are operating within nominal SLA thresholds. Zero traffic failover required.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

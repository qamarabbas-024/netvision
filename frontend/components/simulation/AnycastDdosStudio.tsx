'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Activity,
  CheckCircle2,
  Zap,
  RotateCcw,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  AnycastDdosEngine,
  AnycastDdosState,
} from '@/lib/anycastDdosEngine';
import { SoundFx } from '@/lib/soundFx';

export const AnycastDdosStudio: React.FC = () => {
  const [state, setState] = useState<AnycastDdosState>(() =>
    AnycastDdosEngine.getInitialState()
  );
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);
  const [scrubbingLog, setScrubbingLog] = useState<string | null>(null);

  const handleLaunchAttack = () => {
    setIsScrubbing(true);
    SoundFx.playPacketDrop();

    setState((prev) => ({
      ...prev,
      attackActive: true,
      totalAttackVolumeTbps: 3.2,
      cleanTrafficDeliveredPct: 99.98,
      pops: prev.pops.map((pop) => ({
        ...pop,
        inboundFloodGbps: 800,
        droppedMaliciousGbps: 785,
        status: 'SCRUBBING_ACTIVE',
      })),
    }));

    setTimeout(() => {
      setScrubbingLog(
        '🛡️ 3.2 Tbps Volumetric Flood diluted uniformly across 4 Global Anycast Edge PoPs. eBPF XDP SYN-Cookie hardware filters dropped 3,140 Gbps malicious vectors. 0ms impact to genuine client sessions.'
      );
      setIsScrubbing(false);
      SoundFx.playSuccessChime();
    }, 600);
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setState(AnycastDdosEngine.getInitialState());
    setScrubbingLog(null);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-rose-400 font-bold uppercase tracking-wider">
                Version 7.8 Anycast DDoS Scrubbing
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold">
                3.2 Tbps Dilution • eBPF XDP
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              BGP Anycast Geo-Distribution & Terabit Volumetric Scrubbing
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!state.attackActive ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleLaunchAttack}
              leftIcon={<Zap className="w-3.5 h-3.5" />}
            >
              Simulate 3.2 Tbps Volumetric Attack
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              De-escalate Scrubbers
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: Anycast PoPs (Left) & Scrubbing Performance Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: Anycast Scrubbing PoPs */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-rose-400" /> BGP Anycast Scrubbing PoPs
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
              VIP: {state.targetIp}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {state.pops.map((pop) => (
              <div
                key={pop.popCode}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col gap-2 ${
                  pop.status === 'SCRUBBING_ACTIVE'
                    ? 'border-rose-500/50 bg-rose-950/20'
                    : 'border-[#262c42] bg-[#121522]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono">{pop.popCode} • {pop.cityName}</span>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold border ${
                      pop.status === 'SCRUBBING_ACTIVE'
                        ? 'bg-rose-950/60 text-rose-300 border-rose-500/40 animate-pulse'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}
                  >
                    {pop.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-400">
                  <div>Inbound: <span className="text-rose-400 font-bold">{pop.inboundFloodGbps} Gbps</span></div>
                  <div>Dropped: <span className="text-amber-400 font-bold">{pop.droppedMaliciousGbps} Gbps</span></div>
                  <div>Clean: <span className="text-emerald-400 font-bold">{pop.scrubbedCleanGbps} Gbps</span></div>
                  <div>AS-Path: <span className="text-cyan-300">{pop.bgpAsPathLen} hops</span></div>
                </div>
              </div>
            ))}
          </div>

          {scrubbingLog && (
            <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-xs font-mono text-rose-200 leading-relaxed animate-in fade-in">
              {scrubbingLog}
            </div>
          )}
        </div>

        {/* Right 5 Cols: Volumetric Mitigation Analytics */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-rose-400" /> Scrubbing Center Efficiency
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Attack Volume</span>
              <span className="text-lg font-bold text-rose-400 font-mono mt-1">
                {state.totalAttackVolumeTbps} Tbps
              </span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">SYN/UDP/NTP reflection</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Clean Delivery SLA</span>
              <span className="text-lg font-bold text-emerald-400 font-mono mt-1">
                {state.cleanTrafficDeliveredPct}%
              </span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">0% false-positive drops</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" /> Anycast Defense Mechanism
            </div>
            <div>• BGP Anycast routes attack traffic naturally to the nearest regional Internet Exchange (IXP)</div>
            <div>• Localized scrubbing prevents single-link saturation on target origin servers</div>
            <div>• Clean packets are encapsulated over GRE/IPsec back to backend web origins</div>
          </div>
        </div>
      </div>
    </div>
  );
};

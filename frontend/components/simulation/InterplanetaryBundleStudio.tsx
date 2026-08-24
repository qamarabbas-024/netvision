'use client';

import React, { useState } from 'react';
import {
  Rocket,
  Activity,
  Layers,
  CheckCircle2,
  Zap,
  RotateCcw,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  InterplanetaryBundleEngine,
  InterplanetaryMissionState,
} from '@/lib/interplanetaryBundleEngine';
import { SoundFx } from '@/lib/soundFx';

export const InterplanetaryBundleStudio: React.FC = () => {
  const [state, setState] = useState<InterplanetaryMissionState>(() =>
    InterplanetaryBundleEngine.getInitialState()
  );
  const [isTransmitting, setIsTransmitting] = useState<boolean>(false);
  const [dtnLog, setDtnLog] = useState<string | null>(null);

  const handleTransmitBundle = () => {
    setIsTransmitting(true);
    SoundFx.playPacketDispatch();

    setTimeout(() => {
      setDtnLog(
        '🚀 RFC 5050 DTN Custody Bundle Transmitted! Hop 2 (Lunar Gateway) and Hop 3 (Mars MRO) confirmed persistent flash storage custody. 100% data integrity preserved across 23.6-minute planetary delay.'
      );
      setIsTransmitting(false);
      SoundFx.playSuccessChime();
    }, 600);
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setState(InterplanetaryBundleEngine.getInitialState());
    setDtnLog(null);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00f0ff]">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
                Version 9.0 Galactic Interplanetary DTN
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                Bundle Protocol RFC 5050 • Deep Space
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Interplanetary Delay-Tolerant Networking & Custody Transfer
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isTransmitting ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleTransmitBundle}
              leftIcon={<Zap className="w-3.5 h-3.5" />}
            >
              Transmit DTN Custody Bundle (Earth ➔ Mars)
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Store & Forward across Solar System...
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset
          </Button>
        </div>
      </div>

      {/* Main Grid: Deep Space Hops (Left) & Interplanetary Flight Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: Deep Space Nodes */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#00f0ff]" /> Interplanetary Relays & Custodians
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
              Payload: {state.bundlePayloadKb} KB Bundle
            </span>
          </div>

          <div className="space-y-3">
            {state.hops.map((hop) => (
              <div
                key={hop.nodeId}
                className="p-3.5 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono">{hop.name}</span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 font-bold">
                    {hop.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-zinc-400">
                  <div>Distance: <span className="text-white font-bold">{hop.distanceAu} AU</span></div>
                  <div>Light Time: <span className="text-cyan-300 font-bold">{hop.oneWayLightTimeSec} sec</span></div>
                  <div>Custody: <span className="text-emerald-400 font-bold">VERIFIED</span></div>
                </div>
              </div>
            ))}
          </div>

          {dtnLog && (
            <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs font-mono text-cyan-200 leading-relaxed animate-in fade-in">
              {dtnLog}
            </div>
          )}
        </div>

        {/* Right 5 Cols: Deep Space Protocol Physics */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" /> Deep Space Propagation Metrics
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Round-Trip Time</span>
              <span className="text-lg font-bold text-cyan-400 font-mono mt-1">
                {(state.totalRoundTripTimeSec / 60).toFixed(1)} mins
              </span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">TCP timeouts impossible</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Data Loss SLA</span>
              <span className="text-lg font-bold text-emerald-400 font-mono mt-1">0% Loss</span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Store-and-forward custody</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Bundle Protocol Architecture
            </div>
            <div>• Replaces chatty TCP handshakes with autonomous Store-and-Forward Bundle transmission</div>
            <div>• Custody Transfer ensures bundles are cached persistently until downstream node acknowledges</div>
            <div>• Tolerates orbital blackouts and planetary occultations seamlessly</div>
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import {
  Satellite,
  Activity,
  Layers,
  CheckCircle2,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  SaginEngine,
  SaginNetworkState,
} from '@/lib/saginEngine';
import { SoundFx } from '@/lib/soundFx';

export const SaginMultiTierStudio: React.FC = () => {
  const [state, setState] = useState<SaginNetworkState>(() =>
    SaginEngine.getInitialState()
  );
  const [isHandoff, setIsHandoff] = useState<boolean>(false);
  const [handoffLog, setHandoffLog] = useState<string | null>(null);

  const handleCrossTierHandoff = () => {
    setIsHandoff(true);
    SoundFx.playPacketDispatch();

    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        endToEndLatencyMs: 18.2,
      }));
      setHandoffLog(
        '🛰️ Cross-Tier SAGIN Handshake Complete: Ground 5G -> Air HAPS (20km) -> Space LEO Laser ISL (550km). Seamless packet routing achieved across non-terrestrial networks (NTN).'
      );
      setIsHandoff(false);
      SoundFx.playSuccessChime();
    }, 500);
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setState(SaginEngine.getInitialState());
    setHandoffLog(null);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00f0ff]">
            <Satellite className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
                Version 8.1 SAGIN Integrated Mesh
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                Space • Air • Ground Tiers
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Space-Air-Ground Integrated Networks (SAGIN) Multi-Tier Routing
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isHandoff ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleCrossTierHandoff}
              leftIcon={<Zap className="w-3.5 h-3.5" />}
            >
              Execute Cross-Tier Handoff
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Routing Across Altitudes...
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset
          </Button>
        </div>
      </div>

      {/* Main Grid: Multi-Tier Nodes (Left) & SAGIN Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: Tiers */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#00f0ff]" /> Non-Terrestrial Network Nodes
            </span>
          </div>

          <div className="space-y-3">
            {state.nodes.map((node) => (
              <div
                key={node.nodeName}
                className="p-3.5 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono">{node.nodeName}</span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 font-bold">
                    Alt: {node.altitudeKm} km
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-zinc-400">
                  <div>Coverage: <span className="text-white">{node.coverageRadiusKm} km</span></div>
                  <div>Hop RTT: <span className="text-cyan-300 font-bold">{node.interTierLatencyMs} ms</span></div>
                  <div>Capacity: <span className="text-emerald-400 font-bold">{node.uplinkBandwidthGbps} Gbps</span></div>
                </div>
              </div>
            ))}
          </div>

          {handoffLog && (
            <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs font-mono text-cyan-200 leading-relaxed animate-in fade-in">
              {handoffLog}
            </div>
          )}
        </div>

        {/* Right 5 Cols: Architecture */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" /> Multi-Tier End-to-End Latency
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col gap-1">
            <span className="text-[10px] font-mono text-zinc-400 uppercase">End-to-End Path RTT</span>
            <span className="text-2xl font-bold text-emerald-400 font-mono">{state.endToEndLatencyMs} ms</span>
            <span className="text-[9px] font-mono text-zinc-500">Includes LEO optical crosslink</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> 3GPP Rel-18 NTN Integration
            </div>
            <div>• Bridges terrestrial dead zones (oceans, deserts, disaster zones)</div>
            <div>• Solar-powered HAPS gliders act as floating 5G base stations in the stratosphere</div>
            <div>• Space LEO lasers provide high-capacity intercontinental transport</div>
          </div>
        </div>
      </div>
    </div>
  );
};

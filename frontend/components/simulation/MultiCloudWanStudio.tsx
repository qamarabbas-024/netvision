'use client';

import React, { useState } from 'react';
import {
  Cloud,
  Activity,
  Layers,
  CheckCircle2,
  Zap,
  RotateCcw,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  MultiCloudWanEngine,
  CloudProviderHub,
} from '@/lib/multiCloudWanEngine';
import { SoundFx } from '@/lib/soundFx';

export const MultiCloudWanStudio: React.FC = () => {
  const [hubs, setHubs] = useState<CloudProviderHub[]>(() =>
    MultiCloudWanEngine.getInitialHubs()
  );
  const [isPropagating, setIsPropagating] = useState<boolean>(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  const handlePropagatePolicy = () => {
    setIsPropagating(true);
    SoundFx.playPacketDispatch();

    setTimeout(() => {
      setHubs((prev) =>
        prev.map((hub) => ({
          ...hub,
          activePrefixes: hub.activePrefixes + 15,
        }))
      );
      setSyncResult(
        '⚡ Global Multi-Cloud Policy Propagated across AWS Cloud WAN (ASN 64512), Azure vWAN (ASN 65515), and Google NCC (ASN 16550) via dynamic eBGP. Zero routing loops (AS-Path Loop Prevention active).'
      );
      setIsPropagating(false);
      SoundFx.playSuccessChime();
    }, 500);
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setHubs(MultiCloudWanEngine.getInitialHubs());
    setSyncResult(null);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00f0ff]">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
                Version 7.6 Multi-Cloud WAN Mesh
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                AWS Cloud WAN • Azure vWAN • GCP NCC
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Cross-Hyperscaler Global Backbone & Autonomous Interconnect
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isPropagating ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handlePropagatePolicy}
              leftIcon={<Zap className="w-3.5 h-3.5" />}
            >
              Propagate Global WAN Segment
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Propagating eBGP Routes...
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset
          </Button>
        </div>
      </div>

      {/* Main Grid: Hyperscaler Hubs (Left) & Cross-Cloud Peering Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: Cloud Hubs */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#00f0ff]" /> Hyperscaler WAN Gateway Hubs
            </span>
          </div>

          <div className="space-y-3">
            {hubs.map((hub) => (
              <div
                key={hub.provider}
                className="p-3.5 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white font-mono">{hub.hubName}</span>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 font-bold">
                    ASN {hub.bgpAsn}
                  </span>
                </div>

                <span className="text-[10px] font-mono text-zinc-400">{hub.region}</span>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-400">
                  <div>Active Prefixes: <span className="text-emerald-400 font-bold">{hub.activePrefixes} routes</span></div>
                  <div>Direct Link RTT: <span className="text-cyan-300 font-bold">{hub.interconnectLatencyMs} ms</span></div>
                </div>
              </div>
            ))}
          </div>

          {syncResult && (
            <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs font-mono text-cyan-200 leading-relaxed animate-in fade-in">
              {syncResult}
            </div>
          )}
        </div>

        {/* Right 5 Cols: Multi-Cloud WAN Architecture */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" /> WAN Mesh Routing Logic
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#121522] border border-[#262c42] space-y-2 text-[11px] font-mono text-zinc-400">
            <span className="text-white font-bold block">Enterprise Backbone Innovations:</span>
            <div>• AWS Cloud WAN Core Network Policy compiles declarative segments globally</div>
            <div>• Azure Virtual WAN Hubs establish multi-region ExpressRoute hairpins</div>
            <div>• GCP Network Connectivity Center coordinates third-party SD-WAN router appliances</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> BGP Autonomous Route Control
            </div>
            <div>• AS-Path prepending ensures deterministic primary & failover paths</div>
            <div>• BGP Community tags isolate PCI-DSS workloads from public DMZ segments</div>
          </div>
        </div>
      </div>
    </div>
  );
};

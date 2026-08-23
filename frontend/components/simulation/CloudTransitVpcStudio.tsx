'use client';

import React, { useState } from 'react';
import {
  Cloud,
  Layers,
  Zap,
  Activity,
  Shield,
  ArrowRight,
  Database,
  Server,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  CloudVpcEngine,
  InterVpcPacket,
} from '@/lib/cloudVpcEngine';
import { SoundFx } from '@/lib/soundFx';

export const CloudTransitVpcStudio: React.FC = () => {
  const [cloudArch] = useState(() => CloudVpcEngine.getCloudArchitecture());
  const [activePacket, setActivePacket] = useState<InterVpcPacket | null>(null);
  const [isRouting, setIsRouting] = useState<boolean>(false);

  const handleDispatchTraffic = () => {
    setIsRouting(true);
    SoundFx.playPacketDispatch();

    const pkt = CloudVpcEngine.routeCrossVpcTraffic('vpc-prod', 'vpc-db');
    setActivePacket(pkt);

    setTimeout(() => {
      SoundFx.playHopForward();
    }, 450);

    setTimeout(() => {
      setIsRouting(false);
      SoundFx.playSuccessChime();
    }, 900);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00f0ff]">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
                Version 5.1 Cloud Networking
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                Transit Gateway Hub-and-Spoke
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Multi-VPC Cloud Interconnect & NACL Policy Studio
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleDispatchTraffic}
            disabled={isRouting}
            leftIcon={<Zap className="w-3.5 h-3.5" />}
          >
            {isRouting ? 'Routing Inter-VPC Query...' : 'Dispatch Inter-VPC Query (App -> DB)'}
          </Button>
        </div>
      </div>

      {/* Main Grid: Hub-and-Spoke Topology (Left) & Route Tables + NACL Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: Cloud Architecture Layout */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-5 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#00f0ff]" /> AWS Transit Gateway Hub Topology
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
              ASN {cloudArch.tgw.asn}
            </span>
          </div>

          {/* Central Hub Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-indigo-950/40 border border-cyan-500/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/20 border border-[#00f0ff]/50 flex items-center justify-center text-[#00f0ff]">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block">{cloudArch.tgw.name}</span>
                <span className="text-xs font-mono text-cyan-300">Central Hub Router | Region: {cloudArch.tgw.region}</span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-1 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-500/30">
              3 VPC Attachments Active
            </span>
          </div>

          {/* Spoke VPC Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {cloudArch.vpcs.map((vpc) => (
              <div
                key={vpc.id}
                className="p-3.5 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col gap-2"
              >
                <div className="flex items-center gap-2">
                  {vpc.role === 'DATABASE' ? (
                    <Database className="w-4 h-4 text-purple-400" />
                  ) : vpc.role === 'SHARED_SERVICES' ? (
                    <Shield className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Server className="w-4 h-4 text-[#00f0ff]" />
                  )}
                  <span className="text-xs font-bold text-white truncate">{vpc.name}</span>
                </div>

                <div className="text-[10px] font-mono text-zinc-400">
                  <div>CIDR: {vpc.cidrBlock}</div>
                  <div>Attach: {vpc.tgwAttachmentId}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: TGW Route Table & Hop Inspection */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" /> Transit Route Table & NACL Engine
            </span>
            <span className="text-[10px] font-mono text-emerald-400">
              Route Propagation: ON
            </span>
          </div>

          {/* Route Table Entries */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold block">
              TGW Route Table Entries
            </span>
            {cloudArch.tgw.routeTableEntries.map((r, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-[#121522] border border-[#262c42] flex items-center justify-between text-xs font-mono"
              >
                <span className="font-bold text-white">{r.destinationCidr}</span>
                <span className="text-[10px] text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">
                  {r.targetAttachment}
                </span>
              </div>
            ))}
          </div>

          {/* Hop Inspection Panel */}
          {activePacket ? (
            <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Packet Transit Trace
                </span>
                <span className="text-[10px] font-mono text-zinc-400">{activePacket.latencyMs}ms RTT</span>
              </div>

              <div className="space-y-1">
                {activePacket.transitHops.map((hop, hIdx) => (
                  <div key={hIdx} className="text-[11px] font-mono text-zinc-300 flex items-start gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-[#00f0ff] shrink-0 mt-0.5" />
                    <span>{hop}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#10131e] border border-[#202538] text-center text-xs font-mono text-zinc-500">
              Click "Dispatch Inter-VPC Query" to trace cross-VPC packet routing.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

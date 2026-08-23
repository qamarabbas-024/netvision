'use client';

import React, { useState } from 'react';
import {
  Server,
  Layers,
  Zap,
  Activity,
  Shield,
  Database,
  Cpu,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  BgpEvpnFabricEngine,
  VxlanPacketFrame,
} from '@/lib/bgpEvpnEngine';
import { SoundFx } from '@/lib/soundFx';

export const BgpEvpnFabricVisualizer: React.FC = () => {
  const [fabricData] = useState(() => BgpEvpnFabricEngine.generateDefaultFabric());
  const [activePacket, setActivePacket] = useState<VxlanPacketFrame | null>(null);
  const [isTransmitting, setIsTransmitting] = useState<boolean>(false);
  const [selectedRouteFilter, setSelectedRouteFilter] = useState<'ALL' | 'TYPE_2' | 'TYPE_5'>('ALL');

  const handleSendVxlanPacket = () => {
    setIsTransmitting(true);
    SoundFx.playPacketDispatch();

    const pkt = BgpEvpnFabricEngine.createVxlanPacket('vm-web-1', 'vm-web-2');
    setActivePacket(pkt);

    setTimeout(() => {
      SoundFx.playHopForward();
    }, 400);

    setTimeout(() => {
      setIsTransmitting(false);
      SoundFx.playSuccessChime();
    }, 900);
  };

  const filteredRoutes = fabricData.evpnTable.filter((r) => {
    if (selectedRouteFilter === 'TYPE_2') return r.routeType === 'TYPE_2_MAC_IP';
    if (selectedRouteFilter === 'TYPE_5') return r.routeType === 'TYPE_5_PREFIX';
    return true;
  });

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Top Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">
                Version 4.4 Enterprise Cloud Fabric
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono font-bold">
                BGP EVPN & VXLAN Data Center
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Spine-Leaf Underlay & VXLAN Overlay (UDP 4789)
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleSendVxlanPacket}
            disabled={isTransmitting}
            leftIcon={<Zap className="w-4 h-4 text-indigo-300" />}
          >
            {isTransmitting ? 'Encapsulating & Routing...' : 'Send East-West VXLAN Packet'}
          </Button>
        </div>
      </div>

      {/* Main Grid: 3D Spine-Leaf Architecture (Left) & Encapsulation Dissector + EVPN Routes (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: Spine-Leaf Data Center Topology Canvas */}
        <div className="lg:col-span-7 p-6 bg-[#0c0e17] flex flex-col gap-6 relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-400" /> Clos Spine-Leaf Underlay Grid
            </span>
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-500/30">
              ECMP Hashing Active
            </span>
          </div>

          {/* Spine Tier */}
          <div className="flex flex-col gap-1 items-center">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              Spine Layer (AS 65000)
            </span>
            <div className="flex items-center justify-center gap-8 w-full">
              {fabricData.spines.map((spine) => (
                <div
                  key={spine.id}
                  className={`p-3.5 rounded-2xl border flex flex-col items-center gap-1 min-w-[130px] transition-all ${
                    activePacket?.selectedSpine === spine.name
                      ? 'border-indigo-400 bg-indigo-950/60 shadow-glow-cyan'
                      : 'border-[#262c42] bg-[#141724]'
                  }`}
                >
                  <Cpu className="w-5 h-5 text-indigo-400" />
                  <span className="text-xs font-bold text-white">{spine.name}</span>
                  <span className="text-[10px] font-mono text-zinc-400">{spine.loopbackIp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Leaf Tier */}
          <div className="flex flex-col gap-1 items-center">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              Leaf Layer / VTEP Gateways
            </span>
            <div className="grid grid-cols-3 gap-4 w-full">
              {fabricData.leafs.map((leaf) => (
                <div
                  key={leaf.id}
                  className="p-3 rounded-2xl border border-[#262c42] bg-[#121522] flex flex-col items-center gap-1 text-center"
                >
                  <Server className="w-4 h-4 text-[#00f0ff]" />
                  <span className="text-xs font-bold text-white">{leaf.name}</span>
                  <span className="text-[9px] font-mono text-zinc-400">VTEP: {leaf.vtepIp}</span>
                  <div className="flex gap-1 mt-1">
                    {leaf.vnis?.map((v) => (
                      <span key={v} className="px-1 py-0.5 rounded bg-black/40 text-[8px] font-mono text-emerald-400">
                        VNI {v}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workload Hypervisors */}
          <div className="flex flex-col gap-1 items-center">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              Tenant VM Workloads
            </span>
            <div className="grid grid-cols-3 gap-4 w-full">
              {fabricData.workloads.map((wl) => (
                <div
                  key={wl.id}
                  className="p-2.5 rounded-xl border border-zinc-800 bg-[#0e101a] flex items-center gap-2"
                >
                  <Database className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-zinc-200 truncate">{wl.name}</div>
                    <div className="text-[9px] font-mono text-zinc-400">{wl.loopbackIp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: VXLAN Packet Dissector & BGP EVPN Table */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          {/* VXLAN Packet Dissector */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
              <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-indigo-400" /> VXLAN 50-Byte Header Dissection
              </span>
              {activePacket && (
                <span className="text-[10px] font-mono text-indigo-400 font-bold">
                  {activePacket.ecmpHash}
                </span>
              )}
            </div>

            {activePacket ? (
              <div className="p-3.5 rounded-2xl bg-[#10131d] border border-indigo-500/30 flex flex-col gap-2 animate-in fade-in">
                {/* 1. Outer Underlay Header */}
                <div className="p-2 rounded-xl bg-indigo-950/40 border border-indigo-500/40 text-[11px] font-mono text-indigo-300">
                  <div className="font-bold text-indigo-200">1. Outer IP Header (Underlay)</div>
                  <div>Src VTEP: {activePacket.underlaySourceIp}</div>
                  <div>Dst VTEP: {activePacket.underlayDestIp}</div>
                </div>

                {/* 2. Outer UDP & VXLAN Header */}
                <div className="p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-[11px] font-mono text-cyan-300">
                  <div className="font-bold text-cyan-200">2. UDP (Port 4789) + VXLAN Header</div>
                  <div>VNI Identifier: {activePacket.vni} (Overlay Subnet)</div>
                  <div>Selected Transit: {activePacket.selectedSpine}</div>
                </div>

                {/* 3. Inner Payload */}
                <div className="p-2 rounded-xl bg-purple-950/40 border border-purple-500/40 text-[11px] font-mono text-purple-300">
                  <div className="font-bold text-purple-200">3. Inner Tenant Ethernet Frame</div>
                  <div>Src: {activePacket.innerSourceIp} ({activePacket.innerSourceMac})</div>
                  <div>Dst: {activePacket.innerDestIp} ({activePacket.innerDestMac})</div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[#10131d] border border-[#202538] text-center text-xs text-zinc-500 font-mono">
                Click "Send East-West VXLAN Packet" above to generate a live VXLAN frame.
              </div>
            )}
          </div>

          {/* BGP EVPN Route Table */}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#202538]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400" /> BGP EVPN Control Plane Table
              </span>

              {/* Filter Pills */}
              <div className="flex gap-1">
                {(['ALL', 'TYPE_2', 'TYPE_5'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedRouteFilter(f)}
                    className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold transition-all ${
                      selectedRouteFilter === f
                        ? 'bg-indigo-500 text-white'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
              {filteredRoutes.map((route, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-[#121522] border border-[#262c42] flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      {route.ipAddress}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      RD: {route.rd} | VNI: {route.vni}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-indigo-300 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-500/30 block">
                      Next-Hop: {route.nextHopVtep}
                    </span>
                    <span className="text-[9px] text-zinc-500">{route.routeType}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

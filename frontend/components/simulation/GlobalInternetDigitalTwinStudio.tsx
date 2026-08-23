'use client';

import React, { useState } from 'react';
import {
  Globe,
  Zap,
  Activity,
  Shield,
  Layers,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  InternetDigitalTwinEngine,
} from '@/lib/internetDigitalTwinEngine';
import { SoundFx } from '@/lib/soundFx';

export const GlobalInternetDigitalTwinStudio: React.FC = () => {
  const [topo, setTopo] = useState(() => InternetDigitalTwinEngine.getGlobalTopology());
  const [cableSevered, setCableSevered] = useState<boolean>(false);
  const [bgpHijackActive, setBgpHijackActive] = useState<boolean>(false);
  const [activeSimulationLog, setActiveSimulationLog] = useState<string | null>(null);

  const handleSeverCable = () => {
    SoundFx.playPacketDrop();
    setCableSevered(true);
    setActiveSimulationLog('🚨 MAREA Cable Cut: BGP Path Reconvergence initiated. Traffic rerouted via Pacific Trans-Siberian transit lines.');

    setTopo((prev) => ({
      ...prev,
      cables: prev.cables.map((c) =>
        c.id === 'cable-marea' ? { ...c, status: 'SEVERED', latencyMs: 180 } : c
      ),
    }));
  };

  const handleSimulateHijack = () => {
    SoundFx.playPacketDrop();
    setBgpHijackActive(true);
    setActiveSimulationLog('⚠️ BGP Route Leak Detected: AS2914 received unauthorized /24 prefix announcement. RPKI ROV (Route Origin Validation) discarding invalid path.');
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setCableSevered(false);
    setBgpHijackActive(false);
    setActiveSimulationLog(null);
    setTopo(InternetDigitalTwinEngine.getGlobalTopology());
    SoundFx.playSuccessChime();
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
                Version 5.0 Global Internet Twin
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                Tier-1 BGP & Undersea Cable Grid
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Autonomous Global Internet Simulator
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!cableSevered ? (
            <Button variant="outline" size="sm" onClick={handleSeverCable} leftIcon={<AlertTriangle className="w-3.5 h-3.5 text-rose-400" />}>
              Cut Undersea Cable
            </Button>
          ) : (
            <span className="px-3 py-1 rounded-xl bg-rose-950/40 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold">
              MAREA Cable Cut
            </span>
          )}

          {!bgpHijackActive ? (
            <Button variant="outline" size="sm" onClick={handleSimulateHijack} leftIcon={<Zap className="w-3.5 h-3.5 text-amber-400" />}>
              Inject BGP Route Leak
            </Button>
          ) : (
            <span className="px-3 py-1 rounded-xl bg-amber-950/40 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold">
              RPKI Filter Active
            </span>
          )}

          <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset Twin
          </Button>
        </div>
      </div>

      {/* Main Grid: Global Network Grid (Left) & BGP NOC Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: Global Backbone Node Cards */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-5 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#00f0ff]" /> Global Autonomous Systems & IXPs
            </span>
            <span className="text-[10px] font-mono text-[#00f0ff]">Full Routing Table Synchronized</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {topo.nodes.map((node) => (
              <div
                key={node.id}
                className="p-3.5 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                    {node.name}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                    {node.asNumber ? `AS${node.asNumber}` : 'IXP'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span>Location: {node.country}</span>
                  <span>{node.prefixCount ? `${(node.prefixCount / 1000).toFixed(0)}k Prefixes` : 'Peering Fabric'}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Undersea Fiber Cables Grid */}
          <div className="space-y-2 pt-2 border-t border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
              Undersea Transoceanic Fiber Links
            </span>
            <div className="space-y-1.5">
              {topo.cables.map((cable) => (
                <div
                  key={cable.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-mono ${
                    cable.status === 'SEVERED'
                      ? 'border-rose-500/50 bg-rose-950/20 text-rose-300'
                      : 'border-[#262c42] bg-[#10131e] text-zinc-300'
                  }`}
                >
                  <span className="font-bold">{cable.name}</span>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span>{cable.capacityTbps} Tbps</span>
                    <span className="text-zinc-500">|</span>
                    <span className={cable.status === 'SEVERED' ? 'text-rose-400 font-bold' : 'text-[#00f0ff]'}>
                      {cable.latencyMs}ms RTT
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Global NOC Operations Wall */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" /> Global NOC Operations Wall
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              BGP v4 / v6 Dual-Stack
            </span>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Global Routing Table</span>
              <span className="text-lg font-bold text-white font-mono mt-1">945,210</span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Active IPv4/IPv6 Prefixes</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Autonomous Systems</span>
              <span className="text-lg font-bold text-[#00f0ff] font-mono mt-1">75,412</span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Global ASNs Online</span>
            </div>
          </div>

          {/* Incident Telemetry Box */}
          {activeSimulationLog ? (
            <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs font-mono text-amber-300 leading-relaxed animate-in fade-in">
              {activeSimulationLog}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#10131e] border border-[#202538] text-center text-xs font-mono text-zinc-500">
              Global Internet routing is nominal. Zero undersea fiber cuts or BGP hijacking events active.
            </div>
          )}

          {/* RPKI Security Status */}
          <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="font-bold text-white">RPKI Route Origin Validation</div>
                <div className="text-[10px] text-zinc-400">Cryptographic ROA Enforcement</div>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">ENFORCING</span>
          </div>
        </div>
      </div>
    </div>
  );
};

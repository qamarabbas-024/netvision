'use client';

import React, { useState } from 'react';
import {
  GitBranch,
  RotateCcw,
  Zap,
  Server,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export const STPVisual: React.FC = () => {
  const [swAPriority, setSwAPriority] = useState<number>(32768);
  const [swBPriority, setSwBPriority] = useState<number>(4096); // Lowest priority = default root
  const [swCPriority, setSwCPriority] = useState<number>(32768);
  const [linkABBroken, setLinkABBroken] = useState<boolean>(false);
  const [linkBCBroken, setLinkBCBroken] = useState<boolean>(false);
  const [linkACBroken, setLinkACBroken] = useState<boolean>(false);
  const [bpduAnimating, setBpduAnimating] = useState<boolean>(false);

  // Compute Root Bridge: Lowest Priority, then lowest MAC (SW-B default MAC is lowest)
  const switches = [
    { id: 'SW-A', name: 'Switch A (Access 1)', priority: swAPriority, mac: '00:1A:2B:3C:4D:01' },
    { id: 'SW-B', name: 'Switch B (Core / Distribution)', priority: swBPriority, mac: '00:1A:2B:3C:4D:02' },
    { id: 'SW-C', name: 'Switch C (Access 2)', priority: swCPriority, mac: '00:1A:2B:3C:4D:03' },
  ];

  // Sort to find root
  const sortedSwitches = [...switches].sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.mac.localeCompare(b.mac);
  });
  const rootBridge = sortedSwitches[0];

  // Determine port roles based on root and broken links
  // Topology:
  // SW-A (Top-Left) <--- Link AB (Cost 4) ---> SW-B (Top-Right, Root)
  //   |                                          |
  // Link AC (Cost 4)                          Link BC (Cost 4)
  //   |                                          |
  //   +-----------------> SW-C (Bottom) <-------+
  //
  // Normal state:
  // Root = SW-B
  // SW-B ports: All DESIGNATED (Forwarding)
  // SW-A: Port to SW-B is ROOT (Cost 4). Port to SW-C is DESIGNATED (SW-A has lower MAC than SW-C).
  // SW-C: Port to SW-B is ROOT (Cost 4). Port to SW-A is BLOCKED (Alternate) to prevent loop!

  let swA_portB_role: 'ROOT' | 'DESIGNATED' | 'BLOCKED' | 'DISABLED' = 'ROOT';
  let swA_portC_role: 'ROOT' | 'DESIGNATED' | 'BLOCKED' | 'DISABLED' = 'DESIGNATED';

  let swB_portA_role: 'ROOT' | 'DESIGNATED' | 'BLOCKED' | 'DISABLED' = 'DESIGNATED';
  let swB_portC_role: 'ROOT' | 'DESIGNATED' | 'BLOCKED' | 'DISABLED' = 'DESIGNATED';

  let swC_portB_role: 'ROOT' | 'DESIGNATED' | 'BLOCKED' | 'DISABLED' = 'ROOT';
  let swC_portA_role: 'ROOT' | 'DESIGNATED' | 'BLOCKED' | 'DISABLED' = 'BLOCKED';

  if (linkABBroken) {
    swA_portB_role = 'DISABLED';
    swB_portA_role = 'DISABLED';
    // SW-A must now route through SW-C to reach Root SW-B
    swA_portC_role = 'ROOT';
    swC_portA_role = 'DESIGNATED'; // Port unblocks and transitions to Forwarding!
    swC_portB_role = 'ROOT';
  } else if (linkBCBroken) {
    swB_portC_role = 'DISABLED';
    swC_portB_role = 'DISABLED';
    // SW-C must now route through SW-A to reach Root SW-B
    swC_portA_role = 'ROOT'; // Port unblocks!
    swA_portC_role = 'DESIGNATED';
    swA_portB_role = 'ROOT';
  } else if (linkACBroken) {
    swA_portC_role = 'DISABLED';
    swC_portA_role = 'DISABLED';
    swA_portB_role = 'ROOT';
    swC_portB_role = 'ROOT';
  }

  const getRoleClass = (role: string) => {
    if (role === 'ROOT') return 'text-emerald-400 font-bold';
    if (role === 'BLOCKED') return 'text-amber-400 font-bold';
    if (role === 'DISABLED') return 'text-zinc-600 line-through';
    return 'text-cyan-400 font-bold';
  };

  const triggerBpduPropagation = () => {
    setBpduAnimating(true);
    setTimeout(() => setBpduAnimating(false), 2500);
  };

  const resetTopology = () => {
    setSwAPriority(32768);
    setSwBPriority(4096);
    setSwCPriority(32768);
    setLinkABBroken(false);
    setLinkBCBroken(false);
    setLinkACBroken(false);
  };

  return (
    <div className="p-4 sm:p-6 rounded-2xl glass-panel border border-[#272732] flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-wider font-semibold block mb-1">
            IEEE 802.1D / 802.1w Protocol Engine
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-[#00f0ff] shrink-0" />
            <span>Spanning Tree Protocol (STP) Interactive Topology Engine</span>
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={linkABBroken || linkBCBroken || linkACBroken ? 'amber' : 'emerald'}>
            {linkABBroken || linkBCBroken || linkACBroken ? 'FAILOVER RECONVERGENCE' : 'LOOP-FREE TOPOLOGY'}
          </Badge>
        </div>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[#09090b] border border-[#272732]">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-300">Switch A Priority:</label>
          <select
            value={swAPriority}
            onChange={(e) => setSwAPriority(Number(e.target.value))}
            className="bg-[#121217] border border-[#272732] rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-[#00f0ff] outline-none"
          >
            <option value={4096}>4096 (Primary Root Target)</option>
            <option value={8192}>8192 (Secondary Root)</option>
            <option value={32768}>32768 (Default Priority)</option>
            <option value={61440}>61440 (Lowest Priority)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-300">Switch B Priority (Default Root):</label>
          <select
            value={swBPriority}
            onChange={(e) => setSwBPriority(Number(e.target.value))}
            className="bg-[#121217] border border-[#272732] rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-[#00f0ff] outline-none"
          >
            <option value={4096}>4096 (Primary Root Target)</option>
            <option value={8192}>8192 (Secondary Root)</option>
            <option value={32768}>32768 (Default Priority)</option>
            <option value={61440}>61440 (Lowest Priority)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-300">Switch C Priority:</label>
          <select
            value={swCPriority}
            onChange={(e) => setSwCPriority(Number(e.target.value))}
            className="bg-[#121217] border border-[#272732] rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-[#00f0ff] outline-none"
          >
            <option value={4096}>4096 (Primary Root Target)</option>
            <option value={8192}>8192 (Secondary Root)</option>
            <option value={32768}>32768 (Default Priority)</option>
            <option value={61440}>61440 (Lowest Priority)</option>
          </select>
        </div>
      </div>

      {/* Interactive Network Diagram */}
      <div className="relative p-6 sm:p-10 rounded-xl bg-[#09090b] border border-[#272732] min-h-[420px] flex flex-col justify-between overflow-hidden">
        {/* Animated BPDU Packets */}
        {bpduAnimating && (
          <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
            <div className="px-4 py-2 rounded-full bg-[#00f0ff]/20 border border-[#00f0ff] text-[#00f0ff] text-xs font-mono font-bold animate-pulse shadow-glow-cyan">
              ⚡ Propagating Configuration BPDUs (Hello: 2.0s, Root Cost: 0)
            </div>
          </div>
        )}

        {/* Top Row: Switch A and Switch B */}
        <div className="flex items-center justify-between gap-4 z-0">
          {/* Switch A */}
          <div className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 min-w-[160px] ${
            rootBridge.id === 'SW-A' ? 'border-amber-400 bg-amber-400/10 shadow-glow-amber' : 'border-[#272732] bg-[#121217]'
          }`}>
            <Server className={`w-8 h-8 ${rootBridge.id === 'SW-A' ? 'text-amber-400' : 'text-[#00f0ff]'}`} />
            <div className="text-center">
              <span className="text-xs font-bold text-white block">Switch A</span>
              <span className="text-[10px] font-mono text-zinc-400 block">BID: {swAPriority}.001A</span>
              {rootBridge.id === 'SW-A' && (
                <Badge variant="amber" className="text-[9px] mt-1">👑 ROOT BRIDGE</Badge>
              )}
            </div>
            {/* Ports */}
            <div className="w-full flex justify-between gap-2 mt-1 pt-2 border-t border-zinc-800 text-[10px] font-mono">
              <span className={getRoleClass(swA_portB_role)}>
                p1: {swA_portB_role}
              </span>
              <span className={getRoleClass(swA_portC_role)}>
                p2: {swA_portC_role}
              </span>
            </div>
          </div>

          {/* Link A-B Interconnect */}
          <div className="flex-1 flex flex-col items-center gap-1.5 px-4">
            <button
              onClick={() => setLinkABBroken(!linkABBroken)}
              className={`px-3 py-1 rounded text-[11px] font-mono font-bold transition-all border ${
                linkABBroken
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                  : 'bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:border-rose-400 hover:text-rose-400'
              }`}
            >
              {linkABBroken ? '❌ Link A-B Severed (Click to Restore)' : '⚡ Link A-B (Cost: 4)'}
            </button>
            <div className={`w-full h-1 rounded transition-all ${linkABBroken ? 'bg-rose-500/40 stroke-dashed' : 'bg-emerald-500 shadow-glow-emerald'}`} />
          </div>

          {/* Switch B */}
          <div className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 min-w-[160px] ${
            rootBridge.id === 'SW-B' ? 'border-amber-400 bg-amber-400/10 shadow-glow-amber' : 'border-[#272732] bg-[#121217]'
          }`}>
            <Server className={`w-8 h-8 ${rootBridge.id === 'SW-B' ? 'text-amber-400' : 'text-[#00f0ff]'}`} />
            <div className="text-center">
              <span className="text-xs font-bold text-white block">Switch B</span>
              <span className="text-[10px] font-mono text-zinc-400 block">BID: {swBPriority}.001B</span>
              {rootBridge.id === 'SW-B' && (
                <Badge variant="amber" className="text-[9px] mt-1">👑 ROOT BRIDGE</Badge>
              )}
            </div>
            {/* Ports */}
            <div className="w-full flex justify-between gap-2 mt-1 pt-2 border-t border-zinc-800 text-[10px] font-mono">
              <span className={getRoleClass(swB_portA_role)}>
                p1: {swB_portA_role}
              </span>
              <span className={getRoleClass(swB_portC_role)}>
                p2: {swB_portC_role}
              </span>
            </div>
          </div>
        </div>

        {/* Diagonal Vertical Links */}
        <div className="flex justify-between px-16 my-4">
          <button
            onClick={() => setLinkACBroken(!linkACBroken)}
            className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all border ${
              linkACBroken
                ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-rose-400'
            }`}
          >
            {linkACBroken ? '❌ Link A-C Severed' : 'Link A-C (Cost: 4)'}
          </button>

          <button
            onClick={() => setLinkBCBroken(!linkBCBroken)}
            className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all border ${
              linkBCBroken
                ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-rose-400'
            }`}
          >
            {linkBCBroken ? '❌ Link B-C Severed' : 'Link B-C (Cost: 4)'}
          </button>
        </div>

        {/* Bottom Row: Switch C */}
        <div className="flex justify-center z-0">
          <div className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 min-w-[200px] ${
            rootBridge.id === 'SW-C' ? 'border-amber-400 bg-amber-400/10 shadow-glow-amber' : 'border-[#272732] bg-[#121217]'
          }`}>
            <Server className={`w-8 h-8 ${rootBridge.id === 'SW-C' ? 'text-amber-400' : 'text-[#00f0ff]'}`} />
            <div className="text-center">
              <span className="text-xs font-bold text-white block">Switch C (Access 2)</span>
              <span className="text-[10px] font-mono text-zinc-400 block">BID: {swCPriority}.001C</span>
              {rootBridge.id === 'SW-C' && (
                <Badge variant="amber" className="text-[9px] mt-1">👑 ROOT BRIDGE</Badge>
              )}
            </div>
            {/* Ports */}
            <div className="w-full flex justify-between gap-4 mt-1 pt-2 border-t border-zinc-800 text-[10px] font-mono">
              <span className={getRoleClass(swC_portA_role)}>
                p1 (to A): {swC_portA_role}
              </span>
              <span className={getRoleClass(swC_portB_role)}>
                p2 (to B): {swC_portB_role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#09090b] border border-[#272732]">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 font-mono text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Root Port (RP)
          </span>
          <span className="flex items-center gap-1.5 font-mono text-cyan-400">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Designated Port (DP)
          </span>
          <span className="flex items-center gap-1.5 font-mono text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Blocked / Alternate (BLK)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={triggerBpduPropagation}>
            <Zap className="w-3.5 h-3.5 mr-1 text-[#00f0ff]" /> Transmit BPDUs
          </Button>
          <Button variant="ghost" size="sm" onClick={resetTopology}>
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset Topology
          </Button>
        </div>
      </div>

      {/* Real-Time Learning Insights */}
      <div className="p-4 rounded-xl bg-[#121217] border border-[#272732] text-xs leading-relaxed text-zinc-300">
        <strong className="text-white block mb-1">STP Topology State Analysis:</strong>
        {rootBridge.id === 'SW-B' && !linkABBroken && !linkBCBroken && (
          <p>
            Switch B is elected <strong>Root Bridge</strong> because it has the lowest Bridge ID Priority (<code>{swBPriority}</code>). Switch C blocks its port facing Switch A (<code>p1: BLOCKED</code>) to prevent a Layer-2 switching loop. Broadcast frames cannot circulate indefinitely.
          </p>
        )}
        {linkBCBroken && (
          <p className="text-emerald-300 font-semibold">
            ⚡ Link B-C Failure Detected! STP reconverges: Switch C unblocks its port to Switch A (<code>p1: ROOT</code>) and forwards traffic to the Root Bridge through Switch A with zero network loops.
          </p>
        )}
        {linkABBroken && (
          <p className="text-emerald-300 font-semibold">
            ⚡ Link A-B Failure Detected! Switch A detects root port loss and promotes its port to Switch C as the new <code>ROOT</code> port. Switch C unblocks port 1 to maintain loop-free path connectivity.
          </p>
        )}
      </div>
    </div>
  );
};

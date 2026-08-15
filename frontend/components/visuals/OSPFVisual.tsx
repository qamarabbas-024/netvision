'use client';

import React, { useState } from 'react';
import {
  Network,
  RotateCcw,
  Zap,
  Server,
  Activity,
  Database,
  Play,
  Layers,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

type NeighborState = 'DOWN' | 'INIT' | '2-WAY' | 'EXSTART' | 'EXCHANGE' | 'LOADING' | 'FULL';

export const OSPFVisual: React.FC = () => {
  const [neighborStep, setNeighborStep] = useState<number>(6); // 0=DOWN to 6=FULL
  const [r1Priority, setR1Priority] = useState<number>(1);
  const [r2Priority, setR2Priority] = useState<number>(255); // Highest priority = DR target
  const [r3Priority, setR3Priority] = useState<number>(128); // Secondary priority = BDR target
  const [linkABBroken, setLinkABBroken] = useState<boolean>(false);
  const [linkBCBroken, setLinkBCBroken] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'topology' | 'lsdb' | 'spf'>('topology');
  const [helloAnimating, setHelloAnimating] = useState<boolean>(false);

  const neighborStates: NeighborState[] = ['DOWN', 'INIT', '2-WAY', 'EXSTART', 'EXCHANGE', 'LOADING', 'FULL'];
  const currentState = neighborStates[neighborStep];

  // Dynamic DR/BDR Calculation based on Priority + Router ID
  const routers = [
    { id: 'R1', name: 'Router 1 (HQ Edge)', routerId: '1.1.1.1', priority: r1Priority },
    { id: 'R2', name: 'Router 2 (Core A)', routerId: '2.2.2.2', priority: r2Priority },
    { id: 'R3', name: 'Router 3 (Core B)', routerId: '3.3.3.3', priority: r3Priority },
  ];

  // Sorted by Priority DESC, then Router ID DESC
  const sortedForDr = [...routers].sort((a, b) => {
    if (a.priority !== b.priority) return b.priority - a.priority;
    return b.routerId.localeCompare(a.routerId);
  });

  const drId = sortedForDr[0].id;
  const bdrId = sortedForDr[1].id;

  const getRole = (id: string): 'DR' | 'BDR' | 'DROTHER' => {
    if (id === drId) return 'DR';
    if (id === bdrId) return 'BDR';
    return 'DROTHER';
  };

  const triggerHello = () => {
    setHelloAnimating(true);
    setTimeout(() => setHelloAnimating(false), 2000);
  };

  const stepForwardState = () => {
    setNeighborStep((prev) => Math.min(prev + 1, 6));
  };

  const resetSimulation = () => {
    setNeighborStep(6);
    setR1Priority(1);
    setR2Priority(255);
    setR3Priority(128);
    setLinkABBroken(false);
    setLinkBCBroken(false);
    setActiveTab('topology');
  };

  // SPF Shortest Path calculation from R1's perspective:
  // Direct R1 -> R2 Cost = 10
  // Direct R1 -> R3 Cost = 10
  // Link R2 -> R3 Cost = 5
  // If linkAB is broken: R1 -> R3 (10) -> R2 (5) = Cost 15
  const r1ToR2Cost = linkABBroken ? 15 : 10;
  const r1ToR2Path = linkABBroken ? 'R1 -> R3 -> R2 (via Alternate Link)' : 'R1 -> R2 (Direct Link)';

  return (
    <div className="p-4 sm:p-6 rounded-2xl glass-panel border border-[#272732] flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-wider font-semibold block mb-1">
            RFC 2328 / Single-Area OSPFv2 Protocol Engine
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-[#00f0ff] shrink-0" />
            <span>Open Shortest Path First (OSPF) Link-State Simulation</span>
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={currentState === 'FULL' ? 'emerald' : 'amber'}>
            {currentState === 'FULL' ? 'OSPF FULL ADJACENCY' : `STATE: ${currentState}`}
          </Badge>
          <Badge variant="cyan">AREA 0 (BACKBONE)</Badge>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('topology')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'topology' ? 'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30' : 'text-zinc-400 hover:text-white'
          }`}
        >
          🌐 Network Topology & Adjacency
        </button>
        <button
          onClick={() => setActiveTab('lsdb')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'lsdb' ? 'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30' : 'text-zinc-400 hover:text-white'
          }`}
        >
          🗄️ Link-State Database (LSDB)
        </button>
        <button
          onClick={() => setActiveTab('spf')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'spf' ? 'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30' : 'text-zinc-400 hover:text-white'
          }`}
        >
          📐 SPF Dijkstra Tree & Routing Table
        </button>
      </div>

      {/* Tab 1: Topology View */}
      {activeTab === 'topology' && (
        <div className="flex flex-col gap-6">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#09090b] border border-[#272732]">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-zinc-300">R1 Priority (RID: 1.1.1.1):</label>
              <select
                value={r1Priority}
                onChange={(e) => setR1Priority(Number(e.target.value))}
                className="bg-[#121217] border border-[#272732] rounded-lg px-2.5 py-1 text-xs text-white outline-none"
              >
                <option value={1}>1 (Default DROTHER)</option>
                <option value={100}>100 (High)</option>
                <option value={255}>255 (Highest - Force DR)</option>
                <option value={0}>0 (Never DR/BDR)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-zinc-300">R2 Priority (RID: 2.2.2.2):</label>
              <select
                value={r2Priority}
                onChange={(e) => setR2Priority(Number(e.target.value))}
                className="bg-[#121217] border border-[#272732] rounded-lg px-2.5 py-1 text-xs text-white outline-none"
              >
                <option value={255}>255 (Highest - Elected DR)</option>
                <option value={128}>128 (Medium)</option>
                <option value={1}>1 (Default)</option>
                <option value={0}>0 (Never DR/BDR)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-zinc-300">R3 Priority (RID: 3.3.3.3):</label>
              <select
                value={r3Priority}
                onChange={(e) => setR3Priority(Number(e.target.value))}
                className="bg-[#121217] border border-[#272732] rounded-lg px-2.5 py-1 text-xs text-white outline-none"
              >
                <option value={128}>128 (Medium - Elected BDR)</option>
                <option value={200}>200 (High)</option>
                <option value={1}>1 (Default)</option>
                <option value={0}>0 (Never DR/BDR)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1 justify-center">
              <label className="text-xs font-medium text-zinc-300">Neighbor State Step:</label>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={stepForwardState} disabled={neighborStep >= 6} className="w-full">
                  <Play className="w-3.5 h-3.5 mr-1" /> Next State ({currentState})
                </Button>
              </div>
            </div>
          </div>

          {/* Interactive Router Grid */}
          <div className="relative p-6 sm:p-10 rounded-xl bg-[#09090b] border border-[#272732] min-h-[400px] flex flex-col justify-between overflow-hidden">
            {/* Animated Hello Packet Banner */}
            {helloAnimating && (
              <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                <div className="px-4 py-2 rounded-full bg-[#00f0ff]/20 border border-[#00f0ff] text-[#00f0ff] text-xs font-mono font-bold animate-pulse shadow-glow-cyan">
                  ⚡ Multicasting OSPF Hello to 224.0.0.5 (Dead: 40s, Hello: 10s)
                </div>
              </div>
            )}

            {/* Top Row: R1 and R2 */}
            <div className="flex items-center justify-between gap-4 z-0">
              {/* R1 */}
              <div className="p-4 rounded-xl border border-[#272732] bg-[#121217] flex flex-col items-center gap-2 min-w-[170px]">
                <Server className="w-8 h-8 text-[#00f0ff]" />
                <div className="text-center">
                  <span className="text-xs font-bold text-white block">Router 1 (HQ)</span>
                  <span className="text-[10px] font-mono text-zinc-400 block">RID: 1.1.1.1 (Prio: {r1Priority})</span>
                  <Badge variant={getRole('R1') === 'DR' ? 'emerald' : getRole('R1') === 'BDR' ? 'cyan' : 'neutral'} className="text-[9px] mt-1">
                    Role: {getRole('R1')}
                  </Badge>
                </div>
                <div className="text-[10px] font-mono text-zinc-400 mt-1">IP: 10.0.12.1/24</div>
              </div>

              {/* Link R1-R2 */}
              <div className="flex-1 flex flex-col items-center gap-1.5 px-4">
                <button
                  onClick={() => setLinkABBroken(!linkABBroken)}
                  className={`px-3 py-1 rounded text-[11px] font-mono font-bold transition-all border ${
                    linkABBroken
                      ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                      : 'bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:border-rose-400 hover:text-rose-400'
                  }`}
                >
                  {linkABBroken ? '❌ Link R1-R2 Down' : '⚡ 10.0.12.0/24 (Cost: 10)'}
                </button>
                <div className={`w-full h-1 rounded transition-all ${linkABBroken ? 'bg-rose-500/40' : 'bg-emerald-500 shadow-glow-emerald'}`} />
              </div>

              {/* R2 */}
              <div className="p-4 rounded-xl border border-[#272732] bg-[#121217] flex flex-col items-center gap-2 min-w-[170px]">
                <Server className="w-8 h-8 text-emerald-400" />
                <div className="text-center">
                  <span className="text-xs font-bold text-white block">Router 2 (Core A)</span>
                  <span className="text-[10px] font-mono text-zinc-400 block">RID: 2.2.2.2 (Prio: {r2Priority})</span>
                  <Badge variant={getRole('R2') === 'DR' ? 'emerald' : getRole('R2') === 'BDR' ? 'cyan' : 'neutral'} className="text-[9px] mt-1">
                    Role: {getRole('R2')}
                  </Badge>
                </div>
                <div className="text-[10px] font-mono text-zinc-400 mt-1">IP: 10.0.12.2/24</div>
              </div>
            </div>

            {/* Vertical Link Interconnects */}
            <div className="flex justify-between px-16 my-4">
              <div className="text-[10px] font-mono text-cyan-400 bg-zinc-900 px-2 py-1 rounded border border-zinc-700">
                Link R1-R3 (Cost: 10)
              </div>
              <button
                onClick={() => setLinkBCBroken(!linkBCBroken)}
                className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all border ${
                  linkBCBroken
                    ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-rose-400'
                }`}
              >
                {linkBCBroken ? '❌ Link R2-R3 Down' : 'Link R2-R3 (Cost: 5)'}
              </button>
            </div>

            {/* Bottom Row: R3 */}
            <div className="flex justify-center z-0">
              <div className="p-4 rounded-xl border border-[#272732] bg-[#121217] flex flex-col items-center gap-2 min-w-[190px]">
                <Server className="w-8 h-8 text-cyan-400" />
                <div className="text-center">
                  <span className="text-xs font-bold text-white block">Router 3 (Core B)</span>
                  <span className="text-[10px] font-mono text-zinc-400 block">RID: 3.3.3.3 (Prio: {r3Priority})</span>
                  <Badge variant={getRole('R3') === 'DR' ? 'emerald' : getRole('R3') === 'BDR' ? 'cyan' : 'neutral'} className="text-[9px] mt-1">
                    Role: {getRole('R3')}
                  </Badge>
                </div>
                <div className="text-[10px] font-mono text-zinc-400 mt-1">IP: 10.0.23.3/24</div>
              </div>
            </div>
          </div>

          {/* 7-State Neighbor FSM Walkthrough Bar */}
          <div className="p-4 rounded-xl bg-[#09090b] border border-[#272732] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#00f0ff]" /> OSPF 7-State Neighbor Adjacency Progression
              </span>
              <span className="text-[11px] font-mono text-[#00f0ff]">Step {neighborStep + 1} of 7: {currentState}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-7 gap-1.5 text-center text-[10px] font-mono">
              {neighborStates.map((state, idx) => (
                <div
                  key={state}
                  className={`p-2 rounded border transition-all ${
                    idx === neighborStep
                      ? 'border-[#00f0ff] bg-[#00f0ff]/20 text-white font-bold shadow-glow-cyan'
                      : idx < neighborStep
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                      : 'border-zinc-800 bg-[#121217] text-zinc-500'
                  }`}
                >
                  {state}
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-[#121217] text-xs text-zinc-300 leading-relaxed border border-[#272732]">
              {neighborStep === 0 && 'DOWN: No Hello packets received yet on the interface.'}
              {neighborStep === 1 && 'INIT: Received Hello packet from neighbor, but local Router ID is not listed in neighbor’s Seen list.'}
              {neighborStep === 2 && '2-WAY: Bidirectional communication established. Local RID found in neighbor Hello. DR/BDR election occurs here.'}
              {neighborStep === 3 && 'EXSTART: Routers negotiate Master/Slave relationship and initial Database Description (DBD) Sequence Numbers.'}
              {neighborStep === 4 && 'EXCHANGE: Routers exchange DBD packets describing summaries of all LSAs in their local LSDB.'}
              {neighborStep === 5 && 'LOADING: Routers request full missing LSAs via Link-State Request (LSR) and receive Link-State Updates (LSU).'}
              {neighborStep === 6 && 'FULL: Databases are 100% synchronized! Full routing adjacencies formed, ready for SPF route calculation.'}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: LSDB View */}
      {activeTab === 'lsdb' && (
        <div className="p-5 rounded-xl bg-[#09090b] border border-[#272732] flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-[#00f0ff]" /> Area 0 Link-State Database (LSDB) - Type-1 Router LSAs
            </h4>
            <Badge variant="cyan">Synchronized across Area 0</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-zinc-700 text-zinc-400">
                  <th className="py-2 px-3">Link ID (Adv Router)</th>
                  <th className="py-2 px-3">Advertising Router</th>
                  <th className="py-2 px-3">Sequence #</th>
                  <th className="py-2 px-3">Checksum</th>
                  <th className="py-2 px-3">Links Count</th>
                  <th className="py-2 px-3">Connected Subnets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                <tr className="hover:bg-zinc-900/50">
                  <td className="py-2.5 px-3 text-[#00f0ff] font-bold">1.1.1.1</td>
                  <td className="py-2.5 px-3">1.1.1.1 (R1)</td>
                  <td className="py-2.5 px-3">0x80000004</td>
                  <td className="py-2.5 px-3">0x4F2A</td>
                  <td className="py-2.5 px-3">2</td>
                  <td className="py-2.5 px-3">10.0.12.0/24 (Cost 10), 10.0.13.0/24 (Cost 10)</td>
                </tr>
                <tr className="hover:bg-zinc-900/50">
                  <td className="py-2.5 px-3 text-emerald-400 font-bold">2.2.2.2</td>
                  <td className="py-2.5 px-3">2.2.2.2 (R2 - DR)</td>
                  <td className="py-2.5 px-3">0x80000006</td>
                  <td className="py-2.5 px-3">0x8C1B</td>
                  <td className="py-2.5 px-3">2</td>
                  <td className="py-2.5 px-3">10.0.12.0/24 (Cost 10), 10.0.23.0/24 (Cost 5)</td>
                </tr>
                <tr className="hover:bg-zinc-900/50">
                  <td className="py-2.5 px-3 text-cyan-400 font-bold">3.3.3.3</td>
                  <td className="py-2.5 px-3">3.3.3.3 (R3 - BDR)</td>
                  <td className="py-2.5 px-3">0x80000005</td>
                  <td className="py-2.5 px-3">0x2A7E</td>
                  <td className="py-2.5 px-3">2</td>
                  <td className="py-2.5 px-3">10.0.13.0/24 (Cost 10), 10.0.23.0/24 (Cost 5)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: SPF Tree & Route Table View */}
      {activeTab === 'spf' && (
        <div className="p-5 rounded-xl bg-[#09090b] border border-[#272732] flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00f0ff]" /> Router 1 (1.1.1.1) Routing Table via Dijkstra SPF Tree
            </h4>
            <Badge variant={linkABBroken ? 'amber' : 'emerald'}>
              {linkABBroken ? 'RECALCULATED VIA R3' : 'OPTIMAL SHORTEST PATHS'}
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-zinc-700 text-zinc-400">
                  <th className="py-2 px-3">Type</th>
                  <th className="py-2 px-3">Destination Subnet</th>
                  <th className="py-2 px-3">Admin Dist / Metric</th>
                  <th className="py-2 px-3">Next-Hop IP</th>
                  <th className="py-2 px-3">Out Interface</th>
                  <th className="py-2 px-3">Path Computed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                <tr className="hover:bg-zinc-900/50">
                  <td className="py-2.5 px-3 text-[#00f0ff] font-bold">O (OSPF)</td>
                  <td className="py-2.5 px-3">10.0.23.0/24</td>
                  <td className="py-2.5 px-3">[110 / {r1ToR2Cost + 5}]</td>
                  <td className="py-2.5 px-3">{linkABBroken ? '10.0.13.3 (R3)' : '10.0.12.2 (R2)'}</td>
                  <td className="py-2.5 px-3">{linkABBroken ? 'GigabitEthernet0/2' : 'GigabitEthernet0/1'}</td>
                  <td className="py-2.5 px-3 text-emerald-400">{r1ToR2Path}</td>
                </tr>
                <tr className="hover:bg-zinc-900/50">
                  <td className="py-2.5 px-3 text-zinc-400">C (Direct)</td>
                  <td className="py-2.5 px-3">10.0.12.0/24</td>
                  <td className="py-2.5 px-3">[0 / 0]</td>
                  <td className="py-2.5 px-3">Directly connected</td>
                  <td className="py-2.5 px-3">GigabitEthernet0/1</td>
                  <td className="py-2.5 px-3">Local Interface</td>
                </tr>
                <tr className="hover:bg-zinc-900/50">
                  <td className="py-2.5 px-3 text-zinc-400">C (Direct)</td>
                  <td className="py-2.5 px-3">10.0.13.0/24</td>
                  <td className="py-2.5 px-3">[0 / 0]</td>
                  <td className="py-2.5 px-3">Directly connected</td>
                  <td className="py-2.5 px-3">GigabitEthernet0/2</td>
                  <td className="py-2.5 px-3">Local Interface</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#09090b] border border-[#272732]">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
          <Zap className="w-4 h-4 text-[#00f0ff]" /> Multicast IPs: <code>224.0.0.5</code> (AllSPFRouters) | <code>224.0.0.6</code> (AllDRouters)
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={triggerHello}>
            <Zap className="w-3.5 h-3.5 mr-1 text-[#00f0ff]" /> Send Hello Multicast
          </Button>
          <Button variant="ghost" size="sm" onClick={resetSimulation}>
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset Simulation
          </Button>
        </div>
      </div>
    </div>
  );
};

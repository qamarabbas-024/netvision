'use client';

import React, { useState } from 'react';
import { Laptop, Server, Radio, ArrowRight, ArrowLeft, RefreshCw, ShieldCheck, CheckCircle, Database } from 'lucide-react';

type ARPScenario = 'local' | 'remote' | 'garp';
type ARPStep = 'idle' | 'broadcast_req' | 'unicast_rep' | 'cached';

interface ARPEntry {
  ip: string;
  mac: string;
  type: 'dynamic' | 'static';
  ttl: number;
}

export const ARPVisual: React.FC = () => {
  const [scenario, setScenario] = useState<ARPScenario>('local');
  const [step, setStep] = useState<ARPStep>('idle');
  const [arpTable, setArpTable] = useState<ARPEntry[]>([
    { ip: '192.168.1.255', mac: 'FF:FF:FF:FF:FF:FF', type: 'static', ttl: 999 },
  ]);

  const handleScenarioChange = (s: ARPScenario) => {
    setScenario(s);
    setStep('idle');
    setArpTable([{ ip: '192.168.1.255', mac: 'FF:FF:FF:FF:FF:FF', type: 'static', ttl: 999 }]);
  };

  const handleNextStep = () => {
    if (step === 'idle') {
      setStep('broadcast_req');
    } else if (step === 'broadcast_req') {
      setStep('unicast_rep');
    } else if (step === 'unicast_rep') {
      setStep('cached');
      // Add entry to ARP table
      if (scenario === 'local') {
        setArpTable((prev) => [
          ...prev.filter((e) => e.ip !== '192.168.1.50'),
          { ip: '192.168.1.50', mac: '44:55:66:77:88:99', type: 'dynamic', ttl: 120 },
        ]);
      } else if (scenario === 'remote') {
        setArpTable((prev) => [
          ...prev.filter((e) => e.ip !== '192.168.1.1'),
          { ip: '192.168.1.1', mac: '00:1A:2B:00:00:01', type: 'dynamic', ttl: 300 },
        ]);
      }
    }
  };

  const handleReset = () => {
    setStep('idle');
    setArpTable([{ ip: '192.168.1.255', mac: 'FF:FF:FF:FF:FF:FF', type: 'static', ttl: 999 }]);
  };

  return (
    <div className="p-4 sm:p-6 rounded-2xl glass-panel border border-[#272732] flex flex-col gap-5 sm:gap-6 bg-[#121217]">
      {/* Header & Scenario Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#272732] pb-4">
        <div>
          <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-wider font-semibold block mb-1">
            Layer 2/3 Address Resolution Engine
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#00f0ff] shrink-0" />
            <span>Interactive ARP Resolution & Cache Inspector</span>
          </h3>
        </div>

        {/* Scenario Tabs */}
        <div className="flex items-center bg-[#09090b] rounded-lg p-1 border border-[#272732] overflow-x-auto">
          <button
            type="button"
            onClick={() => handleScenarioChange('local')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
              scenario === 'local' ? 'bg-[#00f0ff] text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            1. Local Host Resolution
          </button>
          <button
            type="button"
            onClick={() => handleScenarioChange('remote')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
              scenario === 'remote' ? 'bg-[#00f0ff] text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            2. Off-Subnet Gateway
          </button>
          <button
            type="button"
            onClick={() => handleScenarioChange('garp')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
              scenario === 'garp' ? 'bg-[#00f0ff] text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            3. Gratuitous ARP (DAD)
          </button>
        </div>
      </div>

      {/* Network Nodes Topology */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#09090b] border border-[#272732] flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono">
          {/* Node 1: Laptop A (Initiator) */}
          <div
            className={`p-3 rounded-xl border flex flex-col items-center text-center gap-1 transition-all ${
              step === 'broadcast_req' || step === 'cached'
                ? 'border-[#00f0ff] bg-[#00f0ff]/10 shadow-sm shadow-[#00f0ff]/20'
                : 'border-[#272732] bg-[#121217]'
            }`}
          >
            <Laptop className="w-6 h-6 text-[#00f0ff]" />
            <span className="text-xs font-bold text-white">Laptop-A (Sender)</span>
            <span className="text-[10px] text-zinc-300">192.168.1.10</span>
            <span className="text-[9px] text-[#00f0ff] break-all">AA:BB:CC:11:22:33</span>
          </div>

          {/* Node 2: Laptop B (Unrelated Neighbor) */}
          <div
            className={`p-3 rounded-xl border flex flex-col items-center text-center gap-1 transition-all ${
              step === 'broadcast_req'
                ? 'border-amber-400/50 bg-amber-400/5'
                : 'border-[#272732] bg-[#121217]'
            }`}
          >
            <Laptop className="w-6 h-6 text-zinc-400" />
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-zinc-300">Laptop-B</span>
              {step === 'broadcast_req' && (
                <span className="text-[8px] px-1 rounded bg-rose-500/20 text-rose-400 font-bold">DROPS</span>
              )}
            </div>
            <span className="text-[10px] text-zinc-400">192.168.1.20</span>
            <span className="text-[9px] text-zinc-500 break-all">AA:BB:CC:11:22:44</span>
          </div>

          {/* Node 3: Gateway Router */}
          <div
            className={`p-3 rounded-xl border flex flex-col items-center text-center gap-1 transition-all ${
              scenario === 'remote' && (step === 'broadcast_req' || step === 'unicast_rep')
                ? 'border-[#38bdf8] bg-[#38bdf8]/10 shadow-sm shadow-[#38bdf8]/20'
                : 'border-[#272732] bg-[#121217]'
            }`}
          >
            <Radio className="w-6 h-6 text-[#38bdf8]" />
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-white">Gateway-Router</span>
              {scenario === 'remote' && step === 'unicast_rep' && (
                <span className="text-[8px] px-1 rounded bg-emerald-500/20 text-emerald-400 font-bold">REPLIES</span>
              )}
            </div>
            <span className="text-[10px] text-zinc-300">192.168.1.1</span>
            <span className="text-[9px] text-[#38bdf8] break-all">00:1A:2B:00:00:01</span>
          </div>

          {/* Node 4: Target Server */}
          <div
            className={`p-3 rounded-xl border flex flex-col items-center text-center gap-1 transition-all ${
              scenario === 'local' && (step === 'broadcast_req' || step === 'unicast_rep')
                ? 'border-emerald-400 bg-emerald-400/10 shadow-sm shadow-emerald-400/20'
                : 'border-[#272732] bg-[#121217]'
            }`}
          >
            <Server className="w-6 h-6 text-emerald-400" />
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-white">Target-Server</span>
              {scenario === 'local' && step === 'unicast_rep' && (
                <span className="text-[8px] px-1 rounded bg-emerald-500/20 text-emerald-400 font-bold">REPLIES</span>
              )}
            </div>
            <span className="text-[10px] text-zinc-300">192.168.1.50</span>
            <span className="text-[9px] text-emerald-400 break-all">44:55:66:77:88:99</span>
          </div>
        </div>

        {/* In-Flight Frame Inspector Banner */}
        <div className="p-3.5 rounded-xl bg-[#121217] border border-[#272732] flex flex-col gap-2 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#00f0ff]" />
              {step === 'idle' && 'Step 0: ARP Cache Miss / Initialization'}
              {step === 'broadcast_req' && 'Step 1: Layer 2 Broadcast ARP Request (Opcode 1)'}
              {step === 'unicast_rep' && 'Step 2: Layer 2 Unicast ARP Reply (Opcode 2)'}
              {step === 'cached' && 'Step 3: Dynamic Binding Stored in ARP Cache'}
            </span>
            <span className="text-[10px] text-zinc-400">
              EtherType: <strong className="text-[#00f0ff]">0x0806 (ARP)</strong>
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#09090b] border border-[#272732] text-[11px] leading-relaxed text-zinc-300">
            {step === 'idle' && scenario === 'local' && (
              <span>Laptop A needs to transmit an IP packet to local host <strong className="text-white">192.168.1.50</strong>, but its MAC is not in cache. Click <strong>"1. Broadcast ARP Request"</strong>.</span>
            )}
            {step === 'idle' && scenario === 'remote' && (
              <span>Laptop A needs to reach public web server <strong className="text-white">8.8.8.8</strong>. Because 8.8.8.8 is off-subnet, Laptop A must resolve its <strong className="text-[#38bdf8]">Default Gateway (192.168.1.1)</strong> MAC.</span>
            )}
            {step === 'idle' && scenario === 'garp' && (
              <span>Laptop A boots up with IP <strong className="text-white">192.168.1.10</strong>. It transmits a Gratuitous ARP (GARP) where Sender IP = Target IP to detect duplicate IP conflicts.</span>
            )}

            {step === 'broadcast_req' && (
              <div className="flex flex-col gap-1">
                <div className="text-[#00f0ff] font-bold flex items-center gap-1">
                  <ArrowRight className="w-3.5 h-3.5" /> Frame Dst MAC: FF:FF:FF:FF:FF:FF (Broadcast to all switch ports)
                </div>
                <div className="text-zinc-400 text-[10px]">
                  ARP Payload: <span className="text-white">Opcode=1 (Request)</span> | Sender: <span className="text-[#00f0ff]">AA:BB:CC:11:22:33 (192.168.1.10)</span> | Target: <span className="text-amber-400">00:00:00:00:00:00 ({scenario === 'local' ? '192.168.1.50' : scenario === 'remote' ? '192.168.1.1' : '192.168.1.10'})</span>
                </div>
                <div className="text-zinc-400 text-[10px]">
                  Laptop B receives the broadcast, sees target IP is not its own, and quietly discards the frame.
                </div>
              </div>
            )}

            {step === 'unicast_rep' && (
              <div className="flex flex-col gap-1">
                <div className="text-emerald-400 font-bold flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" /> Frame Dst MAC: AA:BB:CC:11:22:33 (Unicast directly to Laptop A)
                </div>
                <div className="text-zinc-400 text-[10px]">
                  ARP Payload: <span className="text-white">Opcode=2 (Reply)</span> | Sender: <span className="text-emerald-400">{scenario === 'local' ? '44:55:66:77:88:99 (192.168.1.50)' : '00:1A:2B:00:00:01 (192.168.1.1)'}</span> | Target: <span className="text-[#00f0ff]">AA:BB:CC:11:22:33 (192.168.1.10)</span>
                </div>
              </div>
            )}

            {step === 'cached' && (
              <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Mapping dynamically saved into Laptop A in-memory ARP table. Future packets transmit immediately without broadcast flooding!</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Host ARP Cache Table Display */}
        <div className="flex flex-col gap-2 font-mono text-xs">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="flex items-center gap-1.5 text-white font-bold">
              <Database className="w-3.5 h-3.5 text-[#00f0ff]" /> Laptop-A ARP Table (`arp -a`)
            </span>
            <span className="text-[10px] text-zinc-500">Aging Timer: 20-300s</span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#272732] bg-[#121217]">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-[#181820] text-zinc-400 border-b border-[#272732]">
                <tr>
                  <th className="py-1.5 px-3">Internet Address</th>
                  <th className="py-1.5 px-3">Physical Address (MAC)</th>
                  <th className="py-1.5 px-3">Type</th>
                  <th className="py-1.5 px-3">TTL Timer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#272732] text-zinc-300">
                {arpTable.map((row, idx) => (
                  <tr key={idx} className={row.type === 'dynamic' ? 'bg-[#00f0ff]/5' : ''}>
                    <td className="py-1.5 px-3 font-bold text-white">{row.ip}</td>
                    <td className="py-1.5 px-3 font-mono text-[#00f0ff]">{row.mac}</td>
                    <td className="py-1.5 px-3 capitalize">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        row.type === 'dynamic' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {row.type}
                      </span>
                    </td>
                    <td className="py-1.5 px-3 text-zinc-400">{row.ttl}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Action Navigation Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={handleReset}
          className="text-xs font-mono font-bold text-zinc-400 hover:text-white flex items-center gap-1.5 py-1 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reset Simulation
        </button>

        {step === 'idle' && (
          <button
            type="button"
            onClick={handleNextStep}
            className="px-4 py-2.5 rounded-xl bg-[#00f0ff] text-black font-bold text-xs hover:bg-[#00f0ff]/90 transition-all cursor-pointer font-mono"
          >
            1. Send ARP Request (Broadcast FF:FF:FF:FF:FF:FF) ➔
          </button>
        )}

        {step === 'broadcast_req' && (
          <button
            type="button"
            onClick={handleNextStep}
            className="px-4 py-2.5 rounded-xl bg-emerald-400 text-black font-bold text-xs hover:bg-emerald-400/90 transition-all cursor-pointer font-mono"
          >
            2. Target Returns Unicast ARP Reply (Opcode 2) ➔
          </button>
        )}

        {step === 'unicast_rep' && (
          <button
            type="button"
            onClick={handleNextStep}
            className="px-4 py-2.5 rounded-xl bg-[#a855f7] text-white font-bold text-xs hover:bg-[#a855f7]/90 transition-all cursor-pointer font-mono"
          >
            3. Store in Local ARP Cache Table ➔
          </button>
        )}

        {step === 'cached' && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
              ✓ Resolution Complete
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg bg-[#272732] text-white text-xs font-mono font-bold hover:bg-[#3f3f50] cursor-pointer"
            >
              Re-run
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

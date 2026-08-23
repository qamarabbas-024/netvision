'use client';

import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Play,
  Activity,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  EbpfEngine,
  EbpfProgram,
  BpfMapEntry,
} from '@/lib/ebpfEngine';
import { SoundFx } from '@/lib/soundFx';

export const EbpfStudio: React.FC = () => {
  const [catalog] = useState<EbpfProgram[]>(() => EbpfEngine.getProgramCatalog());
  const [selectedProgram, setSelectedProgram] = useState<EbpfProgram>(catalog[0]);
  const [isAttached, setIsAttached] = useState<boolean>(false);
  const [bpfMapData, setBpfMapData] = useState<BpfMapEntry[]>([]);
  const [totalDroppedPkt, setTotalDroppedPkt] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAttached) {
      interval = setInterval(() => {
        setTotalDroppedPkt((prev) => prev + Math.floor(Math.random() * 1420 + 310));
        setBpfMapData([
          { key: '0xC0000201 (192.0.2.1)', value: totalDroppedPkt + 1420, updatedAt: new Date().toLocaleTimeString() },
          { key: 'Hook Execution Latency', value: '1.2 ns (Direct Wire)', updatedAt: new Date().toLocaleTimeString() },
          { key: 'Kernel CPU Overhead', value: '0.04% (JIT Native)', updatedAt: new Date().toLocaleTimeString() },
        ]);
        SoundFx.playTerminalKeyPress();
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isAttached, totalDroppedPkt]);

  const handleAttach = () => {
    SoundFx.playPacketDispatch();
    setIsAttached(true);
    SoundFx.playSuccessChime();
  };

  const handleDetach = () => {
    SoundFx.playTerminalKeyPress();
    setIsAttached(false);
    setBpfMapData([]);
    setTotalDroppedPkt(0);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00f0ff]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
                Version 5.6 eBPF & Kernel Ops
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                XDP 14.8M PPS Hook
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Linux Kernel eBPF Bytecode & BPF Map Studio
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isAttached ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleAttach}
              leftIcon={<Play className="w-3.5 h-3.5" />}
            >
              Compile & Attach to NIC Driver (XDP)
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleDetach} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              Detach eBPF Program
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: C Bytecode Editor (Left) & BPF Map Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: C Source Code */}
        <div className="lg:col-span-7 flex flex-col bg-[#0c0e17]">
          {/* Tabs */}
          <div className="px-4 py-2 bg-[#121522] border-b border-[#202538] flex items-center justify-between">
            <div className="flex gap-2">
              {catalog.map((prog) => (
                <button
                  key={prog.id}
                  onClick={() => {
                    SoundFx.playTerminalKeyPress();
                    setSelectedProgram(prog);
                    setIsAttached(false);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                    selectedProgram.id === prog.id
                      ? 'bg-[#00f0ff] text-black shadow-glow-cyan'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {prog.name}
                </button>
              ))}
            </div>

            <span className="text-[10px] font-mono text-zinc-500">Clang/LLVM 17 Target: BPF</span>
          </div>

          <pre className="p-4 text-xs font-mono text-cyan-300 leading-relaxed overflow-x-auto max-h-[420px] bg-[#07080c]">
            <code>{selectedProgram.cCode}</code>
          </pre>
        </div>

        {/* Right 5 Cols: BPF Map & JIT Telemetry */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" /> BPF Map Live Telemetry
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                isAttached
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 animate-pulse'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
              }`}
            >
              {isAttached ? 'JIT BYTECODE ATTACHED' : 'STANDBY'}
            </span>
          </div>

          {/* BPF Map Table */}
          <div className="p-3.5 rounded-2xl bg-[#121522] border border-[#262c42] space-y-2">
            <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">
              Map: {selectedProgram.bpfMapName} (BPF_MAP_TYPE_HASH)
            </span>

            {isAttached ? (
              <div className="space-y-1.5 animate-in fade-in">
                {bpfMapData.map((entry, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-black/50 border border-zinc-800 flex items-center justify-between text-xs font-mono"
                  >
                    <span className="text-zinc-300">{entry.key}</span>
                    <span className="text-emerald-400 font-bold">{entry.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-xs font-mono text-zinc-500">
                Click "Compile & Attach" above to load eBPF bytecode into Linux kernel.
              </div>
            )}
          </div>

          {/* Performance Comparison Box */}
          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Kernel Bypass Benchmark
            </div>
            <div>• iptables/netfilter throughput: ~1.2M PPS</div>
            <div>• eBPF / XDP driver throughput: <span className="text-[#00f0ff] font-bold">14.8M PPS (12.3x speedup)</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

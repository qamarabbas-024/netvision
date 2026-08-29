'use client';

import React, { useState } from 'react';
import { Cpu, Copy, Download, Check, ShieldAlert, Zap, Terminal, Activity } from 'lucide-react';
import { generateEbpfXdpCCode, XdpFilterRule } from '@/lib/ebpfXdpGeneratorEngine';

export const EbpfXdpGeneratorStudio: React.FC = () => {
  const [rules] = useState<XdpFilterRule[]>([
    { id: 'R1', sourceCidr: '198.51.100.0/24', targetPort: 443, protocol: 'TCP', action: 'XDP_DROP' },
    { id: 'R2', sourceCidr: '203.0.113.50/32', targetPort: 53, protocol: 'UDP', action: 'XDP_DROP' },
  ]);
  const [copied, setCopied] = useState<boolean>(false);
  const cCode = generateEbpfXdpCCode(rules);

  const handleCopy = () => {
    navigator.clipboard.writeText(cCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="surface-1 rounded-2xl border border-[#2a2e39] p-6 text-[#f4f5f7] font-sans shadow-instrument flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2e39] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#22c55e]">
              EPOCH XIV // HIGH-SPEED EBPF XDP KERNEL DRIVER
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            eBPF XDP 14.8M PPS Line-Rate Packet Drop Generator
          </h2>
          <p className="text-xs text-[#8e95a5]">
            Synthesize kernel C source code with BPF maps for bare-metal DDoS scrubbing and NIC ring buffer bypass.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-lg bg-[#1a1f2c] border border-[#2a2e39] hover:border-[#22c55e] text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer text-white"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied C Source' : 'Copy xdp_prog.c'}</span>
          </button>
        </div>
      </div>

      {/* Performance Benchmark Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">THROUGHPUT CAPACITY</span>
          <strong className="text-[#22c55e] text-sm">14.8 Million PPS (Line-Rate 100G)</strong>
        </div>
        <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">KERNEL LATENCY COST</span>
          <strong className="text-[#38bdf8] text-sm">&lt; 25 Nanoseconds per Packet</strong>
        </div>
        <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">EXECUTION HOOK</span>
          <strong className="text-purple-400 text-sm">XDP_DRV (NIC Driver Direct DMA)</strong>
        </div>
      </div>

      {/* C Code Preview */}
      <div className="rounded-xl bg-[#090d14] border border-[#1e293b] p-4 font-mono text-xs text-[#38bdf8] overflow-x-auto leading-relaxed max-h-[360px]">
        <pre className="whitespace-pre">{cCode}</pre>
      </div>

      {/* Build & Attach Instructions */}
      <div className="p-4 rounded-xl bg-[#090d14] border border-[#1e293b] font-mono text-xs flex flex-col gap-2">
        <span className="text-white font-bold text-xs pb-1 border-b border-[#1e293b]">
          Compile & Attach Command
        </span>
        <div className="p-2.5 rounded bg-[#020617] border border-[#1e293b] text-[#22c55e]">
          <code>clang -O2 -target bpf -c xdp_prog.c -o xdp_prog.o &amp;&amp; sudo ip link set dev eth0 xdp obj xdp_prog.o sec xdp</code>
        </div>
      </div>
    </div>
  );
};

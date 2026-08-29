'use client';

import React, { useState } from 'react';
import { Zap, Copy, Check, Terminal, ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import { generateEbpfSockOpsCCode, SockOpsMetrics } from '@/lib/ebpfSockOpsEngine';

export const EbpfSockOpsStudio: React.FC = () => {
  const [metrics] = useState<SockOpsMetrics>({
    standardTcpLatencyUs: 18.4,
    sockOpsBypassLatencyUs: 2.1,
    activeSocketBypasses: 1240,
    memoryCopiesSavedPerSec: 850000,
  });

  const [copied, setCopied] = useState<boolean>(false);
  const cCode = generateEbpfSockOpsCCode();

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
              EPOCH XIV // EBPF SOCKOPS ZERO-COPY ACCELERATOR
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            eBPF SockOps & sk_msg Kernel TCP Stack Bypass Studio
          </h2>
          <p className="text-xs text-[#8e95a5]">
            Short-circuit local socket communication on Linux hosts, bypassing the entire TCP/IP kernel stack for 8.7x lower latency.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-lg bg-[#1a1f2c] border border-[#2a2e39] hover:border-[#22c55e] text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer text-white"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied C' : 'Copy sockops.c'}</span>
          </button>
        </div>
      </div>

      {/* Latency Comparison Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">STANDARD TCP STACK</span>
          <strong className="text-rose-400 text-sm">{metrics.standardTcpLatencyUs} µs</strong>
        </div>
        <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">SOCKOPS ZERO-COPY</span>
          <strong className="text-[#22c55e] text-sm">{metrics.sockOpsBypassLatencyUs} µs (8.7x Faster)</strong>
        </div>
        <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">ACTIVE BYPASS SOCKETS</span>
          <strong className="text-[#38bdf8] text-sm">{metrics.activeSocketBypasses} Sockets</strong>
        </div>
        <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">COPIES SAVED / SEC</span>
          <strong className="text-purple-400 text-sm">{(metrics.memoryCopiesSavedPerSec / 1000).toFixed(0)}K Skb Copies</strong>
        </div>
      </div>

      {/* C Code */}
      <div className="rounded-xl bg-[#090d14] border border-[#1e293b] p-4 font-mono text-xs text-[#38bdf8] overflow-x-auto leading-relaxed max-h-[340px]">
        <pre className="whitespace-pre">{cCode}</pre>
      </div>
    </div>
  );
};

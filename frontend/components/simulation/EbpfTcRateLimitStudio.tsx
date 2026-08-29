'use client';

import React, { useState } from 'react';
import { Sliders, Copy, Check, Terminal, Zap, ShieldCheck, Activity } from 'lucide-react';
import { generateEbpfTcCCode, TcRatePolicy } from '@/lib/ebpfTcRateLimitEngine';

export const EbpfTcRateLimitStudio: React.FC = () => {
  const [policy, setPolicy] = useState<TcRatePolicy>({
    rateLimitMbps: 1000,
    burstSizeBytes: 65536,
    targetInterface: 'eth0',
  });
  const [copied, setCopied] = useState<boolean>(false);
  const tcCode = generateEbpfTcCCode(policy);

  const handleCopy = () => {
    navigator.clipboard.writeText(tcCode);
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
              EPOCH XIV // EBPF TRAFFIC CONTROL (TC) RATE LIMITER
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            eBPF TC Token Bucket Filter (TBF) & Bandwidth Policing Studio
          </h2>
          <p className="text-xs text-[#8e95a5]">
            Generate Linux kernel clsact qdisc eBPF classifiers to enforce microsecond-accurate bandwidth shaping.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-lg bg-[#1a1f2c] border border-[#2a2e39] hover:border-[#22c55e] text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer text-white"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied TC Source' : 'Copy tc_prog.c'}</span>
          </button>
        </div>
      </div>

      {/* Bandwidth Shaper Slider */}
      <div className="p-4 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex flex-col gap-1 w-full sm:w-1/2">
          <div className="flex justify-between text-xs">
            <span className="text-[#64748b]">RATE LIMIT CAPACITY:</span>
            <strong className="text-[#22c55e]">{policy.rateLimitMbps} Mbps</strong>
          </div>
          <input
            type="range"
            min="100"
            max="10000"
            step="100"
            value={policy.rateLimitMbps}
            onChange={(e) => setPolicy((prev) => ({ ...prev, rateLimitMbps: Number(e.target.value) }))}
            className="accent-[#22c55e]"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#020617] border border-[#1e293b] text-white text-xs">
            Burst Buffer: <strong className="text-[#38bdf8]">{policy.burstSizeBytes / 1024} KB</strong>
          </div>
        </div>
      </div>

      {/* C Code */}
      <div className="rounded-xl bg-[#090d14] border border-[#1e293b] p-4 font-mono text-xs text-[#38bdf8] overflow-x-auto leading-relaxed max-h-[340px]">
        <pre className="whitespace-pre">{tcCode}</pre>
      </div>

      {/* TC Qdisc Commands */}
      <div className="p-4 rounded-xl bg-[#090d14] border border-[#1e293b] font-mono text-xs flex flex-col gap-2">
        <span className="text-white font-bold text-xs pb-1 border-b border-[#1e293b]">
          TC Attachment Shell Pipeline
        </span>
        <div className="p-2.5 rounded bg-[#020617] border border-[#1e293b] text-[#22c55e]">
          <code>sudo tc qdisc add dev eth0 clsact &amp;&amp; sudo tc filter add dev eth0 egress bpf da obj tc_prog.o sec classifier/egress</code>
        </div>
      </div>
    </div>
  );
};

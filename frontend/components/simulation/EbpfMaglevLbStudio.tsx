'use client';

import React, { useState } from 'react';
import { Network, Server, ArrowRight, Activity, ShieldCheck, Check, Copy } from 'lucide-react';
import { generateMaglevLookupTable, generateEbpfMaglevCCode, RealServerBackend } from '@/lib/ebpfMaglevLbEngine';

export const EbpfMaglevLbStudio: React.FC = () => {
  const [backends, setBackends] = useState<RealServerBackend[]>([
    { id: 'RS-01', ip: '10.0.100.1', weight: 1, activeConnections: 1420, healthy: true },
    { id: 'RS-02', ip: '10.0.100.2', weight: 1, activeConnections: 1390, healthy: true },
    { id: 'RS-03', ip: '10.0.100.3', weight: 1, activeConnections: 1410, healthy: true },
  ]);

  const [copied, setCopied] = useState<boolean>(false);
  const lookupTable = generateMaglevLookupTable(backends, 10);
  const cCode = generateEbpfMaglevCCode();

  const handleToggleHealth = (id: string) => {
    setBackends((prev) =>
      prev.map((b) => (b.id === id ? { ...b, healthy: !b.healthy } : b))
    );
  };

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
              EPOCH XIV // EBPF MAGLEV CONSISTENT HASH LOAD BALANCER
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Katran Maglev Hashing & Direct Server Return (DSR) Studio
          </h2>
          <p className="text-xs text-[#8e95a5]">
            Experience Meta Katran-grade Layer-4 load balancing with consistent hashing lookup tables and zero TCP resets on failover.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-[#1a1f2c] border border-[#2a2e39] hover:border-[#22c55e] text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer text-white"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy C'}</span>
          </button>
        </div>
      </div>

      {/* Backend Pool Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        {backends.map((b) => (
          <div key={b.id} className="p-4 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-[#1e293b] mb-2">
                <strong className="text-white">{b.id}</strong>
                <button
                  type="button"
                  onClick={() => handleToggleHealth(b.id)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all ${
                    b.healthy ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {b.healthy ? 'HEALTHY' : 'OFFLINE'}
                </button>
              </div>
              <span className="text-[11px] text-[#38bdf8] block">{b.ip}</span>
              <span className="text-[10px] text-[#8e95a5]">Active Conns: {b.activeConnections.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Maglev Permutation Table */}
      <div className="p-4 rounded-xl bg-[#090d14] border border-[#1e293b] font-mono text-xs flex flex-col gap-2">
        <span className="text-white font-bold pb-2 border-b border-[#1e293b] flex items-center justify-between">
          <span>Maglev Consistent Hashing Lookup Table (Permutations)</span>
          <span className="text-[10px] text-[#22c55e]">DSR ENABLED</span>
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {lookupTable.map((entry) => (
            <div key={entry.hashBucket} className="p-2 rounded bg-[#020617] border border-[#1e293b] flex flex-col">
              <span className="text-[10px] text-[#64748b]">HASH #{entry.hashBucket}</span>
              <strong className="text-[#22c55e] text-[11px] truncate">{entry.selectedBackendIp}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

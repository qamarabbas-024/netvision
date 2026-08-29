'use client';

import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, Copy, Check, Terminal, Lock, AlertTriangle } from 'lucide-react';
import { generateEbpfLsmCCode, LsmSecurityPolicy } from '@/lib/ebpfLsmSecurityEngine';

export const EbpfLsmSecurityStudio: React.FC = () => {
  const [policy] = useState<LsmSecurityPolicy>({
    blockedPorts: [22, 4444, 1337],
    allowedNamespace: 'production-workloads',
    enforceEgressRestriction: true,
  });

  const [copied, setCopied] = useState<boolean>(false);
  const cCode = generateEbpfLsmCCode(policy);

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
              EPOCH XIV // EBPF LINUX SECURITY MODULE (LSM)
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            eBPF LSM Syscall Network Access Control & Egress Jail Studio
          </h2>
          <p className="text-xs text-[#8e95a5]">
            Enforce zero-trust security at the kernel syscall boundary by intercepting socket_connect, socket_bind, and socket_listen.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-lg bg-[#1a1f2c] border border-[#2a2e39] hover:border-[#22c55e] text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer text-white"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied LSM Source' : 'Copy lsm_sec.c'}</span>
          </button>
        </div>
      </div>

      {/* Security Status Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">SECURITY POLICY STATUS</span>
          <span className="text-[#22c55e] font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>LSM ENFORCING (0 Bypass)</span>
          </span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">BLOCKED EGRESS PORTS</span>
          <strong className="text-rose-400 text-sm">22 (SSH), 4444 (Metasploit C2), 1337</strong>
        </div>
        <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">ENFORCEMENT MECHANISM</span>
          <strong className="text-purple-400 text-sm">Return -EPERM on socket_connect</strong>
        </div>
      </div>

      {/* C Code */}
      <div className="rounded-xl bg-[#090d14] border border-[#1e293b] p-4 font-mono text-xs text-[#38bdf8] overflow-x-auto leading-relaxed max-h-[340px]">
        <pre className="whitespace-pre">{cCode}</pre>
      </div>
    </div>
  );
};

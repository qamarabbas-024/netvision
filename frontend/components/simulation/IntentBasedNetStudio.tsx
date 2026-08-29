'use client';

import React, { useState } from 'react';
import { Bot, Check, ShieldCheck, Terminal, ArrowRight, Zap, Copy, FileCode } from 'lucide-react';
import { compileNaturalLanguageIntent, CompiledNetworkPolicy } from '@/lib/intentBasedNetEngine';

export const IntentBasedNetStudio: React.FC = () => {
  const [intentInput, setIntentInput] = useState<string>(
    'Isolate PCI-DSS payment database host 10.200.5.10 from public traffic and enforce strict 10Gbps dual-homed redundancy.'
  );
  const [compiledPolicy, setCompiledPolicy] = useState<CompiledNetworkPolicy>(
    compileNaturalLanguageIntent(intentInput)
  );
  const [copied, setCopied] = useState<boolean>(false);

  const handleCompile = () => {
    const res = compileNaturalLanguageIntent(intentInput);
    setCompiledPolicy(res);
  };

  const handleCopy = () => {
    const fullConfig = [
      '# Generated Access Control Lists (ACLs)',
      ...compiledPolicy.generatedAcls,
      '',
      '# Generated BGP Community Policy',
      ...compiledPolicy.generatedBgpPolicy,
    ].join('\n');
    navigator.clipboard.writeText(fullConfig);
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
              EPOCH XII // INTENT-BASED NETWORKING (IBN)
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Intent-to-Fabric Compiler & Policy Validator
          </h2>
          <p className="text-xs text-[#8e95a5]">
            Translate plain human language business intent into formal, cryptographically validated router ACLs and BGP routing policies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-[#1a1f2c] border border-[#2a2e39] hover:border-[#22c55e] text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer text-white"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Config'}</span>
          </button>
        </div>
      </div>

      {/* Intent Input Form */}
      <div className="p-4 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-3 font-mono text-xs">
        <span className="text-white font-bold text-xs flex items-center gap-2">
          <Bot className="w-4 h-4 text-[#22c55e]" />
          <span>Natural Language Business Intent:</span>
        </span>
        <textarea
          rows={2}
          value={intentInput}
          onChange={(e) => setIntentInput(e.target.value)}
          className="w-full p-3 rounded-lg bg-[#020617] border border-[#1e293b] text-white text-xs outline-none focus:border-[#22c55e] resize-none"
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleCompile}
            className="px-4 py-2 rounded-lg bg-[#22c55e] text-[#062817] hover:bg-[#16a34a] font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Compile Intent to Fabric</span>
          </button>
        </div>
      </div>

      {/* Compiled Policy Verification Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">SECURITY ZONE</span>
          <strong className="text-[#38bdf8] text-sm">{compiledPolicy.securityZone}</strong>
        </div>
        <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">BANDWIDTH SLA</span>
          <strong className="text-[#22c55e] text-sm">{compiledPolicy.bandwidthGuaranteeGbps} Gbps Lossless</strong>
        </div>
        <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">POLICY VALIDATION</span>
          <span className="text-[#22c55e] font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{compiledPolicy.status} (0 Conflicts)</span>
          </span>
        </div>
      </div>

      {/* Output Concrete Configurations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 font-mono text-xs">
        <div className="p-4 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-2">
          <span className="text-white font-bold pb-2 border-b border-[#1e293b]">Generated Switch ACLs</span>
          <pre className="text-[#22c55e] text-[11px] leading-relaxed whitespace-pre">
            {compiledPolicy.generatedAcls.join('\n')}
          </pre>
        </div>

        <div className="p-4 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-2">
          <span className="text-white font-bold pb-2 border-b border-[#1e293b]">Generated BGP Policy</span>
          <pre className="text-[#38bdf8] text-[11px] leading-relaxed whitespace-pre">
            {compiledPolicy.generatedBgpPolicy.join('\n')}
          </pre>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { Cpu, Copy, Check, Play, ShieldCheck, Box, Activity } from 'lucide-react';
import { generateRustWasmTemplate, WasmPluginSpec } from '@/lib/wasmProtocolSdkEngine';

export const WasmProtocolSdkStudio: React.FC = () => {
  const [rustCode] = useState<string>(generateRustWasmTemplate());
  const [copied, setCopied] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(rustCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunWasm = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 1200);
  };

  return (
    <div className="surface-1 rounded-2xl border border-[#2a2e39] p-6 text-[#f4f5f7] font-sans shadow-instrument flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2e39] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#22c55e]">
              EPOCH XV // UNIVERSAL WASM PROTOCOL RUNTIME SDK
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            WebAssembly Sandboxed Protocol Runtime Studio
          </h2>
          <p className="text-xs text-[#8e95a5]">
            Author memory-isolated custom protocol dissectors and packet engines in Rust compiled directly to wasm32-wasi.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-lg bg-[#1a1f2c] border border-[#2a2e39] hover:border-[#22c55e] text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer text-white"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Rust Code'}</span>
          </button>
        </div>
      </div>

      {/* WASM Sandbox Isolation Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">TARGET ARCHITECTURE</span>
          <strong className="text-white text-sm">wasm32-wasi</strong>
        </div>
        <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">LINEAR MEMORY LIMIT</span>
          <strong className="text-[#38bdf8] text-sm">16 MB (Hard Cap)</strong>
        </div>
        <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">GAS EXECUTION LIMIT</span>
          <strong className="text-[#22c55e] text-sm">1,000,000 Cycles</strong>
        </div>
        <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">ISOLATION TIER</span>
          <span className="text-purple-400 font-bold">Hardware Fault-Isolated</span>
        </div>
      </div>

      {/* Rust Source */}
      <div className="rounded-xl bg-[#090d14] border border-[#1e293b] p-4 font-mono text-xs text-[#38bdf8] overflow-x-auto leading-relaxed max-h-[340px]">
        <pre className="whitespace-pre">{rustCode}</pre>
      </div>

      {/* Test Execution Bar */}
      <div className="p-4 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-2 text-white">
          <Activity className="w-4 h-4 text-[#22c55e]" />
          <span>WASM Sandbox Ready for Instant Invocation</span>
        </div>

        <button
          type="button"
          onClick={handleRunWasm}
          disabled={isRunning}
          className="px-4 py-2 rounded-lg bg-[#22c55e] text-[#062817] hover:bg-[#16a34a] font-bold flex items-center gap-2 cursor-pointer transition-all shadow-sm"
        >
          <Play className="w-3.5 h-3.5" />
          <span>{isRunning ? 'Executing in WASM VM...' : 'Execute WASM Sandbox Test'}</span>
        </button>
      </div>
    </div>
  );
};

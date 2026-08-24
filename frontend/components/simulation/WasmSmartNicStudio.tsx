'use client';

import React, { useState } from 'react';
import {
  Cpu,
  Activity,
  Layers,
  CheckCircle2,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  WasmSmartNicEngine,
  SmartNicState,
} from '@/lib/wasmSmartNicEngine';
import { SoundFx } from '@/lib/soundFx';

export const WasmSmartNicStudio: React.FC = () => {
  const [state, setState] = useState<SmartNicState>(() =>
    WasmSmartNicEngine.getInitialState()
  );
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deployLog, setDeployLog] = useState<string | null>(null);

  const handleDeployWasm = () => {
    setIsDeploying(true);
    SoundFx.playPacketDispatch();

    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        hostCpuOffloadedPct: 94.2,
        modules: [
          ...prev.modules,
          {
            moduleId: `wasm-mod-${Date.now()}`,
            name: 'grpc_telemetry_coprocessor.wasm',
            bytecodeSizeBytes: 31200,
            instantiationTimeUs: 14.1,
            memoryIsolatedBytes: 65536,
            status: 'ACTIVE_LINE_RATE',
          },
        ],
      }));
      setDeployLog(
        '⚡ WebAssembly Bytecode instantiated in 14.1 µs on SmartNIC DPU silicon. Line-rate L7 packet processing active; Host x86 CPU 94.2% offloaded.'
      );
      setIsDeploying(false);
      SoundFx.playSuccessChime();
    }, 500);
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setState(WasmSmartNicEngine.getInitialState());
    setDeployLog(null);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">
                Version 8.4 WASM SmartNIC DPU
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono font-bold">
                WASI-Sockets • 14.8M PPS
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Edge WebAssembly Sandbox & Hardware DPU Coprocessor
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isDeploying ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleDeployWasm}
              leftIcon={<Zap className="w-3.5 h-3.5" />}
            >
              Hot-Deploy WASM Bytecode Module
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Compiling WASM on DPU...
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset
          </Button>
        </div>
      </div>

      {/* Main Grid: WASM Modules (Left) & DPU Hardware Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: WASM Modules */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-400" /> Active WASM Sandboxed Micro-Runtimes
            </span>
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-500/30">
              {state.dpuModel}
            </span>
          </div>

          <div className="space-y-3">
            {state.modules.map((m) => (
              <div
                key={m.moduleId}
                className="p-3.5 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono">{m.name}</span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-bold">
                    {m.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-zinc-400">
                  <div>Size: <span className="text-white">{(m.bytecodeSizeBytes / 1024).toFixed(1)} KB</span></div>
                  <div>Cold Start: <span className="text-cyan-300 font-bold">{m.instantiationTimeUs} µs</span></div>
                  <div>Memory: <span className="text-emerald-400">{(m.memoryIsolatedBytes / 1024).toFixed(0)} KB isolated</span></div>
                </div>
              </div>
            ))}
          </div>

          {deployLog && (
            <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-xs font-mono text-indigo-200 leading-relaxed animate-in fade-in">
              {deployLog}
            </div>
          )}
        </div>

        {/* Right 5 Cols: Host CPU Offload & DPU Silicon */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-indigo-400" /> DPU Offload Telemetry
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Host CPU Offload</span>
              <span className="text-lg font-bold text-emerald-400 font-mono mt-1">{state.hostCpuOffloadedPct}%</span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Direct wire execution</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Throughput Rate</span>
              <span className="text-lg font-bold text-cyan-400 font-mono mt-1">14.8M PPS</span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Zero kernel context switches</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> WASM SmartNIC Advantages
            </div>
            <div>• Sub-microsecond instantiation compared to seconds for Docker containers</div>
            <div>• Memory sandbox prevents rogue micro-filters from crashing NIC firmware</div>
            <div>• Native WASI-Sockets specification allows direct Layer 7 protocol proxying</div>
          </div>
        </div>
      </div>
    </div>
  );
};

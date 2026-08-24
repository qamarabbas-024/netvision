'use client';

import React, { useState } from 'react';
import {
  Code2,
  Activity,
  CheckCircle2,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  P4Engine,
  P4TableEntry,
} from '@/lib/p4Engine';
import { SoundFx } from '@/lib/soundFx';

export const P4DataPlaneStudio: React.FC = () => {
  const [p4Code] = useState<string>(() => P4Engine.getP4SampleCode());
  const [tables] = useState<P4TableEntry[]>(() => P4Engine.getInitialTableEntries());
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [injectedPacket, setInjectedPacket] = useState<string | null>(null);

  const handleCompileAndInject = () => {
    setIsCompiling(true);
    SoundFx.playPacketDispatch();

    setTimeout(() => {
      setInjectedPacket(
        `[Ethernet: dst=00:1A:2B:3C:4D:5E src=00:11:22:33:44:55 type=0x0800]\n[IPv4: src=10.0.1.50 dst=10.0.2.100 proto=0xFD (INT Telemetry)]\n[INT Header: switch_id=0x01 queue_depth=4 hop_latency=240ns]\n[Payload: 64 bytes application data]`
      );
      setIsCompiling(false);
      SoundFx.playSuccessChime();
    }, 500);
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setInjectedPacket(null);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">
                Version 7.5 P4 Programmable Data Planes
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono font-bold">
                P4-16 • BMv2 • In-band Telemetry
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              P4-16 Custom Match-Action Pipelines & Wire Transformations
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isCompiling ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleCompileAndInject}
              leftIcon={<Zap className="w-3.5 h-3.5" />}
            >
              Compile P4 & Inject INT Packet
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Compiling P4 Parser...
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset
          </Button>
        </div>
      </div>

      {/* Main Grid: P4 Code & Tables (Left) & Wire Packet Output (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 6 Cols: P4-16 Source */}
        <div className="lg:col-span-6 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-indigo-400" /> P4-16 Ingress Pipeline Specification
            </span>
          </div>

          <pre className="p-3.5 rounded-2xl bg-black/60 border border-zinc-800 text-[11px] font-mono text-cyan-300 overflow-x-auto leading-relaxed max-h-60">
            <code>{p4Code}</code>
          </pre>

          <div className="space-y-2">
            <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">
              Silicon Match-Action Table:
            </span>
            {tables.map((t, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-[#121522] border border-[#262c42] flex justify-between text-xs font-mono">
                <span className="text-white">{t.matchKey}</span>
                <span className="text-emerald-400 font-bold">{t.actionName}()</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right 6 Cols: Injected Wire Frame */}
        <div className="lg:col-span-6 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" /> In-band Network Telemetry (INT) Dissection
            </span>
          </div>

          {injectedPacket ? (
            <pre className="p-4 rounded-2xl bg-black/60 border border-zinc-800 text-xs font-mono text-emerald-300 leading-relaxed overflow-x-auto animate-in fade-in">
              <code>{injectedPacket}</code>
            </pre>
          ) : (
            <div className="p-8 text-center text-xs font-mono text-zinc-500">
              Click "Compile P4 & Inject INT Packet" to execute user-defined match-action logic.
            </div>
          )}

          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> P4-16 Language Paradigms
            </div>
            <div>• Replaces hardcoded ASIC pipelines with dynamic programmable parsers</div>
            <div>• Allows insertion of custom protocol headers (e.g. INT, VXLAN-GPE, SRv6)</div>
            <div>• Line-rate packet processing on programmable silicon (Intel Tofino, AMD Pensando)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

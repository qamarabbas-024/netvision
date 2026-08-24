'use client';

import React, { useState } from 'react';
import {
  Server,
  Cpu,
  Activity,
  CheckCircle2,
  Database,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  SonicNosEngine,
  SonicContainer,
  SonicDbTransaction,
} from '@/lib/sonicNosEngine';
import { SoundFx } from '@/lib/soundFx';

export const SonicNosStudio: React.FC = () => {
  const [containers] = useState<SonicContainer[]>(() => SonicNosEngine.getContainers());
  const [dbState, setDbState] = useState<SonicDbTransaction[]>(() =>
    SonicNosEngine.getInitialDbState()
  );
  const [isProgramming, setIsProgramming] = useState<boolean>(false);
  const [pipelineStep, setPipelineStep] = useState<number>(0);

  const handleInjectRoute = () => {
    setIsProgramming(true);
    setPipelineStep(1);
    SoundFx.playPacketDispatch();

    setTimeout(() => {
      setPipelineStep(2);
      SoundFx.playTerminalKeyPress();
    }, 400);

    setTimeout(() => {
      setPipelineStep(3);
      setDbState((prev) => [
        {
          dbName: 'APPL_DB',
          key: 'ROUTE_TABLE:172.16.50.0/24',
          value: 'nexthop:192.168.1.5,if:Ethernet8',
          saiObject: 'SAI_OBJECT_TYPE_ROUTE_ENTRY',
        },
        ...prev,
      ]);
      SoundFx.playSuccessChime();
      setIsProgramming(false);
    }, 800);
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setDbState(SonicNosEngine.getInitialDbState());
    setPipelineStep(0);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00f0ff]">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
                Version 6.8 SONiC & SAI Architecture
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                Redis DB • Orchagent • Broadcom SAI
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Open Networking Linux Operating System & Silicon ASIC Pipeline
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isProgramming ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleInjectRoute}
              leftIcon={<Zap className="w-3.5 h-3.5" />}
            >
              Inject BGP EVPN Route into SONiC
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Programming ASIC via SAI...
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset State
          </Button>
        </div>
      </div>

      {/* Main Grid: Microservices (Left) & Redis DB Pipeline (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 6 Cols: Microservice Containers */}
        <div className="lg:col-span-6 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-[#00f0ff]" /> SONiC Docker Microservices
            </span>
            <span className="text-[10px] font-mono text-emerald-400">System Uptime: 99.999%</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {containers.map((c) => (
              <div
                key={c.name}
                className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col gap-1"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-white">{c.name}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                    {c.status}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">{c.role}</span>
                <span className="text-[9px] font-mono text-zinc-500">CPU: {c.cpuUsage}</span>
              </div>
            ))}
          </div>

          {/* Pipeline Flow Steps */}
          <div className="p-3.5 rounded-2xl bg-[#10131d] border border-[#202538] space-y-2 text-[11px] font-mono text-zinc-400">
            <span className="text-white font-bold block">ASIC Programming Pipeline (0.8 ms):</span>
            <div className={pipelineStep >= 1 ? 'text-cyan-300 font-bold' : ''}>1. BGP CLI writes route to APPL_DB</div>
            <div className={pipelineStep >= 2 ? 'text-indigo-300 font-bold' : ''}>2. Orchagent translates route & writes ASIC_DB</div>
            <div className={pipelineStep >= 3 ? 'text-emerald-400 font-bold' : ''}>3. Syncd invokes SAI C API to program Hardware Silicon</div>
          </div>
        </div>

        {/* Right 6 Cols: Redis State DB */}
        <div className="lg:col-span-6 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-4 h-4 text-cyan-400" /> Redis State Infrastructure Inspector
            </span>
          </div>

          <div className="space-y-2">
            {dbState.map((entry, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col gap-1 text-xs font-mono"
              >
                <div className="flex items-center justify-between">
                  <span className="text-cyan-400 font-bold">[{entry.dbName}]</span>
                  <span className="text-[10px] text-zinc-500">{entry.saiObject}</span>
                </div>
                <span className="text-white truncate">{entry.key}</span>
                <span className="text-[10px] text-zinc-400">{entry.value}</span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Switch Abstraction Interface (SAI)
            </div>
            <div>• Hardware-agnostic C API created by Open Compute Project (OCP)</div>
            <div>• Eliminates proprietary ASIC vendor lock-in for hyperscale clouds</div>
          </div>
        </div>
      </div>
    </div>
  );
};

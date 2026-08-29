'use client';

import React, { useState, useEffect } from 'react';
import { Flame, ShieldAlert, AlertTriangle, Play, RotateCcw, Activity, ShieldCheck, Zap } from 'lucide-react';
import { CHAOS_VECTORS, ChaosFaultVector } from '@/lib/chaosSreEngine';

export const ChaosSreStudio: React.FC = () => {
  const [vectors, setVectors] = useState<ChaosFaultVector[]>(CHAOS_VECTORS);
  const [activeVectorId, setActiveVectorId] = useState<string>('CHAOS-01');
  const [mttrSeconds, setMttrSeconds] = useState<number>(0);
  const [isInjecting, setIsInjecting] = useState<boolean>(false);

  const activeVector = vectors.find((v) => v.id === activeVectorId) || vectors[0];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isInjecting) {
      timer = setInterval(() => {
        setMttrSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isInjecting]);

  const handleInjectFault = () => {
    setIsInjecting(true);
    setVectors((prev) =>
      prev.map((v) => (v.id === activeVectorId ? { ...v, status: 'FIRING' } : v))
    );
  };

  const handleRemediate = () => {
    setIsInjecting(false);
    setVectors((prev) =>
      prev.map((v) => (v.id === activeVectorId ? { ...v, status: 'REMEDIATED' } : v))
    );
  };

  return (
    <div className="surface-1 rounded-2xl border border-[#2a2e39] p-6 text-[#f4f5f7] font-sans shadow-instrument flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2e39] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-400">
              EPOCH XII // CHAOS SRE FAULT INJECTION
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Autonomous Chaos Engineering & MTTR Arena
          </h2>
          <p className="text-xs text-[#8e95a5]">
            Inject realistic link flaps, BGP route poisoning, and bufferbloat to test self-healing mesh resilience.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-[#090d14] border border-[#1e293b] text-white flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-[#22c55e]" />
            <span>MTTR Stopwatch: <strong className="text-[#38bdf8]">{mttrSeconds}s</strong></span>
          </div>
        </div>
      </div>

      {/* Fault Vector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        {vectors.map((vec) => {
          const isSelected = vec.id === activeVectorId;
          return (
            <div
              key={vec.id}
              onClick={() => setActiveVectorId(vec.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                isSelected ? 'bg-[#090d14] border-rose-500/60 shadow-md shadow-rose-950/20' : 'bg-[#0f172a] border-[#1e293b] hover:border-[#334155]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#1e293b] mb-2">
                  <span className="font-bold text-white">{vec.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      vec.status === 'FIRING'
                        ? 'bg-rose-500 text-white animate-pulse'
                        : vec.status === 'REMEDIATED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-[#1e293b] text-[#8e95a5]'
                    }`}
                  >
                    {vec.status}
                  </span>
                </div>
                <h3 className="text-white font-bold text-xs mb-1">{vec.name}</h3>
                <span className="text-[10px] text-[#64748b] block">Target: {vec.targetInterface}</span>
              </div>

              <div className="text-[11px] text-[#8e95a5] flex justify-between border-t border-[#1e293b] pt-2">
                <span>Loss: <strong className="text-rose-400">{vec.lossRatePercent}%</strong></span>
                <span>Latency: <strong className="text-amber-400">+{vec.addedLatencyMs}ms</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Active Vector Control Strip */}
      <div className="p-4 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
        <div>
          <span className="text-[10px] text-[#64748b] block">ACTIVE VECTOR BLAST RADIUS</span>
          <span className="text-white font-bold text-sm">{activeVector.blastRadius}</span>
        </div>

        <div className="flex items-center gap-3">
          {isInjecting ? (
            <button
              type="button"
              onClick={handleRemediate}
              className="px-4 py-2 rounded-lg bg-[#22c55e] text-[#062817] hover:bg-[#16a34a] font-bold flex items-center gap-2 cursor-pointer transition-all shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Trigger Autonomous Self-Heal</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleInjectFault}
              className="px-4 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-500 font-bold flex items-center gap-2 cursor-pointer transition-all shadow-md shadow-rose-900/30"
            >
              <Flame className="w-4 h-4" />
              <span>Inject Chaos Attack</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

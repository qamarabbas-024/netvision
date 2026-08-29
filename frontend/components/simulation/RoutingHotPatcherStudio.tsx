'use client';

import React, { useState } from 'react';
import { ShieldCheck, GitCommit, Play, RotateCcw, Activity, ArrowRight, Zap, Check } from 'lucide-react';
import { generateHotPatchPlan, RoutingHotPatch } from '@/lib/routingHotPatcherEngine';

export const RoutingHotPatcherStudio: React.FC = () => {
  const [patchType, setPatchType] = useState<RoutingHotPatch['patchType']>('PREFIX_FILTER');
  const [patch, setPatch] = useState<RoutingHotPatch>(generateHotPatchPlan('PREFIX_FILTER'));
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [applied, setApplied] = useState<boolean>(false);

  const handleSwitchType = (type: RoutingHotPatch['patchType']) => {
    setPatchType(type);
    setPatch(generateHotPatchPlan(type));
    setApplied(false);
  };

  const handleApplyPatch = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setApplied(true);
    }, 1200);
  };

  return (
    <div className="surface-1 rounded-2xl border border-[#2a2e39] p-6 text-[#f4f5f7] font-sans shadow-instrument flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2e39] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#22c55e]">
              EPOCH XII // ZERO-DOWNTIME ROUTING HOT-PATCHER
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Routing Policy Hot-Patcher & Graceful Convergence Studio
          </h2>
          <p className="text-xs text-[#8e95a5]">
            Deploy live atomic BGP/OSPF policy mutations with graceful restart and automated telemetry rollback thresholds.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => handleSwitchType('PREFIX_FILTER')}
            className={`px-3 py-1.5 rounded-lg border font-bold cursor-pointer transition-all ${
              patchType === 'PREFIX_FILTER'
                ? 'bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e]/30'
                : 'bg-[#1a1f2c] text-[#8e95a5] border-[#2a2e39]'
            }`}
          >
            BGP Prefix Filter
          </button>
          <button
            type="button"
            onClick={() => handleSwitchType('COST_REWEIGHT')}
            className={`px-3 py-1.5 rounded-lg border font-bold cursor-pointer transition-all ${
              patchType === 'COST_REWEIGHT'
                ? 'bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e]/30'
                : 'bg-[#1a1f2c] text-[#8e95a5] border-[#2a2e39]'
            }`}
          >
            OSPF Cost Reweight
          </button>
        </div>
      </div>

      {/* Patch Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">PATCH ID</span>
          <strong className="text-white text-sm">{patch.patchId}</strong>
        </div>
        <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">TARGET NODE</span>
          <strong className="text-[#38bdf8] text-sm">{patch.targetDevice}</strong>
        </div>
        <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">GRACEFUL RESTART</span>
          <span className="text-[#22c55e] font-bold">ENABLED (0 Packet Loss)</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">ROLLBACK THRESHOLD</span>
          <span className="text-amber-400 font-bold">&gt; {patch.rollbackTriggerLatencyMs} ms Latency Spike</span>
        </div>
      </div>

      {/* Unified Diff View */}
      <div className="p-4 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-2 font-mono text-xs">
        <span className="text-white font-bold pb-2 border-b border-[#1e293b] flex items-center justify-between">
          <span>Routing Policy Atomic Unified Diff</span>
          <span className="text-[10px] text-[#64748b]">SYNTAX: CISCO / JUNOS HIERARCHICAL</span>
        </span>

        <div className="flex flex-col gap-1 text-[11px] leading-relaxed pt-1">
          {patch.beforeDiff.map((line, idx) => (
            <div key={`b-${idx}`} className="text-rose-400 bg-rose-950/20 px-2 py-0.5 rounded">
              {line}
            </div>
          ))}
          {patch.afterDiff.map((line, idx) => (
            <div key={`a-${idx}`} className="text-[#22c55e] bg-emerald-950/20 px-2 py-0.5 rounded font-bold">
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* Action Execution Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#090d14] border border-[#1e293b] font-mono text-xs">
        <div className="flex items-center gap-2 text-white">
          <Activity className="w-4 h-4 text-[#22c55e]" />
          <span>Status: {applied ? 'Hot-Patch Active in FIB & RIB' : 'Candidate Staged'}</span>
        </div>

        <div className="flex items-center gap-2">
          {applied && (
            <button
              type="button"
              onClick={() => setApplied(false)}
              className="px-3 py-1.5 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-white flex items-center gap-1.5 cursor-pointer font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Instant Rollback</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleApplyPatch}
            disabled={isApplying || applied}
            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 cursor-pointer transition-all ${
              applied
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-[#22c55e] text-[#062817] hover:bg-[#16a34a]'
            }`}
          >
            {isApplying ? <Zap className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isApplying ? 'Applying in Kernel...' : applied ? '✓ Deployed Live' : 'Deploy Hot-Patch'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

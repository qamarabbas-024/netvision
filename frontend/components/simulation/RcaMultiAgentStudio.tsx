'use client';

import React, { useState } from 'react';
import { Users, Bot, ShieldAlert, CheckCircle2, ArrowRight, Play, RefreshCw, Cpu, Activity } from 'lucide-react';
import { runMultiAgentRca, RcaConsensusResult } from '@/lib/rcaMultiAgentEngine';

export const RcaMultiAgentStudio: React.FC = () => {
  const [incidentType, setIncidentType] = useState<'FIBER_DEGRADE' | 'MTU_BLACKHOLE'>('FIBER_DEGRADE');
  const [rcaResult, setRcaResult] = useState<RcaConsensusResult>(runMultiAgentRca('FIBER_DEGRADE'));
  const [remediated, setRemediated] = useState<boolean>(false);

  const handleSwitchIncident = (type: 'FIBER_DEGRADE' | 'MTU_BLACKHOLE') => {
    setIncidentType(type);
    setRcaResult(runMultiAgentRca(type));
    setRemediated(false);
  };

  return (
    <div className="surface-1 rounded-2xl border border-[#2a2e39] p-6 text-[#f4f5f7] font-sans shadow-instrument flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2e39] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#22c55e]">
              EPOCH XII // MULTI-AGENT RCA CONSENSUS
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Autonomous Root Cause Analysis (RCA) Multi-Agent Studio
          </h2>
          <p className="text-xs text-[#8e95a5]">
            Coordinate specialized AI agents (Optics, eBPF Kernel, BGP Routing) to achieve Byzantine-fault-tolerant outage diagnosis.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => handleSwitchIncident('FIBER_DEGRADE')}
            className={`px-3 py-1.5 rounded-lg border font-bold cursor-pointer transition-all ${
              incidentType === 'FIBER_DEGRADE'
                ? 'bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e]/30'
                : 'bg-[#1a1f2c] text-[#8e95a5] border-[#2a2e39]'
            }`}
          >
            Incident #1: Optical Degradation
          </button>
          <button
            type="button"
            onClick={() => handleSwitchIncident('MTU_BLACKHOLE')}
            className={`px-3 py-1.5 rounded-lg border font-bold cursor-pointer transition-all ${
              incidentType === 'MTU_BLACKHOLE'
                ? 'bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e]/30'
                : 'bg-[#1a1f2c] text-[#8e95a5] border-[#2a2e39]'
            }`}
          >
            Incident #2: MTU Blackhole
          </button>
        </div>
      </div>

      {/* Consensus Result Banner */}
      <div className="p-4 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[#64748b] font-bold">INCIDENT ID: {rcaResult.incidentId}</span>
          <span className="px-2.5 py-0.5 rounded bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30 font-bold">
            CONSENSUS CONFIDENCE: {rcaResult.consensusConfidence}%
          </span>
        </div>

        <div>
          <span className="text-[10px] text-[#64748b] block mb-1">DIAGNOSED ROOT CAUSE:</span>
          <p className="text-white text-sm font-bold leading-snug">{rcaResult.consensusRootCause}</p>
        </div>

        <div className="p-3 rounded-lg bg-[#020617] border border-[#1e293b] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-[#64748b] block">RECOMMENDED REMEDIATION:</span>
            <span className="text-[#38bdf8] font-bold text-xs">{rcaResult.recommendedAction}</span>
          </div>

          <button
            type="button"
            onClick={() => setRemediated(true)}
            className={`px-4 py-2 rounded-lg font-bold text-xs shrink-0 cursor-pointer transition-all ${
              remediated
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-[#22c55e] text-[#062817] hover:bg-[#16a34a]'
            }`}
          >
            {remediated ? '✓ Remediated (Healthy)' : 'Execute Joint Remediation'}
          </button>
        </div>
      </div>

      {/* 3 Specialized Agent Deliberation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        {rcaResult.agentOpinions.map((agent) => (
          <div key={agent.agentName} className="p-4 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-[#1e293b] mb-2">
                <div className="flex items-center gap-1.5 text-white font-bold">
                  <Bot className="w-3.5 h-3.5 text-[#22c55e]" />
                  <span>{agent.agentName}</span>
                </div>
                <span className="text-[10px] text-[#38bdf8] font-bold">{agent.confidenceScore}%</span>
              </div>
              <span className="text-[10px] text-[#64748b] uppercase block mb-1">{agent.agentRole}</span>
              <p className="text-white text-xs leading-relaxed font-bold mb-3">{agent.voteRootCause}</p>

              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-[#64748b] uppercase">Submitted Evidence:</span>
                {agent.evidence.map((ev, idx) => (
                  <div key={idx} className="text-[10px] text-[#8e95a5] flex items-center gap-1">
                    <span className="text-[#22c55e]">•</span>
                    <span>{ev}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

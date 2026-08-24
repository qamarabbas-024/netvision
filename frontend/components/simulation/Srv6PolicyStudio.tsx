'use client';

import React, { useState } from 'react';
import {
  GitBranch,
  Play,
  Activity,
  Layers,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  Srv6Engine,
  Srv6Policy,
} from '@/lib/srv6Engine';
import { SoundFx } from '@/lib/soundFx';

export const Srv6PolicyStudio: React.FC = () => {
  const [policies] = useState<Srv6Policy[]>(() => Srv6Engine.getPolicies());
  const [selectedPolicy, setSelectedPolicy] = useState<Srv6Policy>(policies[0]);
  const [activeHopIndex, setActiveHopIndex] = useState<number>(0);
  const [isTracing, setIsTracing] = useState<boolean>(false);
  const [traceComplete, setTraceComplete] = useState<boolean>(false);

  const handleDispatchSrv6 = () => {
    setIsTracing(true);
    setTraceComplete(false);
    setActiveHopIndex(0);
    SoundFx.playPacketDispatch();

    const hops = selectedPolicy.segmentList;
    hops.forEach((_, idx) => {
      setTimeout(() => {
        setActiveHopIndex(idx);
        SoundFx.playHopForward();

        if (idx === hops.length - 1) {
          setIsTracing(false);
          setTraceComplete(true);
          SoundFx.playSuccessChime();
        }
      }, (idx + 1) * 700);
    });
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setActiveHopIndex(0);
    setIsTracing(false);
    setTraceComplete(false);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">
                Version 6.2 SRv6 Segment Routing
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono font-bold">
                RFC 8754 SRH Extension
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Segment Routing over IPv6 & Traffic Engineering SLA Studio
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isTracing ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleDispatchSrv6}
              leftIcon={<Play className="w-3.5 h-3.5" />}
            >
              Dispatch SRv6 Packet Trace
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Executing SID Behaviors...
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset
          </Button>
        </div>
      </div>

      {/* Main Grid: SRv6 Policy Selector (Left) & SRH Header Dissector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 6 Cols: Policy Selection */}
        <div className="lg:col-span-6 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-400" /> Select Traffic Engineering SLA Policy
          </span>

          <div className="space-y-2.5">
            {policies.map((p) => {
              const isSelected = selectedPolicy.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    SoundFx.playTerminalKeyPress();
                    setSelectedPolicy(p);
                    handleReset();
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col gap-1.5 ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-950/20 shadow-glow-cyan'
                      : 'border-[#262c42] bg-[#121522] hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-mono">{p.name}</span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
                      {p.expectedLatencyMs} ms RTT
                    </span>
                  </div>

                  {/* SIDs list preview */}
                  <div className="flex items-center gap-1.5 mt-1 overflow-x-auto">
                    {p.segmentList.map((seg, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-cyan-300 border border-zinc-800 shrink-0"
                      >
                        {seg.nodeName} ({seg.behavior})
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Segment Execution Pipeline */}
          <div className="space-y-2 pt-2 border-t border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
              Active SID Execution Sequence
            </span>

            <div className="space-y-2">
              {selectedPolicy.segmentList.map((seg, idx) => {
                const isCurrent = activeHopIndex === idx && (isTracing || traceComplete);
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs font-mono transition-all flex items-start gap-2.5 ${
                      isCurrent
                        ? 'border-indigo-400 bg-indigo-950/40 text-white shadow-md'
                        : 'border-[#262c42] bg-[#121522] text-zinc-400'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isCurrent ? 'bg-indigo-500 text-white animate-pulse' : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {idx + 1}
                      </div>
                    </div>

                    <div className="flex flex-col gap-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{seg.nodeName} — {seg.behavior}</span>
                        <span className="text-[10px] text-cyan-300 font-bold">{seg.sid}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400">{seg.description}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 6 Cols: SRH Dissection Header */}
        <div className="lg:col-span-6 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-indigo-400" /> IPv6 SRH Header Dissector (RFC 8754)
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                traceComplete
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                  : isTracing
                  ? 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40 animate-pulse'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
              }`}
            >
              {traceComplete ? 'EGRESS DECAP SUCCESS' : isTracing ? 'TRANSIT FORWARDING' : 'READY'}
            </span>
          </div>

          {/* Header Breakdown */}
          <div className="p-4 rounded-2xl bg-[#121522] border border-[#262c42] space-y-2 text-xs font-mono">
            <div className="flex justify-between border-b border-zinc-800 pb-1.5">
              <span className="text-zinc-400">Next Header:</span>
              <span className="text-indigo-400 font-bold">43 (Routing Extension Header)</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-1.5">
              <span className="text-zinc-400">Routing Type:</span>
              <span className="text-white font-bold">4 (Segment Routing Header - SRH)</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-1.5">
              <span className="text-zinc-400">Segments Left:</span>
              <span className="text-cyan-300 font-bold">{selectedPolicy.segmentList.length - 1 - activeHopIndex}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Active IPv6 DA:</span>
              <span className="text-emerald-400 font-bold">{selectedPolicy.segmentList[activeHopIndex].sid}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> SRv6 vs MPLS Advantages
            </div>
            <div>• Eliminates LDP and RSVP-TE signaling state in core nodes</div>
            <div>• Native IPv6 reachability across internet boundaries</div>
            <div>• Micro-SID (uSID) achieves 80% packet header compression</div>
          </div>
        </div>
      </div>
    </div>
  );
};

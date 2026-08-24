'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Radio,
  Activity,
  CheckCircle2,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  ThreatIntelEngine,
  ThreatIoc,
  MitreTacticCard,
} from '@/lib/threatIntelEngine';
import { SoundFx } from '@/lib/soundFx';

export const ThreatIntelligenceStudio: React.FC = () => {
  const [iocs, setIocs] = useState<ThreatIoc[]>(() => ThreatIntelEngine.getInitialIocs());
  const [mitreCards] = useState<MitreTacticCard[]>(() => ThreatIntelEngine.getMitreMatrix());
  const [mitigatedIocs, setMitigatedIocs] = useState<string[]>([]);
  const [flowspecRule, setFlowspecRule] = useState<string | null>(null);

  const handleDeployFlowspec = () => {
    SoundFx.playPacketDrop();
    const criticalIoc = iocs[0];
    setMitigatedIocs([criticalIoc.id]);
    setFlowspecRule(`flow route {\n  match {\n    destination 198.51.100.44/32;\n    protocol tcp;\n  }\n  then discard;\n}`);
    setTimeout(() => {
      SoundFx.playSuccessChime();
    }, 400);
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setMitigatedIocs([]);
    setFlowspecRule(null);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-rose-400 font-bold uppercase tracking-wider">
                Version 6.4 Threat Intelligence
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold">
                STIX 2.1 & MITRE ATT&CK
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              OASIS TAXII Threat Feed & Automated BGP Flowspec Mitigation
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {mitigatedIocs.length === 0 ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleDeployFlowspec}
              leftIcon={<Zap className="w-3.5 h-3.5 text-rose-300" />}
            >
              Deploy BGP Flowspec Blackhole
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              Reset Threat Matrix
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: STIX 2.1 IoC Ticker (Left) & MITRE Matrix + Flowspec (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 6 Cols: Live STIX IoC Feed */}
        <div className="lg:col-span-6 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-rose-400" /> Active STIX 2.1 Threat Indicators (IoCs)
            </span>
            <span className="text-[10px] font-mono text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/30">
              TAXII 2.1 Feed Live
            </span>
          </div>

          <div className="space-y-2.5">
            {iocs.map((ioc) => {
              const isMitigated = mitigatedIocs.includes(ioc.id);
              return (
                <div
                  key={ioc.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col gap-1.5 ${
                    isMitigated
                      ? 'border-emerald-500/50 bg-emerald-950/10'
                      : 'border-[#262c42] bg-[#121522]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-mono">{ioc.value}</span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded border font-bold ${
                        isMitigated
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                          : 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                      }`}
                    >
                      {isMitigated ? 'BLOCKED VIA FLOWSPEC' : ioc.severity}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-400 mt-1">
                    <div>Actor: <span className="text-white">{ioc.threatActor}</span></div>
                    <div>Tactic: <span className="text-rose-300">{ioc.mitreTactic}</span></div>
                    <div>Technique: <span className="text-cyan-300">{ioc.mitreTechniqueId}</span></div>
                    <div>Confidence: <span className="text-emerald-400">{ioc.confidenceScore}%</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 6 Cols: MITRE ATT&CK Matrix & Flowspec CLI */}
        <div className="lg:col-span-6 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-rose-400" /> MITRE ATT&CK Enterprise Matrix
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {mitreCards.map((card) => (
              <div
                key={card.id}
                className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col gap-1"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-white">{card.name}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-500/30">
                    {card.activeCount}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">{card.tactic}</span>
                <span className="text-[9px] font-mono text-cyan-400">{card.techniqueId}</span>
              </div>
            ))}
          </div>

          {/* Generated BGP Flowspec Filter */}
          {flowspecRule && (
            <div className="space-y-1.5 pt-2 border-t border-[#202538] animate-in fade-in">
              <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold block flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> BGP Flowspec (RFC 5575) Kernel Filter
              </span>
              <pre className="p-3 rounded-xl bg-black/60 border border-zinc-800 text-[11px] font-mono text-emerald-300 overflow-x-auto">
                <code>{flowspecRule}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

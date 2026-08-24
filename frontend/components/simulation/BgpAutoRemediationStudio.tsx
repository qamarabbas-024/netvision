'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Activity,
  CheckCircle2,
  Zap,
  RotateCcw,
  Network,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  BgpAutoRemediationEngine,
  BgpRemediationState,
} from '@/lib/bgpAutoRemediationEngine';
import { SoundFx } from '@/lib/soundFx';

export const BgpAutoRemediationStudio: React.FC = () => {
  const [state, setState] = useState<BgpRemediationState>(() =>
    BgpAutoRemediationEngine.getInitialState()
  );
  const [isLeaking, setIsLeaking] = useState<boolean>(false);
  const [remediationLog, setRemediationLog] = useState<string | null>(null);

  const handleSimulateLeak = () => {
    setIsLeaking(true);
    SoundFx.playPacketDrop();

    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        peers: prev.peers.map((peer) =>
          peer.remoteAsn === 7018
            ? {
                ...peer,
                leakedRoutesDropped: peer.leakedRoutesDropped + 248,
                status: 'LEAK_BLOCKED',
              }
            : peer
        ),
      }));
      setRemediationLog(
        '🛡️ RFC 9234 Route-Leak Detected from Provider AS 7018! BGP Only-to-Customer (OTC) attribute matched illegal transit leak. 248 hijacked prefixes dropped in 0.38 ms before route table contamination.'
      );
      setIsLeaking(false);
      SoundFx.playSuccessChime();
    }, 500);
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setState(BgpAutoRemediationEngine.getInitialState());
    setRemediationLog(null);
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
                Version 8.7 BGP Auto-Remediation
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold">
                RFC 9234 • OTC Filter • RPKI
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              BGP Autonomous Route-Leak Defense & RFC 9234 Roles
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isLeaking ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleSimulateLeak}
              leftIcon={<Zap className="w-3.5 h-3.5" />}
            >
              Simulate Rogue Route-Leak
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Filtering Rogue Updates...
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset
          </Button>
        </div>
      </div>

      {/* Main Grid: BGP Peers (Left) & RFC 9234 Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: BGP Sessions */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Network className="w-4 h-4 text-rose-400" /> BGP Peer Role Sessions (Local ASN {state.localAsn})
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              RPKI: {state.rpkiValidationRatePct}% Valid
            </span>
          </div>

          <div className="space-y-3">
            {state.peers.map((p) => (
              <div
                key={p.remoteAsn}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col gap-2 ${
                  p.status === 'LEAK_BLOCKED'
                    ? 'border-rose-500/50 bg-rose-950/20'
                    : 'border-[#262c42] bg-[#121522]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono">{p.remoteName} (AS{p.remoteAsn})</span>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold border ${
                      p.status === 'LEAK_BLOCKED'
                        ? 'bg-rose-950/60 text-rose-300 border-rose-500/40 animate-pulse'
                        : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-zinc-400">
                  <div>RFC 9234 Role: <span className="text-cyan-300 font-bold">{p.configuredRole}</span></div>
                  <div>OTC Filter: <span className="text-emerald-400 font-bold">ACTIVE</span></div>
                  <div>Dropped Leaks: <span className={p.leakedRoutesDropped > 0 ? 'text-rose-400 font-bold' : 'text-zinc-500'}>{p.leakedRoutesDropped}</span></div>
                </div>
              </div>
            ))}
          </div>

          {remediationLog && (
            <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-xs font-mono text-rose-200 leading-relaxed animate-in fade-in">
              {remediationLog}
            </div>
          )}
        </div>

        {/* Right 5 Cols: RFC 9234 Autonomous Protection */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-rose-400" /> BGP Routing Table Integrity
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#121522] border border-[#262c42] space-y-2 text-[11px] font-mono text-zinc-400">
            <span className="text-white font-bold block">Autonomous Defense Architecture:</span>
            <div>• RFC 9234 assigns explicit relationship roles to all BGP peering sessions</div>
            <div>• Only-to-Customer (OTC) attribute flags routes learned from peers/providers</div>
            <div>• Automatically prevents accidental transit routing loops and intentional route hijack attacks</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" /> Internet Global Safety
            </div>
            <div>• Zero human intervention required during massive multi-prefix route leak incidents</div>
            <div>• Maintains global Internet route stability across 948,000+ DFZ routing table entries</div>
          </div>
        </div>
      </div>
    </div>
  );
};

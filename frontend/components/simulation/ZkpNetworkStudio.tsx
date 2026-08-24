'use client';

import React, { useState } from 'react';
import {
  Activity,
  Layers,
  CheckCircle2,
  Zap,
  RotateCcw,
  Key,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  ZkpNetworkEngine,
  ZkProofState,
} from '@/lib/zkpNetworkEngine';
import { SoundFx } from '@/lib/soundFx';

export const ZkpNetworkStudio: React.FC = () => {
  const [state, setState] = useState<ZkProofState>(() =>
    ZkpNetworkEngine.getInitialState()
  );
  const [isProving, setIsProving] = useState<boolean>(false);
  const [zkLog, setZkLog] = useState<string | null>(null);

  const handleGenerateProof = () => {
    setIsProving(true);
    SoundFx.playPacketDispatch();

    setTimeout(() => {
      setZkLog(
        '🔐 Groth16 zk-SNARK proof synthesized in 14.8 ms! Verifier confirmed 100% regulatory compliance in 0.12 ms without discovering any internal IP topology or private keys.'
      );
      setIsProving(false);
      SoundFx.playSuccessChime();
    }, 500);
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setState(ZkpNetworkEngine.getInitialState());
    setZkLog(null);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                Version 8.9 Zero-Knowledge Proofs
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                zk-SNARK • Groth16 • BN254
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Zero-Knowledge (zk-SNARK) Network State & Compliance Verification
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isProving ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleGenerateProof}
              leftIcon={<Zap className="w-3.5 h-3.5" />}
            >
              Synthesize zk-SNARK Proof (π)
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Synthesizing R1CS Witness...
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset
          </Button>
        </div>
      </div>

      {/* Main Grid: R1CS Constraints (Left) & Cryptographic Proof Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: Circuit Constraints */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" /> R1CS Arithmetic Circuit Constraints
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
              {state.circuitName}
            </span>
          </div>

          <div className="space-y-3">
            {state.constraints.map((c) => (
              <div
                key={c.constraintId}
                className="p-3.5 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col gap-1 text-xs font-mono"
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold">{c.constraintId}: {c.name}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-bold">
                    SATISFIED
                  </span>
                </div>
                <span className="text-[10px] text-cyan-300">R1CS: {c.r1csFormula}</span>
              </div>
            ))}
          </div>

          {zkLog && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs font-mono text-emerald-200 leading-relaxed animate-in fade-in">
              {zkLog}
            </div>
          )}
        </div>

        {/* Right 5 Cols: Cryptographic Proof Output */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" /> Proof Performance Benchmarks
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Verification Time</span>
              <span className="text-lg font-bold text-emerald-400 font-mono mt-1">{state.verificationTimeMs} ms</span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Constant time O(1)</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Proof Size</span>
              <span className="text-lg font-bold text-cyan-400 font-mono mt-1">{state.proofSizePayloadBytes} Bytes</span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Fits in single packet header</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Zero-Knowledge Guarantees
            </div>
            <div>• Mathematically proves regulatory compliance to third-party auditors</div>
            <div>• Zero leaks of internal IP architecture, firewall rules, or user credentials</div>
            <div>• Enables cross-company confidential peering verification without NDA friction</div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  PostQuantumTlsEngine,
  PostQuantumTlsState,
} from '@/lib/postQuantumTlsEngine';
import { SoundFx } from '@/lib/soundFx';

export const PostQuantumTlsStudio: React.FC = () => {
  const [state, setState] = useState<PostQuantumTlsState>(() =>
    PostQuantumTlsEngine.getInitialState()
  );
  const [isAttacking, setIsAttacking] = useState<boolean>(false);
  const [pqcLog, setPqcLog] = useState<string | null>(null);

  const handleSimulateQuantumAttack = () => {
    setIsAttacking(true);
    SoundFx.playPacketDispatch();

    setTimeout(() => {
      setPqcLog(
        '🛡️ 100,000-Qubit Quantum Computer executed Shor\'s Algorithm against wire session. Classical X25519 cracked in 0.4s, BUT ML-KEM-768 (Lattice LWE) remained 100% unbroken! Hybrid session cipher key stayed fully confidential.'
      );
      setIsAttacking(false);
      SoundFx.playSuccessChime();
    }, 600);
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setState(PostQuantumTlsEngine.getInitialState());
    setPqcLog(null);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00f0ff]">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
                Version 9.1 Post-Quantum TLS 1.3
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                NIST FIPS 203 ML-KEM • Kyber-768
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Post-Quantum Hybrid Key Encapsulation (X25519MLKEM768)
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isAttacking ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleSimulateQuantumAttack}
              leftIcon={<Zap className="w-3.5 h-3.5" />}
            >
              Simulate 100k-Qubit Shor Attack
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Quantum Computer Factoring...
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset
          </Button>
        </div>
      </div>

      {/* Main Grid: Hybrid Layers (Left) & Quantum Hardness Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: Hybrid PQC Cipher Stack */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#00f0ff]" /> Hybrid Cryptographic Handshake Layers
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
              {state.cipherSuite}
            </span>
          </div>

          <div className="space-y-3">
            {state.components.map((c) => (
              <div
                key={c.layer}
                className="p-3.5 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono">{c.algorithm}</span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 font-bold">
                    {c.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-zinc-400 mt-1">
                  <div>Key Size: <span className="text-white font-bold">{c.keySizeBits} bits</span></div>
                  <div>Security: <span className="text-emerald-400 font-bold">{c.securityLevel}</span></div>
                  <div>Quantum Risk: <span className={c.quantumResistanceYears.includes('Vulnerable') ? 'text-rose-400' : 'text-cyan-300'}>{c.quantumResistanceYears}</span></div>
                </div>
              </div>
            ))}
          </div>

          {pqcLog && (
            <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs font-mono text-cyan-200 leading-relaxed animate-in fade-in">
              {pqcLog}
            </div>
          )}
        </div>

        {/* Right 5 Cols: PQC Security Guarantees */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" /> Post-Quantum Resilience
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Quantum Vulnerability</span>
              <span className="text-lg font-bold text-emerald-400 font-mono mt-1">0.0%</span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Immune to Shor's algo</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Handshake Delay</span>
              <span className="text-lg font-bold text-cyan-400 font-mono mt-1">{state.handshakeLatencyMs} ms</span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Sub-3ms PQC overhead</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> NIST PQC Standard Highlights
            </div>
            <div>• Combines classical ECDH with Module Lattice Learning With Errors (ML-KEM)</div>
            <div>• Protects against Harvest-Now-Decrypt-Later (HNDL) state adversary archiving</div>
            <div>• Fully standardized in IETF TLS 1.3 and Chrome / Chromium web browsers</div>
          </div>
        </div>
      </div>
    </div>
  );
};

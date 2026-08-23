'use client';

import React, { useState } from 'react';
import {
  Key,
  Zap,
  Activity,
  Layers,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  QuantumCryptoEngine,
  CryptoAlgorithmProfile,
} from '@/lib/quantumCryptoEngine';
import { SoundFx } from '@/lib/soundFx';

export const QuantumCryptoStudio: React.FC = () => {
  const [profiles] = useState<CryptoAlgorithmProfile[]>(() => QuantumCryptoEngine.getAlgorithmProfiles());
  const [selectedAlgo, setSelectedAlgo] = useState<CryptoAlgorithmProfile>(profiles[2]); // Kyber-1024
  const [quantumAttackActive, setQuantumAttackActive] = useState<boolean>(false);

  const handleLaunchQuantumAttack = () => {
    SoundFx.playPacketDrop();
    setQuantumAttackActive(true);
    if (selectedAlgo.shorsAlgorithmVulnerable) {
      SoundFx.playPacketDrop();
    } else {
      SoundFx.playSuccessChime();
    }
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setQuantumAttackActive(false);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">
                Version 5.7 Quantum Cryptography
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold">
                NIST PQC Kyber-1024 & Dilithium
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Post-Quantum Lattice Cryptography & Shor's Attack Simulator
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!quantumAttackActive ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleLaunchQuantumAttack}
              leftIcon={<Zap className="w-3.5 h-3.5 text-purple-300" />}
            >
              Simulate Shor's Qubit Attack (4096-Qubit Quantum System)
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              Reset Quantum State
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: Algorithm Selector (Left) & Cryptanalysis + Handshake Dissector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 6 Cols: Algorithm Cards */}
        <div className="lg:col-span-6 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-purple-400" /> Select Cryptographic Primitive
          </span>

          <div className="space-y-2.5">
            {profiles.map((p) => {
              const isSelected = selectedAlgo.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    SoundFx.playTerminalKeyPress();
                    setSelectedAlgo(p);
                    setQuantumAttackActive(false);
                  }}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all flex flex-col gap-1.5 ${
                    isSelected
                      ? 'border-purple-500/80 bg-purple-950/20 shadow-glow-cyan'
                      : 'border-[#262c42] bg-[#121522] hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      {p.name}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                        p.shorsAlgorithmVulnerable
                          ? 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                          : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      {p.shorsAlgorithmVulnerable ? 'QUANTUM VULNERABLE' : 'QUANTUM SAFE (256-Bit)'}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-relaxed font-mono">{p.mathematicalHardness}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 6 Cols: Attack Evaluation & Hybrid TLS Dissector */}
        <div className="lg:col-span-6 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-purple-400" /> Quantum Cryptanalysis Telemetry
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                !quantumAttackActive
                  ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  : selectedAlgo.shorsAlgorithmVulnerable
                  ? 'bg-rose-950/60 text-rose-300 border-rose-500/40 animate-pulse'
                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
              }`}
            >
              {!quantumAttackActive
                ? 'STANDBY'
                : selectedAlgo.shorsAlgorithmVulnerable
                ? 'KEY BROKEN IN 0.02s'
                : 'PQC LATTICE SHIELD SECURE'}
            </span>
          </div>

          {/* Primitive Specs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Public Key Size</span>
              <span className="text-base font-bold text-white font-mono mt-1">
                {selectedAlgo.publicKeySizeBytes} Bytes
              </span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Wire Overhead Metric</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Post-Quantum Bits</span>
              <span
                className={`text-base font-bold font-mono mt-1 ${
                  selectedAlgo.quantumSecurityBits > 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {selectedAlgo.quantumSecurityBits} Bits Security
              </span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Grover / Shor Resistance</span>
            </div>
          </div>

          {/* Hybrid TLS 1.3 Handshake Breakdown */}
          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Key className="w-4 h-4 text-purple-400" /> Hybrid TLS 1.3 Handshake (X25519Kyber768)
            </span>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-mono">
              Combines classical ECDH X25519 with Kyber-768 KEM. Even if quantum computers solve ECDLP, the shared master key remains cryptographically secure under Module-LWE lattice hardness.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

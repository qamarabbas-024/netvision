'use client';

import React, { useState } from 'react';
import {
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  QuantumRoutingEngine,
  QuantumRoutingState,
} from '@/lib/quantumRoutingEngine';
import { SoundFx } from '@/lib/soundFx';

export const QuantumRoutingStudio: React.FC = () => {
  const [state, setState] = useState<QuantumRoutingState>(() =>
    QuantumRoutingEngine.getInitialState()
  );
  const [qkdLog, setQkdLog] = useState<string | null>(null);

  const handleInjectEve = () => {
    SoundFx.playPacketDrop();
    setState((prev) => ({
      ...prev,
      eavesdropperPresent: true,
      qberErrorRatePct: 31.4,
      nodes: prev.nodes.map((node) => ({
        ...node,
        entanglementFidelityPct: 48.2,
        bellStateMeasured: 'PENDING',
      })),
    }));
    setQkdLog('⚠️ Eve Eavesdropper detected on Zurich-Munich fiber! Photon polarization collapsed. QBER spiked to 31.4% (Threshold: 11.0%). QKD key material purged immediately.');
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setState(QuantumRoutingEngine.getInitialState());
    setQkdLog(null);
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
                Version 7.3 Quantum Internet
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold">
                QKD BB84 • Entanglement Swapping
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Quantum Entanglement Routing & Multi-Hop Bell States
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!state.eavesdropperPresent ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleInjectEve}
              leftIcon={<AlertTriangle className="w-3.5 h-3.5 text-amber-300" />}
            >
              Simulate Eve Eavesdropper Attack
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              Restore Quantum Coherence
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: Quantum Node Chain (Left) & QBER & Entanglement Physics (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: Quantum Repeater Nodes */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-400" /> Quantum Entangled Node Conduit
            </span>
            <span className="text-[10px] font-mono text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/30">
              Raw Key: {state.rawKeyBitsGenerated} bits
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {state.nodes.map((node) => (
              <div
                key={node.nodeId}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col gap-2 ${
                  state.eavesdropperPresent
                    ? 'border-rose-500/50 bg-rose-950/20'
                    : 'border-[#262c42] bg-[#121522]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono">{node.name}</span>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold border ${
                      !state.eavesdropperPresent
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                        : 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    {node.bellStateMeasured}
                  </span>
                </div>

                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400">Fidelity (F):</span>
                  <span className={node.entanglementFidelityPct > 80 ? 'text-purple-300 font-bold' : 'text-rose-400 font-bold'}>
                    {node.entanglementFidelityPct}%
                  </span>
                </div>

                <div className="text-[10px] font-mono text-zinc-400">
                  Cryo Qubits: <span className="text-white">{node.memoryQubitsStored} qubits</span>
                </div>
              </div>
            ))}
          </div>

          {qkdLog && (
            <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-xs font-mono text-rose-200 leading-relaxed animate-in fade-in">
              {qkdLog}
            </div>
          )}
        </div>

        {/* Right 5 Cols: QBER Telemetry */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-purple-400" /> Quantum Bit Error Rate (QBER)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">QBER Metric</span>
              <span className={`text-lg font-bold font-mono mt-1 ${state.qberErrorRatePct > 11 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {state.qberErrorRatePct}%
              </span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Threshold: 11.0%</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Quantum State</span>
              <span className="text-lg font-bold text-purple-400 font-mono mt-1">
                {state.eavesdropperPresent ? 'COLLAPSED' : '|Φ+⟩ ENTANGLED'}
              </span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">EPR Bell pair</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Quantum Entanglement Swapping
            </div>
            <div>• Entangles two remote nodes without photons ever traveling directly between them</div>
            <div>• Bell State Measurement (BSM) projects intermediate quantum memory states</div>
            <div>• Eavesdropping mathematically alters quantum superposition (No-Cloning Theorem)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

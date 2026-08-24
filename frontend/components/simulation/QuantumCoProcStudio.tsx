'use client';

import React, { useState } from 'react';
import {
  Activity,
  Layers,
  CheckCircle2,
  Zap,
  RotateCcw,
  Atom,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  QuantumCoProcEngine,
  QuantumCoProcState,
} from '@/lib/quantumCoProcEngine';
import { SoundFx } from '@/lib/soundFx';

export const QuantumCoProcStudio: React.FC = () => {
  const [state, setState] = useState<QuantumCoProcState>(() =>
    QuantumCoProcEngine.getInitialState()
  );
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [qaoaLog, setQaoaLog] = useState<string | null>(null);

  const handleExecuteQaoa = () => {
    setIsOptimizing(true);
    SoundFx.playPacketDispatch();

    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        hamiltonianEnergyScore: -9.94,
        qubits: prev.qubits.map((q) => ({
          ...q,
          status: 'MEASURED',
        })),
      }));
      setQaoaLog(
        '⚛️ Quantum QAOA Algorithm collapsed 128 entangled qubits to Hamiltonian ground state! Multi-commodity flow routing across 1,000 nodes solved in 1.2 µs (14,200x speedup over classical solvers).'
      );
      setIsOptimizing(false);
      SoundFx.playSuccessChime();
    }, 600);
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setState(QuantumCoProcEngine.getInitialState());
    setQaoaLog(null);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00f0ff]">
            <Atom className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
                Version 9.4 Quantum Co-Processor
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                15 mK Cryostat • QAOA QPU
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Hybrid Neuromorphic Quantum Co-Processor (QPU) Offload
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isOptimizing ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleExecuteQaoa}
              leftIcon={<Zap className="w-3.5 h-3.5" />}
            >
              Execute QAOA Quantum Circuit
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Collapsing Qubit States...
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset
          </Button>
        </div>
      </div>

      {/* Main Grid: Cryo Qubits (Left) & Quantum Acceleration Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: Qubit Registers */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#00f0ff]" /> Superconducting Qubit Registers ({state.cryoTempMilliKelvin} mK)
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
              Hamiltonian: {state.hamiltonianEnergyScore}
            </span>
          </div>

          <div className="space-y-3">
            {state.qubits.map((q) => (
              <div
                key={q.qubitId}
                className="p-3.5 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono">{q.qubitId}</span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 font-bold">
                    {q.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-zinc-400 mt-1">
                  <div>Coherence: <span className="text-white font-bold">{q.coherenceTimeMicrosec} µs</span></div>
                  <div>Fidelity: <span className="text-emerald-400 font-bold">{q.fidelityPct}%</span></div>
                  <div>Phase: <span className="text-cyan-300 font-bold">{q.phaseAngleRad} rad</span></div>
                </div>
              </div>
            ))}
          </div>

          {qaoaLog && (
            <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs font-mono text-cyan-200 leading-relaxed animate-in fade-in">
              {qaoaLog}
            </div>
          )}
        </div>

        {/* Right 5 Cols: Quantum Advantage Metrics */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" /> Quantum Advantage Score
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Quantum Speedup</span>
              <span className="text-lg font-bold text-emerald-400 font-mono mt-1">
                {state.quantumSpeedupFactor.toLocaleString()}x
              </span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">vs Classical Dijkstra / ILP</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Execution Time</span>
              <span className="text-lg font-bold text-cyan-400 font-mono mt-1">1.2 µs</span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Sub-microsecond solve</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> QAOA Routing Theory
            </div>
            <div>• Maps NP-hard traffic matrix optimization into an Ising spin Hamiltonian graph</div>
            <div>• Superconducting qubits evaluate \(2^{128}\) possible global routes simultaneously</div>
            <div>• Neuromorphic pre-processors convert continuous line rates into discrete quantum pulses</div>
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import {
  Dna,
  Activity,
  Layers,
  CheckCircle2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  DnaStorageEngine,
  DnaStorageState,
} from '@/lib/dnaStorageEngine';
import { SoundFx } from '@/lib/soundFx';

export const DnaStorageStudio: React.FC = () => {
  const [state, setState] = useState<DnaStorageState>(() =>
    DnaStorageEngine.getInitialState()
  );
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [dnaLog, setDnaLog] = useState<string | null>(null);

  const handleSynthesizeOligo = () => {
    setIsSynthesizing(true);
    SoundFx.playPacketDispatch();

    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        strands: [
          ...prev.strands,
          {
            oligoId: `OLIGO-SYN-${Date.now().toString().slice(-4)}`,
            sequenceAcgt: 'TAGCCTAGCGATCGATCGATCGATCGGCTAACTGACTGA',
            binaryLengthBits: 80,
            gcContentPct: 50.0,
            reedSolomonParityBytes: 16,
            status: 'SYNTHESIZED_STABLE',
          },
        ],
      }));
      setDnaLog(
        '🧬 Phosphoramidite Chemical Synthesis Complete! Encoded 80 bits into 40 base-pair DNA macromolecule with 50% GC-content and Reed-Solomon error correction. 10,000-year shelf life at zero idle power.'
      );
      setIsSynthesizing(false);
      SoundFx.playSuccessChime();
    }, 500);
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setState(DnaStorageEngine.getInitialState());
    setDnaLog(null);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Dna className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                Version 9.8 DNA Molecular Storage
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                215 PB/Gram • 10,000-Year Retention
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              DNA Molecular Network Data Storage & Biological In-Vivo Routing
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isSynthesizing ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleSynthesizeOligo}
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Synthesize Molecular DNA Strand
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Synthesizing Nucleotides...
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset
          </Button>
        </div>
      </div>

      {/* Main Grid: DNA Strands (Left) & Molecular Density Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: Oligo Strands */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" /> Synthesized Oligo Nucleotide Sequences
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              Density: {state.densityPetabytesPerGram} PB/gram
            </span>
          </div>

          <div className="space-y-3">
            {state.strands.map((s) => (
              <div
                key={s.oligoId}
                className="p-3.5 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono">{s.oligoId}</span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-bold">
                    {s.status}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-black/60 border border-zinc-800 text-[11px] font-mono text-emerald-300 break-all tracking-wider">
                  {s.sequenceAcgt}
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-zinc-400">
                  <div>Binary: <span className="text-white font-bold">{s.binaryLengthBits} bits</span></div>
                  <div>GC Balance: <span className="text-cyan-300 font-bold">{s.gcContentPct}%</span></div>
                  <div>RS Parity: <span className="text-emerald-400 font-bold">{s.reedSolomonParityBytes} B</span></div>
                </div>
              </div>
            ))}
          </div>

          {dnaLog && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs font-mono text-emerald-200 leading-relaxed animate-in fade-in">
              {dnaLog}
            </div>
          )}
        </div>

        {/* Right 5 Cols: Molecular Storage Physics */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" /> Molecular Biology Physics
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Storage Density</span>
              <span className="text-lg font-bold text-emerald-400 font-mono mt-1">{state.densityPetabytesPerGram} PB/g</span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">1 Exabyte in a sugar cube</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Data Longevity</span>
              <span className="text-lg font-bold text-cyan-400 font-mono mt-1">10,000+ Yrs</span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Zero idle power needed</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Biological Computing Principles
            </div>
            <div>• Base-4 mapping (A=00, C=01, G=10, T=11) encodes high-density binary data</div>
            <div>• Droplet-based microfluidic chips sort and route biological packets via chemical affinity</div>
            <div>• Infinite media shelf life overcomes hard drive and magnetic tape bit rot</div>
          </div>
        </div>
      </div>
    </div>
  );
};

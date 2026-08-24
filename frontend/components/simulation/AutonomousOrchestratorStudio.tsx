'use client';

import React, { useState } from 'react';
import {
  Crown,
  Sparkles,
  Layers,
  Activity,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  SovereignOrchestratorEngine,
  OrchestratedFabric,
} from '@/lib/sovereignOrchestratorEngine';
import { SoundFx } from '@/lib/soundFx';

export const AutonomousOrchestratorStudio: React.FC = () => {
  const [intent, setIntent] = useState<string>(
    'Deploy a sovereign cloud trading fabric with 99.9999% SLA, 800G optical underlay, BGP EVPN micro-segmentation, and Post-Quantum Kyber-1024 security.'
  );
  const [fabric, setFabric] = useState<OrchestratedFabric | null>(() =>
    SovereignOrchestratorEngine.compileIntentToFabric(intent)
  );
  const [isCompiling, setIsCompiling] = useState<boolean>(false);

  const handleCompileIntent = () => {
    setIsCompiling(true);
    SoundFx.playPacketDispatch();

    setTimeout(() => {
      const res = SovereignOrchestratorEngine.compileIntentToFabric(intent);
      setFabric(res);
      setIsCompiling(false);
      SoundFx.playSuccessChime();
    }, 600);
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setFabric(null);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                Version 7.0 Sovereign Fabric
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
                Intent-to-Fabric Compiler
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Autonomous Sovereign Network Orchestrator & AI Architect
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleCompileIntent}
            disabled={isCompiling}
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
          >
            {isCompiling ? 'Synthesizing Autonomous Fabric...' : 'Compile Intent to Fabric'}
          </Button>
          {fabric && (
            <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: Intent Input (Left) & Multi-Layer Fabric Artifacts (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 5 Cols: Intent Description & SLA Assurance */}
        <div className="lg:col-span-5 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-amber-400" /> High-Level Architecture Intent
          </span>

          <textarea
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            rows={5}
            className="w-full p-3.5 rounded-2xl bg-black/60 border border-[#262c42] text-xs font-mono text-amber-200 resize-none focus:outline-none focus:border-amber-400 leading-relaxed"
          />

          {fabric && (
            <div className="p-4 rounded-2xl bg-[#121522] border border-[#262c42] space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-zinc-800 pb-1.5">
                <span className="text-zinc-400">Target SLA:</span>
                <span className="text-emerald-400 font-bold">{fabric.slaUptime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Compliance:</span>
                <span className="text-cyan-300 font-bold">{fabric.complianceCert}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right 7 Cols: Multi-Layer Synthesized Artifacts */}
        <div className="lg:col-span-7 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-amber-400" /> Synthesized Multi-Layer Artifacts ({fabric ? fabric.layers.length : 0})
            </span>
            <span className="text-[10px] font-mono text-emerald-400">100% CI Verified</span>
          </div>

          {fabric ? (
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {fabric.layers.map((layer, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-mono">{layer.layerName}</span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 font-bold">
                      {layer.validationStatus}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-cyan-300">{layer.technology}</span>

                  <pre className="p-3 rounded-xl bg-black/60 border border-zinc-800 text-[11px] font-mono text-emerald-300 overflow-x-auto mt-1">
                    <code>{layer.configSnippet}</code>
                  </pre>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs font-mono text-zinc-500">
              Click "Compile Intent to Fabric" to synthesize multi-layer autonomous cloud architecture.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { ShieldCheck, Globe, ArrowRight, Lock, Activity, Check, Radio } from 'lucide-react';
import { SAMPLE_SCION_PATHS, ScionPathOption } from '@/lib/scionArchitectureEngine';

export const ScionArchitectureStudio: React.FC = () => {
  const [paths] = useState<ScionPathOption[]>(SAMPLE_SCION_PATHS);
  const [selectedPathId, setSelectedPathId] = useState<string>('PATH-ISD-1-CH-EU');

  const selectedPath = paths.find((p) => p.pathId === selectedPathId) || paths[0];

  return (
    <div className="surface-1 rounded-2xl border border-[#2a2e39] p-6 text-[#f4f5f7] font-sans shadow-instrument flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2e39] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#22c55e]">
              EPOCH XV // SCION NEXT-GEN INTERNET ARCHITECTURE
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            SCION Path-Aware Forwarding & Isolation Domain Studio
          </h2>
          <p className="text-xs text-[#8e95a5]">
            Select end-to-end multi-path routes with cryptographically authenticated hop fields and geofenced sovereignty.
          </p>
        </div>
      </div>

      {/* Path Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-[#2a2e39] pb-2 font-mono text-xs">
        {paths.map((p) => (
          <button
            key={p.pathId}
            type="button"
            onClick={() => setSelectedPathId(p.pathId)}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold flex items-center gap-2 ${
              selectedPathId === p.pathId
                ? 'bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30'
                : 'text-[#8e95a5] hover:text-white'
            }`}
          >
            <span>{p.pathId}</span>
            <span className="text-[10px] text-[#64748b]">({p.latencyMs} ms)</span>
          </button>
        ))}
      </div>

      {/* Hop Sequence Vis */}
      <div className="p-4 rounded-xl bg-[#090d14] border border-[#1e293b] font-mono text-xs flex flex-col gap-3">
        <span className="text-white font-bold pb-2 border-b border-[#1e293b] flex items-center justify-between">
          <span>End-Host Path Traversal (Isolation Domains &amp; ASes)</span>
          <span className="text-[#22c55e] flex items-center gap-1 font-bold">
            <Lock className="w-3 h-3" />
            <span>CRYPTOGRAPHICALLY AUTHENTICATED</span>
          </span>
        </span>

        <div className="flex flex-wrap items-center gap-2 pt-2">
          {selectedPath.isdAsList.map((asNode, idx) => (
            <React.Fragment key={idx}>
              <div className="px-3 py-2 rounded-lg bg-[#020617] border border-[#1e293b] text-white font-bold text-xs flex items-center gap-2 shadow-sm">
                <Globe className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>{asNode}</span>
              </div>
              {idx < selectedPath.isdAsList.length - 1 && (
                <ArrowRight className="w-4 h-4 text-[#22c55e]" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Cryptographic Hop Field Dissection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {selectedPath.hopFields.map((hf, idx) => (
          <div key={idx} className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1.5">
            <div className="flex items-center justify-between pb-1 border-b border-[#1e293b]">
              <span className="text-[#64748b] font-bold">HOP FIELD #{idx + 1}</span>
              <span className="text-[#22c55e] font-bold">MAC: {hf.macValidation}</span>
            </div>
            <div className="text-[11px] text-[#8e95a5] flex justify-between">
              <span>Ingress: <strong className="text-white">Port {hf.ingressInterface}</strong></span>
              <span>Egress: <strong className="text-white">Port {hf.egressInterface}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

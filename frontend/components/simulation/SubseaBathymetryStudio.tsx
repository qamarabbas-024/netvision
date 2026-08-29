'use client';

import React, { useState } from 'react';
import { Waves, Activity, ShieldCheck, Zap, Anchor, Compass, Radio } from 'lucide-react';
import { SAMPLE_SUBSEA_CABLES, SubseaCableSystem } from '@/lib/subseaBathymetryEngine';

export const SubseaBathymetryStudio: React.FC = () => {
  const [cables] = useState<SubseaCableSystem[]>(SAMPLE_SUBSEA_CABLES);
  const [selectedCableId, setSelectedCableId] = useState<string>('CABLE-TAT-14');

  const selectedCable = cables.find((c) => c.id === selectedCableId) || cables[0];

  return (
    <div className="surface-1 rounded-2xl border border-[#2a2e39] p-6 text-[#f4f5f7] font-sans shadow-instrument flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2e39] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#22c55e]">
              EPOCH XIII // SUBSEA CABLE BATHYMETRY & OPTICS
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Transoceanic Subsea Fiber Cable & Optical Repeater Studio
          </h2>
          <p className="text-xs text-[#8e95a5]">
            Model deep seabed bathymetry profiles, erbium-doped optical amplifiers (EDFA), and acoustic fault detection.
          </p>
        </div>
      </div>

      {/* Cable Selector */}
      <div className="flex items-center gap-2 border-b border-[#2a2e39] pb-2 font-mono text-xs">
        {cables.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedCableId(c.id)}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold flex items-center gap-2 ${
              selectedCableId === c.id
                ? 'bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30'
                : 'text-[#8e95a5] hover:text-white'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>{c.name}</span>
          </button>
        ))}
      </div>

      {/* Cable Telemetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">ROUTE DISTANCE</span>
          <strong className="text-white text-sm">{selectedCable.lengthKm.toLocaleString()} km</strong>
        </div>

        <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">FIBER CAPACITY</span>
          <strong className="text-[#38bdf8] text-sm">{selectedCable.capacityTbps} Tbps ({selectedCable.fiberPairs} Pairs)</strong>
        </div>

        <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">OPTICAL REPEATERS</span>
          <strong className="text-[#22c55e] text-sm">{selectedCable.repeaterCount} EDFAs (@ 80km Spacing)</strong>
        </div>

        <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">SEABED DEPTH</span>
          <strong className="text-purple-400 text-sm">~{selectedCable.averageDepthMeters}m Bathymetric Trench</strong>
        </div>
      </div>

      {/* Landing Stations */}
      <div className="p-4 rounded-xl bg-[#090d14] border border-[#1e293b] font-mono text-xs flex flex-col gap-2">
        <span className="text-white font-bold pb-2 border-b border-[#1e293b] flex items-center gap-2">
          <Anchor className="w-4 h-4 text-[#22c55e]" />
          <span>Cable Landing Stations (CLS)</span>
        </span>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {selectedCable.landingStations.map((cls, idx) => (
            <div key={idx} className="px-3 py-1.5 rounded-lg bg-[#020617] border border-[#1e293b] text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
              <span>{cls}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

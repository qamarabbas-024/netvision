'use client';

import React, { useState } from 'react';
import { Server, Activity, Thermometer, Zap, ShieldCheck, Box, Flame } from 'lucide-react';
import { SAMPLE_DC_RACKS, DatacenterRack, ServerRackUnit } from '@/lib/datacenterWalkthroughEngine';

export const DatacenterWalkthroughStudio: React.FC = () => {
  const [racks] = useState<DatacenterRack[]>(SAMPLE_DC_RACKS);
  const [selectedRackId, setSelectedRackId] = useState<string>('RACK-A01');
  const [thermalView, setThermalView] = useState<boolean>(false);

  const selectedRack = racks.find((r) => r.id === selectedRackId) || racks[0];

  return (
    <div className="surface-1 rounded-2xl border border-[#2a2e39] p-6 text-[#f4f5f7] font-sans shadow-instrument flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2e39] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#22c55e]">
              EPOCH XIII // 3D PHYSICAL DATACENTER WALKTHROUGH
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Datacenter Hot/Cold Aisle & Physical Rack Elevation Studio
          </h2>
          <p className="text-xs text-[#8e95a5]">
            Inspect 42U rack units, power draw (kW), thermal dissipation, and spine-leaf fiber cabling runs in real time.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => setThermalView(!thermalView)}
            className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              thermalView
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                : 'bg-[#1a1f2c] text-[#8e95a5] border-[#2a2e39]'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>{thermalView ? 'Thermal Heat Map: ON' : 'Standard View'}</span>
          </button>
        </div>
      </div>

      {/* Rack Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-[#2a2e39] pb-2 font-mono text-xs">
        {racks.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setSelectedRackId(r.id)}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold flex items-center gap-2 ${
              selectedRackId === r.id
                ? 'bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30'
                : 'text-[#8e95a5] hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>{r.name}</span>
          </button>
        ))}
      </div>

      {/* Rack Elevation & Telemetry Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual 42U Rack Elevation */}
        <div className="lg:col-span-6 p-4 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-2 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#1e293b] text-white font-bold">
            <span>42U Chassis Elevation ({selectedRack.id})</span>
            <span className="text-[10px] text-[#38bdf8]">{selectedRack.aisle}</span>
          </div>

          <div className="flex flex-col gap-1.5">
            {selectedRack.units.map((u) => {
              const isOverheat = u.temperatureCelsius > 65;
              return (
                <div
                  key={u.uNumber}
                  className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
                    thermalView
                      ? isOverheat
                        ? 'bg-rose-950/40 border-rose-500 text-rose-300'
                        : 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                      : 'bg-[#0f172a] border-[#1e293b] text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-[#020617] text-[10px] font-bold text-[#64748b]">
                      U{u.uNumber}
                    </span>
                    <strong className="text-xs">{u.label}</strong>
                  </div>

                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="text-[#38bdf8]">{u.powerWatts} W</span>
                    <span className={isOverheat ? 'text-rose-400 font-bold' : 'text-[#22c55e]'}>
                      {u.temperatureCelsius}°C
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rack Energy & Cooling Telemetry */}
        <div className="lg:col-span-6 flex flex-col gap-4 font-mono text-xs">
          <div className="p-4 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-3">
            <span className="text-white font-bold pb-2 border-b border-[#1e293b]">
              Rack Power & Thermal Summary
            </span>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#020617] border border-[#1e293b]">
                <span className="text-[10px] text-[#64748b] block">TOTAL POWER DRAW</span>
                <strong className="text-[#38bdf8] text-sm">{selectedRack.totalPowerKw} kW</strong>
              </div>
              <div className="p-3 rounded-lg bg-[#020617] border border-[#1e293b]">
                <span className="text-[10px] text-[#64748b] block">COOLING EFFICIENCY (PUE)</span>
                <strong className="text-[#22c55e] text-sm">1.12 (Lossless Airflow)</strong>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-2">
            <span className="text-white font-bold pb-2 border-b border-[#1e293b]">
              Cable Raceway Routing
            </span>
            <div className="text-[11px] text-[#8e95a5] flex flex-col gap-1.5">
              <div>Top-of-Rack Fiber: <strong className="text-white">32x 800G MPO-16 to Spine Fabric</strong></div>
              <div>Management Bus: <strong className="text-[#38bdf8]">1G Cat6A to OOB Switched Mgmt</strong></div>
              <div>Power Drops: <strong className="text-[#22c55e]">Dual redundant 3-phase feeds (A+B)</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

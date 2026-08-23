'use client';

import React, { useState } from 'react';
import {
  Zap,
  Activity,
  Layers,
  Globe,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  SatelliteMeshEngine,
} from '@/lib/satelliteMeshEngine';
import { SoundFx } from '@/lib/soundFx';

export const SatelliteMeshStudio: React.FC = () => {
  const [data] = useState(() => SatelliteMeshEngine.getConstellationData());
  const [isRoutingLaser, setIsRoutingLaser] = useState<boolean>(false);
  const [laserTraceLog, setLaserTraceLog] = useState<string | null>(null);

  const handleRouteLaser = () => {
    setIsRoutingLaser(true);
    SoundFx.playPacketDispatch();

    setTimeout(() => {
      SoundFx.playHopForward();
    }, 300);

    setTimeout(() => {
      setIsRoutingLaser(false);
      setLaserTraceLog('🛰️ London Terminal -> Sat-101 (Up: 3.2ms) -> Laser ISL Plane-1 -> Laser ISL Plane-2 -> Sat-202 -> Singapore Gateway (Down: 3.4ms). Total RTT: 36.8ms (Undersea glass fiber: 88ms — 58% latency reduction).');
      SoundFx.playSuccessChime();
    }, 700);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00f0ff]">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
                Version 5.8 Satellite Mesh
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                LEO Optical Laser ISL
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Orbital Constellation & Space-Ground Vacuum Routing
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleRouteLaser}
            disabled={isRoutingLaser}
            leftIcon={<Zap className="w-3.5 h-3.5" />}
          >
            {isRoutingLaser ? 'Transmitting via Vacuum Lasers...' : 'Dispatch Laser ISL Packet (London -> Singapore)'}
          </Button>
        </div>
      </div>

      {/* Main Grid: Orbital Fleet (Left) & Ground Stations + Vacuum Physics (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: Satellites Fleet */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#00f0ff]" /> 550km LEO Orbital Constellation
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
              Vacuum Speed of Light: 300,000 km/s
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.satellites.map((sat) => (
              <div
                key={sat.id}
                className="p-3.5 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono">{sat.name}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
                    {sat.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-400 mt-1">
                  <div>Alt: {sat.altitudeKm} km</div>
                  <div>Speed: {sat.velocityKmS} km/s</div>
                  <div>Plane: Shell #{sat.orbitalPlane}</div>
                  <div>Laser Links: <span className="text-[#00f0ff] font-bold">{sat.laserLinksActive} Active</span></div>
                </div>
              </div>
            ))}
          </div>

          {/* Ground Station Terminals */}
          <div className="space-y-2 pt-2 border-t border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
              Connected Ground Gateway Dishes
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {data.groundStations.map((gs) => (
                <div
                  key={gs.id}
                  className="p-3 rounded-xl bg-[#10131e] border border-[#262c42] flex items-center justify-between text-xs font-mono"
                >
                  <div>
                    <span className="font-bold text-white block">{gs.city}</span>
                    <span className="text-[10px] text-zinc-400">Elevation: {gs.elevationAngleDeg}°</span>
                  </div>
                  <span className="text-[10px] text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">
                    Doppler: {gs.dopplerOffsetKhz} kHz
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Laser Telemetry & Physics Benchmark */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" /> Space Vacuum Optical Telemetry
            </span>
            <span className="text-[10px] font-mono text-emerald-400">
              Inter-Satellite Lasers: 100G Coherent
            </span>
          </div>

          {/* Trace Notification */}
          {laserTraceLog ? (
            <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs font-mono text-cyan-200 leading-relaxed animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mb-1" />
              {laserTraceLog}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#10131e] border border-[#202538] text-center text-xs font-mono text-zinc-500">
              Click "Dispatch Laser ISL Packet" to simulate ultra-low latency vacuum packet propagation.
            </div>
          )}

          {/* Physics Comparison Card */}
          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-2 text-[11px] font-mono text-zinc-400">
            <span className="text-xs font-bold text-white block">Speed of Light: Glass vs Vacuum</span>
            <div>• Terrestrial Fiber (n=1.468): ~204,000 km/s</div>
            <div>• Space ISL Vacuum (n=1.000): <span className="text-[#00f0ff] font-bold">~299,792 km/s (+47% Faster)</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

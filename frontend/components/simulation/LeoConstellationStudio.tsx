'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Radio, RotateCw, Play, Pause, Zap, Activity, Globe, Compass } from 'lucide-react';
import { SAMPLE_LEO_SATELLITES, computeOrbitalCoordinate, SatelliteNode } from '@/lib/leoConstellationEngine';

export const LeoConstellationStudio: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [satellites] = useState<SatelliteNode[]>(SAMPLE_LEO_SATELLITES);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [selectedSat, setSelectedSat] = useState<SatelliteNode>(satellites[0]);

  useEffect(() => {
    let anim: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let orbitAngle = 0;

    const render = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      ctx.clearRect(0, 0, w, h);
      if (isPlaying) orbitAngle += 0.008;

      const cx = w * 0.5;
      const cy = h * 0.5;
      const globeRadius = Math.min(w, h) * 0.32;

      // 1. Draw Earth Globe Sphere
      const globeGrad = ctx.createRadialGradient(cx - 30, cy - 30, 20, cx, cy, globeRadius);
      globeGrad.addColorStop(0, '#0f2b48');
      globeGrad.addColorStop(0.7, '#071526');
      globeGrad.addColorStop(1, '#020617');

      ctx.fillStyle = globeGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Latitude / Longitude lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.1)';
      ctx.lineWidth = 1;
      for (let i = -60; i <= 60; i += 30) {
        const latY = cy - (globeRadius * Math.sin((i * Math.PI) / 180));
        const rLat = globeRadius * Math.cos((i * Math.PI) / 180);
        ctx.beginPath();
        ctx.ellipse(cx, latY, rLat, rLat * 0.25, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 2. Projected Satellites & Inter-Satellite Laser Links (ISLs)
      const projected = satellites.map((s) => computeOrbitalCoordinate(s, orbitAngle, cx, cy, globeRadius));

      // Draw Laser Links
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          if (projected[i].visible && projected[j].visible) {
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw Satellite Nodes
      projected.forEach((p, idx) => {
        if (!p.visible) return;
        const sat = satellites[idx];
        const isSel = sat.id === selectedSat.id;

        ctx.fillStyle = isSel ? '#22c55e' : '#f59e0b';
        ctx.shadowColor = isSel ? '#22c55e' : '#f59e0b';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, isSel ? 6 : 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.font = 'bold 9px JetBrains Mono, monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(sat.id, p.x + 8, p.y + 3);
      });

      anim = requestAnimationFrame(render);
    };

    anim = requestAnimationFrame(render);
    return () => cancelAnimationFrame(anim);
  }, [isPlaying, satellites, selectedSat]);

  return (
    <div className="surface-1 rounded-2xl border border-[#2a2e39] p-6 text-[#f4f5f7] font-sans shadow-instrument flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2e39] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#22c55e]">
              EPOCH XIII // LEO SATELLITE MESH CONSTELLATION
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            550km LEO Orbit Constellation & Laser Crosslink Studio
          </h2>
          <p className="text-xs text-[#8e95a5]">
            Simulate dynamic optical Inter-Satellite Links (ISL), Doppler frequency shifts, and ground station tracking.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              isPlaying
                ? 'bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e]/30'
                : 'bg-[#1a1f2c] text-[#8e95a5] border-[#2a2e39]'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isPlaying ? 'Orbiting 7.59 km/s' : 'Paused'}</span>
          </button>
        </div>
      </div>

      {/* Grid Canvas + Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 h-[360px] rounded-xl bg-[#090d14] border border-[#1e293b] overflow-hidden relative">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-3 font-mono text-xs">
          <div className="p-4 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-2">
            <span className="text-white font-bold pb-2 border-b border-[#1e293b]">Selected Satellite Telemetry</span>
            <div className="flex flex-col gap-1.5 text-[11px] text-[#8e95a5]">
              <div>ID: <strong className="text-white">{selectedSat.id}</strong></div>
              <div>Altitude: <strong className="text-[#38bdf8]">{selectedSat.altitudeKm} km LEO</strong></div>
              <div>Velocity: <strong className="text-[#22c55e]">{selectedSat.velocityKmS} km/s</strong></div>
              <div>Doppler Shift: <strong className="text-amber-400">{selectedSat.dopplerShiftKhz} kHz</strong></div>
              <div>Active Optical ISLs: <strong className="text-white">{selectedSat.laserLinksActive} Laser Heads (100G)</strong></div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-2">
            <span className="text-white font-bold text-xs">Constellation Nodes:</span>
            <div className="flex flex-col gap-1">
              {satellites.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSat(s)}
                  className={`p-2 rounded text-left transition-all cursor-pointer flex items-center justify-between ${
                    selectedSat.id === s.id
                      ? 'bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/40 font-bold'
                      : 'bg-[#020617] text-[#8e95a5] hover:text-white'
                  }`}
                >
                  <span>{s.id}</span>
                  <span className="text-[10px] text-[#64748b]">Plane #{s.planeId}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

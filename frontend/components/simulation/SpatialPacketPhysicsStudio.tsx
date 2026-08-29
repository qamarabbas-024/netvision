'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Box, Play, Pause, RotateCw, Activity, ShieldAlert, Cpu } from 'lucide-react';
import { simulateBufferStep, PacketParticle, BufferQueueState } from '@/lib/spatialPacketPhysicsEngine';

export const SpatialPacketPhysicsStudio: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [queueState, setQueueState] = useState<BufferQueueState>({
    maxDepthPackets: 24,
    currentDepthPackets: 14,
    algorithm: 'FIFO_TAIL_DROP',
    droppedPackets: 48,
    avgLatencyUs: 1.4,
  });

  const particlesRef = useRef<PacketParticle[]>([]);

  useEffect(() => {
    let anim: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let tick = 0;

    const render = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      ctx.clearRect(0, 0, w, h);
      tick++;

      if (isPlaying && tick % 6 === 0) {
        particlesRef.current.push({
          id: Math.random(),
          x: -180,
          y: (Math.random() - 0.5) * 20,
          z: (Math.random() - 0.5) * 40,
          color: Math.random() > 0.3 ? '#22c55e' : '#38bdf8',
          size: 6,
          priority: 'NORMAL',
          status: 'QUEUED',
        });
      }

      if (isPlaying) {
        const res = simulateBufferStep(particlesRef.current, queueState);
        particlesRef.current = res.particles;
        setQueueState(res.queue);
      }

      const cx = w * 0.5;
      const cy = h * 0.5;

      // Draw Buffer Memory Tank Box
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(cx - 50, cy - 40, 100, 80);

      ctx.font = 'bold 9px JetBrains Mono, monospace';
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'center';
      ctx.fillText('SWITCH BUFFER MEMORY', cx, cy - 48);

      // Draw Particles
      particlesRef.current.forEach((p) => {
        ctx.fillStyle = p.status === 'DROPPED' ? '#ef4444' : p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(cx + p.x, cy + p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      anim = requestAnimationFrame(render);
    };

    anim = requestAnimationFrame(render);
    return () => cancelAnimationFrame(anim);
  }, [isPlaying, queueState]);

  return (
    <div className="surface-1 rounded-2xl border border-[#2a2e39] p-6 text-[#f4f5f7] font-sans shadow-instrument flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2e39] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#22c55e]">
              EPOCH XIII // SPATIAL PACKET PARTICLE DYNAMICS
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Switch Buffer Memory & Tail Drop Particle Physics Studio
          </h2>
          <p className="text-xs text-[#8e95a5]">
            Observe real-time packet particle collisions, FIFO queue depth saturation, and RED / Tail-Drop discards.
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
            <span>{isPlaying ? 'Running Physics' : 'Paused'}</span>
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="h-[280px] rounded-xl bg-[#090d14] border border-[#1e293b] overflow-hidden relative">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">QUEUE ALGORITHM</span>
          <strong className="text-white text-sm">{queueState.algorithm}</strong>
        </div>
        <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">BUFFER OCCUPANCY</span>
          <strong className="text-[#38bdf8] text-sm">{queueState.currentDepthPackets} / {queueState.maxDepthPackets} Pkts</strong>
        </div>
        <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">TAIL DROPS</span>
          <strong className="text-rose-400 text-sm">{queueState.droppedPackets} Discards</strong>
        </div>
        <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">SERIALIZATION LATENCY</span>
          <strong className="text-[#22c55e] text-sm">{queueState.avgLatencyUs} µs</strong>
        </div>
      </div>
    </div>
  );
};

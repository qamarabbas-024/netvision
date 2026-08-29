'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Eye, RotateCw, Play, Pause, Sparkles, Layers, Box, Compass } from 'lucide-react';
import { SAMPLE_SPATIAL_NODES, projectSpatial3D, SpatialHoloNode } from '@/lib/spatialWebXrEngine';

export const SpatialWebXrStudio: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes] = useState<SpatialHoloNode[]>(SAMPLE_SPATIAL_NODES);
  const [rotation, setRotation] = useState<{ x: number; y: number }>({ x: 25, y: -30 });
  const [isStereo, setIsStereo] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    let anim: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let angle = 0;

    const render = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      ctx.clearRect(0, 0, w, h);
      angle += 0.005;

      const drawViewport = (cx: number, cy: number, rotYOffset: number) => {
        // Holographic Spatial Coordinate Grid
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
        ctx.lineWidth = 1;
        for (let i = -200; i <= 200; i += 50) {
          const p1 = projectSpatial3D({ x: i, y: 150, z: -200 }, rotation.x, rotation.y + rotYOffset, cx, cy);
          const p2 = projectSpatial3D({ x: i, y: 150, z: 200 }, rotation.x, rotation.y + rotYOffset, cx, cy);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }

        // Links between Spine and Leaves
        const spine = nodes[0];
        const pSpine = projectSpatial3D(spine.position, rotation.x, rotation.y + rotYOffset, cx, cy);

        nodes.slice(1).forEach((node) => {
          const pNode = projectSpatial3D(node.position, rotation.x, rotation.y + rotYOffset, cx, cy);
          ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)';
          ctx.lineWidth = 2 * pNode.scale;
          ctx.beginPath();
          ctx.moveTo(pSpine.x, pSpine.y);
          ctx.lineTo(pNode.x, pNode.y);
          ctx.stroke();

          // Packet glow on spatial link
          const t = (Math.sin(angle * 4 + node.position.x) + 1) / 2;
          const px = pSpine.x + (pNode.x - pSpine.x) * t;
          const py = pSpine.y + (pNode.y - pSpine.y) * t;
          ctx.fillStyle = '#22c55e';
          ctx.beginPath();
          ctx.arc(px, py, 3 * pNode.scale, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw 3D Voxel Node Blocks
        nodes.forEach((node) => {
          const p = projectSpatial3D(node.position, rotation.x, rotation.y + rotYOffset, cx, cy);
          const size = 18 * p.scale;

          ctx.fillStyle = node.color;
          ctx.shadowColor = node.color;
          ctx.shadowBlur = 12;
          ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
          ctx.shadowBlur = 0;

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.strokeRect(p.x - size / 2, p.y - size / 2, size, size);

          ctx.font = 'bold 9px JetBrains Mono, monospace';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.fillText(node.label, p.x, p.y + size + 10);
        });
      };

      if (isStereo) {
        drawViewport(w * 0.25, h * 0.5, -2);
        drawViewport(w * 0.75, h * 0.5, 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.moveTo(w * 0.5, 0);
        ctx.lineTo(w * 0.5, h);
        ctx.stroke();
      } else {
        drawViewport(w * 0.5, h * 0.5, 0);
      }

      anim = requestAnimationFrame(render);
    };

    anim = requestAnimationFrame(render);
    return () => cancelAnimationFrame(anim);
  }, [rotation, isStereo, nodes]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setRotation((prev) => ({
      x: Math.max(-60, Math.min(60, prev.x + dy * 0.3)),
      y: (prev.y + dx * 0.3) % 360,
    }));
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  return (
    <div className="surface-1 rounded-2xl border border-[#2a2e39] p-6 text-[#f4f5f7] font-sans shadow-instrument flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2e39] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#22c55e]">
              EPOCH XIII // SPATIAL WEBXR & HOLOGRAPHIC 3D
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            WebXR Spatial Holographic Network Immersion Studio
          </h2>
          <p className="text-xs text-[#8e95a5]">
            Experience volumetric 6DoF spatial network topology modeling with stereoscopic VR viewport rendering.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => setIsStereo(!isStereo)}
            className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              isStereo
                ? 'bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e]/30'
                : 'bg-[#1a1f2c] text-[#8e95a5] border-[#2a2e39]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isStereo ? 'Stereoscopic Dual-Eye (VR)' : 'Monoscopic 3D'}</span>
          </button>
        </div>
      </div>

      {/* 3D Spatial Canvas */}
      <div
        className="relative w-full h-[380px] rounded-xl bg-[#090d14] border border-[#1e293b] overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />

        <div className="absolute bottom-3 left-3 font-mono text-[10px] text-[#64748b] bg-[#020617]/80 px-2 py-1 rounded border border-[#1e293b]">
          ROTATION: X={rotation.x.toFixed(1)}° Y={rotation.y.toFixed(1)}° | 6DoF SPATIAL CAMERA
        </div>
      </div>
    </div>
  );
};

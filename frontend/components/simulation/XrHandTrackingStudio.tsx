'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Hand, Play, Pause, RotateCw, Activity, Sparkles, Check, Radio } from 'lucide-react';
import { detectSpatialGesture, DetectedGesture } from '@/lib/xrHandTrackingEngine';

export const XrHandTrackingStudio: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pinchDist, setPinchDist] = useState<number>(45);
  const [gesture, setGesture] = useState<DetectedGesture>(detectSpatialGesture(45));

  const handlePinchChange = (dist: number) => {
    setPinchDist(dist);
    setGesture(detectSpatialGesture(dist));
  };

  useEffect(() => {
    let anim: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let t = 0;

    const render = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      ctx.clearRect(0, 0, w, h);
      t += 0.02;

      const cx = w * 0.5;
      const cy = h * 0.5;

      // Draw Virtual 3D Network Node
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.fillRect(cx - 30, cy - 30, 60, 60);
      ctx.shadowBlur = 0;

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - 30, cy - 30, 60, 60);

      ctx.font = 'bold 9px JetBrains Mono, monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('CORE ROUTER', cx, cy + 50);

      // Draw Hand Tracking Skeleton & Fingertip Dots
      const thumbX = cx - pinchDist / 2;
      const thumbY = cy - 40;
      const indexX = cx + pinchDist / 2;
      const indexY = cy - 40;

      // Thumb
      ctx.fillStyle = gesture.pinching ? '#22c55e' : '#f59e0b';
      ctx.beginPath();
      ctx.arc(thumbX, thumbY, 8, 0, Math.PI * 2);
      ctx.fill();

      // Index
      ctx.beginPath();
      ctx.arc(indexX, indexY, 8, 0, Math.PI * 2);
      ctx.fill();

      // Laser pinch beam if pinching
      if (gesture.pinching) {
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(thumbX, thumbY);
        ctx.lineTo(cx, cy);
        ctx.moveTo(indexX, indexY);
        ctx.lineTo(cx, cy);
        ctx.stroke();

        ctx.font = 'bold 11px JetBrains Mono, monospace';
        ctx.fillStyle = '#22c55e';
        ctx.fillText('PINCH CONNECT ESTABLISHED', cx, cy - 70);
      }

      anim = requestAnimationFrame(render);
    };

    anim = requestAnimationFrame(render);
    return () => cancelAnimationFrame(anim);
  }, [pinchDist, gesture]);

  return (
    <div className="surface-1 rounded-2xl border border-[#2a2e39] p-6 text-[#f4f5f7] font-sans shadow-instrument flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2e39] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#22c55e]">
              EPOCH XIII // SPATIAL GESTURE & HAND TRACKING
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            WebXR 25-Joint Hand Tracking & Spatial Pinch Studio
          </h2>
          <p className="text-xs text-[#8e95a5]">
            Interact with 3D routers and draw virtual fiber cables in mid-air using spatial pinch and grab gestures.
          </p>
        </div>
      </div>

      {/* 3D Hand Canvas */}
      <div className="h-[280px] rounded-xl bg-[#090d14] border border-[#1e293b] overflow-hidden relative">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Interactive Pinch Slider */}
      <div className="p-4 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">FINGERTIP PINCH DISTANCE: {pinchDist}mm</span>
          <input
            type="range"
            min="10"
            max="80"
            value={pinchDist}
            onChange={(e) => handlePinchChange(Number(e.target.value))}
            className="w-48 accent-[#22c55e]"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[#64748b]">RECOGNIZED GESTURE:</span>
          <span
            className={`px-3 py-1.5 rounded-lg font-bold ${
              gesture.pinching
                ? 'bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/40'
                : 'bg-[#1e293b] text-[#8e95a5]'
            }`}
          >
            {gesture.type} ({(gesture.confidence * 100).toFixed(0)}%)
          </span>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Share2, Play, RotateCcw, Activity, ShieldCheck, Users } from 'lucide-react';
import { createP2PMesh, propagateGossipStep, PeerNode } from '@/lib/p2pGossipMeshEngine';

export const P2pGossipMeshStudio: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<PeerNode[]>(createP2PMesh(8));
  const [rounds, setRounds] = useState<number>(0);

  const handleStep = () => {
    setNodes((prev) => propagateGossipStep(prev));
    setRounds((r) => r + 1);
  };

  const handleReset = () => {
    setNodes(createP2PMesh(8));
    setRounds(0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    ctx.clearRect(0, 0, w, h);
    const cx = w * 0.5;
    const cy = h * 0.5;

    // Draw Peer Links
    nodes.forEach((node) => {
      node.peers.forEach((peerId) => {
        const target = nodes.find((n) => n.id === peerId);
        if (target) {
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx + node.x, cy + node.y);
          ctx.lineTo(cx + target.x, cy + target.y);
          ctx.stroke();
        }
      });
    });

    // Draw Peer Nodes
    nodes.forEach((node) => {
      ctx.fillStyle = node.infected ? '#22c55e' : '#64748b';
      ctx.shadowColor = node.infected ? '#22c55e' : 'transparent';
      ctx.shadowBlur = node.infected ? 10 : 0;
      ctx.beginPath();
      ctx.arc(cx + node.x, cy + node.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.font = 'bold 9px JetBrains Mono, monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(node.id, cx + node.x, cy + node.y + 18);
    });
  }, [nodes]);

  const infectedCount = nodes.filter((n) => n.infected).length;

  return (
    <div className="surface-1 rounded-2xl border border-[#2a2e39] p-6 text-[#f4f5f7] font-sans shadow-instrument flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2e39] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#22c55e]">
              EPOCH XV // WASM P2P GOSSIP PROTOCOL
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Epidemic Gossip Broadcast & Anti-Entropy Synchronization Studio
          </h2>
          <p className="text-xs text-[#8e95a5]">
            Model sub-second distributed ledger and consensus state propagation over peer-to-peer overlay graphs.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg bg-[#1a1f2c] border border-[#2a2e39] hover:text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer text-[#8e95a5]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={handleStep}
            className="px-4 py-2 rounded-lg bg-[#22c55e] text-[#062817] hover:bg-[#16a34a] font-bold flex items-center gap-2 cursor-pointer transition-all shadow-sm"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Propagate Gossip Round #{rounds + 1}</span>
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="h-[280px] rounded-xl bg-[#090d14] border border-[#1e293b] overflow-hidden relative">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">PROPAGATION ROUNDS</span>
          <strong className="text-white text-sm">{rounds} Epochs</strong>
        </div>
        <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">SYNCHRONIZED NODES</span>
          <strong className="text-[#22c55e] text-sm">{infectedCount} / {nodes.length} Synchronized ({(infectedCount / nodes.length * 100).toFixed(0)}%)</strong>
        </div>
        <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">OVERLAY FANOUT FACTOR</span>
          <strong className="text-[#38bdf8] text-sm">k = 2 Peers per Hop</strong>
        </div>
      </div>
    </div>
  );
};

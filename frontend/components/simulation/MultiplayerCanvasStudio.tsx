'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  MousePointer,
  Zap,
  Activity,
  Layers,
  Sparkles,
  Server,
  Shield,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  MultiplayerCanvasEngine,
  PeerUser,
  SharedCanvasNode,
  SharedCanvasLink,
} from '@/lib/multiplayerCanvasEngine';
import { SoundFx } from '@/lib/soundFx';

export const MultiplayerCanvasStudio: React.FC = () => {
  const [peers, setPeers] = useState<PeerUser[]>(() => MultiplayerCanvasEngine.getInitialPeers());
  const [nodes, setNodes] = useState<SharedCanvasNode[]>(() => MultiplayerCanvasEngine.getInitialNodes());
  const [links] = useState<SharedCanvasLink[]>(() => MultiplayerCanvasEngine.getInitialLinks());
  const [isCollaborating, setIsCollaborating] = useState<boolean>(true);
  const [peerBroadcastMsg, setPeerBroadcastMsg] = useState<string | null>(null);

  // Simulated peer cursor movement
  useEffect(() => {
    if (!isCollaborating) return;
    const interval = setInterval(() => {
      setPeers((prev) =>
        prev.map((peer) => ({
          ...peer,
          cursor: {
            x: Math.max(50, Math.min(650, peer.cursor.x + (Math.random() * 40 - 20))),
            y: Math.max(50, Math.min(380, peer.cursor.y + (Math.random() * 30 - 15))),
          },
        }))
      );
    }, 800);
    return () => clearInterval(interval);
  }, [isCollaborating]);

  const handleBroadcastPacket = () => {
    SoundFx.playPacketDispatch();
    setPeerBroadcastMsg('Sarah Chen dispatched a 100G ICMP packet trace across Spine-Core-01 -> Leaf-Switch-01.');
    setTimeout(() => {
      SoundFx.playSuccessChime();
    }, 400);
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setPeers(MultiplayerCanvasEngine.getInitialPeers());
    setNodes(MultiplayerCanvasEngine.getInitialNodes());
    setPeerBroadcastMsg(null);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00f0ff]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
                Version 6.1 Multiplayer Canvas
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                WebRTC P2P Room #NET-ALPHA
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Real-Time Collaborative Network Topology & Peer Presence
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleBroadcastPacket}
            leftIcon={<Zap className="w-3.5 h-3.5" />}
          >
            Broadcast Peer Packet Trace
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset Room
          </Button>
        </div>
      </div>

      {/* Main Grid: Interactive Multi-User Canvas (Left) & Active Peers (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 8 Cols: Shared Canvas */}
        <div className="lg:col-span-8 p-6 bg-[#0c0e17] relative min-h-[420px] overflow-hidden flex flex-col justify-between">
          {/* Top Info Bar */}
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-mono text-zinc-400 uppercase font-bold flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#00f0ff]" /> Shared Multi-User Topology Canvas
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              WebRTC DataChannel 12ms
            </span>
          </div>

          {/* SVG Links */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {links.map((link) => {
              const src = nodes.find((n) => n.id === link.sourceId);
              const tgt = nodes.find((n) => n.id === link.targetId);
              if (!src || !tgt) return null;
              return (
                <line
                  key={link.id}
                  x1={src.x + 40}
                  y1={src.y + 25}
                  x2={tgt.x + 40}
                  y2={tgt.y + 25}
                  stroke="#262c42"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              );
            })}
          </svg>

          {/* Nodes */}
          <div className="relative z-10 w-full h-full my-auto">
            {nodes.map((node) => (
              <div
                key={node.id}
                style={{ left: `${node.x}px`, top: `${node.y}px` }}
                className="absolute p-3 rounded-2xl bg-[#121522] border border-[#262c42] hover:border-[#00f0ff] cursor-pointer shadow-lg transition-all flex items-center gap-2"
              >
                {node.type === 'ROUTER' && <Server className="w-4 h-4 text-[#00f0ff]" />}
                {node.type === 'SWITCH' && <Layers className="w-4 h-4 text-indigo-400" />}
                {node.type === 'FIREWALL' && <Shield className="w-4 h-4 text-rose-400" />}
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white font-mono">{node.name}</span>
                  <span className="text-[9px] font-mono text-zinc-400">{node.type}</span>
                </div>
              </div>
            ))}

            {/* Peer Cursors */}
            {peers.map((peer) => (
              <div
                key={peer.id}
                style={{
                  left: `${peer.cursor.x}px`,
                  top: `${peer.cursor.y}px`,
                  transition: 'left 0.7s ease, top 0.7s ease',
                }}
                className="absolute pointer-events-none z-30 flex flex-col items-start"
              >
                <MousePointer className="w-4 h-4" style={{ color: peer.color, fill: peer.color }} />
                <span
                  style={{ backgroundColor: peer.color }}
                  className="text-[9px] font-mono font-bold text-black px-1.5 py-0.5 rounded shadow-md mt-0.5"
                >
                  {peer.name}
                </span>
              </div>
            ))}
          </div>

          {/* Broadcast Message Bar */}
          {peerBroadcastMsg && (
            <div className="z-10 p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300 animate-in fade-in">
              ⚡ {peerBroadcastMsg}
            </div>
          )}
        </div>

        {/* Right 4 Cols: Active Room Peers */}
        <div className="lg:col-span-4 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" /> Active Room Collaborators ({peers.length + 1})
            </span>
          </div>

          {/* Peer List */}
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/40 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-bold text-white">You (Local Session)</span>
              </div>
              <span className="text-[10px] text-cyan-300">CONNECTED</span>
            </div>

            {peers.map((peer) => (
              <div
                key={peer.id}
                className="p-3 rounded-xl bg-[#121522] border border-[#262c42] flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: peer.color }} />
                  <span className="font-bold text-zinc-300">{peer.name}</span>
                </div>
                <span className="text-[9px] text-zinc-500 font-mono">{peer.role}</span>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> P2P Collaboration Features
            </div>
            <div>• Sub-15ms WebRTC peer cursor presence</div>
            <div>• Real-time distributed state lock avoiding race conditions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

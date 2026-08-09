'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, FastForward, CheckCircle2, Laptop, Server, Router, Network, Shield, Globe, HardDrive } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export interface VisualNode {
  id: string;
  label: string;
  sublabel?: string;
  type: 'client' | 'server' | 'router' | 'switch' | 'firewall' | 'cloud' | 'dns';
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  ip?: string;
  mac?: string;
}

export interface VisualConnection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  label?: string;
}

export interface PacketHeader {
  srcIp?: string;
  dstIp?: string;
  srcPort?: number;
  dstPort?: number;
  seqNumber?: number;
  ackNumber?: number;
  flags?: string[];
  protocol?: string;
}

export interface VisualEvent {
  stepIndex: number;
  title: string;
  description: string;
  fromNodeId: string;
  toNodeId: string;
  packetLabel: string;
  packetColor?: string; // hex or tailwind class
  activeNodeId?: string;
  packetHeader?: PacketHeader;
}

export interface NetworkVisualEngineProps {
  title: string;
  concept: string;
  nodes: VisualNode[];
  connections: VisualConnection[];
  events: VisualEvent[];
}

export const NetworkVisualEngine: React.FC<NetworkVisualEngineProps> = ({
  title,
  concept,
  nodes,
  connections,
  events,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 0.5, 1, 1.5, 2
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeEvent = events[currentStep] || events[0];

  // Playback timer handling
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = 2500 / playbackSpeed;
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= events.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, events.length]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.min(events.length - 1, prev + 1));
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const renderNodeIcon = (type: VisualNode['type']) => {
    switch (type) {
      case 'client':
        return <Laptop className="w-5 h-5 sm:w-6 sm:h-6 text-[#00f0ff]" />;
      case 'server':
        return <Server className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />;
      case 'router':
        return <Router className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />;
      case 'switch':
        return <Network className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />;
      case 'firewall':
        return <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400" />;
      case 'dns':
        return <HardDrive className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />;
      default:
        return <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />;
    }
  };

  // Locate positions of active packet source & target nodes
  const fromNode = nodes.find((n) => n.id === activeEvent.fromNodeId) || nodes[0];
  const toNode = nodes.find((n) => n.id === activeEvent.toNodeId) || nodes[nodes.length - 1];

  return (
    <Card className="p-5 sm:p-6 glass-panel border-[#272732] bg-[#121217] flex flex-col gap-5 sm:gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#272732] pb-4">
        <div>
          <span className="text-[10px] font-mono text-[#00f0ff] uppercase tracking-widest font-semibold block mb-1">
            Visual Telemetry Engine • {concept}
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">{title}</h3>
        </div>

        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-2 max-w-full">
          {/* Step Controls */}
          <div className="flex items-center gap-1 bg-[#09090b] p-1 rounded-xl border border-zinc-800">
            <button
              onClick={handleStepBackward}
              disabled={currentStep === 0}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Step Backward"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-2.5 py-1 rounded-lg bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button
              onClick={handleStepForward}
              disabled={currentStep === events.length - 1}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Step Forward"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Reset Timeline"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Speed Control */}
          <div className="flex items-center gap-1 bg-[#09090b] p-1 rounded-xl border border-zinc-800 overflow-x-auto max-w-full">
            <FastForward className="w-3.5 h-3.5 text-zinc-500 ml-1.5 shrink-0" />
            {[0.5, 1, 1.5, 2].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-1.5 sm:px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition-all shrink-0 ${
                  playbackSpeed === spd
                    ? 'bg-[#00f0ff] text-black shadow-glow-cyan'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Canvas Viewport Box */}
      <div className="relative w-full h-64 sm:h-80 bg-[#09090b] rounded-2xl border border-zinc-800 p-2 sm:p-4 overflow-hidden flex flex-col justify-between">
        {/* Connection Lines (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {connections.map((conn) => {
            const f = nodes.find((n) => n.id === conn.fromNodeId);
            const t = nodes.find((n) => n.id === conn.toNodeId);
            if (!f || !t) return null;
            return (
              <line
                key={conn.id}
                x1={`${f.x}%`}
                y1={`${f.y}%`}
                x2={`${t.x}%`}
                y2={`${t.y}%`}
                stroke="#272732"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            );
          })}
        </svg>

        {/* Nodes Placement */}
        {nodes.map((node) => {
          const isActive =
            node.id === activeEvent.activeNodeId ||
            node.id === activeEvent.fromNodeId ||
            node.id === activeEvent.toNodeId;

          return (
            <div
              key={node.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-10 transition-all duration-300"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <div
                className={`w-9 h-9 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-[#121217] border-2 border-[#00f0ff] shadow-glow-cyan scale-105'
                    : 'bg-[#121217] border border-zinc-800 opacity-80'
                }`}
              >
                {renderNodeIcon(node.type)}
              </div>
              <div className="text-center max-w-[70px] sm:max-w-[120px]">
                <span className="text-[10px] sm:text-xs font-bold text-white block font-mono truncate">{node.label}</span>
                {node.ip && <span className="text-[9px] sm:text-[10px] font-mono text-zinc-400 block truncate">{node.ip}</span>}
              </div>
            </div>
          );
        })}

        {/* Dynamic Packet Indicator Travelling Between Nodes */}
        {fromNode && toNode && fromNode.id !== toNode.id && (
          <div
            key={`pkt-${currentStep}`}
            className="absolute z-20 transition-all ease-in-out duration-1000 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
            style={{
              left: `${(fromNode.x + toNode.x) / 2}%`,
              top: `${(fromNode.y + toNode.y) / 2}%`,
            }}
          >
            <div className="px-2.5 py-1 rounded-full bg-[#00f0ff] text-black font-mono text-[10px] font-extrabold shadow-glow-cyan flex items-center gap-1 animate-pulse">
              <span>{activeEvent.packetLabel}</span>
            </div>
          </div>
        )}

        {/* Step Indicator Pill */}
        <div className="z-10 self-start">
          <Badge variant="cyan" className="font-mono text-[11px]">
            Step {currentStep + 1} of {events.length}
          </Badge>
        </div>
      </div>

      {/* Active Step Explanation Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#09090b] border border-zinc-800/80 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00f0ff]" /> {activeEvent.title}
          </h4>
          <span className="text-xs font-mono text-zinc-500">
            {fromNode.label} ➔ {toNode.label}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">
          {activeEvent.description}
        </p>

        {/* Packet Header Inspector */}
        {activeEvent.packetHeader && (
          <div className="mt-1 p-3 rounded-xl bg-[#121217] border border-zinc-800 font-mono text-xs grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block">Source Socket</span>
              <span className="text-zinc-200 font-bold">{activeEvent.packetHeader.srcIp}:{activeEvent.packetHeader.srcPort}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block">Destination Socket</span>
              <span className="text-zinc-200 font-bold">{activeEvent.packetHeader.dstIp}:{activeEvent.packetHeader.dstPort}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block">Seq / Ack Number</span>
              <span className="text-[#00f0ff] font-bold">Seq={activeEvent.packetHeader.seqNumber ?? 0} | Ack={activeEvent.packetHeader.ackNumber ?? 0}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block">Control Flags</span>
              <span className="text-emerald-400 font-bold">{(activeEvent.packetHeader.flags || []).join(', ') || 'NONE'}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

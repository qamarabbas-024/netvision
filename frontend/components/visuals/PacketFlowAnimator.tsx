'use client';

import React, { useState, useEffect } from 'react';
import type { 
  VisualPacketEvent, 
  VisualPacketHop, 
  PacketForwardingAction 
} from '@netvision/shared';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Radio, 
  Activity, 
  Info 
} from 'lucide-react';

export interface PacketFlowAnimatorProps {
  packetEvents: VisualPacketEvent[];
  className?: string;
}

export const PacketFlowAnimator: React.FC<PacketFlowAnimatorProps> = ({
  packetEvents,
  className = '',
}) => {
  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(0);
  const [currentHopIndex, setCurrentHopIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1000); // ms per hop

  const activeEvent: VisualPacketEvent | undefined = packetEvents[selectedEventIndex];
  const hops: VisualPacketHop[] = activeEvent?.hops || [];

  useEffect(() => {
    setCurrentHopIndex(0);
    setIsPlaying(false);
  }, [selectedEventIndex, packetEvents]);

  useEffect(() => {
    if (!isPlaying || hops.length === 0) return;

    const timer = setInterval(() => {
      setCurrentHopIndex((prev) => {
        if (prev >= hops.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, playbackSpeed);

    return () => clearInterval(timer);
  }, [isPlaying, hops.length, playbackSpeed]);

  if (!packetEvents || packetEvents.length === 0) {
    return (
      <Card className={`glass-panel border-zinc-800 p-4 text-xs text-zinc-400 font-mono flex items-center justify-between ${className}`}>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-zinc-500" />
          <span>No packet traversal events recorded for the last executed command.</span>
        </div>
        <span className="text-[10px] text-zinc-600">Idle Bus</span>
      </Card>
    );
  }

  const currentHop: VisualPacketHop | undefined = hops[currentHopIndex];
  const isDelivered = activeEvent?.outcome === 'DELIVERED';

  const isDropAction = (action?: PacketForwardingAction) => 
    action === 'drop' || action === 'filter_deny';

  return (
    <Card className={`glass-panel border-[#00f0ff]/30 p-4 sm:p-5 flex flex-col gap-4 ${className}`}>
      {/* 1. Header with Packet Selector & Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#272732] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[#00f0ff]">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
              Authoritative Packet Flow Engine
              <Badge 
                variant={isDelivered ? 'emerald' : 'rose'} 
                className="text-[10px] py-0 px-1.5 font-mono"
              >
                {activeEvent?.outcome}
              </Badge>
            </h3>
            <p className="text-[11px] text-zinc-400">
              Protocol: <span className="text-cyan-300 font-mono font-bold">{activeEvent?.protocol}</span> ({activeEvent?.sourceNodeId} → {activeEvent?.targetNodeId})
            </p>
          </div>
        </div>

        {packetEvents.length > 1 && (
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-mono text-zinc-500 mr-1">Packet:</span>
            {packetEvents.map((ev, idx) => (
              <button
                key={ev.eventId}
                onClick={() => setSelectedEventIndex(idx)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-colors ${
                  idx === selectedEventIndex
                    ? 'bg-cyan-500/20 text-[#00f0ff] border-cyan-500/40 font-bold'
                    : 'bg-black/30 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
              >
                #{idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Hop Progress Stepper */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
          <span>
            Hop {hops.length > 0 ? currentHopIndex + 1 : 0} of {hops.length}
          </span>
          <span className="text-zinc-500 text-[11px]">
            Command: {activeEvent?.command}
          </span>
        </div>

        {/* Stepper Timeline */}
        <div className="relative flex items-center justify-between w-full py-2">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-800 -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-cyan-500 to-emerald-500 -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: hops.length > 1 ? `${(currentHopIndex / (hops.length - 1)) * 100}%` : '100%' }}
          />

          {hops.map((hop: VisualPacketHop, idx: number) => {
            const isCompleted = idx <= currentHopIndex;
            const isCurrent = idx === currentHopIndex;
            const dropped = isDropAction(hop.action);

            return (
              <button
                key={idx}
                onClick={() => setCurrentHopIndex(idx)}
                className="relative z-10 flex flex-col items-center group focus:outline-none"
                aria-label={`Jump to hop ${idx + 1}: node ${hop.toNodeId}, action ${hop.action}`}
              >
                <div 
                  className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                    isCurrent
                      ? dropped 
                        ? 'bg-rose-950 border-rose-400 text-rose-300 scale-110 shadow-[0_0_12px_rgba(244,63,94,0.6)]'
                        : 'bg-cyan-950 border-[#00f0ff] text-[#00f0ff] scale-110 shadow-[0_0_12px_rgba(0,240,255,0.6)]'
                      : isCompleted
                        ? dropped
                          ? 'bg-rose-950/80 border-rose-600 text-rose-400'
                          : 'bg-emerald-950/80 border-emerald-500 text-emerald-400'
                        : 'bg-black border-zinc-700 text-zinc-500 hover:border-zinc-500'
                  }`}
                >
                  {dropped ? (
                    <XCircle className="w-3.5 h-3.5" />
                  ) : idx === hops.length - 1 && isDelivered ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <span className="text-[10px] font-mono font-bold">{idx + 1}</span>
                  )}
                </div>
                <span className={`text-[10px] font-mono mt-1 transition-colors ${
                  isCurrent ? 'text-[#00f0ff] font-bold' : isCompleted ? 'text-zinc-300' : 'text-zinc-600'
                }`}>
                  {hop.toNodeId}
                </span>
                <span className={`text-[8px] font-mono uppercase font-bold tracking-wider px-1 rounded ${
                  dropped
                    ? 'text-rose-400 bg-rose-950/60 border border-rose-800/60'
                    : isCurrent
                      ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-800/60'
                      : isCompleted
                        ? 'text-emerald-400 bg-emerald-950/60'
                        : 'text-zinc-500'
                }`}>
                  {dropped ? 'DROP' : idx === hops.length - 1 && isDelivered ? 'DELIV' : hop.action === 'translate' ? 'NAT' : 'FWD'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Detailed Hop Inspector Card */}
      {currentHop && (
        <div 
          className={`rounded-xl border p-4 flex flex-col gap-2.5 animate-in fade-in duration-200 ${
            isDropAction(currentHop.action)
              ? 'bg-rose-950/20 border-rose-500/40'
              : currentHop.action === 'translate'
                ? 'bg-purple-950/20 border-purple-500/40'
                : 'bg-black/40 border-zinc-800'
          }`}
          role="region"
          aria-label={`Detailed packet state at hop ${currentHopIndex + 1} on device ${currentHop.toNodeId}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                Traversal: <span className="text-zinc-400">{currentHop.fromNodeId}</span> → <span className="text-cyan-300">{currentHop.toNodeId}</span>
              </span>
              <Badge 
                variant={
                  currentHop.action === 'forward' || currentHop.action === 'deliver' || currentHop.action === 'echo_reply' ? 'emerald' :
                  isDropAction(currentHop.action) ? 'rose' :
                  currentHop.action === 'translate' ? 'purple' : 'cyan'
                }
                className="text-[10px] py-0 px-1.5 font-mono font-bold uppercase"
              >
                {currentHop.action}
              </Badge>
            </div>

            {currentHop.terminationReason && (
              <span className="text-rose-400 font-mono text-xs flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> {currentHop.terminationReason}
              </span>
            )}
          </div>

          <p className="text-xs text-zinc-200 leading-relaxed font-sans">
            {currentHop.detail}
          </p>

          {/* Header Metadata Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
            <div className="bg-black/60 rounded p-2 border border-zinc-800/80">
              <span className="text-zinc-500 block text-[10px]">Source IP:</span>
              <span className="text-zinc-200 font-bold">{currentHop.packetHeader?.srcIp}</span>
            </div>
            <div className="bg-black/60 rounded p-2 border border-zinc-800/80">
              <span className="text-zinc-500 block text-[10px]">Dest IP:</span>
              <span className="text-zinc-200 font-bold">{currentHop.packetHeader?.dstIp}</span>
            </div>
            <div className="bg-black/60 rounded p-2 border border-zinc-800/80">
              <span className="text-zinc-500 block text-[10px]">Packet TTL:</span>
              <span className="text-zinc-200 font-bold">{currentHop.packetHeader?.ttl ?? 64}</span>
            </div>
            <div className="bg-black/60 rounded p-2 border border-zinc-800/80">
              <span className="text-zinc-500 block text-[10px]">
                {currentHop.packetHeader?.translatedSrcIp ? 'NAT Translated IP:' : 'Device Type:'}
              </span>
              <span className={currentHop.packetHeader?.translatedSrcIp ? 'text-purple-300 font-bold' : 'text-zinc-200 font-bold'}>
                {currentHop.packetHeader?.translatedSrcIp || currentHop.deviceType}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Playback Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#272732] pt-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-[#00f0ff] border border-cyan-500/30 transition-colors"
            aria-label={isPlaying ? 'Pause packet animation' : 'Play packet animation'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentHopIndex((prev) => Math.min(hops.length - 1, prev + 1));
            }}
            disabled={currentHopIndex >= hops.length - 1}
            className="p-2 rounded-lg bg-black/40 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 disabled:opacity-40 transition-colors"
            aria-label="Step forward one hop"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentHopIndex(0);
            }}
            className="p-2 rounded-lg bg-black/40 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
            aria-label="Reset packet flow to beginning"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400">
          <span className="text-zinc-500">Speed:</span>
          {[
            { label: '0.5x', ms: 1500 },
            { label: '1x', ms: 1000 },
            { label: '2x', ms: 500 },
          ].map((s) => (
            <button
              key={s.label}
              onClick={() => setPlaybackSpeed(s.ms)}
              className={`px-2 py-0.5 rounded border ${
                playbackSpeed === s.ms 
                  ? 'bg-cyan-500/20 text-[#00f0ff] border-cyan-500/40 font-bold' 
                  : 'bg-black/30 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Accessibility Screen Reader Textual Narrative */}
      <div 
        className="rounded-lg bg-zinc-950/80 border border-zinc-900 p-3 text-xs text-zinc-400 space-y-1"
        aria-live="polite"
      >
        <div className="flex items-center gap-1.5 font-mono text-zinc-300 text-[11px] font-semibold">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Packet Provenance Summary (Screen Reader & Text Mode):</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Command: {activeEvent?.command} (Overall Result: {activeEvent?.outcome}).
        </p>
        <ol className="list-decimal list-inside space-y-1 text-[11px]">
          {hops.map((h: VisualPacketHop, i: number) => (
            <li key={i} className={i === currentHopIndex ? 'text-cyan-300 font-bold' : 'text-zinc-400'}>
              Hop {i + 1}: {h.fromNodeId} → {h.toNodeId} ({h.deviceType}): action {h.action}. {h.detail}
              {h.terminationReason ? ` [${h.terminationReason}]` : ''}
              {h.packetHeader?.translatedSrcIp ? ` (Translated source IP: ${h.packetHeader.translatedSrcIp})` : ''}.
            </li>
          ))}
        </ol>
      </div>
    </Card>
  );
};

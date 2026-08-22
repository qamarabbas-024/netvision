'use client';

import React, { useState } from 'react';
import { Laptop, Router, Server, ArrowRight, Play, RotateCcw, Box, Layers, CheckCircle2 } from 'lucide-react';
import { Interactive3DPacketJourney } from '../simulation/Interactive3DPacketJourney';

export const PacketJourneyVisual: React.FC = () => {
  const [viewMode, setViewMode] = useState<'3d' | 'guided'>('3d');
  const [nodeStep, setNodeStep] = useState<number>(0);

  const journeySteps = [
    {
      title: '1. Application Request (Host A)',
      node: 'Host A (192.168.1.50)',
      action: 'Constructs HTTPS GET Request. Encapsulates in TCP Segment (Port 443) ➔ IP Packet (93.184.216.34, TTL=64) ➔ Ethernet Frame targeting Gateway Router MAC.',
      layerInfo: 'Dst MAC: Gateway Router MAC | Dst IP: 93.184.216.34 | Dst Port: 443 (HTTPS)',
    },
    {
      title: '2. L2 Access Switch Forwarding',
      node: 'Access Switch (Layer 2)',
      action: 'Inspects Destination MAC address. Checks CAM (MAC address) table and forwards frame directly out of Gigabit port 2 without modifying IP or TCP headers.',
      layerInfo: 'Layer 2 Switching: CAM table lookup ➔ Forward to Default Gateway port',
    },
    {
      title: '3. Layer 3 Default Gateway Routing',
      node: 'Gateway Router (192.168.1.1)',
      action: 'Strips incoming L2 MAC header. Decrements TTL (64 ➔ 63). Performs Longest Prefix Match (LPM) routing table lookup. Re-encapsulates frame with WAN egress MAC.',
      layerInfo: 'Layer 3 Routing: TTL Decrement (-1), Checksum Recalculation, Egress MAC Re-encapsulation',
    },
    {
      title: '4. Stateful Edge Firewall Inspection',
      node: 'Stateful Firewall (10.0.0.1)',
      action: 'Inspects 4-tuple socket state. Validates TCP SYN flag against security ACL. Opens dynamic return pinhole and forwards packet into server DMZ.',
      layerInfo: 'Stateful Inspection: Permitted outbound TCP flow on Port 443 ➔ Pinhole created',
    },
    {
      title: '5. Destination Delivery (Web Server)',
      node: 'Web Server (93.184.216.34)',
      action: 'Receives frame, validates TCP checksum, decapsulates IP/TCP headers, and delivers HTTP payload to Port 443 web process. Generates TCP SYN-ACK / HTTP 200 OK response!',
      layerInfo: 'Destination Delivery: HTTP 200 OK Response generated & returned',
    },
  ];

  const current = journeySteps[nodeStep];

  return (
    <div className="flex flex-col gap-4">
      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-between gap-3 bg-[#121217] p-1.5 rounded-2xl border border-[#272732]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('3d')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === '3d'
                ? 'bg-[#00f0ff] text-black shadow-glow-cyan'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Interactive Canvas</span>
          </button>

          <button
            onClick={() => setViewMode('guided')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'guided'
                ? 'bg-[#00f0ff] text-black shadow-glow-cyan'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Step-by-Step Guided Explorer</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline px-3">
          {viewMode === '3d' ? '3D WebGL Multi-Node Engine' : '5-Hop OSI Traversal Engine'}
        </span>
      </div>

      {/* Render 3D Canvas or Guided Explorer */}
      {viewMode === '3d' ? (
        <Interactive3DPacketJourney />
      ) : (
        <div className="p-4 sm:p-6 rounded-2xl glass-panel border border-[#272732] flex flex-col gap-5 sm:gap-6">
          <div className="flex items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-wider font-semibold block mb-1">
                End-to-End Packet Traversal
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">Step-by-Step Packet Journey</h3>
            </div>

            <button
              onClick={() => setNodeStep(0)}
              className="p-2 rounded-xl bg-[#121217] border border-[#272732] text-zinc-400 hover:text-white transition-colors shrink-0"
              title="Reset Journey"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 sm:p-6 rounded-xl bg-[#09090b] border border-[#272732] flex flex-col gap-4 sm:gap-6">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 text-center">
              <div className={`p-2.5 sm:p-3 rounded-xl border flex flex-col items-center gap-1 ${nodeStep === 0 ? 'border-[#00f0ff] bg-[#00f0ff]/10 shadow-glow-cyan' : 'border-[#272732] bg-[#121217]'}`}>
                <Laptop className="w-5 h-5 sm:w-6 sm:h-6 text-[#00f0ff]" />
                <span className="text-xs font-bold text-white">Host A</span>
              </div>

              <div className={`p-2.5 sm:p-3 rounded-xl border flex flex-col items-center gap-1 ${nodeStep === 1 ? 'border-sky-400 bg-sky-400/10' : 'border-[#272732] bg-[#121217]'}`}>
                <Router className="w-5 h-5 sm:w-6 sm:h-6 text-sky-400" />
                <span className="text-xs font-bold text-white">L2 Switch</span>
              </div>

              <div className={`p-2.5 sm:p-3 rounded-xl border flex flex-col items-center gap-1 ${nodeStep === 2 ? 'border-purple-400 bg-purple-400/10' : 'border-[#272732] bg-[#121217]'}`}>
                <Router className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                <span className="text-xs font-bold text-white">L3 Router</span>
              </div>

              <div className={`p-2.5 sm:p-3 rounded-xl border flex flex-col items-center gap-1 ${nodeStep === 3 ? 'border-amber-400 bg-amber-400/10' : 'border-[#272732] bg-[#121217]'}`}>
                <Router className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                <span className="text-xs font-bold text-white">Firewall</span>
              </div>

              <div className={`p-2.5 sm:p-3 rounded-xl border flex flex-col items-center gap-1 col-span-2 sm:col-span-1 ${nodeStep === 4 ? 'border-emerald-400 bg-emerald-400/10' : 'border-[#272732] bg-[#121217]'}`}>
                <Server className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                <span className="text-xs font-bold text-white">Web Server</span>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl bg-[#121217] border border-[#272732]">
              <h4 className="text-xs sm:text-sm font-bold text-white mb-1 flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-[#00f0ff] shrink-0" /> {current.title}
              </h4>
              <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed mb-2.5">{current.action}</p>
              <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-800 font-mono text-[10px] sm:text-[11px] text-[#00f0ff] overflow-x-auto whitespace-nowrap">
                {current.layerInfo}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-mono text-zinc-400">Hop {nodeStep + 1} of 5</span>

            <button
              disabled={nodeStep === 4}
              onClick={() => setNodeStep((prev) => Math.min(4, prev + 1))}
              className="px-4 py-2 rounded-xl bg-[#00f0ff] text-black font-bold text-xs hover:bg-[#00f0ff]/90 disabled:opacity-30 transition-all flex items-center gap-1.5 shrink-0 min-h-[40px]"
            >
              <Play className="w-3.5 h-3.5 fill-black shrink-0" />
              <span>{nodeStep === 4 ? 'Delivered!' : 'Forward Packet ➔'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


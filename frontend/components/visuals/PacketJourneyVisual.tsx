'use client';

import React, { useState } from 'react';
import { Laptop, Router, Server, ArrowRight, Play, RotateCcw } from 'lucide-react';

export const PacketJourneyVisual: React.FC = () => {
  const [nodeStep, setNodeStep] = useState<number>(0);

  const journeySteps = [
    {
      title: '1. Application Request (Host A)',
      node: 'Host A (192.168.1.10)',
      action: 'Constructs HTTP GET Request. Encapsulates in TCP Segment ➔ IP Packet ➔ Ethernet Frame.',
      layerInfo: 'Dst MAC: Router Interface MAC | Dst IP: 93.184.216.34',
    },
    {
      title: '2. L2 Switch Forwarding',
      node: 'Local Switch (Layer 2)',
      action: 'Reads destination MAC address. Forwards Ethernet frame out of Port 4 to Default Gateway Router.',
      layerInfo: 'Layer 2 Switching based on MAC address table',
    },
    {
      title: '3. Layer 3 Router Forwarding',
      node: 'Router (Default Gateway 192.168.1.1)',
      action: 'Strips L2 MAC header. Inspects L3 IP header (93.184.216.34). Checks Routing Table and forwards across WAN link.',
      layerInfo: 'Layer 3 Routing Table Lookup & TTL Decrement (-1)',
    },
    {
      title: '4. Destination Delivery (Web Server)',
      node: 'Web Server (93.184.216.34)',
      action: 'Receives packet, verifies TCP checksum, strips IP header, and delivers HTTP payload to Port 80 web server process.',
      layerInfo: 'HTTP 200 OK Response generated!',
    },
  ];

  const current = journeySteps[nodeStep];

  return (
    <div className="p-6 rounded-2xl glass-panel border border-[#272732] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-wider font-semibold block mb-1">
            End-to-End Packet Traversal
          </span>
          <h3 className="text-xl font-bold text-white">Network Packet Journey Across Nodes</h3>
        </div>

        <button
          onClick={() => setNodeStep(0)}
          className="p-2 rounded-xl bg-[#121217] border border-[#272732] text-zinc-400 hover:text-white"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 rounded-xl bg-[#09090b] border border-[#272732] flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
          <div className={`p-3 rounded-xl border flex flex-col items-center gap-1 ${nodeStep === 0 ? 'border-[#00f0ff] bg-[#00f0ff]/10' : 'border-[#272732] bg-[#121217]'}`}>
            <Laptop className="w-6 h-6 text-[#00f0ff]" />
            <span className="text-xs font-bold text-white">Host A</span>
          </div>

          <div className={`p-3 rounded-xl border flex flex-col items-center gap-1 ${nodeStep === 1 ? 'border-amber-400 bg-amber-400/10' : 'border-[#272732] bg-[#121217]'}`}>
            <Router className="w-6 h-6 text-amber-400" />
            <span className="text-xs font-bold text-white">L2 Switch</span>
          </div>

          <div className={`p-3 rounded-xl border flex flex-col items-center gap-1 ${nodeStep === 2 ? 'border-purple-400 bg-purple-400/10' : 'border-[#272732] bg-[#121217]'}`}>
            <Router className="w-6 h-6 text-purple-400" />
            <span className="text-xs font-bold text-white">L3 Router</span>
          </div>

          <div className={`p-3 rounded-xl border flex flex-col items-center gap-1 ${nodeStep === 3 ? 'border-emerald-400 bg-emerald-400/10' : 'border-[#272732] bg-[#121217]'}`}>
            <Server className="w-6 h-6 text-emerald-400" />
            <span className="text-xs font-bold text-white">Web Server</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#121217] border border-[#272732]">
          <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-[#00f0ff]" /> {current.title}
          </h4>
          <p className="text-xs text-zinc-300 mb-2">{current.action}</p>
          <span className="inline-block px-3 py-1 rounded bg-black/50 border border-zinc-800 font-mono text-[11px] text-[#00f0ff]">
            {current.layerInfo}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-zinc-400">Hop {nodeStep + 1} of 4</span>

        <button
          disabled={nodeStep === 3}
          onClick={() => setNodeStep((prev) => Math.min(3, prev + 1))}
          className="px-4 py-2 rounded-xl bg-[#00f0ff] text-black font-bold text-xs hover:bg-[#00f0ff]/90 disabled:opacity-30 transition-all flex items-center gap-1"
        >
          <Play className="w-3.5 h-3.5 fill-black" /> {nodeStep === 3 ? 'Delivered!' : 'Forward Packet ➔'}
        </button>
      </div>
    </div>
  );
};

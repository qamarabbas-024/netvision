'use client';

import React, { useState } from 'react';
import { Router, ArrowRight, Table } from 'lucide-react';

export const RouterForwardingVisual: React.FC = () => {
  const [selectedDest, setSelectedDest] = useState<'10.0.1.5' | '172.16.0.22' | '8.8.8.8'>('10.0.1.5');

  const routeTable = [
    { dest: '10.0.1.0/24', nextHop: 'Directly Connected', interface: 'eth0 (LAN A)', match: '10.0.1.5' },
    { dest: '172.16.0.0/16', nextHop: '192.168.1.254', interface: 'eth1 (LAN B)', match: '172.16.0.22' },
    { dest: '0.0.0.0/0 (Default)', nextHop: '203.0.113.1', interface: 'wan0 (ISP)', match: '8.8.8.8' },
  ];

  const matched = routeTable.find((r) => r.match === selectedDest)!;

  return (
    <div className="p-6 rounded-2xl glass-panel border border-[#272732] flex flex-col gap-6">
      <div>
        <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-wider font-semibold block mb-1">
          Layer 3 Longest Prefix Match Routing
        </span>
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Router className="w-5 h-5 text-[#00f0ff]" /> Router Packet Forwarding Decision Engine
        </h3>
      </div>

      <div className="p-6 rounded-xl bg-[#09090b] border border-[#272732] flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="text-xs font-mono text-zinc-400">TEST DESTINATION IP PACKET:</span>
          <div className="flex items-center gap-2">
            {(['10.0.1.5', '172.16.0.22', '8.8.8.8'] as const).map((ip) => (
              <button
                key={ip}
                onClick={() => setSelectedDest(ip)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  selectedDest === ip
                    ? 'bg-[#00f0ff] text-black shadow-glow-cyan'
                    : 'bg-[#121217] border border-[#272732] text-zinc-400 hover:text-white'
                }`}
              >
                {ip}
              </button>
            ))}
          </div>
        </div>

        {/* Route Table Display */}
        <div className="p-4 rounded-xl bg-[#121217] border border-[#272732]">
          <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-1.5 font-mono">
            <Table className="w-4 h-4 text-purple-400" /> ROUTER ROUTING TABLE
          </h4>

          <div className="flex flex-col gap-2">
            {routeTable.map((route, idx) => {
              const isMatched = route.match === selectedDest;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border flex items-center justify-between text-xs font-mono transition-all ${
                    isMatched ? 'border-emerald-400 bg-emerald-400/10 text-white font-bold' : 'border-zinc-800 text-zinc-400'
                  }`}
                >
                  <span>{route.dest}</span>
                  <span>Via {route.nextHop}</span>
                  <span className="text-[#00f0ff]">{route.interface}</span>
                  {isMatched && <span className="text-emerald-400 font-bold">MATCH ✓</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Forwarding Result */}
        <div className="p-4 rounded-xl bg-[#121217] border border-emerald-400/30 flex items-center gap-3">
          <ArrowRight className="w-5 h-5 text-emerald-400" />
          <p className="text-xs text-zinc-200 font-mono">
            Packet to <strong>{selectedDest}</strong> matches route <strong>{matched.dest}</strong> and will be forwarded out of interface <strong>{matched.interface}</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

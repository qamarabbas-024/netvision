'use client';

import React, { useState } from 'react';
import { Layers, ArrowDown, ArrowUp, CheckCircle2 } from 'lucide-react';

const OSI_LAYERS = [
  { level: 7, name: 'Application', protocol: 'HTTP, DNS, FTP', data: 'Data Payload', color: 'border-purple-500 bg-purple-500/10 text-purple-300' },
  { level: 6, name: 'Presentation', protocol: 'SSL/TLS, JPEG, ASCII', data: 'Formatted & Encrypted Data', color: 'border-indigo-500 bg-indigo-500/10 text-indigo-300' },
  { level: 5, name: 'Session', protocol: 'NetBIOS, RPC', data: 'Session Context', color: 'border-blue-500 bg-blue-500/10 text-blue-300' },
  { level: 4, name: 'Transport', protocol: 'TCP (Port 80/443), UDP', data: 'Segment (TCP Header + Data)', color: 'border-cyan-500 bg-cyan-500/10 text-cyan-300' },
  { level: 3, name: 'Network', protocol: 'IPv4, IPv6, ICMP', data: 'Packet (IP Header + Segment)', color: 'border-emerald-500 bg-emerald-500/10 text-emerald-300' },
  { level: 2, name: 'Data Link', protocol: 'Ethernet, MAC Address', data: 'Frame (MAC Header + Packet + Trailer)', color: 'border-amber-500 bg-amber-500/10 text-amber-300' },
  { level: 1, name: 'Physical', protocol: 'Copper Cable, Fiber, Wi-Fi', data: 'Raw Binary Bits (0s and 1s)', color: 'border-rose-500 bg-rose-500/10 text-rose-300' },
];

export const OSILayerVisual: React.FC = () => {
  const [activeLevel, setActiveLevel] = useState<number>(7);
  const [mode, setMode] = useState<'encapsulation' | 'decapsulation'>('encapsulation');

  const activeLayer = OSI_LAYERS.find((l) => l.level === activeLevel)!;

  return (
    <div className="p-6 rounded-2xl glass-panel border border-[#272732] flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-wider font-semibold block mb-1">
            Interactive Visual Model
          </span>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#00f0ff]" /> OSI 7-Layer Encapsulation Stack
          </h3>
        </div>

        <div className="flex items-center gap-2 bg-[#121217] p-1.5 rounded-xl border border-[#272732]">
          <button
            onClick={() => { setMode('encapsulation'); setActiveLevel(7); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              mode === 'encapsulation' ? 'bg-[#00f0ff] text-black shadow-glow-cyan' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ArrowDown className="w-3.5 h-3.5" /> Sender (Encapsulation)
          </button>
          <button
            onClick={() => { setMode('decapsulation'); setActiveLevel(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              mode === 'decapsulation' ? 'bg-purple-500 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ArrowUp className="w-3.5 h-3.5" /> Receiver (Decapsulation)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Layer Stack */}
        <div className="lg:col-span-6 flex flex-col gap-2">
          {OSI_LAYERS.map((layer) => {
            const isSelected = layer.level === activeLevel;
            return (
              <button
                key={layer.level}
                onClick={() => setActiveLevel(layer.level)}
                className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  isSelected ? `${layer.color} shadow-lg scale-[1.02]` : 'border-[#272732] bg-[#121217] text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-black/40 flex items-center justify-center font-mono font-bold text-xs">
                    L{layer.level}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{layer.name} Layer</h4>
                    <span className="text-[11px] font-mono opacity-80">{layer.protocol}</span>
                  </div>
                </div>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-[#00f0ff]" />}
              </button>
            );
          })}
        </div>

        {/* Layer Data Unit Details */}
        <div className="lg:col-span-6 p-5 rounded-xl bg-[#121217] border border-[#272732] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#272732]">
              <span className="text-xs font-mono text-zinc-400">LAYER {activeLayer.level} DATA UNIT</span>
              <span className="text-xs font-mono font-bold text-[#00f0ff] uppercase">{mode} MODE</span>
            </div>

            <h4 className="text-lg font-bold text-white mb-2">{activeLayer.name} Layer (L{activeLayer.level})</h4>
            <p className="text-xs text-zinc-300 leading-relaxed mb-4">
              {mode === 'encapsulation'
                ? `As data moves DOWN from Layer 7 to Layer 1, the ${activeLayer.name} layer wraps the payload with its specific ${activeLayer.protocol} header information.`
                : `As bits move UP from Layer 1 to Layer 7, the ${activeLayer.name} layer strips its header, verifies integrity, and passes payload up.`}
            </p>

            <div className="p-3 rounded-lg bg-black/50 border border-zinc-800 font-mono text-xs text-[#00f0ff] mb-4">
              <strong>Header + Data:</strong> {activeLayer.data}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#272732]">
            <button
              disabled={activeLevel === 1}
              onClick={() => setActiveLevel((prev) => Math.max(1, prev - 1))}
              className="text-xs font-bold text-zinc-400 hover:text-white disabled:opacity-30"
            >
              ← Lower Layer
            </button>
            <span className="text-xs font-mono text-zinc-500">Step {8 - activeLevel} of 7</span>
            <button
              disabled={activeLevel === 7}
              onClick={() => setActiveLevel((prev) => Math.min(7, prev + 1))}
              className="text-xs font-bold text-zinc-400 hover:text-white disabled:opacity-30"
            >
              Higher Layer →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

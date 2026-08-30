'use client';

import React from 'react';
import { EDUCATIONAL_PACKETS } from '@/data/networkTopologyData';
import { X, Layers, ArrowRight, ShieldCheck } from 'lucide-react';

interface PacketInspectorModalProps {
  packetId: string | null;
  onClose: () => void;
}

export const PacketInspectorModal: React.FC<PacketInspectorModalProps> = ({ packetId, onClose }) => {
  if (!packetId) return null;
  const packet = EDUCATIONAL_PACKETS.find((p) => p.id === packetId) || EDUCATIONAL_PACKETS[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="packet-inspector-title"
    >
      <div
        className="relative w-full max-w-xl bg-[#0f172a] border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e293b] bg-[#111c30]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#06b6d4]/10 text-[#22d3ee] border border-[#06b6d4]/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="packet-inspector-title" className="text-lg font-bold text-slate-100 font-mono">
                  {packet.label}
                </h3>
                <span className="px-2 py-0.5 text-[11px] font-mono font-medium rounded-full bg-[#10b981]/10 text-[#34d399] border border-[#10b981]/30">
                  Protocol: {packet.protocol}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {packet.source.toUpperCase()} <ArrowRight className="inline w-3 h-3 mx-1 text-slate-500" /> {packet.destination.toUpperCase()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close packet inspector"
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Header breakdown in OSI Layers */}
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-[#0b1120] border border-cyan-500/30 rounded-xl">
              <div className="flex items-center justify-between text-cyan-400 font-bold mb-2">
                <span>LAYER 7: APPLICATION</span>
                <span>{packet.protocol}</span>
              </div>
              <div className="space-y-1 text-slate-300">
                {Object.entries(packet.details).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-slate-500">{k}:</span>
                    <span className="text-slate-200">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-[#0b1120] border border-emerald-500/30 rounded-xl">
              <div className="flex items-center justify-between text-emerald-400 font-bold mb-2">
                <span>LAYER 3: INTERNET PROTOCOL (IPv4)</span>
                <span>TTL: 64 | CHECKSUM: VALID</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div>
                  <span className="text-slate-500">Source IP: </span>
                  <span className="text-slate-100 font-semibold">{packet.sourceIp}</span>
                </div>
                <div>
                  <span className="text-slate-500">Dest IP: </span>
                  <span className="text-slate-100 font-semibold">{packet.destIp}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#0b1120] border border-slate-700/60 rounded-xl">
              <div className="flex items-center justify-between text-slate-300 font-bold mb-2">
                <span>LAYER 2: ETHERNET II FRAME</span>
                <span>TYPE: 0x0800 (IPv4)</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Preamble: 7 Bytes</span>
                <span>SFD: 1 Byte</span>
                <span>Payload: MTU 1500</span>
                <span>FCS CRC32: Valid</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#0b1120] border-t border-[#1e293b] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#10b981]" />
            <span>Encapsulation verified: No bit errors detected</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 font-medium transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

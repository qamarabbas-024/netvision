'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { NetworkPacket } from '@/types';

export interface PacketInspectorModalProps {
  packet: NetworkPacket | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PacketInspectorModal: React.FC<PacketInspectorModalProps> = ({
  packet,
  isOpen,
  onClose,
}) => {
  if (!packet) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Packet Inspector • ${packet.protocol} Frame`}
      description={`Packet ID: ${packet.id} • Status: ${packet.status.toUpperCase()}`}
      className="max-w-xl"
    >
      <div className="flex flex-col gap-4 font-mono text-xs">
        {/* Layer 4 Transport */}
        <div className="p-4 rounded-xl glass-panel border border-[#00f0ff]/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#00f0ff] font-bold">Layer 4: Transport Layer</span>
            <Badge variant="cyan">{packet.protocol}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 text-zinc-300">
            <div>Src Port: <span className="text-white font-bold">54321</span></div>
            <div>Dst Port: <span className="text-white font-bold">80 (HTTP)</span></div>
            <div>Flags: <span className="text-emerald-400 font-bold">SYN, ACK</span></div>
            <div>Window: <span className="text-white">65535</span></div>
          </div>
        </div>

        {/* Layer 3 Network */}
        <div className="p-4 rounded-xl glass-panel border border-blue-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-400 font-bold">Layer 3: Network Layer (IPv4)</span>
            <span className="text-zinc-400">TTL: {packet.ttl}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-zinc-300">
            <div>Source IP: <span className="text-white font-bold">{packet.sourceIp}</span></div>
            <div>Target IP: <span className="text-white font-bold">{packet.targetIp}</span></div>
          </div>
        </div>

        {/* Layer 2 Data Link */}
        <div className="p-4 rounded-xl glass-panel border border-purple-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-400 font-bold">Layer 2: Data Link (Ethernet II)</span>
            <span className="text-zinc-400">Type: 0x0800 (IPv4)</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-zinc-300">
            <div>Source MAC: <span className="text-white font-bold">{packet.sourceMac}</span></div>
            <div>Target MAC: <span className="text-white font-bold">{packet.targetMac}</span></div>
          </div>
        </div>

        {/* Payload */}
        <div className="p-3 rounded-xl bg-black/80 border border-zinc-800 text-zinc-300">
          <span className="text-zinc-500 block mb-1">Payload Content:</span>
          <span className="text-emerald-400 break-all">{packet.payload}</span>
        </div>
      </div>
    </Modal>
  );
};

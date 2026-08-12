'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { NetworkPacket } from '@/types';
import { Layers, ShieldAlert, Cpu, ArrowRight } from 'lucide-react';

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

  const flagList: string[] = [];
  if (packet.flags?.syn) flagList.push('SYN');
  if (packet.flags?.ack) flagList.push('ACK');
  if (packet.flags?.fin) flagList.push('FIN');
  if (packet.flags?.rst) flagList.push('RST');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Packet Inspector • ${packet.protocol} Frame`}
      description={`Packet ID: ${packet.id} • Status: ${packet.status.toUpperCase()}`}
      className="max-w-xl"
    >
      <div className="flex flex-col gap-4 font-mono text-xs">
        {/* Status & Drop Banner */}
        {packet.status === 'dropped' || packet.status === 'blocked' ? (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Packet Dropped / Filtered:</strong>
              <span>{packet.dropReason || 'Dropped by firewall rule or unroutable destination.'}</span>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between">
            <span className="font-bold flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" /> Frame Status: ACTIVE IN TRANSIT
            </span>
            <Badge variant="emerald">{packet.status.toUpperCase()}</Badge>
          </div>
        )}

        {/* Layer 4 Transport Header */}
        <div className="p-4 rounded-2xl glass-panel border border-[#00f0ff]/30 space-y-2">
          <div className="flex items-center justify-between border-b border-[#272732] pb-2">
            <span className="text-[#00f0ff] font-bold">Layer 4: Transport Layer</span>
            <Badge variant="cyan">{packet.protocol}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 text-zinc-300">
            <div>Src Port: <span className="text-white font-bold">54321</span></div>
            <div>Dst Port: <span className="text-white font-bold">80 (HTTP) / 53 (DNS)</span></div>
            <div>
              Control Flags:{' '}
              <span className="text-emerald-400 font-bold">
                {flagList.length > 0 ? flagList.join(', ') : 'NONE'}
              </span>
            </div>
            <div>
              TCP State: <span className="text-purple-400 font-bold">{packet.tcpState || 'N/A'}</span>
            </div>
            {packet.seqNumber !== undefined && (
              <div>Seq Number: <span className="text-white font-bold">{packet.seqNumber}</span></div>
            )}
            {packet.ackNumber !== undefined && (
              <div>Ack Number: <span className="text-white font-bold">{packet.ackNumber}</span></div>
            )}
          </div>
        </div>

        {/* Layer 3 Network Header */}
        <div className="p-4 rounded-2xl glass-panel border border-blue-500/30 space-y-2">
          <div className="flex items-center justify-between border-b border-[#272732] pb-2">
            <span className="text-blue-400 font-bold">Layer 3: Network Layer (IPv4)</span>
            <span className="text-zinc-400">TTL Remaining: {packet.ttl}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-zinc-300">
            <div>Source IP: <span className="text-white font-bold">{packet.sourceIp}</span></div>
            <div>Target IP: <span className="text-white font-bold">{packet.targetIp}</span></div>
          </div>
        </div>

        {/* Layer 2 Data Link Header */}
        <div className="p-4 rounded-2xl glass-panel border border-purple-500/30 space-y-2">
          <div className="flex items-center justify-between border-b border-[#272732] pb-2">
            <span className="text-purple-400 font-bold">Layer 2: Data Link Layer (Ethernet II)</span>
            <span className="text-zinc-400">Type: 0x0800 (IPv4)</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-zinc-300">
            <div>Source MAC: <span className="text-white font-bold">{packet.sourceMac}</span></div>
            <div>Target MAC: <span className="text-white font-bold">{packet.targetMac}</span></div>
          </div>
        </div>

        {/* Hop Trace History */}
        {packet.hopHistory && packet.hopHistory.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <span className="text-zinc-400 font-bold block uppercase text-[10px]">
              Hop Path History:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap text-zinc-300">
              {packet.hopHistory.map((hop, i) => (
                <React.Fragment key={i}>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 font-mono text-[11px] text-white">
                    {hop}
                  </span>
                  {i < packet.hopHistory!.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-zinc-600" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Payload */}
        <div className="p-3.5 rounded-2xl bg-black/90 border border-zinc-800 text-zinc-300 space-y-1">
          <span className="text-zinc-500 block uppercase text-[10px] font-bold">Payload Data:</span>
          <span className="text-emerald-400 break-all leading-relaxed">{packet.payload}</span>
        </div>
      </div>
    </Modal>
  );
};

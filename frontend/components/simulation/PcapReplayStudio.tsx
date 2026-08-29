'use client';

import React, { useState } from 'react';
import { Layers, FileCode, Play, Pause, RotateCw, Filter, ShieldCheck, ChevronRight, ChevronDown } from 'lucide-react';
import { SAMPLE_PCAP_STREAM, CapturedPacket } from '@/lib/pcapReplayEngine';

export const PcapReplayStudio: React.FC = () => {
  const [packets] = useState<CapturedPacket[]>(SAMPLE_PCAP_STREAM);
  const [selectedId, setSelectedId] = useState<number>(3);
  const [filterText, setFilterText] = useState<string>('');
  const [expandedSection, setExpandedSection] = useState<'eth' | 'ip' | 'tcp' | 'all'>('all');

  const selectedPacket = packets.find((p) => p.id === selectedId) || packets[0];

  const filteredPackets = packets.filter(
    (p) =>
      p.protocol.toLowerCase().includes(filterText.toLowerCase()) ||
      p.info.toLowerCase().includes(filterText.toLowerCase()) ||
      p.source.includes(filterText) ||
      p.destination.includes(filterText)
  );

  return (
    <div className="surface-1 rounded-2xl border border-[#2a2e39] p-6 text-[#f4f5f7] font-sans shadow-instrument flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2e39] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#22c55e]">
              EPOCH XI // WIRESHARK-GRADE PCAP DISSECTOR
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            PCAP / PCAPNG Packet Dissector & Replay Studio
          </h2>
          <p className="text-xs text-[#8e95a5]">
            Replay live captured packet traces with full protocol frame dissection and synchronized hex dump views.
          </p>
        </div>

        {/* Display Filter Input */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="relative">
            <input
              type="text"
              placeholder="Display filter (e.g. tcp, dns, 192.168.1.10)"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="px-3 py-1.5 pl-8 rounded-lg bg-[#090d14] border border-[#1e293b] text-white text-xs w-64 focus:border-[#22c55e] outline-none"
            />
            <Filter className="w-3.5 h-3.5 text-[#64748b] absolute left-2.5 top-2.5" />
          </div>
        </div>
      </div>

      {/* Pane 1: Packet Summary Table */}
      <div className="rounded-xl bg-[#090d14] border border-[#1e293b] overflow-hidden font-mono text-xs">
        <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-[#0c111c] border-b border-[#1e293b] font-bold text-[#64748b] text-[10px]">
          <span className="col-span-1">NO.</span>
          <span className="col-span-2">TIME (MS)</span>
          <span className="col-span-2">SOURCE</span>
          <span className="col-span-2">DESTINATION</span>
          <span className="col-span-1">PROTO</span>
          <span className="col-span-1">LEN</span>
          <span className="col-span-3">INFO</span>
        </div>

        <div className="flex flex-col divide-y divide-[#1e293b]/40">
          {filteredPackets.map((pkt) => {
            const isSelected = pkt.id === selectedId;
            return (
              <div
                key={pkt.id}
                onClick={() => setSelectedId(pkt.id)}
                className={`grid grid-cols-12 gap-2 px-3 py-2 items-center cursor-pointer transition-colors text-[11px] ${
                  isSelected ? 'bg-[#22c55e]/15 text-white font-bold' : 'text-[#8e95a5] hover:bg-[#111827]'
                }`}
              >
                <span className="col-span-1 text-[#64748b]">{pkt.id}</span>
                <span className="col-span-2 text-[#38bdf8]">+{pkt.timeOffsetMs} ms</span>
                <span className="col-span-2 truncate">{pkt.source}</span>
                <span className="col-span-2 truncate">{pkt.destination}</span>
                <span className="col-span-1">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#1e293b] text-[#22c55e]">
                    {pkt.protocol}
                  </span>
                </span>
                <span className="col-span-1">{pkt.length} B</span>
                <span className="col-span-3 truncate text-white">{pkt.info}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pane 2 & 3: Protocol Tree Breakdown & Hex Dump */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Protocol Tree */}
        <div className="lg:col-span-7 p-4 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-2 font-mono text-xs">
          <div className="text-white font-bold pb-2 border-b border-[#1e293b] text-xs">
            Frame #{selectedPacket.id} Protocol Tree Dissection
          </div>

          <div className="flex flex-col gap-2 text-[11px]">
            <div className="p-2 rounded bg-[#0f172a] border border-[#1e293b]/60 text-[#38bdf8]">
              <strong>Ethernet II:</strong> Src: {selectedPacket.layers.ethernet.srcMac}, Dst:{' '}
              {selectedPacket.layers.ethernet.dstMac}, Type: {selectedPacket.layers.ethernet.ethertype}
            </div>

            <div className="p-2 rounded bg-[#0f172a] border border-[#1e293b]/60 text-[#22c55e]">
              <strong>Internet Protocol v{selectedPacket.layers.ip.version}:</strong> Src:{' '}
              {selectedPacket.layers.ip.srcIp}, Dst: {selectedPacket.layers.ip.dstIp}, TTL:{' '}
              {selectedPacket.layers.ip.ttl}, Protocol: {selectedPacket.layers.ip.protocol}
            </div>

            <div className="p-2 rounded bg-[#0f172a] border border-[#1e293b]/60 text-[#a855f7]">
              <strong>Transport Layer:</strong> Src Port: {selectedPacket.layers.transport.srcPort}, Dst Port:{' '}
              {selectedPacket.layers.transport.dstPort}
              {selectedPacket.layers.transport.flags && ` [Flags: ${selectedPacket.layers.transport.flags}]`}
            </div>
          </div>
        </div>

        {/* Synchronized Hex / ASCII Dump */}
        <div className="lg:col-span-5 p-4 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-2 font-mono text-xs">
          <div className="text-white font-bold pb-2 border-b border-[#1e293b] text-xs">
            Payload Hex & ASCII Dump
          </div>

          <div className="p-3 rounded bg-[#020617] border border-[#1e293b] flex flex-col gap-2">
            <div>
              <span className="text-[10px] text-[#64748b] block mb-1">HEX RAW:</span>
              <p className="text-[#38bdf8] text-[11px] leading-relaxed break-all">
                {selectedPacket.layers.payloadHex}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-[#64748b] block mb-1">ASCII DECODE:</span>
              <p className="text-[#22c55e] text-[11px] leading-relaxed break-all font-bold">
                {selectedPacket.layers.payloadAscii}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

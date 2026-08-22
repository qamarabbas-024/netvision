'use client';

import React, { useState, useMemo } from 'react';
import {
  Filter,
  ChevronRight,
  ChevronDown,
  Layers,
} from 'lucide-react';

export interface PacketEntry {
  no: number;
  time: string;
  source: string;
  destination: string;
  protocol: 'TCP' | 'UDP' | 'DNS' | 'HTTP' | 'ICMP' | 'ARP' | 'TLS';
  length: number;
  info: string;
  hexDump: string;
  treeLayers: {
    frame: { title: string; fields: string[] };
    ethernet: { title: string; fields: string[] };
    ip: { title: string; fields: string[] };
    transport: { title: string; fields: string[] };
    application?: { title: string; fields: string[] };
  };
}

export const WiresharkPcapStudio: React.FC = () => {
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('');
  const [selectedPacketNo, setSelectedPacketNo] = useState<number>(1);
  const [selectedCapturePreset, setSelectedCapturePreset] = useState<'handshake' | 'dns' | 'ospf' | 'tls'>('handshake');
  const [expandedLayers, setExpandedLayers] = useState<Record<string, boolean>>({
    frame: false,
    ethernet: true,
    ip: true,
    transport: true,
    application: true,
  });

  // Preset Packet Capture Datasets
  const presetCaptures: Record<string, PacketEntry[]> = {
    handshake: [
      {
        no: 1,
        time: '0.000000',
        source: '192.168.1.50',
        destination: '93.184.216.34',
        protocol: 'TCP',
        length: 74,
        info: '52140 → 443 [SYN] Seq=0 Win=64240 Len=0 MSS=1460 WS=256 SACK_PERM=1',
        hexDump:
          '00 1a 2b gw 01 01 00 1a 2b 11 22 33 08 00 45 00\n00 3c 1a 2b 40 00 40 06 b8 12 c0 a8 01 32 5d b8\nd8 22 cb ac 01 bb 00 00 03 e8 00 00 00 00 a0 02\nfa f0 32 c1 00 00 02 04 05 b4 01 03 03 08 01 01\n04 02',
        treeLayers: {
          frame: { title: 'Frame 1: 74 bytes on wire (592 bits)', fields: ['Interface: eth0', 'Arrival Time: Aug 23, 2026 01:45:00.000 UTC', 'Frame Length: 74 bytes', 'Capture Length: 74 bytes'] },
          ethernet: { title: 'Ethernet II, Src: 00:1a:2b:11:22:33, Dst: 00:1a:2b:gw:01:01', fields: ['Destination: 00:1a:2b:gw:01:01 (Default Gateway)', 'Source: 00:1a:2b:11:22:33 (Host A)', 'Type: IPv4 (0x0800)'] },
          ip: { title: 'Internet Protocol Version 4, Src: 192.168.1.50, Dst: 93.184.216.34', fields: ['0100 .... = Version: 4', '.... 0101 = Header Length: 20 bytes (5)', 'Total Length: 60', 'Time to Live: 64', 'Protocol: TCP (6)', 'Header Checksum: 0xb812 [validation disabled]'] },
          transport: { title: 'Transmission Control Protocol, Src Port: 52140, Dst Port: 443, Seq: 0, Len: 0', fields: ['Source Port: 52140', 'Destination Port: 443', 'Sequence Number: 0 (relative sequence number)', 'Acknowledgment Number: 0', '0000 0010 = Flags: 0x002 (SYN)', 'Window: 64240', 'Options: (12 bytes) MSS=1460, WS=256, SACK_PERM'] },
        },
      },
      {
        no: 2,
        time: '0.014210',
        source: '93.184.216.34',
        destination: '192.168.1.50',
        protocol: 'TCP',
        length: 74,
        info: '443 → 52140 [SYN, ACK] Seq=0 Ack=1 Win=65535 Len=0 MSS=1460 WS=256',
        hexDump:
          '00 1a 2b 11 22 33 00 1a 2b gw 01 01 08 00 45 00\n00 3c 4b 81 40 00 38 06 8e 5c 5d b8 d8 22 c0 a8\n01 32 01 bb cb ac 00 00 07 d0 00 00 03 e9 a0 12\nff ff f8 12 00 00 02 04 05 b4 01 03 03 08 01 01\n04 02',
        treeLayers: {
          frame: { title: 'Frame 2: 74 bytes on wire (592 bits)', fields: ['Interface: eth0', 'Time Delta from previous: 0.014210 seconds', 'Frame Length: 74 bytes'] },
          ethernet: { title: 'Ethernet II, Src: 00:1a:2b:gw:01:01, Dst: 00:1a:2b:11:22:33', fields: ['Destination: 00:1a:2b:11:22:33 (Host A)', 'Source: 00:1a:2b:gw:01:01 (Gateway Router)', 'Type: IPv4 (0x0800)'] },
          ip: { title: 'Internet Protocol Version 4, Src: 93.184.216.34, Dst: 192.168.1.50', fields: ['Version: 4', 'Total Length: 60', 'Time to Live: 56 (Decremented across 8 WAN hops)', 'Protocol: TCP (6)'] },
          transport: { title: 'Transmission Control Protocol, Src Port: 443, Dst Port: 52140, Seq: 0, Ack: 1', fields: ['Source Port: 443', 'Destination Port: 52140', 'Sequence Number: 0 (relative sequence number)', 'Acknowledgment Number: 1 (relative ack number)', '0001 0010 = Flags: 0x012 (SYN, ACK)', 'Window: 65535'] },
        },
      },
      {
        no: 3,
        time: '0.014290',
        source: '192.168.1.50',
        destination: '93.184.216.34',
        protocol: 'TCP',
        length: 54,
        info: '52140 → 443 [ACK] Seq=1 Ack=1 Win=64240 Len=0',
        hexDump:
          '00 1a 2b gw 01 01 00 1a 2b 11 22 33 08 00 45 00\n00 28 1a 2c 40 00 40 06 b8 25 c0 a8 01 32 5d b8\nd8 22 cb ac 01 bb 00 00 03 e9 00 00 07 d1 50 10\nfa f0 a3 21 00 00',
        treeLayers: {
          frame: { title: 'Frame 3: 54 bytes on wire (432 bits)', fields: ['Interface: eth0', 'Time Delta: 0.000080 seconds', 'Frame Length: 54 bytes'] },
          ethernet: { title: 'Ethernet II, Src: 00:1a:2b:11:22:33, Dst: 00:1a:2b:gw:01:01', fields: ['Type: IPv4 (0x0800)'] },
          ip: { title: 'Internet Protocol Version 4, Src: 192.168.1.50, Dst: 93.184.216.34', fields: ['Total Length: 40', 'Time to Live: 64', 'Protocol: TCP (6)'] },
          transport: { title: 'Transmission Control Protocol, Src Port: 52140, Dst Port: 443, Seq: 1, Ack: 1', fields: ['Source Port: 52140', 'Destination Port: 443', '0001 0000 = Flags: 0x010 (ACK)', 'Connection State: ESTABLISHED'] },
        },
      },
      {
        no: 4,
        time: '0.015120',
        source: '192.168.1.50',
        destination: '93.184.216.34',
        protocol: 'TLS',
        length: 517,
        info: 'Client Hello (TLSv1.3, SNI: example.com, Cipher Suites: 17)',
        hexDump:
          '16 03 01 02 00 01 00 01 fc 03 03 c9 4e 1b 7a 8d\n92 11 0f 4a 6b 91 88 fe 10 32 a1 bc 99 01 de fa\n00 20 13 01 13 02 13 03 c0 2b c0 2f c0 2c c0 30\n00 00 00 0b 00 04 03 00 01 02 00 0a 00 0a 00 08\n00 1d 00 17 00 18 00 19 00 00 00 10 00 0e 00 0c\n02 68 32 08 68 74 74 70 2f 31 2e 31',
        treeLayers: {
          frame: { title: 'Frame 4: 517 bytes on wire (4136 bits)', fields: ['Frame Length: 517 bytes'] },
          ethernet: { title: 'Ethernet II, Src: 00:1a:2b:11:22:33, Dst: 00:1a:2b:gw:01:01', fields: ['Type: IPv4 (0x0800)'] },
          ip: { title: 'Internet Protocol Version 4, Src: 192.168.1.50, Dst: 93.184.216.34', fields: ['Total Length: 503', 'Time to Live: 64'] },
          transport: { title: 'Transmission Control Protocol, Src Port: 52140, Dst Port: 443', fields: ['Flags: 0x018 (PSH, ACK)', 'Payload Length: 463 bytes'] },
          application: { title: 'Transport Layer Security (TLSv1.3 Handshake: Client Hello)', fields: ['Handshake Type: Client Hello (1)', 'Length: 508', 'Version: TLS 1.2 (0x0303)', 'Server Name Indication: example.com', 'Supported Cipher Suites: TLS_AES_128_GCM_SHA256, TLS_CHACHA20_POLY1305_SHA256'] },
        },
      },
    ],
    dns: [
      {
        no: 1,
        time: '0.000000',
        source: '192.168.1.50',
        destination: '1.1.1.1',
        protocol: 'DNS',
        length: 72,
        info: 'Standard query 0x3a4f A netvision.io OPT',
        hexDump:
          '00 1a 2b gw 01 01 00 1a 2b 11 22 33 08 00 45 00\n00 3a 21 00 40 00 40 11 af 21 c0 a8 01 32 01 01\n01 01 c8 12 00 35 00 26 81 40 3a 4f 01 00 00 01\n00 00 00 00 00 01 09 6e 65 74 76 69 73 69 6f 6e\n02 69 6f 00 00 01 00 01',
        treeLayers: {
          frame: { title: 'Frame 1: 72 bytes on wire', fields: ['Interface: eth0', 'Frame Length: 72 bytes'] },
          ethernet: { title: 'Ethernet II, Src: 00:1a:2b:11:22:33, Dst: 00:1a:2b:gw:01:01', fields: ['Type: IPv4 (0x0800)'] },
          ip: { title: 'Internet Protocol Version 4, Src: 192.168.1.50, Dst: 1.1.1.1', fields: ['Protocol: UDP (17)', 'Time to Live: 64'] },
          transport: { title: 'User Datagram Protocol, Src Port: 51218, Dst Port: 53', fields: ['Source Port: 51218', 'Destination Port: 53 (DNS)', 'Length: 38'] },
          application: { title: 'Domain Name System (query)', fields: ['Transaction ID: 0x3a4f', 'Questions: 1', 'Query Name: netvision.io', 'Type: A (Host Address) (1)', 'Class: IN (0x0001)'] },
        },
      },
      {
        no: 2,
        time: '0.008420',
        source: '1.1.1.1',
        destination: '192.168.1.50',
        protocol: 'DNS',
        length: 88,
        info: 'Standard query response 0x3a4f A netvision.io A 104.21.45.12',
        hexDump:
          '00 1a 2b 11 22 33 00 1a 2b gw 01 01 08 00 45 00\n00 4a 41 22 40 00 39 11 95 10 01 01 01 01 c0 a8\n01 32 00 35 c8 12 00 36 e1 42 3a 4f 81 80 00 01\n00 01 00 00 00 01 09 6e 65 74 76 69 73 69 6f 6e\n02 69 6f 00 00 01 00 01 c0 0c 00 01 00 01 00 00\n01 2c 00 04 68 15 2d 0c',
        treeLayers: {
          frame: { title: 'Frame 2: 88 bytes on wire', fields: ['Time Delta: 0.008420 seconds'] },
          ethernet: { title: 'Ethernet II', fields: ['Type: IPv4 (0x0800)'] },
          ip: { title: 'Internet Protocol Version 4, Src: 1.1.1.1, Dst: 192.168.1.50', fields: ['Protocol: UDP (17)', 'Time to Live: 57'] },
          transport: { title: 'User Datagram Protocol, Src Port: 53, Dst Port: 51218', fields: ['Source Port: 53 (DNS)'] },
          application: { title: 'Domain Name System (response)', fields: ['Transaction ID: 0x3a4f', 'Flags: 0x8180 (Standard query response, No error)', 'Answer: netvision.io: type A, class IN, addr 104.21.45.12', 'TTL: 300 seconds (5 minutes)'] },
        },
      },
    ],
  };

  const currentPackets = presetCaptures[selectedCapturePreset] || presetCaptures.handshake;

  // Filter logic based on BPF / search query
  const filteredPackets = useMemo(() => {
    if (!activeFilter.trim()) return currentPackets;
    const q = activeFilter.toLowerCase();
    return currentPackets.filter((p) => {
      if (q.startsWith('ip.addr')) {
        const ip = q.split('==')[1]?.trim();
        return ip ? p.source.includes(ip) || p.destination.includes(ip) : true;
      }
      if (q.startsWith('tcp.port')) {
        const port = q.split('==')[1]?.trim();
        return port ? p.info.includes(port) : true;
      }
      return p.protocol.toLowerCase().includes(q) || p.info.toLowerCase().includes(q) || p.source.includes(q) || p.destination.includes(q);
    });
  }, [currentPackets, activeFilter]);

  const activePacket = filteredPackets.find((p) => p.no === selectedPacketNo) || filteredPackets[0] || currentPackets[0];

  const toggleLayer = (layerKey: string) => {
    setExpandedLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  return (
    <div className="w-full rounded-2xl bg-[#09090b] border border-[#272732] overflow-hidden flex flex-col shadow-2xl">
      {/* Top Header Toolbar */}
      <div className="px-5 py-3.5 border-b border-[#272732] bg-[#121217] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-sky-400 uppercase tracking-wider font-bold">
                Version 3.5 Forensics Engine
              </span>
              <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[9px] font-mono font-bold">
                PCAP Dissector
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
              Browser-Native Wireshark Forensics Studio
            </h3>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-400 hidden sm:inline">Trace:</span>
          <select
            value={selectedCapturePreset}
            onChange={(e) => {
              setSelectedCapturePreset(e.target.value as 'handshake' | 'dns' | 'ospf' | 'tls');
              setSelectedPacketNo(1);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-[#1a1a24] border border-[#272732] text-xs font-mono text-white focus:outline-none focus:border-sky-500"
          >
            <option value="handshake">TCP 3-Way Handshake & TLS Client Hello</option>
            <option value="dns">Recursive DNS Query & A-Record Resolution</option>
          </select>
        </div>
      </div>

      {/* BPF Filter Search Bar */}
      <div className="px-4 py-2.5 bg-[#0e0e12] border-b border-[#272732] flex items-center gap-2">
        <Filter className="w-4 h-4 text-sky-400 shrink-0" />
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') setActiveFilter(filterQuery);
          }}
          placeholder="Apply a display filter ... e.g. ip.addr == 192.168.1.50 || tcp.port == 443 || dns"
          className="flex-1 px-3 py-1 rounded-md bg-[#16161f] border border-[#272732] text-xs font-mono text-[#00f0ff] placeholder:text-zinc-600 focus:outline-none focus:border-sky-500"
        />
        <button
          onClick={() => setActiveFilter(filterQuery)}
          className="px-3 py-1 rounded-md bg-sky-500 text-black font-bold text-xs hover:bg-sky-400 transition-all font-mono"
        >
          Apply
        </button>
        {activeFilter && (
          <button
            onClick={() => {
              setActiveFilter('');
              setFilterQuery('');
            }}
            className="px-2 py-1 rounded-md bg-zinc-800 text-zinc-300 text-xs font-mono hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* 3-Pane Dissection Workspace */}
      <div className="flex flex-col h-[480px]">
        {/* Pane 1: Packet Summary Table */}
        <div className="h-[180px] overflow-y-auto border-b border-[#272732] bg-[#0c0c10]">
          <table className="w-full text-left font-mono text-[11px] border-collapse">
            <thead className="sticky top-0 bg-[#14141b] border-b border-[#272732] text-zinc-400 uppercase text-[10px]">
              <tr>
                <th className="py-1.5 px-3 w-12">No.</th>
                <th className="py-1.5 px-3 w-20">Time</th>
                <th className="py-1.5 px-3 w-32">Source</th>
                <th className="py-1.5 px-3 w-32">Destination</th>
                <th className="py-1.5 px-3 w-16">Protocol</th>
                <th className="py-1.5 px-3 w-14">Length</th>
                <th className="py-1.5 px-3">Info</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {filteredPackets.map((pkt) => {
                const isSelected = pkt.no === activePacket?.no;
                const protoColor =
                  pkt.protocol === 'TCP'
                    ? 'text-sky-400'
                    : pkt.protocol === 'TLS'
                    ? 'text-purple-400'
                    : pkt.protocol === 'DNS'
                    ? 'text-amber-400'
                    : 'text-emerald-400';

                return (
                  <tr
                    key={pkt.no}
                    onClick={() => setSelectedPacketNo(pkt.no)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-sky-500/20 text-white font-bold'
                        : 'text-zinc-300 hover:bg-zinc-900/60'
                    }`}
                  >
                    <td className="py-1 px-3 text-zinc-500">{pkt.no}</td>
                    <td className="py-1 px-3">{pkt.time}</td>
                    <td className="py-1 px-3">{pkt.source}</td>
                    <td className="py-1 px-3">{pkt.destination}</td>
                    <td className={`py-1 px-3 font-bold ${protoColor}`}>{pkt.protocol}</td>
                    <td className="py-1 px-3 text-zinc-400">{pkt.length}</td>
                    <td className="py-1 px-3 truncate max-w-md">{pkt.info}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Panes 2 & 3 Split: Tree Dissection (Left) & Hex Byte Dump (Right) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#272732] overflow-hidden bg-[#09090b]">
          {/* Pane 2: OSI Protocol Dissection Tree */}
          <div className="p-3.5 overflow-y-auto font-mono text-xs flex flex-col gap-2">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">
              OSI Protocol Tree (Packet #{activePacket?.no})
            </span>

            {activePacket && (
              <>
                {/* Frame Layer */}
                <div className="rounded-lg bg-[#121217] border border-[#272732] overflow-hidden">
                  <button
                    onClick={() => toggleLayer('frame')}
                    className="w-full px-3 py-1.5 flex items-center justify-between text-left text-xs font-semibold text-zinc-300 hover:text-white bg-[#16161f]"
                  >
                    <span>{activePacket.treeLayers.frame.title}</span>
                    {expandedLayers.frame ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                  {expandedLayers.frame && (
                    <div className="p-2.5 pl-6 text-[11px] text-zinc-400 space-y-1 bg-[#0f0f14]">
                      {activePacket.treeLayers.frame.fields.map((f, i) => (
                        <div key={i}>• {f}</div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Ethernet Layer */}
                <div className="rounded-lg bg-[#121217] border border-[#272732] overflow-hidden">
                  <button
                    onClick={() => toggleLayer('ethernet')}
                    className="w-full px-3 py-1.5 flex items-center justify-between text-left text-xs font-semibold text-zinc-300 hover:text-white bg-[#16161f]"
                  >
                    <span>{activePacket.treeLayers.ethernet.title}</span>
                    {expandedLayers.ethernet ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                  {expandedLayers.ethernet && (
                    <div className="p-2.5 pl-6 text-[11px] text-amber-300/80 space-y-1 bg-[#0f0f14]">
                      {activePacket.treeLayers.ethernet.fields.map((f, i) => (
                        <div key={i}>• {f}</div>
                      ))}
                    </div>
                  )}
                </div>

                {/* IP Layer */}
                <div className="rounded-lg bg-[#121217] border border-[#272732] overflow-hidden">
                  <button
                    onClick={() => toggleLayer('ip')}
                    className="w-full px-3 py-1.5 flex items-center justify-between text-left text-xs font-semibold text-zinc-300 hover:text-white bg-[#16161f]"
                  >
                    <span>{activePacket.treeLayers.ip.title}</span>
                    {expandedLayers.ip ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                  {expandedLayers.ip && (
                    <div className="p-2.5 pl-6 text-[11px] text-emerald-300/80 space-y-1 bg-[#0f0f14]">
                      {activePacket.treeLayers.ip.fields.map((f, i) => (
                        <div key={i}>• {f}</div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Transport Layer */}
                <div className="rounded-lg bg-[#121217] border border-[#272732] overflow-hidden">
                  <button
                    onClick={() => toggleLayer('transport')}
                    className="w-full px-3 py-1.5 flex items-center justify-between text-left text-xs font-semibold text-zinc-300 hover:text-white bg-[#16161f]"
                  >
                    <span>{activePacket.treeLayers.transport.title}</span>
                    {expandedLayers.transport ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                  {expandedLayers.transport && (
                    <div className="p-2.5 pl-6 text-[11px] text-sky-300/80 space-y-1 bg-[#0f0f14]">
                      {activePacket.treeLayers.transport.fields.map((f, i) => (
                        <div key={i}>• {f}</div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Application Layer */}
                {activePacket.treeLayers.application && (
                  <div className="rounded-lg bg-[#121217] border border-[#272732] overflow-hidden">
                    <button
                      onClick={() => toggleLayer('application')}
                      className="w-full px-3 py-1.5 flex items-center justify-between text-left text-xs font-semibold text-zinc-300 hover:text-white bg-[#16161f]"
                    >
                      <span>{activePacket.treeLayers.application.title}</span>
                      {expandedLayers.application ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                    {expandedLayers.application && (
                      <div className="p-2.5 pl-6 text-[11px] text-purple-300/80 space-y-1 bg-[#0f0f14]">
                        {activePacket.treeLayers.application.fields.map((f, i) => (
                          <div key={i}>• {f}</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Pane 3: Raw Hex & ASCII Stream Dump */}
          <div className="p-3.5 overflow-y-auto font-mono text-xs flex flex-col gap-2 bg-[#09090b]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                Raw Packet Byte Stream ({activePacket?.length} bytes)
              </span>
              <span className="text-[10px] text-[#00f0ff] font-mono">Hex Offset View</span>
            </div>

            <pre className="p-3 rounded-lg bg-[#0d0d12] border border-[#272732] text-[11px] font-mono text-[#00f0ff] overflow-x-auto leading-relaxed whitespace-pre">
              {activePacket?.hexDump}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';

interface MacPreset {
  label: string;
  mac: string;
  vendor: string;
  type: string;
  description: string;
}

const PRESETS: MacPreset[] = [
  {
    label: 'Cisco Enterprise Switch',
    mac: '00:1A:2B:3C:4D:5E',
    vendor: 'Cisco Systems (OUI: 00:1A:2B)',
    type: 'Unicast / Universally Administered',
    description: 'Standard globally unique burned-in MAC address for a Cisco Catalyst interface.',
  },
  {
    label: 'IPv4 Multicast Group',
    mac: '01:00:5E:00:00:01',
    vendor: 'IANA Multicast (OUI: 01:00:5E)',
    type: 'Multicast / Universally Administered',
    description: 'All-Systems IPv4 Multicast group (I/G bit = 1). Mapped from 224.0.0.1.',
  },
  {
    label: 'IPv6 Multicast Neighbor',
    mac: '33:33:00:00:00:01',
    vendor: 'IANA IPv6 Multicast (Prefix: 33:33)',
    type: 'Multicast / Universally Administered',
    description: 'All-Nodes IPv6 multicast destination MAC (I/G bit = 1).',
  },
  {
    label: 'All-Nodes Broadcast',
    mac: 'FF:FF:FF:FF:FF:FF',
    vendor: 'Universal Broadcast',
    type: 'Broadcast (All 48 Bits = 1)',
    description: 'Flooded to every switchport in the local Layer 2 broadcast domain.',
  },
  {
    label: 'VMware Virtual NIC',
    mac: '00:50:56:AB:CD:EF',
    vendor: 'VMware Inc (OUI: 00:50:56)',
    type: 'Unicast / Universally Administered',
    description: 'Standard ESXi / Workstation hypervisor assigned virtual machine MAC.',
  },
  {
    label: 'Locally Administered / Virtualized',
    mac: '02:00:00:11:22:33',
    vendor: 'Locally Overridden (U/L bit = 1)',
    type: 'Unicast / Locally Administered',
    description: 'Custom MAC address overridden by network hypervisor or administrator.',
  },
];

export const MacBitParserVisual: React.FC = () => {
  const [selectedMac, setSelectedMac] = useState<string>('00:1A:2B:3C:4D:5E');
  const [customInput, setCustomInput] = useState<string>('');

  const activePreset = PRESETS.find((p) => p.mac.toLowerCase() === selectedMac.toLowerCase());

  // Clean hex chars
  const cleanHex = selectedMac.replace(/[^0-9A-Fa-f]/g, '').padEnd(12, '0').slice(0, 12);
  const octets = [
    cleanHex.slice(0, 2),
    cleanHex.slice(2, 4),
    cleanHex.slice(4, 6),
    cleanHex.slice(6, 8),
    cleanHex.slice(8, 10),
    cleanHex.slice(10, 12),
  ];

  const ouiOctets = octets.slice(0, 3);
  const nicOctets = octets.slice(3, 6);

  const firstByte = parseInt(octets[0] || '0', 16);
  const isMulticast = (firstByte & 0x01) === 0x01;
  const isLocalAdmin = (firstByte & 0x02) === 0x02;
  const isBroadcast = cleanHex.toUpperCase() === 'FFFFFFFFFFFF';

  const octetToBin = (hex: string) =>
    parseInt(hex || '0', 16).toString(2).padStart(8, '0');

  const firstOctetBin = octetToBin(octets[0]);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      setSelectedMac(customInput.trim());
    }
  };

  return (
    <div className="space-y-4">
      {/* MAC Presets and Input */}
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-xl p-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest">
              48-Bit Layer 2 MAC Address Instrument
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.mac}
                onClick={() => setSelectedMac(preset.mac)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  selectedMac.toLowerCase() === preset.mac.toLowerCase()
                    ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30 ring-1 ring-cyan-400'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom MAC Input Form */}
        <form onSubmit={handleCustomSubmit} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter custom MAC (e.g. 00:1A:2B:3C:4D:5E or 001a2b3c4d5e)"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-mono font-bold"
          >
            Parse MAC
          </button>
        </form>

        {/* 48-Bit Architecture Visualizer Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/80 p-4 rounded-lg border border-slate-800">
          {/* OUI Partition */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-400 font-bold uppercase">
                OUI (Organizationally Unique Identifier)
              </span>
              <span className="text-slate-400 text-[10px]">First 24 Bits (3 Bytes)</span>
            </div>
            <div className="flex gap-2">
              {ouiOctets.map((oct, i) => (
                <div
                  key={i}
                  className="flex-1 bg-cyan-950/60 border border-cyan-500/50 rounded-lg p-2.5 text-center"
                >
                  <div className="text-lg font-mono font-black text-cyan-300 uppercase">{oct}</div>
                  <div className="text-[10px] font-mono text-cyan-500/80 mt-0.5">
                    {octetToBin(oct)}
                  </div>
                  <div className="text-[9px] text-slate-500 uppercase mt-1">Byte {i + 1}</div>
                </div>
              ))}
            </div>
            <div className="text-xs font-mono text-slate-300">
              Assigned By: <span className="text-cyan-300 font-bold">{activePreset ? activePreset.vendor : 'IEEE Standards Association'}</span>
            </div>
          </div>

          {/* NIC Partition */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400 font-bold uppercase">
                NIC Interface Extension Identifier
              </span>
              <span className="text-slate-400 text-[10px]">Last 24 Bits (3 Bytes)</span>
            </div>
            <div className="flex gap-2">
              {nicOctets.map((oct, i) => (
                <div
                  key={i}
                  className="flex-1 bg-emerald-950/60 border border-emerald-500/50 rounded-lg p-2.5 text-center"
                >
                  <div className="text-lg font-mono font-black text-emerald-300 uppercase">{oct}</div>
                  <div className="text-[10px] font-mono text-emerald-500/80 mt-0.5">
                    {octetToBin(oct)}
                  </div>
                  <div className="text-[9px] text-slate-500 uppercase mt-1">Byte {i + 4}</div>
                </div>
              ))}
            </div>
            <div className="text-xs font-mono text-slate-300">
              Assigned By: <span className="text-emerald-300 font-bold">Device Manufacturer Serial</span>
            </div>
          </div>
        </div>

        {/* First Byte Control Bits Breakdown */}
        <div className="mt-4 p-4 bg-slate-950/90 rounded-lg border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-amber-400 font-bold uppercase">
              First Octet (0x{octets[0]}) Control Bits Analysis
            </span>
            <span className="text-slate-400 font-mono text-[10px]">
              Binary: <span className="text-cyan-300 font-bold">{firstOctetBin}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            {/* I/G Bit */}
            <div
              className={`p-3 rounded-lg border ${
                isBroadcast
                  ? 'bg-purple-950/40 border-purple-500/50 text-purple-300'
                  : isMulticast
                  ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                  : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
              }`}
            >
              <div className="text-[10px] uppercase font-bold text-slate-400">
                Bit 0: Individual / Group (I/G)
              </div>
              <div className="text-base font-black mt-1">
                {isBroadcast
                  ? 'BROADCAST (All 1s)'
                  : isMulticast
                  ? '1 = MULTICAST (Group)'
                  : '0 = UNICAST (Individual)'}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {isMulticast
                  ? 'Frame addressed to subscribed multicast group'
                  : 'Frame addressed to a single physical NIC'}
              </div>
            </div>

            {/* U/L Bit */}
            <div
              className={`p-3 rounded-lg border ${
                isLocalAdmin
                  ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                  : 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300'
              }`}
            >
              <div className="text-[10px] uppercase font-bold text-slate-400">
                Bit 1: Universal / Local (U/L)
              </div>
              <div className="text-base font-black mt-1">
                {isLocalAdmin ? '1 = LOCALLY ADMINISTERED' : '0 = UNIVERSALLY ADMINISTERED'}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {isLocalAdmin
                  ? 'Locally modified by hypervisor / software'
                  : 'Globally unique burned-in IEEE OUI'}
              </div>
            </div>

            {/* Classification Summary */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-400">
                L2 Forwarding Behavior
              </div>
              <div className="text-sm font-bold text-cyan-300 mt-1">
                {isBroadcast
                  ? 'Flooded to all VLAN ports'
                  : isMulticast
                  ? 'Flooded or IGMP Snooped'
                  : 'Forwarded to single CAM port'}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Switches use Destination MAC for CAM table forwarding lookups.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

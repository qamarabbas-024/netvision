'use client';

import React, { useState } from 'react';

interface FramePreset {
  label: string;
  destMac: string;
  srcMac: string;
  etherType: string;
  etherTypeHex: string;
  payloadSize: number;
  hasVlan: boolean;
  vlanId?: number;
  description: string;
}

const FRAME_PRESETS: FramePreset[] = [
  {
    label: 'IPv4 Web Traffic (HTTPS)',
    destMac: '00:1A:2B:3C:4D:5E',
    srcMac: 'E8:6A:64:12:34:56',
    etherType: 'IPv4',
    etherTypeHex: '0x0800',
    payloadSize: 1460,
    hasVlan: false,
    description: 'Standard untagged Ethernet II frame carrying an IPv4 TCP segment.',
  },
  {
    label: 'ARP Request (Broadcast + Padding)',
    destMac: 'FF:FF:FF:FF:FF:FF',
    srcMac: 'E8:6A:64:12:34:56',
    etherType: 'ARP',
    etherTypeHex: '0x0806',
    payloadSize: 28,
    hasVlan: false,
    description: '28-byte ARP payload padded with 18 zero bytes to reach the mandatory 64-byte minimum frame size.',
  },
  {
    label: 'IPv6 Neighbor Discovery',
    destMac: '33:33:00:00:00:01',
    srcMac: 'E8:6A:64:12:34:56',
    etherType: 'IPv6',
    etherTypeHex: '0x86DD',
    payloadSize: 80,
    hasVlan: false,
    description: 'Ethernet II frame carrying an IPv6 ICMPv6 neighbor advertisement.',
  },
  {
    label: '802.1Q VLAN Tagged Frame',
    destMac: '00:1A:2B:3C:4D:5E',
    srcMac: 'E8:6A:64:12:34:56',
    etherType: '802.1Q VLAN Tagged',
    etherTypeHex: '0x8100',
    payloadSize: 1500,
    hasVlan: true,
    vlanId: 100,
    description: 'Carries a 4-byte 802.1Q VLAN tag (TPID 0x8100 + VLAN 100), increasing max untagged frame size from 1518 to 1522 bytes.',
  },
];

export const EthernetFrameVisual: React.FC = () => {
  const [activePreset, setActivePreset] = useState<FramePreset>(FRAME_PRESETS[0]);
  const [customPayload, setCustomPayload] = useState<number>(activePreset.payloadSize);

  const isVlan = activePreset.hasVlan;
  const vlanBytes = isVlan ? 4 : 0;
  const headerBytes = 14 + vlanBytes; // 6 (Dst) + 6 (Src) + (4 VLAN) + 2 (EtherType)
  const fcsBytes = 4;
  const framingOverhead = headerBytes + fcsBytes; // 18 or 22 bytes

  const minPayload = 46;
  const paddingBytes = customPayload < minPayload ? minPayload - customPayload : 0;
  const effectivePayload = customPayload + paddingBytes;
  const totalFrameBytes = headerBytes + effectivePayload + fcsBytes;
  const isRunt = totalFrameBytes < 64;
  const isGiant = totalFrameBytes > (isVlan ? 1522 : 1518);

  const handleSelectPreset = (preset: FramePreset) => {
    setActivePreset(preset);
    setCustomPayload(preset.payloadSize);
  };

  return (
    <div className="space-y-4">
      {/* Preset Toolbar */}
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-xl p-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest">
              Ethernet II Frame Structure & CRC Inspector
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {FRAME_PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handleSelectPreset(preset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  activePreset.label === preset.label
                    ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30 ring-1 ring-cyan-400'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Payload Adjustment Slider */}
        <div className="bg-slate-950/70 p-4 rounded-lg border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-bold">
              Adjust Layer 3 Payload Size: <span className="text-cyan-300">{customPayload} Bytes</span>
            </span>
            <span className="text-slate-400 text-[10px]">
              Min Payload: 46B | Max MTU: 1500B
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={1500}
            value={customPayload}
            onChange={(e) => setCustomPayload(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Frame Structure Dissection Bar */}
        <div className="mt-4 space-y-3">
          <div className="text-xs font-mono text-slate-400 uppercase font-bold">
            Transmitted Frame Byte Layout (Wire Order)
          </div>

          <div className="flex flex-wrap gap-1.5 text-center font-mono">
            {/* Preamble / SFD */}
            <div className="flex-[0.8] min-w-[70px] bg-slate-800/80 border border-slate-700 p-2 rounded-lg">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Preamble/SFD</div>
              <div className="text-xs font-bold text-slate-300 mt-1">8 Bytes</div>
              <div className="text-[9px] text-slate-500 mt-0.5">55..55 D5</div>
            </div>

            {/* Destination MAC */}
            <div className="flex-[1.2] min-w-[95px] bg-cyan-950/60 border border-cyan-500/50 p-2 rounded-lg">
              <div className="text-[10px] text-cyan-400 uppercase font-bold">Dest MAC</div>
              <div className="text-xs font-bold text-cyan-300 mt-1">6 Bytes</div>
              <div className="text-[9px] text-cyan-500 truncate mt-0.5">{activePreset.destMac}</div>
            </div>

            {/* Source MAC */}
            <div className="flex-[1.2] min-w-[95px] bg-emerald-950/60 border border-emerald-500/50 p-2 rounded-lg">
              <div className="text-[10px] text-emerald-400 uppercase font-bold">Source MAC</div>
              <div className="text-xs font-bold text-emerald-300 mt-1">6 Bytes</div>
              <div className="text-[9px] text-emerald-500 truncate mt-0.5">{activePreset.srcMac}</div>
            </div>

            {/* 802.1Q Tag (Conditional) */}
            {isVlan && (
              <div className="flex-[1] min-w-[80px] bg-amber-950/60 border border-amber-500/50 p-2 rounded-lg">
                <div className="text-[10px] text-amber-400 uppercase font-bold">802.1Q Tag</div>
                <div className="text-xs font-bold text-amber-300 mt-1">4 Bytes</div>
                <div className="text-[9px] text-amber-500 mt-0.5">VLAN {activePreset.vlanId}</div>
              </div>
            )}

            {/* EtherType */}
            <div className="flex-[0.9] min-w-[80px] bg-purple-950/60 border border-purple-500/50 p-2 rounded-lg">
              <div className="text-[10px] text-purple-400 uppercase font-bold">EtherType</div>
              <div className="text-xs font-bold text-purple-300 mt-1">2 Bytes</div>
              <div className="text-[9px] text-purple-400 mt-0.5">{activePreset.etherTypeHex}</div>
            </div>

            {/* Payload */}
            <div className="flex-[2.5] min-w-[130px] bg-blue-950/60 border border-blue-500/50 p-2 rounded-lg">
              <div className="text-[10px] text-blue-400 uppercase font-bold">Payload Data</div>
              <div className="text-xs font-bold text-blue-300 mt-1">{customPayload} Bytes</div>
              <div className="text-[9px] text-blue-400 mt-0.5">Layer 3 Packet</div>
            </div>

            {/* Padding (If any) */}
            {paddingBytes > 0 && (
              <div className="flex-[1] min-w-[85px] bg-rose-950/60 border border-rose-500/50 p-2 rounded-lg animate-pulse">
                <div className="text-[10px] text-rose-400 uppercase font-bold">Padding</div>
                <div className="text-xs font-bold text-rose-300 mt-1">+{paddingBytes} Bytes</div>
                <div className="text-[9px] text-rose-400 mt-0.5">0x00 Nulls</div>
              </div>
            )}

            {/* FCS / CRC-32 */}
            <div className="flex-[1] min-w-[80px] bg-amber-950/60 border border-amber-500/50 p-2 rounded-lg">
              <div className="text-[10px] text-amber-400 uppercase font-bold">FCS (CRC-32)</div>
              <div className="text-xs font-bold text-amber-300 mt-1">4 Bytes</div>
              <div className="text-[9px] text-amber-500 mt-0.5">Trailer Check</div>
            </div>
          </div>
        </div>

        {/* Live Frame Telemetry Calculation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-800 text-xs font-mono">
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <div className="text-slate-500 text-[10px] uppercase font-bold">Framing Overhead</div>
            <div className="text-cyan-300 font-bold mt-0.5">{framingOverhead} Bytes</div>
            <div className="text-[10px] text-slate-400 mt-1">Headers (14/18B) + FCS (4B)</div>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <div className="text-slate-500 text-[10px] uppercase font-bold">Padding Added</div>
            <div className="text-rose-300 font-bold mt-0.5">{paddingBytes} Bytes</div>
            <div className="text-[10px] text-slate-400 mt-1">Pad to 46B min payload</div>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <div className="text-slate-500 text-[10px] uppercase font-bold">Total Frame on Wire</div>
            <div className="text-emerald-300 font-bold mt-0.5">{totalFrameBytes} Bytes</div>
            <div className="text-[10px] text-slate-400 mt-1">Excluding 8B Preamble</div>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <div className="text-slate-500 text-[10px] uppercase font-bold">Frame Health Status</div>
            <div
              className={`font-bold mt-0.5 ${
                isRunt
                  ? 'text-rose-400'
                  : isGiant
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {isRunt ? 'RUNT (<64B)' : isGiant ? 'GIANT / JUMBO' : 'VALID 802.3 FRAME'}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {isRunt ? 'Dropped by switches' : 'Accepted by NIC'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

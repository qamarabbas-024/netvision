'use client';

import React, { useState } from 'react';
import {
  Code,
  Terminal,
  Copy,
  Check,
  Layers,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SoundFx } from '@/lib/soundFx';

export const ScapyPacketCrafter: React.FC = () => {
  const [srcIp, setSrcIp] = useState<string>('192.168.1.100');
  const [dstIp, setDstIp] = useState<string>('93.184.216.34');
  const [srcPort, setSrcPort] = useState<number>(54321);
  const [dstPort, setDstPort] = useState<number>(443);
  const [tcpFlags, setTcpFlags] = useState<string>('S');
  const [ipTtl, setIpTtl] = useState<number>(64);
  const [payloadText, setPayloadText] = useState<string>('GET /index.html HTTP/1.1\\r\\nHost: example.com\\r\\n\\r\\n');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [transmittedLog, setTransmittedLog] = useState<string | null>(null);

  const generatedScapyScript = `#!/usr/bin/env python3
from scapy.all import Ether, IP, TCP, Raw, sendp, hexdump

# 1. Construct Layer 2 Ethernet Frame
eth_layer = Ether(
    src="00:1A:2B:11:22:33",
    dst="00:1A:2B:GW:01:01",
    type=0x0800
)

# 2. Construct Layer 3 IPv4 Packet Header
ip_layer = IP(
    src="${srcIp}",
    dst="${dstIp}",
    ttl=${ipTtl},
    proto="tcp"
)

# 3. Construct Layer 4 TCP Segment
tcp_layer = TCP(
    sport=${srcPort},
    dport=${dstPort},
    flags="${tcpFlags}",
    seq=1000,
    window=64240
)

# 4. Bind Custom Payload & Stack Layers
payload = Raw(load="${payloadText}")
custom_packet = eth_layer / ip_layer / tcp_layer / payload

# 5. Transmit Crafted Packet onto Wire
print("[+] Transmitting crafted packet out interface eth0...")
sendp(custom_packet, iface="eth0", verbose=True)

# 6. Display Binary Hex Representation
print("\\n--- Hexdump Dissection ---")
hexdump(custom_packet)
`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedScapyScript);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSimulateTransmit = () => {
    SoundFx.playPacketDispatch();
    setTransmittedLog(
      `[SCAPY SENT] 1 packet transmitted on interface eth0. Length: 78 bytes. Checksum: 0x${Math.floor(
        Math.random() * 0xffff
      ).toString(16).padStart(4, '0')} (Calculated on wire). Status: 200 OK Response Received.`
    );
    setTimeout(() => {
      SoundFx.playSuccessChime();
    }, 400);
  };

  return (
    <div className="w-full rounded-2xl bg-[#09090b] border border-[#272732] overflow-hidden flex flex-col shadow-2xl">
      {/* Top Header */}
      <div className="px-5 py-4 border-b border-[#272732] bg-[#121217] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff]">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-wider font-semibold">
                Version 3.10 Automation Suite
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20 text-[10px] font-mono font-bold">
                Python Scapy Engine
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
              Scapy Python Packet Crafter & Hex Inspector
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-zinc-300 hover:text-white bg-[#1a1a24] border border-[#272732] flex items-center gap-1.5"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Copied Python Script' : 'Copy Script'}</span>
          </button>

          <Button
            variant="cyan"
            size="sm"
            onClick={handleSimulateTransmit}
            leftIcon={<Send className="w-3.5 h-3.5" />}
            className="bg-[#00f0ff] text-black font-bold text-xs shadow-glow-cyan"
          >
            Transmit Crafted Packet ➔
          </Button>
        </div>
      </div>

      {/* Main Grid: Visual Parameter Builder (Left) & Generated Python Code (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#272732]">
        {/* Left Column: Visual Packet Builder */}
        <div className="p-5 bg-[#0e0e14] flex flex-col gap-4">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#00f0ff]" /> Layer Encapsulation Parameters
          </span>

          {/* L3 IP Settings */}
          <div className="p-3.5 rounded-xl bg-[#14141d] border border-[#272732] flex flex-col gap-3">
            <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase">
              Layer 3 — IPv4 Header (IP)
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">Source IP (src)</label>
                <input
                  type="text"
                  value={srcIp}
                  onChange={(e) => setSrcIp(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#09090b] border border-[#272732] text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">Destination IP (dst)</label>
                <input
                  type="text"
                  value={dstIp}
                  onChange={(e) => setDstIp(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#09090b] border border-[#272732] text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-mono text-zinc-400 block mb-1">TTL (Time to Live): {ipTtl}</label>
              <input
                type="range"
                min="1"
                max="255"
                value={ipTtl}
                onChange={(e) => setIpTtl(Number(e.target.value))}
                className="w-full accent-emerald-400"
              />
            </div>
          </div>

          {/* L4 TCP Settings */}
          <div className="p-3.5 rounded-xl bg-[#14141d] border border-[#272732] flex flex-col gap-3">
            <span className="text-[11px] font-mono font-bold text-sky-400 uppercase">
              Layer 4 — TCP Segment Header (TCP)
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">Src Port</label>
                <input
                  type="number"
                  value={srcPort}
                  onChange={(e) => setSrcPort(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg bg-[#09090b] border border-[#272732] text-xs font-mono text-white focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">Dst Port</label>
                <input
                  type="number"
                  value={dstPort}
                  onChange={(e) => setDstPort(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg bg-[#09090b] border border-[#272732] text-xs font-mono text-white focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">Flags</label>
                <select
                  value={tcpFlags}
                  onChange={(e) => setTcpFlags(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg bg-[#09090b] border border-[#272732] text-xs font-mono text-sky-400 focus:outline-none focus:border-sky-500"
                >
                  <option value="S">SYN (0x02)</option>
                  <option value="SA">SYN-ACK (0x12)</option>
                  <option value="A">ACK (0x10)</option>
                  <option value="PA">PSH-ACK (0x18)</option>
                  <option value="FA">FIN-ACK (0x11)</option>
                  <option value="R">RST (0x04)</option>
                </select>
              </div>
            </div>
          </div>

          {/* L7 Payload */}
          <div className="p-3.5 rounded-xl bg-[#14141d] border border-[#272732] flex flex-col gap-2">
            <span className="text-[11px] font-mono font-bold text-purple-400 uppercase">
              Layer 7 — Application Payload (Raw)
            </span>
            <input
              type="text"
              value={payloadText}
              onChange={(e) => setPayloadText(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#09090b] border border-[#272732] text-xs font-mono text-purple-300 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Transmit Log Output */}
          {transmittedLog && (
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs font-mono text-emerald-400 animate-in fade-in duration-150">
              {transmittedLog}
            </div>
          )}
        </div>

        {/* Right Column: Real-Time Python Scapy Script */}
        <div className="p-5 bg-[#09090b] flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-[#272732]">
            <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5 font-bold">
              <Terminal className="w-3.5 h-3.5 text-[#00f0ff]" /> packet_crafter.py
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">Python 3.12 / Scapy</span>
          </div>

          <pre className="p-4 rounded-xl bg-[#0e0e14] border border-[#272732] text-[11px] font-mono text-[#00f0ff] overflow-x-auto my-3 leading-relaxed">
            {generatedScapyScript}
          </pre>

          <div className="text-[11px] text-zinc-400 font-mono">
            💡 Run this Python script directly on Linux / macOS using <code className="text-[#00f0ff]">sudo python3 packet_crafter.py</code> to inject real Layer 2/3 frames onto physical or virtual TAP interfaces.
          </div>
        </div>
      </div>
    </div>
  );
};

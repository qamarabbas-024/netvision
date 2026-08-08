'use client';

import React, { useState } from 'react';
import { Server, Laptop, RefreshCw, CheckCircle } from 'lucide-react';

export const DHCPVisual: React.FC = () => {
  const [stepIndex, setStepIndex] = useState<number>(0);

  const doraSteps = [
    {
      title: 'DHCP DISCOVER (Broadcast)',
      desc: 'New device boots up without an IP address. It broadcasts a DISCOVER packet to 255.255.255.255 asking for an IP assignment.',
      clientMsg: 'Discovering DHCP Server...',
      serverMsg: 'Listening for DISCOVER...',
      color: 'text-cyan-400 border-cyan-400',
    },
    {
      title: 'DHCP OFFER (Unicast/Broadcast)',
      desc: 'DHCP Server receives DISCOVER and offers IP 192.168.1.105 with Subnet 255.255.255.0 and Gateway 192.168.1.1.',
      clientMsg: 'Received OFFER for 192.168.1.105',
      serverMsg: 'OFFER: 192.168.1.105 (Lease 24h)',
      color: 'text-purple-400 border-purple-400',
    },
    {
      title: 'DHCP REQUEST (Broadcast)',
      desc: 'Client accepts the offer and broadcasts a REQUEST packet confirming it wants IP 192.168.1.105.',
      clientMsg: 'Requesting IP 192.168.1.105',
      serverMsg: 'Processing REQUEST...',
      color: 'text-amber-400 border-amber-400',
    },
    {
      title: 'DHCP ACK (Acknowledgement)',
      desc: 'DHCP Server acknowledges the lease, assigns IP 192.168.1.105, DNS 1.1.1.1, and Lease time to the Client.',
      clientMsg: 'BOUND: 192.168.1.105 / 24',
      serverMsg: 'Lease Confirmed (ACK)',
      color: 'text-emerald-400 border-emerald-400',
    },
  ];

  const current = doraSteps[stepIndex];

  return (
    <div className="p-6 rounded-2xl glass-panel border border-[#272732] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-wider font-semibold block mb-1">
            Dynamic Host Configuration Protocol
          </span>
          <h3 className="text-xl font-bold text-white">DHCP DORA 4-Step IP Lease Process</h3>
        </div>

        <button
          onClick={() => setStepIndex(0)}
          className="p-2 rounded-xl bg-[#121217] border border-[#272732] text-zinc-400 hover:text-white"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 rounded-xl bg-[#09090b] border border-[#272732] flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff]">
              <Laptop className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold text-white">Client Node</span>
            <span className="text-[10px] font-mono text-zinc-400">{current.clientMsg}</span>
          </div>

          <div className="flex-1 text-center">
            <span className={`inline-block px-4 py-1.5 rounded-full border text-xs font-mono font-bold uppercase ${current.color}`}>
              {current.title}
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Server className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold text-white">DHCP Server</span>
            <span className="text-[10px] font-mono text-zinc-400">{current.serverMsg}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#121217] border border-[#272732]">
          <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            {stepIndex === 3 && <CheckCircle className="w-4 h-4 text-emerald-400" />} {current.title}
          </h4>
          <p className="text-xs text-zinc-300 leading-relaxed">{current.desc}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-zinc-400">Step {stepIndex + 1} of 4</span>

        <button
          disabled={stepIndex === 3}
          onClick={() => setStepIndex((prev) => Math.min(3, prev + 1))}
          className="px-4 py-2 rounded-xl bg-[#00f0ff] text-black font-bold text-xs hover:bg-[#00f0ff]/90 disabled:opacity-30 transition-all"
        >
          {stepIndex === 3 ? 'DHCP Lease Active!' : 'Next DORA Step →'}
        </button>
      </div>
    </div>
  );
};

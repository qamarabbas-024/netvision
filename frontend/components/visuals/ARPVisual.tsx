'use client';

import React, { useState } from 'react';
import { Laptop, Server, Radio, ArrowRight, ArrowLeft } from 'lucide-react';

export const ARPVisual: React.FC = () => {
  const [step, setStep] = useState<'idle' | 'broadcast' | 'reply'>('idle');

  return (
    <div className="p-6 rounded-2xl glass-panel border border-[#272732] flex flex-col gap-6">
      <div>
        <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-wider font-semibold block mb-1">
          Layer 2 Address Resolution Protocol
        </span>
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Radio className="w-5 h-5 text-[#00f0ff]" /> ARP Protocol Simulation (IP ➔ MAC Address)
        </h3>
      </div>

      <div className="p-6 rounded-xl bg-[#09090b] border border-[#272732] flex flex-col gap-6">
        {/* Nodes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Laptop A */}
          <div className={`p-4 rounded-xl border transition-all text-center flex flex-col items-center gap-2 ${
            step === 'broadcast' ? 'border-[#00f0ff] bg-[#00f0ff]/10 shadow-glow-cyan' : 'border-[#272732] bg-[#121217]'
          }`}>
            <Laptop className="w-8 h-8 text-[#00f0ff]" />
            <span className="text-xs font-bold text-white">Laptop A (Sender)</span>
            <span className="text-[10px] font-mono text-zinc-400">IP: 192.168.1.10</span>
            <span className="text-[10px] font-mono text-zinc-400">MAC: AA:BB:CC:11:22:33</span>
          </div>

          {/* Switch Network */}
          <div className="p-4 rounded-xl border border-[#272732] bg-[#121217] text-center flex flex-col items-center justify-center gap-2">
            <Radio className="w-8 h-8 text-amber-400 animate-pulse" />
            <span className="text-xs font-bold text-white">L2 Switch</span>
            <span className="text-[10px] font-mono text-amber-400">
              {step === 'broadcast' ? 'BROADCAST (FF:FF:FF:FF:FF:FF)' : step === 'reply' ? 'UNICAST REPLY' : 'READY'}
            </span>
          </div>

          {/* Device B */}
          <div className={`p-4 rounded-xl border transition-all text-center flex flex-col items-center gap-2 ${
            step === 'reply' ? 'border-emerald-400 bg-emerald-400/10' : 'border-[#272732] bg-[#121217]'
          }`}>
            <Server className="w-8 h-8 text-emerald-400" />
            <span className="text-xs font-bold text-white">Device B (Target)</span>
            <span className="text-[10px] font-mono text-zinc-400">IP: 192.168.1.50</span>
            <span className="text-[10px] font-mono text-zinc-400">MAC: 44:55:66:77:88:99</span>
          </div>
        </div>

        {/* Step Explanation Banner */}
        <div className="p-4 rounded-xl bg-[#121217] border border-[#272732]">
          {step === 'idle' && (
            <p className="text-xs text-zinc-300">
              Laptop A wants to send an IP packet to <strong>192.168.1.50</strong>, but doesn't know its MAC address. Click <strong>"Send ARP Request Broadcast"</strong>.
            </p>
          )}

          {step === 'broadcast' && (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-[#00f0ff] flex items-center gap-1">
                <ArrowRight className="w-4 h-4" /> ARP Request Broadcast Sent to FF:FF:FF:FF:FF:FF
              </span>
              <p className="text-xs text-zinc-300 font-mono">
                "Who has 192.168.1.50? Tell 192.168.1.10 (MAC AA:BB:CC:11:22:33)"
              </p>
            </div>
          )}

          {step === 'reply' && (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> ARP Reply Unicast Received by Laptop A
              </span>
              <p className="text-xs text-zinc-300 font-mono">
                "192.168.1.50 is at 44:55:66:77:88:99. Added to Laptop A ARP Cache!"
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep('idle')}
          className="text-xs font-bold text-zinc-400 hover:text-white"
        >
          Reset Simulation
        </button>

        {step === 'idle' && (
          <button
            onClick={() => setStep('broadcast')}
            className="px-4 py-2 rounded-xl bg-[#00f0ff] text-black font-bold text-xs hover:bg-[#00f0ff]/90 transition-all"
          >
            1. Send ARP Request Broadcast ➔
          </button>
        )}

        {step === 'broadcast' && (
          <button
            onClick={() => setStep('reply')}
            className="px-4 py-2 rounded-xl bg-emerald-400 text-black font-bold text-xs hover:bg-emerald-300 transition-all"
          >
            2. Send ARP Unicast Reply ➔
          </button>
        )}

        {step === 'reply' && (
          <span className="text-xs font-mono font-bold text-emerald-400">✓ ARP Cache Updated</span>
        )}
      </div>
    </div>
  );
};

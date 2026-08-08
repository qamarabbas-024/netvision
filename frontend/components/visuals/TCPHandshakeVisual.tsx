'use client';

import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, RefreshCw, CheckCircle2, Server, Laptop } from 'lucide-react';

export const TCPHandshakeVisual: React.FC = () => {
  const [step, setStep] = useState<number>(0);

  const steps = [
    {
      title: 'Initial Closed State',
      desc: 'Client wants to establish a reliable TCP session with Server on Port 443.',
      clientSeq: 'ISN = 1000',
      serverSeq: 'Listening (CLOSED)',
      action: 'Click "Send SYN Packet" to initiate 3-way handshake',
      direction: 'none',
      flag: 'IDLE',
    },
    {
      title: 'Step 1: SYN Packet Sent',
      desc: 'Client sends SYN (Synchronize Sequence Numbers) packet to Server with ISN=1000.',
      clientSeq: 'SYN Sent (Seq=1000)',
      serverSeq: 'Processing SYN...',
      action: 'Client asks: "Can we connect? Here is my initial sequence number 1000."',
      direction: 'right',
      flag: 'SYN [Seq=1000]',
    },
    {
      title: 'Step 2: SYN-ACK Packet Received',
      desc: 'Server acknowledges Client SYN (Ack=1001) and sends its own SYN (Seq=5000).',
      clientSeq: 'SYN-ACK Received',
      serverSeq: 'SYN-ACK Sent (Seq=5000, Ack=1001)',
      action: 'Server replies: "Yes! I acknowledge 1000 (+1 = 1001). Here is my sequence number 5000."',
      direction: 'left',
      flag: 'SYN-ACK [Seq=5000, Ack=1001]',
    },
    {
      title: 'Step 3: ACK Packet Sent & Connection ESTABLISHED',
      desc: 'Client acknowledges Server SYN (Ack=5001). Connection is now fully established!',
      clientSeq: 'ESTABLISHED (Ack=5001)',
      serverSeq: 'ESTABLISHED',
      action: 'Client replies: "Got your 5000 (+1 = 5001). We are ready to stream HTTP data securely!"',
      direction: 'right',
      flag: 'ACK [Ack=5001]',
    },
  ];

  const current = steps[step];

  return (
    <div className="p-6 rounded-2xl glass-panel border border-[#272732] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-wider font-semibold block mb-1">
            Interactive Handshake Simulator
          </span>
          <h3 className="text-xl font-bold text-white">TCP 3-Way Handshake (SYN → SYN-ACK → ACK)</h3>
        </div>

        <button
          onClick={() => setStep(0)}
          className="p-2 rounded-xl bg-[#121217] border border-[#272732] text-zinc-400 hover:text-white transition-colors"
          title="Reset Simulation"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Visual Animation Box */}
      <div className="p-6 rounded-xl bg-[#09090b] border border-[#272732] flex items-center justify-between gap-4 relative overflow-hidden">
        {/* Client Node */}
        <div className="flex flex-col items-center gap-2 z-10">
          <div className="w-14 h-14 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff]">
            <Laptop className="w-7 h-7" />
          </div>
          <span className="text-xs font-bold text-white">Client (192.168.1.50)</span>
          <span className="text-[10px] font-mono text-zinc-400">{current.clientSeq}</span>
        </div>

        {/* Packet In Transit Animation */}
        <div className="flex-1 flex flex-col items-center justify-center relative px-4">
          <div className="w-full h-0.5 bg-zinc-800 relative">
            {current.direction === 'right' && (
              <div className="absolute top-1/2 -translate-y-1/2 left-0 animate-ping w-4 h-4 rounded-full bg-[#00f0ff]" />
            )}
            {current.direction === 'left' && (
              <div className="absolute top-1/2 -translate-y-1/2 right-0 animate-ping w-4 h-4 rounded-full bg-purple-400" />
            )}
          </div>

          <div className="mt-3 px-3 py-1 rounded-full bg-[#121217] border border-[#00f0ff]/30 font-mono text-xs text-[#00f0ff] flex items-center gap-2">
            {current.direction === 'right' && <ArrowRight className="w-3.5 h-3.5 text-[#00f0ff]" />}
            {current.direction === 'left' && <ArrowLeft className="w-3.5 h-3.5 text-purple-400" />}
            <span>{current.flag}</span>
          </div>
        </div>

        {/* Server Node */}
        <div className="flex flex-col items-center gap-2 z-10">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Server className="w-7 h-7" />
          </div>
          <span className="text-xs font-bold text-white">Server (93.184.216.34)</span>
          <span className="text-[10px] font-mono text-zinc-400">{current.serverSeq}</span>
        </div>
      </div>

      {/* Step Description & Controls */}
      <div className="p-4 rounded-xl bg-[#121217] border border-[#272732] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            {step === 3 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />} {current.title}
          </h4>
          <p className="text-xs text-zinc-400 mt-1">{current.desc}</p>
        </div>

        <button
          disabled={step === 3}
          onClick={() => setStep((prev) => Math.min(3, prev + 1))}
          className="px-4 py-2 rounded-xl bg-[#00f0ff] text-black font-bold text-xs hover:bg-[#00f0ff]/90 disabled:opacity-30 disabled:hover:bg-[#00f0ff] transition-all shrink-0"
        >
          {step === 3 ? 'Connection Established!' : 'Next Handshake Step →'}
        </button>
      </div>
    </div>
  );
};

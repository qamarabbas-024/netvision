'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const InteractivePreview: React.FC = () => {
  const [activeProtocol, setActiveProtocol] = useState<'TCP' | 'DNS' | 'ARP'>('TCP');
  const [packetProgress, setPacketProgress] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleDispatch = () => {
    setIsSimulating(true);
    setPacketProgress(0);

    const interval = setInterval(() => {
      setPacketProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSimulating(false);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleReset = () => {
    setPacketProgress(0);
    setIsSimulating(false);
  };

  const protocolDetails = {
    TCP: {
      title: 'TCP 3-Way Handshake (SYN -> SYN-ACK -> ACK)',
      desc: 'Simulate how reliable connections are established between client and server.',
      payload: 'SYN [Seq=100, Win=65535, MSS=1460]',
    },
    DNS: {
      title: 'DNS Resolution Query (A Record)',
      desc: 'Watch your computer query the DNS Server for netvision.edu IP address.',
      payload: 'QUERY netvision.edu IN A -> 172.16.0.5',
    },
    ARP: {
      title: 'ARP Request Broadcast (Who has 10.0.0.1?)',
      desc: 'Observe Layer 2 MAC address resolution across the local subnet.',
      payload: 'BROADCAST ff:ff:ff:ff:ff:ff -> Target IP 10.0.0.1',
    },
  };

  return (
    <section id="demo" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest font-semibold mb-2 block">
            Hands-On Experience
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Interactive Packet Visualizer Demo
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            Test the NetVision simulation engine right now. Select a protocol, click dispatch, and inspect live packet flags.
          </p>
        </div>

        {/* Demo Card */}
        <Card className="max-w-4xl mx-auto p-4 sm:p-8 glass-panel-glow border-[#00f0ff]/30 shadow-2xl">
          {/* Protocol Selector Tabs */}
          <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 border-b border-[#272732] pb-4 overflow-x-auto">
            {(['TCP', 'DNS', 'ARP'] as const).map((proto) => (
              <button
                key={proto}
                onClick={() => {
                  setActiveProtocol(proto);
                  handleReset();
                }}
                className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 ${
                  activeProtocol === proto
                    ? 'bg-[#00f0ff] text-black shadow-glow-cyan'
                    : 'bg-[#181820] text-zinc-400 hover:text-white border border-[#272732]'
                }`}
              >
                {proto} Protocol
              </button>
            ))}
          </div>

          {/* Topology Canvas Display */}
          <div className="relative h-44 sm:h-48 bg-[#09090b] rounded-2xl border border-[#272732] flex items-center justify-between px-4 sm:px-12 mb-6 overflow-hidden">
            {/* Connecting Wire */}
            <div className="absolute top-1/2 left-10 sm:left-20 right-10 sm:right-20 h-1 bg-[#272732] -translate-y-1/2" />
            <div
              className="absolute top-1/2 left-10 sm:left-20 h-1 bg-[#00f0ff] shadow-glow-cyan -translate-y-1/2 transition-all duration-150"
              style={{ width: `${(packetProgress / 100) * 75}%` }}
            />

            {/* Source Node */}
            <div className="relative z-10 flex flex-col items-center gap-1.5 sm:gap-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Cpu className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-[11px] sm:text-xs font-mono font-bold text-zinc-300">Client PC</span>
            </div>

            {/* Moving Packet Marker */}
            {packetProgress > 0 && packetProgress < 100 ? (
              <motion.div
                className="absolute z-20 top-1/2 -translate-y-1/2 px-2 sm:px-3 py-1 rounded-lg bg-[#00f0ff] text-black font-mono text-[9px] sm:text-[10px] font-bold shadow-glow-cyan whitespace-nowrap"
                style={{ left: `calc(15% + ${(packetProgress / 100) * 65}%)` }}
              >
                {activeProtocol} Packet
              </motion.div>
            ) : null}

            {/* Destination Node */}
            <div className="relative z-10 flex flex-col items-center gap-1.5 sm:gap-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-[11px] sm:text-xs font-mono font-bold text-zinc-300">Server Node</span>
            </div>
          </div>

          {/* Packet Details & Inspector */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-[#121217] border border-[#272732] mb-6 font-mono text-xs text-zinc-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2 mb-2">
              <span className="text-white font-bold text-xs sm:text-sm">{protocolDetails[activeProtocol].title}</span>
              <span className="text-emerald-400 flex items-center gap-1 text-[11px] shrink-0">
                {packetProgress === 100 ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
                {packetProgress === 100 ? 'Packet Delivered' : `Progress: ${packetProgress}%`}
              </span>
            </div>
            <p className="text-zinc-400 text-[11px] mb-2 leading-relaxed">{protocolDetails[activeProtocol].desc}</p>
            <div className="p-2 rounded bg-black/60 border border-zinc-800 text-[#00f0ff] overflow-x-auto whitespace-nowrap text-[11px]">
              Payload Header: {protocolDetails[activeProtocol].payload}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <Button
              variant="cyan"
              onClick={handleDispatch}
              isLoading={isSimulating}
              leftIcon={<Play className="w-4 h-4" />}
              className="justify-center"
            >
              Dispatch {activeProtocol} Packet
            </Button>
            <Button variant="ghost" onClick={handleReset} leftIcon={<RotateCcw className="w-4 h-4" />} className="justify-center">
              Reset Animation
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

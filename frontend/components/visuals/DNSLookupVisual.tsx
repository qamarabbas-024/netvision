'use client';

import React, { useState } from 'react';
import { Globe, ArrowRight, Search } from 'lucide-react';

export const DNSLookupVisual: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      step: 1,
      name: 'Browser Request',
      node: 'User Browser',
      target: 'Recursive Resolver (1.1.1.1)',
      desc: 'User types "youtube.com". Browser checks local cache. If missing, it queries Recursive DNS Resolver.',
      ip: 'Unknown',
    },
    {
      step: 2,
      name: 'Root Server Query',
      node: 'Recursive Resolver',
      target: 'Root DNS Server (.)',
      desc: 'Resolver asks Root Server: "Where is the TLD server for .com?" Root server returns .com TLD IP.',
      ip: 'Root Server IP: 198.41.0.4',
    },
    {
      step: 3,
      name: 'TLD Server Query',
      node: 'Recursive Resolver',
      target: '.COM TLD Server',
      desc: 'Resolver asks .COM TLD: "Where is youtube.com?" TLD returns Authoritative Name Server IP for Google DNS.',
      ip: 'TLD Server IP: 192.5.6.30',
    },
    {
      step: 4,
      name: 'Authoritative Answer',
      node: 'Recursive Resolver',
      target: 'Authoritative DNS (ns1.google.com)',
      desc: 'Resolver queries Authoritative server. Authoritative server returns exact IP: 142.250.190.46.',
      ip: 'Discovered IP: 142.250.190.46',
    },
    {
      step: 5,
      name: 'Connection Opened',
      node: 'User Browser',
      target: 'YouTube Server (142.250.190.46)',
      desc: 'Browser caches IP (142.250.190.46) and opens TCP/HTTPS socket directly to YouTube Web Server.',
      ip: 'Resolved: 142.250.190.46',
    },
  ];

  const current = steps[activeStep];

  return (
    <div className="p-6 rounded-2xl glass-panel border border-[#272732] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-wider font-semibold block mb-1">
            Real-World Scenario Visualizer
          </span>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#00f0ff]" /> DNS Resolution Journey (youtube.com → IP)
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {steps.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => setActiveStep(idx)}
              className={`w-7 h-7 rounded-lg font-mono text-xs font-bold transition-all ${
                activeStep === idx
                  ? 'bg-[#00f0ff] text-black shadow-glow-cyan'
                  : 'bg-[#121217] border border-[#272732] text-zinc-400 hover:text-white'
              }`}
            >
              {s.step}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-xl bg-[#09090b] border border-[#272732] flex flex-col gap-4">
        <div className="flex items-center justify-between font-mono text-xs text-zinc-400 border-b border-[#272732] pb-3">
          <span>QUERY: <strong className="text-white">youtube.com</strong></span>
          <span>STEP {current.step} OF 5</span>
        </div>

        <div className="flex items-center justify-center gap-4 py-6">
          <div className="p-4 rounded-xl bg-[#121217] border border-[#00f0ff]/30 text-center min-w-[140px]">
            <span className="text-[10px] font-mono text-zinc-500 block">SENDER</span>
            <span className="text-sm font-bold text-white block">{current.node}</span>
          </div>

          <div className="flex flex-col items-center gap-1 text-[#00f0ff]">
            <ArrowRight className="w-6 h-6 animate-pulse" />
            <span className="text-[10px] font-mono">Recursive Query</span>
          </div>

          <div className="p-4 rounded-xl bg-[#121217] border border-purple-500/30 text-center min-w-[140px]">
            <span className="text-[10px] font-mono text-zinc-500 block">DESTINATION</span>
            <span className="text-sm font-bold text-purple-300 block">{current.target}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#121217] border border-[#272732]">
          <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <Search className="w-4 h-4 text-[#00f0ff]" /> {current.name}
          </h4>
          <p className="text-xs text-zinc-300 leading-relaxed mb-3">{current.desc}</p>
          <div className="inline-block px-3 py-1 rounded-lg bg-black/50 border border-emerald-500/30 font-mono text-xs text-emerald-400">
            {current.ip}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          disabled={activeStep === 0}
          onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
          className="text-xs font-bold text-zinc-400 hover:text-white disabled:opacity-30"
        >
          ← Previous Step
        </button>

        <button
          disabled={activeStep === 4}
          onClick={() => setActiveStep((prev) => Math.min(4, prev + 1))}
          className="px-4 py-2 rounded-xl bg-[#00f0ff] text-black font-bold text-xs hover:bg-[#00f0ff]/90 disabled:opacity-30 transition-all"
        >
          {activeStep === 4 ? 'Lookup Completed!' : 'Next DNS Step →'}
        </button>
      </div>
    </div>
  );
};

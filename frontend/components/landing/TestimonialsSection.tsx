'use client';

import React from 'react';

export const TestimonialsSection: React.FC = () => {
  const pillars = [
    {
      title: 'Visual Packet Tracing',
      desc: 'Watch packets flow between switches and routers in real time. Inspect header fields, protocol flags, and payloads at every hop.',
      tag: 'VISUAL INSTRUCTION',
    },
    {
      title: 'Deterministic CLI Sandbox',
      desc: 'Practice real terminal commands (`ping`, `traceroute`, `show ip route`) inside a lightweight, browser-based simulation engine.',
      tag: 'HANDS-ON PRACTICE',
    },
    {
      title: 'Server-Authoritative Credentials',
      desc: 'Earn verifiable digital certificates backed by server-validated exam submissions and anti-cheat progress checks.',
      tag: 'VERIFIABLE MASTERY',
    },
  ];

  return (
    <section className="py-16 sm:py-20 relative bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest font-semibold mb-2 block">
            Core Philosophy
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3 font-sans">
            Built for Technical Clarity & Deep Understanding
          </h2>
          <p className="text-sm text-zinc-300 font-sans">
            Designed from the ground up to replace passive reading with active, visual, hands-on networking practice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {pillars.map((p, idx) => (
            <div
              key={idx}
              className="glass-panel p-6 rounded-xl border border-[#272732] flex flex-col justify-between hover:border-zinc-700 transition-colors"
            >
              <div>
                <span className="text-[11px] font-mono text-[#00f0ff] uppercase tracking-wider font-semibold mb-3 block">
                  {p.tag}
                </span>
                <h3 className="text-lg font-bold text-white mb-2 font-sans">{p.title}</h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

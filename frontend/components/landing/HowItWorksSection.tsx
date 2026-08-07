'use client';

import React from 'react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Pick a Networking Topic',
      desc: 'Select from TCP/IP, DNS, Subnetting, Routing, Firewalls, or Wireless networking modules.',
    },
    {
      step: '02',
      title: 'Observe Packet Animations',
      desc: 'Watch real-time 60 FPS visual packet flows across routers, switches, and client devices.',
    },
    {
      step: '03',
      title: 'Experiment in the Sandbox',
      desc: 'Build custom network topologies, change IP configurations, and test network packet delivery.',
    },
    {
      step: '04',
      title: 'Pass Labs & Earn Certificates',
      desc: 'Complete interactive quizzes and troubleshoot broken scenarios to earn verified digital credentials.',
    },
  ];

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest font-semibold mb-2 block">
            Simple 4-Step Pathway
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            How NetVision Works
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            From zero networking knowledge to building and troubleshooting complex network topologies.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="glass-panel p-8 rounded-2xl border border-[#272732] flex flex-col justify-between hover:border-[#00f0ff]/40 transition-colors group"
            >
              <div>
                <span className="text-4xl font-extrabold text-[#00f0ff] font-mono mb-4 block group-hover:scale-110 transition-transform">
                  {s.step}
                </span>
                <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

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
    <section className="py-16 sm:py-20 relative bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest font-semibold mb-2 block">
            4-Step Learning Pathway
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3 font-sans">
            How NetVision Works
          </h2>
          <p className="text-zinc-300 text-sm font-sans">
            Progress from digital foundations to building, inspecting, and troubleshooting live networking topologies.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="glass-panel p-6 rounded-xl border border-[#272732] flex flex-col justify-between hover:border-zinc-700 transition-colors"
            >
              <div>
                <span className="text-3xl font-extrabold text-[#00f0ff] font-mono mb-3 block">
                  {s.step}
                </span>
                <h3 className="text-base font-bold text-white mb-2 font-sans">{s.title}</h3>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

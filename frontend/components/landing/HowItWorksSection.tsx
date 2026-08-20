'use client';

import React from 'react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Conceptual Intuition',
      desc: 'Understand the underlying protocol theory and architectural design through concise, highly focused technical explanations.',
    },
    {
      step: '02',
      title: 'Interactive Manipulation',
      desc: 'Manipulate live parameters, adjust frame flags, and observe deterministic 60 FPS packet flows across multi-hop topologies.',
    },
    {
      step: '03',
      title: 'Practical CLI Execution',
      desc: 'Execute real diagnostic commands (ping, traceroute, nslookup, ipconfig) inside the browser-based simulation terminal.',
    },
    {
      step: '04',
      title: 'Mastery Verification',
      desc: 'Solve scenario-based troubleshooting incidents and earn cryptographically verified credentials backed by server validation.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 relative surface-0 font-sans border-b border-[#2a2e39]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs font-mono text-[#38bdf8] uppercase tracking-widest font-semibold mb-2 block">
            PEDAGOGICAL BLUEPRINT
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f4f5f7] tracking-tight mb-3">
            How NetVision Teaches
          </h2>
          <p className="text-[#8e95a5] text-sm leading-relaxed">
            Progress from physical bits to building, inspecting, and diagnosing live networked systems.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="surface-2 p-5 rounded-xl border border-[#2a2e39] flex flex-col justify-between hover:border-[#38bdf8]/30 transition-all shadow-instrument"
            >
              <div>
                <span className="text-2xl font-extrabold text-[#38bdf8] font-mono mb-3 block">
                  {s.step}
                </span>
                <h3 className="text-sm font-bold text-[#f4f5f7] mb-2">{s.title}</h3>
                <p className="text-xs text-[#8e95a5] leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

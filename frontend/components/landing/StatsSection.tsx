'use client';

import React from 'react';

export const StatsSection: React.FC = () => {
  const stats = [
    { value: '100,000+', label: 'Active Students Worldwide', detail: 'Computer Science & IT majors' },
    { value: '50+', label: 'Interactive Packet Simulations', detail: 'DNS, ARP, TCP, ICMP, Routing' },
    { value: '99.4%', label: 'Concept Mastery Rate', detail: 'Visual intuition over memorization' },
    { value: '$0', label: '100% Free Forever', detail: 'Open access for all learners' },
  ];

  return (
    <section className="py-16 border-y border-[#272732]/60 glass-panel relative">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {stats.map((s, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-mono bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-[#00f0ff] mb-2">
              {s.value}
            </span>
            <span className="text-sm font-bold text-zinc-200 mb-1">{s.label}</span>
            <span className="text-xs text-zinc-500">{s.detail}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

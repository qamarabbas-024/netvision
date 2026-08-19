'use client';

import React from 'react';

export const StatsSection: React.FC = () => {
  const stats = [
    { value: '30+', label: 'Curriculum Benchmark Lessons', detail: 'Foundational through Advanced' },
    { value: '20+', label: 'Interactive CLI Diagnostic Labs', detail: 'Deterministic web sandbox execution' },
    { value: '4 Tiers', label: 'Structured Progression Levels', detail: 'Foundation → Beginner → Intermediate → Advanced' },
    { value: '100%', label: 'Open Access & Guest Support', detail: 'Instant learning without registration friction' },
  ];

  return (
    <section className="py-12 border-y border-[#272732] bg-[#121217]/50 relative">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {stats.map((s, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono mb-1 text-[#00f0ff]">
              {s.value}
            </span>
            <span className="text-xs sm:text-sm font-bold text-zinc-200 mb-1 font-sans">{s.label}</span>
            <span className="text-[11px] text-zinc-400 font-sans">{s.detail}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

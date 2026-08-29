'use client';

import React from 'react';
import { Box, Network, Terminal, Wrench, Award } from 'lucide-react';

export const FeatureBarSection: React.FC = () => {
  const features = [
    {
      title: 'Live Packet Visualization',
      desc: 'Watch DNS, TCP, ICMP and more in real-time 3D.',
      icon: <Box className="w-5 h-5 text-[#38bdf8]" />,
    },
    {
      title: 'Interactive Sandbox Lab',
      desc: 'Build, break and fix networks in a drag & drop environment.',
      icon: <Network className="w-5 h-5 text-[#22c55e]" />,
    },
    {
      title: 'Real CLI Experience',
      desc: 'Run real commands inside the built-in terminal.',
      icon: <Terminal className="w-5 h-5 text-[#22c55e]" />,
    },
    {
      title: 'Network Troubleshooting',
      desc: 'Diagnose real-world issues with guided scenarios.',
      icon: <Wrench className="w-5 h-5 text-[#22c55e]" />,
    },
    {
      title: 'Industry Certifications',
      desc: 'Earn verifiable certificates and boost your career.',
      icon: <Award className="w-5 h-5 text-[#22c55e]" />,
    },
  ];

  return (
    <section className="py-6 bg-[#070a10] border-b border-[#1b2230] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#0c1017] border border-[#1e293b] hover:border-[#22c55e]/40 transition-all flex flex-col justify-between shadow-sm group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#0f172a] border border-[#1e293b] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-sm font-bold text-white mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

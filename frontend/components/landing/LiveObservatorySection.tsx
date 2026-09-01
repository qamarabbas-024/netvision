'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Layers, Globe, Terminal, RefreshCw } from 'lucide-react';
import { NetworkScenario } from '@/types/network';

interface LiveObservatorySectionProps {
  onOpenTerminal: () => void;
  scenario: NetworkScenario;
  onScenarioChange: (scenario: NetworkScenario) => void;
}

export const LiveObservatorySection: React.FC<LiveObservatorySectionProps> = ({
  scenario,
  onScenarioChange,
}) => {
  const [isLoopDegraded, setIsLoopDegraded] = useState(scenario !== 'healthy');

  const handleToggleLoop = () => {
    if (isLoopDegraded) {
      setIsLoopDegraded(false);
      onScenarioChange('healthy');
    } else {
      setIsLoopDegraded(true);
      onScenarioChange('degraded');
    }
  };

  const courseCards = [
    {
      num: '01',
      title: 'Digital & Physical Foundations',
      slug: 'net-101-digital-foundations',
      desc: 'Understand core digital communications, binary arithmetic, signal processing, and physical interfaces.',
      tag: 'FOUNDATIONAL',
      tagColor: 'text-[#38bdf8] bg-[#0284c7]/15 border-[#0284c7]/30',
      icon: <Layers className="w-4 h-4 text-[#38bdf8]" />,
    },
    {
      num: '02',
      title: 'Network Architecture & Frameworks',
      slug: 'net-201-layer2-ethernet',
      desc: 'Explore the design of scalable, resilient networks, Ethernet frames, and CAM MAC table learning mechanics.',
      tag: 'BEGINNER',
      tagColor: 'text-[#34d399] bg-[#10b981]/15 border-[#10b981]/30',
      icon: <Terminal className="w-4 h-4 text-[#34d399]" />,
    },
    {
      num: '03',
      title: 'IPv4 Addressing & Classless Subnetting',
      slug: 'net-301-vlan-switching',
      desc: 'Master the principles of IPv4 addressing, variable length subnet masks (VLSM), and CIDR routing tables.',
      tag: 'INTERMEDIATE',
      tagColor: 'text-[#34d399] bg-[#10b981]/15 border-[#10b981]/30',
      icon: <Globe className="w-4 h-4 text-[#34d399]" />,
    },
  ];

  return (
    <section id="live-observatory-section" className="relative w-full bg-[#0b0f17] border-b border-[#1e293b]/70 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: Left Large Observatory Card (~45%) and Right 3 Course Cards (~55%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Card: Interactive Live Network Observatory */}
          <div className="lg:col-span-5 bg-[#090d16] border border-slate-800/90 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-xl relative overflow-hidden font-sans">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Interactive Live Network Observatory
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                Real-time routing loop graphics, packet verification, and automated link failover analysis.
              </p>

              {/* Action Button */}
              <div className="pt-1">
                <Link
                  href="/simulations"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#10b981] hover:bg-[#059669] text-[#051a14] hover:text-white font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Racetrack Loop Visualizer Graphic matching blueprint */}
              <div className="relative h-44 sm:h-48 mt-4 rounded-xl bg-[#060a12] border border-slate-800/80 overflow-hidden flex items-center justify-center">
                {/* Tech grid */}
                <div className="absolute inset-0 bg-tech-grid opacity-15 pointer-events-none" />

                <svg className="w-full h-full p-2" viewBox="0 0 400 180">
                  <defs>
                    <linearGradient id="loopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="50%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>

                  {/* Outer Racetrack Path */}
                  <rect
                    x="30"
                    y="25"
                    width="340"
                    height="130"
                    rx="65"
                    fill="none"
                    stroke={isLoopDegraded ? '#f59e0b' : 'url(#loopGrad)'}
                    strokeWidth="3"
                    strokeDasharray={isLoopDegraded ? '6 4' : 'none'}
                    className="opacity-90"
                  />

                  {/* Inner Track Ring */}
                  <rect
                    x="65"
                    y="45"
                    width="270"
                    height="90"
                    rx="45"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="1.5"
                  />

                  {/* Traveling Data Packets */}
                  <circle r="4" fill="#34d399">
                    <animateMotion
                      path="M 95 25 L 305 25 A 65 65 0 0 1 305 155 L 95 155 A 65 65 0 0 1 95 25"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle r="3.5" fill="#22d3ee">
                    <animateMotion
                      path="M 305 155 L 95 155 A 65 65 0 0 1 95 25 L 305 25 A 65 65 0 0 1 305 155"
                      dur="3.2s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Node 1: Router (Left) */}
                  <g transform="translate(95, 90)">
                    <circle r="16" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                    <text y="3" textAnchor="middle" fill="#34d399" fontSize="8" fontWeight="bold">R1</text>
                  </g>

                  {/* Node 2: Firewall Shield (Center) */}
                  <g transform="translate(200, 90)">
                    <rect x="-14" y="-14" width="28" height="28" rx="6" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
                    <text y="4" textAnchor="middle" fill="#22d3ee" fontSize="8" fontWeight="bold">FW</text>
                  </g>

                  {/* Node 3: Switch/Server (Right) */}
                  <g transform="translate(305, 90)">
                    <circle r="16" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                    <text y="3" textAnchor="middle" fill="#34d399" fontSize="8" fontWeight="bold">SRV</text>
                  </g>
                </svg>

                {/* Status Toggle Button in visualizer */}
                <button
                  onClick={handleToggleLoop}
                  className="absolute bottom-2 right-2 px-2.5 py-1 rounded bg-[#0b1320]/90 border border-slate-700 text-[10px] font-mono text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3 text-emerald-400" />
                  <span>{isLoopDegraded ? 'Fix Loop' : 'Inject Loop'}</span>
                </button>
              </div>
            </div>

            <div className="pt-3 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span className="text-emerald-400 font-medium">● LIVE TELEMETRY STREAM</span>
              <span>100% Deterministic</span>
            </div>
          </div>

          {/* Right Cards: 3 Glassmorphism Course Cards (01, 02, 03) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
            {courseCards.map((card) => (
              <Link
                key={card.num}
                href={`/courses/${card.slug}`}
                className="group relative bg-[#090d16]/90 hover:bg-[#0f172a] border border-slate-800/90 hover:border-slate-700 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between shadow-lg cursor-pointer"
              >
                <div>
                  {/* Top Tag */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/60 font-mono">
                    <span className="text-sm font-extrabold text-emerald-400 font-mono">
                      {card.num}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full border text-[9px] font-mono font-bold ${card.tagColor}`}>
                      {card.tag}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="w-7 h-7 rounded-lg bg-[#06131c] border border-slate-800 flex items-center justify-center mb-3">
                    {card.icon}
                  </div>

                  {/* Title */}
                  <h4 className="text-sm font-bold text-slate-100 group-hover:text-white leading-snug mb-2">
                    {card.title}
                  </h4>

                  {/* Description */}
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {card.desc}
                  </p>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-[#38bdf8] group-hover:text-[#22d3ee]">
                  <span>Explore Course</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

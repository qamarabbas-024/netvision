'use client';

import React, { useState } from 'react';
import { Cable, Zap, Radio, Layers, CheckCircle2, ShieldCheck } from 'lucide-react';

export const MediaInspectorVisual: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'copper' | 'fiber' | 'transceiver' | 'poe' | 'workbench'>('copper');
  const [selectedScenario, setSelectedScenario] = useState<number>(0);

  const scenarios = [
    {
      title: 'Office PC to Floor Switch',
      distance: '25 meters',
      environment: 'Standard indoor commercial office',
      powerNeed: 'None (PC plugged into wall)',
      speedNeed: '1 Gbps',
      bestChoice: 'Cat6 Copper UTP (RJ-45)',
      reason: 'Under 100m distance limit, highly cost-effective, standard RJ-45 switch ports.',
      category: 'Copper',
    },
    {
      title: 'Inter-Building Campus Backbone',
      distance: '800 meters',
      environment: 'Outdoor underground conduits between separate campus buildings',
      powerNeed: 'None',
      speedNeed: '10 Gbps',
      bestChoice: 'Single-Mode Fiber (SMF) with 10GBASE-LR SFP+',
      reason: '800m exceeds copper (100m) and MMF (300-400m). SMF handles up to 10 km with zero EMI.',
      category: 'Fiber (SMF)',
    },
    {
      title: 'High-Voltage Industrial Factory',
      distance: '150 meters',
      environment: 'Factory floor adjacent to heavy high-voltage electric arc motors',
      powerNeed: 'None',
      speedNeed: '10 Gbps',
      bestChoice: 'Multi-Mode Fiber (MMF) or SMF',
      reason: 'Glass fiber carries light photons, giving 100% immunity to heavy electromagnetic noise (EMI).',
      category: 'Fiber (MMF/SMF)',
    },
    {
      title: 'Ceiling Wi-Fi 6 Access Point',
      distance: '45 meters',
      environment: 'Ceiling mount with no AC wall electrical outlet nearby',
      powerNeed: '24 Watts DC power',
      speedNeed: '2.5 Gbps',
      bestChoice: 'Cat6a Copper with IEEE 802.3at (PoE+)',
      reason: 'PoE+ supplies up to 30W from the switch port over standard 4-pair twisted copper cables.',
      category: 'PoE + Copper',
    },
  ];

  return (
    <div className="p-4 sm:p-6 rounded-2xl glass-panel border border-[#272732] flex flex-col gap-5 sm:gap-6">
      {/* HEADER & TABS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-wider font-semibold block mb-1">
            Layer 1 Physical Infrastructure
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
            Network Media & Physical Interfaces
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-[#121217] p-1.5 rounded-xl border border-[#272732] w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('copper')}
            className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all ${
              activeTab === 'copper' ? 'bg-[#00f0ff] text-black shadow-[0_0_12px_rgba(0,240,255,0.4)]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Copper
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('fiber')}
            className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all ${
              activeTab === 'fiber' ? 'bg-[#00f0ff] text-black shadow-[0_0_12px_rgba(0,240,255,0.4)]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Fiber
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('transceiver')}
            className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all ${
              activeTab === 'transceiver' ? 'bg-[#00f0ff] text-black shadow-[0_0_12px_rgba(0,240,255,0.4)]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Transceivers
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('poe')}
            className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all ${
              activeTab === 'poe' ? 'bg-[#00f0ff] text-black shadow-[0_0_12px_rgba(0,240,255,0.4)]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            PoE
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('workbench')}
            className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all ${
              activeTab === 'workbench' ? 'bg-emerald-400 text-black shadow-[0_0_12px_rgba(52,211,153,0.4)]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Workbench
          </button>
        </div>
      </div>

      {/* TAB 1: COPPER TWISTED PAIR */}
      {activeTab === 'copper' && (
        <div className="p-4 sm:p-6 rounded-xl bg-[#09090b] border border-[#272732] flex flex-col gap-4">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Cable className="w-4 h-4 text-amber-400" />
            Twisted-Pair Copper Cabling (RJ-45 / 8P8C)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
              <span className="text-[11px] font-mono text-zinc-400 font-bold uppercase block">Category 5e (Cat5e)</span>
              <div className="text-sm font-bold text-white">Standard Gigabit (1 Gbps)</div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Standard choice for basic home and office desktop connections up to 100 meters.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-[#00f0ff]/30 space-y-1.5 bg-[#00f0ff]/5">
              <span className="text-[11px] font-mono text-[#00f0ff] font-bold uppercase block">Category 6 (Cat6)</span>
              <div className="text-sm font-bold text-white">High Performance (1G – 10G)</div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Standard for modern business wiring. Supports 10 Gbps over shorter runs and 1 Gbps up to 100m.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-emerald-400/30 space-y-1.5 bg-emerald-400/5">
              <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase block">Category 6a (Cat6a)</span>
              <div className="text-sm font-bold text-white">Full 10G (Full 100m)</div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Thicker shielding for heavy datacenter and server connections needing full 10 Gbps up to 100m.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-amber-400/10 border border-amber-400/20 text-xs text-amber-300 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Practical Distance Rule:</strong> Standard copper Ethernet cables have a practical distance limit of <strong>100 meters (about 328 feet)</strong>.
            </span>
          </div>
        </div>
      )}

      {/* TAB 2: OPTICAL FIBER */}
      {activeTab === 'fiber' && (
        <div className="p-4 sm:p-6 rounded-xl bg-[#09090b] border border-[#272732] flex flex-col gap-4">
          <div className="flex items-center gap-2 text-[#00f0ff] font-mono text-xs font-bold uppercase tracking-wider">
            <Radio className="w-4 h-4 text-[#00f0ff]" />
            Optical Glass Fiber Media (Light Pulses)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-amber-400/5 border border-amber-400/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-300">Single-Mode Fiber (SMF)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">Yellow Jacket</span>
              </div>
              <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside">
                <li><strong>Light Path:</strong> Sends light along a single, direct path.</li>
                <li><strong>Primary Use:</strong> <strong>Long distances</strong> (connecting buildings across a campus or between cities).</li>
                <li><strong>Reach:</strong> Easily spans kilometers without repeaters.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[#00f0ff]/5 border border-[#00f0ff]/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#00f0ff]">Multimode Fiber (MMF)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30">Aqua / Orange Jacket</span>
              </div>
              <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside">
                <li><strong>Light Path:</strong> Light travels along multiple bouncing paths.</li>
                <li><strong>Primary Use:</strong> <strong>Shorter fiber links</strong> (inside the same building or data center).</li>
                <li><strong>Reach:</strong> Typically used for runs up to a few hundred meters.</li>
              </ul>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/20 text-xs text-[#00f0ff] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00f0ff] shrink-0 mt-0.5" />
            <span>
              <strong>Total Electrical Immunity:</strong> Fiber optic cables carry light through non-conductive glass strands, making them 100% immune to electromagnetic interference (EMI) from motors and power lines.
            </span>
          </div>
        </div>
      )}

      {/* TAB 3: MODULAR TRANSCEIVERS */}
      {activeTab === 'transceiver' && (
        <div className="p-4 sm:p-6 rounded-xl bg-[#09090b] border border-[#272732] flex flex-col gap-4">
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Layers className="w-4 h-4 text-indigo-400" />
            Modular Pluggable Transceivers (SFP / SFP+ / QSFP)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center space-y-1">
              <div className="text-xs font-mono font-bold text-zinc-300">SFP</div>
              <div className="text-sm font-bold text-white">1 Gbps</div>
              <span className="text-[10px] text-zinc-400 block">Standard modular gigabit port</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-[#00f0ff]/30 text-center space-y-1 bg-[#00f0ff]/5">
              <div className="text-xs font-mono font-bold text-[#00f0ff]">SFP+</div>
              <div className="text-sm font-bold text-white">10 Gbps</div>
              <span className="text-[10px] text-zinc-400 block">High-speed 10G switch uplinks</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-emerald-400/30 text-center space-y-1 bg-emerald-400/5">
              <div className="text-xs font-mono font-bold text-emerald-400">QSFP</div>
              <div className="text-sm font-bold text-white">40G – 100 Gbps</div>
              <span className="text-[10px] text-zinc-400 block">Datacenter core switch backbones</span>
            </div>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Transceivers are hot-pluggable modules that slide into switch slots. They give network engineers the flexibility to connect copper patch cables, multimode fiber, or single-mode fiber without replacing the switch.
          </p>
        </div>
      )}

      {/* TAB 4: POWER OVER ETHERNET (PoE) */}
      {activeTab === 'poe' && (
        <div className="p-4 sm:p-6 rounded-xl bg-[#09090b] border border-[#272732] flex flex-col gap-4">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Zap className="w-4 h-4 text-emerald-400" />
            Power over Ethernet (PoE)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="text-xs font-mono font-bold text-white">VoIP Phones</div>
              <p className="text-xs text-zinc-400">Powered directly through the office Ethernet wall jack without a power brick.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-[#00f0ff]/30 space-y-1.5 bg-[#00f0ff]/5">
              <div className="text-xs font-mono font-bold text-[#00f0ff]">Ceiling Wi-Fi APs</div>
              <p className="text-xs text-zinc-400">Installed high on ceilings where electrical wall outlets are not easily available.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-emerald-400/30 space-y-1.5 bg-emerald-400/5">
              <div className="text-xs font-mono font-bold text-emerald-400">Security IP Cameras</div>
              <p className="text-xs text-zinc-400">Mounted on outdoor walls or hallways with one single cable carrying power and video.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: WORKBENCH / SELECTION MATCHER */}
      {activeTab === 'workbench' && (
        <div className="p-4 sm:p-6 rounded-xl bg-[#09090b] border border-[#272732] flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Media Selection Decision Workbench
            </span>
            <span className="text-xs text-zinc-400 font-mono">Select a scenario to test reasoning:</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {scenarios.map((sc, idx) => (
              <button
                key={sc.title}
                type="button"
                onClick={() => setSelectedScenario(idx)}
                className={`p-2.5 rounded-xl text-left text-xs font-medium border transition-all ${
                  selectedScenario === idx
                    ? 'bg-emerald-400/10 border-emerald-400 text-white shadow-[0_0_12px_rgba(52,211,153,0.2)]'
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                }`}
              >
                <span className="font-mono text-[10px] text-emerald-400 block mb-0.5">Scenario {idx + 1}</span>
                <span className="line-clamp-1 font-bold">{sc.title}</span>
              </button>
            ))}
          </div>

          {/* SCENARIO CARD */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white">{scenarios[selectedScenario].title}</h4>
                <p className="text-xs text-zinc-400">{scenarios[selectedScenario].environment}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/10 text-zinc-300">
                  Distance: {scenarios[selectedScenario].distance}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  Speed: {scenarios[selectedScenario].speedNeed}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-lg bg-[#0e0e13] border border-emerald-400/40 space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 block">Recommended Selection:</span>
                <div className="text-sm font-bold text-white">{scenarios[selectedScenario].bestChoice}</div>
              </div>
              <div className="p-3 rounded-lg bg-[#0e0e13] border border-white/10 space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 block">Engineering Rationale:</span>
                <p className="text-xs text-zinc-300 leading-relaxed">{scenarios[selectedScenario].reason}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

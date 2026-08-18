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
              <div className="text-sm font-bold text-white">1 Gbps (1000BASE-T)</div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Max distance: <strong className="text-amber-300">100m</strong>. Bandwidth: 100 MHz. Foundational standard for gigabit desktops.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-[#00f0ff]/30 space-y-1.5 bg-[#00f0ff]/5">
              <span className="text-[11px] font-mono text-[#00f0ff] font-bold uppercase block">Category 6 (Cat6)</span>
              <div className="text-sm font-bold text-white">10 Gbps (up to 55m) / 1 Gbps (100m)</div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Bandwidth: 250 MHz. Contains internal plastic spline separator to reduce alien crosstalk.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-emerald-400/30 space-y-1.5 bg-emerald-400/5">
              <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase block">Category 6a (Cat6a)</span>
              <div className="text-sm font-bold text-white">10 Gbps (Full 100m)</div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Bandwidth: 500 MHz. Thicker shielding and tighter twists enable full 10GBASE-T over 100m.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-amber-400/10 border border-amber-400/20 text-xs text-amber-300 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Crucial Rule:</strong> All standard twisted-pair Ethernet cables (Cat5e, Cat6, Cat6a) have a hard channel limit of <strong>100 meters (328 feet)</strong> due to electrical resistance and signal attenuation.
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
                <li><strong>Core Diameter:</strong> ~9 microns (µm) — extremely narrow glass core.</li>
                <li><strong>Light Source:</strong> Laser (1310 nm or 1550 nm wavelength).</li>
                <li><strong>Distance:</strong> <strong>10 km to 40 km+</strong> (Long-haul, campus backbones, WAN).</li>
                <li><strong>Dispersion:</strong> Single straight ray of light; zero modal dispersion.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[#00f0ff]/5 border border-[#00f0ff]/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#00f0ff]">Multi-Mode Fiber (MMF)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30">Aqua / Orange Jacket</span>
              </div>
              <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside">
                <li><strong>Core Diameter:</strong> 50 or 62.5 microns (µm) — wider glass core.</li>
                <li><strong>Light Source:</strong> LED / VCSEL (850 nm wavelength).</li>
                <li><strong>Distance:</strong> <strong>300m to 550m</strong> (Datacenters, building risers).</li>
                <li><strong>Dispersion:</strong> Multiple light rays bounce at different angles (modal dispersion).</li>
              </ul>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/20 text-xs text-[#00f0ff] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00f0ff] shrink-0 mt-0.5" />
            <span>
              <strong>Total EMI Immunity:</strong> Fiber uses non-conductive glass and photons. It is 100% immune to electromagnetic noise from high-voltage motors, radio transmitters, and lightning strikes.
            </span>
          </div>
        </div>
      )}

      {/* TAB 3: MODULAR TRANSCEIVERS */}
      {activeTab === 'transceiver' && (
        <div className="p-4 sm:p-6 rounded-xl bg-[#09090b] border border-[#272732] flex flex-col gap-4">
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Layers className="w-4 h-4 text-indigo-400" />
            Hot-Swappable Optical & Copper Transceivers
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center space-y-1">
              <div className="text-xs font-mono font-bold text-zinc-300">SFP</div>
              <div className="text-sm font-bold text-white">1 Gbps</div>
              <span className="text-[10px] text-zinc-400 block">1000BASE-SX / LX</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-[#00f0ff]/30 text-center space-y-1 bg-[#00f0ff]/5">
              <div className="text-xs font-mono font-bold text-[#00f0ff]">SFP+</div>
              <div className="text-sm font-bold text-white">10 Gbps</div>
              <span className="text-[10px] text-zinc-400 block">10GBASE-SR / LR</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-amber-400/30 text-center space-y-1 bg-amber-400/5">
              <div className="text-xs font-mono font-bold text-amber-300">QSFP+</div>
              <div className="text-sm font-bold text-white">40 Gbps</div>
              <span className="text-[10px] text-zinc-400 block">4 x 10G lanes</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-emerald-400/30 text-center space-y-1 bg-emerald-400/5">
              <div className="text-xs font-mono font-bold text-emerald-400">QSFP28</div>
              <div className="text-sm font-bold text-white">100 Gbps</div>
              <span className="text-[10px] text-zinc-400 block">4 x 25G lanes</span>
            </div>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Modular transceiver cages allow network switches to remain flexible. A switch port can accept an SFP+ module for 10G copper (RJ-45), 10G Multi-Mode fiber (SR), or 10G Single-Mode fiber (LR) simply by swapping the hot-pluggable module.
          </p>
        </div>
      )}

      {/* TAB 4: POWER OVER ETHERNET (PoE) */}
      {activeTab === 'poe' && (
        <div className="p-4 sm:p-6 rounded-xl bg-[#09090b] border border-[#272732] flex flex-col gap-4">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Zap className="w-4 h-4 text-emerald-400" />
            Power over Ethernet (PoE) Standards
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white">PoE (802.3af)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-zinc-300">15.4W</span>
              </div>
              <p className="text-xs text-zinc-400">Delivers up to 12.95W. Powers basic VoIP desk phones and simple indoor IoT sensors.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-[#00f0ff]/30 space-y-1.5 bg-[#00f0ff]/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#00f0ff]">PoE+ (802.3at)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00f0ff]/20 text-[#00f0ff]">30.0W</span>
              </div>
              <p className="text-xs text-zinc-400">Delivers up to 25.5W. Standard for Wi-Fi 6 Access Points, PTZ cameras, and video phones.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-emerald-400/30 space-y-1.5 bg-emerald-400/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400">PoE++ (802.3bt)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-300">60W – 90W</span>
              </div>
              <p className="text-xs text-zinc-400">Type 3 & 4. Powers multi-radio Wi-Fi 7 APs, digital signage displays, and building smart lighting.</p>
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

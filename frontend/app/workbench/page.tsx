'use client';

import React, { useState } from 'react';
import {
  Layers,
  Cpu,
  Server,
  Cloud,
  Shield,
  ShieldAlert,
  Flame,
  Radio,
  Wifi,
  Sparkles,
  Bot,
  Monitor,
  UploadCloud,
  FileCode,
  Award,
  Terminal,
  Activity,
  Zap,
} from 'lucide-react';
import { VisualRegistry } from '@/components/visuals/VisualRegistry';
import { SoundFx } from '@/lib/soundFx';

interface EngineCatalogItem {
  slug: string;
  name: string;
  category: 'PHYSICS' | 'CLOUD' | 'SECURITY' | 'DEVOPS' | 'OPERATIONS';
  versionTag: string;
  description: string;
  icon: React.ReactNode;
}

const ENGINES: EngineCatalogItem[] = [
  { slug: 'physics', name: 'Buffer Queue Physics', category: 'PHYSICS', versionTag: 'V4.1', description: 'Newtonian force-directed graph & FIFO/RED queue drops', icon: <Activity className="w-4 h-4 text-cyan-400" /> },
  { slug: 'wifi7', name: 'Wi-Fi 7 & 5G RF Physics', category: 'PHYSICS', versionTag: 'V5.3', description: '802.11be MLO tri-band & 4096-QAM attenuation', icon: <Wifi className="w-4 h-4 text-cyan-400" /> },
  { slug: 'satellite', name: 'Satellite Laser Mesh', category: 'PHYSICS', versionTag: 'V5.8', description: '550km LEO orbital constellation & vacuum lasers', icon: <Radio className="w-4 h-4 text-cyan-400" /> },

  { slug: 'bgp', name: 'BGP EVPN Spine-Leaf', category: 'CLOUD', versionTag: 'V4.4', description: 'Data center Clos underlay & VXLAN UDP 4789 overlay', icon: <Server className="w-4 h-4 text-indigo-400" /> },
  { slug: 'vpc', name: 'Cloud Transit Gateway', category: 'CLOUD', versionTag: 'V5.1', description: 'Multi-VPC AWS Transit Gateway hub-and-spoke', icon: <Cloud className="w-4 h-4 text-indigo-400" /> },
  { slug: 'sdwan', name: 'Enterprise SD-WAN & FEC', category: 'CLOUD', versionTag: 'V5.2', description: 'Dynamic SLA path steering & brownout failover', icon: <Layers className="w-4 h-4 text-indigo-400" /> },
  { slug: 'digital-twin', name: 'Global Internet Twin', category: 'CLOUD', versionTag: 'V5.0', description: 'Tier-1 BGP backbone & undersea cable cuts', icon: <Sparkles className="w-4 h-4 text-indigo-400" /> },

  { slug: 'cyber', name: 'Red/Blue Cyber Defense', category: 'SECURITY', versionTag: 'V4.7', description: 'Volumetric SYN flood & DAI/DNSSEC mitigations', icon: <ShieldAlert className="w-4 h-4 text-rose-400" /> },
  { slug: 'pentest', name: 'Pen-Testing & CVEs', category: 'SECURITY', versionTag: 'V5.4', description: 'Nmap stealth SYN scan & Log4Shell / SMBGhost CVEs', icon: <Terminal className="w-4 h-4 text-rose-400" /> },
  { slug: 'zerotrust', name: 'Zero Trust (ZTNA)', category: 'SECURITY', versionTag: 'V5.5', description: 'NIST SP 800-207 posture check & WireGuard tunnels', icon: <Shield className="w-4 h-4 text-rose-400" /> },
  { slug: 'quantum', name: 'Post-Quantum Kyber-1024', category: 'SECURITY', versionTag: 'V5.7', description: 'NIST PQC lattice cryptography vs Shor’s attack', icon: <Zap className="w-4 h-4 text-rose-400" /> },

  { slug: 'iac', name: 'NetDevOps IaC Studio', category: 'DEVOPS', versionTag: 'V4.5', description: 'Terraform, Ansible playbooks & Python Netmiko', icon: <FileCode className="w-4 h-4 text-emerald-400" /> },
  { slug: 'containerlab', name: 'Containerlab & EVE-NG', category: 'DEVOPS', versionTag: 'V4.6', description: 'Dockerized Arista cEOS & Nokia SRL bridge', icon: <Cpu className="w-4 h-4 text-emerald-400" /> },
  { slug: 'ebpf', name: 'eBPF & XDP Kernel Filter', category: 'DEVOPS', versionTag: 'V5.6', description: '14.8M PPS kernel bypass driver packet filtering', icon: <Cpu className="w-4 h-4 text-emerald-400" /> },
  { slug: 'aiops', name: 'Autonomous AI-Ops', category: 'DEVOPS', versionTag: 'V5.9', description: 'gNMI OpenConfig closed-loop self-healing', icon: <Bot className="w-4 h-4 text-emerald-400" /> },

  { slug: 'chaos', name: 'Chaos Monkey Arena', category: 'OPERATIONS', versionTag: 'V4.8', description: 'Link flapping, jitter spikes & MTTR stopwatches', icon: <Flame className="w-4 h-4 text-amber-400" /> },
  { slug: 'proctor', name: 'AI Exam Proctoring', category: 'OPERATIONS', versionTag: 'V4.9', description: 'Anti-cheat facial gaze mesh & on-chain diplomas', icon: <Award className="w-4 h-4 text-amber-400" /> },
  { slug: 'noc', name: 'Global NOC Command', category: 'OPERATIONS', versionTag: 'V6.0', description: 'Enterprise video-wall & zero-trust kill switch', icon: <Monitor className="w-4 h-4 text-amber-400" /> },
  { slug: 'import', name: 'Multimodal AI Import', category: 'OPERATIONS', versionTag: 'V6.1', description: 'Diagram OCR & High-DPI Vector PDF Diplomas', icon: <UploadCloud className="w-4 h-4 text-amber-400" /> },
];

export default function WorkbenchPage() {
  const [selectedSlug, setSelectedSlug] = useState<string>('physics');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const filteredEngines = ENGINES.filter((e) =>
    activeCategory === 'ALL' ? true : e.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-[#07080c] text-white p-4 md:p-8 flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#0c0e17] via-[#101322] to-[#0c0e17] border border-[#202538] shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-[#00f0ff] uppercase tracking-wider">
              NetVision Master Sandbox
            </span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-950/60 text-[#00f0ff] border border-cyan-500/30 text-[10px] font-mono font-bold">
              20 Autonomous Engines
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Simulation Workbench & Interactive Showcase
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Launch, inspect, and interact with any of the 20 real-time network simulation studios across Cloud, Cyber-Defense, NetDevOps, and Quantum Physics.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-black/60 border border-[#262c42]">
          {['ALL', 'PHYSICS', 'CLOUD', 'SECURITY', 'DEVOPS', 'OPERATIONS'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                SoundFx.playTerminalKeyPress();
                setActiveCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-[#00f0ff] text-black shadow-glow-cyan'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Engine Navigation Drawer (Top/Left) & Active Interactive Canvas (Bottom/Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left 4 Cols: Engine Quick Switcher */}
        <div className="xl:col-span-4 flex flex-col gap-2.5 max-h-[780px] overflow-y-auto pr-1">
          {filteredEngines.map((engine) => {
            const isSelected = selectedSlug === engine.slug;
            return (
              <div
                key={engine.slug}
                onClick={() => {
                  SoundFx.playTerminalKeyPress();
                  setSelectedSlug(engine.slug);
                }}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col gap-1.5 ${
                  isSelected
                    ? 'border-[#00f0ff] bg-cyan-950/20 shadow-glow-cyan'
                    : 'border-[#202538] bg-[#0c0e17] hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {engine.icon}
                    <span className="text-xs font-bold text-white">{engine.name}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-zinc-400 border border-zinc-800 font-bold">
                    {engine.versionTag}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{engine.description}</p>
              </div>
            );
          })}
        </div>

        {/* Right 8 Cols: Live Interactive Simulation Viewport */}
        <div className="xl:col-span-8 flex flex-col">
          <VisualRegistry topicSlug={selectedSlug} />
        </div>
      </div>
    </div>
  );
}

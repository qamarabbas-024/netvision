'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Globe,
  Binary,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface PresetAddress {
  label: string;
  uncompressed: string;
  compressed: string;
  scope: string;
  scopeDesc: string;
  prefix: string;
  interfaceId: string;
}

const PRESET_ADDRESSES: PresetAddress[] = [
  {
    label: 'Global Unicast (GUA) Web Server',
    uncompressed: '2001:0db8:0000:0000:0000:0000:0000:0001',
    compressed: '2001:db8::1',
    scope: 'Global Unicast (2000::/3)',
    scopeDesc: 'Publicly routable on the global Internet.',
    prefix: '2001:0db8:0000:0000',
    interfaceId: '0000:0000:0000:0001',
  },
  {
    label: 'Link-Local Interface (LLA)',
    uncompressed: 'fe80:0000:0000:0000:0200:00ff:fe00:0042',
    compressed: 'fe80::200:ff:fe00:42',
    scope: 'Link-Local (fe80::/10)',
    scopeDesc: 'Auto-configured on every NIC; valid only on local link.',
    prefix: 'fe80:0000:0000:0000',
    interfaceId: '0200:00ff:fe00:0042',
  },
  {
    label: 'Unique Local (ULA) Enterprise Subnet',
    uncompressed: 'fd12:3456:789a:0001:0000:0000:0000:0050',
    compressed: 'fd12:3456:789a:1::50',
    scope: 'Unique Local (fc00::/7)',
    scopeDesc: 'Private enterprise internal routing (IPv6 RFC 1918 equivalent).',
    prefix: 'fd12:3456:789a:0001',
    interfaceId: '0000:0000:0000:0050',
  },
  {
    label: 'All-Routers Multicast Address',
    uncompressed: 'ff02:0000:0000:0000:0000:0000:0000:0002',
    compressed: 'ff02::2',
    scope: 'Multicast (ff00::/8)',
    scopeDesc: 'Link-local scope multicast targeting all local routers.',
    prefix: 'ff02:0000:0000:0000',
    interfaceId: '0000:0000:0000:0002',
  },
  {
    label: 'Loopback Diagnostic Address',
    uncompressed: '0000:0000:0000:0000:0000:0000:0000:0001',
    compressed: '::1',
    scope: 'Loopback (::1/128)',
    scopeDesc: 'Local host loopback test equivalent to 127.0.0.1.',
    prefix: '0000:0000:0000:0000',
    interfaceId: '0000:0000:0000:0001',
  },
];

export const IPv6Visual: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'compressor' | 'slaac' | 'scopes' | 'practice'>('compressor');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [customInput, setCustomInput] = useState<string>('2001:0db8:0000:0000:0000:0000:0000:0001');

  // SLAAC Animation state
  const [slaacStep, setSlaacStep] = useState<number>(0);

  // Practice state
  const [practiceQuestionIndex, setPracticeQuestionIndex] = useState<number>(0);
  const [userPracticeAnswer, setUserPracticeAnswer] = useState<string>('');
  const [practiceFeedback, setPracticeFeedback] = useState<{ correct: boolean; msg: string } | null>(null);

  const activePreset = PRESET_ADDRESSES[selectedPresetIndex];

  // Helper to split into 8 hextets
  const getHextets = (addr: string): string[] => {
    const parts = addr.split(':');
    if (parts.length === 8) return parts;
    // Pad if less
    while (parts.length < 8) parts.push('0000');
    return parts.slice(0, 8);
  };

  const hextets = getHextets(customInput);

  // Apply RFC 5952 Rule 1: Drop leading zeros
  const step1Hextets = hextets.map((h) => {
    const trimmed = h.replace(/^0+/, '');
    return trimmed === '' ? '0' : trimmed;
  });

  // Apply RFC 5952 Rule 2: Compress longest contiguous run of zero hextets
  const getCanonicalCompressed = (rawHextets: string[]): string => {
    const trimmed = rawHextets.map((h) => {
      const t = h.replace(/^0+/, '');
      return t === '' ? '0' : t;
    });

    let bestStart = -1;
    let bestLength = 0;
    let currentStart = -1;
    let currentLength = 0;

    for (let i = 0; i < trimmed.length; i++) {
      if (trimmed[i] === '0') {
        if (currentStart === -1) {
          currentStart = i;
          currentLength = 1;
        } else {
          currentLength++;
        }
      } else {
        if (currentLength > bestLength) {
          bestStart = currentStart;
          bestLength = currentLength;
        }
        currentStart = -1;
        currentLength = 0;
      }
    }
    if (currentLength > bestLength) {
      bestStart = currentStart;
      bestLength = currentLength;
    }

    if (bestLength > 1) {
      const left = trimmed.slice(0, bestStart).join(':');
      const right = trimmed.slice(bestStart + bestLength).join(':');
      return `${left}::${right}`;
    }

    return trimmed.join(':');
  };

  const canonicalCompressed = getCanonicalCompressed(hextets);

  // SLAAC Steps
  const slaacStages = [
    {
      step: 1,
      title: '1. Link-Local Generation (fe80::/10)',
      sender: 'Host (PC-1)',
      target: 'Local NIC',
      msgType: 'Local Self-Config',
      desc: 'Host assigns a temporary Link-Local address (fe80::) to communicate on the local Layer 2 broadcast domain.',
      packet: 'fe80::1a2b:3c4d:5e6f:7a8b%eth0',
    },
    {
      step: 2,
      title: '2. Router Solicitation (RS - ICMPv6 Type 133)',
      sender: 'Host (PC-1)',
      target: 'ff02::2 (All-Routers Multicast)',
      msgType: 'ICMPv6 Type 133',
      desc: 'Host multicasts a Router Solicitation asking: "Are there any IPv6 routers on this link? Please announce your prefix."',
      packet: 'Src: fe80::... ➔ Dst: ff02::2 [ICMPv6 Type 133 RS]',
    },
    {
      step: 3,
      title: '3. Router Advertisement (RA - ICMPv6 Type 134)',
      sender: 'Default Gateway (Router-1)',
      target: 'ff02::1 (All-Nodes Multicast)',
      msgType: 'ICMPv6 Type 134',
      desc: 'Router replies with a Router Advertisement advertising the subnet prefix (e.g. 2001:db8:acad:1::/64), Prefix Info Option (PIO A-Flag=1), and Default Gateway.',
      packet: 'Src: fe80::1 ➔ Dst: ff02::1 [RA Prefix: 2001:db8:acad:1::/64, Lifetime: 86400s]',
    },
    {
      step: 4,
      title: '4. SLAAC Address Generation (Prefix + Interface ID)',
      sender: 'Host (PC-1)',
      target: 'Local Stack',
      msgType: 'Autonomous GUA Config',
      desc: 'Host takes the /64 network prefix from the RA (2001:db8:acad:1::) and appends its 64-bit Interface ID to formulate its full 128-bit Global Unicast Address.',
      packet: 'Formed GUA: 2001:db8:acad:1:1a2b:3c4d:5e6f:7a8b/64',
    },
    {
      step: 5,
      title: '5. Duplicate Address Detection (DAD - ICMPv6 Type 135)',
      sender: 'Host (PC-1)',
      target: 'Solicited-Node Multicast',
      msgType: 'ICMPv6 Type 135 NS',
      desc: 'Before activating the address, host multicasts a Neighbor Solicitation for its own address. If no Neighbor Advertisement (NA) is received, the GUA is officially verified and bound.',
      packet: 'DAD Complete: 0 Conflicts ➔ IPv6 GUA Active & Online ✅',
    },
  ];

  const handleNextSlaac = () => {
    if (slaacStep < slaacStages.length - 1) {
      setSlaacStep((prev) => prev + 1);
    } else {
      setSlaacStep(0);
    }
  };

  // Practice Exercises
  const practiceItems = [
    {
      id: 1,
      type: 'compress',
      prompt: 'Compress the full address: `2001:0db8:0000:0042:0000:0000:0000:0001` per RFC 5952.',
      expected: '2001:db8:0:42::1',
      hints: 'Rule: The longest run of zero hextets is at hextets 5-7 (3 zeros). The single zero at hextet 3 is not part of the longest run.',
    },
    {
      id: 2,
      type: 'scope',
      prompt: 'What is the address scope for `fe80::1a2b:3c4d`? (Type GUA, LLA, ULA, or Multicast)',
      expected: 'LLA',
      hints: 'fe80::/10 represents Link-Local Addresses.',
    },
    {
      id: 3,
      type: 'expand',
      prompt: 'What is the full 8-hextet uncompressed form of `::1`?',
      expected: '0000:0000:0000:0000:0000:0000:0000:0001',
      hints: 'Replace `::` with 7 all-zero hextets and pad the final hextet to 4 digits.',
    },
    {
      id: 4,
      type: 'multicast',
      prompt: 'What multicast address do hosts send Router Solicitations to? (e.g. ff02::1, ff02::2)',
      expected: 'ff02::2',
      hints: 'ff02::2 is the All-Routers multicast group.',
    },
  ];

  const checkPractice = () => {
    const current = practiceItems[practiceQuestionIndex];
    const cleanedUser = userPracticeAnswer.trim().toLowerCase();
    const cleanedExpected = current.expected.trim().toLowerCase();

    if (cleanedUser === cleanedExpected) {
      setPracticeFeedback({
        correct: true,
        msg: `🎉 Correct! ${current.expected} is the accurate answer.`,
      });
    } else {
      setPracticeFeedback({
        correct: false,
        msg: `❌ Not quite. Expected: ${current.expected}. Hint: ${current.hints}`,
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 text-zinc-100 font-sans">
      {/* Top Header & Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#00f0ff]" />
          <h3 className="text-lg font-bold tracking-wide text-white">
            IPv6 Foundations, RFC 5952 Compression & SLAAC Engine
          </h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Button
            size="sm"
            variant={activeTab === 'compressor' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('compressor')}
            className={activeTab === 'compressor' ? 'bg-[#00f0ff] text-black hover:bg-[#00f0ff]/90' : 'text-zinc-300'}
          >
            <Binary className="w-3.5 h-3.5 mr-1.5" /> Address & Compressor
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'slaac' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('slaac')}
            className={activeTab === 'slaac' ? 'bg-[#00f0ff] text-black hover:bg-[#00f0ff]/90' : 'text-zinc-300'}
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> SLAAC Flow Simulator
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'scopes' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('scopes')}
            className={activeTab === 'scopes' ? 'bg-[#00f0ff] text-black hover:bg-[#00f0ff]/90' : 'text-zinc-300'}
          >
            <Layers className="w-3.5 h-3.5 mr-1.5" /> Address Scopes
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'practice' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('practice')}
            className={activeTab === 'practice' ? 'bg-[#00f0ff] text-black hover:bg-[#00f0ff]/90' : 'text-zinc-300'}
          >
            <HelpCircle className="w-3.5 h-3.5 mr-1.5" /> Practice Workbench
          </Button>
        </div>
      </div>

      {/* TAB 1: ADDRESS & COMPRESSOR WORKBENCH */}
      {activeTab === 'compressor' && (
        <div className="flex flex-col gap-6">
          {/* Preset Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-zinc-400">SELECT PRESET IPV6 TOPOLOGY PATTERN:</label>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {PRESET_ADDRESSES.map((preset, idx) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setSelectedPresetIndex(idx);
                    setCustomInput(preset.uncompressed);
                  }}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    selectedPresetIndex === idx
                      ? 'border-[#00f0ff] bg-[#00f0ff]/10 text-white shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="text-xs font-bold truncate">{preset.label}</div>
                  <div className="text-[10px] font-mono text-zinc-500 truncate mt-0.5">{preset.compressed}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 128-Bit Hextet Anatomy View */}
          <Card className="p-5 border-zinc-800 bg-zinc-950/80 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#00f0ff] font-bold">128-BIT HEXTET ANATOMY (8 GROUPS OF 16 BITS)</span>
              <Badge variant="cyan">{activePreset.scope}</Badge>
            </div>

            {/* Hextet Grid */}
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {hextets.map((hextet, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-all ${
                    idx < 4
                      ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                      : 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300'
                  }`}
                >
                  <span className="text-[10px] font-mono text-zinc-400 mb-1">
                    Hextet {idx + 1} ({idx < 4 ? 'Prefix' : 'Interface ID'})
                  </span>
                  <span className="text-sm font-mono font-bold tracking-wider">{hextet}</span>
                  <span className="text-[9px] font-mono text-zinc-500 mt-1">16 bits</span>
                </div>
              ))}
            </div>

            {/* Prefix vs Interface ID Divider */}
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-2 border-t border-zinc-800">
              <span className="text-emerald-400">◄ 64-bit Network Prefix (Subnet Routing)</span>
              <span className="text-cyan-400">64-bit Interface Identifier (Host Identity) ►</span>
            </div>
          </Card>

          {/* Compression Pipeline (RFC 5952) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Step 1: Drop Leading Zeros */}
            <Card className="p-4 border-zinc-800 bg-zinc-900/60 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400">STEP 1: OMIT LEADING ZEROS</span>
                <Badge variant="amber">RFC 5952 Rule 1</Badge>
              </div>
              <p className="text-xs text-zinc-400">
                In each 16-bit hextet, any leading zeros are omitted. (e.g. `0db8` ➔ `db8`, `0000` ➔ `0`).
              </p>
              <div className="p-2.5 rounded bg-black/60 border border-zinc-800 font-mono text-xs text-amber-300 break-all">
                {step1Hextets.join(':')}
              </div>
            </Card>

            {/* Step 2: Double-Colon Compression */}
            <Card className="p-4 border-zinc-800 bg-zinc-900/60 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#00f0ff]">STEP 2: CONTIGUOUS ZERO RUN (::)</span>
                <Badge variant="cyan">RFC 5952 Rule 2</Badge>
              </div>
              <p className="text-xs text-zinc-400">
                The longest contiguous sequence of all-zero hextets is replaced with a single `::` (allowed only once).
              </p>
              <div className="p-2.5 rounded bg-black/60 border border-[#00f0ff]/40 font-mono text-sm font-bold text-[#00f0ff] break-all shadow-[0_0_10px_rgba(0,240,255,0.15)]">
                {canonicalCompressed}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: SLAAC PROTOCOL FLOW SIMULATOR */}
      {activeTab === 'slaac' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Stateless Address Autoconfiguration (SLAAC) Lifecycle</h4>
              <p className="text-xs text-zinc-400">
                Trace how a host autonomously configures its IPv6 Global Unicast Address via ICMPv6 Router Advertisements without a stateful DHCP server.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setSlaacStep(0)}>
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
              </Button>
              <Button size="sm" className="bg-[#00f0ff] text-black hover:bg-[#00f0ff]/90" onClick={handleNextSlaac}>
                <Play className="w-3.5 h-3.5 mr-1" /> {slaacStep === slaacStages.length - 1 ? 'Restart Flow' : 'Next Step'}
              </Button>
            </div>
          </div>

          {/* Timeline Step Indicator */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            {slaacStages.map((stage, idx) => (
              <div
                key={stage.step}
                onClick={() => setSlaacStep(idx)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  slaacStep === idx
                    ? 'border-[#00f0ff] bg-[#00f0ff]/10 text-white shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                    : slaacStep > idx
                    ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300'
                    : 'border-zinc-800 bg-zinc-900/40 text-zinc-500'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                  <span>Step {stage.step}</span>
                  {slaacStep > idx && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <div className="text-xs font-bold line-clamp-2">{stage.title}</div>
              </div>
            ))}
          </div>

          {/* Active SLAAC Stage Detail Box */}
          <Card className="p-6 border-zinc-800 bg-zinc-950 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Badge variant="cyan">{slaacStages[slaacStep].msgType}</Badge>
                <span className="text-sm font-bold text-white">{slaacStages[slaacStep].title}</span>
              </div>
              <div className="text-xs font-mono text-zinc-400">
                {slaacStages[slaacStep].sender} ➔ {slaacStages[slaacStep].target}
              </div>
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed">{slaacStages[slaacStep].desc}</p>

            <div className="p-4 rounded-lg bg-black/80 border border-zinc-800 font-mono text-xs flex flex-col gap-2">
              <span className="text-zinc-500">// Protocol Packet Telemetry:</span>
              <span className="text-[#00f0ff] font-bold">{slaacStages[slaacStep].packet}</span>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: ADDRESS SCOPES COMPARISON */}
      {activeTab === 'scopes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5 border-zinc-800 bg-zinc-900/60 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-emerald-400">Global Unicast Address (GUA)</span>
              <Badge variant="emerald">2000::/3</Badge>
            </div>
            <p className="text-xs text-zinc-400">
              Globally routable on the public Internet (equivalent to public IPv4). Consists of a Global Routing Prefix, Subnet ID, and 64-bit Interface ID.
            </p>
            <div className="p-2 rounded bg-black/40 font-mono text-xs text-zinc-300">
              Example: <code>2001:0db8:acad:0001::50/64</code>
            </div>
          </Card>

          <Card className="p-5 border-zinc-800 bg-zinc-900/60 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-cyan-400">Link-Local Address (LLA)</span>
              <Badge variant="cyan">fe80::/10</Badge>
            </div>
            <p className="text-xs text-zinc-400">
              Mandatory on every IPv6 interface. Used for local router neighbor discovery, DHCPv6 requests, and next-hop routing. Never forwarded by routers.
            </p>
            <div className="p-2 rounded bg-black/40 font-mono text-xs text-zinc-300">
              Example: <code>fe80::1a2b:3c4d:5e6f:7a8b%eth0</code>
            </div>
          </Card>

          <Card className="p-5 border-zinc-800 bg-zinc-900/60 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-amber-400">Unique Local Address (ULA)</span>
              <Badge variant="amber">fc00::/7 (fd00::/8)</Badge>
            </div>
            <p className="text-xs text-zinc-400">
              Private enterprise internal addressing (equivalent to RFC 1918 10.0.0.0/8, 192.168.0.0/16). Routable within company intranets but not on the Internet.
            </p>
            <div className="p-2 rounded bg-black/40 font-mono text-xs text-zinc-300">
              Example: <code>fd12:3456:789a:1::1/64</code>
            </div>
          </Card>

          <Card className="p-5 border-zinc-800 bg-zinc-900/60 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-purple-400">Multicast Addresses</span>
              <Badge variant="purple">ff00::/8</Badge>
            </div>
            <p className="text-xs text-zinc-400">
              IPv6 completely replaces IPv4 Broadcast with Multicast. Key groups: <code>ff02::1</code> (All-Nodes) and <code>ff02::2</code> (All-Routers).
            </p>
            <div className="p-2 rounded bg-black/40 font-mono text-xs text-zinc-300">
              Example: <code>ff02::1</code> (All local subnet devices)
            </div>
          </Card>
        </div>
      )}

      {/* TAB 4: INTERACTIVE PRACTICE WORKBENCH */}
      {activeTab === 'practice' && (
        <Card className="p-6 border-zinc-800 bg-zinc-950 flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <span className="text-xs font-mono text-[#00f0ff] font-bold">
              EXERCISE {practiceQuestionIndex + 1} OF {practiceItems.length}
            </span>
            <div className="flex gap-1.5">
              {practiceItems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPracticeQuestionIndex(i);
                    setUserPracticeAnswer('');
                    setPracticeFeedback(null);
                  }}
                  className={`w-6 h-6 rounded text-xs font-mono font-bold ${
                    practiceQuestionIndex === i
                      ? 'bg-[#00f0ff] text-black'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-bold text-white leading-relaxed">
              {practiceItems[practiceQuestionIndex].prompt}
            </h4>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={userPracticeAnswer}
              onChange={(e) => setUserPracticeAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && checkPractice()}
              placeholder="Type your answer here..."
              className="flex-1 px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 font-mono text-sm text-white focus:outline-none focus:border-[#00f0ff]"
            />
            <Button className="bg-[#00f0ff] text-black hover:bg-[#00f0ff]/90" onClick={checkPractice}>
              Verify Answer
            </Button>
          </div>

          {practiceFeedback && (
            <div
              className={`p-3.5 rounded-lg border text-xs font-mono ${
                practiceFeedback.correct
                  ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300'
                  : 'border-amber-500/50 bg-amber-950/20 text-amber-300'
              }`}
            >
              {practiceFeedback.msg}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

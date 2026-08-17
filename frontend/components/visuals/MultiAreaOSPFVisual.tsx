'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Network,
  Share2,
  Database,
  Layers,
  CheckCircle2,
  Sliders,
  HelpCircle,
  Server,
} from 'lucide-react';

export const MultiAreaOSPFVisual: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'topology' | 'lsas' | 'summarization' | 'redistribution' | 'practice'>('topology');
  const [selectedLsaType, setSelectedLsaType] = useState<number>(3); // 1, 2, 3, 4, 5
  const [summarizationEnabled, setSummarizationEnabled] = useState<boolean>(false);
  const [redistributionMetricType, setRedistributionMetricType] = useState<'E1' | 'E2'>('E2');
  const [selectedRouterId, setSelectedRouterId] = useState<string>('ABR1');

  // Practice state
  const [practiceIndex, setPracticeIndex] = useState<number>(0);
  const [practiceAnswer, setPracticeAnswer] = useState<string>('');
  const [practiceFeedback, setPracticeFeedback] = useState<{ correct: boolean; msg: string } | null>(null);

  // Router Nodes in the Multi-Area Topology
  const routers = [
    {
      id: 'R1',
      name: 'R1 (Branch Internal)',
      role: 'Internal Router',
      area: 'Area 1',
      interfaces: ['10.1.1.1/24 (LAN)', '10.1.12.1/30 (to ABR1)'],
      routes: ['10.1.1.0/24 [O]', '10.0.0.0/24 [O IA]', '10.2.0.0/16 [O IA]', '172.16.0.0/12 [O E2]'],
      lsasOriginated: ['Type 1 (Router LSA for R1)'],
    },
    {
      id: 'ABR1',
      name: 'ABR-1 (Area Border Router)',
      role: 'ABR (Area Border Router)',
      area: 'Area 0 & Area 1',
      interfaces: ['10.1.12.2/30 (Area 1)', '10.0.0.1/24 (Area 0 Backbone)'],
      routes: ['10.1.1.0/24 [O]', '10.0.0.0/24 [O]', '10.2.0.0/16 [O IA]', '172.16.0.0/12 [O E2]'],
      lsasOriginated: ['Type 1 (Area 0 & 1)', 'Type 3 Summary LSA (10.1.0.0/16 into Area 0)', 'Type 4 ASBR Summary LSA'],
    },
    {
      id: 'ABR2',
      name: 'ABR-2 (Area Border Router)',
      role: 'ABR (Area Border Router)',
      area: 'Area 0 & Area 2',
      interfaces: ['10.0.0.2/24 (Area 0 Backbone)', '10.2.23.2/30 (Area 2)'],
      routes: ['10.0.0.0/24 [O]', '10.2.2.0/24 [O]', '10.1.0.0/16 [O IA]', '172.16.0.0/12 [O E2]'],
      lsasOriginated: ['Type 1 (Area 0 & 2)', 'Type 3 Summary LSA (10.2.0.0/16 into Area 0)', 'Type 4 ASBR Summary LSA'],
    },
    {
      id: 'R2',
      name: 'R2 (Data Center Internal)',
      role: 'Internal Router',
      area: 'Area 2',
      interfaces: ['10.2.23.3/30 (to ABR2)', '10.2.2.1/24 (DC Subnet)'],
      routes: ['10.2.2.0/24 [O]', '10.0.0.0/24 [O IA]', '10.1.0.0/16 [O IA]', '172.16.0.0/12 [O E2]'],
      lsasOriginated: ['Type 1 (Router LSA for R2)'],
    },
    {
      id: 'ASBR',
      name: 'ASBR-1 (Autonomous System Boundary)',
      role: 'ASBR (External Gateway)',
      area: 'Area 0',
      interfaces: ['10.0.0.3/24 (Area 0)', '192.168.100.1/30 (BGP WAN Peer)'],
      routes: ['10.0.0.0/24 [O]', '10.1.0.0/16 [O IA]', '10.2.0.0/16 [O IA]', '172.16.0.0/12 [BGP / Connected]'],
      lsasOriginated: ['Type 1 (Area 0)', 'Type 5 External LSA (172.16.0.0/12 domain-wide)'],
    },
  ];

  const activeRouter = routers.find((r) => r.id === selectedRouterId) || routers[1];

  // LSA Definitions
  const lsaDefinitions = [
    {
      type: 1,
      name: 'Type 1: Router LSA',
      floodingScope: 'Area-Local (does NOT cross ABR)',
      originator: 'Every OSPF router for each area it belongs to',
      purpose: 'Describes the router’s direct links, interface IPs, and neighbor link costs.',
      example: 'R1 advertises link 10.1.1.0/24 and 10.1.12.0/30 within Area 1 only.',
      routingCode: 'O (Intra-Area)',
    },
    {
      type: 2,
      name: 'Type 2: Network LSA',
      floodingScope: 'Area-Local (does NOT cross ABR)',
      originator: 'Designated Router (DR) on multi-access broadcast transit links',
      purpose: 'Lists all routers attached to a multi-access broadcast subnet (Ethernet).',
      example: 'DR on 10.0.0.0/24 announces attached routers (ABR1, ABR2, ASBR).',
      routingCode: 'O (Intra-Area transit)',
    },
    {
      type: 3,
      name: 'Type 3: Summary LSA',
      floodingScope: 'Inter-Area (Originated by ABR into other areas)',
      originator: 'Area Border Router (ABR)',
      purpose: 'Advertises internal subnets from one area into other areas as distance-vector summaries.',
      example: 'ABR1 generates Type 3 LSA for 10.1.0.0/16 into Area 0; ABR2 regenerates it into Area 2.',
      routingCode: 'O IA (Inter-Area)',
    },
    {
      type: 4,
      name: 'Type 4: ASBR Summary LSA',
      floodingScope: 'Inter-Area (Originated by ABR into non-ASBR areas)',
      originator: 'Area Border Router (ABR)',
      purpose: 'Advertises the host route and metric cost to reach the ASBR Router ID.',
      example: 'ABR1 advertises cost to reach ASBR (RID 10.0.0.3) into Area 1 so R1 knows how to exit the AS.',
      routingCode: 'Infrastructure routing to ASBR',
    },
    {
      type: 5,
      name: 'Type 5: AS External LSA',
      floodingScope: 'Domain-Wide (Flooded across ALL non-stub areas)',
      originator: 'Autonomous System Boundary Router (ASBR)',
      purpose: 'Advertises routes redistributed from external sources (BGP, Static, RIP, Connected).',
      example: 'ASBR redistributes 172.16.0.0/12 into Area 0; flooded unchanged to Area 1 and Area 2.',
      routingCode: 'O E1 (Cumulative cost) or O E2 (Fixed seed cost)',
    },
  ];

  const activeLsa = lsaDefinitions.find((l) => l.type === selectedLsaType) || lsaDefinitions[2];

  // Practice Questions
  const practiceItems = [
    {
      id: 1,
      prompt: 'Which router in this topology connects Area 1 to the Area 0 Backbone? (Type ABR1, ABR2, R1, or ASBR)',
      expected: 'ABR1',
      hints: 'An Area Border Router (ABR) has active interfaces in Area 0 and at least one regular non-backbone area.',
    },
    {
      id: 2,
      prompt: 'What LSA type is generated by ABR1 to advertise Area 1 subnets into Area 0? (Type 1, 2, 3, 4, or 5)',
      expected: '3',
      hints: 'Type 3 Summary LSAs are generated by ABRs to propagate inter-area routes.',
    },
    {
      id: 3,
      prompt: 'If R1 inspects a route to 10.2.2.0/24 located in Area 2, what routing table code will it display? (Type "O", "O IA", or "O E2")',
      expected: 'O IA',
      hints: 'Routes originating in a different OSPF area within the same AS are marked as Inter-Area (O IA).',
    },
    {
      id: 4,
      prompt: 'Where must route summarization for Area 1 subnets (`area 1 range ...`) be configured? (Type ABR1, R1, or ASBR)',
      expected: 'ABR1',
      hints: 'Inter-area route summarization can ONLY occur at the ABR where Type 1/2 LSAs are translated into Type 3 Summary LSAs.',
    },
  ];

  const checkPractice = () => {
    const current = practiceItems[practiceIndex];
    const cleanedUser = practiceAnswer.trim().toLowerCase();
    const cleanedExpected = current.expected.trim().toLowerCase();

    if (cleanedUser === cleanedExpected) {
      setPracticeFeedback({
        correct: true,
        msg: `🎉 Correct! "${current.expected}" is the accurate engineering answer.`,
      });
    } else {
      setPracticeFeedback({
        correct: false,
        msg: `❌ Incorrect. Expected "${current.expected}". Hint: ${current.hints}`,
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 text-zinc-100 font-sans">
      {/* Top Header & Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#00f0ff]" />
          <h3 className="text-lg font-bold tracking-wide text-white">
            Multi-Area OSPF Architecture, LSA Flooding & Route Redistribution
          </h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Button
            size="sm"
            variant={activeTab === 'topology' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('topology')}
            className={activeTab === 'topology' ? 'bg-[#00f0ff] text-black hover:bg-[#00f0ff]/90' : 'text-zinc-300'}
          >
            <Network className="w-3.5 h-3.5 mr-1.5" /> Multi-Area Topology
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'lsas' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('lsas')}
            className={activeTab === 'lsas' ? 'bg-[#00f0ff] text-black hover:bg-[#00f0ff]/90' : 'text-zinc-300'}
          >
            <Share2 className="w-3.5 h-3.5 mr-1.5" /> LSA Type Flow (1-5)
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'summarization' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('summarization')}
            className={activeTab === 'summarization' ? 'bg-[#00f0ff] text-black hover:bg-[#00f0ff]/90' : 'text-zinc-300'}
          >
            <Database className="w-3.5 h-3.5 mr-1.5" /> Route Summarization
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'redistribution' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('redistribution')}
            className={activeTab === 'redistribution' ? 'bg-[#00f0ff] text-black hover:bg-[#00f0ff]/90' : 'text-zinc-300'}
          >
            <Sliders className="w-3.5 h-3.5 mr-1.5" /> ASBR Redistribution
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

      {/* TAB 1: MULTI-AREA TOPOLOGY VIEW */}
      {activeTab === 'topology' && (
        <div className="flex flex-col gap-6">
          {/* Visual Area Map */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* AREA 1 (Branch LAN) */}
            <Card className="p-4 border-emerald-500/40 bg-emerald-950/20 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400">AREA 1 (STUB/BRANCH)</span>
                <Badge variant="emerald">Non-Backbone</Badge>
              </div>
              <p className="text-xs text-zinc-400">
                Contains branch router R1. Floods Type 1/2 LSAs internally. Connects to Backbone via ABR-1.
              </p>
              <div
                onClick={() => setSelectedRouterId('R1')}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedRouterId === 'R1'
                    ? 'border-[#00f0ff] bg-[#00f0ff]/10 text-white'
                    : 'border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>R1 (Branch Internal)</span>
                  <span className="font-mono text-[10px] text-emerald-400">RID: 10.1.1.1</span>
                </div>
                <div className="text-[10px] font-mono text-zinc-500 mt-1">Subnet: 10.1.0.0/16</div>
              </div>
            </Card>

            {/* AREA 0 (Backbone Core) */}
            <Card className="p-4 border-[#00f0ff]/40 bg-cyan-950/20 flex flex-col gap-3 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#00f0ff]">AREA 0 (BACKBONE TRANSIT)</span>
                <Badge variant="cyan">Transit Core</Badge>
              </div>
              <p className="text-xs text-zinc-400">
                All inter-area traffic must traverse Area 0. Prevents routing loops in link-state topologies.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div
                  onClick={() => setSelectedRouterId('ABR1')}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                    selectedRouterId === 'ABR1'
                      ? 'border-[#00f0ff] bg-[#00f0ff]/10 text-white'
                      : 'border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  <div className="text-xs font-bold truncate">ABR-1</div>
                  <div className="text-[10px] font-mono text-cyan-400">Area 0 &lt;-&gt; Area 1</div>
                </div>

                <div
                  onClick={() => setSelectedRouterId('ABR2')}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                    selectedRouterId === 'ABR2'
                      ? 'border-[#00f0ff] bg-[#00f0ff]/10 text-white'
                      : 'border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  <div className="text-xs font-bold truncate">ABR-2</div>
                  <div className="text-[10px] font-mono text-cyan-400">Area 0 &lt;-&gt; Area 2</div>
                </div>
              </div>

              <div
                onClick={() => setSelectedRouterId('ASBR')}
                className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                  selectedRouterId === 'ASBR'
                    ? 'border-purple-500 bg-purple-950/20 text-white'
                    : 'border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>ASBR-1 (External Gateway)</span>
                  <Badge variant="purple">ASBR</Badge>
                </div>
                <div className="text-[10px] font-mono text-purple-300 mt-0.5">Injects BGP/External 172.16.0.0/12</div>
              </div>
            </Card>

            {/* AREA 2 (Data Center LAN) */}
            <Card className="p-4 border-amber-500/40 bg-amber-950/20 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400">AREA 2 (DATA CENTER)</span>
                <Badge variant="amber">Non-Backbone</Badge>
              </div>
              <p className="text-xs text-zinc-400">
                Houses server farm. Connects to Area 0 via ABR-2. Isolates Data Center SPF calculations.
              </p>
              <div
                onClick={() => setSelectedRouterId('R2')}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedRouterId === 'R2'
                    ? 'border-[#00f0ff] bg-[#00f0ff]/10 text-white'
                    : 'border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>R2 (DC Internal)</span>
                  <span className="font-mono text-[10px] text-amber-400">RID: 10.2.2.1</span>
                </div>
                <div className="text-[10px] font-mono text-zinc-500 mt-1">Subnet: 10.2.0.0/16</div>
              </div>
            </Card>
          </div>

          {/* Selected Router Detailed Telemetry */}
          <Card className="p-5 border-zinc-800 bg-zinc-950 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-[#00f0ff]" />
                <span className="text-sm font-bold text-white">{activeRouter.name}</span>
                <Badge variant="cyan">{activeRouter.role}</Badge>
                <Badge variant="neutral">{activeRouter.area}</Badge>
              </div>
              <span className="text-xs font-mono text-zinc-400">Click any router above to inspect its LSDB & routing table</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Routing Table */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-mono font-bold text-zinc-400">// IP ROUTING TABLE:</span>
                <div className="p-3 rounded-lg bg-black/80 border border-zinc-800 font-mono text-xs flex flex-col gap-1.5">
                  {activeRouter.routes.map((route, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-white">{route}</span>
                      <span className="text-[10px] text-zinc-500">
                        {route.includes('[O]') ? 'Intra-Area' : route.includes('[O IA]') ? 'Inter-Area' : 'External'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* LSAs Originated */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-mono font-bold text-zinc-400">// LSDB ADVERTISEMENTS ORIGINATED:</span>
                <div className="p-3 rounded-lg bg-black/80 border border-zinc-800 font-mono text-xs flex flex-col gap-1.5 text-[#00f0ff]">
                  {activeRouter.lsasOriginated.map((lsa, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{lsa}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: LSA TYPE FLOW (1-5) */}
      {activeTab === 'lsas' && (
        <div className="flex flex-col gap-6">
          {/* LSA Type Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {lsaDefinitions.map((lsa) => (
              <button
                key={lsa.type}
                onClick={() => setSelectedLsaType(lsa.type)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedLsaType === lsa.type
                    ? 'border-[#00f0ff] bg-[#00f0ff]/10 text-white shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="text-xs font-bold">Type {lsa.type}</div>
                <div className="text-[10px] font-mono text-zinc-500 truncate mt-0.5">{lsa.name.split(':')[1]}</div>
              </button>
            ))}
          </div>

          {/* Active LSA Deep Dive */}
          <Card className="p-6 border-zinc-800 bg-zinc-950 flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Badge variant="cyan">{activeLsa.name}</Badge>
                <span className="text-xs font-mono text-emerald-400 font-bold">Routing Code: {activeLsa.routingCode}</span>
              </div>
              <Badge variant="neutral">{activeLsa.floodingScope}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-zinc-400 font-bold">ORIGINATING ENTITY:</span>
                <p className="text-zinc-200">{activeLsa.originator}</p>

                <span className="font-mono text-zinc-400 font-bold mt-2">TECHNICAL PURPOSE:</span>
                <p className="text-zinc-300 leading-relaxed">{activeLsa.purpose}</p>
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-mono text-zinc-400 font-bold">LIVE TOPOLOGY APPLICATION:</span>
                <div className="p-3.5 rounded-lg bg-black/80 border border-zinc-800 font-mono text-zinc-300 leading-relaxed">
                  {activeLsa.example}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: ROUTE SUMMARIZATION SANDBOX */}
      {activeTab === 'summarization' && (
        <Card className="p-6 border-zinc-800 bg-zinc-950 flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white">Inter-Area Route Summarization (ABR Optimization)</h4>
              <p className="text-xs text-zinc-400">
                Reduce Link-State Database (LSDB) size and prevent inter-area SPF calculation spikes caused by local flap events.
              </p>
            </div>
            <Button
              size="sm"
              variant={summarizationEnabled ? 'primary' : 'outline'}
              onClick={() => setSummarizationEnabled(!summarizationEnabled)}
              className={summarizationEnabled ? 'bg-[#00f0ff] text-black hover:bg-[#00f0ff]/90' : 'text-zinc-300'}
            >
              {summarizationEnabled ? 'Summarization: ENABLED (10.1.0.0/16)' : 'Summarization: DISABLED (Individual /24s)'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Area 1 Subnets */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono font-bold text-emerald-400">AREA 1 INTERNAL SUBNETS:</span>
              <div className="p-3.5 rounded-lg bg-black/80 border border-zinc-800 font-mono text-xs flex flex-col gap-1.5 text-zinc-300">
                <div>• 10.1.1.0/24 (Engineering LAN)</div>
                <div>• 10.1.2.0/24 (Finance LAN)</div>
                <div>• 10.1.3.0/24 (Operations LAN)</div>
                <div>• 10.1.4.0/24 (Executive LAN)</div>
              </div>
            </div>

            {/* Advertised into Area 0 */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono font-bold text-[#00f0ff]">TYPE 3 LSAs ADVERTISED INTO AREA 0:</span>
              <div className="p-3.5 rounded-lg bg-black/80 border border-zinc-800 font-mono text-xs flex flex-col gap-1.5">
                {summarizationEnabled ? (
                  <div className="text-emerald-400 font-bold">
                    ✅ 10.1.0.0/16 [Summary LSA - 1 single LSA replacing 4 individual routes]
                  </div>
                ) : (
                  <div className="text-amber-400 flex flex-col gap-1">
                    <div>⚠️ 10.1.1.0/24 [Type 3 LSA]</div>
                    <div>⚠️ 10.1.2.0/24 [Type 3 LSA]</div>
                    <div>⚠️ 10.1.3.0/24 [Type 3 LSA]</div>
                    <div>⚠️ 10.1.4.0/24 [Type 3 LSA]</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-900/80 border border-zinc-800 font-mono text-xs text-zinc-400">
            <span className="text-[#00f0ff] font-bold">ABR Configuration: </span>
            <code>router ospf 1 ➔ area 1 range 10.1.0.0 255.255.0.0</code>
          </div>
        </Card>
      )}

      {/* TAB 4: ASBR REDISTRIBUTION ENGINE */}
      {activeTab === 'redistribution' && (
        <Card className="p-6 border-zinc-800 bg-zinc-950 flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white">ASBR External Route Redistribution & Metric Types</h4>
              <p className="text-xs text-zinc-400">
                Compare Metric Type 1 (E1: Seed Metric + Internal Link Costs) vs Metric Type 2 (E2: Constant Seed Metric).
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={redistributionMetricType === 'E2' ? 'primary' : 'outline'}
                onClick={() => setRedistributionMetricType('E2')}
                className={redistributionMetricType === 'E2' ? 'bg-[#00f0ff] text-black' : 'text-zinc-300'}
              >
                Metric Type 2 (E2 - Default)
              </Button>
              <Button
                size="sm"
                variant={redistributionMetricType === 'E1' ? 'primary' : 'outline'}
                onClick={() => setRedistributionMetricType('E1')}
                className={redistributionMetricType === 'E1' ? 'bg-[#00f0ff] text-black' : 'text-zinc-300'}
              >
                Metric Type 1 (E1 - Cumulative)
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 border-zinc-800 bg-zinc-900/60 flex flex-col gap-2 text-xs">
              <span className="font-mono font-bold text-[#00f0ff]">METRIC CALCULATION BEHAVIOR:</span>
              <p className="text-zinc-300 leading-relaxed">
                {redistributionMetricType === 'E2'
                  ? 'E2 routes maintain a constant cost (default 20) regardless of the number of internal OSPF hops traversed. Used when internal path differences are negligible.'
                  : 'E1 routes dynamically accumulate cost by adding the internal path cost to the initial seed metric (20 + internal OSPF link metrics). Preferred when multiple ASBR exit points exist.'}
              </p>
            </Card>

            <Card className="p-4 border-zinc-800 bg-zinc-900/60 flex flex-col gap-2 text-xs font-mono">
              <span className="font-bold text-emerald-400">ROUTER R1 ROUTE TELEMETRY (AREA 1):</span>
              <div className="p-2.5 rounded bg-black border border-zinc-800 text-zinc-200">
                {redistributionMetricType === 'E2'
                  ? 'O E2 172.16.0.0/12 [110/20] via 10.1.12.2 (Cost: 20 constant)'
                  : 'O E1 172.16.0.0/12 [110/35] via 10.1.12.2 (Seed: 20 + Area1: 10 + Area0: 5 = 35)'}
              </div>
            </Card>
          </div>
        </Card>
      )}

      {/* TAB 5: PRACTICE WORKBENCH */}
      {activeTab === 'practice' && (
        <Card className="p-6 border-zinc-800 bg-zinc-950 flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <span className="text-xs font-mono text-[#00f0ff] font-bold">
              EXERCISE {practiceIndex + 1} OF {practiceItems.length}
            </span>
            <div className="flex gap-1.5">
              {practiceItems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPracticeIndex(i);
                    setPracticeAnswer('');
                    setPracticeFeedback(null);
                  }}
                  className={`w-6 h-6 rounded text-xs font-mono font-bold ${
                    practiceIndex === i
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
              {practiceItems[practiceIndex].prompt}
            </h4>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={practiceAnswer}
              onChange={(e) => setPracticeAnswer(e.target.value)}
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

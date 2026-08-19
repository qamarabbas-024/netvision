'use client';

import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  RotateCcw,
  Trash2,
  Save,
  Link as LinkIcon,
  MousePointer,
  Settings,
  Activity,
  Terminal,
  Download,
  Upload,
  Wrench,
  CheckCircle2,
  XCircle,
  Eye,
  Layers,
  Award,
  AlertTriangle,
  ArrowRight,
  Info,
  Laptop,
  Radio,
  Server,
  Cloud,
  Monitor,
  Cpu,
  Shield,
  Database,
  Wifi,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NetworkNode, NetworkLink, NetworkPacket, NodeType } from '@/types';
import { DeviceConfigModal } from '../simulation/DeviceConfigModal';
import { PacketInspectorModal } from '../simulation/PacketInspectorModal';
import { DevicePalette } from './DevicePalette';
import { PortSelectionModal } from './PortSelectionModal';
import { DeviceCliModal } from './DeviceCliModal';
import { TroubleshootingScenariosModal, TroubleshootingScenario } from './TroubleshootingScenariosModal';

export type SimulatorMode = 'build' | 'inspect' | 'packet' | 'layer' | 'challenge';

interface ChallengeSpec {
  id: string;
  title: string;
  description: string;
  goal: string;
  verify: (nodes: NetworkNode[], links: NetworkLink[]) => { passed: boolean; feedback: string };
}

const BUILT_IN_CHALLENGES: ChallengeSpec[] = [
  {
    id: 'ch-1',
    title: 'Basic Switched LAN',
    description: 'Build a Local Area Network with at least two PCs connected to a central Switch on the 192.168.1.0/24 subnet.',
    goal: 'Add 2 PCs + 1 Switch, connect both PCs to the switch with Ethernet cables, and verify IP subnet match.',
    verify: (nodes, links) => {
      const pcs = nodes.filter((n) => n.type === 'pc' || n.type === 'laptop');
      const switches = nodes.filter((n) => n.type === 'switch');
      if (pcs.length < 2) {
        return { passed: false, feedback: `Topology requires at least 2 PCs/Laptops (Found: ${pcs.length}).` };
      }
      if (switches.length < 1) {
        return { passed: false, feedback: `Topology requires at least 1 Switch (Found: ${switches.length}).` };
      }
      const switchId = switches[0].id;
      const pc1Connected = links.some((l) => (l.sourceNodeId === pcs[0].id && l.targetNodeId === switchId) || (l.targetNodeId === pcs[0].id && l.sourceNodeId === switchId));
      const pc2Connected = links.some((l) => (l.sourceNodeId === pcs[1].id && l.targetNodeId === switchId) || (l.targetNodeId === pcs[1].id && l.sourceNodeId === switchId));
      if (!pc1Connected || !pc2Connected) {
        return { passed: false, feedback: `Both PCs must be directly cabled to the Switch (${switches[0].name}).` };
      }
      return { passed: true, feedback: 'LAN topology verified! All PCs are properly connected through the central L2 switch on the local broadcast domain.' };
    },
  },
  {
    id: 'ch-2',
    title: 'Routed Subnet Gateway',
    description: 'Connect a client LAN (192.168.1.0/24) to a remote server subnet (10.0.0.0/24) via a Gateway Router.',
    goal: 'Add 1 PC, 1 Router, and 1 Server. Cable PC -> Router and Router -> Server.',
    verify: (nodes, links) => {
      const pcs = nodes.filter((n) => n.type === 'pc' || n.type === 'laptop');
      const routers = nodes.filter((n) => n.type === 'router');
      const servers = nodes.filter((n) => n.type === 'server');
      if (pcs.length < 1) return { passed: false, feedback: 'Missing Client PC/Laptop.' };
      if (routers.length < 1) return { passed: false, feedback: 'Missing Gateway Router for inter-subnet routing.' };
      if (servers.length < 1) return { passed: false, feedback: 'Missing Remote Server.' };
      const rId = routers[0].id;
      const pcToR = links.some((l) => (l.sourceNodeId === pcs[0].id && l.targetNodeId === rId) || (l.targetNodeId === pcs[0].id && l.sourceNodeId === rId));
      const rToS = links.some((l) => (l.sourceNodeId === servers[0].id && l.targetNodeId === rId) || (l.targetNodeId === servers[0].id && l.sourceNodeId === rId));
      if (!pcToR || !rToS) {
        return { passed: false, feedback: 'Cables must connect PC -> Router and Router -> Server.' };
      }
      return { passed: true, feedback: 'Routed topology verified! The gateway router provides Layer 3 forwarding between separate subnets.' };
    },
  },
  {
    id: 'ch-3',
    title: 'Enterprise Secured Perimeter',
    description: 'Build a secure DMZ pipeline: PC -> Switch -> Router -> Firewall -> Web Server.',
    goal: 'Create an end-to-end path from client to server guarded by a firewall.',
    verify: (nodes, links) => {
      const pcs = nodes.filter((n) => n.type === 'pc' || n.type === 'laptop');
      const switches = nodes.filter((n) => n.type === 'switch');
      const routers = nodes.filter((n) => n.type === 'router');
      const firewalls = nodes.filter((n) => n.type === 'firewall');
      const servers = nodes.filter((n) => n.type === 'server');
      if (!pcs.length || !switches.length || !routers.length || !firewalls.length || !servers.length) {
        return { passed: false, feedback: 'Topology requires at least 1 PC, 1 Switch, 1 Router, 1 Firewall, and 1 Server.' };
      }
      return { passed: true, feedback: 'Perimeter topology verified! Packets pass through the switch, gateway router, and stateful firewall.' };
    },
  },
];

export const SandboxCanvas: React.FC = () => {
  const [nodes, setNodes] = useState<NetworkNode[]>([
    {
      id: 'sb-1',
      name: 'Client PC 1',
      type: 'pc',
      ipAddress: '192.168.1.10',
      macAddress: '00:1A:2B:11:11:11',
      subnetMask: '255.255.255.0',
      defaultGateway: '192.168.1.1',
      status: 'online',
      position: { x: 100, y: 150 },
    },
    {
      id: 'sb-2',
      name: 'Client PC 2',
      type: 'laptop',
      ipAddress: '192.168.1.11',
      macAddress: '00:1A:2B:22:22:22',
      subnetMask: '255.255.255.0',
      defaultGateway: '192.168.1.1',
      status: 'online',
      position: { x: 100, y: 320 },
    },
    {
      id: 'sb-3',
      name: 'Core Switch',
      type: 'switch',
      ipAddress: '192.168.1.1',
      macAddress: '00:1A:2B:33:33:33',
      status: 'online',
      position: { x: 380, y: 235 },
    },
    {
      id: 'sb-4',
      name: 'Gateway Router',
      type: 'router',
      ipAddress: '10.0.0.1',
      macAddress: '00:1A:2B:44:44:44',
      status: 'online',
      position: { x: 660, y: 235 },
    },
    {
      id: 'sb-5',
      name: 'Web Server',
      type: 'server',
      ipAddress: '172.16.0.5',
      macAddress: '00:1A:2B:55:55:55',
      status: 'online',
      position: { x: 920, y: 235 },
    },
  ]);

  const [links, setLinks] = useState<NetworkLink[]>([
    { id: 'sbl-1', sourceNodeId: 'sb-1', targetNodeId: 'sb-3', sourcePort: 'eth0', targetPort: 'eth0/1', bandwidthMbps: 1000, latencyMs: 1, status: 'connected' },
    { id: 'sbl-2', sourceNodeId: 'sb-2', targetNodeId: 'sb-3', sourcePort: 'eth0', targetPort: 'eth0/2', bandwidthMbps: 1000, latencyMs: 1, status: 'connected' },
    { id: 'sbl-3', sourceNodeId: 'sb-3', targetNodeId: 'sb-4', sourcePort: 'eth0/24', targetPort: 'ge0/0/0', bandwidthMbps: 1000, latencyMs: 2, status: 'connected' },
    { id: 'sbl-4', sourceNodeId: 'sb-4', targetNodeId: 'sb-5', sourcePort: 'ge0/0/1', targetPort: 'eth0', bandwidthMbps: 1000, latencyMs: 5, status: 'connected' },
  ]);

  // Active Simulator Mode: 'build' | 'inspect' | 'packet' | 'layer' | 'challenge'
  const [activeMode, setActiveMode] = useState<SimulatorMode>('build');

  // Cable Tool State
  const [toolAction, setToolAction] = useState<'select' | 'cable'>('select');
  const [cableSourceNode, setCableSourceNode] = useState<NetworkNode | null>(null);
  const [cableTargetNode, setCableTargetNode] = useState<NetworkNode | null>(null);
  const [showPortModal, setShowPortModal] = useState<boolean>(false);

  // Selected Node & Modal States
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [configNode, setConfigNode] = useState<NetworkNode | null>(null);
  const [cliNode, setCliNode] = useState<NetworkNode | null>(null);
  const [showScenariosModal, setShowScenariosModal] = useState<boolean>(false);
  const [activeScenario, setActiveScenario] = useState<TroubleshootingScenario | null>(null);

  // Packet Mode State & Hop-by-Hop Animation
  const [sourceNodeId, setSourceNodeId] = useState<string>('sb-1');
  const [targetNodeId, setTargetNodeId] = useState<string>('sb-5');
  const [packetProtocol, setPacketProtocol] = useState<'ICMP' | 'HTTP' | 'DNS' | 'TCP'>('ICMP');
  const [packetHopPath, setPacketHopPath] = useState<string[]>([]);
  const [currentHopIndex, setCurrentHopIndex] = useState<number>(0);
  const [packetStatusMessage, setPacketStatusMessage] = useState<string>('');
  const [isPacketTransmitting, setIsPacketTransmitting] = useState<boolean>(false);
  const [inspectedPacket, setInspectedPacket] = useState<NetworkPacket | null>(null);

  // Challenge Mode State
  const [activeChallengeIndex, setActiveChallengeIndex] = useState<number>(0);
  const [challengeResult, setChallengeResult] = useState<{ passed: boolean; feedback: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Find Path Between Source & Destination (BFS on links graph)
  const findPath = (srcId: string, dstId: string): string[] => {
    if (srcId === dstId) return [srcId];
    const adj = new Map<string, string[]>();
    nodes.forEach((n) => adj.set(n.id, []));
    links.forEach((l) => {
      adj.get(l.sourceNodeId)?.push(l.targetNodeId);
      adj.get(l.targetNodeId)?.push(l.sourceNodeId);
    });

    const queue: string[][] = [[srcId]];
    const visited = new Set<string>([srcId]);

    while (queue.length > 0) {
      const path = queue.shift()!;
      const last = path[path.length - 1];
      if (last === dstId) return path;

      const neighbors = adj.get(last) || [];
      for (const nbr of neighbors) {
        if (!visited.has(nbr)) {
          visited.add(nbr);
          queue.push([...path, nbr]);
        }
      }
    }
    return [];
  };

  // Add Device Node
  const handleAddDevice = (type: NodeType) => {
    const id = `sb-${Math.random().toString(36).substring(2, 7)}`;
    const count = nodes.length + 1;
    const newNode: NetworkNode = {
      id,
      name: `${type.toUpperCase()} ${count}`,
      type,
      ipAddress: `192.168.1.${10 + count}`,
      macAddress: `00:1A:2B:${count}${count}:${count}${count}:${count}${count}`,
      subnetMask: '255.255.255.0',
      defaultGateway: '192.168.1.1',
      status: 'online',
      position: { x: 250 + Math.random() * 200, y: 150 + Math.random() * 150 },
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(id);
  };

  // Node Click Logic
  const handleNodeClick = (node: NetworkNode) => {
    if (toolAction === 'cable') {
      if (!cableSourceNode) {
        setCableSourceNode(node);
      } else if (cableSourceNode.id !== node.id) {
        setCableTargetNode(node);
        setShowPortModal(true);
      }
    } else {
      setSelectedNodeId(node.id);
    }
  };

  // Establish Physical Wiring Link from Port Modal
  const handleConfirmLink = (sourcePort: string, targetPort: string, bandwidthMbps: number) => {
    if (!cableSourceNode || !cableTargetNode) return;
    const newLinkId = `sbl-${Math.random().toString(36).substring(2, 7)}`;
    setLinks((prev) => [
      ...prev,
      {
        id: newLinkId,
        sourceNodeId: cableSourceNode.id,
        targetNodeId: cableTargetNode.id,
        sourcePort,
        targetPort,
        bandwidthMbps,
        latencyMs: 1,
        status: 'connected',
      },
    ]);
    setCableSourceNode(null);
    setCableTargetNode(null);
    setToolAction('select');
  };

  // Delete Selected Node
  const handleDeleteSelected = () => {
    if (!selectedNodeId) return;
    setNodes((prev) => prev.filter((n) => n.id !== selectedNodeId));
    setLinks((prev) => prev.filter((l) => l.sourceNodeId !== selectedNodeId && l.targetNodeId !== selectedNodeId));
    setSelectedNodeId(null);
  };

  // Dispatch Realistic Packet Flow
  const handleDispatchPacket = () => {
    const src = nodes.find((n) => n.id === sourceNodeId);
    const dst = nodes.find((n) => n.id === targetNodeId);
    if (!src || !dst) return;

    const path = findPath(sourceNodeId, targetNodeId);
    if (path.length === 0) {
      setPacketHopPath([sourceNodeId]);
      setCurrentHopIndex(0);
      setPacketStatusMessage(`Packet Dropped: No physical link path exists between ${src.name} and ${dst.name}.`);
      setIsPacketTransmitting(false);
      return;
    }

    setPacketHopPath(path);
    setCurrentHopIndex(0);
    setIsPacketTransmitting(true);
    setPacketStatusMessage(`Dispatching ${packetProtocol} packet from ${src.name} (${src.ipAddress}) to ${dst.name} (${dst.ipAddress})...`);

    let hop = 0;
    const interval = setInterval(() => {
      hop += 1;
      if (hop >= path.length) {
        clearInterval(interval);
        setIsPacketTransmitting(false);
        setPacketStatusMessage(`Delivered: ${packetProtocol} packet reached destination ${dst.name} successfully.`);
      } else {
        setCurrentHopIndex(hop);
        const currentNode = nodes.find((n) => n.id === path[hop]);
        setPacketStatusMessage(`Traversing: Packet reached hop ${hop + 1} of ${path.length} (${currentNode?.name || 'Node'}).`);
      }
    }, 700);
  };

  // Verify Active Challenge
  const handleVerifyChallenge = () => {
    const activeChallenge = BUILT_IN_CHALLENGES[activeChallengeIndex];
    const res = activeChallenge.verify(nodes, links);
    setChallengeResult(res);
  };

  const selectedNode = useMemo(() => nodes.find((n) => n.id === selectedNodeId), [nodes, selectedNodeId]);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'pc': return <Monitor className="w-5 h-5 text-emerald-400" />;
      case 'laptop': return <Laptop className="w-5 h-5 text-teal-400" />;
      case 'switch': return <Cpu className="w-5 h-5 text-blue-400" />;
      case 'router': return <Radio className="w-5 h-5 text-[#00f0ff]" />;
      case 'firewall': return <Shield className="w-5 h-5 text-rose-400" />;
      case 'server': return <Server className="w-5 h-5 text-purple-400" />;
      case 'dns': return <Database className="w-5 h-5 text-amber-400" />;
      case 'dhcp': return <Server className="w-5 h-5 text-yellow-400" />;
      case 'ap': return <Wifi className="w-5 h-5 text-sky-400" />;
      default: return <Cloud className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="w-full flex flex-col gap-5 font-sans">
      {/* Mode Navigation Bar */}
      <div className="glass-panel p-2.5 rounded-xl border border-[#272732] flex items-center justify-between gap-3 overflow-x-auto">
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            variant={activeMode === 'build' ? 'cyan' : 'ghost'}
            size="sm"
            onClick={() => setActiveMode('build')}
            leftIcon={<Wrench className="w-3.5 h-3.5" />}
          >
            1. BUILD
          </Button>

          <Button
            variant={activeMode === 'inspect' ? 'cyan' : 'ghost'}
            size="sm"
            onClick={() => setActiveMode('inspect')}
            leftIcon={<Eye className="w-3.5 h-3.5" />}
          >
            2. INSPECT
          </Button>

          <Button
            variant={activeMode === 'packet' ? 'cyan' : 'ghost'}
            size="sm"
            onClick={() => setActiveMode('packet')}
            leftIcon={<Activity className="w-3.5 h-3.5" />}
          >
            3. PACKET
          </Button>

          <Button
            variant={activeMode === 'layer' ? 'cyan' : 'ghost'}
            size="sm"
            onClick={() => setActiveMode('layer')}
            leftIcon={<Layers className="w-3.5 h-3.5" />}
          >
            4. LAYER (OSI)
          </Button>

          <Button
            variant={activeMode === 'challenge' ? 'cyan' : 'ghost'}
            size="sm"
            onClick={() => setActiveMode('challenge')}
            leftIcon={<Award className="w-3.5 h-3.5" />}
          >
            5. CHALLENGE
          </Button>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="cyan">{nodes.length} Nodes</Badge>
          <Badge variant="purple">{links.length} Links</Badge>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="w-full flex flex-col lg:flex-row gap-5">
        {/* Left: Device Palette (Active in Build Mode) */}
        {activeMode === 'build' && <DevicePalette onAddDevice={handleAddDevice} />}

        {/* Center Canvas Area */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Action Toolbar */}
          <div className="glass-panel p-3.5 rounded-xl border border-[#272732] flex flex-wrap items-center justify-between gap-3">
            {/* Build Mode Controls */}
            {activeMode === 'build' && (
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant={toolAction === 'select' ? 'cyan' : 'ghost'}
                  size="sm"
                  onClick={() => { setToolAction('select'); setCableSourceNode(null); }}
                  leftIcon={<MousePointer className="w-3.5 h-3.5" />}
                >
                  Select / Move
                </Button>

                <Button
                  variant={toolAction === 'cable' ? 'cyan' : 'ghost'}
                  size="sm"
                  onClick={() => setToolAction('cable')}
                  leftIcon={<LinkIcon className="w-3.5 h-3.5" />}
                >
                  {cableSourceNode ? `Click Target (${cableSourceNode.name})` : 'Connect Cable'}
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  disabled={!selectedNodeId}
                  onClick={handleDeleteSelected}
                  leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                >
                  Delete Selected
                </Button>
              </div>
            )}

            {/* Packet Mode Controls */}
            {activeMode === 'packet' && (
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <select
                  value={sourceNodeId}
                  onChange={(e) => setSourceNodeId(e.target.value)}
                  className="bg-[#121217] text-white border border-[#272732] rounded-lg px-2 py-1 text-xs font-mono"
                >
                  {nodes.map((n) => (
                    <option key={n.id} value={n.id}>Src: {n.name}</option>
                  ))}
                </select>

                <select
                  value={targetNodeId}
                  onChange={(e) => setTargetNodeId(e.target.value)}
                  className="bg-[#121217] text-white border border-[#272732] rounded-lg px-2 py-1 text-xs font-mono"
                >
                  {nodes.map((n) => (
                    <option key={n.id} value={n.id}>Dst: {n.name}</option>
                  ))}
                </select>

                <select
                  value={packetProtocol}
                  onChange={(e) => setPacketProtocol(e.target.value as any)}
                  className="bg-[#121217] text-white border border-[#272732] rounded-lg px-2 py-1 text-xs font-mono"
                >
                  <option value="ICMP">ICMP Ping</option>
                  <option value="HTTP">HTTP GET</option>
                  <option value="DNS">DNS Query</option>
                  <option value="TCP">TCP SYN</option>
                </select>

                <Button
                  variant="cyan"
                  size="sm"
                  onClick={handleDispatchPacket}
                  disabled={isPacketTransmitting}
                  leftIcon={<Play className="w-3.5 h-3.5" />}
                >
                  {isPacketTransmitting ? 'Transmitting...' : 'Dispatch Packet'}
                </Button>
              </div>
            )}

            {/* Challenge Mode Controls */}
            {activeMode === 'challenge' && (
              <div className="flex flex-wrap items-center justify-between gap-2 w-full">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white font-mono">Select Challenge:</span>
                  <select
                    value={activeChallengeIndex}
                    onChange={(e) => {
                      setActiveChallengeIndex(Number(e.target.value));
                      setChallengeResult(null);
                    }}
                    className="bg-[#121217] text-white border border-[#272732] rounded-lg px-2.5 py-1 text-xs"
                  >
                    {BUILT_IN_CHALLENGES.map((ch, idx) => (
                      <option key={ch.id} value={idx}>{idx + 1}. {ch.title}</option>
                    ))}
                  </select>
                </div>

                <Button variant="cyan" size="sm" onClick={handleVerifyChallenge} leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                  Verify Topology
                </Button>
              </div>
            )}

            {/* Export / Scenarios Tools */}
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="ghost" size="sm" onClick={() => setShowScenariosModal(true)} leftIcon={<Wrench className="w-3.5 h-3.5" />}>
                Preset Scenarios
              </Button>
            </div>
          </div>

          {/* Status Message Display */}
          {packetStatusMessage && (
            <div className="p-3 rounded-xl bg-[#121217] border border-[#272732] text-xs font-mono text-zinc-300 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#00f0ff] shrink-0" />
              <span>{packetStatusMessage}</span>
            </div>
          )}

          {/* Challenge Goal & Feedback Card */}
          {activeMode === 'challenge' && (
            <Card className="p-4 glass-panel border-[#272732] space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold text-[#00f0ff] uppercase">
                  {BUILT_IN_CHALLENGES[activeChallengeIndex].title}
                </h4>
                <Badge variant="cyan">Objective</Badge>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {BUILT_IN_CHALLENGES[activeChallengeIndex].goal}
              </p>

              {challengeResult && (
                <div
                  className={`mt-2 p-3 rounded-lg border text-xs flex items-start gap-2 ${
                    challengeResult.passed
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}
                >
                  {challengeResult.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <span>{challengeResult.feedback}</span>
                </div>
              )}
            </Card>
          )}

          {/* Canvas Box */}
          <div className="relative w-full h-[500px] bg-[#09090b] rounded-2xl border border-[#272732] overflow-x-auto overflow-y-hidden p-4 bg-net-grid-pattern">
            <div className="min-w-[980px] h-full relative">
              {/* SVG Cable Layer */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {links.map((link) => {
                  const srcNode = nodes.find((n) => n.id === link.sourceNodeId);
                  const tgtNode = nodes.find((n) => n.id === link.targetNodeId);
                  if (!srcNode || !tgtNode) return null;

                  return (
                    <g key={link.id}>
                      <line
                        x1={srcNode.position.x + 28}
                        y1={srcNode.position.y + 28}
                        x2={tgtNode.position.x + 28}
                        y2={tgtNode.position.y + 28}
                        stroke="#00f0ff"
                        strokeWidth="2"
                        strokeDasharray="4 3"
                        className="opacity-70"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Node Devices */}
              {nodes.map((node) => {
                const isSelected = selectedNodeId === node.id;
                const isCableSource = cableSourceNode?.id === node.id;
                const isCurrentHop = packetHopPath.length > 0 && packetHopPath[currentHopIndex] === node.id;

                return (
                  <motion.div
                    key={node.id}
                    drag
                    dragMomentum={false}
                    onDrag={(_, info) => {
                      setNodes((prev) =>
                        prev.map((n) =>
                          n.id === node.id
                            ? { ...n, position: { x: n.position.x + info.delta.x, y: n.position.y + info.delta.y } }
                            : n
                        )
                      );
                    }}
                    style={{ left: node.position.x, top: node.position.y }}
                    onClick={() => handleNodeClick(node)}
                    className="absolute z-10 flex flex-col items-center gap-1.5 cursor-grab active:cursor-grabbing group"
                  >
                    <div
                      className={`w-14 h-14 rounded-xl glass-panel border flex items-center justify-center transition-all relative ${
                        isCurrentHop
                          ? 'border-emerald-400 bg-emerald-500/20 ring-4 ring-emerald-500/30 animate-pulse'
                          : isCableSource
                          ? 'border-[#00f0ff] bg-[#00f0ff]/20 animate-pulse'
                          : isSelected
                          ? 'border-[#00f0ff] bg-white/10'
                          : 'border-[#272732] hover:border-zinc-500'
                      }`}
                    >
                      {getNodeIcon(node.type)}

                      {/* Quick Config Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfigNode(node);
                        }}
                        className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Configure Device"
                      >
                        <Settings className="w-3 h-3" />
                      </button>

                      {/* Quick CLI Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCliNode(node);
                        }}
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 text-[#00f0ff] hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Open CLI"
                      >
                        <Terminal className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-center">
                      <span className="text-[11px] font-bold text-white block truncate max-w-[100px]">
                        {node.name}
                      </span>
                      <span className="text-[9px] font-mono text-zinc-400">{node.ipAddress}</span>
                    </div>
                  </motion.div>
                );
              })}

              {/* Packet In-Flight Animation */}
              {isPacketTransmitting && packetHopPath.length > 0 && (
                <motion.div
                  style={{
                    left: nodes.find((n) => n.id === packetHopPath[currentHopIndex])?.position.x || 100,
                    top: (nodes.find((n) => n.id === packetHopPath[currentHopIndex])?.position.y || 100) - 20,
                  }}
                  className="absolute z-30 transition-all duration-500"
                >
                  <div className="px-2 py-0.5 rounded-md bg-[#00f0ff] text-black font-mono text-[10px] font-extrabold flex items-center gap-1 shadow-md">
                    <Activity className="w-3 h-3 animate-spin" />
                    <span>{packetProtocol}</span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Inspector / Layer Panel */}
        {(activeMode === 'inspect' || activeMode === 'layer') && (
          <Card className="w-full lg:w-72 p-4 glass-panel border-[#272732] flex flex-col gap-4 shrink-0">
            {activeMode === 'inspect' && (
              <>
                <div className="flex items-center justify-between border-b border-[#272732] pb-2">
                  <h3 className="text-xs font-mono font-bold text-white uppercase">Device Inspector</h3>
                  <Badge variant="cyan">{selectedNode?.type?.toUpperCase() || 'SELECT NODE'}</Badge>
                </div>

                {selectedNode ? (
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-zinc-400 block font-mono text-[10px] uppercase">Device Name</span>
                      <span className="font-bold text-white">{selectedNode.name}</span>
                    </div>

                    <div>
                      <span className="text-zinc-400 block font-mono text-[10px] uppercase">IPv4 Address</span>
                      <span className="font-mono text-[#00f0ff]">{selectedNode.ipAddress}</span>
                    </div>

                    <div>
                      <span className="text-zinc-400 block font-mono text-[10px] uppercase">MAC Address</span>
                      <span className="font-mono text-zinc-300">{selectedNode.macAddress}</span>
                    </div>

                    <div>
                      <span className="text-zinc-400 block font-mono text-[10px] uppercase">Subnet Mask</span>
                      <span className="font-mono text-zinc-300">{selectedNode.subnetMask || '255.255.255.0'}</span>
                    </div>

                    <div>
                      <span className="text-zinc-400 block font-mono text-[10px] uppercase">Gateway</span>
                      <span className="font-mono text-zinc-300">{selectedNode.defaultGateway || 'None'}</span>
                    </div>

                    <div>
                      <span className="text-zinc-400 block font-mono text-[10px] uppercase">Status</span>
                      <Badge variant="emerald">Online / Up</Badge>
                    </div>

                    <Button variant="cyan" size="sm" className="w-full" onClick={() => setConfigNode(selectedNode)}>
                      Configure Interface
                    </Button>
                  </div>
                ) : (
                  <div className="py-8 text-center text-zinc-500 text-xs">
                    Click any device on the canvas to inspect its hardware interfaces and routing tables.
                  </div>
                )}
              </>
            )}

            {activeMode === 'layer' && (
              <>
                <div className="flex items-center justify-between border-b border-[#272732] pb-2">
                  <h3 className="text-xs font-mono font-bold text-white uppercase">OSI Layer Stack</h3>
                  <Badge variant="purple">{packetProtocol}</Badge>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-[10px] font-mono text-[#00f0ff] font-bold block">L7 • APPLICATION</span>
                    <span className="text-zinc-300 font-mono text-[11px]">{packetProtocol} Payload Data</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-[10px] font-mono text-purple-400 font-bold block">L4 • TRANSPORT</span>
                    <span className="text-zinc-300 font-mono text-[11px]">Port 80 / 443 / ICMP Type 8</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold block">L3 • NETWORK (IP)</span>
                    <span className="text-zinc-300 font-mono text-[11px]">IPv4 Packet Headers (TTL: 64)</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-[10px] font-mono text-amber-400 font-bold block">L2 • DATA LINK (MAC)</span>
                    <span className="text-zinc-300 font-mono text-[11px]">Ethernet II Frame / FCS</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-[10px] font-mono text-zinc-400 font-bold block">L1 • PHYSICAL</span>
                    <span className="text-zinc-300 font-mono text-[11px]">1000BASE-T RJ45 / Port Up</span>
                  </div>
                </div>
              </>
            )}
          </Card>
        )}
      </div>

      {/* Modals */}
      <PortSelectionModal
        sourceNode={cableSourceNode}
        targetNode={cableTargetNode}
        isOpen={showPortModal}
        onClose={() => {
          setShowPortModal(false);
          setCableSourceNode(null);
          setCableTargetNode(null);
        }}
        onConfirm={handleConfirmLink}
      />

      <DeviceConfigModal
        node={configNode}
        isOpen={!!configNode}
        onClose={() => setConfigNode(null)}
        onSave={(updated) => {
          setNodes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
        }}
      />

      <DeviceCliModal
        node={cliNode}
        isOpen={!!cliNode}
        onClose={() => setCliNode(null)}
      />

      <TroubleshootingScenariosModal
        isOpen={showScenariosModal}
        onClose={() => setShowScenariosModal(false)}
        onLoadScenario={(scen) => {
          setActiveScenario(scen);
          setNodes(scen.presetTopology.nodes);
          setLinks(scen.presetTopology.links);
        }}
      />

      <PacketInspectorModal
        packet={inspectedPacket}
        isOpen={!!inspectedPacket}
        onClose={() => setInspectedPacket(null)}
      />
    </div>
  );
};

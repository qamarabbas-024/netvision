'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  ZoomIn,
  ZoomOut,
  Activity,
  Cpu,
  Radio,
  Server,
  Shield,
  Monitor,
  Globe,
  AlertCircle,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  NetworkNode,
  NetworkLink,
  NetworkPacket,
  PacketProtocol,
  SimulationEvent,
  SimulationLifecycleState,
} from '@/types';
import { PacketInspectorModal } from './PacketInspectorModal';
import { DeviceConfigModal } from './DeviceConfigModal';
import { SimulationEventLog } from './SimulationEventLog';

export interface SimulationEngineCanvasProps {
  initialNodes?: NetworkNode[];
  initialLinks?: NetworkLink[];
  onSimulationComplete?: () => void;
}

export const SimulationEngineCanvas: React.FC<SimulationEngineCanvasProps> = ({
  initialNodes,
  initialLinks,
  onSimulationComplete,
}) => {
  const [nodes, setNodes] = useState<NetworkNode[]>(
    initialNodes || [
      { id: 'n-1', name: 'Client PC 1', type: 'pc', ipAddress: '192.168.1.10', macAddress: '00:1A:2B:3C:4D:5E', status: 'online', position: { x: 80, y: 140 } },
      { id: 'n-2', name: 'L2 Switch', type: 'switch', ipAddress: '192.168.1.1', macAddress: '00:1A:2B:00:00:01', status: 'online', position: { x: 280, y: 140 } },
      { id: 'n-3', name: 'Gateway Router', type: 'router', ipAddress: '10.0.0.1', macAddress: '00:1A:2B:77:88:99', status: 'online', position: { x: 480, y: 140 } },
      { id: 'n-4', name: 'Stateful Firewall', type: 'firewall', ipAddress: '10.0.0.2', macAddress: '00:1A:2B:11:22:33', status: 'online', position: { x: 680, y: 140 } },
      { id: 'n-5', name: 'Web Server', type: 'server', ipAddress: '172.16.0.5', macAddress: '00:1A:2B:AA:BB:CC', status: 'online', position: { x: 880, y: 140 } },
    ]
  );

  const [links] = useState<NetworkLink[]>(
    initialLinks || [
      { id: 'l-1', sourceNodeId: 'n-1', targetNodeId: 'n-2', bandwidthMbps: 1000, latencyMs: 1, status: 'connected' },
      { id: 'l-2', sourceNodeId: 'n-2', targetNodeId: 'n-3', bandwidthMbps: 1000, latencyMs: 2, status: 'connected' },
      { id: 'l-3', sourceNodeId: 'n-3', targetNodeId: 'n-4', bandwidthMbps: 1000, latencyMs: 5, status: 'connected' },
      { id: 'l-4', sourceNodeId: 'n-4', targetNodeId: 'n-5', bandwidthMbps: 1000, latencyMs: 10, status: 'connected' },
    ]
  );

  // Controls & Lifecycle State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [selectedProtocol, setSelectedProtocol] = useState<PacketProtocol>('TCP');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [lifecycleState, setLifecycleState] = useState<SimulationLifecycleState>('IDLE');
  const [simulateFailure, setSimulateFailure] = useState<boolean>(false);
  const [guidanceNotice, setGuidanceNotice] = useState<string | null>(null);

  // Active Packets & Educational Events
  const [activePackets, setActivePackets] = useState<NetworkPacket[]>([]);
  const [events, setEvents] = useState<SimulationEvent[]>([]);
  const [inspectedPacket, setInspectedPacket] = useState<NetworkPacket | null>(null);
  const [selectedConfigNode, setSelectedConfigNode] = useState<NetworkNode | null>(null);

  const addEvent = (
    title: string,
    explanation: string,
    why?: string,
    technical?: string,
    type: SimulationEvent['type'] = 'info',
    nodeName?: string,
    protocol?: PacketProtocol
  ) => {
    const newEvent: SimulationEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toLocaleTimeString(),
      eventTitle: title,
      explanation,
      why,
      technical,
      type,
      nodeName,
      packetProtocol: protocol || selectedProtocol,
    };
    setEvents((prev) => [newEvent, ...prev]);
  };

  // Play vs Dispatch Handler
  const handlePlayClick = () => {
    if (activePackets.length === 0) {
      // PLAY clicked before sequence dispatched -> Show clear guidance & auto-stage
      setGuidanceNotice(
        `Staging ${selectedProtocol} sequence. Dispatching initial PDU segment from Client PC 1.`
      );
      dispatchPacket();
    } else {
      setIsPlaying(!isPlaying);
      setGuidanceNotice(null);
    }
  };

  // Dispatch Packet Sequence
  const dispatchPacket = () => {
    setGuidanceNotice(null);
    setLifecycleState('DISPATCHED');

    const srcNode = nodes[0];
    const dstNode = nodes[nodes.length - 1];

    let initialFlags = { syn: false, ack: false };
    let initialPayload = '';

    if (selectedProtocol === 'TCP') {
      initialFlags = { syn: true, ack: false };
      initialPayload = 'TCP SYN Segment [Seq=100 Ack=0 Window=65535]';
    } else if (selectedProtocol === 'DNS') {
      initialPayload = 'DNS Standard Query A webserver.netvision.local';
    } else if (selectedProtocol === 'ARP') {
      initialPayload = 'ARP Request: Who has 192.168.1.1? Tell 192.168.1.10';
    } else if (selectedProtocol === 'ICMP') {
      initialPayload = 'ICMP Echo Request [Type=8 Code=0 Data=Ping]';
    } else {
      initialPayload = 'HTTP GET /index.html HTTP/1.1';
    }

    const newPacket: NetworkPacket = {
      id: `pkt-${Math.random().toString(36).substring(2, 7)}`,
      sourceIp: srcNode.ipAddress,
      targetIp: dstNode.ipAddress,
      sourceMac: srcNode.macAddress,
      targetMac: dstNode.macAddress,
      protocol: selectedProtocol,
      payload: initialPayload,
      ttl: 64,
      status: 'in_flight',
      progressPercent: 0,
      flags: initialFlags,
      seqNumber: 100,
      ackNumber: 0,
      tcpState: selectedProtocol === 'TCP' ? 'SYN_SENT' : undefined,
      hopHistory: [srcNode.name],
    };

    setActivePackets([newPacket]);
    setLifecycleState('TRANSMITTING');
    setIsPlaying(true);

    addEvent(
      `Packet Dispatched from ${srcNode.name}`,
      `Initiated ${selectedProtocol} transmission toward target IP ${dstNode.ipAddress}. Constructing PDU headers.`,
      `The host application requested communication with server ${dstNode.ipAddress}. Layer 4 constructs control segments.`,
      `Protocol ${selectedProtocol} PDU initialized. Source MAC: ${srcNode.macAddress}.`,
      'info',
      srcNode.name,
      selectedProtocol
    );
  };

  // Simulation Animation & Node Processing Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setActivePackets((prevPackets) => {
          return prevPackets
            .map((p) => {
              const nextProgress = p.progressPercent + 3 * speedMultiplier;

              // Node Hop Milestones at 25%, 50%, 75%, 100%
              if (p.progressPercent < 25 && nextProgress >= 25) {
                addEvent(
                  `Ingress at ${nodes[1].name} (L2 Switch)`,
                  `L2 Switch receives Ethernet frame on Port 1. Inspects destination MAC address in MAC forwarding table.`,
                  `L2 switches operate at Data Link Layer and forward frames based on destination MAC addresses without modifying IP headers.`,
                  `Switch MAC Table match: Port 1 -> Port 2. Frame forwarded to next-hop router interface.`,
                  'info',
                  nodes[1].name,
                  p.protocol
                );
                p.hopHistory = Array.from(new Set([...(p.hopHistory || []), nodes[1].name]));
              } else if (p.progressPercent < 50 && nextProgress >= 50) {
                addEvent(
                  `Ingress at ${nodes[2].name} (Gateway Router)`,
                  `L3 Gateway Router receives IP packet. Decrements TTL to ${p.ttl - 1} and looks up route for ${p.targetIp}.`,
                  `Routers perform Layer 3 forwarding lookups using longest-prefix match on routing tables.`,
                  `TTL decremented from ${p.ttl} to ${p.ttl - 1}. Target subnet 172.16.0.0/24 routed to next-hop firewall interface.`,
                  'info',
                  nodes[2].name,
                  p.protocol
                );
                p.ttl = Math.max(0, p.ttl - 1);
                p.hopHistory = Array.from(new Set([...(p.hopHistory || []), nodes[2].name]));
              } else if (p.progressPercent < 75 && nextProgress >= 75) {
                if (simulateFailure) {
                  // Simulate Firewall Rule DENY Drop Failure
                  p.status = 'dropped';
                  p.dropReason = 'Stateful Firewall ACL Rule DENY Port 80 (HTTP)';
                  p.failureDetails = {
                    what: `Packet dropped by ${nodes[3].name} at Layer 4 inspection.`,
                    why: `Stateful Firewall ACL rule explicitly matched DENY for destination port 80/TCP.`,
                    evidence: `Firewall state log: DROP INBOUND TCP 192.168.1.10:54321 -> 172.16.0.5:80 (Rule #2 DENY).`,
                    troubleshooting: `Edit Firewall configuration rules to add an ALLOW rule for TCP Port 80.`,
                  };

                  addEvent(
                    `Firewall Security ACL Blocked Packet`,
                    `Stateful Firewall matched explicit DENY ACL rule for TCP Port 80. Frame dropped.`,
                    `Security firewalls filter unauthorized traffic by inspecting L4 port numbers and session state tables.`,
                    `ACL Policy Rule #2: DENY TCP Port 80 INBOUND. Packet discarded.`,
                    'error',
                    nodes[3].name,
                    p.protocol
                  );

                  setIsPlaying(false);
                  setLifecycleState('COMPLETED');
                  return { ...p, progressPercent: 75, status: 'dropped' as const };
                } else {
                  addEvent(
                    `Stateful Firewall Inspection (${nodes[3].name})`,
                    `Firewall evaluates active connection state table. Rule matching: ALLOW destination port 80/443.`,
                    `Stateful firewalls maintain connection tracking tables (CONNTRACK) to allow legitimate response traffic automatically.`,
                    `Firewall CONNTRACK updated: State SYN_SENT -> ESTABLISHED.`,
                    'success',
                    nodes[3].name,
                    p.protocol
                  );
                  p.hopHistory = Array.from(new Set([...(p.hopHistory || []), nodes[3].name]));
                }
              }

              if (nextProgress >= 100) {
                addEvent(
                  `Packet Delivered to ${nodes[4].name}`,
                  `Server successfully received ${p.protocol} packet. Dispatching SYN-ACK response frame.`,
                  `Server TCP stack processes SYN, allocates socket memory buffer, and responds with SYN-ACK.`,
                  `TCP SYN-ACK Segment generated: Seq=500, Ack=101, State=SYN_RECEIVED.`,
                  'success',
                  nodes[4].name,
                  p.protocol
                );
                setLifecycleState('COMPLETED');
                if (onSimulationComplete) onSimulationComplete();
                return { ...p, progressPercent: 100, status: 'delivered' as const };
              }

              return { ...p, progressPercent: nextProgress };
            })
            .filter((p) => p.progressPercent <= 100);
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speedMultiplier, nodes, simulateFailure, onSimulationComplete]);

  const handleStepForward = () => {
    setIsPlaying(false);
    setActivePackets((prev) =>
      prev.map((p) => ({ ...p, progressPercent: Math.min(100, p.progressPercent + 25) }))
    );
  };

  const resetSimulation = () => {
    setIsPlaying(false);
    setActivePackets([]);
    setEvents([]);
    setLifecycleState('IDLE');
    setGuidanceNotice(null);
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'pc': return <Monitor className="w-6 h-6 text-emerald-400" />;
      case 'switch': return <Cpu className="w-6 h-6 text-blue-400" />;
      case 'router': return <Radio className="w-6 h-6 text-[#00f0ff]" />;
      case 'firewall': return <Shield className="w-6 h-6 text-rose-400" />;
      case 'server': return <Server className="w-6 h-6 text-purple-400" />;
      default: return <Globe className="w-6 h-6 text-amber-400" />;
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Guidance Notice Banner if Play clicked before Dispatch */}
      {guidanceNotice && (
        <div className="p-3.5 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-xs text-[#00f0ff] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span className="font-mono font-semibold">{guidanceNotice}</span>
          </div>
          <button onClick={() => setGuidanceNotice(null)} className="text-zinc-400 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Simulation Controls Toolbar */}
      <div className="glass-panel p-3.5 sm:p-4 rounded-3xl border border-[#272732] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
        {/* Playback Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button
            variant="cyan"
            size="sm"
            onClick={handlePlayClick}
            leftIcon={isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          >
            {isPlaying ? 'Pause' : 'Play Sequence'}
          </Button>

          <Button variant="ghost" size="sm" onClick={handleStepForward} leftIcon={<StepForward className="w-4 h-4" />}>
            Step
          </Button>

          <Button variant="ghost" size="sm" onClick={resetSimulation} leftIcon={<RotateCcw className="w-4 h-4" />}>
            Reset
          </Button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-2 text-xs font-mono" role="group" aria-label="Simulation Playback Speed">
          <span className="text-zinc-400">Speed:</span>
          <div className="flex items-center gap-1">
            {[0.5, 1, 2, 4].map((s) => (
              <button
                key={s}
                type="button"
                aria-label={`Set simulation speed to ${s}x`}
                aria-pressed={speedMultiplier === s}
                onClick={() => setSpeedMultiplier(s)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b] ${
                  speedMultiplier === s
                    ? 'bg-[#00f0ff] text-black shadow-glow-cyan'
                    : 'bg-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Failure State Simulation Toggle */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            type="button"
            role="switch"
            aria-checked={simulateFailure}
            aria-label="Toggle network firewall drop failure mode"
            onClick={() => setSimulateFailure(!simulateFailure)}
            className={`px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b] ${
              simulateFailure
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-glow-rose'
                : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            {simulateFailure ? 'Failure Mode: ON (Firewall Block)' : 'Failure Mode: OFF'}
          </button>
        </div>

        {/* Protocol Selector & Dispatch */}
        <div className="flex items-center gap-2 sm:gap-3">
          <select
            aria-label="Select packet protocol"
            value={selectedProtocol}
            onChange={(e) => setSelectedProtocol(e.target.value as PacketProtocol)}
            className="bg-[#121217] text-white border border-[#272732] rounded-xl px-3 py-1.5 text-xs font-mono font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff]"
          >
            {['TCP', 'DNS', 'ARP', 'ICMP', 'HTTP'].map((p) => (
              <option key={p} value={p}>{p} Protocol</option>
            ))}
          </select>

          <Button variant="cyan" size="sm" onClick={dispatchPacket} leftIcon={<Activity className="w-4 h-4" />}>
            Dispatch Packet →
          </Button>
        </div>
      </div>

      {/* Main Interactive Canvas */}
      <div className="relative w-full h-[420px] sm:h-[460px] bg-[#09090b] rounded-3xl border border-[#272732] overflow-x-auto overflow-y-hidden p-4 sm:p-8 touch-pan-x bg-net-grid-pattern">
        <div
          className="min-w-[960px] h-full relative transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
        >
          {/* Cables Link Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {links.map((link) => {
              const srcNode = nodes.find((n) => n.id === link.sourceNodeId);
              const tgtNode = nodes.find((n) => n.id === link.targetNodeId);
              if (!srcNode || !tgtNode) return null;

              return (
                <line
                  key={link.id}
                  x1={srcNode.position.x + 32}
                  y1={srcNode.position.y + 32}
                  x2={tgtNode.position.x + 32}
                  y2={tgtNode.position.y + 32}
                  stroke="#272732"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                />
              );
            })}
          </svg>

          {/* Render Nodes */}
          {nodes.map((node) => (
            <motion.div
              key={node.id}
              style={{ left: node.position.x, top: node.position.y }}
              className="absolute z-10 flex flex-col items-center gap-2 cursor-pointer group"
              onClick={() => setSelectedConfigNode(node)}
            >
              <div className="w-16 h-16 rounded-2xl glass-panel border border-[#272732] group-hover:border-[#00f0ff]/50 flex items-center justify-center transition-all shadow-lg relative">
                {getNodeIcon(node.type)}

                <span
                  className={`absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full ${
                    node.status === 'online' ? 'bg-emerald-400 shadow-glow-emerald' : 'bg-rose-500'
                  }`}
                />
              </div>

              <div className="text-center">
                <span className="text-xs font-bold text-white block group-hover:text-[#00f0ff] transition-colors">
                  {node.name}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">{node.ipAddress}</span>
              </div>
            </motion.div>
          ))}

          {/* Render Moving Packets */}
          {activePackets.map((packet) => {
            const progress = packet.progressPercent / 100;
            const startX = 80;
            const endX = 880;
            const currentX = startX + (endX - startX) * progress;
            const isDropped = packet.status === 'dropped';

            return (
              <motion.div
                key={packet.id}
                style={{ left: currentX, top: 155 }}
                className="absolute z-30 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                onClick={() => {
                  setIsPlaying(false);
                  setInspectedPacket(packet);
                }}
              >
                <div
                  className={`px-3 py-1.5 rounded-xl font-mono text-[10px] font-bold shadow-lg flex items-center gap-1.5 ${
                    isDropped
                      ? 'bg-rose-500 text-white shadow-glow-rose animate-bounce'
                      : 'bg-[#00f0ff] text-black shadow-glow-cyan animate-pulse'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>{packet.protocol} Packet</span>
                  {isDropped && <span className="bg-black/40 px-1 rounded">DROPPED</span>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Live Educational Event Log Timeline */}
      <SimulationEventLog events={events} onClearEvents={() => setEvents([])} />

      {/* Modals */}
      <PacketInspectorModal
        packet={inspectedPacket}
        isOpen={!!inspectedPacket}
        onClose={() => setInspectedPacket(null)}
      />

      <DeviceConfigModal
        node={selectedConfigNode}
        isOpen={!!selectedConfigNode}
        onClose={() => setSelectedConfigNode(null)}
        onSave={(updated) => {
          setNodes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
        }}
      />
    </div>
  );
};

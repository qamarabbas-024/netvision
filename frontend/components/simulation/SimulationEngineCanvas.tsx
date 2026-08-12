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
  Settings,
  Activity,
  Cpu,
  Radio,
  Server,
  Shield,
  Monitor,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { NetworkNode, NetworkLink, NetworkPacket, PacketProtocol, SimulationEvent } from '@/types';
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

  // Controls State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [selectedProtocol, setSelectedProtocol] = useState<PacketProtocol>('TCP');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Active Packets & Events Timeline
  const [activePackets, setActivePackets] = useState<NetworkPacket[]>([]);
  const [events, setEvents] = useState<SimulationEvent[]>([]);
  const [inspectedPacket, setInspectedPacket] = useState<NetworkPacket | null>(null);
  const [selectedConfigNode, setSelectedConfigNode] = useState<NetworkNode | null>(null);

  const addEvent = (
    title: string,
    explanation: string,
    type: SimulationEvent['type'] = 'info',
    nodeName?: string,
    protocol?: PacketProtocol
  ) => {
    const newEvent: SimulationEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toLocaleTimeString(),
      eventTitle: title,
      explanation,
      type,
      nodeName,
      packetProtocol: protocol || selectedProtocol,
    };
    setEvents((prev) => [newEvent, ...prev]);
  };

  // Dispatch Packet Engine
  const dispatchPacket = () => {
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
    setIsPlaying(true);

    addEvent(
      `Packet Dispatched from ${srcNode.name}`,
      `Initiated ${selectedProtocol} transmission toward target IP ${dstNode.ipAddress}. Constructing PDU headers.`,
      'info',
      srcNode.name,
      selectedProtocol
    );
  };

  // Animation & Hop State Machine Loop
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
                  'info',
                  nodes[1].name,
                  p.protocol
                );
                p.hopHistory = Array.from(new Set([...(p.hopHistory || []), nodes[1].name]));
              } else if (p.progressPercent < 50 && nextProgress >= 50) {
                addEvent(
                  `Ingress at ${nodes[2].name} (Gateway Router)`,
                  `L3 Gateway Router receives IP packet. Decrements TTL to ${p.ttl - 1} and looks up route for ${p.targetIp}.`,
                  'info',
                  nodes[2].name,
                  p.protocol
                );
                p.ttl = Math.max(0, p.ttl - 1);
                p.hopHistory = Array.from(new Set([...(p.hopHistory || []), nodes[2].name]));
              } else if (p.progressPercent < 75 && nextProgress >= 75) {
                addEvent(
                  `Stateful Firewall Inspection (${nodes[3].name})`,
                  `Firewall evaluates active connection state table. Rule matching: ALLOW destination port 80/443.`,
                  'success',
                  nodes[3].name,
                  p.protocol
                );
                p.hopHistory = Array.from(new Set([...(p.hopHistory || []), nodes[3].name]));
              }

              if (nextProgress >= 100) {
                addEvent(
                  `Packet Delivered to ${nodes[4].name}`,
                  `Server successfully received ${p.protocol} packet. Dispatching acknowledgement response.`,
                  'success',
                  nodes[4].name,
                  p.protocol
                );
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
  }, [isPlaying, speedMultiplier, nodes, onSimulationComplete]);

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
      {/* Simulation Controls Toolbar */}
      <div className="glass-panel p-3.5 sm:p-4 rounded-3xl border border-[#272732] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
        {/* Playback Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button
            variant="cyan"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            leftIcon={isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Button>

          <Button variant="ghost" size="sm" onClick={handleStepForward} leftIcon={<StepForward className="w-4 h-4" />}>
            Step
          </Button>

          <Button variant="ghost" size="sm" onClick={resetSimulation} leftIcon={<RotateCcw className="w-4 h-4" />}>
            Reset
          </Button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-zinc-400">Speed:</span>
          <div className="flex items-center gap-1">
            {[0.5, 1, 2, 4].map((s) => (
              <button
                key={s}
                onClick={() => setSpeedMultiplier(s)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
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

        {/* Protocol Selector & Dispatch */}
        <div className="flex items-center gap-2 sm:gap-3">
          <select
            value={selectedProtocol}
            onChange={(e) => setSelectedProtocol(e.target.value as PacketProtocol)}
            className="bg-[#121217] text-white border border-[#272732] rounded-xl px-3 py-1.5 text-xs font-mono font-semibold"
          >
            {['TCP', 'DNS', 'ARP', 'ICMP', 'HTTP'].map((p) => (
              <option key={p} value={p}>{p} Protocol</option>
            ))}
          </select>

          <Button variant="cyan" size="sm" onClick={dispatchPacket} leftIcon={<Activity className="w-4 h-4" />}>
            Dispatch Packet →
          </Button>
        </div>

        {/* Canvas Zoom */}
        <div className="flex items-center gap-1 text-zinc-400">
          <button onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))} className="p-1.5 rounded-lg hover:bg-white/5">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono">{Math.round(zoomLevel * 100)}%</span>
          <button onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))} className="p-1.5 rounded-lg hover:bg-white/5">
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas */}
      <div className="relative w-full h-[420px] sm:h-[460px] bg-[#09090b] rounded-3xl border border-[#272732] overflow-x-auto overflow-y-hidden p-4 sm:p-8 touch-pan-x bg-net-grid-pattern">
        <div
          className="min-w-[960px] h-full relative transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
        >
          {/* Cables SVG Link Layer */}
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

          {/* Render Devices / Nodes */}
          {nodes.map((node) => (
            <motion.div
              key={node.id}
              style={{ left: node.position.x, top: node.position.y }}
              className="absolute z-10 flex flex-col items-center gap-2 cursor-pointer group"
              onClick={() => setSelectedConfigNode(node)}
            >
              <div className="w-16 h-16 rounded-2xl glass-panel border border-[#272732] group-hover:border-[#00f0ff]/50 flex items-center justify-center transition-all shadow-lg relative">
                {getNodeIcon(node.type)}

                {/* Status LED Indicator */}
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
                <div className="px-3 py-1.5 rounded-xl bg-[#00f0ff] text-black font-mono text-[10px] font-bold shadow-glow-cyan flex items-center gap-1.5 animate-pulse">
                  <Activity className="w-3.5 h-3.5" />
                  <span>{packet.protocol} Packet</span>
                  <span className="text-[9px] bg-black/20 px-1 rounded">TTL: {packet.ttl}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Live Event Log Timeline */}
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

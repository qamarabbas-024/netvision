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
  Maximize2,
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
import { NetworkNode, NetworkLink, NetworkPacket, PacketProtocol } from '@/types';
import { PacketInspectorModal } from './PacketInspectorModal';
import { DeviceConfigModal } from './DeviceConfigModal';

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
      { id: 'n-1', name: 'Client PC 1', type: 'pc', ipAddress: '192.168.1.10', macAddress: '00:1A:2B:3C:4D:5E', status: 'online', position: { x: 100, y: 150 } },
      { id: 'n-2', name: 'L2 Switch', type: 'switch', ipAddress: '192.168.1.1', macAddress: '00:1A:2B:00:00:01', status: 'online', position: { x: 300, y: 150 } },
      { id: 'n-[#00f0ff]', name: 'Gateway Router', type: 'router', ipAddress: '10.0.0.1', macAddress: '00:1A:2B:77:88:99', status: 'online', position: { x: 500, y: 150 } },
      { id: 'n-4', name: 'Stateful Firewall', type: 'firewall', ipAddress: '10.0.0.2', macAddress: '00:1A:2B:11:22:33', status: 'online', position: { x: 700, y: 150 } },
      { id: 'n-5', name: 'Web Server', type: 'server', ipAddress: '172.16.0.5', macAddress: '00:1A:2B:AA:BB:CC', status: 'online', position: { x: 900, y: 150 } },
    ]
  );

  const [links] = useState<NetworkLink[]>(
    initialLinks || [
      { id: 'l-1', sourceNodeId: 'n-1', targetNodeId: 'n-2', bandwidthMbps: 1000, latencyMs: 1, status: 'connected' },
      { id: 'l-2', sourceNodeId: 'n-2', targetNodeId: 'n-[#00f0ff]', bandwidthMbps: 1000, latencyMs: 2, status: 'connected' },
      { id: 'l-3', sourceNodeId: 'n-[#00f0ff]', targetNodeId: 'n-4', bandwidthMbps: 1000, latencyMs: 5, status: 'connected' },
      { id: 'l-4', sourceNodeId: 'n-4', targetNodeId: 'n-5', bandwidthMbps: 1000, latencyMs: 10, status: 'connected' },
    ]
  );

  // Simulation Controls State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [selectedProtocol, setSelectedProtocol] = useState<PacketProtocol>('TCP');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Active Packets
  const [activePackets, setActivePackets] = useState<NetworkPacket[]>([]);
  const [inspectedPacket, setInspectedPacket] = useState<NetworkPacket | null>(null);
  const [selectedConfigNode, setSelectedConfigNode] = useState<NetworkNode | null>(null);

  // Simulation Animation Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setActivePackets((prevPackets) => {
          return prevPackets
            .map((p) => {
              const nextProgress = p.progressPercent + 2 * speedMultiplier;
              if (nextProgress >= 100) {
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
  }, [isPlaying, speedMultiplier, onSimulationComplete]);

  const dispatchPacket = () => {
    const newPacket: NetworkPacket = {
      id: `pkt-${Math.random().toString(36).substring(2, 7)}`,
      sourceIp: '192.168.1.10',
      targetIp: '172.16.0.5',
      sourceMac: '00:1A:2B:3C:4D:5E',
      targetMac: '00:1A:2B:AA:BB:CC',
      protocol: selectedProtocol,
      payload: `${selectedProtocol} SYN Payload Data [Seq=100 Ack=0]`,
      ttl: 64,
      status: 'in_flight',
      progressPercent: 0,
    };

    setActivePackets([newPacket]);
    setIsPlaying(true);
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setActivePackets((prev) =>
      prev.map((p) => ({ ...p, progressPercent: Math.min(100, p.progressPercent + 15) }))
    );
  };

  const resetSimulation = () => {
    setIsPlaying(false);
    setActivePackets([]);
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
    <div className="w-full flex flex-col gap-4">
      {/* Top Simulation Toolbar */}
      <div className="glass-panel p-3.5 sm:p-4 rounded-2xl border border-[#272732] flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        {/* Playback Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button
            variant="cyan"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            leftIcon={isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            className="flex-1 sm:flex-initial justify-center"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Button>

          <Button variant="ghost" size="sm" onClick={handleStepForward} leftIcon={<StepForward className="w-4 h-4" />} className="flex-1 sm:flex-initial justify-center">
            Step
          </Button>

          <Button variant="ghost" size="sm" onClick={resetSimulation} leftIcon={<RotateCcw className="w-4 h-4" />} className="flex-1 sm:flex-initial justify-center">
            Reset
          </Button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center justify-between sm:justify-start gap-2 text-xs font-mono">
          <span className="text-zinc-400 shrink-0">Speed:</span>
          <div className="flex items-center gap-1">
            {[0.5, 1, 2, 5].map((s) => (
              <button
                key={s}
                onClick={() => setSpeedMultiplier(s)}
                className={`px-2 py-1 rounded-lg transition-colors ${
                  speedMultiplier === s ? 'bg-[#00f0ff] text-black font-bold' : 'bg-white/5 text-zinc-400 hover:text-white'
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
            className="bg-[#121217] text-white border border-[#272732] rounded-xl px-2.5 py-1.5 text-xs font-mono flex-1 sm:flex-initial"
          >
            {['TCP', 'DNS', 'ARP', 'ICMP', 'HTTP'].map((p) => (
              <option key={p} value={p}>{p} Protocol</option>
            ))}
          </select>

          <Button variant="cyan" size="sm" onClick={dispatchPacket} leftIcon={<Activity className="w-4 h-4" />} className="shrink-0">
            Dispatch
          </Button>
        </div>

        {/* Canvas Zoom */}
        <div className="flex items-center justify-end gap-1 text-zinc-400">
          <button onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))} className="p-1.5 rounded-lg hover:bg-white/5">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono">{Math.round(zoomLevel * 100)}%</span>
          <button onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.1))} className="p-1.5 rounded-lg hover:bg-white/5">
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Topology Canvas Container */}
      <div className="relative w-full h-[440px] sm:h-[480px] bg-[#09090b] rounded-3xl border border-[#272732] overflow-x-auto overflow-y-hidden p-4 sm:p-8 touch-pan-x">
        <div
          className="min-w-[960px] h-full relative transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
        >
          {/* Cables Line Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {links.map((link) => {
              const srcNode = nodes.find((n) => n.id === link.sourceNodeId);
              const tgtNode = nodes.find((n) => n.id === link.targetNodeId);
              if (!srcNode || !tgtNode) return null;

              return (
                <line
                  key={link.id}
                  x1={srcNode.position.x + 30}
                  y1={srcNode.position.y + 30}
                  x2={tgtNode.position.x + 30}
                  y2={tgtNode.position.y + 30}
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
              <div className="w-16 h-16 rounded-2xl glass-panel border border-[#272732] group-hover:border-[#00f0ff]/50 flex items-center justify-center transition-all shadow-lg">
                {getNodeIcon(node.type)}
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
            // Compute position along nodes
            const progress = packet.progressPercent / 100;
            const startX = 100;
            const endX = 900;
            const currentX = startX + (endX - startX) * progress;

            return (
              <motion.div
                key={packet.id}
                style={{ left: currentX, top: 165 }}
                className="absolute z-30 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                onClick={() => {
                  setIsPlaying(false);
                  setInspectedPacket(packet);
                }}
              >
                <div className="px-3 py-1 rounded-lg bg-[#00f0ff] text-black font-mono text-[10px] font-bold shadow-glow-cyan flex items-center gap-1 animate-pulse">
                  <Activity className="w-3 h-3" />
                  <span>{packet.protocol} Packet</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

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

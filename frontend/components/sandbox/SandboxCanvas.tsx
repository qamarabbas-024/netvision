'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  RotateCcw,
  Trash2,
  Save,
  FolderOpen,
  Link as LinkIcon,
  MousePointer,
  Settings,
  Activity,
  Plus,
  Monitor,
  Cpu,
  Radio,
  Shield,
  Server,
  Cloud,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { NetworkNode, NetworkLink, NetworkPacket, NodeType } from '@/types';
import { DeviceConfigModal } from '../simulation/DeviceConfigModal';
import { PacketInspectorModal } from '../simulation/PacketInspectorModal';
import { DevicePalette } from './DevicePalette';

export const SandboxCanvas: React.FC = () => {
  const [nodes, setNodes] = useState<NetworkNode[]>([
    { id: 'sb-1', name: 'Client PC 1', type: 'pc', ipAddress: '192.168.1.10', macAddress: '00:1A:2B:11:11:11', status: 'online', position: { x: 120, y: 180 } },
    { id: 'sb-2', name: 'Client PC 2', type: 'pc', ipAddress: '192.168.1.11', macAddress: '00:1A:2B:22:22:22', status: 'online', position: { x: 120, y: 320 } },
    { id: 'sb-3', name: 'Core Switch', type: 'switch', ipAddress: '192.168.1.1', macAddress: '00:1A:2B:33:33:33', status: 'online', position: { x: 380, y: 250 } },
    { id: 'sb-4', name: 'Gateway Router', type: 'router', ipAddress: '10.0.0.1', macAddress: '00:1A:2B:44:44:44', status: 'online', position: { x: 620, y: 250 } },
    { id: 'sb-5', name: 'Web Server', type: 'server', ipAddress: '172.16.0.5', macAddress: '00:1A:2B:55:55:55', status: 'online', position: { x: 860, y: 250 } },
  ]);

  const [links, setLinks] = useState<NetworkLink[]>([
    { id: 'sbl-1', sourceNodeId: 'sb-1', targetNodeId: 'sb-3', bandwidthMbps: 1000, latencyMs: 1, status: 'connected' },
    { id: 'sbl-2', sourceNodeId: 'sb-2', targetNodeId: 'sb-3', bandwidthMbps: 1000, latencyMs: 1, status: 'connected' },
    { id: 'sbl-3', sourceNodeId: 'sb-3', targetNodeId: 'sb-4', bandwidthMbps: 1000, latencyMs: 2, status: 'connected' },
    { id: 'sbl-4', sourceNodeId: 'sb-4', targetNodeId: 'sb-5', bandwidthMbps: 1000, latencyMs: 5, status: 'connected' },
  ]);

  // Mode Selection: 'select' | 'cable'
  const [toolMode, setToolMode] = useState<'select' | 'cable'>('select');
  const [cableSourceNodeId, setCableSourceNodeId] = useState<string | null>(null);

  // Selected Items for Actions
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [configNode, setConfigNode] = useState<NetworkNode | null>(null);

  // Packet Runner State
  const [sourceNodeId, setSourceNodeId] = useState<string>('sb-1');
  const [targetNodeId, setTargetNodeId] = useState<string>('sb-5');
  const [activePackets, setActivePackets] = useState<NetworkPacket[]>([]);
  const [inspectedPacket, setInspectedPacket] = useState<NetworkPacket | null>(null);

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
      status: 'online',
      position: { x: 250 + Math.random() * 200, y: 150 + Math.random() * 150 },
    };
    setNodes((prev) => [...prev, newNode]);
  };

  // Node Click Behavior
  const handleNodeClick = (node: NetworkNode) => {
    if (toolMode === 'cable') {
      if (!cableSourceNodeId) {
        setCableSourceNodeId(node.id);
      } else if (cableSourceNodeId !== node.id) {
        // Create Cable Link
        const newLinkId = `sbl-${Math.random().toString(36).substring(2, 7)}`;
        setLinks((prev) => [
          ...prev,
          {
            id: newLinkId,
            sourceNodeId: cableSourceNodeId,
            targetNodeId: node.id,
            bandwidthMbps: 1000,
            latencyMs: 1,
            status: 'connected',
          },
        ]);
        setCableSourceNodeId(null);
        setToolMode('select');
      }
    } else {
      setSelectedNodeId(node.id);
    }
  };

  // Delete Selected Node
  const handleDeleteSelected = () => {
    if (!selectedNodeId) return;
    setNodes((prev) => prev.filter((n) => n.id !== selectedNodeId));
    setLinks((prev) => prev.filter((l) => l.sourceNodeId !== selectedNodeId && l.targetNodeId !== selectedNodeId));
    setSelectedNodeId(null);
  };

  // Reset Canvas
  const handleResetCanvas = () => {
    setNodes([]);
    setLinks([]);
    setSelectedNodeId(null);
  };

  // Save Topology
  const handleSaveTopology = () => {
    const topologyData = JSON.stringify({ nodes, links });
    localStorage.setItem('netvision_sandbox_topology', topologyData);
    alert('Topology saved successfully to local state!');
  };

  // Load Preset
  const handleLoadPreset = () => {
    const presetNodes: NetworkNode[] = [
      { id: 'p-1', name: 'Office PC', type: 'pc', ipAddress: '192.168.1.10', macAddress: '00:1A:2B:11:11:11', status: 'online', position: { x: 150, y: 220 } },
      { id: 'p-2', name: 'Switch L2', type: 'switch', ipAddress: '192.168.1.1', macAddress: '00:1A:2B:22:22:22', status: 'online', position: { x: 400, y: 220 } },
      { id: 'p-3', name: 'Firewall', type: 'firewall', ipAddress: '192.168.1.254', macAddress: '00:1A:2B:33:33:33', status: 'online', position: { x: 650, y: 220 } },
      { id: 'p-4', name: 'Cloud Server', type: 'server', ipAddress: '8.8.8.8', macAddress: '00:1A:2B:44:44:44', status: 'online', position: { x: 880, y: 220 } },
    ];
    const presetLinks: NetworkLink[] = [
      { id: 'pl-1', sourceNodeId: 'p-1', targetNodeId: 'p-2', bandwidthMbps: 1000, latencyMs: 1, status: 'connected' },
      { id: 'pl-2', sourceNodeId: 'p-2', targetNodeId: 'p-3', bandwidthMbps: 1000, latencyMs: 2, status: 'connected' },
      { id: 'pl-3', sourceNodeId: 'p-3', targetNodeId: 'p-4', bandwidthMbps: 1000, latencyMs: 10, status: 'connected' },
    ];
    setNodes(presetNodes);
    setLinks(presetLinks);
  };

  // Run Packet Stream
  const handleDispatchPing = () => {
    const srcNode = nodes.find((n) => n.id === sourceNodeId);
    const tgtNode = nodes.find((n) => n.id === targetNodeId);

    if (!srcNode || !tgtNode) return;

    const pkt: NetworkPacket = {
      id: `pkt-${Math.random().toString(36).substring(2, 7)}`,
      sourceIp: srcNode.ipAddress,
      targetIp: tgtNode.ipAddress,
      sourceMac: srcNode.macAddress,
      targetMac: tgtNode.macAddress,
      protocol: 'ICMP',
      payload: `ICMP Echo Request [Ping Payload Data]`,
      ttl: 64,
      status: 'in_flight',
      progressPercent: 0,
    };

    setActivePackets([pkt]);

    const interval = setInterval(() => {
      setActivePackets((prev) =>
        prev.map((p) => {
          if (p.progressPercent >= 100) {
            clearInterval(interval);
            return { ...p, progressPercent: 100, status: 'delivered' };
          }
          return { ...p, progressPercent: p.progressPercent + 10 };
        })
      );
    }, 150);
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'pc': return <Monitor className="w-6 h-6 text-emerald-400" />;
      case 'switch': return <Cpu className="w-6 h-6 text-blue-400" />;
      case 'router': return <Radio className="w-6 h-6 text-[#00f0ff]" />;
      case 'firewall': return <Shield className="w-6 h-6 text-rose-400" />;
      case 'server': return <Server className="w-6 h-6 text-purple-400" />;
      default: return <Cloud className="w-6 h-6 text-amber-400" />;
    }
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6">
      {/* Device Palette Left Bar */}
      <DevicePalette onAddDevice={handleAddDevice} />

      {/* Main Sandbox Area */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* Toolbar Header */}
        <div className="glass-panel p-4 rounded-2xl border border-[#272732] flex flex-wrap items-center justify-between gap-4">
          {/* Mode Toggles */}
          <div className="flex items-center gap-2">
            <Button
              variant={toolMode === 'select' ? 'cyan' : 'ghost'}
              size="sm"
              onClick={() => { setToolMode('select'); setCableSourceNodeId(null); }}
              leftIcon={<MousePointer className="w-4 h-4" />}
            >
              Select / Move
            </Button>

            <Button
              variant={toolMode === 'cable' ? 'cyan' : 'ghost'}
              size="sm"
              onClick={() => setToolMode('cable')}
              leftIcon={<LinkIcon className="w-4 h-4" />}
            >
              {cableSourceNodeId ? 'Click Target Node' : 'Connect Cable'}
            </Button>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            <Button
              variant="danger"
              size="sm"
              disabled={!selectedNodeId}
              onClick={handleDeleteSelected}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Delete Node
            </Button>

            <Button variant="ghost" size="sm" onClick={handleResetCanvas} leftIcon={<RotateCcw className="w-4 h-4" />}>
              Clear Topology
            </Button>

            <Button variant="secondary" size="sm" onClick={handleSaveTopology} leftIcon={<Save className="w-4 h-4" />}>
              Save JSON
            </Button>

            <Button variant="secondary" size="sm" onClick={handleLoadPreset} leftIcon={<FolderOpen className="w-4 h-4" />}>
              Load Preset
            </Button>
          </div>

          {/* Packet Dispatcher Tools */}
          <div className="flex items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#272732] w-full lg:w-auto">
            <select
              value={sourceNodeId}
              onChange={(e) => setSourceNodeId(e.target.value)}
              className="bg-[#121217] text-white border border-[#272732] rounded-xl px-2 py-1 text-xs"
            >
              {nodes.map((n) => (
                <option key={n.id} value={n.id}>Src: {n.name}</option>
              ))}
            </select>

            <select
              value={targetNodeId}
              onChange={(e) => setTargetNodeId(e.target.value)}
              className="bg-[#121217] text-white border border-[#272732] rounded-xl px-2 py-1 text-xs"
            >
              {nodes.map((n) => (
                <option key={n.id} value={n.id}>Dst: {n.name}</option>
              ))}
            </select>

            <Button variant="cyan" size="sm" onClick={handleDispatchPing} leftIcon={<Activity className="w-4 h-4" />}>
              Dispatch Ping
            </Button>
          </div>
        </div>

        {/* Sandbox Drag-and-Drop Canvas */}
        <div className="relative h-[520px] bg-[#09090b] rounded-3xl border border-[#272732] overflow-hidden p-8">
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
                  stroke="#00f0ff"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  className="animate-pulse"
                />
              );
            })}
          </svg>

          {/* Render Interactive Devices */}
          {nodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const isCableSource = cableSourceNodeId === node.id;

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
                className={`absolute z-10 flex flex-col items-center gap-2 cursor-grab active:cursor-grabbing group`}
              >
                <div
                  className={`w-16 h-16 rounded-2xl glass-panel border flex items-center justify-center transition-all shadow-lg relative ${
                    isCableSource
                      ? 'border-[#00f0ff] shadow-glow-cyan bg-[#00f0ff]/20 animate-pulse'
                      : isSelected
                      ? 'border-[#00f0ff] shadow-glow-cyan bg-white/10'
                      : 'border-[#272732] hover:border-zinc-500'
                  }`}
                >
                  {getNodeIcon(node.type)}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfigNode(node);
                    }}
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Settings className="w-3 h-3" />
                  </button>
                </div>

                <div className="text-center">
                  <span className="text-xs font-bold text-white block group-hover:text-[#00f0ff] transition-colors">
                    {node.name}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">{node.ipAddress}</span>
                </div>
              </motion.div>
            );
          })}

          {/* Render Moving Packets */}
          {activePackets.map((pkt) => {
            const progress = pkt.progressPercent / 100;
            const currentX = 150 + (850 - 150) * progress;

            return (
              <motion.div
                key={pkt.id}
                style={{ left: currentX, top: 250 }}
                onClick={() => setInspectedPacket(pkt)}
                className="absolute z-30 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              >
                <div className="px-3 py-1 rounded-lg bg-[#00f0ff] text-black font-mono text-[10px] font-bold shadow-glow-cyan flex items-center gap-1 animate-pulse">
                  <Activity className="w-3 h-3" />
                  <span>{pkt.protocol} Ping Packet</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <DeviceConfigModal
        node={configNode}
        isOpen={!!configNode}
        onClose={() => setConfigNode(null)}
        onSave={(updated) => {
          setNodes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
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

'use client';

import React, { useState, useRef } from 'react';
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
  Terminal,
  Download,
  Upload,
  Wrench,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { NetworkNode, NetworkLink, NetworkPacket, NodeType } from '@/types';
import { DeviceConfigModal } from '../simulation/DeviceConfigModal';
import { PacketInspectorModal } from '../simulation/PacketInspectorModal';
import { DevicePalette } from './DevicePalette';
import { PortSelectionModal } from './PortSelectionModal';
import { DeviceCliModal } from './DeviceCliModal';
import {
  TroubleshootingScenariosModal,
  TroubleshootingScenario,
} from './TroubleshootingScenariosModal';

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
      position: { x: 120, y: 180 },
    },
    {
      id: 'sb-2',
      name: 'Client PC 2',
      type: 'pc',
      ipAddress: '192.168.1.11',
      macAddress: '00:1A:2B:22:22:22',
      subnetMask: '255.255.255.0',
      defaultGateway: '192.168.1.1',
      status: 'online',
      position: { x: 120, y: 320 },
    },
    {
      id: 'sb-3',
      name: 'Core Switch',
      type: 'switch',
      ipAddress: '192.168.1.1',
      macAddress: '00:1A:2B:33:33:33',
      status: 'online',
      position: { x: 420, y: 250 },
    },
    {
      id: 'sb-4',
      name: 'Gateway Router',
      type: 'router',
      ipAddress: '10.0.0.1',
      macAddress: '00:1A:2B:44:44:44',
      status: 'online',
      position: { x: 720, y: 250 },
    },
    {
      id: 'sb-5',
      name: 'Web Server',
      type: 'server',
      ipAddress: '172.16.0.5',
      macAddress: '00:1A:2B:55:55:55',
      status: 'online',
      position: { x: 980, y: 250 },
    },
  ]);

  const [links, setLinks] = useState<NetworkLink[]>([
    { id: 'sbl-1', sourceNodeId: 'sb-1', targetNodeId: 'sb-3', sourcePort: 'eth0', targetPort: 'eth0/1', bandwidthMbps: 1000, latencyMs: 1, status: 'connected' },
    { id: 'sbl-2', sourceNodeId: 'sb-2', targetNodeId: 'sb-3', sourcePort: 'eth0', targetPort: 'eth0/2', bandwidthMbps: 1000, latencyMs: 1, status: 'connected' },
    { id: 'sbl-3', sourceNodeId: 'sb-3', targetNodeId: 'sb-4', sourcePort: 'eth0/24', targetPort: 'ge0/0/0', bandwidthMbps: 1000, latencyMs: 2, status: 'connected' },
    { id: 'sbl-4', sourceNodeId: 'sb-4', targetNodeId: 'sb-5', sourcePort: 'ge0/0/1', targetPort: 'eth0', bandwidthMbps: 1000, latencyMs: 5, status: 'connected' },
  ]);

  // Mode Selection: 'select' | 'cable'
  const [toolMode, setToolMode] = useState<'select' | 'cable'>('select');
  const [cableSourceNode, setCableSourceNode] = useState<NetworkNode | null>(null);
  const [cableTargetNode, setCableTargetNode] = useState<NetworkNode | null>(null);
  const [showPortModal, setShowPortModal] = useState<boolean>(false);

  // Selected Node & Modal States
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [configNode, setConfigNode] = useState<NetworkNode | null>(null);
  const [cliNode, setCliNode] = useState<NetworkNode | null>(null);
  const [showScenariosModal, setShowScenariosModal] = useState<boolean>(false);
  const [activeScenario, setActiveScenario] = useState<TroubleshootingScenario | null>(null);

  // Packet Dispatcher State
  const [sourceNodeId, setSourceNodeId] = useState<string>('sb-1');
  const [targetNodeId, setTargetNodeId] = useState<string>('sb-5');
  const [activePackets, setActivePackets] = useState<NetworkPacket[]>([]);
  const [inspectedPacket, setInspectedPacket] = useState<NetworkPacket | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  };

  // Node Click Logic
  const handleNodeClick = (node: NetworkNode) => {
    if (toolMode === 'cable') {
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
    setToolMode('select');
  };

  // Delete Selected Node
  const handleDeleteSelected = () => {
    if (!selectedNodeId) return;
    setNodes((prev) => prev.filter((n) => n.id !== selectedNodeId));
    setLinks((prev) => prev.filter((l) => l.sourceNodeId !== selectedNodeId && l.targetNodeId !== selectedNodeId));
    setSelectedNodeId(null);
  };

  // Export Topology to JSON File
  const handleExportTopology = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ nodes, links }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `netvision-topology-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import Topology JSON
  const handleImportTopology = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.nodes && parsed.links) {
          setNodes(parsed.nodes);
          setLinks(parsed.links);
        }
      } catch (err) {
        alert('Invalid topology JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // Load Troubleshooting Scenario
  const handleLoadScenario = (scen: TroubleshootingScenario) => {
    setActiveScenario(scen);
    setNodes(scen.presetTopology.nodes);
    setLinks(scen.presetTopology.links);
  };

  // Dispatch Packet Stream
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
      payload: `ICMP Echo Request [Ping Payload]`,
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
      {/* Device Palette Sidebar */}
      <DevicePalette onAddDevice={handleAddDevice} />

      {/* Main Sandbox Canvas Area */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* Active Scenario Banner */}
        {activeScenario && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Wrench className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 block uppercase">
                  ACTIVE TROUBLESHOOTING SCENARIO: {activeScenario.title}
                </span>
                <p className="text-xs text-zinc-300">{activeScenario.goal}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setActiveScenario(null)}>
              Exit Scenario
            </Button>
          </div>
        )}

        {/* Toolbar Header */}
        <div className="glass-panel p-3.5 sm:p-4 rounded-2xl border border-[#272732] flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 sm:gap-4">
          {/* Mode Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={toolMode === 'select' ? 'cyan' : 'ghost'}
              size="sm"
              onClick={() => { setToolMode('select'); setCableSourceNode(null); }}
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
              {cableSourceNode ? `Click Target (${cableSourceNode.name})` : 'Connect Cable'}
            </Button>
          </div>

          {/* Action Tools */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="danger"
              size="sm"
              disabled={!selectedNodeId}
              onClick={handleDeleteSelected}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Delete
            </Button>

            <Button variant="secondary" size="sm" onClick={handleExportTopology} leftIcon={<Download className="w-4 h-4" />}>
              Export JSON
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              leftIcon={<Upload className="w-4 h-4" />}
            >
              Import JSON
            </Button>
            <input type="file" ref={fileInputRef} onChange={handleImportTopology} accept=".json" className="hidden" />

            <Button variant="cyan" size="sm" onClick={() => setShowScenariosModal(true)} leftIcon={<Wrench className="w-4 h-4" />}>
              Scenarios
            </Button>
          </div>

          {/* Packet Stream Dispatcher */}
          <div className="flex flex-wrap items-center gap-2 pt-2 xl:pt-0 border-t xl:border-t-0 border-[#272732] w-full xl:w-auto">
            <select
              value={sourceNodeId}
              onChange={(e) => setSourceNodeId(e.target.value)}
              className="bg-[#121217] text-white border border-[#272732] rounded-xl px-2.5 py-1.5 text-xs flex-1"
            >
              {nodes.map((n) => (
                <option key={n.id} value={n.id}>Src: {n.name}</option>
              ))}
            </select>

            <select
              value={targetNodeId}
              onChange={(e) => setTargetNodeId(e.target.value)}
              className="bg-[#121217] text-white border border-[#272732] rounded-xl px-2.5 py-1.5 text-xs flex-1"
            >
              {nodes.map((n) => (
                <option key={n.id} value={n.id}>Dst: {n.name}</option>
              ))}
            </select>

            <Button variant="cyan" size="sm" onClick={handleDispatchPing} leftIcon={<Activity className="w-4 h-4" />}>
              Ping
            </Button>
          </div>
        </div>

        {/* Sandbox Canvas Box */}
        <div className="relative w-full h-[520px] sm:h-[560px] bg-[#09090b] rounded-3xl border border-[#272732] overflow-x-auto overflow-y-hidden p-4 sm:p-8 touch-pan-x bg-net-grid-pattern">
          <div className="min-w-[1020px] h-full relative">
            {/* Cable SVG Lines Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {links.map((link) => {
                const srcNode = nodes.find((n) => n.id === link.sourceNodeId);
                const tgtNode = nodes.find((n) => n.id === link.targetNodeId);
                if (!srcNode || !tgtNode) return null;

                return (
                  <g key={link.id}>
                    <line
                      x1={srcNode.position.x + 32}
                      y1={srcNode.position.y + 32}
                      x2={tgtNode.position.x + 32}
                      y2={tgtNode.position.y + 32}
                      stroke="#00f0ff"
                      strokeWidth="2.5"
                      strokeDasharray="6 4"
                      className="animate-pulse"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Interactive Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const isCableSource = cableSourceNode?.id === node.id;

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
                  className="absolute z-10 flex flex-col items-center gap-2 cursor-grab active:cursor-grabbing group"
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

                    {/* Quick CLI Modal Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCliNode(node);
                      }}
                      className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 text-[#00f0ff] hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Open Terminal CLI"
                    >
                      <Terminal className="w-3.5 h-3.5" />
                    </button>

                    {/* Settings Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfigNode(node);
                      }}
                      className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Configure Device"
                    >
                      <Settings className="w-3.5 h-3.5" />
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

            {/* Packets */}
            {activePackets.map((pkt) => {
              const progress = pkt.progressPercent / 100;
              const currentX = 150 + (900 - 150) * progress;

              return (
                <motion.div
                  key={pkt.id}
                  style={{ left: currentX, top: 250 }}
                  onClick={() => setInspectedPacket(pkt)}
                  className="absolute z-30 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                >
                  <div className="px-3 py-1.5 rounded-xl bg-[#00f0ff] text-black font-mono text-[10px] font-bold shadow-glow-cyan flex items-center gap-1 animate-pulse">
                    <Activity className="w-3.5 h-3.5" />
                    <span>{pkt.protocol} Ping</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
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
        onLoadScenario={handleLoadScenario}
      />

      <PacketInspectorModal
        packet={inspectedPacket}
        isOpen={!!inspectedPacket}
        onClose={() => setInspectedPacket(null)}
      />
    </div>
  );
};

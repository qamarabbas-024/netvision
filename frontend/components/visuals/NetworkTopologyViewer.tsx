'use client';

import React, { useState } from 'react';
import type { 
  VisualTopologyNode, 
  VisualTopologyLink, 
  CausalVisualExplanation,
  VisualNodeType 
} from '@netvision/shared';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Network, 
  Server, 
  Shield, 
  Laptop, 
  Layers, 
  Info, 
  Crown, 
  Activity
} from 'lucide-react';

export interface NetworkTopologyViewerProps {
  nodes: VisualTopologyNode[];
  links: VisualTopologyLink[];
  causalConsequence?: CausalVisualExplanation;
  lastActionSummary?: string;
  stateVersion?: number;
  selectedNodeId?: string;
  onSelectNode?: (nodeId: string | null) => void;
  className?: string;
}

export const NetworkTopologyViewer: React.FC<NetworkTopologyViewerProps> = ({
  nodes,
  links,
  causalConsequence,
  lastActionSummary,
  stateVersion = 1,
  selectedNodeId,
  onSelectNode,
  className = '',
}) => {
  const [internalSelectedNode, setInternalSelectedNode] = useState<string | null>(null);
  const activeNodeId = selectedNodeId !== undefined ? selectedNodeId : internalSelectedNode;

  const handleSelect = (nodeId: string) => {
    const next = activeNodeId === nodeId ? null : nodeId;
    if (onSelectNode) {
      onSelectNode(next);
    } else {
      setInternalSelectedNode(next);
    }
  };

  const selectedNode = nodes.find((n: VisualTopologyNode) => n.id === activeNodeId);

  const getNodeIcon = (type: VisualNodeType) => {
    switch (type) {
      case 'router':
        return <Activity className="w-5 h-5 text-emerald-400" aria-hidden="true" />;
      case 'switch':
        return <Layers className="w-5 h-5 text-cyan-400" aria-hidden="true" />;
      case 'firewall':
        return <Shield className="w-5 h-5 text-rose-400" aria-hidden="true" />;
      case 'server':
        return <Server className="w-5 h-5 text-purple-400" aria-hidden="true" />;
      case 'host':
      default:
        return <Laptop className="w-5 h-5 text-blue-400" aria-hidden="true" />;
    }
  };

  return (
    <Card className={`glass-panel border-[#00f0ff]/30 p-4 sm:p-5 flex flex-col gap-4 ${className}`}>
      {/* 1. Header Bar with Version & Authoritative Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#272732] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[#00f0ff]">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
              Authoritative Topology Canvas
              <Badge variant="cyan" className="text-[10px] py-0 px-1.5 font-mono">
                v{stateVersion}
              </Badge>
            </h3>
            <p className="text-[11px] text-zinc-400">
              {lastActionSummary || 'Synchronized directly with backend simulation engine state'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            LIVE SIMULATOR
          </span>
        </div>
      </div>

      {/* 2. Causal Consequence Banner */}
      {causalConsequence && (
        <div 
          role="region" 
          aria-label="Authoritative state change explanation"
          className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3 flex flex-col gap-1.5 text-xs text-zinc-300 animate-in fade-in duration-300"
        >
          <div className="flex items-center justify-between gap-2 font-mono">
            <span className="flex items-center gap-1.5 text-[#00f0ff] font-semibold">
              <Activity className="w-3.5 h-3.5" />
              Subsystem Impact: [{causalConsequence.concept}]
            </span>
            <span className="text-[10px] text-zinc-400">Action: {causalConsequence.cause}</span>
          </div>
          <p className="text-zinc-200 leading-relaxed font-sans">
            {causalConsequence.networkConsequence} — {causalConsequence.packetBehavior}
          </p>
          <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded border border-zinc-800">
            <span className="text-emerald-400">State Mutation:</span>
            <span className="truncate">{causalConsequence.stateMutation}</span>
          </div>
        </div>
      )}

      {/* 3. Interactive SVG Canvas */}
      <div 
        className="relative w-full h-[320px] sm:h-[360px] bg-[#07090e] rounded-2xl border border-[#1e2230] overflow-hidden select-none"
        role="region"
        aria-label="Interactive Network Topology diagram"
      >
        <svg 
          className="w-full h-full"
          viewBox="0 0 800 400" 
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Network topology diagram displaying nodes and links"
        >
          <defs>
            <pattern id="topoGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#181c2b" strokeWidth="0.8" />
            </pattern>
            <linearGradient id="linkGradientUp" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="linkGradientBlocked" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.7" />
            </linearGradient>
          </defs>

          {/* Grid */}
          <rect width="800" height="400" fill="url(#topoGrid)" />

          {/* Links */}
          {links.map((link: VisualTopologyLink) => {
            const sourceNode = nodes.find((n: VisualTopologyNode) => n.id === link.sourceNodeId);
            const targetNode = nodes.find((n: VisualTopologyNode) => n.id === link.targetNodeId);
            if (!sourceNode || !targetNode) return null;

            const isDown = link.status === 'down';
            const isBlocked = link.status === 'blocked' || link.stpBlocked;
            const isTrunk = link.type === 'trunk';
            const strokeColor = isDown ? '#ef4444' : isBlocked ? 'url(#linkGradientBlocked)' : 'url(#linkGradientUp)';
            const strokeDash = isDown ? '6 6' : isBlocked ? '4 4' : 'none';

            const midX = (sourceNode.position.x + targetNode.position.x) / 2;
            const midY = (sourceNode.position.y + targetNode.position.y) / 2;

            return (
              <g key={link.id} className="transition-all duration-300">
                <line
                  x1={sourceNode.position.x}
                  y1={sourceNode.position.y}
                  x2={targetNode.position.x}
                  y2={targetNode.position.y}
                  stroke={strokeColor}
                  strokeWidth={isBlocked ? 2.5 : 2}
                  strokeDasharray={strokeDash}
                  strokeLinecap="round"
                />

                <g transform={`translate(${midX}, ${midY})`}>
                  {isTrunk ? (
                    <g>
                      <rect
                        x="-45"
                        y="-10"
                        width="90"
                        height="20"
                        rx="4"
                        fill="#0c101c"
                        stroke="#00f0ff"
                        strokeWidth="1"
                        opacity="0.9"
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fill="#00f0ff"
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        TRUNK {link.allowedVlans ? `[${link.allowedVlans.join(',')}]` : ''}
                      </text>
                    </g>
                  ) : isBlocked ? (
                    <g>
                      <rect
                        x="-36"
                        y="-10"
                        width="72"
                        height="20"
                        rx="4"
                        fill="#1f1406"
                        stroke="#f59e0b"
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fill="#f59e0b"
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        STP BLOCKED
                      </text>
                    </g>
                  ) : (
                    <circle r="3" fill="#10b981" />
                  )}
                </g>
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node: VisualTopologyNode) => {
            const isSelected = node.id === activeNodeId;
            const isRoot = node.isRootBridge;

            return (
              <g
                key={node.id}
                transform={`translate(${node.position.x}, ${node.position.y})`}
                className="cursor-pointer focus:outline-none"
                onClick={() => handleSelect(node.id)}
                tabIndex={0}
                role="button"
                aria-label={`Network node ${node.name}, type ${node.type}, IP ${node.ipAddress || 'none'}${isRoot ? ', Spanning Tree Root Bridge' : ''}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect(node.id);
                  }
                }}
              >
                {isSelected && (
                  <circle
                    r="34"
                    fill="none"
                    stroke="#00f0ff"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    className="animate-spin-slow"
                  />
                )}

                <circle
                  r="26"
                  fill="#0c101d"
                  stroke={isSelected ? '#00f0ff' : isRoot ? '#f59e0b' : '#272d42'}
                  strokeWidth={isSelected ? '2.5' : isRoot ? '2' : '1.5'}
                  className="transition-colors hover:stroke-[#00f0ff]"
                />

                <foreignObject x="-12" y="-12" width="24" height="24">
                  <div className="w-full h-full flex items-center justify-center">
                    {getNodeIcon(node.type)}
                  </div>
                </foreignObject>

                {isRoot && (
                  <g transform="translate(0, -32)">
                    <rect x="-24" y="-8" width="48" height="16" rx="4" fill="#291a05" stroke="#f59e0b" strokeWidth="1" />
                    <text x="0" y="3.5" textAnchor="middle" fill="#f59e0b" fontSize="8" fontFamily="monospace" fontWeight="bold">
                      👑 ROOT
                    </text>
                  </g>
                )}

                <text
                  x="0"
                  y="40"
                  textAnchor="middle"
                  fill="#f1f5f9"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  {node.name}
                </text>

                {node.ipAddress && (
                  <text
                    x="0"
                    y="53"
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {node.ipAddress}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {!selectedNode && (
          <div className="absolute bottom-3 left-3 pointer-events-none text-[10px] font-mono text-zinc-500 bg-black/60 px-2.5 py-1 rounded-md border border-zinc-800 flex items-center gap-1.5">
            <Info className="w-3 h-3 text-cyan-400" />
            <span>Click or focus any node to inspect interfaces, VLANs, and active routing tables</span>
          </div>
        )}
      </div>

      {/* 4. Authoritative Node Detail Inspector */}
      {selectedNode && (
        <div 
          className="rounded-xl border border-[#272d42] bg-[#0c101d] p-4 flex flex-col gap-3 animate-in fade-in duration-200"
          role="region"
          aria-label={`Detailed interface and routing inspection for ${selectedNode.name}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-white flex items-center gap-1.5">
                {selectedNode.name}
                <span className="text-xs text-zinc-400 font-normal">({selectedNode.type})</span>
              </span>
              {selectedNode.isRootBridge && (
                <Badge variant="amber" className="text-[10px] py-0 px-1.5 font-mono flex items-center gap-1">
                  <Crown className="w-3 h-3" /> STP Root Bridge
                </Badge>
              )}
            </div>
            <button
              onClick={() => handleSelect(selectedNode.id)}
              className="text-xs text-zinc-400 hover:text-white font-mono"
            >
              [Close Inspector]
            </button>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono text-zinc-400 font-semibold uppercase tracking-wider">
              Authoritative Interfaces & Port States
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
              {selectedNode.ports.map((port) => (
                <div 
                  key={port.name} 
                  className="rounded-lg border border-zinc-800/80 bg-black/40 p-2.5 flex flex-col gap-1 font-mono text-[11px]"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-cyan-300">{port.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      port.status === 'up' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>
                      {port.status.toUpperCase()}
                    </span>
                  </div>

                  {port.ipAddress && (
                    <div className="text-zinc-300 flex items-center justify-between text-[10px]">
                      <span className="text-zinc-500">IP:</span>
                      <span>{port.ipAddress}</span>
                    </div>
                  )}

                  {port.vlan !== undefined && (
                    <div className="text-zinc-300 flex items-center justify-between text-[10px]">
                      <span className="text-zinc-500">VLAN:</span>
                      <span className="text-amber-400 font-semibold">VLAN {port.vlan}</span>
                    </div>
                  )}

                  {port.mode && (
                    <div className="text-zinc-300 flex items-center justify-between text-[10px]">
                      <span className="text-zinc-500">Mode:</span>
                      <span className="text-purple-300 uppercase">{port.mode}</span>
                    </div>
                  )}

                  {port.stpState && (
                    <div className="text-zinc-300 flex items-center justify-between text-[10px]">
                      <span className="text-zinc-500">STP:</span>
                      <span className={port.stpState === 'BLK' ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                        {port.stpState} ({port.stpRole || 'PORT'})
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Accessibility Screen Reader Textual Narrative */}
      <div 
        className="rounded-lg bg-zinc-950/80 border border-zinc-900 p-3 text-xs text-zinc-400 space-y-1.5"
        aria-live="polite"
      >
        <div className="flex items-center gap-1.5 font-mono text-zinc-300 text-[11px] font-semibold">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Topology Textual Summary (Accessibility & Assistive Technology):</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed">
          {nodes.map((n: VisualTopologyNode) => (
            <li key={n.id}>
              <strong className="text-zinc-200">{n.name}</strong> ({n.type})
              {n.ipAddress ? ` with IP ${n.ipAddress}` : ''}:{' '}
              {n.ports.map((p) => `${p.name} [Status: ${p.status}${p.vlan ? `, VLAN ${p.vlan}` : ''}${p.mode === 'trunk' ? ', Trunk' : ''}${p.stpState ? `, STP: ${p.stpState}` : ''}]`).join('; ')}
              {n.isRootBridge ? ' (Root Bridge)' : ''}.
            </li>
          ))}
          {links.map((l: VisualTopologyLink) => (
            <li key={l.id}>
              Link <span className="font-mono text-zinc-300">{l.id}</span>: {l.status}
              {l.type === 'trunk' ? ` (Trunk allowed VLANs: ${l.allowedVlans?.join(',') || 'all'})` : ''}
              {l.status === 'blocked' || l.stpBlocked ? ' (Blocked by Spanning Tree to prevent loops)' : ''}.
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

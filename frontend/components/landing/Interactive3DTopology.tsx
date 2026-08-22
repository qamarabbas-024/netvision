'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCw, Send, Layers, Radio, Shield, Server, Monitor, Activity, Sparkles, Network } from 'lucide-react';

interface Node3D {
  id: string;
  name: string;
  role: 'router' | 'switch' | 'server' | 'host' | 'gateway';
  ip: string;
  mac: string;
  x: number;
  y: number;
  z: number;
  status: 'online' | 'busy' | 'active';
  color: string;
  icon: string;
}

interface Link3D {
  from: string;
  to: string;
  bandwidth: string;
  status: 'active' | 'standby';
}

interface Packet3D {
  id: string;
  fromId: string;
  toId: string;
  progress: number;
  protocol: 'TCP SYN' | 'ICMP ECHO' | 'DNS QUERY' | 'HTTP/3';
  color: string;
  ttl: number;
  payload: string;
}

export const Interactive3DTopology: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [selectedNode, setSelectedNode] = useState<Node3D | null>(null);
  const [packetType, setPacketType] = useState<'TCP SYN' | 'ICMP ECHO' | 'DNS QUERY' | 'HTTP/3'>('TCP SYN');
  const [rotationAngle, setRotationAngle] = useState<{ x: number; y: number }>({ x: 22, y: -25 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeTelemetry, setActiveTelemetry] = useState<string>('System nominal. 6 nodes active.');

  // Network Topology Nodes in 3D Coordinates
  const nodes: Node3D[] = [
    { id: 'gw', name: 'Edge-Gateway', role: 'gateway', ip: '198.51.100.1', mac: '00:1A:2B:00:00:01', x: 0, y: -110, z: 40, status: 'online', color: '#00f0ff', icon: 'shield' },
    { id: 'sw1', name: 'Core-Switch-A', role: 'switch', ip: '10.0.0.2', mac: '00:1A:2B:00:01:A1', x: -140, y: -20, z: 0, status: 'active', color: '#38bdf8', icon: 'network' },
    { id: 'sw2', name: 'Core-Switch-B', role: 'switch', ip: '10.0.0.3', mac: '00:1A:2B:00:01:B2', x: 140, y: -20, z: 0, status: 'active', color: '#818cf8', icon: 'network' },
    { id: 'srv', name: 'Auth-DNS-Server', role: 'server', ip: '10.0.0.50', mac: '00:1A:2B:00:00:50', x: 0, y: 90, z: -60, status: 'online', color: '#a855f7', icon: 'server' },
    { id: 'pc1', name: 'Client-Alpha', role: 'host', ip: '10.0.0.101', mac: '00:1A:2B:00:01:01', x: -200, y: 80, z: 50, status: 'online', color: '#10b981', icon: 'monitor' },
    { id: 'pc2', name: 'Client-Beta', role: 'host', ip: '10.0.0.102', mac: '00:1A:2B:00:01:02', x: 200, y: 80, z: 50, status: 'online', color: '#f59e0b', icon: 'monitor' },
  ];

  const links: Link3D[] = [
    { from: 'gw', to: 'sw1', bandwidth: '10 Gbps MMF', status: 'active' },
    { from: 'gw', to: 'sw2', bandwidth: '10 Gbps MMF', status: 'active' },
    { from: 'sw1', to: 'sw2', bandwidth: '40 Gbps Trunk', status: 'active' },
    { from: 'sw1', to: 'srv', bandwidth: '10 Gbps Copper', status: 'active' },
    { from: 'sw2', to: 'srv', bandwidth: '10 Gbps Copper', status: 'active' },
    { from: 'sw1', to: 'pc1', bandwidth: '1 Gbps Cat6', status: 'active' },
    { from: 'sw2', to: 'pc2', bandwidth: '1 Gbps Cat6', status: 'active' },
  ];

  // In-flight packets array in ref to avoid re-render stutter in requestAnimationFrame
  const packetsRef = useRef<Packet3D[]>([
    { id: 'p1', fromId: 'pc1', toId: 'sw1', progress: 0.2, protocol: 'TCP SYN', color: '#00f0ff', ttl: 64, payload: 'SYN [Seq=1000]' },
    { id: 'p2', fromId: 'sw1', toId: 'gw', progress: 0.6, protocol: 'DNS QUERY', color: '#38bdf8', ttl: 64, payload: 'A netvision.io' },
    { id: 'p3', fromId: 'srv', toId: 'sw2', progress: 0.4, protocol: 'HTTP/3', color: '#a855f7', ttl: 128, payload: 'QUIC Stream' },
  ]);

  const dispatchPacket = (sourceId: string, destId: string, customType?: string) => {
    const proto = (customType as any) || packetType;
    const protoColors = {
      'TCP SYN': '#00f0ff',
      'ICMP ECHO': '#10b981',
      'DNS QUERY': '#38bdf8',
      'HTTP/3': '#a855f7',
    };

    const newPacket: Packet3D = {
      id: 'pkt_' + Math.random().toString(36).substring(2, 7),
      fromId: sourceId,
      toId: destId,
      progress: 0,
      protocol: proto,
      color: protoColors[proto as keyof typeof protoColors] || '#00f0ff',
      ttl: 64,
      payload: `${proto} -> ${destId}`,
    };

    packetsRef.current.push(newPacket);
    setActiveTelemetry(`Dispatched ${proto} packet from ${sourceId} to ${destId}.`);
  };

  const triggerDemoWave = () => {
    dispatchPacket('pc1', 'sw1', 'TCP SYN');
    setTimeout(() => dispatchPacket('sw1', 'srv', 'DNS QUERY'), 300);
    setTimeout(() => dispatchPacket('srv', 'sw2', 'HTTP/3'), 600);
    setTimeout(() => dispatchPacket('sw2', 'pc2', 'ICMP ECHO'), 900);
  };

  // 3D Projection Calculation
  const project3D = (x: number, y: number, z: number, cx: number, cy: number) => {
    const radX = (rotationAngle.x * Math.PI) / 180;
    const radY = (rotationAngle.y * Math.PI) / 180;

    // Y-axis rotation
    const cosY = Math.cos(radY);
    const sinY = Math.sin(radY);
    const x1 = x * cosY + z * sinY;
    const z1 = -x * sinY + z * cosY;

    // X-axis rotation
    const cosX = Math.cos(radX);
    const sinX = Math.sin(radX);
    const y2 = y * cosX - z1 * sinX;
    const z2 = y * sinX + z1 * cosX;

    // Isometric perspective scaling
    const fov = 400;
    const scale = fov / (fov + z2);

    return {
      x: cx + x1 * scale,
      y: cy + y2 * scale,
      scale,
      depth: z2,
    };
  };

  // 60 FPS Render Loop
  useEffect(() => {
    let animFrame: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // Handle DPI retina scaling
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;

      // Update in-flight packets
      if (isPlaying) {
        packetsRef.current.forEach((pkt) => {
          pkt.progress += dt * 0.6 * speed;
        });
        // Remove finished packets or loop
        packetsRef.current = packetsRef.current.filter((pkt) => {
          if (pkt.progress >= 1) {
            return false;
          }
          return true;
        });

        // Keep ambient packet flow active if empty
        if (packetsRef.current.length < 2) {
          const randomLinks = [
            ['pc1', 'sw1'],
            ['sw1', 'srv'],
            ['sw2', 'pc2'],
            ['srv', 'gw'],
          ];
          const chosen = randomLinks[Math.floor(Math.random() * randomLinks.length)];
          dispatchPacket(chosen[0], chosen[1]);
        }
      }

      // Draw Grid Base (Isometric Reference Plane)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let i = -240; i <= 240; i += 60) {
        const p1 = project3D(i, 120, -240, cx, cy);
        const p2 = project3D(i, 120, 240, cx, cy);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        const p3 = project3D(-240, 120, i, cx, cy);
        const p4 = project3D(240, 120, i, cx, cy);
        ctx.beginPath();
        ctx.moveTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.stroke();
      }

      // Calculate projected positions for nodes
      const projectedNodes: Record<string, { x: number; y: number; scale: number; depth: number }> = {};
      nodes.forEach((node) => {
        projectedNodes[node.id] = project3D(node.x, node.y, node.z, cx, cy);
      });

      // Draw Network Link Lines
      links.forEach((link) => {
        const from = projectedNodes[link.from];
        const to = projectedNodes[link.to];
        if (!from || !to) return;

        // Base Cable Line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 2 * Math.min(from.scale, to.scale);
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();

        // Pulsing Data Glow Line
        const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        gradient.addColorStop(0, 'rgba(0, 240, 255, 0.4)');
        gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 240, 255, 0.4)');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });

      // Draw In-Flight 3D Packets
      packetsRef.current.forEach((pkt) => {
        const from = projectedNodes[pkt.fromId];
        const to = projectedNodes[pkt.toId];
        if (!from || !to) return;

        const curX = from.x + (to.x - from.x) * pkt.progress;
        const curY = from.y + (to.y - from.y) * pkt.progress;
        const curScale = from.scale + (to.scale - from.scale) * pkt.progress;

        // Glow Aura
        const glowRad = 8 * curScale;
        const aura = ctx.createRadialGradient(curX, curY, 1, curX, curY, glowRad);
        aura.addColorStop(0, pkt.color);
        aura.addColorStop(1, 'transparent');
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(curX, curY, glowRad, 0, Math.PI * 2);
        ctx.fill();

        // Packet Core Diamond
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(curX, curY, 3 * curScale, 0, Math.PI * 2);
        ctx.fill();

        // Protocol Tooltip Badge
        ctx.fillStyle = 'rgba(18, 18, 23, 0.9)';
        ctx.strokeStyle = pkt.color;
        ctx.lineWidth = 1;
        const tagText = pkt.protocol;
        ctx.font = '9px JetBrains Mono, monospace';
        const tagW = ctx.measureText(tagText).width + 8;
        ctx.fillRect(curX - tagW / 2, curY - 18 * curScale, tagW, 14);
        ctx.strokeRect(curX - tagW / 2, curY - 18 * curScale, tagW, 14);
        ctx.fillStyle = pkt.color;
        ctx.textAlign = 'center';
        ctx.fillText(tagText, curX, curY - 8 * curScale);
      });

      // Draw Nodes Sorted by Depth (Z-Sorting for proper 3D layering)
      const sortedNodes = [...nodes].sort(
        (a, b) => projectedNodes[a.id].depth - projectedNodes[b.id].depth
      );

      sortedNodes.forEach((node) => {
        const p = projectedNodes[node.id];
        const isSel = selectedNode?.id === node.id;
        const radius = (isSel ? 20 : 16) * p.scale;

        // Node Outer Ring / Glow
        ctx.shadowColor = node.color;
        ctx.shadowBlur = isSel ? 16 : 8;
        ctx.fillStyle = 'rgba(18, 18, 23, 0.95)';
        ctx.strokeStyle = node.color;
        ctx.lineWidth = isSel ? 3 : 2;

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Node Inner Dot
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4 * p.scale, 0, Math.PI * 2);
        ctx.fill();

        // Node Name Label
        ctx.fillStyle = '#f4f5f7';
        ctx.font = `${Math.round(10 * p.scale)}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(node.name, p.x, p.y + radius + 14 * p.scale);

        // IP Address Sub-label
        ctx.fillStyle = '#8e95a5';
        ctx.font = `${Math.round(8.5 * p.scale)}px JetBrains Mono, monospace`;
        ctx.fillText(node.ip, p.x, p.y + radius + 26 * p.scale);
      });

      animFrame = requestAnimationFrame(render);
    };

    animFrame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrame);
  }, [isPlaying, speed, rotationAngle, selectedNode]);

  // Mouse drag handling for orbital rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setRotationAngle((prev) => ({
      x: Math.max(-60, Math.min(60, prev.x + dy * 0.4)),
      y: (prev.y + dx * 0.4) % 360,
    }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Node Selection Click
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const clickedNode = nodes.find((node) => {
      const p = project3D(node.x, node.y, node.z, cx, cy);
      const dist = Math.hypot(clickX - p.x, clickY - p.y);
      return dist < 22 * p.scale;
    });

    if (clickedNode) {
      setSelectedNode(clickedNode);
      dispatchPacket(clickedNode.id, clickedNode.id === 'srv' ? 'gw' : 'srv');
      setActiveTelemetry(`Inspecting ${clickedNode.name} (${clickedNode.ip}) // State: ${clickedNode.status.toUpperCase()}`);
    } else {
      setSelectedNode(null);
    }
  };

  return (
    <div className="w-full rounded-2xl glass-panel border border-[var(--border-hairline)] overflow-hidden shadow-2xl flex flex-col bg-[var(--surface-2)]">
      {/* Top Instrument Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-[var(--surface-3)] border-b border-[var(--border-hairline)] gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-cyan)] animate-pulse" />
          <span className="text-xs font-mono font-bold text-[var(--foreground)] uppercase tracking-wider flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-[var(--accent-cyan)]" /> 3D Topology Logic Analyzer
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--surface-0)] text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/30">
            60 FPS // 3D PROJECTION
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          {/* Protocol Dispatch Selector */}
          <div className="flex items-center bg-[var(--surface-0)] rounded-lg p-0.5 border border-[var(--border-hairline)]">
            {(['TCP SYN', 'ICMP ECHO', 'DNS QUERY', 'HTTP/3'] as const).map((proto) => (
              <button
                key={proto}
                type="button"
                onClick={() => setPacketType(proto)}
                className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  packetType === proto
                    ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--foreground)]'
                }`}
              >
                {proto}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={triggerDemoWave}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/40 hover:bg-[var(--accent-cyan)]/20 transition-all font-bold text-xs cursor-pointer"
          >
            <Sparkles className="w-3 h-3" /> Wave Dispatch
          </button>
        </div>
      </div>

      {/* 3D Canvas Area */}
      <div
        className="relative h-[340px] sm:h-[400px] w-full bg-[var(--surface-0)] cursor-grab active:cursor-grabbing select-none overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full h-full block"
        />

        {/* Orbit Drag Hint */}
        <div className="absolute top-3 left-3 pointer-events-none flex items-center gap-1.5 px-2 py-1 rounded-md bg-[var(--surface-2)]/80 backdrop-blur-sm border border-[var(--border-hairline)] text-[10px] font-mono text-[var(--text-muted)]">
          <RotateCw className="w-3 h-3 text-[var(--accent-cyan)]" /> Drag to rotate 3D angle | Click node to inject packet
        </div>

        {/* Selected Node Floating Glass Drawer */}
        {selectedNode && (
          <div className="absolute top-3 right-3 w-56 p-3 rounded-xl bg-[var(--surface-2)]/90 backdrop-blur-md border border-[var(--border-subtle)] shadow-xl font-mono text-xs animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-[var(--border-hairline)] mb-2">
              <span className="font-bold text-[var(--foreground)] truncate">{selectedNode.name}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="flex flex-col gap-1 text-[11px] text-[var(--text-muted)]">
              <div>IP: <strong className="text-[var(--foreground)]">{selectedNode.ip}</strong></div>
              <div>MAC: <strong className="text-[var(--accent-cyan)]">{selectedNode.mac}</strong></div>
              <div>Role: <strong className="text-purple-400 capitalize">{selectedNode.role}</strong></div>
              <div>State: <strong className="text-emerald-400 capitalize">{selectedNode.status}</strong></div>
            </div>
            <button
              type="button"
              onClick={() => dispatchPacket(selectedNode.id, 'srv')}
              className="mt-2.5 w-full py-1 rounded bg-[var(--accent-primary)] text-white text-[10px] font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-1 cursor-pointer"
            >
              <Send className="w-3 h-3" /> Dispatch Test Packet
            </button>
          </div>
        )}

        {/* View Controls Overlay (Bottom Right) */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-[var(--surface-2)]/85 backdrop-blur-md p-1 rounded-lg border border-[var(--border-hairline)] font-mono text-xs">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded hover:bg-[var(--surface-3)] text-[var(--foreground)] cursor-pointer"
            title={isPlaying ? 'Pause simulation' : 'Play simulation'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
          <button
            type="button"
            onClick={() => setSpeed((s) => (s === 1 ? 2 : s === 2 ? 0.5 : 1))}
            className="px-1.5 py-0.5 rounded hover:bg-[var(--surface-3)] text-[10px] text-[var(--accent-cyan)] font-bold cursor-pointer"
          >
            {speed}x
          </button>
          <button
            type="button"
            onClick={() => setRotationAngle({ x: 22, y: -25 })}
            className="p-1.5 rounded hover:bg-[var(--surface-3)] text-[var(--text-muted)] hover:text-[var(--foreground)] cursor-pointer"
            title="Reset 3D camera"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Telemetry Ticker */}
      <div className="px-4 py-2.5 bg-[var(--surface-3)] border-t border-[var(--border-hairline)] flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
        <div className="flex items-center gap-2 truncate">
          <Activity className="w-3.5 h-3.5 text-[var(--accent-cyan)] shrink-0" />
          <span className="truncate text-[var(--foreground)]">{activeTelemetry}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-[10px] hidden sm:flex">
          <span>LATENCY: <strong className="text-[var(--accent-cyan)]">0.42 ms</strong></span>
          <span>LINKS: <strong className="text-emerald-400">7/7 UP</strong></span>
          <span>TOPOLOGY: <strong className="text-purple-400">DUAL-CORE MESH</strong></span>
        </div>
      </div>
    </div>
  );
};

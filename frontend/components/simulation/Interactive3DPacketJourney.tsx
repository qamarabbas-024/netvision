'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  Layers,
  Send,
  Shield,
  Server,
  Monitor,
  Network,
  Activity,
  AlertTriangle,
  Info,
  CheckCircle2,
  Sliders,
  Maximize2,
} from 'lucide-react';
import { SoundFx } from '@/lib/soundFx';

export interface Node3D {
  id: string;
  name: string;
  role: 'host' | 'switch' | 'router' | 'firewall' | 'server';
  ip: string;
  mac: string;
  x: number;
  y: number;
  z: number;
  status: 'online' | 'busy' | 'fault';
  color: string;
}

export interface Link3D {
  id: string;
  from: string;
  to: string;
  label: string;
  bandwidth: string;
  latencyMs: number;
  status: 'up' | 'degraded' | 'down';
}

export interface Packet3D {
  id: string;
  protocol: 'HTTPS' | 'DNS' | 'ICMP' | 'TCP SYN';
  sourceNodeId: string;
  destNodeId: string;
  currentNodeId: string;
  currentHopIndex: number;
  hops: string[];
  progress: number;
  ttl: number;
  color: string;
  payload: string;
  layerData: {
    l7: { protocol: string; data: string };
    l4: { protocol: string; srcPort: number; dstPort: number; flags?: string };
    l3: { srcIp: string; dstIp: string; ttl: number };
    l2: { srcMac: string; dstMac: string; ethType: string };
  };
}

export const Interactive3DPacketJourney: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [selectedProtocol, setSelectedProtocol] = useState<'HTTPS' | 'DNS' | 'ICMP' | 'TCP SYN'>('HTTPS');
  const [selectedNode, setSelectedNode] = useState<Node3D | null>(null);
  const [inspectedPacket, setInspectedPacket] = useState<Packet3D | null>(null);
  const [injectDrop, setInjectDrop] = useState<boolean>(false);
  const [telemetryMessage, setTelemetryMessage] = useState<string>('Simulator initialized. Ready to dispatch packets.');

  // Camera 3D Orbit Angles
  const [rotation, setRotation] = useState<{ x: number; y: number }>({ x: 25, y: -20 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // 3D Topology Node Definitions
  const nodes: Node3D[] = [
    { id: 'host-a', name: 'Client Host A', role: 'host', ip: '192.168.1.50', mac: '00:1A:2B:11:22:33', x: -220, y: 70, z: 40, status: 'online', color: '#00f0ff' },
    { id: 'sw-access', name: 'Access Switch', role: 'switch', ip: '192.168.1.2', mac: '00:1A:2B:AA:01:01', x: -110, y: 0, z: 0, status: 'online', color: '#38bdf8' },
    { id: 'gw-router', name: 'Default Gateway', role: 'router', ip: '192.168.1.1', mac: '00:1A:2B:GW:01:01', x: 20, y: -70, z: 20, status: 'online', color: '#818cf8' },
    { id: 'fw-edge', name: 'Stateful Firewall', role: 'firewall', ip: '10.0.0.1', mac: '00:1A:2B:FW:01:01', x: 130, y: 0, z: -20, status: 'online', color: '#f59e0b' },
    { id: 'srv-web', name: 'Web Server', role: 'server', ip: '93.184.216.34', mac: '00:1A:2B:SR:99:99', x: 230, y: 80, z: -50, status: 'online', color: '#10b981' },
  ];

  const links: Link3D[] = [
    { id: 'l1', from: 'host-a', to: 'sw-access', label: '1 Gbps Cat6', bandwidth: '1 Gbps', latencyMs: 1, status: 'up' },
    { id: 'l2', from: 'sw-access', to: 'gw-router', label: '10G Trunk (VLAN 10)', bandwidth: '10 Gbps', latencyMs: 2, status: 'up' },
    { id: 'l3', from: 'gw-router', to: 'fw-edge', label: 'WAN Link', bandwidth: '10 Gbps', latencyMs: 15, status: 'up' },
    { id: 'l4', from: 'fw-edge', to: 'srv-web', label: 'DMZ Link', bandwidth: '10 Gbps', latencyMs: 2, status: 'up' },
  ];

  // Active in-flight packets
  const packetsRef = useRef<Packet3D[]>([]);

  // Create and dispatch packet
  const dispatchNewPacket = (proto: 'HTTPS' | 'DNS' | 'ICMP' | 'TCP SYN' = selectedProtocol) => {
    const protoColors = {
      HTTPS: '#00f0ff',
      'TCP SYN': '#38bdf8',
      DNS: '#a855f7',
      ICMP: '#10b981',
    };

    const newPkt: Packet3D = {
      id: `pkt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      protocol: proto,
      sourceNodeId: 'host-a',
      destNodeId: 'srv-web',
      currentNodeId: 'host-a',
      currentHopIndex: 0,
      hops: ['host-a', 'sw-access', 'gw-router', 'fw-edge', 'srv-web'],
      progress: 0,
      ttl: 64,
      color: protoColors[proto],
      payload: `${proto} Request to 93.184.216.34`,
      layerData: {
        l7: { protocol: proto === 'HTTPS' ? 'HTTP/1.1 GET' : proto, data: 'GET /index.html HTTP/1.1\r\nHost: example.com' },
        l4: { protocol: proto === 'ICMP' ? 'ICMP' : 'TCP', srcPort: 52140, dstPort: proto === 'DNS' ? 53 : proto === 'HTTPS' ? 443 : 80, flags: proto === 'TCP SYN' ? 'SYN' : 'ACK' },
        l3: { srcIp: '192.168.1.50', dstIp: '93.184.216.34', ttl: 64 },
        l2: { srcMac: '00:1A:2B:11:22:33', dstMac: '00:1A:2B:GW:01:01', ethType: '0x0800 (IPv4)' },
      },
    };

    packetsRef.current.push(newPkt);
    setInspectedPacket(newPkt);
    setTelemetryMessage(`[HOST A] Generated ${proto} packet. Encapsulated in Layer 2 frame targeting Gateway MAC (00:1A:2B:GW:01:01).`);
    SoundFx.playPacketDispatch();
  };

  // 3D Projection transformation helper
  const project3D = (x: number, y: number, z: number, cx: number, cy: number) => {
    const radX = (rotation.x * Math.PI) / 180;
    const radY = (rotation.y * Math.PI) / 180;

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

    const fov = 450;
    const scale = fov / (fov + z2);

    return {
      x: cx + x1 * scale,
      y: cy + y2 * scale,
      scale,
      depth: z2,
    };
  };

  // 60 FPS Render loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const cx = rect.width / 2;
      const cy = rect.height / 2 + 10;

      // Clear Canvas with subtle dark theme backdrop
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Draw 3D Isometric Grid Plane
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 300;
      const gridStep = 40;

      for (let gx = -gridSize; gx <= gridSize; gx += gridStep) {
        const p1 = project3D(gx, 120, -gridSize, cx, cy);
        const p2 = project3D(gx, 120, gridSize, cx, cy);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      for (let gz = -gridSize; gz <= gridSize; gz += gridStep) {
        const p1 = project3D(-gridSize, 120, gz, cx, cy);
        const p2 = project3D(gridSize, 120, gz, cx, cy);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      // Draw 3D Network Links with animated data pulses
      links.forEach((link) => {
        const nFrom = nodes.find((n) => n.id === link.from);
        const nTo = nodes.find((n) => n.id === link.to);
        if (!nFrom || !nTo) return;

        const pFrom = project3D(nFrom.x, nFrom.y, nFrom.z, cx, cy);
        const pTo = project3D(nTo.x, nTo.y, nTo.z, cx, cy);

        // Link base shadow line
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
        ctx.lineWidth = 3 * pFrom.scale;
        ctx.beginPath();
        ctx.moveTo(pFrom.x, pFrom.y);
        ctx.lineTo(pTo.x, pTo.y);
        ctx.stroke();

        // Glowing link core
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pFrom.x, pFrom.y);
        ctx.lineTo(pTo.x, pTo.y);
        ctx.stroke();

        // Moving background pulse
        const pulseProgress = ((time / 1000) * 0.5) % 1;
        const pulseX = pFrom.x + (pTo.x - pFrom.x) * pulseProgress;
        const pulseY = pFrom.y + (pTo.y - pFrom.y) * pulseProgress;

        ctx.fillStyle = '#00f0ff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 2.5 * pFrom.scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Update and Draw In-Flight Packets
      if (isPlaying) {
        packetsRef.current.forEach((pkt, idx) => {
          pkt.progress += dt * 0.45 * simulationSpeed;

          const currentFromNode = nodes.find((n) => n.id === pkt.hops[pkt.currentHopIndex]);
          const currentToNode = nodes.find((n) => n.id === pkt.hops[pkt.currentHopIndex + 1]);

          if (currentFromNode && currentToNode) {
            const pFrom = project3D(currentFromNode.x, currentFromNode.y, currentFromNode.z, cx, cy);
            const pTo = project3D(currentToNode.x, currentToNode.y, currentToNode.z, cx, cy);

            const px = pFrom.x + (pTo.x - pFrom.x) * pkt.progress;
            const py = pFrom.y + (pTo.y - pFrom.y) * pkt.progress;

            // Draw glowing packet sphere
            ctx.fillStyle = pkt.color;
            ctx.shadowColor = pkt.color;
            ctx.shadowBlur = 14;
            ctx.beginPath();
            ctx.arc(px, py, 6 * pFrom.scale, 0, Math.PI * 2);
            ctx.fill();

            // Inner white core
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(px, py, 2.5 * pFrom.scale, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Packet label
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 9px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`${pkt.protocol} (TTL:${pkt.ttl})`, px, py - 12);
          }

          // Hop Transition logic
          if (pkt.progress >= 1) {
            pkt.progress = 0;
            pkt.currentHopIndex++;

            if (pkt.currentHopIndex < pkt.hops.length - 1) {
              SoundFx.playHopForward();
              const hopNode = nodes.find((n) => n.id === pkt.hops[pkt.currentHopIndex]);
              if (hopNode?.role === 'router') {
                pkt.ttl -= 1;
                pkt.layerData.l3.ttl -= 1;
                pkt.layerData.l2.srcMac = hopNode.mac;
                pkt.layerData.l2.dstMac = '00:1A:2B:FW:01:01';
                setTelemetryMessage(`[GATEWAY ROUTER] L3 Route match. Decremented TTL to ${pkt.ttl}. Re-encapsulated L2 frame with egress MAC.`);
              } else if (hopNode?.role === 'switch') {
                setTelemetryMessage(`[ACCESS SWITCH] MAC Address Table hit. Forwarded Ethernet frame out Gigabit port 2 without modifying IP header.`);
              } else if (hopNode?.role === 'firewall') {
                if (injectDrop) {
                  packetsRef.current.splice(idx, 1);
                  setTelemetryMessage(`[STATEFUL FIREWALL] Packet Dropped! Policy matched ACL Rule 10 (Deny Unsolicited Inbound Traffic).`);
                  SoundFx.playPacketDrop();
                  return;
                }
                setTelemetryMessage(`[STATEFUL FIREWALL] Stateful inspection PASSED. Permitted outbound flow on Port 443.`);
              }
            } else {
              // Delivered to Destination!
              setTelemetryMessage(`[WEB SERVER] 200 OK! Delivered packet to TCP port 443 socket. Processing complete.`);
              SoundFx.playSuccessChime();
              packetsRef.current.splice(idx, 1);
            }
          }
        });
      }

      // Draw 3D Nodes
      nodes.forEach((node) => {
        const p = project3D(node.x, node.y, node.z, cx, cy);

        // Ground drop shadow
        const shadow = project3D(node.x, 120, node.z, cx, cy);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(shadow.x, shadow.y, 16 * p.scale, 8 * p.scale, 0, 0, Math.PI * 2);
        ctx.fill();

        // Node pedestal stem
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(shadow.x, shadow.y);
        ctx.stroke();

        // Node Glowing Ring
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 2 * p.scale;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 18 * p.scale, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Node Body Circle
        ctx.fillStyle = '#121217';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 16 * p.scale, 0, Math.PI * 2);
        ctx.fill();

        // Node Role Label & IP Badge
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.name, p.x, p.y + 32 * p.scale);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '9px monospace';
        ctx.fillText(node.ip, p.x, p.y + 44 * p.scale);
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, rotation, simulationSpeed, injectDrop]);

  // Mouse drag orbit controls
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setRotation((prev) => ({
      x: Math.max(-60, Math.min(80, prev.x + dy * 0.4)),
      y: prev.y + dx * 0.4,
    }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="w-full rounded-2xl bg-[#09090b] border border-[#272732] overflow-hidden flex flex-col shadow-2xl">
      {/* Top Header Bar */}
      <div className="px-5 py-4 border-b border-[#272732] bg-[#121217] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
            <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-wider font-semibold">
              3D Simulation Engine
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white">Interactive 3D Packet Journey & Network Topology</h3>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-[#1c1c24] p-1 rounded-xl border border-[#272732]">
            {(['HTTPS', 'TCP SYN', 'DNS', 'ICMP'] as const).map((proto) => (
              <button
                key={proto}
                onClick={() => {
                  setSelectedProtocol(proto);
                  dispatchNewPacket(proto);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedProtocol === proto
                    ? 'bg-[#00f0ff] text-black shadow-glow-cyan'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {proto}
              </button>
            ))}
          </div>

          <button
            onClick={() => dispatchNewPacket()}
            className="px-3.5 py-1.5 rounded-xl bg-[#00f0ff] text-black font-bold text-xs hover:bg-[#00f0ff]/90 transition-all flex items-center gap-1.5 shadow-glow-cyan"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Packet</span>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-xl bg-[#1c1c24] border border-[#272732] text-zinc-300 hover:text-white transition-colors"
            title={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
          </button>

          <button
            onClick={() => {
              packetsRef.current = [];
              setRotation({ x: 25, y: -20 });
              setTelemetryMessage('Simulation reset.');
            }}
            className="p-2 rounded-xl bg-[#1c1c24] border border-[#272732] text-zinc-300 hover:text-white transition-colors"
            title="Reset Camera & Packets"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Canvas & Overlay */}
      <div
        className="relative w-full h-[380px] sm:h-[460px] cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Orbit Drag Hint Overlay */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-zinc-400 pointer-events-none flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-[#00f0ff]" />
          <span>Click & Drag to Orbit 3D Space</span>
        </div>

        {/* Fault Injection Toggle */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            onClick={() => setInjectDrop(!injectDrop)}
            className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${
              injectDrop
                ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                : 'bg-black/60 border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{injectDrop ? 'Firewall Drop (Active)' : 'Simulate Drop'}</span>
          </button>
        </div>

        {/* Live Telemetry Notification Bar */}
        <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-[#121217]/90 backdrop-blur-md border border-[#272732] flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-mono text-zinc-200 overflow-hidden">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] shrink-0" />
            <span className="truncate">{telemetryMessage}</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 shrink-0 hidden sm:inline">60 FPS WebGL</span>
        </div>
      </div>

      {/* Layer-by-Layer Packet Inspection Dissection Accordion */}
      {inspectedPacket && (
        <div className="p-4 sm:p-5 bg-[#0e0e12] border-t border-[#272732] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00f0ff]" />
              OSI Protocol Encapsulation at Active Hop
            </h4>
            <span className="text-xs font-mono text-[#00f0ff]">{inspectedPacket.protocol} over IPv4</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
            {/* Layer 7 */}
            <div className="p-3 rounded-xl bg-[#14141b] border border-[#272732]">
              <div className="text-[10px] font-mono text-purple-400 font-bold uppercase mb-1">Layer 7 (Application)</div>
              <div className="text-xs font-bold text-white">{inspectedPacket.layerData.l7.protocol}</div>
              <div className="text-[11px] font-mono text-zinc-400 truncate mt-1">{inspectedPacket.layerData.l7.data}</div>
            </div>

            {/* Layer 4 */}
            <div className="p-3 rounded-xl bg-[#14141b] border border-[#272732]">
              <div className="text-[10px] font-mono text-sky-400 font-bold uppercase mb-1">Layer 4 (Transport)</div>
              <div className="text-xs font-bold text-white">{inspectedPacket.layerData.l4.protocol}</div>
              <div className="text-[11px] font-mono text-zinc-400 mt-1">
                Port {inspectedPacket.layerData.l4.srcPort} ➔ {inspectedPacket.layerData.l4.dstPort}
              </div>
            </div>

            {/* Layer 3 */}
            <div className="p-3 rounded-xl bg-[#14141b] border border-[#272732]">
              <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase mb-1">Layer 3 (Network)</div>
              <div className="text-xs font-bold text-white">IPv4 (TTL: {inspectedPacket.layerData.l3.ttl})</div>
              <div className="text-[11px] font-mono text-zinc-400 mt-1 truncate">
                {inspectedPacket.layerData.l3.srcIp} ➔ {inspectedPacket.layerData.l3.dstIp}
              </div>
            </div>

            {/* Layer 2 */}
            <div className="p-3 rounded-xl bg-[#14141b] border border-[#272732]">
              <div className="text-[10px] font-mono text-amber-400 font-bold uppercase mb-1">Layer 2 (Data Link)</div>
              <div className="text-xs font-bold text-white">Ethernet II Frame</div>
              <div className="text-[10px] font-mono text-zinc-400 mt-1 truncate">
                Dst MAC: {inspectedPacket.layerData.l2.dstMac}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

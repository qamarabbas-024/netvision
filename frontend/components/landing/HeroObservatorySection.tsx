'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  User,
  Package,
  ShieldCheck,
  Pause,
  Play,
  RotateCw,
  Layers,
  SlidersHorizontal,
  Activity,
  AlertTriangle,
  CheckCircle2,
  X,
} from 'lucide-react';

export type NetworkScenario = 'normal' | 'degraded' | 'failure' | 'recovery';

export interface DeviceInfo {
  id: string;
  name: string;
  role: string;
  ip: string;
  mac: string;
  layer: string;
  description: string;
  details: string[];
}

const DEVICE_METADATA: Record<string, DeviceInfo> = {
  workstation: {
    id: 'workstation',
    name: 'WORKSTATION',
    role: 'Client Endpoint',
    ip: '192.168.1.10',
    mac: '00:50:56:C0:00:08',
    layer: 'L7 / Application & Host',
    description: 'Originates DNS query lookups, TCP 3-way handshakes, and HTTP/3 secure requests.',
    details: ['OS: NetVision Linux', 'Active Sockets: 4', 'Default GW: 192.168.1.1'],
  },
  switch: {
    id: 'switch',
    name: 'L2 SWITCH',
    role: 'Layer-2 Switching Chassis',
    ip: '192.168.1.2 (Mgmt)',
    mac: 'F0:9F:C2:7B:11:A0',
    layer: 'L2 / Data Link',
    description: 'Inspects 802.3 Ethernet frames, maintains CAM MAC address tables, forwards traffic at line rate.',
    details: ['Ports: 24x 1GbE / 4x 10GbE SFP+', 'VLANs: 10 (Data), 20 (Mgmt)', 'Buffer: 4MB Shared'],
  },
  router: {
    id: 'router',
    name: 'CORE ROUTER',
    role: 'Network Layer Gateway & Forwarder',
    ip: '192.168.1.1 / 10.0.0.1',
    mac: '00:1A:2B:3C:4D:5E',
    layer: 'L3 / Network',
    description: 'Evaluates destination IPv4 addresses, inspects routing tables, decrements TTL, selects next hop.',
    details: ['Protocols: BGP / OSPF / Static', 'Throughput: 40 Gbps', 'Routing Table: 850k routes'],
  },
  gateway: {
    id: 'gateway',
    name: 'EDGE GATEWAY',
    role: 'Security & NAT Appliance',
    ip: '198.51.100.1 (WAN)',
    mac: '3C:08:F6:E1:92:01',
    layer: 'L4-L7 / Stateful Security',
    description: 'Performs SNAT/DNAT translations, stateful firewall inspection, and TLS packet verification.',
    details: ['State Table: 128k Conns', 'IPS Rules: Active', 'Threat Level: 0.00% (Clean)'],
  },
  server: {
    id: 'server',
    name: 'ORIGIN SERVER',
    role: 'Enterprise Web & DNS Server',
    ip: '142.250.72.14',
    mac: '52:54:00:8F:A2:14',
    layer: 'L7 / Server Services',
    description: 'Terminates QUIC / TLS 1.3 encrypted streams, processes API requests, serves signed payloads.',
    details: ['Services: HTTP/3, DNS (BIND9)', 'Uptime: 99.99%', 'Latency: 0.42 ms'],
  },
};

export const HeroObservatorySection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simulation Controls State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [showLegend, setShowLegend] = useState<boolean>(true);
  const [scenario, setScenario] = useState<NetworkScenario>('normal');
  const [showScenarioMenu, setShowScenarioMenu] = useState<boolean>(false);

  // Device Inspection State
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<DeviceInfo | null>(null);

  // Perspective camera angles matching the reference image exactly
  const [rotationAngle, setRotationAngle] = useState<{ x: number; y: number }>({ x: 22, y: -26 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Animation time tracker for in-flight packets
  const packetTimeRef = useRef<number>(0);

  // Motion preference detection
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mql.matches);
      const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    }
  }, []);

  // Smooth Scroll-Driven Scene Storytelling without hijacking browser scroll
  useEffect(() => {
    const handleScroll = () => {
      if (prefersReducedMotion) return;
      const scrollY = window.scrollY;
      const heroHeight = containerRef.current?.offsetHeight || 800;
      const progress = Math.min(Math.max(scrollY / heroHeight, 0), 1);

      // Subtle dynamic camera depth shift as user begins reading downward
      if (!isDragging) {
        setRotationAngle({
          x: 22 + progress * 4,
          y: -26 + progress * 8,
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDragging, prefersReducedMotion]);

  // 3D Isometric Projection Engine
  const project3D = useCallback(
    (
      x: number,
      y: number,
      z: number,
      cx: number,
      cy: number,
      rotX = rotationAngle.x,
      rotY = rotationAngle.y,
      zoom = 1.05
    ) => {
      const radX = (rotX * Math.PI) / 180;
      const radY = (rotY * Math.PI) / 180;

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

      // Perspective Focal Scale
      const fov = 480;
      const scale = (fov / (fov + z2)) * zoom;

      return {
        x: cx + x1 * scale,
        y: cy + y2 * scale,
        scale,
        depth: z2,
      };
    },
    [rotationAngle.x, rotationAngle.y]
  );

  // Main 60 FPS Render Loop
  useEffect(() => {
    let animFrame: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (isPlaying) {
        const animSpeed = prefersReducedMotion ? speed * 0.35 : speed;
        packetTimeRef.current += dt * animSpeed;
      }

      // Handle Retina / DPI scaling (capped at 2.0)
      const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Center offset shifted to give full prominence to the physical devices
      const isMobile = width < 1024;
      const cx = isMobile ? width * 0.5 : width * 0.52;
      const cy = isMobile ? height * 0.6 : height * 0.54;
      const t = packetTimeRef.current;

      // 1. Draw Ground Plane Technical Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      const span = 350;
      const step = 40;

      for (let i = -span; i <= span; i += step) {
        const p1 = project3D(i, 135, -span, cx, cy);
        const p2 = project3D(i, 135, span, cx, cy);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        const p3 = project3D(-span, 135, i, cx, cy);
        const p4 = project3D(span, 135, i, cx, cy);
        ctx.beginPath();
        ctx.moveTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.stroke();
      }

      // 2. Exact Physical 3D Coordinates of Hardware Devices (Matching Reference Image)
      const devPos = {
        workstation: { x: -250, y: 100, z: 80 },
        switch: { x: -90, y: 40, z: 25 },
        router: { x: 35, y: -15, z: -10 },
        gateway: { x: 150, y: -70, z: -45 },
        server: { x: 260, y: -135, z: -85 },
      };

      const pWorkstation = project3D(devPos.workstation.x, devPos.workstation.y, devPos.workstation.z, cx, cy);
      const pSwitch = project3D(devPos.switch.x, devPos.switch.y, devPos.switch.z, cx, cy);
      const pRouter = project3D(devPos.router.x, devPos.router.y, devPos.router.z, cx, cy);
      const pGateway = project3D(devPos.gateway.x, devPos.gateway.y, devPos.gateway.z, cx, cy);
      const pServer = project3D(devPos.server.x, devPos.server.y, devPos.server.z, cx, cy);

      // Node Hit Testing registration
      (canvas as any).__nodeHitTargets = [
        { id: 'workstation', x: pWorkstation.x, y: pWorkstation.y, r: 35 * pWorkstation.scale },
        { id: 'switch', x: pSwitch.x, y: pSwitch.y, r: 32 * pSwitch.scale },
        { id: 'router', x: pRouter.x, y: pRouter.y, r: 30 * pRouter.scale },
        { id: 'gateway', x: pGateway.x, y: pGateway.y, r: 30 * pGateway.scale },
        { id: 'server', x: pServer.x, y: pServer.y, r: 36 * pServer.scale },
      ];

      // 3. Draw Connecting Glowing Conduits with Segmented Pulse Flow
      // Scenario color modulations
      const conduit1Color = '#10b981';
      const conduit1Glow = '#22d3ee';

      const conduit2Color = scenario === 'degraded' ? '#f59e0b' : '#10b981';
      const conduit2Glow = scenario === 'degraded' ? '#fbbf24' : '#22d3ee';

      const conduit3Color = scenario === 'failure' ? '#ef4444' : '#10b981';
      const conduit3Glow = scenario === 'failure' ? '#f87171' : '#22d3ee';

      const conduit4Color = '#10b981';
      const conduit4Glow = '#22d3ee';

      // Conduit 1: Workstation to Switch
      const wsP = { x: pWorkstation.x + 32 * pWorkstation.scale, y: pWorkstation.y - 12 * pWorkstation.scale };
      const swP1 = { x: pSwitch.x - 26 * pSwitch.scale, y: pSwitch.y + 4 * pSwitch.scale };
      drawSegmentedConduit(ctx, wsP.x, wsP.y, swP1.x, swP1.y, conduit1Color, conduit1Glow, t, false);

      // Conduit 2: Switch to Router
      const swP2 = { x: pSwitch.x + 26 * pSwitch.scale, y: pSwitch.y - 8 * pSwitch.scale };
      const rtrP1 = { x: pRouter.x - 22 * pRouter.scale, y: pRouter.y + 8 * pRouter.scale };
      drawSegmentedConduit(ctx, swP2.x, swP2.y, rtrP1.x, rtrP1.y, conduit2Color, conduit2Glow, t + 0.3, scenario === 'degraded');

      // Conduit 3: Router to Gateway
      const rtrP2 = { x: pRouter.x + 22 * pRouter.scale, y: pRouter.y - 8 * pRouter.scale };
      const gwP1 = { x: pGateway.x - 24 * pGateway.scale, y: pGateway.y + 8 * pGateway.scale };
      drawSegmentedConduit(ctx, rtrP2.x, rtrP2.y, gwP1.x, gwP1.y, conduit3Color, conduit3Glow, t + 0.6, scenario === 'failure');

      // Conduit 4: Gateway to Server
      const gwP2 = { x: pGateway.x + 24 * pGateway.scale, y: pGateway.y - 8 * pGateway.scale };
      const srvP = { x: pServer.x - 26 * pServer.scale, y: pServer.y + 10 * pServer.scale };
      drawSegmentedConduit(ctx, gwP2.x, gwP2.y, srvP.x, srvP.y, conduit4Color, conduit4Glow, t + 0.9, false);

      // 4. Draw Floating Inspection Packet Badges (Exact content from reference image)
      if (showLegend) {
        // Tag 1: DNS QUERY
        drawPacketHeaderTag(
          ctx,
          (wsP.x + swP1.x) / 2 - 20,
          (wsP.y + swP1.y) / 2 - 45,
          'DNS QUERY',
          ['ID: 0x7A3F', 'FROM: 192.168.1.10', 'TO: 8.8.8.8'],
          '#10b981'
        );

        // Tag 2: TCP SYN
        drawPacketHeaderTag(
          ctx,
          (swP2.x + rtrP1.x) / 2 - 15,
          (swP2.y + rtrP1.y) / 2 - 58,
          'TCP SYN',
          ['SRC: 192.168.1.10:54321', 'DST: 142.250.72.14:443', 'SEQ: 105338'],
          scenario === 'degraded' ? '#f59e0b' : '#22c55e'
        );

        // Tag 3: IP PACKET
        drawPacketHeaderTag(
          ctx,
          (rtrP2.x + gwP1.x) / 2 - 10,
          (rtrP2.y + gwP1.y) / 2 - 52,
          'IP PACKET',
          ['SRC: 192.168.1.10', 'DST: 142.250.72.14', 'TTL: 63'],
          scenario === 'failure' ? '#ef4444' : '#22c55e'
        );

        // Tag 4: HTTP/3 RESPONSE
        drawPacketHeaderTag(
          ctx,
          (gwP2.x + srvP.x) / 2 + 10,
          (gwP2.y + srvP.y) / 2 - 52,
          'HTTP/3 RESPONSE',
          ['STATUS: 200 OK', 'SIZE: 14.2 KB', 'TIME: 42ms'],
          '#10b981'
        );
      }

      // 5. Draw Animated Photonic Packets Traveling Along Links
      const pProg1 = (t * 0.85) % 1;
      const p1x = wsP.x + (swP1.x - wsP.x) * pProg1;
      const p1y = wsP.y + (swP1.y - wsP.y) * pProg1;
      drawGlowingPacket(ctx, p1x, p1y, '#22c55e', 4.5);

      const pProg2 = (t * 0.9 + 0.3) % 1;
      const p2x = swP2.x + (rtrP1.x - swP2.x) * pProg2;
      const p2y = swP2.y + (rtrP1.y - swP2.y) * pProg2;
      drawGlowingPacket(ctx, p2x, p2y, scenario === 'degraded' ? '#f59e0b' : '#22c55e', 5);

      if (scenario !== 'failure') {
        const pProg3 = (t * 0.9 + 0.6) % 1;
        const p3x = rtrP2.x + (gwP1.x - rtrP2.x) * pProg3;
        const p3y = rtrP2.y + (gwP1.y - rtrP2.y) * pProg3;
        drawGlowingPacket(ctx, p3x, p3y, '#22c55e', 5);

        const pProg4 = (t * 0.85 + 0.15) % 1;
        const p4x = gwP2.x + (srvP.x - gwP2.x) * pProg4;
        const p4y = gwP2.y + (srvP.y - gwP2.y) * pProg4;
        drawGlowingPacket(ctx, p4x, p4y, '#22c55e', 4.5);
      } else {
        // Draw Dropped Packet Animation at router
        const dropAlpha = (Math.sin(t * 8) + 1) / 2;
        ctx.fillStyle = `rgba(239, 68, 68, ${dropAlpha})`;
        ctx.font = 'bold 9px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('✕ PACKET DROP', rtrP2.x + 30, rtrP2.y - 12);
      }

      // 6. Draw Realistic Hardware Devices

      // Device 1: WORKSTATION (Monitor with Cyan N Logo, Tower PC, Keyboard, Mouse)
      drawWorkstationDevice(ctx, pWorkstation.x, pWorkstation.y, pWorkstation.scale, hoveredNode === 'workstation');

      // Device 2: L2 SWITCH (1U Rack Chassis with 24 Port LEDs)
      drawSwitchDevice(ctx, pSwitch.x, pSwitch.y, pSwitch.scale, t, hoveredNode === 'switch');

      // Device 3: ROUTER (Cylindrical Router with 4 White Cross-Arrows & Antennas)
      drawRouterDevice(ctx, pRouter.x, pRouter.y, pRouter.scale, hoveredNode === 'router');

      // Device 4: EDGE GATEWAY (Security Appliance with Glowing Shield Icon)
      drawGatewayDevice(ctx, pGateway.x, pGateway.y, pGateway.scale, hoveredNode === 'gateway');

      // Device 5: SERVER (Tall Blade Chassis with Cloud & Drive LEDs)
      drawServerDevice(ctx, pServer.x, pServer.y, pServer.scale, hoveredNode === 'server');

      // 7. Render Clean Uppercase Hardware Text Labels
      drawDeviceLabel(ctx, 'WORKSTATION', pWorkstation.x, pWorkstation.y + 44 * pWorkstation.scale);
      drawDeviceLabel(ctx, 'L2 SWITCH', pSwitch.x, pSwitch.y + 28 * pSwitch.scale);
      drawDeviceLabel(ctx, 'ROUTER', pRouter.x, pRouter.y + 28 * pRouter.scale);
      drawDeviceLabel(ctx, 'EDGE GATEWAY', pGateway.x, pGateway.y + 30 * pGateway.scale);
      drawDeviceLabel(ctx, 'SERVER', pServer.x, pServer.y + 38 * pServer.scale);

      ctx.restore();
      animFrame = requestAnimationFrame(render);
    };

    animFrame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrame);
  }, [isPlaying, speed, rotationAngle, showLegend, hoveredNode, scenario, prefersReducedMotion, project3D]);

  // Segmented Glowing Conduit Helper
  const drawSegmentedConduit = (
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    baseColor: string,
    glowColor: string,
    t: number,
    isJitter: boolean
  ) => {
    const jitterX = isJitter ? (Math.random() - 0.5) * 1.5 : 0;
    const jitterY = isJitter ? (Math.random() - 0.5) * 1.5 : 0;

    // Base Conduit Tube
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
    ctx.beginPath();
    ctx.moveTo(x1 + jitterX, y1 + jitterY);
    ctx.lineTo(x2 + jitterX, y2 + jitterY);
    ctx.stroke();

    // Luminous Active Flow Line
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = glowColor;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  };

  // Packet Header Tag Box (e.g. DNS QUERY, TCP SYN, IP PACKET, HTTP/3 RESPONSE)
  const drawPacketHeaderTag = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    title: string,
    lines: string[],
    accentColor: string
  ) => {
    const w = 112;
    const h = 20 + lines.length * 11;

    // Dark Card Container
    ctx.fillStyle = 'rgba(10, 15, 23, 0.92)';
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 6);
    ctx.fill();
    ctx.stroke();

    // Top Title Header
    ctx.font = 'bold 9px JetBrains Mono, monospace';
    ctx.fillStyle = accentColor;
    ctx.textAlign = 'left';
    ctx.fillText(title, x + 8, y + 13);

    // Body Lines
    ctx.font = '8px JetBrains Mono, monospace';
    ctx.fillStyle = '#94a3b8';
    lines.forEach((line, idx) => {
      ctx.fillText(line, x + 8, y + 25 + idx * 11);
    });
  };

  // Photonic Packet Glow Helper
  const drawGlowingPacket = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    radius: number
  ) => {
    const aura = ctx.createRadialGradient(x, y, 1, x, y, radius * 3);
    aura.addColorStop(0, color);
    aura.addColorStop(1, 'transparent');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(x, y, radius * 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.75, 0, Math.PI * 2);
    ctx.fill();
  };

  // Device Label Helper
  const drawDeviceLabel = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number) => {
    ctx.font = 'bold 9px JetBrains Mono, monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y);
  };

  // Device Hardware Drawers
  const drawWorkstationDevice = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale: number,
    isHovered: boolean
  ) => {
    const s = scale;

    // Monitor Bezel
    const mw = 44 * s;
    const mh = 32 * s;
    ctx.fillStyle = isHovered ? '#1e293b' : '#0f172a';
    ctx.strokeStyle = isHovered ? '#22c55e' : '#334155';
    ctx.lineWidth = 1.8 * s;
    ctx.beginPath();
    ctx.roundRect(x - mw / 2 - 10 * s, y - mh / 2 - 8 * s, mw, mh, 4);
    ctx.fill();
    ctx.stroke();

    // Display Screen (Dark with cyan 'N' Logo)
    ctx.fillStyle = '#06131f';
    ctx.fillRect(x - mw / 2 - 6 * s, y - mh / 2 - 4 * s, mw - 8 * s, mh - 8 * s);
    ctx.fillStyle = '#22d3ee';
    ctx.font = `bold ${Math.round(14 * s)}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('N', x - 10 * s, y + 2 * s);

    // Stand
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x - 13 * s, y + mh / 2 - 8 * s, 6 * s, 10 * s);
    ctx.fillRect(x - 18 * s, y + mh / 2 + 2 * s, 16 * s, 3 * s);

    // Desktop Tower PC
    const tw = 18 * s;
    const th = 38 * s;
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5 * s;
    ctx.beginPath();
    ctx.roundRect(x + mw / 2 - 6 * s, y - th / 2, tw, th, 3);
    ctx.fill();
    ctx.stroke();

    // Tower Power LED
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(x + mw / 2 + 3 * s, y - th / 2 + 6 * s, 1.2 * s, 0, Math.PI * 2);
    ctx.fill();

    // Keyboard & Mouse
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x - 22 * s, y + 16 * s, 26 * s, 9 * s);
    ctx.beginPath();
    ctx.arc(x + 10 * s, y + 20 * s, 3 * s, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawSwitchDevice = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale: number,
    time: number,
    isHovered: boolean
  ) => {
    const s = scale;
    const sw = 56 * s;
    const sh = 20 * s;

    // 1U Switch Rack Chassis
    ctx.fillStyle = isHovered ? '#1e293b' : '#0f172a';
    ctx.strokeStyle = isHovered ? '#22c55e' : '#334155';
    ctx.lineWidth = 1.8 * s;
    ctx.beginPath();
    ctx.roundRect(x - sw / 2, y - sh / 2, sw, sh, 4);
    ctx.fill();
    ctx.stroke();

    // Front Port Faceplate & RJ45 LEDs
    const portCount = 10;
    const portW = 3.2 * s;
    for (let i = 0; i < portCount; i++) {
      const px = x - sw / 2 + 8 * s + i * (portW + 1.8 * s);
      const py = y;

      ctx.fillStyle = '#020617';
      ctx.fillRect(px, py - 3 * s, portW, 6 * s);

      const isBlinking = Math.sin(time * 6 + i) > 0;
      ctx.fillStyle = isBlinking ? '#22c55e' : '#064e3b';
      ctx.beginPath();
      ctx.arc(px + portW / 2, py - 5 * s, 1 * s, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawRouterDevice = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale: number,
    isHovered: boolean
  ) => {
    const s = scale;
    const r = 24 * s;

    // Cylindrical Base Disc
    ctx.fillStyle = isHovered ? '#1e293b' : '#0f172a';
    ctx.strokeStyle = isHovered ? '#22c55e' : '#334155';
    ctx.lineWidth = 2 * s;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Glowing Inner Ring
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)';
    ctx.lineWidth = 1.5 * s;
    ctx.beginPath();
    ctx.arc(x, y, r - 5 * s, 0, Math.PI * 2);
    ctx.stroke();

    // 4 Directional Routing Cross-Arrows
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.8 * s;
    const arrowLen = 9 * s;

    // Horizontal pair
    ctx.beginPath();
    ctx.moveTo(x - arrowLen, y);
    ctx.lineTo(x + arrowLen, y);
    ctx.moveTo(x - arrowLen + 3 * s, y - 3 * s);
    ctx.lineTo(x - arrowLen, y);
    ctx.lineTo(x - arrowLen + 3 * s, y + 3 * s);
    ctx.moveTo(x + arrowLen - 3 * s, y - 3 * s);
    ctx.lineTo(x + arrowLen, y);
    ctx.lineTo(x + arrowLen - 3 * s, y + 3 * s);
    ctx.stroke();

    // Vertical pair
    ctx.beginPath();
    ctx.moveTo(x, y - arrowLen);
    ctx.lineTo(x, y + arrowLen);
    ctx.moveTo(x - 3 * s, y - arrowLen + 3 * s);
    ctx.lineTo(x, y - arrowLen);
    ctx.lineTo(x + 3 * s, y - arrowLen + 3 * s);
    ctx.moveTo(x - 3 * s, y + arrowLen - 3 * s);
    ctx.lineTo(x, y + arrowLen);
    ctx.lineTo(x + 3 * s, y + arrowLen - 3 * s);
    ctx.stroke();

    // Dual Antennas
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2 * s;
    ctx.beginPath();
    ctx.moveTo(x - 12 * s, y - r + 4 * s);
    ctx.lineTo(x - 12 * s, y - r - 16 * s);
    ctx.moveTo(x + 12 * s, y - r + 4 * s);
    ctx.lineTo(x + 12 * s, y - r - 16 * s);
    ctx.stroke();
  };

  const drawGatewayDevice = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale: number,
    isHovered: boolean
  ) => {
    const s = scale;
    const gw = 44 * s;
    const gh = 36 * s;

    // Square Edge Gateway Chassis
    ctx.fillStyle = isHovered ? '#1e293b' : '#0f172a';
    ctx.strokeStyle = isHovered ? '#22c55e' : '#334155';
    ctx.lineWidth = 1.8 * s;
    ctx.beginPath();
    ctx.roundRect(x - gw / 2, y - gh / 2, gw, gh, 4);
    ctx.fill();
    ctx.stroke();

    // Front Shield Icon Outline
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 1.5 * s;
    ctx.beginPath();
    ctx.moveTo(x, y - 8 * s);
    ctx.lineTo(x + 7 * s, y - 4 * s);
    ctx.lineTo(x + 7 * s, y + 3 * s);
    ctx.lineTo(x, y + 9 * s);
    ctx.lineTo(x - 7 * s, y + 3 * s);
    ctx.lineTo(x - 7 * s, y - 4 * s);
    ctx.closePath();
    ctx.stroke();

    // Status Port LEDs
    for (let i = -2; i <= 2; i++) {
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(x + i * 5 * s, y + gh / 2 - 5 * s, 1.2 * s, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawServerDevice = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale: number,
    isHovered: boolean
  ) => {
    const s = scale;
    const sw = 38 * s;
    const sh = 64 * s;

    // Enterprise Server Tower Chassis
    ctx.fillStyle = isHovered ? '#1e293b' : '#0f172a';
    ctx.strokeStyle = isHovered ? '#22c55e' : '#334155';
    ctx.lineWidth = 1.8 * s;
    ctx.beginPath();
    ctx.roundRect(x - sw / 2, y - sh / 2, sw, sh, 4);
    ctx.fill();
    ctx.stroke();

    // Drive Bay Sleds
    for (let i = 0; i < 4; i++) {
      const by = y - sh / 2 + 10 * s + i * 9 * s;
      ctx.fillStyle = '#020617';
      ctx.fillRect(x - sw / 2 + 4 * s, by, sw - 8 * s, 6 * s);

      // Green Activity Drive Light
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(x + sw / 2 - 8 * s, by + 3 * s, 1 * s, 0, Math.PI * 2);
      ctx.fill();
    }

    // Cloud / Network Indicator Icon on Lower Face
    ctx.fillStyle = '#22d3ee';
    ctx.beginPath();
    ctx.arc(x, y + sh / 2 - 12 * s, 3.5 * s, 0, Math.PI * 2);
    ctx.fill();
  };

  // Mouse Orbital & Hit Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Handle Drag Orbit
    if (isDragging) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setRotationAngle((prev) => ({
        x: Math.max(10, Math.min(45, prev.x + dy * 0.25)),
        y: (prev.y + dx * 0.25) % 360,
      }));
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    // Handle Hover Node Detection
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const targets = (canvas as any).__nodeHitTargets || [];
    let hit: string | null = null;
    for (const target of targets) {
      const dist = Math.hypot(mx - target.x, my - target.y);
      if (dist <= target.r) {
        hit = target.id;
        break;
      }
    }
    setHoveredNode(hit);
  };

  const handleClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const targets = (canvas as any).__nodeHitTargets || [];
    for (const target of targets) {
      const dist = Math.hypot(mx - target.x, my - target.y);
      if (dist <= target.r) {
        setSelectedNode(DEVICE_METADATA[target.id] || null);
        return;
      }
    }
    // If clicked empty canvas, clear selection
    setSelectedNode(null);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setRotationAngle({ x: 22, y: -26 });
    setScenario('normal');
  };

  return (
    <section
      ref={containerRef}
      className="relative pt-6 pb-12 bg-net-grid-pattern bg-[#070a10] border-b border-[#1b2230] font-sans"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Master Hero Container Card */}
        <div className="relative w-full rounded-2xl border border-[#1e293b] bg-[#0c1017] shadow-2xl overflow-hidden">
          {/* 3D Canvas Viewport */}
          <div
            className="relative w-full h-[580px] sm:h-[660px] lg:h-[730px] bg-[#090d14] cursor-grab active:cursor-grabbing overflow-hidden select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={handleClick}
          >
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* Top Live Simulation Badge */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#0f172a]/90 backdrop-blur-md border border-[#1e293b] text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
              <span className="font-bold text-white tracking-wider">LIVE NETWORK SIMULATION</span>
              <span className="text-[#64748b] ml-1 font-bold">60 FPS</span>
            </div>

            {/* Top-Right Simulation Controls Bar */}
            <div className="absolute top-4 right-4 z-20 font-mono text-xs">
              <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#0f172a]/90 backdrop-blur-md border border-[#1e293b]">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  aria-label={isPlaying ? 'Pause simulation' : 'Resume simulation'}
                  className="px-2.5 py-1 rounded-md text-[#94a3b8] hover:text-white hover:bg-[#1e293b] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5 text-[#22c55e]" />
                  )}
                  <span>{isPlaying ? 'Pause' : 'Resume'}</span>
                </button>

                <button
                  type="button"
                  onClick={resetView}
                  aria-label="Reset 3D camera"
                  className="px-2.5 py-1 rounded-md text-[#94a3b8] hover:text-white hover:bg-[#1e293b] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowLegend(!showLegend)}
                  aria-label="Toggle Legend"
                  className="px-2.5 py-1 rounded-md text-[#94a3b8] hover:text-white hover:bg-[#1e293b] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Legend</span>
                </button>

                {/* Scenario Toggle */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowScenarioMenu(!showScenarioMenu)}
                    aria-label="Select Scenario"
                    className="px-2.5 py-1 rounded-md text-[#94a3b8] hover:text-white hover:bg-[#1e293b] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span className="capitalize">{scenario}</span>
                  </button>

                  {showScenarioMenu && (
                    <div className="absolute right-0 mt-2 w-44 rounded-xl bg-[#0f172a] border border-[#1e293b] shadow-2xl p-1.5 z-30 flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setScenario('normal');
                          setShowScenarioMenu(false);
                        }}
                        className="px-2.5 py-1.5 text-left text-xs rounded-lg hover:bg-[#1e293b] text-[#22c55e] flex items-center justify-between cursor-pointer"
                      >
                        <span>Normal Flow</span>
                        {scenario === 'normal' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setScenario('degraded');
                          setShowScenarioMenu(false);
                        }}
                        className="px-2.5 py-1.5 text-left text-xs rounded-lg hover:bg-[#1e293b] text-[#f59e0b] flex items-center justify-between cursor-pointer"
                      >
                        <span>Link Congestion</span>
                        {scenario === 'degraded' && <AlertTriangle className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setScenario('failure');
                          setShowScenarioMenu(false);
                        }}
                        className="px-2.5 py-1.5 text-left text-xs rounded-lg hover:bg-[#1e293b] text-[#ef4444] flex items-center justify-between cursor-pointer"
                      >
                        <span>Link Failure & Drop</span>
                        {scenario === 'failure' && <Activity className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Left Editorial Content Overlay */}
            <div className="absolute top-10 sm:top-14 left-6 sm:left-12 max-w-lg pointer-events-none z-10 pr-4">
              {/* Overline Badge */}
              <div className="text-[11px] font-mono font-bold text-[#22c55e] uppercase tracking-widest mb-3 flex items-center gap-2">
                <span>INTERACTIVE NETWORK OBSERVATORY</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-4 font-sans">
                Learn networking by <br />
                <span className="text-white">seeing how it works.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed mb-6 max-w-md">
                See packets move. Change network variables. <br className="hidden sm:inline" />
                Understand what the network is actually doing.
              </p>

              {/* CTA Action Row */}
              <div className="flex flex-wrap items-center gap-3 pointer-events-auto mb-8 font-sans">
                <Link href="/courses">
                  <button
                    type="button"
                    className="px-6 py-3 rounded-lg bg-[#22c55e] text-[#062817] text-xs font-bold hover:bg-[#16a34a] transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
                  >
                    <span>Explore Curriculum</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>

                <Link href="/sandbox">
                  <button
                    type="button"
                    className="px-6 py-3 rounded-lg bg-[#0f172a]/90 backdrop-blur-sm border border-[#1e293b] text-[#f4f5f7] text-xs font-semibold hover:border-[#22c55e]/60 transition-all cursor-pointer"
                  >
                    Enter Interactive Network
                  </button>
                </Link>
              </div>

              {/* Micro-Feature Badges Row */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#94a3b8]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#0f172a] border border-[#1e293b] flex items-center justify-center text-[#22c55e]">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#64748b]">Guest Access</span>
                    <strong className="text-white text-[11px]">100% Open</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#0f172a] border border-[#1e293b] flex items-center justify-center text-[#38bdf8]">
                    <Package className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#64748b]">16 Courses</span>
                    <strong className="text-white text-[11px]">NET-101 to 404</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#0f172a] border border-[#1e293b] flex items-center justify-center text-[#a855f7]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#64748b]">Verifiable</span>
                    <strong className="text-white text-[11px]">NV-NET Certified</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Node Details Modal / HUD Overlay */}
            {selectedNode && (
              <div className="absolute bottom-16 right-6 w-80 p-4 rounded-xl bg-[#0c121e]/95 backdrop-blur-md border border-[#22c55e]/50 shadow-2xl z-30 font-sans animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-[#1e293b] mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                    <span className="font-mono font-bold text-xs text-white">{selectedNode.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedNode(null)}
                    className="text-[#94a3b8] hover:text-white p-0.5 rounded cursor-pointer"
                    aria-label="Close details"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="text-[11px] font-mono text-[#38bdf8]">{selectedNode.role}</div>
                  <p className="text-[11px] text-[#94a3b8] leading-snug">{selectedNode.description}</p>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1e293b] font-mono text-[10px]">
                    <div>
                      <span className="text-[#64748b] block">IP Address</span>
                      <strong className="text-[#f4f5f7]">{selectedNode.ip}</strong>
                    </div>
                    <div>
                      <span className="text-[#64748b] block">OSI Layer</span>
                      <strong className="text-[#22c55e]">{selectedNode.layer}</strong>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-[9px] font-mono uppercase text-[#64748b] block mb-1">
                      Device Telemetry
                    </span>
                    <ul className="text-[10px] font-mono text-[#94a3b8] space-y-0.5">
                      {selectedNode.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="text-[#22c55e]">›</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Telemetry Strip */}
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between font-mono text-xs text-[#94a3b8] pointer-events-none">
              <div className="flex items-center gap-6">
                <span>
                  LATENCY:{' '}
                  <strong className="text-[#22c55e]">
                    {scenario === 'degraded' ? '48.20 ms' : '0.42 ms'}
                  </strong>
                </span>
                <span>
                  LINKS:{' '}
                  <strong className={scenario === 'failure' ? 'text-[#ef4444]' : 'text-[#22c55e]'}>
                    {scenario === 'failure' ? '6/7 DEGRADED' : '7/7 UP'}
                  </strong>
                </span>
                <span>
                  TOPOLOGY: <strong className="text-[#22d3ee]">DUAL-CORE MESH</strong>
                </span>
              </div>

              <div className="hidden sm:block text-[11px] text-[#64748b]">
                Drag to rotate · Click device to inspect
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

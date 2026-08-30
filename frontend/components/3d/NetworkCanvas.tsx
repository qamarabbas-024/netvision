'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { NETWORK_DEVICES, NETWORK_LINKS, EDUCATIONAL_PACKETS, STORY_STAGES } from '@/data/networkTopologyData';
import { NetworkDevice, NetworkScenario } from '@/types/network';
import { Vector3Spring, ScalarSpring, SPRING_PRESETS } from '@/lib/springPhysics';
import { useScrollSync } from '@/hooks/useScrollSync';

interface NetworkCanvasProps {
  currentStageId?: number;
  cameraPositionOverride?: [number, number, number];
  cameraTargetOverride?: [number, number, number];
  scenario?: NetworkScenario;
  isPaused?: boolean;
  selectedDeviceId?: string | null;
  onSelectDevice?: (device: NetworkDevice | null) => void;
  onHoverDevice?: (device: NetworkDevice | null) => void;
  activePacketLabel?: string | null;
  onPacketClick?: (packetId: string) => void;
}

interface ProjectedHudData {
  x: number;
  y: number;
  visible: boolean;
  label: string;
  details: Record<string, string | number>;
}

export const NetworkCanvas: React.FC<NetworkCanvasProps> = ({
  currentStageId = 1,
  cameraPositionOverride,
  cameraTargetOverride,
  scenario = 'healthy',
  isPaused = false,
  selectedDeviceId,
  onSelectDevice,
  onHoverDevice,
  activePacketLabel,
  onPacketClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollSync = useScrollSync();
  const [projectedHudPositions, setProjectedHudPositions] = useState<{
    [key: string]: ProjectedHudData;
  }>({});

  // Three.js instances ref
  const sceneStateRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    deviceMeshes: Map<string, THREE.Group>;
    linkCurves: { id: string; curve: THREE.CatmullRomCurve3; tubeMesh: THREE.Mesh; from: string; to: string }[];
    ambientParticles: THREE.Points[];
    educationalPacketMesh: THREE.Group;
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    posSpring: Vector3Spring;
    lookAtSpring: Vector3Spring;
    fovSpring: ScalarSpring;
    isDragging: boolean;
    previousMousePosition: { x: number; y: number };
    orbitRotation: { x: number; y: number };
    packetProgress: number;
    packetSpeed: number;
    animFrameId: number;
    clock: THREE.Clock;
    hoveredMeshId: string | null;
  } | null>(null);

  // Helper to generate NetVision logo canvas texture for workstation screen & server
  const createNetVisionScreenTexture = (text: string = 'N', subtext: string = 'NETVISION OS') => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#06131c';
      ctx.fillRect(0, 0, 512, 512);

      // Subtle tech grid
      ctx.strokeStyle = '#0f2b38';
      ctx.lineWidth = 2;
      for (let i = 0; i < 512; i += 32) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 512);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(512, i);
        ctx.stroke();
      }

      // NetVision N Logo
      ctx.strokeStyle = '#10b981';
      ctx.fillStyle = '#34d399';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(180, 360);
      ctx.lineTo(180, 150);
      ctx.lineTo(330, 360);
      ctx.lineTo(330, 150);
      ctx.stroke();

      // Nodes on vertices
      const nodes = [[180, 150], [180, 360], [330, 150], [330, 360], [255, 255]];
      nodes.forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, 14, 0, Math.PI * 2);
        ctx.fillStyle = '#06b6d4';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
      });

      // Terminal text below
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 24px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(subtext, 256, 420);

      ctx.fillStyle = '#64748b';
      ctx.font = '16px monospace';
      ctx.fillText('IP: 192.168.1.10/24 | RX: 12.4 Mbps', 256, 455);
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  };

  // Helper to create switch faceplate texture with 24 ethernet ports
  const createSwitchPortTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, 1024, 128);

      // Border and rack brand
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 24px monospace';
      ctx.fillText('NETVISION L2-ENTERPRISE 24G', 30, 40);

      // RJ-45 ports in 2 rows of 12
      const startX = 380;
      for (let i = 0; i < 12; i++) {
        const px = startX + i * 50;
        // Top row
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(px, 20, 36, 36);
        ctx.strokeStyle = '#334155';
        ctx.strokeRect(px, 20, 36, 36);

        // LED
        ctx.fillStyle = i < 8 ? '#10b981' : (i === 11 ? '#f59e0b' : '#334155');
        ctx.beginPath();
        ctx.arc(px + 18, 12, 4, 0, Math.PI * 2);
        ctx.fill();

        // Bottom row
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(px, 70, 36, 36);
        ctx.strokeStyle = '#334155';
        ctx.strokeRect(px, 70, 36, 36);

        ctx.fillStyle = i < 6 ? '#06b6d4' : '#334155';
        ctx.beginPath();
        ctx.arc(px + 18, 114, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    return new THREE.CanvasTexture(canvas);
  };

  // Build Procedural 3D Device Models
  const buildDeviceModel = (device: NetworkDevice): THREE.Group => {
    const group = new THREE.Group();
    group.name = device.id;
    group.userData = { deviceId: device.id, device };

    const graphiteMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.25,
    });

    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.9,
      roughness: 0.3,
    });

    const emeraldGlowMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 0.9,
      roughness: 0.1,
    });

    const cyanGlowMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.9,
      roughness: 0.1,
    });

    if (device.type === 'workstation') {
      // 1. WORKSTATION: Realistic 3D angled widescreen display, neck, base, keyboard
      const bezelGeo = new THREE.BoxGeometry(2.4, 1.6, 0.12);
      const bezelMesh = new THREE.Mesh(bezelGeo, graphiteMat);
      bezelMesh.position.y = 1.35;
      bezelMesh.rotation.x = -0.08;
      bezelMesh.castShadow = true;
      group.add(bezelMesh);

      // Display Screen with Texture
      const screenGeo = new THREE.PlaneGeometry(2.2, 1.4);
      const screenMat = new THREE.MeshBasicMaterial({
        map: createNetVisionScreenTexture('N', 'WORKSTATION (CLIENT)'),
      });
      const screenMesh = new THREE.Mesh(screenGeo, screenMat);
      screenMesh.position.set(0, 1.35, 0.07);
      screenMesh.rotation.x = -0.08;
      group.add(screenMesh);

      // Stand Neck
      const neckGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.9, 16);
      const neckMesh = new THREE.Mesh(neckGeo, darkMetalMat);
      neckMesh.position.set(0, 0.55, -0.15);
      group.add(neckMesh);

      // Stand Base
      const baseGeo = new THREE.CylinderGeometry(0.55, 0.6, 0.06, 24);
      const baseMesh = new THREE.Mesh(baseGeo, darkMetalMat);
      baseMesh.position.set(0, 0.05, -0.1);
      group.add(baseMesh);

      // Keyboard
      const kbGeo = new THREE.BoxGeometry(1.8, 0.06, 0.7);
      const kbMesh = new THREE.Mesh(kbGeo, graphiteMat);
      kbMesh.position.set(0, 0.04, 0.75);
      kbMesh.rotation.x = 0.05;
      group.add(kbMesh);

      // Glow indicator dot on bezel
      const ledGeo = new THREE.SphereGeometry(0.03, 12, 12);
      const ledMesh = new THREE.Mesh(ledGeo, emeraldGlowMat);
      ledMesh.position.set(1.05, 0.62, 0.08);
      group.add(ledMesh);
    } else if (device.type === 'switch') {
      // 2. L2 SWITCH: Rackmount switch with port array, rack ears, glowing status
      const chassisGeo = new THREE.BoxGeometry(3.0, 0.65, 2.0);
      const chassisMesh = new THREE.Mesh(chassisGeo, graphiteMat);
      chassisMesh.position.y = 0.35;
      chassisMesh.castShadow = true;
      group.add(chassisMesh);

      // Front Faceplate
      const faceGeo = new THREE.PlaneGeometry(2.95, 0.58);
      const faceMat = new THREE.MeshBasicMaterial({
        map: createSwitchPortTexture(),
      });
      const faceMesh = new THREE.Mesh(faceGeo, faceMat);
      faceMesh.position.set(0, 0.35, 1.01);
      group.add(faceMesh);

      // Rack Ears (metal side brackets)
      const earGeo = new THREE.BoxGeometry(0.12, 0.8, 0.3);
      const earLeft = new THREE.Mesh(earGeo, darkMetalMat);
      earLeft.position.set(-1.56, 0.35, 0.9);
      const earRight = new THREE.Mesh(earGeo, darkMetalMat);
      earRight.position.set(1.56, 0.35, 0.9);
      group.add(earLeft, earRight);

      // Top ventilation slit line
      const ventGeo = new THREE.PlaneGeometry(2.4, 1.2);
      const ventMat = new THREE.MeshStandardMaterial({
        color: 0x090d16,
        roughness: 0.8,
      });
      const ventMesh = new THREE.Mesh(ventGeo, ventMat);
      ventMesh.rotation.x = -Math.PI / 2;
      ventMesh.position.set(0, 0.68, 0);
      group.add(ventMesh);
    } else if (device.type === 'router') {
      // 3. ROUTER: Iconic circular enterprise router disc with 4-way routing arrows
      const discGeo = new THREE.CylinderGeometry(1.45, 1.55, 0.75, 48);
      const discMesh = new THREE.Mesh(discGeo, graphiteMat);
      discMesh.position.y = 0.4;
      discMesh.castShadow = true;
      group.add(discMesh);

      // Top disc plate with dark border
      const topPlateGeo = new THREE.CylinderGeometry(1.35, 1.35, 0.05, 48);
      const topPlateMesh = new THREE.Mesh(topPlateGeo, darkMetalMat);
      topPlateMesh.position.y = 0.8;
      group.add(topPlateMesh);

      // 4-Way Routing Arrows symbol on top
      const arrowGroup = new THREE.Group();
      arrowGroup.position.y = 0.84;

      const crossBar1 = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.04, 0.16), cyanGlowMat);
      const crossBar2 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.04, 1.6), cyanGlowMat);
      arrowGroup.add(crossBar1, crossBar2);

      // 4 Arrow Heads
      const headGeo = new THREE.ConeGeometry(0.18, 0.32, 16);
      const h1 = new THREE.Mesh(headGeo, cyanGlowMat);
      h1.position.set(0.85, 0, 0);
      h1.rotation.z = -Math.PI / 2;

      const h2 = new THREE.Mesh(headGeo, cyanGlowMat);
      h2.position.set(-0.85, 0, 0);
      h2.rotation.z = Math.PI / 2;

      const h3 = new THREE.Mesh(headGeo, cyanGlowMat);
      h3.position.set(0, 0, 0.85);
      h3.rotation.x = Math.PI / 2;

      const h4 = new THREE.Mesh(headGeo, cyanGlowMat);
      h4.position.set(0, 0, -0.85);
      h4.rotation.x = -Math.PI / 2;

      arrowGroup.add(h1, h2, h3, h4);
      group.add(arrowGroup);

      // Central glowing orb
      const coreOrb = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), emeraldGlowMat);
      coreOrb.position.y = 0.85;
      group.add(coreOrb);
    } else if (device.type === 'gateway') {
      // 4. EDGE GATEWAY: Firewall appliance box with glowing security shield
      const boxGeo = new THREE.BoxGeometry(2.6, 0.9, 1.8);
      const boxMesh = new THREE.Mesh(boxGeo, graphiteMat);
      boxMesh.position.y = 0.48;
      boxMesh.castShadow = true;
      group.add(boxMesh);

      // Front Bevel Ring
      const ringGeo = new THREE.BoxGeometry(2.5, 0.8, 0.1);
      const ringMesh = new THREE.Mesh(ringGeo, darkMetalMat);
      ringMesh.position.set(0, 0.48, 0.91);
      group.add(ringMesh);

      // Glowing Shield Emblem
      const shieldShape = new THREE.Shape();
      shieldShape.moveTo(0, 0.35);
      shieldShape.lineTo(0.25, 0.25);
      shieldShape.lineTo(0.25, -0.1);
      shieldShape.quadraticCurveTo(0.18, -0.32, 0, -0.4);
      shieldShape.quadraticCurveTo(-0.18, -0.32, -0.25, -0.1);
      shieldShape.lineTo(-0.25, 0.25);
      shieldShape.closePath();

      const shieldGeo = new THREE.ShapeGeometry(shieldShape);
      const shieldMesh = new THREE.Mesh(shieldGeo, cyanGlowMat);
      shieldMesh.position.set(0, 0.48, 0.98);
      shieldMesh.scale.set(0.65, 0.65, 0.65);
      group.add(shieldMesh);

      // Port status lights
      for (let i = -3; i <= 3; i++) {
        if (i === 0) continue;
        const portLed = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.04), emeraldGlowMat);
        portLed.position.set(i * 0.35, 0.48, 0.97);
        group.add(portLed);
      }
    } else if (device.type === 'server') {
      // 5. SERVER: Sleek enterprise server tower/chassis with drive bays & cloud glyph
      const towerGeo = new THREE.BoxGeometry(1.6, 3.2, 2.2);
      const towerMesh = new THREE.Mesh(towerGeo, graphiteMat);
      towerMesh.position.y = 1.65;
      towerMesh.castShadow = true;
      group.add(towerMesh);

      // Stacked drive bays
      for (let i = 0; i < 8; i++) {
        const bayGeo = new THREE.BoxGeometry(1.4, 0.24, 0.08);
        const bayMesh = new THREE.Mesh(bayGeo, darkMetalMat);
        bayMesh.position.set(0, 0.5 + i * 0.35, 1.12);

        // Drive LED
        const dLed = new THREE.Mesh(
          new THREE.SphereGeometry(0.025, 8, 8),
          i % 2 === 0 ? emeraldGlowMat : cyanGlowMat
        );
        dLed.position.set(0.55, 0.5 + i * 0.35, 1.17);
        group.add(bayMesh, dLed);
      }

      // Glowing Cloud Glyph on Top
      const cloudCenter = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), cyanGlowMat);
      cloudCenter.position.set(0, 2.7, 1.15);
      const cloudL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), cyanGlowMat);
      cloudL.position.set(-0.16, 2.65, 1.15);
      const cloudR = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), cyanGlowMat);
      cloudR.position.set(0.18, 2.67, 1.15);
      group.add(cloudCenter, cloudL, cloudR);
    }

    // Set position
    group.position.set(...device.position);

    // Add device text label badge in 3D
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 256;
    labelCanvas.height = 64;
    const lCtx = labelCanvas.getContext('2d');
    if (lCtx) {
      lCtx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      if (typeof lCtx.roundRect === 'function') {
        lCtx.roundRect(4, 4, 248, 56, 12);
      } else {
        lCtx.rect(4, 4, 248, 56);
      }
      lCtx.fill();
      lCtx.strokeStyle = '#334155';
      lCtx.lineWidth = 2;
      lCtx.stroke();

      lCtx.fillStyle = '#94a3b8';
      lCtx.font = 'bold 22px monospace';
      lCtx.textAlign = 'center';
      lCtx.fillText(device.name, 128, 38);
    }
    const labelTex = new THREE.CanvasTexture(labelCanvas);
    const labelPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(1.6, 0.4),
      new THREE.MeshBasicMaterial({ map: labelTex, transparent: true })
    );
    labelPlane.position.set(0, -0.4, 0.8);
    labelPlane.rotation.x = -Math.PI / 4;
    group.add(labelPlane);

    return group;
  };

  // Build Curved Spline Links & Ambient Data Pulse Particles
  const buildNetworkLinks = (scene: THREE.Scene) => {
    const linkCurves: { id: string; curve: THREE.CatmullRomCurve3; tubeMesh: THREE.Mesh; from: string; to: string }[] = [];
    const ambientParticles: THREE.Points[] = [];

    NETWORK_LINKS.forEach((link) => {
      const fromDev = NETWORK_DEVICES.find((d) => d.id === link.from);
      const toDev = NETWORK_DEVICES.find((d) => d.id === link.to);
      if (!fromDev || !toDev) return;

      const p1 = new THREE.Vector3(fromDev.position[0], fromDev.position[1] + 0.3, fromDev.position[2]);
      const p2 = new THREE.Vector3(toDev.position[0], toDev.position[1] + 0.3, toDev.position[2]);

      // Create a smooth curved cable dip / curve
      const midPoint = new THREE.Vector3()
        .addVectors(p1, p2)
        .multiplyScalar(0.5);
      midPoint.y = Math.min(p1.y, p2.y) - 0.25; // Slight realistic cable sag

      const curve = new THREE.CatmullRomCurve3([p1, midPoint, p2]);
      const tubeGeo = new THREE.TubeGeometry(curve, 48, 0.05, 12, false);

      let cableColor = 0x06b6d4; // Cyan healthy
      if (scenario === 'degraded') cableColor = 0xf59e0b;
      if (scenario === 'packet_loss' && link.id === 'link-router-gateway') cableColor = 0xef4444;

      const tubeMat = new THREE.MeshStandardMaterial({
        color: cableColor,
        emissive: cableColor,
        emissiveIntensity: 0.6,
        roughness: 0.3,
        transparent: true,
        opacity: 0.85,
      });

      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      scene.add(tubeMesh);
      linkCurves.push({ id: link.id, curve, tubeMesh, from: link.from, to: link.to });

      // Ambient particle pulses along cable
      const particleCount = 20;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        const t = i / particleCount;
        const pt = curve.getPoint(t);
        positions[i * 3] = pt.x;
        positions[i * 3 + 1] = pt.y;
        positions[i * 3 + 2] = pt.z;
      }
      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      // Particle material with soft circle texture
      const pCanvas = document.createElement('canvas');
      pCanvas.width = 64;
      pCanvas.height = 64;
      const pCtx = pCanvas.getContext('2d');
      if (pCtx) {
        const grad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.3, '#34d399');
        grad.addColorStop(1, 'rgba(6, 182, 212, 0)');
        pCtx.fillStyle = grad;
        pCtx.fillRect(0, 0, 64, 64);
      }
      const pTexture = new THREE.CanvasTexture(pCanvas);

      const pMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.28,
        map: pTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const pMesh = new THREE.Points(particleGeo, pMat);
      pMesh.userData = { curve, offsets: Array.from({ length: particleCount }, (_, i) => i / particleCount) };
      scene.add(pMesh);
      ambientParticles.push(pMesh);
    });

    return { linkCurves, ambientParticles };
  };

  // Build Educational Traveling Packet
  const buildEducationalPacket = (): THREE.Group => {
    const packetGroup = new THREE.Group();

    // Glowing core box
    const coreGeo = new THREE.BoxGeometry(0.32, 0.32, 0.32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: 0x10b981,
      emissiveIntensity: 1.8,
      roughness: 0.1,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    packetGroup.add(coreMesh);

    // Glowing halo ring
    const ringGeo = new THREE.TorusGeometry(0.28, 0.04, 12, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.85,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    packetGroup.add(ringMesh);

    // Trailing glow tail particles
    const tailCount = 8;
    const tailPositions = new Float32Array(tailCount * 3);
    const tailGeo = new THREE.BufferGeometry();
    tailGeo.setAttribute('position', new THREE.BufferAttribute(tailPositions, 3));
    const tailMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 0.2,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const tailPoints = new THREE.Points(tailGeo, tailMat);
    packetGroup.add(tailPoints);

    packetGroup.position.set(-6.2, 0.6, 1.2);
    return packetGroup;
  };

  // Initialize Three.js scene
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 500;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0f17); // Dark graphite
    scene.fog = new THREE.FogExp2(0x0b0f17, 0.028);

    // Camera
    const initialCamPos = new THREE.Vector3(0, 8.5, 14);
    const initialCamLookAt = new THREE.Vector3(0.5, 0, 0);
    const initialFov = 38;

    const camera = new THREE.PerspectiveCamera(initialFov, width / height, 0.1, 100);
    camera.position.copy(initialCamPos);
    camera.lookAt(initialCamLookAt);

    // Spring physics solvers for camera position, lookAt target, and FOV
    const posSpring = new Vector3Spring(initialCamPos, SPRING_PRESETS.aerialOverview);
    const lookAtSpring = new Vector3Spring(initialCamLookAt, SPRING_PRESETS.aerialOverview);
    const fovSpring = new ScalarSpring(initialFov, SPRING_PRESETS.fovSpring);

    // Renderer with high performance & crisp antialiasing
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x334155, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight1.position.set(10, 18, 12);
    dirLight1.castShadow = true;
    dirLight1.shadow.mapSize.width = 1024;
    dirLight1.shadow.mapSize.height = 1024;
    scene.add(dirLight1);

    // Cyan & Emerald accent lights
    const cyanLight = new THREE.PointLight(0x06b6d4, 3.5, 20);
    cyanLight.position.set(-2, 4, 2);
    scene.add(cyanLight);

    const emeraldLight = new THREE.PointLight(0x10b981, 3.5, 20);
    emeraldLight.position.set(4, 4, 2);
    scene.add(emeraldLight);

    // Technical Grid Floor
    const gridHelper = new THREE.GridHelper(36, 36, 0x1e293b, 0x111e2f);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    // Floor plane with soft dark reflection
    const floorGeo = new THREE.PlaneGeometry(60, 60);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x090d15,
      roughness: 0.6,
      metalness: 0.4,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -0.02;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Devices Map
    const deviceMeshes = new Map<string, THREE.Group>();
    NETWORK_DEVICES.forEach((device) => {
      const model = buildDeviceModel(device);
      scene.add(model);
      deviceMeshes.set(device.id, model);
    });

    // Network Links & Ambient Particles
    const { linkCurves, ambientParticles } = buildNetworkLinks(scene);

    // Educational Packet Mesh
    const educationalPacketMesh = buildEducationalPacket();
    scene.add(educationalPacketMesh);

    // Raycaster for user interactions
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const clock = new THREE.Clock();

    sceneStateRef.current = {
      scene,
      camera,
      renderer,
      deviceMeshes,
      linkCurves,
      ambientParticles,
      educationalPacketMesh,
      raycaster,
      mouse,
      posSpring,
      lookAtSpring,
      fovSpring,
      isDragging: false,
      previousMousePosition: { x: 0, y: 0 },
      orbitRotation: { x: 0, y: 0 },
      packetProgress: 0,
      packetSpeed: 0.12,
      animFrameId: 0,
      clock,
      hoveredMeshId: null,
    };

    // Resize Observer
    const handleResize = () => {
      if (!containerRef.current || !sceneStateRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      if (w === 0 || h === 0) return;
      sceneStateRef.current.camera.aspect = w / h;
      sceneStateRef.current.camera.updateProjectionMatrix();
      sceneStateRef.current.renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    // Animation Loop
    const animate = () => {
      const state = sceneStateRef.current;
      if (!state) return;

      const delta = state.clock.getDelta();
      const time = state.clock.getElapsedTime();

      // Update spring-physics solvers for tactile camera transition
      const isFovActive = state.fovSpring.update(delta);
      state.posSpring.update(delta);
      state.lookAtSpring.update(delta);

      // Apply camera spring position + subtle user orbit drag rotation
      state.camera.position.copy(state.posSpring.current);
      state.camera.position.x += Math.sin(state.orbitRotation.y) * 0.12;
      state.camera.position.y += state.orbitRotation.x * 0.06;

      // Update camera FOV with spring easing
      if (isFovActive || Math.abs(state.camera.fov - state.fovSpring.current) > 0.01) {
        state.camera.fov = state.fovSpring.current;
        state.camera.updateProjectionMatrix();
      }

      // Smoothly direct camera toward spring lookAt target
      state.camera.lookAt(state.lookAtSpring.current);

      // Apply subtle orbit rotation offset
      state.camera.position.x += Math.sin(state.orbitRotation.y) * 0.1;
      state.camera.position.y += state.orbitRotation.x * 0.05;

      // Animate ambient link particles
      state.ambientParticles.forEach((pMesh) => {
        const curve = pMesh.userData.curve as THREE.CatmullRomCurve3;
        const offsets = pMesh.userData.offsets as number[];
        const posAttr = pMesh.geometry.attributes.position as THREE.BufferAttribute;

        if (!isPaused) {
          for (let i = 0; i < offsets.length; i++) {
            offsets[i] = (offsets[i] + delta * 0.25) % 1;
            const pt = curve.getPoint(offsets[i]);
            posAttr.setXYZ(i, pt.x, pt.y, pt.z);
          }
          posAttr.needsUpdate = true;
        }
      });

      // Animate Educational Packet through network path
      if (!isPaused && state.linkCurves.length > 0) {
        state.packetProgress = (state.packetProgress + delta * state.packetSpeed) % 1;

        // Path across the 4 links in sequence
        const totalLinks = state.linkCurves.length;
        const segmentProgress = state.packetProgress * totalLinks;
        const currentLinkIdx = Math.min(Math.floor(segmentProgress), totalLinks - 1);
        const subProgress = segmentProgress - currentLinkIdx;

        const activeLink = state.linkCurves[currentLinkIdx];
        if (activeLink && activeLink.curve) {
          const pt = activeLink.curve.getPoint(subProgress);
          state.educationalPacketMesh.position.set(pt.x, pt.y + 0.15, pt.z);

          // Rotate core
          state.educationalPacketMesh.rotation.y += delta * 3;
          state.educationalPacketMesh.rotation.x += delta * 2;
        }
      }

      // Animate subtle device floats and LED flickers
      state.deviceMeshes.forEach((mesh, id) => {
        const initialY = NETWORK_DEVICES.find((d) => d.id === id)?.position[1] || 0;
        mesh.position.y = initialY + Math.sin(time * 2 + id.charCodeAt(0)) * 0.03;
      });

      // Render
      state.renderer.render(state.scene, state.camera);

      // Project 3D HUD tag positions to 2D screen coordinates
      const currentWidth = containerRef.current?.clientWidth || width;
      const currentHeight = containerRef.current?.clientHeight || height;
      const newHudPositions: { [key: string]: ProjectedHudData } = {};
      EDUCATIONAL_PACKETS.forEach((pkt) => {
        const worldPos = new THREE.Vector3();
        if (pkt.id === 'pkt-dns') worldPos.set(-2.8, 2.2, -0.4);
        else if (pkt.id === 'pkt-tcp-syn') worldPos.set(0.8, 2.4, 0.4);
        else if (pkt.id === 'pkt-ip') worldPos.set(4.4, 2.3, -0.6);
        else if (pkt.id === 'pkt-http3') worldPos.set(8.0, 2.6, 0.6);

        const projected = worldPos.clone().project(state.camera);
        const isVisible = projected.z < 1;
        const screenX = ((projected.x + 1) * currentWidth) / 2;
        const screenY = ((-projected.y + 1) * currentHeight) / 2;

        newHudPositions[pkt.id] = {
          x: screenX,
          y: screenY,
          visible: isVisible,
          label: pkt.label,
          details: pkt.details,
        };
      });
      setProjectedHudPositions(newHudPositions);

      state.animFrameId = requestAnimationFrame(animate);
    };

    if (sceneStateRef.current) {
      sceneStateRef.current.animFrameId = requestAnimationFrame(animate);
    }

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      if (sceneStateRef.current) {
        cancelAnimationFrame(sceneStateRef.current.animFrameId);
        sceneStateRef.current.renderer.dispose();
      }
    };
  }, [isPaused, scenario]);

  // Update Camera Target / Choreography with spring physics when stage, scroll, or overrides change
  useEffect(() => {
    const state = sceneStateRef.current;
    if (!state) return;

    // 1. If an individual device is explicitly selected, spring focus to that device
    if (selectedDeviceId) {
      const device = NETWORK_DEVICES.find((d) => d.id === selectedDeviceId);
      if (device) {
        const [dx, dy, dz] = device.position;
        const targetPos = new THREE.Vector3(dx, dy + 2.8, dz + 5.2);
        const targetLookAt = new THREE.Vector3(dx, dy + 0.3, dz);

        state.posSpring.setConfig(SPRING_PRESETS.tactileMacro);
        state.lookAtSpring.setConfig(SPRING_PRESETS.tactileMacro);
        state.posSpring.setTarget(targetPos);
        state.lookAtSpring.setTarget(targetLookAt);
        state.fovSpring.setTarget(31);
        return;
      }
    }

    // 2. If explicit camera overrides are provided, use them
    if (cameraPositionOverride && cameraTargetOverride) {
      state.posSpring.setConfig(SPRING_PRESETS.standard);
      state.lookAtSpring.setConfig(SPRING_PRESETS.standard);
      state.posSpring.setTarget(new THREE.Vector3(...cameraPositionOverride));
      state.lookAtSpring.setTarget(new THREE.Vector3(...cameraTargetOverride));
      state.fovSpring.setTarget(36);
      return;
    }

    // 3. Otherwise, use continuous scroll-synchronized camera interpolation
    const targetPos = new THREE.Vector3(...scrollSync.cameraPosition);
    const targetLookAt = new THREE.Vector3(...scrollSync.cameraLookAt);
    const targetFov = scrollSync.cameraFov;

    if (scrollSync.activeStage === 'Packet Inspection') {
      state.posSpring.setConfig(SPRING_PRESETS.tactileMacro);
      state.lookAtSpring.setConfig(SPRING_PRESETS.tactileMacro);
    } else if (scrollSync.activeStage === 'Network Overview') {
      state.posSpring.setConfig(SPRING_PRESETS.aerialOverview);
      state.lookAtSpring.setConfig(SPRING_PRESETS.aerialOverview);
    } else {
      state.posSpring.setConfig(SPRING_PRESETS.standard);
      state.lookAtSpring.setConfig(SPRING_PRESETS.standard);
    }

    state.posSpring.setTarget(targetPos);
    state.lookAtSpring.setTarget(targetLookAt);
    state.fovSpring.setTarget(targetFov);
  }, [
    cameraPositionOverride,
    cameraTargetOverride,
    currentStageId,
    selectedDeviceId,
    scrollSync.cameraPosition,
    scrollSync.cameraLookAt,
    scrollSync.cameraFov,
    scrollSync.activeStage,
  ]);

  // Update link colors based on scenario (healthy, degraded, packet_loss)
  useEffect(() => {
    const state = sceneStateRef.current;
    if (!state) return;

    state.linkCurves.forEach((l) => {
      const mat = l.tubeMesh.material as THREE.MeshStandardMaterial;
      if (scenario === 'healthy') {
        mat.color.setHex(0x06b6d4);
        mat.emissive.setHex(0x06b6d4);
      } else if (scenario === 'degraded') {
        mat.color.setHex(0xf59e0b);
        mat.emissive.setHex(0xf59e0b);
      } else if (scenario === 'packet_loss' && l.id === 'link-router-gateway') {
        mat.color.setHex(0xef4444);
        mat.emissive.setHex(0xef4444);
      }
    });
  }, [scenario]);

  // Mouse & Touch Drag Interaction Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sceneStateRef.current) return;
    sceneStateRef.current.isDragging = true;
    sceneStateRef.current.previousMousePosition = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const state = sceneStateRef.current;
    if (!state || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    state.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    state.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    // Handle Drag Orbiting
    if (state.isDragging) {
      const deltaX = e.clientX - state.previousMousePosition.x;
      const deltaY = e.clientY - state.previousMousePosition.y;

      state.orbitRotation.y += deltaX * 0.005;
      state.orbitRotation.x = Math.max(-0.5, Math.min(0.5, state.orbitRotation.x + deltaY * 0.005));

      state.previousMousePosition = { x: e.clientX, y: e.clientY };
    }

    // Raycast for hover device
    state.raycaster.setFromCamera(state.mouse, state.camera);
    const meshes: THREE.Object3D[] = [];
    state.deviceMeshes.forEach((group) => meshes.push(...group.children));
    const intersects = state.raycaster.intersectObjects(meshes, true);

    if (intersects.length > 0) {
      let topGroup: THREE.Object3D | null = intersects[0].object;
      while (topGroup && !topGroup.userData.deviceId && topGroup.parent) {
        topGroup = topGroup.parent;
      }
      if (topGroup && topGroup.userData.device) {
        if (state.hoveredMeshId !== topGroup.userData.deviceId) {
          state.hoveredMeshId = topGroup.userData.deviceId;
          onHoverDevice?.(topGroup.userData.device);
        }
        return;
      }
    }

    if (state.hoveredMeshId) {
      state.hoveredMeshId = null;
      onHoverDevice?.(null);
    }
  };

  const handleMouseUp = () => {
    if (sceneStateRef.current) {
      sceneStateRef.current.isDragging = false;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    const state = sceneStateRef.current;
    if (!state || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    state.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    state.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    state.raycaster.setFromCamera(state.mouse, state.camera);
    const meshes: THREE.Object3D[] = [];
    state.deviceMeshes.forEach((group) => meshes.push(...group.children));
    const intersects = state.raycaster.intersectObjects(meshes, true);

    if (intersects.length > 0) {
      let topGroup: THREE.Object3D | null = intersects[0].object;
      while (topGroup && !topGroup.userData.deviceId && topGroup.parent) {
        topGroup = topGroup.parent;
      }
      if (topGroup && topGroup.userData.device) {
        onSelectDevice?.(topGroup.userData.device);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      id="hero-3d-network-observatory"
      className="relative w-full h-full min-h-[480px] lg:min-h-[580px] cursor-grab active:cursor-grabbing select-none overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
      role="region"
      aria-label="Interactive 3D Network Topology Simulator"
    >
      {/* Three.js Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Floating 3D Projected Protocol Inspection Tags (Staggered Sequence Controller) */}
      {(Object.entries(projectedHudPositions) as [string, ProjectedHudData][]).map(([id, hud]) => {
        if (!hud.visible) return null;

        // Retrieve sequence-based transition state
        let protoState = scrollSync.protocols.dns;
        if (id === 'pkt-tcp-syn') protoState = scrollSync.protocols.tcp;
        else if (id === 'pkt-ip') protoState = scrollSync.protocols.ip;
        else if (id === 'pkt-http3') protoState = scrollSync.protocols.http3;

        if (protoState.opacity < 0.02) return null;

        return (
          <div
            key={id}
            id={`packet-hud-${id}`}
            style={{
              transform: `translate(${hud.x - 90}px, ${hud.y - 120 + protoState.translateY}px) scale(${protoState.scale})`,
              opacity: protoState.opacity,
              transition: 'opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onClick={(e) => {
              e.stopPropagation();
              onPacketClick?.(id);
            }}
            className={`absolute top-0 left-0 ${
              protoState.opacity > 0.1 ? 'pointer-events-auto cursor-pointer' : 'pointer-events-none'
            } transition-all duration-200 hover:scale-105`}
          >
            {/* Tag Card Box */}
            <div
              className={`bg-[#0b1320]/95 backdrop-blur-md border ${
                protoState.isActive
                  ? 'border-[#06b6d4] shadow-[0_0_25px_rgba(6,182,212,0.35)] ring-1 ring-[#06b6d4]/40'
                  : 'border-[#06b6d4]/40 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
              } rounded-lg p-2.5 text-[11px] font-mono min-w-[175px]`}
            >
              <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#34d399] font-bold tracking-wider">{hud.label}</span>
                  {protoState.isActive && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#0284c7]/20 text-[#38bdf8] font-semibold">
                      {protoState.name}
                    </span>
                  )}
                </div>
                <span className={`w-1.5 h-1.5 rounded-full ${protoState.isActive ? 'bg-[#10b981] animate-ping' : 'bg-slate-500'}`} />
              </div>
              <div className="space-y-0.5 text-slate-300 text-[10px]">
                {Object.entries(hud.details).slice(0, 3).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-2">
                    <span className="text-slate-500">{k}:</span>
                    <span className="text-slate-200 font-semibold">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Downward connecting line/pointer */}
            <div
              className={`w-[1px] h-6 ${
                protoState.isActive
                  ? 'bg-gradient-to-b from-[#06b6d4] to-transparent'
                  : 'bg-gradient-to-b from-[#06b6d4]/50 to-transparent'
              } mx-auto`}
            />
          </div>
        );
      })}

      {/* Ambient Floor Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0b0f17] via-transparent to-transparent opacity-80" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#0b0f17]/60 via-transparent to-[#0b0f17]/60" />
    </div>
  );
};

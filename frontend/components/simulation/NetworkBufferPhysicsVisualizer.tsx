'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Layers,
  Flame,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  NetworkPhysicsWorld,
  SwitchBufferSimulation,
  QueueDiscipline,
  QueuePacket,
} from '@/lib/physicsEngine';
import { SoundFx } from '@/lib/soundFx';

export const NetworkBufferPhysicsVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [discipline, setDiscipline] = useState<QueueDiscipline>('FIFO_TAIL_DROP');
  const [bufferCapacity, setBufferCapacity] = useState<number>(32);
  const [packetRate, setPacketRate] = useState<number>(15); // packets per second
  const [egressRate, setEgressRate] = useState<number>(10); // packets drained per second
  const [selectedMedium, setSelectedMedium] = useState<'COPPER' | 'FIBER' | 'SATELLITE' | 'UNDERSEA'>('FIBER');
  
  // Real-time telemetry states
  const [currentOccupancy, setCurrentOccupancy] = useState<number>(0);
  const [droppedCount, setDroppedCount] = useState<number>(0);
  const [forwardedCount, setForwardedCount] = useState<number>(0);
  const [avgDelayMs, setAvgDelayMs] = useState<number>(0);
  const [lastDropReason, setLastDropReason] = useState<string | null>(null);

  const physicsWorldRef = useRef<NetworkPhysicsWorld | null>(null);
  const bufferSimRef = useRef<SwitchBufferSimulation>(new SwitchBufferSimulation(32, 'FIFO_TAIL_DROP'));

  // Initialize Physics World Topology
  useEffect(() => {
    const world = new NetworkPhysicsWorld({
      bounds: { minX: 40, maxX: 740, minY: 40, maxY: 380 },
      gravityCenter: { x: 390, y: 200, strength: 0.003 },
    });

    world.addNode({ id: 'src1', x: 100, y: 100, vx: 0, vy: 0, mass: 1.5, radius: 24 });
    world.addNode({ id: 'src2', x: 100, y: 300, vx: 0, vy: 0, mass: 1.5, radius: 24 });
    world.addNode({ id: 'switch', x: 390, y: 200, vx: 0, vy: 0, mass: 3.0, radius: 32 });
    world.addNode({ id: 'dst1', x: 680, y: 150, vx: 0, vy: 0, mass: 1.5, radius: 24 });
    world.addNode({ id: 'dst2', x: 680, y: 270, vx: 0, vy: 0, mass: 1.5, radius: 24 });

    world.addLink({ sourceId: 'src1', targetId: 'switch', length: 180, stiffness: 0.05, bandwidthMbps: 1000, latencyMs: 2, packetLossRate: 0 });
    world.addLink({ sourceId: 'src2', targetId: 'switch', length: 180, stiffness: 0.05, bandwidthMbps: 1000, latencyMs: 2, packetLossRate: 0 });
    world.addLink({ sourceId: 'switch', targetId: 'dst1', length: 180, stiffness: 0.05, bandwidthMbps: 100, latencyMs: 5, packetLossRate: 0 });
    world.addLink({ sourceId: 'switch', targetId: 'dst2', length: 180, stiffness: 0.05, bandwidthMbps: 100, latencyMs: 5, packetLossRate: 0 });

    physicsWorldRef.current = world;
  }, []);

  // Update Buffer Policy
  useEffect(() => {
    bufferSimRef.current.discipline = discipline;
    bufferSimRef.current.maxBufferPackets = bufferCapacity;
  }, [discipline, bufferCapacity]);

  // Main Physics Simulation and Animation Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    let packetTimer = 0;
    let drainTimer = 0;

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const canvas = canvasRef.current;
      if (canvas && isPlaying) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const dpr = window.devicePixelRatio || 1;
          const rect = canvas.getBoundingClientRect();
          canvas.width = rect.width * dpr;
          canvas.height = rect.height * dpr;
          ctx.scale(dpr, dpr);

          // Step Physics World
          if (physicsWorldRef.current) {
            physicsWorldRef.current.step(dt);
          }

          // Packet Arrival Generation (Poisson / Rate Interval)
          packetTimer += dt;
          const packetInterval = 1 / packetRate;
          if (packetTimer >= packetInterval) {
            packetTimer = 0;
            const protos = ['HTTPS', 'DNS', 'TCP SYN', 'VOIP', 'ICMP'];
            const chosenProto = protos[Math.floor(Math.random() * protos.length)];
            const isVoip = chosenProto === 'VOIP';

            const newPkt: QueuePacket = {
              id: `pkt-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
              sizeBytes: isVoip ? 160 : 1460,
              priority: isVoip ? 'HIGH' : chosenProto === 'HTTPS' ? 'MEDIUM' : 'LOW',
              timestamp: Date.now(),
              protocol: chosenProto,
              color: isVoip ? '#ec4899' : chosenProto === 'HTTPS' ? '#00f0ff' : '#10b981',
            };

            const res = bufferSimRef.current.enqueue(newPkt);
            if (res.accepted) {
              SoundFx.playPacketDispatch();
            } else {
              setLastDropReason(res.reason || 'Buffer Full');
              SoundFx.playPacketDrop();
            }
          }

          // Packet Egress Draining (Switch interface serialization)
          drainTimer += dt;
          const drainInterval = 1 / egressRate;
          if (drainTimer >= drainInterval) {
            drainTimer = 0;
            const drained = bufferSimRef.current.dequeue();
            if (drained) {
              SoundFx.playHopForward();
            }
          }

          // Update Telemetry States
          const qLen = bufferSimRef.current.queue.length;
          setCurrentOccupancy(Math.round((qLen / bufferCapacity) * 100));
          setDroppedCount(bufferSimRef.current.droppedCount);
          setForwardedCount(bufferSimRef.current.forwardedCount);
          setAvgDelayMs(Math.round((qLen / egressRate) * 1000));

          // Draw Canvas: Links
          ctx.clearRect(0, 0, rect.width, rect.height);
          if (physicsWorldRef.current) {
            for (const link of physicsWorldRef.current.links) {
              const src = physicsWorldRef.current.nodes.get(link.sourceId);
              const dst = physicsWorldRef.current.nodes.get(link.targetId);
              if (!src || !dst) continue;

              // Elastic Spring Line
              ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(src.x, src.y);
              ctx.lineTo(dst.x, dst.y);
              ctx.stroke();

              // Moving Physical Carrier Particles (Speed based on medium)
              const speedMultiplier = selectedMedium === 'FIBER' ? 1.5 : selectedMedium === 'COPPER' ? 1.0 : selectedMedium === 'UNDERSEA' ? 0.6 : 0.2;
              const linkProgress = ((time / 1000) * speedMultiplier) % 1;
              const px = src.x + (dst.x - src.x) * linkProgress;
              const py = src.y + (dst.y - src.y) * linkProgress;

              ctx.fillStyle = selectedMedium === 'FIBER' ? '#00f0ff' : '#f59e0b';
              ctx.shadowColor = ctx.fillStyle;
              ctx.shadowBlur = 8;
              ctx.beginPath();
              ctx.arc(px, py, 3, 0, Math.PI * 2);
              ctx.fill();
              ctx.shadowBlur = 0;
            }

            // Draw Canvas: Nodes
            for (const node of Array.from(physicsWorldRef.current.nodes.values())) {
              ctx.fillStyle = node.id === 'switch' ? '#1e1b4b' : '#0f172a';
              ctx.strokeStyle = node.id === 'switch' ? '#818cf8' : '#00f0ff';
              ctx.lineWidth = node.id === 'switch' ? 3 : 2;

              ctx.beginPath();
              ctx.arc(node.x, node.y, node.radius || 24, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();

              // Node Label
              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 10px monospace';
              ctx.textAlign = 'center';
              ctx.fillText(node.id.toUpperCase(), node.x, node.y + 4);
            }
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, packetRate, egressRate, bufferCapacity, selectedMedium]);

  const handleBurst = () => {
    for (let i = 0; i < 8; i++) {
      const newPkt: QueuePacket = {
        id: `burst-${Date.now()}-${i}`,
        sizeBytes: 1500,
        priority: 'MEDIUM',
        timestamp: Date.now(),
        protocol: 'TCP BURST',
        color: '#f43f5e',
      };
      bufferSimRef.current.enqueue(newPkt);
    }
    SoundFx.playPacketDispatch();
  };

  const handleReset = () => {
    bufferSimRef.current.resetStats();
    setDroppedCount(0);
    setForwardedCount(0);
    setLastDropReason(null);
  };

  return (
    <div className="w-full rounded-3xl bg-[#09090b] border border-[#272732] overflow-hidden flex flex-col shadow-2xl">
      {/* Top Header */}
      <div className="px-6 py-4 border-b border-[#272732] bg-[#121217] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff]">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-wider font-semibold">
                Version 4.1 Physics Engine
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                60 FPS Newtonian Simulation
              </span>
            </div>
            <h2 className="text-base sm:text-xl font-bold text-white tracking-tight">
              Switch Buffer Queue Dynamics & Propagation Physics
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            leftIcon={isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          >
            {isPlaying ? 'Pause Engine' : 'Resume Engine'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleBurst}
            leftIcon={<Flame className="w-3.5 h-3.5 text-rose-400" />}
          >
            Inject 8-Packet Burst
          </Button>

          <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset
          </Button>
        </div>
      </div>

      {/* Main Grid: Interactive Canvas (Left) & Buffer Physics Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#272732]">
        {/* Left 7 Cols: Physics Force-Directed Canvas */}
        <div className="lg:col-span-7 p-4 bg-[#0c0c12] relative flex flex-col items-center justify-center min-h-[380px]">
          <canvas ref={canvasRef} className="w-full h-full min-h-[360px] rounded-2xl block" />

          {/* Floating Medium Selector Badge */}
          <div className="absolute bottom-4 left-4 flex bg-black/60 backdrop-blur-md p-1 rounded-xl border border-[#272732] gap-1">
            {(['FIBER', 'COPPER', 'UNDERSEA', 'SATELLITE'] as const).map((med) => (
              <button
                key={med}
                onClick={() => setSelectedMedium(med)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                  selectedMedium === med
                    ? 'bg-[#00f0ff] text-black shadow-glow-cyan'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {med}
              </button>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: Switch Buffer Queue Inspector */}
        <div className="lg:col-span-5 p-5 bg-[#09090b] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#272732]">
            <span className="text-xs font-mono font-bold text-zinc-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#00f0ff]" /> Switch Memory Buffer Queue
            </span>
            <span
              className={`text-[11px] font-mono font-bold ${
                currentOccupancy > 80 ? 'text-rose-400' : currentOccupancy > 50 ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {currentOccupancy}% Occupied ({bufferSimRef.current.queue.length}/{bufferCapacity} Pkts)
            </span>
          </div>

          {/* Visual Buffer Slot Matrix */}
          <div className="p-3 rounded-2xl bg-[#121217] border border-[#272732] flex flex-col gap-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
              <span>Ingress Head</span>
              <span>Egress Tail</span>
            </div>

            <div className="grid grid-cols-8 gap-1.5 p-2 rounded-xl bg-black/40 border border-[#272732]/60 min-h-[64px] items-center">
              {Array.from({ length: bufferCapacity }).map((_, idx) => {
                const pkt = bufferSimRef.current.queue[idx];
                return (
                  <div
                    key={idx}
                    className={`h-6 rounded-md border flex items-center justify-center text-[9px] font-mono transition-all ${
                      pkt
                        ? 'border-transparent shadow-sm'
                        : 'border-zinc-800/80 bg-zinc-900/30 text-zinc-700'
                    }`}
                    style={pkt ? { backgroundColor: pkt.color, color: '#000000', fontWeight: 'bold' } : {}}
                    title={pkt ? `${pkt.protocol} (${pkt.sizeBytes} B)` : 'Empty Buffer Slot'}
                  >
                    {pkt ? pkt.protocol.substring(0, 3) : idx + 1}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Queue Discipline Controls */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono text-zinc-400 block mb-1">Queue Discipline</label>
              <select
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value as QueueDiscipline)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-[#14141d] border border-[#272732] text-xs font-mono text-[#00f0ff] focus:outline-none"
              >
                <option value="FIFO_TAIL_DROP">FIFO Tail-Drop</option>
                <option value="RED">Random Early Detection (RED)</option>
                <option value="PRIORITY_QUEUING">Strict Priority Queuing (PQ)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono text-zinc-400 block mb-1">Buffer Size ({bufferCapacity} Pkts)</label>
              <input
                type="range"
                min="8"
                max="48"
                step="4"
                value={bufferCapacity}
                onChange={(e) => setBufferCapacity(Number(e.target.value))}
                className="w-full accent-[#00f0ff]"
              />
            </div>
          </div>

          {/* Traffic Rates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono text-zinc-400 block mb-1">Ingress Rate: {packetRate} pps</label>
              <input
                type="range"
                min="2"
                max="35"
                value={packetRate}
                onChange={(e) => setPacketRate(Number(e.target.value))}
                className="w-full accent-rose-400"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-zinc-400 block mb-1">Egress Drain: {egressRate} pps</label>
              <input
                type="range"
                min="2"
                max="35"
                value={egressRate}
                onChange={(e) => setEgressRate(Number(e.target.value))}
                className="w-full accent-emerald-400"
              />
            </div>
          </div>

          {/* Telemetry Dashboard Counters */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#272732]">
            <div className="p-2.5 rounded-xl bg-[#121217] border border-[#272732] flex flex-col">
              <span className="text-[9px] font-mono text-zinc-500 uppercase">Forwarded</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">{forwardedCount} pkts</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#121217] border border-[#272732] flex flex-col">
              <span className="text-[9px] font-mono text-zinc-500 uppercase">Dropped</span>
              <span className="text-sm font-bold text-rose-400 font-mono">{droppedCount} pkts</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#121217] border border-[#272732] flex flex-col">
              <span className="text-[9px] font-mono text-zinc-500 uppercase">Queue Delay</span>
              <span className="text-sm font-bold text-[#00f0ff] font-mono">{avgDelayMs} ms</span>
            </div>
          </div>

          {/* Last Drop Reason Log */}
          {lastDropReason && (
            <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-500/30 text-[11px] font-mono text-rose-300 flex items-center gap-2 animate-in fade-in">
              <Activity className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>{lastDropReason}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

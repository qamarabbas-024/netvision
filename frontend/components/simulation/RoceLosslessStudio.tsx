'use client';

import React, { useState } from 'react';
import {
  Cpu,
  Activity,
  Layers,
  CheckCircle2,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  RoceFabricEngine,
  RoceFabricState,
} from '@/lib/rocev2Engine';
import { SoundFx } from '@/lib/soundFx';

export const RoceLosslessStudio: React.FC = () => {
  const [fabric, setFabric] = useState<RoceFabricState>(() =>
    RoceFabricEngine.getInitialState()
  );
  const [isTrainingBurst, setIsTrainingBurst] = useState<boolean>(false);
  const [allreduceLog, setAllreduceLog] = useState<string | null>(null);

  const handleDispatchAllReduce = () => {
    setIsTrainingBurst(true);
    SoundFx.playPacketDispatch();

    setFabric((prev) => ({
      ...prev,
      pfcPauseFramesGenerated: prev.pfcPauseFramesGenerated + 12,
      ecnNotifications: prev.ecnNotifications + 34,
      nodes: prev.nodes.map((node, idx) => ({
        ...node,
        pfcQueueActive: idx === 1 || idx === 2,
        congestionMarkedEcn: true,
        bufferOccupancyPct: 78,
      })),
    }));

    setTimeout(() => {
      setAllreduceLog(
        '⚡ AllReduce Collective Tensor Sync Complete across 32x H100 GPUs (1.75 TB gradient parameters). DCQCN throttled sender window; PFC Priority-3 absorbed microburst without a single packet drop.'
      );
      setIsTrainingBurst(false);
      SoundFx.playSuccessChime();
    }, 600);
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setFabric(RoceFabricEngine.getInitialState());
    setAllreduceLog(null);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                Version 7.1 AI Cluster Interconnect
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                RoCEv2 • PFC 802.1Qbb • DCQCN
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Lossless AI GPU Supercluster & RDMA Fabric Engine
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isTrainingBurst ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleDispatchAllReduce}
              leftIcon={<Zap className="w-3.5 h-3.5" />}
            >
              Dispatch LLM AllReduce Burst (1.75 TB)
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Syncing Tensors via RDMA...
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset Fabric
          </Button>
        </div>
      </div>

      {/* Main Grid: GPU Nodes (Left) & Lossless Physics & Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: GPU Nodes */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" /> GPU Supercluster Nodes (400G RoCEv2 Fabric)
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              Cluster Bandwidth: {fabric.totalBandwidthTbps} Tbps
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fabric.nodes.map((node) => (
              <div
                key={node.nodeId}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col gap-2 ${
                  node.pfcQueueActive
                    ? 'border-amber-400 bg-amber-950/20'
                    : 'border-[#262c42] bg-[#121522]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono">{node.nodeId}</span>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                      node.pfcQueueActive
                        ? 'bg-amber-950/60 text-amber-300 border-amber-500/40 animate-pulse'
                        : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {node.pfcQueueActive ? 'PFC PAUSE ACTIVE' : 'ZERO DROP TX'}
                  </span>
                </div>

                <span className="text-[10px] font-mono text-zinc-400">{node.gpuModel}</span>

                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-mono text-zinc-400">
                    <span>Buffer Occupancy:</span>
                    <span className={node.bufferOccupancyPct > 50 ? 'text-amber-300 font-bold' : 'text-emerald-400'}>
                      {node.bufferOccupancyPct}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-black/50 overflow-hidden">
                    <div
                      style={{ width: `${node.bufferOccupancyPct}%` }}
                      className={`h-full rounded-full transition-all ${
                        node.bufferOccupancyPct > 50 ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-zinc-400">
                  <div>Link: <span className="text-cyan-300">{node.transferRateGbps} Gbps</span></div>
                  <div>QP: <span className="text-purple-300">{node.rdmaQueuePair}</span></div>
                </div>
              </div>
            ))}
          </div>

          {allreduceLog && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs font-mono text-emerald-200 leading-relaxed animate-in fade-in">
              {allreduceLog}
            </div>
          )}
        </div>

        {/* Right 5 Cols: Lossless Physics Telemetry */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" /> Lossless Network Metrics
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">PFC Pause Frames</span>
              <span className="text-lg font-bold text-amber-400 font-mono mt-1">
                {fabric.pfcPauseFramesGenerated}
              </span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Priority 3 lossless flow</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">DCQCN ECN Marks</span>
              <span className="text-lg font-bold text-cyan-400 font-mono mt-1">
                {fabric.ecnNotifications}
              </span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Rate adjustment packets</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Why Lossless RoCEv2 is Critical for AI
            </div>
            <div>• GPU training stops if even 1 gradient packet is lost (AllReduce sync stall)</div>
            <div>• PFC pauses only congested priorities (e.g., Pri-3) without pausing best-effort traffic</div>
            <div>• DCQCN notifies sender NICs to throttle transmission rate before buffers overflow</div>
          </div>
        </div>
      </div>
    </div>
  );
};

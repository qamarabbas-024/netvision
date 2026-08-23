'use client';

import React, { useState } from 'react';
import {
  Server,
  Radio,
  Download,
  Copy,
  Check,
  Play,
  Cpu,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  HardwareBridgeEngine,
  ContainerlabNode,
} from '@/lib/hardwareBridgeEngine';
import { SoundFx } from '@/lib/soundFx';

export const HardwareBridgeStudio: React.FC = () => {
  const [activeFormat, setActiveFormat] = useState<'CLAB' | 'EVENG'>('CLAB');
  const [copied, setCopied] = useState<boolean>(false);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [bridgeConnected, setBridgeConnected] = useState<boolean>(false);

  const initialNodes: ContainerlabNode[] = [
    { name: 'spine-01', kind: 'ceos', image: 'ceos:4.30.0F', mgmtIpv4: '172.20.20.101', status: 'RUNNING', cpuPercent: 3.2, memoryMb: 1024, interfaces: ['eth1', 'eth2'] },
    { name: 'spine-02', kind: 'ceos', image: 'ceos:4.30.0F', mgmtIpv4: '172.20.20.102', status: 'RUNNING', cpuPercent: 2.8, memoryMb: 1024, interfaces: ['eth1', 'eth2'] },
    { name: 'leaf-01', kind: 'ceos', image: 'ceos:4.30.0F', mgmtIpv4: '172.20.20.111', status: 'RUNNING', cpuPercent: 4.1, memoryMb: 1024, interfaces: ['eth1', 'eth2', 'eth3'] },
    { name: 'leaf-02', kind: 'ceos', image: 'ceos:4.30.0F', mgmtIpv4: '172.20.20.112', status: 'RUNNING', cpuPercent: 3.9, memoryMb: 1024, interfaces: ['eth1', 'eth2', 'eth3'] },
    { name: 'host-client', kind: 'linux', image: 'alpine:latest', mgmtIpv4: '172.20.20.201', status: 'RUNNING', cpuPercent: 0.8, memoryMb: 128, interfaces: ['eth1'] },
    { name: 'host-server', kind: 'linux', image: 'nginx:alpine', mgmtIpv4: '172.20.20.202', status: 'RUNNING', cpuPercent: 1.1, memoryMb: 192, interfaces: ['eth1'] },
  ];

  const [fleetNodes] = useState<ContainerlabNode[]>(initialNodes);

  const getCode = () => {
    if (activeFormat === 'CLAB') {
      return HardwareBridgeEngine.generateContainerlabYaml('netvision-clos-fabric', fleetNodes);
    }
    return HardwareBridgeEngine.generateEveNgXml('netvision-clos-fabric', fleetNodes);
  };

  const handleCopy = () => {
    SoundFx.playTerminalKeyPress();
    navigator.clipboard.writeText(getCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    SoundFx.playTerminalKeyPress();
    const content = getCode();
    const filename = activeFormat === 'CLAB' ? 'topology.clab.yml' : 'topology.unl';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeployBridge = () => {
    setIsDeploying(true);
    SoundFx.playPacketDispatch();

    setTimeout(() => {
      SoundFx.playHopForward();
    }, 500);

    setTimeout(() => {
      setIsDeploying(false);
      setBridgeConnected(true);
      SoundFx.playSuccessChime();
    }, 1200);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00f0ff]">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
                Version 4.6 Hardware Bridge
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                Containerlab & EVE-NG Bridge
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Live Containerlab, Docker & Hardware Rack Bridge
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            leftIcon={<Download className="w-3.5 h-3.5 text-cyan-400" />}
          >
            Download {activeFormat === 'CLAB' ? '.clab.yml' : '.unl'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleDeployBridge}
            disabled={isDeploying}
            leftIcon={bridgeConnected ? <Zap className="w-3.5 h-3.5 text-emerald-400" /> : <Play className="w-3.5 h-3.5" />}
          >
            {isDeploying ? 'Deploying Containers...' : bridgeConnected ? 'Bridge Active (ws://9090)' : 'Connect Container Bridge'}
          </Button>
        </div>
      </div>

      {/* Main Grid: Topology Spec (Left) & Container Fleet Health (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: Schema Viewer */}
        <div className="lg:col-span-7 flex flex-col bg-[#0c0e17]">
          {/* Format Tabs Bar */}
          <div className="px-4 py-2 bg-[#121522] border-b border-[#202538] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {(['CLAB', 'EVENG'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => {
                    SoundFx.playTerminalKeyPress();
                    setActiveFormat(fmt);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                    activeFormat === fmt
                      ? 'bg-[#00f0ff] text-black shadow-glow-cyan'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {fmt === 'CLAB' ? 'Containerlab (.clab.yml)' : 'EVE-NG Blueprint (.unl)'}
                </button>
              ))}
            </div>

            <span className="text-[10px] font-mono text-zinc-500">6 Dockerized Nodes</span>
          </div>

          <pre className="p-4 text-xs font-mono text-cyan-300 leading-relaxed overflow-x-auto max-h-[420px] bg-[#08090f]">
            <code>{getCode()}</code>
          </pre>
        </div>

        {/* Right 5 Cols: Live Container Fleet Health */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Server className="w-4 h-4 text-[#00f0ff]" /> Live Container Daemon Status
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                bridgeConnected
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
              }`}
            >
              {bridgeConnected ? '6/6 Nodes Online' : 'Standby Mode'}
            </span>
          </div>

          {/* Node Cards */}
          <div className="space-y-2 max-h-[380px] overflow-y-auto">
            {fleetNodes.map((node) => (
              <div
                key={node.name}
                className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-[#00f0ff]">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5 font-mono">
                      {node.name}
                      <span className="text-[9px] px-1 py-0.2 rounded bg-zinc-800 text-zinc-400">
                        {node.kind}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400">{node.mgmtIpv4}</div>
                  </div>
                </div>

                <div className="text-right font-mono text-[10px]">
                  <div className="text-emerald-400 font-bold flex items-center justify-end gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {node.status}
                  </div>
                  <div className="text-zinc-500">
                    CPU: {node.cpuPercent}% | RAM: {node.memoryMb}MB
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

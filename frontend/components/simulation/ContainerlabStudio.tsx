'use client';

import React, { useState } from 'react';
import { Box, Copy, Download, Terminal, Server, Check, Play, RefreshCw, Cpu } from 'lucide-react';
import { generateContainerlabYaml, getSampleClabTopology, ClabNode, ClabLink } from '@/lib/containerlabEngine';

export const ContainerlabStudio: React.FC = () => {
  const [labName, setLabName] = useState<string>('netvision-spine-leaf');
  const [topology, setTopology] = useState<{ nodes: ClabNode[]; links: ClabLink[] }>(getSampleClabTopology());
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'yaml' | 'topology' | 'cli'>('yaml');

  const yamlOutput = generateContainerlabYaml(labName, topology.nodes, topology.links);

  const handleCopy = () => {
    navigator.clipboard.writeText(yamlOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([yamlOutput], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${labName}.clab.yml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="surface-1 rounded-2xl border border-[#2a2e39] p-6 text-[#f4f5f7] font-sans shadow-instrument flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2e39] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#22c55e]">
              EPOCH XI // REAL-WORLD NOS HARDWARE EMULATION
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Containerlab (clab) Topology Studio
          </h2>
          <p className="text-xs text-[#8e95a5]">
            Export NetVision topologies directly to production-grade Arista cEOS, Nokia SR Linux & Cisco 8000v containers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-[#1a1f2c] border border-[#2a2e39] hover:border-[#22c55e] text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer text-white"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy YAML'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg bg-[#22c55e] text-[#062817] hover:bg-[#16a34a] text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .clab.yml</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#2a2e39] pb-2 font-mono text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('yaml')}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
            activeTab === 'yaml' ? 'bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30' : 'text-[#8e95a5] hover:text-white'
          }`}
        >
          YAML Spec
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('topology')}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
            activeTab === 'topology' ? 'bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30' : 'text-[#8e95a5] hover:text-white'
          }`}
        >
          Node Inventory ({topology.nodes.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('cli')}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
            activeTab === 'cli' ? 'bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30' : 'text-[#8e95a5] hover:text-white'
          }`}
        >
          Deploy Commands
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'yaml' && (
        <div className="relative rounded-xl bg-[#090d14] border border-[#1e293b] p-4 font-mono text-xs text-[#38bdf8] overflow-x-auto leading-relaxed">
          <pre className="whitespace-pre">{yamlOutput}</pre>
        </div>
      )}

      {activeTab === 'topology' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {topology.nodes.map((node) => (
            <div key={node.name} className="p-3.5 rounded-xl bg-[#0f172a] border border-[#1e293b] flex flex-col gap-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{node.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30">
                  {node.kind}
                </span>
              </div>
              <div className="text-[11px] text-[#8e95a5]">
                <div>Image: <strong className="text-white">{node.image}</strong></div>
                <div>Mgmt IP: <strong className="text-[#38bdf8]">{node.mgmtIpv4}</strong></div>
                <div>Ports: <strong className="text-[#a855f7]">{node.interfaces.join(', ')}</strong></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'cli' && (
        <div className="rounded-xl bg-[#090d14] border border-[#1e293b] p-4 font-mono text-xs flex flex-col gap-3">
          <div className="text-xs text-[#8e95a5]">Deploy lab locally on Linux/Docker host:</div>
          <div className="p-3 rounded-lg bg-[#020617] border border-[#1e293b] text-[#22c55e] flex items-center justify-between">
            <code>sudo containerlab deploy --topo {labName}.clab.yml</code>
          </div>
          <div className="text-xs text-[#8e95a5]">Destroy and tear down container lab:</div>
          <div className="p-3 rounded-lg bg-[#020617] border border-[#1e293b] text-[#f87171] flex items-center justify-between">
            <code>sudo containerlab destroy --topo {labName}.clab.yml --cleanup</code>
          </div>
        </div>
      )}
    </div>
  );
};

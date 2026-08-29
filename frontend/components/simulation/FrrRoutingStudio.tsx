'use client';

import React, { useState } from 'react';
import { Server, Copy, Download, Terminal, Check, Network, ShieldCheck } from 'lucide-react';
import { generateFrrConf, generateFrrDaemonsFile, FrrRouterConfig } from '@/lib/frrConfigEngine';

export const FrrRoutingStudio: React.FC = () => {
  const [config, setConfig] = useState<FrrRouterConfig>({
    hostname: 'rtr-core-01',
    routerId: '10.0.0.1',
    daemons: {
      zebra: true,
      bgpd: true,
      ospfd: true,
      isisd: false,
      bfdd: true,
    },
    ospf: {
      area: '0.0.0.0',
      networks: ['10.0.1.0/24', '10.0.2.0/24'],
    },
    bgp: {
      asn: 65001,
      neighbors: [
        { ip: '10.0.1.2', remoteAsn: 65002 },
        { ip: '10.0.2.2', remoteAsn: 65003 },
      ],
    },
    interfaces: [
      { name: 'eth0', ipv4: '10.0.1.1/24', description: 'To-Leaf-01' },
      { name: 'eth1', ipv4: '10.0.2.1/24', description: 'To-Leaf-02' },
      { name: 'lo', ipv4: '10.0.0.1/32', description: 'Loopback0' },
    ],
  });

  const [activeTab, setActiveTab] = useState<'frr' | 'daemons' | 'vtysh'>('frr');
  const [copied, setCopied] = useState<boolean>(false);

  const frrConf = generateFrrConf(config);
  const daemonsConf = generateFrrDaemonsFile(config.daemons);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="surface-1 rounded-2xl border border-[#2a2e39] p-6 text-[#f4f5f7] font-sans shadow-instrument flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2e39] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#22c55e]">
              EPOCH XI // FREE RANGE ROUTING (FRR)
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            FRRouting Suite & Daemon Engine Studio
          </h2>
          <p className="text-xs text-[#8e95a5]">
            Generate Linux FRR production routing configurations with multi-protocol OSPF, BGP, and BFD integration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleCopy(activeTab === 'frr' ? frrConf : daemonsConf)}
            className="px-3 py-1.5 rounded-lg bg-[#1a1f2c] border border-[#2a2e39] hover:border-[#22c55e] text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer text-white"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Config'}</span>
          </button>
        </div>
      </div>

      {/* Daemon Toggles */}
      <div className="p-4 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-wrap items-center gap-4 font-mono text-xs">
        <span className="text-white font-bold">Active Daemons:</span>
        {(['zebra', 'ospfd', 'bgpd', 'isisd', 'bfdd'] as Array<keyof typeof config.daemons>).map((daemon) => (
          <label key={daemon} className="flex items-center gap-2 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={config.daemons[daemon]}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  daemons: { ...prev.daemons, [daemon]: e.target.checked },
                }))
              }
              className="accent-[#22c55e]"
            />
            <span className={config.daemons[daemon] ? 'text-[#22c55e] font-bold' : 'text-[#64748b]'}>
              {daemon}
            </span>
          </label>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#2a2e39] pb-2 font-mono text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('frr')}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
            activeTab === 'frr' ? 'bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30' : 'text-[#8e95a5] hover:text-white'
          }`}
        >
          /etc/frr/frr.conf
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('daemons')}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
            activeTab === 'daemons' ? 'bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30' : 'text-[#8e95a5] hover:text-white'
          }`}
        >
          /etc/frr/daemons
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('vtysh')}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
            activeTab === 'vtysh' ? 'bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30' : 'text-[#8e95a5] hover:text-white'
          }`}
        >
          vtysh Shell Preview
        </button>
      </div>

      {/* Output Console */}
      {activeTab === 'frr' && (
        <div className="rounded-xl bg-[#090d14] border border-[#1e293b] p-4 font-mono text-xs text-[#38bdf8] overflow-x-auto">
          <pre className="whitespace-pre">{frrConf}</pre>
        </div>
      )}

      {activeTab === 'daemons' && (
        <div className="rounded-xl bg-[#090d14] border border-[#1e293b] p-4 font-mono text-xs text-[#22c55e] overflow-x-auto">
          <pre className="whitespace-pre">{daemonsConf}</pre>
        </div>
      )}

      {activeTab === 'vtysh' && (
        <div className="rounded-xl bg-[#090d14] border border-[#1e293b] p-4 font-mono text-xs flex flex-col gap-2">
          <div className="text-[#8e95a5]"># Interactive vtysh diagnosis commands:</div>
          <div className="p-2.5 rounded bg-[#020617] border border-[#1e293b] text-white">
            <span className="text-[#22c55e]">rtr-core-01#</span> show ip bgp summary
          </div>
          <div className="p-2.5 rounded bg-[#020617] border border-[#1e293b] text-white">
            <span className="text-[#22c55e]">rtr-core-01#</span> show ip ospf neighbor
          </div>
          <div className="p-2.5 rounded bg-[#020617] border border-[#1e293b] text-white">
            <span className="text-[#22c55e]">rtr-core-01#</span> show bfd peers
          </div>
        </div>
      )}
    </div>
  );
};

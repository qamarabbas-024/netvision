'use client';

import React, { useState } from 'react';
import { Network, Server } from 'lucide-react';

export const SubnetVisual: React.FC = () => {
  const [cidr, setCidr] = useState<number>(24);

  const getSubnetDetails = (prefix: number) => {
    switch (prefix) {
      case 24:
        return { mask: '255.255.255.0', hosts: 254, subnets: 1, desc: 'Standard Office LAN (254 hosts for PCs, printers, servers)' };
      case 25:
        return { mask: '255.255.255.128', hosts: 126, subnets: 2, desc: 'Split into 2 Subnets (126 hosts each: Engineering & Marketing)' };
      case 26:
        return { mask: '255.255.255.192', hosts: 62, subnets: 4, desc: 'Split into 4 Subnets (62 hosts each: HR, Finance, Dev, Ops)' };
      case 28:
        return { mask: '255.255.255.240', hosts: 14, subnets: 16, desc: 'Small Subnets (14 hosts each: Management or VoIP phones)' };
      case 30:
        return { mask: '255.255.255.252', hosts: 2, subnets: 64, desc: 'Point-to-Point WAN Router Links (2 usable IP addresses)' };
      default:
        return { mask: '255.255.255.0', hosts: 254, subnets: 1, desc: 'Standard Subnet' };
    }
  };

  const details = getSubnetDetails(cidr);

  return (
    <div className="p-4 sm:p-6 rounded-2xl glass-panel border border-[#272732] flex flex-col gap-5 sm:gap-6">
      <div>
        <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-wider font-semibold block mb-1">
          IP Addressing & Subnetting Calculator
        </span>
        <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <Network className="w-5 h-5 text-[#00f0ff] shrink-0" /> <span>Subnet CIDR Mask Visualizer</span>
        </h3>
      </div>

      <div className="p-4 sm:p-6 rounded-xl bg-[#09090b] border border-[#272732] flex flex-col gap-5 sm:gap-6">
        {/* Slider Controls */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 font-mono text-xs text-zinc-400">
            <span>PREFIX: <strong className="text-[#00f0ff]">192.168.1.0 /{cidr}</strong></span>
            <span>MASK: <strong className="text-purple-400">{details.mask}</strong></span>
          </div>

          <input
            type="range"
            min="24"
            max="30"
            step="1"
            value={cidr}
            onChange={(e) => setCidr(Number(e.target.value))}
            className="w-full accent-[#00f0ff] cursor-pointer my-1"
          />

          <div className="flex justify-between font-mono text-[9px] sm:text-[10px] text-zinc-500 overflow-x-auto whitespace-nowrap gap-2">
            <span>/24 (254)</span>
            <span>/25 (126)</span>
            <span>/26 (62)</span>
            <span>/28 (14)</span>
            <span>/30 (2)</span>
          </div>
        </div>

        {/* Subnet Blocks Display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {Array.from({ length: Math.min(4, details.subnets) }).map((_, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-[#121217] border border-[#00f0ff]/30 flex flex-col gap-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">SUBNET #{idx + 1}</span>
              <span className="text-xs font-bold text-white font-mono truncate">
                192.168.1.{idx * (details.hosts + 2)} / {cidr}
              </span>
              <span className="text-[11px] text-[#00f0ff] font-mono">{details.hosts} Usable IPs</span>
            </div>
          ))}
        </div>

        {/* Real-World Use Case Note */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-[#121217] border border-[#272732]">
          <h4 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
            <Server className="w-4 h-4 text-emerald-400 shrink-0" /> Scenario Application
          </h4>
          <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed font-mono">{details.desc}</p>
        </div>
      </div>
    </div>
  );
};

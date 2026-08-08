'use client';

import React from 'react';

export const IPAddressingVisual: React.FC = () => {
  return (
    <div className="p-6 rounded-2xl glass-panel border border-[#272732] flex flex-col gap-6">
      <div>
        <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-wider font-semibold block mb-1">
          IPv4 Binary Bit Structure
        </span>
        <h3 className="text-xl font-bold text-white">32-Bit IP Address & Subnet Mask Decomposition</h3>
      </div>

      <div className="p-6 rounded-xl bg-[#09090b] border border-[#272732] flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
          <div className="p-4 rounded-xl bg-[#121217] border border-[#00f0ff]/30">
            <span className="text-xs font-mono text-zinc-400 block mb-1">OCTET 1 (NETWORK)</span>
            <span className="text-lg font-extrabold text-white font-mono block">192</span>
            <span className="text-[11px] font-mono text-[#00f0ff]">11000000</span>
          </div>

          <div className="p-4 rounded-xl bg-[#121217] border border-[#00f0ff]/30">
            <span className="text-xs font-mono text-zinc-400 block mb-1">OCTET 2 (NETWORK)</span>
            <span className="text-lg font-extrabold text-white font-mono block">168</span>
            <span className="text-[11px] font-mono text-[#00f0ff]">10101000</span>
          </div>

          <div className="p-4 rounded-xl bg-[#121217] border border-[#00f0ff]/30">
            <span className="text-xs font-mono text-zinc-400 block mb-1">OCTET 3 (NETWORK)</span>
            <span className="text-lg font-extrabold text-white font-mono block">1</span>
            <span className="text-[11px] font-mono text-[#00f0ff]">00000001</span>
          </div>

          <div className="p-4 rounded-xl bg-[#121217] border border-amber-400/30">
            <span className="text-xs font-mono text-zinc-400 block mb-1">OCTET 4 (HOST ID)</span>
            <span className="text-lg font-extrabold text-white font-mono block">50</span>
            <span className="text-[11px] font-mono text-amber-400">00110010</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#121217] border border-[#272732] flex flex-col gap-2 font-mono text-xs">
          <div className="flex justify-between text-zinc-300">
            <span>IP Address: <strong>192.168.1.50</strong></span>
            <span>Subnet Mask: <strong>255.255.255.0 (/24)</strong></span>
          </div>
          <div className="flex justify-between text-zinc-400 text-[11px] border-t border-[#272732] pt-2">
            <span>Network Prefix: <strong>192.168.1.0</strong> (24 bits)</span>
            <span>Host Range: <strong>.1 to .254</strong> (8 bits)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import React from 'react';

export const IPAddressingVisual: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 rounded-2xl glass-panel border border-[#272732] flex flex-col gap-5 sm:gap-6">
      <div>
        <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-wider font-semibold block mb-1">
          IPv4 Binary Bit Structure
        </span>
        <h3 className="text-lg sm:text-xl font-bold text-white">32-Bit IP Address & Mask Decomposition</h3>
      </div>

      <div className="p-4 sm:p-6 rounded-xl bg-[#09090b] border border-[#272732] flex flex-col gap-4 sm:gap-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-center">
          <div className="p-3 sm:p-4 rounded-xl bg-[#121217] border border-[#00f0ff]/30">
            <span className="text-[10px] sm:text-xs font-mono text-zinc-400 block mb-0.5 sm:mb-1">OCTET 1 (NET)</span>
            <span className="text-base sm:text-lg font-extrabold text-white font-mono block">192</span>
            <span className="text-[10px] sm:text-[11px] font-mono text-[#00f0ff]">11000000</span>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-[#121217] border border-[#00f0ff]/30">
            <span className="text-[10px] sm:text-xs font-mono text-zinc-400 block mb-0.5 sm:mb-1">OCTET 2 (NET)</span>
            <span className="text-base sm:text-lg font-extrabold text-white font-mono block">168</span>
            <span className="text-[10px] sm:text-[11px] font-mono text-[#00f0ff]">10101000</span>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-[#121217] border border-[#00f0ff]/30">
            <span className="text-[10px] sm:text-xs font-mono text-zinc-400 block mb-0.5 sm:mb-1">OCTET 3 (NET)</span>
            <span className="text-base sm:text-lg font-extrabold text-white font-mono block">1</span>
            <span className="text-[10px] sm:text-[11px] font-mono text-[#00f0ff]">00000001</span>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-[#121217] border border-amber-400/30">
            <span className="text-[10px] sm:text-xs font-mono text-zinc-400 block mb-0.5 sm:mb-1">OCTET 4 (HOST)</span>
            <span className="text-base sm:text-lg font-extrabold text-white font-mono block">50</span>
            <span className="text-[10px] sm:text-[11px] font-mono text-amber-400">00110010</span>
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-[#121217] border border-[#272732] flex flex-col gap-2 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-zinc-300">
            <span>IP Address: <strong className="text-white">192.168.1.50</strong></span>
            <span>Subnet Mask: <strong className="text-purple-400">255.255.255.0 (/24)</strong></span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-zinc-400 text-[11px] border-t border-[#272732] pt-2">
            <span>Network Prefix: <strong className="text-white">192.168.1.0</strong> (24 bits)</span>
            <span>Host Range: <strong className="text-white">.1 to .254</strong> (8 bits)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

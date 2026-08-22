'use client';

import React, { useState } from 'react';
import { Network, Server, Cpu, CheckCircle } from 'lucide-react';

export const SubnetVisual: React.FC = () => {
  const [cidr, setCidr] = useState<number>(26);
  const [testHostOctet, setTestHostOctet] = useState<number>(37);

  // Calculate mathematical properties for any prefix /24 to /30
  const hostBits = 32 - cidr;
  const networkBits = cidr;
  const totalAddresses = Math.pow(2, hostBits);
  const usableHosts = cidr === 31 ? 2 : cidr === 32 ? 1 : Math.max(0, totalAddresses - 2);
  const subnetsCount = Math.pow(2, cidr - 24);
  const blockSize = totalAddresses;

  // 4th octet mask calculation
  const hostBitsInOctet4 = 32 - cidr;
  const maskOctet4 = 256 - Math.pow(2, hostBitsInOctet4);
  const maskDotted = `255.255.255.${maskOctet4}`;

  // Description map for scenarios
  const scenarioDescriptions: Record<number, string> = {
    24: 'Standard Class C / Office LAN: 1 subnet of 254 usable hosts. Ideal for general office floors, workstation pools, or small branch offices.',
    25: 'Split into 2 Subnets: 126 usable hosts per subnet. Ideal for separating Department LANs (e.g., Engineering vs. Marketing).',
    26: 'Split into 4 Subnets: 62 usable hosts per subnet. Ideal for medium departments (e.g., HR, Finance, DevOps, Sales).',
    27: 'Split into 8 Subnets: 30 usable hosts per subnet. Ideal for dedicated server clusters, localized lab environments, or branch Wi-Fi VLANs.',
    28: 'Split into 16 Subnets: 14 usable hosts per subnet. Ideal for management subnets, point-to-multipoint links, or VoIP infrastructure.',
    29: 'Split into 32 Subnets: 6 usable hosts per subnet. Ideal for small DMZ subnets, firewall VIP clusters, or edge routing interfaces.',
    30: 'Split into 64 Subnets: 2 usable hosts per subnet. The classic standard for Point-to-Point WAN router-to-router interconnects.',
  };

  // Subnet analysis for the tested IP
  const clampedOctet = Math.max(0, Math.min(255, isNaN(testHostOctet) ? 0 : testHostOctet));
  const activeSubnetIndex = Math.floor(clampedOctet / blockSize);
  const activeNetworkOctet = activeSubnetIndex * blockSize;
  const activeBroadcastOctet = activeNetworkOctet + blockSize - 1;
  const activeFirstUsableOctet = activeNetworkOctet + 1;
  const activeLastUsableOctet = activeBroadcastOctet - 1;

  let ipType: 'network' | 'broadcast' | 'usable' = 'usable';
  if (clampedOctet === activeNetworkOctet) ipType = 'network';
  else if (clampedOctet === activeBroadcastOctet) ipType = 'broadcast';

  // Generate binary string for 4th octet
  const maskBinaryOctet4 = maskOctet4.toString(2).padStart(8, '0');

  return (
    <div className="p-4 sm:p-6 rounded-2xl glass-panel border border-[#272732] flex flex-col gap-5 sm:gap-6">
      <div>
        <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-wider font-semibold block mb-1">
          Interactive Networking Instrument
        </span>
        <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <Network className="w-5 h-5 text-[#00f0ff] shrink-0" /> <span>IPv4 CIDR Prefix & Subnet Boundary Slider</span>
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          Adjust the prefix length slider to observe how network bits expand, host bits shrink, and subnets partition in real time.
        </p>
      </div>

      <div className="p-4 sm:p-6 rounded-xl bg-[#09090b] border border-[#272732] flex flex-col gap-5 sm:gap-6">
        {/* Slider Controls */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-mono text-xs text-zinc-300">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">PREFIX:</span>
              <span className="px-2 py-0.5 rounded bg-[#00f0ff]/10 text-[#00f0ff] font-bold text-sm">
                /{cidr}
              </span>
              <span className="text-zinc-400 hidden sm:inline">|</span>
              <span className="text-zinc-400">MASK:</span>
              <strong className="text-purple-400">{maskDotted}</strong>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span>Network: <strong className="text-[#00f0ff]">{networkBits} bits</strong></span>
              <span>Host: <strong className="text-amber-400">{hostBits} bits</strong></span>
            </div>
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
            {[24, 25, 26, 27, 28, 29, 30].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setCidr(val)}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  cidr === val ? 'bg-[#00f0ff]/20 text-[#00f0ff] font-bold' : 'hover:text-zinc-300'
                }`}
              >
                /{val} ({val === 30 ? '2' : Math.pow(2, 32 - val) - 2})
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Metric Gauges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          <div className="p-3 rounded-xl bg-[#121217] border border-[#272732] flex flex-col">
            <span className="text-[10px] font-mono text-zinc-400 uppercase">Subnets Created</span>
            <span className="text-lg font-bold text-white font-mono mt-0.5">{subnetsCount}</span>
            <span className="text-[10px] text-zinc-500 font-mono">2^{cidr - 24} subnets</span>
          </div>

          <div className="p-3 rounded-xl bg-[#121217] border border-[#272732] flex flex-col">
            <span className="text-[10px] font-mono text-zinc-400 uppercase">Block Size (Increment)</span>
            <span className="text-lg font-bold text-purple-400 font-mono mt-0.5">{blockSize}</span>
            <span className="text-[10px] text-zinc-500 font-mono">2^{hostBits} total IPs</span>
          </div>

          <div className="p-3 rounded-xl bg-[#121217] border border-[#272732] flex flex-col">
            <span className="text-[10px] font-mono text-zinc-400 uppercase">Usable Hosts / Subnet</span>
            <span className="text-lg font-bold text-[#00f0ff] font-mono mt-0.5">{usableHosts}</span>
            <span className="text-[10px] text-zinc-500 font-mono">2^{hostBits} - 2</span>
          </div>

          <div className="p-3 rounded-xl bg-[#121217] border border-[#272732] flex flex-col">
            <span className="text-[10px] font-mono text-zinc-400 uppercase">Host Bits Remaining</span>
            <span className="text-lg font-bold text-amber-400 font-mono mt-0.5">{hostBits}</span>
            <span className="text-[10px] text-zinc-500 font-mono">32 - {cidr} bits</span>
          </div>
        </div>

        {/* 32-Bit Binary Decomposition Bar */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-[#121217] border border-[#272732] flex flex-col gap-2.5">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-white font-bold flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-[#00f0ff]" /> 32-Bit Subnet Mask Bit Boundary
            </span>
            <span className="text-zinc-400 text-[11px]">
              <span className="text-[#00f0ff]">● Network 1s ({networkBits})</span>{' '}
              <span className="text-amber-400 ml-2">○ Host 0s ({hostBits})</span>
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 sm:gap-2 font-mono text-center text-xs">
            <div className="p-2 rounded bg-[#09090b] border border-[#00f0ff]/30 flex flex-col">
              <span className="text-[9px] text-zinc-500">OCTET 1 (255)</span>
              <span className="text-[#00f0ff] font-bold tracking-wider">11111111</span>
            </div>
            <div className="p-2 rounded bg-[#09090b] border border-[#00f0ff]/30 flex flex-col">
              <span className="text-[9px] text-zinc-500">OCTET 2 (255)</span>
              <span className="text-[#00f0ff] font-bold tracking-wider">11111111</span>
            </div>
            <div className="p-2 rounded bg-[#09090b] border border-[#00f0ff]/30 flex flex-col">
              <span className="text-[9px] text-zinc-500">OCTET 3 (255)</span>
              <span className="text-[#00f0ff] font-bold tracking-wider">11111111</span>
            </div>
            <div className="p-2 rounded bg-[#09090b] border border-amber-400/30 flex flex-col">
              <span className="text-[9px] text-zinc-500">OCTET 4 ({maskOctet4})</span>
              <div className="font-bold tracking-wider flex justify-center">
                <span className="text-[#00f0ff]">{maskBinaryOctet4.slice(0, cidr - 24)}</span>
                <span className="text-amber-400">{maskBinaryOctet4.slice(cidr - 24)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subnet Blocks Partition Grid */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between font-mono text-xs text-zinc-400">
            <span>SUBNET PARTITIONS (First {Math.min(4, subnetsCount)} of {subnetsCount})</span>
            <span className="text-[11px] text-zinc-500">Base Prefix: 192.168.10.0</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
            {Array.from({ length: Math.min(4, subnetsCount) }).map((_, idx) => {
              const netOctet = idx * blockSize;
              const bcastOctet = netOctet + blockSize - 1;
              const firstOctet = netOctet + 1;
              const lastOctet = bcastOctet - 1;
              const isSelected = idx === activeSubnetIndex;

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border transition-all flex flex-col gap-1 font-mono text-xs ${
                    isSelected
                      ? 'bg-[#00f0ff]/10 border-[#00f0ff] shadow-sm shadow-[#00f0ff]/20'
                      : 'bg-[#121217] border-[#272732]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">
                      SUBNET #{idx + 1}
                    </span>
                    {isSelected && (
                      <span className="text-[9px] px-1 rounded bg-[#00f0ff] text-black font-bold">
                        MATCH
                      </span>
                    )}
                  </div>
                  <div className="text-white font-bold truncate">
                    192.168.10.{netOctet} /{cidr}
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    Range: . {firstOctet} – . {lastOctet}
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    Bcast: . {bcastOctet}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Worked Example / IP Tester */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-[#121217] border border-[#272732] flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> Interactive Worked Example: 192.168.10.
              <input
                type="number"
                min="0"
                max="255"
                value={testHostOctet}
                onChange={(e) => setTestHostOctet(parseInt(e.target.value, 10))}
                className="w-14 px-1.5 py-0.5 rounded bg-[#09090b] border border-[#00f0ff]/50 text-[#00f0ff] font-bold text-center text-xs focus:outline-none focus:border-[#00f0ff]"
              />
              /{cidr}
            </h4>
            <span className="text-[11px] font-mono text-zinc-400">
              {ipType === 'usable' ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  ✓ Valid Usable Host Address
                </span>
              ) : ipType === 'network' ? (
                <span className="text-amber-400 font-semibold flex items-center gap-1">
                  ⚠ Reserved Network ID (Subnet #{activeSubnetIndex + 1})
                </span>
              ) : (
                <span className="text-rose-400 font-semibold flex items-center gap-1">
                  ⚠ Reserved Broadcast Address
                </span>
              )}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs text-zinc-300">
            <div className="p-2 rounded bg-[#09090b] border border-[#272732]">
              <span className="text-[9px] text-zinc-500 block">NETWORK ID</span>
              <strong className="text-white">192.168.10.{activeNetworkOctet}</strong>
            </div>
            <div className="p-2 rounded bg-[#09090b] border border-[#272732]">
              <span className="text-[9px] text-zinc-500 block">FIRST USABLE</span>
              <strong className="text-[#00f0ff]">192.168.10.{activeFirstUsableOctet}</strong>
            </div>
            <div className="p-2 rounded bg-[#09090b] border border-[#272732]">
              <span className="text-[9px] text-zinc-500 block">LAST USABLE</span>
              <strong className="text-[#00f0ff]">192.168.10.{activeLastUsableOctet}</strong>
            </div>
            <div className="p-2 rounded bg-[#09090b] border border-[#272732]">
              <span className="text-[9px] text-zinc-500 block">BROADCAST ID</span>
              <strong className="text-purple-400">192.168.10.{activeBroadcastOctet}</strong>
            </div>
          </div>
        </div>

        {/* Real-World Scenario Note */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-[#121217] border border-[#272732]">
          <h4 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
            <Server className="w-4 h-4 text-emerald-400 shrink-0" /> Enterprise Engineering Scenario (/{cidr})
          </h4>
          <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed font-mono">
            {scenarioDescriptions[cidr] || 'Custom subnet configuration.'}
          </p>
        </div>
      </div>
    </div>
  );
};

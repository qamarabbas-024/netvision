'use client';

import React, { useState, useEffect } from 'react';
import { Terminal, ShieldCheck, Activity, Copy, Download, Check, Radio, Network } from 'lucide-react';
import { generateTunTapSetupScript, TunTapDevice } from '@/lib/tunTapTunnelEngine';

export const TunTapTunnelStudio: React.FC = () => {
  const [device, setDevice] = useState<TunTapDevice>({
    name: 'nv-tun0',
    mode: 'tun',
    ipAddress: '10.200.1.2',
    netmask: '24',
    mtu: 1500,
    status: 'UP',
    rxPackets: 1842,
    txPackets: 1950,
    wsConnected: true,
  });

  const [copied, setCopied] = useState<boolean>(false);
  const scriptContent = generateTunTapSetupScript(device);

  useEffect(() => {
    if (!device.wsConnected) return;
    const interval = setInterval(() => {
      setDevice((prev) => ({
        ...prev,
        rxPackets: prev.rxPackets + Math.floor(Math.random() * 8 + 1),
        txPackets: prev.txPackets + Math.floor(Math.random() * 8 + 1),
      }));
    }, 1500);

    return () => clearInterval(interval);
  }, [device.wsConnected]);

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="surface-1 rounded-2xl border border-[#2a2e39] p-6 text-[#f4f5f7] font-sans shadow-instrument flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2e39] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#22c55e]">
              EPOCH XI // BROWSER-TO-LINUX TUN/TAP BRIDGE
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            TUN/TAP Virtual Interface Tunnel Bridge
          </h2>
          <p className="text-xs text-[#8e95a5]">
            Bridge live Linux kernel networking with browser simulations via WebSockets and TUN/TAP virtual interfaces.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-[#1a1f2c] border border-[#2a2e39] hover:border-[#22c55e] text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer text-white"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Script'}</span>
          </button>
        </div>
      </div>

      {/* Device Config Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">INTERFACE NAME</span>
          <strong className="text-white text-sm">{device.name}</strong>
        </div>

        <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">MODE</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDevice((prev) => ({ ...prev, mode: 'tun', name: 'nv-tun0' }))}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                device.mode === 'tun' ? 'bg-[#22c55e] text-[#062817]' : 'bg-[#1e293b] text-[#8e95a5]'
              }`}
            >
              TUN (L3 IP)
            </button>
            <button
              type="button"
              onClick={() => setDevice((prev) => ({ ...prev, mode: 'tap', name: 'nv-tap0' }))}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                device.mode === 'tap' ? 'bg-[#22c55e] text-[#062817]' : 'bg-[#1e293b] text-[#8e95a5]'
              }`}
            >
              TAP (L2 Ethernet)
            </button>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">TUNNEL STATE</span>
          <span className="text-[#22c55e] font-bold flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>ESTABLISHED (WSS)</span>
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-1">
          <span className="text-[10px] text-[#64748b]">PACKET TELEMETRY</span>
          <div className="text-[11px] text-white">
            RX: <strong className="text-[#22c55e]">{device.rxPackets.toLocaleString()}</strong> | TX:{' '}
            <strong className="text-[#38bdf8]">{device.txPackets.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      {/* Linux Provisioning Bash Script */}
      <div className="rounded-xl bg-[#090d14] border border-[#1e293b] p-4 font-mono text-xs text-[#38bdf8] overflow-x-auto leading-relaxed">
        <div className="text-white font-bold text-xs pb-2 border-b border-[#1e293b] mb-2 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#22c55e]" />
          <span>Linux Host Setup Script (setup-tunnel.sh)</span>
        </div>
        <pre className="whitespace-pre">{scriptContent}</pre>
      </div>
    </div>
  );
};

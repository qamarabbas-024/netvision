'use client';

import React, { useState } from 'react';
import {
  Terminal,
  ShieldAlert,
  Search,
  RotateCcw,
  Code,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  PenetrationTestingEngine,
  PortScanResult,
  ExploitPayload,
} from '@/lib/penetrationTestingEngine';
import { SoundFx } from '@/lib/soundFx';

export const PenetrationTestingStudio: React.FC = () => {
  const [ports, setPorts] = useState<PortScanResult[]>([]);
  const [cves] = useState<ExploitPayload[]>(() => PenetrationTestingEngine.getCvePayloads());
  const [selectedCve, setSelectedCve] = useState<ExploitPayload>(cves[0]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanOutputLog, setScanOutputLog] = useState<string[]>([]);

  const handleLaunchScan = () => {
    setIsScanning(true);
    setScanOutputLog([]);
    setPorts([]);
    SoundFx.playPacketDispatch();

    const logs = [
      '[*] Starting Nmap 7.94 ( https://nmap.org ) at ' + new Date().toLocaleTimeString(),
      '[*] Initiating SYN Stealth Scan against target 192.168.1.50...',
      '[*] Dispatched 1,000 raw TCP probes with randomize-hosts enabled...',
      '[✓] Completed SYN Stealth Scan in 0.42s (5 ports responded).',
      '[*] Initiating Service & Version Detection against open ports...',
      '[✓] Service detection complete. 3 services recognized, 1 filtered.',
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setScanOutputLog((prev) => [...prev, log]);
        SoundFx.playTerminalKeyPress();
        if (index === logs.length - 1) {
          setIsScanning(false);
          setPorts(PenetrationTestingEngine.getTargetPorts());
          SoundFx.playSuccessChime();
        }
      }, (index + 1) * 250);
    });
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setPorts([]);
    setScanOutputLog([]);
    setIsScanning(false);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-rose-400 font-bold uppercase tracking-wider">
                Version 5.4 Pen-Testing
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold">
                Nmap & CVE Sandbox
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              TCP Stealth Port Scanner & Vulnerability Exploitation Sandbox
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isScanning ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleLaunchScan}
              leftIcon={<Search className="w-3.5 h-3.5 text-rose-300" />}
            >
              Launch Nmap Stealth Scan (nmap -sS)
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Scanning Target 192.168.1.50...
            </Button>
          )}

          {ports.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              Clear Scan
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: Nmap Scanner Console (Left) & CVE Exploit Dissector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: Port Scan Table & Nmap Log */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-rose-400" /> Target Host: 192.168.1.50 (Linux/Ubuntu)
            </span>
            <span className="text-[10px] font-mono text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/30">
              Raw Socket Access
            </span>
          </div>

          {/* Scanned Ports Table */}
          {ports.length > 0 ? (
            <div className="space-y-2 animate-in fade-in">
              {ports.map((p) => (
                <div
                  key={p.port}
                  className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white w-16">Port {p.port}</span>
                    <span className="text-zinc-400">{p.service}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-zinc-500 truncate max-w-[140px]">{p.banner}</span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                        p.state === 'OPEN'
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                          : p.state === 'FILTERED'
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {p.state}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-black/50 border border-[#262c42] min-h-[220px] font-mono text-xs text-zinc-400 space-y-1 overflow-y-auto">
              {scanOutputLog.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-zinc-600 gap-2 min-h-[180px]">
                  <Code className="w-8 h-8 opacity-40 text-zinc-500" />
                  <span>Click "Launch Nmap Stealth Scan" above to initiate raw socket probe.</span>
                </div>
              ) : (
                scanOutputLog.map((l, idx) => (
                  <div key={idx} className={l.includes('✓') ? 'text-emerald-400' : 'text-zinc-300'}>
                    {l}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right 5 Cols: CVE Exploit Payload Dissector */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-400" /> CVE Vulnerability Dissector
            </span>
            <span className="text-[10px] font-mono text-rose-400 font-bold">
              CVSS 9.8 Critical
            </span>
          </div>

          {/* CVE Selector Pills */}
          <div className="flex gap-2">
            {cves.map((c) => (
              <button
                key={c.cveId}
                onClick={() => {
                  SoundFx.playTerminalKeyPress();
                  setSelectedCve(c);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                  selectedCve.cveId === c.cveId
                    ? 'border-rose-500 bg-rose-950/40 text-white shadow-glow-rose'
                    : 'border-[#262c42] bg-[#121522] text-zinc-400 hover:border-zinc-600'
                }`}
              >
                {c.cveId}
              </button>
            ))}
          </div>

          {/* CVE Details Box */}
          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-3">
            <div>
              <span className="text-xs font-bold text-white block">{selectedCve.name}</span>
              <span className="text-[10px] font-mono text-zinc-400">Target: {selectedCve.targetProtocol}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800 text-[11px] font-mono text-rose-300 break-all">
              Payload Signature: {selectedCve.hexSignature}
            </div>

            <div className="text-[11px] text-zinc-400 leading-relaxed">
              <span className="font-bold text-white block">Impact Analysis:</span>
              {selectedCve.impact}
            </div>

            <div className="pt-2 border-t border-[#202538] text-[11px] font-mono text-emerald-400">
              <span className="font-bold block">Hardening Mitigation:</span>
              {selectedCve.mitigation}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

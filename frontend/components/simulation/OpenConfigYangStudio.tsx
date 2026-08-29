'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Radio, Play, Pause, FolderTree, Database, Code, Check } from 'lucide-react';
import { OPENCONFIG_INTERFACES_TREE, generateGnmiSubscribeRequest, YangPathNode } from '@/lib/openConfigYangEngine';

export const OpenConfigYangStudio: React.FC = () => {
  const [selectedPath, setSelectedPath] = useState<string>('/interfaces/interface[name=eth0]/state/counters/in-octets');
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [inOctets, setInOctets] = useState<number>(489201948);
  const [outOctets, setOutOctets] = useState<number>(129482019);
  const [logMessages, setLogMessages] = useState<string[]>([]);

  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      const deltaIn = Math.floor(Math.random() * 850000 + 150000);
      const deltaOut = Math.floor(Math.random() * 450000 + 80000);
      setInOctets((prev) => prev + deltaIn);
      setOutOctets((prev) => prev + deltaOut);

      const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
      setLogMessages((prev) => [
        `[${timestamp}] gNMI Update: /interfaces/interface[eth0]/state/counters/in-octets = ${(inOctets + deltaIn).toLocaleString()} (+${(deltaIn / 1024).toFixed(1)} KB/s)`,
        ...prev.slice(0, 8),
      ]);
    }, 1200);

    return () => clearInterval(interval);
  }, [isStreaming, inOctets]);

  const gnmiJson = generateGnmiSubscribeRequest(selectedPath, 'STREAM');

  return (
    <div className="surface-1 rounded-2xl border border-[#2a2e39] p-6 text-[#f4f5f7] font-sans shadow-instrument flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2e39] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#22c55e]">
              EPOCH XI // OPENCONFIG YANG & GNMI TELEMETRY
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            OpenConfig YANG Tree & gNMI Streaming Studio
          </h2>
          <p className="text-xs text-[#8e95a5]">
            Browse standard OpenConfig YANG schema models and stream real-time gNMI telemetry events.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => setIsStreaming(!isStreaming)}
            className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              isStreaming
                ? 'bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e]/30'
                : 'bg-[#1a1f2c] text-[#8e95a5] border-[#2a2e39]'
            }`}
          >
            {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isStreaming ? 'Streaming Live' : 'Paused'}</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: YANG Tree Structure */}
        <div className="lg:col-span-5 p-4 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-3 font-mono text-xs">
          <div className="flex items-center gap-2 text-white font-bold pb-2 border-b border-[#1e293b]">
            <FolderTree className="w-4 h-4 text-[#38bdf8]" />
            <span>OpenConfig YANG Hierarchy</span>
          </div>

          <div className="flex flex-col gap-1.5 text-xs text-[#8e95a5]">
            <div className="text-white font-bold">/openconfig-interfaces:interfaces</div>
            <div className="pl-3">└─ interface [name=eth0]</div>
            <div className="pl-6">├─ config</div>
            <div className="pl-9">├─ name: <span className="text-[#38bdf8]">&quot;eth0&quot;</span></div>
            <div className="pl-9">└─ enabled: <span className="text-[#22c55e]">true</span></div>
            <div className="pl-6">└─ state</div>
            <div className="pl-9">├─ oper-status: <span className="text-[#22c55e]">&quot;UP&quot;</span></div>
            <div className="pl-9">└─ counters</div>
            <div className="pl-12 text-[#22c55e] font-bold">├─ in-octets: {inOctets.toLocaleString()}</div>
            <div className="pl-12 text-[#38bdf8] font-bold">├─ out-octets: {outOctets.toLocaleString()}</div>
            <div className="pl-12 text-[#a855f7]">└─ in-errors: 0</div>
          </div>
        </div>

        {/* Right: gNMI Stream & JSON payload */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="p-4 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-2 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#1e293b] text-white font-bold">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#22c55e]" />
                <span>Live gNMI Subscribe Stream (JSON_IETF)</span>
              </div>
              <span className="text-[10px] text-[#64748b]">SAMPLE: 1000ms</span>
            </div>

            <div className="flex flex-col gap-1 text-[11px] text-[#22c55e] min-h-[140px]">
              {logMessages.map((msg, idx) => (
                <div key={idx} className="truncate">
                  {msg}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-2 font-mono text-xs text-[#38bdf8] overflow-x-auto">
            <div className="text-white font-bold text-xs pb-1 border-b border-[#1e293b]">
              gNMI Subscribe RPC Spec
            </div>
            <pre className="whitespace-pre">{gnmiJson}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Sliders,
  Play,
  Pause,
  RotateCcw,
  Zap,
  ShieldAlert,
  Search,
  Activity,
  CheckCircle2,
  Terminal,
} from 'lucide-react';

export interface InteractiveControlPanelProps {
  topicSlug: string;
  onParameterChange?: (params: { speed: number; injectError: boolean; filterProtocol: string }) => void;
}

export const InteractiveControlPanel: React.FC<InteractiveControlPanelProps> = ({
  topicSlug,
  onParameterChange,
}) => {
  const [speed, setSpeed] = useState<number>(1.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'inspector' | 'injector' | 'logs'>('inspector');
  const [injectCorrupted, setInjectCorrupted] = useState<boolean>(false);
  const [protocolFilter, setProtocolFilter] = useState<string>('ALL');
  const [logEntries, setLogEntries] = useState<Array<{ id: string; time: string; msg: string; type: 'info' | 'warn' | 'success' }>>([
    { id: '1', time: '0.000s', msg: 'System initialized. Ready for packet inspection.', type: 'info' },
    { id: '2', time: '0.120s', msg: `Protocol target: ${topicSlug.toUpperCase()}`, type: 'info' },
  ]);

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (onParameterChange) {
      onParameterChange({ speed: newSpeed, injectError: injectCorrupted, filterProtocol: protocolFilter });
    }
  };

  const handleInjectAction = (actionName: string) => {
    const timestamp = (Math.random() * 2 + 0.5).toFixed(3) + 's';
    let newEntry: { id: string; time: string; msg: string; type: 'info' | 'warn' | 'success' };

    if (actionName === 'corrupt') {
      setInjectCorrupted(true);
      newEntry = { id: Date.now().toString(), time: timestamp, msg: '⚠️ INJECTED CORRUPTED CRC FRAME: FCS Mismatch detected by switch!', type: 'warn' };
    } else if (actionName === 'latency') {
      newEntry = { id: Date.now().toString(), time: timestamp, msg: '⏱ SIMULATED LATENCY: Delay spike +150ms added to intermediate hop.', type: 'info' };
    } else {
      setInjectCorrupted(false);
      newEntry = { id: Date.now().toString(), time: timestamp, msg: '✅ NORMAL PACKET SENT: Valid headers & frame check sequence verified.', type: 'success' };
    }

    setLogEntries((prev) => [newEntry, ...prev.slice(0, 8)]);
  };

  return (
    <Card className="p-6 glass-panel-glow border-[#00f0ff]/30 flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#272732] pb-4">
        <div className="flex items-center gap-2">
          <Badge variant="cyan">STAGE 4: INTERACT</Badge>
          <span className="text-xs font-mono text-zinc-400">Live Parameter Controls & Inspector</span>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs flex items-center gap-1.5 transition-colors border border-[#272732]"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={() => setLogEntries([])}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors border border-[#272732]"
            title="Reset Controls"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Speed & Parameter Selection Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-[#09090b] border border-[#272732] flex flex-col gap-2">
          <label className="text-xs font-mono font-bold text-zinc-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#00f0ff]" /> Animation Speed Ratio
            </span>
            <span className="text-[#00f0ff]">{speed}x</span>
          </label>
          <div className="grid grid-cols-4 gap-2 mt-1">
            {[0.5, 1.0, 1.5, 2.0].map((s) => (
              <button
                key={s}
                onClick={() => handleSpeedChange(s)}
                className={`py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  speed === s
                    ? 'bg-[#00f0ff] text-black shadow-glow-cyan'
                    : 'bg-white/5 text-zinc-400 hover:text-white border border-[#272732]'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#09090b] border border-[#272732] flex flex-col gap-2">
          <label className="text-xs font-mono font-bold text-zinc-300 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-purple-400" /> Protocol Header Focus
          </label>
          <div className="grid grid-cols-4 gap-2 mt-1">
            {['ALL', 'L2 MAC', 'L3 IP', 'L4 TCP'].map((f) => (
              <button
                key={f}
                onClick={() => setProtocolFilter(f)}
                className={`py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  protocolFilter === f
                    ? 'bg-purple-500 text-white shadow-glow-purple'
                    : 'bg-white/5 text-zinc-400 hover:text-white border border-[#272732]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Control Tabs */}
      <div className="flex border-b border-[#272732]">
        <button
          onClick={() => setActiveTab('inspector')}
          className={`px-4 py-2.5 text-xs font-mono font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'inspector'
              ? 'border-[#00f0ff] text-[#00f0ff]'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Search className="w-3.5 h-3.5" /> Header Inspector
        </button>
        <button
          onClick={() => setActiveTab('injector')}
          className={`px-4 py-2.5 text-xs font-mono font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'injector'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" /> Packet Injector
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2.5 text-xs font-mono font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'logs'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" /> Live Packet Stream Log
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'inspector' && (
        <div className="p-4 rounded-2xl bg-[#09090b] border border-[#272732] font-mono text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-zinc-400">PDU Header Layout</span>
            <span className="text-[#00f0ff] font-bold">Ethernet II / IPv4 / TCP Socket</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-zinc-500 block uppercase">L2 Data Link</span>
              <div className="text-white font-bold mt-1">Src: 00:1A:2B:3C:4D:5E</div>
              <div className="text-white font-bold">Dst: FF:FF:FF:FF:FF:FF</div>
              <span className="text-[10px] text-emerald-400">EtherType: 0x0800</span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-zinc-500 block uppercase">L3 Network</span>
              <div className="text-[#00f0ff] font-bold mt-1">Src IP: 192.168.1.50</div>
              <div className="text-[#00f0ff] font-bold">Dst IP: 192.168.1.1</div>
              <span className="text-[10px] text-amber-400">TTL: 64 | Protocol: 6 (TCP)</span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-zinc-500 block uppercase">L4 Transport</span>
              <div className="text-purple-300 font-bold mt-1">Src Port: 49152</div>
              <div className="text-purple-300 font-bold">Dst Port: 443 (HTTPS)</div>
              <span className="text-[10px] text-purple-400">Flags: [SYN] Seq: 1000</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'injector' && (
        <div className="p-4 rounded-2xl bg-[#09090b] border border-[#272732] flex flex-col gap-3">
          <span className="text-xs font-mono text-zinc-400">Simulate Custom Packet Scenarios</span>
          <div className="flex flex-wrap gap-3">
            <Button variant="cyan" size="sm" onClick={() => handleInjectAction('normal')} leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}>
              Send Normal Frame
            </Button>
            <Button variant="secondary" size="sm" onClick={() => handleInjectAction('corrupt')} leftIcon={<ShieldAlert className="w-3.5 h-3.5 text-rose-400" />}>
              Inject Corrupted Frame (Bad CRC)
            </Button>
            <Button variant="secondary" size="sm" onClick={() => handleInjectAction('latency')} leftIcon={<Zap className="w-3.5 h-3.5 text-amber-400" />}>
              Simulate Latency (+150ms)
            </Button>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="p-4 rounded-2xl bg-[#09090b] border border-[#272732] font-mono text-xs space-y-2 max-h-48 overflow-y-auto">
          {logEntries.map((log) => (
            <div key={log.id} className="flex items-center justify-between gap-2 border-b border-white/5 pb-1">
              <span className="text-zinc-500 text-[10px] shrink-0">{log.time}</span>
              <span className={log.type === 'warn' ? 'text-rose-400' : log.type === 'success' ? 'text-emerald-400' : 'text-zinc-300'}>
                {log.msg}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

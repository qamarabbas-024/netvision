'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  AlertTriangle,
  Activity,
  ShieldAlert,
  Flame,
  CheckCircle2,
  Terminal,
  Send,
  Zap,
  Clock,
  Printer,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { VectorPdfGenerator } from '@/lib/pdfGenerator';

export interface WarRoomParticipant {
  id: string;
  name: string;
  role: 'Incident Commander' | 'Packet Analyst' | 'Core Routing Engineer' | 'Security Operator';
  status: 'active' | 'investigating' | 'applying_fix';
  avatarColor: string;
}

export interface WarRoomEvent {
  id: string;
  timestamp: string;
  author: string;
  message: string;
  type: 'alert' | 'action' | 'fix' | 'chat';
}

export const CollaborativeWarRoom: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<'bgp_leak' | 'stp_loop' | 'mtu_blackhole'>('stp_loop');
  const [healthScore, setHealthScore] = useState<number>(34);
  const [packetLossPct, setPacketLossPct] = useState<number>(68);
  const [isResolved, setIsResolved] = useState<boolean>(false);
  const [commandInput, setCommandInput] = useState<string>('');

  const [participants] = useState<WarRoomParticipant[]>([
    { id: 'p1', name: 'Alex Rivers (You)', role: 'Incident Commander', status: 'investigating', avatarColor: 'bg-emerald-500' },
    { id: 'p2', name: 'Marcus Chen', role: 'Packet Analyst', status: 'active', avatarColor: 'bg-sky-500' },
    { id: 'p3', name: 'Elena Rostova', role: 'Core Routing Engineer', status: 'applying_fix', avatarColor: 'bg-purple-500' },
    { id: 'p4', name: 'Devon Vance', role: 'Security Operator', status: 'active', avatarColor: 'bg-amber-500' },
  ]);

  const [events, setEvents] = useState<WarRoomEvent[]>([
    {
      id: 'e1',
      timestamp: '00:01:14',
      author: 'SYSTEM TELEMETRY',
      message: 'CRITICAL ALERT: Broadcast storm detected on Switch-Core-01. Port gig0/1 bandwidth saturation at 99.4%.',
      type: 'alert',
    },
    {
      id: 'e2',
      timestamp: '00:01:28',
      author: 'Marcus Chen',
      message: 'BPDU frames are not being forwarded on Trunk link Eth0/2. STP state stuck in FORWARDING on both ends!',
      type: 'chat',
    },
    {
      id: 'e3',
      timestamp: '00:01:45',
      author: 'Elena Rostova',
      message: 'Spanning Tree loop confirmed between SW-1 and SW-2. MAC table flapping 40,000 times/sec.',
      type: 'chat',
    },
  ]);

  const handleApplyFix = (fixType: string) => {
    const timestamp = '00:02:10';
    if (fixType === 'bpduguard') {
      setEvents((prev) => [
        ...prev,
        {
          id: `ev-${Date.now()}`,
          timestamp,
          author: 'Alex Rivers (You)',
          message: 'APPLYING REMEDIATION: Enabled "spanning-tree portfast bpduguard default" on access ports and enforced RSTP 802.1w convergence.',
          type: 'action',
        },
      ]);

      setTimeout(() => {
        setHealthScore(100);
        setPacketLossPct(0);
        setIsResolved(true);
        setEvents((prev) => [
          ...prev,
          {
            id: `ev-${Date.now() + 1}`,
            timestamp: '00:02:18',
            author: 'SYSTEM TELEMETRY',
            message: 'INCIDENT RESOLVED: STP topology converged. Blocking port SW-2 Eth0/2. Broadcast storm quenched. Latency normalized to 0.8ms.',
            type: 'fix',
          },
        ]);
      }, 900);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    setEvents((prev) => [
      ...prev,
      {
        id: `ev-${Date.now()}`,
        timestamp: '00:02:30',
        author: 'Alex Rivers (You)',
        message: commandInput.trim(),
        type: 'chat',
      },
    ]);
    setCommandInput('');
  };

  const handleExportPostMortem = () => {
    VectorPdfGenerator.printLabReport({
      studentName: 'Alex Rivers (Lead Incident Commander)',
      labTitle: 'Collaborative Incident Post-Mortem: Core L2 Spanning Tree Loop Collapse',
      courseCode: 'WAR-ROOM-INCIDENT-0823',
      completedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      score: 100,
      durationMinutes: 4,
      tasksCompleted: [
        'Identified Layer 2 Broadcast Storm causing 99.4% link saturation.',
        'Diagnosed missing BPDU exchange across redundant trunk links.',
        'Applied Spanning Tree BPDU Guard and RSTP rapid convergence fix.',
        'Validated zero-loss ICMP reachability across all campus endpoints.',
      ],
      topologySnapshot: 'SW-1 ➔ SW-2 redundant trunk mesh with active blocking state on Eth0/2',
      cliCommandLog: [
        'spanning-tree mode rapid-pvst',
        'spanning-tree portfast bpduguard default',
        'interface Ethernet0/2',
        'spanning-tree cost 200000',
        'show spanning-tree summary',
      ],
    });
  };

  return (
    <div className="w-full rounded-2xl bg-[#09090b] border border-[#272732] overflow-hidden flex flex-col shadow-2xl">
      {/* Top War-Room Header */}
      <div className="px-5 py-4 border-b border-[#272732] bg-[#121217] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-rose-400 uppercase tracking-wider font-semibold">
                Version 3.8 Collaborative War-Room
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-mono font-bold">
                Live Incident Room #8841
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
              P0 Network Outage Triage: L2 Broadcast Storm & STP Loop
            </h3>
          </div>
        </div>

        {/* Action: Export Incident PDF */}
        <div className="flex items-center gap-2">
          {isResolved && (
            <Button
              variant="cyan"
              size="sm"
              onClick={handleExportPostMortem}
              leftIcon={<Printer className="w-3.5 h-3.5" />}
              className="bg-emerald-500 text-black font-bold text-xs shadow-glow-emerald"
            >
              Export Incident Post-Mortem PDF
            </Button>
          )}
        </div>
      </div>

      {/* Live Telemetry Health Metric Bar */}
      <div className="px-5 py-3 bg-[#0d0d12] border-b border-[#272732] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
        <div>
          <span className="text-zinc-500 block text-[10px] uppercase">Cluster Health</span>
          <span className={`font-bold text-sm ${healthScore === 100 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {healthScore}% {healthScore === 100 ? 'NORMAL' : 'DEGRADED'}
          </span>
        </div>

        <div>
          <span className="text-zinc-500 block text-[10px] uppercase">Packet Drop Rate</span>
          <span className={`font-bold text-sm ${packetLossPct === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {packetLossPct}% Drop
          </span>
        </div>

        <div>
          <span className="text-zinc-500 block text-[10px] uppercase">Link Latency</span>
          <span className="font-bold text-sm text-sky-400">
            {isResolved ? '0.8 ms' : '842.1 ms (Jitter)'}
          </span>
        </div>

        <div>
          <span className="text-zinc-500 block text-[10px] uppercase">Active Engineers</span>
          <span className="font-bold text-sm text-purple-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            4 Live Connected
          </span>
        </div>
      </div>

      {/* Main Grid: Participants (Left) & Event Stream / Remediation (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#272732] min-h-[380px]">
        {/* Left Column: Live Operators */}
        <div className="p-4 bg-[#0e0e14] flex flex-col gap-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-sky-400" /> Connected Operators (4)
          </span>

          <div className="flex flex-col gap-2">
            {participants.map((p) => (
              <div
                key={p.id}
                className="p-2.5 rounded-xl bg-[#14141d] border border-[#272732] flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg ${p.avatarColor} text-black font-bold font-mono text-xs flex items-center justify-center`}>
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{p.name}</div>
                    <div className="text-[10px] text-zinc-400 font-mono">{p.role}</div>
                  </div>
                </div>

                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
            ))}
          </div>

          {/* Quick Remediation Actions */}
          <div className="mt-auto p-3 rounded-xl bg-[#14141d] border border-[#272732] flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-[#00f0ff]" /> Triage Actions
            </span>

            <Button
              variant="cyan"
              size="sm"
              onClick={() => handleApplyFix('bpduguard')}
              disabled={isResolved}
              className={`w-full text-xs font-bold ${
                isResolved
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-glow-rose'
              }`}
            >
              {isResolved ? '✓ Remediation Applied' : 'Apply RSTP & BPDU Guard Fix ➔'}
            </Button>
          </div>
        </div>

        {/* Right Column: Live Incident Chat & Triage Event Log */}
        <div className="md:col-span-2 p-4 bg-[#09090b] flex flex-col justify-between">
          <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
            {events.map((ev) => (
              <div
                key={ev.id}
                className={`p-2.5 rounded-xl text-xs font-mono leading-relaxed border ${
                  ev.type === 'alert'
                    ? 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                    : ev.type === 'fix'
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                    : ev.type === 'action'
                    ? 'bg-sky-950/20 border-sky-500/30 text-sky-300'
                    : 'bg-[#14141d] border-[#272732] text-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1">
                  <span className="font-bold">{ev.author}</span>
                  <span>{ev.timestamp}</span>
                </div>
                <div>{ev.message}</div>
              </div>
            ))}
          </div>

          {/* Chat / Dispatch Form */}
          <form onSubmit={handleSendMessage} className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="Send operator message or triage suggestion..."
              className="flex-1 px-3 py-2 rounded-xl bg-[#14141d] border border-[#272732] text-xs font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-sky-500"
            />
            <Button variant="secondary" size="sm" type="submit" className="text-xs font-bold shrink-0">
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

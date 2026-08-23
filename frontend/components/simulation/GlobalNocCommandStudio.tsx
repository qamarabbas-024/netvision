'use client';

import React, { useState } from 'react';
import {
  Monitor,
  Building2,
  Activity,
  Lock,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  GlobalNocCommandEngine,
  EnterpriseTenant,
  NocGlobalAlarm,
} from '@/lib/globalNocCommandEngine';
import { SoundFx } from '@/lib/soundFx';

export const GlobalNocCommandStudio: React.FC = () => {
  const [tenants] = useState<EnterpriseTenant[]>(() => GlobalNocCommandEngine.getEnterpriseTenants());
  const [selectedTenant, setSelectedTenant] = useState<EnterpriseTenant>(tenants[0]);
  const [alarms, setAlarms] = useState<NocGlobalAlarm[]>(() => GlobalNocCommandEngine.getInitialAlarms());
  const [isLockdownActive, setIsLockdownActive] = useState<boolean>(false);

  const handleTriggerLockdown = () => {
    SoundFx.playPacketDrop();
    setIsLockdownActive(true);
    const newAlarm: NocGlobalAlarm = {
      id: `alm-${Date.now()}`,
      severity: 'P1_CRITICAL',
      title: 'EMERGENCY ZERO-TRUST PERIMETER LOCKDOWN INITIATED',
      sourceTenant: selectedTenant.name,
      timestamp: new Date().toLocaleTimeString(),
    };
    setAlarms((prev) => [newAlarm, ...prev]);
    SoundFx.playSuccessChime();
  };

  const handleResetLockdown = () => {
    SoundFx.playTerminalKeyPress();
    setIsLockdownActive(false);
    setAlarms(GlobalNocCommandEngine.getInitialAlarms());
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00f0ff]">
            <Monitor className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
                Version 6.0 Global Command Center
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                Enterprise Multi-Tenant NOC
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Global NOC Operations Video-Wall & Security Lockdown
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isLockdownActive ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleTriggerLockdown}
              leftIcon={<Lock className="w-3.5 h-3.5" />}
            >
              Deploy Zero-Trust Kill Switch
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleResetLockdown} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              Disarm Perimeter Lockdown
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: Multi-Tenant Enterprise Fleets (Left) & Global NOC Wall (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 6 Cols: Multi-Tenant Enterprise Workspaces */}
        <div className="lg:col-span-6 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#00f0ff]" /> Enterprise Multi-Tenant Fleets
            </span>
            <span className="text-[10px] font-mono text-zinc-400">SOC2 Type II Attested</span>
          </div>

          <div className="space-y-2.5">
            {tenants.map((t) => {
              const isSelected = selectedTenant.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => {
                    SoundFx.playTerminalKeyPress();
                    setSelectedTenant(t);
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col gap-1.5 ${
                    isSelected
                      ? 'border-[#00f0ff] bg-cyan-950/30 shadow-glow-cyan'
                      : 'border-[#262c42] bg-[#121522] hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-mono">{t.name}</span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
                      {t.slaUptime}% SLA
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-zinc-400 mt-1">
                    <div>Region: {t.region}</div>
                    <div>Nodes: <span className="text-white font-bold">{t.activeNodes.toLocaleString()}</span></div>
                    <div>Compliance: <span className="text-cyan-300">{t.complianceStatus}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 6 Cols: Global NOC Video-Wall Telemetry */}
        <div className="lg:col-span-6 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" /> Global Video-Wall Telemetry
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                isLockdownActive
                  ? 'bg-rose-950/60 text-rose-300 border-rose-500/40 animate-pulse'
                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
              }`}
            >
              {isLockdownActive ? 'PERIMETER LOCKDOWN ACTIVE' : 'GLOBAL HEALTH: OPTIMAL'}
            </span>
          </div>

          {/* Metric Dashboard */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Core Aggregated Bandwidth</span>
              <span className="text-lg font-bold text-white font-mono mt-1">2.84 Tbps</span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Direct Terabit Ingress</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Managed Edge Fleet</span>
              <span className="text-lg font-bold text-[#00f0ff] font-mono mt-1">14,990</span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Active Fabric Nodes</span>
            </div>
          </div>

          {/* Live Global Incident Ticker */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">
              Live Global Incident Stream
            </span>
            <div className="space-y-1 max-h-[140px] overflow-y-auto">
              {alarms.map((a) => (
                <div
                  key={a.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-[10px] font-mono ${
                    a.severity === 'P1_CRITICAL'
                      ? 'border-rose-500/60 bg-rose-950/40 text-rose-200 animate-pulse'
                      : 'border-[#262c42] bg-[#121522] text-zinc-300'
                  }`}
                >
                  <span className="font-bold">[{a.timestamp}] {a.title}</span>
                  <span className="text-zinc-500">{a.severity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

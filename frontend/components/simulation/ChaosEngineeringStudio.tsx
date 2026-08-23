'use client';

import React, { useState, useEffect } from 'react';
import {
  Flame,
  Activity,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Wrench,
  RotateCcw,
  Skull,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  CHAOS_CATALOG,
  ChaosEvent,
} from '@/lib/chaosMonkeyEngine';
import { SoundFx } from '@/lib/soundFx';

export const ChaosEngineeringStudio: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<ChaosEvent>(CHAOS_CATALOG[0]);
  const [isChaosActive, setIsChaosActive] = useState<boolean>(false);
  const [isResolved, setIsResolved] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [packetLossPercent, setPacketLossPercent] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isChaosActive && !isResolved) {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
        setPacketLossPercent((prev) => Math.min(85, prev + Math.floor(Math.random() * 8 + 2)));
        SoundFx.playPacketDrop();
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isChaosActive, isResolved]);

  const handleTriggerChaos = () => {
    SoundFx.playPacketDrop();
    setIsChaosActive(true);
    setIsResolved(false);
    setElapsedSeconds(0);
    setPacketLossPercent(35);
  };

  const handleApplyRemediation = () => {
    SoundFx.playTerminalKeyPress();
    setIsResolved(true);
    setPacketLossPercent(0);
    SoundFx.playSuccessChime();
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setIsChaosActive(false);
    setIsResolved(false);
    setElapsedSeconds(0);
    setPacketLossPercent(0);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Skull className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                Version 4.8 Resilience Arena
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
                Network Chaos Monkey
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Failure Injection & Outage Triage Simulator
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isChaosActive ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleTriggerChaos}
              leftIcon={<Flame className="w-3.5 h-3.5 text-amber-300" />}
            >
              Release Chaos Monkey
            </Button>
          ) : !isResolved ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleApplyRemediation}
              leftIcon={<Wrench className="w-3.5 h-3.5 text-emerald-300" />}
            >
              Apply Remediation Patch
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              Reset Arena
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: Chaos Catalog (Left) & Outage Telemetry Wall (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 6 Cols: Failure Injection Modes */}
        <div className="lg:col-span-6 p-5 flex flex-col gap-3 bg-[#0c0e17]">
          <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400" /> Select Outage Scenario
          </span>

          <div className="space-y-2">
            {CHAOS_CATALOG.map((evt) => {
              const isSelected = selectedEvent.id === evt.id;
              return (
                <button
                  key={evt.id}
                  onClick={() => {
                    SoundFx.playTerminalKeyPress();
                    setSelectedEvent(evt);
                    handleReset();
                  }}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all flex flex-col gap-1.5 ${
                    isSelected
                      ? 'border-amber-500/80 bg-amber-950/20 shadow-glow-rose'
                      : 'border-[#262c42] bg-[#121522] hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      {evt.name}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                      Impact: {evt.impactScore}/100
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-relaxed">{evt.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 6 Cols: Incident Response Telemetry */}
        <div className="lg:col-span-6 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-amber-400" /> MTTR & SLA Telemetry
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                !isChaosActive
                  ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  : isResolved
                  ? 'bg-emerald-950/50 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-950/50 text-amber-400 border-amber-500/30 animate-pulse'
              }`}
            >
              {!isChaosActive ? 'NO ACTIVE OUTAGE' : isResolved ? 'INCIDENT RESOLVED' : 'ACTIVE PRODUCTION OUTAGE'}
            </span>
          </div>

          {/* MTTR Stopwatch & Packet Loss Gauge */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" /> Mean Time to Repair (MTTR)
              </span>
              <span className="text-2xl font-bold font-mono text-white mt-1">
                {String(Math.floor(elapsedSeconds / 60)).padStart(2, '0')}:
                {String(elapsedSeconds % 60).padStart(2, '0')}
              </span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">
                {isResolved ? 'Resolved within SLA target' : 'Outage clock ticking...'}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Packet Loss</span>
              <span
                className={`text-2xl font-bold font-mono mt-1 ${
                  packetLossPercent > 50 ? 'text-rose-400' : packetLossPercent > 0 ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {packetLossPercent}%
              </span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">SLA Threshold: 0.1%</span>
            </div>
          </div>

          {/* Incident Symptoms Box */}
          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Observed Incident Symptoms
            </span>
            <ul className="space-y-1 text-[11px] text-zinc-400 list-disc list-inside">
              {selectedEvent.symptoms.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>

            {isResolved && (
              <div className="pt-2 border-t border-[#202538] text-[11px] font-mono text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Fix applied: {selectedEvent.remediationAction}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

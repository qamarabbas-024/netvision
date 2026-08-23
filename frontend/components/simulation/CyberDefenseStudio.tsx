'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Flame,
  Activity,
  Lock,
  Unlock,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  THREAT_SCENARIOS,
  ThreatScenario,
} from '@/lib/cyberDefenseEngine';
import { SoundFx } from '@/lib/soundFx';

export const CyberDefenseStudio: React.FC = () => {
  const [selectedThreat, setSelectedThreat] = useState<ThreatScenario>(THREAT_SCENARIOS[0]);
  const [isAttacking, setIsAttacking] = useState<boolean>(false);
  const [defenseActive, setDefenseActive] = useState<boolean>(false);
  const [blockedCount, setBlockedCount] = useState<number>(0);
  const [stateTableLoad, setStateTableLoad] = useState<number>(12); // %

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAttacking) {
      interval = setInterval(() => {
        if (defenseActive) {
          setBlockedCount((prev) => prev + Math.floor(Math.random() * 240 + 80));
          setStateTableLoad((prev) => Math.max(15, prev - 3));
          SoundFx.playPacketDrop();
        } else {
          setStateTableLoad((prev) => Math.min(100, prev + 5));
          SoundFx.playPacketDrop();
        }
      }, 400);
    }
    return () => clearInterval(interval);
  }, [isAttacking, defenseActive]);

  const toggleAttack = () => {
    if (!isAttacking) {
      SoundFx.playPacketDrop();
      setIsAttacking(true);
      setStateTableLoad(45);
    } else {
      setIsAttacking(false);
      setStateTableLoad(12);
    }
  };

  const toggleDefense = () => {
    SoundFx.playTerminalKeyPress();
    const next = !defenseActive;
    setDefenseActive(next);
    if (next) {
      SoundFx.playSuccessChime();
    }
  };

  const selectScenario = (sc: ThreatScenario) => {
    SoundFx.playTerminalKeyPress();
    setSelectedThreat(sc);
    setIsAttacking(false);
    setDefenseActive(false);
    setBlockedCount(0);
    setStateTableLoad(12);
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
                Version 4.7 Cyber-Defense
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold">
                Red / Blue Threat Engine
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Volumetric DoS, MITM & Cryptographic Mitigations
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={isAttacking ? 'outline' : 'primary'}
            size="sm"
            onClick={toggleAttack}
            leftIcon={<Flame className={`w-3.5 h-3.5 ${isAttacking ? 'text-rose-400 animate-pulse' : ''}`} />}
          >
            {isAttacking ? 'Stop Attack Barrage' : 'Launch Threat Vector'}
          </Button>

          <Button
            variant={defenseActive ? 'primary' : 'outline'}
            size="sm"
            onClick={toggleDefense}
            leftIcon={defenseActive ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> : <Shield className="w-3.5 h-3.5 text-indigo-400" />}
          >
            {defenseActive ? 'Mitigation Active (Protected)' : 'Deploy Blue-Team Defense'}
          </Button>
        </div>
      </div>

      {/* Main Grid: Attack Vector Selection (Left) & Live Defense Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 6 Cols: Attack Scenarios */}
        <div className="lg:col-span-6 p-5 flex flex-col gap-3 bg-[#0c0e17]">
          <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-rose-400" /> Select Red-Team Threat Vector
          </span>

          <div className="space-y-2">
            {THREAT_SCENARIOS.map((sc) => {
              const isSelected = selectedThreat.id === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => selectScenario(sc)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all flex flex-col gap-1.5 ${
                    isSelected
                      ? 'border-rose-500/80 bg-rose-950/20 shadow-glow-rose'
                      : 'border-[#262c42] bg-[#121522] hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      {sc.name}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                      {sc.defaultPps.toLocaleString()} PPS
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-relaxed">{sc.attackMechanism}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 6 Cols: Blue-Team Telemetry & Cryptographic Neutralization */}
        <div className="lg:col-span-6 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" /> Live Perimeter Defense Telemetry
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                !isAttacking
                  ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  : defenseActive
                  ? 'bg-emerald-950/50 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-950/50 text-rose-400 border-rose-500/30 animate-pulse'
              }`}
            >
              {!isAttacking ? 'STATUS: NOMINAL' : defenseActive ? 'STATUS: ATTACK NEUTRALIZED' : 'STATUS: UNDER ACTIVE ATTACK'}
            </span>
          </div>

          {/* Telemetry Meters */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Firewall State Table</span>
              <span
                className={`text-lg font-bold font-mono ${
                  stateTableLoad > 80 ? 'text-rose-400' : stateTableLoad > 40 ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {stateTableLoad}% Capacity
              </span>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    stateTableLoad > 80 ? 'bg-rose-500' : stateTableLoad > 40 ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${stateTableLoad}%` }}
                />
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Malicious Discards</span>
              <span className="text-lg font-bold text-rose-400 font-mono">
                {blockedCount.toLocaleString()} Pkts
              </span>
              <span className="text-[9px] font-mono text-zinc-500 mt-2">Zero False-Positive Rate</span>
            </div>
          </div>

          {/* Applied Mitigation Information Box */}
          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                {defenseActive ? <Lock className="w-4 h-4 text-emerald-400" /> : <Unlock className="w-4 h-4 text-zinc-500" />}
                {selectedThreat.mitigationName}
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-500/30">
                {selectedThreat.mitigationTechnology}
              </span>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed">
              {selectedThreat.defenseExplanation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

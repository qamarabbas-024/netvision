'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Activity,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  AutonomousAiOpsEngine,
  TelemetryStreamMetric,
  SelfHealingPhase,
} from '@/lib/autonomousAiOpsEngine';
import { SoundFx } from '@/lib/soundFx';

export const AutonomousAiOpsStudio: React.FC = () => {
  const [metrics, setMetrics] = useState<TelemetryStreamMetric[]>(() =>
    AutonomousAiOpsEngine.getInitialTelemetry()
  );
  const [healingPhases, setHealingPhases] = useState<SelfHealingPhase[]>(() =>
    AutonomousAiOpsEngine.getHealingPlan()
  );
  const [isRemediating, setIsRemediating] = useState<boolean>(false);
  const [isResolved, setIsResolved] = useState<boolean>(false);

  const handleTriggerAnomaly = () => {
    setIsRemediating(true);
    setIsResolved(false);
    SoundFx.playPacketDrop();

    // 1. Degrade metric
    setMetrics((prev) =>
      prev.map((m) =>
        m.path.includes('input-power')
          ? { ...m, value: -18.2, status: 'CRITICAL' }
          : m
      )
    );

    // 2. Step through healing phases
    healingPhases.forEach((phase, idx) => {
      setTimeout(() => {
        setHealingPhases((prev) =>
          prev.map((p) => (p.phaseIndex <= phase.phaseIndex ? { ...p, completed: true } : p))
        );
        SoundFx.playTerminalKeyPress();

        if (idx === healingPhases.length - 1) {
          setIsRemediating(false);
          setIsResolved(true);
          setMetrics((prev) =>
            prev.map((m) =>
              m.path.includes('input-power')
                ? { ...m, value: -7.2, status: 'NOMINAL' }
                : m
            )
          );
          SoundFx.playSuccessChime();
        }
      }, (idx + 1) * 600);
    });
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setMetrics(AutonomousAiOpsEngine.getInitialTelemetry());
    setHealingPhases(AutonomousAiOpsEngine.getHealingPlan());
    setIsRemediating(false);
    setIsResolved(false);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">
                Version 5.9 Autonomous AI-Ops
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono font-bold">
                gNMI Closed-Loop Self-Healing
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Autonomous Self-Healing Network & OpenConfig Telemetry
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isRemediating && !isResolved ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleTriggerAnomaly}
              leftIcon={<AlertTriangle className="w-3.5 h-3.5 text-amber-300" />}
            >
              Trigger Optical Laser Power Anomaly
            </Button>
          ) : isRemediating ? (
            <Button variant="outline" size="sm" disabled>
              AI-Ops Closed-Loop Remediating...
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              Reset AI-Ops Arena
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: Streaming gNMI Telemetry (Left) & 5-Phase Closed-Loop Remediation (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 6 Cols: OpenConfig Streaming Telemetry */}
        <div className="lg:col-span-6 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-indigo-400" /> gNMI OpenConfig Stream
            </span>
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-500/30">
              Sample Interval: 100ms
            </span>
          </div>

          <div className="space-y-2.5">
            {metrics.map((m, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border transition-all flex flex-col gap-1 ${
                  m.status === 'CRITICAL'
                    ? 'border-rose-500/50 bg-rose-950/20'
                    : 'border-[#262c42] bg-[#121522]'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400 truncate max-w-[280px]">{m.path.split('/').pop()}</span>
                  <span
                    className={`font-bold ${
                      m.status === 'CRITICAL' ? 'text-rose-400 animate-pulse' : 'text-emerald-400'
                    }`}
                  >
                    {m.value} {m.unit}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-zinc-500 truncate">{m.path}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right 6 Cols: Closed-Loop Remediation Pipeline */}
        <div className="lg:col-span-6 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" /> Closed-Loop AI Remediation
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                isResolved
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                  : isRemediating
                  ? 'bg-amber-950/60 text-amber-300 border-amber-500/40 animate-pulse'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
              }`}
            >
              {isResolved ? 'INCIDENT REMEDIATED' : isRemediating ? 'HEALING IN PROGRESS' : 'AWAITING ANOMALY'}
            </span>
          </div>

          {/* Phase Steps */}
          <div className="space-y-2">
            {healingPhases.map((phase) => (
              <div
                key={phase.phaseIndex}
                className={`p-3 rounded-xl border text-xs font-mono transition-all flex items-start gap-2.5 ${
                  phase.completed
                    ? 'border-emerald-500/40 bg-emerald-950/20 text-white'
                    : 'border-[#262c42] bg-[#121522] text-zinc-500'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {phase.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-zinc-700 flex items-center justify-center text-[9px]">
                      {phase.phaseIndex}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="font-bold">{phase.phaseName}</span>
                  <span className="text-[10px] text-zinc-400">{phase.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

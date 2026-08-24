'use client';

import React, { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Play,
  RotateCcw,
  Terminal,
  Activity,
  FileCode,
  AlertTriangle,
  Code,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  IdsSignatureEngine,
  IdsState,
  IdsTrafficPayload,
} from '@/lib/idsSignatureEngine';
import { SoundFx } from '@/lib/soundFx';

export const IdsSignatureStudio: React.FC = () => {
  const [state, setState] = useState<IdsState>(() =>
    IdsSignatureEngine.getInitialState()
  );
  const [selectedPayloadId, setSelectedPayloadId] = useState<string>('pcap-sqli');
  const [isInspecting, setIsInspecting] = useState<boolean>(false);
  const [inspectionResult, setInspectionResult] = useState<{
    log: string;
    isThreat: boolean;
  } | null>(null);

  const selectedPayload =
    state.payloadCatalog.find((p) => p.id === selectedPayloadId) ||
    state.payloadCatalog[0];

  const handleInspectTraffic = () => {
    setIsInspecting(true);
    SoundFx.playPacketDispatch();

    setTimeout(() => {
      const result = IdsSignatureEngine.inspectPayload(state, selectedPayloadId);
      setState(result.newState);
      setInspectionResult({
        log: result.log,
        isThreat: !!result.matchedRule,
      });
      setIsInspecting(false);

      if (result.matchedRule) {
        SoundFx.playPacketDrop();
      } else {
        SoundFx.playSuccessChime();
      }
    }, 400);
  };

  const handleSwitchEngine = (engine: 'SURICATA_7' | 'SNORT_3') => {
    SoundFx.playTerminalKeyPress();
    setState((prev) => ({
      ...prev,
      engineMode: engine,
    }));
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setState(IdsSignatureEngine.getInitialState());
    setSelectedPayloadId('pcap-sqli');
    setInspectionResult(null);
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
                Version 9.5 IDS/IPS Sandboxing
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold">
                Snort 3 • Suricata 7 Hyperscan
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Snort / Suricata Threat Signature & Deep Packet Inspection
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleInspectTraffic}
            disabled={isInspecting}
            leftIcon={<Play className="w-3.5 h-3.5" />}
          >
            {isInspecting ? 'Evaluating Hyperscan...' : 'Inspect Live Packet'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Engine Selector Banner */}
      <div className="px-6 py-3 bg-[#0c0e17] border-b border-[#1b2030] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-zinc-400">DPI Engine:</span>
          {(['SURICATA_7', 'SNORT_3'] as const).map((eng) => (
            <button
              key={eng}
              onClick={() => handleSwitchEngine(eng)}
              className={`px-3 py-1 rounded-xl font-mono text-xs font-bold transition-all ${
                state.engineMode === eng
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20'
                  : 'bg-[#151928] text-zinc-400 hover:text-white border border-[#252c42]'
              }`}
            >
              {eng === 'SURICATA_7' ? 'Suricata 7 (Multi-Threaded)' : 'Snort 3 (Lua Rules)'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Packets Processed:</span>
            <span className="text-cyan-300 font-bold">{state.processedPackets}</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-300">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Alerts Triggered:</span>
            <span className="text-rose-400 font-bold">{state.alertsTriggered}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Traffic Payload & Rule Syntax (Left) & Alert Feed (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: Payload Inspector & Active Signatures */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-5 bg-[#0a0c13]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-rose-400" /> Live PCAP Payload Queue
            </span>
            <span className="text-[10px] font-mono text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/30">
              3 Test Vectors
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {state.payloadCatalog.map((p: IdsTrafficPayload) => {
              const isSelected = selectedPayloadId === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    SoundFx.playTerminalKeyPress();
                    setSelectedPayloadId(p.id);
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col gap-2 ${
                    isSelected
                      ? 'border-rose-500 bg-rose-950/20 shadow-glow-rose'
                      : 'border-[#202538] bg-[#10131f] hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white font-mono">{p.label}</span>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-zinc-400 border border-zinc-800">
                      {p.protocol.toUpperCase()} / {p.dstPort}
                    </span>
                  </div>

                  <div className="text-[10px] font-mono text-zinc-400 bg-black/40 p-2 rounded-xl border border-zinc-800/60 overflow-x-auto">
                    <span className="text-zinc-500">Payload:</span> {p.asciiPayload}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Outcome Banner */}
          {inspectionResult && (
            <div
              className={`p-4 rounded-2xl border text-xs flex items-start gap-3 animate-fadeIn ${
                inspectionResult.isThreat
                  ? 'bg-rose-950/20 border-rose-500/40 text-rose-300'
                  : 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
              }`}
            >
              {inspectionResult.isThreat ? (
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div className="flex flex-col gap-0.5">
                <span className="font-bold uppercase tracking-wider font-mono text-[10px]">
                  {inspectionResult.isThreat ? 'IDS Threat Intercepted' : 'Payload Passed Cleanly'}
                </span>
                <p className="leading-relaxed font-mono">{inspectionResult.log}</p>
              </div>
            </div>
          )}

          {/* Active Rules */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-zinc-400" /> Compiled Rule Engine
            </span>
            <div className="flex flex-col gap-2">
              {state.rules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-3 rounded-xl bg-black/60 border border-[#202538] font-mono text-[10px] text-zinc-300 flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-rose-400 font-bold">SID:{rule.sid} - {rule.msg}</span>
                    <span className="px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-400 border border-rose-500/40 text-[9px] uppercase font-bold">
                      {rule.action}
                    </span>
                  </div>
                  <div className="text-zinc-500 text-[9px] break-all">{rule.rawRule}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Real-time IDS Alert Log Stream */}
        <div className="lg:col-span-5 p-6 flex flex-col gap-5 bg-[#0d0f19]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-rose-400" /> Fast Alert Stream (fast.log)
            </span>
            <span className="text-[10px] font-mono text-zinc-400">
              Live Syslog Feed
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {state.alertFeed.map((alert, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#121624] border border-rose-500/20 flex flex-col gap-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-rose-400 font-bold text-[10px]">
                    [{alert.timestamp}] [1:{alert.sid}:1]
                  </span>
                  <span className="text-[9px] font-mono text-zinc-500">{alert.classtype}</span>
                </div>
                <div className="text-[11px] font-mono font-bold text-white leading-tight">
                  {alert.msg}
                </div>
                <div className="text-[10px] font-mono text-zinc-400 flex items-center justify-between pt-1">
                  <span>Src: {alert.src}</span>
                  <span>Dst: {alert.dst}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import {
  Cpu,
  Activity,
  Layers,
  CheckCircle2,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  NeuromorphicEngine,
  NeuromorphicState,
} from '@/lib/neuromorphicEngine';
import { SoundFx } from '@/lib/soundFx';

export const NeuromorphicPacketStudio: React.FC = () => {
  const [state, setState] = useState<NeuromorphicState>(() =>
    NeuromorphicEngine.getInitialState()
  );
  const [isInjecting, setIsInjecting] = useState<boolean>(false);
  const [snnLog, setSnnLog] = useState<string | null>(null);

  const handleInjectStealthAnomaly = () => {
    setIsInjecting(true);
    SoundFx.playPacketDrop();

    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        totalSpikesEmitted: prev.totalSpikesEmitted + 4200,
        layers: prev.layers.map((l, idx) => ({
          ...l,
          membranePotentialMv: idx === 2 ? -48.2 : -52.0, // Threshold breach (-50mV)
          spikeFiringRateHz: l.spikeFiringRateHz + 450,
          anomalyDetected: idx === 2,
        })),
      }));
      setSnnLog(
        '⚡ LIF Neuron Membrane Potential breached threshold (-50 mV) on Layer-3! Zero-day stealth exfiltration detected in 0.24 µs with only 12.8 µW power consumption.'
      );
      setIsInjecting(false);
      SoundFx.playSuccessChime();
    }, 500);
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setState(NeuromorphicEngine.getInitialState());
    setSnnLog(null);
  };

  const totalPower = state.layers
    .reduce((acc, l) => acc + l.powerConsumptionMicroWatts, 0)
    .toFixed(1);

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                Version 8.2 Neuromorphic SNN
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                LIF Neurons • Event-Driven Spike Trains
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Neuromorphic Spiking Neural Network Edge Packet Classification
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isInjecting ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleInjectStealthAnomaly}
              leftIcon={<Zap className="w-3.5 h-3.5" />}
            >
              Inject Stealth Spike Anomaly
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Processing Spike Train...
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset
          </Button>
        </div>
      </div>

      {/* Main Grid: LIF Neuron Layers (Left) & Energy & Spike Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: LIF Layers */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" /> Leaky Integrate-and-Fire (LIF) Layers
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              Spikes: {state.totalSpikesEmitted.toLocaleString()}
            </span>
          </div>

          <div className="space-y-3">
            {state.layers.map((layer) => (
              <div
                key={layer.layerId}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col gap-2 ${
                  layer.anomalyDetected
                    ? 'border-rose-500/50 bg-rose-950/20'
                    : 'border-[#262c42] bg-[#121522]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono">{layer.layerId}</span>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold border ${
                      layer.anomalyDetected
                        ? 'bg-rose-950/60 text-rose-300 border-rose-500/40 animate-pulse'
                        : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {layer.anomalyDetected ? 'THRESHOLD BREACH (SPIKE)' : 'RESTING STATE'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-zinc-400">
                  <div>Neurons: <span className="text-white">{layer.neuronCount}</span></div>
                  <div>Potential: <span className={layer.membranePotentialMv > -50 ? 'text-rose-400 font-bold' : 'text-cyan-300'}>{layer.membranePotentialMv} mV</span></div>
                  <div>Rate: <span className="text-emerald-400 font-bold">{layer.spikeFiringRateHz} Hz</span></div>
                </div>
              </div>
            ))}
          </div>

          {snnLog && (
            <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-xs font-mono text-rose-200 leading-relaxed animate-in fade-in">
              {snnLog}
            </div>
          )}
        </div>

        {/* Right 5 Cols: Micro-Watt Power vs GPU */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" /> Ultra-Low Power Physics
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Neuromorphic SNN</span>
              <span className="text-lg font-bold text-emerald-400 font-mono mt-1">{totalPower} µW</span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">Event-driven asynchronous</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Standard GPU Inference</span>
              <span className="text-lg font-bold text-rose-400 font-mono mt-1">45.0 W</span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1">3,500,000x more power</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> SNN Edge Advantages
            </div>
            <div>• Neurons consume zero energy when no packets or spikes are arriving</div>
            <div>• Temporal spike intervals preserve sub-nanosecond jitter features without buffering</div>
            <div>• Enables AI packet security directly inside low-power SmartNICs and IoT sensors</div>
          </div>
        </div>
      </div>
    </div>
  );
};

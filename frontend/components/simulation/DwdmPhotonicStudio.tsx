'use client';

import React, { useState } from 'react';
import {
  Sun,
  Activity,
  Layers,
  CheckCircle2,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  DwdmOpticsEngine,
  OpticalLambdaChannel,
} from '@/lib/dwdmOpticsEngine';
import { SoundFx } from '@/lib/soundFx';

export const DwdmPhotonicStudio: React.FC = () => {
  const [channels, setChannels] = useState<OpticalLambdaChannel[]>(() =>
    DwdmOpticsEngine.getInitialChannels()
  );
  const [isEdfaPumped, setIsEdfaPumped] = useState<boolean>(false);

  const handlePumpEdfa = () => {
    SoundFx.playPacketDispatch();
    setIsEdfaPumped(true);
    setChannels((prev) =>
      prev.map((ch) => ({
        ...ch,
        osnrDb: +(ch.osnrDb + 5.2).toFixed(1),
        berStatus: 'ERROR_FREE',
      }))
    );
    setTimeout(() => {
      SoundFx.playSuccessChime();
    }, 400);
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setIsEdfaPumped(false);
    setChannels(DwdmOpticsEngine.getInitialChannels());
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00f0ff]">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
                Version 6.6 Photonic DWDM
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                800G Coherent C-Band ROADM
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Dense Wavelength Division Multiplexing & Optical ROADM Matrix
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isEdfaPumped ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handlePumpEdfa}
              leftIcon={<Zap className="w-3.5 h-3.5" />}
            >
              Pump EDFA Optical Amplifier (+5.2 dB)
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              Reset Optical State
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: C-Band Optical Channels (Left) & ROADM Optical Routing (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: Optical Channels */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#00f0ff]" /> ITU-T 100 GHz Grid Optical Lambdas
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
              Total Capacity: 3.2 Tbps
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {channels.map((ch) => (
              <div
                key={ch.channelNumber}
                className="p-3.5 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono">
                    λ{ch.channelNumber} • {ch.wavelengthNm} nm
                  </span>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                      ch.berStatus === 'ERROR_FREE'
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                        : 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {ch.berStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-zinc-400 mt-1">
                  <div>Freq: {ch.frequencyThz} THz</div>
                  <div>Mod: <span className="text-cyan-300">{ch.modulation}</span></div>
                  <div>OSNR: <span className="text-emerald-400 font-bold">{ch.osnrDb} dB</span></div>
                  <div>ROADM: <span className="text-purple-300">{ch.roadmAction}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: ROADM Routing Physics */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" /> Photonic ROADM Switch Architecture
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                isEdfaPumped
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 animate-pulse'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
              }`}
            >
              {isEdfaPumped ? 'EDFA 980nm PUMP ACTIVE' : 'PASSIVE TRANSMISSION'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#121522] border border-[#262c42] space-y-2 text-[11px] font-mono text-zinc-400">
            <span className="text-xs font-bold text-white block">Wavelength-Selective Switching (WSS)</span>
            <div>• All-optical switching without electronic conversion bottlenecks</div>
            <div>• 96 Channels in C-Band delivering up to 76.8 Tbps per single strand of glass</div>
            <div>• Real-time digital signal processor (DSP) chromatic dispersion compensation</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Coherent DSP Modulation
            </div>
            <div>• Dual-Polarization (DP) doubling spectral efficiency</div>
            <div>• 64-QAM symbol constellation transmitting 6 bits per optical symbol</div>
          </div>
        </div>
      </div>
    </div>
  );
};

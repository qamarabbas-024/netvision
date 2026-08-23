'use client';

import React, { useState } from 'react';
import {
  Wifi,
  Radio,
  Zap,
  Layers,
  Sliders,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  Wifi7RfPhysicsEngine,
  Wifi7BandLink,
} from '@/lib/wifi7RfPhysicsEngine';
import { SoundFx } from '@/lib/soundFx';

export const Wifi7RfPhysicsStudio: React.FC = () => {
  const [links, setLinks] = useState<Wifi7BandLink[]>(() => Wifi7RfPhysicsEngine.getInitialMloLinks());
  const [distanceMeters, setDistanceMeters] = useState<number>(5);
  const [wallType, setWallType] = useState<'NONE' | 'DRYWALL' | 'CONCRETE'>('NONE');
  const [isPunctured, setIsPunctured] = useState<boolean>(false);

  const wallLossDbm = wallType === 'DRYWALL' ? 4 : wallType === 'CONCRETE' ? 14 : 0;
  const pathLoss = Wifi7RfPhysicsEngine.calculateFspl(distanceMeters, 6.0, wallLossDbm);
  const aggregateThroughput = links.reduce((acc, l) => acc + (l.status === 'ACTIVE' ? l.throughputMbps : 0), 0);

  const handlePunctureChannel = () => {
    SoundFx.playPacketDrop();
    setIsPunctured(true);
    setLinks((prev) =>
      prev.map((l) =>
        l.frequencyGhz === 5.0
          ? { ...l, status: 'PUNCTURED', throughputMbps: 1440, channelWidthMhz: 80 }
          : l
      )
    );
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setIsPunctured(false);
    setDistanceMeters(5);
    setWallType('NONE');
    setLinks(Wifi7RfPhysicsEngine.getInitialMloLinks());
    SoundFx.playSuccessChime();
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00f0ff]">
            <Wifi className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
                Version 5.3 Wireless Physics
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                802.11be MLO & 4096-QAM
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Wi-Fi 7 Multi-Link Operation & 320 MHz RF Attenuation Studio
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isPunctured ? (
            <Button variant="primary" size="sm" onClick={handlePunctureChannel} leftIcon={<Zap className="w-3.5 h-3.5" />}>
              Simulate Radar Preamble Puncturing
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              Reset Spectrum
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: MLO Tri-Band Aggregation (Left) & RF Signal Attenuation Controls (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: MLO Active Band Pipelines */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#00f0ff]" /> MLO Simultaneous Tri-Band Aggregation
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              Aggregated: {(aggregateThroughput / 1000).toFixed(2)} Gbps
            </span>
          </div>

          <div className="space-y-3">
            {links.map((link) => (
              <div
                key={link.frequencyGhz}
                className="p-4 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Radio className="w-4 h-4 text-[#00f0ff]" />
                    <span className="text-xs font-bold text-white">
                      {link.frequencyGhz} GHz Ultra-Band ({link.channelWidthMhz} MHz Channel)
                    </span>
                  </div>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                      link.status === 'PUNCTURED'
                        ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {link.status}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-[10px] font-mono text-zinc-400 pt-2 border-t border-[#262c42]/60">
                  <div>Modulation: <span className="text-white font-bold">{link.modulation}</span></div>
                  <div>RSSI: <span className="text-white font-bold">{link.rssiDbm - (distanceMeters * 2) - wallLossDbm} dBm</span></div>
                  <div>SNR: <span className="text-emerald-400 font-bold">{link.snrDb} dB</span></div>
                  <div>PHY Rate: <span className="text-[#00f0ff] font-bold">{link.throughputMbps} Mbps</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: RF Physics & Path Loss Environment */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#00f0ff]" /> RF Environment Controls
            </span>
            <span className="text-[10px] font-mono text-cyan-400">
              FSPL Path Loss: {pathLoss} dB
            </span>
          </div>

          {/* Distance Slider */}
          <div className="p-3.5 rounded-2xl bg-[#121522] border border-[#262c42] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">Client Distance from AP</span>
              <span className="font-mono text-[#00f0ff]">{distanceMeters} Meters</span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              value={distanceMeters}
              onChange={(e) => {
                SoundFx.playTerminalKeyPress();
                setDistanceMeters(Number(e.target.value));
              }}
              className="w-full accent-[#00f0ff] bg-zinc-800"
            />
          </div>

          {/* Wall Material Selector */}
          <div className="p-3.5 rounded-2xl bg-[#121522] border border-[#262c42] space-y-2">
            <span className="text-xs font-bold text-white block">Intervening Obstacle Barrier</span>
            <div className="grid grid-cols-3 gap-2">
              {(['NONE', 'DRYWALL', 'CONCRETE'] as const).map((w) => (
                <button
                  key={w}
                  onClick={() => {
                    SoundFx.playTerminalKeyPress();
                    setWallType(w);
                  }}
                  className={`p-2 rounded-xl text-[10px] font-mono font-bold border transition-all ${
                    wallType === w
                      ? 'border-[#00f0ff] bg-cyan-950/40 text-white shadow-glow-cyan'
                      : 'border-[#262c42] bg-[#0c0e17] text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  {w === 'NONE' ? 'Clear Line-of-Sight' : w === 'DRYWALL' ? 'Drywall (-4dB)' : 'Concrete (-14dB)'}
                </button>
              ))}
            </div>
          </div>

          {/* 4096-QAM Density Banner */}
          <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00f0ff]" />
              <span className="text-zinc-300">4096-QAM Constellation</span>
            </div>
            <span className="font-bold text-[#00f0ff]">12 Bits / Symbol</span>
          </div>
        </div>
      </div>
    </div>
  );
};

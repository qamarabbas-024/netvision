'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Binary, Cpu, RotateCcw, Hash } from 'lucide-react';

const BIT_WEIGHTS = [128, 64, 32, 16, 8, 4, 2, 1];

export const BinaryConverterVisual: React.FC = () => {
  const [bits, setBits] = useState<number[]>([1, 1, 0, 0, 1, 0, 1, 0]); // Default: 202 (0xCA)

  const toggleBit = (index: number) => {
    setBits((prev) => {
      const next = [...prev];
      next[index] = next[index] === 1 ? 0 : 1;
      return next;
    });
  };

  const setFromDecimal = (val: number) => {
    const clamped = Math.max(0, Math.min(255, val));
    const newBits = [];
    for (let i = 7; i >= 0; i--) {
      newBits.push((clamped >> i) & 1);
    }
    setBits(newBits);
  };

  const resetBits = () => setBits([0, 0, 0, 0, 0, 0, 0, 0]);

  // Calculations
  const decimalValue = bits.reduce((acc, bit, idx) => acc + bit * BIT_WEIGHTS[idx], 0);
  const upperNibbleBits = bits.slice(0, 4);
  const lowerNibbleBits = bits.slice(4, 8);
  const upperNibbleDec = upperNibbleBits.reduce((acc, bit, idx) => acc + bit * [8, 4, 2, 1][idx], 0);
  const lowerNibbleDec = lowerNibbleBits.reduce((acc, bit, idx) => acc + bit * [8, 4, 2, 1][idx], 0);
  const upperHexChar = upperNibbleDec.toString(16).toUpperCase();
  const lowerHexChar = lowerNibbleDec.toString(16).toUpperCase();
  const hexString = `0x${upperHexChar}${lowerHexChar}`;

  const activeWeights = bits
    .map((b, idx) => (b === 1 ? BIT_WEIGHTS[idx] : null))
    .filter((w): w is number => w !== null);

  return (
    <Card className="p-5 sm:p-7 glass-panel-glow border border-[#00f0ff]/30 shadow-glow-cyan flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#272732] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="cyan">FOUNDATIONAL INTERACTIVE VISUALIZER</Badge>
            <span className="text-[11px] font-mono text-zinc-400">8-Bit Positional System</span>
          </div>
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Binary className="w-5 h-5 text-[#00f0ff]" /> Binary ↔ Decimal ↔ Hexadecimal Converter
          </h3>
        </div>

        <Button variant="secondary" size="sm" onClick={resetBits} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
          Reset (0)
        </Button>
      </div>

      {/* Primary Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Decimal Display */}
        <div className="p-4 rounded-2xl bg-[#121217] border border-purple-500/30 flex flex-col items-center justify-center text-center">
          <span className="text-[11px] font-mono text-purple-300 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
            <Hash className="w-3.5 h-3.5" /> Base-10 Decimal
          </span>
          <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
            {decimalValue}
          </span>
          <span className="text-[10px] font-mono text-zinc-500 mt-1">Range: 0 to 255 (IPv4 Octet)</span>
        </div>

        {/* Binary String */}
        <div className="p-4 rounded-2xl bg-[#121217] border border-[#00f0ff]/30 flex flex-col items-center justify-center text-center">
          <span className="text-[11px] font-mono text-[#00f0ff] font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
            <Binary className="w-3.5 h-3.5" /> Base-2 Binary (1 Byte)
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-wider">
            {upperNibbleBits.join('')} <span className="text-zinc-600 font-light">|</span> {lowerNibbleBits.join('')}
          </span>
          <span className="text-[10px] font-mono text-zinc-500 mt-1">8 Bits = 2 Nibbles</span>
        </div>

        {/* Hexadecimal String */}
        <div className="p-4 rounded-2xl bg-[#121217] border border-amber-400/30 flex flex-col items-center justify-center text-center">
          <span className="text-[11px] font-mono text-amber-300 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5" /> Base-16 Hexadecimal
          </span>
          <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
            {hexString}
          </span>
          <span className="text-[10px] font-mono text-zinc-500 mt-1">MAC & IPv6 Address Notation</span>
        </div>
      </div>

      {/* 8-Bit Interactive Switch Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold">
            Click bits to toggle state (0 = Off, 1 = On):
          </span>
          <span className="text-xs font-mono text-zinc-500">Left: Most Significant (MSB) → Right: Least (LSB)</span>
        </div>

        {/* Upper Nibble & Lower Nibble Headers */}
        <div className="grid grid-cols-2 gap-3 mb-2">
          <div className="text-center py-1 px-2 rounded-lg bg-[#181820] border border-[#272732] text-[11px] font-mono text-zinc-400">
            Upper Nibble: <strong className="text-amber-400 font-bold">{upperNibbleBits.join('')}</strong> = {upperNibbleDec} = <strong className="text-[#00f0ff]">0x{upperHexChar}</strong>
          </div>
          <div className="text-center py-1 px-2 rounded-lg bg-[#181820] border border-[#272732] text-[11px] font-mono text-zinc-400">
            Lower Nibble: <strong className="text-amber-400 font-bold">{lowerNibbleBits.join('')}</strong> = {lowerNibbleDec} = <strong className="text-[#00f0ff]">0x{lowerHexChar}</strong>
          </div>
        </div>

        {/* The 8 Interactive Bit Buttons */}
        <div className="grid grid-cols-8 gap-1.5 sm:gap-2" role="group" aria-label="8-Bit Binary Switch Register">
          {bits.map((bit, idx) => {
            const weight = BIT_WEIGHTS[idx];
            const isOn = bit === 1;
            const isNibbleBoundary = idx === 3;

            return (
              <button
                key={idx}
                type="button"
                role="switch"
                aria-checked={isOn}
                aria-label={`Bit position ${8 - idx} (weight ${weight}): currently ${isOn ? '1 (On)' : '0 (Off)'}. Click to toggle.`}
                onClick={() => toggleBit(idx)}
                className={`flex flex-col items-center justify-center p-2.5 sm:p-3.5 rounded-xl border transition-all cursor-pointer select-none relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b] ${
                  isOn
                    ? 'bg-gradient-to-b from-[#00f0ff]/20 to-[#00f0ff]/5 border-[#00f0ff] shadow-glow-cyan text-white'
                    : 'bg-[#121217] border-[#272732] text-zinc-500 hover:border-zinc-500'
                } ${isNibbleBoundary ? 'mr-0.5 sm:mr-1' : ''}`}
              >
                {/* Weight Tag */}
                <span className={`text-[10px] sm:text-xs font-mono font-bold block mb-1 ${isOn ? 'text-[#00f0ff]' : 'text-zinc-500'}`}>
                  {weight}
                </span>

                {/* Bit Value */}
                <span className={`text-xl sm:text-2xl font-extrabold font-mono ${isOn ? 'text-white' : 'text-zinc-600'}`}>
                  {bit}
                </span>

                {/* Status Indicator */}
                <span className={`text-[9px] font-mono mt-1 uppercase font-semibold ${isOn ? 'text-emerald-400' : 'text-zinc-600'}`}>
                  {isOn ? 'ON' : 'OFF'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Arithmetic Summation Breakdown */}
      <div className="p-4 rounded-xl bg-[#0e0e13] border border-[#272732] font-mono text-xs text-zinc-300 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-zinc-400 text-[11px] mb-1">
          <span className="font-semibold text-white">POSITIONS CONTRIBUTING TO VALUE:</span>
          <span>{activeWeights.length} of 8 bits active</span>
        </div>
        <div className="text-sm">
          {activeWeights.length > 0 ? (
            <span>
              {activeWeights.join(' + ')} = <strong className="text-[#00f0ff] font-extrabold">{decimalValue}</strong>
            </span>
          ) : (
            <span className="text-zinc-500">All bits off (0) = 0</span>
          )}
        </div>
      </div>

      {/* Common Networking Value Presets */}
      <div>
        <span className="text-xs font-mono text-zinc-400 block mb-2 font-semibold">
          Common Networking Values (Click to load):
        </span>
        <div className="flex flex-wrap gap-2">
          {[
            { label: '0 (All 0s)', val: 0 },
            { label: '128 (/25 Mask)', val: 128 },
            { label: '192 (/26 Mask / Class C)', val: 192 },
            { label: '224 (/27 Mask / Multicast)', val: 224 },
            { label: '240 (/28 Mask)', val: 240 },
            { label: '252 (/30 P2P Mask)', val: 252 },
            { label: '255 (All 1s / 0xFF / Broadcast)', val: 255 },
            { label: '10 (0x0A Private IP)', val: 10 },
            { label: '172 (0xAC Private IP)', val: 172 },
            { label: '202 (0xCA Example)', val: 202 },
          ].map((preset) => (
            <button
              key={preset.val}
              type="button"
              onClick={() => setFromDecimal(preset.val)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                decimalValue === preset.val
                  ? 'bg-[#00f0ff]/20 border-[#00f0ff] text-[#00f0ff] font-bold'
                  : 'bg-[#181820] border-[#272732] text-zinc-400 hover:text-white hover:border-zinc-500'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};

'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
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
    <Card className="p-5 sm:p-6 bg-[#15181e] border border-[#232732] shadow-subtle flex flex-col gap-6 rounded-xl font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#232732] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-[#111317] border border-[#232732] text-[10px] font-mono font-bold text-[#00c8f8] uppercase">
              REGISTER // 8-BIT POSITIONAL
            </span>
            <span className="text-[11px] font-mono text-[#64748b]">BASE CONVERSIONS</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#f3f4f6] flex items-center gap-2">
            <Binary className="w-5 h-5 text-[#00c8f8]" /> Binary ↔ Decimal ↔ Hexadecimal Converter
          </h3>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={resetBits}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          className="bg-[#111317] border-[#232732] text-[#94a3b8] hover:text-white hover:border-zinc-500 rounded-lg text-xs"
        >
          Reset (0)
        </Button>
      </div>

      {/* Primary Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Decimal Display */}
        <div className="p-4 rounded-lg bg-[#111317] border border-[#232732] flex flex-col items-center justify-center text-center">
          <span className="text-[11px] font-mono text-purple-300 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
            <Hash className="w-3.5 h-3.5" /> Base-10 Decimal
          </span>
          <span className="text-3xl sm:text-4xl font-bold font-mono text-[#f3f4f6] tracking-tight">
            {decimalValue}
          </span>
          <span className="text-[10px] font-mono text-[#64748b] mt-1">Range: 0 to 255 (IPv4 Octet)</span>
        </div>

        {/* Binary String */}
        <div className="p-4 rounded-lg bg-[#111317] border border-[#232732] flex flex-col items-center justify-center text-center">
          <span className="text-[11px] font-mono text-[#00c8f8] font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
            <Binary className="w-3.5 h-3.5" /> Base-2 Binary (1 Byte)
          </span>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-[#f3f4f6] tracking-wider">
            {upperNibbleBits.join('')} <span className="text-[#64748b] font-light">|</span> {lowerNibbleBits.join('')}
          </span>
          <span className="text-[10px] font-mono text-[#64748b] mt-1">8 Bits = 2 Nibbles</span>
        </div>

        {/* Hexadecimal String */}
        <div className="p-4 rounded-lg bg-[#111317] border border-[#232732] flex flex-col items-center justify-center text-center">
          <span className="text-[11px] font-mono text-amber-300 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5" /> Base-16 Hexadecimal
          </span>
          <span className="text-3xl sm:text-4xl font-bold font-mono text-[#f3f4f6] tracking-tight">
            {hexString}
          </span>
          <span className="text-[10px] font-mono text-[#64748b] mt-1">MAC & IPv6 Address Notation</span>
        </div>
      </div>

      {/* 8-Bit Interactive Switch Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-[#94a3b8] uppercase tracking-wider font-semibold">
            Click bits to toggle state (0 = Off, 1 = On):
          </span>
          <span className="text-xs font-mono text-[#64748b]">Left: MSB → Right: LSB</span>
        </div>

        {/* Upper Nibble & Lower Nibble Headers */}
        <div className="grid grid-cols-2 gap-3 mb-2 font-mono">
          <div className="text-center py-1 px-2 rounded bg-[#111317] border border-[#232732] text-[11px] text-[#94a3b8]">
            Upper: <strong className="text-amber-400 font-bold">{upperNibbleBits.join('')}</strong> = {upperNibbleDec} = <strong className="text-[#00c8f8]">0x{upperHexChar}</strong>
          </div>
          <div className="text-center py-1 px-2 rounded bg-[#111317] border border-[#232732] text-[11px] text-[#94a3b8]">
            Lower: <strong className="text-amber-400 font-bold">{lowerNibbleBits.join('')}</strong> = {lowerNibbleDec} = <strong className="text-[#00c8f8]">0x{lowerHexChar}</strong>
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
                className={`flex flex-col items-center justify-center p-2.5 sm:p-3.5 rounded-lg border transition-all cursor-pointer select-none relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00c8f8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1115] ${
                  isOn
                    ? 'bg-[#00c8f8]/15 border-[#00c8f8] text-white shadow-sm'
                    : 'bg-[#111317] border-[#232732] text-[#64748b] hover:border-zinc-500'
                } ${isNibbleBoundary ? 'mr-0.5 sm:mr-1' : ''}`}
              >
                {/* Weight Tag */}
                <span className={`text-[10px] sm:text-xs font-mono font-bold block mb-1 ${isOn ? 'text-[#00c8f8]' : 'text-[#64748b]'}`}>
                  {weight}
                </span>

                {/* Bit Value */}
                <span className={`text-xl sm:text-2xl font-bold font-mono ${isOn ? 'text-white' : 'text-[#475569]'}`}>
                  {bit}
                </span>

                {/* Status Indicator */}
                <span className={`text-[9px] font-mono mt-1 uppercase font-semibold ${isOn ? 'text-emerald-400' : 'text-[#475569]'}`}>
                  {isOn ? 'ON' : 'OFF'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Arithmetic Summation Breakdown */}
      <div className="p-3.5 rounded-lg bg-[#111317] border border-[#232732] font-mono text-xs text-[#94a3b8] flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[#64748b] text-[11px] mb-1">
          <span className="font-semibold text-zinc-300">POSITIONS CONTRIBUTING TO VALUE:</span>
          <span>{activeWeights.length} of 8 bits active</span>
        </div>
        <div className="text-sm">
          {activeWeights.length > 0 ? (
            <span>
              {activeWeights.join(' + ')} = <strong className="text-[#00c8f8] font-bold">{decimalValue}</strong>
            </span>
          ) : (
            <span className="text-[#64748b]">All bits off (0) = 0</span>
          )}
        </div>
      </div>

      {/* Common Networking Value Presets */}
      <div>
        <span className="text-xs font-mono text-[#64748b] block mb-2 font-semibold uppercase">
          Preset Values (Click to load):
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
              className={`px-2.5 py-1 rounded text-xs font-mono border transition-all ${
                decimalValue === preset.val
                  ? 'bg-[#00c8f8]/20 border-[#00c8f8] text-[#00c8f8] font-bold'
                  : 'bg-[#111317] border-[#232732] text-[#94a3b8] hover:text-white hover:border-zinc-500'
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

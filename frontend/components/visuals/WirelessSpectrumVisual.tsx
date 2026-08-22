'use client';

import React, { useState } from 'react';
import { Radio, Wifi, Zap, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';

export const WirelessSpectrumVisual: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bands' | 'channels' | 'bonding' | 'csmaca'>('bands');

  // Channel Overlap State (2.4 GHz)
  const [selectedChannels, setSelectedChannels] = useState<number[]>([1, 6, 11]);

  // CSMA/CA Simulation State
  const [csmaState, setCsmaState] = useState<'idle' | 'sensing' | 'backoff' | 'transmitting' | 'ack'>('idle');
  const [backoffCounter, setBackoffCounter] = useState<number>(0);
  const [ccaResult, setCcaResult] = useState<'clear' | 'busy'>('clear');

  const toggleChannel = (ch: number) => {
    if (selectedChannels.includes(ch)) {
      if (selectedChannels.length > 1) {
        setSelectedChannels(selectedChannels.filter((c) => c !== ch));
      }
    } else {
      if (selectedChannels.length < 3) {
        setSelectedChannels([...selectedChannels, ch].sort((a, b) => a - b));
      } else {
        setSelectedChannels([selectedChannels[1], selectedChannels[2], ch].sort((a, b) => a - b));
      }
    }
  };

  // Check if chosen channels have overlap
  const hasInterference = () => {
    for (let i = 0; i < selectedChannels.length; i++) {
      for (let j = i + 1; j < selectedChannels.length; j++) {
        if (Math.abs(selectedChannels[i] - selectedChannels[j]) < 5) {
          return true;
        }
      }
    }
    return false;
  };

  const isRecommendedPlan =
    selectedChannels.length === 3 &&
    selectedChannels[0] === 1 &&
    selectedChannels[1] === 6 &&
    selectedChannels[2] === 11;

  const runCsmaStep = () => {
    if (csmaState === 'idle') {
      setCsmaState('sensing');
      setCcaResult(Math.random() > 0.3 ? 'clear' : 'busy');
    } else if (csmaState === 'sensing') {
      if (ccaResult === 'busy') {
        setCsmaState('backoff');
        setBackoffCounter(Math.floor(Math.random() * 8) + 4);
      } else {
        setCsmaState('transmitting');
      }
    } else if (csmaState === 'backoff') {
      if (backoffCounter > 1) {
        setBackoffCounter((prev) => prev - 1);
      } else {
        setCsmaState('transmitting');
      }
    } else if (csmaState === 'transmitting') {
      setCsmaState('ack');
    } else {
      setCsmaState('idle');
    }
  };

  const resetCsma = () => {
    setCsmaState('idle');
    setBackoffCounter(0);
    setCcaResult('clear');
  };

  return (
    <div className="p-4 sm:p-6 rounded-2xl glass-panel border border-[#272732] flex flex-col gap-5 sm:gap-6 text-slate-100">
      {/* HEADER & TABS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-wider font-semibold block mb-1">
            IEEE 802.11 Wireless Architecture
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
            RF Spectrum, Wi-Fi Channels & CSMA/CA
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-[#121217] p-1.5 rounded-xl border border-[#272732] w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('bands')}
            className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all ${
              activeTab === 'bands'
                ? 'bg-[#00f0ff] text-black shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Spectrum Bands
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('channels')}
            className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all ${
              activeTab === 'channels'
                ? 'bg-[#00f0ff] text-black shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            2.4 GHz Channels
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bonding')}
            className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all ${
              activeTab === 'bonding'
                ? 'bg-[#00f0ff] text-black shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Generations & Bonding
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('csmaca')}
            className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all ${
              activeTab === 'csmaca'
                ? 'bg-[#00f0ff] text-black shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            CSMA/CA Simulator
          </button>
        </div>
      </div>

      {/* TAB 1: SPECTRUM BANDS COMPARISON */}
      {activeTab === 'bands' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#16161e] border border-[#272732] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                2.4 GHz Band
              </span>
              <Radio className="w-4 h-4 text-amber-400" />
            </div>
            <h4 className="text-white font-bold text-sm">Long Range & High Penetration</h4>
            <div className="space-y-2 text-xs text-slate-300 font-mono">
              <div className="flex justify-between border-b border-[#22222d] pb-1">
                <span className="text-slate-400">Spectrum:</span>
                <span>2.400 – 2.4835 GHz</span>
              </div>
              <div className="flex justify-between border-b border-[#22222d] pb-1">
                <span className="text-slate-400">Non-Overlapping Ch:</span>
                <span className="text-amber-400 font-bold">Only 3 (Ch 1, 6, 11)</span>
              </div>
              <div className="flex justify-between border-b border-[#22222d] pb-1">
                <span className="text-slate-400">Wall Penetration:</span>
                <span className="text-emerald-400">Excellent (Long wavelength)</span>
              </div>
              <div className="flex justify-between border-b border-[#22222d] pb-1">
                <span className="text-slate-400">Interference Risk:</span>
                <span className="text-rose-400">High (Microwaves, BT)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Channel Width:</span>
                <span>20 MHz (40 MHz not recommended)</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Best for legacy IoT devices and wide-area coverage where obstacles exist.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#16161e] border border-[#272732] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                5 GHz Band
              </span>
              <Wifi className="w-4 h-4 text-cyan-400" />
            </div>
            <h4 className="text-white font-bold text-sm">High Speed & Wide Channels</h4>
            <div className="space-y-2 text-xs text-slate-300 font-mono">
              <div className="flex justify-between border-b border-[#22222d] pb-1">
                <span className="text-slate-400">Spectrum:</span>
                <span>5.150 – 5.850 GHz</span>
              </div>
              <div className="flex justify-between border-b border-[#22222d] pb-1">
                <span className="text-slate-400">Non-Overlapping Ch:</span>
                <span className="text-cyan-400 font-bold">24+ Channels (20 MHz)</span>
              </div>
              <div className="flex justify-between border-b border-[#22222d] pb-1">
                <span className="text-slate-400">Wall Penetration:</span>
                <span className="text-amber-400">Moderate (Higher attenuation)</span>
              </div>
              <div className="flex justify-between border-b border-[#22222d] pb-1">
                <span className="text-slate-400">Interference Risk:</span>
                <span className="text-emerald-400">Low (Radar DFS channels)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Channel Bonding:</span>
                <span>20 / 40 / 80 / 160 MHz</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Standard enterprise workhorse band providing gigabit throughput with low contention.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#16161e] border border-[#272732] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                6 GHz Band (Wi-Fi 6E / 7)
              </span>
              <Zap className="w-4 h-4 text-purple-400" />
            </div>
            <h4 className="text-white font-bold text-sm">Pristine Ultra-Wide Bandwidth</h4>
            <div className="space-y-2 text-xs text-slate-300 font-mono">
              <div className="flex justify-between border-b border-[#22222d] pb-1">
                <span className="text-slate-400">Spectrum:</span>
                <span>5.925 – 7.125 GHz (1.2 GHz)</span>
              </div>
              <div className="flex justify-between border-b border-[#22222d] pb-1">
                <span className="text-slate-400">Non-Overlapping Ch:</span>
                <span className="text-purple-400 font-bold">59 Channels (20 MHz)</span>
              </div>
              <div className="flex justify-between border-b border-[#22222d] pb-1">
                <span className="text-slate-400">Wall Penetration:</span>
                <span className="text-rose-400">Low (Line of sight best)</span>
              </div>
              <div className="flex justify-between border-b border-[#22222d] pb-1">
                <span className="text-slate-400">Legacy Contention:</span>
                <span className="text-emerald-400">Zero (No Wi-Fi 4/5 clients)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Channel Bonding:</span>
                <span>Up to 320 MHz (Wi-Fi 7)</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Ultra-high capacity for AR/VR, dense venues, and multi-gigabit wireless backhauls.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: 2.4 GHZ CHANNELS & OVERLAP */}
      {activeTab === 'channels' && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl bg-[#16161e] border border-[#272732]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
              <div>
                <h4 className="text-white font-bold text-sm">2.4 GHz Channel Overlap & Spectrum Analyzer</h4>
                <p className="text-xs text-slate-400">
                  Select up to 3 active AP channels to test frequency spacing and adjacent channel interference.
                </p>
              </div>
              <div
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 ${
                  hasInterference()
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : isRecommendedPlan
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                }`}
              >
                {hasInterference() ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5" /> Adjacent Channel Interference!
                  </>
                ) : isRecommendedPlan ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ideal Plan (Channels 1, 6, 11)
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> No Direct Overlap
                  </>
                )}
              </div>
            </div>

            {/* CHANNEL BUTTONS 1-11 */}
            <div className="grid grid-cols-11 gap-1 sm:gap-2 my-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((ch) => {
                const isSelected = selectedChannels.includes(ch);
                const isStandard = ch === 1 || ch === 6 || ch === 11;
                return (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => toggleChannel(ch)}
                    className={`py-2 rounded-lg flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? isStandard
                          ? 'bg-[#00f0ff] text-black font-bold ring-2 ring-[#00f0ff]/50'
                          : 'bg-rose-500 text-white font-bold ring-2 ring-rose-500/50'
                        : isStandard
                        ? 'bg-[#1b1b26] text-slate-300 hover:bg-[#232332] border border-[#303042]'
                        : 'bg-[#121217] text-slate-500 hover:text-slate-300 border border-[#20202a]'
                    }`}
                  >
                    <span className="text-xs font-mono font-bold">Ch {ch}</span>
                    <span className="text-[10px] opacity-75 font-mono">{2412 + (ch - 1) * 5}M</span>
                  </button>
                );
              })}
            </div>

            {/* SPECTRAL DOME SIMULATION */}
            <div className="relative h-24 bg-[#0e0e13] rounded-xl border border-[#22222f] p-2 overflow-hidden flex items-end">
              <div className="absolute inset-x-0 bottom-0 h-[1px] bg-slate-700" />
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((ch) => {
                const isSelected = selectedChannels.includes(ch);
                const leftPercent = ((ch - 1) / 10) * 80 + 10;
                if (!isSelected) return null;
                return (
                  <div
                    key={ch}
                    className={`absolute bottom-0 rounded-t-full transition-all duration-300 ${
                      ch === 1 || ch === 6 || ch === 11
                        ? 'bg-gradient-to-t from-cyan-500/30 to-cyan-400/80 border-t-2 border-cyan-300'
                        : 'bg-gradient-to-t from-rose-500/30 to-rose-400/80 border-t-2 border-rose-300'
                    }`}
                    style={{
                      left: `calc(${leftPercent}% - 35px)`,
                      width: '70px',
                      height: '75px',
                    }}
                  >
                    <div className="text-[10px] font-mono text-center font-bold text-white mt-1">
                      Ch {ch} (20MHz)
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 text-xs text-slate-400 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span>
                <strong>Why 1, 6, 11?</strong> Each 20 MHz channel spans ±10 MHz from center frequency. Centers must be separated by ≥25 MHz (5 channels) to avoid overlapping spectral masks.
              </span>
              <button
                type="button"
                onClick={() => setSelectedChannels([1, 6, 11])}
                className="text-xs font-mono text-[#00f0ff] hover:underline"
              >
                Reset to 1, 6, 11
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GENERATIONS & CHANNEL BONDING */}
      {activeTab === 'bonding' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-[#16161e] border border-[#272732]">
              <span className="text-[10px] font-mono font-bold text-amber-400">Wi-Fi 4 (802.11n)</span>
              <h5 className="text-white font-bold text-sm mt-0.5">MIMO & 40 MHz</h5>
              <div className="text-xs text-slate-400 font-mono mt-2 space-y-1">
                <div>Bands: 2.4 & 5 GHz</div>
                <div>Max Width: 40 MHz</div>
                <div>Modulation: 64-QAM</div>
                <div className="text-cyan-300 font-bold">Speed: Up to 600 Mbps</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#16161e] border border-[#272732]">
              <span className="text-[10px] font-mono font-bold text-cyan-400">Wi-Fi 5 (802.11ac)</span>
              <h5 className="text-white font-bold text-sm mt-0.5">80/160 MHz & MU-MIMO</h5>
              <div className="text-xs text-slate-400 font-mono mt-2 space-y-1">
                <div>Bands: 5 GHz only</div>
                <div>Max Width: 80 / 160 MHz</div>
                <div>Modulation: 256-QAM</div>
                <div className="text-cyan-300 font-bold">Speed: Up to 6.9 Gbps</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#16161e] border border-[#272732]">
              <span className="text-[10px] font-mono font-bold text-purple-400">Wi-Fi 6/6E (802.11ax)</span>
              <h5 className="text-white font-bold text-sm mt-0.5">OFDMA & High Density</h5>
              <div className="text-xs text-slate-400 font-mono mt-2 space-y-1">
                <div>Bands: 2.4, 5, 6 GHz</div>
                <div>Max Width: 160 MHz</div>
                <div>Modulation: 1024-QAM</div>
                <div className="text-cyan-300 font-bold">Speed: Up to 9.6 Gbps</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#16161e] border border-[#272732]">
              <span className="text-[10px] font-mono font-bold text-emerald-400">Wi-Fi 7 (802.11be)</span>
              <h5 className="text-white font-bold text-sm mt-0.5">320 MHz & MLO</h5>
              <div className="text-xs text-slate-400 font-mono mt-2 space-y-1">
                <div>Bands: 2.4, 5, 6 GHz</div>
                <div>Max Width: 320 MHz</div>
                <div>Modulation: 4096-QAM</div>
                <div className="text-cyan-300 font-bold">Speed: Up to 46 Gbps</div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#16161e] border border-[#272732]">
            <h4 className="text-white font-bold text-sm mb-2">Channel Bonding Architecture (5 GHz & 6 GHz)</h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2 rounded bg-[#0e0e13] border border-[#22222f] flex items-center justify-between">
                <span className="text-slate-300">20 MHz Primary Channel</span>
                <span className="text-slate-400">Standard single channel (e.g. Ch 36)</span>
              </div>
              <div className="p-2 rounded bg-[#0e0e13] border border-[#22222f] flex items-center justify-between">
                <span className="text-cyan-300 font-bold">40 MHz Bonded Channel</span>
                <span className="text-slate-400">Combines 2 adjacent 20 MHz channels (2x Throughput)</span>
              </div>
              <div className="p-2 rounded bg-[#0e0e13] border border-[#22222f] flex items-center justify-between">
                <span className="text-purple-300 font-bold">80 MHz Bonded Channel</span>
                <span className="text-slate-400">Combines 4 adjacent 20 MHz channels (4x Throughput)</span>
              </div>
              <div className="p-2 rounded bg-[#0e0e13] border border-[#22222f] flex items-center justify-between">
                <span className="text-emerald-300 font-bold">160 / 320 MHz Bonded Channel</span>
                <span className="text-slate-400">Ultra-wide bandwidth for multi-gigabit Wi-Fi 6E and Wi-Fi 7</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CSMA/CA CONTENTION SIMULATOR */}
      {activeTab === 'csmaca' && (
        <div className="p-4 rounded-xl bg-[#16161e] border border-[#272732] flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h4 className="text-white font-bold text-sm">CSMA/CA Half-Duplex Contention Flow</h4>
              <p className="text-xs text-slate-400">
                Step through the Carrier Sense Multiple Access with Collision Avoidance protocol.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={resetCsma}
                className="px-2.5 py-1 text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
              <button
                type="button"
                onClick={runCsmaStep}
                className="px-3.5 py-1.5 text-xs font-mono font-bold bg-[#00f0ff] text-black rounded-lg hover:shadow-[0_0_12px_rgba(0,240,255,0.4)] transition-all"
              >
                {csmaState === 'idle'
                  ? 'Start Carrier Sense (CCA)'
                  : csmaState === 'sensing'
                  ? 'Proceed past CCA'
                  : csmaState === 'backoff'
                  ? `Decrement Slot (${backoffCounter})`
                  : csmaState === 'transmitting'
                  ? 'Complete Frame Transmission'
                  : 'Transmit Next Frame'}
              </button>
            </div>
          </div>

          {/* STATE PROGRESSION */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <div
              className={`p-3 rounded-xl border text-xs font-mono ${
                csmaState === 'sensing'
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-[#101016] border-[#22222d] text-slate-400'
              }`}
            >
              <div className="font-bold mb-1">1. Carrier Sense (CCA)</div>
              <div>Listen to RF medium before transmitting.</div>
            </div>

            <div
              className={`p-3 rounded-xl border text-xs font-mono ${
                csmaState === 'backoff'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-[#101016] border-[#22222d] text-slate-400'
              }`}
            >
              <div className="font-bold mb-1">2. Random Backoff</div>
              <div>
                {csmaState === 'backoff'
                  ? `Waiting ${backoffCounter} slot time units...`
                  : 'Wait DIFS + random slot countdown if medium busy.'}
              </div>
            </div>

            <div
              className={`p-3 rounded-xl border text-xs font-mono ${
                csmaState === 'transmitting'
                  ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                  : 'bg-[#101016] border-[#22222d] text-slate-400'
              }`}
            >
              <div className="font-bold mb-1">3. Transmit 802.11 Frame</div>
              <div>Push frame over half-duplex radio channel.</div>
            </div>

            <div
              className={`p-3 rounded-xl border text-xs font-mono ${
                csmaState === 'ack'
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-[#101016] border-[#22222d] text-slate-400'
              }`}
            >
              <div className="font-bold mb-1">4. Positive Layer 2 ACK</div>
              <div>Receiver verifies frame and returns immediate ACK.</div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#0e0e13] border border-[#22222f] text-xs text-slate-300">
            <strong>Why Positive ACKs?</strong> Because wireless radios cannot transmit and receive simultaneously on the same channel, they cannot detect collisions mid-transmission (no CSMA/CD). Every unicast transmission requires an explicit Layer 2 ACK from the receiver.
          </div>
        </div>
      )}
    </div>
  );
};

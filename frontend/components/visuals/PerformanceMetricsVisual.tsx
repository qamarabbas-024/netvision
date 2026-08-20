'use client';

import React, { useState } from 'react';
import { Activity, Clock, Gauge, AlertTriangle, Radio, Info, CheckCircle2, XCircle } from 'lucide-react';

type MetricMode = 'latency' | 'throughput' | 'loss' | 'jitter';

export const PerformanceMetricsVisual: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MetricMode>('latency');

  // Mode 1: Latency state
  const [distanceKm, setDistanceKm] = useState<number>(2000); // 2,000 km intercontinental
  const [mediumSpeedKmS, setMediumSpeedKmS] = useState<number>(200000); // Fiber = 200,000 km/s
  const [packetSizeBytes, setPacketSizeBytes] = useState<number>(1500); // 1500 Bytes MTU
  const [linkRateMbps, setLinkRateMbps] = useState<number>(100); // 100 Mbps FastEthernet

  // Mode 2: Throughput state
  const [rawLinkRateMbps, setRawLinkRateMbps] = useState<number>(100);
  const [fileSizeBytesMb, setFileSizeBytesMb] = useState<number>(50); // 50 MB file
  const [overheadPercent, setOverheadPercent] = useState<number>(10); // 10% L2-L4 header & ACK overhead

  // Mode 3: Packet Loss state
  const [packetCount, setPacketCount] = useState<number>(20);
  const [lossRatePercent, setLossRatePercent] = useState<number>(15);
  const [queueCapacity, setQueueCapacity] = useState<number>(10);

  // Mode 4: Jitter state
  const [baseLatencyMs, setBaseLatencyMs] = useState<number>(30);
  const [jitterVarianceMs, setJitterVarianceMs] = useState<number>(25);
  const [dejitterBufferMs, setDejitterBufferMs] = useState<number>(20);

  // --- CALCULATIONS ---

  // Mode 1: Latency calculations
  // D_prop = d / s
  const propDelaySec = distanceKm / mediumSpeedKmS;
  const propDelayMs = propDelaySec * 1000;
  // D_trans = L / R
  const packetBits = packetSizeBytes * 8;
  const linkRateBps = linkRateMbps * 1000000;
  const transDelaySec = packetBits / linkRateBps;
  const transDelayMs = transDelaySec * 1000;
  const totalDelayMs = propDelayMs + transDelayMs;

  // Mode 2: Throughput calculations
  const effectiveGoodputMbps = rawLinkRateMbps * (1 - overheadPercent / 100);
  const transferTimeSecGoodput = (fileSizeBytesMb * 8) / effectiveGoodputMbps;

  // Mode 3: Loss calculations
  const expectedLostPackets = Math.round((packetCount * lossRatePercent) / 100);
  const deliveredPackets = Math.max(0, packetCount - expectedLostPackets);

  // Mode 4: Jitter calculations
  const minLatencyMs = Math.max(5, baseLatencyMs - jitterVarianceMs / 2);
  const maxLatencyMs = baseLatencyMs + jitterVarianceMs / 2;
  const bufferOverflowDrop = jitterVarianceMs > dejitterBufferMs * 1.5;
  const isVoipQualityOk = jitterVarianceMs <= 15 && !bufferOverflowDrop;

  return (
    <div className="p-5 sm:p-6 rounded-xl bg-[#181a1f] border border-[#2a2e39] shadow-instrument flex flex-col gap-6 font-sans">
      {/* Instrument Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2e39] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#14151a] text-[#38bdf8] border border-[#2a2e39]">
              INSTRUMENT: NET-102 // TELEMETRY_ANALYZER
            </span>
            <span className="text-[11px] text-[#8e95a5]">STATUS: ARMED • LIVE FEED</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#f4f5f7] flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#38bdf8]" /> Network Performance Telemetry Analyzer
          </h3>
        </div>

        {/* Instrument Channel Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#14151a] border border-[#2a2e39] overflow-x-auto shrink-0 font-mono" role="tablist" aria-label="Telemetry Channels">
          <button
            role="tab"
            aria-selected={activeTab === 'latency'}
            onClick={() => setActiveTab('latency')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'latency'
                ? 'bg-[#2563eb] text-white shadow-sm font-bold'
                : 'text-[#8e95a5] hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> CH 1: Latency
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'throughput'}
            onClick={() => setActiveTab('throughput')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'throughput'
                ? 'bg-[#10b981] text-black shadow-sm font-bold'
                : 'text-[#8e95a5] hover:text-white'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" /> CH 2: Goodput
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'loss'}
            onClick={() => setActiveTab('loss')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'loss'
                ? 'bg-[#ef4444] text-white shadow-sm font-bold'
                : 'text-[#8e95a5] hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" /> CH 3: Loss
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'jitter'}
            onClick={() => setActiveTab('jitter')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'jitter'
                ? 'bg-[#f59e0b] text-black shadow-sm font-bold'
                : 'text-[#8e95a5] hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" /> CH 4: Jitter
          </button>
        </div>
      </div>

      {/* --- TAB 1: LATENCY & DELAY --- */}
      {activeTab === 'latency' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Interactive Control Panel */}
            <div className="p-5 rounded-xl bg-[#121217] border border-[#272732] flex flex-col gap-5">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#272732] pb-3">
                <Clock className="w-4 h-4 text-[#00f0ff]" /> Latency Telemetry Variables
              </h4>

              {/* Distance Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-300 font-semibold">Distance ($d$):</span>
                  <span className="font-mono text-[#00f0ff] font-bold">{distanceKm.toLocaleString()} km</span>
                </div>
                <input
                  type="range"
                  aria-label="Distance in kilometers"
                  min="10"
                  max="36000"
                  step="50"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Number(e.target.value))}
                  className="w-full accent-[#00f0ff] bg-zinc-800 rounded-lg cursor-pointer h-2"
                />
                <span className="text-[11px] text-zinc-500 font-mono">
                  {distanceKm < 500 ? 'LAN / Regional Metro Fiber' : distanceKm < 15000 ? 'Intercontinental Subsea Cable' : 'Geostationary Satellite Link'}
                </span>
              </div>

              {/* Medium Speed Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-zinc-300 font-semibold">Propagation Speed ($s$):</label>
                <select
                  aria-label="Propagation speed medium"
                  value={mediumSpeedKmS}
                  onChange={(e) => setMediumSpeedKmS(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg bg-[#09090b] border border-[#272732] text-xs font-mono text-white focus:outline-none focus:border-[#00f0ff]"
                >
                  <option value={200000}>Fiber Optic Cable (approx. 200,000 km/s - 2/3 speed of light)</option>
                  <option value={210000}>Copper Cable Category 6 (approx. 210,000 km/s)</option>
                  <option value={300000}>Radio / Satellite in Free Space (300,000 km/s - speed of light)</option>
                </select>
              </div>

              {/* Packet Size Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-300 font-semibold">Packet Size ($L$):</span>
                  <span className="font-mono text-purple-400 font-bold">{packetSizeBytes} Bytes ({packetBits.toLocaleString()} bits)</span>
                </div>
                <input
                  type="range"
                  aria-label="Packet size in bytes"
                  min="64"
                  max="1500"
                  step="32"
                  value={packetSizeBytes}
                  onChange={(e) => setPacketSizeBytes(Number(e.target.value))}
                  className="w-full accent-purple-400 bg-zinc-800 rounded-lg cursor-pointer h-2"
                />
              </div>

              {/* Link Speed Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-zinc-300 font-semibold">Link Bandwidth ($R$):</label>
                <select
                  value={linkRateMbps}
                  onChange={(e) => setLinkRateMbps(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg bg-[#09090b] border border-[#272732] text-xs font-mono text-white focus:outline-none focus:border-[#00f0ff]"
                >
                  <option value={10}>10 Mbps (Legacy Ethernet)</option>
                  <option value={100}>100 Mbps (FastEthernet)</option>
                  <option value={1000}>1,000 Mbps / 1 Gbps (Gigabit Ethernet)</option>
                  <option value={10000}>10,000 Mbps / 10 Gbps (10G Optical Egress)</option>
                </select>
              </div>
            </div>

            {/* Calculations & Results Display */}
            <div className="p-5 rounded-xl bg-[#121217] border border-[#272732] flex flex-col justify-between gap-5">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#272732] pb-3 mb-4">
                  <Gauge className="w-4 h-4 text-emerald-400" /> Latency Breakdown & Telemetry Output
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="p-3.5 rounded-xl bg-[#09090b] border border-[#272732]">
                    <span className="text-[11px] text-zinc-400 font-mono uppercase block mb-1">Propagation Delay ($D_{'{prop}'}$)</span>
                    <span className="text-lg font-mono font-bold text-[#00f0ff]">{propDelayMs < 0.1 ? `${(propDelayMs * 1000).toFixed(1)} µs` : `${propDelayMs.toFixed(2)} ms`}</span>
                    <span className="text-[10px] text-zinc-500 font-mono block mt-1">Formula: $d / s$</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#09090b] border border-[#272732]">
                    <span className="text-[11px] text-zinc-400 font-mono uppercase block mb-1">Transmission Delay ($D_{'{trans}'}$)</span>
                    <span className="text-lg font-mono font-bold text-purple-400">{transDelayMs < 0.1 ? `${(transDelayMs * 1000).toFixed(1)} µs` : `${transDelayMs.toFixed(3)} ms`}</span>
                    <span className="text-[10px] text-zinc-500 font-mono block mt-1">Formula: $L / R$</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#00f0ff]/5 border border-[#00f0ff]/30 flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Simplified Calculated Delay (D_prop + D_trans):</span>
                    <span className="text-xl font-mono font-extrabold text-[#00f0ff]">{totalDelayMs.toFixed(2)} ms</span>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-mono">(Excludes router processing D_proc & queueing D_queue delays)</span>
                </div>
              </div>

              {/* Dynamic Educational Explanation ("Why the result changed") */}
              <div className="p-4 rounded-xl bg-[#181820] border border-zinc-800 text-xs text-zinc-300 flex items-start gap-2.5">
                <Info className="w-5 h-5 text-[#00f0ff] shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="text-white block mb-1">Why did the result change?</strong>
                  {distanceKm > 10000 ? (
                    <span>
                      Physical distance is the dominant component (D_prop = {propDelayMs.toFixed(1)} ms). Because signal propagation speed through optical fiber or free space is capped by physics (approx. 200,000 - 300,000 km/s), distance creates an unbypassable physical delay regardless of how fast link speed (R) is. <em>Note: This simplified model excludes router processing (D_proc) and queueing (D_queue) delays.</em>
                    </span>
                  ) : linkRateMbps <= 100 && packetSizeBytes >= 1000 ? (
                    <span>
                      On lower link rates (R = {linkRateMbps} Mbps), pushing a full MTU frame (1,500 Bytes) onto the wire requires significant serialization time (D_trans = {transDelayMs.toFixed(2)} ms). Upgrading link bandwidth directly reduces D_trans. <em>Note: Excludes router processing (D_proc) and queueing (D_queue) delays.</em>
                    </span>
                  ) : (
                    <span>
                      Calculated delay is the sum of signal flight time (D_prop) plus hardware serialization time (D_trans). Increasing distance inflates D_prop, while increasing packet size or decreasing link speed inflates D_trans. <em>Note: Real-world end-to-end latency also includes router processing (D_proc) and queueing (D_queue) delays.</em>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: THROUGHPUT VS GOODPUT --- */}
      {activeTab === 'throughput' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Control Panel */}
            <div className="p-5 rounded-xl bg-[#121217] border border-[#272732] flex flex-col gap-5">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#272732] pb-3">
                <Gauge className="w-4 h-4 text-emerald-400" /> Throughput Telemetry Controls
              </h4>

              {/* Link Rate Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-zinc-300 font-semibold">Raw Physical Link Rate (Bandwidth):</label>
                <select
                  value={rawLinkRateMbps}
                  onChange={(e) => setRawLinkRateMbps(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg bg-[#09090b] border border-[#272732] text-xs font-mono text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value={10}>10 Mbps (Wi-Fi / DSL Link)</option>
                  <option value={100}>100 Mbps (FastEthernet Broadband)</option>
                  <option value={1000}>1,000 Mbps / 1 Gbps (Fiber Broadband)</option>
                  <option value={10000}>10,000 Mbps / 10 Gbps (Data Center Backplane)</option>
                </select>
              </div>

              {/* File Size Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-300 font-semibold">Application File Download Size:</span>
                  <span className="font-mono text-emerald-400 font-bold">{fileSizeBytesMb} MB</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="500"
                  step="5"
                  value={fileSizeBytesMb}
                  onChange={(e) => setFileSizeBytesMb(Number(e.target.value))}
                  className="w-full accent-emerald-400 bg-zinc-800 rounded-lg cursor-pointer h-2"
                />
              </div>

              {/* Overhead Percentage Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-300 font-semibold">Protocol Overhead & Retransmissions:</span>
                  <span className="font-mono text-amber-400 font-bold">{overheadPercent}%</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="35"
                  step="1"
                  value={overheadPercent}
                  onChange={(e) => setOverheadPercent(Number(e.target.value))}
                  className="w-full accent-amber-400 bg-zinc-800 rounded-lg cursor-pointer h-2"
                />
                <span className="text-[11px] text-zinc-500 font-mono">
                  Ethernet (18B) + IP (20B) + TCP (20B) headers + ACK ACKs & TCP retransmissions
                </span>
              </div>
            </div>

            {/* Results Display */}
            <div className="p-5 rounded-xl bg-[#121217] border border-[#272732] flex flex-col justify-between gap-5">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#272732] pb-3 mb-4">
                  <Activity className="w-4 h-4 text-emerald-400" /> Throughput vs Goodput Output
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="p-3.5 rounded-xl bg-[#09090b] border border-[#272732]">
                    <span className="text-[11px] text-zinc-400 font-mono uppercase block mb-1">Gross Link Throughput</span>
                    <span className="text-lg font-mono font-bold text-[#00f0ff]">{rawLinkRateMbps} Mbps</span>
                    <span className="text-[10px] text-zinc-500 font-mono block mt-1">Raw bit transfer rate</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#09090b] border border-[#272732]">
                    <span className="text-[11px] text-zinc-400 font-mono uppercase block mb-1">Net Usable Goodput</span>
                    <span className="text-lg font-mono font-bold text-emerald-400">{effectiveGoodputMbps.toFixed(1)} Mbps</span>
                    <span className="text-[10px] text-zinc-500 font-mono block mt-1">Application payload rate</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-400/5 border border-emerald-400/30 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">File Transfer Time ({fileSizeBytesMb} MB):</span>
                    <span className="text-xl font-mono font-extrabold text-emerald-400">{transferTimeSecGoodput.toFixed(2)} sec</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden flex">
                    <div className="bg-emerald-400 h-full" style={{ width: `${100 - overheadPercent}%` }} title="Usable Data Payload" />
                    <div className="bg-amber-500 h-full" style={{ width: `${overheadPercent}%` }} title="Protocol Overhead" />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                    <span className="text-emerald-400 font-semibold">Usable Payload: {(100 - overheadPercent).toFixed(0)}%</span>
                    <span className="text-amber-400 font-semibold">Protocol Headers & Retransmissions: {overheadPercent}%</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Explanation */}
              <div className="p-4 rounded-xl bg-[#181820] border border-zinc-800 text-xs text-zinc-300 flex items-start gap-2.5">
                <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="text-white block mb-1">Why is Goodput lower than Throughput?</strong>
                  Goodput measures strictly useful application payload delivered to the end user. Every packet transmitted on the wire includes mandatory protocol headers (Ethernet MAC headers, IP routing headers, TCP transport headers) plus duplicate retransmitted packets. As overhead increases ({overheadPercent}%), Goodput drops below raw link bandwidth.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: PACKET LOSS --- */}
      {activeTab === 'loss' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Control Panel */}
            <div className="p-5 rounded-xl bg-[#121217] border border-[#272732] flex flex-col gap-5">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#272732] pb-3">
                <AlertTriangle className="w-4 h-4 text-rose-400" /> Packet Loss Simulation Controls
              </h4>

              {/* Transmitted Packet Count Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-300 font-semibold">Transmitted Packets:</span>
                  <span className="font-mono text-white font-bold">{packetCount} Packets</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="40"
                  step="2"
                  value={packetCount}
                  onChange={(e) => setPacketCount(Number(e.target.value))}
                  className="w-full accent-white bg-zinc-800 rounded-lg cursor-pointer h-2"
                />
              </div>

              {/* Loss Rate Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-300 font-semibold">Configured Link Loss / Drop Rate:</span>
                  <span className="font-mono text-rose-400 font-bold">{lossRatePercent}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="5"
                  value={lossRatePercent}
                  onChange={(e) => setLossRatePercent(Number(e.target.value))}
                  className="w-full accent-rose-400 bg-zinc-800 rounded-lg cursor-pointer h-2"
                />
              </div>

              {/* Router Queue Capacity Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-300 font-semibold">Router Buffer Memory Queue Capacity:</span>
                  <span className="font-mono text-purple-400 font-bold">{queueCapacity} Packets</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="5"
                  value={queueCapacity}
                  onChange={(e) => setQueueCapacity(Number(e.target.value))}
                  className="w-full accent-purple-400 bg-zinc-800 rounded-lg cursor-pointer h-2"
                />
              </div>
            </div>

            {/* Results Display */}
            <div className="p-5 rounded-xl bg-[#121217] border border-[#272732] flex flex-col justify-between gap-5">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#272732] pb-3 mb-4">
                  <Activity className="w-4 h-4 text-rose-400" /> Delivery Telemetry Visualizer
                </h4>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3.5 rounded-xl bg-[#09090b] border border-[#272732] flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-zinc-400 font-mono uppercase block">Delivered</span>
                      <span className="text-lg font-mono font-bold text-emerald-400">{deliveredPackets}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#09090b] border border-[#272732] flex items-center gap-3">
                    <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-zinc-400 font-mono uppercase block">Lost / Dropped</span>
                      <span className="text-lg font-mono font-bold text-rose-400">{expectedLostPackets}</span>
                    </div>
                  </div>
                </div>

                {/* Packet Grid Visualization */}
                <div className="p-4 rounded-xl bg-[#09090b] border border-[#272732] flex flex-col gap-2">
                  <span className="text-xs font-bold text-white">Packet Stream Telemetry:</span>
                  <div className="grid grid-cols-10 gap-1.5 py-1">
                    {Array.from({ length: packetCount }).map((_, idx) => {
                      const isLost = idx < expectedLostPackets;
                      return (
                        <div
                          key={idx}
                          title={isLost ? `Packet #${idx + 1}: DROPPED (Buffer Overflow / Corruption)` : `Packet #${idx + 1}: DELIVERED`}
                          className={`h-7 rounded-md font-mono text-[10px] font-bold flex items-center justify-center border transition-all ${
                            isLost
                              ? 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.3)]'
                              : 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          }`}
                        >
                          {idx + 1}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Dynamic Explanation */}
              <div className="p-4 rounded-xl bg-[#181820] border border-zinc-800 text-xs text-zinc-300 flex items-start gap-2.5">
                <Info className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="text-white block mb-1">What causes packet loss?</strong>
                  Packet loss occurs primarily when router egress queues overflow during network congestion (buffer exhaustion) or when physical signals suffer electrical/optical noise corruption. Lost packets force TCP to retransmit, increasing latency and reducing Goodput.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 4: JITTER & VARIANCE --- */}
      {activeTab === 'jitter' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Control Panel */}
            <div className="p-5 rounded-xl bg-[#121217] border border-[#272732] flex flex-col gap-5">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#272732] pb-3">
                <Radio className="w-4 h-4 text-amber-400" /> Jitter & Delay Variance Controls
              </h4>

              {/* Base Latency Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-300 font-semibold">Average Base Latency:</span>
                  <span className="font-mono text-[#00f0ff] font-bold">{baseLatencyMs} ms</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={baseLatencyMs}
                  onChange={(e) => setBaseLatencyMs(Number(e.target.value))}
                  className="w-full accent-[#00f0ff] bg-zinc-800 rounded-lg cursor-pointer h-2"
                />
              </div>

              {/* Jitter Variance Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-300 font-semibold">Jitter (Delay Variance):</span>
                  <span className="font-mono text-amber-400 font-bold">±{jitterVarianceMs} ms</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="2"
                  value={jitterVarianceMs}
                  onChange={(e) => setJitterVarianceMs(Number(e.target.value))}
                  className="w-full accent-amber-400 bg-zinc-800 rounded-lg cursor-pointer h-2"
                />
              </div>

              {/* Dejitter Buffer Size Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-300 font-semibold">Receiver De-Jitter Buffer Depth:</span>
                  <span className="font-mono text-purple-400 font-bold">{dejitterBufferMs} ms</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={dejitterBufferMs}
                  onChange={(e) => setDejitterBufferMs(Number(e.target.value))}
                  className="w-full accent-purple-400 bg-zinc-800 rounded-lg cursor-pointer h-2"
                />
              </div>
            </div>

            {/* Results Display */}
            <div className="p-5 rounded-xl bg-[#121217] border border-[#272732] flex flex-col justify-between gap-5">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#272732] pb-3 mb-4">
                  <Activity className="w-4 h-4 text-amber-400" /> Real-Time Voice/Video Quality Telemetry
                </h4>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3.5 rounded-xl bg-[#09090b] border border-[#272732]">
                    <span className="text-[10px] text-zinc-400 font-mono uppercase block mb-1">Latency Range</span>
                    <span className="text-lg font-mono font-bold text-white">{minLatencyMs.toFixed(0)} ms – {maxLatencyMs.toFixed(0)} ms</span>
                    <span className="text-[10px] text-zinc-500 font-mono block mt-1">Min vs Max arrival time</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#09090b] border border-[#272732]">
                    <span className="text-[10px] text-zinc-400 font-mono uppercase block mb-1">Voice Quality Status</span>
                    <span className={`text-sm font-bold block mt-1 ${isVoipQualityOk ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isVoipQualityOk ? '✓ Smooth VoIP Audio' : '⚠ Stutter / Buffer Underrun'}
                    </span>
                  </div>
                </div>

                {/* Packet Arrival Spacing Visualization */}
                <div className="p-4 rounded-xl bg-[#09090b] border border-[#272732] flex flex-col gap-2">
                  <span className="text-xs font-bold text-white">Packet Arrival Timing Timeline:</span>
                  <div className="relative h-12 bg-black/50 rounded-lg border border-zinc-800 flex items-center px-4 overflow-hidden">
                    {Array.from({ length: 6 }).map((_, idx) => {
                      // Calculate jittered position
                      const basePos = (idx + 1) * 15;
                      const jitterOffset = (idx % 2 === 0 ? 1 : -1) * (jitterVarianceMs * 0.2);
                      const clampedPos = Math.max(5, Math.min(90, basePos + jitterOffset));

                      return (
                        <div
                          key={idx}
                          style={{ left: `${clampedPos}%` }}
                          className="absolute flex flex-col items-center gap-0.5 -translate-x-1/2"
                          title={`Packet #${idx + 1}: Delay = ${(baseLatencyMs + jitterOffset).toFixed(1)}ms`}
                        >
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                          <span className="text-[9px] font-mono text-zinc-400">P{idx + 1}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Dynamic Explanation */}
              <div className="p-4 rounded-xl bg-[#181820] border border-zinc-800 text-xs text-zinc-300 flex items-start gap-2.5">
                <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="text-white block mb-1">Why does Jitter ruin voice calls?</strong>
                  Real-time voice and video calls depend on steady, rhythmic packet playback. When inter-packet arrival gaps vary wildly (high jitter = ±{jitterVarianceMs} ms), receiver playback buffers either empty completely (buffer underrun, causing audio dropouts and stutter) or fill up and discard late packets.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

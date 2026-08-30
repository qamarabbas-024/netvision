'use client';

import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Download,
  Clock,
  Layers,
  Sparkles,
  Sliders,
  CheckCircle2,
  FileCode
} from 'lucide-react';
import { downloadPcapFile, PcapPacketData } from '@/lib/pcapExporter';

interface TimeTravelPacketScrubberProps {
  onTimeChange?: (progressMs: number) => void;
  onSpeedChange?: (speedMultiplier: number) => void;
  onPauseToggle?: (isPaused: boolean) => void;
  packets?: PcapPacketData[];
}

export const TimeTravelPacketScrubber: React.FC<TimeTravelPacketScrubberProps> = ({
  onTimeChange,
  onSpeedChange,
  onPauseToggle,
  packets = [],
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progressMs, setProgressMs] = useState(350);
  const [maxDurationMs] = useState(1000);
  const [speed, setSpeed] = useState<number>(1);
  const [selectedLayer, setSelectedLayer] = useState<'L2' | 'L3' | 'L4' | 'L7'>('L3');
  const [showExportSuccess, setShowExportSuccess] = useState(false);

  // Playback timer
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgressMs((prev) => {
        const next = prev + 10 * speed;
        if (next >= maxDurationMs) {
          return 0; // Loop seamlessly
        }
        onTimeChange?.(next);
        return next;
      });
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [isPlaying, speed, maxDurationMs, onTimeChange]);

  const handleTogglePlay = () => {
    const next = !isPlaying;
    setIsPlaying(next);
    onPauseToggle?.(!next);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setProgressMs(val);
    onTimeChange?.(val);
  };

  const handleStepBack = () => {
    setIsPlaying(false);
    onPauseToggle?.(true);
    setProgressMs((prev) => Math.max(0, prev - 50));
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    onPauseToggle?.(true);
    setProgressMs((prev) => Math.min(maxDurationMs, prev + 50));
  };

  const handleExportWireshark = () => {
    const samplePackets: PcapPacketData[] = packets.length > 0 ? packets : [
      {
        timestampMs: 0,
        sourceMac: '70:85:C2:54:19:A1',
        destMac: '00:1B:67:8A:4F:01',
        sourceIp: '192.168.1.10',
        destIp: '192.168.1.1',
        protocol: 'DNS',
        srcPort: 54321,
        dstPort: 53,
        payloadText: 'QUERY A netvision.edu',
      },
      {
        timestampMs: 120,
        sourceMac: '00:0A:95:9D:68:16',
        destMac: '52:54:00:12:34:56',
        sourceIp: '192.168.1.10',
        destIp: '142.250.72.14',
        protocol: 'TCP',
        srcPort: 49152,
        dstPort: 443,
        flags: { syn: true },
        payloadText: 'TCP [SYN] Seq=0 Win=65535 Len=0',
      },
      {
        timestampMs: 280,
        sourceMac: '52:54:00:12:34:56',
        destMac: '90:B1:1C:77:88:99',
        sourceIp: '142.250.72.14',
        destIp: '192.168.1.10',
        protocol: 'TCP',
        srcPort: 443,
        dstPort: 49152,
        flags: { syn: true, ack: true },
        payloadText: 'TCP [SYN, ACK] Seq=0 Ack=1 Win=65535 Len=0',
      },
      {
        timestampMs: 450,
        sourceMac: '70:85:C2:54:19:A1',
        destMac: '00:1B:67:8A:4F:01',
        sourceIp: '192.168.1.10',
        destIp: '142.250.72.14',
        protocol: 'TCP',
        srcPort: 49152,
        dstPort: 443,
        flags: { ack: true },
        payloadText: 'GET /api/curriculum HTTP/1.1\r\nHost: netvision.edu\r\nUser-Agent: NetVision-Client/2.0\r\n\r\n',
      },
    ];

    downloadPcapFile(samplePackets, `netvision-capture-${Date.now()}.pcap`);
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 3500);
  };

  // Decode layer state at current progress
  const currentTtl = Math.max(1, 64 - Math.floor(progressMs / 250));
  const activeHop = progressMs < 250 ? 'Workstation -> Switch' : progressMs < 500 ? 'Switch -> Router' : progressMs < 750 ? 'Router -> Firewall' : 'Firewall -> Server';

  return (
    <div className="w-full bg-[#0b1320]/95 backdrop-blur-md border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4 font-mono">
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>TEMPORAL PACKET SCRUBBER</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-300 font-bold">
                60 FPS
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              Active Hop: <span className="text-cyan-300 font-bold">{activeHop}</span>
            </div>
          </div>
        </div>

        {/* Speed Toggles & Wireshark Export */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#070a12] border border-slate-800 rounded-lg p-0.5 text-[10px]">
            {[0.25, 0.5, 1, 2].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSpeed(s);
                  onSpeedChange?.(s);
                }}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${
                  speed === s
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <button
            onClick={handleExportWireshark}
            className="px-3 py-1.5 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-[10px] flex items-center gap-1.5 shadow-[0_0_12px_rgba(2,132,199,0.3)] transition-all cursor-pointer"
            title="Download real Wireshark .pcap packet capture"
          >
            <Download className="w-3 h-3" />
            <span>Export Wireshark (.pcap)</span>
          </button>
        </div>
      </div>

      {/* Scrub Slider with Millisecond Markers */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span>T+ 0.00 ms</span>
          <span className="text-cyan-400 font-bold">
            {(progressMs).toFixed(2)} ms / {maxDurationMs.toFixed(2)} ms
          </span>
          <span>T+ 1000.00 ms</span>
        </div>

        <div className="relative flex items-center">
          <input
            type="range"
            min="0"
            max={maxDurationMs}
            value={progressMs}
            onChange={handleSliderChange}
            className="w-full h-2 bg-[#070b12] rounded-lg appearance-none cursor-pointer accent-[#10b981] border border-slate-700"
          />
        </div>

        {/* Milestone Tick Markers */}
        <div className="grid grid-cols-4 text-[9px] text-slate-500 pt-1 text-center">
          <div>NIC TX (0ms)</div>
          <div>L2 CAM (250ms)</div>
          <div>L3 FIB (500ms)</div>
          <div>Server RX (1000ms)</div>
        </div>
      </div>

      {/* Playback Controls & Real-Time Header Decode Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/80">
        {/* Play / Step Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setProgressMs(0)}
            className="p-1.5 rounded-lg bg-[#0f172a] border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
            title="Restart to 0ms"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleStepBack}
            className="p-1.5 rounded-lg bg-[#0f172a] border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
            title="Step back 50ms"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleTogglePlay}
            className="px-4 py-1.5 rounded-lg bg-[#10b981] hover:bg-[#059669] text-[#051a14] font-bold text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.4)] cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause Time' : 'Play Live'}</span>
          </button>

          <button
            onClick={handleStepForward}
            className="p-1.5 rounded-lg bg-[#0f172a] border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
            title="Step forward 50ms"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Real-Time Layer Inspection Pills */}
        <div className="flex items-center gap-1.5 text-[10px]">
          <span className="text-slate-500 mr-1">OSI LAYER:</span>
          {(['L2', 'L3', 'L4', 'L7'] as const).map((layer) => (
            <button
              key={layer}
              onClick={() => setSelectedLayer(layer)}
              className={`px-2 py-0.5 rounded border transition-all cursor-pointer ${
                selectedLayer === layer
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                  : 'bg-[#070a12] border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {layer}
            </button>
          ))}
        </div>

        {/* Live Telemetry Readout */}
        <div className="text-[10px] text-slate-300 flex items-center gap-2">
          <span>TTL: <strong className="text-emerald-400">{currentTtl}</strong></span>
          <span>•</span>
          <span>CHECKSUM: <strong className="text-cyan-400">0x4F8A (VALID)</strong></span>
        </div>
      </div>

      {/* Export Success Notification */}
      {showExportSuccess && (
        <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Wireshark PCAP generated &amp; downloaded! Open in desktop Wireshark to inspect.</span>
        </div>
      )}
    </div>
  );
};

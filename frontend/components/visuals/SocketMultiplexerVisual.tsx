'use client';

import React, { useState } from 'react';
import {
  Globe,
  Terminal,
  Music,
  MessageSquare,
  Layers,
  Cpu,
  Zap,
} from 'lucide-react';

interface ActiveSocket {
  id: string;
  appName: string;
  icon: 'browser' | 'ssh' | 'spotify' | 'discord' | 'custom';
  protocol: 'TCP' | 'UDP';
  localIp: string;
  localPort: number;
  remoteHost: string;
  remoteIp: string;
  remotePort: number;
  serviceName: string;
  status: 'ESTABLISHED' | 'LISTENING' | 'TIME_WAIT';
  color: string;
  dataPayload: string;
}

export const SocketMultiplexerVisual: React.FC = () => {
  const [selectedSocketId, setSelectedSocketId] = useState<string>('socket-1');
  const [testPort, setTestPort] = useState<number>(443);
  const [isSimulatingDemux, setIsSimulatingDemux] = useState<boolean>(false);
  const [demuxStage, setDemuxStage] = useState<number>(0);

  const activeSockets: ActiveSocket[] = [
    {
      id: 'socket-1',
      appName: 'Chrome: Tab 1 (NetVision Docs)',
      icon: 'browser',
      protocol: 'TCP',
      localIp: '192.168.1.50',
      localPort: 51234,
      remoteHost: 'docs.netvision.edu',
      remoteIp: '104.21.48.12',
      remotePort: 443,
      serviceName: 'HTTPS',
      status: 'ESTABLISHED',
      color: '#00f0ff',
      dataPayload: 'GET /curriculum/layer-4 HTTP/2 (TLS 1.3 encrypted frame)',
    },
    {
      id: 'socket-2',
      appName: 'Chrome: Tab 2 (NetVision Sim)',
      icon: 'browser',
      protocol: 'TCP',
      localIp: '192.168.1.50',
      localPort: 51235,
      remoteHost: 'sim.netvision.edu',
      remoteIp: '104.21.48.12',
      remotePort: 443,
      serviceName: 'HTTPS',
      status: 'ESTABLISHED',
      color: '#38bdf8',
      dataPayload: 'WebSocket Frame (Live Topology Sync Data)',
    },
    {
      id: 'socket-3',
      appName: 'Spotify Music Stream',
      icon: 'spotify',
      protocol: 'TCP',
      localIp: '192.168.1.50',
      localPort: 52190,
      remoteHost: 'audio-ak.spotify.com',
      remoteIp: '35.186.224.25',
      remotePort: 4070,
      serviceName: 'Spotify Audio Protocol',
      status: 'ESTABLISHED',
      color: '#22c55e',
      dataPayload: 'Ogg Vorbis 320kbps Audio Stream Chunk #8412',
    },
    {
      id: 'socket-4',
      appName: 'OpenSSH Core Router Terminal',
      icon: 'ssh',
      protocol: 'TCP',
      localIp: '192.168.1.50',
      localPort: 53891,
      remoteHost: 'gw-core-r1.internal',
      remoteIp: '192.168.1.1',
      remotePort: 22,
      serviceName: 'SSH (Secure Shell)',
      status: 'ESTABLISHED',
      color: '#eab308',
      dataPayload: 'Encrypted SSH Session Key Exchange & Shell Keystrokes',
    },
    {
      id: 'socket-5',
      appName: 'Discord Realtime Voice Chat',
      icon: 'discord',
      protocol: 'UDP',
      localIp: '192.168.1.50',
      localPort: 54902,
      remoteHost: 'voice-us-east.discord.gg',
      remoteIp: '162.158.38.90',
      remotePort: 50001,
      serviceName: 'Realtime Voice UDP',
      status: 'ESTABLISHED',
      color: '#a855f7',
      dataPayload: 'Opus Audio Codec Realtime Voice Packets (Low Latency)',
    },
  ];

  const currentSocket = activeSockets.find((s) => s.id === selectedSocketId) || activeSockets[0];

  const getPortBand = (port: number) => {
    if (port >= 0 && port <= 1023) {
      return {
        band: 'Well-Known System Port',
        range: '0 – 1023',
        desc: 'Assigned by IANA for standard system daemons & protocols (HTTP, HTTPS, SSH, DNS, DHCP). Requires administrative privileges on Unix-like OSes.',
        badgeColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
      };
    } else if (port >= 1024 && port <= 49151) {
      return {
        band: 'Registered User Port',
        range: '1024 – 49151',
        desc: 'Assigned by IANA for specific vendor applications (e.g. MySQL 3306, PostgreSQL 5432, RDP 3389, SIP 5060).',
        badgeColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
      };
    } else {
      return {
        band: 'Dynamic / Ephemeral Client Port',
        range: '49152 – 65535',
        desc: 'Allocated dynamically by the client OS kernel for outbound network connections. Recycled immediately upon socket closure.',
        badgeColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
      };
    }
  };

  const portBandInfo = getPortBand(testPort);

  const runDemuxSimulation = () => {
    setIsSimulatingDemux(true);
    setDemuxStage(1);
    setTimeout(() => setDemuxStage(2), 700);
    setTimeout(() => setDemuxStage(3), 1500);
    setTimeout(() => {
      setDemuxStage(4);
      setIsSimulatingDemux(false);
    }, 2400);
  };

  return (
    <div className="p-4 sm:p-6 rounded-2xl glass-panel border border-[#272732] flex flex-col gap-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#272732] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30">
              LAYER 4 PROCESS MULTIPLEXING
            </span>
            <span className="text-xs font-mono text-zinc-500">RFC 793 / RFC 768</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Socket 4-Tuple Dissector & Demultiplexing Engine
          </h3>
        </div>

        <button
          onClick={runDemuxSimulation}
          disabled={isSimulatingDemux}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#00a2ff] text-black font-bold text-xs hover:opacity-90 disabled:opacity-50 transition-all shrink-0 self-start sm:self-center"
        >
          <Zap className={`w-3.5 h-3.5 ${isSimulatingDemux ? 'animate-spin text-black' : ''}`} />
          {isSimulatingDemux ? 'Demultiplexing...' : 'Trace Returning Packet'}
        </button>
      </div>

      {/* Active Application Sockets Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
          <span>Active Operating System Application Sockets</span>
          <span className="text-[11px] text-zinc-500 font-normal">Single IP: 192.168.1.50</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {activeSockets.map((sock) => {
            const isSelected = sock.id === selectedSocketId;
            return (
              <button
                key={sock.id}
                onClick={() => {
                  setSelectedSocketId(sock.id);
                  setTestPort(sock.remotePort);
                  setDemuxStage(0);
                }}
                className={`p-3 rounded-xl border text-left flex flex-col gap-2 transition-all ${
                  isSelected
                    ? 'bg-[#12121a] border-[#00f0ff] shadow-lg shadow-[#00f0ff]/10'
                    : 'bg-[#09090d] border-[#272732] hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                    style={{ backgroundColor: `${sock.color}20`, color: sock.color }}
                  >
                    {sock.icon === 'browser' && <Globe className="w-4 h-4" />}
                    {sock.icon === 'spotify' && <Music className="w-4 h-4" />}
                    {sock.icon === 'ssh' && <Terminal className="w-4 h-4" />}
                    {sock.icon === 'discord' && <MessageSquare className="w-4 h-4" />}
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                    {sock.protocol}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-bold text-white truncate">{sock.appName}</div>
                  <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
                    Port: <span className="text-[#00f0ff] font-semibold">:{sock.localPort}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 4-Tuple Socket Pair Architecture Card */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#09090d] border border-[#272732] flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-[#1f1f28] pb-3">
          <span className="text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4" /> The 4-Tuple Socket Pair Identifier
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            {currentSocket.status}
          </span>
        </div>

        {/* 4-Tuple Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Local Client Socket */}
          <div className="p-4 rounded-xl bg-[#121217] border border-[#272732] flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">
                Client Local Socket
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Dynamic Ephemeral
              </span>
            </div>

            <div className="flex items-baseline gap-2 font-mono text-sm sm:text-base font-bold text-white">
              <span className="text-zinc-300">{currentSocket.localIp}</span>
              <span className="text-[#00f0ff]">:{currentSocket.localPort}</span>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Operating system kernel allocated ephemeral source port{' '}
              <span className="font-mono text-[#00f0ff] font-bold">:{currentSocket.localPort}</span> to uniquely
              isolate this application thread from all other concurrent sockets on the host.
            </p>
          </div>

          {/* Remote Server Socket */}
          <div className="p-4 rounded-xl bg-[#121217] border border-[#272732] flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">
                Remote Foreign Socket
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {currentSocket.serviceName}
              </span>
            </div>

            <div className="flex items-baseline gap-2 font-mono text-sm sm:text-base font-bold text-white">
              <span className="text-zinc-300">{currentSocket.remoteIp}</span>
              <span className="text-emerald-400">:{currentSocket.remotePort}</span>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Remote server daemon listening on standard destination port{' '}
              <span className="font-mono text-emerald-400 font-bold">:{currentSocket.remotePort}</span> (
              {currentSocket.remoteHost}).
            </p>
          </div>
        </div>

        {/* Payload / Stream Description */}
        <div className="p-3 rounded-lg bg-[#050508] border border-[#1f1f28] flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-500">Transmitted Payload:</span>
          <span className="text-zinc-300 truncate max-w-md font-semibold">{currentSocket.dataPayload}</span>
        </div>
      </div>

      {/* Layer 4 Multiplexing & Demultiplexing Animation Strip */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#09090d] border border-[#272732] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-white font-bold uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#00f0ff]" /> Kernel Demultiplexing Flow Simulation
          </span>
          <span className="text-[11px] font-mono text-zinc-400">
            {demuxStage === 0 && 'Ready to trace inbound packet'}
            {demuxStage === 1 && '1. Wire Ingress: Inbound frame arrives at physical NIC'}
            {demuxStage === 2 && '2. IP Layer: Strips IP header -> inspects Destination Port'}
            {demuxStage === 3 && '3. Demux Match: Found matching socket in OS kernel table'}
            {demuxStage === 4 && '4. Delivery Complete: Payload passed directly to application process!'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2">
          <div
            className={`p-3 rounded-xl border flex flex-col gap-1 transition-all ${
              demuxStage >= 1
                ? 'bg-cyan-500/10 border-[#00f0ff] text-white'
                : 'bg-[#121217] border-[#272732] text-zinc-500'
            }`}
          >
            <span className="text-[10px] font-mono font-bold">STAGE 1</span>
            <span className="text-xs font-bold">Physical Wire Frame</span>
            <span className="text-[10px] font-mono">Dst MAC = Host NIC</span>
          </div>

          <div
            className={`p-3 rounded-xl border flex flex-col gap-1 transition-all ${
              demuxStage >= 2
                ? 'bg-blue-500/10 border-blue-400 text-white'
                : 'bg-[#121217] border-[#272732] text-zinc-500'
            }`}
          >
            <span className="text-[10px] font-mono font-bold">STAGE 2</span>
            <span className="text-xs font-bold">IP Layer Routing</span>
            <span className="text-[10px] font-mono">Dst IP = 192.168.1.50</span>
          </div>

          <div
            className={`p-3 rounded-xl border flex flex-col gap-1 transition-all ${
              demuxStage >= 3
                ? 'bg-purple-500/10 border-purple-400 text-white'
                : 'bg-[#121217] border-[#272732] text-zinc-500'
            }`}
          >
            <span className="text-[10px] font-mono font-bold">STAGE 3</span>
            <span className="text-xs font-bold">Port Demultiplexing</span>
            <span className="text-[10px] font-mono">Dst Port = :{currentSocket.localPort}</span>
          </div>

          <div
            className={`p-3 rounded-xl border flex flex-col gap-1 transition-all ${
              demuxStage >= 4
                ? 'bg-emerald-500/10 border-emerald-400 text-white'
                : 'bg-[#121217] border-[#272732] text-zinc-500'
            }`}
          >
            <span className="text-[10px] font-mono font-bold">STAGE 4</span>
            <span className="text-xs font-bold">Process Buffer Ingress</span>
            <span className="text-[10px] font-mono truncate">{currentSocket.appName.split(':')[0]}</span>
          </div>
        </div>
      </div>

      {/* Interactive Port Classification Band Explorer */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#09090d] border border-[#272732] flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-[#1f1f28] pb-3">
          <span className="text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
            IANA 16-Bit Port Classification Range Inspector (0 – 65535)
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <label className="text-xs font-mono text-zinc-400 shrink-0">Test Port #:</label>
            <input
              type="number"
              min={0}
              max={65535}
              value={testPort}
              onChange={(e) => setTestPort(Math.max(0, Math.min(65535, parseInt(e.target.value) || 0)))}
              className="w-28 px-3 py-1.5 rounded-lg bg-[#121217] border border-[#272732] text-white font-mono text-sm focus:outline-none focus:border-[#00f0ff]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {[80, 443, 22, 53, 67, 3306, 5432, 8080, 51234].map((p) => (
              <button
                key={p}
                onClick={() => setTestPort(p)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono border transition-colors ${
                  testPort === p
                    ? 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]/50 font-bold'
                    : 'bg-[#121217] text-zinc-400 border-[#272732] hover:text-white'
                }`}
              >
                :{p}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#121217] border border-[#272732] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${portBandInfo.badgeColor}`}>
                {portBandInfo.band}
              </span>
              <span className="text-xs font-mono text-zinc-400 font-bold">Range: {portBandInfo.range}</span>
            </div>
            <p className="text-xs text-zinc-300 mt-1 leading-relaxed">{portBandInfo.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

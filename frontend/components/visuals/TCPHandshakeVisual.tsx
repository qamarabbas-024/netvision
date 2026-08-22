'use client';

import React, { useState } from 'react';
import { NetworkVisualEngine, VisualNode, VisualConnection, VisualEvent } from './NetworkVisualEngine';

type TransportScenario = 'tcp-handshake' | 'tcp-data' | 'tcp-teardown' | 'udp-streaming';

export const TCPHandshakeVisual: React.FC = () => {
  const [scenario, setScenario] = useState<TransportScenario>('tcp-handshake');
  const [clientIsn, setClientIsn] = useState<number>(1000);
  const [serverIsn, setServerIsn] = useState<number>(5000);
  const [payloadBytes, setPayloadBytes] = useState<number>(500);
  const [windowSize, setWindowSize] = useState<number>(65535);

  const nodes: VisualNode[] = [
    {
      id: 'client',
      label: 'Client Workstation',
      sublabel: 'Ephemeral Port 52114',
      type: 'client',
      x: 20,
      y: 50,
      ip: '192.168.1.50',
    },
    {
      id: 'server',
      label: 'Production Web Server',
      sublabel: 'HTTPS / TLS Port 443',
      type: 'server',
      x: 80,
      y: 50,
      ip: '104.21.48.12',
    },
  ];

  const connections: VisualConnection[] = [
    {
      id: 'conn-1',
      fromNodeId: 'client',
      toNodeId: 'server',
      label: scenario === 'udp-streaming' ? 'Stateless UDP Datagram Path' : 'Full-Duplex TCP Transport Circuit',
    },
  ];

  const getEvents = (): VisualEvent[] => {
    switch (scenario) {
      case 'tcp-handshake':
        return [
          {
            stepIndex: 0,
            title: 'Phase 0: Closed / Passive Listen',
            description: `Client generates Initial Sequence Number ISN = ${clientIsn}. Server socket is in LISTEN state on Port 443.`,
            fromNodeId: 'client',
            toNodeId: 'client',
            packetLabel: 'LISTEN',
            activeNodeId: 'client',
            packetHeader: {
              srcIp: '192.168.1.50',
              dstIp: '104.21.48.12',
              srcPort: 52114,
              dstPort: 443,
              seqNumber: clientIsn,
              ackNumber: 0,
              flags: ['IDLE'],
              protocol: 'TCP',
            },
          },
          {
            stepIndex: 1,
            title: 'Step 1: SYN [Synchronize] (Client ➔ Server)',
            description: `Client initiates connection by sending SYN with Initial Sequence Number Seq=${clientIsn} and advertises Receive Window=${windowSize}.`,
            fromNodeId: 'client',
            toNodeId: 'server',
            packetLabel: `SYN [Seq=${clientIsn}]`,
            activeNodeId: 'server',
            packetHeader: {
              srcIp: '192.168.1.50',
              dstIp: '104.21.48.12',
              srcPort: 52114,
              dstPort: 443,
              seqNumber: clientIsn,
              ackNumber: 0,
              flags: ['SYN'],
              protocol: 'TCP',
            },
          },
          {
            stepIndex: 2,
            title: 'Step 2: SYN-ACK (Server ➔ Client)',
            description: `Server acknowledges client ISN with Ack=${clientIsn + 1} and transmits its own Initial Sequence Number Seq=${serverIsn}. Server socket enters SYN_RECEIVED.`,
            fromNodeId: 'server',
            toNodeId: 'client',
            packetLabel: `SYN-ACK [Seq=${serverIsn}, Ack=${clientIsn + 1}]`,
            activeNodeId: 'client',
            packetHeader: {
              srcIp: '104.21.48.12',
              dstIp: '192.168.1.50',
              srcPort: 443,
              dstPort: 52114,
              seqNumber: serverIsn,
              ackNumber: clientIsn + 1,
              flags: ['SYN', 'ACK'],
              protocol: 'TCP',
            },
          },
          {
            stepIndex: 3,
            title: 'Step 3: ACK & ESTABLISHED (Client ➔ Server)',
            description: `Client acknowledges server ISN with Ack=${serverIsn + 1}. Both endpoints transition to ESTABLISHED state. Bidirectional data transfer can now begin!`,
            fromNodeId: 'client',
            toNodeId: 'server',
            packetLabel: `ACK [Seq=${clientIsn + 1}, Ack=${serverIsn + 1}]`,
            activeNodeId: 'server',
            packetHeader: {
              srcIp: '192.168.1.50',
              dstIp: '104.21.48.12',
              srcPort: 52114,
              dstPort: 443,
              seqNumber: clientIsn + 1,
              ackNumber: serverIsn + 1,
              flags: ['ACK'],
              protocol: 'TCP',
            },
          },
        ];

      case 'tcp-data':
        return [
          {
            stepIndex: 0,
            title: 'State: Connection ESTABLISHED',
            description: `Client and Server are connected. Client prepares to transmit ${payloadBytes} bytes of application payload (e.g. HTTP GET / TLS Client Hello).`,
            fromNodeId: 'client',
            toNodeId: 'client',
            packetLabel: 'READY',
            activeNodeId: 'client',
            packetHeader: {
              srcIp: '192.168.1.50',
              dstIp: '104.21.48.12',
              srcPort: 52114,
              dstPort: 443,
              seqNumber: clientIsn + 1,
              ackNumber: serverIsn + 1,
              flags: ['ACK'],
              protocol: 'TCP',
            },
          },
          {
            stepIndex: 1,
            title: `Client Transmits Data Segment (${payloadBytes} Bytes)`,
            description: `Client sends ${payloadBytes} bytes of payload starting at Seq=${clientIsn + 1} (bytes ${clientIsn + 1} to ${clientIsn + payloadBytes}). Flags=[ACK, PSH].`,
            fromNodeId: 'client',
            toNodeId: 'server',
            packetLabel: `DATA [${payloadBytes}B, Seq=${clientIsn + 1}]`,
            activeNodeId: 'server',
            packetHeader: {
              srcIp: '192.168.1.50',
              dstIp: '104.21.48.12',
              srcPort: 52114,
              dstPort: 443,
              seqNumber: clientIsn + 1,
              ackNumber: serverIsn + 1,
              flags: ['ACK', 'PSH'],
              protocol: 'TCP',
            },
          },
          {
            stepIndex: 2,
            title: 'Server Cumulative Acknowledgment & Window Update',
            description: `Server successfully buffers all ${payloadBytes} bytes. It returns forward-looking cumulative Ack=${clientIsn + 1 + payloadBytes} ("Expect byte ${clientIsn + 1 + payloadBytes} next") with advertised window=${windowSize}.`,
            fromNodeId: 'server',
            toNodeId: 'client',
            packetLabel: `ACK [Ack=${clientIsn + 1 + payloadBytes}, Win=${windowSize}]`,
            activeNodeId: 'client',
            packetHeader: {
              srcIp: '104.21.48.12',
              dstIp: '192.168.1.50',
              srcPort: 443,
              dstPort: 52114,
              seqNumber: serverIsn + 1,
              ackNumber: clientIsn + 1 + payloadBytes,
              flags: ['ACK'],
              protocol: 'TCP',
            },
          },
        ];

      case 'tcp-teardown':
        return [
          {
            stepIndex: 0,
            title: 'Active Close Initiation',
            description: 'Client application finishes sending requests and initiates graceful 4-way teardown.',
            fromNodeId: 'client',
            toNodeId: 'client',
            packetLabel: 'CLOSING',
            activeNodeId: 'client',
            packetHeader: {
              srcIp: '192.168.1.50',
              dstIp: '104.21.48.12',
              srcPort: 52114,
              dstPort: 443,
              seqNumber: clientIsn + 1000,
              ackNumber: serverIsn + 500,
              flags: ['ACK'],
              protocol: 'TCP',
            },
          },
          {
            stepIndex: 1,
            title: 'Step 1: FIN [Finish] (Client ➔ Server)',
            description: 'Client transmits FIN flag. Client enters FIN_WAIT_1 state and can no longer send application data.',
            fromNodeId: 'client',
            toNodeId: 'server',
            packetLabel: 'FIN [Seq=2000]',
            activeNodeId: 'server',
            packetHeader: {
              srcIp: '192.168.1.50',
              dstIp: '104.21.48.12',
              srcPort: 52114,
              dstPort: 443,
              seqNumber: clientIsn + 1000,
              ackNumber: serverIsn + 500,
              flags: ['FIN', 'ACK'],
              protocol: 'TCP',
            },
          },
          {
            stepIndex: 2,
            title: 'Step 2: ACK (Server ➔ Client)',
            description: 'Server acknowledges client FIN with Ack=2001. Client transitions to FIN_WAIT_2. Server enters CLOSE_WAIT.',
            fromNodeId: 'server',
            toNodeId: 'client',
            packetLabel: 'ACK [Ack=2001]',
            activeNodeId: 'client',
            packetHeader: {
              srcIp: '104.21.48.12',
              dstIp: '192.168.1.50',
              srcPort: 443,
              dstPort: 52114,
              seqNumber: serverIsn + 500,
              ackNumber: clientIsn + 1001,
              flags: ['ACK'],
              protocol: 'TCP',
            },
          },
          {
            stepIndex: 3,
            title: 'Step 3: FIN (Server ➔ Client)',
            description: 'Server finishes transmitting its remaining buffered data and sends its own FIN to close the return channel.',
            fromNodeId: 'server',
            toNodeId: 'client',
            packetLabel: 'FIN [Seq=5500]',
            activeNodeId: 'client',
            packetHeader: {
              srcIp: '104.21.48.12',
              dstIp: '192.168.1.50',
              srcPort: 443,
              dstPort: 52114,
              seqNumber: serverIsn + 500,
              ackNumber: clientIsn + 1001,
              flags: ['FIN', 'ACK'],
              protocol: 'TCP',
            },
          },
          {
            stepIndex: 4,
            title: 'Step 4: Final ACK & TIME_WAIT (Client ➔ Server)',
            description: 'Client returns final ACK (Ack=5501) and enters TIME_WAIT (2MSL timer) to ensure final ACK delivery before closing.',
            fromNodeId: 'client',
            toNodeId: 'server',
            packetLabel: 'ACK [Ack=5501] • TIME_WAIT',
            activeNodeId: 'server',
            packetHeader: {
              srcIp: '192.168.1.50',
              dstIp: '104.21.48.12',
              srcPort: 52114,
              dstPort: 443,
              seqNumber: clientIsn + 1001,
              ackNumber: serverIsn + 501,
              flags: ['ACK'],
              protocol: 'TCP',
            },
          },
        ];

      case 'udp-streaming':
        return [
          {
            stepIndex: 0,
            title: 'Phase 0: Stateless UDP Socket Ready',
            description: 'UDP requires zero handshake. Datagrams are transmitted immediately with a minimal 8-byte header.',
            fromNodeId: 'client',
            toNodeId: 'client',
            packetLabel: 'UDP READY',
            activeNodeId: 'client',
            packetHeader: {
              srcIp: '192.168.1.50',
              dstIp: '104.21.48.12',
              srcPort: 52114,
              dstPort: 53,
              seqNumber: 0,
              ackNumber: 0,
              flags: ['NONE (UDP)'],
              protocol: 'UDP',
            },
          },
          {
            stepIndex: 1,
            title: 'Direct UDP Datagram Transmission (0-RTT)',
            description: 'Client immediately transmits a 40-byte DNS query or voice audio datagram without prior connection setup.',
            fromNodeId: 'client',
            toNodeId: 'server',
            packetLabel: 'UDP [Len=40B, Port 53]',
            activeNodeId: 'server',
            packetHeader: {
              srcIp: '192.168.1.50',
              dstIp: '104.21.48.12',
              srcPort: 52114,
              dstPort: 53,
              seqNumber: 0,
              ackNumber: 0,
              flags: ['DATA'],
              protocol: 'UDP',
            },
          },
          {
            stepIndex: 2,
            title: 'Server Processes Datagram (No Transport ACK)',
            description: 'Server receives and processes the datagram immediately. UDP sends zero acknowledgment packets at Layer 4, keeping latency minimal.',
            fromNodeId: 'server',
            toNodeId: 'server',
            packetLabel: 'PROCESSED (0 ACKs)',
            activeNodeId: 'server',
            packetHeader: {
              srcIp: '104.21.48.12',
              dstIp: '192.168.1.50',
              srcPort: 53,
              dstPort: 52114,
              seqNumber: 0,
              ackNumber: 0,
              flags: ['NO_ACK'],
              protocol: 'UDP',
            },
          },
        ];
    }
  };

  return (
    <div className="space-y-4">
      {/* Scenario Mode Selector */}
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-xl p-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest">
              Transport Protocol Workbench
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setScenario('tcp-handshake')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                scenario === 'tcp-handshake'
                  ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30 ring-1 ring-cyan-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              1. 3-Way Handshake
            </button>
            <button
              onClick={() => setScenario('tcp-data')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                scenario === 'tcp-data'
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30 ring-1 ring-emerald-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              2. Data & Flow Control
            </button>
            <button
              onClick={() => setScenario('tcp-teardown')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                scenario === 'tcp-teardown'
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30 ring-1 ring-amber-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              3. 4-Way Teardown
            </button>
            <button
              onClick={() => setScenario('udp-streaming')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                scenario === 'udp-streaming'
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30 ring-1 ring-purple-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              4. UDP Streaming (8B Header)
            </button>
          </div>
        </div>

        {/* Live Parameters Panel */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <div className="text-slate-500 text-[10px] uppercase font-bold">Client ISN</div>
            <div className="text-cyan-300 font-bold mt-0.5">{clientIsn}</div>
            <div className="text-[10px] text-slate-400 mt-1">Initial Client Offset</div>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <div className="text-slate-500 text-[10px] uppercase font-bold">Server ISN</div>
            <div className="text-purple-300 font-bold mt-0.5">{serverIsn}</div>
            <div className="text-[10px] text-slate-400 mt-1">Initial Server Offset</div>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <div className="text-slate-500 text-[10px] uppercase font-bold">Payload Size</div>
            <div className="text-emerald-300 font-bold mt-0.5">{payloadBytes} Bytes</div>
            <div className="text-[10px] text-slate-400 mt-1">Next Ack: {clientIsn + 1 + payloadBytes}</div>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <div className="text-slate-500 text-[10px] uppercase font-bold">Advertised Window</div>
            <div className="text-amber-300 font-bold mt-0.5">{windowSize} Bytes</div>
            <div className="text-[10px] text-slate-400 mt-1">Receiver Buffer Size</div>
          </div>
        </div>
      </div>

      {/* Network Visual Engine Rendering */}
      <NetworkVisualEngine
        title={
          scenario === 'tcp-handshake'
            ? 'TCP 3-Way Handshake Simulator (SYN → SYN-ACK → ACK)'
            : scenario === 'tcp-data'
            ? 'TCP Sequence & Cumulative Acknowledgment Engine'
            : scenario === 'tcp-teardown'
            ? 'TCP 4-Way Connection Teardown (FIN → ACK → FIN → ACK)'
            : 'UDP Stateless Datagram Engine (8-Byte Minimal Header)'
        }
        concept="Layer 4 Process-to-Process Transport Protocol Mechanics"
        nodes={nodes}
        connections={connections}
        events={getEvents()}
      />
    </div>
  );
};

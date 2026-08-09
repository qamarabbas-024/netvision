'use client';

import React from 'react';
import { NetworkVisualEngine, VisualNode, VisualConnection, VisualEvent } from './NetworkVisualEngine';

export const TCPHandshakeVisual: React.FC = () => {
  const nodes: VisualNode[] = [
    {
      id: 'client',
      label: 'Client Desktop',
      sublabel: 'Browser Port 52114',
      type: 'client',
      x: 20,
      y: 50,
      ip: '192.168.1.50',
    },
    {
      id: 'server',
      label: 'Web Server',
      sublabel: 'HTTPS Port 443',
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
      label: 'Full-Duplex TCP Socket Link',
    },
  ];

  const events: VisualEvent[] = [
    {
      stepIndex: 0,
      title: 'Phase 0: Closed / Listening Socket',
      description: 'Client initiates a TCP session to Web Server on Port 443. Client generates Initial Sequence Number ISN = 1000.',
      fromNodeId: 'client',
      toNodeId: 'client',
      packetLabel: 'READY',
      activeNodeId: 'client',
      packetHeader: {
        srcIp: '192.168.1.50',
        dstIp: '104.21.48.12',
        srcPort: 52114,
        dstPort: 443,
        seqNumber: 1000,
        ackNumber: 0,
        flags: ['IDLE'],
        protocol: 'TCP',
      },
    },
    {
      stepIndex: 1,
      title: 'Step 1: SYN Packet (Client ➔ Server)',
      description: 'Client sends SYN (Synchronize Sequence Numbers) packet to Server with ISN=1000 to propose starting a TCP session.',
      fromNodeId: 'client',
      toNodeId: 'server',
      packetLabel: 'SYN [Seq=1000]',
      activeNodeId: 'server',
      packetHeader: {
        srcIp: '192.168.1.50',
        dstIp: '104.21.48.12',
        srcPort: 52114,
        dstPort: 443,
        seqNumber: 1000,
        ackNumber: 0,
        flags: ['SYN'],
        protocol: 'TCP',
      },
    },
    {
      stepIndex: 2,
      title: 'Step 2: SYN-ACK Packet (Server ➔ Client)',
      description: 'Server acknowledges Client SYN by incrementing sequence number to Ack=1001, and sends its own SYN with ISN=5000.',
      fromNodeId: 'server',
      toNodeId: 'client',
      packetLabel: 'SYN-ACK [Seq=5000, Ack=1001]',
      activeNodeId: 'client',
      packetHeader: {
        srcIp: '104.21.48.12',
        dstIp: '192.168.1.50',
        srcPort: 443,
        dstPort: 52114,
        seqNumber: 5000,
        ackNumber: 1001,
        flags: ['SYN', 'ACK'],
        protocol: 'TCP',
      },
    },
    {
      stepIndex: 3,
      title: 'Step 3: ACK Packet & Connection ESTABLISHED (Client ➔ Server)',
      description: 'Client acknowledges Server SYN (Ack=5001). The 3-way handshake completes and the full-duplex TCP socket is ESTABLISHED!',
      fromNodeId: 'client',
      toNodeId: 'server',
      packetLabel: 'ACK [Ack=5001] • ESTABLISHED',
      activeNodeId: 'server',
      packetHeader: {
        srcIp: '192.168.1.50',
        dstIp: '104.21.48.12',
        srcPort: 52114,
        dstPort: 443,
        seqNumber: 1001,
        ackNumber: 5001,
        flags: ['ACK'],
        protocol: 'TCP',
      },
    },
  ];

  return (
    <NetworkVisualEngine
      title="TCP 3-Way Handshake Simulator (SYN → SYN-ACK → ACK)"
      concept="Transport Layer Connection Establishment"
      nodes={nodes}
      connections={connections}
      events={events}
    />
  );
};

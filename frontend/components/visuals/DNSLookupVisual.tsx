'use client';

import React from 'react';
import { NetworkVisualEngine, VisualNode, VisualConnection, VisualEvent } from './NetworkVisualEngine';

export const DNSLookupVisual: React.FC = () => {
  const nodes: VisualNode[] = [
    {
      id: 'client',
      label: 'Client Browser',
      sublabel: 'User PC',
      type: 'client',
      x: 15,
      y: 50,
      ip: '192.168.1.50',
    },
    {
      id: 'resolver',
      label: 'Recursive Resolver',
      sublabel: 'ISP / Cloudflare',
      type: 'dns',
      x: 40,
      y: 50,
      ip: '1.1.1.1',
    },
    {
      id: 'rootServer',
      label: 'Root DNS Server',
      sublabel: '. Root Zone',
      type: 'server',
      x: 70,
      y: 20,
      ip: '198.41.0.4',
    },
    {
      id: 'tldServer',
      label: '.COM TLD Server',
      sublabel: 'Top-Level Domain',
      type: 'server',
      x: 70,
      y: 50,
      ip: '192.5.6.30',
    },
    {
      id: 'authServer',
      label: 'Authoritative DNS',
      sublabel: 'ns1.netvision.edu',
      type: 'server',
      x: 70,
      y: 80,
      ip: '104.21.48.12',
    },
  ];

  const connections: VisualConnection[] = [
    { id: 'c1', fromNodeId: 'client', toNodeId: 'resolver', label: 'Recursive Query' },
    { id: 'c2', fromNodeId: 'resolver', toNodeId: 'rootServer', label: 'Root Query' },
    { id: 'c3', fromNodeId: 'resolver', toNodeId: 'tldServer', label: 'TLD Query' },
    { id: 'c4', fromNodeId: 'resolver', toNodeId: 'authServer', label: 'Authoritative Query' },
  ];

  const events: VisualEvent[] = [
    {
      stepIndex: 0,
      title: 'Step 1: Recursive DNS Query (Client ➔ Resolver)',
      description: 'Client requests resolution for domain "netvision.edu" from local recursive resolver 1.1.1.1.',
      fromNodeId: 'client',
      toNodeId: 'resolver',
      packetLabel: 'QUERY: netvision.edu',
      activeNodeId: 'resolver',
      packetHeader: { srcIp: '192.168.1.50', dstIp: '1.1.1.1', srcPort: 53110, dstPort: 53, protocol: 'UDP' },
    },
    {
      stepIndex: 1,
      title: 'Step 2: Root DNS Server Referral (Resolver ➔ Root Server)',
      description: 'Resolver queries Root Server (.) for .edu TLD server addresses.',
      fromNodeId: 'resolver',
      toNodeId: 'rootServer',
      packetLabel: 'REFERRAL: .edu TLD',
      activeNodeId: 'rootServer',
      packetHeader: { srcIp: '1.1.1.1', dstIp: '198.41.0.4', srcPort: 53, dstPort: 53, protocol: 'UDP' },
    },
    {
      stepIndex: 2,
      title: 'Step 3: TLD Name Server Query (Resolver ➔ TLD Server)',
      description: 'Resolver queries .EDU TLD server for authoritative name server for "netvision.edu".',
      fromNodeId: 'resolver',
      toNodeId: 'tldServer',
      packetLabel: 'QUERY: ns1.netvision.edu',
      activeNodeId: 'tldServer',
      packetHeader: { srcIp: '1.1.1.1', dstIp: '192.5.6.30', srcPort: 53, dstPort: 53, protocol: 'UDP' },
    },
    {
      stepIndex: 3,
      title: 'Step 4: Authoritative A Record Response (Resolver ➔ Authoritative)',
      description: 'Authoritative server answers with target IPv4 address: 104.21.48.12.',
      fromNodeId: 'resolver',
      toNodeId: 'authServer',
      packetLabel: 'A RECORD: 104.21.48.12',
      activeNodeId: 'authServer',
      packetHeader: { srcIp: '1.1.1.1', dstIp: '104.21.48.12', srcPort: 53, dstPort: 53, protocol: 'UDP' },
    },
    {
      stepIndex: 4,
      title: 'Step 5: Final Resolution Response (Resolver ➔ Client)',
      description: 'Resolver returns IPv4 address 104.21.48.12 to client. Browser opens TCP connection to web server.',
      fromNodeId: 'resolver',
      toNodeId: 'client',
      packetLabel: 'RESOLVED: 104.21.48.12',
      activeNodeId: 'client',
      packetHeader: { srcIp: '1.1.1.1', dstIp: '192.168.1.50', srcPort: 53, dstPort: 53110, protocol: 'UDP' },
    },
  ];

  return (
    <NetworkVisualEngine
      title="DNS Recursive Resolution Engine"
      concept="Application Layer Domain Name Resolution"
      nodes={nodes}
      connections={connections}
      events={events}
    />
  );
};

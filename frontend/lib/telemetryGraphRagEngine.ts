// Real-time Syslog & NetFlow v9/IPFIX GraphRAG Intelligence Engine

export interface TelemetryLogEntry {
  id: string;
  facility: string;
  severity: 'EMERGENCY' | 'ALERT' | 'CRITICAL' | 'ERROR' | 'WARNING' | 'NOTICE' | 'INFO';
  hostname: string;
  message: string;
  extractedEntities: {
    ipAddresses: string[];
    interfaces: string[];
    asns: number[];
  };
  graphNodeId: string;
}

export const SAMPLE_SYSLOG_STREAM: TelemetryLogEntry[] = [
  {
    id: 'LOG-001',
    facility: 'BGP',
    severity: 'WARNING',
    hostname: 'rtr-core-01',
    message: '%BGP-5-ADJCHANGE: neighbor 192.0.2.1 Up',
    extractedEntities: {
      ipAddresses: ['192.0.2.1'],
      interfaces: ['eth0'],
      asns: [65001, 65002],
    },
    graphNodeId: 'node-bgp-peer-01',
  },
  {
    id: 'LOG-002',
    facility: 'INTERFACE',
    severity: 'CRITICAL',
    hostname: 'sw-leaf-02',
    message: '%ETH-3-PORT_ERR: Port e1-1 CRC errors exceeded high-water threshold (4120 errs/sec)',
    extractedEntities: {
      ipAddresses: [],
      interfaces: ['e1-1'],
      asns: [],
    },
    graphNodeId: 'node-iface-err-02',
  },
  {
    id: 'LOG-003',
    facility: 'SECURITY',
    severity: 'ALERT',
    hostname: 'gw-edge-01',
    message: '%SEC-1-SYN_FLOOD: Ingress TCP SYN rate > 500,000 pps targeting 10.0.0.50:443',
    extractedEntities: {
      ipAddresses: ['10.0.0.50'],
      interfaces: ['Gi0/0/0/1'],
      asns: [],
    },
    graphNodeId: 'node-syn-flood-03',
  },
];

export function queryTelemetryGraph(naturalQuery: string): {
  cypherQuery: string;
  matchingNodes: TelemetryLogEntry[];
  summary: string;
} {
  const q = naturalQuery.toLowerCase();

  if (q.includes('security') || q.includes('syn') || q.includes('flood')) {
    return {
      cypherQuery: 'MATCH (g:Gateway)-[:DETECTED_ATTACK]->(t:Target {ip: "10.0.0.50"}) RETURN g, t',
      matchingNodes: [SAMPLE_SYSLOG_STREAM[2]],
      summary: 'Found 1 active SYN Flood incident targeting VIP 10.0.0.50 on gw-edge-01. Mitigated by eBPF SynProxy.',
    };
  }

  return {
    cypherQuery: 'MATCH (d:Device)-[:HAS_EVENT]->(e:Event) WHERE e.severity IN ["CRITICAL", "WARNING"] RETURN d, e',
    matchingNodes: SAMPLE_SYSLOG_STREAM.slice(0, 2),
    summary: 'Found 2 correlated events: Interface CRC errors on sw-leaf-02 preceded BGP adjacency state change.',
  };
}

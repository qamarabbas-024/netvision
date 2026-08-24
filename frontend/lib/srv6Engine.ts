/**
 * NetVision SRv6 (Segment Routing over IPv6) Engine (Version 6.2)
 * Simulates RFC 8754 Segment Routing Extension Headers (SRH),
 * Endpoint behaviors (End, End.X, End.DT4, End.DX2), and Traffic Engineering SLA policies.
 */

export interface Srv6Segment {
  sid: string;
  nodeName: string;
  behavior: 'End' | 'End.X' | 'End.DT4' | 'End.DX2';
  description: string;
}

export interface Srv6Policy {
  id: string;
  name: string;
  colorHex: string;
  slaConstraint: 'ULTRA_LOW_LATENCY' | 'MAX_BANDWIDTH' | 'AFFINITY_DISJOINT';
  expectedLatencyMs: number;
  segmentList: Srv6Segment[];
}

export class Srv6Engine {
  public static getPolicies(): Srv6Policy[] {
    return [
      {
        id: 'policy-low-latency',
        name: '5G Voice & Real-Time Video (Low-Latency SLA)',
        colorHex: '#00f0ff',
        slaConstraint: 'ULTRA_LOW_LATENCY',
        expectedLatencyMs: 4.8,
        segmentList: [
          { sid: 'fc00:0:1::End', nodeName: 'Ingress-PE1', behavior: 'End', description: 'Encap IPv6 SRH header' },
          { sid: 'fc00:0:2::End.X', nodeName: 'Transit-P2', behavior: 'End.X', description: 'Explicit low-jitter optical cross-connect' },
          { sid: 'fc00:0:4::End.DT4', nodeName: 'Egress-PE4', behavior: 'End.DT4', description: 'Decap and lookup IPv4 in VRF Red' },
        ],
      },
      {
        id: 'policy-bulk-backup',
        name: 'Bulk Data Center Cloud Sync (Standard Path)',
        colorHex: '#7928ca',
        slaConstraint: 'MAX_BANDWIDTH',
        expectedLatencyMs: 18.2,
        segmentList: [
          { sid: 'fc00:0:1::End', nodeName: 'Ingress-PE1', behavior: 'End', description: 'Encap IPv6 SRH header' },
          { sid: 'fc00:0:3::End', nodeName: 'Transit-P3', behavior: 'End', description: 'High-throughput terrestrial path' },
          { sid: 'fc00:0:4::End.DT4', nodeName: 'Egress-PE4', behavior: 'End.DT4', description: 'Decap and lookup IPv4 in VRF Red' },
        ],
      },
    ];
  }
}

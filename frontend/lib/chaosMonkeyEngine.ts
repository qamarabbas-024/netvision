/**
 * NetVision Chaos Monkey & Resilience Engineering Engine (Version 4.8)
 * Injects deterministic and random network chaos (link flaps, latency spikes,
 * MTU blackholes, split-brain dual masters) to test operator response.
 */

export type ChaosEventType =
  | 'LINK_FLAPPING'
  | 'LATENCY_SPIKE'
  | 'MTU_BLACKHOLE'
  | 'BGP_DAMPENING'
  | 'SPLIT_BRAIN_VRRP';

export interface ChaosEvent {
  id: ChaosEventType;
  name: string;
  category: 'RELIABILITY' | 'PERFORMANCE' | 'ROUTING';
  description: string;
  symptoms: string[];
  remediationAction: string;
  impactScore: number; // 0 to 100
}

export const CHAOS_CATALOG: ChaosEvent[] = [
  {
    id: 'LINK_FLAPPING',
    name: 'Carrier Link Flapping (Intermittent Bounce)',
    category: 'RELIABILITY',
    description: 'Interface state oscillates UP/DOWN every 3.5 seconds, triggering massive routing table recalculation loops.',
    symptoms: ['High CPU utilization on OSPF process', 'Packet loss bursts during SPF recalculation', 'Neighbor state flapping INIT <-> 2WAY'],
    remediationAction: 'Enable interface carrier-delay dampening and link-debounce timers.',
    impactScore: 75,
  },
  {
    id: 'LATENCY_SPIKE',
    name: 'Bufferbloat Jitter Injection (+400ms)',
    category: 'PERFORMANCE',
    description: 'Egress queue depth exceeds 95%, causing catastrophic jitter and VoIP call degradation.',
    symptoms: ['TCP round-trip time jumps from 15ms to 420ms', 'VoIP MOS score drops below 2.0', 'Window size throttled'],
    remediationAction: 'Deploy CoDel (Controlled Delay) and Random Early Detection on egress bottleneck interface.',
    impactScore: 60,
  },
  {
    id: 'MTU_BLACKHOLE',
    name: 'Path MTU Discovery (PMTUD) Blackhole',
    category: 'PERFORMANCE',
    description: 'Transit router with MTU 1400 drops packets larger than 1400 bytes and firewall filters ICMP Type 3 Code 4.',
    symptoms: ['TLS handshake freezes during ServerHello', 'Small pings succeed, large file downloads hang indefinitely'],
    remediationAction: 'Enable TCP MSS Clamping (ip tcp adjust-mss 1360) on perimeter router interface.',
    impactScore: 85,
  },
  {
    id: 'SPLIT_BRAIN_VRRP',
    name: 'VRRP Dual-Master Split-Brain',
    category: 'ROUTING',
    description: 'Heartbeat packets blocked between redundant gateways, causing both routers to claim Virtual IP 192.168.1.1.',
    symptoms: ['Intermittent ARP cache flapping', '50% packet drop rate on gateway transit', 'Duplicate IP address warnings'],
    remediationAction: 'Restore dedicated Layer-2 heartbeat VLAN link and verify multicast 224.0.0.18 transit.',
    impactScore: 90,
  },
];

// Autonomous Chaos Engineering and Link Degradation Engine

export interface ChaosFaultVector {
  id: string;
  name: string;
  category: 'LINK_FLAP' | 'JITTER_SPIKE' | 'BUFFER_CORRUPT' | 'MTU_TRUNCATE' | 'BGP_POISON';
  targetInterface: string;
  lossRatePercent: number;
  addedLatencyMs: number;
  blastRadius: 'SINGLE_LINK' | 'LEAF_POD' | 'TRANSIT_FABRIC';
  status: 'ARMED' | 'FIRING' | 'REMEDIATED';
}

export const CHAOS_VECTORS: ChaosFaultVector[] = [
  {
    id: 'CHAOS-01',
    name: 'Intermittent Link Flap (500ms Duty Cycle)',
    category: 'LINK_FLAP',
    targetInterface: 'spine1 <-> leaf1',
    lossRatePercent: 42.5,
    addedLatencyMs: 85,
    blastRadius: 'LEAF_POD',
    status: 'ARMED',
  },
  {
    id: 'CHAOS-02',
    name: 'BGP Route Poisoning (Loop Injection)',
    category: 'BGP_POISON',
    targetInterface: 'border-gw-01',
    lossRatePercent: 99.9,
    addedLatencyMs: 450,
    blastRadius: 'TRANSIT_FABRIC',
    status: 'ARMED',
  },
  {
    id: 'CHAOS-03',
    name: 'Bufferbloat Congestion Jitter Spike',
    category: 'JITTER_SPIKE',
    targetInterface: 'spine2 <-> leaf2',
    lossRatePercent: 12.0,
    addedLatencyMs: 140,
    blastRadius: 'SINGLE_LINK',
    status: 'ARMED',
  },
];

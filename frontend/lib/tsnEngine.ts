/**
 * NetVision Time-Sensitive Networking (TSN IEEE 802.1Qbv) Engine (Version 6.3)
 * Simulates Time-Aware Shapers (TAS), Gate Control Lists (GCL),
 * and microsecond-deterministic queue scheduling for Automotive & Industrial IoT.
 */

export interface TsnQueueGate {
  queueId: number;
  priority: number;
  trafficType: 'CRITICAL_CONTROL' | 'AUDIO_VIDEO_BRIDGING' | 'BEST_EFFORT';
  gateState: 'OPEN' | 'CLOSED';
  allocatedTimeUs: number;
}

export interface TsnCycleProfile {
  id: string;
  name: string;
  cycleTimeUs: number; // e.g. 250 microseconds
  guardBandUs: number;
  queues: TsnQueueGate[];
}

export class TsnEngine {
  public static getInitialProfile(): TsnCycleProfile {
    return {
      id: 'tsn-profile-auto',
      name: 'Automotive Ethernet CAN-FD / LiDAR Shaper',
      cycleTimeUs: 250,
      guardBandUs: 12,
      queues: [
        { queueId: 7, priority: 7, trafficType: 'CRITICAL_CONTROL', gateState: 'OPEN', allocatedTimeUs: 75 },
        { queueId: 5, priority: 5, trafficType: 'AUDIO_VIDEO_BRIDGING', gateState: 'CLOSED', allocatedTimeUs: 50 },
        { queueId: 0, priority: 0, trafficType: 'BEST_EFFORT', gateState: 'CLOSED', allocatedTimeUs: 125 },
      ],
    };
  }
}

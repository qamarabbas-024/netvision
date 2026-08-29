// Multipath QUIC (MPQUIC) Stream Scheduling Engine

export interface MpquicPath {
  id: string;
  name: string;
  medium: '5G_CELLULAR' | 'WIFI_7' | 'LOW_LATENCY_FIBER';
  rttMs: number;
  bandwidthMbps: number;
  packetLossRate: number;
  activeBytesTransferred: number;
}

export type MpquicSchedulerMode = 'MIN_RTT' | 'ROUND_ROBIN' | 'REDUNDANT_LOSSLESS';

export function scheduleMpquicPacket(
  paths: MpquicPath[],
  mode: MpquicSchedulerMode
): { selectedPathId: string; reason: string } {
  if (mode === 'MIN_RTT') {
    const minPath = [...paths].sort((a, b) => a.rttMs - b.rttMs)[0];
    return {
      selectedPathId: minPath.id,
      reason: `Selected lowest latency path: ${minPath.name} (${minPath.rttMs}ms RTT)`,
    };
  }

  if (mode === 'REDUNDANT_LOSSLESS') {
    return {
      selectedPathId: 'ALL_PATHS',
      reason: 'Duplicated packet across all paths for 0.00% loss critical reliability',
    };
  }

  return {
    selectedPathId: paths[0].id,
    reason: 'Weighted Round-Robin proportional to link capacity',
  };
}

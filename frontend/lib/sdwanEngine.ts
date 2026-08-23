/**
 * NetVision Enterprise SD-WAN & Dynamic Path Quality Engine (Version 5.2)
 * Simulates multi-transport SD-WAN overlays (MPLS, DIA Broadband, 5G LTE),
 * Forward Error Correction (FEC), and sub-second SLA path steering.
 */

export interface WanTransportPath {
  id: string;
  name: string;
  type: 'MPLS' | 'BROADBAND' | 'CELLULAR_5G';
  latencyMs: number;
  jitterMs: number;
  packetLossPercent: number;
  bandwidthMbps: number;
  health: 'HEALTHY' | 'DEGRADED' | 'DOWN';
}

export interface SdwanTrafficClass {
  id: string;
  name: string;
  dscpTag: string;
  maxLatency: number;
  maxLoss: number;
  maxJitter: number;
  fecEnabled: boolean;
}

export class SdwanEngine {
  public static getInitialTransports(): WanTransportPath[] {
    return [
      { id: 'wan-mpls', name: 'Private MPLS Circuit', type: 'MPLS', latencyMs: 14, jitterMs: 1.2, packetLossPercent: 0.0, bandwidthMbps: 100, health: 'HEALTHY' },
      { id: 'wan-dia', name: 'Direct Internet Access (DIA)', type: 'BROADBAND', latencyMs: 26, jitterMs: 3.5, packetLossPercent: 0.1, bandwidthMbps: 1000, health: 'HEALTHY' },
      { id: 'wan-5g', name: '5G LTE Cellular Uplink', type: 'CELLULAR_5G', latencyMs: 48, jitterMs: 6.0, packetLossPercent: 0.2, bandwidthMbps: 250, health: 'HEALTHY' },
    ];
  }

  public static getTrafficClasses(): SdwanTrafficClass[] {
    return [
      { id: 'tc-voice', name: 'Real-Time Voice (VoIP / Zoom)', dscpTag: 'EF (DSCP 46)', maxLatency: 100, maxLoss: 0.5, maxJitter: 10, fecEnabled: true },
      { id: 'tc-erp', name: 'Mission-Critical Business (SAP/ERP)', dscpTag: 'AF31 (DSCP 26)', maxLatency: 150, maxLoss: 1.0, maxJitter: 25, fecEnabled: true },
      { id: 'tc-bulk', name: 'Bulk Cloud Storage & Backup', dscpTag: 'CS1 (DSCP 8)', maxLatency: 400, maxLoss: 5.0, maxJitter: 80, fecEnabled: false },
    ];
  }
}

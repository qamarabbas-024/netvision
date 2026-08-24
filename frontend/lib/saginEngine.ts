/**
 * NetVision Space-Air-Ground Integrated Network (SAGIN) Engine (Version 8.1)
 * Simulates multi-tier integrated SAGIN routing: LEO Satellites (Space),
 * High-Altitude Platform Stations / HAPS (Air), and 5G/6G Terrestrial base stations (Ground).
 */

export interface SaginTierNode {
  tier: 'SPACE_LEO' | 'AIR_HAPS' | 'GROUND_5G';
  nodeName: string;
  altitudeKm: number;
  coverageRadiusKm: number;
  interTierLatencyMs: number;
  uplinkBandwidthGbps: number;
  status: 'ACTIVE' | 'RELAYING';
}

export interface SaginNetworkState {
  missionProfile: string;
  endToEndLatencyMs: number;
  activeTiersCount: number;
  nodes: SaginTierNode[];
}

export class SaginEngine {
  public static getInitialState(): SaginNetworkState {
    return {
      missionProfile: 'Disaster Relief & Maritime Fast-Response Routing',
      endToEndLatencyMs: 23.4,
      activeTiersCount: 3,
      nodes: [
        { tier: 'SPACE_LEO', nodeName: 'LEO-Sat-Orbiter-01', altitudeKm: 550, coverageRadiusKm: 1200, interTierLatencyMs: 14.2, uplinkBandwidthGbps: 100, status: 'ACTIVE' },
        { tier: 'AIR_HAPS', nodeName: 'Solar-HAPS-Zephyr-04', altitudeKm: 20, coverageRadiusKm: 180, interTierLatencyMs: 3.8, uplinkBandwidthGbps: 40, status: 'RELAYING' },
        { tier: 'GROUND_5G', nodeName: 'Mobile-Maritime-5G-Station', altitudeKm: 0.01, coverageRadiusKm: 25, interTierLatencyMs: 1.4, uplinkBandwidthGbps: 10, status: 'ACTIVE' },
      ],
    };
  }
}

/**
 * NetVision Galactic Interplanetary Network (DTN / RFC 5050) Engine (Version 9.0)
 * Simulates Delay-Tolerant Networking (DTN), Bundle Protocol (RFC 5050 / RFC 9171),
 * Store-and-Forward custody transfer, and multi-minute deep space propagation.
 */

export interface DeepSpaceHop {
  nodeId: string;
  name: string;
  distanceAu: number;
  oneWayLightTimeSec: number;
  custodyAccepted: boolean;
  contactWindowRemainingSec: number;
  status: 'CUSTODY_STORED' | 'WINDOW_OPEN' | 'LOS_OCCLUDED';
}

export interface InterplanetaryMissionState {
  missionName: string;
  sourceDestination: string;
  totalRoundTripTimeSec: number;
  bundlePayloadKb: number;
  hops: DeepSpaceHop[];
}

export class InterplanetaryBundleEngine {
  public static getInitialState(): InterplanetaryMissionState {
    return {
      missionName: 'Mars Sample Return Autonomous Telemetry Stream',
      sourceDestination: 'NASA DSN Goldstone (Earth) ➔ Jezero Crater Rover (Mars)',
      totalRoundTripTimeSec: 1420, // ~23.6 minutes
      bundlePayloadKb: 512,
      hops: [
        { nodeId: 'DSN-CA-01', name: 'NASA Deep Space Network (Goldstone, USA)', distanceAu: 0.0, oneWayLightTimeSec: 0, custodyAccepted: true, contactWindowRemainingSec: 7200, status: 'WINDOW_OPEN' },
        { nodeId: 'LUNAR-GW-02', name: 'Lunar Gateway Deep Space Relay', distanceAu: 0.0026, oneWayLightTimeSec: 1.3, custodyAccepted: true, contactWindowRemainingSec: 14400, status: 'CUSTODY_STORED' },
        { nodeId: 'MRO-MARS-03', name: 'Mars Reconnaissance Orbiter (MRO)', distanceAu: 1.42, oneWayLightTimeSec: 708, custodyAccepted: true, contactWindowRemainingSec: 3600, status: 'CUSTODY_STORED' },
        { nodeId: 'PERSEVERANCE-04', name: 'Jezero Crater Autonomous Rover', distanceAu: 1.42, oneWayLightTimeSec: 710, custodyAccepted: true, contactWindowRemainingSec: 3600, status: 'WINDOW_OPEN' },
      ],
    };
  }
}

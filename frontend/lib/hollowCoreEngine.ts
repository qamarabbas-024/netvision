/**
 * NetVision Hollow-Core Optical Fiber (HCF NANF) Engine (Version 8.5)
 * Simulates speed-of-light-in-air (300,000 km/s) vs standard silica glass (204,000 km/s),
 * achieving 33% latency reduction for High-Frequency Trading (HFT) and AI data center links.
 */

export interface FiberPhysicsProfile {
  id: string;
  name: string;
  coreMaterial: string;
  refractiveIndex: number;
  lightSpeedKmPerSec: number;
  propagationLatencyUsPerKm: number;
  nonLinearKerrEffect: 'HIGH' | 'NEAR_ZERO';
}

export class HollowCoreEngine {
  public static getProfiles(): FiberPhysicsProfile[] {
    return [
      {
        id: 'smf-silica',
        name: 'Standard Silica Glass (SMF-28)',
        coreMaterial: 'Solid Fused Silica Glass',
        refractiveIndex: 1.4682,
        lightSpeedKmPerSec: 204190,
        propagationLatencyUsPerKm: 4.897,
        nonLinearKerrEffect: 'HIGH',
      },
      {
        id: 'hcf-nanf',
        name: 'Hollow-Core Fiber (NANF Air-Core)',
        coreMaterial: 'Air / Vacuum Capillary Tube',
        refractiveIndex: 1.00028,
        lightSpeedKmPerSec: 299708,
        propagationLatencyUsPerKm: 3.337,
        nonLinearKerrEffect: 'NEAR_ZERO',
      },
    ];
  }
}

/**
 * NetVision Wi-Fi 7 (802.11be) & 5G Private Cellular RF Physics Engine (Version 5.3)
 * Simulates Multi-Link Operation (MLO), 320 MHz channel bonding,
 * 4096-QAM constellation diagrams, and free-space path loss attenuation.
 */

export interface Wifi7BandLink {
  frequencyGhz: 2.4 | 5.0 | 6.0;
  channelWidthMhz: number;
  modulation: string; // e.g. 4096-QAM (12 bits/symbol)
  rssiDbm: number;
  snrDb: number;
  throughputMbps: number;
  status: 'ACTIVE' | 'PUNCTURED' | 'STANDBY';
}

export class Wifi7RfPhysicsEngine {
  public static calculateFspl(distanceMeters: number, freqGhz: number, obstacleDbmLoss: number): number {
    const fspl = 20 * Math.log10(Math.max(1, distanceMeters)) + 20 * Math.log10(freqGhz * 1000) - 27.55;
    return Math.round(fspl + obstacleDbmLoss);
  }

  public static getInitialMloLinks(): Wifi7BandLink[] {
    return [
      { frequencyGhz: 2.4, channelWidthMhz: 40, modulation: '1024-QAM', rssiDbm: -52, snrDb: 38, throughputMbps: 574, status: 'ACTIVE' },
      { frequencyGhz: 5.0, channelWidthMhz: 160, modulation: '4096-QAM', rssiDbm: -58, snrDb: 32, throughputMbps: 2882, status: 'ACTIVE' },
      { frequencyGhz: 6.0, channelWidthMhz: 320, modulation: '4096-QAM', rssiDbm: -64, snrDb: 28, throughputMbps: 5764, status: 'ACTIVE' },
    ];
  }
}

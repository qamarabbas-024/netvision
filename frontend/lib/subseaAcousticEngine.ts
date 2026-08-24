/**
 * NetVision Subsea Transoceanic Cable & Distributed Acoustic Sensing (DAS) Engine (Version 8.3)
 * Simulates submarine optical fiber cables (e.g. MAREA 6,600km transatlantic),
 * Rayleigh backscatter acoustic vibration monitoring, and OTDR fault localization.
 */

export interface SubseaRepeater {
  repeaterId: string;
  kmPosition: number;
  oceanDepthMeters: number;
  opticalGainDb: number;
  acousticStrainNanostrain: number;
  status: 'NOMINAL' | 'HIGH_STRAIN_ALERT';
}

export interface SubseaCableState {
  cableName: string;
  totalLengthKm: number;
  totalFiberPairs: number;
  capacityTbps: number;
  acousticAnomaliesDetected: number;
  repeaters: SubseaRepeater[];
}

export class SubseaAcousticEngine {
  public static getInitialState(): SubseaCableState {
    return {
      cableName: 'MAREA Transatlantic Submarine Express (Virginia Beach -> Bilbao)',
      totalLengthKm: 6600,
      totalFiberPairs: 8,
      capacityTbps: 224,
      acousticAnomaliesDetected: 0,
      repeaters: [
        { repeaterId: 'Repeater-R12', kmPosition: 1200, oceanDepthMeters: 4100, opticalGainDb: 18.2, acousticStrainNanostrain: 12, status: 'NOMINAL' },
        { repeaterId: 'Repeater-R24', kmPosition: 2400, oceanDepthMeters: 5200, opticalGainDb: 18.0, acousticStrainNanostrain: 15, status: 'NOMINAL' },
        { repeaterId: 'Repeater-R34 (Mid-Atlantic Ridge)', kmPosition: 3412, oceanDepthMeters: 4800, opticalGainDb: 17.9, acousticStrainNanostrain: 18, status: 'NOMINAL' },
        { repeaterId: 'Repeater-R48', kmPosition: 4800, oceanDepthMeters: 3900, opticalGainDb: 18.1, acousticStrainNanostrain: 14, status: 'NOMINAL' },
      ],
    };
  }
}

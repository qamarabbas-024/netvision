// SCION Path-Aware Next-Generation Internet Architecture Engine

export interface ScionHopField {
  ingressInterface: number;
  egressInterface: number;
  expTime: number;
  macValidation: string;
}

export interface ScionPathOption {
  pathId: string;
  isdAsList: string[];
  latencyMs: number;
  geofenceRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  cryptoValid: boolean;
  hopFields: ScionHopField[];
}

export const SAMPLE_SCION_PATHS: ScionPathOption[] = [
  {
    pathId: 'PATH-ISD-1-CH-EU',
    isdAsList: ['ISD1-AS20 (Zurich)', 'ISD1-AS25 (Frankfurt)', 'ISD1-AS30 (Geneva)'],
    latencyMs: 8.2,
    geofenceRisk: 'LOW',
    cryptoValid: true,
    hopFields: [
      { ingressInterface: 0, egressInterface: 1, expTime: 1774920000, macValidation: '0x8f2a4c' },
      { ingressInterface: 2, egressInterface: 3, expTime: 1774920000, macValidation: '0x1b9e3d' },
    ],
  },
  {
    pathId: 'PATH-ISD-2-US-TRANSIT',
    isdAsList: ['ISD1-AS20 (Zurich)', 'ISD2-AS100 (New York)', 'ISD1-AS30 (Geneva)'],
    latencyMs: 74.5,
    geofenceRisk: 'MEDIUM',
    cryptoValid: true,
    hopFields: [
      { ingressInterface: 0, egressInterface: 4, expTime: 1774920000, macValidation: '0x7e29c1' },
      { ingressInterface: 5, egressInterface: 3, expTime: 1774920000, macValidation: '0x44aa12' },
    ],
  },
];

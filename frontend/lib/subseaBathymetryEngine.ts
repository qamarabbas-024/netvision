// 3D Oceanic Subsea Fiber Cable Topology and Bathymetry Engine

export interface SubseaCableSystem {
  id: string;
  name: string;
  lengthKm: number;
  landingStations: string[];
  fiberPairs: number;
  capacityTbps: number;
  repeaterCount: number;
  averageDepthMeters: number;
  status: 'ONLINE' | 'DEGRADED_BER' | 'REPAIR_VESSEL_DISPATCHED';
}

export const SAMPLE_SUBSEA_CABLES: SubseaCableSystem[] = [
  {
    id: 'CABLE-TAT-14',
    name: 'Transatlantic Super-Highway TAT-X',
    lengthKm: 6600,
    landingStations: ['Bude, UK', 'Halifax, Canada', 'Shirley, NY, USA'],
    fiberPairs: 16,
    capacityTbps: 340,
    repeaterCount: 84,
    averageDepthMeters: 3800,
    status: 'ONLINE',
  },
  {
    id: 'CABLE-PCX-01',
    name: 'Pacific Express Subsea Ring',
    lengthKm: 11200,
    landingStations: ['Los Angeles, USA', 'Tokyo, Japan', 'Sydney, Australia'],
    fiberPairs: 24,
    capacityTbps: 520,
    repeaterCount: 142,
    averageDepthMeters: 4500,
    status: 'ONLINE',
  },
];

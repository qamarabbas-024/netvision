// Real-Time LEO Satellite Orbit Mesh Constellation Engine

export interface SatelliteNode {
  id: string;
  planeId: number;
  altitudeKm: number;
  velocityKmS: number;
  latitude: number;
  longitude: number;
  laserLinksActive: number;
  dopplerShiftKhz: number;
  status: 'TRACKING' | 'INTER_SAT_ACTIVE' | 'GROUND_HANDOVER';
}

export const SAMPLE_LEO_SATELLITES: SatelliteNode[] = [
  { id: 'LEO-P1-01', planeId: 1, altitudeKm: 550, velocityKmS: 7.59, latitude: 45.2, longitude: -73.5, laserLinksActive: 4, dopplerShiftKhz: 14.2, status: 'INTER_SAT_ACTIVE' },
  { id: 'LEO-P1-02', planeId: 1, altitudeKm: 550, velocityKmS: 7.59, latitude: 12.8, longitude: -45.1, laserLinksActive: 4, dopplerShiftKhz: -8.4, status: 'TRACKING' },
  { id: 'LEO-P2-01', planeId: 2, altitudeKm: 550, velocityKmS: 7.59, latitude: -23.4, longitude: 18.2, laserLinksActive: 4, dopplerShiftKhz: 22.1, status: 'GROUND_HANDOVER' },
  { id: 'LEO-P2-02', planeId: 2, altitudeKm: 550, velocityKmS: 7.59, latitude: 51.5, longitude: 0.1, laserLinksActive: 4, dopplerShiftKhz: 3.5, status: 'INTER_SAT_ACTIVE' },
];

export function computeOrbitalCoordinate(
  sat: SatelliteNode,
  angleRad: number,
  cx: number,
  cy: number,
  globeRadius: number
): { x: number; y: number; z: number; visible: boolean } {
  const r = globeRadius + 35;
  const latRad = (sat.latitude * Math.PI) / 180;
  const lonRad = (sat.longitude * Math.PI) / 180 + angleRad;

  const x = cx + r * Math.cos(latRad) * Math.sin(lonRad);
  const y = cy - r * Math.sin(latRad);
  const z = r * Math.cos(latRad) * Math.cos(lonRad);

  return {
    x,
    y,
    z,
    visible: z > -globeRadius * 0.4,
  };
}

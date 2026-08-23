/**
 * NetVision Satellite Mesh Constellation & Space-Ground Routing Engine (Version 5.8)
 * Simulates LEO Mega-Constellations (Starlink / Kuiper), Optical Inter-Satellite Lasers (ISL),
 * Doppler shift dynamics, and Delay-Tolerant Networking (DTN).
 */

export interface LeoSatellite {
  id: string;
  name: string;
  altitudeKm: number;
  velocityKmS: number;
  orbitalPlane: number;
  laserLinksActive: number;
  status: 'ONLINE' | 'SUN_OUTAGE' | 'OCCLUDED';
}

export interface GroundStation {
  id: string;
  city: string;
  coordinates: { lat: number; lng: number };
  elevationAngleDeg: number;
  dopplerOffsetKhz: number;
  connectedSatId: string;
}

export class SatelliteMeshEngine {
  public static getConstellationData() {
    const satellites: LeoSatellite[] = [
      { id: 'sat-leo-101', name: 'Star-LEO-Plane-1A', altitudeKm: 550, velocityKmS: 7.6, orbitalPlane: 1, laserLinksActive: 4, status: 'ONLINE' },
      { id: 'sat-leo-102', name: 'Star-LEO-Plane-1B', altitudeKm: 550, velocityKmS: 7.6, orbitalPlane: 1, laserLinksActive: 4, status: 'ONLINE' },
      { id: 'sat-leo-201', name: 'Star-LEO-Plane-2A', altitudeKm: 550, velocityKmS: 7.6, orbitalPlane: 2, laserLinksActive: 4, status: 'ONLINE' },
      { id: 'sat-leo-202', name: 'Star-LEO-Plane-2B', altitudeKm: 550, velocityKmS: 7.6, orbitalPlane: 2, laserLinksActive: 4, status: 'ONLINE' },
    ];

    const groundStations: GroundStation[] = [
      { id: 'gs-london', city: 'London Terminal (UK)', coordinates: { lat: 51.5, lng: -0.1 }, elevationAngleDeg: 48, dopplerOffsetKhz: +32.4, connectedSatId: 'sat-leo-101' },
      { id: 'gs-singapore', city: 'Singapore Gateway', coordinates: { lat: 1.3, lng: 103.8 }, elevationAngleDeg: 55, dopplerOffsetKhz: -18.7, connectedSatId: 'sat-leo-202' },
    ];

    return { satellites, groundStations };
  }
}

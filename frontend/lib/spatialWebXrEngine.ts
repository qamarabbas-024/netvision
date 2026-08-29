// WebXR Spatial 3D Holographic Network Immersion Engine

export interface SpatialVector3 {
  x: number;
  y: number;
  z: number;
}

export interface SpatialHoloNode {
  id: string;
  label: string;
  type: 'CORE_ROUTER' | 'LEAF_SWITCH' | 'QUANTUM_QPU' | 'SATELLITE_NODE';
  position: SpatialVector3;
  color: string;
  status: 'ACTIVE' | 'WARNING' | 'STANDBY';
}

export const SAMPLE_SPATIAL_NODES: SpatialHoloNode[] = [
  { id: 'hn-1', label: 'Spine-Alpha', type: 'CORE_ROUTER', position: { x: 0, y: 120, z: 0 }, color: '#38bdf8', status: 'ACTIVE' },
  { id: 'hn-2', label: 'Leaf-01', type: 'LEAF_SWITCH', position: { x: -140, y: -40, z: -80 }, color: '#22c55e', status: 'ACTIVE' },
  { id: 'hn-3', label: 'Leaf-02', type: 'LEAF_SWITCH', position: { x: 140, y: -40, z: -80 }, color: '#22c55e', status: 'ACTIVE' },
  { id: 'hn-4', label: 'Quantum-QPU', type: 'QUANTUM_QPU', position: { x: 0, y: -100, z: 120 }, color: '#a855f7', status: 'ACTIVE' },
  { id: 'hn-5', label: 'LEO-Sat-Orbital', type: 'SATELLITE_NODE', position: { x: 0, y: 220, z: -140 }, color: '#f59e0b', status: 'ACTIVE' },
];

export function projectSpatial3D(
  p: SpatialVector3,
  rotX: number,
  rotY: number,
  cx: number,
  cy: number,
  zoom = 1.0
): { x: number; y: number; scale: number } {
  const radX = (rotX * Math.PI) / 180;
  const radY = (rotY * Math.PI) / 180;

  const cosY = Math.cos(radY);
  const sinY = Math.sin(radY);
  const x1 = p.x * cosY + p.z * sinY;
  const z1 = -p.x * sinY + p.z * cosY;

  const cosX = Math.cos(radX);
  const sinX = Math.sin(radX);
  const y2 = p.y * cosX - z1 * sinX;
  const z2 = p.y * sinX + z1 * cosX;

  const fov = 450;
  const scale = (fov / (fov + z2)) * zoom;

  return {
    x: cx + x1 * scale,
    y: cy + y2 * scale,
    scale,
  };
}

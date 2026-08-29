// 3D Immersive Datacenter Walk-Through & Physical Rack Geometry Engine

export interface ServerRackUnit {
  uNumber: number;
  deviceType: 'SPINE_SWITCH' | 'LEAF_TOR' | 'COMPUTE_BLADE' | 'NVME_STORAGE' | 'PDU';
  label: string;
  powerWatts: number;
  temperatureCelsius: number;
  status: 'OPTIMAL' | 'WARM' | 'OVERHEATING';
}

export interface DatacenterRack {
  id: string;
  name: string;
  aisle: 'HOT_AISLE' | 'COLD_AISLE';
  positionX: number;
  positionZ: number;
  totalPowerKw: number;
  units: ServerRackUnit[];
}

export const SAMPLE_DC_RACKS: DatacenterRack[] = [
  {
    id: 'RACK-A01',
    name: 'Spine / Aggregation Rack A01',
    aisle: 'COLD_AISLE',
    positionX: -120,
    positionZ: 0,
    totalPowerKw: 8.4,
    units: [
      { uNumber: 42, deviceType: 'PDU', label: 'Smart PDU 30A 208V', powerWatts: 240, temperatureCelsius: 22.4, status: 'OPTIMAL' },
      { uNumber: 40, deviceType: 'SPINE_SWITCH', label: 'Arista 7060X6 800G Spine', powerWatts: 1850, temperatureCelsius: 38.2, status: 'OPTIMAL' },
      { uNumber: 38, deviceType: 'SPINE_SWITCH', label: 'Arista 7060X6 800G Spine', powerWatts: 1820, temperatureCelsius: 39.1, status: 'OPTIMAL' },
      { uNumber: 20, deviceType: 'LEAF_TOR', label: 'Nokia 7220 IXR-D3 ToR', powerWatts: 650, temperatureCelsius: 31.0, status: 'OPTIMAL' },
    ],
  },
  {
    id: 'RACK-A02',
    name: 'AI GPU Compute Blade Rack A02',
    aisle: 'HOT_AISLE',
    positionX: 120,
    positionZ: 0,
    totalPowerKw: 38.2,
    units: [
      { uNumber: 42, deviceType: 'PDU', label: 'High-Density 3-Phase PDU', powerWatts: 420, temperatureCelsius: 32.1, status: 'WARM' },
      { uNumber: 36, deviceType: 'COMPUTE_BLADE', label: '8x H100 GPU Server #1', powerWatts: 10200, temperatureCelsius: 68.4, status: 'WARM' },
      { uNumber: 28, deviceType: 'COMPUTE_BLADE', label: '8x H100 GPU Server #2', powerWatts: 10400, temperatureCelsius: 71.2, status: 'WARM' },
      { uNumber: 20, deviceType: 'NVME_STORAGE', label: '24x NVMe-oF RoCE JBOF', powerWatts: 2100, temperatureCelsius: 44.0, status: 'OPTIMAL' },
    ],
  },
];

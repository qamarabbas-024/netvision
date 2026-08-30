export type DeviceType = 'workstation' | 'switch' | 'router' | 'gateway' | 'server';

export interface NetworkDevice {
  id: string;
  name: string;
  label: string;
  type: DeviceType;
  layer: string;
  ip: string;
  mac: string;
  position: [number, number, number]; // 3D coordinates [x, y, z]
  description: string;
  role: string;
  status: 'healthy' | 'warning' | 'error' | 'active';
  interfaces: {
    name: string;
    ip?: string;
    mac: string;
    status: 'up' | 'down';
    speed: string;
  }[];
  details: {
    cpuUsage: string;
    memoryUsage: string;
    throughput: string;
    mtu?: number;
    routingTable?: { destination: string; gateway: string; interface: string; metric: number }[];
    macTable?: { mac: string; port: string; vlan: number }[];
    firewallRules?: { rule: string; action: 'ALLOW' | 'DENY'; protocol: string }[];
  };
}

export interface NetworkLink {
  id: string;
  from: string;
  to: string;
  status: 'healthy' | 'degraded' | 'failed';
  speed: string;
  latencyMs: number;
  utilizationPercent: number;
  medium: string;
}

export interface EducationalPacket {
  id: string;
  label: string;
  protocol: 'DNS' | 'TCP SYN' | 'IP' | 'HTTP/3';
  source: string;
  destination: string;
  sourceIp: string;
  destIp: string;
  details: Record<string, string | number>;
  stageIndex: number;
}

export type NetworkScenario = 'healthy' | 'degraded' | 'congestion' | 'packet_loss' | 'bgp_reroute';

export interface StoryStage {
  id: number;
  stageNumber: string;
  title: string;
  subtitle: string;
  description: string;
  cameraTarget: [number, number, number];
  cameraPosition: [number, number, number];
  fov?: number;
  focusedDeviceId?: string;
  focusedLinkId?: string;
  packetProgress?: number;
  activePacket?: EducationalPacket;
  networkState: NetworkScenario;
}

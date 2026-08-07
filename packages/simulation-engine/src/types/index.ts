// NetVision Core Simulation Engine Types

export type EngineNodeType =
  | 'pc'
  | 'server'
  | 'router'
  | 'switch'
  | 'firewall'
  | 'cloud'
  | 'access_point';

export type EngineProtocol =
  | 'TCP'
  | 'UDP'
  | 'ARP'
  | 'ICMP'
  | 'DNS'
  | 'DHCP'
  | 'HTTP'
  | 'HTTPS';

export type PacketState = 'idle' | 'in_flight' | 'delivered' | 'dropped' | 'blocked';

export interface Position {
  x: number;
  y: number;
}

export interface InspectionData {
  layer2: {
    sourceMac: string;
    targetMac: string;
    frameType: string;
  };
  layer3: {
    sourceIp: string;
    targetIp: string;
    protocol: EngineProtocol;
    ttl: number;
  };
  layer4: {
    sourcePort: number;
    targetPort: number;
    flags?: string[];
    sequenceNumber?: number;
    ackNumber?: number;
  };
  layer7: {
    payload: string;
  };
}

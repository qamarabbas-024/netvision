export interface TopologyTemplate {
  id: string;
  name: string;
  category: 'ENTERPRISE' | 'SECURITY_DMZ' | 'SERVICE_PROVIDER' | 'DATA_CENTER';
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  description: string;
  nodesCount: number;
  devices: {
    name: string;
    type: 'WORKSTATION' | 'SWITCH' | 'ROUTER' | 'FIREWALL' | 'SERVER';
    ip: string;
    subnet: string;
    vlan?: number;
  }[];
  defaultCommand: string;
}

export const TOPOLOGY_TEMPLATES: TopologyTemplate[] = [
  {
    id: 'tpl-branch-office',
    name: 'Enterprise Branch Office with Dual Gateway',
    category: 'ENTERPRISE',
    difficulty: 'BEGINNER',
    description: 'Corporate client workstation connecting through a 24-port access switch to a redundant dual-homed router gateway.',
    nodesCount: 4,
    devices: [
      { name: 'PC-Finance-01', type: 'WORKSTATION', ip: '10.10.10.101', subnet: '255.255.255.0', vlan: 10 },
      { name: 'SW-Access-Floor1', type: 'SWITCH', ip: '10.10.10.2', subnet: '255.255.255.0' },
      { name: 'RTR-Branch-Primary', type: 'ROUTER', ip: '10.10.10.1', subnet: '255.255.255.0' },
      { name: 'SRV-Core-DNS', type: 'SERVER', ip: '8.8.8.8', subnet: '255.255.255.255' },
    ],
    defaultCommand: 'ping 10.10.10.1 -c 4',
  },
  {
    id: 'tpl-zero-trust-dmz',
    name: 'Zero-Trust DMZ with Multi-Tier Firewall',
    category: 'SECURITY_DMZ',
    difficulty: 'INTERMEDIATE',
    description: 'Separated Web tier, Application tier, and Database cluster protected by stateful packet filtering gateways.',
    nodesCount: 5,
    devices: [
      { name: 'External-Client', type: 'WORKSTATION', ip: '203.0.113.45', subnet: '255.255.255.0' },
      { name: 'FW-Edge-Perimeter', type: 'FIREWALL', ip: '203.0.113.1', subnet: '255.255.255.0' },
      { name: 'Nginx-Reverse-Proxy', type: 'SERVER', ip: '172.16.10.10', subnet: '255.255.255.0', vlan: 100 },
      { name: 'FW-Internal-EastWest', type: 'FIREWALL', ip: '172.16.10.1', subnet: '255.255.255.0' },
      { name: 'Postgres-DB-Cluster', type: 'SERVER', ip: '10.0.50.25', subnet: '255.255.255.0', vlan: 500 },
    ],
    defaultCommand: 'curl -I https://172.16.10.10',
  },
  {
    id: 'tpl-bgp-multi-as',
    name: 'Autonomous BGP Dual-Homed Transit Mesh',
    category: 'SERVICE_PROVIDER',
    difficulty: 'ADVANCED',
    description: '3-Autonomous System eBGP peering network with AS-Path attribute route filtering and loop prevention.',
    nodesCount: 4,
    devices: [
      { name: 'Edge-Router-AS65001', type: 'ROUTER', ip: '198.51.100.1', subnet: '255.255.255.252' },
      { name: 'Transit-Tier1-AS7018', type: 'ROUTER', ip: '198.51.100.2', subnet: '255.255.255.252' },
      { name: 'Transit-Tier1-AS3356', type: 'ROUTER', ip: '198.51.100.6', subnet: '255.255.255.252' },
      { name: 'Target-AS15169-Google', type: 'SERVER', ip: '142.250.72.14', subnet: '255.255.255.0' },
    ],
    defaultCommand: 'traceroute 142.250.72.14',
  },
];

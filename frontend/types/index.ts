// --- NETWORKING CORE TYPES ---

export type NodeType = 'pc' | 'server' | 'router' | 'switch' | 'firewall' | 'dns' | 'cloud' | 'internet';

export type PacketProtocol = 'ARP' | 'DNS' | 'ICMP' | 'HTTP' | 'HTTPS' | 'TCP' | 'UDP' | 'DHCP';

export type PacketStatus = 'idle' | 'in_flight' | 'delivered' | 'dropped' | 'blocked';

export interface NetworkInterface {
  id: string;
  name: string; // e.g. eth0, eth1, ge0/0/0
  ipAddress?: string;
  subnetMask?: string;
  macAddress: string;
  status: 'up' | 'down';
}

export interface RouteEntry {
  destination: string; // e.g. 172.16.0.0/24 or 0.0.0.0/0
  netmask: string;
  gateway: string;
  interfaceName: string;
}

export interface MacTableEntry {
  macAddress: string;
  port: string;
  vlan?: number;
}

export interface FirewallRule {
  id: string;
  action: 'ALLOW' | 'DENY';
  protocol: string; // TCP, UDP, ICMP, ANY
  port?: number; // e.g. 80, 443, 22
  direction: 'INBOUND' | 'OUTBOUND';
}

export interface NetworkNode {
  id: string;
  name: string;
  type: NodeType;
  ipAddress: string;
  macAddress: string;
  subnetMask?: string;
  defaultGateway?: string;
  status: 'online' | 'offline' | 'warning';
  position: { x: number; y: number };
  interfaces?: NetworkInterface[];
  routingTable?: RouteEntry[];
  macTable?: MacTableEntry[];
  firewallRules?: FirewallRule[];
}

export interface NetworkLink {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourcePort?: string; // e.g. eth0
  targetPort?: string; // e.g. eth0/1
  bandwidthMbps: number;
  latencyMs: number;
  status: 'connected' | 'congested' | 'disconnected';
}

export interface NetworkPacket {
  id: string;
  sourceIp: string;
  targetIp: string;
  sourceMac: string;
  targetMac: string;
  protocol: PacketProtocol;
  payload: string;
  ttl: number;
  status: PacketStatus;
  currentLocationNodeId?: string;
  progressPercent: number; // 0 to 100 along edge
  flags?: {
    syn?: boolean;
    ack?: boolean;
    fin?: boolean;
    rst?: boolean;
  };
  seqNumber?: number;
  ackNumber?: number;
  tcpState?: 'LISTEN' | 'SYN_SENT' | 'SYN_RECEIVED' | 'ESTABLISHED' | 'FIN_WAIT' | 'CLOSED';
  hopHistory?: string[];
  dropReason?: string;
}

export interface SimulationEvent {
  id: string;
  timestamp: string;
  nodeId?: string;
  nodeName?: string;
  nodeType?: NodeType;
  eventTitle: string;
  explanation: string;
  type: 'info' | 'success' | 'warning' | 'error';
  packetProtocol?: PacketProtocol;
}

// --- USER & AUTH TYPES ---

export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  username: string;
  fullName?: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

// --- COURSE & LESSON TYPES ---

export type LessonType = 'THEORY' | 'ANIMATION' | 'INTERACTIVE_SIMULATION' | 'SANDBOX_LAB' | 'QUIZ';

export interface Lesson {
  id: string;
  title: string;
  slug: string;
  durationMinutes: number;
  type: LessonType;
  order: number;
  isCompleted?: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  icon: string;
  modulesCount: number;
  lessonsCount: number;
  estimatedHours: number;
  modules?: CourseModule[];
}

// --- SIMULATION & SANDBOX TYPES ---

export interface SimulationState {
  nodes: NetworkNode[];
  links: NetworkLink[];
  activePackets: NetworkPacket[];
  isPlaying: boolean;
  simulationSpeed: number; // 0.5x, 1x, 2x
  events: SimulationEvent[];
}

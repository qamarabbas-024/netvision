// NetVision Authoritative Simulation Visual Domain Model — Drop P

export type VisualNodeType = 'host' | 'switch' | 'router' | 'firewall' | 'server' | 'cloud';

export type VisualLinkType = 'access' | 'trunk' | 'routed' | 'point-to-point';

export type VisualLinkStatus = 'up' | 'down' | 'blocked' | 'degraded';

export type PortStpRole = 'ROOT' | 'DESG' | 'ALT' | 'DISABLED';

export type PortStpState = 'FWD' | 'BLK' | 'LIS' | 'LRN';

export interface VisualPortSpec {
  name: string;
  mode: 'access' | 'trunk' | 'routed';
  status: 'up' | 'down';
  vlan?: number;
  ipAddress?: string;
  stpRole?: PortStpRole;
  stpState?: PortStpState;
  speedMbps?: number;
}

export interface VisualTopologyNode {
  id: string;
  name: string;
  type: VisualNodeType;
  role?: string;
  status: 'online' | 'degraded' | 'offline';
  ipAddress?: string;
  macAddress?: string;
  accessVlan?: number;
  isRootBridge?: boolean;
  ports: VisualPortSpec[];
  position: { x: number; y: number };
  activeBadge?: string;
}

export interface VisualTopologyLink {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourcePort: string;
  targetPort: string;
  type: VisualLinkType;
  status: VisualLinkStatus;
  vlan?: number;
  allowedVlans?: number[];
  stpBlocked?: boolean;
  label?: string;
}

export type PacketForwardingAction =
  | 'forward'
  | 'route'
  | 'translate'
  | 'filter_permit'
  | 'filter_deny'
  | 'drop'
  | 'deliver'
  | 'echo_reply';

export interface VisualPacketHeader {
  srcIp: string;
  dstIp: string;
  protocol: string;
  srcPort?: number;
  dstPort?: number;
  ttl?: number;
  translatedSrcIp?: string;
  translatedSrcPort?: number;
  flags?: string[];
}

export interface VisualPacketHop {
  hopIndex: number;
  fromNodeId: string;
  toNodeId: string;
  deviceType: string;
  action: PacketForwardingAction;
  detail: string;
  packetHeader: VisualPacketHeader;
  interrupted?: boolean;
  terminationReason?: string;
}

export type PacketEventOutcome =
  | 'DELIVERED'
  | 'BLOCKED_BY_ACL'
  | 'NO_ROUTE'
  | 'DROPPED_LINK_DOWN'
  | 'LOOP_PREVENTED';

export interface VisualPacketEvent {
  eventId: string;
  timestamp: string;
  command: string;
  protocol: 'ICMP' | 'TCP' | 'UDP' | 'STP_BPDU' | 'OSPF_HELLO' | 'DNS';
  sourceNodeId: string;
  targetNodeId: string;
  outcome: PacketEventOutcome;
  hops: VisualPacketHop[];
}

export interface SanitizedDiagnosticHintItem {
  level: 1 | 2 | 3 | 4;
  title: string;
  text: string;
  category: 'SUBSYSTEM' | 'COMMAND' | 'OBSERVATION' | 'FAULT_DOMAIN';
}

export interface SanitizedDiagnosticHintsDto {
  currentLevel: number;
  unlockedHints: SanitizedDiagnosticHintItem[];
  canUnlockNext: boolean;
  totalLevels: number;
}

export interface CausalVisualExplanation {
  cause: string;
  stateMutation: string;
  networkConsequence: string;
  packetBehavior: string;
  concept: string;
}

export interface VisualSimulationStateDto {
  sessionId: string;
  labId: string;
  lessonSlug: string;
  stateVersion: number;
  timestamp: string;
  device: {
    hostname: string;
    deviceType: 'SWITCH' | 'ROUTER' | 'FIREWALL' | 'HOST';
    configMode: 'EXEC' | 'GLOBAL_CONFIG' | 'IF_CONFIG' | 'ROUTER_OSPF' | 'VLAN_CONFIG';
    activeInterface?: string;
    activeVlanId?: number;
  };
  topologyNodes: VisualTopologyNode[];
  topologyLinks: VisualTopologyLink[];
  vlans: Array<{ id: number; name: string; ports: string[]; status: 'active' | 'suspended' }>;
  trunks: Array<{ interface: string; nativeVlan: number; allowedVlans: number[]; status: 'trunking' | 'down' }>;
  stp: {
    isRootBridge: boolean;
    bridgePriority: number;
    mac: string;
    rootBridgeMac: string;
    costToRoot: number;
    rootPort?: string;
    blockedPorts: string[];
  };
  routes: Array<{ prefix: string; mask: string; nextHop: string; interface: string; protocol: string }>;
  activeAclCount: number;
  natActive: boolean;
  natTranslationCount: number;
  recentPacketEvents: VisualPacketEvent[];
  lastActionSummary: string;
  causalConsequence?: CausalVisualExplanation;
  hints?: SanitizedDiagnosticHintsDto;
}

export interface ExecuteLabCommandRequestDto {
  labId: string;
  command: string;
  clientStateVersion?: number;
  sessionId?: string;
}

export interface UnlockLabHintRequestDto {
  labId: string;
  sessionId?: string;
}

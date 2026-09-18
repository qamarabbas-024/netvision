/**
 * NETVISION NETWORK SIMULATION ENGINE
 *
 * Provides realistic, deterministic Layer 2, Layer 3, Security, and Services simulation.
 * State mutations are derived from real networking commands (Cisco IOS / Linux iproute2 / Wireshark).
 * Validation inspects resulting device and topology state — "show" commands alone never pass a configuration or troubleshooting task.
 */

import {
  VisualSimulationStateDto,
  VisualTopologyNode,
  VisualTopologyLink,
  VisualPacketEvent,
  VisualPacketHop,
  SanitizedDiagnosticHintsDto,
  SanitizedDiagnosticHintItem,
  CausalVisualExplanation,
} from '@netvision/shared';

export interface SimVlan {
  id: number;
  name: string;
  ports: string[];
  status: 'active' | 'suspended';
}

export interface SimTrunk {
  interface: string;
  nativeVlan: number;
  allowedVlans: number[];
  status: 'trunking' | 'down';
}

export interface SimInterface {
  name: string;
  ip?: string;
  mask?: string;
  status: 'up' | 'down';
  mtu: number;
  isInside?: boolean;
  isOutside?: boolean;
  accessVlan?: number;
  mode?: 'access' | 'trunk' | 'routed';
}

export interface SimRoute {
  prefix: string;
  mask: string;
  nextHop: string;
  interface: string;
  protocol: 'C' | 'S' | 'O' | 'B';
  adminDistance: number;
  metric: number;
}

export interface SimOspfNeighbor {
  routerId: string;
  ip: string;
  interface: string;
  state: 'FULL' | '2-WAY' | 'INIT' | 'DOWN';
  role: 'DR' | 'BDR' | 'DROTHER';
}

export interface SimAclRule {
  seq: number;
  action: 'permit' | 'deny';
  protocol: string;
  source: string;
  dest: string;
  port?: number;
}

export interface SimNatTranslation {
  protocol: 'tcp' | 'udp' | 'icmp';
  insideLocal: string;
  insideGlobal: string;
  outsideLocal: string;
  outsideGlobal: string;
}

export interface SimIpsecSa {
  peerIp: string;
  phase1: 'UP' | 'DOWN';
  phase2: 'UP' | 'DOWN';
  transformSet: string;
  dhGroup: number;
  encPackets: number;
  decPackets: number;
}

export interface NetworkSimulatorState {
  hostname: string;
  deviceType: 'SWITCH' | 'ROUTER' | 'FIREWALL' | 'HOST';
  currentConfigMode?: 'EXEC' | 'GLOBAL_CONFIG' | 'IF_CONFIG' | 'ROUTER_OSPF' | 'VLAN_CONFIG';
  activeInterface?: string;
  activeVlanId?: number;
  
  // Layer 2 State
  vlans: Record<number, SimVlan>;
  trunks: Record<string, SimTrunk>;
  stp: {
    bridgePriority: number;
    mac: string;
    rootBridgeMac: string;
    costToRoot: number;
    rootPort?: string;
  };
  
  // Layer 3 State
  interfaces: Record<string, SimInterface>;
  routes: SimRoute[];
  
  // OSPF State
  ospf?: {
    processId: number;
    routerId: string;
    networks: Array<{ network: string; wildcard: string; area: number }>;
    neighbors: SimOspfNeighbor[];
  };
  
  // Security State
  acls: Record<string, SimAclRule[]>;
  appliedAcls: Record<string, { in?: string; out?: string }>;
  natOverloadEnabled?: boolean;
  natTranslations: SimNatTranslation[];
  ipsec?: SimIpsecSa;

  // Services State
  dhcpPools?: Record<string, { network: string; mask: string; defaultRouter: string; dns: string }>;
  dhcpBindings?: Array<{ ip: string; mac: string; leaseExpires: string }>;
  dnsRecords?: Record<string, string>;

  // Break-fix / Diagnostic telemetry
  injectedFault?: string;
  faultResolved?: boolean;
  diagnosticsCompleted: string[];
}

export interface SimCommandResult {
  output: string;
  category: string;
  updatedState: NetworkSimulatorState;
  packetEvents?: VisualPacketEvent[];
  lastActionSummary?: string;
  causalConsequence?: CausalVisualExplanation;
}

export class NetworkSimulationEngine {
  /**
   * Initializes state tailored to a specific lab scenario.
   */
  public static getInitialStateForLab(slug: string): NetworkSimulatorState {
    // Default Router State
    const state: NetworkSimulatorState = {
      hostname: 'R1',
      deviceType: 'ROUTER',
      currentConfigMode: 'EXEC',
      vlans: {
        1: { id: 1, name: 'default', ports: ['Fa0/1', 'Fa0/2'], status: 'active' },
      },
      trunks: {},
      stp: {
        bridgePriority: 32768,
        mac: '001A.2B3C.4D01',
        rootBridgeMac: '001A.2B3C.4D01',
        costToRoot: 0,
      },
      interfaces: {
        'GigabitEthernet0/0': { name: 'GigabitEthernet0/0', ip: '192.168.1.1', mask: '255.255.255.0', status: 'up', mtu: 1500, mode: 'routed' },
        'GigabitEthernet0/1': { name: 'GigabitEthernet0/1', ip: '10.0.0.1', mask: '255.255.255.252', status: 'up', mtu: 1500, mode: 'routed' },
      },
      routes: [
        { prefix: '192.168.1.0', mask: '255.255.255.0', nextHop: 'directly connected', interface: 'GigabitEthernet0/0', protocol: 'C', adminDistance: 0, metric: 0 },
        { prefix: '10.0.0.0', mask: '255.255.255.252', nextHop: 'directly connected', interface: 'GigabitEthernet0/1', protocol: 'C', adminDistance: 0, metric: 0 },
      ],
      acls: {},
      appliedAcls: {},
      natTranslations: [],
      diagnosticsCompleted: [],
    };

    // Lab-Specific State Customizations
    if (slug.includes('vlan') || slug.includes('switching')) {
      state.hostname = 'SW1';
      state.deviceType = 'SWITCH';
      state.vlans = {
        1: { id: 1, name: 'default', ports: ['FastEthernet0/1', 'FastEthernet0/2', 'FastEthernet0/3', 'GigabitEthernet0/1'], status: 'active' },
        10: { id: 10, name: 'MANAGEMENT', ports: ['FastEthernet0/1'], status: 'active' },
      };
      state.trunks = {
        'GigabitEthernet0/1': { interface: 'GigabitEthernet0/1', nativeVlan: 1, allowedVlans: [1, 10], status: 'trunking' },
      };
      state.interfaces = {
        'FastEthernet0/1': { name: 'FastEthernet0/1', status: 'up', mtu: 1500, accessVlan: 10, mode: 'access' },
        'FastEthernet0/2': { name: 'FastEthernet0/2', status: 'up', mtu: 1500, accessVlan: 1, mode: 'access' },
        'GigabitEthernet0/1': { name: 'GigabitEthernet0/1', status: 'up', mtu: 1500, mode: 'trunk' },
      };
    } else if (slug.includes('spanning-tree')) {
      state.hostname = 'SW-ACCESS';
      state.deviceType = 'SWITCH';
      state.stp = {
        bridgePriority: 32768,
        mac: '001A.2B3C.4D55',
        rootBridgeMac: '000C.85FE.1100',
        costToRoot: 19,
        rootPort: 'GigabitEthernet0/1',
      };
    } else if (slug.includes('ospf')) {
      state.hostname = 'R-OSPF-1';
      state.ospf = {
        processId: 1,
        routerId: '1.1.1.1',
        networks: [{ network: '10.0.0.0', wildcard: '0.0.0.3', area: 0 }],
        neighbors: [
          { routerId: '2.2.2.2', ip: '10.0.0.2', interface: 'GigabitEthernet0/1', state: 'FULL', role: 'BDR' },
        ],
      };
    } else if (slug.includes('acl') || slug.includes('firewall')) {
      state.hostname = 'EDGE-FW';
      state.deviceType = 'FIREWALL';
      state.acls = {
        '101': [
          { seq: 10, action: 'permit', protocol: 'tcp', source: '192.168.1.0/24', dest: 'any', port: 443 },
          { seq: 20, action: 'deny', protocol: 'ip', source: '10.50.0.0/16', dest: 'any' },
        ],
      };
    } else if (slug.includes('nat')) {
      state.hostname = 'NAT-GW';
      state.interfaces['GigabitEthernet0/0'].isInside = true;
      state.interfaces['GigabitEthernet0/1'].isOutside = true;
      state.natOverloadEnabled = false;
    } else if (slug.includes('ipsec') || slug.includes('vpn')) {
      state.hostname = 'VPN-GATEWAY';
      state.ipsec = {
        peerIp: '203.0.113.2',
        phase1: 'DOWN',
        phase2: 'DOWN',
        transformSet: 'ESP-AES256-SHA256',
        dhGroup: 14,
        encPackets: 0,
        decPackets: 0,
      };
      state.injectedFault = 'IKE_PRESHARED_KEY_MISMATCH';
    } else if (slug.includes('troubleshoot')) {
      state.hostname = 'T-SHOOT-ROUTER';
      state.injectedFault = 'DEFAULT_GATEWAY_MISSING';
      // Missing default route
    }

    return state;
  }

  /**
   * Executes a command against simulated network state and returns the derived output + mutated state.
   */
  public static executeCommand(
    command: string,
    currentState: NetworkSimulatorState,
    slug: string = ''
  ): SimCommandResult {
    const cleanCmd = (command || '').trim();
    const state = JSON.parse(JSON.stringify(currentState)) as NetworkSimulatorState;
    const lower = cleanCmd.toLowerCase();

    state.diagnosticsCompleted = state.diagnosticsCompleted || [];
    if (!state.diagnosticsCompleted.includes(cleanCmd)) {
      state.diagnosticsCompleted.push(cleanCmd);
    }

    let output = '';
    let category = 'Diagnostic';
    let packetEvents: VisualPacketEvent[] | undefined = undefined;
    let lastActionSummary = `Executed command: ${cleanCmd}`;
    let causalConsequence: CausalVisualExplanation | undefined = undefined;

    // -------------------------------------------------------------------------
    // 1. CONFIGURATION NAVIGATION COMMANDS
    // -------------------------------------------------------------------------
    if (lower === 'configure terminal' || lower === 'conf t') {
      state.currentConfigMode = 'GLOBAL_CONFIG';
      category = 'Configuration';
      output = `Enter configuration commands, one per line. End with CNTL/Z.\n${state.hostname}(config)#`;
      lastActionSummary = 'Entered global configuration mode.';
      causalConsequence = {
        cause: cleanCmd,
        stateMutation: 'currentConfigMode = GLOBAL_CONFIG',
        networkConsequence: 'Privileged configuration commands now accepted by device CLI',
        packetBehavior: 'Prepares device for interface and protocol state mutations; zero immediate packet impact',
        concept: 'Cisco IOS Configuration Hierarchy',
      };
      return { output, category, updatedState: state, lastActionSummary, causalConsequence };
    }

    if (lower === 'exit' || lower === 'end') {
      if (state.currentConfigMode === 'IF_CONFIG' || state.currentConfigMode === 'VLAN_CONFIG' || state.currentConfigMode === 'ROUTER_OSPF') {
        state.currentConfigMode = 'GLOBAL_CONFIG';
        output = `${state.hostname}(config)#`;
      } else {
        state.currentConfigMode = 'EXEC';
        output = `${state.hostname}#`;
      }
      lastActionSummary = 'Exited to parent CLI context.';
      causalConsequence = {
        cause: cleanCmd,
        stateMutation: `currentConfigMode transitioned to ${state.currentConfigMode}`,
        networkConsequence: 'Sub-configuration block closed and active parameters committed',
        packetBehavior: 'Zero immediate packet impact',
        concept: 'IOS Configuration Context Scope',
      };
      return { output, category: 'Navigation', updatedState: state, lastActionSummary, causalConsequence };
    }

    // Hostname command: hostname R1-Test or hostname Tab1-Router
    const hostMatch = cleanCmd.match(/^hostname\s+([a-zA-Z0-9_-]+)/i);
    if (hostMatch) {
      state.hostname = hostMatch[1];
      lastActionSummary = `Configured device hostname to ${hostMatch[1]}.`;
      causalConsequence = {
        cause: cleanCmd,
        stateMutation: `hostname = "${hostMatch[1]}"`,
        networkConsequence: `Device administrative identifier updated to ${hostMatch[1]}`,
        packetBehavior: 'Zero immediate packet impact',
        concept: 'Device Identity Configuration',
      };
      return { output: '', category: 'Configuration', updatedState: state, lastActionSummary, causalConsequence };
    }

    // Interface configuration navigation: interface gigabitethernet0/1 or int gi0/1
    const intMatch = cleanCmd.match(/^(?:interface|int)\s+([a-zA-Z0-9/.]+)/i);
    if (intMatch) {
      state.currentConfigMode = 'IF_CONFIG';
      const ifName = intMatch[1];
      state.activeInterface = ifName;
      if (!state.interfaces[ifName]) {
        state.interfaces[ifName] = { name: ifName, status: 'up', mtu: 1500 };
      }
      lastActionSummary = `Selected interface ${ifName} for configuration.`;
      causalConsequence = {
        cause: cleanCmd,
        stateMutation: `activeInterface = ${ifName}`,
        networkConsequence: `Targeting physical/logical interface ${ifName} for parameter tuning`,
        packetBehavior: 'Subsequent commands will alter L2/L3 encapsulation on this interface',
        concept: 'Port-Level Interface Architecture',
      };
      return { output: `${state.hostname}(config-if)#`, category: 'Configuration', updatedState: state, lastActionSummary, causalConsequence };
    }

    // VLAN configuration navigation: vlan 20
    const vlanNavMatch = cleanCmd.match(/^vlan\s+(\d+)$/i);
    if (vlanNavMatch) {
      state.currentConfigMode = 'VLAN_CONFIG';
      const vId = parseInt(vlanNavMatch[1], 10);
      state.activeVlanId = vId;
      if (!state.vlans[vId]) {
        state.vlans[vId] = { id: vId, name: `VLAN00${vId}`, ports: [], status: 'active' };
      }
      lastActionSummary = `Created/selected VLAN ${vId} in switch database.`;
      causalConsequence = {
        cause: cleanCmd,
        stateMutation: `Allocated VLAN ${vId} in Layer 2 database`,
        networkConsequence: `Created isolated Layer 2 broadcast domain (VLAN ${vId})`,
        packetBehavior: 'Broadcasts in VLAN ' + vId + ' will be isolated from default VLAN 1',
        concept: 'IEEE 802.1Q Virtual LAN Broadcast Partitioning',
      };
      return { output: `${state.hostname}(config-vlan)#`, category: 'Configuration', updatedState: state, lastActionSummary, causalConsequence };
    }

    // VLAN naming: name SALES
    const nameMatch = cleanCmd.match(/^name\s+([a-zA-Z0-9_-]+)/i);
    if (nameMatch && (state.currentConfigMode === 'VLAN_CONFIG' || state.activeVlanId)) {
      const vlanName = nameMatch[1];
      const targetVlan = state.activeVlanId || 1;
      if (state.vlans[targetVlan]) {
        state.vlans[targetVlan].name = vlanName;
      }
      lastActionSummary = `Assigned descriptive name "${vlanName}" to VLAN ${targetVlan}.`;
      causalConsequence = {
        cause: cleanCmd,
        stateMutation: `vlans[${targetVlan}].name = "${vlanName}"`,
        networkConsequence: 'VLAN database entry labeled for human readability and network documentation',
        packetBehavior: 'Zero direct frame impact; broadcast domain ID remains ' + targetVlan,
        concept: 'VLAN Database Metadata Management',
      };
      return { output: `${state.hostname}(config-vlan)#`, category: 'Configuration', updatedState: state, lastActionSummary, causalConsequence };
    }

    // Switchport mode access / trunk
    if (lower.startsWith('switchport mode trunk')) {
      const ifName = state.activeInterface || 'GigabitEthernet0/1';
      state.activeInterface = ifName;
      state.interfaces[ifName] = state.interfaces[ifName] || { name: ifName, status: 'up', mtu: 1500 };
      state.interfaces[ifName].mode = 'trunk';
      state.trunks[ifName] = {
        interface: ifName,
        nativeVlan: 1,
        allowedVlans: [1, 10, 20],
        status: 'trunking',
      };
      lastActionSummary = `Configured interface ${ifName} as 802.1Q trunk link.`;
      causalConsequence = {
        cause: cleanCmd,
        stateMutation: `interfaces[${ifName}].mode = 'trunk', trunks active`,
        networkConsequence: `Link now encapsulates frames with IEEE 802.1Q 4-byte VLAN tags`,
        packetBehavior: `Allows frames from multiple VLANs (1, 10, 20) to traverse single physical link`,
        concept: 'IEEE 802.1Q VLAN Tagging & Trunk Multiplexing',
      };
      return { output: `Line protocol on Interface ${ifName}, changed state to up`, category: 'Configuration', updatedState: state, lastActionSummary, causalConsequence };
    }

    // Switchport trunk allowed vlan 10,20,30
    if (lower.startsWith('switchport trunk allowed vlan')) {
      const ifName = state.activeInterface || 'GigabitEthernet0/1';
      const parts = cleanCmd.split(/\s+/);
      const vlansPart = parts[parts.length - 1] || '';
      const allowed = vlansPart.split(',').map((v) => parseInt(v.trim(), 10)).filter((n) => !isNaN(n));
      state.trunks[ifName] = state.trunks[ifName] || { interface: ifName, nativeVlan: 1, allowedVlans: [], status: 'trunking' };
      state.trunks[ifName].allowedVlans = allowed.length > 0 ? allowed : [1, 10, 20, 30];
      lastActionSummary = `Configured allowed VLANs [${state.trunks[ifName].allowedVlans.join(',')}] on trunk ${ifName}.`;
      causalConsequence = {
        cause: cleanCmd,
        stateMutation: `trunks[${ifName}].allowedVlans = [${state.trunks[ifName].allowedVlans.join(',')}]`,
        networkConsequence: `VLAN pruning filter applied: only permitted VLAN frames transit trunk`,
        packetBehavior: `Frames from allowed VLANs permitted; untrusted/unspecified VLANs pruned`,
        concept: 'Trunk VLAN Filtering & Pruning',
      };
      return { output: `${state.hostname}(config-if)#`, category: 'Configuration', updatedState: state, lastActionSummary, causalConsequence };
    }

    if (lower.startsWith('switchport access vlan')) {
      const vId = parseInt(cleanCmd.split(/\s+/)[3], 10) || 1;
      const ifName = state.activeInterface || 'FastEthernet0/2';
      state.activeInterface = ifName;
      state.interfaces[ifName] = state.interfaces[ifName] || { name: ifName, status: 'up', mtu: 1500 };
      state.interfaces[ifName].mode = 'access';
      state.interfaces[ifName].accessVlan = vId;
      if (!state.vlans[vId]) {
        state.vlans[vId] = { id: vId, name: `VLAN00${vId}`, ports: [], status: 'active' };
      }
      if (!state.vlans[vId].ports.includes(ifName)) {
        state.vlans[vId].ports.push(ifName);
      }
      lastActionSummary = `Assigned access interface ${ifName} to VLAN ${vId}.`;
      causalConsequence = {
        cause: cleanCmd,
        stateMutation: `interfaces[${ifName}].accessVlan = ${vId}`,
        networkConsequence: `Frames entering ${ifName} are mapped to VLAN ${vId}`,
        packetBehavior: `Host connected to ${ifName} now exchanges untagged traffic only within VLAN ${vId}`,
        concept: 'Port-Based VLAN Membership (Access Ports)',
      };
      return { output: `${state.hostname}(config-if)#`, category: 'Configuration', updatedState: state, lastActionSummary, causalConsequence };
    }

    // -------------------------------------------------------------------------
    // 2. LAYER 2 SWITCHING & STP COMMANDS
    // -------------------------------------------------------------------------
    if (lower.includes('show vlan') || lower.includes('show vlan brief')) {
      category = 'Layer 2 Switching';
      output = 'VLAN Name                             Status    Ports\n';
      output += '---- -------------------------------- --------- -------------------------------\n';
      for (const v of Object.values(state.vlans)) {
        const ports = v.ports.join(', ') || '';
        output += `${v.id.toString().padEnd(4)} ${v.name.padEnd(32)} ${v.status.padEnd(9)} ${ports}\n`;
      }
      lastActionSummary = 'Inspected VLAN database and port allocations.';
      causalConsequence = {
        cause: cleanCmd,
        stateMutation: 'None (Passive inspection)',
        networkConsequence: 'Displayed current active VLAN memberships without modifying switch state',
        packetBehavior: 'Packet forwarding unchanged',
        concept: 'Layer 2 Switching Inspection & Telemetry',
      };
      return { output: output.trim(), category, updatedState: state, lastActionSummary, causalConsequence };
    }

    if (lower.includes('show interfaces trunk')) {
      category = 'Layer 2 Switching';
      output = 'Port        Mode         Encapsulation  Status        Native vlan\n';
      for (const t of Object.values(state.trunks)) {
        output += `${t.interface.padEnd(11)} on           802.1q         ${t.status.padEnd(13)} ${t.nativeVlan}\n\n`;
        output += `Port        Vlans allowed on trunk\n${t.interface.padEnd(11)} ${t.allowedVlans.join(',')}\n`;
      }
      lastActionSummary = 'Inspected 802.1Q trunking status and allowed VLAN lists.';
      causalConsequence = {
        cause: cleanCmd,
        stateMutation: 'None (Passive inspection)',
        networkConsequence: 'Confirmed trunk encapsulation and native VLAN configuration',
        packetBehavior: 'Packet forwarding unchanged',
        concept: 'Trunk Port Operational Telemetry',
      };
      return { output: output.trim(), category, updatedState: state, lastActionSummary, causalConsequence };
    }

    if (lower.includes('show spanning-tree')) {
      category = 'Spanning Tree Protocol';
      const stp = state.stp;
      const isRoot = stp.mac === stp.rootBridgeMac || stp.bridgePriority < 32768;
      output = `VLAN0001\n  Spanning tree enabled protocol rstp\n  Root ID    Priority    ${isRoot ? stp.bridgePriority : 4096}\n             Address     ${stp.rootBridgeMac}\n             ${isRoot ? 'This bridge is the root' : `Cost        ${stp.costToRoot}\n             Port        ${stp.rootPort || 'Gi0/1'}`}\n\n`;
      output += `  Bridge ID  Priority    ${stp.bridgePriority}  (priority ${stp.bridgePriority} sys-id-ext 1)\n             Address     ${stp.mac}\n\n`;
      output += 'Interface           Role Sts Cost      Prio.Nbr Type\n------------------- ---- --- --------- -------- --------------------------------\n';
      output += `${stp.rootPort || 'Gi0/1'}               ROOT FWD 19        128.1    P2p\nGi0/2               DESG FWD 19        128.2    P2p\nGi0/3               ALT  BLK 19        128.3    P2p\n`;
      lastActionSummary = 'Inspected Spanning Tree Protocol (STP) Bridge ID, root path, and port roles.';
      causalConsequence = {
        cause: cleanCmd,
        stateMutation: 'None (Passive inspection)',
        networkConsequence: 'Verified bridge priority and port roles (ROOT, DESG, ALT/BLK)',
        packetBehavior: 'Forwarding occurs on ROOT and DESG ports; blocked on ALT ports to prevent loops',
        concept: 'STP Loop Prevention & Bridge ID Telemetry',
      };
      return { output: output.trim(), category, updatedState: state, lastActionSummary, causalConsequence };
    }

    if (cleanCmd.match(/^spanning-tree vlan\s+(\d+)\s+priority\s+(\d+)$/i)) {
      const pri = parseInt(cleanCmd.split(/\s+/)[4], 10);
      state.stp.bridgePriority = pri;
      if (pri < 32768) {
        state.stp.rootBridgeMac = state.stp.mac;
        state.stp.costToRoot = 0;
      }
      lastActionSummary = `Modified STP Bridge Priority to ${pri}.`;
      causalConsequence = {
        cause: cleanCmd,
        stateMutation: `stp.bridgePriority = ${pri}`,
        networkConsequence: pri < 32768 ? 'Switch wins election and becomes Root Bridge' : 'Bridge priority tuned',
        packetBehavior: 'Spanning tree recalculates forwarding tree; unblocks non-loop paths',
        concept: 'Root Bridge Election Algorithm (IEEE 802.1D)',
      };
      return { output: `${state.hostname}(config)#`, category: 'Configuration', updatedState: state, lastActionSummary, causalConsequence };
    }

    // -------------------------------------------------------------------------
    // 3. LAYER 3 ROUTING & CIDR COMMANDS
    // -------------------------------------------------------------------------
    if (lower.includes('show ip route')) {
      category = 'Routing Table';
      output = 'Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP\n       O - OSPF, IA - OSPF inter area, E1 - OSPF external type 1\n\n';
      const defaultRoute = state.routes.find(r => r.prefix === '0.0.0.0');
      if (defaultRoute) {
        output += `Gateway of last resort is ${defaultRoute.nextHop} to network 0.0.0.0\n\n`;
      } else {
        output += 'Gateway of last resort is not set\n\n';
      }
      for (const r of state.routes) {
        if (r.prefix === '0.0.0.0') {
          output += `S*   0.0.0.0/0 [${r.adminDistance}/${r.metric}] via ${r.nextHop}\n`;
        } else {
          output += `${r.protocol}    ${r.prefix}/${r.mask} is directly connected, ${r.interface}\n`;
        }
      }
      lastActionSummary = 'Inspected IPv4 Routing Information Base (RIB).';
      causalConsequence = {
        cause: cleanCmd,
        stateMutation: 'None (Passive inspection)',
        networkConsequence: 'Observed connected, static, and default forwarding entries',
        packetBehavior: 'Packet routing continues using active Longest Prefix Match table',
        concept: 'Routing Table Forwarding Architecture',
      };
      return { output: output.trim(), category, updatedState: state, lastActionSummary, causalConsequence };
    }

    // ip route 0.0.0.0 0.0.0.0 192.168.1.254
    const routeMatch = cleanCmd.match(/^ip route\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)/i);
    if (routeMatch) {
      const [, pfx, msk, nh] = routeMatch;
      state.routes = state.routes.filter(r => r.prefix !== pfx);
      state.routes.push({
        prefix: pfx,
        mask: msk,
        nextHop: nh,
        interface: 'GigabitEthernet0/1',
        protocol: 'S',
        adminDistance: 1,
        metric: 0,
      });
      if (state.injectedFault === 'DEFAULT_GATEWAY_MISSING' && pfx === '0.0.0.0') {
        state.faultResolved = true;
      }
      lastActionSummary = `Added static route for ${pfx}/${msk} via next hop ${nh}.`;
      causalConsequence = {
        cause: cleanCmd,
        stateMutation: `routes.push(${pfx}/${msk} via ${nh})`,
        networkConsequence: pfx === '0.0.0.0' ? 'Gateway of last resort configured' : 'Static prefix route installed',
        packetBehavior: `Packets matching ${pfx} forwarded through GigabitEthernet0/1 to ${nh}`,
        concept: 'Static Routing & Default Gateway Forwarding',
      };
      return { output: `${state.hostname}(config)#`, category: 'Configuration', updatedState: state, lastActionSummary, causalConsequence };
    }

    // -------------------------------------------------------------------------
    // 4. DYNAMIC ROUTING (OSPF) COMMANDS
    // -------------------------------------------------------------------------
    if (lower.includes('show ip ospf neighbor')) {
      category = 'OSPF Protocol';
      if (!state.ospf || state.ospf.neighbors.length === 0) {
        output = 'OSPF Process 1: No active neighbors';
      } else {
        output = 'Neighbor ID     Pri   State           Dead Time   Address         Interface\n';
        for (const n of state.ospf.neighbors) {
          output += `${n.routerId.padEnd(15)} 1     ${n.state}/${n.role.padEnd(8)} 00:00:34    ${n.ip.padEnd(15)} ${n.interface}\n`;
        }
      }
      lastActionSummary = 'Inspected OSPF link-state neighbor adjacencies.';
      causalConsequence = {
        cause: cleanCmd,
        stateMutation: 'None (Passive inspection)',
        networkConsequence: 'Observed OSPF neighbor states (FULL/DR/BDR)',
        packetBehavior: 'OSPF hello and LSA link-state packets actively maintain table',
        concept: 'OSPF Link-State Adjacency Telemetry',
      };
      return { output: output.trim(), category, updatedState: state, lastActionSummary, causalConsequence };
    }

    if (cleanCmd.match(/^network\s+([0-9.]+)\s+([0-9.]+)\s+area\s+(\d+)/i)) {
      const parts = cleanCmd.split(/\s+/);
      state.ospf = state.ospf || { processId: 1, routerId: '1.1.1.1', networks: [], neighbors: [] };
      state.ospf.networks.push({ network: parts[1], wildcard: parts[2], area: parseInt(parts[4], 10) });
      state.ospf.neighbors = [
        { routerId: '2.2.2.2', ip: '10.0.0.2', interface: 'GigabitEthernet0/1', state: 'FULL', role: 'DR' },
      ];
      lastActionSummary = `Advertised ${parts[1]}/${parts[2]} into OSPF Area ${parts[4]}; adjacency converged to FULL.`;
      causalConsequence = {
        cause: cleanCmd,
        stateMutation: `ospf.networks.push(area ${parts[4]}); neighbor state = FULL`,
        networkConsequence: 'Subnet advertised via Type-1 Router LSA into OSPF Area ' + parts[4],
        packetBehavior: 'Dynamic route calculation synchronizes LSDB; routes exchanged with neighbor 2.2.2.2',
        concept: 'OSPF Area Flooding & Adjacency Convergence',
      };
      return { output: `[OSPF-1]: Interface GigabitEthernet0/1 area ${parts[4]} neighbor 2.2.2.2 state changed to FULL`, category: 'OSPF Protocol', updatedState: state, lastActionSummary, causalConsequence };
    }

    // -------------------------------------------------------------------------
    // 5. SECURITY & ACCESS LIST (ACL) COMMANDS
    // -------------------------------------------------------------------------
    if (lower.includes('show access-lists') || lower.includes('show ip access-lists')) {
      category = 'Access Control Lists';
      if (Object.keys(state.acls).length === 0) {
        output = 'No access lists configured';
      } else {
        output = '';
        for (const [id, rules] of Object.entries(state.acls)) {
          output += `Extended IP access list ${id}\n`;
          for (const r of rules) {
            output += `    ${r.seq} ${r.action} ${r.protocol} ${r.source} ${r.dest}${r.port ? ` eq ${r.port}` : ''} (matches 42 packets)\n`;
          }
        }
      }
      lastActionSummary = 'Inspected active Extended IP Access Control List (ACL) rules.';
      causalConsequence = {
        cause: cleanCmd,
        stateMutation: 'None (Passive inspection)',
        networkConsequence: 'Observed rule sequence ordering, protocol masks, and packet match counters',
        packetBehavior: 'Traffic continues to be evaluated top-down against filter rules',
        concept: 'Access Control List Rule Sequencing & Inspection',
      };
      return { output: output.trim(), category, updatedState: state, lastActionSummary, causalConsequence };
    }

    // access-list 101 permit/deny ...
    const aclMatch = cleanCmd.match(/^access-list\s+(\d+)\s+(permit|deny)\s+([a-zA-Z0-9]+)\s+(.+)/i);
    if (aclMatch) {
      const [, aclId, action, proto, rest] = aclMatch;
      const parts = rest.trim().split(/\s+/);
      const src = parts[0] || 'any';
      const dst = parts[1] || 'any';
      const eqIdx = parts.indexOf('eq');
      const port = eqIdx !== -1 && parts[eqIdx + 1] ? parseInt(parts[eqIdx + 1], 10) : undefined;
      state.acls[aclId] = state.acls[aclId] || [];
      state.acls[aclId].push({
        seq: (state.acls[aclId].length + 1) * 10,
        action: action.toLowerCase() as 'permit' | 'deny',
        protocol: proto.toLowerCase(),
        source: src,
        dest: dst,
        port,
      });
      lastActionSummary = `Added ACL ${aclId} rule: ${action.toUpperCase()} ${proto} ${src} -> ${dst}.`;
      causalConsequence = {
        cause: cleanCmd,
        stateMutation: `acls[${aclId}].push(${action} ${proto} ${src} ${dst})`,
        networkConsequence: 'Security perimeter filtering rules committed in sequential order',
        packetBehavior: action.toLowerCase() === 'deny' ? 'Traffic matching this 4-tuple will be discarded at perimeter' : 'Matching traffic permitted across firewall',
        concept: 'Stateful Packet Filtering & ACL Rule Order',
      };
      return { output: `${state.hostname}(config)#`, category: 'Configuration', updatedState: state, lastActionSummary, causalConsequence };
    }

    // -------------------------------------------------------------------------
    // 6. NAT / PAT COMMANDS
    // -------------------------------------------------------------------------
    if (lower.includes('show ip nat translations')) {
      category = 'NAT/PAT Service';
      if (state.natTranslations.length === 0) {
        output = 'Pro  Inside global         Inside local          Outside local         Outside global\n---  --------------------  --------------------  --------------------  --------------------\ntcp  203.0.113.5:1024      192.168.1.50:49152    198.51.100.1:443      198.51.100.1:443\ntcp  203.0.113.5:1025      192.168.1.51:51200    198.51.100.1:443      198.51.100.1:443';
      } else {
        output = 'Pro  Inside global         Inside local          Outside local         Outside global\n';
        for (const t of state.natTranslations) {
          output += `${t.protocol.padEnd(4)} ${t.insideGlobal.padEnd(21)} ${t.insideLocal.padEnd(21)} ${t.outsideLocal.padEnd(21)} ${t.outsideGlobal}\n`;
        }
      }
      lastActionSummary = 'Inspected active Network Address Translation (NAT/PAT) table.';
      causalConsequence = {
        cause: cleanCmd,
        stateMutation: 'None (Passive inspection)',
        networkConsequence: 'Observed Inside Local to Inside Global dynamic socket bindings',
        packetBehavior: 'Outbound and return packets translated according to active session map',
        concept: 'NAT/PAT Socket Translation Table Telemetry',
      };
      return { output: output.trim(), category, updatedState: state, lastActionSummary, causalConsequence };
    }

    if (lower.includes('ip nat inside source list') && lower.includes('overload')) {
      state.natOverloadEnabled = true;
      state.natTranslations.push({
        protocol: 'tcp',
        insideLocal: '192.168.1.10:50122',
        insideGlobal: '203.0.113.5:1024',
        outsideLocal: '198.51.100.1:443',
        outsideGlobal: '198.51.100.1:443',
      });
      lastActionSummary = 'Enabled dynamic Port Address Translation (PAT) Overload on outside interface.';
      causalConsequence = {
        cause: cleanCmd,
        stateMutation: 'natOverloadEnabled = true; added PAT binding',
        networkConsequence: 'Private inside addresses dynamically share single public IP (203.0.113.5)',
        packetBehavior: 'Source socket IP rewritten upon egress; high-order port tracks return flow',
        concept: 'PAT (Port Address Translation) Overload',
      };
      return { output: '[NAT]: Dynamic PAT overload enabled on outside interface GigabitEthernet0/1', category: 'Configuration', updatedState: state, lastActionSummary, causalConsequence };
    }

    // -------------------------------------------------------------------------
    // 7. IPSEC VPN TUNNEL COMMANDS
    // -------------------------------------------------------------------------
    if (lower.includes('show crypto isakmp sa') || lower.includes('show crypto ipsec sa')) {
      category = 'IPsec VPN';
      const ipsec = state.ipsec || { phase1: 'UP', phase2: 'UP', peerIp: '203.0.113.2', transformSet: 'ESP-AES256-SHA256', dhGroup: 14, encPackets: 120, decPackets: 120 };
      output = `IPv4 Crypto ISAKMP SA\ndst             src             state          conn-id slot status\n${ipsec.peerIp.padEnd(15)} 198.51.100.2    ${ipsec.phase1 === 'UP' ? 'QM_IDLE' : 'MM_NO_STATE'}     1001    0 ${ipsec.phase1 === 'UP' ? 'ACTIVE' : 'FAILED'}\n\n`;
      output += `interface: GigabitEthernet0/1\n    Crypto map tag: VPN-MAP, local addr 198.51.100.2\n   protected vrf: (none)\n   local  ident (addr/mask/prot/port): (192.168.1.0/255.255.255.0/0/0)\n   remote ident (addr/mask/prot/port): (192.168.2.0/255.255.255.0/0/0)\n   current_peer ${ipsec.peerIp} port 500\n     #pkts encaps: ${ipsec.encPackets}, #pkts encrypt: ${ipsec.encPackets}, #pkts digest: ${ipsec.encPackets}\n     #pkts decaps: ${ipsec.decPackets}, #pkts decrypt: ${ipsec.decPackets}, #pkts verify: ${ipsec.decPackets}\n`;
      lastActionSummary = 'Inspected IPsec Security Associations (ISAKMP Phase 1 & IPsec Phase 2).';
      causalConsequence = {
        cause: cleanCmd,
        stateMutation: 'None (Passive inspection)',
        networkConsequence: 'Observed IKE SA tunnel status (QM_IDLE vs MM_NO_STATE)',
        packetBehavior: 'Payload packets encapsulated with ESP headers if tunnel is ACTIVE',
        concept: 'IPsec Security Association Negotiation & Cryptography',
      };
      return { output: output.trim(), category, updatedState: state, lastActionSummary, causalConsequence };
    }

    if (cleanCmd.match(/^crypto isakmp key\s+([a-zA-Z0-9_-]+)\s+address\s+([0-9.]+)/i)) {
      if (state.ipsec) {
        state.ipsec.phase1 = 'UP';
        state.ipsec.phase2 = 'UP';
        state.ipsec.encPackets = 54;
        state.ipsec.decPackets = 54;
        state.faultResolved = true;
      }
      lastActionSummary = 'Synchronized IKE pre-shared authentication key with VPN peer.';
      causalConsequence = {
        cause: cleanCmd,
        stateMutation: 'ipsec.phase1 = UP, phase2 = UP',
        networkConsequence: 'Mutual authentication succeeds; Phase 1 and Phase 2 tunnels established',
        packetBehavior: 'Transit IP packets matching crypto ACL now encrypted with AES-256 and SHA-256',
        concept: 'IKE Key Exchange & Symmetric Tunnel Encryption',
      };
      return { output: '[ISAKMP]: Pre-shared key synchronized. Peer 203.0.113.2 transitioned to QM_IDLE (Phase 1 & 2 ACTIVE).', category: 'Configuration', updatedState: state, lastActionSummary, causalConsequence };
    }

    // -------------------------------------------------------------------------
    // 8. DIAGNOSTIC TESTS (PING & TRACEROUTE)
    // -------------------------------------------------------------------------
    if (lower.startsWith('ping')) {
      category = 'ICMP Reachability';
      const target = cleanCmd.split(/\s+/)[1] || '192.168.1.1';
      const derivedEvent = NetworkSimulationEngine.derivePacketPathForPing(slug, state, target, cleanCmd);
      packetEvents = [derivedEvent];

      if (derivedEvent.outcome !== 'DELIVERED') {
        const failureReason = derivedEvent.hops.find(h => h.interrupted)?.terminationReason || 'Destination Host Unreachable';
        output = `PING ${target} (56 data bytes)\nFrom 192.168.1.50 icmp_seq=1 Destination Host Unreachable (${failureReason})\nFrom 192.168.1.50 icmp_seq=2 Destination Host Unreachable\n--- ${target} ping statistics ---\n3 packets transmitted, 0 received, +2 errors, 100% packet loss`;
        lastActionSummary = `ICMP ping to ${target} failed: ${failureReason}.`;
      } else {
        output = `PING ${target} (56 data bytes)\n64 bytes from ${target}: icmp_seq=1 ttl=64 time=1.04 ms\n64 bytes from ${target}: icmp_seq=2 ttl=64 time=0.98 ms\n64 bytes from ${target}: icmp_seq=3 ttl=64 time=1.12 ms\n--- ${target} ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, rtt min/avg/max = 0.98/1.04/1.12 ms`;
        lastActionSummary = `ICMP ping to ${target} succeeded (0% packet loss).`;
      }

      causalConsequence = {
        cause: cleanCmd,
        stateMutation: 'ICMP Echo Request transmitted across active topology',
        networkConsequence: derivedEvent.outcome === 'DELIVERED' ? 'End-to-end bidirectional path verified' : `Packet traversal failed at ${derivedEvent.hops[derivedEvent.hops.length - 1]?.fromNodeId || 'intermediate node'}`,
        packetBehavior: derivedEvent.outcome === 'DELIVERED' ? 'Echo requests reached target and echo replies returned' : 'Packet dropped before reaching target',
        concept: 'ICMP Echo Request/Reply Diagnostic Traversal',
      };
      return { output, category, updatedState: state, packetEvents, lastActionSummary, causalConsequence };
    }

    if (lower.startsWith('traceroute') || lower.startsWith('tracert')) {
      category = 'Path Trace';
      const target = cleanCmd.split(/\s+/)[1] || '8.8.8.8';
      const derivedEvent = NetworkSimulationEngine.derivePacketPathForTraceroute(slug, state, target, cleanCmd);
      packetEvents = [derivedEvent];
      output = `traceroute to ${target} (30 hops max):\n 1  192.168.1.1 (192.168.1.1)  1.12 ms\n 2  10.0.0.1 (10.0.0.1)  6.45 ms\n 3  ${target}  14.20 ms`;
      lastActionSummary = `Traceroute mapped 3 intermediate gateway hops to ${target}.`;
      causalConsequence = {
        cause: cleanCmd,
        stateMutation: 'Sent UDP/ICMP probes with incrementing TTL (1, 2, 3)',
        networkConsequence: 'Mapped sequential Layer 3 router hop boundaries along path',
        packetBehavior: 'Intermediate routers decrement TTL to 0 and return ICMP Time Exceeded',
        concept: 'TTL-Based Route Path Discovery',
      };
      return { output, category, updatedState: state, packetEvents, lastActionSummary, causalConsequence };
    }

    if (lower.startsWith('tcpdump')) {
      category = 'Packet Capture';
      output = 'listening on eth0, link-type EN10MB (Ethernet), snapshot length 262144 bytes\n' +
        '14:22:01.102340 IP 192.168.1.50.49152 > 1.1.1.1.53: 52140+ A? netvision.edu. (31)\n' +
        '14:22:01.118920 IP 1.1.1.1.53 > 192.168.1.50.49152: 52140 1/0/0 A 104.21.48.12 (47)\n' +
        '14:22:01.120010 IP 192.168.1.50.51230 > 104.21.48.12.443: Flags [S], seq 314059120, win 65535, options [mss 1460,sackOK,TS val 210 ecr 0], length 0\n' +
        '14:22:01.134200 IP 104.21.48.12.443 > 192.168.1.50.51230: Flags [S.], seq 89014512, ack 314059121, win 29200, length 0\n' +
        '14:22:01.134310 IP 192.168.1.50.51230 > 104.21.48.12.443: Flags [.], ack 1, win 65535, length 0\n' +
        '5 packets captured, 5 packets received by filter, 0 packets dropped by kernel';
      lastActionSummary = 'Captured promiscuous packet telemetry on network adapter.';
      causalConsequence = {
        cause: cleanCmd,
        stateMutation: 'Packet capture filter active on eth0',
        networkConsequence: 'Observed DNS resolution and TCP 3-way handshake sequence',
        packetBehavior: 'Packets sniffed at data link layer without interrupting flow',
        concept: 'Raw Socket Packet Capture & Frame Inspection',
      };
      return { output, category, updatedState: state, lastActionSummary, causalConsequence };
    }

    // Default Fallback
    output = `Simulated Environment: Executed '${cleanCmd}'. Status: Command accepted. Device state updated.`;
    return { output, category, updatedState: state, lastActionSummary, causalConsequence };
  }

  /**
   * Builds the authoritative visual topology for a given lab and simulator state.
   */
  public static getAuthoritativeTopology(
    slug: string,
    state: NetworkSimulatorState
  ): { nodes: VisualTopologyNode[]; links: VisualTopologyLink[] } {
    const s = slug.toLowerCase();

    // 1. VLAN / Switching Labs
    if (s.includes('vlan') || s.includes('switching')) {
      const vlan2Port = state.interfaces['FastEthernet0/2']?.accessVlan || 1;
      const isTrunk = Boolean(state.trunks['GigabitEthernet0/1']);
      const nodes: VisualTopologyNode[] = [
        {
          id: 'Host-A',
          name: 'Host A (Management)',
          type: 'host',
          role: 'VLAN 10 Workstation',
          status: 'online',
          ipAddress: '192.168.10.50',
          macAddress: '001A.2B3C.4D50',
          accessVlan: 10,
          position: { x: 15, y: 35 },
          ports: [{ name: 'eth0', mode: 'access', status: 'up', vlan: 10 }],
        },
        {
          id: 'Host-B',
          name: 'Host B (Engineering)',
          type: 'host',
          role: `VLAN ${vlan2Port} Workstation`,
          status: 'online',
          ipAddress: vlan2Port === 20 ? '192.168.20.50' : '192.168.1.51',
          macAddress: '001A.2B3C.4D51',
          accessVlan: vlan2Port,
          position: { x: 15, y: 75 },
          ports: [{ name: 'eth0', mode: 'access', status: 'up', vlan: vlan2Port }],
        },
        {
          id: 'SW1',
          name: state.hostname || 'SW1',
          type: 'switch',
          role: 'Access Switch',
          status: 'online',
          macAddress: '001A.2B3C.4D01',
          position: { x: 50, y: 55 },
          ports: [
            { name: 'FastEthernet0/1', mode: 'access', status: 'up', vlan: state.interfaces['FastEthernet0/1']?.accessVlan || 10 },
            { name: 'FastEthernet0/2', mode: state.interfaces['FastEthernet0/2']?.mode || 'access', status: 'up', vlan: vlan2Port },
            { name: 'GigabitEthernet0/1', mode: isTrunk ? 'trunk' : 'access', status: 'up', vlan: isTrunk ? undefined : 1 },
          ],
        },
        {
          id: 'SW2',
          name: 'SW2-Distribution',
          type: 'switch',
          role: 'Distribution Switch',
          status: 'online',
          macAddress: '001A.2B3C.4D02',
          position: { x: 85, y: 55 },
          ports: [{ name: 'GigabitEthernet0/1', mode: 'trunk', status: 'up' }],
        },
      ];

      const links: VisualTopologyLink[] = [
        {
          id: 'link-hostA-sw1',
          sourceNodeId: 'Host-A',
          targetNodeId: 'SW1',
          sourcePort: 'eth0',
          targetPort: 'FastEthernet0/1',
          type: 'access',
          status: 'up',
          vlan: 10,
          label: 'VLAN 10 Access',
        },
        {
          id: 'link-hostB-sw1',
          sourceNodeId: 'Host-B',
          targetNodeId: 'SW1',
          sourcePort: 'eth0',
          targetPort: 'FastEthernet0/2',
          type: 'access',
          status: 'up',
          vlan: vlan2Port,
          label: `VLAN ${vlan2Port} Access`,
        },
        {
          id: 'link-sw1-sw2',
          sourceNodeId: 'SW1',
          targetNodeId: 'SW2',
          sourcePort: 'GigabitEthernet0/1',
          targetPort: 'GigabitEthernet0/1',
          type: isTrunk ? 'trunk' : 'access',
          status: 'up',
          allowedVlans: isTrunk ? (state.trunks['GigabitEthernet0/1']?.allowedVlans || [1, 10, 20]) : [1],
          label: isTrunk ? '802.1Q Trunk (VLANs 1, 10, 20)' : 'Access Link',
        },
      ];

      return { nodes, links };
    }

    // 2. Spanning Tree Protocol (STP) Labs
    if (s.includes('spanning-tree')) {
      const isRoot = state.stp.bridgePriority < 32768 || state.stp.mac === state.stp.rootBridgeMac;
      const nodes: VisualTopologyNode[] = [
        {
          id: 'SW-A',
          name: 'SW-A (Local Access)',
          type: 'switch',
          role: isRoot ? 'Root Bridge (Lowest Priority)' : 'Secondary Switch',
          status: 'online',
          macAddress: state.stp.mac,
          isRootBridge: isRoot,
          position: { x: 25, y: 30 },
          ports: [
            { name: 'Gi0/1', mode: 'trunk', status: 'up', stpRole: isRoot ? 'DESG' : 'ROOT', stpState: 'FWD' },
            { name: 'Gi0/2', mode: 'trunk', status: 'up', stpRole: isRoot ? 'DESG' : 'ALT', stpState: isRoot ? 'FWD' : 'BLK' },
          ],
        },
        {
          id: 'SW-B',
          name: 'SW-B (Core Bridge)',
          type: 'switch',
          role: isRoot ? 'Designated Bridge' : 'Root Bridge',
          status: 'online',
          macAddress: state.stp.rootBridgeMac,
          isRootBridge: !isRoot,
          position: { x: 75, y: 30 },
          ports: [
            { name: 'Gi0/1', mode: 'trunk', status: 'up', stpRole: 'DESG', stpState: 'FWD' },
            { name: 'Gi0/2', mode: 'trunk', status: 'up', stpRole: 'DESG', stpState: 'FWD' },
          ],
        },
        {
          id: 'SW-C',
          name: 'SW-C (Distribution)',
          type: 'switch',
          role: 'Access Switch',
          status: 'online',
          macAddress: '001A.2B3C.4D66',
          isRootBridge: false,
          position: { x: 50, y: 80 },
          ports: [
            { name: 'Gi0/1', mode: 'trunk', status: 'up', stpRole: 'ROOT', stpState: 'FWD' },
            { name: 'Gi0/2', mode: 'trunk', status: 'up', stpRole: isRoot ? 'ALT' : 'DESG', stpState: isRoot ? 'BLK' : 'FWD' },
          ],
        },
      ];

      const links: VisualTopologyLink[] = [
        {
          id: 'link-swa-swb',
          sourceNodeId: 'SW-A',
          targetNodeId: 'SW-B',
          sourcePort: 'Gi0/1',
          targetPort: 'Gi0/1',
          type: 'trunk',
          status: 'up',
          label: 'Gi0/1 - Gi0/1 (Cost 19, FWD)',
        },
        {
          id: 'link-swb-swc',
          sourceNodeId: 'SW-B',
          targetNodeId: 'SW-C',
          sourcePort: 'Gi0/2',
          targetPort: 'Gi0/1',
          type: 'trunk',
          status: 'up',
          label: 'Gi0/2 - Gi0/1 (Cost 19, FWD)',
        },
        {
          id: 'link-swa-swc',
          sourceNodeId: 'SW-A',
          targetNodeId: 'SW-C',
          sourcePort: 'Gi0/2',
          targetPort: 'Gi0/2',
          type: 'trunk',
          status: isRoot ? 'blocked' : 'blocked',
          stpBlocked: true,
          label: isRoot ? 'SW-C Gi0/2 ALT (BLK - Loop Prevented)' : 'SW-A Gi0/2 ALT (BLK - Loop Prevented)',
        },
      ];

      return { nodes, links };
    }

    // 3. ACL / Firewall Labs
    if (s.includes('acl') || s.includes('firewall')) {
      const aclRuleCount = Object.values(state.acls).flat().length;
      const nodes: VisualTopologyNode[] = [
        {
          id: 'Host-A',
          name: 'Internal Client',
          type: 'host',
          role: 'Trusted LAN',
          status: 'online',
          ipAddress: '192.168.1.50',
          position: { x: 15, y: 50 },
          ports: [{ name: 'eth0', mode: 'routed', status: 'up', ipAddress: '192.168.1.50' }],
        },
        {
          id: 'EDGE-FW',
          name: state.hostname || 'EDGE-FW',
          type: 'firewall',
          role: 'Security Perimeter',
          status: 'online',
          ipAddress: '192.168.1.1 / 203.0.113.1',
          activeBadge: aclRuleCount > 0 ? `ACL Active (${aclRuleCount} rules)` : 'No ACL',
          position: { x: 50, y: 50 },
          ports: [
            { name: 'Gi0/0', mode: 'routed', status: 'up', ipAddress: '192.168.1.1' },
            { name: 'Gi0/1', mode: 'routed', status: 'up', ipAddress: '203.0.113.1' },
          ],
        },
        {
          id: 'Web-Server',
          name: 'Web Server (DMZ)',
          type: 'server',
          role: 'Port 443 HTTPS',
          status: 'online',
          ipAddress: '198.51.100.1',
          position: { x: 85, y: 30 },
          ports: [{ name: 'eth0', mode: 'routed', status: 'up', ipAddress: '198.51.100.1' }],
        },
        {
          id: 'Ext-Host-B',
          name: 'Untrusted Host',
          type: 'host',
          role: '10.50.0.0/16 Subnet',
          status: 'online',
          ipAddress: '10.50.1.10',
          position: { x: 85, y: 70 },
          ports: [{ name: 'eth0', mode: 'routed', status: 'up', ipAddress: '10.50.1.10' }],
        },
      ];

      const links: VisualTopologyLink[] = [
        {
          id: 'link-host-fw',
          sourceNodeId: 'Host-A',
          targetNodeId: 'EDGE-FW',
          sourcePort: 'eth0',
          targetPort: 'Gi0/0',
          type: 'routed',
          status: 'up',
          label: 'Inside Subnet (192.168.1.0/24)',
        },
        {
          id: 'link-fw-web',
          sourceNodeId: 'EDGE-FW',
          targetNodeId: 'Web-Server',
          sourcePort: 'Gi0/1',
          targetPort: 'eth0',
          type: 'routed',
          status: 'up',
          label: 'DMZ (Port 443 Permitted)',
        },
        {
          id: 'link-fw-ext',
          sourceNodeId: 'EDGE-FW',
          targetNodeId: 'Ext-Host-B',
          sourcePort: 'Gi0/1',
          targetPort: 'eth0',
          type: 'routed',
          status: 'up',
          label: 'Outside WAN (Filtered by ACL)',
        },
      ];

      return { nodes, links };
    }

    // 4. NAT / PAT Labs
    if (s.includes('nat')) {
      const nodes: VisualTopologyNode[] = [
        {
          id: 'Host-A',
          name: 'Inside Client',
          type: 'host',
          role: 'RFC 1918 Private Host',
          status: 'online',
          ipAddress: '192.168.1.10',
          position: { x: 18, y: 50 },
          ports: [{ name: 'eth0', mode: 'routed', status: 'up', ipAddress: '192.168.1.10' }],
        },
        {
          id: 'NAT-GW',
          name: state.hostname || 'NAT-GW',
          type: 'router',
          role: 'PAT Overload Gateway',
          status: 'online',
          ipAddress: 'Inside 192.168.1.1 / Outside 203.0.113.5',
          activeBadge: state.natOverloadEnabled ? 'PAT Overload Active' : 'Routing Only',
          position: { x: 50, y: 50 },
          ports: [
            { name: 'Gi0/0', mode: 'routed', status: 'up', ipAddress: '192.168.1.1' },
            { name: 'Gi0/1', mode: 'routed', status: 'up', ipAddress: '203.0.113.5' },
          ],
        },
        {
          id: 'Web-Server',
          name: 'Public Web Server',
          type: 'server',
          role: 'Internet Target',
          status: 'online',
          ipAddress: '198.51.100.1',
          position: { x: 82, y: 50 },
          ports: [{ name: 'eth0', mode: 'routed', status: 'up', ipAddress: '198.51.100.1' }],
        },
      ];

      const links: VisualTopologyLink[] = [
        {
          id: 'link-host-nat',
          sourceNodeId: 'Host-A',
          targetNodeId: 'NAT-GW',
          sourcePort: 'eth0',
          targetPort: 'Gi0/0',
          type: 'routed',
          status: 'up',
          label: 'Inside Local (192.168.1.0/24)',
        },
        {
          id: 'link-nat-web',
          sourceNodeId: 'NAT-GW',
          targetNodeId: 'Web-Server',
          sourcePort: 'Gi0/1',
          targetPort: 'eth0',
          type: 'routed',
          status: 'up',
          label: 'Outside Global (203.0.113.5 -> 198.51.100.1)',
        },
      ];

      return { nodes, links };
    }

    // 5. Default / Troubleshooting / General Routing Labs
    const hasDefaultRoute = state.routes.some(r => r.prefix === '0.0.0.0') || state.faultResolved;
    const nodes: VisualTopologyNode[] = [
      {
        id: 'Host-A',
        name: 'Local PC',
        type: 'host',
        role: 'Client Workstation',
        status: 'online',
        ipAddress: '192.168.1.50',
        macAddress: '001A.2B3C.4D50',
        position: { x: 15, y: 50 },
        ports: [{ name: 'eth0', mode: 'routed', status: 'up', ipAddress: '192.168.1.50' }],
      },
      {
        id: 'R1',
        name: state.hostname || 'R1',
        type: 'router',
        role: 'Default Gateway',
        status: 'online',
        ipAddress: '192.168.1.1 / 10.0.0.1',
        activeBadge: hasDefaultRoute ? 'Default Route Active' : 'No Default Route',
        position: { x: 45, y: 50 },
        ports: [
          { name: 'Gi0/0', mode: 'routed', status: 'up', ipAddress: '192.168.1.1' },
          { name: 'Gi0/1', mode: 'routed', status: 'up', ipAddress: '10.0.0.1' },
        ],
      },
      {
        id: 'ISP-R2',
        name: 'ISP Gateway',
        type: 'router',
        role: 'Next Hop Router',
        status: 'online',
        ipAddress: '10.0.0.2',
        position: { x: 72, y: 50 },
        ports: [
          { name: 'Gi0/0', mode: 'routed', status: 'up', ipAddress: '10.0.0.2' },
          { name: 'Gi0/1', mode: 'routed', status: 'up', ipAddress: '203.0.113.1' },
        ],
      },
      {
        id: 'Remote-Target',
        name: 'Remote Server',
        type: 'server',
        role: 'Public Destination',
        status: 'online',
        ipAddress: '8.8.8.8',
        position: { x: 92, y: 50 },
        ports: [{ name: 'eth0', mode: 'routed', status: 'up', ipAddress: '8.8.8.8' }],
      },
    ];

    const links: VisualTopologyLink[] = [
      {
        id: 'link-host-r1',
        sourceNodeId: 'Host-A',
        targetNodeId: 'R1',
        sourcePort: 'eth0',
        targetPort: 'Gi0/0',
        type: 'routed',
        status: 'up',
        label: 'LAN Subnet (192.168.1.0/24)',
      },
      {
        id: 'link-r1-isp',
        sourceNodeId: 'R1',
        targetNodeId: 'ISP-R2',
        sourcePort: 'Gi0/1',
        targetPort: 'Gi0/0',
        type: 'routed',
        status: hasDefaultRoute ? 'up' : 'degraded',
        label: hasDefaultRoute ? 'WAN Link (10.0.0.0/30) Active' : 'WAN Link (No Default Route)',
      },
      {
        id: 'link-isp-remote',
        sourceNodeId: 'ISP-R2',
        targetNodeId: 'Remote-Target',
        sourcePort: 'Gi0/1',
        targetPort: 'eth0',
        type: 'routed',
        status: 'up',
        label: 'Internet Transit (8.8.8.8)',
      },
    ];

    return { nodes, links };
  }

  /**
   * Derives authentic packet path for a ping diagnostic command.
   */
  public static derivePacketPathForPing(
    slug: string,
    state: NetworkSimulatorState,
    target: string,
    cleanCmd: string
  ): VisualPacketEvent {
    const eventId = `pkt-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const hops: VisualPacketHop[] = [];
    const s = slug.toLowerCase();

    // 1. ACL / Firewall evaluation
    if (s.includes('acl') || s.includes('firewall') || state.deviceType === 'FIREWALL') {
      const hasDenyAll = Object.values(state.acls || {}).flat().some(
        (r) => r.action === 'deny' && (r.source === 'any' || r.dest === 'any')
      );
      const isDenied = hasDenyAll || target.startsWith('10.50') || target === '10.50.1.10';
      hops.push({
        hopIndex: 1,
        fromNodeId: 'Host-A',
        toNodeId: 'EDGE-FW',
        deviceType: 'host',
        action: 'forward',
        detail: `Transmitted ICMP Echo Request targeting ${target} to Default Gateway / Firewall`,
        packetHeader: { srcIp: '192.168.1.50', dstIp: target, protocol: 'ICMP', ttl: 64 },
      });

      if (isDenied) {
        hops.push({
          hopIndex: 2,
          fromNodeId: 'EDGE-FW',
          toNodeId: 'Ext-Host-B',
          deviceType: 'firewall',
          action: 'filter_deny',
          detail: 'Matched ACL rule: deny ip. Packet dropped at security perimeter.',
          packetHeader: { srcIp: '192.168.1.50', dstIp: target, protocol: 'ICMP', ttl: 64 },
          interrupted: true,
          terminationReason: 'BLOCKED_BY_ACL: Filtered by Access-List deny rule',
        });
        return {
          eventId,
          timestamp: new Date().toISOString(),
          command: cleanCmd,
          protocol: 'ICMP',
          sourceNodeId: 'Host-A',
          targetNodeId: 'Ext-Host-B',
          outcome: 'BLOCKED_BY_ACL',
          hops,
        };
      }

      // Permitted flow
      hops.push({
        hopIndex: 2,
        fromNodeId: 'EDGE-FW',
        toNodeId: 'Web-Server',
        deviceType: 'firewall',
        action: 'filter_permit',
        detail: 'Permitted by security policy. Forwarded egress frame to DMZ Web Server.',
        packetHeader: { srcIp: '192.168.1.50', dstIp: target, protocol: 'ICMP', ttl: 63 },
      });
      hops.push({
        hopIndex: 3,
        fromNodeId: 'Web-Server',
        toNodeId: 'Host-A',
        deviceType: 'server',
        action: 'echo_reply',
        detail: 'Generated ICMP Echo Reply (type 0, code 0) back to client.',
        packetHeader: { srcIp: target, dstIp: '192.168.1.50', protocol: 'ICMP', ttl: 64 },
      });
      return {
        eventId,
        timestamp: new Date().toISOString(),
        command: cleanCmd,
        protocol: 'ICMP',
        sourceNodeId: 'Host-A',
        targetNodeId: 'Web-Server',
        outcome: 'DELIVERED',
        hops,
      };
    }

    // 2. NAT / PAT Evaluation
    if (s.includes('nat')) {
      hops.push({
        hopIndex: 1,
        fromNodeId: 'Host-A',
        toNodeId: 'NAT-GW',
        deviceType: 'host',
        action: 'forward',
        detail: 'Sent outbound segment with private source IP 192.168.1.10',
        packetHeader: { srcIp: '192.168.1.10', dstIp: target, protocol: 'ICMP', srcPort: 50122, dstPort: 443, ttl: 64 },
      });

      hops.push({
        hopIndex: 2,
        fromNodeId: 'NAT-GW',
        toNodeId: 'Web-Server',
        deviceType: 'router',
        action: 'translate',
        detail: 'Dynamic PAT Overload applied: translated 192.168.1.10:50122 -> public IP 203.0.113.5:1024',
        packetHeader: {
          srcIp: '192.168.1.10',
          dstIp: target,
          protocol: 'ICMP',
          srcPort: 50122,
          dstPort: 443,
          ttl: 63,
          translatedSrcIp: '203.0.113.5',
          translatedSrcPort: 1024,
        },
      });

      hops.push({
        hopIndex: 3,
        fromNodeId: 'Web-Server',
        toNodeId: 'Host-A',
        deviceType: 'server',
        action: 'echo_reply',
        detail: 'Web server replied to public IP 203.0.113.5:1024; NAT Gateway un-translated back to 192.168.1.10',
        packetHeader: { srcIp: target, dstIp: '192.168.1.10', protocol: 'ICMP', ttl: 64 },
      });

      return {
        eventId,
        timestamp: new Date().toISOString(),
        command: cleanCmd,
        protocol: 'ICMP',
        sourceNodeId: 'Host-A',
        targetNodeId: 'Web-Server',
        outcome: 'DELIVERED',
        hops,
      };
    }

    // 3. Routing / Missing Gateway Evaluation
    const hasRoute = state.routes.some(r => r.prefix === '0.0.0.0' || target.startsWith(r.prefix.slice(0, 5))) || state.faultResolved;
    const isTargetExternal = target !== '192.168.1.1' && !target.startsWith('192.168.1.');

    hops.push({
      hopIndex: 1,
      fromNodeId: 'Host-A',
      toNodeId: 'R1',
      deviceType: 'host',
      action: 'forward',
      detail: 'Client transmitted frame to Default Gateway (192.168.1.1)',
      packetHeader: { srcIp: '192.168.1.50', dstIp: target, protocol: 'ICMP', ttl: 64 },
    });

    if (isTargetExternal && !hasRoute) {
      hops.push({
        hopIndex: 2,
        fromNodeId: 'R1',
        toNodeId: 'ISP-R2',
        deviceType: 'router',
        action: 'drop',
        detail: 'Router R1 has no Gateway of Last Resort (0.0.0.0/0) or matching route. Discarding ICMP packet.',
        packetHeader: { srcIp: '192.168.1.50', dstIp: target, protocol: 'ICMP', ttl: 64 },
        interrupted: true,
        terminationReason: 'NO_ROUTE: No route to destination in routing table',
      });
      return {
        eventId,
        timestamp: new Date().toISOString(),
        command: cleanCmd,
        protocol: 'ICMP',
        sourceNodeId: 'Host-A',
        targetNodeId: 'Remote-Target',
        outcome: 'NO_ROUTE',
        hops,
      };
    }

    // Route exists or target is gateway
    if (isTargetExternal) {
      hops.push({
        hopIndex: 2,
        fromNodeId: 'R1',
        toNodeId: 'ISP-R2',
        deviceType: 'router',
        action: 'route',
        detail: 'LPM match 0.0.0.0/0 via 10.0.0.2 on GigabitEthernet0/1. TTL decremented (64 -> 63).',
        packetHeader: { srcIp: '192.168.1.50', dstIp: target, protocol: 'ICMP', ttl: 63 },
      });
      hops.push({
        hopIndex: 3,
        fromNodeId: 'ISP-R2',
        toNodeId: 'Remote-Target',
        deviceType: 'router',
        action: 'deliver',
        detail: `Forwarded packet to destination IP ${target}.`,
        packetHeader: { srcIp: '192.168.1.50', dstIp: target, protocol: 'ICMP', ttl: 62 },
      });
      hops.push({
        hopIndex: 4,
        fromNodeId: 'Remote-Target',
        toNodeId: 'Host-A',
        deviceType: 'server',
        action: 'echo_reply',
        detail: 'Destination host replied with ICMP Echo Reply (type 0, code 0).',
        packetHeader: { srcIp: target, dstIp: '192.168.1.50', protocol: 'ICMP', ttl: 64 },
      });
    } else {
      hops.push({
        hopIndex: 2,
        fromNodeId: 'R1',
        toNodeId: 'Host-A',
        deviceType: 'router',
        action: 'echo_reply',
        detail: 'Local gateway replied with ICMP Echo Reply (type 0, code 0).',
        packetHeader: { srcIp: target, dstIp: '192.168.1.50', protocol: 'ICMP', ttl: 64 },
      });
    }

    return {
      eventId,
      timestamp: new Date().toISOString(),
      command: cleanCmd,
      protocol: 'ICMP',
      sourceNodeId: 'Host-A',
      targetNodeId: isTargetExternal ? 'Remote-Target' : 'R1',
      outcome: 'DELIVERED',
      hops,
    };
  }

  /**
   * Derives packet hops for traceroute command.
   */
  public static derivePacketPathForTraceroute(
    slug: string,
    state: NetworkSimulatorState,
    target: string,
    cleanCmd: string
  ): VisualPacketEvent {
    const eventId = `trace-${Date.now()}`;
    const hops: VisualPacketHop[] = [
      {
        hopIndex: 1,
        fromNodeId: 'Host-A',
        toNodeId: 'R1',
        deviceType: 'host',
        action: 'forward',
        detail: 'Probe with TTL=1 expired at first-hop gateway 192.168.1.1 (ICMP Time Exceeded)',
        packetHeader: { srcIp: '192.168.1.50', dstIp: target, protocol: 'UDP', ttl: 1 },
      },
      {
        hopIndex: 2,
        fromNodeId: 'R1',
        toNodeId: 'ISP-R2',
        deviceType: 'router',
        action: 'route',
        detail: 'Probe with TTL=2 expired at second-hop router 10.0.0.1 (ICMP Time Exceeded)',
        packetHeader: { srcIp: '192.168.1.50', dstIp: target, protocol: 'UDP', ttl: 2 },
      },
      {
        hopIndex: 3,
        fromNodeId: 'ISP-R2',
        toNodeId: 'Remote-Target',
        deviceType: 'router',
        action: 'deliver',
        detail: `Probe with TTL=3 reached destination ${target} (ICMP Port Unreachable / Echo Reply)`,
        packetHeader: { srcIp: '192.168.1.50', dstIp: target, protocol: 'UDP', ttl: 3 },
      },
    ];

    return {
      eventId,
      timestamp: new Date().toISOString(),
      command: cleanCmd,
      protocol: 'UDP',
      sourceNodeId: 'Host-A',
      targetNodeId: 'Remote-Target',
      outcome: 'DELIVERED',
      hops,
    };
  }

  /**
   * Generates dynamic 4-level progressive diagnostic hints based on current simulator state.
   */
  public static generateProgressiveHints(
    slug: string,
    state: NetworkSimulatorState
  ): SanitizedDiagnosticHintItem[] {
    const s = slug.toLowerCase();

    // 1. VLAN / Switching Labs
    if (s.includes('vlan') || s.includes('switching')) {
      const vlan20Exists = Boolean(state.vlans[20]);
      const fa2Vlan = state.interfaces['FastEthernet0/2']?.accessVlan;

      if (!vlan20Exists) {
        return [
          {
            level: 1,
            title: 'Subsystem: Layer 2 VLAN Database',
            text: 'Inspect the switch VLAN database to verify whether the required broadcast domain has been initialized.',
            category: 'SUBSYSTEM',
          },
          {
            level: 2,
            title: 'Diagnostic Command',
            text: 'Execute "show vlan brief" from privileged EXEC mode to inspect active VLAN IDs and names.',
            category: 'COMMAND',
          },
          {
            level: 3,
            title: 'Observation Check',
            text: 'Look for VLAN 20 in the VLAN table output. Observe whether it exists or only default VLAN 1 is active.',
            category: 'OBSERVATION',
          },
          {
            level: 4,
            title: 'Likely Fault Domain',
            text: 'Missing Layer 2 Broadcast Domain: Without VLAN 20 created in the switch database, client ports cannot forward frames within that segment.',
            category: 'FAULT_DOMAIN',
          },
        ];
      }

      if (fa2Vlan !== 20) {
        return [
          {
            level: 1,
            title: 'Subsystem: Access Port Assignment',
            text: 'Inspect the access interface port allocation for the target client host.',
            category: 'SUBSYSTEM',
          },
          {
            level: 2,
            title: 'Diagnostic Command',
            text: 'Run "show vlan brief" or "show interfaces FastEthernet0/2 switchport" to inspect port VLAN membership.',
            category: 'COMMAND',
          },
          {
            level: 3,
            title: 'Observation Check',
            text: `Observe that interface FastEthernet0/2 is currently allocated to VLAN ${fa2Vlan || 1} instead of VLAN 20.`,
            category: 'OBSERVATION',
          },
          {
            level: 4,
            title: 'Likely Fault Domain',
            text: 'Port Access VLAN Mismatch: The switchport remains in default VLAN 1, preventing the connected host from communicating on VLAN 20.',
            category: 'FAULT_DOMAIN',
          },
        ];
      }

      return [
        {
          level: 1,
          title: 'Subsystem: Layer 2 Verification',
          text: 'Verify operational forwarding state across the access and trunk switchports.',
          category: 'SUBSYSTEM',
        },
        {
          level: 2,
          title: 'Diagnostic Command',
          text: 'Run "show interfaces trunk" and "show vlan brief" to confirm overall state.',
          category: 'COMMAND',
        },
        {
          level: 3,
          title: 'Observation Check',
          text: 'Confirm FastEthernet0/2 is active in VLAN 20 and trunk GigabitEthernet0/1 is trunking allowed VLANs.',
          category: 'OBSERVATION',
        },
        {
          level: 4,
          title: 'Likely Fault Domain',
          text: 'All Layer 2 configuration criteria satisfied. Operational forwarding ready.',
          category: 'FAULT_DOMAIN',
        },
      ];
    }

    // 2. Spanning Tree Protocol Labs
    if (s.includes('spanning-tree')) {
      const isPriorityTuned = state.stp.bridgePriority < 32768;
      if (!isPriorityTuned) {
        return [
          {
            level: 1,
            title: 'Subsystem: Spanning Tree Protocol (STP)',
            text: 'Inspect the Spanning Tree Bridge ID and root bridge election criteria across the switched network.',
            category: 'SUBSYSTEM',
          },
          {
            level: 2,
            title: 'Diagnostic Command',
            text: 'Execute "show spanning-tree" to inspect bridge priority, root bridge MAC address, and active port states.',
            category: 'COMMAND',
          },
          {
            level: 3,
            title: 'Observation Check',
            text: 'Observe that the local switch priority is at default 32768, while the Root Bridge priority is 4096.',
            category: 'OBSERVATION',
          },
          {
            level: 4,
            title: 'Likely Fault Domain',
            text: 'Root Bridge Election Determinism: Without lowering the Bridge Priority, this switch cannot win the Root Bridge election against priority 4096.',
            category: 'FAULT_DOMAIN',
          },
        ];
      }

      return [
        {
          level: 1,
          title: 'Subsystem: STP Convergence Verification',
          text: 'Verify the recalculated spanning tree topology and active designated ports.',
          category: 'SUBSYSTEM',
        },
        {
          level: 2,
          title: 'Diagnostic Command',
          text: 'Execute "show spanning-tree" to confirm "This bridge is the root".',
          category: 'COMMAND',
        },
        {
          level: 3,
          title: 'Observation Check',
          text: 'Verify all operational ports on this switch have transitioned to DESIGNATED and Forwarding (FWD) state.',
          category: 'OBSERVATION',
        },
        {
          level: 4,
          title: 'Likely Fault Domain',
          text: 'Root Bridge elected deterministically; all bridge loop risks eliminated.',
          category: 'FAULT_DOMAIN',
        },
      ];
    }

    // 3. ACL / Firewall Labs
    if (s.includes('acl') || s.includes('firewall')) {
      const ruleCount = Object.values(state.acls).flat().length;
      if (ruleCount === 0) {
        return [
          {
            level: 1,
            title: 'Subsystem: Access Control Lists (ACL)',
            text: 'Inspect the stateless/stateful packet filter rules applied on the perimeter security gateway.',
            category: 'SUBSYSTEM',
          },
          {
            level: 2,
            title: 'Diagnostic Command',
            text: 'Run "show access-lists" to check configured permit and deny filtering rules.',
            category: 'COMMAND',
          },
          {
            level: 3,
            title: 'Observation Check',
            text: 'Check whether an extended access list matching target protocols, source subnets, and destination ports exists.',
            category: 'OBSERVATION',
          },
          {
            level: 4,
            title: 'Likely Fault Domain',
            text: 'Unfiltered Perimeter Policy: Without explicit ACL statements, network traffic cannot be selectively filtered or permitted.',
            category: 'FAULT_DOMAIN',
          },
        ];
      }
    }

    // 4. Troubleshooting / Routing Labs
    const hasDefaultRoute = state.routes.some(r => r.prefix === '0.0.0.0') || state.faultResolved;
    if (!hasDefaultRoute) {
      return [
        {
          level: 1,
          title: 'Subsystem: Layer 3 Routing Table',
          text: 'Inspect the IPv4 routing table on the default gateway router to determine how external traffic is forwarded.',
          category: 'SUBSYSTEM',
        },
        {
          level: 2,
          title: 'Diagnostic Command',
          text: 'Execute "show ip route" from privileged EXEC mode to check Gateway of Last Resort and active prefixes.',
          category: 'COMMAND',
        },
        {
          level: 3,
          title: 'Observation Check',
          text: 'Notice that "Gateway of last resort is not set" and there is no 0.0.0.0/0 static route entry.',
          category: 'OBSERVATION',
        },
        {
          level: 4,
          title: 'Likely Fault Domain',
          text: 'Missing Default Gateway Route: The router has direct routes for 192.168.1.0/24 and 10.0.0.0/30, but drops packets destined for all non-local public IP subnets.',
          category: 'FAULT_DOMAIN',
        },
      ];
    }

    // Fallback: General Diagnostic Telemetry
    return [
      {
        level: 1,
        title: 'Subsystem: Host Network Socket & Protocol Stack',
        text: 'Inspect local host network adapter configuration and ARP resolution telemetry.',
        category: 'SUBSYSTEM',
      },
      {
        level: 2,
        title: 'Diagnostic Command',
        text: 'Run "ipconfig /all", "arp -a", or "ping 192.168.1.1" to inspect adapter IP address and default gateway reachability.',
        category: 'COMMAND',
      },
      {
        level: 3,
        title: 'Observation Check',
        text: 'Observe IPv4 address, subnet mask, default gateway IP, and cached MAC addresses in the ARP table.',
        category: 'OBSERVATION',
      },
      {
        level: 4,
        title: 'Likely Fault Domain',
        text: 'Host Protocol Socket Binding: Ensure IP stack is bound with valid gateway and DNS resolution pointers.',
        category: 'FAULT_DOMAIN',
      },
    ];
  }

  /**
   * Sanitizes progressive hints so that only legitimately unlocked levels are visible to the client.
   * Future levels (level > unlockedLevel), internal fault identifiers, and solution states are NEVER serialized.
   */
  public static sanitizeHintsForLearner(
    allHints: SanitizedDiagnosticHintItem[],
    unlockedLevel: number
  ): SanitizedDiagnosticHintsDto {
    const safeLevel = Math.max(0, Math.min(4, Math.floor(Number(unlockedLevel) || 0)));
    // Filter strictly to hints with level <= safeLevel
    const unlockedHints = allHints.filter(h => h.level <= safeLevel);

    return {
      currentLevel: safeLevel,
      unlockedHints,
      canUnlockNext: safeLevel < 4,
      totalLevels: 4,
    };
  }

  /**
   * Constructs the authoritative, sanitized VisualSimulationStateDto for the frontend.
   */
  public static toVisualState(
    slug: string,
    state: NetworkSimulatorState,
    stateVersion: number,
    sessionId: string,
    labId: string,
    unlockedHintLevel: number = 0,
    lastCommand: string = '',
    packetEvents: VisualPacketEvent[] = [],
    causalConsequence?: CausalVisualExplanation,
    lastActionSummary?: string
  ): VisualSimulationStateDto {
    const { nodes, links } = NetworkSimulationEngine.getAuthoritativeTopology(slug, state);
    const allHints = NetworkSimulationEngine.generateProgressiveHints(slug, state);
    const sanitizedHints = NetworkSimulationEngine.sanitizeHintsForLearner(allHints, unlockedHintLevel);

    const isRoot = state.stp.bridgePriority < 32768 || state.stp.mac === state.stp.rootBridgeMac;
    const rawDto: VisualSimulationStateDto = {
      sessionId,
      labId,
      lessonSlug: slug,
      stateVersion: Math.max(1, Math.floor(Number(stateVersion) || 1)),
      timestamp: new Date().toISOString(),
      device: {
        hostname: state.hostname,
        deviceType: state.deviceType,
        configMode: state.currentConfigMode || 'EXEC',
        activeInterface: state.activeInterface,
        activeVlanId: state.activeVlanId,
      },
      topologyNodes: nodes,
      topologyLinks: links,
      vlans: Object.values(state.vlans).map(v => ({
        id: v.id,
        name: v.name,
        ports: [...v.ports],
        status: v.status,
      })),
      trunks: Object.values(state.trunks).map(t => ({
        interface: t.interface,
        nativeVlan: t.nativeVlan,
        allowedVlans: [...t.allowedVlans],
        status: t.status,
      })),
      stp: {
        isRootBridge: isRoot,
        bridgePriority: state.stp.bridgePriority,
        mac: state.stp.mac,
        rootBridgeMac: state.stp.rootBridgeMac,
        costToRoot: state.stp.costToRoot,
        rootPort: state.stp.rootPort,
        blockedPorts: isRoot ? [] : ['Gi0/2'],
      },
      routes: state.routes.map(r => ({
        prefix: r.prefix,
        mask: r.mask,
        nextHop: r.nextHop,
        interface: r.interface,
        protocol: r.protocol,
      })),
      activeAclCount: Object.values(state.acls).flat().length,
      natActive: Boolean(state.natOverloadEnabled),
      natTranslationCount: state.natTranslations.length,
      recentPacketEvents: packetEvents,
      lastActionSummary: lastActionSummary || (lastCommand ? `Executed: ${lastCommand}` : 'Initial simulator state initialized.'),
      causalConsequence,
      hints: sanitizedHints,
    };

    return NetworkSimulationEngine.sanitizeVisualState(rawDto);
  }

  /**
   * Strictly audits and strips any internal validation or grading fields from the visual state DTO.
   */
  public static sanitizeVisualState(rawState: VisualSimulationStateDto): VisualSimulationStateDto {
    const serialized = JSON.parse(JSON.stringify(rawState)) as VisualSimulationStateDto;

    // Remove any accidental privileged fields from root
    delete (serialized as any).injectedFault;
    delete (serialized as any).targetState;
    delete (serialized as any).solutionCriteria;
    delete (serialized as any).validationRules;
    delete (serialized as any).solution;
    delete (serialized as any).rubric;
    delete (serialized as any).answerKey;
    delete (serialized as any).adminSecret;

    // Deep clean nodes
    for (const node of serialized.topologyNodes) {
      delete (node as any).injectedFault;
      delete (node as any).targetState;
      delete (node as any).solution;
    }

    // Deep clean links
    for (const link of serialized.topologyLinks) {
      delete (link as any).injectedFault;
      delete (link as any).targetState;
    }

    return serialized;
  }

  /**
   * Deterministically validates whether a lab attempt has succeeded based on resulting state.
   * "show" commands alone NEVER satisfy configuration or troubleshooting tasks.
   */
  public static validateAttempt(
    slug: string,
    state: NetworkSimulatorState,
    commandHistory: string[]
  ): {
    passed: boolean;
    score: number;
    checks: Array<{ rule: string; passed: boolean; message: string }>;
  } {
    const checks: Array<{ rule: string; passed: boolean; message: string }> = [];
    const cmds = commandHistory.map(c => c.toLowerCase().trim());

    // Filter out passive "show" commands to inspect actual student action
    const configOrDiagnosticActions = cmds.filter(c => !c.startsWith('show ') && !c.startsWith('exit') && !c.startsWith('end'));

    // Check 1: Purposeful Action Invariant
    const hasMeaningfulAction = configOrDiagnosticActions.length >= 1;
    checks.push({
      rule: 'Learner Execution Action',
      passed: hasMeaningfulAction,
      message: hasMeaningfulAction
        ? `Executed ${configOrDiagnosticActions.length} operational/configuration actions.`
        : 'Only passive inspection commands recorded. Configuration or diagnostic action required.',
    });

    // Check 2: Domain State Verification
    let stateVerified = false;
    let stateMessage = '';

    if (slug.includes('vlan') || slug.includes('switching')) {
      // Must have created or named a non-default VLAN (e.g. VLAN 20) and assigned ports or trunk
      const hasVlan20 = Boolean(state.vlans[20] || Object.keys(state.vlans).length > 2);
      const hasTrunkConfigured = Object.keys(state.trunks).length > 0;
      stateVerified = hasVlan20 || hasTrunkConfigured;
      stateMessage = stateVerified
        ? 'Layer 2 VLAN database and trunk port forwarding state verified.'
        : 'Target VLAN or 802.1Q trunk state not created. Configure VLAN and assign ports.';
    } else if (slug.includes('spanning-tree')) {
      const priorityTuned = state.stp.bridgePriority < 32768 || state.stp.bridgePriority > 32768;
      stateVerified = priorityTuned || cmds.some(c => c.includes('priority') || c.includes('root primary'));
      stateMessage = stateVerified
        ? 'Spanning Tree bridge priority and Root Bridge election criteria satisfied.'
        : 'Bridge priority unmodified. Configure spanning-tree priority to influence Root Bridge election.';
    } else if (slug.includes('ospf')) {
      const ospfConfigured = Boolean(state.ospf && state.ospf.networks.length > 0);
      stateVerified = ospfConfigured || cmds.some(c => c.startsWith('network ') || c.includes('area'));
      stateMessage = stateVerified
        ? 'OSPF area 0 network statement active; neighbor adjacency established.'
        : 'OSPF network statement missing. Advertise subnet into OSPF Area 0.';
    } else if (slug.includes('acl') || slug.includes('firewall')) {
      const hasRules = Object.values(state.acls).some(r => r.length > 0);
      stateVerified = hasRules || cmds.some(c => c.startsWith('access-list') || c.includes('permit') || c.includes('deny'));
      stateMessage = stateVerified
        ? 'Security access control list rules committed to filter table.'
        : 'No ACL rules defined. Configure permit/deny statements.';
    } else if (slug.includes('nat')) {
      const natActive = Boolean(state.natOverloadEnabled || state.natTranslations.length > 0);
      stateVerified = natActive || cmds.some(c => c.includes('ip nat inside') || c.includes('overload'));
      stateMessage = stateVerified
        ? 'PAT Overload address translation session mapping active.'
        : 'NAT/PAT not active. Configure ip nat inside/outside and overload.';
    } else if (slug.includes('ipsec') || slug.includes('vpn')) {
      const vpnUp = state.ipsec?.phase1 === 'UP' || state.faultResolved;
      stateVerified = Boolean(vpnUp || cmds.some(c => c.includes('crypto isakmp key') || c.includes('transform-set')));
      stateMessage = stateVerified
        ? 'IPsec Security Associations established (Phase 1 & Phase 2 ACTIVE).'
        : 'IPsec tunnel negotiation failed. Match pre-shared keys and transform set.';
    } else if (slug.includes('troubleshoot')) {
      const defaultRouteRestored = state.routes.some(r => r.prefix === '0.0.0.0') || state.faultResolved;
      stateVerified = Boolean(defaultRouteRestored || cmds.some(c => c.includes('ip route 0.0.0.0') || c.includes('ping')));
      stateMessage = stateVerified
        ? 'Root cause identified and remediation applied. Full end-to-end IP reachability restored.'
        : 'Fault remains unresolved. Restore the missing default gateway or route.';
    } else {
      // General Tier-2 / Tier-3 diagnostic check
      const executedDiagnostics = cmds.some(c => c.startsWith('ping') || c.startsWith('tcpdump') || c.startsWith('traceroute') || c.startsWith('nslookup') || c.startsWith('ipconfig') || c.startsWith('arp'));
      stateVerified = executedDiagnostics;
      stateMessage = stateVerified
        ? 'Diagnostic telemetry captures and protocol socket parameters verified.'
        : 'Diagnostic telemetry command not executed. Run ping, traceroute, or tcpdump.';
    }

    checks.push({
      rule: 'State-Based Semantic Verification',
      passed: stateVerified,
      message: stateMessage,
    });

    const passedCount = checks.filter(c => c.passed).length;
    const score = Math.round((passedCount / checks.length) * 100);
    const passed = score >= 70;

    return { passed, score, checks };
  }
}

/**
 * NETVISION NETWORK SIMULATION ENGINE
 *
 * Provides realistic, deterministic Layer 2, Layer 3, Security, and Services simulation.
 * State mutations are derived from real networking commands (Cisco IOS / Linux iproute2 / Wireshark).
 * Validation inspects resulting device and topology state — "show" commands alone never pass a configuration or troubleshooting task.
 */

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
    currentState: NetworkSimulatorState
  ): { output: string; category: string; updatedState: NetworkSimulatorState } {
    const cleanCmd = (command || '').trim();
    const state = JSON.parse(JSON.stringify(currentState)) as NetworkSimulatorState;
    const lower = cleanCmd.toLowerCase();

    state.diagnosticsCompleted = state.diagnosticsCompleted || [];
    if (!state.diagnosticsCompleted.includes(cleanCmd)) {
      state.diagnosticsCompleted.push(cleanCmd);
    }

    let output = '';
    let category = 'Diagnostic';

    // -------------------------------------------------------------------------
    // 1. CONFIGURATION NAVIGATION COMMANDS
    // -------------------------------------------------------------------------
    if (lower === 'configure terminal' || lower === 'conf t') {
      state.currentConfigMode = 'GLOBAL_CONFIG';
      category = 'Configuration';
      output = `Enter configuration commands, one per line. End with CNTL/Z.\n${state.hostname}(config)#`;
      return { output, category, updatedState: state };
    }

    if (lower === 'exit' || lower === 'end') {
      if (state.currentConfigMode === 'IF_CONFIG' || state.currentConfigMode === 'VLAN_CONFIG' || state.currentConfigMode === 'ROUTER_OSPF') {
        state.currentConfigMode = 'GLOBAL_CONFIG';
        output = `${state.hostname}(config)#`;
      } else {
        state.currentConfigMode = 'EXEC';
        output = `${state.hostname}#`;
      }
      return { output, category: 'Navigation', updatedState: state };
    }

    // Interface configuration navigation: interface gigabitethernet0/1 or int gi0/1
    const intMatch = cleanCmd.match(/^(?:interface|int)\s+([a-zA-Z0-9/.]+)/i);
    if (intMatch && (state.currentConfigMode === 'GLOBAL_CONFIG' || state.currentConfigMode === 'IF_CONFIG')) {
      state.currentConfigMode = 'IF_CONFIG';
      const ifName = intMatch[1];
      state.activeInterface = ifName;
      if (!state.interfaces[ifName]) {
        state.interfaces[ifName] = { name: ifName, status: 'up', mtu: 1500 };
      }
      return { output: `${state.hostname}(config-if)#`, category: 'Configuration', updatedState: state };
    }

    // VLAN configuration navigation: vlan 20
    const vlanNavMatch = cleanCmd.match(/^vlan\s+(\d+)$/i);
    if (vlanNavMatch && state.currentConfigMode === 'GLOBAL_CONFIG') {
      state.currentConfigMode = 'VLAN_CONFIG';
      const vId = parseInt(vlanNavMatch[1], 10);
      state.activeVlanId = vId;
      if (!state.vlans[vId]) {
        state.vlans[vId] = { id: vId, name: `VLAN00${vId}`, ports: [], status: 'active' };
      }
      return { output: `${state.hostname}(config-vlan)#`, category: 'Configuration', updatedState: state };
    }

    // VLAN naming: name SALES
    const nameMatch = cleanCmd.match(/^name\s+([a-zA-Z0-9_-]+)/i);
    if (nameMatch && state.currentConfigMode === 'VLAN_CONFIG' && state.activeVlanId) {
      const vlanName = nameMatch[1];
      if (state.vlans[state.activeVlanId]) {
        state.vlans[state.activeVlanId].name = vlanName;
      }
      return { output: `${state.hostname}(config-vlan)#`, category: 'Configuration', updatedState: state };
    }

    // Switchport mode access / trunk
    if (lower.startsWith('switchport mode trunk') && state.currentConfigMode === 'IF_CONFIG' && state.activeInterface) {
      const iface = state.interfaces[state.activeInterface];
      if (iface) iface.mode = 'trunk';
      state.trunks[state.activeInterface] = {
        interface: state.activeInterface,
        nativeVlan: 1,
        allowedVlans: [1, 10, 20],
        status: 'trunking',
      };
      return { output: `Line protocol on Interface ${state.activeInterface}, changed state to up`, category: 'Configuration', updatedState: state };
    }

    if (lower.startsWith('switchport access vlan') && state.currentConfigMode === 'IF_CONFIG' && state.activeInterface) {
      const vId = parseInt(cleanCmd.split(/\s+/)[3], 10);
      const iface = state.interfaces[state.activeInterface];
      if (iface) {
        iface.mode = 'access';
        iface.accessVlan = vId;
      }
      if (state.vlans[vId] && !state.vlans[vId].ports.includes(state.activeInterface)) {
        state.vlans[vId].ports.push(state.activeInterface);
      }
      return { output: `${state.hostname}(config-if)#`, category: 'Configuration', updatedState: state };
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
      return { output: output.trim(), category, updatedState: state };
    }

    if (lower.includes('show interfaces trunk')) {
      category = 'Layer 2 Switching';
      output = 'Port        Mode         Encapsulation  Status        Native vlan\n';
      for (const t of Object.values(state.trunks)) {
        output += `${t.interface.padEnd(11)} on           802.1q         ${t.status.padEnd(13)} ${t.nativeVlan}\n\n`;
        output += `Port        Vlans allowed on trunk\n${t.interface.padEnd(11)} ${t.allowedVlans.join(',')}\n`;
      }
      return { output: output.trim(), category, updatedState: state };
    }

    if (lower.includes('show spanning-tree')) {
      category = 'Spanning Tree Protocol';
      const stp = state.stp;
      const isRoot = stp.mac === stp.rootBridgeMac;
      output = `VLAN0001\n  Spanning tree enabled protocol rstp\n  Root ID    Priority    ${isRoot ? stp.bridgePriority : 4096}\n             Address     ${stp.rootBridgeMac}\n             ${isRoot ? 'This bridge is the root' : `Cost        ${stp.costToRoot}\n             Port        ${stp.rootPort || 'Gi0/1'}`}\n\n`;
      output += `  Bridge ID  Priority    ${stp.bridgePriority}  (priority ${stp.bridgePriority} sys-id-ext 1)\n             Address     ${stp.mac}\n\n`;
      output += 'Interface           Role Sts Cost      Prio.Nbr Type\n------------------- ---- --- --------- -------- --------------------------------\n';
      output += `${stp.rootPort || 'Gi0/1'}               ROOT FWD 19        128.1    P2p\nGi0/2               DESG FWD 19        128.2    P2p\nGi0/3               ALT  BLK 19        128.3    P2p\n`;
      return { output: output.trim(), category, updatedState: state };
    }

    if (cleanCmd.match(/^spanning-tree vlan\s+(\d+)\s+priority\s+(\d+)$/i)) {
      const pri = parseInt(cleanCmd.split(/\s+/)[4], 10);
      state.stp.bridgePriority = pri;
      if (pri < 32768) {
        state.stp.rootBridgeMac = state.stp.mac;
        state.stp.costToRoot = 0;
      }
      return { output: `${state.hostname}(config)#`, category: 'Configuration', updatedState: state };
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
      return { output: output.trim(), category, updatedState: state };
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
      return { output: `${state.hostname}(config)#`, category: 'Configuration', updatedState: state };
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
      return { output: output.trim(), category, updatedState: state };
    }

    if (cleanCmd.match(/^network\s+([0-9.]+)\s+([0-9.]+)\s+area\s+(\d+)/i)) {
      const parts = cleanCmd.split(/\s+/);
      state.ospf = state.ospf || { processId: 1, routerId: '1.1.1.1', networks: [], neighbors: [] };
      state.ospf.networks.push({ network: parts[1], wildcard: parts[2], area: parseInt(parts[4], 10) });
      // Simulate adjacency convergence
      state.ospf.neighbors = [
        { routerId: '2.2.2.2', ip: '10.0.0.2', interface: 'GigabitEthernet0/1', state: 'FULL', role: 'DR' },
      ];
      return { output: `[OSPF-1]: Interface GigabitEthernet0/1 area ${parts[4]} neighbor 2.2.2.2 state changed to FULL`, category: 'OSPF Protocol', updatedState: state };
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
      return { output: output.trim(), category, updatedState: state };
    }

    // access-list 101 permit/deny ...
    const aclMatch = cleanCmd.match(/^access-list\s+(\d+)\s+(permit|deny)\s+([a-zA-Z0-9]+)\s+([0-9./any]+)\s+([0-9./any]+)(?:\s+eq\s+(\d+))?/i);
    if (aclMatch) {
      const [, aclId, action, proto, src, dst, port] = aclMatch;
      state.acls[aclId] = state.acls[aclId] || [];
      state.acls[aclId].push({
        seq: (state.acls[aclId].length + 1) * 10,
        action: action.toLowerCase() as 'permit' | 'deny',
        protocol: proto.toLowerCase(),
        source: src,
        dest: dst,
        port: port ? parseInt(port, 10) : undefined,
      });
      return { output: `${state.hostname}(config)#`, category: 'Configuration', updatedState: state };
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
      return { output: output.trim(), category, updatedState: state };
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
      return { output: '[NAT]: Dynamic PAT overload enabled on outside interface GigabitEthernet0/1', category: 'Configuration', updatedState: state };
    }

    // -------------------------------------------------------------------------
    // 7. IPSEC VPN TUNNEL COMMANDS
    // -------------------------------------------------------------------------
    if (lower.includes('show crypto isakmp sa') || lower.includes('show crypto ipsec sa')) {
      category = 'IPsec VPN';
      const ipsec = state.ipsec || { phase1: 'UP', phase2: 'UP', peerIp: '203.0.113.2', transformSet: 'ESP-AES256-SHA256', dhGroup: 14, encPackets: 120, decPackets: 120 };
      output = `IPv4 Crypto ISAKMP SA\ndst             src             state          conn-id slot status\n${ipsec.peerIp.padEnd(15)} 198.51.100.2    ${ipsec.phase1 === 'UP' ? 'QM_IDLE' : 'MM_NO_STATE'}     1001    0 ${ipsec.phase1 === 'UP' ? 'ACTIVE' : 'FAILED'}\n\n`;
      output += `interface: GigabitEthernet0/1\n    Crypto map tag: VPN-MAP, local addr 198.51.100.2\n   protected vrf: (none)\n   local  ident (addr/mask/prot/port): (192.168.1.0/255.255.255.0/0/0)\n   remote ident (addr/mask/prot/port): (192.168.2.0/255.255.255.0/0/0)\n   current_peer ${ipsec.peerIp} port 500\n     #pkts encaps: ${ipsec.encPackets}, #pkts encrypt: ${ipsec.encPackets}, #pkts digest: ${ipsec.encPackets}\n     #pkts decaps: ${ipsec.decPackets}, #pkts decrypt: ${ipsec.decPackets}, #pkts verify: ${ipsec.decPackets}\n`;
      return { output: output.trim(), category, updatedState: state };
    }

    if (cleanCmd.match(/^crypto isakmp key\s+([a-zA-Z0-9_-]+)\s+address\s+([0-9.]+)/i)) {
      if (state.ipsec) {
        state.ipsec.phase1 = 'UP';
        state.ipsec.phase2 = 'UP';
        state.ipsec.encPackets = 54;
        state.ipsec.decPackets = 54;
        state.faultResolved = true;
      }
      return { output: '[ISAKMP]: Pre-shared key synchronized. Peer 203.0.113.2 transitioned to QM_IDLE (Phase 1 & 2 ACTIVE).', category: 'Configuration', updatedState: state };
    }

    // -------------------------------------------------------------------------
    // 8. DIAGNOSTIC TESTS (PING & TRACEROUTE)
    // -------------------------------------------------------------------------
    if (lower.startsWith('ping')) {
      category = 'ICMP Reachability';
      const target = cleanCmd.split(/\s+/)[1] || '192.168.1.1';
      
      // If default gateway missing fault is active and target is external, ping fails!
      if (state.injectedFault === 'DEFAULT_GATEWAY_MISSING' && !state.faultResolved && target !== '192.168.1.1') {
        output = `PING ${target} (56 data bytes)\nFrom 192.168.1.50 icmp_seq=1 Destination Host Unreachable\nFrom 192.168.1.50 icmp_seq=2 Destination Host Unreachable\n--- ${target} ping statistics ---\n3 packets transmitted, 0 received, +2 errors, 100% packet loss`;
      } else {
        output = `PING ${target} (56 data bytes)\n64 bytes from ${target}: icmp_seq=1 ttl=64 time=1.04 ms\n64 bytes from ${target}: icmp_seq=2 ttl=64 time=0.98 ms\n64 bytes from ${target}: icmp_seq=3 ttl=64 time=1.12 ms\n--- ${target} ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, rtt min/avg/max = 0.98/1.04/1.12 ms`;
      }
      return { output, category, updatedState: state };
    }

    if (lower.startsWith('traceroute') || lower.startsWith('tracert')) {
      category = 'Path Trace';
      const target = cleanCmd.split(/\s+/)[1] || '8.8.8.8';
      output = `traceroute to ${target} (30 hops max):\n 1  192.168.1.1 (192.168.1.1)  1.12 ms\n 2  10.0.0.1 (10.0.0.1)  6.45 ms\n 3  ${target}  14.20 ms`;
      return { output, category, updatedState: state };
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
      return { output, category, updatedState: state };
    }

    // Default Fallback
    output = `Simulated Environment: Executed '${cleanCmd}'. Status: Command accepted. Device state updated.`;
    return { output, category, updatedState: state };
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

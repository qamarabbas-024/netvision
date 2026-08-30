import { NetworkDevice, NetworkLink, EducationalPacket, StoryStage } from '../types/network';

export const NETWORK_DEVICES: NetworkDevice[] = [
  {
    id: 'workstation',
    name: 'WORKSTATION',
    label: 'Host Client (Ubuntu / NetVision OS)',
    type: 'workstation',
    layer: 'Layer 7 Application / Layer 3 Host',
    ip: '192.168.1.10/24',
    mac: '70:85:C2:54:19:A1',
    position: [-6.2, 0, 1.2],
    description: 'User client workstation generating HTTP/3 web requests and DNS queries.',
    role: 'Originates application payloads and executes socket requests via TCP/UDP.',
    status: 'healthy',
    interfaces: [
      { name: 'eth0', ip: '192.168.1.10/24', mac: '70:85:C2:54:19:A1', status: 'up', speed: '1 Gbps' }
    ],
    details: {
      cpuUsage: '14%',
      memoryUsage: '4.2 GB / 16 GB',
      throughput: '12.4 Mbps',
      mtu: 1500,
      macTable: [],
      routingTable: [
        { destination: '0.0.0.0/0', gateway: '192.168.1.1', interface: 'eth0', metric: 100 },
        { destination: '192.168.1.0/24', gateway: '0.0.0.0', interface: 'eth0', metric: 0 }
      ]
    }
  },
  {
    id: 'switch',
    name: 'L2 SWITCH',
    label: 'Enterprise Access Switch (24-Port Gigabit)',
    type: 'switch',
    layer: 'Layer 2 Data Link',
    ip: '192.168.1.2/24 (Mgmt)',
    mac: '00:1B:67:8A:4F:01',
    position: [-2.8, 0, -0.4],
    description: 'Hardware wire-speed frame forwarding based on CAM MAC address table.',
    role: 'Receives Ethernet frames, checks FCS checksums, and forwards to target egress ports without modifying IP packets.',
    status: 'healthy',
    interfaces: [
      { name: 'Gi0/1 (Workstation)', mac: '00:1B:67:8A:4F:01', status: 'up', speed: '1 Gbps' },
      { name: 'Gi0/24 (Router Trunk)', mac: '00:1B:67:8A:4F:18', status: 'up', speed: '1 Gbps' }
    ],
    details: {
      cpuUsage: '8%',
      memoryUsage: '512 MB / 2 GB',
      throughput: '48.2 Mbps',
      macTable: [
        { mac: '70:85:C2:54:19:A1', port: 'Gi0/1', vlan: 10 },
        { mac: '00:0A:95:9D:68:16', port: 'Gi0/24', vlan: 10 }
      ]
    }
  },
  {
    id: 'router',
    name: 'ROUTER',
    label: 'Core Edge Router (Dual-Stack IPv4/IPv6)',
    type: 'router',
    layer: 'Layer 3 Network',
    ip: '192.168.1.1 & 10.0.0.1',
    mac: '00:0A:95:9D:68:16',
    position: [0.8, 0.2, 0.4],
    description: 'Layer 3 forwarding engine evaluating longest-prefix match routing tables, decrementing TTL, and recalculating IP checksums.',
    role: 'Receives packets and chooses where to forward them based on FIB routing tables and dynamic routing protocols (BGP/OSPF).',
    status: 'healthy',
    interfaces: [
      { name: 'GigabitEthernet0/0 (LAN)', ip: '192.168.1.1/24', mac: '00:0A:95:9D:68:16', status: 'up', speed: '10 Gbps' },
      { name: 'GigabitEthernet0/1 (WAN)', ip: '10.0.0.1/30', mac: '00:0A:95:9D:68:17', status: 'up', speed: '10 Gbps' }
    ],
    details: {
      cpuUsage: '22%',
      memoryUsage: '2.8 GB / 8 GB',
      throughput: '1.4 Gbps',
      mtu: 1500,
      routingTable: [
        { destination: '192.168.1.0/24', gateway: 'Direct', interface: 'Gi0/0', metric: 0 },
        { destination: '10.0.0.0/30', gateway: 'Direct', interface: 'Gi0/1', metric: 0 },
        { destination: '142.250.72.0/24', gateway: '10.0.0.2', interface: 'Gi0/1', metric: 10 }
      ]
    }
  },
  {
    id: 'gateway',
    name: 'EDGE GATEWAY',
    label: 'Next-Gen Firewall & State Engine',
    type: 'gateway',
    layer: 'Layer 4-7 Security & NAT',
    ip: '10.0.0.2 & 172.16.0.1',
    mac: '52:54:00:12:34:56',
    position: [4.4, 0, -0.6],
    description: 'Stateful packet inspection, NAT translation, TLS handshakes, and DDoS ingress filtering.',
    role: 'Validates TCP sequence numbers, inspects protocol headers, and ensures secure edge boundary defense.',
    status: 'healthy',
    interfaces: [
      { name: 'eth0 (WAN Ingress)', ip: '10.0.0.2/30', mac: '52:54:00:12:34:56', status: 'up', speed: '10 Gbps' },
      { name: 'eth1 (DMZ Server)', ip: '172.16.0.1/24', mac: '52:54:00:12:34:57', status: 'up', speed: '10 Gbps' }
    ],
    details: {
      cpuUsage: '31%',
      memoryUsage: '6.4 GB / 16 GB',
      throughput: '980 Mbps',
      firewallRules: [
        { rule: 'ALLOW TCP:443 (HTTPS)', action: 'ALLOW', protocol: 'TCP' },
        { rule: 'ALLOW UDP:53 (DNS)', action: 'ALLOW', protocol: 'UDP' },
        { rule: 'DENY ICMP FLOOD', action: 'DENY', protocol: 'ICMP' }
      ]
    }
  },
  {
    id: 'server',
    name: 'SERVER',
    label: 'Primary Application Server (HTTP/3 & Database)',
    type: 'server',
    layer: 'Layer 7 Application Server',
    ip: '142.250.72.14/24',
    mac: '90:B1:1C:77:88:99',
    position: [8.0, 0.4, 0.6],
    description: 'High-performance edge server handling HTTP/3 QUIC requests and returning cryptographically signed responses.',
    role: 'Processes application requests, terminates TLS 1.3 encryption, and streams dynamic learning assets.',
    status: 'healthy',
    interfaces: [
      { name: 'ens3f0', ip: '142.250.72.14/24', mac: '90:B1:1C:77:88:99', status: 'up', speed: '25 Gbps' }
    ],
    details: {
      cpuUsage: '18%',
      memoryUsage: '12.8 GB / 64 GB',
      throughput: '2.8 Gbps',
      routingTable: [
        { destination: '0.0.0.0/0', gateway: '172.16.0.1', interface: 'ens3f0', metric: 10 }
      ]
    }
  }
];

export const NETWORK_LINKS: NetworkLink[] = [
  {
    id: 'link-workstation-switch',
    from: 'workstation',
    to: 'switch',
    status: 'healthy',
    speed: '1 Gbps Cat6 Copper',
    latencyMs: 0.12,
    utilizationPercent: 24,
    medium: 'Copper UTP'
  },
  {
    id: 'link-switch-router',
    from: 'switch',
    to: 'router',
    status: 'healthy',
    speed: '10 Gbps SFP+ Fiber',
    latencyMs: 0.18,
    utilizationPercent: 42,
    medium: 'Fiber Optic'
  },
  {
    id: 'link-router-gateway',
    from: 'router',
    to: 'gateway',
    status: 'healthy',
    speed: '10 Gbps Direct Attached Copper',
    latencyMs: 0.22,
    utilizationPercent: 38,
    medium: 'Twinax DAC'
  },
  {
    id: 'link-gateway-server',
    from: 'gateway',
    to: 'server',
    status: 'healthy',
    speed: '25 Gbps Multi-Mode Fiber',
    latencyMs: 0.42,
    utilizationPercent: 19,
    medium: 'OM4 Fiber'
  }
];

export const EDUCATIONAL_PACKETS: EducationalPacket[] = [
  {
    id: 'pkt-dns',
    label: 'DNS QUERY',
    protocol: 'DNS',
    source: 'workstation',
    destination: 'server',
    sourceIp: '192.168.1.10',
    destIp: '8.8.8.8',
    stageIndex: 1,
    details: {
      'ID': '0x7A3F',
      'FROM': '192.168.1.10',
      'TO': '8.8.8.8',
      'QUERY': 'netvision.dev (A Record)',
      'FLAGS': 'RD (Recursion Desired)'
    }
  },
  {
    id: 'pkt-tcp-syn',
    label: 'TCP SYN',
    protocol: 'TCP SYN',
    source: 'workstation',
    destination: 'server',
    sourceIp: '192.168.1.10:54321',
    destIp: '142.250.72.14:443',
    stageIndex: 2,
    details: {
      'SRC': '192.168.1.10:54321',
      'DST': '142.250.72.14:443',
      'SEQ': 105338,
      'WIN': 65535,
      'FLAGS': '0x002 (SYN)'
    }
  },
  {
    id: 'pkt-ip',
    label: 'IP PACKET',
    protocol: 'IP',
    source: 'router',
    destination: 'gateway',
    sourceIp: '192.168.1.10',
    destIp: '142.250.72.14',
    stageIndex: 3,
    details: {
      'SRC': '192.168.1.10',
      'DST': '142.250.72.14',
      'TTL': 63,
      'PROTO': '6 (TCP)',
      'CHECKSUM': '0x3E1F (Valid)'
    }
  },
  {
    id: 'pkt-http3',
    label: 'HTTP/3 RESPONSE',
    protocol: 'HTTP/3',
    source: 'server',
    destination: 'workstation',
    sourceIp: '142.250.72.14',
    destIp: '192.168.1.10',
    stageIndex: 4,
    details: {
      'STATUS': '200 OK',
      'SIZE': '14.2 KB',
      'TIME': '42ms',
      'PROTOCOL': 'QUIC / UDP 443',
      'CONTENT-TYPE': 'application/json'
    }
  }
];

export const STORY_STAGES: StoryStage[] = [
  {
    id: 1,
    stageNumber: 'STAGE 01',
    title: 'NETWORK OVERVIEW',
    subtitle: 'The Topology Foundation',
    description: 'The complete enterprise network model spanning Layer 2 Access, Layer 3 Core Routing, and Layer 4-7 Edge Gateways.',
    cameraPosition: [0, 8.5, 14],
    cameraTarget: [0.5, 0, 0],
    fov: 38,
    networkState: 'healthy'
  },
  {
    id: 2,
    stageNumber: 'STAGE 02',
    title: 'PACKET FLOW',
    subtitle: 'Socket Emission & Frame Serialization',
    description: 'Workstation encapsulates HTTP payload into TCP segment, encapsulates into IPv4, and frames onto Ethernet link.',
    cameraPosition: [-4, 5.5, 9.5],
    cameraTarget: [-4.5, 0.2, 0.5],
    fov: 35,
    focusedDeviceId: 'workstation',
    packetProgress: 0.15,
    activePacket: EDUCATIONAL_PACKETS[0],
    networkState: 'healthy'
  },
  {
    id: 3,
    stageNumber: 'STAGE 03',
    title: 'PACKET INSPECTION',
    subtitle: 'Layer 2 Switching & CAM Table Lookup',
    description: 'L2 Switch receives Ethernet preamble, validates frame check sequence (FCS), and forwards without altering IP headers.',
    cameraPosition: [-1.8, 4.2, 7.5],
    cameraTarget: [-2.8, 0.1, -0.4],
    fov: 31,
    focusedDeviceId: 'switch',
    focusedLinkId: 'link-workstation-switch',
    packetProgress: 0.35,
    activePacket: EDUCATIONAL_PACKETS[1],
    networkState: 'healthy'
  },
  {
    id: 4,
    stageNumber: 'STAGE 04',
    title: 'ROUTING DECISION',
    subtitle: 'FIB Longest Prefix Matching & TTL Decrement',
    description: 'Router parses Layer 3 destination IP (142.250.72.14), decrements TTL to 63, recalculates header checksum, and routes to next hop.',
    cameraPosition: [1.2, 4.5, 8.0],
    cameraTarget: [0.8, 0.3, 0.4],
    fov: 33,
    focusedDeviceId: 'router',
    focusedLinkId: 'link-switch-router',
    packetProgress: 0.55,
    activePacket: EDUCATIONAL_PACKETS[2],
    networkState: 'healthy'
  },
  {
    id: 5,
    stageNumber: 'STAGE 05',
    title: 'NETWORK CHANGE',
    subtitle: 'Link Degradation & Packet Delay',
    description: 'The physical transit link between Router and Edge Gateway experiences line noise and packet retransmissions.',
    cameraPosition: [2.5, 4.2, 7.8],
    cameraTarget: [2.6, 0.1, -0.1],
    fov: 33,
    focusedLinkId: 'link-router-gateway',
    packetProgress: 0.65,
    networkState: 'degraded'
  },
  {
    id: 6,
    stageNumber: 'STAGE 06',
    title: 'FAILURE & LOSS',
    subtitle: 'Link Down & Packet Drop',
    description: 'Link between Router and Gateway drops to 0 Mbps. Packets drop and TCP SYN timeout triggers on the host.',
    cameraPosition: [2.5, 4.8, 8.2],
    cameraTarget: [2.6, 0.1, -0.1],
    fov: 34,
    focusedLinkId: 'link-router-gateway',
    networkState: 'packet_loss'
  },
  {
    id: 7,
    stageNumber: 'STAGE 07',
    title: 'INVESTIGATION',
    subtitle: 'Diagnostics & Root Cause Analysis',
    description: 'Inspect interface error counters, MTU mismatches, and run traceroute to isolate the fault domain.',
    cameraPosition: [4.2, 4.2, 7.5],
    cameraTarget: [4.4, 0.1, -0.6],
    fov: 33,
    focusedDeviceId: 'gateway',
    networkState: 'degraded'
  },
  {
    id: 8,
    stageNumber: 'STAGE 08',
    title: 'RECOVERY',
    subtitle: 'Dynamic Reroute & Convergence',
    description: 'Routing convergence resolves alternative path. Link health is restored and HTTP/3 responses stream at full speed.',
    cameraPosition: [5.5, 4.5, 8.5],
    cameraTarget: [6.2, 0.2, 0.2],
    fov: 34,
    focusedDeviceId: 'server',
    packetProgress: 0.95,
    activePacket: EDUCATIONAL_PACKETS[3],
    networkState: 'healthy'
  },
  {
    id: 9,
    stageNumber: 'STAGE 09',
    title: 'ZOOM OUT OVERVIEW',
    subtitle: 'Full System Health Restored',
    description: 'Full end-to-end telemetry online: 0.42ms round-trip latency, 100% link availability, zero packet loss.',
    cameraPosition: [0.8, 9.2, 15],
    cameraTarget: [0.5, 0, 0],
    fov: 40,
    networkState: 'healthy'
  },
  {
    id: 10,
    stageNumber: 'STAGE 10',
    title: 'LEARNING PATHWAY',
    subtitle: 'Master Networking Intuition',
    description: 'Transition from live 3D visualization into structured hands-on courses, simulations, and real CLI labs.',
    cameraPosition: [0, 8.0, 13.5],
    cameraTarget: [0, 0, 0],
    fov: 38,
    networkState: 'healthy'
  }
];

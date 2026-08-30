export interface CurriculumStep {
  stepNumber: string;
  code: string;
  title: string;
  summary: string;
  topics: string[];
  duration: string;
  labsCount: number;
  isLocked?: boolean;
}

export const CURRICULUM_STEPS: CurriculumStep[] = [
  {
    stepNumber: '01',
    code: 'NET-101',
    title: 'Digital Foundations',
    summary: 'Bits, bytes, media, topology basics',
    topics: ['Binary & Hexadecimal math', 'Physical transmission media', 'Topologies: Bus, Ring, Star, Mesh', 'Bandwidth vs Latency vs Throughput'],
    duration: '6 Hours',
    labsCount: 8
  },
  {
    stepNumber: '02',
    code: 'NET-102',
    title: 'Network Fundamentals',
    summary: 'OSI, TCP/IP, Ethernet, addressing',
    topics: ['7-Layer OSI & 4-Layer TCP/IP models', 'Encapsulation & De-encapsulation', 'MAC address architecture', 'Ethernet frame structure & FCS'],
    duration: '10 Hours',
    labsCount: 14
  },
  {
    stepNumber: '03',
    code: 'NET-201',
    title: 'Local Networking',
    summary: 'Switching, VLANs, trunking',
    topics: ['CAM / MAC learning table', 'VLAN 802.1Q tagging', 'Trunking (ISL vs 802.1Q)', 'Spanning Tree Protocol (STP) convergence'],
    duration: '12 Hours',
    labsCount: 16
  },
  {
    stepNumber: '04',
    code: 'NET-202',
    title: 'IP Networking',
    summary: 'IPv4, subnetting, routing basics',
    topics: ['IPv4 header breakdown', 'VLSM & CIDR subnet calculation', 'Default gateways & ARP protocol', 'Static routing & loop prevention'],
    duration: '14 Hours',
    labsCount: 18
  },
  {
    stepNumber: '05',
    code: 'NET-301',
    title: 'Transport & Services',
    summary: 'TCP, UDP, DNS, DHCP, ICMP',
    topics: ['TCP 3-Way Handshake (SYN/ACK)', 'Sliding window & Congestion Control', 'DNS resolution & zone transfers', 'DHCP DORA process & NAT translation'],
    duration: '16 Hours',
    labsCount: 20
  },
  {
    stepNumber: '06',
    code: 'NET-401',
    title: 'Routing & Engineering',
    summary: 'OSPF, ACLs, BGP, advanced topics',
    topics: ['Link-State Routing (OSPF Area 0)', 'Autonomous Systems & eBGP/iBGP', 'Standard & Extended ACL filtering', 'QoS prioritization & VLAN routing'],
    duration: '20 Hours',
    labsCount: 24
  },
  {
    stepNumber: '07',
    code: 'NV-CERT',
    title: 'Master Credential',
    summary: 'Complete all & earn NV Professional Cert',
    topics: ['Comprehensive 3-hour live topology exam', 'Packet capture troubleshooting challenge', 'Fault injection recovery scenario', 'Cryptographically signed on-chain verification'],
    duration: 'Capstone Exam',
    labsCount: 1,
    isLocked: true
  }
];

export const FEATURE_HIGHLIGHTS = [
  {
    id: 'packet-vis',
    title: 'Live Packet Visualization',
    description: 'Watch DNS, TCP, ICMP and more in real-time 3D.',
    iconName: 'Box',
    gradient: 'from-cyan-500/20 to-emerald-500/20'
  },
  {
    id: 'sandbox-lab',
    title: 'Interactive Sandbox Lab',
    description: 'Build, break and fix networks in a drag & drop environment.',
    iconName: 'Network',
    gradient: 'from-emerald-500/20 to-teal-500/20'
  },
  {
    id: 'cli-terminal',
    title: 'Real CLI Experience',
    description: 'Run real commands inside the built-in terminal.',
    iconName: 'Terminal',
    gradient: 'from-teal-500/20 to-blue-500/20'
  },
  {
    id: 'troubleshoot',
    title: 'Network Troubleshooting',
    description: 'Diagnose real-world issues with guided scenarios.',
    iconName: 'Wrench',
    gradient: 'from-blue-500/20 to-indigo-500/20'
  },
  {
    id: 'certification',
    title: 'Industry Certifications',
    description: 'Earn verifiable certificates and boost your career.',
    iconName: 'Award',
    gradient: 'from-indigo-500/20 to-cyan-500/20'
  }
];

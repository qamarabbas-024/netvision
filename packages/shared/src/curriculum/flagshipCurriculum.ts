// NetVision Canonical Flagship Curriculum & Credential Specification (Shared Monorepo Model)

export interface FlagshipModuleDefinition {
  id: string;
  slug: string;
  order: number;
  title: string;
  description: string;
  legacyCourseCodes: string[];
}

export interface FlagshipCourseDefinition {
  code: string;           // Course identity: NV-C01 to NV-C05
  credentialCode: string; // Credential identity: NV-NET-C01 to NV-NET-C05
  slug: string;
  order: number;
  title: string;
  tagline: string;
  category: string;
  description: string;
  level: 'FOUNDATIONAL' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  icon: string;
  estimatedHours: number;
  prerequisites: string[]; // Course codes (e.g. ['NV-C01'])
  modules: FlagshipModuleDefinition[];
}

export interface CredentialDefinitionBlueprint {
  code: string;
  title: string;
  description: string;
  level: 'FOUNDATIONAL' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  courseCode?: string;
  isMastery?: boolean;
}

export const CANONICAL_CREDENTIALS: CredentialDefinitionBlueprint[] = [
  {
    code: 'NV-NET-C01',
    title: 'NetVision Certified Network Foundations Specialist',
    description: 'Validates foundational competence in digital bit representation, transmission media, physical topologies, and layered OSI/TCP-IP encapsulation.',
    level: 'FOUNDATIONAL',
    courseCode: 'NV-C01',
    isMastery: false,
  },
  {
    code: 'NV-NET-C02',
    title: 'NetVision Certified Switching & IP Networking Specialist',
    description: 'Demonstrates professional competence in Ethernet 802.3 framing, enterprise 802.1Q VLAN trunking, Spanning Tree loop prevention, and IPv4 CIDR subnetting calculations.',
    level: 'BEGINNER',
    courseCode: 'NV-C02',
    isMastery: false,
  },
  {
    code: 'NV-NET-C03',
    title: 'NetVision Certified Routing & Services Specialist',
    description: 'Demonstrates professional competence in core IP services (ARP, ICMP, DNS, DHCP), TCP/UDP transport socket dynamics, static routing administration, and single-area OSPFv2 link-state routing.',
    level: 'INTERMEDIATE',
    courseCode: 'NV-C03',
    isMastery: false,
  },
  {
    code: 'NV-NET-C04',
    title: 'NetVision Certified Network Security Specialist',
    description: 'Demonstrates competence in perimeter security with standard/extended IPv4 ACLs, stateful inspection firewalls, NAT/PAT translation tables, and site-to-site IPsec VPN encryption.',
    level: 'INTERMEDIATE',
    courseCode: 'NV-C04',
    isMastery: false,
  },
  {
    code: 'NV-NET-C05',
    title: 'NetVision Certified Network Engineering Specialist',
    description: 'Demonstrates elite competence in Wireshark PCAP stream dissection, systematic multi-layer incident diagnostics, and Python network automation with REST APIs and YANG data models.',
    level: 'ADVANCED',
    courseCode: 'NV-C05',
    isMastery: false,
  },
  {
    code: 'NV-NET-MASTERY',
    title: 'NetVision Certified Network Engineering Master',
    description: 'The highest professional credential awarded by NetVision. Proves holistic mastery across all 5 flagship networking programs, rigorous practical lab challenges, and passing the comprehensive Master Capstone Examination.',
    level: 'ADVANCED',
    isMastery: true,
  },
];

export const FLAGSHIP_5_COURSES: FlagshipCourseDefinition[] = [
  // =========================================================================
  // COURSE 1: Foundations & Network Architecture
  // =========================================================================
  {
    code: 'NV-C01',
    credentialCode: 'NV-NET-C01',
    slug: 'foundations-network-architecture',
    order: 1,
    title: 'Foundations & Network Architecture',
    tagline: 'Master digital information representation, physical media, network topologies, and layered reference models.',
    category: 'Foundations',
    description: 'Zero-prerequisite foundation program covering binary/hexadecimal mathematics, CPU/NIC hardware architecture, physical copper/fiber media, star/mesh topologies, and OSI 7-layer / TCP-IP 4-layer encapsulation.',
    level: 'FOUNDATIONAL',
    icon: 'Binary',
    estimatedHours: 14,
    prerequisites: [],
    modules: [
      {
        id: 'mod-c01-digital-representation',
        slug: 'digital-representation',
        order: 1,
        title: 'Module 1: Digital Representation & Hardware Architecture',
        description: 'Understand how digital data is represented in binary bits, hex bytes, and hardware NIC/CPU interfaces.',
        legacyCourseCodes: ['NET-101'],
      },
      {
        id: 'mod-c01-topologies-media',
        slug: 'topologies-media',
        order: 2,
        title: 'Module 2: Network Topologies & Transmission Media',
        description: 'Explore star, mesh, and bus geometries alongside copper UTP, single-mode and multi-mode fiber optic cabling.',
        legacyCourseCodes: ['NET-102'],
      },
      {
        id: 'mod-c01-reference-models',
        slug: 'reference-models',
        order: 3,
        title: 'Module 3: OSI & TCP/IP Reference Models',
        description: 'Master the 7 layers of OSI, 4 layers of TCP/IP, Protocol Data Units (PDUs), and data encapsulation.',
        legacyCourseCodes: ['NET-103'],
      },
    ],
  },

  // =========================================================================
  // COURSE 2: Ethernet, Switching & IP Networking
  // =========================================================================
  {
    code: 'NV-C02',
    credentialCode: 'NV-NET-C02',
    slug: 'ethernet-switching-ip-networking',
    order: 2,
    title: 'Ethernet, Switching & IP Networking',
    tagline: 'Master Layer 2 Ethernet framing, enterprise VLANs, Spanning Tree loop prevention, and IPv4 CIDR subnetting.',
    category: 'Switching',
    description: 'Comprehensive campus networking program covering IEEE 802.3 framing, CAM / MAC learning tables, 802.1Q VLAN trunking, Spanning Tree Protocol (STP/RSTP) convergence, and 32-bit IPv4 CIDR / VLSM network partitioning.',
    level: 'BEGINNER',
    icon: 'Cpu',
    estimatedHours: 24,
    prerequisites: ['NV-C01'],
    modules: [
      {
        id: 'mod-c02-ethernet-framing',
        slug: 'ethernet-framing',
        order: 1,
        title: 'Module 1: Layer 2 Ethernet Framing & MAC Tables',
        description: 'Study Ethernet frames, MAC address tables, collision domains, and transparent Layer 2 switching.',
        legacyCourseCodes: ['NET-201'],
      },
      {
        id: 'mod-c02-vlans-trunking',
        slug: 'vlans-trunking',
        order: 2,
        title: 'Module 2: Enterprise Switching, VLANs & 802.1Q Trunking',
        description: 'Segment broadcast domains using VLAN IDs, configure access vs trunk interfaces, and analyze 802.1Q tags.',
        legacyCourseCodes: ['NET-301'],
      },
      {
        id: 'mod-c02-spanning-tree',
        slug: 'spanning-tree',
        order: 3,
        title: 'Module 3: Spanning Tree Protocol & Switch Redundancy',
        description: 'Prevent Layer 2 broadcast storms using Spanning Tree Protocol (STP), Root Bridge election, and Rapid STP.',
        legacyCourseCodes: ['NET-302'],
      },
      {
        id: 'mod-c02-ipv4-subnetting',
        slug: 'ipv4-subnetting',
        order: 4,
        title: 'Module 4: IPv4 Addressing & CIDR Subnetting Mastery',
        description: 'Master IPv4 binary structure, network vs host boundaries, CIDR slash notation, and VLSM calculations.',
        legacyCourseCodes: ['NET-202'],
      },
    ],
  },

  // =========================================================================
  // COURSE 3: Transport, Routing & Network Services
  // =========================================================================
  {
    code: 'NV-C03',
    credentialCode: 'NV-NET-C03',
    slug: 'transport-routing-network-services',
    order: 3,
    title: 'Transport, Routing & Network Services',
    tagline: 'Master core IP services (ARP, DNS, DHCP), TCP/UDP transport sockets, static routing, and OSPFv2 dynamic routing.',
    category: 'Routing',
    description: 'In-depth Layer 3/4 engineering program covering ARP resolution, ICMP diagnostics, DHCP DORA allocation, DNS resolution, TCP 3-way handshakes, sequence/ack tracking, static routing tables, and single-area OSPFv2 link-state routing.',
    level: 'INTERMEDIATE',
    icon: 'Network',
    estimatedHours: 28,
    prerequisites: ['NV-C02'],
    modules: [
      {
        id: 'mod-c03-core-ip-services',
        slug: 'core-ip-services',
        order: 1,
        title: 'Module 1: Core IP Infrastructure Services',
        description: 'Detailed study of Address Resolution Protocol (ARP), ICMP pings, DNS domain resolution, and DHCP address leases.',
        legacyCourseCodes: ['NET-203'],
      },
      {
        id: 'mod-c03-transport-protocols',
        slug: 'transport-protocols',
        order: 2,
        title: 'Module 2: Transport Layer Protocols (TCP & UDP)',
        description: 'Deep dive into Layer 4 reliable stream transport (TCP), 3-way connection handshakes, sockets, and UDP datagrams.',
        legacyCourseCodes: ['NET-204'],
      },
      {
        id: 'mod-c03-static-routing',
        slug: 'static-routing',
        order: 3,
        title: 'Module 3: IP Routing & Static Route Administration',
        description: 'Administer router interfaces, routing tables, longest prefix match rules, and default static forwarding.',
        legacyCourseCodes: ['NET-303'],
      },
      {
        id: 'mod-c03-dynamic-routing-ospf',
        slug: 'dynamic-routing-ospf',
        order: 4,
        title: 'Module 4: Dynamic Routing with Single-Area OSPFv2',
        description: 'Learn dynamic interior routing, OSPF neighbor adjacencies, Hello packets, LSA flooding, and Dijkstra SPF calculation.',
        legacyCourseCodes: ['NET-304'],
      },
    ],
  },

  // =========================================================================
  // COURSE 4: Network Security & Secure Connectivity
  // =========================================================================
  {
    code: 'NV-C04',
    credentialCode: 'NV-NET-C04',
    slug: 'network-security-secure-connectivity',
    order: 4,
    title: 'Network Security & Secure Connectivity',
    tagline: 'Master perimeter firewalls, IPv4 ACLs, NAT/PAT translation, and site-to-site IPsec VPN encryption.',
    category: 'Security',
    description: 'Enterprise security program covering packet filtering via standard/extended IPv4 ACLs, stateful inspection firewalls, Static/Dynamic NAT and PAT overload, and site-to-site IPsec cryptographic VPN tunnels with IKE Phase 1/2.',
    level: 'INTERMEDIATE',
    icon: 'Shield',
    estimatedHours: 21,
    prerequisites: ['NV-C03'],
    modules: [
      {
        id: 'mod-c04-acls-firewalls',
        slug: 'acls-firewalls',
        order: 1,
        title: 'Module 1: Perimeter Security, ACLs & Stateful Firewalls',
        description: 'Enforce perimeter security using IPv4 ACLs, wildcard mask filtering, and stateful connection tracking.',
        legacyCourseCodes: ['NET-305'],
      },
      {
        id: 'mod-c04-nat-pat',
        slug: 'nat-pat',
        order: 2,
        title: 'Module 2: Network & Port Address Translation (NAT/PAT)',
        description: 'Conserve IPv4 address space using Static NAT, Dynamic NAT pools, and Port Address Translation (PAT Overload).',
        legacyCourseCodes: ['NET-401'],
      },
      {
        id: 'mod-c04-vpn-crypto',
        slug: 'vpn-crypto',
        order: 3,
        title: 'Module 3: VPN Architectures & Cryptography',
        description: 'Secure WAN transport using IPsec tunnels, ISAKMP IKE Phase 1/2 negotiation, AES encryption, and Diffie-Hellman.',
        legacyCourseCodes: ['NET-402'],
      },
    ],
  },

  // =========================================================================
  // COURSE 5: Network Engineering, Automation & Troubleshooting
  // =========================================================================
  {
    code: 'NV-C05',
    credentialCode: 'NV-NET-C05',
    slug: 'network-engineering-automation-troubleshooting',
    order: 5,
    title: 'Network Engineering, Automation & Troubleshooting',
    tagline: 'Master Wireshark PCAP packet inspection, multi-layer incident diagnostics, and Python NetDevOps automation.',
    category: 'Engineering',
    description: 'Capstone network engineering program covering raw packet capture analysis with Wireshark, systematic multi-layer diagnostic workflows, MTU black hole resolution, and Python network automation with REST APIs and YANG data models.',
    level: 'ADVANCED',
    icon: 'Search',
    estimatedHours: 24,
    prerequisites: ['NV-C04'],
    modules: [
      {
        id: 'mod-c05-packet-analysis',
        slug: 'packet-analysis',
        order: 1,
        title: 'Module 1: Packet Capture Analysis & Wireshark Forensics',
        description: 'Inspect raw PCAP traces in Wireshark, analyze TCP retransmissions, evaluate ICMP errors, and isolate packet anomalies.',
        legacyCourseCodes: ['NET-404'],
      },
      {
        id: 'mod-c05-troubleshooting-workflows',
        slug: 'troubleshooting-workflows',
        order: 2,
        title: 'Module 2: Complex Diagnostic & Troubleshooting Incident Workflows',
        description: 'Execute systematic end-to-end network troubleshooting across duplex mismatches, PMTUD black holes, and bufferbloat.',
        legacyCourseCodes: ['NET-TROUBLESHOOT'],
      },
      {
        id: 'mod-c05-network-automation',
        slug: 'network-automation',
        order: 3,
        title: 'Module 3: Network Automation & Programmability Foundations',
        description: 'Programmatic network management using Python scripts, REST APIs, Netmiko, YANG/NETCONF data models, and Ansible.',
        legacyCourseCodes: ['NET-403'],
      },
    ],
  },
];

// Authoritative mapping from legacy course slugs to Flagship target course and module
export const LEGACY_SLUG_COMPATIBILITY_MAP: Record<string, { flagshipSlug: string; moduleSlug: string; courseCode: string }> = {
  // Level 0 / Foundations
  'net-101-digital-foundations': { flagshipSlug: 'foundations-network-architecture', moduleSlug: 'digital-representation', courseCode: 'NV-C01' },
  'net-102-network-fundamentals': { flagshipSlug: 'foundations-network-architecture', moduleSlug: 'topologies-media', courseCode: 'NV-C01' },
  'net-103-reference-models': { flagshipSlug: 'foundations-network-architecture', moduleSlug: 'reference-models', courseCode: 'NV-C01' },

  // Level 1 / Switching & Addressing
  'net-201-layer2-ethernet': { flagshipSlug: 'ethernet-switching-ip-networking', moduleSlug: 'ethernet-framing', courseCode: 'NV-C02' },
  'net-202-ipv4-subnetting': { flagshipSlug: 'ethernet-switching-ip-networking', moduleSlug: 'ipv4-subnetting', courseCode: 'NV-C02' },
  'net-301-vlan-switching': { flagshipSlug: 'ethernet-switching-ip-networking', moduleSlug: 'vlans-trunking', courseCode: 'NV-C02' },
  'net-301-switching-vlans': { flagshipSlug: 'ethernet-switching-ip-networking', moduleSlug: 'vlans-trunking', courseCode: 'NV-C02' },
  'net-302-spanning-tree': { flagshipSlug: 'ethernet-switching-ip-networking', moduleSlug: 'spanning-tree', courseCode: 'NV-C02' },

  // Level 2 / Transport & Routing
  'net-203-core-ip-services': { flagshipSlug: 'transport-routing-network-services', moduleSlug: 'core-ip-services', courseCode: 'NV-C03' },
  'net-204-transport-protocols': { flagshipSlug: 'transport-routing-network-services', moduleSlug: 'transport-protocols', courseCode: 'NV-C03' },
  'net-303-static-routing': { flagshipSlug: 'transport-routing-network-services', moduleSlug: 'static-routing', courseCode: 'NV-C03' },
  'net-304-dynamic-routing-ospf': { flagshipSlug: 'transport-routing-network-services', moduleSlug: 'dynamic-routing-ospf', courseCode: 'NV-C03' },

  // Level 3 / Security
  'net-305-acls-firewalls': { flagshipSlug: 'network-security-secure-connectivity', moduleSlug: 'acls-firewalls', courseCode: 'NV-C04' },
  'net-401-nat-pat': { flagshipSlug: 'network-security-secure-connectivity', moduleSlug: 'nat-pat', courseCode: 'NV-C04' },
  'net-401-bgp-routing': { flagshipSlug: 'network-security-secure-connectivity', moduleSlug: 'nat-pat', courseCode: 'NV-C04' },
  'net-402-vpn-crypto': { flagshipSlug: 'network-security-secure-connectivity', moduleSlug: 'vpn-crypto', courseCode: 'NV-C04' },

  // Level 4 / Engineering
  'net-403-network-automation': { flagshipSlug: 'network-engineering-automation-troubleshooting', moduleSlug: 'network-automation', courseCode: 'NV-C05' },
  'net-404-packet-analysis': { flagshipSlug: 'network-engineering-automation-troubleshooting', moduleSlug: 'packet-analysis', courseCode: 'NV-C05' },
};

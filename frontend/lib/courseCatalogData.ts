export interface FallbackLesson {
  id: string;
  slug: string;
  title: string;
  type: 'LESSON' | 'LAB' | 'QUIZ';
  durationMinutes: number;
  completed?: boolean;
  score?: number | null;
  contentMarkdown?: string;
  visualType?: string;
  labConfig?: any;
}

export interface FallbackModule {
  id: string;
  title: string;
  description: string;
  lessons: FallbackLesson[];
}

export interface FallbackCourse {
  id: string;
  code: string;
  slug: string;
  title: string;
  tagline: string;
  category: string;
  description: string;
  level: 'FOUNDATIONAL' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  icon: string;
  estimatedHours: number;
  lessonsCount: number;
  labsCount: number;
  prerequisites: string[];
  modules: FallbackModule[];
  progressPercent?: number;
  isLocked?: boolean;
}

export const FALLBACK_COURSES: FallbackCourse[] = [
  {
    id: 'course-net-101',
    code: 'NET-101',
    slug: 'net-101-digital-foundations',
    title: 'Computer & Digital Information Foundations',
    tagline: 'Master bits, bytes, binary arithmetic, hexadecimal notation, and computer hardware components.',
    category: 'Foundations',
    description: 'Zero-prerequisite foundation course covering binary numbers, hexadecimal conversion, CPU/RAM/NIC hardware architecture, and terminal navigation.',
    level: 'FOUNDATIONAL',
    icon: 'Binary',
    estimatedHours: 4,
    lessonsCount: 6,
    labsCount: 4,
    prerequisites: [],
    modules: [
      {
        id: 'mod-101-1',
        title: 'Module 1: Digital Representation & Binary Arithmetic',
        description: 'Understand how digital data is represented in binary bits, hex bytes, and hardware interfaces.',
        lessons: [
          {
            id: 'les-101-1-1',
            slug: 'intro-to-binary-and-hex',
            title: '1.1 Binary Bits, Bytes & Hexadecimal Notation',
            type: 'LESSON',
            durationMinutes: 15,
            contentMarkdown: `# Binary & Hexadecimal Foundations\n\nAll digital computer networks transmit discrete electrical or optical pulses representing binary 0s and 1s...`,
          },
          {
            id: 'les-101-1-2',
            slug: 'binary-arithmetic-lab',
            title: '1.2 Hands-On Binary Conversion & Bitwise Math',
            type: 'LAB',
            durationMinutes: 20,
            contentMarkdown: `# Interactive Bitwise Laboratory\n\nPractice bitwise AND/OR masks used in IPv4 subnet calculation...`,
          },
          {
            id: 'les-101-1-3',
            slug: 'hardware-nic-cpu-bus',
            title: '1.3 Network Interface Cards (NIC), CPU & Memory Buffers',
            type: 'LESSON',
            durationMinutes: 20,
          },
          {
            id: 'les-101-1-4',
            slug: 'foundations-knowledge-quiz',
            title: '1.4 Digital Foundations Knowledge Check Quiz',
            type: 'QUIZ',
            durationMinutes: 15,
          }
        ]
      }
    ]
  },
  {
    id: 'course-net-102',
    code: 'NET-102',
    slug: 'net-102-network-fundamentals',
    title: 'Network Fundamentals & Telecommunications',
    tagline: 'Understand connected systems, network boundaries, topology geometry, and transmission media.',
    category: 'Foundations',
    description: 'Foundational introduction to local networks, wide area networks, topology arrangements, and transmission media.',
    level: 'FOUNDATIONAL',
    icon: 'Network',
    estimatedHours: 5,
    lessonsCount: 8,
    labsCount: 5,
    prerequisites: ['NET-101'],
    modules: [
      {
        id: 'mod-102-1',
        title: 'Module 1: Interconnected Nodes & Physical Topologies',
        description: 'Learn how hosts connect across star, mesh, and bus topologies.',
        lessons: [
          {
            id: 'les-102-1-1',
            slug: 'topologies-star-mesh-bus',
            title: '1.1 Physical Topologies: Star, Mesh, Ring & Bus',
            type: 'LESSON',
            durationMinutes: 20,
          },
          {
            id: 'les-102-1-2',
            slug: 'transmission-media-copper-fiber',
            title: '1.2 Physical Media: UTP Copper, Single-Mode & Multi-Mode Fiber',
            type: 'LESSON',
            durationMinutes: 25,
          },
          {
            id: 'les-102-1-3',
            slug: 'bandwidth-latency-throughput',
            title: '1.3 Bandwidth vs Latency vs Throughput vs Jitter',
            type: 'LAB',
            durationMinutes: 25,
          }
        ]
      }
    ]
  },
  {
    id: 'course-net-103',
    code: 'NET-103',
    slug: 'net-103-reference-models',
    title: 'The OSI & TCP/IP Reference Models',
    tagline: 'Master the 7-layer OSI model and 4-layer TCP/IP architectural frameworks.',
    category: 'Foundations',
    description: 'Deep architectural exploration of layered networking, protocol data units (PDUs), and data encapsulation.',
    level: 'FOUNDATIONAL',
    icon: 'Layers',
    estimatedHours: 5,
    lessonsCount: 7,
    labsCount: 4,
    prerequisites: ['NET-102'],
    modules: [
      {
        id: 'mod-103-1',
        title: 'Module 1: Architectural Layering & Data Encapsulation',
        description: 'Master the 7 layers of OSI and 4 layers of TCP/IP protocol suites.',
        lessons: [
          {
            id: 'les-103-1-1',
            slug: 'osi-7-layer-architecture',
            title: '1.1 The 7-Layer OSI Model Architecture',
            type: 'LESSON',
            durationMinutes: 20,
          },
          {
            id: 'les-103-1-2',
            slug: 'encapsulation-headers-pdu',
            title: '1.2 Protocol Data Units (PDU) & Encapsulation Flow',
            type: 'LAB',
            durationMinutes: 30,
          }
        ]
      }
    ]
  },
  {
    id: 'course-net-201',
    code: 'NET-201',
    slug: 'net-201-layer2-ethernet',
    title: 'Layer 2 Ethernet & Switching Frameworks',
    tagline: 'Master Ethernet 802.3 framing, MAC addressing, OUI structure, and Layer 2 switching.',
    category: 'Switching',
    description: 'Detailed study of Ethernet frames, MAC address tables, collision domains, and physical layer cables.',
    level: 'BEGINNER',
    icon: 'Cpu',
    estimatedHours: 6,
    lessonsCount: 8,
    labsCount: 6,
    prerequisites: ['NET-103'],
    modules: [
      {
        id: 'mod-201-1',
        title: 'Module 1: Ethernet Framing & MAC Addressing',
        description: 'Understand physical hardware identity, MAC tables, and Ethernet frame headers.',
        lessons: [
          {
            id: 'les-201-1-1',
            slug: 'ethernet-frame-fcs-crc32',
            title: '1.1 Ethernet II Frame Header, Preamble & CRC32 FCS',
            type: 'LESSON',
            durationMinutes: 20,
          },
          {
            id: 'les-201-1-2',
            slug: 'cam-mac-learning-table',
            title: '1.2 Switch Forwarding & CAM / MAC Learning Table Lab',
            type: 'LAB',
            durationMinutes: 30,
          }
        ]
      }
    ]
  },
  {
    id: 'course-net-202',
    code: 'NET-202',
    slug: 'net-202-ipv4-subnetting',
    title: 'IPv4 Addressing & CIDR Subnetting Mastery',
    tagline: 'Master 32-bit IPv4 structure, subnet masks, CIDR notation, and VLSM network partitioning.',
    category: 'Routing',
    description: 'Comprehensive guide to IPv4 binary structure, network vs host boundaries, CIDR slash notation, and subnetting calculations.',
    level: 'BEGINNER',
    icon: 'Globe',
    estimatedHours: 8,
    lessonsCount: 10,
    labsCount: 8,
    prerequisites: ['NET-101', 'NET-103'],
    modules: [
      {
        id: 'mod-202-1',
        title: 'Module 1: IPv4 Structure & Subnetting Mechanics',
        description: 'Master IPv4 octets, subnet masks, wildcard masks, and CIDR network calculations.',
        lessons: [
          {
            id: 'les-202-1-1',
            slug: 'ipv4-header-and-classes',
            title: '1.1 32-Bit IPv4 Header Structure & Classful History',
            type: 'LESSON',
            durationMinutes: 20,
          },
          {
            id: 'les-202-1-2',
            slug: 'vlsm-cidr-subnet-calculator',
            title: '1.2 VLSM & CIDR Subnet Allocation Laboratory',
            type: 'LAB',
            durationMinutes: 35,
          }
        ]
      }
    ]
  },
  {
    id: 'course-net-301',
    code: 'NET-301',
    slug: 'net-301-vlan-switching',
    title: 'VLANs, 802.1Q Trunking & Spanning Tree (STP)',
    tagline: 'Isolate broadcast domains with 802.1Q tags and prevent bridge loops with STP / RSTP.',
    category: 'Switching',
    description: 'Master enterprise Layer 2 segmentation, 802.1Q trunking, inter-VLAN routing, and Spanning Tree loop prevention.',
    level: 'INTERMEDIATE',
    icon: 'Layers',
    estimatedHours: 10,
    lessonsCount: 12,
    labsCount: 9,
    prerequisites: ['NET-201'],
    modules: [
      {
        id: 'mod-301-1',
        title: 'Module 1: Enterprise VLANs & STP Convergence',
        description: 'Segment traffic across trunk links and eliminate loop conditions.',
        lessons: [
          {
            id: 'les-301-1-1',
            slug: 'vlan-8021q-tagging',
            title: '1.1 802.1Q VLAN Tagging & Native VLAN Security',
            type: 'LESSON',
            durationMinutes: 25,
          },
          {
            id: 'les-301-1-2',
            slug: 'spanning-tree-convergence',
            title: '1.2 Spanning Tree (STP) Root Bridge Election Lab',
            type: 'LAB',
            durationMinutes: 35,
          }
        ]
      }
    ]
  },
  {
    id: 'course-net-401',
    code: 'NET-401',
    slug: 'net-401-bgp-routing',
    title: 'Autonomous Systems & BGP Cloud Interconnect',
    tagline: 'Deep-dive into multi-hop BGP, autonomous systems, overlay networks, and path vector policies.',
    category: 'Routing',
    description: 'Enterprise & carrier routing with Border Gateway Protocol (BGP), AS path attributes, route maps, and multi-cloud interconnect.',
    level: 'ADVANCED',
    icon: 'Shield',
    estimatedHours: 14,
    lessonsCount: 14,
    labsCount: 12,
    prerequisites: ['NET-202', 'NET-301'],
    modules: [
      {
        id: 'mod-401-1',
        title: 'Module 1: Border Gateway Protocol & Global Routing',
        description: 'Configure BGP peering, prefix filtering, and autonomous system policies.',
        lessons: [
          {
            id: 'les-401-1-1',
            slug: 'bgp-path-vector-attributes',
            title: '1.1 Path Vector Architecture & BGP Attributes',
            type: 'LESSON',
            durationMinutes: 30,
          },
          {
            id: 'les-401-1-2',
            slug: 'ebgp-ibgp-peering-lab',
            title: '1.2 Multi-AS eBGP / iBGP Route Peering Lab',
            type: 'LAB',
            durationMinutes: 45,
          }
        ]
      }
    ]
  }
];

export function getFallbackTopicDetail(slug: string): FallbackCourse {
  const clean = slug.toLowerCase().trim();
  const found = FALLBACK_COURSES.find(
    (c) => c.slug === clean || c.code.toLowerCase() === clean || clean.includes(c.code.toLowerCase())
  );
  return found || FALLBACK_COURSES[0];
}

export function getFallbackLessonDetail(lessonSlug: string): FallbackLesson {
  for (const course of FALLBACK_COURSES) {
    for (const mod of course.modules) {
      const lesson = mod.lessons.find((l) => l.slug === lessonSlug);
      if (lesson) return lesson;
    }
  }
  return FALLBACK_COURSES[0].modules[0].lessons[0];
}

// Auto-generated canonical mapping from Owner's CS-221 Textbook to NetVision Curriculum
export interface LessonTextbookMapping {
  lessonSlug: string;
  lessonTitle: string;
  courseCode: string;
  courseTitle: string;
  moduleId: string;
  moduleTitle: string;
  textbookChapterNumber: number;
  textbookChapterTitle: string;
  sectionReference: string;
  sourceVersion: string;
  sourceContentHash: string;
  standardsRefs: string[];
  learningObjectives: string[];
  prerequisiteConcepts: string[];
  assessmentLinkage: string;
}

export const CANONICAL_TEXTBOOK_MAPPING: LessonTextbookMapping[] = [
  {
    "lessonSlug": "level-0-what-is-a-computer-network",
    "lessonTitle": "What is a Computer Network?",
    "courseCode": "NV-C01",
    "courseTitle": "Foundations & Network Architecture",
    "moduleId": "mod-c01-digital-representation",
    "moduleTitle": "Module 1: Digital Representation & Hardware Architecture",
    "textbookChapterNumber": 1,
    "textbookChapterTitle": "MODULE 1 — NETWORKING FUNDAMENTALS",
    "sectionReference": "1.1 What Is Data Communication? & 1.3 Computer Networks",
    "sourceVersion": "2026.1-ch01",
    "sourceContentHash": "ch01-net-fund",
    "standardsRefs": [
      "ISO/IEC 7498-1",
      "IEEE 802 Overview"
    ],
    "learningObjectives": [
      "Define the 5 fundamental components of data communications (Sender, Receiver, Transmission Medium, Message, Protocol).",
      "Differentiate between Simplex, Half-Duplex, and Full-Duplex transmission modes.",
      "Explain network performance, reliability, and security criteria in enterprise computing."
    ],
    "prerequisiteConcepts": [
      "Binary data representation",
      "Basic computing hardware"
    ],
    "assessmentLinkage": "quiz-level-0-what-is-a-computer-network"
  },
  {
    "lessonSlug": "net-101-bits-bytes-digital-representation",
    "lessonTitle": "Digital Information Representation: Bits, Bytes & Network Sizing",
    "courseCode": "NV-C01",
    "courseTitle": "Foundations & Network Architecture",
    "moduleId": "mod-c01-digital-representation",
    "moduleTitle": "Module 1: Digital Representation & Hardware Architecture",
    "textbookChapterNumber": 0,
    "textbookChapterTitle": "MODULE 0 — PREREQUISITES & BINARY FOUNDATIONS",
    "sectionReference": "0.2 Bits and Bytes, 0.3 Number Systems, 0.4 Basic Binary Skills",
    "sourceVersion": "2026.1-ch00",
    "sourceContentHash": "ch00-binary-skills",
    "standardsRefs": [
      "IEC 80000-13 (Prefixes for binary information)"
    ],
    "learningObjectives": [
      "Master base-2 binary, base-10 decimal, and base-16 hexadecimal conversions for network addressing.",
      "Accurately calculate network throughput and data transmission duration avoiding bit (b) vs Byte (B) traps.",
      "Manipulate 8-bit octets and 4-bit nibbles required for IPv4 and IPv6 subnetting."
    ],
    "prerequisiteConcepts": [
      "Basic arithmetic",
      "Powers of 2"
    ],
    "assessmentLinkage": "quiz-net-101-bits-bytes-digital-representation"
  },
  {
    "lessonSlug": "level-0-devices-in-a-network",
    "lessonTitle": "Devices in a Network: Hardware Roles & Layer Mapping",
    "courseCode": "NV-C01",
    "courseTitle": "Foundations & Network Architecture",
    "moduleId": "mod-c01-digital-representation",
    "moduleTitle": "Module 1: Digital Representation & Hardware Architecture",
    "textbookChapterNumber": 12,
    "textbookChapterTitle": "MODULE 12 — NETWORKING DEVICES",
    "sectionReference": "12.1-12.8 Hardware & Device Matrix: Repeaters, Hubs, Switches, Routers, Modems, Firewalls",
    "sourceVersion": "2026.1-ch12",
    "sourceContentHash": "ch12-net-devices",
    "standardsRefs": [
      "IEEE 802.3",
      "IEEE 802.11"
    ],
    "learningObjectives": [
      "Categorize core network hardware (Hubs, Switches, Routers, Firewalls, Access Points) by their primary OSI operating layer.",
      "Explain collision domain and broadcast domain boundaries established by Layer 1, Layer 2, and Layer 3 devices.",
      "Identify the hardware functions of Network Interface Cards (NICs), transceivers, and default gateways."
    ],
    "prerequisiteConcepts": [
      "Data communication components",
      "OSI layered hierarchy"
    ],
    "assessmentLinkage": "quiz-level-0-devices-in-a-network"
  },
  {
    "lessonSlug": "level-0-client-and-server-architecture",
    "lessonTitle": "Client and Server Architecture: Centralized Services vs Distributed Hosts",
    "courseCode": "NV-C01",
    "courseTitle": "Foundations & Network Architecture",
    "moduleId": "mod-c01-digital-representation",
    "moduleTitle": "Module 1: Digital Representation & Hardware Architecture",
    "textbookChapterNumber": 23,
    "textbookChapterTitle": "MODULE 23 — APPLICATION LAYER",
    "sectionReference": "23.1 Client-Server vs Peer-to-Peer Architecture",
    "sourceVersion": "2026.1-ch23",
    "sourceContentHash": "ch23-client-server",
    "standardsRefs": [
      "RFC 9110 (HTTP Semantics)"
    ],
    "learningObjectives": [
      "Contrast Client-Server centralized architectures with decentralized Peer-to-Peer (P2P) systems.",
      "Explain the request-response paradigm and server resource listening sockets.",
      "Identify scalability challenges and load balancing in enterprise client-server applications."
    ],
    "prerequisiteConcepts": [
      "Network communication components",
      "Socket basics"
    ],
    "assessmentLinkage": "quiz-level-0-client-and-server-architecture"
  },
  {
    "lessonSlug": "level-0-lan-wan-internet-boundaries",
    "lessonTitle": "LAN, WAN & Internet Boundaries: Network Scale & Geographic Topologies",
    "courseCode": "NV-C01",
    "courseTitle": "Foundations & Network Architecture",
    "moduleId": "mod-c01-digital-representation",
    "moduleTitle": "Module 1: Digital Representation & Hardware Architecture",
    "textbookChapterNumber": 1,
    "textbookChapterTitle": "MODULE 1 — NETWORKING FUNDAMENTALS",
    "sectionReference": "1.4 Network Types & Geography (PAN, LAN, WLAN, MAN, WAN, Internet, Intranet, Extranet)",
    "sourceVersion": "2026.1-ch01",
    "sourceContentHash": "ch01-lan-wan",
    "standardsRefs": [
      "IEEE 802.3",
      "ITU-T WAN Recommendations"
    ],
    "learningObjectives": [
      "Classify networks by geographic scope: PAN, LAN, WLAN, MAN, and WAN.",
      "Define administrative boundaries: Intranet (internal), Extranet (partner), and Public Internet.",
      "Explain ISP transit hierarchies: Tier 1 Global Transits, Tier 2 Regional ISPs, and Internet Exchange Points (IXPs)."
    ],
    "prerequisiteConcepts": [
      "Data communication basics",
      "Network devices"
    ],
    "assessmentLinkage": "quiz-level-0-lan-wan-internet-boundaries"
  },
  {
    "lessonSlug": "net-102-network-performance",
    "lessonTitle": "Network Performance Metrics: Comprehensive Quality of Service & SLA Verification",
    "courseCode": "NV-C01",
    "courseTitle": "Foundations & Network Architecture",
    "moduleId": "mod-c01-network-topologies",
    "moduleTitle": "Module 3: Network Topologies & Performance Engineering",
    "textbookChapterNumber": 1,
    "textbookChapterTitle": "MODULE 1 — NETWORKING FUNDAMENTALS",
    "sectionReference": "1.7 Network Performance Metrics (Bandwidth, Throughput, Latency, Jitter, Packet Loss)",
    "sourceVersion": "2026.1-ch01",
    "sourceContentHash": "ch01-perf-metrics",
    "standardsRefs": [
      "RFC 2544",
      "ITU-T Y.1540"
    ],
    "learningObjectives": [
      "Measure and audit enterprise network SLAs across bandwidth, latency, jitter, and packet loss.",
      "Calculate goodput vs raw line throughput accounting for protocol overheads.",
      "Interpret synthetic traffic injection and jitter buffer telemetry."
    ],
    "prerequisiteConcepts": [
      "Bandwidth and latency",
      "Packet transmission"
    ],
    "assessmentLinkage": "quiz-net-102-network-performance"
  },
  {
    "lessonSlug": "net-101-copper-fiber-wireless-media",
    "lessonTitle": "Physical Layer Media: Copper (UTP/STP), Fiber Optics & RF Propagation",
    "courseCode": "NV-C01",
    "courseTitle": "Foundations & Network Architecture",
    "moduleId": "mod-c01-physical-media",
    "moduleTitle": "Module 2: Physical Layer Media & Signal Propagation",
    "textbookChapterNumber": 7,
    "textbookChapterTitle": "MODULE 7 — TRANSMISSION MEDIA",
    "sectionReference": "7.1 Guided Media (Twisted Pair, Coaxial, Fiber Optic) & 7.2 Unguided Media (RF, Microwave)",
    "sourceVersion": "2026.1-ch07",
    "sourceContentHash": "ch07-trans-media",
    "standardsRefs": [
      "TIA/EIA-568-C.2",
      "IEEE 802.3ba (40G/100G Ethernet)",
      "ITU-T G.652 (Single-mode fiber)"
    ],
    "learningObjectives": [
      "Compare Category 5e/6/6a/7 copper specifications, RJ-45 pinouts (T568A vs T568B), and crosstalk immunity.",
      "Differentiate Single-Mode Fiber (SMF) laser transmission from Multi-Mode Fiber (MMF) LED/VCSEL modal dispersion.",
      "Calculate optical and electrical signal attenuation over distance."
    ],
    "prerequisiteConcepts": [
      "Electromagnetic spectrum basics",
      "Signal amplitude and frequency"
    ],
    "assessmentLinkage": "quiz-net-101-copper-fiber-wireless-media"
  },
  {
    "lessonSlug": "network-topologies-overview",
    "lessonTitle": "Network Topologies: Physical Topologies, Logical Topologies & Redundancy",
    "courseCode": "NV-C01",
    "courseTitle": "Foundations & Network Architecture",
    "moduleId": "mod-c01-network-topologies",
    "moduleTitle": "Module 3: Network Topologies & Performance Engineering",
    "textbookChapterNumber": 1,
    "textbookChapterTitle": "MODULE 1 — NETWORKING FUNDAMENTALS",
    "sectionReference": "1.6 Network Topologies (Bus, Star, Ring, Mesh, Tree, Hybrid)",
    "sourceVersion": "2026.1-ch01",
    "sourceContentHash": "ch01-topologies",
    "standardsRefs": [
      "IEEE 802.3 Star-Wired Bus",
      "ANSI/TIA-942 Data Center Fabric"
    ],
    "learningObjectives": [
      "Analyze single points of failure (SPOF) and cabling complexities in Bus, Star, Ring, and Mesh topologies.",
      "Calculate total link requirements in a full-mesh topology using n(n-1)/2.",
      "Explain modern hybrid collapsed-core and spine-leaf topologies."
    ],
    "prerequisiteConcepts": [
      "Network devices",
      "Physical transmission cabling"
    ],
    "assessmentLinkage": "quiz-network-topologies-overview"
  },
  {
    "lessonSlug": "net-102-bandwidth-throughput-latency-jitter",
    "lessonTitle": "Network Performance Engineering: Bandwidth, Throughput, Latency & Jitter",
    "courseCode": "NV-C01",
    "courseTitle": "Foundations & Network Architecture",
    "moduleId": "mod-c01-network-topologies",
    "moduleTitle": "Module 3: Network Topologies & Performance Engineering",
    "textbookChapterNumber": 6,
    "textbookChapterTitle": "MODULE 6 — PHYSICAL LAYER & SIGNALS",
    "sectionReference": "1.7 Network Performance & 6.7 Theoretical Channel Capacity (Nyquist & Shannon)",
    "sourceVersion": "2026.1-ch06",
    "sourceContentHash": "ch06-phys-signals",
    "standardsRefs": [
      "RFC 2544 (Benchmarking Methodology for Network Interconnect Devices)",
      "ITU-T Y.1541"
    ],
    "learningObjectives": [
      "Quantify total end-to-end delay: Transmission Delay + Propagation Delay + Queuing Delay + Processing Delay.",
      "Apply Nyquist Maximum Bit Rate (2 * B * log2(V)) and Shannon Channel Capacity (B * log2(1 + SNR)) theorems.",
      "Diagnose packet jitter and bufferbloat in real-time multimedia communications."
    ],
    "prerequisiteConcepts": [
      "Data rates",
      "Propagation speed in copper/fiber"
    ],
    "assessmentLinkage": "quiz-net-102-bandwidth-throughput-latency-jitter"
  },
  {
    "lessonSlug": "level-0-network-protocols-standards",
    "lessonTitle": "Network Protocols & Standards: Syntax, Semantics & Standards Bodies",
    "courseCode": "NV-C01",
    "courseTitle": "Foundations & Network Architecture",
    "moduleId": "mod-c01-layered-reference-models",
    "moduleTitle": "Module 4: Layered Reference Models & Protocol Encapsulation",
    "textbookChapterNumber": 2,
    "textbookChapterTitle": "MODULE 2 — PROTOCOLS & LAYERED ARCHITECTURE",
    "sectionReference": "2.1 Protocols, 2.2 Standards Organizations (IETF, IEEE, ISO, ICANN, ITU-T)",
    "sourceVersion": "2026.1-ch02",
    "sourceContentHash": "ch02-protocols-stds",
    "standardsRefs": [
      "RFC 2026 (The Internet Standards Process)",
      "IETF RFC Architecture"
    ],
    "learningObjectives": [
      "Explain the three key elements of any protocol: Syntax, Semantics, and Timing.",
      "Trace the RFC publication lifecycle: Proposed Standard to Internet Standard (STD).",
      "Differentiate de jure standards from de facto industrial implementations."
    ],
    "prerequisiteConcepts": [
      "Network communication requirements"
    ],
    "assessmentLinkage": "quiz-level-0-network-protocols-standards"
  },
  {
    "lessonSlug": "osi-model-7-layers",
    "lessonTitle": "The 7-Layer OSI Reference Model: Theoretical Architecture & Service Primitives",
    "courseCode": "NV-C01",
    "courseTitle": "Foundations & Network Architecture",
    "moduleId": "mod-c01-layered-reference-models",
    "moduleTitle": "Module 4: Layered Reference Models & Protocol Encapsulation",
    "textbookChapterNumber": 3,
    "textbookChapterTitle": "MODULE 3 — THE OSI MODEL",
    "sectionReference": "3.1-3.7 Detailed Examination of Layers 1 through 7",
    "sourceVersion": "2026.1-ch03",
    "sourceContentHash": "ch03-osi-model",
    "standardsRefs": [
      "ISO/IEC 7498-1:1994 (Information technology — Open Systems Interconnection)"
    ],
    "learningObjectives": [
      "Define the functions, PDU terminology, addressing schemes, and protocols of all 7 OSI layers.",
      "Explain vertical service primitives (SAP - Service Access Points) and peer-to-peer virtual communications.",
      "Troubleshoot network anomalies by isolating root cause to specific OSI operational layers."
    ],
    "prerequisiteConcepts": [
      "Protocol layering philosophy"
    ],
    "assessmentLinkage": "quiz-osi-model-7-layers"
  },
  {
    "lessonSlug": "tcp-ip-4-layers",
    "lessonTitle": "The TCP/IP 4-Layer Architecture: Practical Implementation & Protocol Mapping",
    "courseCode": "NV-C01",
    "courseTitle": "Foundations & Network Architecture",
    "moduleId": "mod-c01-layered-reference-models",
    "moduleTitle": "Module 4: Layered Reference Models & Protocol Encapsulation",
    "textbookChapterNumber": 4,
    "textbookChapterTitle": "MODULE 4 — THE TCP/IP PROTOCOL SUITE",
    "sectionReference": "4.1 Four-Layer DoD Architecture & 5.1 PDUs & Encapsulation/Decapsulation",
    "sourceVersion": "2026.1-ch04",
    "sourceContentHash": "ch04-tcpip-suite",
    "standardsRefs": [
      "RFC 1122 (Requirements for Internet Hosts — Communication Layers)"
    ],
    "learningObjectives": [
      "Map TCP/IP's 4 layers (Network Access, Internet, Transport, Application) to OSI's 7 layers.",
      "Trace complete encapsulation: Data -> Segment -> Packet -> Frame -> Bits.",
      "Explain hop-by-hop MAC rewriting vs end-to-end IP preservation across routing boundaries."
    ],
    "prerequisiteConcepts": [
      "OSI reference model"
    ],
    "assessmentLinkage": "quiz-tcp-ip-4-layers"
  },
  {
    "lessonSlug": "level-0-mac-addresses-physical-identity",
    "lessonTitle": "MAC Addresses & Physical Hardware Identity",
    "courseCode": "NV-C02",
    "courseTitle": "Ethernet, Switching & IP Networking",
    "moduleId": "mod-c02-ethernet-framing",
    "moduleTitle": "Module 1: Layer 2 Ethernet Framing & MAC Tables",
    "textbookChapterNumber": 9,
    "textbookChapterTitle": "MODULE 9 — DATA LINK LAYER",
    "sectionReference": "9.2 MAC Addressing (48-bit hex format, OUI vs NIC, Unicast, Multicast, Broadcast)",
    "sourceVersion": "2026.1-ch09",
    "sourceContentHash": "ch09-mac-addressing",
    "standardsRefs": [
      "IEEE 802-2014 (Standard for Local and Metropolitan Area Networks)"
    ],
    "learningObjectives": [
      "Dissect the 48-bit IEEE MAC address into 24-bit OUI (Organizationally Unique Identifier) and 24-bit NIC extension.",
      "Identify the I/G (Individual/Group) and U/L (Universal/Local) bits in the first octet of a MAC address.",
      "Differentiate Unicast, Multicast (01:00:5E / 33:33), and Broadcast (FF:FF:FF:FF:FF:FF) Ethernet transmission."
    ],
    "prerequisiteConcepts": [
      "Hexadecimal number system",
      "Network Interface Cards"
    ],
    "assessmentLinkage": "quiz-level-0-mac-addresses-physical-identity"
  },
  {
    "lessonSlug": "ethernet-mac-addresses-overview",
    "lessonTitle": "Ethernet II Framing, Frame Formats & Transmission Mechanics",
    "courseCode": "NV-C02",
    "courseTitle": "Ethernet, Switching & IP Networking",
    "moduleId": "mod-c02-ethernet-framing",
    "moduleTitle": "Module 1: Layer 2 Ethernet Framing & MAC Tables",
    "textbookChapterNumber": 11,
    "textbookChapterTitle": "MODULE 11 — ETHERNET & SWITCHED LANs",
    "sectionReference": "11.1 Ethernet II Frame Structure & 9.3 Error Detection (CRC-32 FCS)",
    "sourceVersion": "2026.1-ch11",
    "sourceContentHash": "ch11-ethernet-framing",
    "standardsRefs": [
      "IEEE 802.3-2022",
      "DIX Ethernet II Specification"
    ],
    "learningObjectives": [
      "Deconstruct the Ethernet II frame: 7-byte Preamble, 1-byte SFD, 6-byte Dest MAC, 6-byte Source MAC, 2-byte EtherType (0x0800, 0x86DD, 0x0806), Payload, and 4-byte FCS.",
      "Calculate minimum (64 bytes) and maximum (1518 bytes) Ethernet frame sizes, explaining runt and giant frames.",
      "Validate frame integrity using CRC-32 polynomial division."
    ],
    "prerequisiteConcepts": [
      "MAC addressing",
      "Bit error detection"
    ],
    "assessmentLinkage": "quiz-ethernet-mac-addresses-overview"
  },
  {
    "lessonSlug": "level-0-switches-local-lan-forwarders",
    "lessonTitle": "Switches: Local LAN Frame Forwarders & MAC Address Tables",
    "courseCode": "NV-C02",
    "courseTitle": "Ethernet, Switching & IP Networking",
    "moduleId": "mod-c02-vlans-trunking",
    "moduleTitle": "Module 2: Enterprise Switching, VLANs & 802.1Q Trunking",
    "textbookChapterNumber": 10,
    "textbookChapterTitle": "MODULE 10 — SWITCHING",
    "sectionReference": "10.2 Packet Switching & 11.2 Switch Operation (Learn, Filter, Forward, Flood)",
    "sourceVersion": "2026.1-ch10",
    "sourceContentHash": "ch10-switching-core",
    "standardsRefs": [
      "IEEE 802.1D MAC Bridges"
    ],
    "learningObjectives": [
      "Trace the switch MAC address table population lifecycle: Source MAC learning on ingress port.",
      "Explain Forwarding, Filtering, and Unknown Unicast Flooding mechanics.",
      "Compare Store-and-Forward, Cut-Through, and Fragment-Free switching latencies."
    ],
    "prerequisiteConcepts": [
      "Ethernet frames",
      "Collision domains"
    ],
    "assessmentLinkage": "quiz-level-0-switches-local-lan-forwarders"
  },
  {
    "lessonSlug": "switching-vlans-overview",
    "lessonTitle": "Switching, VLANs & IEEE 802.1Q Enterprise Trunking",
    "courseCode": "NV-C02",
    "courseTitle": "Ethernet, Switching & IP Networking",
    "moduleId": "mod-c02-vlans-trunking",
    "moduleTitle": "Module 2: Enterprise Switching, VLANs & 802.1Q Trunking",
    "textbookChapterNumber": 13,
    "textbookChapterTitle": "MODULE 13 — VLANs & STP",
    "sectionReference": "13.1 VLANs, 13.2 802.1Q Trunking & VLAN Tagging, 13.3 Inter-VLAN Routing",
    "sourceVersion": "2026.1-ch13",
    "sourceContentHash": "ch13-vlans-trunking",
    "standardsRefs": [
      "IEEE 802.1Q-2022 (Bridges and Bridged Networks — VLAN Tagging)"
    ],
    "learningObjectives": [
      "Isolate broadcast domains using Layer 2 Virtual Local Area Networks (VLANs 1-4094).",
      "Deconstruct the 4-byte 802.1Q tag: TPID (0x8100), Priority Code Point (PCP), Drop Eligible Indicator (DEI), and 12-bit VLAN ID (VID).",
      "Configure and verify Router-on-a-Stick (subinterfaces with 802.1Q encapsulation) and Layer 3 Switch SVIs (Switch Virtual Interfaces)."
    ],
    "prerequisiteConcepts": [
      "Switch MAC learning",
      "Broadcast domain isolation"
    ],
    "assessmentLinkage": "quiz-switching-vlans-overview"
  },
  {
    "lessonSlug": "net-302-spanning-tree-protocol-loop-prevention",
    "lessonTitle": "Spanning Tree Protocol (STP) & Layer-2 Loop Prevention",
    "courseCode": "NV-C02",
    "courseTitle": "Ethernet, Switching & IP Networking",
    "moduleId": "mod-c02-spanning-tree",
    "moduleTitle": "Module 3: Spanning Tree Protocol & Switch Redundancy",
    "textbookChapterNumber": 13,
    "textbookChapterTitle": "MODULE 13 — VLANs & STP",
    "sectionReference": "13.4 Spanning Tree Protocol (802.1D STP, Root Bridge election, Port roles/states, RSTP 802.1w)",
    "sourceVersion": "2026.1-ch13",
    "sourceContentHash": "ch13-stp-loops",
    "standardsRefs": [
      "IEEE 802.1D-2004",
      "IEEE 802.1w (Rapid Spanning Tree)",
      "IEEE 802.1s (MSTP)"
    ],
    "learningObjectives": [
      "Explain Layer 2 loop catastrophes: Broadcast storms, Multiple frame copies, and MAC table flapping.",
      "Determine the Root Bridge, Root Ports, Designated Ports, and Alternate/Blocking Ports using Bridge Protocol Data Units (BPDUs).",
      "Analyze RSTP 802.1w state convergence (Discarding, Learning, Forwarding) and protect edge ports with PortFast and BPDU Guard."
    ],
    "prerequisiteConcepts": [
      "Switch forwarding",
      "Ethernet frame flooding"
    ],
    "assessmentLinkage": "quiz-net-302-spanning-tree-protocol-loop-prevention"
  },
  {
    "lessonSlug": "net-202-ipv4-addressing-cidr",
    "lessonTitle": "IPv4 Addressing, Subnet Masks & CIDR Subnetting",
    "courseCode": "NV-C02",
    "courseTitle": "Ethernet, Switching & IP Networking",
    "moduleId": "mod-c02-ipv4-subnetting",
    "moduleTitle": "Module 4: IPv4 Addressing & CIDR Subnetting Mastery",
    "textbookChapterNumber": 14,
    "textbookChapterTitle": "MODULE 14 — IPv4",
    "sectionReference": "14.1 32-bit Address Structure & 15.1 Subnet Masks (/8 through /30)",
    "sourceVersion": "2026.1-ch14",
    "sourceContentHash": "ch14-ipv4-foundations",
    "standardsRefs": [
      "RFC 791 (Internet Protocol)",
      "RFC 1519 (Classless Inter-Domain Routing: an Address Assignment and Aggregation Strategy)"
    ],
    "learningObjectives": [
      "Deconstruct 32-bit IPv4 addresses into dotted-decimal notation, network bits, and host bits.",
      "Perform binary ANDing operations between destination IP and subnet mask to determine target subnet ID.",
      "Calculate Network ID, First Usable IP, Last Usable IP, Broadcast ID, and Total Usable Hosts (2^h - 2) for any prefix length /1 to /30."
    ],
    "prerequisiteConcepts": [
      "Binary arithmetic",
      "Powers of 2"
    ],
    "assessmentLinkage": "quiz-net-202-ipv4-addressing-cidr"
  },
  {
    "lessonSlug": "level-0-ip-addresses-logical-location",
    "lessonTitle": "Special-Use IPv4 Ranges & Enterprise Allocation",
    "courseCode": "NV-C02",
    "courseTitle": "Ethernet, Switching & IP Networking",
    "moduleId": "mod-c02-ipv4-subnetting",
    "moduleTitle": "Module 4: IPv4 Addressing & CIDR Subnetting Mastery",
    "textbookChapterNumber": 14,
    "textbookChapterTitle": "MODULE 14 — IPv4",
    "sectionReference": "14.3 Special IPv4 Addresses (RFC 1918 Private, APIPA 169.254.0.0/16, Loopback 127.0.0.0/8, 0.0.0.0)",
    "sourceVersion": "2026.1-ch14",
    "sourceContentHash": "ch14-special-ranges",
    "standardsRefs": [
      "RFC 1918 (Address Allocation for Private Internets)",
      "RFC 3927 (Dynamic Configuration of IPv4 Link-Local Addresses)",
      "RFC 5735"
    ],
    "learningObjectives": [
      "Identify the three RFC 1918 private address ranges: 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16.",
      "Diagnose APIPA self-assigned addresses (169.254.0.0/16) as symptomatic of DHCP lease failure.",
      "Explain the operational roles of 127.0.0.1 (Loopback), 0.0.0.0 (Quad-Zero default), and 255.255.255.255 (Limited Broadcast)."
    ],
    "prerequisiteConcepts": [
      "IPv4 address notation",
      "Client IP configuration"
    ],
    "assessmentLinkage": "quiz-level-0-ip-addresses-logical-location"
  },
  {
    "lessonSlug": "ip-addressing-ipv4-overview",
    "lessonTitle": "Classful IPv4 History & The Architectural Necessity of CIDR",
    "courseCode": "NV-C02",
    "courseTitle": "Ethernet, Switching & IP Networking",
    "moduleId": "mod-c02-ipv4-subnetting",
    "moduleTitle": "Module 4: IPv4 Addressing & CIDR Subnetting Mastery",
    "textbookChapterNumber": 14,
    "textbookChapterTitle": "MODULE 14 — IPv4",
    "sectionReference": "14.2 Historical Classful Addressing (Class A, B, C, D, E) vs CIDR",
    "sourceVersion": "2026.1-ch14",
    "sourceContentHash": "ch14-classful-history",
    "standardsRefs": [
      "RFC 791",
      "RFC 1519"
    ],
    "learningObjectives": [
      "Describe the leading-bit boundaries of Class A (0...), Class B (10...), Class C (110...), Class D (1110... Multicast), and Class E (1111... Experimental).",
      "Explain how classful routing caused catastrophic address waste and global routing table explosion by 1993.",
      "Demonstrate how CIDR variable prefix boundaries and supernetting stabilized Internet routing growth."
    ],
    "prerequisiteConcepts": [
      "Subnet masking",
      "Routing table concepts"
    ],
    "assessmentLinkage": "quiz-ip-addressing-ipv4-overview"
  },
  {
    "lessonSlug": "subnetting-cidr-overview",
    "lessonTitle": "VLSM Design & Multi-Department Address Allocation",
    "courseCode": "NV-C02",
    "courseTitle": "Ethernet, Switching & IP Networking",
    "moduleId": "mod-c02-ipv4-subnetting",
    "moduleTitle": "Module 4: IPv4 Addressing & CIDR Subnetting Mastery",
    "textbookChapterNumber": 15,
    "textbookChapterTitle": "MODULE 15 — SUBNET MASKS & CIDR",
    "sectionReference": "15.2 Variable-Length Subnet Masking (VLSM) & Module 38 Subnetting Master Class",
    "sourceVersion": "2026.1-ch15",
    "sourceContentHash": "ch15-vlsm-masterclass",
    "standardsRefs": [
      "RFC 1878 (Variable Length Subnet Table For IPv4)",
      "RFC 4632"
    ],
    "learningObjectives": [
      "Execute Variable Length Subnet Masking (VLSM) hierarchical address planning allocating largest host requirements first.",
      "Design optimal subnets for point-to-point router WAN links using /30 or /31 (RFC 3021) masks.",
      "Summarize contiguous subnets into a single CIDR route prefix without introducing routing blackholes."
    ],
    "prerequisiteConcepts": [
      "Subnet mask binary math",
      "Host calculation (2^h - 2)"
    ],
    "assessmentLinkage": "quiz-subnetting-cidr-overview"
  },
  {
    "lessonSlug": "level-0-dns-internet-phonebook",
    "lessonTitle": "Domain Name System (DNS) & Name Resolution Architecture",
    "courseCode": "NV-C03",
    "courseTitle": "Transport, Routing & Network Services",
    "moduleId": "mod-c03-core-ip-services",
    "moduleTitle": "Module 1: Core IP Infrastructure Services",
    "textbookChapterNumber": 17,
    "textbookChapterTitle": "MODULE 17 — ARP, ICMP, DHCP, DNS & NAT",
    "sectionReference": "17.4 Domain Name System (DNS Hierarchy, Resolvers, Root Servers, TLDs, Resource Records)",
    "sourceVersion": "2026.1-ch17",
    "sourceContentHash": "ch17-dns-architecture",
    "standardsRefs": [
      "RFC 1034 (Domain Names — Concepts and Facilities)",
      "RFC 1035 (Domain Names — Implementation and Specification)"
    ],
    "learningObjectives": [
      "Trace the hierarchical DNS tree: Root (.), TLD (.com, .org), Authoritative Nameservers.",
      "Differentiate Recursive query resolution from Iterative referral chains.",
      "Identify resource record types: A (IPv4), AAAA (IPv6), CNAME (Alias), MX (Mail), NS (Nameserver), TXT/SPF."
    ],
    "prerequisiteConcepts": [
      "Client-Server model",
      "IP addressing"
    ],
    "assessmentLinkage": "quiz-level-0-dns-internet-phonebook"
  },
  {
    "lessonSlug": "level-0-dhcp-automatic-ip-allocation",
    "lessonTitle": "Dynamic Host Configuration Protocol (DHCP) & IP Leasing",
    "courseCode": "NV-C03",
    "courseTitle": "Transport, Routing & Network Services",
    "moduleId": "mod-c03-core-ip-services",
    "moduleTitle": "Module 1: Core IP Infrastructure Services",
    "textbookChapterNumber": 17,
    "textbookChapterTitle": "MODULE 17 — ARP, ICMP, DHCP, DNS & NAT",
    "sectionReference": "17.3 Dynamic Host Configuration Protocol (DHCP DORA Process, Scopes, Lease Times, Relay Agents)",
    "sourceVersion": "2026.1-ch17",
    "sourceContentHash": "ch17-dhcp-dora",
    "standardsRefs": [
      "RFC 2131 (Dynamic Host Configuration Protocol)",
      "RFC 2132 (DHCP Options)"
    ],
    "learningObjectives": [
      "Break down the 4-step DHCP DORA negotiation: Discover (Broadcast), Offer (Unicast/Broadcast), Request (Broadcast), ACK.",
      "Configure DHCP address pools, lease durations, exclusion ranges, and default gateway/DNS options (Option 3 & Option 6).",
      "Explain why DHCP Relay Agents (`ip helper-address`) are required to forward broadcast requests across router boundaries."
    ],
    "prerequisiteConcepts": [
      "UDP port 67/68",
      "Broadcast domains"
    ],
    "assessmentLinkage": "quiz-level-0-dhcp-automatic-ip-allocation"
  },
  {
    "lessonSlug": "arp-protocol-overview",
    "lessonTitle": "Address Resolution Protocol (ARP) & Layer 2/3 Binding",
    "courseCode": "NV-C03",
    "courseTitle": "Transport, Routing & Network Services",
    "moduleId": "mod-c03-core-ip-services",
    "moduleTitle": "Module 1: Core IP Infrastructure Services",
    "textbookChapterNumber": 17,
    "textbookChapterTitle": "MODULE 17 — ARP, ICMP, DHCP, DNS & NAT",
    "sectionReference": "17.1 Address Resolution Protocol (ARP Request, Reply, Cache, Gratuitous ARP)",
    "sourceVersion": "2026.1-ch17",
    "sourceContentHash": "ch17-arp-resolution",
    "standardsRefs": [
      "RFC 826 (An Ethernet Address Resolution Protocol)"
    ],
    "learningObjectives": [
      "Describe the dynamic resolution of Layer 3 IP addresses to Layer 2 MAC addresses on local Ethernet segments.",
      "Explain why ARP Requests are broadcast (FF:FF:FF:FF:FF:FF) while ARP Replies are unicast.",
      "Analyze ARP cache aging, Gratuitous ARP for IP conflict detection, and ARP poisoning vulnerabilities."
    ],
    "prerequisiteConcepts": [
      "MAC addressing",
      "Broadcast vs Unicast"
    ],
    "assessmentLinkage": "quiz-arp-protocol-overview"
  },
  {
    "lessonSlug": "dhcp-dns-overview",
    "lessonTitle": "The Integrated Host Boot-Up Lifecycle: From Cold Boot to Web Request",
    "courseCode": "NV-C03",
    "courseTitle": "Transport, Routing & Network Services",
    "moduleId": "mod-c03-core-ip-services",
    "moduleTitle": "Module 1: Core IP Infrastructure Services",
    "textbookChapterNumber": 33,
    "textbookChapterTitle": "MODULE 33 — THE COMPLETE INTERNET PACKET JOURNEY",
    "sectionReference": "33.1 End-to-End Packet Trace: Host Initialization, DHCP, DNS Query, TCP Handshake, HTTP Request",
    "sourceVersion": "2026.1-ch33",
    "sourceContentHash": "ch33-packet-journey",
    "standardsRefs": [
      "RFC 1122",
      "RFC 9110"
    ],
    "learningObjectives": [
      "Synthesize the unified sequence: Link up -> DHCP lease acquisition -> Default gateway resolution via ARP -> DNS resolution -> TCP socket establishment.",
      "Identify the exact frame headers, IP headers, and transport ports at each milestone of an end-to-end transaction.",
      "Diagnose failure points in the host bootup sequence when pinging 8.8.8.8 succeeds but opening a webpage fails."
    ],
    "prerequisiteConcepts": [
      "DHCP DORA",
      "DNS hierarchy",
      "ARP resolution"
    ],
    "assessmentLinkage": "quiz-dhcp-dns-overview"
  },
  {
    "lessonSlug": "ipv6-foundations-overview",
    "lessonTitle": "IPv6 Addressing Architecture, SLAAC & Dual-Stack Foundations",
    "courseCode": "NV-C03",
    "courseTitle": "Transport, Routing & Network Services",
    "moduleId": "mod-c03-core-ip-services",
    "moduleTitle": "Module 1: Core IP Infrastructure Services",
    "textbookChapterNumber": 16,
    "textbookChapterTitle": "MODULE 16 — IPv6 ARCHITECTURE & PROTOCOLS",
    "sectionReference": "16.1 128-bit Address Format, 16.2 Shortening Rules, 16.3 Address Scopes, 16.4 NDP & SLAAC",
    "sourceVersion": "2026.1-ch16",
    "sourceContentHash": "ch16-ipv6-arch",
    "standardsRefs": [
      "RFC 8200 (Internet Protocol, Version 6 Specification)",
      "RFC 4861 (Neighbor Discovery for IP version 6)",
      "RFC 4862 (IPv6 Stateless Address Autoconfiguration)",
      "RFC 5952"
    ],
    "learningObjectives": [
      "Format 128-bit IPv6 addresses applying RFC 5952 canonical compression (omitting leading zeros and zero compression `::`).",
      "Differentiate IPv6 address scopes: Global Unicast (2000::/3), Link-Local (fe80::/10), Unique Local (fc00::/7), and Multicast (ff00::/8).",
      "Explain how Neighbor Discovery Protocol (NDP RS/RA and NS/NA) completely eliminates broadcast and ARP in IPv6."
    ],
    "prerequisiteConcepts": [
      "Hexadecimal notation",
      "IPv4 limitations"
    ],
    "assessmentLinkage": "quiz-ipv6-foundations-overview"
  },
  {
    "lessonSlug": "level-0-network-ports-socket-boundaries",
    "lessonTitle": "Network Ports, Socket Endpoints & Layer 4 Multiplexing",
    "courseCode": "NV-C03",
    "courseTitle": "Transport, Routing & Network Services",
    "moduleId": "mod-c03-transport-protocols",
    "moduleTitle": "Module 2: Transport Layer Protocols (TCP & UDP)",
    "textbookChapterNumber": 20,
    "textbookChapterTitle": "MODULE 20 — TRANSPORT LAYER",
    "sectionReference": "20.1 Process-to-Process Delivery, 20.2 Port Ranges (Well-known, Registered, Dynamic), 20.3 Socket Abstraction",
    "sourceVersion": "2026.1-ch20",
    "sourceContentHash": "ch20-ports-sockets",
    "standardsRefs": [
      "RFC 6335 (Internet Assigned Numbers Authority Service Name and Port Number Procedures)",
      "POSIX Sockets"
    ],
    "learningObjectives": [
      "Explain Layer 4 multiplexing and demultiplexing using the 5-tuple: Source IP, Source Port, Dest IP, Dest Port, Protocol.",
      "Identify IANA port ranges: Well-Known (0-1023), Registered (1024-49151), and Ephemeral/Dynamic (49152-65535).",
      "Map standard enterprise services to port numbers: HTTP 80, HTTPS 443, SSH 22, DNS 53, DHCP 67/68, NTP 123."
    ],
    "prerequisiteConcepts": [
      "Process execution in operating systems",
      "IP addressing"
    ],
    "assessmentLinkage": "quiz-level-0-network-ports-socket-boundaries"
  },
  {
    "lessonSlug": "level-0-network-packets-data-framing",
    "lessonTitle": "Transport Layer Segmentation, MTU & Path MTU Discovery",
    "courseCode": "NV-C03",
    "courseTitle": "Transport, Routing & Network Services",
    "moduleId": "mod-c03-transport-protocols",
    "moduleTitle": "Module 2: Transport Layer Protocols (TCP & UDP)",
    "textbookChapterNumber": 5,
    "textbookChapterTitle": "MODULE 5 — PDUs & ENCAPSULATION",
    "sectionReference": "5.1 PDU Progression & 20.2 MTU, MSS, Fragmentation",
    "sourceVersion": "2026.1-ch05",
    "sourceContentHash": "ch05-segmentation-mtu",
    "standardsRefs": [
      "RFC 1191 (Path MTU Discovery)",
      "RFC 879 (The TCP Maximum Segment Size and Related Topics)"
    ],
    "learningObjectives": [
      "Calculate TCP Maximum Segment Size (MSS) from Maximum Transmission Unit (MTU) (e.g., 1500 - 20 IP - 20 TCP = 1460 bytes).",
      "Analyze IP packet fragmentation mechanics: Identification, Flags (DF, MF), and Fragment Offset fields.",
      "Explain how Path MTU Discovery (PMTUD) uses ICMP Destination Unreachable (Fragmentation Needed) to eliminate in-flight fragmentation."
    ],
    "prerequisiteConcepts": [
      "Layer encapsulation",
      "Ethernet frame payload limits"
    ],
    "assessmentLinkage": "quiz-level-0-network-packets-data-framing"
  },
  {
    "lessonSlug": "tcp-udp-transport-overview",
    "lessonTitle": "TCP & UDP Transport Protocols: Connection Management, Reliability & Flow Control",
    "courseCode": "NV-C03",
    "courseTitle": "Transport, Routing & Network Services",
    "moduleId": "mod-c03-transport-protocols",
    "moduleTitle": "Module 2: Transport Layer Protocols (TCP & UDP)",
    "textbookChapterNumber": 22,
    "textbookChapterTitle": "MODULE 22 — TRANSMISSION CONTROL PROTOCOL (TCP)",
    "sectionReference": "21.1 UDP Header & 22.1-22.5 TCP 3-Way Handshake, State Machine, Sliding Window, Congestion Control",
    "sourceVersion": "2026.1-ch22",
    "sourceContentHash": "ch22-tcp-mastery",
    "standardsRefs": [
      "RFC 768 (UDP)",
      "RFC 793 / RFC 9293 (TCP)",
      "RFC 2018 (SACK)",
      "RFC 5681 (TCP Congestion Control)"
    ],
    "learningObjectives": [
      "Compare the 8-byte stateless UDP header with the 20-byte reliable TCP header.",
      "Diagram the complete TCP connection lifecycle: 3-way Handshake (SYN, SYN-ACK, ACK), Data transfer with Sliding Window, 4-way Teardown (FIN, ACK, FIN, ACK), and TIME-WAIT state.",
      "Explain TCP congestion algorithms: Slow Start, Congestion Avoidance, Fast Retransmit, and Fast Recovery."
    ],
    "prerequisiteConcepts": [
      "Port multiplexing",
      "Sequence and Acknowledgement numbers"
    ],
    "assessmentLinkage": "quiz-tcp-udp-transport-overview"
  },
  {
    "lessonSlug": "level-0-routers-inter-subnet-pathfinders",
    "lessonTitle": "Routers: Inter-Subnet Path Finders & Forwarding Engine",
    "courseCode": "NV-C03",
    "courseTitle": "Transport, Routing & Network Services",
    "moduleId": "mod-c03-static-routing",
    "moduleTitle": "Module 3: IP Routing & Static Route Administration",
    "textbookChapterNumber": 18,
    "textbookChapterTitle": "MODULE 18 — ROUTING",
    "sectionReference": "18.1 Control Plane vs Data Plane & 18.2 Routing Table Internals",
    "sourceVersion": "2026.1-ch18",
    "sourceContentHash": "ch18-routing-engine",
    "standardsRefs": [
      "RFC 1812 (Requirements for IP Version 4 Routers)"
    ],
    "learningObjectives": [
      "Differentiate the Router Control Plane (route calculation, routing protocols) from the Data Plane (hardware CEF forwarding).",
      "Examine routing table parameters: Destination Prefix, Next-Hop IP, Outgoing Interface, Metric, and Administrative Distance.",
      "Explain TTL decrementing, IP header checksum recalculation, and hop-by-hop MAC address rewriting."
    ],
    "prerequisiteConcepts": [
      "IP addressing",
      "Default gateways"
    ],
    "assessmentLinkage": "quiz-level-0-routers-inter-subnet-pathfinders"
  },
  {
    "lessonSlug": "routing-fundamentals-overview",
    "lessonTitle": "Routing Fundamentals: Longest Prefix Match, Administrative Distance & Static Routes",
    "courseCode": "NV-C03",
    "courseTitle": "Transport, Routing & Network Services",
    "moduleId": "mod-c03-static-routing",
    "moduleTitle": "Module 3: IP Routing & Static Route Administration",
    "textbookChapterNumber": 18,
    "textbookChapterTitle": "MODULE 18 — ROUTING",
    "sectionReference": "18.3 Longest Prefix Match (LPM) Algorithm & 18.4 Static, Default & Floating Static Routes",
    "sourceVersion": "2026.1-ch18",
    "sourceContentHash": "ch18-static-lpm",
    "standardsRefs": [
      "RFC 1812",
      "Cisco IOS Routing Architecture"
    ],
    "learningObjectives": [
      "Execute the Longest Prefix Match (LPM) algorithm across overlapping route entries (/24 wins over /16).",
      "Compare Administrative Distance (AD) values across route sources: Connected (0), Static (1), eBGP (20), EIGRP (90), OSPF (110), RIP (120).",
      "Configure static routes, default routes (0.0.0.0/0), and floating static backup routes with modified AD."
    ],
    "prerequisiteConcepts": [
      "Routing tables",
      "Prefix notation"
    ],
    "assessmentLinkage": "quiz-routing-fundamentals-overview"
  },
  {
    "lessonSlug": "net-304-single-area-ospf-routing",
    "lessonTitle": "Dynamic Routing Protocols & Single-Area OSPF",
    "courseCode": "NV-C03",
    "courseTitle": "Transport, Routing & Network Services",
    "moduleId": "mod-c03-dynamic-routing-ospf",
    "moduleTitle": "Module 4: Dynamic Routing with Single-Area OSPFv2",
    "textbookChapterNumber": 19,
    "textbookChapterTitle": "MODULE 19 — ROUTING PROTOCOLS",
    "sectionReference": "19.4 Open Shortest Path First (Link-state, Dijkstra SPF, Cost metric, Area 0, DR/BDR election)",
    "sourceVersion": "2026.1-ch19",
    "sourceContentHash": "ch19-ospf-single-area",
    "standardsRefs": [
      "RFC 2328 (OSPF Version 2)"
    ],
    "learningObjectives": [
      "Differentiate Distance-Vector (Bellman-Ford / RIP) from Link-State (Dijkstra SPF / OSPF) protocol behaviors.",
      "Trace OSPF neighbor state machine: Down -> Init -> 2-Way -> ExStart -> Exchange -> Loading -> Full.",
      "Explain DR (Designated Router) and BDR election on multiaccess broadcast networks using Router Priority and highest Router ID."
    ],
    "prerequisiteConcepts": [
      "Dynamic routing basics",
      "IP multicast 224.0.0.5 / 224.0.0.6"
    ],
    "assessmentLinkage": "quiz-net-304-single-area-ospf-routing"
  },
  {
    "lessonSlug": "net-304-multi-area-ospf-redistribution",
    "lessonTitle": "Multi-Area OSPF Architecture, LSA Flooding & Route Redistribution",
    "courseCode": "NV-C03",
    "courseTitle": "Transport, Routing & Network Services",
    "moduleId": "mod-c03-dynamic-routing-ospf",
    "moduleTitle": "Module 4: Dynamic Routing with Single-Area OSPFv2",
    "textbookChapterNumber": 19,
    "textbookChapterTitle": "MODULE 19 — ROUTING PROTOCOLS",
    "sectionReference": "19.4 OSPF Hierarchical Areas (Backbone Area 0, ABR, ASBR, LSA Types 1 through 5)",
    "sourceVersion": "2026.1-ch19",
    "sourceContentHash": "ch19-ospf-multi-area",
    "standardsRefs": [
      "RFC 2328"
    ],
    "learningObjectives": [
      "Explain the two-tier hierarchical OSPF topology: Backbone Area 0 interconnecting all non-backbone areas.",
      "Categorize LSA Types: Type 1 (Router LSA), Type 2 (Network LSA), Type 3 (Summary LSA from ABR), Type 4/5 (ASBR External LSAs).",
      "Perform inter-area route summarization at Area Border Routers (ABRs) and external route redistribution at ASBRs."
    ],
    "prerequisiteConcepts": [
      "Single-area OSPF",
      "Dijkstra SPF algorithm"
    ],
    "assessmentLinkage": "quiz-net-304-multi-area-ospf-redistribution"
  },
  {
    "lessonSlug": "net-305-standard-extended-ipv4-acls",
    "lessonTitle": "Standard & Extended IPv4 Access Control Lists (ACLs)",
    "courseCode": "NV-C04",
    "courseTitle": "Network Security & Secure Connectivity",
    "moduleId": "mod-c04-acls-firewalls",
    "moduleTitle": "Module 1: Perimeter Security, ACLs & Stateful Firewalls",
    "textbookChapterNumber": 29,
    "textbookChapterTitle": "MODULE 29 — NETWORK DEFENSE",
    "sectionReference": "29.2 Access Control Lists (Standard vs Extended ACLs, Wildcard Masks, Top-Down First-Match Processing)",
    "sourceVersion": "2026.1-ch29",
    "sourceContentHash": "ch29-ipv4-acls",
    "standardsRefs": [
      "RFC 1812 Packet Filtering Requirements",
      "NIST SP 800-41 (Guidelines on Firewalls and Firewall Policy)"
    ],
    "learningObjectives": [
      "Differentiate Standard ACLs (filter on source IP only, placed closest to destination) from Extended ACLs (filter on source/dest IP and Layer 4 ports, placed closest to source).",
      "Calculate inverse wildcard masks (e.g., subnet 255.255.255.0 -> wildcard 0.0.0.255).",
      "Apply top-down first-match evaluation rules and account for the invisible implicit deny any at the end of every ACL."
    ],
    "prerequisiteConcepts": [
      "IPv4 addressing",
      "Layer 4 port numbers"
    ],
    "assessmentLinkage": "quiz-net-305-standard-extended-ipv4-acls"
  },
  {
    "lessonSlug": "net-305-stateful-firewalls-connection-tracking",
    "lessonTitle": "Stateful Packet Inspection (SPI) & Zone-Based Firewalls",
    "courseCode": "NV-C04",
    "courseTitle": "Network Security & Secure Connectivity",
    "moduleId": "mod-c04-acls-firewalls",
    "moduleTitle": "Module 1: Perimeter Security, ACLs & Stateful Firewalls",
    "textbookChapterNumber": 29,
    "textbookChapterTitle": "MODULE 29 — NETWORK DEFENSE",
    "sectionReference": "29.1 Firewalls: Packet Filtering vs Stateful Packet Inspection (SPI) vs NGFW, Connection State Tables",
    "sourceVersion": "2026.1-ch29",
    "sourceContentHash": "ch29-stateful-firewalls",
    "standardsRefs": [
      "NIST SP 800-41 Rev 1",
      "RFC 2979 (Characteristics of Internet Firewalls)"
    ],
    "learningObjectives": [
      "Contrast stateless packet filtering with stateful inspection tracking TCP flags (SYN, ACK, FIN, RST) and UDP dynamic state.",
      "Analyze the Firewall Connection State Table (conntrack) and explain how return traffic is automatically permitted.",
      "Design Zone-Based Firewall architectures (Inside, Outside, DMZ) enforcing unidirectional security policies."
    ],
    "prerequisiteConcepts": [
      "TCP 3-way handshake",
      "Access control lists"
    ],
    "assessmentLinkage": "quiz-net-305-stateful-firewalls-connection-tracking"
  },
  {
    "lessonSlug": "network-security-basics-overview",
    "lessonTitle": "Network Security Fundamentals: CIA Triad, Threat Vectors & Cryptographic Principles",
    "courseCode": "NV-C04",
    "courseTitle": "Network Security & Secure Connectivity",
    "moduleId": "mod-c04-acls-firewalls",
    "moduleTitle": "Module 1: Perimeter Security, ACLs & Stateful Firewalls",
    "textbookChapterNumber": 27,
    "textbookChapterTitle": "MODULE 27 — NETWORK SECURITY",
    "sectionReference": "27.1 CIA Triad, 27.2 AAA Framework, 27.3 Cryptography (Symmetric AES, Asymmetric RSA/ECC, Hashing SHA-256)",
    "sourceVersion": "2026.1-ch27",
    "sourceContentHash": "ch27-security-fundamentals",
    "standardsRefs": [
      "NIST SP 800-175B",
      "FIPS 197 (AES)",
      "FIPS 180-4 (Secure Hash Standard)"
    ],
    "learningObjectives": [
      "Define the CIA Triad: Confidentiality (encryption), Integrity (cryptographic hashing), and Availability (resilience/redundancy).",
      "Compare Symmetric key encryption (AES-256) speed with Asymmetric key encryption (RSA/ECC) key exchange mechanics.",
      "Explain the AAA security framework: Authentication, Authorization, and Accounting."
    ],
    "prerequisiteConcepts": [
      "Network communication fundamentals"
    ],
    "assessmentLinkage": "quiz-network-security-basics-overview"
  },
  {
    "lessonSlug": "firewalls-acls-overview",
    "lessonTitle": "Perimeter Defense: Multi-Tier Firewalls, DMZ Architectures & Deep Inspection",
    "courseCode": "NV-C04",
    "courseTitle": "Network Security & Secure Connectivity",
    "moduleId": "mod-c04-acls-firewalls",
    "moduleTitle": "Module 1: Perimeter Security, ACLs & Stateful Firewalls",
    "textbookChapterNumber": 29,
    "textbookChapterTitle": "MODULE 29 — NETWORK DEFENSE",
    "sectionReference": "29.3 Network Segmentation, DMZ Architectures, IDS vs IPS Systems",
    "sourceVersion": "2026.1-ch29",
    "sourceContentHash": "ch29-perimeter-defense",
    "standardsRefs": [
      "NIST SP 800-41",
      "NIST SP 800-94 (Guide to Intrusion Detection and Prevention Systems)"
    ],
    "learningObjectives": [
      "Architect a dual-firewall Demilitarized Zone (DMZ) isolating public-facing services from internal private databases.",
      "Differentiate passive Intrusion Detection Systems (IDS - out of band) from inline Intrusion Prevention Systems (IPS - in-line drop).",
      "Synthesize multi-layer defense-in-depth from border gateway ACLs down to endpoint host firewalls."
    ],
    "prerequisiteConcepts": [
      "Stateful inspection",
      "VLAN segmentation"
    ],
    "assessmentLinkage": "quiz-firewalls-acls-overview"
  },
  {
    "lessonSlug": "net-401-ipv4-nat-pat-address-translation",
    "lessonTitle": "IPv4 Network Address Translation (Static, Dynamic & PAT Overload)",
    "courseCode": "NV-C04",
    "courseTitle": "Network Security & Secure Connectivity",
    "moduleId": "mod-c04-nat-pat",
    "moduleTitle": "Module 2: Network & Port Address Translation (NAT/PAT)",
    "textbookChapterNumber": 17,
    "textbookChapterTitle": "MODULE 17 — ARP, ICMP, DHCP, DNS & NAT",
    "sectionReference": "17.5 NAT & PAT (Static NAT, Dynamic NAT, Port Address Translation / NAT Overload, Inside/Outside Terminology)",
    "sourceVersion": "2026.1-ch17",
    "sourceContentHash": "ch17-nat-pat-mechanics",
    "standardsRefs": [
      "RFC 3022 (Traditional IP Network Address Translator)",
      "RFC 2663 (NAT Terminology and Considerations)"
    ],
    "learningObjectives": [
      "Differentiate Static 1-to-1 NAT, Dynamic NAT pool allocation, and Port Address Translation (PAT / NAT Overload).",
      "Map Cisco NAT terminology: Inside Local, Inside Global, Outside Local, and Outside Global.",
      "Analyze the NAT translation table translating thousands of private RFC 1918 internal IPs to a single routable public IPv4 address using source port multiplexing."
    ],
    "prerequisiteConcepts": [
      "RFC 1918 private addressing",
      "Transport layer port numbers"
    ],
    "assessmentLinkage": "quiz-net-401-ipv4-nat-pat-address-translation"
  },
  {
    "lessonSlug": "nat-pat-overview",
    "lessonTitle": "NAT/PAT Architectural Engineering: Port Exhaustion, ALG & NAT Traversal",
    "courseCode": "NV-C04",
    "courseTitle": "Network Security & Secure Connectivity",
    "moduleId": "mod-c04-nat-pat",
    "moduleTitle": "Module 2: Network & Port Address Translation (NAT/PAT)",
    "textbookChapterNumber": 17,
    "textbookChapterTitle": "MODULE 17 — ARP, ICMP, DHCP, DNS & NAT",
    "sectionReference": "17.5 NAT Tradeoffs, Port Exhaustion, Application Layer Gateways (ALG), STUN/TURN Traversal",
    "sourceVersion": "2026.1-ch17",
    "sourceContentHash": "ch17-nat-tradeoffs",
    "standardsRefs": [
      "RFC 3022",
      "RFC 3489 (STUN)",
      "RFC 5389"
    ],
    "learningObjectives": [
      "Diagnose PAT port exhaustion under high concurrent connection loads (>65,000 sockets per public IP).",
      "Explain how Application Layer Gateways (ALGs) rewrite payload embedded IP addresses for legacy protocols (FTP, SIP, H.323).",
      "Examine modern NAT traversal techniques (STUN, TURN, ICE) utilized in WebRTC and peer-to-peer applications."
    ],
    "prerequisiteConcepts": [
      "PAT translation tables",
      "TCP/UDP socket multiplexing"
    ],
    "assessmentLinkage": "quiz-nat-pat-overview"
  },
  {
    "lessonSlug": "net-402-ipsec-vpn-cryptographic-tunnels",
    "lessonTitle": "Site-to-Site IPsec VPNs & Cryptographic Tunneling",
    "courseCode": "NV-C04",
    "courseTitle": "Network Security & Secure Connectivity",
    "moduleId": "mod-c04-vpn-crypto",
    "moduleTitle": "Module 3: VPN Architectures & Cryptography",
    "textbookChapterNumber": 29,
    "textbookChapterTitle": "MODULE 29 — NETWORK DEFENSE",
    "sectionReference": "29.4 Virtual Private Networks (IPsec Architecture, AH vs ESP, IKEv1/v2 Phase 1 & 2)",
    "sourceVersion": "2026.1-ch29",
    "sourceContentHash": "ch29-ipsec-tunnels",
    "standardsRefs": [
      "RFC 4301 (Security Architecture for the Internet Protocol)",
      "RFC 4303 (IP Encapsulating Security Payload - ESP)",
      "RFC 7296 (IKEv2)"
    ],
    "learningObjectives": [
      "Deconstruct the IPsec protocol suite: Authentication Header (AH protocol 51) vs Encapsulating Security Payload (ESP protocol 50).",
      "Compare Transport Mode (payload only encrypted) with Tunnel Mode (entire original IP packet encrypted with new outer header).",
      "Trace IKE Phase 1 (Main/Aggressive mode establishing secure ISAKMP SA) and Phase 2 (Quick mode negotiating IPsec transform sets)."
    ],
    "prerequisiteConcepts": [
      "Diffie-Hellman key exchange",
      "Symmetric encryption AES-CBC/GCM"
    ],
    "assessmentLinkage": "quiz-net-402-ipsec-vpn-cryptographic-tunnels"
  },
  {
    "lessonSlug": "vpn-cryptography-overview",
    "lessonTitle": "VPN Technologies & Cryptography: Remote Access, WireGuard & TLS VPNs",
    "courseCode": "NV-C04",
    "courseTitle": "Network Security & Secure Connectivity",
    "moduleId": "mod-c04-vpn-crypto",
    "moduleTitle": "Module 3: VPN Architectures & Cryptography",
    "textbookChapterNumber": 29,
    "textbookChapterTitle": "MODULE 29 — NETWORK DEFENSE",
    "sectionReference": "29.4 Enterprise VPN Architectures: Remote Access, SSL/TLS VPNs, WireGuard vs IPsec",
    "sourceVersion": "2026.1-ch29",
    "sourceContentHash": "ch29-vpn-crypto-overview",
    "standardsRefs": [
      "RFC 8446 (TLS 1.3)",
      "WireGuard Technical Whitepaper"
    ],
    "learningObjectives": [
      "Contrast Site-to-Site Gateway-to-Gateway VPNs with Remote Access Client-to-Gateway VPNs.",
      "Compare modern tunneling protocols: IPsec IKEv2, OpenVPN (TLS over UDP/TCP), and WireGuard (Noise protocol, ChaCha20-Poly1305).",
      "Implement Public Key Infrastructure (PKI) X.509 certificate authentication for enterprise VPN endpoints."
    ],
    "prerequisiteConcepts": [
      "IPsec fundamentals",
      "Asymmetric cryptography"
    ],
    "assessmentLinkage": "quiz-vpn-cryptography-overview"
  },
  {
    "lessonSlug": "net-404-wireshark-packet-capture",
    "lessonTitle": "Wireshark Packet Capture Analysis & Wire-Level Forensics",
    "courseCode": "NV-C05",
    "courseTitle": "Network Engineering, Automation & Troubleshooting",
    "moduleId": "mod-c05-packet-analysis",
    "moduleTitle": "Module 1: Packet Capture Analysis & Wireshark Forensics",
    "textbookChapterNumber": 31,
    "textbookChapterTitle": "MODULE 31 — WIRESHARK",
    "sectionReference": "31.1 Capture Filters vs Display Filters, 31.2 Protocol Dissection, Supplemental Wireshark Workbook",
    "sourceVersion": "2026.1-ch31",
    "sourceContentHash": "ch31-wireshark-mastery",
    "standardsRefs": [
      "libpcap / WinPcap File Format",
      "IETF RFC Packet Formats"
    ],
    "learningObjectives": [
      "Master BPF (Berkeley Packet Filter) capture filters vs Wireshark boolean display filter syntax.",
      "Perform wire-level packet dissection across Ethernet, IPv4/IPv6, TCP flags, DNS queries, and TLS Client Hello.",
      "Reconstruct complete TCP conversation streams and identify retransmissions, duplicate ACKs, and zero-window probes."
    ],
    "prerequisiteConcepts": [
      "Ethernet framing",
      "TCP 3-way handshake"
    ],
    "assessmentLinkage": "quiz-net-404-wireshark-packet-capture"
  },
  {
    "lessonSlug": "level-0-basic-network-troubleshooting-workflow",
    "lessonTitle": "Basic Network Troubleshooting: The Systematic Bottom-Up Diagnostic Method",
    "courseCode": "NV-C05",
    "courseTitle": "Network Engineering, Automation & Troubleshooting",
    "moduleId": "mod-c05-troubleshooting-workflows",
    "moduleTitle": "Module 2: Complex Diagnostic & Troubleshooting Incident Workflows",
    "textbookChapterNumber": 30,
    "textbookChapterTitle": "MODULE 30 — NETWORK TROUBLESHOOTING",
    "sectionReference": "30.1 12-Step Diagnostic Framework & 30.2 OS Diagnostic CLI Tools (ipconfig/ip, ping, traceroute, arp)",
    "sourceVersion": "2026.1-ch30",
    "sourceContentHash": "ch30-basic-troubleshooting",
    "standardsRefs": [
      "ISO/IEC 7498-1",
      "RFC 792 (ICMP)"
    ],
    "learningObjectives": [
      "Execute the systematic Bottom-Up OSI troubleshooting methodology: Physical -> Data Link -> Network -> Transport -> Application.",
      "Use baseline CLI tools: `ping 127.0.0.1` (TCP/IP stack test), `ping default-gateway` (Local LAN reachability), and `tracert/traceroute` (Hop-by-hop path tracing).",
      "Distinguish between Physical link failure, Layer 2 VLAN misassignment, Layer 3 subnet mismatch, and DNS resolution failure."
    ],
    "prerequisiteConcepts": [
      "OSI model layers",
      "CLI terminal operations"
    ],
    "assessmentLinkage": "quiz-level-0-basic-network-troubleshooting-workflow"
  },
  {
    "lessonSlug": "network-troubleshooting-overview",
    "lessonTitle": "Enterprise Network Incident Diagnostics: Symptom-to-Root-Cause Playbooks",
    "courseCode": "NV-C05",
    "courseTitle": "Network Engineering, Automation & Troubleshooting",
    "moduleId": "mod-c05-troubleshooting-workflows",
    "moduleTitle": "Module 2: Complex Diagnostic & Troubleshooting Incident Workflows",
    "textbookChapterNumber": 30,
    "textbookChapterTitle": "MODULE 30 — NETWORK TROUBLESHOOTING",
    "sectionReference": "30.3 Failure Modes & Decision Trees & Supplemental Failure-Injection Playbook",
    "sourceVersion": "2026.1-ch30",
    "sourceContentHash": "ch30-playbook-diagnostics",
    "standardsRefs": [
      "RFC 1122",
      "Cisco TAC Troubleshooting Methodology"
    ],
    "learningObjectives": [
      "Execute structured decision trees for high-impact production incidents: Asymmetric routing, MTU blackholes, Broadcast storms, and Duplex mismatches.",
      "Analyze router diagnostic outputs: `show ip route`, `show ip ospf neighbor`, `show ip interface brief`, and `show mac address-table`.",
      "Isolate transient packet loss using automated ICMP sweeps and Wireshark latency delta graphs."
    ],
    "prerequisiteConcepts": [
      "OSI 12-step methodology",
      "Routing protocols"
    ],
    "assessmentLinkage": "quiz-network-troubleshooting-overview"
  },
  {
    "lessonSlug": "net-403-network-automation-programmability-foundations",
    "lessonTitle": "Network Automation & Programmability Foundations",
    "courseCode": "NV-C05",
    "courseTitle": "Network Engineering, Automation & Troubleshooting",
    "moduleId": "mod-c05-network-automation",
    "moduleTitle": "Module 3: Network Automation & Programmability Foundations",
    "textbookChapterNumber": 35,
    "textbookChapterTitle": "MODULE 35 — NETWORK ARCHITECTURE",
    "sectionReference": "35.2 Modern Data Center Spine-Leaf & Programmability: Python, REST APIs, JSON/YAML, NETCONF/YANG",
    "sourceVersion": "2026.1-ch35",
    "sourceContentHash": "ch35-net-automation",
    "standardsRefs": [
      "RFC 6241 (Network Configuration Protocol - NETCONF)",
      "RFC 8040 (RESTCONF Protocol)",
      "RFC 6020 / RFC 7950 (YANG Data Modeling)"
    ],
    "learningObjectives": [
      "Compare legacy CLI screen scraping with modern model-driven telemetry using structured JSON, YAML, and XML payloads.",
      "Interact with network device RESTCONF/REST APIs using Python `requests` (GET, POST, PUT, DELETE).",
      "Validate network state and configuration data against standardized IETF and OpenConfig YANG data models."
    ],
    "prerequisiteConcepts": [
      "Python fundamentals",
      "HTTP methods and status codes"
    ],
    "assessmentLinkage": "quiz-net-403-network-automation-programmability-foundations"
  },
  {
    "lessonSlug": "sdn-cloud-networking-overview",
    "lessonTitle": "Software-Defined Networking (SDN) & Cloud Architecture",
    "courseCode": "NV-C05",
    "courseTitle": "Network Engineering, Automation & Troubleshooting",
    "moduleId": "mod-c05-network-automation",
    "moduleTitle": "Module 3: Network Automation & Programmability Foundations",
    "textbookChapterNumber": 35,
    "textbookChapterTitle": "MODULE 35 — NETWORK ARCHITECTURE",
    "sectionReference": "35.1 Cisco 3-Tier Model vs Modern Data Center Spine-Leaf Fabric & SDN Control/Data Plane Separation",
    "sourceVersion": "2026.1-ch35",
    "sourceContentHash": "ch35-sdn-cloud",
    "standardsRefs": [
      "ONF SDN Architecture",
      "RFC 7426 (Software-Defined Networking: A Perspective and Four Ground Rules)"
    ],
    "learningObjectives": [
      "Explain SDN architectural decoupling: Centralized Control Plane (SDN Controller) vs Distributed Data Plane (Forwarding Switches).",
      "Compare Southbound APIs (OpenFlow, NETCONF, gNMI) with Northbound APIs (REST, gRPC) consumed by business applications.",
      "Analyze modern East-West traffic flows in Clos Spine-Leaf fabrics replacing traditional North-South 3-tier topologies."
    ],
    "prerequisiteConcepts": [
      "Control plane vs Data plane",
      "Network automation foundations"
    ],
    "assessmentLinkage": "quiz-sdn-cloud-networking-overview"
  }
];

export const TEXTBOOK_MAPPING_BY_SLUG = new Map<string, LessonTextbookMapping>(
  CANONICAL_TEXTBOOK_MAPPING.map((m) => [m.lessonSlug, m])
);

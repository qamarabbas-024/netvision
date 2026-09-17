/**
 * NETVISION AUTHORITATIVE CURRICULUM LABS CATALOG
 *
 * Grounded in CS-221 Textbook Architecture.
 * 46 Flagship Labs classified into:
 *  - 18 Tier-1 Engineering Simulation Labs (State-mutation, CLI commands, deterministic validation)
 *  - 21 Tier-2 Guided Engineering Practice Labs (Operational telemetry, socket/protocol diagnostics)
 *  - 7 Tier-3 Conceptual Exploration Labs (Foundational theoretical/framing analysis, no artificial CLI)
 */

import { CourseLevel } from '@prisma/client';
import { BenchmarkLabDef } from './lessons-net300-400';

export const ALL_CURRICULUM_LABS: Record<string, BenchmarkLabDef> = {
  "level-0-what-is-a-computer-network": {
    "title": "Conceptual & Analytical Exploration: What is a Computer Network?",
    "tier": "TIER_3_CONCEPTUAL",
    difficulty: CourseLevel.FOUNDATIONAL,
    "estimatedMinutes": 15,
    "initialTopologyJson": {
      "nodes": [
        "Host-A",
        "Gateway-R1"
      ],
      "type": "Standard"
    },
    "instructions": "Examine theoretical principles, framing architectures, and mathematical calculations for What is a Computer Network?. Analyze data structures, bit encodings, and protocol stack hierarchies without artificial device CLI simulation.",
    "tasks": [
      "Analyze protocol data unit (PDU) framing fields and encapsulation byte offsets.",
      "Calculate theoretical link transmission capacity and channel propagation characteristics.",
      "Synthesize architectural layer primitives and service access points."
    ],
    "commands": [],
    "expectedObservations": [
      "Binary bitwise representation and hexadecimal notation",
      "Encapsulation header diagram and byte boundaries"
    ],
    "hints": [
      "Focus on the mathematical relationships between bits, bytes, and channel capacities.",
      "Follow the encapsulation sequence from Layer 7 Application down to Layer 1 Physical."
    ],
    "completionCriteria": "Analytical model verified against theoretical networking specifications.",
    "solution": {
      "steps": [
        "Step: Analyze protocol data unit (PDU) framing fields and encapsulation byte offsets.",
        "Step: Calculate theoretical link transmission capacity and channel propagation characteristics.",
        "Step: Synthesize architectural layer primitives and service access points."
      ]
    }
  },
  "net-101-bits-bytes-digital-representation": {
    "title": "Conceptual & Analytical Exploration: Digital Information Representation: Bits, Bytes & Network Sizing",
    "tier": "TIER_3_CONCEPTUAL",
    difficulty: CourseLevel.FOUNDATIONAL,
    "estimatedMinutes": 15,
    "initialTopologyJson": {
      "nodes": [
        "Host-A",
        "Gateway-R1"
      ],
      "type": "Standard"
    },
    "instructions": "Examine theoretical principles, framing architectures, and mathematical calculations for Digital Information Representation: Bits, Bytes & Network Sizing. Analyze data structures, bit encodings, and protocol stack hierarchies without artificial device CLI simulation.",
    "tasks": [
      "Analyze protocol data unit (PDU) framing fields and encapsulation byte offsets.",
      "Calculate theoretical link transmission capacity and channel propagation characteristics.",
      "Synthesize architectural layer primitives and service access points."
    ],
    "commands": [],
    "expectedObservations": [
      "Binary bitwise representation and hexadecimal notation",
      "Encapsulation header diagram and byte boundaries"
    ],
    "hints": [
      "Focus on the mathematical relationships between bits, bytes, and channel capacities.",
      "Follow the encapsulation sequence from Layer 7 Application down to Layer 1 Physical."
    ],
    "completionCriteria": "Analytical model verified against theoretical networking specifications.",
    "solution": {
      "steps": [
        "Step: Analyze protocol data unit (PDU) framing fields and encapsulation byte offsets.",
        "Step: Calculate theoretical link transmission capacity and channel propagation characteristics.",
        "Step: Synthesize architectural layer primitives and service access points."
      ]
    }
  },
  "level-0-devices-in-a-network": {
    "title": "Guided Engineering Practice: Devices in a Network: Hardware Roles & Layer Mapping",
    "tier": "TIER_2_GUIDED",
    difficulty: CourseLevel.FOUNDATIONAL,
    "estimatedMinutes": 15,
    "initialTopologyJson": {
      "nodes": [
        "Host-A",
        "Gateway-R1"
      ],
      "type": "Standard"
    },
    "instructions": "Execute structured terminal diagnostic workflows to observe protocol behavior, host socket states, and telemetry data for Devices in a Network: Hardware Roles & Layer Mapping.",
    "tasks": [
      "Execute terminal diagnostic command to inspect operational host network state.",
      "Analyze output telemetry fields and verify protocol state transitions.",
      "Record observations and confirm baseline network health."
    ],
    "commands": [
      "ping 192.168.1.1",
      "arp -a",
      "nslookup netvision.edu",
      "traceroute 8.8.8.8"
    ],
    "expectedObservations": [
      "Host IPv4 address and default gateway binding",
      "DNS name resolution to IP address mapping",
      "ICMP echo reply with latency telemetry"
    ],
    "hints": [
      "Use standard network diagnostic utilities (`ping`, `traceroute`, `arp`).",
      "Verify that the default gateway responds to ICMP requests."
    ],
    "completionCriteria": "Host operational telemetry observed and verified.",
    "solution": {
      "steps": [
        "Step: Execute terminal diagnostic command to inspect operational host network state.",
        "Step: Analyze output telemetry fields and verify protocol state transitions.",
        "Step: Record observations and confirm baseline network health."
      ]
    }
  },
  "level-0-client-and-server-architecture": {
    "title": "Guided Engineering Practice: Client and Server Architecture: Centralized Services vs Distributed Hosts",
    "tier": "TIER_2_GUIDED",
    difficulty: CourseLevel.FOUNDATIONAL,
    "estimatedMinutes": 15,
    "initialTopologyJson": {
      "nodes": [
        "Host-A",
        "Gateway-R1"
      ],
      "type": "Standard"
    },
    "instructions": "Execute structured terminal diagnostic workflows to observe protocol behavior, host socket states, and telemetry data for Client and Server Architecture: Centralized Services vs Distributed Hosts.",
    "tasks": [
      "Execute terminal diagnostic command to inspect operational host network state.",
      "Analyze output telemetry fields and verify protocol state transitions.",
      "Record observations and confirm baseline network health."
    ],
    "commands": [
      "ping 192.168.1.1",
      "arp -a",
      "nslookup netvision.edu",
      "traceroute 8.8.8.8"
    ],
    "expectedObservations": [
      "Host IPv4 address and default gateway binding",
      "DNS name resolution to IP address mapping",
      "ICMP echo reply with latency telemetry"
    ],
    "hints": [
      "Use standard network diagnostic utilities (`ping`, `traceroute`, `arp`).",
      "Verify that the default gateway responds to ICMP requests."
    ],
    "completionCriteria": "Host operational telemetry observed and verified.",
    "solution": {
      "steps": [
        "Step: Execute terminal diagnostic command to inspect operational host network state.",
        "Step: Analyze output telemetry fields and verify protocol state transitions.",
        "Step: Record observations and confirm baseline network health."
      ]
    }
  },
  "level-0-lan-wan-internet-boundaries": {
    "title": "Conceptual & Analytical Exploration: LAN, WAN & Internet Boundaries: Network Scale & Geographic Topologies",
    "tier": "TIER_3_CONCEPTUAL",
    difficulty: CourseLevel.FOUNDATIONAL,
    "estimatedMinutes": 15,
    "initialTopologyJson": {
      "nodes": [
        "Host-A",
        "Gateway-R1"
      ],
      "type": "Standard"
    },
    "instructions": "Examine theoretical principles, framing architectures, and mathematical calculations for LAN, WAN & Internet Boundaries: Network Scale & Geographic Topologies. Analyze data structures, bit encodings, and protocol stack hierarchies without artificial device CLI simulation.",
    "tasks": [
      "Analyze protocol data unit (PDU) framing fields and encapsulation byte offsets.",
      "Calculate theoretical link transmission capacity and channel propagation characteristics.",
      "Synthesize architectural layer primitives and service access points."
    ],
    "commands": [],
    "expectedObservations": [
      "Binary bitwise representation and hexadecimal notation",
      "Encapsulation header diagram and byte boundaries"
    ],
    "hints": [
      "Focus on the mathematical relationships between bits, bytes, and channel capacities.",
      "Follow the encapsulation sequence from Layer 7 Application down to Layer 1 Physical."
    ],
    "completionCriteria": "Analytical model verified against theoretical networking specifications.",
    "solution": {
      "steps": [
        "Step: Analyze protocol data unit (PDU) framing fields and encapsulation byte offsets.",
        "Step: Calculate theoretical link transmission capacity and channel propagation characteristics.",
        "Step: Synthesize architectural layer primitives and service access points."
      ]
    }
  },
  "net-102-network-performance": {
    "title": "Guided Engineering Practice: Network Performance Metrics: Comprehensive Quality of Service & SLA Verification",
    "tier": "TIER_2_GUIDED",
    difficulty: CourseLevel.FOUNDATIONAL,
    "estimatedMinutes": 15,
    "initialTopologyJson": {
      "nodes": [
        "Host-A",
        "Gateway-R1"
      ],
      "type": "Standard"
    },
    "instructions": "Execute structured terminal diagnostic workflows to observe protocol behavior, host socket states, and telemetry data for Network Performance Metrics: Comprehensive Quality of Service & SLA Verification.",
    "tasks": [
      "Execute terminal diagnostic command to inspect operational host network state.",
      "Analyze output telemetry fields and verify protocol state transitions.",
      "Record observations and confirm baseline network health."
    ],
    "commands": [
      "ping 192.168.1.1",
      "arp -a",
      "nslookup netvision.edu",
      "traceroute 8.8.8.8"
    ],
    "expectedObservations": [
      "Host IPv4 address and default gateway binding",
      "DNS name resolution to IP address mapping",
      "ICMP echo reply with latency telemetry"
    ],
    "hints": [
      "Use standard network diagnostic utilities (`ping`, `traceroute`, `arp`).",
      "Verify that the default gateway responds to ICMP requests."
    ],
    "completionCriteria": "Host operational telemetry observed and verified.",
    "solution": {
      "steps": [
        "Step: Execute terminal diagnostic command to inspect operational host network state.",
        "Step: Analyze output telemetry fields and verify protocol state transitions.",
        "Step: Record observations and confirm baseline network health."
      ]
    }
  },
  "net-101-copper-fiber-wireless-media": {
    "title": "Conceptual & Analytical Exploration: Physical Layer Media: Copper (UTP/STP), Fiber Optics & RF Propagation",
    "tier": "TIER_3_CONCEPTUAL",
    difficulty: CourseLevel.FOUNDATIONAL,
    "estimatedMinutes": 15,
    "initialTopologyJson": {
      "nodes": [
        "Host-A",
        "Gateway-R1"
      ],
      "type": "Standard"
    },
    "instructions": "Examine theoretical principles, framing architectures, and mathematical calculations for Physical Layer Media: Copper (UTP/STP), Fiber Optics & RF Propagation. Analyze data structures, bit encodings, and protocol stack hierarchies without artificial device CLI simulation.",
    "tasks": [
      "Analyze protocol data unit (PDU) framing fields and encapsulation byte offsets.",
      "Calculate theoretical link transmission capacity and channel propagation characteristics.",
      "Synthesize architectural layer primitives and service access points."
    ],
    "commands": [],
    "expectedObservations": [
      "Binary bitwise representation and hexadecimal notation",
      "Encapsulation header diagram and byte boundaries"
    ],
    "hints": [
      "Focus on the mathematical relationships between bits, bytes, and channel capacities.",
      "Follow the encapsulation sequence from Layer 7 Application down to Layer 1 Physical."
    ],
    "completionCriteria": "Analytical model verified against theoretical networking specifications.",
    "solution": {
      "steps": [
        "Step: Analyze protocol data unit (PDU) framing fields and encapsulation byte offsets.",
        "Step: Calculate theoretical link transmission capacity and channel propagation characteristics.",
        "Step: Synthesize architectural layer primitives and service access points."
      ]
    }
  },
  "network-topologies-overview": {
    "title": "Guided Engineering Practice: Network Topologies: Physical Topologies, Logical Topologies & Redundancy",
    "tier": "TIER_2_GUIDED",
    difficulty: CourseLevel.FOUNDATIONAL,
    "estimatedMinutes": 15,
    "initialTopologyJson": {
      "nodes": [
        "Host-A",
        "Gateway-R1"
      ],
      "type": "Standard"
    },
    "instructions": "Execute structured terminal diagnostic workflows to observe protocol behavior, host socket states, and telemetry data for Network Topologies: Physical Topologies, Logical Topologies & Redundancy.",
    "tasks": [
      "Execute terminal diagnostic command to inspect operational host network state.",
      "Analyze output telemetry fields and verify protocol state transitions.",
      "Record observations and confirm baseline network health."
    ],
    "commands": [
      "ping 192.168.1.1",
      "arp -a",
      "nslookup netvision.edu",
      "traceroute 8.8.8.8"
    ],
    "expectedObservations": [
      "Host IPv4 address and default gateway binding",
      "DNS name resolution to IP address mapping",
      "ICMP echo reply with latency telemetry"
    ],
    "hints": [
      "Use standard network diagnostic utilities (`ping`, `traceroute`, `arp`).",
      "Verify that the default gateway responds to ICMP requests."
    ],
    "completionCriteria": "Host operational telemetry observed and verified.",
    "solution": {
      "steps": [
        "Step: Execute terminal diagnostic command to inspect operational host network state.",
        "Step: Analyze output telemetry fields and verify protocol state transitions.",
        "Step: Record observations and confirm baseline network health."
      ]
    }
  },
  "net-102-bandwidth-throughput-latency-jitter": {
    "title": "Guided Engineering Practice: Network Performance Engineering: Bandwidth, Throughput, Latency & Jitter",
    "tier": "TIER_2_GUIDED",
    difficulty: CourseLevel.FOUNDATIONAL,
    "estimatedMinutes": 15,
    "initialTopologyJson": {
      "nodes": [
        "Host-A",
        "Gateway-R1"
      ],
      "type": "Standard"
    },
    "instructions": "Execute structured terminal diagnostic workflows to observe protocol behavior, host socket states, and telemetry data for Network Performance Engineering: Bandwidth, Throughput, Latency & Jitter.",
    "tasks": [
      "Execute terminal diagnostic command to inspect operational host network state.",
      "Analyze output telemetry fields and verify protocol state transitions.",
      "Record observations and confirm baseline network health."
    ],
    "commands": [
      "ping 192.168.1.1",
      "arp -a",
      "nslookup netvision.edu",
      "traceroute 8.8.8.8"
    ],
    "expectedObservations": [
      "Host IPv4 address and default gateway binding",
      "DNS name resolution to IP address mapping",
      "ICMP echo reply with latency telemetry"
    ],
    "hints": [
      "Use standard network diagnostic utilities (`ping`, `traceroute`, `arp`).",
      "Verify that the default gateway responds to ICMP requests."
    ],
    "completionCriteria": "Host operational telemetry observed and verified.",
    "solution": {
      "steps": [
        "Step: Execute terminal diagnostic command to inspect operational host network state.",
        "Step: Analyze output telemetry fields and verify protocol state transitions.",
        "Step: Record observations and confirm baseline network health."
      ]
    }
  },
  "level-0-network-protocols-standards": {
    "title": "Conceptual & Analytical Exploration: Network Protocols & Standards: Syntax, Semantics & Standards Bodies",
    "tier": "TIER_3_CONCEPTUAL",
    difficulty: CourseLevel.FOUNDATIONAL,
    "estimatedMinutes": 15,
    "initialTopologyJson": {
      "nodes": [
        "Host-A",
        "Gateway-R1"
      ],
      "type": "Standard"
    },
    "instructions": "Examine theoretical principles, framing architectures, and mathematical calculations for Network Protocols & Standards: Syntax, Semantics & Standards Bodies. Analyze data structures, bit encodings, and protocol stack hierarchies without artificial device CLI simulation.",
    "tasks": [
      "Analyze protocol data unit (PDU) framing fields and encapsulation byte offsets.",
      "Calculate theoretical link transmission capacity and channel propagation characteristics.",
      "Synthesize architectural layer primitives and service access points."
    ],
    "commands": [],
    "expectedObservations": [
      "Binary bitwise representation and hexadecimal notation",
      "Encapsulation header diagram and byte boundaries"
    ],
    "hints": [
      "Focus on the mathematical relationships between bits, bytes, and channel capacities.",
      "Follow the encapsulation sequence from Layer 7 Application down to Layer 1 Physical."
    ],
    "completionCriteria": "Analytical model verified against theoretical networking specifications.",
    "solution": {
      "steps": [
        "Step: Analyze protocol data unit (PDU) framing fields and encapsulation byte offsets.",
        "Step: Calculate theoretical link transmission capacity and channel propagation characteristics.",
        "Step: Synthesize architectural layer primitives and service access points."
      ]
    }
  },
  "osi-model-7-layers": {
    "title": "Conceptual & Analytical Exploration: The 7-Layer OSI Reference Model: Theoretical Architecture & Service Primitives",
    "tier": "TIER_3_CONCEPTUAL",
    difficulty: CourseLevel.FOUNDATIONAL,
    "estimatedMinutes": 15,
    "initialTopologyJson": {
      "nodes": [
        "Host-A",
        "Gateway-R1"
      ],
      "type": "Standard"
    },
    "instructions": "Examine theoretical principles, framing architectures, and mathematical calculations for The 7-Layer OSI Reference Model: Theoretical Architecture & Service Primitives. Analyze data structures, bit encodings, and protocol stack hierarchies without artificial device CLI simulation.",
    "tasks": [
      "Analyze protocol data unit (PDU) framing fields and encapsulation byte offsets.",
      "Calculate theoretical link transmission capacity and channel propagation characteristics.",
      "Synthesize architectural layer primitives and service access points."
    ],
    "commands": [],
    "expectedObservations": [
      "Binary bitwise representation and hexadecimal notation",
      "Encapsulation header diagram and byte boundaries"
    ],
    "hints": [
      "Focus on the mathematical relationships between bits, bytes, and channel capacities.",
      "Follow the encapsulation sequence from Layer 7 Application down to Layer 1 Physical."
    ],
    "completionCriteria": "Analytical model verified against theoretical networking specifications.",
    "solution": {
      "steps": [
        "Step: Analyze protocol data unit (PDU) framing fields and encapsulation byte offsets.",
        "Step: Calculate theoretical link transmission capacity and channel propagation characteristics.",
        "Step: Synthesize architectural layer primitives and service access points."
      ]
    }
  },
  "tcp-ip-4-layers": {
    "title": "Conceptual & Analytical Exploration: The TCP/IP 4-Layer Architecture: Practical Implementation & Protocol Mapping",
    "tier": "TIER_3_CONCEPTUAL",
    difficulty: CourseLevel.FOUNDATIONAL,
    "estimatedMinutes": 15,
    "initialTopologyJson": {
      "nodes": [
        "Host-A",
        "Gateway-R1"
      ],
      "type": "Standard"
    },
    "instructions": "Examine theoretical principles, framing architectures, and mathematical calculations for The TCP/IP 4-Layer Architecture: Practical Implementation & Protocol Mapping. Analyze data structures, bit encodings, and protocol stack hierarchies without artificial device CLI simulation.",
    "tasks": [
      "Analyze protocol data unit (PDU) framing fields and encapsulation byte offsets.",
      "Calculate theoretical link transmission capacity and channel propagation characteristics.",
      "Synthesize architectural layer primitives and service access points."
    ],
    "commands": [],
    "expectedObservations": [
      "Binary bitwise representation and hexadecimal notation",
      "Encapsulation header diagram and byte boundaries"
    ],
    "hints": [
      "Focus on the mathematical relationships between bits, bytes, and channel capacities.",
      "Follow the encapsulation sequence from Layer 7 Application down to Layer 1 Physical."
    ],
    "completionCriteria": "Analytical model verified against theoretical networking specifications.",
    "solution": {
      "steps": [
        "Step: Analyze protocol data unit (PDU) framing fields and encapsulation byte offsets.",
        "Step: Calculate theoretical link transmission capacity and channel propagation characteristics.",
        "Step: Synthesize architectural layer primitives and service access points."
      ]
    }
  },
  "level-0-mac-addresses-physical-identity": {
    "title": "Guided Engineering Practice: MAC Addresses & Physical Hardware Identity",
    "tier": "TIER_2_GUIDED",
    difficulty: CourseLevel.BEGINNER,
    "estimatedMinutes": 15,
    "initialTopologyJson": {
      "nodes": [
        "Host-A",
        "Gateway-R1"
      ],
      "type": "Standard"
    },
    "instructions": "Execute structured terminal diagnostic workflows to observe protocol behavior, host socket states, and telemetry data for MAC Addresses & Physical Hardware Identity.",
    "tasks": [
      "Execute terminal diagnostic command to inspect operational host network state.",
      "Analyze output telemetry fields and verify protocol state transitions.",
      "Record observations and confirm baseline network health."
    ],
    "commands": [
      "ping 192.168.1.1",
      "arp -a",
      "nslookup netvision.edu",
      "traceroute 8.8.8.8"
    ],
    "expectedObservations": [
      "Host IPv4 address and default gateway binding",
      "DNS name resolution to IP address mapping",
      "ICMP echo reply with latency telemetry"
    ],
    "hints": [
      "Use standard network diagnostic utilities (`ping`, `traceroute`, `arp`).",
      "Verify that the default gateway responds to ICMP requests."
    ],
    "completionCriteria": "Host operational telemetry observed and verified.",
    "solution": {
      "steps": [
        "Step: Execute terminal diagnostic command to inspect operational host network state.",
        "Step: Analyze output telemetry fields and verify protocol state transitions.",
        "Step: Record observations and confirm baseline network health."
      ]
    }
  },
  "ethernet-mac-addresses-overview": {
    "title": "Guided Engineering Practice: Ethernet II Framing, Frame Formats & Transmission Mechanics",
    "tier": "TIER_2_GUIDED",
    difficulty: CourseLevel.BEGINNER,
    "estimatedMinutes": 15,
    "initialTopologyJson": {
      "nodes": [
        "Host-A",
        "Gateway-R1"
      ],
      "type": "Standard"
    },
    "instructions": "Execute structured terminal diagnostic workflows to observe protocol behavior, host socket states, and telemetry data for Ethernet II Framing, Frame Formats & Transmission Mechanics.",
    "tasks": [
      "Execute terminal diagnostic command to inspect operational host network state.",
      "Analyze output telemetry fields and verify protocol state transitions.",
      "Record observations and confirm baseline network health."
    ],
    "commands": [
      "ping 192.168.1.1",
      "arp -a",
      "nslookup netvision.edu",
      "traceroute 8.8.8.8"
    ],
    "expectedObservations": [
      "Host IPv4 address and default gateway binding",
      "DNS name resolution to IP address mapping",
      "ICMP echo reply with latency telemetry"
    ],
    "hints": [
      "Use standard network diagnostic utilities (`ping`, `traceroute`, `arp`).",
      "Verify that the default gateway responds to ICMP requests."
    ],
    "completionCriteria": "Host operational telemetry observed and verified.",
    "solution": {
      "steps": [
        "Step: Execute terminal diagnostic command to inspect operational host network state.",
        "Step: Analyze output telemetry fields and verify protocol state transitions.",
        "Step: Record observations and confirm baseline network health."
      ]
    }
  },
  "level-0-switches-local-lan-forwarders": {
    "title": "Guided Engineering Practice: Switches: Local LAN Frame Forwarders & MAC Address Tables",
    "tier": "TIER_2_GUIDED",
    difficulty: CourseLevel.BEGINNER,
    "estimatedMinutes": 15,
    "initialTopologyJson": {
      "nodes": [
        "Host-A",
        "Gateway-R1"
      ],
      "type": "Standard"
    },
    "instructions": "Execute structured terminal diagnostic workflows to observe protocol behavior, host socket states, and telemetry data for Switches: Local LAN Frame Forwarders & MAC Address Tables.",
    "tasks": [
      "Execute terminal diagnostic command to inspect operational host network state.",
      "Analyze output telemetry fields and verify protocol state transitions.",
      "Record observations and confirm baseline network health."
    ],
    "commands": [
      "ping 192.168.1.1",
      "arp -a",
      "nslookup netvision.edu",
      "traceroute 8.8.8.8"
    ],
    "expectedObservations": [
      "Host IPv4 address and default gateway binding",
      "DNS name resolution to IP address mapping",
      "ICMP echo reply with latency telemetry"
    ],
    "hints": [
      "Use standard network diagnostic utilities (`ping`, `traceroute`, `arp`).",
      "Verify that the default gateway responds to ICMP requests."
    ],
    "completionCriteria": "Host operational telemetry observed and verified.",
    "solution": {
      "steps": [
        "Step: Execute terminal diagnostic command to inspect operational host network state.",
        "Step: Analyze output telemetry fields and verify protocol state transitions.",
        "Step: Record observations and confirm baseline network health."
      ]
    }
  },
  "switching-vlans-overview": {
    "title": "Engineering Simulation: Enterprise VLAN Segmentation & 802.1Q Trunking",
    "tier": "TIER_1_SIMULATION",
    difficulty: CourseLevel.BEGINNER,
    "estimatedMinutes": 25,
    "initialTopologyJson": {
      "switches": [
        "SW1"
      ],
      "accessPorts": [
        "Fa0/1",
        "Fa0/2"
      ],
      "trunkPorts": [
        "Gi0/1"
      ]
    },
    "instructions": "Configure VLAN 20 (SALES) on switch SW1, assign access port FastEthernet0/2, and verify 802.1Q trunking on GigabitEthernet0/1 to enable inter-VLAN forwarding.",
    "tasks": [
      "Enter global configuration mode and create VLAN 20 named SALES.",
      "Assign interface FastEthernet0/2 to access VLAN 20.",
      "Configure GigabitEthernet0/1 as an 802.1Q trunk port allowing VLANs 1, 10, and 20.",
      "Execute `show vlan brief` and `show interfaces trunk` to verify operational port membership."
    ],
    "commands": [
      "configure terminal",
      "vlan 20",
      "name SALES",
      "interface FastEthernet0/2",
      "switchport mode access",
      "switchport access vlan 20",
      "interface GigabitEthernet0/1",
      "switchport mode trunk",
      "show vlan brief",
      "show interfaces trunk"
    ],
    "expectedObservations": [
      "VLAN 20 SALES active on FastEthernet0/2",
      "GigabitEthernet0/1 trunking 802.1q with VLANs 1, 10, 20 allowed"
    ],
    "hints": [
      "Use `vlan 20` followed by `name SALES` in global configuration mode.",
      "Navigate to interface `int fa0/2` and apply `switchport access vlan 20`.",
      "Configure `switchport mode trunk` under interface `gi0/1`."
    ],
    "completionCriteria": "VLAN 20 configured with active ports and Gi0/1 established as an active 802.1Q trunk.",
    "solution": {
      "steps": [
        "Step: Enter global configuration mode and create VLAN 20 named SALES.",
        "Step: Assign interface FastEthernet0/2 to access VLAN 20.",
        "Step: Configure GigabitEthernet0/1 as an 802.1Q trunk port allowing VLANs 1, 10, and 20.",
        "Step: Execute `show vlan brief` and `show interfaces trunk` to verify operational port membership."
      ]
    }
  },
  "net-302-spanning-tree-protocol-loop-prevention": {
    "title": "Engineering Simulation: STP Root Bridge Election & Priority Tuning",
    "tier": "TIER_1_SIMULATION",
    difficulty: CourseLevel.BEGINNER,
    "estimatedMinutes": 25,
    "initialTopologyJson": {
      "switches": [
        "SW-ACCESS",
        "SW-CORE"
      ],
      "bridgePriority": 32768
    },
    "instructions": "Prevent Layer-2 broadcast storms by adjusting IEEE 802.1D STP bridge priorities to elect SW-ACCESS as the Root Bridge for VLAN 1 and verify root port transitions.",
    "tasks": [
      "Inspect the active spanning-tree topology using `show spanning-tree`.",
      "Tune bridge priority on SW-ACCESS to 4096 (`spanning-tree vlan 1 priority 4096`).",
      "Verify root bridge transition and confirm zero blocking loops across trunk links."
    ],
    "commands": [
      "show spanning-tree",
      "configure terminal",
      "spanning-tree vlan 1 priority 4096",
      "show spanning-tree"
    ],
    "expectedObservations": [
      "Bridge ID priority 4096 sys-id-ext 1",
      "This bridge is the root"
    ],
    "hints": [
      "Bridge priority must be configured in multiples of 4096 (e.g. 4096, 8192, 16384).",
      "A lower priority value (4096 < 32768) wins the Root Bridge election."
    ],
    "completionCriteria": "Bridge priority tuned below 32768 and root bridge election verified.",
    "solution": {
      "steps": [
        "Step: Inspect the active spanning-tree topology using `show spanning-tree`.",
        "Step: Tune bridge priority on SW-ACCESS to 4096 (`spanning-tree vlan 1 priority 4096`).",
        "Step: Verify root bridge transition and confirm zero blocking loops across trunk links."
      ]
    }
  },
  "net-202-ipv4-addressing-cidr": {
    "title": "Engineering Simulation: IPv4 Addressing, Subnet Masks & CIDR Subnetting",
    "tier": "TIER_1_SIMULATION",
    difficulty: CourseLevel.BEGINNER,
    "estimatedMinutes": 25,
    "initialTopologyJson": {
      "nodes": [
        "Host-A",
        "Gateway-R1"
      ],
      "type": "Standard"
    },
    "instructions": "Perform hands-on configuration and protocol verification for IPv4 Addressing, Subnet Masks & CIDR Subnetting. Configure device interfaces, inspect routing tables, and verify socket communication.",
    "tasks": [
      "Inspect interface addressing and status using `show ip interface brief` or `ipconfig /all`.",
      "Execute diagnostic reachability tests using `ping` and `arp -a`.",
      "Verify protocol state convergence and operational status."
    ],
    "commands": [
      "show ip route",
      "ping 192.168.1.1",
      "arp -a"
    ],
    "expectedObservations": [
      "Operational interface IP and subnet mask",
      "ARP cache binding IP to physical MAC address"
    ],
    "hints": [
      "Check IP addressing and subnet mask configuration.",
      "Run ping to confirm Layer 3 routing."
    ],
    "completionCriteria": "Interface addressing and socket reachability validated.",
    "solution": {
      "steps": [
        "Step: Inspect interface addressing and status using `show ip interface brief` or `ipconfig /all`.",
        "Step: Execute diagnostic reachability tests using `ping` and `arp -a`.",
        "Step: Verify protocol state convergence and operational status."
      ]
    }
  },
  "level-0-ip-addresses-logical-location": {
    "title": "Guided Engineering Practice: Special-Use IPv4 Ranges & Enterprise Allocation",
    "tier": "TIER_2_GUIDED",
    difficulty: CourseLevel.BEGINNER,
    "estimatedMinutes": 15,
    "initialTopologyJson": {
      "nodes": [
        "Host-A",
        "Gateway-R1"
      ],
      "type": "Standard"
    },
    "instructions": "Execute structured terminal diagnostic workflows to observe protocol behavior, host socket states, and telemetry data for Special-Use IPv4 Ranges & Enterprise Allocation.",
    "tasks": [
      "Execute terminal diagnostic command to inspect operational host network state.",
      "Analyze output telemetry fields and verify protocol state transitions.",
      "Record observations and confirm baseline network health."
    ],
    "commands": [
      "ping 192.168.1.1",
      "arp -a",
      "nslookup netvision.edu",
      "traceroute 8.8.8.8"
    ],
    "expectedObservations": [
      "Host IPv4 address and default gateway binding",
      "DNS name resolution to IP address mapping",
      "ICMP echo reply with latency telemetry"
    ],
    "hints": [
      "Use standard network diagnostic utilities (`ping`, `traceroute`, `arp`).",
      "Verify that the default gateway responds to ICMP requests."
    ],
    "completionCriteria": "Host operational telemetry observed and verified.",
    "solution": {
      "steps": [
        "Step: Execute terminal diagnostic command to inspect operational host network state.",
        "Step: Analyze output telemetry fields and verify protocol state transitions.",
        "Step: Record observations and confirm baseline network health."
      ]
    }
  },
  "ip-addressing-ipv4-overview": {
    "title": "Guided Engineering Practice: Classful IPv4 History & The Architectural Necessity of CIDR",
    "tier": "TIER_2_GUIDED",
    difficulty: CourseLevel.BEGINNER,
    "estimatedMinutes": 15,
    "initialTopologyJson": {
      "nodes": [
        "Host-A",
        "Gateway-R1"
      ],
      "type": "Standard"
    },
    "instructions": "Execute structured terminal diagnostic workflows to observe protocol behavior, host socket states, and telemetry data for Classful IPv4 History & The Architectural Necessity of CIDR.",
    "tasks": [
      "Execute terminal diagnostic command to inspect operational host network state.",
      "Analyze output telemetry fields and verify protocol state transitions.",
      "Record observations and confirm baseline network health."
    ],
    "commands": [
      "ping 192.168.1.1",
      "arp -a",
      "nslookup netvision.edu",
      "traceroute 8.8.8.8"
    ],
    "expectedObservations": [
      "Host IPv4 address and default gateway binding",
      "DNS name resolution to IP address mapping",
      "ICMP echo reply with latency telemetry"
    ],
    "hints": [
      "Use standard network diagnostic utilities (`ping`, `traceroute`, `arp`).",
      "Verify that the default gateway responds to ICMP requests."
    ],
    "completionCriteria": "Host operational telemetry observed and verified.",
    "solution": {
      "steps": [
        "Step: Execute terminal diagnostic command to inspect operational host network state.",
        "Step: Analyze output telemetry fields and verify protocol state transitions.",
        "Step: Record observations and confirm baseline network health."
      ]
    }
  },
  "subnetting-cidr-overview": {
    "title": "Engineering Simulation: VLSM Design & Multi-Department Address Allocation",
    "tier": "TIER_1_SIMULATION",
    difficulty: CourseLevel.BEGINNER,
    "estimatedMinutes": 25,
    "initialTopologyJson": {
      "nodes": [
        "Host-A",
        "Gateway-R1"
      ],
      "type": "Standard"
    },
    "instructions": "Perform hands-on configuration and protocol verification for VLSM Design & Multi-Department Address Allocation. Configure device interfaces, inspect routing tables, and verify socket communication.",
    "tasks": [
      "Inspect interface addressing and status using `show ip interface brief` or `ipconfig /all`.",
      "Execute diagnostic reachability tests using `ping` and `arp -a`.",
      "Verify protocol state convergence and operational status."
    ],
    "commands": [
      "show ip route",
      "ping 192.168.1.1",
      "arp -a"
    ],
    "expectedObservations": [
      "Operational interface IP and subnet mask",
      "ARP cache binding IP to physical MAC address"
    ],
    "hints": [
      "Check IP addressing and subnet mask configuration.",
      "Run ping to confirm Layer 3 routing."
    ],
    "completionCriteria": "Interface addressing and socket reachability validated.",
    "solution": {
      "steps": [
        "Step: Inspect interface addressing and status using `show ip interface brief` or `ipconfig /all`.",
        "Step: Execute diagnostic reachability tests using `ping` and `arp -a`.",
        "Step: Verify protocol state convergence and operational status."
      ]
    }
  },
  "level-0-dns-internet-phonebook": {
    "title": "Guided Engineering Practice: Domain Name System (DNS) & Name Resolution Architecture",
    "tier": "TIER_2_GUIDED",
    difficulty: CourseLevel.INTERMEDIATE,
    "estimatedMinutes": 15,
    "initialTopologyJson": {
      "nodes": [
        "Host-A",
        "Gateway-R1"
      ],
      "type": "Standard"
    },
    "instructions": "Execute structured terminal diagnostic workflows to observe protocol behavior, host socket states, and telemetry data for Domain Name System (DNS) & Name Resolution Architecture.",
    "tasks": [
      "Execute terminal diagnostic command to inspect operational host network state.",
      "Analyze output telemetry fields and verify protocol state transitions.",
      "Record observations and confirm baseline network health."
    ],
    "commands": [
      "ping 192.168.1.1",
      "arp -a",
      "nslookup netvision.edu",
      "traceroute 8.8.8.8"
    ],
    "expectedObservations": [
      "Host IPv4 address and default gateway binding",
      "DNS name resolution to IP address mapping",
      "ICMP echo reply with latency telemetry"
    ],
    "hints": [
      "Use standard network diagnostic utilities (`ping`, `traceroute`, `arp`).",
      "Verify that the default gateway responds to ICMP requests."
    ],
    "completionCriteria": "Host operational telemetry observed and verified.",
    "solution": {
      "steps": [
        "Step: Execute terminal diagnostic command to inspect operational host network state.",
        "Step: Analyze output telemetry fields and verify protocol state transitions.",
        "Step: Record observations and confirm baseline network health."
      ]
    }
  },
  "level-0-dhcp-automatic-ip-allocation": {
    "title": "Guided Engineering Practice: Dynamic Host Configuration Protocol (DHCP) & IP Leasing",
    "tier": "TIER_2_GUIDED",
    difficulty: CourseLevel.INTERMEDIATE,
    "estimatedMinutes": 15,
    "initialTopologyJson": {
      "nodes": [
        "Host-A",
        "Gateway-R1"
      ],
      "type": "Standard"
    },
    "instructions": "Execute structured terminal diagnostic workflows to observe protocol behavior, host socket states, and telemetry data for Dynamic Host Configuration Protocol (DHCP) & IP Leasing.",
    "tasks": [
      "Execute terminal diagnostic command to inspect operational host network state.",
      "Analyze output telemetry fields and verify protocol state transitions.",
      "Record observations and confirm baseline network health."
    ],
    "commands": [
      "ping 192.168.1.1",
      "arp -a",
      "nslookup netvision.edu",
      "traceroute 8.8.8.8"
    ],
    "expectedObservations": [
      "Host IPv4 address and default gateway binding",
      "DNS name resolution to IP address mapping",
      "ICMP echo reply with latency telemetry"
    ],
    "hints": [
      "Use standard network diagnostic utilities (`ping`, `traceroute`, `arp`).",
      "Verify that the default gateway responds to ICMP requests."
    ],
    "completionCriteria": "Host operational telemetry observed and verified.",
    "solution": {
      "steps": [
        "Step: Execute terminal diagnostic command to inspect operational host network state.",
        "Step: Analyze output telemetry fields and verify protocol state transitions.",
        "Step: Record observations and confirm baseline network health."
      ]
    }
  },
  "arp-protocol-overview": {
    "title": "Engineering Simulation: Address Resolution Protocol (ARP) & Layer 2/3 Binding",
    "tier": "TIER_1_SIMULATION",
    difficulty: CourseLevel.INTERMEDIATE,
    "estimatedMinutes": 25,
    "initialTopologyJson": {
      "nodes": [
        "Host-A",
        "Gateway-R1"
      ],
      "type": "Standard"
    },
    "instructions": "Perform hands-on configuration and protocol verification for Address Resolution Protocol (ARP) & Layer 2/3 Binding. Configure device interfaces, inspect routing tables, and verify socket communication.",
    "tasks": [
      "Inspect interface addressing and status using `show ip interface brief` or `ipconfig /all`.",
      "Execute diagnostic reachability tests using `ping` and `arp -a`.",
      "Verify protocol state convergence and operational status."
    ],
    "commands": [
      "show ip route",
      "ping 192.168.1.1",
      "arp -a"
    ],
    "expectedObservations": [
      "Operational interface IP and subnet mask",
      "ARP cache binding IP to physical MAC address"
    ],
    "hints": [
      "Check IP addressing and subnet mask configuration.",
      "Run ping to confirm Layer 3 routing."
    ],
    "completionCriteria": "Interface addressing and socket reachability validated.",
    "solution": {
      "steps": [
        "Step: Inspect interface addressing and status using `show ip interface brief` or `ipconfig /all`.",
        "Step: Execute diagnostic reachability tests using `ping` and `arp -a`.",
        "Step: Verify protocol state convergence and operational status."
      ]
    }
  },
  "dhcp-dns-overview": {
    "title": "Engineering Simulation: The Integrated Host Boot-Up Lifecycle: From Cold Boot to Web Request",
    "tier": "TIER_1_SIMULATION",
    difficulty: CourseLevel.INTERMEDIATE,
    "estimatedMinutes": 25,
    "initialTopologyJson": {
      "nodes": [
        "Host-A",
        "Gateway-R1"
      ],
      "type": "Standard"
    },
    "instructions": "Perform hands-on configuration and protocol verification for The Integrated Host Boot-Up Lifecycle: From Cold Boot to Web Request. Configure device interfaces, inspect routing tables, and verify socket communication.",
    "tasks": [
      "Inspect interface addressing and status using `show ip interface brief` or `ipconfig /all`.",
      "Execute diagnostic reachability tests using `ping` and `arp -a`.",
      "Verify protocol state convergence and operational status."
    ],
    "commands": [
      "show ip route",
      "ping 192.168.1.1",
      "arp -a"
    ],
    "expectedObservations": [
      "Operational interface IP and subnet mask",
      "ARP cache binding IP to physical MAC address"
    ],
    "hints": [
      "Check IP addressing and subnet mask configuration.",
      "Run ping to confirm Layer 3 routing."
    ],
    "completionCriteria": "Interface addressing and socket reachability validated.",
    "solution": {
      "steps": [
        "Step: Inspect interface addressing and status using `show ip interface brief` or `ipconfig /all`.",
        "Step: Execute diagnostic reachability tests using `ping` and `arp -a`.",
        "Step: Verify protocol state convergence and operational status."
      ]
    }
  },
  "ipv6-foundations-overview": {
    "title": "Guided Engineering Practice: IPv6 Addressing Architecture, SLAAC & Dual-Stack Foundations",
    "tier": "TIER_2_GUIDED",
    difficulty: CourseLevel.INTERMEDIATE,
    "estimatedMinutes": 15,
    "initialTopologyJson": {
      "nodes": [
        "Host-A",
        "Gateway-R1"
      ],
      "type": "Standard"
    },
    "instructions": "Execute structured terminal diagnostic workflows to observe protocol behavior, host socket states, and telemetry data for IPv6 Addressing Architecture, SLAAC & Dual-Stack Foundations.",
    "tasks": [
      "Execute terminal diagnostic command to inspect operational host network state.",
      "Analyze output telemetry fields and verify protocol state transitions.",
      "Record observations and confirm baseline network health."
    ],
    "commands": [
      "ping 192.168.1.1",
      "arp -a",
      "nslookup netvision.edu",
      "traceroute 8.8.8.8"
    ],
    "expectedObservations": [
      "Host IPv4 address and default gateway binding",
      "DNS name resolution to IP address mapping",
      "ICMP echo reply with latency telemetry"
    ],
    "hints": [
      "Use standard network diagnostic utilities (`ping`, `traceroute`, `arp`).",
      "Verify that the default gateway responds to ICMP requests."
    ],
    "completionCriteria": "Host operational telemetry observed and verified.",
    "solution": {
      "steps": [
        "Step: Execute terminal diagnostic command to inspect operational host network state.",
        "Step: Analyze output telemetry fields and verify protocol state transitions.",
        "Step: Record observations and confirm baseline network health."
      ]
    }
  },
  "level-0-network-ports-socket-boundaries": {
    "title": "Guided Engineering Practice: Network Ports, Socket Endpoints & Layer 4 Multiplexing",
    "tier": "TIER_2_GUIDED",
    difficulty: CourseLevel.INTERMEDIATE,
    "estimatedMinutes": 15,
    "initialTopologyJson": {
      "nodes": [
        "Host-A",
        "Gateway-R1"
      ],
      "type": "Standard"
    },
    "instructions": "Execute structured terminal diagnostic workflows to observe protocol behavior, host socket states, and telemetry data for Network Ports, Socket Endpoints & Layer 4 Multiplexing.",
    "tasks": [
      "Execute terminal diagnostic command to inspect operational host network state.",
      "Analyze output telemetry fields and verify protocol state transitions.",
      "Record observations and confirm baseline network health."
    ],
    "commands": [
      "ping 192.168.1.1",
      "arp -a",
      "nslookup netvision.edu",
      "traceroute 8.8.8.8"
    ],
    "expectedObservations": [
      "Host IPv4 address and default gateway binding",
      "DNS name resolution to IP address mapping",
      "ICMP echo reply with latency telemetry"
    ],
    "hints": [
      "Use standard network diagnostic utilities (`ping`, `traceroute`, `arp`).",
      "Verify that the default gateway responds to ICMP requests."
    ],
    "completionCriteria": "Host operational telemetry observed and verified.",
    "solution": {
      "steps": [
        "Step: Execute terminal diagnostic command to inspect operational host network state.",
        "Step: Analyze output telemetry fields and verify protocol state transitions.",
        "Step: Record observations and confirm baseline network health."
      ]
    }
  },
  "level-0-network-packets-data-framing": {
    "title": "Guided Engineering Practice: Transport Layer Segmentation, MTU & Path MTU Discovery",
    "tier": "TIER_2_GUIDED",
    difficulty: CourseLevel.INTERMEDIATE,
    "estimatedMinutes": 15,
    "initialTopologyJson": {
      "nodes": [
        "Host-A",
        "Gateway-R1"
      ],
      "type": "Standard"
    },
    "instructions": "Execute structured terminal diagnostic workflows to observe protocol behavior, host socket states, and telemetry data for Transport Layer Segmentation, MTU & Path MTU Discovery.",
    "tasks": [
      "Execute terminal diagnostic command to inspect operational host network state.",
      "Analyze output telemetry fields and verify protocol state transitions.",
      "Record observations and confirm baseline network health."
    ],
    "commands": [
      "ping 192.168.1.1",
      "arp -a",
      "nslookup netvision.edu",
      "traceroute 8.8.8.8"
    ],
    "expectedObservations": [
      "Host IPv4 address and default gateway binding",
      "DNS name resolution to IP address mapping",
      "ICMP echo reply with latency telemetry"
    ],
    "hints": [
      "Use standard network diagnostic utilities (`ping`, `traceroute`, `arp`).",
      "Verify that the default gateway responds to ICMP requests."
    ],
    "completionCriteria": "Host operational telemetry observed and verified.",
    "solution": {
      "steps": [
        "Step: Execute terminal diagnostic command to inspect operational host network state.",
        "Step: Analyze output telemetry fields and verify protocol state transitions.",
        "Step: Record observations and confirm baseline network health."
      ]
    }
  },
  "tcp-udp-transport-overview": {
    "title": "Guided Engineering Practice: TCP & UDP Transport Protocols: Connection Management, Reliability & Flow Control",
    "tier": "TIER_2_GUIDED",
    difficulty: CourseLevel.INTERMEDIATE,
    "estimatedMinutes": 15,
    "initialTopologyJson": {
      "nodes": [
        "Host-A",
        "Gateway-R1"
      ],
      "type": "Standard"
    },
    "instructions": "Execute structured terminal diagnostic workflows to observe protocol behavior, host socket states, and telemetry data for TCP & UDP Transport Protocols: Connection Management, Reliability & Flow Control.",
    "tasks": [
      "Execute terminal diagnostic command to inspect operational host network state.",
      "Analyze output telemetry fields and verify protocol state transitions.",
      "Record observations and confirm baseline network health."
    ],
    "commands": [
      "ping 192.168.1.1",
      "arp -a",
      "nslookup netvision.edu",
      "traceroute 8.8.8.8"
    ],
    "expectedObservations": [
      "Host IPv4 address and default gateway binding",
      "DNS name resolution to IP address mapping",
      "ICMP echo reply with latency telemetry"
    ],
    "hints": [
      "Use standard network diagnostic utilities (`ping`, `traceroute`, `arp`).",
      "Verify that the default gateway responds to ICMP requests."
    ],
    "completionCriteria": "Host operational telemetry observed and verified.",
    "solution": {
      "steps": [
        "Step: Execute terminal diagnostic command to inspect operational host network state.",
        "Step: Analyze output telemetry fields and verify protocol state transitions.",
        "Step: Record observations and confirm baseline network health."
      ]
    }
  },
  "level-0-routers-inter-subnet-pathfinders": {
    "title": "Guided Engineering Practice: Routers: Inter-Subnet Path Finders & Forwarding Engine",
    "tier": "TIER_2_GUIDED",
    difficulty: CourseLevel.INTERMEDIATE,
    "estimatedMinutes": 15,
    "initialTopologyJson": {
      "nodes": [
        "Host-A",
        "Gateway-R1"
      ],
      "type": "Standard"
    },
    "instructions": "Execute structured terminal diagnostic workflows to observe protocol behavior, host socket states, and telemetry data for Routers: Inter-Subnet Path Finders & Forwarding Engine.",
    "tasks": [
      "Execute terminal diagnostic command to inspect operational host network state.",
      "Analyze output telemetry fields and verify protocol state transitions.",
      "Record observations and confirm baseline network health."
    ],
    "commands": [
      "ping 192.168.1.1",
      "arp -a",
      "nslookup netvision.edu",
      "traceroute 8.8.8.8"
    ],
    "expectedObservations": [
      "Host IPv4 address and default gateway binding",
      "DNS name resolution to IP address mapping",
      "ICMP echo reply with latency telemetry"
    ],
    "hints": [
      "Use standard network diagnostic utilities (`ping`, `traceroute`, `arp`).",
      "Verify that the default gateway responds to ICMP requests."
    ],
    "completionCriteria": "Host operational telemetry observed and verified.",
    "solution": {
      "steps": [
        "Step: Execute terminal diagnostic command to inspect operational host network state.",
        "Step: Analyze output telemetry fields and verify protocol state transitions.",
        "Step: Record observations and confirm baseline network health."
      ]
    }
  },
  "routing-fundamentals-overview": {
    "title": "Guided Engineering Practice: Routing Fundamentals: Longest Prefix Match, Administrative Distance & Static Routes",
    "tier": "TIER_2_GUIDED",
    difficulty: CourseLevel.INTERMEDIATE,
    "estimatedMinutes": 15,
    "initialTopologyJson": {
      "nodes": [
        "Host-A",
        "Gateway-R1"
      ],
      "type": "Standard"
    },
    "instructions": "Execute structured terminal diagnostic workflows to observe protocol behavior, host socket states, and telemetry data for Routing Fundamentals: Longest Prefix Match, Administrative Distance & Static Routes.",
    "tasks": [
      "Execute terminal diagnostic command to inspect operational host network state.",
      "Analyze output telemetry fields and verify protocol state transitions.",
      "Record observations and confirm baseline network health."
    ],
    "commands": [
      "ping 192.168.1.1",
      "arp -a",
      "nslookup netvision.edu",
      "traceroute 8.8.8.8"
    ],
    "expectedObservations": [
      "Host IPv4 address and default gateway binding",
      "DNS name resolution to IP address mapping",
      "ICMP echo reply with latency telemetry"
    ],
    "hints": [
      "Use standard network diagnostic utilities (`ping`, `traceroute`, `arp`).",
      "Verify that the default gateway responds to ICMP requests."
    ],
    "completionCriteria": "Host operational telemetry observed and verified.",
    "solution": {
      "steps": [
        "Step: Execute terminal diagnostic command to inspect operational host network state.",
        "Step: Analyze output telemetry fields and verify protocol state transitions.",
        "Step: Record observations and confirm baseline network health."
      ]
    }
  },
  "net-304-single-area-ospf-routing": {
    "title": "Engineering Simulation: Single/Multi-Area OSPF Adjacency & SPF Calculation",
    "tier": "TIER_1_SIMULATION",
    difficulty: CourseLevel.INTERMEDIATE,
    "estimatedMinutes": 25,
    "initialTopologyJson": {
      "routers": [
        "R1",
        "R2"
      ],
      "area": 0,
      "subnet": "10.0.0.0/30"
    },
    "instructions": "Configure OSPF Process 1 on R1, advertise the backbone transit link 10.0.0.0/30 into Area 0, and verify full two-way neighbor adjacency convergence with R2.",
    "tasks": [
      "Enter router OSPF configuration mode with Process ID 1.",
      "Advertise subnet 10.0.0.0 with wildcard 0.0.0.3 into Area 0 (`network 10.0.0.0 0.0.0.3 area 0`).",
      "Verify neighbor state transition from INIT to FULL via `show ip ospf neighbor`.",
      "Verify learned OSPF routes in the routing table using `show ip route`."
    ],
    "commands": [
      "configure terminal",
      "router ospf 1",
      "network 10.0.0.0 0.0.0.3 area 0",
      "show ip ospf neighbor",
      "show ip route"
    ],
    "expectedObservations": [
      "Neighbor 2.2.2.2 in state FULL/DR on GigabitEthernet0/1",
      "OSPF route codes injected in routing table"
    ],
    "hints": [
      "The network statement format is `network <ip> <wildcard-mask> area <area-id>`.",
      "For a /30 subnet (255.255.255.252), the wildcard mask is 0.0.0.3."
    ],
    "completionCriteria": "OSPF neighbor adjacency in FULL state and OSPF routes in RIB.",
    "solution": {
      "steps": [
        "Step: Enter router OSPF configuration mode with Process ID 1.",
        "Step: Advertise subnet 10.0.0.0 with wildcard 0.0.0.3 into Area 0 (`network 10.0.0.0 0.0.0.3 area 0`).",
        "Step: Verify neighbor state transition from INIT to FULL via `show ip ospf neighbor`.",
        "Step: Verify learned OSPF routes in the routing table using `show ip route`."
      ]
    }
  },
  "net-304-multi-area-ospf-redistribution": {
    "title": "Engineering Simulation: Single/Multi-Area OSPF Adjacency & SPF Calculation",
    "tier": "TIER_1_SIMULATION",
    difficulty: CourseLevel.INTERMEDIATE,
    "estimatedMinutes": 25,
    "initialTopologyJson": {
      "routers": [
        "R1",
        "R2"
      ],
      "area": 0,
      "subnet": "10.0.0.0/30"
    },
    "instructions": "Configure OSPF Process 1 on R1, advertise the backbone transit link 10.0.0.0/30 into Area 0, and verify full two-way neighbor adjacency convergence with R2.",
    "tasks": [
      "Enter router OSPF configuration mode with Process ID 1.",
      "Advertise subnet 10.0.0.0 with wildcard 0.0.0.3 into Area 0 (`network 10.0.0.0 0.0.0.3 area 0`).",
      "Verify neighbor state transition from INIT to FULL via `show ip ospf neighbor`.",
      "Verify learned OSPF routes in the routing table using `show ip route`."
    ],
    "commands": [
      "configure terminal",
      "router ospf 1",
      "network 10.0.0.0 0.0.0.3 area 0",
      "show ip ospf neighbor",
      "show ip route"
    ],
    "expectedObservations": [
      "Neighbor 2.2.2.2 in state FULL/DR on GigabitEthernet0/1",
      "OSPF route codes injected in routing table"
    ],
    "hints": [
      "The network statement format is `network <ip> <wildcard-mask> area <area-id>`.",
      "For a /30 subnet (255.255.255.252), the wildcard mask is 0.0.0.3."
    ],
    "completionCriteria": "OSPF neighbor adjacency in FULL state and OSPF routes in RIB.",
    "solution": {
      "steps": [
        "Step: Enter router OSPF configuration mode with Process ID 1.",
        "Step: Advertise subnet 10.0.0.0 with wildcard 0.0.0.3 into Area 0 (`network 10.0.0.0 0.0.0.3 area 0`).",
        "Step: Verify neighbor state transition from INIT to FULL via `show ip ospf neighbor`.",
        "Step: Verify learned OSPF routes in the routing table using `show ip route`."
      ]
    }
  },
  "net-305-standard-extended-ipv4-acls": {
    "title": "Engineering Simulation: Extended ACL Traffic Filtering & Stateful Firewall Inspection",
    "tier": "TIER_1_SIMULATION",
    difficulty: CourseLevel.INTERMEDIATE,
    "estimatedMinutes": 25,
    "initialTopologyJson": {
      "firewall": "EDGE-FW",
      "protectedSubnet": "192.168.1.0/24"
    },
    "instructions": "Deploy an extended access control list (ACL 101) to permit secure HTTPS traffic while dropping unauthorized administrative subnets, then verify stateful inspection.",
    "tasks": [
      "Create extended access list 101 to permit TCP port 443 traffic from 192.168.1.0/24.",
      "Append a deny statement for subnet 10.50.0.0/16 to isolate unauthorized hosts.",
      "Execute `show access-lists` to inspect rule sequence and packet hit counters.",
      "Simulate connection attempts to confirm policy enforcement."
    ],
    "commands": [
      "configure terminal",
      "access-list 101 permit tcp 192.168.1.0/24 any eq 443",
      "access-list 101 deny ip 10.50.0.0/16 any",
      "show access-lists"
    ],
    "expectedObservations": [
      "Extended IP access list 101 with sequence rules",
      "Match counters incrementing on permit/deny hits"
    ],
    "hints": [
      "ACL statements evaluate top-down; place specific permit rules before broader deny rules.",
      "Verify syntax with `show access-lists`."
    ],
    "completionCriteria": "ACL rules committed with active permit and deny sequence entries.",
    "solution": {
      "steps": [
        "Step: Create extended access list 101 to permit TCP port 443 traffic from 192.168.1.0/24.",
        "Step: Append a deny statement for subnet 10.50.0.0/16 to isolate unauthorized hosts.",
        "Step: Execute `show access-lists` to inspect rule sequence and packet hit counters.",
        "Step: Simulate connection attempts to confirm policy enforcement."
      ]
    }
  },
  "net-305-stateful-firewalls-connection-tracking": {
    "title": "Engineering Simulation: Extended ACL Traffic Filtering & Stateful Firewall Inspection",
    "tier": "TIER_1_SIMULATION",
    difficulty: CourseLevel.INTERMEDIATE,
    "estimatedMinutes": 25,
    "initialTopologyJson": {
      "firewall": "EDGE-FW",
      "protectedSubnet": "192.168.1.0/24"
    },
    "instructions": "Deploy an extended access control list (ACL 101) to permit secure HTTPS traffic while dropping unauthorized administrative subnets, then verify stateful inspection.",
    "tasks": [
      "Create extended access list 101 to permit TCP port 443 traffic from 192.168.1.0/24.",
      "Append a deny statement for subnet 10.50.0.0/16 to isolate unauthorized hosts.",
      "Execute `show access-lists` to inspect rule sequence and packet hit counters.",
      "Simulate connection attempts to confirm policy enforcement."
    ],
    "commands": [
      "configure terminal",
      "access-list 101 permit tcp 192.168.1.0/24 any eq 443",
      "access-list 101 deny ip 10.50.0.0/16 any",
      "show access-lists"
    ],
    "expectedObservations": [
      "Extended IP access list 101 with sequence rules",
      "Match counters incrementing on permit/deny hits"
    ],
    "hints": [
      "ACL statements evaluate top-down; place specific permit rules before broader deny rules.",
      "Verify syntax with `show access-lists`."
    ],
    "completionCriteria": "ACL rules committed with active permit and deny sequence entries.",
    "solution": {
      "steps": [
        "Step: Create extended access list 101 to permit TCP port 443 traffic from 192.168.1.0/24.",
        "Step: Append a deny statement for subnet 10.50.0.0/16 to isolate unauthorized hosts.",
        "Step: Execute `show access-lists` to inspect rule sequence and packet hit counters.",
        "Step: Simulate connection attempts to confirm policy enforcement."
      ]
    }
  },
  "network-security-basics-overview": {
    "title": "Guided Engineering Practice: Network Security Fundamentals: CIA Triad, Threat Vectors & Cryptographic Principles",
    "tier": "TIER_2_GUIDED",
    difficulty: CourseLevel.INTERMEDIATE,
    "estimatedMinutes": 15,
    "initialTopologyJson": {
      "nodes": [
        "Host-A",
        "Gateway-R1"
      ],
      "type": "Standard"
    },
    "instructions": "Execute structured terminal diagnostic workflows to observe protocol behavior, host socket states, and telemetry data for Network Security Fundamentals: CIA Triad, Threat Vectors & Cryptographic Principles.",
    "tasks": [
      "Execute terminal diagnostic command to inspect operational host network state.",
      "Analyze output telemetry fields and verify protocol state transitions.",
      "Record observations and confirm baseline network health."
    ],
    "commands": [
      "ping 192.168.1.1",
      "arp -a",
      "nslookup netvision.edu",
      "traceroute 8.8.8.8"
    ],
    "expectedObservations": [
      "Host IPv4 address and default gateway binding",
      "DNS name resolution to IP address mapping",
      "ICMP echo reply with latency telemetry"
    ],
    "hints": [
      "Use standard network diagnostic utilities (`ping`, `traceroute`, `arp`).",
      "Verify that the default gateway responds to ICMP requests."
    ],
    "completionCriteria": "Host operational telemetry observed and verified.",
    "solution": {
      "steps": [
        "Step: Execute terminal diagnostic command to inspect operational host network state.",
        "Step: Analyze output telemetry fields and verify protocol state transitions.",
        "Step: Record observations and confirm baseline network health."
      ]
    }
  },
  "firewalls-acls-overview": {
    "title": "Engineering Simulation: Extended ACL Traffic Filtering & Stateful Firewall Inspection",
    "tier": "TIER_1_SIMULATION",
    difficulty: CourseLevel.INTERMEDIATE,
    "estimatedMinutes": 25,
    "initialTopologyJson": {
      "firewall": "EDGE-FW",
      "protectedSubnet": "192.168.1.0/24"
    },
    "instructions": "Deploy an extended access control list (ACL 101) to permit secure HTTPS traffic while dropping unauthorized administrative subnets, then verify stateful inspection.",
    "tasks": [
      "Create extended access list 101 to permit TCP port 443 traffic from 192.168.1.0/24.",
      "Append a deny statement for subnet 10.50.0.0/16 to isolate unauthorized hosts.",
      "Execute `show access-lists` to inspect rule sequence and packet hit counters.",
      "Simulate connection attempts to confirm policy enforcement."
    ],
    "commands": [
      "configure terminal",
      "access-list 101 permit tcp 192.168.1.0/24 any eq 443",
      "access-list 101 deny ip 10.50.0.0/16 any",
      "show access-lists"
    ],
    "expectedObservations": [
      "Extended IP access list 101 with sequence rules",
      "Match counters incrementing on permit/deny hits"
    ],
    "hints": [
      "ACL statements evaluate top-down; place specific permit rules before broader deny rules.",
      "Verify syntax with `show access-lists`."
    ],
    "completionCriteria": "ACL rules committed with active permit and deny sequence entries.",
    "solution": {
      "steps": [
        "Step: Create extended access list 101 to permit TCP port 443 traffic from 192.168.1.0/24.",
        "Step: Append a deny statement for subnet 10.50.0.0/16 to isolate unauthorized hosts.",
        "Step: Execute `show access-lists` to inspect rule sequence and packet hit counters.",
        "Step: Simulate connection attempts to confirm policy enforcement."
      ]
    }
  },
  "net-401-ipv4-nat-pat-address-translation": {
    "title": "Engineering Simulation: IPv4 PAT Overload Translation & Port Mapping",
    "tier": "TIER_1_SIMULATION",
    difficulty: CourseLevel.INTERMEDIATE,
    "estimatedMinutes": 25,
    "initialTopologyJson": {
      "router": "NAT-GW",
      "insideLan": "192.168.1.0/24",
      "publicIp": "203.0.113.5"
    },
    "instructions": "Configure Port Address Translation (NAT Overload) on router R1 to translate private RFC 1918 addresses from LAN hosts into public routable IP 203.0.113.5.",
    "tasks": [
      "Identify and designate inside interface (Gi0/0) and outside interface (Gi0/1).",
      "Configure dynamic NAT overload: `ip nat inside source list 1 interface GigabitEthernet0/1 overload`.",
      "Trigger outbound ICMP/HTTP packets and verify translation table via `show ip nat translations`."
    ],
    "commands": [
      "configure terminal",
      "interface GigabitEthernet0/0",
      "ip nat inside",
      "interface GigabitEthernet0/1",
      "ip nat outside",
      "ip nat inside source list 1 interface GigabitEthernet0/1 overload",
      "show ip nat translations"
    ],
    "expectedObservations": [
      "Active dynamic PAT mapping inside local IP:port to inside global IP:port"
    ],
    "hints": [
      "Both inside and outside interfaces must be explicitly tagged (`ip nat inside`, `ip nat outside`).",
      "Use `show ip nat translations` to observe dynamic socket bindings."
    ],
    "completionCriteria": "PAT overload active with verified inside-to-outside address translations.",
    "solution": {
      "steps": [
        "Step: Identify and designate inside interface (Gi0/0) and outside interface (Gi0/1).",
        "Step: Configure dynamic NAT overload: `ip nat inside source list 1 interface GigabitEthernet0/1 overload`.",
        "Step: Trigger outbound ICMP/HTTP packets and verify translation table via `show ip nat translations`."
      ]
    }
  },
  "nat-pat-overview": {
    "title": "Engineering Simulation: IPv4 PAT Overload Translation & Port Mapping",
    "tier": "TIER_1_SIMULATION",
    difficulty: CourseLevel.INTERMEDIATE,
    "estimatedMinutes": 25,
    "initialTopologyJson": {
      "router": "NAT-GW",
      "insideLan": "192.168.1.0/24",
      "publicIp": "203.0.113.5"
    },
    "instructions": "Configure Port Address Translation (NAT Overload) on router R1 to translate private RFC 1918 addresses from LAN hosts into public routable IP 203.0.113.5.",
    "tasks": [
      "Identify and designate inside interface (Gi0/0) and outside interface (Gi0/1).",
      "Configure dynamic NAT overload: `ip nat inside source list 1 interface GigabitEthernet0/1 overload`.",
      "Trigger outbound ICMP/HTTP packets and verify translation table via `show ip nat translations`."
    ],
    "commands": [
      "configure terminal",
      "interface GigabitEthernet0/0",
      "ip nat inside",
      "interface GigabitEthernet0/1",
      "ip nat outside",
      "ip nat inside source list 1 interface GigabitEthernet0/1 overload",
      "show ip nat translations"
    ],
    "expectedObservations": [
      "Active dynamic PAT mapping inside local IP:port to inside global IP:port"
    ],
    "hints": [
      "Both inside and outside interfaces must be explicitly tagged (`ip nat inside`, `ip nat outside`).",
      "Use `show ip nat translations` to observe dynamic socket bindings."
    ],
    "completionCriteria": "PAT overload active with verified inside-to-outside address translations.",
    "solution": {
      "steps": [
        "Step: Identify and designate inside interface (Gi0/0) and outside interface (Gi0/1).",
        "Step: Configure dynamic NAT overload: `ip nat inside source list 1 interface GigabitEthernet0/1 overload`.",
        "Step: Trigger outbound ICMP/HTTP packets and verify translation table via `show ip nat translations`."
      ]
    }
  },
  "net-402-ipsec-vpn-cryptographic-tunnels": {
    "title": "Engineering Simulation: IPsec Site-to-Site VPN Tunnel Negotiation & Break-Fix",
    "tier": "TIER_1_SIMULATION",
    difficulty: CourseLevel.INTERMEDIATE,
    "estimatedMinutes": 25,
    "initialTopologyJson": {
      "localPeer": "198.51.100.2",
      "remotePeer": "203.0.113.2",
      "status": "DOWN"
    },
    "instructions": "Diagnose an IKE Phase 1 pre-shared key mismatch error, synchronize encryption and hash parameters between peers, and verify active bidirectional IPsec SAs.",
    "tasks": [
      "Inspect failing tunnel logs using `show crypto isakmp sa`.",
      "Reconfigure matching pre-shared key for peer 203.0.113.2 (`crypto isakmp key SECRET123 address 203.0.113.2`).",
      "Verify Phase 1 state transitions to QM_IDLE and Phase 2 IPsec SAs show active encrypted packet counters."
    ],
    "commands": [
      "show crypto isakmp sa",
      "configure terminal",
      "crypto isakmp key SECRET123 address 203.0.113.2",
      "show crypto isakmp sa",
      "show crypto ipsec sa"
    ],
    "expectedObservations": [
      "ISAKMP SA state QM_IDLE ACTIVE",
      "IPsec SA packets encaps/encrypt/decrypt counters > 0"
    ],
    "hints": [
      "IKE Phase 1 fails if pre-shared keys, encryption ciphers (AES-256), or DH groups mismatch.",
      "Use `show crypto isakmp sa` to check whether Phase 1 reaches QM_IDLE."
    ],
    "completionCriteria": "IKE Phase 1 in QM_IDLE and Phase 2 IPsec SA established.",
    "solution": {
      "steps": [
        "Step: Inspect failing tunnel logs using `show crypto isakmp sa`.",
        "Step: Reconfigure matching pre-shared key for peer 203.0.113.2 (`crypto isakmp key SECRET123 address 203.0.113.2`).",
        "Step: Verify Phase 1 state transitions to QM_IDLE and Phase 2 IPsec SAs show active encrypted packet counters."
      ]
    }
  },
  "vpn-cryptography-overview": {
    "title": "Engineering Simulation: IPsec Site-to-Site VPN Tunnel Negotiation & Break-Fix",
    "tier": "TIER_1_SIMULATION",
    difficulty: CourseLevel.INTERMEDIATE,
    "estimatedMinutes": 25,
    "initialTopologyJson": {
      "localPeer": "198.51.100.2",
      "remotePeer": "203.0.113.2",
      "status": "DOWN"
    },
    "instructions": "Diagnose an IKE Phase 1 pre-shared key mismatch error, synchronize encryption and hash parameters between peers, and verify active bidirectional IPsec SAs.",
    "tasks": [
      "Inspect failing tunnel logs using `show crypto isakmp sa`.",
      "Reconfigure matching pre-shared key for peer 203.0.113.2 (`crypto isakmp key SECRET123 address 203.0.113.2`).",
      "Verify Phase 1 state transitions to QM_IDLE and Phase 2 IPsec SAs show active encrypted packet counters."
    ],
    "commands": [
      "show crypto isakmp sa",
      "configure terminal",
      "crypto isakmp key SECRET123 address 203.0.113.2",
      "show crypto isakmp sa",
      "show crypto ipsec sa"
    ],
    "expectedObservations": [
      "ISAKMP SA state QM_IDLE ACTIVE",
      "IPsec SA packets encaps/encrypt/decrypt counters > 0"
    ],
    "hints": [
      "IKE Phase 1 fails if pre-shared keys, encryption ciphers (AES-256), or DH groups mismatch.",
      "Use `show crypto isakmp sa` to check whether Phase 1 reaches QM_IDLE."
    ],
    "completionCriteria": "IKE Phase 1 in QM_IDLE and Phase 2 IPsec SA established.",
    "solution": {
      "steps": [
        "Step: Inspect failing tunnel logs using `show crypto isakmp sa`.",
        "Step: Reconfigure matching pre-shared key for peer 203.0.113.2 (`crypto isakmp key SECRET123 address 203.0.113.2`).",
        "Step: Verify Phase 1 state transitions to QM_IDLE and Phase 2 IPsec SAs show active encrypted packet counters."
      ]
    }
  },
  "net-404-wireshark-packet-capture": {
    "title": "Engineering Simulation: Wireshark Packet Capture & Header Dissection",
    "tier": "TIER_1_SIMULATION",
    difficulty: CourseLevel.ADVANCED,
    "estimatedMinutes": 25,
    "initialTopologyJson": {
      "captureInterface": "eth0",
      "bufferSize": 262144
    },
    "instructions": "Capture real network frames using `tcpdump`, dissect the 3-way TCP handshake flags (SYN, SYN-ACK, ACK), and isolate MTU fragmentation headers.",
    "tasks": [
      "Initiate a live packet capture on interface eth0 using `tcpdump -nnvv -i eth0`.",
      "Inspect TCP header flags `[S]` (SYN) and `[S.]` (SYN-ACK) to confirm socket negotiation.",
      "Examine IPv4 Identification, Flags, and Fragment Offset fields for MTU sizing."
    ],
    "commands": [
      "tcpdump -nnvv -i eth0",
      "tcpdump -nnvv -i eth0 \"tcp[tcpflags] & (tcp-syn|tcp-ack) != 0\""
    ],
    "expectedObservations": [
      "TCP handshake frames with seq and ack numbers",
      "Packet capture buffer statistics (0 packets dropped)"
    ],
    "hints": [
      "TCP SYN packet has Flags [S] and length 0.",
      "TCP SYN-ACK packet has Flags [S.] acknowledging client sequence + 1."
    ],
    "completionCriteria": "TCP handshake packets captured and protocol header flags dissected.",
    "solution": {
      "steps": [
        "Step: Initiate a live packet capture on interface eth0 using `tcpdump -nnvv -i eth0`.",
        "Step: Inspect TCP header flags `[S]` (SYN) and `[S.]` (SYN-ACK) to confirm socket negotiation.",
        "Step: Examine IPv4 Identification, Flags, and Fragment Offset fields for MTU sizing."
      ]
    }
  },
  "level-0-basic-network-troubleshooting-workflow": {
    "title": "Engineering Simulation: Tier-1 Break-Fix Diagnostic Workflow & Route Remediation",
    "tier": "TIER_1_SIMULATION",
    difficulty: CourseLevel.ADVANCED,
    "estimatedMinutes": 25,
    "initialTopologyJson": {
      "host": "PC-1",
      "router": "T-SHOOT-ROUTER",
      "defaultGatewayMissing": true
    },
    "instructions": "A critical internal server cannot reach the corporate cloud gateway. Follow the structured 7-layer troubleshooting model, identify the missing default route, and restore reachability.",
    "tasks": [
      "Execute `ping 8.8.8.8` to observe the Destination Host Unreachable failure symptom.",
      "Inspect the routing table with `show ip route` to confirm the gateway of last resort is missing.",
      "Apply remediation by configuring the static default route: `ip route 0.0.0.0 0.0.0.0 192.168.1.254`.",
      "Verify 100% end-to-end ICMP reachability with `ping 8.8.8.8`."
    ],
    "commands": [
      "ping 8.8.8.8",
      "show ip route",
      "configure terminal",
      "ip route 0.0.0.0 0.0.0.0 192.168.1.254",
      "ping 8.8.8.8"
    ],
    "expectedObservations": [
      "Initial 100% packet loss on external ping",
      "Gateway of last resort restored in routing table",
      "Subsequent ping succeeds with 0% packet loss"
    ],
    "hints": [
      "If local ping succeeds but external ping fails with \"Destination Host Unreachable\", check for a default route.",
      "The default static route command syntax is `ip route 0.0.0.0 0.0.0.0 <next-hop-ip>`."
    ],
    "completionCriteria": "Missing default route restored and external ping reachability confirmed.",
    "solution": {
      "steps": [
        "Step: Execute `ping 8.8.8.8` to observe the Destination Host Unreachable failure symptom.",
        "Step: Inspect the routing table with `show ip route` to confirm the gateway of last resort is missing.",
        "Step: Apply remediation by configuring the static default route: `ip route 0.0.0.0 0.0.0.0 192.168.1.254`.",
        "Step: Verify 100% end-to-end ICMP reachability with `ping 8.8.8.8`."
      ]
    }
  },
  "network-troubleshooting-overview": {
    "title": "Engineering Simulation: Tier-1 Break-Fix Diagnostic Workflow & Route Remediation",
    "tier": "TIER_1_SIMULATION",
    difficulty: CourseLevel.ADVANCED,
    "estimatedMinutes": 25,
    "initialTopologyJson": {
      "host": "PC-1",
      "router": "T-SHOOT-ROUTER",
      "defaultGatewayMissing": true
    },
    "instructions": "A critical internal server cannot reach the corporate cloud gateway. Follow the structured 7-layer troubleshooting model, identify the missing default route, and restore reachability.",
    "tasks": [
      "Execute `ping 8.8.8.8` to observe the Destination Host Unreachable failure symptom.",
      "Inspect the routing table with `show ip route` to confirm the gateway of last resort is missing.",
      "Apply remediation by configuring the static default route: `ip route 0.0.0.0 0.0.0.0 192.168.1.254`.",
      "Verify 100% end-to-end ICMP reachability with `ping 8.8.8.8`."
    ],
    "commands": [
      "ping 8.8.8.8",
      "show ip route",
      "configure terminal",
      "ip route 0.0.0.0 0.0.0.0 192.168.1.254",
      "ping 8.8.8.8"
    ],
    "expectedObservations": [
      "Initial 100% packet loss on external ping",
      "Gateway of last resort restored in routing table",
      "Subsequent ping succeeds with 0% packet loss"
    ],
    "hints": [
      "If local ping succeeds but external ping fails with \"Destination Host Unreachable\", check for a default route.",
      "The default static route command syntax is `ip route 0.0.0.0 0.0.0.0 <next-hop-ip>`."
    ],
    "completionCriteria": "Missing default route restored and external ping reachability confirmed.",
    "solution": {
      "steps": [
        "Step: Execute `ping 8.8.8.8` to observe the Destination Host Unreachable failure symptom.",
        "Step: Inspect the routing table with `show ip route` to confirm the gateway of last resort is missing.",
        "Step: Apply remediation by configuring the static default route: `ip route 0.0.0.0 0.0.0.0 192.168.1.254`.",
        "Step: Verify 100% end-to-end ICMP reachability with `ping 8.8.8.8`."
      ]
    }
  },
  "net-403-network-automation-programmability-foundations": {
    "title": "Guided Engineering Practice: Network Automation & Programmability Foundations",
    "tier": "TIER_2_GUIDED",
    difficulty: CourseLevel.ADVANCED,
    "estimatedMinutes": 15,
    "initialTopologyJson": {
      "nodes": [
        "Host-A",
        "Gateway-R1"
      ],
      "type": "Standard"
    },
    "instructions": "Execute structured terminal diagnostic workflows to observe protocol behavior, host socket states, and telemetry data for Network Automation & Programmability Foundations.",
    "tasks": [
      "Execute terminal diagnostic command to inspect operational host network state.",
      "Analyze output telemetry fields and verify protocol state transitions.",
      "Record observations and confirm baseline network health."
    ],
    "commands": [
      "ping 192.168.1.1",
      "arp -a",
      "nslookup netvision.edu",
      "traceroute 8.8.8.8"
    ],
    "expectedObservations": [
      "Host IPv4 address and default gateway binding",
      "DNS name resolution to IP address mapping",
      "ICMP echo reply with latency telemetry"
    ],
    "hints": [
      "Use standard network diagnostic utilities (`ping`, `traceroute`, `arp`).",
      "Verify that the default gateway responds to ICMP requests."
    ],
    "completionCriteria": "Host operational telemetry observed and verified.",
    "solution": {
      "steps": [
        "Step: Execute terminal diagnostic command to inspect operational host network state.",
        "Step: Analyze output telemetry fields and verify protocol state transitions.",
        "Step: Record observations and confirm baseline network health."
      ]
    }
  },
  "sdn-cloud-networking-overview": {
    "title": "Guided Engineering Practice: Software-Defined Networking (SDN) & Cloud Architecture",
    "tier": "TIER_2_GUIDED",
    difficulty: CourseLevel.ADVANCED,
    "estimatedMinutes": 15,
    "initialTopologyJson": {
      "nodes": [
        "Host-A",
        "Gateway-R1"
      ],
      "type": "Standard"
    },
    "instructions": "Execute structured terminal diagnostic workflows to observe protocol behavior, host socket states, and telemetry data for Software-Defined Networking (SDN) & Cloud Architecture.",
    "tasks": [
      "Execute terminal diagnostic command to inspect operational host network state.",
      "Analyze output telemetry fields and verify protocol state transitions.",
      "Record observations and confirm baseline network health."
    ],
    "commands": [
      "ping 192.168.1.1",
      "arp -a",
      "nslookup netvision.edu",
      "traceroute 8.8.8.8"
    ],
    "expectedObservations": [
      "Host IPv4 address and default gateway binding",
      "DNS name resolution to IP address mapping",
      "ICMP echo reply with latency telemetry"
    ],
    "hints": [
      "Use standard network diagnostic utilities (`ping`, `traceroute`, `arp`).",
      "Verify that the default gateway responds to ICMP requests."
    ],
    "completionCriteria": "Host operational telemetry observed and verified.",
    "solution": {
      "steps": [
        "Step: Execute terminal diagnostic command to inspect operational host network state.",
        "Step: Analyze output telemetry fields and verify protocol state transitions.",
        "Step: Record observations and confirm baseline network health."
      ]
    }
  },
  "net-101-bits-bytes-binary-hex": {
    "title": "Conceptual & Analytical Exploration: Bits, Bytes, Binary & Hexadecimal",
    "tier": "TIER_3_CONCEPTUAL",
    difficulty: CourseLevel.FOUNDATIONAL,
    "estimatedMinutes": 15,
    "initialTopologyJson": {
      "nodes": [
        "Host-A",
        "Gateway-R1"
      ],
      "type": "Standard"
    },
    "instructions": "Examine theoretical principles, framing architectures, and mathematical calculations for Digital Information Representation: Bits, Bytes & Network Sizing. Analyze data structures, bit encodings, and protocol stack hierarchies without artificial device CLI simulation.",
    "tasks": [
      "Analyze protocol data unit (PDU) framing fields and encapsulation byte offsets.",
      "Calculate theoretical link transmission capacity and channel propagation characteristics.",
      "Synthesize architectural layer primitives and service access points."
    ],
    "commands": [],
    "expectedObservations": [
      "Binary bitwise representation and hexadecimal notation",
      "Encapsulation header diagram and byte boundaries"
    ],
    "hints": [
      "Focus on the mathematical relationships between bits, bytes, and channel capacities.",
      "Follow the encapsulation sequence from Layer 7 Application down to Layer 1 Physical."
    ],
    "completionCriteria": "Analytical model verified against theoretical networking specifications.",
    "solution": {
      "steps": [
        "Step: Analyze protocol data unit (PDU) framing fields and encapsulation byte offsets.",
        "Step: Calculate theoretical link transmission capacity and channel propagation characteristics.",
        "Step: Synthesize architectural layer primitives and service access points."
      ]
    }
  },
  "network-devices-overview": {
    "title": "Conceptual & Analytical Exploration: Network Devices & Physical Media",
    "tier": "TIER_3_CONCEPTUAL",
    difficulty: CourseLevel.FOUNDATIONAL,
    "estimatedMinutes": 15,
    "initialTopologyJson": {
      "nodes": [
        "Host-A",
        "Gateway-R1"
      ],
      "type": "Standard"
    },
    "instructions": "Examine theoretical principles, framing architectures, and mathematical calculations for Physical Layer Media: Copper (UTP/STP), Fiber Optics & RF Propagation. Analyze data structures, bit encodings, and protocol stack hierarchies without artificial device CLI simulation.",
    "tasks": [
      "Analyze protocol data unit (PDU) framing fields and encapsulation byte offsets.",
      "Calculate theoretical link transmission capacity and channel propagation characteristics.",
      "Synthesize architectural layer primitives and service access points."
    ],
    "commands": [],
    "expectedObservations": [
      "Binary bitwise representation and hexadecimal notation",
      "Encapsulation header diagram and byte boundaries"
    ],
    "hints": [
      "Focus on the mathematical relationships between bits, bytes, and channel capacities.",
      "Follow the encapsulation sequence from Layer 7 Application down to Layer 1 Physical."
    ],
    "completionCriteria": "Analytical model verified against theoretical networking specifications.",
    "solution": {
      "steps": [
        "Step: Analyze protocol data unit (PDU) framing fields and encapsulation byte offsets.",
        "Step: Calculate theoretical link transmission capacity and channel propagation characteristics.",
        "Step: Synthesize architectural layer primitives and service access points."
      ]
    }
  },
  "wireless-networking-overview": {
    "title": "Guided Engineering Practice: Wireless Networking & RF Spectrum",
    "tier": "TIER_2_GUIDED",
    difficulty: CourseLevel.FOUNDATIONAL,
    "estimatedMinutes": 15,
    "initialTopologyJson": {
      "nodes": [
        "Host-A",
        "Gateway-R1"
      ],
      "type": "Standard"
    },
    "instructions": "Execute structured terminal diagnostic workflows to observe protocol behavior, host socket states, and telemetry data for Network Performance Engineering: Bandwidth, Throughput, Latency & Jitter.",
    "tasks": [
      "Execute terminal diagnostic command to inspect operational host network state.",
      "Analyze output telemetry fields and verify protocol state transitions.",
      "Record observations and confirm baseline network health."
    ],
    "commands": [
      "ping 192.168.1.1",
      "arp -a",
      "nslookup netvision.edu",
      "traceroute 8.8.8.8"
    ],
    "expectedObservations": [
      "Host IPv4 address and default gateway binding",
      "DNS name resolution to IP address mapping",
      "ICMP echo reply with latency telemetry"
    ],
    "hints": [
      "Use standard network diagnostic utilities (`ping`, `traceroute`, `arp`).",
      "Verify that the default gateway responds to ICMP requests."
    ],
    "completionCriteria": "Host operational telemetry observed and verified.",
    "solution": {
      "steps": [
        "Step: Execute terminal diagnostic command to inspect operational host network state.",
        "Step: Analyze output telemetry fields and verify protocol state transitions.",
        "Step: Record observations and confirm baseline network health."
      ]
    }
  }
};

import { LessonType } from '@prisma/client';
import { BenchmarkLessonFullDefinition } from './lessons-net300-400';

export const REMEDIATED_12_LESSONS: BenchmarkLessonFullDefinition[] = [
  // =========================================================================
  // 1. level-0-devices-in-a-network (NV-C01 / mod-c01-digital-representation)
  // =========================================================================
  {
    courseCode: 'NET-101',
    slug: 'level-0-devices-in-a-network',
    title: 'Devices in a Network: Hardware Roles & Layer Mapping',
    type: LessonType.THEORY,
    durationMinutes: 25,
    order: 3,
    visualizationType: 'NETWORK_TOPOLOGY_BUILDER',
    introduction:
      'Master the operational roles, collision/broadcast domain boundaries, and OSI layer classifications of fundamental network hardware devices.',
    contentV2: {
      objective:
        'Categorize hubs, repeaters, bridges, switches, routers, and firewalls by their respective OSI operating layer and determine their impact on collision and broadcast domains.',
      prerequisites: [
        'level-0-what-is-a-computer-network: Fundamental Networking Concepts',
        'net-101-bits-bytes-digital-representation: Binary & Hexadecimal Foundations',
      ],
      whyItMatters:
        'Selecting the correct hardware device is fundamental to enterprise network design. Deploying a Layer 1 hub instead of a Layer 2 switch causes catastrophic packet collisions, while failing to insert a Layer 3 router prevents inter-subnet communication and creates uncontrolled broadcast storms.',
      sourceAttribution: {
        bookTitle: 'CS-221 Computer Networking: Complete Mastery Textbook',
        edition: '2026 Edition — University, CCNA & Packet-Level Engineering',
        chapterNumber: 12,
        chapterTitle: 'MODULE 12 — NETWORKING DEVICES',
        sectionRef: '12.1-12.8 Hardware & Device Matrix: Repeaters, Hubs, Switches, Routers, Modems, Firewalls',
        standardsRefs: ['IEEE 802.3 Ethernet', 'IEEE 802.1D MAC Bridges'],
        cognitiveLevel: 'ANALYSIS',
        sourceVersion: '2026.1-ch12',
      },
      explanation:
        'Network hardware devices are classified based on the highest OSI layer at which they inspect and process data.\n\n### 1. Layer 1 (Physical Layer): Repeaters & Hubs\n* **Repeater**: Receives an attenuated electrical or optical signal and regenerates it at original amplitude without inspecting headers. Used to overcome transmission distance limits.\n* **Hub (Multiport Repeater)**: Any bit received on one physical port is electrically regenerated and flooded out of **all other ports**. Hubs share a single collision domain and single broadcast domain across all ports. If two nodes transmit simultaneously, an electrical collision occurs.\n\n### 2. Layer 2 (Data Link Layer): Bridges & Switches\n* **Bridge**: Connects two network segments and filters traffic by inspecting 48-bit destination MAC addresses.\n* **Switch (Multiport Bridge)**: Contains high-speed Application-Specific Integrated Circuits (ASICs) to maintain a Content Addressable Memory (CAM) table. A switch provides **microsegmentation**: every individual port is an isolated collision domain, but all ports share a single broadcast domain by default.\n\n### 3. Layer 3 (Network Layer): Routers\n* **Router**: Inspects 32-bit IPv4 or 128-bit IPv6 destination addresses to forward packets across different subnets. Routers establish **broadcast domain boundaries**; they do not forward Layer 2 broadcast frames (FF:FF:FF:FF:FF:FF) by default.\n\n### 4. Layer 4-7: Firewalls & Gateways\n* **Firewall**: Enforces stateful inspection across Layer 3 IP, Layer 4 TCP/UDP ports, and Layer 7 application protocols to permit or deny flows.',
      components: [
        { name: 'Layer 1 Hub', detail: 'Single collision domain, single broadcast domain; electrical bit flooder.' },
        { name: 'Layer 2 Switch', detail: 'Separate collision domain per port, single broadcast domain; forwards by MAC table.' },
        { name: 'Layer 3 Router', detail: 'Breaks broadcast domains; forwards across subnets using routing tables.' },
        { name: 'Stateful Firewall', detail: 'Inspects L3-L7 connection state tables to enforce security policies.' },
      ],
      howItWorks: [
        { stepNumber: 1, title: 'Physical Signal Ingress', action: 'PHY transceiver decodes electrical voltages or optical pulses into raw bits.' },
        { stepNumber: 2, title: 'Layer 2 Inspection', action: 'Switch inspects Source MAC to update CAM table, then checks Destination MAC to forward, filter, or flood.' },
        { stepNumber: 3, title: 'Layer 3 Routing Boundary', action: 'Router terminates incoming Ethernet frame, decrements IP TTL, and computes next-hop exit interface.' },
      ],
      cliTooling: [
        {
          command: 'show mac address-table',
          description: 'Displays the switch CAM table mapping learned MAC addresses to physical ports and VLANs.',
          expectedOutput: 'Vlan  Mac Address       Type     Ports\n----  ----------------- -------- -----\n1     0014.2201.2345    DYNAMIC  Gi0/1\n1     0014.2201.99aa    DYNAMIC  Gi0/2',
        },
        {
          command: 'show ip interface brief',
          description: 'Summarizes router Layer 3 interface IP assignments and administrative/line protocol operational statuses.',
          expectedOutput: 'Interface              IP-Address      OK? Method Status                Protocol\nGigabitEthernet0/0/0   192.168.1.1     YES manual up                    up      \nGigabitEthernet0/0/1   10.0.0.1        YES manual up                    up',
        },
      ],
      commonMistakes: [
        {
          misconception: 'Switches break broadcast domains.',
          correction: 'Standard switches isolate collision domains, NOT broadcast domains. All switch ports forward broadcasts (FF:FF:FF:FF:FF:FF) unless segmented with VLANs.',
          whyWrong: 'A broadcast frame sent on port 1 of an unconfigured switch is flooded out of all active ports on that switch.',
        },
        {
          misconception: 'Routers forward Layer 2 broadcasts to ensure all hosts can discover services.',
          correction: 'Routers do NOT forward Layer 2 broadcasts. They terminate them at the ingress interface to prevent Internet-wide broadcast saturation.',
        },
      ],
      troubleshooting: [
        {
          symptom: 'Excessive collisions and intermittent connectivity on legacy network segment.',
          possibleCauses: ['A legacy hub is connecting multiple high-traffic nodes', 'Duplex mismatch between switch and client (Half vs Full)'],
          diagnosticSteps: ['Check interface error counters for late collisions and run show interfaces', 'Verify whether device is connected to a hub or switch port'],
          remediation: 'Replace legacy hubs with managed switches and configure autonegotiation to lock full-duplex transmission.',
        },
      ],
      realWorldScenario: {
        topology: 'Branch Office: 50 Workstations -> 2x 24-Port Layer 2 Switches -> Cisco 4331 Edge Router -> ISP WAN',
        scenarioText: 'Workstations within the branch communicate at gigabit line rate without collisions because each port is a dedicated collision domain. When workstations access external cloud services, the router terminates their local broadcast domain and routes traffic over the WAN link.',
        engineeringContext: 'Proper tiering prevents local broadcast noise from consuming expensive WAN bandwidth.',
      },
      recap: [
        'Hubs operate at Layer 1: one collision domain, one broadcast domain.',
        'Switches operate at Layer 2: per-port collision domains, one shared broadcast domain per VLAN.',
        'Routers operate at Layer 3: break broadcast domains and connect separate IP subnets.',
        'Firewalls inspect stateful traffic flows across Layer 3 through Layer 7.',
      ],
    },
  },

  // =========================================================================
  // 2. level-0-switches-local-lan-forwarders (NV-C02 / mod-c02-vlans-trunking)
  // =========================================================================
  {
    courseCode: 'NET-301',
    slug: 'level-0-switches-local-lan-forwarders',
    title: 'Switches: Local LAN Frame Forwarders & MAC Address Tables',
    type: LessonType.THEORY,
    durationMinutes: 30,
    order: 13,
    visualizationType: 'SWITCHING_MAC_TABLE_VISUALIZER',
    introduction:
      'Explore the internal forwarding engine of Ethernet switches: Source MAC learning, CAM table aging, destination filtering, and unknown unicast flooding.',
    contentV2: {
      objective:
        'Trace the 4-step switch forwarding logic (Learn, Filter, Forward, Flood) and examine how Content Addressable Memory (CAM) tables prevent collision domains.',
      prerequisites: [
        'level-0-mac-addresses-physical-identity: 48-bit MAC Architecture',
        'ethernet-mac-addresses-overview: Ethernet II Frame Formats',
      ],
      whyItMatters:
        'Switches are the foundation of modern local area networks. Understanding CAM table population and flooding behavior is essential for diagnosing network loops, unicast flooding degradation, and MAC flooding security attacks.',
      sourceAttribution: {
        bookTitle: 'CS-221 Computer Networking: Complete Mastery Textbook',
        edition: '2026 Edition — University, CCNA & Packet-Level Engineering',
        chapterNumber: 10,
        chapterTitle: 'MODULE 10 — SWITCHING',
        sectionRef: '10.2 Packet Switching & 11.2 Switch Operation (Learn, Filter, Forward, Flood)',
        standardsRefs: ['IEEE 802.1D MAC Bridges', 'IEEE 802.3-2022'],
        cognitiveLevel: 'ANALYSIS',
        sourceVersion: '2026.1-ch10',
      },
      explanation:
        'An Ethernet switch is a multi-port Layer 2 bridging device that forwards frames based on dynamic MAC address inspection.\n\n### 1. The 4-Step Switch Forwarding Engine\nWhen an Ethernet frame arrives on a switch port, the switch hardware executes four distinct operations in silicon:\n1. **Learn**: The switch inspects the **Source MAC address**. If the address is not present in its CAM table, it records the Source MAC, ingress port, and VLAN with an aging timestamp (typically 300 seconds). If already present, it refreshes the timer.\n2. **Filter**: If the **Destination MAC address** is located on the exact same port where the frame arrived (e.g. via a downstream hub), the switch discards the frame because the destination already received it.\n3. **Forward**: If the Destination MAC is found in the CAM table on a different port, the switch transmits the frame solely out of that specific egress port (Unicast forwarding).\n4. **Flood**: If the Destination MAC is unknown (Unknown Unicast) or is a Broadcast (FF:FF:FF:FF:FF:FF) / Multicast address, the switch floods the frame out of **all active ports in the same VLAN except the ingress port**.\n\n### 2. Switching Forwarding Methods\n* **Store-and-Forward**: Buffers the entire frame and computes the 32-bit CRC FCS checksum before forwarding. Eliminates corrupt and runt frames.\n* **Cut-Through**: Inspects only the first 6 bytes (Destination MAC) and immediately forwards the frame before the payload finishes arriving. Lowest latency, but forwards corrupted frames.\n* **Fragment-Free**: Buffers the first 64 bytes (the minimum Ethernet collision window) to ensure no collision occurred before forwarding.',
      components: [
        { name: 'CAM Table (Content Addressable Memory)', detail: 'High-speed hardware lookup table mapping MAC addresses to physical ports.' },
        { name: 'Aging Timer', detail: 'Default 300-second countdown that flushes inactive MAC entries to accommodate mobile hosts.' },
        { name: 'Forwarding ASIC', detail: 'Dedicated hardware chip performing wire-speed frame switching without CPU interrupt.' },
      ],
      howItWorks: [
        { stepNumber: 1, title: 'Frame Ingress', action: 'Frame arrives on Port Fa0/1 with Source MAC A and Destination MAC B.' },
        { stepNumber: 2, title: 'CAM Learning', action: 'Switch records: MAC A is reachable on Port Fa0/1.' },
        { stepNumber: 3, title: 'CAM Lookup', action: 'Switch searches for MAC B. If found on Port Fa0/5, frame is sent strictly to Fa0/5.' },
        { stepNumber: 4, title: 'Unknown Unicast Flood', action: 'If MAC B is not found, frame is flooded out of all ports in that VLAN except Fa0/1.' },
      ],
      cliTooling: [
        {
          command: 'show mac address-table dynamic',
          description: 'Lists all dynamically learned MAC addresses and their remaining aging timers.',
          expectedOutput: 'Vlan  Mac Address       Type     Ports\n----  ----------------- -------- -----\n10    aabb.cc01.1234    DYNAMIC  Fa0/1\n10    aabb.cc01.5678    DYNAMIC  Fa0/2',
        },
        {
          command: 'clear mac address-table dynamic',
          description: 'Manually purges dynamically learned entries from the CAM table to force relearning.',
          expectedOutput: '',
        },
      ],
      commonMistakes: [
        {
          misconception: 'Switches learn ports from the Destination MAC address.',
          correction: 'Switches learn exclusively from the SOURCE MAC address of incoming frames. The destination MAC is used solely for forwarding decisions.',
          whyWrong: 'A destination MAC only indicates where a frame wants to go, not where a device actually lives.',
        },
      ],
      troubleshooting: [
        {
          symptom: 'Switch performance slows and Wireshark captures show all unicast traffic visible on every port (unicast flooding).',
          possibleCauses: ['CAM table exhaustion due to MAC Flooding attack', 'Asymmetric routing causing CAM table aging'],
          diagnosticSteps: ['Run show mac address-table count to check total learned entries', 'Verify if total entries exceed hardware limits (>8,000)'],
          remediation: 'Enable Port Security (`switchport port-security`) to restrict maximum learned MACs per port and drop rogue frames.',
        },
      ],
      recap: [
        'Switches learn on Source MAC, forward on Destination MAC.',
        'Known unicast is sent strictly to the target port.',
        'Unknown unicast, broadcast, and multicast frames are flooded to all ports in the VLAN except the ingress port.',
        'Store-and-Forward checks CRC error checksums before forwarding.',
      ],
    },
  },

  // =========================================================================
  // 3. switching-vlans-overview (NV-C02 / mod-c02-vlans-trunking)
  // =========================================================================
  {
    courseCode: 'NET-301',
    slug: 'switching-vlans-overview',
    title: 'Switching, VLANs & IEEE 802.1Q Enterprise Trunking',
    type: LessonType.THEORY,
    durationMinutes: 35,
    order: 14,
    visualizationType: 'VLAN_TRUNKING_SIMULATOR',
    introduction:
      'Master Layer 2 broadcast containment using Virtual Local Area Networks (VLANs), 802.1Q trunk tagging, and inter-VLAN routing architectures.',
    contentV2: {
      objective:
        'Architect enterprise broadcast isolation using IEEE 802.1Q VLANs, configure access and trunk ports, and evaluate Inter-VLAN routing topologies.',
      prerequisites: [
        'level-0-switches-local-lan-forwarders: Switch Forwarding Mechanics',
        'ethernet-mac-addresses-overview: Ethernet Framing',
      ],
      whyItMatters:
        'In flat networks, broadcast traffic from hundreds of hosts degrades bandwidth and exposes sensitive department data. VLANs logically segment a single physical switch into multiple isolated broadcast domains, improving performance and security.',
      sourceAttribution: {
        bookTitle: 'CS-221 Computer Networking: Complete Mastery Textbook',
        edition: '2026 Edition — University, CCNA & Packet-Level Engineering',
        chapterNumber: 13,
        chapterTitle: 'MODULE 13 — VLANs & STP',
        sectionRef: '13.1 VLANs, 13.2 802.1Q Trunking & VLAN Tagging, 13.3 Inter-VLAN Routing',
        standardsRefs: ['IEEE 802.1Q-2022 (VLAN Tagging)', 'IEEE 802.1p (CoS Priority)'],
        cognitiveLevel: 'APPLICATION',
        sourceVersion: '2026.1-ch13',
      },
      explanation:
        'A Virtual LAN (VLAN) is a logical broadcast domain created within switches.\n\n### 1. Access vs. Trunk Ports\n* **Access Port**: Carries traffic for **only one single VLAN**. Connected to end-user devices (PCs, printers, servers). Frames leaving an access port have no 802.1Q tag (untagged standard Ethernet II frames).\n* **Trunk Port**: Carries traffic for **multiple VLANs simultaneously** across links between switches or between a switch and a router.\n\n### 2. IEEE 802.1Q Frame Tagging\nTo distinguish traffic between switches, IEEE 802.1Q inserts a **4-byte tag** into the Ethernet header directly after the Source MAC address (EtherType 0x8100):\n* **TPID (Tag Protocol Identifier - 16 bits)**: Set to `0x8100` to indicate an 802.1Q-tagged frame.\n* **PCP (Priority Code Point - 3 bits)**: 8 priority levels (0-7) for Layer 2 Quality of Service (QoS / 802.1p).\n* **DEI (Drop Eligible Indicator - 1 bit)**: Indicates frames eligible to be dropped during congestion.\n* **VID (VLAN Identifier - 12 bits)**: Identifies the VLAN (1 to 4094). VLAN 1 is the default; 1002-1005 are legacy reserved.\n\n### 3. Native VLAN Security\nTrunk links support a **Native VLAN** (default VLAN 1). Frames belonging to the Native VLAN are transmitted across the trunk **without an 802.1Q tag**. For security, enterprise best practice mandates changing the Native VLAN to an unused ID (e.g., VLAN 999) to prevent VLAN hopping attacks.\n\n### 4. Inter-VLAN Routing\nBecause VLANs are completely isolated Layer 2 broadcast domains, traffic cannot cross between VLANs without a Layer 3 routing device:\n* **Router-on-a-Stick (ROAS)**: Single physical trunk link connected to a router with subinterfaces (`Gig0/0.10`, `Gig0/0.20`), each configured with `encapsulation dot1Q <vlan-id>`.\n* **Multilayer Switch (L3 Switch)**: Uses Switch Virtual Interfaces (`interface Vlan 10`) to route between VLANs at hardware ASIC speeds.',
      components: [
        { name: 'Access Port', detail: 'Dedicated to one VLAN; delivers untagged frames to endpoints.' },
        { name: 'Trunk Port', detail: 'Multiplexes multiple VLANs across inter-switch links using 802.1Q tags.' },
        { name: '802.1Q Tag', detail: '4-byte header shim containing 0x8100 TPID and 12-bit VLAN ID (VID).' },
        { name: 'SVI (Switch Virtual Interface)', detail: 'Logical Layer 3 interface on a multilayer switch providing default gateway routing.' },
      ],
      howItWorks: [
        { stepNumber: 1, title: 'Endpoint Frame Generation', action: 'Host in VLAN 10 sends untagged Ethernet frame to switch access port Fa0/1.' },
        { stepNumber: 2, title: 'Internal Ingress Tagging', action: 'Switch associates frame with VLAN 10 internally.' },
        { stepNumber: 3, title: 'Trunk Encapsulation', action: 'Frame traverses trunk link to adjacent switch with 4-byte 802.1Q tag (VID=10).' },
        { stepNumber: 4, title: 'Egress Stripping', action: 'Destination switch strips the 802.1Q tag and forwards standard frame out access port in VLAN 10.' },
      ],
      cliTooling: [
        {
          command: 'switchport mode trunk \n switchport trunk allowed vlan 10,20,30 \n switchport trunk native vlan 999',
          description: 'Configures interface as an 802.1Q trunk, filters allowed VLANs, and secures the native VLAN.',
          expectedOutput: '',
        },
        {
          command: 'show interfaces trunk',
          description: 'Displays active trunk ports, encapsulation protocol, native VLAN, and permitted VLAN list.',
          expectedOutput: 'Port        Mode             Encapsulation  Status        Native vlan\nGi0/1       on               802.1q         trunking      999\n\nPort        Vlans allowed on trunk\nGi0/1       10,20,30',
        },
      ],
      commonMistakes: [
        {
          misconception: 'Hosts in different VLANs on the same physical switch can communicate without a router.',
          correction: 'VLANs create completely isolated broadcast domains. Two hosts on the same switch in different VLANs require a Layer 3 router or multilayer switch SVI to communicate.',
        },
        {
          misconception: 'Native VLAN mismatch on trunk ports is harmless.',
          correction: 'Native VLAN mismatches cause traffic from one VLAN to bleed directly into a different VLAN on the remote switch, causing severe security breaches and STP loop errors.',
        },
      ],
      troubleshooting: [
        {
          symptom: 'Host in VLAN 20 cannot ping its default gateway on the router-on-a-stick.',
          possibleCauses: ['Subinterface missing encapsulation dot1Q 20 command', 'VLAN 20 is not permitted on the switch trunk port', 'Access port is assigned to wrong VLAN'],
          diagnosticSteps: ['Check show interfaces trunk to verify VLAN 20 is allowed and forwarding', 'Check show run interface on router subinterface for dot1Q binding'],
          remediation: 'Add `encapsulation dot1Q 20` to the subinterface and verify trunk allows VLAN 20.',
        },
      ],
      recap: [
        'VLANs break a physical switch into multiple isolated broadcast domains.',
        'Access ports deliver untagged frames to endpoints.',
        'Trunk ports multiplex multiple VLANs using 4-byte 802.1Q header tags.',
        'Native VLAN carries untagged traffic across trunks; must match on both link ends.',
        'Inter-VLAN communication requires a Layer 3 routing entity (ROAS or SVI).',
      ],
    },
  },

  // =========================================================================
  // 4. level-0-routers-inter-subnet-pathfinders (NV-C03 / mod-c03-static-routing)
  // =========================================================================
  {
    courseCode: 'NET-303',
    slug: 'level-0-routers-inter-subnet-pathfinders',
    title: 'Routers: Inter-Subnet Path Finders & Forwarding Engine',
    type: LessonType.THEORY,
    durationMinutes: 30,
    order: 12,
    visualizationType: 'ROUTER_DATA_CONTROL_PLANE',
    introduction:
      'Understand how routers connect distinct IP subnets, decouple Control Plane decision-making from Data Plane packet switching, and rewrite headers hop-by-hop.',
    contentV2: {
      objective:
        'Deconstruct the router architecture into Control Plane and Data Plane (CEF), trace routing table lookup mechanics, and analyze packet header mutations during forwarding.',
      prerequisites: [
        'net-202-ipv4-addressing-cidr: IPv4 Subnetting & Network Boundaries',
        'level-0-devices-in-a-network: Hardware Layer Roles',
      ],
      whyItMatters:
        'Without routers, the global Internet cannot exist. Routers interconnect disparate physical networks, isolate broadcast traffic, calculate optimal loop-free paths, and forward data across global Autonomous Systems.',
      sourceAttribution: {
        bookTitle: 'CS-221 Computer Networking: Complete Mastery Textbook',
        edition: '2026 Edition — University, CCNA & Packet-Level Engineering',
        chapterNumber: 18,
        chapterTitle: 'MODULE 18 — ROUTING',
        sectionRef: '18.1 Control Plane vs Data Plane & 18.2 Routing Table Internals',
        standardsRefs: ['RFC 1812 (Requirements for IP Version 4 Routers)', 'RFC 791 (IPv4)'],
        cognitiveLevel: 'UNDERSTANDING',
        sourceVersion: '2026.1-ch18',
      },
      explanation:
        'A router is a specialized Layer 3 computer designed to forward packets between separate logical networks.\n\n### 1. Control Plane vs. Data (Forwarding) Plane\n* **Control Plane (The Brain)**: Runs routing protocols (OSPF, EIGRP, BGP), processes ARP/ICMP packets, maintains the Routing Information Base (RIB), and computes path metrics. Executed on the general-purpose CPU.\n* **Data Plane (The Muscle)**: Forwards customer packets from ingress interface to egress interface at wire speed. In modern enterprise hardware, Cisco Express Forwarding (CEF) downloads the Forwarding Information Base (FIB) and Adjacency Table directly into specialized hardware ASICs for nanosecond lookups without CPU interruption.\n\n### 2. Hop-by-Hop Header Mutation\nWhen a packet traverses a router, the router performs specific mutations before forwarding:\n1. **Terminates Layer 2 Frame**: Checks the incoming frame FCS; if valid, strips the Layer 2 header and trailer.\n2. **Decrements Time to Live (TTL)**: Decrements the IPv4 TTL field by 1. If TTL drops to 0, the packet is discarded and an ICMP Time Exceeded (Type 11) is returned to the source.\n3. **Recalculates Checksum**: Updates the IPv4 Header Checksum field to reflect the new TTL.\n4. **Encapsulates New Layer 2 Frame**: Re-encapsulates the original IP packet inside a brand new Layer 2 frame with the router egress port as Source MAC and the next-hop router/host as Destination MAC (resolved via ARP). **IP addresses remain unchanged; MAC addresses change at every router hop**.',
      components: [
        { name: 'Control Plane (RIB)', detail: 'Computes routing topology and path costs; manages dynamic protocol neighbors.' },
        { name: 'Data Plane (FIB)', detail: 'Hardware-accelerated forwarding table compiled from the RIB for wire-speed lookup.' },
        { name: 'Adjacency Table', detail: 'Pre-computed Layer 2 rewrite information (next-hop MAC addresses) from ARP.' },
        { name: 'TTL Decrement Engine', detail: 'Prevents infinite looping packets by dropping packets when TTL reaches 0.' },
      ],
      howItWorks: [
        { stepNumber: 1, title: 'Frame Ingress & Validation', action: 'Router validates frame FCS and checks if Destination MAC matches its interface MAC.' },
        { stepNumber: 2, title: 'Layer 3 De-encapsulation', action: 'Strips Ethernet header and inspects 32-bit Destination IP in IPv4 header.' },
        { stepNumber: 3, title: 'FIB Lookup & TTL Check', action: 'Performs Longest Prefix Match in FIB; decrements TTL by 1 and updates checksum.' },
        { stepNumber: 4, title: 'Egress Framing & Transmission', action: 'Prepends new Layer 2 header with next-hop MAC and transmits out egress port.' },
      ],
      cliTooling: [
        {
          command: 'show ip route',
          description: 'Displays the active Layer 3 routing table (RIB) with route sources, metrics, and next-hop interfaces.',
          expectedOutput: 'Codes: C - connected, S - static, R - RIP, O - OSPF\nGateway of last resort is 192.168.1.254 to network 0.0.0.0\n\nC    192.168.10.0/24 is directly connected, GigabitEthernet0/0/0\nO    10.1.0.0/16 [110/2] via 192.168.1.2, 00:15:20, GigabitEthernet0/0/1',
        },
        {
          command: 'show ip cef',
          description: 'Inspects the hardware-compiled Cisco Express Forwarding (CEF) table used by the data plane.',
          expectedOutput: 'Prefix               Next Hop             Interface\n0.0.0.0/0            192.168.1.254        GigabitEthernet0/0/1\n10.1.0.0/16          192.168.1.2          GigabitEthernet0/0/1',
        },
      ],
      commonMistakes: [
        {
          misconception: 'IP addresses change when a packet passes through a standard router.',
          correction: 'Standard routers NEVER modify source or destination IP addresses. Only Layer 2 MAC addresses change at each hop. (IPs only change if NAT is explicitly configured).',
        },
      ],
      troubleshooting: [
        {
          symptom: 'Host cannot reach remote server; traceroute shows packet stopping at the default gateway.',
          possibleCauses: ['Gateway missing route to target destination network', 'Gateway interface down/down', 'Next-hop router interface unreachable'],
          diagnosticSteps: ['Run ping from router CLI to target destination IP', 'Execute show ip route <target-ip> on the default gateway'],
          remediation: 'Add a static route or configure dynamic routing to advertise the remote subnet to the default gateway.',
        },
      ],
      recap: [
        'Routers break broadcast domains and interconnect separate IP subnets.',
        'Control plane computes routing paths; Data plane forwards packets in hardware.',
        'Every router decrements TTL by 1, recalculates checksum, and rewrites Layer 2 MAC headers.',
        'End-to-end IP addresses are preserved across standard routing hops.',
      ],
    },
  },

  // =========================================================================
  // 5. routing-fundamentals-overview (NV-C03 / mod-c03-static-routing)
  // =========================================================================
  {
    courseCode: 'NET-303',
    slug: 'routing-fundamentals-overview',
    title: 'Routing Fundamentals: Longest Prefix Match, Administrative Distance & Static Routes',
    type: LessonType.THEORY,
    durationMinutes: 35,
    order: 13,
    visualizationType: 'ROUTING_TABLE_LOOKUP_ANIMATOR',
    introduction:
      'Master the core forwarding logic of IP routers: Longest Prefix Match evaluation, Administrative Distance tie-breaking, and static/default route configuration.',
    contentV2: {
      objective:
        'Apply the Longest Prefix Match (LPM) algorithm across overlapping route entries, compare Administrative Distance values across routing protocols, and configure floating static routes.',
      prerequisites: [
        'level-0-routers-inter-subnet-pathfinders: Router Architecture & Header Mutation',
        'net-202-ipv4-addressing-cidr: CIDR Subnetting',
      ],
      whyItMatters:
        'When multiple routes exist to a destination, routers must choose the single best path with absolute mathematical predictability. Misunderstanding LPM or Administrative Distance leads to routing loops, asymmetric routing, and traffic blackholes.',
      sourceAttribution: {
        bookTitle: 'CS-221 Computer Networking: Complete Mastery Textbook',
        edition: '2026 Edition — University, CCNA & Packet-Level Engineering',
        chapterNumber: 18,
        chapterTitle: 'MODULE 18 — ROUTING',
        sectionRef: '18.3 Longest Prefix Match (LPM) Algorithm & 18.4 Static, Default & Floating Static Routes',
        standardsRefs: ['RFC 1812', 'RFC 1519 (CIDR)'],
        cognitiveLevel: 'APPLICATION',
        sourceVersion: '2026.1-ch18',
      },
      explanation:
        'Routers make forwarding decisions by matching packet destination IPs against entries in the routing table.\n\n### 1. Longest Prefix Match (LPM) Algorithm\nWhen a router has multiple matching routes for a destination IP, it **always chooses the most specific route** — the route with the highest prefix length (most continuous matching mask bits from left to right):\n* Route A: `10.0.0.0/8`\n* Route B: `10.1.0.0/16`\n* Route C: `10.1.5.0/24`\n* Route D: `10.1.5.128/25`\nIf a packet arrives destined for `10.1.5.130`, all four routes match, but the router selects **Route D (`/25`)** because 25 matching network bits is longer and more specific than 24, 16, or 8.\n* **LPM ALWAYS trumps Administrative Distance and Metric**. AD is only evaluated when choosing between identical prefixes from different protocols.\n\n### 2. Administrative Distance (AD) — Source Trustworthiness\nIf a router learns the **exact same network prefix** from multiple different routing sources, it uses Administrative Distance (0 to 255, lower is more trusted) to break the tie:\n* Directly Connected: `0`\n* Static Route: `1`\n* eBGP: `20`\n* EIGRP (Internal): `90`\n* OSPF: `110`\n* IS-IS: `115`\n* RIP: `120`\n* External EIGRP: `170`\n* iBGP: `200`\n* Unreachable / Discard: `255`\n\n### 3. Static & Default Routes\n* **Static Route**: Manually configured path (`ip route <prefix> <mask> <next-hop>`). High reliability, zero protocol overhead.\n* **Default Route (Gateway of Last Resort)**: `ip route 0.0.0.0 0.0.0.0 <next-hop>`. Matches every destination IP with 0 bits specificity; used when no more specific match exists in the routing table.\n* **Floating Static Route**: A static route configured with a higher Administrative Distance (e.g. AD=120) than the primary dynamic routing protocol (e.g. OSPF AD=110). It remains dormant and only installs into the routing table if the primary dynamic route fails.',
      components: [
        { name: 'LPM Engine', detail: 'Hardware trie algorithm finding the longest matching prefix mask.' },
        { name: 'Administrative Distance', detail: '0-255 rating of route source believability.' },
        { name: 'Default Route (0.0.0.0/0)', detail: 'Catch-all route matching all Internet-bound packets.' },
        { name: 'Floating Static Route', detail: 'High-AD backup static route that activates only during primary link failure.' },
      ],
      howItWorks: [
        { stepNumber: 1, title: 'Packet Arrival', action: 'Destination IP extracted from packet header.' },
        { stepNumber: 2, title: 'LPM Evaluation', action: 'All matching routes evaluated; the highest prefix mask length (/32 down to /0) wins.' },
        { stepNumber: 3, title: 'Egress Determination', action: 'Next-hop IP and outgoing interface resolved from the winning route entry.' },
      ],
      cliTooling: [
        {
          command: 'ip route 10.20.0.0 255.255.0.0 172.16.1.2 \n ip route 0.0.0.0 0.0.0.0 203.0.113.1 \n ip route 0.0.0.0 0.0.0.0 198.51.100.1 200',
          description: 'Configures specific static route, primary default route to ISP, and floating static backup default route with AD 200.',
          expectedOutput: '',
        },
        {
          command: 'show ip route 10.20.5.1',
          description: 'Displays the exact winning route entry selected by Longest Prefix Match for target IP.',
          expectedOutput: 'Routing entry for 10.20.0.0/16\n  Known via "static", distance 1, metric 0\n  Routing Descriptor Blocks:\n  * 172.16.1.2, via GigabitEthernet0/0/1',
        },
      ],
      commonMistakes: [
        {
          misconception: 'Administrative Distance overrides Longest Prefix Match.',
          correction: 'LPM ALWAYS wins over AD. A router will choose an OSPF route (AD 110) with a /28 mask over a Static route (AD 1) with a /24 mask because /28 is a longer prefix match.',
        },
      ],
      troubleshooting: [
        {
          symptom: 'Backup ISP link is taking traffic while primary ISP link is still active.',
          possibleCauses: ['Floating static route was configured without an Administrative Distance greater than the primary route', 'Primary route was withdrawn from table'],
          diagnosticSteps: ['Check show ip route 0.0.0.0 to inspect installed default route distance', 'Verify AD argument on backup ip route statement'],
          remediation: 'Configure backup static route with AD 200 so it remains inactive until primary route is withdrawn.',
        },
      ],
      recap: [
        'Longest Prefix Match (LPM) is the absolute first rule of IP routing: longest mask length wins.',
        'Administrative Distance breaks ties between identical prefixes learned from different sources.',
        'Lower AD values indicate higher trustworthiness (Connected 0, Static 1, OSPF 110, RIP 120).',
        'Default route (0.0.0.0/0) provides the gateway of last resort.',
      ],
    },
  },

  // =========================================================================
  // 6. network-security-basics-overview (NV-C04 / mod-c04-acls-firewalls)
  // =========================================================================
  {
    courseCode: 'NET-305',
    slug: 'network-security-basics-overview',
    title: 'Network Security Fundamentals: CIA Triad, Threat Vectors & Cryptographic Principles',
    type: LessonType.THEORY,
    durationMinutes: 30,
    order: 15,
    visualizationType: 'SECURITY_THREAT_MATRIX',
    introduction:
      'Build core competence in network security foundations: the CIA Triad, the AAA framework, symmetric vs asymmetric encryption, cryptographic hashing, and threat vector analysis.',
    contentV2: {
      objective:
        'Evaluate security threats against the CIA Triad, apply the AAA authorization model, and compare symmetric and asymmetric cryptographic algorithms in secure network communications.',
      prerequisites: [
        'level-0-what-is-a-computer-network: Computer Networking Basics',
        'tcp-ip-4-layers: Layered Encapsulation',
      ],
      whyItMatters:
        'Modern enterprise networks are subject to relentless automated scanning, data exfiltration, ransomware, and man-in-the-middle attacks. Security cannot be bolted on as an afterthought; network engineers must design defense-in-depth from Day 1.',
      sourceAttribution: {
        bookTitle: 'CS-221 Computer Networking: Complete Mastery Textbook',
        edition: '2026 Edition — University, CCNA & Packet-Level Engineering',
        chapterNumber: 27,
        chapterTitle: 'MODULE 27 — NETWORK SECURITY',
        sectionRef: '27.1 CIA Triad, 27.2 AAA Framework, 27.3 Cryptography (Symmetric AES, Asymmetric RSA/ECC, Hashing SHA-256)',
        standardsRefs: ['NIST SP 800-175B', 'FIPS 197 (AES)', 'FIPS 180-4 (SHA-2)'],
        cognitiveLevel: 'UNDERSTANDING',
        sourceVersion: '2026.1-ch27',
      },
      explanation:
        'Network security encompasses the architectural policies, access boundaries, and cryptographic controls engineered to prevent unauthorized access, misuse, or alteration of networked assets.\n\n### 1. The CIA Triad: Foundational Security Dimensions\n* **Confidentiality**: Guarantees data remains readable only by intended, authorized endpoints. Enforced using symmetric/asymmetric encryption (AES-256-GCM, TLS 1.3) and strict network segmentation (VLANs, VRFs).\n* **Integrity**: Guarantees data is not modified, forged, replayed, or corrupted during transit. Enforced using one-way cryptographic hash functions (SHA-256, SHA-3) and Hash-based Message Authentication Codes (HMAC).\n* **Availability**: Guarantees systems, links, and bandwidth remain operational and accessible to authorized consumers under adverse conditions. Enforced via link aggregation (LACP), first-hop gateway redundancy (HSRP/VRRP), dual power supplies, and stateful DDoS mitigation scrubbers.\n\n### 2. The AAA Framework: Enterprise Access Governance\nModern enterprise identity architectures separate access governance into three discrete planes:\n* **Authentication (Who are you?)**: Validates identity via 802.1X Port-Based Authentication, centralized RADIUS (RFC 2865), TACACS+ (RFC 8907), or Multi-Factor Authentication (MFA).\n* **Authorization (What are you allowed to do?)**: Implements Role-Based Access Control (RBAC) to restrict commands, subnets, and VLAN memberships based on least-privilege policies.\n* **Accounting (What did you do?)**: Generates immutable audit logs capturing timestamps, exact commands executed, IP socket bindings, and transmitted byte counters for compliance.\n\n### 3. Cryptographic Primitives: Operational Comparison\n\n| Mechanism | Primitive Type | Primary Function | Throughput / Overhead | Canonical Standards |\n| :--- | :--- | :--- | :--- | :--- |\n| **AES-GCM** | Symmetric Cipher | Bulk data encryption | Extremely High (Hardware AES-NI) | FIPS 197 / RFC 5288 |\n| **RSA / ECC** | Asymmetric Keypair | Digital signatures & key exchange | Moderate to Heavy computation | NIST FIPS 186-4 |\n| **SHA-256** | One-Way Hash | Message integrity & fingerprinting | Ultra-Fast fixed 256-bit digest | NIST FIPS 180-4 |\n\n### 4. Operational Context & Engineering Tradeoffs\n* **Defense in Depth**: Security cannot rely on a single defensive layer. An enterprise must implement perimeter firewalling, internal access control lists, endpoint host firewalls, and encrypted payloads simultaneously.\n* **The Avalanche Effect**: A hallmark of secure hashing—changing even a single bit of the input plaintext fundamentally scrambles >50% of the resultant hash digest, exposing any intermediate packet tampering.\n\n### Quick Knowledge Check\n* *Question*: Why do VPN protocols use asymmetric cryptography during tunnel setup but switch to symmetric encryption for payload data?\n* *Answer*: Asymmetric cryptography (Diffie-Hellman/RSA) solves the key distribution problem across untrusted transit, but is computationally expensive; symmetric encryption (AES) provides line-rate hardware throughput for bulk payloads.',
      components: [
        { name: 'Confidentiality (AES)', detail: 'Bulk data privacy through block cipher encryption.' },
        { name: 'Integrity (SHA-256)', detail: 'Tamper detection through one-way mathematical hashing.' },
        { name: 'Authentication (RADIUS/TACACS+)', detail: 'Centralized enterprise identity verification.' },
        { name: 'Accounting (Audit Logging)', detail: 'Non-repudiation tracking user actions on network hardware.' },
      ],
      howItWorks: [
        { stepNumber: 1, title: 'Authentication Request', action: 'User supplies credentials via SSH or 802.1X supplicant to Network Access Server.' },
        { stepNumber: 2, title: 'RADIUS / TACACS+ Verification', action: 'Server queries centralized directory (LDAP/Active Directory) to authenticate.' },
        { stepNumber: 3, title: 'Key Exchange & Bulk Encryption', action: 'Asymmetric Diffie-Hellman establishes shared session key; AES encrypts traffic.' },
      ],
      cliTooling: [
        {
          command: 'aaa new-model \n radius-server host 10.0.0.50 key C1sc0S3cr3t \n aaa authentication login default group radius local',
          description: 'Enables Cisco AAA security model and configures RADIUS authentication with local fallback.',
          expectedOutput: '',
        },
      ],
      commonMistakes: [
        {
          misconception: 'Hashing and encryption are the same thing.',
          correction: 'Encryption is a two-way reversible process requiring a key to decrypt back to plaintext. Hashing is a one-way irreversible process used strictly to verify integrity.',
        },
      ],
      troubleshooting: [
        {
          symptom: 'Network administrators locked out of router CLI after RADIUS server outage.',
          possibleCauses: ['AAA authentication configured without local database fallback'],
          diagnosticSteps: ['Check aaa authentication configuration for fallback keywords'],
          remediation: 'Always append `local` to the AAA authentication method list to preserve emergency console access during server downtime.',
        },
      ],
      recap: [
        'The CIA Triad balances Confidentiality, Integrity, and Availability.',
        'The AAA framework controls Authentication, Authorization, and Accounting.',
        'Symmetric encryption (AES) is fast and used for bulk data; Asymmetric (RSA/ECC) handles key exchange.',
        'Cryptographic hashing (SHA-256) provides tamper detection and integrity verification.',
      ],
    },
  },

  // =========================================================================
  // 7. firewalls-acls-overview (NV-C04 / mod-c04-acls-firewalls)
  // =========================================================================
  {
    courseCode: 'NET-305',
    slug: 'firewalls-acls-overview',
    title: 'Perimeter Defense: Multi-Tier Firewalls, DMZ Architectures & Deep Inspection',
    type: LessonType.THEORY,
    durationMinutes: 35,
    order: 16,
    visualizationType: 'DMZ_FIREWALL_ARCHITECTURE',
    introduction:
      'Design multi-tier perimeter defense architectures utilizing stateless packet filters, stateful firewalls, demilitarized zones (DMZ), and Intrusion Prevention Systems (IPS).',
    contentV2: {
      objective:
        'Architect enterprise perimeter defense using dual-firewall DMZ designs, compare stateless ACLs with stateful inspection (SPI) and Next-Gen Firewalls (NGFW), and evaluate IDS/IPS deployment modes.',
      prerequisites: [
        'net-305-standard-extended-ipv4-acls: Access Control Lists',
        'net-305-stateful-firewalls-connection-tracking: Stateful Inspection Mechanics',
      ],
      whyItMatters:
        'Directly exposing corporate servers to the public Internet invites catastrophic breach. A properly engineered multi-tier DMZ perimeter prevents compromised web servers from serving as lateral pivot points into core database records.',
      sourceAttribution: {
        bookTitle: 'CS-221 Computer Networking: Complete Mastery Textbook',
        edition: '2026 Edition — University, CCNA & Packet-Level Engineering',
        chapterNumber: 29,
        chapterTitle: 'MODULE 29 — NETWORK DEFENSE',
        sectionRef: '29.3 Network Segmentation, DMZ Architectures, IDS vs IPS Systems',
        standardsRefs: ['NIST SP 800-41 Rev 1', 'NIST SP 800-94 (IDS/IPS)'],
        cognitiveLevel: 'ANALYSIS',
        sourceVersion: '2026.1-ch29',
      },
      explanation:
        'Perimeter defense establishes deterministic security boundaries between untrusted external networks, semi-trusted service enclaves, and trusted internal enterprise assets.\n\n### 1. Evolution of Firewall Filtering Mechanisms\n\n| Technology | OSI Layer | State Tracking | Return Traffic Handling | Deep Inspection Capability |\n| :--- | :--- | :--- | :--- | :--- |\n| **Stateless Packet Filter (ACL)** | Layer 3 / 4 | None (Stateless) | Must explicitly permit matching reverse ports | No (Headers only) |\n| **Stateful Packet Inspection (SPI)** | Layer 3 / 4 / 5 | Dynamic State Table | Automatically allows return traffic for established flows | Minimal |\n| **Next-Gen Firewall (NGFW)** | Layer 3 – 7 | Application Aware | Stateful + full application protocol decoders | Yes (TLS Decryption, Antivirus, IPS) |\n\n### 2. Dual-Firewall DMZ Architecture: Traffic Matrix\nA Demilitarized Zone (DMZ) creates an isolated DMZ subnet between an External Firewall (facing Internet) and an Internal Firewall (facing Corporate LAN):\n* **Internet to DMZ**: Strictly permitted on required application ports only (e.g. TCP 443 for HTTPS reverse proxy, UDP 53 for external DNS authoritative servers).\n* **DMZ to Internal LAN**: Strictly blocked by default. DMZ servers must NEVER initiate outbound connections into internal subnets. (Only established return traffic from internal-to-DMZ requests or explicit queries to internal database ports with strict IP binding are allowed).\n* **Internal LAN to DMZ**: Permitted for administrative maintenance (SSH, RDP) and database updates.\n* **Attacker Containment**: If an attacker exploits a remote code execution (RCE) zero-day on the public web server, the internal firewall drops reverse-shell payloads attempting to pivot into Active Directory or payroll databases.\n\n### 3. IDS vs. IPS Deployment Architecture\n* **Intrusion Detection System (IDS)**: Deployed **out-of-band** via switch port mirroring (SPAN) or network TAPs. Passively analyzes packet copies and generates security alerts. Crucially, an IDS cannot drop malicious packets in-flight.\n* **Intrusion Prevention System (IPS)**: Deployed **inline** in the physical traffic path. Inspects packets in real time and immediately drops malicious frames or transmits TCP RST packets before unauthorized commands reach the target server.\n\n### Quick Knowledge Check\n* *Question*: Why does a stateful firewall not require an inbound ACL rule allowing source port 443 for client web browsing?\n* *Answer*: When the internal client sends an outbound SYN packet, the firewall records the 5-tuple in its state table; incoming response packets matching this active session are automatically permitted.',
      components: [
        { name: 'External Firewall', detail: 'Perimeter barrier filtering untrusted Internet traffic into the DMZ.' },
        { name: 'DMZ Segment', detail: 'Isolated network housing public servers (Web, Mail, Reverse Proxy).' },
        { name: 'Internal Firewall', detail: 'Strict boundary protecting internal corporate databases from the DMZ.' },
        { name: 'Inline IPS', detail: 'In-path signature inspection engine dropping malicious packets in real time.' },
      ],
      howItWorks: [
        { stepNumber: 1, title: 'Inbound Request to DMZ', action: 'Internet user connects to HTTPS web server in DMZ on port 443; permitted by external firewall.' },
        { stepNumber: 2, title: 'DMZ Database Query', action: 'DMZ web server queries internal database on port 3306; permitted through internal firewall by explicit rule.' },
        { stepNumber: 3, title: 'Compromise Containment', action: 'If web server is breached, internal firewall blocks unauthorized reverse shells into the LAN.' },
      ],
      cliTooling: [
        {
          command: 'iptables -A FORWARD -i eth0 -o eth1 -p tcp --dport 443 -d 192.168.50.10 -j ACCEPT \n iptables -A FORWARD -m state --state ESTABLISHED,RELATED -j ACCEPT',
          description: 'Permits inbound HTTPS traffic to DMZ host and allows return traffic statefully.',
          expectedOutput: '',
        },
      ],
      commonMistakes: [
        {
          misconception: 'Placing public web servers on the internal LAN behind port forwarding is secure.',
          correction: 'If a server on the internal LAN is compromised, the attacker has unrestricted Layer 2 broadcast access to all internal workstations and domain controllers.',
        },
      ],
      troubleshooting: [
        {
          symptom: 'Legitimate external users report intermittent dropped connections during high traffic spikes.',
          possibleCauses: ['Firewall state table exhaustion', 'CPU throttling on inline IPS during deep packet inspection'],
          diagnosticSteps: ['Check firewall state table count vs maximum table capacity', 'Inspect IPS CPU utilization and throughput drops'],
          remediation: 'Tune state table timeout values and optimize IPS signature rule sets.',
        },
      ],
      recap: [
        'Defense-in-depth requires layered controls from edge filters to endpoint hardening.',
        'Stateful inspection tracks connection states and dynamically allows return flows.',
        'DMZs isolate public-facing servers to prevent lateral movement into internal systems.',
        'IDS operates out-of-band (detection only); IPS operates inline (active blocking).',
      ],
    },
  },

  // =========================================================================
  // 8. nat-pat-overview (NV-C04 / mod-c04-nat-pat)
  // =========================================================================
  {
    courseCode: 'NET-401',
    slug: 'nat-pat-overview',
    title: 'NAT/PAT Architectural Engineering: Port Exhaustion, ALG & NAT Traversal',
    type: LessonType.THEORY,
    durationMinutes: 30,
    order: 17,
    visualizationType: 'NAT_PAT_TRANSLATION_TABLE',
    introduction:
      'Master the engineering mechanics of Network Address Translation (NAT) and Port Address Translation (PAT), including port multiplexing, Application Layer Gateways (ALGs), and STUN traversal.',
    contentV2: {
      objective:
        'Evaluate the architectural tradeoffs of IPv4 NAT/PAT, diagnose port exhaustion under heavy concurrent connections, and analyze Application Layer Gateway (ALG) behavior.',
      prerequisites: [
        'net-401-ipv4-nat-pat-address-translation: NAT/PAT Fundamentals',
        'level-0-network-ports-socket-boundaries: Layer 4 Ports & Sockets',
      ],
      whyItMatters:
        'With IPv4 addresses globally exhausted, NAT/PAT is the operational lifeline enabling billions of private devices to access the Internet. Understanding port table exhaustion and NAT traversal is critical for VoIP, gaming, and real-time WebRTC communications.',
      sourceAttribution: {
        bookTitle: 'CS-221 Computer Networking: Complete Mastery Textbook',
        edition: '2026 Edition — University, CCNA & Packet-Level Engineering',
        chapterNumber: 17,
        chapterTitle: 'MODULE 17 — ARP, ICMP, DHCP, DNS & NAT',
        sectionRef: '17.5 NAT Tradeoffs, Port Exhaustion, Application Layer Gateways (ALG), STUN/TURN Traversal',
        standardsRefs: ['RFC 3022 (Traditional NAT)', 'RFC 5389 (STUN)', 'RFC 5766 (TURN)'],
        cognitiveLevel: 'ANALYSIS',
        sourceVersion: '2026.1-ch17',
      },
      explanation:
        'Network Address Translation modifies IP header addressing while packets traverse a routing gateway.\n\n### 1. The NAT Flavor Hierarchy\n* **Static NAT**: 1-to-1 permanent mapping between an internal private IP and an external public IP. Used for internal servers needing consistent inbound public access.\n* **Dynamic NAT**: Many-to-many mapping from a pool of public IPs. Allocated on a first-come, first-served basis. If the pool is exhausted, new hosts cannot communicate.\n* **PAT (Port Address Translation / NAT Overload)**: Many-to-one mapping where thousands of private hosts share a **single public IP** by mapping each internal connection to a unique Layer 4 Source Port number.\n\n### 2. PAT Port Exhaustion Dynamics\nA single public IPv4 address has approximately 64,512 usable source ports (1024-65535, excluding well-known ports). Each modern web browser opens 6 to 12 concurrent TCP connections per web page. In large enterprise networks (>5,000 users), a single public IP will quickly encounter **source port exhaustion**, causing new outgoing connections to fail or hang.\n* *Mitigation*: Configure PAT over a pool of multiple public IPs (`ip nat pool POOL_NAME ... overload`).\n\n### 3. Application Layer Gateways (ALG) & VoIP\nStandard NAT only rewrites the IP and TCP/UDP headers. Certain protocols (e.g. FTP, SIP, H.323) embed the client private IP address **inside the payload data stream**. An Application Layer Gateway (ALG) inspects payload contents and rewrites embedded IP addresses. Misconfigured ALGs frequently corrupt SIP signaling, causing one-way audio in enterprise VoIP.',
      components: [
        { name: 'Translation Table', detail: 'Tracks Inside Local, Inside Global, Outside Local, and Outside Global sockets.' },
        { name: 'PAT Overload Engine', detail: 'Rewrites source IP and maps unique ephemeral source ports.' },
        { name: 'Application Layer Gateway (ALG)', detail: 'Deep payload inspection rewriting embedded IP addresses for FTP and SIP.' },
      ],
      howItWorks: [
        { stepNumber: 1, title: 'Outbound Packet Ingress', action: 'Host 192.168.1.50:49152 sends packet to web server 93.184.216.34:443.' },
        { stepNumber: 2, title: 'PAT Port Mapping', action: 'Router rewrites source to 203.0.113.1:10001 and creates translation table entry.' },
        { stepNumber: 3, title: 'Inbound Response Demultiplexing', action: 'Server responds to 203.0.113.1:10001; router matches port 10001 and forwards to 192.168.1.50:49152.' },
      ],
      cliTooling: [
        {
          command: 'show ip nat translations',
          description: 'Displays active NAT/PAT translation sessions mapping inside local sockets to inside global sockets.',
          expectedOutput: 'Pro Inside global      Inside local       Outside local      Outside global\ntcp 203.0.113.1:10001  192.168.1.50:49152 93.184.216.34:443  93.184.216.34:443',
        },
        {
          command: 'show ip nat statistics',
          description: 'Shows total active translations, translation pool utilization, and missed allocations.',
          expectedOutput: 'Total active translations: 1450 (1 static, 1449 dynamic; 1449 extended)\nOutside interfaces: GigabitEthernet0/0/1\nInside interfaces: GigabitEthernet0/0/0\nHits: 894102  Misses: 0',
        },
      ],
      commonMistakes: [
        {
          misconception: 'NAT is a complete replacement for a firewall.',
          correction: 'While NAT hides internal IP addresses as a side-effect of address translation, it does not inspect packet state, enforce protocol policies, or block malicious application payloads.',
        },
      ],
      troubleshooting: [
        {
          symptom: 'Users in large office cannot open new web pages during peak afternoon hours, but existing open sessions work.',
          possibleCauses: ['PAT source port exhaustion on single public IP address'],
          diagnosticSteps: ['Run show ip nat statistics and inspect active translation count near 65,000', 'Check for failed translation misses'],
          remediation: 'Expand NAT pool to include a /29 public block with overload to multiply available source ports.',
        },
      ],
      recap: [
        'Static NAT provides 1-to-1 mapping for public servers.',
        'PAT (Overload) multiplexes thousands of private hosts onto a single public IP using Layer 4 ports.',
        'Port exhaustion occurs when concurrent connections exceed available ephemeral ports (~64k).',
        'ALGs inspect and rewrite payload-embedded IP addresses for protocols like FTP and SIP.',
      ],
    },
  },

  // =========================================================================
  // 9. vpn-cryptography-overview (NV-C04 / mod-c04-vpn-crypto)
  // =========================================================================
  {
    courseCode: 'NET-402',
    slug: 'vpn-cryptography-overview',
    title: 'VPN Technologies & Cryptography: Remote Access, WireGuard & TLS VPNs',
    type: LessonType.THEORY,
    durationMinutes: 35,
    order: 18,
    visualizationType: 'VPN_TUNNEL_COMPARISON',
    introduction:
      'Compare enterprise Virtual Private Network (VPN) architectures: Site-to-Site IPsec, Remote Access SSL/TLS, and modern WireGuard protocols.',
    contentV2: {
      objective:
        'Contrast Site-to-Site vs Remote Access VPN topologies, evaluate IPsec (IKEv2) against OpenVPN and WireGuard, and analyze Public Key Infrastructure (PKI) digital certificate authentication.',
      prerequisites: [
        'net-402-ipsec-vpn-cryptographic-tunnels: IPsec Tunnel Fundamentals',
        'network-security-basics-overview: Cryptographic Principles',
      ],
      whyItMatters:
        'Remote work and distributed enterprise offices require encrypted connectivity over untrusted public transit networks. Choosing the wrong VPN protocol causes severe throughput bottlenecks, excessive battery drain on mobile devices, or exposure to man-in-the-middle interception.',
      sourceAttribution: {
        bookTitle: 'CS-221 Computer Networking: Complete Mastery Textbook',
        edition: '2026 Edition — University, CCNA & Packet-Level Engineering',
        chapterNumber: 29,
        chapterTitle: 'MODULE 29 — NETWORK DEFENSE',
        sectionRef: '29.4 Enterprise VPN Architectures: Remote Access, SSL/TLS VPNs, WireGuard vs IPsec',
        standardsRefs: ['RFC 8446 (TLS 1.3)', 'RFC 7296 (IKEv2)', 'WireGuard Noise Protocol Framework'],
        cognitiveLevel: 'ANALYSIS',
        sourceVersion: '2026.1-ch29',
      },
      explanation:
        'A Virtual Private Network (VPN) encapsulates and encrypts IP packets within an outer transport carrier, establishing a secure overlay tunnel across untrusted public transit networks.\n\n### 1. Enterprise VPN Topologies\n* **Site-to-Site VPN (Gateway-to-Gateway)**: Permanently bridges two physically separated local area networks (e.g. Branch Office to Corporate Headquarters). Edge routers or firewalls perform transparent encryption/decryption; client workstations require no specialized VPN software.\n* **Remote Access VPN (Client-to-Gateway)**: Connects mobile roaming laptops or home workers directly to enterprise assets. Workstations execute VPN client software (Cisco AnyConnect, WireGuard client) that negotiates a virtual tunnel interface (e.g. `tun0`, `wg0`) with the central VPN concentrator.\n\n### 2. Protocol Comparison Matrix: IPsec vs. OpenVPN vs. WireGuard\n\n| Feature / Metric | IPsec (IKEv2 / ESP) | OpenVPN (SSL/TLS) | WireGuard |\n| :--- | :--- | :--- | :--- |\n| **OSI Layer** | Layer 3 (Network) | Layer 4 / 7 (Transport/User) | Layer 3 (Network) |\n| **Execution Context** | OS Kernel & Router ASIC | User-space daemon (tun/tap) | Linux OS Kernel |\n| **Cryptographic Suite** | Modular (AES-CBC/GCM, SHA-2, DH) | OpenSSL modular algorithms | Fixed Modern (Curve25519, ChaCha20, Poly1305) |\n| **Codebase Size** | ~100,000+ lines (StrongSwan) | ~120,000+ lines | ~4,000 lines (Auditable) |\n| **Handshake Latency** | Multi-roundtrip IKE exchange | TLS session negotiation overhead | 1 RTT Noise protocol handshake |\n| **Firewall Traversal** | Often blocked (ESP Protocol 50) | Easy (TCP port 443 mimicry) | High performance over UDP 51820 |\n\n### 3. Key Exchange & PKI Certificate Architecture\n* **Diffie-Hellman (DH) Key Agreement**: Enables two VPN gateways to negotiate a shared symmetric session secret across the public Internet without transmitting the secret itself.\n* **Public Key Infrastructure (PKI)**: Replaces insecure, non-scalable Pre-Shared Keys (PSK) with X.509 digital certificates signed by an enterprise Certificate Authority (CA) to guarantee mutual non-repudiation.\n\n### 4. Operational MTU & MSS Clamping Dynamics\nEncapsulating Security Payload (ESP) headers, initialization vectors, and tunnel IP headers add 50 to 73 bytes of overhead to each packet. If a client transmits a standard 1500-byte packet with the DF (Don\'t Fragment) bit set, the packet exceeds the WAN MTU and is dropped:\n* **Solution**: Implement MSS Clamping on the VPN gateway interface (`ip tcp adjust-mss 1360`), forcing the TCP endpoints to negotiate a Maximum Segment Size small enough to fit within the encrypted tunnel without fragmentation.\n\n### Quick Knowledge Check\n* *Question*: Why is running a TCP-based application over a TCP-based VPN tunnel strongly discouraged in production?\n* *Answer*: It causes "TCP Meltdown": packet loss on the underlying Internet triggers retransmissions and exponential backoffs in both the inner and outer TCP congestion control algorithms simultaneously.',
      components: [
        { name: 'VPN Gateway / Concentrator', detail: 'High-capacity appliance terminating thousands of encrypted user tunnels.' },
        { name: 'IPsec IKEv2', detail: 'Hardware-accelerated Layer 3 tunneling standard with MOBIKE mobile support.' },
        { name: 'WireGuard Kernel Module', detail: 'Ultra-fast, modern crypto tunneling protocol running in OS kernel space.' },
        { name: 'Certificate Authority (CA)', detail: 'Issues and revokes X.509 digital certificates for cryptographic identity verification.' },
      ],
      howItWorks: [
        { stepNumber: 1, title: 'Mutual Authentication', action: 'Client and gateway exchange digital certificates and verify signatures against trusted CA root.' },
        { stepNumber: 2, title: 'Diffie-Hellman Key Exchange', action: 'Endpoints compute a shared secret key over public transit without transmitting the key.' },
        { stepNumber: 3, title: 'Secure Virtual Interface', action: 'Virtual adapter (tun0 / wg0) encrypts outgoing corporate packets and wraps them in outer UDP/ESP headers.' },
      ],
      cliTooling: [
        {
          command: 'wg show',
          description: 'Displays active WireGuard tunnel interfaces, public keys, listening ports, and peer transfer statistics.',
          expectedOutput: 'interface: wg0\n  public key: XbF1...2aA=\n  listening port: 51820\npeer: 9kQ2...8xM=\n  endpoint: 203.0.113.50:51820\n  transfer: 4.52 MiB received, 12.80 MiB sent',
        },
      ],
      commonMistakes: [
        {
          misconception: 'TCP-over-TCP OpenVPN tunneling performs better than UDP.',
          correction: 'Running TCP over a TCP VPN tunnel triggers catastrophic TCP Meltdown: packet loss causes stacked retransmission timeouts across both nested layers.',
        },
      ],
      troubleshooting: [
        {
          symptom: 'Remote worker connects to VPN successfully, but cannot open internal web pages larger than 1400 bytes.',
          possibleCauses: ['MTU blackhole due to outer VPN tunnel encapsulation overhead (ESP adds 50-70 bytes)'],
          diagnosticSteps: ['Ping internal host with Don\'t Fragment (DF) bit set: ping -f -l 1472 <ip>'],
          remediation: 'Configure MSS clamping (`ip tcp adjust-mss 1360`) on the VPN gateway interface.',
        },
      ],
      recap: [
        'Site-to-Site connects entire offices; Remote Access connects mobile teleworkers.',
        'IPsec IKEv2 provides hardware-accelerated enterprise Layer 3 encryption.',
        'WireGuard delivers unmatched performance through lightweight kernel cryptography.',
        'Always run VPN tunnels over UDP to avoid TCP-over-TCP meltdown.',
      ],
    },
  },

  // =========================================================================
  // 10. level-0-basic-network-troubleshooting-workflow (NV-C05 / mod-c05-troubleshooting-workflows)
  // =========================================================================
  {
    courseCode: 'NET-TROUBLESHOOT',
    slug: 'level-0-basic-network-troubleshooting-workflow',
    title: 'Basic Network Troubleshooting: The Systematic Bottom-Up Diagnostic Method',
    type: LessonType.THEORY,
    durationMinutes: 30,
    order: 14,
    visualizationType: 'TROUBLESHOOTING_DECISION_TREE',
    introduction:
      'Learn the definitive Bottom-Up OSI diagnostic framework and master the fundamental command-line utilities used by professional network engineers.',
    contentV2: {
      objective:
        'Execute the 12-step Bottom-Up OSI troubleshooting methodology, interpret output from ping, traceroute, arp, and netstat, and systematically isolate network faults.',
      prerequisites: [
        'osi-model-7-layers: 7-Layer OSI Architecture',
        'level-0-devices-in-a-network: Hardware Roles',
      ],
      whyItMatters:
        'Random guessing during a major enterprise network outage wastes valuable time and risks introducing secondary faults. A disciplined, systematic troubleshooting methodology isolates the root cause within minutes.',
      sourceAttribution: {
        bookTitle: 'CS-221 Computer Networking: Complete Mastery Textbook',
        edition: '2026 Edition — University, CCNA & Packet-Level Engineering',
        chapterNumber: 30,
        chapterTitle: 'MODULE 30 — NETWORK TROUBLESHOOTING',
        sectionRef: '30.1 12-Step Diagnostic Framework & 30.2 OS Diagnostic CLI Tools (ipconfig/ip, ping, traceroute, arp)',
        standardsRefs: ['ISO/IEC 7498-1', 'RFC 792 (ICMP)'],
        cognitiveLevel: 'APPLICATION',
        sourceVersion: '2026.1-ch30',
      },
      explanation:
        'Structured troubleshooting follows a logical layered sequence to eliminate potential failure causes.\n\n### 1. The Bottom-Up Troubleshooting Strategy\nStarting at Layer 1 and working upward to Layer 7 guarantees that lower-layer physical and electrical dependencies are verified before investigating complex software configurations:\n1. **Layer 1 (Physical)**: Is the cable plugged in? Are link lights solid green? Is the transceiver seated?\n2. **Layer 2 (Data Link)**: Does `ipconfig /all` or `ip link` show a valid MAC address? Are switch port speed and duplex matching? Is the port in the correct VLAN?\n3. **Layer 3 (Network)**: Does the host have a valid IP and subnet mask? (Avoid APIPA 169.254.x.x). Can the host ping its default gateway?\n4. **Layer 4 (Transport)**: Can the host establish a TCP connection to the target port? Are firewall rules or ACLs blocking the socket?\n5. **Layer 7 (Application)**: Does DNS resolve the domain name? Is the web server daemon running and responding with HTTP 200?\n\n### 2. The Golden 5-Step Ping Sequence\nWhen a host reports total lack of connectivity, execute these 5 tests sequentially:\n1. `ping 127.0.0.1`: Tests internal TCP/IP stack and local OS network drivers.\n2. `ping <local-ip>`: Verifies local NIC binding and IP configuration.\n3. `ping <default-gateway>`: Tests local LAN media reachability across cables and switches.\n4. `ping 8.8.8.8`: Tests external Internet routing and WAN provider transit.\n5. `ping google.com`: Tests Domain Name System (DNS) name resolution.',
      components: [
        { name: 'Layer 1 Test', detail: 'Physical link carrier detect and interface LED status.' },
        { name: 'Loopback Test (127.0.0.1)', detail: 'Validates local OS kernel TCP/IP network protocol stack.' },
        { name: 'Default Gateway Test', detail: 'Isolates whether failure is local LAN or external routing.' },
        { name: 'DNS Resolution Test', detail: 'Verifies UDP port 53 name resolution to external servers.' },
      ],
      howItWorks: [
        { stepNumber: 1, title: 'Step 1: Check Loopback', action: 'ping 127.0.0.1 verifies TCP/IP software stack is healthy.' },
        { stepNumber: 2, title: 'Step 2: Check Gateway', action: 'ping default gateway verifies local Ethernet segment and switch path.' },
        { stepNumber: 3, title: 'Step 3: Check WAN IP', action: 'ping 8.8.8.8 verifies router NAT and ISP routing reachability.' },
        { stepNumber: 4, title: 'Step 4: Check FQDN', action: 'ping google.com verifies DNS resolver and server functionality.' },
      ],
      cliTooling: [
        {
          command: 'ping 127.0.0.1 \n ping 192.168.1.1 \n ping 8.8.8.8 \n nslookup example.com',
          description: 'The standard sequential diagnostic pipeline isolating stack, LAN, WAN, and DNS failures.',
          expectedOutput: 'Reply from 127.0.0.1: bytes=32 time<1ms TTL=128\nReply from 192.168.1.1: bytes=32 time=1ms TTL=64\nReply from 8.8.8.8: bytes=32 time=14ms TTL=118\nName: example.com, Address: 93.184.216.34',
        },
        {
          command: 'arp -a',
          description: 'Displays resolved Layer 3 to Layer 2 address mappings in the local host cache.',
          expectedOutput: 'Internet Address      Physical Address      Type\n192.168.1.1           00-14-22-01-23-45     dynamic',
        },
      ],
      commonMistakes: [
        {
          misconception: 'If pinging google.com fails, the Internet connection must be completely down.',
          correction: 'If `ping 8.8.8.8` succeeds but `ping google.com` fails, the Internet connection is 100% operational; only DNS name resolution is failing.',
        },
      ],
      troubleshooting: [
        {
          symptom: 'Host has IP address 169.254.12.89 and cannot reach local file servers or Internet.',
          possibleCauses: ['DHCP server unreachable; host self-assigned an APIPA address', 'VLAN misconfiguration on switch port'],
          diagnosticSteps: ['Check ipconfig /all to verify DHCP lease status', 'Verify link light and physical switch port assignment'],
          remediation: 'Verify DHCP server service is running and execute `ipconfig /renew` to acquire valid IP lease.',
        },
      ],
      recap: [
        'Bottom-Up troubleshooting verifies Layer 1 through Layer 7 sequentially.',
        'The 5-step ping sequence isolates Stack, NIC, Gateway, WAN, and DNS issues.',
        'APIPA address (169.254.x.x) always indicates DHCP failure.',
        'Never jump to reconfiguring routers before verifying basic physical and link health.',
      ],
    },
  },

  // =========================================================================
  // 11. network-troubleshooting-overview (NV-C05 / mod-c05-troubleshooting-workflows)
  // =========================================================================
  {
    courseCode: 'NET-TROUBLESHOOT',
    slug: 'network-troubleshooting-overview',
    title: 'Enterprise Network Incident Diagnostics: Symptom-to-Root-Cause Playbooks',
    type: LessonType.THEORY,
    durationMinutes: 35,
    order: 20,
    visualizationType: 'INCIDENT_TRIAGE_MATRIX',
    introduction:
      'Master high-impact enterprise incident triage: diagnose MTU blackholes, duplex mismatches, broadcast storms, routing loops, and asymmetric traffic flows.',
    contentV2: {
      objective:
        'Diagnose complex multi-layer enterprise network incidents using structured symptom-to-root-cause decision trees and advanced router/switch diagnostic outputs.',
      prerequisites: [
        'level-0-basic-network-troubleshooting-workflow: Basic Diagnostic Methods',
        'net-304-single-area-ospf-routing: Dynamic Routing Verification',
        'net-302-spanning-tree-protocol-loop-prevention: STP Diagnostics',
      ],
      whyItMatters:
        'Enterprise outages cost thousands of dollars per minute. Senior network engineers must rapidly interpret hardware error counters, spanning tree state anomalies, and routing flap patterns to restore business operations under pressure.',
      sourceAttribution: {
        bookTitle: 'CS-221 Computer Networking: Complete Mastery Textbook',
        edition: '2026 Edition — University, CCNA & Packet-Level Engineering',
        chapterNumber: 30,
        chapterTitle: 'MODULE 30 — NETWORK TROUBLESHOOTING',
        sectionRef: '30.3 Failure Modes & Decision Trees & Supplemental Failure-Injection Playbook',
        standardsRefs: ['RFC 1122 (Host Requirements)', 'Cisco High Availability & Troubleshooting Guides'],
        cognitiveLevel: 'EVALUATION',
        sourceVersion: '2026.1-ch30',
      },
      explanation:
        'Complex network failures often present with ambiguous symptoms. Engineers use deterministic playbooks to isolate obscure failure modes.\n\n### 1. MTU Blackhole & Path MTU Discovery Failure\n* **Symptom**: Ping works, small HTTP requests succeed, but large file transfers or SSL/TLS handshakes stall indefinitely.\n* **Root Cause**: An intermediate router link has a smaller MTU (e.g. 1420 bytes due to PPPoE or IPsec VPN). The router drops packets larger than 1420 with the Don\'t Fragment (DF) bit set and generates an ICMP Type 3 Code 4 (Fragmentation Needed) packet. If a firewall aggressively blocks all ICMP, the sender never receives the notification, creating an **MTU Blackhole**.\n* **Remediation**: Allow ICMP Type 3 Code 4 on all firewalls and configure TCP MSS Clamping (`ip tcp adjust-mss 1360`).\n\n### 2. Duplex Mismatch (Half vs. Full Duplex)\n* **Symptom**: Link shows up/up, low-volume pings succeed, but throughput collapses and error counters skyrocket under high traffic.\n* **Root Cause**: One side of the link is manually forced to Full Duplex while the other uses Auto-negotiation (defaulting to Half Duplex). The Half-duplex side interprets simultaneous transmissions as physical collisions and aborts.\n* **Indicators**: `show interfaces` shows high late collisions and CRC errors.\n\n### 3. Asymmetric Routing & Stateful Firewalls\n* **Symptom**: Outbound traffic routes via ISP-A, but return traffic routes via ISP-B. The firewall on ISP-B drops the return packets because it has no record of the initial TCP SYN in its connection table.\n* **Remediation**: Align BGP routing policies, use NAT to anchor return paths, or cluster firewalls with synchronized state sharing.',
      components: [
        { name: 'MTU Blackhole Detector', detail: 'DF-bit ping sweeps identifying path MTU bottleneck thresholds.' },
        { name: 'Duplex Error Counter', detail: 'Hardware counters tracking late collisions and runts indicative of duplex mismatches.' },
        { name: 'Asymmetric Route Analyzer', detail: 'Traceroute path comparison verifying symmetrical forward and reverse hops.' },
      ],
      howItWorks: [
        { stepNumber: 1, title: 'Triage & Symptom Assessment', action: 'Identify whether issue is intermittent, throughput-limited, or total blackout.' },
        { stepNumber: 2, title: 'Hardware Interface Audit', action: 'Inspect error counters: runts, giants, CRC errors, frame errors, late collisions.' },
        { stepNumber: 3, title: 'Protocol State Verification', action: 'Validate OSPF neighbor adjacencies, STP port states, and ARP binding accuracy.' },
        { stepNumber: 4, title: 'Root Cause Remediation', action: 'Apply targeted fix, clear counters, and monitor error rates to confirm resolution.' },
      ],
      cliTooling: [
        {
          command: 'show interfaces GigabitEthernet0/1 | include (line protocol|errors|collisions|duplex)',
          description: 'Quickly filters interface operational state, duplex mode, CRC error counts, and late collisions.',
          expectedOutput: 'GigabitEthernet0/1 is up, line protocol is up\n  Full-duplex, 1000Mb/s, link type is force-up\n  0 input errors, 0 CRC, 0 frame, 0 overrun\n  0 collisions, 0 late collision',
        },
        {
          command: 'traceroute 10.50.1.1 numeric',
          description: 'Traces hop-by-hop Layer 3 path without DNS delays to identify where packets diverge or loop.',
          expectedOutput: '1 192.168.1.254 1 ms 1 ms 1 ms\n2 10.0.0.1 4 ms 3 ms 4 ms\n3 10.50.1.1 8 ms 7 ms 8 ms',
        },
      ],
      commonMistakes: [
        {
          misconception: 'Late collisions are normal on busy Ethernet networks.',
          correction: 'Late collisions should NEVER occur on switched full-duplex links. Late collisions almost always indicate a duplex mismatch or excessive cable length exceeding IEEE specifications (>100 meters).',
        },
      ],
      troubleshooting: [
        {
          symptom: 'Switch CPU utilization at 100%, activity LEDs flashing frantically on all ports, and network unreachable.',
          possibleCauses: ['Layer 2 broadcast storm caused by Spanning Tree failure or unmanaged loop'],
          diagnosticSteps: ['Check show spanning-tree to verify root bridge stability', 'Look for continuous MAC flapping syslog messages in console'],
          remediation: 'Identify looping port via syslog and shut it down immediately; verify BPDU Guard is active on all edge access ports.',
        },
      ],
      recap: [
        'MTU blackholes occur when ICMP Fragmentation Needed packets are blocked by firewalls.',
        'Duplex mismatches cause late collisions, CRC errors, and collapsed throughput under load.',
        'Stateful firewalls drop asymmetric return traffic unless conntrack tables are synchronized.',
        'Broadcast storms can be halted immediately by disabling the looping port and verifying STP BPDU Guard.',
      ],
    },
  },

  // =========================================================================
  // 12. sdn-cloud-networking-overview (NV-C05 / mod-c05-network-automation)
  // =========================================================================
  {
    courseCode: 'NET-403',
    slug: 'sdn-cloud-networking-overview',
    title: 'Software-Defined Networking (SDN) & Cloud Architecture',
    type: LessonType.THEORY,
    durationMinutes: 35,
    order: 21,
    visualizationType: 'SDN_ARCHITECTURE_CONTROLLER',
    introduction:
      'Explore the architectural transition from legacy distributed network hardware to Software-Defined Networking (SDN), Cloud Fabrics, and modern Spine-Leaf topologies.',
    contentV2: {
      objective:
        'Contrast traditional distributed control planes with centralized SDN architectures, compare Southbound and Northbound APIs, and evaluate East-West traffic flows in 2-tier Spine-Leaf Clos fabrics.',
      prerequisites: [
        'level-0-routers-inter-subnet-pathfinders: Control Plane vs Data Plane',
        'net-403-network-automation-programmability-foundations: Automation Principles',
      ],
      whyItMatters:
        'Modern cloud hyperscalers (AWS, Azure, Google Cloud) and enterprise private clouds cannot be managed box-by-box with legacy CLI commands. SDN enables programmatic, policy-driven network provisioning in seconds via software controllers.',
      sourceAttribution: {
        bookTitle: 'CS-221 Computer Networking: Complete Mastery Textbook',
        edition: '2026 Edition — University, CCNA & Packet-Level Engineering',
        chapterNumber: 35,
        chapterTitle: 'MODULE 35 — NETWORK ARCHITECTURE',
        sectionRef: '35.1 Cisco 3-Tier Model vs Modern Data Center Spine-Leaf Fabric & SDN Control/Data Plane Separation',
        standardsRefs: ['RFC 7426 (SDN Architecture)', 'ONF OpenFlow Specification', 'ANSI/TIA-942'],
        cognitiveLevel: 'ANALYSIS',
        sourceVersion: '2026.1-ch35',
      },
      explanation:
        'Software-Defined Networking (SDN) re-architects enterprise and cloud networks by decoupling the decision-making control plane from the high-speed packet forwarding hardware.\n\n### 1. Control Plane vs. Data Plane Decoupling\n\n| Network Plane | Traditional Architecture | Software-Defined Networking (SDN) |\n| :--- | :--- | :--- |\n| **Management Plane** | Box-by-box CLI / SNMP | Centralized intent-driven Web UI / CI/CD pipeline |\n| **Control Plane** | Distributed OSPF/BGP/STP engines per device | Centralized software controller (Cisco DNA Center, OpenDaylight) |\n| **Data (Forwarding) Plane** | Integrated ASICs executing local routing table | High-speed dumb/programmable ASICs populating flow tables from controller |\n\n### 2. Programmability Interfaces: Northbound vs. Southbound APIs\n* **Southbound APIs (Controller to Forwarding Nodes)**: Protocols enabling the controller to program flow forwarding tables into physical and virtual switches.\n  * *OpenFlow (RFC 5440 / ONF)*: Primitive flow-table manipulation (match/action pipelines).\n  * *NETCONF / RESTCONF (RFC 6241 / RFC 8040)*: Structured XML/JSON configuration over SSH/HTTPS modeled in YANG.\n  * *gNMI / gRPC (Google)*: High-frequency streaming telemetry and state manipulation using Protocol Buffers.\n* **Northbound APIs (Applications to Controller)**: RESTful HTTPS/JSON interfaces consumed by business logic, monitoring platforms, and Infrastructure-as-Code automation tools (Ansible, Terraform).\n\n### 3. Modern Data Center Fabric: 2-Tier Spine-Leaf (Clos) Architecture\nTraditional 3-tier hierarchical designs (Core, Distribution, Access) were designed for **North-South traffic** (clients accessing Internet services). Modern cloud applications generate >80% **East-West traffic** (distributed microservices, database replication, Hadoop/Spark big data):\n* **Spine-Leaf Topology**: Every Leaf switch (Top of Rack) connects to **every single Spine switch** in a bipartite mesh. Spines never connect directly to Spines, and Leaves never connect directly to Leaves.\n* **Equidistant 2-Hop Latency**: Every server connected to a leaf reaches any other server in the data center in exactly two hops (Leaf -> Spine -> Leaf), eliminating jitter.\n* **Layer 3 ECMP**: Replaces blocking Spanning Tree Protocol with Layer 3 dynamic routing (eGP BGP / IS-IS). Equal-Cost Multi-Path (ECMP) utilizes 100% of all redundant uplinks simultaneously.\n\n### 4. Controller Resiliency & Failure Modes\n* *Fail-Secure / Standalone Mode*: If communication between the leaf switches and the centralized SDN controller is interrupted, leaf switches maintain their existing TCAM flow entries and continue forwarding production traffic autonomously.\n\n### Quick Knowledge Check\n* *Question*: Why is Spanning Tree Protocol (STP) eliminated in modern cloud Spine-Leaf fabrics?\n* *Answer*: STP disables redundant links to prevent loops, stranding up to 50% of costly data center bandwidth. Spine-Leaf uses Layer 3 ECMP routing, forwarding across all redundant uplinks concurrently.',
      components: [
        { name: 'SDN Controller', detail: 'Centralized software platform managing network topology and policy logic.' },
        { name: 'Southbound API (OpenFlow / NETCONF)', detail: 'Protocol interface programming hardware switch flow tables.' },
        { name: 'Northbound API (REST/JSON)', detail: 'Interface consumed by applications and automation scripts.' },
        { name: 'Spine-Leaf Fabric', detail: 'Two-tier Clos network delivering equidistant 2-hop East-West data center latency.' },
      ],
      howItWorks: [
        { stepNumber: 1, title: 'Policy Definition', action: 'Network engineer or DevOps pipeline submits JSON intent to SDN controller via REST API.' },
        { stepNumber: 2, title: 'Path Computation', action: 'Centralized controller calculates optimal global path using complete topology awareness.' },
        { stepNumber: 3, title: 'Flow Rule Push', action: 'Controller pushes OpenFlow or NETCONF flow entries down to leaf switches via Southbound API.' },
        { stepNumber: 4, title: 'Hardware Switching', action: 'Switches forward packets at line rate using newly programmed TCAM flow entries.' },
      ],
      cliTooling: [
        {
          command: 'curl -k -u admin:Cisco123 -X GET https://sdn-controller.corp/dna/intent/api/v1/network-device -H "Content-Type: application/json"',
          description: 'Queries an enterprise SDN controller Northbound REST API to retrieve real-time inventory and health telemetry.',
          expectedOutput: '{\n  "response": [\n    {"hostname": "Spine-01", "role": "SPINE", "status": "REACHABLE"},\n    {"hostname": "Leaf-01", "role": "LEAF", "status": "REACHABLE"}\n  ]\n}',
        },
      ],
      commonMistakes: [
        {
          misconception: 'Spine-Leaf data centers use Spanning Tree Protocol to prevent loops.',
          correction: 'Spine-Leaf fabrics run Layer 3 dynamic routing protocols (such as BGP or IS-IS) with Equal-Cost Multi-Path (ECMP). Spanning Tree is explicitly avoided because it disables half the redundant links.',
        },
      ],
      troubleshooting: [
        {
          symptom: 'Leaf switch drops connection to SDN controller and stops forwarding newly introduced flows.',
          possibleCauses: ['Control network link failure', 'Controller cluster failure', 'Southbound TLS certificate expiration'],
          diagnosticSteps: ['Verify out-of-band management connectivity from leaf to controller IP', 'Check leaf switch fallback mode (standalone vs fail-secure)'],
          remediation: 'Configure leaf switches with fail-secure standalone routing so they continue forwarding existing traffic if controller connectivity is lost.',
        },
      ],
      recap: [
        'SDN decouples the Control Plane (centralized software controller) from the Data Plane (forwarding switches).',
        'Southbound APIs (OpenFlow, NETCONF) program switches; Northbound APIs (REST) expose network controls to software.',
        'Spine-Leaf architecture provides deterministic 2-hop latency for modern East-West data center traffic.',
        'ECMP routing replaces Spanning Tree to utilize 100% of all redundant fabric links simultaneously.',
      ],
    },
  },
];

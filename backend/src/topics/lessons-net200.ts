import { CourseLevel, LessonType, CognitiveLevel, QuestionType } from '@prisma/client';
import { BenchmarkLessonFullDefinition } from './lessons-net300-400';

export const LESSONS_NET200: BenchmarkLessonFullDefinition[] = [
  // =========================================================================
  // COURSE: NET-201 (Ethernet & Layer 2 Technologies)
  // =========================================================================

  // -------------------------------------------------------------------------
  // 1. NET-201: MAC Addresses & Physical Hardware Identity
  // -------------------------------------------------------------------------
  {
    courseCode: 'NET-201',
    slug: 'level-0-mac-addresses-physical-identity',
    title: 'MAC Addresses & Physical Hardware Identity',
    type: LessonType.THEORY,
    durationMinutes: 20,
    order: 1,
    visualizationType: 'MAC_BIT_PARSER',
    introduction:
      'Master Layer 2 physical hardware addressing: 48-bit (6-byte) MAC address architecture, Organizationally Unique Identifiers (OUI) vs Vendor-Assigned NIC bytes, hexadecimal representation, Unicast vs Multicast vs Broadcast destination types, and the Individual/Group (I/G) and Universal/Local (U/L) bit semantics.',
    stepMetadata: {
      step1_objective:
        'Understand 48-bit MAC address architecture, differentiate between OUI (first 24 bits) and NIC identifiers (last 24 bits), analyze I/G and U/L bit logic, and classify Unicast, Multicast, and Broadcast MAC addresses.',
      step2_prerequisites: ['net-101-bits-bytes-binary-hex', 'ethernet-mac-addresses-overview'],
      step3_whyItMatters:
        'Every Network Interface Card (NIC) manufactured on Earth has a globally unique burned-in MAC address. Layer 2 switches make all frame forwarding decisions based on destination MAC addresses.',
      step4_coreConcept:
        'A Media Access Control (MAC) address is a 48-bit (6-byte / 12-hex-digit) physical hardware identifier permanently assigned to a Network Interface Card (NIC). The first 24 bits (3 bytes) constitute the Organizationally Unique Identifier (OUI) assigned to hardware manufacturers (e.g. Cisco, Apple, Intel) by the IEEE. The remaining 24 bits (3 bytes) are the vendor-assigned Network Interface Controller (NIC) serial identifier. Bit 0 of octet 1 is the Individual/Group (I/G) bit: $0 = \\text{Unicast}$ (single NIC), $1 = \\text{Multicast}$ (e.g. `01:00:5e:...`). Bit 1 of octet 1 is the Universal/Local (U/L) bit: $0 = \\text{Universally Administered OUI}$, $1 = \\text{Locally Administered/Overridden}$. The broadcast address is `ff:ff:ff:ff:ff:ff` (all 48 bits set to 1).',
      step5_technicalAnatomy: {
        title: '48-Bit MAC Address Structure & Control Bit Architecture',
        description: 'OUI vs NIC split, bit layout, and hexadecimal notation.',
        components: [
          { name: 'OUI (Organizationally Unique Identifier)', detail: 'First 24 bits (3 bytes / 6 hex digits). Assigned by IEEE to identify the hardware manufacturer (e.g. 00:1A:2B = Cisco).' },
          { name: 'NIC Specific Extension Identifier', detail: 'Last 24 bits (3 bytes / 6 hex digits). Assigned uniquely by manufacturer to individual hardware interfaces.' },
          { name: 'Individual / Group (I/G) Bit', detail: 'Least Significant Bit of first octet. 0 = Unicast (individual NIC destination); 1 = Multicast (group subscription).' },
          { name: 'Universal / Local (U/L) Bit', detail: 'Second bit of first octet. 0 = Universally administered (IEEE OUI certified); 1 = Locally administered (custom/virtualized MAC).' },
          { name: 'Broadcast MAC Address', detail: '`ff:ff:ff:ff:ff:ff` (all 48 bits set to 1). Delivered to all ports within the local broadcast domain.' },
        ],
      },
      step6_howItWorks: {
        steps: [
          { stepNumber: 1, title: 'OUI IEEE Lookup', action: 'Inspect first 3 bytes of MAC (e.g. `00:50:56`) to identify the vendor (VMware).' },
          { stepNumber: 2, title: 'Control Bit Inspection', action: 'Inspect first byte in binary to check I/G bit (bit 0) for unicast vs multicast.' },
          { stepNumber: 3, title: 'Switch CAM Table Ingress', action: 'Switch records source MAC against incoming switchport in its CAM table.' },
        ],
      },
      step7_packetHeaderView: {
        protocol: '48-Bit MAC Address Field Layout',
        fields: [
          { fieldName: 'OUI Vendor Prefix', bitLength: '24 bits (3 Bytes)', hexSample: '00:1A:2B', description: 'IEEE assigned manufacturer prefix.' },
          { fieldName: 'NIC Serial Suffix', bitLength: '24 bits (3 Bytes)', hexSample: '3C:4D:5E', description: 'Manufacturer interface identifier.' },
          { fieldName: 'Broadcast MAC', bitLength: '48 bits', hexSample: 'FF:FF:FF:FF:FF:FF', description: 'All-nodes Layer 2 broadcast.' },
        ],
      },
      step8_visualExplanation: {
        type: 'MAC_BIT_PARSER',
        title: 'Interactive 48-Bit MAC Address & OUI Bit Parser',
        description: 'Input any MAC address to parse OUI manufacturer vendor, toggle I/G and U/L bits, and observe Unicast/Multicast/Broadcast classification.',
      },
      step9_workedExample: {
        title: 'Parsing MAC Address 01:00:5E:00:00:01 for Multicast Classification',
        problemStatement: 'Analyze MAC address `01:00:5E:00:00:01`. Determine: (1) Unicast vs Multicast, (2) Universal vs Local.',
        stepByStepSolution: [
          'Step 1: Convert the first byte `0x01` to 8-bit binary: `00000001`.',
          'Step 2: Inspect Least Significant Bit (Bit 0): The bit is `1` -> Multicast (I/G = 1).',
          'Step 3: Inspect Second Bit (Bit 1): The bit is `0` -> Universally Administered (U/L = 0, assigned by IANA for IPv4 multicast).',
        ],
        finalResult: '`01:00:5E:00:00:01` is an IPv4 Multicast universally administered MAC address.',
      },
      step10_realWorldScenario: {
        topology: 'Virtual Machine MAC Address Duplication Incident',
        scenarioText: 'A cloned VM boots with an identical locally administered MAC address as another host. The switch CAM table flaps rapidly between two ports, causing packet loss. Re-generating a unique MAC resolves the CAM flapping.',
        engineeringContext: 'MAC address uniqueness on a Layer 2 LAN is mandatory for deterministic switch forwarding.',
      },
      step11_deviceBehavior: {
        hostBehavior: 'NIC filters out all incoming unicast frames whose destination MAC does not match its own MAC.',
        nicBehavior: 'Burned-in Address (BIA) loaded from EEPROM into hardware registers on boot.',
        switchOrRouterBehavior: 'Switches build Source MAC to Port mappings in content-addressable memory (CAM).',
      },
      step12_cliTooling: [
        {
          command: 'getmac /v',
          description: 'Displays active network adapter names, MAC physical addresses, and transport names on Windows.',
          expectedOutput: 'Ethernet  00-1A-2B-3C-4D-5E  \\Device\\Tcpip_{...}',
          proofExplanation: 'Proves 48-bit physical MAC address assigned to host NIC.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'Switch logs `%SW_MATM-4-MACFLAP_NOTIF: Host 001a.2b3c.4d5e is flapping between port Gi0/1 and Gi0/2`.',
          possibleCauses: ['Duplicate MAC address configured on two hosts or physical Layer 2 loop'],
          diagnosticSteps: ['Check connected devices on ports Gi0/1 and Gi0/2.'],
          remediation: 'Reconfigure duplicate host MAC or resolve switchport loop.',
        },
      ],
      step14_commonMistakes: [
        { misconception: 'Thinking MAC addresses change when a laptop moves to a new Wi-Fi network.', correction: 'A burned-in MAC address is permanent to the hardware NIC; IP addresses change, MAC addresses remain static.' },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'MAC Address Spoofing',
        mitigationStrategy: 'Enable Switchport Port Security (`switchport port-security mac-address sticky`) to lock ports to authorized MACs.',
      },
      step16_examPrep: {
        keyExamPoints: ['48 bits (6 bytes / 12 hex chars).', 'First 24 bits = OUI; Last 24 bits = NIC identifier.', 'Broadcast = FF:FF:FF:FF:FF:FF.'],
        frequentTraps: ['Confusing bit count (48 bits) with IPv4 bit count (32 bits).'],
      },
      step17_practicalLabRef: {
        title: 'Guided Practice: MAC Address Parsing & Hardware Identity Inspection',
        scenario: 'Inspect physical MAC addresses with CLI and parse OUI prefixes.',
        tasks: ['Run getmac /v and extract the 48-bit hardware address.'],
        verificationMethod: 'Verify correct OUI and NIC split.',
      },
      step18_masterySummary: {
        summaryPoints: ['MAC addresses provide 48-bit Layer 2 physical identity.', 'First 24 bits are OUI; last 24 bits are NIC serial.'],
        nextLessonBridge: 'Proceed to NET-201 Lesson 2 to master Ethernet II Frame Structures.',
      },
    },
    questions: [
      {
        text: 'What is the total bit length and standard byte structure of an Ethernet MAC physical hardware address?',
        options: [
          '48 bits (6 Bytes / 12 hexadecimal digits), split into a 24-bit OUI manufacturer prefix and a 24-bit vendor-assigned NIC identifier',
          '32 bits (4 Bytes / 4 dotted-decimal octets)',
          '128 bits (16 Bytes / 8 hexadecimal hextets)',
          '64 bits (8 Bytes)',
        ],
        correctOption: 0,
        explanation: 'A standard IEEE 802 MAC address is 48 bits (6 octets / 12 hex digits). The first 24 bits are the Organizationally Unique Identifier (OUI); the last 24 bits are the NIC identifier.',
        explanationsJson: { 1: '32 bits is an IPv4 address.', 2: '128 bits is an IPv6 address.', 3: '64 bits is EUI-64.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'MAC Address Bit Length & Architecture',
      },
    ],
    lab: {
      title: 'Guided Practice: MAC Address Parsing & Hardware Identity Inspection',
      instructions: '1. Run getmac /v.\n2. Identify OUI and NIC fields.',
      difficulty: CourseLevel.FOUNDATIONAL,
      estimatedMinutes: 15,
      initialTopologyJson: { hostName: 'Workstation', mac: '00-1A-2B-3C-4D-5E' },
      tasks: ['Run getmac /v.'],
    },
  },

  // -------------------------------------------------------------------------
  // 2. NET-201: Ethernet II Framing, Frame Formats & Transmission Mechanics
  // -------------------------------------------------------------------------
  {
    courseCode: 'NET-201',
    slug: 'ethernet-mac-addresses-overview',
    title: 'Ethernet II Framing, Frame Formats & Transmission Mechanics',
    type: LessonType.THEORY,
    durationMinutes: 25,
    order: 2,
    visualizationType: 'ETHERNET_FRAME_INSPECTOR',
    introduction:
      'Master the standard data link encapsulation unit: The Ethernet II frame anatomy, Preamble & Start Frame Delimiter (SFD), Destination/Source MAC fields, EtherType field codes (IPv4 0x0800, IPv6 0x86DD, ARP 0x0806), Payload & MTU boundaries (46 to 1500 bytes), Frame Check Sequence (FCS / 32-bit CRC), minimum frame size (64 bytes), and runt/giant frame detection.',
    stepMetadata: {
      step1_objective:
        'Understand complete Ethernet II frame anatomy, analyze EtherType multiplexing, calculate minimum/maximum frame boundaries (64 to 1518 bytes), and identify runt/giant frame anomalies.',
      step2_prerequisites: ['level-0-mac-addresses-physical-identity'],
      step3_whyItMatters:
        'Ethernet II is the universal Layer 2 framing standard for wired networks. Understanding frame headers, EtherType codes, and CRC error checking is essential for packet capture analysis and troubleshooting.',
      step4_coreConcept:
        'An Ethernet II frame wraps Layer 3 packets for transmission over physical media: Preamble (7 bytes alternating 10101010 for clock sync) + SFD (1 byte `10101011` / `0xAB` signaling start of frame), Destination MAC (6 bytes), Source MAC (6 bytes), EtherType (2 bytes identifying upper protocol: `0x0800` IPv4, `0x86DD` IPv6, `0x0806` ARP), Payload Data (46 to 1500 bytes), and Frame Check Sequence (FCS, 4 bytes 32-bit CRC). Minimum frame size is 64 bytes ($6+6+2+46+4=64$). If payload is < 46 bytes, Padding bytes are added. Standard Maximum Transmission Unit (MTU) is 1500 bytes (yielding 1518-byte max untagged frame). Frames < 64 bytes are Runt frames (collisions); frames > 1518 bytes are Giant/Jumbo frames.',
      step5_technicalAnatomy: {
        title: 'Ethernet II Frame Structure & Byte Field Allocations',
        description: 'Complete breakdown of all Ethernet II fields and size limits.',
        components: [
          { name: 'Preamble & SFD (8 Bytes)', detail: '7 bytes alternating 10101010 + 1 byte Start Frame Delimiter (10101011) to synchronize physical receiver clocks.' },
          { name: 'Destination & Source MAC (12 Bytes)', detail: '6 bytes Destination MAC followed by 6 bytes Source MAC.' },
          { name: 'EtherType (2 Bytes)', detail: 'Identifies upper layer: `0x0800` (IPv4), `0x86DD` (IPv6), `0x0806` (ARP), `0x8100` (802.1Q VLAN).' },
          { name: 'Payload Data & Padding (46 to 1500 Bytes)', detail: 'Carries Layer 3 packet. Minimum 46 bytes (padded with zeros if smaller); standard maximum MTU = 1500 bytes.' },
          { name: 'Frame Check Sequence / FCS (4 Bytes)', detail: '32-bit Cyclic Redundancy Check (CRC-32) computed across MAC, EtherType, and Payload to detect bit corruption.' },
          { name: 'Minimum & Maximum Frame Size', detail: 'Minimum valid frame: 64 bytes. Standard maximum: 1518 bytes (1522 with 802.1Q tag; up to 9000 bytes for Jumbo frames).' },
        ],
      },
      step6_howItWorks: {
        steps: [
          { stepNumber: 1, title: 'Frame Encapsulation', action: 'Layer 3 IP packet is placed into Ethernet payload; EtherType set to 0x0800.' },
          { stepNumber: 2, title: 'CRC-32 Calculation', action: 'Transmitter calculates 32-bit CRC across frame bytes and appends 4-byte FCS trailer.' },
          { stepNumber: 3, title: 'Physical Transmission', action: 'Transceiver precedes frame with 8-byte Preamble/SFD and clocks bits onto wire.' },
          { stepNumber: 4, title: 'Receiver Verification', action: 'Receiver recalculates CRC; if matching, strips headers and passes packet to IP stack; if mismatch, frame is silently dropped.' },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'Ethernet II Frame Header & Trailer Fields',
        fields: [
          { fieldName: 'Preamble + SFD', bitLength: '8 Bytes', hexSample: '55 55 55 55 55 55 55 D5', description: 'Clock synchronization sequence.' },
          { fieldName: 'Destination MAC', bitLength: '6 Bytes', hexSample: '00:1A:2B:3C:4D:5E', description: 'Target hardware address.' },
          { fieldName: 'Source MAC', bitLength: '6 Bytes', hexSample: '00:11:22:33:44:55', description: 'Sender hardware address.' },
          { fieldName: 'EtherType', bitLength: '2 Bytes', hexSample: '0x0800 (IPv4)', description: 'Multiplexes upper Layer 3 protocol.' },
          { fieldName: 'Payload (MTU)', bitLength: '46 - 1500 Bytes', hexSample: 'IP Packet', description: 'Encapsulated Layer 3 data.' },
          { fieldName: 'FCS (CRC-32)', bitLength: '4 Bytes', hexSample: '0x3F2A1B0C', description: '32-bit error detection checksum.' },
        ],
        headerDiagramAscii: `
+-----------------------------------------------------------------------------------+
|                            ETHERNET II FRAME ANATOMY                              |
+-------------+-------------+-------------+-----------+-----------------+-----------+
| Preamble/SFD| Dest MAC    | Source MAC  | EtherType | Payload (Data)  | FCS (CRC) |
|   8 Bytes   |   6 Bytes   |   6 Bytes   |  2 Bytes  | 46 - 1500 Bytes |  4 Bytes  |
+-------------+-------------+-------------+-----------+-----------------+-----------+
|<----------------- Standard Minimum Frame: 64 Bytes ------------------------------>|
|<----------------- Standard Maximum Frame: 1518 Bytes ---------------------------->|
`,
      },
      step8_visualExplanation: {
        type: 'ETHERNET_FRAME_INSPECTOR',
        title: 'Interactive Ethernet II Frame Inspector & CRC Engine',
        description: 'Dissect live Ethernet frames byte-by-byte, inspect EtherType values (0x0800, 0x86DD, 0x0806), observe padding addition for small payloads, and calculate CRC-32 checksums.',
      },
      step9_workedExample: {
        title: 'Calculating Minimum Frame Padding and Size for a 20-Byte ARP Request',
        problemStatement: 'An ARP request is 28 bytes long. When encapsulated into Ethernet II:\n1. How many bytes of padding are added?\n2. What is the total frame size transmitted on the wire (excluding preamble)?',
        stepByStepSolution: [
          'Step 1 (Payload Minimum): Minimum payload requirement for Ethernet II is 46 bytes.',
          'Step 2 (Padding Calculation): ARP request is 28 bytes. Padding required = 46 - 28 = 18 bytes of zero padding.',
          'Step 3 (Total Frame Calculation): Dest MAC (6) + Src MAC (6) + EtherType (2) + Payload (28) + Padding (18) + FCS (4) = 64 bytes total.',
        ],
        finalResult: '18 bytes of padding added; total transmitted frame size is exactly 64 bytes.',
      },
      step10_realWorldScenario: {
        topology: 'Enterprise Switch Runt Frame Drops from Collisions',
        scenarioText: 'A damaged Ethernet cable causes signal reflections that truncate frames to 48 bytes. The enterprise switch drops them immediately, logging thousands of "Runt" errors because they violate the 64-byte minimum frame rule. Replacing the damaged cable resolves the packet drops.',
        engineeringContext: 'Switches automatically discard runt frames (< 64 bytes) as collision artifacts.',
      },
      step11_deviceBehavior: {
        hostBehavior: 'Adds zero padding if payload is smaller than 46 bytes.',
        nicBehavior: 'Computes CRC-32 in hardware on transmit; verifies CRC on receive.',
        switchOrRouterBehavior: 'Discards corrupted frames with invalid CRC silently without generating ICMP messages.',
      },
      step12_cliTooling: [
        {
          command: 'show interfaces GigabitEthernet0/1',
          description: 'Displays MTU, input/output packet counts, CRC error counters, and runt/giant frame counters on a switch port.',
          expectedOutput: 'MTU 1500 bytes, BW 1000000 Kbit/sec\n     0 runts, 0 giants, 0 CRC, 0 frame',
          proofExplanation: 'Confirms standard 1500-byte MTU and zero CRC/runt errors.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'Switch port reports escalating "CRC errors" and "Input errors".',
          possibleCauses: ['Damaged copper patch cable, loose RJ-45 connector, or high electromagnetic interference'],
          diagnosticSteps: ['Inspect cable integrity with cable tester and check interface counters.'],
          remediation: 'Replace damaged patch cord with certified Cat6 cable.',
        },
      ],
      step14_commonMistakes: [
        { misconception: 'Believing Ethernet frames contain an IP Time-To-Live (TTL) field.', correction: 'Ethernet Layer 2 frames have NO TTL field; TTL exists strictly at Layer 3 inside the IP header.' },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'VLAN Tag Injection (Double Tagging 802.1Q)',
        mitigationStrategy: 'Configure native VLANs to an unused ID and disable DTP trunk autonegotiation on access ports.',
      },
      step16_examPrep: {
        keyExamPoints: [
          'Ethernet II fields: Dest MAC (6B), Src MAC (6B), EtherType (2B), Payload (46-1500B), FCS (4B).',
          'EtherTypes: IPv4 = 0x0800, IPv6 = 0x86DD, ARP = 0x0806.',
          'Minimum frame: 64 bytes; Standard Max: 1518 bytes; MTU = 1500 bytes.',
        ],
        frequentTraps: [
          'Forgetting that the 64-byte minimum includes the 4-byte FCS but excludes the 8-byte Preamble/SFD.',
        ],
      },
      step17_practicalLabRef: {
        title: 'Guided Practice: Ethernet II Frame Dissection & EtherType Decoding',
        scenario: 'Analyze raw Ethernet frame byte offsets and decode EtherType protocol identifiers.',
        tasks: ['Identify EtherType 0x0800 (IPv4) vs 0x0806 (ARP) in frame captures.'],
        verificationMethod: 'Verify correct field boundaries and 64-byte minimum size.',
      },
      step18_masterySummary: {
        summaryPoints: [
          'Ethernet II encapsulates packets into 64 to 1518 byte frames.',
          'EtherType (0x0800 IPv4, 0x86DD IPv6, 0x0806 ARP) multiplexes Layer 3 protocols.',
          'FCS uses 32-bit CRC to detect physical transmission bit corruption.',
        ],
        nextLessonBridge:
          'With Layer 2 framing mastered in NET-201, proceed to NET-202 to master IPv4 Addressing, Subnetting, and CIDR.',
      },
    },
    questions: [
      {
        text: 'What are the official EtherType hexadecimal values for IPv4, IPv6, and Address Resolution Protocol (ARP) in an Ethernet II frame header?',
        options: [
          'IPv4 = 0x0800, IPv6 = 0x86DD, ARP = 0x0806',
          'IPv4 = 0x0001, IPv6 = 0x0002, ARP = 0x0003',
          'IPv4 = 0x8100, IPv6 = 0x8847, ARP = 0x88CC',
          'IPv4 = 0x06, IPv6 = 0x11, ARP = 0x01',
        ],
        correctOption: 0,
        explanation: 'Ethernet II standard EtherType fields: `0x0800` identifies IPv4, `0x86DD` identifies IPv6, and `0x0806` identifies ARP.',
        explanationsJson: { 1: 'Invalid values.', 2: '0x8100 is 802.1Q VLAN; 0x8847 is MPLS; 0x88CC is LLDP.', 3: '0x06 and 0x11 are IP protocol numbers for TCP and UDP.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Ethernet II EtherType Values',
      },
    ],
    lab: {
      title: 'Guided Practice: Ethernet II Frame Dissection & EtherType Decoding',
      instructions: '1. Inspect Ethernet frame.\n2. Decode EtherType field.\n3. Verify 64-byte minimum size.',
      difficulty: CourseLevel.FOUNDATIONAL,
      estimatedMinutes: 15,
      initialTopologyJson: { frameType: 'Ethernet II', etherType: '0x0800', payloadSize: 46 },
      tasks: ['Identify EtherType codes.'],
    },
  },

  // =========================================================================
  // COURSE: NET-202 (IPv4 Addressing & CIDR)
  // =========================================================================

  // -------------------------------------------------------------------------
  // 3. NET-202: IPv4 Addressing & CIDR Subnetting (Benchmark)
  // -------------------------------------------------------------------------
  {
    courseCode: 'NET-202',
    slug: 'net-202-ipv4-addressing-cidr',
    title: 'IPv4 Addressing, Subnet Masks & CIDR Subnetting',
    type: LessonType.THEORY,
    durationMinutes: 25,
    order: 1,
    visualizationType: 'SUBNET_CALCULATOR_ENGINE',
    introduction:
      'Master the fundamental structure of IPv4 addressing: 32-bit binary architecture, 4-octet dotted-decimal representation, network bits versus host bits, subnet masks, CIDR prefix notation (/N), and step-by-step subnet calculation without memorizing fragile formulas.',
    contentV2: {
      objective:
        'Understand how an IPv4 address functions as a 32-bit logical identifier, how a subnet mask divides bits into network and host portions, how CIDR prefix notation (/N) represents subnet boundaries, and how to determine the network address, broadcast address, usable host range, and host capacity for any given IPv4 prefix.',
      prerequisites: [
        'Understanding of binary bits and 8-bit octets (NET-101)',
        'Positional place values: 128, 64, 32, 16, 8, 4, 2, 1 (NET-101)',
        'Basic concept of digital communication across networks (NET-102)',
      ],
      whyItMatters:
        'Every packet sent across the global Internet or local area network relies on IPv4 addresses to deliver data from a source endpoint to a destination host. Subnetting enables network administrators to logically divide large networks into organized, secure, and broadcast-isolated subnets. Understanding CIDR allows you to allocate addresses efficiently, size subnets accurately for host requirements, and diagnose address configuration mismatches.',
      explanation:
        'An IPv4 (Internet Protocol Version 4) address is a 32-bit logical numerical label assigned to each network interface card (NIC) participating in an IP network. To make 32 binary bits human-readable, IPv4 uses dotted-decimal notation: the 32 bits are divided into four 8-bit groups called octets, separated by periods (e.g., 192.168.10.37). Each octet represents a decimal value from 0 (00000000) to 255 (11111111), providing a total theoretical address space of 2^32 (4,294,967,296 addresses).\n\nEvery IPv4 address contains two distinct logical components: a Network Portion and a Host Portion. The Network portion acts like a street name—identifying the specific network segment or broadcast domain. The Host portion acts like a house number—uniquely identifying the individual computer, server, or printer on that network segment. All devices on the same local physical or logical network must share the exact same Network portion to communicate directly.\n\nTo specify where the Network portion ends and the Host portion begins, devices use a Subnet Mask. A subnet mask is a 32-bit filter composed of contiguous binary 1s followed by contiguous binary 0s. The 1s lock the network bits, while the 0s identify the host bits. For example, the subnet mask 255.255.255.0 consists of 24 contiguous 1s followed by 8 zeros.\n\nIn modern networking, Classless Inter-Domain Routing (CIDR, RFC 1519) expresses subnet masks using prefix length notation: a forward slash followed by the count of network 1s (/N). Instead of writing "Subnet Mask: 255.255.255.0", CIDR writes "/24". When the prefix length increases (e.g., from /24 to /26), bits are borrowed from the host portion and added to the network portion. This divides the network into smaller subnets (2^borrowed_bits), with fewer host addresses per subnet (2^remaining_host_bits).\n\nWithin any standard IPv4 subnet, two addresses are reserved and cannot be assigned to individual endpoints:\n1. Network Address: Formed when all host bits are set to binary 0. This address identifies the entire subnet itself.\n2. Broadcast Address: Formed when all host bits are set to binary 1. Packets addressed to this IP are received and processed by every host on the subnet.\n\nThe assignable Usable Host Range consists of all IP addresses strictly between the Network Address and Broadcast Address. The usable host capacity is calculated as 2^H - 2 (where H is the number of host bits, 32 - prefix).\n\nSpecial prefix cases: /30 provides 2 usable host endpoints (traditionally used for router point-to-point links); /31 (RFC 3021) permits point-to-point links using both addresses without a separate broadcast; and /32 represents a single host route (such as a loopback interface) with zero host bits.',
      components: [
        {
          name: '32-Bit Binary Structure',
          detail:
            'Four 8-bit octets (4 × 8 = 32 bits) represented in dotted-decimal format (0.0.0.0 to 255.255.255.255), representing 4,294,967,296 total addresses.',
        },
        {
          name: 'Network Portion',
          detail:
            'The leading bits of the IPv4 address that identify the specific network segment or broadcast domain. Shared identically by all hosts on the same subnet.',
        },
        {
          name: 'Host Portion',
          detail:
            'The trailing bits of the IPv4 address that uniquely identify an individual endpoint interface within that specific subnet.',
        },
        {
          name: 'Subnet Mask',
          detail:
            'A 32-bit sequence of contiguous 1s followed by 0s that defines the boundary between network bits and host bits (e.g., 255.255.255.0).',
        },
        {
          name: 'CIDR Prefix (/N)',
          detail:
            'Shorthand notation indicating the exact count of contiguous network 1-bits (e.g., /24 = 255.255.255.0, /26 = 255.255.255.192).',
        },
        {
          name: 'Network Address',
          detail:
            'The first address of a subnet, formed by setting all host bits to binary 0. Identifies the subnet itself and cannot be assigned to a host.',
        },
        {
          name: 'Broadcast Address',
          detail:
            'The last address of a subnet, formed by setting all host bits to binary 1. Transmits packets to all devices on the subnet and cannot be assigned to a single host.',
        },
        {
          name: 'Usable Host Range',
          detail:
            'The sequential block of assignable addresses from Network Address + 1 up to Broadcast Address - 1 (usable capacity = 2^H - 2).',
        },
      ],
      howItWorks: [
        {
          stepNumber: 1,
          title: 'Determine Network & Host Bit Allocation',
          action:
            'Identify the prefix length (N). The number of host bits is calculated as H = 32 - N (for example, /26 yields 32 - 26 = 6 host bits).',
        },
        {
          stepNumber: 2,
          title: 'Derive the Dotted-Decimal Subnet Mask',
          action:
            'Construct 32 bits with N contiguous 1s followed by H zeros. Convert each 8-bit group into decimal (e.g., 26 ones = 255.255.255.192).',
        },
        {
          stepNumber: 3,
          title: 'Calculate Subnet Block Size (Increment)',
          action:
            'In the octet where the bit split occurs, calculate block size as 2^(host bits in that octet) or 256 - mask_value (for /26: 256 - 192 = 64). Subnets start at multiples: 0, 64, 128, 192.',
        },
        {
          stepNumber: 4,
          title: 'Locate the Network & Broadcast Boundaries',
          action:
            'Find which block multiple contains the host IP. Setting host bits to 0 yields the Network Address; setting host bits to 1 yields the Broadcast Address.',
        },
        {
          stepNumber: 5,
          title: 'Identify Usable Host Range and Capacity',
          action:
            'The first usable IP is Network Address + 1; the last usable IP is Broadcast Address - 1. Total usable hosts = 2^H - 2.',
        },
      ],
      visualizer: {
        type: 'SUBNET_CALCULATOR_ENGINE',
        title: 'Interactive IPv4 & CIDR Prefix Explorer',
        description:
          'Adjust the CIDR prefix slider to visualize the shift between network bits and host bits in real time. Observe how subnet masks, block sizes, network IDs, broadcast addresses, and usable host capacities adjust dynamically.',
      },
      workedExample: {
        title: 'Step-by-Step CIDR Subnet Analysis for 192.168.10.37/26',
        problemStatement:
          'Given the host IPv4 address 192.168.10.37/26, determine: (1) Subnet Mask in dotted decimal, (2) Network Address, (3) Broadcast Address, (4) Usable Host IP Range, and (5) Total Usable Host Capacity.',
        stepByStepSolution: [
          'Step 1 (Bit Allocation): Prefix /26 indicates 26 network bits and 32 - 26 = 6 host bits.',
          'Step 2 (Subnet Mask): 26 network bits = 11111111.11111111.11111111.11000000. The first 3 octets are 255.255.255. The 4th octet has 2 bits: 128 + 64 = 192. Subnet Mask = 255.255.255.192.',
          'Step 3 (Block Size): With 6 host bits, block size = 2^6 = 64 (or 256 - 192 = 64). Subnet boundaries in octet 4 occur at multiples of 64: .0, .64, .128, .192.',
          'Step 4 (Network Address): The 4th octet of our IP is 37, which falls between 0 and 63. The subnet begins at 0. Network Address = 192.168.10.0.',
          'Step 5 (Broadcast Address): The highest address in this block (before next subnet .64) is 0 + 64 - 1 = 63. Broadcast Address = 192.168.10.63.',
          'Step 6 (Usable Range & Capacity): First usable = 192.168.10.1; Last usable = 192.168.10.62. Usable capacity = 64 - 2 = 62 assignable hosts.',
        ],
        finalResult:
          'Network: 192.168.10.0/26 | Usable Range: 192.168.10.1 – 192.168.10.62 | Broadcast: 192.168.10.63 | Usable Hosts: 62',
      },
      practice: [
        {
          id: 1,
          prompt: 'Given the subnet mask 255.255.255.0, identify the equivalent CIDR prefix length (e.g., /24).',
          expected: '/24',
          hints: 'Count the contiguous network 1-bits: 8 + 8 + 8 + 0 = 24 bits, written as /24.',
        },
        {
          id: 2,
          prompt: 'What is the dotted-decimal subnet mask corresponding to CIDR prefix /26?',
          expected: '255.255.255.192',
          hints:
            'A /26 prefix has 24 network bits in the first 3 octets (255.255.255) plus 2 network bits in the 4th octet (128 + 64 = 192).',
        },
        {
          id: 3,
          prompt: 'For CIDR prefix /28, how many host bits remain in the 32-bit IPv4 address?',
          expected: '4',
          hints: 'Subtract the prefix length from 32 total bits: 32 - 28 = 4 host bits.',
        },
        {
          id: 4,
          prompt: 'For host IP 192.168.1.130/25 (block size 128), what is the Network Address?',
          expected: '192.168.1.128',
          hints:
            'A /25 prefix creates blocks of 128 (.0 and .128). IP .130 falls into the second block starting at 192.168.1.128.',
        },
        {
          id: 5,
          prompt: 'For the subnet 10.0.0.0/28 (block size 16), what is the Broadcast Address?',
          expected: '10.0.0.15',
          hints:
            'The block spans 10.0.0.0 through 10.0.0.15. The broadcast address has all host bits set to 1, which is the last address: 10.0.0.15.',
        },
        {
          id: 6,
          prompt:
            'How many assignable (usable) host IP addresses are available in a standard /27 subnet?',
          expected: '30',
          hints:
            'A /27 prefix leaves 32 - 27 = 5 host bits. Total addresses = 2^5 = 32. Subtract 2 for Network and Broadcast IDs = 30 usable hosts.',
        },
      ],
      commonMistakes: [
        {
          misconception: 'Assuming subnet boundaries can start on any arbitrary number.',
          correction:
            'Subnet blocks must always align to mathematical multiples of the block size (powers of 2: 0, 64, 128, 192, etc.).',
        },
        {
          misconception:
            'Assigning the Network Address or Broadcast Address to a host computer or server interface.',
          correction:
            'The Network Address (all host bits 0) and Broadcast Address (all host bits 1) are reserved by the IP architecture and cannot be assigned to any individual endpoint.',
        },
        {
          misconception: 'Believing that larger CIDR prefix numbers mean more host addresses.',
          correction:
            'The CIDR prefix counts network bits. A larger prefix number means more network bits and fewer remaining host bits (e.g., /28 has only 14 usable hosts, while /24 has 254).',
        },
      ],
      recap: [
        'An IPv4 address is a 32-bit binary number represented in dotted-decimal notation as 4 octets (0–255).',
        'A Subnet Mask divides the 32 bits into a Network portion (identifying the subnet) and a Host portion (identifying the device).',
        'CIDR prefix notation (/N) specifies the exact count of leading network 1-bits (e.g., /24 = 255.255.255.0).',
        'Total addresses per subnet equal 2^(host bits). In standard subnets (H >= 2), subtracting the Network ID and Broadcast ID leaves 2^H - 2 usable host addresses.',
        'Changing prefix length shifts the boundary: increasing prefix length creates more subnets with fewer hosts each, while decreasing prefix length creates larger broadcast domains.',
        'Special prefix cases include /30 (2 usable hosts for point-to-point links), /31 (RFC 3021 2-endpoint links), and /32 (1 single host route).',
      ],
    },
    questions: [
      {
        text: 'An IPv4 address is composed of how many total bits, and how are these bits partitioned?',
        options: [
          '32 bits, divided into a Network portion (identifying the subnet) and a Host portion (identifying the specific device)',
          '48 bits, divided into an Organizationally Unique Identifier (OUI) and a Device serial',
          '128 bits, divided into eight 16-bit hexadecimal blocks',
          '64 bits, divided into four 16-bit binary words',
        ],
        correctOption: 0,
        explanation:
          'An IPv4 address is a 32-bit binary number represented as four 8-bit octets. A subnet mask divides these 32 bits into a Network portion (identifying the subnet) and a Host portion (identifying the specific device on that subnet).',
        explanationsJson: {
          1: '48 bits describes an Ethernet MAC address.',
          2: '128 bits describes an IPv6 address.',
          3: '64 bits is not a standard IP addressing architecture.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: '32-Bit IPv4 Architecture',
      },
      {
        text: 'What is the primary architectural purpose of a subnet mask in IPv4 addressing?',
        options: [
          'To define the exact boundary between Network bits (binary 1s) and Host bits (binary 0s)',
          'To encrypt IP packets before transmission across physical network media',
          'To uniquely identify the physical MAC address of the network interface card',
          'To determine the domain name associated with a logical IP endpoint',
        ],
        correctOption: 0,
        explanation:
          'A subnet mask is a 32-bit sequence of contiguous 1s followed by contiguous 0s. The 1s indicate the network bits, and the 0s indicate the host bits. In CIDR notation, the prefix length /N represents the count of network 1s.',
        explanationsJson: {
          1: 'Subnet masks do not perform cryptographic encryption.',
          2: 'MAC addresses are physical Layer 2 identifiers, not subnet masks.',
          3: 'Domain name resolution is handled by DNS, not subnet masks.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Subnet Mask Role',
      },
      {
        text: 'In a standard `/26` subnet, what are the total number of IP addresses and the number of assignable (usable) host addresses?',
        options: [
          '64 total addresses, and 62 usable host addresses',
          '32 total addresses, and 30 usable host addresses',
          '64 total addresses, and 64 usable host addresses',
          '128 total addresses, and 126 usable host addresses',
        ],
        correctOption: 0,
        explanation:
          'A /26 prefix leaves 32 - 26 = 6 host bits. Total addresses = 2^6 = 64. In standard subnets, subtracting the Network Address (all 0s) and Broadcast Address (all 1s) leaves 64 - 2 = 62 usable host addresses.',
        explanationsJson: {
          1: '32 total / 30 usable corresponds to a /27 prefix (5 host bits).',
          2: '64 usable is incorrect because the Network and Broadcast addresses cannot be assigned to hosts.',
          3: '128 total / 126 usable corresponds to a /25 prefix (7 host bits).',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Host Capacity Formula',
      },
      {
        text: 'Given the host IP address `192.168.10.75/26`, what are the Network Address and Broadcast Address for this subnet?',
        options: [
          'Network Address: 192.168.10.64 | Broadcast Address: 192.168.10.127',
          'Network Address: 192.168.10.0 | Broadcast Address: 192.168.10.63',
          'Network Address: 192.168.10.64 | Broadcast Address: 192.168.10.255',
          'Network Address: 192.168.10.75 | Broadcast Address: 192.168.10.128',
        ],
        correctOption: 0,
        explanation:
          'A /26 prefix has a block size of 2^6 = 64 in the 4th octet (blocks start at .0, .64, .128, .192). IP 192.168.10.75 falls in the second block (.64 to .127). The Network Address is 192.168.10.64 and the Broadcast Address is 192.168.10.127.',
        explanationsJson: {
          1: '192.168.10.0/26 covers IPs .0 to .63; IP .75 is outside this range.',
          2: '.255 is the broadcast of the fourth block (192.168.10.192/26), not the second block.',
          3: '192.168.10.75 is a host IP, not a valid network boundary.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Subnet Boundary Calculation',
      },
      {
        text: 'If a network administrator changes a subnet prefix from `/24` to `/26`, what happens to the number of network bits and host capacity per subnet?',
        options: [
          'Network bits increase by 2, dividing the address space into 4 smaller subnets with 62 usable hosts each instead of 254',
          'Host bits increase by 2, doubling the available host capacity per subnet',
          'Network bits decrease by 2, merging smaller subnets into one larger broadcast domain',
          'The total number of available host addresses per subnet increases from 254 to 510',
        ],
        correctOption: 0,
        explanation:
          'Moving from /24 (24 network bits, 8 host bits, 254 hosts) to /26 (26 network bits, 6 host bits) borrows 2 bits from the host portion. This creates 2^2 = 4 subnets, with each subnet accommodating 2^6 - 2 = 62 usable hosts.',
        explanationsJson: {
          1: 'Host bits decrease from 8 to 6, reducing host capacity per subnet.',
          2: 'Network bits increased from 24 to 26; they did not decrease.',
          3: 'Host capacity decreases when prefix length increases.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Prefix Shift Dynamics',
      },
      {
        text: 'Why does a standard `/30` prefix provide exactly 2 usable host IP addresses, and how do point-to-point links treat host bit reservations?',
        options: [
          'A /30 has 2 host bits (2^2 = 4 total addresses), reserving 1 for the Network Address and 1 for the Broadcast Address, leaving 2 usable addresses',
          'A /30 has 30 host bits, providing over 1 billion usable host addresses',
          'A /30 reserves all 4 addresses for routing protocol discovery',
          'A /30 has only 1 host bit (2^1 = 2 total addresses), allowing zero usable host endpoints',
        ],
        correctOption: 0,
        explanation:
          'With a /30 prefix, there are 32 - 30 = 2 host bits (2^2 = 4 total addresses). In standard IPv4 subnetting, subtracting the Network Address (all 0s) and Broadcast Address (all 1s) leaves 4 - 2 = 2 usable host addresses, making /30 ideal for point-to-point router links (note: RFC 3021 defines /31 for point-to-point links without broadcast, utilizing both addresses).',
        explanationsJson: {
          1: 'A /30 has 30 network bits and only 2 host bits.',
          2: 'Addresses in a /30 are not reserved for routing protocols; 2 are usable for host endpoints.',
          3: 'A /30 has 2 host bits (4 total addresses), not 1 host bit.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Point-to-Point & Edge Subnetting',
      },
    ],
  },
  // -------------------------------------------------------------------------
  // 4. NET-202: Special-Use IPv4 Ranges & Enterprise Allocation
  // -------------------------------------------------------------------------
  {
    courseCode: 'NET-202',
    slug: 'level-0-ip-addresses-logical-location',
    title: 'Special-Use IPv4 Ranges & Enterprise Allocation',
    type: LessonType.THEORY,
    durationMinutes: 20,
    order: 2,
    visualizationType: 'SPECIAL_IP_INSPECTOR',
    introduction:
      'Master the dedicated, non-globally routable IPv4 address blocks: RFC 1918 Private Ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16), Loopback (127.0.0.0/8), Automatic Private IP Addressing (APIPA 169.254.0.0/16), and Carrier-Grade NAT (CGNAT 100.64.0.0/10).',
    stepMetadata: {
      step1_objective:
        'Identify all RFC-defined special-use IPv4 address blocks, understand why private addresses cannot be routed across the public Internet without NAT, and diagnose APIPA configuration failures.',
      step2_prerequisites: ['net-202-ipv4-addressing-cidr'],
      step3_whyItMatters:
        'Accidentally routing private IPs across the Internet causes packet drops at ISP edge filters, while encountering an APIPA address immediately indicates DHCP service failure.',
      step4_coreConcept:
        'The IANA and IETF reserved specific IPv4 address blocks for specialized functions: (1) RFC 1918 Private Addresses (`10.0.0.0/8`, `172.16.0.0/12` [172.16.0.0–172.31.255.255], `192.168.0.0/16`) for private enterprise LANs, dropped by public Internet routers; (2) Loopback (`127.0.0.0/8`, e.g. `127.0.0.1`) for internal host inter-process communication without generating wire traffic; (3) APIPA (`169.254.0.0/16`, RFC 3927) self-assigned by OS when DHCP fails; (4) CGNAT (`100.64.0.0/10`, RFC 6598) used by ISPs for shared WAN NAT; and (5) Multicast (`224.0.0.0/4`).',
      step5_technicalAnatomy: {
        title: 'Special-Use IPv4 Blocks & Allocation Rules',
        description: 'RFC definitions, prefix lengths, and operational scope.',
        components: [
          { name: 'RFC 1918 Class A Private Block', detail: '`10.0.0.0/8` (10.0.0.0 – 10.255.255.255, 16,777,216 addresses). Used for large enterprise LANs.' },
          { name: 'RFC 1918 Class B Private Block', detail: '`172.16.0.0/12` (172.16.0.0 – 172.31.255.255, 1,048,576 addresses spanning 16 contiguous /16 blocks).' },
          { name: 'RFC 1918 Class C Private Block', detail: '`192.168.0.0/16` (192.168.0.0 – 192.255.255.255, 65,536 addresses spanning 256 /24 blocks).' },
          { name: 'Loopback Block (RFC 1122)', detail: '`127.0.0.0/8` (127.0.0.1). Processed entirely within the local OS TCP/IP stack without hitting physical media.' },
          { name: 'APIPA Link-Local (RFC 3927)', detail: '`169.254.0.0/16` (169.254.0.1 – 169.254.255.254). Self-assigned when DHCP fails.' },
          { name: 'Carrier-Grade NAT / CGNAT (RFC 6598)', detail: '`100.64.0.0/10` (100.64.0.0 – 100.127.255.255). ISP WAN aggregation space.' },
        ],
      },
      step6_howItWorks: {
        steps: [
          { stepNumber: 1, title: 'Private vs Public Routing', action: 'Internal hosts communicate using RFC 1918 IPs; edge router performs NAT before sending onto public Internet.' },
          { stepNumber: 2, title: 'Loopback Testing', action: 'Pinging `127.0.0.1` tests internal host TCP/IP protocol stack functionality.' },
          { stepNumber: 3, title: 'APIPA Fallback Trigger', action: 'If DHCP Discover times out after 4 attempts, OS generates a pseudo-random `169.254.x.x` address.' },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'Special IPv4 Prefixes & Allocation Scopes',
        fields: [
          { fieldName: 'RFC 1918 Private', bitLength: '10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16', hexSample: 'Non-Routable on Internet', description: 'Internal LAN addressing.' },
          { fieldName: 'Loopback Address', bitLength: '127.0.0.1/8', hexSample: 'Internal Stack Only', description: 'Local inter-process communication.' },
          { fieldName: 'APIPA Address', bitLength: '169.254.0.0/16', hexSample: 'DHCP Failure Indicator', description: 'Link-local unconfigured state.' },
        ],
      },
      step8_visualExplanation: {
        type: 'SPECIAL_IP_INSPECTOR',
        title: 'Special-Use IPv4 Range Classifier & Address Inspector',
        description: 'Input any IPv4 address to determine its special RFC classification, routability status, and intended enterprise use case.',
      },
      step9_workedExample: {
        title: 'Classifying Addresses & Diagnosing an APIPA Host Failure',
        problemStatement: 'Classify: (1) `172.25.10.5`, (2) `169.254.120.45`, (3) `100.70.1.1`, (4) `127.0.0.1`.',
        stepByStepSolution: [
          '`172.25.10.5` falls within `172.16.0.0/12` (172.16 – 172.31) -> RFC 1918 Private Address.',
          '`169.254.120.45` falls within `169.254.0.0/16` -> APIPA Link-Local (indicates DHCP server failure).',
          '`100.70.1.1` falls within `100.64.0.0/10` (100.64 – 100.127) -> RFC 6598 Carrier-Grade NAT (CGNAT).',
          '`127.0.0.1` falls within `127.0.0.0/8` -> Node-Local Loopback.',
        ],
        finalResult: '1: RFC 1918 Private; 2: APIPA (DHCP failed); 3: CGNAT; 4: Loopback.',
      },
      step10_realWorldScenario: {
        topology: 'Office Helpdesk Troubleshooting APIPA Address',
        scenarioText: 'User cannot access internal servers or internet. Running `ipconfig` reveals IP `169.254.88.12`. The technician immediately recognizes APIPA, traces the patch cable to a disconnected switchport, plugs it in, and the user receives a valid `192.168.1.50` DHCP lease.',
        engineeringContext: 'An APIPA address (169.254.x.x) is the universal indicator of DHCP failure.',
      },
      step11_deviceBehavior: {
        hostBehavior: 'Assigns 169.254.x.x if DHCP fails; never sends 127.x.x.x onto physical wire.',
        nicBehavior: 'Operates in unconfigured link-local state during APIPA.',
        switchOrRouterBehavior: 'ISP border routers drop RFC 1918 and APIPA packets at edge interfaces.',
      },
      step12_cliTooling: [
        {
          command: 'ping 127.0.0.1',
          description: 'Pings the local host loopback address to verify TCP/IP protocol stack integrity.',
          expectedOutput: 'Reply from 127.0.0.1: bytes=32 time<1ms TTL=128\nPackets: Sent = 4, Received = 4, Lost = 0 (0% loss)',
          proofExplanation: 'Proves local host TCP/IP stack software is operating properly.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'Host displays "No Internet Access" and ipconfig reports 169.254.x.x.',
          possibleCauses: ['DHCP server offline, VLAN misconfiguration, or DHCP scope exhausted'],
          diagnosticSteps: ['Check physical link light and DHCP server availability.'],
          remediation: 'Restore DHCP server service or expand DHCP address pool scope.',
        },
      ],
      step14_commonMistakes: [
        { misconception: 'Thinking 172.32.0.1 is a private IP address.', correction: 'RFC 1918 Class B stops at 172.31.255.255. 172.32.0.0/16 is a public routable address.' },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'RFC 1918 IP Leaks across Internet Routers',
        mitigationStrategy: 'Apply BCP 38 ingress/egress filtering on edge firewalls to block all RFC 1918/APIPA packets.',
      },
      step16_examPrep: {
        keyExamPoints: [
          'RFC 1918 Private: 10.0.0.0/8, 172.16.0.0/12 (172.16-172.31), 192.168.0.0/16.',
          'Loopback = 127.0.0.0/8 (127.0.0.1).',
          'APIPA = 169.254.0.0/16.',
          'CGNAT = 100.64.0.0/10.',
        ],
        frequentTraps: [
          'Assuming 172.35.0.1 is private (it is public; private ends at 172.31.255.255).',
        ],
      },
      step17_practicalLabRef: {
        title: 'Guided Practice: Special IPv4 Range Classification & Loopback Verification',
        scenario: 'Verify loopback operation and identify RFC 1918 vs APIPA ranges.',
        tasks: ['Ping 127.0.0.1 and verify TCP/IP stack health.', 'Classify sample enterprise IP addresses.'],
        verificationMethod: 'Confirm successful ping reply from 127.0.0.1.',
      },
      step18_masterySummary: {
        summaryPoints: [
          'RFC 1918 defines 3 private ranges (10/8, 172.16/12, 192.168/16) for non-routable internal LANs.',
          'Loopback (127/8) tests internal OS stack; APIPA (169.254/16) indicates DHCP failure.',
        ],
        nextLessonBridge:
          'Proceed to NET-202 Lesson 3 for the History of Classful IPv4 Addressing and the Transition to CIDR.',
      },
    },
    questions: [
      {
        text: 'Which three IPv4 address blocks are officially designated as Private Non-Routable address spaces under RFC 1918?',
        options: [
          '10.0.0.0/8 (10.0.0.0 - 10.255.255.255), 172.16.0.0/12 (172.16.0.0 - 172.31.255.255), and 192.168.0.0/16 (192.168.0.0 - 192.168.255.255)',
          '127.0.0.0/8, 169.254.0.0/16, and 224.0.0.0/4',
          '1.0.0.0/8, 2.0.0.0/8, and 3.0.0.0/8',
          '192.168.0.0/24, 192.168.1.0/24, and 192.168.2.0/24 only',
        ],
        correctOption: 0,
        explanation: 'RFC 1918 specifies three private address blocks: 10.0.0.0/8 (Class A), 172.16.0.0/12 (Class B, spanning 172.16 to 172.31), and 192.168.0.0/16 (Class C, spanning 192.168.0 to 192.168.255).',
        explanationsJson: { 1: 'Those are Loopback, APIPA, and Multicast.', 2: 'Those are public routable blocks.', 3: '192.168.0.0/16 encompasses all 256 /24 subnets.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'RFC 1918 Private Address Ranges',
      },
    ],
    lab: {
      title: 'Guided Practice: Special IPv4 Range Classification & Loopback Verification',
      instructions: '1. Run ping 127.0.0.1.\n2. Classify IP ranges.',
      difficulty: CourseLevel.FOUNDATIONAL,
      estimatedMinutes: 15,
      initialTopologyJson: { loopback: '127.0.0.1', apipa: '169.254.10.20' },
      tasks: ['Run ping 127.0.0.1.'],
    },
  },

  // -------------------------------------------------------------------------
  // 5. NET-202: Classful IPv4 History & The Architectural Necessity of CIDR
  // -------------------------------------------------------------------------
  {
    courseCode: 'NET-202',
    slug: 'ip-addressing-ipv4-overview',
    title: 'Classful IPv4 History & The Architectural Necessity of CIDR',
    type: LessonType.THEORY,
    durationMinutes: 20,
    order: 3,
    visualizationType: 'CLASSFUL_CIDR_TIMELINE',
    introduction:
      'Explore the architectural evolution of the Internet: The 1981 Classful IPv4 system (Classes A, B, C, D, E), leading-bit rules, how rigid boundaries caused massive address waste (e.g. 65,534 hosts for Class B), the 1993 global routing table crisis, and the introduction of Classless Inter-Domain Routing (CIDR, RFC 1519).',
    stepMetadata: {
      step1_objective:
        'Understand historical RFC 791 Classful Addressing (Classes A, B, C, D, E), analyze why classful boundaries led to severe address exhaustion, and understand how CIDR (RFC 1519) decoupled network prefixes from fixed byte boundaries.',
      step2_prerequisites: ['net-202-ipv4-addressing-cidr', 'level-0-ip-addresses-logical-location'],
      step3_whyItMatters:
        'CIDR saved the Internet from complete address exhaustion and routing table collapse in the mid-1990s. Understanding this transition explains why prefix notation (/N) is universal today.',
      step4_coreConcept:
        'Under RFC 791 (1981), IPv4 was divided into 5 rigid classes determined by leading bits: Class A (Leading bit `0`, `1.0.0.0`–`126.255.255.255`, default `/8`, 16.7M hosts), Class B (Leading bits `10`, `128.0.0.0`–`191.255.255.255`, default `/16`, 65,534 hosts), Class C (Leading bits `110`, `192.0.0.0`–`223.255.255.255`, default `/24`, 254 hosts), Class D (Leading bits `1110`, `224.0.0.0`–`239.255.255.255`, Multicast), Class E (Leading bits `1111`, `240.0.0.0`–`255.255.255.255`, Experimental). An enterprise needing 350 IPs was forced to take a full Class B (/16 = 65,534 IPs), wasting 65,184 addresses (99.5% waste!). In 1993, IETF introduced CIDR (RFC 1519), abolishing fixed classes and allowing arbitrary prefix lengths (/N) and route aggregation (Supernetting).',
      step5_technicalAnatomy: {
        title: 'Classful Address Architecture & CIDR Decoupling',
        description: 'Leading bits, default masks, host capacities, and CIDR supernetting.',
        components: [
          { name: 'Class A (1-126, Leading bit 0)', detail: 'Default mask `255.0.0.0` (/8). 126 networks with 16,777,214 hosts each. Massive address waste.' },
          { name: 'Class B (128-191, Leading bits 10)', detail: 'Default mask `255.255.0.0` (/16). 16,384 networks with 65,534 hosts each. Exhausted rapidly in the early 1990s.' },
          { name: 'Class C (192-223, Leading bits 110)', detail: 'Default mask `255.255.255.0` (/24). 2,097,152 networks with 254 hosts each. Often too small for medium enterprises.' },
          { name: 'Class D (224-239) & Class E (240-255)', detail: 'Class D: Multicast groups (no subnet masks). Class E: Reserved experimental space.' },
          { name: 'CIDR (RFC 1519 Decoupling)', detail: 'Decoupled network size from leading bits. Enables arbitrary prefixes (/20, /23, /27) and route summarization.' },
        ],
      },
      step6_howItWorks: {
        steps: [
          { stepNumber: 1, title: 'Classful Address Assessment', action: 'In 1990, an organization with 400 computers requested IP space; IANA had to grant an entire /16 Class B (65,534 IPs).' },
          { stepNumber: 2, title: 'Address Waste Impact', action: '65,184 IPs sat completely unused and locked, accelerating global IPv4 depletion.' },
          { stepNumber: 3, title: 'CIDR Prefix Allocation', action: 'Under CIDR (1993), IANA assigns a `/23` prefix (510 usable hosts), perfectly matching the 400-host requirement with 98% efficiency.' },
          { stepNumber: 4, title: 'Route Aggregation (Supernetting)', action: 'ISPs aggregate multiple contiguous `/24` subnets into a single advertised `/20` prefix, shrinking global routing tables.' },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'Classful Boundaries vs CIDR Arbitrary Prefixes',
        fields: [
          { fieldName: 'Class B Default Mask', bitLength: '16 bits (/16)', hexSample: '255.255.0.0', description: 'Rigid byte boundary (65,534 hosts).' },
          { fieldName: 'CIDR /23 Prefix', bitLength: '23 bits (/23)', hexSample: '255.255.254.0', description: 'Tailored boundary (510 hosts, 0 waste).' },
        ],
      },
      step8_visualExplanation: {
        type: 'CLASSFUL_CIDR_TIMELINE',
        title: 'Interactive Classful IPv4 to CIDR Evolution Timeline',
        description: 'Inspect Class A, B, C leading bit allocations, observe address waste calculations, and trace how CIDR supernetting compressed the global routing table.',
      },
      step9_workedExample: {
        title: 'Calculating Address Waste: Classful Class B vs CIDR /23 for 350 Hosts',
        problemStatement: 'An enterprise needs 350 IP addresses. Calculate address waste under:\n1. 1981 Classful allocation rules.\n2. 1993 CIDR allocation rules.',
        stepByStepSolution: [
          'Step 1 (Classful Allocation): Class C (/24 = 254 hosts) is too small. The enterprise must receive a Class B (/16 = 65,534 hosts).',
          '  Classful Waste = $65,534 - 350 = 65,184 \\text{ wasted IP addresses} \\ (99.5\\% \\text{ waste})$.',
          'Step 2 (CIDR Allocation): Under CIDR, the enterprise is allocated a `/23` ($2^9 - 2 = 510$ usable hosts).',
          '  CIDR Waste = $510 - 350 = 160 \\text{ unused addresses for future growth} \\ (68.6\\% \\text{ utilization})$.',
        ],
        finalResult: 'Classful rules waste 65,184 addresses; CIDR reduces excess allocation to 160 addresses.',
      },
      step10_realWorldScenario: {
        topology: 'Global ISP Route Summarization via CIDR',
        scenarioText: 'A regional ISP owns 16 contiguous /24 networks (198.51.100.0/24 through 198.51.115.0/24). Instead of advertising 16 separate routing table entries to the global Internet, the ISP advertises a single aggregated `/20` prefix (198.51.96.0/20), conserving global router memory.',
        engineeringContext: 'CIDR supernetting prevents global BGP routing table explosion.',
      },
      step11_deviceBehavior: {
        hostBehavior: 'Modern operating systems are 100% classless; they require an explicit subnet mask for every IP configuration.',
        nicBehavior: 'Operates transparently at Layer 2.',
        switchOrRouterBehavior: 'Core BGP routers execute Longest Prefix Match (LPM) on classless prefixes.',
      },
      step12_cliTooling: [
        {
          command: 'powershell -Command "Get-NetIPAddress -AddressFamily IPv4 | Select-Object IPAddress, PrefixLength"',
          description: 'Displays active IPv4 addresses and their CIDR prefix lengths (/N) on Windows.',
          expectedOutput: 'IPAddress     PrefixLength\n---------     ------------\n192.168.1.50            24',
          proofExplanation: 'Demonstrates modern classless CIDR prefix length representation.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'Legacy routing protocol (RIPv1) summarizes subnets incorrectly at class boundaries.',
          possibleCauses: ['Classful routing protocol in use that does not carry subnet masks in route updates'],
          diagnosticSteps: ['Check routing protocol configuration.'],
          remediation: 'Upgrade to classless routing protocols (OSPF, EIGRP, BGP) that support variable-length subnet masks.',
        },
      ],
      step14_commonMistakes: [
        { misconception: 'Assuming 192.168.1.0 must always have a /24 subnet mask because it is "Class C".', correction: 'Under CIDR, any IP address can use any prefix length (e.g. 192.168.1.0/28 or 10.0.0.0/24). Fixed classes are obsolete.' },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'BGP Route Hijacking via More-Specific CIDR Prefixes',
        mitigationStrategy: 'Deploy RPKI (Resource Public Key Infrastructure) Route Origin Authorization (ROA) to validate advertised CIDR prefixes.',
      },
      step16_examPrep: {
        keyExamPoints: [
          'Class ranges: A (1-126, /8), B (128-191, /16), C (192-223, /24), D (224-239 Multicast), E (240-255 Experimental).',
          'CIDR (RFC 1519, 1993) introduced arbitrary /N prefixes and route aggregation (Supernetting).',
        ],
        frequentTraps: [
          'Calling 127.0.0.0 Class A (127 is reserved for loopback).',
        ],
      },
      step17_practicalLabRef: {
        title: 'Guided Practice: Classful Address Waste Analysis & CIDR Supernetting',
        scenario: 'Analyze address waste under classful rules vs CIDR prefix allocation.',
        tasks: ['Calculate address waste for 350 hosts under Class B vs /23.'],
        verificationMethod: 'Verify mathematical difference of 65,024 reclaimed addresses.',
      },
      step18_masterySummary: {
        summaryPoints: [
          'Classful addressing used rigid byte boundaries (/8, /16, /24) leading to 99% address waste.',
          'CIDR (RFC 1519) decoupled masks from address values, enabling custom /N sizing and supernetting.',
        ],
        nextLessonBridge:
          'Proceed to NET-202 Lesson 4 to master Variable Length Subnet Masking (VLSM) Enterprise Design.',
      },
    },
    questions: [
      {
        text: 'Why was Classless Inter-Domain Routing (CIDR, RFC 1519) introduced in 1993 to replace the original 1981 Classful IPv4 architecture?',
        options: [
          'To decouple subnet masks from rigid class boundaries (allowing arbitrary /N prefix lengths) and enable route aggregation (supernetting), preventing IPv4 address exhaustion and routing table collapse',
          'To increase IPv4 address length from 32 bits to 128 bits',
          'To eliminate the need for routers on the Internet',
          'To enforce mandatory encryption on all web packets',
        ],
        correctOption: 0,
        explanation: 'Classful addressing caused massive address waste (e.g. an enterprise needing 300 hosts had to take a full Class B with 65,534 addresses). CIDR enabled tailored prefix sizes (like /23 for 510 hosts) and route summarization.',
        explanationsJson: { 1: '128-bit addresses were introduced by IPv6, not CIDR.', 2: 'Routers remain essential for forwarding CIDR prefixes.', 3: 'Encryption is handled by TLS/IPsec.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'CIDR Architectural Purpose',
      },
    ],
    lab: {
      title: 'Guided Practice: Classful Address Waste Analysis & CIDR Supernetting',
      instructions: '1. Calculate Class B vs /23 address waste.\n2. Inspect CIDR prefixes with Get-NetIPAddress.',
      difficulty: CourseLevel.FOUNDATIONAL,
      estimatedMinutes: 15,
      initialTopologyJson: { classfulWaste: 65184, cidrCapacity: 510 },
      tasks: ['Analyze address waste difference.'],
    },
  },

  // -------------------------------------------------------------------------
  // 6. NET-202: VLSM Design & Multi-Department Address Allocation
  // -------------------------------------------------------------------------
  {
    courseCode: 'NET-202',
    slug: 'subnetting-cidr-overview',
    title: 'VLSM Design & Multi-Department Address Allocation',
    type: LessonType.THEORY,
    durationMinutes: 30,
    order: 4,
    visualizationType: 'VLSM_DESIGNER_ENGINE',
    introduction:
      'Master enterprise-grade Variable Length Subnet Masking (VLSM): Designing multi-department address allocation schemes, enforcing the "Largest to Smallest" allocation rule, partitioning a single base network across varied department sizes, and guaranteeing zero address overlap.',
    stepMetadata: {
      step1_objective:
        'Master Variable Length Subnet Masking (VLSM) design principles, apply the Golden Rule of VLSM (Largest to Smallest allocation order), partition a base IPv4 block across multiple department requirements, and verify zero-overlap integrity.',
      step2_prerequisites: ['net-202-ipv4-addressing-cidr', 'ip-addressing-ipv4-overview'],
      step3_whyItMatters:
        'In real-world enterprise networks, departments have vastly different host requirements (e.g. 60 hosts vs 10 hosts vs 2-host WAN links). Traditional Fixed-Length Subnet Masking (FLSM) wastes hundreds of addresses, whereas VLSM optimizes address efficiency to near 100%.',
      step4_coreConcept:
        'Variable Length Subnet Masking (VLSM) allows an engineer to divide a single IP network into subnets of different sizes with different CIDR prefix masks. The Golden Rule of VLSM is: Always allocate subnets starting with the largest host requirement and proceed in descending order down to the smallest (WAN links last). Failing to allocate from largest to smallest causes address overlap conflicts or fragments address blocks, making larger subnets impossible to fit.',
      step5_technicalAnatomy: {
        title: 'VLSM Hierarchy & Descending Allocation Mechanics',
        description: 'Prefix sizing table, allocation sequence, and boundary alignment rules.',
        components: [
          { name: 'Descending Allocation Rule (Largest to Smallest)', detail: 'Sort all requirements in descending order before assigning any addresses: e.g. 60 hosts (/26) -> 25 hosts (/27) -> 10 hosts (/28) -> WAN links (/30).' },
          { name: 'Subnet Boundary Alignment', detail: 'Every subnet Network ID must be an exact mathematical multiple of its block size ($2^H$). E.g. a /26 (block size 64) can only begin at .0, .64, .128, or .192.' },
          { name: 'Point-to-Point WAN Subnets (/30)', detail: 'Requires exactly 2 usable hosts ($2^2 - 2 = 2$). Uses mask `255.255.255.252` with block size 4, allocated at the end of the address block.' },
          { name: 'Zero-Overlap Verification', detail: 'Each subnet range (from Network ID to Broadcast ID) must be strictly non-overlapping with all other allocated subnets.' },
        ],
      },
      step6_howItWorks: {
        steps: [
          { stepNumber: 1, title: 'Requirement Sizing & Sorting', action: 'Determine host requirements for all departments and sort in descending order: Engineering (60), Sales (25), Admin (10), WAN-1 (2), WAN-2 (2).' },
          { stepNumber: 2, title: 'Prefix Mask Selection', action: 'Map each host requirement to the smallest sufficient $2^H - 2$ capacity: 60 -> /26 (62 hosts), 25 -> /27 (30 hosts), 10 -> /28 (14 hosts), 2 -> /30 (2 hosts).' },
          { stepNumber: 3, title: 'Sequential Allocation from Base Block', action: 'Allocate from base `192.168.1.0/24`: Subnet 1 takes `192.168.1.0/26` (.0 to .63); Subnet 2 takes `192.168.1.64/27` (.64 to .95); Subnet 3 takes `192.168.1.96/28` (.96 to .111); WAN-1 takes `192.168.1.112/30` (.112 to .115); WAN-2 takes `192.168.1.116/30` (.116 to .119).' },
          { stepNumber: 4, title: 'Remaining Capacity Reservation', action: 'Addresses `192.168.1.120` through `.255` remain pristine and unfragmented for future enterprise expansion.' },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'VLSM Hierarchical Address Plan',
        fields: [
          { fieldName: 'Subnet 1 (Engineering 60)', bitLength: '/26 (62 Hosts)', hexSample: '192.168.1.0 - .63', description: 'Mask: 255.255.255.192.' },
          { fieldName: 'Subnet 2 (Sales 25)', bitLength: '/27 (30 Hosts)', hexSample: '192.168.1.64 - .95', description: 'Mask: 255.255.255.224.' },
          { fieldName: 'Subnet 3 (Admin 10)', bitLength: '/28 (14 Hosts)', hexSample: '192.168.1.96 - .111', description: 'Mask: 255.255.255.240.' },
          { fieldName: 'WAN Links (2 each)', bitLength: '/30 (2 Hosts)', hexSample: '192.168.1.112 & .116', description: 'Mask: 255.255.255.252.' },
        ],
        headerDiagramAscii: `
+-------------------------------------------------------------------------------+
|                    VLSM ENTERPRISE ADDRESS ALLOCATION MAP                     |
+-------------------------------------------------------------------------------+
| Base Network: 192.168.1.0/24 (Total: 256 Addresses)                          |
+-----------------------------------+-------------------------------------------+
| [0 . . . . . . . . . . . . . 63]  | Engineering Dept: 192.168.1.0/26 (60 Hosts)|
+-----------------+-----------------+-------------------------------------------+
| [64 . . . . 95] | Sales Dept: 192.168.1.64/27 (25 Hosts)                      |
+--------+--------+-------------------------------------------------------------+
| [96.111] Admin Dept: 192.168.1.96/28 (10 Hosts)                               |
+----+---+----------------------------------------------------------------------+
|WAN1|WAN2| WAN-1: .112/30 (2 Hosts) | WAN-2: .116/30 (2 Hosts)                 |
+----+---+----------------------------------------------------------------------+
| [120 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 255] |
| UNALLOCATED RESERVE SPACE (136 Addresses Available for Future Growth)         |
+-------------------------------------------------------------------------------+
`,
      },
      step8_visualExplanation: {
        type: 'VLSM_DESIGNER_ENGINE',
        title: 'Interactive VLSM Multi-Department Address Planner',
        description: 'Input custom department host counts to automatically calculate descending VLSM allocations, visual block partitioning, and zero-overlap validation.',
      },
      step9_workedExample: {
        title: 'Designing VLSM Allocation for Enterprise Branch from 192.168.1.0/24',
        problemStatement: 'Design a VLSM address plan from `192.168.1.0/24` for: Engineering (60 hosts), Sales (25 hosts), Admin (10 hosts), and 2 WAN links (2 hosts each).',
        stepByStepSolution: [
          'Step 1 (Order Descending): 60 hosts -> 25 hosts -> 10 hosts -> 2 hosts -> 2 hosts.',
          'Step 2 (Determine Masks):',
          '  60 hosts -> Need $2^6 - 2 = 62$ hosts -> `/26` (Block size 64).',
          '  25 hosts -> Need $2^5 - 2 = 30$ hosts -> `/27` (Block size 32).',
          '  10 hosts -> Need $2^4 - 2 = 14$ hosts -> `/28` (Block size 16).',
          '  WAN 1 & 2 -> Need $2^2 - 2 = 2$ hosts -> `/30` (Block size 4).',
          'Step 3 (Sequential Allocation):',
          '  Engineering: `192.168.1.0/26` (Network: .0, Usable: .1–.62, Broadcast: .63).',
          '  Sales: `192.168.1.64/27` (Network: .64, Usable: .65–.94, Broadcast: .95).',
          '  Admin: `192.168.1.96/28` (Network: .96, Usable: .97–.110, Broadcast: .111).',
          '  WAN-1: `192.168.1.112/30` (Network: .112, Usable: .113–.114, Broadcast: .115).',
          '  WAN-2: `192.168.1.116/30` (Network: .116, Usable: .117–.118, Broadcast: .119).',
        ],
        finalResult: 'All 5 subnets allocated with zero overlap; .120–.255 remains available for expansion.',
      },
      step10_realWorldScenario: {
        topology: 'Enterprise Network Migration from FLSM to VLSM',
        scenarioText: 'An enterprise runs out of IP space under a rigid FLSM `/26` scheme that gave every department 64 IPs regardless of size. The network engineer implements VLSM, resizing small branch offices to `/28` and WAN links to `/30`, recovering over 120 IP addresses and avoiding purchasing expensive public IPv4 blocks.',
        engineeringContext: 'VLSM enables maximum utilization of private and public IP allocations.',
      },
      step11_deviceBehavior: {
        hostBehavior: 'Endpoints configure their specific department subnet mask without awareness of other department mask sizes.',
        nicBehavior: 'Operates transparently at Layer 2.',
        switchOrRouterBehavior: 'Enterprise routers maintain variable-length prefix entries in the routing table (e.g. /26, /27, /28, /30) and route between VLANs.',
      },
      step12_cliTooling: [
        {
          command: 'show ip route',
          description: 'Displays the active routing table showing variable-length subnet prefixes (VLSM) and next hops.',
          expectedOutput:
            'Gateway of last resort is not set\n     192.168.1.0/24 is variably subnetted, 5 subnets, 4 masks\nC       192.168.1.0/26 is directly connected, GigabitEthernet0/0.10\nC       192.168.1.64/27 is directly connected, GigabitEthernet0/0.20\nC       192.168.1.96/28 is directly connected, GigabitEthernet0/0.30\nC       192.168.1.112/30 is directly connected, Serial0/0/0\nC       192.168.1.116/30 is directly connected, Serial0/0/1',
          proofExplanation:
            'Shows 5 subnets using 4 different CIDR masks (/26, /27, /28, /30) on a single router.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'Hosts in Sales cannot communicate with Engineering; router reports overlapping subnet error when configuring interface.',
          possibleCauses: ['Subnet allocated out of order causing address range overlap'],
          diagnosticSteps: ['List Network ID and Broadcast ID for all configured subnets in a chart.'],
          remediation: 'Reallocate subnets in strict descending order (largest to smallest) starting from base .0.',
        },
      ],
      step14_commonMistakes: [
        { misconception: 'Allocating small subnets or WAN links first before allocating large subnets.', correction: 'Always allocate from Largest to Smallest. Starting with small subnets fragments the address space and makes large boundary blocks impossible to align.' },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'Cross-VLAN Host Lateral Movement',
        mitigationStrategy: 'Isolate each VLSM subnet onto its own dedicated VLAN and apply Inter-VLAN Access Control Lists (ACLs) on the router/firewall.',
      },
      step16_examPrep: {
        keyExamPoints: [
          'Golden Rule: Always allocate from LARGEST host requirement to SMALLEST.',
          '/30 provides exactly 2 usable hosts ($2^2 - 2 = 2$) for point-to-point links.',
          'Subnet boundaries must always align with multiples of their block size.',
        ],
        frequentTraps: [
          'Allocating a /26 starting at .32 (a /26 has block size 64 and can only start at .0, .64, .128, .192).',
        ],
      },
      step17_practicalLabRef: {
        title: 'Guided Practice: Enterprise Multi-Department VLSM Address Design',
        scenario: 'Design a complete VLSM address allocation plan from 192.168.1.0/24 and verify zero overlap.',
        tasks: ['Sort departments: 60, 25, 10, 2, 2.', 'Assign contiguous non-overlapping subnet blocks.'],
        verificationMethod: 'Verify show ip route displays 5 variably subnetted networks.',
      },
      step18_masterySummary: {
        summaryPoints: [
          'VLSM allows different subnet mask lengths within the same major network.',
          'Always allocate in descending order (largest to smallest) to prevent fragmentation and overlaps.',
          '/30 is standard for 2-host point-to-point links.',
        ],
        nextLessonBridge:
          'With IPv4 Addressing, Subnetting, and VLSM mastered in NET-202, proceed to NET-203 to master Core IP Services (ARP, DHCP, DNS, and IPv6).',
      },
    },
    questions: [
      {
        text: 'When designing a Variable Length Subnet Masking (VLSM) address plan for multiple departments of different sizes, what is the fundamental "Golden Rule" of allocation order?',
        options: [
          'Always sort requirements and allocate subnets starting with the LARGEST host requirement first, proceeding in descending order down to the smallest',
          'Always allocate the smallest /30 WAN links first to lock in the beginning of the address space',
          'Always assign odd-numbered subnets to sales and even-numbered subnets to engineering',
          'Always use the exact same /24 subnet mask for all departments regardless of host count',
        ],
        correctOption: 0,
        explanation: 'The fundamental rule of VLSM is to allocate from Largest to Smallest. Subnets can only start on boundaries that are multiples of their block size. Allocating small subnets first fragments the address space and makes it impossible to align larger blocks.',
        explanationsJson: { 1: 'Allocating small subnets first causes address fragmentation and overlap errors.', 2: 'Department function does not dictate mathematical parity.', 3: 'Using the same mask for all departments is FLSM, not VLSM.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'VLSM Largest-to-Smallest Allocation Rule',
      },
    ],
    lab: {
      title: 'Guided Practice: Enterprise Multi-Department VLSM Address Design',
      instructions: '1. Sort departments descending.\n2. Allocate subnets from 192.168.1.0/24.\n3. Verify with show ip route.',
      difficulty: CourseLevel.FOUNDATIONAL,
      estimatedMinutes: 20,
      initialTopologyJson: { baseNetwork: '192.168.1.0/24', departments: [{ name: 'Eng', hosts: 60 }, { name: 'Sales', hosts: 25 }] },
      tasks: ['Design zero-overlap VLSM plan.'],
    },
  },
];

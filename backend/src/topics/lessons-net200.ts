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
    contentV2: {
      objective:
        'Understand 48-bit MAC address architecture, differentiate between the 24-bit OUI manufacturer prefix and 24-bit NIC extension identifier, analyze the I/G and U/L control bits in the first octet, and classify Unicast, Multicast, and Broadcast MAC destination types.',
      prerequisites: [
        'NET-101: Bits, Bytes, Binary & Hexadecimal Foundations',
        'NET-103: The 7-Layer OSI Reference Model & Data Encapsulation',
      ],
      whyItMatters:
        'Every Network Interface Card (NIC) manufactured on Earth has a globally unique burned-in MAC address. Ethernet switches make 100% of their local frame forwarding decisions by mapping destination MAC addresses to switchports in their Content-Addressable Memory (CAM) tables.',
      explanation:
        'A Media Access Control (MAC) address is a 48-bit (6-byte / 12-hexadecimal-digit) physical hardware identifier permanently burned into a Network Interface Card (NIC) by its manufacturer (also referred to as the Burned-In Address or BIA).\n\n### 1. 48-Bit Architecture & Partitioning\nA standard IEEE 802 MAC address is divided into two 24-bit (3-byte) halves:\n* **OUI (Organizationally Unique Identifier)**: The first 24 bits (3 bytes / 6 hex digits). Assigned by the IEEE Registration Authority to hardware vendors (e.g. `00:1A:2B` for Cisco, `00:50:56` for VMware, `3C:D9:2B` for Hewlett Packard).\n* **NIC Specific Identifier**: The last 24 bits (3 bytes / 6 hex digits). Assigned uniquely by the manufacturer to each individual physical interface, ensuring global uniqueness.\n\n### 2. First Octet Control Bits: I/G and U/L\nThe very first byte of a MAC address contains two critical standard framing bits:\n* **Bit 0 (Least Significant Bit): Individual / Group (I/G) Bit**:\n  - `0 = Unicast`: Frame is destined for a single, unique physical host NIC.\n  - `1 = Multicast`: Frame is destined for a group of subscribed endpoints (e.g. IPv4 Multicast prefix `01:00:5E:...`, IPv6 Multicast prefix `33:33:...`).\n* **Bit 1: Universal / Local (U/L) Bit**:\n  - `0 = Universally Administered`: Globally unique manufacturer address verified by the IEEE OUI registry.\n  - `1 = Locally Administered`: Overridden or assigned by local network software, virtualization hypervisors, or network administrators.\n\n### 3. Layer 2 Broadcast MAC\nThe broadcast destination MAC address is `FF:FF:FF:FF:FF:FF` (all 48 bits set to 1). When a switch receives a frame destined for `FF:FF:FF:FF:FF:FF`, it floods the frame out all active switchports belonging to the same VLAN except the ingress port.',
      components: [
        {
          name: '48-Bit (6-Byte) Address Length',
          detail: 'Composed of 12 hexadecimal characters formatted as XX:XX:XX:XX:XX:XX or XXXX.XXXX.XXXX (Cisco style).',
        },
        {
          name: 'OUI (Organizationally Unique Identifier)',
          detail: 'First 24 bits (3 bytes) assigned by the IEEE to identify the network hardware manufacturer.',
        },
        {
          name: 'NIC Extension Identifier',
          detail: 'Last 24 bits (3 bytes) assigned by the vendor as a serial number for the physical interface.',
        },
        {
          name: 'Individual / Group (I/G) Bit',
          detail: 'Bit 0 of octet 1: 0 = Unicast (single device), 1 = Multicast (group subscription).',
        },
        {
          name: 'Universal / Local (U/L) Bit',
          detail: 'Bit 1 of octet 1: 0 = Universally administered IEEE OUI, 1 = Locally administered/virtualized.',
        },
        {
          name: 'Broadcast MAC (FF:FF:FF:FF:FF:FF)',
          detail: 'All 48 bits set to binary 1; delivered to all endpoints within the local Layer 2 broadcast domain.',
        },
      ],
      howItWorks: [
        {
          stepNumber: 1,
          title: 'Burned-In ROM Initialization',
          action: 'On host boot, the NIC loads its 48-bit MAC address from onboard EEPROM/ROM into hardware registers.',
        },
        {
          stepNumber: 2,
          title: 'Encapsulation & Source Stamping',
          action: 'When transmitting a packet, the host NIC stamps its own physical MAC into the Source MAC field of the Ethernet II header.',
        },
        {
          stepNumber: 3,
          title: 'Switch CAM Table Ingress Learning',
          action: 'The local switch reads the Source MAC and records a mapping of `[Source MAC -> Ingress Switchport -> VLAN]` in its CAM table.',
        },
        {
          stepNumber: 4,
          title: 'Destination NIC Filtering',
          action: 'Receiving NICs inspect the Destination MAC: if it matches their burned-in MAC, multicast group, or broadcast (FF:FF:FF:FF:FF:FF), the NIC processes the frame; otherwise it discards it in hardware.',
        },
      ],
      visualizer: {
        type: 'MAC_BIT_PARSER',
        title: 'Interactive 48-Bit MAC Address & OUI Bit Parser',
        description: 'Input any MAC address to parse OUI manufacturer vendor, toggle I/G and U/L bits, and observe Unicast/Multicast/Broadcast classification.',
      },
      workedExample: {
        title: 'Analyzing MAC Address 01:00:5E:00:00:01 for Multicast Classification',
        problemStatement:
          'Analyze the physical address `01:00:5E:00:00:01`:\n1. What is the Organizationally Unique Identifier (OUI)?\n2. Is this MAC Unicast, Multicast, or Broadcast?\n3. Is this MAC Universally or Locally administered?',
        stepByStepSolution: [
          'Step 1 (OUI Extraction): The first 3 bytes (6 hex characters) are `01:00:5E`. This OUI is officially registered to IANA for IPv4 Multicast mapping.',
          'Step 2 (I/G Bit Analysis): Convert first octet `0x01` to 8-bit binary: `00000001`. The Least Significant Bit (Bit 0) is `1`. Therefore, I/G = 1, which classifies this as a MULTICAST address.',
          'Step 3 (U/L Bit Analysis): Inspect Bit 1 in `00000001`: Bit 1 is `0`. Therefore, U/L = 0, which classifies this as UNIVERSALLY ADMINISTERED by IEEE/IANA.',
        ],
        finalResult:
          'OUI: 01:00:5E (IANA). Classification: Multicast (I/G=1) and Universally Administered (U/L=0).',
      },
      practice: [
        {
          id: 1,
          prompt: 'What is the total bit length and byte count of a standard IEEE 802 MAC address?',
          expected: '48 bits (6 bytes / 12 hexadecimal digits).',
          hints: 'Each byte is 8 bits; 6 bytes * 8 = 48 bits.',
        },
        {
          id: 2,
          prompt: 'How is a 48-bit MAC address split between vendor prefix and interface serial?',
          expected: 'First 24 bits (3 bytes) = OUI (manufacturer prefix); Last 24 bits (3 bytes) = NIC extension identifier (serial).',
          hints: 'The IEEE assigns the first 24 bits; the hardware vendor assigns the last 24 bits.',
        },
        {
          id: 3,
          prompt: 'What does an Individual/Group (I/G) bit value of 0 vs 1 indicate in the first octet of a MAC address?',
          expected: '0 = Unicast (individual NIC destination); 1 = Multicast (group destination).',
          hints: 'Bit 0 (Least Significant Bit of first byte) controls Unicast vs Multicast.',
        },
        {
          id: 4,
          prompt: 'What is the universal Layer 2 broadcast MAC address in hexadecimal notation?',
          expected: 'FF:FF:FF:FF:FF:FF (all 48 bits set to 1).',
          hints: 'Every hex character is F.',
        },
        {
          id: 5,
          prompt: 'Why do switches record the Source MAC address of incoming frames in their CAM table?',
          expected: 'To learn which physical switchport connects to that device so future frames destined to that MAC can be forwarded directly without flooding.',
          hints: 'Switches learn dynamically from Source MACs and forward based on Destination MACs.',
        },
        {
          id: 6,
          prompt: 'If a virtual machine hypervisor generates a custom virtual MAC starting with 02:..., why is the second bit (U/L bit) set to 1?',
          expected: 'Because the U/L bit set to 1 designates the MAC as Locally Administered rather than an IEEE-assigned global OUI.',
          hints: '0x02 in binary is 00000010, setting bit 1 (U/L) to 1.',
        },
      ],
      recap: [
        'A MAC address is a 48-bit (6-byte) Layer 2 hardware address permanent to a physical NIC.',
        'First 24 bits are the IEEE-assigned OUI; last 24 bits are the vendor NIC serial identifier.',
        'First octet bit 0 is the I/G bit (0=Unicast, 1=Multicast); bit 1 is the U/L bit (0=Universal, 1=Local).',
        'Broadcast MAC is FF:FF:FF:FF:FF:FF, which is flooded to all ports in the local broadcast domain.',
        'Switches build CAM tables dynamically by inspecting Source MAC addresses on ingress.',
      ],
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
        explanation:
          'A standard IEEE 802 MAC address is 48 bits (6 octets / 12 hex digits). The first 24 bits are the Organizationally Unique Identifier (OUI); the last 24 bits are the NIC identifier.',
        explanationsJson: {
          1: '32 bits is an IPv4 address.',
          2: '128 bits is an IPv6 address.',
          3: '64 bits is EUI-64.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'MAC Address Bit Length & Architecture',
      },
      {
        text: 'Which organization is responsible for assigning the first 24 bits (Organizationally Unique Identifier / OUI) of a MAC address to hardware manufacturers?',
        options: [
          'IEEE (Institute of Electrical and Electronics Engineers)',
          'IETF (Internet Engineering Task Force)',
          'W3C (World Wide Web Consortium)',
          'ISO (International Organization for Standardization)',
        ],
        correctOption: 0,
        explanation:
          'The IEEE Registration Authority assigns 24-bit OUI prefixes to hardware manufacturers (such as Cisco, Intel, Apple) to guarantee global MAC uniqueness.',
        explanationsJson: {
          1: 'IETF publishes RFC protocols (e.g. TCP/IP), not hardware OUI assignments.',
          2: 'W3C defines HTML and CSS web standards.',
          3: 'ISO developed the OSI reference model.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'IEEE OUI Registration Authority',
      },
      {
        text: 'In the first octet of a MAC address, what do the Individual/Group (I/G) bit and Universal/Local (U/L) bit signify when evaluated?',
        options: [
          'I/G bit (Bit 0): 0 = Unicast, 1 = Multicast | U/L bit (Bit 1): 0 = Universally Administered, 1 = Locally Administered',
          'I/G bit: 0 = IPv4, 1 = IPv6 | U/L bit: 0 = Encrypted, 1 = Plaintext',
          'I/G bit: 0 = 100 Mbps, 1 = 1 Gbps | U/L bit: 0 = Copper, 1 = Fiber',
          'I/G bit: 0 = Private, 1 = Public | U/L bit: 0 = Dynamic, 1 = Static',
        ],
        correctOption: 0,
        explanation:
          'Bit 0 of octet 1 (Least Significant Bit) is the I/G bit: 0 indicates Unicast, 1 indicates Multicast. Bit 1 of octet 1 is the U/L bit: 0 indicates IEEE universally assigned, 1 indicates locally administered override.',
        explanationsJson: {
          1: 'IP versions and encryption are handled at Layers 3 and 6, not MAC control bits.',
          2: 'Link speed and physical media are Physical Layer 1 attributes.',
          3: 'Private/public addressing is an IP layer concept.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'I/G and U/L Control Bit Logic',
      },
      {
        text: 'What is the standard Layer 2 destination MAC address used when a host must broadcast a frame to all devices on its local subnet?',
        options: [
          'FF:FF:FF:FF:FF:FF (all 48 bits set to 1)',
          '00:00:00:00:00:00',
          '01:00:5E:00:00:01',
          '255.255.255.255',
        ],
        correctOption: 0,
        explanation:
          'The Layer 2 broadcast MAC address is `FF:FF:FF:FF:FF:FF`. When a switch receives this destination, it floods the frame out all ports on that VLAN except the ingress port.',
        explanationsJson: {
          1: '00:00:00:00:00:00 is an invalid destination MAC.',
          2: '01:00:5E:00:00:01 is an IPv4 all-hosts multicast MAC, not a universal broadcast.',
          3: '255.255.255.255 is an IPv3 Layer 3 broadcast address, not a Layer 2 MAC.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Layer 2 Broadcast MAC Destination',
      },
      {
        text: 'A network engineer inspects a frame with destination MAC `01:00:5E:14:02:03`. How does a standard Layer 2 switch handle this frame?',
        options: [
          'It identifies the frame as Multicast (I/G bit = 1) and forwards it to all multicast group member ports (or floods if IGMP snooping is off)',
          'It drops the frame immediately as corrupted',
          'It routes the frame to the default gateway router over WAN',
          'It changes the destination MAC to FF:FF:FF:FF:FF:FF',
        ],
        correctOption: 0,
        explanation:
          'MAC addresses starting with `01:00:5E` have the I/G bit set to 1 (`0x01` = `00000001`), identifying them as IPv4 Multicast. The switch delivers the frame to ports participating in the multicast group via IGMP snooping.',
        explanationsJson: {
          1: 'Valid multicast frames are forwarded, not dropped.',
          2: 'Layer 2 switches do not route packets across WAN boundaries.',
          3: 'Switches do not alter destination MAC addresses in transit.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Multicast MAC Forwarding Behavior',
      },
      {
        text: 'A network engineer notices that two cloned virtual machines were deployed with the exact same MAC address `00:50:56:11:22:33` on the same VLAN. What symptom will occur on the network switch?',
        options: [
          'CAM table flapping (MAC address flapping) between the two switchports, causing intermittent packet loss and connection drops for both VMs',
          'The entire switch will permanently lock up and overheat',
          'The switch will automatically merge both VMs into a single server',
          'Both VMs will receive double network bandwidth',
        ],
        correctOption: 0,
        explanation:
          'When two devices share a MAC address on the same broadcast domain, incoming frames from both hosts cause the switch CAM table to continuously overwrite the port association for that MAC, resulting in CAM flapping and packet loss.',
        explanationsJson: {
          1: 'CAM flapping causes packet drops, not physical hardware overheating.',
          2: 'Switches cannot merge operating systems.',
          3: 'Duplicate MACs cause packet collisions and drops, never increased bandwidth.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
        questionType: QuestionType.TROUBLESHOOTING,
        concept: 'Duplicate MAC Address & CAM Flapping Troubleshooting',
      },
    ],
    lab: {
      title: 'Guided Practice: MAC Address Inspection & CAM Table Port Mapping',
      instructions:
        '1. Inspect physical NIC burned-in MAC address (BIA) on Host-A (00:1A:2B:11:22:33).\n2. Transmit an initial Unicast frame destined for default gateway MAC (00:1A:2B:GW:01:01).\n3. Observe switch CAM table learning on Ingress port FastEthernet0/1.\n4. Trigger an ARP broadcast to FF:FF:FF:FF:FF:FF and verify all-port flooding.\n5. Verify that unicast reply results in a static entry and eliminates switch flooding.',
      difficulty: CourseLevel.BEGINNER,
      estimatedMinutes: 15,
      initialTopologyJson: {
        hostMac: '00:1A:2B:11:22:33',
        gatewayMac: '00:1A:2B:GW:01:01',
        broadcastMac: 'FF:FF:FF:FF:FF:FF',
        switchPorts: ['Fa0/1', 'Fa0/2', 'Fa0/3', 'Gi0/1'],
        vlan: 1,
      },
      tasks: [
        'Inspect Host-A Layer 2 MAC address and Organizationally Unique Identifier (OUI).',
        'Send Unicast frame and record MAC learning in switch CAM table on Fa0/1.',
        'Send Broadcast frame to FF:FF:FF:FF:FF:FF and observe frame flooding across Fa0/2 and Fa0/3.',
        'Confirm bidirectional CAM table convergence with zero unknown unicast flooding.',
      ],
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
    contentV2: {
      objective:
        'Master Ethernet II frame anatomy, analyze EtherType multiplexing for upper layer protocols (IPv4 0x0800, IPv6 0x86DD, ARP 0x0806), calculate minimum frame padding requirements and maximum frame sizes (64 to 1518 bytes), understand 802.1Q VLAN tagging (1522 bytes), and troubleshoot runt/giant frame errors.',
      prerequisites: [
        'NET-101: Bits, Bytes, Binary & Hexadecimal Foundations',
        'NET-201: MAC Addresses & Physical Hardware Identity',
      ],
      whyItMatters:
        'Ethernet II (IEEE 802.3) is the universal Layer 2 framing standard for wired networking worldwide. Understanding header field offsets, EtherType codes, MTU payload limits, and CRC-32 integrity checking is indispensable for packet capture analysis, network engineering, and troubleshooting frame corruption.',
      explanation:
        'The Data Link Layer (Layer 2) encapsulates Layer 3 packets into structured units called **Ethernet Frames** for physical transmission across copper cables, fiber optic links, and wireless channels. The dominant standard on modern IP networks is the **Ethernet II frame** (also known as DIX Ethernet).\n\n### 1. Complete Frame Anatomy & Byte Field Allocations\nAn Ethernet II frame consists of a header, variable payload, and trailer:\n* **Preamble (7 Bytes)**: Seven bytes of alternating `10101010` bit patterns (`0x55`) that allow receiving physical transceivers to synchronize their clock signals.\n* **Start Frame Delimiter / SFD (1 Byte)**: The byte `10101011` (`0xD5`), which immediately signals to the receiver that the MAC header begins on the next bit.\n* **Destination MAC Address (6 Bytes)**: Identifies the target physical device or broadcast/multicast group.\n* **Source MAC Address (6 Bytes)**: Identifies the originating physical interface.\n* **EtherType (2 Bytes)**: Multiplexes upper-layer protocols. Key standard codes include:\n  - `0x0800`: IPv4 (Internet Protocol version 4)\n  - `0x86DD`: IPv6 (Internet Protocol version 6)\n  - `0x0806`: ARP (Address Resolution Protocol)\n  - `0x8100`: IEEE 802.1Q VLAN-Tagged Frame (inserts a 4-byte VLAN tag)\n* **Payload Data (46 to 1500 Bytes)**: Contains the encapsulated Layer 3 packet. The standard Maximum Transmission Unit (MTU) is 1500 bytes.\n* **Padding (0 to 38 Bytes)**: If the payload is smaller than 46 bytes (e.g. a 28-byte ARP packet), zero padding bytes are appended to ensure the frame reaches the mandatory 64-byte minimum size.\n* **Frame Check Sequence / FCS (4 Bytes)**: A 32-bit Cyclic Redundancy Check (CRC-32) computed across Destination MAC, Source MAC, EtherType, and Payload to detect physical transmission bit errors.\n\n### 2. Minimum & Maximum Frame Size Boundaries\n* **Minimum Frame Size**: **64 Bytes** ($6 \\text{ Dest} + 6 \\text{ Src} + 2 \\text{ EtherType} + 46 \\text{ Min Payload} + 4 \\text{ FCS} = 64 \\text{ Bytes}$, excluding the 8-byte Preamble/SFD). In early shared CSMA/CD networks, 64 bytes was mathematically required to ensure collision detection before transmission ended. Frames shorter than 64 bytes are **Runt frames** and are discarded as collision fragments.\n* **Standard Maximum Frame Size**: **1518 Bytes** ($14 \\text{ Header} + 1500 \\text{ Max MTU} + 4 \\text{ FCS} = 1518 \\text{ Bytes}$). When 802.1Q VLAN tagging is enabled, the maximum valid frame is extended to **1522 Bytes**.\n* **Giant & Jumbo Frames**: Frames larger than standard limits without proper MTU negotiation are flagged as **Giant frames**. **Jumbo Frames** (often configured up to 9000 bytes) are supported in data centers to reduce CPU overhead for large storage transfers (iSCSI/NFS).',
      components: [
        {
          name: 'Preamble & SFD (8 Bytes)',
          detail: '7 bytes of alternating 10101010 + 1 byte SFD (10101011 / 0xD5) for physical receiver clock synchronization.',
        },
        {
          name: 'Destination & Source MAC (12 Bytes)',
          detail: '6-byte target hardware address followed by 6-byte sender hardware address.',
        },
        {
          name: 'EtherType Protocol Field (2 Bytes)',
          detail: 'Multiplexes Layer 3 protocols: 0x0800 (IPv4), 0x86DD (IPv6), 0x0806 (ARP), 0x8100 (802.1Q).',
        },
        {
          name: 'Payload & Padding (46 to 1500 Bytes)',
          detail: 'Encapsulates Layer 3 packet. Standard MTU is 1500 bytes; zero padding added if payload < 46 bytes.',
        },
        {
          name: 'Frame Check Sequence / FCS (4 Bytes)',
          detail: '32-bit CRC-32 trailer computed across all frame fields to detect single-bit and multi-bit transmission errors.',
        },
        {
          name: '802.1Q VLAN Tagging (4 Bytes)',
          detail: 'Inserts TPID (0x8100) + 12-bit VLAN ID into header, expanding max standard frame size to 1522 bytes.',
        },
      ],
      howItWorks: [
        {
          stepNumber: 1,
          title: 'Layer 3 Packet Ingress',
          action: 'The network stack delivers an IP packet or ARP message to the data link layer for transmission.',
        },
        {
          stepNumber: 2,
          title: 'Header Assembly & EtherType Tagging',
          action: 'The NIC prepends Destination MAC, Source MAC, and sets EtherType to 0x0800 (IPv4), 0x86DD (IPv6), or 0x0806 (ARP).',
        },
        {
          stepNumber: 3,
          title: 'Padding Verification (64-Byte Floor)',
          action: 'If payload is under 46 bytes, zero padding is appended so the frame reaches the required 64-byte minimum.',
        },
        {
          stepNumber: 4,
          title: 'CRC-32 Calculation & Wire Transmission',
          action: 'The NIC hardware computes CRC-32 across the frame, appends the 4-byte FCS trailer, and clocks bits onto the wire preceded by Preamble/SFD.',
        },
        {
          stepNumber: 5,
          title: 'Receiver Frame Verification',
          action: 'The receiving NIC recalculates CRC-32: if it matches FCS, headers are stripped and the packet is passed to Layer 3; if corrupted, the frame is silently dropped.',
        },
      ],
      packetHeaderView: {
        protocol: 'Ethernet II Frame (64 to 1518 Bytes)',
        fields: [
          { fieldName: 'Preamble + SFD', bitLength: '64 bits (8 Bytes)', hexSample: '55 55 55 55 55 55 55 D5', description: 'Clock synchronization preamble and delimiter.' },
          { fieldName: 'Destination MAC', bitLength: '48 bits (6 Bytes)', hexSample: '00:1A:2B:3C:4D:5E', description: 'Receiver hardware MAC address.' },
          { fieldName: 'Source MAC', bitLength: '48 bits (6 Bytes)', hexSample: 'E8:6A:64:12:34:56', description: 'Sender hardware MAC address.' },
          { fieldName: 'EtherType', bitLength: '16 bits (2 Bytes)', hexSample: '0x0800 (IPv4)', description: 'Multiplexed Layer 3 network protocol.' },
          { fieldName: 'Payload & Padding', bitLength: '368 - 12000 bits (46 - 1500B)', hexSample: 'Layer 3 IP Packet', description: 'User data and padded zeros if payload < 46B.' },
          { fieldName: 'FCS (CRC-32)', bitLength: '32 bits (4 Bytes)', hexSample: '0x3F2A1B0C', description: 'Cyclic redundancy check trailer.' },
        ],
        headerDiagramAscii: `+-----------------------------------------------------------------------------------+
|                            ETHERNET II FRAME ANATOMY                              |
+-------------+-------------+-------------+-----------+-----------------+-----------+
| Preamble/SFD| Dest MAC    | Source MAC  | EtherType | Payload (Data)  | FCS (CRC) |
|   8 Bytes   |   6 Bytes   |   6 Bytes   |  2 Bytes  | 46 - 1500 Bytes |  4 Bytes  |
+-------------+-------------+-------------+-----------+-----------------+-----------+
|<----------------- Standard Minimum Frame: 64 Bytes ------------------------------>|
|<----------------- Standard Maximum Frame: 1518 Bytes ---------------------------->|
|<----------------- With 802.1Q VLAN Tag: 1522 Bytes ------------------------------>|`,
      },
      visualizer: {
        type: 'ETHERNET_FRAME_INSPECTOR',
        title: 'Interactive Ethernet II Frame Inspector & CRC Engine',
        description: 'Dissect live Ethernet frames byte-by-byte, inspect EtherType values (0x0800, 0x86DD, 0x0806), observe padding addition for small payloads, and calculate CRC-32 checksums.',
      },
      workedExample: {
        title: 'Calculating Minimum Frame Padding for a 28-Byte ARP Request',
        problemStatement:
          'An ARP Request packet has a payload size of 28 bytes.\n1. How many bytes of padding must be appended to satisfy Ethernet II framing rules?\n2. What is the total frame size transmitted on the wire (excluding the 8-byte Preamble/SFD)?',
        stepByStepSolution: [
          'Step 1 (Minimum Payload Rule): Ethernet II requires a minimum payload size of 46 bytes so that the frame reaches at least 64 bytes.',
          'Step 2 (Padding Calculation): ARP payload = 28 bytes. Padding required = 46 bytes - 28 bytes = 18 bytes of zero padding.',
          'Step 3 (Total Frame Calculation): Dest MAC (6B) + Src MAC (6B) + EtherType (2B) + Payload (28B) + Padding (18B) + FCS (4B) = 64 bytes total.',
        ],
        finalResult:
          '18 bytes of padding added; total transmitted frame size is exactly 64 bytes.',
      },
      practice: [
        {
          id: 1,
          prompt: 'What are the official EtherType hexadecimal codes for IPv4, IPv6, and ARP in Ethernet II frames?',
          expected: 'IPv4 = 0x0800, IPv6 = 0x86DD, ARP = 0x0806.',
          hints: '0x0800 is IPv4; 0x86DD is IPv6; 0x0806 is ARP.',
        },
        {
          id: 2,
          prompt: 'What are the minimum and maximum standard untagged Ethernet II frame sizes in bytes (excluding Preamble)?',
          expected: 'Minimum = 64 bytes; Maximum = 1518 bytes.',
          hints: 'Min frame has 46B payload; max frame has 1500B payload (MTU). Framing overhead is 18 bytes.',
        },
        {
          id: 3,
          prompt: 'If an application sends a 20-byte UDP DNS packet, how many bytes of padding will the Ethernet layer add?',
          expected: '26 bytes of padding (46 - 20 = 26 bytes).',
          hints: 'Minimum payload requirement is 46 bytes.',
        },
        {
          id: 4,
          prompt: 'What happens when a switch or host receives an Ethernet frame whose computed CRC-32 does not match the 4-byte FCS trailer?',
          expected: 'The receiving NIC or switch immediately and silently drops the corrupted frame without generating an error response.',
          hints: 'Ethernet provides error detection, not error recovery.',
        },
        {
          id: 5,
          prompt: 'What is a "Runt" frame on an Ethernet network, and what typically causes it?',
          expected: 'A frame smaller than 64 bytes; typically caused by CSMA/CD collisions or physical cable faults.',
          hints: 'Any frame < 64 bytes is illegal on 802.3 Ethernet.',
        },
        {
          id: 6,
          prompt: 'When an 802.1Q VLAN tag is inserted into an Ethernet header, how many bytes are added and what is the new maximum standard frame size?',
          expected: '4 bytes are added (TPID 0x8100 + TCI), expanding maximum standard frame size to 1522 bytes.',
          hints: '1518 + 4 = 1522 bytes.',
        },
      ],
      recap: [
        'Ethernet II is the universal Layer 2 framing standard on modern IP networks.',
        'Ethernet headers contain Dest MAC (6B), Src MAC (6B), EtherType (2B), Payload (46-1500B), and FCS (4B).',
        'Standard EtherType codes: IPv4 = 0x0800, IPv6 = 0x86DD, ARP = 0x0806, 802.1Q = 0x8100.',
        'Minimum frame size is 64 bytes (payloads < 46B are padded); standard maximum is 1518 bytes (1522 with 802.1Q).',
        'FCS uses 32-bit CRC to detect physical layer bit corruption; damaged frames are dropped silently.',
      ],
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
        explanation:
          'Ethernet II standard EtherType fields: `0x0800` identifies IPv4, `0x86DD` identifies IPv6, and `0x0806` identifies ARP.',
        explanationsJson: {
          1: 'Invalid arbitrary numbers.',
          2: '0x8100 is 802.1Q VLAN; 0x8847 is MPLS; 0x88CC is LLDP.',
          3: '0x06 and 0x11 are IP protocol numbers for TCP and UDP, not Ethernet EtherTypes.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Ethernet II EtherType Values',
      },
      {
        text: 'What is the minimum valid Ethernet II frame size on the wire (excluding the 8-byte Preamble/SFD) and why was this minimum established?',
        options: [
          '64 bytes; to guarantee that in shared CSMA/CD half-duplex networks, collisions would be detected before transmission finished',
          '32 bytes; to match the 32-bit IPv4 address space',
          '128 bytes; to fit encrypted TLS cryptographic keys',
          '1500 bytes; to equal the Maximum Transmission Unit (MTU)',
        ],
        correctOption: 0,
        explanation:
          'The 64-byte minimum frame size ($6+6+2+46+4=64$) ensured slot time exceeded maximum round-trip propagation delay in CSMA/CD segments, enabling reliable collision detection.',
        explanationsJson: {
          1: 'Frame length is independent of IP address bit length.',
          2: 'TLS keys operate at Layer 6/7, not Layer 2 framing minimums.',
          3: '1500 bytes is the maximum payload MTU, not the minimum frame floor.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Minimum Ethernet Frame Size Mechanics',
      },
      {
        text: 'An ARP request containing 28 bytes of data is encapsulated in an Ethernet II frame. How many bytes of padding will the network interface card append?',
        options: [
          '18 bytes of zero padding (46 - 28 = 18 bytes)',
          '0 bytes',
          '36 bytes',
          '46 bytes',
        ],
        correctOption: 0,
        explanation:
          'Because the minimum payload for Ethernet II is 46 bytes, an interface encapsulating a 28-byte ARP packet must add $46 - 28 = 18$ bytes of padding to reach the 64-byte minimum frame size.',
        explanationsJson: {
          1: 'Zero padding would result in a 46-byte runt frame which would be dropped.',
          2: '36 bytes would exceed the minimum required padding.',
          3: '46 bytes would double the payload unnecessarily.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Ethernet Payload Padding Calculation',
      },
      {
        text: 'What algorithm does the 4-byte Frame Check Sequence (FCS) trailer use to verify data integrity in an Ethernet frame?',
        options: [
          'Cyclic Redundancy Check (CRC-32)',
          'MD5 Cryptographic Hash',
          'SHA-256 Checksum',
          'Simple 8-bit Parity Bit',
        ],
        correctOption: 0,
        explanation:
          'Ethernet uses a 32-bit Cyclic Redundancy Check (CRC-32) in its FCS trailer. The receiver recalculates the CRC and compares it to FCS; if mismatching, the frame is dropped.',
        explanationsJson: {
          1: 'MD5 is a cryptographic hash, not used in Ethernet hardware trailers.',
          2: 'SHA-256 is too computationally heavy for Layer 2 line-rate hardware CRC checking.',
          3: 'Simple parity cannot detect multi-bit burst errors reliably.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Frame Check Sequence & CRC-32',
      },
      {
        text: 'When IEEE 802.1Q VLAN encapsulation is active on an Ethernet trunk link, where is the 4-byte VLAN tag inserted and what is the new maximum standard frame size?',
        options: [
          'Inserted between Source MAC and EtherType; increases maximum standard frame size from 1518 to 1522 bytes',
          'Appended to the end of the FCS trailer; maximum size remains 1500 bytes',
          'Inserted at the beginning of the Preamble; increases size to 2000 bytes',
          'Placed inside the IP header options field; size is unchanged',
        ],
        correctOption: 0,
        explanation:
          'The 802.1Q tag (4 bytes: TPID 0x8100 + TCI with Priority, DEI, and 12-bit VLAN ID) is inserted between the Source MAC and original EtherType, raising the standard maximum frame size to 1522 bytes.',
        explanationsJson: {
          1: 'FCS must always be the final trailer of the frame.',
          2: 'Preamble is physical layer timing and cannot carry VLAN tags.',
          3: '802.1Q is a Layer 2 Ethernet tag, not an IP Layer 3 header option.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: '802.1Q VLAN Tagging & Frame Expansion',
      },
      {
        text: 'A network administrator notices thousands of "Runt frame" errors logged on switch interface GigabitEthernet0/1. What does this mean, and what is the most likely physical root cause?',
        options: [
          'Frames received are smaller than 64 bytes; typically caused by a faulty copper cable, bad connector, or duplex mismatch causing collisions',
          'Frames received exceed 1500 bytes; caused by jumbo frames',
          'The switch port is running out of memory',
          'The DNS server is offline',
        ],
        correctOption: 0,
        explanation:
          'Runt frames are frames smaller than 64 bytes. In modern full-duplex switches, runts are almost always caused by physical cable damage, electrical noise truncating signals, or half/full duplex mismatch collision fragments.',
        explanationsJson: {
          1: 'Frames exceeding maximum size are Giant frames, not Runt frames.',
          2: 'Runt errors reflect frame size violations on the wire, not switch memory exhaustion.',
          3: 'DNS operates at Layer 7 and does not cause Layer 2 runt frames.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
        questionType: QuestionType.TROUBLESHOOTING,
        concept: 'Runt Frame Detection & Troubleshooting',
      },
    ],
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
    contentV2: {
      objective:
        'Identify all RFC-defined special-use IPv4 address blocks, understand why private addresses cannot be routed across the public Internet without NAT, and diagnose APIPA configuration failures.',
      prerequisites: ['net-202-ipv4-addressing-cidr'],
      whyItMatters:
        'Accidentally routing private IPs across the Internet causes packet drops at ISP edge filters, while encountering an APIPA address immediately indicates DHCP service failure.',
      explanation:
        'The IANA and IETF reserved specific IPv4 address blocks for specialized functions:\n\n### 1. RFC 1918 Private Address Blocks\n* **Class A Private**: `10.0.0.0/8` (`10.0.0.0` to `10.255.255.255`, 16,777,216 addresses). Used for large enterprise LANs and datacenters.\n* **Class B Private**: `172.16.0.0/12` (`172.16.0.0` to `172.31.255.255`, 1,048,576 addresses spanning 16 contiguous /16 blocks).\n* **Class C Private**: `192.168.0.0/16` (`192.168.0.0` to `192.168.255.255`, 65,536 addresses spanning 256 /24 blocks). Standard for home and small business routers.\n\n### 2. Specialized Host & Infrastructure Blocks\n* **Loopback Block (RFC 1122)**: `127.0.0.0/8` (typically `127.0.0.1`). Packets destined to 127.x.x.x never leave the host OS kernel and test TCP/IP stack integrity.\n* **APIPA Link-Local (RFC 3927)**: `169.254.0.0/16` (`169.254.0.1` to `169.254.255.254`). Automatically self-assigned by Windows/macOS when a DHCP server fails to respond.\n* **Carrier-Grade NAT / CGNAT (RFC 6598)**: `100.64.0.0/10` (`100.64.0.0` to `100.127.255.255`). Used internally by ISPs to multiplex public IPv4 addresses across thousands of broadband subscribers.',
      components: [
        {
          name: 'RFC 1918 Class A (10.0.0.0/8)',
          detail: '10.0.0.0 – 10.255.255.255 (16.7M addresses). Enterprise campus networks.',
        },
        {
          name: 'RFC 1918 Class B (172.16.0.0/12)',
          detail: '172.16.0.0 – 172.31.255.255 (1M addresses across 16 contiguous /16s).',
        },
        {
          name: 'RFC 1918 Class C (192.168.0.0/16)',
          detail: '192.168.0.0 – 192.168.255.255 (65k addresses across 256 /24s).',
        },
        {
          name: 'Loopback (127.0.0.0/8)',
          detail: '127.0.0.1. Node-local software testing; never transmitted onto physical wire.',
        },
        {
          name: 'APIPA Link-Local (169.254.0.0/16)',
          detail: 'Auto-assigned upon DHCP discovery failure; isolated to local broadcast domain.',
        },
        {
          name: 'Carrier-Grade NAT (100.64.0.0/10)',
          detail: 'RFC 6598 ISP shared address space for subscriber WAN aggregation.',
        },
      ],
      howItWorks: [
        {
          stepNumber: 1,
          title: 'Private vs Public Routing',
          action: 'Internal hosts communicate using RFC 1918 IPs; edge router performs NAT before sending onto public Internet.',
        },
        {
          stepNumber: 2,
          title: 'Loopback Testing',
          action: 'Pinging `127.0.0.1` tests internal host TCP/IP protocol stack functionality.',
        },
        {
          stepNumber: 3,
          title: 'APIPA Fallback Trigger',
          action: 'If DHCP Discover times out after 4 attempts, OS generates a pseudo-random `169.254.x.x` address.',
        },
      ],
      visualizer: {
        type: 'SPECIAL_IP_INSPECTOR',
        title: 'Special-Use IPv4 Range Classifier & Address Inspector',
        description: 'Input any IPv4 address to determine its special RFC classification, routability status, and intended enterprise use case.',
      },
      workedExample: {
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
      practice: [
        {
          id: 1,
          prompt: 'What are the three official RFC 1918 Private IPv4 address blocks and their CIDR prefixes?',
          expected: '10.0.0.0/8, 172.16.0.0/12 (172.16 to 172.31), and 192.168.0.0/16 (192.168.0 to 192.168.255).',
          hints: '10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16.',
        },
        {
          id: 2,
          prompt: 'What is the designated purpose and address block for IPv4 Loopback?',
          expected: '127.0.0.0/8 (e.g. 127.0.0.1), used for local host TCP/IP stack self-testing and inter-process communication.',
          hints: '127.0.0.1 tests local protocol stack.',
        },
        {
          id: 3,
          prompt: 'What does an IP address in the 169.254.0.0/16 range indicate when observed on an endpoint interface?',
          expected: 'Automatic Private IP Addressing (APIPA) fallback caused by a failure to contact a DHCP server.',
          hints: '169.254.x.x indicates DHCP failure.',
        },
        {
          id: 4,
          prompt: 'Is 172.32.10.1 a private RFC 1918 address or a public routable address?',
          expected: 'Public routable address; RFC 1918 Class B space stops at 172.31.255.255.',
          hints: '172.16.0.0/12 ends at 172.31.255.255.',
        },
        {
          id: 5,
          prompt: 'What is the purpose of the 100.64.0.0/10 address block defined in RFC 6598?',
          expected: 'Carrier-Grade NAT (CGNAT) space used internally by ISPs between subscriber routers and core NAT gateways.',
          hints: 'CGNAT space for ISPs.',
        },
        {
          id: 6,
          prompt: 'Why do Internet backbone routers drop packets with destination addresses in RFC 1918 ranges?',
          expected: 'Because RFC 1918 private addresses are non-globally routable and intended solely for internal isolated networks.',
          hints: 'Private IPs cannot be routed globally without NAT.',
        },
      ],
      recap: [
        'RFC 1918 defines 3 private ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) for internal enterprise networks.',
        'Loopback (127.0.0.0/8) enables local host self-testing without network transmission.',
        'APIPA (169.254.0.0/16) self-configures upon DHCP failure for local link communication.',
        'CGNAT (100.64.0.0/10) enables ISP-level address sharing and WAN aggregation.',
        'Private addresses require Network Address Translation (NAT) to access public Internet destinations.',
      ],
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
        explanation:
          'RFC 1918 specifies three private address blocks: 10.0.0.0/8 (Class A), 172.16.0.0/12 (Class B, spanning 172.16 to 172.31), and 192.168.0.0/16 (Class C, spanning 192.168.0 to 192.168.255).',
        explanationsJson: {
          1: 'Those are Loopback, APIPA, and Multicast.',
          2: 'Those are public routable blocks.',
          3: '192.168.0.0/16 encompasses all 256 /24 subnets.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'RFC 1918 Private Address Ranges',
      },
      {
        text: 'What is the operational behavior of packets transmitted to IP address `127.0.0.1` on a host operating system?',
        options: [
          'The packets are processed entirely within the local host TCP/IP stack in kernel memory and are never transmitted onto the physical network wire',
          'The packets are broadcast to all devices on the local Ethernet switch',
          'The packets are routed to the nearest ISP default gateway',
          'The packets are discarded as malformed runt frames',
        ],
        correctOption: 0,
        explanation:
          'The `127.0.0.0/8` block is reserved for loopback. Traffic sent to 127.0.0.1 loops back internally inside the host OS network stack, verifying software protocol stack integrity without hitting network hardware.',
        explanationsJson: {
          1: 'Loopback traffic is never broadcast onto physical links.',
          2: 'Loopback traffic does not leave the local computer.',
          3: 'Loopback packets are fully valid transport messages processed internally.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'IPv4 Loopback Architecture (127.0.0.1)',
      },
      {
        text: 'A systems administrator discovers that an internal server has been assigned IP `172.32.1.100`. Why is this address configuration problematic for an internal private network?',
        options: [
          '172.32.1.100 is a globally routable public IP owned by an external organization (RFC 1918 Class B space stops at 172.31.255.255), creating IP conflicts when accessing legitimate Internet services on that range',
          '172.32.1.100 is a reserved multicast address',
          '172.32.1.100 cannot be represented in binary notation',
          '172.32.1.100 forces all network switches into half-duplex mode',
        ],
        correctOption: 0,
        explanation:
          'RFC 1918 Class B private address space spans strictly from `172.16.0.0` to `172.31.255.255` (/12). `172.32.0.0` and above are public routable addresses.',
        explanationsJson: {
          1: 'Multicast uses 224.0.0.0/4 (Class D).',
          2: 'All 32-bit IPv4 addresses have standard binary representations.',
          3: 'Duplex mode is a Layer 1/2 physical link setting, unrelated to IP addressing.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'RFC 1918 Class B Boundaries',
      },
      {
        text: 'What does an IPv4 address of `169.254.100.50` with subnet mask `255.255.0.0` signify when observed on a newly booted client workstation?',
        options: [
          'Automatic Private IP Addressing (APIPA) self-assignment occurred because the client failed to receive a response from a local DHCP server',
          'The workstation successfully leased a high-priority enterprise IP address',
          'The default gateway router assigned a dynamic cloud route',
          'The workstation has been infected by a boot-sector rootkit',
        ],
        correctOption: 0,
        explanation:
          'The `169.254.0.0/16` prefix is reserved by RFC 3927 for APIPA link-local addressing. When DHCP Discover broadcasts go unanswered, the client self-assigns an address in this block.',
        explanationsJson: {
          1: 'APIPA is not an enterprise server lease; it indicates DHCP failure.',
          2: 'Routers do not assign APIPA addresses.',
          3: 'APIPA is a standard operating system network recovery mechanism, not malware.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
        questionType: QuestionType.TROUBLESHOOTING,
        concept: 'APIPA Link-Local Diagnosis',
      },
      {
        text: 'Which RFC 6598 address block is specifically reserved for Carrier-Grade NAT (CGNAT) deployed by ISPs?',
        options: [
          '100.64.0.0/10 (100.64.0.0 – 100.127.255.255)',
          '192.168.0.0/16',
          '10.0.0.0/8',
          '240.0.0.0/4',
        ],
        correctOption: 0,
        explanation:
          'RFC 6598 defines `100.64.0.0/10` for Carrier-Grade NAT (CGNAT), providing service providers with a shared address space between subscriber premises equipment and edge NAT routers.',
        explanationsJson: {
          1: '192.168.0.0/16 is RFC 1918 private customer space.',
          2: '10.0.0.0/8 is RFC 1918 private enterprise space.',
          3: '240.0.0.0/4 is Class E experimental space.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Carrier-Grade NAT (RFC 6598)',
      },
      {
        text: 'A network administrator notices that packets originating from `192.168.1.50` reach the local default gateway router, but cannot reach external web servers on the Internet. What router service is missing?',
        options: [
          'Network Address Translation (NAT) / Port Address Translation (PAT) to translate private RFC 1918 IPs into a routable public IP',
          'A DNS cache flush command',
          'An ARP broadcast disable command',
          'A fiber optic cable transponder',
        ],
        correctOption: 0,
        explanation:
          'Because RFC 1918 private addresses cannot be routed across the public Internet, the boundary router must perform NAT/PAT to translate the internal private source IP into a registered public IP address.',
        explanationsJson: {
          1: 'Flushing DNS does not resolve Layer 3 routing for non-routable private addresses.',
          2: 'Disabling ARP breaks local Layer 2 resolution.',
          3: 'Physical transponders do not handle Layer 3 address translation.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
        questionType: QuestionType.TROUBLESHOOTING,
        concept: 'NAT/PAT Requirement for RFC 1918 Addresses',
      },
    ],
  },
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
    contentV2: {
      objective:
        'Understand historical RFC 791 Classful Addressing (Classes A, B, C, D, E), analyze why classful boundaries led to severe address exhaustion, and understand how CIDR (RFC 1519) decoupled network prefixes from fixed byte boundaries.',
      prerequisites: ['net-202-ipv4-addressing-cidr', 'level-0-ip-addresses-logical-location'],
      whyItMatters:
        'CIDR saved the Internet from complete address exhaustion and routing table collapse in the mid-1990s. Understanding this transition explains why prefix notation (/N) is universal today.',
      explanation:
        'Under RFC 791 (1981), IPv4 was divided into 5 rigid classes determined by leading bits:\n\n### 1. The 5 Historical Address Classes\n* **Class A (Leading bit `0`)**: `1.0.0.0` to `126.255.255.255`. Default `/8` mask (`255.0.0.0`). 126 total networks, each supporting **16,777,214 usable hosts**.\n* **Class B (Leading bits `10`)**: `128.0.0.0` to `191.255.255.255`. Default `/16` mask (`255.255.0.0`). 16,384 total networks, each supporting **65,534 usable hosts**.\n* **Class C (Leading bits `110`)**: `192.0.0.0` to `223.255.255.255`. Default `/24` mask (`255.255.255.0`). 2,097,152 total networks, each supporting **254 usable hosts**.\n* **Class D (Leading bits `1110`)**: `224.0.0.0` to `239.255.255.255`. Reserved for **Multicast** groups (no subnet masks or host fields).\n* **Class E (Leading bits `1111`)**: `240.0.0.0` to `255.255.255.255`. Reserved for **Experimental** and research use.\n\n### 2. The Classful Exhaustion Crisis\nAn enterprise needing 350 IP addresses found Class C (/24 = 254 hosts) too small. They were forced to request a Class B (/16 = 65,534 hosts), wasting 65,184 addresses (99.5% waste!). By 1992, Class B addresses were nearly exhausted and global routing tables were exploding with millions of unaggregated routes.\n\n### 3. CIDR Decoupling & Supernetting (RFC 1519)\nIn 1993, the IETF introduced **Classless Inter-Domain Routing (CIDR)**:\n1. **Abolished Fixed Classes**: Subnet prefix length `/N` is explicit and can be set to any arbitrary bit length (e.g. `/23` for 510 hosts, perfectly fitting 350 hosts with minimal waste).\n2. **Route Aggregation (Supernetting)**: ISPs aggregate dozens of contiguous smaller subnets into a single advertised route prefix (e.g. 16 contiguous `/24`s merged into one `/20`), reducing global BGP routing table size.',
      components: [
        {
          name: 'Class A (1–126, Leading Bit 0)',
          detail: 'Default /8 (255.0.0.0). 126 networks with 16.7M hosts each.',
        },
        {
          name: 'Class B (128–191, Leading Bits 10)',
          detail: 'Default /16 (255.255.0.0). 16,384 networks with 65,534 hosts each.',
        },
        {
          name: 'Class C (192–223, Leading Bits 110)',
          detail: 'Default /24 (255.255.255.0). 2.09M networks with 254 hosts each.',
        },
        {
          name: 'Class D (224–239) & Class E (240–255)',
          detail: 'Class D is Multicast; Class E is Experimental.',
        },
        {
          name: 'CIDR Decoupling (RFC 1519)',
          detail: 'Abolished rigid classes; enabled arbitrary /N prefix lengths and route aggregation.',
        },
      ],
      howItWorks: [
        {
          stepNumber: 1,
          title: 'Classful Address Assessment',
          action: 'In 1990, an organization with 400 computers requested IP space; IANA had to grant an entire /16 Class B (65,534 IPs).',
        },
        {
          stepNumber: 2,
          title: 'Address Waste Impact',
          action: '65,184 IPs sat completely unused and locked, accelerating global IPv4 depletion.',
        },
        {
          stepNumber: 3,
          title: 'CIDR Prefix Allocation',
          action: 'Under CIDR (1993), IANA assigns a `/23` prefix (510 usable hosts), matching the 400-host requirement with 98% efficiency.',
        },
        {
          stepNumber: 4,
          title: 'Route Aggregation (Supernetting)',
          action: 'ISPs aggregate multiple contiguous `/24` subnets into a single advertised `/20` prefix, shrinking global routing tables.',
        },
      ],
      visualizer: {
        type: 'CLASSFUL_CIDR_TIMELINE',
        title: 'Interactive Classful IPv4 to CIDR Evolution Timeline',
        description: 'Inspect Class A, B, C leading bit allocations, observe address waste calculations, and trace how CIDR supernetting compressed the global routing table.',
      },
      workedExample: {
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
      practice: [
        {
          id: 1,
          prompt: 'What are the first octet numerical boundaries and default subnet masks for historical Classes A, B, and C?',
          expected: 'Class A: 1–126 (/8); Class B: 128–191 (/16); Class C: 192–223 (/24).',
          hints: 'Class A 1-126 (/8), Class B 128-191 (/16), Class C 192-223 (/24).',
        },
        {
          id: 2,
          prompt: 'Why is 127.0.0.0 excluded from Class A addressing?',
          expected: '127.0.0.0/8 is reserved for host loopback testing (RFC 1122).',
          hints: '127 is reserved for loopback.',
        },
        {
          id: 3,
          prompt: 'Why did Classful IPv4 allocation lead to massive address waste in the early 1990s?',
          expected: 'Because fixed byte boundaries forced organizations needing more than 254 hosts to take a Class B (65,534 hosts), wasting thousands of addresses.',
          hints: 'Organizations between 255 and 65,534 hosts had to take a full /16.',
        },
        {
          id: 4,
          prompt: 'What two major networking problems did CIDR (RFC 1519) solve in 1993?',
          expected: 'Address exhaustion (by allowing custom /N prefix sizes) and global routing table explosion (via supernetting / route aggregation).',
          hints: 'Custom prefix lengths and route aggregation.',
        },
        {
          id: 5,
          prompt: 'What are Class D and Class E address blocks reserved for?',
          expected: 'Class D (224–239) is reserved for Multicast; Class E (240–255) is reserved for Experimental use.',
          hints: 'D = Multicast, E = Experimental.',
        },
        {
          id: 6,
          prompt: 'What is Route Aggregation (Supernetting)?',
          expected: 'Combining multiple contiguous smaller subnet routes into a single larger advertised prefix to reduce routing table size.',
          hints: 'Merging multiple subnets into one routing entry.',
        },
      ],
      recap: [
        'Classful addressing used rigid byte boundaries (Class A /8, Class B /16, Class C /24) leading to 99% address waste.',
        'CIDR (RFC 1519, 1993) decoupled prefix masks from address values, enabling custom /N sizing.',
        'Class D (224–239) is Multicast; Class E (240–255) is Experimental.',
        'Supernetting aggregates multiple contiguous subnets into single BGP route advertisements.',
        'Modern networking is entirely classless; every IP configuration requires an explicit prefix length.',
      ],
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
        explanation:
          'Classful addressing caused massive address waste (e.g. an enterprise needing 300 hosts had to take a full Class B with 65,534 addresses). CIDR enabled tailored prefix sizes (like /23 for 510 hosts) and route summarization.',
        explanationsJson: {
          1: '128-bit addresses were introduced by IPv6, not CIDR.',
          2: 'Routers remain essential for forwarding CIDR prefixes.',
          3: 'Encryption is handled by TLS/IPsec.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'CIDR Architectural Purpose',
      },
      {
        text: 'What are the first octet numerical ranges and default classful subnet masks for historical Classes A, B, and C?',
        options: [
          'Class A = 1–126 (/8), Class B = 128–191 (/16), Class C = 192–223 (/24)',
          'Class A = 1–100 (/8), Class B = 101–200 (/16), Class C = 201–255 (/24)',
          'Class A = 0–127 (/16), Class B = 128–192 (/24), Class C = 193–255 (/32)',
          'Class A = 10.0.0.0 (/8), Class B = 172.16.0.0 (/12), Class C = 192.168.0.0 (/16)',
        ],
        correctOption: 0,
        explanation:
          'Classful boundaries: Class A spans 1 to 126 (mask 255.0.0.0 /8), Class B spans 128 to 191 (mask 255.255.0.0 /16), and Class C spans 192 to 223 (mask 255.255.255.0 /24). 127 is reserved for loopback.',
        explanationsJson: {
          1: 'Arbitrary numbers.',
          2: 'Incorrect ranges and masks.',
          3: 'These are RFC 1918 private ranges, not the general classful architecture.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Classful First Octet Ranges & Default Masks',
      },
      {
        text: 'An enterprise in 1991 required 300 IPv4 addresses for its campus. Under historical classful rules, why did this allocation cause 99.5% address waste?',
        options: [
          'Because Class C (/24) provided only 254 hosts, forcing the organization to receive a full Class B (/16 = 65,534 hosts), leaving 65,234 addresses unused',
          'Because Class A provided only 126 addresses',
          'Because routers were unable to process more than 10 packets per second',
          'Because the enterprise was required to discard all odd-numbered IP addresses',
        ],
        correctOption: 0,
        explanation:
          'With Class C capped at 254 usable hosts, any requirement between 255 and 65,534 hosts forced the allocation of a full Class B (/16), locking 65,000+ unused addresses away from the global pool.',
        explanationsJson: {
          1: 'Class A provides 16.7 million hosts.',
          2: 'Router forwarding speed is independent of classful allocation sizes.',
          3: 'All usable IP addresses in a subnet are valid.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Classful Address Allocation Inefficiency',
      },
      {
        text: 'What is the architectural purpose of Class D and Class E IPv4 address blocks?',
        options: [
          'Class D (224.0.0.0 – 239.255.255.255) is reserved for Multicast; Class E (240.0.0.0 – 255.255.255.255) is reserved for Experimental use',
          'Class D is for public web servers; Class E is for private home routers',
          'Class D is for fiber optic networks; Class E is for wireless networks',
          'Class D is for IPv6 translation; Class E is for DNS root servers',
        ],
        correctOption: 0,
        explanation:
          'Class D (224.0.0.0/4) is designated for multicast group addressing. Class E (240.0.0.0/4) was set aside by the IETF for experimental and research use.',
        explanationsJson: {
          1: 'Public web servers use unicast Class A/B/C addresses.',
          2: 'Physical media types are Layer 1/2 concerns.',
          3: 'Class D and E are not protocol translation mechanisms.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Class D Multicast & Class E Experimental Spaces',
      },
      {
        text: 'How does CIDR Route Aggregation (Supernetting) prevent global Internet routing table exhaustion?',
        options: [
          'It combines multiple contiguous smaller subnet routes into a single summarized prefix advertisement (e.g. 16 /24 routes advertised as one /20), dramatically reducing routing table entries',
          'It forces all internet traffic through a single physical router in California',
          'It converts all IPv4 packets into uncompressed text files',
          'It shuts down dormant websites automatically',
        ],
        correctOption: 0,
        explanation:
          'Route aggregation (Supernetting) allows service providers to summarize multiple contiguous network blocks into a single routing table entry, reducing the memory and processing load on global BGP core routers.',
        explanationsJson: {
          1: 'The Internet is a distributed global mesh, not a single centralized router.',
          2: 'Packets retain standard binary headers.',
          3: 'Route aggregation manages routing announcements, not website lifecycles.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'CIDR Route Aggregation / Supernetting',
      },
      {
        text: 'A network technician encounters a legacy configuration using `192.168.1.0/28`. A colleague claims this is invalid because "192.168.x.x is Class C and must use /24". How should the technician explain the colleague\'s misconception?',
        options: [
          'Under modern Classless Inter-Domain Routing (CIDR), fixed classes are obsolete; any IP address can use any valid subnet prefix length (/28 provides 14 usable hosts)',
          'The colleague is correct; subnets other than /24 will damage the network interface card',
          'A /28 mask only works on token ring networks',
          'The IP address must be converted to hexadecimal before applying a /28 mask',
        ],
        correctOption: 0,
        explanation:
          'CIDR decoupled IP addresses from fixed classful byte boundaries. Any IPv4 address can be subnetted using any prefix length from /1 to /32.',
        explanationsJson: {
          1: 'Subnet masks are mathematical bit filters and do not damage hardware.',
          2: 'CIDR works uniformly across all modern Ethernet and IP media.',
          3: 'Binary bitmasking is performed automatically by the OS kernel.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
        questionType: QuestionType.TROUBLESHOOTING,
        concept: 'Classless CIDR vs Classful Misconceptions',
      },
    ],
  },
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
    contentV2: {
      objective:
        'Master Variable Length Subnet Masking (VLSM) design principles, apply the Golden Rule of VLSM (Largest to Smallest allocation order), partition a base IPv4 block across multiple department requirements, and verify zero-overlap integrity.',
      prerequisites: ['net-202-ipv4-addressing-cidr', 'ip-addressing-ipv4-overview'],
      whyItMatters:
        'In real-world enterprise networks, departments have vastly different host requirements (e.g. 60 hosts vs 10 hosts vs 2-host WAN links). Traditional Fixed-Length Subnet Masking (FLSM) wastes hundreds of addresses, whereas VLSM optimizes address efficiency to near 100%.',
      explanation:
        'Variable Length Subnet Masking (VLSM) allows network engineers to subnet an already subnetted network, assigning different CIDR prefix lengths to different subnets based on their exact host requirements.\n\n### 1. The Golden Rule of VLSM: Largest to Smallest\nWhen partitioning an address block across multiple departmental subnets, **always allocate starting with the largest host requirement first, proceeding in strict descending order down to the smallest (WAN point-to-point links last)**.\n* **Why?** Subnet network IDs must always begin on a numerical boundary that is a multiple of their block size ($2^H$). If you allocate small subnets (e.g. a /30 block size of 4) at the start of a range, the remaining unallocated address space will no longer align with the large block boundary required by a /26 (block size 64) or /27 (block size 32), causing address fragmentation and overlapping subnet errors.\n\n### 2. Sizing Point-to-Point WAN Links (/30)\nPoint-to-point router links require exactly 2 usable IP addresses (one for each router interface). Using a `/24` or `/28` on a WAN link wastes dozens of addresses. A **`/30` prefix** ($255.255.255.252$) provides $2^2 = 4$ total addresses ($2^2 - 2 = 2$ usable host IPs), maximizing address conservation.\n\n### 3. Step-by-Step VLSM Design Workflow\n1. **List and Sort**: Write down all subnet host requirements and sort in descending order (e.g. 60 hosts -> 25 hosts -> 10 hosts -> 2 hosts -> 2 hosts).\n2. **Determine Host Bits & Mask**: For each department, find the smallest exponent $H$ satisfying $2^H - 2 \\ge \\text{Required Hosts}$. CIDR prefix $= 32 - H$.\n3. **Sequential Non-Overlapping Allocation**: Start at base network address `.0`. For each subnet, set the next Network ID equal to the previous subnet\'s Broadcast ID $+ 1$.\n4. **Verify Boundaries**: Ensure each Network ID is evenly divisible by its block size $2^H$.',
      components: [
        {
          name: 'Descending Allocation Order',
          detail: 'Sort requirements from largest to smallest before allocating to prevent fragmentation.',
        },
        {
          name: 'Block Size Alignment (2^H)',
          detail: 'Subnet Network IDs must align to exact multiples of their mathematical block size.',
        },
        {
          name: 'Point-to-Point WAN Subnets (/30)',
          detail: 'Mask 255.255.255.252 provides exactly 2 usable IPs for serial/router links.',
        },
        {
          name: 'Zero-Overlap Verification',
          detail: 'Validate that no subnet IP range (Network to Broadcast) overlaps any other assigned block.',
        },
        {
          name: 'Unallocated Reserve Space',
          detail: 'Leaves contiguous pristine blocks at the end of the address space for future expansion.',
        },
      ],
      howItWorks: [
        {
          stepNumber: 1,
          title: 'Requirement Sizing & Sorting',
          action: 'Determine host requirements for all departments and sort in descending order: Engineering (60), Sales (25), Admin (10), WAN-1 (2), WAN-2 (2).',
        },
        {
          stepNumber: 2,
          title: 'Prefix Mask Selection',
          action: 'Map each host requirement to smallest sufficient 2^H - 2 capacity: 60 -> /26 (62 hosts), 25 -> /27 (30 hosts), 10 -> /28 (14 hosts), 2 -> /30 (2 hosts).',
        },
        {
          stepNumber: 3,
          title: 'Sequential Allocation from Base Block',
          action: 'Allocate from base 192.168.1.0/24: Subnet 1 takes 192.168.1.0/26 (.0 to .63); Subnet 2 takes 192.168.1.64/27 (.64 to .95); Subnet 3 takes 192.168.1.96/28 (.96 to .111); WAN-1 takes 192.168.1.112/30 (.112 to .115); WAN-2 takes 192.168.1.116/30 (.116 to .119).',
        },
        {
          stepNumber: 4,
          title: 'Remaining Capacity Reservation',
          action: 'Addresses 192.168.1.120 through .255 remain pristine and unfragmented for future enterprise expansion.',
        },
      ],
      visualizer: {
        type: 'VLSM_DESIGNER_ENGINE',
        title: 'Interactive VLSM Multi-Department Address Planner',
        description: 'Input custom department host counts to automatically calculate descending VLSM allocations, visual block partitioning, and zero-overlap validation.',
      },
      workedExample: {
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
      practice: [
        {
          id: 1,
          prompt: 'What is the Golden Rule of VLSM subnet allocation order?',
          expected: 'Always sort host requirements and allocate subnets in descending order from largest to smallest.',
          hints: 'Largest to smallest.',
        },
        {
          id: 2,
          prompt: 'What CIDR prefix mask and block size is standard for a 2-host point-to-point WAN router link?',
          expected: '/30 (mask 255.255.255.252) with block size 4 (2 usable hosts).',
          hints: '/30 provides 2 usable hosts.',
        },
        {
          id: 3,
          prompt: 'Why must a /26 subnet (block size 64) only start at .0, .64, .128, or .192?',
          expected: 'Because a subnet Network ID must always align on an exact mathematical multiple of its block size ($2^H$).',
          hints: 'Multiples of block size 64.',
        },
        {
          id: 4,
          prompt: 'What CIDR prefix is required to support a department with 28 host computers?',
          expected: '/27 (provides 2^5 - 2 = 30 usable host addresses).',
          hints: '2^5 - 2 = 30 hosts.',
        },
        {
          id: 5,
          prompt: 'If Subnet 1 is 192.168.1.0/26, what is the next available Network ID for Subnet 2?',
          expected: '192.168.1.64 (since Subnet 1 broadcast ID is .63).',
          hints: '.63 + 1 = .64.',
        },
        {
          id: 6,
          prompt: 'What error occurs if a network administrator attempts to configure overlapping subnets on router interfaces?',
          expected: 'The router operating system rejects the configuration with an "overlapping subnet" error.',
          hints: 'Routers reject overlapping IP subnets.',
        },
      ],
      recap: [
        'VLSM allows subnets of different sizes to be carved out of the same major network block.',
        'Golden Rule: Always allocate from largest host requirement to smallest.',
        'Subnet boundaries must always align with mathematical multiples of their block size ($2^H$).',
        '/30 prefix (mask 255.255.255.252) is standard for point-to-point router WAN links.',
        'Unallocated address space remains pristine and contiguous at the end of the address block.',
      ],
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
        explanation:
          'The fundamental rule of VLSM is to allocate from Largest to Smallest. Subnets can only start on boundaries that are multiples of their block size. Allocating small subnets first fragments the address space and makes it impossible to align larger blocks.',
        explanationsJson: {
          1: 'Allocating small subnets first causes address fragmentation and overlap errors.',
          2: 'Department function does not dictate mathematical parity.',
          3: 'Using the same mask for all departments is FLSM, not VLSM.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'VLSM Largest-to-Smallest Allocation Rule',
      },
      {
        text: 'Which CIDR prefix length and subnet mask is standard for a 2-host point-to-point WAN router serial link?',
        options: [
          '/30 (Subnet Mask: 255.255.255.252, Block size: 4, Usable hosts: 2)',
          '/28 (Subnet Mask: 255.255.255.240, Block size: 16, Usable hosts: 14)',
          '/24 (Subnet Mask: 255.255.255.0, Block size: 256, Usable hosts: 254)',
          '/31 (Subnet Mask: 255.255.255.254, Block size: 2, Usable hosts: 0)',
        ],
        correctOption: 0,
        explanation:
          'A `/30` prefix uses 2 host bits ($2^2 = 4$ addresses), providing exactly $4 - 2 = 2$ usable host IPs (one for each router interface) with zero address waste.',
        explanationsJson: {
          1: '/28 wastes 12 host IPs on a 2-router link.',
          2: '/24 wastes 252 host IPs on a 2-router link.',
          3: 'Traditional /31 leaves no standard network/broadcast IDs (unless RFC 3021 is explicitly supported).',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: '/30 Point-to-Point WAN Subnets',
      },
      {
        text: 'A network designer allocates `192.168.1.0/26` to Department A. What is the valid Network ID, Usable Host Range, and Broadcast ID for this subnet?',
        options: [
          'Network ID: 192.168.1.0, Usable: 192.168.1.1 – 192.168.1.62, Broadcast: 192.168.1.63',
          'Network ID: 192.168.1.0, Usable: 192.168.1.0 – 192.168.1.63, Broadcast: 192.168.1.64',
          'Network ID: 192.168.1.1, Usable: 192.168.1.2 – 192.168.1.62, Broadcast: 192.168.1.63',
          'Network ID: 192.168.1.0, Usable: 192.168.1.1 – 192.168.1.254, Broadcast: 192.168.1.255',
        ],
        correctOption: 0,
        explanation:
          'A `/26` subnet has a block size of 64 ($2^6$). Range: Network ID is `.0`, first usable is `.1`, last usable is `.62`, and broadcast ID is `.63`.',
        explanationsJson: {
          1: '.0 is the Network ID and cannot be assigned to a host.',
          2: 'Network ID must be .0, not .1.',
          3: 'That is a /24 subnet range, not a /26.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: '/26 Subnet Boundary Math',
      },
      {
        text: 'Following the allocation of `192.168.1.0/26` (.0 to .63), Department B requires 25 host addresses. What is the appropriate CIDR prefix and resulting subnet range for Department B?',
        options: [
          '`192.168.1.64/27` (Network: .64, Usable: .65 – .94, Broadcast: .95)',
          '`192.168.1.64/26` (Network: .64, Usable: .65 – .126, Broadcast: .127)',
          '`192.168.1.32/27` (Network: .32, Usable: .33 – .62, Broadcast: .63)',
          '`192.168.1.64/28` (Network: .64, Usable: .65 – .78, Broadcast: .79)',
        ],
        correctOption: 0,
        explanation:
          '25 hosts requires a `/27` ($2^5 - 2 = 30$ hosts, block size 32). Starting at the next boundary (`.64`), the subnet spans `.64` to `.95` (usable `.65` to `.94`).',
        explanationsJson: {
          1: '/26 provides 62 hosts, which is unnecessarily large for 25 hosts.',
          2: '.32 overlaps with Department A (.0 to .63).',
          3: '/28 provides only 14 usable hosts, insufficient for 25 hosts.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Sequential VLSM Sizing & Block Assignment',
      },
      {
        text: 'Why does attempting to allocate a `/26` subnet starting at IP address `192.168.1.32` result in a configuration error on an enterprise router?',
        options: [
          'Because a /26 has a block size of 64 and can only legally begin on boundaries that are exact multiples of 64 (.0, .64, .128, .192)',
          'Because .32 is a reserved loopback address',
          'Because routers only support even-numbered host bits',
          'Because /26 masks can only be applied to fiber optic switchports',
        ],
        correctOption: 0,
        explanation:
          'Subnet Network IDs must align on mathematical multiples of the block size. A `/26` has block size 64, meaning valid Network IDs are exclusively `.0`, `.64`, `.128`, and `.192`. Starting at `.32` violates boundary alignment.',
        explanationsJson: {
          1: '127.0.0.0/8 is loopback, not 192.168.1.32.',
          2: 'Routers support all host bit counts from 0 to 32.',
          3: 'Subnet masks apply to all network interface types.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Subnet Block Size Boundary Alignment Rules',
      },
      {
        text: 'A network administrator attempts to assign `192.168.1.64/26` to Router Interface GigabitEthernet0/1 while `192.168.1.32/27` is already assigned to GigabitEthernet0/0. The router rejects the command. What is the root cause?',
        options: [
          'Overlapping Subnet Error: The range of the /26 (.0 to .63 is taken, so .64 to .127) overlaps with the /27 (.32 to .63), causing routing ambiguity',
          'The router interface speed is set to 10 Mbps',
          'The subnet mask length exceeds 32 bits',
          'The router memory is completely full',
        ],
        correctOption: 0,
        explanation:
          'Because the subnets overlap, the router cannot determine which interface to forward traffic to for overlapping addresses, triggering an overlapping subnet rejection error.',
        explanationsJson: {
          1: 'Interface link speed does not trigger IP subnet overlap errors.',
          2: 'Both /26 and /27 are standard sub-32-bit masks.',
          3: 'This is a logical routing topology error, not an out-of-memory condition.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
        questionType: QuestionType.TROUBLESHOOTING,
        concept: 'Overlapping Subnet Troubleshooting',
      },
    ],
    lab: {
      title: 'Guided Practice: IPv4 VLSM Subnet Calculation & Gateway Allocation',
      instructions:
        '1. Given the master network block 192.168.10.0/24, allocate subnets using Variable Length Subnet Masking (VLSM).\n2. Design Subnet A for 60 host endpoints (/26 prefix, 255.255.255.192).\n3. Design Subnet B for 25 host endpoints (/27 prefix, 255.255.255.224).\n4. Design Point-to-Point WAN link for 2 router endpoints (/30 prefix, 255.255.255.252).\n5. Assign first usable IP to router gateway interfaces and verify non-overlapping routing tables.',
      difficulty: CourseLevel.BEGINNER,
      estimatedMinutes: 20,
      initialTopologyJson: {
        baseNetwork: '192.168.10.0/24',
        subnets: [
          { name: 'Engineering', hostsRequired: 60, allocatedCidr: '192.168.10.0/26', gatewayIp: '192.168.10.1' },
          { name: 'Sales', hostsRequired: 25, allocatedCidr: '192.168.10.64/27', gatewayIp: '192.168.10.65' },
          { name: 'WAN Link', hostsRequired: 2, allocatedCidr: '192.168.10.96/30', gatewayIp: '192.168.10.97' },
        ],
      },
      tasks: [
        'Calculate prefix length and subnet mask for 60 hosts (/26, mask 255.255.255.192).',
        'Calculate prefix length and subnet mask for 25 hosts (/27, mask 255.255.255.224).',
        'Calculate Point-to-Point WAN link subnet (/30, mask 255.255.255.252).',
        'Assign gateway addresses and verify zero subnet overlap errors across routing tables.',
      ],
    },
  },
];

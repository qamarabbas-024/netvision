import { CourseLevel, LessonType, CognitiveLevel, QuestionType } from '@prisma/client';
import { LessonStepMetadata, LessonContentV2 } from './lesson-content.interface';

export interface BenchmarkQuestionDef {
  text: string;
  options: string[];
  correctOption: number;
  explanation: string;
  explanationsJson: Record<number, string>;
  difficulty: CourseLevel;
  cognitiveLevel: CognitiveLevel;
  questionType: QuestionType;
  concept: string;
}

export interface BenchmarkLabDef {
  title: string;
  instructions: string;
  difficulty: CourseLevel;
  estimatedMinutes: number;
  initialTopologyJson: Record<string, any>;
  tasks: string[];
}

export interface BenchmarkLessonFullDefinition {
  courseCode: string;
  slug: string;
  title: string;
  type: LessonType;
  durationMinutes: number;
  order: number;
  visualizationType?: string;
  introduction: string;
  contentV2?: LessonContentV2;
  stepMetadata?: LessonStepMetadata;
  questions: BenchmarkQuestionDef[];
  lab?: BenchmarkLabDef;
}

export const LESSONS_NET300_400: BenchmarkLessonFullDefinition[] = [
  // =========================================================================
  // BENCHMARK LESSON: NET-302 (Spanning Tree Protocol & Loop Prevention)
  // =========================================================================
  {
    courseCode: 'NET-302',
    slug: 'net-302-spanning-tree-protocol-loop-prevention',
    title: 'Spanning Tree Protocol (STP) & Layer-2 Loop Prevention',
    type: LessonType.THEORY,
    durationMinutes: 35,
    order: 1,
    visualizationType: 'STP_TOPOLOGY_ENGINE',
    introduction:
      'Master IEEE 802.1D Spanning Tree Protocol (STP), Bridge ID calculations, Root Bridge elections, Root & Designated Port selections, and sub-second RSTP failure reconvergence.',
    contentV2: {
      objective:
        'Understand why redundant Layer-2 switching topologies cause catastrophic broadcast storms, how STP elects a single Root Bridge via BPDUs, and how port roles (Root, Designated, Blocked) guarantee loop-free forwarding with automatic failover.',
      prerequisites: [
        'NET-201: Layer 2 Ethernet Frames & MAC Address Tables',
        'NET-301: Enterprise Switching, VLANs & 802.1Q Trunks',
      ],
      whyItMatters:
        'Unlike Layer-3 IPv4 packets which have a Time-To-Live (TTL) header field to terminate routing loops, Ethernet Layer-2 frames have NO TTL field. A single broadcast frame inside a redundant multi-switch loop will circulate infinitely, causing exponential frame amplification (Broadcast Storm), CPU saturation (100%), and complete network outage within seconds.',
      explanation:
        'The Spanning Tree Protocol (IEEE 802.1D / IEEE 802.1w RSTP) dynamically builds a loop-free logical topology (a spanning tree) across redundant Layer 2 networks by placing redundant switch ports into a non-forwarding (Blocking/Discarding) state while keeping them ready to unblock immediately if an active link fails.\n\n### 1. The Bridge ID & Root Bridge Election\nEvery switch has an 8-byte **Bridge Identifier (BID)**:\n* **Bridge Priority (2 Bytes)**: Default `32768` (configurable in increments of `4096`).\n* **Extended System ID (12 bits)**: Encodes the VLAN ID (e.g. VLAN 1 adds 1 -> Priority 32769).\n* **Base MAC Address (6 Bytes)**: Physical hardware address of the switch supervisor.\n\n**The Election Rule**: The switch with the lowest numerical Bridge ID is elected **Root Bridge** for the Spanning Tree instance. All active switchports on the Root Bridge become **Designated Ports (Forwarding)**.\n\n### 2. Spanning Tree Port Role Hierarchy\n1. **Root Port (RP)**: Exactly one port per non-root switch that has the lowest cumulative **Root Path Cost** to reach the Root Bridge.\n2. **Designated Port (DP)**: Exactly one port per network segment (link between two switches) that forwards traffic with the lowest advertised path cost toward the Root Bridge.\n3. **Alternate / Blocked Port (BLK)**: All remaining ports that are neither Root Ports nor Designated Ports. They discard user payload traffic but continuously listen for incoming BPDUs.\n\n### 3. Path Cost Standards & Timers\n* **Path Costs**: 10 Gbps = `2`, 1 Gbps = `4`, 100 Mbps = `19`, 10 Mbps = `100`.\n* **802.1D Classic Timers**: Hello = 2s, Max Age = 20s, Forward Delay = 15s (Listening 15s + Learning 15s = 30 to 50 seconds total convergence).\n* **Rapid STP (802.1w RSTP)**: Eliminates timer delays using explicit proposal-agreement handshakes, converging in under 1 second.',
      components: [
        {
          name: 'Root Bridge (RB)',
          detail: 'The logical center of the spanning tree. All active ports on Root Bridge are Designated Ports (Forwarding).',
        },
        {
          name: 'Root Port (RP)',
          detail: 'Exactly one port per non-root switch with the lowest cumulative path cost to the Root Bridge.',
        },
        {
          name: 'Designated Port (DP)',
          detail: 'The single forwarding port per link segment with the lowest advertised path cost to root.',
        },
        {
          name: 'Alternate / Blocked Port (BLK)',
          detail: 'Redundant port placed in non-forwarding state to eliminate physical Layer 2 loops.',
        },
        {
          name: 'Bridge Protocol Data Unit (BPDU)',
          detail: '2-second multicast frame (01:80:C2:00:00:00) exchanging Bridge IDs, Root Path Costs, and timers.',
        },
      ],
      howItWorks: [
        {
          stepNumber: 1,
          title: 'Root Bridge Election',
          action: 'All switches exchange Configuration BPDUs. The switch with lowest Bridge Priority (default 32768) + Lowest MAC is elected Root Bridge.',
        },
        {
          stepNumber: 2,
          title: 'Root Port (RP) Selection',
          action: 'Each non-root switch selects the single interface with lowest cumulative Root Path Cost (10G=2, 1G=4, 100M=19).',
        },
        {
          stepNumber: 3,
          title: 'Designated Port (DP) Election',
          action: 'For each link segment, the switch with lowest path cost to the root bridge designates its connected port as Forwarding.',
        },
        {
          stepNumber: 4,
          title: 'Loop-Breaking Port Blocking',
          action: 'All remaining ports transition to Blocking (Discarding) state to eliminate physical loops while maintaining standby readiness.',
        },
      ],
      packetHeaderView: {
        protocol: 'IEEE 802.1D Bridge Protocol Data Unit (BPDU)',
        fields: [
          { fieldName: 'Protocol Identifier', bitLength: '16 bits (2 Bytes)', hexSample: '0x0000', description: 'Identifies IEEE 802.1D Spanning Tree Protocol.' },
          { fieldName: 'BPDU Type', bitLength: '8 bits (1 Byte)', hexSample: '0x00', description: '0x00 = Configuration BPDU; 0x80 = Topology Change Notification (TCN).' },
          { fieldName: 'Root Bridge Identifier', bitLength: '64 bits (8 Bytes)', hexSample: '0x1000 001A.2B3C.4D02', description: 'Priority (4096) + System ID Extension + MAC address of current Root.' },
          { fieldName: 'Root Path Cost', bitLength: '32 bits (4 Bytes)', hexSample: '0x00000004', description: 'Cumulative path cost to root bridge (Cost 4 for 1 Gbps link).' },
          { fieldName: 'Sender Bridge Identifier', bitLength: '64 bits (8 Bytes)', hexSample: '0x8000 001A.2B3C.4D01', description: 'Priority (32768) + Base MAC of switch transmitting this BPDU.' },
          { fieldName: 'Port Identifier', bitLength: '16 bits (2 Bytes)', hexSample: '0x8001', description: 'Port Priority (128) + Port Number (e.g. GigabitEthernet0/1).' },
        ],
        headerDiagramAscii: `
+-------------------------------------------------------------------------------+
|                      IEEE 802.1D BPDU FRAME STRUCTURE                         |
+-------------------------------------------------------------------------------+
| Root BID: Priority (4096) + System ID Extension (VLAN 1) + MAC Address        |
| Root Path Cost: Cumulative metric to Root Bridge (e.g. Cost = 4)             |
| Sender BID: Priority (32768) + System ID Extension + Transmitting MAC         |
| Port ID: Port Priority (128) + Port Number (e.g. Gi0/1)                       |
| Timers: Message Age (0) | Max Age (20s) | Hello Time (2s) | Forward Delay(15s)|
+-------------------------------------------------------------------------------+
`,
      },
      visualizer: {
        type: 'STP_TOPOLOGY_ENGINE',
        title: 'Interactive 3-Switch Ring Topology Loop-Breaking State Machine',
        description: 'In a 3-switch triangle ring (SW-A, SW-B, SW-C), SW-B with Bridge Priority 4096 is elected Root Bridge. SW-C places its port facing SW-A into Alternate/Blocking (BLK) state, cutting the loop while keeping an instant standby path if the link between SW-B and SW-C fails.',
      },
      workedExample: {
        title: 'Calculating Root Bridge, Path Costs, and Blocked Ports in a 3-Switch Enterprise Ring',
        problemStatement: 'Three switches SW-1 (Priority 32768, MAC 00:01), SW-2 (Priority 4096, MAC 00:02), and SW-3 (Priority 32768, MAC 00:03) are connected via 1 Gbps links (Cost = 4). Determine: (1) Root Bridge, (2) Root Ports on SW-1 and SW-3, (3) Blocked port on the segment between SW-1 and SW-3.',
        stepByStepSolution: [
          'Step 1: Compare Bridge IDs (Priority + MAC). SW-2 has Priority 4096, which is lower than 32768. SW-2 is unanimously elected Root Bridge.',
          'Step 2: Calculate Root Path Costs for SW-1 and SW-3. SW-1 direct link to SW-2 = Cost 4. SW-3 direct link to SW-2 = Cost 4. Both direct ports become Root Ports (RP).',
          'Step 3: Evaluate the link between SW-1 and SW-3. Both switches advertise Root Path Cost = 4. The tie-breaker is Lowest Sender Bridge ID.',
          'Step 4: Compare SW-1 (32768.00:01) vs SW-3 (32768.00:03). SW-1 has a lower MAC address (00:01 < 00:03).',
          'Step 5: SW-1 wins Designated Port (DP) on the link. SW-3 loses and places its port facing SW-1 into Alternate/Blocking (BLK) state.',
        ],
        finalResult: 'Root Bridge: SW-2. Root Ports: SW-1(Gi0/1) & SW-3(Gi0/2). Blocked Port: SW-3(Gi0/1).',
      },
      practice: [
        {
          id: 1,
          prompt: 'What criteria determines which switch is elected Root Bridge in standard IEEE 802.1D STP?',
          expected: 'The switch with the lowest numerical Bridge ID (Bridge Priority + Base MAC Address).',
          hints: 'Lowest Bridge ID wins.',
        },
        {
          id: 2,
          prompt: 'Why do Layer 2 switching loops cause infinite broadcast storms while Layer 3 routing loops terminate?',
          expected: 'Ethernet Layer 2 frame headers lack a Time-To-Live (TTL) field, allowing looped frames to circulate indefinitely.',
          hints: 'Ethernet frames have no TTL.',
        },
        {
          id: 3,
          prompt: 'What is the default STP Bridge Priority and in what increment must it be configured?',
          expected: 'Default is 32768; it must be configured in increments of 4096.',
          hints: 'Default 32768, increments of 4096.',
        },
        {
          id: 4,
          prompt: 'What are the default STP Path Costs for 10G, 1G, 100M, and 10M links under IEEE standards?',
          expected: '10 Gbps = 2, 1 Gbps = 4, 100 Mbps = 19, 10 Mbps = 100.',
          hints: '10G=2, 1G=4, 100M=19, 10M=100.',
        },
        {
          id: 5,
          prompt: 'What security feature immediately disables an edge port if an unexpected BPDU is received from a rogue switch?',
          expected: 'BPDU Guard.',
          hints: 'BPDU Guard shuts down edge ports upon receiving BPDUs.',
        },
        {
          id: 6,
          prompt: 'What feature allows edge ports connected to client PCs to bypass the 30-second Listening/Learning timer and transition immediately to Forwarding?',
          expected: 'STP PortFast (Cisco) / Edge Port (IEEE 802.1w).',
          hints: 'PortFast transitions edge ports to forwarding immediately.',
        },
      ],
      recap: [
        'Ethernet lacks TTL, making Layer-2 loop prevention mandatory.',
        'STP elects a single Root Bridge per broadcast domain using the lowest numeric Bridge ID.',
        'Non-root switches elect one Root Port with the lowest cumulative path cost to the root.',
        'BPDU Guard and Root Guard protect STP topology from unauthorized rogue switches.',
        'PortFast bypasses Listening/Learning delays on access edge ports connected to client PCs.',
      ],
    },
    questions: [
      {
        text: 'What criteria determines which switch is elected as the Root Bridge in standard IEEE 802.1D Spanning Tree Protocol?',
        options: [
          'The switch with the lowest Bridge ID (composed of Bridge Priority + MAC Address)',
          'The switch with the highest IP address',
          'The switch with the largest number of connected gigabit ports',
          'The switch that has been powered on the longest',
        ],
        correctOption: 0,
        explanation:
          'The Root Bridge election selects the switch with the lowest Bridge ID (BID). BID consists of a 2-byte Priority (default 32768) and the 6-byte base MAC address. Lowest priority wins; ties broken by lowest MAC.',
        explanationsJson: {
          1: 'STP operates at Layer 2 and does not evaluate Layer 3 IP addresses during Root election.',
          2: 'Port count does not determine Root Bridge eligibility.',
          3: 'Uptime does not override the Bridge ID election criteria.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Root Bridge Election Criteria',
      },
      {
        text: 'Three switches (Switch A: MAC 00:11:22:33:44:55, Switch B: MAC 00:22:33:44:55:66, Switch C: MAC 00:33:44:55:66:77) all have the default Bridge Priority of 32768. Which switch becomes the Root Bridge?',
        options: [
          'Switch A (lowest MAC address 00:11:22:33:44:55)',
          'Switch C (highest MAC address 00:33:44:55:66:77)',
          'Switch B (median MAC address)',
          'None; a tie prevents any switch from becoming root',
        ],
        correctOption: 0,
        explanation:
          'Because all three switches share the identical default priority (32768), the tie-breaker is the lowest numerical MAC address. Switch A has the lowest MAC and wins the election.',
        explanationsJson: {
          1: 'STP elects the LOWEST MAC, not the highest.',
          2: 'Median MAC has no priority in STP algorithms.',
          3: 'Ties are always broken deterministically by MAC address.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.SCENARIO,
        concept: 'STP Root Bridge Tie-Breaking',
      },
      {
        text: 'What is the role of a "Root Port" on a non-root switch in Spanning Tree topology?',
        options: [
          'The single port on that non-root switch that has the lowest cumulative path cost to reach the Root Bridge',
          'The port that connects directly to the Internet service provider',
          'The port that blocks all user data frames to prevent loops',
          'A port that forwards only broadcast frames',
        ],
        correctOption: 0,
        explanation:
          'Every non-root switch must select exactly one Root Port—the port with the lowest cumulative Spanning Tree path cost to the Root Bridge. Root Ports forward traffic.',
        explanationsJson: {
          1: 'Root Ports lead to the internal Root Bridge, not external ISPs.',
          2: 'Ports that block traffic are Alternate/Backup (Blocking) ports, not Root Ports.',
          3: 'Root Ports forward all valid unicast, multicast, and broadcast data frames.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'STP Root Port Selection',
      },
      {
        text: 'A rogue switch is plugged into an edge user port and begins transmitting BPDUs with Priority 0, attempting to become the Root Bridge. Which STP security feature prevents this hijacking?',
        options: [
          'BPDU Guard and Root Guard',
          'DHCP Snooping',
          'Dynamic ARP Inspection (DAI)',
          'Port Mirroring (SPAN)',
        ],
        correctOption: 0,
        explanation:
          'BPDU Guard disables edge ports that receive unexpected BPDUs. Root Guard enforces that a designated port cannot become a root port, placing it into a root-inconsistent state if superior BPDUs are received.',
        explanationsJson: {
          1: 'DHCP Snooping validates DHCP server messages, not STP BPDUs.',
          2: 'DAI inspects ARP packets to prevent ARP spoofing.',
          3: 'Port Mirroring copies traffic for analysis; it does not protect STP topology.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
        questionType: QuestionType.TROUBLESHOOTING,
        concept: 'BPDU Guard and Root Guard Security',
      },
      {
        text: 'What are the port states in classic IEEE 802.1D STP, and what is the total default convergence time from Blocking to Forwarding?',
        options: [
          'Blocking -> Listening (15s) -> Learning (15s) -> Forwarding; Total convergence time = 30 to 50 seconds',
          'Discarding -> Forwarding; Total convergence time = 1 second',
          'Listening -> Forwarding; Total convergence time = 5 seconds',
          'Disabled -> Forwarding; Total convergence time = 0 seconds',
        ],
        correctOption: 0,
        explanation:
          'Classic 802.1D transitions through: Blocking (Max Age 20s if link fails) -> Listening (15s Forward Delay) -> Learning (15s Forward Delay) -> Forwarding, totaling 30 to 50 seconds to converge.',
        explanationsJson: {
          1: 'Discarding -> Learning -> Forwarding describes Rapid STP (802.1w), which converges in sub-seconds.',
          2: 'Classic 802.1D requires both Listening and Learning states (15s each = 30s min).',
          3: '0 seconds transition without PortFast causes immediate temporary Layer 2 loops.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: '802.1D STP Convergence Timers',
      },
      {
        text: 'An administrator wants edge access ports connected directly to end-user workstations to transition immediately to the Forwarding state without waiting 30 seconds for STP listening/learning timers. Which feature must be enabled?',
        options: [
          'STP PortFast (Cisco) / Edge Port (IEEE 802.1w)',
          'Static Routing 0.0.0.0/0',
          'Dynamic Trunking Protocol (DTP)',
          'NAT Overload',
        ],
        correctOption: 0,
        explanation:
          'PortFast immediately transitions an access port from blocking to forwarding, bypassing listening and learning states so DHCP requests from booting PCs do not time out. It should only be enabled on ports connected to end hosts.',
        explanationsJson: {
          1: 'Static routing is a Layer 3 routing configuration, unrelated to Layer 2 switch port STP transitions.',
          2: 'DTP negotiates trunking between switches, it does not bypass STP timers.',
          3: 'NAT overload translates IP addresses on routers, not switch port STP states.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'STP PortFast Operation',
      },
    ],
    lab: {
      title: 'Guided Practice: Enterprise Layer-2 Redundant Topology Loop Prevention',
      instructions: '1. Inspect the 3-switch redundant ring topology.\n2. Execute `show spanning-tree` to identify the Root Bridge.',
      difficulty: CourseLevel.INTERMEDIATE,
      estimatedMinutes: 20,
      initialTopologyJson: { switches: [{ id: 'SW-A', priority: 32768 }, { id: 'SW-B', priority: 4096, isRoot: true }] },
      tasks: ['Execute `show spanning-tree` to inspect Bridge IDs.'],
    },
  },

  // =========================================================================
  // BENCHMARK LESSON: NET-304 (Single-Area OSPF & Link-State Routing)
  // =========================================================================
  {
    courseCode: 'NET-304',
    slug: 'net-304-single-area-ospf-routing',
    title: 'Dynamic Routing Protocols & Single-Area OSPF',
    type: LessonType.THEORY,
    durationMinutes: 40,
    order: 1,
    visualizationType: 'OSPF_TOPOLOGY_SIMULATION',
    introduction:
      'Master Open Shortest Path First (OSPFv2 RFC 2328), Link-State Database (LSDB) synchronization, Dijkstra SPF algorithm calculations, 7-state neighbor adjacencies, DR/BDR elections, and dynamic failure reconvergence.',
    contentV2: {
      objective:
        'Understand how OSPF link-state routing protocols construct identical Link-State Databases (LSDBs) across an autonomous system, how Dijkstra’s Shortest Path First (SPF) algorithm computes loop-free routes, and how 7-state neighbor finite state machines establish robust dynamic adjacencies.',
      prerequisites: ['net-202-ipv4-addressing-cidr', 'net-303-routing-fundamentals-overview'],
      whyItMatters:
        'Static routing requires manual administrative updates whenever network topology changes occur. OSPF automatically detects link transitions within milliseconds, floods Type-1 LSAs, and executes Dijkstra’s algorithm to calculate alternate loop-free paths.',
      explanation:
        'OSPF (Open Shortest Path First) is an Interior Gateway Protocol (IGP) based on Link-State technology (RFC 2328). Operating directly over IP (Protocol Number 89), every OSPF router maintains an identical map of the entire network topology in its Link-State Database (LSDB) and independently calculates the shortest path tree to all subnets using Dijkstra’s algorithm.\n\n### 1. Router ID (RID) Selection\nEvery OSPF router requires a unique 32-bit Router ID:\n1. Manually configured via `router-id <x.x.x.x>` (highest precedence).\n2. Highest IPv4 address among active **Loopback interfaces**.\n3. Highest IPv4 address among active **Physical interfaces**.\n\n### 2. The 7-State Neighbor Finite State Machine\n1. **DOWN**: No Hello packets received.\n2. **INIT**: Hello received, but sender\'s own RID not listed in neighbor list.\n3. **2-WAY**: Bidirectional communication established (DR/BDR election occurs here).\n4. **EXSTART**: Master/Slave relationship and Initial Sequence Numbers negotiated.\n5. **EXCHANGE**: Database Description (DBD) summary packets exchanged.\n6. **LOADING**: Link-State Requests (LSR) and Updates (LSU) synchronize missing LSAs.\n7. **FULL**: LSDB databases are 100% identical; SPF tree is calculated.\n\n### 3. DR/BDR Election on Multi-Access Segments\nOn Ethernet broadcast segments, routers elect a Designated Router (DR) and Backup Designated Router (BDR) to eliminate full-mesh adjacencies ($n(n-1)/2 \\to 2n$):\n* Highest OSPF Interface Priority (default `1`; priority `0` disqualifies).\n* Tie-breaker: Highest Router ID.\n* Non-DR routers (`DROTHER`) form FULL adjacency only with DR and BDR, sending LSUs to `224.0.0.6` (AllDRouters). The DR floods updates to all routers on `224.0.0.5` (AllSPFRouters).\n\n### 4. Cost Metric & Reference Bandwidth\n$$\\text{Cost} = \\frac{\\text{Reference Bandwidth (default } 10^8 \\text{ bps)}}{\\text{Interface Bandwidth}}$$\n* Under default reference bandwidth: 100 Mbps = 1, 1 Gbps = 1, 10 Gbps = 1.\n* Production networks require `auto-cost reference-bandwidth 100000` (or 1,000,000) to properly differentiate Gigabit and 10-Gigabit interfaces.',
      components: [
        {
          name: 'Router ID (RID)',
          detail: 'Unique 32-bit identifier in dotted-decimal format (manual config, highest loopback IP, or highest physical IP).',
        },
        {
          name: 'Area 0 (Backbone Area)',
          detail: 'The central transit area (0.0.0.0) through which all inter-area routing traffic must pass.',
        },
        {
          name: 'Designated Router (DR) & BDR',
          detail: 'Elected on multi-access Ethernet segments to minimize adjacency meshes from n*(n-1)/2 to 2n.',
        },
        {
          name: 'Link-State Database (LSDB)',
          detail: 'Identical synchronized repository of all network links and costs across the OSPF area.',
        },
        {
          name: 'Dijkstra SPF Algorithm',
          detail: 'Mathematical graph algorithm computing shortest loop-free path tree to all subnets.',
        },
      ],
      howItWorks: [
        {
          stepNumber: 1,
          title: 'Neighbor Discovery via Hello Packets',
          action: 'Routers send Hello multicasts to 224.0.0.5 every 10 seconds to discover neighbors and form 2-WAY adjacencies.',
        },
        {
          stepNumber: 2,
          title: 'DR/BDR Election',
          action: 'Routers elect DR and BDR based on highest priority and highest Router ID on multi-access LANs.',
        },
        {
          stepNumber: 3,
          title: 'LSDB Synchronization',
          action: 'Routers exchange DBD summaries, request missing LSAs via LSR, and acknowledge updates reaching FULL state.',
        },
        {
          stepNumber: 4,
          title: 'Dijkstra SPF Computation',
          action: 'Each router runs SPF on its synchronized LSDB to calculate lowest-cost paths and install them into the routing table.',
        },
      ],
      packetHeaderView: {
        protocol: 'OSPFv2 Common Packet Header',
        fields: [
          { fieldName: 'Version #', bitLength: '8 bits', hexSample: '0x02', description: 'OSPF Version 2 (IPv4).' },
          { fieldName: 'Packet Type', bitLength: '8 bits', hexSample: '0x01', description: '1=Hello, 2=DBD, 3=LSR, 4=LSU, 5=LSAck.' },
          { fieldName: 'Packet Length', bitLength: '16 bits', hexSample: '0x0030', description: 'Total length of OSPF packet.' },
          { fieldName: 'Router ID', bitLength: '32 bits', hexSample: '0x01010101', description: 'Originating router ID (1.1.1.1).' },
          { fieldName: 'Area ID', bitLength: '32 bits', hexSample: '0x00000000', description: 'Area 0 (Backbone Area).' },
          { fieldName: 'Checksum & Auth', bitLength: '32 bits', hexSample: '0x00000002', description: 'Cryptographic MD5/SHA authentication.' },
        ],
        headerDiagramAscii: `
+-------------------------------------------------------------------------------+
|                       OSPFv2 COMMON PACKET HEADER                             |
+-------------------------------------------------------------------------------+
| Version: 2 | Type: 1 (Hello) | Packet Length: 48 Bytes                        |
| Router ID: 1.1.1.1 (32-bit Dotted Decimal Identifier)                         |
| Area ID: 0.0.0.0 (Backbone Area 0)                                            |
| Checksum: 0x8F3A | Auth Type: 2 (Cryptographic MD5) | Auth Data               |
+-------------------------------------------------------------------------------+
`,
      },
      visualizer: {
        type: 'OSPF_TOPOLOGY_SIMULATION',
        title: '3-Router Multi-Access OSPF Adjacency & Dijkstra Tree',
        description: 'Visualize OSPF Hello neighbor states, DR/BDR election, and dynamic shortest path recalculation upon link failure.',
      },
      workedExample: {
        title: 'Calculating SPF Cost across Redundant Links',
        problemStatement: 'R1 connects to R2 (Cost 10) and R3 (Cost 10). R2 connects to R3 (Cost 5). R2 connects to Subnet (Cost 1). Determine optimal path.',
        stepByStepSolution: [
          'Path A (via R2): 10 + 1 = 11.',
          'Path B (via R3): 10 + 5 + 1 = 16.',
          'R1 chooses Path A with metric 11.',
        ],
        finalResult: 'Optimal path is direct via R2 with Cost 11.',
      },
      practice: [
        {
          id: 1,
          prompt: 'What routing algorithm does OSPF run on its LSDB to compute shortest loop-free paths?',
          expected: 'Dijkstra\'s Shortest Path First (SPF) algorithm.',
          hints: 'Dijkstra SPF.',
        },
        {
          id: 2,
          prompt: 'What is the order of precedence for OSPF Router ID (RID) selection?',
          expected: '1. Manually configured `router-id`; 2. Highest active Loopback IP; 3. Highest active Physical interface IP.',
          hints: 'Manual > Loopback > Physical.',
        },
        {
          id: 3,
          prompt: 'What parameters must match identically between two routers for an OSPF adjacency to reach FULL?',
          expected: 'Area ID, Subnet/Mask, Hello/Dead intervals, Authentication credentials, and Area type flags.',
          hints: 'Area, Subnet, Hello/Dead timers, Auth.',
        },
        {
          id: 4,
          prompt: 'What causes two OSPF routers to hang indefinitely in the EXSTART neighbor state?',
          expected: 'An interface IP MTU mismatch, causing the larger Database Description (DBD) packet to be dropped.',
          hints: 'MTU mismatch on interface.',
        },
        {
          id: 5,
          prompt: 'What multicast IP address do non-DR (DROTHER) routers use to send Link-State Updates to the DR/BDR?',
          expected: '224.0.0.6 (AllDRouters).',
          hints: '224.0.0.6.',
        },
        {
          id: 6,
          prompt: 'How should an engineer configure OSPF to accurately differentiate costs between 1G and 10G interfaces?',
          expected: 'Configure `auto-cost reference-bandwidth 100000` (or higher) to raise the reference bandwidth above 100 Mbps.',
          hints: 'auto-cost reference-bandwidth.',
        },
      ],
      recap: [
        'OSPF is an open standard Link-State IGP (RFC 2328) running Dijkstra SPF on synchronized LSDBs.',
        'Router ID is elected via Manual config > Highest Loopback > Highest Physical interface IP.',
        'The 7 neighbor states transition from DOWN to FULL; MTU mismatches cause EXSTART hangs.',
        'DR/BDR elections on broadcast LANs scale adjacencies; DROTHERs send updates to 224.0.0.6.',
        '`auto-cost reference-bandwidth` is mandatory on modern high-speed networks to scale link costs.',
      ],
    },
    questions: [
      {
        text: 'What routing algorithm does Open Shortest Path First (OSPF) execute to calculate the loop-free shortest path tree from its Link-State Database?',
        options: [
          'Dijkstra Shortest Path First (SPF) algorithm',
          'Bellman-Ford distance-vector algorithm',
          'Diffie-Hellman cryptographic exchange algorithm',
          'Dual-Tree Token Ring algorithm',
        ],
        correctOption: 0,
        explanation:
          'OSPF is a Link-State routing protocol that runs the Dijkstra Shortest Path First (SPF) algorithm on its synchronized Link-State Database (LSDB) to compute the lowest-cost loop-free path to every destination subnet.',
        explanationsJson: {
          1: 'Bellman-Ford is used by Distance-Vector protocols like RIP.',
          2: 'Diffie-Hellman is a cryptographic key exchange algorithm, not a routing path algorithm.',
          3: 'Dual-Tree is not a routing protocol algorithm.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Dijkstra SPF Algorithm',
      },
      {
        text: 'In OSPFv2, what criteria determines the election of a Router ID (RID) if it is NOT manually configured?',
        options: [
          'Highest IPv4 address among active Loopback interfaces; if no loopbacks exist, the highest IPv4 address among active physical interfaces',
          'Lowest MAC address on the default gateway',
          'The router with the lowest serial number',
          'The router that has the highest OSPF cost metric',
        ],
        correctOption: 0,
        explanation:
          'OSPF Router ID selection order: 1. Manually configured router-id; 2. Highest IPv4 address on any active loopback interface; 3. Highest IPv4 address on any active physical interface.',
        explanationsJson: {
          1: 'OSPF Router ID is an IPv4 address, not a Layer 2 MAC address.',
          2: 'Hardware serial numbers have no role in OSPF RID election.',
          3: 'Path cost metrics do not determine Router ID identity.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'OSPF Router ID Election Logic',
      },
      {
        text: 'What parameters MUST match identically between two neighboring routers for an OSPF adjacency to successfully reach the FULL state?',
        options: [
          'Area ID, Subnet Mask, Hello Interval, Dead Interval, and Authentication Password',
          'Router ID and Hostname',
          'Loopback IP address and Switch port number',
          'Administrative Distance and Bandwidth',
        ],
        correctOption: 0,
        explanation:
          'OSPF neighbor formation requires matching: 1. Area ID; 2. Subnet and Mask on the link; 3. Hello Interval (default 10s) and Dead Interval (default 40s); 4. Authentication credentials; 5. Area type flags (stub/NSSA).',
        explanationsJson: {
          1: 'Router IDs MUST BE UNIQUE; identical RIDs cause severe routing conflicts and duplicate RID rejection.',
          2: 'Loopback IPs are unique to each router; switch ports do not affect OSPF adjacency.',
          3: 'Administrative distance is local to each router; bandwidth can differ across interface types.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'OSPF Adjacency Requirements',
      },
      {
        text: 'Two OSPF routers connected via a gigabit Ethernet link are stuck in the EXSTART / EXCHANGE state and fail to reach FULL. What is the most common cause?',
        options: [
          'An MTU (Maximum Transmission Unit) mismatch between the two connected interfaces, causing the larger DBD packet to be dropped',
          'The routers have different hostnames',
          'The physical Ethernet cable is single-mode fiber',
          'The routers have different clock timezones',
        ],
        correctOption: 0,
        explanation:
          'During EXSTART and EXCHANGE states, routers negotiate Master/Slave roles and exchange Database Description (DBD) packets. If interface MTUs do not match, the router receiving a DBD packet larger than its MTU drops it, hanging forever in EXSTART.',
        explanationsJson: {
          1: 'Hostnames are arbitrary administrative labels and do not affect OSPF state machine convergence.',
          2: 'Physical fiber type does not cause EXSTART hangs if link-layer frames are delivering data.',
          3: 'Timezone discrepancies do not break OSPF packet exchange.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
        questionType: QuestionType.TROUBLESHOOTING,
        concept: 'OSPF MTU Mismatch & EXSTART Diagnosis',
      },
      {
        text: 'Why does OSPF elect a Designated Router (DR) and Backup Designated Router (BDR) on multi-access Ethernet segments, and what multicast address do non-DR (DROTHER) routers use to transmit LSUs to the DR/BDR?',
        options: [
          'To reduce adjacency count from n(n-1)/2 to 2n; DROTHER routers send LSUs to 224.0.0.6 (AllDRouters)',
          'To encrypt routing tables; DROTHER routers send to 224.0.0.1',
          'To provide DHCP lease addresses; DROTHER routers send to 255.255.255.255',
          'To balance CPU temperature across chassis; DROTHER routers send to 127.0.0.1',
        ],
        correctOption: 0,
        explanation:
          'On multi-access LANs (Ethernet), DR/BDR election limits full-mesh adjacencies. DROTHER routers only form full adjacency with DR and BDR, sending link updates to 224.0.0.6 (AllDRouters). The DR forwards updates to all other routers on 224.0.0.5 (AllSPFRouters).',
        explanationsJson: {
          1: '224.0.0.1 is all IPv4 subnet systems, not specific to OSPF DR/BDR communication.',
          2: 'OSPF is an IGP routing protocol, not a DHCP server allocation mechanism.',
          3: '127.0.0.1 is loopback, not multi-access router multicast.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'OSPF DR/BDR Multi-Access Optimization',
      },
      {
        text: 'What is the default reference bandwidth in classic OSPF, what is the cost of a 10 Gbps interface under that default, and how should an engineer configure OSPF to accurately differentiate between 1 Gbps, 10 Gbps, and 100 Gbps links?',
        options: [
          'Default reference bandwidth is 100 Mbps (cost = 1 for 100M, 1G, 10G); engineer must execute auto-cost reference-bandwidth 100000 (or higher) to accurately scale costs',
          'Default reference bandwidth is 10 Tbps; no adjustment is ever needed',
          'Default cost is determined strictly by ping response latency in milliseconds',
          'Reference bandwidth is permanently fixed in router ROM and cannot be adjusted',
        ],
        correctOption: 0,
        explanation:
          'OSPF calculates Cost = Reference Bandwidth / Interface Bandwidth. Classic default reference bandwidth is 100 Mbps (10^8 bps). Therefore, 100 Mbps, 1 Gbps, 10 Gbps all evaluate to Cost = 1 (integer minimum). Setting auto-cost reference-bandwidth 100000 (or 1,000,000) restores proportional metric costs for modern high-speed links.',
        explanationsJson: {
          1: 'Default is 100 Mbps, not 10 Tbps.',
          2: 'OSPF uses static bandwidth cost formulas, not dynamic ping latency.',
          3: 'Reference bandwidth is configurable via the auto-cost reference-bandwidth command.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.EXPERT_REASONING,
        questionType: QuestionType.CONFIGURATION_ANALYSIS,
        concept: 'OSPF Reference Bandwidth Scaling',
      },
    ],
    lab: {
      title: 'Guided Practice: Single-Area OSPF Troubleshooting',
      instructions: '1. Inspect OSPF neighbor states.\n2. Verify Dijkstra SPF route installation.',
      difficulty: CourseLevel.INTERMEDIATE,
      estimatedMinutes: 25,
      initialTopologyJson: { routers: [{ id: 'R1', routerId: '1.1.1.1' }, { id: 'R2', routerId: '2.2.2.2' }] },
      tasks: ['Run show ip ospf neighbor.'],
    },
  },

  // =========================================================================
  // BENCHMARK LESSON 2: NET-304 (Multi-Area OSPF Architecture & Redistribution)
  // =========================================================================
  {
    courseCode: 'NET-304',
    slug: 'net-304-multi-area-ospf-redistribution',
    title: 'Multi-Area OSPF Architecture, LSA Flooding & Route Redistribution',
    type: LessonType.THEORY,
    durationMinutes: 45,
    order: 2,
    visualizationType: 'MULTI_AREA_OSPF_ENGINE',
    introduction:
      'Scale link-state routing across enterprise networks: Hierarchical multi-area design, Area 0 Backbone transit, Area Border Routers (ABR), Autonomous System Boundary Routers (ASBR), LSA Types 1 through 5 propagation, inter-area route summarization, stub area types, and external route redistribution.',
    contentV2: {
      objective:
        'Master multi-area OSPF hierarchical design principles, explain why large networks segment into areas to contain LSDB size and SPF calculation overhead, classify LSA Types 1 through 5, configure inter-area route summarization at ABRs, and evaluate external route redistribution and metric types (E1 vs E2) at ASBRs.',
      prerequisites: ['net-304-single-area-ospf-routing', 'net-202-ipv4-addressing-cidr'],
      whyItMatters:
        'In a single-area OSPF network with hundreds of routers, a single link flap triggers SPF recalculation on every router across the autonomous system and floods thousands of LSAs. Segmenting the topology into areas limits the Link-State Database (LSDB) size and restricts SPF tree calculations strictly to the local area, ensuring high stability and rapid convergence.',
      explanation:
        'Multi-Area OSPF structures an Autonomous System (AS) into a two-level hierarchy centered around a contiguous Area 0 (Backbone Area). In standard hierarchical design, all regular non-backbone areas (e.g. Area 1, Area 2) connect directly to Area 0 to maintain a loop-free hub-and-spoke inter-area topology. Routers with all interfaces inside a single area are Internal Routers. Routers with interfaces attached to Area 0 and at least one regular area are Area Border Routers (ABRs). An ABR maintains a separate Link-State Database (LSDB) and executes an independent Dijkstra SPF calculation for each connected area. Intra-area topology details (Type 1 Router LSAs and Type 2 Network LSAs) are strictly confined to their originating area. The ABR takes subnet reachability computed from its local LSDB and originates new Type 3 Summary LSAs into adjacent areas, appearing in routing tables as Inter-Area routes (`O IA`). Autonomous System Boundary Routers (ASBRs) redistribute routes from foreign routing domains or external sources (e.g. BGP, static routes, directly connected interfaces outside OSPF) into OSPF, originating Type 5 External LSAs (`O E1` or `O E2`) that flood across all standard non-stub areas. Because routers in other areas lack the ASBR’s Type 1 LSA, the ABR originates Type 4 ASBR Summary LSAs into those areas to advertise the intra-area metric cost to reach the ASBR Router ID. Route summarization at the ABR (`area <id> range <prefix> <mask>`) aggregates multiple specific subnets into a single Type 3 Summary LSA, reducing LSDB memory and shielding downstream areas from local link flaps.',
      components: [
        { name: 'Area 0 (Backbone Transit Area)', detail: 'The central transit backbone (0.0.0.0). In standard design, all inter-area traffic passes through Area 0 to prevent inter-area routing loops.' },
        { name: 'Area Border Router (ABR)', detail: 'Router with interfaces in Area 0 and one or more regular areas. Maintains independent LSDBs per area and originates Type 3 and Type 4 Summary LSAs.' },
        { name: 'Autonomous System Boundary Router (ASBR)', detail: 'Router running OSPF that redistributes routes from external routing sources or foreign domains (BGP, Static, RIP) into OSPF via Type 5 LSAs.' },
        { name: 'Type 1: Router LSA', detail: 'Originated by every router within its area; describes attached links, interface IPs, and neighbor link costs. Flooding scope is strictly Area-Local.' },
        { name: 'Type 2: Network LSA', detail: 'Originated by the Designated Router (DR) on multi-access transit broadcast links. Lists attached routers. Flooding scope is strictly Area-Local.' },
        { name: 'Type 3: Summary LSA', detail: 'Originated by ABRs to advertise reachable internal subnets into neighboring areas. Installed by recipient routers as Inter-Area (O IA) routes.' },
        { name: 'Type 4: ASBR Summary LSA', detail: 'Originated by ABRs into non-ASBR areas to advertise the metric cost to reach the ASBR Router ID, enabling routers in other areas to reach the ASBR.' },
        { name: 'Type 5: AS External LSA', detail: 'Originated by ASBRs to advertise external redistributed routes; flooded across all standard (normal) OSPF areas (blocked in stub and NSSA areas).' },
        { name: 'Route Summarization', detail: 'Configured on ABRs (area range) to aggregate internal subnets into one Type 3 LSA, or on ASBRs (summary-address) for external Type 5 LSAs.' },
        { name: 'External Metric Types (E1 vs E2)', detail: 'E2 (default) maintains a constant external seed metric (default 20); E1 dynamically adds the internal OSPF path cost to the seed metric.' },
      ],
      howItWorks: [
        { stepNumber: 1, title: 'Intra-Area Link-State Flooding', action: 'Routers in Area 1 flood Type 1 and Type 2 LSAs. Every router in Area 1 builds an identical Area 1 LSDB and runs Dijkstra SPF to calculate intra-area shortest paths.' },
        { stepNumber: 2, title: 'ABR Inter-Area LSA Origination', action: 'ABR-1 calculates shortest paths to Area 1 subnets, then originates new Type 3 Summary LSAs into Area 0 (Backbone) advertising prefix reachability and metric cost.' },
        { stepNumber: 3, title: 'Backbone Transit & Re-Advertisement', action: 'ABR-2 in Area 0 receives the Type 3 Summary LSAs, installs O IA routes into its routing table, and originates corresponding Type 3 LSAs into Area 2.' },
        { stepNumber: 4, title: 'ASBR External Redistribution & Type 4 LSAs', action: 'ASBR-1 redistributes external BGP/Static routes into Area 0 via Type 5 External LSAs. ABR-1 and ABR-2 originate Type 4 LSAs into their non-backbone areas to advertise the path to ASBR-1.' },
      ],
      visualizer: {
        type: 'MULTI_AREA_OSPF_ENGINE',
        title: 'Interactive Multi-Area OSPF Topology, LSA Inspector & Summarization Engine',
        description: 'Explore multi-area topology spanning Area 0, Area 1, and Area 2, inspect LSA Types 1 through 5 flooding scopes and originators, toggle ABR route summarization, and compare E1 vs E2 redistribution metrics.',
      },
      workedExample: {
        title: 'Calculating Inter-Area and External Path Costs across ABR and ASBR',
        problemStatement:
          'Router R1 in Area 1 needs to route packets to Server Subnet 10.2.2.0/24 in Area 2. Path costs: R1 -> ABR1 (Cost 10), ABR1 -> ABR2 across Area 0 (Cost 5), ABR2 -> R2 (Cost 10). Additionally, ASBR in Area 0 redistributes 172.16.0.0/12 with seed metric 20 (E1 vs E2). Determine the routing table entry on R1.',
        stepByStepSolution: [
          'Step 1 (Inter-Area Cost to 10.2.2.0/24): Sum intra-area cost (10) + backbone transit cost (5) + destination area cost (10) = Total Cost 25. Route installed as O IA 10.2.2.0/24 [110/25].',
          'Step 2 (External E2 Route to 172.16.0.0/12): Metric Type 2 ignores internal path cost and displays only the seed metric: O E2 172.16.0.0/12 [110/20].',
          'Step 3 (External E1 Route to 172.16.0.0/12): Metric Type 1 adds internal path cost (R1 -> ABR1 -> ASBR = 10 + 5 = 15) to seed metric 20: O E1 172.16.0.0/12 [110/35].',
        ],
        finalResult:
          'Inter-area route is O IA 10.2.2.0/24 [110/25]. External route is O E2 172.16.0.0/12 [110/20] (or [110/35] under E1).',
      },
      troubleshooting: [
        {
          symptom: 'Area 1 routers cannot reach subnets in Area 2.',
          possibleCauses: ['Area 1 not connected to Area 0', 'ABR not originating Type 3 Summary LSAs'],
          diagnosticSteps: ['Check `show ip ospf database summary` on ABR', 'Verify Area 0 interface is UP'],
          remediation: 'Ensure ABR has active interfaces in Area 0 and Area 1.',
        },
      ],
      recap: [
        'Multi-Area OSPF uses a two-tier hierarchy centered around a contiguous Area 0 Backbone to contain LSDB size and isolate local SPF calculations.',
        'ABRs connect regular areas to Area 0, originating Type 3 Summary LSAs (O IA) to advertise inter-area network reachability.',
        'ASBRs inject external routes into standard areas via Type 5 LSAs (O E1/O E2), while ABRs originate Type 4 LSAs enabling other areas to locate the ASBR.',
        'Route summarization on ABRs (area range) aggregates subnets into a single Type 3 LSA, reducing memory and dampening flap churn.',
      ],
    },
    questions: [
      {
        text: 'In a hierarchical Multi-Area OSPF network, which type of Link-State Advertisement (LSA) is generated by an Area Border Router (ABR) to advertise subnets from one area into other areas?',
        options: [
          'Type 3 Summary LSA',
          'Type 1 Router LSA',
          'Type 2 Network LSA',
          'Type 5 AS External LSA',
        ],
        correctOption: 0,
        explanation: 'Type 3 Summary LSAs are generated by ABRs to advertise reachability of inter-area networks into adjacent areas, appearing in routing tables as `O IA` routes.',
        explanationsJson: {
          1: 'Incorrect: Type 1 Router LSAs are flooded strictly within their local originating area and never cross an ABR boundary.',
          2: 'Incorrect: Type 2 Network LSAs are generated by DRs on multi-access networks and remain local to the area.',
          3: 'Incorrect: Type 5 External LSAs are originated by ASBRs, not ABRs for internal subnets.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'OSPF LSA Type 3 Summary Function',
      },
      {
        text: 'Why does OSPF require all non-backbone areas (e.g. Area 1, Area 2) to connect directly to the Area 0 Backbone transit area?',
        options: [
          'To enforce a loop-free hub-and-spoke inter-area topology and prevent distance-vector routing loops between areas.',
          'Because OSPF routers cannot calculate Dijkstra SPF trees without at least two physical cables connected to the server room.',
          'To ensure all user packets are copied to the default gateway before being encrypted by STP.',
          'Because non-backbone areas are prohibited from using IP addresses higher than 192.168.1.1.',
        ],
        correctOption: 0,
        explanation: 'Because inter-area routing between ABRs operates like a distance-vector protocol (exchanging summary prefix reachability rather than full topology trees), forcing all inter-area traffic through Area 0 guarantees a loop-free star topology.',
        explanationsJson: {
          1: 'Incorrect: SPF calculation is fully supported on point-to-point and single-link connections.',
          2: 'Incorrect: STP is Layer 2 switching and does not perform packet encryption.',
          3: 'Incorrect: Any valid IPv4 address space can be used in any OSPF area.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'OSPF Area 0 Backbone Hierarchy & Loop Prevention',
      },
      {
        text: 'An Autonomous System Boundary Router (ASBR) redistributes external routes into OSPF. An engineer wants downstream branch routers to select the path that considers the total cumulative cost (seed metric plus internal OSPF link costs) rather than a fixed cost. Which metric type should be configured?',
        options: [
          'Metric Type 1 (E1)',
          'Metric Type 2 (E2)',
          'Administrative Distance 110 Static',
          'Type 4 ASBR Summary Cost',
        ],
        correctOption: 0,
        explanation: 'OSPF Metric Type 1 (E1) calculates the total path cost as the sum of the external seed metric plus all internal OSPF interface metrics along the path to the ASBR. Metric Type 2 (E2, the default) considers only the external seed metric.',
        explanationsJson: {
          1: 'Incorrect: E2 uses a fixed cost equal to the seed metric (default 20) regardless of internal path length.',
          2: 'Incorrect: Administrative distance determines route preference across different protocols, not OSPF metric summation.',
          3: 'Incorrect: Type 4 LSAs locate the ASBR; they do not control the external route metric type.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'OSPF External Redistribution Metric Types (E1 vs E2)',
      },
      {
        text: 'Troubleshooting: An enterprise network has Area 10 (subnets 10.10.1.0/24 through 10.10.4.0/24) connected to ABR-1. Whenever a link in Area 10 flaps, routers across the entire company in Area 0 and Area 2 suffer high CPU spikes and routing table instability. What architectural optimization solves this issue?',
        options: [
          'Configure inter-area route summarization on ABR-1 using `area 10 range 10.10.0.0 255.255.252.0` to suppress individual /24 Type 3 LSAs.',
          'Change the OSPF process ID on all Area 10 routers to match the STP root bridge priority.',
          'Disable OSPF on ABR-1 and replace it with static default routes on every router in the building.',
          'Convert Area 10 into Area 0 so all routers share a single global Link-State Database.',
        ],
        correctOption: 0,
        explanation: 'Configuring route summarization on the ABR aggregates specific subnets into a single Type 3 Summary LSA. When an individual /24 subnet flaps inside Area 10, the summary route remains stable in Area 0, shielding the rest of the network from LSA updates and SPF recalculations.',
        explanationsJson: {
          1: 'Incorrect: OSPF process IDs are locally significant and have no relationship to STP priorities.',
          2: 'Incorrect: Disabling OSPF eliminates dynamic routing and redundancy.',
          3: 'Incorrect: Merging Area 10 into Area 0 would worsen the problem by forcing full SPF recalculations company-wide on every flap.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Diagnosing Multi-Area Route Flapping & ABR Summarization Remediation',
      },
    ],
    lab: {
      title: 'Guided Practice: Multi-Area OSPF ABR Configuration & Route Summarization',
      instructions:
        '1. Inspect Multi-Area OSPF topology (Area 0 Backbone transit, Area 1 Branch, Area 2 Data Center, ASBR External).\n2. Verify neighbor adjacencies across ABR-1 and ABR-2.\n3. Configure inter-area route summarization on ABR-1 for 10.1.0.0/16.\n4. Inspect the Link-State Database (LSDB) to confirm replacement of granular /24 LSAs with a single Type 3 Summary LSA.\n5. Verify external route redistribution from ASBR and validate E2/E1 metric calculation on branch router R1.',
      difficulty: CourseLevel.INTERMEDIATE,
      estimatedMinutes: 30,
      initialTopologyJson: {
        area0: { backbone: '0.0.0.0', transitSubnet: '10.0.0.0/24' },
        area1: { abrId: 'ABR1', subnets: ['10.1.1.0/24', '10.1.2.0/24', '10.1.3.0/24'], summary: '10.1.0.0/16' },
        area2: { abrId: 'ABR2', subnets: ['10.2.1.0/24', '10.2.2.0/24'], summary: '10.2.0.0/16' },
        asbr: { asbrId: 'ASBR1', externalSubnet: '172.16.0.0/12', metricType: 'E2', seedCost: 20 },
      },
      tasks: [
        'Inspect multi-area OSPF neighbor adjacencies across Area 0, Area 1, and Area 2.',
        'Verify Type 3 Summary LSA generation at ABR-1 and ABR-2.',
        'Configure ABR route summarization (`area 1 range 10.1.0.0 255.255.0.0`).',
        'Verify ASBR route redistribution and confirm E1/E2 metric calculation in routing table.',
      ],
    },
  },

  // =========================================================================
  // BENCHMARK LESSON: NET-403 (Network Automation & Programmability Foundations)
  // =========================================================================
  {
    courseCode: 'NET-403',
    slug: 'net-403-network-automation-programmability-foundations',
    title: 'Network Automation & Programmability Foundations',
    type: LessonType.THEORY,
    durationMinutes: 45,
    order: 1,
    visualizationType: 'NETWORK_AUTOMATION_PIPELINE',
    introduction:
      'Transition from error-prone manual CLI configuration to safe, reproducible, programmable network operations: Idempotency, declarative vs imperative models, REST APIs, JSON data structures, Python automation workflows, pre-deployment validation, dry-run diffs, telemetry, and controller architectures.',
    contentV2: {
      objective:
        'Master the foundational principles of network automation: transition from manual CLI terminal sessions to repeatable, programmable network operations, distinguish declarative target-state models from imperative command sequences, eliminate configuration drift, structure JSON network objects, execute standard REST API methods (GET, POST, PUT, PATCH, DELETE), and enforce a safe 6-stage deployment workflow (inspect -> validate -> dry-run -> apply -> verify -> log).',
      prerequisites: ['net-202-ipv4-addressing-cidr', 'net-303-routing-fundamentals-overview', 'net-301-enterprise-switching-vlans'],
      whyItMatters:
        'Manual device-by-device CLI configuration does not scale across enterprise infrastructure and accounts for over 70% of network outages caused by human syntax typos. Automated programmable workflows enable consistent, verifiable changes across hundreds of devices in seconds while preventing configuration drift and guaranteeing safe rollbacks.',
      explanation:
        'Network Automation replaces manual terminal sessions with structured, programmatic interactions. Traditional CLI management is imperative (specifying every sequential command string to execute) and vulnerable to configuration drift (where live physical device configurations diverge from intended designs due to undocumented ad-hoc changes). Modern network programmability relies on declarative models (specifying the desired end-state) and Idempotency—a core property ensuring that executing an automation workflow multiple times yields the exact same target state without redundant reconfigurations or service disruptions. Programmable devices expose REST APIs operating over HTTP/HTTPS. Automation scripts interact with devices using standard HTTP methods: `GET` to inspect operational state without modifications, `POST` to create new resources, `PUT` to replace an entire configuration, `PATCH` to apply partial updates, and `DELETE` to remove resources. Data is exchanged in structured JSON formats consisting of nested key-value objects and arrays, eliminating fragile terminal screen-scraping. Safe network automation enforces a strict 6-stage workflow: 1) Inspect current state, 2) Validate JSON schema and syntax, 3) Preview dry-run diffs against live state, 4) Apply validated changes atomically, 5) Verify post-change operational state, and 6) Log an immutable audit trail.',
      components: [
        { name: '1. Why Automation Exists', detail: 'Eliminates repetitive human manual CLI errors, accelerates deployment speed, and provides consistent configuration across fleet devices.' },
        { name: '2. Manual vs Automated Workflows', detail: 'Manual CLI relies on ad-hoc interactive sessions; automation uses version-controlled, repeatable scripts interacting with device APIs.' },
        { name: '3. Configuration Drift', detail: 'The divergence between the documented source-of-truth configuration and the actual running state on physical network hardware.' },
        { name: '4. Idempotency', detail: 'The property where executing an operation repeatedly with identical parameters produces the exact same end state without side effects.' },
        { name: '5. Declarative vs Imperative', detail: 'Declarative defines WHAT the target end-state should be; imperative specifies HOW to execute step-by-step CLI commands.' },
        { name: '6. Network APIs', detail: 'Programmatic interfaces exposed by network operating systems to allow structured machine-to-machine communication over standard transport.' },
        { name: '7. REST Basics', detail: 'Representational State Transfer: stateless, resource-oriented architecture using standard HTTP requests and URI endpoints.' },
        { name: '8. HTTP Methods (GET/POST/PUT/PATCH/DELETE)', detail: 'GET (read state), POST (create resource), PUT (replace resource), PATCH (partial update), DELETE (remove resource).' },
        { name: '9. JSON Data Structure', detail: 'Lightweight, human-readable data format using key-value pairs (objects) and ordered lists (arrays) to represent network configurations.' },
        { name: '10. Safe Automation Workflow', detail: '6-stage deployment lifecycle: Inspect -> Validate -> Dry-Run -> Apply -> Verify -> Log.' },
      ],
      howItWorks: [
        { stepNumber: 1, title: 'Inspect Current State', action: 'Query device state using HTTP GET to retrieve running configuration and operational telemetry.' },
        { stepNumber: 2, title: 'Validate Schema & Syntax', action: 'Verify JSON payload formatting, IP address syntax, and VLAN ID boundaries (1-4094) before touching devices.' },
        { stepNumber: 3, title: 'Preview Dry-Run Diff', action: 'Compare live running state against intended declarative JSON and generate a diff of pending changes.' },
        { stepNumber: 4, title: 'Apply Changes Atomically', action: 'Send authenticated PATCH/PUT request containing the validated payload to the device REST API endpoint.' },
        { stepNumber: 5, title: 'Verify Operational State', action: 'Query post-change telemetry to confirm interface is UP/UP, routes are present, and zero packet loss occurs.' },
        { stepNumber: 6, title: 'Log Audit Trail', action: 'Record execution timestamp, user identity, change payload, and device response in central logs.' },
      ],
      visualizer: {
        type: 'NETWORK_AUTOMATION_PIPELINE',
        title: 'Interactive Network Automation Pipeline & REST API Workbench',
        description: 'Explore the 6-stage safe automation lifecycle (Inspect -> Validate -> Dry-Run -> Apply -> Verify -> Log), execute HTTP methods against device endpoints, parse JSON models, and test drift remediation.',
      },
      workedExample: {
        title: 'Parsing Device JSON Telemetry and Constructing an Idempotent Interface Update',
        problemStatement:
          'A script queries a switch via `GET /api/v1/interfaces/GigabitEthernet0/1` and receives:\n`{"interface": "GigabitEthernet0/1", "vlan": 10, "admin_status": "DOWN"}`.\nWrite the logic to update the interface to VLAN 20 and UP if drift is detected.',
        stepByStepSolution: [
          'Step 1 (Inspect): Query device and parse JSON response into structured dictionary.',
          'Step 2 (Compare): Desired state is VLAN 20 and UP. Current state is VLAN 10 and DOWN (Drift detected).',
          'Step 3 (Validate & Build Payload): Construct declarative JSON payload: `{"vlan": 20, "admin_status": "UP"}`.',
          'Step 4 (Apply & Verify): Send `PATCH /api/v1/interfaces/GigabitEthernet0/1` with payload. Confirm HTTP 200 OK and verify oper_status is UP.',
        ],
        finalResult:
          'Interface updated idempotently to VLAN 20 UP with HTTP 200 verification and audit log entry.',
      },
      recap: [
        'Network automation shifts operations from imperative manual CLI sessions to declarative, version-controlled JSON data models.',
        'Idempotency guarantees that executing an automation script repeatedly produces identical target states without service disruption.',
        'REST APIs use standard HTTP methods (GET, POST, PUT, PATCH, DELETE) and JSON data to manage network device resources.',
        'Safe automation requires a 6-stage pipeline: Inspect -> Validate -> Dry-Run -> Apply -> Verify -> Log.',
      ],
    },
    questions: [
      {
        text: 'A network engineer runs an automated provisioning script against 50 access switches. When executed a second time immediately after completion, the script verifies that all devices already match the intended target state and makes zero disruptive changes. What fundamental automation property is demonstrated?',
        options: [
          'Idempotency',
          'Imperative Scripting',
          'Configuration Drift',
          'Promiscuous Mode',
        ],
        correctOption: 0,
        explanation: 'Idempotency is the property where an operation can be applied multiple times without changing the result beyond the initial application, ensuring safety and predictability in automated workflows.',
        explanationsJson: {
          1: 'Incorrect: Imperative scripts blindly execute sequential commands regardless of initial state, often throwing errors or causing duplicate entries upon re-run.',
          2: 'Incorrect: Configuration drift is the divergence of device state over time, not a safe execution property.',
          3: 'Incorrect: Promiscuous mode is a packet capture NIC setting.',
        },
        difficulty: CourseLevel.ADVANCED,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Idempotency in Network Automation',
      },
      {
        text: 'Which HTTP method should an automation script send to a network device REST API endpoint to retrieve operational routing table entries without modifying any configuration or state on the device?',
        options: [
          'GET',
          'POST',
          'PATCH',
          'DELETE',
        ],
        correctOption: 0,
        explanation: 'HTTP GET is a safe, read-only method used to query data from a server or network device without producing side effects or modifying configuration.',
        explanationsJson: {
          1: 'Incorrect: POST is used to create new resources on the device.',
          2: 'Incorrect: PATCH is used to modify existing configuration resources.',
          3: 'Incorrect: DELETE removes resources from the device.',
        },
        difficulty: CourseLevel.ADVANCED,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'REST API HTTP Methods for Network Operations',
      },
      {
        text: 'An engineer receives the following JSON payload from a switch REST API:\n`{"hostname": "core-sw-01", "vlans": [{"id": 10, "name": "Eng"}, {"id": 20, "name": "Sales"}]}`\nHow should an automation script interpret the `vlans` field?',
        options: [
          'As a list (array) of JSON objects (dictionaries), where each object represents a VLAN with `id` and `name` attributes.',
          'As a raw unformatted text string that must be parsed using regular expressions.',
          'As a binary byte stream containing encrypted Layer 2 Spanning Tree BPDUs.',
          'As an imperative sequence of CLI commands waiting for terminal execution.',
        ],
        correctOption: 0,
        explanation: 'In JSON, square brackets `[...]` denote an ordered array (list) and curly braces `{...}` denote an object (dictionary). `vlans` is a list containing two VLAN objects.',
        explanationsJson: {
          1: 'Incorrect: JSON is structured data and does not require screen-scraping regexes.',
          2: 'Incorrect: JSON is structured text, not binary BPDUs.',
          3: 'Incorrect: JSON represents declarative data models, not CLI command strings.',
        },
        difficulty: CourseLevel.ADVANCED,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'JSON Network Object Interpretation',
      },
      {
        text: 'Troubleshooting: An enterprise network team experiences an outage when an engineer pushes an untested automation template directly to 200 switches, applying an invalid subnet mask that severed management connectivity. What safe automation pipeline practice would have prevented this outage?',
        options: [
          'Executing pre-deployment schema validation and a dry-run diff preview against a single canary device before wide rollout.',
          'Converting all switch interfaces from routed mode to unmanaged hub mode.',
          'Increasing the SSH session timeout on all devices to 24 hours.',
          'Manually typing the configuration into every switch simultaneously using keyboard macros.',
        ],
        correctOption: 0,
        explanation: 'A robust automation pipeline enforces pre-deployment schema validation to catch syntax errors (such as invalid subnet masks) and executes dry-run previews on canary devices to verify non-disruptive behavior before wide-scale production deployment.',
        explanationsJson: {
          1: 'Incorrect: Hubs lack switching intelligence and worsen broadcast storms.',
          2: 'Incorrect: SSH timeout does not catch invalid configuration parameters.',
          3: 'Incorrect: Unvalidated manual macros propagate human errors rapidly without validation.',
        },
        difficulty: CourseLevel.ADVANCED,
        cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Safe Automation Pipelines & Pre-Flight Validation',
      },
      {
        text: 'What is the primary architectural difference between an imperative automation approach and a declarative automation approach in network engineering?',
        options: [
          'Imperative defines the exact step-by-step commands to execute, whereas declarative defines the desired target end-state and lets the system compute necessary actions.',
          'Imperative is only used for optical fiber transceivers, whereas declarative is used for wireless access points.',
          'Declarative requires manual password entry for every single interface configuration.',
          'Imperative uses JSON data, whereas declarative only supports unencrypted Telnet sessions.',
        ],
        correctOption: 0,
        explanation: 'Imperative automation specifies the exact sequence of procedural steps ("how"), while declarative automation specifies the intended end-state ("what"), enabling idempotent reconciliation.',
        explanationsJson: {
          1: 'Incorrect: Automation paradigms are media-independent.',
          2: 'Incorrect: Declarative models use programmatic tokens and automated authentication.',
          3: 'Incorrect: Declarative models utilize structured data formats like JSON/YAML.',
        },
        difficulty: CourseLevel.ADVANCED,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Declarative vs Imperative Automation Approaches',
      },
      {
        text: 'An audit reveals that an engineer manually logged into a production core switch via SSH and altered the MTU on an uplink without updating the central Git repository. What problem has been introduced, and what is the risk?',
        options: [
          'Configuration drift; the live device state no longer matches the source of truth, risking unexpected overwrite or failure on the next automated deployment.',
          'Idempotency failure; the switch will automatically power down after 24 hours.',
          'Broadcast storm; changing MTU causes Layer 2 loops across all VLANs.',
          'REST API exhaustion; manual SSH disables HTTP GET requests permanently.',
        ],
        correctOption: 0,
        explanation: 'Manual out-of-band changes introduce configuration drift, causing physical devices to diverge from the central repository and leading to unpredictable behavior during automated rollouts.',
        explanationsJson: {
          1: 'Incorrect: Configuration drift does not trigger hardware power downs.',
          2: 'Incorrect: MTU mismatch causes packet drops/blackholes, not switching loops.',
          3: 'Incorrect: SSH sessions do not disable device REST APIs.',
        },
        difficulty: CourseLevel.ADVANCED,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Detecting and Remediating Configuration Drift',
      },
      {
        text: 'Which of the following describes an UNSAFE network automation practice that violates standard production engineering guidelines?',
        options: [
          'Pushing configuration changes simultaneously to 1,000 production switches without dry-run diff validation or an automated rollback mechanism.',
          'Executing pre-flight schema validation on JSON payloads before sending REST API requests.',
          'Using Bearer tokens with least-privilege permissions instead of root credentials.',
          'Logging every automation execution with timestamps and user identities to a centralized SIEM.',
        ],
        correctOption: 0,
        explanation: 'Deploying unvalidated changes at scale without dry-run previews or rollback strategies is extremely hazardous and violates safe automation practices.',
        explanationsJson: {
          1: 'Incorrect: Pre-flight schema validation is a recommended safety practice.',
          2: 'Incorrect: Token authentication with least-privilege is a security best practice.',
          3: 'Incorrect: Centralized audit logging is required for compliance and troubleshooting.',
        },
        difficulty: CourseLevel.ADVANCED,
        cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Identifying Unsafe Automation Practices',
      },
    ],
    lab: {
      title: 'Guided Practice: Simulated Network Automation Pipeline & REST API Configuration',
      instructions:
        '1. Inspect current switch interface state via simulated REST API endpoint (`GET /api/v1/interfaces/GigabitEthernet0/1`).\n2. Construct an intended declarative JSON configuration payload for VLAN 100 and IP 10.100.1.1/30.\n3. Execute schema pre-flight validation.\n4. Run a simulated dry-run diff preview to detect configuration drift.\n5. Apply the validated configuration via `PATCH`.\n6. Verify the operational state (UP/UP) and confirm automated telemetry audit logging.',
      difficulty: CourseLevel.ADVANCED,
      estimatedMinutes: 30,
      initialTopologyJson: {
        device: {
          hostname: 'sw-core-01',
          managementIp: '192.168.1.10',
          apiEndpoint: '/api/v1/interfaces/GigabitEthernet0/1',
        },
        currentState: {
          interface: 'GigabitEthernet0/1',
          adminStatus: 'DOWN',
          vlan: 1,
          ip: null,
        },
        targetState: {
          interface: 'GigabitEthernet0/1',
          adminStatus: 'UP',
          vlan: 100,
          ip: '10.100.1.1/30',
        },
      },
      tasks: [
        'Query device state via simulated GET request.',
        'Construct declarative JSON configuration object for GigabitEthernet0/1.',
        'Validate JSON schema and execute dry-run diff comparison.',
        'Apply configuration via idempotent PATCH request and verify resulting UP/UP state.',
      ],
    },
  },

  // =========================================================================
  // BENCHMARK LESSON: NET-404 (Wireshark Packet Capture Analysis)
  // =========================================================================
  {
    courseCode: 'NET-404',
    slug: 'net-404-wireshark-packet-capture',
    title: 'Wireshark Packet Capture Analysis',
    type: LessonType.THEORY,
    durationMinutes: 35,
    order: 1,
    visualizationType: 'WIREXHARK_INSPECTOR',
    introduction:
      'Master Wireshark PCAP architecture, Berkeley Packet Filters (BPF), display filter syntax, TCP stream reconstruction, and forensic incident troubleshooting.',
    contentV2: {
      objective:
        'Master Wireshark PCAP capture engine architecture, Npcap driver hooks, Berkeley Packet Filter (BPF) syntax, advanced display filters, TCP stream reconstruction, and packet forensics.',
      prerequisites: ['net-204-tcp-udp-transport-overview', 'Ethernet and IP header anatomy'],
      whyItMatters:
        'Packet analysis provides empirical ground truth during outages and security breaches. Network engineers dissect raw frame bytes when high-level diagnostic logs are insufficient.',
      explanation:
        'Wireshark captures raw network frames directly from Network Interface Cards (NICs) placed in **Promiscuous Mode**. It parses binary byte streams through hundreds of modular protocol dissectors, rendering packet telemetry across three coordinated interface panes.\n\n### 1. The 3-Tier Interface Dissection Architecture\n1. **Packet List Pane (Top)**: Real-time tabular stream displaying frame numbers, relative/epoch timestamps, Source/Destination L3/L2 addresses, protocol classification, byte lengths, and high-level summary info.\n2. **Packet Details Pane (Middle)**: Expandable hierarchical tree mapping raw bytes to OSI Layer models (Frame -> Ethernet II -> IPv4 -> TCP/UDP -> Application Layer Payload).\n3. **Packet Bytes Pane (Bottom)**: Raw hexadecimal memory dump coupled with ASCII character representations. Selecting a header field in the Details pane highlights its exact byte offsets in the hex dump.\n\n### 2. Capture Filters (BPF) vs Display Filters\n* **Capture Filters (Berkeley Packet Filter - BPF)**: Evaluated at the kernel driver layer (Npcap/libpcap) *before* frames are buffered to disk (e.g. `host 192.168.1.10 and port 80`). Significantly reduces CPU/disk overhead during high-speed traffic capture.\n* **Display Filters**: Evaluated in post-capture analysis against decoded protocol trees without altering stored PCAP data (e.g. `tcp.flags.syn == 1 && tcp.flags.ack == 0`).\n\n### 3. TCP Stream Reconstruction & Forensic Analytics\n* **Follow TCP Stream**: Reassembles out-of-order segments and strips transport/network headers to display application-layer dialogues (HTTP GET/POST, SMTP, TLS client hellos).\n* **Expert Info**: Automated diagnostic flags highlighting `[TCP Retransmission]`, `[TCP Fast Retransmit]`, `[TCP Dup ACK]`, and `[TCP ZeroWindow]` flow-control buffer exhaustion.',
      components: [
        {
          name: 'Capture Engine (Npcap / libpcap)',
          detail: 'Kernel-level driver capturing frames directly from physical NIC in promiscuous mode.',
        },
        {
          name: 'Packet List Pane',
          detail: 'Summary table of packet numbers, timestamps, source/destination endpoints, protocols, and length.',
        },
        {
          name: 'Packet Details Pane',
          detail: 'Expandable OSI layer tree displaying parsed frame headers from Layer 2 to Layer 7.',
        },
        {
          name: 'Packet Bytes Pane',
          detail: 'Raw hexadecimal and ASCII byte stream view with dynamic byte-range selection linking.',
        },
        {
          name: 'TCP Stream Follower',
          detail: 'Reconstructs bidirectionally sequenced application payloads from individual transport segments.',
        },
      ],
      howItWorks: [
        {
          stepNumber: 1,
          title: 'Promiscuous Mode Capture',
          action: 'NIC copies all frames on physical segment regardless of destination MAC into kernel ring buffer.',
        },
        {
          stepNumber: 2,
          title: 'BPF Kernel Filtering',
          action: 'Driver applies BPF filter to discard unwanted packets before writing to disk/memory.',
        },
        {
          stepNumber: 3,
          title: 'Dissection & Display Filtering',
          action: 'Protocol dissectors parse raw bytes; user applies display filters (e.g. tcp.analysis.flags) to isolate issues.',
        },
        {
          stepNumber: 4,
          title: 'Expert Info & Stream Analysis',
          action: 'Wireshark flags retransmissions, ZeroWindow events, and RST teardowns for forensic analysis.',
        },
      ],
      packetHeaderView: {
        protocol: 'Wireshark Dissected TCP SYN Packet',
        fields: [
          { fieldName: 'Ethernet II Header', bitLength: '14 Bytes', hexSample: 'Dst: 00:1a... Src: 00:1a...', description: 'L2 Framing.' },
          { fieldName: 'IPv4 Header', bitLength: '20 Bytes', hexSample: 'Src: 192.168.1.10 Dst: 172.16.0.5', description: 'L3 IP routing header.' },
          { fieldName: 'TCP Header', bitLength: '32 Bytes', hexSample: 'Port: 51234 -> 80 [SYN]', description: 'L4 TCP SYN connection initiation.' },
        ],
        headerDiagramAscii: `
+-------------------------------------------------------------------------------+
|                      WIRESHARK 3-PANE INSPECTION MODEL                        |
+-------------------------------------------------------------------------------+
| [1. PACKET LIST PANE]                                                         |
| No. | Time     | Source        | Destination   | Proto | Length | Info        |
| 1   | 0.000000 | 192.168.1.10  | 172.16.0.5    | TCP   | 66     | 51234 -> 80 |
|-------------------------------------------------------------------------------|
| [2. PACKET DETAILS PANE - PROTOCOL TREE]                                      |
| > Frame 1: 66 bytes on wire                                                   |
| > Ethernet II, Src: 00:1a:2b:3c:4d:01, Dst: 00:1a:2b:3c:4d:02                 |
| > Internet Protocol Version 4, Src: 192.168.1.10, Dst: 172.16.0.5             |
| v Transmission Control Protocol, Src Port: 51234, Dst Port: 80, Flags: [SYN]  |
|-------------------------------------------------------------------------------|
| [3. PACKET BYTES PANE - HEX & ASCII DUMP]                                     |
| 0000  00 1a 2b 3c 4d 02 00 1a 2b 3c 4d 01 08 00 45 00  ..+<M...+<M...E.      |
| 0010  00 34 a1 b2 40 00 40 06 7c 11 c0 a8 01 0a ac 10  .4..@.@.|.......      |
+-------------------------------------------------------------------------------+
`,
      },
      visualizer: {
        type: 'WIREXHARK_INSPECTOR',
        title: 'Interactive Wireshark PCAP Frame Inspector & Stream Reconstructor',
        description: 'Inspect live PCAP frame captures, filter by protocol/IP/flags, click protocol tree layers to highlight hex byte ranges, and follow TCP streams.',
      },
      workedExample: {
        title: 'Reconstructing a Failed Web Request from PCAP Data',
        problemStatement: 'An analyst inspects a PCAP trace of a failed HTTP request to server 172.16.0.5. Filter for TCP SYN and diagnose.',
        stepByStepSolution: [
          '1. Filter: `ip.addr == 172.16.0.5 && tcp`.',
          '2. Frame 1: Client sends TCP SYN (Flags: 0x002) to Port 80.',
          '3. Frame 2: Server responds with TCP RST, ACK (Flags: 0x014).',
          '4. Diagnosis: Destination port 80 is closed / connection refused.',
        ],
        finalResult: 'Connection failed due to TCP RST returned by destination server.',
      },
      practice: [
        {
          id: 1,
          prompt: 'Which Wireshark display filter isolates only initial TCP connection requests (SYN=1 and ACK=0)?',
          expected: '`tcp.flags.syn == 1 && tcp.flags.ack == 0`',
          hints: 'tcp.flags.syn == 1 && tcp.flags.ack == 0.',
        },
        {
          id: 2,
          prompt: 'What is the fundamental architectural difference between BPF Capture Filters and Display Filters?',
          expected: 'Capture filters drop packets at the kernel driver before writing to disk; display filters filter parsed frames post-capture without modifying stored PCAP data.',
          hints: 'Capture filters drop pre-disk; display filters filter post-capture.',
        },
        {
          id: 3,
          prompt: 'What network event triggers the TCP Fast Retransmit algorithm in Wireshark?',
          expected: 'Receiving 3 identical duplicate ACKs (Triple Duplicate ACK) for the same sequence number.',
          hints: '3 duplicate ACKs trigger Fast Retransmit.',
        },
        {
          id: 4,
          prompt: 'What does a `[TCP ZeroWindow]` packet flag indicate in a packet trace?',
          expected: 'The receiving host\'s application buffer is completely full, commanding the sender to pause transmission (win=0).',
          hints: 'win=0 indicates receiver buffer saturation.',
        },
        {
          id: 5,
          prompt: 'Which display filter isolates all TCP retransmissions and duplicate acknowledgments?',
          expected: '`tcp.analysis.retransmission || tcp.analysis.duplicate_ack`',
          hints: 'tcp.analysis.retransmission.',
        },
        {
          id: 6,
          prompt: 'What does DNS RCODE 3 (NXDOMAIN) signify in a captured DNS response packet?',
          expected: 'Non-Existent Domain: The queried domain name does not exist in the authoritative DNS zone.',
          hints: 'NXDOMAIN indicates non-existent domain.',
        },
      ],
      recap: [
        'Wireshark captures raw frames in Promiscuous Mode and parses them into a 3-pane inspection model.',
        'Capture filters (BPF) optimize storage at the kernel driver; display filters analyze decoded PCAP data.',
        'TCP Stream reconstruction assembles out-of-order segments into human-readable application payloads.',
        'Expert Info flags identify packet loss, duplicate ACKs, ZeroWindow buffer saturation, and RST resets.',
        'TCP Fast Retransmit is triggered upon receiving 3 duplicate ACKs without waiting for timer expiry.',
      ],
    },
    questions: [
      {
        text: 'Which Wireshark display filter isolates ONLY the initial TCP connection request (SYN packet) sent by a client, excluding SYN-ACK packets?',
        options: [
          'tcp.flags.syn == 1 && tcp.flags.ack == 0',
          'tcp.flags.syn == 1',
          'tcp.port == 80',
          'ip.proto == 6',
        ],
        correctOption: 0,
        explanation:
          'The initial connection request has the SYN bit set to 1 and the ACK bit set to 0 (`tcp.flags.syn == 1 && tcp.flags.ack == 0`). SYN-ACK packets sent by the server have both SYN=1 and ACK=1.',
        explanationsJson: {
          1: '`tcp.flags.syn == 1` matches BOTH SYN (client) and SYN-ACK (server) packets.',
          2: '`tcp.port == 80` filters all HTTP traffic regardless of flags.',
          3: '`ip.proto == 6` filters all TCP traffic in the capture.',
        },
        difficulty: CourseLevel.ADVANCED,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.PACKET_ANALYSIS,
        concept: 'Wireshark TCP Flag Filtering',
      },
      {
        text: 'In a Wireshark PCAP trace, an engineer observes 3 identical consecutive TCP ACK packets with `Ack = 45000` returned by the receiver in less than 5 milliseconds. What network event does this "Triple Duplicate ACK" indicate?',
        options: [
          'Fast Retransmit trigger: A packet was lost in transit, causing the receiver to repeatedly acknowledge the last contiguous byte received while out-of-order packets arrive',
          'The TCP connection has gracefully terminated with a 4-way handshake',
          'The client has upgraded from IPv4 to IPv6',
          'The switch has enabled jumbo frames',
        ],
        correctOption: 0,
        explanation:
          'When a receiver gets an out-of-order segment (because an earlier segment was dropped), it immediately sends a duplicate ACK for the last in-order byte. Receiving 3 duplicate ACKs triggers the Fast Retransmit algorithm, retransmitting the lost segment without waiting for RTO timer expiry.',
        explanationsJson: {
          1: 'Connection termination utilizes FIN and FIN-ACK packets, not rapid duplicate ACKs.',
          2: 'IP version upgrades do not generate duplicate TCP acknowledgments.',
          3: 'Jumbo frames are Layer 2 MTU configurations, not duplicate ACK indicators.',
        },
        difficulty: CourseLevel.ADVANCED,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.PACKET_ANALYSIS,
        concept: 'TCP Fast Retransmit & Duplicate ACKs',
      },
      {
        text: 'A Wireshark packet capture displays: `[TCP ZeroWindow]` from server `10.0.0.5` followed immediately by the client pausing all transmission. What does this packet indicate?',
        options: [
          'The receiving server application buffer is completely full, advertising Window Size = 0 to command the client to stop sending data until buffer space clears',
          'The server has crashed and closed all network ports',
          'The network cable has been unplugged from the wall',
          'The client has sent an invalid password',
        ],
        correctOption: 0,
        explanation:
          'A `[TCP ZeroWindow]` packet is flow control in action. The receiver buffer is saturated, so it advertises `win=0`. The sender stops transmitting data and sends periodic 1-byte "ZeroWindowProbe" packets until the receiver responds with a non-zero window update.',
        explanationsJson: {
          1: 'If the server crashed, it would send a TCP RST or timeout, not an active ZeroWindow flow control advertisement.',
          2: 'A disconnected cable results in silent timeouts, not TCP header window updates.',
          3: 'ZeroWindow is transport layer flow control, unrelated to application authentication.',
        },
        difficulty: CourseLevel.ADVANCED,
        cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
        questionType: QuestionType.PACKET_ANALYSIS,
        concept: 'TCP ZeroWindow Flow Control Analysis',
      },
      {
        text: 'An engineer suspects a slow network is caused by TCP retransmissions. Which Wireshark display filter quickly displays only retransmitted packets and duplicate acknowledgments?',
        options: [
          '`tcp.analysis.retransmission || tcp.analysis.duplicate_ack`',
          '`http.request.method == "GET"`',
          '`ip.addr == 127.0.0.1`',
          '`frame.len > 1518`',
        ],
        correctOption: 0,
        explanation:
          'Wireshark built-in TCP analysis engine flags retransmissions and duplicate ACKs with `tcp.analysis.retransmission` and `tcp.analysis.duplicate_ack`, allowing rapid diagnosis of packet loss and latency.',
        explanationsJson: {
          1: '`http.request.method == "GET"` filters HTTP GET requests, not TCP loss analytics.',
          2: '`ip.addr == 127.0.0.1` filters local loopback traffic.',
          3: '`frame.len > 1518` filters oversized/jumbo frames.',
        },
        difficulty: CourseLevel.ADVANCED,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.PACKET_ANALYSIS,
        concept: 'Wireshark Expert Info Display Filters',
      },
      {
        text: 'In Wireshark, an engineer inspects a DNS response frame containing `Flags: 0x8183 (Standard query response, No such name)`. What is the common name and technical meaning of this DNS response code (RCODE 3)?',
        options: [
          'NXDOMAIN (Non-Existent Domain): The queried domain name does not exist in the authoritative DNS zone',
          'SERVFAIL: The DNS server hardware has failed',
          'REFUSED: The DNS server refuses to talk to the client',
          'NOERROR: The domain name was resolved successfully',
        ],
        correctOption: 0,
        explanation:
          'RCODE 3 is `NXDOMAIN` (Non-Existent Domain). The authoritative name server confirmed that the requested domain name is not registered or has no record in the zone file.',
        explanationsJson: {
          1: 'SERVFAIL is RCODE 2 (server failure).',
          2: 'REFUSED is RCODE 5 (policy refusal).',
          3: 'NOERROR is RCODE 0 (successful query resolution).',
        },
        difficulty: CourseLevel.ADVANCED,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.PACKET_ANALYSIS,
        concept: 'DNS Packet Flag & RCODE Analysis',
      },
      {
        text: 'A security analyst captures a flood of TCP packets targeted at port 443 with `tcp.flags.reset == 1`. What is the meaning of a TCP RST packet and what does this traffic pattern suggest?',
        options: [
          'TCP RST (Reset) abruptly tears down a connection without a graceful 4-way FIN handshake; a flood of RST packets suggests a port scan against closed ports or a TCP Reset attack terminating active sessions',
          'TCP RST indicates a successful file download has completed',
          'TCP RST means the router has upgraded its firmware',
          'TCP RST is used exclusively to calibrate Wi-Fi antennas',
        ],
        correctOption: 0,
        explanation:
          'The RST (Reset) flag indicates an immediate, ungraceful connection termination (sent when a packet arrives for a closed port or when a connection has crashed). Excessive RST packets indicate port scanning or malicious session termination.',
        explanationsJson: {
          1: 'Successful completion uses FIN and ACK flags for graceful termination.',
          2: 'Firmware upgrades are system management events, not TCP packet flags.',
          3: 'TCP RST is a transport layer flag, unrelated to physical antenna calibration.',
        },
        difficulty: CourseLevel.ADVANCED,
        cognitiveLevel: CognitiveLevel.EXPERT_REASONING,
        questionType: QuestionType.PACKET_ANALYSIS,
        concept: 'TCP Reset (RST) Flag Analysis & Port Scanning',
      },
    ],
    lab: {
      title: 'Guided Practice: Wireshark PCAP Capture Filter & TCP Stream Forensics',
      instructions: '1. Open capture.pcap trace in Frame Inspector.\n2. Filter TCP SYN packets using tcp.flags.syn == 1.',
      difficulty: CourseLevel.ADVANCED,
      estimatedMinutes: 25,
      initialTopologyJson: { pcapFile: 'capture.pcap', totalFrames: 120 },
      tasks: ['Apply display filter tcp.flags.syn == 1.'],
    },
  },
];

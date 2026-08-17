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
    stepMetadata: {
      step1_objective:
        'Understand why redundant Layer-2 switching topologies cause catastrophic broadcast storms, how STP elects a single Root Bridge via BPDUs, and how port roles (Root, Designated, Blocked) guarantee loop-free forwarding with automatic failover.',
      step2_prerequisites: [
        'NET-201: Layer 2 Ethernet Frames & MAC Address Tables',
        'NET-301: Enterprise Switching, VLANs & 802.1Q Trunks',
      ],
      step3_whyItMatters:
        'Unlike Layer-3 IPv4 packets which have a Time-To-Live (TTL) header field to terminate routing loops, Ethernet Layer-2 frames have NO TTL field. A single broadcast frame inside a redundant multi-switch loop will circulate infinitely, causing exponential frame amplification (Broadcast Storm), CPU saturation (100%), and complete network outage within seconds.',
      step4_coreConcept:
        'The Spanning Tree Protocol (IEEE 802.1D / IEEE 802.1w RSTP) dynamically builds a loop-free logical topology (a spanning tree) by placing redundant switch ports into a non-forwarding (Blocking/Discarding) state while keeping them ready to unblock immediately if an active link fails.',
      step5_technicalAnatomy: {
        title: 'Bridge ID & STP Port Role Classification',
        description:
          'Every switch has an 8-byte Bridge Identifier (BID) comprising a 2-byte Priority (default 32768 in increments of 4096) + 6-byte Base MAC Address. The switch with the lowest numeric BID becomes the Root Bridge.',
        components: [
          {
            name: 'Root Bridge (RB)',
            detail: 'The logical center and master clock of the spanning tree. All active ports on the Root Bridge are Designated Ports (Forwarding).',
          },
          {
            name: 'Root Port (RP)',
            detail: 'Exactly one port per non-root switch that has the lowest Root Path Cost to reach the Root Bridge.',
          },
          {
            name: 'Designated Port (DP)',
            detail: 'The single port on each network segment that forwards traffic toward the Root Bridge with the lowest advertised path cost.',
          },
          {
            name: 'Alternate / Blocked Port (BLK)',
            detail: 'A redundant port placed in a non-forwarding state. It discards user payload frames but continuously listens to incoming BPDUs.',
          },
        ],
      },
      step6_howItWorks: {
        steps: [
          {
            stepNumber: 1,
            title: 'Root Bridge Election',
            action:
              'All switches exchange Configuration BPDUs. The switch with the lowest Bridge Priority (default 32768) + Lowest MAC Address is elected Root Bridge.',
          },
          {
            stepNumber: 2,
            title: 'Root Port (RP) Selection',
            action:
              'Each non-root switch evaluates all incoming ports and selects the single port with the lowest cumulative Root Path Cost (10G=2, 1G=4, 100M=19, 10M=100).',
          },
          {
            stepNumber: 3,
            title: 'Designated Port (DP) Election',
            action:
              'For each physical link segment, the switch with the lowest path cost to the root bridge designates its connected port as Forwarding.',
          },
          {
            stepNumber: 4,
            title: 'Loop-Breaking Port Blocking',
            action:
              'All remaining ports that are neither Root Ports nor Designated Ports transition into the Blocking (Discarding) state to eliminate physical loops.',
          },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'IEEE 802.1D Bridge Protocol Data Unit (BPDU)',
        fields: [
          {
            fieldName: 'Protocol Identifier',
            bitLength: '16 bits (2 Bytes)',
            hexSample: '0x0000',
            description: 'Identifies IEEE 802.1D Spanning Tree Protocol.',
          },
          {
            fieldName: 'BPDU Type',
            bitLength: '8 bits (1 Byte)',
            hexSample: '0x00',
            description: '0x00 = Configuration BPDU; 0x80 = Topology Change Notification (TCN).',
          },
          {
            fieldName: 'Root Bridge Identifier',
            bitLength: '64 bits (8 Bytes)',
            hexSample: '0x1000 001A.2B3C.4D02',
            description: 'Priority (4096) + Extended System ID + MAC address of current Root.',
          },
          {
            fieldName: 'Root Path Cost',
            bitLength: '32 bits (4 Bytes)',
            hexSample: '0x00000004',
            description: 'Cumulative path cost from transmitting bridge to root bridge (Cost 4 for 1 Gbps link).',
          },
          {
            fieldName: 'Sender Bridge Identifier',
            bitLength: '64 bits (8 Bytes)',
            hexSample: '0x8000 001A.2B3C.4D01',
            description: 'Priority (32768) + Base MAC of switch sending this specific BPDU.',
          },
          {
            fieldName: 'Port Identifier',
            bitLength: '16 bits (2 Bytes)',
            hexSample: '0x8001',
            description: 'Port Priority (128) + Port Number (e.g. GigabitEthernet0/1).',
          },
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
      step8_visualExplanation: {
        type: 'STP_TOPOLOGY_ENGINE',
        title: 'Interactive 3-Switch Ring Topology Loop-Breaking State Machine',
        description:
          'In a 3-switch triangle ring (SW-A, SW-B, SW-C), SW-B with Bridge Priority 4096 is elected Root Bridge. SW-C places its port facing SW-A into Alternate/Blocking (BLK) state, cutting the loop while keeping an instant standby path if the link between SW-B and SW-C fails.',
      },
      step9_workedExample: {
        title: 'Calculating Root Bridge, Path Costs, and Blocked Ports in a 3-Switch Enterprise Ring',
        problemStatement:
          'Three switches SW-1 (Priority 32768, MAC 00:01), SW-2 (Priority 4096, MAC 00:02), and SW-3 (Priority 32768, MAC 00:03) are connected via 1 Gbps links (Cost = 4). Determine: (1) Root Bridge, (2) Root Ports on SW-1 and SW-3, (3) Blocked port on the segment between SW-1 and SW-3.',
        stepByStepSolution: [
          'Step 1: Compare Bridge IDs (Priority + MAC). SW-2 has Priority 4096, which is lower than 32768. SW-2 is unanimously elected Root Bridge.',
          'Step 2: Calculate Root Path Costs for SW-1 and SW-3. SW-1 direct link to SW-2 = Cost 4. SW-3 direct link to SW-2 = Cost 4. Both direct ports become Root Ports (RP).',
          'Step 3: Evaluate the link between SW-1 and SW-3. Both switches advertise Root Path Cost = 4. The tie-breaker is Lowest Sender Bridge ID.',
          'Step 4: Compare SW-1 (32768.00:01) vs SW-3 (32768.00:03). SW-1 has a lower MAC address (00:01 < 00:03).',
          'Step 5: SW-1 wins Designated Port (DP) on the link. SW-3 loses and places its port facing SW-1 into Alternate/Blocking (BLK) state.',
        ],
        finalResult: 'Root Bridge: SW-2. Root Ports: SW-1(Gi0/1) & SW-3(Gi0/2). Blocked Port: SW-3(Gi0/1).',
      },
      step10_realWorldScenario: {
        topology: 'Enterprise Data Center Multi-Tier Access & Distribution Switching',
        scenarioText:
          'An engineer accidentally connects two patch cables between two access switches already connected to distribution switches, creating an unintended redundant loop. STP detects duplicate BPDUs, blocks the redundant link within 2 seconds, and generates an SNMP alert, preventing an enterprise-wide network collapse.',
        engineeringContext:
          'Always configure distribution switches with `spanning-tree vlan 1-4094 priority 4096` (Primary Root) and `priority 8192` (Secondary Root) to ensure predictable deterministic root placement rather than relying on random default MAC tie-breakers.',
      },
      step11_deviceBehavior: {
        hostBehavior:
          'End-user laptops and servers do not run STP. If an edge port is connected to an end-device, configure `spanning-tree portfast` to bypass Listening/Learning delays and enable instant DHCP acquisition.',
        nicBehavior:
          'NIC sends standard untagged or 802.1Q tagged frames. If a rogue virtualization host sends BPDUs, BPDU Guard triggers immediate port shutdown.',
        switchOrRouterBehavior:
          'Switches originate and consume BPDUs on all active trunk and access ports every 2.0 seconds (Hello Time). Blocked ports discard all user payload frames but continuously process BPDUs.',
      },
      step12_cliTooling: [
        {
          command: 'show spanning-tree',
          description: 'Displays the current Root Bridge ID, local Bridge ID, hello timers, and all port roles/states for VLAN 1.',
          expectedOutput:
            'VLAN0001\n  Spanning tree enabled protocol rstp\n  Root ID    Priority    4096\n             Address     001a.2b3c.4d02\n             This bridge is the root\n  Interface        Role Sts Cost      Prio.Nbr Type\n  ---------------- ---- --- --------- -------- --------------------------------\n  Gi0/1            Desg FWD 4         128.1    P2p\n  Gi0/2            Desg FWD 4         128.2    P2p',
          proofExplanation:
            'Confirms this switch has priority 4096 and is the Root Bridge, with all active interfaces in the Designated Forwarding (Desg FWD) state.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'Complete LAN slowdown, 100% switch CPU utilization, blinking link LEDs across all switchports.',
          possibleCauses: [
            'Layer 2 loop caused by unmanaged desktop switch looped back onto itself',
            'STP disabled on one or more trunk links',
          ],
          diagnosticSteps: [
            'Execute `show spanning-tree summary` to verify STP is actively running on all VLANs.',
            'Execute `show interfaces counters errors` to check for massive broadcast frame counts.',
          ],
          remediation:
            'Remove physical redundant patch cable, ensure `spanning-tree bpduguard enable` is applied on all access ports.',
        },
      ],
      step14_commonMistakes: [
        {
          misconception: 'Leaving all switches at default Bridge Priority 32768 is fine in production.',
          correction:
            'If all switches use 32768, the oldest switch with the lowest random MAC address will become the Root Bridge. Always explicitly set Core switches to Priority 4096.',
        },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'STP Root Hijacking Attack via forged BPDUs',
        mitigationStrategy:
          'Configure `spanning-tree guard root` on distribution downlinks and enable `spanning-tree bpduguard enable` on all access edge ports.',
      },
      step16_examPrep: {
        keyExamPoints: [
          'Bridge Priority default is 32768; values must be configured in multiples of 4096.',
          'Lowest Bridge ID wins Root Bridge election.',
          'Root Bridge has NO Root Ports; all active ports on Root Bridge are Designated Ports.',
          'Path Cost standards: 10G = 2, 1G = 4, 100M = 19, 10M = 100.',
        ],
        frequentTraps: [
          'Remember lower numbers always win in STP (lower priority, lower cost, lower MAC).',
        ],
      },
      step17_practicalLabRef: {
        title: 'Guided Practice: Enterprise Layer-2 Redundant Topology Loop Prevention & STP Reconvergence',
        scenario:
          'A multi-switch campus network has three interconnected switches. The administrator must verify Root Bridge election, identify blocked loop ports, and verify failover.',
        tasks: [
          'Inspect Bridge IDs and port roles using `show spanning-tree`.',
          'Configure SW-A as Primary Root using `spanning-tree vlan 1 priority 4096`.',
        ],
        verificationMethod: 'Verify `show spanning-tree` output confirms new Root Bridge ID.',
      },
      step18_masterySummary: {
        summaryPoints: [
          'Ethernet lacks TTL, making Layer-2 loop prevention mandatory.',
          'STP elects a single Root Bridge per broadcast domain using the lowest numeric Bridge ID.',
          'Non-root switches elect one Root Port with the lowest path cost to the root.',
        ],
        nextLessonBridge:
          'With Layer 2 switching and loop-free redundant topologies mastered in NET-301 and NET-302, proceed to NET-303 to learn how routers forward packets across distinct Layer 3 broadcast domains.',
      },
    },
    questions: [
      {
        text: 'Why do Layer-2 switching loops cause continuous catastrophic broadcast storms while Layer-3 routing loops eventually terminate?',
        options: [
          'Ethernet Layer-2 frame headers lack a Time-To-Live (TTL) field, allowing looped broadcast frames to circulate indefinitely until bandwidth and CPU are exhausted',
          'Switches have less RAM than enterprise routers',
          'Layer-2 frames are encrypted by default',
          'STP only operates on fiber optic media',
        ],
        correctOption: 0,
        explanation: 'IPv4 and IPv6 packets contain a TTL/Hop Limit field decremented at every Layer-3 router hop. Ethernet frames have no such mechanism, so any broadcast frame flooded on a loop will circulate and multiply infinitely.',
        explanationsJson: {
          1: 'Memory capacity is irrelevant; without a TTL field, frames circulate forever.',
          2: 'Standard Ethernet frames are unencrypted plaintext headers.',
          3: 'STP operates universally across all physical media.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Layer 2 Loop Mechanics & TTL Absence',
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
    stepMetadata: {
      step1_objective:
        'Understand how OSPF link-state routing protocols construct identical Link-State Databases (LSDBs) across an autonomous system, how Dijkstra’s Shortest Path First (SPF) algorithm computes loop-free routes, and how 7-state neighbor finite state machines establish robust dynamic adjacencies.',
      step2_prerequisites: ['net-202-ipv4-addressing-cidr', 'net-303-routing-fundamentals-overview'],
      step3_whyItMatters:
        'Static routing requires manual administrative updates whenever network topology changes occur. OSPF automatically detects link transitions within milliseconds, floods Type-1 LSAs, and executes Dijkstra’s algorithm to calculate alternate loop-free paths.',
      step4_coreConcept:
        'OSPF (Open Shortest Path First) is an Interior Gateway Protocol (IGP) based on Link-State technology. Every OSPF router maintains a complete, identical map of the entire network topology in its Link-State Database (LSDB) and independently calculates the shortest path tree to all subnets using Dijkstra’s algorithm.',
      step5_technicalAnatomy: {
        title: 'OSPF Core Architectural Components',
        description:
          'OSPF operates directly over IP (Protocol Number 89). It structures networks hierarchically around Area 0 (Backbone Area) and selects unique 32-bit Router IDs (RIDs).',
        components: [
          {
            name: 'Router ID (RID)',
            detail: '32-bit identifier in dotted-decimal format (manual config, highest loopback IP, or highest physical IP).',
          },
          {
            name: 'Area 0 (Backbone)',
            detail: 'The central transit area (0.0.0.0) through which all inter-area routing traffic must pass.',
          },
          {
            name: 'Designated Router (DR) & BDR',
            detail: 'Elected on multi-access Ethernet segments to minimize adjacency meshes from n*(n-1)/2 to n.',
          },
          {
            name: 'Metric Cost Formula',
            detail: 'Cost = Reference Bandwidth / Interface Bandwidth (Default Reference: 100 Mbps).',
          },
        ],
      },
      step6_howItWorks: {
        steps: [
          {
            stepNumber: 1,
            title: 'Neighbor Discovery via Hello Packets',
            action: 'Routers send Hello multicasts to 224.0.0.5 every 10 seconds to form 2-WAY adjacencies.',
          },
          {
            stepNumber: 2,
            title: 'Database Synchronization',
            action: 'Routers exchange DBD summaries, request missing LSAs via LSR, and acknowledge updates reaching FULL state.',
          },
          {
            stepNumber: 3,
            title: 'Dijkstra SPF Computation',
            action: 'Each router runs SPF to calculate lowest-cost paths to all subnets and installs them into the routing table.',
          },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'OSPFv2 Common Packet Header',
        fields: [
          { fieldName: 'Version #', bitLength: '8 bits', hexSample: '0x02', description: 'OSPF Version 2 (IPv4).' },
          { fieldName: 'Router ID', bitLength: '32 bits', hexSample: '0x01010101', description: 'Originating router ID.' },
          { fieldName: 'Area ID', bitLength: '32 bits', hexSample: '0x00000000', description: 'Area 0.' },
        ],
      },
      step8_visualExplanation: {
        type: 'OSPF_TOPOLOGY_SIMULATION',
        title: '3-Router Multi-Access OSPF Adjacency & Dijkstra Tree',
        description: 'Visualize OSPF Hello neighbor states, DR/BDR election, and dynamic shortest path recalculation upon link failure.',
      },
      step9_workedExample: {
        title: 'Calculating SPF Cost across Redundant Links',
        problemStatement: 'R1 connects to R2 (Cost 10) and R3 (Cost 10). R2 connects to R3 (Cost 5). R2 connects to Subnet (Cost 1). Determine optimal path.',
        stepByStepSolution: [
          'Path A (via R2): 10 + 1 = 11.',
          'Path B (via R3): 10 + 5 + 1 = 16.',
          'R1 chooses Path A with metric 11.',
        ],
        finalResult: 'Optimal path is direct via R2 with Cost 11.',
      },
      step10_realWorldScenario: {
        topology: 'Enterprise Campus Core Dual-Homed Links',
        scenarioText: 'A fiber cut severs primary uplink; OSPF detects interface down and reconverges data plane in <50ms.',
        engineeringContext: 'Use auto-cost reference-bandwidth 100000 on modern 10G/100G networks.',
      },
      step11_deviceBehavior: {
        hostBehavior: 'Host PCs do not speak OSPF; edge interfaces should use passive-interface.',
        nicBehavior: 'Receives multicast frames for 224.0.0.5 and 224.0.0.6.',
        switchOrRouterBehavior: 'Router maintains LSDB and executes Dijkstra SPF on topology change.',
      },
      step12_cliTooling: [
        {
          command: 'show ip ospf neighbor',
          description: 'Displays formed neighbor adjacencies and states (FULL/DR, FULL/BDR).',
          expectedOutput: 'Neighbor ID Pri State Dead Time Address Interface\n2.2.2.2 1 FULL/DR 00:00:34 10.0.12.2 Gi0/1',
          proofExplanation: 'Confirms full database synchronization with neighbor router.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'OSPF adjacency stuck in EXSTART.',
          possibleCauses: ['MTU mismatch on connecting router interfaces'],
          diagnosticSteps: ['Check interface MTU on both ends.'],
          remediation: 'Set matching MTU on both interfaces.',
        },
      ],
      step14_commonMistakes: [
        { misconception: 'Mismatched Hello/Dead timers.', correction: 'Hello and Dead timers must match exactly to form an adjacency.' },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'Rogue OSPF LSA Injection',
        mitigationStrategy: 'Configure OSPF cryptographic authentication (MD5/SHA) on all transit links.',
      },
      step16_examPrep: {
        keyExamPoints: ['Protocol 89, AD 110, Multicast 224.0.0.5/6, 7 neighbor states.'],
        frequentTraps: ['DROTHER routers stay in 2-WAY state with each other on broadcast networks.'],
      },
      step17_practicalLabRef: {
        title: 'Guided Practice: Single-Area OSPF Troubleshooting',
        scenario: 'Configure OSPF Area 0, verify neighbor states, and resolve MTU mismatch.',
        tasks: ['Run show ip ospf neighbor and verify FULL states.'],
        verificationMethod: 'Verify all subnets present in show ip route ospf.',
      },
      step18_masterySummary: {
        summaryPoints: ['OSPF is a link-state protocol using Dijkstra SPF to build identical LSDB maps.'],
        nextLessonBridge: 'Proceed to NET-305 for ACLs and Firewalls.',
      },
    },
    questions: [
      {
        text: 'Two OSPF routers connected across a point-to-point link are stuck in the EXSTART neighbor state. What is the most likely cause?',
        options: ['An IP MTU mismatch between the two router interfaces', 'Different STP priorities', 'Priorities both set to 1', 'Copper cabling used'],
        correctOption: 0,
        explanation: 'During ExStart/Exchange, routers exchange DBD packets containing interface MTU. If MTUs mismatch, the slave rejects the DBD and the adjacency hangs in EXSTART.',
        explanationsJson: { 1: 'STP is Layer 2.', 2: 'Priority 1 is standard.', 3: 'Physical media is irrelevant.' },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'OSPF MTU Mismatch',
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
    stepMetadata: {
      step1_objective:
        'Master Wireshark PCAP capture engine architecture, Npcap driver hooks, Berkeley Packet Filter (BPF) syntax, advanced display filters, TCP stream reconstruction, and packet forensics.',
      step2_prerequisites: ['net-204-tcp-udp-transport-overview', 'Ethernet and IP header anatomy'],
      step3_whyItMatters:
        'Packet analysis provides empirical ground truth during outages and security breaches. Network engineers dissect raw frame bytes when high-level diagnostic logs are insufficient.',
      step4_coreConcept:
        'Wireshark captures network frames directly from NICs placed in Promiscuous Mode. It parses raw binary frame bytes against dissecting libraries, organizing telemetry into Packet List, Packet Details (OSI Protocol Tree), and Packet Bytes (Hex Dump) views.',
      step5_technicalAnatomy: {
        title: 'Wireshark Architecture & GUI Inspection Engine',
        description:
          'Wireshark uses Npcap/libpcap driver hooks to copy raw frames from the network interface buffer before passing data to dissection engines.',
        components: [
          { name: 'Capture Engine (Npcap)', detail: 'Kernel-level driver capturing frames directly from physical NIC in promiscuous mode.' },
          { name: 'Packet List Pane', detail: 'Displays summary table of packet number, timestamp, source IP, destination IP, protocol, length.' },
          { name: 'Packet Details Pane', detail: 'Expandable OSI layer tree displaying parsed frame headers.' },
          { name: 'Packet Bytes Pane', detail: 'Raw hexadecimal and ASCII byte stream view of the selected packet.' },
        ],
      },
      step6_howItWorks: {
        steps: [
          { stepNumber: 1, title: 'Promiscuous Mode Capture', action: 'NIC copies all frames on physical segment regardless of destination MAC.' },
          { stepNumber: 2, title: 'BPF Capture Filtering', action: 'Kernel applies BPF filter to discard unwanted packets before buffer storage.' },
          { stepNumber: 3, title: 'Display Filtering', action: 'Apply post-capture display filters (e.g. tcp.flags.syn == 1) to isolate target streams.' },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'Wireshark Dissected TCP SYN Packet',
        fields: [
          { fieldName: 'Ethernet II Header', bitLength: '14 Bytes', hexSample: 'Dst: 00:1a... Src: 00:1a...', description: 'L2 Framing.' },
          { fieldName: 'IPv4 Header', bitLength: '20 Bytes', hexSample: 'Src: 192.168.1.10 Dst: 172.16.0.5', description: 'L3 IP.' },
          { fieldName: 'TCP Header', bitLength: '32 Bytes', hexSample: 'Port: 51234 -> 80 [SYN]', description: 'L4 TCP SYN.' },
        ],
      },
      step8_visualExplanation: {
        type: 'WIRESHARK_INSPECTOR',
        title: 'Interactive Wireshark PCAP Frame Inspector & Stream Reconstructor',
        description: 'Inspect live PCAP frame captures, filter by protocol/IP/flags, click protocol tree layers to highlight hex byte ranges, and follow TCP streams.',
      },
      step9_workedExample: {
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
      step10_realWorldScenario: {
        topology: 'Enterprise Web Application Troubleshooting',
        scenarioText: 'Engineer identifies high volume of TCP Retransmission and Dup ACK frames, pointing to physical link packet drops on switch.',
        engineeringContext: 'Wireshark expert info flags isolate hardware degradation vs application errors.',
      },
      step11_deviceBehavior: {
        hostBehavior: 'Host socket driver passes captured frame buffers to Npcap kernel driver.',
        nicBehavior: 'Promiscuous mode disables MAC filtering to copy all wire signals.',
        switchOrRouterBehavior: 'Switches configured with SPAN mirror traffic to monitoring port.',
      },
      step12_cliTooling: [
        {
          command: 'tshark -i eth0 -n -c 5 "tcp port 80"',
          description: 'Terminal-based capture utility collecting HTTP packets.',
          expectedOutput: '1 0.000000 192.168.1.10 -> 172.16.0.5 TCP 66 51234 -> 80 [SYN] Seq=0',
          proofExplanation: 'Captures and displays TCP handshake packets directly from the terminal.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'High volume of TCP Retransmission alerts.',
          possibleCauses: ['Physical cable degradation causing packet drops'],
          diagnosticSteps: ['Filter by tcp.analysis.retransmission and correlate with interface error counters.'],
          remediation: 'Replace damaged patch cable or fix duplex settings.',
        },
      ],
      step14_commonMistakes: [
        { misconception: 'Confusing BPF Capture Filters with Wireshark Display Filters.', correction: 'Capture filters filter before disk write; display filters analyze stored PCAP frames.' },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'Unencrypted Credential Sniffing',
        mitigationStrategy: 'Enforce end-to-end TLS encryption so eavesdroppers cannot read application payloads.',
      },
      step16_examPrep: {
        keyExamPoints: ['Display filter syntax: ip.addr == x, tcp.port == 80, tcp.flags.syn == 1.'],
        frequentTraps: ['Using single = instead of == in display filters.'],
      },
      step17_practicalLabRef: {
        title: 'Guided Practice: Wireshark PCAP Capture Filter & TCP Stream Forensics',
        scenario: 'Open PCAP trace, apply display filters to isolate TCP handshakes, and identify TCP RST flags.',
        tasks: ['Apply display filter tcp.flags.syn == 1 and find RST frame.'],
        verificationMethod: 'Isolate error frame number in terminal.',
      },
      step18_masterySummary: {
        summaryPoints: ['Wireshark uses Promiscuous Mode to capture raw frames and parses them into protocol trees.'],
        nextLessonBridge: 'Complete the NET-404 Capstone to earn your certification.',
      },
    },
    questions: [
      {
        text: 'Which Wireshark display filter correctly isolates initial TCP SYN connection request packets (where SYN=1 and ACK=0)?',
        options: ['tcp.flags.syn == 1 && tcp.flags.ack == 0', 'tcp.port == 80 || ip.proto == 6', 'bpf filter syn only', 'http.request == true'],
        correctOption: 0,
        explanation: '`tcp.flags.syn == 1 && tcp.flags.ack == 0` filters strictly for initial TCP connection requests.',
        explanationsJson: { 1: 'Filters all HTTP packets.', 2: 'Invalid syntax.', 3: 'Filters HTTP requests.' },
        difficulty: CourseLevel.ADVANCED,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Wireshark Display Filters',
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

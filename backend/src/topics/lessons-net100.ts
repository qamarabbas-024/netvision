import { CourseLevel, LessonType, CognitiveLevel, QuestionType } from '@prisma/client';
import { BenchmarkLessonFullDefinition } from './lessons-net300-400';

export const LESSONS_NET100: BenchmarkLessonFullDefinition[] = [
  // =========================================================================
  // COURSE: NET-101 (Digital Fundamentals & Physical Layer Media)
  // =========================================================================

  // -------------------------------------------------------------------------
  // 1. NET-101: Bits, Bytes, Binary & Hexadecimal
  // -------------------------------------------------------------------------
  {
    courseCode: 'NET-101',
    slug: 'net-101-bits-bytes-binary-hex',
    title: 'Bits, Bytes, Binary & Hexadecimal',
    type: LessonType.THEORY,
    durationMinutes: 20,
    order: 1,
    visualizationType: 'BINARY_CONVERTER',
    introduction:
      'Master the foundational digital alphabet of computer networking: Base-2 binary bits, 8-bit bytes (octets), 4-bit nibbles, Base-16 hexadecimal notation, positional number conversions, and data rate bandwidth units (bps vs B/s).',
    contentV2: {
      objective:
        'Understand how all digital network communication is constructed from binary bits, how 8 bits form a byte, how hexadecimal notation concisely compresses binary data, and how to convert accurately between decimal, binary, and hexadecimal representations.',
      prerequisites: [
        'Basic arithmetic (addition, subtraction, multiplication, division)',
        'Understanding of decimal (Base-10) positional value (units, tens, hundreds)',
      ],
      whyItMatters:
        'Every physical wire and radio wave carries binary states (high/low voltage, light on/off). Network addresses (MAC and IPv6) are written in hexadecimal, while network link speeds are measured in bits per second (bps) and storage in Bytes (B). Fluency in binary, hex, and bandwidth units is the essential starting point for all networking.',
      explanation:
        'Digital systems use Binary (Base-2) because electronic circuits reliably differentiate between two electrical voltage states: 0 (Off/Low) and 1 (On/High). A single binary digit is a Bit. Eight contiguous bits form one Byte (also called an Octet in networking), which can represent 256 distinct values (0 to 255). Hexadecimal (Base-16) uses 16 digits (0–9 and A–F) to represent a 4-bit Nibble in a single character, allowing a full 8-bit byte to be written with just 2 hex characters.',
      components: [
        { name: 'Bit (b)', detail: 'The fundamental unit of digital information. Represents a single 0 or 1 binary state.' },
        { name: 'Nibble', detail: 'A group of 4 contiguous bits (0000 to 1111). Exactly equal to one hexadecimal digit (0 to F).' },
        { name: 'Byte / Octet (B)', detail: 'A group of 8 contiguous bits (00000000 to 11111111). Exactly equal to two hexadecimal digits (00 to FF). Values range from decimal 0 to 255 (256 distinct states).' },
        { name: 'Bandwidth vs Storage Units', detail: 'Network transmission speed is measured in bits per second (bps, Kbps, Mbps, Gbps). Data storage and file sizes are measured in Bytes (B, KB, MB, GB). 1 Byte = 8 bits.' },
      ],
      howItWorks: [
        { stepNumber: 1, title: 'Decimal to Binary (Subtraction Method)', action: 'Compare the decimal number against the 8 positional weights (128, 64, 32, 16, 8, 4, 2, 1). If the number is greater than or equal to the weight, place a 1 and subtract the weight; otherwise place a 0. Repeat through weight 1.' },
        { stepNumber: 2, title: 'Binary to Decimal (Summation Method)', action: 'Multiply each binary bit (0 or 1) by its positional column weight and sum all products (e.g., 11000000 = 128 + 64 = 192).' },
        { stepNumber: 3, title: 'Binary to Hexadecimal (Nibble Split)', action: 'Split the 8-bit byte into two 4-bit nibbles. Calculate the decimal value of each nibble (using weights 8, 4, 2, 1) and substitute the corresponding hex symbol (0-9 or A=10, B=11, C=12, D=13, E=14, F=15).' },
        { stepNumber: 4, title: 'Bandwidth Throughput Calculation', action: 'Convert network link rate in bits per second to Byte download speed by dividing by 8 (e.g., 100 Mbps / 8 = 12.5 MB/s maximum theoretical download speed).' },
      ],
      visualizer: {
        type: 'BINARY_CONVERTER',
        title: 'Interactive 8-Bit Positional Binary & Hex Converter',
        description: 'Toggle each of the 8 bit switches (128, 64, 32, 16, 8, 4, 2, 1) to observe real-time decimal summation, nibble division, and hexadecimal notation updates.',
      },
      workedExample: {
        title: 'Converting Decimal 202 to Binary and Hexadecimal & Calculating Download Speed',
        problemStatement: '1. Convert decimal number 202 into 8-bit binary and 2-digit hexadecimal.\n2. If an Internet connection has a bandwidth of 80 Mbps, what is the maximum theoretical download rate in MegaBytes per second (MB/s)?',
        stepByStepSolution: [
          'Step 1 (Binary): Compare 202 to positional weights: 202 >= 128 (1), 74 >= 64 (1), 10 < 32 (0), 10 < 16 (0), 10 >= 8 (1), 2 < 4 (0), 2 >= 2 (1), 0 < 1 (0) -> 11001010.',
          'Step 2 (Hexadecimal): Split 11001010 into nibbles: Left 1100 = 12 = C; Right 1010 = 10 = A -> 0xCA.',
          'Step 3 (Bandwidth conversion): 1 Byte = 8 bits. Download rate = 80 Mbps / 8 = 10 MB/s.',
        ],
        finalResult: 'Decimal 202 = Binary 11001010 = Hexadecimal 0xCA. Bandwidth of 80 Mbps = 10 MB/s file transfer speed.',
      },
      practice: [
        {
          id: 1,
          prompt: 'Convert decimal 192 into an 8-bit binary string.',
          expected: '11000000',
          hints: '192 = 128 + 64.',
        },
        {
          id: 2,
          prompt: 'Convert binary 11111111 into 2-digit hexadecimal.',
          expected: 'FF',
          hints: 'Left nibble 1111 = 15 (F), right nibble 1111 = 15 (F).',
        },
      ],
      recap: [
        'Binary is Base-2 (bits 0 and 1); Hexadecimal is Base-16 (0-9 and A-F).',
        '1 Byte = 8 bits = 2 Hex digits (00-FF), representing decimal values 0 to 255.',
        'Network bandwidth is measured in bits/sec (bps); divide Mbps by 8 to determine download rate in MB/s.',
      ],
    },
    questions: [
      {
        text: 'What is the binary representation of decimal integer 192?',
        options: ['11000000', '10101010', '11100000', '10000000'],
        correctOption: 0,
        explanation: 'Decimal 192 = 128 + 64 (11000000 in positional binary notation).',
        explanationsJson: { 1: '10101010 = 170.', 2: '11100000 = 224.', 3: '10000000 = 128.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Binary Conversion',
      },
      {
        text: 'A user has an Internet connection rated at 80 Mbps (Mega-bits per second). What is the maximum theoretical download speed in MegaBytes per second (MB/s)?',
        options: ['10 MB/s', '80 MB/s', '8 MB/s', '640 MB/s'],
        correctOption: 0,
        explanation: 'There are 8 bits in 1 Byte. 80 Mbps / 8 = 10 MB/s.',
        explanationsJson: { 1: '80 MB/s assumes 1 bit equals 1 Byte.', 2: 'Incorrect calculation.', 3: 'Multiplied instead of dividing.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Bandwidth vs Storage Units',
      },
      {
        text: 'How many bits are in a single hexadecimal character (such as "A" or "F")?',
        options: ['4 bits (1 nibble)', '8 bits (1 byte)', '16 bits', '2 bits'],
        correctOption: 0,
        explanation: 'Each hexadecimal digit represents a 4-bit nibble (values 0000 to 1111 / decimal 0 to 15).',
        explanationsJson: { 1: '8 bits is 1 byte, represented by TWO hex digits.', 2: '16 bits is 2 bytes (4 hex digits).', 3: '2 bits has only 4 states (0-3).' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Hexadecimal to Binary Relationship',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 2. NET-101: Physical Network Interfaces, Media & Transceivers
  // -------------------------------------------------------------------------
  {
    courseCode: 'NET-101',
    slug: 'network-devices-overview',
    title: 'Physical Network Interfaces, Media & Transceivers',
    type: LessonType.THEORY,
    durationMinutes: 25,
    order: 3,
    visualizationType: 'MEDIA_INSPECTOR',
    introduction:
      'Explore Layer 1 physical infrastructure: copper twisted pair cabling (Cat5e/Cat6/Cat6a, RJ-45), optical fiber media (Single-Mode vs Multi-Mode), modular optical transceivers (SFP/SFP+/QSFP), and Power over Ethernet (PoE 802.3af/at/bt).',
    stepMetadata: {
      step1_objective:
        'Understand copper twisted pair, optical fiber types (SMF vs MMF), modular optical transceivers (SFP/SFP+), and Power over Ethernet (PoE) standards.',
      step2_prerequisites: ['net-101-bits-bytes-binary-hex'],
      step3_whyItMatters:
        'Selecting the wrong cable or transceiver causes link down errors, signal attenuation, and underpowered access points.',
      step4_coreConcept:
        'Copper twisted pair (RJ-45) uses electrical pulses up to 100 meters. Optical fiber uses light pulses inside glass cores, providing long distance and zero EMI. SFP/SFP+ transceivers adapt switch ports to media types. PoE supplies DC power over Ethernet cables.',
      step5_technicalAnatomy: {
        title: 'Cabling Categories, Fiber Types & Modular Transceiver Specifications',
        description: 'Comparison of copper standards, optical propagation, and transceivers.',
        components: [
          { name: 'Twisted Pair Copper (Cat5e/6/6a)', detail: '8 conductors in 4 pairs, RJ-45, 100m channel limit.' },
          { name: 'Single-Mode Fiber (SMF)', detail: '9µm core, 1310/1550nm laser, long-haul (10-40km+), yellow jacket.' },
          { name: 'Multi-Mode Fiber (MMF)', detail: '50/62.5µm core, 850nm LED/VCSEL, 300-550m, aqua/orange jacket.' },
          { name: 'SFP / SFP+ / QSFP', detail: 'SFP (1G), SFP+ (10G), QSFP+ (40G), QSFP28 (100G).' },
          { name: 'PoE Standards', detail: '802.3af (15.4W), 802.3at (PoE+ 30W), 802.3bt (PoE++ 60-90W).' },
        ],
      },
      step6_howItWorks: {
        steps: [
          { stepNumber: 1, title: 'Media Selection', action: 'Evaluate distance (<100m copper, <400m MMF, >400m SMF) and PoE requirements.' },
          { stepNumber: 2, title: 'Transceiver Insertion', action: 'Insert matching SFP/SFP+ module into switch cage and connect patch cable.' },
          { stepNumber: 3, title: 'PoE Negotiation', action: 'Switch detects PD signature resistance and applies power.' },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'Physical Media & PoE Specifications',
        fields: [
          { fieldName: 'Copper Limit', bitLength: '100m', hexSample: 'Cat6/6a', description: 'Max copper channel distance.' },
          { fieldName: 'PoE+ 802.3at', bitLength: '30W Output', hexSample: '50-57V DC', description: 'Delivers up to 25.5W to powered devices.' },
        ],
      },
      step8_visualExplanation: {
        type: 'MEDIA_INSPECTOR',
        title: 'Physical Media & Transceiver Selection Guide',
        description: 'Interactive comparison of copper, SMF, MMF, SFP+ transceivers, and PoE budgets.',
      },
      step9_workedExample: {
        title: 'Campus 450m Uplink & PoE Budgeting',
        problemStatement: 'Connect two buildings 450m apart at 10G and power 24 APs (22W each).',
        stepByStepSolution: [
          'Distance 450m exceeds copper (100m) and MMF (300-400m); select SMF (10GBASE-LR).',
          '24 APs * 22W = 528W usable -> IEEE 802.3at (PoE+) with >=600W switch budget.',
        ],
        finalResult: '10GBASE-LR SMF with 802.3at PoE+ switch.',
      },
      step10_realWorldScenario: {
        topology: 'Industrial Plant EMI',
        scenarioText: 'Replacing UTP with optical fiber eliminates packet drops from motor electrical noise.',
        engineeringContext: 'Fiber optic media is 100% immune to electromagnetic interference.',
      },
      step11_deviceBehavior: {
        hostBehavior: 'Autonegotiates speed and duplex.',
        nicBehavior: 'PHY encodes bits into electrical or optical signals.',
        switchOrRouterBehavior: 'Monitors optical Rx levels in dBm and PoE power per port.',
      },
      step12_cliTooling: [
        {
          command: 'show interface status',
          description: 'Displays link speed, duplex, and transceiver type.',
          expectedOutput: 'Gi1/0/1  Uplink  connected  10G  10Gbase-LR',
          proofExplanation: 'Confirms 10G Single-Mode fiber connection.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'Fiber link down with dark LED.',
          possibleCauses: ['Tx and Rx fiber strands reversed'],
          diagnosticSteps: ['Swap Tx and Rx strands on duplex LC connector.'],
          remediation: 'Reverse patch polarity.',
        },
      ],
      step14_commonMistakes: [
        { misconception: 'Running copper past 100 meters.', correction: 'Standard copper Ethernet maxes out at 100 meters.' },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'Physical cable wiretapping.',
        mitigationStrategy: 'Lock wiring closets; use fiber optics for sensitive spans.',
      },
      step16_examPrep: {
        keyExamPoints: ['Copper: 100m.', 'SMF: 9µm laser long haul.', 'MMF: 50µm LED short haul.', 'PoE: af 15.4W, at 30W, bt 90W.'],
        frequentTraps: ['Selecting Cat6 for a 150m run (max is 100m).'],
      },
      step17_practicalLabRef: {
        title: 'Guided Practice: Enterprise Physical Media & PoE Power Budget Calculation',
        scenario: 'Audit transceivers and PoE budgets.',
        tasks: ['Select correct fiber type for 600m link.', 'Audit switch PoE output.'],
        verificationMethod: 'Verify show interface status output.',
      },
      step18_masterySummary: {
        summaryPoints: ['Copper is standard for <100m; Fiber for >100m and high-EMI.', 'PoE powers devices over twisted pair.'],
        nextLessonBridge: 'Proceed to NET-102 for Network Architecture and Topologies.',
      },
    },
    questions: [
      {
        text: 'A network engineer needs to connect two buildings 800 meters apart at 10 Gbps. Which media should be selected?',
        options: ['Single-Mode Fiber (SMF) with 10GBASE-LR SFP+', 'Cat6a Copper UTP', 'Multi-Mode Fiber (MMF) with 10GBASE-SR', 'Cat5e Shielded STP'],
        correctOption: 0,
        explanation: '800 meters exceeds copper (100m) and MMF (300-400m). Single-Mode Fiber (10GBASE-LR) is rated for up to 10 km.',
        explanationsJson: { 1: 'Cat6a is limited to 100m.', 2: 'MMF is limited to ~300-400m.', 3: 'Cat5e is limited to 100m.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Media Selection: Distance and Bandwidth',
      },
    ],
    lab: {
      title: 'Guided Practice: Enterprise Physical Media & PoE Power Budget Calculation',
      instructions: '1. Inspect switch port media with show interface status.\n2. Audit PoE with show power inline.',
      difficulty: CourseLevel.FOUNDATIONAL,
      estimatedMinutes: 15,
      initialTopologyJson: { switchName: 'Core-SW1', ports: [{ port: 'Gi1/0/1', type: '10Gbase-LR' }] },
      tasks: ['Run show interface status.'],
    },
  },

  // -------------------------------------------------------------------------
  // 3. NET-102: What is a Computer Network?
  // -------------------------------------------------------------------------
  {
    courseCode: 'NET-102',
    slug: 'level-0-what-is-a-computer-network',
    title: 'What is a Computer Network?',
    type: LessonType.THEORY,
    durationMinutes: 20,
    order: 1,
    visualizationType: 'NETWORK_GRAPH',
    introduction:
      'Discover the fundamental principles of data telecommunications: how autonomous computing nodes connect across shared media, the Sender-Receiver-Message-Medium-Protocol communication model, and transmission modes (Simplex, Half-Duplex, Full-Duplex).',
    stepMetadata: {
      step1_objective:
        'Understand what constitutes a computer network, analyze the 5 foundational elements of communication (Sender, Receiver, Medium, Message, Protocol), and differentiate between Simplex, Half-Duplex, and Full-Duplex transmission modes.',
      step2_prerequisites: ['net-101-bits-bytes-binary-hex'],
      step3_whyItMatters:
        'All modern computing relies on standard communication models and duplex synchronization.',
      step4_coreConcept:
        'A computer network connects autonomous endpoints to share data and resources over communication links. Every communication transaction requires: Sender, Receiver, Medium, Message, and Protocol. Transmission modes: Simplex (one-way), Half-Duplex (two-way turn-taking), and Full-Duplex (simultaneous bidirectional).',
      step5_technicalAnatomy: {
        title: 'Communication Framework & Transmission Duplex Modes',
        description: 'The 5 elements and directional modes of telecommunication.',
        components: [
          { name: 'Sender', detail: 'Source endpoint that generates and transmits the message.' },
          { name: 'Receiver', detail: 'Destination endpoint that captures and decodes the message.' },
          { name: 'Medium', detail: 'Guided (copper/fiber) or unguided (wireless RF) transmission channel.' },
          { name: 'Message', detail: 'The digital payload (data, text, audio, video).' },
          { name: 'Protocol', detail: 'Rules governing syntax, semantics, and timing.' },
          { name: 'Duplex Modes', detail: 'Simplex (1-way), Half-Duplex (2-way sequential), Full-Duplex (2-way simultaneous).' },
        ],
      },
      step6_howItWorks: {
        steps: [
          { stepNumber: 1, title: 'Encoding', action: 'Sender encodes digital data into physical signals.' },
          { stepNumber: 2, title: 'Channel Propagation', action: 'Signals traverse physical medium.' },
          { stepNumber: 3, title: 'Decoding', action: 'Receiver decodes signals back into data.' },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'Communication Model & Duplex Classification',
        fields: [
          { fieldName: 'Sender / Receiver', bitLength: 'Endpoints', hexSample: 'Host A -> Host B', description: 'Communication endpoints.' },
          { fieldName: 'Channel Mode', bitLength: 'Full-Duplex', hexSample: 'Simultaneous Tx/Rx', description: 'Bidirectional non-blocking transmission.' },
        ],
      },
      step8_visualExplanation: {
        type: 'NETWORK_GRAPH',
        title: 'Network Communication Flow & Duplex Visualizer',
        description: 'Observe message flow and toggle Simplex, Half-Duplex, and Full-Duplex modes.',
      },
      step9_workedExample: {
        title: 'Half-Duplex vs Full-Duplex Throughput',
        problemStatement: 'Compare 100 Mbps Half-Duplex vs 100 Mbps Full-Duplex.',
        stepByStepSolution: [
          'Half-Duplex shares 1 channel; hosts take turns; aggregate capacity = 100 Mbps.',
          'Full-Duplex has dedicated Tx and Rx channels; simultaneous 100 Mbps each way = 200 Mbps aggregate capacity.',
        ],
        finalResult: 'Full-Duplex provides 200 Mbps aggregate collision-free capacity.',
      },
      step10_realWorldScenario: {
        topology: 'Duplex Mismatch Outage',
        scenarioText: 'Printer on Half-Duplex connected to Full-Duplex switch suffers late collisions and packet loss.',
        engineeringContext: 'Duplex mismatches cause severe packet drops.',
      },
      step11_deviceBehavior: {
        hostBehavior: 'Autonegotiates speed and duplex upon link up.',
        nicBehavior: 'Uses separate wire pairs for Tx (pins 1,2) and Rx (pins 3,6) in full duplex.',
        switchOrRouterBehavior: 'Maintains independent ingress and egress buffers per port.',
      },
      step12_cliTooling: [
        {
          command: 'powershell -Command "Get-NetAdapter | Select-Object Name, Status, LinkSpeed, FullDuplex"',
          description: 'Checks host adapter link speed and full-duplex status.',
          expectedOutput: 'Ethernet  Up  1 Gbps  True',
          proofExplanation: 'Verifies 1 Gbps Full-Duplex operation.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'High CRC errors and late collisions.',
          possibleCauses: ['Duplex mismatch between switch port and host NIC'],
          diagnosticSteps: ['Check duplex on switch and host adapter.'],
          remediation: 'Configure matching Full-Duplex or enable Auto-Negotiation on both ends.',
        },
      ],
      step14_commonMistakes: [
        { misconception: 'Thinking Half-Duplex is Simplex.', correction: 'Half-Duplex is bidirectional (one at a time); Simplex is strictly one-way.' },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'Eavesdropping on shared hub media.',
        mitigationStrategy: 'Use full-duplex switches to microsegment traffic.',
      },
      step16_examPrep: {
        keyExamPoints: ['5 elements: Sender, Receiver, Medium, Message, Protocol.', 'Simplex, Half-Duplex, Full-Duplex.'],
        frequentTraps: ['Confusing Half-Duplex with Simplex.'],
      },
      step17_practicalLabRef: {
        title: 'Guided Practice: Network Node Discovery & Duplex Verification',
        scenario: 'Verify 5 communication elements and full-duplex status.',
        tasks: ['Verify link speed and full-duplex status on host network adapter.'],
        verificationMethod: 'Confirm 1000 Mbps Full-Duplex with 0 collisions.',
      },
      step18_masterySummary: {
        summaryPoints: ['A network connects autonomous nodes to share data.', 'Full-Duplex provides simultaneous bidirectional transmission.'],
        nextLessonBridge: 'Proceed to NET-102 Lesson 2 for Client-Server and Peer-to-Peer models.',
      },
    },
    questions: [
      {
        text: 'Which primary characteristic fundamentally distinguishes a computer network from a collection of isolated standalone computers?',
        options: [
          'The ability of interconnected endpoints to exchange data and share resources over shared communication links',
          'The requirement that every connected node runs the exact same operating system',
          'The continuous distribution of electrical alternating current',
          'The restriction that data travels in one single direction',
        ],
        correctOption: 0,
        explanation: 'A network is defined as interconnected autonomous nodes that exchange data and share resources over communication channels.',
        explanationsJson: { 1: 'Networks are heterogeneous.', 2: 'Power is utility infrastructure.', 3: 'Networks are bidirectional.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Network Definition',
      },
    ],
    lab: {
      title: 'Guided Practice: Network Node Discovery & Duplex Verification',
      instructions: '1. Inspect simulated link.\n2. Verify 5 components of communication.\n3. Check full-duplex status.',
      difficulty: CourseLevel.FOUNDATIONAL,
      estimatedMinutes: 15,
      initialTopologyJson: { hostA: 'PC-1', hostB: 'PC-2', medium: 'Cat6', duplex: 'Full-Duplex' },
      tasks: ['Verify 1 Gbps Full-Duplex.'],
    },
  },

  // -------------------------------------------------------------------------
  // 4. NET-102: Client-Server & Peer-to-Peer Architecture
  // -------------------------------------------------------------------------
  {
    courseCode: 'NET-102',
    slug: 'level-0-client-and-server-architecture',
    title: 'Client-Server & Peer-to-Peer Architecture',
    type: LessonType.THEORY,
    durationMinutes: 20,
    order: 2,
    visualizationType: 'CLIENT_SERVER_FLOW',
    introduction:
      'Master the core architectural models of distributed networking: Centralized Client-Server request/response systems vs Decentralized Peer-to-Peer (P2P) resource sharing, comparing scalability, administration, and fault tolerance.',
    stepMetadata: {
      step1_objective:
        'Understand Client and Server roles, analyze Request/Response transaction cycles, and evaluate Client-Server vs Peer-to-Peer (P2P) architectural trade-offs.',
      step2_prerequisites: ['level-0-what-is-a-computer-network'],
      step3_whyItMatters:
        'Distributed systems are designed around either centralized client-server or decentralized P2P models.',
      step4_coreConcept:
        'Client-Server: asymmetric model where Clients send requests to centralized Servers that passively listen on designated ports. Provides central management and security, but the server is a Single Point of Failure (SPOF). P2P: symmetric decentralized model where peers act simultaneously as clients and servers, scaling capacity dynamically with active users.',
      step5_technicalAnatomy: {
        title: 'Centralized vs Decentralized Architecture Anatomy',
        description: 'Comparison of server daemons vs peer swarms.',
        components: [
          { name: 'Client Node', detail: 'Initiates service requests; uses ephemeral outgoing ports.' },
          { name: 'Server Daemon', detail: 'Passively listens on standard well-known ports (e.g. 80/443, 53) to serve requests.' },
          { name: 'Request / Response', detail: 'Synchronous/asynchronous exchange of parameters and payloads.' },
          { name: 'P2P Peer Node', detail: 'Symmetric node acting as both client and server.' },
        ],
      },
      step6_howItWorks: {
        steps: [
          { stepNumber: 1, title: 'Server Listening', action: 'Server daemon binds to IP and port, listening for incoming connections.' },
          { stepNumber: 2, title: 'Client Request', action: 'Client initiates connection and transmits request payload.' },
          { stepNumber: 3, title: 'Server Response', action: 'Server processes request and returns status code and data.' },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'Client-Server vs P2P Flow',
        fields: [
          { fieldName: 'Client (Initiator)', bitLength: 'Source', hexSample: 'Ephemeral Port', description: 'Initiates request.' },
          { fieldName: 'Server (Listener)', bitLength: 'Destination', hexSample: 'Port 80/443', description: 'Processes request.' },
        ],
      },
      step8_visualExplanation: {
        type: 'CLIENT_SERVER_FLOW',
        title: 'Client-Server vs P2P Architecture Simulator',
        description: 'Simulate server bottleneck under load vs P2P swarm distribution.',
      },
      step9_workedExample: {
        title: 'Bandwidth Scaling: 1 GB File to 1,000 Users',
        problemStatement: 'Server has 1 Gbps (125 MB/s) upload. Users have 20 Mbps (2.5 MB/s) upload.',
        stepByStepSolution: [
          'Client-Server: 1,000 GB / 125 MB/s = 8,000 seconds (2.22 hours) server bottleneck.',
          'P2P: Aggregate upload capacity reaches 1,000 * 2.5 MB/s = 2,500 MB/s, distributing in minutes.',
        ],
        finalResult: 'Client-Server is constrained by server upload bandwidth; P2P aggregates user bandwidth.',
      },
      step10_realWorldScenario: {
        topology: 'Web Server Crash under Traffic Spike',
        scenarioText: 'E-commerce website crashes from flash sale; adding CDN edge caches offloads 95% of traffic.',
        engineeringContext: 'CDNs distribute client-server workloads across edge nodes.',
      },
      step11_deviceBehavior: {
        hostBehavior: 'Clients allocate ephemeral ports (49152-65535).',
        nicBehavior: 'Server NICs use RSS to distribute interrupts across CPU cores.',
        switchOrRouterBehavior: 'Load balancers distribute requests across server pools.',
      },
      step12_cliTooling: [
        {
          command: 'curl -I https://www.google.com',
          description: 'Issues an HTTP HEAD request and displays response headers.',
          expectedOutput: 'HTTP/2 200\nserver: gws',
          proofExplanation: 'Demonstrates request and 200 OK response.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: '504 Gateway Timeout or Connection Refused.',
          possibleCauses: ['Server daemon down or connection queue saturated'],
          diagnosticSteps: ['Check service status and listening ports.'],
          remediation: 'Restart daemon or scale backend server capacity.',
        },
      ],
      step14_commonMistakes: [
        { misconception: 'Assuming servers must be giant mainframe hardware.', correction: 'A server is a software role; any computer running a listening service is a server.' },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'Centralized server DDoS floods.',
        mitigationStrategy: 'Deploy reverse proxies, rate limiting, and Anycast CDNs.',
      },
      step16_examPrep: {
        keyExamPoints: ['Client initiates; Server listens.', 'Client-Server SPOF risk vs P2P swarm scalability.'],
        frequentTraps: ['Thinking P2P cannot transfer files rapidly.'],
      },
      step17_practicalLabRef: {
        title: 'Guided Practice: Client-Server Request Inspection & P2P Swarm Analysis',
        scenario: 'Inspect HTTP requests and server socket states.',
        tasks: ['Execute curl client request and verify 200 OK.'],
        verificationMethod: 'Verify HTTP 200 OK response.',
      },
      step18_masterySummary: {
        summaryPoints: ['Client-Server centralizes management but has SPOF risk.', 'P2P distributes load across all peers.'],
        nextLessonBridge: 'Proceed to NET-102 Lesson 3 for geographic scopes (LAN to WAN).',
      },
    },
    questions: [
      {
        text: 'In the classic Client-Server networking model, what is the primary role of a Server?',
        options: [
          'To passively listen on a designated network port, process incoming client requests, and return appropriate response data',
          'To continuously initiate random outgoing connections to client laptops',
          'To convert optical light into household electricity',
          'To physically terminate Ethernet cables in a building',
        ],
        correctOption: 0,
        explanation: 'A server runs a daemon listening on a known port to process incoming client requests and return responses.',
        explanationsJson: { 1: 'Clients initiate connections.', 2: 'Power is utility.', 3: 'Patch panels terminate cables.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Server Role & Passive Listening',
      },
    ],
    lab: {
      title: 'Guided Practice: Client-Server Request Inspection & P2P Swarm Analysis',
      instructions: '1. Inspect client-server request/response flow.\n2. Execute curl request.',
      difficulty: CourseLevel.FOUNDATIONAL,
      estimatedMinutes: 15,
      initialTopologyJson: { client: 'Client-Browser', server: 'Web-Server-01', port: 443 },
      tasks: ['Issue HTTP client request.'],
    },
  },

  // -------------------------------------------------------------------------
  // 5. NET-102: Network Geographic Scopes & Internet Hierarchy
  // -------------------------------------------------------------------------
  {
    courseCode: 'NET-102',
    slug: 'level-0-lan-wan-internet-boundaries',
    title: 'Network Geographic Scopes & Internet Hierarchy',
    type: LessonType.THEORY,
    durationMinutes: 25,
    order: 3,
    visualizationType: 'INTERNET_HIERARCHY_MAP',
    introduction:
      'Master the classification of networks by geographic scale (PAN, LAN, CAN, MAN, WAN) and explore the global architectural hierarchy of the Internet: Tier 1 Global Backbones, Tier 2 Regional Providers, Tier 3 Access ISPs, and Internet Exchange Points (IXPs).',
    stepMetadata: {
      step1_objective:
        'Understand geographic network categories (PAN, LAN, CAN, MAN, WAN) and master the tiered routing hierarchy and peering infrastructure of the global Internet.',
      step2_prerequisites: ['level-0-what-is-a-computer-network'],
      step3_whyItMatters:
        'Cabling, routing protocols, and costs depend heavily on whether designing a local LAN or a global WAN.',
      step4_coreConcept:
        'Geographic scopes: PAN (~1-10m, Bluetooth), LAN (building, Ethernet/Wi-Fi), CAN (campus, private fiber), MAN (city, Metro Ethernet), WAN (global, leased circuits). The Internet is hierarchical: Tier 1 ISPs peer settlement-free forming the global core; Tier 2 are regional; Tier 3 are local access providers. IXPs enable direct settlement-free peering between networks to bypass transit hops.',
      step5_technicalAnatomy: {
        title: 'Geographic Network Classifications & Tiered Internet Architecture',
        description: 'Network scales and ISP peering hierarchy.',
        components: [
          { name: 'PAN', detail: 'Personal scale (1-10m, Bluetooth/USB).' },
          { name: 'LAN', detail: 'Local single room/building owned by organization (1-10 Gbps).' },
          { name: 'CAN', detail: 'Campus multi-building private fiber network.' },
          { name: 'MAN', detail: 'Metropolitan city-wide network (5-50km).' },
          { name: 'WAN', detail: 'Spans regions/continents over carrier leased circuits.' },
          { name: 'Tier 1/2/3 ISPs & IXPs', detail: 'Tier 1 global settlement-free core; Tier 2 regional; Tier 3 access; IXP peering facility.' },
        ],
      },
      step6_howItWorks: {
        steps: [
          { stepNumber: 1, title: 'LAN Egress', action: 'Host sends packet to local default gateway router.' },
          { stepNumber: 2, title: 'Access ISP Uplink', action: 'Gateway routes packet to Tier 3 Access ISP.' },
          { stepNumber: 3, title: 'IXP Direct Peering', action: 'If destination is at local IXP, packet peers directly; otherwise ascends to Tier 2/1 transit.' },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'Geographic Scale Metrics & ISP Hierarchy',
        fields: [
          { fieldName: 'LAN Domain', bitLength: 'Single Building', hexSample: 'Private Ownership', description: 'Switched local infrastructure.' },
          { fieldName: 'Tier 1 Core', bitLength: 'Global Backbone', hexSample: 'BGP Peering', description: 'Settlement-free autonomous transit.' },
        ],
      },
      step8_visualExplanation: {
        type: 'INTERNET_HIERARCHY_MAP',
        title: 'Internet Hierarchy & Geographic Scope Explorer',
        description: 'Explore PAN, LAN, CAN, MAN, WAN and trace packet flow across Tier 1, 2, 3 ISPs and IXPs.',
      },
      step9_workedExample: {
        title: 'Tracing Packet Flow: Direct IXP Peering vs Tier 1 Transit',
        problemStatement: 'Compare London ISP fetching video via LINX IXP vs Tier 1 transit.',
        stepByStepSolution: [
          'IXP Peering: 4 router hops, 4 ms latency, $0 transit fees.',
          'Tiered Transit: 9+ router hops, 35 ms latency, paid per-megabit transit fees.',
        ],
        finalResult: 'IXP direct peering saves 5 hops, reduces latency by 31ms, and eliminates transit costs.',
      },
      step10_realWorldScenario: {
        topology: 'Global SD-WAN Enterprise',
        scenarioText: 'Enterprise connects NY, London, and Tokyo branch LANs via SD-WAN over global carrier circuits.',
        engineeringContext: 'SD-WAN manages traffic across hybrid WAN connections.',
      },
      step11_deviceBehavior: {
        hostBehavior: 'Transmits off-subnet packets to local default gateway.',
        nicBehavior: 'Operates in local Layer 1/2 domain.',
        switchOrRouterBehavior: 'Border routers run BGP-4 to exchange prefixes across IXPs and transit links.',
      },
      step12_cliTooling: [
        {
          command: 'tracert 8.8.8.8',
          description: 'Traces router hops from local LAN to internet core.',
          expectedOutput: '1  <1 ms  192.168.1.1\n2   8 ms  10.20.0.1\n3  11 ms  ixp-peer.google.com',
          proofExplanation: 'Shows LAN egress, ISP hop, and IXP peering.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'Local internet works but remote branch cannot be reached.',
          possibleCauses: ['WAN IPsec tunnel down or ISP routing failure'],
          diagnosticSteps: ['Trace route to remote branch IP to find failure point.'],
          remediation: 'Restart VPN tunnel or failover to secondary WAN link.',
        },
      ],
      step14_commonMistakes: [
        { misconception: 'Thinking CAN is WAN.', correction: 'CAN is private multi-building campus; WAN crosses public land via carrier circuits.' },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'Eavesdropping on public WAN circuits.',
        mitigationStrategy: 'Enforce IPsec or MACsec encryption on all WAN links.',
      },
      step16_examPrep: {
        keyExamPoints: ['PAN (1-10m), LAN (building), CAN (campus), MAN (city), WAN (global).', 'Tier 1 = settlement-free backbone.'],
        frequentTraps: ['Selecting WAN for a university campus (it is a CAN).'],
      },
      step17_practicalLabRef: {
        title: 'Guided Practice: Network Scope Classification & Traceroute Transit Analysis',
        scenario: 'Classify network scopes and trace ISP hops.',
        tasks: ['Classify PAN, LAN, MAN, and WAN scopes.', 'Run tracert 8.8.8.8.'],
        verificationMethod: 'Identify local gateway vs ISP hops.',
      },
      step18_masterySummary: {
        summaryPoints: ['Networks are classified by scale from PAN to WAN.', 'The Internet is a 3-tier ISP hierarchy optimized by IXP peering.'],
        nextLessonBridge: 'Proceed to NET-102 Lesson 4 for Network Topologies.',
      },
    },
    questions: [
      {
        text: 'How is a Campus Area Network (CAN) fundamentally distinguished from a Wide Area Network (WAN)?',
        options: [
          'A CAN interconnects multiple contiguous buildings on private property using private fiber, whereas a WAN spans vast distances across public property using leased carrier infrastructure',
          'A CAN operates only over satellite while a WAN uses copper',
          'A CAN does not use IP addresses',
          'A CAN is limited to 10 users',
        ],
        correctOption: 0,
        explanation: 'CAN connects buildings on private campus property; WAN spans long distances across public rights-of-way using leased circuits.',
        explanationsJson: { 1: 'Both use fiber/copper.', 2: 'Both use IP.', 3: 'User count is irrelevant.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'CAN vs WAN Classification',
      },
    ],
    lab: {
      title: 'Guided Practice: Network Scope Classification & Traceroute Transit Analysis',
      instructions: '1. Classify scopes.\n2. Run tracert 8.8.8.8.',
      difficulty: CourseLevel.FOUNDATIONAL,
      estimatedMinutes: 15,
      initialTopologyJson: { localGateway: '192.168.1.1', targetDns: '8.8.8.8' },
      tasks: ['Run tracert 8.8.8.8.'],
    },
  },

  // -------------------------------------------------------------------------
  // 6. NET-102: Physical & Logical Network Topologies
  // -------------------------------------------------------------------------
  {
    courseCode: 'NET-102',
    slug: 'network-topologies-overview',
    title: 'Physical & Logical Network Topologies',
    type: LessonType.THEORY,
    durationMinutes: 25,
    order: 4,
    visualizationType: 'TOPOLOGY_SIMULATOR',
    introduction:
      'Master the structural design of computer networks: Physical vs Logical topologies, Star, Full Mesh, Partial Mesh, Bus, Ring, and Tree architectures, evaluating fault tolerance, redundancy, single points of failure (SPOF), and cabling cost trade-offs.',
    stepMetadata: {
      step1_objective:
        'Understand Physical vs Logical topologies, analyze Star, Mesh, Bus, Ring, and Tree topologies, and calculate mesh link counts and SPOFs.',
      step2_prerequisites: ['level-0-what-is-a-computer-network'],
      step3_whyItMatters:
        'Topology design dictates fault tolerance, cabling cost, and high-availability architecture.',
      step4_coreConcept:
        'Physical topology is the physical cabling layout; Logical topology is the signal/data path. Star: central switch with point-to-point links (LAN standard; switch is SPOF). Full Mesh: every node connects to all others ($N(N-1)/2$ links, maximum fault tolerance). Bus: shared cable requiring 50Ω termination. Ring: closed sequential loop. Tree: hierarchical multi-tier design.',
      step5_technicalAnatomy: {
        title: 'Topology Comparison & Link Equations',
        description: 'Formulas, fault tolerance, and SPOF trade-offs.',
        components: [
          { name: 'Star Topology', detail: 'Central switch; single cable failure affects 1 host; switch is SPOF.' },
          { name: 'Full Mesh ($N(N-1)/2$)', detail: 'Max redundancy formula: $L = \\frac{N(N-1)}{2}$; no SPOF; high cost.' },
          { name: 'Partial Mesh', detail: 'Redundant links added only between critical core routers.' },
          { name: 'Bus Topology', detail: 'Shared cable; requires 50Ω terminating resistors to absorb reflections.' },
          { name: 'Ring Topology', detail: 'Closed token loop; break halts traffic unless dual-ring.' },
          { name: 'Tree / Hierarchical', detail: 'Core, Distribution, and Access tiers for structured scaling.' },
        ],
      },
      step6_howItWorks: {
        steps: [
          { stepNumber: 1, title: 'Mesh Calculation', action: 'Calculate links for 6 nodes: $6 \\times 5 / 2 = 15$ links.' },
          { stepNumber: 2, title: 'SPOF Audit', action: 'Identify non-redundant switches or single uplinks.' },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'Topology Design Metrics',
        fields: [
          { fieldName: 'Mesh Formula', bitLength: 'N(N-1)/2', hexSample: 'Full Redundancy', description: 'Calculates full mesh link requirements.' },
          { fieldName: 'Bus Terminator', bitLength: '50 Ohms', hexSample: 'Absorption', description: 'Eliminates signal reflection.' },
        ],
      },
      step8_visualExplanation: {
        type: 'TOPOLOGY_SIMULATOR',
        title: 'Network Topology & Failure Mode Simulator',
        description: 'Simulate link cuts and node failures across Star, Mesh, Bus, and Ring topologies.',
      },
      step9_workedExample: {
        title: 'Full Mesh Calculation for 8 Core Routers',
        problemStatement: 'Calculate links and cost difference between Full Mesh and Star for 8 routers ($5k/link).',
        stepByStepSolution: [
          'Full Mesh: $8 \\times 7 / 2 = 28$ links ($140,000/yr).',
          'Star: 8 links ($40,000/yr) with a central switch SPOF.',
        ],
        finalResult: 'Full mesh requires 28 links ($140k/yr); Star requires 8 links ($40k/yr).',
      },
      step10_realWorldScenario: {
        topology: 'Coaxial Bus Break Outage',
        scenarioText: 'Unplugged BNC T-connector halts entire wing; migrating to switched Star isolates faults.',
        engineeringContext: 'Star topologies provide cable fault isolation.',
      },
      step11_deviceBehavior: {
        hostBehavior: 'Transmits on dedicated link to switch in star networks.',
        nicBehavior: 'Operates in full duplex without collisions.',
        switchOrRouterBehavior: 'Isolates each port into its own collision domain.',
      },
      step12_cliTooling: [
        {
          command: 'show cdp neighbors',
          description: 'Discovers adjacent directly connected switches and routers.',
          expectedOutput: 'Device ID  Local Intrfce  Capability  Platform\nDist-SW1   Gig 1/0/24     S I         WS-C3850',
          proofExplanation: 'Maps physical topology links.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'Single host disconnect crashes entire floor.',
          possibleCauses: ['Legacy bus topology without termination or loop bridge'],
          diagnosticSteps: ['Inspect cabling infrastructure.'],
          remediation: 'Migrate to standard home-run star cabling to managed switch.',
        },
      ],
      step14_commonMistakes: [
        { misconception: 'Physical and logical topologies are always identical.', correction: 'Physical is cable layout; Logical is data path.' },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'Sniffing on shared bus.',
        mitigationStrategy: 'Switches microsegment unicast frames.',
      },
      step16_examPrep: {
        keyExamPoints: ['Mesh formula: $N(N-1)/2$.', 'Star is LAN standard.', 'Bus requires 50Ω termination.'],
        frequentTraps: ['Forgetting to divide by 2 in mesh formula.'],
      },
      step17_practicalLabRef: {
        title: 'Guided Practice: Physical & Logical Topology Auditing and Mesh Calculation',
        scenario: 'Calculate mesh links and audit CDP neighbors.',
        tasks: ['Calculate links for 6 full mesh routers using N*(N-1)/2.'],
        verificationMethod: 'Confirm calculated 15 links.',
      },
      step18_masterySummary: {
        summaryPoints: ['Star is ubiquitous in LANs; Full Mesh ($N(N-1)/2$) for core redundancy.'],
        nextLessonBridge: 'Proceed to NET-102 Lesson 5 for Wireless Networking.',
      },
    },
    questions: [
      {
        text: 'A network design team must calculate the total number of physical point-to-point links required to connect 6 core datacenter routers in a Full Mesh topology. What is the correct formula and link count?',
        options: [
          'Formula: N * (N - 1) / 2 = 6 * 5 / 2 = 15 physical links',
          'Formula: N * N = 36 physical links',
          'Formula: N - 1 = 5 physical links',
          'Formula: 2 * N = 12 physical links',
        ],
        correctOption: 0,
        explanation: 'Full mesh formula is $\\frac{N(N-1)}{2}$. For 6 routers: $\\frac{6 \\times 5}{2} = 15$ links.',
        explanationsJson: { 1: 'N*N overcounts.', 2: 'N-1 is tree.', 3: '2N is dual ring.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Full Mesh Link Calculation',
      },
    ],
    lab: {
      title: 'Guided Practice: Physical & Logical Topology Auditing and Mesh Calculation',
      instructions: '1. Calculate mesh links.\n2. Run show cdp neighbors.',
      difficulty: CourseLevel.FOUNDATIONAL,
      estimatedMinutes: 15,
      initialTopologyJson: { nodeCount: 6, calculatedLinks: 15 },
      tasks: ['Calculate mesh links for 6 nodes.'],
    },
  },

  // -------------------------------------------------------------------------
  // 7. NET-102: Wireless Networking, RF Spectrum & Wi-Fi Standards
  // -------------------------------------------------------------------------
  {
    courseCode: 'NET-102',
    slug: 'wireless-networking-overview',
    title: 'Wireless Networking, RF Spectrum & Wi-Fi Standards',
    type: LessonType.THEORY,
    durationMinutes: 25,
    order: 5,
    visualizationType: 'WIRELESS_SPECTRUM_ANALYZER',
    introduction:
      'Master the physics and engineering of wireless local area networks (WLANs / IEEE 802.11): Radio Frequency (RF) spectrum bands (2.4 GHz, 5 GHz, 6 GHz), Wi-Fi generations (Wi-Fi 4 through Wi-Fi 7), channel bonding, RF interference, and CSMA/CA collision avoidance mechanics.',
    stepMetadata: {
      step1_objective:
        'Understand RF transmission, analyze 2.4 GHz, 5 GHz, and 6 GHz spectrum bands, compare Wi-Fi generations (802.11n/ac/ax/be), and master CSMA/CA channel contention.',
      step2_prerequisites: ['level-0-what-is-a-computer-network'],
      step3_whyItMatters:
        'Configuring wrong channels or channel widths causes severe interference and dropped Wi-Fi connections.',
      step4_coreConcept:
        'WLANs transmit radio waves conforming to IEEE 802.11. Spectrum bands: 2.4 GHz (longer range, penetrates walls, only 3 non-overlapping channels: 1, 6, 11), 5 GHz (shorter range, 24+ non-overlapping channels, supports 40/80/160 MHz bonding), 6 GHz (Wi-Fi 6E/7 clean spectrum). Because wireless is half-duplex, 802.11 uses CSMA/CA (Carrier Sense Multiple Access with Collision Avoidance) and positive ACKs.',
      step5_technicalAnatomy: {
        title: 'RF Frequency Spectrum Bands & Wi-Fi Generations',
        description: 'Frequency characteristics and 802.11 standards.',
        components: [
          { name: '2.4 GHz Band', detail: 'Channels 1, 6, 11 are the ONLY non-overlapping 20 MHz channels.' },
          { name: '5 GHz Band', detail: '24+ non-overlapping channels; supports 40/80/160 MHz channel bonding.' },
          { name: '6 GHz Band', detail: '1,200 MHz of clean spectrum for Wi-Fi 6E and Wi-Fi 7 (up to 320 MHz channels).' },
          { name: 'Wi-Fi Generations', detail: 'Wi-Fi 4 (802.11n), Wi-Fi 5 (802.11ac), Wi-Fi 6 (802.11ax), Wi-Fi 7 (802.11be).' },
          { name: 'CSMA/CA', detail: 'Listen before talk; random backoff countdown; mandatory Layer 2 ACK.' },
        ],
      },
      step6_howItWorks: {
        steps: [
          { stepNumber: 1, title: 'Carrier Sense', action: 'Client checks if RF energy is above CCA threshold (-82 dBm).' },
          { stepNumber: 2, title: 'Random Backoff', action: 'Client counts down random slot times before transmitting.' },
          { stepNumber: 3, title: 'Positive ACK', action: 'Receiver returns 802.11 ACK frame confirming reception.' },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'IEEE 802.11 Wireless Frame & Channels',
        fields: [
          { fieldName: '2.4 GHz Non-Overlapping', bitLength: '20 MHz', hexSample: 'Channels 1, 6, 11', description: 'Only 3 non-overlapping channels.' },
          { fieldName: 'CSMA/CA ACK', bitLength: '14 Bytes', hexSample: 'Control Frame', description: 'Positive ACK on half-duplex RF media.' },
        ],
      },
      step8_visualExplanation: {
        type: 'WIRELESS_SPECTRUM_ANALYZER',
        title: 'RF Spectrum Analyzer & Channel Contention Engine',
        description: 'Inspect 2.4 GHz, 5 GHz, and 6 GHz spectrum allocations and test CSMA/CA backoffs.',
      },
      step9_workedExample: {
        title: 'Non-Overlapping 2.4 GHz Channel Plan',
        problemStatement: 'Assign 2.4 GHz channels to 3 APs covering an office floor.',
        stepByStepSolution: [
          'Channels 1, 6, and 11 are separated by 25 MHz with zero spectral overlap.',
          'Assign AP-1 -> Ch 1, AP-2 -> Ch 6, AP-3 -> Ch 11. Never use intermediate channels (2, 3, 4, etc.).',
        ],
        finalResult: 'Use Channels 1, 6, 11 exclusively.',
      },
      step10_realWorldScenario: {
        topology: 'Adjacent Channel Interference Slowdown',
        scenarioText: 'Setting APs to Channels 1, 2, 3 causes severe adjacent channel interference; reconfiguring to 1, 6, 11 fixes issue.',
        engineeringContext: 'Adjacent channel interference destroys packet preambles.',
      },
      step11_deviceBehavior: {
        hostBehavior: 'Sends 802.11 Probe Requests to scan SSIDs and signal strength (RSSI).',
        nicBehavior: 'Executes CCA and CSMA/CA backoffs.',
        switchOrRouterBehavior: 'WLC dynamically optimizes channel assignments and transmit power.',
      },
      step12_cliTooling: [
        {
          command: 'netsh wlan show interfaces',
          description: 'Displays Wi-Fi SSID, radio type, channel, and speed.',
          expectedOutput: 'Radio type: 802.11ax\nBand: 5 GHz\nChannel: 36\nTransmit rate: 1201 Mbps',
          proofExplanation: 'Confirms Wi-Fi 6 (802.11ax) on 5 GHz.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'Wi-Fi slow and dropping on 2.4 GHz.',
          possibleCauses: ['AP set to overlapping channel like 3 or 4'],
          diagnosticSteps: ['Scan RF environment and check active channel.'],
          remediation: 'Set channel to 1, 6, or 11 and steer clients to 5 GHz.',
        },
      ],
      step14_commonMistakes: [
        { misconception: 'Using Channel 2, 3, 4, 8, or 9 on 2.4 GHz.', correction: 'ONLY Channels 1, 6, and 11 are non-overlapping.' },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'Rogue Access Points and Evil Twins.',
        mitigationStrategy: 'Deploy WIPS and enforce WPA3 encryption.',
      },
      step16_examPrep: {
        keyExamPoints: ['2.4 GHz non-overlapping: 1, 6, 11.', '5 GHz has 24+ non-overlapping channels.', 'CSMA/CA is used because RF is half-duplex.'],
        frequentTraps: ['Selecting CSMA/CD for wireless (CSMA/CD is for wired).'],
      },
      step17_practicalLabRef: {
        title: 'Guided Practice: Wireless RF Spectrum Analysis & Channel Optimization',
        scenario: 'Audit Wi-Fi connection parameters.',
        tasks: ['Run netsh wlan show interfaces.'],
        verificationMethod: 'Verify non-overlapping channel configuration.',
      },
      step18_masterySummary: {
        summaryPoints: ['2.4 GHz has 3 non-overlapping channels (1, 6, 11); 5 GHz has 24+ channels with bonding.', 'CSMA/CA avoids collisions on half-duplex RF.'],
        nextLessonBridge: 'Proceed to NET-103 for the 7-Layer OSI Model and TCP/IP Architecture.',
      },
    },
    questions: [
      {
        text: 'In the 2.4 GHz wireless frequency band in North America, which three channels are the ONLY channels that do not overlap with one another?',
        options: ['Channels 1, 6, and 11', 'Channels 1, 2, and 3', 'Channels 6, 7, and 8', 'Channels 2, 4, and 8'],
        correctOption: 0,
        explanation: 'In 2.4 GHz Wi-Fi, Channels 1, 6, and 11 are separated by 25 MHz and are the only non-overlapping channel combination.',
        explanationsJson: { 1: 'Channels 1, 2, 3 overlap almost entirely.', 2: 'Overlap completely.', 3: 'Overlap with neighbors.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: '2.4 GHz Non-Overlapping Channels',
      },
    ],
    lab: {
      title: 'Guided Practice: Wireless RF Spectrum Analysis & Channel Optimization',
      instructions: '1. Audit Wi-Fi with netsh wlan show interfaces.\n2. Verify channel configuration.',
      difficulty: CourseLevel.FOUNDATIONAL,
      estimatedMinutes: 15,
      initialTopologyJson: { ssid: 'Corporate-WiFi', band: '5 GHz', channel: 36 },
      tasks: ['Run netsh wlan show interfaces.'],
    },
  },

  // -------------------------------------------------------------------------
  // 8. NET-102: Network Performance Metrics (what-is-computer-networking)
  // -------------------------------------------------------------------------
  {
    courseCode: 'NET-102',
    slug: 'what-is-computer-networking',
    title: 'Network Performance Metrics: Latency, Throughput & Packet Loss',
    type: LessonType.THEORY,
    durationMinutes: 20,
    order: 6,
    visualizationType: 'PERFORMANCE_METRICS_ENGINE',
    introduction:
      'Master the physics and telemetry of network performance: Bandwidth vs Throughput vs Goodput, the 4 components of end-to-end latency ($D_{trans}, D_{prop}, D_{proc}, D_{queue}$), Jitter buffer mechanics, and Packet Loss causes.',
    stepMetadata: {
      step1_objective:
        'Differentiate between Bandwidth, Throughput, and Goodput, calculate the 4 components of end-to-end delay, and understand Jitter and Packet Loss impacts on real-time applications.',
      step2_prerequisites: ['net-101-bits-bytes-binary-hex', 'level-0-what-is-a-computer-network'],
      step3_whyItMatters:
        'High bandwidth does not guarantee good user experience if latency, jitter, or packet loss are excessive.',
      step4_coreConcept:
        'Bandwidth is theoretical maximum raw link capacity. Throughput is actual delivered rate. Goodput is net application payload delivered after removing protocol headers. Total Delay = $D_{trans} (L/R) + D_{prop} (d/s) + D_{proc} + D_{queue}$. Jitter is latency variance. Packet Loss occurs when buffers overflow or CRC errors occur.',
      step5_technicalAnatomy: {
        title: 'Performance Telemetry & Mathematical Delay Decomposition',
        description: 'Formulas and metrics for network performance measurement.',
        components: [
          { name: 'Bandwidth vs Throughput vs Goodput', detail: 'Bandwidth = max link rating; Throughput = observed rate; Goodput = payload data without headers.' },
          { name: 'Serialization Delay ($D_{trans} = L/R$)', detail: 'Time to push packet bits onto wire: Packet Length (bits) / Link Rate (bps).' },
          { name: 'Propagation Delay ($D_{prop} = d/s$)', detail: 'Time for signal to traverse distance $d$ at propagation speed $s$ (~$2 \\times 10^8$ m/s).' },
          { name: 'Processing & Queueing Delay', detail: 'CPU routing lookup time and buffer wait time in router egress queues.' },
          { name: 'Jitter & Packet Loss', detail: 'Jitter = packet arrival variance; Packet Loss = dropped frames from buffer bloat or CRC errors.' },
        ],
      },
      step6_howItWorks: {
        steps: [
          { stepNumber: 1, title: 'Delay Calculation', action: 'Calculate serialization ($L/R$) and propagation ($d/s$) delays.' },
          { stepNumber: 2, title: 'Goodput Measurement', action: 'Deduct protocol headers (Ethernet + IP + TCP = 54 bytes) from payload throughput.' },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'Network Telemetry & Delay Metrics',
        fields: [
          { fieldName: 'Total Latency Formula', bitLength: 'End-to-End Delay', hexSample: 'D_trans + D_prop + D_proc + D_queue', description: 'Decomposed delay components.' },
        ],
      },
      step8_visualExplanation: {
        type: 'PERFORMANCE_METRICS_ENGINE',
        title: 'Interactive Network Performance & Delay Calculator',
        description: 'Adjust distance, packet size, link rate, and buffer depth to calculate latency components.',
      },
      step9_workedExample: {
        title: 'Calculating Serialization Delay for 1500-Byte Packet on 100 Mbps Link',
        problemStatement: 'Calculate $D_{trans}$ for 1500 Bytes ($12,000$ bits) on 100 Mbps ($10^8$ bps) link.',
        stepByStepSolution: [
          '$D_{trans} = \\frac{L}{R} = \\frac{12,000 \\text{ bits}}{100,000,000 \\text{ bps}} = 0.00012 \\text{ seconds} = 0.12 \\text{ ms} = 120 \\ \\mu\\text{s}$.',
        ],
        finalResult: 'Serialization delay is $0.12 \\text{ ms}$ ($120 \\ \\mu\\text{s}$).',
      },
      step10_realWorldScenario: {
        topology: 'VoIP Call Stutter from Buffer Bloat',
        scenarioText: 'Large file download fills router queue; voice packets suffer high queueing delay and jitter.',
        engineeringContext: 'QoS priority queuing protects latency-sensitive voice traffic.',
      },
      step11_deviceBehavior: {
        hostBehavior: 'Measures round-trip time (RTT) via TCP ACK timestamps.',
        nicBehavior: 'Buffers packets in DMA rings.',
        switchOrRouterBehavior: 'Drops packets via Tail Drop or WRED when queues fill.',
      },
      step12_cliTooling: [
        {
          command: 'ping 8.8.8.8 -n 5',
          description: 'Measures ICMP round-trip latency, jitter, and packet loss.',
          expectedOutput: 'Minimum = 12ms, Maximum = 15ms, Average = 13ms, Loss = 0%',
          proofExplanation: 'Verifies 13ms average latency and 0% loss.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'Voice calls drop words despite 1 Gbps broadband.',
          possibleCauses: ['High jitter or burst packet loss in router buffers'],
          diagnosticSteps: ['Test with ping and iperf3.'],
          remediation: 'Configure QoS priority queuing for voice traffic.',
        },
      ],
      step14_commonMistakes: [
        { misconception: 'Assuming high bandwidth fixes high latency.', correction: 'Bandwidth is pipe width; propagation delay is governed by the speed of light over distance.' },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'Buffer exhaustion DDoS attacks.',
        mitigationStrategy: 'Deploy rate-limiting and active queue management.',
      },
      step16_examPrep: {
        keyExamPoints: ['$D_{trans} = L/R$.', '$D_{prop} = d/s$.', 'Goodput < Throughput < Bandwidth.'],
        frequentTraps: ['Confusing serialization delay with propagation delay.'],
      },
      step17_practicalLabRef: {
        title: 'Guided Practice: Network Latency & Throughput Diagnostics',
        scenario: 'Analyze ping latency and calculate serialization delays.',
        tasks: ['Run ping 8.8.8.8 and calculate serialization delay for 1500-byte packets.'],
        verificationMethod: 'Verify mathematical latency breakdown.',
      },
      step18_masterySummary: {
        summaryPoints: ['Latency = $D_{trans} + D_{prop} + D_{proc} + D_{queue}$.', 'Goodput is usable application payload rate.'],
        nextLessonBridge: 'Proceed to NET-103 for Network Models & Protocols.',
      },
    },
    questions: [
      {
        text: 'What is the operational distinction between Throughput and Goodput in network performance analysis?',
        options: [
          'Throughput is the actual rate of total data transmitted (including protocol headers and retransmissions), whereas Goodput is the net rate of usable application payload delivered to the end user',
          'Throughput applies only to wireless while Goodput applies only to fiber',
          'Throughput is measured in Bytes while Goodput is measured in volts',
          'There is no difference',
        ],
        correctOption: 0,
        explanation: 'Throughput measures all raw bits delivered across the physical link. Goodput measures only the application payload delivered after stripping protocol headers (Ethernet, IP, TCP) and discarding duplicate retransmissions.',
        explanationsJson: { 1: 'Applies to all media.', 2: 'Both are data rates.', 3: 'They are fundamentally different.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Throughput vs Goodput',
      },
    ],
    lab: {
      title: 'Guided Practice: Network Latency & Throughput Diagnostics',
      instructions: '1. Run ping 8.8.8.8.\n2. Calculate serialization delay.',
      difficulty: CourseLevel.FOUNDATIONAL,
      estimatedMinutes: 15,
      initialTopologyJson: { host: 'PC-1', target: '8.8.8.8', rttAvg: '13ms' },
      tasks: ['Run ping 8.8.8.8.'],
    },
  },

  // =========================================================================
  // COURSE: NET-103 (Network Models & Protocols: OSI & TCP/IP)
  // =========================================================================

  // -------------------------------------------------------------------------
  // 9. NET-103: Network Protocols, Standardization & RFC Architecture
  // -------------------------------------------------------------------------
  {
    courseCode: 'NET-103',
    slug: 'level-0-network-protocols-standards',
    title: 'Network Protocols, Standardization & RFC Architecture',
    type: LessonType.THEORY,
    durationMinutes: 20,
    order: 1,
    visualizationType: 'STANDARDS_ECOSYSTEM',
    introduction:
      'Master the concept of network protocols (Syntax, Semantics, Timing), the role of open global standards bodies (IETF, IEEE, ISO, ITU-T), the Request for Comments (RFC) publication lifecycle, and how modular protocol layering prevents vendor lock-in.',
    stepMetadata: {
      step1_objective:
        'Understand what defines a network protocol (Syntax, Semantics, Timing), analyze the roles of standard bodies (IETF, IEEE, ISO), and explore the RFC standardization lifecycle.',
      step2_prerequisites: ['level-0-what-is-a-computer-network'],
      step3_whyItMatters:
        'Without open global standards, multi-vendor equipment cannot communicate, resulting in proprietary silos and vendor lock-in.',
      step4_coreConcept:
        'A protocol is a formal set of rules governing data telecommunication consisting of Syntax (message structure/format), Semantics (meaning of control bits and error fields), and Timing (speed matching and sequencing). Global standards organizations ensure interoperability: IETF (Internet Engineering Task Force, creates RFCs for IP/TCP/DNS/HTTP), IEEE (Institute of Electrical and Electronics Engineers, creates 802.3 Ethernet and 802.11 Wi-Fi standards), ISO (created OSI model), and ITU-T (telecom standards). RFCs evolve through maturity levels: Proposed Standard to Internet Standard.',
      step5_technicalAnatomy: {
        title: 'Protocol Triad & Standards Organizations',
        description: 'Syntax, Semantics, Timing, and governing standards bodies.',
        components: [
          { name: 'Protocol Syntax', detail: 'Data format, field boundaries, and bit lengths (e.g. 32-bit IP address field).' },
          { name: 'Protocol Semantics', detail: 'Meaning of control values (e.g. SYN flag = initiate connection).' },
          { name: 'Protocol Timing / Synchronization', detail: 'Speed matching, sequencing, and retransmission timeout rules.' },
          { name: 'IETF & RFC Lifecycle', detail: 'Internet Engineering Task Force publishes RFC documents defining core internet protocols.' },
          { name: 'IEEE Standards', detail: 'Defines physical and data link standards: IEEE 802.3 (Ethernet) and 802.11 (Wi-Fi).' },
        ],
      },
      step6_howItWorks: {
        steps: [
          { stepNumber: 1, title: 'Draft Submission', action: 'Internet-Draft submitted to IETF working group for review.' },
          { stepNumber: 2, title: 'RFC Publication', action: 'Peer reviewed, revised, and published as a numbered RFC (e.g. RFC 791 for IPv4).' },
          { stepNumber: 3, title: 'Interoperability Verification', action: 'Independent vendors implement RFC specifications in software/hardware.' },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'RFC Document Structure & Protocol Syntax',
        fields: [
          { fieldName: 'RFC Number', bitLength: 'Document ID', hexSample: 'RFC 793 (TCP)', description: 'Authoritative open technical specification.' },
          { fieldName: 'Standard Organization', bitLength: 'IETF / IEEE', hexSample: 'Open Global Standard', description: 'Non-proprietary governing body.' },
        ],
      },
      step8_visualExplanation: {
        type: 'STANDARDS_ECOSYSTEM',
        title: 'Standards Bodies & RFC Lifecycle Explorer',
        description: 'Explore IETF, IEEE, ISO, and ITU-T domains, and trace how RFC proposals become global standards.',
      },
      step9_workedExample: {
        title: 'Analyzing Protocol Syntax vs Semantics in IPv4 Header',
        problemStatement: 'Identify syntax and semantics of the 8-bit TTL field in IPv4 (RFC 791).',
        stepByStepSolution: [
          'Syntax: 8-bit field located at byte offset 8 in IPv4 header.',
          'Semantics: Decremented by 1 at each router hop; if value reaches 0, packet is discarded and ICMP Time Exceeded returned.',
        ],
        finalResult: 'Syntax defines bit size/position; Semantics defines operational meaning and hop decrement logic.',
      },
      step10_realWorldScenario: {
        topology: 'Multi-Vendor Enterprise Interoperability',
        scenarioText: 'Cisco switches, Juniper routers, Linux servers, and Apple laptops communicate seamlessly because all strictly follow IETF RFCs and IEEE 802.3/802.11 standards.',
        engineeringContext: 'Open standards eliminate proprietary vendor lock-in.',
      },
      step11_deviceBehavior: {
        hostBehavior: 'Implements standard RFC socket APIs.',
        nicBehavior: 'Conforms to IEEE 802.3 framing and electrical specifications.',
        switchOrRouterBehavior: 'Processes standard packet headers independently of hardware vendor.',
      },
      step12_cliTooling: [
        {
          command: 'powershell -Command "Invoke-WebRequest -Uri https://www.rfc-editor.org/rfc/rfc791.txt -Method Head"',
          description: 'Fetches metadata for official RFC 791 (IPv4 specification).',
          expectedOutput: 'StatusCode : 200\nStatusDescription : OK',
          proofExplanation: 'Proves access to official IETF RFC repository.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'Vendor proprietary protocol feature breaks multi-vendor communication.',
          possibleCauses: ['Use of proprietary extensions rather than standard RFC mode'],
          diagnosticSteps: ['Verify protocol compliance in configuration.'],
          remediation: 'Configure standard open RFC mode (e.g. standard LACP vs proprietary EtherChannel).',
        },
      ],
      step14_commonMistakes: [
        { misconception: 'Thinking RFCs are proprietary trade secrets.', correction: 'RFCs are freely accessible public open standards published online.' },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'Protocol Ambiguity Exploits',
        mitigationStrategy: 'Strict conformance to RFC validation rules prevents malformed packet attacks.',
      },
      step16_examPrep: {
        keyExamPoints: ['3 protocol elements: Syntax (structure), Semantics (meaning), Timing (speed/sequencing).', 'IETF publishes RFCs; IEEE defines 802.3/802.11.'],
        frequentTraps: ['Confusing IETF (Layer 3-7 software) with IEEE (Layer 1-2 hardware).'],
      },
      step17_practicalLabRef: {
        title: 'Guided Practice: RFC Document Inspection & Protocol Standards Analysis',
        scenario: 'Explore RFC specifications and identify protocol syntax.',
        tasks: ['Identify the standards body responsible for Ethernet (IEEE) vs IP (IETF).'],
        verificationMethod: 'Verify standards mapping.',
      },
      step18_masterySummary: {
        summaryPoints: ['Protocols define syntax, semantics, and timing.', 'IETF RFCs and IEEE 802 standards ensure multi-vendor interoperability.'],
        nextLessonBridge: 'Proceed to NET-103 Lesson 2 for the 7-Layer OSI Reference Model.',
      },
    },
    questions: [
      {
        text: 'What are the three essential elements that formally define a network communication protocol?',
        options: [
          'Syntax (message structure), Semantics (meaning of control fields), and Timing (speed matching and sequencing)',
          'Voltage, Amperage, and Resistance',
          'CPU, RAM, and Storage',
          'Router, Switch, and Firewall',
        ],
        correctOption: 0,
        explanation: 'A protocol is formally defined by Syntax (data format and structure), Semantics (meaning and interpretation of control bits), and Timing (sequencing, synchronization, and speed matching).',
        explanationsJson: { 1: 'Electrical properties.', 2: 'Hardware components.', 3: 'Network appliances.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Protocol Definition Triad',
      },
    ],
    lab: {
      title: 'Guided Practice: RFC Document Inspection & Protocol Standards Analysis',
      instructions: '1. Inspect standards bodies.\n2. Map protocols to IETF and IEEE.',
      difficulty: CourseLevel.FOUNDATIONAL,
      estimatedMinutes: 15,
      initialTopologyJson: { standardsBody: 'IETF', coreDocument: 'RFC 791' },
      tasks: ['Map protocol standards.'],
    },
  },

  // -------------------------------------------------------------------------
  // 10. NET-103: The 7-Layer OSI Reference Model
  // -------------------------------------------------------------------------
  {
    courseCode: 'NET-103',
    slug: 'osi-model-7-layers',
    title: 'The 7-Layer OSI Reference Model',
    type: LessonType.THEORY,
    durationMinutes: 30,
    order: 2,
    visualizationType: 'OSI_STACK_FLOW',
    introduction:
      'Master the theoretical framework of computer networking: The ISO 7-Layer Open Systems Interconnection (OSI) Reference Model, the responsibilities of each layer, Protocol Data Units (PDUs: Bits, Frame, Packet, Segment, Data), and vertical Encapsulation/Decapsulation mechanics.',
    stepMetadata: {
      step1_objective:
        'Master all 7 layers of the OSI model, identify the Protocol Data Unit (PDU) at each layer, and understand vertical Encapsulation (downward) and Decapsulation (upward) workflows.',
      step2_prerequisites: ['level-0-network-protocols-standards'],
      step3_whyItMatters:
        'The OSI model is the universal language of network engineering. When troubleshooting, isolating whether a problem is Layer 1 (cable), Layer 3 (routing), or Layer 7 (application) is essential.',
      step4_coreConcept:
        'The OSI model standardizes network communication into 7 distinct functional layers: Layer 7 Application (user interfaces, HTTP/DNS), Layer 6 Presentation (formatting, encryption, TLS/compression), Layer 5 Session (dialog management/RPC), Layer 4 Transport (end-to-end reliability, ports, TCP/UDP), Layer 3 Network (logical addressing, routing, IP), Layer 2 Data Link (physical MAC addressing, framing, CRC, Ethernet), Layer 1 Physical (electrical/optical bit signaling). PDUs: Layers 7-5 = Data, Layer 4 = Segment, Layer 3 = Packet, Layer 2 = Frame, Layer 1 = Bits. Encapsulation adds headers as data moves down; Decapsulation strips headers as data moves up.',
      step5_technicalAnatomy: {
        title: 'The 7 Layers, PDUs & Core Functions',
        description: 'Layer numbers, names, PDU types, and functions.',
        components: [
          { name: 'Layer 7: Application', detail: 'PDU: Data. User interface protocols: HTTP, HTTPS, DNS, DHCP, SSH, SMTP.' },
          { name: 'Layer 6: Presentation', detail: 'PDU: Data. Data formatting, syntax translation, compression, and encryption (TLS/SSL, JPEG, ASCII).' },
          { name: 'Layer 5: Session', detail: 'PDU: Data. Establishes, manages, and terminates application sessions and dialog synchronization.' },
          { name: 'Layer 4: Transport', detail: 'PDU: Segment. End-to-end communication, port addressing (0-65535), segmentation, flow control (TCP/UDP).' },
          { name: 'Layer 3: Network', detail: 'PDU: Packet. Logical addressing (IPv4/IPv6), path determination, and inter-network routing.' },
          { name: 'Layer 2: Data Link', detail: 'PDU: Frame. Physical hardware addressing (MAC), framing, hop-to-hop transfer, CRC error checking (Ethernet/Wi-Fi).' },
          { name: 'Layer 1: Physical', detail: 'PDU: Bits. Electrical voltages, radio waves, light pulses, cables, transceivers, and connectors.' },
        ],
      },
      step6_howItWorks: {
        steps: [
          { stepNumber: 1, title: 'Encapsulation (Sender Downward Flow)', action: 'Application data is wrapped with L4 TCP header (Segment), L3 IP header (Packet), L2 Ethernet header + FCS trailer (Frame), and converted to L1 Bits.' },
          { stepNumber: 2, title: 'Decapsulation (Receiver Upward Flow)', action: 'Receiver reads L1 bits, strips L2 frame header/trailer after CRC check, strips L3 IP header, strips L4 TCP header, and delivers payload to Application.' },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'OSI Protocol Data Unit (PDU) Hierarchy',
        fields: [
          { fieldName: 'L4 PDU', bitLength: 'Segment', hexSample: 'TCP / UDP Header + Data', description: 'Transport layer segment.' },
          { fieldName: 'L3 PDU', bitLength: 'Packet', hexSample: 'IP Header + Segment', description: 'Network layer packet.' },
          { fieldName: 'L2 PDU', bitLength: 'Frame', hexSample: 'Ethernet Header + Packet + FCS', description: 'Data link frame.' },
          { fieldName: 'L1 PDU', bitLength: 'Bits', hexSample: 'Physical 1s and 0s', description: 'Physical layer bitstream.' },
        ],
      },
      step8_visualExplanation: {
        type: 'OSI_STACK_FLOW',
        title: 'Interactive 7-Layer OSI Encapsulation & Decapsulation Engine',
        description: 'Watch an application message travel down the 7 layers acquiring headers, traverse the physical medium, and decapsulate up the receiver stack.',
      },
      step9_workedExample: {
        title: 'Tracing Encapsulation of an HTTPS GET Request',
        problemStatement: 'Trace PDU names and headers added as a browser sends an HTTPS GET request.',
        stepByStepSolution: [
          'Layer 7-5: Application generates HTTPS GET payload (Data).',
          'Layer 4: Adds TCP Header with Source Port 51234 and Dst Port 443 (Segment).',
          'Layer 3: Adds IPv4 Header with Source IP and Destination IP (Packet).',
          'Layer 2: Adds Ethernet Header with Source MAC, Dst MAC, and FCS Trailer (Frame).',
          'Layer 1: Encodes Frame into optical light pulses or electrical voltages (Bits).',
        ],
        finalResult: 'Data -> Segment -> Packet -> Frame -> Bits.',
      },
      step10_realWorldScenario: {
        topology: 'Layered Network Troubleshooting Methodology',
        scenarioText: 'User cannot open webpage. Engineer troubleshoots bottom-up: verifies link light (L1), checks MAC table (L2), pings default gateway (L3), tests TCP port 443 (L4), and tests web server response (L7).',
        engineeringContext: 'Bottom-up troubleshooting eliminates lower-layer faults systematically.',
      },
      step11_deviceBehavior: {
        hostBehavior: 'Operates across all 7 layers (NIC L1/L2, Kernel L3/L4, Apps L5-L7).',
        nicBehavior: 'Processes Layer 1 bits and Layer 2 frames.',
        switchOrRouterBehavior: 'Layer 2 switches inspect frames (L2); Layer 3 routers inspect packets (L3).',
      },
      step12_cliTooling: [
        {
          command: 'Test-NetConnection -ComputerName 8.8.8.8 -Port 53',
          description: 'Tests Layer 3 IP reachability and Layer 4 TCP port connectivity.',
          expectedOutput: 'PingSucceeded : True\nTcpTestSucceeded : True',
          proofExplanation: 'Confirms Layer 3 and Layer 4 operational status.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'Ping works (L3) but web browsing fails (L7).',
          possibleCauses: ['Layer 4 port blocked by firewall or Layer 7 DNS/web server failure'],
          diagnosticSteps: ['Test TCP port 443 and verify DNS resolution.'],
          remediation: 'Restart web daemon or update firewall policy.',
        },
      ],
      step14_commonMistakes: [
        { misconception: 'Calling an IP PDU a "Frame" or an Ethernet PDU a "Packet".', correction: 'L2 is Frame; L3 is Packet; L4 is Segment.' },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'Layer-Specific Security Attacks',
        mitigationStrategy: 'Deploy defense-in-depth: 802.1X (L2), IPsec/ACLs (L3), stateful firewalls (L4), WAF (L7).',
      },
      step16_examPrep: {
        keyExamPoints: ['Mnemonic: All People Seem To Need Data Processing (7 to 1).', 'PDUs: Data, Segment, Packet, Frame, Bits.'],
        frequentTraps: ['Forgetting that Presentation Layer handles encryption/formatting.'],
      },
      step17_practicalLabRef: {
        title: 'Guided Practice: OSI 7-Layer PDU & Encapsulation Mapping',
        scenario: 'Map protocol fields and PDU transitions across the 7 layers.',
        tasks: ['Trace encapsulation order from Layer 7 to Layer 1.'],
        verificationMethod: 'Verify correct PDU identification at each layer.',
      },
      step18_masterySummary: {
        summaryPoints: ['OSI model defines 7 layers from Physical (L1) to Application (L7).', 'Encapsulation wraps data in Segments, Packets, and Frames.'],
        nextLessonBridge: 'Proceed to NET-103 Lesson 3 for the TCP/IP 4-Layer Model and comparative mapping.',
      },
    },
    questions: [
      {
        text: 'What is the correct technical name for the Protocol Data Unit (PDU) at Layer 3 (Network Layer) and Layer 2 (Data Link Layer) of the OSI model?',
        options: [
          'Layer 3 = Packet; Layer 2 = Frame',
          'Layer 3 = Frame; Layer 2 = Packet',
          'Layer 3 = Segment; Layer 2 = Bits',
          'Layer 3 = Data; Layer 2 = Segment',
        ],
        correctOption: 0,
        explanation: 'At Layer 3 (Network), the PDU is called a Packet (e.g. IP packet). At Layer 2 (Data Link), the PDU is called a Frame (e.g. Ethernet frame).',
        explanationsJson: { 1: 'Reversed.', 2: 'Segment is L4; Bits is L1.', 3: 'Data is L7-5; Segment is L4.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'OSI Protocol Data Units (PDUs)',
      },
    ],
    lab: {
      title: 'Guided Practice: OSI 7-Layer PDU & Encapsulation Mapping',
      instructions: '1. Map 7 layers.\n2. Trace encapsulation flow.',
      difficulty: CourseLevel.FOUNDATIONAL,
      estimatedMinutes: 15,
      initialTopologyJson: { layers: ['Physical', 'Data Link', 'Network', 'Transport', 'Session', 'Presentation', 'Application'] },
      tasks: ['Trace encapsulation sequence.'],
    },
  },

  // -------------------------------------------------------------------------
  // 11. NET-103: The TCP/IP 4-Layer Architecture & Model Mapping
  // -------------------------------------------------------------------------
  {
    courseCode: 'NET-103',
    slug: 'tcp-ip-4-layers',
    title: 'The TCP/IP 4-Layer Architecture & Model Mapping',
    type: LessonType.THEORY,
    durationMinutes: 25,
    order: 3,
    visualizationType: 'TCPIP_OSI_COMPARATOR',
    introduction:
      'Master the pragmatic implementation model of the global Internet: The TCP/IP 4-Layer Model (RFC 1122), direct side-by-side mapping against the 7-layer OSI model, why Session and Presentation layers were collapsed into Application, and how modern operating systems implement the stack.',
    stepMetadata: {
      step1_objective:
        'Understand the 4 layers of the TCP/IP suite (Network Access, Internet, Transport, Application), map them directly to the 7 OSI layers, and understand how operating systems implement the stack.',
      step2_prerequisites: ['osi-model-7-layers'],
      step3_whyItMatters:
        'While the OSI model is theoretical, TCP/IP is the actual operational protocol suite implemented inside every operating system kernel on Earth.',
      step4_coreConcept:
        'The TCP/IP model (RFC 1122) organizes networking into 4 functional layers: (1) Network Access (Link) Layer (combines OSI L1 & L2: Ethernet, Wi-Fi, MAC addresses), (2) Internet Layer (corresponds to OSI L3: IP, ICMP, ARP, routing), (3) Transport Layer (corresponds to OSI L4: TCP, UDP, port multiplexing), and (4) Application Layer (combines OSI L5, L6, and L7: HTTP, DNS, SSH, TLS). Session and Presentation were collapsed into Application because encryption, formatting, and session state are implemented inside application software (e.g. web browser / OpenSSL) rather than inside the operating system network kernel.',
      step5_technicalAnatomy: {
        title: 'TCP/IP vs OSI Mapping & OS Implementation Architecture',
        description: 'Layer mapping, kernel space vs user space boundaries.',
        components: [
          { name: 'Application Layer (OSI L7, L6, L5)', detail: 'Runs in User Space software. Implements application logic, TLS encryption, and session state (HTTP, DNS, SSH).' },
          { name: 'Transport Layer (OSI L4)', detail: 'Runs inside OS Kernel Space (`tcp.sys`, Linux stack). Manages end-to-end ports, TCP handshakes, and UDP sockets.' },
          { name: 'Internet Layer (OSI L3)', detail: 'Runs inside OS Kernel Space. Handles IPv4/IPv6 packet construction, subnet masking, and routing tables.' },
          { name: 'Network Access Layer (OSI L2, L1)', detail: 'Runs in NIC Driver & Hardware PHY. Handles Ethernet framing, MAC addressing, and physical bit transmission.' },
        ],
      },
      step6_howItWorks: {
        steps: [
          { stepNumber: 1, title: 'User Space Preparation', action: 'Application creates payload and handles TLS encryption in user space.' },
          { stepNumber: 2, title: 'Kernel Syscall Transition', action: 'App passes data to kernel socket; kernel builds TCP and IP headers.' },
          { stepNumber: 3, title: 'NIC DMA & Transmission', action: 'NIC driver creates Ethernet frame and transmits bits onto wire.' },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'TCP/IP Protocol Stack Mapping',
        fields: [
          { fieldName: 'Application Layer', bitLength: 'User Space', hexSample: 'HTTP / DNS / TLS', description: 'OSI Layers 5, 6, 7 combined.' },
          { fieldName: 'Transport Layer', bitLength: 'Kernel Space', hexSample: 'TCP / UDP', description: 'OSI Layer 4.' },
          { fieldName: 'Internet Layer', bitLength: 'Kernel Space', hexSample: 'IPv4 / IPv6 / ICMP', description: 'OSI Layer 3.' },
          { fieldName: 'Network Access Layer', bitLength: 'Hardware/Driver', hexSample: 'Ethernet / Wi-Fi', description: 'OSI Layers 1 & 2 combined.' },
        ],
      },
      step8_visualExplanation: {
        type: 'TCPIP_OSI_COMPARATOR',
        title: 'Side-by-Side TCP/IP vs OSI Model Comparison Matrix',
        description: 'Interactive comparison matrix aligning 4 TCP/IP layers with 7 OSI layers, showing protocol assignments and kernel/user space boundaries.',
      },
      step9_workedExample: {
        title: 'Mapping Protocol Stack for Web Browsing Session',
        problemStatement: 'Map protocols used in browsing `https://example.com` to TCP/IP and OSI layers.',
        stepByStepSolution: [
          'HTTPS / TLS: TCP/IP Application Layer <-> OSI Layers 7, 6, 5.',
          'TCP: TCP/IP Transport Layer <-> OSI Layer 4.',
          'IPv4: TCP/IP Internet Layer <-> OSI Layer 3.',
          'Ethernet: TCP/IP Network Access Layer <-> OSI Layers 2, 1.',
        ],
        finalResult: 'Complete vertical stack mapping verified.',
      },
      step10_realWorldScenario: {
        topology: 'Operating System Network Stack Execution',
        scenarioText: 'A web browser executes TLS encryption in user space, passes bytes via socket API to OS kernel (TCP/IP stack), and kernel DMA transmits to hardware NIC.',
        engineeringContext: 'Understanding user space vs kernel space boundaries is critical for performance tuning.',
      },
      step11_deviceBehavior: {
        hostBehavior: 'Executes Application in user space; Transport and Internet in OS kernel.',
        nicBehavior: 'Executes Network Access Layer in hardware ASIC and firmware.',
        switchOrRouterBehavior: 'Switches operate at Network Access (L2); Routers at Internet Layer (L3).',
      },
      step12_cliTooling: [
        {
          command: 'netstat -ano',
          description: 'Displays active kernel-level TCP/IP transport sockets and port mappings.',
          expectedOutput: 'Proto Local Address  Foreign Address  State  PID\nTCP   192.168.1.10:51234  93.184.216.34:443  ESTABLISHED 4512',
          proofExplanation: 'Shows kernel transport layer socket management.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'Application hangs during socket initialization.',
          possibleCauses: ['Kernel socket exhaustion or ephemeral port starvation'],
          diagnosticSteps: ['Check netstat socket count and ephemeral port range.'],
          remediation: 'Tune OS TCP socket timeout (TIME_WAIT) and expand ephemeral port range.',
        },
      ],
      step14_commonMistakes: [
        { misconception: 'Assuming TCP/IP and OSI are competing hardware products.', correction: 'OSI is a conceptual reference model; TCP/IP is the practical implementation suite.' },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'Kernel Network Stack Vulnerabilities',
        mitigationStrategy: 'Keep OS kernel updated to patch TCP/IP stack vulnerabilities.',
      },
      step16_examPrep: {
        keyExamPoints: ['4 TCP/IP layers: Network Access, Internet, Transport, Application.', 'Session & Presentation collapsed into Application.'],
        frequentTraps: ['Calling Layer 2 in TCP/IP "Data Link" (it is called Network Access or Link).'],
      },
      step17_practicalLabRef: {
        title: 'Guided Practice: TCP/IP Suite Protocol Mapping & Socket Inspection',
        scenario: 'Map real-world protocols across TCP/IP layers.',
        tasks: ['Map HTTP, TCP, IP, and Ethernet to their TCP/IP layers.'],
        verificationMethod: 'Verify socket mapping with netstat.',
      },
      step18_masterySummary: {
        summaryPoints: ['TCP/IP is the 4-layer architecture of the Internet.', 'Application layer combines OSI layers 5-7 in user space.'],
        nextLessonBridge: 'With digital fundamentals and models mastered in Tier 1, proceed to Tier 2 (NET-201) to master Ethernet and MAC Addresses.',
      },
    },
    questions: [
      {
        text: 'How does the pragmatic 4-layer TCP/IP model map to the theoretical 7-layer OSI reference model?',
        options: [
          'TCP/IP Application combines OSI Layers 5, 6, and 7; Transport maps to Layer 4; Internet maps to Layer 3; Network Access combines OSI Layers 1 and 2',
          'TCP/IP has no Transport layer',
          'TCP/IP is identical with 7 layers',
          'TCP/IP combines all layers into 1 layer',
        ],
        correctOption: 0,
        explanation: 'The TCP/IP suite combines OSI Application, Presentation, and Session into Application, maps Transport to Transport, Internet to Network, and combines Data Link and Physical into Network Access.',
        explanationsJson: { 1: 'TCP/IP has Transport.', 2: 'TCP/IP has 4 layers.', 3: 'TCP/IP has 4 layers.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'TCP/IP vs OSI Mapping',
      },
    ],
    lab: {
      title: 'Guided Practice: TCP/IP Suite Protocol Mapping & Socket Inspection',
      instructions: '1. Map protocols to 4 TCP/IP layers.\n2. Run netstat -ano.',
      difficulty: CourseLevel.FOUNDATIONAL,
      estimatedMinutes: 15,
      initialTopologyJson: { layers: ['Network Access', 'Internet', 'Transport', 'Application'] },
      tasks: ['Run netstat -ano.'],
    },
  },
];

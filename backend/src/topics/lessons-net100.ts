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
    durationMinutes: 15,
    order: 1,
    visualizationType: 'BINARY_CONVERTER',
    introduction:
      'Master the foundational digital alphabet of computer networking: Base-2 binary bits, 8-bit bytes (octets), 4-bit nibbles, Base-16 hexadecimal notation, and conversions between number representations.',
    contentV2: {
      objective:
        'Understand how digital network data is constructed from binary bits, how 8 bits form a byte, how hexadecimal notation provides a compact shorthand for binary strings, and how to convert accurately between decimal, binary, and hexadecimal representations.',
      prerequisites: [
        'Basic arithmetic (addition and subtraction)',
        'Understanding of decimal (Base-10) place values (1s, 10s, 100s)',
      ],
      whyItMatters:
        'Every copper cable, fiber optic strand, and Wi-Fi radio wave carries physical signals representing binary 1s and 0s. Network addresses like IPv4 octets (0–255) and MAC addresses (48 bits in hex notation) are direct representations of binary data. Mastering these representations provides the essential bedrock for all networking topics.',
      explanation:
        'Computers and networking devices communicate using electricity and light. Because electronic circuits reliably detect two physical states (voltage High vs Low, light Pulse vs No-Pulse), digital systems use the Binary (Base-2) number system. A single binary digit is called a Bit. Grouping bits into 4-bit Nibbles and 8-bit Bytes (called Octets in networking) creates a standardized way to represent numbers, characters, and network addresses.',
      components: [
        {
          name: 'Bit (b)',
          detail: 'The smallest unit of digital data. A bit can have only two possible values: 0 (Off/Low) or 1 (On/High).',
        },
        {
          name: 'Nibble',
          detail: 'A group of 4 contiguous bits (0000 to 1111). A nibble can represent 16 distinct values (0 to 15), which maps exactly to a single hexadecimal digit (0 to F).',
        },
        {
          name: 'Byte / Octet (B)',
          detail: 'A group of 8 contiguous bits (00000000 to 11111111). In networking, a byte is called an Octet. It represents 256 distinct values (decimal 0 to 255) and is written with two hexadecimal characters (00 to FF).',
        },
        {
          name: 'Decimal (Base-10)',
          detail: 'The standard human numbering system using 10 digits (0 through 9) where each position represents an increasing power of 10 (1s, 10s, 100s).',
        },
        {
          name: 'Binary (Base-2)',
          detail: 'The machine numbering system using 2 digits (0 and 1) where each position in an 8-bit byte represents a power of 2 (128, 64, 32, 16, 8, 4, 2, 1).',
        },
        {
          name: 'Hexadecimal (Base-16)',
          detail: 'A compact numbering system using 16 symbols: digits 0–9 and letters A–F (where A=10, B=11, C=12, D=13, E=14, F=15). One hex character represents exactly 4 binary bits.',
        },
      ],
      howItWorks: [
        {
          stepNumber: 1,
          title: 'Understanding 8-Bit Positional Place Values',
          action: 'In an 8-bit byte, each bit position from left (Most Significant Bit) to right (Least Significant Bit) has a fixed decimal weight: 128 (2^7), 64 (2^6), 32 (2^5), 16 (2^4), 8 (2^3), 4 (2^2), 2 (2^1), and 1 (2^0).',
        },
        {
          stepNumber: 2,
          title: 'Binary to Decimal Conversion',
          action: 'Add up the place values for every bit that is turned ON (1). For example: binary 11000000 = 128 + 64 = decimal 192. Binary 11111111 = 128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = decimal 255.',
        },
        {
          stepNumber: 3,
          title: 'Decimal to Binary Conversion (Subtraction Method)',
          action: 'Compare your decimal value against the 8 bit weights (128, 64, 32, 16, 8, 4, 2, 1) starting from the left. If the value is greater than or equal to the weight, write a 1 and subtract that weight. If smaller, write a 0 and move to the next weight.',
        },
        {
          stepNumber: 4,
          title: 'Binary to Hexadecimal (The Nibble Method)',
          action: 'Split the 8-bit byte into two 4-bit nibbles. Convert each 4-bit nibble into its decimal value (weights 8, 4, 2, 1), then write the corresponding hex digit (0–9 or A–F). For example: 1100 1010 -> Left 1100 = 12 = C, Right 1010 = 10 = A -> 0xCA.',
        },
        {
          stepNumber: 5,
          title: 'Why Networking Uses Binary & Hexadecimal',
          action: 'Binary is how network hardware physically moves bits over wires and wireless signals. Hexadecimal is how humans read long binary addresses concisely: a 48-bit MAC address in binary is 48 ones and zeros, but in hexadecimal it is cleanly written as 12 hex digits (e.g., 00:1A:2B:3C:4D:5E).',
        },
      ],
      visualizer: {
        type: 'BINARY_CONVERTER',
        title: 'Interactive 8-Bit Positional Binary & Hex Converter',
        description: 'Toggle individual bit switches (128, 64, 32, 16, 8, 4, 2, 1) to observe real-time decimal summation (0–255), nibble division, and hexadecimal notation updates.',
      },
      workedExample: {
        title: 'Progressive Conversions: Nibbles (4-bit) and Bytes (8-bit)',
        problemStatement: 'Walk through foundational conversions from basic 4-bit nibbles to an 8-bit networking byte.',
        stepByStepSolution: [
          'Part A (Nibble Conversions - 4 Bits, Weights: 8, 4, 2, 1):\n• Binary 1010 -> (1 * 8) + (0 * 4) + (1 * 2) + (0 * 1) = 8 + 2 = Decimal 10 = Hexadecimal A.\n• Binary 1111 -> (1 * 8) + (1 * 4) + (1 * 2) + (1 * 1) = 8 + 4 + 2 + 1 = Decimal 15 = Hexadecimal F.',
          'Part B (Byte Conversion - Decimal 202 to Binary):\nCompare 202 against the 8 positional weights (128, 64, 32, 16, 8, 4, 2, 1):\n• 202 >= 128? YES -> Bit 1 (rem: 74)\n• 74 >= 64? YES -> Bit 1 (rem: 10)\n• 10 >= 32? NO -> Bit 0 (rem: 10)\n• 10 >= 16? NO -> Bit 0 (rem: 10)\n• 10 >= 8? YES -> Bit 1 (rem: 2)\n• 2 >= 4? NO -> Bit 0 (rem: 2)\n• 2 >= 2? YES -> Bit 1 (rem: 0)\n• 0 >= 1? NO -> Bit 0 (rem: 0)\n-> Binary: 11001010.',
          'Part C (Byte Conversion - Binary 11001010 to Hexadecimal):\nSplit into two 4-bit nibbles:\n• Left Nibble (1100) -> 8 + 4 = 12 -> Hex C.\n• Right Nibble (1010) -> 8 + 2 = 10 -> Hex A.\n-> Hexadecimal: 0xCA.',
        ],
        finalResult: '1010₂ = 10₁₀ = A₁₆ | 1111₂ = 15₁₀ = F₁₆ | 11001010₂ = 202₁₀ = CA₁₆',
      },
      practice: [
        {
          id: 1,
          prompt: 'Convert binary 1010 to decimal.',
          expected: '10',
          hints: 'Use 4-bit place values (8, 4, 2, 1): (1 * 8) + (0 * 4) + (1 * 2) + (0 * 1) = 8 + 2 = 10.',
        },
        {
          id: 2,
          prompt: 'Convert decimal 15 to a 4-bit binary nibble.',
          expected: '1111',
          hints: '8 + 4 + 2 + 1 = 15 (all 4 bits active).',
        },
        {
          id: 3,
          prompt: 'Convert binary 1010 to a single hexadecimal digit.',
          expected: 'A',
          hints: 'In hexadecimal, decimal 10 is represented by the letter A.',
        },
        {
          id: 4,
          prompt: 'Convert hexadecimal digit F to a 4-bit binary nibble.',
          expected: '1111',
          hints: 'Hex F equals decimal 15 = binary 1111.',
        },
        {
          id: 5,
          prompt: 'Convert decimal 192 into an 8-bit binary string.',
          expected: '11000000',
          hints: '128 + 64 = 192 (Bits 128 and 64 are 1, remaining bits are 0).',
        },
        {
          id: 6,
          prompt: 'Convert binary byte 11001010 into a 2-digit hexadecimal string.',
          expected: 'CA',
          hints: 'Split into nibbles: Left 1100 = 12 (C), Right 1010 = 10 (A) -> CA.',
        },
      ],
      recap: [
        'A Bit is the smallest binary unit (0 or 1). A Nibble is 4 bits (0–F in hex). A Byte (Octet) is 8 bits (0–255 in decimal, 00–FF in hex).',
        'In an 8-bit byte, the positional place values from left to right are: 128, 64, 32, 16, 8, 4, 2, 1.',
        'To convert decimal to binary, subtract active place values from left to right.',
        'To convert binary to hexadecimal, split into two 4-bit nibbles and convert each nibble into a single hex symbol (0–9, A–F).',
        'Hexadecimal is used in networking (such as MAC and IPv6 addresses) because it represents 4 binary bits with a single human-readable character.',
      ],
    },
    questions: [
      {
        text: 'How many binary bits are in one standard byte (octet)?',
        options: ['8 bits', '4 bits', '16 bits', '2 bits'],
        correctOption: 0,
        explanation: 'A byte (known as an octet in networking) consists of exactly 8 binary bits.',
        explanationsJson: {
          1: '4 bits is a nibble (half a byte).',
          2: '16 bits is two full bytes.',
          3: '2 bits can only represent 4 distinct states (00, 01, 10, 11).',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Bit and Byte Architecture',
      },
      {
        text: 'How many binary bits are represented by a single hexadecimal character (a nibble)?',
        options: ['4 bits', '8 bits', '2 bits', '16 bits'],
        correctOption: 0,
        explanation: 'Each hexadecimal digit represents a 4-bit nibble (2^4 = 16 distinct states: 0 to F). Two hex characters form an 8-bit byte.',
        explanationsJson: {
          1: '8 bits is one full Byte (represented by two hex characters).',
          2: '2 bits can only represent 4 states (0-3).',
          3: '16 bits is a two-byte word (represented by four hex characters).',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Nibble and Hexadecimal Architecture',
      },
      {
        text: 'What is the binary representation of decimal integer 192?',
        options: ['11000000', '10101010', '11100000', '10000000'],
        correctOption: 0,
        explanation: 'Decimal 192 is formed by 128 + 64 = 192 (Bits 128 and 64 set to 1, all others 0: 11000000).',
        explanationsJson: {
          1: '10101010 equals decimal 170 (128+32+8+2).',
          2: '11100000 equals decimal 224 (128+64+32).',
          3: '10000000 equals decimal 128.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Binary Conversion',
      },
      {
        text: 'What is the hexadecimal representation of the 8-bit binary value 11001010?',
        options: ['0xCA', '0xAC', '0xCB', '0xDA'],
        correctOption: 0,
        explanation: 'Split into two 4-bit nibbles: Upper nibble 1100 = 8+4 = 12 (hex C). Lower nibble 1010 = 8+2 = 10 (hex A). Hex string is 0xCA.',
        explanationsJson: {
          1: '0xAC has the nibbles reversed (1010 1100).',
          2: '0xCB has lower nibble 1011 (11 = B).',
          3: '0xDA has upper nibble 1101 (13 = D).',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Binary Nibble to Hex Conversion',
      },
      {
        text: 'What is the decimal equivalent of the hexadecimal byte 0xFF?',
        options: ['255', '256', '250', '240'],
        correctOption: 0,
        explanation: 'In hexadecimal, F = 15. Value = (15 * 16) + (15 * 1) = 240 + 15 = 255. This is the maximum decimal value of an 8-bit byte.',
        explanationsJson: {
          1: '256 is the total number of distinct states (0 to 255), not the maximum value.',
          2: '250 is 0xFA (15 * 16 + 10).',
          3: '240 is 0xF0 (15 * 16 + 0).',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Hexadecimal to Decimal Conversion',
      },
      {
        text: 'Why does computer networking commonly use hexadecimal notation for MAC addresses and IPv6 addresses?',
        options: [
          'It provides a compact, human-readable shorthand where each hex digit directly represents 4 binary bits',
          'Hexadecimal is an analog electrical format used on physical cables',
          'Hexadecimal allows network switches to forward packets twice as fast as binary',
          'Network hardware can only process numbers between 0 and 15',
        ],
        correctOption: 0,
        explanation: 'Hexadecimal is used because it compactly represents 4 binary bits per symbol. A 48-bit MAC address in binary is 48 ones and zeros, but in hex it is written concisely with 12 characters (e.g., 00:1A:2B:3C:4D:5E).',
        explanationsJson: {
          1: 'Hexadecimal is a digital numerical representation, not an analog cable format.',
          2: 'Hardware processes physical binary voltage states regardless of the notation humans use.',
          3: 'Network hardware processes full binary words and packets, not just 0-15.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Why Networking Uses Hexadecimal',
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
    contentV2: {
      objective:
        'Understand what constitutes a computer network, analyze the 5 foundational elements of communication (Sender, Receiver, Medium, Message, Protocol), and differentiate between Simplex, Half-Duplex, and Full-Duplex transmission modes.',
      prerequisites: ['net-101-bits-bytes-binary-hex'],
      whyItMatters:
        'Every distributed software application, cloud service, and internet communication relies on interconnected nodes, physical transmission media, and standardized communication protocols. Understanding the foundational communication model is essential before learning addressing, switching, or routing.',
      explanation:
        'A computer network is an interconnected collection of autonomous computing devices (nodes) capable of exchanging digital data and sharing computing resources across physical or wireless communication links. Every communication transaction in networking requires five foundational elements: (1) Sender (the source node creating the message), (2) Receiver (the destination node receiving the message), (3) Medium (the physical pathway—copper cable, optical glass fiber, or wireless radio frequency spectrum—over which the signal travels), (4) Message (the digital information or data payload being conveyed), and (5) Protocol (the agreed-upon set of rules governing message syntax, meaning, and synchronization).\n\nData telecommunication across a medium operates in one of three directional transmission modes: Simplex (strictly one-way communication where the sender only transmits and the receiver only listens, such as keyboard input or traditional broadcast radio), Half-Duplex (two-way communication where both parties can transmit and receive, but only one at a time to prevent collisions, such as a walkie-talkie or legacy shared Ethernet hubs), and Full-Duplex (simultaneous bidirectional communication where both nodes transmit and receive concurrently without contention, as in modern switched Ethernet and telephone calls).',
      components: [
        { name: '1. Network Nodes & Devices', detail: 'End-user devices (workstations, servers, smartphones, IoT sensors) and intermediate infrastructure (switches, routers, access points) that originate, route, and terminate digital data.' },
        { name: '2. Communication Links & Media', detail: 'Guided physical channels (copper twisted pair, coaxial, optical fiber) and unguided wireless channels (radio frequency, microwave, infrared) connecting nodes.' },
        { name: '3. Sender & Receiver', detail: 'The communicating endpoints. The sender encodes information into physical signals; the receiver captures the signals and reconstructs the data.' },
        { name: '4. Message / Data Payload', detail: 'The digital information conveyed across the network, ranging from single sensor readings and text characters to high-definition video frames and database records.' },
        { name: '5. Communication Protocol', detail: 'A formal set of rules defining the format, timing, sequencing, and error-handling mechanisms that allow heterogeneous hardware to interoperate reliably.' },
        { name: '6. Transmission Duplex Modes', detail: 'Simplex (unidirectional only), Half-Duplex (bidirectional turn-taking), and Full-Duplex (simultaneous bidirectional without blocking).' },
      ],
      howItWorks: [
        { stepNumber: 1, title: 'Data Formulation & Encoding', action: 'The sender application produces a message payload and prepares it for transmission using a shared communication protocol.' },
        { stepNumber: 2, title: 'Signal Transmission Across Medium', action: 'The sender network interface transforms the binary data into physical signals (electrical voltages, light pulses, or radio waves) traveling across the medium.' },
        { stepNumber: 3, title: 'Signal Reception & Protocol Decoding', action: 'The receiver captures the physical signals from the medium, decodes them back into binary bits, validates the protocol rules, and delivers the message to the destination application.' },
      ],
      visualizer: {
        type: 'NETWORK_GRAPH',
        title: 'Interactive Network Communication Flow & Duplex Mode Simulator',
        description: 'Visualize how data packets flow between sender and receiver across different physical media, and toggle between Simplex, Half-Duplex, and Full-Duplex transmission modes.',
      },
      workedExample: {
        title: 'Classifying Telecommunication Systems by Directional Duplex Mode',
        problemStatement: 'Classify each real-world system into Simplex, Half-Duplex, or Full-Duplex:\n1. FM Radio broadcast from a radio tower to car receivers.\n2. Push-to-Talk (PTT) walkie-talkie communication between security guards.\n3. Modern Gigabit Ethernet connection between a PC and a network switch.',
        stepByStepSolution: [
          '1. FM Radio: The radio station tower broadcasts signals to car radios, but cars cannot transmit back to the tower. Transmission is strictly unidirectional -> Simplex.',
          '2. Walkie-Talkie: Both guards can speak and listen over the shared radio frequency, but when one presses the button to talk, the other must wait and listen to avoid audio overlap -> Half-Duplex.',
          '3. Gigabit Ethernet: Modern switches use dedicated transmit (Tx) and receive (Rx) wire pairs, allowing the PC and switch to send and receive frames simultaneously at 1 Gbps each way without collisions -> Full-Duplex.',
        ],
        finalResult: '1: Simplex (one-way). 2: Half-Duplex (two-way sequential). 3: Full-Duplex (two-way simultaneous).',
      },
      practice: [
        {
          id: 1,
          prompt: 'Identify the five foundational elements present in an email transaction between a user laptop and an office mail server.',
          expected: 'Sender (laptop), Receiver (mail server), Medium (Ethernet/Wi-Fi link), Message (email payload), Protocol (SMTP/IMAP/TCP/IP).',
          hints: 'Recall the 5 communication elements: Sender, Receiver, Medium, Message, Protocol.',
        },
        {
          id: 2,
          prompt: 'Why does Full-Duplex Ethernet achieve twice the aggregate throughput of Half-Duplex Ethernet at the same clock speed?',
          expected: 'Full-Duplex uses separate transmit and receive channels, enabling simultaneous 100 Mbps transmission in both directions (200 Mbps total) without collisions.',
          hints: 'Consider simultaneous bidirectional transmission vs turn-taking.',
        },
      ],
      recap: [
        'A computer network connects autonomous computing devices to exchange data and share resources over communication channels.',
        'Every telecommunication transaction requires five elements: Sender, Receiver, Medium, Message, and Protocol.',
        'Transmission modes govern direction: Simplex (one-way only), Half-Duplex (bidirectional turn-taking), and Full-Duplex (simultaneous bidirectional).',
      ],
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
      {
        text: 'In the foundational 5-element model of telecommunications (Sender, Receiver, Medium, Message, Protocol), what is the specific role of the Protocol?',
        options: [
          'It defines the formal rules, syntax, and timing governing how data is formatted and interpreted by communicating devices',
          'It is the physical glass fiber cable connecting the buildings',
          'It is the electrical battery powering the network switch',
          'It is the human user reading the screen',
        ],
        correctOption: 0,
        explanation: 'A protocol is the set of rules governing data telecommunication, specifying message format (syntax), meaning (semantics), and synchronization (timing).',
        explanationsJson: { 1: 'That is the transmission medium.', 2: 'That is power supply.', 3: 'That is the end user.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Protocol Definition & Role',
      },
      {
        text: 'Two network devices communicate over a channel where both devices can send and receive data, but only one device is permitted to transmit at any given instant. Which transmission mode is this?',
        options: [
          'Half-Duplex',
          'Simplex',
          'Full-Duplex',
          'Multiplexing',
        ],
        correctOption: 0,
        explanation: 'Half-Duplex allows bidirectional communication, but only one direction at a time (turn-taking). Full-Duplex allows simultaneous bidirectional transmission, while Simplex is strictly one-way.',
        explanationsJson: { 1: 'Simplex is strictly one-way (transmit-only or receive-only).', 2: 'Full-Duplex transmits in both directions simultaneously.', 3: 'Multiplexing is combining multiple signals on one channel.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Transmission Modes: Duplex Classification',
      },
    ],
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
    contentV2: {
      objective:
        'Understand Client and Server roles, analyze the Request/Response transaction cycle, evaluate Peer-to-Peer (P2P) decentralized swarms, and compare administrative control and Single Point of Failure (SPOF) tradeoffs.',
      prerequisites: ['level-0-what-is-a-computer-network'],
      whyItMatters:
        'Every internet application—from web browsing and mobile banking to streaming media and distributed blockchains—is architected around either a centralized Client-Server or decentralized Peer-to-Peer model. Selecting the right architecture determines system resilience, administrative control, and scaling cost under heavy user load.',
      explanation:
        'In distributed computing, software systems organize device roles into two primary architectural models: Client-Server and Peer-to-Peer (P2P).\n\nThe Client-Server model is an asymmetric architecture where roles are strictly divided. A Client is an active requester (such as a web browser or mobile app) that initiates communication to ask for a service or resource. A Server is a specialized, high-availability host running background software (a daemon) that passively listens on a designated network address for incoming client requests, executes business logic or database queries, and transmits a response payload back to the client. This centralized structure provides strong administrative control, centralized security auditing, and unified data consistency, but makes the server a potential bottleneck and Single Point of Failure (SPOF).\n\nThe Peer-to-Peer (P2P) model is a symmetric, decentralized architecture where every participating node (peer) possesses equivalent privileges and responsibilities. Each peer operates simultaneously as both a client (downloading pieces of data from other peers) and a server (uploading pieces to neighboring peers). As more peers join the P2P swarm, aggregate bandwidth and system capacity increase dynamically without requiring expensive central datacenter scaling.',
      components: [
        { name: '1. Client Endpoint', detail: 'The active initiator of a network transaction. Sends formatted requests to servers and renders or processes returned responses.' },
        { name: '2. Server Daemon', detail: 'A long-running program that passively listens on a network port, authenticates clients, enforces business logic, and serves resources.' },
        { name: '3. Request-Response Transaction Cycle', detail: 'The fundamental communication cycle: Client sends request parameters -> Server validates and processes -> Server transmits response status and data.' },
        { name: '4. Peer-to-Peer (P2P) Node', detail: 'A decentralized computing node that concurrently acts as both client (requester) and server (resource provider) within a distributed swarm.' },
        { name: '5. Centralized vs Decentralized Architecture Tradeoffs', detail: 'Client-Server offers simple management and strict data consistency but has SPOF risks; P2P offers self-scaling capacity and fault tolerance but lacks centralized governance.' },
      ],
      howItWorks: [
        { stepNumber: 1, title: 'Server Passive Listening', action: 'The server initializes its service daemon, binds to a network IP address, and passively awaits incoming client connection requests.' },
        { stepNumber: 2, title: 'Client Request Initiation', action: 'A client application constructs a structured service request and transmits it across the network to the server.' },
        { stepNumber: 3, title: 'Server Execution & Response Delivery', action: 'The server receives the request, processes the query or file retrieval, and transmits a formatted response containing the requested data or status code.' },
      ],
      visualizer: {
        type: 'CLIENT_SERVER_FLOW',
        title: 'Interactive Client-Server vs P2P Swarm Architecture Simulator',
        description: 'Simulate how centralized servers handle increasing client request load, observe single-point-of-failure bottlenecks, and contrast with decentralized P2P swarm scaling.',
      },
      workedExample: {
        title: 'Distributing a 1 GB Software Update to 1,000 Users: Client-Server vs P2P',
        problemStatement: 'A software company must distribute a 1 GB file to 1,000 users. The central server has 1 Gbps (125 MB/s) upload bandwidth. In P2P, each user contributes 20 Mbps (2.5 MB/s) upload bandwidth. Compare total distribution time.',
        stepByStepSolution: [
          '1. Client-Server Model: The central server must independently upload the entire 1 GB file 1,000 times (Total data = 1,000 GB). At 125 MB/s upload: 1,000,000 MB / 125 MB/s = 8,000 seconds (~2.22 hours) server bottleneck.',
          '2. Peer-to-Peer Model: The server only needs to seed the initial chunks into the swarm. Once users receive chunks, they immediately upload them to other peers. 1,000 users * 2.5 MB/s = 2,500 MB/s aggregate swarm upload capacity.',
          '3. Distribution Time: With 2,500 MB/s aggregate bandwidth, 1,000 GB distributes across all peers in approximately 400 seconds (under 7 minutes).',
        ],
        finalResult: 'Client-Server distribution is limited by central server bandwidth (2.2 hours); P2P aggregates user upload bandwidth to finish in under 7 minutes.',
      },
      practice: [
        {
          id: 1,
          prompt: 'State two primary advantages and one major disadvantage of a centralized Client-Server architecture compared to P2P.',
          expected: 'Advantages: Centralized data consistency/management, simplified access control/security. Disadvantage: Server is a Single Point of Failure (SPOF) and performance bottleneck under high load.',
          hints: 'Think about administrative control versus single points of failure.',
        },
        {
          id: 2,
          prompt: 'Why does a Peer-to-Peer system naturally scale up in capacity when thousands of new users join?',
          expected: 'Because every new peer contributes its own computing and upload bandwidth to the swarm, increasing total system capacity alongside demand.',
          hints: 'Remember that peers act as both clients and servers.',
        },
      ],
      recap: [
        'Client-Server is asymmetric: Clients initiate requests; Servers passively listen and serve responses.',
        'Client-Server provides strong centralized control but suffers from single-point-of-failure (SPOF) risks and server bandwidth bottlenecks.',
        'Peer-to-Peer (P2P) is symmetric: Peers act simultaneously as clients and servers, dynamically self-scaling as more participants join.',
      ],
    },
    questions: [
      {
        text: 'In the classic Client-Server networking model, what is the primary operational role of a Server?',
        options: [
          'To passively listen on a designated network address, process incoming client requests, and return appropriate response data',
          'To continuously initiate random outgoing connections to client laptops without user prompting',
          'To convert optical light signals directly into AC electrical voltage',
          'To act only as a physical patch panel terminating copper cables',
        ],
        correctOption: 0,
        explanation: 'A server runs a service daemon listening on a known address/port to process incoming client requests and return formatted responses.',
        explanationsJson: { 1: 'Clients initiate connections; servers passively listen.', 2: 'That describes a power supply, not a software server role.', 3: 'A patch panel is passive cabling hardware.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Server Role & Passive Listening',
      },
      {
        text: 'What is a major architectural vulnerability inherent to centralized Client-Server networks that is mitigated by Peer-to-Peer (P2P) designs?',
        options: [
          'The central server represents a Single Point of Failure (SPOF) and bandwidth bottleneck if it goes offline or is overwhelmed',
          'Client-Server networks cannot use copper cables',
          'Client devices in a client-server network must be identical hardware models',
          'Servers cannot store more than 10 files simultaneously',
        ],
        correctOption: 0,
        explanation: 'If a centralized server crashes or becomes overwhelmed by traffic, all clients lose access to the service (Single Point of Failure). P2P distributes resources across all peers so no single node outage halts the network.',
        explanationsJson: { 1: 'Client-server runs over any network media.', 2: 'Networks are heterogeneous.', 3: 'Servers can store millions of files.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Single Point of Failure in Client-Server',
      },
      {
        text: 'Which statement accurately describes node behavior in a true Peer-to-Peer (P2P) network?',
        options: [
          'Each participating peer acts simultaneously as both a client requesting data and a server uploading data to other peers',
          'Every node must register with a central government mainframe before transmitting',
          'Peers can only receive data and are strictly prohibited from uploading',
          'All communication must route through a dedicated central corporate database server',
        ],
        correctOption: 0,
        explanation: 'In P2P architectures, peers have symmetric roles: they download data from others (acting as clients) while concurrently uploading data chunks to others (acting as servers).',
        explanationsJson: { 1: 'P2P is decentralized and requires no central mainframe.', 2: 'Peers upload and download concurrently.', 3: 'Routing through a central server describes client-server, not P2P.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Peer-to-Peer Symmetric Behavior',
      },
    ],
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
    contentV2: {
      objective:
        'Classify networks across geographic scopes (PAN, LAN, CAN, MAN, WAN) based on distance, ownership, and media, and understand the tiered routing hierarchy and peering infrastructure (Tier 1/2/3 ISPs and IXPs) that powers the global Internet.',
      prerequisites: ['level-0-what-is-a-computer-network'],
      whyItMatters:
        'A network architect designs a local office LAN completely differently from a global multi-region enterprise WAN. Understanding geographic boundaries, autonomous systems, ISP transit tiers, and peering exchanges is critical for troubleshooting end-to-end latency, path routing, and carrier bandwidth costs.',
      explanation:
        'Networks are classified by their physical span and organizational ownership into distinct geographic scopes:\n- Personal Area Network (PAN): Spans immediate individual workspace (~1–10 meters) using short-range technologies like Bluetooth, Zigbee, or USB.\n- Local Area Network (LAN): Connects devices within a single room, floor, or building under unified organizational control, operating at high speeds (1–10 Gbps) over Ethernet and Wi-Fi.\n- Campus Area Network (CAN): Interconnects multiple localized LANs across contiguous buildings (such as a university or hospital campus) using privately owned optical fiber without crossing public rights-of-way.\n- Metropolitan Area Network (MAN): Covers an entire city or municipal region (5–50 km) utilizing carrier-provided Metro Ethernet or dark fiber.\n- Wide Area Network (WAN): Spans vast geographical regions, countries, or continents by interconnecting distributed LANs across public rights-of-way over leased telecommunications carrier infrastructure.\n\nThe global Internet is a decentralized "network of networks" organized into a three-tier hierarchy: Tier 1 ISPs form the global backbone core, interconnecting through settlement-free peering (exchanging traffic without paying transit fees). Tier 2 ISPs are regional carriers that peer with each other and pay Tier 1 providers for global transit. Tier 3 ISPs are local access providers (commercial and residential broadband) that sell Internet access to end users. Internet Exchange Points (IXPs) are dedicated physical facilities where ISPs, content providers (e.g. Google, Netflix), and CDNs peer traffic directly to reduce latency and eliminate expensive transit fees.',
      components: [
        { name: '1. Personal Area Network (PAN)', detail: 'Individual reach (~1-10 meters). Connects peripherals, smartwatches, and smartphones via Bluetooth, BLE, or USB.' },
        { name: '2. Local Area Network (LAN)', detail: 'Confined to a single room or building owned by one entity. High bandwidth (1-10 Gbps), low latency, private Ethernet/Wi-Fi infrastructure.' },
        { name: '3. Campus Area Network (CAN)', detail: 'Multiple adjacent buildings on private land (universities, corporate parks) linked via private fiber cabling.' },
        { name: '4. Metropolitan Area Network (MAN)', detail: 'City-wide span (5-50 km). Connects municipal offices and financial districts via Metro Ethernet or dark fiber.' },
        { name: '5. Wide Area Network (WAN)', detail: 'Interconnects distributed geographic sites across public lands using leased carrier circuits, satellite, and undersea cables.' },
        { name: '6. Tier 1, 2, and 3 ISPs', detail: 'Tier 1: Global settlement-free transit core. Tier 2: Regional carriers with partial transit. Tier 3: Local retail access providers.' },
        { name: '7. Internet Exchange Points (IXPs)', detail: 'Physical switching centers where independent networks connect to exchange traffic directly via settlement-free peering.' },
      ],
      howItWorks: [
        { stepNumber: 1, title: 'Local LAN Ingress & Gateway Egress', action: 'An endpoint generates packets on its local LAN; if destination is external, packets forward to the local default gateway router.' },
        { stepNumber: 2, title: 'Access ISP Uplink (Tier 3)', action: 'The local gateway transmits the packet across the subscriber broadband connection to the Tier 3 Access ISP.' },
        { stepNumber: 3, title: 'Transit Ascent or Direct IXP Peering', action: 'If the destination network peers at a shared local IXP, traffic crosses directly between providers. Otherwise, traffic ascends to Tier 2/Tier 1 backbones for global transit.' },
      ],
      visualizer: {
        type: 'INTERNET_HIERARCHY_MAP',
        title: 'Interactive Internet Hierarchy & Geographic Scope Explorer',
        description: 'Explore geographic boundaries from PAN and LAN to global WAN, and trace how packets route across Tier 1, 2, and 3 ISPs and Internet Exchange Points (IXPs).',
      },
      workedExample: {
        title: 'Evaluating Network Latency and Transit Cost: Direct IXP Peering vs Tier 1 Transit',
        problemStatement: 'An ISP in London serves 50,000 users streaming video hosted in London. Compare routing traffic via a local IXP (LINX) vs routing via paid upstream Tier 1 transit across the Atlantic.',
        stepByStepSolution: [
          '1. Direct IXP Peering: The ISP and the video provider connect to LINX switch fabric in London. Traffic travels directly across the local exchange: 4 router hops, 3 ms latency, $0 incremental per-gigabit transit fee.',
          '2. Upstream Transit: If not peering locally, traffic routes from the London ISP -> Tier 2 transit -> Tier 1 transatlantic backbone -> Tier 2 -> Video server: 10+ router hops, 45 ms latency, paid per-Mbps transit fees.',
          '3. Architectural Advantage: Direct peering at an IXP reduces latency by 42 ms (over 90%), eliminates transit costs, and shields local users from international link congestion.',
        ],
        finalResult: 'Direct IXP peering reduces hop count from 10+ to 4, cuts latency from 45ms to 3ms, and eliminates transit bandwidth fees.',
      },
      practice: [
        {
          id: 1,
          prompt: 'A hospital system has 6 medical buildings across a 2-square-mile private campus connected by private optical fiber conduits. What geographic network classification applies?',
          expected: 'Campus Area Network (CAN). It spans multiple contiguous buildings on private property using private cabling without crossing public leased carrier infrastructure.',
          hints: 'Contrast single building (LAN) with multi-building private campus (CAN) and leased public land (WAN).',
        },
        {
          id: 2,
          prompt: 'What defines a Tier 1 Internet Service Provider (ISP) and how does it reach other Tier 1 providers?',
          expected: 'A Tier 1 ISP owns a global backbone network capable of reaching the entire Internet without purchasing transit. Tier 1 providers connect to each other via settlement-free peering agreements.',
          hints: 'Focus on settlement-free peering and absence of transit fees.',
        },
      ],
      recap: [
        'Geographic scopes range from PAN (~10m) and LAN (single building) to CAN (campus), MAN (city), and WAN (global leased spans).',
        'The global Internet is organized into a 3-tier hierarchy: Tier 1 (settlement-free core), Tier 2 (regional providers), and Tier 3 (retail access ISPs).',
        'Internet Exchange Points (IXPs) allow networks to peer traffic directly, reducing end-to-end latency and eliminating transit costs.',
      ],
    },
    questions: [
      {
        text: 'How is a Campus Area Network (CAN) fundamentally distinguished from a Wide Area Network (WAN)?',
        options: [
          'A CAN interconnects multiple contiguous buildings on private property using private fiber, whereas a WAN spans vast distances across public property using leased carrier infrastructure',
          'A CAN operates only over satellite links while a WAN uses copper twisted pair',
          'A CAN does not use IP addresses or routing protocols',
          'A CAN is limited to a maximum of 10 connected computers',
        ],
        correctOption: 0,
        explanation: 'A CAN connects buildings on private campus property without crossing public rights-of-way; a WAN spans long distances across public regions using leased telecommunications provider infrastructure.',
        explanationsJson: { 1: 'Both CANs and WANs use fiber, wireless, and copper as appropriate.', 2: 'Both use standard IP routing.', 3: 'CANs routinely support tens of thousands of users.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'CAN vs WAN Classification',
      },
      {
        text: 'What is the primary function of an Internet Exchange Point (IXP) in the global internetworking architecture?',
        options: [
          'To provide a shared physical switching facility where ISPs and content providers peer directly with each other to bypass upstream transit fees and reduce latency',
          'To act as a central power generator during electrical grid blackouts',
          'To assign MAC addresses to newly manufactured network interface cards',
          'To store physical paper copies of all internet traffic for 10 years',
        ],
        correctOption: 0,
        explanation: 'IXPs are dedicated physical interconnection hubs that allow participating networks to exchange traffic directly via settlement-free peering, keeping local traffic local and cutting transit expenses.',
        explanationsJson: { 1: 'IXPs are network switches, not utility power plants.', 2: 'IEEE assigns OUI prefixes, not IXPs.', 3: 'IXPs switch packets in nanoseconds and do not store paper copies.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Internet Exchange Point (IXP) Role',
      },
      {
        text: 'Which category of Internet Service Provider (ISP) owns a global backbone network that can reach every destination on the Internet through settlement-free peering alone without paying for transit?',
        options: [
          'Tier 1 ISP',
          'Tier 3 Access ISP',
          'Tier 2 Regional ISP',
          'Personal Area Network Provider',
        ],
        correctOption: 0,
        explanation: 'Tier 1 ISPs form the top of the Internet hierarchy. They own massive global backbone networks and peer with all other Tier 1 providers without paying transit fees.',
        explanationsJson: { 1: 'Tier 3 ISPs are local retail providers that purchase transit.', 2: 'Tier 2 ISPs purchase transit from Tier 1 providers.', 3: 'PAN is a local personal device scope.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Tier 1 ISP Hierarchy & Peering',
      },
    ],
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
    contentV2: {
      objective:
        'Understand the distinction between Physical and Logical topologies, evaluate Star, Bus, Ring, Full Mesh, Partial Mesh, and Tree architectures, calculate full mesh link requirements using N(N-1)/2, and assess single points of failure (SPOF) and fault tolerance.',
      prerequisites: ['level-0-what-is-a-computer-network'],
      whyItMatters:
        'Topology design dictates network survivability, cabling expense, and performance bottlenecks. In an enterprise, an improperly architected topology can cause widespread outages from a single cable cut, whereas an engineered resilient topology provides automatic alternate paths.',
      explanation:
        'A network topology defines how nodes and links are arranged and how data signals traverse the infrastructure. Topology must be analyzed from two distinct perspectives:\n- Physical Topology: The actual geometric physical arrangement of cables, patch cords, racks, and hardware devices.\n- Logical Topology: The logical path and access method that data signals follow as they travel from node to node across the medium, regardless of physical cabling layout.\n\nClassic Network Topologies:\n1. Star: All peripheral devices connect via individual point-to-point links to a central networking device (switch). This is the ubiquitous standard for modern LANs. A single cable break impacts only one host, but the central switch is a Single Point of Failure (SPOF).\n2. Bus: All devices share a single linear trunk cable. Requires 50-ohm terminating resistors at each physical end to absorb signals and prevent reflections. If the trunk cable is severed, the entire network fails.\n3. Ring: Devices connect sequentially in a closed physical loop. Data circulates unidirectionally around the ring. A single break halts all communication unless configured with dual-ring counter-rotating redundancy (e.g. FDDI).\n4. Full Mesh: Every node connects directly to every other node via dedicated point-to-point links. Provides maximum redundancy and zero single points of failure, but link counts grow quadratically according to $L = \\frac{N(N-1)}{2}$.\n5. Partial Mesh: Dedicated redundant links are added only between critical core routers and high-traffic nodes, balancing fault tolerance against cabling and interface expense.\n6. Tree / Hierarchical: A tiered multi-layer structure (Access, Distribution, Core) where groups of star topologies connect into higher-tier switches, enabling modular enterprise scaling.',
      components: [
        { name: '1. Physical vs Logical Topology', detail: 'Physical is the tangible cable blueprint; Logical is the signal flow and protocol data path.' },
        { name: '2. Star Topology', detail: 'Central switch with dedicated home-run cabling to each node. LAN industry standard; isolates link failures but central switch is SPOF.' },
        { name: '3. Bus Topology', detail: 'Single shared backbone cable with BNC T-connectors and terminating resistors. High collision rate and fragile trunk.' },
        { name: '4. Ring Topology', detail: 'Closed circular sequential token-passing loop. Predictable latency but single cable break causes complete failure.' },
        { name: '5. Full Mesh Topology', detail: 'Maximum fault tolerance. Formula $L = \\frac{N(N-1)}{2}$. Every node has a direct dedicated link to every other node.' },
        { name: '6. Partial Mesh & Hierarchical Tree', detail: 'Partial Mesh protects critical core routes; Tree hierarchy scales campus networks into Core, Distribution, and Access tiers.' },
      ],
      howItWorks: [
        { stepNumber: 1, title: 'Physical Cabling Distribution', action: 'Physical cables are routed from end nodes to central patch panels, distribution switches, or adjacent mesh peers.' },
        { stepNumber: 2, title: 'Link Count & Redundancy Calculation', action: 'Designers apply the mesh formula $L = \\frac{N(N-1)}{2}$ to calculate physical interfaces and transceiver requirements.' },
        { stepNumber: 3, title: 'Failure Isolation & Alternate Routing', action: 'When a cable breaks or a node fails, star networks isolate the impact to that single host, while mesh networks automatically route traffic across alternate active links.' },
      ],
      visualizer: {
        type: 'TOPOLOGY_SIMULATOR',
        title: 'Interactive Network Topology & Failure Mode Simulator',
        description: 'Simulate packet transmission across Star, Full Mesh, Partial Mesh, Bus, and Ring topologies. Test node failures and cable cuts to observe single points of failure and fault tolerance in real time.',
      },
      workedExample: {
        title: 'Cabling & Cost Comparison: Connecting 8 Core Routers in Full Mesh vs Star',
        problemStatement: 'An enterprise datacenter must interconnect 8 core routers. Each 10 Gbps optical fiber link and transceiver port costs $4,000 to deploy. Compare link count, total cost, and fault tolerance for Full Mesh vs Star (using a central core switch).',
        stepByStepSolution: [
          '1. Full Mesh Link Calculation: $L = \\frac{N(N-1)}{2} = \\frac{8 \\times 7}{2} = \\frac{56}{2} = 28 \\text{ dedicated links}$. Total cost = $28 \\times \\$4,000 = \\$112,000$. Fault tolerance: Any link can fail and routers will forward over remaining alternate paths (Zero SPOF).',
          '2. Star Topology Calculation: 8 routers each connect via 1 link to a central core switch ($L = 8 \\text{ links}$). Total cost = $8 \\times \\$4,000 + \\$12,000 \\text{ (switch)} = \\$44,000$. Fault tolerance: Lower cost, but if the central switch fails, all 8 routers lose connectivity.',
          '3. Architectural Decision: For mission-critical core datacenter backbones, enterprises use Full or Partial Mesh to guarantee zero downtime.',
        ],
        finalResult: 'Full Mesh requires 28 links ($112k) with zero SPOF; Star requires 8 links ($44k) but has a single point of failure at the central switch.',
      },
      practice: [
        {
          id: 1,
          prompt: 'Calculate the total number of physical point-to-point links required to connect 10 datacenter routers in a Full Mesh topology.',
          expected: 'Formula: L = N(N - 1) / 2 = 10 * 9 / 2 = 45 physical links.',
          hints: 'Use the Full Mesh formula: N * (N - 1) / 2.',
        },
        {
          id: 2,
          prompt: 'Why can a physical star network behave as a logical bus?',
          expected: 'When devices connect to a legacy hub (physical star cabling), the hub electrically broadcasts every incoming bit to all ports simultaneously, creating a single shared collision domain (logical bus).',
          hints: 'Distinguish between physical wire layout and internal electronic signal broadcasting.',
        },
      ],
      recap: [
        'Physical topology represents the tangible cable arrangement; Logical topology defines the data path and medium access method.',
        'Star topology is the LAN standard because individual cable breaks do not bring down the entire network.',
        'Full Mesh provides maximum fault tolerance without SPOFs, requiring $L = \\frac{N(N-1)}{2}$ links.',
      ],
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
        explanation: 'The full mesh link formula is N(N-1)/2. For 6 routers: (6 * 5) / 2 = 15 physical links.',
        explanationsJson: { 1: 'N*N counts self-connections and duplicates.', 2: 'N-1 is for a linear bus or tree topology.', 3: '2N is for a dual ring.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Full Mesh Link Calculation',
      },
      {
        text: 'What is the operational distinction between a Physical Topology and a Logical Topology?',
        options: [
          'Physical topology describes the physical layout of cables and hardware, whereas Logical topology describes how signals and data actually travel across the network',
          'Physical topology is for wireless networks only, while Logical topology is for copper cabling',
          'Physical topology applies only to computers made by Cisco, while Logical topology applies to Linux servers',
          'There is no distinction; they are always identical in every network',
        ],
        correctOption: 0,
        explanation: 'Physical topology describes physical cable routing and port connections. Logical topology defines the actual data path and transmission behavior across those links.',
        explanationsJson: { 1: 'Both concepts apply to all media.', 2: 'Vendor-independent networking fundamentals.', 3: 'They can be completely different (e.g., physical star with logical bus). ' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Physical vs Logical Topology',
      },
      {
        text: 'Which network topology provides the highest level of fault tolerance and eliminates single points of failure (SPOF) at the cost of high cabling and interface complexity?',
        options: [
          'Full Mesh Topology',
          'Linear Bus Topology',
          'Single Star Topology',
          'Single Ring Topology',
        ],
        correctOption: 0,
        explanation: 'Full Mesh provides dedicated point-to-point connections between every node pair, ensuring that multiple link or node failures will not isolate remaining active nodes.',
        explanationsJson: { 1: 'Bus has a single trunk failure point.', 2: 'Star has a single switch failure point.', 3: 'Single ring halts on a single cable cut.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Topology Fault Tolerance & SPOF',
      },
    ],
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
    contentV2: {
      objective:
        'Understand what defines a network communication protocol (the triad of Syntax, Semantics, and Timing), analyze the roles of open global standards organizations (IETF, IEEE, ISO, ITU-T), and explore the RFC standardization lifecycle.',
      prerequisites: ['level-0-what-is-a-computer-network'],
      whyItMatters:
        'Without open global standards, hardware and software produced by different vendors cannot communicate, creating proprietary walled gardens. Understanding how protocols and RFCs are standardized enables network engineers to design vendor-agnostic architectures and accurately interpret technical specifications.',
      explanation:
        'A network protocol is a formal set of rules and conventions that govern how computing devices exchange information across a network. Every complete protocol specification defines three essential elements:\n1. Syntax: The structure and format of the data being transmitted, specifying field boundaries, bit lengths, byte order, and delimiter characters.\n2. Semantics: The precise meaning of each control field, flag bit, or command value, and the explicit action or state transition required upon receiving it.\n3. Timing / Synchronization: The sequencing rules, speed matching, session establishment, and timeout/retransmission behavior between communicating nodes.\n\nTo ensure global interoperability and prevent proprietary lock-in, international non-profit standards bodies govern networking specifications:\n- IETF (Internet Engineering Task Force): Develops and maintains core Internet protocols (IP, TCP, UDP, DNS, BGP, HTTP) published as open "Request for Comments" (RFC) documents.\n- IEEE (Institute of Electrical and Electronics Engineers): Standardizes physical cabling, electrical signaling, and media access control, notably IEEE 802.3 (Ethernet) and IEEE 802.11 (Wi-Fi).\n- ISO (International Organization for Standardization): Created the 7-layer OSI reference model.\n- ITU-T (International Telecommunication Union): Standardizes global telecommunications, optical transport, and carrier backbones.\n\nThe IETF RFC Lifecycle moves technical proposals from initial Internet-Drafts through peer review and real-world multi-vendor testing into Proposed Standards and formally ratified Internet Standards.',
      components: [
        { name: '1. Protocol Syntax', detail: 'The physical structure, encoding format, and bit/byte layouts of transmitted messages.' },
        { name: '2. Protocol Semantics', detail: 'The operational meaning and logic associated with control values, error flags, and state handlers.' },
        { name: '3. Protocol Timing & Synchronization', detail: 'Speed coordination, transmission sequencing, flow control, and timeout thresholds.' },
        { name: '4. IETF & RFC Publication Architecture', detail: 'Open collaborative engineering body that defines Internet standards published as numbered RFCs (e.g. RFC 791 IPv4, RFC 793 TCP).' },
        { name: '5. IEEE 802 Standards Committees', detail: 'Defines Layer 1 and Layer 2 physical and data link standards: IEEE 802.3 (Ethernet), 802.11 (Wi-Fi), 802.1Q (VLANs).' },
      ],
      howItWorks: [
        { stepNumber: 1, title: 'Internet-Draft Submission', action: 'Engineers submit an open technical specification (Internet-Draft) detailing syntax, semantics, and operation to an IETF working group.' },
        { stepNumber: 2, title: 'Peer Review & Running Code Verification', action: 'Global engineers review, debate, and produce independent software/hardware implementations to verify interoperability.' },
        { stepNumber: 3, title: 'RFC Publication as Open Standard', action: 'The specification is assigned a permanent, immutable RFC number (e.g. RFC 793) and published freely for worldwide implementation.' },
      ],
      visualizer: {
        type: 'STANDARDS_ECOSYSTEM',
        title: 'Interactive Standards Bodies & RFC Lifecycle Explorer',
        description: 'Explore the domains of IETF, IEEE, ISO, and ITU-T, and trace how draft protocol proposals advance through peer review to become global Internet Standards.',
      },
      workedExample: {
        title: 'Deconstructing a Protocol Header into Syntax, Semantics, and Timing',
        problemStatement: 'Analyze the 8-bit Time-to-Live (TTL) field in the IPv4 header (RFC 791) and break it down into Syntax, Semantics, and Timing.',
        stepByStepSolution: [
          '1. Syntax: An 8-bit unsigned integer located at byte offset 8 in the IPv4 header (values 0–255).',
          '2. Semantics: Represents the maximum remaining hop count for the packet. Each router processing the packet MUST decrement the TTL value by 1. If the value drops to 0, the router MUST discard the packet and generate an ICMP Time Exceeded message.',
          '3. Timing: Prevents infinite routing loops by ensuring undeliverable packets expire deterministically within a bounded number of transmission hops.',
        ],
        finalResult: 'Syntax specifies the 8-bit position; Semantics specifies hop-decrement logic; Timing prevents circulating routing loops.',
      },
      practice: [
        {
          id: 1,
          prompt: 'Match the standardizing body (IETF or IEEE) to each protocol/standard: (a) HTTP/2, (b) 802.11ax Wi-Fi 6, (c) BGP-4, (d) 802.3 Fast Ethernet.',
          expected: '(a) HTTP/2 -> IETF (RFC 7540), (b) 802.11ax -> IEEE, (c) BGP-4 -> IETF (RFC 4271), (d) 802.3 -> IEEE.',
          hints: 'IETF standardizes Internet software protocols; IEEE standardizes physical cabling and wireless radios.',
        },
        {
          id: 2,
          prompt: 'What are the three components that define a network protocol, and what role does each play?',
          expected: 'Syntax (structure and format of data), Semantics (meaning of control fields and actions), Timing (synchronization, speed matching, and sequencing).',
          hints: 'Remember the protocol triad: Syntax, Semantics, Timing.',
        },
      ],
      recap: [
        'A protocol is formally defined by Syntax (data format), Semantics (control meaning), and Timing (sequencing and synchronization).',
        'Open standards organizations (IETF, IEEE, ISO) ensure multi-vendor interoperability and prevent proprietary vendor lock-in.',
        'IETF standards are published as open, freely accessible Request for Comments (RFC) documents.',
      ],
    },
    questions: [
      {
        text: 'What are the three essential elements that formally define a network communication protocol?',
        options: [
          'Syntax (message structure), Semantics (meaning of control fields), and Timing (speed matching and sequencing)',
          'Voltage, Amperage, and Resistance',
          'CPU, RAM, and Storage capacity',
          'Router, Switch, and Firewall hardware',
        ],
        correctOption: 0,
        explanation: 'A protocol is formally defined by Syntax (data format and structure), Semantics (meaning and interpretation of control bits), and Timing (sequencing, synchronization, and speed matching).',
        explanationsJson: { 1: 'Electrical properties.', 2: 'Hardware components.', 3: 'Network appliances.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Protocol Definition Triad',
      },
      {
        text: 'Which standards organization is responsible for creating and maintaining core Internet protocols (such as IP, TCP, DNS, and BGP) published as Request for Comments (RFC) documents?',
        options: [
          'Internet Engineering Task Force (IETF)',
          'Institute of Electrical and Electronics Engineers (IEEE)',
          'Federal Communications Commission (FCC)',
          'Underwriters Laboratories (UL)',
        ],
        correctOption: 0,
        explanation: 'The IETF (Internet Engineering Task Force) develops and publishes the official RFC specifications that define core internet protocols like IP, TCP, and DNS.',
        explanationsJson: { 1: 'IEEE standardizes physical/data-link protocols like Ethernet (802.3) and Wi-Fi (802.11).', 2: 'FCC is a government regulatory agency.', 3: 'UL is a safety certification company.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'IETF & RFC Responsibilities',
      },
      {
        text: 'Why are open international networking standards (such as IETF RFCs and IEEE 802 standards) vital for enterprise computing?',
        options: [
          'They ensure that computing devices from different manufacturers can interoperate seamlessly without vendor lock-in',
          'They mandate that every network device must be replaced every 6 months',
          'They restrict network cables to a maximum length of 1 meter',
          'They eliminate the need for electricity in networking',
        ],
        correctOption: 0,
        explanation: 'Open standards define vendor-neutral rules so devices from Cisco, Juniper, Apple, Linux, Microsoft, and others communicate flawlessly across shared networks.',
        explanationsJson: { 1: 'Standards extend equipment longevity.', 2: 'Ethernet runs up to 100m, fiber up to 40km.', 3: 'Electronic networking requires electricity.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Open Standards & Interoperability',
      },
    ],
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

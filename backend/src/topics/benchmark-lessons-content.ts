import { CourseLevel, LessonType, CognitiveLevel, QuestionType } from '@prisma/client';
import { LessonStepMetadata } from './lesson-content.interface';

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
  visualizationType: string;
  introduction: string;
  stepMetadata: LessonStepMetadata;
  questions: BenchmarkQuestionDef[];
  lab: BenchmarkLabDef;
}

export const BENCHMARK_LESSONS_FULL: BenchmarkLessonFullDefinition[] = [
  // =========================================================================
  // REWRITTEN LESSON 1: NET-101 (Bits, Bytes, Binary & Hexadecimal)
  // Focus: Bits, bytes, binary, hexadecimal, nibbles, positional notation,
  // binary/decimal/hex conversion, networking relevance, bandwidth units.
  // Stripped: L3/L4 packet headers, Wireshark, routing, firewall.
  // =========================================================================
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
    stepMetadata: {
      step1_objective:
        'Understand how all digital network communication is constructed from binary bits, how 8 bits form a byte, how hexadecimal notation concisely compresses binary data, and how to convert accurately between decimal, binary, and hexadecimal representations.',
      step2_prerequisites: [
        'Basic arithmetic (addition, subtraction, multiplication, division)',
        'Understanding of decimal (Base-10) positional value (units, tens, hundreds)',
      ],
      step3_whyItMatters:
        'Every physical wire and radio wave carries binary states (high/low voltage, light on/off). Network addresses (MAC and IPv6) are written in hexadecimal, while network link speeds are measured in bits per second (bps) and storage in Bytes (B). Fluency in binary, hex, and bandwidth units is the essential starting point for all networking.',
      step4_coreConcept:
        'Digital systems use Binary (Base-2) because electronic circuits reliably differentiate between two electrical voltage states: 0 (Off/Low) and 1 (On/High). A single binary digit is a Bit. Eight contiguous bits form one Byte (also called an Octet in networking), which can represent 256 distinct values (0 to 255). Hexadecimal (Base-16) uses 16 digits (0–9 and A–F) to represent a 4-bit Nibble in a single character, allowing a full 8-bit byte to be written with just 2 hex characters.',
      step5_technicalAnatomy: {
        title: 'Positional Digital Numbering Systems & Units Architecture',
        description:
          'In positional notation, each column represents a base raised to an increasing power from right to left. Binary uses base 2 ($2^0=1, 2^1=2, 2^2=4, 2^3=8, 2^4=16, 2^5=32, 2^6=64, 2^7=128$). Hexadecimal uses base 16 ($16^0=1, 16^1=16$), where values 10 through 15 are mapped to letters A through F.',
        components: [
          {
            name: 'Bit (b)',
            detail: 'The fundamental unit of digital information. Represents a single 0 or 1 binary state.',
          },
          {
            name: 'Nibble',
            detail: 'A group of 4 contiguous bits (0000 to 1111). Exactly equal to one hexadecimal digit (0 to F).',
          },
          {
            name: 'Byte / Octet (B)',
            detail: 'A group of 8 contiguous bits (00000000 to 11111111). Exactly equal to two hexadecimal digits (00 to FF). Values range from decimal 0 to 255 ($2^8 = 256$ states).',
          },
          {
            name: 'Bandwidth vs Storage Units',
            detail: 'Network transmission speed is measured in bits per second (bps, Kbps, Mbps, Gbps). Data storage and file sizes are measured in Bytes (B, KB, MB, GB). 1 Byte = 8 bits.',
          },
        ],
      },
      step6_howItWorks: {
        steps: [
          {
            stepNumber: 1,
            title: 'Decimal to Binary (Subtraction Method)',
            action:
              'Compare the decimal number against the 8 positional weights (128, 64, 32, 16, 8, 4, 2, 1). If the number is greater than or equal to the weight, place a 1 and subtract the weight; otherwise place a 0. Repeat through weight 1.',
          },
          {
            stepNumber: 2,
            title: 'Binary to Decimal (Summation Method)',
            action:
              'Multiply each binary bit (0 or 1) by its positional column weight and sum all products (e.g., 11000000 = 128 + 64 = 192).',
          },
          {
            stepNumber: 3,
            title: 'Binary to Hexadecimal (Nibble Split)',
            action:
              'Split the 8-bit byte into two 4-bit nibbles. Calculate the decimal value of each nibble (using weights 8, 4, 2, 1) and substitute the corresponding hex symbol (0-9 or A=10, B=11, C=12, D=13, E=14, F=15).',
          },
          {
            stepNumber: 4,
            title: 'Bandwidth Throughput Calculation',
            action:
              'Convert network link rate in bits per second to Byte download speed by dividing by 8 (e.g., 100 Mbps / 8 = 12.5 MB/s maximum theoretical download speed).',
          },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'Digital Byte Architecture & Hexadecimal Representation',
        fields: [
          {
            fieldName: '1 Bit (Binary State)',
            bitLength: '1 bit',
            hexSample: '0 or 1',
            description: 'Fundamental binary unit representing electrical signal high or low.',
          },
          {
            fieldName: '1 Nibble (4 Bits)',
            bitLength: '4 bits',
            hexSample: '0xA (1010)',
            description: 'Half a byte, represented by a single hexadecimal digit (0-F).',
          },
          {
            fieldName: '1 Byte / Octet (8 Bits)',
            bitLength: '8 bits',
            hexSample: '0xFF (11111111)',
            description: 'Two hex digits spanning decimal 0 to 255.',
          },
          {
            fieldName: 'Data Rate Unit (Mbps)',
            bitLength: 'Mega-bits/sec',
            hexSample: '100 Mbps = 12.5 MB/s',
            description: 'Network line speed expressed in bits per second vs Bytes per second.',
          },
        ],
        headerDiagramAscii: `
+---------------------------------------------------------------+
|                      1 Byte (8 Bits / 2 Nibbles)              |
+-------------------------------+-------------------------------+
|      Upper Nibble (4 bits)    |      Lower Nibble (4 bits)    |
|   128     64     32     16    |    8      4      2      1     |
|  [ 1 ]   [ 1 ]  [ 0 ]  [ 0 ]  |  [ 1 ]  [ 0 ]  [ 1 ]  [ 0 ]   |
|         Binary: 1100          |         Binary: 1010          |
|      Decimal: 8+4 = 12        |      Decimal: 8+2 = 10        |
|         Hex Digit: C          |         Hex Digit: A          |
+-------------------------------+-------------------------------+
|         Full Byte: 11001010 (Binary) = 202 (Decimal) = 0xCA (Hex)     |
+---------------------------------------------------------------+
`,
      },
      step8_visualExplanation: {
        type: 'BINARY_CONVERTER',
        title: 'Interactive 8-Bit Positional Binary & Hex Converter',
        description:
          'Toggle each of the 8 bit switches (128, 64, 32, 16, 8, 4, 2, 1) to observe real-time decimal summation, nibble division, and hexadecimal notation updates.',
      },
      step9_workedExample: {
        title: 'Converting Decimal 202 to Binary and Hexadecimal & Calculating Download Speed',
        problemStatement:
          '1. Convert decimal number 202 into 8-bit binary and 2-digit hexadecimal.\n2. If an Internet connection has a bandwidth of 80 Mbps, what is the maximum theoretical download rate in MegaBytes per second (MB/s)?',
        stepByStepSolution: [
          'Step 1 (Binary): Compare 202 to positional weights:',
          '  202 >= 128 -> Bit 7 = 1 (Remainder: 202 - 128 = 74)',
          '  74 >= 64 -> Bit 6 = 1 (Remainder: 74 - 64 = 10)',
          '  10 < 32 -> Bit 5 = 0',
          '  10 < 16 -> Bit 4 = 0',
          '  10 >= 8 -> Bit 3 = 1 (Remainder: 10 - 8 = 2)',
          '  2 < 4 -> Bit 2 = 0',
          '  2 >= 2 -> Bit 1 = 1 (Remainder: 2 - 2 = 0)',
          '  0 < 1 -> Bit 0 = 0',
          '  Binary result: 11001010.',
          'Step 2 (Hexadecimal): Split 11001010 into two 4-bit nibbles:',
          '  Left nibble: 1100 -> 8 + 4 = 12 -> Hex digit C.',
          '  Right nibble: 1010 -> 8 + 2 = 10 -> Hex digit A.',
          '  Hexadecimal result: 0xCA.',
          'Step 3 (Bandwidth conversion): 1 Byte = 8 bits. Download rate = 80 Mbps / 8 = 10 MB/s.',
        ],
        finalResult:
          'Decimal 202 = Binary 11001010 = Hexadecimal 0xCA. Bandwidth of 80 Mbps = 10 MB/s file transfer speed.',
      },
      step10_realWorldScenario: {
        topology: 'Home Broadband User Downloading a 1 GigaByte (1 GB) File on a 100 Mbps Line',
        scenarioText:
          'A user subscribes to a 100 Mbps (Megabits per second) internet connection and attempts to download a 1 GB (GigaByte) software update. The user is confused why the download takes over 80 seconds rather than 10 seconds. The engineer explains that 100 Mbps is 12.5 MegaBytes per second (100 / 8 = 12.5 MB/s). Downloading 1,000 MB at 12.5 MB/s takes 80 seconds under ideal conditions.',
        engineeringContext:
          'Internet Service Providers always market speeds in bits per second (lowercase b), while operating systems display file sizes and transfer speeds in Bytes (uppercase B).',
      },
      step11_deviceBehavior: {
        hostBehavior:
          'The host CPU and network card process memory registers strictly as 8-bit octets and 32/64-bit words, converting to human-readable decimal or hex strings for user interfaces.',
        nicBehavior:
          'The Network Interface Card (NIC) PHY transceiver encodes binary bits as discrete physical signals (electrical voltage levels on copper cables or light pulses on optical fibers).',
        switchOrRouterBehavior:
          'Network switching chips inspect binary bit patterns in hardware memory buffers using high-speed logic gates to make nano-second forwarding decisions.',
      },
      step12_cliTooling: [
        {
          command: 'powershell -Command "[Convert]::ToString(202, 2).PadLeft(8, \'0\')"',
          description: 'Uses PowerShell CLI to convert decimal 202 to an 8-bit padded binary string.',
          expectedOutput: '11001010',
          proofExplanation: 'Demonstrates operating system binary bit string generation.',
        },
        {
          command: 'powershell -Command "\'{0:X2}\' -f 202"',
          description: 'Formats decimal 202 as a 2-digit uppercase hexadecimal string.',
          expectedOutput: 'CA',
          proofExplanation: 'Proves decimal 202 maps directly to hex CA.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'User complains their 500 Mbps fiber connection only downloads files at ~60 MB/s.',
          possibleCauses: [
            'User is confusing MegaBits per second (Mbps) with MegaBytes per second (MB/s)',
            'Theoretical maximum is 500 / 8 = 62.5 MB/s',
          ],
          diagnosticSteps: [
            'Verify line speed unit in router interface (500 Mbps).',
            'Divide 500 by 8 to determine Byte throughput (62.5 MB/s).',
            'Account for TCP/IP protocol header overhead (roughly 3-5%).',
          ],
          remediation:
            'Educate user that 60 MB/s actual throughput on a 500 Mbps connection is running at near 100% link efficiency.',
        },
      ],
      step14_commonMistakes: [
        {
          misconception: 'Confusing 1 Byte with 1 Bit, or using Mbps and MB/s interchangeably.',
          correction:
            '1 Byte = 8 bits. A lowercase "b" denotes bits (bandwidth); an uppercase "B" denotes Bytes (storage). Always divide Mbps by 8 to find MB/s.',
        },
        {
          misconception: 'Thinking hexadecimal A-F are text characters instead of numerical values.',
          correction:
            'Hexadecimal A through F are pure numeric values representing decimals 10, 11, 12, 13, 14, and 15 in Base-16 positional notation.',
        },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'Data Corruption & Bit Errors on Transmission Media',
        mitigationStrategy:
          'Network protocols use checksums and cyclic redundancy checks (CRC) calculated directly from binary bits to detect when electrical noise flips a 0 to a 1 in transit.',
      },
      step16_examPrep: {
        keyExamPoints: [
          'Know the 8 binary column weights: 128, 64, 32, 16, 8, 4, 2, 1.',
          'Know common decimal byte conversions: 128 (10000000), 192 (11000000), 224 (11100000), 240 (11110000), 248 (11111000), 252 (11111100), 254 (11111110), 255 (11111111).',
          'Know hex symbols: A=10, B=11, C=12, D=13, E=14, F=15.',
          'Know conversion formula: Bandwidth in Mbps / 8 = Throughput in MB/s.',
        ],
        frequentTraps: [
          'Forgetting that 1 hex digit represents exactly 4 binary bits (one nibble).',
          'Multiplying by 8 instead of dividing by 8 when converting Mbps to MB/s.',
        ],
      },
      step17_practicalLabRef: {
        title: 'Guided Practice: Binary & Hexadecimal Conversions and Bandwidth Calculations',
        scenario:
          'Practice converting decimal values to 8-bit binary and hexadecimal, and calculate effective file download times across broadband connections.',
        tasks: [
          'Convert decimal octets 192, 168, and 10 to 8-bit binary.',
          'Convert binary nibbles 1111 and 1010 to hexadecimal.',
          'Calculate the theoretical download time for an 800 MegaByte file on an 80 Mbps connection.',
        ],
        verificationMethod:
          'Verify that 800 MB at 10 MB/s (80 Mbps / 8) yields exactly 80 seconds download duration.',
      },
      step18_masterySummary: {
        summaryPoints: [
          'Binary (Base-2) uses bits (0 and 1) with positional column weights 128, 64, 32, 16, 8, 4, 2, 1.',
          '1 Byte = 8 bits = 2 Hex digits (00 to FF), spanning decimal 0 to 255.',
          'Hexadecimal (Base-16) uses symbols 0-9 and A-F to compress 4-bit nibbles compactly.',
          'Network speed is measured in bits per second (bps); file sizes in Bytes (B); divide Mbps by 8 to obtain MB/s.',
        ],
        nextLessonBridge:
          'Now that you master digital representation, proceed to NET-101 Lesson 2 to explore the physical network interfaces, cabling media, and optical transceivers that carry these binary signals.',
      },
    },
    questions: [
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
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Binary Conversion',
      },
      {
        text: 'What is the decimal equivalent of hexadecimal byte `0xFA`?',
        options: ['250', '240', '255', '248'],
        correctOption: 0,
        explanation: 'In hex: F = 15, A = 10. Value = (15 * 16) + (10 * 1) = 240 + 10 = 250.',
        explanationsJson: {
          1: '240 equals 0xF0 (15 * 16 + 0).',
          2: '255 equals 0xFF (15 * 16 + 15).',
          3: '248 equals 0xF8 (15 * 16 + 8).',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Hexadecimal to Decimal Conversion',
      },
      {
        text: 'How many binary bits are represented by a single hexadecimal character (a nibble)?',
        options: ['4 bits', '8 bits', '2 bits', '16 bits'],
        correctOption: 0,
        explanation: 'Each hexadecimal digit represents a 4-bit nibble ($2^4 = 16$ distinct states: 0 to F). Two hex characters form an 8-bit byte.',
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
        text: 'A user downloads a 200 MegaByte (200 MB) file over a 160 MegaBit per second (160 Mbps) Internet connection. What is the theoretical minimum download time assuming 100% link utilization?',
        options: ['10 seconds', '1.25 seconds', '80 seconds', '25 seconds'],
        correctOption: 0,
        explanation: 'First convert bandwidth from bits to Bytes: 160 Mbps / 8 = 20 MB/s. Then divide file size by throughput: 200 MB / 20 MB/s = 10 seconds.',
        explanationsJson: {
          1: '1.25 seconds occurs if you erroneously divide 200 by 160 without converting bits to Bytes.',
          2: '80 seconds is calculated by incorrectly multiplying by 8.',
          3: '25 seconds is calculated with an incorrect conversion factor.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Bandwidth vs Storage Conversion (Mbps to MB/s)',
      },
      {
        text: 'What hexadecimal string represents the 8-bit binary value `11101111`?',
        options: ['0xEF', '0xFE', '0xEE', '0xDF'],
        correctOption: 0,
        explanation: 'Split into two 4-bit nibbles: Upper nibble 1110 = 8+4+2 = 14 = E. Lower nibble 1111 = 8+4+2+1 = 15 = F. Hex string is 0xEF.',
        explanationsJson: {
          1: '0xFE is binary 11111110.',
          2: '0xEE is binary 11101110.',
          3: '0xDF is binary 11011111.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Binary Nibble to Hex Conversion',
      },
    ],
    lab: {
      title: 'Guided Practice: Binary & Hexadecimal Conversions and Bandwidth Calculations',
      instructions:
        '1. Convert decimal octets into 8-bit binary.\n2. Convert binary bytes into 2-digit hexadecimal.\n3. Calculate Byte throughput from link bandwidth in Mbps.',
      difficulty: CourseLevel.FOUNDATIONAL,
      estimatedMinutes: 15,
      initialTopologyJson: { hostName: 'Workstation', ip: '192.168.1.10', lineSpeed: '100 Mbps' },
      tasks: [
        'Convert decimal 192 and 202 to binary.',
        'Convert binary 11001010 to hexadecimal.',
        'Calculate effective download throughput in MB/s for 100 Mbps.',
      ],
    },
  },

  // =========================================================================
  // REWRITTEN LESSON 2: NET-101 / network-devices-overview
  // Topic: Physical Network Interfaces, Media & Transceivers
  // Replaced: Duplicate device overviews (routers, switches, PCs).
  // Focus: RJ-45, copper vs fiber, single-mode vs multi-mode, SFP/SFP+, PoE.
  // =========================================================================
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
        'Understand the physical transmission media connecting networks: copper twisted pair, optical fiber types, modular optical transceivers, and Power over Ethernet standards.',
      step2_prerequisites: ['net-101-bits-bytes-binary-hex', 'Basic concept of electrical voltages and light signals'],
      step3_whyItMatters:
        'Selecting the wrong cable or transceiver causes physical link down events, signal attenuation, electromagnetic interference (EMI), or underpowered wireless access points. Physical infrastructure is the foundation upon which all higher-layer networking relies.',
      step4_coreConcept:
        'Physical Layer 1 media transports binary signals across distance. Copper twisted pair uses electrical voltage pulses across 8 copper wires inside an RJ-45 connector (limited to 100 meters). Optical fiber uses pulses of light inside glass cores, providing extreme bandwidth over kilometers with complete immunity to electromagnetic interference. Modular transceivers (SFP/SFP+) allow switch ports to adapt dynamically to copper or fiber connections, while Power over Ethernet (PoE) delivers DC electricity to endpoints over standard Ethernet cables.',
      step5_technicalAnatomy: {
        title: 'Cabling Categories, Fiber Types & Modular Transceiver Specifications',
        description:
          'Comparison of copper Ethernet standards, optical fiber light propagation, and hot-swappable transceiver form factors.',
        components: [
          {
            name: 'Twisted Pair Copper (Cat5e / Cat6 / Cat6a)',
            detail: '8 copper conductors in 4 twisted pairs with RJ-45 8P8C connectors. Cat5e supports 1 Gbps to 100m. Cat6 supports 10 Gbps up to 55m. Cat6a supports 10 Gbps to full 100m. Available as UTP (Unshielded) or STP (Shielded for high-EMI industrial environments).',
          },
          {
            name: 'Single-Mode Fiber (SMF)',
            detail: 'Very narrow glass core (~9 µm) carrying a single straight laser light beam. Minimal modal dispersion enables long-distance campus and telco spans up to 10–40+ km using 1310nm/1550nm lasers. Yellow jacket standard.',
          },
          {
            name: 'Multi-Mode Fiber (MMF)',
            detail: 'Wider glass core (50 µm or 62.5 µm) carrying multiple light rays from low-cost LEDs or VCSELs at 850nm. Subject to modal dispersion; limited to ~300–550m. Used for intra-datacenter and building backbone links. Aqua/Orange jacket standard.',
          },
          {
            name: 'Modular Transceivers (SFP / SFP+ / QSFP)',
            detail: 'Hot-pluggable modules inserted into switch cage slots: SFP (Small Form-factor Pluggable - 1 Gbps), SFP+ (10 Gbps), QSFP+ (40 Gbps), QSFP28 (100 Gbps). Connects to LC/SC optical fiber patch cables.',
          },
          {
            name: 'Power over Ethernet (PoE Standards)',
            detail: 'Delivers DC electrical power over twisted pair copper: 802.3af (PoE: 15.4W / 12.95W at device), 802.3at (PoE+: 30W / 25.5W at device), 802.3bt (PoE++ / 4PPoE: 60W to 90W for Wi-Fi 6/7 APs and PTZ cameras).',
          },
        ],
      },
      step6_howItWorks: {
        steps: [
          {
            stepNumber: 1,
            title: 'Media Selection Evaluation',
            action:
              'Evaluate the link requirements: Distance (<100m vs >100m), Bandwidth (1G vs 10G+), Environment (High EMI factory vs standard office), and Power needs (PoE required for AP/camera).',
          },
          {
            stepNumber: 2,
            title: 'Copper Transceiver & RJ-45 Pinout Termination',
            action:
              'Terminate Cat6 cable using T568B standard onto RJ-45 modular plug, or insert 1000BASE-T SFP copper transceiver into switch uplink port.',
          },
          {
            stepNumber: 3,
            title: 'Optical Transceiver Insertion & Fiber Patching',
            action:
              'Insert 10GBASE-SR (Multi-Mode) or 10GBASE-LR (Single-Mode) SFP+ module into switch port; connect duplex LC fiber patch cord with Transmit (Tx) crossed to Receive (Rx).',
          },
          {
            stepNumber: 4,
            title: 'PoE Negotiation & Power Delivery',
            action:
              'Switch port detects valid signature resistance on connected PD (Powered Device), classifies power tier (Class 0–8), and injects DC voltage safely over spare/data pairs.',
          },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'Physical Layer Media & PoE Power Specifications',
        fields: [
          {
            fieldName: 'Copper Category Limit',
            bitLength: '100 Meters Max',
            hexSample: 'Cat6 / Cat6a (RJ-45)',
            description: 'Maximum standard Ethernet channel length (90m solid horizontal + 10m stranded patch).',
          },
          {
            fieldName: 'Optical Wavelength',
            bitLength: '850nm (MMF) vs 1310/1550nm (SMF)',
            hexSample: 'Laser / VCSEL',
            description: 'Light wavelength used for optical photon transmission across glass core.',
          },
          {
            fieldName: 'PoE Standard (802.3at)',
            bitLength: '30.0 Watts Max Output',
            hexSample: '50-57V DC',
            description: 'PoE+ supplying up to 25.5W usable power to powered access points and cameras.',
          },
        ],
        headerDiagramAscii: `
+-------------------------------------------------------------------------------+
|                       ETHERNET PHYSICAL MEDIA SELECTION                       |
+-------------------+-------------------+-------------------+-------------------+
| Media Standard    | Core / Wire Type  | Max Distance      | Typical Use Case  |
+-------------------+-------------------+-------------------+-------------------+
| 1000BASE-T        | Cat5e/6 Copper    | 100 Meters        | Workstation / Desk|
| 10GBASE-T         | Cat6a Copper      | 100 Meters        | Server Farm / LAN |
| 10GBASE-SR (MMF)  | 50µm Multi-Mode   | 300 - 400 Meters  | Data Center Rack  |
| 10GBASE-LR (SMF)  | 9µm Single-Mode   | 10 Kilometers     | Campus / Inter-Bldg|
| 100GBASE-LR4(SMF) | 9µm Single-Mode   | 10 Kilometers     | Core Backbone     |
+-------------------+-------------------+-------------------+-------------------+
`,
      },
      step8_visualExplanation: {
        type: 'MEDIA_INSPECTOR',
        title: 'Physical Media & Transceiver Selection Guide',
        description:
          'Interactive comparison of copper RJ-45 vs fiber optical patch cables, modal dispersion differences between SMF and MMF cores, SFP+ transceiver cages, and PoE power budgeting.',
      },
      step9_workedExample: {
        title: 'Designing Campus Uplink Cabling & PoE Budget for 24 Wi-Fi 6 Access Points',
        problemStatement:
          'An engineer must connect two campus buildings 450 meters apart with a 10 Gbps uplink, and power 24 Wi-Fi 6 Access Points (requiring 22W each) from a single 24-port switch.\n1. Which cable type and transceiver should be selected for the building-to-building link?\n2. What PoE standard and total switch power budget are required?',
        stepByStepSolution: [
          'Step 1 (Uplink Distance Evaluation): The distance is 450 meters. Copper (100m max) is impossible. Multi-Mode Fiber (OM3/OM4 10GBASE-SR) is limited to 300–400m. Single-Mode Fiber (10GBASE-LR SMF, rated for up to 10 km) must be used.',
          'Step 2 (Uplink Transceiver): Select 10GBASE-LR SFP+ optical transceivers with duplex LC Single-Mode Fiber (yellow jacket).',
          'Step 3 (PoE Standard): Each AP requires 22W. IEEE 802.3af (15.4W) is insufficient. IEEE 802.3at (PoE+, supplying up to 30W per port) is required.',
          'Step 4 (Switch Power Budget): 24 APs * 25.5W reserved power = 612 Watts total PoE power supply budget.',
        ],
        finalResult:
          'Building Link: Single-Mode Fiber (SMF) with 10GBASE-LR SFP+ transceivers. PoE: IEEE 802.3at (PoE+) with >= 620W switch power budget.',
      },
      step10_realWorldScenario: {
        topology: 'Industrial Manufacturing Plant with High Electromagnetic Interference (EMI)',
        scenarioText:
          'An engineer installs standard unshielded copper (UTP) patch cables near heavy industrial electric motors. The workstations experience severe packet loss and CRC frame errors due to electromagnetic noise inducted onto the copper wires. The engineer replaces the unshielded run with optical fiber patch cords, completely resolving the packet loss because optical glass carries light photons that are 100% immune to electromagnetic fields.',
        engineeringContext:
          'Fiber optic media is non-conductive, preventing ground loops between separate building power grids and eliminating EMI hazards in industrial settings.',
      },
      step11_deviceBehavior: {
        hostBehavior:
          'Host endpoints negotiate link speed and duplex (e.g. 1000 Mbps Full Duplex) via physical autonegotiation electrical fast pulses upon cable insertion.',
        nicBehavior:
          'The NIC PHY layer converts parallel digital byte registers into serialized high-frequency electrical or optical signals conforming to IEEE 802.3 PHY standards.',
        switchOrRouterBehavior:
          'Switch transceiver interfaces continuously monitor optical receive power levels (Optical Power Monitoring / DDM in dBm) and PoE wattage consumption per port.',
      },
      step12_cliTooling: [
        {
          command: 'show interface status',
          description: 'Displays link speed, duplex mode, media type, and transceiver presence on switch ports.',
          expectedOutput:
            'Port      Name               Status       Vlan       Duplex  Speed Type\nGi1/0/1   Uplink-Bldg-B      connected    trunk      full    10G   10Gbase-LR\nGi1/0/2   AP-Floor-1         connected    10         full    1000  1000BaseTX',
          proofExplanation:
            'Shows port Gi1/0/1 operating at 10 Gbps over Single-Mode fiber (10Gbase-LR) and Gi1/0/2 over copper (1000BaseTX).',
        },
        {
          command: 'show power inline',
          description: 'Displays active PoE power consumption and operational classification per switch port.',
          expectedOutput:
            'Available: 740.0(w)  Used: 264.0(w)  Remaining: 476.0(w)\nInterface Admin  Oper       Power(Watts) Device              Class\nGi1/0/2   auto   on         22.4         AIR-AP3802I-B-K9    4',
          proofExplanation:
            'Confirms port Gi1/0/2 is delivering 22.4 Watts of PoE+ power (Class 4) to an enterprise wireless access point.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'Switch optical transceiver link LED is dark; interface reports "notconnected" or link down.',
          possibleCauses: [
            'Transmit (Tx) and Receive (Rx) fiber strands are reversed on the patch cord',
            'Transceiver wavelength mismatch (e.g. 850nm MMF plugged into 1310nm SMF)',
            'Dirty optical fiber endface connector with dust accumulation',
          ],
          diagnosticSteps: [
            'Inspect transceiver light with optical power meter or swap Tx/Rx fiber strands (A-to-B crossover).',
            'Verify both ends use matching transceiver optics (e.g., both 10GBASE-SR).',
            'Clean fiber ferrule using an optical fiber click-cleaner pen.',
          ],
          remediation: 'Swap Tx and Rx fiber positions on one end of the LC duplex patch connector.',
        },
      ],
      step14_commonMistakes: [
        {
          misconception: 'Running copper twisted pair cables beyond 100 meters without a repeater or switch.',
          correction:
            'Standard Ethernet over copper has a strict 100-meter physical channel limit (90m horizontal solid cable + 10m patch cables). Beyond 100m, signal attenuation causes total link drop.',
        },
        {
          misconception: 'Plugging Multi-Mode Fiber (MMF) into a Single-Mode Fiber (SMF) transceiver.',
          correction:
            'SMF uses 9µm core with 1310/1550nm laser light; MMF uses 50µm core with 850nm LED/VCSEL light. Mismatched core diameters cause massive optical loss and link failure.',
        },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'Physical Cable Tapping & Rogue Hardware Attachment',
        mitigationStrategy:
          'Copper cables emit electromagnetic radiation that can be intercepted with inductive taps; optical fiber requires physical splicing (which causes immediate optical loss detection). Secure telecommunications rooms and enable switchport port security.',
      },
      step16_examPrep: {
        keyExamPoints: [
          'Know copper distance limit: 100 meters for Cat5e/Cat6/Cat6a.',
          'Single-Mode Fiber: ~9µm yellow core, laser light, long distance (up to 10-40km).',
          'Multi-Mode Fiber: 50/62.5µm orange/aqua core, LED/VCSEL light, short distance (up to 300-550m).',
          'PoE Standards: 802.3af (15.4W), 802.3at (PoE+ 30W), 802.3bt (PoE++ up to 90W).',
          'Transceivers: SFP = 1 Gbps, SFP+ = 10 Gbps, QSFP+ = 40 Gbps, QSFP28 = 100 Gbps.',
        ],
        frequentTraps: [
          'Selecting Cat6 for a 120-meter run (all copper standards max out at 100m).',
          'Assuming PoE delivers 30W to the device under 802.3at (30W is source switch output; 25.5W is delivered at device due to cable resistance loss).',
        ],
      },
      step17_practicalLabRef: {
        title: 'Guided Practice: Enterprise Physical Media & PoE Power Budget Calculation',
        scenario:
          'Design physical layer connectivity for an enterprise branch: select optical fiber transceivers for campus links, verify cable distances, and audit PoE power budgets.',
        tasks: [
          'Select the correct fiber type (SMF vs MMF) for a 600-meter campus backbone link.',
          'Identify SFP vs SFP+ transceiver models for Gigabit vs 10-Gigabit ports.',
          'Calculate total PoE power requirements for 12 PoE+ security cameras on a switch.',
        ],
        verificationMethod:
          'Execute `show power inline` and `show interface status` verification commands in the simulated environment.',
      },
      step18_masterySummary: {
        summaryPoints: [
          'Twisted pair copper (Cat5e/Cat6/Cat6a) with RJ-45 connectors is standard for desktop runs up to 100 meters.',
          'Optical fiber carries light through glass cores with zero EMI; Single-Mode (SMF) for long-haul (kilometers) and Multi-Mode (MMF) for datacenter/campus (hundreds of meters).',
          'Modular SFP (1G) and SFP+ (10G) transceivers provide flexible media adaptation on switch ports.',
          'PoE (802.3af/at/bt) supplies DC electrical power to endpoints over standard Ethernet copper cabling.',
        ],
        nextLessonBridge:
          'With physical media and hardware interfaces mastered in NET-101, proceed to NET-102 to learn how network boundaries, performance metrics, and topologies are structured.',
      },
    },
    questions: [
      {
        text: 'A network engineer needs to connect two switches located in separate campus buildings 800 meters apart with a 10 Gbps uplink. Which cabling and transceiver standard should be selected?',
        options: [
          'Single-Mode Fiber (SMF) with 10GBASE-LR SFP+ transceivers',
          'Cat6a Copper UTP with RJ-45 connectors',
          'Multi-Mode Fiber (MMF) with 10GBASE-SR SFP+ transceivers',
          'Cat5e Shielded STP cable with PoE injectors',
        ],
        correctOption: 0,
        explanation: 'The 800-meter distance exceeds the 100m limit for copper and the 300-400m limit for Multi-Mode Fiber (10GBASE-SR). Single-Mode Fiber (10GBASE-LR) is rated for up to 10 kilometers and is the correct choice.',
        explanationsJson: {
          1: 'Cat6a copper is strictly limited to a maximum channel distance of 100 meters.',
          2: 'Multi-Mode Fiber (10GBASE-SR) is limited to approximately 300-400 meters.',
          3: 'Cat5e is limited to 100 meters and cannot carry 10 Gbps over 800m.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Media Selection: Distance and Bandwidth',
      },
      {
        text: 'What fundamental physical characteristic distinguishes Single-Mode Fiber (SMF) from Multi-Mode Fiber (MMF)?',
        options: [
          'SMF has a narrow ~9 µm core carrying a single straight laser ray, whereas MMF has a wider 50/62.5 µm core carrying multiple light rays subject to modal dispersion',
          'SMF carries electrical current while MMF carries optical light',
          'SMF uses RJ-45 connectors while MMF uses USB-C connectors',
          'SMF is limited to 100 meters while MMF reaches 50 kilometers',
        ],
        correctOption: 0,
        explanation: 'Single-Mode Fiber features a tiny 9-micron core that permits only one mode of light to propagate, virtually eliminating modal dispersion. Multi-Mode has a 50-62.5 micron core where light bounces at multiple angles.',
        explanationsJson: {
          1: 'All optical fiber carries photons (light), never electrical voltage.',
          2: 'Fiber uses LC, SC, or ST optical connectors, not RJ-45 or USB.',
          3: 'SMF achieves much greater distances (tens of km) than MMF (hundreds of meters).',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Single-Mode vs Multi-Mode Core Architecture',
      },
      {
        text: 'An administrator connects a new Wi-Fi 6 Access Point requiring 24 Watts of DC power to an enterprise switch. Which Power over Ethernet standard must the switch support on that port?',
        options: [
          'IEEE 802.3at (PoE+ - up to 30W output / 25.5W delivered)',
          'IEEE 802.3af (PoE - up to 15.4W output)',
          'IEEE 802.1Q (VLAN tagging)',
          'IEEE 802.3ad (Link Aggregation)',
        ],
        correctOption: 0,
        explanation: 'IEEE 802.3at (PoE+) supplies up to 30W of power from the switch port (delivering up to 25.5W at the device), which satisfies the 24W requirement. Legacy 802.3af only supplies 15.4W.',
        explanationsJson: {
          1: '802.3af only supplies 15.4W, which is insufficient for a 24W access point.',
          2: '802.1Q is a Layer 2 VLAN encapsulation protocol, not a power standard.',
          3: '802.3ad is Link Aggregation (LACP), not a power standard.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Power over Ethernet Standards (802.3af/at/bt)',
      },
      {
        text: 'Why are fiber optic cables completely immune to Electromagnetic Interference (EMI) and Radio Frequency Interference (RFI)?',
        options: [
          'Fiber optic cables transmit information using non-conductive light photons through glass cores rather than electrical voltages over copper',
          'Fiber optic cables are coated with thick lead shielding that absorbs all radio waves',
          'Fiber optic cables operate at zero volts electrical ground',
          'Fiber optic transceivers automatically filter out high-voltage magnetic fields using software',
        ],
        correctOption: 0,
        explanation: 'Optical fiber carries data as pulses of light through dielectric glass fibers. Because light photons do not interact with electromagnetic fields, fiber is 100% immune to electromagnetic noise, motors, and lightning.',
        explanationsJson: {
          1: 'Standard fiber jackets are plastic, not lead; immunity is due to light transmission.',
          2: 'Fiber does not conduct electricity; voltage grounding is irrelevant.',
          3: 'Immunity is an inherent physical property of light in glass, not software filtering.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Fiber Optic Immunity to EMI',
      },
    ],
    lab: {
      title: 'Guided Practice: Enterprise Physical Media & PoE Power Budget Calculation',
      instructions:
        '1. Inspect switch port media configuration using `show interface status`.\n2. Evaluate distance and transceiver types for campus uplinks.\n3. Audit per-port PoE power allocation using `show power inline`.',
      difficulty: CourseLevel.FOUNDATIONAL,
      estimatedMinutes: 15,
      initialTopologyJson: {
        switchName: 'Core-SW1',
        ports: [
          { port: 'Gi1/0/1', type: '10Gbase-LR', status: 'connected' },
          { port: 'Gi1/0/2', type: '1000BaseTX', status: 'connected', poeWatts: 22.4 },
        ],
      },
      tasks: [
        'Run `show interface status` to verify SFP+ transceiver types.',
        'Run `show power inline` to verify PoE wattage delivery.',
      ],
    },
  },

  // =========================================================================
  // REWRITTEN LESSON 3: NET-102 / what-is-computer-networking
  // Topic: Network Performance Metrics (Bandwidth, Throughput, Latency, Jitter)
  // Replaced: Duplicate generic networking intro.
  // Focus: Bandwidth, throughput, goodput, latency (serialization, propagation,
  // queueing, processing), jitter, packet loss, bps vs B/s.
  // =========================================================================
  {
    courseCode: 'NET-102',
    slug: 'what-is-computer-networking',
    title: 'Network Performance Metrics: Bandwidth, Throughput, Latency & Jitter',
    type: LessonType.THEORY,
    durationMinutes: 25,
    order: 4,
    visualizationType: 'PERFORMANCE_METRICS_ENGINE',
    introduction:
      'Master the core telemetry metrics that define network quality and speed: Bandwidth vs Throughput vs Goodput, the 4 components of Latency (Serialization, Propagation, Queueing, Processing), Jitter variation in real-time traffic, and Packet Loss dynamics.',
    stepMetadata: {
      step1_objective:
        'Understand how network performance is measured and diagnosed: distinguishing theoretical bandwidth from actual throughput, calculating the four mathematical delay components of latency, and analyzing how jitter and packet loss impact applications.',
      step2_prerequisites: ['net-101-bits-bytes-binary-hex', 'Basic division and unit conversions (bits to Bytes)'],
      step3_whyItMatters:
        'A network can possess high bandwidth (e.g. 1 Gbps) but suffer from terrible user experience if latency is high, jitter is unstable, or packet loss forces TCP retransmissions. Troubleshooting slow networks requires precise metric diagnosis rather than simply buying more bandwidth.',
      step4_coreConcept:
        'Network performance is defined by four core dimensions: Bandwidth is the theoretical maximum data carrying capacity of a link (e.g. 1 Gbps). Throughput is the actual rate of successful data delivery over time (e.g. 850 Mbps). Latency is the time taken for a packet to travel from source to destination, composed of four distinct delays: Serialization delay (pushing bits onto the wire), Propagation delay (light/electricity traveling physical distance), Queueing delay (waiting in router memory buffers), and Processing delay (router CPU lookup). Jitter is the statistical variance in packet arrival latency (critical for VoIP/gaming). Packet Loss occurs when interface buffer queues overflow, causing frame drops.',
      step5_technicalAnatomy: {
        title: 'Network Telemetry Metrics & Latency Component Architecture',
        description:
          'Detailed mathematical breakdown of bandwidth, goodput, round-trip time, and the four delay equations.',
        components: [
          {
            name: 'Bandwidth (Capacity)',
            detail: 'The theoretical maximum rate at which bits can be transmitted across a physical channel (e.g. 1000 Mbps on a GigabitEthernet link).',
          },
          {
            name: 'Throughput vs Goodput',
            detail: 'Throughput is actual transmitted payload and protocol headers over time. Goodput is the effective application data delivered, excluding all TCP/IP header overhead and duplicate retransmitted packets.',
          },
          {
            name: 'Serialization / Transmission Delay ($D_{trans}$)',
            detail: 'Time required to inject all bits of a packet onto the physical medium: $D_{trans} = \\text{Packet Size (bits)} / \\text{Link Bandwidth (bps)}$.',
          },
          {
            name: 'Propagation Delay ($D_{prop}$)',
            detail: 'Time for the electromagnetic signal to traverse the physical distance of the medium: $D_{prop} = \\text{Distance (meters)} / \\text{Signal Velocity (approx } 2 \\times 10^8 \\text{ m/s in copper/glass)}$.',
          },
          {
            name: 'Queueing & Processing Delay',
            detail: 'Queueing delay is time spent waiting in switch/router buffer queues during congestion. Processing delay is time taken by the CPU/ASIC to examine packet headers and evaluate routing tables.',
          },
          {
            name: 'Jitter (Latency Variance)',
            detail: 'The variation in packet arrival delay over time. High jitter causes choppy VoIP audio and video stutter, requiring de-jitter playback buffers.',
          },
        ],
      },
      step6_howItWorks: {
        steps: [
          {
            stepNumber: 1,
            title: 'Bandwidth & Serialization Timing',
            action:
              'A 1500-Byte packet (12,000 bits) on a 1 Gbps link requires $12,000 / 10^9 = 12 \\text{ microseconds}$ of serialization time.',
          },
          {
            stepNumber: 2,
            title: 'Signal Propagation',
            action:
              'The light signal travels through fiber optic cable across 2,000 km in approximately $2,000,000 / (2 \\times 10^8) = 10 \\text{ milliseconds}$.',
          },
          {
            stepNumber: 3,
            title: 'Buffer Queueing & Congestion',
            action:
              'When incoming traffic exceeds egress link capacity, packets accumulate in router interface buffers. If buffers fill completely, tail drop causes immediate packet loss.',
          },
          {
            stepNumber: 4,
            title: 'Jitter Measurement & Playback Buffering',
            action:
              'If Packet 1 arrives in 20ms and Packet 2 arrives in 65ms, jitter is 45ms. The receiver uses a jitter buffer to delay playback and smooth out voice streams.',
          },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'Performance Metrics & End-to-End Latency Formula',
        fields: [
          {
            fieldName: 'Total One-Way Latency',
            bitLength: 'D_total',
            hexSample: 'D_trans + D_prop + D_queue + D_proc',
            description: 'Sum of serialization, propagation, buffer queueing, and hardware processing delays.',
          },
          {
            fieldName: 'Round-Trip Time (RTT)',
            bitLength: 'Milliseconds (ms)',
            hexSample: '2 * D_total',
            description: 'Time from initial packet transmission to receipt of acknowledgment.',
          },
          {
            fieldName: 'VoIP Jitter Threshold',
            bitLength: '< 30 ms target',
            hexSample: 'Jitter Buffer',
            description: 'Industry standard SLA for carrier-grade voice quality (ITU G.114).',
          },
        ],
        headerDiagramAscii: `
+-------------------------------------------------------------------------------+
|                    TOTAL END-TO-END LATENCY ARCHITECTURE                      |
+-------------------------------------------------------------------------------+
|  [Source Host]                                                 [Destination]  |
|       |                                                              |        |
|       +--> [D_trans: Serialization] = Packet Size (bits) / Bandwidth (bps)   |
|       |                                                              |        |
|       +--> [D_prop: Propagation]    = Distance / Speed of Light in Cable     |
|       |                                                              |        |
|       +--> [D_proc: Processing]     = Router Header Inspection & Routing Table|
|       |                                                              |        |
|       +--> [D_queue: Queueing]      = Buffer Wait Time (Variable -> JITTER)   |
+-------------------------------------------------------------------------------+
| Total Latency = D_trans + D_prop + D_proc + D_queue                           |
+-------------------------------------------------------------------------------+
`,
      },
      step8_visualExplanation: {
        type: 'PERFORMANCE_METRICS_ENGINE',
        title: 'Interactive Network Telemetry & Delay Simulation Engine',
        description:
          'Simulate data packet travel across varying link speeds and physical distances to visualize serialization vs propagation delay, buffer queue accumulation, and jitter variance.',
      },
      step9_workedExample: {
        title: 'Calculating Serialization Delay, Propagation Delay & Throughput vs Bandwidth',
        problemStatement:
          'A 1,500-Byte packet is sent across a 10 Mbps WAN link spanning a distance of 1,000 km in fiber optic cable ($v = 200,000 \\text{ km/s}$). Calculate:\n1. Serialization Delay ($D_{trans}$)\n2. Propagation Delay ($D_{prop}$)\n3. Total transmission delay before router queueing.',
        stepByStepSolution: [
          'Step 1 (Serialization Delay): Convert 1,500 Bytes to bits: $1,500 \\times 8 = 12,000 \\text{ bits}$.',
          '  $D_{trans} = 12,000 \\text{ bits} / 10,000,000 \\text{ bps} = 0.0012 \\text{ seconds} = 1.20 \\text{ milliseconds (ms)}$.',
          'Step 2 (Propagation Delay): Calculate light travel time across 1,000 km:',
          '  $D_{prop} = 1,000 \\text{ km} / 200,000 \\text{ km/s} = 0.0050 \\text{ seconds} = 5.00 \\text{ milliseconds (ms)}$.',
          'Step 3 (Total Delay): $D_{trans} + D_{prop} = 1.20 \\text{ ms} + 5.00 \\text{ ms} = 6.20 \\text{ ms}$.',
        ],
        finalResult:
          'Serialization Delay: 1.20 ms | Propagation Delay: 5.00 ms | Base Link Latency: 6.20 ms.',
      },
      step10_realWorldScenario: {
        topology: 'Financial Trading Firm vs Remote VoIP Call Quality Outage',
        scenarioText:
          'A company upgrades its branch office connection from 50 Mbps to 500 Mbps, but users still report robotic, stuttering VoIP audio. The network engineer analyzes traffic and discovers that while bandwidth increased tenfold, latency fluctuates wildly between 15ms and 240ms (Jitter = 225ms) due to bursty bulk file backups overwhelming the router egress buffer queue. The engineer implements Quality of Service (QoS) priority queueing for voice traffic, stabilizing jitter below 10ms and resolving the voice distortion without purchasing additional bandwidth.',
        engineeringContext:
          'Bandwidth solves throughput capacity; Quality of Service (QoS) and latency management solve real-time interactive application responsiveness.',
      },
      step11_deviceBehavior: {
        hostBehavior:
          'Operating systems track round-trip time (RTT) and variance to dynamically scale the TCP Receive Window and estimate packet retransmission timeouts (RTO).',
        nicBehavior:
          'NIC hardware buffers store ingress and egress packet descriptors in ring buffers; if the host CPU cannot empty the ring buffer fast enough, receiver overrun packet drops occur.',
        switchOrRouterBehavior:
          'Network switches maintain per-port hardware queues (FIFO, Priority, WFQ); when buffer memory saturates, incoming packets are dropped (Tail Drop or WRED).',
      },
      step12_cliTooling: [
        {
          command: 'ping -n 10 8.8.8.8',
          description: 'Measures minimum, maximum, and average round-trip latency (RTT) and packet loss percentage.',
          expectedOutput:
            'Reply from 8.8.8.8: bytes=32 time=14ms TTL=117\nReply from 8.8.8.8: bytes=32 time=15ms TTL=117\n--- 8.8.8.8 ping statistics ---\n10 packets transmitted, 10 received, 0% packet loss\nrtt min/avg/max = 14.1/15.2/18.4 ms',
          proofExplanation:
            'Shows stable 15ms average latency with low jitter (max 18.4ms vs min 14.1ms) and 0% packet loss.',
        },
        {
          command: 'pathping 8.8.8.8',
          description: 'Combines ping and traceroute over 250 seconds to identify exact hop-by-hop packet loss and latency spikes.',
          expectedOutput:
            'Hop  RTT    Lost/Sent = Pct  Address\n  0            0/ 100 =  0%  192.168.1.50\n  1    1ms     0/ 100 =  0%  192.168.1.1\n  2   14ms     0/ 100 =  0%  10.0.0.1',
          proofExplanation:
            'Proves zero packet loss at gateway and ISP hop.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'Video conferencing calls freeze periodically with dropped frames and audio drops.',
          possibleCauses: [
            'Packet loss exceeding 2% on intermediate router uplink',
            'High jitter causing receiver jitter buffer underruns',
            'Buffer queue saturation during large simultaneous file uploads',
          ],
          diagnosticSteps: [
            'Run continuous ping with large packet size (`ping -t -l 1400`) to test for buffer drops.',
            'Check router interface counters for output drops (`show interface | include drops`).',
            'Measure jitter statistics in real-time call diagnostic tools.',
          ],
          remediation:
            'Apply Quality of Service (QoS) priority queueing for real-time UDP media traffic and rate-limit bulk backups.',
        },
      ],
      step14_commonMistakes: [
        {
          misconception: 'Assuming high bandwidth (e.g. 1 Gbps) automatically guarantees low latency.',
          correction:
            'Bandwidth is the width of the pipe (how many bits per second); Latency is the time it takes a bit to travel from A to B. A satellite link can have 100 Mbps bandwidth but 600ms latency due to physical distance.',
        },
        {
          misconception: 'Confusing Throughput with Goodput.',
          correction:
            'Throughput includes all packet headers and retransmitted duplicate packets. Goodput measures strictly the useful application data delivered successfully.',
        },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'Bufferbloat Denial of Service & Queue Exhaustion Attacks',
        mitigationStrategy:
          'Deploy Active Queue Management (AQM, e.g. CoDel / FQ-CoDel) to prevent excessive buffering and maintain low latency even under heavy network load.',
      },
      step16_examPrep: {
        keyExamPoints: [
          'Know the 4 Latency components: Serialization, Propagation, Queueing, Processing.',
          'Serialization formula: $D_{trans} = \\text{Packet Size (bits)} / \\text{Bandwidth (bps)}$.',
          'Propagation formula: $D_{prop} = \\text{Distance} / \\text{Speed of Light}$.',
          'Jitter is the variance in packet arrival latency.',
          'Goodput is usable application payload excluding headers and retransmissions.',
        ],
        frequentTraps: [
          'Forgetting to convert Bytes to bits (multiplying by 8) when calculating serialization delay.',
          'Blaming high latency on low bandwidth when the issue is physical distance or buffer queueing.',
        ],
      },
      step17_practicalLabRef: {
        title: 'Guided Practice: Network Performance Diagnostics & Latency Analysis',
        scenario:
          'Analyze network performance telemetry across enterprise WAN links: calculate serialization and propagation delays, and diagnose packet loss and jitter anomalies.',
        tasks: [
          'Calculate serialization time for 1500-byte packets across 10 Mbps vs 1 Gbps links.',
          'Execute ping and pathping diagnostics to evaluate latency jitter and packet drop rates.',
          'Identify whether an application slowdown is caused by bandwidth exhaustion or buffer queueing latency.',
        ],
        verificationMethod:
          'Verify that calculated latency values match terminal output metrics within the simulation.',
      },
      step18_masterySummary: {
        summaryPoints: [
          'Bandwidth is maximum channel capacity; Throughput is actual delivery rate; Goodput is usable application payload.',
          'Latency consists of Serialization ($L/R$), Propagation ($d/s$), Processing ($D_{proc}$), and Queueing ($D_{queue}$).',
          'Jitter is latency variance; high jitter severely impairs real-time VoIP and video streaming.',
          'Packet loss occurs when buffer queues overflow, forcing TCP retransmissions and application degradation.',
        ],
        nextLessonBridge:
          'Now that you understand network performance telemetry, proceed to NET-102 Lesson 5 to explore how physical and logical topologies (Star, Mesh, Ring) influence reliability and redundancy.',
      },
    },
    questions: [
      {
        text: 'What is the key technical difference between Throughput and Goodput in network performance analysis?',
        options: [
          'Throughput measures total bits delivered including protocol headers and retransmissions, whereas Goodput measures only the usable application data delivered',
          'Throughput applies only to wireless networks while Goodput applies only to optical fiber',
          'Throughput is measured in bits per second while Goodput is measured in CPU cycles',
          'There is no difference; both terms are 100% interchangeable',
        ],
        correctOption: 0,
        explanation: 'Throughput represents all raw bits passing over the wire (including Ethernet, IP, and TCP headers plus retransmitted packets). Goodput measures strictly the actual usable payload delivered to the destination application.',
        explanationsJson: {
          1: 'Both metrics apply universally to all physical and logical networks.',
          2: 'Both Throughput and Goodput are measured in bits per second (bps) or Bytes per second (B/s).',
          3: 'Goodput is a distinct metric that subtracts protocol overhead and duplicate retransmissions.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Throughput vs Goodput Definition',
      },
      {
        text: 'Calculate the Serialization (Transmission) Delay for a 1,500-Byte Ethernet packet being pushed onto a 100 Mbps FastEthernet interface:',
        options: [
          '0.12 milliseconds (120 microseconds)',
          '1.20 milliseconds',
          '15.0 milliseconds',
          '0.015 milliseconds',
        ],
        correctOption: 0,
        explanation: 'Convert 1,500 Bytes to bits: $1,500 \\times 8 = 12,000 \\text{ bits}$. Divide by bandwidth in bps: $12,000 / 100,000,000 \\text{ bps} = 0.00012 \\text{ seconds} = 0.12 \\text{ ms}$ (120 microseconds).',
        explanationsJson: {
          1: '1.20 ms is the serialization delay on a 10 Mbps link, not 100 Mbps.',
          2: '15.0 ms occurs if you divide 1,500 by 100 without converting Bytes to bits and units properly.',
          3: '0.015 ms is calculated with an incorrect power of 10.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Serialization Delay Calculation',
      },
      {
        text: 'Why does high Jitter (latency variance) cause severe distortion in real-time VoIP voice calls even when total average bandwidth is more than sufficient?',
        options: [
          'Voice packets arrive at unpredictable intervals, causing receiver de-jitter playback buffers to either underflow (dropped words) or overflow',
          'Jitter permanently corrupts the IP address in packet headers',
          'Jitter causes copper cables to overheat and drop electrical signals',
          'Jitter forces routers to reboot into diagnostic recovery mode',
        ],
        correctOption: 0,
        explanation: 'Real-time VoIP relies on constant, rhythmic playback. When packets arrive with wildly varying latency (high jitter), the receiver buffer runs out of packets to play (buffer underrun), resulting in choppy audio and dropped syllables.',
        explanationsJson: {
          1: 'Jitter affects arrival timing, not header address integrity.',
          2: 'Jitter is a timing metric and has zero thermal impact on physical cables.',
          3: 'Routers do not reboot due to packet jitter.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Jitter Impact on Real-Time Voice/Video',
      },
      {
        text: 'Which of the four latency delay components is directly determined by the physical length of the cable divided by the speed of light in the medium?',
        options: [
          'Propagation Delay ($D_{prop}$)',
          'Serialization Delay ($D_{trans}$)',
          'Queueing Delay ($D_{queue}$)',
          'Processing Delay ($D_{proc}$)',
        ],
        correctOption: 0,
        explanation: 'Propagation delay ($D_{prop} = \\text{Distance} / \\text{Speed of Light}$) is the time for physical photons or electrons to travel across the distance of the wire, independent of packet size or link bandwidth.',
        explanationsJson: {
          1: 'Serialization delay is determined by packet size and link bandwidth ($L/R$).',
          2: 'Queueing delay is determined by router buffer congestion.',
          3: 'Processing delay is determined by router CPU and ASIC lookup speed.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Propagation Delay vs Other Delay Components',
      },
    ],
    lab: {
      title: 'Guided Practice: Network Performance Diagnostics & Latency Analysis',
      instructions:
        '1. Measure ping latency statistics and packet loss to target gateway.\n2. Calculate serialization delay for standard 1500-byte packets.\n3. Identify buffer queueing vs propagation delay anomalies.',
      difficulty: CourseLevel.FOUNDATIONAL,
      estimatedMinutes: 15,
      initialTopologyJson: { hostName: 'Client-PC', ip: '192.168.1.100', targetGateway: '192.168.1.1' },
      tasks: [
        'Run `ping 192.168.1.1` and evaluate RTT statistics.',
        'Calculate serialization time for 12,000 bits on 100 Mbps link.',
      ],
    },
  },

  // =========================================================================
  // BENCHMARK LESSON 4: NET-202 (IPv4 Addressing & CIDR) - PRESERVED
  // =========================================================================
  {
    courseCode: 'NET-202',
    slug: 'net-202-ipv4-addressing-cidr',
    title: 'IPv4 Addressing & CIDR',
    type: LessonType.THEORY,
    durationMinutes: 30,
    order: 1,
    visualizationType: 'SUBNET_CALCULATOR',
    introduction:
      'Master 32-bit IPv4 octets, subnet masks, CIDR slash notation, network boundaries, and exact usable host calculations.',
    stepMetadata: {
      step1_objective:
        'Master 32-bit IPv4 octets, subnet masks, CIDR slash notation (/N), network ID derivation, broadcast address calculation, and usable host ranges.',
      step2_prerequisites: ['net-101-bits-bytes-binary-hex', 'Bitwise AND logical operation'],
      step3_whyItMatters:
        'Every device connected to an IP network requires a unique IPv4 address and subnet mask. Misconfigured subnet masks lead to routing failures, IP address conflicts, and security isolation vulnerabilities across enterprise networks.',
      step4_coreConcept:
        'An IPv4 address is a 32-bit binary number written as four 8-bit octets separated by dots (e.g., 192.168.1.1). A Subnet Mask is a 32-bit number consisting of contiguous 1s followed by contiguous 0s. The 1s define the Network Portion, while the 0s define the Host Portion. Classless Inter-Domain Routing (CIDR) expresses subnet masks as a prefix slash number `/N` indicating the count of leading 1-bits.',
      step5_technicalAnatomy: {
        title: 'IPv4 Address & Subnet Mask Bit Structure',
        description:
          'A 32-bit IPv4 address is divided into Network Bits (N) and Host Bits (H). The total number of IP addresses in a subnet is $2^H$. Usable host addresses = $2^H - 2$ (subtracting Network ID and Broadcast ID).',
        components: [
          {
            name: 'Network ID (Subnet Address)',
            detail: 'First address in subnet where all host bits = 0. Unusable for assignment to individual host NICs.',
          },
          {
            name: 'Broadcast Address',
            detail: 'Last address in subnet where all host bits = 1. Packets sent here reach all hosts in the subnet.',
          },
          {
            name: 'Usable Host Range',
            detail: 'Addresses between Network ID + 1 and Broadcast ID - 1.',
          },
          {
            name: 'Block Size (Increment)',
            detail: 'Calculated in the interesting octet as: $256 - \\text{SubnetMaskOctet} = 2^H_{octet}$.',
          },
        ],
      },
      step6_howItWorks: {
        steps: [
          {
            stepNumber: 1,
            title: 'Convert Mask to CIDR Prefix',
            action: 'Count leading 1-bits in subnet mask (e.g. 255.255.255.192 = 24 + 2 = /26).',
          },
          {
            stepNumber: 2,
            title: 'Calculate Host Bits H',
            action: 'H = 32 - CIDR Prefix (e.g. H = 32 - 26 = 6 host bits).',
          },
          {
            stepNumber: 3,
            title: 'Determine Block Size',
            action: 'Block Size = $2^H$ or $256 - \\text{Subnet Mask Octet}$ (e.g. 256 - 192 = 64).',
          },
          {
            stepNumber: 4,
            title: 'Calculate Network ID',
            action: 'Round down the IP octet to nearest multiple of Block Size (e.g. 100 -> 64).',
          },
          {
            stepNumber: 5,
            title: 'Calculate Broadcast Address',
            action: 'Next Network ID - 1 (e.g. 64 + 64 - 1 = 127).',
          },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'IPv4 Header Address Fields',
        fields: [
          {
            fieldName: 'Version',
            bitLength: '4 bits',
            hexSample: '0x4',
            description: 'Value 4 indicates IPv4 protocol header.',
          },
          {
            fieldName: 'Header Length (IHL)',
            bitLength: '4 bits',
            hexSample: '0x5',
            description: '5 x 32-bit words = 20 Bytes base header length.',
          },
          {
            fieldName: 'Source IP Address',
            bitLength: '32 bits (4 Bytes)',
            hexSample: 'C0.A8.01.0A',
            description: 'Sender IP address (192.168.1.10).',
          },
          {
            fieldName: 'Destination IP Address',
            bitLength: '32 bits (4 Bytes)',
            hexSample: 'AC.10.00.05',
            description: 'Target IP address (172.16.0.5).',
          },
        ],
        headerDiagramAscii: `
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|Version|  IHL  |Type of Service|          Total Length         |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    Source IPv4 Address (32 bits)              |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                 Destination IPv4 Address (32 bits)            |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
`,
      },
      step8_visualExplanation: {
        type: 'SUBNET_CALCULATOR',
        title: 'Interactive IPv4 CIDR Subnet Calculator & Bit Splitter',
        description:
          'Input any IP address and CIDR prefix (/24 to /30) to see exact binary bit boundaries, Subnet Mask, Network ID, Broadcast ID, and Usable Host Range.',
      },
      step9_workedExample: {
        title: 'Subnetting IP 192.168.1.100 with Subnet Mask 255.255.255.192 (/26)',
        problemStatement:
          'Given IP 192.168.1.100 /26, calculate:\n1. Subnet Mask\n2. Block Size\n3. Network ID\n4. Broadcast ID\n5. Usable Host Range\n6. Total Usable Hosts.',
        stepByStepSolution: [
          '1. Mask /26 = 11111111.11111111.11111111.11000000 = 255.255.255.192.',
          '2. Host bits H = 32 - 26 = 6 bits. Block Size = 2^6 = 64 (or 256 - 192 = 64).',
          '3. Multiples of 64: 0, 64, 128, 192. IP 100 lies between 64 and 128. Network ID = 192.168.1.64.',
          '4. Next Subnet = 192.168.1.128. Broadcast ID = 128 - 1 = 192.168.1.127.',
          '5. Usable Host Range = 192.168.1.65 through 192.168.1.126.',
          '6. Total Usable Hosts = 2^6 - 2 = 64 - 2 = 62 usable IP addresses.',
        ],
        finalResult:
          'Network ID: 192.168.1.64/26 | Broadcast: 192.168.1.127 | Host Range: 192.168.1.65 - 192.168.1.126 (62 Hosts).',
      },
      step10_realWorldScenario: {
        topology: 'Branch Office Network with 50 Engineering PCs requiring dedicated subnet isolation.',
        scenarioText:
          'A network architect receives a `/24` block (`192.168.10.0/24`) and needs to create subnets for 50 Engineering PCs, 20 Sales PCs, and 10 Executives. Using CIDR subnetting, the architect assigns `192.168.10.0/26` (62 hosts) to Engineering, `192.168.10.64/27` (30 hosts) to Sales, and `192.168.10.96/28` (14 hosts) to Executives.',
        engineeringContext: 'VLSM prevents wasting thousands of IP addresses in enterprise networks.',
      },
      step11_deviceBehavior: {
        hostBehavior:
          'When a host transmits data, it performs bitwise AND between its own IP/mask and the destination IP. If Network IDs match, it sends locally via ARP; if Network IDs differ, it forwards to the Default Gateway router.',
        nicBehavior: 'NIC processes 32-bit binary IP destination field in packet header.',
        switchOrRouterBehavior:
          'Router evaluates destination IP against routing table using Longest Prefix Match (LPM) rule.',
      },
      step12_cliTooling: [
        {
          command: 'ipconfig /all',
          description: 'Displays active IPv4 address, Subnet Mask, Default Gateway, and DHCP server IPs.',
          expectedOutput:
            'IPv4 Address. . . . . . . . . . . : 192.168.1.100(Preferred)\nSubnet Mask . . . . . . . . . . . : 255.255.255.192\nDefault Gateway . . . . . . . . . : 192.168.1.65',
          proofExplanation: 'Proves host is assigned to 192.168.1.64/26 subnet with gateway 192.168.1.65.',
        },
        {
          command: 'route print',
          description: 'Displays local Windows routing table and active destination subnets.',
          expectedOutput:
            'Network Destination        Netmask          Gateway       Interface\n192.168.1.64        255.255.255.192         On-link      192.168.1.100',
          proofExplanation: 'Shows kernel routing table matching local subnet 192.168.1.64/26 directly on-link.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'Host 192.168.1.100/26 cannot ping Gateway Router 192.168.1.1.',
          possibleCauses: [
            'Gateway IP 192.168.1.1 lies outside host subnet range 192.168.1.65-126',
            'Incorrect Subnet Mask configured on host',
          ],
          diagnosticSteps: [
            'Check host IP (192.168.1.100) and Subnet Mask (255.255.255.192).',
            'Calculate host subnet range: 192.168.1.65 to 192.168.1.126.',
            'Observe that Gateway 192.168.1.1 is in 192.168.1.0/26 subnet, not 192.168.1.64/26.',
          ],
          remediation: 'Change Gateway IP to valid host address inside subnet (e.g. 192.168.1.65).',
        },
      ],
      step14_commonMistakes: [
        {
          misconception: 'Assigning Network ID or Broadcast ID directly to a host PC.',
          correction:
            'Network ID (all host bits 0) and Broadcast ID (all host bits 1) are reserved and cannot be assigned to individual NICs.',
        },
        {
          misconception: 'Assuming 2^H represents usable host IPs.',
          correction: '2^H represents TOTAL addresses. USABLE hosts is $2^H - 2$.',
        },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'Subnet Boundary Hopping & IP Address Conflict Denial of Service',
        mitigationStrategy:
          'Enforce strict DHCP Snooping, IP Source Guard (IPSG), and VLAN isolation to prevent unauthorized static IP assignment outside designated subnets.',
      },
      step16_examPrep: {
        keyExamPoints: [
          'Formula for total IPs: 2^H. Formula for usable hosts: 2^H - 2.',
          'Subnet masks must be contiguous 1s followed by contiguous 0s.',
          'Know subnet mask octet values: /25=128, /26=192, /27=224, /28=240, /29=248, /30=252.',
        ],
        frequentTraps: [
          'Forgetting to subtract 2 for Network and Broadcast IDs.',
          'Selecting a gateway IP that belongs to a different subnet block.',
        ],
      },
      step17_practicalLabRef: {
        title: 'IPv4 Subnet Mask Derivation & Gateway Reachability Verification Lab',
        scenario:
          'You are configuring a branch office workstation. You must inspect IP configuration, calculate the correct Network ID and Broadcast IP for a /26 prefix, and correct gateway reachability.',
        tasks: [
          'Run ipconfig /all to audit current IP and Subnet Mask.',
          'Calculate Network ID and Broadcast ID for IP 192.168.1.100 /26.',
          'Reconfigure Gateway IP to 192.168.1.65.',
          'Verify ping connectivity to Gateway Router.',
        ],
        verificationMethod: 'Execute ping diagnostic and verify 100% packet transmission in terminal.',
      },
      step18_masterySummary: {
        summaryPoints: [
          'IPv4 addresses are 32-bit binary integers written in dotted-decimal format.',
          'CIDR slash prefix /N specifies count of network 1-bits.',
          'Usable host addresses = $2^H - 2$, bounded by Network ID and Broadcast ID.',
        ],
        nextLessonBridge:
          'Now that you master IPv4 addressing and CIDR subnetting, proceed to learn about Special-Use IPv4 Ranges in Lesson 2.',
      },
    },
    questions: [
      {
        text: 'How many USABLE host IP addresses are available in a CIDR `/26` subnet?',
        options: ['62', '64', '126', '30'],
        correctOption: 0,
        explanation: 'A /26 prefix leaves 32 - 26 = 6 host bits. Total IPs = 2^6 = 64. Usable hosts = 64 - 2 = 62.',
        explanationsJson: {
          1: '64 is the TOTAL IP addresses including Network and Broadcast IDs.',
          2: '126 usable hosts belong to a /25 subnet (2^7 - 2).',
          3: '30 usable hosts belong to a /27 subnet (2^5 - 2).',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'CIDR Subnet Calculation',
      },
      {
        text: 'Given IP address `192.168.1.100` and Subnet Mask `255.255.255.192` (/26), what is the exact Network ID?',
        options: ['192.168.1.64', '192.168.1.0', '192.168.1.128', '192.168.1.96'],
        correctOption: 0,
        explanation: 'Block size = 256 - 192 = 64. Subnet blocks: 0, 64, 128. IP .100 lies in block .64. Network ID = 192.168.1.64.',
        explanationsJson: {
          1: '192.168.1.0 is the first subnet block (0 to 63).',
          2: '192.168.1.128 is the third subnet block (128 to 191).',
          3: '192.168.1.96 is not a valid block boundary for a /26 mask (block size 64).',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Network ID Derivation',
      },
      {
        text: 'What is the Broadcast Address for subnet `192.168.1.64/26`?',
        options: ['192.168.1.127', '192.168.1.255', '192.168.1.63', '192.168.1.128'],
        correctOption: 0,
        explanation: 'Next subnet block begins at .128. Broadcast ID is 128 - 1 = 192.168.1.127.',
        explanationsJson: {
          1: '192.168.1.255 is the broadcast address for 192.168.1.192/26 or 192.168.1.0/24.',
          2: '192.168.1.63 is the broadcast address for the prior 192.168.1.0/26 subnet.',
          3: '192.168.1.128 is the Network ID of the next subnet block.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Broadcast Address Calculation',
      },
      {
        text: 'What is the equivalent dotted-decimal Subnet Mask for CIDR prefix `/28`?',
        options: ['255.255.255.240', '255.255.255.224', '255.255.255.248', '255.255.255.252'],
        correctOption: 0,
        explanation: 'Prefix /28 means 28 leading 1-bits: 24 bits in first 3 octets + 4 bits in 4th octet (128+64+32+16 = 240). Mask = 255.255.255.240.',
        explanationsJson: {
          1: '255.255.255.224 corresponds to /27 (3 bits in 4th octet).',
          2: '255.255.255.248 corresponds to /29 (5 bits in 4th octet).',
          3: '255.255.255.252 corresponds to /30 (6 bits in 4th octet).',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'CIDR to Subnet Mask Conversion',
      },
      {
        text: '[TROUBLESHOOTING] Host A has IP `10.0.0.50/24` and Default Gateway `10.0.0.1`. Host B has IP `10.0.1.50/24`. Host A attempts to send a packet directly to Host B without a router. Why does communication fail?',
        options: [
          'Host A bitwise AND determination shows Host B is on a different Network ID (10.0.1.0/24 vs 10.0.0.0/24)',
          'Subnet mask /24 does not support more than 10 hosts',
          'Host B MAC address has expired from RAM',
          'Default Gateway IP 10.0.0.1 is invalid for /24 subnets',
        ],
        correctOption: 0,
        explanation: 'Host A performs bitwise AND: 10.0.0.50 AND 255.255.255.0 = 10.0.0.0. Destination 10.0.1.50 AND 255.255.255.0 = 10.0.1.0. Because network IDs differ, Host A cannot send locally via ARP and requires Layer 3 routing.',
        explanationsJson: {
          1: 'A /24 subnet supports 254 usable host addresses.',
          2: 'MAC address expiration triggers a new ARP request, not permanent failure.',
          3: '10.0.0.1 is a perfectly valid host IP within 10.0.0.0/24.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Inter-Subnet Routing Logic',
      },
    ],
    lab: {
      title: 'Guided Practice: IPv4 Subnet Mask Derivation & Gateway Verification',
      instructions:
        '1. Audit host IP configuration using ipconfig /all.\n2. Calculate Network ID for IP 192.168.1.100/26.\n3. Update gateway IP to 192.168.1.65 and verify reachability.',
      difficulty: CourseLevel.BEGINNER,
      estimatedMinutes: 20,
      initialTopologyJson: { hostName: 'Workstation-1', ip: '192.168.1.100', mask: '255.255.255.192', gateway: '192.168.1.1' },
      tasks: [
        'Run ipconfig /all in terminal.',
        'Calculate usable host range for 192.168.1.64/26.',
        'Ping Gateway 192.168.1.65 to confirm connectivity.',
      ],
    },
  },

  // =========================================================================
  // REWRITTEN LESSON 5: NET-202 / level-0-ip-addresses-logical-location
  // Topic: Special-Use IPv4 Ranges & Enterprise Address Allocation
  // Replaced: Duplicate generic binary and basic IP intro.
  // Focus: RFC 1918 private ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16),
  // loopback (127.0.0.0/8), APIPA/link-local (169.254.0.0/16), CGNAT (100.64.0.0/10).
  // =========================================================================
  {
    courseCode: 'NET-202',
    slug: 'level-0-ip-addresses-logical-location',
    title: 'Special-Use IPv4 Ranges & Enterprise Address Allocation',
    type: LessonType.THEORY,
    durationMinutes: 20,
    order: 2,
    visualizationType: 'SPECIAL_IP_INSPECTOR',
    introduction:
      'Master the designated special-purpose IPv4 address allocations defined by IANA and RFC standards: RFC 1918 Private ranges (10/8, 172.16/12, 192.168/16), Loopback Localhost (127/8), APIPA Link-Local (169.254/16), and Carrier-Grade NAT Shared Space (100.64/10).',
    stepMetadata: {
      step1_objective:
        'Understand the specific roles, routing boundaries, and diagnostic significance of special-purpose IPv4 address ranges: private RFC 1918 networks, loopback inter-process communication, APIPA automatic DHCP fallback, and ISP Carrier-Grade NAT.',
      step2_prerequisites: ['net-202-ipv4-addressing-cidr', 'Understanding of subnet masks and CIDR notation'],
      step3_whyItMatters:
        'Assigning a public IP internally creates routing conflicts; seeing a 169.254.x.x address immediately alerts an engineer to a broken DHCP server; and understanding RFC 1918 is essential for configuring firewalls and Network Address Translation (NAT).',
      step4_coreConcept:
        'Out of the 4.3 billion possible 32-bit IPv4 addresses, IANA reserves specific ranges for dedicated architectural functions. RFC 1918 reserves three private address blocks that are strictly prohibited from being routed on the public Internet: 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16. The 127.0.0.0/8 block is reserved for loopback internal testing. The 169.254.0.0/16 block (APIPA) is automatically self-assigned when DHCP fails. The 100.64.0.0/10 block is reserved for Carrier-Grade NAT (CGNAT) across service provider networks.',
      step5_technicalAnatomy: {
        title: 'Special-Use IPv4 Address Space Classifications',
        description:
          'Structural specifications, prefix lengths, and routing scopes for all designated IPv4 special ranges.',
        components: [
          {
            name: 'RFC 1918 Class A Private: 10.0.0.0/8',
            detail: 'Spans 10.0.0.0 to 10.255.255.255 (16,777,216 addresses / 1 single /8 block). Used by large enterprise campuses, data centers, and multi-national WANs.',
          },
          {
            name: 'RFC 1918 Class B Private: 172.16.0.0/12',
            detail: 'Spans 172.16.0.0 to 172.31.255.255 (1,048,576 addresses / 16 contiguous /16 blocks). Used by mid-size corporations and university campus networks.',
          },
          {
            name: 'RFC 1918 Class C Private: 192.168.0.0/16',
            detail: 'Spans 192.168.0.0 to 192.168.255.255 (65,536 addresses / 256 contiguous /24 blocks). Standard for home routers, SOHO environments, and branch LANs.',
          },
          {
            name: 'Loopback / Localhost: 127.0.0.0/8',
            detail: 'Spans 127.0.0.0 to 127.255.255.255 (standard IP 127.0.0.1). Traffic never leaves the local host OS; handled entirely within the kernel IP stack for internal server/client testing.',
          },
          {
            name: 'APIPA / Link-Local: 169.254.0.0/16 (RFC 3927)',
            detail: 'Spans 169.254.1.0 to 169.254.254.255. Self-assigned via IPv4 Link-Local autoconfiguration when a client fails to receive a DHCP lease. Unroutable past local switch.',
          },
          {
            name: 'Carrier-Grade NAT (CGNAT): 100.64.0.0/10 (RFC 6598)',
            detail: 'Spans 100.64.0.0 to 100.127.255.255 (4,194,304 addresses). Shared address space used by cellular carriers and ISPs to NAT thousands of subscribers without colliding with customer RFC 1918 private subnets.',
          },
        ],
      },
      step6_howItWorks: {
        steps: [
          {
            stepNumber: 1,
            title: 'Private LAN Routing & Internet Dropping',
            action:
              'Routers inside an enterprise forward RFC 1918 traffic freely between internal subnets. Internet backbone service provider routers drop all RFC 1918 packets by default.',
          },
          {
            stepNumber: 2,
            title: 'Network Address Translation (NAT) Traversal',
            action:
              'When an internal host (e.g. 192.168.1.50) accesses a public web server, the edge router translates the private IP into a registered public IP address.',
          },
          {
            stepNumber: 3,
            title: 'APIPA Fallback Trigger',
            action:
              'When a PC boots up and receives no response to its DHCP Discover broadcasts after 30–60 seconds, the OS randomly selects an IP in 169.254.0.0/16 and performs ARP probe verification.',
          },
          {
            stepNumber: 4,
            title: 'Loopback Stack Verification',
            action:
              'Pinging 127.0.0.1 sends packets through the local TCP/IP protocol driver in RAM without requiring an active physical link or working network cable.',
          },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'Special-Use IPv4 Range Allocation Matrix',
        fields: [
          {
            fieldName: '10.0.0.0/8 (Private)',
            bitLength: '16.7M Hosts',
            hexSample: '0x0A000000',
            description: 'Non-routable on public Internet; enterprise private allocation.',
          },
          {
            fieldName: '172.16.0.0/12 (Private)',
            bitLength: '1.04M Hosts',
            hexSample: '0xAC100000',
            description: 'Non-routable on public Internet; 16 contiguous /16 blocks (172.16 to 172.31).',
          },
          {
            fieldName: '192.168.0.0/16 (Private)',
            bitLength: '65.5K Hosts',
            hexSample: '0xC0A80000',
            description: 'Non-routable on public Internet; SOHO and branch default allocation.',
          },
          {
            fieldName: '169.254.0.0/16 (APIPA)',
            bitLength: '65.5K Hosts',
            hexSample: '0xA9FE0000',
            description: 'Automatic DHCP failure fallback; unroutable past local LAN.',
          },
        ],
        headerDiagramAscii: `
+-------------------------------------------------------------------------------+
|                    SPECIAL-PURPOSE IPv4 ADDRESS RANGES                        |
+-------------------+-------------------+-------------------+-------------------+
| Range / Prefix    | Total Addresses   | Scope & Routability| Primary Purpose  |
+-------------------+-------------------+-------------------+-------------------+
| 10.0.0.0/8        | 16,777,216 (1 /8) | Private / Internal| Large Enterprise  |
| 172.16.0.0/12     | 1,048,576 (16 /16)| Private / Internal| Mid-Sized Campus  |
| 192.168.0.0/16    | 65,536 (256 /24)  | Private / Internal| Home & Branch LAN |
| 127.0.0.0/8       | 16,777,216        | Node-Local Only   | Loopback IPC      |
| 169.254.0.0/16    | 65,536            | Link-Local Only   | APIPA DHCP Fallback|
| 100.64.0.0/10     | 4,194,304         | Carrier CGNAT     | ISP Shared NAT    |
+-------------------+-------------------+-------------------+-------------------+
`,
      },
      step8_visualExplanation: {
        type: 'SPECIAL_IP_INSPECTOR',
        title: 'Special-Purpose IPv4 Address Space Analyzer',
        description:
          'Inspect any IPv4 address to instantly classify its RFC category, routing scope (Public Internet, RFC 1918 Private, Loopback, APIPA, or CGNAT), and required gateway translation behavior.',
      },
      step9_workedExample: {
        title: 'Diagnosing IP Address Types and APIPA DHCP Failure',
        problemStatement:
          'Classify the following four IP addresses by their RFC designated scope and explain why Host D cannot reach the Internet:\n1. IP: 10.50.1.100\n2. IP: 172.32.10.5\n3. IP: 100.70.12.1\n4. IP: 169.254.45.120',
        stepByStepSolution: [
          '1. `10.50.1.100`: Belongs to `10.0.0.0/8` -> RFC 1918 Private IP (Enterprise LAN).',
          '2. `172.32.10.5`: The RFC 1918 Class B range is strictly `172.16.0.0` through `172.31.255.255`. Since 32 > 31, `172.32.10.5` is a Publicly Routable Internet IP (assigned to T-Mobile USA).',
          '3. `100.70.12.1`: Belongs to `100.64.0.0/10` (`100.64.0.0` - `100.127.255.255`) -> RFC 6598 Carrier-Grade NAT (CGNAT) Shared Address Space.',
          '4. `169.254.45.120`: Belongs to `169.254.0.0/16` -> APIPA Link-Local address. This proves Host D failed to obtain a lease from the DHCP server and has no Default Gateway configured.',
        ],
        finalResult:
          '1=Private (RFC 1918), 2=Public Internet, 3=CGNAT (RFC 6598), 4=APIPA (DHCP Failure).',
      },
      step10_realWorldScenario: {
        topology: 'Office Helpdesk Ticket: "Entire Accounting Department Lost Internet Access"',
        scenarioText:
          'Helpdesk receives calls that 20 PCs in Accounting suddenly lost all network connectivity. An engineer runs `ipconfig` on an affected PC and observes IP `169.254.12.88` with subnet mask `255.255.0.0` and no Default Gateway. The engineer immediately recognizes this as an APIPA Link-Local address, checks the local DHCP server, and discovers the DHCP service crashed after a reboot. Restarting the DHCP service immediately restores 192.168.10.x IP leases and network connectivity.',
        engineeringContext:
          'Spotting an APIPA `169.254.x.x` address is the single fastest diagnostic indicator of a DHCP server failure or disconnected VLAN in enterprise support.',
      },
      step11_deviceBehavior: {
        hostBehavior:
          'If DHCP fails, the host IP stack automatically executes the APIPA state machine, picking a random address in 169.254.0.0/16 and transmitting ARP requests to ensure no other local node is using it.',
        nicBehavior:
          'Loopback traffic destined for 127.0.0.1 is short-circuited in the OS network driver and never reaches the physical NIC transceiver.',
        switchOrRouterBehavior:
          'Routers discard any packet destined for 127.0.0.0/8 or 169.254.0.0/16 that arrives on an external physical interface.',
      },
      step12_cliTooling: [
        {
          command: 'ipconfig',
          description: 'Checks whether the workstation has obtained an RFC 1918 private address or defaulted to APIPA.',
          expectedOutput:
            'Ethernet adapter Local Area Connection:\n  Autoconfiguration IPv4 Address. . : 169.254.120.45\n  Subnet Mask . . . . . . . . . . . : 255.255.0.0\n  Default Gateway . . . . . . . . . :',
          proofExplanation:
            'Shows an active APIPA address and missing Default Gateway, proving DHCP lease failure.',
        },
        {
          command: 'ping 127.0.0.1',
          description: 'Tests the internal TCP/IP software stack on the local host without sending packets on the wire.',
          expectedOutput:
            'Pinging 127.0.0.1 with 32 bytes of data:\nReply from 127.0.0.1: bytes=32 time<1ms TTL=128',
          proofExplanation: 'Proves the local OS TCP/IP protocol stack is properly installed and operational.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'Host displays APIPA IP `169.254.x.x` and cannot communicate with any network servers or Internet.',
          possibleCauses: [
            'DHCP Server service stopped or pool completely exhausted',
            'Switch port assigned to incorrect/unrouted VLAN',
            'DHCP Snooping or firewall blocking UDP ports 67/68',
          ],
          diagnosticSteps: [
            'Verify physical link status LED on switch port.',
            'Execute `ipconfig /renew` to force a new DHCP Discover broadcast.',
            'Check DHCP server pool utilization and lease availability.',
          ],
          remediation:
            'Resolve DHCP server service outage or assign a valid static RFC 1918 IP address within the subnet.',
        },
      ],
      step14_commonMistakes: [
        {
          misconception: 'Assuming all 172.x.x.x addresses are private RFC 1918 addresses.',
          correction:
            'Only `172.16.0.0` through `172.31.255.255` is private. Addresses such as `172.15.x.x` or `172.32.x.x` are publicly routable Internet IPs.',
        },
        {
          misconception: 'Believing an APIPA address allows internet access through NAT.',
          correction:
            'APIPA `169.254.0.0/16` is strictly link-local. It has no default gateway and routers will never forward APIPA packets.',
        },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'Rogue DHCP Servers & Private IP Collisions',
        mitigationStrategy:
          'Configure DHCP Snooping on switches to trust only authorized DHCP server ports and prevent rogue routers from handing out unauthorized private subnets.',
      },
      step16_examPrep: {
        keyExamPoints: [
          'Know exact RFC 1918 Private ranges: 10.0.0.0/8, 172.16.0.0/12 (172.16 to 172.31), 192.168.0.0/16.',
          'Loopback: 127.0.0.0/8 (tests local TCP/IP stack).',
          'APIPA: 169.254.0.0/16 (DHCP failure).',
          'CGNAT: 100.64.0.0/10 (ISP shared address space).',
        ],
        frequentTraps: [
          'Selecting 172.32.1.1 as a private address (it is public).',
          'Thinking 127.0.0.1 packets travel through physical Ethernet cables.',
        ],
      },
      step17_practicalLabRef: {
        title: 'Guided Practice: Special-Use IPv4 Range Audit & APIPA Diagnostics',
        scenario:
          'Audit enterprise IP configurations: classify private vs public addresses, verify loopback stack health, and diagnose an APIPA DHCP failure scenario.',
        tasks: [
          'Audit host IP address using `ipconfig` and identify if it is RFC 1918, APIPA, or Public.',
          'Ping loopback address `127.0.0.1` to verify internal protocol stack integrity.',
          'Release and renew DHCP lease using `ipconfig /renew`.',
        ],
        verificationMethod:
          'Confirm that successful DHCP acquisition replaces APIPA 169.254.x.x with a valid 192.168.1.x private IP.',
      },
      step18_masterySummary: {
        summaryPoints: [
          'RFC 1918 Private IP blocks (10/8, 172.16/12, 192.168/16) are reserved for internal LANs and dropped on the Internet.',
          'Loopback (`127.0.0.0/8`) tests the local host TCP/IP stack internally.',
          'APIPA (`169.254.0.0/16`) is automatically self-assigned when DHCP fails.',
          'CGNAT (`100.64.0.0/10`) allows ISPs to perform carrier-scale NAT without private IP collisions.',
        ],
        nextLessonBridge:
          'Now that you master special-purpose IPv4 address ranges, proceed to Lesson 3 to explore the history of classful addressing and why the industry transitioned to CIDR.',
      },
    },
    questions: [
      {
        text: 'Which of the following IPv4 address blocks is an official RFC 1918 Private address range that is non-routable on the public Internet?',
        options: [
          '172.20.0.0/16',
          '172.35.0.0/16',
          '192.170.0.0/16',
          '11.0.0.0/8',
        ],
        correctOption: 0,
        explanation: 'RFC 1918 Class B private space covers `172.16.0.0` through `172.31.255.255` (/12). `172.20.0.0/16` falls directly within this private range.',
        explanationsJson: {
          1: '172.35.0.0/16 is outside the private 172.16-172.31 range and is a publicly routable IP.',
          2: '192.170.0.0/16 is outside the private 192.168.0.0/16 range and is public.',
          3: '11.0.0.0/8 is public (only 10.0.0.0/8 is private in the 10.x space).',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'RFC 1918 Private Address Ranges',
      },
      {
        text: 'A network technician runs `ipconfig` on a workstation that cannot access the Internet and sees IPv4 address `169.254.88.19` with subnet mask `255.255.0.0`. What does this address indicate?',
        options: [
          'The workstation failed to contact a DHCP server and self-assigned an APIPA Link-Local address',
          'The workstation successfully obtained a private corporate IP lease from the domain controller',
          'The workstation has been assigned a public Carrier-Grade NAT address by the ISP',
          'The workstation network interface card is defective and must be physically replaced',
        ],
        correctOption: 0,
        explanation: 'Addresses in `169.254.0.0/16` are Automatic Private IP Addressing (APIPA) link-local addresses, assigned by the operating system when DHCP Discover broadcasts receive no reply.',
        explanationsJson: {
          1: 'Corporate DHCP leases use RFC 1918 private spaces (10.x, 172.16-31.x, 192.168.x), not APIPA.',
          2: 'Carrier-Grade NAT uses 100.64.0.0/10, not 169.254.x.x.',
          3: 'APIPA indicates a DHCP server/network connectivity failure, not necessarily hardware failure.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
        questionType: QuestionType.TROUBLESHOOTING,
        concept: 'APIPA / Link-Local Troubleshooting',
      },
      {
        text: 'What is the primary purpose of the `100.64.0.0/10` IPv4 address block defined in RFC 6598?',
        options: [
          'Carrier-Grade NAT (CGNAT) Shared Address Space used by ISPs to connect customers without colliding with RFC 1918 subnets',
          'Multicast streaming for public Internet radio broadcasts',
          'Internal loopback testing for multi-core CPUs',
          'Direct satellite uplink routing for military defense networks',
        ],
        correctOption: 0,
        explanation: 'RFC 6598 designates `100.64.0.0/10` as Shared Address Space for Carrier-Grade NAT (CGNAT), allowing service providers to NAT subscriber traffic without conflicting with internal customer 10.x or 192.168.x subnets.',
        explanationsJson: {
          1: 'Multicast uses Class D 224.0.0.0/4 (224.0.0.0 to 239.255.255.255).',
          2: 'Loopback uses 127.0.0.0/8.',
          3: 'Military defense historically received legacy Class A blocks (e.g. 6.0.0.0/8, 11.0.0.0/8).',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Carrier-Grade NAT (RFC 6598 Shared Space)',
      },
      {
        text: 'When an engineer executes `ping 127.0.0.1` in a command terminal, where do the generated ICMP packets physically travel?',
        options: [
          'They are processed entirely within the local host operating system TCP/IP software stack in RAM and never reach the network card or wire',
          'They travel out the physical Ethernet port to the local default gateway and return',
          'They are broadcast to all devices on the local Layer 2 switch',
          'They query the nearest public DNS root server',
        ],
        correctOption: 0,
        explanation: 'The entire `127.0.0.0/8` range is reserved for node-local loopback. Traffic sent to 127.0.0.1 is routed internally within the kernel network driver to verify protocol stack integrity without hitting physical transceivers.',
        explanationsJson: {
          1: 'Loopback packets never egress the physical NIC interface.',
          2: 'Loopback traffic is strictly node-local and is never flooded as a switch broadcast.',
          3: 'Loopback has no interaction with external DNS servers.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Loopback Interface Mechanics (127.0.0.1)',
      },
    ],
    lab: {
      title: 'Guided Practice: Special-Use IPv4 Range Audit & APIPA Diagnostics',
      instructions:
        '1. Inspect active IP configuration with `ipconfig`.\n2. Verify local TCP/IP stack health with `ping 127.0.0.1`.\n3. Identify APIPA vs RFC 1918 private address scopes.',
      difficulty: CourseLevel.BEGINNER,
      estimatedMinutes: 15,
      initialTopologyJson: { hostName: 'PC-1', ip: '169.254.12.88', mask: '255.255.0.0' },
      tasks: [
        'Run `ipconfig` and identify the active APIPA address.',
        'Ping `127.0.0.1` to confirm TCP/IP stack function.',
      ],
    },
  },

  // =========================================================================
  // REWRITTEN LESSON 6: NET-202 / ip-addressing-ipv4-overview
  // Topic: Classful IPv4 History & The Architectural Necessity of CIDR
  // Replaced: Duplicate basic subnetting calculations.
  // Focus: Class A/B/C/D/E, address waste, why classful failed, transition to CIDR.
  // =========================================================================
  {
    courseCode: 'NET-202',
    slug: 'ip-addressing-ipv4-overview',
    title: 'Classful IPv4 History & The Architectural Necessity of CIDR',
    type: LessonType.THEORY,
    durationMinutes: 25,
    order: 3,
    visualizationType: 'CLASSFUL_CIDR_TIMELINE',
    introduction:
      'Explore the historical evolution of IPv4 addressing: the original 1981 Classful Architecture (Classes A, B, C, D, E), the massive address waste and routing table explosion that nearly collapsed the Internet in 1993, and the revolutionary transition to Classless Inter-Domain Routing (CIDR, RFC 1519).',
    stepMetadata: {
      step1_objective:
        'Understand the historical rules of Classful IPv4 addressing (Classes A, B, C), analyze why rigid class boundaries caused massive address exhaustion, and understand how Classless Inter-Domain Routing (CIDR) decoupled network prefixes from octet boundaries.',
      step2_prerequisites: ['net-202-ipv4-addressing-cidr', 'Understanding of 32-bit binary notation'],
      step3_whyItMatters:
        'Without understanding why classful addressing failed, modern networking concepts like variable-length subnet masking (VLSM), route summarization/supernetting, and CIDR prefix notation (/N) lack architectural context.',
      step4_coreConcept:
        'When IPv4 was standardized in RFC 791 (1981), addresses were rigidly divided into five classes based on their first octet leading bits: Class A (/8, 16.7 million hosts), Class B (/16, 65,534 hosts), Class C (/24, 254 hosts), Class D (Multicast), and Class E (Experimental). Because organizations needing 300 IP addresses could not fit in a Class C (254 max), they were assigned an entire Class B (/16), wasting over 65,000 public IP addresses per allocation. By 1993, Class B address exhaustion and exponential routing table growth forced the IETF to introduce CIDR (RFC 1519), completely abolishing fixed class boundaries in favor of arbitrary prefix lengths (/1 to /32).',
      step5_technicalAnatomy: {
        title: 'Legacy Classful Boundaries vs Modern CIDR Architecture',
        description:
          'First octet binary identification, default masks, network capacities, and address waste comparison.',
        components: [
          {
            name: 'Class A (First Octet: 1 to 126 | Leading Bit: 0)',
            detail: 'Default mask 255.0.0.0 (/8). 126 networks total (1.0.0.0 to 126.0.0.0), each containing 16,777,214 usable host IPs ($2^{24} - 2$). Consumed 50% of the entire IPv4 address space across just 126 entities (e.g. IBM, MIT, Apple).',
          },
          {
            name: 'Class B (First Octet: 128 to 191 | Leading Bits: 10)',
            detail: 'Default mask 255.255.0.0 (/16). 16,384 networks, each supporting 65,534 usable host IPs ($2^{16} - 2$). Suffered complete exhaustion by 1993 due to intermediate organization allocations.',
          },
          {
            name: 'Class C (First Octet: 192 to 223 | Leading Bits: 110)',
            detail: 'Default mask 255.255.255.0 (/24). 2,097,152 networks, each supporting only 254 usable host IPs ($2^8 - 2$). Too small for most mid-sized enterprises.',
          },
          {
            name: 'Class D (Multicast: 224 to 239) & Class E (240 to 255)',
            detail: 'Class D (Leading bits 1110) has no host/network split; used for multicast groups. Class E (Leading bits 1111) remains reserved for experimental research.',
          },
          {
            name: 'Classless Inter-Domain Routing (CIDR, RFC 1519)',
            detail: 'Abolished fixed class rules in 1993. Allows any arbitrary prefix length /N (e.g. /22, /27, /30) to be assigned, and enables Route Summarization (Supernetting) to aggregate thousands of routes into single prefixes.',
          },
        ],
      },
      step6_howItWorks: {
        steps: [
          {
            stepNumber: 1,
            title: 'Classful First-Octet Rule Evaluation',
            action:
              'In legacy classful routing, routers inspected the first octet value to deduce the subnet mask automatically (e.g. 10.x = /8, 172.x = /16, 192.x = /24) without carrying mask information in routing protocols.',
          },
          {
            stepNumber: 2,
            title: 'The Mid-Sized Enterprise Allocation Crisis',
            action:
              'A company requiring 500 IP addresses was allocated an entire Class B block (65,536 IPs). 65,036 addresses (99.2%) sat completely unused and locked away.',
          },
          {
            stepNumber: 3,
            title: 'Routing Table Explosion',
            action:
              'To avoid wasting Class B blocks, ISPs allocated dozens of contiguous Class C /24 blocks to customers, injecting hundreds of thousands of individual routes into global router memory.',
          },
          {
            stepNumber: 4,
            title: 'CIDR Prefix Decoupling & Supernetting',
            action:
              'With CIDR (/N), the same company is allocated exactly a /23 prefix (512 IPs, 510 usable), wasting only 10 addresses while four /24 routes are aggregated into a single `/22` advertisement.',
          },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'Classful Structure vs CIDR Prefix Notation',
        fields: [
          {
            fieldName: 'Class A Default Mask',
            bitLength: '8 Network Bits',
            hexSample: '255.0.0.0 (/8)',
            description: '126 Networks | 16.7M Hosts per network (50% of global IPv4).',
          },
          {
            fieldName: 'Class B Default Mask',
            bitLength: '16 Network Bits',
            hexSample: '255.255.0.0 (/16)',
            description: '16,384 Networks | 65,534 Hosts per network (Exhausted by 1993).',
          },
          {
            fieldName: 'Class C Default Mask',
            bitLength: '24 Network Bits',
            hexSample: '255.255.255.0 (/24)',
            description: '2.09M Networks | 254 Hosts per network.',
          },
          {
            fieldName: 'CIDR Prefix (/N)',
            bitLength: 'Arbitrary 1 to 32 bits',
            hexSample: 'e.g. /23 (510 Hosts)',
            description: 'Arbitrary network prefix length decoupled from octet boundaries.',
          },
        ],
        headerDiagramAscii: `
+-------------------------------------------------------------------------------+
|                      LEGACY CLASSFUL ADDRESS BOUNDARIES                       |
+-------------------+-------------------+-------------------+-------------------+
| Class             | 1st Octet Range   | Leading Bits      | Default Subnet Mask|
+-------------------+-------------------+-------------------+-------------------+
| Class A           | 1   – 126         | 0                 | 255.0.0.0   (/8)  |
| (Loopback)        | 127 – 127         | 01111111          | 255.0.0.0   (/8)  |
| Class B           | 128 – 191         | 10                | 255.255.0.0 (/16) |
| Class C           | 192 – 223         | 110               | 255.255.255.0(/24)|
| Class D (Multicast)| 224 – 239        | 1110              | None (Multicast)  |
| Class E (Reserved)| 240 – 255         | 1111              | None (Experimental|
+-------------------+-------------------+-------------------+-------------------+
`,
      },
      step8_visualExplanation: {
        type: 'CLASSFUL_CIDR_TIMELINE',
        title: 'Classful IPv4 vs Modern CIDR Interactive Timeline',
        description:
          'Visualize how rigid Class A/B/C boundaries led to massive address waste, and how CIDR (/N) enabled arbitrary network sizing and route aggregation.',
      },
      step9_workedExample: {
        title: 'Comparing Address Waste: Classful vs CIDR Allocation for 300 Hosts',
        problemStatement:
          'An enterprise requires 300 usable host IP addresses. Compare the address allocation and efficiency under:\n1. Legacy Classful Architecture (1981)\n2. Modern CIDR Architecture (1993).',
        stepByStepSolution: [
          'Step 1 (Classful Evaluation):',
          '  Class C (/24) provides only 254 usable hosts (Too small for 300 hosts).',
          '  The enterprise MUST be assigned an entire Class B (/16).',
          '  Class B total addresses: 65,536 (65,534 usable).',
          '  Address Waste: 65,534 - 300 = 65,234 wasted IP addresses (99.54% waste).',
          'Step 2 (CIDR Evaluation):',
          '  Find smallest power of 2 >= 300 + 2: $2^9 = 512$.',
          '  Host bits H = 9. Prefix length = 32 - 9 = /23 (Subnet mask 255.255.254.0).',
          '  Usable hosts: $512 - 2 = 510$ usable IPs.',
          '  Address Waste: 510 - 300 = 210 addresses (58.8% efficiency vs 0.46% classful efficiency).',
        ],
        finalResult:
          'Classful required a Class B wasting 65,234 IPs. CIDR assigns a /23, conserving 65,024 public IP addresses.',
      },
      step10_realWorldScenario: {
        topology: 'Global Internet Core Routing Table Growth Crisis (1993)',
        scenarioText:
          'In 1993, the Internet was on the verge of total collapse because core router memory (TCAM) was exhausting rapidly from hundreds of thousands of individual Class C routes. The deployment of CIDR (RFC 1519) allowed Internet Service Providers to aggregate multiple contiguous Class C blocks into single supernet advertisements (e.g. summarizing sixteen /24 blocks into one /20 route), shrinking the global routing table by over 50% and extending the lifespan of IPv4 by decades.',
        engineeringContext:
          'CIDR supernetting and route summarization are mandatory in BGP and OSPF enterprise network design.',
      },
      step11_deviceBehavior: {
        hostBehavior:
          'Modern operating systems are 100% classless: they require both an IP address AND a CIDR subnet mask to define network boundaries.',
        nicBehavior: 'Processes 32-bit IP packets regardless of classful or classless prefix designation.',
        switchOrRouterBehavior:
          'Classless routing protocols (OSPF, EIGRP, BGP) transmit the explicit subnet mask prefix (/N) alongside every route advertisement in routing updates.',
      },
      step12_cliTooling: [
        {
          command: 'show ip route',
          description: 'Displays routing table showing classless CIDR prefix masks (/24, /27, /30) explicitly.',
          expectedOutput:
            'Gateway of last resort is 192.168.1.1 to network 0.0.0.0\nC    192.168.10.0/26 is directly connected, GigabitEthernet0/0\nC    192.168.10.64/27 is directly connected, GigabitEthernet0/1\nS    10.0.0.0/22 [1/0] via 172.16.1.1',
          proofExplanation:
            'Demonstrates modern classless routing with variable subnet masks (/26, /27, /22) operating simultaneously.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'Legacy routing protocol (e.g. RIPv1) summarizes subnets automatically to classful boundaries, causing routing loops.',
          possibleCauses: [
            'RIPv1 is a legacy classful protocol that does not transmit subnet masks in routing updates',
            'Subnets are summarized to /8, /16, or /24 automatically',
          ],
          diagnosticSteps: [
            'Check routing protocol version (`show ip protocols`).',
            'Observe whether discontiguous subnets are summarized to major class boundaries.',
          ],
          remediation: 'Migrate to modern classless routing protocols: OSPFv2, EIGRP, or BGPv4.',
        },
      ],
      step14_commonMistakes: [
        {
          misconception: 'Assuming that any IP address starting with 192 must have a 255.255.255.0 (/24) subnet mask.',
          correction:
            'Classful addressing is obsolete. In modern CIDR networking, a 192.x address can use ANY valid prefix length (/16, /22, /26, /30).',
        },
        {
          misconception: 'Believing CIDR created more 32-bit IP addresses.',
          correction:
            'CIDR did not increase the 4.3 billion limit of IPv4; it eliminated the massive waste of rigid Class A/B/C blocks, allowing existing space to be allocated efficiently.',
        },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'Route Hijacking via Disaggregated Prefix Injection',
        mitigationStrategy:
          'Enforce strict BGP prefix-length filtering and RPKI Route Origin Authorization to prevent malicious actors from advertising unauthorized specific CIDR subnets.',
      },
      step16_examPrep: {
        keyExamPoints: [
          'Class A: 1–126 (/8), Class B: 128–191 (/16), Class C: 192–223 (/24).',
          'Class D: 224–239 (Multicast), Class E: 240–255 (Experimental).',
          '127.0.0.0/8 is reserved for Loopback.',
          'CIDR (RFC 1519) abolished class boundaries and introduced slash notation (/N).',
        ],
        frequentTraps: [
          'Categorizing 127.x.x.x as Class A (it is reserved for loopback).',
          'Assuming classful boundaries apply to modern router configuration.',
        ],
      },
      step17_practicalLabRef: {
        title: 'Guided Practice: Classful Identification & CIDR Efficiency Comparison',
        scenario:
          'Audit legacy network documentation: identify first-octet classful boundaries, calculate historical address waste, and convert classful allocations to optimal CIDR prefixes.',
        tasks: [
          'Identify the legacy class (A, B, C, D, E) for five sample IP addresses based on first octet.',
          'Calculate address savings achieved by migrating from a Class B to a /23 CIDR prefix.',
        ],
        verificationMethod:
          'Verify calculated host capacities and CIDR prefix lengths in the terminal simulator.',
      },
      step18_masterySummary: {
        summaryPoints: [
          'Classful IPv4 (RFC 791) divided space into rigid Class A (/8), B (/16), and C (/24) blocks based on leading bits.',
          'Inflexibility caused massive address waste (allocating 65K hosts for 300 needed IPs) and routing table explosion.',
          'CIDR (RFC 1519, 1993) decoupled network prefixes from octet boundaries, introducing /N prefix lengths and route summarization.',
        ],
        nextLessonBridge:
          'Now that you understand CIDR prefix flexibility, proceed to Lesson 4 to learn how to design multi-department enterprise subnets using Variable Length Subnet Masking (VLSM).',
      },
    },
    questions: [
      {
        text: 'In legacy classful IPv4 addressing (RFC 791), what default subnet mask and host capacity were assigned to all Class B network blocks (first octet 128 to 191)?',
        options: [
          'Default Mask: 255.255.0.0 (/16) supporting 65,534 usable host IPs',
          'Default Mask: 255.0.0.0 (/8) supporting 16,777,214 usable host IPs',
          'Default Mask: 255.255.255.0 (/24) supporting 254 usable host IPs',
          'Default Mask: 255.255.255.240 (/28) supporting 14 usable host IPs',
        ],
        correctOption: 0,
        explanation: 'Class B addresses (128.0.0.0 to 191.255.255.255) had a default 16-bit network prefix (/16, 255.255.0.0) leaving 16 host bits ($2^{16} - 2 = 65,534$ usable host addresses).',
        explanationsJson: {
          1: '255.0.0.0 (/8) is the default mask for Class A networks.',
          2: '255.255.255.0 (/24) is the default mask for Class C networks.',
          3: '/28 is a modern classless CIDR subnet mask, not a legacy classful default.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Classful IPv4 Class B Architecture',
      },
      {
        text: 'What was the primary architectural crisis in the early 1990s that forced the IETF to replace Classful addressing with Classless Inter-Domain Routing (CIDR, RFC 1519)?',
        options: [
          'Rapid exhaustion of Class B address blocks and exponential explosion of the global Internet routing table due to rigid /8, /16, /24 allocation boundaries',
          'Ethernet switches were invented and could not process 32-bit IP addresses',
          'Classful addressing only worked on fiber optic cables and failed on copper wires',
          'The United States government mandated that all IP addresses must contain exactly 128 bits',
        ],
        correctOption: 0,
        explanation: 'Because Class C (/24, 254 hosts) was too small for most organizations, companies were allocated full Class B (/16, 65K hosts) blocks, wasting over 90% of allocated space and rapidly exhausting IPv4 space while bloating global routing tables.',
        explanationsJson: {
          1: 'Ethernet switches operate at Layer 2 (MAC addresses) and are agnostic to IP class structure.',
          2: 'Layer 3 IP operates independently of Layer 1 physical media.',
          3: '128-bit addresses describe IPv6, which was developed later (RFC 2460).',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'The Historical Necessity of CIDR',
      },
      {
        text: 'An organization in 1992 required 350 usable IP addresses. Under Classful rules, it was assigned an entire Class B block. How many IP addresses were wasted in this single allocation?',
        options: [
          '65,184 addresses (65,534 usable - 350 needed)',
          '254 addresses',
          '16,777,214 addresses',
          'Zero addresses were wasted',
        ],
        correctOption: 0,
        explanation: 'A Class B network contains 65,534 usable host addresses. Needing only 350 addresses means $65,534 - 350 = 65,184$ addresses were wasted (99.47% waste).',
        explanationsJson: {
          1: '254 is the capacity of one Class C network.',
          2: '16.7 million is the capacity of a Class A network.',
          3: 'Massive waste occurred because fractional Class B allocations were impossible under classful rules.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Classful Address Allocation Waste Calculation',
      },
      {
        text: 'How does modern Classless Inter-Domain Routing (CIDR) eliminate the address waste of the legacy Classful system?',
        options: [
          'CIDR decouples network boundaries from 8-bit octet boundaries, allowing arbitrary prefix lengths (/1 to /32) tailored to exact host requirements',
          'CIDR converts all IPv4 addresses into 48-bit MAC addresses',
          'CIDR forces all computers on the Internet to share a single public IP address',
          'CIDR eliminates the need for routers by using satellite broadcasts',
        ],
        correctOption: 0,
        explanation: 'CIDR allows network masks of any bit length (/22, /23, /27, /30), enabling network engineers to allocate exact subnet sizes (e.g. /23 for 500 hosts) and aggregate multiple routes into compact supernets.',
        explanationsJson: {
          1: 'CIDR is an IPv4 Layer 3 prefix scheme, not a Layer 2 MAC conversion.',
          2: 'Sharing a single public IP is NAT/PAT, not CIDR prefix notation.',
          3: 'Routers remain the core forwarding devices of CIDR internetworks.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'CIDR Prefix Decoupling Principle',
      },
    ],
    lab: {
      title: 'Guided Practice: Classful Identification & CIDR Efficiency Comparison',
      instructions:
        '1. Inspect IP routing table with `show ip route`.\n2. Identify classless CIDR prefix masks (/26, /27, /22).\n3. Compare address efficiency against legacy Class A/B/C defaults.',
      difficulty: CourseLevel.BEGINNER,
      estimatedMinutes: 15,
      initialTopologyJson: { routerName: 'Edge-R1', routes: ['192.168.10.0/26', '192.168.10.64/27', '10.0.0.0/22'] },
      tasks: [
        'Run `show ip route` to view CIDR prefix notations.',
        'Calculate address savings of /22 CIDR allocation vs Class B.',
      ],
    },
  },

  // =========================================================================
  // REWRITTEN LESSON 7: NET-202 / subnetting-cidr-overview
  // Topic: VLSM Design & Multi-Department Address Allocation
  // Replaced: Repetitive basic single-subnet block size drills.
  // Focus: Variable Length Subnet Masking (VLSM), hierarchical design,
  // multi-department exercise (60 hosts, 25 hosts, 10 hosts, /30 WAN links),
  // zero overlap guarantee.
  // =========================================================================
  {
    courseCode: 'NET-202',
    slug: 'subnetting-cidr-overview',
    title: 'VLSM Design & Multi-Department Address Allocation',
    type: LessonType.THEORY,
    durationMinutes: 30,
    order: 4,
    visualizationType: 'VLSM_DESIGNER_ENGINE',
    introduction:
      'Master Variable Length Subnet Masking (VLSM) and enterprise address space planning: learn the Golden Rule of VLSM allocation (largest to smallest), partition a single /24 address block across multiple departments (60 hosts, 25 hosts, 10 hosts, /30 WAN links), and mathematically prove zero address overlap.',
    stepMetadata: {
      step1_objective:
        'Master Variable Length Subnet Masking (VLSM) design methodology: systematically partition an assigned IP block across departments with differing host requirements, allocate subnets from largest to smallest, and guarantee zero address overlap.',
      step2_prerequisites: ['net-202-ipv4-addressing-cidr', 'ip-addressing-ipv4-overview', 'Calculating block sizes and usable hosts'],
      step3_whyItMatters:
        'In enterprise network engineering, using a fixed subnet mask (FLSM) everywhere wastes hundreds of IP addresses and breaks WAN links. VLSM allows an architect to assign a /26 to Engineering, a /27 to Sales, and a /30 to router serial links from the exact same address block with 100% precision.',
      step4_coreConcept:
        'Variable Length Subnet Masking (VLSM) is the practice of subnetting a subnet—applying different subnet mask lengths to different subnets within the same overall address space. The Cardinal Rule of VLSM Design is: ALWAYS SORT SUBNET REQUIREMENTS FROM LARGEST TO SMALLEST before assigning addresses. Allocating the largest subnets first prevents address fragmentation and guarantees that block boundaries align with mathematical power-of-2 multiples, preventing overlapping subnet ranges.',
      step5_technicalAnatomy: {
        title: 'VLSM Multi-Tier Enterprise Partitioning Architecture',
        description:
          'Subnetting base block 192.168.10.0/24 (256 total IP addresses) across four distinct department tiers.',
        components: [
          {
            name: 'Tier 1: Engineering Department (Requires 60 usable hosts)',
            detail: 'Needs block size >= 60 + 2 = 62. Smallest power of 2 is $2^6 = 64$ (6 host bits). Mask is 32 - 6 = /26 (255.255.255.192). Subnet: 192.168.10.0/26 (Usable: .1 to .62, Broadcast: .63).',
          },
          {
            name: 'Tier 2: Sales Department (Requires 25 usable hosts)',
            detail: 'Needs block size >= 25 + 2 = 27. Smallest power of 2 is $2^5 = 32$ (5 host bits). Mask is 32 - 5 = /27 (255.255.255.224). Subnet: 192.168.10.64/27 (Usable: .65 to .94, Broadcast: .95).',
          },
          {
            name: 'Tier 3: Executive Management (Requires 10 usable hosts)',
            detail: 'Needs block size >= 10 + 2 = 12. Smallest power of 2 is $2^4 = 16$ (4 host bits). Mask is 32 - 4 = /28 (255.255.255.240). Subnet: 192.168.10.96/28 (Usable: .97 to .110, Broadcast: .111).',
          },
          {
            name: 'Tier 4: Point-to-Point WAN Links (Requires 2 usable hosts each)',
            detail: 'Needs block size >= 2 + 2 = 4 ($2^2 = 4$). Mask is /30 (255.255.255.252). WAN 1: 192.168.10.112/30 (.113-.114, Bcast: .115). WAN 2: 192.168.10.116/30 (.117-.118, Bcast: .119).',
          },
          {
            name: 'Remaining Unallocated Space',
            detail: 'Unused space: 192.168.10.120/29 (8 IPs) and 192.168.10.128/25 (128 IPs) remain pristine for future corporate expansion.',
          },
        ],
      },
      step6_howItWorks: {
        steps: [
          {
            stepNumber: 1,
            title: 'Sort Requirements Largest to Smallest',
            action:
              'List all requirements in descending order: Engineering (60) -> Sales (25) -> Management (10) -> WAN-1 (2) -> WAN-2 (2).',
          },
          {
            stepNumber: 2,
            title: 'Allocate Subnet 1 (Engineering)',
            action:
              'Start at base IP `192.168.10.0`. Block size 64 -> Range `192.168.10.0/26` to `192.168.10.63`. Next available IP is `192.168.10.64`.',
          },
          {
            stepNumber: 3,
            title: 'Allocate Subnet 2 (Sales)',
            action:
              'Start at `192.168.10.64`. Block size 32 -> Range `192.168.10.64/27` to `192.168.10.95`. Next available IP is `192.168.10.96`.',
          },
          {
            stepNumber: 4,
            title: 'Allocate Subnet 3 (Management)',
            action:
              'Start at `192.168.10.96`. Block size 16 -> Range `192.168.10.96/28` to `192.168.10.111`. Next available IP is `192.168.10.112`.',
          },
          {
            stepNumber: 5,
            title: 'Allocate Point-to-Point WAN Links',
            action:
              'WAN-1: `192.168.10.112/30` (112-115). WAN-2: `192.168.10.116/30` (116-119).',
          },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'Enterprise VLSM Allocation & Zero-Overlap Proof Matrix',
        fields: [
          {
            fieldName: 'Engineering Subnet',
            bitLength: '/26 (62 Hosts)',
            hexSample: '192.168.10.0 - 192.168.10.63',
            description: 'Network: .0 | Hosts: .1 - .62 | Broadcast: .63',
          },
          {
            fieldName: 'Sales Subnet',
            bitLength: '/27 (30 Hosts)',
            hexSample: '192.168.10.64 - 192.168.10.95',
            description: 'Network: .64 | Hosts: .65 - .94 | Broadcast: .95',
          },
          {
            fieldName: 'Management Subnet',
            bitLength: '/28 (14 Hosts)',
            hexSample: '192.168.10.96 - 192.168.10.111',
            description: 'Network: .96 | Hosts: .97 - .110 | Broadcast: .111',
          },
          {
            fieldName: 'WAN Link 1',
            bitLength: '/30 (2 Hosts)',
            hexSample: '192.168.10.112 - 192.168.10.115',
            description: 'Network: .112 | Hosts: .113 - .114 | Broadcast: .115',
          },
          {
            fieldName: 'WAN Link 2',
            bitLength: '/30 (2 Hosts)',
            hexSample: '192.168.10.116 - 192.168.10.119',
            description: 'Network: .116 | Hosts: .117 - .118 | Broadcast: .119',
          },
        ],
        headerDiagramAscii: `
+-------------------------------------------------------------------------------+
|                192.168.10.0/24 COMPLETE VLSM PARTITIONING MAP                 |
+-------------------------------------------------------------------------------+
| [Engineering: /26]   | [Sales: /27] | [Mgmt: /28] | [WAN1:/30] | [WAN2:/30]   |
| 192.168.10.0 - .63   | .64 - .95    | .96 - .111  | .112-.115  | .116-.119    |
| (64 Total / 62 Usable)| (32 / 30)    | (16 / 14)   | (4 / 2)    | (4 / 2)      |
+----------------------+--------------+-------------+------------+--------------+
| [Unallocated Spare Space: 192.168.10.120/29 (8 IPs) & 192.168.10.128/25 (128 IPs)]    |
+-------------------------------------------------------------------------------+
`,
      },
      step8_visualExplanation: {
        type: 'VLSM_DESIGNER_ENGINE',
        title: 'Interactive VLSM Subnet Block Partitioning Engine',
        description:
          'Drag and allocate variable subnet blocks onto a base address space; dynamically verify that block boundaries align with power-of-2 rules and confirm zero address overlap.',
      },
      step9_workedExample: {
        title: 'Full Multi-Department VLSM Design Walkthrough',
        problemStatement:
          'Given base network block `192.168.10.0/24`, design a non-overlapping VLSM scheme for:\n- Engineering: 60 hosts\n- Sales: 25 hosts\n- Management: 10 hosts\n- WAN Link 1: 2 hosts\n- WAN Link 2: 2 hosts.',
        stepByStepSolution: [
          '1. Sort requirements: 60, 25, 10, 2, 2.',
          '2. Subnet 1 (60 hosts): Block size 64 -> `/26` (255.255.255.192). Network: `192.168.10.0/26`. Broadcast: `192.168.10.63`. Usable: `.1` to `.62`.',
          '3. Subnet 2 (25 hosts): Next start = `192.168.10.64`. Block size 32 -> `/27` (255.255.255.224). Network: `192.168.10.64/27`. Broadcast: `192.168.10.95`. Usable: `.65` to `.94`.',
          '4. Subnet 3 (10 hosts): Next start = `192.168.10.96`. Block size 16 -> `/28` (255.255.255.240). Network: `192.168.10.96/28`. Broadcast: `192.168.10.111`. Usable: `.97` to `.110`.',
          '5. Subnet 4 (WAN 1): Next start = `192.168.10.112`. Block size 4 -> `/30` (255.255.255.252). Network: `192.168.10.112/30`. Broadcast: `192.168.10.115`. Usable: `.113` to `.114`.',
          '6. Subnet 5 (WAN 2): Next start = `192.168.10.116`. Block size 4 -> `/30` (255.255.255.252). Network: `192.168.10.116/30`. Broadcast: `192.168.10.119`. Usable: `.117` to `.118`.',
          '7. Verification: Range .0-.63, .64-.95, .96-.111, .112-.115, .116-.119 are 100% contiguous with ZERO overlap.',
        ],
        finalResult:
          'Five non-overlapping subnets allocated from a single /24, leaving 136 IP addresses available for future growth.',
      },
      step10_realWorldScenario: {
        topology: 'Corporate Campus Multi-VLAN Subnet Assignment',
        scenarioText:
          'A network architect provisions a new regional office with VLAN 10 (Engineering), VLAN 20 (Sales), VLAN 30 (Management), and two router-to-firewall transit links. By applying VLSM, the entire campus operates out of a single `/24` private block without wasting separate `/24` networks for small 2-host transit links, simplifying the routing table and saving address space.',
        engineeringContext:
          'VLSM is the foundational design pattern for VLAN segmentation and router-on-a-stick sub-interface addressing.',
      },
      step11_deviceBehavior: {
        hostBehavior:
          'Each host interface uses its specific departmental subnet mask (e.g. Sales PCs use mask 255.255.255.224) to evaluate local vs remote destinations.',
        nicBehavior: 'Operates normally across any assigned CIDR prefix length.',
        switchOrRouterBehavior:
          'Router interfaces and sub-interfaces are configured with distinct subnet masks corresponding to each VLAN ID.',
      },
      step12_cliTooling: [
        {
          command: 'show ip interface brief',
          description: 'Displays router interfaces configured with variable-length subnet addresses.',
          expectedOutput:
            'Interface              IP-Address      OK? Method Status                Protocol\nGigabitEthernet0/0.10  192.168.10.1    YES manual up                    up\nGigabitEthernet0/0.20  192.168.10.65   YES manual up                    up\nGigabitEthernet0/0.30  192.168.10.97   YES manual up                    up\nSerial0/0/0            192.168.10.113  YES manual up                    up',
          proofExplanation:
            'Demonstrates default gateway IP assignment on router sub-interfaces matching the VLSM allocation plan.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'Router rejects IP configuration with error "% 192.168.10.64/26 overlaps with GigabitEthernet0/0".',
          possibleCauses: [
            'Administrator allocated subnets out of order, causing subnet boundaries to overlap',
            'Subnet block size does not begin on a valid mathematical multiple',
          ],
          diagnosticSteps: [
            'List all active interface IP ranges (Network ID through Broadcast ID).',
            'Check for overlapping IP ranges.',
            'Re-allocate starting from largest host requirement to smallest.',
          ],
          remediation:
            'Adjust the subnet starting address to align with the next valid block boundary.',
        },
      ],
      step14_commonMistakes: [
        {
          misconception: 'Allocating subnets in random order (e.g. small subnets before large subnets).',
          correction:
            'Allocating a small subnet first (e.g. a /30 at .1) fragments the block and makes it impossible to place a /26 (which MUST start at .0, .64, .128, or .192). Always allocate from largest to smallest.',
        },
        {
          misconception: 'Assigning a /30 subnet to a department with 4 computers.',
          correction:
            'A /30 provides 4 TOTAL IPs but only 2 USABLE host IPs ($4 - 2 = 2$). 4 computers require a /29 subnet ($2^3 - 2 = 6$ usable hosts).',
        },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'Inter-VLAN Unauthorized Lateral Movement',
        mitigationStrategy:
          'Applying distinct VLSM subnets per department enables stateful firewall access-lists (ACLs) to restrict sensitive subnets (e.g. Management /28) from general user access.',
      },
      step16_examPrep: {
        keyExamPoints: [
          'The Golden Rule of VLSM: Always sort host requirements from LARGEST to SMALLEST.',
          'Know host requirements to prefix mapping: 60 hosts -> /26; 25 hosts -> /27; 10 hosts -> /28; 2 hosts -> /30.',
          'Point-to-point links always use /30 (or /31 in modern RFC 3021 routing).',
        ],
        frequentTraps: [
          'Assigning the Network ID (.0, .64, .96) or Broadcast ID (.63, .95, .111) to a host interface.',
          'Forgetting that block size must always be a multiple of the subnet size.',
        ],
      },
      step17_practicalLabRef: {
        title: 'Guided Practice: Enterprise Multi-Department VLSM Address Allocation Workshop',
        scenario:
          'Design and apply a full VLSM allocation scheme for an enterprise branch from base block `192.168.10.0/24`: allocate subnets for 60, 25, 10, and 2 host requirements with zero overlap.',
        tasks: [
          'Calculate subnet masks, Network IDs, and Broadcast IDs for all 5 department tiers.',
          'Verify zero overlap between all assigned ranges.',
          'Configure router gateway IP addresses in the simulated topology.',
        ],
        verificationMethod:
          'Validate that all subnets achieve full gateway reachability with zero IP overlap errors.',
      },
      step18_masterySummary: {
        summaryPoints: [
          'VLSM applies varying subnet mask lengths (/26, /27, /28, /30) to subnets within the same overall address block.',
          'Always sort host requirements in descending order (largest to smallest) to ensure mathematical alignment and prevent fragmentation.',
          'A single /24 block easily accommodates multiple departments and WAN links while leaving clean unallocated space for future expansion.',
        ],
        nextLessonBridge:
          'With IPv4 subnetting and VLSM design fully mastered, proceed to NET-203 to learn about IPv6 Addressing Architecture and Stateless Address Autoconfiguration (SLAAC).',
      },
    },
    questions: [
      {
        text: 'What is the Cardinal Rule that must be followed when designing a Variable Length Subnet Masking (VLSM) address plan to prevent address fragmentation and overlapping subnets?',
        options: [
          'Always sort all departmental host requirements from LARGEST to SMALLEST before assigning subnet address blocks',
          'Always allocate small point-to-point /30 links first at the beginning of the address block',
          'Assign identical /24 subnet masks to every department regardless of host count',
          'Allocate addresses alphabetically based on department name',
        ],
        correctOption: 0,
        explanation: 'The fundamental rule of VLSM design is to allocate from largest host requirement to smallest. Larger subnets (e.g. /26) must align with larger power-of-2 boundaries (0, 64, 128, 192), which is only possible if smaller subnets do not fragment the space first.',
        explanationsJson: {
          1: 'Allocating small /30 links first fragments the space and prevents placing larger /26 or /27 subnets cleanly.',
          2: 'Assigning identical masks is FLSM (Fixed Length Subnet Masking), not VLSM.',
          3: 'Department names have no mathematical relation to binary block boundaries.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'The Cardinal Rule of VLSM Allocation',
      },
      {
        text: 'Given base network `192.168.10.0/24`, the Engineering department is assigned the first subnet `192.168.10.0/26` (62 usable hosts). What is the exact starting Network ID and Subnet Mask for the next department (Sales) which requires 25 usable hosts?',
        options: [
          'Network ID: 192.168.10.64 with Subnet Mask 255.255.255.224 (/27)',
          'Network ID: 192.168.10.63 with Subnet Mask 255.255.255.192 (/26)',
          'Network ID: 192.168.10.128 with Subnet Mask 255.255.255.240 (/28)',
          'Network ID: 192.168.10.32 with Subnet Mask 255.255.255.224 (/27)',
        ],
        correctOption: 0,
        explanation: 'Subnet 1 (`192.168.10.0/26`) has block size 64 and spans `.0` to `.63`. The next available address is `192.168.10.64`. For 25 hosts, we need block size 32 ($2^5 = 32$), which is prefix `/27` (mask 255.255.255.224). Range is `192.168.10.64/27` (.64 to .95).',
        explanationsJson: {
          1: '.63 is the broadcast address of the first subnet and cannot be a Network ID.',
          2: '.128 skips unallocated address space and /28 only supports 14 hosts (Sales needs 25).',
          3: '.32 falls inside the first /26 subnet (.0 to .63), creating a catastrophic address overlap.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'VLSM Subnet Block Progression',
      },
      {
        text: 'An enterprise network requires two point-to-point router WAN links requiring exactly 2 usable host IP addresses each. Which two non-overlapping subnets immediately follow `192.168.10.96/28` (.96 to .111)?',
        options: [
          'WAN Link 1: 192.168.10.112/30 and WAN Link 2: 192.168.10.116/30',
          'WAN Link 1: 192.168.10.111/30 and WAN Link 2: 192.168.10.115/30',
          'WAN Link 1: 192.168.10.128/30 and WAN Link 2: 192.168.10.132/30',
          'WAN Link 1: 192.168.10.112/29 and WAN Link 2: 192.168.10.120/29',
        ],
        correctOption: 0,
        explanation: 'The prior `/28` subnet ends at `.111`. The next available IP is `.112`. A /30 has block size 4: WAN 1 is `192.168.10.112/30` (.112-.115). WAN 2 begins at `.116`: `192.168.10.116/30` (.116-.119). Both are perfectly contiguous with zero overlap.',
        explanationsJson: {
          1: '.111 is the broadcast address of the prior subnet and cannot be used.',
          2: '.128 unnecessarily skips valid address space (.112 to .127).',
          3: '/29 subnets have block size 8 (6 usable hosts), wasting 4 addresses per link when /30 is optimal.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Point-to-Point /30 VLSM Allocation',
      },
      {
        text: 'A network administrator configures a host with IP `192.168.10.95/27` on the Sales subnet. The host is unable to communicate with any other workstation. What is the root cause of this failure?',
        options: [
          '`192.168.10.95` is the reserved Broadcast Address of the `192.168.10.64/27` subnet (block size 32, range .64 to .95) and cannot be assigned to an individual host',
          'A /27 subnet mask is invalid on Ethernet networks',
          'The host requires an optical transceiver to use IP addresses ending in 95',
          'The IP address belongs to the public Internet space',
        ],
        correctOption: 0,
        explanation: 'Subnet `192.168.10.64/27` has block size 32. The range is 192.168.10.64 (Network ID) through 192.168.10.95 (Broadcast ID). Usable host IPs are strictly .65 through .94. Assigning .95 assigns the broadcast address, which operating systems reject.',
        explanationsJson: {
          1: '/27 is a standard, valid subnet mask.',
          2: 'Physical transceivers have no relation to IP octet values.',
          3: '192.168.x.x is private RFC 1918 space, not public Internet.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
        questionType: QuestionType.TROUBLESHOOTING,
        concept: 'Broadcast Address Assignment Error in VLSM',
      },
    ],
    lab: {
      title: 'Guided Practice: Enterprise Multi-Department VLSM Address Allocation Workshop',
      instructions:
        '1. Inspect assigned base network block `192.168.10.0/24`.\n2. Allocate subnets for 60, 25, 10, and 2 host requirements.\n3. Configure default gateway IP addresses on router sub-interfaces and verify zero overlap.',
      difficulty: CourseLevel.BEGINNER,
      estimatedMinutes: 20,
      initialTopologyJson: {
        baseNetwork: '192.168.10.0/24',
        subnets: [
          { dept: 'Engineering', hostsNeeded: 60, allocatedPrefix: '/26' },
          { dept: 'Sales', hostsNeeded: 25, allocatedPrefix: '/27' },
          { dept: 'Management', hostsNeeded: 10, allocatedPrefix: '/28' },
          { dept: 'WAN-1', hostsNeeded: 2, allocatedPrefix: '/30' },
          { dept: 'WAN-2', hostsNeeded: 2, allocatedPrefix: '/30' },
        ],
      },
      tasks: [
        'Calculate Network IDs and broadcast addresses for all 5 subnets.',
        'Verify zero address overlap across the entire /24 range.',
      ],
    },
  },

  // =========================================================================
  // REWRITTEN LESSON 8: NET-203 / ipv6-foundations-overview
  // Topic: IPv6 Addressing Architecture, SLAAC & Dual-Stack Foundations
  // Replaced: Out-of-place rushed summary inside IPv4 services.
  // Focus: 128-bit structure, hex notation, RFC 5952 compression rules,
  // global unicast (2000::/3), link-local (fe80::/10), SLAAC (RS/RA, NDP),
  // duplicate address detection (DAD), dual-stack.
  // Prohibited: OSPFv3/BGPv6 dynamic routing.
  // =========================================================================
  {
    courseCode: 'NET-203',
    slug: 'ipv6-foundations-overview',
    title: 'IPv6 Addressing Architecture, SLAAC & Dual-Stack Foundations',
    type: LessonType.THEORY,
    durationMinutes: 30,
    order: 3,
    visualizationType: 'IPV6_COMPRESSOR_ENGINE',
    introduction:
      'Master the next-generation Internet Protocol (IPv6): 128-bit address structure, hexadecimal formatting, RFC 5952 compression rules, Global Unicast (GUA) vs Link-Local (LLA), Stateless Address Autoconfiguration (SLAAC via RS/RA and NDP), and Dual-Stack co-existence.',
    stepMetadata: {
      step1_objective:
        'Understand the 128-bit IPv6 address architecture: mastering hexadecimal representation, applying RFC 5952 canonical compression rules, differentiating Global Unicast and Link-Local address scopes, tracing SLAAC autoconfiguration (Router Solicitation and Router Advertisement), and understanding Dual-Stack coexistence.',
      step2_prerequisites: ['net-101-bits-bytes-binary-hex', 'net-202-ipv4-addressing-cidr', 'Understanding of MAC addresses and ICMP'],
      step3_whyItMatters:
        'IPv4 address exhaustion is a reality. Modern mobile networks, cloud providers, and global ISPs run native IPv6. Understanding IPv6 hexadecimal formatting, automatic Link-Local address generation (`fe80::`), and SLAAC autoconfiguration without DHCP is mandatory for modern network engineers.',
      step4_coreConcept:
        'IPv6 expands address space from 32 bits to 128 bits ($2^{128} \\approx 3.4 \\times 10^{38}$ addresses), ensuring an inexhaustible supply of IP addresses. An IPv6 address is written as eight 16-bit hexadecimal blocks (Hextets) separated by colons. Under RFC 5952 compression rules, leading zeros in any hextet are omitted, and a single contiguous run of all-zero hextets can be replaced by `::` (used at most once). IPv6 eliminates Layer 2 broadcast entirely in favor of targeted Multicast and introduces Stateless Address Autoconfiguration (SLAAC), allowing devices to automatically generate their own globally unique IP address from ICMPv6 Router Advertisements without requiring a DHCP server.',
      step5_technicalAnatomy: {
        title: 'IPv6 Address Structure, Scopes & Autoconfiguration Architecture',
        description:
          '128-bit address format (64-bit Network Prefix + 64-bit Interface ID) and core address scope classification.',
        components: [
          {
            name: '128-Bit Address Representation',
            detail: 'Written as 8 hextets of 4 hexadecimal characters each (e.g. `2001:0db8:85a3:0000:0000:8a2e:0370:7334`). Standard LAN subnet prefix is always `/64` (64 network bits + 64 host interface bits).',
          },
          {
            name: 'RFC 5952 Canonical Compression Rules',
            detail: '1. Omit leading zeros in each hextet (`:0042:` -> `:42:`, `:0000:` -> `:0:`). 2. Replace the single longest consecutive run of all-zero hextets with a double colon `::` (allowed only once per address). Example: `2001:0db8:0000:0000:0000:0000:0000:0001` -> `2001:db8::1`.',
          },
          {
            name: 'Global Unicast Address (GUA): 2000::/3',
            detail: 'Spans `2000::` to `3fff:ffff:...`. Globally unique and publicly routable across the Internet (equivalent to public IPv4 addresses).',
          },
          {
            name: 'Link-Local Address (LLA): fe80::/10',
            detail: 'Spans `fe80::/10` (typically `fe80::/64`). Automatically generated on every enabled interface. Strictly unroutable beyond the local physical link; used for Neighbor Discovery, router discovery, and next-hop routing.',
          },
          {
            name: 'Unique Local Address (ULA): fc00::/7 (fd00::/8)',
            detail: 'Private corporate routing within an enterprise. Equivalent to RFC 1918 private IPv4 addresses.',
          },
          {
            name: 'Special Addresses: Loopback (::1/128) & Multicast (ff00::/8)',
            detail: 'Loopback is `::1/128` (equivalent to 127.0.0.1). IPv6 has NO broadcast; all broadcast functions are replaced by Multicast (`ff02::1` = All Nodes, `ff02::2` = All Routers).',
          },
          {
            name: 'SLAAC & Neighbor Discovery Protocol (NDP)',
            detail: 'Host sends Router Solicitation (RS, ICMPv6 Type 133). Router replies with Router Advertisement (RA, ICMPv6 Type 134) announcing the /64 prefix. Host generates its 64-bit Interface ID and verifies uniqueness via Duplicate Address Detection (DAD).',
          },
          {
            name: 'Dual-Stack Strategy',
            detail: 'Running IPv4 and IPv6 protocol stacks simultaneously on the same router and host interfaces, enabling seamless transition without downtime.',
          },
        ],
      },
      step6_howItWorks: {
        steps: [
          {
            stepNumber: 1,
            title: 'Automatic Link-Local Generation',
            action:
              'As soon as an interface is enabled, the OS automatically creates a Link-Local address starting with `fe80::` paired with a 64-bit Interface ID (random or EUI-64 derived from MAC).',
          },
          {
            stepNumber: 2,
            title: 'Router Solicitation (RS)',
            action:
              'The client multicasts an ICMPv6 Router Solicitation (Type 133) packet to `ff02::2` (All Routers multicast group).',
          },
          {
            stepNumber: 3,
            title: 'Router Advertisement (RA)',
            action:
              'The local gateway router responds with an ICMPv6 Router Advertisement (Type 134) containing the `/64` global network prefix, default gateway address, and MTU.',
          },
          {
            stepNumber: 4,
            title: 'SLAAC Address Assembly & DAD',
            action:
              'The host combines the `/64` prefix with its own 64-bit Interface ID to form a complete GUA, then performs Duplicate Address Detection (DAD) via Neighbor Solicitation (Type 135) to ensure no conflict exists.',
          },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'IPv6 Fixed Header & ICMPv6 SLAAC Message Types',
        fields: [
          {
            fieldName: 'IPv6 Version / Traffic Class',
            bitLength: '32 bits (4 Bytes)',
            hexSample: '0x60000000',
            description: 'Fixed 40-byte base header (simplified vs IPv4 variable header).',
          },
          {
            fieldName: 'Source IPv6 Address',
            bitLength: '128 bits (16 Bytes)',
            hexSample: 'fe80::1a2b:3c4d:5e6f',
            description: 'Originating host Link-Local or Global Unicast address.',
          },
          {
            fieldName: 'Destination IPv6 Address',
            bitLength: '128 bits (16 Bytes)',
            hexSample: 'ff02::2 (All Routers)',
            description: 'Target address or ICMPv6 Multicast group.',
          },
          {
            fieldName: 'Next Header',
            bitLength: '8 bits (1 Byte)',
            hexSample: '58 (ICMPv6)',
            description: 'Protocol 58 denotes ICMPv6 (NDP / SLAAC / Ping).',
          },
        ],
        headerDiagramAscii: `
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|Version| Traffic Class |           Flow Label (20 bits)        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|         Payload Length        |  Next Header  |   Hop Limit   |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
+                                                               +
|                                                               |
+                    Source IPv6 Address (128 bits)             +
|                                                               |
+                                                               +
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
+                                                               +
|                                                               |
+                 Destination IPv6 Address (128 bits)           +
|                                                               |
+                                                               +
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
`,
      },
      step8_visualExplanation: {
        type: 'IPV6_COMPRESSOR_ENGINE',
        title: 'Interactive IPv6 RFC 5952 Compression & SLAAC Inspector',
        description:
          'Input any 128-bit IPv6 address to observe step-by-step leading zero removal and double colon `::` compression; inspect SLAAC Router Solicitation and Advertisement message exchanges.',
      },
      step9_workedExample: {
        title: 'Compressing IPv6 Addresses & Tracing SLAAC Autoconfiguration',
        problemStatement:
          '1. Apply RFC 5952 rules to compress: `2001:0db8:0000:0000:0042:0000:0000:0001`.\n2. A router advertises prefix `2001:db8:acad:1::/64`. If a client generates Interface ID `021a:2bff:fe3c:4d5e`, what full compressed Global Unicast Address is formed?',
        stepByStepSolution: [
          'Step 1 (Leading Zero Removal):',
          '  `2001:0db8:0000:0000:0042:0000:0000:0001` -> `2001:db8:0:0:42:0:0:1`.',
          'Step 2 (Double Colon `::` Selection):',
          '  There are two runs of two zero hextets (`:0:0:`). RFC 5952 states that if runs are of equal length, compress the FIRST run.',
          '  Result: `2001:db8::42:0:0:1`. (Note: `::` cannot be used twice!).',
          'Step 3 (SLAAC Assembly):',
          '  Prefix (64 bits): `2001:db8:acad:1::`',
          '  Interface ID (64 bits): `021a:2bff:fe3c:4d5e`',
          '  Combined GUA: `2001:db8:acad:1:21a:2bff:fe3c:4d5e`.',
        ],
        finalResult:
          'Compressed address 1: `2001:db8::42:0:0:1`. Formed SLAAC GUA: `2001:db8:acad:1:21a:2bff:fe3c:4d5e`.',
      },
      step10_realWorldScenario: {
        topology: 'Modern Enterprise Dual-Stack Deployment on 4G/5G Cellular & Fiber LAN',
        scenarioText:
          'A modern mobile device connects to a cellular carrier network. The carrier assigns a pure `/64` IPv6 prefix via SLAAC Router Advertisements and an internal IPv4 address via NAT64/DNS64. When the user visits `google.com` (which has both an IPv4 A record and an IPv6 AAAA record), the device automatically chooses IPv6 natively (Happy Eyeballs algorithm RFC 8305), bypassing carrier NAT completely.',
        engineeringContext:
          'Native IPv6 eliminates NAT processing delays, reduces router CPU overhead, and restores direct end-to-end peer connectivity.',
      },
      step11_deviceBehavior: {
        hostBehavior:
          'Every IPv6 host maintains multiple valid IPv6 addresses on a single NIC: at least one Link-Local (`fe80::`) and one or more Global Unicast (`2001::`) addresses.',
        nicBehavior:
          'Listens to Solicited-Node Multicast addresses (`ff02::1:ffxx:xxxx`) to respond to Neighbor Discovery probes.',
        switchOrRouterBehavior:
          'Routers periodically multicast ICMPv6 Router Advertisements (every 200 seconds) and immediately reply to any Router Solicitation.',
      },
      step12_cliTooling: [
        {
          command: 'ipconfig',
          description: 'Displays active IPv6 Global Unicast and Link-Local addresses on Windows.',
          expectedOutput:
            'Ethernet adapter Local Area Connection:\n  IPv6 Address. . . . . . . . . . . : 2001:db8:acad:1:a1b2:c3d4:e5f6:7890\n  Link-local IPv6 Address . . . . . : fe80::a1b2:c3d4:e5f6:7890%12\n  Default Gateway . . . . . . . . . : fe80::1%12',
          proofExplanation:
            'Shows a valid /64 Global Unicast Address (2001:db8:...) and a Link-Local address (fe80::...).',
        },
        {
          command: 'ping -6 ::1',
          description: 'Tests the internal IPv6 loopback protocol stack.',
          expectedOutput:
            'Pinging ::1 with 32 bytes of data:\nReply from ::1: time<1ms',
          proofExplanation: 'Proves the local OS IPv6 stack is active and operational.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'Host generates an IPv6 Link-Local address (`fe80::`) but never obtains a Global Unicast Address (`2001::`).',
          possibleCauses: [
            'Router interface is not configured with `ipv6 unicast-routing`',
            'Switchport security or firewall blocking ICMPv6 Router Advertisements (Type 134)',
            'No IPv6 address configured on the router gateway interface',
          ],
          diagnosticSteps: [
            'Verify `ipv6 unicast-routing` is enabled on the gateway router.',
            'Verify router interface has `ipv6 address 2001:db8:acad:1::1/64` configured.',
            'Check that client can ping router link-local address `ping fe80::1%interface`.',
          ],
          remediation:
            'Enable `ipv6 unicast-routing` globally on the gateway router so it begins transmitting ICMPv6 Router Advertisements.',
        },
      ],
      step14_commonMistakes: [
        {
          misconception: 'Using the double colon `::` more than once in an IPv6 address.',
          correction:
            'Using `::` twice (e.g. `2001::db8::1`) is strictly illegal because it creates mathematical ambiguity—routers cannot determine how many zero bits each `::` represents.',
        },
        {
          misconception: 'Thinking IPv6 requires ARP broadcasts to find MAC addresses.',
          correction:
            'IPv6 completely eliminated broadcast. It uses ICMPv6 Neighbor Discovery Protocol (NDP) with targeted Solicited-Node Multicast to resolve MAC addresses.',
        },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'Rogue Router Advertisements (Rogue RA Attack)',
        mitigationStrategy:
          'Enable IPv6 RA Guard on Layer 2 switchports to block unauthorized devices from broadcasting forged ICMPv6 Router Advertisements and hijacking default gateway traffic.',
      },
      step16_examPrep: {
        keyExamPoints: [
          'IPv6 addresses are 128 bits long (8 hextets of 4 hex characters).',
          'RFC 5952: Omit leading zeros; use `::` once for longest consecutive zero hextet run.',
          'Global Unicast: 2000::/3; Link-Local: fe80::/10; Unique Local: fc00::/7; Loopback: ::1/128.',
          'All Nodes multicast: ff02::1; All Routers multicast: ff02::2.',
          'SLAAC uses ICMPv6 RS (Type 133) and RA (Type 134).',
        ],
        frequentTraps: [
          'Using `::` twice in a single compressed address.',
          'Confusing Link-Local (`fe80::/10`) with Unique Local (`fc00::/7`).',
          'Looking for an ARP table in IPv6 (it is called the IPv6 Neighbor Table).',
        ],
      },
      step17_practicalLabRef: {
        title: 'Guided Practice: IPv6 Address Compression & SLAAC Autoconfiguration',
        scenario:
          'Practice compressing long IPv6 addresses according to RFC 5952, inspect active Link-Local addresses, and trace SLAAC Router Solicitation / Advertisement exchange.',
        tasks: [
          'Compress five full 128-bit IPv6 addresses applying RFC 5952 rules.',
          'Inspect host IPv6 addresses with `ipconfig`.',
          'Ping the IPv6 loopback address `::1`.',
        ],
        verificationMethod:
          'Validate that compressed address strings and loopback ping outputs match expected standards.',
      },
      step18_masterySummary: {
        summaryPoints: [
          'IPv6 provides $3.4 \\times 10^{38}$ 128-bit addresses written in 8 hexadecimal hextets.',
          'RFC 5952 standardizes compression: omit leading zeros and replace one run of zeros with `::`.',
          'Global Unicast (`2000::/3`) is public; Link-Local (`fe80::/10`) is mandatory for local link communication.',
          'SLAAC enables automatic client IP configuration via ICMPv6 Router Advertisements without DHCP.',
          'Dual-Stack allows IPv4 and IPv6 to run simultaneously during network modernization.',
        ],
        nextLessonBridge:
          'Now that you understand IPv6 fundamentals, proceed to explore Transport Layer Protocols (TCP & UDP) in NET-204.',
      },
    },
    questions: [
      {
        text: 'What are the two official abbreviation rules used to compress long IPv6 addresses according to RFC 5952?',
        options: [
          '1. Omit leading zeros in any 16-bit hextet; 2. Replace a single contiguous sequence of all-zero hextets with a double colon (::) exactly once in an address',
          '1. Delete all odd-numbered hextets; 2. Replace the first 64 bits with the letter X',
          '1. Convert hexadecimal characters A-F to numbers 1-6; 2. Remove all colons',
          '1. Convert IPv6 into IPv4 dotted-decimal format; 2. Append .0 at the end',
        ],
        correctOption: 0,
        explanation: 'RFC 5952 rules: 1. Leading zeros in any 4-digit hextet must be suppressed (e.g. `:0042:` -> `:42:`). 2. A single contiguous string of one or more all-zero hextets can be replaced by `::` (allowed only once to avoid ambiguity).',
        explanationsJson: {
          1: 'Deleting hextets corrupts the 128-bit address structure.',
          2: 'Hex characters A-F are valid Base-16 numerals (10-15) and cannot be replaced with 1-6.',
          3: 'IPv6 is a 128-bit protocol and cannot be compressed into 32-bit IPv4 notation.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'IPv6 Address Compression Rules',
      },
      {
        text: 'Compress the full 128-bit IPv6 address `2001:0db8:0000:0000:0000:0000:0000:0001` to its shortest valid standard representation:',
        options: [
          '2001:db8::1',
          '2001:db8:0:0:0:0:0:1',
          '2001:db8::0::1',
          '2001::db8::1',
        ],
        correctOption: 0,
        explanation: 'Leading zeros in `0db8` are removed -> `db8`. The five consecutive all-zero hextets `0000:0000:0000:0000:0000` are replaced with `::`. The final hextet `0001` becomes `1`. Final result: `2001:db8::1`.',
        explanationsJson: {
          1: '2001:db8:0:0:0:0:0:1 leaves zero hextets uncompressed instead of applying `::`.',
          2: 'Using `::` twice in an address is strictly illegal because it creates ambiguity in how many zero bits each `::` represents.',
          3: 'Double colon cannot appear twice in any IPv6 address.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'IPv6 Compression Application',
      },
      {
        text: 'What is the prefix and scope of an IPv6 Link-Local address automatically configured on every enabled interface?',
        options: [
          '`fe80::/10` (FE80 to FEBF); valid and routable only on the local physical link/broadcast domain',
          '`2000::/3`; globally routable across the public Internet',
          '`ff00::/8`; reserved for IPv6 broadcast traffic',
          '`::1/128`; reserved for external DNS root resolution',
        ],
        correctOption: 0,
        explanation: 'IPv6 Link-Local addresses start with `fe80::/10` (typically `fe80::/64`). They are non-routable beyond the local link and are used for neighbor discovery (NDP), router advertisements, and local communication.',
        explanationsJson: {
          1: '2000::/3 is the Global Unicast Address (GUA) range routable across the Internet.',
          2: 'ff00::/8 is the IPv6 Multicast range (IPv6 eliminated broadcast entirely).',
          3: '::1/128 is the IPv6 Loopback address (equivalent to 127.0.0.1).',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'IPv6 Link-Local Addressing (fe80::)',
      },
      {
        text: 'How does Stateless Address Autoconfiguration (SLAAC) allow an IPv6 client to configure a complete Global Unicast IP address without contacting a DHCPv6 server?',
        options: [
          'The client listens to ICMPv6 Router Advertisements (RA) to learn the /64 network prefix and default gateway, then appends its own 64-bit Interface ID',
          'The client downloads an address from the public Google DNS root server',
          'The client converts its IPv4 address into hexadecimal and adds fe80:: at the front',
          'The switch port hardcodes an IP address into the client EEPROM memory',
        ],
        correctOption: 0,
        explanation: 'In SLAAC, the local router multicasts ICMPv6 Router Advertisements (Type 134) announcing the /64 prefix. The client combines this network prefix with its own 64-bit Interface ID to form a valid, unique Global Unicast Address.',
        explanationsJson: {
          1: 'DNS resolves domain names to IPs; it does not assign IP addresses to network interfaces.',
          2: 'IPv6 addresses are independent 128-bit numbers, not simple hex conversions of IPv4.',
          3: 'Switch ports do not program host EEPROM chips.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'SLAAC Autoconfiguration Mechanics',
      },
      {
        text: 'What is the primary operational definition of a Dual-Stack network transition strategy?',
        options: [
          'Network interfaces and routers concurrently run both IPv4 and IPv6 protocol stacks simultaneously, allowing native communication with both address types',
          'Every computer is required to have two physical network interface cards installed',
          'All IPv4 packets are translated into ATM cells before transmission',
          'IPv6 is only active during weekends while IPv4 runs during business hours',
        ],
        correctOption: 0,
        explanation: 'Dual-stack is the recommended IPv6 transition mechanism where network devices and operating systems run IPv4 and IPv6 concurrently on the same physical interfaces, enabling seamless communication with both networks.',
        explanationsJson: {
          1: 'A single physical NIC carries both IPv4 and IPv6 packets concurrently.',
          2: 'ATM is an obsolete Layer 2 cell relay technology unrelated to dual-stack.',
          3: 'Dual-stack operates continuously 24/7.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Dual-Stack Coexistence Architecture',
      },
    ],
    lab: {
      title: 'Guided Practice: IPv6 Address Compression & SLAAC Autoconfiguration',
      instructions:
        '1. Practice compressing 128-bit IPv6 addresses applying RFC 5952 rules.\n2. Inspect Link-Local (`fe80::`) and Global Unicast (`2001::`) addresses.\n3. Verify IPv6 loopback stack health using `ping -6 ::1`.',
      difficulty: CourseLevel.BEGINNER,
      estimatedMinutes: 20,
      initialTopologyJson: {
        hostName: 'Client-1',
        ipv6Gua: '2001:db8:acad:1:21a:2bff:fe3c:4d5e',
        ipv6Lla: 'fe80::21a:2bff:fe3c:4d5e',
        gatewayLla: 'fe80::1',
      },
      tasks: [
        'Compress `2001:0db8:0000:0000:0042:0000:0000:0001` applying RFC 5952 rules.',
        'Run `ipconfig` to view active IPv6 addresses.',
        'Ping `::1` to verify internal IPv6 protocol stack.',
      ],
    },
  },

  // =========================================================================
  // BENCHMARK LESSON 9: NET-302 (Spanning Tree Protocol & Loop Prevention)
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
        'Unlike Layer-3 IPv4 packets which have a Time-To-Live (TTL) header field to terminate routing loops, Ethernet Layer-2 frames have NO TTL field. A single broadcast frame (e.g. ARP request) inside a redundant multi-switch loop will circulate infinitely, causing exponential frame amplification (Broadcast Storm), CPU saturation (100%), and complete network outage within seconds.',
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
        nodesOrFrames: [
          { node: 'SW-B', role: 'ROOT_BRIDGE', priority: 4096, mac: '00:1A:2B:3C:4D:02' },
          { node: 'SW-A', role: 'NON_ROOT', rootPort: 'Gi0/1', designatedPort: 'Gi0/2' },
          { node: 'SW-C', role: 'NON_ROOT', rootPort: 'Gi0/2', blockedPort: 'Gi0/1' },
        ],
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
        {
          command: 'spanning-tree vlan 1 priority 4096',
          description: 'Statically sets the local Bridge Priority for VLAN 1 to 4096, guaranteeing Root Bridge election.',
          expectedOutput: 'Switch(config)# spanning-tree vlan 1 priority 4096',
          proofExplanation:
            'Priority values must be configured in multiples of 4096 (0, 4096, 8192, 12288, 16384, 20480, 24576, 28672, 32768, 36864, 40960, 45056, 49152, 53248, 57344, 61440).',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'Complete LAN slowdown, 100% switch CPU utilization, blinking link LEDs across all switchports.',
          possibleCauses: [
            'Layer 2 loop caused by unmanaged desktop switch looped back onto itself',
            'STP disabled on one or more trunk links',
            'BPDU Filter enabled on a trunk link, suppressing BPDU transmission',
          ],
          diagnosticSteps: [
            'Execute `show spanning-tree summary` to verify STP is actively running on all VLANs.',
            'Execute `show interfaces counters errors` to check for massive broadcast frame counts.',
            'Locate ports with flapping MAC address tables via `show mac address-table dynamic`.',
          ],
          remediation:
            'Remove physical redundant patch cable, ensure `spanning-tree bpduguard enable` is applied on all access ports, and never configure `bpdufilter` on switch-to-switch links.',
        },
      ],
      step14_commonMistakes: [
        {
          misconception: 'Leaving all switches at default Bridge Priority 32768 is fine in production.',
          correction:
            'If all switches use 32768, the oldest switch with the lowest random MAC address will become the Root Bridge, routing all enterprise traffic through an underpowered access switch. Always explicitly set Core switches to Priority 4096.',
        },
        {
          misconception: 'Configuring PortFast on trunk links connecting other switches increases speed.',
          correction:
            'PortFast disables initial loop-detection listening states. Enabling it on switch-to-switch trunk links will cause immediate, catastrophic broadcast storms upon connection.',
        },
      ],
      step15_securityPerspective: {
        threatOrVulnerability:
          'STP Root Hijacking Attack: An attacker connects a laptop running Yersinia or Scapy, transmitting forged BPDUs with Priority 0 and MAC 00:00:00:00:00:01 to hijack the Root Bridge role.',
        mitigationStrategy:
          'Configure `spanning-tree guard root` on distribution-to-access downlink ports and enable `spanning-tree bpduguard enable` on all access edge ports.',
      },
      step16_examPrep: {
        keyExamPoints: [
          'Bridge Priority default is 32768; values must be configured in multiples of 4096.',
          'Lowest Bridge ID wins Root Bridge election.',
          'Root Bridge has NO Root Ports; all active ports on the Root Bridge are Designated Ports.',
          'Path Cost standards: 10G = 2, 1G = 4, 100M = 19, 10M = 100.',
          'RSTP 802.1w Port States: Discarding, Learning, Forwarding.',
        ],
        frequentTraps: [
          'Do not confuse Root Port (one per non-root switch) with Designated Port (one per segment).',
          'Remember that lower numbers always win in STP (lower priority, lower cost, lower MAC).',
        ],
      },
      step17_practicalLabRef: {
        title: 'Guided Practice: Enterprise Layer-2 Redundant Topology Loop Prevention & STP Reconvergence',
        scenario:
          'A multi-switch campus network has three interconnected switches. The administrator must verify Root Bridge election, identify blocked loop ports, configure root bridge priority, and verify automatic failover.',
        tasks: [
          'Inspect Bridge IDs and port roles using `show spanning-tree`.',
          'Identify the Root Bridge and explain why port Gi0/1 on SW-C is blocked.',
          'Configure SW-A as Primary Root using `spanning-tree vlan 1 priority 4096`.',
          'Disconnect the active link between SW-A and SW-B to observe STP reconvergence.',
        ],
        verificationMethod:
          'Verify `show spanning-tree` output confirms new Root Bridge ID and transition of the alternate port to Forwarding state.',
      },
      step18_masterySummary: {
        summaryPoints: [
          'Ethernet lacks TTL, making Layer-2 loop prevention mandatory.',
          'STP elects a single Root Bridge per broadcast domain using the lowest numeric Bridge ID.',
          'Non-root switches elect one Root Port with the lowest path cost to the root.',
          'Each segment elects one Designated Port; all remaining redundant ports are blocked.',
          'BPDU Guard and Root Guard protect the spanning tree topology from rogue devices.',
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
          'Layer-2 frames are encrypted by default, preventing switches from inspecting packet boundaries',
          'STP only operates on fiber optic media and cannot inspect copper Ethernet cables',
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
      {
        text: 'Two switches SW-1 (Priority: 32768, MAC: 00:11:22:33:44:55) and SW-2 (Priority: 4096, MAC: AA:BB:CC:DD:EE:FF) are connected together. Which switch is elected Root Bridge and why?',
        options: [
          'SW-2, because its Bridge Priority (4096) is numerically lower than SW-1 (32768), and priority is evaluated before MAC address',
          'SW-1, because its MAC address starts with 00 which is lower than AA',
          'SW-1, because 32768 is the standard default priority',
          'Both switches become Root Bridges in a split-brain condition',
        ],
        correctOption: 0,
        explanation: 'In STP Root Bridge elections, the switch with the lowest numeric Bridge Priority wins. MAC address is only evaluated as a tie-breaker when priorities are identical.',
        explanationsJson: {
          1: 'MAC address is only compared if Bridge Priorities are equal.',
          2: 'Default priority 32768 loses to the manually lowered priority 4096.',
          3: 'STP strictly elects exactly one Root Bridge per broadcast domain / VLAN.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Root Bridge Election Criteria',
      },
      {
        text: 'What is the correct tie-breaker hierarchy used by a non-root switch when electing a Root Port (RP)?',
        options: [
          '1. Lowest Root Path Cost -> 2. Lowest Sender Bridge ID -> 3. Lowest Sender Port ID',
          '1. Highest Port Speed -> 2. Lowest Port Number -> 3. Highest MAC Address',
          '1. Lowest Sender Port ID -> 2. Lowest Root Path Cost -> 3. Switch Uptime',
          '1. Random selection -> 2. Neighbor Switch Priority',
        ],
        correctOption: 0,
        explanation: 'Root Port selection follows strict deterministic tie-breakers: (1) Lowest cumulative root path cost, (2) Lowest sender Bridge ID (neighbor BID), (3) Lowest sender Port ID (Priority.PortNumber).',
        explanationsJson: {
          1: 'Port speed is encapsulated inside the path cost, but neighbor BID is the formal second tie-breaker.',
          2: 'Root path cost is always the primary criterion, not sender port ID.',
          3: 'STP is completely deterministic and never uses random selection.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'STP Root Port Tie-Breakers',
      },
      {
        text: '[TROUBLESHOOTING] An administrator connects a Rogue Unmanaged Switch to an access port configured with `spanning-tree portfast` and `spanning-tree bpduguard enable`. What immediately happens when the rogue switch sends a BPDU?',
        options: [
          'BPDU Guard triggers, immediately placing the switch port into the `err-disabled` state and shutting down the link to prevent unauthorized topology manipulation',
          'The rogue switch becomes Root Bridge and takes over network traffic',
          'The port drops only the BPDU frame but continues forwarding user packets',
          'The core switch reboots to clear its MAC address table',
        ],
        correctOption: 0,
        explanation: 'BPDU Guard is a critical security feature designed for edge access ports. If any BPDU is received on a BPDU Guard-enabled port, the switch immediately disables the port (err-disabled) to protect the spanning tree topology.',
        explanationsJson: {
          1: 'BPDU Guard specifically prevents rogue switches from claiming Root Bridge status.',
          2: 'BPDU Guard disables the entire port, rather than silently dropping individual frames.',
          3: 'Switches do not reboot upon receiving unexpected BPDUs.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'BPDU Guard & Edge Port Protection',
      },
      {
        text: 'What is the primary operational advantage of Rapid Spanning Tree Protocol (RSTP IEEE 802.1w) over legacy 802.1D STP?',
        options: [
          'RSTP uses an explicit Proposal/Agreement handshake mechanism, achieving sub-second (< 1s) reconvergence instead of 802.1D standard 30-50 second timer delays',
          'RSTP increases maximum link bandwidth from 1 Gbps to 100 Gbps',
          'RSTP replaces Layer 2 switching with Layer 3 IP routing',
          'RSTP eliminates the need for a Root Bridge election',
        ],
        correctOption: 0,
        explanation: 'Legacy 802.1D requires listening (15s) and learning (15s) timer delays. 802.1w RSTP introduces point-to-point synchronization handshakes that unblock ports in milliseconds.',
        explanationsJson: {
          1: 'STP/RSTP manage logical topology states, not physical PHY link speeds.',
          2: 'RSTP remains an Ethernet Layer-2 loop-prevention protocol.',
          3: 'RSTP still uses Root Bridge elections and Bridge IDs.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'RSTP Convergence Optimization',
      },
    ],
    lab: {
      title: 'Guided Practice: Enterprise Layer-2 Redundant Topology Loop Prevention & STP Reconvergence',
      instructions:
        '1. Inspect the 3-switch redundant ring topology.\n2. Execute `show spanning-tree` to identify the Root Bridge and verify port roles.\n3. Configure primary root bridge priority: `spanning-tree vlan 1 priority 4096`.\n4. Simulate link failure and observe STP reconvergence.',
      difficulty: CourseLevel.INTERMEDIATE,
      estimatedMinutes: 20,
      initialTopologyJson: {
        switches: [
          { id: 'SW-A', priority: 32768, mac: '00:1A:2B:3C:4D:01' },
          { id: 'SW-B', priority: 4096, mac: '00:1A:2B:3C:4D:02', isRoot: true },
          { id: 'SW-C', priority: 32768, mac: '00:1A:2B:3C:4D:03', blockedPort: 'Gi0/1' },
        ],
      },
      tasks: [
        'Execute `show spanning-tree` to inspect Bridge IDs and port roles.',
        'Identify which port is in the BLK state and explain why.',
        'Simulate link failure between SW-B and SW-C and verify reconvergence.',
      ],
    },
  },

  // =========================================================================
  // BENCHMARK LESSON 10: NET-304 (Single-Area OSPF & Link-State Routing)
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
        'Understand how OSPF link-state routing protocols construct identical Link-State Databases (LSDBs) across an autonomous system, how Dijkstra’s Shortest Path First (SPF) algorithm computes loop-free routes, and how 7-state neighbor finite state machines (FSM) establish robust dynamic adjacencies.',
      step2_prerequisites: [
        'NET-202: IPv4 Addressing & CIDR Subnetting Mastery',
        'NET-204: Transport Layer Protocols (TCP & UDP)',
        'NET-303: IP Routing & Static Route Administration',
      ],
      step3_whyItMatters:
        'Static routing requires manual administrative updates whenever network topology changes occur, creating high administrative overhead and severe vulnerability to single points of failure. OSPF automatically detects link state transitions within milliseconds, floods Type-1 Router LSAs to all neighbors, and executes Dijkstra’s algorithm to calculate alternate loop-free paths with zero human intervention.',
      step4_coreConcept:
        'OSPF (Open Shortest Path First) is an Interior Gateway Protocol (IGP) based on Link-State technology. Instead of routing by rumor like Distance-Vector protocols (RIP), every OSPF router maintains a complete, identical map of the entire network topology in its Link-State Database (LSDB) and independently calculates the shortest path tree to all subnets using Dijkstra’s algorithm.',
      step5_technicalAnatomy: {
        title: 'OSPF Core Architectural Components',
        description:
          'OSPF operates directly over IP (Protocol Number 89) without relying on TCP or UDP. It structures networks hierarchically around Area 0 (Backbone Area) and selects unique 32-bit Router IDs (RIDs) to identify participating nodes.',
        components: [
          {
            name: 'Router ID (RID)',
            detail: 'A 32-bit identifier in dotted-decimal format. Determined by: (1) manual `router-id` command, (2) highest active Loopback IP, or (3) highest active physical interface IP.',
          },
          {
            name: 'Area 0 (Backbone)',
            detail: 'The central transit area (0.0.0.0) through which all inter-area routing traffic must pass in multi-area topologies.',
          },
          {
            name: 'Designated Router (DR) & BDR',
            detail: 'Elected on multi-access Ethernet segments (Highest OSPF Priority 0–255, then highest RID) to minimize adjacency meshes from n*(n-1)/2 to n.',
          },
          {
            name: 'Metric Cost Formula',
            detail: 'Cost = Reference Bandwidth / Interface Bandwidth (Default Reference: 100 Mbps; 100M=Cost 1, 10M=Cost 10; configurable via `auto-cost reference-bandwidth`).',
          },
        ],
      },
      step6_howItWorks: {
        steps: [
          {
            stepNumber: 1,
            title: 'Neighbor Discovery via Hello Packets',
            action:
              'Routers send Hello multicasts to 224.0.0.5 (AllSPFRouters) every 10 seconds. When a router sees its own RID in a neighbor’s Hello, bidirectional communication (2-WAY state) is established.',
          },
          {
            stepNumber: 2,
            title: 'DR/BDR Election on Multi-Access Segments',
            action:
              'On broadcast networks, routers elect a Designated Router (DR) and Backup Designated Router (BDR). Non-DR routers (DROTHERs) form full adjacencies only with the DR and BDR.',
          },
          {
            stepNumber: 3,
            title: 'Database Description (DBD) & Master/Slave Negotiation',
            action:
              'In ExStart state, routers negotiate master/slave roles using highest RID. In Exchange state, routers exchange DBD packets summarizing their local LSDBs.',
          },
          {
            stepNumber: 4,
            title: 'Loading & Synchronization (LSR / LSU / LSAck)',
            action:
              'Routers request missing or outdated LSAs using Link-State Requests (LSR) and receive Link-State Updates (LSU), acknowledged by LSAck, reaching FULL state.',
          },
          {
            stepNumber: 5,
            title: 'Dijkstra SPF Tree & Routing Table Installation',
            action:
              'Each router places itself as the root of the shortest path tree, computes cumulative costs to each destination subnet, and installs optimal routes into the IP routing table.',
          },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'OSPFv2 Common Packet Header (24 Bytes) & Hello Payload',
        fields: [
          {
            fieldName: 'Version #',
            bitLength: '8 bits (1 Byte)',
            hexSample: '0x02',
            description: 'OSPF Version 2 (IPv4) or Version 3 (IPv6).',
          },
          {
            fieldName: 'Type',
            bitLength: '8 bits (1 Byte)',
            hexSample: '0x01',
            description: '1=Hello, 2=DBD, 3=Link-State Request, 4=Link-State Update, 5=Link-State Ack.',
          },
          {
            fieldName: 'Packet Length',
            bitLength: '16 bits (2 Bytes)',
            hexSample: '0x002C',
            description: 'Total length of OSPF packet including standard header.',
          },
          {
            fieldName: 'Router ID',
            bitLength: '32 bits (4 Bytes)',
            hexSample: '0x01010101',
            description: 'Originating router 32-bit ID (e.g. 1.1.1.1).',
          },
          {
            fieldName: 'Area ID',
            bitLength: '32 bits (4 Bytes)',
            hexSample: '0x00000000',
            description: 'Area identifier (0.0.0.0 for Backbone Area 0).',
          },
        ],
        headerDiagramAscii: `
+-------------------------------------------------------------------------------+
|                      OSPFv2 PACKET HEADER STRUCTURE                           |
+-------------------------------------------------------------------------------+
| Version: 2 (IPv4)  | Type: 1 (Hello) / 2 (DBD) / 4 (LSU) | Packet Length: 44 B |
| Router ID: 32-bit originating router identifier (e.g. 1.1.1.1)                |
| Area ID: 32-bit area identifier (0.0.0.0 for Backbone Area 0)                 |
| Checksum: 16-bit error check | Auth Type: 0 (Null) / 1 (Simple) / 2 (MD5/SHA) |
+-------------------------------------------------------------------------------+
`,
      },
      step8_visualExplanation: {
        type: 'OSPF_TOPOLOGY_SIMULATION',
        title: '3-Router Multi-Access OSPF Adjacency & Dijkstra Tree',
        description:
          'In a 3-router topology (R1: 1.1.1.1, R2: 2.2.2.2 [DR], R3: 3.3.3.3 [BDR]), routers multicast Hellos to 224.0.0.5, synchronize their LSDBs to the FULL state, and compute shortest paths. If the primary link between R1 and R2 fails, R1 instantly recalculates its route through R3 with zero loops.',
        nodesOrFrames: [
          { node: 'R1', routerId: '1.1.1.1', priority: 1, role: 'DROTHER' },
          { node: 'R2', routerId: '2.2.2.2', priority: 255, role: 'DR' },
          { node: 'R3', routerId: '3.3.3.3', priority: 128, role: 'BDR' },
        ],
      },
      step9_workedExample: {
        title: 'Calculating Shortest Path First (SPF) Cost from R1 across a Redundant Topology',
        problemStatement:
          'Router R1 connects to R2 (Cost 10) and R3 (Cost 10). R2 connects to R3 (Cost 5). R2 connects to Destination Subnet 192.168.50.0/24 (Cost 1). Determine: (1) R1 path to 192.168.50.0/24 under normal conditions, (2) R1 path cost if link R1-R2 fails.',
        stepByStepSolution: [
          'Step 1: Evaluate Path A (Direct via R2): Cost(R1->R2) = 10, Cost(R2->Subnet) = 1. Total Cost = 10 + 1 = 11.',
          'Step 2: Evaluate Path B (Indirect via R3): Cost(R1->R3) = 10, Cost(R3->R2) = 5, Cost(R2->Subnet) = 1. Total Cost = 10 + 5 + 1 = 16.',
          'Step 3: Compare costs: 11 < 16. R1 chooses Path A (Direct via R2) with Metric 11 and Next-Hop R2.',
          'Step 4: Link Failure Scenario: Link R1-R2 fails. R1 detects loss of neighbor adjacency, runs Dijkstra SPF, and installs Path B via R3 with Metric 16.',
        ],
        finalResult: 'Normal: Path via R2 (Cost 11). Post-Failover: Path via R3 (Cost 16).',
      },
      step10_realWorldScenario: {
        topology: 'Dual-Homed Enterprise Campus Core & Distribution Routing',
        scenarioText:
          'A fiber cut severs the primary 10 Gbps uplink between HQ Access Router and Data Center Core Router A. Within 40 milliseconds, OSPF detects interface down, floods Type-1 LSAs to Core Router B, and reconverges data plane traffic across the redundant link with zero packet loss for active VoIP calls.',
        engineeringContext:
          'Always configure `auto-cost reference-bandwidth 100000` (100 Gbps) on modern Gigabit and 10-Gigabit networks so OSPF assigns differentiated metrics (1G=100, 10G=10, 100G=1) rather than treating all links >= 100 Mbps as Cost 1.',
      },
      step11_deviceBehavior: {
        hostBehavior:
          'End-user client computers do not speak OSPF. Edge ports connected to end devices should be configured with `passive-interface` to stop sending OSPF Hello multicasts onto user subnets.',
        nicBehavior:
          'Receives multicast frames destined for 01:00:5E:00:00:05 (224.0.0.5) and 01:00:5E:00:00:06 (224.0.0.6) and passes them to the OSPF routing daemon.',
        switchOrRouterBehavior:
          'Router runs OSPF daemon, maintains neighbor state table, periodically flushes/refreshes LSAs every 30 minutes, and re-executes Dijkstra SPF algorithm upon receiving any new LSA sequence number.',
      },
      step12_cliTooling: [
        {
          command: 'show ip ospf neighbor',
          description: 'Displays all formed neighbor adjacencies, neighbor Router IDs, current state (FULL/DR, FULL/BDR), dead timer, and interface.',
          expectedOutput:
            'Neighbor ID     Pri   State           Dead Time   Address         Interface\n2.2.2.2           1   FULL/DR         00:00:34    10.0.12.2       GigabitEthernet0/1\n3.3.3.3         128   FULL/BDR        00:00:36    10.0.13.3       GigabitEthernet0/2',
          proofExplanation:
            'Confirms that full two-way database synchronization is active with both neighbor routers.',
        },
        {
          command: 'show ip ospf database',
          description: 'Dumps the local Link-State Database (LSDB), listing all Type-1 Router LSAs, Type-2 Network LSAs, and advertising Router IDs.',
          expectedOutput:
            '            OSPF Router with ID (1.1.1.1) (Process ID 1)\n\n                Router Link States (Area 0)\nLink ID         ADV Router      Age         Seq#       Checksum Link count\n1.1.1.1         1.1.1.1         342         0x80000004 0x004F2A 2\n2.2.2.2         2.2.2.2         315         0x80000006 0x008C1B 2\n3.3.3.3         3.3.3.3         290         0x80000005 0x002A7E 2',
          proofExplanation:
            'Shows that all three routers have advertised their Type-1 Router LSAs and the database is completely synchronized across Area 0.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'OSPF neighbor relationship is stuck in `EXSTART` or `EXCHANGE` state and never reaches `FULL`.',
          possibleCauses: [
            'Maximum Transmission Unit (MTU) mismatch between the two connecting router interfaces',
            'Unicast fragmentation dropped by intermediate firewall',
          ],
          diagnosticSteps: [
            'Execute `show interfaces GigabitEthernet0/1 | include MTU` on both sides of the link.',
            'Check for MTU disparity (e.g., 1500 bytes vs 1492 bytes).',
          ],
          remediation:
            'Align MTU values to match on both interface endpoints (e.g. `ip mtu 1500`).',
        },
      ],
      step14_commonMistakes: [
        {
          misconception: 'Configuring mismatched Hello or Dead timers on connecting neighbors.',
          correction:
            'OSPF strictly requires Hello (default 10s) and Dead (default 40s) timers to match exactly in the Hello packet payload, or the adjacency will never progress beyond INIT.',
        },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'Rogue OSPF Router Injection & LSA Poisoning',
        mitigationStrategy:
          'Configure OSPF cryptographic HMAC-SHA or MD5 authentication (`ip ospf message-digest-key 1 md5 [password]`) on all transit links and enable `passive-interface default` for all access subnets.',
      },
      step16_examPrep: {
        keyExamPoints: [
          'OSPF operates directly over IP protocol 89.',
          'Multicast addresses: 224.0.0.5 (AllSPFRouters) and 224.0.0.6 (AllDRouters).',
          '7 Neighbor States: Down -> Init -> 2-Way -> ExStart -> Exchange -> Loading -> Full.',
          'Administrative Distance default is 110.',
          'Cost formula: 100 Mbps / Bandwidth.',
        ],
        frequentTraps: [
          'Forgetting that DROTHER routers stay in 2-WAY state with each other on multi-access networks.',
          'Mismatched Area ID, subnet mask, or authentication keys prevent neighbor formation.',
        ],
      },
      step17_practicalLabRef: {
        title: 'Guided Practice: Enterprise Single-Area OSPF Neighbor Adjacency & Routing Troubleshooting',
        scenario:
          'Configure and troubleshoot Single-Area OSPF Area 0 across three enterprise routers, audit neighbor states, and verify Dijkstra SPF routing table convergence.',
        tasks: [
          'Inspect OSPF neighbor states using `show ip ospf neighbor`.',
          'Audit Link-State Database using `show ip ospf database`.',
          'Troubleshoot MTU mismatch on serial/ethernet links.',
        ],
        verificationMethod:
          'Verify `show ip route ospf` confirms full dynamic route reachability across all subnets.',
      },
      step18_masterySummary: {
        summaryPoints: [
          'OSPF is an open standard Link-State IGP using Dijkstra’s SPF algorithm to calculate shortest paths.',
          'Routers synchronize identical LSDBs across Area 0 using 7 neighbor state machine transitions.',
          'DR/BDR elections reduce adjacency meshes on broadcast Ethernet segments.',
          'Administrative Distance is 110, and metric cost is derived from reference bandwidth.',
        ],
        nextLessonBridge:
          'With Single-Area OSPF mastered, proceed to NET-305 to learn how to secure router perimeters using Access Control Lists (ACLs) and stateful firewalls.',
      },
    },
    questions: [
      {
        text: 'Two OSPF routers connected across a point-to-point GigabitEthernet link are stuck in the `EXSTART` neighbor state and will not transition to `FULL`. What is the most likely root cause?',
        options: [
          'An IP MTU mismatch between the two connecting router interfaces',
          'The routers are running different STP spanning-tree priorities',
          'The router priorities are both set to 1',
          'The routers are connected via copper cables instead of fiber optics',
        ],
        correctOption: 0,
        explanation: 'During the ExStart/Exchange states, routers exchange Database Description (DBD) packets with MTU values in the header. If the interface MTUs mismatch, the slave router rejects the DBD and the adjacency hangs indefinitely in EXSTART.',
        explanationsJson: {
          1: 'STP operates at Layer 2 and does not prevent Layer 3 OSPF ExStart progression.',
          2: 'Priority 1 is the standard default and allows normal adjacency formation.',
          3: 'Physical cable medium has no bearing on OSPF MTU negotiation.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'OSPF MTU Mismatch & ExStart Hang',
      },
      {
        text: 'On a broadcast multi-access Ethernet network with 5 routers running OSPF, which neighbor state is expected between two non-DR/non-BDR (DROTHER) routers?',
        options: [
          '2-WAY (DROTHER routers establish bidirectional communication but do not synchronize full LSDBs with each other)',
          'FULL (all routers must synchronize LSDBs directly with all other routers)',
          'DOWN (DROTHER routers ignore each other completely)',
          'EXSTART (DROTHER routers continuously attempt database exchange)',
        ],
        correctOption: 0,
        explanation: 'On multi-access segments, DROTHER routers form FULL adjacencies ONLY with the DR and BDR. Between two DROTHER routers, the state remains permanently in 2-WAY to conserve CPU and network bandwidth.',
        explanationsJson: {
          1: 'Full mesh adjacencies are eliminated on broadcast networks by DR/BDR design.',
          2: 'Routers discover each other via Hello packets, reaching 2-WAY, not DOWN.',
          3: 'DROTHERs do not exchange DBDs with each other, so they never enter ExStart.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'DR/BDR Multi-Access Adjacency Mechanics',
      },
      {
        text: 'What destination multicast IP addresses are used by OSPF routers on multi-access broadcast networks?',
        options: [
          '224.0.0.5 (AllSPFRouters - listened to by all OSPF routers) and 224.0.0.6 (AllDRouters - listened to only by DR and BDR)',
          '224.0.0.1 (All systems) and 224.0.0.2 (All routers)',
          '224.0.0.9 (RIPv2) and 224.0.0.10 (EIGRP)',
          '239.255.255.250 (SSDP)',
        ],
        correctOption: 0,
        explanation: 'OSPF uses two reserved IPv4 multicast addresses: 224.0.0.5 for all OSPF-speaking routers, and 224.0.0.6 specifically for communicating updates to the DR and BDR.',
        explanationsJson: {
          1: '224.0.0.1 and 224.0.0.2 are general IPv4 host/router multicasts.',
          2: '224.0.0.9 is RIPv2 and 224.0.0.10 is EIGRP.',
          3: '239.255.255.250 is UPnP/SSDP.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'OSPF Reserved Multicast Addresses',
      },
    ],
    lab: {
      title: 'Guided Practice: Enterprise Single-Area OSPF Neighbor Adjacency & Routing Troubleshooting',
      instructions:
        '1. Inspect the 3-router single-area OSPF topology.\n2. Execute `show ip ospf neighbor` to inspect neighbor states and identify DR/BDR roles.\n3. Execute `show ip ospf database` to verify Type-1 Router LSAs.\n4. Troubleshoot and resolve neighbor adjacency failures.',
      difficulty: CourseLevel.INTERMEDIATE,
      estimatedMinutes: 25,
      initialTopologyJson: {
        routers: [
          { id: 'R1', routerId: '1.1.1.1', priority: 1, role: 'DROTHER' },
          { id: 'R2', routerId: '2.2.2.2', priority: 255, role: 'DR' },
          { id: 'R3', routerId: '3.3.3.3', priority: 128, role: 'BDR' },
        ],
      },
      tasks: [
        'Execute `show ip ospf neighbor` to verify FULL adjacencies with DR and BDR.',
        'Inspect Link-State Database using `show ip ospf database`.',
        'Verify shortest path route calculation with `show ip route ospf`.',
      ],
    },
  },

  // =========================================================================
  // BENCHMARK LESSON 11: NET-404 (Wireshark Packet Capture Analysis)
  // =========================================================================
  {
    courseCode: 'NET-404',
    slug: 'net-404-wireshark-packet-capture',
    title: 'Wireshark Packet Capture Analysis',
    type: LessonType.THEORY,
    durationMinutes: 35,
    order: 1,
    visualizationType: 'WIRESHARK_INSPECTOR',
    introduction:
      'Master Wireshark PCAP architecture, Berkeley Packet Filters (BPF), display filter syntax, TCP stream reconstruction, and forensic incident troubleshooting.',
    stepMetadata: {
      step1_objective:
        'Master Wireshark PCAP capture engine architecture, WinPcap/Npcap driver hooks, Berkeley Packet Filter (BPF) syntax, advanced display filters, TCP stream reconstruction, and packet forensics.',
      step2_prerequisites: ['net-204-transport-protocols', 'net-305-acls-firewalls', 'Ethernet and IP header anatomy'],
      step3_whyItMatters:
        'Packet analysis provides empirical, indisputable ground truth during network outages, performance bottlenecks, and cybersecurity breaches. Network engineers and forensic analysts use Wireshark to dissect raw frame bytes when high-level diagnostic logs are insufficient.',
      step4_coreConcept:
        'Wireshark is an open-source packet analyzer that captures network frames directly from Network Interface Cards placed in Promiscuous Mode. It parses raw binary frame bytes against dissecting libraries, organizing telemetry into Packet List, Packet Details (OSI Protocol Tree), and Packet Bytes (Hex Dump) views.',
      step5_technicalAnatomy: {
        title: 'Wireshark Architecture & GUI Inspection Engine',
        description:
          'Wireshark uses Npcap/libpcap driver hooks to copy raw frames from the network interface buffer before passing data to dissection engines.',
        components: [
          {
            name: 'Capture Engine (Npcap/libpcap)',
            detail: 'Kernel-level driver capturing frames directly from physical NIC in promiscuous mode.',
          },
          {
            name: 'Packet List Pane',
            detail: 'Displays summary table of packet number, timestamp, source IP, destination IP, protocol, length, and info.',
          },
          {
            name: 'Packet Details Pane (Dissection Tree)',
            detail: 'Expandable OSI layer tree displaying parsed frame headers (L2 Ethernet, L3 IP, L4 TCP/UDP, L7 App).',
          },
          {
            name: 'Packet Bytes Pane (Hex Dump)',
            detail: 'Raw hexadecimal and ASCII byte stream view of the selected packet.',
          },
        ],
      },
      step6_howItWorks: {
        steps: [
          {
            stepNumber: 1,
            title: 'Promiscuous Mode Capture',
            action: 'NIC driver copies all frame traffic on physical segment regardless of destination MAC.',
          },
          {
            stepNumber: 2,
            title: 'BPF Capture Filtering',
            action: 'Kernel driver applies BPF filter (e.g., host 192.168.1.10 and port 80) to discard irrelevant packets before buffer storage.',
          },
          {
            stepNumber: 3,
            title: 'Protocol Dissection',
            action: 'Wireshark dissects raw hex bytes into protocol fields matching RFC specifications.',
          },
          {
            stepNumber: 4,
            title: 'Display Filtering & Stream Follow',
            action: 'Apply post-capture display filters (e.g., tcp.flags.syn == 1) or reconstruct TCP stream payloads.',
          },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'Wireshark Dissected TCP 3-Way Handshake SYN Packet',
        fields: [
          {
            fieldName: 'Frame Number',
            bitLength: 'Metadata',
            hexSample: 'Frame 1 (66 bytes on wire)',
            description: 'Capture index timestamp.',
          },
          {
            fieldName: 'Ethernet II Header',
            bitLength: '14 Bytes',
            hexSample: 'Dst: 00:1a:2b:aa:bb:cc, Src: 00:1a:2b:11:22:33',
            description: 'Layer 2 MAC framing.',
          },
          {
            fieldName: 'Internet Protocol Version 4',
            bitLength: '20 Bytes',
            hexSample: 'Src: 192.168.1.10, Dst: 172.16.0.5',
            description: 'Layer 3 IPv4 header.',
          },
          {
            fieldName: 'Transmission Control Protocol',
            bitLength: '32 Bytes',
            hexSample: 'Src Port: 51234, Dst Port: 80, Seq: 0 (relative), Flags: 0x002 (SYN)',
            description: 'Layer 4 TCP SYN connection request.',
          },
        ],
        headerDiagramAscii: `
+-------------------------------------------------------------------------+
| Frame 1: 66 bytes on wire (528 bits), 66 bytes captured                 |
| Ethernet II, Src: 00:1a:2b:11:22:33, Dst: 00:1a:2b:aa:bb:cc             |
| Internet Protocol Version 4, Src: 192.168.1.10, Dst: 172.16.0.5         |
| Transmission Control Protocol, Src Port: 51234, Dst Port: 80, Flags: SYN|
+-------------------------------------------------------------------------+
| 0000  00 1a 2b aa bb cc 00 1a  2b 11 22 33 08 00 45 00  ..+.....+.23..E. |
| 0010  00 34 1a 2b 40 00 40 06  6c c2 c0 a8 01 0a ac 10  .4.+@.@.l....... |
| 0020  00 05 c8 22 00 50 00 00  00 64 00 00 00 00 80 02  ..."..P...d..... |
+-------------------------------------------------------------------------+
`,
      },
      step8_visualExplanation: {
        type: 'WIRESHARK_INSPECTOR',
        title: 'Interactive Wireshark PCAP Frame Inspector & Stream Reconstructor',
        description:
          'Inspect live PCAP frame captures, filter by protocol/IP/flags, click protocol tree layers to highlight hex byte ranges, and follow TCP streams.',
      },
      step9_workedExample: {
        title: 'Reconstructing a Failed Web Request from PCAP Data',
        problemStatement:
          'An analyst inspects a PCAP trace of a failed HTTP request to server `172.16.0.5`. Filter the capture for TCP SYN packets and identify why the connection failed.',
        stepByStepSolution: [
          '1. Apply display filter: `ip.addr == 172.16.0.5 && tcp`.',
          '2. Observe Frame 1: Client `192.168.1.10:51234` sends `TCP SYN` (`Seq=0`, `Flags=0x002`) to Server `172.16.0.5:80`.',
          '3. Observe Frame 2: Server `172.16.0.5:80` responds with `TCP RST, ACK` (`Flags=0x014`, `Ack=1`).',
          '4. Evaluation: A `TCP RST` (Reset) flag sent by the destination server indicates that no application service is listening on TCP Port 80, or a firewall actively rejected the connection.',
        ],
        finalResult:
          'Connection failed due to destination server returning TCP RST (Port 80 closed / refused).',
      },
      step10_realWorldScenario: {
        topology: 'Enterprise Network with Web Server behind Stateful Firewall.',
        scenarioText:
          'Users report intermittent web application freezes. The network engineer captures traffic using `tshark` on the server interface. Applying display filter `tcp.analysis.flags`, the engineer identifies a high volume of `TCP Retransmission` and `TCP Dup ACK` frames, pointing to physical link packet drops on the intermediate switch interface.',
        engineeringContext: 'Wireshark expert info flags isolate hardware degradation vs application errors.',
      },
      step11_deviceBehavior: {
        hostBehavior:
          'Host OS socket driver passes captured frame buffers to Npcap kernel driver before processing network stack.',
        nicBehavior:
          'NIC operating in Promiscuous Mode disables destination MAC filtering, copying all physical wire signals into system memory.',
        switchOrRouterBehavior:
          'Switches configured with SPAN (Switched Port Analyzer) mirror traffic from target ports to the monitoring port connected to the Wireshark capture station.',
      },
      step12_cliTooling: [
        {
          command: 'tshark -i eth0 -n -c 5 "tcp port 80"',
          description: 'Terminal-based Wireshark capture utility collecting first 5 HTTP packets on interface eth0.',
          expectedOutput:
            '1 0.000000 192.168.1.10 -> 172.16.0.5 TCP 66 51234 -> 80 [SYN] Seq=0 Win=64240 Len=0',
          proofExplanation: 'Captures and displays command-line TCP SYN handshake packets directly from the terminal.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'Wireshark capture displays high volume of "TCP Retransmission" alerts.',
          possibleCauses: ['Physical cable degradation causing packet drops', 'Interface buffer queue drops'],
          diagnosticSteps: [
            'Filter PCAP by `tcp.analysis.retransmission`.',
            'Correlate timestamps with switch interface error counters (`show interface`).',
          ],
          remediation: 'Replace damaged patch cable or fix duplex settings on switch port.',
        },
      ],
      step14_commonMistakes: [
        {
          misconception: 'Confusing BPF Capture Filters with Wireshark Display Filters.',
          correction:
            'Capture filters (BPF, e.g. `host 10.0.0.1`) determine what traffic is saved to disk DURING capture. Display filters (e.g. `ip.addr == 10.0.0.1`) filter displayed frames AFTER capture.',
        },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'Unencrypted Credential Sniffing & Promiscuous Packet Eavesdropping',
        mitigationStrategy:
          'Enforce end-to-end TLS encryption (HTTPS/SSH) so eavesdroppers capturing PCAP files cannot read application payloads.',
      },
      step16_examPrep: {
        keyExamPoints: [
          'Know syntax for display filters: `ip.addr == 192.168.1.10`, `tcp.port == 80`, `tcp.flags.syn == 1`.',
          'Understand SPAN (Switched Port Analyzer) for switch traffic mirroring.',
          'Identify TCP RST (Reset) vs TCP FIN (Finish) connection termination.',
        ],
        frequentTraps: [
          'Using single equals `=` instead of double equals `==` in display filters.',
        ],
      },
      step17_practicalLabRef: {
        title: 'Wireshark PCAP Capture Filter & TCP Stream Forensics Lab',
        scenario:
          'A web client cannot complete HTTP transactions. You must open a PCAP trace, apply display filters to isolate TCP handshakes, identify TCP RST flags, and locate payload errors.',
        tasks: [
          'Open capture.pcap trace in Wireshark Frame Inspector.',
          'Apply display filter tcp.flags.syn == 1 to find connection attempts.',
          'Identify frame returning TCP RST flag.',
        ],
        verificationMethod: 'Isolate error frame number and submit target HTTP error status in terminal.',
      },
      step18_masterySummary: {
        summaryPoints: [
          'Wireshark uses Promiscuous Mode and Npcap driver hooks to capture raw frames.',
          'Capture filters (BPF) filter incoming data; Display filters analyze stored PCAP frames.',
          'TCP RST indicates connection refusal; TCP Retransmissions indicate packet loss.',
        ],
        nextLessonBridge:
          'Now that you master Wireshark PCAP analysis and TCP stream forensics, you possess full-stack diagnostic tools to troubleshoot enterprise networks in NET-404 Capstone.',
      },
    },
    questions: [
      {
        text: 'Which Wireshark display filter correctly isolates initial TCP SYN connection request packets (where SYN=1 and ACK=0)?',
        options: [
          'tcp.flags.syn == 1 && tcp.flags.ack == 0',
          'tcp.port == 80 || ip.proto == 6',
          'bpf filter syn only',
          'http.request == true',
        ],
        correctOption: 0,
        explanation: '`tcp.flags.syn == 1 && tcp.flags.ack == 0` filters strictly for initial TCP connection requests.',
        explanationsJson: {
          1: 'tcp.port == 80 filters all HTTP TCP packets, not just initial SYN requests.',
          2: 'bpf filter syn only is invalid display filter syntax.',
          3: 'http.request filters Layer 7 HTTP requests.',
        },
        difficulty: CourseLevel.ADVANCED,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Wireshark Display Filters',
      },
      {
        text: 'What does receiving a frame with `TCP Flags: 0x014` (RST, ACK) in response to a TCP SYN request signify?',
        options: [
          'The destination server actively refused the connection because no application is listening on that port or a firewall reset it',
          'The destination server successfully established the 3-way handshake',
          'The packet was successfully routed via BGP',
          'The client MAC address was successfully resolved by ARP',
        ],
        correctOption: 0,
        explanation: 'A TCP RST (Reset) flag sent by the destination indicates connection refusal (no listening service or active firewall reset).',
        explanationsJson: {
          1: 'Successful 3-way handshake step 2 returns SYN-ACK (Flags: 0x012), not RST-ACK.',
          2: 'BGP routing operates independently of single TCP RST flags.',
          3: 'ARP resolution occurs at Layer 2 prior to TCP connection attempts.',
        },
        difficulty: CourseLevel.ADVANCED,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'TCP State & Flag Analysis',
      },
    ],
    lab: {
      title: 'Guided Practice: Wireshark PCAP Capture Filter & TCP Stream Forensics',
      instructions:
        '1. Open capture.pcap trace in the Frame Inspector.\n2. Filter TCP SYN packets using tcp.flags.syn == 1.\n3. Identify frame with TCP RST flag.',
      difficulty: CourseLevel.ADVANCED,
      estimatedMinutes: 25,
      initialTopologyJson: { pcapFile: 'capture.pcap', totalFrames: 120, targetPort: 80 },
      tasks: [
        'Apply display filter tcp.flags.syn == 1.',
        'Locate connection attempt returning TCP RST.',
      ],
    },
  },
];

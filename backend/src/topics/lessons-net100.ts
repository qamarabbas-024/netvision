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
    durationMinutes: 20,
    order: 2,
    visualizationType: 'MEDIA_INSPECTOR',
    introduction:
      'Learn about the physical hardware that connects computer networks: copper twisted-pair cables (Cat5e, Cat6, Cat6a with RJ-45 connectors), optical fiber cables (single-mode vs multimode), modular transceivers (SFP, SFP+, QSFP), and Power over Ethernet (PoE).',
    contentV2: {
      objective:
        'Understand what physical network media are, compare practical uses of copper twisted-pair and optical fiber, learn what modular transceivers do, and recognize when to use Power over Ethernet (PoE) in common networking scenarios.',
      prerequisites: [
        'net-101-bits-bytes-binary-hex',
        'Basic understanding of binary digital signals (bits and bytes)',
      ],
      whyItMatters:
        'Every network connection requires physical hardware to carry data from one device to another. Choosing the right cable or transceiver depends on simple, practical factors: how far the data needs to travel, whether electrical interference is present, and whether connected devices need power over the cable.',
      explanation:
        'Physical network media are the actual materials and cables that carry data between devices. They fall into two main categories: physical cables (guided media) and wireless radio waves (unguided media).\n\n1. Copper Twisted-Pair Cabling:\nCopper cables use electrical pulses to transmit data. Inside the cable, eight copper wires are grouped into four color-coded twisted pairs. Twisting the wire pairs helps cancel out electrical noise and interference from nearby wires. Copper cables plug in using standard modular clips called RJ-45 (or 8P8C) connectors.\n- 100-Meter Practical Limit: Standard copper twisted-pair Ethernet cables have a practical distance limit of 100 meters (about 328 feet).\n- Common Categories: Cat5e supports standard 1 Gbps gigabit speeds for homes and offices; Cat6 supports up to 10 Gbps over shorter runs and 1 Gbps up to 100 meters; Cat6a features thicker shielding to support 10 Gbps across the full 100 meters.\n\n2. Optical Fiber Media:\nFiber optic cables carry data as pulses of light through thin, flexible strands of pure glass. Because fiber transmits light instead of electrical voltage, it is completely immune to electromagnetic interference (EMI) from heavy machinery, power lines, and lightning.\n- Single-Mode Fiber (SMF): Designed for long-distance links (such as connecting buildings across a campus or between cities). It sends light along a single, direct path (typically marked with a yellow outer jacket).\n- Multimode Fiber (MMF): Designed for shorter fiber runs (such as connecting switches within the same building or server room). It allows light to travel along multiple paths (typically marked with an aqua or orange outer jacket).\n\n3. Modular Transceivers (SFP, SFP+, QSFP):\nMany network switches feature modular slots called transceiver cages rather than fixed ports. A transceiver is a small, hot-pluggable module that slides into the switch port. It lets you decide whether that port connects to copper cabling, multimode fiber, or single-mode fiber.\n- SFP: Small Form-factor Pluggable module (standard 1 Gbps).\n- SFP+: Enhanced module designed for 10 Gbps links.\n- QSFP: Quad module designed for high-speed switch backbones (such as 40 Gbps or 100 Gbps).\n\n4. Power over Ethernet (PoE):\nPower over Ethernet allows a network switch to send electrical power and data over the same standard copper Ethernet cable. This eliminates the need for separate electrical wall outlets and power adapters for devices like:\n- Wireless Access Points mounted on ceilings\n- Security IP Cameras mounted high on walls or outdoors\n- VoIP Desk Phones powered directly from the network jack',
      components: [
        {
          name: '1. Copper Twisted-Pair (Cat5e / Cat6 / Cat6a)',
          detail: 'Carries electrical signals over 4 twisted pairs of wire (8 conductors). Standard 100-meter distance limit for typical office and home networks.',
        },
        {
          name: '2. RJ-45 Modular Connector',
          detail: 'The standard plastic modular clip used to plug copper Ethernet cables into computers, wall outlets, and network switches.',
        },
        {
          name: '3. Single-Mode Fiber (SMF)',
          detail: 'Transmits light along a single direct path. Best suited for long-distance runs between buildings or across campus backbones (yellow jacket).',
        },
        {
          name: '4. Multimode Fiber (MMF)',
          detail: 'Transmits light for shorter runs. Commonly used to link switches within the same building or server room (aqua or orange jacket).',
        },
        {
          name: '5. Modular Transceivers (SFP / SFP+ / QSFP)',
          detail: 'Hot-pluggable modules that slide into switch ports to connect copper or fiber cables at specific speeds (1G, 10G, 40G/100G).',
        },
        {
          name: '6. Power over Ethernet (PoE)',
          detail: 'Delivers electrical power over copper network cables, allowing devices like Wi-Fi access points and security cameras to run without separate power cords.',
        },
      ],
      howItWorks: [
        {
          stepNumber: 1,
          title: 'Check Distance and Environment',
          action: 'If the device is within 100 meters in a normal indoor setting, copper twisted pair is practical and economical. If the link is long-distance or near heavy electrical motors, choose optical fiber.',
        },
        {
          stepNumber: 2,
          title: 'Select Fiber Type and Transceiver',
          action: 'For short fiber links inside a building, choose multimode fiber (MMF). For longer runs across campus or between sites, choose single-mode fiber (SMF) with an appropriate SFP or SFP+ transceiver.',
        },
        {
          stepNumber: 3,
          title: 'Check Power Requirements',
          action: 'If connecting a ceiling access point, security camera, or desk phone, connect to a PoE-enabled switch port to supply both power and data over one Ethernet cable.',
        },
      ],
      visualizer: {
        type: 'MEDIA_INSPECTOR',
        title: 'Interactive Network Media & Transceiver Inspector',
        description: 'Explore practical comparisons of copper vs fiber, single-mode vs multimode fiber, SFP transceiver modules, and PoE power delivery.',
      },
      workedExample: {
        title: 'Practical Media Selection Scenarios',
        problemStatement: 'Evaluate requirements and select the practical physical medium and interface for each scenario:\n1. Connecting a desktop computer in an office 20 meters from a floor switch.\n2. Linking two campus buildings located 800 meters apart.\n3. Installing a ceiling-mounted Wi-Fi access point where no electrical wall outlet exists.',
        stepByStepSolution: [
          '1. Office Desktop (20m): Distance is well within the 100-meter copper limit. Standard Cat6 copper twisted-pair with RJ-45 connectors is practical, inexpensive, and easy to run.',
          '2. Campus Backbone (800m): Distance exceeds the 100-meter copper limit. Single-mode optical fiber (SMF) with SFP+ transceivers is the appropriate choice for long-distance links.',
          '3. Ceiling Wi-Fi Access Point: Connect using copper twisted-pair to a Power over Ethernet (PoE) switch port to supply both power and data through the single network cable.',
        ],
        finalResult: '1: Copper Twisted-Pair (Cat6 / RJ-45). 2: Single-Mode Fiber (SMF with SFP+). 3: Copper with Power over Ethernet (PoE).',
      },
      practice: [
        {
          id: 1,
          prompt: 'Which cabling type and connector is practical for connecting a regular desktop computer 20 meters away from an office switch?',
          expected: 'Copper twisted-pair cable (Cat5e or Cat6) with standard RJ-45 connectors.',
          hints: 'Consider standard commercial office cabling for short runs under 100 meters.',
        },
        {
          id: 2,
          prompt: 'What is the practical maximum distance limit for standard copper twisted-pair Ethernet cables?',
          expected: '100 meters (about 328 feet).',
          hints: 'All common copper Ethernet cables (Cat5e, Cat6, Cat6a) share this distance limit.',
        },
        {
          id: 3,
          prompt: 'A network link must connect two buildings located 800 meters apart. Which type of optical fiber is suited for this longer distance?',
          expected: 'Single-Mode Fiber (SMF).',
          hints: 'Recall which fiber type is designed for long distances (SMF) versus shorter building links (MMF).',
        },
        {
          id: 4,
          prompt: 'Why is optical fiber preferred over copper cabling in an industrial manufacturing area with heavy electrical equipment and motor noise?',
          expected: 'Fiber optic cables carry pulses of light instead of electrical currents, making them immune to electromagnetic interference (EMI).',
          hints: 'Think about how light pulses in glass behave around strong electrical fields.',
        },
        {
          id: 5,
          prompt: 'What is the purpose of an SFP or SFP+ modular transceiver in a network switch?',
          expected: 'It is a hot-pluggable module that allows a switch port to connect to different cable types (copper or fiber) and different speeds.',
          hints: 'Consider why switches use modular slots instead of fixed built-in ports.',
        },
        {
          id: 6,
          prompt: 'A technician needs to install a ceiling-mounted security camera without running a separate electrical power cord. What technology should be used?',
          expected: 'Power over Ethernet (PoE).',
          hints: 'Recall the technology that sends both electrical power and data over the network cable.',
        },
      ],
      recap: [
        'Copper twisted-pair cables (Cat5e/Cat6/Cat6a) use RJ-45 connectors and have a practical distance limit of 100 meters.',
        'Optical fiber uses pulses of light through glass and is immune to electromagnetic interference (EMI).',
        'Single-mode fiber (SMF) is used for long distances between buildings; multimode fiber (MMF) is used for shorter runs inside buildings or server rooms.',
        'Modular transceivers (SFP, SFP+, QSFP) allow switch ports to connect to various copper or fiber media at different speeds.',
        'Power over Ethernet (PoE) delivers electrical power alongside data over copper cables to power devices like Wi-Fi access points and IP cameras.',
      ],
    },
    questions: [
      {
        text: 'What is the practical maximum distance limit for standard copper twisted-pair Ethernet cables (such as Cat5e or Cat6)?',
        options: [
          '100 meters (about 328 feet)',
          '500 meters (about 1,640 feet)',
          '50 meters (about 164 feet)',
          '1,000 meters (1 kilometer)',
        ],
        correctOption: 0,
        explanation:
          'Standard copper twisted-pair Ethernet cables (Cat5e, Cat6, Cat6a) have a practical maximum channel limit of 100 meters due to electrical signal attenuation.',
        explanationsJson: {
          1: '500 meters far exceeds copper limits and requires optical fiber.',
          2: 'While Cat6 has a 55m limit for 10 Gbps, standard 1 Gbps runs reach 100 meters.',
          3: '1,000 meters requires long-distance Single-Mode optical fiber.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Copper Cable Distance Limits',
      },
      {
        text: 'When choosing between optical fiber types, which one is designed for much longer distances across campuses or between buildings?',
        options: [
          'Single-Mode Fiber (SMF)',
          'Multimode Fiber (MMF)',
          'Cat5e Copper Cable',
          'Coaxial Cable',
        ],
        correctOption: 0,
        explanation:
          'Single-Mode Fiber (SMF) carries light along a single direct path, allowing it to span long distances between buildings or across cities.',
        explanationsJson: {
          1: 'Multimode Fiber (MMF) is designed for shorter runs within buildings or server rooms.',
          2: 'Cat5e is copper cabling limited to 100 meters.',
          3: 'Coaxial cable is copper cabling used primarily for legacy connections.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Single-Mode vs Multimode Fiber Purpose',
      },
      {
        text: 'Why is optical fiber cable immune to electromagnetic interference (EMI) caused by power lines or heavy machinery?',
        options: [
          'Fiber transmits signals using pulses of light through glass rather than electrical current over copper wire',
          'Fiber cables are wrapped in thick lead shielding that absorbs all radio signals',
          'Fiber cables operate at zero electrical resistance',
          'Fiber switches automatically filter out electrical noise using software',
        ],
        correctOption: 0,
        explanation:
          'Because optical fiber carries data as light through non-conductive glass strands, electromagnetic fields from power lines and motors cannot interfere with the signal.',
        explanationsJson: {
          1: 'Fiber jackets are standard plastic; immunity comes from light transmission in glass.',
          2: 'Fiber does not carry electrical current.',
          3: 'Immunity is a physical property of light in glass, not software filtering.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Fiber Immunity to Electrical Noise',
      },
      {
        text: 'What is the primary benefit of a modular transceiver such as an SFP or SFP+ module in a network switch?',
        options: [
          'It allows a switch port to be adapted to different cable types (copper or fiber) and transmission speeds',
          'It provides battery backup power to the switch during electrical outages',
          'It converts AC wall power into DC power for the switch motherboard',
          'It speeds up internet connection speeds by compressing web pages',
        ],
        correctOption: 0,
        explanation:
          'An SFP/SFP+ modular transceiver slots into a switch port cage, giving the flexibility to connect copper cables, multimode fiber, or single-mode fiber as needed.',
        explanationsJson: {
          1: 'Battery backup is provided by a UPS unit.',
          2: 'Power conversion is performed by the power supply unit (PSU).',
          3: 'Transceivers handle physical media conversion, not web compression.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Modular Transceiver Purpose',
      },
      {
        text: 'What is the main advantage of Power over Ethernet (PoE) when connecting devices like Wi-Fi access points and IP cameras?',
        options: [
          'It delivers electrical power and network data over the same Ethernet cable, removing the need for separate electrical power outlets',
          'It doubles the maximum cable distance of copper cables to 200 meters',
          'It automatically converts copper signals into optical fiber light',
          'It encrypts all network data sent through the cable',
        ],
        correctOption: 0,
        explanation:
          'Power over Ethernet (PoE) sends low-voltage DC power through the copper Ethernet cable alongside data, allowing devices to be installed in ceilings or outdoors without dedicated power outlets.',
        explanationsJson: {
          1: 'PoE does not change the 100-meter copper distance limit.',
          2: 'PoE delivers power over copper; it does not convert to fiber.',
          3: 'PoE provides electrical power, not data encryption.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Power over Ethernet Purpose',
      },
      {
        text: 'A desktop computer is located 15 meters from an office network switch in a normal room. Which physical medium is the most practical choice?',
        options: [
          'Copper twisted-pair cabling (Cat5e or Cat6) with RJ-45 connectors',
          'Single-Mode optical fiber with long-haul transceivers',
          'Undersea submarine optical cable',
          'Shielded coaxial cable with BNC connectors',
        ],
        correctOption: 0,
        explanation:
          'For short indoor desktop connections under 100 meters, copper twisted-pair (Cat5e or Cat6) with standard RJ-45 plugs is standard, inexpensive, and easy to install.',
        explanationsJson: {
          1: 'Single-mode fiber is unnecessary and expensive for a 15-meter office desk connection.',
          2: 'Submarine cables are for trans-oceanic backbones.',
          3: 'Coaxial BNC cabling is legacy and not used for modern desktop Ethernet.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Practical Media Selection',
      },
    ],
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
    contentV2: {
      objective:
        'Understand the fundamentals of wireless networking (IEEE 802.11 / Wi-Fi), compare radio frequency spectrum bands (2.4 GHz, 5 GHz, 6 GHz), master 2.4 GHz non-overlapping channel planning (Channels 1, 6, 11), explore channel bonding across Wi-Fi generations (Wi-Fi 4 through Wi-Fi 7), and analyze CSMA/CA collision avoidance mechanics on half-duplex wireless media.',
      prerequisites: [
        'level-0-what-is-a-computer-network',
        'Basic understanding of electromagnetic signals and physical network media',
      ],
      whyItMatters:
        'Wireless networks are an unguided, shared, half-duplex radio medium prone to interference and signal attenuation. Selecting improper channels (such as using overlapping Channels 2, 3, or 4 on 2.4 GHz) or misconfiguring channel widths causes severe Adjacent Channel Interference (ACI), dropped frames, and network slowdowns. Understanding RF spectrum allocations and CSMA/CA arbitration enables engineers to build reliable, high-speed Wi-Fi infrastructures.',
      explanation:
        'Wireless Local Area Networks (WLANs) transmit digital data across radio frequency (RF) bands using the IEEE 802.11 family of standards (commonly known as Wi-Fi).\n\n### 1. RF Spectrum Bands: 2.4 GHz, 5 GHz & 6 GHz\n- **2.4 GHz Band**: Features longer radio wavelengths that travel further and penetrate solid walls effectively. However, it has very limited bandwidth and high background interference from Bluetooth, baby monitors, and microwave ovens.\n- **5 GHz Band**: Features shorter wavelengths with higher signal attenuation through walls, but offers much wider frequency spectrum, 24+ non-overlapping channels, and support for wide bonded channels (40 MHz, 80 MHz, 160 MHz) for high throughput.\n- **6 GHz Band (Wi-Fi 6E & Wi-Fi 7)**: Provides 1,200 MHz of pristine, contiguous spectrum free from legacy Wi-Fi contention, supporting ultra-wide channels up to 320 MHz.\n\n### 2. The 2.4 GHz Non-Overlapping Channel Architecture\nIn North America, the 2.4 GHz band provides 11 channels spaced 5 MHz apart (Channel 1 at 2412 MHz, Channel 2 at 2417 MHz, etc.). Because each standard Wi-Fi transmission occupies 20 MHz of bandwidth, adjacent channels overlap heavily.\n- **The Golden Rule**: The **ONLY** three channels that do not overlap in 2.4 GHz are **Channels 1, 6, and 11** (separated by 25 MHz center frequencies).\n- **Adjacent Channel Interference (ACI)**: Configuring access points on intermediate channels (e.g., Channel 2, 3, 4, 7, 8, 9) bleeds RF energy into neighboring channels without protocol synchronization, causing destructive packet corruption.\n\n### 3. Wi-Fi Generations & Evolution\n- **Wi-Fi 4 (802.11n)**: Introduced MIMO (Multiple-Input Multiple-Output) spatial streams and 40 MHz channel bonding on 2.4 GHz and 5 GHz (up to 600 Mbps).\n- **Wi-Fi 5 (802.11ac)**: 5 GHz only, introduced Multi-User MIMO (MU-MIMO downlink), 256-QAM modulation, and 80/160 MHz channel bonding (up to 6.9 Gbps).\n- **Wi-Fi 6 / 6E (802.11ax)**: Operates on 2.4 GHz, 5 GHz, and 6 GHz. Introduced OFDMA (Orthogonal Frequency Division Multiple Access) to divide channels into sub-carriers for high client density, 1024-QAM, and Target Wake Time (TWT).\n- **Wi-Fi 7 (802.11be)**: Extremely High Throughput (EHT), 320 MHz ultra-wide channels, 4096-QAM, and Multi-Link Operation (MLO) enabling simultaneous transmission across multiple frequency bands.\n\n### 4. Half-Duplex Media & CSMA/CA Collision Avoidance\nBecause wireless radios cannot transmit and receive simultaneously on the same frequency channel without blinding their own receiver, wireless communication is strictly **half-duplex**.\n- Wired Ethernet historically used **CSMA/CD** (Collision Detection), where devices detect collisions while transmitting.\n- Wireless cannot detect collisions during transmission; therefore, Wi-Fi mandates **CSMA/CA (Carrier Sense Multiple Access with Collision Avoidance)**:\n  1. **Carrier Sense / Clear Channel Assessment (CCA)**: The device checks if the radio channel is currently busy.\n  2. **DIFS & Random Backoff**: If busy, the client waits for a Distributed Inter-Frame Space (DIFS) plus a randomized slot countdown timer before transmitting.\n  3. **Mandatory Layer 2 Positive ACK**: The receiving station must immediately return an 802.11 ACK frame upon successful reception. If no ACK is received, the sender assumes a collision occurred and retransmits with an exponentially expanded backoff window.',
      components: [
        {
          name: '1. 2.4 GHz RF Frequency Band',
          detail: 'Longer wavelength with superior wall penetration; limited to 3 non-overlapping 20 MHz channels (1, 6, 11) with higher background noise.',
        },
        {
          name: '2. 5 GHz & 6 GHz RF Bands',
          detail: 'Shorter wavelength with higher attenuation; 24+ non-overlapping channels on 5 GHz and 1.2 GHz of clean spectrum on 6 GHz supporting wide channel bonding.',
        },
        {
          name: '3. 2.4 GHz Non-Overlapping Channels (1, 6, 11)',
          detail: 'Channels separated by 25 MHz center frequencies. The only valid combination to eliminate adjacent channel spectral overlap in 2.4 GHz deployments.',
        },
        {
          name: '4. Channel Bonding (40 / 80 / 160 / 320 MHz)',
          detail: 'Combines adjacent 20 MHz channels into wider channels to multiply throughput, primarily deployed on 5 GHz and 6 GHz spectrum.',
        },
        {
          name: '5. Wi-Fi Generations (802.11n to 802.11be)',
          detail: 'Standardized evolutions: Wi-Fi 4 (MIMO), Wi-Fi 5 (MU-MIMO), Wi-Fi 6 (OFDMA & 6 GHz), and Wi-Fi 7 (320 MHz channels & Multi-Link Operation).',
        },
        {
          name: '6. CSMA/CA & Positive Layer 2 ACKs',
          detail: 'Half-duplex channel arbitration mechanism: listen before talk (CCA), random backoff slot timers, and mandatory receiver ACK frames.',
        },
      ],
      visualizer: {
        type: 'WIRELESS_SPECTRUM_ANALYZER',
        title: 'Interactive Wi-Fi Spectrum Analyzer & CSMA/CA Contention Engine',
        description: 'Explore 2.4 GHz, 5 GHz, and 6 GHz spectrum allocations, visualize channel overlap and bonding, and simulate CSMA/CA contention arbitration.',
      },
      workedExample: {
        title: 'Designing a 3-Access-Point Multi-Room Wi-Fi Channel Plan',
        problemStatement: 'An enterprise office floor requires installing 3 Wi-Fi Access Points (AP-1, AP-2, AP-3) with overlapping coverage zones. Determine: (1) The optimal 2.4 GHz channel assignment, (2) Why Channel 3 must NOT be used, and (3) The recommended 5 GHz configuration.',
        stepByStepSolution: [
          '1. 2.4 GHz Channel Assignment: Assign the 3 non-overlapping channels: AP-1 -> Channel 1 (2412 MHz), AP-2 -> Channel 6 (2437 MHz), and AP-3 -> Channel 11 (2462 MHz) with standard 20 MHz channel widths.',
          '2. Why Avoid Channel 3: Channel 3 center frequency (2422 MHz) overlaps directly with both Channel 1 (2412 MHz) and Channel 6 (2437 MHz). This causes severe Adjacent Channel Interference (ACI), corrupting preambles and dropping frames on all nearby APs.',
          '3. 5 GHz Channel Configuration: Assign distinct non-overlapping UNII channels (such as Channels 36, 52, and 100) using 40 MHz or 80 MHz channel bonding to maximize throughput without co-channel interference.',
        ],
        finalResult: '2.4 GHz: AP-1 -> Ch 1, AP-2 -> Ch 6, AP-3 -> Ch 11 (20 MHz). 5 GHz: Independent non-overlapping channels (Ch 36, 52, 100) with 40/80 MHz bonding.',
      },
      recap: [
        '2.4 GHz offers long range and wall penetration but only 3 non-overlapping channels (1, 6, 11).',
        '5 GHz and 6 GHz offer wide bandwidth, 24+ channels, and channel bonding (40/80/160/320 MHz).',
        'Wi-Fi is half-duplex; radios cannot transmit and receive simultaneously on the same channel.',
        'CSMA/CA prevents collisions using Clear Channel Assessment (CCA), random backoff, and mandatory Layer 2 ACKs.',
      ],
      practice: [
        {
          id: 1,
          prompt: 'In North America, which three 2.4 GHz Wi-Fi channels are the ONLY channels that do not overlap with one another?',
          expected: 'Channels 1, 6, and 11.',
          hints: 'Each channel is 20 MHz wide and spaced 5 MHz apart; 25 MHz spacing is needed to eliminate overlap.',
        },
        {
          id: 2,
          prompt: 'Why does Wi-Fi use CSMA/CA (Collision Avoidance) instead of Ethernet CSMA/CD (Collision Detection)?',
          expected: 'Wireless radios operate in half-duplex and cannot transmit and detect incoming collisions simultaneously on the same frequency.',
          hints: 'A transmitting radio transmitter overwhelms its own local receiver circuitry.',
        },
        {
          id: 3,
          prompt: 'What happens if an access point is configured to use 2.4 GHz Channel 3 in an area with active APs on Channels 1 and 6?',
          expected: 'Severe Adjacent Channel Interference (ACI) occurs because Channel 3 overlaps with both Channel 1 and Channel 6.',
          hints: 'Channel 3 (2422 MHz) bleeds directly into the frequency masks of Channels 1 and 6.',
        },
        {
          id: 4,
          prompt: 'Compare 2.4 GHz and 5 GHz radio frequencies in terms of physical wall penetration and available channel bandwidth.',
          expected: '2.4 GHz penetrates walls better due to longer wavelength; 5 GHz offers much higher bandwidth and 24+ non-overlapping channels.',
          hints: 'Lower frequencies travel further through barriers; higher frequencies support wider channel bonding.',
        },
        {
          id: 5,
          prompt: 'What mechanism in CSMA/CA confirms that a transmitted wireless frame was successfully received without collision?',
          expected: 'A mandatory Layer 2 positive ACK (Acknowledgment) frame sent immediately by the receiving station.',
          hints: 'If the sender does not receive this confirmation frame, it assumes collision and retransmits.',
        },
        {
          id: 6,
          prompt: 'Which modern Wi-Fi standard introduced OFDMA (Orthogonal Frequency Division Multiple Access) and expanded into the 6 GHz spectrum band (Wi-Fi 6E)?',
          expected: 'Wi-Fi 6 / 6E (IEEE 802.11ax).',
          hints: 'Think of 802.11ax which subdivides channels into resource units for dense client environments.',
        },
      ],
    },
    questions: [
      {
        text: 'In the 2.4 GHz wireless frequency band in North America, which three channels are the ONLY channels that do not overlap with one another?',
        options: [
          'Channels 1, 6, and 11',
          'Channels 1, 2, and 3',
          'Channels 6, 7, and 8',
          'Channels 2, 4, and 8',
        ],
        correctOption: 0,
        explanation: 'In 2.4 GHz Wi-Fi, each 20 MHz channel requires 25 MHz separation between center frequencies to eliminate spectral overlap. Channels 1 (2412 MHz), 6 (2437 MHz), and 11 (2462 MHz) are the only non-overlapping channel combination.',
        explanationsJson: {
          1: 'Channels 1, 2, and 3 are spaced only 5 MHz apart and overlap almost entirely.',
          2: 'Channels 6, 7, and 8 suffer extreme adjacent channel overlap.',
          3: 'Channels 2, 4, and 8 overlap with neighboring transmissions.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: '2.4 GHz Non-Overlapping Channels',
      },
      {
        text: 'Why does Wi-Fi (IEEE 802.11) use CSMA/CA (Collision Avoidance) rather than CSMA/CD (Collision Detection)?',
        options: [
          'Wireless radios are half-duplex and cannot transmit and detect collisions simultaneously on the same frequency channel',
          'CSMA/CD is legally restricted to fiber optic cables only',
          'Wireless antennas do not support binary data transmission',
          'Collision avoidance eliminates the need for radio frequency spectrum',
        ],
        correctOption: 0,
        explanation: 'Because a wireless radio transceiver signal transmission overwhelms its own receiver circuitry on the same channel, it cannot detect collisions while transmitting. Therefore, 802.11 relies on CSMA/CA with Clear Channel Assessment (CCA), random backoffs, and positive Layer 2 ACKs.',
        explanationsJson: {
          1: 'CSMA/CD is a media access arbitration protocol for half-duplex coaxial/twisted-pair Ethernet, not fiber.',
          2: 'Wireless antennas transmit binary data modulated onto radio waves.',
          3: 'Collision avoidance governs media access timing across RF spectrum.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Half-Duplex Media & CSMA/CA Rationale',
      },
      {
        text: 'How do 2.4 GHz and 5 GHz Wi-Fi frequency bands compare regarding wall penetration and available channel capacity?',
        options: [
          '2.4 GHz provides better wall penetration due to longer wavelengths, while 5 GHz provides greater channel capacity and support for wide channel bonding',
          '2.4 GHz has 24 non-overlapping channels while 5 GHz has only 3',
          '5 GHz penetrates solid concrete walls much better than 2.4 GHz',
          '2.4 GHz and 5 GHz have identical attenuation and channel bonding capabilities',
        ],
        correctOption: 0,
        explanation: '2.4 GHz radio waves have longer wavelengths that penetrate physical walls and obstacles with lower attenuation. 5 GHz waves attenuate more rapidly through barriers but offer 24+ non-overlapping channels and support 40/80/160 MHz channel bonding.',
        explanationsJson: {
          1: '2.4 GHz has only 3 non-overlapping channels (1, 6, 11), while 5 GHz has 24+ non-overlapping channels.',
          2: 'Higher frequencies (5 GHz) attenuate more rapidly through solid concrete.',
          3: 'They have fundamentally different propagation physics and channel allocations.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: '2.4 GHz vs 5 GHz Spectrum Characteristics',
      },
      {
        text: 'What happens in a 2.4 GHz Wi-Fi deployment if an administrator configures Access Points to use Channels 1, 2, and 3?',
        options: [
          'Severe Adjacent Channel Interference (ACI) occurs, corrupting packet preambles and degrading wireless throughput',
          'The access points automatically bond together into a single 60 MHz channel',
          'All clients automatically upgrade to 6 GHz Wi-Fi 6E operation',
          'Network throughput triples because channels are closely adjacent',
        ],
        correctOption: 0,
        explanation: 'Channels 1, 2, and 3 are separated by only 5 MHz, causing massive spectral overlap. Transmissions on Channel 2 act as destructive RF noise to Channels 1 and 3, causing preamble corruption and heavy retransmissions.',
        explanationsJson: {
          1: 'Channel bonding on 2.4 GHz requires synchronized 802.11n/ax bonding, not arbitrary adjacent overlap.',
          2: '6 GHz requires Wi-Fi 6E hardware and separate 6 GHz radio transceivers.',
          3: 'Interference destroys signal-to-noise ratio and severely reduces throughput.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Adjacent Channel Interference Impact',
      },
      {
        text: 'In 802.11 CSMA/CA protocol operation, how does a transmitting station determine that a unicast frame was successfully delivered?',
        options: [
          'It receives an explicit Layer 2 positive ACK frame from the destination receiver immediately following the transmission',
          'It checks if the local Ethernet switch port link LED is blinking green',
          'It queries the DNS root servers for an acknowledgment record',
          'It assumes success automatically because half-duplex media cannot drop packets',
        ],
        correctOption: 0,
        explanation: 'In 802.11 CSMA/CA, the receiving station immediately responds with a Layer 2 ACK frame upon receiving and validating a frame. If the sender does not receive an ACK, it assumes a collision or drop occurred and retransmits.',
        explanationsJson: {
          1: 'Switchport link LEDs do not reflect Layer 2 Wi-Fi frame acknowledgment.',
          2: 'DNS is an application-layer name resolution protocol.',
          3: 'Half-duplex wireless media frequently drops packets due to interference and collisions.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'CSMA/CA Positive ACK Mechanism',
      },
      {
        text: 'Which Wi-Fi generation introduced OFDMA (Orthogonal Frequency Division Multiple Access) to divide wireless channels into sub-carriers for high client density?',
        options: [
          'Wi-Fi 6 / 6E (IEEE 802.11ax)',
          'Wi-Fi 4 (IEEE 802.11n)',
          'Wi-Fi 1 (IEEE 802.11b)',
          'Original IEEE 802.3 Ethernet',
        ],
        correctOption: 0,
        explanation: 'Wi-Fi 6 (802.11ax) introduced OFDMA, which divides a 20/40/80/160 MHz channel into smaller sub-carriers (Resource Units) allowing simultaneous multi-client communication in dense environments.',
        explanationsJson: {
          1: 'Wi-Fi 4 (802.11n) introduced MIMO and 40 MHz channel bonding.',
          2: 'Wi-Fi 1 (802.11b) used DSSS modulation up to 11 Mbps.',
          3: 'IEEE 802.3 is wired Ethernet, not Wi-Fi.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Wi-Fi Generations & OFDMA',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 8. NET-102: Network Performance Metrics (net-102-network-performance)
  // -------------------------------------------------------------------------
  {
    courseCode: 'NET-102',
    slug: 'net-102-network-performance',
    title: 'Network Performance Metrics: Latency, Throughput & Packet Loss',
    type: LessonType.THEORY,
    durationMinutes: 20,
    order: 6,
    visualizationType: 'PERFORMANCE_METRICS_ENGINE',
    introduction:
      'Master fundamental network performance metrics: Latency (Transmission vs Propagation delay), Throughput vs Goodput, Packet Loss, and Jitter with simple formulas and real-world scenarios.',
    contentV2: {
      objective:
        'Understand key network performance metrics—Latency, Transmission Delay, Propagation Delay, Throughput, Goodput, Packet Loss, and Jitter—and reason about performance in real-world scenarios using simple calculations.',
      explanation:
        'Network performance determines how fast and reliably data moves across a network. Rather than just raw link speed, overall user experience depends on several distinct metrics working together.\n\n### Core Performance Metrics\n- **Latency (Total Delay)**: The overall time experienced from when data is sent until it reaches its destination or a response is observed. Total delay consists of Transmission Delay, Propagation Delay, Processing Delay, and Queueing Delay.\n- **Transmission Delay ($D_{trans}$)**: The time required to push (serialize) all bits of a packet onto the physical link ($D_{trans} = \\text{Packet Length } L / \\text{Link Rate } R$).\n- **Propagation Delay ($D_{prop}$)**: The time required for the physical signal to travel across the medium distance ($D_{prop} = \\text{Distance } d / \\text{Propagation Speed } s$).\n- **Throughput**: The actual observed rate of successful data transfer across a network link (measured in bits per second, e.g., Mbps or Gbps).\n- **Goodput**: The net rate of useful application data payload delivered, excluding protocol headers (Ethernet, IP, TCP) and retransmitted packets.\n- **Packet Loss**: The percentage of transmitted packets that fail to reach their destination due to network buffer overflows or physical signal corruption.\n- **Jitter**: The variation or inconsistency in packet delay over time, which causes audio/video stuttering in real-time applications.\n\n### Simple Delay Calculations\n1. **Transmission Delay Example**:\n   Pushing a 1,000-byte (8,000 bits) packet onto a 1 Mbps (1,000,000 bits/sec) link:\n   $$D_{trans} = \\frac{8,000 \\text{ bits}}{1,000,000 \\text{ bits/s}} = 0.008 \\text{ s} = 8 \\text{ ms}$$\n\n2. **Propagation Delay Example**:\n   A signal traveling 2,000 km ($2 \\times 10^6 \\text{ meters}$) through fiber optic cable ($s \\approx 2 \\times 10^8 \\text{ m/s}$):\n   $$D_{prop} = \\frac{2 \\times 10^6 \\text{ m}}{2 \\times 10^8 \\text{ m/s}} = 0.01 \\text{ s} = 10 \\text{ ms}$$\n\n### Real-World Scenarios & Metric Tradeoffs\n- **Real-Time Voice / Video Calls**: Require **low latency** and **low jitter**. High jitter causes choppy audio, even if total link throughput is massive.\n- **Large File Downloads**: Require high **throughput** and high **goodput**. Delay variation (jitter) matters little as long as data transfers rapidly.\n- **Congested Networks**: When router egress queues fill up, **queueing delay** increases total latency and leads to **packet loss** when buffers overflow.',
      components: [
        {
          name: 'Latency & Total Delay',
          detail: 'Overall time for data transmission. Decomposed into Transmission ($L/R$), Propagation ($d/s$), Processing, and Queueing delays.',
        },
        {
          name: 'Transmission Delay ($D_{trans} = L/R$)',
          detail: 'Time needed to put packet bits onto the link. Proportional to packet size and inversely proportional to link rate.',
        },
        {
          name: 'Propagation Delay ($D_{prop} = d/s$)',
          detail: 'Time for the physical signal to cross the medium distance at light speed in cable/fiber (~$2 \\times 10^8$ m/s).',
        },
        {
          name: 'Throughput vs Goodput',
          detail: 'Throughput is total raw bit rate delivered; Goodput is net usable application payload rate after stripping headers.',
        },
        {
          name: 'Packet Loss & Jitter',
          detail: 'Packet loss occurs when router queues overflow. Jitter is delay variance over time affecting real-time streaming/VoIP.',
        },
      ],
      visualizer: {
        type: 'PERFORMANCE_METRICS_ENGINE',
        title: 'Interactive Network Performance & Traversal Visualizer',
        description: 'Visualize end-to-end packet traversal, latency components, and delivery telemetry across network nodes.',
      },
      workedExample: {
        title: 'Calculating Transmission Delay for a 1,000-Byte Packet',
        problemStatement: 'Calculate the transmission delay ($D_{trans}$) for a 1,000-byte packet sent across a 1 Mbps link.',
        stepByStepSolution: [
          '1. Convert packet size from Bytes to bits: $1,000 \\text{ Bytes} \\times 8 = 8,000 \\text{ bits}$.',
          '2. Express link rate in bits per second: $1 \\text{ Mbps} = 1,000,000 \\text{ bits/second}$.',
          '3. Apply Transmission Delay formula $D_{trans} = \\frac{L}{R} = \\frac{8,000 \\text{ bits}}{1,000,000 \\text{ bits/s}} = 0.008 \\text{ seconds}$.',
          '4. Convert seconds to milliseconds: $0.008 \\text{ s} \\times 1000 = 8 \\text{ ms}$.',
        ],
        finalResult: 'The transmission delay to push the 1,000-byte packet onto the 1 Mbps link is 8 ms.',
      },
      recap: [
        'Latency is overall delay ($D_{trans} + D_{prop} + D_{proc} + D_{queue}$).',
        'Transmission delay ($L/R$) depends on packet size and link rate; Propagation delay ($d/s$) depends on distance and speed of light.',
        'Throughput is total actual transfer rate; Goodput is net usable application payload rate.',
        'Jitter is delay variation over time; Packet loss occurs when buffers overflow or signals corrupt.',
      ],
      practice: [
        {
          id: 1,
          prompt: 'Which network performance metric measures the overall time elapsed between sending data and receiving a response at the destination?',
          expected: 'Latency (Total Delay).',
          hints: 'Think about total time elapsed from request to response.',
        },
        {
          id: 2,
          prompt: 'What is the key difference between Throughput and Goodput?',
          expected: 'Throughput is the total actual rate of raw data transferred (including headers and retransmissions); Goodput is the net rate of useful application payload delivered.',
          hints: 'Remember that protocol headers (Ethernet/IP/TCP) are excluded from Goodput.',
        },
        {
          id: 3,
          prompt: 'Which metric measures the variation or inconsistency in packet arrival delay over time?',
          expected: 'Jitter.',
          hints: 'Think of the variation in packet arrival timing that causes audio stuttering in VoIP calls.',
        },
        {
          id: 4,
          prompt: 'Calculate the transmission delay ($D_{trans}$) for a 1,000-byte packet transmitted over a 1 Mbps link.',
          expected: '8 ms (8,000 bits / 1,000,000 bits/s = 0.008 s = 8 ms).',
          hints: 'Convert 1,000 bytes to 8,000 bits, then divide by 1,000,000 bits/s.',
        },
        {
          id: 5,
          prompt: 'What primarily causes packet loss in a congested network router?',
          expected: 'Router buffer overflow (when incoming traffic exceeds link egress capacity and memory queues fill up completely).',
          hints: 'Consider what happens when a router receives more packets than its memory buffers can hold.',
        },
        {
          id: 6,
          prompt: 'For a live voice or video conference call, which performance metrics are most critical to prevent stuttering and dropouts?',
          expected: 'Low Latency and Low Jitter (along with low packet loss).',
          hints: 'Real-time applications require steady, low-delay arrival of packets rather than massive burst throughput.',
        },
      ],
    },
    questions: [
      {
        text: 'What is the operational distinction between Throughput and Goodput in network performance analysis?',
        options: [
          'Throughput is the actual rate of total data transmitted (including protocol headers and retransmissions), whereas Goodput is the net rate of usable application payload delivered to the end user',
          'Throughput applies only to wireless networks while Goodput applies only to optical fiber',
          'Throughput is measured in Bytes while Goodput is measured in volts',
          'There is no operational difference between Throughput and Goodput',
        ],
        correctOption: 0,
        explanation: 'Throughput measures all raw bits delivered across the physical link. Goodput measures only the net application payload delivered after stripping protocol headers and discarding retransmissions.',
        explanationsJson: {
          1: 'Both metrics apply universally to all network media.',
          2: 'Both are data rate metrics measured in bits per second.',
          3: 'They measure fundamentally different data rates.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Throughput vs Goodput',
      },
      {
        text: 'What is Transmission Delay (D_trans) in network latency decomposition?',
        options: [
          'The time required to push (serialize) all bits of a packet onto the physical communication link',
          'The time required for a physical signal to travel across the distance of a cable',
          'The time a router takes to inspect a packet header and lookup a route',
          'The variation in arrival time between consecutive packets',
        ],
        correctOption: 0,
        explanation: 'Transmission delay (D_trans = L / R) is the time needed to serialize all bits of a packet of length L onto a link of rate R.',
        explanationsJson: {
          1: 'Signal traversal time across distance is Propagation Delay (D_prop).',
          2: 'Router header inspection time is Processing Delay (D_proc).',
          3: 'Variation in arrival time is Jitter.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Transmission Delay Definition',
      },
      {
        text: 'How is Transmission Delay (D_trans) calculated for a packet of length L bits on a link of rate R bits per second?',
        options: [
          'D_trans = L / R',
          'D_trans = L * R',
          'D_trans = Distance / Speed of Light',
          'D_trans = R / L',
        ],
        correctOption: 0,
        explanation: 'Transmission Delay is calculated by dividing packet size L in bits by link rate R in bits per second (D_trans = L / R).',
        explanationsJson: {
          1: 'Multiplying length by rate yields incorrect units.',
          2: 'Distance / Speed of Light is the formula for Propagation Delay.',
          3: 'Rate divided by length is the inverse frequency, not delay.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Transmission Delay Formula',
      },
      {
        text: 'What performance metric measures the variation or inconsistency in packet delay over time?',
        options: [
          'Jitter',
          'Goodput',
          'Bandwidth',
          'Propagation Delay',
        ],
        correctOption: 0,
        explanation: 'Jitter is the measure of delay variance over time. High jitter causes packet arrival irregularities, severely disrupting real-time VoIP and video calls.',
        explanationsJson: {
          1: 'Goodput measures net application payload delivery rate.',
          2: 'Bandwidth measures maximum link capacity.',
          3: 'Propagation delay measures signal travel time over distance.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Jitter Definition',
      },
      {
        text: 'What is the primary cause of Packet Loss in a congested network router?',
        options: [
          'Router queue buffer overflow when incoming packet arrival rate exceeds outgoing link capacity',
          'Operating system kernel updating firewall rules',
          'Web browser downloading a large static image file',
          'High speed of light in fiber optic cables',
        ],
        correctOption: 0,
        explanation: 'When network congestion occurs and router egress memory queues fill completely, newly arriving packets are dropped, resulting in packet loss.',
        explanationsJson: {
          1: 'Updating firewall rules does not cause buffer overflows.',
          2: 'Downloading files consumes bandwidth but only causes loss if buffers overflow.',
          3: 'Speed of light affects propagation delay, not packet loss.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Packet Loss Causes',
      },
      {
        text: 'A user experiences choppy audio and dropped words during a live video call. Which pair of network performance metrics is most likely degraded?',
        options: [
          'High Latency and High Jitter',
          'High Bandwidth and High Goodput',
          'Low Transmission Delay and High Goodput',
          'Low Propagation Delay and Zero Packet Loss',
        ],
        correctOption: 0,
        explanation: 'Real-time interactive audio and video applications are highly sensitive to high latency and high jitter (delay variation), causing choppy audio and stuttering.',
        explanationsJson: {
          1: 'High bandwidth and high goodput improve transfer rates, not degrade them.',
          2: 'Low transmission delay improves performance.',
          3: 'Low propagation delay and zero packet loss represent ideal network conditions.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Real-World Performance Scenario Reasoning',
      },
    ],
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
    durationMinutes: 20,
    order: 2,
    visualizationType: 'OSI_STACK_FLOW',
    introduction:
      'Learn how computers structure network communication using the 7-Layer Open Systems Interconnection (OSI) Reference Model. Discover the purpose of each layer (from Physical to Application), how data moves down and up the stack through encapsulation and decapsulation, and how the model simplifies network design and troubleshooting.',
    contentV2: {
      objective:
        'Understand why layered networking models exist, identify all 7 layers of the OSI Reference Model and their core responsibilities, explain the mechanics of encapsulation and decapsulation, and apply the model to isolate simple network problems.',
      prerequisites: [
        'net-101-bits-bytes-binary-hex',
        'level-0-what-is-a-computer-network',
      ],
      whyItMatters:
        'Modern computer networks involve thousands of hardware and software components built by different manufacturers. Without a common model, diagnosing network issues or designing interoperable software would be chaotic. The OSI model provides a universal roadmap that network engineers use daily to describe protocols and isolate troubleshooting problems (such as determining whether an issue is a broken cable at Layer 1, a routing failure at Layer 3, or a web server issue at Layer 7).',
      explanation:
        'Networking is complex. Breaking communication into modular layers allows hardware and software developers to build components independently—for example, a web browser developer does not need to worry about whether the physical cable is copper, optical fiber, or Wi-Fi.\n\n1. What the OSI Model Is:\nCreated by the International Organization for Standardization (ISO), the Open Systems Interconnection (OSI) model organizes network communication into 7 distinct functional layers, numbered from Layer 1 (bottom) to Layer 7 (top).\n\n2. The 7 Layers Explained:\n- Layer 7 — Application Layer: The interface between user software and the network. Provides network services directly to user applications (Examples: HTTP/HTTPS for web browsing, DNS for domain lookups, SMTP for email).\n- Layer 6 — Presentation Layer: Handles how data is formatted, translated, compressed, and encrypted so both sender and receiver understand the data format (Examples: TLS/SSL encryption, JPEG/PNG images, ASCII text encoding).\n- Layer 5 — Session Layer: Manages the establishment, maintenance, and termination of communication sessions and dialogs between applications.\n- Layer 4 — Transport Layer: Responsible for end-to-end communication, dividing data into manageable chunks (segments), tracking port numbers, and managing flow control (Examples: TCP for reliable delivery, UDP for fast real-time streaming).\n- Layer 3 — Network Layer: Responsible for logical addressing (IP addresses) and path determination (routing) to move data (packets) across different interconnected networks (Examples: IPv4, IPv6, Routers).\n- Layer 2 — Data Link Layer: Responsible for physical hardware addressing (MAC addresses) and packaging data into frames to move between directly connected devices on the same local network (Examples: Ethernet, Wi-Fi frames, Network Switches).\n- Layer 1 — Physical Layer: Responsible for transmitting raw binary bits (1s and 0s) as physical electrical voltages, light pulses, or radio signals across transmission media (Examples: Copper cables, optical fiber, radio antennas, network connectors).\n\n3. Encapsulation and Decapsulation:\n- Encapsulation (Sender Downward Flow): When you send data, it starts at Layer 7. As it travels down the stack, each layer wraps the payload with its own header containing crucial control information (e.g., Layer 4 adds port numbers, Layer 3 adds IP addresses, Layer 2 adds MAC addresses and an error check trailer). Finally, Layer 1 converts everything into physical bits on the wire.\n- Decapsulation (Receiver Upward Flow): When the receiving computer receives the raw bits at Layer 1, it reads the data upward. Each layer reads its specific header, validates the information, strips the header off, and passes the remaining payload up to the next higher layer until the application receives the original message.\n\n4. Troubleshooting with the Model:\nNetwork technicians frequently troubleshoot "bottom-up"—starting at Layer 1 to check cables and link lights, moving to Layer 2 to check local switch connectivity, Layer 3 to check IP reachability with ping, and up to Layer 7 to check application servers.',
      components: [
        {
          name: 'Layer 7: Application Layer',
          detail: 'Direct interface with user software applications. Handles protocols like HTTP/HTTPS for web pages, DNS for name resolution, and SSH/SMTP for remote management and email.',
        },
        {
          name: 'Layer 6: Presentation Layer',
          detail: 'Translates, formats, compresses, and encrypts data (such as TLS/SSL encryption and ASCII/JPEG formatting) so software on different operating systems understands the format.',
        },
        {
          name: 'Layer 5: Session Layer',
          detail: 'Opens, manages, and closes communication sessions and dialogs between applications across network endpoints.',
        },
        {
          name: 'Layer 4: Transport Layer',
          detail: 'Handles end-to-end communication, port numbers (identifying specific applications), and segment management (TCP for reliable delivery, UDP for fast streaming).',
        },
        {
          name: 'Layer 3: Network Layer',
          detail: 'Handles logical addressing (IPv4 and IPv6 addresses) and path determination (routing) to deliver packets across different interconnected networks.',
        },
        {
          name: 'Layer 2: Data Link Layer',
          detail: 'Handles physical hardware addressing (MAC addresses), frame creation, and error checking between directly connected devices on a local network (Ethernet switches).',
        },
        {
          name: 'Layer 1: Physical Layer',
          detail: 'Transmits raw binary 1s and 0s (bits) as physical electrical voltages, optical light pulses, or radio signals across copper cables, fiber strands, and wireless links.',
        },
      ],
      howItWorks: [
        {
          stepNumber: 1,
          title: 'Application Data Creation (Layers 7–5)',
          action: 'The sender application produces message data, the presentation layer formats and encrypts it, and the session layer establishes the connection.',
        },
        {
          stepNumber: 2,
          title: 'Transport & Network Packaging (Layers 4–3)',
          action: 'The transport layer adds port numbers (Segment); the network layer adds source and destination IP addresses (Packet).',
        },
        {
          stepNumber: 3,
          title: 'Framing & Physical Bit Transmission (Layers 2–1)',
          action: 'The data link layer adds MAC addresses and an error-checking trailer (Frame); the physical layer converts the frame into physical electrical or optical signals (Bits).',
        },
      ],
      visualizer: {
        type: 'OSI_STACK_FLOW',
        title: 'Interactive 7-Layer OSI Model Stack',
        description: 'Explore the 7 layers of the OSI model, inspect protocols at each layer, and toggle between Sender Encapsulation (downward) and Receiver Decapsulation (upward).',
      },
      workedExample: {
        title: 'Tracing Web Browsing Down and Up the OSI Stack',
        problemStatement: 'Trace how a web browser request (https://example.com) is encapsulated by a user laptop and decapsulated by the web server.',
        stepByStepSolution: [
          '1. Layer 7–5 (Application): The web browser creates an HTTPS GET request and encrypts it with TLS.',
          '2. Layer 4 (Transport): Adds a TCP header with destination port 443 (forming a Transport Segment).',
          '3. Layer 3 (Network): Adds an IPv4 header with the laptop IP and web server IP (forming an IP Packet).',
          '4. Layer 2 (Data Link): Adds an Ethernet header with source and destination MAC addresses plus an error-checking FCS trailer (forming an Ethernet Frame).',
          '5. Layer 1 (Physical): Converts the frame into electrical voltage pulses transmitted over the copper Ethernet cable.',
          '6. Receiver Decapsulation: The web server receives the bits at Layer 1, strips the Ethernet frame at Layer 2, strips the IP packet header at Layer 3, reads port 443 at Layer 4, and delivers the decrypted HTTPS request to the web server software at Layer 7.',
        ],
        finalResult: 'Sender: Data -> Segment -> Packet -> Frame -> Bits. Receiver: Bits -> Frame -> Packet -> Segment -> Data.',
      },
      practice: [
        {
          id: 1,
          prompt: 'Which OSI layer is responsible for logical addressing (such as IPv4 and IPv6 addresses) and routing packets between different networks?',
          expected: 'Layer 3 — Network Layer.',
          hints: 'Think about which layer uses IP addresses and routers.',
        },
        {
          id: 2,
          prompt: 'Which OSI layer handles physical hardware addressing (MAC addresses) and packages data into frames for local network communication?',
          expected: 'Layer 2 — Data Link Layer.',
          hints: 'Think about local network switches and Ethernet MAC addresses.',
        },
        {
          id: 3,
          prompt: 'What happens during data encapsulation on a sending computer as data travels down the OSI stack?',
          expected: 'Each layer adds its own protocol header information to the data as it moves downward toward Layer 1.',
          hints: 'Recall how headers are added layer by layer from Layer 7 to Layer 1.',
        },
        {
          id: 4,
          prompt: 'At which OSI layer do protocols like TCP and UDP operate to manage port numbers and end-to-end data delivery?',
          expected: 'Layer 4 — Transport Layer.',
          hints: 'Consider which layer handles reliable delivery, segments, and port numbers.',
        },
        {
          id: 5,
          prompt: 'If a network cable is unplugged or severed, at which OSI layer has the failure occurred?',
          expected: 'Layer 1 — Physical Layer.',
          hints: 'Consider the layer that deals with physical cables, connectors, and electrical/optical signals.',
        },
        {
          id: 6,
          prompt: 'Which OSI layer directly interacts with end-user software applications such as web browsers and email clients?',
          expected: 'Layer 7 — Application Layer.',
          hints: 'Think of the top layer closest to the human user (HTTP, DNS, SMTP).',
        },
      ],
      recap: [
        'The OSI Reference Model organizes network communication into 7 modular layers from Layer 1 (Physical) to Layer 7 (Application).',
        'Layer 1 (Physical) transmits bits; Layer 2 (Data Link) uses MAC addresses and frames; Layer 3 (Network) uses IP addresses and packets.',
        'Layer 4 (Transport) manages port numbers and segment delivery (TCP/UDP); Layers 5–7 manage sessions, data formatting/encryption, and user applications (HTTP/DNS).',
        'Encapsulation adds headers as data moves down the stack on the sender; Decapsulation strips headers as data moves up the stack on the receiver.',
        'The model provides a common language for network design and systematic bottom-up troubleshooting.',
      ],
    },
    questions: [
      {
        text: 'Why was the 7-Layer OSI Reference Model created, and how does it help network engineers?',
        options: [
          'It provides a standard vendor-neutral framework dividing network communication into 7 distinct layers for learning and troubleshooting',
          'It is a physical piece of hardware installed in all network switches and routers',
          'It forces every computer in the world to run the exact same operating system',
          'It replaces the need for physical network cables and wireless antennas',
        ],
        correctOption: 0,
        explanation:
          'The OSI model standardizes network communication into 7 functional layers, allowing different vendors to create compatible products and giving engineers a structured model for learning and troubleshooting.',
        explanationsJson: {
          1: 'OSI is a conceptual reference model, not a physical hardware device.',
          2: 'OSI allows heterogeneous systems running different OSs to interoperate.',
          3: 'Physical media (Layer 1) are still essential for transmission.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'OSI Model Purpose and Architecture',
      },
      {
        text: 'What is the correct sequence of the 7 OSI layers from bottom to top (Layer 1 to Layer 7)?',
        options: [
          '1. Physical, 2. Data Link, 3. Network, 4. Transport, 5. Session, 6. Presentation, 7. Application',
          '1. Application, 2. Presentation, 3. Session, 4. Transport, 5. Network, 6. Data Link, 7. Physical',
          '1. Physical, 2. Network, 3. Data Link, 4. Transport, 5. Session, 6. Presentation, 7. Application',
          '1. Hardware, 2. Driver, 3. Internet, 4. Port, 5. App, 6. Screen, 7. User',
        ],
        correctOption: 0,
        explanation:
          'From Layer 1 (bottom) to Layer 7 (top), the layers are: 1. Physical, 2. Data Link, 3. Network, 4. Transport, 5. Session, 6. Presentation, 7. Application (mnemonic: "Please Do Not Throw Sausage Pizza Away").',
        explanationsJson: {
          1: 'This order is reversed (Layer 7 down to Layer 1).',
          2: 'Data Link is Layer 2 and Network is Layer 3.',
          3: 'These are informal hardware/software terms, not official ISO/OSI model layers.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'OSI 7 Layers Sequence',
      },
      {
        text: 'Which OSI layer is responsible for logical addressing (IP addresses) and determining the path to route packets across different networks?',
        options: [
          'Layer 3 — Network Layer',
          'Layer 1 — Physical Layer',
          'Layer 4 — Transport Layer',
          'Layer 7 — Application Layer',
        ],
        correctOption: 0,
        explanation:
          'The Network Layer (Layer 3) handles logical addressing (IPv4 and IPv6) and path determination (routing) to deliver packets across interconnected networks.',
        explanationsJson: {
          1: 'Layer 1 (Physical) deals only with raw physical bits and cables.',
          2: 'Layer 4 (Transport) handles port numbers and end-to-end transport delivery.',
          3: 'Layer 7 (Application) interfaces with user software applications.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Network Layer Responsibilities',
      },
      {
        text: 'Which OSI layer handles physical hardware addressing (MAC addresses) and packages data into frames to transmit between directly connected devices on a local network?',
        options: [
          'Layer 2 — Data Link Layer',
          'Layer 5 — Session Layer',
          'Layer 3 — Network Layer',
          'Layer 6 — Presentation Layer',
        ],
        correctOption: 0,
        explanation:
          'The Data Link Layer (Layer 2) manages physical MAC addressing, framing, and local hop-to-hop transfer across local Ethernet switches or Wi-Fi links.',
        explanationsJson: {
          1: 'Layer 5 (Session) manages dialogs and sessions between applications.',
          2: 'Layer 3 (Network) handles logical IP addresses, not physical MAC addresses.',
          3: 'Layer 6 (Presentation) handles formatting and data encryption.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Data Link Layer Responsibilities',
      },
      {
        text: 'What occurs during data encapsulation as an outgoing message travels down the OSI stack on a sending device?',
        options: [
          'Each layer adds its own specific protocol header information to the data as it moves downward toward Layer 1',
          'The sending device strips all headers to make the packet as small as possible',
          'The data is converted directly into a wireless radio wave at Layer 7',
          'The computer deletes the payload and sends only blank test signals',
        ],
        correctOption: 0,
        explanation:
          'During encapsulation, each layer on the sender adds its own header (and trailer at Layer 2) containing necessary control information as data travels downward from Layer 7 to Layer 1.',
        explanationsJson: {
          1: 'Stripping headers is decapsulation, which occurs on the receiving device.',
          2: 'Physical signaling occurs at Layer 1, not Layer 7.',
          3: 'Encapsulation preserves and transports the actual application data payload.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Encapsulation Mechanics',
      },
      {
        text: 'A user cannot browse the web. A technician notices that the network cable is completely unplugged and no link lights are glowing on the computer network port. At which OSI layer does this problem originate?',
        options: [
          'Layer 1 — Physical Layer',
          'Layer 7 — Application Layer',
          'Layer 4 — Transport Layer',
          'Layer 6 — Presentation Layer',
        ],
        correctOption: 0,
        explanation:
          'Physical cables, connectors, link lights, and electrical signals belong to Layer 1 (Physical Layer). An unplugged cable is a Layer 1 fault.',
        explanationsJson: {
          1: 'While the web browser (Layer 7) fails to load, the root cause is the unplugged physical cable.',
          2: 'Transport (Layer 4) cannot function without an active physical connection.',
          3: 'Presentation (Layer 6) deals with data formatting, not physical cable connections.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Layered Troubleshooting Scenario',
      },
    ],
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
      'Master the pragmatic implementation architecture of the global Internet: The TCP/IP 4-Layer Model (RFC 1122), its functional layers, real-world protocol examples, conceptual mapping to the 7-layer OSI model, and data encapsulation flow.',
    contentV2: {
      objective:
        'Understand the 4 layers of the TCP/IP suite (Application, Transport, Internet, Network Access), learn common protocol examples for each layer, master the conceptual mapping to the 7-layer OSI model, and trace top-down data encapsulation.',
      explanation:
        'While the 7-layer OSI model serves as an ideal theoretical reference, the 4-layer TCP/IP model (RFC 1122) represents the pragmatic operational architecture powering the global Internet.\n\n### Why the TCP/IP Model Exists\nIn the 1970s and 1980s, the US Department of Defense (DARPA) created the TCP/IP protocol suite to build a resilient, real-world internetwork. Rather than strictly separating presentation formats and session state into dedicated layers, TCP/IP combined these functions into software applications running in user space. The result is a lean, 4-layer model implemented in modern operating system kernels.\n\n### The 4 TCP/IP Layers\n1. **Application Layer**: Provides network services directly to end-user software applications. It handles user data, data formatting, encryption (TLS), and session state. (Examples: HTTP, HTTPS, DNS, SSH, FTP, SMTP).\n2. **Transport Layer**: Manages end-to-end communication between hosts using port numbers to multiplex traffic. It offers reliable, connection-oriented transfer (TCP) or fast, lightweight transfer (UDP). (Examples: TCP, UDP).\n3. **Internet Layer**: Responsible for logical addressing and routing packets across interconnected networks. It determines the best path from source to destination IP address. (Examples: IP / IPv4 / IPv6, ICMP, ARP).\n4. **Network Access (Link) Layer**: Handles physical MAC addressing, framing, and transmission of raw signals across physical media. It combines OSI Layer 1 (Physical) and Layer 2 (Data Link). (Examples: Ethernet, Wi-Fi 802.11).\n\n### Conceptual Mapping: TCP/IP vs OSI Model\nThe TCP/IP model aligns conceptually with the 7-layer OSI reference model as follows:\n- **TCP/IP Application Layer** ↔ **OSI Application (L7), Presentation (L6), & Session (L5)**\n- **TCP/IP Transport Layer** ↔ **OSI Transport Layer (L4)**\n- **TCP/IP Internet Layer** ↔ **OSI Network Layer (L3)**\n- **TCP/IP Network Access Layer** ↔ **OSI Data Link (L2) & Physical Layer (L1)**\n\n*Note: This is a conceptual mapping to help engineers correlate theoretical concepts with practical protocols. The models were developed by different organizations and are not identical in design.*\n\n### Data Encapsulation in TCP/IP\nWhen an application sends data across a network:\n1. **Application Payload** (e.g. HTTP GET request) is generated in user space.\n2. **Transport Layer** adds a TCP or UDP header containing source/destination port numbers, creating a **Segment**.\n3. **Internet Layer** adds an IP header containing source/destination IP addresses, creating a **Packet**.\n4. **Network Access Layer** adds an Ethernet header (MAC addresses) and trailer (FCS), creating a **Frame**, which is transmitted as physical signals.',
      components: [
        {
          name: 'Application Layer (OSI L7, L6, L5)',
          detail: 'User-space software services, data formatting, TLS encryption, and session state. Protocols: HTTP, HTTPS, DNS, SSH, SMTP.',
        },
        {
          name: 'Transport Layer (OSI L4)',
          detail: 'End-to-end communication, port multiplexing, flow control, and reliability. Protocols: TCP (connection-oriented), UDP (connectionless).',
        },
        {
          name: 'Internet Layer (OSI L3)',
          detail: 'Logical IP addressing, packet formatting, and inter-network routing. Protocols: IPv4, IPv6, ICMP, ARP.',
        },
        {
          name: 'Network Access / Link Layer (OSI L2, L1)',
          detail: 'Physical MAC addressing, local framing, link-layer transfer, and physical bit transmission. Standards: Ethernet, Wi-Fi (802.11).',
        },
      ],
      visualizer: {
        type: 'TCPIP_OSI_COMPARATOR',
        title: 'Side-by-Side TCP/IP vs OSI Model Comparison',
        description: 'Interactive side-by-side comparator mapping 4 TCP/IP layers to 7 OSI layers with real-world protocol assignments.',
      },
      workedExample: {
        title: 'Tracing Encapsulation for an HTTPS Request',
        problemStatement: 'Trace an outgoing HTTPS request to https://example.com through the 4 TCP/IP layers.',
        stepByStepSolution: [
          '1. Application Layer: User browser constructs an HTTP GET request and encrypts it with TLS in user space.',
          '2. Transport Layer: OS kernel wraps the HTTP payload with a TCP header specifying source port 51234 and destination port 443 (TCP Segment).',
          '3. Internet Layer: OS kernel wraps the TCP Segment with an IPv4 header specifying source IP 192.168.1.100 and destination IP 93.184.216.34 (IP Packet).',
          '4. Network Access Layer: Network Interface Card driver wraps the IP Packet with an Ethernet header (MAC addresses) and trailer (Frame), then converts bits into physical signals.',
        ],
        finalResult: 'The payload traverses the 4 TCP/IP layers, forming a complete Ethernet Frame ready for network transmission.',
      },
      recap: [
        'The TCP/IP model consists of 4 pragmatic layers: Application, Transport, Internet, and Network Access (Link).',
        'TCP/IP Application combines OSI Layers 5, 6, and 7; Network Access combines OSI Layers 1 and 2.',
        'Common protocols include HTTP/DNS (Application), TCP/UDP (Transport), IP (Internet), and Ethernet/Wi-Fi (Network Access).',
        'Data encapsulation wraps application data in headers at each layer as it travels down the stack.',
      ],
      practice: [
        {
          id: 1,
          prompt: 'Map the following common protocols to their corresponding TCP/IP layers: (a) HTTP, (b) TCP, (c) IP, (d) Ethernet.',
          expected: 'HTTP -> Application Layer; TCP -> Transport Layer; IP -> Internet Layer; Ethernet -> Network Access Layer.',
          hints: 'Recall which protocols handle applications, ports, network addressing, and physical media framing.',
        },
        {
          id: 2,
          prompt: 'Which TCP/IP layers correspond to (a) OSI Layers 5, 6, and 7, (b) OSI Layer 3, and (c) OSI Layers 1 and 2?',
          expected: '(a) Application Layer, (b) Internet Layer, (c) Network Access Layer.',
          hints: 'Remember that TCP/IP combines the top three OSI layers and bottom two OSI layers.',
        },
        {
          id: 3,
          prompt: 'Explain the distinct functional roles of the Transport Layer (TCP/UDP) vs the Internet Layer (IP).',
          expected: 'Transport Layer manages process-to-process communication using port numbers; Internet Layer manages host-to-host packet routing across networks using IP addresses.',
          hints: 'Consider the difference between port numbers and IP addresses.',
        },
        {
          id: 4,
          prompt: 'List the 4 TCP/IP layers in correct top-to-bottom sequence starting from Layer 4 down to Layer 1.',
          expected: 'Layer 4: Application → Layer 3: Transport → Layer 2: Internet → Layer 1: Network Access (Link).',
          hints: 'Start at user software applications at the top down to physical link access at the bottom.',
        },
        {
          id: 5,
          prompt: 'Why does the TCP/IP model collapse OSI Session (L5) and Presentation (L6) functions into the Application layer?',
          expected: 'Encryption (TLS), data formatting (JSON/HTML), and session state are implemented inside user-space application software rather than in separate OS network kernel modules.',
          hints: 'Think about where web browsers and OpenSSL execute (user space vs OS kernel space).',
        },
        {
          id: 6,
          prompt: 'Trace the encapsulation Data Unit terms as an outgoing web request travels down the TCP/IP stack from Layer 4 to Layer 1.',
          expected: 'Application Data Payload → Transport Segment → Internet Packet → Network Access Frame → Physical Signals/Bits.',
          hints: 'Recall the PDU names: Payload, Segment, Packet, Frame.',
        },
      ],
    },
    questions: [
      {
        text: 'What is the primary difference between the 4-layer TCP/IP model and the 7-layer OSI model?',
        options: [
          'TCP/IP is a practical operational model implemented in operating systems, while OSI is a conceptual reference framework',
          'TCP/IP is purely theoretical and has never been implemented in real network hardware',
          'TCP/IP replaces IP addresses with physical cable connectors',
          'OSI is a 4-layer model and TCP/IP is a 7-layer model',
        ],
        correctOption: 0,
        explanation: 'The TCP/IP model (RFC 1122) represents the practical implementation suite used across the global Internet, whereas the OSI model is a theoretical 7-layer reference framework.',
        explanationsJson: {
          1: 'TCP/IP is the actual operational suite of the Internet.',
          2: 'TCP/IP uses IP addresses at the Internet layer.',
          3: 'OSI has 7 layers and TCP/IP has 4 layers.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'TCP/IP Model Purpose',
      },
      {
        text: 'What is the correct top-to-bottom sequence of the 4 TCP/IP model layers?',
        options: [
          'Application → Transport → Internet → Network Access (Link)',
          'Physical → Network → Transport → Application',
          'Internet → Transport → Application → Network Access',
          'Network Access → Internet → Transport → Application',
        ],
        correctOption: 0,
        explanation: 'The top-to-bottom order of the TCP/IP model layers is: Application (Layer 4), Transport (Layer 3), Internet (Layer 2), Network Access / Link (Layer 1).',
        explanationsJson: {
          1: 'This lists OSI layer names, not the 4 TCP/IP layers.',
          2: 'Application is at the top of the stack, not Internet.',
          3: 'This order is reversed (bottom-to-top).',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'TCP/IP 4 Layers Sequence',
      },
      {
        text: 'Which TCP/IP layer is responsible for logical addressing (IP addresses) and routing packets across interconnected networks?',
        options: [
          'Internet Layer',
          'Application Layer',
          'Transport Layer',
          'Network Access Layer',
        ],
        correctOption: 0,
        explanation: 'The Internet Layer handles IP addressing (IPv4/IPv6) and path determination (routing) to deliver packets across networks.',
        explanationsJson: {
          1: 'Application Layer interfaces with software applications.',
          2: 'Transport Layer handles port numbers and end-to-end communication.',
          3: 'Network Access Layer handles MAC addressing and physical transmission.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Internet Layer Responsibilities',
      },
      {
        text: 'Which protocols correctly match their corresponding TCP/IP layers?',
        options: [
          'HTTP at Application, TCP at Transport, IP at Internet, Ethernet at Network Access',
          'IP at Application, HTTP at Transport, Ethernet at Internet, TCP at Network Access',
          'TCP at Application, Ethernet at Transport, IP at Internet, HTTP at Network Access',
          'Ethernet at Application, IP at Transport, TCP at Internet, HTTP at Network Access',
        ],
        correctOption: 0,
        explanation: 'HTTP is an Application protocol, TCP is a Transport protocol, IP is an Internet protocol, and Ethernet is a Network Access protocol.',
        explanationsJson: {
          1: 'IP is Internet layer, HTTP is Application layer.',
          2: 'TCP is Transport layer, Ethernet is Network Access layer.',
          3: 'Ethernet is Network Access layer, HTTP is Application layer.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'TCP/IP Protocol Classification',
      },
      {
        text: 'How does the TCP/IP 4-layer stack align conceptually with the 7-layer OSI model?',
        options: [
          'TCP/IP Application combines OSI Layers 5, 6, and 7; Transport maps to OSI Layer 4; Internet maps to OSI Layer 3; Network Access combines OSI Layers 1 and 2',
          'TCP/IP combines all 7 OSI layers into 1 single layer',
          'TCP/IP maps directly 1-to-1 with all 7 OSI layers',
          'TCP/IP Network Access maps to OSI Layer 7 Application',
        ],
        correctOption: 0,
        explanation: 'TCP/IP combines OSI Application, Presentation, and Session into Application; maps Transport to Transport, Internet to Network, and combines Data Link and Physical into Network Access.',
        explanationsJson: {
          1: 'TCP/IP has 4 functional layers.',
          2: 'TCP/IP has 4 layers, while OSI has 7 layers.',
          3: 'Network Access corresponds to OSI Layers 1 and 2, not Layer 7.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'OSI vs TCP/IP Conceptual Mapping',
      },
      {
        text: 'What is the correct order of data encapsulation terms as an outgoing web request travels down the TCP/IP stack?',
        options: [
          'Application Data Payload → Transport Segment → Internet Packet → Network Access Frame',
          'Frame → Packet → Segment → Application Payload',
          'Internet Packet → Frame → Segment → Bits',
          'Transport Segment → Frame → Packet → Payload',
        ],
        correctOption: 0,
        explanation: 'As data descends the stack, the Application Payload is wrapped in a Transport Segment (TCP header), an Internet Packet (IP header), and a Network Access Frame (Ethernet header/trailer).',
        explanationsJson: {
          1: 'This is the decapsulation order (bottom-up).',
          2: 'Application payload comes first at the top of the stack.',
          3: 'Segment precedes Packet, which precedes Frame.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'TCP/IP Encapsulation Flow',
      },
    ],
  },
];

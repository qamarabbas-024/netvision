import { FLAGSHIP_5_COURSES, FlagshipCourseDefinition } from '@netvision/shared';

export interface FallbackLesson {
  id: string;
  slug: string;
  title: string;
  type: 'LESSON' | 'LAB' | 'QUIZ' | 'THEORY';
  durationMinutes: number;
  completed?: boolean;
  score?: number | null;
  contentMarkdown?: string;
  visualizationType?: string;
  visualType?: string;
  labConfig?: any;
  course?: {
    id: string;
    title: string;
    slug: string;
    level: string;
    modules?: any[];
  };
  module?: {
    id: string;
    title: string;
  };
  content?: any;
  components?: Array<{ name: string; detail: string }>;
  howItWorks?: Array<{ stepNumber: number; title: string; action: string }>;
  troubleshooting?: Array<{
    symptom: string;
    possibleCauses: string[];
    diagnosticSteps: string[];
    remediation: string;
  }>;
  security?: {
    threatOrVulnerability: string;
    mitigationStrategy: string;
  };
  objectives?: Array<{ id: string; text: string; order?: number }>;
  concepts?: Array<{ id: string; title: string; summary?: string; explanation?: string; order?: number }>;
  examples?: Array<{ id: string; title: string; scenario: string; explanation: string; order?: number }>;
  commands?: Array<{ id: string; command: string; description: string; expectedOutput?: string }>;
  labs?: any[];
  practice?: Array<{ id?: number | string; prompt: string; expected: string; hints?: string }>;
  mistakes?: Array<{ id: string; mistake: string; whyWrong: string; correctApproach: string; order?: number }>;
  recaps?: Array<{ id: string; point: string; order?: number }>;
  quiz?: {
    id: string;
    title: string;
    passingScore: number;
    questionCount: number;
    questions: Array<{
      id: string;
      questionText: string;
      options: string[];
      correctOption?: number;
      explanation?: string;
      explanationsJson?: Record<number, string>;
    }>;
  } | null;
}

export interface FallbackModule {
  id: string;
  title: string;
  description: string;
  lessons: FallbackLesson[];
}

export interface FallbackCourse {
  id: string;
  code: string;
  credentialCode?: string;
  slug: string;
  title: string;
  tagline: string;
  category: string;
  description: string;
  level: 'FOUNDATIONAL' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  icon: string;
  estimatedHours: number;
  lessonsCount: number;
  labsCount: number;
  prerequisites: string[];
  modules: FallbackModule[];
  progressPercent?: number;
  isLocked?: boolean;
}

function buildFallbackLessonsForModule(moduleSlug: string, moduleTitle: string): FallbackLesson[] {
  if (moduleSlug === 'digital-representation') {
    return [
      {
        id: 'les-c01-m01-01',
        slug: 'net-101-bits-bytes-binary-hex',
        title: 'Bits, Bytes, Binary & Hexadecimal',
        type: 'THEORY',
        durationMinutes: 15,
        visualizationType: 'BINARY_CONVERTER',
        visualType: 'BINARY_CONVERTER',
        contentMarkdown: '# Bits, Bytes, Binary & Hexadecimal\n\nFoundational binary data representation, positional bit weights, and hexadecimal conversions.',
      },
      {
        id: 'les-c01-m01-01-alias',
        slug: 'what-is-binary',
        title: 'Bits, Bytes, Binary & Hexadecimal',
        type: 'THEORY',
        durationMinutes: 15,
        visualizationType: 'BINARY_CONVERTER',
        visualType: 'BINARY_CONVERTER',
        contentMarkdown: '# What Is Binary?\n\nFoundational digital bit representation, 8-bit octets, and base-2 mathematics in computer networks.',
      },
      {
        id: 'les-c01-m01-02',
        slug: 'network-devices-overview',
        title: 'Physical Network Interfaces, Media & Transceivers',
        type: 'THEORY',
        durationMinutes: 20,
        visualizationType: 'MEDIA_INSPECTOR',
        visualType: 'MEDIA_INSPECTOR',
        contentMarkdown: '# Physical Interfaces & Media\n\nCopper twisted pair, fiber optics, and transceiver interfaces.',
      },
      {
        id: 'les-c01-m01-03',
        slug: 'level-0-devices-in-a-network',
        title: 'Devices in a Network: Hardware Roles & Layer Mapping',
        type: 'THEORY',
        durationMinutes: 20,
        contentMarkdown: '# Network Hardware Roles\n\nRouters, switches, access points, and OSI layer classifications.',
      },
    ];
  }

  return [
    {
      id: `les-${moduleSlug}-theory`,
      slug: `${moduleSlug}-foundations`,
      title: `${moduleTitle}: Protocol Foundations`,
      type: 'LESSON',
      durationMinutes: 20,
      contentMarkdown: `# ${moduleTitle}\n\nComprehensive exploration of core protocol architecture, framing, and packet telemetry.`,
      visualType: 'packet-dissector',
    },
    {
      id: `les-${moduleSlug}-interactive-lab`,
      slug: `${moduleSlug}-lab`,
      title: `${moduleTitle}: Hands-On Verification Lab`,
      type: 'LAB',
      durationMinutes: 30,
      contentMarkdown: `# Practical Hands-on Lab\n\nVerify interface state, packet routing, and protocol convergence.`,
      visualType: 'topology-sandbox',
    },
    {
      id: `les-${moduleSlug}-assessment-quiz`,
      slug: `${moduleSlug}-quiz`,
      title: `${moduleTitle}: Assessment Check`,
      type: 'QUIZ',
      durationMinutes: 15,
      contentMarkdown: `# Knowledge Check\n\nDemonstrate mastery of protocol mechanisms.`,
    },
  ];
}

export const FALLBACK_COURSES: FallbackCourse[] = FLAGSHIP_5_COURSES.map((fDef: FlagshipCourseDefinition) => {
  const modules: FallbackModule[] = fDef.modules.map((m) => ({
    id: m.id,
    title: m.title,
    description: m.description,
    lessons: buildFallbackLessonsForModule(m.slug, m.title),
  }));

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalLabs = modules.reduce((acc, m) => acc + m.lessons.filter((l) => l.type === 'LAB').length, 0);

  return {
    id: `course-${fDef.code.toLowerCase()}`,
    code: fDef.code,
    credentialCode: fDef.credentialCode,
    slug: fDef.slug,
    title: fDef.title,
    tagline: fDef.tagline,
    category: fDef.category,
    description: fDef.description,
    level: fDef.level,
    icon: fDef.icon,
    estimatedHours: fDef.estimatedHours,
    lessonsCount: totalLessons,
    labsCount: totalLabs,
    prerequisites: fDef.prerequisites,
    modules,
    progressPercent: 0,
    isLocked: false,
  };
});

export function getFallbackTopicDetail(slug: string): FallbackCourse | null {
  const clean = slug.toLowerCase().trim();
  const found = FALLBACK_COURSES.find(
    (c) =>
      c.slug === clean ||
      c.code.toLowerCase() === clean ||
      (c.credentialCode && c.credentialCode.toLowerCase() === clean) ||
      clean.includes(c.code.toLowerCase())
  );
  return found || null;
}

// Canonical Binary Foundations Lesson Blueprint
const BINARY_FOUNDATIONS_LESSON: FallbackLesson = {
  id: 'les-c01-m01-01',
  slug: 'what-is-binary',
  title: 'Bits, Bytes, Binary & Hexadecimal',
  type: 'THEORY',
  durationMinutes: 15,
  visualizationType: 'BINARY_CONVERTER',
  visualType: 'BINARY_CONVERTER',
  course: {
    id: 'course-nv-c01',
    title: 'Foundations & Network Architecture',
    slug: 'foundations-network-architecture',
    level: 'FOUNDATIONAL',
    modules: FALLBACK_COURSES[0].modules,
  },
  module: {
    id: 'mod-c01-digital-representation',
    title: 'Module 1: Digital Representation & Hardware Architecture',
  },
  content: {
    objective:
      'Understand how digital network data is constructed from binary bits, how 8 bits form a byte, how hexadecimal notation provides a compact shorthand for binary strings, and how to convert accurately between decimal, binary, and hexadecimal representations.',
    whyItMatters:
      'Every copper cable, fiber optic strand, and Wi-Fi radio wave carries physical signals representing binary 1s and 0s. Network addresses like IPv4 octets (0–255) and MAC addresses (48 bits in hex notation) are direct representations of binary data. Mastering these representations provides the essential bedrock for all networking topics.',
    theory:
      'Computers and networking devices communicate using electricity and light. Because electronic circuits reliably detect two physical states (voltage High vs Low, light Pulse vs No-Pulse), digital systems use the Binary (Base-2) number system. A single binary digit is called a Bit. Grouping bits into 4-bit Nibbles and 8-bit Bytes (called Octets in networking) creates a standardized way to represent numbers, characters, and network addresses.',
    explanation:
      'In an 8-bit byte, each bit position from left (Most Significant Bit) to right (Least Significant Bit) has a fixed decimal weight: 128 (2^7), 64 (2^6), 32 (2^5), 16 (2^4), 8 (2^3), 4 (2^2), 2 (2^1), and 1 (2^0). By summing the place values of active bits, any integer from 0 to 255 can be represented with precision.',
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
    packetWalkthrough:
      'At the physical layer, voltages fluctuate between +V and -V to represent binary 1s and 0s. The network interface card (NIC) samples these clock edges and reassembles incoming bits into 8-bit octets to construct Ethernet frames.',
    practicalActivity: {
      title: 'Interactive 8-Bit Positional Binary & Hex Converter',
      description: 'Toggle individual bit switches (128, 64, 32, 16, 8, 4, 2, 1) to observe real-time decimal summation (0–255), nibble division, and hexadecimal notation updates.',
    },
    recap: [
      'A Bit is the smallest binary unit (0 or 1). A Nibble is 4 bits (0–F in hex). A Byte (Octet) is 8 bits (0–255 in decimal, 00–FF in hex).',
      'In an 8-bit byte, the positional place values from left to right are: 128, 64, 32, 16, 8, 4, 2, 1.',
      'To convert decimal to binary, subtract active place values from left to right.',
      'To convert binary to hexadecimal, split into two 4-bit nibbles and convert each nibble into a single hex symbol (0–9, A–F).',
      'Hexadecimal is used in networking (such as MAC and IPv6 addresses) because it represents 4 binary bits with a single human-readable character.',
    ],
  },
  components: [
    { name: 'Bit (b)', detail: 'Smallest digital unit: 0 or 1.' },
    { name: 'Nibble', detail: '4-bit binary group (0-15 decimal, 0-F hex).' },
    { name: 'Byte / Octet (B)', detail: '8-bit binary group (0-255 decimal, 00-FF hex).' },
    { name: 'Hexadecimal (Base-16)', detail: 'Base-16 notation using digits 0-9 and letters A-F.' },
  ],
  howItWorks: [
    { stepNumber: 1, title: 'Understanding 8-Bit Positional Weights', action: 'Weights: 128 (2^7), 64 (2^6), 32 (2^5), 16 (2^4), 8 (2^3), 4 (2^2), 2 (2^1), 1 (2^0).' },
    { stepNumber: 2, title: 'Binary to Decimal Conversion', action: 'Sum the weights of all active 1 bits: 11000000 = 128 + 64 = 192.' },
    { stepNumber: 3, title: 'Decimal to Binary (Subtraction Method)', action: 'Subtract largest applicable bit weights from left to right.' },
    { stepNumber: 4, title: 'Binary to Hexadecimal (The Nibble Method)', action: 'Split byte into two 4-bit nibbles; convert each to hex character: 1100 1010 -> 0xCA.' },
    { stepNumber: 5, title: 'Networking Notation', action: 'Used for compact human-readable MAC (48-bit) and IPv6 (128-bit) addresses.' },
  ],
  troubleshooting: [
    {
      symptom: 'Subnet mask conversion mismatch (e.g. 255.255.255.0 vs /24)',
      possibleCauses: ['Miscounting active bits', 'Confusing prefix length with host bits'],
      diagnosticSteps: ['Write out the octet in binary', 'Count consecutive leading 1s'],
      remediation: 'Each 255 represents 8 contiguous 1-bits (11111111). Three 255 octets equal 24 bits (/24).',
    },
  ],
  security: {
    threatOrVulnerability: 'Bit-level framing errors or physical cable noise causing checksum corruption.',
    mitigationStrategy: 'Layer 2 Ethernet FCS (Frame Check Sequence) 32-bit CRC detects corrupted bits and discards frames.',
  },
  objectives: [
    { id: 'obj-1', text: 'Understand how digital network data is constructed from binary bits and 8-bit octets.' },
    { id: 'obj-2', text: 'Convert decimal values to binary using 8-bit positional place values (128, 64, 32, 16, 8, 4, 2, 1).' },
    { id: 'obj-3', text: 'Convert binary strings to hexadecimal using 4-bit nibbles (weights 8, 4, 2, 1).' },
    { id: 'obj-4', text: 'Explain why networking uses hexadecimal for MAC addresses and IPv6 headers.' },
  ],
  concepts: [
    { id: 'con-1', title: 'Binary Architecture', summary: 'Base-2 logic', explanation: 'Digital circuits use two voltage levels (High and Low) to represent 1 and 0.' },
    { id: 'con-2', title: 'Octet Structure', summary: '8-bit groupings', explanation: 'All modern networking protocols frame data in 8-bit octet boundaries.' },
    { id: 'con-3', title: 'Hexadecimal Notation', summary: 'Base-16 compression', explanation: 'Every hex character maps 1-to-1 to a 4-bit nibble.' },
  ],
  examples: [
    {
      id: 'ex-1',
      title: 'Decimal 192 to Binary',
      scenario: 'IPv4 First Octet Conversion',
      explanation: '192 >= 128 (Bit 1, rem 64). 64 >= 64 (Bit 1, rem 0). Remaining 6 bits are 0. Result: 11000000.',
    },
    {
      id: 'ex-2',
      title: 'Binary 11001010 to Hexadecimal',
      scenario: 'MAC Address Fragment',
      explanation: 'Left nibble 1100 = 12 (C). Right nibble 1010 = 10 (A). Result: 0xCA.',
    },
  ],
  commands: [
    { id: 'cmd-1', command: 'ip address show', description: 'Inspect host IP addresses and subnet masks in Linux CLI.' },
    { id: 'cmd-2', command: 'ip link show', description: 'Display 48-bit MAC hardware addresses formatted in hexadecimal.' },
  ],
  practice: [
    { id: 1, prompt: 'Convert binary 1010 to decimal.', expected: '10', hints: 'Weights (8, 4, 2, 1): 8 + 2 = 10.' },
    { id: 2, prompt: 'Convert decimal 15 to a 4-bit binary nibble.', expected: '1111', hints: '8 + 4 + 2 + 1 = 15.' },
    { id: 3, prompt: 'Convert binary 1010 to a single hexadecimal digit.', expected: 'A', hints: 'In hexadecimal, decimal 10 is letter A.' },
    { id: 4, prompt: 'Convert hexadecimal digit F to a 4-bit binary nibble.', expected: '1111', hints: 'Hex F equals decimal 15 = 1111.' },
    { id: 5, prompt: 'Convert decimal 192 into an 8-bit binary string.', expected: '11000000', hints: '128 + 64 = 192.' },
    { id: 6, prompt: 'Convert binary byte 11001010 into a 2-digit hexadecimal string.', expected: 'CA', hints: '1100 = C, 1010 = A -> CA.' },
  ],
  mistakes: [
    {
      id: 'mis-1',
      mistake: 'Reversing bit position weights (reading right-to-left instead of left-to-right).',
      whyWrong: 'Calculates incorrect decimal numbers and leads to broken subnetting.',
      correctApproach: 'Always write weights from MSB to LSB: 128, 64, 32, 16, 8, 4, 2, 1.',
    },
  ],
  recaps: [
    { id: 'rec-1', point: 'Bit = 0 or 1; Nibble = 4 bits (0-F hex); Byte/Octet = 8 bits (0-255 dec, 00-FF hex).' },
    { id: 'rec-2', point: 'Hexadecimal provides a clean 2-character shorthand for every 8-bit networking octet.' },
  ],
  quiz: {
    id: 'quiz-binary',
    title: 'Bits, Bytes & Binary Knowledge Check',
    passingScore: 80,
    questionCount: 6,
    questions: [
      {
        id: 'q-bin-1',
        questionText: 'How many binary bits are in one standard byte (octet)?',
        options: ['8 bits', '4 bits', '16 bits', '2 bits'],
        correctOption: 0,
        explanation: 'A byte (known as an octet in networking) consists of exactly 8 binary bits.',
      },
      {
        id: 'q-bin-2',
        questionText: 'How many binary bits are represented by a single hexadecimal character (a nibble)?',
        options: ['4 bits', '8 bits', '2 bits', '16 bits'],
        correctOption: 0,
        explanation: 'Each hexadecimal digit represents a 4-bit nibble (2^4 = 16 distinct states: 0 to F). Two hex characters form an 8-bit byte.',
      },
      {
        id: 'q-bin-3',
        questionText: 'What is the binary representation of decimal integer 192?',
        options: ['11000000', '10101010', '11100000', '10000000'],
        correctOption: 0,
        explanation: 'Decimal 192 is formed by 128 + 64 = 192 (Bits 128 and 64 set to 1, all others 0: 11000000).',
      },
      {
        id: 'q-bin-4',
        questionText: 'What is the hexadecimal representation of the 8-bit binary value 11001010?',
        options: ['0xCA', '0xAC', '0xCB', '0xDA'],
        correctOption: 0,
        explanation: 'Split into two 4-bit nibbles: Upper nibble 1100 = 8+4 = 12 (hex C). Lower nibble 1010 = 8+2 = 10 (hex A). Hex string is 0xCA.',
      },
      {
        id: 'q-bin-5',
        questionText: 'What is the decimal equivalent of the hexadecimal byte 0xFF?',
        options: ['255', '256', '250', '240'],
        correctOption: 0,
        explanation: 'In hexadecimal, F = 15. Value = (15 * 16) + (15 * 1) = 240 + 15 = 255. This is the maximum decimal value of an 8-bit byte.',
      },
      {
        id: 'q-bin-6',
        questionText: 'Why does computer networking commonly use hexadecimal notation for MAC addresses and IPv6 addresses?',
        options: [
          'It provides a compact, human-readable shorthand where each hex digit directly represents 4 binary bits',
          'Hexadecimal is an analog electrical format used on physical cables',
          'Hexadecimal allows network switches to forward packets twice as fast as binary',
          'Network hardware can only process numbers between 0 and 15',
        ],
        correctOption: 0,
        explanation: 'Hexadecimal is used because it compactly represents 4 binary bits per symbol. A 48-bit MAC address in binary is 48 ones and zeros, but in hex it is written concisely with 12 characters (e.g., 00:1A:2B:3C:4D:5E).',
      },
    ],
  },
};

export function getFallbackLessonDetail(lessonSlug: string, _courseSlug?: string): FallbackLesson | null {
  const clean = lessonSlug.toLowerCase().trim();

  // 1. Direct match for what-is-binary or net-101-bits-bytes-binary-hex
  if (
    clean === 'what-is-binary' ||
    clean === 'net-101-bits-bytes-binary-hex' ||
    clean === 'binary-foundations' ||
    clean === 'digital-representation-foundations'
  ) {
    return {
      ...BINARY_FOUNDATIONS_LESSON,
      slug: clean,
    };
  }

  // 2. Search through FALLBACK_COURSES
  for (const course of FALLBACK_COURSES) {
    for (const mod of course.modules) {
      const lesson = mod.lessons.find((l) => l.slug === clean);
      if (lesson) {
        return {
          ...lesson,
          course: {
            id: course.id,
            title: course.title,
            slug: course.slug,
            level: course.level,
            modules: course.modules,
          },
          module: {
            id: mod.id,
            title: mod.title,
          },
          content: lesson.content || {
            objective: `Master ${lesson.title} within ${course.title}.`,
            whyItMatters: `Critical foundation for understanding ${mod.title}.`,
            theory: lesson.contentMarkdown || `Theoretical grounding for ${lesson.title}.`,
            explanation: `Step-by-step breakdown of protocol mechanics and interface state.`,
            components: [
              { name: 'Protocol Frame', detail: 'Header structure and field definitions.' },
              { name: 'Control Plane', detail: 'State exchange and signaling mechanisms.' },
            ],
            practicalActivity: {
              title: 'Hands-on Verification',
              description: 'Interactive telemetry inspection and CLI command simulation.',
            },
            recap: [
              `Core principles of ${lesson.title} mastered.`,
              'Practical verification techniques practiced.',
            ],
          },
          objectives: lesson.objectives || [
            { id: 'obj-1', text: `Understand the core principles of ${lesson.title}.` },
            { id: 'obj-2', text: 'Verify protocol behavior with command-line diagnostics.' },
          ],
          concepts: lesson.concepts || [
            { id: 'con-1', title: lesson.title, summary: 'Core Architecture', explanation: 'Foundational protocol specifications.' },
          ],
          examples: lesson.examples || [
            {
              id: 'ex-1',
              title: `${lesson.title} Scenario`,
              scenario: 'Operational Verification',
              explanation: 'Validating end-to-end packet transmission.',
            },
          ],
          commands: lesson.commands || [
            { id: 'cmd-1', command: 'show ip interface brief', description: 'Verify interface operational status.' },
          ],
          practice: lesson.practice || [
            { id: 1, prompt: `Verify the status of ${lesson.title}.`, expected: 'active', hints: 'Check interface telemetry.' },
          ],
          mistakes: lesson.mistakes || [
            {
              id: 'mis-1',
              mistake: 'Overlooking interface state or encapsulation mismatch.',
              whyWrong: 'Prevents protocol convergence and packet forwarding.',
              correctApproach: 'Confirm layer 1 and layer 2 operational state before troubleshooting layer 3.',
            },
          ],
          recaps: lesson.recaps || [
            { id: 'rec-1', point: `Mastery achieved for ${lesson.title}.` },
          ],
          quiz: lesson.quiz || {
            id: `quiz-${lesson.slug}`,
            title: `${lesson.title} Knowledge Check`,
            passingScore: 80,
            questionCount: 3,
            questions: [
              {
                id: `q-${lesson.slug}-1`,
                questionText: `What is the primary function of ${lesson.title}?`,
                options: [
                  'Facilitate reliable network transport and data delivery',
                  'Disable all network interfaces',
                  'Encrypt physical copper cables',
                  'Convert AC power to DC electricity',
                ],
                correctOption: 0,
                explanation: 'Ensures structured communication across the network topology.',
              },
            ],
          },
        };
      }
    }
  }

  return null;
}

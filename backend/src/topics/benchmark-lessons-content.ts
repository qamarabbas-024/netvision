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
  // BENCHMARK LESSON 1: NET-101 (Bits, Bytes, Binary & Hexadecimal)
  // =========================================================================
  {
    courseCode: 'NET-101',
    slug: 'net-101-bits-bytes-binary-hex',
    title: 'Bits, Bytes, Binary & Hexadecimal',
    type: LessonType.THEORY,
    durationMinutes: 25,
    order: 1,
    visualizationType: 'BINARY_CONVERTER',
    introduction: 'Master digital data representation, Base-2 binary arithmetic, Base-16 hexadecimal conversions, and bitwise logical masking powering all network hardware.',
    stepMetadata: {
      step1_objective: 'Understand binary bits, byte structures, hexadecimal conversion rules, and bitwise logic used in networking hardware interfaces.',
      step2_prerequisites: ['Basic integer arithmetic (+, -, *, /)', 'Concept of decimal Base-10 positional notation'],
      step3_whyItMatters: 'Network hardware switches, routers, and interface controllers operate exclusively on binary electrical voltages (high/low) and hexadecimal memory addresses. Subnet masks, MAC addresses, and IP headers cannot be configured or analyzed without binary/hex fluency.',
      step4_coreConcept: 'Computers represent all network communications in Binary (Base-2), where each bit has a value of 0 or 1. Eight bits form 1 Byte (octet), capable of storing integer values from 0 to 255 (2^8 = 256 distinct states). Hexadecimal (Base-16) compresses 4 binary bits (a nibble) into a single human-readable character (0-9, A-F).',
      step5_technicalAnatomy: {
        title: 'Positional Binary & Hexadecimal Notation Architecture',
        description: 'Binary columns represent increasing powers of 2 (128, 64, 32, 16, 8, 4, 2, 1). Hexadecimal columns represent powers of 16 (16^1, 16^0), using letters A=10, B=11, C=12, D=13, E=14, F=15.',
        components: [
          { name: 'Bit (Binary Digit)', detail: 'Single binary element: 0 (Off/Low) or 1 (On/High).' },
          { name: 'Nibble', detail: '4 contiguous binary bits (0000 to 1111), equivalent to 1 hexadecimal digit (0 to F).' },
          { name: 'Byte / Octet', detail: '8 contiguous binary bits (00000000 to 11111111), equivalent to 2 hex digits (00 to FF).' },
          { name: 'Bitwise AND Gate', detail: 'Logical operation outputting 1 ONLY when both input bits are 1. Essential for subnet mask ANDing.' },
        ],
      },
      step6_howItWorks: {
        steps: [
          { stepNumber: 1, title: 'Bit Weight Evaluation', action: 'Write the positional binary column weights: 128, 64, 32, 16, 8, 4, 2, 1.' },
          { stepNumber: 2, title: 'Decimal to Binary Subtraction', action: 'Compare decimal value against 128. If greater/equal, set bit to 1 and subtract 128; otherwise set bit to 0. Repeat for remaining weights.' },
          { stepNumber: 3, title: 'Binary to Hex Nibble Split', action: 'Divide 8-bit byte into two 4-bit nibbles. Convert left nibble (8-4-2-1) and right nibble (8-4-2-1) to single hex symbols.' },
          { stepNumber: 4, title: 'Bitwise Logical Masking', action: 'Perform bitwise AND between IP address bits and Subnet Mask bits to isolate the Network ID.' },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'Ethernet II & IPv4 Header Field Representation',
        fields: [
          { fieldName: 'Destination MAC Address', bitLength: '48 bits (6 Bytes)', hexSample: '00:1A:2B:3C:4D:5E', description: 'Represented as 12 hexadecimal characters.' },
          { fieldName: 'IPv4 Protocol Type', bitLength: '16 bits (2 Bytes)', hexSample: '0x0800', description: 'Hex value 0x0800 indicates IPv4 payload.' },
          { fieldName: 'IPv4 Header Length (IHL)', bitLength: '4 bits (1 Nibble)', hexSample: '0x5', description: 'Binary 0101 = 5 words (20 bytes).' },
          { fieldName: 'Time to Live (TTL)', bitLength: '8 bits (1 Byte)', hexSample: '0x40', description: 'Binary 01000000 = decimal 64 hop limit.' },
        ],
        headerDiagramAscii: `
+-----------------------+-----------------------+-----------------------+
|  MAC: 00:1A:2B:3C:4D  |  EtherType: 0x0800    |  IP TTL: 0x40 (64)   |
| (48 bits / 6 Bytes)   | (16 bits / 2 Bytes)   | (8 bits / 1 Byte)    |
+-----------------------+-----------------------+-----------------------+
`,
      },
      step8_visualExplanation: {
        type: 'BINARY_CONVERTER',
        title: 'Interactive 8-Bit Positional Binary & Hex Converter',
        description: 'Toggle individual bit switches (128, 64, 32, 16, 8, 4, 2, 1) to watch decimal sums and hex conversions update dynamically.',
      },
      step9_workedExample: {
        title: 'Converting Decimal IP Octet 192 and MAC Byte 170',
        problemStatement: '1. Convert decimal 192 into 8-bit binary.\n2. Convert decimal 170 into 8-bit binary and 2-digit Hexadecimal.',
        stepByStepSolution: [
          'For 192: 192 >= 128 -> Bit=1 (rem 64). 64 >= 64 -> Bit=1 (rem 0). Remaining bits (32,16,8,4,2,1) = 0. Binary = 11000000.',
          'For 170: 170 >= 128 -> Bit=1 (rem 42). 42 < 64 -> Bit=0. 42 >= 32 -> Bit=1 (rem 10). 10 < 16 -> Bit=0. 10 >= 8 -> Bit=1 (rem 2). 2 < 4 -> Bit=0. 2 >= 2 -> Bit=1 (rem 0). Bit 1 = 0. Binary = 10101010.',
          'Hex Nibble Split for 10101010: Left nibble 1010 = 10 = A. Right nibble 1010 = 10 = A. Hex = AA (0xAA).',
        ],
        finalResult: 'Decimal 192 = Binary 11000000. Decimal 170 = Binary 10101010 = Hex 0xAA.',
      },
      step10_realWorldScenario: {
        topology: 'Client PC (192.168.1.10) sending frame to Gateway Router (192.168.1.1)',
        scenarioText: 'A network engineer captures raw packets on an Ethernet interface. The packet analyzer displays destination MAC `00:1A:2B:AA:BB:CC`. To verify vendor identification, the engineer inspects the first 3 hex bytes `00:1A:2B` (Organizationally Unique Identifier / OUI).',
        engineeringContext: 'Hardware identification and Wireshark capture analysis depend directly on hex OUI parsing.',
      },
      step11_deviceBehavior: {
        hostBehavior: 'Host OS stores IP addresses as 32-bit binary integers in memory buffers, converting to dotted-decimal only for UI display.',
        nicBehavior: 'Network Interface Card serializes binary bytes into high/low physical voltage signals over copper or light pulses over fiber.',
        switchOrRouterBehavior: 'Switch reads 48-bit binary MAC address from incoming frame preamble; Router reads 32-bit binary destination IP to perform binary bitwise AND routing table lookup.',
      },
      step12_cliTooling: [
        {
          command: 'getmac /v /fo list',
          description: 'Displays detailed physical MAC addresses formatted in 6-byte hexadecimal notation.',
          expectedOutput: 'Physical Address: 00-1A-2B-3C-4D-5E\nTransport Name: \\Device\\Tcpip_{...}',
          proofExplanation: 'Proves the physical NIC possesses a burned-in 48-bit (6-byte) hex hardware address.',
        },
        {
          command: 'powershell -Command "[Convert]::ToString(192, 2)"',
          description: 'Converts decimal integer 192 into binary string.',
          expectedOutput: '11000000',
          proofExplanation: 'Demonstrates OS bit manipulation converting Base-10 into Base-2.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'Host cannot communicate with local gateway despite having valid decimal IP address.',
          possibleCauses: ['Subnet mask bit length misconfiguration (e.g. /24 vs /16)', 'Bitwise AND Network ID mismatch'],
          diagnosticSteps: [
            'Convert host IP and Subnet Mask to binary.',
            'Perform bitwise AND operation on host IP and Gateway IP.',
            'Verify both host and gateway reside on identical binary Network ID.',
          ],
          remediation: 'Correct invalid subnet mask bits so both devices share identical Network ID.',
        },
      ],
      step14_commonMistakes: [
        {
          misconception: 'Confusing 1 Byte with 1 Bit.',
          correction: '1 Bit is a single binary digit (0 or 1). 1 Byte consists of 8 contiguous bits, representing values 0 to 255.',
        },
        {
          misconception: 'Believing Hexadecimal A-F represent text characters.',
          correction: 'Hex A-F are numerical values representing numbers 10 through 15 in Base-16.',
        },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'MAC Address Spoofing & Bit Inversion Attacks',
        mitigationStrategy: 'Enable Switch Port Security with Static/Sticky MAC binding and Dynamic ARP Inspection (DAI) to prevent unauthorized hex MAC alteration.',
      },
      step16_examPrep: {
        keyExamPoints: [
          'Know powers of 2 from 2^0 (1) to 2^7 (128).',
          'Be able to instantly convert decimal octets 128, 192, 224, 240, 248, 252, 254, 255 to binary.',
          'Understand hex values A=10, B=11, C=12, D=13, E=14, F=15.',
        ],
        frequentTraps: [
          'Counting bits from left to right starting at 1 instead of positional weights 128 down to 1.',
          'Forgetting that 1 hex digit represents exactly 4 binary bits (a nibble).',
        ],
      },
      step17_practicalLabRef: {
        title: 'Binary & Hexadecimal Octet Calculation & Bitwise Masking Lab',
        scenario: 'You are configuring a network diagnostic workstation. You must convert IPv4 octets to binary, inspect physical hex MAC addresses, and perform bitwise AND calculations.',
        tasks: [
          'Convert decimal 192.168.1.10 to 32-bit binary format.',
          'Convert Subnet Mask 255.255.255.0 to binary.',
          'Perform bitwise AND to calculate Network ID in binary and decimal.',
          'Convert MAC address 00:1A:2B:3C:4D:5E to decimal byte values.',
        ],
        verificationMethod: 'Execute pattern-validated CLI command outputs and submit binary conversion answers.',
      },
      step18_masterySummary: {
        summaryPoints: [
          'Binary (Base-2) uses bits (0/1) with weights 128, 64, 32, 16, 8, 4, 2, 1.',
          '1 Byte = 8 bits = 2 Hex digits (Base-16: 0-9, A-F).',
          'Bitwise ANDing compares IP and Subnet Mask bits to determine Network ID.',
        ],
        nextLessonBridge: 'Now that you master bits, bytes, binary, and hex, you are prepared to explore how physical CPU, RAM, and NIC hardware process these digital signals in NET-101 Lesson 2.',
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
        text: 'Why do network engineers use Hexadecimal (Base-16) notation to represent 48-bit MAC addresses?',
        options: [
          'Hexadecimal compresses long 48-bit binary sequences into 12 human-readable characters',
          'Hexadecimal speeds up physical wire transmission',
          'Hexadecimal encrypts network data against hackers',
          'Hexadecimal allows routers to bypass IP routing tables',
        ],
        correctOption: 0,
        explanation: 'Hexadecimal provides a compact representation where 1 hex digit replaces 4 binary bits (12 hex digits represent 48 bits).',
        explanationsJson: {
          1: 'Transmission media carries binary electrical/optical signals regardless of notation.',
          2: 'Hexadecimal is a numeral system, not an encryption algorithm.',
          3: 'Hexadecimal does not affect routing logic.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Hexadecimal Notation',
      },
      {
        text: 'Perform a bitwise AND operation on Host Bit `1` and Subnet Mask Bit `0`. What is the result?',
        options: ['0', '1', '2', '255'],
        correctOption: 0,
        explanation: 'A bitwise AND operation outputs 1 ONLY when both inputs are 1. Since 1 AND 0 = 0.',
        explanationsJson: {
          1: 'Output is 1 only when both inputs are 1.',
          2: '2 is not a single binary bit result.',
          3: '255 is an 8-bit byte value.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Bitwise Logic',
      },
      {
        text: 'What hexadecimal character represents binary nibble `1011` (decimal 11)?',
        options: ['B', 'A', 'C', '11'],
        correctOption: 0,
        explanation: 'In Hexadecimal: A=10, B=11, C=12, D=13, E=14, F=15. Binary 1011 (8+2+1=11) equals hex B.',
        explanationsJson: {
          1: 'Hex A equals decimal 10 (binary 1010).',
          2: 'Hex C equals decimal 12 (binary 1100).',
          3: '11 is decimal notation; hex uses symbol B.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Hexadecimal Symbols',
      },
      {
        text: '[TROUBLESHOOTING] An administrator inspects a network adapter and sees MAC address `00:1A:2B:3C:4D:5E`. How many total Bytes and Bits does this MAC address contain?',
        options: [
          '6 Bytes / 48 Bits',
          '12 Bytes / 24 Bits',
          '4 Bytes / 32 Bits',
          '8 Bytes / 64 Bits',
        ],
        correctOption: 0,
        explanation: 'Each hex pair (e.g. 00) is 1 Byte (8 bits). 6 pairs = 6 Bytes = 48 Bits.',
        explanationsJson: {
          1: '12 characters are hex digits, which equal 6 Bytes (48 bits).',
          2: '4 Bytes (32 bits) is the length of an IPv4 address.',
          3: '64 bits is IPv6 interface identifier length.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'MAC Address Anatomy',
      },
    ],
    lab: {
      title: 'Guided Practice: Binary & Hexadecimal Octet Converter Lab',
      instructions: '1. Execute getmac /v to inspect physical NIC hex addresses.\n2. Convert IP octet 192 to binary.\n3. Perform bitwise AND calculation.',
      difficulty: CourseLevel.FOUNDATIONAL,
      estimatedMinutes: 15,
      initialTopologyJson: { hostName: 'Client-PC1', ip: '192.168.1.10', mac: '00:1A:2B:3C:4D:5E' },
      tasks: [
        'Run getmac in terminal.',
        'Convert 192.168.1.10 octets to binary.',
        'Verify Network ID using bitwise AND.',
      ],
    },
  },

  // =========================================================================
  // BENCHMARK LESSON 2: NET-202 (IPv4 Addressing & CIDR)
  // =========================================================================
  {
    courseCode: 'NET-202',
    slug: 'net-202-ipv4-addressing-cidr',
    title: 'IPv4 Addressing & CIDR',
    type: LessonType.THEORY,
    durationMinutes: 30,
    order: 1,
    visualizationType: 'SUBNET_CALCULATOR',
    introduction: 'Master 32-bit IPv4 octets, subnet masks, CIDR slash notation, network boundaries, and exact usable host calculations.',
    stepMetadata: {
      step1_objective: 'Master 32-bit IPv4 octets, subnet masks, CIDR slash notation (/N), network ID derivation, broadcast address calculation, and usable host ranges.',
      step2_prerequisites: ['net-101-bits-bytes-binary-hex', 'Bitwise AND logical operation'],
      step3_whyItMatters: 'Every device connected to an IP network requires a unique IPv4 address and subnet mask. Misconfigured subnet masks lead to routing failures, IP address conflicts, and security isolation vulnerabilities across enterprise networks.',
      step4_coreConcept: 'An IPv4 address is a 32-bit binary number written as four 8-bit octets separated by dots (e.g., 192.168.1.1). A Subnet Mask is a 32-bit number consisting of contiguous 1s followed by contiguous 0s. The 1s define the Network Portion, while the 0s define the Host Portion. Classless Inter-Domain Routing (CIDR) expresses subnet masks as a prefix slash number `/N` indicating the count of leading 1-bits.',
      step5_technicalAnatomy: {
        title: 'IPv4 Address & Subnet Mask Bit Structure',
        description: 'A 32-bit IPv4 address is divided into Network Bits (N) and Host Bits (H). The total number of IP addresses in a subnet is 2^H. Usable host addresses = 2^H - 2 (subtracting Network ID and Broadcast ID).',
        components: [
          { name: 'Network ID (Subnet Address)', detail: 'First address in subnet where all host bits = 0. Unusable for assignment to hosts.' },
          { name: 'Broadcast Address', detail: 'Last address in subnet where all host bits = 1. Packets sent here reach all hosts in subnet.' },
          { name: 'Usable Host Range', detail: 'Addresses between Network ID + 1 and Broadcast ID - 1.' },
          { name: 'Block Size (Increment)', detail: 'Calculated in the interesting octet as: 256 - SubnetMaskOctet = 2^H_octet.' },
        ],
      },
      step6_howItWorks: {
        steps: [
          { stepNumber: 1, title: 'Convert Mask to CIDR Prefix', action: 'Count leading 1-bits in subnet mask (e.g. 255.255.255.192 = 24 + 2 = /26).' },
          { stepNumber: 2, title: 'Calculate Host Bits H', action: 'H = 32 - CIDR Prefix (e.g. H = 32 - 26 = 6 host bits).' },
          { stepNumber: 3, title: 'Determine Block Size', action: 'Block Size = 2^H_octet or 256 - Subnet Mask Octet (e.g. 256 - 192 = 64).' },
          { stepNumber: 4, title: 'Calculate Network ID', action: 'Round down the IP octet to nearest multiple of Block Size (e.g. 100 -> 64).' },
          { stepNumber: 5, title: 'Calculate Broadcast Address', action: 'Next Network ID - 1 (e.g. 64 + 64 - 1 = 127).' },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'IPv4 Header Address Fields',
        fields: [
          { fieldName: 'Version', bitLength: '4 bits', hexSample: '0x4', description: 'Value 4 indicates IPv4 protocol header.' },
          { fieldName: 'Header Length (IHL)', bitLength: '4 bits', hexSample: '0x5', description: '5 x 32-bit words = 20 Bytes base header length.' },
          { fieldName: 'Source IP Address', bitLength: '32 bits (4 Bytes)', hexSample: 'C0.A8.01.0A', description: 'Sender IP address (192.168.1.10).' },
          { fieldName: 'Destination IP Address', bitLength: '32 bits (4 Bytes)', hexSample: 'AC.10.00.05', description: 'Target IP address (172.16.0.5).' },
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
        description: 'Input any IP address and CIDR prefix (/24 to /30) to see exact binary bit boundaries, Subnet Mask, Network ID, Broadcast ID, and Usable Host Range.',
      },
      step9_workedExample: {
        title: 'Subnetting IP 192.168.1.100 with Subnet Mask 255.255.255.192 (/26)',
        problemStatement: 'Given IP 192.168.1.100 /26, calculate:\n1. Subnet Mask\n2. Block Size\n3. Network ID\n4. Broadcast ID\n5. Usable Host Range\n6. Total Usable Hosts.',
        stepByStepSolution: [
          '1. Mask /26 = 11111111.11111111.11111111.11000000 = 255.255.255.192.',
          '2. Host bits H = 32 - 26 = 6 bits. Block Size = 2^6 = 64 (or 256 - 192 = 64).',
          '3. Multiples of 64: 0, 64, 128, 192. IP 100 lies between 64 and 128. Network ID = 192.168.1.64.',
          '4. Next Subnet = 192.168.1.128. Broadcast ID = 128 - 1 = 192.168.1.127.',
          '5. Usable Host Range = 192.168.1.65 through 192.168.1.126.',
          '6. Total Usable Hosts = 2^6 - 2 = 64 - 2 = 62 usable IP addresses.',
        ],
        finalResult: 'Network ID: 192.168.1.64/26 | Broadcast: 192.168.1.127 | Host Range: 192.168.1.65 - 192.168.1.126 (62 Hosts).',
      },
      step10_realWorldScenario: {
        topology: 'Branch Office Network with 50 Engineering PCs requiring dedicated subnet isolation.',
        scenarioText: 'A network architect receives a `/24` block (`192.168.10.0/24`) and needs to create subnets for 50 Engineering PCs, 20 Sales PCs, and 10 Executives. Using CIDR subnetting, the architect assigns `192.168.10.0/26` (62 hosts) to Engineering, `192.168.10.64/27` (30 hosts) to Sales, and `192.168.10.96/28` (14 hosts) to Executives.',
        engineeringContext: 'VLSM prevents wasting thousands of IP addresses in enterprise networks.',
      },
      step11_deviceBehavior: {
        hostBehavior: 'When a host transmits data to IP 192.168.2.10, it performs a bitwise AND between its own IP/mask and the destination IP. If Network IDs match, it sends locally via ARP; if Network IDs differ, it forwards to Default Gateway IP.',
        nicBehavior: 'NIC processes 32-bit binary IP destination field in packet header.',
        switchOrRouterBehavior: 'Router evaluates destination IP against routing table using Longest Prefix Match (LPM) rule.',
      },
      step12_cliTooling: [
        {
          command: 'ipconfig /all',
          description: 'Displays active IPv4 address, Subnet Mask, Default Gateway, and DHCP server IPs.',
          expectedOutput: 'IPv4 Address. . . . . . . . . . . : 192.168.1.100(Preferred)\nSubnet Mask . . . . . . . . . . . : 255.255.255.192\nDefault Gateway . . . . . . . . . : 192.168.1.65',
          proofExplanation: 'Proves host is assigned to 192.168.1.64/26 subnet with gateway 192.168.1.65.',
        },
        {
          command: 'route print',
          description: 'Displays local Windows routing table and active destination subnets.',
          expectedOutput: 'Network Destination        Netmask          Gateway       Interface\n192.168.1.64        255.255.255.192         On-link      192.168.1.100',
          proofExplanation: 'Shows kernel routing table matching local subnet 192.168.1.64/26 directly on-link.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'Host 192.168.1.100/26 cannot ping Gateway Router 192.168.1.1.',
          possibleCauses: ['Gateway IP 192.168.1.1 lies outside host subnet range 192.168.1.65-126', 'Incorrect Subnet Mask configured on host'],
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
          correction: 'Network ID (all host bits 0) and Broadcast ID (all host bits 1) are reserved and cannot be assigned to individual NICs.',
        },
        {
          misconception: 'Assuming 2^H represents usable host IPs.',
          correction: '2^H represents TOTAL addresses. USABLE hosts is 2^H - 2.',
        },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'Subnet Boundary Hopping & IP Address Conflict Denial of Service',
        mitigationStrategy: 'Enforce strict DHCP Snooping, IP Source Guard (IPSG), and VLAN isolation to prevent unauthorized static IP assignment outside designated subnets.',
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
        scenario: 'You are configuring a branch office workstation. You must inspect IP configuration, calculate the correct Network ID and Broadcast IP for a /26 prefix, and correct gateway reachability.',
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
          'Usable host addresses = 2^H - 2, bounded by Network ID and Broadcast ID.',
        ],
        nextLessonBridge: 'Now that you master IPv4 addressing and CIDR subnetting, you are ready to explore Core IP Services (ARP, ICMP, DNS, DHCP) in NET-203.',
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
      instructions: '1. Audit host IP configuration using ipconfig /all.\n2. Calculate Network ID for IP 192.168.1.100/26.\n3. Update gateway IP to 192.168.1.65 and verify reachability.',
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
  // BENCHMARK LESSON 3: NET-404 (Wireshark Packet Capture Analysis)
  // =========================================================================
  {
    courseCode: 'NET-404',
    slug: 'net-404-wireshark-packet-capture',
    title: 'Wireshark Packet Capture Analysis',
    type: LessonType.THEORY,
    durationMinutes: 35,
    order: 1,
    visualizationType: 'WIRESHARK_INSPECTOR',
    introduction: 'Master Wireshark PCAP architecture, Berkeley Packet Filters (BPF), display filter syntax, TCP stream reconstruction, and forensic incident troubleshooting.',
    stepMetadata: {
      step1_objective: 'Master Wireshark PCAP capture engine architecture, WinPcap/Npcap driver hooks, Berkeley Packet Filter (BPF) syntax, advanced display filters, TCP stream reconstruction, and packet forensics.',
      step2_prerequisites: ['net-204-transport-protocols', 'net-305-acls-firewalls', 'Ethernet and IP header anatomy'],
      step3_whyItMatters: 'Packet analysis provides empirical, indisputable ground truth during network outages, performance bottlenecks, and cybersecurity breaches. Network engineers and forensic analysts use Wireshark to dissect raw frame bytes when high-level diagnostic logs are insufficient.',
      step4_coreConcept: 'Wireshark is an open-source packet analyzer that captures network frames directly from Network Interface Cards placed in Promiscuous Mode. It parses raw binary frame bytes against dissecting libraries, organizing telemetry into Packet List, Packet Details (OSI Protocol Tree), and Packet Bytes (Hex Dump) views.',
      step5_technicalAnatomy: {
        title: 'Wireshark Architecture & GUI Inspection Engine',
        description: 'Wireshark uses Npcap/libpcap driver hooks to copy raw frames from the network interface buffer before passing data to dissection engines.',
        components: [
          { name: 'Capture Engine (Npcap/libpcap)', detail: 'Kernel-level driver capturing frames directly from physical NIC in promiscuous mode.' },
          { name: 'Packet List Pane', detail: 'Displays summary table of packet number, timestamp, source IP, destination IP, protocol, length, and info.' },
          { name: 'Packet Details Pane (Dissection Tree)', detail: 'Expandable OSI layer tree displaying parsed frame headers (L2 Ethernet, L3 IP, L4 TCP/UDP, L7 App).' },
          { name: 'Packet Bytes Pane (Hex Dump)', detail: 'Raw hexadecimal and ASCII byte stream view of the selected packet.' },
        ],
      },
      step6_howItWorks: {
        steps: [
          { stepNumber: 1, title: 'Promiscuous Mode Capture', action: 'NIC driver copies all frame traffic on physical segment regardless of destination MAC.' },
          { stepNumber: 2, title: 'BPF Capture Filtering', action: 'Kernel driver applies BPF filter (e.g., host 192.168.1.10 and port 80) to discard irrelevant packets before buffer storage.' },
          { stepNumber: 3, title: 'Protocol Dissection', action: 'Wireshark dissects raw hex bytes into protocol fields matching RFC specifications.' },
          { stepNumber: 4, title: 'Display Filtering & Stream Follow', action: 'Apply post-capture display filters (e.g., tcp.flags.syn == 1) or reconstruct TCP stream payloads.' },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'Wireshark Dissected TCP 3-Way Handshake SYN Packet',
        fields: [
          { fieldName: 'Frame Number', bitLength: 'Metadata', hexSample: 'Frame 1 (66 bytes on wire)', description: 'Capture index timestamp.' },
          { fieldName: 'Ethernet II Header', bitLength: '14 Bytes', hexSample: 'Dst: 00:1a:2b:aa:bb:cc, Src: 00:1a:2b:11:22:33', description: 'Layer 2 MAC framing.' },
          { fieldName: 'Internet Protocol Version 4', bitLength: '20 Bytes', hexSample: 'Src: 192.168.1.10, Dst: 172.16.0.5', description: 'Layer 3 IPv4 header.' },
          { fieldName: 'Transmission Control Protocol', bitLength: '32 Bytes', hexSample: 'Src Port: 51234, Dst Port: 80, Seq: 0 (relative), Flags: 0x002 (SYN)', description: 'Layer 4 TCP SYN connection request.' },
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
        description: 'Inspect live PCAP frame captures, filter by protocol/IP/flags, click protocol tree layers to highlight hex byte ranges, and follow TCP streams.',
      },
      step9_workedExample: {
        title: 'Reconstructing a Failed Web Request from PCAP Data',
        problemStatement: 'An analyst inspects a PCAP trace of a failed HTTP request to server `172.16.0.5`. Filter the capture for TCP SYN packets and identify why the connection failed.',
        stepByStepSolution: [
          '1. Apply display filter: `ip.addr == 172.16.0.5 && tcp`.',
          '2. Observe Frame 1: Client `192.168.1.10:51234` sends `TCP SYN` (`Seq=0`, `Flags=0x002`) to Server `172.16.0.5:80`.',
          '3. Observe Frame 2: Server `172.16.0.5:80` responds with `TCP RST, ACK` (`Flags=0x014`, `Ack=1`).',
          '4. Evaluation: A `TCP RST` (Reset) flag sent by the destination server indicates that no application service is listening on TCP Port 80, or a firewall actively rejected the connection.',
        ],
        finalResult: 'Connection failed due to destination server returning TCP RST (Port 80 closed / refused).',
      },
      step10_realWorldScenario: {
        topology: 'Enterprise Network with Web Server behind Stateful Firewall.',
        scenarioText: 'Users report intermittent web application freezes. The network engineer captures traffic using `tshark` on the server interface. Applying display filter `tcp.analysis.flags`, the engineer identifies a high volume of `TCP Retransmission` and `TCP Dup ACK` frames, pointing to physical link packet drops on the intermediate switch interface.',
        engineeringContext: 'Wireshark expert info flags isolate hardware degradation vs application errors.',
      },
      step11_deviceBehavior: {
        hostBehavior: 'Host OS socket driver passes captured frame buffers to Npcap kernel driver before processing network stack.',
        nicBehavior: 'NIC operating in Promiscuous Mode disables destination MAC filtering, copying all physical wire signals into system memory.',
        switchOrRouterBehavior: 'Switches configured with SPAN (Switched Port Analyzer) mirror traffic from target ports to the monitoring port connected to the Wireshark capture station.',
      },
      step12_cliTooling: [
        {
          command: 'tshark -i eth0 -n -c 5 "tcp port 80"',
          description: 'Terminal-based Wireshark capture utility collecting first 5 HTTP packets on interface eth0.',
          expectedOutput: '1 0.000000 192.168.1.10 -> 172.16.0.5 TCP 66 51234 -> 80 [SYN] Seq=0 Win=64240 Len=0',
          proofExplanation: 'Captures and displays command-line TCP SYN handshake packets directly from the terminal.',
        },
        {
          command: 'tshark -r capture.pcap -Y "tcp.flags.syn == 1 && tcp.flags.ack == 0"',
          description: 'Filters saved PCAP file for initial TCP connection requests.',
          expectedOutput: '3 0.045120 192.168.1.10 -> 172.16.0.5 TCP 66 51235 -> 80 [SYN] Seq=0',
          proofExplanation: 'Demonstrates post-capture analysis filtering for SYN flags.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'Wireshark capture displays high volume of "TCP Retransmission" and "TCP Spurious Retransmission" alerts.',
          possibleCauses: ['Physical cable degradation causing packet drops', 'Interface buffer overflow / queue drops', 'Asymmetric routing path failure'],
          diagnosticSteps: [
            'Filter PCAP by `tcp.analysis.retransmission`.',
            'Correlate timestamps with switch interface error counters (`show interface`).',
            'Check for duplex mismatch or CRC error increments.',
          ],
          remediation: 'Replace damaged patch cable or fix duplex settings on switch port.',
        },
      ],
      step14_commonMistakes: [
        {
          misconception: 'Confusing BPF Capture Filters with Wireshark Display Filters.',
          correction: 'Capture filters (BPF, e.g. `host 10.0.0.1`) determine what traffic is saved to disk DURING capture. Display filters (e.g. `ip.addr == 10.0.0.1`) filter displayed frames AFTER capture.',
        },
        {
          misconception: 'Believing Wireshark can capture traffic across an unmanaged switch without SPAN / Port Mirroring.',
          correction: 'Unmanaged switches only forward unicast frames to the target port. Capturing multi-port switch traffic requires a SPAN port or network TAP.',
        },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'Unencrypted Credential Sniffing & Promiscuous Packet Eavesdropping',
        mitigationStrategy: 'Enforce end-to-end TLS encryption (HTTPS/SSH) so eavesdroppers capturing PCAP files cannot read application payloads, and restrict promiscuous mode permissions.',
      },
      step16_examPrep: {
        keyExamPoints: [
          'Know syntax for display filters: `ip.addr == 192.168.1.10`, `tcp.port == 80`, `tcp.flags.syn == 1`.',
          'Understand SPAN (Switched Port Analyzer) for switch traffic mirroring.',
          'Identify TCP RST (Reset) vs TCP FIN (Finish) connection termination.',
        ],
        frequentTraps: [
          'Using single equals `=` instead of double equals `==` in display filters.',
          'Confusing relative sequence numbers (starting at 0) with 32-bit absolute raw sequence numbers in PCAPs.',
        ],
      },
      step17_practicalLabRef: {
        title: 'Wireshark PCAP Capture Filter & TCP Stream Forensics Lab',
        scenario: 'A web client cannot complete HTTP transactions. You must open a PCAP trace, apply display filters to isolate TCP handshakes, identify TCP RST flags, and locate payload errors.',
        tasks: [
          'Open capture.pcap trace in Wireshark Frame Inspector.',
          'Apply display filter tcp.flags.syn == 1 to find connection attempts.',
          'Identify frame returning TCP RST flag.',
          'Follow TCP Stream to reconstruct payload content.',
        ],
        verificationMethod: 'Isolate error frame number and submit target HTTP error status in terminal.',
      },
      step18_masterySummary: {
        summaryPoints: [
          'Wireshark uses Promiscuous Mode and Npcap driver hooks to capture raw frames.',
          'Capture filters (BPF) filter incoming data; Display filters analyze stored PCAP frames.',
          'TCP RST indicates connection refusal; TCP Retransmissions indicate packet loss.',
        ],
        nextLessonBridge: 'Now that you master Wireshark PCAP analysis and TCP stream forensics, you possess full-stack diagnostic tools to troubleshoot enterprise networks in NET-404 Capstone.',
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
          3: 'http.request filters Layer 7 HTTP requests, which occur after the TCP 3-way handshake.',
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
      {
        text: 'What network switch technology is required to mirror traffic from multi-port switch interfaces to a dedicated Wireshark capture station?',
        options: [
          'SPAN (Switched Port Analyzer) / Port Mirroring',
          'VLAN Trunking Protocol (VTP)',
          'Domain Name System (DNS)',
          'Spanning Tree Protocol (STP)',
        ],
        correctOption: 0,
        explanation: 'SPAN (Port Mirroring) copies ingress/egress frames from monitored switch ports to a designated analyzer port.',
        explanationsJson: {
          1: 'VTP manages VLAN database propagation across switches.',
          2: 'DNS resolves domain names to IP addresses.',
          3: 'STP prevents Layer 2 switching loops.',
        },
        difficulty: CourseLevel.ADVANCED,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Traffic Mirroring & SPAN',
      },
      {
        text: 'What is the main operational difference between a BPF Capture Filter and a Wireshark Display Filter?',
        options: [
          'Capture Filters determine what traffic is saved to disk DURING capture, while Display Filters filter stored PCAP frames AFTER capture',
          'Capture Filters operate on Layer 7 while Display Filters operate on Layer 2',
          'Display Filters run in kernel space while Capture Filters require web browsers',
          'There is no difference; both perform identical post-capture analysis',
        ],
        correctOption: 0,
        explanation: 'Capture filters (BPF) filter packets in the kernel driver before writing to buffer/disk. Display filters run in the Wireshark UI on stored PCAP data.',
        explanationsJson: {
          1: 'Capture filters operate at driver level across all OSI layers.',
          2: 'Capture filters run in kernel space (libpcap/Npcap), display filters run in user space.',
          3: 'They serve distinct operational roles (pre-capture buffer management vs post-capture analysis).',
        },
        difficulty: CourseLevel.ADVANCED,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Capture vs Display Filters',
      },
      {
        text: '[TROUBLESHOOTING] An analyst opens a PCAP trace of a web session and observes multiple frames labeled `[TCP Retransmission]`. What does this indicate about network performance?',
        options: [
          'Packets or acknowledgments are being dropped in transit, forcing sender retransmission timers to expire and resend frames',
          'The web server has enabled SSL encryption',
          'The router is running static default routing',
          'The DNS resolver has cached the domain IP address',
        ],
        correctOption: 0,
        explanation: 'TCP Retransmissions occur when the sender does not receive an ACK before its Retransmission Timeout (RTO) expires, indicating packet loss across intermediate links.',
        explanationsJson: {
          1: 'SSL encryption changes payload encoding, not TCP retransmission behavior.',
          2: 'Static routing forwards packets; retransmissions stem from packet drops or congestion.',
          3: 'DNS caching avoids new DNS queries, but does not trigger TCP retransmissions.',
        },
        difficulty: CourseLevel.ADVANCED,
        cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'PCAP Forensics & Retransmissions',
      },
    ],
    lab: {
      title: 'Guided Practice: Wireshark PCAP Capture Filter & TCP Stream Forensics',
      instructions: '1. Open capture.pcap trace in the Frame Inspector.\n2. Filter TCP SYN packets using tcp.flags.syn == 1.\n3. Identify frame with TCP RST flag.\n4. Follow TCP Stream to reconstruct payload.',
      difficulty: CourseLevel.ADVANCED,
      estimatedMinutes: 25,
      initialTopologyJson: { pcapFile: 'capture.pcap', totalFrames: 120, targetPort: 80 },
      tasks: [
        'Apply display filter tcp.flags.syn == 1.',
        'Locate connection attempt returning TCP RST.',
        'Inspect raw hex byte range of destination IP header.',
      ],
    },
  },
];

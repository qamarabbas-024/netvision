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

  // =========================================================================
  // BENCHMARK LESSON 4: NET-302 (Spanning Tree Protocol & Loop Prevention)
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
        {
          command: 'spanning-tree portfast default',
          description: 'Enables PortFast globally on all non-trunk access ports, transitioning directly to Forwarding.',
          expectedOutput: 'Switch(config)# spanning-tree portfast default',
          proofExplanation:
            'Eliminates the 30-second 802.1D listening/learning delay for workstations and servers while pairing with BPDU Guard for security.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'Complete LAN slowdown, 100% switch CPU utilization, blinking link LEDs across all switchports.',
          possibleCauses: [
            'Layer 2 loop caused by unmanaged desktop switch looped back onto itself.',
            'STP disabled on one or more trunk links.',
            'BPDU Filter enabled on a trunk link, suppressing BPDU transmission.',
          ],
          diagnosticSteps: [
            'Execute `show spanning-tree summary` to verify STP is actively running on all VLANs.',
            'Execute `show interfaces counters errors` to check for massive broadcast frame counts.',
            'Locate ports with flapping MAC address tables via `show mac address-table dynamic`.',
          ],
          remediation:
            'Remove physical redundant patch cable, ensure `spanning-tree bpduguard enable` is applied on all access ports, and never configure `bpdufilter` on switch-to-switch links.',
        },
        {
          symptom: 'Switch port remains in `err-disabled` state after connecting an end device.',
          possibleCauses: [
            'End device is a hypervisor or VoIP phone transmitting BPDUs on a BPDU Guard-protected port.',
          ],
          diagnosticSteps: [
            'Execute `show interfaces status err-disabled`.',
            'Check console log for `%SPANTREE-2-BLOCK_BPDUGUARD: Received BPDU on port Gi0/10 with BPDU Guard enabled`.',
          ],
          remediation:
            'If the connected device is a legitimate switch or virtualization host, remove `portfast` and `bpduguard`, and configure proper trunking with STP enabled.',
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
          'STP Root Hijacking Attack: An attacker connects a laptop running Yersinia or Scapy, transmitting forged BPDUs with Priority 0 and MAC 00:00:00:00:00:01. The attacker becomes the Root Bridge, intercepting all Layer-2 transit traffic.',
        mitigationStrategy:
          'Configure `spanning-tree guard root` on distribution-to-access downlink ports to prevent unauthorized switches from becoming root, and enable `spanning-tree bpduguard enable` on all access edge ports.',
      },
      step16_examPrep: {
        keyExamPoints: [
          'Bridge Priority default is 32768; values must be configured in multiples of 4096.',
          'Lowest Bridge ID wins Root Bridge election.',
          'Root Bridge has NO Root Ports; all active ports on the Root Bridge are Designated Ports.',
          'Path Cost standards: 10G = 2, 1G = 4, 100M = 19, 10M = 100.',
          '802.1D Port States: Blocking -> Listening (15s) -> Learning (15s) -> Forwarding.',
          'RSTP 802.1w Port States: Discarding, Learning, Forwarding.',
        ],
        frequentTraps: [
          'Do not confuse Root Port (one per non-root switch) with Designated Port (one per segment).',
          'Remember that lower numbers always win in STP (lower priority, lower cost, lower MAC).',
          'Extended System ID adds the VLAN ID (1-4094) to the base priority (e.g. Priority 4096 + VLAN 10 = BID Priority 4106).',
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
          'Disconnect the active link between SW-A and SW-B to trigger and observe STP reconvergence.',
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
          'RSTP (802.1w) provides sub-second convergence via synchronization handshakes.',
          'BPDU Guard and Root Guard protect the spanning tree topology from rogue devices.',
        ],
        nextLessonBridge:
          'With Layer 2 switching and loop-free redundant topologies mastered in NET-301 and NET-302, proceed to NET-303 to learn how routers forward packets across distinct Layer 3 broadcast domains using IP routing tables and static routes.',
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
        explanation:
          'IPv4 and IPv6 packets contain a TTL/Hop Limit field decremented at every Layer-3 router hop. Ethernet frames have no such mechanism, so any broadcast frame flooded on a loop will circulate and multiply infinitely.',
        explanationsJson: {
          1: 'Memory capacity is irrelevant; without a TTL field, frames circulate forever.',
          2: 'Standard Ethernet frames are unencrypted plaintext headers.',
          3: 'STP operates universally across all physical media (copper, fiber, virtual).',
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
        explanation:
          'In STP Root Bridge elections, the switch with the lowest numeric Bridge Priority wins. MAC address is only evaluated as a tie-breaker when priorities are identical.',
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
        explanation:
          'Root Port selection follows strict deterministic tie-breakers: (1) Lowest cumulative root path cost, (2) Lowest sender Bridge ID (neighbor BID), (3) Lowest sender Port ID (Priority.PortNumber).',
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
        explanation:
          'BPDU Guard is a critical security feature designed for edge access ports. If any BPDU is received on a BPDU Guard-enabled port, the switch immediately disables the port (err-disabled) to protect the spanning tree topology.',
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
        explanation:
          'Legacy 802.1D requires listening (15s) and learning (15s) timer delays. 802.1w RSTP introduces point-to-point synchronization handshakes that unblock ports in milliseconds.',
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
        '1. Inspect the 3-switch redundant ring topology.\n2. Execute `show spanning-tree` to identify the Root Bridge and verify the Root Port (RP) and Alternate/Blocked (BLK) ports.\n3. Configure primary root bridge priority: `spanning-tree vlan 1 priority 4096`.\n4. Simulate a link failure on the active root path and observe STP reconvergence unblocking the redundant link.',
      difficulty: CourseLevel.INTERMEDIATE,
      estimatedMinutes: 20,
      initialTopologyJson: {
        switches: [
          { id: 'SW-A', priority: 32768, mac: '00:1A:2B:3C:4D:01' },
          { id: 'SW-B', priority: 4096, mac: '00:1A:2B:3C:4D:02', isRoot: true },
          { id: 'SW-C', priority: 32768, mac: '00:1A:2B:3C:4D:03', blockedPort: 'Gi0/1' },
        ],
        links: [
          { from: 'SW-A', to: 'SW-B', status: 'UP', cost: 4 },
          { from: 'SW-B', to: 'SW-C', status: 'UP', cost: 4 },
          { from: 'SW-A', to: 'SW-C', status: 'BLOCKED', cost: 4 },
        ],
      },
      tasks: [
        'Execute `show spanning-tree` to inspect Bridge IDs and port roles.',
        'Identify which port is in the BLK (Blocking) state and explain why.',
        'Simulate link failure between SW-B and SW-C and verify reconvergence.',
      ],
    },
  },
];

import { CourseLevel, LessonType, CognitiveLevel, QuestionType } from '@prisma/client';
import { BenchmarkLessonFullDefinition } from './lessons-net300-400';

export const LESSONS_NET_C04: BenchmarkLessonFullDefinition[] = [
  // =========================================================================
  // MODULE 1: PERIMETER SECURITY, ACLS & STATEFUL FIREWALLS (NET-305)
  // =========================================================================
  {
    courseCode: 'NET-305',
    slug: 'net-305-standard-extended-ipv4-acls',
    title: 'Standard & Extended IPv4 Access Control Lists (ACLs)',
    type: LessonType.THEORY,
    durationMinutes: 35,
    order: 1,
    visualizationType: 'FIREWALL_ACL_SIMULATOR',
    introduction:
      'Master IPv4 Access Control Lists (ACLs), sequential rule processing, wildcard mask calculations, and precise inbound vs outbound interface placement.',
    contentV2: {
      objective:
        'Configure and evaluate standard and extended IPv4 Access Control Lists to filter network traffic based on source IP, destination IP, Layer 4 protocols, and port numbers.',
      prerequisites: [
        'NET-202: IPv4 Addressing, Subnetting & CIDR Notation',
        'NET-204: Transport Layer TCP/UDP Sockets & Well-Known Port Numbers',
      ],
      whyItMatters:
        'Access Control Lists are the primary Layer 3/4 packet filtering mechanism on enterprise routers and multilayer switches. Misconfigured ACLs or incorrect wildcard masks can accidentally block critical operational traffic, create asymmetric routing black holes, or leave administrative management planes exposed to unauthorized remote access.',
      explanation:
        'An Access Control List (ACL) is an ordered list of permit or deny statements applied to an interface to filter packets traversing a router or destined to the router control plane.\n\n### 1. Standard vs. Extended ACL Differences\n* **Standard ACLs (IDs 1-99, 1300-1999)**: Filter traffic based **exclusively on source IPv4 address**. Because they cannot inspect destination addresses or Layer 4 ports, best practice dictates placing standard ACLs **as close to the destination as possible** to avoid inadvertently blocking legitimate traffic along transit paths.\n* **Extended ACLs (IDs 100-199, 2000-2699)**: Filter traffic based on **source IP, destination IP, protocol (IP, TCP, UDP, ICMP), and Layer 4 port numbers** (e.g., eq 80, eq 443, range 1024 65535). Best practice dictates placing extended ACLs **as close to the source as possible** to eliminate unwanted traffic before it consumes network link bandwidth.\n\n### 2. Wildcard Masks & Bitwise Matching\nWildcard masks use inverted binary logic compared to subnet masks:\n* `0` bit = Match that exact bit in the IP address.\n* `1` bit = Ignore that bit (wildcard / don\'t care).\n* *Example*: To match the entire `/24` subnet `192.168.10.0/24`, the wildcard mask is `0.0.0.255`. To match a single host IP `10.1.1.50`, the wildcard mask is `0.0.0.0` (or the keyword `host 10.1.1.50`). To match any IP address, the wildcard mask is `255.255.255.255` (or the keyword `any`).\n\n### 3. Top-Down Sequential Evaluation & The Implicit Deny\nRouters process ACL entries sequentially from top to bottom:\n1. As soon as a packet matches a statement, the permit or deny action is executed immediately, and evaluation ceases.\n2. If a packet reaches the bottom of the ACL without matching any statement, it is silently dropped by the **implicit deny any** statement embedded at the end of every ACL.\n3. Every functional ACL must contain at least one `permit` statement; otherwise, all traffic is dropped.',
      recap: [
        'Standard ACLs filter strictly on source IP; place close to the destination.',
        'Extended ACLs filter on source IP, destination IP, Layer 4 protocol, and ports; place close to the source.',
        'Wildcard 0s require exact bit matches; wildcard 1s are don\'t-care bits.',
        'ACLs process top-down; the implicit deny any drops all unmatched packets at the end.',
      ],
      components: [
        {
          name: 'Standard IPv4 ACL',
          detail: 'Numbered 1-99 / 1300-1999; filters solely on source IP address.',
        },
        {
          name: 'Extended IPv4 ACL',
          detail: 'Numbered 100-199 / 2000-2699; filters on source, destination, protocol, and Layer 4 port.',
        },
        {
          name: 'Implicit Deny Any',
          detail: 'Default invisible terminal rule that drops all packets failing preceding matches.',
        },
      ],
      cliTooling: [
        {
          command: 'access-list 101 permit tcp 192.168.1.0 0.0.0.255 host 10.0.0.5 eq 443',
          description: 'Permits HTTPS traffic from subnet 192.168.1.0/24 to web server 10.0.0.5.',
          expectedOutput: '',
        },
        {
          command: 'interface GigabitEthernet0/0/1 \n ip access-group 101 in',
          description: 'Applies extended ACL 101 inbound on router interface Gi0/0/1.',
          expectedOutput: '',
        },
        {
          command: 'show ip access-lists 101',
          description: 'Displays ACL statements and real-time hit counters.',
          expectedOutput: 'Extended IP access list 101\n    10 permit tcp 192.168.1.0 0.0.0.255 host 10.0.0.5 eq 443 (1420 matches)\n    20 deny ip any any (45 matches)',
        },
      ],
      troubleshooting: [
        {
          symptom: 'Legitimate web traffic is blocked immediately after applying an ACL.',
          possibleCauses: ['Forgot to permit return traffic or missing explicit permit statement.', 'Implicit deny any dropped unmatched packets.'],
          diagnosticSteps: ['Run `show ip access-lists` to inspect match counters.', 'Check ACL direction (inbound vs outbound).'],
          remediation: 'Append required permit rule or utilize stateful inspection for return sessions.',
        },
      ],
      workedExample: {
        title: 'Calculating Wildcard Mask for a /22 Subnet and Writing an Extended ACL Rule',
        problemStatement:
          'Create an extended ACL rule permitting HTTPS traffic (TCP 443) from branch subnet 172.16.16.0/22 to an internal server at 10.0.0.5.',
        stepByStepSolution: [
          'Step 1: Calculate the wildcard mask by subtracting 255.255.252.0 (/22) from 255.255.255.255, which yields 0.0.3.255.',
          'Step 2: Identify transport protocol TCP and destination port 443 (https).',
          'Step 3: Construct the rule: access-list 101 permit tcp 172.16.16.0 0.0.3.255 host 10.0.0.5 eq 443.',
          'Step 4: Apply inbound on the interface closest to the traffic source: interface Gi0/0/0, ip access-group 101 in.',
        ],
        finalResult:
          'Extended ACL 101 correctly permits HTTPS traffic for the entire 172.16.16.0/22 subnet while preserving WAN bandwidth.',
      },
      practice: [
        {
          id: 1,
          prompt: 'What wildcard mask matches the entire /20 subnet 10.10.16.0/20?',
          expected: '0.0.15.255 (calculated as 255.255.255.255 minus 255.255.240.0).',
          hints: 'Subtract the subnet mask bytes from 255.255.255.255.',
        },
      ],
    },
    questions: [
      {
        text: 'Where should a Standard IPv4 Access Control List typically be placed according to network engineering best practices, and why?',
        options: [
          'As close to the destination as possible, because standard ACLs only filter by source IP and placing them near the source would block traffic to other destinations',
          'As close to the source as possible, to save WAN link bandwidth',
          'Only on switch trunk ports, because standard ACLs cannot run on routed interfaces',
          'Directly on the default gateway loopback interface',
        ],
        correctOption: 0,
        explanation:
          'Because Standard ACLs evaluate only the source IP address without knowing the destination, placing a standard ACL near the source would filter that host\'s traffic to all destinations. Placing it near the destination ensures only access to that specific network is restricted.',
        explanationsJson: {
          1: 'Placing near the source is the rule for Extended ACLs, not Standard ACLs.',
          2: 'Standard ACLs run on routed interfaces, not switch trunk ports.',
          3: 'Loopback interfaces do not filter transit user traffic.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Standard ACL Placement Best Practices',
      },
      {
        text: 'Which wildcard mask correctly matches all IPv4 hosts in the subnet 172.16.16.0/22?',
        options: [
          '0.0.3.255',
          '0.0.0.255',
          '0.0.7.255',
          '255.255.252.0',
        ],
        correctOption: 0,
        explanation:
          'A /22 subnet mask is 255.255.252.0. Subtracting 255.255.252.0 from 255.255.255.255 yields the wildcard mask: 255-255=0, 255-255=0, 255-252=3, 255-0=255 -> 0.0.3.255.',
        explanationsJson: {
          1: '0.0.0.255 matches a /24 subnet (256 addresses), not a /22.',
          2: '0.0.7.255 matches a /21 subnet (2048 addresses).',
          3: '255.255.252.0 is the subnet mask itself, not the wildcard mask.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.CONFIGURATION_ANALYSIS,
        concept: 'Wildcard Mask Calculation',
      },
      {
        text: 'An engineer configures an extended ACL with two lines: line 10 permits UDP port 53 (DNS) and line 20 permits TCP port 80 (HTTP). What happens to an incoming ICMP Echo Request packet arriving at the interface?',
        options: [
          'It is dropped by the implicit deny any rule at the end of the ACL',
          'It is automatically forwarded because ICMP is an administrative protocol',
          'It is forwarded because the ACL does not explicitly deny ICMP',
          'It is held in the router buffer until an ICMP rule is added',
        ],
        correctOption: 0,
        explanation:
          'Every Cisco IOS ACL has an invisible implicit `deny ip any any` at the end. Any packet that does not match an explicit permit statement (such as an ICMP Echo Request) is dropped.',
        explanationsJson: {
          1: 'ICMP is subject to packet filtering like any other Layer 3/4 protocol.',
          2: 'The absence of an explicit deny does not mean permit; the implicit deny drops all unmatched traffic.',
          3: 'Routers never buffer packets waiting for future ACL configuration changes.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.PACKET_ANALYSIS,
        concept: 'ACL Implicit Deny Evaluation',
      },
      {
        text: 'Which Cisco IOS command applies an Access Control List named `EDGE_FILTER` to filter incoming packets on interface GigabitEthernet0/0/0?',
        options: [
          'ip access-group EDGE_FILTER in',
          'ip access-list EDGE_FILTER inbound',
          'access-group EDGE_FILTER input',
          'filter-list EDGE_FILTER incoming',
        ],
        correctOption: 0,
        explanation:
          'Under interface configuration mode, the command `ip access-group <name|number> in` applies the ACL to filter inbound packets.',
        explanationsJson: {
          1: '`ip access-list` is used in global configuration mode to define the ACL, not to apply it to an interface.',
          2: '`access-group` without `ip` is invalid syntax in modern Cisco IOS.',
          3: '`filter-list` is used for BGP AS-path filters, not interface packet filtering.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.COMMAND_INTERPRETATION,
        concept: 'Interface ACL Binding Syntax',
      },
    ],
    lab: {
      title: 'Guided Practice: Standard & Extended ACL Packet Filtering',
      instructions:
        '1. Inspect the router perimeter interface Gi0/0/0.\n2. Create extended ACL 105 permitting TCP port 443 to DMZ server 10.0.1.10.\n3. Apply ACL 105 inbound on Gi0/0/0 and verify hit counters with show ip access-lists.',
      difficulty: CourseLevel.INTERMEDIATE,
      estimatedMinutes: 25,
      initialTopologyJson: { router: 'R1-Edge', interfaces: ['Gi0/0/0', 'Gi0/0/1'], dmzIp: '10.0.1.10' },
      tasks: [
        'Configure extended ACL statement permitting HTTPS traffic.',
        'Bind ACL to edge interface Gi0/0/0 in the inbound direction.',
        'Verify drop counters for non-permitted ICMP traffic.',
      ],
    },
  },
  {
    courseCode: 'NET-305',
    slug: 'net-305-stateful-firewalls-connection-tracking',
    title: 'Stateful Packet Inspection (SPI) & Zone-Based Firewalls',
    type: LessonType.THEORY,
    durationMinutes: 35,
    order: 2,
    visualizationType: 'FIREWALL_ACL_SIMULATOR',
    introduction:
      'Explore Stateful Packet Inspection (SPI), connection state tables, TCP sequence validation, and Zone-Based Policy Firewalls (ZFW).',
    contentV2: {
      objective:
        'Differentiate stateless packet filtering from stateful firewall inspection, and configure Zone-Based Policy Firewalls to automatically track and permit return traffic.',
      prerequisites: [
        'NET-305: Standard & Extended IPv4 Access Control Lists',
        'NET-204: TCP Three-Way Handshake & Connection States',
      ],
      whyItMatters:
        'Stateless ACLs examine packets in complete isolation with zero memory of past events. To permit return traffic from internet web servers, a stateless ACL must leave all ports above 1023 permanently open. Stateful firewalls track TCP flags, sequence numbers, and UDP pseudo-states in dynamic state tables, dynamically opening pinholes strictly for verified return packets.',
      explanation:
        '### 1. Stateless Filtering vs. Stateful Packet Inspection (SPI)\n* **Stateless Packet Filtering**: Evaluates static header fields (IP, port, protocol) independently. It cannot verify whether an incoming TCP packet with `ACK` was preceded by a valid client `SYN` request.\n* **Stateful Packet Inspection (SPI)**: Maintains a dynamic **State Table** (Connection Tracking Table). When an inside host initiates a connection (TCP SYN), the firewall logs `Source IP:Port`, `Destination IP:Port`, initial sequence numbers, and state. When the remote server replies with `SYN-ACK`, the firewall matches it against the state table and automatically permits the response through.\n\n### 2. Connection Tracking States\n1. **NEW**: The initial packet establishing a new session (e.g., TCP SYN).\n2. **ESTABLISHED**: Traffic matching an already validated, bi-directional active session in the state table.\n3. **RELATED**: Traffic starting a secondary session associated with an active connection (e.g., FTP data channels or ICMP error messages).\n4. **INVALID**: Packets that do not conform to valid protocol states (e.g., unsolicited FIN/RST or out-of-window sequence numbers), which are dropped immediately.\n\n### 3. Cisco Zone-Based Policy Firewall (ZFW) Architecture\nZFW replaces interface-bound ACLs with security zones:\n* **Security Zones**: Logical groupings of interfaces sharing similar security policies (e.g., `INSIDE`, `OUTSIDE`, `DMZ`).\n* **Zone Pairs**: Unidirectional policy pipelines defined between two zones (e.g., `INSIDE-to-OUTSIDE`).\n* **Default Zone Rule**: By default, traffic between interfaces in different zones is **completely dropped**. Traffic between interfaces in the same zone is permitted.\n* **Policy Actions**:\n  * `inspect`: Enables stateful packet inspection; return traffic is automatically permitted.\n  * `drop`: Silently discards packets.\n  * `pass`: Statelessly permits traffic unidirectionally (return traffic is NOT tracked).',
      recap: [
        'Stateful firewalls track session state; stateless ACLs evaluate each packet in isolation.',
        'State tables track TCP 3-way handshakes, sequence numbers, and ephemeral return ports.',
        'Zone-Based Firewalls drop all cross-zone traffic by default unless an explicit zone pair is configured.',
        'The `inspect` action dynamically permits return traffic for outbound sessions.',
      ],
      components: [
        {
          name: 'State Table (Conntrack)',
          detail: 'Dynamic memory table storing active TCP/UDP/ICMP sessions and sequence counters.',
        },
        {
          name: 'Zone Pair',
          detail: 'Unidirectional relationship connecting a source security zone to a destination security zone.',
        },
        {
          name: 'Inspect Policy',
          detail: 'Cisco Class-Based Policy rule performing deep protocol conformance and dynamic return pinholing.',
        },
      ],
      cliTooling: [
        {
          command: 'zone security INSIDE \n zone security OUTSIDE',
          description: 'Defines logical security zones in global configuration.',
          expectedOutput: '',
        },
        {
          command: 'zone-pair security IN_TO_OUT source INSIDE destination OUTSIDE \n service-policy type inspect FW_POLICY',
          description: 'Attaches stateful inspection policy to the unidirectional zone pair.',
          expectedOutput: '',
        },
        {
          command: 'show policy-map type inspect zone-pair sessions',
          description: 'Displays active stateful connection sessions tracked by the firewall engine.',
          expectedOutput: 'Zone-pair: IN_TO_OUT\n  Service-policy inspect : FW_POLICY\n    Class-map: APP_TRAFFIC (match-any)\n      Match: protocol tcp\n        Established Sessions: 18\n        Half-open Sessions: 0',
        },
      ],
      workedExample: {
        title: 'Configuring Cisco Zone-Based Policy Firewall (ZFW) Inspect Rule for Web Traffic',
        problemStatement:
          'Define a zone-pair from INSIDE to OUTSIDE and configure stateful inspection for HTTP/HTTPS so return traffic is dynamically permitted.',
        stepByStepSolution: [
          'Step 1: Create class-map matching HTTP and HTTPS: class-map type inspect match-any WEB_CM, match protocol http, match protocol https.',
          'Step 2: Define policy-map referencing the class-map with inspect action: policy-map type inspect FW_POLICY, class type inspect WEB_CM, inspect.',
          'Step 3: Create unidirectional zone-pair: zone-pair security IN_TO_OUT source INSIDE destination OUTSIDE.',
          'Step 4: Attach policy-map to zone-pair: service-policy type inspect FW_POLICY.',
        ],
        finalResult:
          'Outbound web requests generate state table entries that dynamically permit inbound return traffic without opening static inbound ports.',
      },
      practice: [
        {
          id: 1,
          prompt: 'What happens to traffic arriving at a ZFW interface if no zone-pair policy is defined between its zone and the destination zone?',
          expected: 'All inter-zone traffic is dropped by default.',
          hints: 'ZFW enforces a default-deny policy between distinct security zones.',
        },
      ],
    },
    questions: [
      {
        text: 'What is the primary operational advantage of a Stateful Packet Inspection (SPI) firewall over a Stateless Access Control List?',
        options: [
          'Stateful firewalls dynamically track outbound session requests and automatically permit the corresponding return traffic without opening permanent static inbound ports',
          'Stateful firewalls encrypt all payload data passing through the router',
          'Stateful firewalls eliminate the need for IPv4 routing tables',
          'Stateful firewalls operate at the physical layer to amplify electrical signals',
        ],
        correctOption: 0,
        explanation:
          'SPI firewalls maintain an internal connection state table. When an internal client initiates an outbound connection, the firewall records the session and dynamically allows return traffic from that specific remote server, eliminating the need to leave vulnerable inbound ports statically open.',
        explanationsJson: {
          1: 'Encryption is performed by VPN protocols (like IPsec or TLS), not by basic stateful packet inspection.',
          2: 'Firewalls still require Layer 3 routing tables to determine packet egress interfaces.',
          3: 'Firewalls operate at Layers 3, 4, and 7, not as Layer 1 repeaters.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Stateful vs Stateless Firewall Operation',
      },
      {
        text: 'In a Cisco Zone-Based Policy Firewall (ZFW) deployment, what happens by default to traffic flowing between interface Gi0/0 (assigned to zone INSIDE) and interface Gi0/1 (assigned to zone OUTSIDE)?',
        options: [
          'All traffic is dropped until an explicit zone-pair and inspection policy are configured',
          'Traffic is permitted bidirectionally with basic stateless filtering',
          'Traffic is permitted outbound, but inbound return traffic is dropped',
          'The router enters an interface error-disabled state',
        ],
        correctOption: 0,
        explanation:
          'In Cisco ZFW, the default policy between any two distinct security zones is an implicit, absolute drop. No traffic can traverse between different zones until a zone-pair and service policy are explicitly configured.',
        explanationsJson: {
          1: 'Cross-zone traffic is blocked by default; it is never automatically permitted.',
          2: 'Outbound traffic is not permitted automatically without a zone-pair definition.',
          3: 'Interfaces remain up/up; only packet forwarding across the zone boundary is dropped.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Zone-Based Policy Firewall Defaults',
      },
      {
        text: 'What ZFW policy action should an engineer apply to outbound HTTP/HTTPS client traffic so that return web traffic is automatically allowed back through the firewall?',
        options: [
          'inspect',
          'pass',
          'drop',
          'permit',
        ],
        correctOption: 0,
        explanation:
          'The `inspect` action instructs the firewall engine to track the TCP session statefully and dynamically allow returning responses. The `pass` action is stateless and would drop the return packets unless another rule permitted them inbound.',
        explanationsJson: {
          1: '`pass` is stateless; return traffic will be dropped by the reverse zone boundary.',
          2: '`drop` discards the traffic.',
          3: '`permit` is ACL syntax, not a valid ZFW policy action.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.COMMAND_INTERPRETATION,
        concept: 'ZFW Action Semantics',
      },
      {
        text: 'A connection tracking table flags an incoming TCP packet with the RST flag enabled as INVALID. Why does the stateful engine drop this packet?',
        options: [
          'The packet does not correspond to an established session or its sequence number falls outside the valid TCP window in the state table',
          'Stateful firewalls never permit TCP RST packets under any circumstances',
          'The packet must be converted to UDP before traversing the firewall',
          'The firewall buffer is 100% full',
        ],
        correctOption: 0,
        explanation:
          'Stateful firewalls validate TCP sequence and acknowledgment numbers against expected window thresholds. If an unsolicited RST packet arrives that does not match an existing tracked connection, it is classified as INVALID (often a blind TCP reset attack) and dropped.',
        explanationsJson: {
          1: 'Valid RST packets that match active connections in the state table are permitted to terminate the session cleanly.',
          2: 'TCP packets cannot and should not be converted to UDP.',
          3: 'The INVALID classification is a security decision based on state tracking, not queue buffer exhaustion.',
        },
        difficulty: CourseLevel.ADVANCED,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.PACKET_ANALYSIS,
        concept: 'Stateful Connection Tracking Validation',
      },
    ],
    lab: {
      title: 'Guided Practice: Zone-Based Firewall Policy & Conntrack Verification',
      instructions:
        '1. Define security zones INSIDE and OUTSIDE on router R1.\n2. Bind Gi0/0/0 to zone INSIDE and Gi0/0/1 to zone OUTSIDE.\n3. Create zone-pair IN_TO_OUT with stateful inspection for TCP and UDP traffic.\n4. Verify active session tracking with show policy-map type inspect zone-pair sessions.',
      difficulty: CourseLevel.INTERMEDIATE,
      estimatedMinutes: 25,
      initialTopologyJson: { zones: ['INSIDE', 'OUTSIDE'], policy: 'INSPECT_WEB' },
      tasks: [
        'Define security zones and assign router interfaces.',
        'Configure zone-pair IN_TO_OUT and apply inspect action.',
        'Validate dynamic session creation upon simulated client HTTP request.',
      ],
    },
  },

  // =========================================================================
  // MODULE 2: NETWORK & PORT ADDRESS TRANSLATION (NAT/PAT) (NET-401)
  // =========================================================================
  {
    courseCode: 'NET-401',
    slug: 'net-401-ipv4-nat-pat-address-translation',
    title: 'IPv4 Network Address Translation (Static, Dynamic & PAT Overload)',
    type: LessonType.THEORY,
    durationMinutes: 40,
    order: 1,
    visualizationType: 'NAT_PAT_TRANSLATION_ENGINE',
    introduction:
      'Master RFC 1918 private IPv4 address translation, Inside/Outside address terminology, Static 1:1 NAT, Dynamic pool NAT, and Port Address Translation (PAT / NAT Overload).',
    contentV2: {
      objective:
        'Understand and configure Static NAT, Dynamic NAT, and Port Address Translation (PAT) on border routers, and debug translation issues using translation tables.',
      prerequisites: [
        'NET-202: IPv4 Addressing, Subnetting & CIDR Notation',
        'NET-204: Transport Layer TCP/UDP Sockets & Well-Known Port Numbers',
      ],
      whyItMatters:
        'Due to global IPv4 address exhaustion, thousands of enterprise hosts must share one or few public IPv4 addresses to access the internet. NAT and PAT allow private networks (RFC 1918) to communicate across public WANs while hiding internal network topology from external observation.',
      explanation:
        '### 1. RFC 1918 Private IPv4 Address Spaces\nPrivate addresses are non-routable on the public internet:\n* **Class A**: `10.0.0.0/8` (`10.0.0.0` - `10.255.255.255`)\n* **Class B**: `172.16.0.0/12` (`172.16.0.0` - `172.31.255.255`)\n* **Class C**: `192.168.0.0/16` (`192.168.0.0` - `192.255.255.255`)\n\n### 2. Standard Cisco NAT Terminology\n* **Inside Local**: The private IP address assigned to an internal host on the private LAN.\n* **Inside Global**: The public IP address that represents the internal host to the outside world.\n* **Outside Local**: The IP address of an outside host as known to internal hosts (usually identical to Outside Global).\n* **Outside Global**: The globally routable public IP address assigned to a destination host on the internet.\n\n### 3. Translation Flavors\n1. **Static NAT (1-to-1)**: Maps a single private IP address to a single public IP address permanently. Commonly used for web servers and mail servers in DMZs so internet clients can initiate connections.\n2. **Dynamic NAT (Many-to-Many)**: Maps private IP addresses to a pool of public IP addresses on a first-come, first-served basis. If all public addresses in the pool are in use, subsequent requests are dropped.\n3. **Port Address Translation (PAT / NAT Overload)**: Maps multiple private IP addresses to a single public IP address by assigning unique Layer 4 source port numbers (from the dynamic pool 1024-65535) to each connection. PAT supports up to ~64,000 concurrent sessions per public IPv4 address.\n\n### 4. Cisco IOS Configuration Workflow\n1. Define internal and external interfaces: `ip nat inside` and `ip nat outside`.\n2. Define an access list matching private addresses to be translated: `access-list 1 permit 192.168.1.0 0.0.0.255`.\n3. Enable PAT overload on the external interface: `ip nat inside source list 1 interface Gi0/0/0 overload`.\n4. Inspect active translations: `show ip nat translations`.',
      recap: [
        'RFC 1918 addresses (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) are private and not routable on the public internet.',
        'Inside Local is the private client IP; Inside Global is the translated public IP seen by the outside world.',
        'Static NAT provides permanent 1-to-1 mapping; PAT multiplexes thousands of private hosts onto a single public IP using Layer 4 port numbers.',
        'The keyword `overload` enables Port Address Translation (PAT).',
      ],
      components: [
        {
          name: 'Inside Local IP',
          detail: 'Private IP address assigned to a device on the internal enterprise network.',
        },
        {
          name: 'Inside Global IP',
          detail: 'Publicly routable IP address representing internal devices to the public internet.',
        },
        {
          name: 'PAT Port Multiplexing Table',
          detail: 'Maintains mapping between Inside Local IP:Port and Inside Global IP:Port.',
        },
      ],
      cliTooling: [
        {
          command: 'ip nat inside source list 1 interface GigabitEthernet0/0/0 overload',
          description: 'Configures PAT overload, translating hosts in ACL 1 to the IP of Gi0/0/0.',
          expectedOutput: '',
        },
        {
          command: 'show ip nat translations',
          description: 'Displays current active NAT and PAT translation table entries.',
          expectedOutput: 'Pro Inside global         Inside local          Outside local         Outside global\ntcp 203.0.113.1:54321    192.168.1.50:49152    198.51.100.2:443      198.51.100.2:443\ntcp 203.0.113.1:54322    192.168.1.51:49152    198.51.100.2:443      198.51.100.2:443',
        },
        {
          command: 'clear ip nat translation *',
          description: 'Flushes all dynamic NAT/PAT translation entries from the router memory.',
          expectedOutput: '',
        },
      ],
      troubleshooting: [
        {
          symptom: 'Internal users cannot access the internet; show ip nat translations is completely empty.',
          possibleCauses: ['Missing `ip nat inside` or `ip nat outside` on router interfaces.', 'ACL statement does not permit internal client subnet.'],
          diagnosticSteps: ['Check interface configuration for `ip nat inside` and `ip nat outside`.', 'Verify ACL matches client subnet using `show ip access-lists`.'],
          remediation: 'Ensure `ip nat inside` is configured on LAN interfaces, `ip nat outside` on WAN interface, and the ACL permits the client subnet.',
        },
      ],
      workedExample: {
        title: 'Configuring Port Address Translation (PAT / NAT Overload) for a Branch Office',
        problemStatement:
          'Translate all internal LAN hosts in 192.168.10.0/24 to the router public WAN IP on GigabitEthernet0/0/0 using PAT.',
        stepByStepSolution: [
          'Step 1: Mark internal LAN interface: interface Gi0/0/1, ip nat inside.',
          'Step 2: Mark external WAN interface: interface Gi0/0/0, ip nat outside.',
          'Step 3: Define standard ACL matching the LAN subnet: access-list 1 permit 192.168.10.0 0.0.0.255.',
          'Step 4: Enable PAT overload: ip nat inside source list 1 interface GigabitEthernet0/0/0 overload.',
        ],
        finalResult:
          'Hundreds of internal hosts share the single public WAN IP by multiplexing unique Layer 4 source port numbers.',
      },
      practice: [
        {
          id: 1,
          prompt: 'Which Cisco NAT term refers to the private IPv4 address assigned to a host inside the local enterprise LAN?',
          expected: 'Inside Local address.',
          hints: 'It is local to the inside network before translation.',
        },
      ],
    },
    questions: [
      {
        text: 'In Cisco NAT terminology, what is an "Inside Global" address?',
        options: [
          'A globally routable public IPv4 address that represents an internal host to the external internet',
          'The private IP address assigned to a workstation on the local LAN',
          'The public IP address of an external web server on the internet',
          'The default gateway IP configured on the router loopback',
        ],
        correctOption: 0,
        explanation:
          'Inside Global refers to the public, globally routable IP address that the NAT router assigns to represent an internal host when transmitting packets to the outside world.',
        explanationsJson: {
          1: 'The private IP address on the local LAN is the "Inside Local" address.',
          2: 'The public IP address of an external server is the "Outside Global" address.',
          3: 'Loopback gateway addresses are not called Inside Global.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Cisco NAT Address Terminology',
      },
      {
        text: 'Which keyword must be appended to the Cisco IOS command `ip nat inside source list 1 interface GigabitEthernet0/0/0` to enable Port Address Translation (PAT)?',
        options: [
          'overload',
          'pat',
          'multiplex',
          'shared',
        ],
        correctOption: 0,
        explanation:
          'The keyword `overload` enables Port Address Translation (PAT), allowing multiple internal IP addresses to share a single public IP address by tracking unique Layer 4 port numbers.',
        explanationsJson: {
          1: '`pat` is not a valid Cisco IOS keyword for this command.',
          2: '`multiplex` is not a Cisco IOS NAT keyword.',
          3: '`shared` is not a valid keyword for NAT configuration.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.COMMAND_INTERPRETATION,
        concept: 'PAT Overload Configuration Syntax',
      },
      {
        text: 'A network administrator wants to make an internal web server with private IP 192.168.10.80 accessible to the public internet using public IP 203.0.113.80. Which NAT type is required?',
        options: [
          'Static NAT (1-to-1)',
          'Dynamic NAT with overload',
          'PAT Overload using interface IP',
          'Twice NAT with randomized source ports',
        ],
        correctOption: 0,
        explanation:
          'Static NAT provides a permanent, bidirectional one-to-one mapping between a private IP address and a public IP address, allowing external clients on the internet to initiate inbound connections to an internal server.',
        explanationsJson: {
          1: 'Dynamic NAT with overload (PAT) dynamically changes ports and does not allow external clients to initiate inbound sessions to internal servers without port forwarding.',
          2: 'PAT is designed for outbound client access, not hosting public servers on dedicated IPs.',
          3: 'Twice NAT is used for overlapping subnets, not basic public server publishing.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.SCENARIO,
        concept: 'Static vs Dynamic NAT Selection',
      },
      {
        text: 'Two internal hosts (192.168.1.10 and 192.168.1.20) simultaneously connect to web server 198.51.100.1:443. Both hosts coincidentally use source port 51234. How does PAT resolve this collision on the single public IP 203.0.113.1?',
        options: [
          'PAT assigns a different unique translated source port number (e.g. 51234 to host 1 and 51235 to host 2) on the public IP 203.0.113.1',
          'PAT drops the second host\'s connection attempt with an ICMP Port Unreachable error',
          'PAT queues the second host\'s packets until the first host disconnects',
          'PAT changes the destination port on the web server from 443 to 444',
        ],
        correctOption: 0,
        explanation:
          'PAT avoids collisions by rewriting the source port on the public interface. If host 1 uses translated port 51234, the router translates host 2 to another available port (e.g. 51235), keeping track of the mappings in the translation table.',
        explanationsJson: {
          1: 'PAT does not drop concurrent sessions with identical private source ports; it translates the port number.',
          2: 'Routers do not buffer TCP sessions waiting for port availability.',
          3: 'The destination port (443) belongs to the remote server service and must never be altered.',
        },
        difficulty: CourseLevel.ADVANCED,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.PACKET_ANALYSIS,
        concept: 'PAT Port Collision Resolution',
      },
    ],
    lab: {
      title: 'Guided Practice: PAT Overload Configuration & Translation Table Inspection',
      instructions:
        '1. Designate router interfaces: set Gi0/0/1 as `ip nat inside` and Gi0/0/0 as `ip nat outside`.\n2. Configure ACL 1 permitting 192.168.10.0/24.\n3. Configure PAT overload on Gi0/0/0.\n4. Simulate traffic from LAN clients and verify translations using `show ip nat translations`.',
      difficulty: CourseLevel.INTERMEDIATE,
      estimatedMinutes: 30,
      initialTopologyJson: { insideSubnet: '192.168.10.0/24', outsideIp: '203.0.113.1', insideInt: 'Gi0/0/1', outsideInt: 'Gi0/0/0' },
      tasks: [
        'Designate inside and outside NAT interfaces.',
        'Create matching ACL for LAN subnet.',
        'Configure `ip nat inside source list 1 interface Gi0/0/0 overload`.',
        'Verify active translation entries and hit counters.',
      ],
    },
  },

  // =========================================================================
  // MODULE 3: VPN ARCHITECTURES & CRYPTOGRAPHY (NET-402)
  // =========================================================================
  {
    courseCode: 'NET-402',
    slug: 'net-402-ipsec-vpn-cryptographic-tunnels',
    title: 'Site-to-Site IPsec VPNs & Cryptographic Tunneling',
    type: LessonType.THEORY,
    durationMinutes: 45,
    order: 1,
    visualizationType: 'IPSEC_CRYPTO_ENGINE',
    introduction:
      'Master IPsec security architecture, symmetric vs asymmetric cryptography, IKE Phase 1/2 negotiations, Diffie-Hellman key exchanges, and ESP tunnel encapsulation.',
    contentV2: {
      objective:
        'Understand and configure site-to-site IPsec VPN tunnels, evaluate IKE Phase 1 (ISAKMP) and IKE Phase 2 (IPsec SA) negotiations, and verify secure tunnel state.',
      prerequisites: [
        'NET-202: IPv4 Routing & Packet Forwarding',
        'NET-305: Standard & Extended Access Control Lists',
      ],
      whyItMatters:
        'Enterprise branch offices and data centers must exchange confidential proprietary data across untrusted public internet backbones. Without IPsec encryption and authentication, packets are susceptible to eavesdropping, man-in-the-middle data tampering, and replay attacks.',
      explanation:
        '### 1. The Core IPsec Security Services\nIPsec provides four fundamental cryptographic guarantees:\n1. **Confidentiality (Encryption)**: Ensures unauthorized parties cannot read packet payloads. Uses symmetric ciphers like **AES-128**, **AES-256**, or 3DES.\n2. **Integrity**: Ensures packets arrive without being altered in transit. Uses cryptographic hash algorithms (e.g., **SHA-256**, HMAC).\n3. **Authentication**: Verifies the genuine identity of the remote VPN peer. Achieved via **Pre-Shared Keys (PSK)** or digital certificates (RSA/ECDSA).\n4. **Anti-Replay Protection**: Verifies that duplicate packets captured by an attacker cannot be re-transmitted into the network, utilizing 64-bit sequence numbers in IPsec headers.\n\n### 2. IPsec Protocols: ESP vs. AH\n* **Encapsulating Security Payload (ESP - IP Protocol 50)**: Provides **both encryption and authentication**. It encapsulates the original IP packet inside an encrypted payload and appends an authentication trailer. ESP is the industry standard.\n* **Authentication Header (AH - IP Protocol 51)**: Provides authentication and integrity, but **zero encryption**. Because AH hashes outer IP header fields (including IP addresses), it is incompatible with NAT.\n\n### 3. IKE Phase 1 vs. IKE Phase 2 Negotiation\nSite-to-site IPsec establishes secure communication in two distinct phases:\n\n* **IKE Phase 1 (ISAKMP SA)**: Negotiates a secure management tunnel between the two router peers to safely exchange key material.\n  * Peers negotiate the **HAGLE** parameters: **H**ash (SHA-256), **A**uthentication (Pre-Shared Key), **G**roup (Diffie-Hellman Group 14/19/21), **L**ifetime (86400s), **E**ncryption (AES-256).\n  * **Diffie-Hellman (DH)**: Enables both peers to compute an identical shared secret key across an insecure public channel without transmitting the key itself.\n\n* **IKE Phase 2 (IPsec SA)**: Negotiates the actual data tunnel that encrypts user payload traffic.\n  * Peers agree on a **Transform Set** (e.g., `esp-aes 256 esp-sha256-hmac`).\n  * Peers define **Crypto ACLs** (Proxy IDs) matching interesting traffic (e.g., permit ip 10.1.0.0/24 10.2.0.0/24).\n  * Operates in **Tunnel Mode** (encrypts entire original packet and adds a new outer IP header).\n\n### 4. Modern VPN Alternatives: WireGuard Cryptokey Routing\nWhile enterprise hardware relies heavily on IPsec ASIC acceleration, modern Linux and cloud deployments increasingly favor **WireGuard**:\n* **Codebase & Attack Surface**: IPsec suites (StrongSwan) exceed 100,000 lines of code; WireGuard operates in <4,000 lines within kernel space, eliminating complex IKE multi-roundtrip handshakes and cipher negotiation downgrade attacks.\n* **Cryptokey Routing Principle**: WireGuard associates peer public keys directly with allowed IP address prefixes (`AllowedIPs`), routing packets through virtual tunnel interfaces (`wg0`) as pure Layer 3 routing entries rather than managing stateful Phase 1/2 SAs.\n* **Modern Cryptographic Primitives**: Employs **Curve25519** ECDH key exchange, **ChaCha20-Poly1305** authenticated encryption (AEAD), and **BLAKE2s** hashing using the 1-RTT Noise protocol framework over UDP.',
      recap: [
        'IPsec provides Confidentiality (AES), Integrity (SHA-256), Authentication (PSK/RSA), and Anti-Replay protection.',
        'ESP (IP protocol 50) provides encryption and authentication; AH (protocol 51) provides authentication only.',
        'IKE Phase 1 establishes the management tunnel (ISAKMP SA) using Diffie-Hellman key exchange.',
        'IKE Phase 2 establishes the data tunnel (IPsec SA) using transform sets and crypto ACLs.',
        'Tunnel mode encrypts the entire original packet with a new public outer IP header.',
        'WireGuard offers an auditable, lightweight kernel alternative using Cryptokey Routing over UDP.',
      ],
      components: [
        {
          name: 'IKE Phase 1 (ISAKMP SA)',
          detail: 'Bi-directional management tunnel negotiating encryption, DH key exchange, and peer authentication.',
        },
        {
          name: 'IKE Phase 2 (IPsec SA)',
          detail: 'Unidirectional data tunnel pair encrypting interesting user payload traffic.',
        },
        {
          name: 'Transform Set',
          detail: 'Combination of encryption cipher (AES) and hashing algorithm (SHA) for ESP data encapsulation.',
        },
        {
          name: 'WireGuard Cryptokey Routing',
          detail: 'Modern lightweight VPN mapping public keys directly to AllowedIPs prefixes in kernel routing space.',
        },
      ],
      cliTooling: [
        {
          command: 'crypto isakmp policy 10 \n encryption aes 256 \n hash sha256 \n authentication pre-share \n group 14',
          description: 'Defines IKE Phase 1 policy parameters (HAGLE).',
          expectedOutput: '',
        },
        {
          command: 'crypto ipsec transform-set TSET esp-aes 256 esp-sha256-hmac \n mode tunnel',
          description: 'Defines IKE Phase 2 transform set and tunnel encapsulation mode.',
          expectedOutput: '',
        },
        {
          command: 'show crypto isakmp sa',
          description: 'Verifies IKE Phase 1 status. Status QM_IDLE confirms Phase 1 is established.',
          expectedOutput: 'IPv4 Crypto ISAKMP SA\ndst             src             state          conn-id status\n203.0.113.2     203.0.113.1     QM_IDLE           1001 ACTIVE',
        },
        {
          command: 'show crypto ipsec sa',
          description: 'Verifies IKE Phase 2 status, active inbound/outbound SAs, and encrypted packet counters.',
          expectedOutput: 'interface: GigabitEthernet0/0/0\n    Crypto map tag: VPN_MAP, local addr 203.0.113.1\n   #pkts encaps: 24820, #pkts encrypt: 24820, #pkts digest: 24820\n   #pkts decaps: 24110, #pkts decrypt: 24110, #pkts verify: 24110\n   #pkts compressed: 0, #pkts decompressed: 0\n   #pkts not compressed: 0, #pkts compr. failed: 0\n   #send errors 0, #recv errors 0',
        },
      ],
      troubleshooting: [
        {
          symptom: '`show crypto isakmp sa` shows `MM_NO_STATE` or fails to transition to `QM_IDLE`.',
          possibleCauses: ['Mismatched Pre-Shared Key (PSK).', 'Mismatched Phase 1 policy parameters (AES vs 3DES, DH Group 14 vs 2).', 'Firewall blocking UDP port 500 or UDP port 4500.'],
          diagnosticSteps: ['Run `debug crypto isakmp` on both peers.', 'Verify PSK string matches exactly on both endpoints.'],
          remediation: 'Align IKE Phase 1 HAGLE parameters and pre-shared keys, and ensure UDP port 500 is permitted on edge firewalls.',
        },
      ],
      workedExample: {
        title: 'Verifying IPsec Phase 1 ISAKMP and Phase 2 IPsec Security Associations',
        problemStatement:
          'Diagnose an IPsec tunnel between HQ (203.0.113.1) and Branch (203.0.113.2) where users report intermittent VPN connectivity.',
        stepByStepSolution: [
          'Step 1: Inspect Phase 1 status: execute `show crypto isakmp sa`. Verify state is `QM_IDLE`. If `MM_NO_STATE`, Phase 1 failed (check PSK/ISAKMP policy).',
          'Step 2: Inspect Phase 2 status: execute `show crypto ipsec sa`. Verify `#pkts encaps` and `#pkts decaps` are incrementing evenly.',
          'Step 3: If encaps increments but decaps is 0, remote peer is not receiving or not returning packets (check firewall ACLs blocking UDP 500/ESP 50).',
          'Step 4: Verify proxy IDs / crypto ACLs match mirrored subnets on both tunnel endpoints.',
        ],
        finalResult:
          'Confirmed bidirectional packet encryption with active Phase 1 QM_IDLE and symmetric Phase 2 SA counters.',
      },
      practice: [
        {
          id: 1,
          prompt: 'What IP protocol number is used by IPsec Encapsulating Security Payload (ESP) headers in raw IP packets?',
          expected: 'IP Protocol 50 (ESP).',
          hints: 'AH is 51, TCP is 6, UDP is 17, ESP is 50.',
        },
      ],
    },
    questions: [
      {
        text: 'What state in the output of `show crypto isakmp sa` confirms that IKE Phase 1 has been successfully negotiated and is ready for Phase 2?',
        options: [
          'QM_IDLE',
          'MM_KEY_EXCH',
          'ESTABLISHED',
          'PHASE1_READY',
        ],
        correctOption: 0,
        explanation:
          'In Cisco IOS, `QM_IDLE` (Quick Mode Idle) confirms that IKE Phase 1 Main Mode negotiation has completed successfully and the peer is waiting in an idle, secure state for Phase 2 Quick Mode.',
        explanationsJson: {
          1: '`MM_KEY_EXCH` indicates Phase 1 is still in progress exchanging Diffie-Hellman keys.',
          2: '`ESTABLISHED` is used for BGP sessions, not Cisco ISAKMP SA output.',
          3: '`PHASE1_READY` is not a real Cisco IOS state.',
        },
        difficulty: CourseLevel.ADVANCED,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.COMMAND_INTERPRETATION,
        concept: 'IKE Phase 1 State Verification',
      },
      {
        text: 'Why is Encapsulating Security Payload (ESP) preferred over Authentication Header (AH) for securing remote internet communications?',
        options: [
          'ESP provides payload encryption for confidentiality in addition to integrity and authentication, whereas AH provides no encryption',
          'ESP operates at Layer 7 while AH is restricted to Layer 2',
          'ESP is completely free of mathematical algorithms',
          'AH requires dedicated hardware accelerator cards while ESP runs in browser memory',
        ],
        correctOption: 0,
        explanation:
          'ESP (IP protocol 50) encrypts user data to provide confidentiality, in addition to integrity, authentication, and anti-replay. AH (protocol 51) provides data integrity and authentication, but zero confidentiality/encryption.',
        explanationsJson: {
          1: 'Both ESP and AH operate at Layer 3 (Network Layer) as IP protocols 50 and 51.',
          2: 'ESP relies heavily on advanced cryptography (AES, 3DES, HMAC).',
          3: 'Both protocols can run in software or with hardware acceleration; neither runs in browser memory.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'IPsec ESP vs AH Protocol Capabilities',
      },
      {
        text: 'What is the mathematical role of the Diffie-Hellman (DH) key exchange algorithm in IKE Phase 1 negotiation?',
        options: [
          'It enables two peers to calculate a shared symmetric encryption secret over an insecure public channel without ever transmitting the secret key itself',
          'It permanently compresses packet payloads by 90%',
          'It calculates the shortest path through the WAN like OSPF',
          'It signs digital certificates using a public root CA',
        ],
        correctOption: 0,
        explanation:
          'Diffie-Hellman is an asymmetric mathematical protocol that allows two communication parties to establish a shared symmetric secret over an unencrypted network without transmitting the secret across the wire.',
        explanationsJson: {
          1: 'Compression is handled by LZS or Deflate, not Diffie-Hellman.',
          2: 'Shortest path calculation is done by routing protocols (OSPF, IS-IS), not cryptographic key exchanges.',
          3: 'Certificate signing is performed by asymmetric public key algorithms (RSA/ECDSA), not DH.',
        },
        difficulty: CourseLevel.ADVANCED,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Diffie-Hellman Key Exchange Role',
      },
      {
        text: 'In an IPsec site-to-site VPN, what is the function of "Interesting Traffic" defined in a Crypto Access Control List?',
        options: [
          'It defines the source and destination subnets that trigger tunnel activation and must be encrypted before transmission across the WAN',
          'It marks all video streaming traffic for high priority QoS treatment',
          'It logs web browsing history to an external syslog server',
          'It filters out spam emails before they reach the mail server',
        ],
        correctOption: 0,
        explanation:
          'A Crypto ACL defines "interesting traffic" (Proxy ID). When a packet matches this ACL, the router initiates the IPsec tunnel (if not already active) and encrypts the packet before routing it over the public interface.',
        explanationsJson: {
          1: 'QoS traffic classification uses class maps, not crypto ACLs.',
          2: 'Logging is handled by syslog and NetFlow, not crypto maps.',
          3: 'Email spam filtering is performed by application-layer secure email gateways.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.SCENARIO,
        concept: 'Crypto ACL Interesting Traffic Definition',
      },
    ],
    lab: {
      title: 'Guided Practice: IKE Phase 1/2 IPsec Tunnel Verification',
      instructions:
        '1. Inspect IKE Phase 1 ISAKMP policy on R1 and R2.\n2. Configure pre-shared key for remote peer 203.0.113.2.\n3. Verify Phase 2 transform-set and apply crypto map to WAN interface.\n4. Send interesting traffic from LAN1 (10.1.1.0/24) to LAN2 (10.2.2.0/24) and verify encrypted packet counters with show crypto ipsec sa.',
      difficulty: CourseLevel.ADVANCED,
      estimatedMinutes: 35,
      initialTopologyJson: { localPeer: '203.0.113.1', remotePeer: '203.0.113.2', localLan: '10.1.1.0/24', remoteLan: '10.2.2.0/24' },
      tasks: [
        'Configure matching IKE Phase 1 HAGLE parameters and PSK on both peers.',
        'Define transform set esp-aes 256 esp-sha256-hmac.',
        'Define crypto ACL matching LAN-to-LAN traffic and apply crypto map.',
        'Verify `show crypto isakmp sa` (QM_IDLE) and `show crypto ipsec sa` (#pkts encrypt > 0).',
      ],
    },
  },
];

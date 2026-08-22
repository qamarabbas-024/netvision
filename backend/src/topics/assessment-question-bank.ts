import { CourseLevel, CognitiveLevel, QuestionType } from '@prisma/client';

export interface AssessmentQuestionDef {
  quizId: string;
  lessonSlug: string;
  text: string;
  options: string[];
  correctOption: number;
  explanation: string;
  explanationsJson: Record<number, string>;
  difficulty: CourseLevel;
  cognitiveLevel: CognitiveLevel;
  questionType: QuestionType;
  concept: string;
  points?: number;
}

export const EXPANDED_ASSESSMENT_QUESTION_BANK: AssessmentQuestionDef[] = [
  // =========================================================================
  // 1. LEVEL 0 FOUNDATIONS (14 Quizzes x 4 Questions = 56 Questions)
  // =========================================================================

  // -------------------------------------------------------------------------
  // Lesson 1: What is a Computer Network?
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-level-0-what-is-a-computer-network',
    lessonSlug: 'level-0-what-is-a-computer-network',
    text: 'Which primary characteristic fundamentally distinguishes a computer network from a collection of isolated standalone computers?',
    options: [
      'The ability of interconnected endpoints to exchange data and share resources over shared communication links',
      'The requirement that every connected node runs the exact same operating system and hardware architecture',
      'The continuous distribution of electrical alternating current to power connected workstation monitors',
      'The restriction that data can only travel in one single direction across a single central bus'
    ],
    correctOption: 0,
    explanation: 'A computer network is fundamentally defined as an interconnected collection of autonomous computing nodes that exchange data packets and share logical and physical resources over communication channels.',
    explanationsJson: {
      1: 'Networks are heterogeneous; devices with different operating systems (Linux, Windows, macOS, iOS) routinely communicate using standard protocols.',
      2: 'Power distribution is electrical utility infrastructure, not data telecommunications.',
      3: 'Modern networks support bidirectional full-duplex communication across varied topologies, not strictly unidirectional simplex transmission.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Network Definition & Resource Sharing',
    points: 10
  },
  {
    quizId: 'quiz-level-0-what-is-a-computer-network',
    lessonSlug: 'level-0-what-is-a-computer-network',
    text: 'A graphic design firm connects 15 workstations to a centralized Network Attached Storage (NAS) appliance. What core networking benefit is being leveraged in this scenario?',
    options: [
      'Resource sharing and centralized file accessibility',
      'Elimination of physical network cabling vulnerabilities',
      'Hardware CPU overclocking across distributed processors',
      'Automatic hardware repair of failing workstation hard drives'
    ],
    correctOption: 0,
    explanation: 'Centralized NAS deployment allows multiple independent nodes on a LAN to concurrently read and write shared assets, embodying the core network benefit of resource sharing.',
    explanationsJson: {
      1: 'Connecting to a NAS does not eliminate physical cabling; Ethernet cables or wireless links are still required.',
      2: 'A NAS provides shared storage, not CPU processor pooling or hardware clock boost.',
      3: 'Networks do not physically repair hardware components.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.SCENARIO,
    concept: 'Resource Sharing',
    points: 10
  },
  {
    quizId: 'quiz-level-0-what-is-a-computer-network',
    lessonSlug: 'level-0-what-is-a-computer-network',
    text: 'What is the standard unit of digital transmission representing the smallest discrete element in computing communications?',
    options: [
      'Bit (Binary Digit: 0 or 1)',
      'Byte (8 contiguous bits)',
      'Packet (Encapsulated L3 PDU)',
      'Frame (Encapsulated L2 PDU)'
    ],
    correctOption: 0,
    explanation: 'A bit (binary digit) is the atomic, indivisible unit of digital data, holding a value of either 0 or 1 representing electrical voltage, optical pulse, or RF state.',
    explanationsJson: {
      1: 'A byte is a collection of 8 bits, not the smallest atomic unit.',
      2: 'A packet is a complex Layer 3 data structure containing headers and payload.',
      3: 'A frame is a Layer 2 data structure with preamble, MAC headers, payload, and FCS.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.RECALL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Digital Data Units',
    points: 10
  },
  {
    quizId: 'quiz-level-0-what-is-a-computer-network',
    lessonSlug: 'level-0-what-is-a-computer-network',
    text: 'Two laptops in a conference room cannot share files directly because they are not connected to any network or physical medium. What is the most immediate solution to establish connectivity between them without external infrastructure?',
    options: [
      'Configure an ad-hoc Wi-Fi connection or connect a direct Ethernet cable between their NICs',
      'Reinstall the operating system on both laptops simultaneously',
      'Assign an arbitrary public IP address without configuring a physical or wireless link',
      'Replace the laptops displays with high-refresh monitors'
    ],
    correctOption: 0,
    explanation: 'Computers require a shared physical or wireless transmission medium (such as an ad-hoc 802.11 wireless link or direct Ethernet cable) to transmit binary electrical/radio signals.',
    explanationsJson: {
      1: 'Reinstalling the OS without physical medium connectivity will not establish a communication channel.',
      2: 'IP configuration requires an underlying Layer 1 physical link to transmit frames.',
      3: 'Monitor hardware has no bearing on network interface connectivity.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
    questionType: QuestionType.TROUBLESHOOTING,
    concept: 'Network Connectivity Requirements',
    points: 10
  },

  // -------------------------------------------------------------------------
  // Lesson 2: Devices in a Network
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-level-0-devices-in-a-network',
    lessonSlug: 'level-0-devices-in-a-network',
    text: 'How does an Ethernet Switch differ fundamentally from a legacy Ethernet Hub in its handling of unicast traffic?',
    options: [
      'A switch forwards unicast frames only to the specific destination port using its MAC address table, whereas a hub broadcasts incoming frames out all ports',
      'A switch operates exclusively at Layer 3 using IP routing, whereas a hub operates at Layer 7 using HTTP inspection',
      'A switch converts digital data into analog radio frequencies, whereas a hub converts data into optical pulses',
      'A switch requires manual static IP configuration on every port, whereas a hub automatically assigns DHCP leases'
    ],
    correctOption: 0,
    explanation: 'Layer 2 switches build a MAC address table (CAM table) to forward unicast frames directly to the intended destination port, creating dedicated collision domains per port. Hubs are Layer 1 repeaters that blindly flood electrical signals to all connected ports.',
    explanationsJson: {
      1: 'Standard switches operate at Layer 2 (Data Link), while hubs operate at Layer 1 (Physical). Neither inspects Layer 7 HTTP by default.',
      2: 'Switches do not convert signals to RF (unless integrated into an access point).',
      3: 'Standard switches and hubs do not act as DHCP servers or require per-port IP addresses.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Hub vs Switch Architecture',
    points: 10
  },
  {
    quizId: 'quiz-level-0-devices-in-a-network',
    lessonSlug: 'level-0-devices-in-a-network',
    text: 'Which networking hardware device is specifically responsible for interconnecting different IP subnets and forwarding packets across logical network boundaries?',
    options: [
      'Router',
      'Layer 2 Unmanaged Switch',
      'Passive Patch Panel',
      'Network Interface Card (NIC)'
    ],
    correctOption: 0,
    explanation: 'Routers operate at Layer 3 (Network Layer) of the OSI model and inspect destination IP addresses to route packets across distinct subnets and wide area network boundaries.',
    explanationsJson: {
      1: 'An unmanaged Layer 2 switch only forwards frames within a single local broadcast domain/subnet.',
      2: 'A patch panel is a physical cable organizer with no active processing or packet forwarding logic.',
      3: 'A NIC is an endpoint interface adapter that connects a single host to the network medium.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.RECALL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Router Functionality',
    points: 10
  },
  {
    quizId: 'quiz-level-0-devices-in-a-network',
    lessonSlug: 'level-0-devices-in-a-network',
    text: 'A network administrator notices severe performance degradation in an old office wing. Packet analysis reveals frequent frame collisions occurring whenever two workstations transmit simultaneously. What device is most likely installed at the center of this wing?',
    options: [
      'A legacy half-duplex Ethernet Hub sharing a single collision domain across all ports',
      'A managed Gigabit Ethernet switch running full-duplex auto-negotiation',
      'A multi-port enterprise router isolating broadcast domains per interface',
      'A Next-Generation Firewall performing stateful deep packet inspection'
    ],
    correctOption: 0,
    explanation: 'Ethernet hubs operate in half-duplex mode where all connected ports share a single collision domain. Simultaneous transmissions cause electrical collisions, triggering CSMA/CD backoff algorithms.',
    explanationsJson: {
      1: 'Modern full-duplex switches dedicate a collision domain to each port, eliminating frame collisions.',
      2: 'Routers segment collision and broadcast domains; they do not propagate collisions across ports.',
      3: 'Firewalls inspect packet states; they do not introduce Layer 1 electrical collisions.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
    questionType: QuestionType.TROUBLESHOOTING,
    concept: 'Collision Domain Diagnosis',
    points: 10
  },
  {
    quizId: 'quiz-level-0-devices-in-a-network',
    lessonSlug: 'level-0-devices-in-a-network',
    text: 'An office deployment requires connecting 50 desktop PCs in the same room on subnet 192.168.10.0/24 to each other and providing a single uplink to the corporate gateway. Which device configuration best satisfies this requirement?',
    options: [
      'A 48-port Layer 2 switch connected to workstations with a gigabit uplink to the router',
      '50 individual hardware routers daisy-chained in series',
      'A single wireless repeater plugged into an unpowered wall outlet',
      'An analog dial-up modem connected to a serial console cable'
    ],
    correctOption: 0,
    explanation: 'A high-density Layer 2 switch provides dedicated, full-duplex local switching for all 50 workstations in the same subnet and a high-speed uplink to the Layer 3 router.',
    explanationsJson: {
      1: 'Daisy-chaining 50 routers would introduce massive latency, complex routing tables, and unnecessary cost.',
      2: 'An unpowered wireless repeater provides no connectivity and cannot support 50 wired PCs.',
      3: 'Analog modems are low-bandwidth legacy WAN adapters unsuitable for LAN aggregation.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.SCENARIO,
    concept: 'LAN Device Selection',
    points: 10
  },

  // -------------------------------------------------------------------------
  // Lesson 3: Client and Server Architecture
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-level-0-client-and-server-architecture',
    lessonSlug: 'level-0-client-and-server-architecture',
    text: 'In the standard Client-Server architectural paradigm, which role does the Client node perform during an interaction?',
    options: [
      'It initiates communication by issuing service or resource requests to a listening server',
      'It passively waits for unsolicited incoming connections from public Internet hosts',
      'It binds permanently to well-known privileged system ports to host web pages',
      'It dynamically routes IP packets between different Autonomous Systems'
    ],
    correctOption: 0,
    explanation: 'In a client-server architecture, the client acts as the active requestor that initiates contact with a server that is listening on a known IP address and port.',
    explanationsJson: {
      1: 'Passively listening for unsolicited incoming connections is the role of a server daemon.',
      2: 'Clients use dynamic ephemeral ports (e.g., 49152-65535) rather than well-known server listening ports.',
      3: 'Routing IP packets across Autonomous Systems is the job of BGP routers, not standard end clients.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Client-Server Communication Flow',
    points: 10
  },
  {
    quizId: 'quiz-level-0-client-and-server-architecture',
    lessonSlug: 'level-0-client-and-server-architecture',
    text: 'When a web browser client connects to a web server (https://example.com), what port combination is typically utilized for the TCP transport connection?',
    options: [
      'A randomly chosen high ephemeral source port (e.g. 52140) on the client, and destination port 443 on the server',
      'Source port 80 on the client, and destination port 80 on the server',
      'Source port 443 on the client, and destination port 443 on the server',
      'Destination port 0 on the server, and source port 25 on the client'
    ],
    correctOption: 0,
    explanation: 'The client OS allocates an unused ephemeral port (above 1024 / 49152) as the source port and targets the standard well-known service port (443 for HTTPS) on the server.',
    explanationsJson: {
      1: 'Clients do not use port 80 as a source port for outbound web requests.',
      2: 'Client ephemeral source ports are chosen dynamically by the OS, not set to 443.',
      3: 'Port 0 is reserved/invalid, and port 25 is dedicated to SMTP mail relay.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Socket Port Assignment',
    points: 10
  },
  {
    quizId: 'quiz-level-0-client-and-server-architecture',
    lessonSlug: 'level-0-client-and-server-architecture',
    text: 'How does a Peer-to-Peer (P2P) architecture differ fundamentally from a traditional Client-Server model?',
    options: [
      'Every node in a P2P network can act as both a client and a server, sharing resources without a central authority',
      'P2P networks do not use IP addresses or Ethernet cables',
      'P2P networks can only transfer text files smaller than 1 kilobyte',
      'P2P networks require an enterprise mainframe to validate every transaction'
    ],
    correctOption: 0,
    explanation: 'In Peer-to-Peer networks (such as BitTorrent), each node (peer) simultaneously functions as both a client (downloading data) and a server (uploading data) without relying on centralized host infrastructure.',
    explanationsJson: {
      1: 'P2P networks operate over standard TCP/IP networking protocols and Ethernet/Wi-Fi media.',
      2: 'P2P networks can transfer files of arbitrary size, often gigabytes or terabytes.',
      3: 'P2P is decentralized; it specifically avoids relying on central mainframes or servers.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Peer-to-Peer vs Client-Server',
    points: 10
  },
  {
    quizId: 'quiz-level-0-client-and-server-architecture',
    lessonSlug: 'level-0-client-and-server-architecture',
    text: 'A user types `https://intranet.corp.local` in their browser and receives an error: "Connection Refused (ERR_CONNECTION_REFUSED)". What does this specific TCP-level diagnostic indicate?',
    options: [
      'The server host was reached at the IP level, but no software process was actively listening on TCP port 443, causing the OS to return a TCP RST packet',
      'The physical Ethernet cable between the client and switch has been severed completely',
      'The DNS server failed to resolve the hostname into an IP address',
      'The client web browser software is corrupted and needs an immediate operating system reinstall'
    ],
    correctOption: 0,
    explanation: 'A "Connection Refused" error means IP routing and ARP succeeded in delivering the TCP SYN packet to the destination host, but the target server OS had no listening service on port 443 and immediately responded with a TCP RST (Reset).',
    explanationsJson: {
      1: 'A severed physical cable produces "Network Unreachable" or a timeout, not a TCP Reset from the target host.',
      2: 'If DNS resolution failed, the browser would report "DNS_PROBE_FINISHED_NXDOMAIN" or "Host Not Found".',
      3: 'Connection refused is a standard network response indicating the target web service is stopped or port mismatch.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
    questionType: QuestionType.TROUBLESHOOTING,
    concept: 'Connection Refused Diagnosis',
    points: 10
  },

  // -------------------------------------------------------------------------
  // Lesson 4: LAN, WAN, and the Global Internet
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-level-0-lan-wan-internet-boundaries',
    lessonSlug: 'level-0-lan-wan-internet-boundaries',
    text: 'What is the primary geographic and administrative distinction between a Local Area Network (LAN) and a Wide Area Network (WAN)?',
    options: [
      'A LAN spans a limited local geographic area (single office/building) under unified private administration, whereas a WAN spans vast distances connecting disparate LANs across leased telecommunication circuits',
      'A LAN uses wireless infrared exclusively, whereas a WAN uses copper coaxial cables exclusively',
      'A LAN operates without IP addresses, whereas a WAN requires every device to have a public domain name',
      'A LAN cannot connect more than two computers, whereas a WAN requires at least 1,000,000 devices'
    ],
    correctOption: 0,
    explanation: 'A LAN covers a localized physical footprint (residence, building, campus) operated by a single entity. A WAN interconnects geographically dispersed LANs across cities, countries, or continents using telecommunications service provider infrastructure.',
    explanationsJson: {
      1: 'LANs commonly use copper UTP (Ethernet) and Wi-Fi; WANs utilize fiber optics, satellite, and cellular.',
      2: 'LANs rely heavily on IPv4/IPv6 addressing for internal communication.',
      3: 'LANs regularly connect hundreds or thousands of nodes, while small WAN point-to-point links can connect just two router endpoints.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'LAN vs WAN Scope',
    points: 10
  },
  {
    quizId: 'quiz-level-0-lan-wan-internet-boundaries',
    lessonSlug: 'level-0-lan-wan-internet-boundaries',
    text: 'Which networking term best describes a high-speed network spanning an entire metropolitan area or university campus, positioned geographically between a LAN and a WAN?',
    options: [
      'MAN (Metropolitan Area Network) / CAN (Campus Area Network)',
      'PAN (Personal Area Network)',
      'SAN (Storage Area Network)',
      'VPN (Virtual Private Network)'
    ],
    correctOption: 0,
    explanation: 'A Metropolitan Area Network (MAN) spans a city or municipality, and a Campus Area Network (CAN) connects multiple LAN buildings within a university or industrial park.',
    explanationsJson: {
      1: 'A PAN (Personal Area Network) covers a few meters around an individual (e.g., Bluetooth devices).',
      2: 'A SAN is a specialized high-speed storage network connecting servers to disk arrays (e.g., Fibre Channel, iSCSI).',
      3: 'A VPN is an encrypted tunnel over an existing network, not a geographic network scale classification.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.RECALL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Network Scope Classification',
    points: 10
  },
  {
    quizId: 'quiz-level-0-lan-wan-internet-boundaries',
    lessonSlug: 'level-0-lan-wan-internet-boundaries',
    text: 'A company operates headquarter offices in New York and a branch facility in London. Workstations in New York need secure access to database servers in London over the public Internet. What technology is most appropriate?',
    options: [
      'Site-to-Site IPsec VPN tunnel across the WAN',
      'Running a 3,500-mile unshielded Cat5e patch cable across the Atlantic seabed without repeaters',
      'Placing all computers in London and New York on the same unmanaged Layer 2 Ethernet hub',
      'Disabling firewalls and publishing database credentials in plain text across public DNS'
    ],
    correctOption: 0,
    explanation: 'A Site-to-Site IPsec VPN encrypts traffic traversing untrusted public WAN links (the Internet), securely interconnecting the two remote LANs as if they were directly linked.',
    explanationsJson: {
      1: 'Unshielded copper Cat5e has a strict physical distance limit of 100 meters (328 feet).',
      2: 'Ethernet hubs cannot bridge transatlantic distances and would create massive collision domains.',
      3: 'Disabling firewalls and exposing credentials causes severe security compromise.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.SCENARIO,
    concept: 'WAN Interconnection Design',
    points: 10
  },
  {
    quizId: 'quiz-level-0-lan-wan-internet-boundaries',
    lessonSlug: 'level-0-lan-wan-internet-boundaries',
    text: 'Users in an office report they can print to local network printers and ping other PCs on the 192.168.1.0/24 subnet, but cannot access any public websites (e.g. google.com). What is the most likely root cause?',
    options: [
      'The local gateway router WAN interface or ISP Internet connection is down, while the local LAN switch is functioning normally',
      'All local workstation Network Interface Cards have experienced simultaneous hardware failure',
      'The local Ethernet switch has run out of MAC address memory and stopped switching',
      'The printer hardware is broadcasting too many print jobs across the local subnet'
    ],
    correctOption: 0,
    explanation: 'Successful local printing and inter-PC pinging proves the Layer 1/2 LAN switch and host IP configurations are fully operational. Inability to reach external destinations points to an issue at the Default Gateway or ISP WAN link.',
    explanationsJson: {
      1: 'If workstation NICs failed, users could not ping other local PCs or print over the LAN.',
      2: 'If the LAN switch stopped switching, local LAN traffic would fail.',
      3: 'Print jobs do not prevent outbound WAN routing if the gateway link is healthy.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
    questionType: QuestionType.TROUBLESHOOTING,
    concept: 'LAN vs WAN Isolation Troubleshooting',
    points: 10
  },

  // -------------------------------------------------------------------------
  // Lesson 5: Special-Use IPv4 Ranges & Enterprise Address Allocation
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-level-0-ip-addresses-logical-location',
    lessonSlug: 'level-0-ip-addresses-logical-location',
    text: 'Which of the following IPv4 address blocks is an official RFC 1918 Private address range that is non-routable on the public Internet?',
    options: [
      '172.20.0.0/16',
      '172.35.0.0/16',
      '192.170.0.0/16',
      '11.0.0.0/8'
    ],
    correctOption: 0,
    explanation: 'RFC 1918 Class B private space covers `172.16.0.0` through `172.31.255.255` (/12). `172.20.0.0/16` falls directly within this private range.',
    explanationsJson: {
      1: '172.35.0.0/16 is outside the private 172.16-172.31 range and is a publicly routable IP.',
      2: '192.170.0.0/16 is outside the private 192.168.0.0/16 range and is public.',
      3: '11.0.0.0/8 is public (only 10.0.0.0/8 is private in the 10.x space).'
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'RFC 1918 Private Address Ranges',
    points: 10
  },
  {
    quizId: 'quiz-level-0-ip-addresses-logical-location',
    lessonSlug: 'level-0-ip-addresses-logical-location',
    text: 'A network technician runs `ipconfig` on a workstation that cannot access the Internet and sees IPv4 address `169.254.88.19` with subnet mask `255.255.0.0`. What does this address indicate?',
    options: [
      'The workstation failed to contact a DHCP server and self-assigned an APIPA Link-Local address',
      'The workstation successfully obtained a private corporate IP lease from the domain controller',
      'The workstation has been assigned a public Carrier-Grade NAT address by the ISP',
      'The workstation network interface card is defective and must be physically replaced'
    ],
    correctOption: 0,
    explanation: 'Addresses in `169.254.0.0/16` are Automatic Private IP Addressing (APIPA) link-local addresses, assigned by the operating system when DHCP Discover broadcasts receive no reply.',
    explanationsJson: {
      1: 'Corporate DHCP leases use RFC 1918 private spaces (10.x, 172.16-31.x, 192.168.x), not APIPA.',
      2: 'Carrier-Grade NAT uses 100.64.0.0/10, not 169.254.x.x.',
      3: 'APIPA indicates a DHCP server/network connectivity failure, not necessarily hardware failure.'
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
    questionType: QuestionType.TROUBLESHOOTING,
    concept: 'APIPA / Link-Local Troubleshooting',
    points: 10
  },
  {
    quizId: 'quiz-level-0-ip-addresses-logical-location',
    lessonSlug: 'level-0-ip-addresses-logical-location',
    text: 'What is the primary purpose of the `100.64.0.0/10` IPv4 address block defined in RFC 6598?',
    options: [
      'Carrier-Grade NAT (CGNAT) Shared Address Space used by ISPs to connect customers without colliding with RFC 1918 subnets',
      'Multicast streaming for public Internet radio broadcasts',
      'Internal loopback testing for multi-core CPUs',
      'Direct satellite uplink routing for military defense networks'
    ],
    correctOption: 0,
    explanation: 'RFC 6598 designates `100.64.0.0/10` as Shared Address Space for Carrier-Grade NAT (CGNAT), allowing service providers to NAT subscriber traffic without conflicting with internal customer 10.x or 192.168.x subnets.',
    explanationsJson: {
      1: 'Multicast uses Class D 224.0.0.0/4 (224.0.0.0 to 239.255.255.255).',
      2: 'Loopback uses 127.0.0.0/8.',
      3: 'Military defense historically received legacy Class A blocks (e.g. 6.0.0.0/8, 11.0.0.0/8).'
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.RECALL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Carrier-Grade NAT (RFC 6598 Shared Space)',
    points: 10
  },
  {
    quizId: 'quiz-level-0-ip-addresses-logical-location',
    lessonSlug: 'level-0-ip-addresses-logical-location',
    text: 'When an engineer executes `ping 127.0.0.1` in a command terminal, where do the generated ICMP packets physically travel?',
    options: [
      'They are processed entirely within the local host operating system TCP/IP software stack in RAM and never reach the network card or wire',
      'They travel out the physical Ethernet port to the local default gateway and return',
      'They are broadcast to all devices on the local Layer 2 switch',
      'They query the nearest public DNS root server'
    ],
    correctOption: 0,
    explanation: 'The entire `127.0.0.0/8` range is reserved for node-local loopback. Traffic sent to 127.0.0.1 is routed internally within the kernel network driver to verify protocol stack integrity without hitting physical transceivers.',
    explanationsJson: {
      1: 'Loopback packets never egress the physical NIC interface.',
      2: 'Loopback traffic is strictly node-local and is never flooded as a switch broadcast.',
      3: 'Loopback has no interaction with external DNS servers.'
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Loopback Interface Mechanics (127.0.0.1)',
    points: 10
  },

  // -------------------------------------------------------------------------
  // Lesson 6: MAC Addresses & Physical Identity
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-level-0-mac-addresses-physical-identity',
    lessonSlug: 'level-0-mac-addresses-physical-identity',
    text: 'How is a 48-bit Ethernet MAC address structurally partitioned between vendor identification and device serializing?',
    options: [
      'The first 24 bits (3 bytes) represent the Organizationally Unique Identifier (OUI) assigned to the manufacturer, and the last 24 bits (3 bytes) represent the vendor-assigned Network Interface Controller serial number',
      'The first 16 bits represent the IP subnet, and the remaining 32 bits represent the TCP port number',
      'All 48 bits are completely random and change upon every computer restart',
      'The first 8 bits indicate whether the computer is a desktop or laptop, and the remaining 40 bits represent the user national ID'
    ],
    correctOption: 0,
    explanation: 'IEEE assigns the first 24 bits (3 octets) as the OUI identifying the hardware vendor (e.g. Cisco, Intel, Apple). The manufacturer assigns the remaining 24 bits as a unique NIC serial identifier.',
    explanationsJson: {
      1: 'MAC addresses contain no IP subnet or TCP port information; those exist at Layers 3 and 4.',
      2: 'MAC addresses are burned-in hardware addresses (BIA) and do not randomize on standard reboots unless software MAC randomization is enabled.',
      3: 'MAC addresses do not encode device form factors or human user IDs.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'MAC Address Architecture & OUI',
    points: 10
  },
  {
    quizId: 'quiz-level-0-mac-addresses-physical-identity',
    lessonSlug: 'level-0-mac-addresses-physical-identity',
    text: 'Which of the following represents the universal Layer 2 Broadcast MAC address used when sending a frame to all nodes on a local Ethernet segment?',
    options: [
      'FF:FF:FF:FF:FF:FF',
      '00:00:00:00:00:00',
      '255.255.255.255',
      '01:00:5E:00:00:01'
    ],
    correctOption: 0,
    explanation: 'FF:FF:FF:FF:FF:FF consists of 48 contiguous 1-bits in hexadecimal, denoting the Layer 2 Ethernet broadcast address that switches flood out all active ports in the VLAN.',
    explanationsJson: {
      1: '00:00:00:00:00:00 is an invalid/null unassigned hardware address.',
      2: '255.255.255.255 is the Layer 3 IPv4 limited broadcast address, not a Layer 2 MAC address.',
      3: '01:00:5E:xx:xx:xx is the IPv4 Multicast MAC address prefix range, not the broadcast address.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.RECALL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Ethernet Broadcast MAC',
    points: 10
  },
  {
    quizId: 'quiz-level-0-mac-addresses-physical-identity',
    lessonSlug: 'level-0-mac-addresses-physical-identity',
    text: 'A network packet travels from Host A, through Router R1 and Router R2, to Server B. How do the Source/Destination IP and MAC addresses behave across each hop?',
    options: [
      'The Source and Destination IP addresses remain constant end-to-end, while the Source and Destination MAC addresses are rewritten at every router hop',
      'The Source and Destination MAC addresses remain constant end-to-end, while the IP addresses change at every router hop',
      'Both the IP addresses and MAC addresses remain completely unchanged across the entire path',
      'Both the IP addresses and MAC addresses are scrambled randomly at each hop'
    ],
    correctOption: 0,
    explanation: 'IP addresses provide end-to-end logical addressing and remain unchanged from source to destination (unless NAT is applied). MAC addresses provide hop-to-hop physical framing and are replaced at every Layer 3 router boundary.',
    explanationsJson: {
      1: 'MAC addresses cannot cross Layer 3 router interfaces; routers strip the L2 header and create a new frame.',
      2: 'If MAC addresses did not change, the frame could not be addressed to the next router physical interface.',
      3: 'Addressing is deterministic and governed by standard encapsulation rules, not random scrambling.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.EXPERT_REASONING,
    questionType: QuestionType.SCENARIO,
    concept: 'L2 MAC Rewrite vs L3 IP Preservation',
    points: 10
  },
  {
    quizId: 'quiz-level-0-mac-addresses-physical-identity',
    lessonSlug: 'level-0-mac-addresses-physical-identity',
    text: 'An administrator runs `ipconfig /all` on a Windows machine and reads: `Physical Address. . . . : 00-50-56-C0-00-08`. What does the first half (`00-50-56`) indicate to the engineer?',
    options: [
      'The OUI identifying VMware as the manufacturer of the virtual network adapter',
      'The internal IPv4 subnet mask converted to hexadecimal',
      'The TCP socket port allocated to the DNS resolver daemon',
      'The serial number of the motherboard chassis'
    ],
    correctOption: 0,
    explanation: 'The first 3 bytes (00-50-56) represent the IEEE registered OUI belonging to VMware, proving the network interface is a VMware virtual adapter.',
    explanationsJson: {
      1: 'Subnet masks are 32-bit IPv4 structures (e.g. 255.255.255.0), not the first 24 bits of a MAC address.',
      2: 'TCP socket ports are 16-bit transport layer numbers, unrelated to MAC OUIs.',
      3: 'The OUI identifies the NIC manufacturer (VMware), not the physical motherboard serial number.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.COMMAND_INTERPRETATION,
    concept: 'MAC OUI Interpretation',
    points: 10
  },

  // -------------------------------------------------------------------------
  // Lesson 7: Network Ports & Socket Boundaries
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-level-0-network-ports-socket-boundaries',
    lessonSlug: 'level-0-network-ports-socket-boundaries',
    text: 'In Transport Layer networking, what constitutes a network "Socket"?',
    options: [
      'The unique combination of an IP address and a Port number (e.g. 192.168.1.10:443)',
      'The physical plastic RJ-45 modular jack mounted on the office wall',
      'The electrical copper connector inside a power strip',
      'The memory cache slot on a motherboard holding a CPU chip'
    ],
    correctOption: 0,
    explanation: 'A network socket is defined in software as the endpoint of a bidirectional communication flow, uniquely identified by the combination of an IP address (host identity) and a Port number (application process identity).',
    explanationsJson: {
      1: 'An RJ-45 wall jack is a physical Layer 1 connector, not a logical transport layer socket.',
      2: 'A power outlet is electrical utility infrastructure.',
      3: 'A CPU socket is a physical motherboard processor receptacle.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Socket Definition',
    points: 10
  },
  {
    quizId: 'quiz-level-0-network-ports-socket-boundaries',
    lessonSlug: 'level-0-network-ports-socket-boundaries',
    text: 'What port range is officially designated by IANA as the "Well-Known Ports" reserved for standardized system server daemons?',
    options: [
      'Ports 0 to 1023',
      'Ports 1024 to 49151',
      'Ports 49152 to 65535',
      'Ports 65536 to 99999'
    ],
    correctOption: 0,
    explanation: 'IANA reserves ports 0-1023 as Well-Known (System) Ports for standard services (HTTP 80, HTTPS 443, SSH 22, DNS 53). Ports 1024-49151 are Registered, and 49152-65535 are Dynamic/Ephemeral.',
    explanationsJson: {
      1: 'Ports 1024 to 49151 are Registered Ports for specific vendor applications.',
      2: 'Ports 49152 to 65535 are Dynamic/Private/Ephemeral ports used as client source ports.',
      3: '16-bit port numbers maximum value is 65535 (2^16 - 1); ports above 65535 do not exist in TCP/UDP.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.RECALL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'IANA Port Number Ranges',
    points: 10
  },
  {
    quizId: 'quiz-level-0-network-ports-socket-boundaries',
    lessonSlug: 'level-0-network-ports-socket-boundaries',
    text: 'How can a single web server with a single physical NIC and single IP address (`203.0.113.10`) concurrently host both a web server (HTTPS) and an SSH remote administration server without data collision?',
    options: [
      'The Transport Layer multiplexes traffic using distinct port numbers (port 443 for HTTPS, port 22 for SSH) to direct incoming packets to the correct application process',
      'The server alternates between HTTPS and SSH every 5 seconds by turning off the NIC',
      'The server uses two different colors of Ethernet cables inside the same sheath',
      'The server converts SSH traffic into physical audio vibrations'
    ],
    correctOption: 0,
    explanation: 'Transport layer port numbers provide multiplexing/demultiplexing. The operating system kernel inspects the destination port in the TCP header and delivers port 443 packets to the web server process and port 22 packets to the SSH daemon process.',
    explanationsJson: {
      1: 'Servers handle multiple services simultaneously in parallel; they do not alternate by disabling the NIC.',
      2: 'Cable coloring is cosmetic; multiple logical ports traverse the same physical medium concurrently.',
      3: 'Audio vibrations are not used for transport layer demultiplexing.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.SCENARIO,
    concept: 'Port Multiplexing',
    points: 10
  },
  {
    quizId: 'quiz-level-0-network-ports-socket-boundaries',
    lessonSlug: 'level-0-network-ports-socket-boundaries',
    text: 'An administrator runs `netstat -ano` on a server and notices a listening socket on `0.0.0.0:3389`. What does this socket state represent?',
    options: [
      'The Remote Desktop Protocol (RDP) service is listening for incoming connection requests on port 3389 across all available local IPv4 network interfaces',
      'The server is currently sending an email to a remote host on port 3389',
      'Port 3389 has been permanently blocked by an external hardware firewall',
      'The network cable is disconnected and the NIC is in sleep mode'
    ],
    correctOption: 0,
    explanation: '`0.0.0.0` in a listening socket context represents `INADDR_ANY` (all local IPv4 interfaces). Port 3389 is the standard IANA port for Microsoft Remote Desktop Protocol (RDP).',
    explanationsJson: {
      1: 'Outbound email utilizes SMTP port 25 or submission port 587, not listening on RDP 3389.',
      2: 'Netstat inspects local OS listening state; it does not indicate external firewall drops.',
      3: 'A listening socket exists in the OS network stack regardless of physical link state.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.COMMAND_INTERPRETATION,
    concept: 'Netstat Socket State Interpretation',
    points: 10
  },

  // -------------------------------------------------------------------------
  // Lesson 8: Network Packets & Data Framing
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-level-0-network-packets-data-framing',
    lessonSlug: 'level-0-network-packets-data-framing',
    text: 'Why must large application data streams (such as a 50 MegaByte video file) be divided into smaller Transport Segments rather than being transmitted as a single monolithic block across the network?',
    options: [
      'To prevent a single transmission error from requiring the retransmission of the entire 50 MB file, prevent network link monopoly, and conform to the physical link Maximum Transmission Unit (MTU)',
      'Because physical copper cables physically melt if a single packet contains more than 1 Kilobyte of data',
      'Because the Internet only supports ASCII text characters and cannot transmit binary video files',
      'Because routers require every byte of data to be assigned its own individual MAC address'
    ],
    correctOption: 0,
    explanation: 'Segmenting data streams into manageable chunks (MSS) ensures fair queue sharing among competing flows, bounds serialization latency, complies with physical link MTU limits (typically 1500 bytes), and ensures that if a bit error occurs in transit, only that single 1460-byte segment needs retransmission.',
    explanationsJson: {
      1: 'Packet size has no effect on copper cable thermal temperature.',
      2: 'The Internet routes arbitrary binary payloads across all telecommunication layers.',
      3: 'MAC addresses identify hardware network interfaces, not individual data payload bytes.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Transport Layer Segmentation Purpose',
    points: 10
  },
  {
    quizId: 'quiz-level-0-network-packets-data-framing',
    lessonSlug: 'level-0-network-packets-data-framing',
    text: 'On a standard Ethernet link with an MTU of 1500 bytes, what is the maximum TCP payload capacity (Maximum Segment Size - MSS) for standard IPv4 traffic, and what mathematical formula defines it?',
    options: [
      'MSS = 1460 Bytes (Formula: MSS = MTU (1500) - IPv4 Header (20) - TCP Header (20))',
      'MSS = 1500 Bytes (Formula: MSS = MTU)',
      'MSS = 1480 Bytes (Formula: MSS = MTU - IPv4 Header (20))',
      'MSS = 64 Bytes (Formula: Minimum Frame Size)'
    ],
    correctOption: 0,
    explanation: 'Maximum Segment Size (MSS) is the largest pure application data payload TCP can put into a single segment. Under standard IPv4 (20-byte IP header + 20-byte TCP header = 40 bytes overhead): MSS = 1500 - 40 = 1460 bytes.',
    explanationsJson: {
      1: '1500 bytes is the total Layer 3 MTU, including the 20-byte IP and 20-byte TCP headers.',
      2: '1480 bytes subtracts only the IP header, neglecting the 20-byte Layer 4 TCP header.',
      3: '64 bytes is the minimum Layer 2 Ethernet frame size.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'MSS vs MTU Calculation',
    points: 10
  },
  {
    quizId: 'quiz-level-0-network-packets-data-framing',
    lessonSlug: 'level-0-network-packets-data-framing',
    text: 'How does the receiving host TCP transport stack reconstruct an original continuous file from hundreds of individual segments that arrive out-of-order over an IP network?',
    options: [
      'The receiver buffers incoming segments and reassembles them in exact sequence using the 32-bit TCP Sequence Numbers in each segment header',
      'The receiver discards all out-of-order packets and requests the user to reboot the operating system',
      'The receiver changes its IP address to match the packet arrival order',
      'The receiver sends an email to the Internet Service Provider to rearrange the packets'
    ],
    correctOption: 0,
    explanation: 'TCP tracks every single byte transmitted using a 32-bit Sequence Number. The receiving host stores incoming segments in a reassembly buffer, arranges them by their sequence numbers, and passes the reconstructed stream to the application.',
    explanationsJson: {
      1: 'TCP does not require rebooting; it buffers out-of-order segments and uses selective/cumulative ACKs.',
      2: 'IP addresses are logical host endpoints and do not change based on packet arrival sequence.',
      3: 'Packet reassembly is performed in real-time by the host OS kernel network stack.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Transport Stream Reassembly & Sequence Numbers',
    points: 10
  },
  {
    quizId: 'quiz-level-0-network-packets-data-framing',
    lessonSlug: 'level-0-network-packets-data-framing',
    text: 'How does Path MTU Discovery (PMTUD, RFC 1191) enable a sending host to automatically adapt to an intermediate link with a smaller MTU (such as a 1400-byte VPN tunnel) without causing IP fragmentation?',
    options: [
      'The sender sets the Don’t Fragment (DF = 1) bit; when a packet exceeds the tunnel MTU, the router drops it and returns an ICMP "Fragmentation Needed" message with the next-hop MTU, prompting the sender to lower its MSS',
      'The sender sends a probe packet that physically expands the router interface buffers',
      'The sender automatically converts all TCP packets into UDP datagrams',
      'The sender encrypts the packet twice so the router cannot measure its size'
    ],
    correctOption: 0,
    explanation: 'PMTUD sets the IPv4 DF bit (Don\'t Fragment). When an intermediate router cannot forward the 1500-byte packet across a 1400-byte link, it drops the packet and transmits an ICMP Type 3 Code 4 message containing the next-hop MTU (1400). The sender receives this and lowers its TCP MSS to 1360 bytes.',
    explanationsJson: {
      1: 'Software probe packets cannot physically alter hardware router interfaces.',
      2: 'PMTUD adjusts TCP segment sizing; it does not switch transport protocols to UDP.',
      3: 'Encryption increases header overhead and does not bypass MTU limits.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Path MTU Discovery (PMTUD) Mechanics',
    points: 10
  },

  // -------------------------------------------------------------------------
  // Lesson 9: Network Protocols & Standards
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-level-0-network-protocols-standards',
    lessonSlug: 'level-0-network-protocols-standards',
    text: 'What is the primary role of international standards bodies such as the IETF (Internet Engineering Task Force) and IEEE in networking?',
    options: [
      'Publishing open RFC specifications and IEEE standards ensuring interoperability between different hardware vendors and software operating systems',
      'Manufacturing all network routers and switches sold worldwide in a single centralized factory',
      'Charging subscription fees for every data packet transmitted over public fiber optic lines',
      'Manually approving every individual website domain name before it can launch'
    ],
    correctOption: 0,
    explanation: 'Standards bodies create vendor-neutral specifications (such as IETF RFCs for IP/TCP/DNS and IEEE 802.3/802.11 for Ethernet/Wi-Fi) so equipment from Cisco, Juniper, Apple, Microsoft, and Linux interoperate seamlessly.',
    explanationsJson: {
      1: 'Hardware manufacturing is performed by thousands of competitive commercial vendors, not standards bodies.',
      2: 'IETF/IEEE do not levy packet tariffs; Internet protocols are open and non-proprietary.',
      3: 'Domain registration is managed through ICANN and registrars, not IETF protocol engineering workgroups.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Role of Networking Standards',
    points: 10
  },
  {
    quizId: 'quiz-level-0-network-protocols-standards',
    lessonSlug: 'level-0-network-protocols-standards',
    text: 'Which standard document format is published by the IETF to formally define core Internet protocols such as IPv4 (RFC 791), TCP (RFC 793), and HTTP/1.1 (RFC 2616)?',
    options: [
      'RFC (Request for Comments)',
      'ISO 9001 Quality Certificate',
      'IEEE 802.11ax Wireless Standard',
      'ANSI C Source Code Repository'
    ],
    correctOption: 0,
    explanation: 'IETF standards and protocol specifications are published as RFCs (Request for Comments), establishing the definitive architectural documentation for Internet technologies.',
    explanationsJson: {
      1: 'ISO 9001 is a generic corporate quality management standard, not an Internet protocol specification.',
      2: 'IEEE 802.11ax is an IEEE physical/link layer wireless specification, not an IETF document format.',
      3: 'ANSI C is a programming language specification, not a network protocol document series.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.RECALL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'IETF RFC Standards',
    points: 10
  },
  {
    quizId: 'quiz-level-0-network-protocols-standards',
    lessonSlug: 'level-0-network-protocols-standards',
    text: 'A multi-vendor enterprise purchases core switches from Vendor X and access point hardware from Vendor Y. Why are they able to pass 802.1Q VLAN tagged frames between devices without software incompatibility?',
    options: [
      'Both vendors adhere strictly to the IEEE 802.1Q open industry standard for VLAN tagging',
      'Vendor X secretly manufactures all of Vendor Y internal components',
      'The Ethernet cables convert proprietary vendor headers into universal electrical voltages',
      'The switches ignore all VLAN tags and broadcast all frames everywhere'
    ],
    correctOption: 0,
    explanation: 'Because IEEE 802.1Q is an open standard defining exact 4-byte VLAN tag placement (EtherType 0x8100, PRI, DEI, VLAN ID), any compliant device can parse and forward frames from any other compliant manufacturer.',
    explanationsJson: {
      1: 'Vendors are independent commercial competitors operating under common open specifications.',
      2: 'Passive copper/fiber cables transmit physical signals; they have no logic to translate proprietary headers.',
      3: 'Switches do not ignore 802.1Q tags; they inspect the 12-bit VLAN ID to isolate broadcast domains.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.SCENARIO,
    concept: 'Interoperability Standards',
    points: 10
  },
  {
    quizId: 'quiz-level-0-network-protocols-standards',
    lessonSlug: 'level-0-network-protocols-standards',
    text: 'A proprietary legacy routing protocol (Cisco IGRP) fails to communicate with a newly installed open-standards Juniper router. What is the standard industry remediation to establish dynamic routing between these two vendors?',
    options: [
      'Migrate the dynamic routing protocol on both routers to an open standard protocol such as OSPF (RFC 2328)',
      'Increase the physical clock speed of the serial interface cables',
      'Change the subnet mask on the Juniper router to 255.255.255.255',
      'Disable IP routing on both routers and rely solely on NetBIOS broadcasts'
    ],
    correctOption: 0,
    explanation: 'Proprietary protocols prevent multi-vendor interoperability. Migrating to open standards like OSPF (Open Shortest Path First) allows routers from different vendors to exchange link-state routing updates seamlessly.',
    explanationsJson: {
      1: 'Clock rate adjustments do not resolve protocol incompatibility.',
      2: 'Setting a /32 host mask will break subnet routing, not enable IGRP parsing on a Juniper device.',
      3: 'Disabling IP routing destroys layer 3 packet forwarding capabilities.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
    questionType: QuestionType.TROUBLESHOOTING,
    concept: 'Open Standards Migration',
    points: 10
  },

  // -------------------------------------------------------------------------
  // Lesson 10: DNS: The Phonebook of the Internet
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-level-0-dns-internet-phonebook',
    lessonSlug: 'level-0-dns-internet-phonebook',
    text: 'What fundamental service does the Domain Name System (DNS) provide on an IP network?',
    options: [
      'Resolving human-friendly domain names (e.g. netvision.edu) into machine-routable IP addresses (e.g. 198.51.100.25)',
      'Assigning dynamic physical MAC addresses to client network interface cards',
      'Encrypting all hard drive storage partitions using AES-256 bit keys',
      'Regulating the flow of alternating electrical current through wall power sockets'
    ],
    correctOption: 0,
    explanation: 'DNS acts as the distributed directory service of the Internet, translating human-memorizable Fully Qualified Domain Names (FQDNs) into numerical IPv4/IPv6 addresses required by the network layer.',
    explanationsJson: {
      1: 'Assigning dynamic IP parameters is done by DHCP; MAC addresses are burned-in hardware addresses.',
      2: 'Storage encryption is an OS/filesystem function (e.g. BitLocker/LUKS), not a DNS service.',
      3: 'Power regulation is electrical engineering, unrelated to DNS name resolution.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'DNS Purpose & Resolution',
    points: 10
  },
  {
    quizId: 'quiz-level-0-dns-internet-phonebook',
    lessonSlug: 'level-0-dns-internet-phonebook',
    text: 'Which DNS Resource Record type is specifically used to map a domain hostname directly to an IPv4 address?',
    options: [
      'A Record',
      'AAAA Record',
      'MX Record',
      'CNAME Record'
    ],
    correctOption: 0,
    explanation: 'An "A" (Address) record maps an FQDN to a 32-bit IPv4 address. An "AAAA" record maps to a 128-bit IPv6 address, "MX" designates mail exchangers, and "CNAME" defines canonical domain aliases.',
    explanationsJson: {
      1: 'AAAA records map domain names to 128-bit IPv6 addresses.',
      2: 'MX (Mail Exchange) records specify incoming email servers for a domain.',
      3: 'CNAME (Canonical Name) records map an alias name to another canonical domain name, not directly to an IP.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.RECALL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'DNS Record Types',
    points: 10
  },
  {
    quizId: 'quiz-level-0-dns-internet-phonebook',
    lessonSlug: 'level-0-dns-internet-phonebook',
    text: 'What is the correct hierarchical order of DNS servers queried during a recursive resolution of `www.example.com` starting from a local resolver?',
    options: [
      'Local Recursive Resolver → Root Name Server (.) → Top-Level Domain (TLD) Server (.com) → Authoritative Name Server (example.com)',
      'Authoritative Name Server → Top-Level Domain Server → Root Name Server → Local Resolver',
      'Root Name Server → Local DHCP Server → Client Web Browser → Default Gateway',
      'Local Switch MAC Table → ARP Cache → Root Name Server → Host Operating System'
    ],
    correctOption: 0,
    explanation: 'When not cached, the recursive resolver queries: 1. Root servers (.) for the .com TLD server IP; 2. TLD server for example.com authoritative server IP; 3. Authoritative server for www.example.com A record.',
    explanationsJson: {
      1: 'This is the exact inverse of hierarchical DNS query order.',
      2: 'DHCP servers assign network settings; they do not act as intermediate stages between root and browser.',
      3: 'MAC tables and ARP are Layer 2 mechanisms, not hierarchical DNS name servers.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'DNS Hierarchical Resolution Hierarchy',
    points: 10
  },
  {
    quizId: 'quiz-level-0-dns-internet-phonebook',
    lessonSlug: 'level-0-dns-internet-phonebook',
    text: 'A user reports: "I can ping 8.8.8.8 successfully, but typing `https://www.google.com` into my browser returns `DNS_PROBE_FINISHED_NXDOMAIN`." What is the immediate diagnosis and troubleshooting step?',
    options: [
      'The client IP connectivity and default gateway routing are fully operational, but the configured DNS server IP is unreachable or misconfigured; check `ipconfig /all` and verify DNS server settings',
      'The client physical network interface card has physically burned out',
      'The Google web servers worldwide have been completely shut down',
      'The local Ethernet switch has blocked all ICMP ping packets'
    ],
    correctOption: 0,
    explanation: 'Pinging 8.8.8.8 proves physical link, IP addressing, default gateway routing, and NAT are working perfectly. Failure to resolve google.com confirms the issue is isolated to DNS resolution (e.g. invalid DNS server IP or DNS server failure).',
    explanationsJson: {
      1: 'If the NIC burned out, pinging 8.8.8.8 would fail immediately.',
      2: 'Google web infrastructure is active; NXDOMAIN indicates a local DNS resolution failure.',
      3: 'Pinging 8.8.8.8 succeeded, which proves ICMP was not blocked by the switch.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
    questionType: QuestionType.TROUBLESHOOTING,
    concept: 'DNS Failure vs IP Reachability Diagnosis',
    points: 10
  },

  // -------------------------------------------------------------------------
  // Lesson 11: DHCP: Automatic Network Configuration
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-level-0-dhcp-automatic-ip-allocation',
    lessonSlug: 'level-0-dhcp-automatic-ip-allocation',
    text: 'What are the 4 sequential steps of the DHCP dynamic address allocation process (the DORA state machine)?',
    options: [
      'Discover (Client broadcast) → Offer (Server unicast/broadcast) → Request (Client broadcast) → Acknowledge (Server unicast/broadcast)',
      'Dial → Open → Read → Accept',
      'Demand → Order → Reserve → Allocate',
      'Detect → Overwrite → Reclaim → Authenticate'
    ],
    correctOption: 0,
    explanation: 'DHCP operates via DORA: 1. DHCPDISCOVER (client broadcasts seeking a server); 2. DHCPOFFER (server reserves and offers an IP); 3. DHCPREQUEST (client broadcasts requesting the offered IP); 4. DHCPACK (server confirms lease).',
    explanationsJson: {
      1: 'Dial/Open/Read/Accept are generic software terms, not DHCP protocol messages.',
      2: 'Demand/Order/Reserve/Allocate is not the RFC 2131 DHCP protocol sequence.',
      3: 'Detect/Overwrite/Reclaim/Authenticate is not the RFC 2131 standard.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.RECALL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'DHCP DORA Sequence',
    points: 10
  },
  {
    quizId: 'quiz-level-0-dhcp-automatic-ip-allocation',
    lessonSlug: 'level-0-dhcp-automatic-ip-allocation',
    text: 'What critical network configuration parameters does a standard DHCP server provision to a client in addition to its assigned IPv4 address?',
    options: [
      'Subnet Mask (Option 1), Default Gateway Router IP (Option 3), and DNS Server IPs (Option 6)',
      'The client administrator password and BIOS firmware update',
      'The serial numbers of all hard drives installed in the office',
      'The physical street address of the building landlord'
    ],
    correctOption: 0,
    explanation: 'DHCP options dynamically configure the complete TCP/IP stack: Subnet Mask (Option 1), Default Gateway (Option 3), DNS Server IPs (Option 6), Lease Duration (Option 51), and Domain Name (Option 15).',
    explanationsJson: {
      1: 'DHCP provisions network parameters, not OS passwords or BIOS firmware.',
      2: 'Storage hardware serial numbers are internal hardware attributes, not DHCP network options.',
      3: 'Landlord physical address is not a networking configuration protocol field.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'DHCP Scope Options',
    points: 10
  },
  {
    quizId: 'quiz-level-0-dhcp-automatic-ip-allocation',
    lessonSlug: 'level-0-dhcp-automatic-ip-allocation',
    text: 'Which transport layer protocol and UDP port numbers are utilized by DHCP clients and servers during lease negotiation?',
    options: [
      'UDP Port 67 (DHCP Server listening) and UDP Port 68 (DHCP Client listening)',
      'TCP Port 80 (HTTP) and TCP Port 443 (HTTPS)',
      'TCP Port 22 (SSH) and UDP Port 53 (DNS)',
      'ICMP Type 8 and ICMP Type 0'
    ],
    correctOption: 0,
    explanation: 'DHCP uses UDP transport. The DHCP Server listens on UDP port 67 for incoming client broadcasts, and the DHCP Client listens on UDP port 68 for server offers and acknowledgments.',
    explanationsJson: {
      1: 'TCP 80/443 are web traffic ports, not DHCP.',
      2: 'TCP 22 is SSH and UDP 53 is DNS.',
      3: 'ICMP Type 8/0 are echo request/reply ping messages, not UDP transport ports.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.RECALL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'DHCP UDP Ports',
    points: 10
  },
  {
    quizId: 'quiz-level-0-dhcp-automatic-ip-allocation',
    lessonSlug: 'level-0-dhcp-automatic-ip-allocation',
    text: 'A Windows laptop is plugged into an Ethernet jack. The user cannot access any network resources. Running `ipconfig` reveals: `IPv4 Address: 169.254.45.120` with `Subnet Mask: 255.255.0.0`. What has occurred?',
    options: [
      'The client broadcasted DHCPDISCOVER messages but received no response from a DHCP server, causing Windows to assign an Automatic Private IP Addressing (APIPA) link-local address',
      'The client successfully leased a valid public IP address from the ISP',
      'The DNS server successfully resolved the client hostname into a class B private IP',
      'The network interface card has been permanently locked due to a virus'
    ],
    correctOption: 0,
    explanation: 'The `169.254.0.0/16` range is reserved for APIPA (Automatic Private IP Addressing). When a DHCP client fails to receive a DHCPOFFER after multiple retries, it assigns itself an APIPA address, allowing local link communication only.',
    explanationsJson: {
      1: '169.254.x.x is an APIPA link-local address, not a valid routable public ISP IP.',
      2: 'APIPA is self-assigned by the client OS when DHCP fails, not allocated by DNS.',
      3: 'An APIPA address indicates a DHCP reachability failure, not a hardware lock.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
    questionType: QuestionType.TROUBLESHOOTING,
    concept: 'APIPA Address Diagnosis',
    points: 10
  },

  // -------------------------------------------------------------------------
  // Lesson 12: Routers: Inter-Subnet Path Finders
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-level-0-routers-inter-subnet-pathfinders',
    lessonSlug: 'level-0-routers-inter-subnet-pathfinders',
    text: 'When a router receives an incoming IPv4 packet, which packet header field does it inspect to determine the outgoing interface and next-hop forwarding path?',
    options: [
      'Destination IPv4 Address',
      'Source MAC Address',
      'TCP Destination Port Number',
      'HTTP User-Agent Header String'
    ],
    correctOption: 0,
    explanation: 'Layer 3 routers inspect the Destination IP Address in the IPv4 header and perform a longest prefix match against their internal Routing Table to select the next-hop interface.',
    explanationsJson: {
      1: 'Source MAC address is used by Layer 2 switches to learn CAM table entries, not by routers to make L3 routing forwarding decisions.',
      2: 'TCP port numbers are Layer 4 fields used for application demultiplexing, not standard L3 packet routing.',
      3: 'HTTP User-Agent is an application layer header string.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Routing Table Lookup',
    points: 10
  },
  {
    quizId: 'quiz-level-0-routers-inter-subnet-pathfinders',
    lessonSlug: 'level-0-routers-inter-subnet-pathfinders',
    text: 'What is the purpose of a "Default Route" (`0.0.0.0/0` or `::/0`) in a routing table?',
    options: [
      'It acts as the gateway of last resort, matching all destination IP addresses that do not match any more specific route in the routing table',
      'It permanently disables all routing interfaces on the router',
      'It restricts the router to forwarding packets exclusively to local loopback 127.0.0.1',
      'It forces all incoming packets to be broadcast out every single switch port'
    ],
    correctOption: 0,
    explanation: 'A Default Route (0.0.0.0 with mask 0.0.0.0, or /0 prefix) has a prefix length of 0 bits, matching any IPv4 address when no more specific subnet route exists, directing outbound Internet traffic to the upstream provider.',
    explanationsJson: {
      1: 'A default route is an active forwarding rule; it does not disable interfaces.',
      2: 'Loopback 127.0.0.1 is local internal host testing, not the destination of a default route.',
      3: 'Routers never broadcast packets out all ports; only Layer 2 hubs/switches flood unknown frames.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Default Route 0.0.0.0/0',
    points: 10
  },
  {
    quizId: 'quiz-level-0-routers-inter-subnet-pathfinders',
    lessonSlug: 'level-0-routers-inter-subnet-pathfinders',
    text: 'A router receives a packet destined for `10.1.5.25`. The router table contains the following routes: \n1) `10.0.0.0/8` via Next-Hop A \n2) `10.1.0.0/16` via Next-Hop B \n3) `10.1.5.0/24` via Next-Hop C \n4) `0.0.0.0/0` via Next-Hop D. \nWhich next-hop will the router select?',
    options: [
      'Next-Hop C (`10.1.5.0/24`), because it represents the Longest Prefix Match (most specific 24-bit match)',
      'Next-Hop D (`0.0.0.0/0`), because default routes always take highest priority over specific routes',
      'Next-Hop A (`10.0.0.0/8`), because /8 contains the largest number of total IP addresses',
      'The router drops the packet because having multiple matching routes causes an unresolvable conflict'
    ],
    correctOption: 0,
    explanation: 'Routing decision logic mandates the Longest Prefix Match (LPM) rule: the route with the longest subnet mask (most matching prefix bits) is always chosen. `/24` (24 matching bits) beats `/16`, `/8`, and `/0`.',
    explanationsJson: {
      1: 'Default routes (/0) have the lowest prefix length and are only evaluated when no other route matches.',
      2: 'Broad routes (/8) have lower specificity than granular routes (/24).',
      3: 'Routers handle overlapping prefixes deterministically via LPM; no conflict or drop occurs.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.SCENARIO,
    concept: 'Longest Prefix Match Rule',
    points: 10
  },
  {
    quizId: 'quiz-level-0-routers-inter-subnet-pathfinders',
    lessonSlug: 'level-0-routers-inter-subnet-pathfinders',
    text: 'A host with IP `192.168.1.10/24` has its Default Gateway accidentally configured as `192.168.2.1`. When the host attempts to connect to `8.8.8.8`, why does communication fail immediately?',
    options: [
      'The host cannot ARP for its default gateway because `192.168.2.1` is on a different logical subnet than `192.168.1.10/24` and cannot be reached locally',
      'The IP address 8.8.8.8 has been reserved for private LAN use only',
      'The host network card automatically disables its physical transmitter if gateway ends in `.1`',
      'Routers reject all traffic from hosts with an IP ending in `.10`'
    ],
    correctOption: 0,
    explanation: 'A host can only ARP for and communicate directly with devices on its own local subnet. Because 192.168.2.1 is outside 192.168.1.0/24, the host cannot resolve the gateway MAC address and cannot transmit outbound packets.',
    explanationsJson: {
      1: '8.8.8.8 is a public DNS IP, not private RFC 1918 space.',
      2: 'NIC transmitters operate based on physical signals, not gateway IP suffix values.',
      3: 'Routers do not discriminate against host IP addresses ending in .10.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
    questionType: QuestionType.TROUBLESHOOTING,
    concept: 'Default Gateway Subnet Mismatch',
    points: 10
  },

  // -------------------------------------------------------------------------
  // Lesson 13: Switches: Local LAN Frame Forwarders
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-level-0-switches-local-lan-forwarders',
    lessonSlug: 'level-0-switches-local-lan-forwarders',
    text: 'How does a Layer 2 switch populate its MAC Address Table (CAM Table)?',
    options: [
      'It inspects the Source MAC address of every incoming frame and records the port on which it arrived',
      'It queries the DNS server for the MAC address of all connected computers',
      'It inspects the Destination IP address in the Layer 3 header and runs Dijkstra algorithm',
      'It reads a static configuration text file stored on an external USB flash drive'
    ],
    correctOption: 0,
    explanation: 'Switches dynamically learn MAC addresses by inspecting the Source MAC address field in the Layer 2 header of incoming frames, associating that MAC with the physical ingress port.',
    explanationsJson: {
      1: 'DNS resolves hostnames to IP addresses; it has no role in switch CAM table learning.',
      2: 'Dijkstra SPF is used by Layer 3 link-state routing protocols (OSPF), not Layer 2 switch CAM tables.',
      3: 'Standard switches learn MAC tables dynamically in RAM hardware CAM tables.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Switch MAC Table Learning',
    points: 10
  },
  {
    quizId: 'quiz-level-0-switches-local-lan-forwarders',
    lessonSlug: 'level-0-switches-local-lan-forwarders',
    text: 'What action does a Layer 2 switch perform when it receives a unicast frame destined for a MAC address that is NOT currently listed in its MAC address table (an Unknown Unicast)?',
    options: [
      'It floods the frame out all active ports in the same VLAN except the port on which it was received',
      'It immediately drops the frame and generates an ICMP error packet',
      'It forwards the frame to the Default Gateway router for disposal',
      'It permanently shuts down the incoming switch port'
    ],
    correctOption: 0,
    explanation: 'When a switch does not know which port owns the destination MAC address, it performs "Unknown Unicast Flooding", broadcasting the frame to all ports in that VLAN (except the ingress port) so the target can receive and answer it.',
    explanationsJson: {
      1: 'Switches do not drop unknown unicast frames; they flood them to discover the target.',
      2: 'Layer 2 switches do not route unknown frames to default gateways.',
      3: 'Ports are not shut down for unknown unicasts (that only occurs under port security violation modes).'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Unknown Unicast Flooding',
    points: 10
  },
  {
    quizId: 'quiz-level-0-switches-local-lan-forwarders',
    lessonSlug: 'level-0-switches-local-lan-forwarders',
    text: 'What is the primary operational advantage of full-duplex Ethernet switching over legacy half-duplex shared Ethernet?',
    options: [
      'Nodes can transmit and receive data simultaneously without collisions, effectively doubling bandwidth and eliminating CSMA/CD backoff delays',
      'Full-duplex eliminates the need for IP addressing and subnet masks',
      'Full-duplex allows Ethernet cables to reach up to 10,000 miles without repeaters',
      'Full-duplex automatically encrypts all traffic with quantum cryptography'
    ],
    correctOption: 0,
    explanation: 'In full-duplex mode on dedicated switch ports, separate transmit (Tx) and receive (Rx) wire pairs/channels are used simultaneously, eliminating collisions and disabling CSMA/CD collision detection mechanisms.',
    explanationsJson: {
      1: 'IP addressing is a Layer 3 requirement unaffected by Layer 2 full-duplex operation.',
      2: 'Copper Ethernet maximum distance remains 100 meters due to physical signal attenuation.',
      3: 'Full-duplex is a Layer 2 transmission mode, not quantum encryption.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Full-Duplex Switching Advantages',
    points: 10
  },
  {
    quizId: 'quiz-level-0-switches-local-lan-forwarders',
    lessonSlug: 'level-0-switches-local-lan-forwarders',
    text: 'A network loop is accidentally created by connecting two ports of the same unmanaged switch together with a patch cable. The switch activity LEDs rapidly flash solid green and the entire LAN stops functioning. What phenomenon has occurred?',
    options: [
      'A Layer 2 Broadcast Storm caused by infinite frame multiplication and CAM table thrashing',
      'The switch CPU has run out of IP addresses to allocate to connected hosts',
      'The Ethernet cable has accumulated static electricity and discharged into the ground wire',
      'The router has reversed the direction of all default static routes'
    ],
    correctOption: 0,
    explanation: 'Because Layer 2 Ethernet frames lack a Time to Live (TTL) field, broadcast and multicast frames circulate infinitely in a switching loop, endlessly multiplying into a catastrophic Broadcast Storm that saturates all bandwidth and crashes switch CPUs.',
    explanationsJson: {
      1: 'Unmanaged Layer 2 switches do not allocate IP addresses (DHCP is Layer 7/UDP).',
      2: 'Broadcast storms are caused by frame circulation loops, not static electricity build-up.',
      3: 'Loops are Layer 2 phenomena; router static routes are not dynamically reversed.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
    questionType: QuestionType.TROUBLESHOOTING,
    concept: 'Broadcast Storm & Switching Loops',
    points: 10
  },

  // -------------------------------------------------------------------------
  // Lesson 14: Basic Network Troubleshooting Workflow
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-level-0-basic-network-troubleshooting-workflow',
    lessonSlug: 'level-0-basic-network-troubleshooting-workflow',
    text: 'What is the correct sequence of steps in the systematic "Bottom-Up" troubleshooting methodology based on the OSI Model?',
    options: [
      'Verify Physical Layer (cables/link lights) → Data Link (link status/MAC) → Network (IP/ping gateway) → Transport (ports/firewall) → Application (software/DNS)',
      'Reinstall Application software → Replace CPU → Replace Wall Jacks → Ping 127.0.0.1',
      'Reboot all routers on the Internet → Change IP address → Inspect physical cable',
      'Verify Application layer first → Check Physical layer last'
    ],
    correctOption: 0,
    explanation: 'Bottom-up troubleshooting starts at Layer 1 (checking cables, LEDs, link pulse), progresses to Layer 2 (MAC tables/VLANs), Layer 3 (IP/ping), Layer 4 (ports), and finally Layers 5-7 (applications).',
    explanationsJson: {
      1: 'Replacing hardware before diagnosing the physical and network stack is inefficient and disruptive.',
      2: 'Rebooting global routers is impossible and illogical for a local connectivity issue.',
      3: 'Checking application first is the "Top-Down" methodology, not "Bottom-Up".'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Systematic Bottom-Up Troubleshooting',
    points: 10
  },
  {
    quizId: 'quiz-level-0-basic-network-troubleshooting-workflow',
    lessonSlug: 'level-0-basic-network-troubleshooting-workflow',
    text: 'When troubleshooting host IP stack functionality, what is the significance of issuing the command `ping 127.0.0.1` (or `ping ::1`)?',
    options: [
      'It tests the internal TCP/IP protocol software stack implementation on the local operating system without transmitting data over the physical network',
      'It tests physical fiber optic transmission to the Internet Service Provider central office',
      'It forces the Default Gateway router to reboot and reload its configuration',
      'It measures the wireless signal strength between the laptop and the closest cell tower'
    ],
    correctOption: 0,
    explanation: '`127.0.0.1` is the IPv4 loopback address. Pinging it verifies that the local operating system network driver, TCP/IP stack, and kernel sockets are functioning correctly without sending signals onto the physical wire.',
    explanationsJson: {
      1: 'Loopback packets never leave host memory buffers; they do not travel to the ISP.',
      2: 'Pinging loopback does not affect or reboot external gateway routers.',
      3: 'Loopback testing is internal software validation, unrelated to cellular wireless signal.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.COMMAND_INTERPRETATION,
    concept: 'Loopback Testing Mechanics',
    points: 10
  },
  {
    quizId: 'quiz-level-0-basic-network-troubleshooting-workflow',
    lessonSlug: 'level-0-basic-network-troubleshooting-workflow',
    text: 'An engineer executes `traceroute 93.184.216.34` (or `tracert`) from a corporate workstation. How does traceroute discover the IP addresses of intermediate router hops along the path?',
    options: [
      'By sending packets with incrementally increasing Time-to-Live (TTL) values starting at 1, capturing the ICMP "Time-to-Live Exceeded in Transit" error messages returned by each router hop',
      'By reading a hidden text file stored on the root DNS server containing all global router IPs',
      'By commanding all routers on Earth to broadcast their serial numbers across UDP port 80',
      'By opening an SSH terminal session automatically to every router on the path'
    ],
    correctOption: 0,
    explanation: 'Traceroute sends packets with TTL=1 (causing Hop 1 to return ICMP Type 11 TTL Exceeded), then TTL=2 (Hop 2 returns ICMP Type 11), TTL=3, etc., mapping each sequential Layer 3 router interface until reaching the destination.',
    explanationsJson: {
      1: 'There is no global central text file of router paths; routes are determined dynamically hop-by-hop.',
      2: 'Routers do not broadcast serial numbers over web ports for traceroute.',
      3: 'Traceroute relies on ICMP TTL expiry messages, not automated SSH sessions.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Traceroute TTL Mechanics',
    points: 10
  },
  {
    quizId: 'quiz-level-0-basic-network-troubleshooting-workflow',
    lessonSlug: 'level-0-basic-network-troubleshooting-workflow',
    text: 'A user cannot connect to an internal server at `10.0.5.20`. The technician performs the following diagnostic tests in order:\n1. `ping 127.0.0.1` -> SUCCESS\n2. `ping 192.168.1.1` (Default Gateway) -> SUCCESS\n3. `ping 10.0.5.1` (Remote Subnet Gateway) -> SUCCESS\n4. `ping 10.0.5.20` (Target Server) -> "Request Timed Out"\nWhat is the most likely location of the fault?',
    options: [
      'The fault is isolated to the target server `10.0.5.20` itself (host powered off, local host firewall dropping ICMP, or server IP misconfigured) or the access switch port connecting it',
      'The local workstation physical network card is completely defective',
      'The local default gateway router `192.168.1.1` has failed completely',
      'The entire core WAN routing infrastructure between subnets is down'
    ],
    correctOption: 0,
    explanation: 'Because the technician successfully pinged loopback, local gateway, and the remote subnet gateway, all local and intermediate WAN routing hops are 100% operational. The failure only occurs on the last hop to 10.0.5.20, isolating the fault to that specific endpoint or its local switch port.',
    explanationsJson: {
      1: 'If the local NIC were defective, tests 1, 2, and 3 would have failed.',
      2: 'The local gateway responded with 100% success in test 2.',
      3: 'The remote subnet gateway 10.0.5.1 responded successfully, proving core WAN routing is working.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
    questionType: QuestionType.TROUBLESHOOTING,
    concept: 'Isolating Network Fault Boundaries',
    points: 10
  },

  // =========================================================================
  // 2. 21 CORE CURRICULUM TOPICS (21 Quizzes x 4 Questions = 84 Questions)
  // =========================================================================

  // -------------------------------------------------------------------------
  // Topic 1: Network Performance Metrics (net-102-network-performance)
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-net-102-network-performance',
    lessonSlug: 'net-102-network-performance',
    text: 'What is the operational distinction between Throughput and Goodput in network performance analysis?',
    options: [
      'Throughput is the actual rate of total data transmitted (including protocol headers and retransmissions), whereas Goodput is the net rate of usable application payload delivered to the end user',
      'Throughput applies only to wireless networks while Goodput applies only to optical fiber',
      'Throughput is measured in Bytes while Goodput is measured in volts',
      'There is no operational difference between Throughput and Goodput'
    ],
    correctOption: 0,
    explanation: 'Throughput measures all raw bits delivered across the physical link. Goodput measures only the net application payload delivered after stripping protocol headers and discarding retransmissions.',
    explanationsJson: {
      1: 'Both metrics apply universally to all network media.',
      2: 'Both are data rate metrics measured in bits per second.',
      3: 'They measure fundamentally different data rates.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Throughput vs Goodput',
    points: 10
  },
  {
    quizId: 'quiz-net-102-network-performance',
    lessonSlug: 'net-102-network-performance',
    text: 'What is Transmission Delay (D_trans) in network latency decomposition?',
    options: [
      'The time required to push (serialize) all bits of a packet onto the physical communication link',
      'The time required for a physical signal to travel across the distance of a cable',
      'The time a router takes to inspect a packet header and lookup a route',
      'The variation in arrival time between consecutive packets'
    ],
    correctOption: 0,
    explanation: 'Transmission delay (D_trans = L / R) is the time needed to serialize all bits of a packet of length L onto a link of rate R.',
    explanationsJson: {
      1: 'Signal traversal time across distance is Propagation Delay (D_prop).',
      2: 'Router header inspection time is Processing Delay (D_proc).',
      3: 'Variation in arrival time is Jitter.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.RECALL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Transmission Delay Definition',
    points: 10
  },
  {
    quizId: 'quiz-net-102-network-performance',
    lessonSlug: 'net-102-network-performance',
    text: 'How is Transmission Delay (D_trans) calculated for a packet of length L bits on a link of rate R bits per second?',
    options: [
      'D_trans = L / R',
      'D_trans = L * R',
      'D_trans = Distance / Speed of Light',
      'D_trans = R / L'
    ],
    correctOption: 0,
    explanation: 'Transmission Delay is calculated by dividing packet size L in bits by link rate R in bits per second (D_trans = L / R).',
    explanationsJson: {
      1: 'Multiplying length by rate yields incorrect units.',
      2: 'Distance / Speed of Light is the formula for Propagation Delay.',
      3: 'Rate divided by length is the inverse frequency, not delay.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Transmission Delay Formula',
    points: 10
  },
  {
    quizId: 'quiz-net-102-network-performance',
    lessonSlug: 'net-102-network-performance',
    text: 'What performance metric measures the variation or inconsistency in packet delay over time?',
    options: [
      'Jitter',
      'Goodput',
      'Bandwidth',
      'Propagation Delay'
    ],
    correctOption: 0,
    explanation: 'Jitter is the measure of delay variance over time. High jitter causes packet arrival irregularities, severely disrupting real-time VoIP and video calls.',
    explanationsJson: {
      1: 'Goodput measures net application payload delivery rate.',
      2: 'Bandwidth measures maximum link capacity.',
      3: 'Propagation delay measures signal travel time over distance.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.RECALL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Jitter Definition',
    points: 10
  },
  {
    quizId: 'quiz-net-102-network-performance',
    lessonSlug: 'net-102-network-performance',
    text: 'What is the primary cause of Packet Loss in a congested network router?',
    options: [
      'Router queue buffer overflow when incoming packet arrival rate exceeds outgoing link capacity',
      'Operating system kernel updating firewall rules',
      'Web browser downloading a large static image file',
      'High speed of light in fiber optic cables'
    ],
    correctOption: 0,
    explanation: 'When network congestion occurs and router egress memory queues fill completely, newly arriving packets are dropped, resulting in packet loss.',
    explanationsJson: {
      1: 'Updating firewall rules does not cause buffer overflows.',
      2: 'Downloading files consumes bandwidth but only causes loss if buffers overflow.',
      3: 'Speed of light affects propagation delay, not packet loss.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Packet Loss Causes',
    points: 10
  },
  {
    quizId: 'quiz-net-102-network-performance',
    lessonSlug: 'net-102-network-performance',
    text: 'A user experiences choppy audio and dropped words during a live video call. Which pair of network performance metrics is most likely degraded?',
    options: [
      'High Latency and High Jitter',
      'High Bandwidth and High Goodput',
      'Low Transmission Delay and High Goodput',
      'Low Propagation Delay and Zero Packet Loss'
    ],
    correctOption: 0,
    explanation: 'Real-time interactive audio and video applications are highly sensitive to high latency and high jitter (delay variation), causing choppy audio and stuttering.',
    explanationsJson: {
      1: 'High bandwidth and high goodput improve transfer rates, not degrade them.',
      2: 'Low transmission delay improves performance.',
      3: 'Low propagation delay and zero packet loss represent ideal network conditions.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Real-World Performance Scenario Reasoning',
    points: 10
  },

  // -------------------------------------------------------------------------
  // Topic 2: Physical Network Interfaces, Media & Transceivers (network-devices-overview)
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-network-devices-overview',
    lessonSlug: 'network-devices-overview',
    text: 'What is the practical maximum distance limit for standard copper twisted-pair Ethernet cables (such as Cat5e or Cat6)?',
    options: [
      '100 meters (about 328 feet)',
      '500 meters (about 1,640 feet)',
      '50 meters (about 164 feet)',
      '1,000 meters (1 kilometer)'
    ],
    correctOption: 0,
    explanation: 'Standard copper twisted-pair Ethernet cables (Cat5e, Cat6, Cat6a) have a practical maximum channel limit of 100 meters due to electrical signal attenuation.',
    explanationsJson: {
      1: '500 meters far exceeds copper limits and requires optical fiber.',
      2: 'While Cat6 has a 55m limit for 10 Gbps, standard 1 Gbps runs reach 100 meters.',
      3: '1,000 meters requires long-distance Single-Mode optical fiber.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.RECALL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Copper Cable Distance Limits',
    points: 10
  },
  {
    quizId: 'quiz-network-devices-overview',
    lessonSlug: 'network-devices-overview',
    text: 'When choosing between optical fiber types, which one is designed for much longer distances across campuses or between buildings?',
    options: [
      'Single-Mode Fiber (SMF)',
      'Multimode Fiber (MMF)',
      'Cat5e Copper Cable',
      'Coaxial Cable'
    ],
    correctOption: 0,
    explanation: 'Single-Mode Fiber (SMF) carries light along a single direct path, allowing it to span long distances between buildings or across cities.',
    explanationsJson: {
      1: 'Multimode Fiber (MMF) is designed for shorter runs within buildings or server rooms.',
      2: 'Cat5e is copper cabling limited to 100 meters.',
      3: 'Coaxial cable is copper cabling used primarily for legacy connections.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Single-Mode vs Multimode Fiber Purpose',
    points: 10
  },
  {
    quizId: 'quiz-network-devices-overview',
    lessonSlug: 'network-devices-overview',
    text: 'Why is optical fiber cable immune to electromagnetic interference (EMI) caused by power lines or heavy machinery?',
    options: [
      'Fiber transmits signals using pulses of light through glass rather than electrical current over copper wire',
      'Fiber cables are wrapped in thick lead shielding that absorbs all radio signals',
      'Fiber cables operate at zero electrical resistance',
      'Fiber switches automatically filter out electrical noise using software'
    ],
    correctOption: 0,
    explanation: 'Because optical fiber carries data as light through non-conductive glass strands, electromagnetic fields from power lines and motors cannot interfere with the signal.',
    explanationsJson: {
      1: 'Fiber jackets are standard plastic; immunity comes from light transmission in glass.',
      2: 'Fiber does not carry electrical current.',
      3: 'Immunity is a physical property of light in glass, not software filtering.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Fiber Immunity to Electrical Noise',
    points: 10
  },
  {
    quizId: 'quiz-network-devices-overview',
    lessonSlug: 'network-devices-overview',
    text: 'What is the primary benefit of a modular transceiver such as an SFP or SFP+ module in a network switch?',
    options: [
      'It allows a switch port to be adapted to different cable types (copper or fiber) and transmission speeds',
      'It provides battery backup power to the switch during electrical outages',
      'It converts AC wall power into DC power for the switch motherboard',
      'It speeds up internet connection speeds by compressing web pages'
    ],
    correctOption: 0,
    explanation: 'An SFP/SFP+ modular transceiver slots into a switch port cage, giving the flexibility to connect copper cables, multimode fiber, or single-mode fiber as needed.',
    explanationsJson: {
      1: 'Battery backup is provided by a UPS unit.',
      2: 'Power conversion is performed by the power supply unit (PSU).',
      3: 'Transceivers handle physical media conversion, not web compression.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Modular Transceiver Purpose',
    points: 10
  },
  {
    quizId: 'quiz-network-devices-overview',
    lessonSlug: 'network-devices-overview',
    text: 'What is the main advantage of Power over Ethernet (PoE) when connecting devices like Wi-Fi access points and IP cameras?',
    options: [
      'It delivers electrical power and network data over the same Ethernet cable, removing the need for separate electrical power outlets',
      'It doubles the maximum cable distance of copper cables to 200 meters',
      'It automatically converts copper signals into optical fiber light',
      'It encrypts all network data sent through the cable'
    ],
    correctOption: 0,
    explanation: 'Power over Ethernet (PoE) sends low-voltage DC power through the copper Ethernet cable alongside data, allowing devices to be installed in ceilings or outdoors without dedicated power outlets.',
    explanationsJson: {
      1: 'PoE does not change the 100-meter copper distance limit.',
      2: 'PoE delivers power over copper; it does not convert to fiber.',
      3: 'PoE provides electrical power, not data encryption.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Power over Ethernet Purpose',
    points: 10
  },
  {
    quizId: 'quiz-network-devices-overview',
    lessonSlug: 'network-devices-overview',
    text: 'A desktop computer is located 15 meters from an office network switch in a normal room. Which physical medium is the most practical choice?',
    options: [
      'Copper twisted-pair cabling (Cat5e or Cat6) with RJ-45 connectors',
      'Single-Mode optical fiber with long-haul transceivers',
      'Undersea submarine optical cable',
      'Shielded coaxial cable with BNC connectors'
    ],
    correctOption: 0,
    explanation: 'For short indoor desktop connections under 100 meters, copper twisted-pair (Cat5e or Cat6) with standard RJ-45 plugs is standard, inexpensive, and easy to install.',
    explanationsJson: {
      1: 'Single-mode fiber is unnecessary and expensive for a 15-meter office desk connection.',
      2: 'Submarine cables are for trans-oceanic backbones.',
      3: 'Coaxial BNC cabling is legacy and not used for modern desktop Ethernet.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Practical Media Selection',
    points: 10
  },

  // -------------------------------------------------------------------------
  // Topic 3: Network Topologies Overview
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-network-topologies-overview',
    lessonSlug: 'network-topologies-overview',
    text: 'Which physical network topology is ubiquitous in modern enterprise Ethernet LANs, where all endpoint workstations connect via dedicated point-to-point cables to a central switch?',
    options: [
      'Star Topology',
      'Ring Topology',
      'Bus Topology',
      'Linear Daisy-Chain Topology'
    ],
    correctOption: 0,
    explanation: 'Modern enterprise LANs use a physical Star topology. Each device has an independent cable run to a central switch (or hub). If an individual cable is severed, only that single node is affected.',
    explanationsJson: {
      1: 'Ring topologies (like Token Ring or FDDI) are legacy architectures superseded by switched Ethernet.',
      2: 'Bus topologies share a single trunk cable and are obsolete in modern LAN design.',
      3: 'Daisy-chain topologies introduce cascading single points of failure across every node.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.RECALL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Star Topology Dominance',
    points: 10
  },
  {
    quizId: 'quiz-network-topologies-overview',
    lessonSlug: 'network-topologies-overview',
    text: 'What is the primary difference between a Physical Topology and a Logical Topology?',
    options: [
      'Physical topology describes the actual physical layout and cabling of devices, while logical topology describes the path data takes through the network',
      'Physical topology is configured in software, while logical topology is constructed from concrete and steel',
      'Physical topology only applies to wireless networks, while logical topology only applies to fiber optics',
      'There is no difference; the two terms are exact synonyms'
    ],
    correctOption: 0,
    explanation: 'Physical topology refers to the tangible arrangement of cables, patch panels, and switch racks. Logical topology defines how frames/packets actually flow across the medium (e.g. physical star with logical bus in a hub).',
    explanationsJson: {
      1: 'Physical topology is the physical cabling; logical topology is the software/protocol path.',
      2: 'Physical topologies apply to all physical cabling and RF media.',
      3: 'They are fundamentally distinct concepts; a network can have a physical star layout with a logical bus or ring path.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Physical vs Logical Topology',
    points: 10
  },
  {
    quizId: 'quiz-network-topologies-overview',
    lessonSlug: 'network-topologies-overview',
    text: 'A company with 8 regional offices wants to interconnect all locations over WAN circuits. Full mesh is rejected due to cost. The architect proposes connecting each branch office to the central corporate headquarters only. What topology is this?',
    options: [
      'Hub-and-Spoke (Partial Mesh / Star WAN) Topology',
      'Dual Ring Token Ring Topology',
      'Linear Bus Topology',
      'Ad-hoc Peer-to-Peer Mesh'
    ],
    correctOption: 0,
    explanation: 'A Hub-and-Spoke (star) WAN topology connects all remote spoke offices directly to a central hub site (HQ), minimizing circuit costs to $N-1$ links while centralizing traffic control and internet breakout.',
    explanationsJson: {
      1: 'Dual Ring requires two continuous counter-rotating fiber loops connecting all sites sequentially.',
      2: 'Linear bus is a shared single-cable topology unsuitable for regional WANs.',
      3: 'Ad-hoc peer-to-peer lacks a centralized headquarters hub.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.SCENARIO,
    concept: 'Hub-and-Spoke WAN Design',
    points: 10
  },
  {
    quizId: 'quiz-network-topologies-overview',
    lessonSlug: 'network-topologies-overview',
    text: 'In a legacy physical Star network centered around a single unmanaged Ethernet hub, one workstation transmits a broadcast frame. Which nodes receive the frame?',
    options: [
      'All other workstations connected to the hub receive the frame because the hub operates as a logical bus repeating signals to all ports',
      'Only the central hub receives the frame and stores it in flash memory',
      'Only the single workstation with the lowest IP address receives the frame',
      'No devices receive the frame because hubs block broadcast traffic'
    ],
    correctOption: 0,
    explanation: 'A hub creates a physical star topology with a logical bus topology: any electrical signal received on one port is repeated out all other ports, delivering the broadcast to every connected workstation.',
    explanationsJson: {
      1: 'Hubs have no flash memory to store frames; they are Layer 1 physical signal repeaters.',
      2: 'Broadcasts are not filtered by IP address ranking in Layer 1 hubs.',
      3: 'Hubs cannot filter or block broadcasts; they repeat all signals indiscriminately.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
    questionType: QuestionType.TROUBLESHOOTING,
    concept: 'Hub Physical Star vs Logical Bus Behavior',
    points: 10
  },

  // -------------------------------------------------------------------------
  // Topic 4: The OSI 7-Layer Model
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-osi-model-7-layers',
    lessonSlug: 'osi-model-7-layers',
    text: 'Why was the 7-Layer OSI Reference Model created, and how does it help network engineers?',
    options: [
      'It provides a standard vendor-neutral framework dividing network communication into 7 distinct layers for learning and troubleshooting',
      'It is a physical piece of hardware installed in all network switches and routers',
      'It forces every computer in the world to run the exact same operating system',
      'It replaces the need for physical network cables and wireless antennas'
    ],
    correctOption: 0,
    explanation: 'The OSI model standardizes network communication into 7 functional layers, allowing different vendors to create compatible products and giving engineers a structured model for learning and troubleshooting.',
    explanationsJson: {
      1: 'OSI is a conceptual reference model, not a physical hardware device.',
      2: 'OSI allows heterogeneous systems running different OSs to interoperate.',
      3: 'Physical media (Layer 1) are still essential for transmission.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.RECALL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'OSI Model Purpose and Architecture',
    points: 10
  },
  {
    quizId: 'quiz-osi-model-7-layers',
    lessonSlug: 'osi-model-7-layers',
    text: 'What is the correct sequence of the 7 OSI layers from bottom to top (Layer 1 to Layer 7)?',
    options: [
      '1. Physical, 2. Data Link, 3. Network, 4. Transport, 5. Session, 6. Presentation, 7. Application',
      '1. Application, 2. Presentation, 3. Session, 4. Transport, 5. Network, 6. Data Link, 7. Physical',
      '1. Physical, 2. Network, 3. Data Link, 4. Transport, 5. Session, 6. Presentation, 7. Application',
      '1. Hardware, 2. Driver, 3. Internet, 4. Port, 5. App, 6. Screen, 7. User'
    ],
    correctOption: 0,
    explanation: 'From Layer 1 (bottom) to Layer 7 (top), the layers are: 1. Physical, 2. Data Link, 3. Network, 4. Transport, 5. Session, 6. Presentation, 7. Application (mnemonic: "Please Do Not Throw Sausage Pizza Away").',
    explanationsJson: {
      1: 'This order is reversed (Layer 7 down to Layer 1).',
      2: 'Data Link is Layer 2 and Network is Layer 3.',
      3: 'These are informal hardware/software terms, not official ISO/OSI model layers.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.RECALL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'OSI 7 Layers Sequence',
    points: 10
  },
  {
    quizId: 'quiz-osi-model-7-layers',
    lessonSlug: 'osi-model-7-layers',
    text: 'Which OSI layer is responsible for logical addressing (IP addresses) and determining the path to route packets across different networks?',
    options: [
      'Layer 3 — Network Layer',
      'Layer 1 — Physical Layer',
      'Layer 4 — Transport Layer',
      'Layer 7 — Application Layer'
    ],
    correctOption: 0,
    explanation: 'The Network Layer (Layer 3) handles logical addressing (IPv4 and IPv6) and path determination (routing) to deliver packets across interconnected networks.',
    explanationsJson: {
      1: 'Layer 1 (Physical) deals only with raw physical bits and cables.',
      2: 'Layer 4 (Transport) handles port numbers and end-to-end transport delivery.',
      3: 'Layer 7 (Application) interfaces with user software applications.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Network Layer Responsibilities',
    points: 10
  },
  {
    quizId: 'quiz-osi-model-7-layers',
    lessonSlug: 'osi-model-7-layers',
    text: 'Which OSI layer handles physical hardware addressing (MAC addresses) and packages data into frames to transmit between directly connected devices on a local network?',
    options: [
      'Layer 2 — Data Link Layer',
      'Layer 5 — Session Layer',
      'Layer 3 — Network Layer',
      'Layer 6 — Presentation Layer'
    ],
    correctOption: 0,
    explanation: 'The Data Link Layer (Layer 2) manages physical MAC addressing, framing, and local hop-to-hop transfer across local Ethernet switches or Wi-Fi links.',
    explanationsJson: {
      1: 'Layer 5 (Session) manages dialogs and sessions between applications.',
      2: 'Layer 3 (Network) handles logical IP addresses, not physical MAC addresses.',
      3: 'Layer 6 (Presentation) handles formatting and data encryption.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Data Link Layer Responsibilities',
    points: 10
  },
  {
    quizId: 'quiz-osi-model-7-layers',
    lessonSlug: 'osi-model-7-layers',
    text: 'What occurs during data encapsulation as an outgoing message travels down the OSI stack on a sending device?',
    options: [
      'Each layer adds its own specific protocol header information to the data as it moves downward toward Layer 1',
      'The sending device strips all headers to make the packet as small as possible',
      'The data is converted directly into a wireless radio wave at Layer 7',
      'The computer deletes the payload and sends only blank test signals'
    ],
    correctOption: 0,
    explanation: 'During encapsulation, each layer on the sender adds its own header (and trailer at Layer 2) containing necessary control information as data travels downward from Layer 7 to Layer 1.',
    explanationsJson: {
      1: 'Stripping headers is decapsulation, which occurs on the receiving device.',
      2: 'Physical signaling occurs at Layer 1, not Layer 7.',
      3: 'Encapsulation preserves and transports the actual application data payload.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Encapsulation Mechanics',
    points: 10
  },
  {
    quizId: 'quiz-osi-model-7-layers',
    lessonSlug: 'osi-model-7-layers',
    text: 'A user cannot browse the web. A technician notices that the network cable is completely unplugged and no link lights are glowing on the computer network port. At which OSI layer does this problem originate?',
    options: [
      'Layer 1 — Physical Layer',
      'Layer 7 — Application Layer',
      'Layer 4 — Transport Layer',
      'Layer 6 — Presentation Layer'
    ],
    correctOption: 0,
    explanation: 'Physical cables, connectors, link lights, and electrical signals belong to Layer 1 (Physical Layer). An unplugged cable is a Layer 1 fault.',
    explanationsJson: {
      1: 'While the web browser (Layer 7) fails to load, the root cause is the unplugged physical cable.',
      2: 'Transport (Layer 4) cannot function without an active physical connection.',
      3: 'Presentation (Layer 6) deals with data formatting, not physical cable connections.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Layered Troubleshooting Scenario',
    points: 10
  },

  // -------------------------------------------------------------------------
  // Topic 5: The TCP/IP Model (4 Layers)
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-tcp-ip-4-layers',
    lessonSlug: 'tcp-ip-4-layers',
    text: 'What is the primary difference between the 4-layer TCP/IP model and the 7-layer OSI model?',
    options: [
      'TCP/IP is a practical operational model implemented in operating systems, while OSI is a conceptual reference framework',
      'TCP/IP is purely theoretical and has never been implemented in real network hardware',
      'TCP/IP replaces IP addresses with physical cable connectors',
      'OSI is a 4-layer model and TCP/IP is a 7-layer model'
    ],
    correctOption: 0,
    explanation: 'The TCP/IP model (RFC 1122) represents the practical implementation suite used across the global Internet, whereas the OSI model is a theoretical 7-layer reference framework.',
    explanationsJson: {
      1: 'TCP/IP is the actual operational suite of the Internet.',
      2: 'TCP/IP uses IP addresses at the Internet layer.',
      3: 'OSI has 7 layers and TCP/IP has 4 layers.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'TCP/IP Model Purpose',
    points: 10
  },
  {
    quizId: 'quiz-tcp-ip-4-layers',
    lessonSlug: 'tcp-ip-4-layers',
    text: 'What is the correct top-to-bottom sequence of the 4 TCP/IP model layers?',
    options: [
      'Application → Transport → Internet → Network Access (Link)',
      'Physical → Network → Transport → Application',
      'Internet → Transport → Application → Network Access',
      'Network Access → Internet → Transport → Application'
    ],
    correctOption: 0,
    explanation: 'The top-to-bottom order of the TCP/IP model layers is: Application (Layer 4), Transport (Layer 3), Internet (Layer 2), Network Access / Link (Layer 1).',
    explanationsJson: {
      1: 'This lists OSI layer names, not the 4 TCP/IP layers.',
      2: 'Application is at the top of the stack, not Internet.',
      3: 'This order is reversed (bottom-to-top).'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.RECALL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'TCP/IP 4 Layers Sequence',
    points: 10
  },
  {
    quizId: 'quiz-tcp-ip-4-layers',
    lessonSlug: 'tcp-ip-4-layers',
    text: 'Which TCP/IP layer is responsible for logical addressing (IP addresses) and routing packets across interconnected networks?',
    options: [
      'Internet Layer',
      'Application Layer',
      'Transport Layer',
      'Network Access Layer'
    ],
    correctOption: 0,
    explanation: 'The Internet Layer handles IP addressing (IPv4/IPv6) and path determination (routing) to deliver packets across networks.',
    explanationsJson: {
      1: 'Application Layer interfaces with software applications.',
      2: 'Transport Layer handles port numbers and end-to-end communication.',
      3: 'Network Access Layer handles MAC addressing and physical transmission.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Internet Layer Responsibilities',
    points: 10
  },
  {
    quizId: 'quiz-tcp-ip-4-layers',
    lessonSlug: 'tcp-ip-4-layers',
    text: 'Which protocols correctly match their corresponding TCP/IP layers?',
    options: [
      'HTTP at Application, TCP at Transport, IP at Internet, Ethernet at Network Access',
      'IP at Application, HTTP at Transport, Ethernet at Internet, TCP at Network Access',
      'TCP at Application, Ethernet at Transport, IP at Internet, HTTP at Network Access',
      'Ethernet at Application, IP at Transport, TCP at Internet, HTTP at Network Access'
    ],
    correctOption: 0,
    explanation: 'HTTP is an Application protocol, TCP is a Transport protocol, IP is an Internet protocol, and Ethernet is a Network Access protocol.',
    explanationsJson: {
      1: 'IP is Internet layer, HTTP is Application layer.',
      2: 'TCP is Transport layer, Ethernet is Network Access layer.',
      3: 'Ethernet is Network Access layer, HTTP is Application layer.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.RECALL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'TCP/IP Protocol Classification',
    points: 10
  },
  {
    quizId: 'quiz-tcp-ip-4-layers',
    lessonSlug: 'tcp-ip-4-layers',
    text: 'How does the TCP/IP 4-layer stack align conceptually with the 7-layer OSI model?',
    options: [
      'TCP/IP Application combines OSI Layers 5, 6, and 7; Transport maps to OSI Layer 4; Internet maps to OSI Layer 3; Network Access combines OSI Layers 1 and 2',
      'TCP/IP combines all 7 OSI layers into 1 single layer',
      'TCP/IP maps directly 1-to-1 with all 7 OSI layers',
      'TCP/IP Network Access maps to OSI Layer 7 Application'
    ],
    correctOption: 0,
    explanation: 'TCP/IP combines OSI Application, Presentation, and Session into Application; maps Transport to Transport, Internet to Network, and combines Data Link and Physical into Network Access.',
    explanationsJson: {
      1: 'TCP/IP has 4 functional layers.',
      2: 'TCP/IP has 4 layers, while OSI has 7 layers.',
      3: 'Network Access corresponds to OSI Layers 1 and 2, not Layer 7.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'OSI vs TCP/IP Conceptual Mapping',
    points: 10
  },
  {
    quizId: 'quiz-tcp-ip-4-layers',
    lessonSlug: 'tcp-ip-4-layers',
    text: 'What is the correct order of data encapsulation terms as an outgoing web request travels down the TCP/IP stack?',
    options: [
      'Application Data Payload → Transport Segment → Internet Packet → Network Access Frame',
      'Frame → Packet → Segment → Application Payload',
      'Internet Packet → Frame → Segment → Bits',
      'Transport Segment → Frame → Packet → Payload'
    ],
    correctOption: 0,
    explanation: 'As data descends the stack, the Application Payload is wrapped in a Transport Segment (TCP header), an Internet Packet (IP header), and a Network Access Frame (Ethernet header/trailer).',
    explanationsJson: {
      1: 'This is the decapsulation order (bottom-up).',
      2: 'Application payload comes first at the top of the stack.',
      3: 'Segment precedes Packet, which precedes Frame.'
    },
    difficulty: CourseLevel.FOUNDATIONAL,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'TCP/IP Encapsulation Flow',
    points: 10
  },

  // -------------------------------------------------------------------------
  // Topic 6: Classful IPv4 History & The Architectural Necessity of CIDR (ip-addressing-ipv4-overview)
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-ip-addressing-ipv4-overview',
    lessonSlug: 'ip-addressing-ipv4-overview',
    text: 'In legacy classful IPv4 addressing (RFC 791), what default subnet mask and host capacity were assigned to all Class B network blocks (first octet 128 to 191)?',
    options: [
      'Default Mask: 255.255.0.0 (/16) supporting 65,534 usable host IPs',
      'Default Mask: 255.0.0.0 (/8) supporting 16,777,214 usable host IPs',
      'Default Mask: 255.255.255.0 (/24) supporting 254 usable host IPs',
      'Default Mask: 255.255.255.240 (/28) supporting 14 usable host IPs'
    ],
    correctOption: 0,
    explanation: 'Class B addresses (128.0.0.0 to 191.255.255.255) had a default 16-bit network prefix (/16, 255.255.0.0) leaving 16 host bits ($2^{16} - 2 = 65,534$ usable host addresses).',
    explanationsJson: {
      1: '255.0.0.0 (/8) is the default mask for Class A networks.',
      2: '255.255.255.0 (/24) is the default mask for Class C networks.',
      3: '/28 is a modern classless CIDR subnet mask, not a legacy classful default.'
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.RECALL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Classful IPv4 Class B Architecture',
    points: 10
  },
  {
    quizId: 'quiz-ip-addressing-ipv4-overview',
    lessonSlug: 'ip-addressing-ipv4-overview',
    text: 'What was the primary architectural crisis in the early 1990s that forced the IETF to replace Classful addressing with Classless Inter-Domain Routing (CIDR, RFC 1519)?',
    options: [
      'Rapid exhaustion of Class B address blocks and exponential explosion of the global Internet routing table due to rigid /8, /16, /24 allocation boundaries',
      'Ethernet switches were invented and could not process 32-bit IP addresses',
      'Classful addressing only worked on fiber optic cables and failed on copper wires',
      'The United States government mandated that all IP addresses must contain exactly 128 bits'
    ],
    correctOption: 0,
    explanation: 'Because Class C (/24, 254 hosts) was too small for most organizations, companies were allocated full Class B (/16, 65K hosts) blocks, wasting over 90% of allocated space and rapidly exhausting IPv4 space while bloating global routing tables.',
    explanationsJson: {
      1: 'Ethernet switches operate at Layer 2 (MAC addresses) and are agnostic to IP class structure.',
      2: 'Layer 3 IP operates independently of Layer 1 physical media.',
      3: '128-bit addresses describe IPv6, which was developed later (RFC 2460).'
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'The Historical Necessity of CIDR',
    points: 10
  },
  {
    quizId: 'quiz-ip-addressing-ipv4-overview',
    lessonSlug: 'ip-addressing-ipv4-overview',
    text: 'An organization in 1992 required 350 usable IP addresses. Under Classful rules, it was assigned an entire Class B block. How many IP addresses were wasted in this single allocation?',
    options: [
      '65,184 addresses (65,534 usable - 350 needed)',
      '254 addresses',
      '16,777,214 addresses',
      'Zero addresses were wasted'
    ],
    correctOption: 0,
    explanation: 'A Class B network contains 65,534 usable host addresses. Needing only 350 addresses means $65,534 - 350 = 65,184$ addresses were wasted (99.47% waste).',
    explanationsJson: {
      1: '254 is the capacity of one Class C network.',
      2: '16.7 million is the capacity of a Class A network.',
      3: 'Massive waste occurred because fractional Class B allocations were impossible under classful rules.'
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Classful Address Allocation Waste Calculation',
    points: 10
  },
  {
    quizId: 'quiz-ip-addressing-ipv4-overview',
    lessonSlug: 'ip-addressing-ipv4-overview',
    text: 'How does modern Classless Inter-Domain Routing (CIDR) eliminate the address waste of the legacy Classful system?',
    options: [
      'CIDR decouples network boundaries from 8-bit octet boundaries, allowing arbitrary prefix lengths (/1 to /32) tailored to exact host requirements',
      'CIDR converts all IPv4 addresses into 48-bit MAC addresses',
      'CIDR forces all computers on the Internet to share a single public IP address',
      'CIDR eliminates the need for routers by using satellite broadcasts'
    ],
    correctOption: 0,
    explanation: 'CIDR allows network masks of any bit length (/22, /23, /27, /30), enabling network engineers to allocate exact subnet sizes (e.g. /23 for 500 hosts) and aggregate multiple routes into compact supernets.',
    explanationsJson: {
      1: 'CIDR is an IPv4 Layer 3 prefix scheme, not a Layer 2 MAC conversion.',
      2: 'Sharing a single public IP is NAT/PAT, not CIDR prefix notation.',
      3: 'Routers remain the core forwarding devices of CIDR internetworks.'
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'CIDR Prefix Decoupling Principle',
    points: 10
  },

  // -------------------------------------------------------------------------
  // Topic 7: VLSM Design & Multi-Department Address Allocation (subnetting-cidr-overview)
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-subnetting-cidr-overview',
    lessonSlug: 'subnetting-cidr-overview',
    text: 'What is the Cardinal Rule that must be followed when designing a Variable Length Subnet Masking (VLSM) address plan to prevent address fragmentation and overlapping subnets?',
    options: [
      'Always sort all departmental host requirements from LARGEST to SMALLEST before assigning subnet address blocks',
      'Always allocate small point-to-point /30 links first at the beginning of the address block',
      'Assign identical /24 subnet masks to every department regardless of host count',
      'Allocate addresses alphabetically based on department name'
    ],
    correctOption: 0,
    explanation: 'The fundamental rule of VLSM design is to allocate from largest host requirement to smallest. Larger subnets (e.g. /26) must align with larger power-of-2 boundaries (0, 64, 128, 192), which is only possible if smaller subnets do not fragment the space first.',
    explanationsJson: {
      1: 'Allocating small /30 links first fragments the space and prevents placing larger /26 or /27 subnets cleanly.',
      2: 'Assigning identical masks is FLSM (Fixed Length Subnet Masking), not VLSM.',
      3: 'Department names have no mathematical relation to binary block boundaries.'
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'The Cardinal Rule of VLSM Allocation',
    points: 10
  },
  {
    quizId: 'quiz-subnetting-cidr-overview',
    lessonSlug: 'subnetting-cidr-overview',
    text: 'Given base network `192.168.10.0/24`, the Engineering department is assigned the first subnet `192.168.10.0/26` (62 usable hosts). What is the exact starting Network ID and Subnet Mask for the next department (Sales) which requires 25 usable hosts?',
    options: [
      'Network ID: 192.168.10.64 with Subnet Mask 255.255.255.224 (/27)',
      'Network ID: 192.168.10.63 with Subnet Mask 255.255.255.192 (/26)',
      'Network ID: 192.168.10.128 with Subnet Mask 255.255.255.240 (/28)',
      'Network ID: 192.168.10.32 with Subnet Mask 255.255.255.224 (/27)'
    ],
    correctOption: 0,
    explanation: 'Subnet 1 (`192.168.10.0/26`) has block size 64 and spans `.0` to `.63`. The next available address is `192.168.10.64`. For 25 hosts, we need block size 32 ($2^5 = 32$), which is prefix `/27` (mask 255.255.255.224). Range is `192.168.10.64/27` (.64 to .95).',
    explanationsJson: {
      1: '.63 is the broadcast address of the first subnet and cannot be a Network ID.',
      2: '.128 skips unallocated address space and /28 only supports 14 hosts (Sales needs 25).',
      3: '.32 falls inside the first /26 subnet (.0 to .63), creating a catastrophic address overlap.'
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'VLSM Subnet Block Progression',
    points: 10
  },
  {
    quizId: 'quiz-subnetting-cidr-overview',
    lessonSlug: 'subnetting-cidr-overview',
    text: 'An enterprise network requires two point-to-point router WAN links requiring exactly 2 usable host IP addresses each. Which two non-overlapping subnets immediately follow `192.168.10.96/28` (.96 to .111)?',
    options: [
      'WAN Link 1: 192.168.10.112/30 and WAN Link 2: 192.168.10.116/30',
      'WAN Link 1: 192.168.10.111/30 and WAN Link 2: 192.168.10.115/30',
      'WAN Link 1: 192.168.10.128/30 and WAN Link 2: 192.168.10.132/30',
      'WAN Link 1: 192.168.10.112/29 and WAN Link 2: 192.168.10.120/29'
    ],
    correctOption: 0,
    explanation: 'The prior `/28` subnet ends at `.111`. The next available IP is `.112`. A /30 has block size 4: WAN 1 is `192.168.10.112/30` (.112-.115). WAN 2 begins at `.116`: `192.168.10.116/30` (.116-.119). Both are perfectly contiguous with zero overlap.',
    explanationsJson: {
      1: '.111 is the broadcast address of the prior subnet and cannot be used.',
      2: '.128 unnecessarily skips valid address space (.112 to .127).',
      3: '/29 subnets have block size 8 (6 usable hosts), wasting 4 addresses per link when /30 is optimal.'
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Point-to-Point /30 VLSM Allocation',
    points: 10
  },
  {
    quizId: 'quiz-subnetting-cidr-overview',
    lessonSlug: 'subnetting-cidr-overview',
    text: 'A network administrator configures a host with IP `192.168.10.95/27` on the Sales subnet. The host is unable to communicate with any other workstation. What is the root cause of this failure?',
    options: [
      '`192.168.10.95` is the reserved Broadcast Address of the `192.168.10.64/27` subnet (block size 32, range .64 to .95) and cannot be assigned to an individual host',
      'A /27 subnet mask is invalid on Ethernet networks',
      'The host requires an optical transceiver to use IP addresses ending in 95',
      'The IP address belongs to the public Internet space'
    ],
    correctOption: 0,
    explanation: 'Subnet `192.168.10.64/27` has block size 32. The range is 192.168.10.64 (Network ID) through 192.168.10.95 (Broadcast ID). Usable host IPs are strictly .65 through .94. Assigning .95 assigns the broadcast address, which operating systems reject.',
    explanationsJson: {
      1: '/27 is a standard, valid subnet mask.',
      2: 'Physical transceivers have no relation to IP octet values.',
      3: '192.168.x.x is private RFC 1918 space, not public Internet.'
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
    questionType: QuestionType.TROUBLESHOOTING,
    concept: 'Broadcast Address Assignment Error in VLSM',
    points: 10
  },

  // -------------------------------------------------------------------------
  // Topic 8: IPv6 Foundations Overview
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-ipv6-foundations-overview',
    lessonSlug: 'ipv6-foundations-overview',
    text: 'What are the two official abbreviation rules used to compress long IPv6 addresses according to RFC 5952?',
    options: [
      '1. Omit leading zeros in any 16-bit hextet; 2. Replace a single contiguous sequence of all-zero hextets with a double colon (::) exactly once in an address',
      '1. Delete all odd-numbered hextets; 2. Replace the first 64 bits with the letter X',
      '1. Convert hexadecimal characters A-F to numbers 1-6; 2. Remove all colons',
      '1. Convert IPv6 into IPv4 dotted-decimal format; 2. Append .0 at the end'
    ],
    correctOption: 0,
    explanation: 'RFC 5952 rules: 1. Leading zeros in any 4-digit hextet must be suppressed (e.g. `:0042:` -> `:42:`). 2. A single contiguous string of one or more all-zero hextets can be replaced by `::` (allowed only once to avoid ambiguity).',
    explanationsJson: {
      1: 'Deleting hextets corrupts the 128-bit address structure.',
      2: 'Hex characters A-F are valid Base-16 numerals (10-15) and cannot be replaced with 1-6.',
      3: 'IPv6 is a 128-bit protocol and cannot be compressed into 32-bit IPv4 notation.'
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'IPv6 Address Compression Rules',
    points: 10
  },
  {
    quizId: 'quiz-ipv6-foundations-overview',
    lessonSlug: 'ipv6-foundations-overview',
    text: 'Compress the full 128-bit IPv6 address `2001:0db8:0000:0000:0000:0000:0000:0001` to its shortest valid standard representation:',
    options: [
      '2001:db8::1',
      '2001:db8:0:0:0:0:0:1',
      '2001:db8::0::1',
      '2001::db8::1'
    ],
    correctOption: 0,
    explanation: 'Leading zeros in `0db8` are removed -> `db8`. The five consecutive all-zero hextets `0000:0000:0000:0000:0000` are replaced with `::`. The final hextet `0001` becomes `1`. Final result: `2001:db8::1`.',
    explanationsJson: {
      1: '2001:db8:0:0:0:0:0:1 leaves zero hextets uncompressed instead of applying `::`.',
      2: 'Using `::` twice in an address is strictly illegal because it creates ambiguity in how many zero bits each `::` represents.',
      3: 'Double colon cannot appear twice in any IPv6 address.'
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'IPv6 Compression Application',
    points: 10
  },
  {
    quizId: 'quiz-ipv6-foundations-overview',
    lessonSlug: 'ipv6-foundations-overview',
    text: 'What is the prefix and scope of an IPv6 Link-Local address automatically configured on every enabled interface?',
    options: [
      '`fe80::/10` (FE80 to FEBF); valid and routable only on the local physical link/broadcast domain',
      '`2000::/3`; globally routable across the public Internet',
      '`ff00::/8`; reserved for IPv6 broadcast traffic',
      '`::1/128`; reserved for external DNS root resolution'
    ],
    correctOption: 0,
    explanation: 'IPv6 Link-Local addresses start with `fe80::/10` (typically `fe80::/64`). They are non-routable beyond the local link and are used for neighbor discovery (NDP), router advertisements, and local communication.',
    explanationsJson: {
      1: '2000::/3 is the Global Unicast Address (GUA) range routable across the Internet.',
      2: 'ff00::/8 is the IPv6 Multicast range (IPv6 eliminated broadcast entirely).',
      3: '::1/128 is the IPv6 Loopback address (equivalent to 127.0.0.1).'
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.RECALL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'IPv6 Link-Local Addressing (fe80::)',
    points: 10
  },
  {
    quizId: 'quiz-ipv6-foundations-overview',
    lessonSlug: 'ipv6-foundations-overview',
    text: 'How does IPv6 eliminate the need for Layer 2 Broadcast frames and the legacy ARP broadcast protocol?',
    options: [
      'IPv6 replaces broadcast with ICMPv6 Neighbor Discovery Protocol (NDP) utilizing targeted Solicited-Node Multicast addresses (`ff02::1:ffxx:xxxx`)',
      'IPv6 forces all switches to flood all frames out all ports permanently',
      'IPv6 embeds the full MAC address inside the domain name DNS record',
      'IPv6 devices physically connect their cables directly to every other computer in the building'
    ],
    correctOption: 0,
    explanation: 'IPv6 completely eliminated broadcast. Address resolution is performed via ICMPv6 Neighbor Solicitation (NS) sent to the targeted Solicited-Node Multicast group, allowing NICs that are not the target to ignore the frame at the hardware level.',
    explanationsJson: {
      1: 'Flooding all frames is broadcast behavior, which IPv6 explicitly eliminates.',
      2: 'DNS maps names to IPs; it does not replace local Layer 2 frame resolution.',
      3: 'IPv6 operates on standard star-wired switched Ethernet and Wi-Fi networks.'
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'IPv6 NDP vs Legacy ARP Broadcast',
    points: 10
  },

  // -------------------------------------------------------------------------
  // Topic 9: Ethernet & MAC Addresses Overview
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-ethernet-mac-addresses-overview',
    lessonSlug: 'ethernet-mac-addresses-overview',
    text: 'What are the minimum and maximum standard frame sizes for an Ethernet II frame (including Header and FCS)?',
    options: [
      'Minimum: 64 bytes (14B Header + 46B Min Payload + 4B FCS); Maximum: 1518 bytes (14B Header + 1500B Max Payload + 4B FCS)',
      'Minimum: 20 bytes; Maximum: 65535 bytes',
      'Minimum: 1 byte; Maximum: 100 bytes',
      'Minimum: 128 bytes; Maximum: 9000 bytes'
    ],
    correctOption: 0,
    explanation: 'IEEE 802.3 / Ethernet II defines a minimum frame size of 64 bytes (preventing undetected collisions in CSMA/CD) and a maximum standard frame size of 1518 bytes (1522 bytes with 802.1Q tag).',
    explanationsJson: {
      1: '20 bytes is the minimum IPv4 header length, not the Ethernet frame size.',
      2: '1 to 100 bytes is far below valid Ethernet framing limits.',
      3: '9000 bytes describes Jumbo Frames used in specialized storage/datacenter environments, not the base standard.'
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.RECALL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Ethernet Frame Size Boundaries',
    points: 10
  },
  {
    quizId: 'quiz-ethernet-mac-addresses-overview',
    lessonSlug: 'ethernet-mac-addresses-overview',
    text: 'What is the purpose of the 8-byte Preamble and Start Frame Delimiter (SFD) that precedes every Ethernet frame on the physical wire?',
    options: [
      'To provide bit synchronization for the receiver clock and signal the exact start of the MAC destination address bytes',
      'To encrypt the payload data using 256-bit AES keys',
      'To record the GPS coordinates of the transmitting computer',
      'To store the source IP address in hexadecimal format'
    ],
    correctOption: 0,
    explanation: 'The 7-byte Preamble (pattern `10101010`) synchronizes receiving NIC clock timing, and the 1-byte SFD (pattern `10101011`) signals that the very next byte is the first byte of the Destination MAC address.',
    explanationsJson: {
      1: 'Preambles are alternating bit timing signals, not cryptographic encryption keys.',
      2: 'Ethernet Layer 2 framing contains no GPS location telemetry.',
      3: 'IP addresses belong in the Layer 3 header, not the Layer 1/2 physical preamble.'
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Ethernet Preamble & SFD Synchronization',
    points: 10
  },
  {
    quizId: 'quiz-ethernet-mac-addresses-overview',
    lessonSlug: 'ethernet-mac-addresses-overview',
    text: 'How does an Ethernet NIC determine whether an incoming unicast frame should be processed or discarded at Layer 2?',
    options: [
      'It compares the Destination MAC address in the frame header against its own burned-in MAC address; if they match (or if it is broadcast/multicast), it passes it up the stack; otherwise, it discards it in hardware',
      'It reads the user password inside the payload to verify authorization',
      'It forwards every single frame directly to the CPU regardless of MAC address',
      'It checks if the frame was transmitted during working business hours'
    ],
    correctOption: 0,
    explanation: 'NIC hardware filters incoming frames by comparing the Destination MAC to its own MAC address, the broadcast address (FF:FF:FF:FF:FF:FF), or registered multicast addresses, discarding non-matching frames with zero CPU overhead.',
    explanationsJson: {
      1: 'Layer 2 NIC hardware does not parse application-layer user passwords.',
      2: 'Passing all frames to the CPU occurs only in "promiscuous mode" (used by packet sniffers like Wireshark), not normal operation.',
      3: 'Ethernet framing operates 24/7 independent of calendar hours.'
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'NIC MAC Filtering Mechanics',
    points: 10
  },
  {
    quizId: 'quiz-ethernet-mac-addresses-overview',
    lessonSlug: 'ethernet-mac-addresses-overview',
    text: 'A network sniffer reveals that an Ethernet frame has a total length of only 50 bytes. What will the transmitting NIC automatically do to ensure it meets the IEEE 802.3 minimum frame length?',
    options: [
      'Append 14 bytes of padding (zeros) to the payload so the total frame length equals exactly 64 bytes',
      'Drop the packet and report an operating system memory failure',
      'Retransmit the frame 5 times in rapid succession',
      'Convert the Ethernet frame into a wireless 802.11 beacon'
    ],
    correctOption: 0,
    explanation: 'If an upper-layer payload is less than 46 bytes (making the total frame less than 64 bytes), the transmitting MAC layer automatically inserts Pad bytes (zeros) to reach the mandatory 64-byte minimum frame size.',
    explanationsJson: {
      1: 'Small payloads are completely normal (e.g. small TCP ACKs) and padded automatically; no error is reported.',
      2: 'Padding ensures single-frame compliance; rapid repetition does not fix short frames.',
      3: 'Ethernet NICs do not convert wired frames to 802.11 wireless beacons.'
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
    questionType: QuestionType.TROUBLESHOOTING,
    concept: 'Ethernet Frame Padding (Pad Bytes)',
    points: 10
  },

  // -------------------------------------------------------------------------
  // Topic 10: ARP Protocol Overview
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-arp-protocol-overview',
    lessonSlug: 'arp-protocol-overview',
    text: 'What specific problem does the Address Resolution Protocol (ARP) solve on an IPv4 local Ethernet network?',
    options: [
      'Resolving a known IPv4 address into its corresponding 48-bit physical MAC address on the local network link',
      'Resolving domain names like google.com into IP addresses',
      'Encrypting web traffic between clients and online banking servers',
      'Assigning default gateway IP addresses to mobile smartphones',
    ],
    correctOption: 0,
    explanation:
      'When a host knows the target IPv4 address on the local subnet but lacks the destination MAC address to build the Layer 2 Ethernet frame, ARP broadcasts an ARP Request to discover the target MAC address.',
    explanationsJson: {
      1: 'Resolving domain names into IP addresses is performed by DNS.',
      2: 'Encrypting web traffic is handled by TLS/SSL at Layer 6/7.',
      3: 'Assigning IP settings dynamically is handled by DHCP.',
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'ARP Purpose & Mechanics',
    points: 10,
  },
  {
    quizId: 'quiz-arp-protocol-overview',
    lessonSlug: 'arp-protocol-overview',
    text: 'What are the Layer 2 and Layer 3 destination addresses used in an ARP Request message?',
    options: [
      'Layer 2 Destination: Broadcast MAC (FF:FF:FF:FF:FF:FF) | Layer 3: Target Host IPv4 Address',
      'Layer 2 Destination: Unicast Router MAC | Layer 3: 127.0.0.1',
      'Layer 2 Destination: 00:00:00:00:00:00 | Layer 3: 255.255.255.255',
      'Layer 2 Destination: Multicast 01:00:5E:00:00:01 | Layer 3: 0.0.0.0',
    ],
    correctOption: 0,
    explanation:
      'An ARP Request is encapsulated in a Layer 2 Broadcast frame (`FF:FF:FF:FF:FF:FF`) so all devices on the local segment receive it, while the ARP payload specifies the target IPv4 address being resolved.',
    explanationsJson: {
      1: 'The sender does not yet know the target MAC, so it cannot send a unicast frame.',
      2: '00:00:00:00:00:00 is an invalid destination MAC on Ethernet.',
      3: 'Standard IPv4 ARP uses Layer 2 broadcast, not IPv4 multicast MAC addresses.',
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'ARP Request Frame Addressing',
    points: 10,
  },
  {
    quizId: 'quiz-arp-protocol-overview',
    lessonSlug: 'arp-protocol-overview',
    text: 'When a host on subnet `192.168.1.0/24` needs to send an IP packet to remote public web server `93.184.216.34`, which device address does the host query in its ARP Request?',
    options: [
      'The IP address of its local Default Gateway (e.g. 192.168.1.1), because ARP broadcasts cannot cross a router boundary',
      'The public IP address 93.184.216.34 across the global Internet',
      'The MAC address of the root DNS server',
      'The broadcast address 255.255.255.255',
    ],
    correctOption: 0,
    explanation:
      'Because 93.184.216.34 is on a remote subnet, the host knows it must route traffic through its Default Gateway. Since ARP broadcasts are confined to the local Layer 2 broadcast domain, the host ARPs for the Gateway\'s MAC address.',
    explanationsJson: {
      1: 'ARP broadcasts cannot cross routers.',
      2: 'DNS servers do not handle Layer 2 framing.',
      3: 'Broadcast IP is not an ARP target.',
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'ARP for Off-Subnet Destinations',
    points: 10,
  },
  {
    quizId: 'quiz-arp-protocol-overview',
    lessonSlug: 'arp-protocol-overview',
    text: 'Why do operating systems maintain a temporary "ARP Cache" (ARP Table) in memory buffers?',
    options: [
      'To avoid broadcasting an ARP Request for every individual IP packet sent to the same destination host, significantly reducing network broadcast overhead',
      'To permanently store credit card transactions on the network switch',
      'To speed up CPU clock speed during video rendering',
      'To prevent the computer from needing an IP address',
    ],
    correctOption: 0,
    explanation:
      'The ARP cache stores recent IP-to-MAC bindings for a few minutes. Subsequent packets to the same destination immediately use the cached MAC address, avoiding constant broadcast flooding across the LAN.',
    explanationsJson: {
      1: 'ARP caches store network Layer 2/3 address bindings, not financial transactions.',
      2: 'ARP caching is a networking optimization, unrelated to CPU video rendering.',
      3: 'Devices still require valid IP addresses to communicate on an IP network.',
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'ARP Cache Purpose & Aging',
    points: 10,
  },
  {
    quizId: 'quiz-arp-protocol-overview',
    lessonSlug: 'arp-protocol-overview',
    text: 'What happens when Host C (192.168.1.30) receives an ARP Request broadcast asking "Who has 192.168.1.50?"',
    options: [
      'Host C inspects the Target Protocol Address, sees 192.168.1.50 does not match its own IP, and silently discards the frame without replying',
      'Host C forwards the ARP Request to the Default Gateway',
      'Host C sends an ARP Error reply back to the sender',
      'Host C crashes because it received broadcast traffic',
    ],
    correctOption: 0,
    explanation:
      'Non-target hosts on a broadcast segment process the incoming broadcast frame up to the ARP header, verify that the requested Target Protocol Address does not match their own IP, and discard the frame with zero reply.',
    explanationsJson: {
      1: 'Hosts do not route or forward ARP broadcast frames.',
      2: 'ARP does not define an error reply message for non-matching hosts.',
      3: 'Network stacks are designed to discard non-matching broadcasts routinely.',
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Non-Target ARP Frame Discarding',
    points: 10,
  },
  {
    quizId: 'quiz-arp-protocol-overview',
    lessonSlug: 'arp-protocol-overview',
    text: 'An attacker transmits unsolicited ARP replies associating the Default Gateway IP address with the attacker\'s own MAC address. What attack is taking place, and what is the standard switch mitigation?',
    options: [
      'ARP Cache Poisoning / Spoofing (Man-in-the-Middle); mitigated on switches using Dynamic ARP Inspection (DAI) coupled with DHCP Snooping',
      'DNS Amplification DDoS; mitigated by blocking UDP port 53',
      'SYN Flood attack; mitigated by enabling TCP SYN Cookies',
      'Buffer Overflow attack; mitigated by compiling with Address Space Layout Randomization (ASLR)',
    ],
    correctOption: 0,
    explanation:
      'ARP Spoofing tricks hosts into sending outbound traffic to the attacker MAC. Managed switches mitigate this using Dynamic ARP Inspection (DAI), which validates ARP packets against the trusted DHCP Snooping binding database.',
    explanationsJson: {
      1: 'DNS amplification attacks public DNS resolvers via UDP reflection, not local LAN ARP tables.',
      2: 'SYN floods target TCP transport buffers, not Layer 2 ARP caches.',
      3: 'ASLR protects OS application memory against code injection, not network ARP poisoning.',
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
    questionType: QuestionType.TROUBLESHOOTING,
    concept: 'ARP Poisoning & Dynamic ARP Inspection',
    points: 10,
  },

  // -------------------------------------------------------------------------
  // Topic 11: The Integrated Host Boot-Up Lifecycle
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-dhcp-dns-overview',
    lessonSlug: 'dhcp-dns-overview',
    text: 'What is the correct chronological sequence of protocol events that must execute when an unconfigured computer boots up, connects to Ethernet, and sends its first HTTPS web request?',
    options: [
      'Physical Link Up -> DHCP Lease Acquisition -> Gratuitous ARP (DAD) -> Default Gateway ARP Resolution -> DNS Name Resolution -> Outbound TCP 3-Way Handshake & HTTPS GET',
      'HTTPS GET -> DNS Resolution -> TCP Handshake -> DHCP Lease -> Physical Link Up',
      'DNS Resolution -> Default Gateway ARP -> DHCP Lease -> Physical Link Up -> TCP Handshake',
      'Default Gateway ARP -> DNS Resolution -> Physical Link Up -> DHCP Lease -> HTTPS GET'
    ],
    correctOption: 0,
    explanation: 'A host must first establish Physical Link Up (PHY negotiation), acquire its IP configuration via DHCP (DORA), verify IP uniqueness via Gratuitous ARP, resolve the Default Gateway MAC via ARP, resolve the target domain name via DNS, and finally initiate the TCP 3-way handshake and HTTPS GET request.',
    explanationsJson: {
      1: 'Reversed sequence; application requests cannot occur before physical link and IP configuration.',
      2: 'DNS requires an IP address and default gateway route before it can query a DNS server.',
      3: 'A host cannot ARP for its gateway before learning its gateway IP address via DHCP.'
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Integrated Host Boot-Up Sequence',
    points: 10
  },
  {
    quizId: 'quiz-dhcp-dns-overview',
    lessonSlug: 'dhcp-dns-overview',
    text: 'During the host boot-up lifecycle, why must the client resolve the MAC address of its Default Gateway via ARP before it can send a DNS query to public DNS resolver 8.8.8.8?',
    options: [
      'Because 8.8.8.8 is on a remote subnet; the client must encapsulate the DNS IP packet inside an Ethernet frame addressed to the local Default Gateway router MAC',
      'Because DNS root servers require the gateway MAC address to look up domain names',
      'Because ARP assigns the client its IPv4 address before DNS can run',
      'Because DHCP servers only accept DNS queries that are signed by the gateway'
    ],
    correctOption: 0,
    explanation: 'When a host determines that the destination IP (8.8.8.8) is off-subnet, it knows it must forward the packet through its local Default Gateway. The host sends an ARP Request for the Gateway IP to obtain the Gateway MAC needed for the Layer 2 Ethernet frame.',
    explanationsJson: {
      1: 'DNS root servers process DNS query payloads; they do not inspect client Layer 2 gateway MAC headers.',
      2: 'DHCP leases IP addresses, not ARP.',
      3: 'DHCP and DNS are distinct protocols operating on UDP ports 67/68 and 53.'
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Gateway ARP Resolution for Off-Subnet DNS',
    points: 10
  },
  {
    quizId: 'quiz-dhcp-dns-overview',
    lessonSlug: 'dhcp-dns-overview',
    text: 'When a client host (192.168.1.50, MAC 00:AA) transmits an outbound HTTPS request to web server 93.184.216.34 via default gateway 192.168.1.1 (MAC 00:BB), what are the Layer 2 and Layer 3 destination addresses in the transmitted frame?',
    options: [
      'Layer 3 Destination IP: 93.184.216.34 | Layer 2 Destination MAC: 00:BB (Default Gateway MAC)',
      'Layer 3 Destination IP: 192.168.1.1 | Layer 2 Destination MAC: 00:AA',
      'Layer 3 Destination IP: 93.184.216.34 | Layer 2 Destination MAC: FF:FF:FF:FF:FF:FF (Broadcast)',
      'Layer 3 Destination IP: 255.255.255.255 | Layer 2 Destination MAC: 00:BB'
    ],
    correctOption: 0,
    explanation: 'The Layer 3 Destination IP always identifies the ultimate end-to-end destination server (93.184.216.34) and does not change. The Layer 2 Destination MAC identifies the next-hop physical interface (the Default Gateway router MAC 00:BB) on the local broadcast domain.',
    explanationsJson: {
      1: '192.168.1.1 is the gateway router IP, not the web server target IP.',
      2: 'Unicast web traffic is never broadcast to FF:FF:FF:FF:FF:FF.',
      3: '255.255.255.255 is a Layer 3 broadcast, invalid for unicast HTTPS.'
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Destination IP vs Destination MAC in Outbound Traffic',
    points: 10
  },
  {
    quizId: 'quiz-dhcp-dns-overview',
    lessonSlug: 'dhcp-dns-overview',
    text: 'A user boots their computer and cannot load websites. An engineer diagnoses the sequential lifecycle: (1) Link LED is solid green, (2) `ipconfig` shows IP 192.168.1.50 and Gateway 192.168.1.1, (3) `ping 192.168.1.1` succeeds, (4) `ping 8.8.8.8` succeeds, (5) `nslookup google.com` times out. At which stage of the boot lifecycle did the failure occur?',
    options: [
      'Phase 5: DNS Name Resolution failed, because IP routing and gateway reachability are fully operational but domain name lookup is timing out',
      'Phase 1: Physical Link Up failed',
      'Phase 2: DHCP Lease Acquisition failed',
      'Phase 4: Default Gateway ARP Resolution failed'
    ],
    correctOption: 0,
    explanation: 'Because link up (Phase 1), DHCP IP assignment (Phase 2), Gateway ARP (Phase 4), and IP routing to public 8.8.8.8 all succeeded, the failure is isolated specifically to Phase 5 (DNS Name Resolution), pointing to an uncontactable or misconfigured DNS server.',
    explanationsJson: {
      1: 'Solid green link LED and successful local pings prove Physical Link Up succeeded.',
      2: 'A valid 192.168.1.50 IP proves DHCP leasing succeeded.',
      3: 'Successful ping to the gateway proves Gateway ARP and Layer 2 forwarding succeeded.'
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
    questionType: QuestionType.TROUBLESHOOTING,
    concept: 'Host Boot Lifecycle Fault Isolation',
    points: 10
  },

  // -------------------------------------------------------------------------
  // Topic 12: TCP & UDP Transport Overview
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-tcp-udp-transport-overview',
    lessonSlug: 'tcp-udp-transport-overview',
    text: 'What are the exact control flags and sequence of the TCP 3-Way Handshake used to establish a reliable connection?',
    options: [
      '1. Client sends SYN (Synchronize) → 2. Server responds with SYN-ACK (Synchronize-Acknowledgment) → 3. Client sends ACK (Acknowledgment)',
      '1. Client sends ACK → 2. Server sends SYN → 3. Client sends FIN',
      '1. Client sends PSH → 2. Server sends URG → 3. Client sends RST',
      '1. Client sends HELLO → 2. Server sends WELCOME → 3. Client sends READY'
    ],
    correctOption: 0,
    explanation: 'TCP connection establishment uses the 3-way handshake: 1. Host A sends SYN with Initial Sequence Number (ISN); 2. Host B responds with SYN-ACK (acknowledging A ISN and sending its own ISN); 3. Host A replies with ACK. The connection is now ESTABLISHED.',
    explanationsJson: {
      1: 'A connection cannot begin with ACK before sequence numbers are synchronized with SYN.',
      2: 'PSH and URG are data-handling flags, not connection establishment flags.',
      3: 'HELLO/WELCOME/READY are informal terms, not TCP header control flags.'
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.RECALL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'TCP 3-Way Handshake Mechanics',
    points: 10
  },
  {
    quizId: 'quiz-tcp-udp-transport-overview',
    lessonSlug: 'tcp-udp-transport-overview',
    text: 'How does TCP implement Flow Control to prevent a high-speed transmitting host from overwhelming a slower receiving host memory buffer?',
    options: [
      'Using a dynamic Sliding Window mechanism where the receiver advertises its available buffer capacity in the TCP "Window Size" header field',
      'By dropping 50% of all packets at the default gateway router',
      'By forcing the transmitting computer to shut down for 10 seconds after every 1 megabyte sent',
      'By converting all TCP packets into UDP datagrams'
    ],
    correctOption: 0,
    explanation: 'TCP flow control uses the 16-bit Window Size field (and window scaling). The receiver continuously advertises how many bytes of data it can currently accept in its buffer. If the buffer fills, it sends Window Size = 0 (Zero Window), pausing sender transmission.',
    explanationsJson: {
      1: 'Dropping 50% of packets causes severe retransmission churn, not controlled flow regulation.',
      2: 'TCP regulates packet flow smoothly in millisecond sliding window intervals without OS shutdown.',
      3: 'TCP and UDP are distinct protocols; TCP does not convert itself into UDP.'
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'TCP Sliding Window Flow Control',
    points: 10
  },
  {
    quizId: 'quiz-tcp-udp-transport-overview',
    lessonSlug: 'tcp-udp-transport-overview',
    text: 'Why do real-time applications such as Voice over IP (VoIP), live video streaming, and online multiplayer gaming prefer UDP over TCP?',
    options: [
      'UDP has minimal header overhead (8 bytes vs 20+ bytes) and no retransmission delays, prioritizing low latency and timing over retransmitting lost stale packets',
      'UDP provides 100% guaranteed delivery of every single audio byte',
      'UDP automatically encrypts audio using military-grade encryption',
      'UDP does not require IP addresses to traverse the Internet'
    ],
    correctOption: 0,
    explanation: 'UDP is connectionless and lightweight (8-byte header). In real-time audio/video, a retransmitted audio packet arriving 300ms late is useless and causes stuttering. Low latency and predictable jitter take precedence over perfect reliability.',
    explanationsJson: {
      1: 'UDP provides no delivery guarantees; TCP provides guaranteed delivery.',
      2: 'UDP provides no built-in encryption; security must be provided by application layers (e.g. SRTP/DTLS).',
      3: 'UDP datagrams are encapsulated inside standard Layer 3 IP packets requiring source and destination IP addresses.'
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'UDP vs TCP Real-Time Tradeoffs',
    points: 10
  },
  {
    quizId: 'quiz-tcp-udp-transport-overview',
    lessonSlug: 'tcp-udp-transport-overview',
    text: 'Host A sends a TCP segment with `Seq = 1000` containing `500 bytes` of data to Host B. What Acknowledgment number (`Ack`) will Host B return if the segment is received successfully?',
    options: [
      '`Ack = 1500` (acknowledging receipt of bytes 1000 through 1499 and expecting byte 1500 next)',
      '`Ack = 1000`',
      '`Ack = 500`',
      '`Ack = 1001`'
    ],
    correctOption: 0,
    explanation: 'TCP Acknowledgments are "forward-looking" and cumulative: `Ack = Seq + Payload Length`. The segment covers byte offsets 1000 to 1499. Host B acknowledges this by requesting the next expected byte: `Ack = 1000 + 500 = 1500`.',
    explanationsJson: {
      1: 'Ack = 1000 would indicate no bytes were received and request byte 1000 again.',
      2: 'Ack = 500 is backward-referencing an invalid offset.',
      3: 'Ack = 1001 only acknowledges 1 single byte of data (as in a SYN-ACK), not 500 payload bytes.'
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'TCP Sequence & Acknowledgment Calculation',
    points: 10
  },

  // -------------------------------------------------------------------------
  // Topic 13: Routing Fundamentals Overview
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-routing-fundamentals-overview',
    lessonSlug: 'routing-fundamentals-overview',
    text: 'What is the role of Administrative Distance (AD) in a router routing table selection process?',
    options: [
      'It measures the trustworthiness / believability of different routing sources (e.g. Directly Connected = 0, Static = 1, OSPF = 110, RIP = 120), selecting the lowest AD when routes to the exact same prefix exist',
      'It measures the physical length of the fiber optic cable in miles',
      'It calculates the number of Ethernet switch ports on the network',
      'It defines the maximum number of users allowed to connect to a Wi-Fi router'
    ],
    correctOption: 0,
    explanation: 'Administrative Distance (AD) ranks the trustworthiness of routing sources (0 to 255). If a router learns the identical subnet via both OSPF (AD 110) and a Static Route (AD 1), it installs the Static Route into the routing table because lower AD is preferred.',
    explanationsJson: {
      1: 'AD is an administrative preference integer, not a physical distance measurement.',
      2: 'AD has no relation to switch port density.',
      3: 'AD does not regulate Wi-Fi user capacity.'
    },
    difficulty: CourseLevel.INTERMEDIATE,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Administrative Distance vs Metric',
    points: 10
  },
  {
    quizId: 'quiz-routing-fundamentals-overview',
    lessonSlug: 'routing-fundamentals-overview',
    text: 'Match the standard Cisco Administrative Distances for: Directly Connected, Static Route, eBGP, and OSPF:',
    options: [
      'Directly Connected = 0 | Static Route = 1 | eBGP = 20 | OSPF = 110',
      'Directly Connected = 110 | Static Route = 90 | eBGP = 1 | OSPF = 0',
      'Directly Connected = 255 | Static Route = 120 | eBGP = 100 | OSPF = 50',
      'Directly Connected = 1 | Static Route = 0 | eBGP = 110 | OSPF = 20'
    ],
    correctOption: 0,
    explanation: 'Standard Administrative Distance values: Directly Connected interfaces = 0; Static routes = 1; External BGP (eBGP) = 20; EIGRP internal = 90; OSPF = 110; IS-IS = 115; RIP = 120; Internal BGP (iBGP) = 200.',
    explanationsJson: {
      1: 'Directly Connected is 0, not 110; eBGP is 20, not 1.',
      2: 'AD 255 represents an unreachable/untrusted route, not directly connected.',
      3: 'Static routes have AD 1 and directly connected interfaces have AD 0.'
    },
    difficulty: CourseLevel.INTERMEDIATE,
    cognitiveLevel: CognitiveLevel.RECALL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Standard Administrative Distance Values',
    points: 10
  },
  {
    quizId: 'quiz-routing-fundamentals-overview',
    lessonSlug: 'routing-fundamentals-overview',
    text: 'What is a "Floating Static Route", and how is it configured in enterprise networks?',
    options: [
      'A backup static route configured with a higher Administrative Distance (e.g. AD 150) than the primary dynamic routing protocol (e.g. OSPF AD 110), remaining inactive until the primary route fails',
      'A route that moves dynamically between clouds using wireless satellite tracking',
      'A route that has no destination IP address configured',
      'A route that broadcasts all packets out every port on the router'
    ],
    correctOption: 0,
    explanation: 'A floating static route is an administrative backup route. By assigning it an AD higher than the primary route (e.g. `ip route 0.0.0.0 0.0.0.0 192.0.2.1 150`), it stays out of the routing table until the primary dynamic OSPF route goes down.',
    explanationsJson: {
      1: '"Floating" refers to floating above the routing table in standby, not satellite movement.',
      2: 'All valid routes require a destination network prefix.',
      3: 'Floating static routes are unicast next-hop routes, not broadcast flooding.'
    },
    difficulty: CourseLevel.INTERMEDIATE,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.SCENARIO,
    concept: 'Floating Static Route Architecture',
    points: 10
  },
  {
    quizId: 'quiz-routing-fundamentals-overview',
    lessonSlug: 'routing-fundamentals-overview',
    text: 'A router console displays: `ip route 10.10.0.0 255.255.0.0 192.168.1.254`. When testing, packets destined for `10.10.5.1` fail to forward and the route does NOT appear in `show ip route`. What is the most common reason?',
    options: [
      'The next-hop IP address `192.168.1.254` is not reachable via any active up/up interface on the router, preventing the route from being installed in the routing table',
      'Static routes cannot be used for IP addresses starting with 10',
      'The router requires a reboot after every static route command',
      'Subnet mask 255.255.0.0 cannot be used with Class A IP addresses'
    ],
    correctOption: 0,
    explanation: 'A static route is only installed into the active routing table if the next-hop IP address is resolvable and reachable via an interface that is in an "up/up" operational state. If the next-hop is unreachable, the router ignores the route.',
    explanationsJson: {
      1: 'Static routes support any valid IPv4 prefix, including 10.0.0.0/8 private space.',
      2: 'Static route changes take effect immediately in running memory without rebooting.',
      3: 'Classless routing (CIDR) allows any valid subnet mask with any IP address.'
    },
    difficulty: CourseLevel.INTERMEDIATE,
    cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
    questionType: QuestionType.TROUBLESHOOTING,
    concept: 'Static Route Next-Hop Reachability Validation',
    points: 10
  },

  // -------------------------------------------------------------------------
  // Topic 14: Switching & VLANs Overview
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-switching-vlans-overview',
    lessonSlug: 'switching-vlans-overview',
    text: 'What fundamental network problem do Virtual Local Area Networks (VLANs) solve in enterprise switching design?',
    options: [
      'They partition a single physical switch into multiple isolated logical Broadcast Domains at Layer 2, containing broadcast traffic and enforcing security segmentation',
      'They allow switches to replace physical electrical cables with wireless radio signals',
      'They automatically increase internet download speeds by 500%',
      'They eliminate the need for Layer 3 routers when routing between subnets'
    ],
    correctOption: 0,
    explanation: 'Without VLANs, all switch ports belong to one large broadcast domain, allowing broadcast storms and security snooping. VLANs logically segment the switch at Layer 2 into separate broadcast domains, requiring a router/L3 switch to route between them.',
    explanationsJson: {
      1: 'VLANs are Layer 2 logical partitions over wired switch hardware, not wireless conversions.',
      2: 'VLANs segment network traffic; they do not increase ISP WAN pipe speeds.',
      3: 'Inter-VLAN communication strictly requires a Layer 3 device (router or multilayer switch).'
    },
    difficulty: CourseLevel.INTERMEDIATE,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'VLAN Broadcast Domain Segmentation',
    points: 10
  },
  {
    quizId: 'quiz-switching-vlans-overview',
    lessonSlug: 'switching-vlans-overview',
    text: 'How does the IEEE 802.1Q standard identify which VLAN a frame belongs to when traversing an inter-switch Trunk link?',
    options: [
      'It inserts a 4-byte 802.1Q Tag into the Ethernet header containing a 12-bit VLAN Identifier (VLAN ID supporting 1 to 4094 VLANs)',
      'It changes the color of the physical fiber optic laser beam for each VLAN',
      'It prefixes the computer hostname to the start of the MAC address',
      'It replaces the IPv4 destination address with the VLAN number'
    ],
    correctOption: 0,
    explanation: 'IEEE 802.1Q inserts a 4-byte header (Tag Protocol ID 0x8100 + Tag Control Information with 3-bit Priority, 1-bit DEI, and 12-bit VLAN ID). The 12-bit VID field supports $2^{12} = 4096$ theoretical VLAN IDs (1-4094 usable).',
    explanationsJson: {
      1: 'Trunks multiplex frames digitally over the same physical optical/copper signal using 802.1Q tag fields.',
      2: 'MAC addresses are not modified with hostnames.',
      3: 'Layer 3 IP addresses remain intact inside the frame payload.'
    },
    difficulty: CourseLevel.INTERMEDIATE,
    cognitiveLevel: CognitiveLevel.RECALL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'IEEE 802.1Q 4-Byte Tag Structure',
    points: 10
  },
  {
    quizId: 'quiz-switching-vlans-overview',
    lessonSlug: 'switching-vlans-overview',
    text: 'What is the "Native VLAN" on an IEEE 802.1Q trunk port, and what happens to frames arriving on a trunk without an 802.1Q tag?',
    options: [
      'The Native VLAN (default VLAN 1) handles all untagged traffic traversing the trunk; any untagged frame received on a trunk port is automatically assigned to the Native VLAN',
      'The Native VLAN is a reserved VLAN where all packets are immediately discarded',
      'The Native VLAN is used exclusively for encrypted VoIP telephone traffic',
      'The Native VLAN requires all connected hosts to disable their network cards'
    ],
    correctOption: 0,
    explanation: 'By 802.1Q definition, the Native VLAN carries untagged traffic across a trunk. When a switch receives an untagged frame on a trunk interface, it places it into the configured Native VLAN (VLAN 1 by default).',
    explanationsJson: {
      1: 'Native VLAN traffic is actively switched and forwarded, not dropped.',
      2: 'VoIP typically uses a dedicated Voice VLAN with 802.1p CoS priority tagging, not untagged Native VLAN.',
      3: 'Native VLAN operates transparently without host reconfiguration.'
    },
    difficulty: CourseLevel.INTERMEDIATE,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Native VLAN Untagged Traffic Handling',
    points: 10
  },
  {
    quizId: 'quiz-switching-vlans-overview',
    lessonSlug: 'switching-vlans-overview',
    text: 'Workstation A in VLAN 10 (`192.168.10.5`) cannot ping Workstation B in VLAN 20 (`192.168.20.5`) connected to the same physical switch. No router or Layer 3 switch interface is configured. Why does communication fail?',
    options: [
      'Switches isolate Layer 2 broadcast domains between different VLANs; traffic cannot pass between different VLANs without a Layer 3 routing device (Router-on-a-Stick or Multilayer Switch SVI)',
      'VLAN 10 and VLAN 20 are using different brands of Ethernet cables',
      'Workstations in VLAN 20 cannot receive packets on odd-numbered days of the week',
      'The switch MAC address table is full'
    ],
    correctOption: 0,
    explanation: 'VLANs completely isolate Layer 2 broadcast and unicast traffic. Even on the same physical switch, hosts in different VLANs/subnets cannot communicate without an inter-VLAN routing mechanism (such as a router with subinterfaces or a Layer 3 switch SVI).',
    explanationsJson: {
      1: 'Cabling brands do not affect VLAN boundary enforcement.',
      2: 'VLAN segmentation is continuous and deterministic, not calendar-based.',
      3: 'Inter-VLAN traffic separation is a core security feature of VLANs, not a CAM table capacity defect.'
    },
    difficulty: CourseLevel.INTERMEDIATE,
    cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
    questionType: QuestionType.TROUBLESHOOTING,
    concept: 'Inter-VLAN Routing Requirement',
    points: 10
  },

  // -------------------------------------------------------------------------
  // Topic 15: Network Security Basics Overview
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-network-security-basics-overview',
    lessonSlug: 'network-security-basics-overview',
    text: 'What are the three pillars of the foundational "CIA Triad" in information and network security?',
    options: [
      'Confidentiality (privacy/encryption), Integrity (data accuracy/hashing), Availability (reliable uptime/redundancy)',
      'Centralization, Internet, Authentication',
      'Cabling, Inspection, Antivirus',
      'Control, Isolation, Automation'
    ],
    correctOption: 0,
    explanation: 'The CIA Triad is the cornerstone of information security: Confidentiality ensures only authorized entities view data; Integrity ensures data is not altered in transit; Availability ensures resources are accessible when needed.',
    explanationsJson: {
      1: 'Centralization/Internet/Authentication are security concepts, but not the CIA Triad.',
      2: 'Cabling/Inspection/Antivirus are tactical tools, not the foundational security triad.',
      3: 'Control/Isolation/Automation are operational principles, not the CIA triad.'
    },
    difficulty: CourseLevel.INTERMEDIATE,
    cognitiveLevel: CognitiveLevel.RECALL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'CIA Triad Fundamentals',
    points: 10
  },
  {
    quizId: 'quiz-network-security-basics-overview',
    lessonSlug: 'network-security-basics-overview',
    text: 'How does a Distributed Denial of Service (DDoS) attack differ fundamentally from a standard single-source Denial of Service (DoS) attack?',
    options: [
      'A DDoS attack leverages a distributed botnet of thousands of compromised hosts (zombies) to flood target bandwidth or server resources simultaneously from multiple geographical vectors',
      'A DDoS attack physically cuts the underwater fiber optic cables with a ship anchor',
      'A DDoS attack only targets desktop printers and leaves web servers unaffected',
      'A DDoS attack only operates over analog telephone modem lines'
    ],
    correctOption: 0,
    explanation: 'In a DDoS attack, an attacker uses a command-and-control (C2) server to orchestrate a distributed botnet of compromised systems, overwhelming the target with massive distributed traffic volume that cannot be blocked by a single IP filter.',
    explanationsJson: {
      1: 'DDoS is a cyber network traffic flooding attack, not physical cable cutting.',
      2: 'DDoS attacks routinely target enterprise web servers, firewalls, and DNS infrastructure.',
      3: 'DDoS attacks utilize high-speed broadband and cloud infrastructure across the Internet.'
    },
    difficulty: CourseLevel.INTERMEDIATE,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'DDoS Botnet Architecture',
    points: 10
  },
  {
    quizId: 'quiz-network-security-basics-overview',
    lessonSlug: 'network-security-basics-overview',
    text: 'What security principle dictates that network users and administrators should be granted only the absolute minimum permissions and access levels necessary to complete their specific job functions?',
    options: [
      'Principle of Least Privilege (PoLP)',
      'Principle of Open Access',
      'Defense in Depth',
      'Non-Repudiation'
    ],
    correctOption: 0,
    explanation: 'The Principle of Least Privilege limits user and system access rights to the bare minimum needed for legitimate operational duties, minimizing attack surfaces and containing the damage of compromised credentials.',
    explanationsJson: {
      1: 'Open access violates security best practices by granting unrestricted permissions.',
      2: 'Defense in Depth employs layered security controls, not specifically individual permission scoping.',
      3: 'Non-repudiation guarantees that an author cannot deny the authenticity of their signature or message.'
    },
    difficulty: CourseLevel.INTERMEDIATE,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Principle of Least Privilege',
    points: 10
  },
  {
    quizId: 'quiz-network-security-basics-overview',
    lessonSlug: 'network-security-basics-overview',
    text: 'An enterprise security analyst discovers that an attacker is performing a "Man-in-the-Middle" (MitM) attack on an unencrypted HTTP Wi-Fi connection, reading plaintext employee session cookies. What cryptographic protocol will immediately eliminate this vulnerability?',
    options: [
      'Enforce HTTPS (HTTP over TLS/SSL) with strict HSTS (HTTP Strict Transport Security) encryption end-to-end',
      'Increase the Wi-Fi router transmit power to maximum wattage',
      'Configure the web server to use UDP instead of TCP',
      'Change the workstation desktop background wallpaper'
    ],
    correctOption: 0,
    explanation: 'HTTPS encrypts application layer HTTP traffic using Transport Layer Security (TLS). Even if an attacker intercepts the raw packets via a MitM attack on public Wi-Fi, the payload is indecipherable ciphertext, protecting session tokens.',
    explanationsJson: {
      1: 'Increasing Wi-Fi power expands the radio footprint, making eavesdropping easier for distant attackers.',
      2: 'Switching to UDP does not provide cryptographic encryption.',
      3: 'Wallpaper is a visual cosmetic setting with zero cryptographic effect.'
    },
    difficulty: CourseLevel.INTERMEDIATE,
    cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
    questionType: QuestionType.TROUBLESHOOTING,
    concept: 'MitM Eavesdropping & TLS Mitigation',
    points: 10
  },

  // -------------------------------------------------------------------------
  // Topic 16: Firewalls & ACLs Overview
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-firewalls-acls-overview',
    lessonSlug: 'firewalls-acls-overview',
    text: 'What is the primary operational difference between a Standard Access Control List (ACL) and an Extended ACL in IPv4 networking?',
    options: [
      'Standard ACLs (1-99) filter traffic based solely on Source IPv4 Address and should be placed close to the destination; Extended ACLs (100-199) filter based on Source/Destination IP, Protocol, and Port numbers, and should be placed close to the source',
      'Standard ACLs only work on Sundays, while Extended ACLs work all week',
      'Standard ACLs encrypt traffic, while Extended ACLs compress traffic',
      'Standard ACLs operate at Layer 7, while Extended ACLs operate at Layer 1'
    ],
    correctOption: 0,
    explanation: 'Standard ACLs (1-99 / 1300-1999) only evaluate source IP addresses (placed near destination to avoid blocking valid paths). Extended ACLs (100-199 / 2000-2699) evaluate source IP, destination IP, protocol (TCP/UDP/ICMP), and port numbers (placed near source).',
    explanationsJson: {
      1: 'ACLs operate continuously unless time-based ACL schedules are specifically configured.',
      2: 'ACLs are packet-filtering match/drop rules; they do not perform encryption or compression.',
      3: 'Standard and Extended ACLs operate at Layers 3 and 4.'
    },
    difficulty: CourseLevel.INTERMEDIATE,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Standard vs Extended ACL Comparison',
    points: 10
  },
  {
    quizId: 'quiz-firewalls-acls-overview',
    lessonSlug: 'firewalls-acls-overview',
    text: 'How does an IPv4 "Wildcard Mask" operate when matching IP address ranges in an Access Control List?',
    options: [
      'Binary 0 bits in the wildcard mask indicate "must match exactly", while binary 1 bits indicate "ignore / don’t care" (e.g. 0.0.0.255 matches the entire /24 subnet)',
      'Binary 1 bits indicate "must match exactly" and binary 0 bits indicate "ignore"',
      'Wildcard masks randomly invert every packet payload byte',
      'Wildcard masks only match alphabet characters in hostnames'
    ],
    correctOption: 0,
    explanation: 'Wildcard masks invert subnet mask logic: 0 = match bit strictly, 1 = don’t care (wildcard bit). For example, IP 192.168.1.0 with wildcard mask 0.0.0.255 matches any IP where the first 24 bits are 192.168.1 and the last 8 bits can be anything.',
    explanationsJson: {
      1: 'Binary 1 matching and 0 ignoring describes a standard Subnet Mask, which is the exact inverse of a Wildcard Mask.',
      2: 'Wildcard masks are logical matching bitmasks used in ACL evaluation; they do not alter packet payloads.',
      3: 'Wildcard masks operate strictly on 32-bit binary IPv4 addresses, not domain name strings.'
    },
    difficulty: CourseLevel.INTERMEDIATE,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Wildcard Mask Bit Logic',
    points: 10
  },
  {
    quizId: 'quiz-firewalls-acls-overview',
    lessonSlug: 'firewalls-acls-overview',
    text: 'What invisible rule is automatically appended by default to the very bottom of every Cisco Access Control List (ACL)?',
    options: [
      'An Implicit Deny All (`deny ip any any`) dropping all traffic that did not match an earlier permit statement',
      'An Implicit Permit All allowing all remaining traffic to pass through',
      'An automatic command to reboot the router every midnight',
      'An automatic email alert sent to the network administrator'
    ],
    correctOption: 0,
    explanation: 'Every ACL terminates with an invisible "Implicit Deny All" (`deny ip any any`). If a packet does not explicitly match any configured `permit` rule as the ACL is evaluated top-down, it is dropped silently at the end.',
    explanationsJson: {
      1: 'An implicit permit all would negate ACL security enforcement; default security posture is implicit deny.',
      2: 'ACLs are packet-filtering engines; they do not trigger router hardware reboots.',
      3: 'Implicit deny drops packets silently without generating automated emails.'
    },
    difficulty: CourseLevel.INTERMEDIATE,
    cognitiveLevel: CognitiveLevel.RECALL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Implicit Deny All Rule',
    points: 10
  },
  {
    quizId: 'quiz-firewalls-acls-overview',
    lessonSlug: 'firewalls-acls-overview',
    text: 'Why does a Stateful Inspection Firewall provide significantly superior security compared to a Stateless Packet-Filtering Router ACL?',
    options: [
      'A stateful firewall tracks active TCP connection states (SYN, ESTABLISHED) and dynamic port mappings in a State Table, automatically permitting return traffic without opening broad inbound ports',
      'A stateful firewall does not require an electrical power source to operate',
      'A stateless router ACL can only inspect traffic written in the French language',
      'A stateful firewall automatically deletes all incoming emails'
    ],
    correctOption: 0,
    explanation: 'Stateless ACLs evaluate packets in isolation without context. Stateful firewalls maintain a dynamic State Table tracking established bidirectional sessions; when an internal host makes an outbound web request, the firewall dynamically permits the inbound return traffic only for that specific active session.',
    explanationsJson: {
      1: 'Stateful firewalls are active hardware/software appliances requiring electrical power.',
      2: 'Stateless ACLs evaluate IP headers and port numbers regardless of natural languages.',
      3: 'Firewalls inspect and filter traffic based on security policies, not indiscriminately deleting valid emails.'
    },
    difficulty: CourseLevel.INTERMEDIATE,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Stateful Firewall vs Stateless ACL',
    points: 10
  },

  // -------------------------------------------------------------------------
  // Topic 17: NAT & PAT Overview
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-nat-pat-overview',
    lessonSlug: 'nat-pat-overview',
    text: 'In Cisco NAT terminology, what are the exact definitions of "Inside Local" and "Inside Global" addresses?',
    options: [
      'Inside Local: The private IPv4 address assigned to a host on the internal private network (e.g. 192.168.1.10); Inside Global: The globally routable public IPv4 address assigned by the ISP representing the internal host to the outside Internet',
      'Inside Local: The public web server IP; Inside Global: The internal switch MAC address',
      'Inside Local: The default gateway IP address; Inside Global: The client RAM memory address',
      'Inside Local and Inside Global are exact synonyms with identical meanings'
    ],
    correctOption: 0,
    explanation: 'Inside Local is the private RFC 1918 address inside the enterprise. Inside Global is the public routable address (owned by the enterprise/ISP) that appears in the source IP field of packets after NAT translation on the WAN.',
    explanationsJson: {
      1: 'Inside Local represents the internal private client, not the public web server.',
      2: 'Inside Global is an IPv4 address, not a RAM memory pointer.',
      3: 'Inside Local and Inside Global represent two distinct perspectives (private inside vs public outside).'
    },
    difficulty: CourseLevel.ADVANCED,
    cognitiveLevel: CognitiveLevel.RECALL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Cisco NAT Address Terminology',
    points: 10
  },
  {
    quizId: 'quiz-nat-pat-overview',
    lessonSlug: 'nat-pat-overview',
    text: 'How does Port Address Translation (PAT / NAT Overload) enable hundreds of internal private LAN workstations to concurrently access the public Internet using a single shared public IPv4 address?',
    options: [
      'By multiplexing connections using unique source Layer 4 TCP/UDP Port numbers in the NAT translation state table',
      'By dividing the public IP address into fractional decimal numbers',
      'By converting all web traffic into analog radio broadcasts',
      'By assigning each user a different color Ethernet cable'
    ],
    correctOption: 0,
    explanation: 'PAT (NAT Overload) tracks outbound flows by assigning a unique Layer 4 source port (e.g. `203.0.113.5:52001` for PC 1, `203.0.113.5:52002` for PC 2). When return traffic arrives, the router inspects the destination port to demultiplex the packet back to the correct private IP.',
    explanationsJson: {
      1: 'IPv4 addresses are 32-bit discrete integers and cannot be divided into fractional decimal values.',
      2: 'PAT is a software translation engine running inside router/firewall ASICs, not radio broadcast.',
      3: 'Cable coloring has no impact on transport layer port multiplexing.'
    },
    difficulty: CourseLevel.ADVANCED,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'PAT (NAT Overload) Port Multiplexing',
    points: 10
  },
  {
    quizId: 'quiz-nat-pat-overview',
    lessonSlug: 'nat-pat-overview',
    text: 'What type of NAT is required when an internal private web server (`192.168.1.100`) must be permanently accessible from the public Internet via a dedicated public IP (`203.0.113.25`)?',
    options: [
      'Static NAT (one-to-one permanent mapping between private and public IP)',
      'Dynamic NAT pool with random ephemeral assignments',
      'PAT Overload with random port selection',
      'NAT64 protocol translation'
    ],
    correctOption: 0,
    explanation: 'Static NAT creates a fixed, permanent 1-to-1 mapping between a specific internal private IP and a specific external public IP, allowing external inbound connections to initiate reachability to the internal server.',
    explanationsJson: {
      1: 'Dynamic NAT maps from a temporary pool on a first-come, first-served basis; incoming external connections cannot predict the server temporary IP.',
      2: 'PAT overload multiplexes outbound connections and does not provide an open static 1-to-1 public IP.',
      3: 'NAT64 translates IPv6 to IPv4, not static IPv4 to IPv4.'
    },
    difficulty: CourseLevel.ADVANCED,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.SCENARIO,
    concept: 'Static 1-to-1 NAT for Public Servers',
    points: 10
  },
  {
    quizId: 'quiz-nat-pat-overview',
    lessonSlug: 'nat-pat-overview',
    text: 'An engineer executes `show ip nat translations` on an edge gateway router and sees 65,000 active translation table entries. New users report they cannot open any websites. What has occurred and how is it resolved?',
    options: [
      'NAT Port Exhaustion: All available source TCP/UDP ports on the single public IP address have been exhausted; resolved by configuring a dynamic NAT pool with multiple public IP addresses',
      'The router flash memory card has melted',
      'The DNS server has run out of letters in the alphabet',
      'All workstations have been infected with a hardware virus'
    ],
    correctOption: 0,
    explanation: 'A single IPv4 address has approximately 65,535 transport ports. If active concurrent connections exceed available ports (due to heavy traffic, P2P, or malware), new connections are dropped. Adding a pool of multiple public IPs provides additional port capacity (65k ports per IP).',
    explanationsJson: {
      1: 'NAT port exhaustion is a logical transport state limit, not physical hardware melting.',
      2: 'DNS uses standardized string encoding without alphabet depletion.',
      3: 'NAT exhaustion occurs from high concurrent socket volume, not hardware virus corruption.'
    },
    difficulty: CourseLevel.ADVANCED,
    cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
    questionType: QuestionType.TROUBLESHOOTING,
    concept: 'NAT Port Exhaustion Diagnosis',
    points: 10
  },

  // -------------------------------------------------------------------------
  // Topic 18: VPN & Cryptography Overview
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-vpn-cryptography-overview',
    lessonSlug: 'vpn-cryptography-overview',
    text: 'What are the two primary protocols in the IPsec protocol suite, and what security services do they provide?',
    options: [
      'Encapsulating Security Payload (ESP) provides confidentiality (encryption), integrity, and authentication; Authentication Header (AH) provides integrity and authentication but NO encryption',
      'TCP provides encryption and UDP provides authentication',
      'HTTP provides integrity and FTP provides confidentiality',
      'AES provides routing and RSA provides physical cabling'
    ],
    correctOption: 0,
    explanation: 'IPsec contains: 1. ESP (IP Protocol 50) which provides symmetric encryption (confidentiality), authentication, and anti-replay; 2. AH (IP Protocol 51) which provides digital signing/integrity over the whole packet but zero encryption.',
    explanationsJson: {
      1: 'TCP and UDP are unencrypted Layer 4 transport protocols.',
      2: 'HTTP and FTP are unencrypted legacy Layer 7 application protocols.',
      3: 'AES and RSA are cryptographic algorithms, not routing or cabling protocols.'
    },
    difficulty: CourseLevel.ADVANCED,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'IPsec Architecture (ESP vs AH)',
    points: 10
  },
  {
    quizId: 'quiz-vpn-cryptography-overview',
    lessonSlug: 'vpn-cryptography-overview',
    text: 'What are the roles of IKE (Internet Key Exchange) Phase 1 and Phase 2 during the establishment of a site-to-site IPsec VPN tunnel?',
    options: [
      'IKE Phase 1 authenticates the two VPN gateway peers and establishes a secure control channel (ISAKMP SA); IKE Phase 2 negotiates the IPsec transform sets and establishes unidirectional data tunnels (IPsec SAs)',
      'Phase 1 routes the data packets and Phase 2 uninstalls the operating system',
      'Phase 1 creates the Ethernet cabling and Phase 2 converts digital signals to analog',
      'Phase 1 is only for wireless laptops and Phase 2 is only for wired desktops'
    ],
    correctOption: 0,
    explanation: 'IKE Phase 1 (Main/Aggressive mode) negotiates encryption/hash/DH group to create the secure management tunnel (ISAKMP SA). IKE Phase 2 (Quick mode) uses that secure tunnel to negotiate data encryption keys and create the IPsec SAs that protect user traffic.',
    explanationsJson: {
      1: 'IKE is a key exchange security protocol, not an OS uninstaller.',
      2: 'IKE operates at Layer 5/7 over UDP port 500/4500, not physical cabling.',
      3: 'IKE Phase 1 and 2 apply universally to all IPsec VPN endpoints.'
    },
    difficulty: CourseLevel.ADVANCED,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'IKE Phase 1 vs Phase 2 Negotiation',
    points: 10
  },
  {
    quizId: 'quiz-vpn-cryptography-overview',
    lessonSlug: 'vpn-cryptography-overview',
    text: 'How does Diffie-Hellman (DH) Key Exchange allow two VPN routers across the public Internet to securely establish a shared secret key without ever transmitting that secret key across the wire?',
    options: [
      'Through asymmetric mathematical modular arithmetic (discrete logarithm problem), where each peer combines its own private key with the other peer public key to derive the exact same shared secret',
      'By emailing the secret password in an encrypted ZIP file',
      'By broadcasting the private key over UDP port 80',
      'By having a human courier physically deliver a USB key to the remote datacenter'
    ],
    correctOption: 0,
    explanation: 'Diffie-Hellman allows two parties with no prior shared secret to independently compute an identical shared secret key over an insecure public channel using public key exchanges combined with private mathematical exponents.',
    explanationsJson: {
      1: 'Emailing passwords over insecure channels violates cryptographic key exchange principles.',
      2: 'Broadcasting private keys completely destroys cryptographic security.',
      3: 'DH is automated mathematical key negotiation that eliminates the need for manual physical couriers.'
    },
    difficulty: CourseLevel.ADVANCED,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Diffie-Hellman Key Exchange Mechanics',
    points: 10
  },
  {
    quizId: 'quiz-vpn-cryptography-overview',
    lessonSlug: 'vpn-cryptography-overview',
    text: 'An IPsec site-to-site VPN fails to establish. The router logs state: `IKE Phase 1 negotiation failed: Peer proposal mismatch (Transform Set rejected)`. What is the immediate troubleshooting step?',
    options: [
      'Verify that both VPN gateway routers have identical Phase 1 parameters: Encryption algorithm (e.g. AES-256), Hash algorithm (e.g. SHA-256), Authentication method (e.g. Pre-Shared Key), and Diffie-Hellman Group (e.g. Group 14)',
      'Replace all Cat6 Ethernet cables with coaxial cables',
      'Disable the firewall on all client workstations',
      'Change the subnet mask on the router to 255.0.0.0'
    ],
    correctOption: 0,
    explanation: 'A proposal mismatch in Phase 1 means the two gateway routers have conflicting policy parameters. Both endpoints must agree on the exact same encryption cipher, hash function, authentication PSK/cert, and DH group number.',
    explanationsJson: {
      1: 'Proposal mismatch is a cryptographic policy configuration error, not a physical cable defect.',
      2: 'Client firewalls have no effect on gateway router-to-router IKE Phase 1 ISAKMP negotiations.',
      3: 'Altering subnet masks will break IP routing without resolving cryptographic cipher mismatches.'
    },
    difficulty: CourseLevel.ADVANCED,
    cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
    questionType: QuestionType.TROUBLESHOOTING,
    concept: 'IPsec Phase 1 Proposal Mismatch Diagnosis',
    points: 10
  },

  // -------------------------------------------------------------------------
  // Topic 19: Wireless Networking Overview
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-wireless-networking-overview',
    lessonSlug: 'wireless-networking-overview',
    text: 'Which media access control mechanism is used by IEEE 802.11 Wi-Fi networks to manage shared half-duplex radio frequency channels?',
    options: [
      'CSMA/CA (Carrier Sense Multiple Access with Collision Avoidance)',
      'CSMA/CD (Carrier Sense Multiple Access with Collision Detection)',
      'Token Ring Passing',
      'Polling by the Root Bridge'
    ],
    correctOption: 0,
    explanation: 'Because wireless radios cannot transmit and receive simultaneously on the same channel (making it impossible to detect electrical collisions during transmission), 802.11 uses CSMA/CA (Collision Avoidance) with random backoff timers and optional RTS/CTS frames.',
    explanationsJson: {
      1: 'CSMA/CD is used on wired half-duplex Ethernet (802.3), not wireless 802.11.',
      2: 'Token Ring is a legacy IEEE 802.5 token-passing protocol.',
      3: 'Root Bridge is a Spanning Tree Protocol (802.1D) concept, not a wireless MAC arbitration method.'
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.RECALL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'CSMA/CA Wireless Channel Access',
    points: 10
  },
  {
    quizId: 'quiz-wireless-networking-overview',
    lessonSlug: 'wireless-networking-overview',
    text: 'What are the three non-overlapping 20 MHz channels available in the standard 2.4 GHz ISM wireless band in North America?',
    options: [
      'Channels 1, 6, and 11',
      'Channels 1, 2, and 3',
      'Channels 36, 40, and 44',
      'Channels 12, 13, and 14'
    ],
    correctOption: 0,
    explanation: 'In the 2.4 GHz spectrum, channels are spaced 5 MHz apart but require 20 MHz channel width. Only channels 1, 6, and 11 have zero spectral overlap, allowing adjacent access points to operate without co-channel interference.',
    explanationsJson: {
      1: 'Channels 1, 2, and 3 heavily overlap each other, causing severe co-channel interference and packet loss.',
      2: 'Channels 36, 40, and 44 are in the 5 GHz UNII-1 band, not the 2.4 GHz ISM band.',
      3: 'Channels 12, 13, and 14 are restricted or prohibited in North American regulatory domains.'
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.RECALL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: '2.4 GHz Non-Overlapping Channels (1, 6, 11)',
    points: 10
  },
  {
    quizId: 'quiz-wireless-networking-overview',
    lessonSlug: 'wireless-networking-overview',
    text: 'What is the "Hidden Node Problem" in 802.11 wireless networks, and what protocol mechanism resolves it?',
    options: [
      'Two wireless clients are both in range of the Access Point but out of radio range of each other, causing them to transmit simultaneously and collide at the AP; resolved using RTS/CTS (Request to Send / Clear to Send) frame exchanges',
      'An attacker hides behind a concrete pillar to intercept passwords',
      'The access point hides its SSID so nobody can find it',
      'A computer has disconnected its antenna cable'
    ],
    correctOption: 0,
    explanation: 'When Client A and Client B cannot hear each other, standard carrier sensing fails. RTS/CTS resolves this: Client A sends RTS; the AP broadcasts CTS (which includes a duration timer); Client B hears the CTS and pauses transmission while Client A transmits.',
    explanationsJson: {
      1: 'Hidden node refers to RF transmission range geometry between wireless clients, not physical physical hide-and-seek.',
      2: 'Hiding an SSID is beacon suppression, not the hidden node problem.',
      3: 'Disconnected antenna causes hardware RF loss, not hidden node multi-client collisions.'
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Hidden Node Problem & RTS/CTS',
    points: 10
  },
  {
    quizId: 'quiz-wireless-networking-overview',
    lessonSlug: 'wireless-networking-overview',
    text: 'Why is WPA3-Personal (SAE) significantly more secure than legacy WPA2-Personal (PSK)?',
    options: [
      'WPA3 replaces the vulnerable 4-way PSK handshake with Simultaneous Authentication of Equals (SAE / Dragonfly handshake), providing forward secrecy and rendering offline dictionary / brute-force password cracking attacks impossible',
      'WPA3 eliminates the need for passwords completely by reading user brainwaves',
      'WPA3 forces all wireless transmissions to be converted into wired copper cables',
      'WPA3 restricts Wi-Fi connections to a maximum of 1 meter distance'
    ],
    correctOption: 0,
    explanation: 'In WPA2-PSK, an attacker capturing the 4-way handshake can perform offline brute-force dictionary attacks. WPA3 uses SAE (Simultaneous Authentication of Equals), which uses zero-knowledge proofs where passive eavesdroppers gain zero data to perform offline dictionary attacks.',
    explanationsJson: {
      1: 'WPA3 uses standard alphanumeric pre-shared passwords with modern cryptographic handshakes.',
      2: 'WPA3 is a wireless RF protocol; it does not convert wireless into copper.',
      3: 'WPA3 operates across standard wireless ranges (tens of meters).'
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'WPA3 SAE vs WPA2 PSK Security',
    points: 10
  },

  // -------------------------------------------------------------------------
  // Topic 20: Network Troubleshooting Overview
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-network-troubleshooting-overview',
    lessonSlug: 'network-troubleshooting-overview',
    text: 'When executing a ping diagnostic, what is the critical technical distinction between receiving "Destination Host Unreachable" versus "Request Timed Out"?',
    options: [
      '"Destination Host Unreachable" means an intermediate router on the path actively responded with an ICMP Type 3 error indicating it has no route or ARP failed; "Request Timed Out" means the packet was forwarded but no response was received before the timer expired (dropped by firewall or target down)',
      '"Destination Host Unreachable" means the computer has no power; "Request Timed Out" means the hard drive is full',
      '"Destination Host Unreachable" indicates a successful connection; "Request Timed Out" indicates an invalid password',
      'There is no difference; both messages are generated randomly by Windows'
    ],
    correctOption: 0,
    explanation: '"Destination Host Unreachable" is an active ICMP error message generated by a gateway router when it cannot route the packet or cannot resolve the target via ARP. "Request Timed Out" is a silent timeout where the sender received zero response (target host offline or dropping ICMP).',
    explanationsJson: {
      1: 'Unreachable and timeout are network layer diagnostic telemetry, not power/disk errors.',
      2: 'Neither message indicates success; both describe distinct network failure modes.',
      3: 'ICMP error messages are deterministic RFC standards, not random strings.'
    },
    difficulty: CourseLevel.ADVANCED,
    cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
    questionType: QuestionType.TROUBLESHOOTING,
    concept: 'ICMP Unreachable vs Timeout Diagnosis',
    points: 10
  },
  {
    quizId: 'quiz-network-troubleshooting-overview',
    lessonSlug: 'network-troubleshooting-overview',
    text: 'A user reports: "I can access websites by typing their IP addresses in the browser (e.g. http://93.184.216.34), but typing domain names (e.g. http://example.com) fails immediately." What is the root cause?',
    options: [
      'DNS resolution failure (DNS server IP is misconfigured, unreachable, or DNS service is down on the resolver)',
      'The physical Ethernet cable has experienced Layer 1 signal attenuation',
      'The Default Gateway router is powered off',
      'The web server has blocked the client IP address'
    ],
    correctOption: 0,
    explanation: 'Browsing by IP succeeds, proving Layer 1 cabling, Layer 2 switching, Layer 3 IP routing, Layer 4 TCP transport, and Layer 7 HTTP are all working 100%. Failure by domain name isolates the issue strictly to DNS name resolution failure.',
    explanationsJson: {
      1: 'Physical cabling works because browsing by IP succeeded.',
      2: 'Default gateway routing works because packets reached 93.184.216.34.',
      3: 'The web server answered HTTP requests successfully when queried by IP.'
    },
    difficulty: CourseLevel.ADVANCED,
    cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
    questionType: QuestionType.TROUBLESHOOTING,
    concept: 'DNS Resolution Isolation',
    points: 10
  },
  {
    quizId: 'quiz-network-troubleshooting-overview',
    lessonSlug: 'network-troubleshooting-overview',
    text: 'What network diagnostic command is used on modern Linux systems to display listening TCP/UDP sockets, active socket connections, and process IDs (replacing legacy `netstat`)?',
    options: [
      '`ss -tulpn`',
      '`ping -c 4`',
      '`traceroute -n`',
      '`chmod 777`'
    ],
    correctOption: 0,
    explanation: '`ss` (Socket Statistics) is the modern high-performance Linux replacement for `netstat`. The flags `-tulpn` display: `-t` (TCP), `-u` (UDP), `-l` (listening sockets), `-p` (process name/PID), `-n` (numeric ports).',
    explanationsJson: {
      1: '`ping` sends ICMP echo requests, it does not inspect local kernel socket tables.',
      2: '`traceroute` maps hop-by-hop router paths, not local listening sockets.',
      3: '`chmod` alters filesystem file permissions, unrelated to network sockets.'
    },
    difficulty: CourseLevel.ADVANCED,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.COMMAND_INTERPRETATION,
    concept: 'Linux Socket Statistics (ss tool)',
    points: 10
  },
  {
    quizId: 'quiz-network-troubleshooting-overview',
    lessonSlug: 'network-troubleshooting-overview',
    text: 'A user connects over an IPsec VPN. Small web pages and ping tests work perfectly, but transferring large files or opening heavy HTTPS portals freezes and hangs indefinitely. What issue is causing this symptom?',
    options: [
      'Path MTU Discovery (PMTUD) failure / MTU Black Hole: IPsec header encapsulation overhead causes packets to exceed physical MTU (1500 bytes), and an intermediate router is silently dropping packets with DF=1 without returning ICMP Fragmentation Needed messages',
      'The client computer does not have enough disk space to open HTTPS pages',
      'The Ethernet switch is converting TCP packets into analog audio signals',
      'The VPN server requires an immediate operating system reinstallation'
    ],
    correctOption: 0,
    explanation: 'VPN encapsulation adds ESP/IP headers (up to 50+ bytes). When large packets hit 1500 bytes MTU with the Don’t Fragment (DF) flag set, routers drop them. If ICMP Type 3 Code 4 is blocked by firewalls, an "MTU Black Hole" occurs; resolved by lowering MSS (`ip tcp adjust-mss 1360`).',
    explanationsJson: {
      1: 'Disk space has no bearing on network socket packet transmission.',
      2: 'Switches do not convert packets to audio.',
      3: 'MTU black holes are network layer MTU/MSS configuration issues, not OS corruption.'
    },
    difficulty: CourseLevel.ADVANCED,
    cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
    questionType: QuestionType.TROUBLESHOOTING,
    concept: 'MTU Black Hole & MSS Clamping Diagnosis',
    points: 10
  },

  // -------------------------------------------------------------------------
  // Topic 21: SDN & Cloud Networking Overview
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-sdn-cloud-networking-overview',
    lessonSlug: 'sdn-cloud-networking-overview',
    text: 'What fundamental architectural separation defines Software-Defined Networking (SDN)?',
    options: [
      'The decoupling of the Control Plane (routing decision logic and policy) from the Data/Forwarding Plane (high-speed hardware packet switching ASICs), centralizing control in a programmable SDN controller',
      'The replacement of physical routers with paper documentation',
      'The elimination of all IP addresses in favor of human usernames',
      'The requirement that all networks run on battery power'
    ],
    correctOption: 0,
    explanation: 'SDN separates the Control Plane (which decides how packets should flow, centralized in an SDN controller) from the Data Plane (switches and routers that simply execute hardware forwarding instructions via OpenFlow/P4).',
    explanationsJson: {
      1: 'SDN is digital software-driven network automation, not paper documentation.',
      2: 'SDN networks operate on standard Layer 2/3 IP and overlay architectures.',
      3: 'SDN controllers and hardware switches run on standard enterprise power infrastructure.'
    },
    difficulty: CourseLevel.ADVANCED,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'SDN Control Plane vs Data Plane Decoupling',
    points: 10
  },
  {
    quizId: 'quiz-sdn-cloud-networking-overview',
    lessonSlug: 'sdn-cloud-networking-overview',
    text: 'In SDN architectural terminology, what is the difference between "Northbound APIs" and "Southbound APIs"?',
    options: [
      'Northbound APIs allow applications and orchestration systems to communicate with the SDN Controller; Southbound APIs (e.g. OpenFlow, NETCONF) allow the SDN Controller to program the underlying physical/virtual data plane forwarding devices',
      'Northbound APIs connect to devices in North America, while Southbound APIs connect to South America',
      'Northbound APIs operate over fiber optic cables, while Southbound APIs operate over copper',
      'Northbound APIs are only used for audio, while Southbound APIs are only used for video'
    ],
    correctOption: 0,
    explanation: 'In the SDN architecture stack: Northbound APIs (REST, gRPC) sit above the controller connecting to business applications; Southbound APIs (OpenFlow, NETCONF, OVSDB) sit below the controller connecting down to data plane switches.',
    explanationsJson: {
      1: 'Northbound and Southbound represent architectural abstraction layers in a software diagram, not geographical continents.',
      2: 'APIs are software protocols independent of physical fiber/copper media.',
      3: 'APIs manage network forwarding state, not raw media streaming.'
    },
    difficulty: CourseLevel.ADVANCED,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'SDN Northbound vs Southbound APIs',
    points: 10
  },
  {
    quizId: 'quiz-sdn-cloud-networking-overview',
    lessonSlug: 'sdn-cloud-networking-overview',
    text: 'What overlay network encapsulation protocol is widely used in modern cloud datacenters to encapsulate Layer 2 Ethernet frames inside Layer 3 UDP packets, expanding VLAN limits from 4,094 up to 16 million virtual networks?',
    options: [
      'VXLAN (Virtual Extensible LAN) using a 24-bit VXLAN Network Identifier (VNI)',
      'Legacy IEEE 802.1D Spanning Tree',
      'Serial Line Internet Protocol (SLIP)',
      'Analog Coaxial Cable Bridging'
    ],
    correctOption: 0,
    explanation: 'VXLAN encapsulates Layer 2 Ethernet frames inside Layer 3 UDP packets (port 4789). Its 24-bit VNI supports $2^{24} = 16,777,216$ isolated virtual broadcast domains, overcoming the 4,094 VLAN limit in multi-tenant cloud environments.',
    explanationsJson: {
      1: '802.1D STP is a legacy loop prevention protocol with no cloud overlay encapsulation capability.',
      2: 'SLIP is an obsolete point-to-point serial protocol from the 1980s.',
      3: 'Coaxial bridging is legacy physical layer hardware.'
    },
    difficulty: CourseLevel.ADVANCED,
    cognitiveLevel: CognitiveLevel.RECALL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'VXLAN Cloud Overlay Architecture',
    points: 10
  },
  {
    quizId: 'quiz-sdn-cloud-networking-overview',
    lessonSlug: 'sdn-cloud-networking-overview',
    text: 'In a public cloud provider (such as AWS VPC or Azure VNet), how do Cloud Security Groups differ from Cloud Network Access Control Lists (NACLs)?',
    options: [
      'Security Groups are Stateful firewalls applied at the virtual network interface (ENI/VM) level; NACLs are Stateless firewalls applied at the Subnet boundary level',
      'Security Groups only block DNS traffic, while NACLs block all electricity',
      'Security Groups operate at Layer 1, while NACLs operate at Layer 7',
      'There is no difference; they are exact identical duplicates'
    ],
    correctOption: 0,
    explanation: 'In cloud architectures: Security Groups operate at the virtual instance/NIC level and are stateful (return traffic automatically permitted). NACLs operate at the subnet boundary and are stateless (inbound and outbound rules must be explicitly defined).',
    explanationsJson: {
      1: 'Security Groups and NACLs filter Layer 3/4 network traffic, not electrical utility power.',
      2: 'Both Security Groups and NACLs operate at Layers 3 and 4.',
      3: 'They are fundamentally different in statefulness (stateful vs stateless) and scope (instance vs subnet).'
    },
    difficulty: CourseLevel.ADVANCED,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.SCENARIO,
    concept: 'Cloud Security Groups vs Subnet NACLs',
    points: 10
  },

  // =========================================================================
  // 3. 5 BENCHMARK EXPANDED ASSESSMENTS (5 Quizzes x 6 Questions = 30 Questions)
  // =========================================================================

  // -------------------------------------------------------------------------
  // Benchmark 1: NET-101 (Bits, Bytes, Binary & Hexadecimal)
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-net-101-bits-bytes-binary-hex',
    lessonSlug: 'net-101-bits-bytes-binary-hex',
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
    points: 10,
  },
  {
    quizId: 'quiz-net-101-bits-bytes-binary-hex',
    lessonSlug: 'net-101-bits-bytes-binary-hex',
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
    points: 10,
  },
  {
    quizId: 'quiz-net-101-bits-bytes-binary-hex',
    lessonSlug: 'net-101-bits-bytes-binary-hex',
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
    points: 10,
  },
  {
    quizId: 'quiz-net-101-bits-bytes-binary-hex',
    lessonSlug: 'net-101-bits-bytes-binary-hex',
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
    points: 10,
  },
  {
    quizId: 'quiz-net-101-bits-bytes-binary-hex',
    lessonSlug: 'net-101-bits-bytes-binary-hex',
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
    points: 10,
  },
  {
    quizId: 'quiz-net-101-bits-bytes-binary-hex',
    lessonSlug: 'net-101-bits-bytes-binary-hex',
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
    points: 10,
  },

  // -------------------------------------------------------------------------
  // Benchmark 2: NET-202 (IPv4 Addressing & CIDR)
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-net-202-ipv4-addressing-cidr',
    lessonSlug: 'net-202-ipv4-addressing-cidr',
    text: 'An IPv4 address is composed of how many total bits, and how are these bits partitioned?',
    options: [
      '32 bits, divided into a Network portion (identifying the subnet) and a Host portion (identifying the specific device)',
      '48 bits, divided into an Organizationally Unique Identifier (OUI) and a Device serial',
      '128 bits, divided into eight 16-bit hexadecimal blocks',
      '64 bits, divided into four 16-bit binary words',
    ],
    correctOption: 0,
    explanation:
      'An IPv4 address is a 32-bit binary number represented as four 8-bit octets. A subnet mask divides these 32 bits into a Network portion (identifying the subnet) and a Host portion (identifying the specific device on that subnet).',
    explanationsJson: {
      1: '48 bits describes an Ethernet MAC address.',
      2: '128 bits describes an IPv6 address.',
      3: '64 bits is not a standard IP addressing architecture.',
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.RECALL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: '32-Bit IPv4 Architecture',
    points: 10,
  },
  {
    quizId: 'quiz-net-202-ipv4-addressing-cidr',
    lessonSlug: 'net-202-ipv4-addressing-cidr',
    text: 'What is the primary architectural purpose of a subnet mask in IPv4 addressing?',
    options: [
      'To define the exact boundary between Network bits (binary 1s) and Host bits (binary 0s)',
      'To encrypt IP packets before transmission across physical network media',
      'To uniquely identify the physical MAC address of the network interface card',
      'To determine the domain name associated with a logical IP endpoint',
    ],
    correctOption: 0,
    explanation:
      'A subnet mask is a 32-bit sequence of contiguous 1s followed by contiguous 0s. The 1s indicate the network bits, and the 0s indicate the host bits. In CIDR notation, the prefix length /N represents the count of network 1s.',
    explanationsJson: {
      1: 'Subnet masks do not perform cryptographic encryption.',
      2: 'MAC addresses are physical Layer 2 identifiers, not subnet masks.',
      3: 'Domain name resolution is handled by DNS, not subnet masks.',
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Subnet Mask Role',
    points: 10,
  },
  {
    quizId: 'quiz-net-202-ipv4-addressing-cidr',
    lessonSlug: 'net-202-ipv4-addressing-cidr',
    text: 'In a standard `/26` subnet, what are the total number of IP addresses and the number of assignable (usable) host addresses?',
    options: [
      '64 total addresses, and 62 usable host addresses',
      '32 total addresses, and 30 usable host addresses',
      '64 total addresses, and 64 usable host addresses',
      '128 total addresses, and 126 usable host addresses',
    ],
    correctOption: 0,
    explanation:
      'A /26 prefix leaves 32 - 26 = 6 host bits. Total addresses = 2^6 = 64. In standard subnets, subtracting the Network Address (all 0s) and Broadcast Address (all 1s) leaves 64 - 2 = 62 usable host addresses.',
    explanationsJson: {
      1: '32 total / 30 usable corresponds to a /27 prefix (5 host bits).',
      2: '64 usable is incorrect because the Network and Broadcast addresses cannot be assigned to hosts.',
      3: '128 total / 126 usable corresponds to a /25 prefix (7 host bits).',
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Host Capacity Formula',
    points: 10,
  },
  {
    quizId: 'quiz-net-202-ipv4-addressing-cidr',
    lessonSlug: 'net-202-ipv4-addressing-cidr',
    text: 'Given the host IP address `192.168.10.75/26`, what are the Network Address and Broadcast Address for this subnet?',
    options: [
      'Network Address: 192.168.10.64 | Broadcast Address: 192.168.10.127',
      'Network Address: 192.168.10.0 | Broadcast Address: 192.168.10.63',
      'Network Address: 192.168.10.64 | Broadcast Address: 192.168.10.255',
      'Network Address: 192.168.10.75 | Broadcast Address: 192.168.10.128',
    ],
    correctOption: 0,
    explanation:
      'A /26 prefix has a block size of 2^6 = 64 in the 4th octet (blocks start at .0, .64, .128, .192). IP 192.168.10.75 falls in the second block (.64 to .127). The Network Address is 192.168.10.64 and the Broadcast Address is 192.168.10.127.',
    explanationsJson: {
      1: '192.168.10.0/26 covers IPs .0 to .63; IP .75 is outside this range.',
      2: '.255 is the broadcast of the fourth block (192.168.10.192/26), not the second block.',
      3: '192.168.10.75 is a host IP, not a valid network boundary.',
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Subnet Boundary Calculation',
    points: 10,
  },
  {
    quizId: 'quiz-net-202-ipv4-addressing-cidr',
    lessonSlug: 'net-202-ipv4-addressing-cidr',
    text: 'If a network administrator changes a subnet prefix from `/24` to `/26`, what happens to the number of network bits and host capacity per subnet?',
    options: [
      'Network bits increase by 2, dividing the address space into 4 smaller subnets with 62 usable hosts each instead of 254',
      'Host bits increase by 2, doubling the available host capacity per subnet',
      'Network bits decrease by 2, merging smaller subnets into one larger broadcast domain',
      'The total number of available host addresses per subnet increases from 254 to 510',
    ],
    correctOption: 0,
    explanation:
      'Moving from /24 (24 network bits, 8 host bits, 254 hosts) to /26 (26 network bits, 6 host bits) borrows 2 bits from the host portion. This creates 2^2 = 4 subnets, with each subnet accommodating 2^6 - 2 = 62 usable hosts.',
    explanationsJson: {
      1: 'Host bits decrease from 8 to 6, reducing host capacity per subnet.',
      2: 'Network bits increased from 24 to 26; they did not decrease.',
      3: 'Host capacity decreases when prefix length increases.',
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Prefix Shift Dynamics',
    points: 10,
  },
  {
    quizId: 'quiz-net-202-ipv4-addressing-cidr',
    lessonSlug: 'net-202-ipv4-addressing-cidr',
    text: 'Why does a standard `/30` prefix provide exactly 2 usable host IP addresses, and how do point-to-point links treat host bit reservations?',
    options: [
      'A /30 has 2 host bits (2^2 = 4 total addresses), reserving 1 for the Network Address and 1 for the Broadcast Address, leaving 2 usable addresses',
      'A /30 has 30 host bits, providing over 1 billion usable host addresses',
      'A /30 reserves all 4 addresses for routing protocol discovery',
      'A /30 has only 1 host bit (2^1 = 2 total addresses), allowing zero usable host endpoints',
    ],
    correctOption: 0,
    explanation:
      'With a /30 prefix, there are 32 - 30 = 2 host bits (2^2 = 4 total addresses). In standard IPv4 subnetting, subtracting the Network Address (all 0s) and Broadcast Address (all 1s) leaves 4 - 2 = 2 usable host addresses, making /30 ideal for point-to-point router links (note: RFC 3021 defines /31 for point-to-point links without broadcast, utilizing both addresses).',
    explanationsJson: {
      1: 'A /30 has 30 network bits and only 2 host bits.',
      2: 'Addresses in a /30 are not reserved for routing protocols; 2 are usable for host endpoints.',
      3: 'A /30 has 2 host bits (4 total addresses), not 1 host bit.',
    },
    difficulty: CourseLevel.BEGINNER,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Point-to-Point & Edge Subnetting',
    points: 10,
  },
  // -------------------------------------------------------------------------
  // Benchmark 3: NET-302 (Spanning Tree Protocol)
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-net-302-spanning-tree-protocol-loop-prevention',
    lessonSlug: 'net-302-spanning-tree-protocol-loop-prevention',
    text: 'What criteria determines which switch is elected as the Root Bridge in standard IEEE 802.1D Spanning Tree Protocol?',
    options: [
      'The switch with the lowest Bridge ID (composed of Bridge Priority + MAC Address)',
      'The switch with the highest IP address',
      'The switch with the largest number of connected gigabit ports',
      'The switch that has been powered on the longest'
    ],
    correctOption: 0,
    explanation: 'The Root Bridge election selects the switch with the lowest Bridge ID (BID). BID consists of a 2-byte Priority (default 32768) and the 6-byte base MAC address. Lowest priority wins; ties broken by lowest MAC.',
    explanationsJson: {
      1: 'STP operates at Layer 2 and does not evaluate Layer 3 IP addresses during Root election.',
      2: 'Port count does not determine Root Bridge eligibility.',
      3: 'Uptime does not override the Bridge ID election criteria.'
    },
    difficulty: CourseLevel.INTERMEDIATE,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Root Bridge Election Criteria',
    points: 10
  },
  {
    quizId: 'quiz-net-302-spanning-tree-protocol-loop-prevention',
    lessonSlug: 'net-302-spanning-tree-protocol-loop-prevention',
    text: 'Three switches (Switch A: MAC 00:11:22:33:44:55, Switch B: MAC 00:22:33:44:55:66, Switch C: MAC 00:33:44:55:66:77) all have the default Bridge Priority of 32768. Which switch becomes the Root Bridge?',
    options: [
      'Switch A (lowest MAC address 00:11:22:33:44:55)',
      'Switch C (highest MAC address 00:33:44:55:66:77)',
      'Switch B (median MAC address)',
      'None; a tie prevents any switch from becoming root'
    ],
    correctOption: 0,
    explanation: 'Because all three switches share the identical default priority (32768), the tie-breaker is the lowest numerical MAC address. Switch A has the lowest MAC and wins the election.',
    explanationsJson: {
      1: 'STP elects the LOWEST MAC, not the highest.',
      2: 'Median MAC has no priority in STP algorithms.',
      3: 'Ties are always broken deterministically by MAC address.'
    },
    difficulty: CourseLevel.INTERMEDIATE,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.SCENARIO,
    concept: 'STP Root Bridge Tie-Breaking',
    points: 10
  },
  {
    quizId: 'quiz-net-302-spanning-tree-protocol-loop-prevention',
    lessonSlug: 'net-302-spanning-tree-protocol-loop-prevention',
    text: 'What is the role of a "Root Port" on a non-root switch in Spanning Tree topology?',
    options: [
      'The single port on that non-root switch that has the lowest cumulative path cost to reach the Root Bridge',
      'The port that connects directly to the Internet service provider',
      'The port that blocks all user data frames to prevent loops',
      'A port that forwards only broadcast frames'
    ],
    correctOption: 0,
    explanation: 'Every non-root switch must select exactly one Root Port—the port with the lowest cumulative Spanning Tree path cost to the Root Bridge. Root Ports forward traffic.',
    explanationsJson: {
      1: 'Root Ports lead to the internal Root Bridge, not external ISPs.',
      2: 'Ports that block traffic are Alternate/Backup (Blocking) ports, not Root Ports.',
      3: 'Root Ports forward all valid unicast, multicast, and broadcast data frames.'
    },
    difficulty: CourseLevel.INTERMEDIATE,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'STP Root Port Selection',
    points: 10
  },
  {
    quizId: 'quiz-net-302-spanning-tree-protocol-loop-prevention',
    lessonSlug: 'net-302-spanning-tree-protocol-loop-prevention',
    text: 'A rogue switch is plugged into an edge user port and begins transmitting BPDUs with Priority 0, attempting to become the Root Bridge. Which STP security feature prevents this hijacking?',
    options: [
      'BPDU Guard and Root Guard',
      'DHCP Snooping',
      'Dynamic ARP Inspection (DAI)',
      'Port Mirroring (SPAN)'
    ],
    correctOption: 0,
    explanation: 'BPDU Guard disables edge ports that receive unexpected BPDUs. Root Guard enforces that a designated port cannot become a root port, placing it into a root-inconsistent state if superior BPDUs are received.',
    explanationsJson: {
      1: 'DHCP Snooping validates DHCP server messages, not STP BPDUs.',
      2: 'DAI inspects ARP packets to prevent ARP spoofing.',
      3: 'Port Mirroring copies traffic for analysis; it does not protect STP topology.'
    },
    difficulty: CourseLevel.INTERMEDIATE,
    cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
    questionType: QuestionType.TROUBLESHOOTING,
    concept: 'BPDU Guard and Root Guard Security',
    points: 10
  },
  {
    quizId: 'quiz-net-302-spanning-tree-protocol-loop-prevention',
    lessonSlug: 'net-302-spanning-tree-protocol-loop-prevention',
    text: 'What are the port states in classic IEEE 802.1D STP, and what is the total default convergence time from Blocking to Forwarding?',
    options: [
      'Blocking -> Listening (15s) -> Learning (15s) -> Forwarding; Total convergence time = 30 to 50 seconds',
      'Discarding -> Forwarding; Total convergence time = 1 second',
      'Listening -> Forwarding; Total convergence time = 5 seconds',
      'Disabled -> Forwarding; Total convergence time = 0 seconds'
    ],
    correctOption: 0,
    explanation: 'Classic 802.1D transitions through: Blocking (Max Age 20s if link fails) -> Listening (15s Forward Delay) -> Learning (15s Forward Delay) -> Forwarding, totaling 30 to 50 seconds to converge.',
    explanationsJson: {
      1: 'Discarding -> Learning -> Forwarding describes Rapid STP (802.1w), which converges in sub-seconds.',
      2: 'Classic 802.1D requires both Listening and Learning states (15s each = 30s min).',
      3: '0 seconds transition without PortFast causes immediate temporary Layer 2 loops.'
    },
    difficulty: CourseLevel.INTERMEDIATE,
    cognitiveLevel: CognitiveLevel.RECALL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: '802.1D STP Convergence Timers',
    points: 10
  },
  {
    quizId: 'quiz-net-302-spanning-tree-protocol-loop-prevention',
    lessonSlug: 'net-302-spanning-tree-protocol-loop-prevention',
    text: 'An administrator wants edge access ports connected directly to end-user workstations to transition immediately to the Forwarding state without waiting 30 seconds for STP listening/learning timers. Which feature must be enabled?',
    options: [
      'STP PortFast (Cisco) / Edge Port (IEEE 802.1w)',
      'Static Routing 0.0.0.0/0',
      'Dynamic Trunking Protocol (DTP)',
      'NAT Overload'
    ],
    correctOption: 0,
    explanation: 'PortFast immediately transitions an access port from blocking to forwarding, bypassing listening and learning states so DHCP requests from booting PCs do not time out. It should only be enabled on ports connected to end hosts.',
    explanationsJson: {
      1: 'Static routing is a Layer 3 routing configuration, unrelated to Layer 2 switch port STP transitions.',
      2: 'DTP negotiates trunking between switches, it does not bypass STP timers.',
      3: 'NAT overload translates IP addresses on routers, not switch port STP states.'
    },
    difficulty: CourseLevel.INTERMEDIATE,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'STP PortFast Optimization',
    points: 10
  },

  // -------------------------------------------------------------------------
  // Benchmark 4: NET-304 (Dynamic Routing OSPF)
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-net-304-single-area-ospf-routing',
    lessonSlug: 'net-304-single-area-ospf-routing',
    text: 'What routing algorithm does Open Shortest Path First (OSPF) execute to calculate the loop-free shortest path tree from its Link-State Database?',
    options: [
      'Dijkstra Shortest Path First (SPF) algorithm',
      'Bellman-Ford distance-vector algorithm',
      'Diffie-Hellman cryptographic exchange algorithm',
      'Dual-Tree Token Ring algorithm'
    ],
    correctOption: 0,
    explanation: 'OSPF is a Link-State routing protocol that runs the Dijkstra Shortest Path First (SPF) algorithm on its synchronized Link-State Database (LSDB) to compute the lowest-cost loop-free path to every destination subnet.',
    explanationsJson: {
      1: 'Bellman-Ford is used by Distance-Vector protocols like RIP.',
      2: 'Diffie-Hellman is a cryptographic key exchange algorithm, not a routing path algorithm.',
      3: 'Dual-Tree is not a routing protocol algorithm.'
    },
    difficulty: CourseLevel.INTERMEDIATE,
    cognitiveLevel: CognitiveLevel.RECALL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'Dijkstra SPF Algorithm',
    points: 10
  },
  {
    quizId: 'quiz-net-304-single-area-ospf-routing',
    lessonSlug: 'net-304-single-area-ospf-routing',
    text: 'In OSPFv2, what criteria determines the election of a Router ID (RID) if it is NOT manually configured?',
    options: [
      'Highest IPv4 address among active Loopback interfaces; if no loopbacks exist, the highest IPv4 address among active physical interfaces',
      'Lowest MAC address on the default gateway',
      'The router with the lowest serial number',
      'The router that has the highest OSPF cost metric'
    ],
    correctOption: 0,
    explanation: 'OSPF Router ID selection order: 1. Manually configured router-id; 2. Highest IPv4 address on any active loopback interface; 3. Highest IPv4 address on any active physical interface.',
    explanationsJson: {
      1: 'OSPF Router ID is an IPv4 address, not a Layer 2 MAC address.',
      2: 'Hardware serial numbers have no role in OSPF RID election.',
      3: 'Path cost metrics do not determine Router ID identity.'
    },
    difficulty: CourseLevel.INTERMEDIATE,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'OSPF Router ID Election Logic',
    points: 10
  },
  {
    quizId: 'quiz-net-304-single-area-ospf-routing',
    lessonSlug: 'net-304-single-area-ospf-routing',
    text: 'What parameters MUST match identically between two neighboring routers for an OSPF adjacency to successfully reach the FULL state?',
    options: [
      'Area ID, Subnet Mask, Hello Interval, Dead Interval, and Authentication Password',
      'Router ID and Hostname',
      'Loopback IP address and Switch port number',
      'Administrative Distance and Bandwidth'
    ],
    correctOption: 0,
    explanation: 'OSPF neighbor formation requires matching: 1. Area ID; 2. Subnet and Mask on the link; 3. Hello Interval (default 10s) and Dead Interval (default 40s); 4. Authentication credentials; 5. Area type flags (stub/NSSA).',
    explanationsJson: {
      1: 'Router IDs MUST BE UNIQUE; identical RIDs cause severe routing conflicts and duplicate RID rejection.',
      2: 'Loopback IPs are unique to each router; switch ports do not affect OSPF adjacency.',
      3: 'Administrative distance is local to each router; bandwidth can differ across interface types.'
    },
    difficulty: CourseLevel.INTERMEDIATE,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'OSPF Adjacency Requirements',
    points: 10
  },
  {
    quizId: 'quiz-net-304-single-area-ospf-routing',
    lessonSlug: 'net-304-single-area-ospf-routing',
    text: 'Two OSPF routers connected via a gigabit Ethernet link are stuck in the EXSTART / EXCHANGE state and fail to reach FULL. What is the most common cause?',
    options: [
      'An MTU (Maximum Transmission Unit) mismatch between the two connected interfaces, causing the larger DBD packet to be dropped',
      'The routers have different hostnames',
      'The physical Ethernet cable is single-mode fiber',
      'The routers have different clock timezones'
    ],
    correctOption: 0,
    explanation: 'During EXSTART and EXCHANGE states, routers negotiate Master/Slave roles and exchange Database Description (DBD) packets. If interface MTUs do not match, the router receiving a DBD packet larger than its MTU drops it, hanging forever in EXSTART.',
    explanationsJson: {
      1: 'Hostnames are arbitrary administrative labels and do not affect OSPF state machine convergence.',
      2: 'Physical fiber type does not cause EXSTART hangs if link-layer frames are delivering data.',
      3: 'Timezone discrepancies do not break OSPF packet exchange.'
    },
    difficulty: CourseLevel.INTERMEDIATE,
    cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
    questionType: QuestionType.TROUBLESHOOTING,
    concept: 'OSPF MTU Mismatch & EXSTART Diagnosis',
    points: 10
  },
  {
    quizId: 'quiz-net-304-single-area-ospf-routing',
    lessonSlug: 'net-304-single-area-ospf-routing',
    text: 'Why does OSPF elect a Designated Router (DR) and Backup Designated Router (BDR) on multi-access Ethernet segments, and what multicast address do non-DR (DROTHER) routers use to transmit LSUs to the DR/BDR?',
    options: [
      'To reduce adjacency count from n(n-1)/2 to 2n; DROTHER routers send LSUs to 224.0.0.6 (AllDRouters)',
      'To encrypt routing tables; DROTHER routers send to 224.0.0.1',
      'To provide DHCP lease addresses; DROTHER routers send to 255.255.255.255',
      'To balance CPU temperature across chassis; DROTHER routers send to 127.0.0.1'
    ],
    correctOption: 0,
    explanation: 'On multi-access LANs (Ethernet), DR/BDR election limits full-mesh adjacencies. DROTHER routers only form full adjacency with DR and BDR, sending link updates to 224.0.0.6 (AllDRouters). The DR forwards updates to all other routers on 224.0.0.5 (AllSPFRouters).',
    explanationsJson: {
      1: '224.0.0.1 is all IPv4 subnet systems, not specific to OSPF DR/BDR communication.',
      2: 'OSPF is an IGP routing protocol, not a DHCP server allocation mechanism.',
      3: '127.0.0.1 is loopback, not multi-access router multicast.'
    },
    difficulty: CourseLevel.INTERMEDIATE,
    cognitiveLevel: CognitiveLevel.UNDERSTANDING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    concept: 'OSPF DR/BDR Multi-Access Optimization',
    points: 10
  },
  {
    quizId: 'quiz-net-304-single-area-ospf-routing',
    lessonSlug: 'net-304-single-area-ospf-routing',
    text: 'What is the default reference bandwidth in classic OSPF, what is the cost of a 10 Gbps interface under that default, and how should an engineer configure OSPF to accurately differentiate between 1 Gbps, 10 Gbps, and 100 Gbps links?',
    options: [
      'Default reference bandwidth is 100 Mbps (cost = 1 for 100M, 1G, 10G); engineer must execute auto-cost reference-bandwidth 100000 (or higher) to accurately scale costs',
      'Default reference bandwidth is 10 Tbps; no adjustment is ever needed',
      'Default cost is determined strictly by ping response latency in milliseconds',
      'Reference bandwidth is permanently fixed in router ROM and cannot be adjusted'
    ],
    correctOption: 0,
    explanation: 'OSPF calculates Cost = Reference Bandwidth / Interface Bandwidth. Classic default reference bandwidth is 100 Mbps (10^8 bps). Therefore, 100 Mbps, 1 Gbps, 10 Gbps all evaluate to Cost = 1 (integer minimum). Setting auto-cost reference-bandwidth 100000 (or 1,000,000) restores proportional metric costs for modern high-speed links.',
    explanationsJson: {
      1: 'Default is 100 Mbps, not 10 Tbps.',
      2: 'OSPF uses static bandwidth cost formulas, not dynamic ping latency.',
      3: 'Reference bandwidth is configurable via the auto-cost reference-bandwidth command.'
    },
    difficulty: CourseLevel.INTERMEDIATE,
    cognitiveLevel: CognitiveLevel.EXPERT_REASONING,
    questionType: QuestionType.CONFIGURATION_ANALYSIS,
    concept: 'OSPF Reference Bandwidth Scaling',
    points: 10
  },

  // -------------------------------------------------------------------------
  // Benchmark 5: NET-404 (Wireshark Packet Capture Analysis)
  // -------------------------------------------------------------------------
  {
    quizId: 'quiz-net-404-wireshark-packet-capture',
    lessonSlug: 'net-404-wireshark-packet-capture',
    text: 'Which Wireshark display filter isolates ONLY the initial TCP connection request (SYN packet) sent by a client, excluding SYN-ACK packets?',
    options: [
      'tcp.flags.syn == 1 && tcp.flags.ack == 0',
      'tcp.flags.syn == 1',
      'tcp.port == 80',
      'ip.proto == 6'
    ],
    correctOption: 0,
    explanation: 'The initial connection request has the SYN bit set to 1 and the ACK bit set to 0 (`tcp.flags.syn == 1 && tcp.flags.ack == 0`). SYN-ACK packets sent by the server have both SYN=1 and ACK=1.',
    explanationsJson: {
      1: '`tcp.flags.syn == 1` matches BOTH SYN (client) and SYN-ACK (server) packets.',
      2: '`tcp.port == 80` filters all HTTP traffic regardless of flags.',
      3: '`ip.proto == 6` filters all TCP traffic in the capture.'
    },
    difficulty: CourseLevel.ADVANCED,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.PACKET_ANALYSIS,
    concept: 'Wireshark TCP Flag Filtering',
    points: 10
  },
  {
    quizId: 'quiz-net-404-wireshark-packet-capture',
    lessonSlug: 'net-404-wireshark-packet-capture',
    text: 'In a Wireshark PCAP trace, an engineer observes 3 identical consecutive TCP ACK packets with `Ack = 45000` returned by the receiver in less than 5 milliseconds. What network event does this "Triple Duplicate ACK" indicate?',
    options: [
      'Fast Retransmit trigger: A packet was lost in transit, causing the receiver to repeatedly acknowledge the last contiguous byte received while out-of-order packets arrive',
      'The TCP connection has gracefully terminated with a 4-way handshake',
      'The client has upgraded from IPv4 to IPv6',
      'The switch has enabled jumbo frames'
    ],
    correctOption: 0,
    explanation: 'When a receiver gets an out-of-order segment (because an earlier segment was dropped), it immediately sends a duplicate ACK for the last in-order byte. Receiving 3 duplicate ACKs triggers the Fast Retransmit algorithm, retransmitting the lost segment without waiting for RTO timer expiry.',
    explanationsJson: {
      1: 'Connection termination utilizes FIN and FIN-ACK packets, not rapid duplicate ACKs.',
      2: 'IP version upgrades do not generate duplicate TCP acknowledgments.',
      3: 'Jumbo frames are Layer 2 MTU configurations, not duplicate ACK indicators.'
    },
    difficulty: CourseLevel.ADVANCED,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.PACKET_ANALYSIS,
    concept: 'TCP Fast Retransmit & Duplicate ACKs',
    points: 10
  },
  {
    quizId: 'quiz-net-404-wireshark-packet-capture',
    lessonSlug: 'net-404-wireshark-packet-capture',
    text: 'A Wireshark packet capture displays: `[TCP ZeroWindow]` from server `10.0.0.5` followed immediately by the client pausing all transmission. What does this packet indicate?',
    options: [
      'The receiving server application buffer is completely full, advertising Window Size = 0 to command the client to stop sending data until buffer space clears',
      'The server has crashed and closed all network ports',
      'The network cable has been unplugged from the wall',
      'The client has sent an invalid password'
    ],
    correctOption: 0,
    explanation: 'A `[TCP ZeroWindow]` packet is flow control in action. The receiver buffer is saturated, so it advertises `win=0`. The sender stops transmitting data and sends periodic 1-byte "ZeroWindowProbe" packets until the receiver responds with a non-zero window update.',
    explanationsJson: {
      1: 'If the server crashed, it would send a TCP RST or timeout, not an active ZeroWindow flow control advertisement.',
      2: 'A disconnected cable results in silent timeouts, not TCP header window updates.',
      3: 'ZeroWindow is transport layer flow control, unrelated to application authentication.'
    },
    difficulty: CourseLevel.ADVANCED,
    cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
    questionType: QuestionType.PACKET_ANALYSIS,
    concept: 'TCP ZeroWindow Flow Control Analysis',
    points: 10
  },
  {
    quizId: 'quiz-net-404-wireshark-packet-capture',
    lessonSlug: 'net-404-wireshark-packet-capture',
    text: 'An engineer suspects a slow network is caused by TCP retransmissions. Which Wireshark display filter quickly displays only retransmitted packets and duplicate acknowledgments?',
    options: [
      '`tcp.analysis.retransmission || tcp.analysis.duplicate_ack`',
      '`http.request.method == "GET"`',
      '`ip.addr == 127.0.0.1`',
      '`frame.len > 1518`'
    ],
    correctOption: 0,
    explanation: 'Wireshark built-in TCP analysis engine flags retransmissions and duplicate ACKs with `tcp.analysis.retransmission` and `tcp.analysis.duplicate_ack`, allowing rapid diagnosis of packet loss and latency.',
    explanationsJson: {
      1: '`http.request.method == "GET"` filters HTTP GET requests, not TCP loss analytics.',
      2: '`ip.addr == 127.0.0.1` filters local loopback traffic.',
      3: '`frame.len > 1518` filters oversized/jumbo frames.'
    },
    difficulty: CourseLevel.ADVANCED,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.PACKET_ANALYSIS,
    concept: 'Wireshark Expert Info Display Filters',
    points: 10
  },
  {
    quizId: 'quiz-net-404-wireshark-packet-capture',
    lessonSlug: 'net-404-wireshark-packet-capture',
    text: 'In Wireshark, an engineer inspects a DNS response frame containing `Flags: 0x8183 (Standard query response, No such name)`. What is the common name and technical meaning of this DNS response code (RCODE 3)?',
    options: [
      'NXDOMAIN (Non-Existent Domain): The queried domain name does not exist in the authoritative DNS zone',
      'SERVFAIL: The DNS server hardware has failed',
      'REFUSED: The DNS server refuses to talk to the client',
      'NOERROR: The domain name was resolved successfully'
    ],
    correctOption: 0,
    explanation: 'RCODE 3 is `NXDOMAIN` (Non-Existent Domain). The authoritative name server confirmed that the requested domain name is not registered or has no record in the zone file.',
    explanationsJson: {
      1: 'SERVFAIL is RCODE 2 (server failure).',
      2: 'REFUSED is RCODE 5 (policy refusal).',
      3: 'NOERROR is RCODE 0 (successful query resolution).'
    },
    difficulty: CourseLevel.ADVANCED,
    cognitiveLevel: CognitiveLevel.APPLICATION,
    questionType: QuestionType.PACKET_ANALYSIS,
    concept: 'DNS Packet Flag & RCODE Analysis',
    points: 10
  },
  {
    quizId: 'quiz-net-404-wireshark-packet-capture',
    lessonSlug: 'net-404-wireshark-packet-capture',
    text: 'A security analyst captures a flood of TCP packets targeted at port 443 with `tcp.flags.reset == 1`. What is the meaning of a TCP RST packet and what does this traffic pattern suggest?',
    options: [
      'TCP RST (Reset) abruptly tears down a connection without a graceful 4-way FIN handshake; a flood of RST packets suggests a port scan against closed ports or a TCP Reset attack terminating active sessions',
      'TCP RST indicates a successful file download has completed',
      'TCP RST means the router has upgraded its firmware',
      'TCP RST is used exclusively to calibrate Wi-Fi antennas'
    ],
    correctOption: 0,
    explanation: 'The RST (Reset) flag indicates an immediate, ungraceful connection termination (sent when a packet arrives for a closed port or when a connection has crashed). Excessive RST packets indicate port scanning or malicious session termination.',
    explanationsJson: {
      1: 'Successful completion uses FIN and ACK flags for graceful termination.',
      2: 'Firmware upgrades are system management events, not TCP packet flags.',
      3: 'TCP RST is a transport layer flag, unrelated to physical antenna calibration.'
    },
    difficulty: CourseLevel.ADVANCED,
    cognitiveLevel: CognitiveLevel.EXPERT_REASONING,
    questionType: QuestionType.PACKET_ANALYSIS,
    concept: 'TCP Reset (RST) Flag Analysis & Port Scanning',
    points: 10
  }
];

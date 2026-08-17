import { CourseLevel, LessonType, CognitiveLevel, QuestionType } from '@prisma/client';
import { BenchmarkLessonFullDefinition } from './lessons-net300-400';

export const LESSONS_NET203_204: BenchmarkLessonFullDefinition[] = [
  // =========================================================================
  // COURSE: NET-203 (Core IP Services: ARP, DHCP, DNS & IPv6)
  // =========================================================================

  // -------------------------------------------------------------------------
  // 1. NET-203: Domain Name System (DNS) & Name Resolution Architecture
  // -------------------------------------------------------------------------
  {
    courseCode: 'NET-203',
    slug: 'level-0-dns-internet-phonebook',
    title: 'Domain Name System (DNS) & Name Resolution Architecture',
    type: LessonType.THEORY,
    durationMinutes: 25,
    order: 1,
    visualizationType: 'DNS_RESOLUTION_TREE',
    introduction:
      'Master the distributed naming service of the Internet: The hierarchical DNS namespace (Root, TLD, Second-Level, Subdomain), the 4 DNS server roles in resolution (Recursive Resolver, Root Nameserver, TLD Nameserver, Authoritative Nameserver), core Resource Record types (A, AAAA, CNAME, MX, PTR, NS, SOA), and the iterative vs recursive query resolution flow.',
    stepMetadata: {
      step1_objective:
        'Understand the hierarchical DNS namespace, differentiate between the 4 server roles in name resolution, analyze standard DNS Resource Record types (A, AAAA, CNAME, MX), and trace iterative and recursive resolution flows.',
      step2_prerequisites: ['net-202-ipv4-addressing-cidr'],
      step3_whyItMatters:
        'Computers communicate using numeric IP addresses, but humans rely on readable domain names. DNS outages instantly disable web browsing, email delivery, and cloud application access worldwide.',
      step4_coreConcept:
        'The Domain Name System (DNS, RFC 1034/1035) is a globally distributed hierarchical database that translates human-readable domain names (e.g. `api.example.com`) into computer-routable IP addresses (e.g. `93.184.216.34` or `2606:2800:220:1:248:1893:25c8:1946`). The DNS hierarchy is structured top-down: (1) Root Zone (`.`, 13 named root clusters), (2) Top-Level Domains (TLDs: `.com`, `.org`, `.net`, ccTLDs `.uk`), (3) Second-Level Domains (`example.com`), (4) Subdomains (`api.example.com`). Resolution involves four server roles: (1) Recursive Resolver (acts on client behalf), (2) Root Server (points to TLD), (3) TLD Server (points to Authoritative), and (4) Authoritative Nameserver (holds definitive records). Standard records: `A` (IPv4), `AAAA` (IPv6), `CNAME` (canonical alias), `MX` (mail exchange), `PTR` (reverse IP lookup), `NS` (delegated nameserver), `SOA` (zone metadata).',
      step5_technicalAnatomy: {
        title: 'DNS Hierarchy, Server Roles & Resource Records',
        description: 'Namespace levels, resolution roles, and standard record schemas.',
        components: [
          { name: 'Recursive Resolver (Stub Resolver Client Agent)', detail: 'Server (ISP or public 8.8.8.8/1.1.1.1) that receives client queries, traverses the hierarchy, and caches the result.' },
          { name: 'Root Nameservers (13 Logical Clusters)', detail: 'Root of the DNS tree (`.`). Directs queries to the authoritative TLD nameservers (e.g. points `.com` queries to Verisign).' },
          { name: 'TLD Nameservers', detail: 'Maintains registries for specific top-level domains (`.com`, `.org`, `.edu`) and points to authoritative nameservers.' },
          { name: 'Authoritative Nameserver', detail: 'The definitive source of truth holding the actual DNS zone file records configured by the domain owner.' },
          { name: 'Core Resource Records (A, AAAA, CNAME, MX)', detail: '`A` = IPv4 (32-bit), `AAAA` = IPv6 (128-bit), `CNAME` = Canonical Name (alias), `MX` = Mail server + priority, `PTR` = Reverse lookup.' },
        ],
      },
      step6_howItWorks: {
        steps: [
          { stepNumber: 1, title: 'Client Cache & Stub Query', action: 'Host checks local OS cache and hosts file; if missed, sends a recursive query to its configured DNS Resolver (UDP port 53).' },
          { stepNumber: 2, title: 'Iterative Referral Chain', action: 'Resolver queries Root (`.`) -> receives TLD referral (`.com`) -> queries TLD -> receives Authoritative referral (`ns1.example.com`) -> queries Authoritative nameserver.' },
          { stepNumber: 3, title: 'Authoritative Answer & Caching', action: 'Authoritative server returns the `A` record (`93.184.216.34`) with a Time-To-Live (TTL); resolver caches result and delivers answer to client.' },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'DNS Protocol Header & Query Format (UDP/TCP Port 53)',
        fields: [
          { fieldName: 'Transaction ID', bitLength: '16 bits (2 Bytes)', hexSample: '0x1A2B', description: 'Matches queries with responses.' },
          { fieldName: 'Flags (QR, Opcode, AA, RD, RA)', bitLength: '16 bits', hexSample: '0x0100 (Standard Query)', description: 'Control flags indicating recursion desired/available.' },
          { fieldName: 'Questions / Answers Count', bitLength: '16 bits each', hexSample: 'QDCOUNT=1, ANCOUNT=1', description: 'Number of query and response records.' },
        ],
        headerDiagramAscii: `
+-------------------------------------------------------------------------------+
|                       THE 4-STEP DNS RESOLUTION HIERARCHY                     |
+-------------------------------------------------------------------------------+
|   [ CLIENT ] --- (1. Recursive Query: "api.example.com") ---> [ RESOLVER ]    |
|                                                                    |          |
|        +-----------------------------------------------------------+          |
|        |                                                                      |
|        +---> (2. Where is .com?) --------> [ ROOT NAMESERVER (.) ]            |
|        |<--- (Referral to .com TLD) -------+                                  |
|        |                                                                      |
|        +---> (3. Where is example.com?) -> [ .COM TLD NAMESERVER ]            |
|        |<--- (Referral to ns1.example.com) +                                  |
|        |                                                                      |
|        +---> (4. What is api.example.com?) [ AUTHORITATIVE SERVER ]           |
|        |<--- (A Record: 93.184.216.34) ----+                                  |
|        |                                                                      |
|   [ CLIENT ] <--- (5. Delivers IP & Caches) <----------------------+          |
+-------------------------------------------------------------------------------+
`,
      },
      step8_visualExplanation: {
        type: 'DNS_RESOLUTION_TREE',
        title: 'Interactive DNS Namespace Hierarchy & Recursive Resolver Engine',
        description: 'Trace a DNS lookup from client stub resolver through Root, TLD, and Authoritative servers, observing packet round-trips, record parsing, and TTL caching.',
      },
      step9_workedExample: {
        title: 'Tracing DNS Resolution Flow for `www.example.com`',
        problemStatement: 'Trace the complete DNS resolution steps when a client queries `www.example.com` with an empty local cache.',
        stepByStepSolution: [
          'Step 1: Client sends recursive query for `www.example.com` (Type A) to Resolver `8.8.8.8:53`.',
          'Step 2: Resolver sends iterative query to Root Server (`.`), receiving referral to `.com` TLD servers.',
          'Step 3: Resolver queries `.com` TLD server, receiving referral to `ns1.example.com` (Authoritative).',
          'Step 4: Resolver queries `ns1.example.com` for `www.example.com`.',
          'Step 5: `ns1.example.com` returns CNAME `example.com` and A record `93.184.216.34` with TTL 3600.',
          'Step 6: Resolver caches the answer for 3600 seconds and returns `93.184.216.34` to client.',
        ],
        finalResult: 'Client receives IP 93.184.216.34 and initiates HTTP connection.',
      },
      step10_realWorldScenario: {
        topology: 'Enterprise Internal Split-Horizon DNS Deployment',
        scenarioText: 'An enterprise configures Split-Horizon DNS: internal LAN clients resolving `portal.company.com` receive private IP `10.10.10.50`, while external Internet users receive public IP `198.51.100.25`, providing security and avoiding hairpin NAT.',
        engineeringContext: 'Split-horizon DNS serves different IP answers based on the client source IP address.',
      },
      step11_deviceBehavior: {
        hostBehavior: 'Maintains local DNS resolver cache (viewable with `ipconfig /displaydns`).',
        nicBehavior: 'Operates transparently at Layer 2.',
        switchOrRouterBehavior: 'DNS queries traverse routers as standard UDP/TCP port 53 packets.',
      },
      step12_cliTooling: [
        {
          command: 'nslookup api.github.com 8.8.8.8',
          description: 'Queries a specific DNS resolver (8.8.8.8) to resolve a domain name and display record details.',
          expectedOutput:
            'Server:  dns.google\nAddress:  8.8.8.8\n\nNon-authoritative answer:\nName:    api.github.com\nAddresses:  140.82.121.6',
          proofExplanation: 'Demonstrates DNS query and A record resolution output.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'Users can ping IP `8.8.8.8` but cannot open websites by domain name.',
          possibleCauses: ['DNS server IP misconfigured in client adapter or DNS server offline'],
          diagnosticSteps: ['Test resolution with `nslookup google.com`.'],
          remediation: 'Configure valid DNS server IPs (e.g. `8.8.8.8` / `1.1.1.1`) in client network adapter settings or DHCP scope.',
        },
      ],
      step14_commonMistakes: [
        { misconception: 'Thinking the Root Server holds the IP addresses for all websites on Earth.', correction: 'Root servers only know the locations of TLD servers; they never hold individual website A records.' },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'DNS Spoofing / Cache Poisoning',
        mitigationStrategy: 'Enable DNSSEC (Domain Name System Security Extensions) and DNS over HTTPS (DoH) to cryptographically sign and encrypt DNS traffic.',
      },
      step16_examPrep: {
        keyExamPoints: [
          '4 DNS server roles: Recursive Resolver, Root, TLD, Authoritative.',
          'Record types: A (IPv4), AAAA (IPv6), CNAME (Alias), MX (Mail), PTR (Reverse).',
          'DNS operates primarily over UDP port 53 (uses TCP port 53 for zone transfers and large responses > 512 bytes).',
        ],
        frequentTraps: [
          'Confusing Recursive queries (client to resolver) with Iterative queries (resolver to root/TLD/authoritative).',
        ],
      },
      step17_practicalLabRef: {
        title: 'Guided Practice: DNS Resolution Tracing & Resource Record Inspection',
        scenario: 'Execute nslookup diagnostics, inspect A and CNAME records, and trace recursive resolution.',
        tasks: ['Run nslookup to query A and MX records.', 'Flush local DNS cache with ipconfig /flushdns.'],
        verificationMethod: 'Verify correct IP resolution in nslookup.',
      },
      step18_masterySummary: {
        summaryPoints: [
          'DNS translates human-readable domain names into computer IP addresses.',
          'Resolution traverses a 4-tier server hierarchy: Resolver -> Root -> TLD -> Authoritative.',
          'Records: A (IPv4), AAAA (IPv6), CNAME (Alias), MX (Mail).',
        ],
        nextLessonBridge:
          'Proceed to NET-203 Lesson 2 to master Dynamic Host Configuration Protocol (DHCP) & IP Leasing.',
      },
    },
    questions: [
      {
        text: 'What are the four primary DNS server roles involved in resolving an unknown domain name, in the correct chronological order of the resolution referral chain?',
        options: [
          'Recursive Resolver -> Root Nameserver -> TLD Nameserver -> Authoritative Nameserver',
          'Authoritative Nameserver -> TLD Nameserver -> Root Nameserver -> Client',
          'DHCP Server -> ARP Server -> Switch -> Router',
          'Web Server -> Database Server -> Proxy Server -> Firewall',
        ],
        correctOption: 0,
        explanation: 'When a client queries a Recursive Resolver, the resolver iteratively queries the Root Nameserver (`.`), which refers to the TLD Nameserver (`.com`), which refers to the Authoritative Nameserver (`ns1.example.com`), which returns the final A record.',
        explanationsJson: { 1: 'Reversed order.', 2: 'DHCP and ARP are distinct protocols.', 3: 'Application server roles.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'DNS 4-Tier Server Hierarchy',
      },
    ],
    lab: {
      title: 'Guided Practice: DNS Resolution Tracing & Resource Record Inspection',
      instructions: '1. Run nslookup google.com 8.8.8.8.\n2. Flush cache with ipconfig /flushdns.',
      difficulty: CourseLevel.FOUNDATIONAL,
      estimatedMinutes: 15,
      initialTopologyJson: { resolver: '8.8.8.8', queryTarget: 'api.github.com' },
      tasks: ['Execute nslookup query.'],
    },
  },

  // -------------------------------------------------------------------------
  // 2. NET-203: Dynamic Host Configuration Protocol (DHCP) & IP Leasing
  // -------------------------------------------------------------------------
  {
    courseCode: 'NET-203',
    slug: 'level-0-dhcp-automatic-ip-allocation',
    title: 'Dynamic Host Configuration Protocol (DHCP) & IP Leasing',
    type: LessonType.THEORY,
    durationMinutes: 25,
    order: 2,
    visualizationType: 'DHCP_DORA_ANIMATOR',
    introduction:
      'Master automated network configuration: The 4-step DHCP DORA message exchange (Discover, Offer, Request, Acknowledge), UDP port 67/68 architecture, lease duration timers (T1 at 50%, T2 at 87.5%, Expiration at 100%), delivery of core DHCP options (Subnet Mask, Default Gateway, DNS Servers), and APIPA fallback mechanics.',
    stepMetadata: {
      step1_objective:
        'Master the 4-step DHCP DORA workflow, analyze UDP ports 67 and 68, understand lease lifecycle timers (T1, T2, Expiration), and identify core DHCP options delivered to clients.',
      step2_prerequisites: ['net-202-ipv4-addressing-cidr'],
      step3_whyItMatters:
        'Manually configuring IP addresses on thousands of employee laptops and smartphones is impossible. DHCP automates IP configuration, prevents IP duplication, and dynamically delivers gateways and DNS servers.',
      step4_coreConcept:
        'The Dynamic Host Configuration Protocol (DHCP, RFC 2131) automatically leases IP configuration parameters to network endpoints. Communication operates over UDP: Server listens on Port 67, Client listens on Port 68. The initial lease acquisition uses the 4-step DORA workflow: (1) **Discover** (Client broadcasts UDP from `0.0.0.0:68` to `255.255.255.255:67`), (2) **Offer** (Server unicasts/broadcasts proposed IP and lease terms), (3) **Request** (Client broadcasts acceptance of the offer), (4) **Acknowledge** (Server commits lease). Core DHCP Options delivered: Option 1 (Subnet Mask), Option 3 (Default Gateway Router IP), Option 6 (DNS Server IPs), Option 15 (Domain Name). Leases have timers: T1 Renewal Timer (at 50% of lease, client sends unicast Request to leasing server), T2 Rebind Timer (at 87.5%, client broadcasts Request to any DHCP server), Expiration (at 100%, IP is released and client enters APIPA `169.254.x.x`).',
      step5_technicalAnatomy: {
        title: 'DHCP DORA Workflow, UDP Ports & Option Codes',
        description: 'DORA messages, transport ports, lease timers, and option payload parameters.',
        components: [
          { name: 'Discover (D)', detail: 'Client broadcast (`255.255.255.255:67`) requesting an IP lease. Source IP is `0.0.0.0:68`.' },
          { name: 'Offer (O)', detail: 'DHCP server proposes an unassigned IP address from its pool, along with Subnet Mask, Default Gateway, and DNS options.' },
          { name: 'Request (R)', detail: 'Client broadcasts formal acceptance of the specific server offer, notifying all other DHCP servers to release their reserved offers.' },
          { name: 'Acknowledge (A)', detail: 'Server finalizes the lease binding in its database and sends definitive ACK confirming configuration parameters.' },
          { name: 'Core DHCP Options (1, 3, 6, 15)', detail: 'Option 1 = Subnet Mask; Option 3 = Default Gateway Router IP; Option 6 = DNS Servers; Option 15 = Domain Search Name.' },
          { name: 'Lease Timers (T1, T2, Expiry)', detail: 'T1 = 50% (unicast renewal to server); T2 = 87.5% (broadcast rebind to any server); Expiration = 100% (lease terminates).' },
        ],
      },
      step6_howItWorks: {
        steps: [
          { stepNumber: 1, title: 'Discover Broadcast', action: 'Unconfigured client boots, brings physical link up, and broadcasts DHCP Discover.' },
          { stepNumber: 2, title: 'Offer Generation', action: 'DHCP server checks pool, reserves IP `192.168.1.50`, and sends DHCP Offer with Gateway and DNS options.' },
          { stepNumber: 3, title: 'Request Commitment', action: 'Client broadcasts DHCP Request specifying Server Identifier and requested IP.' },
          { stepNumber: 4, title: 'ACK & Local Configuration', action: 'Server sends DHCP ACK; client configures IP, subnet mask, default gateway, and DNS servers.' },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'DHCP Message Format (BOOTP / UDP 67 & 68)',
        fields: [
          { fieldName: 'Message Opcode', bitLength: '8 bits', hexSample: '0x01 (BootRequest) / 0x02 (BootReply)', description: 'Direction of DHCP message.' },
          { fieldName: 'Transaction ID (xid)', bitLength: '32 bits', hexSample: '0x39A4E2B1', description: 'Random integer matching client with server.' },
          { fieldName: 'Client IP (ciaddr)', bitLength: '32 bits', hexSample: '0.0.0.0 (in Discover)', description: 'Current client IP.' },
          { fieldName: 'Your IP (yiaddr)', bitLength: '32 bits', hexSample: '192.168.1.50 (in Offer/ACK)', description: 'IP address assigned by server.' },
          { fieldName: 'Magic Cookie', bitLength: '32 bits', hexSample: '0x63825363', description: 'Identifies DHCP option payload data.' },
        ],
        headerDiagramAscii: `
+-------------------------------------------------------------------------------+
|                        THE 4-STEP DHCP DORA WORKFLOW                          |
+-------------------------------------------------------------------------------+
|  [ CLIENT ]                                                   [ DHCP SERVER ] |
|      |                                                              |         |
|      | --- 1. DHCP DISCOVER (Broadcast: 0.0.0.0 -> 255.255.255.255) ->         |
|      |                                                              |         |
|      | <-- 2. DHCP OFFER (Proposes: 192.168.1.50, Mask, Gateway, DNS) --      |
|      |                                                              |         |
|      | --- 3. DHCP REQUEST (Broadcast: "I accept 192.168.1.50") ---->         |
|      |                                                              |         |
|      | <-- 4. DHCP ACK (Commits lease & configures client) ----------+        |
|      |                                                              |         |
|  [ Timers: T1 Renewal @ 50% | T2 Rebind @ 87.5% | Lease Expiry @ 100% ]       |
+-------------------------------------------------------------------------------+
`,
      },
      step8_visualExplanation: {
        type: 'DHCP_DORA_ANIMATOR',
        title: 'Interactive DHCP DORA Protocol Animator & Lease Timer Simulator',
        description: 'Watch the step-by-step DORA packet exchange across client and server, inspect Option fields (1, 3, 6), and simulate lease timer countdowns (T1, T2, Expiration).',
      },
      step9_workedExample: {
        title: 'Analyzing DHCP Lease Timers for an 8-Hour Enterprise Lease',
        problemStatement: 'A DHCP server assigns a client an 8-hour lease (28,800 seconds) at 09:00 AM. Calculate: (1) T1 Renewal time, (2) T2 Rebind time, (3) Expiration time.',
        stepByStepSolution: [
          'Step 1 (T1 Renewal Timer): T1 = 50% of lease duration = $0.50 \\times 8 \\text{ hours} = 4 \\text{ hours}$. T1 triggers at 01:00 PM (Unicast Request to server).',
          'Step 2 (T2 Rebind Timer): T2 = 87.5% of lease duration = $0.875 \\times 8 \\text{ hours} = 7 \\text{ hours}$. T2 triggers at 04:00 PM (Broadcast Request to any server).',
          'Step 3 (Lease Expiration): Expiration = 100% = 8 hours. Expiration occurs at 05:00 PM (IP released; client falls back to APIPA).',
        ],
        finalResult: 'T1: 1:00 PM (4h) | T2: 4:00 PM (7h) | Expiration: 5:00 PM (8h).',
      },
      step10_realWorldScenario: {
        topology: 'Branch Office DHCP Relay Agent (ip helper-address)',
        scenarioText: 'A branch office has client PCs on VLAN 10 but the central DHCP server is in the datacenter across a router. Because routers drop broadcast packets (DHCP Discover), the engineer configures `ip helper-address 10.50.0.5` on the router interface, which converts client broadcast Discovers into unicast packets routed directly to the datacenter DHCP server.',
        engineeringContext: 'DHCP Relay (ip helper-address) allows one centralized DHCP server to serve multiple remote subnets.',
      },
      step11_deviceBehavior: {
        hostBehavior: 'Runs DHCP client daemon; initiates Discover on boot; renews at T1.',
        nicBehavior: 'Captures broadcast frames sent to FF:FF:FF:FF:FF:FF.',
        switchOrRouterBehavior: 'Routers do not forward DHCP broadcast frames unless configured with DHCP Relay / IP Helper.',
      },
      step12_cliTooling: [
        {
          command: 'ipconfig /renew',
          description: 'Forces the Windows DHCP client to send a DHCP Request and renew its IP lease parameters.',
          expectedOutput: 'Windows IP Configuration\n\nEthernet adapter Ethernet:\n   IPv4 Address. . . . . : 192.168.1.50\n   Subnet Mask . . . . . : 255.255.255.0\n   Default Gateway . . . : 192.168.1.1',
          proofExplanation: 'Confirms successful DHCP lease acquisition and interface configuration.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'Host displays APIPA address (169.254.x.x) after reboot.',
          possibleCauses: ['DHCP server pool exhausted, DHCP service offline, or router missing ip helper-address'],
          diagnosticSteps: ['Check DHCP server pool utilization and verify ip helper-address on router.'],
          remediation: 'Expand DHCP pool or restore DHCP server service.',
        },
      ],
      step14_commonMistakes: [
        { misconception: 'Assuming DHCP only assigns IP addresses.', correction: 'DHCP assigns complete network configurations: IP, Subnet Mask (Option 1), Default Gateway (Option 3), and DNS Servers (Option 6).' },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'Rogue DHCP Server & DHCP Starvation Attacks',
        mitigationStrategy: 'Enable DHCP Snooping on switches (`ip dhcp snooping`) to trust only authorized switchports and drop rogue DHCP Offers.',
      },
      step16_examPrep: {
        keyExamPoints: [
          'DORA: Discover (Broadcast), Offer (Unicast/Broadcast), Request (Broadcast), ACK (Unicast/Broadcast).',
          'UDP Port 67 (Server), UDP Port 68 (Client).',
          'DHCP Options: Option 1 (Mask), Option 3 (Gateway), Option 6 (DNS).',
          'T1 = 50%, T2 = 87.5%, Expiration = 100%.',
        ],
        frequentTraps: [
          'Confusing DHCP server port (67) with client port (68).',
        ],
      },
      step17_practicalLabRef: {
        title: 'Guided Practice: DHCP DORA Inspection & Lease Renewal Diagnostics',
        scenario: 'Execute ipconfig /release and /renew, inspect DORA messages, and verify option parameters.',
        tasks: ['Run ipconfig /release followed by ipconfig /renew.', 'Verify assigned IP, gateway, and DNS options.'],
        verificationMethod: 'Confirm valid lease parameters received from DHCP server.',
      },
      step18_masterySummary: {
        summaryPoints: [
          'DHCP automates IP configuration via the 4-step DORA exchange (UDP 67/68).',
          'Delivers essential options: Subnet Mask (1), Gateway (3), and DNS (6).',
          'Lease timers: T1 (50% renewal) and T2 (87.5% rebind).',
        ],
        nextLessonBridge:
          'Proceed to NET-203 Lesson 3 to master Address Resolution Protocol (ARP) & Layer 2/3 Binding.',
      },
    },
    questions: [
      {
        text: 'What are the four sequential messages exchanged between a client and a DHCP server during initial IP address lease acquisition?',
        options: [
          'Discover -> Offer -> Request -> Acknowledge (DORA)',
          'Request -> Reply -> Connect -> Finalize',
          'SYN -> SYN-ACK -> ACK -> FIN',
          'Query -> Lookup -> Resolve -> Bind',
        ],
        correctOption: 0,
        explanation: 'Initial DHCP lease acquisition follows the DORA sequence: DHCP Discover (Client broadcast), DHCP Offer (Server response), DHCP Request (Client commitment), and DHCP Acknowledge (Server finalization).',
        explanationsJson: { 1: 'Generic terms.', 2: 'That is the TCP handshake and teardown.', 3: 'Generic terms.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'DHCP DORA Workflow',
      },
    ],
    lab: {
      title: 'Guided Practice: DHCP DORA Inspection & Lease Renewal Diagnostics',
      instructions: '1. Run ipconfig /release.\n2. Run ipconfig /renew.\n3. Verify lease parameters.',
      difficulty: CourseLevel.FOUNDATIONAL,
      estimatedMinutes: 15,
      initialTopologyJson: { dhcpServer: '192.168.1.1', clientMac: '00:11:22:33:44:55' },
      tasks: ['Run ipconfig /renew.'],
    },
  },

  // -------------------------------------------------------------------------
  // 3. NET-203: Address Resolution Protocol (ARP) & Layer 2/3 Binding
  // -------------------------------------------------------------------------
  {
    courseCode: 'NET-203',
    slug: 'arp-protocol-overview',
    title: 'Address Resolution Protocol (ARP) & Layer 2/3 Binding',
    type: LessonType.THEORY,
    durationMinutes: 25,
    order: 3,
    visualizationType: 'ARP_FLOW_INSPECTOR',
    introduction:
      'Master the critical bridge between Layer 3 logical IP addressing and Layer 2 physical MAC addressing: ARP Request (Broadcast FF:FF:FF:FF:FF:FF, Opcode 1) vs ARP Reply (Unicast, Opcode 2), ARP Cache table mechanics, cache aging timeouts, Gratuitous ARP (GARP) for duplicate IP conflict detection, Proxy ARP, and why ARP broadcasts never cross a router boundary.',
    stepMetadata: {
      step1_objective:
        'Understand how ARP dynamically maps 32-bit IPv4 addresses to 48-bit Ethernet MAC addresses on local subnets, analyze ARP Request (broadcast) vs Reply (unicast) mechanics, inspect the local ARP table, and understand Gratuitous and Proxy ARP.',
      step2_prerequisites: ['net-201-level-0-mac-addresses-physical-identity', 'net-202-ipv4-addressing-cidr'],
      step3_whyItMatters:
        'Ethernet switches know nothing about IP addresses; they only forward frames based on destination MAC addresses. Without ARP, an IP host cannot construct an Ethernet frame to transmit data to local nodes or the default gateway.',
      step4_coreConcept:
        'The Address Resolution Protocol (ARP, RFC 826) resolves a known Layer 3 IPv4 address into a destination Layer 2 MAC address on the local subnet. When Host A needs to send data to Host B (`192.168.1.50`), Host A checks its local ARP Cache table. If no entry exists, Host A broadcasts an **ARP Request** (`ff:ff:ff:ff:ff:ff`, Opcode 1: "Who has IP 192.168.1.50? Tell 192.168.1.10"). All local hosts receive the frame, but only the host owning `192.168.1.50` responds with a unicast **ARP Reply** (Opcode 2: "I have 192.168.1.50, my MAC is 00:1A:2B:3C:4D:5E"). Host A stores this mapping in its ARP cache (with a 20–300s aging timer). **Gratuitous ARP (GARP)** is an unprompted ARP broadcast announcing own IP/MAC used for Duplicate Address Detection (DAD) and updating neighbor switch CAM tables. Routers NEVER forward ARP broadcasts across subnets.',
      step5_technicalAnatomy: {
        title: 'ARP Frame Structure, Opcodes & Cache Mechanics',
        description: 'ARP packet format, broadcast/unicast semantics, and cache table management.',
        components: [
          { name: 'Hardware Type & Protocol Type', detail: 'Hardware = 0x0001 (Ethernet); Protocol = 0x0800 (IPv4).' },
          { name: 'ARP Opcode (1 vs 2)', detail: 'Opcode 1 = ARP Request (Broadcast); Opcode 2 = ARP Reply (Unicast).' },
          { name: 'Sender & Target Addresses', detail: 'Sender MAC (6B), Sender IP (4B), Target MAC (6B, 00:00:00:00:00:00 in Request), Target IP (4B).' },
          { name: 'ARP Cache Table', detail: 'In-memory dynamic lookup table mapping IP -> MAC -> Interface with aging timer (20-300 seconds).' },
          { name: 'Gratuitous ARP (GARP)', detail: 'Sender and Target IP are identical. Broadcast upon boot to detect duplicate IP conflicts and update neighbor caches.' },
          { name: 'Proxy ARP (RFC 1027)', detail: 'Router replies with its own MAC on behalf of a remote target host when client is misconfigured.' },
        ],
      },
      step6_howItWorks: {
        steps: [
          { stepNumber: 1, title: 'ARP Cache Lookup', action: 'Host checks local ARP cache for destination IP `192.168.1.50`.' },
          { stepNumber: 2, title: 'ARP Request Broadcast', action: 'If missing, host encapsulates ARP Request in Ethernet frame with Destination MAC `ff:ff:ff:ff:ff:ff` and floods across local VLAN.' },
          { stepNumber: 3, title: 'Unicast ARP Reply', action: 'Target host inspects Request, learns sender IP/MAC, and sends unicast ARP Reply directly to sender MAC.' },
          { stepNumber: 4, title: 'Frame Encapsulation & Transmission', action: 'Sender caches target MAC and immediately transmits buffered IP payload frames.' },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'ARP Packet Format (Encapsulated in Ethernet EtherType 0x0806)',
        fields: [
          { fieldName: 'Hardware Type', bitLength: '16 bits', hexSample: '0x0001 (Ethernet)', description: 'Physical Layer 2 standard.' },
          { fieldName: 'Protocol Type', bitLength: '16 bits', hexSample: '0x0800 (IPv4)', description: 'Logical Layer 3 protocol.' },
          { fieldName: 'Opcode', bitLength: '16 bits', hexSample: '0x0001 (Req) / 0x0002 (Reply)', description: 'ARP message type.' },
          { fieldName: 'Sender MAC / IP', bitLength: '48 bits / 32 bits', hexSample: '00:11:22:33:44:55 / 192.168.1.10', description: 'Originator addresses.' },
          { fieldName: 'Target MAC / IP', bitLength: '48 bits / 32 bits', hexSample: '00:00:00:00:00:00 / 192.168.1.50', description: 'Target destination addresses.' },
        ],
        headerDiagramAscii: `
+-------------------------------------------------------------------------------+
|                    ARP REQUEST & REPLY TRANSACTION FLOW                       |
+-------------------------------------------------------------------------------+
|  [ HOST A ] (192.168.1.10)                       [ HOST B ] (192.168.1.50)    |
|       |                                               |                       |
|       | --- 1. ARP REQUEST (Broadcast: FF:FF:FF:FF:FF:FF) -----------------> |
|       |     "Who has 192.168.1.50? Tell 192.168.1.10 (MAC: 00:11:22...)"       |
|       |                                               |                       |
|       | <--- 2. ARP REPLY (Unicast: to 00:11:22...) --+                       |
|       |     "I am 192.168.1.50! My MAC is 00:1A:2B:3C:4D:5E"                  |
|       |                                               |                       |
|  [ Caches MAC in ARP Table ]                          |                       |
|       | --- 3. Transmits standard IP payload frame to Target MAC -----------> |
+-------------------------------------------------------------------------------+
`,
      },
      step8_visualExplanation: {
        type: 'ARP_FLOW_INSPECTOR',
        title: 'Interactive ARP Resolution & Cache Table Inspector',
        description: 'Watch an ARP Request broadcast across a switched VLAN, see non-target nodes drop the frame, observe the target return a unicast ARP Reply, and inspect dynamic ARP table updates.',
      },
      step9_workedExample: {
        title: 'Tracing ARP Resolution for Local Host vs Remote Off-Subnet Host',
        problemStatement: 'Host A (`192.168.1.10/24`) wants to send packets to:\n1. Host B (`192.168.1.50/24` - Local LAN)\n2. Server C (`8.8.8.8` - Remote Internet)\nWhich IP address does Host A query in its ARP Request for each case?',
        stepByStepSolution: [
          'Case 1 (Local Host): Host A ANDs `192.168.1.50` with /24 mask. Network ID is `192.168.1.0` (Local). Host A sends an ARP Request querying the MAC of `192.168.1.50`.',
          'Case 2 (Remote Host): Host A ANDs `8.8.8.8` with /24 mask. Network ID is `8.0.0.0` (Remote). Host A CANNOT ARP for 8.8.8.8 because ARP broadcasts do not cross routers.',
          '  Instead, Host A sends an ARP Request querying the MAC of its **Default Gateway** (`192.168.1.1`).',
          '  Host A encapsulates the packet to IP 8.8.8.8 inside an Ethernet frame with the **Gateway\'s Destination MAC**.',
        ],
        finalResult: 'Local: ARPs for target IP 192.168.1.50. Remote: ARPs for Default Gateway IP 192.168.1.1.',
      },
      step10_realWorldScenario: {
        topology: 'Duplicate IP Address Conflict Detection via Gratuitous ARP',
        scenarioText: 'A static IP `192.168.1.50` is manually assigned to a server that already belongs to a workstation. Upon boot, the server transmits a Gratuitous ARP (GARP). The workstation responds, and the server OS immediately disables its network interface and displays an "IP Address Conflict" warning, preventing service outage.',
        engineeringContext: 'Gratuitous ARP protects networks from catastrophic IP address duplication.',
      },
      step11_deviceBehavior: {
        hostBehavior: 'Stores learned mappings in ARP table; flushes dynamic entries after timeout.',
        nicBehavior: 'Captures broadcast ARP frames and delivers to OS network stack.',
        switchOrRouterBehavior: 'Switches flood ARP broadcast requests to all ports in VLAN; Routers drop ARP broadcasts and never forward them across subnets.',
      },
      step12_cliTooling: [
        {
          command: 'arp -a',
          description: 'Displays the current IPv4-to-MAC address mapping table (ARP cache) on Windows/Linux.',
          expectedOutput:
            'Interface: 192.168.1.10 --- 0x2\n  Internet Address      Physical Address      Type\n  192.168.1.1           00-11-22-33-44-55     dynamic\n  192.168.1.50          00-1a-2b-3c-4d-5e     dynamic\n  192.168.1.255         ff-ff-ff-ff-ff-ff     static',
          proofExplanation: 'Shows active dynamic IP-to-MAC bindings stored in local host memory.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'Host cannot communicate with local gateway after router hardware replacement.',
          possibleCauses: ['Host ARP cache holds stale MAC address of the old router hardware'],
          diagnosticSteps: ['Inspect ARP table with `arp -a`.'],
          remediation: 'Clear local ARP cache using `arp -d *` or `netsh interface ip delete arpcache`.',
        },
      ],
      step14_commonMistakes: [
        { misconception: 'Thinking ARP sends an ARP Request to the public Internet to find `google.com`.', correction: 'ARP operates strictly within the local Layer 2 broadcast domain. For remote destinations, the host ARPs for its Default Gateway MAC.' },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'ARP Poisoning / ARP Spoofing Man-in-the-Middle (MitM)',
        mitigationStrategy: 'Enable Dynamic ARP Inspection (DAI) on switches (`ip arp inspection vlan`) to validate ARP packets against the DHCP snooping binding database.',
      },
      step16_examPrep: {
        keyExamPoints: [
          'ARP Request = Broadcast (FF:FF:FF:FF:FF:FF, Opcode 1).',
          'ARP Reply = Unicast (Target MAC, Opcode 2).',
          'EtherType for ARP = 0x0806.',
          'For off-subnet traffic, host ARPs for the Default Gateway MAC, NOT the destination IP.',
        ],
        frequentTraps: [
          'Believing ARP crosses routers (Routers terminate broadcast domains and never forward ARP requests).',
        ],
      },
      step17_practicalLabRef: {
        title: 'Guided Practice: Local ARP Cache Inspection & Gateway Resolution',
        scenario: 'Execute arp -a, ping local and remote destinations, and trace ARP table additions.',
        tasks: ['Run arp -a before and after pinging default gateway.'],
        verificationMethod: 'Verify dynamic entry added for default gateway IP in ARP table.',
      },
      step18_masterySummary: {
        summaryPoints: [
          'ARP maps 32-bit IPv4 addresses to 48-bit MAC addresses on local subnets.',
          'Request is broadcast (Opcode 1); Reply is unicast (Opcode 2).',
          'Off-subnet traffic requires resolving the Default Gateway MAC.',
        ],
        nextLessonBridge:
          'Proceed to NET-203 Lesson 4 to see how DHCP, DNS, ARP, and TCP orchestrate together in the Integrated Host Boot-Up Lifecycle.',
      },
    },
    questions: [
      {
        text: 'When a host on subnet `192.168.1.0/24` needs to send an IP packet to remote public web server `93.184.216.34`, which device address does the host query in its ARP Request?',
        options: [
          'The IP address of its local Default Gateway (e.g. 192.168.1.1), because ARP broadcasts cannot cross a router boundary',
          'The public IP address 93.184.216.34 across the global Internet',
          'The MAC address of the root DNS server',
          'The broadcast address 255.255.255.255',
        ],
        correctOption: 0,
        explanation: 'Because 93.184.216.34 is on a remote subnet, the host knows it must route traffic through its Default Gateway. Since ARP broadcasts are confined to the local Layer 2 broadcast domain, the host ARPs for the Gateway\'s MAC address.',
        explanationsJson: { 1: 'ARP broadcasts cannot cross routers.', 2: 'DNS servers do not handle Layer 2 framing.', 3: 'Broadcast IP is not an ARP target.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'ARP for Off-Subnet Destinations',
      },
    ],
    lab: {
      title: 'Guided Practice: Local ARP Cache Inspection & Gateway Resolution',
      instructions: '1. Run arp -a.\n2. Ping gateway 192.168.1.1.\n3. Verify ARP table update.',
      difficulty: CourseLevel.FOUNDATIONAL,
      estimatedMinutes: 15,
      initialTopologyJson: { hostIp: '192.168.1.10', gatewayIp: '192.168.1.1' },
      tasks: ['Run arp -a.'],
    },
  },

  // -------------------------------------------------------------------------
  // 4. NET-203: The Integrated Host Boot-Up Lifecycle (dhcp-dns-overview)
  // -------------------------------------------------------------------------
  {
    courseCode: 'NET-203',
    slug: 'dhcp-dns-overview',
    title: 'The Integrated Host Boot-Up Lifecycle: From Cold Boot to Web Request',
    type: LessonType.THEORY,
    durationMinutes: 30,
    order: 4,
    visualizationType: 'BOOTUP_LIFECYCLE_TIMELINE',
    introduction:
      'Master the complete end-to-end orchestration of all core networking protocols in chronological sequence: Physical Link Up -> DHCP Lease Acquisition (DORA) -> Gratuitous ARP (Duplicate Address Detection) -> Default Gateway ARP Resolution -> DNS Name Resolution -> Outbound TCP Handshake & HTTPS GET Request.',
    stepMetadata: {
      step1_objective:
        'Understand the complete chronological sequence of network protocols executed when a host boots up, connects to a network, resolves names, and transmits its first application-layer packet.',
      step2_prerequisites: [
        'level-0-dns-internet-phonebook',
        'level-0-dhcp-automatic-ip-allocation',
        'arp-protocol-overview',
        'ethernet-mac-addresses-overview',
      ],
      step3_whyItMatters:
        'Network troubleshooting requires understanding how protocols interact sequentially. If a user cannot browse the web, knowing whether the failure occurred during DHCP leasing, ARP gateway resolution, DNS name translation, or TCP transport connection isolates the exact failure point.',
      step4_coreConcept:
        'When an unconfigured computer plugs an Ethernet cable into a switch and requests `https://api.example.com`, six distinct protocol phases execute in strict chronological orchestration: (1) **Physical Link Up**: PHY autonegotiation establishes 1 Gbps Full-Duplex Layer 1/2 connectivity. (2) **DHCP Lease (DORA)**: Client broadcasts Discover -> receives Offer -> sends Request -> receives ACK with IP `192.168.1.50`, Mask `/24`, Gateway `192.168.1.1`, DNS `8.8.8.8`. (3) **Duplicate Address Detection (GARP)**: Client broadcasts Gratuitous ARP for `192.168.1.50`; zero replies verify IP uniqueness. (4) **Default Gateway ARP Resolution**: Client evaluates `8.8.8.8` (Remote); sends ARP Request for Gateway `192.168.1.1` -> receives Gateway MAC `00:11:22:33:44:55`. (5) **DNS Name Resolution**: Client sends DNS UDP query for `api.example.com` to `8.8.8.8:53` via Gateway MAC -> receives DNS Answer `93.184.216.34`. (6) **Transport Handshake & HTTP Request**: Client sends TCP SYN to `93.184.216.34:443` via Gateway MAC -> completes 3-way handshake -> sends TLS/HTTPS GET request.',
      step5_technicalAnatomy: {
        title: 'The 6-Phase Protocol Orchestration Architecture',
        description: 'Chronological timeline, protocols involved, and packet header transitions.',
        components: [
          { name: 'Phase 1: Physical Link Up & Carrier Detect', detail: 'PHY transceiver electrical autonegotiation establishes link pulse synchronization and full-duplex operation.' },
          { name: 'Phase 2: DHCP DORA Lease Acquisition', detail: 'Client acquires IP parameters (IP, Subnet Mask, Default Gateway, DNS Servers) via UDP ports 67/68.' },
          { name: 'Phase 3: Gratuitous ARP / Duplicate Address Detection', detail: 'Client broadcasts ARP Probe for its newly leased IP to ensure zero address conflict with other LAN nodes.' },
          { name: 'Phase 4: Default Gateway ARP Resolution', detail: 'Client sends ARP Request for Default Gateway IP `192.168.1.1` to obtain Gateway MAC `00:11:22:33:44:55`.' },
          { name: 'Phase 5: DNS Recursive Name Resolution', detail: 'Client sends UDP query on port 53 to DNS server `8.8.8.8` (framed to Gateway MAC) to resolve `api.example.com` to `93.184.216.34`.' },
          { name: 'Phase 6: TCP Handshake & HTTPS Application Session', detail: 'Client initiates TCP 3-Way Handshake (SYN -> SYN-ACK -> ACK) to `93.184.216.34:443` and begins HTTPS session.' },
        ],
      },
      step6_howItWorks: {
        steps: [
          { stepNumber: 1, title: 'Phase 1 (Link Up)', action: 'Cable plugged in; switch port transitions to Up/Up; MAC learned in CAM table.' },
          { stepNumber: 2, title: 'Phase 2 (DHCP DORA)', action: 'Client broadcasts Discover from 0.0.0.0; server returns ACK with IP 192.168.1.50, Mask /24, Gateway 192.168.1.1, DNS 8.8.8.8.' },
          { stepNumber: 3, title: 'Phase 3 (GARP DAD)', action: 'Client broadcasts Gratuitous ARP for 192.168.1.50 to verify no other host claims the address.' },
          { stepNumber: 4, title: 'Phase 4 (Gateway ARP)', action: 'Client sends ARP Request for Gateway 192.168.1.1; Gateway returns unicast ARP Reply with its MAC.' },
          { stepNumber: 5, title: 'Phase 5 (DNS Query)', action: 'Client encapsulates DNS query for `api.example.com` into UDP packet to 8.8.8.8, framed to Gateway MAC.' },
          { stepNumber: 6, title: 'Phase 6 (TCP SYN & HTTP)', action: 'Client receives IP 93.184.216.34 and transmits TCP SYN packet framed to Gateway MAC.' },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'Lifecycle Protocol Headers in Sequence',
        fields: [
          { fieldName: '1. DHCP Discover', bitLength: 'UDP 67/68', hexSample: 'Src: 0.0.0.0 Dst: 255.255.255.255', description: 'Acquires network configuration.' },
          { fieldName: '2. Gateway ARP', bitLength: 'EtherType 0x0806', hexSample: 'Who has 192.168.1.1?', description: 'Resolves Gateway MAC.' },
          { fieldName: '3. DNS Query', bitLength: 'UDP 53', hexSample: 'Query: api.example.com', description: 'Resolves destination IP.' },
          { fieldName: '4. TCP SYN', bitLength: 'TCP 443', hexSample: 'SYN Flag = 1', description: 'Initiates application connection.' },
        ],
        headerDiagramAscii: `
+-------------------------------------------------------------------------------+
|                 THE INTEGRATED HOST BOOT-UP PROTOCOL LIFECYCLE                |
+-------------------------------------------------------------------------------+
| [1. Link Up]  --> Cable insertion & PHY autonegotiation                      |
|      v                                                                        |
| [2. DHCP]     --> Discover -> Offer -> Request -> ACK (IP: 192.168.1.50)      |
|      v                                                                        |
| [3. GARP]     --> Gratuitous ARP broadcast for 192.168.1.50 (Verify Unique)   |
|      v                                                                        |
| [4. Gateway]  --> ARP Request for 192.168.1.1 -> Receives Gateway MAC        |
|      v                                                                        |
| [5. DNS]      --> UDP Query to 8.8.8.8:53 -> Receives IP 93.184.216.34        |
|      v                                                                        |
| [6. TCP/HTTP] --> TCP SYN -> SYN-ACK -> ACK -> HTTPS GET to 93.184.216.34:443 |
+-------------------------------------------------------------------------------+
`,
      },
      step8_visualExplanation: {
        type: 'BOOTUP_LIFECYCLE_TIMELINE',
        title: 'Interactive Host Boot-Up Lifecycle & Protocol Sequence Engine',
        description: 'Step through the 6 chronological phases from cold cable plug-in to web browser HTTP GET request, inspecting packet headers, MAC/IP mappings, and socket states.',
      },
      step9_workedExample: {
        title: 'Analyzing Frame Headers During an Outbound HTTPS Request',
        problemStatement: 'When a host (`192.168.1.50`, MAC `00:AA`) sends an HTTPS packet to `93.184.216.34` via Gateway `192.168.1.1` (MAC `00:BB`):\n1. What is the Source IP and Destination IP in the Layer 3 header?\n2. What is the Source MAC and Destination MAC in the Layer 2 header?',
        stepByStepSolution: [
          'Step 1 (Layer 3 IP Header): Source IP is the originating client (`192.168.1.50`). Destination IP is the ultimate web server (`93.184.216.34`). IP addresses DO NOT change across router hops.',
          'Step 2 (Layer 2 Ethernet Header): Source MAC is the client NIC (`00:AA`). Destination MAC is the local **Default Gateway router interface** (`00:BB`). MAC addresses change at every router hop.',
        ],
        finalResult: 'L3: 192.168.1.50 -> 93.184.216.34 | L2: 00:AA -> 00:BB (Gateway MAC).',
      },
      step10_realWorldScenario: {
        topology: 'Enterprise Network Outage Root-Cause Lifecycle Isolation',
        scenarioText: 'A user cannot open web portals. The engineer traces the lifecycle: (1) Link is Up (L1 OK), (2) DHCP leased IP `192.168.1.50` (DHCP OK), (3) Gateway ARP resolved MAC (L2 OK), (4) DNS query to `8.8.8.8` timed out (DNS Failure!). The engineer updates the DHCP server DNS option to `1.1.1.1`, resolving the issue immediately.',
        engineeringContext: 'Lifecycle isolation identifies exactly which protocol layer failed.',
      },
      step11_deviceBehavior: {
        hostBehavior: 'Executes protocol finite state machine in chronological sequence.',
        nicBehavior: 'Captures and filters physical wire frames.',
        switchOrRouterBehavior: 'Switches forward Layer 2 frames; Routers receive frames destined to their MAC, strip L2 header, decrement TTL, and re-encapsulate for next hop.',
      },
      step12_cliTooling: [
        {
          command: 'powershell -Command "ipconfig /all; arp -a; Resolve-DnsName google.com; Test-NetConnection google.com -Port 443"',
          description: 'Executes comprehensive full-stack lifecycle diagnostic sequence from IP lease to DNS and TCP port 443 verification.',
          expectedOutput:
            'IPv4 Address . . . : 192.168.1.50\nDefault Gateway. . : 192.168.1.1\nIPAddress : 142.250.190.46\nTcpTestSucceeded : True',
          proofExplanation: 'Proves complete operational health across all 6 lifecycle stages.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'User cannot connect to internal web application after boot.',
          possibleCauses: ['Failure at any of the 6 lifecycle stages (Link, DHCP, ARP, DNS, TCP)'],
          diagnosticSteps: [
            '1. Check link LED.',
            '2. Run `ipconfig` (check for APIPA).',
            '3. Ping default gateway (tests ARP/L2).',
            '4. Ping public IP (tests L3 routing).',
            '5. Resolve domain name (tests DNS).',
            '6. Test port 443 (tests TCP).',
          ],
          remediation: 'Remediate the specific stage that failed the sequential diagnostic.',
        },
      ],
      step14_commonMistakes: [
        { misconception: 'Believing the Destination MAC address of an outbound web packet is the MAC address of Google\'s server.', correction: 'MAC addresses are hop-to-hop local. The Destination MAC is ALWAYS the local Default Gateway router interface.' },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'Lifecycle Multi-Stage Hijacking Attacks',
        mitigationStrategy: 'Deploy 802.1X (Phase 1), DHCP Snooping (Phase 2), Dynamic ARP Inspection (Phase 3/4), DNSSEC (Phase 5), and TLS 1.3 (Phase 6).',
      },
      step16_examPrep: {
        keyExamPoints: [
          'Know the 6 phases in exact order: Link -> DHCP -> GARP -> Gateway ARP -> DNS -> TCP/HTTP.',
          'In off-subnet packets: Destination IP is remote server; Destination MAC is Default Gateway router.',
        ],
        frequentTraps: [
          'Thinking DNS resolution occurs before DHCP lease acquisition (a host cannot perform DNS without an IP address!).',
        ],
      },
      step17_practicalLabRef: {
        title: 'Guided Practice: Full-Stack Host Boot-Up Lifecycle Trace & Packet Forensics',
        scenario: 'Trace the end-to-end packet sequence from cold boot to HTTPS GET request.',
        tasks: ['Execute full lifecycle diagnostic script.', 'Verify MAC vs IP destination headers.'],
        verificationMethod: 'Confirm TCP test succeeds to port 443.',
      },
      step18_masterySummary: {
        summaryPoints: [
          'Network boot-up orchestrates 6 protocols in strict sequence.',
          'Destination IP identifies ultimate target; Destination MAC identifies next-hop gateway.',
        ],
        nextLessonBridge:
          'Proceed to NET-203 Lesson 5 to master IPv6 Addressing Foundations & SLAAC.',
      },
    },
    questions: [
      {
        text: 'What is the correct chronological sequence of protocol events that must execute when an unconfigured computer boots up, connects to Ethernet, and sends its first HTTPS web request?',
        options: [
          'Physical Link Up -> DHCP Lease Acquisition -> Gratuitous ARP (DAD) -> Default Gateway ARP Resolution -> DNS Name Resolution -> Outbound TCP 3-Way Handshake & HTTPS GET',
          'HTTPS GET -> DNS Resolution -> TCP Handshake -> DHCP Lease -> Physical Link Up',
          'DNS Resolution -> Default Gateway ARP -> DHCP Lease -> Physical Link Up -> TCP Handshake',
          'Default Gateway ARP -> DNS Resolution -> Physical Link Up -> DHCP Lease -> HTTPS GET',
        ],
        correctOption: 0,
        explanation: 'A host must first establish Physical Link Up, acquire its IP/gateway/DNS configuration via DHCP, verify IP uniqueness via Gratuitous ARP, resolve the Gateway MAC via ARP, resolve the domain name via DNS, and finally initiate the TCP handshake and HTTPS GET request.',
        explanationsJson: { 1: 'Reversed order.', 2: 'DNS requires an IP address first.', 3: 'Physical link must precede all packets.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Integrated Host Boot-Up Sequence',
      },
    ],
    lab: {
      title: 'Guided Practice: Full-Stack Host Boot-Up Lifecycle Trace & Packet Forensics',
      instructions: '1. Trace 6 boot phases.\n2. Verify TCP test to port 443.',
      difficulty: CourseLevel.FOUNDATIONAL,
      estimatedMinutes: 20,
      initialTopologyJson: { hostIp: '192.168.1.50', gatewayIp: '192.168.1.1', dnsServer: '8.8.8.8', webTarget: '93.184.216.34' },
      tasks: ['Execute full lifecycle diagnostics.'],
    },
  },

  // -------------------------------------------------------------------------
  // 5. NET-203: IPv6 Addressing Architecture, SLAAC & Dual-Stack
  // -------------------------------------------------------------------------
  {
    courseCode: 'NET-203',
    slug: 'ipv6-foundations-overview',
    title: 'IPv6 Addressing Architecture, SLAAC & Dual-Stack Foundations',
    type: LessonType.THEORY,
    durationMinutes: 30,
    order: 5,
    visualizationType: 'IPV6_COMPRESSOR_ENGINE',
    introduction:
      'Master the next-generation internetworking protocol: 128-bit IPv6 address architecture, hexadecimal hextet formatting, RFC 5952 canonical zero-compression rules, Global Unicast (GUA 2000::/3) vs Link-Local (LLA fe80::/10) vs Unique Local (ULA fc00::/7), Stateless Address Autoconfiguration (SLAAC RS/RA workflow), Neighbor Discovery Protocol (NDP), and Dual-Stack coexistence.',
    contentV2: {
      objective:
        'Master 128-bit IPv6 addressing and hexadecimal hextet notation, apply RFC 5952 zero compression rules, classify IPv6 address scopes (Global Unicast, Link-Local, Multicast, Anycast, Unique Local), understand Neighbor Discovery Protocol (RS/RA/NS/NA), trace SLAAC autoconfiguration and Duplicate Address Detection (DAD), and evaluate Dual-Stack coexistence.',
      prerequisites: ['net-202-ipv4-addressing-cidr', 'net-101-bits-bytes-binary-hex'],
      whyItMatters:
        'The global 32-bit IPv4 address pool (~4.3 billion addresses) is exhausted. Modern 5G mobile networks, cloud providers, hyperscale data centers, and internet service providers deploy native IPv6 (3.4 × 10³⁸ addresses) to provide every device on Earth with a globally unique routable address without NAT workarounds.',
      explanation:
        'IPv6 expands address space to 128 bits, written as 8 hexadecimal hextets separated by colons (`2001:0db8:0000:0000:0000:0000:0000:0001`). RFC 5952 defines two compression rules: (1) omit leading zeros in every hextet (`:0db8:` -> `:db8:`), (2) replace the longest contiguous run of all-zero hextets with a single double-colon `::` (allowed only ONCE). An IPv6 unicast address consists of a 64-bit Network Prefix and a 64-bit Interface Identifier. Key address types: Global Unicast (GUA `2000::/3`, globally routable), Link-Local (LLA `fe80::/10`, auto-generated on every interface for local link communication), Multicast (`ff00::/8`, replaces broadcast with targeted groups like `ff02::1` All-Nodes and `ff02::2` All-Routers), Anycast (one-to-nearest routing), and Unique Local (ULA `fc00::/7`, private enterprise routing). Neighbor Discovery Protocol (NDP) replaces ARP and DHCP for basic configuration using ICMPv6: hosts multicast Router Solicitations (RS, Type 133) and routers respond with Router Advertisements (RA, Type 134). Under Stateless Address Autoconfiguration (SLAAC, RFC 4862), the host autonomously combines the advertised /64 prefix with its 64-bit Interface ID and verifies uniqueness via Duplicate Address Detection (DAD) using Neighbor Solicitations (NS, Type 135). Dual-stack operation enables hosts and routers to run IPv4 and IPv6 concurrently during global adoption.',
      components: [
        { name: '128-Bit Structure (8 Hextets)', detail: '8 groups of 16 bits each (8 × 16 = 128 bits), written as 4 hexadecimal digits per hextet separated by colons.' },
        { name: 'RFC 5952 Compression Rules', detail: 'Rule 1: Drop leading zeros (0042 -> 42). Rule 2: Single :: replaces the longest contiguous run of multiple all-zero hextets.' },
        { name: 'Prefix vs Interface ID (/64)', detail: 'First 64 bits identify the subnet/routing path; remaining 64 bits identify the host NIC (Interface ID).' },
        { name: 'Global Unicast Address (GUA)', detail: 'Prefix: 2000::/3 (2000:: to 3fff::). Publicly routable across the global Internet.' },
        { name: 'Link-Local Address (LLA)', detail: 'Prefix: fe80::/10 (fe80:: to febf::). Required on every IPv6 interface; used for local subnet routing and NDP; never routed.' },
        { name: 'Multicast & Anycast', detail: 'Multicast (ff00::/8) replaces broadcast (ff02::1 All-Nodes, ff02::2 All-Routers). Anycast delivers to the nearest recipient sharing the same address.' },
        { name: 'Unique Local Address (ULA)', detail: 'Prefix: fc00::/7 (typically fd00::/8). Private enterprise internal address space analogous to RFC 1918 IPv4.' },
        { name: 'SLAAC (Stateless Autoconfiguration)', detail: 'Host derives its GUA autonomously by combining the /64 prefix from an ICMPv6 Router Advertisement (RA) with its Interface ID.' },
        { name: 'Duplicate Address Detection (DAD)', detail: 'Host sends ICMPv6 Neighbor Solicitation (NS) for its own tentative address to verify uniqueness before binding.' },
        { name: 'DHCPv6 vs SLAAC', detail: 'SLAAC provides stateless prefix allocation; DHCPv6 can operate in stateless mode (options only like DNS) or stateful mode (managed address leases).' },
        { name: 'Dual-Stack Coexistence', detail: 'Hosts and routers maintain concurrent IPv4 and IPv6 protocol stacks on the same physical interfaces.' },
      ],
      howItWorks: [
        { stepNumber: 1, title: 'Link-Local Address Self-Generation', action: 'On interface activation, the host automatically assigns a Link-Local address (fe80::...) to enable local link communication.' },
        { stepNumber: 2, title: 'Router Solicitation (RS - ICMPv6 Type 133)', action: 'Host multicasts an ICMPv6 Router Solicitation to ff02::2 (All-Routers multicast) requesting local network prefix configuration.' },
        { stepNumber: 3, title: 'Router Advertisement (RA - ICMPv6 Type 134)', action: 'Local router responds with an ICMPv6 Router Advertisement to ff02::1 (All-Nodes multicast) containing the /64 subnet prefix and default gateway address.' },
        { stepNumber: 4, title: 'SLAAC Address Formation & DAD Validation', action: 'Host combines the /64 prefix with its 64-bit Interface ID to form its Global Unicast Address, then verifies uniqueness via Duplicate Address Detection (DAD).' },
      ],
      visualizer: {
        type: 'IPV6_COMPRESSOR_ENGINE',
        title: 'Interactive RFC 5952 IPv6 Zero Compressor & SLAAC Animator',
        description: 'Input uncompressed IPv6 addresses to see canonical RFC 5952 zero compression applied live, explore address scopes, and trace the SLAAC RS/RA autoconfiguration exchange.',
      },
      workedExample: {
        title: 'Compressing `2001:0db8:0000:0000:0000:0000:0000:0001` per RFC 5952',
        problemStatement: 'Compress IPv6 address `2001:0db8:0000:0000:0000:0000:0000:0001` to canonical RFC 5952 form.',
        stepByStepSolution: [
          'Step 1 (Omit Leading Zeros): Hextet 2 (0db8 -> db8). Hextet 8 (0001 -> 1). Address becomes 2001:db8:0:0:0:0:0:1.',
          'Step 2 (Double-Colon Replacement): Hextets 3 through 7 are all zeros (5 contiguous zero hextets). Replace with ::.',
          'Result: 2001:db8::1.',
        ],
        finalResult: '`2001:db8::1` is the official canonical compressed format.',
      },
      recap: [
        'IPv6 provides 128-bit addresses (3.4 × 10³⁸) to overcome IPv4 exhaustion.',
        'RFC 5952 defines canonical compression: drop leading zeros and use a single :: for the longest contiguous zero run.',
        'Address scopes separate Global Unicast (GUA 2000::/3), Link-Local (LLA fe80::/10), Multicast (ff00::/8), and Unique Local (ULA fc00::/7).',
        'SLAAC enables autonomous host configuration via ICMPv6 Router Solicitations and Router Advertisements with DAD validation.',
        'Dual-Stack allows seamless concurrent IPv4 and IPv6 operation during global adoption.',
      ],
    },
    questions: [
      {
        text: 'According to official RFC 5952 rules for canonical IPv6 address representation, what is the correct compressed format for `2001:0db8:0000:0000:0000:0000:0000:0001`?',
        options: [
          '2001:db8::1',
          '2001:0db8::1',
          '2001:db8:0:0:0:0:0:1',
          '2001::db8::1',
        ],
        correctOption: 0,
        explanation: 'RFC 5952 requires omitting leading zeros in every hextet (`0db8` -> `db8`) and replacing the longest run of contiguous all-zero hextets with a single double-colon `::`, producing `2001:db8::1`. The double-colon `::` can only appear once in an address.',
        explanationsJson: {
          1: 'Incorrect: Retains invalid leading zero (`0db8` instead of `db8`).',
          2: 'Incorrect: Did not apply double-colon compression to the 5 consecutive zero hextets.',
          3: 'Incorrect: Double-colon `::` cannot appear multiple times in the same address.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'RFC 5952 IPv6 Zero Compression Rules',
      },
      {
        text: 'In Stateless Address Autoconfiguration (SLAAC), what ICMPv6 message does a host multicast to `ff02::2` when joining the network, and how does the router respond?',
        options: [
          'Host sends Router Solicitation (RS, Type 133); router responds with Router Advertisement (RA, Type 134) containing the /64 network prefix.',
          'Host sends Neighbor Solicitation (NS, Type 135); router responds with DHCPv6 Lease Offer on UDP port 546.',
          'Host sends ARP Request (Broadcast); router responds with IPv6 Address Assignment.',
          'Host sends Router Advertisement (RA, Type 134); router responds with Router Solicitation (RS, Type 133).',
        ],
        correctOption: 0,
        explanation: 'In SLAAC (RFC 4862), the host multicasts an ICMPv6 Router Solicitation (RS, Type 133) to the All-Routers multicast group (`ff02::2`). The local router responds with a Router Advertisement (RA, Type 134) containing the /64 prefix and default gateway configuration.',
        explanationsJson: {
          1: 'Incorrect: NS is used for neighbor MAC resolution and DAD, not router discovery in SLAAC.',
          2: 'Incorrect: IPv6 does not use ARP; it uses ICMPv6 Neighbor Discovery Protocol (NDP).',
          3: 'Incorrect: The host sends the Router Solicitation (RS), and the router replies with the Router Advertisement (RA).',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'SLAAC RS/RA Message Exchange',
      },
      {
        text: 'A network administrator observes an address beginning with `fe80::1a2b:3c4d:5e6f:7a8b`. Which IPv6 address scope does this belong to, and what is its operational boundary?',
        options: [
          'Link-Local Address (fe80::/10) — used strictly for local subnet communications and never routed across router hops.',
          'Global Unicast Address (2000::/3) — publicly routable across the worldwide Internet.',
          'Unique Local Address (fc00::/7) — routable across private enterprise intranets.',
          'Multicast Address (ff00::/8) — delivered to a group of subscribed endpoints.',
        ],
        correctOption: 0,
        explanation: 'Addresses in the `fe80::/10` prefix range are Link-Local Addresses (LLAs). They are automatically configured on every enabled IPv6 interface, are mandatory for local routing/NDP, and are dropped by routers at the subnet boundary.',
        explanationsJson: {
          1: 'Incorrect: Global Unicast Addresses use the `2000::/3` prefix range.',
          2: 'Incorrect: Unique Local Addresses use the `fc00::/7` (typically `fd00::/8`) prefix range.',
          3: 'Incorrect: Multicast Addresses begin with the `ff00::/8` prefix.',
        },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'IPv6 Address Scope Classification (LLA vs GUA vs ULA)',
      },
      {
        text: 'Troubleshooting: A newly deployed workstation has automatically generated a valid Link-Local address (`fe80::50fa:ddff:fe12:3456`), but fails to generate a Global Unicast Address (GUA) and cannot reach external IPv6 services. What is the most likely root cause?',
        options: [
          'The default gateway router does not have IPv6 routing enabled (`ipv6 unicast-routing`), so it is not sending ICMPv6 Router Advertisements.',
          'The workstation failed DHCP DORA 4-way broadcast negotiation with the IPv4 DHCP server.',
          'The workstation did not receive an ARP Reply from the default gateway router.',
          'The workstation interface identifier exceeded the 32-bit subnet mask boundary.',
        ],
        correctOption: 0,
        explanation: 'Every IPv6 host can generate a Link-Local address (`fe80::/10`) independently on its own NIC. However, to formulate a Global Unicast Address via SLAAC, it must receive an ICMPv6 Router Advertisement (RA) from a local router. If `ipv6 unicast-routing` is disabled on the router, RA messages are never sent, preventing SLAAC GUA creation.',
        explanationsJson: {
          1: 'Incorrect: SLAAC is an autonomous stateless IPv6 mechanism that does not depend on IPv4 DHCP DORA.',
          2: 'Incorrect: IPv6 uses ICMPv6 Neighbor Discovery Protocol (NDP), not ARP.',
          3: 'Incorrect: IPv6 uses 64-bit interface identifiers and /64 prefix boundaries, not 32-bit subnet masks.',
        },
        difficulty: CourseLevel.INTERMEDIATE,
        cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Diagnosing SLAAC Router Advertisement Failures',
      },
    ],
    lab: {
      title: 'Guided Practice: IPv6 Zero Compression & SLAAC Interface Verification',
      instructions:
        '1. Inspect incoming ICMPv6 Router Advertisement (RA) from default gateway Router-1.\n2. Extract advertised /64 prefix (2001:db8:acad:1::/64).\n3. Combine /64 prefix with 64-bit Interface ID to form Global Unicast Address (GUA).\n4. Perform Duplicate Address Detection (DAD) via Neighbor Solicitation (NS).\n5. Verify active IPv6 interfaces and link-local reachability.',
      difficulty: CourseLevel.FOUNDATIONAL,
      estimatedMinutes: 15,
      initialTopologyJson: {
        hostLla: 'fe80::1a2b:3c4d:5e6f:7a8b',
        routerLla: 'fe80::1',
        advertisedPrefix: '2001:db8:acad:1::/64',
        generatedGua: '2001:db8:acad:1:1a2b:3c4d:5e6f:7a8b',
        multicastAllRouters: 'ff02::2',
        multicastAllNodes: 'ff02::1',
      },
      tasks: [
        'Inspect ICMPv6 Router Advertisement on interface eth0.',
        'Derive 128-bit Global Unicast Address using SLAAC /64 prefix.',
        'Execute Duplicate Address Detection (DAD) verification.',
        'Confirm IPv6 default gateway binding to fe80::1.',
      ],
    },
  },

  // =========================================================================
  // COURSE: NET-204 (Transport Layer Protocols: TCP & UDP)
  // =========================================================================

  // -------------------------------------------------------------------------
  // 6. NET-204: Network Ports, Socket Endpoints & Layer 4 Multiplexing
  // -------------------------------------------------------------------------
  {
    courseCode: 'NET-204',
    slug: 'level-0-network-ports-socket-boundaries',
    title: 'Network Ports, Socket Endpoints & Layer 4 Multiplexing',
    type: LessonType.THEORY,
    durationMinutes: 25,
    order: 1,
    visualizationType: 'SOCKET_MULTIPLEXER',
    introduction:
      'Master Transport Layer process addressing: 16-bit port number architecture (0 to 65535), Port classification bands (Well-Known 0-1023, Registered 1024-49151, Ephemeral/Dynamic 49152-65535), Socket definition (IP Address + Port Number + Protocol), Socket Pairs, and Layer 4 Port Multiplexing / Demultiplexing mechanics.',
    stepMetadata: {
      step1_objective:
        'Understand 16-bit transport port numbers, differentiate between Well-Known, Registered, and Dynamic/Ephemeral port ranges, define a Socket and Socket Pair, and analyze Layer 4 Multiplexing and Demultiplexing.',
      step2_prerequisites: ['net-202-ipv4-addressing-cidr'],
      step3_whyItMatters:
        'A computer has only one physical network card and one IP address. Without transport ports, an operating system could not simultaneously run a web browser, Spotify, email client, and SSH session without data streams colliding.',
      step4_coreConcept:
        'Transport Layer Ports are 16-bit unsigned integers ($0 \\text{ to } 65535$) used to identify specific software application processes running on a host. Port numbers are classified into three official IANA ranges: (1) **Well-Known Ports** ($0 \\text{ to } 1023$): Reserved for standardized system services (HTTP 80, HTTPS 443, DNS 53, SSH 22, DHCP 67/68, NTP 123). (2) **Registered Ports** ($1024 \\text{ to } 49151$): Assigned by IANA for specific vendor applications (MySQL 3306, RDP 3389, PostgreSQL 5432). (3) **Dynamic / Ephemeral Ports** ($49152 \\text{ to } 65535$): Allocated temporarily by the client operating system for outgoing connections. A **Socket** is the combination of $\\text{IP Address} + \\text{Port Number} + \\text{Protocol}$ (e.g. `192.168.1.50:51234 TCP`). A **Socket Pair** (4-tuple: Source IP, Source Port, Destination IP, Destination Port) uniquely identifies every active end-to-end conversation across the Internet. **Port Multiplexing** allows hundreds of distinct application sockets to share a single physical NIC.',
      step5_technicalAnatomy: {
        title: 'Port Classification Ranges, Socket Definitions & Multiplexing',
        description: 'IANA port ranges, socket data structures, and transport multiplexing mechanics.',
        components: [
          { name: 'Well-Known Ports (0 – 1023)', detail: 'Privileged system services: HTTP (80), HTTPS (443), DNS (53), SSH (22), Telnet (23), SMTP (25), DHCP (67/68), NTP (123).' },
          { name: 'Registered Ports (1024 – 49151)', detail: 'User and application processes: MySQL (3306), RDP (3389), PostgreSQL (5432), SIP (5060).' },
          { name: 'Dynamic / Ephemeral Ports (49152 – 65535)', detail: 'Client OS auto-allocated ports for transient outbound connections; recycled upon connection close.' },
          { name: 'Socket & Socket Pair (4-Tuple)', detail: 'Socket = IP:Port:Proto. Socket Pair = $\\{\\text{Src IP:Port}, \\text{Dst IP:Port}\\}$ uniquely identifying the communication channel.' },
          { name: 'Multiplexing & Demultiplexing', detail: 'Multiplexing gathers data from multiple sockets onto one NIC; Demultiplexing delivers incoming packets to the correct application socket based on destination port.' },
        ],
      },
      step6_howItWorks: {
        steps: [
          { stepNumber: 1, title: 'Server Binding', action: 'Web server binds socket to `0.0.0.0:443 TCP` and enters listening state.' },
          { stepNumber: 2, title: 'Client Ephemeral Allocation', action: 'Browser opens connection, OS assigns ephemeral port `51234`, creating Socket `192.168.1.50:51234`.' },
          { stepNumber: 3, title: 'Socket Pair Creation', action: 'Socket Pair `192.168.1.50:51234 <-> 93.184.216.34:443 TCP` established.' },
          { stepNumber: 4, title: 'Demultiplexing on Ingress', action: 'When packet returns with destination port 51234, OS kernel demultiplexes payload directly to the browser process.' },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'Transport Layer Port Fields (TCP & UDP)',
        fields: [
          { fieldName: 'Source Port', bitLength: '16 bits (2 Bytes)', hexSample: '0xC822 (51234)', description: 'Client ephemeral port.' },
          { fieldName: 'Destination Port', bitLength: '16 bits (2 Bytes)', hexSample: '0x01BB (443)', description: 'Server well-known service port.' },
        ],
        headerDiagramAscii: `
+-------------------------------------------------------------------------------+
|                      LAYER 4 PORT MULTIPLEXING & DEMULTIPLEXING               |
+-------------------------------------------------------------------------------+
|   [ Browser Tab 1 ]       [ Spotify App ]         [ SSH Client ]              |
|   (Port: 51234)           (Port: 51235)           (Port: 51236)               |
|          \\                      |                      /                      |
|           v                     v                     v                       |
|   +-------------------------------------------------------+                   |
|   |         OS KERNEL TRANSPORT LAYER (Multiplexing)      |                   |
|   +-------------------------------------------------------+                   |
|                             |                                                 |
|                             v                                                 |
|   [ SINGLE PHYSICAL NIC & SINGLE IP ADDRESS: 192.168.1.50 ]                   |
|                             |                                                 |
|   (Incoming packets demultiplexed to correct application by Destination Port) |
+-------------------------------------------------------------------------------+
`,
      },
      step8_visualExplanation: {
        type: 'SOCKET_MULTIPLEXER',
        title: 'Interactive Socket Multiplexer & Port Inspection Engine',
        description: 'Observe multiple client browser tabs and background applications multiplexing across a single IP address, and watch the OS kernel demultiplex returning packets to their exact socket.',
      },
      step9_workedExample: {
        title: 'Differentiating Multiple Browser Tabs to the Same Web Server',
        problemStatement: 'A user opens two separate tabs in Chrome to `https://example.com` (`93.184.216.34:443`). How does the client OS differentiate returning web traffic for Tab 1 vs Tab 2?',
        stepByStepSolution: [
          'Tab 1 Socket Pair: `192.168.1.50:51234 <-> 93.184.216.34:443 TCP`.',
          'Tab 2 Socket Pair: `192.168.1.50:51235 <-> 93.184.216.34:443 TCP`.',
          'Even though the Destination IP (`93.184.216.34`), Destination Port (`443`), and Source IP (`192.168.1.50`) are identical, the client OS allocated unique ephemeral source ports (`51234` vs `51235`).',
          'Returning packets for Tab 1 have Destination Port `51234`; returning packets for Tab 2 have Destination Port `51235`.',
        ],
        finalResult: 'Unique ephemeral source ports make each socket pair globally distinct.',
      },
      step10_realWorldScenario: {
        topology: 'NAT Router Port Address Translation (PAT) / NAPT',
        scenarioText: 'An office of 500 workers shares a single public IPv4 address. The enterprise firewall uses Port Address Translation (PAT) to map thousands of internal host private sockets (e.g. `192.168.1.10:51234`) to unique public port numbers on its single public IP, enabling simultaneous Internet access for all 500 users.',
        engineeringContext: 'PAT relies entirely on 16-bit port multiplexing to conserve IPv4 space.',
      },
      step11_deviceBehavior: {
        hostBehavior: 'Allocates ephemeral ports from pool; maintains socket table in kernel memory.',
        nicBehavior: 'Delivers entire frame payload to OS kernel transport stack.',
        switchOrRouterBehavior: 'Stateful firewalls inspect Layer 4 port numbers to enforce access rules (e.g. permit port 443, block port 23).',
      },
      step12_cliTooling: [
        {
          command: 'netstat -ano -p tcp',
          description: 'Lists all active TCP socket connections, listening ports, and owning Process IDs (PID).',
          expectedOutput:
            'Proto  Local Address          Foreign Address        State        PID\nTCP    0.0.0.0:443            0.0.0.0:0              LISTENING    1204\nTCP    192.168.1.50:51234     93.184.216.34:443      ESTABLISHED  4512',
          proofExplanation: 'Shows web server listening on 443 and client socket established to remote server.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'Application fails to start with error: "Address already in use: bind".',
          possibleCauses: ['Another process is already running and bound to the requested port'],
          diagnosticSteps: ['Run `netstat -ano | findstr :<port>` to identify the blocking PID.'],
          remediation: 'Terminate the conflicting process via Task Manager / `kill` or reconfigure port.',
        },
      ],
      step14_commonMistakes: [
        { misconception: 'Thinking a port number is a physical jack on the back of a computer.', correction: 'A network port is a logical 16-bit software memory address inside the OS kernel; physical connectors are RJ-45 jacks.' },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'Port Scanning & Unauthorized Service Discovery',
        mitigationStrategy: 'Close unused listening ports and deploy stateful firewalls to block unauthorized incoming port connections.',
      },
      step16_examPrep: {
        keyExamPoints: [
          'Port bit length: 16 bits ($0 \\text{ to } 65535$).',
          'Ranges: Well-Known (0-1023), Registered (1024-49151), Ephemeral (49152-65535).',
          'Socket = IP:Port:Protocol. Socket Pair = 4-Tuple.',
        ],
        frequentTraps: [
          'Confusing Well-Known range limit (ends at 1023, not 1024).',
        ],
      },
      step17_practicalLabRef: {
        title: 'Guided Practice: Active Socket Inspection & Ephemeral Port Tracking',
        scenario: 'Use netstat to audit listening ports and map active application socket pairs.',
        tasks: ['Run netstat -ano and identify listening ports vs established client sockets.'],
        verificationMethod: 'Verify socket pair mapping in terminal output.',
      },
      step18_masterySummary: {
        summaryPoints: [
          '16-bit ports identify application processes ($0 \\text{ to } 65535$).',
          'Well-known ports (0-1023) identify standard server daemons.',
          'Socket pairs enable Layer 4 multiplexing across a single IP address.',
        ],
        nextLessonBridge:
          'Proceed to NET-204 Lesson 2 to master Transport Layer Segmentation, MSS, MTU, and Path MTU Discovery.',
      },
    },
    questions: [
      {
        text: 'What are the three official IANA port number classifications and their correct numerical ranges?',
        options: [
          'Well-Known Ports (0 – 1023), Registered Ports (1024 – 49151), and Dynamic/Ephemeral Ports (49152 – 65535)',
          'Class A Ports (0 – 255), Class B Ports (256 – 1024), and Class C Ports (1025 – 65535)',
          'Public Ports (0 – 1000) and Private Ports (1001 – 65535)',
          'TCP Ports (0 – 32767) and UDP Ports (32768 – 65535)',
        ],
        correctOption: 0,
        explanation: 'IANA officially designates 16-bit ports into Well-Known (0 to 1023 for system services), Registered (1024 to 49151 for applications), and Dynamic/Ephemeral (49152 to 65535 for client outbound connections).',
        explanationsJson: { 1: 'Port numbers do not use IP class letters.', 2: 'Invalid ranges.', 3: 'Both TCP and UDP span the full 0-65535 range.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'IANA Port Classification Ranges',
      },
    ],
    lab: {
      title: 'Guided Practice: Active Socket Inspection & Ephemeral Port Tracking',
      instructions: '1. Run netstat -ano -p tcp.\n2. Identify listening port 443 and ephemeral client ports.',
      difficulty: CourseLevel.FOUNDATIONAL,
      estimatedMinutes: 15,
      initialTopologyJson: { clientIp: '192.168.1.50', ephemeralPort: 51234, targetPort: 443 },
      tasks: ['Run netstat -ano.'],
    },
  },

  // -------------------------------------------------------------------------
  // 7. NET-204: Transport Layer Segmentation, MTU & Path MTU Discovery
  // -------------------------------------------------------------------------
  {
    courseCode: 'NET-204',
    slug: 'level-0-network-packets-data-framing',
    title: 'Transport Layer Segmentation, MTU & Path MTU Discovery',
    type: LessonType.THEORY,
    durationMinutes: 25,
    order: 2,
    visualizationType: 'SEGMENTATION_PMTUD_ENGINE',
    introduction:
      'Master the mechanics of dividing large application data streams into transport segments: Why segmentation is necessary, Maximum Segment Size (MSS = 1460 bytes) vs Maximum Transmission Unit (MTU = 1500 bytes), the relationship $MSS = MTU - (IP\\_Header + TCP\\_Header)$, transport stream reassembly, the hazards of IP fragmentation, and Path MTU Discovery (PMTUD, RFC 1191).',
    stepMetadata: {
      step1_objective:
        'Understand why large application data must be segmented, calculate MSS from MTU headers ($MSS = MTU - 40$), analyze the problems caused by Layer 3 IP fragmentation, and master Path MTU Discovery (PMTUD) using the DF bit and ICMP.',
      step2_prerequisites: ['level-0-network-ports-socket-boundaries', 'ethernet-mac-addresses-overview'],
      step3_whyItMatters:
        'Transmitting a 50 MB file as a single packet is impossible because link MTU limits frames to 1500 bytes. Mismatched MTU sizes on VPN tunnels cause silent packet drops ("black holes") unless PMTUD is working correctly.',
      step4_coreConcept:
        'Applications generate data streams of arbitrary size (e.g. 50 MB video). The Transport Layer (TCP) divides this stream into smaller chunks called **Segments** that fit within the physical link capacity. The **Maximum Transmission Unit (MTU)** is the largest Layer 3 packet that a Layer 2 frame can carry (standard Ethernet MTU = 1500 bytes). The **Maximum Segment Size (MSS)** is the maximum TCP payload data in a single segment. Under standard IPv4: $\\text{MSS} = \\text{MTU} (1500) - \\text{IP Header} (20) - \\text{TCP Header} (20) = 1460 \\text{ bytes}$. If a packet exceeds an intermediate link MTU (e.g. 1400-byte VPN tunnel), routers must either perform **IP Fragmentation** (high CPU overhead, lost fragment multiplier) or drop the packet. **Path MTU Discovery (PMTUD, RFC 1191)** sets the IPv4 Don\'t Fragment (DF = 1) bit; if a router cannot forward the packet, it drops it and returns an ICMP Type 3 Code 4 ("Fragmentation Needed and DF set") containing the next-hop MTU, allowing the sender to adjust MSS automatically.',
      step5_technicalAnatomy: {
        title: 'Segmentation Formulas, Header Overhead & PMTUD Mechanics',
        description: 'Mathematical relationship between MSS, MTU, IP headers, and ICMP discovery.',
        components: [
          { name: 'MTU (Maximum Transmission Unit)', detail: 'Standard Ethernet MTU = 1500 bytes. Represents maximum IP packet size (IP Header + Payload).' },
          { name: 'MSS (Maximum Segment Size)', detail: 'Formula: $\\text{MSS} = \\text{MTU} - (\\text{IP Header} + \\text{TCP Header}) = 1500 - 40 = 1460 \\text{ bytes}$ (1440 bytes for IPv6).' },
          { name: 'Transport Stream Reassembly', detail: 'Receiver buffers incoming segments and reassembles them in correct order using TCP Sequence Numbers.' },
          { name: 'The Problem of IP Fragmentation', detail: 'If 1 fragment is lost, the entire original packet is lost. Routers suffer CPU penalties reassembling fragments.' },
          { name: 'Path MTU Discovery (PMTUD / RFC 1191)', detail: 'Sender sets DF = 1; intermediate routers return ICMP Type 3 Code 4 with next-hop MTU if packet is too large.' },
        ],
      },
      step6_howItWorks: {
        steps: [
          { stepNumber: 1, title: 'MSS Negotiation in TCP Handshake', action: 'During TCP SYN exchange, both endpoints advertise their local MSS (e.g. MSS=1460).' },
          { stepNumber: 2, title: 'Transport Stream Chunking', action: 'TCP slices application byte stream into 1460-byte segments, adding sequence numbers.' },
          { stepNumber: 3, title: 'Intermediate MTU Bottleneck', action: 'Packet hits 1400-byte VPN tunnel; router cannot fragment because DF=1.' },
          { stepNumber: 4, title: 'PMTUD ICMP Convergence', action: 'Router returns ICMP "Packet Too Big (MTU 1400)"; sender shrinks MSS to 1360 bytes without fragmentation.' },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'MSS vs MTU Byte Allocation & PMTUD Flags',
        fields: [
          { fieldName: 'Ethernet Frame MTU', bitLength: '1500 Bytes', hexSample: 'Standard MTU', description: 'Max IP packet payload in frame.' },
          { fieldName: 'IPv4 Header', bitLength: '20 Bytes (Standard)', hexSample: 'DF Flag = 1', description: 'Don\'t Fragment bit enabled for PMTUD.' },
          { fieldName: 'TCP Header', bitLength: '20 Bytes (Standard)', hexSample: 'Ports + Seq + Flags', description: 'Transport control header.' },
          { fieldName: 'TCP MSS Payload', bitLength: '1460 Bytes', hexSample: 'Application Data', description: 'Pure user application payload data.' },
        ],
        headerDiagramAscii: `
+-------------------------------------------------------------------------------+
|                       MSS vs MTU MATHEMATICAL RELATIONSHIP                    |
+-------------------------------------------------------------------------------+
| [ <------------------------ ETHERNET MTU: 1500 BYTES -----------------------> ]
| +--------------------+--------------------+-----------------------------------+
| | IPv4 Header (20 B) | TCP Header (20 B)  |    TCP MSS PAYLOAD DATA (1460 B)  |
| +--------------------+--------------------+-----------------------------------+
| [ <--- IP/TCP Headers: 40 Bytes -> ] [ <-- Pure Application Data: 1460 Bytes->]
|                                                                               |
| Formula: MSS = MTU (1500) - IP_Header (20) - TCP_Header (20) = 1460 Bytes     |
+-------------------------------------------------------------------------------+
`,
      },
      step8_visualExplanation: {
        type: 'SEGMENTATION_PMTUD_ENGINE',
        title: 'Interactive Transport Segmentation & PMTUD Bottleneck Engine',
        description: 'Slice large application files into 1460-byte TCP segments, inject an MTU bottleneck link (e.g. 1400B VPN), and observe ICMP PMTUD feedback adjust the sender MSS dynamically.',
      },
      step9_workedExample: {
        title: 'Calculating MSS for an IPsec VPN Tunnel with 1420-Byte MTU',
        problemStatement: 'An enterprise IPsec VPN tunnel has an MTU of 1420 bytes. Calculate the maximum usable TCP MSS for standard IPv4 traffic.',
        stepByStepSolution: [
          'Step 1 (Identify Header Sizes): Standard IPv4 header = 20 bytes; Standard TCP header = 20 bytes. Total header overhead = 40 bytes.',
          'Step 2 (Apply MSS Formula): $\\text{MSS} = \\text{MTU} - (\\text{IP Header} + \\text{TCP Header})$.',
          'Step 3 (Calculate): $\\text{MSS} = 1420 - 40 = 1380 \\text{ bytes}$.',
        ],
        finalResult: 'Maximum TCP MSS for the VPN tunnel is exactly 1380 bytes.',
      },
      step10_realWorldScenario: {
        topology: 'VPN Tunnel "Black Hole" Outage caused by Blocked ICMP PMTUD',
        scenarioText: 'Remote workers connect via VPN. Small packets (SSH, ping) work, but web pages freeze during load. The engineer discovers the firewall was dropping all ICMP traffic, preventing PMTUD "Packet Too Big" messages from reaching the client. Permitting ICMP Type 3 Code 4 (or configuring `ip tcp adjust-mss 1360` on the router) immediately resolves the webpage freeze.',
        engineeringContext: 'Blocking ICMP breaks PMTUD, creating MTU black holes on VPN tunnels.',
      },
      step11_deviceBehavior: {
        hostBehavior: 'Sets DF=1 on all outgoing TCP packets; adjusts MSS upon receiving ICMP Type 3 Code 4.',
        nicBehavior: 'Supports TCP Segmentation Offload (TSO) to offload segmentation from CPU to NIC ASIC.',
        switchOrRouterBehavior: 'Inspects packet size against egress interface MTU.',
      },
      step12_cliTooling: [
        {
          command: 'ping 8.8.8.8 -f -l 1472',
          description: 'Pings with Don\'t Fragment (-f) set and buffer size (-l 1472 bytes + 28B ICMP/IP headers = 1500B total).',
          expectedOutput: 'Reply from 8.8.8.8: bytes=1472 time=14ms TTL=118',
          proofExplanation: 'Proves standard 1500-byte path MTU is intact without fragmentation.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'Ping works with small size but fails when size is 1500 bytes (`Packet needs to be fragmented but DF set`).',
          possibleCauses: ['Intermediate link has MTU smaller than 1500 bytes (e.g. PPPoE or GRE/IPsec tunnel)'],
          diagnosticSteps: ['Reduce ping buffer size with `ping -f -l <size>` until replies succeed.'],
          remediation: 'Configure `ip tcp adjust-mss` on router or lower interface MTU.',
        },
      ],
      step14_commonMistakes: [
        { misconception: 'Confusing MSS with MTU.', correction: 'MTU is the maximum IP packet size (1500B); MSS is the maximum TCP payload data inside the packet (1460B).' },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'IP Fragmentation Overlap Exploits (Teardrop Attacks)',
        mitigationStrategy: 'Firewalls reassemble and inspect all fragmented packets before forwarding to prevent offset overlap attacks.',
      },
      step16_examPrep: {
        keyExamPoints: [
          'Formula: $\\text{MSS} = \\text{MTU} - 40$ (for standard IPv4 TCP).',
          'Standard Ethernet: MTU = 1500B, MSS = 1460B.',
          'PMTUD uses DF=1 and ICMP Type 3 Code 4 (Fragmentation Needed).',
        ],
        frequentTraps: [
          'Forgetting to subtract both IP (20B) and TCP (20B) headers when calculating MSS from MTU.',
        ],
      },
      step17_practicalLabRef: {
        title: 'Guided Practice: MTU Discovery & MSS Calculation for Encrypted Tunnels',
        scenario: 'Use ping with DF flag to discover path MTU and calculate maximum TCP MSS.',
        tasks: ['Test path MTU using ping -f -l 1472.', 'Calculate MSS for 1400-byte tunnel.'],
        verificationMethod: 'Confirm 1360-byte MSS calculation for 1400-byte MTU.',
      },
      step18_masterySummary: {
        summaryPoints: [
          'Transport segmentation slices application streams into MTU-compatible segments.',
          'Standard Ethernet: MTU = 1500 bytes; MSS = 1460 bytes.',
          'PMTUD dynamically discovers path MTU using DF=1 and ICMP feedback.',
        ],
        nextLessonBridge:
          'Proceed to NET-204 Lesson 3 to master TCP vs UDP Connection Management, Handshakes, and Flow Control.',
      },
    },
    questions: [
      {
        text: 'On a standard Ethernet network with an MTU of 1500 bytes, what is the standard Maximum Segment Size (MSS) for IPv4 TCP traffic, and what formula defines it?',
        options: [
          'MSS = 1460 Bytes (Formula: MSS = MTU (1500) - IPv4 Header (20) - TCP Header (20))',
          'MSS = 1500 Bytes (Formula: MSS = MTU)',
          'MSS = 1480 Bytes (Formula: MSS = MTU - IPv4 Header (20))',
          'MSS = 64 Bytes (Formula: Minimum Frame Size)',
        ],
        correctOption: 0,
        explanation: 'Maximum Segment Size (MSS) represents the maximum TCP payload data. Formula: $\\text{MSS} = \\text{MTU} - (\\text{IP Header} + \\text{TCP Header}) = 1500 - 20 - 20 = 1460 \\text{ bytes}$.',
        explanationsJson: { 1: '1500 is total MTU including headers.', 2: '1480 forgets to subtract the 20-byte TCP header.', 3: '64 bytes is minimum Ethernet frame size.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'MSS vs MTU Calculation',
      },
    ],
    lab: {
      title: 'Guided Practice: MTU Discovery & MSS Calculation for Encrypted Tunnels',
      instructions: '1. Run ping 8.8.8.8 -f -l 1472.\n2. Calculate MSS for 1420-byte MTU.',
      difficulty: CourseLevel.FOUNDATIONAL,
      estimatedMinutes: 15,
      initialTopologyJson: { interfaceMtu: 1500, targetIp: '8.8.8.8' },
      tasks: ['Test path MTU.'],
    },
  },

  // -------------------------------------------------------------------------
  // 8. NET-204: TCP & UDP Transport Protocols: Connection Management, Reliability & Flow Control
  // -------------------------------------------------------------------------
  {
    courseCode: 'NET-204',
    slug: 'tcp-udp-transport-overview',
    title: 'TCP & UDP Transport Protocols: Connection Management, Reliability & Flow Control',
    type: LessonType.THEORY,
    durationMinutes: 30,
    order: 3,
    visualizationType: 'TCP_STATE_MACHINE',
    introduction:
      'Master the two fundamental transport protocols of the Internet: Transmission Control Protocol (TCP) vs User Datagram Protocol (UDP), TCP 3-Way Handshake (SYN -> SYN-ACK -> ACK), 4-Way Connection Teardown (FIN -> ACK -> FIN -> ACK), Sequence Numbers & Cumulative Acknowledgments, Sliding Window Flow Control, Retransmission Timers (RTO), and UDP lightweight 8-byte header mechanics.',
    stepMetadata: {
      step1_objective:
        'Compare TCP (connection-oriented, reliable) vs UDP (connectionless, lightweight), master the TCP 3-way handshake and 4-way teardown, analyze sequence numbers and cumulative ACKs, and understand sliding window flow control.',
      step2_prerequisites: ['level-0-network-ports-socket-boundaries', 'level-0-network-packets-data-framing'],
      step3_whyItMatters:
        'Every application developer and network engineer must choose between TCP (guaranteed delivery for web/files) and UDP (low-latency streaming for voice/gaming). Misunderstanding transport states leads to connection leaks and buffer bloat.',
      step4_coreConcept:
        'The Transport Layer provides process-to-process communication using two contrasting protocols: (1) **TCP (Transmission Control Protocol, RFC 793)**: Connection-Oriented, Reliable, Byte-Stream service. It establishes connections via a **3-Way Handshake** (`SYN` -> `SYN-ACK` -> `ACK`), numbers every byte with **Sequence Numbers**, guarantees delivery via **Cumulative Acknowledgments (ACK)**, manages congestion with **Sliding Window Flow Control** (Receive Window `win`), and terminates connections via a **4-Way Teardown** (`FIN` -> `ACK` -> `FIN` -> `ACK`). (2) **UDP (User Datagram Protocol, RFC 768)**: Connectionless, Unreliable Best-Effort, Low-Latency service. It has no handshake, no acknowledgments, and a minimal **8-Byte Header** (Source Port 2B, Destination Port 2B, Length 2B, Checksum 2B). UDP is preferred for real-time latency-sensitive traffic (DNS, VoIP, video streaming, gaming) where retransmissions cause intolerable lag.',
      step5_technicalAnatomy: {
        title: 'TCP vs UDP Feature Matrix & Header Architecture',
        description: 'Comparison of connection states, header sizes, and reliability mechanisms.',
        components: [
          { name: 'TCP (Transmission Control Protocol)', detail: '20-byte base header. Features: 3-way handshake, sequence numbers, ACKs, retransmissions, flow control (windowing), ordered delivery. Used by HTTP/HTTPS, SSH, FTP.' },
          { name: 'UDP (User Datagram Protocol)', detail: '8-byte fixed header. Features: No connection state, no ACKs, no retransmissions, minimal latency overhead. Used by DNS, DHCP, VoIP, gaming.' },
          { name: 'TCP 3-Way Handshake', detail: 'Step 1: Client sends `SYN` (Seq=x). Step 2: Server returns `SYN-ACK` (Seq=y, Ack=x+1). Step 3: Client sends `ACK` (Seq=x+1, Ack=y+1).' },
          { name: 'TCP 4-Way Connection Teardown', detail: 'Step 1: Client sends `FIN`. Step 2: Server sends `ACK`. Step 3: Server sends `FIN`. Step 4: Client sends `ACK` and waits `TIME_WAIT`.' },
          { name: 'Sliding Window Flow Control', detail: 'Receiver advertises available buffer space in the `Window Size` field; sender transmits up to window limit before pausing for an ACK.' },
        ],
      },
      step6_howItWorks: {
        steps: [
          { stepNumber: 1, title: 'TCP Handshake SYN', action: 'Client sends TCP SYN to server port 443 with random Initial Sequence Number (ISN).' },
          { stepNumber: 2, title: 'TCP SYN-ACK Reply', action: 'Server allocates buffer, generates own ISN, and returns SYN-ACK acknowledging client ISN.' },
          { stepNumber: 3, title: 'TCP ACK & Established State', action: 'Client returns ACK; connection enters ESTABLISHED state for bidirectional data flow.' },
          { stepNumber: 4, title: 'UDP Datagram Transmission', action: 'In UDP, sender transmits datagrams directly without prior handshake; receiver processes without sending ACKs.' },
        ],
      },
      step7_packetHeaderView: {
        protocol: 'TCP 20-Byte Header vs UDP 8-Byte Header',
        fields: [
          { fieldName: 'TCP Header (20 Bytes)', bitLength: '160 bits', hexSample: 'Ports + Seq + Ack + Flags (SYN/ACK/FIN) + Window', description: 'Reliable stateful transport.' },
          { fieldName: 'UDP Header (8 Bytes)', bitLength: '64 bits', hexSample: 'Src Port (2B) + Dst Port (2B) + Length (2B) + Checksum (2B)', description: 'Lightweight stateless datagram.' },
        ],
        headerDiagramAscii: `
+-------------------------------------------------------------------------------+
|                       TCP vs UDP HEADER COMPARISON                            |
+-------------------------------------------------------------------------------+
| TCP 20-BYTE HEADER (Stateful & Reliable):                                     |
| +-------------------------------+-------------------------------+             |
| | Source Port (16 bits)         | Destination Port (16 bits)    |             |
| +-------------------------------+-------------------------------+             |
| |                    Sequence Number (32 bits)                  |             |
| +---------------------------------------------------------------+             |
| |                 Acknowledgment Number (32 bits)               |             |
| +-----------+---------+---------+-------------------------------+             |
| | Offset(4) | Rsrv(3) |Flags(9) | Receive Window Size (16 bits) |             |
| +-----------+---------+---------+-------------------------------+             |
| | Checksum (16 bits)            | Urgent Pointer (16 bits)      |             |
| +-------------------------------+-------------------------------+             |
+-------------------------------------------------------------------------------+
| UDP 8-BYTE HEADER (Lightweight & Low-Latency):                                |
| +-------------------------------+-------------------------------+             |
| | Source Port (16 bits)         | Destination Port (16 bits)    |             |
| +-------------------------------+-------------------------------+             |
| | Length (16 bits)              | Checksum (16 bits)            |             |
| +-------------------------------+-------------------------------+             |
+-------------------------------------------------------------------------------+
`,
      },
      step8_visualExplanation: {
        type: 'TCP_STATE_MACHINE',
        title: 'Interactive TCP 3-Way Handshake & Sliding Window Engine',
        description: 'Simulate TCP 3-Way Handshakes (SYN, SYN-ACK, ACK), test sliding window buffer scaling, inject packet loss to observe retransmissions, and compare against lightweight UDP.',
      },
      step9_workedExample: {
        title: 'Tracing TCP Sequence and Acknowledgment Numbers in Data Transfer',
        problemStatement: 'Client establishes TCP session with ISN=1000; Server has ISN=5000. Client sends 500 bytes of data. What are the Sequence and ACK numbers in the server reply?',
        stepByStepSolution: [
          'Step 1 (Handshake): Client sends SYN (Seq=1000). Server returns SYN-ACK (Seq=5000, Ack=1001). Client sends ACK (Seq=1001, Ack=5001).',
          'Step 2 (Data Transfer): Client sends 500 bytes of data starting at Seq=1001 (bytes 1001 to 1500).',
          'Step 3 (Server Acknowledgment): Server acknowledges receipt by sending ACK = 1501 ("I received all bytes up to 1500; I expect byte 1501 next").',
        ],
        finalResult: 'Server ACK number is 1501.',
      },
      step10_realWorldScenario: {
        topology: 'VoIP vs File Transfer Protocol Selection',
        scenarioText: 'Zoom and Microsoft Teams use UDP for live audio and video calls because dropped frames are discarded instantly without delay. In contrast, banking transactions and file downloads use TCP because 100% data integrity and zero bit loss are mandatory.',
        engineeringContext: 'Real-time media favors low-latency UDP; transactional data demands reliable TCP.',
      },
      step11_deviceBehavior: {
        hostBehavior: 'Maintains TCP transmission control blocks (TCB) in kernel memory.',
        nicBehavior: 'Computes TCP/UDP checksums in hardware offload engines.',
        switchOrRouterBehavior: 'Stateful firewalls track TCP flags (SYN, ACK, FIN, RST) in connection state tables.',
      },
      step12_cliTooling: [
        {
          command: 'powershell -Command "Test-NetConnection -ComputerName google.com -Port 443 -InformationLevel Detailed"',
          description: 'Tests TCP 3-way handshake connectivity to port 443 and displays Round-Trip Time (RTT).',
          expectedOutput: 'TcpTestSucceeded : True\nRemoteAddress    : 142.250.190.46\nRemotePort       : 443\nRoundTripTime    : 14 ms',
          proofExplanation: 'Confirms successful completion of TCP 3-way handshake.',
        },
      ],
      step13_troubleshooting: [
        {
          symptom: 'TCP connections hang in `SYN_SENT` state.',
          possibleCauses: ['Destination server offline or firewall silently dropping TCP SYN packets'],
          diagnosticSteps: ['Check firewall rules and verify destination server listening status.'],
          remediation: 'Permit traffic on destination port in intermediate firewalls.',
        },
      ],
      step14_commonMistakes: [
        { misconception: 'Assuming UDP is "bad" or "broken" because it is unreliable.', correction: 'UDP is deliberately lightweight; it avoids handshake delays and retransmission lag, making it optimal for real-time voice, video, and DNS.' },
      ],
      step15_securityPerspective: {
        threatOrVulnerability: 'TCP SYN Flood Denial of Service (DoS)',
        mitigationStrategy: 'Enable SYN Cookies on servers and firewalls to prevent half-open TCP connection table exhaustion.',
      },
      step16_examPrep: {
        keyExamPoints: [
          'TCP: 20-byte header, 3-way handshake (SYN, SYN-ACK, ACK), reliable, flow control.',
          'UDP: 8-byte header, connectionless, no handshake, lightweight.',
          'TCP Teardown: 4-way exchange (FIN, ACK, FIN, ACK).',
        ],
        frequentTraps: [
          'Forgetting that the UDP header is only 8 bytes (TCP is 20 bytes).',
        ],
      },
      step17_practicalLabRef: {
        title: 'Guided Practice: TCP Handshake State Machine & UDP Streaming Comparison',
        scenario: 'Verify TCP 3-way handshake flags and compare against UDP socket transmission.',
        tasks: ['Test TCP connection to port 443 using Test-NetConnection.'],
        verificationMethod: 'Confirm TcpTestSucceeded : True.',
      },
      step18_masterySummary: {
        summaryPoints: [
          'TCP provides reliable byte-stream delivery via 3-way handshakes and sliding window flow control.',
          'UDP provides lightweight 8-byte datagram delivery for real-time latency-critical applications.',
        ],
        nextLessonBridge:
          'With Layer 4 Transport mastered in NET-204, proceed to Tier 3 (NET-301 & NET-302) to master Enterprise Switching and Spanning Tree Protocol.',
      },
    },
    questions: [
      {
        text: 'What are the three flags exchanged in order during the establishment of a standard TCP connection (the 3-Way Handshake)?',
        options: [
          'SYN -> SYN-ACK -> ACK',
          'ACK -> SYN -> FIN',
          'HELLO -> READY -> CONNECT',
          'DISCOVER -> OFFER -> REQUEST',
        ],
        correctOption: 0,
        explanation: 'The TCP 3-Way Handshake consists of: (1) Client sends SYN, (2) Server responds with SYN-ACK, and (3) Client returns ACK.',
        explanationsJson: { 1: 'Invalid sequence.', 2: 'Generic terms.', 3: 'That is the DHCP sequence.' },
        difficulty: CourseLevel.FOUNDATIONAL,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'TCP 3-Way Handshake Flags',
      },
    ],
    lab: {
      title: 'Guided Practice: TCP Handshake State Machine & UDP Streaming Comparison',
      instructions: '1. Run Test-NetConnection google.com -Port 443.\n2. Verify TCP handshake.',
      difficulty: CourseLevel.FOUNDATIONAL,
      estimatedMinutes: 15,
      initialTopologyJson: { host: 'Client', target: 'google.com', port: 443 },
      tasks: ['Test TCP connection.'],
    },
  },
];

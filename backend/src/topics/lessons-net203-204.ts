import { CourseLevel, LessonType, CognitiveLevel, QuestionType } from '@prisma/client';
import { BenchmarkLessonFullDefinition } from './lessons-net300-400';

export const LESSONS_NET203_204: BenchmarkLessonFullDefinition[] = [
  // =========================================================================
  // COURSE: NET-203 (Core IP Services: ARP, DHCP, DNS & IPv6)
  // =========================================================================

  // -------------------------------------------------------------------------
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
    contentV2: {
      objective:
        'Understand the hierarchical distributed DNS namespace, differentiate between the 4 server roles in name resolution (Recursive Resolver, Root, TLD, Authoritative), analyze core Resource Record types (A, AAAA, CNAME, MX, PTR, NS), trace iterative vs recursive query flows, and diagnose DNS resolution failures.',
      prerequisites: [
        'NET-103: The 7-Layer OSI Reference Model & Data Encapsulation',
        'NET-202: IPv4 Addressing, Subnet Masks & CIDR Subnetting',
      ],
      whyItMatters:
        'Computers and routing protocols communicate exclusively using binary/numerical IP addresses, but humans rely on readable domain names. DNS is the foundational distributed phonebook of the global Internet—if DNS fails, web browsing, email delivery, APIs, and cloud services immediately halt.',
      explanation:
        'The Domain Name System (DNS, defined in RFC 1034 & RFC 1035) is a globally distributed, hierarchical database that maps human-friendly domain names (e.g. `api.example.com`) to machine-routable IP addresses (e.g. IPv4 `93.184.216.34` or IPv6 `2606:2800:220:1:248:1893:25c8:1946`).\n\n### 1. The Hierarchical Namespace Tree\nThe DNS namespace is organized in an inverted tree structure with 4 primary tiers:\n1. **Root Zone (`.`)**: The top of the hierarchy, managed by ICANN and operated across 13 logical root server clusters (labeled A through M) distributed worldwide using Anycast routing.\n2. **Top-Level Domains (TLD)**: The rightmost label of a domain name. Managed by dedicated registry operators (e.g. Verisign for `.com`):\n   - **Generic TLDs (gTLD)**: `.com`, `.org`, `.net`, `.edu`, `.gov`.\n   - **Country-Code TLDs (ccTLD)**: `.uk`, `.de`, `.jp`, `.us`.\n3. **Second-Level Domain (SLD)**: The domain name registered by an individual or organization under a TLD (e.g. `example.com`, `google.com`).\n4. **Subdomain / Hostname**: Specific host identifiers or service partitions created by the domain owner (e.g. `api.example.com`, `mail.example.com`).\n\n### 2. The 4 DNS Server Roles in Resolution\nA complete DNS lookup traverses 4 distinct server roles:\n* **Recursive Resolver (Stub Resolver Client Agent)**: The DNS server configured on the client host (provided by ISP or public services like `8.8.8.8` or `1.1.1.1`). It receives recursive queries from the client, does all the heavy iterative work traversing the hierarchy, caches the answers, and returns the final IP to the client.\n* **Root Nameserver (`.`)**: Knows where the TLD nameservers reside. It does not know website IPs; it returns a referral pointer to the appropriate TLD server (e.g. "Ask the `.com` TLD servers").\n* **TLD Nameserver**: Knows where authoritative nameservers for registered domains reside. It returns a referral pointer to the domain\'s authoritative nameservers (e.g. "Ask `ns1.example.com`").\n* **Authoritative Nameserver**: The definitive source of truth holding the actual Zone File for that domain. It returns the final answer (e.g. `A 93.184.216.34`).\n\n### 3. Core DNS Resource Record Types\nZone files store DNS data in structured Resource Records (RRs):\n* **`A` (Address)**: Maps a hostname to a 32-bit IPv4 address (`example.com -> 93.184.216.34`).\n* **`AAAA` (IPv6 Address / Quad-A)**: Maps a hostname to a 128-bit IPv6 address (`example.com -> 2606:2800:220:...`).\n* **`CNAME` (Canonical Name)**: Maps an alias hostname to another canonical domain name (`www.example.com -> example.com`).\n* **`MX` (Mail Exchange)**: Identifies mail servers responsible for receiving email for the domain, with integer priority values (`10 mail.example.com`).\n* **`PTR` (Pointer)**: Maps an IP address back to a hostname (Reverse DNS lookups inside `in-addr.arpa`).\n* **`NS` (Name Server)**: Delegates a DNS zone to use authoritative nameservers (`ns1.example.com`).\n* **`SOA` (Start of Authority)**: Contains administrative zone metadata, primary nameserver, admin email, serial number, and zone refresh/retry/expire timers.\n\n### 4. Transport Mechanics & Caching\n* DNS queries typically use **UDP port 53** for fast, low-overhead single-round-trip lookups (standard 512-byte payload limit without EDNS0).\n* **TCP port 53** is used for DNS Zone Transfers (AXFR/IXFR) and responses that exceed UDP size limits.\n* Every DNS record contains a **Time-To-Live (TTL)** in seconds. Recursive resolvers and client operating systems cache responses for the duration of the TTL to eliminate redundant root-to-leaf lookups.',
      components: [
        {
          name: 'Recursive Resolver (Stub Resolver Agent)',
          detail: 'Client-facing DNS server (ISP, 8.8.8.8, 1.1.1.1) that traverses the hierarchy on behalf of the endpoint and caches responses.',
        },
        {
          name: 'Root Nameservers (13 Anycast Clusters)',
          detail: 'The top of the DNS hierarchy (`.`), directing resolvers to appropriate TLD servers (.com, .org).',
        },
        {
          name: 'TLD Nameservers (.com, .org, .edu)',
          detail: 'Maintains registries for specific top-level domain extensions and points to Authoritative nameservers.',
        },
        {
          name: 'Authoritative Nameserver (Zone File)',
          detail: 'The definitive source of truth holding official DNS records configured by the domain administrator.',
        },
        {
          name: 'Core Resource Records (A, AAAA, CNAME, MX, PTR)',
          detail: 'A (IPv4), AAAA (IPv6), CNAME (Alias), MX (Mail Priority), PTR (Reverse IP), NS (Delegation), SOA (Zone Metadata).',
        },
        {
          name: 'UDP & TCP Port 53 Transport',
          detail: 'UDP port 53 for standard fast lookups; TCP port 53 for zone transfers (AXFR) and large responses (>512 bytes).',
        },
      ],
      howItWorks: [
        {
          stepNumber: 1,
          title: 'Local Client Cache & Recursive Query',
          action: 'Host checks local OS resolver cache and hosts file; if not found, sends a recursive query to configured Resolver (e.g. 1.1.1.1:53 UDP).',
        },
        {
          stepNumber: 2,
          title: 'Root Server Referral',
          action: 'Resolver sends iterative query to Root Server (`.`), receiving a referral to the `.com` TLD nameservers.',
        },
        {
          stepNumber: 3,
          title: 'TLD Server Referral',
          action: 'Resolver queries `.com` TLD server, receiving a referral to `ns1.netvision.edu` (Authoritative nameserver).',
        },
        {
          stepNumber: 4,
          title: 'Authoritative Answer & Caching',
          action: 'Resolver queries `ns1.netvision.edu`, receives target A record (104.21.48.12) with TTL, caches the result, and returns IP to client.',
        },
      ],
      packetHeaderView: {
        protocol: 'DNS Protocol Message (UDP/TCP Port 53)',
        fields: [
          { fieldName: 'Transaction ID', bitLength: '16 bits (2 Bytes)', hexSample: '0x1A2B', description: 'Unique identifier matching query to response.' },
          { fieldName: 'Flags (QR, Opcode, AA, TC, RD, RA)', bitLength: '16 bits (2 Bytes)', hexSample: '0x0100 (Standard Query, RD=1)', description: 'Control flags indicating Query/Response, Recursion Desired/Available.' },
          { fieldName: 'Question Count (QDCOUNT)', bitLength: '16 bits', hexSample: '0x0001', description: 'Number of entries in question section.' },
          { fieldName: 'Answer Count (ANCOUNT)', bitLength: '16 bits', hexSample: '0x0001', description: 'Number of resource records in answer section.' },
          { fieldName: 'Authority Count (NSCOUNT)', bitLength: '16 bits', hexSample: '0x0002', description: 'Number of name server records.' },
          { fieldName: 'Additional Count (ARCOUNT)', bitLength: '16 bits', hexSample: '0x0002', description: 'Number of additional glue records.' },
        ],
        headerDiagramAscii: `+-------------------------------------------------------------------------------+
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
|   [ CLIENT ] <--- (5. Delivers IP & Caches with TTL) <-------------+          |
+-------------------------------------------------------------------------------+`,
      },
      visualizer: {
        type: 'DNS_RESOLUTION_TREE',
        title: 'Interactive DNS Namespace Hierarchy & Recursive Resolver Engine',
        description: 'Trace a DNS lookup from client stub resolver through Root, TLD, and Authoritative servers, observing packet round-trips, record parsing, and TTL caching.',
      },
      workedExample: {
        title: 'Tracing DNS Resolution Steps for api.netvision.edu',
        problemStatement:
          'A client with an empty cache browses to `api.netvision.edu`. Trace the 4 sequential server queries executed by its recursive resolver `1.1.1.1` to resolve the hostname to an IP address.',
        stepByStepSolution: [
          'Step 1 (Client to Resolver): Client sends a Recursive DNS query for `api.netvision.edu` (Record Type A) to `1.1.1.1:53` (UDP).',
          'Step 2 (Resolver to Root): Resolver queries Root Server (`.`), which returns referral NS records pointing to the `.edu` TLD nameservers.',
          'Step 3 (Resolver to TLD): Resolver queries `.edu` TLD server, which returns referral NS records pointing to `ns1.netvision.edu` (Authoritative nameserver).',
          'Step 4 (Resolver to Authoritative): Resolver queries `ns1.netvision.edu` for `api.netvision.edu`, receiving `A 104.21.48.12` with TTL 300 seconds.',
          'Step 5 (Answer Delivery): Resolver caches `api.netvision.edu -> 104.21.48.12` for 300 seconds and returns IP `104.21.48.12` to the client browser.',
        ],
        finalResult:
          'Browser receives IP 104.21.48.12 and immediately opens a TCP/HTTPS connection on port 443.',
      },
      practice: [
        {
          id: 1,
          prompt: 'What are the four primary DNS server roles involved in full hierarchical domain name resolution?',
          expected: 'Recursive Resolver, Root Nameserver (.), TLD Nameserver (.com/.edu), and Authoritative Nameserver.',
          hints: 'Client queries resolver; resolver traverses Root -> TLD -> Authoritative.',
        },
        {
          id: 2,
          prompt: 'What is the specific purpose of DNS Resource Record types A vs AAAA vs CNAME?',
          expected: 'A = IPv4 address (32-bit); AAAA = IPv6 address (128-bit); CNAME = Canonical Name (alias hostname mapping).',
          hints: 'A is IPv4; 4 As (AAAA) is 4 times bigger for IPv6; CNAME is an alias.',
        },
        {
          id: 3,
          prompt: 'What transport protocol and port number does standard DNS query traffic use?',
          expected: 'UDP port 53 (with TCP port 53 used for zone transfers and large responses exceeding 512 bytes).',
          hints: 'Standard queries use UDP 53 for speed.',
        },
        {
          id: 4,
          prompt: 'What does the Time-To-Live (TTL) value in a DNS resource record dictate to resolvers and client operating systems?',
          expected: 'The number of seconds the resolver or client is permitted to cache the DNS record before querying authoritative servers again.',
          hints: 'TTL defines cache expiration time.',
        },
        {
          id: 5,
          prompt: 'What DNS record type is used to identify mail servers and specify email routing priority for a domain?',
          expected: 'MX (Mail Exchange) record.',
          hints: 'MX stands for Mail Exchange.',
        },
        {
          id: 6,
          prompt: 'If a user can ping 8.8.8.8 successfully but cannot load google.com in a web browser, what is the most likely failure layer and protocol?',
          expected: 'Application Layer DNS name resolution failure (misconfigured or unreachable DNS resolver server).',
          hints: 'IP routing works because 8.8.8.8 responds; name translation is failing.',
        },
      ],
      recap: [
        'DNS is the hierarchical distributed database mapping domain names to IP addresses.',
        '4-tier server hierarchy: Recursive Resolver -> Root Nameserver (.) -> TLD Server -> Authoritative Server.',
        'Core record types: A (IPv4), AAAA (IPv6), CNAME (Alias), MX (Mail), PTR (Reverse lookup), NS (Delegation), SOA (Metadata).',
        'Standard lookups use UDP port 53; Zone transfers and large payloads use TCP port 53.',
        'TTL determines caching duration on recursive resolvers and client operating systems.',
      ],
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
        explanation:
          'When a client queries a Recursive Resolver, the resolver iteratively queries the Root Nameserver (`.`), which refers to the TLD Nameserver (`.com`), which refers to the Authoritative Nameserver (`ns1.example.com`), which returns the final A record.',
        explanationsJson: {
          1: 'Reversed order.',
          2: 'DHCP and ARP are distinct protocols.',
          3: 'Application server roles.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'DNS 4-Tier Server Hierarchy',
      },
      {
        text: 'Which DNS Resource Record type is used to map an alias hostname to another canonical domain name (e.g. mapping `www.example.com` to `example.com`)?',
        options: [
          'CNAME (Canonical Name)',
          'A Record',
          'AAAA Record',
          'MX Record',
        ],
        correctOption: 0,
        explanation:
          'A CNAME (Canonical Name) record creates an alias pointing one domain name to another canonical hostname, allowing multiple subdomains to resolve to the same underlying record.',
        explanationsJson: {
          1: 'A records map directly to 32-bit IPv4 addresses, not other domain names.',
          2: 'AAAA records map directly to 128-bit IPv6 addresses.',
          3: 'MX records specify mail exchange servers with routing priorities.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'DNS CNAME Resource Record',
      },
      {
        text: 'Why does standard DNS primarily use UDP port 53 for queries rather than TCP port 53?',
        options: [
          'Because UDP avoids 3-way connection handshake overhead, enabling single round-trip lookups with minimal latency and reduced server state load',
          'Because TCP cannot transmit ASCII text domain characters',
          'Because UDP automatically encrypts domain names with AES-256',
          'Because routers drop all TCP packets destined to port 53',
        ],
        correctOption: 0,
        explanation:
          'UDP is connectionless and fast: a client sends a single request packet and receives a single response packet, avoiding TCP 3-way handshake delay and conserving server memory for millions of concurrent queries.',
        explanationsJson: {
          1: 'TCP carries any binary or ASCII payload.',
          2: 'Standard UDP DNS is plaintext; encryption requires DoT (port 853) or DoH (port 443).',
          3: 'Routers routinely route TCP port 53 for DNS zone transfers and large payloads.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'DNS Transport Protocol Selection (UDP vs TCP)',
      },
      {
        text: 'A systems administrator updates the IPv4 address for `api.company.com` from `1.1.1.1` to `2.2.2.2`. However, remote users continue reaching `1.1.1.1` for the next hour. What DNS parameter is responsible for this delay?',
        options: [
          'Time-To-Live (TTL) caching timeout in upstream recursive resolvers',
          'The 48-bit MAC address burned-in hardware serial',
          'The router MTU packet size limit',
          'The default gateway subnet mask',
        ],
        correctOption: 0,
        explanation:
          'Recursive resolvers and client operating systems cache DNS records according to the record\'s Time-To-Live (TTL). Upstream caches will not query authoritative servers for the new IP until the old TTL expires.',
        explanationsJson: {
          1: 'MAC addresses operate at Layer 2 and have no effect on global DNS caching.',
          2: 'MTU limits payload packet size, not domain record expiration.',
          3: 'Subnet masks define local IP boundaries, not DNS cache timers.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'DNS TTL & Resolver Caching Mechanics',
      },
      {
        text: 'Which DNS Resource Record type is queried when an email server needs to determine which mail gateway handles incoming emails for the domain `@example.com`?',
        options: [
          'MX (Mail Exchange) record',
          'PTR (Pointer) record',
          'TXT (Text) record',
          'NS (Name Server) record',
        ],
        correctOption: 0,
        explanation:
          'MX (Mail Exchange) records specify the mail servers responsible for accepting incoming email for a domain, along with preference/priority values determining server precedence.',
        explanationsJson: {
          1: 'PTR records are used for reverse IP-to-hostname lookups.',
          2: 'TXT records hold arbitrary text (often used for SPF/DKIM verification).',
          3: 'NS records delegate zone authority to nameservers.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'DNS MX Mail Exchange Records',
      },
      {
        text: 'A user reports that they can successfully ping public IP address `8.8.8.8` from their command prompt, but typing `https://www.google.com` into their web browser results in a "Server Not Found" error. What is the most likely root cause?',
        options: [
          'DNS server IP configuration is invalid or the configured DNS resolver is unreachable, preventing domain name translation',
          'The physical Ethernet copper cable is unplugged',
          'The default gateway router has crashed and dropped all IP routing',
          'The user\'s network card MAC address has expired',
        ],
        correctOption: 0,
        explanation:
          'Because the host can ping 8.8.8.8, Layers 1, 2, and 3 (cable, MAC, IP, gateway routing) are fully functional. The failure to browse by domain name proves that Application Layer DNS name resolution is failing.',
        explanationsJson: {
          1: 'If the cable were unplugged, pinging 8.8.8.8 would fail immediately.',
          2: 'If the default gateway had crashed, no traffic could reach public IP 8.8.8.8.',
          3: 'MAC addresses are permanently burned-in and do not expire.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
        questionType: QuestionType.TROUBLESHOOTING,
        concept: 'DNS Resolution vs IP Routing Troubleshooting',
      },
    ],
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
    contentV2: {
      objective:
        'Master the 4-step DHCP DORA lease acquisition workflow, understand UDP port 67 (Server) and port 68 (Client) architecture, calculate lease lifecycle timers (T1 Renewal, T2 Rebind, Expiration), analyze core DHCP Option delivery (Subnet Mask, Gateway, DNS), and explain DHCP Relay (ip helper-address) mechanics.',
      prerequisites: [
        'NET-103: The 7-Layer OSI Reference Model & Data Encapsulation',
        'NET-202: IPv4 Addressing, Subnet Masks & CIDR Subnetting',
      ],
      whyItMatters:
        'Manually typing static IP addresses, subnet masks, gateways, and DNS servers on hundreds of enterprise laptops and mobile devices is impossible and error-prone. DHCP provides centralized, automated IP address management (IPAM), eliminates duplicate IP conflicts, and automatically reclaims addresses when devices disconnect.',
      explanation:
        'The Dynamic Host Configuration Protocol (DHCP, defined in RFC 2131) is a client-server network protocol that automatically assigns IP addresses and essential TCP/IP configuration parameters to client devices on a local area network.\n\n### 1. The 4-Step DORA Lease Exchange\nWhen a newly booted device connects to a network without an assigned IP address, it executes the **DORA** sequence:\n1. **DHCP Discover (D - Broadcast)**: The unconfigured client has no IP address, so it broadcasts a UDP packet from Source IP `0.0.0.0` (port 68) to Destination IP `255.255.255.255` (port 67) framed to Destination MAC `FF:FF:FF:FF:FF:FF`. It asks: *"Is there a DHCP server on this network? I need an IP address."*\n2. **DHCP Offer (O - Unicast/Broadcast)**: A listening DHCP server reserves an available IP address from its configured IP Pool and responds with an Offer containing the proposed IP (e.g. `192.168.1.50`), Subnet Mask, Gateway Router IP, DNS Server IPs, and Lease Duration.\n3. **DHCP Request (R - Broadcast)**: The client selects the offer and broadcasts a DHCP Request confirming its acceptance of that specific server\'s proposed IP. The broadcast informs all other DHCP servers that made offers to release their reserved IPs back to their available pools.\n4. **DHCP Acknowledge (A - Unicast/Broadcast)**: The chosen server commits the lease to its database and sends a definitive DHCP ACK. The client immediately configures its network interface and transitions to the BOUND state.\n\n### 2. Transport Architecture: UDP Ports 67 & 68\n* **DHCP Server Port**: Listens on **UDP Port 67** (BOOTPS).\n* **DHCP Client Port**: Listens on **UDP Port 68** (BOOTPC).\n\n### 3. Core DHCP Option Codes\nIn addition to the leased IP address, DHCP messages carry essential network parameters using standardized **DHCP Options**:\n* **Option 1**: Subnet Mask (e.g. `255.255.255.0`)\n* **Option 3**: Router / Default Gateway IP address (e.g. `192.168.1.1`)\n* **Option 6**: Domain Name System (DNS) Server IP addresses (e.g. `8.8.8.8`, `1.1.1.1`)\n* **Option 15**: Domain Search Suffix (e.g. `corp.internal`)\n* **Option 51**: Lease Duration Time (in seconds)\n* **Option 54**: DHCP Server Identifier (Server IP address)\n\n### 4. DHCP Lease Lifecycle & Timers\nA DHCP address is not permanently owned; it is leased for a specific duration (e.g. 8 hours or 24 hours). Two internal timers govern renewal:\n* **T1 Renewal Timer (50% of Lease Duration)**: The client sends a **unicast DHCP Request** directly to the leasing server to renew the lease. If the server ACKs, the lease timer resets to 100%.\n* **T2 Rebind Timer (87.5% / 7/8ths of Lease Duration)**: If the original server failed to respond at T1, the client broadcasts a DHCP Request to *any* active DHCP server on the subnet to rebind the lease.\n* **Lease Expiration (100%)**: If no renewal or rebind occurs, the lease expires. The client immediately releases the IP and falls back to **APIPA** (`169.254.x.x` via RFC 3927) while restarting the Discover process.\n\n### 5. DHCP Relay Agents (`ip helper-address`)\nBecause routers drop broadcast packets by default, a DHCP Discover broadcast cannot cross a router boundary. In enterprise networks with a centralized DHCP server in the datacenter, routers are configured with a **DHCP Relay Agent** (Cisco command: `ip helper-address 10.50.0.5`). The router intercepts client broadcast Discovers, converts them into unicast IP packets directed to the central DHCP server IP, and injects the client subnet Gateway IP (`giaddr`) so the server knows which subnet pool to allocate from.',
      components: [
        {
          name: 'DHCP Discover (Broadcast)',
          detail: 'Client broadcast (0.0.0.0:68 -> 255.255.255.255:67) asking for an IP lease on the local network.',
        },
        {
          name: 'DHCP Offer (Server Proposal)',
          detail: 'Server offers proposed IP address, subnet mask, default gateway, DNS servers, and lease duration.',
        },
        {
          name: 'DHCP Request (Client Commitment)',
          detail: 'Client broadcasts formal acceptance of proposed IP, notifying all other DHCP servers to release reservations.',
        },
        {
          name: 'DHCP Acknowledge (Lease Finalized)',
          detail: 'Server commits lease in database and returns ACK; client binds IP and activates interface.',
        },
        {
          name: 'Core Options (Mask 1, Gateway 3, DNS 6)',
          detail: 'Delivers complete network configuration beyond raw IP: Subnet Mask (1), Gateway (3), DNS Servers (6).',
        },
        {
          name: 'Lease Timers (T1 @ 50%, T2 @ 87.5%, Expiry)',
          detail: 'T1 unicast renewal at 50%; T2 broadcast rebind at 87.5%; Expiration releases IP and falls back to APIPA 169.254.x.x.',
        },
      ],
      howItWorks: [
        {
          stepNumber: 1,
          title: 'Discover Broadcast Ingress',
          action: 'Unconfigured client brings network link up and broadcasts DHCP Discover (Src: 0.0.0.0:68, Dst: 255.255.255.255:67).',
        },
        {
          stepNumber: 2,
          title: 'Offer Reservation',
          action: 'DHCP Server allocates unassigned IP 192.168.1.105 from pool and sends Offer with Gateway and DNS options.',
        },
        {
          stepNumber: 3,
          title: 'Request Commitment',
          action: 'Client broadcasts DHCP Request accepting 192.168.1.105 from Server Identifier 192.168.1.1.',
        },
        {
          stepNumber: 4,
          title: 'ACK & BOUND State Activation',
          action: 'Server sends DHCP ACK; client configures IP 192.168.1.105/24, Default Gateway 192.168.1.1, DNS 1.1.1.1, and arms T1 timer.',
        },
      ],
      packetHeaderView: {
        protocol: 'DHCP / BOOTP Message Format (UDP 67 & 68)',
        fields: [
          { fieldName: 'Opcode (op)', bitLength: '8 bits (1 Byte)', hexSample: '0x01 (BOOTREQUEST) / 0x02 (BOOTREPLY)', description: 'Message direction (1 = Client to Server, 2 = Server to Client).' },
          { fieldName: 'Hardware Type / Length', bitLength: '8 bits / 8 bits', hexSample: '0x01 (Ethernet) / 0x06 (6-byte MAC)', description: 'Physical link architecture.' },
          { fieldName: 'Transaction ID (xid)', bitLength: '32 bits (4 Bytes)', hexSample: '0x39A4E2B1', description: 'Random integer matching client request with server reply.' },
          { fieldName: 'Client IP (ciaddr)', bitLength: '32 bits', hexSample: '0.0.0.0 (in Discover)', description: 'Client existing IP (0.0.0.0 if unassigned).' },
          { fieldName: 'Your IP (yiaddr)', bitLength: '32 bits', hexSample: '192.168.1.105', description: 'IP address assigned by DHCP server.' },
          { fieldName: 'Server IP (siaddr)', bitLength: '32 bits', hexSample: '192.168.1.1', description: 'Next bootstrap server IP address.' },
          { fieldName: 'Magic Cookie', bitLength: '32 bits', hexSample: '0x63825363', description: 'Standard vendor magic cookie identifying DHCP options.' },
        ],
        headerDiagramAscii: `+-------------------------------------------------------------------------------+
|                        THE 4-STEP DHCP DORA WORKFLOW                          |
+-------------------------------------------------------------------------------+
|  [ CLIENT ]                                                   [ DHCP SERVER ] |
|      |                                                              |         |
|      | --- 1. DHCP DISCOVER (Broadcast: 0.0.0.0:68 -> 255.255.255.255:67) --> |
|      |                                                              |         |
|      | <-- 2. DHCP OFFER (Proposes: 192.168.1.105, Mask, Gateway, DNS) ---+  |
|      |                                                              |         |
|      | --- 3. DHCP REQUEST (Broadcast: "I accept 192.168.1.105") -->|         |
|      |                                                              |         |
|      | <-- 4. DHCP ACK (Commits lease & configures client) ---------+         |
|      |                                                                        |
|  [ Timers: T1 Renewal @ 50% | T2 Rebind @ 87.5% | Lease Expiry @ 100% ]       |
+-------------------------------------------------------------------------------+`,
      },
      visualizer: {
        type: 'DHCP_DORA_ANIMATOR',
        title: 'Interactive DHCP DORA Protocol Animator & Lease Timer Simulator',
        description: 'Watch the step-by-step DORA packet exchange across client and server, inspect Option fields (1, 3, 6), and simulate lease timer countdowns (T1, T2, Expiration).',
      },
      workedExample: {
        title: 'Calculating DHCP Lease Renewal and Rebind Timers for a 24-Hour Scope',
        problemStatement:
          'An enterprise DHCP server assigns a client an IPv4 address with a 24-hour lease duration (86,400 seconds) at 08:00 AM on Monday.\n1. At what time and percentage does the T1 Renewal Timer trigger, and what type of message is sent?\n2. At what time and percentage does the T2 Rebind Timer trigger?\n3. What happens if no DHCP server responds by 08:00 AM Tuesday (100% expiration)?',
        stepByStepSolution: [
          'Step 1 (T1 Renewal Timer @ 50%): T1 is defined as 50% of the lease duration = $0.50 \\times 24 \\text{ hours} = 12 \\text{ hours}$. T1 triggers at 08:00 PM Monday. The client transmits a **Unicast DHCP Request** directly to the leasing server IP.',
          'Step 2 (T2 Rebind Timer @ 87.5%): T2 is defined as 87.5% (7/8ths) of the lease duration = $0.875 \\times 24 \\text{ hours} = 21 \\text{ hours}$. T2 triggers at 05:00 AM Tuesday. The client broadcasts a **Broadcast DHCP Request** to any available DHCP server.',
          'Step 3 (Lease Expiration @ 100%): At 08:00 AM Tuesday (24 hours elapsed), the lease expires. The client immediately stops using the IP address, flushes its network routing table, assigns an APIPA address (`169.254.x.x`), and begins transmitting DHCP Discovers.',
        ],
        finalResult:
          'T1 triggers at 8:00 PM (12h, Unicast); T2 triggers at 5:00 AM (21h, Broadcast); Expiration triggers at 8:00 AM (24h, APIPA fallback).',
      },
      practice: [
        {
          id: 1,
          prompt: 'What does the acronym DORA stand for in DHCP initial lease acquisition, and what is the sequence?',
          expected: 'Discover (Broadcast) -> Offer (Server Proposal) -> Request (Client Commitment) -> Acknowledge (Lease Finalized).',
          hints: 'D - O - R - A.',
        },
        {
          id: 2,
          prompt: 'What UDP port numbers do the DHCP Server and DHCP Client listen on?',
          expected: 'DHCP Server listens on UDP Port 67; DHCP Client listens on UDP Port 68.',
          hints: 'Server is 67, Client is 68.',
        },
        {
          id: 3,
          prompt: 'What are the official DHCP Option codes for Subnet Mask, Default Gateway Router, and DNS Servers?',
          expected: 'Option 1 = Subnet Mask; Option 3 = Router / Default Gateway; Option 6 = DNS Servers.',
          hints: 'Options 1, 3, and 6.',
        },
        {
          id: 4,
          prompt: 'At what percentage of total lease time does a DHCP client initiate its T1 renewal request, and is this request unicast or broadcast?',
          expected: 'T1 triggers at 50% of the lease duration and is sent as a Unicast packet directly to the leasing server.',
          hints: 'T1 = 50% unicast; T2 = 87.5% broadcast.',
        },
        {
          id: 5,
          prompt: 'Why does an unconfigured client use Source IP 0.0.0.0 and Destination IP 255.255.255.255 when sending a DHCP Discover?',
          expected: 'Because the client has no assigned IP address yet (0.0.0.0) and does not know where the DHCP server is, requiring a local broadcast (255.255.255.255).',
          hints: '0.0.0.0 indicates absence of address; 255.255.255.255 is limited broadcast.',
        },
        {
          id: 6,
          prompt: 'When a client computer displays an IP address starting with 169.254.x.x, what does this indicate has occurred?',
          expected: 'Automatic Private IP Addressing (APIPA) fallback; the client failed to reach a DHCP server and self-assigned a link-local address.',
          hints: '169.254.0.0/16 is APIPA.',
        },
      ],
      recap: [
        'DHCP automates IP configuration via the 4-step DORA exchange (Discover, Offer, Request, ACK).',
        'Operates over UDP: Server listens on Port 67, Client on Port 68.',
        'Delivers core options: Subnet Mask (Option 1), Default Gateway (Option 3), and DNS Servers (Option 6).',
        'Lease lifecycle is governed by T1 (50% unicast renewal), T2 (87.5% broadcast rebind), and 100% Expiration.',
        'DHCP Relay (ip helper-address) allows routers to forward client broadcast Discovers to centralized servers across subnets.',
      ],
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
        explanation:
          'Initial DHCP lease acquisition follows the DORA sequence: DHCP Discover (Client broadcast), DHCP Offer (Server response), DHCP Request (Client commitment), and DHCP Acknowledge (Server finalization).',
        explanationsJson: {
          1: 'Generic terms.',
          2: 'That is the TCP handshake and teardown.',
          3: 'Generic terms.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'DHCP DORA Workflow',
      },
      {
        text: 'Which UDP port numbers are officially designated for DHCP Server and DHCP Client communications?',
        options: [
          'DHCP Server = UDP Port 67, DHCP Client = UDP Port 68',
          'DHCP Server = UDP Port 53, DHCP Client = UDP Port 53',
          'DHCP Server = TCP Port 80, DHCP Client = TCP Port 443',
          'DHCP Server = UDP Port 161, DHCP Client = UDP Port 162',
        ],
        correctOption: 0,
        explanation:
          'DHCP utilizes UDP port 67 for the server daemon (BOOTPS) and UDP port 68 for client endpoints (BOOTPC).',
        explanationsJson: {
          1: 'Port 53 is DNS.',
          2: 'Ports 80 and 443 are HTTP and HTTPS.',
          3: 'Ports 161 and 162 are SNMP.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'DHCP UDP Port Numbers',
      },
      {
        text: 'What are the standard DHCP Option numbers used to provide client endpoints with their Subnet Mask, Default Gateway Router IP, and DNS Server IPs?',
        options: [
          'Subnet Mask = Option 1, Default Gateway = Option 3, DNS Servers = Option 6',
          'Subnet Mask = Option 10, Default Gateway = Option 20, DNS Servers = Option 30',
          'Subnet Mask = Option 80, Default Gateway = Option 443, DNS Servers = Option 53',
          'Subnet Mask = Option 255, Default Gateway = Option 1, DNS Servers = Option 8',
        ],
        correctOption: 0,
        explanation:
          'RFC 2132 defines standard DHCP Options: Option 1 specifies Subnet Mask, Option 3 specifies Router (Default Gateway), and Option 6 specifies Domain Name Servers (DNS).',
        explanationsJson: {
          1: 'Arbitrary numbers.',
          2: 'These are well-known application port numbers, not DHCP option codes.',
          3: 'Arbitrary numbers.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'DHCP Option Codes (1, 3, 6)',
      },
      {
        text: 'An employee\'s laptop acquires an 8-hour DHCP lease at 09:00 AM. At what time will the client first attempt to renew its lease (T1 Renewal Timer), and how is the renewal packet transmitted?',
        options: [
          'At 01:00 PM (50% of lease duration) via a Unicast DHCP Request sent directly to the leasing server',
          'At 04:00 PM (87.5% of lease duration) via a Broadcast DHCP Discover',
          'At 05:00 PM (100% of lease duration) via an ARP Request',
          'At 09:05 AM via a TCP SYN packet',
        ],
        correctOption: 0,
        explanation:
          'The T1 Renewal Timer triggers at 50% of the total lease duration ($0.50 \\times 8 \\text{ hours} = 4 \\text{ hours}$, which is 01:00 PM). The client transmits a unicast DHCP Request directly to the server that granted the lease.',
        explanationsJson: {
          1: '87.5% is the T2 Rebind Timer (04:00 PM), which is broadcast if T1 fails.',
          2: '100% is lease expiration, not the first renewal attempt.',
          3: 'Lease renewal does not trigger 5 minutes after connection.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'DHCP T1 Renewal Timer Calculation',
      },
      {
        text: 'Why is the DHCP Relay Agent (`ip helper-address`) feature configured on enterprise router interfaces?',
        options: [
          'Because routers drop Layer 2/3 broadcast packets by default, requiring the router to convert client DHCP Discover broadcasts into unicast packets routed to a central DHCP server',
          'To encrypt DHCP leases using WPA3 wireless security',
          'To prevent computers from running web browsers',
          'To convert IPv4 packets into IPv6 packets automatically',
        ],
        correctOption: 0,
        explanation:
          'Since routers terminate broadcast domains and do not forward `255.255.255.255` broadcasts, a DHCP Relay Agent (`ip helper-address`) intercepts client Discover broadcasts and forwards them as unicast packets to the central DHCP server.',
        explanationsJson: {
          1: 'DHCP Relay forwards address requests, not wireless encryption.',
          2: 'DHCP Relay enables network connectivity, not application blocking.',
          3: 'DHCP Relay is not an IPv4-to-IPv6 transition mechanism.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'DHCP Relay Agent & ip helper-address',
      },
      {
        text: 'A helpdesk technician notices that a user\'s computer shows an IPv4 address of `169.254.45.89` with a subnet mask of `255.255.0.0`. The user cannot access internal network shares or the Internet. What does this indicate?',
        options: [
          'The client failed to communicate with a DHCP server and self-assigned an Automatic Private IP Addressing (APIPA) link-local address',
          'The computer has been successfully assigned a public Internet IP address',
          'The DHCP server assigned a static high-speed VIP address',
          'The computer is connected to a Gigabit fiber connection',
        ],
        correctOption: 0,
        explanation:
          'The IPv4 block `169.254.0.0/16` is reserved for APIPA (Automatic Private IP Addressing). When a DHCP client receives no response to its Discovers, it self-assigns an address in this range, allowing communication only with other APIPA hosts on the immediate physical wire.',
        explanationsJson: {
          1: '169.254.x.x is link-local and non-routable on the Internet.',
          2: '169.254.x.x indicates DHCP failure, not a VIP assignment.',
          3: 'APIPA address assignment is independent of physical media link speed.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
        questionType: QuestionType.TROUBLESHOOTING,
        concept: 'APIPA (169.254.x.x) Troubleshooting',
      },
    ],
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
      'Master the critical bridge between Layer 3 logical IP addressing and Layer 2 physical MAC addressing: ARP Request (Broadcast FF:FF:FF:FF:FF:FF, Opcode 1) vs ARP Reply (Unicast, Opcode 2), ARP Cache table mechanics, cache aging timeouts, Gratuitous ARP (GARP) for duplicate IP conflict detection, and why ARP broadcasts never cross a router boundary.',
    contentV2: {
      objective:
        'Understand how ARP dynamically maps 32-bit IPv4 addresses to 48-bit Ethernet MAC addresses on local subnets, analyze ARP Request (broadcast) vs Reply (unicast) mechanics, inspect the local ARP cache table and aging timers, understand Gratuitous ARP for duplicate IP detection, and explain why ARP broadcasts never cross router boundaries.',
      prerequisites: [
        'NET-101: Bits, Bytes, Binary & Hexadecimal Foundations',
        'NET-201: MAC Addresses & Physical Hardware Identity',
        'NET-202: IPv4 Addressing, Subnet Masks & CIDR Subnetting',
      ],
      whyItMatters:
        'Ethernet switches operate at Layer 2 and forward frames exclusively based on destination MAC addresses. They know nothing about IP addresses. Without ARP, an IP host cannot construct an Ethernet frame to transmit data to local nodes or reach the default gateway to access the wider Internet.',
      explanation:
        'The Address Resolution Protocol (ARP, defined in RFC 826) provides the essential binding mechanism between Layer 3 logical IPv4 addresses and Layer 2 physical MAC addresses within a broadcast domain.\n\n### 1. The Core Problem ARP Solves\nWhen an application generates network traffic, the operating system creates an IP packet with a source IP (e.g. `192.168.1.10`) and destination IP (e.g. `192.168.1.50`). However, to physically transmit these bits across a local Ethernet link, the Network Interface Card (NIC) must encapsulate the packet inside an Ethernet II frame, which requires a **Destination MAC address**. If the sender does not have this mapping in memory, it cannot build the frame.\n\n### 2. ARP Resolution Workflow: Request vs Reply\n1. **ARP Cache Lookup**: Host A checks its local in-memory ARP Table. If an entry exists for `192.168.1.50`, Host A immediately constructs the frame.\n2. **ARP Request (Broadcast)**: If no entry exists, Host A broadcasts an ARP Request frame (`EtherType 0x0806`, Opcode 1). The frame destination MAC is set to `FF:FF:FF:FF:FF:FF` (Broadcast), prompting the switch to flood the frame to all active ports on the VLAN. The payload asks: *"Who has IP 192.168.1.50? Tell 192.168.1.10 (MAC AA:BB:CC:11:22:33)"*.\n3. **Frame Filtering & Unicast ARP Reply**: All hosts on the subnet receive the broadcast. Non-target nodes inspect the target IP (`192.168.1.50`), see it does not match their own IP, and quietly discard the frame without generating traffic. The host that owns `192.168.1.50` responds with a **unicast ARP Reply** (Opcode 2) sent directly to Host A\'s MAC: *"192.168.1.50 is at MAC 44:55:66:77:88:99"*\n4. **Cache & Transmit**: Host A adds the dynamic entry to its ARP cache with an aging timer (typically 20–300 seconds) and immediately transmits the buffered IP data frames.\n\n### 3. Local vs Remote Off-Subnet Destination Resolution\n* **Local Destinations**: If the destination IP resides on the same local subnet (evaluated using the subnet mask), Host A ARPs directly for the destination host\'s MAC.\n* **Remote (Internet) Destinations**: If the destination IP is on a remote network (e.g. `8.8.8.8`), Host A **CANNOT ARP for 8.8.8.8** because routers never forward Layer 2 broadcasts. Instead, Host A ARPs for the MAC address of its **Default Gateway** (`192.168.1.1`). The IP packet retains Destination IP `8.8.8.8`, but the Ethernet frame Destination MAC is set to the Gateway\'s MAC.\n\n### 4. Gratuitous ARP (GARP) & Duplicate Address Detection\nA Gratuitous ARP is an unprompted ARP broadcast where the Sender IP and Target IP are identical. It is transmitted upon interface boot to:\n1. Detect Duplicate IP conflicts (if another device replies, a conflict is flagged).\n2. Update neighbor switch CAM tables and neighbor ARP caches after NIC or gateway hardware failover.',
      components: [
        {
          name: 'Hardware Type & Protocol Type',
          detail: 'Hardware Type = 0x0001 (Ethernet); Protocol Type = 0x0800 (IPv4), indicating what Layer 2/3 protocols are being mapped.',
        },
        {
          name: 'ARP Opcode (1 vs 2)',
          detail: 'Opcode 1 = ARP Request (Broadcast); Opcode 2 = ARP Reply (Unicast direct response).',
        },
        {
          name: 'Sender & Target Address Pairs',
          detail: 'Sender MAC (6B), Sender IP (4B), Target MAC (6B, initialized to 00:00:00:00:00:00 in Requests), Target IP (4B).',
        },
        {
          name: 'ARP Cache Table',
          detail: 'In-memory dynamic lookup table mapping IP -> MAC -> Interface with aging timer (20-300s) to minimize broadcast traffic.',
        },
        {
          name: 'Gratuitous ARP (GARP)',
          detail: 'Sender and Target IP are identical. Broadcast upon boot for Duplicate Address Detection (DAD) and CAM table refresh.',
        },
        {
          name: 'Broadcast Domain Boundary',
          detail: 'Routers terminate Layer 2 broadcast domains and strictly drop ARP broadcast frames, preventing global broadcast storms.',
        },
      ],
      howItWorks: [
        {
          stepNumber: 1,
          title: 'ARP Cache Lookup',
          action: 'The sender checks its local ARP cache table for the target IPv4 address.',
        },
        {
          stepNumber: 2,
          title: 'ARP Request Broadcast',
          action: 'Upon cache miss, sender encapsulates an ARP Request (Opcode 1) in an Ethernet frame with Destination MAC FF:FF:FF:FF:FF:FF.',
        },
        {
          stepNumber: 3,
          title: 'Switch Flooding & Target Reply',
          action: 'The switch floods the broadcast to all VLAN ports; non-matching hosts drop it; the target host generates a unicast ARP Reply (Opcode 2).',
        },
        {
          stepNumber: 4,
          title: 'Cache Update & Data Transmission',
          action: 'The sender records the target IP-to-MAC mapping in its ARP table and transmits the buffered payload packets.',
        },
      ],
      packetHeaderView: {
        protocol: 'ARP Packet Format (EtherType 0x0806)',
        fields: [
          { fieldName: 'Hardware Type (HTYPE)', bitLength: '16 bits', hexSample: '0x0001', description: 'Network link protocol (Ethernet = 1).' },
          { fieldName: 'Protocol Type (PTYPE)', bitLength: '16 bits', hexSample: '0x0800', description: 'Network layer protocol (IPv4 = 0x0800).' },
          { fieldName: 'Hardware / Protocol Length', bitLength: '8 bits / 8 bits', hexSample: '0x06 / 0x04', description: 'MAC length (6 bytes) / IPv4 length (4 bytes).' },
          { fieldName: 'Opcode', bitLength: '16 bits', hexSample: '0x0001 / 0x0002', description: '1 for Request, 2 for Reply.' },
          { fieldName: 'Sender Hardware Address (SHA)', bitLength: '48 bits', hexSample: 'AA:BB:CC:11:22:33', description: 'Originating host MAC address.' },
          { fieldName: 'Sender Protocol Address (SPA)', bitLength: '32 bits', hexSample: '192.168.1.10', description: 'Originating host IPv4 address.' },
          { fieldName: 'Target Hardware Address (THA)', bitLength: '48 bits', hexSample: '00:00:00:00:00:00 (Req)', description: 'Target MAC (0s in Request, filled in Reply).' },
          { fieldName: 'Target Protocol Address (TPA)', bitLength: '32 bits', hexSample: '192.168.1.50', description: 'Destination IPv4 address being resolved.' },
        ],
        headerDiagramAscii: `+-------------------------------------------------------------------------------+
|                    ARP REQUEST & REPLY PROTOCOL SEQUENCE                      |
+-------------------------------------------------------------------------------+
| [ Host A ] (192.168.1.10)                       [ Host B ] (192.168.1.50)     |
|      |                                               |                        |
|      | --- 1. ARP REQUEST (Dst: FF:FF:FF:FF:FF:FF) ->| (Flooded across VLAN)  |
|      |     "Who has 192.168.1.50? Tell 192.168.1.10" |                        |
|      |                                               |                        |
|      | <--- 2. ARP REPLY (Dst: Host A MAC, Unicast) -+                        |
|      |     "192.168.1.50 is at 44:55:66:77:88:99"    |                        |
|      |                                               |                        |
| [ Saved to ARP Cache Table ]                         |                        |
|      | --- 3. Transmits IP Data Frame (Dst: Host B MAC) --------------------> |
+-------------------------------------------------------------------------------+`,
      },
      visualizer: {
        type: 'ARP_FLOW_INSPECTOR',
        title: 'Interactive ARP Resolution & Cache Table Inspector',
        description: 'Watch ARP Request broadcasts traverse a local switched network, observe non-matching nodes discard the frame, and trace dynamic ARP table caching.',
      },
      workedExample: {
        title: 'Determining ARP Target for Local vs Remote Communication',
        problemStatement:
          'Host A has IP `192.168.1.10/24` and Default Gateway `192.168.1.1`. Host A needs to transmit data to:\n1. Server Alpha (`192.168.1.50`)\n2. Web Server Beta (`93.184.216.34`)\nWhich target IP address is placed in the ARP Request payload for each destination, and what destination MAC address is used on the outgoing Ethernet frame?',
        stepByStepSolution: [
          'Step 1: For Server Alpha (192.168.1.50), Host A performs bitwise AND with subnet mask 255.255.255.0. Target network is 192.168.1.0 (Same local subnet).',
          '  Host A sends an ARP Request with Target IP 192.168.1.50. Outgoing frame destination MAC is set to Server Alpha\'s MAC once resolved.',
          'Step 2: For Web Server Beta (93.184.216.34), Host A performs bitwise AND with subnet mask. Target network is 93.184.216.0 (Remote subnet).',
          '  Host A CANNOT ARP for 93.184.216.34 because ARP broadcasts do not cross routers.',
          '  Host A instead sends an ARP Request with Target IP 192.168.1.1 (Default Gateway).',
          'Step 3: When sending the IP packet to 93.184.216.34, the IP packet header retains Destination IP 93.184.216.34, but the Layer 2 Ethernet frame has Destination MAC equal to the Gateway\'s MAC.',
        ],
        finalResult:
          'Local Server Alpha: ARP target is 192.168.1.50 (Frame Dst MAC is Server Alpha MAC). Remote Web Server: ARP target is 192.168.1.1 (Frame Dst MAC is Default Gateway MAC).',
      },
      practice: [
        {
          id: 1,
          prompt: 'What Layer 2 Ethernet destination MAC address is placed in the header of an ARP Request frame?',
          expected: 'FF:FF:FF:FF:FF:FF (Broadcast MAC address)',
          hints: 'ARP Requests must reach all hosts on the local broadcast domain so the unknown owner of the IP can hear the query.',
        },
        {
          id: 2,
          prompt: 'What ARP opcode value indicates an ARP Request vs an ARP Reply?',
          expected: 'Opcode 1 = ARP Request, Opcode 2 = ARP Reply',
          hints: 'Opcodes are defined in the 16-bit operation field of the ARP header.',
        },
        {
          id: 3,
          prompt: 'If Host A (10.0.0.5/24) wants to send a packet to 10.0.0.200/24, does Host A ARP for 10.0.0.200 or its Default Gateway?',
          expected: 'Host A ARPs for 10.0.0.200 directly because both hosts share the 10.0.0.0/24 local subnet.',
          hints: 'Evaluate the network ID: 10.0.0.5 and 10.0.0.200 both belong to the 10.0.0.0/24 subnet.',
        },
        {
          id: 4,
          prompt: 'If Host A (10.0.0.5/24) wants to send a packet to 1.1.1.1, what IP address does Host A place in the Target Protocol Address field of the ARP Request?',
          expected: 'The IP address of its Default Gateway (e.g. 10.0.0.1).',
          hints: 'ARP broadcasts cannot cross routers. To reach off-subnet destinations, traffic must be delivered to the Layer 2 MAC of the local gateway.',
        },
        {
          id: 5,
          prompt: 'What happens when a non-target host on the same switch receives an ARP Request for an IP address it does not own?',
          expected: 'The non-target host silently discards the frame without generating any network response.',
          hints: 'Only the host matching the Target Protocol Address generates an ARP Reply.',
        },
        {
          id: 6,
          prompt: 'What is the purpose of a Gratuitous ARP (GARP) transmission when an interface boots up?',
          expected: 'To perform Duplicate Address Detection (DAD) and update neighboring switch CAM tables and host ARP caches.',
          hints: 'In a Gratuitous ARP, the sender and target IP addresses are identical.',
        },
      ],
      recap: [
        'ARP dynamically maps 32-bit IPv4 addresses to 48-bit physical MAC addresses within a Layer 2 broadcast domain.',
        'ARP Requests use Broadcast MAC FF:FF:FF:FF:FF:FF (Opcode 1); ARP Replies use Unicast MAC (Opcode 2).',
        'Non-target hosts silently drop ARP broadcast requests; only the target owner replies.',
        'Hosts maintain an in-memory ARP cache table with aging timers (20-300s) to avoid constant broadcast flooding.',
        'For off-subnet destinations, hosts ARP for the Default Gateway MAC, NOT the remote destination IP.',
        'Gratuitous ARP (GARP) broadcasts detect duplicate IP conflicts upon device initialization.',
      ],
    },
    questions: [
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
    ],
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
    contentV2: {
      objective:
        'Understand the complete chronological sequence of network protocols executed when a host boots up, connects to a network, resolves names, and transmits its first application-layer packet.',
      prerequisites: [
        'level-0-dns-internet-phonebook',
        'level-0-dhcp-automatic-ip-allocation',
        'arp-protocol-overview',
        'ethernet-mac-addresses-overview',
      ],
      whyItMatters:
        'Network troubleshooting requires understanding how protocols interact sequentially. If a user cannot browse the web, knowing whether the failure occurred during DHCP leasing, ARP gateway resolution, DNS name translation, or TCP transport connection isolates the exact failure point.',
      explanation:
        'When an unconfigured computer plugs an Ethernet cable into a switch and requests `https://api.example.com`, six distinct protocol phases execute in strict chronological orchestration:\n\n### 1. Phase 1: Physical Link Up & Carrier Detect\nPHY transceiver electrical autonegotiation establishes link pulse synchronization and full-duplex operation at Layer 1 and Layer 2.\n\n### 2. Phase 2: DHCP Lease (DORA)\nClient broadcasts Discover (`0.0.0.0:68` -> `255.255.255.255:67`) -> receives Offer -> sends Request -> receives ACK containing its IP (`192.168.1.50`), Subnet Mask (`/24`), Default Gateway (`192.168.1.1`), and DNS Servers (`8.8.8.8`).\n\n### 3. Phase 3: Duplicate Address Detection (GARP)\nClient broadcasts Gratuitous ARP (GARP) for `192.168.1.50` to verify that no other host on the broadcast domain is using the leased address.\n\n### 4. Phase 4: Default Gateway ARP Resolution\nClient evaluates `8.8.8.8` against its local subnet mask (`/24`), determines DNS is remote, and sends an ARP Request broadcast asking "Who has `192.168.1.1`?" to learn the Gateway MAC (`00:11:22:33:44:55`).\n\n### 5. Phase 5: DNS Recursive Name Resolution\nClient sends a DNS UDP query for `api.example.com` to `8.8.8.8:53` (framed to Gateway MAC `00:11:22:33:44:55`) -> receives DNS Answer IP `93.184.216.34`.\n\n### 6. Phase 6: Transport Handshake & HTTPS Request\nClient sends a TCP SYN packet to `93.184.216.34:443` (framed to Gateway MAC) -> completes the 3-Way Handshake -> initiates TLS key negotiation and sends HTTP GET request.',
      components: [
        {
          name: 'Phase 1: Physical Link Up',
          detail: 'PHY autonegotiation establishes link pulse synchronization and full-duplex connection.',
        },
        {
          name: 'Phase 2: DHCP DORA Lease',
          detail: 'Client acquires IP parameters (IP, Subnet Mask, Gateway, DNS) via UDP 67/68.',
        },
        {
          name: 'Phase 3: Gratuitous ARP (DAD)',
          detail: 'Broadcasts ARP Probe for leased IP to ensure zero address conflict on LAN.',
        },
        {
          name: 'Phase 4: Gateway ARP Resolution',
          detail: 'Broadcasts ARP Request to resolve local Default Gateway IP to Layer 2 MAC address.',
        },
        {
          name: 'Phase 5: DNS Name Resolution',
          detail: 'Transmits UDP 53 query via Gateway to resolve domain name into target IP.',
        },
        {
          name: 'Phase 6: TCP Handshake & HTTPS',
          detail: 'Executes SYN/SYN-ACK/ACK to target IP:443 and initiates encrypted web exchange.',
        },
      ],
      howItWorks: [
        {
          stepNumber: 1,
          title: 'Phase 1 (Link Up)',
          action: 'Cable plugged in; switch port transitions to Up/Up; MAC learned in CAM table.',
        },
        {
          stepNumber: 2,
          title: 'Phase 2 (DHCP DORA)',
          action: 'Client broadcasts Discover from 0.0.0.0; server returns ACK with IP 192.168.1.50, Mask /24, Gateway 192.168.1.1, DNS 8.8.8.8.',
        },
        {
          stepNumber: 3,
          title: 'Phase 3 (GARP DAD)',
          action: 'Client broadcasts Gratuitous ARP for 192.168.1.50 to verify no other host claims the address.',
        },
        {
          stepNumber: 4,
          title: 'Phase 4 (Gateway ARP)',
          action: 'Client sends ARP Request for Gateway 192.168.1.1; Gateway returns unicast ARP Reply with its MAC.',
        },
        {
          stepNumber: 5,
          title: 'Phase 5 (DNS Query)',
          action: 'Client encapsulates DNS query for api.example.com into UDP packet to 8.8.8.8, framed to Gateway MAC.',
        },
        {
          stepNumber: 6,
          title: 'Phase 6 (TCP SYN & HTTP)',
          action: 'Client receives IP 93.184.216.34 and transmits TCP SYN packet framed to Gateway MAC.',
        },
      ],
      packetHeaderView: {
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
      visualizer: {
        type: 'BOOTUP_LIFECYCLE_TIMELINE',
        title: 'Interactive Host Boot-Up Lifecycle & Protocol Sequence Engine',
        description: 'Step through the 6 chronological phases from cold cable plug-in to web browser HTTP GET request, inspecting packet headers, MAC/IP mappings, and socket states.',
      },
      workedExample: {
        title: 'Analyzing Frame Headers During an Outbound HTTPS Request',
        problemStatement: 'When a host (`192.168.1.50`, MAC `00:AA`) sends an HTTPS packet to `93.184.216.34` via Gateway `192.168.1.1` (MAC `00:BB`):\n1. What is the Source IP and Destination IP in the Layer 3 header?\n2. What is the Source MAC and Destination MAC in the Layer 2 header?',
        stepByStepSolution: [
          'Step 1 (Layer 3 IP Header): Source IP is the originating client (`192.168.1.50`). Destination IP is the ultimate web server (`93.184.216.34`). IP addresses DO NOT change across router hops.',
          'Step 2 (Layer 2 Ethernet Header): Source MAC is the client NIC (`00:AA`). Destination MAC is the local Default Gateway router interface (`00:BB`). MAC addresses change at every router hop.',
        ],
        finalResult: 'L3: 192.168.1.50 -> 93.184.216.34 | L2: 00:AA -> 00:BB (Gateway MAC).',
      },
      practice: [
        {
          id: 1,
          prompt: 'What are the six phases of the host boot-up lifecycle in exact chronological order?',
          expected: 'Physical Link Up -> DHCP Lease (DORA) -> Gratuitous ARP (DAD) -> Default Gateway ARP Resolution -> DNS Name Resolution -> Outbound TCP Handshake & HTTPS GET.',
          hints: 'Link -> DHCP -> GARP -> Gateway ARP -> DNS -> TCP/HTTP.',
        },
        {
          id: 2,
          prompt: 'During Phase 3 (Gratuitous ARP), what indicates that the host\'s newly leased IP address is unique?',
          expected: 'Receiving zero ARP replies to the GARP broadcast within the timeout window.',
          hints: 'Zero replies indicates no IP conflict.',
        },
        {
          id: 3,
          prompt: 'When sending a packet to an external server on the Internet, what is placed in the Destination MAC field of the Ethernet frame?',
          expected: 'The MAC address of the local Default Gateway router interface.',
          hints: 'Destination MAC is always the Default Gateway for remote IPs.',
        },
        {
          id: 4,
          prompt: 'Why cannot a client perform DNS name resolution before completing DHCP lease acquisition?',
          expected: 'Because without DHCP, the client lacks a valid source IP address, a default gateway route, and the IP address of a recursive DNS server.',
          hints: 'A host cannot send IP packets without an IP address and DNS server setting.',
        },
        {
          id: 5,
          prompt: 'Which protocol and port numbers are used during Phase 2 (DHCP) vs Phase 5 (DNS)?',
          expected: 'DHCP uses UDP ports 67 (server) and 68 (client); DNS query uses UDP port 53.',
          hints: 'DHCP = UDP 67/68; DNS = UDP 53.',
        },
        {
          id: 6,
          prompt: 'If pinging 8.8.8.8 succeeds but opening https://google.com fails, which lifecycle phase has failed?',
          expected: 'Phase 5 (DNS Name Resolution), since Layer 3 routing to 8.8.8.8 is functional but domain names cannot be resolved.',
          hints: 'IP works but domain name fails = DNS failure.',
        },
      ],
      recap: [
        'The host boot-up lifecycle coordinates 6 distinct protocols in strict chronological order.',
        'DHCP provides IP, mask, default gateway, and DNS server addresses.',
        'Gratuitous ARP validates address uniqueness on the local broadcast domain.',
        'For remote destinations, Destination IP is the ultimate server; Destination MAC is the local Default Gateway.',
        'DNS name resolution translates hostnames to IPs prior to initiating the TCP 3-way handshake.',
      ],
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
        explanation:
          'A host must first establish Physical Link Up, acquire its IP/gateway/DNS configuration via DHCP, verify IP uniqueness via Gratuitous ARP, resolve the Gateway MAC via ARP, resolve the domain name via DNS, and finally initiate the TCP handshake and HTTPS GET request.',
        explanationsJson: {
          1: 'Reversed order.',
          2: 'DNS requires an IP address first.',
          3: 'Physical link must precede all packets.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Integrated Host Boot-Up Sequence',
      },
      {
        text: 'When a host at `192.168.1.50` transmits an HTTPS request to web server `93.184.216.34` via Default Gateway `192.168.1.1`, what addresses are placed in the Layer 2 Ethernet frame and Layer 3 IP packet headers?',
        options: [
          'Layer 3: Src IP = 192.168.1.50, Dst IP = 93.184.216.34 | Layer 2: Src MAC = Host MAC, Dst MAC = Default Gateway Router MAC',
          'Layer 3: Src IP = 192.168.1.50, Dst IP = 192.168.1.1 | Layer 2: Src MAC = Host MAC, Dst MAC = Web Server MAC',
          'Layer 3: Src IP = 192.168.1.1, Dst IP = 93.184.216.34 | Layer 2: Src MAC = Default Gateway MAC, Dst MAC = Broadcast',
          'Layer 3: Src IP = 93.184.216.34, Dst IP = 192.168.1.50 | Layer 2: Src MAC = Host MAC, Dst MAC = Host MAC',
        ],
        correctOption: 0,
        explanation:
          'In remote internetwork routing, Layer 3 IP addresses represent the end-to-end source and ultimate destination (Src IP = Host, Dst IP = Web Server), while Layer 2 MAC addresses change hop-by-hop (Src MAC = Host, Dst MAC = Default Gateway router).',
        explanationsJson: {
          1: 'The destination IP is the remote server, not the gateway IP.',
          2: 'The source IP is the originating client host, not the gateway.',
          3: 'Source and destination IP are reversed.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Layer 2 vs Layer 3 Addressing in Remote Forwarding',
      },
      {
        text: 'What is the primary function of transmitting a Gratuitous ARP (GARP) broadcast immediately following DHCP lease acquisition (Phase 3)?',
        options: [
          'Duplicate Address Detection (DAD): To verify that no other active host on the local broadcast domain is already using the newly leased IP address',
          'To download the host\'s operating system updates from the gateway',
          'To encrypt the client\'s wireless credentials',
          'To synchronize the computer\'s real-time clock with NTP',
        ],
        correctOption: 0,
        explanation:
          'Gratuitous ARP broadcasts an ARP Request for the host\'s own new IP. If another host replies, an IP conflict is detected, allowing the client to reject the lease and request a new IP.',
        explanationsJson: {
          1: 'OS updates use HTTPS/TCP, not GARP.',
          2: 'Wireless encryption is negotiated via 802.11 4-way handshakes.',
          3: 'Clock synchronization is performed by NTP (UDP 123).',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Gratuitous ARP Duplicate Address Detection',
      },
      {
        text: 'A technician observes that a client computer can successfully ping external IP address `8.8.8.8`, but entering `https://www.example.com` into a web browser results in a timeout error. Which lifecycle phase has failed?',
        options: [
          'Phase 5: DNS Name Resolution failed to translate `www.example.com` into an IP address',
          'Phase 1: Physical Link is disconnected',
          'Phase 2: DHCP server failed to allocate an IP address',
          'Phase 4: Default Gateway ARP resolution failed',
        ],
        correctOption: 0,
        explanation:
          'Because pinging `8.8.8.8` succeeds, Physical Link (Phase 1), IP leasing (Phase 2), Gateway ARP (Phase 4), and Layer 3 routing are all fully operational. Failure to load domain names isolates the problem directly to DNS resolution (Phase 5).',
        explanationsJson: {
          1: 'If the physical link were disconnected, pinging 8.8.8.8 would fail.',
          2: 'If DHCP had failed, the host would have no IP to ping 8.8.8.8.',
          3: 'If Gateway ARP had failed, packets could not leave the local LAN to reach 8.8.8.8.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
        questionType: QuestionType.TROUBLESHOOTING,
        concept: 'Lifecycle Sequential Troubleshooting & DNS Isolation',
      },
      {
        text: 'Why does an operating system execute an ARP request for the Default Gateway IP address before it can transmit a DNS query to recursive resolver `8.8.8.8`?',
        options: [
          'Because 8.8.8.8 is on a remote subnet, the host must encapsulate the IP packet in a Layer 2 Ethernet frame addressed to the local Default Gateway router\'s MAC address',
          'Because DNS queries must be converted into broadcast frames',
          'Because the DNS server MAC address is always identical to the client MAC address',
          'Because the router disables DNS until ARP is executed',
        ],
        correctOption: 0,
        explanation:
          'When the destination IP (`8.8.8.8`) is outside the local subnet, the host knows it cannot reach it directly at Layer 2. It must forward the packet to its Default Gateway, requiring the Gateway\'s MAC address in the frame header.',
        explanationsJson: {
          1: 'DNS queries are unicast UDP packets, not broadcasts.',
          2: 'MAC addresses are unique physical hardware identifiers.',
          3: 'ARP is triggered naturally by the host TCP/IP stack whenever an IP route requires Layer 2 framing.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Default Gateway ARP Resolution Mechanics',
      },
      {
        text: 'During Phase 6 (Transport Handshake), which TCP flags are exchanged between client and server to establish a reliable connection before transmitting HTTP GET data?',
        options: [
          'SYN (Client -> Server) -> SYN-ACK (Server -> Client) -> ACK (Client -> Server)',
          'FIN -> FIN-ACK -> RST',
          'PING -> PONG -> ACK',
          'DISCOVER -> OFFER -> REQUEST',
        ],
        correctOption: 0,
        explanation:
          'TCP connection establishment uses the 3-Way Handshake: SYN from client, SYN-ACK from server, and ACK from client, establishing initial sequence numbers and socket state.',
        explanationsJson: {
          1: 'FIN is used for connection teardown, not establishment.',
          2: 'PING/PONG are ICMP echo messages, not TCP flags.',
          3: 'DISCOVER/OFFER/REQUEST is the DHCP DORA process.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'TCP 3-Way Handshake Flags',
      },
    ],
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
    contentV2: {
      objective:
        'Understand 16-bit transport port numbers ($0 \\text{ to } 65535$), differentiate between Well-Known (0–1023), Registered (1024–49151), and Dynamic/Ephemeral (49152–65535) port ranges, define a Socket and 4-tuple Socket Pair, and analyze Layer 4 Multiplexing and Demultiplexing inside the operating system kernel.',
      prerequisites: [
        'NET-103: The 7-Layer OSI Reference Model & Data Encapsulation',
        'NET-202: IPv4 Addressing, Subnet Masks & CIDR Subnetting',
      ],
      whyItMatters:
        'A computer has only one physical network card and one IP address. Without transport ports and socket multiplexing, an operating system could not simultaneously run multiple browser tabs, streaming audio, an SSH terminal, and background updates without data streams colliding and corrupting one another.',
      explanation:
        'The Transport Layer (Layer 4) provides process-to-process communication between software applications running on network hosts. While IP addresses identify a specific physical or virtual machine on a network, **Port Numbers** identify the specific application software process running inside that machine\'s operating system.\n\n### 1. 16-Bit Port Architecture & Official IANA Ranges\nPort numbers are 16-bit unsigned integers, providing $2^{16} = 65,536$ unique numerical addresses ($0 \\text{ to } 65535$) for both TCP and UDP. The Internet Assigned Numbers Authority (IANA) divides these ports into three official ranges:\n1. **Well-Known Ports ($0 \\text{ to } 1023$)**: Reserved for standardized system protocols and core infrastructure daemons. On Unix/Linux systems, binding to a well-known port requires root/administrator privileges. Standard examples:\n   - HTTP: `80` | HTTPS: `443` | DNS: `53` | SSH: `22` | Telnet: `23` | SMTP: `25` | DHCP Server: `67` | DHCP Client: `68` | NTP: `123` | SNMP: `161`.\n2. **Registered Ports ($1024 \\text{ to } 49151$)**: Assigned by IANA upon request to vendor applications and database servers. Standard examples:\n   - MySQL: `3306` | Microsoft Remote Desktop (RDP): `3389` | PostgreSQL: `5432` | Redis: `6379` | SIP VoIP: `5060`.\n3. **Dynamic / Ephemeral Ports ($49152 \\text{ to } 65535$)**: Allocated dynamically by client operating systems for temporary outgoing client connections. When a browser initiates an HTTPS request, the OS kernel assigns a free ephemeral port (e.g. `51234`), which is recycled as soon as the connection terminates.\n\n### 2. Sockets & 4-Tuple Socket Pairs\n* **Socket**: The logical endpoint of a network communication channel, defined as the combination of: $\\text{IP Address} + \\text{Port Number} + \\text{Protocol}$ (e.g. `192.168.1.50:51234 TCP`).\n* **Socket Pair (4-Tuple)**: To uniquely distinguish every network connection globally, the operating system kernel tracks a 4-tuple:\n  $$\\text{Socket Pair} = \\{ \\text{Source IP}, \\text{Source Port}, \\text{Destination IP}, \\text{Destination Port} \\}$$\n  Even if a user opens 10 separate browser tabs to the exact same web server (`104.21.48.12:443`), each tab receives a unique ephemeral source port (`:51234`, `:51235`, `:51236`), making each 4-tuple mathematically unique.\n\n### 3. Layer 4 Multiplexing & Demultiplexing\n* **Multiplexing (Egress Transmission)**: The OS kernel gathers data chunks from dozens of separate application sockets, wraps them in TCP/UDP headers with their respective source ports, and funnels them through the single physical Network Interface Card (NIC).\n* **Demultiplexing (Ingress Delivery)**: When packets return from the physical wire, the NIC strips Layer 2 framing, the IP layer validates Layer 3 addresses, and the transport stack inspects the **Destination Port Number** to deliver the payload bytes directly into the correct application\'s memory buffer.',
      components: [
        {
          name: '16-Bit Port Length (0 to 65535)',
          detail: 'Provides 65,536 distinct numerical addresses for both TCP and UDP protocol stacks.',
        },
        {
          name: 'Well-Known Ports (0 – 1023)',
          detail: 'Privileged system services: HTTP (80), HTTPS (443), DNS (53), SSH (22), DHCP (67/68), NTP (123).',
        },
        {
          name: 'Registered Ports (1024 – 49151)',
          detail: 'Vendor and database applications: MySQL (3306), RDP (3389), PostgreSQL (5432), Redis (6379).',
        },
        {
          name: 'Dynamic / Ephemeral Ports (49152 – 65535)',
          detail: 'Client OS auto-allocated ports for transient outbound connections, recycled upon socket closure.',
        },
        {
          name: 'Socket & 4-Tuple Socket Pair',
          detail: 'Socket = IP:Port:Proto. 4-Tuple = {Src IP, Src Port, Dst IP, Dst Port} uniquely identifying active sessions.',
        },
        {
          name: 'Port Multiplexing & Demultiplexing',
          detail: 'Multiplexing shares one physical NIC across processes; Demultiplexing directs incoming data by Destination Port.',
        },
      ],
      howItWorks: [
        {
          stepNumber: 1,
          title: 'Server Socket Binding',
          action: 'Web server process binds socket to `0.0.0.0:443 TCP` and enters LISTENING state in OS kernel.',
        },
        {
          stepNumber: 2,
          title: 'Client Ephemeral Port Allocation',
          action: 'Browser opens connection; OS kernel allocates ephemeral source port `51234`, creating Socket `192.168.1.50:51234`.',
        },
        {
          stepNumber: 3,
          title: 'Socket Pair Establishment',
          action: 'Kernel records 4-tuple `192.168.1.50:51234 <-> 104.21.48.12:443 TCP` in active socket table.',
        },
        {
          stepNumber: 4,
          title: 'Kernel Demultiplexing on Ingress',
          action: 'When return packet arrives with Destination Port 51234, OS kernel demultiplexes payload directly to the browser process buffer.',
        },
      ],
      packetHeaderView: {
        protocol: 'Transport Layer Port Fields (TCP & UDP)',
        fields: [
          { fieldName: 'Source Port', bitLength: '16 bits (2 Bytes)', hexSample: '0xC822 (51234)', description: 'Client ephemeral port or server response port.' },
          { fieldName: 'Destination Port', bitLength: '16 bits (2 Bytes)', hexSample: '0x01BB (443)', description: 'Target application service daemon port.' },
        ],
        headerDiagramAscii: `+-------------------------------------------------------------------------------+
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
+-------------------------------------------------------------------------------+`,
      },
      visualizer: {
        type: 'SOCKET_MULTIPLEXER',
        title: 'Interactive Socket Multiplexer & Port Inspection Engine',
        description: 'Observe multiple client browser tabs and background applications multiplexing across a single IP address, and watch the OS kernel demultiplex returning packets to their exact socket.',
      },
      workedExample: {
        title: 'Differentiating Concurrent Connections to the Same Web Server',
        problemStatement:
          'A user opens two separate tabs in Chrome to `https://netvision.edu` (`104.21.48.12:443`) from workstation `192.168.1.50`.\n1. What are the complete 4-tuple socket pairs for Tab 1 and Tab 2?\n2. How does the client operating system ensure web responses for Tab 1 do not appear in Tab 2?',
        stepByStepSolution: [
          'Step 1 (Tab 1 4-Tuple): When Tab 1 opens, the OS assigns ephemeral port `51234`. 4-tuple: `{ 192.168.1.50:51234 <-> 104.21.48.12:443 TCP }`.',
          'Step 2 (Tab 2 4-Tuple): When Tab 2 opens, the OS assigns a new distinct ephemeral port `51235`. 4-tuple: `{ 192.168.1.50:51235 <-> 104.21.48.12:443 TCP }`.',
          'Step 3 (Demultiplexing on Return): When the web server replies to Tab 1, it transmits packets with Destination Port `51234`. When it replies to Tab 2, it transmits packets with Destination Port `51235`. The OS kernel inspects the destination port on ingress and routes bytes exclusively to the matching process thread.',
        ],
        finalResult:
          'Unique ephemeral source ports ensure each concurrent socket pair is mathematically distinct.',
      },
      practice: [
        {
          id: 1,
          prompt: 'What is the total bit length and numerical range of Layer 4 TCP and UDP port numbers?',
          expected: '16 bits (range: 0 to 65535).',
          hints: '2^16 = 65536 total port values.',
        },
        {
          id: 2,
          prompt: 'What are the three official IANA port classifications and their respective numerical boundaries?',
          expected: 'Well-Known Ports (0 – 1023), Registered Ports (1024 – 49151), and Dynamic/Ephemeral Ports (49152 – 65535).',
          hints: '0-1023 system; 1024-49151 vendor apps; 49152-65535 client ephemeral.',
        },
        {
          id: 3,
          prompt: 'What four addressing parameters constitute a complete network "Socket Pair" (4-tuple)?',
          expected: 'Source IP Address, Source Port Number, Destination IP Address, and Destination Port Number (along with Transport Protocol).',
          hints: 'Src IP, Src Port, Dst IP, Dst Port.',
        },
        {
          id: 4,
          prompt: 'What standard well-known port numbers are assigned to HTTP, HTTPS, SSH, DNS, and DHCP Server?',
          expected: 'HTTP = 80, HTTPS = 443, SSH = 22, DNS = 53, DHCP Server = 67.',
          hints: '80, 443, 22, 53, 67.',
        },
        {
          id: 5,
          prompt: 'What is the difference between Layer 4 Multiplexing and Demultiplexing in the OS kernel?',
          expected: 'Multiplexing combines data from multiple application sockets onto a single physical NIC; Demultiplexing delivers incoming packets to the correct application socket based on Destination Port.',
          hints: 'Multiplexing is egress gathering; demultiplexing is ingress routing by port.',
        },
        {
          id: 6,
          prompt: 'When a web developer launches a server and receives the error "Address already in use: bind", what does this mean?',
          expected: 'Another running process or daemon on the machine is already bound to and listening on that specific IP and port number combination.',
          hints: 'Only one process can listen on a specific port per IP and protocol at a time.',
        },
      ],
      recap: [
        'Ports are 16-bit integers ($0 \\text{ to } 65535$) identifying application processes on a host.',
        'IANA port bands: Well-Known (0-1023), Registered (1024-49151), and Ephemeral (49152-65535).',
        'A Socket is IP:Port:Protocol; a Socket Pair (4-tuple) uniquely distinguishes active network sessions.',
        'Multiplexing allows multiple application sockets to share a single physical NIC.',
        'Demultiplexing directs incoming packets to the correct process based on Destination Port.',
      ],
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
        explanation:
          'IANA officially designates 16-bit ports into Well-Known (0 to 1023 for system services), Registered (1024 to 49151 for applications), and Dynamic/Ephemeral (49152 to 65535 for client outbound connections).',
        explanationsJson: {
          1: 'Port numbers do not use IP class letters.',
          2: 'Invalid arbitrary ranges.',
          3: 'Both TCP and UDP span the full 0-65535 range.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'IANA Port Classification Ranges',
      },
      {
        text: 'What constitutes a complete Transport Layer "Socket Pair" (4-tuple) that uniquely distinguishes a network conversation globally across the Internet?',
        options: [
          'Source IP Address, Source Port Number, Destination IP Address, Destination Port Number',
          'Source MAC Address, Destination MAC Address, VLAN ID, Subnet Mask',
          'Domain Name, URL Path, Browser Cookie, HTTP Status Code',
          'Serial Number, Transceiver Model, Fiber Core Diameter, Optical Wavelength',
        ],
        correctOption: 0,
        explanation:
          'A 4-tuple socket pair (Source IP, Source Port, Destination IP, Destination Port) along with the transport protocol uniquely identifies every end-to-end conversation across the global Internet.',
        explanationsJson: {
          1: 'MAC addresses and VLANs are Layer 2 framing parameters.',
          2: 'URL paths and cookies are Layer 7 application data.',
          3: 'Hardware serials and wavelengths are Physical Layer 1 attributes.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'The 4-Tuple Socket Pair',
      },
      {
        text: 'Which of the following correctly pairs standard Well-Known port numbers with their respective protocol services?',
        options: [
          'HTTP = 80, HTTPS = 443, SSH = 22, DNS = 53, DHCP Server = 67',
          'HTTP = 443, HTTPS = 80, SSH = 53, DNS = 22, DHCP Server = 25',
          'HTTP = 21, HTTPS = 23, SSH = 80, DNS = 443, DHCP Server = 110',
          'HTTP = 8080, HTTPS = 8443, SSH = 2222, DNS = 5353, DHCP Server = 6767',
        ],
        correctOption: 0,
        explanation:
          'Official well-known ports: HTTP uses 80, HTTPS uses 443, SSH uses 22, DNS uses 53, and DHCP Server uses 67.',
        explanationsJson: {
          1: 'Swapped port assignments.',
          2: '21 is FTP, 23 is Telnet, 110 is POP3.',
          3: 'These are non-standard alternate ports.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Standard Well-Known Port Numbers',
      },
      {
        text: 'A user opens three separate browser tabs to `https://www.google.com` (`142.250.190.46:443`). How does the user\'s operating system ensure returning web packets are delivered to the correct browser tab without cross-contamination?',
        options: [
          'The OS assigns a unique ephemeral source port (e.g. 51234, 51235, 51236) to each tab, allowing the kernel to demultiplex returning packets based on destination port',
          'The OS assigns a different physical MAC address to each tab',
          'The OS requests Google to create three separate physical IP addresses for the client',
          'The OS shuts down the other two tabs while one tab is loading',
        ],
        correctOption: 0,
        explanation:
          'The OS allocates a distinct ephemeral source port to each browser tab. When Google replies, the Destination Port in the TCP header matches that specific ephemeral port, allowing the kernel to demultiplex the data stream directly to the correct tab.',
        explanationsJson: {
          1: 'A physical NIC has only one burned-in MAC address.',
          2: 'The client host uses only its single assigned IP address.',
          3: 'Modern multitasking operating systems run all sockets concurrently.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Ephemeral Port Allocation & Socket Demultiplexing',
      },
      {
        text: 'What is the operational difference between Transport Layer Multiplexing and Demultiplexing inside an operating system?',
        options: [
          'Multiplexing gathers data from multiple application sockets onto a single physical network interface; Demultiplexing delivers incoming packets from the interface to the correct application socket based on Destination Port',
          'Multiplexing encrypts packets; Demultiplexing decrypts packets',
          'Multiplexing converts IPv4 to IPv6; Demultiplexing converts IPv6 to IPv4',
          'Multiplexing operates on copper cables; Demultiplexing operates on fiber optics',
        ],
        correctOption: 0,
        explanation:
          'Multiplexing combines outbound streams from diverse application sockets onto one physical link; Demultiplexing separates inbound packet streams and delivers them to their target application process using port headers.',
        explanationsJson: {
          1: 'Encryption/decryption is handled by TLS/Presentation Layer.',
          2: 'Protocol translation is handled by NAT64/Dual-Stack.',
          3: 'Physical media is handled by Layer 1 transceivers.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'Multiplexing vs Demultiplexing Mechanics',
      },
      {
        text: 'A software engineer runs a web server script and encounters the fatal error: `Error: listen EADDRINUSE: address already in use 0.0.0.0:8080`. What does this error signify, and what is the standard diagnostic action?',
        options: [
          'Another active process is already listening on port 8080; use `netstat -ano | findstr :8080` to locate and terminate the conflicting Process ID (PID) or reconfigure the application port',
          'The router has run out of physical bandwidth',
          'The computer has lost its IPv4 default gateway',
          'The DNS root server is offline',
        ],
        correctOption: 0,
        explanation:
          'Only one process can bind to a specific IP address, transport protocol, and port number at any given time. `EADDRINUSE` indicates a port collision with an existing daemon.',
        explanationsJson: {
          1: 'Bandwidth issues cause latency/drops, not local socket binding collisions.',
          2: 'Default gateway reachability does not prevent local socket binding.',
          3: 'DNS root servers do not interfere with local localhost server binding.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
        questionType: QuestionType.TROUBLESHOOTING,
        concept: 'Socket Binding & Port In-Use Troubleshooting',
      },
    ],
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
    contentV2: {
      objective:
        'Understand why large application data must be segmented, calculate MSS from MTU headers ($MSS = MTU - 40$), analyze the problems caused by Layer 3 IP fragmentation, and master Path MTU Discovery (PMTUD) using the DF bit and ICMP.',
      prerequisites: ['level-0-network-ports-socket-boundaries', 'ethernet-mac-addresses-overview'],
      whyItMatters:
        'Transmitting a 50 MB file as a single packet is impossible because link MTU limits frames to 1500 bytes. Mismatched MTU sizes on VPN tunnels cause silent packet drops ("black holes") unless PMTUD is working correctly.',
      explanation:
        'Applications generate byte streams of arbitrary size (e.g. 50 MB video). The Transport Layer (TCP) divides this stream into smaller chunks called **Segments** that fit within physical link capacity.\n\n### 1. MTU vs MSS Mathematical Formulation\n* **Maximum Transmission Unit (MTU)**: The largest Layer 3 packet that a Layer 2 frame can carry without fragmentation (standard Ethernet MTU = **1500 bytes**).\n* **Maximum Segment Size (MSS)**: The maximum TCP payload data in a single segment.\n$$\\text{MSS} = \\text{MTU} - \\text{IPv4 Header (20 B)} - \\text{TCP Header (20 B)} = 1500 - 40 = 1460 \\text{ bytes}$$\n*(For standard IPv6 with 40-byte IP header: $\\text{MSS} = 1500 - 40 - 20 = 1440 \\text{ bytes}$)*.\n\n### 2. The Dangers of Layer 3 IP Fragmentation\nWhen an IP packet exceeds an intermediate link MTU (e.g. 1420-byte IPsec tunnel), routers without PMTUD must fragment the packet into multiple smaller IP packets. Fragmentation degrades performance:\n1. If a single fragment is dropped in transit, the **entire original packet is discarded**.\n2. Routers incur significant CPU and memory overhead buffering and reassembling fragments.\n\n### 3. Path MTU Discovery (PMTUD, RFC 1191)\nTo eliminate fragmentation, senders set the **Don\'t Fragment (DF = 1)** flag in the IPv4 header:\n1. When a packet encounters a router link whose MTU is smaller than the packet size, the router drops the packet.\n2. The router returns an **ICMP Type 3 Code 4** message ("Destination Unreachable: Fragmentation Needed and DF Set") containing the **Next-Hop MTU**.\n3. The sending host reduces its TCP MSS to match the bottleneck MTU and retransmits.',
      components: [
        {
          name: 'MTU (Maximum Transmission Unit)',
          detail: 'Standard Ethernet MTU = 1500 bytes. Represents maximum IP packet size (IP Header + Payload).',
        },
        {
          name: 'MSS (Maximum Segment Size)',
          detail: 'MSS = MTU - (IP Header + TCP Header) = 1500 - 40 = 1460 bytes for standard IPv4.',
        },
        {
          name: 'Transport Stream Reassembly',
          detail: 'Receiver buffers segments and reorders them using TCP Sequence Numbers.',
        },
        {
          name: 'IP Fragmentation Penalty',
          detail: 'Packet loss multiplier and router CPU buffering bottlenecks during fragment reassembly.',
        },
        {
          name: 'Path MTU Discovery (PMTUD)',
          detail: 'Uses DF=1 bit and ICMP Type 3 Code 4 feedback to dynamically adjust sender MSS.',
        },
      ],
      howItWorks: [
        {
          stepNumber: 1,
          title: 'MSS Negotiation in TCP Handshake',
          action: 'During TCP SYN exchange, both endpoints advertise their local MSS (e.g. MSS=1460).',
        },
        {
          stepNumber: 2,
          title: 'Transport Stream Chunking',
          action: 'TCP slices application byte stream into 1460-byte segments, adding sequence numbers.',
        },
        {
          stepNumber: 3,
          title: 'Intermediate MTU Bottleneck',
          action: 'Packet hits 1400-byte VPN tunnel; router cannot fragment because DF=1.',
        },
        {
          stepNumber: 4,
          title: 'PMTUD ICMP Convergence',
          action: 'Router returns ICMP "Packet Too Big (MTU 1400)"; sender shrinks MSS to 1360 bytes without fragmentation.',
        },
      ],
      packetHeaderView: {
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
      visualizer: {
        type: 'SEGMENTATION_PMTUD_ENGINE',
        title: 'Interactive Transport Segmentation & PMTUD Bottleneck Engine',
        description: 'Slice large application files into 1460-byte TCP segments, inject an MTU bottleneck link (e.g. 1400B VPN), and observe ICMP PMTUD feedback adjust the sender MSS dynamically.',
      },
      workedExample: {
        title: 'Calculating MSS for an IPsec VPN Tunnel with 1420-Byte MTU',
        problemStatement: 'An enterprise IPsec VPN tunnel has an MTU of 1420 bytes. Calculate the maximum usable TCP MSS for standard IPv4 traffic.',
        stepByStepSolution: [
          'Step 1 (Identify Header Sizes): Standard IPv4 header = 20 bytes; Standard TCP header = 20 bytes. Total header overhead = 40 bytes.',
          'Step 2 (Apply MSS Formula): $\\text{MSS} = \\text{MTU} - (\\text{IP Header} + \\text{TCP Header})$.',
          'Step 3 (Calculate): $\\text{MSS} = 1420 - 40 = 1380 \\text{ bytes}$.',
        ],
        finalResult: 'Maximum TCP MSS for the VPN tunnel is exactly 1380 bytes.',
      },
      practice: [
        {
          id: 1,
          prompt: 'What is the mathematical formula relating TCP Maximum Segment Size (MSS) to link MTU for IPv4 traffic?',
          expected: 'MSS = MTU - IPv4_Header (20 bytes) - TCP_Header (20 bytes) = MTU - 40 bytes.',
          hints: 'MSS = MTU - 40.',
        },
        {
          id: 2,
          prompt: 'On a standard 1500-byte Ethernet network, what is the maximum TCP MSS value for IPv4?',
          expected: '1460 bytes (1500 - 20 - 20 = 1460).',
          hints: '1500 - 40 = 1460.',
        },
        {
          id: 3,
          prompt: 'What happens if a single fragment of a fragmented IP packet is dropped in transit?',
          expected: 'The destination host cannot reassemble the packet and discards all received fragments, forcing the entire original packet to be retransmitted.',
          hints: 'Loss of 1 fragment causes loss of the entire packet.',
        },
        {
          id: 4,
          prompt: 'How does Path MTU Discovery (PMTUD) detect intermediate link MTU bottlenecks without fragmenting packets?',
          expected: 'The sender sets the Don\'t Fragment (DF=1) bit; intermediate routers drop oversized packets and return an ICMP Type 3 Code 4 message with their MTU.',
          hints: 'DF=1 and ICMP Type 3 Code 4.',
        },
        {
          id: 5,
          prompt: 'If a VPN tunnel has an MTU of 1400 bytes, what should the router\'s TCP MSS clamping value be set to for IPv4?',
          expected: '1360 bytes (1400 MTU - 40 bytes headers = 1360 bytes MSS).',
          hints: '1400 - 40 = 1360.',
        },
        {
          id: 6,
          prompt: 'What causes a PMTUD "Black Hole" on a wide area network connection?',
          expected: 'An intermediate firewall blocking all ICMP traffic, preventing "Packet Too Big" ICMP notifications from reaching the sender.',
          hints: 'Firewall blocking ICMP prevents PMTUD feedback.',
        },
      ],
      recap: [
        'Transport segmentation divides application byte streams into MTU-compatible chunks.',
        'Standard Ethernet: MTU = 1500 bytes; IPv4 TCP MSS = 1460 bytes (MSS = MTU - 40).',
        'IP fragmentation creates severe performance penalties and vulnerability to packet loss.',
        'PMTUD (RFC 1191) uses the DF=1 bit and ICMP Type 3 Code 4 feedback to avoid fragmentation.',
        'TCP MSS clamping on routers prevents VPN tunnel MTU black holes when ICMP is blocked.',
      ],
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
        explanation:
          'Maximum Segment Size (MSS) represents the maximum TCP payload data. Formula: $\\text{MSS} = \\text{MTU} - (\\text{IP Header} + \\text{TCP Header}) = 1500 - 20 - 20 = 1460 \\text{ bytes}$.',
        explanationsJson: {
          1: '1500 is total MTU including headers.',
          2: '1480 forgets to subtract the 20-byte TCP header.',
          3: '64 bytes is minimum Ethernet frame size.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'MSS vs MTU Calculation',
      },
      {
        text: 'An enterprise deploys an IPsec VPN tunnel with an interface MTU of 1420 bytes. What is the maximum IPv4 TCP MSS that should be negotiated across this tunnel to prevent fragmentation?',
        options: [
          '1380 Bytes (1420 MTU - 20B IPv4 Header - 20B TCP Header)',
          '1420 Bytes',
          '1400 Bytes',
          '1460 Bytes',
        ],
        correctOption: 0,
        explanation:
          'Applying the formula $\\text{MSS} = \\text{MTU} - 40$ gives $1420 - 40 = 1380 \\text{ bytes}$.',
        explanationsJson: {
          1: '1420 is the MTU, not MSS.',
          2: '1400 only subtracts the 20-byte IP header.',
          3: '1460 exceeds the 1420-byte tunnel MTU and would cause fragmentation.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'VPN Tunnel MSS Clamping Calculation',
      },
      {
        text: 'How does Path MTU Discovery (PMTUD, RFC 1191) dynamically detect the lowest MTU across an end-to-end network path without performing Layer 3 fragmentation?',
        options: [
          'The sender sets the Don\'t Fragment (DF = 1) bit in the IPv4 header; intermediate routers that cannot forward the oversized packet drop it and return an ICMP Type 3 Code 4 message containing their MTU',
          'The sender queries the local DNS server for the path MTU record',
          'The router converts all packets into jumbo frames automatically',
          'The sender floods broadcast frames to all intermediate switches',
        ],
        correctOption: 0,
        explanation:
          'PMTUD relies on setting DF=1. If an intermediate link MTU is exceeded, the router drops the packet and responds with an ICMP Type 3 Code 4 ("Fragmentation Needed and DF set") specifying its MTU size, allowing the sender to adjust MSS.',
        explanationsJson: {
          1: 'DNS does not track hop-by-hop interface MTUs.',
          2: 'Routers cannot force jumbo frames across non-jumbo links.',
          3: 'PMTUD uses unicast ICMP feedback, not broadcast flooding.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'PMTUD Protocol Mechanics',
      },
      {
        text: 'What is the primary architectural penalty when an IP packet is subjected to Layer 3 fragmentation across a low-MTU WAN link?',
        options: [
          'If any single fragment is dropped in transit, the entire original packet is lost and must be retransmitted, while intermediate routers suffer CPU overhead buffering fragments',
          'The packet payload is permanently encrypted',
          'The destination MAC address is deleted',
          'The Ethernet cable speed is reduced from 1 Gbps to 10 Mbps',
        ],
        correctOption: 0,
        explanation:
          'IP fragmentation lacks per-fragment retransmission. If 1 of 5 fragments is dropped, the destination host discards all 4 received fragments, multiplying effective packet loss and wasting network bandwidth.',
        explanationsJson: {
          1: 'Fragmentation splits packets into smaller IP slices; it does not encrypt data.',
          2: 'MAC headers are re-encapsulated normally per fragment.',
          3: 'Physical link negotiation speed is independent of packet fragmentation.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'IP Fragmentation Performance Penalties',
      },
      {
        text: 'A network engineer notices that users connecting through a VPN tunnel can send small ping packets and connect via SSH, but large file transfers and web pages freeze indefinitely. What is the root cause of this "PMTUD Black Hole"?',
        options: [
          'An intermediate firewall is dropping all ICMP messages, preventing the ICMP Type 3 Code 4 "Packet Too Big" notifications from reaching the sender when large packets with DF=1 are dropped',
          'The web server has disabled HTTPS port 443',
          'The client computer has run out of private IPv4 addresses',
          'The Ethernet switch has disabled spanning tree protocol',
        ],
        correctOption: 0,
        explanation:
          'When firewalls indiscriminately block ICMP, the sender never receives the PMTUD "Packet Too Big" alert. The sender keeps retransmitting oversized packets with DF=1, which the router silently drops, creating a black hole.',
        explanationsJson: {
          1: 'If port 443 were disabled, initial connection would fail rather than freezing on large data.',
          2: 'The client already has an active IP address.',
          3: 'STP loops cause broadcast storms, not selective MTU black holes.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
        questionType: QuestionType.TROUBLESHOOTING,
        concept: 'PMTUD Black Hole Diagnosis',
      },
      {
        text: 'Which Cisco IOS command is applied on a router interface to automatically intercept TCP SYN packets and rewrite the advertised Maximum Segment Size to 1360 bytes for VPN traffic?',
        options: [
          'ip tcp adjust-mss 1360',
          'mtu 1360',
          'ip fragmentation disable',
          'tcp window-size 1360',
        ],
        correctOption: 0,
        explanation:
          '`ip tcp adjust-mss <bytes>` enables TCP MSS clamping, modifying the MSS option inside TCP SYN packets passing through the router to ensure endpoints never exceed the tunnel MTU.',
        explanationsJson: {
          1: '`mtu` configures the physical interface Layer 3 MTU, not TCP MSS rewriting.',
          2: 'Invalid command.',
          3: '`tcp window-size` configures buffer windows, not MSS clamping.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'TCP MSS Clamping Configuration',
      },
    ],
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
    contentV2: {
      objective:
        'Compare TCP (connection-oriented, reliable, byte-stream) vs UDP (connectionless, lightweight, best-effort), master the TCP 3-way handshake and 4-way teardown state machines, calculate sequence numbers and cumulative ACKs during data transfer, understand sliding window flow control, and evaluate transport trade-offs for real-world applications.',
      prerequisites: [
        'NET-101: Bits, Bytes, Binary & Hexadecimal Foundations',
        'NET-103: The TCP/IP 4-Layer Architecture & Model Mapping',
        'NET-202: IPv4 Addressing, Subnet Masks & CIDR Subnetting',
      ],
      whyItMatters:
        'Every web browser, mobile app, and network server relies on the Transport Layer to manage data integrity and delivery speed. Choosing between TCP (guaranteed delivery for web, databases, and file transfers) and UDP (low-latency streaming for VoIP, video, and gaming) is the foundational architectural decision in network engineering.',
      explanation:
        'The Transport Layer (Layer 4) provides logical end-to-end communication between application processes running on different hosts. It achieves this using two distinct protocols designed for contrasting engineering trade-offs: TCP and UDP.\n\n### 1. TCP (Transmission Control Protocol, RFC 793)\nTCP is a **Connection-Oriented, Reliable, Full-Duplex Byte-Stream** protocol. It ensures that every byte sent arrives at the destination in exact sequential order, intact, and without duplicates.\n* **20-Byte Base Header**: Includes Source/Destination Ports, 32-bit Sequence Number, 32-bit Acknowledgment Number, 4-bit Data Offset, 9 control flags (URG, ACK, PSH, RST, SYN, FIN, ECE, CWR, NS), 16-bit Window Size, and Checksum.\n* **3-Way Handshake**: Establishes synchronization before any data is sent:\n  1. `Client -> Server`: **SYN** (Synchronize) with client Initial Sequence Number (ISN = $x$).\n  2. `Server -> Client`: **SYN-ACK** (Synchronize-Acknowledgment) acknowledging client ISN ($Ack = x + 1$) and advertising server ISN ($Seq = y$).\n  3. `Client -> Server`: **ACK** (Acknowledgment) acknowledging server ISN ($Ack = y + 1$). Connection enters `ESTABLISHED` state.\n* **Cumulative Acknowledgments**: ACKs are forward-looking. If a receiver gets bytes 1000 through 1499, it replies with `ACK = 1500` ("I have received all bytes up to 1499; I am waiting for byte 1500").\n* **Sliding Window Flow Control**: The receiver advertises its available buffer capacity in the `Window Size` field. The sender cannot transmit more unacknowledged bytes than the advertised window, preventing buffer overflow.\n* **4-Way Connection Teardown**: Gracefully closes connections:\n  1. `Host A -> Host B`: **FIN** (Finished).\n  2. `Host B -> Host A`: **ACK** (Acknowledged).\n  3. `Host B -> Host A`: **FIN** (Host B finishes sending remaining data).\n  4. `Host A -> Host B`: **ACK** (Host A enters `TIME_WAIT` to ensure final ACK delivery).\n\n### 2. UDP (User Datagram Protocol, RFC 768)\nUDP is a **Connectionless, Unreliable Best-Effort, Low-Latency** protocol. It provides direct packet multiplexing without connection establishment, acknowledgments, retransmissions, or flow control.\n* **8-Byte Minimal Header**: Fixed 4-field structure: Source Port (2B), Destination Port (2B), Length (2B), and Checksum (2B).\n* **Zero Handshake Delay**: UDP transmits immediately without waiting for a 1-RTT handshake.\n* **No Retransmission Stutter**: If a UDP datagram is dropped, the protocol does not retransmit it. For real-time applications (VoIP, live video streaming, DNS lookups, online multiplayer gaming), a late packet is useless, making low latency and jitter predictability vastly more important than 100% reliability.',
      components: [
        {
          name: 'TCP Header (20 Bytes)',
          detail: 'Stateful header containing Source/Dest Ports (16b each), Seq Number (32b), Ack Number (32b), Flags (SYN/ACK/FIN/RST), Window Size (16b), and Checksum.',
        },
        {
          name: 'UDP Header (8 Bytes)',
          detail: 'Minimal fixed header containing Source Port (2B), Destination Port (2B), Length (2B), and Checksum (2B) for ultra-low overhead.',
        },
        {
          name: 'TCP 3-Way Handshake State Machine',
          detail: 'Three-step handshake (SYN -> SYN-ACK -> ACK) synchronizing initial sequence numbers before data exchange.',
        },
        {
          name: 'Cumulative Acknowledgments & Seq Numbers',
          detail: 'Byte-stream tracking where Seq indicates the first byte in the segment and Ack specifies the next expected byte.',
        },
        {
          name: 'Sliding Window Flow Control',
          detail: 'Dynamic flow regulation where receiver advertises available buffer capacity, preventing sender buffer overrun.',
        },
        {
          name: 'TCP 4-Way Teardown (FIN/ACK)',
          detail: 'Bidirectional half-close handshake (FIN -> ACK -> FIN -> ACK) followed by TIME_WAIT safety timeout.',
        },
      ],
      howItWorks: [
        {
          stepNumber: 1,
          title: 'TCP Connection Handshake (SYN -> SYN-ACK -> ACK)',
          action: 'Client sends SYN (ISN=x); Server responds with SYN-ACK (Seq=y, Ack=x+1); Client returns ACK (Seq=x+1, Ack=y+1) to reach ESTABLISHED state.',
        },
        {
          stepNumber: 2,
          title: 'Data Stream Segmentation & Byte Sequencing',
          action: 'Application data is segmented into MSS chunks; each byte is assigned a sequential number tracked by the sender and receiver.',
        },
        {
          stepNumber: 3,
          title: 'Sliding Window Flow Regulation',
          action: 'Receiver processes data and returns ACK with updated Receive Window (win) size; sender throttles output if window shrinks.',
        },
        {
          stepNumber: 4,
          title: 'Connection Termination & TIME_WAIT',
          action: 'Either endpoint initiates teardown via FIN; both sides acknowledge, and the initiator enters TIME_WAIT (2MSL) before closing.',
        },
      ],
      packetHeaderView: {
        protocol: 'TCP (20 Bytes) vs UDP (8 Bytes) Headers',
        fields: [
          { fieldName: 'Source Port / Dest Port', bitLength: '16 bits / 16 bits', hexSample: '52114 / 443', description: 'Originating and receiving application socket ports.' },
          { fieldName: 'Sequence Number (TCP)', bitLength: '32 bits', hexSample: '0x000003E8 (1000)', description: 'Byte offset of the first data byte in this segment.' },
          { fieldName: 'Acknowledgment Number (TCP)', bitLength: '32 bits', hexSample: '0x00001389 (5001)', description: 'Next expected byte from the remote endpoint.' },
          { fieldName: 'Control Flags (TCP)', bitLength: '9 bits', hexSample: 'SYN, ACK, FIN, RST, PSH, URG', description: 'Session lifecycle and transmission state controls.' },
          { fieldName: 'Window Size (TCP)', bitLength: '16 bits', hexSample: '65535 bytes', description: 'Advertised receiver buffer capacity for flow control.' },
          { fieldName: 'UDP Length / Checksum', bitLength: '16 bits / 16 bits', hexSample: '0x0028 / 0xA4F2', description: 'Total UDP datagram length and error detection checksum.' },
        ],
        headerDiagramAscii: `+-------------------------------------------------------------------------------+
|                       TCP vs UDP HEADER COMPARISON                            |
+-------------------------------------------------------------------------------+
| TCP 20-BYTE HEADER:                                                           |
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
| UDP 8-BYTE HEADER:                                                            |
| +-------------------------------+-------------------------------+             |
| | Source Port (16 bits)         | Destination Port (16 bits)    |             |
| +-------------------------------+-------------------------------+             |
| | Length (16 bits)              | Checksum (16 bits)            |             |
| +-------------------------------+-------------------------------+             |
+-------------------------------------------------------------------------------+`,
      },
      visualizer: {
        type: 'TCP_STATE_MACHINE',
        title: 'Interactive TCP 3-Way Handshake & Sliding Window Engine',
        description: 'Step through TCP 3-Way Handshake flag transitions, test Sliding Window buffer scaling, simulate packet drops with retransmission timers, and contrast with lightweight UDP.',
      },
      workedExample: {
        title: 'Calculating TCP Sequence and Acknowledgment Numbers in Flight',
        problemStatement:
          'Client initiates a TCP session with ISN = 1000. Server responds with ISN = 5000. The 3-way handshake completes.\nNext, Client transmits a segment containing 400 bytes of data.\nWhat are the Sequence Number, ACK Number, and Flags in the Client data segment, and what are the Sequence and ACK numbers in the Server acknowledgment?',
        stepByStepSolution: [
          'Step 1 (Handshake Sync): Client SYN has Seq=1000. Server SYN-ACK has Seq=5000, Ack=1001. Client ACK has Seq=1001, Ack=5001.',
          'Step 2 (Client Data Segment): The client begins transmitting data at Seq = 1001. Since it contains 400 bytes, this segment occupies byte offsets 1001 through 1400. Segment has Seq=1001, Ack=5001, Flags=[ACK, PSH].',
          'Step 3 (Server Acknowledgment): The server has received all bytes up to 1400. It acknowledges receipt by asking for the next expected byte: Ack = 1001 + 400 = 1401. Server returns Seq=5001, Ack=1401, Flags=[ACK].',
        ],
        finalResult:
          'Client Segment: Seq=1001, Ack=5001 (Payload: 400 bytes). Server ACK: Seq=5001, Ack=1401.',
      },
      practice: [
        {
          id: 1,
          prompt: 'What are the three control flags exchanged in order during a TCP connection handshake?',
          expected: 'SYN -> SYN-ACK -> ACK',
          hints: 'Synchronize, Synchronize-Acknowledgment, Acknowledgment.',
        },
        {
          id: 2,
          prompt: 'What are the header sizes of a standard base TCP header vs a UDP header?',
          expected: 'TCP = 20 bytes (base without options), UDP = 8 bytes (fixed).',
          hints: 'TCP contains sequence numbers, ACKs, flags, and window size; UDP only contains ports, length, and checksum.',
        },
        {
          id: 3,
          prompt: 'If Host A sends a TCP segment with Seq=2000 containing 300 bytes of data, what ACK number will Host B return upon successful receipt?',
          expected: 'Ack = 2300 (Ack = Seq + Length = 2000 + 300).',
          hints: 'TCP ACKs are cumulative and forward-looking, requesting the next byte offset.',
        },
        {
          id: 4,
          prompt: 'How does TCP Sliding Window Flow Control prevent a fast sender from overwhelming a slow receiver?',
          expected: 'The receiver advertises its available buffer capacity in the Window Size header field; the sender pauses if unacknowledged data reaches the window limit.',
          hints: 'If the receiver buffer fills up, it sends Window Size = 0 (Zero Window) to pause transmission.',
        },
        {
          id: 5,
          prompt: 'Why is UDP preferred over TCP for live audio/video calls (VoIP, Zoom) and online multiplayer gaming?',
          expected: 'UDP eliminates 3-way handshake delays and avoid retransmission lag, prioritizing low latency and predictable timing over re-sending late packets.',
          hints: 'In real-time voice, an audio packet that arrives 300ms late due to retransmission is useless and causes stutter.',
        },
        {
          id: 6,
          prompt: 'What is the purpose of the TIME_WAIT state entered by a client after sending the final ACK during a 4-way TCP teardown?',
          expected: 'To ensure the final ACK was received by the server and to prevent old duplicate segments from interfering with a future new connection.',
          hints: 'TIME_WAIT lasts for 2 * Maximum Segment Lifetime (2MSL).',
        },
      ],
      recap: [
        'TCP is connection-oriented, reliable, and provides ordered byte-stream delivery via a 20-byte base header.',
        'TCP establishes sessions using a 3-Way Handshake (SYN -> SYN-ACK -> ACK) and terminates via a 4-Way Teardown (FIN/ACK).',
        'TCP Sequence Numbers track byte offsets; Cumulative ACKs specify the next expected byte (Ack = Seq + Length).',
        'Sliding Window Flow Control regulates transmission speed based on advertised receiver buffer capacity.',
        'UDP is connectionless and lightweight (8-byte header), avoiding handshake delay and retransmission lag.',
        'Real-time, latency-critical applications (VoIP, DNS, gaming) favor UDP; transactional integrity (HTTPS, SSH, SQL) demands TCP.',
      ],
    },
    questions: [
      {
        text: 'What are the exact control flags and sequence of the TCP 3-Way Handshake used to establish a reliable connection?',
        options: [
          '1. Client sends SYN (Synchronize) → 2. Server responds with SYN-ACK (Synchronize-Acknowledgment) → 3. Client sends ACK (Acknowledgment)',
          '1. Client sends ACK → 2. Server sends SYN → 3. Client sends FIN',
          '1. Client sends PSH → 2. Server sends URG → 3. Client sends RST',
          '1. Client sends HELLO → 2. Server sends WELCOME → 3. Client sends READY',
        ],
        correctOption: 0,
        explanation:
          'TCP connection establishment uses the 3-way handshake: 1. Host A sends SYN with Initial Sequence Number (ISN); 2. Host B responds with SYN-ACK (acknowledging A\'s ISN and sending its own ISN); 3. Host A replies with ACK. The connection is now ESTABLISHED.',
        explanationsJson: {
          1: 'A connection cannot begin with ACK before sequence numbers are synchronized with SYN.',
          2: 'PSH and URG are data-handling flags, not connection establishment flags.',
          3: 'HELLO/WELCOME/READY are informal terms, not TCP header control flags.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.RECALL,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'TCP 3-Way Handshake Mechanics',
      },
      {
        text: 'How does TCP implement Flow Control to prevent a high-speed transmitting host from overwhelming a slower receiving host memory buffer?',
        options: [
          'Using a dynamic Sliding Window mechanism where the receiver advertises its available buffer capacity in the TCP "Window Size" header field',
          'By dropping 50% of all packets at the default gateway router',
          'By forcing the transmitting computer to shut down for 10 seconds after every 1 megabyte sent',
          'By converting all TCP packets into UDP datagrams',
        ],
        correctOption: 0,
        explanation:
          'TCP flow control uses the 16-bit Window Size field (and window scaling). The receiver continuously advertises how many bytes of data it can currently accept in its buffer. If the buffer fills, it sends Window Size = 0 (Zero Window), pausing sender transmission.',
        explanationsJson: {
          1: 'Dropping 50% of packets causes severe retransmission churn, not controlled flow regulation.',
          2: 'TCP regulates packet flow smoothly in millisecond sliding window intervals without OS shutdown.',
          3: 'TCP and UDP are distinct protocols; TCP does not convert itself into UDP.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'TCP Sliding Window Flow Control',
      },
      {
        text: 'Why do real-time applications such as Voice over IP (VoIP), live video streaming, and online multiplayer gaming prefer UDP over TCP?',
        options: [
          'UDP has minimal header overhead (8 bytes vs 20+ bytes) and no retransmission delays, prioritizing low latency and timing over retransmitting lost stale packets',
          'UDP provides 100% guaranteed delivery of every single audio byte',
          'UDP automatically encrypts audio using military-grade encryption',
          'UDP does not require IP addresses to traverse the Internet',
        ],
        correctOption: 0,
        explanation:
          'UDP is connectionless and lightweight (8-byte header). In real-time audio/video, a retransmitted audio packet arriving 300ms late is useless and causes stuttering. Low latency and predictable jitter take precedence over perfect reliability.',
        explanationsJson: {
          1: 'UDP provides no delivery guarantees; TCP provides guaranteed delivery.',
          2: 'UDP provides no built-in encryption; security must be provided by application layers (e.g. SRTP/DTLS).',
          3: 'UDP datagrams are encapsulated inside standard Layer 3 IP packets requiring source and destination IP addresses.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'UDP vs TCP Real-Time Tradeoffs',
      },
      {
        text: 'Host A sends a TCP segment with `Seq = 1000` containing `500 bytes` of data to Host B. What Acknowledgment number (`Ack`) will Host B return if the segment is received successfully?',
        options: [
          '`Ack = 1500` (acknowledging receipt of bytes 1000 through 1499 and expecting byte 1500 next)',
          '`Ack = 1000`',
          '`Ack = 500`',
          '`Ack = 1001`',
        ],
        correctOption: 0,
        explanation:
          'TCP Acknowledgments are "forward-looking" and cumulative: `Ack = Seq + Payload Length`. The segment covers byte offsets 1000 to 1499. Host B acknowledges this by requesting the next expected byte: `Ack = 1000 + 500 = 1500`.',
        explanationsJson: {
          1: 'Ack = 1000 would indicate no bytes were received and request byte 1000 again.',
          2: 'Ack = 500 is backward-referencing an invalid offset.',
          3: 'Ack = 1001 only acknowledges 1 single byte of data (as in a SYN-ACK), not 500 payload bytes.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.APPLICATION,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'TCP Sequence & Acknowledgment Calculation',
      },
      {
        text: 'What are the correct sequence of messages exchanged during a standard graceful TCP 4-Way connection teardown?',
        options: [
          'FIN -> ACK from remote -> FIN from remote -> final ACK from initiator',
          'RST -> RST-ACK -> FIN -> CLOSE',
          'DISCONNECT -> OK -> GOODBYE -> DONE',
          'SYN -> FIN -> ACK -> RST',
        ],
        correctOption: 0,
        explanation:
          'A graceful TCP teardown closes each unidirectional data stream separately: 1. Initiator sends FIN, 2. Remote sends ACK, 3. Remote sends its own FIN when finished transmitting data, 4. Initiator sends final ACK and enters TIME_WAIT.',
        explanationsJson: {
          1: 'RST immediately aborts a connection abruptly rather than performing a graceful 4-way teardown.',
          2: 'Generic informal terms are not TCP control flags.',
          3: 'SYN is used for connection establishment, not teardown.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.UNDERSTANDING,
        questionType: QuestionType.MULTIPLE_CHOICE,
        concept: 'TCP 4-Way Connection Teardown',
      },
      {
        text: 'A web server receives a massive flood of TCP SYN packets with forged source IP addresses, causing its half-open connection table to fill and reject legitimate users. What attack is this, and what is the primary server mitigation?',
        options: [
          'TCP SYN Flood Denial of Service; mitigated by enabling SYN Cookies which encode connection state into the Initial Sequence Number without allocating memory until the handshake completes',
          'ARP Poisoning; mitigated by installing fiber optic cables',
          'DNS Amplification; mitigated by changing browser cookies',
          'BGP Hijacking; mitigated by upgrading RAM on client workstations',
        ],
        correctOption: 0,
        explanation:
          'A SYN Flood exhausts the server\'s half-open TCP connection table (backlog queue). Enabling SYN Cookies defers server memory allocation by encoding state cryptographically into the server\'s Initial Sequence Number (ISN) in the SYN-ACK.',
        explanationsJson: {
          1: 'ARP operates at Layer 2 within a broadcast domain, not over TCP handshakes.',
          2: 'DNS amplification attacks UDP port 53, not TCP SYN buffers.',
          3: 'BGP hijacking affects inter-domain routing tables, not transport layer SYN state tables.',
        },
        difficulty: CourseLevel.BEGINNER,
        cognitiveLevel: CognitiveLevel.TROUBLESHOOTING,
        questionType: QuestionType.TROUBLESHOOTING,
        concept: 'TCP SYN Flood & SYN Cookies Mitigation',
      },
    ],
  },
];


import { ElevatedQuestionDef } from './elevated-part1-net100';

export const ELEVATED_PART2_NET200: ElevatedQuestionDef[] = [
  // 1. quiz-osi-model-7-layers (1)
  {
    quizId: "quiz-osi-model-7-layers",
    concept: "OSI Model Purpose and Architecture",
    options: [
      "It provides a standard vendor-neutral framework dividing network communication into 7 distinct layers for learning and troubleshooting",
      "It mandates a single proprietary hardware operating system that must be installed on all commercial network devices worldwide",
      "It replaces modern Internet protocol suites (IPv4/IPv6/TCP) with legacy connectionless network protocol packets across routers",
      "It restricts network communication exclusively to physical copper cabling by preventing wireless signal transmission"
    ],
    explanationsJson: {
      1: "The OSI model is an open conceptual framework, not a proprietary commercial operating system.",
      2: "The OSI model does not replace IP or TCP; the TCP/IP protocol suite remains the operational protocol of the global Internet.",
      3: "The OSI model applies to all physical media types including copper, optical fiber, wireless RF, and satellite links."
    }
  },

  // 2. quiz-osi-model-7-layers (2)
  {
    quizId: "quiz-osi-model-7-layers",
    concept: "Encapsulation Mechanics",
    options: [
      "Each layer adds its own specific protocol header information to the data as it moves downward toward Layer 1",
      "Each layer compresses and strips away preceding protocol headers to reduce overall packet size across the wire",
      "Each layer converts digital binary data into high-voltage alternating current before passing bits to adjacent layers",
      "Each layer decrypts application payloads using public key certificates to verify sender authenticity at each hop"
    ],
    explanationsJson: {
      1: "Stripping headers is Decapsulation, which occurs on the receiving node as data moves upward from Layer 1 to Layer 7.",
      2: "Electrical signal conversion occurs exclusively at Layer 1 (Physical layer), not across upper software layers.",
      3: "Payload decryption is handled at the destination application/presentation layer, not progressively at intermediate layers."
    }
  },

  // 3. quiz-tcp-ip-4-layers (1)
  {
    quizId: "quiz-tcp-ip-4-layers",
    concept: "TCP/IP Model Purpose",
    options: [
      "TCP/IP is a theoretical academic framework that was never implemented in real-world commercial operating systems",
      "TCP/IP is a proprietary protocol suite patented by Cisco Systems requiring commercial licensing for router deployment",
      "TCP/IP is a practical operational model implemented in operating systems, while OSI is a conceptual reference framework",
      "TCP/IP operates strictly at the physical layer to modulate radio frequency signals across wireless access points"
    ],
    explanationsJson: {
      0: "TCP/IP is the foundational architecture of the global Internet and is implemented in every major OS kernel.",
      1: "TCP/IP was developed under DARPA and standardized via open IETF RFCs; it is non-proprietary and free to implement.",
      3: "TCP/IP encompasses 4 functional layers spanning from physical network access up to user-space application software."
    }
  },

  // 4. quiz-tcp-ip-4-layers (2)
  {
    quizId: "quiz-tcp-ip-4-layers",
    concept: "TCP/IP Encapsulation Flow",
    options: [
      "Network Access Frame → Internet Packet → Transport Segment → Application Data Payload",
      "Internet Packet → Network Access Frame → Transport Segment → Application Data Payload",
      "Transport Segment → Application Data Payload → Network Access Frame → Internet Packet",
      "Application Data Payload → Transport Segment → Internet Packet → Network Access Frame"
    ],
    explanationsJson: {
      0: "This describes the bottom-up decapsulation sequence on the receiver, not top-down encapsulation on the sender.",
      1: "This is an invalid mixed order; transport encapsulation precedes internetwork packet creation.",
      2: "Application data is generated first; transport headers cannot encapsulate before application data exists."
    }
  },

  // 5. quiz-ip-addressing-ipv4-overview (1)
  {
    quizId: "quiz-ip-addressing-ipv4-overview",
    concept: "Classful Address Allocation Inefficiency",
    options: [
      "Because Class B networks were limited to a maximum of 128 physical workstations across an entire enterprise",
      "Because allocating a Class A network required payment of multimillion-dollar licensing fees to the United Nations",
      "Because Class C (/24) provided only 254 hosts, forcing the organization to receive a full Class B (/16 = 65,534 hosts), leaving 65,234 addresses unused",
      "Because routers were technically incapable of forwarding packets to destinations with subnet masks shorter than /24"
    ],
    explanationsJson: {
      0: "Class B networks provided 65,534 host addresses (/16), not 128 hosts.",
      1: "Address blocks were allocated through registries without UN fees; inefficiency was caused by rigid fixed mask boundaries.",
      3: "Classful routers supported fixed default masks (/8, /16, /24); the inefficiency was address waste, not forwarding inability."
    }
  },

  // 6. quiz-ip-addressing-ipv4-overview (2)
  {
    quizId: "quiz-ip-addressing-ipv4-overview",
    concept: "Class D Multicast & Class E Experimental Spaces",
    options: [
      "Class D is reserved for private internal LAN addressing; Class E is reserved for public Internet DNS root nameservers",
      "Class D is used exclusively for military encrypted satellites; Class E is used for commercial point-of-sale terminals",
      "Class D is reserved for automated router loopback testing; Class E is reserved for high-speed fiber aggregation backbones",
      "Class D (224.0.0.0 – 239.255.255.255) is reserved for Multicast; Class E (240.0.0.0 – 255.255.255.255) is reserved for Experimental use"
    ],
    explanationsJson: {
      0: "Private LAN addressing is defined by RFC 1918 (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16), not Class D/E.",
      1: "Class D multicast is standard IETF infrastructure (e.g. OSPF 224.0.0.5), not military satellite proprietary space.",
      2: "Loopback testing uses 127.0.0.0/8; fiber backbones use routable public or private unicast IP addressing."
    }
  },

  // 7. quiz-ip-addressing-ipv4-overview (3)
  {
    quizId: "quiz-ip-addressing-ipv4-overview",
    concept: "Classless CIDR vs Classful Misconceptions",
    options: [
      "Any IP address beginning with 10 MUST use a /8 subnet mask; using /24 is an illegal violation of RFC standards",
      "Under modern Classless Inter-Domain Routing (CIDR), fixed classes are obsolete; any IP address can use any valid subnet prefix length",
      "Subnet masks longer than /24 can only be applied to loopback interfaces and are rejected on physical switch interfaces",
      "CIDR notation is valid only for IPv6 addresses; IPv4 networks remain strictly constrained to Class A, B, and C rules"
    ],
    explanationsJson: {
      0: "RFC 1519 (CIDR) and RFC 1918 permit sub-dividing 10.0.0.0/8 into /24, /27, or any valid prefix length via VLSM.",
      2: "Subnet masks from /8 to /30 are routinely configured on physical router and switch interfaces throughout enterprise networks.",
      3: "CIDR was introduced in 1993 specifically for IPv4 to prevent routing table explosion and address exhaustion."
    }
  },

  // 8. quiz-subnetting-cidr-overview (1)
  {
    quizId: "quiz-subnetting-cidr-overview",
    concept: "VLSM Largest-to-Smallest Allocation Rule",
    options: [
      "Allocate point-to-point /30 WAN links first, then allocate large user subnets into the remaining high-order address space",
      "Allocate subnets in completely random order to prevent neighboring subnets from experiencing cross-talk interference",
      "Always sort requirements and allocate subnets starting with the LARGEST host requirement first, proceeding in descending order down to the smallest",
      "Assign equal /24 subnet blocks to all locations regardless of whether they have 2 hosts or 500 hosts to simplify routing"
    ],
    explanationsJson: {
      0: "Allocating small subnets first fragments the address space, making it impossible to find contiguous power-of-two blocks for large subnets.",
      1: "Logical IP addressing does not cause physical cable cross-talk; structured contiguous allocation is essential for summarization.",
      3: "Fixed-size /24 allocation wastes massive address space on small sites, defeating the core objective of VLSM."
    }
  },

  // 9. quiz-subnetting-cidr-overview (2)
  {
    quizId: "quiz-subnetting-cidr-overview",
    concept: "Subnet Block Size Boundary Alignment Rules",
    options: [
      "Because routers reject any subnet configuration where the network address ends in an even number in the fourth octet",
      "Because a /26 has a block size of 32 and can only begin on odd multiples of 32 across consecutive octet boundaries",
      "Because a /26 has a block size of 64 and can only legally begin on boundaries that are exact multiples of 64",
      "Because the fourth octet must always match the VLAN identification number assigned on the upstream access switch"
    ],
    explanationsJson: {
      0: "Multiples of 64 (0, 64, 128, 192) are all even numbers; network boundaries are determined by binary host bit masking.",
      1: "A /26 has 6 host bits ($2^6 = 64$), giving a block size of 64, not 32 (which is /27).",
      3: "VLAN IDs (1-4094) are Layer 2 tags and have no mathematical correlation to Layer 3 IP subnet boundary alignment."
    }
  },

  // 10. quiz-subnetting-cidr-overview (3)
  {
    quizId: "quiz-subnetting-cidr-overview",
    concept: "Overlapping Subnet Troubleshooting",
    options: [
      "The router operating system memory is completely full and cannot allocate internal data structures for new routing entries",
      "The physical router interface link speed has been throttled to 10 Mbps due to excessive electrical line noise on copper cables",
      "The subnet mask length configured on the router exceeds the maximum 32-bit architectural limit defined in RFC 791",
      "Overlapping Subnet Error: The range of the /26 (.0 to .63 is taken, so .64 to .127) overlaps with the /27 (.32 to .63), causing routing ambiguity"
    ],
    explanationsJson: {
      0: "The error message 'overlaps with' indicates an addressing conflict, not a hardware RAM exhaustion failure.",
      1: "Interface physical link speed has no bearing on Layer 3 IP address assignment syntax or subnet overlap validation.",
      2: "Both /26 and /27 are standard, valid IPv4 prefix lengths well within the 32-bit limit."
    }
  },

  // 11. quiz-ipv6-foundations-overview (1)
  {
    quizId: "quiz-ipv6-foundations-overview",
    concept: "IPv6 Address Compression Rules",
    options: [
      "1. Omit leading zeros in any 16-bit hextet; 2. Replace a single contiguous sequence of all-zero hextets with a double colon (::) exactly once in an address",
      "1. Replace all zero digits with the letter Z; 2. Truncate the address to 32 bits by discarding the rightmost 96 interface identifier bits",
      "1. Remove all colons separating hextets; 2. Encrypt the remaining hexadecimal characters using a symmetric 128-bit AES hash",
      "1. Convert hexadecimal characters into decimal notation; 2. Append a /64 subnet mask to the beginning of the network prefix"
    ],
    explanationsJson: {
      1: "RFC 5952 prohibits arbitrary letter substitutions; IPv6 addresses are strictly 128 bits and cannot be truncated to 32 bits.",
      2: "Removing colons creates an unparseable 32-character string; compression preserves standard hextet boundaries.",
      3: "IPv6 is written in hexadecimal; converting to decimal would produce confusing, non-standard address strings."
    }
  },

  // 12. quiz-ipv6-foundations-overview (2)
  {
    quizId: "quiz-ipv6-foundations-overview",
    concept: "IPv6 Link-Local Addressing (fe80::)",
    options: [
      "2000::/3 (2000 to 3FFF); globally unique and routable across the public Internet backbone",
      "fc00::/7 (FC00 to FDFF); used exclusively for private enterprise intranets and routed across site-to-site VPNs",
      "`fe80::/10` (FE80 to FEBF); valid and routable only on the local physical link/broadcast domain",
      "ff00::/8 (FF00 to FFFF); delivered to all nodes subscribed to a specific multicast distribution group"
    ],
    explanationsJson: {
      0: "2000::/3 represents Global Unicast Addresses (GUA), not link-local addresses.",
      1: "fc00::/7 represents Unique Local Addresses (ULA), the IPv6 equivalent of RFC 1918 private space.",
      3: "ff00::/8 defines Multicast addresses, replacing legacy IPv4 broadcast mechanisms."
    }
  },

  // 13. quiz-ipv6-foundations-overview (3)
  {
    quizId: "quiz-ipv6-foundations-overview",
    concept: "IPv6 NDP vs Legacy ARP Broadcast",
    options: [
      "IPv6 utilizes high-speed physical Token Ring circulation frames to discover neighbor MAC addresses without broadcasting",
      "IPv6 broadcasts an all-nodes ARP Request frame out of every switch port, requiring every connected node to process the interrupt",
      "IPv6 mandates that all hosts hardcode neighbor MAC addresses manually in static configuration files before sending packets",
      "IPv6 replaces broadcast with ICMPv6 Neighbor Discovery Protocol (NDP) utilizing targeted Solicited-Node Multicast addresses"
    ],
    explanationsJson: {
      0: "IPv6 operates across standard Ethernet and Wi-Fi networks; it does not resurrect legacy Token Ring protocols.",
      1: "IPv6 completely eliminates broadcast addressing; there are no broadcast frames or broadcast MAC addresses in IPv6.",
      2: "NDP provides dynamic automated resolution via Neighbor Solicitations (NS) and Neighbor Advertisements (NA)."
    }
  },

  // 14. quiz-ethernet-mac-addresses-overview (1)
  {
    quizId: "quiz-ethernet-mac-addresses-overview",
    concept: "Minimum Ethernet Frame Size Mechanics",
    options: [
      "1518 bytes; to prevent jumbo frame buffer exhaustion on upstream enterprise core aggregation switches",
      "64 bytes; to guarantee that in shared CSMA/CD half-duplex networks, collisions would be detected before transmission finished",
      "32 bytes; to ensure that CRC-32 Frame Check Sequence polynomial calculations complete within one CPU clock cycle",
      "128 bytes; to accommodate dual IPv4 and IPv6 network layer protocol headers within a single physical frame"
    ],
    explanationsJson: {
      0: "1518 bytes is the standard MAXIMUM transmission unit for standard untagged Ethernet frames, not the minimum.",
      2: "CRC-32 hardware registers calculate checksums continuously in streaming ASICs regardless of frame size.",
      3: "Ethernet frames encapsulate either IPv4 or IPv6 via the EtherType field; dual headers are not combined into one frame."
    }
  },

  // 15. quiz-ethernet-mac-addresses-overview (2)
  {
    quizId: "quiz-ethernet-mac-addresses-overview",
    concept: "802.1Q VLAN Tagging & Frame Expansion",
    options: [
      "Inserted between Source MAC and EtherType; increases maximum standard frame size from 1518 to 1522 bytes",
      "Appended to the end of the Frame Check Sequence; replaces physical preamble bits with a 16-bit cryptographic token",
      "Prepended before the Destination MAC address; replaces standard Ethernet framing with proprietary Cisco ISL encapsulation",
      "Inserted into the IP header options field; increments the Layer 3 Time-to-Live counter by 4 for every trunk traversed"
    ],
    explanationsJson: {
      1: "The 802.1Q tag is inserted into the Ethernet header, not appended after the FCS trailer.",
      2: "802.1Q is an open IEEE standard inserted internally after Source MAC; ISL is obsolete proprietary external encapsulation.",
      3: "VLAN tags operate strictly at Layer 2 (Data Link); they do not modify Layer 3 IP headers or TTL counters."
    }
  },

  // 16. quiz-ethernet-mac-addresses-overview (3)
  {
    quizId: "quiz-ethernet-mac-addresses-overview",
    concept: "Runt Frame Detection & Troubleshooting",
    options: [
      "Frames received exceeding 9000 bytes; typically caused by an misconfigured MTU setting on an iSCSI storage array",
      "Frames received are smaller than 64 bytes; typically caused by a faulty copper cable, bad connector, or duplex mismatch causing collisions",
      "Frames received with an invalid IPv4 checksum; typically caused by a malfunctioning DNS recursive caching resolver",
      "Frames received on an access switch port that contain an unauthorized 802.1Q tag from an unmanaged desktop VoIP phone"
    ],
    explanationsJson: {
      0: "Frames exceeding standard MTU (> 1518 bytes) are Giant or Baby Giant frames, not Runt frames.",
      2: "IP checksum errors are detected at Layer 3 by routers; Runts are Layer 2 frames smaller than the 64-byte minimum.",
      3: "Tagged frames on untagged access ports are dropped as native VLAN or tag errors, not counted as Runts."
    }
  },

  // 17. quiz-arp-protocol-overview (1)
  {
    quizId: "quiz-arp-protocol-overview",
    concept: "ARP Purpose & Mechanics",
    options: [
      "Translating human-readable domain names (e.g. www.google.com) into globally routable public IPv4 addresses",
      "Assigning dynamic IP addresses, subnet masks, and default gateways to client workstations upon network boot",
      "Resolving a known IPv4 address into its corresponding 48-bit physical MAC address on the local network link",
      "Routing packets across multiple autonomous system boundaries using inter-domain path vector algorithms"
    ],
    explanationsJson: {
      0: "Translating domain names into IP addresses is the function of Domain Name System (DNS), not ARP.",
      1: "Dynamic lease allocation is performed by Dynamic Host Configuration Protocol (DHCP), not ARP.",
      3: "Inter-domain routing across autonomous systems is performed by Border Gateway Protocol (BGP), not ARP."
    }
  },

  // 18. quiz-arp-protocol-overview (2)
  {
    quizId: "quiz-arp-protocol-overview",
    concept: "ARP for Off-Subnet Destinations",
    options: [
      "The IP address of its local Default Gateway (e.g. 192.168.1.1), because ARP broadcasts cannot cross a router boundary",
      "The destination public IP address directly (e.g. 8.8.8.8), broadcasting an ARP request across all Internet fiber links",
      "The loopback IP address 127.0.0.1, commanding the local operating system kernel to generate a virtual next-hop MAC",
      "The broadcast IP address 255.255.255.255, requesting the nearest authoritative DNS nameserver to reply with its MAC"
    ],
    explanationsJson: {
      1: "ARP requests are Layer 2 broadcast frames; routers drop broadcasts, preventing ARP from leaving the local subnet.",
      2: "Pinging an external IP requires sending traffic to the default gateway router, not the internal software loopback.",
      3: "DNS servers operate at Layer 7 and resolve domain names, not Layer 2 Ethernet MAC address resolution."
    }
  },

  // 19. quiz-arp-protocol-overview (3)
  {
    quizId: "quiz-arp-protocol-overview",
    concept: "ARP Cache Purpose & Aging",
    options: [
      "To store encrypted copies of user web passwords to accelerate HTTPS connection establishment across proxy firewalls",
      "To avoid broadcasting an ARP Request for every individual IP packet sent to the same destination host, significantly reducing network broadcast overhead",
      "To permanently record every MAC address that has ever connected to the local switch to prevent IP spoofing attacks",
      "To calculate the shortest path tree across redundant Ethernet switch links using Spanning Tree Protocol algorithms"
    ],
    explanationsJson: {
      0: "ARP operates at Layer 2 and deals strictly with hardware addressing; it has no access to user passwords or application encryption.",
      2: "ARP tables are dynamic and age out entries (typically after 2-4 hours on routers, 5 minutes on PCs) to reflect topology changes.",
      3: "Shortest path tree calculations are executed by Spanning Tree Protocol (STP) using Bridge Protocol Data Units (BPDUs)."
    }
  },

  // 20. quiz-arp-protocol-overview (4)
  {
    quizId: "quiz-arp-protocol-overview",
    concept: "Non-Target ARP Frame Discarding",
    options: [
      "Host C generates a Layer 2 error frame and sends an ARP Reject broadcast back to the initiating sender",
      "Host C rewrites its own IP address to 192.168.1.50 and updates the local switch CAM table with its own port number",
      "Host C inspects the Target Protocol Address, sees 192.168.1.50 does not match its own IP, and silently discards the frame without replying",
      "Host C forward-floods the ARP Request out of its secondary network interface card to adjacent workstation subnets"
    ],
    explanationsJson: {
      0: "ARP has no reject or negative acknowledgment mechanism; non-target hosts simply drop the frame.",
      1: "Workstations do not arbitrarily reconfigure their IP addresses upon receiving ARP traffic.",
      3: "Standard workstations operate as end nodes and do not forward or bridge broadcast frames between interfaces."
    }
  },

  // 21. quiz-arp-protocol-overview (5)
  {
    quizId: "quiz-arp-protocol-overview",
    concept: "ARP Poisoning & Dynamic ARP Inspection",
    options: [
      "DDoS SYN Flood attack; mitigated on routers by enabling TCP SYN Cookies and adjusting half-open connection timeouts",
      "VLAN Hopping double-tagging attack; mitigated on switches by changing the native VLAN to an unused VLAN ID",
      "DNS Cache Poisoning attack; mitigated by deploying DNSSEC with cryptographic Resource Record Signatures (RRSIG)",
      "ARP Cache Poisoning / Spoofing (Man-in-the-Middle); mitigated on switches using Dynamic ARP Inspection (DAI) coupled with DHCP Snooping"
    ],
    explanationsJson: {
      0: "SYN Floods attack Layer 4 TCP connection state buffers, not Layer 2 ARP IP-to-MAC hardware bindings.",
      1: "VLAN hopping exploits 802.1Q trunk tag processing on switches, not spoofed ARP reply packets.",
      2: "DNS poisoning targets nameserver domain caches, whereas ARP poisoning targets local subnet host IP-to-MAC tables."
    }
  },

  // 22. quiz-dhcp-dns-overview (1)
  {
    quizId: "quiz-dhcp-dns-overview",
    concept: "Integrated Host Boot-Up Sequence",
    options: [
      "Physical Link Up -> DHCP Lease Acquisition -> Gratuitous ARP (DAD) -> Default Gateway ARP Resolution -> DNS Name Resolution -> Outbound TCP 3-Way Handshake & HTTPS GET",
      "DNS Name Resolution -> Outbound TCP Handshake -> DHCP Lease Acquisition -> Physical Link Up -> Gratuitous ARP -> Default Gateway ARP Resolution",
      "Gratuitous ARP -> Default Gateway ARP Resolution -> Physical Link Up -> DNS Name Resolution -> DHCP Lease Acquisition -> Outbound TCP Handshake",
      "Outbound TCP Handshake -> Default Gateway ARP Resolution -> DNS Name Resolution -> Physical Link Up -> DHCP Lease Acquisition -> Gratuitous ARP"
    ],
    explanationsJson: {
      1: "A host cannot resolve DNS names or initiate TCP handshakes before the physical link is up and an IP address is leased.",
      2: "ARP packets cannot be generated before physical link negotiation and IP address assignment take place.",
      3: "TCP handshakes require a routable IP address and default gateway MAC, which are established during earlier boot stages."
    }
  },

  // 23. quiz-dhcp-dns-overview (2)
  {
    quizId: "quiz-dhcp-dns-overview",
    concept: "Gratuitous ARP Duplicate Address Detection",
    options: [
      "To test whether intermediate WAN routers support BGP route redistribution before initiating outbound user sessions",
      "To negotiate link speed and duplex settings with the connected switch port using physical layer autonegotiation pulses",
      "Duplicate Address Detection (DAD): To verify that no other active host on the local broadcast domain is already using the newly leased IP address",
      "To instruct upstream recursive DNS resolvers to clear all cached domain name entries associated with the workstation"
    ],
    explanationsJson: {
      0: "Workstations do not interact with BGP routing protocols; Gratuitous ARP is purely local to the broadcast domain.",
      1: "Speed and duplex autonegotiation occurs at Layer 1 prior to Layer 2 and Layer 3 packet processing.",
      3: "DNS resolvers cache domain-to-IP mappings; they do not monitor local broadcast domain Gratuitous ARP announcements."
    }
  },

  // 24. quiz-dhcp-dns-overview (3)
  {
    quizId: "quiz-dhcp-dns-overview",
    concept: "Lifecycle Sequential Troubleshooting & DNS Isolation",
    options: [
      "Phase 1: Physical Layer link failure (the Ethernet network patch cable connecting the PC to the switch is disconnected)",
      "Phase 2: DHCP Lease Acquisition failed (the workstation did not receive an IP address and assigned an APIPA 169.254.x.x address)",
      "Phase 4: Default Gateway ARP Resolution failed (the router interface is down and the workstation cannot resolve the gateway MAC)",
      "Phase 5: DNS Name Resolution failed to translate `www.example.com` into an IP address"
    ],
    explanationsJson: {
      0: "Because the host can successfully ping the external public IP 8.8.8.8, physical Layer 1 cabling is fully functional.",
      1: "The host has a valid working IP address that successfully routes traffic out to the Internet.",
      2: "Traffic reaches 8.8.8.8, confirming the default gateway MAC was resolved and the router forwarded the packet."
    }
  },

  // 25. quiz-dhcp-dns-overview (4)
  {
    quizId: "quiz-dhcp-dns-overview",
    concept: "Default Gateway ARP Resolution Mechanics",
    options: [
      "Because 8.8.8.8 is on a remote subnet, the host must encapsulate the IP packet in a Layer 2 Ethernet frame addressed to the local Default Gateway router's MAC address",
      "Because Ethernet switches discard any frame that contains a destination IP address starting with an even number like 8",
      "Because the client workstation operating system must establish an encrypted TLS tunnel with the router before generating IP packets",
      "Because ARP broadcasts are forwarded across all Internet routers until reaching the authoritative root nameserver"
    ],
    explanationsJson: {
      1: "Switches forward frames based on destination MAC addresses and VLAN tags; they do not filter on IP address octet values.",
      2: "Standard IP communication does not require an encrypted TLS tunnel between workstation and router.",
      3: "Routers drop Layer 2 broadcasts; ARP broadcasts never leave the local LAN broadcast domain."
    }
  },

  // 26. quiz-tcp-udp-transport-overview (1)
  {
    quizId: "quiz-tcp-udp-transport-overview",
    concept: "TCP 3-Way Handshake Mechanics",
    options: [
      "1. Client sends FIN → 2. Server responds with ACK → 3. Client sends RST",
      "1. Client sends UDP Datagram → 2. Server responds with ICMP Echo Reply → 3. Connection is established",
      "1. Client sends SYN (Synchronize) → 2. Server responds with SYN-ACK (Synchronize-Acknowledgment) → 3. Client sends ACK",
      "1. Client sends DHCP Discover → 2. Server responds with DHCP Offer → 3. Client sends DHCP Request"
    ],
    explanationsJson: {
      0: "FIN packets are used to terminate an existing connection, not establish a new three-way handshake.",
      1: "UDP is connectionless and has no handshake; ICMP Echo is used by ping, not TCP connection establishment.",
      3: "DHCP Discover/Offer/Request/Ack is a Layer 7 IP configuration exchange, not a Layer 4 TCP connection handshake."
    }
  },

  // 27. quiz-tcp-udp-transport-overview (2)
  {
    quizId: "quiz-tcp-udp-transport-overview",
    concept: "TCP Sliding Window Flow Control",
    options: [
      "By having the sender discard 50% of all outgoing packets whenever network latency exceeds 100 milliseconds",
      "By forcing the sending host to pause transmission for 30 seconds after sending every individual packet",
      "By dynamically rewriting the IP header Time-to-Live field to decrease the physical speed of packets in fiber cables",
      "Using a dynamic Sliding Window mechanism where the receiver advertises its available buffer capacity in the TCP \"Window Size\" header field"
    ],
    explanationsJson: {
      0: "TCP flow control is controlled by receiver buffer capacity, not arbitrary sender packet discarding.",
      1: "Lockstep stop-and-wait produces abysmal throughput; sliding windows allow continuous streaming up to the window limit.",
      2: "TTL tracks hop counts to prevent routing loops; it has no physical effect on transmission speed or buffer flow control."
    }
  },

  // 28. quiz-tcp-udp-transport-overview (3)
  {
    quizId: "quiz-tcp-udp-transport-overview",
    concept: "UDP vs TCP Real-Time Tradeoffs",
    options: [
      "UDP has minimal header overhead (8 bytes vs 20+ bytes) and no retransmission delays, prioritizing low latency and timing over retransmitting lost stale packets",
      "UDP utilizes advanced quantum encryption algorithms that accelerate packet forwarding across intermediate core routers",
      "UDP automatically increases physical bandwidth on copper twisted-pair cables by negotiating higher electrical frequencies",
      "UDP eliminates the requirement for Layer 3 IP addressing, allowing packets to travel directly over physical fiber links"
    ],
    explanationsJson: {
      1: "UDP does not provide cryptographic encryption; it is a simple, lightweight connectionless transport protocol.",
      2: "Physical media bandwidth is dictated by Layer 1 transceivers and cable categories, independent of Layer 4 transport protocols.",
      3: "All UDP packets are encapsulated within Layer 3 IP packets; IP addressing is mandatory for inter-network routing."
    }
  },

  // 29. quiz-tcp-udp-transport-overview (4)
  {
    quizId: "quiz-tcp-udp-transport-overview",
    concept: "TCP 4-Way Connection Teardown",
    options: [
      "RST sent by client -> RST received by server -> connection closed immediately without acknowledgments",
      "SYN sent by client -> SYN-ACK sent by server -> ACK sent by client -> connection terminated",
      "FIN -> ACK from remote -> FIN from remote -> final ACK from initiator",
      "DHCP Release -> ARP Announcement -> ICMP Time Exceeded -> interface shutdown"
    ],
    explanationsJson: {
      0: "TCP RST is an abnormal abortive reset, not the graceful 4-step teardown handshake.",
      1: "SYN/SYN-ACK/ACK is the three-way connection establishment handshake, not termination.",
      3: "DHCP and ICMP operate independently of Layer 4 TCP connection state teardown."
    }
  },

  // 30. quiz-tcp-udp-transport-overview (5)
  {
    quizId: "quiz-tcp-udp-transport-overview",
    concept: "TCP SYN Flood & SYN Cookies Mitigation",
    options: [
      "Smurf ICMP amplification attack; mitigated by disabling IP directed broadcasts on perimeter router interfaces",
      "DNS Amplification attack; mitigated by restricting recursive resolver access to authorized internal subnets",
      "ARP Cache Poisoning attack; mitigated by enabling Dynamic ARP Inspection and DHCP Snooping on access switches",
      "TCP SYN Flood Denial of Service; mitigated by enabling SYN Cookies which encode connection state into the Initial Sequence Number without allocating memory until the handshake completes"
    ],
    explanationsJson: {
      0: "Smurf attacks flood targets with ICMP Echo replies via broadcast amplification, not half-open TCP SYN connections.",
      1: "DNS amplification uses open UDP resolvers to reflect large DNS responses, distinct from TCP handshake table exhaustion.",
      2: "ARP spoofing corrupts Layer 2 MAC tables, whereas SYN floods exhaust Layer 4 kernel connection state tables."
    }
  },

  // 31. quiz-net-101-bits-bytes-binary-hex
  {
    quizId: "quiz-net-101-bits-bytes-binary-hex",
    concept: "Why Networking Uses Hexadecimal",
    options: [
      "Because computer processors can execute instructions only when memory addresses are written in base-10 decimal format",
      "It provides a compact, human-readable shorthand where each hex digit directly represents 4 binary bits",
      "Because hexadecimal characters automatically encrypt MAC and IPv6 addresses against unauthorized packet sniffers",
      "Because Ethernet transceivers transmit optical pulses exclusively in base-16 frequencies across fiber cables"
    ],
    explanationsJson: {
      0: "Processors execute pure binary (base-2) machine code at the silicon level, not base-10 decimal.",
      2: "Hexadecimal is a human-readable numeral system; it does not provide encryption or confidentiality.",
      3: "Physical transceivers transmit binary optical pulses or electrical voltages; base-16 is a representational notation."
    }
  },

  // 32. quiz-net-202-ipv4-addressing-cidr (1)
  {
    quizId: "quiz-net-202-ipv4-addressing-cidr",
    concept: "32-Bit IPv4 Architecture",
    options: [
      "128 bits, divided into 8 hexadecimal hextets representing globally routable unicast and link-local address scopes",
      "48 bits, divided into a 24-bit Organizationally Unique Identifier (OUI) and a 24-bit Network Interface Controller serial",
      "32 bits, divided into a Network portion (identifying the subnet) and a Host portion (identifying the specific device)",
      "64 bits, divided into a 32-bit timestamp counter and a 32-bit cyclic redundancy check polynomial value"
    ],
    explanationsJson: {
      0: "128 bits divided into 8 hextets is the structure of an IPv6 address, not an IPv4 address.",
      1: "48 bits divided into OUI and NIC serial is the physical structure of an Ethernet MAC address.",
      3: "64-bit timestamp and CRC fields are telemetry header components, not IPv4 network addressing architecture."
    }
  },

  // 33. quiz-net-202-ipv4-addressing-cidr (2)
  {
    quizId: "quiz-net-202-ipv4-addressing-cidr",
    concept: "Point-to-Point & Edge Subnetting",
    options: [
      "A /30 provides 30 usable host IP addresses, reserving the remaining 2 for the default gateway and DHCP server",
      "A /30 provides 6 usable host IP addresses with a block size of 8, wasting 2 addresses on every point-to-point circuit",
      "A /30 allocates 1 usable host IP address and 1 broadcast address, requiring NAT to communicate across the link",
      "A /30 has 2 host bits (2^2 = 4 total addresses), reserving 1 for the Network Address and 1 for the Broadcast Address, leaving 2 usable addresses"
    ],
    explanationsJson: {
      0: "The number 30 in /30 is the prefix length (network bits), leaving only 2 host bits ($2^2 = 4$ total addresses).",
      1: "6 usable host addresses ($2^3 - 2 = 6$) is provided by a /29 subnet mask (255.255.255.248), not a /30.",
      2: "A /30 provides exactly 2 usable host addresses, making it perfect for point-to-point links connecting two router interfaces."
    }
  }
];

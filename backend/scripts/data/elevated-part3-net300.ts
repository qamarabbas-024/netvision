import { ElevatedQuestionDef } from './elevated-part1-net100';

export const ELEVATED_PART3_NET300: ElevatedQuestionDef[] = [
  // 1. quiz-routing-fundamentals-overview (1)
  {
    quizId: "quiz-routing-fundamentals-overview",
    concept: "Administrative Distance vs Metric",
    options: [
      "It measures the trustworthiness / believability of different routing sources (e.g. Directly Connected = 0, Static = 1, OSPF = 110, RIP = 120), selecting the lowest AD when routes to the exact same prefix exist",
      "It measures the physical length of the fiber optic cable connecting adjacent routers in meters, choosing the shortest physical cable path",
      "It defines the maximum number of simultaneous TCP socket connections that a router can track in its stateful translation memory table",
      "It specifies the 802.1Q priority tag value assigned to voice packets traversing inter-switch trunk links across the campus LAN"
    ],
    explanationsJson: {
      1: "Physical cable length is not measured by routing protocols; link metrics are based on bandwidth, delay, or hop counts.",
      2: "Socket connection tracking capacity is a firewall/NAT state table metric, not Administrative Distance.",
      3: "802.1Q priority (CoS) operates at Layer 2 for Quality of Service, unrelated to Layer 3 routing route believability."
    }
  },

  // 2. quiz-routing-fundamentals-overview (2)
  {
    quizId: "quiz-routing-fundamentals-overview",
    concept: "Floating Static Route Architecture",
    options: [
      "A primary static route configured with Administrative Distance 1 that load-balances traffic evenly across two unequal bandwidth links",
      "A multicast routing table entry that dynamically circulates between multiple core routers using the Spanning Tree Protocol",
      "A backup static route configured with a higher Administrative Distance (e.g. AD 150) than the primary dynamic routing protocol (e.g. OSPF AD 110), remaining inactive until the primary route fails",
      "A temporary routing policy that drops all transit traffic originating from unauthorized DHCP client subnets during maintenance windows"
    ],
    explanationsJson: {
      0: "Equal-cost multipath (ECMP) requires equal administrative distance and metric; a floating static route is strictly a backup.",
      1: "Spanning Tree operates at Layer 2 to prevent switching loops; it does not circulate Layer 3 multicast routing tables.",
      3: "A floating static route provides automated failover to an alternate path, not a traffic filtering or ACL policy."
    }
  },

  // 3. quiz-routing-fundamentals-overview (3)
  {
    quizId: "quiz-routing-fundamentals-overview",
    concept: "Next-Hop Resolution & ARP Dependency",
    options: [
      "The router translates the packet into an IPv6 segment and initiates a BGP peering session with the nearest internet exchange point",
      "The router looks up the exit interface and next-hop IP, then broadcasts an ARP Request on that local subnet to resolve the next-hop router MAC address",
      "The router sends the packet to the central DNS root nameserver to verify whether the destination IP address has an active domain registration",
      "The router strips the Layer 3 IP header and converts the payload into raw physical frequency pulses without Layer 2 Ethernet framing"
    ],
    explanationsJson: {
      0: "Routers forward packets using their configured routing protocols; they do not convert IPv4 packets into IPv6 segments unless using dual-stack translation.",
      2: "Routers do not consult DNS root servers during per-packet forwarding; routing is based strictly on numerical IP prefixes.",
      3: "Layer 2 Ethernet framing with destination MAC address is mandatory for transmission across physical Ethernet links."
    }
  },

  // 4. quiz-switching-vlans-overview (1)
  {
    quizId: "quiz-switching-vlans-overview",
    concept: "VLAN Broadcast Containment",
    options: [
      "By permanently encrypting all payload data using 256-bit AES algorithms so other workstations cannot read the bits",
      "By isolating broadcast traffic to only those switch ports assigned to that specific VLAN ID, preventing broadcasts from flooding the entire physical LAN",
      "By disabling the physical Ethernet transmitter on all access switch ports during high-volume business hours",
      "By converting all broadcast frames into unicast HTTP GET requests routed directly to the corporate intranet web server"
    ],
    explanationsJson: {
      0: "VLANs segment Layer 2 broadcast domains; they do not provide cryptographic payload encryption (which requires MACsec or IPsec).",
      2: "VLANs maintain full full-duplex transmission on all member ports; they do not disable physical hardware transmitters.",
      3: "Switches forward frames according to IEEE 802.1Q standards; they do not convert broadcast frames into Layer 7 HTTP requests."
    }
  },

  // 5. quiz-switching-vlans-overview (2)
  {
    quizId: "quiz-switching-vlans-overview",
    concept: "Native VLAN Mismatch Security Vulnerability",
    options: [
      "It causes the switch chassis power supply to overload and shut down due to excessive electrical voltage across the backplane",
      "It permanently disables all 802.1Q trunking encapsulation and downgrades the link to legacy half-duplex 10BASE-T",
      "Traffic from the native VLAN on one switch leaks untagged into a different VLAN on the neighboring switch, creating cross-VLAN security breaches and spanning tree loops",
      "It commands the upstream edge router to drop all BGP routing table entries across the entire enterprise autonomous system"
    ],
    explanationsJson: {
      0: "VLAN configuration is a software logic mapping; it has zero impact on physical chassis power supply wattage.",
      1: "Trunking remains active; untagged frames are simply interpreted as belonging to the local native VLAN of the receiving switch.",
      3: "Native VLAN mismatches are confined to the local Layer 2 trunk link and do not tear down Layer 3 BGP sessions."
    }
  },

  // 6. quiz-network-security-basics-overview (1)
  {
    quizId: "quiz-network-security-basics-overview",
    concept: "CIA Triad in Network Defense",
    options: [
      "Confidentiality (preventing unauthorized data disclosure), Integrity (ensuring data is not tampered with or altered), and Availability (ensuring authorized users have reliable access to resources)",
      "Centralization (managing all routers from a single server), Interoperability (supporting multiple hardware vendors), and Automation (replacing human CLI sessions with scripts)",
      "Classification (organizing subnets by classful boundaries), Isolation (segmenting networks with firewalls), and Authentication (verifying user passwords via RADIUS)",
      "Connectivity (maintaining physical link status UP/UP), Inspection (monitoring packet headers in Wireshark), and Allocation (leasing dynamic IP addresses via DHCP)"
    ],
    explanationsJson: {
      1: "Centralization, interoperability, and automation are network operational goals, not the foundational information security CIA triad.",
      2: "Classification, isolation, and authentication are security implementation controls, not the core CIA triad principles.",
      3: "Connectivity, inspection, and allocation are routine network management functions."
    }
  },

  // 7. quiz-network-security-basics-overview (2)
  {
    quizId: "quiz-network-security-basics-overview",
    concept: "Port Security Errdirection Action",
    options: [
      "The switch port ignores the unauthorized frame and doubles the bandwidth allocation for previously learned sticky MAC addresses",
      "The switch port transitions into the `err-disabled` state, turns off the physical link LED, and stops all frame forwarding until administratively reset",
      "The switch port converts the unauthorized frame into an encrypted SNMP trap and forwards it to the default gateway router",
      "The switch port immediately reboots the entire switch chassis and clears all dynamically learned CAM table entries"
    ],
    explanationsJson: {
      0: "Violation shutdown protects the network by disabling the port; it does not reward or allocate additional bandwidth.",
      2: "Under shutdown mode, the port is disabled locally; SNMP traps may be logged, but the port itself shuts down.",
      3: "Port security isolates the individual offending access port; it does not reboot the switch chassis."
    }
  },

  // 8. quiz-firewalls-acls-overview (1)
  {
    quizId: "quiz-firewalls-acls-overview",
    concept: "Standard vs Extended ACL Placement",
    options: [
      "Standard ACLs close to destination (because they filter only source IP); Extended ACLs close to source (to conserve bandwidth by dropping unwanted traffic early)",
      "Standard ACLs close to source (to block traffic immediately); Extended ACLs close to destination (because they inspect Layer 4 ports)",
      "Both Standard and Extended ACLs must be placed exclusively on the default gateway loopback interface to prevent routing loops",
      "Standard ACLs on switch trunk ports; Extended ACLs on physical serial WAN interfaces connecting to external service providers"
    ],
    explanationsJson: {
      1: "Placing a Standard ACL near the source blocks that host from reaching all destinations, because it cannot inspect destination IP.",
      2: "Loopback interfaces do not process transit user traffic; ACLs are applied to physical or VLAN routed interfaces.",
      3: "ACLs are placed based on traffic flow optimization, not arbitrarily restricted to trunk or serial interfaces."
    }
  },

  // 9. quiz-firewalls-acls-overview (2)
  {
    quizId: "quiz-firewalls-acls-overview",
    concept: "Wildcard Mask Calculation",
    options: [
      "Inverting the binary subnet mask (subtracting the subnet mask from 255.255.255.255), where 0 bits require an exact match and 1 bits are \"don't care\"",
      "Multiplying the dotted-decimal subnet mask by 2 and appending the hexadecimal representation of the interface VLAN ID",
      "Converting the subnet mask into CIDR prefix notation and calculating the mathematical square root of the total host addresses",
      "Adding 255 to each octet of the subnet mask and discarding any numerical overflow exceeding the 16-bit register limit"
    ],
    explanationsJson: {
      1: "Wildcard masks are calculated by binary inversion (255.255.255.255 minus subnet mask), not multiplication.",
      2: "Square root calculations have no application in binary subnetting or wildcard mask generation.",
      3: "Wildcard masks represent bitwise inversion; adding 255 produces invalid octet numbers."
    }
  },

  // 10. quiz-firewalls-acls-overview (3)
  {
    quizId: "quiz-firewalls-acls-overview",
    concept: "Top-Down Execution & Implicit Deny",
    options: [
      "The packet is held in router memory for 60 seconds while an administrator is prompted to enter an authorization code via SSH",
      "The packet matches all rules simultaneously and is forwarded out of every active interface in parallel across the autonomous system",
      "The packet is matched sequentially top-down; if no explicit permit matches, it is dropped by the invisible \"implicit deny any\" at the end",
      "The packet is automatically rewritten as an ICMP Echo Request and returned to the sender with a TTL value of 255"
    ],
    explanationsJson: {
      0: "Routers process packets in hardware ASICs in microseconds; they never pause forwarding to prompt human administrators.",
      1: "ACL evaluation stops immediately on the first matching rule; statements are never evaluated concurrently.",
      3: "Unmatched packets are silently dropped by the implicit deny rule; they are not rewritten into ICMP echo requests."
    }
  },

  // 11. quiz-firewalls-acls-overview (4)
  {
    quizId: "quiz-firewalls-acls-overview",
    concept: "Stateful Inspection Dynamic State Table",
    options: [
      "It dynamically tracks outbound connection handshakes (IPs, ports, sequence numbers) and automatically permits the corresponding return traffic",
      "It decrypts all incoming SSL/TLS payloads and inspects application data using asymmetric private key authentication",
      "It permanently blocks all incoming UDP traffic while allowing unlimited uninspected TCP traffic through the perimeter",
      "It converts external IPv4 public addresses into internal IPv6 addresses using automated dual-stack protocol translation"
    ],
    explanationsJson: {
      1: "Basic stateful firewalls track Layer 3/4 flow state; SSL decryption is a specialized Next-Gen Firewall (NGFW) capability.",
      2: "Stateful firewalls track UDP pseudo-sessions (matching IP/port pairs) as well as TCP; they do not unconditionally drop UDP.",
      3: "Address translation is performed by NAT/NAT64, distinct from stateful session tracking."
    }
  },

  // 12. quiz-net-302-spanning-tree-protocol-loop-prevention (1)
  {
    quizId: "quiz-net-302-spanning-tree-protocol-loop-prevention",
    concept: "STP Root Port Selection",
    options: [
      "The port that has the highest physical link speed and the largest configured maximum transmission unit (MTU)",
      "The port that connects directly to the Internet service provider edge router via an 802.1Q trunk connection",
      "The single port on that non-root switch that has the lowest cumulative path cost to reach the Root Bridge",
      "A designated port that blocks all user data frames while allowing broadcast traffic to flood across the VLAN"
    ],
    explanationsJson: {
      0: "Speed influences path cost, but the selection criteria is the lowest cumulative path cost to the Root Bridge, not raw port MTU.",
      1: "Root Ports point toward the internal STP Root Bridge switch, which is typically the core campus switch, not an ISP router.",
      3: "Root Ports actively forward user data frames; blocking ports are alternate/backup ports."
    }
  },

  // 13. quiz-net-302-spanning-tree-protocol-loop-prevention (2)
  {
    quizId: "quiz-net-302-spanning-tree-protocol-loop-prevention",
    concept: "802.1D STP Convergence Timers",
    options: [
      "Blocking -> Listening (15s) -> Learning (15s) -> Forwarding; Total convergence time = 30 to 50 seconds",
      "Forwarding -> Filtering (5s) -> Flooding (10s) -> Disabled; Total convergence time = 15 seconds",
      "Listening (1s) -> Forwarding (1s); Total convergence time = 2 seconds via rapid link negotiation pulses",
      "Standby -> Negotiating (60s) -> Active (60s); Total convergence time = 120 seconds across all access ports"
    ],
    explanationsJson: {
      1: "This is an inaccurate state progression; standard 802.1D progresses through Blocking, Listening, Learning, and Forwarding.",
      2: "Sub-second or 2-second convergence is achieved by 802.1w Rapid STP (RSTP), not legacy 802.1D Spanning Tree.",
      3: "802.1D uses standard forward delay timers (15 seconds each for Listening and Learning), totaling 30-50s including Max Age."
    }
  },

  // 14. quiz-net-304-single-area-ospf-routing (1)
  {
    quizId: "quiz-net-304-single-area-ospf-routing",
    concept: "OSPF Adjacency Requirements",
    options: [
      "Area ID, Subnet Mask, Hello Interval, Dead Interval, and Authentication Password",
      "Router Hostname, Chassis Serial Number, Physical MAC Address, and Power Supply Wattage",
      "Default Gateway IP, DNS Domain Name, NTP Stratum Level, and Web Management Port",
      "BGP Autonomous System Number, VLAN Identification Tag, and Spanning Tree Priority"
    ],
    explanationsJson: {
      1: "Hostnames, serial numbers, MAC addresses, and power specifications are device attributes not evaluated in OSPF Hello packets.",
      2: "Default gateway and DNS settings are client configurations; OSPF routers establish adjacencies based on link-level parameters.",
      3: "BGP AS numbers and STP priorities belong to different protocols and are not checked during OSPF neighbor formation."
    }
  },

  // 15. quiz-net-304-single-area-ospf-routing (2)
  {
    quizId: "quiz-net-304-single-area-ospf-routing",
    concept: "OSPF MTU Mismatch & EXSTART Diagnosis",
    options: [
      "A mismatch in the configured OSPF Process ID number between the two communicating router instances",
      "An MTU (Maximum Transmission Unit) mismatch between the two connected interfaces, causing the larger DBD packet to be dropped",
      "A collision between identical OSPF Router IDs configured on both ends of the point-to-point link",
      "The physical Ethernet cable exceeding the 100-meter physical channel limit causing excessive signal latency"
    ],
    explanationsJson: {
      0: "OSPF Process IDs are locally significant to the router operating system and do not need to match between neighbors.",
      2: "Duplicate Router IDs cause neighbor flapping or reject Init states, but EXSTART/EXCHANGE hang is the classic MTU mismatch symptom.",
      3: "Cable length issues cause physical link flaps (UP/DOWN) or CRC errors, not a stuck protocol state machine during DBD exchange."
    }
  },

  // 16. quiz-net-304-single-area-ospf-routing (3)
  {
    quizId: "quiz-net-304-single-area-ospf-routing",
    concept: "OSPF Reference Bandwidth Scaling",
    options: [
      "OSPF cost automatically scales based on real-time interface CPU utilization and packet error rate counters",
      "OSPF cost is permanently fixed at 10 for all Ethernet interfaces regardless of whether they operate at 10M, 1G, or 100G",
      "OSPF metric is determined by counting the total number of router hops between source and destination networks",
      "Default reference bandwidth is 100 Mbps (cost = 1 for 100M, 1G, 10G); engineer must execute auto-cost reference-bandwidth 100000 (or higher) to accurately scale costs"
    ],
    explanationsJson: {
      0: "OSPF cost is a static formula based on configured interface bandwidth, not dynamic real-time CPU or error metrics (like EIGRP).",
      1: "Cost is calculated as Reference Bandwidth / Interface Bandwidth; with default 100M reference, 100M and faster all equal cost 1.",
      2: "Hop count is the metric for distance-vector protocols like RIP; OSPF is a link-state protocol using cumulative bandwidth cost."
    }
  },

  // 17. quiz-net-304-multi-area-ospf-redistribution
  {
    quizId: "quiz-net-304-multi-area-ospf-redistribution",
    concept: "Diagnosing Multi-Area Route Flapping & ABR Summarization Remediation",
    options: [
      "Reconfigure Area 10 as an OSPF Totally Stubby Area to block all external Type 5 Link-State Advertisements",
      "Configure inter-area route summarization on ABR-1 using `area 10 range 10.10.0.0 255.255.252.0` to suppress individual /24 Type 3 LSAs",
      "Increase the OSPF Hello timer to 60 seconds and the Dead timer to 240 seconds on all Area 0 core interfaces",
      "Manually modify the administrative distance of all OSPF inter-area routes from 110 down to 90 on core routers"
    ],
    explanationsJson: {
      0: "Totally Stubby areas block Type 3/4/5 LSAs within that area, but do not prevent unstable internal subnets from flapping into Area 0.",
      2: "Increasing Hello timers delays adjacency detection across Area 0, but does not shield the backbone from SPF churn caused by flapping subnets.",
      3: "Changing administrative distance alters route preference against other protocols, but does not stop SPF tree recalculation."
    }
  },

  // 18. quiz-net-305-standard-extended-ipv4-acls
  {
    quizId: "quiz-net-305-standard-extended-ipv4-acls",
    concept: "Standard ACL Placement Best Practices",
    options: [
      "As close to the source as possible, to conserve internal LAN bandwidth by discarding packets before they reach access switches",
      "As close to the destination as possible, because standard ACLs only filter by source IP and placing them near the source would block traffic to other destinations",
      "Only on switch trunk ports, because standard ACLs cannot be parsed by Layer 3 hardware routing engines",
      "Directly on the default gateway loopback interface to prevent packet headers from exhausting router memory buffers"
    ],
    explanationsJson: {
      0: "Placing near the source is the rule for Extended ACLs; standard ACLs lack destination filtering and would block valid traffic to other destinations.",
      2: "Standard ACLs are applied to routed interfaces (physical interfaces, SVIs, subinterfaces), not Layer 2 switch trunk ports.",
      3: "Loopback interfaces do not filter transit network traffic; ACLs must be bound to transit data-plane interfaces."
    }
  },

  // 19. quiz-net-305-stateful-firewalls-connection-tracking (1)
  {
    quizId: "quiz-net-305-stateful-firewalls-connection-tracking",
    concept: "Stateful vs Stateless Firewall Operation",
    options: [
      "Stateful firewalls encrypt all payload data passing through the router using symmetric session keys negotiated via Diffie-Hellman",
      "Stateful firewalls dynamically track outbound session requests and automatically permit the corresponding return traffic without opening permanent static inbound ports",
      "Stateful firewalls eliminate the requirement for Layer 3 IP routing tables by forwarding packets strictly based on application URLs",
      "Stateful firewalls operate exclusively at the physical layer to amplify optical laser signals across single-mode fiber links"
    ],
    explanationsJson: {
      0: "Payload encryption is provided by VPN protocols like IPsec and TLS, not by stateful packet filtering engines.",
      2: "Firewalls must route packets between interfaces using Layer 3 routing tables; statefulness evaluates session validity, not path routing.",
      3: "Firewalls inspect Layer 3, Layer 4, and Layer 7 protocol headers; they do not function as physical layer repeaters."
    }
  },

  // 20. quiz-net-305-stateful-firewalls-connection-tracking (2)
  {
    quizId: "quiz-net-305-stateful-firewalls-connection-tracking",
    concept: "Stateful Connection Tracking Validation",
    options: [
      "The packet does not correspond to an established session or its sequence number falls outside the valid TCP window in the state table",
      "The packet destination port is lower than 1024, which is prohibited on all enterprise router perimeter firewall interfaces",
      "The packet payload contains binary data rather than human-readable ASCII text strings",
      "The packet source IP address does not match the public IP address configured on the firewall external WAN interface"
    ],
    explanationsJson: {
      1: "Well-known ports below 1024 (e.g. 80, 443, 53) are standard server ports routinely permitted by stateful firewalls.",
      2: "Stateful firewalls inspect protocol headers and session state regardless of whether payloads contain binary or text data.",
      3: "Inbound traffic from external Internet hosts naturally has external public IPs, not the firewall's own interface IP."
    }
  }
];

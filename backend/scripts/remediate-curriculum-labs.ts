import * as fs from 'fs';
import * as path from 'path';
import { ALL_CURRICULUM_LABS } from '../src/topics/curriculum-labs-catalog';
import { CourseLevel } from '@prisma/client';

const LAB_REMEDIATIONS: Record<string, Partial<typeof ALL_CURRICULUM_LABS['level-0-what-is-a-computer-network']>> = {
  "level-0-what-is-a-computer-network": {
    title: "Conceptual Exploration: Network Core Components & Transmission Modes",
    instructions: "Analyze data communication models, simplex vs half/full duplex transmission dynamics, and network performance criteria without artificial CLI simulation.",
    tasks: [
      "Identify the 5 core elements of data communications (Sender, Receiver, Medium, Message, Protocol) in enterprise client-server flows.",
      "Evaluate throughput, propagation delay, and transmission delay tradeoffs across Simplex, Half-Duplex, and Full-Duplex communication links.",
      "Compare physical bus, star, and mesh topologies for single-point-of-failure risks and cable infrastructure costs."
    ],
    commands: [],
    expectedObservations: [
      "Data communication component matrix and transmission mode timing diagram",
      "Topology fault-tolerance and cable complexity comparison"
    ],
    hints: [
      "Simplex is strictly unidirectional (e.g. broadcast radio); half-duplex is bidirectional one at a time; full-duplex is simultaneous bidirectional.",
      "Full mesh requires n*(n-1)/2 physical links; star topologies centralize connections through a single switch."
    ],
    completionCriteria: "Analytical model verified against theoretical networking specifications.",
    solution: {
      steps: [
        "Step 1: Map sender, receiver, transmission medium, message, and protocol in client-server architecture.",
        "Step 2: Contrast simplex, half-duplex, and full-duplex transmission throughput characteristics.",
        "Step 3: Analyze bus, star, and mesh physical topology failure boundaries."
      ]
    }
  },

  "net-101-bits-bytes-digital-representation": {
    title: "Analytical Sizing Lab: Bits, Bytes, Number Systems & Bandwidth Calculations",
    instructions: "Perform bitwise binary/hex conversions and calculate precise network transfer times avoiding common bit (b) vs Byte (B) traps.",
    tasks: [
      "Convert 8-bit octets between decimal, binary, and hexadecimal representations for IPv4 and IPv6 addressing.",
      "Calculate theoretical transfer duration for a 15 GB file over a 100 Mbps WAN link versus a 1 Gbps LAN link (T = File Size in Bits / Bandwidth in bps).",
      "Calculate host capacities (2^H - 2) and network boundaries across /24, /27, and /30 CIDR masks."
    ],
    commands: [],
    expectedObservations: [
      "Binary, decimal, and hexadecimal cross-conversion reference table",
      "Accurate throughput transmission duration calculations"
    ],
    hints: [
      "Remember that 1 Byte = 8 bits. Network bandwidth is measured in bits per second (bps); storage is measured in Bytes (B).",
      "A 15 GB file = 15 * 8 * 10^9 bits = 120 Gb. Over a 100 Mbps link, transfer takes 1200 seconds (20 minutes)."
    ],
    completionCriteria: "Bitwise mathematical model verified against network engineering sizing standards.",
    solution: {
      steps: [
        "Step 1: Convert decimal octets 192, 168, 10, 1 into binary (11000000.10101000.00001010.00000001) and hex (C0.A8.0A.01).",
        "Step 2: Multiply 15 GB by 8 to convert to gigabits, then divide by link bandwidth in Gbps.",
        "Step 3: Compute host address range using 2^(32-prefix) - 2."
      ]
    }
  },

  "level-0-lan-wan-internet-boundaries": {
    title: "Architectural Lab: LAN, WAN & Internet Boundary Demarcations",
    instructions: "Analyze geographical scales, latency profiles, autonomous systems, and enterprise perimeter demarcations.",
    tasks: [
      "Map network scopes: LAN (local office), CAN (campus backbone), MAN (metro area), and WAN (global transit).",
      "Analyze Customer Premises Equipment (CPE), Point of Presence (PoP), and Autonomous System (AS) peering handoffs.",
      "Differentiate private enterprise IP routing from public BGP Autonomous System routing across Tier-1/2/3 ISPs."
    ],
    commands: [],
    expectedObservations: [
      "Geographical scale and latency classification matrix",
      "Autonomous system boundary routing topology diagram"
    ],
    hints: [
      "LANs typically operate under 1 ms latency; WANs incur tens to hundreds of milliseconds of propagation delay.",
      "The demarcation point (demarc) separates customer-owned wiring from service provider infrastructure."
    ],
    completionCriteria: "Boundary architecture verified against telecommunications demarcation standards.",
    solution: {
      steps: [
        "Step 1: Categorize LAN, CAN, MAN, and WAN geographic reach and ownership.",
        "Step 2: Trace enterprise edge handoff through CPE router, CSU/DSU, and provider PoP.",
        "Step 3: Evaluate transit versus peering relationships in BGP Autonomous Systems."
      ]
    }
  },

  "level-0-network-protocols-standards": {
    title: "Standards & Specifications Analysis: IETF RFCs & IEEE 802 Hierarchy",
    instructions: "Examine protocol specifications, open standards bodies (IETF, IEEE, ISO), and standard RFC publication lifecycles.",
    tasks: [
      "Trace standard RFC lifecycles from Internet-Draft to Proposed Standard and Internet Standard (RFC 791, 793, 2328).",
      "Map IEEE 802 standards to physical and link layers (802.3 Ethernet, 802.11 Wi-Fi, 802.1Q VLANs).",
      "Analyze protocol data unit (PDU) encapsulation boundaries across the protocol stack."
    ],
    commands: [],
    expectedObservations: [
      "IETF RFC standards mapping and RFC lifecycle progression",
      "IEEE 802 committee domain matrix"
    ],
    hints: [
      "IETF oversees Internet protocols (TCP, IP, DNS, BGP); IEEE oversees physical and data link standards (Ethernet, Wi-Fi).",
      "RFCs are immutable once published; revisions receive a new RFC number (e.g. RFC 793 -> RFC 9293)."
    ],
    completionCriteria: "Protocol standards matrix verified against IETF and IEEE canonical indexes.",
    solution: {
      steps: [
        "Step 1: Correlate core RFC specifications with their respective protocols (RFC 791 IPv4, RFC 793 TCP, RFC 826 ARP).",
        "Step 2: Map IEEE 802 project subdivisions to networking hardware technologies.",
        "Step 3: Trace cross-layer PDU encapsulation metadata handoffs."
      ]
    }
  },

  "ip-addressing-ipv4-overview": {
    title: "Guided Engineering Practice: IPv4 Host Configuration & Routing Table Audit",
    instructions: "Execute terminal diagnostic workflows to inspect host IPv4 network configuration, subnet masks, and kernel routing table routes.",
    tasks: [
      "Inspect host IPv4 address, subnet mask, default gateway, and DHCP lease timers using `ipconfig /all`.",
      "Audit host IPv4 routing table destinations, netmasks, gateways, and interface metrics using `route print`.",
      "Test TCP/IP protocol stack integrity by pinging the loopback address (`127.0.0.1`)."
    ],
    commands: [
      "ipconfig /all",
      "route print",
      "ping 127.0.0.1"
    ],
    expectedObservations: [
      "Active network adapter IPv4 configuration and gateway binding",
      "Kernel routing table destination routes and default gateway metric",
      "0% packet loss indicating functional TCP/IP protocol stack"
    ],
    hints: [
      "`ipconfig /all` displays complete MAC, IP, and DHCP lease metadata.",
      "Destination 0.0.0.0 in `route print` denotes the default gateway route."
    ],
    completionCriteria: "Host IPv4 network configuration and routing table verified.",
    solution: {
      steps: [
        "Step 1: Execute `ipconfig /all` and verify IPv4 address, subnet mask, and default gateway.",
        "Step 2: Execute `route print` and identify the default route (0.0.0.0/0) gateway next-hop.",
        "Step 3: Execute `ping 127.0.0.1` to confirm internal TCP/IP stack health."
      ]
    }
  },

  "level-0-dns-internet-phonebook": {
    title: "Guided Engineering Practice: DNS Resolution Hierarchy & Resource Record Audit",
    instructions: "Audit DNS domain name resolution using `nslookup` across IPv4 A records, IPv6 AAAA records, MX mail records, and reverse PTR lookups.",
    tasks: [
      "Query IPv4 address records (A) and IPv6 address records (AAAA) for target domains using `nslookup`.",
      "Inspect Mail Exchange (MX) records and preference weights for mail server routing.",
      "Perform reverse DNS lookup (PTR record) on public IP 8.8.8.8 to verify in-addr.arpa delegation over UDP port 53."
    ],
    commands: [
      "nslookup netvision.edu",
      "nslookup -type=AAAA netvision.edu",
      "nslookup -type=MX netvision.edu",
      "nslookup 8.8.8.8"
    ],
    expectedObservations: [
      "Domain name to 32-bit IPv4 address mapping (A Record)",
      "Domain name to 128-bit IPv6 address mapping (AAAA Record)",
      "Mail exchange server hostname and preference priority (MX Record)",
      "IP-to-hostname reverse resolution pointer (PTR Record)"
    ],
    hints: [
      "DNS uses UDP port 53 for standard queries under 512 bytes; TCP 53 is used for zone transfers and large responses.",
      "The `-type=` flag in `nslookup` instructs the resolver to query specific resource record types."
    ],
    completionCriteria: "DNS query resolution across A, AAAA, MX, and PTR record types verified.",
    solution: {
      steps: [
        "Step 1: Run `nslookup netvision.edu` and record the returned IPv4 address.",
        "Step 2: Run `nslookup -type=AAAA netvision.edu` and inspect the 128-bit IPv6 address.",
        "Step 3: Run `nslookup -type=MX netvision.edu` and record the priority mail exchange servers.",
        "Step 4: Run `nslookup 8.8.8.8` and verify reverse PTR resolution."
      ]
    }
  },

  "level-0-dhcp-automatic-ip-allocation": {
    title: "Guided Engineering Practice: DHCP DORA Handshake & Lease Lifecycle Management",
    instructions: "Inspect and manage the automated IPv4 address leasing lifecycle: trigger DHCP Discover/Offer/Request/Acknowledge (DORA) and audit lease metadata.",
    tasks: [
      "Release existing IPv4 lease and trigger fresh 4-phase DHCP DORA exchange using `ipconfig /renew`.",
      "Inspect negotiated IP lease parameters: assigned IP, subnet mask, default gateway, DNS servers, and lease duration.",
      "Verify APIPA fallback address assignment (169.254.x.x) under DHCP server unavailability."
    ],
    commands: [
      "ipconfig /release",
      "ipconfig /renew",
      "ipconfig /all"
    ],
    expectedObservations: [
      "Adapter IP drops to 0.0.0.0 upon lease release",
      "Successful DHCP DORA lease renewal with assigned IPv4 address",
      "DHCP Option parameters (Option 1 Subnet Mask, Option 3 Router, Option 6 DNS)"
    ],
    hints: [
      "DHCP clients broadcast Discover messages on UDP port 67; servers reply on UDP port 68.",
      "If a client receives no DHCP Offer, Windows automatically self-assigns an APIPA address (169.254.0.0/16)."
    ],
    completionCriteria: "DHCP DORA exchange and lease parameter verification completed successfully.",
    solution: {
      steps: [
        "Step 1: Execute `ipconfig /release` to terminate the active DHCP binding.",
        "Step 2: Execute `ipconfig /renew` to broadcast DHCP Discover and complete the DORA handshake.",
        "Step 3: Execute `ipconfig /all` to verify lease obtained and expiration timestamps."
      ]
    }
  },

  "ipv6-foundations-overview": {
    title: "Guided Engineering Practice: IPv6 Addressing, SLAAC & Neighbor Discovery Audit",
    instructions: "Inspect 128-bit IPv6 address architecture, loopback ping verification, RFC 5952 zero-compression, and Neighbor Discovery Protocol (NDP).",
    tasks: [
      "Test local IPv6 protocol stack loopback operation by pinging `::1`.",
      "Inspect 128-bit IPv6 address assignments: Link-Local (`fe80::/10`) and Global Unicast (`2000::/3`).",
      "Audit Neighbor Discovery Protocol (NDP) neighbor cache table entries replacing legacy IPv4 ARP."
    ],
    commands: [
      "ping ::1",
      "netsh interface ipv6 show addresses",
      "netsh interface ipv6 show neighbors"
    ],
    expectedObservations: [
      "IPv6 loopback response with zero packet loss",
      "Link-Local address with `fe80::` prefix and zone index identifier",
      "NDP Neighbor cache mapping IPv6 addresses to Layer 2 physical MAC addresses"
    ],
    hints: [
      "IPv6 loopback address is `::1` (equivalent to IPv4 `127.0.0.1`).",
      "Link-local addresses begin with `fe80::` and are non-routable beyond the immediate local link."
    ],
    completionCriteria: "IPv6 stack health and link-local neighbor cache verified.",
    solution: {
      steps: [
        "Step 1: Ping `::1` to verify internal IPv6 protocol stack.",
        "Step 2: View interface IPv6 addresses using `netsh interface ipv6 show addresses`.",
        "Step 3: View NDP neighbor cache entries using `netsh interface ipv6 show neighbors`."
      ]
    }
  },

  "level-0-network-ports-socket-boundaries": {
    title: "Guided Engineering Practice: TCP/UDP Sockets & Endpoint Port Boundaries",
    instructions: "Audit endpoint network sockets, track active 4-tuple connections, and map listening ports to executing system processes.",
    tasks: [
      "Audit listening TCP/UDP ports across Well-Known (0-1023) and Registered (1024-49151) port ranges.",
      "Inspect active 4-tuple socket connections (Local IP:Port <-> Remote IP:Port) and connection states.",
      "Correlate socket Process IDs (PIDs) with active system executable binaries using `tasklist`."
    ],
    commands: [
      "netstat -ano",
      "netstat -tuln",
      "tasklist"
    ],
    expectedObservations: [
      "4-tuple TCP socket bindings in LISTENING, ESTABLISHED, and TIME_WAIT states",
      "Process ID (PID) numbers linked to active network sockets",
      "Process binary names matching listening port PID numbers"
    ],
    hints: [
      "A network socket is defined as an IP address paired with a 16-bit Port number (e.g. 192.168.1.50:443).",
      "The `-o` flag in `netstat` displays the owning Process ID (PID) for each connection."
    ],
    completionCriteria: "Socket 4-tuple mapping and process correlation verified.",
    solution: {
      steps: [
        "Step 1: Run `netstat -ano` to list all active TCP and UDP listening sockets and connections.",
        "Step 2: Identify ESTABLISHED 4-tuple connections (Local IP:Port and Foreign IP:Port).",
        "Step 3: Cross-reference PID numbers against `tasklist` output to verify process binaries."
      ]
    }
  },

  "level-0-network-packets-data-framing": {
    title: "Guided Engineering Practice: MTU Fragmentation & Path MTU Discovery Verification",
    instructions: "Evaluate Layer 2 frame sizing and Layer 3 packet boundaries: test Maximum Transmission Unit (MTU = 1500) and Don't Fragment (DF) behavior.",
    tasks: [
      "Inspect physical network adapter Maximum Transmission Unit (MTU = 1500 bytes) settings.",
      "Send unfragmented 1472-byte ICMP payload with Don't Fragment (DF) flag set to verify 1500-byte wire frame.",
      "Send 1473-byte ICMP payload with DF set to verify packet drop and fragmentation error detection."
    ],
    commands: [
      "netsh interface ipv4 show subinterfaces",
      "ping -f -l 1472 192.168.1.1",
      "ping -f -l 1473 192.168.1.1"
    ],
    expectedObservations: [
      "Subinterface MTU confirmed at 1500 bytes",
      "1472-byte payload ping succeeds without fragmentation (1472 + 8 ICMP + 20 IP = 1500)",
      "`Packet needs to be fragmented but DF set` error on 1473-byte payload"
    ],
    hints: [
      "Standard Ethernet MTU is 1500 bytes. Subtract 20 bytes for IPv4 header and 8 bytes for ICMP header = 1472 bytes max payload.",
      "The `-f` flag sets the Don't Fragment (DF) bit in the IPv4 header; `-l` specifies the payload size."
    ],
    completionCriteria: "MTU threshold boundary and PMTUD fragmentation behavior verified.",
    solution: {
      steps: [
        "Step 1: Run `netsh interface ipv4 show subinterfaces` and record adapter MTU.",
        "Step 2: Run `ping -f -l 1472 192.168.1.1` and verify successful reply.",
        "Step 3: Run `ping -f -l 1473 192.168.1.1` and observe the fragmentation needed error."
      ]
    }
  },

  "tcp-udp-transport-overview": {
    title: "Guided Engineering Practice: TCP Socket State Machine & Flow Control Analysis",
    instructions: "Audit Layer 4 transport protocol dynamics: evaluate TCP 3-way handshakes, sliding window flow control counters, and UDP datagram metrics.",
    tasks: [
      "Audit TCP transport statistics: total connections established, active opens, passive opens, and resets.",
      "Inspect TCP Sliding Window flow control, Maximum Segment Size (MSS = 1460 bytes), and round-trip times.",
      "Compare TCP connection-oriented reliable delivery with lightweight UDP datagram statistics."
    ],
    commands: [
      "netstat -s",
      "ping -n 10 192.168.1.1"
    ],
    expectedObservations: [
      "TCP segment retransmission counts and window scaling metrics",
      "Comparison of TCP state machine counters against UDP datagram totals",
      "Zero packet drop over ICMP test sample"
    ],
    hints: [
      "TCP headers are 20 to 60 bytes with sequence/ACK tracking; UDP headers are fixed at 8 bytes with zero handshake overhead.",
      "`netstat -s` outputs cumulative protocol statistics across IPv4, IPv6, ICMP, TCP, and UDP."
    ],
    completionCriteria: "Layer 4 transport telemetry and protocol counters verified.",
    solution: {
      steps: [
        "Step 1: Execute `netstat -s` and inspect the TCP Statistics section.",
        "Step 2: Record segments sent, segments retransmitted, and connection resets.",
        "Step 3: Compare TCP statistics against UDP datagrams sent and received."
      ]
    }
  },

  "level-0-routers-inter-subnet-pathfinders": {
    title: "Guided Engineering Practice: Inter-Subnet Path Finding & TTL Decrement Analysis",
    instructions: "Analyze Layer 3 packet routing and TTL hop decrement dynamics across intermediate default gateways.",
    tasks: [
      "Execute `tracert` without DNS delays to trace hop-by-hop Layer 3 routing paths across intermediate routers.",
      "Observe ICMP Time Exceeded (Type 11 Code 0) generation as routers decrement IPv4 TTL to 0.",
      "Verify default gateway Layer 2 ARP resolution and next-hop forwarding decisions."
    ],
    commands: [
      "tracert -d 8.8.8.8",
      "route print",
      "arp -a"
    ],
    expectedObservations: [
      "Hop-by-hop intermediate router IP addresses and RTT latency",
      "TTL decrement behavior from initial value down through each transit router",
      "Default gateway MAC address binding in ARP table"
    ],
    hints: [
      "Every router that forwards an IPv4 packet decrements the TTL field by 1. When TTL reaches 0, the router drops the packet and sends an ICMP Time Exceeded message.",
      "The `-d` flag in `tracert` prevents DNS reverse lookups, speeding up output display."
    ],
    completionCriteria: "Hop-by-hop path tracing and TTL decrement mechanics verified.",
    solution: {
      steps: [
        "Step 1: Execute `tracert -d 8.8.8.8` to display intermediate Layer 3 next-hops.",
        "Step 2: Verify Hop 1 is the local default gateway IP address.",
        "Step 3: Run `arp -a` and confirm the gateway IP matches the gateway MAC address."
      ]
    }
  },

  "routing-fundamentals-overview": {
    title: "Guided Engineering Practice: Routing Table Construction & Longest Prefix Match",
    instructions: "Audit Layer 3 router forwarding tables: evaluate connected, static, and dynamic routes alongside Longest Prefix Match (LPM) logic.",
    tasks: [
      "Audit routing table entries, route codes (C=Connected, S=Static, O=OSPF), and Administrative Distances.",
      "Evaluate Longest Prefix Match (LPM) route selection among overlapping prefixes (/16, /24, /30).",
      "Verify gateway of last resort (default route 0.0.0.0/0) traffic forwarding."
    ],
    commands: [
      "show ip route",
      "show ip interface brief",
      "traceroute 10.2.0.1"
    ],
    expectedObservations: [
      "Routing table output displaying network prefixes, subnets, and next-hop interfaces",
      "Directly connected subnets with Administrative Distance 0 and Metric 0",
      "Longest prefix match routing decisions for transit packets"
    ],
    hints: [
      "Administrative Distance (AD) determines route trustworthiness: Connected = 0, Static = 1, OSPF = 110.",
      "Routers always prefer the most specific route (longest prefix length) regardless of AD."
    ],
    completionCriteria: "Routing table evaluation and LPM route selection verified.",
    solution: {
      steps: [
        "Step 1: Run `show ip route` to display all installed routes in the routing information base (RIB).",
        "Step 2: Identify connected ('C') and static ('S') entries.",
        "Step 3: Trace next-hop resolution for destination 10.2.0.1 using longest prefix match."
      ]
    }
  },

  "network-security-basics-overview": {
    title: "Guided Engineering Practice: Port Scanning, ARP Cache Poisoning Defense & Security Audit",
    instructions: "Conduct endpoint security auditing: discover open TCP listening ports, inspect ARP cache integrity, and detect unauthorized socket listeners.",
    tasks: [
      "Execute a TCP connect port scan against server interfaces to identify open vs filtered ports.",
      "Inspect ARP cache tables to identify dynamic MAC-to-IP bindings and detect potential spoofing anomalies.",
      "Audit listening system network ports to identify unauthorized background service listeners."
    ],
    commands: [
      "nmap -sT -p 22,80,443 192.168.1.1",
      "arp -a",
      "netstat -ano"
    ],
    expectedObservations: [
      "Port status report (open, closed, filtered) across audited services",
      "Verified ARP table bindings with unique MAC-to-IP mappings",
      "Verified listening socket process IDs"
    ],
    hints: [
      "A port is 'open' if the target completes the TCP handshake (SYN-ACK); 'closed' if it returns a TCP RST; 'filtered' if dropped by a firewall.",
      "Duplicate MAC addresses across multiple different IP addresses can indicate ARP poisoning attacks."
    ],
    completionCriteria: "Perimeter port audit and ARP cache verification completed.",
    solution: {
      steps: [
        "Step 1: Execute `nmap -sT -p 22,80,443 192.168.1.1` and record open ports.",
        "Step 2: Run `arp -a` and inspect physical addresses for duplicate entries.",
        "Step 3: Run `netstat -ano` and verify that all listening sockets belong to authorized system PIDs."
      ]
    }
  },

  "net-403-network-automation-programmability-foundations": {
    title: "Guided Engineering Practice: RESTCONF/YANG Model Inspection & Idempotent API Updates",
    instructions: "Interact with programmable network operating systems using RESTCONF and YANG data models to perform declarative, idempotent state updates.",
    tasks: [
      "Query router RESTCONF interface using HTTP GET to retrieve running interface state in structured JSON format.",
      "Inspect YANG data schema hierarchy (ietf-interfaces module) and validate container/leaf data types.",
      "Execute an idempotent PATCH update modifying interface description and verify zero configuration drift."
    ],
    commands: [
      "curl -s -X GET http://router.corp/restconf/data/ietf-interfaces:interfaces",
      "python3 -c \"import json, sys; print(json.load(sys.stdin))\""
    ],
    expectedObservations: [
      "Structured JSON response payload representing device interfaces",
      "YANG container hierarchy matching RFC 7223 schema definitions",
      "Verified idempotent state transition without duplicate resource creation"
    ],
    hints: [
      "Idempotency guarantees that executing the same API request multiple times results in the identical system state.",
      "RESTCONF uses HTTP GET (read), POST (create), PUT (replace), and PATCH (update) with JSON or XML data."
    ],
    completionCriteria: "RESTCONF programmatic query and idempotent JSON payload verification completed.",
    solution: {
      steps: [
        "Step 1: Query RESTCONF endpoint using `curl -X GET` to retrieve interface operational telemetry.",
        "Step 2: Parse and validate JSON data structure against the YANG module schema.",
        "Step 3: Submit idempotent update and verify device state matches declarative target."
      ]
    }
  },

  "sdn-cloud-networking-overview": {
    title: "Guided Engineering Practice: SDN Controller API Telemetry & Spine-Leaf Fabric Audit",
    instructions: "Query software-defined networking controller Northbound REST APIs and inspect modern 2-tier Spine-Leaf Clos fabric operations.",
    tasks: [
      "Query centralized SDN controller Northbound REST APIs to retrieve multi-device fabric inventory.",
      "Inspect 2-tier Spine-Leaf Clos fabric East-West 2-hop forwarding latency and ECMP load balancing.",
      "Execute an authenticated NETCONF <get-config> XML RPC request over SSH port 830 to inspect running configuration."
    ],
    commands: [
      "curl -k -u admin:Cisco123 -X GET https://sdn-controller.corp/dna/intent/api/v1/network-device",
      "ssh -p 830 admin@leaf-01 -s netconf"
    ],
    expectedObservations: [
      "Centralized controller topology device health and reachability telemetry",
      "2-hop East-West data center routing telemetry over ECMP fabric",
      "NETCONF XML RPC reply displaying running configuration datastore"
    ],
    hints: [
      "Spine-Leaf architectures replace Spanning Tree with Layer 3 ECMP routing, utilizing 100% of redundant links.",
      "NETCONF uses SSH on port 830 to exchange XML-encoded RPC requests (<rpc> and <rpc-reply>)."
    ],
    completionCriteria: "SDN controller API inventory and NETCONF RPC session verified.",
    solution: {
      steps: [
        "Step 1: Query controller Northbound API using `curl` and inspect returned device inventory JSON array.",
        "Step 2: Verify all Spine and Leaf switches report REACHABLE status.",
        "Step 3: Establish NETCONF SSH session on port 830 and exchange `<hello>` and `<get-config>` RPC messages."
      ]
    }
  },

  "wireless-networking-overview": {
    title: "Guided Engineering Practice: 802.11 RF Spectrum Analysis, Channel Allocation & RSSI Telemetry",
    instructions: "Audit wireless LAN operational metrics: analyze 2.4 GHz vs 5 GHz radio channels, SSID beaconing, RSSI signal strength, and CSMA/CA constraints.",
    tasks: [
      "Inspect active Wi-Fi radio type (802.11ax/ac/n), channel number, radio frequency band, and RSSI signal quality.",
      "Survey neighboring BSSIDs to detect co-channel interference on 2.4 GHz non-overlapping channels (1, 6, 11).",
      "Analyze transmission rates, channel bandwidths (20 MHz, 40 MHz, 80 MHz, 160 MHz), and half-duplex CSMA/CA constraints."
    ],
    commands: [
      "netsh wlan show interfaces",
      "netsh wlan show networks mode=bssid",
      "netsh wlan show drivers"
    ],
    expectedObservations: [
      "Active wireless adapter connection speed, SSID, BSSID, and signal quality percentage",
      "Neighboring access point channel distribution and signal attenuation",
      "Driver capabilities: 802.11ax (Wi-Fi 6) support and WPA3 authentication"
    ],
    hints: [
      "2.4 GHz spectrum has only 3 non-overlapping channels in North America (1, 6, 11); 5 GHz offers over 25 non-overlapping 20 MHz channels.",
      "RSSI values closer to 0 indicate stronger signal (-30 dBm is exceptional, -70 dBm is acceptable, -85 dBm causes packet loss)."
    ],
    completionCriteria: "802.11 RF telemetry, channel allocation, and signal strength verification completed.",
    solution: {
      steps: [
        "Step 1: Run `netsh wlan show interfaces` and record radio type, channel, and signal quality.",
        "Step 2: Run `netsh wlan show networks mode=bssid` and map channel usage of neighboring access points.",
        "Step 3: Identify co-channel interference and verify selection of non-overlapping channels."
      ]
    }
  },

  "net-102-network-performance": {
    title: "Guided Engineering Practice: Network Latency, Jitter, Throughput & QoS SLA Verification",
    instructions: "Audit end-to-end network performance metrics: measure round-trip time (RTT), calculate packet jitter variance, and inspect interface error counters.",
    tasks: [
      "Execute extended ICMP ping sample (30 packets) to calculate minimum, maximum, average RTT, and packet jitter variance.",
      "Inspect network interface statistics for byte counts, discards, and input/output errors using `netstat -e`.",
      "Calculate theoretical throughput versus goodput efficiency under simulated packet loss conditions."
    ],
    commands: [
      "ping -n 30 192.168.1.1",
      "netstat -e",
      "tracert 8.8.8.8"
    ],
    expectedObservations: [
      "Latency distribution statistics (min/avg/max/jitter) and packet loss percentage",
      "Interface transmission error counters and bandwidth utilization metrics",
      "Hop-by-hop latency profile along upstream gateway transit path"
    ],
    hints: [
      "Jitter is the variance in packet arrival latency (Max RTT - Min RTT); voice and video require jitter under 30 ms.",
      "Goodput measures payload throughput delivered to applications, excluding protocol headers and retransmissions."
    ],
    completionCriteria: "Network performance SLA metrics, latency jitter, and interface error audit verified.",
    solution: {
      steps: [
        "Step 1: Run `ping -n 30 192.168.1.1` and compute jitter: (Maximum RTT - Minimum RTT).",
        "Step 2: Run `netstat -e` and verify Discarded and Error packet counters are zero.",
        "Step 3: Run `tracert 8.8.8.8` to evaluate transit hop latency progression."
      ]
    }
  },

  "net-304-multi-area-ospf-redistribution": {
    title: "Engineering Simulation: Multi-Area OSPF ABR Configuration & Route Summarization",
    instructions: "Configure Multi-Area OSPF on an Area Border Router (ABR): establish Area 0 backbone and Area 1 edge adjacencies, configure inter-area route summarization, and inspect Type 3 Summary LSAs.",
    tasks: [
      "Enter router OSPF configuration mode and configure Area 0 backbone transit interface.",
      "Configure OSPF Area 1 range summarization (`area 1 range 10.1.0.0 255.255.0.0`) on ABR-1.",
      "Verify Type 3 Summary LSA injection and inspect Link-State Database with `show ip ospf database summary`.",
      "Inspect routing table to confirm granular /24 routes replaced by single /16 summary route."
    ],
    commands: [
      "router ospf 1",
      "network 10.0.0.0 0.0.0.255 area 0",
      "network 10.1.0.0 0.0.255.255 area 1",
      "area 1 range 10.1.0.0 255.255.0.0",
      "show ip ospf neighbor",
      "show ip ospf database summary",
      "show ip route"
    ],
    expectedObservations: [
      "OSPF Full neighbor adjacency with Area 0 backbone router",
      "Type 3 Summary LSA entry for 10.1.0.0/16 in LSDB",
      "Routing table displaying summarized O IA route entry"
    ],
    hints: [
      "Multi-area OSPF requires all non-backbone areas to connect directly to Area 0.",
      "Route summarization on ABRs prevents routing table bloat and confines LSA flooding to local areas."
    ],
    completionCriteria: "Multi-Area OSPF ABR summarization and Type 3 LSA generation verified.",
    solution: {
      steps: [
        "Step 1: Enter OSPF configuration mode with `router ospf 1`.",
        "Step 2: Advertise Area 0 interface (`network 10.0.0.0 0.0.0.255 area 0`) and Area 1 (`network 10.1.0.0 0.0.255.255 area 1`).",
        "Step 3: Configure summarization with `area 1 range 10.1.0.0 255.255.0.0`.",
        "Step 4: Verify Type 3 summary LSA generation using `show ip ospf database summary`."
      ]
    }
  },

  "net-305-stateful-firewalls-connection-tracking": {
    title: "Engineering Simulation: Stateful Firewall Connection Tracking & State Table Audit",
    instructions: "Configure stateful inspection firewall policies: permit outbound TCP connections, verify automatic return flow handling via state table tracking, and audit dropped unsolicited inbound traffic.",
    tasks: [
      "Configure stateful inspection firewall policy permitting outbound TCP connections (HTTP/HTTPS/SSH).",
      "Verify that return traffic matching established sessions is dynamically permitted without static inbound ACLs.",
      "Inspect active state table connections and embryonic TCP handshakes using connection tracking.",
      "Test dropped unsolicited inbound packets attempting to initiate connections from untrusted zones."
    ],
    commands: [
      "access-list 101 permit tcp 192.168.1.0 0.0.0.255 any eq 443",
      "access-list 101 permit tcp 192.168.1.0 0.0.0.255 any eq 80",
      "ip access-group 101 in",
      "show access-lists",
      "ping 192.168.1.1"
    ],
    expectedObservations: [
      "Stateful firewall connection table tracking outbound TCP SYN and establishing bidirectional state",
      "Return TCP traffic permitted automatically by inspection engine",
      "Unmatched unsolicited inbound packets dropped by implicit deny rule"
    ],
    hints: [
      "Stateful firewalls maintain connection tables tracking IP 4-tuples and TCP sequence numbers.",
      "Unlike stateless ACLs, stateful firewalls do not require opening high ephemeral ports inbound."
    ],
    completionCriteria: "Stateful inspection policy and bidirectional state table verification completed.",
    solution: {
      steps: [
        "Step 1: Configure access-list 101 to permit outbound HTTPS and HTTP traffic.",
        "Step 2: Apply access-group 101 to the inside interface.",
        "Step 3: Verify permit hit counters with `show access-lists`.",
        "Step 4: Confirm state table tracks connection lifecycle through FIN/RST teardown."
      ]
    }
  },

  "nat-pat-overview": {
    title: "Engineering Simulation: Port Address Translation (PAT) Overload & Socket Mapping",
    instructions: "Configure Port Address Translation (NAT Overload) on an enterprise gateway: map thousands of private local sockets to a single public IP, and audit source port allocation tables.",
    tasks: [
      "Designate inside and outside NAT interfaces (`ip nat inside`, `ip nat outside`).",
      "Configure Port Address Translation (PAT / NAT Overload) using ACL 1 and outside interface.",
      "Generate concurrent outbound TCP sessions and inspect port translation mappings with `show ip nat translations`.",
      "Audit PAT statistics to monitor source port allocation efficiency and detect translation pool misses."
    ],
    commands: [
      "interface GigabitEthernet0/0",
      "ip nat inside",
      "interface GigabitEthernet0/1",
      "ip nat outside",
      "access-list 1 permit 192.168.1.0 0.0.0.255",
      "ip nat inside source list 1 interface GigabitEthernet0/1 overload",
      "show ip nat translations",
      "show ip nat statistics"
    ],
    expectedObservations: [
      "Inside interface GigabitEthernet0/0 and Outside interface GigabitEthernet0/1 assigned",
      "Translation table displaying unique source port mappings (192.168.1.50:49152 -> 203.0.113.1:10001)",
      "Zero missed translations in `show ip nat statistics`"
    ],
    hints: [
      "The `overload` keyword activates Port Address Translation (PAT), allowing up to ~64,000 concurrent sockets per IP.",
      "Check `show ip nat translations` to observe active Inside Local, Inside Global, Outside Local, and Outside Global sockets."
    ],
    completionCriteria: "PAT overload configuration and source port translation table verified.",
    solution: {
      steps: [
        "Step 1: Designate inside and outside interfaces with `ip nat inside` and `ip nat outside`.",
        "Step 2: Define matching standard ACL 1 for local subnet.",
        "Step 3: Apply `ip nat inside source list 1 interface GigabitEthernet0/1 overload`.",
        "Step 4: Verify translation entries using `show ip nat translations`."
      ]
    }
  },

  "vpn-cryptography-overview": {
    title: "Engineering Simulation: Enterprise VPN Architecture: IPsec vs WireGuard Verification",
    instructions: "Evaluate enterprise VPN tunnels: audit IPsec IKE Phase 1/2 state on Cisco routers, contrast with WireGuard Cryptokey Routing tables, and verify MSS clamping.",
    tasks: [
      "Inspect active IPsec and WireGuard cryptographic tunnel parameters on gateway router.",
      "Audit WireGuard cryptokey routing table (`wg show`) and verify peer `AllowedIPs` subnet mapping.",
      "Compare 1-RTT Noise protocol handshake latency against multi-roundtrip IKE Phase 1/Phase 2 negotiations.",
      "Verify MTU MSS clamping configuration (`ip tcp adjust-mss 1360`) to prevent ESP tunnel packet fragmentation."
    ],
    commands: [
      "show crypto isakmp sa",
      "show crypto ipsec sa",
      "show interfaces GigabitEthernet0/1",
      "ping 203.0.113.2"
    ],
    expectedObservations: [
      "IKE Phase 1 ISAKMP SA status confirming active security association",
      "IPsec SA packet encryption counters incrementing on user traffic",
      "MSS Clamping active at 1360 bytes on WAN crypto interface"
    ],
    hints: [
      "IPsec adds 50-70 bytes of ESP header overhead; always clamp TCP MSS to 1360 to prevent MTU blackholes.",
      "WireGuard uses modern Curve25519 and ChaCha20-Poly1305 with cryptokey routing over UDP 51820."
    ],
    completionCriteria: "VPN tunnel state, cryptographic algorithms, and MSS clamping verified.",
    solution: {
      steps: [
        "Step 1: Execute `show crypto isakmp sa` to confirm Phase 1 management tunnel.",
        "Step 2: Execute `show crypto ipsec sa` to verify active inbound/outbound transform sets.",
        "Step 3: Verify packet encryption counters increment upon sending interesting traffic."
      ]
    }
  },

  "network-troubleshooting-overview": {
    title: "Engineering Simulation: Enterprise Incident Diagnostics & Root-Cause Remediation",
    instructions: "Execute high-impact incident triage playbooks: diagnose MTU blackholes, isolate duplex mismatches using interface collision counters, and resolve routing loops.",
    tasks: [
      "Execute DF-bit ping sweep to diagnose Path MTU bottleneck and resolve MTU blackhole dropped connections.",
      "Inspect interface hardware counters with `show interfaces` to detect late collisions indicating duplex mismatches.",
      "Isolate asymmetric routing return path failure across multi-homed ISP perimeter firewalls.",
      "Apply targeted interface duplex/speed remediation and verify error counters remain at zero."
    ],
    commands: [
      "show interfaces GigabitEthernet0/1",
      "show ip route",
      "ping 8.8.8.8",
      "traceroute 10.50.1.1"
    ],
    expectedObservations: [
      "Interface operational state (up/up), duplex mode, CRC error counts, and collision telemetry",
      "Routing table next-hop verification and asymmetric path detection",
      "Successful ping and traceroute hop progression following remediation"
    ],
    hints: [
      "Late collisions on a switched link almost always indicate a duplex mismatch (one end full duplex, other end half duplex).",
      "If small pings work but large packets fail, suspect an MTU blackhole where ICMP Fragmentation Needed is blocked."
    ],
    completionCriteria: "Incident root-cause diagnosed and remediated according to enterprise playbooks.",
    solution: {
      steps: [
        "Step 1: Run `show interfaces GigabitEthernet0/1` and inspect CRC, late collision, and runt counters.",
        "Step 2: Trace Layer 3 path with `traceroute 10.50.1.1` to detect routing blackholes.",
        "Step 3: Resolve duplex mismatch or MTU clamping and verify error counters cease incrementing."
      ]
    }
  },

  "level-0-devices-in-a-network": {
    title: "Guided Engineering Practice: Network Hardware Roles & Layer Mapping",
    instructions: "Audit physical networking hardware roles: contrast Layer 1 hubs and repeaters with Layer 2 transparent switches and Layer 3 routing gateways.",
    tasks: [
      "Audit physical device interface states across repeaters, hubs, switches, and routers using `ipconfig /all`.",
      "Map collision domain boundaries (Layer 1 hub vs Layer 2 switch) and broadcast domain boundaries (Layer 3 router).",
      "Correlate Network Interface Card (NIC) physical MAC addresses with Layer 2 forwarding tables."
    ],
    commands: [
      "ipconfig /all",
      "getmac",
      "arp -a"
    ],
    expectedObservations: [
      "Network adapter link state and physical MAC address binding",
      "ARP table resolving Layer 3 IP addresses to Layer 2 MAC addresses",
      "Gateway IP assignment defining Layer 3 broadcast domain boundary"
    ],
    hints: [
      "Hubs repeat bits out all ports creating a single collision domain; switches isolate collision domains per port.",
      "Routers break up broadcast domains; each router interface connects to a separate subnet."
    ],
    completionCriteria: "Hardware layer mapping and collision/broadcast domain boundaries verified.",
    solution: {
      steps: [
        "Step 1: Execute `ipconfig /all` and record physical MAC address and default gateway.",
        "Step 2: Execute `getmac` to view transport hardware addresses.",
        "Step 3: Execute `arp -a` to view cached Layer 2 neighbor mappings."
      ]
    }
  },

  "level-0-client-and-server-architecture": {
    title: "Guided Engineering Practice: Client-Server Socket Communication Dynamics",
    instructions: "Analyze the client-server request-response paradigm: inspect dynamic ephemeral client ports versus persistent server service daemons.",
    tasks: [
      "Verify client-side dynamic ephemeral port allocation (ports 49152-65535) during outbound HTTP/HTTPS requests.",
      "Inspect server-side permanent listening daemons on well-known ports (80, 443, 22) using `netstat -an`.",
      "Analyze request-response round-trip latency and payload exchange in client-server communication."
    ],
    commands: [
      "netstat -an",
      "ping -n 4 netvision.edu"
    ],
    expectedObservations: [
      "Outbound client sockets bound to high ephemeral ports (49152-65535)",
      "Server-side TCP listening sockets on Well-Known ports (80, 443)",
      "Round-trip latency metrics for client-to-server request processing"
    ],
    hints: [
      "Clients use ephemeral ports to demultiplex concurrent web requests; servers listen on static well-known ports.",
      "Web servers utilize thread pools or asynchronous event loops to serve thousands of concurrent clients."
    ],
    completionCriteria: "Client ephemeral socket allocation and server daemon listening verified.",
    solution: {
      steps: [
        "Step 1: Execute `netstat -an` and filter for ESTABLISHED sessions to identify client ephemeral ports.",
        "Step 2: Identify LISTENING state sockets on ports 80, 443, and 22.",
        "Step 3: Test server connectivity and latency using ICMP echo."
      ]
    }
  },

  "network-topologies-overview": {
    title: "Guided Engineering Practice: Enterprise Network Topologies & Redundancy Analysis",
    instructions: "Analyze physical and logical network geometries: evaluate Star, Mesh, and Collapsed-Core campus topologies for resiliency and failure propagation.",
    tasks: [
      "Evaluate single-point-of-failure vulnerabilities in physical Star topologies centered around central access switches.",
      "Analyze redundant link loops in Mesh topologies and trace Spanning Tree Protocol (STP) blocked backup paths.",
      "Trace packet flow across a dual-homed collapsed-core enterprise campus topology."
    ],
    commands: [
      "tracert 10.0.0.1",
      "arp -a",
      "route print"
    ],
    expectedObservations: [
      "Hop count and transit latency across campus topology backbone",
      "Active default gateway Layer 2 MAC address in ARP table",
      "Directly connected vs routed network destinations in kernel routing table"
    ],
    hints: [
      "In a Star topology, failure of the central switch disconnects all nodes; mesh provides multiple paths.",
      "Redundant links in Ethernet topologies require STP to prevent broadcast storms."
    ],
    completionCriteria: "Topology architecture and single-point-of-failure analysis verified.",
    solution: {
      steps: [
        "Step 1: Trace route to campus core gateway using `tracert`.",
        "Step 2: Inspect default gateway MAC binding in ARP cache.",
        "Step 3: Analyze routing table metrics for primary and backup default routes."
      ]
    }
  },

  "net-102-bandwidth-throughput-latency-jitter": {
    title: "Guided Engineering Practice: Bandwidth, Throughput, Latency & Jitter Measurement",
    instructions: "Measure fundamental transmission channel characteristics: differentiate theoretical bandwidth from application throughput, propagation delay, and jitter.",
    tasks: [
      "Measure raw channel capacity (Bandwidth) vs achieved data transfer rate (Throughput) across 1 Gbps LAN links.",
      "Calculate cumulative propagation delay (Dprop = Distance / (2 * 10^8 m/s)) across WAN fiber spans.",
      "Evaluate packet jitter variance and its disruptive impact on real-time UDP VoIP/RTP voice streams."
    ],
    commands: [
      "ping -n 50 192.168.1.1",
      "tracert 8.8.8.8",
      "netstat -s"
    ],
    expectedObservations: [
      "Mean RTT latency and jitter variance (Max RTT - Min RTT)",
      "Multi-hop WAN latency progression",
      "TCP transport throughput counters and retransmission statistics"
    ],
    hints: [
      "Bandwidth is the maximum possible theoretical bit rate; throughput is the actual payload delivered per second.",
      "Jitter above 30 ms causes noticeable audio degradation and packet loss in VoIP communications."
    ],
    completionCriteria: "Performance metrics and latency/jitter calculations verified.",
    solution: {
      steps: [
        "Step 1: Execute `ping -n 50 192.168.1.1` and compute jitter variance.",
        "Step 2: Trace WAN hop latency using `tracert 8.8.8.8`.",
        "Step 3: Inspect cumulative TCP segment delivery statistics with `netstat -s`."
      ]
    }
  },

  "level-0-mac-addresses-physical-identity": {
    title: "Guided Engineering Practice: Layer 2 MAC Address Architecture & OUI Dissection",
    instructions: "Dissect 48-bit Media Access Control (MAC) hardware addresses: analyze Organizationally Unique Identifier (OUI) prefixes, I/G bit, and U/L bit.",
    tasks: [
      "Extract 48-bit Media Access Control (MAC) hardware addresses using `getmac /v`.",
      "Dissect the 24-bit Organizationally Unique Identifier (OUI) vendor prefix and 24-bit NIC extension identifier.",
      "Inspect the Individual/Group (I/G) multicast bit and Universal/Local (U/L) bit in Layer 2 MAC addresses."
    ],
    commands: [
      "getmac /v",
      "ipconfig /all",
      "arp -a"
    ],
    expectedObservations: [
      "Physical MAC address in hexadecimal notation (e.g. 00-1A-2B-3C-4D-5E)",
      "Network adapter hardware device name and transport name",
      "Dynamic and static Layer 2 MAC addresses resolved in ARP cache"
    ],
    hints: [
      "The first 3 bytes (24 bits) of a MAC address are the IEEE-assigned OUI; the last 3 bytes are assigned by the manufacturer.",
      "Bit 0 of byte 0 is the I/G bit: 0 = Individual (Unicast), 1 = Group (Multicast/Broadcast)."
    ],
    completionCriteria: "MAC address dissection and OUI prefix verification completed.",
    solution: {
      steps: [
        "Step 1: Execute `getmac /v` to inspect physical adapter MAC addresses.",
        "Step 2: Isolate the first 24 bits to identify the hardware vendor OUI.",
        "Step 3: Check `arp -a` to view broadcast (FF-FF-FF-FF-FF-FF) and unicast neighbor MACs."
      ]
    }
  },

  "ethernet-mac-addresses-overview": {
    title: "Guided Engineering Practice: Ethernet II Framing, Preamble & EtherType Demultiplexing",
    instructions: "Analyze IEEE 802.3 Ethernet II framing mechanics: inspect 14-byte MAC headers, EtherType protocol demultiplexing, and 64-byte minimum frame padding.",
    tasks: [
      "Dissect the IEEE 802.3 Ethernet II frame structure: 7-byte Preamble, 1-byte SFD, 14-byte Header, and 4-byte FCS.",
      "Verify 0x0800 (IPv4), 0x86DD (IPv6), and 0x0806 (ARP) EtherType field demultiplexing.",
      "Inspect minimum frame size padding (64 bytes) and Frame Check Sequence (CRC-32) error detection."
    ],
    commands: [
      "netsh interface ipv4 show interfaces",
      "arp -a",
      "ping 192.168.1.1"
    ],
    expectedObservations: [
      "Ethernet interface MTU (1500) and link operational state",
      "EtherType 0x0806 ARP resolution table entries",
      "EtherType 0x0800 IPv4 ICMP frame transmission"
    ],
    hints: [
      "Ethernet frames smaller than 64 bytes are illegal runts and get padded with zeros up to 64 bytes.",
      "EtherType 0x0800 signals that the frame payload contains an IPv4 packet; 0x86DD indicates IPv6."
    ],
    completionCriteria: "Ethernet II framing fields and EtherType demultiplexing verified.",
    solution: {
      steps: [
        "Step 1: Inspect interface link metrics with `netsh interface ipv4 show interfaces`.",
        "Step 2: Observe ARP frame resolution with `arp -a`.",
        "Step 3: Verify IPv4 frame delivery with ICMP ping."
      ]
    }
  },

  "level-0-switches-local-lan-forwarders": {
    title: "Guided Engineering Practice: Transparent Bridging & MAC Address Learning",
    instructions: "Observe Layer 2 switch forwarding behavior: audit dynamic CAM table learning, Unknown Unicast Flooding, and CAM aging timers.",
    tasks: [
      "Audit Transparent Bridging: observe dynamic MAC address table learning as source MACs arrive on switchports.",
      "Analyze Unknown Unicast Flooding behavior when a destination MAC address is not present in the CAM table.",
      "Inspect MAC table aging timers (default 300 seconds) and CAM table capacity limits."
    ],
    commands: [
      "arp -a",
      "ping 192.168.1.1"
    ],
    expectedObservations: [
      "Dynamic ARP table mapping reflecting switchport MAC discovery",
      "Successful unicast delivery following transparent bridging learning",
      "Zero packet loss once MAC table entry is established"
    ],
    hints: [
      "Switches learn source MAC addresses from incoming frames and filter/forward based on destination MAC addresses.",
      "When a destination MAC is not in the CAM table, the switch floods the frame out all ports in the VLAN except the ingress port."
    ],
    completionCriteria: "Switch transparent bridging and MAC address table dynamics verified.",
    solution: {
      steps: [
        "Step 1: Check ARP table before transmission to verify cache state.",
        "Step 2: Ping destination to generate frame traffic through the switch.",
        "Step 3: Verify dynamic entry creation in neighbor table."
      ]
    }
  },

  "level-0-ip-addresses-logical-location": {
    title: "Guided Engineering Practice: IPv4 Addressing, RFC 1918 Private Ranges & APIPA",
    instructions: "Audit host Layer 3 logical addressing: distinguish public routable addresses from private RFC 1918 blocks and Automatic Private IP Addressing (APIPA).",
    tasks: [
      "Inspect 32-bit IPv4 address hierarchical split between Network Portion and Host Portion using subnet masks.",
      "Identify private RFC 1918 address allocations (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16).",
      "Verify Automatic Private IP Addressing (APIPA 169.254.0.0/16) link-local isolation behavior."
    ],
    commands: [
      "ipconfig /all",
      "route print",
      "ping 127.0.0.1"
    ],
    expectedObservations: [
      "Network adapter IPv4 address and subnet mask classification",
      "Private RFC 1918 IP address assignment",
      "Loopback 127.0.0.1 internal stack response"
    ],
    hints: [
      "RFC 1918 reserves 10.0.0.0/8 (Class A), 172.16.0.0/12 (Class B), and 192.168.0.0/16 (Class C) for private networks.",
      "APIPA addresses (169.254.x.x) are non-routable link-local addresses used when DHCP servers are unreachable."
    ],
    completionCriteria: "Logical IPv4 address allocation and subnet mask boundaries verified.",
    solution: {
      steps: [
        "Step 1: Run `ipconfig /all` and determine whether the IP is public or RFC 1918 private.",
        "Step 2: Inspect default gateway route in `route print`.",
        "Step 3: Confirm loopback adapter functionality with `ping 127.0.0.1`."
      ]
    }
  },

  "net-101-copper-fiber-wireless-media": {
    title: "Analytical Media Lab: Copper Cabling, Optical Fiber & RF Propagation",
    instructions: "Evaluate physical layer transmission media specifications, fiber optic modal dispersion, and Power over Ethernet standards.",
    tasks: [
      "Compare transmission physical media: Category 5e/6/6A Unshielded Twisted Pair (UTP) vs Shielded (STP).",
      "Evaluate Single-Mode Fiber (9/125 um core, laser light source, 1310/1550 nm) vs Multi-Mode Fiber (50/125 um core, VCSEL light, 850 nm).",
      "Analyze Power over Ethernet standards (802.3af 15.4W, 802.3at PoE+ 30W, 802.3bt Type 4 90W) and attenuation limits."
    ],
    commands: [],
    expectedObservations: [
      "Copper vs fiber physical media attenuation and distance specification table",
      "Single-mode vs multi-mode core diameter and wavelength comparison diagram"
    ],
    hints: [
      "Copper UTP has a strict 100-meter channel limit; Single-Mode Fiber can span 40+ km without repeaters.",
      "PoE injects DC voltage over unused twisted pairs or phantom power over data pairs in Cat5e/6."
    ],
    completionCriteria: "Physical media comparison matrix verified against TIA/EIA-568 and IEEE 802.3 standards.",
    solution: {
      steps: [
        "Step 1: Correlate cable categories (Cat5e, Cat6, Cat6A) with maximum frequencies and 10G distance limits.",
        "Step 2: Compare SMF laser light propagation with MMF modal dispersion.",
        "Step 3: Calculate PoE wattage budgets across switch access ports."
      ]
    }
  },

  "osi-model-7-layers": {
    title: "Protocol Stack Dissection: OSI 7-Layer Reference Model & Encapsulation",
    instructions: "Examine the 7 layers of the OSI model, protocol data units (PDUs), and bidirectional encapsulation/decapsulation.",
    tasks: [
      "Map network protocols and hardware devices to their respective OSI operating layers (Layers 1 through 7).",
      "Trace PDU encapsulation: Data -> Segment (L4) -> Packet (L3) -> Frame (L2) -> Bits (L1).",
      "Analyze Layer 2 framing trailers (FCS/CRC-32) and Layer 3 IP header checksum verification mechanics."
    ],
    commands: [],
    expectedObservations: [
      "7-layer OSI encapsulation and decapsulation walkthrough",
      "Protocol Data Unit (PDU) header and trailer byte boundaries"
    ],
    hints: [
      "Application, Presentation, Session layers deal with user data; Transport handles segments; Network handles packets; Data Link handles frames; Physical transmits bits.",
      "Only Layer 2 adds both a header AND a trailer (FCS) during encapsulation."
    ],
    completionCriteria: "OSI 7-layer encapsulation model verified against ISO/IEC 7498-1.",
    solution: {
      steps: [
        "Step 1: Categorize protocols (HTTP L7, TCP L4, IP L3, Ethernet L2) by OSI layer.",
        "Step 2: Trace top-down encapsulation on transmission and bottom-up decapsulation on reception.",
        "Step 3: Analyze trailer CRC-32 error detection at Layer 2."
      ]
    }
  },

  "tcp-ip-4-layers": {
    title: "Comparative Model Architecture: TCP/IP 4-Layer Stack & OSI Alignment",
    instructions: "Analyze the 4-layer DoD / TCP/IP model, conceptual mapping to the 7-layer OSI model, and modern Internet protocol stacks.",
    tasks: [
      "Correlate TCP/IP layers (Application, Transport, Internet, Network Access) with OSI 7-layer equivalents.",
      "Analyze protocol multiplexing across layers using EtherType (0x0800), IP Protocol (6=TCP, 17=UDP), and Port numbers.",
      "Evaluate design rationale for combining OSI layers 5-7 into the single TCP/IP Application layer."
    ],
    commands: [],
    expectedObservations: [
      "TCP/IP vs OSI structural mapping diagram",
      "Multiplexing identifier chain (EtherType -> Protocol -> Port)"
    ],
    hints: [
      "The TCP/IP Network Access layer corresponds to OSI Layers 1 and 2; Application layer corresponds to OSI Layers 5, 6, and 7.",
      "Encapsulation headers use multiplexing tags: EtherType in L2, Protocol number in L3, Port number in L4."
    ],
    completionCriteria: "TCP/IP 4-layer architecture verified against RFC 1122 specifications.",
    solution: {
      steps: [
        "Step 1: Map 4-layer TCP/IP architecture onto the 7-layer OSI model.",
        "Step 2: Trace multiplexing demultiplexing keys through packet headers.",
        "Step 3: Evaluate monolithic socket design in application layer protocols."
      ]
    }
  },

  "net-101-bits-bytes-binary-hex": {
    title: "Mathematical Foundations Lab: Positional Notation, Binary Octets & Hex Nibbles",
    instructions: "Construct binary positional weighting tables, convert subnet mask octets, and translate between binary nibbles and hexadecimal.",
    tasks: [
      "Construct 8-bit binary positional value tables (2^7 through 2^0) and convert decimal subnet octets (128, 192, 224, 240, 248, 252, 254, 255).",
      "Convert 4-bit binary nibbles into hexadecimal characters (0-9, A-F) for MAC addresses and IPv6 blocks.",
      "Calculate prefix bit boundary shifts for VLSM subnetting across /24 through /30 networks."
    ],
    commands: [],
    expectedObservations: [
      "8-bit positional power-of-two table (128, 64, 32, 16, 8, 4, 2, 1)",
      "Hexadecimal nibble translation chart (0000=0 through 1111=F)",
      "CIDR slash notation to decimal subnet mask conversion table"
    ],
    hints: [
      "Subnet masks must consist of contiguous ones followed by contiguous zeros (e.g. 11111111 = 255, 11000000 = 192).",
      "One hexadecimal character represents exactly 4 binary bits (one nibble)."
    ],
    completionCriteria: "Binary positional table and hex conversion verified.",
    solution: {
      steps: [
        "Step 1: Sum positional values for binary 11110000 = 128 + 64 + 32 + 16 = 240.",
        "Step 2: Group 8 bits into two 4-bit nibbles and convert each to hex.",
        "Step 3: Correlate /24 through /30 prefix lengths with subnet mask octets."
      ]
    }
  },

  "network-devices-overview": {
    title: "Device Architecture Lab: Hardware Roles, Collision Domains & Broadcast Boundaries",
    instructions: "Evaluate enterprise network device hardware: compare Layer 1 repeaters, Layer 2 switches, Layer 3 routers, and perimeter firewalls.",
    tasks: [
      "Differentiate Layer 1 Repeaters/Hubs (single collision domain, half-duplex) from Layer 2 Switches (per-port collision domain, full-duplex).",
      "Analyze Layer 3 Router routing engines and broadcast domain isolation boundaries.",
      "Compare Stateful Inspection Firewalls, Intrusion Prevention Systems (IPS), and Wireless Access Points (WAPs)."
    ],
    commands: [],
    expectedObservations: [
      "Device comparison matrix detailing operating OSI layer, collision domain impact, and broadcast domain boundaries",
      "Hardware ASIC switching vs software CPU routing architecture diagram"
    ],
    hints: [
      "Hubs share bandwidth across all ports; switches dedicate full wire speed per port using dedicated hardware ASICs.",
      "Firewalls enforce security zoning (Inside, Outside, DMZ) and inspect Layer 4-7 protocol state."
    ],
    completionCriteria: "Hardware device role matrix verified against enterprise architecture standards.",
    solution: {
      steps: [
        "Step 1: Classify hubs, switches, routers, and firewalls by OSI layer.",
        "Step 2: Map collision domain and broadcast domain boundaries for a 3-tier campus network.",
        "Step 3: Analyze stateful inspection firewall placement in edge demarcations."
      ]
    }
  },

  "net-202-ipv4-addressing-cidr": {
    title: "Engineering Simulation: Router Interface IPv4 Addressing & CIDR Configuration",
    instructions: "Configure router interface IPv4 addressing using Cisco IOS CLI: set IP address and CIDR subnet mask, enable interface, and verify operational state.",
    tasks: [
      "Configure router interface IP address and subnet mask on GigabitEthernet0/0 (`ip address 192.168.1.1 255.255.255.0`).",
      "Verify interface operational status transitions to up/up (`show ip interface brief`).",
      "Ping directly connected subnet host and verify ICMP connectivity."
    ],
    commands: [
      "configure terminal",
      "interface GigabitEthernet0/0",
      "ip address 192.168.1.1 255.255.255.0",
      "no shutdown",
      "show ip interface brief",
      "ping 192.168.1.1"
    ],
    expectedObservations: [
      "Interface GigabitEthernet0/0 IP address configured to 192.168.1.1",
      "Status 'up' and Protocol 'up' in `show ip interface brief`",
      "Successful ping response (5/5 packets) confirming local interface health"
    ],
    hints: [
      "In Cisco IOS, `no shutdown` brings an interface administratively up.",
      "A /24 subnet corresponds to subnet mask 255.255.255.0."
    ],
    completionCriteria: "Router interface IP addressing and up/up status verified.",
    solution: {
      steps: [
        "Step 1: Enter config mode with `configure terminal`.",
        "Step 2: Select interface with `interface GigabitEthernet0/0`.",
        "Step 3: Assign IP with `ip address 192.168.1.1 255.255.255.0`.",
        "Step 4: Enable interface with `no shutdown` and verify with `show ip interface brief`."
      ]
    }
  },

  "subnetting-cidr-overview": {
    title: "Engineering Simulation: Point-to-Point /30 WAN Subnet Configuration",
    instructions: "Configure and verify a point-to-point /30 WAN link on router interface GigabitEthernet0/1: calculate host range, configure 255.255.255.252 mask, and verify route installation.",
    tasks: [
      "Configure point-to-point /30 WAN subnet on GigabitEthernet0/1 (`ip address 10.0.0.1 255.255.255.252`).",
      "Verify /30 host address boundaries: Network ID 10.0.0.0, Usable Hosts 10.0.0.1-10.0.0.2, Broadcast 10.0.0.3.",
      "Inspect router routing table to confirm installation of directly connected /30 subnet route."
    ],
    commands: [
      "configure terminal",
      "interface GigabitEthernet0/1",
      "ip address 10.0.0.1 255.255.255.252",
      "no shutdown",
      "show ip route",
      "ping 10.0.0.1"
    ],
    expectedObservations: [
      "GigabitEthernet0/1 assigned 10.0.0.1/30",
      "Connected route '10.0.0.0/30 is directly connected, GigabitEthernet0/1' in routing table",
      "Local route '10.0.0.1/32 is directly connected' confirming host route installation"
    ],
    hints: [
      "A /30 subnet provides exactly 2 usable host addresses (2^(32-30) - 2 = 2), ideal for router-to-router WAN links.",
      "Subnet mask for /30 is 255.255.255.252."
    ],
    completionCriteria: "/30 WAN subnet addressing and routing table installation verified.",
    solution: {
      steps: [
        "Step 1: Enter interface config for GigabitEthernet0/1.",
        "Step 2: Configure `ip address 10.0.0.1 255.255.255.252`.",
        "Step 3: Run `no shutdown` and verify route in `show ip route`."
      ]
    }
  },

  "arp-protocol-overview": {
    title: "Engineering Simulation: Address Resolution Protocol (ARP) Cache Operations",
    instructions: "Audit Layer 2 to Layer 3 address binding: inspect the router ARP cache, trigger dynamic ARP resolution via ping, and verify IP-to-MAC mapping.",
    tasks: [
      "Inspect local ARP cache on router using `show arp`.",
      "Ping directly connected host 192.168.1.1 to verify Layer 2 ARP resolution and ICMP response.",
      "Verify that the router ARP table accurately maps IP addresses to physical MAC addresses and egress interfaces."
    ],
    commands: [
      "show arp",
      "ping 192.168.1.1",
      "show ip interface brief"
    ],
    expectedObservations: [
      "ARP table entry mapping IP 192.168.1.1 to hardware MAC address",
      "Encapsulation ARPA on interface GigabitEthernet0/0",
      "100% ICMP ping response"
    ],
    hints: [
      "ARP resolves known Layer 3 IPv4 addresses to unknown Layer 2 MAC addresses.",
      "The ARP cache automatically caches resolved bindings to eliminate repeated broadcast queries."
    ],
    completionCriteria: "Router ARP cache mapping and resolution verified.",
    solution: {
      steps: [
        "Step 1: Run `show arp` to display current ARP table entries.",
        "Step 2: Execute `ping 192.168.1.1` to generate network traffic.",
        "Step 3: Re-run `show arp` and confirm the hardware MAC binding is present."
      ]
    }
  },

  "dhcp-dns-overview": {
    title: "Engineering Simulation: Host Gateway Resolution & Core Network Services Audit",
    instructions: "Audit router core infrastructure services: verify default gateway IP routing, interface bindings, and route connectivity across simulated subnets.",
    tasks: [
      "Inspect router interface default gateway and subnet bindings with `show ip interface brief`.",
      "Audit the routing table for default and connected routes with `show ip route`.",
      "Verify bidirectional packet reachability across router interfaces."
    ],
    commands: [
      "show ip interface brief",
      "show ip route",
      "ping 192.168.1.1"
    ],
    expectedObservations: [
      "All active router interfaces reported up/up with assigned IP addresses",
      "Connected routes present in RIB with Administrative Distance 0",
      "Successful ICMP ping confirmation"
    ],
    hints: [
      "`show ip interface brief` provides immediate high-level interface status and IP bindings.",
      "`show ip route` displays all installed routing paths."
    ],
    completionCriteria: "Core router interface addressing and route installation verified.",
    solution: {
      steps: [
        "Step 1: Run `show ip interface brief` and verify IP assignments.",
        "Step 2: Run `show ip route` and verify connected routes.",
        "Step 3: Ping interface IP to confirm operational status."
      ]
    }
  },

  "net-305-standard-extended-ipv4-acls": {
    title: "Engineering Simulation: Standard & Extended IPv4 Access Control Lists",
    instructions: "Configure and apply extended IPv4 Access Control Lists (ACL 101): permit secure HTTPS web traffic, deny unauthorized subnets, and apply to router interfaces.",
    tasks: [
      "Configure extended access-list 101 permitting TCP port 443 (HTTPS) from 192.168.1.0/24 to any.",
      "Configure extended access-list 101 denying all other IP traffic with explicit logging.",
      "Apply access-group 101 inbound on GigabitEthernet0/0 and verify hit counters with `show access-lists`."
    ],
    commands: [
      "access-list 101 permit tcp 192.168.1.0 0.0.0.255 any eq 443",
      "access-list 101 deny ip any any",
      "interface GigabitEthernet0/0",
      "ip access-group 101 in",
      "show access-lists"
    ],
    expectedObservations: [
      "Extended IP access list 101 configured with permit and deny statements",
      "Access-group 101 applied inbound on GigabitEthernet0/0",
      "`show access-lists` displaying matching rules and hit counts"
    ],
    hints: [
      "Extended ACLs (100-199) evaluate source IP, destination IP, protocol, and port numbers.",
      "Remember that an implicit deny any exists at the bottom of every ACL."
    ],
    completionCriteria: "Extended ACL 101 configuration and interface binding verified.",
    solution: {
      steps: [
        "Step 1: Configure `access-list 101 permit tcp 192.168.1.0 0.0.0.255 any eq 443`.",
        "Step 2: Configure `access-list 101 deny ip any any`.",
        "Step 3: Enter interface config and apply `ip access-group 101 in`.",
        "Step 4: Verify with `show access-lists`."
      ]
    }
  },

  "firewalls-acls-overview": {
    title: "Engineering Simulation: DMZ Perimeter Zoning & Filtering Architecture",
    instructions: "Configure perimeter network security zoning: implement packet filtering rules to protect internal LAN subnets while permitting public access to DMZ web servers.",
    tasks: [
      "Configure perimeter zoning: designate Inside LAN interface, Outside WAN interface, and DMZ Server interface.",
      "Configure access-list 102 permitting HTTP port 80 traffic to public DMZ server 10.0.0.50 while blocking access to internal LAN.",
      "Verify that traffic between untrusted Outside and trusted Inside is strictly dropped by perimeter filters."
    ],
    commands: [
      "access-list 102 permit tcp any host 10.0.0.50 eq 80",
      "access-list 102 deny ip any 192.168.1.0 0.0.0.255",
      "interface GigabitEthernet0/1",
      "ip access-group 102 in",
      "show access-lists"
    ],
    expectedObservations: [
      "Access list 102 permitting public HTTP to DMZ host 10.0.0.50",
      "Explicit deny rule dropping unauthorized traffic destined to internal 192.168.1.0/24 LAN",
      "Access group bound inbound on perimeter Outside interface GigabitEthernet0/1"
    ],
    hints: [
      "A Demilitarized Zone (DMZ) houses public-facing services (web, mail) isolated from internal LAN assets.",
      "Never permit untrusted outside traffic direct access to internal subnets."
    ],
    completionCriteria: "DMZ perimeter zoning and isolation filter rules verified.",
    solution: {
      steps: [
        "Step 1: Configure `access-list 102 permit tcp any host 10.0.0.50 eq 80`.",
        "Step 2: Configure `access-list 102 deny ip any 192.168.1.0 0.0.0.255`.",
        "Step 3: Apply `ip access-group 102 in` to outside interface GigabitEthernet0/1.",
        "Step 4: Verify with `show access-lists`."
      ]
    }
  }
};

async function applyLabRemediations() {
  console.log('=== Remediation of Curriculum Labs Boilerplate & Duplication ===');

  let updatedCount = 0;
  for (const [slug, remediation] of Object.entries(LAB_REMEDIATIONS)) {
    if (ALL_CURRICULUM_LABS[slug]) {
      Object.assign(ALL_CURRICULUM_LABS[slug], remediation);
      updatedCount++;
      console.log(`  ✓ Remediated lab: ${slug}`);
    } else {
      console.warn(`  ⚠️ Lab not found in catalog: ${slug}`);
    }
  }

  console.log(`\nUpdated ${updatedCount} labs with curriculum-aligned, unique pedagogical content.`);

  // Write updated ALL_CURRICULUM_LABS back to curriculum-labs-catalog.ts
  const catalogPath = path.resolve(__dirname, '../src/topics/curriculum-labs-catalog.ts');
  const fileContent = `/**
 * NETVISION AUTHORITATIVE CURRICULUM LABS CATALOG
 *
 * Grounded in CS-221 Textbook Architecture.
 * 46 Flagship Labs classified into:
 *  - 18 Tier-1 Engineering Simulation Labs (State-mutation, CLI commands, deterministic validation)
 *  - 21 Tier-2 Guided Engineering Practice Labs (Operational telemetry, socket/protocol diagnostics)
 *  - 7 Tier-3 Conceptual Exploration Labs (Foundational theoretical/framing analysis, no artificial CLI)
 */

import { CourseLevel } from '@prisma/client';
import { BenchmarkLabDef } from './lessons-net300-400';

export const ALL_CURRICULUM_LABS: Record<string, BenchmarkLabDef> = ${JSON.stringify(ALL_CURRICULUM_LABS, null, 2)};
`;

  fs.writeFileSync(catalogPath, fileContent, 'utf-8');
  console.log(`Successfully written remediated catalog to ${catalogPath}`);
}

applyLabRemediations().catch(err => {
  console.error(err);
  process.exit(1);
});

import { ElevatedQuestionDef } from './elevated-part1-net100';

export const ELEVATED_PART4_NET400: ElevatedQuestionDef[] = [
  // 1. quiz-nat-pat-overview (1)
  {
    quizId: "quiz-nat-pat-overview",
    concept: "Inside Local vs Inside Global Addresses",
    options: [
      "Inside Local is the private IP on the LAN; Inside Global is the public routable IP representing that host to the external Internet",
      "Inside Local is the MAC address of the workstation; Inside Global is the IP address of the ISP recursive DNS nameserver",
      "Inside Local is the loopback address 127.0.0.1; Inside Global is the IPv6 link-local address assigned by SLAAC autoconfiguration",
      "Inside Local is the default gateway IP; Inside Global is the broadcast address 255.255.255.255 across all subnets"
    ],
    explanationsJson: {
      1: "Inside Local and Inside Global are both Layer 3 IPv4 addresses, not Layer 2 MAC addresses or DNS nameservers.",
      2: "Inside Local is the host's actual RFC 1918 private address (e.g. 192.168.1.50), not internal loopback 127.0.0.1.",
      3: "The default gateway is the router interface IP; Inside Global is the translated public address assigned during NAT."
    }
  },

  // 2. quiz-nat-pat-overview (2)
  {
    quizId: "quiz-nat-pat-overview",
    concept: "PAT Port Multiplexing Mechanics",
    options: [
      "By establishing dedicated physical fiber optic links between each internal host and the remote destination web server",
      "By tracking each session with a unique Layer 4 source port number mapped in the NAT translation state table",
      "By stripping the Layer 3 IP header and forwarding raw Layer 2 Ethernet frames across the public Internet WAN circuit",
      "By forcing all internal workstations to share the exact same TCP sequence number across every concurrent connection"
    ],
    explanationsJson: {
      0: "PAT is a software translation mechanism sharing a single IP; it does not deploy separate physical circuits per host.",
      2: "Packets traversing the Internet require full Layer 3 IP headers with globally routable source and destination addresses.",
      3: "TCP sequence numbers are randomized and tracked independently per session to maintain stream integrity."
    }
  },

  // 3. quiz-nat-pat-overview (3)
  {
    quizId: "quiz-nat-pat-overview",
    concept: "Hairpinning / NAT Loopback Functionality",
    options: [
      "It commands the router to restart its internal DHCP service whenever an internal host accesses external web resources",
      "It allows an internal host on the LAN to access an internal server using the server's public IP address via router translation reflection",
      "It forces all wireless client devices to disconnect and reconnect using wired copper Ethernet connections",
      "It automatically doubles the physical bandwidth of the WAN circuit by bonding multiple cellular SIM connections"
    ],
    explanationsJson: {
      0: "Hairpinning handles packet address rewriting; it does not restart DHCP daemons or disrupt IP leases.",
      2: "Hairpinning is a Layer 3 NAT routing feature and does not force clients to switch physical media.",
      3: "Bandwidth bonding is handled by SD-WAN or link aggregation, not by NAT loopback reflection."
    }
  },

  // 4. quiz-vpn-cryptography-overview
  {
    quizId: "quiz-vpn-cryptography-overview",
    concept: "IPsec IKE Phase 1 vs Phase 2 Scope",
    options: [
      "IKE Phase 1 establishes a secure management tunnel between peers; IKE Phase 2 negotiates the IPsec SAs that protect actual data traffic",
      "IKE Phase 1 assigns private IP addresses via DHCP; IKE Phase 2 encrypts physical layer bits using optical polarization",
      "IKE Phase 1 routes packets using OSPF; IKE Phase 2 translates private IPv4 addresses to public IPs using NAT overload",
      "IKE Phase 1 checks physical cable continuity; IKE Phase 2 verifies client user passwords against an Active Directory server"
    ],
    explanationsJson: {
      1: "IPsec operates at Layer 3 to secure IP packets; it does not assign DHCP leases or alter optical physical properties.",
      2: "Routing and NAT are independent network functions; IKE Phase 1 and 2 specifically manage cryptographic security associations.",
      3: "Physical testing and user authentication are handled by cabling tools and 802.1X/RADIUS, not the IKE tunnel negotiation phases."
    }
  },

  // 5. quiz-wireless-networking-overview (1)
  {
    quizId: "quiz-wireless-networking-overview",
    concept: "WPA3 SAE vs WPA2 PSK Security",
    options: [
      "WPA3 mandates a 4096-bit pre-installed hardware certificate on client devices and eliminates pre-shared keys across all access points",
      "WPA3 encrypts the pre-shared key inside a Diffie-Hellman Key Exchange without altering the vulnerable 4-way handshake message flow",
      "WPA3 enforces strict MAC address filtering on all wireless beacons and drops probe requests from unauthorized client network cards",
      "WPA3 replaces the vulnerable 4-way PSK handshake with Simultaneous Authentication of Equals (SAE / Dragonfly handshake), providing forward secrecy and rendering offline dictionary / brute-force password cracking attacks impossible"
    ],
    explanationsJson: {
      0: "WPA3-Personal uses standard alphanumeric passwords via SAE; pre-installed client certificates are used in WPA3-Enterprise (802.1X).",
      1: "WPA3 replaces the 4-way handshake completely with SAE zero-knowledge proofs, rather than wrapping the legacy handshake.",
      2: "MAC filtering is easily bypassed by spoofing MAC addresses and does not provide cryptographic password protection."
    }
  },

  // 6. quiz-wireless-networking-overview (2)
  {
    quizId: "quiz-wireless-networking-overview",
    concept: "2.4 GHz vs 5 GHz Spectrum Tradeoffs",
    options: [
      "2.4 GHz has better physical obstacle penetration and range but fewer non-overlapping channels (1, 6, 11) and higher interference; 5 GHz has higher bandwidth and more channels but shorter range",
      "2.4 GHz transmits optical signals through glass; 5 GHz transmits electrical current through copper twisted-pair cabling",
      "2.4 GHz operates exclusively in full-duplex mode without collisions; 5 GHz is restricted to half-duplex CSMA/CD operation",
      "2.4 GHz requires high-voltage commercial electrical power; 5 GHz operates entirely on low-voltage ambient solar energy"
    ],
    explanationsJson: {
      1: "Both 2.4 GHz and 5 GHz are Radio Frequency (RF) electromagnetic bands transmitted through air via wireless antennas.",
      2: "All standard Wi-Fi transmissions (802.11a/b/g/n/ac/ax) operate in half-duplex using CSMA/CA collision avoidance.",
      3: "Both bands operate from standard Access Point power supplies (PoE 802.3af/at delivering ~15-30 watts)."
    }
  },

  // 7. quiz-network-troubleshooting-overview (1)
  {
    quizId: "quiz-network-troubleshooting-overview",
    concept: "ICMP Unreachable vs Timeout Diagnosis",
    options: [
      "\"Destination Host Unreachable\" means an intermediate router on the path actively responded with an ICMP Type 3 error indicating it has no route or ARP failed; \"Request Timed Out\" means the packet was forwarded but no response was received before the timer expired",
      "\"Destination Host Unreachable\" means the workstation network card is unplugged; \"Request Timed Out\" means the hard drive is full",
      "\"Destination Host Unreachable\" indicates a successful connection; \"Request Timed Out\" indicates an invalid user password",
      "\"Destination Host Unreachable\" means DNS resolution succeeded; \"Request Timed Out\" means the default gateway crashed"
    ],
    explanationsJson: {
      1: "Unreachable and timeout are network layer diagnostic telemetry, not local hardware power or disk capacity errors.",
      2: "Neither message indicates a successful connection; both indicate packet delivery failure at different stages.",
      3: "Unreachable is an active router ICMP response; timeout is a silent drop where no device returned an error."
    }
  },

  // 8. quiz-network-troubleshooting-overview (2)
  {
    quizId: "quiz-network-troubleshooting-overview",
    concept: "MTU Black Hole & MSS Clamping Diagnosis",
    options: [
      "The TCP window size is set to zero by the receiving host, causing transmit buffers to stall without sending TCP reset segments",
      "The local default gateway has ARP cache poisoning where two routers advertise conflicting MAC addresses for the next hop",
      "DNS resolution timeout: the recursive resolver drops UDP port 53 packets exceeding 512 bytes due to missing EDNS0 extension support",
      "Path MTU Discovery (PMTUD) failure / MTU Black Hole: IPsec header encapsulation overhead causes packets to exceed physical MTU (1500 bytes), and an intermediate router is silently dropping packets with DF=1 without returning ICMP Fragmentation Needed messages"
    ],
    explanationsJson: {
      0: "TCP ZeroWindow occurs during application buffer exhaustion, not specifically triggered by VPN tunneling of large packets.",
      1: "ARP cache poisoning causes intermittent or complete connectivity loss across all packet sizes, not selective large packet stalls.",
      2: "DNS resolution fails on domain queries, whereas MTU black holes allow handshakes to complete but stall during file transfers."
    }
  },

  // 9. quiz-sdn-cloud-networking-overview (1)
  {
    quizId: "quiz-sdn-cloud-networking-overview",
    concept: "SDN Control Plane vs Data Plane Decoupling",
    options: [
      "The decoupling of the Control Plane (routing decision logic and policy) from the Data/Forwarding Plane (high-speed hardware packet switching ASICs), centralizing control in a programmable SDN controller",
      "The replacement of all physical fiber optic cabling with wireless radio frequency links connecting cloud data centers",
      "The elimination of Layer 3 IP addresses by hardcoding physical MAC addresses directly into public cloud web servers",
      "The separation of electrical AC utility power from DC server battery backup systems in enterprise data center facilities"
    ],
    explanationsJson: {
      1: "Cloud data centers rely heavily on dense optical fiber inter-datacenter backbones; SDN does not replace fiber with wireless.",
      2: "Cloud networking depends extensively on Layer 3 IP routing and overlay encapsulation (e.g. VXLAN, Geneve).",
      3: "Power distribution is facilities infrastructure, completely distinct from network control and data plane architecture."
    }
  },

  // 10. quiz-sdn-cloud-networking-overview (2)
  {
    quizId: "quiz-sdn-cloud-networking-overview",
    concept: "Cloud Security Groups vs Subnet NACLs",
    options: [
      "Security Groups inspect physical fiber optic light pulses; NACLs inspect copper electrical voltages across server backplanes",
      "Security Groups are deployed on external internet service provider routers; NACLs are deployed on client desktop operating systems",
      "Security Groups encrypt all database payloads with RSA keys; NACLs compress web traffic using gzip compression algorithms",
      "Security Groups are Stateful firewalls applied at the virtual network interface (ENI/VM) level; NACLs are Stateless firewalls applied at the Subnet boundary level"
    ],
    explanationsJson: {
      0: "Cloud security constructs operate on virtual network interfaces and VPC subnets, not physical layer PHY signaling.",
      1: "Both Security Groups and NACLs are managed within the cloud customer's Virtual Private Cloud (VPC), not on external ISP routers.",
      2: "Security Groups and NACLs are network traffic packet filters; they do not perform payload encryption or gzip compression."
    }
  },

  // 11. quiz-net-404-wireshark-packet-capture (1)
  {
    quizId: "quiz-net-404-wireshark-packet-capture",
    concept: "Wireshark TCP Flag Filtering",
    options: [
      "tcp.flags.syn == 1 && tcp.flags.ack == 0",
      "ip.addr == 192.168.1.1 && eth.type == 0x0800",
      "tcp.port == 80 || tcp.port == 443",
      "frame.len > 1500 && icmp.type == 8"
    ],
    explanationsJson: {
      1: "Filters on IP address and IPv4 EtherType, not TCP SYN connection establishment flags.",
      2: "Filters on HTTP and HTTPS port numbers regardless of TCP flag states.",
      3: "Filters on oversized ICMP echo request packets, not TCP handshake packets."
    }
  },

  // 12. quiz-net-404-wireshark-packet-capture (2)
  {
    quizId: "quiz-net-404-wireshark-packet-capture",
    concept: "TCP Fast Retransmit & Duplicate ACKs",
    options: [
      "Normal connection closure: The server sent a TCP FIN and the client is acknowledging graceful connection termination",
      "Fast Retransmit trigger: A packet was lost in transit, causing the receiver to repeatedly acknowledge the last contiguous byte received while out-of-order packets arrive",
      "SYN Flood attack detection: A remote host is rapidly generating TCP connection attempts without sending acknowledgments",
      "Path MTU Discovery failure: An intermediate router dropped a packet with DF=1 and generated an ICMP Type 3 Code 4 error"
    ],
    explanationsJson: {
      0: "Duplicate ACKs indicate missing data segments during an active transfer, not a graceful 4-way FIN teardown.",
      2: "SYN floods generate incoming SYN packets to the server, whereas duplicate ACKs are generated by a receiver waiting for missing sequence bytes.",
      3: "PMTUD failure results in ICMP 'Packet Too Big' notifications or silent timeouts, not three consecutive duplicate TCP ACKs."
    }
  },

  // 13. quiz-net-404-wireshark-packet-capture (3)
  {
    quizId: "quiz-net-404-wireshark-packet-capture",
    concept: "TCP ZeroWindow Flow Control Analysis",
    options: [
      "The client network interface card has lost physical link and autonegotiated down to half-duplex 10BASE-T",
      "The default gateway router has crashed and dropped all Layer 3 IP routing table entries across the subnet",
      "The receiving server application buffer is completely full, advertising Window Size = 0 to command the client to stop sending data until buffer space clears",
      "The web server has successfully completed SSL/TLS key exchange and closed the underlying TCP transport connection"
    ],
    explanationsJson: {
      0: "ZeroWindow is an explicit Layer 4 TCP flow control advertisement, independent of Layer 1 physical link status.",
      1: "If the default gateway had crashed, no TCP packets would traverse the link to deliver the ZeroWindow notification.",
      3: "A completed TLS handshake leads to application data exchange, not an immediate flow control transmission freeze."
    }
  },

  // 14. quiz-net-404-wireshark-packet-capture (4)
  {
    quizId: "quiz-net-404-wireshark-packet-capture",
    concept: "Wireshark Expert Info Display Filters",
    options: [
      "`http.request.method == \"GET\" || dns.flags.response == 1`",
      "`ip.src == 10.0.0.1 && ip.dst == 10.0.0.2`",
      "`frame.len <= 64 && eth.dst == ff:ff:ff:ff:ff:ff`",
      "`tcp.analysis.retransmission || tcp.analysis.duplicate_ack`"
    ],
    explanationsJson: {
      0: "Filters standard HTTP GET requests and DNS responses, which are routine application messages rather than network anomalies.",
      1: "Filters on source and destination IP addresses, displaying all conversational traffic without diagnosing packet loss.",
      2: "Filters broadcast frames and runt candidates, but does not identify TCP transport retransmissions."
    }
  },

  // 15. quiz-net-404-wireshark-packet-capture (5)
  {
    quizId: "quiz-net-404-wireshark-packet-capture",
    concept: "DNS Packet Flag & RCODE Analysis",
    options: [
      "NXDOMAIN (Non-Existent Domain): The queried domain name does not exist in the authoritative DNS zone",
      "SERVFAIL (Server Failure): The authoritative DNS nameserver experienced an internal operating system crash",
      "NOERROR (Success): The domain name was resolved successfully and IPv4 address records are attached in the answer section",
      "REFUSED (Query Refused): The DNS resolver rejected the query because the client IP is not on the authorized subnet access list"
    ],
    explanationsJson: {
      1: "RCODE 2 is SERVFAIL, indicating the name server was unable to process the query due to a problem with the server.",
      2: "RCODE 0 is NOERROR, indicating successful name resolution.",
      3: "RCODE 5 is REFUSED, indicating policy rejection by the nameserver."
    }
  },

  // 16. quiz-net-404-wireshark-packet-capture (6)
  {
    quizId: "quiz-net-404-wireshark-packet-capture",
    concept: "TCP Reset (RST) Flag Analysis & Port Scanning",
    options: [
      "The destination host is actively acknowledging receipt of data and requesting the next sequence byte in the stream",
      "TCP RST (Reset) abruptly tears down a connection without a graceful 4-way FIN handshake; sent when a connection arrives on a closed port or is terminated by a firewall",
      "The destination host is negotiating TCP maximum segment size and window scale factors during the three-way handshake",
      "The sender is commanding intermediate routers to prioritize the packet using Expedited Forwarding Quality of Service"
    ],
    explanationsJson: {
      0: "Normal data acknowledgment uses the ACK flag with the next expected sequence number, not the RST flag.",
      2: "TCP options like MSS and Window Scale are negotiated using SYN packets during initial connection setup, not RST.",
      3: "QoS prioritization is configured in the IP header DSCP field, completely separate from Layer 4 TCP control flags."
    }
  },

  // 17. quiz-net-403-network-automation-programmability-foundations (1)
  {
    quizId: "quiz-net-403-network-automation-programmability-foundations",
    concept: "JSON Network Object Interpretation",
    options: [
      "As a list (array) of JSON objects (dictionaries), where each object represents a VLAN with `id` and `name` attributes",
      "As a flat comma-delimited ASCII string that must be parsed using regular expression line-by-line screen scraping",
      "As a binary compiled machine language bytecode payload meant exclusively for execution on router hardware ASICs",
      "As an XML soap envelope requiring an external document type definition schema before attributes can be inspected"
    ],
    explanationsJson: {
      1: "JSON is structured hierarchical key-value data; treating it as flat text defeats the purpose of programmatic APIs.",
      2: "JSON is a lightweight, human-readable data interchange format, not compiled binary ASIC firmware.",
      3: "XML/SOAP is a separate schema-based format; JSON uses native object and array notation without XML wrappers."
    }
  },

  // 18. quiz-net-403-network-automation-programmability-foundations (2)
  {
    quizId: "quiz-net-403-network-automation-programmability-foundations",
    concept: "Safe Automation Pipelines & Pre-Flight Validation",
    options: [
      "Pushing raw configuration script updates directly to all production core routers during peak business traffic hours",
      "Executing pre-deployment schema validation and a dry-run diff preview against a single canary device before wide rollout",
      "Disabling all syslogging and telemetry alerts to prevent network monitoring servers from generating false positive tickets",
      "Hardcoding root administrative passwords directly into public GitHub repositories to simplify automated CI/CD pipeline triggers"
    ],
    explanationsJson: {
      0: "Pushing unvalidated changes directly across production core networks causes catastrophic outages when syntax errors occur.",
      2: "Disabling logging eliminates visibility and audit trails, preventing post-change verification and incident diagnosis.",
      3: "Hardcoding credentials into public repositories creates catastrophic security vulnerabilities."
    }
  },

  // 19. quiz-net-403-network-automation-programmability-foundations (3)
  {
    quizId: "quiz-net-403-network-automation-programmability-foundations",
    concept: "Declarative vs Imperative Automation Approaches",
    options: [
      "Imperative is used exclusively in Python scripts, whereas declarative is used exclusively in Bash shell scripts",
      "Imperative operates strictly at Layer 2, whereas declarative operates strictly at Layer 3 and Layer 4",
      "Imperative defines the exact step-by-step commands to execute, whereas declarative defines the desired target end-state and lets the system compute necessary actions",
      "Imperative encrypts configuration payloads with AES-256, whereas declarative transmits configurations in plaintext"
    ],
    explanationsJson: {
      0: "Both programming paradigms exist independently of specific languages; Ansible and Terraform use declarative models.",
      1: "Declarative and imperative paradigms apply across all network layers and infrastructure domains.",
      3: "Data transport security is handled by SSH, TLS, or HTTPS, completely independent of automation modeling paradigms."
    }
  },

  // 20. quiz-net-403-network-automation-programmability-foundations (4)
  {
    quizId: "quiz-net-403-network-automation-programmability-foundations",
    concept: "Detecting and Remediating Configuration Drift",
    options: [
      "Network segmentation; the device has dynamically created isolated VLANs to improve security across campus access switches",
      "Software routing optimization; the operating system kernel has rewritten its configuration to increase packet forwarding throughput",
      "Hardware transceiver degradation; physical copper cable attenuation has altered the saved startup configuration stored in NVRAM",
      "Configuration drift; the live device state no longer matches the source of truth, risking unexpected overwrite or failure on the next automated deployment"
    ],
    explanationsJson: {
      0: "VLAN creation is deliberate; discrepancies between source of truth and running state represent configuration drift.",
      1: "Operating systems do not arbitrarily modify persistent configuration files to optimize routing throughput.",
      2: "Physical layer cable attenuation causes CRC errors and packet drops; it cannot rewrite software configuration syntax."
    }
  },

  // 21. quiz-net-403-network-automation-programmability-foundations (5)
  {
    quizId: "quiz-net-403-network-automation-programmability-foundations",
    concept: "Identifying Unsafe Automation Practices",
    options: [
      "Pushing configuration changes simultaneously to 1,000 production switches without dry-run diff validation or an automated rollback mechanism",
      "Validating JSON configuration payloads against formal schema definitions before sending API requests to network devices",
      "Executing automated configuration audits in a staging lab environment before committing changes to production devices",
      "Storing network automation playbooks and templates in a centralized version control repository with peer review requirements"
    ],
    explanationsJson: {
      1: "Pre-deployment schema validation is a foundational best practice that prevents syntax and type errors on devices.",
      2: "Testing in staging environments validates automation workflows safely without risking production service disruption.",
      3: "Version control with peer review provides change tracking, auditability, and safety against human configuration errors."
    }
  },

  // 22. quiz-net-401-ipv4-nat-pat-address-translation (1)
  {
    quizId: "quiz-net-401-ipv4-nat-pat-address-translation",
    concept: "Cisco NAT Address Terminology",
    options: [
      "The private IP address assigned to an internal workstation on the local enterprise LAN subnet",
      "A globally routable public IPv4 address that represents an internal host to the external internet",
      "The public IP address assigned to an external web server located on the public Internet",
      "The default gateway IP address configured on the internal Layer 3 router interface"
    ],
    explanationsJson: {
      0: "The private IP address on the local enterprise LAN is the 'Inside Local' address.",
      2: "The public IP address of an external Internet server is the 'Outside Global' address.",
      3: "The router default gateway interface IP is simply the local gateway address, not Inside Global."
    }
  },

  // 23. quiz-net-401-ipv4-nat-pat-address-translation (2)
  {
    quizId: "quiz-net-401-ipv4-nat-pat-address-translation",
    concept: "PAT Port Collision Resolution",
    options: [
      "PAT assigns a different unique translated source port number (e.g. 51234 to host 1 and 51235 to host 2) on the public IP 203.0.113.1",
      "PAT drops the second host packet and forces the workstation to wait 5 minutes before attempting another connection",
      "PAT rewrites the destination IP address to 127.0.0.1 and routes the packet back to the internal workstation loopback",
      "PAT converts the second host connection into an unencrypted UDP datagram transmitted without port numbers"
    ],
    explanationsJson: {
      1: "PAT dynamically manages port tables to prevent drops; it allocates an alternate available port from its pool (~65,000 ports).",
      2: "Rewriting the destination to 127.0.0.1 would route packets to the router's own loopback rather than the Internet destination.",
      3: "PAT preserves the Layer 4 transport protocol (TCP remains TCP) and allocates a unique translated TCP port number."
    }
  },

  // 24. quiz-net-402-ipsec-vpn-cryptographic-tunnels (1)
  {
    quizId: "quiz-net-402-ipsec-vpn-cryptographic-tunnels",
    concept: "IPsec ESP vs AH Protocol Capabilities",
    options: [
      "AH provides payload encryption and confidentiality, whereas ESP provides only digital signatures and authentication",
      "AH operates at Layer 4 to establish TCP connections, whereas ESP operates at Layer 2 to encapsulate Ethernet frames",
      "ESP provides payload encryption for confidentiality in addition to integrity and authentication, whereas AH provides no encryption",
      "ESP is used exclusively on dial-up analog modem lines, whereas AH is used on high-speed multi-gigabit fiber connections"
    ],
    explanationsJson: {
      0: "This reverses the protocols: ESP (Encapsulating Security Payload) provides encryption; AH (Authentication Header) provides NO encryption.",
      1: "Both AH (IP protocol 51) and ESP (IP protocol 50) operate directly on top of Layer 3 IP, not as Layer 4 TCP or Layer 2 Ethernet.",
      3: "Both protocols are deployed on modern IP infrastructure; ESP is universally preferred because it provides payload confidentiality."
    }
  },

  // 25. quiz-net-402-ipsec-vpn-cryptographic-tunnels (2)
  {
    quizId: "quiz-net-402-ipsec-vpn-cryptographic-tunnels",
    concept: "Diffie-Hellman Key Exchange Role",
    options: [
      "It permanently assigns a static public IP address to the VPN client from the ISP broadband pool",
      "It compresses the IP packet payload using Lempel-Ziv algorithms to reduce WAN transmission bandwidth",
      "It converts incoming Ethernet frames into optical pulses before passing data to physical transceivers",
      "It enables two peers to calculate a shared symmetric encryption secret over an insecure public channel without ever transmitting the secret key itself"
    ],
    explanationsJson: {
      0: "IP address assignment across VPNs is handled by IPCP, IKE Mode-Config, or DHCP, not the Diffie-Hellman algorithm.",
      1: "Packet compression is performed by IPComp (IP Compression Protocol), not Diffie-Hellman key exchange.",
      2: "Electrical-to-optical signal conversion is executed by Layer 1 optical transceivers (SFPs)."
    }
  },

  // 26. quiz-net-402-ipsec-vpn-cryptographic-tunnels (3)
  {
    quizId: "quiz-net-402-ipsec-vpn-cryptographic-tunnels",
    concept: "Crypto ACL Interesting Traffic Definition",
    options: [
      "It defines the source and destination subnets that trigger tunnel activation and must be encrypted before transmission across the WAN",
      "It permanently blocks all outgoing web browsing traffic on TCP port 80 to force users onto encrypted HTTPS port 443",
      "It lists the MAC addresses of unauthorized wireless access points that must be suppressed by the switch access layer",
      "It specifies the OSPF area numbers that are permitted to redistribute external routes into the backbone Area 0"
    ],
    explanationsJson: {
      1: "Crypto ACLs identify interesting traffic for IPsec tunnel encryption; they do not enforce HTTP-to-HTTPS web redirects.",
      2: "Wireless rogue AP suppression is executed by Wireless Intrusion Prevention Systems (WIPS), not IPsec crypto ACLs.",
      3: "OSPF route redistribution filtering is configured via route-maps and distribute-lists, not IPsec crypto ACLs."
    }
  }
];

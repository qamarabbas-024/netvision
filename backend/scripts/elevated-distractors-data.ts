export interface ElevatedQuestionUpgrade {
  quizId: string;
  concept: string;
  options: string[];
  explanationsJson: Record<number, string>;
}

export const ELEVATED_DISTRACTORS_PART1: ElevatedQuestionUpgrade[] = [
  // 1. quiz-level-0-ip-addresses-logical-location
  {
    quizId: "quiz-level-0-ip-addresses-logical-location",
    concept: "IPv4 Loopback Architecture (127.0.0.1)",
    options: [
      "The packets are encapsulated in broadcast frames and forwarded to every switch port on the local subnet",
      "The packets are processed entirely within the local host TCP/IP stack in kernel memory and are never transmitted onto the physical network wire",
      "The packets are forwarded out of the default gateway interface to upstream Internet Service Provider core routers",
      "The packets are dropped immediately by the network interface controller firmware as malformed runt frames"
    ],
    explanationsJson: {
      0: "Loopback traffic is purely internal to the operating system and is never broadcast onto physical Ethernet links.",
      2: "Loopback traffic never traverses network interfaces or routes across default gateways to ISP networks.",
      3: "Loopback packets are fully valid TCP/IP packets processed within kernel socket memory, not malformed runt frames."
    }
  },

  // 2. quiz-level-0-network-ports-socket-boundaries
  {
    quizId: "quiz-level-0-network-ports-socket-boundaries",
    concept: "Multiplexing vs Demultiplexing Mechanics",
    options: [
      "Multiplexing gathers data from multiple application sockets onto a single physical network interface; Demultiplexing delivers incoming packets from the interface to the correct application socket based on Destination Port",
      "Multiplexing encrypts application payloads using symmetric TLS session keys; Demultiplexing decrypts incoming payloads using asymmetric RSA public keys",
      "Multiplexing translates private IPv4 addresses to public addresses using NAT tables; Demultiplexing maps incoming public IP packets back to internal host addresses",
      "Multiplexing modulates digital bitstreams onto optical fiber carrier signals; Demultiplexing converts optical light pulses back into electrical copper voltages"
    ],
    explanationsJson: {
      1: "Payload encryption and decryption are handled by TLS at the Application/Presentation layer, not transport socket multiplexing.",
      2: "Network Address Translation (NAT) operates at Layer 3 to modify IP headers, distinct from Layer 4 port multiplexing.",
      3: "Signal modulation and optical-electrical conversion are Layer 1 physical transceiver operations."
    }
  },

  // 3. quiz-level-0-network-packets-data-framing (1)
  {
    quizId: "quiz-level-0-network-packets-data-framing",
    concept: "IP Fragmentation Performance Penalties",
    options: [
      "Fragmented packets bypass stateful firewall inspection because Layer 3 fragment offset flags disable Layer 4 TCP port filtering rules",
      "If any single fragment is dropped in transit, the entire original packet is lost and must be retransmitted, while intermediate routers suffer CPU overhead buffering fragments",
      "The receiving destination host drops all fragments arriving out of order because IP headers lack sequence numbers to reconstruct packet boundaries",
      "Packet fragmentation causes the physical Ethernet interface to renegotiate link speeds from full-duplex gigabit down to half-duplex 10 Mbps"
    ],
    explanationsJson: {
      0: "While fragmentation creates inspection challenges, modern firewalls reassemble fragments; it is not the primary performance penalty.",
      2: "The receiving host reassembles fragments using Identification, Flags, and Fragment Offset fields regardless of arrival order.",
      3: "Physical autonegotiation occurs at Layer 1 and is unaffected by Layer 3 IP packet fragmentation."
    }
  },

  // 4. quiz-level-0-network-packets-data-framing (2)
  {
    quizId: "quiz-level-0-network-packets-data-framing",
    concept: "PMTUD Black Hole Diagnosis",
    options: [
      "The sending client has exhausted its local ephemeral TCP port pool, preventing new socket connections from establishing three-way handshakes",
      "The destination web server has enabled HTTP keep-alive timeouts that prematurely terminate idle TCP connections before payloads finish transmission",
      "An intermediate firewall is dropping all ICMP messages, preventing the ICMP Type 3 Code 4 \"Packet Too Big\" notifications from reaching the sender when large packets with DF=1 are dropped",
      "The Layer 2 switch is dropping oversized 802.1Q tagged frames because spanning tree protocol designated ports entered a discarding blocking state"
    ],
    explanationsJson: {
      0: "Socket port exhaustion prevents initial SYN handshakes from completing, whereas PMTUD black holes permit handshakes but stall on large payloads.",
      1: "Keep-alive timeouts terminate idle sessions, whereas PMTUD issues occur actively during high-throughput packet transfers.",
      3: "Spanning tree port states drop all traffic uniformly on that port, not selectively based on packet payload size."
    }
  },

  // 5. quiz-level-0-network-protocols-standards
  {
    quizId: "quiz-level-0-network-protocols-standards",
    concept: "Role of Networking Standards",
    options: [
      "Publishing open RFC specifications and IEEE standards ensuring interoperability between different hardware vendors and software operating systems",
      "Manufacturing all enterprise routers, multilayer switches, and network cards sold worldwide within a single centralized global facility",
      "Charging mandatory per-gigabyte telecommunication license royalties for every packet routed through public international fiber links",
      "Performing manual cryptographic auditing and code signing on all open-source web application software before commercial deployment"
    ],
    explanationsJson: {
      1: "Hardware manufacturing is distributed across hundreds of independent commercial hardware manufacturers worldwide.",
      2: "IETF and IEEE standards are open specifications and do not levy packet transmission tariffs or telecommunication royalties.",
      3: "Software auditing and code signing are application lifecycle practices, not the standardization mission of IETF/IEEE."
    }
  },

  // 6. quiz-level-0-dns-internet-phonebook (1)
  {
    quizId: "quiz-level-0-dns-internet-phonebook",
    concept: "DNS Transport Protocol Selection (UDP vs TCP)",
    options: [
      "Because UDP automatically encrypts DNS query payload strings using AES-GCM without requiring public key certificate handshakes",
      "Because standard operating system kernels prohibit TCP connection initiation to external well-known port numbers below 1024",
      "Because UDP avoids 3-way connection handshake overhead, enabling single round-trip lookups with minimal latency and reduced server state load",
      "Because intermediate Internet routers and firewalls drop all TCP segments destined to destination port 53 across transit links"
    ],
    explanationsJson: {
      0: "Standard DNS over UDP is unencrypted plaintext; DNS encryption requires DNS over HTTPS (DoH) or DNS over TLS (DoT).",
      1: "Operating systems freely initiate outbound TCP connections to well-known ports; TCP 53 is fully supported for zone transfers.",
      3: "Enterprise routers and firewalls permit TCP port 53; DNS routinely uses TCP when responses exceed 512 bytes or for AXFR."
    }
  },

  // 7. quiz-level-0-dns-internet-phonebook (2)
  {
    quizId: "quiz-level-0-dns-internet-phonebook",
    concept: "DNS TTL & Resolver Caching Mechanics",
    options: [
      "The default gateway router ARP cache expiration timer configured on internal Layer 3 interface subnets",
      "The physical MAC address hardware lease interval negotiated between client network cards and access switch ports",
      "The Maximum Transmission Unit (MTU) packet size threshold configured across intermediate WAN router interfaces",
      "Time-To-Live (TTL) caching timeout configured on authoritative records and stored in upstream recursive resolvers"
    ],
    explanationsJson: {
      0: "ARP timers resolve IP addresses to local Layer 2 MAC addresses and have no effect on public DNS domain name lookups.",
      1: "MAC addresses are permanent physical hardware identifiers and do not have DNS-related lease timers.",
      2: "MTU governs packet size limits to prevent fragmentation and does not dictate DNS record propagation or caching."
    }
  },

  // 8. quiz-level-0-dns-internet-phonebook (3)
  {
    quizId: "quiz-level-0-dns-internet-phonebook",
    concept: "DNS Resolution vs IP Routing Troubleshooting",
    options: [
      "The physical twisted-pair Ethernet copper cable connecting the host to the local access switch has been severed",
      "DNS server IP configuration is invalid or the configured DNS resolver is unreachable, preventing domain name translation",
      "The default gateway edge router has suffered a kernel crash and dropped all Layer 3 IP routing table entries",
      "The host network interface card MAC address has been permanently blacklisted in the switch Content Addressable Memory"
    ],
    explanationsJson: {
      0: "If the physical cable were disconnected, pinging the direct public IP address 8.8.8.8 would fail immediately with hardware down.",
      2: "Because the host successfully pings public IP 8.8.8.8, the default gateway and Layer 3 Internet routing are functioning perfectly.",
      3: "A blacklisted MAC address would prevent all Layer 2 frame forwarding, blocking direct IP pings as well."
    }
  },

  // 9. quiz-level-0-dhcp-automatic-ip-allocation (1)
  {
    quizId: "quiz-level-0-dhcp-automatic-ip-allocation",
    concept: "DHCP T1 Renewal Timer Calculation",
    options: [
      "At 04:00 PM (87.5% of lease duration) via an all-subnets Layer 2 broadcast DHCP Discover frame across the local broadcast domain",
      "At 01:00 PM (50% of lease duration) via a Unicast DHCP Request sent directly to the leasing server",
      "At 05:00 PM (100% of lease duration) via an ICMP Echo Request payload validating server connectivity before releasing address",
      "At 09:05 AM immediately following initial IP binding via a TCP SYN packet establishing a continuous connection keepalive"
    ],
    explanationsJson: {
      0: "87.5% (T2 timer) is the Rebinding phase where the client broadcasts if the leasing server failed to respond to unicast renewals.",
      2: "Waiting until 100% lease expiration would cause immediate IP loss and disconnection; renewal occurs well before expiration.",
      3: "DHCP uses connectionless UDP on ports 67/68, not persistent TCP keepalive connections."
    }
  },

  // 10. quiz-level-0-dhcp-automatic-ip-allocation (2)
  {
    quizId: "quiz-level-0-dhcp-automatic-ip-allocation",
    concept: "DHCP Relay Agent & ip helper-address",
    options: [
      "To assign static RFC 1918 addresses to router subinterfaces without requiring dynamic lease tables or client request parsing",
      "To inspect and suppress unauthorized DHCP Offer packets originating from rogue DHCP servers across local switch access ports",
      "Because routers drop Layer 2/3 broadcast packets by default, requiring the router to convert client DHCP Discover broadcasts into unicast packets routed to a central DHCP server",
      "To translate internal private IPv4 client addresses into globally unique public routable IP addresses across external WAN links"
    ],
    explanationsJson: {
      0: "Subinterfaces are configured manually with static IPs; DHCP relay is specifically for dynamically servicing client workstations.",
      1: "Suppressing rogue DHCP offers is the role of Layer 2 DHCP Snooping on switches, not ip helper-address on routers.",
      3: "Translating private IP addresses to public IPs is the function of Network Address Translation (NAT), not DHCP relay."
    }
  },

  // 11. quiz-level-0-dhcp-automatic-ip-allocation (3)
  {
    quizId: "quiz-level-0-dhcp-automatic-ip-allocation",
    concept: "APIPA (169.254.x.x) Troubleshooting",
    options: [
      "The client device successfully established a high-throughput 10GBASE-T fiber optic link with the enterprise aggregation layer",
      "The client device was assigned a globally unique public Internet IPv4 address directly from the regional Internet registry",
      "The enterprise DHCP server assigned a reserved high-availability Virtual IP (VIP) address designated for critical infrastructure",
      "The client failed to communicate with a DHCP server and self-assigned an Automatic Private IP Addressing (APIPA) link-local address"
    ],
    explanationsJson: {
      0: "Media speed negotiation does not determine Layer 3 IP addressing; a 169.254.x.x address indicates DHCP failure.",
      1: "169.254.0.0/16 is an RFC 3927 link-local range, not a globally routable public Internet IPv4 block.",
      2: "DHCP servers assign configured scope ranges; APIPA addresses are generated client-side when no server responds."
    }
  },

  // 12. quiz-level-0-routers-inter-subnet-pathfinders (1)
  {
    quizId: "quiz-level-0-routers-inter-subnet-pathfinders",
    concept: "Default Route 0.0.0.0/0",
    options: [
      "It instructs the router operating system to permanently disable all physical and logical routing interfaces upon initialization",
      "It acts as the gateway of last resort, matching all destination IP addresses that do not match any more specific route in the routing table",
      "It isolates router packet processing exclusively to internal loopback interface 127.0.0.1 and drops all external transit packets",
      "It commands the router to forward all arriving packets as Layer 2 broadcast frames across every attached switch trunk port"
    ],
    explanationsJson: {
      0: "A default route enables global packet forwarding; it does not administratively disable router interfaces.",
      2: "Loopback addresses are host-internal; a default route points outward to upstream transit next-hop routers.",
      3: "Routers forward packets as unicast frames to specific next-hop MACs; they never broadcast transit IP packets."
    }
  },

  // 13. quiz-level-0-routers-inter-subnet-pathfinders (2)
  {
    quizId: "quiz-level-0-routers-inter-subnet-pathfinders",
    concept: "Default Gateway Subnet Mismatch",
    options: [
      "Enterprise edge routers reject all transit IP packets originating from client workstations assigned an IP ending in `.10`",
      "Public DNS resolver IP addresses such as 8.8.8.8 have been officially deprecated and reallocated for internal enterprise LAN use",
      "The network interface card firmware shuts down physical transceiver hardware if the default gateway IP address ends in `.1`",
      "The host cannot ARP for its default gateway because `192.168.2.1` is on a different logical subnet than `192.168.1.10/24` and cannot be reached locally"
    ],
    explanationsJson: {
      0: "Routers evaluate destination IP addresses against routing tables; they do not arbitrarily drop packets based on final octet values.",
      1: "8.8.8.8 is an active, globally accessible Anycast public DNS resolver operated by Google.",
      2: "Transceiver hardware operates at Layer 1 and has no awareness of Layer 3 IP addressing or gateway octet values."
    }
  },

  // 14. quiz-level-0-switches-local-lan-forwarders (1)
  {
    quizId: "quiz-level-0-switches-local-lan-forwarders",
    concept: "Unknown Unicast Flooding",
    options: [
      "It immediately drops the unmapped frame and generates an ICMP Destination Host Unreachable packet back to the sender",
      "It floods the frame out all active ports in the same VLAN except the port on which it was received",
      "It encapsulates the frame in a Layer 3 packet and forwards it to the default gateway router for disposal",
      "It triggers port security err-disable mode and permanently shuts down the physical incoming switch port"
    ],
    explanationsJson: {
      0: "Layer 2 switches do not generate ICMP error messages; they flood unknown unicast frames to facilitate MAC discovery.",
      2: "Switches forward frames based on Layer 2 MAC addresses within the broadcast domain; they do not send unknown frames to routers for disposal.",
      3: "Port security shuts down ports on unauthorized Source MAC violations, not on unknown Destination MAC lookups."
    }
  },

  // 15. quiz-level-0-switches-local-lan-forwarders (2)
  {
    quizId: "quiz-level-0-switches-local-lan-forwarders",
    concept: "Full-Duplex Switching Advantages",
    options: [
      "Full-duplex extends physical twisted-pair copper cable transmission distance up to 10,000 meters without active signal repeaters",
      "Full-duplex eliminates the requirement for Layer 3 IP addressing, subnet masking, and inter-VLAN routing across the enterprise",
      "Nodes can transmit and receive data simultaneously without collisions, effectively doubling bandwidth and eliminating CSMA/CD backoff delays",
      "Full-duplex implements mandatory 256-bit asymmetric quantum key encapsulation across every physical Ethernet frame"
    ],
    explanationsJson: {
      0: "Ethernet copper distance remains constrained by physical attenuation to 100 meters regardless of duplex mode.",
      1: "Duplex mode is a Layer 1/2 physical signaling capability; Layer 3 IP addressing and routing are still mandatory.",
      3: "Duplex mode does not encrypt data; frame confidentiality requires Layer 2 MACsec or Layer 3 IPsec."
    }
  }
];

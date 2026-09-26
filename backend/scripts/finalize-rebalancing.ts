import * as fs from 'fs';
import * as path from 'path';

const FINAL_UPGRADES: Array<{
  quizId: string;
  concept: string;
  options: string[];
  correctOption?: number;
  explanationsJson: Record<number, string>;
}> = [
  // 1. quiz-net-305-standard-extended-ipv4-acls
  {
    quizId: "quiz-net-305-standard-extended-ipv4-acls",
    concept: "Wildcard Mask Calculation",
    options: [
      "0.0.3.255 (calculated by subtracting 255.255.252.0 from 255.255.255.255)",
      "0.0.0.255 (matches only a /24 single subnet with up to 254 hosts)",
      "0.0.7.255 (matches a /21 block spanning 2,048 contiguous host addresses)",
      "255.255.252.0 (the subnet mask itself rather than its bitwise inverse)"
    ],
    correctOption: 0,
    explanationsJson: {
      1: "0.0.0.255 matches a /24 subnet (256 addresses), not a /22.",
      2: "0.0.7.255 matches a /21 subnet (2048 addresses).",
      3: "255.255.252.0 is the subnet mask itself, not the wildcard mask."
    }
  },

  // 2. quiz-nat-pat-overview (Cisco NAT Address Terminology)
  {
    quizId: "quiz-nat-pat-overview",
    concept: "Cisco NAT Address Terminology",
    options: [
      "Inside Local is the private IP on the LAN; Inside Global is the public routable IP representing that host to the external Internet",
      "Inside Local is the MAC address of the workstation; Inside Global is the IP address of the ISP recursive DNS nameserver",
      "Inside Local is the loopback address 127.0.0.1; Inside Global is the IPv6 link-local address assigned by SLAAC autoconfiguration",
      "Inside Local is the default gateway IP; Inside Global is the broadcast address 255.255.255.255 across all subnets"
    ],
    correctOption: 0,
    explanationsJson: {
      1: "Inside Local and Inside Global are both Layer 3 IPv4 addresses, not Layer 2 MAC addresses or DNS nameservers.",
      2: "Inside Local is the host's actual RFC 1918 private address (e.g. 192.168.1.50), not internal loopback 127.0.0.1.",
      3: "The default gateway is the router interface IP; Inside Global is the translated public address assigned during NAT."
    }
  },

  // 3. quiz-nat-pat-overview (PAT Port Multiplexing)
  {
    quizId: "quiz-nat-pat-overview",
    concept: "PAT (NAT Overload) Port Multiplexing",
    options: [
      "By dynamically segmenting the public IP address into variable fractional decimal sub-addresses",
      "By multiplexing connections using unique source Layer 4 TCP/UDP Port numbers in the NAT translation state table",
      "By stripping Layer 3 IP headers and forwarding raw Layer 2 Ethernet frames across the public WAN link",
      "By negotiating separate physical optical fiber channels for each internal client workstation"
    ],
    correctOption: 1,
    explanationsJson: {
      0: "IPv4 addresses are 32-bit discrete integers and cannot be divided into fractional decimal values.",
      2: "Packets traversing the Internet require full Layer 3 IP headers with globally routable source and destination addresses.",
      3: "PAT is a software translation engine running inside router/firewall ASICs, not multiple physical fiber channels."
    }
  },

  // 4. quiz-nat-pat-overview (Static 1-to-1 NAT)
  {
    quizId: "quiz-nat-pat-overview",
    concept: "Static 1-to-1 NAT for Public Servers",
    options: [
      "Dynamic NAT Pool with overload disabled",
      "Port Address Translation with PAT port overloading",
      "Static NAT mapping one private IP permanently to one public IP",
      "Carrier-Grade NAT using large-scale shared address space"
    ],
    correctOption: 2,
    explanationsJson: {
      0: "Dynamic NAT without overload assigns public IPs from a pool on-demand, which can change over time.",
      1: "PAT is designed for outbound client sessions sharing ports, not predictable inbound mapping for dedicated servers.",
      3: "CGNAT (RFC 6598) is deployed by ISPs for mass subscriber multiplexing, not individual DMZ server hosting."
    }
  },

  // 5. quiz-routing-fundamentals-overview (Next-Hop Resolution)
  {
    quizId: "quiz-routing-fundamentals-overview",
    concept: "Static Route Next-Hop Reachability Validation",
    options: [
      "The router operating system automatically deletes the static route configuration string from NVRAM memory",
      "The router floods an ICMP redirect broadcast frame out of all access ports across the local broadcast domain",
      "The router downgrades physical link autonegotiation from full-duplex gigabit down to half-duplex 10 Mbps",
      "The static route remains installed in the running configuration, but is omitted from the active forwarding table (RIB) until the next-hop becomes reachable"
    ],
    correctOption: 3,
    explanationsJson: {
      0: "Static routes persist in the configuration; Cisco IOS does not delete configuration statements when links go down.",
      1: "ICMP redirects inform hosts of better first-hop routers on local multi-access links, not static route unreachable next-hops.",
      2: "Layer 3 routing reachability has no effect on Layer 1 physical link duplex autonegotiation."
    }
  },

  // 6. quiz-switching-vlans-overview (VLAN Broadcast Domain Segmentation)
  {
    quizId: "quiz-switching-vlans-overview",
    concept: "VLAN Broadcast Domain Segmentation",
    options: [
      "They partition a single physical switch into multiple isolated logical Broadcast Domains at Layer 2, containing broadcast traffic and enforcing security segmentation",
      "They allow switches to replace physical electrical cables with wireless radio signals across access points",
      "They automatically increase internet download speeds by allocating higher hardware clock frequencies to switch ASICs",
      "They eliminate the need for Layer 3 routers when routing between subnets across the enterprise autonomous system"
    ],
    correctOption: 0,
    explanationsJson: {
      1: "VLANs are Layer 2 logical partitions over wired switch hardware, not wireless conversions.",
      2: "VLANs segment network traffic; they do not alter switch silicon clock speeds or ISP WAN bandwidth.",
      3: "Inter-VLAN communication strictly requires a Layer 3 device (router or multilayer switch)."
    }
  },

  // 7. quiz-switching-vlans-overview (Native VLAN Untagged Traffic Handling)
  {
    quizId: "quiz-switching-vlans-overview",
    concept: "Native VLAN Untagged Traffic Handling",
    options: [
      "The Native VLAN is used exclusively for encrypted VoIP telephone traffic across dedicated voice trunks",
      "The Native VLAN is a reserved quarantine VLAN where all incoming packets are immediately dropped by the ASIC",
      "The Native VLAN (default VLAN 1) handles all untagged traffic traversing the 802.1Q trunk link without adding headers",
      "The Native VLAN requires all connected client workstations to disable their physical network interface cards"
    ],
    explanationsJson: {
      0: "VoIP typically uses a dedicated Voice VLAN with 802.1p CoS priority tagging, not untagged Native VLAN.",
      1: "Native VLAN traffic is actively switched and forwarded, not dropped.",
      3: "Native VLAN operates transparently without host reconfiguration or NIC shutdown."
    }
  },

  // 8. quiz-network-security-basics-overview (CIA Triad Fundamentals)
  {
    quizId: "quiz-network-security-basics-overview",
    concept: "CIA Triad Fundamentals",
    options: [
      "Confidentiality (privacy/encryption), Integrity (data accuracy/tamper-detection), and Availability (reliable access to authorized users)",
      "Centralization (managing all routers from one server), Interoperability (multi-vendor compatibility), and Automation (scripting CLI tasks)",
      "Classification (organizing subnets by classful boundaries), Isolation (firewall rules), and Authentication (RADIUS password validation)",
      "Connectivity (maintaining physical link status UP/UP), Inspection (monitoring packet headers), and Allocation (leasing DHCP IPs)"
    ],
    explanationsJson: {
      1: "Centralization, interoperability, and automation are network operational goals, not the foundational information security CIA triad.",
      2: "Classification, isolation, and authentication are security implementation controls, not the core CIA triad principles.",
      3: "Connectivity, inspection, and allocation are routine network management functions."
    }
  },

  // 9. quiz-network-security-basics-overview (Principle of Least Privilege)
  {
    quizId: "quiz-network-security-basics-overview",
    concept: "Principle of Least Privilege",
    options: [
      "Principle of Open Access granting full administrative permissions to all staff members",
      "Defense in Depth deploying multiple redundant hardware firewalls from identical vendors",
      "Principle of Least Privilege granting users only the minimum access rights required for their job functions",
      "Zero Trust Architecture requiring biometric fingerprint scanning for every individual DNS query"
    ],
    explanationsJson: {
      0: "Open access violates security fundamentals by expanding the attack surface and enabling privilege escalation.",
      1: "Defense in Depth layers complementary security controls, not granting excessive user permissions.",
      3: "Zero Trust validates identity continuously, but does not mandate biometric verification on automated DNS packet queries."
    }
  },

  // 10. quiz-firewalls-acls-overview (Standard vs Extended ACL Comparison)
  {
    quizId: "quiz-firewalls-acls-overview",
    concept: "Standard vs Extended ACL Comparison",
    options: [
      "Standard ACLs (1-99) filter traffic based solely on Source IPv4 Address and should be placed close to the destination; Extended ACLs (100-199) filter based on Source/Destination IP, Protocol, and Port numbers, and should be placed close to the source",
      "Standard ACLs filter traffic based on Destination IPv4 and Port; Extended ACLs filter traffic based solely on Source IPv4 and MAC address",
      "Standard ACLs evaluate Layer 4 TCP/UDP stateful sessions; Extended ACLs operate as stateless packet filters inspecting only Layer 2 frames",
      "Standard ACLs are placed close to the traffic source to conserve bandwidth; Extended ACLs must be placed strictly on destination core switches"
    ],
    correctOption: 0,
    explanationsJson: {
      1: "Standard ACLs evaluate only source IP addresses; they cannot inspect destination IP or Layer 4 ports.",
      2: "Both standard and extended ACLs are stateless packet filters; stateful inspection requires firewalls or reflexive ACLs.",
      3: "Standard ACLs lack destination filtering, so placing them near the source blocks traffic to all other destinations."
    }
  },

  // 11. quiz-firewalls-acls-overview (Implicit Deny All Rule)
  {
    quizId: "quiz-firewalls-acls-overview",
    concept: "Implicit Deny All Rule",
    options: [
      "An automatic command to reboot the router every midnight to clear dynamic memory buffers",
      "An Implicit Permit All allowing all remaining unmatched transit traffic to pass through",
      "An Implicit Deny All (`deny ip any any`) dropping all traffic that did not match an earlier permit statement",
      "An automatic email alert sent to the network administrator notifying them of unmatched packets"
    ],
    correctOption: 2,
    explanationsJson: {
      0: "ACLs are packet-filtering engines; they do not trigger router hardware reboots.",
      1: "An implicit permit all would negate ACL security enforcement; default security posture is implicit deny.",
      3: "Implicit deny drops packets silently without generating automated emails."
    }
  },

  // 12. quiz-firewalls-acls-overview (Stateful Firewall vs Stateless ACL)
  {
    quizId: "quiz-firewalls-acls-overview",
    concept: "Stateful Firewall vs Stateless ACL",
    options: [
      "A stateful firewall automatically encrypts all incoming email payloads with asymmetric RSA keys",
      "A stateful firewall operates exclusively at Layer 1 to amplify physical electrical voltages across copper cabling",
      "A stateless router ACL can inspect only traffic that has been previously encrypted by a VPN tunnel",
      "A stateful firewall tracks active TCP connection states (SYN, ESTABLISHED) and dynamic port mappings in a State Table, automatically permitting return traffic without opening broad inbound ports"
    ],
    correctOption: 3,
    explanationsJson: {
      0: "Firewalls inspect and filter traffic based on security policies, not encrypting email payloads.",
      1: "Stateful firewalls operate across Layers 3, 4, and 7; they do not function as physical layer repeaters.",
      2: "Stateless ACLs evaluate unencrypted packet headers (IP, ports) directly without requiring VPN tunnels."
    }
  },

  // 13. quiz-vpn-cryptography-overview (IKE Phase 1 vs Phase 2)
  {
    quizId: "quiz-vpn-cryptography-overview",
    concept: "IKE Phase 1 vs Phase 2 Negotiation",
    options: [
      "IKE Phase 1 encrypts physical fiber optic light pulses; IKE Phase 2 allocates dynamic IP addresses via DHCPv6",
      "IKE Phase 1 authenticates the two VPN gateway peers and creates a secure ISAKMP bidirectional management tunnel; IKE Phase 2 negotiates the IPsec Security Associations (SAs) that encrypt the actual user data traffic",
      "IKE Phase 1 routes packets using OSPF; IKE Phase 2 translates private IPv4 addresses to public IPs using NAT overload",
      "IKE Phase 1 checks physical cable continuity; IKE Phase 2 verifies client user passwords against an Active Directory server"
    ],
    correctOption: 1,
    explanationsJson: {
      0: "IPsec operates at Layer 3 to secure IP packets; it does not assign DHCP leases or alter optical physical properties.",
      2: "Routing and NAT are independent network functions; IKE Phase 1 and 2 specifically manage cryptographic security associations.",
      3: "Physical testing and user authentication are handled by cabling tools and 802.1X/RADIUS, not the IKE tunnel negotiation phases."
    }
  },

  // 14. quiz-wireless-networking-overview (2.4 GHz Non-Overlapping Channels)
  {
    quizId: "quiz-wireless-networking-overview",
    concept: "2.4 GHz Non-Overlapping Channels (1, 6, 11)",
    options: [
      "Channels 1, 2, 3, and 4 (spaced by 5 MHz without overlapping bandwidth)",
      "Channels 1, 6, and 11 (spaced by 25 MHz to provide 20 MHz clean channel separation without co-channel interference)",
      "Channels 36, 40, 44, and 48 (the standard UNII-1 lower enterprise band)",
      "Channels 149, 153, 157, and 161 (the upper UNII-3 high-power enterprise band)"
    ],
    correctOption: 1,
    explanationsJson: {
      0: "Adjacent channels in 2.4 GHz are separated by only 5 MHz, while Wi-Fi channels require 20-22 MHz bandwidth, causing severe overlap.",
      2: "Channels 36-48 belong to the 5 GHz band (UNII-1), not the 2.4 GHz ISM band.",
      3: "Channels 149-161 belong to the 5 GHz band (UNII-3), not the 2.4 GHz ISM band."
    }
  }
];

function applyFinalUpgrades() {
  const targetFile = path.resolve(__dirname, '../src/topics/assessment-question-bank.ts');
  let content = fs.readFileSync(targetFile, 'utf8');

  let appliedCount = 0;

  for (const upgrade of FINAL_UPGRADES) {
    // Find concept in file
    let conceptIdx = content.indexOf(`concept: "${upgrade.concept}"`);
    if (conceptIdx === -1) {
      conceptIdx = content.indexOf(`concept: '${upgrade.concept}'`);
    }

    if (conceptIdx === -1) {
      console.warn(`Could not find concept: "${upgrade.concept}"`);
      continue;
    }

    // Find the enclosing question block start: search backward for \n  {
    const blockStartIdx = content.lastIndexOf('\n  {', conceptIdx);
    if (blockStartIdx === -1) {
      console.warn(`Could not find block start for: ${upgrade.concept}`);
      continue;
    }

    // Find options inside this block
    const optionsStartIdx = content.indexOf('options: [', blockStartIdx);
    if (optionsStartIdx === -1 || optionsStartIdx > conceptIdx) {
      console.warn(`Could not find options range for: ${upgrade.concept}`);
      continue;
    }

    const optionsEndIdx = content.indexOf('],', optionsStartIdx);
    if (optionsEndIdx === -1 || optionsEndIdx > conceptIdx) {
      console.warn(`Could not find options end for: ${upgrade.concept}`);
      continue;
    }

    // Find correctOption inside this block
    const correctOptStartIdx = content.indexOf('correctOption:', optionsEndIdx);
    const correctOptEndIdx = content.indexOf('\n', correctOptStartIdx);

    // Find explanationsJson inside this block
    const explStartIdx = content.indexOf('explanationsJson: {', optionsEndIdx);
    if (explStartIdx === -1 || explStartIdx > conceptIdx) {
      console.warn(`Could not find explanationsJson range for: ${upgrade.concept}`);
      continue;
    }

    const explEndIdx = content.indexOf('},', explStartIdx);
    if (explEndIdx === -1 || explEndIdx > conceptIdx) {
      console.warn(`Could not find explanationsJson end for: ${upgrade.concept}`);
      continue;
    }

    // Format new options
    const formattedOptions = 'options: [\n' + upgrade.options.map(opt => `      ${JSON.stringify(opt)}`).join(',\n') + '\n    ]';

    // Format new explanationsJson with trailing comma!
    const formattedExpl = 'explanationsJson: {\n' + Object.entries(upgrade.explanationsJson)
      .map(([k, v]) => `      ${k}: ${JSON.stringify(v)},`)
      .join('\n') + '\n    },';

    // Replace explanationsJson first
    content = content.substring(0, explStartIdx) + formattedExpl + content.substring(explEndIdx + 2);

    // Replace correctOption if needed
    if (correctOptStartIdx !== -1 && correctOptStartIdx < explStartIdx) {
      const formattedCorrect = `correctOption: ${upgrade.correctOption},`;
      content = content.substring(0, correctOptStartIdx) + formattedCorrect + content.substring(correctOptEndIdx);
    }

    // Now find new options range in this block
    const newOptionsStart = content.indexOf('options: [', blockStartIdx);
    const newOptionsEnd = content.indexOf('],', newOptionsStart);
    content = content.substring(0, newOptionsStart) + formattedOptions + content.substring(newOptionsEnd + 1);

    appliedCount++;
    console.log(`Applied upgrade for: ${upgrade.quizId} - ${upgrade.concept}`);
  }

  console.log(`Successfully applied ${appliedCount} final upgrades.`);
  fs.writeFileSync(targetFile, content, 'utf8');
}

applyFinalUpgrades();

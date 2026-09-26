import * as fs from 'fs';
import * as path from 'path';

const LESSONS_PEDAGOGY_MAP: Record<string, { workedExample: any; practice: any[] }> = {
  'level-0-devices-in-a-network': {
    workedExample: {
      title: 'Calculating Collision and Broadcast Domain Counts in a Hybrid Topology',
      problemStatement:
        'A network has 1 router connected to 2 switches. Switch 1 has 10 PCs and 1 legacy hub with 3 PCs. Switch 2 has 8 PCs. How many collision domains and broadcast domains exist?',
      stepByStepSolution: [
        'Step 1 (Broadcast Domains): Each router interface terminates a broadcast domain. The router connects to 2 switches, so there are 2 broadcast domains.',
        'Step 2 (Collision Domains on Switch 1): Switch 1 has 10 PC ports (10) + 1 uplink to router (1) + 1 port to the hub (1) = 12 collision domains. The 3 PCs on the hub share that single hub collision domain.',
        'Step 3 (Collision Domains on Switch 2): Switch 2 has 8 PC ports (8) + 1 uplink to router (1) = 9 collision domains.',
        'Step 4 (Total Collision Domains): 12 + 9 = 21 collision domains across the network.',
      ],
      finalResult: 'The network contains 2 broadcast domains and 21 collision domains.',
    },
    practice: [
      {
        id: 1,
        prompt: 'Does an unmanaged Layer 2 Ethernet switch break broadcast domains by default?',
        expected: 'No. All switch ports belong to the same default broadcast domain (VLAN 1) unless segmented by VLANs or routers.',
        hints: 'Broadcast frames (FF:FF:FF:FF:FF:FF) are flooded out of all active switch ports.',
      },
    ],
  },

  'level-0-switches-local-lan-forwarders': {
    workedExample: {
      title: 'Tracing Switch CAM Table Updates and Unknown Unicast Frame Flooding',
      problemStatement:
        'Switch SW1 boots with an empty CAM table. Host A (port 1) sends a unicast frame to Host B (port 2). Trace the switch forwarding actions.',
      stepByStepSolution: [
        'Step 1 (Source Learning): SW1 inspects the Source MAC of Host A and records {MAC_A, Port 1, VLAN 1} in its CAM table with a 300-second aging timer.',
        'Step 2 (Destination Lookup): SW1 checks its CAM table for Host B Destination MAC. No entry is found (unknown unicast).',
        'Step 3 (Unknown Unicast Flood): SW1 floods the frame out of all active ports in VLAN 1 except the ingress port (Port 1).',
        'Step 4 (Target Response): Host B replies. SW1 learns Host B MAC on Port 2. Subsequent frames between A and B are forwarded point-to-point without flooding.',
      ],
      finalResult: 'CAM table populates dynamically; initial frame floods, subsequent frames forward unicast directly.',
    },
    practice: [
      {
        id: 1,
        prompt: 'What happens when a switch receives a frame with an unknown destination MAC address?',
        expected: 'The switch floods the frame out of all active ports in the same VLAN except the receiving port.',
        hints: 'This process is known as unknown unicast flooding.',
      },
    ],
  },

  'switching-vlans-overview': {
    workedExample: {
      title: 'Configuring 802.1Q VLAN Trunking and Access Ports on a Managed Switch',
      problemStatement:
        'Configure Switch SW1 with VLAN 10 (Engineering) on port Fa0/1, VLAN 20 (Sales) on Fa0/2, and an 802.1Q trunk on Gi0/1.',
      stepByStepSolution: [
        'Step 1: Create VLANs: vlan 10 (name Engineering), vlan 20 (name Sales).',
        'Step 2: Configure access ports: interface Fa0/1, switchport mode access, switchport access vlan 10. Repeat for Fa0/2 with vlan 20.',
        'Step 3: Configure trunk: interface Gi0/1, switchport trunk encapsulation dot1q, switchport mode trunk, switchport trunk allowed vlan 10,20.',
        'Step 4: Verify with `show vlan brief` and `show interfaces trunk`.',
      ],
      finalResult: 'VLANs isolate broadcast domains; trunk carries tagged frames with 4-byte 802.1Q headers.',
    },
    practice: [
      {
        id: 1,
        prompt: 'How many bytes does an IEEE 802.1Q tag add to an Ethernet frame?',
        expected: '4 bytes (including TPID 0x8100, Priority, DEI, and 12-bit VLAN ID).',
        hints: 'The 802.1Q tag is inserted between the Source MAC and EtherType fields.',
      },
    ],
  },

  'level-0-routers-inter-subnet-pathfinders': {
    workedExample: {
      title: 'Configuring Router-on-a-Stick (ROAS) Subinterfaces for Inter-VLAN Routing',
      problemStatement:
        'Enable routing between VLAN 10 (192.168.10.0/24) and VLAN 20 (192.168.20.0/24) using router interface Gi0/0/0.',
      stepByStepSolution: [
        'Step 1: Bring up the physical interface without an IP address: interface Gi0/0/0, no shutdown.',
        'Step 2: Configure subinterface for VLAN 10: interface Gi0/0/0.10, encapsulation dot1Q 10, ip address 192.168.10.1 255.255.255.0.',
        'Step 3: Configure subinterface for VLAN 20: interface Gi0/0/0.20, encapsulation dot1Q 20, ip address 192.168.20.1 255.255.255.0.',
        'Step 4: Verify routing table with `show ip route`: directly connected routes appear for both subnets.',
      ],
      finalResult: 'Router subinterfaces terminate 802.1Q tags and route packets between isolated VLANs.',
    },
    practice: [
      {
        id: 1,
        prompt: 'What must be configured on a router subinterface before assigning an IP address in ROAS?',
        expected: 'The 802.1Q encapsulation command specifying the VLAN ID (e.g. encapsulation dot1Q 10).',
        hints: 'Cisco IOS rejects IP address assignment on subinterfaces until encapsulation dot1Q is specified.',
      },
    ],
  },

  'routing-fundamentals-overview': {
    workedExample: {
      title: 'Determining Longest Prefix Match and Administrative Distance in Routing Decisions',
      problemStatement:
        'A router has three routes to 10.1.1.50: 1) OSPF 10.1.0.0/16 [AD 110], 2) Static 10.1.1.0/24 [AD 1], 3) BGP 10.1.1.32/27 [AD 20]. Which route is chosen?',
      stepByStepSolution: [
        'Step 1: Evaluate Longest Prefix Match (LPM) first. /27 (27 bits) is longer than /24 (24 bits) and /16 (16 bits).',
        'Step 2: Check if 10.1.1.50 falls within 10.1.1.32/27 (range: 10.1.1.32 to 10.1.1.63). Yes, 50 is in range.',
        'Step 3: Administrative Distance is only evaluated between routes with identical prefix lengths. Because LPM takes precedence over AD, the /27 route is selected.',
      ],
      finalResult: 'The router forwards via the BGP 10.1.1.32/27 route because longest prefix match always wins.',
    },
    practice: [
      {
        id: 1,
        prompt: 'Between two routes with the exact same prefix length (e.g. 192.168.1.0/24), what criteria does the router use to select which route to install?',
        expected: 'The route with the lower Administrative Distance (AD).',
        hints: 'Connected is 0, Static is 1, eBGP is 20, OSPF is 110, RIP is 120.',
      },
    ],
  },

  'network-security-basics-overview': {
    workedExample: {
      title: 'Hardening Switch Access Layer with Port Security and BPDU Guard',
      problemStatement:
        'Prevent unauthorized rogue switches and MAC address spoofing on access switch port Fa0/5.',
      stepByStepSolution: [
        'Step 1: Set port to static access mode: interface Fa0/5, switchport mode access.',
        'Step 2: Enable Port Security with maximum 2 MAC addresses and sticky learning: switchport port-security, switchport port-security maximum 2, switchport port-security mac-address sticky.',
        'Step 3: Set violation action to shutdown: switchport port-security violation shutdown.',
        'Step 4: Enable PortFast and BPDU Guard: spanning-tree portfast, spanning-tree bpduguard enable.',
      ],
      finalResult: 'Port allows exactly 2 authorized client MACs, transitions immediately to forwarding, and disables if rogue switch BPDUs are detected.',
    },
    practice: [
      {
        id: 1,
        prompt: 'What action does a switch take when a port security violation occurs under violation shutdown mode?',
        expected: 'The port is immediately transitioned to an error-disabled (err-disabled) state and the link LED turns off.',
        hints: 'An administrator must manually issue shutdown and no shutdown to recover the port.',
      },
    ],
  },

  'firewalls-acls-overview': {
    workedExample: {
      title: 'Designing an Inbound Extended ACL to Protect a Demilitarized Zone (DMZ)',
      problemStatement:
        'Write an extended ACL permitting public web traffic (HTTP 80, HTTPS 443) to DMZ web server 192.168.50.10 while denying all other inbound access.',
      stepByStepSolution: [
        'Step 1: Permit HTTP: access-list 105 permit tcp any host 192.168.50.10 eq 80.',
        'Step 2: Permit HTTPS: access-list 105 permit tcp any host 192.168.50.10 eq 443.',
        'Step 3: Permit established return traffic for sessions initiated by DMZ: access-list 105 permit tcp any host 192.168.50.10 established.',
        'Step 4: The implicit deny any at line end automatically drops all other ingress packets.',
        'Step 5: Apply inbound on WAN edge: interface Gi0/0/0, ip access-group 105 in.',
      ],
      finalResult: 'Only validated web ports reach the DMZ server; arbitrary exploit probes are dropped by the implicit deny.',
    },
    practice: [
      {
        id: 1,
        prompt: 'What is the default action of any Cisco ACL if an incoming packet matches none of the configured statements?',
        expected: 'Implicit deny any (the packet is silently dropped).',
        hints: 'Every ACL ends with an invisible terminal deny statement.',
      },
    ],
  },

  'nat-pat-overview': {
    workedExample: {
      title: 'Analyzing Source and Destination Sockets Across a PAT Router',
      problemStatement:
        'Host 192.168.1.10:50123 connects to Google DNS 8.8.8.8:53. Router public IP is 203.0.113.1. Trace the packet sockets before and after NAT.',
      stepByStepSolution: [
        'Step 1 (Inside Local -> Inside Global): Client transmits packet {Src: 192.168.1.10:50123, Dst: 8.8.8.8:53}.',
        'Step 2 (PAT Translation): Router allocates ephemeral public port 61001, rewrites header to {Src: 203.0.113.1:61001, Dst: 8.8.8.8:53}, and stores state in NAT table.',
        'Step 3 (Return Packet): Google replies to {Src: 8.8.8.8:53, Dst: 203.0.113.1:61001}.',
        'Step 4 (De-NAT Ingress): Router looks up port 61001, rewrites destination to {Src: 8.8.8.8:53, Dst: 192.168.1.10:50123}, and forwards to client.',
      ],
      finalResult: 'PAT router seamlessly swaps private socket for public socket and tracks return flow via Layer 4 port table.',
    },
    practice: [
      {
        id: 1,
        prompt: 'How does Port Address Translation (PAT) allow thousands of internal hosts to share a single public IPv4 address?',
        expected: 'By assigning unique Layer 4 source port numbers to each internal connection in its translation table.',
        hints: 'PAT is also known as NAT overload.',
      },
    ],
  },

  'vpn-cryptography-overview': {
    workedExample: {
      title: 'Calculating Encapsulation Overhead for IPsec Tunnel Mode with AES-256 and SHA-256',
      problemStatement:
        'Calculate the total IPsec tunnel mode overhead added to a 1400-byte IP packet (New IP header, ESP header, IV, ESP trailer, ICV).',
      stepByStepSolution: [
        'Step 1: New Outer IP Header = 20 bytes.',
        'Step 2: ESP Header (SPI 4 bytes + Sequence Number 4 bytes) = 8 bytes.',
        'Step 3: AES-CBC Initialization Vector (IV) = 16 bytes.',
        'Step 4: ESP Trailer (Padding 0-15 bytes to 16-byte block + Pad Length 1 byte + Next Header 1 byte) = ~10 bytes avg.',
        'Step 5: Integrity Check Value (ICV / HMAC-SHA-256 truncated) = 16 bytes.',
        'Step 6: Total overhead = 20 + 8 + 16 + 10 + 16 = 70 bytes.',
      ],
      finalResult: 'A 1400-byte payload becomes 1470 bytes on the wire; MTU must be adjusted or MSS clamped to prevent fragmentation.',
    },
    practice: [
      {
        id: 1,
        prompt: 'In IPsec, what is the difference between Transport Mode and Tunnel Mode?',
        expected: 'Transport mode encrypts only the payload leaving the original IP header; Tunnel mode encrypts the entire original IP packet and prepends a new outer IP header.',
        hints: 'Site-to-site VPNs across the public Internet use Tunnel mode.',
      },
    ],
  },

  'level-0-basic-network-troubleshooting-workflow': {
    workedExample: {
      title: 'Applying Layered Troubleshooting to Diagnose a Default Gateway Misconfiguration',
      problemStatement:
        'A user reports "The Internet is down." Workstation has IP 192.168.1.55/24. Ping to 192.168.1.1 fails. Ping to 127.0.0.1 succeeds.',
      stepByStepSolution: [
        'Step 1 (Layer 1/2 Check): Link LED is green; `ipconfig` shows operational status UP/UP. Layer 1 and 2 are functional.',
        'Step 2 (Local Stack Check): Ping 127.0.0.1 succeeds, confirming TCP/IP software stack in kernel is intact.',
        'Step 3 (Layer 3 Local Subnet): Ping default gateway 192.168.1.1 fails with Request Timed Out.',
        'Step 4 (Root Cause Analysis): Check ARP table (`arp -a`). Gateway IP has no MAC resolved. Router interface Fa0/0 was administratively shut down during maintenance.',
      ],
      finalResult: 'Identified Layer 3 interface shutdown by methodically verifying physical link, local stack, and default gateway ARP.',
    },
    practice: [
      {
        id: 1,
        prompt: 'What does a successful ping to 127.0.0.1 confirm during network troubleshooting?',
        expected: 'It confirms that the local host TCP/IP protocol stack and network software drivers are installed and functioning properly.',
        hints: '127.0.0.1 is the IPv4 internal loopback address.',
      },
    ],
  },

  'network-troubleshooting-overview': {
    workedExample: {
      title: 'Diagnosing an Asymmetric MTU Black Hole Using Ping with the Don\'t Fragment (DF) Bit',
      problemStatement:
        'Web browsing stalls over an IPsec tunnel. Determine the Path MTU between client 192.168.1.10 and server 10.0.0.5.',
      stepByStepSolution: [
        'Step 1: Run standard ping: `ping 10.0.0.5 -f -l 1472`. Packet is dropped with "Packet needs to be fragmented but DF set".',
        'Step 2: Decrement packet size in binary search: `ping 10.0.0.5 -f -l 1400` succeeds.',
        'Step 3: Test intermediate boundary: `ping 10.0.0.5 -f -l 1432` succeeds; `ping 10.0.0.5 -f -l 1433` fails.',
        'Step 4: Calculate Path MTU: ICMP payload (1432) + ICMP header (8) + IP header (20) = 1460 bytes.',
        'Step 5: Configure TCP MSS clamping on router tunnel interface: `ip tcp adjust-mss 1420`.',
      ],
      finalResult: 'Path MTU determined to be 1460 bytes; MSS clamped to 1420 to prevent oversized TCP segments from dropping.',
    },
    practice: [
      {
        id: 1,
        prompt: 'What command-line ping flags set the Don\'t Fragment bit and payload size on Windows?',
        expected: 'ping <target> -f -l <size> (-f sets DF bit, -l specifies buffer length).',
        hints: 'On Linux the equivalent is ping -M do -s <size>.',
      },
    ],
  },

  'sdn-cloud-networking-overview': {
    workedExample: {
      title: 'Tracing Control Plane vs Data Plane Flow in an OpenFlow SDN Architecture',
      problemStatement:
        'A new flow arrives at OpenFlow Switch SW1. Switch flow table has no matching entry. Trace the control and data plane interactions.',
      stepByStepSolution: [
        'Step 1 (Table-Miss Event): Ingress packet arrives at SW1 data plane ASIC. Flow table lookup yields no match.',
        'Step 2 (Packet-In Message): SW1 encapsulates the packet header and sends an OpenFlow `OFPT_PACKET_IN` message to the centralized SDN controller over secure TLS.',
        'Step 3 (Centralized Path Computation): SDN controller inspects global network topology graph, computes optimal path, and determines forwarding action.',
        'Step 4 (Flow-Mod Push): Controller sends `OFPT_FLOW_MOD` to SW1 inserting a new flow entry with match rules, actions (Forward to Port 3), and idle timeout.',
        'Step 5 (Subsequent Forwarding): SW1 forwards subsequent packets of this flow directly in hardware at wire speed without querying the controller.',
      ],
      finalResult: 'Centralized SDN controller programs intelligent flow tables once; distributed data plane ASICs forward at wire speed.',
    },
    practice: [
      {
        id: 1,
        prompt: 'Which protocol is the industry standard for southbound communication between an SDN controller and forwarding switches?',
        expected: 'OpenFlow (RFC / ONF standard protocol).',
        hints: 'Southbound protocols connect the controller to data plane switches.',
      },
    ],
  },
};

function updateLessonsRemediated() {
  const targetFile = path.resolve(__dirname, '../src/topics/lessons-remediated.ts');
  let content = fs.readFileSync(targetFile, 'utf8');

  for (const [slug, pedagogy] of Object.entries(LESSONS_PEDAGOGY_MAP)) {
    // Find the lesson block by slug
    const slugIdx = content.indexOf(`slug: '${slug}'`);
    if (slugIdx === -1) {
      console.warn(`Could not find slug: ${slug}`);
      continue;
    }

    // Find the next recap: [ after slugIdx
    const recapIdx = content.indexOf('recap: [', slugIdx);
    if (recapIdx === -1) {
      console.warn(`Could not find recap for slug: ${slug}`);
      continue;
    }

    // Check if workedExample is already present
    const checkWorked = content.substring(slugIdx, recapIdx);
    if (checkWorked.includes('workedExample:')) {
      console.log(`Lesson ${slug} already has workedExample.`);
      continue;
    }

    // Format the insertion
    const weStr = JSON.stringify(pedagogy.workedExample, null, 6)
      .replace(/^/gm, '    ')
      .trim();
    const prStr = JSON.stringify(pedagogy.practice, null, 6)
      .replace(/^/gm, '    ')
      .trim();

    const insertBlock = `workedExample: ${weStr},\n      practice: ${prStr},\n      `;

    content = content.substring(0, recapIdx) + insertBlock + content.substring(recapIdx);
    console.log(`Updated lesson ${slug} with workedExample and practice.`);
  }

  fs.writeFileSync(targetFile, content, 'utf8');
  console.log(`Successfully updated ${targetFile}`);
}

updateLessonsRemediated();

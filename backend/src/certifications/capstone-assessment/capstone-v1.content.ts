import { CapstoneAssessmentDefinition } from './capstone-assessment.types';

export const CAPSTONE_V1_ASSESSMENT: CapstoneAssessmentDefinition = {
  version: 1,
  examCode: 'NV-NET-MASTERY-EXAM',
  certificationCode: 'NV-NET-MASTERY',
  title: 'NetVision Network Engineering Master Capstone Examination (v1)',
  durationSeconds: 7200, // 120 minutes
  scoringWeights: {
    theoryWeight: 40,
    practicalWeight: 35,
    packetAnalysisWeight: 25,
    passingScore: 85,
  },

  // =========================================================================
  // SECTION A: THEORY & PROTOCOL REASONING (Weight: 40%)
  // 10 questions, 10 points each = 100 section points
  // =========================================================================
  theorySection: {
    title: 'Domain I: Theory & Protocol Architecture Reasoning',
    description:
      'Rigorous multi-layer networking theory, bitstream boundaries, TCP/IP state dynamics, routing hierarchies, and protocol mechanics.',
    questions: [
      {
        id: 'THEORY-Q1',
        category: 'Ethernet & Physical Bitstream',
        prompt:
          'In a standard Ethernet II local area network with an MTU of 1500 bytes, an application transmits a maximum-size IP datagram. What is the total length on the wire (in bytes) including Preamble, Start Frame Delimiter (SFD), Ethernet II Header, Payload, Frame Check Sequence (FCS CRC32), and minimum Inter-Packet Gap (IPG / IFG)?',
        options: [
          '1518 bytes (Excludes physical layer synchronization overhead)',
          '1526 bytes (Includes preamble and SFD only)',
          '1538 bytes (8B Preamble/SFD + 14B Header + 1500B Payload + 4B FCS + 12B IPG)',
          '1500 bytes (Wire size equals maximum transmission unit)',
        ],
        correctOption: 2,
        points: 10,
        explanation:
          'The wire transmission requires: 7B Preamble + 1B SFD (8B) + 14B MAC Header + 1500B Payload + 4B FCS + 12B Inter-Packet Gap (96 bit times) = 1538 bytes total wire occupancy.',
      },
      {
        id: 'THEORY-Q2',
        category: 'VLANs & 802.1Q Encapsulation',
        prompt:
          'An access switch port is configured in VLAN 10. A threat actor injects a double-tagged 802.1Q frame having an outer VID of 10 and an inner VID of 20 onto this port. If the 802.1Q trunk connected to the upstream switch uses native VLAN 10 without trunk tagging enabled for the native VLAN, what security violation occurs?',
        options: [
          'The first switch strips the outer VLAN 10 tag because it matches the trunk native VLAN; the second switch receives the frame with the inner tag VLAN 20 and forwards it into VLAN 20 without router inspection.',
          'The frame is dropped immediately because 802.1Q trunks enforce cryptographic integrity on all encapsulated frames.',
          'The switch overwrites the inner tag with the native VLAN ID, sending the frame back to the source workstation.',
          'Double-tagged frames are automatically forwarded to the default gateway router for Layer 3 validation.',
        ],
        correctOption: 0,
        points: 10,
        explanation:
          'Double-tagging VLAN hopping exploits the implicit untagging of the native VLAN on 802.1Q trunks. The first switch removes the outer tag, and the second switch decodes the inner tag as if it originated in VLAN 20.',
      },
      {
        id: 'THEORY-Q3',
        category: 'Spanning Tree Protocol Dynamics',
        prompt:
          'In IEEE 802.1w Rapid Spanning Tree Protocol (RSTP), how do two switches connected via a point-to-point full-duplex link achieve sub-second convergence to the Forwarding state without relying on standard 802.1D timers (Listening/Learning)?',
        options: [
          'By waiting for the Root Bridge to broadcast a Configuration BPDU with the Topology Change (TC) bit set.',
          'By executing an explicit Proposal/Agreement handshake mechanism between designated and root ports with sync operations.',
          'By transitioning through the Listening (15s) and Learning (15s) timer stages in parallel.',
          'By suppressing all BPDUs on edge ports using BPDU Filter default mode.',
        ],
        correctOption: 1,
        points: 10,
        explanation:
          'RSTP uses a rapid Proposal/Agreement handshake on point-to-point links. The upstream designated port sends a Proposal; the downstream switch synchronizes all other ports to non-forwarding and replies with an Agreement, allowing immediate Forwarding.',
      },
      {
        id: 'THEORY-Q4',
        category: 'IPv4 & Variable Length Subnet Masking',
        prompt:
          'An enterprise network architect is partitioning the classless block 192.168.10.0/24 to provision 6 independent branch offices. Each branch requires addressing for up to 28 host devices. What is the optimal prefix length for each branch subnet, and what is the broadcast address of the 3rd allocated branch subnet (0-indexed subnet #2)?',
        options: [
          'Prefix: /27 (30 usable hosts); Broadcast address: 192.168.10.95',
          'Prefix: /28 (14 usable hosts); Broadcast address: 192.168.10.47',
          'Prefix: /27 (30 usable hosts); Broadcast address: 192.168.10.63',
          'Prefix: /26 (62 usable hosts); Broadcast address: 192.168.10.127',
        ],
        correctOption: 0,
        points: 10,
        explanation:
          '28 hosts require at least 5 host bits (2^5 - 2 = 30 usable hosts) -> 32 - 5 = /27 prefix. Subnet 0: .0 - .31; Subnet 1: .32 - .63; Subnet 2: .64 - .95. The broadcast address of Subnet 2 is 192.168.10.95.',
      },
      {
        id: 'THEORY-Q5',
        category: 'TCP State Machine & Sockets',
        prompt:
          'During an active close of a TCP connection, the initiator sends the final ACK acknowledging the remote peer’s FIN segment and immediately enters the TIME_WAIT state. What is the primary technical justification for keeping the socket in TIME_WAIT for 2 * MSL (Maximum Segment Lifetime)?',
        options: [
          'To permit the remote peer to send additional unacknowledged out-of-band data.',
          'To ensure the final ACK is received by the remote peer (retransmitting ACK if remote FIN arrives again) and prevent delayed duplicate segments from a closed connection from interfering with a future socket incarnation.',
          'To allow the operating system to recalculate TCP window scale and MSS parameters for future sockets.',
          'To flush the TCP receive buffer and reset the socket keep-alive timers.',
        ],
        correctOption: 1,
        points: 10,
        explanation:
          'TIME_WAIT prevents delayed duplicate packets from a previous connection incarnation from corrupting a new connection using the same 4-tuple, and ensures the remote peer receives the final ACK so it can cleanly transition to CLOSED.',
      },
      {
        id: 'THEORY-Q6',
        category: 'TCP Flow & Congestion Control',
        prompt:
          'A TCP Reno sender with a congestion window (cwnd) of 32 MSS receives 3 duplicate ACKs indicating a single dropped packet. What exact state transition and window resizing occur under the Fast Retransmit and Fast Recovery algorithms?',
        options: [
          'ssthresh is set to cwnd / 2 (16 MSS), cwnd is reduced to 1 MSS, and the connection re-enters Slow Start.',
          'ssthresh is set to cwnd / 2 (16 MSS), the missing segment is retransmitted immediately, cwnd is set to ssthresh + 3 MSS, and cwnd grows linearly per additional duplicate ACK (Fast Recovery).',
          'The sender pauses all transmissions for the full Retransmission Timeout (RTO) duration.',
          'cwnd is doubled to force the receiver to flush its delayed acknowledgment buffer.',
        ],
        correctOption: 1,
        points: 10,
        explanation:
          'Under TCP Reno Fast Retransmit / Fast Recovery: 3 duplicate ACKs trigger setting ssthresh = cwnd/2, retransmitting the lost segment without waiting for RTO timer expiry, inflating cwnd = ssthresh + 3 MSS for the duplicate ACKs, and exiting back to congestion avoidance when a new ACK arrives.',
      },
      {
        id: 'THEORY-Q7',
        category: 'Routing Architecture & OSPF LSDB',
        prompt:
          'In multi-area OSPFv2, why does the Open Shortest Path First standard strictly require all non-backbone areas to connect directly to Area 0 (Backbone Area) or use an engineered Virtual Link?',
        options: [
          'Because non-backbone routers do not possess sufficient CPU power to compute Dijkstra SPF.',
          'To enforce a loop-free star topology at the inter-area level, preventing distance-vector routing loops between Area Border Routers (ABRs) propagating Type 3 Summary LSAs.',
          'Because OSPF Neighbor Adjacencies cannot be established across distinct Autonomous System Numbers.',
          'To restrict Autonomous System Boundary Routers (ASBRs) from injecting Type 5 External LSAs.',
        ],
        correctOption: 1,
        points: 10,
        explanation:
          'Inter-area OSPF operates effectively as a distance-vector protocol using Type 3 Summary LSAs. The two-tier hierarchy requiring Area 0 at the hub prevents distance-vector count-to-infinity routing loops between ABRs.',
      },
      {
        id: 'THEORY-Q8',
        category: 'DNS Resolution & Resource Records',
        prompt:
          'According to RFC 1034 and RFC 2181, which constraint governs the usage of Canonical Name (CNAME) resource records in an authoritative DNS zone file?',
        options: [
          'A CNAME record cannot coexist with any other record types (such as MX, A, TXT) at the same domain node, with the exception of DNSSEC records (RRSIG, NSEC).',
          'A CNAME record must always resolve to an IP address within the same Autonomous System.',
          'Multiple CNAME records with distinct aliases may be defined for the same hostname to enable DNS round-robin load balancing.',
          'CNAME aliases cannot point to fully qualified domain names outside the local zone apex.',
        ],
        correctOption: 0,
        points: 10,
        explanation:
          'RFC 1034 Section 3.6.2 specifies that if a CNAME record is present at a node, no other data records may exist at that node. The only exception defined in modern RFCs is for DNSSEC records (RRSIG, NSEC).',
      },
      {
        id: 'THEORY-Q9',
        category: 'DHCP Protocol & Relay Dynamics',
        prompt:
          'When a Layer 3 relay agent (such as an enterprise core switch configured with "ip helper-address") intercepts a client DHCP Discover broadcast and forwards it across subnets as a unicast packet to the centralized DHCP server, how does the DHCP server determine which address pool to lease?',
        options: [
          'The DHCP server inspects the Client Hardware Address (CHADDR) OUI prefix.',
          'The DHCP server evaluates the Gateway IP Address (GIADDR) field, which the relay agent populated with the IP address of the client-facing VLAN interface.',
          'The DHCP server broadcasts an ICMP ping to find the first responding router on the client subnet.',
          'The DHCP server assigns an address based solely on the destination IP address of the forwarded unicast packet.',
        ],
        correctOption: 1,
        points: 10,
        explanation:
          'The relay agent fills the GIADDR field of the DHCP message with the IP address of the ingress interface on which the client broadcast was received. The DHCP server uses GIADDR to select the matching subnet pool.',
      },
      {
        id: 'THEORY-Q10',
        category: 'Network Security & Stateful Inspection',
        prompt:
          'In stateful packet inspection firewalls, how does the state engine distinguish a legitimate returning TCP packet from an out-of-band spoofed packet attempting unauthorized perimeter penetration?',
        options: [
          'It validates only that the TCP ACK control flag is set to 1 (stateless TCP established rule).',
          'It tracks the full 5-tuple, validates that sequence and acknowledgment numbers fall strictly within the dynamically negotiated TCP sliding window, and verifies TCP state transitions.',
          'It performs a reverse DNS PTR lookup on every inbound packet before forwarding.',
          'It re-encapsulates the frame into an IPsec ESP tunnel before inspection.',
        ],
        correctOption: 1,
        points: 10,
        explanation:
          'Stateful firewalls maintain connection tracking tables (conntrack) matching the 5-tuple and enforce strict TCP sequence number window checking (preventing blind injection and out-of-window forged packets).',
      },
    ],
  },

  // =========================================================================
  // SECTION B: MULTI-LAYER TOPOLOGY INCIDENT CHALLENGE (Weight: 35%)
  // 5 diagnostic tasks totaling 100 section points
  // =========================================================================
  incidentSection: {
    title: 'Domain II: Multi-Layer Enterprise Topology Incident Challenge',
    description:
      'Live enterprise datacenter outage investigation. Analyze topology state, switch port configurations, syslog alerts, and STP flappings to diagnose and remediate a catastrophic Layer 2 loop.',
    scenario: {
      scenarioCode: 'INCIDENT-8492-DATACENTER-MELTDOWN',
      title: 'Incident #8492: Datacenter Core Switch Flapping & High CPU Meltdown',
      description:
        'At 03:14 UTC, monitoring generated critical P1 alerts for the Core Datacenter Switch cluster (SW-CORE-01). CPU utilization spiked to 99%, host MAC addresses began flapping violently between Port-Channel 1 and access port Gi1/0/24, and cross-VLAN inter-pod traffic experienced severe 85% packet loss.',
      topologySummary:
        'SW-CORE-01 (L3 Core, Root Bridge for VLAN 10/20, RSTP priority 4096) <== Po1 (802.1Q Trunk) ==> SW-DIST-01 <== Gi1/0/24 ==> SW-ACC-04 (Access switch). On SW-ACC-04, an unmanaged 8-port switch was connected to Gi1/0/5 and Gi1/0/6 simultaneously.',
      syslogSnippet: `03:14:02.102 UTC: %SW_MATM-4-MACFLAP_NOTIF: Host 0050.56a1.2b3c in vlan 10 is flapping between port Po1 and port Gi1/0/24
03:14:04.421 UTC: %SPANTREE-2-RECV_PVID_ERR: Received BPDU with inconsistent peer vlan id 10 on GigabitEthernet1/0/24
03:14:07.188 UTC: %SPANTREE-2-BLOCK_PVID_LOCAL: Blocking GigabitEthernet1/0/24 on VLAN0010. Inconsistent local vlan.
03:14:12.890 UTC: %SYS-3-CPUHOG: Task ran for 2140 msec (15/15), process = Spanning Tree, CPU utilization = 99%
03:14:15.011 UTC: %ETH_PORT_CHANNEL-5-PORTDOWN: Port-channel1 member Gi1/0/1 link suspended: excessive broadcast input rate`,
      interfaceConfigs: {
        'SW-ACC-04:Gi1/0/5': `interface GigabitEthernet1/0/5\n description Engineering_Bench_Jack_1\n switchport access vlan 10\n switchport mode access\n spanning-tree portfast\n spanning-tree bpdufilter enable`,
        'SW-ACC-04:Gi1/0/6': `interface GigabitEthernet1/0/6\n description Engineering_Bench_Jack_2\n switchport access vlan 10\n switchport mode access\n spanning-tree portfast\n spanning-tree bpdufilter enable`,
        'SW-ACC-04:Gi1/0/24': `interface GigabitEthernet1/0/24\n description Uplink_to_DIST_01\n switchport trunk encapsulation dot1q\n switchport mode trunk\n switchport trunk native vlan 10`,
      },
      tasks: [
        {
          taskId: 'INCIDENT-TASK1',
          title: 'Failure Domain & OSI Layer Isolation',
          prompt: 'Identify the primary OSI layer and failure domain responsible for the core outage.',
          type: 'CHOICE',
          options: [
            { id: 'LAYER_1_PHYSICAL', label: 'Layer 1: Physical fiber attenuation / faulty SFP optic transceiver' },
            { id: 'LAYER_2_DATA_LINK', label: 'Layer 2: Data Link switching loop and broadcast storm' },
            { id: 'LAYER_3_NETWORK', label: 'Layer 3: BGP autonomous system routing table oscillation' },
            { id: 'LAYER_4_TRANSPORT', label: 'Layer 4: TCP SYN flood exhaustion of core router socket tables' },
          ],
          correctAnswer: 'LAYER_2_DATA_LINK',
          points: 20,
        },
        {
          taskId: 'INCIDENT-TASK2',
          title: 'Protocol Failure Mechanism',
          prompt: 'What specific protocol failure mechanism allowed the broadcast storm to form?',
          type: 'CHOICE',
          options: [
            { id: 'OSPF_LSA_STORM', label: 'OSPF Type 1 LSA flooding caused by MTU mismatch' },
            { id: 'SWITCHING_LOOP_BPDU_FILTER', label: 'BPDU Filter on access ports suppressed BPDUs, disabling STP loop detection' },
            { id: 'DHCP_STARVATION', label: 'DHCP scope pool exhaustion caused by rogue rogue server' },
            { id: 'ARP_POISONING', label: 'Gratuitous ARP MITM spoofing gateway IP address' },
          ],
          correctAnswer: 'SWITCHING_LOOP_BPDU_FILTER',
          points: 25,
        },
        {
          taskId: 'INCIDENT-TASK3',
          title: 'Precise Root Cause Identification',
          prompt: 'What physical action and configuration combination caused this catastrophe?',
          type: 'CHOICE',
          options: [
            { id: 'TRUNK_PRUNING_MISCONFIG', label: 'VLAN 10 was pruned from Port-Channel 1 on SW-DIST-01' },
            { id: 'UNMANAGED_SWITCH_LOOP_WITH_BPDU_FILTER', label: 'An unmanaged switch connected to Gi1/0/5 and Gi1/0/6 formed an unblocked bridging loop because "spanning-tree bpdufilter enable" stopped BPDU transmission/reception' },
            { id: 'NATIVE_VLAN_MISMATCH', label: 'Native VLAN 10 conflicted with default VLAN 1 on the core switch' },
            { id: 'POWER_SUPPLY_FAILURE', label: 'Redundant power supply failure triggered switch reboot' },
          ],
          correctAnswer: 'UNMANAGED_SWITCH_LOOP_WITH_BPDU_FILTER',
          points: 25,
        },
        {
          taskId: 'INCIDENT-TASK4',
          title: 'Authoritative Diagnostic Sequence Order',
          prompt: 'Order the four diagnostic commands to methodically verify and trace the MAC flapping source.',
          type: 'ORDERING',
          options: [
            { id: 'CMD_SYSLOG', label: '1. show logging | include MACFLAP|SPANTREE (Examine event timeline)' },
            { id: 'CMD_MAC_TABLE', label: '2. show mac address-table address <flapping-mac> (Trace flapping ingress ports)' },
            { id: 'CMD_CDP_NEIGHBOR', label: '3. show cdp neighbors detail (Verify connected switch topology)' },
            { id: 'CMD_INTERFACE_CONFIG', label: '4. show run interface <target-ports> (Inspect STP guard/filter configurations)' },
          ],
          correctAnswer: ['CMD_SYSLOG', 'CMD_MAC_TABLE', 'CMD_CDP_NEIGHBOR', 'CMD_INTERFACE_CONFIG'],
          points: 15,
        },
        {
          taskId: 'INCIDENT-TASK5',
          title: 'Remediation & Hardening Configuration',
          prompt: 'Which configuration change permanently eliminates this vulnerability on the access switch?',
          type: 'CHOICE',
          options: [
            { id: 'DISABLE_PORTFAST', label: 'Remove "spanning-tree portfast" and increase hello timer to 10 seconds' },
            { id: 'REMOVE_BPDUFILTER_ENABLE_BPDUGUARD', label: 'Remove "spanning-tree bpdufilter enable" and apply "spanning-tree bpduguard enable" (or spanning-tree portfast bpduguard default)' },
            { id: 'CHANGE_VLAN_TO_VLAN_99', label: 'Move access ports to unused VLAN 99' },
            { id: 'SHUTDOWN_PORT_CHANNEL', label: 'Shut down Port-channel 1 and use a single GigabitEthernet uplink' },
          ],
          correctAnswer: 'REMOVE_BPDUFILTER_ENABLE_BPDUGUARD',
          points: 15,
        },
      ],
    },
  },

  // =========================================================================
  // SECTION C: PACKET-CAPTURE FORENSICS (Weight: 25%)
  // 4 forensic questions totaling 100 section points
  // =========================================================================
  forensicsSection: {
    title: 'Domain III: Packet-Capture Forensics & Anomaly Analysis',
    description:
      'In-depth packet telemetry inspection of an intercepted TCP stream. Analyze frame headers, flags, sequence-number arithmetic, and anomalous blind reset attacks.',
    scenario: {
      scenarioCode: 'PCAP-FORENSICS-TCP-INJECTION',
      title: 'Forensic Case: Intercepted TCP Session & Blind Reset Injection Attack',
      description:
        'A forensic packet capture was taken on perimeter tap interface tap0 during an abnormal disconnection of a secure enterprise management session between client 192.168.1.100 and server 10.0.0.50:443.',
      frames: [
        {
          frameNumber: 1,
          timestamp: '00:00.000000',
          sourceIp: '192.168.1.100',
          destIp: '10.0.0.50',
          protocol: 'TCP',
          srcPort: 54321,
          dstPort: 443,
          tcpFlags: ['SYN'],
          seqHex: '0x2A1B3C4D',
          seqDec: 706427981,
          windowSize: 64240,
          payloadLength: 0,
          info: '54321 -> 443 [SYN] Seq=706427981 Win=64240 Len=0 MSS=1460 SACK_PERM',
        },
        {
          frameNumber: 2,
          timestamp: '00:00.015240',
          sourceIp: '10.0.0.50',
          destIp: '192.168.1.100',
          protocol: 'TCP',
          srcPort: 443,
          dstPort: 54321,
          tcpFlags: ['SYN', 'ACK'],
          seqHex: '0x8F7E6D5C',
          seqDec: 2407427420,
          ackHex: '0x2A1B3C4E',
          ackDec: 706427982,
          windowSize: 65535,
          payloadLength: 0,
          info: '443 -> 54321 [SYN, ACK] Seq=2407427420 Ack=706427982 Win=65535 Len=0 MSS=1460',
        },
        {
          frameNumber: 3,
          timestamp: '00:00.015890',
          sourceIp: '192.168.1.100',
          destIp: '10.0.0.50',
          protocol: 'TCP',
          srcPort: 54321,
          dstPort: 443,
          tcpFlags: ['ACK'],
          seqHex: '0x2A1B3C4E',
          seqDec: 706427982,
          ackHex: '0x8F7E6D5D',
          ackDec: 2407427421,
          windowSize: 64240,
          payloadLength: 0,
          info: '54321 -> 443 [ACK] Seq=706427982 Ack=2407427421 Win=64240 Len=0',
        },
        {
          frameNumber: 4,
          timestamp: '00:00.024100',
          sourceIp: '192.168.1.100',
          destIp: '10.0.0.50',
          protocol: 'TCP',
          srcPort: 54321,
          dstPort: 443,
          tcpFlags: ['RST'],
          seqHex: '0x11223344',
          seqDec: 287454020,
          windowSize: 0,
          payloadLength: 0,
          info: '54321 -> 443 [RST] Seq=287454020 Win=0 Len=0 [ANOMALOUS SEQUENCE NUMBER]',
        },
        {
          frameNumber: 5,
          timestamp: '00:00.031500',
          sourceIp: '192.168.1.100',
          destIp: '10.0.0.50',
          protocol: 'TCP',
          srcPort: 54321,
          dstPort: 443,
          tcpFlags: ['PSH', 'ACK'],
          seqHex: '0x2A1B3C4E',
          seqDec: 706427982,
          ackHex: '0x8F7E6D5D',
          ackDec: 2407427421,
          windowSize: 64240,
          payloadLength: 512,
          info: '54321 -> 443 [PSH, ACK] Seq=706427982 Ack=2407427421 Win=64240 Len=512 (TLS Client Hello)',
        },
      ],
      questions: [
        {
          id: 'FORENSICS-Q1',
          prompt:
            'Examine Frame 2 (SYN-ACK). What is the exact relationship between the Server Acknowledgment Number (0x2A1B3C4E / 706427982) and the Client Initial Sequence Number (ISN) from Frame 1, and why is this increment required?',
        options: [
          'Ack = Client ISN + 1; the SYN flag consumes exactly 1 sequence number space to guarantee reliable delivery.',
          'Ack = Client ISN + MSS (1460); it acknowledges the maximum segment size buffer.',
          'Ack = Random 32-bit nonce generated by the server PRNG.',
          'Ack = Window size divided by 2 to configure flow control.',
        ],
        correctOption: 0,
        points: 25,
        explanation:
          'In the TCP 3-way handshake, the SYN flag consumes one sequence number. The receiver acknowledges it with Ack = ISN + 1 (0x2A1B3C4D + 1 = 0x2A1B3C4E).',
      },
      {
        id: 'FORENSICS-Q2',
        prompt:
          'In Frame 3, what TCP socket state transition is finalized on the client host upon transmitting this packet?',
        options: [
          'From SYN_SENT to ESTABLISHED',
          'From LISTEN to SYN_RECEIVED',
          'From FIN_WAIT_1 to TIME_WAIT',
          'From CLOSE_WAIT to LAST_ACK',
        ],
        correctOption: 0,
        points: 25,
        explanation:
          'The client enters SYN_SENT upon sending Frame 1 (SYN). When it receives Frame 2 (SYN-ACK) and transmits Frame 3 (ACK), its socket transitions to ESTABLISHED.',
      },
      {
        id: 'FORENSICS-Q3',
        prompt:
          'Analyze Frame 4 (RST). Why did this RST frame FAIL to terminate the TCP connection on the server, allowing Frame 5 (TLS Client Hello) to be processed normally?',
        options: [
          'The RST packet had an invalid source port number.',
          'The injected RST packet’s sequence number (0x11223344 / 287454020) falls completely outside the server’s receive window [0x2A1B3C4E .. 0x2A1B3C4E + 65535], violating RFC 5961 blind reset mitigation rules.',
          'The server had disabled TCP resets globally via sysctl.',
          'RST packets require prior authorization via TLS session tickets.',
        ],
        correctOption: 1,
        points: 25,
        explanation:
          'Under RFC 5961, an in-path spoofed RST must match the exact expected sequence number or fall strictly within the receive window. Frame 4 has sequence number 287454020, while the expected window starts at 706427982. The server silently drops the out-of-window RST.',
      },
      {
        id: 'FORENSICS-Q4',
        prompt:
          'In Frame 5, the client transmits a 512-byte payload with Seq = 0x2A1B3C4E (706427982). What will be the exact sequence number of the NEXT segment transmitted by the client, and what will the server acknowledge?',
        options: [
          'Next Client Seq = 0x2A1B3E4E (706428494 = 706427982 + 512); Server will Ack = 706428494',
          'Next Client Seq = 706427983; Server will Ack = 706427982',
          'Next Client Seq = 706429442 (Seq + 1460); Server will Ack = 0',
          'Next Client Seq = 0; Server closes the connection',
        ],
        correctOption: 0,
        points: 25,
        explanation:
          'TCP sequence numbers advance by the number of payload bytes transmitted. 706427982 + 512 = 706428494 (0x2A1B3E4E). The server acknowledges all contiguous received bytes with Ack = 706428494.',
      },
    ],
    },
  },
};

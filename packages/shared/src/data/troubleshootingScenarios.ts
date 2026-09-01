import { TroubleshootingScenario } from '../models/TroubleshootingModel';

export const TROUBLESHOOTING_SCENARIOS: TroubleshootingScenario[] = [
  // 1. DNS Resolution Failure
  {
    id: 'scen-dns-fail',
    slug: 'dns-resolution-failure',
    title: 'DNS Resolution Failure: Internal Connectivity Active, Hostnames Unresolvable',
    incidentDescription:
      'Engineers at Branch Office Alpha report that while internal direct IP services are functioning, web browsing to internet domains (e.g. portal.netvision.io) fails with "Server Not Found" and DNS timeouts.',
    category: 'Core IP Services',
    difficulty: 'BEGINNER',
    estimatedMinutes: 15,
    networkingConcepts: ['DNS (Domain Name System)', 'UDP Port 53', 'Layer 7 Application Protocol', 'Resolver Configuration'],
    initialSymptoms: [
      'Users cannot resolve public domain names like portal.netvision.io or cdn.netvision.io',
      'Direct IP ping to 8.8.8.8 and default gateway 192.168.1.1 succeeds',
      'Web browser displays ERR_NAME_NOT_RESOLVED on client workstations',
    ],
    topology: {
      nodes: [
        {
          id: 'node-pc1',
          name: 'Workstation-01',
          type: 'pc',
          ipAddress: '192.168.1.50',
          subnetMask: '255.255.255.0',
          defaultGateway: '192.168.1.1',
          dnsServers: ['192.168.1.250'],
          status: 'degraded',
          position: { x: 120, y: 220 },
        },
        {
          id: 'node-sw1',
          name: 'Access-Switch-01',
          type: 'switch',
          status: 'online',
          position: { x: 380, y: 220 },
        },
        {
          id: 'node-gw1',
          name: 'Edge-Router-01',
          type: 'router',
          ipAddress: '192.168.1.1',
          subnetMask: '255.255.255.0',
          status: 'online',
          position: { x: 620, y: 220 },
        },
        {
          id: 'node-dns-pub',
          name: 'Public-DNS (1.1.1.1)',
          type: 'server',
          ipAddress: '1.1.1.1',
          status: 'online',
          position: { x: 880, y: 150 },
        },
      ],
      links: [
        { id: 'link-1', sourceNodeId: 'node-pc1', targetNodeId: 'node-sw1', status: 'connected', latencyMs: 1 },
        { id: 'link-2', sourceNodeId: 'node-sw1', targetNodeId: 'node-gw1', status: 'connected', latencyMs: 1 },
        { id: 'link-3', sourceNodeId: 'node-gw1', targetNodeId: 'node-dns-pub', status: 'connected', latencyMs: 12 },
      ],
    },
    evidenceItems: [
      {
        id: 'ev-dns-1',
        title: 'Workstation IP Configuration',
        category: 'CONFIG',
        description: 'Output from ipconfig /all shows DNS server set to nonexistent IP 192.168.1.250',
        data: 'DNS Servers . . . . . . . . . . . : 192.168.1.250 (Non-responsive decommissioning remnant)',
        discoveredByCommand: 'ipconfig /all',
        isUnlocked: false,
      },
      {
        id: 'ev-dns-2',
        title: 'DNS Query Timeout Telemetry',
        category: 'LOG',
        description: 'nslookup queries to 192.168.1.250 on UDP port 53 timed out after 2000ms',
        data: "DNS request timed out.\n    timeout was 2 seconds.\n*** Can't find server name for address 192.168.1.250: Timed out",
        discoveredByCommand: 'nslookup portal.netvision.io',
        isUnlocked: false,
      },
      {
        id: 'ev-dns-3',
        title: 'External DNS Reachability Test',
        category: 'CLI_OUTPUT',
        description: 'Direct DNS query to Cloudflare public resolver 1.1.1.1 succeeds immediately',
        data: 'Server: 1.1.1.1\nAddress: 1.1.1.1#53\nNon-authoritative answer:\nName: portal.netvision.io\nAddress: 104.21.48.12',
        discoveredByCommand: 'nslookup portal.netvision.io 1.1.1.1',
        isUnlocked: false,
      },
    ],
    allowedCommands: [
      {
        command: 'ipconfig /all',
        description: 'Display network adapter configuration and configured DNS resolvers',
        category: 'DIAGNOSTIC',
        brokenOutput: `Ethernet adapter Local Area Connection:\n  IPv4 Address. . . . . . . . . . . : 192.168.1.50\n  Subnet Mask . . . . . . . . . . . : 255.255.255.0\n  Default Gateway . . . . . . . . . : 192.168.1.1\n  DNS Servers . . . . . . . . . . . : 192.168.1.250`,
        fixedOutput: `Ethernet adapter Local Area Connection:\n  IPv4 Address. . . . . . . . . . . : 192.168.1.50\n  Subnet Mask . . . . . . . . . . . : 255.255.255.0\n  Default Gateway . . . . . . . . . : 192.168.1.1\n  DNS Servers . . . . . . . . . . . : 1.1.1.1\n                                      8.8.8.8`,
        unlocksEvidenceId: 'ev-dns-1',
      },
      {
        command: 'ping 192.168.1.1',
        description: 'Test ICMP reachability to local gateway router',
        category: 'DIAGNOSTIC',
        brokenOutput: `PING 192.168.1.1: 56 data bytes\n64 bytes from 192.168.1.1: icmp_seq=0 ttl=64 time=0.82 ms\n64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=0.79 ms\n--- 192.168.1.1 ping statistics ---\n2 packets transmitted, 2 received, 0% packet loss`,
        fixedOutput: `PING 192.168.1.1: 56 data bytes\n64 bytes from 192.168.1.1: icmp_seq=0 ttl=64 time=0.82 ms\n--- 192.168.1.1 ping statistics ---\n1 packets transmitted, 1 received, 0% packet loss`,
      },
      {
        command: 'ping 8.8.8.8',
        description: 'Test ICMP reachability to internet IP address',
        category: 'DIAGNOSTIC',
        brokenOutput: `PING 8.8.8.8: 56 data bytes\n64 bytes from 8.8.8.8: icmp_seq=0 ttl=118 time=14.2 ms\n64 bytes from 8.8.8.8: icmp_seq=1 ttl=118 time=13.9 ms\n--- 8.8.8.8 ping statistics ---\n2 packets transmitted, 2 received, 0% packet loss`,
        fixedOutput: `PING 8.8.8.8: 56 data bytes\n64 bytes from 8.8.8.8: icmp_seq=0 ttl=118 time=14.2 ms\n--- 8.8.8.8 ping statistics ---\n1 packets transmitted, 1 received, 0% packet loss`,
      },
      {
        command: 'nslookup portal.netvision.io',
        description: 'Query configured DNS server for portal.netvision.io hostname',
        category: 'DIAGNOSTIC',
        brokenOutput: `Server:  192.168.1.250\nAddress: 192.168.1.250#53\n\n*** Request to 192.168.1.250 timed-out after 2000ms.\n*** Can't find portal.netvision.io: No response from server`,
        fixedOutput: `Server:  1.1.1.1\nAddress: 1.1.1.1#53\n\nNon-authoritative answer:\nName:    portal.netvision.io\nAddress: 104.21.48.12`,
        unlocksEvidenceId: 'ev-dns-2',
      },
      {
        command: 'nslookup portal.netvision.io 1.1.1.1',
        description: 'Explicitly query Cloudflare public DNS server 1.1.1.1',
        category: 'DIAGNOSTIC',
        brokenOutput: `Server:  1.1.1.1\nAddress: 1.1.1.1#53\n\nNon-authoritative answer:\nName:    portal.netvision.io\nAddress: 104.21.48.12`,
        fixedOutput: `Server:  1.1.1.1\nAddress: 1.1.1.1#53\n\nNon-authoritative answer:\nName:    portal.netvision.io\nAddress: 104.21.48.12`,
        unlocksEvidenceId: 'ev-dns-3',
      },
    ],
    rootCauseOptions: [
      {
        id: 'rc-dns-1',
        description: 'The workstation is configured with a dead/decommissioned DNS resolver IP (192.168.1.250) that does not reply on UDP port 53.',
        isCorrect: true,
        explanation: 'Local Layer 2/3 connectivity and gateway routing are intact, but name resolution fails because 192.168.1.250 is unreachable or no longer operating as a recursive resolver.',
      },
      {
        id: 'rc-dns-2',
        description: 'The default gateway 192.168.1.1 is dropping all outbound internet traffic.',
        isCorrect: false,
        explanation: 'Incorrect: Pings to 8.8.8.8 and nslookup directly to 1.1.1.1 both succeed through the gateway.',
      },
    ],
    hiddenRootCauseId: 'rc-dns-1',
    remediationOptions: [
      {
        id: 'rem-dns-1',
        title: 'Reconfigure DNS Server Addresses to 1.1.1.1 and 8.8.8.8',
        commandSyntax: 'netsh interface ip set dns "Local Area Connection" static 1.1.1.1',
        actionDescription: 'Update workstation adapter DNS server settings to active public resolvers (1.1.1.1 & 8.8.8.8).',
        isCorrect: true,
        explanation: 'Configuring valid upstream DNS resolvers immediately restores name resolution for all applications.',
      },
    ],
    correctRemediationId: 'rem-dns-1',
    verificationTests: [
      {
        id: 'test-dns-1',
        name: 'Validate Primary DNS Resolution',
        testCommand: 'nslookup portal.netvision.io',
        expectedOutputSubstring: '104.21.48.12',
        failureMessage: 'Hostname portal.netvision.io failed to resolve.',
        successMessage: 'portal.netvision.io successfully resolved to 104.21.48.12.',
      },
    ],
    postMortem: {
      summary: 'Host DNS resolver pointed to a decommissioned legacy server IP (192.168.1.250), preventing hostname lookups despite intact IP routing.',
      rootCauseAnalysis: 'During recent data center server migrations, the local DNS forwarder at 192.168.1.250 was retired. Static client IP configurations were not updated to the new DNS IPs, resulting in DNS query timeouts.',
      osiLayer: 'Layer 7 (Application)',
      preventionBestPractices: [
        'Use DHCP Option 6 (Domain Name Server) to dynamically distribute DNS resolvers rather than hardcoding static IPs.',
        'Implement DNS server monitoring and health checks prior to server decommissioning.',
      ],
      recommendedCommands: ['ipconfig /all', 'nslookup <host> [server]', 'ipconfig /flushdns', 'dig +trace <domain>'],
    },
  },

  // 2. DHCP Failure
  {
    id: 'scen-dhcp-fail',
    slug: 'dhcp-failure',
    title: 'DHCP Failure: Workstation Assigned APIPA 169.254.x.x Auto-Configuration Address',
    incidentDescription:
      'A newly deployed laptop in Conference Room B is unable to communicate with any LAN or internet devices. Inspection shows it has been assigned IP 169.254.88.102.',
    category: 'Core IP Services',
    difficulty: 'BEGINNER',
    estimatedMinutes: 15,
    networkingConcepts: ['DHCP (Dynamic Host Configuration Protocol)', 'APIPA (RFC 3927)', 'DHCP Relay / IP Helper', 'UDP Broadcast (Ports 67/68)'],
    initialSymptoms: [
      'Client workstation cannot reach any network hosts or internet gateways',
      'Adapter IPv4 address displays 169.254.x.x (APIPA automatic private IP address)',
      'Subnet mask displays 255.255.0.0 with empty default gateway field',
    ],
    topology: {
      nodes: [
        {
          id: 'node-laptop1',
          name: 'Conference-Laptop',
          type: 'pc',
          ipAddress: '169.254.88.102',
          subnetMask: '255.255.0.0',
          status: 'offline',
          position: { x: 120, y: 220 },
        },
        {
          id: 'node-sw-conf',
          name: 'Conf-Switch-VLAN30',
          type: 'switch',
          status: 'online',
          position: { x: 380, y: 220 },
        },
        {
          id: 'node-rtr-core',
          name: 'Core-Router-VLAN30-SVI',
          type: 'router',
          ipAddress: '192.168.30.1',
          subnetMask: '255.255.255.0',
          status: 'online',
          position: { x: 620, y: 220 },
        },
        {
          id: 'node-dhcp-srv',
          name: 'Enterprise-DHCP-Server',
          type: 'server',
          ipAddress: '10.10.10.50',
          status: 'online',
          position: { x: 880, y: 220 },
        },
      ],
      links: [
        { id: 'l1', sourceNodeId: 'node-laptop1', targetNodeId: 'node-sw-conf', status: 'connected', latencyMs: 1 },
        { id: 'l2', sourceNodeId: 'node-sw-conf', targetNodeId: 'node-rtr-core', status: 'connected', latencyMs: 1 },
        { id: 'l3', sourceNodeId: 'node-rtr-core', targetNodeId: 'node-dhcp-srv', status: 'connected', latencyMs: 2 },
      ],
    },
    evidenceItems: [
      {
        id: 'ev-dhcp-1',
        title: 'APIPA Address Allocation on Client',
        category: 'CONFIG',
        description: 'Workstation ipconfig confirms 169.254.88.102 (Automatic Private IP Addressing)',
        data: 'Autoconfiguration IPv4 Address. . : 169.254.88.102\nSubnet Mask . . . . . . . . . . . : 255.255.0.0\nDefault Gateway . . . . . . . . . :',
        discoveredByCommand: 'ipconfig /all',
        isUnlocked: false,
      },
    ],
    allowedCommands: [
      {
        command: 'ipconfig /all',
        description: 'Inspect adapter IP configuration',
        category: 'DIAGNOSTIC',
        brokenOutput: `Ethernet adapter Ethernet 1:\n  DHCP Enabled. . . . . . . . . . . : Yes\n  Autoconfiguration IPv4 Address. . : 169.254.88.102\n  Subnet Mask . . . . . . . . . . . : 255.255.0.0`,
        fixedOutput: `Ethernet adapter Ethernet 1:\n  DHCP Enabled. . . . . . . . . . . : Yes\n  IPv4 Address. . . . . . . . . . . : 192.168.30.45\n  Subnet Mask . . . . . . . . . . . : 255.255.255.0\n  Default Gateway . . . . . . . . . : 192.168.30.1`,
        unlocksEvidenceId: 'ev-dhcp-1',
      },
      {
        command: 'show running-config interface vlan 30',
        description: 'Inspect router VLAN 30 SVI gateway configuration',
        category: 'INSPECTION',
        brokenOutput: `interface Vlan30\n description Conference Room Network\n ip address 192.168.30.1 255.255.255.0\n no shutdown`,
        fixedOutput: `interface Vlan30\n description Conference Room Network\n ip address 192.168.30.1 255.255.255.0\n ip helper-address 10.10.10.50\n no shutdown`,
      },
    ],
    rootCauseOptions: [
      {
        id: 'rc-dhcp-1',
        description: 'The router VLAN 30 SVI interface lacks an "ip helper-address" DHCP relay agent pointing to the centralized DHCP server at 10.10.10.50.',
        isCorrect: true,
        explanation: 'DHCP DISCOVER is a Layer 2 broadcast that routers drop by default unless DHCP relay is configured.',
      },
    ],
    hiddenRootCauseId: 'rc-dhcp-1',
    remediationOptions: [
      {
        id: 'rem-dhcp-1',
        title: 'Configure "ip helper-address 10.10.10.50" on VLAN 30 Interface',
        commandSyntax: 'interface Vlan30\n ip helper-address 10.10.10.50',
        actionDescription: 'Enable DHCP Relay on Router SVI to forward client UDP broadcasts as unicast to the central DHCP server.',
        isCorrect: true,
        explanation: 'This allows DHCP broadcasts from VLAN 30 to reach the DHCP server in the server subnet.',
      },
    ],
    correctRemediationId: 'rem-dhcp-1',
    verificationTests: [
      {
        id: 'test-dhcp-1',
        name: 'Validate DHCP Lease Acquisition',
        testCommand: 'ipconfig /renew',
        expectedOutputSubstring: '192.168.30.',
        failureMessage: 'DHCP lease renewal failed.',
        successMessage: 'Workstation received valid DHCP lease 192.168.30.45 from 10.10.10.50.',
      },
    ],
    postMortem: {
      summary: 'Clients on newly provisioned VLAN 30 fell back to APIPA (169.254.x.x) because router dropped DHCP broadcasts due to missing ip helper-address relay configuration.',
      rootCauseAnalysis: 'DHCP client discovery uses broadcast 255.255.255.255. Routers terminate broadcast domains and do not forward broadcasts between subnets without an ip helper-address configured.',
      osiLayer: 'Layer 7 (Application)',
      preventionBestPractices: [
        'Include DHCP relay (ip helper-address) in standard switch/router SVI provisioning templates.',
      ],
      recommendedCommands: ['ipconfig /renew', 'show running-config interface <int>', 'ip helper-address <ip>'],
    },
  },

  // 3. Incorrect Subnet Mask
  {
    id: 'scen-mask-mismatch',
    slug: 'incorrect-subnet-mask',
    title: 'Incorrect Subnet Mask: Intra-Subnet Works, Inter-Subnet & Gateway Fails',
    incidentDescription:
      'Server-02 (192.168.1.10) can ping adjacent server (192.168.1.20) but cannot communicate with external servers in 192.168.2.0/24 or the internet gateway 192.168.1.1.',
    category: 'IP Addressing & Subnetting',
    difficulty: 'BEGINNER',
    estimatedMinutes: 15,
    networkingConcepts: ['IPv4 Subnet Masking', 'CIDR Notation', 'Local vs Remote Routing Decision', 'Default Gateway Forwarding'],
    initialSymptoms: [
      'Server-02 can ping some local LAN peers, but pings to 192.168.2.50 fail with "Destination host unreachable"',
      'Traffic destined for remote networks is not being forwarded to default gateway 192.168.1.1',
    ],
    topology: {
      nodes: [
        {
          id: 'node-srv2',
          name: 'Server-02',
          type: 'server',
          ipAddress: '192.168.1.10',
          subnetMask: '255.255.0.0', // Mismatch
          defaultGateway: '192.168.1.1',
          status: 'degraded',
          position: { x: 120, y: 220 },
        },
        {
          id: 'node-gw-rtr',
          name: 'Gateway-Router',
          type: 'router',
          ipAddress: '192.168.1.1',
          subnetMask: '255.255.255.0',
          status: 'online',
          position: { x: 450, y: 220 },
        },
        {
          id: 'node-dest-srv',
          name: 'Remote-Server',
          type: 'server',
          ipAddress: '192.168.2.50',
          subnetMask: '255.255.255.0',
          status: 'online',
          position: { x: 780, y: 220 },
        },
      ],
      links: [
        { id: 'l1', sourceNodeId: 'node-srv2', targetNodeId: 'node-gw-rtr', status: 'connected', latencyMs: 1 },
        { id: 'l2', sourceNodeId: 'node-gw-rtr', targetNodeId: 'node-dest-srv', status: 'connected', latencyMs: 2 },
      ],
    },
    evidenceItems: [
      {
        id: 'ev-mask-1',
        title: 'Server-02 Subnet Mask Configuration',
        category: 'CONFIG',
        description: 'Server-02 has subnet mask 255.255.0.0 (/16) instead of standard subnet /24',
        data: 'IPv4 Address: 192.168.1.10\nSubnet Mask: 255.255.0.0\nDefault Gateway: 192.168.1.1',
        discoveredByCommand: 'ip addr show eth0',
        isUnlocked: false,
      },
    ],
    allowedCommands: [
      {
        command: 'ip addr show eth0',
        description: 'Display IP address and CIDR prefix length',
        category: 'DIAGNOSTIC',
        brokenOutput: `eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500\n    inet 192.168.1.10/16 brd 192.168.255.255 scope global eth0`,
        fixedOutput: `eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500\n    inet 192.168.1.10/24 brd 192.168.1.255 scope global eth0`,
        unlocksEvidenceId: 'ev-mask-1',
      },
      {
        command: 'ping 192.168.2.50',
        description: 'Test connectivity to remote server on 192.168.2.0/24 subnet',
        category: 'DIAGNOSTIC',
        brokenOutput: `PING 192.168.2.50 (192.168.2.50) 56(84) bytes of data.\nFrom 192.168.1.10 icmp_seq=1 Destination Host Unreachable`,
        fixedOutput: `PING 192.168.2.50 (192.168.2.50) 56(84) bytes of data.\n64 bytes from 192.168.2.50: icmp_seq=1 ttl=63 time=1.45 ms\n--- 192.168.2.50 ping statistics ---\n1 packets transmitted, 1 received, 0% packet loss`,
      },
    ],
    rootCauseOptions: [
      {
        id: 'rc-mask-1',
        description: 'Server-02 has an overly broad subnet mask (/16: 255.255.0.0), causing it to falsely treat 192.168.2.50 as a local on-link host instead of forwarding to the gateway.',
        isCorrect: true,
        explanation: 'When destination IP is in the configured local subnet, the host ARPs directly for the destination MAC rather than sending to the default gateway MAC.',
      },
    ],
    hiddenRootCauseId: 'rc-mask-1',
    remediationOptions: [
      {
        id: 'rem-mask-1',
        title: 'Correct Subnet Mask to 255.255.255.0 (/24) on Server-02',
        commandSyntax: 'ip addr add 192.168.1.10/24 dev eth0 && ip addr del 192.168.1.10/16 dev eth0',
        actionDescription: 'Update eth0 interface subnet mask from /16 to /24.',
        isCorrect: true,
        explanation: 'This restores proper boundary detection so 192.168.2.0/24 traffic correctly egresses through gateway 192.168.1.1.',
      },
    ],
    correctRemediationId: 'rem-mask-1',
    verificationTests: [
      {
        id: 'test-mask-1',
        name: 'Verify Remote Subnet Ping',
        testCommand: 'ping 192.168.2.50',
        expectedOutputSubstring: '0% packet loss',
        failureMessage: 'Ping to remote subnet 192.168.2.50 failed.',
        successMessage: 'Ping to remote subnet 192.168.2.50 succeeded with 0% loss.',
      },
    ],
    postMortem: {
      summary: 'A /16 subnet mask on a /24 subnet broke inter-subnet routing by forcing direct local ARP requests for remote IP addresses.',
      rootCauseAnalysis: 'Network stacks use the local IP and subnet mask to determine if a destination IP is on-link or remote. A /16 mask meant 192.168.2.50 was considered local, so the host broadcast ARP instead of sending frames to the default gateway MAC.',
      osiLayer: 'Layer 3 (Network)',
      preventionBestPractices: [
        'Enforce consistent subnetting definitions via IPAM (IP Address Management) systems.',
      ],
      recommendedCommands: ['ip addr show', 'ip route show', 'tcpdump -i eth0 arp'],
    },
  },

  // 4. ARP Resolution Failure
  {
    id: 'scen-arp-fail',
    slug: 'arp-resolution-failure',
    title: 'ARP Resolution Failure: Stale Static ARP Entry Blocks Gateway Communication',
    incidentDescription:
      'After replacing the core gateway router hardware (new MAC address), Client-01 lost connectivity. Other hosts can reach the new router, but Client-01 fails with "Destination Host Unreachable".',
    category: 'Layer 2 Ethernet & ARP',
    difficulty: 'INTERMEDIATE',
    estimatedMinutes: 15,
    networkingConcepts: ['ARP (Address Resolution Protocol)', 'Layer 2 MAC vs Layer 3 IP', 'Static ARP Cache', 'Gratuitous ARP'],
    initialSymptoms: [
      'Client-01 cannot ping gateway 192.168.1.1',
      'Other workstations on the same switch have no connectivity issues',
      'Client-01 ARP cache shows an old static MAC mapping for 192.168.1.1',
    ],
    topology: {
      nodes: [
        {
          id: 'node-c1',
          name: 'Client-01',
          type: 'pc',
          ipAddress: '192.168.1.100',
          subnetMask: '255.255.255.0',
          defaultGateway: '192.168.1.1',
          status: 'degraded',
          position: { x: 120, y: 220 },
        },
        {
          id: 'node-rtr-new',
          name: 'New-Core-Router',
          type: 'router',
          ipAddress: '192.168.1.1',
          macAddress: '00:50:56:AA:BB:CC',
          status: 'online',
          position: { x: 650, y: 220 },
        },
      ],
      links: [
        { id: 'l1', sourceNodeId: 'node-c1', targetNodeId: 'node-rtr-new', status: 'connected', latencyMs: 1 },
      ],
    },
    evidenceItems: [
      {
        id: 'ev-arp-1',
        title: 'Client Static ARP Cache Table',
        category: 'CLI_OUTPUT',
        description: 'Client ARP table has a static entry binding 192.168.1.1 to decommissioned router MAC 00-11-22-33-44-55',
        data: 'Internet Address      Physical Address      Type\n192.168.1.1           00-11-22-33-44-55     static',
        discoveredByCommand: 'arp -a',
        isUnlocked: false,
      },
    ],
    allowedCommands: [
      {
        command: 'arp -a',
        description: 'View current ARP cache table entries',
        category: 'DIAGNOSTIC',
        brokenOutput: `Interface: 192.168.1.100 --- 0x2\n  Internet Address      Physical Address      Type\n  192.168.1.1           00-11-22-33-44-55     static`,
        fixedOutput: `Interface: 192.168.1.100 --- 0x2\n  Internet Address      Physical Address      Type\n  192.168.1.1           00-50-56-aa-bb-cc     dynamic`,
        unlocksEvidenceId: 'ev-arp-1',
      },
    ],
    rootCauseOptions: [
      {
        id: 'rc-arp-1',
        description: 'Client-01 has a hardcoded static ARP entry with the old router MAC address (00-11-22-33-44-55) preventing dynamic ARP resolution to the new router MAC (00-50-56-AA-BB-CC).',
        isCorrect: true,
        explanation: 'Static ARP entries override dynamic ARP requests, sending Ethernet frames to a non-existent MAC address.',
      },
    ],
    hiddenRootCauseId: 'rc-arp-1',
    remediationOptions: [
      {
        id: 'rem-arp-1',
        title: 'Delete Static ARP Entry and Allow Dynamic Resolution',
        commandSyntax: 'arp -d 192.168.1.1',
        actionDescription: 'Flush the static ARP table entry for 192.168.1.1.',
        isCorrect: true,
        explanation: 'Flushing the entry allows the host to send an ARP request and learn the new router MAC address dynamically.',
      },
    ],
    correctRemediationId: 'rem-arp-1',
    verificationTests: [
      {
        id: 'test-arp-1',
        name: 'Verify Gateway Communication',
        testCommand: 'ping 192.168.1.1',
        expectedOutputSubstring: '0% loss',
        failureMessage: 'Gateway ping test failed.',
        successMessage: 'Gateway ping test succeeded with 0% loss.',
      },
    ],
    postMortem: {
      summary: 'A legacy static ARP entry on the client prevented communication following router hardware replacement.',
      rootCauseAnalysis: 'Static ARP entries do not expire or update with Gratuitous ARP packets. When router hardware was replaced, Ethernet frames continued targeting the defunct MAC address.',
      osiLayer: 'Layer 2 (Data Link)',
      preventionBestPractices: [
        'Avoid static ARP entries on general endpoints unless required for specialized clustering.',
      ],
      recommendedCommands: ['arp -a', 'arp -d *', 'ip neigh show'],
    },
  },

  // 5. VLAN Mismatch
  {
    id: 'scen-vlan-mismatch',
    slug: 'vlan-mismatch',
    title: 'VLAN Mismatch: Access Port Misassigned to VLAN 20 Instead of Engineering VLAN 10',
    incidentDescription:
      'Workstation-Eng4 in the engineering department cannot communicate with the engineering file server (10.10.10.200) located on VLAN 10.',
    category: 'VLANs & Trunking',
    difficulty: 'INTERMEDIATE',
    estimatedMinutes: 20,
    networkingConcepts: ['802.1Q VLAN Tagging', 'Access vs Trunk Ports', 'Broadcast Domains', 'Switch Port Configuration'],
    initialSymptoms: [
      'Workstation-Eng4 link light is green, IP is statically 10.10.10.45/24',
      'Pings to engineering server 10.10.10.200 time out',
      'Switch port GigabitEthernet0/4 shows up/up',
    ],
    topology: {
      nodes: [
        {
          id: 'node-eng4',
          name: 'Workstation-Eng4',
          type: 'pc',
          ipAddress: '10.10.10.45',
          subnetMask: '255.255.255.0',
          status: 'degraded',
          position: { x: 120, y: 220 },
        },
        {
          id: 'node-sw-core',
          name: 'Floor-Switch-01',
          type: 'switch',
          status: 'online',
          position: { x: 450, y: 220 },
        },
        {
          id: 'node-eng-srv',
          name: 'Eng-File-Server (VLAN 10)',
          type: 'server',
          ipAddress: '10.10.10.200',
          subnetMask: '255.255.255.0',
          status: 'online',
          position: { x: 780, y: 220 },
        },
      ],
      links: [
        { id: 'l1', sourceNodeId: 'node-eng4', targetNodeId: 'node-sw-core', sourcePort: 'eth0', targetPort: 'Gi0/4', status: 'connected', latencyMs: 1 },
        { id: 'l2', sourceNodeId: 'node-sw-core', targetNodeId: 'node-eng-srv', sourcePort: 'Gi0/24', targetPort: 'eth0', status: 'connected', latencyMs: 1 },
      ],
    },
    evidenceItems: [
      {
        id: 'ev-vlan-1',
        title: 'Switch Port VLAN Membership Output',
        category: 'CLI_OUTPUT',
        description: 'show vlan brief reveals port Gi0/4 is assigned to VLAN 20 (Marketing) instead of VLAN 10 (Engineering)',
        data: 'VLAN Name                             Status    Ports\n---- -------------------------------- --------- -------------------------------\n10   Engineering                      active    Gi0/1, Gi0/2, Gi0/3, Gi0/24\n20   Marketing                        active    Gi0/4, Gi0/5, Gi0/6',
        discoveredByCommand: 'show vlan brief',
        isUnlocked: false,
      },
    ],
    allowedCommands: [
      {
        command: 'show vlan brief',
        description: 'Display VLAN database and assigned switch ports',
        category: 'INSPECTION',
        brokenOutput: `VLAN Name                             Status    Ports\n---- -------------------------------- --------- -------------------------------\n10   Engineering                      active    Gi0/1, Gi0/2, Gi0/3, Gi0/24\n20   Marketing                        active    Gi0/4, Gi0/5, Gi0/6`,
        fixedOutput: `VLAN Name                             Status    Ports\n---- -------------------------------- --------- -------------------------------\n10   Engineering                      active    Gi0/1, Gi0/2, Gi0/3, Gi0/4, Gi0/24\n20   Marketing                        active    Gi0/5, Gi0/6`,
        unlocksEvidenceId: 'ev-vlan-1',
      },
    ],
    rootCauseOptions: [
      {
        id: 'rc-vlan-1',
        description: 'Switch port Gi0/4 is configured in VLAN 20 (Marketing) while the host and server communicate on VLAN 10 (Engineering).',
        isCorrect: true,
        explanation: 'Ethernet frames from Gi0/4 are tagged with VLAN 20 and isolated from VLAN 10 devices at Layer 2.',
      },
    ],
    hiddenRootCauseId: 'rc-vlan-1',
    remediationOptions: [
      {
        id: 'rem-vlan-1',
        title: 'Assign Port Gi0/4 to VLAN 10',
        commandSyntax: 'interface GigabitEthernet0/4\n switchport access vlan 10',
        actionDescription: 'Change access VLAN on interface Gi0/4 to VLAN 10.',
        isCorrect: true,
        explanation: 'Placing Gi0/4 into VLAN 10 places Workstation-Eng4 into the same Layer 2 broadcast domain as the engineering server.',
      },
    ],
    correctRemediationId: 'rem-vlan-1',
    verificationTests: [
      {
        id: 'test-vlan-1',
        name: 'Verify File Server Connectivity',
        testCommand: 'ping 10.10.10.200',
        expectedOutputSubstring: '0% packet loss',
        failureMessage: 'Ping to engineering server failed.',
        successMessage: 'Ping to engineering server 10.10.10.200 verified with 0% loss.',
      },
    ],
    postMortem: {
      summary: 'A switch port was misconfigured in VLAN 20 rather than VLAN 10, segmenting Layer 2 traffic between the workstation and server.',
      rootCauseAnalysis: 'VLANs separate Layer 2 broadcast domains. Traffic cannot pass between different VLANs without a Layer 3 router.',
      osiLayer: 'Layer 2 (Data Link)',
      preventionBestPractices: [
        'Use dynamic VLAN assignment via RADIUS based on user credentials or device certificates.',
      ],
      recommendedCommands: ['show vlan brief', 'show interface <int> switchport'],
    },
  },
];

export interface CommandDefinition {
  id: string;
  command: string;
  operatingSystem: 'WINDOWS' | 'LINUX' | 'MACOS' | 'ALL';
  category: string;
  purpose: string;
  syntax: string;
  example: string;
  expectedOutput: string;
  explanation: string;
  warnings?: string;
  relatedLessonSlugs?: string[];
}

export const NETWORKING_COMMANDS_CATALOG: CommandDefinition[] = [
  // 1. IP Configuration (Windows)
  {
    id: 'cmd-win-ipconfig',
    command: 'ipconfig /all',
    operatingSystem: 'WINDOWS',
    category: 'Network information',
    purpose: 'Display all current TCP/IP network configuration values, DHCP lease info, and DNS servers.',
    syntax: 'ipconfig [/all | /release | /renew | /flushdns | /displaydns]',
    example: 'ipconfig /all',
    expectedOutput: `Windows IP Configuration
   Host Name . . . . . . . . . . . . : DESKTOP-NET-01
   Primary Dns Suffix  . . . . . . . : netvision.internal
   Node Type . . . . . . . . . . . . : Hybrid
   IP Routing Enabled. . . . . . . . : No

Ethernet adapter Local Area Connection:
   Connection-specific DNS Suffix  . : netvision.internal
   Description . . . . . . . . . . . : Intel(R) Ethernet Connection I219-LM
   Physical Address. . . . . . . . . : 00-1A-2B-3C-4D-5E
   DHCP Enabled. . . . . . . . . . . : Yes
   IPv4 Address. . . . . . . . . . . : 192.168.1.105(Preferred)
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Lease Obtained. . . . . . . . . . : Monday, September 1, 2026 8:00:00 AM
   Lease Expires . . . . . . . . . . : Tuesday, September 2, 2026 8:00:00 AM
   Default Gateway . . . . . . . . . : 192.168.1.1
   DHCP Server . . . . . . . . . . . : 192.168.1.1
   DNS Servers . . . . . . . . . . . : 1.1.1.1, 8.8.8.8`,
    explanation: 'Queries the Windows network stack to enumerate all physical and virtual network adapters with MAC addresses, assigned IPv4/IPv6 addresses, subnet masks, and default gateways.',
    warnings: 'Running /release will disconnect your active network connection until /renew is called.',
    relatedLessonSlugs: ['ip-addressing-ipv4-overview', 'dhcp-dns-overview'],
  },

  // 2. IP Address / Interface (Linux)
  {
    id: 'cmd-nix-ip-addr',
    command: 'ip addr show',
    operatingSystem: 'LINUX',
    category: 'Network information',
    purpose: 'Display all network interfaces, assigned IP addresses, broadcast addresses, and link states.',
    syntax: 'ip [options] addr [show | add | del] [dev <interface>]',
    example: 'ip addr show eth0',
    expectedOutput: `2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 52:54:00:12:34:56 brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.50/24 brd 192.168.1.255 scope global dynamic eth0
       valid_lft 86340sec preferred_lft 86340sec
    inet6 fe80::5054:ff:fe12:3456/64 scope link
       valid_lft forever preferred_lft forever`,
    explanation: 'Modern replacement for ifconfig on Linux. Shows interface flags (UP, BROADCAST), MAC address, IPv4 prefix with CIDR notation (/24), and link-local IPv6 address.',
    relatedLessonSlugs: ['ip-addressing-ipv4-overview', 'ethernet-mac-addresses-overview'],
  },

  // 3. Interface Config (macOS / BSD)
  {
    id: 'cmd-mac-ifconfig',
    command: 'ifconfig en0',
    operatingSystem: 'MACOS',
    category: 'Network information',
    purpose: 'Inspect interface parameters, IP assignments, MTU, and hardware MAC address on macOS.',
    syntax: 'ifconfig [interface] [parameters]',
    example: 'ifconfig en0',
    expectedOutput: `en0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
	options=400<CHANNEL_IO>
	ether a4:83:e7:2b:91:c2 
	inet6 fe80::1045:34f2:88ef:12ab%en0 prefixlen 64 secured scopeid 0x6 
	inet 192.168.1.120 netmask 0xffffff00 broadcast 192.168.1.255
	nd6 options=201<PERFORMNUD,DAD>
	media: autoselect (1000baseT <full-duplex>)
	status: active`,
    explanation: 'Displays BSD socket network interface state, link speed negotiation (1000baseT full-duplex), and hex netmask (0xffffff00 = 255.255.255.0).',
    relatedLessonSlugs: ['ethernet-mac-addresses-overview'],
  },

  // 4. Ping (Cross-Platform)
  {
    id: 'cmd-all-ping',
    command: 'ping',
    operatingSystem: 'ALL',
    category: 'Connectivity',
    purpose: 'Test reachability of a remote host and measure round-trip time (RTT) using ICMP Echo Request/Reply.',
    syntax: 'ping [-c count / -n count] [-t] [-s packetsize / -l size] <host>',
    example: 'ping -c 4 8.8.8.8',
    expectedOutput: `PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
64 bytes from 8.8.8.8: icmp_seq=1 ttl=118 time=14.2 ms
64 bytes from 8.8.8.8: icmp_seq=2 ttl=118 time=13.8 ms
64 bytes from 8.8.8.8: icmp_seq=3 ttl=118 time=14.5 ms
64 bytes from 8.8.8.8: icmp_seq=4 ttl=118 time=14.1 ms

--- 8.8.8.8 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3004ms
rtt min/avg/max/mdev = 13.812/14.150/14.502/0.248 ms`,
    explanation: 'Transmits ICMP type 8 (Echo Request) packets to the target IP. Target replies with ICMP type 0 (Echo Reply). Measures latency and detects packet loss.',
    warnings: 'Firewalls and cloud providers often drop ICMP packets by default even if the destination web service is operational.',
    relatedLessonSlugs: ['net-102-network-performance', 'network-troubleshooting-overview'],
  },

  // 5. Traceroute (Linux / macOS)
  {
    id: 'cmd-nix-traceroute',
    command: 'traceroute',
    operatingSystem: 'LINUX',
    category: 'Routing',
    purpose: 'Trace the hop-by-hop layer 3 path packets take toward a destination using expanding TTL probes.',
    syntax: 'traceroute [-n] [-m max_ttl] [-q nqueries] <destination>',
    example: 'traceroute -n 1.1.1.1',
    expectedOutput: `traceroute to 1.1.1.1 (1.1.1.1), 30 hops max, 60 byte packets
 1  192.168.1.1  1.124 ms  1.082 ms  1.050 ms
 2  10.0.0.1  8.412 ms  8.380 ms  8.350 ms
 3  172.16.20.1  12.210 ms  12.180 ms  12.150 ms
 4  1.1.1.1  14.320 ms  14.290 ms  14.250 ms`,
    explanation: 'Sends UDP or ICMP probes with incrementing IP Time-to-Live (TTL) values (1, 2, 3...). Intermediate routers drop the packet when TTL reaches 0 and return ICMP Time Exceeded (Type 11), revealing their IP.',
    relatedLessonSlugs: ['routing-fundamentals-overview'],
  },

  // 6. Tracert (Windows)
  {
    id: 'cmd-win-tracert',
    command: 'tracert',
    operatingSystem: 'WINDOWS',
    category: 'Routing',
    purpose: 'Trace the intermediate router hops to a remote host on Windows using ICMP Echo Requests.',
    syntax: 'tracert [-d] [-h maximum_hops] [-w timeout] <target_name>',
    example: 'tracert -d 8.8.8.8',
    expectedOutput: `Tracing route to 8.8.8.8 over a maximum of 30 hops

  1    <1 ms    <1 ms    <1 ms  192.168.1.1
  2     7 ms     7 ms     8 ms  10.50.0.1
  3    12 ms    11 ms    12 ms  172.20.4.1
  4    14 ms    14 ms    13 ms  8.8.8.8

Trace complete.`,
    explanation: 'Windows version of traceroute. Using -d avoids reverse DNS lookups for each hop, speeding up execution.',
    relatedLessonSlugs: ['routing-fundamentals-overview'],
  },

  // 7. ARP Table (Cross-Platform)
  {
    id: 'cmd-all-arp',
    command: 'arp -a',
    operatingSystem: 'ALL',
    category: 'ARP',
    purpose: 'Display the Address Resolution Protocol cache mapping IP addresses to Layer 2 MAC addresses.',
    syntax: 'arp [-a | -d <ip> | -s <ip> <mac>]',
    example: 'arp -a',
    expectedOutput: `Interface: 192.168.1.105 --- 0x12
  Internet Address      Physical Address      Type
  192.168.1.1           00-11-22-33-44-55     dynamic
  192.168.1.150         a4-83-e7-2b-91-c2     dynamic
  192.168.1.255         ff-ff-ff-ff-ff-ff     static
  224.0.0.22            01-00-5e-00-00-16     static`,
    explanation: 'Inspects the kernel ARP cache. Shows resolved physical hardware MAC addresses for hosts in the local broadcast domain. Prevents sending ARP requests for every outgoing frame.',
    warnings: 'Flushing the ARP cache (arp -d *) can momentarily cause latency while host tables are rebuilt.',
    relatedLessonSlugs: ['arp-protocol-overview', 'ethernet-mac-addresses-overview'],
  },

  // 8. DNS Lookup (nslookup)
  {
    id: 'cmd-all-nslookup',
    command: 'nslookup',
    operatingSystem: 'ALL',
    category: 'DNS',
    purpose: 'Query Domain Name System servers for A, AAAA, MX, CNAME, and TXT resource records.',
    syntax: 'nslookup [-query=type] <hostname> [dns_server]',
    example: 'nslookup google.com 1.1.1.1',
    expectedOutput: `Server:		1.1.1.1
Address:	1.1.1.1#53

Non-authoritative answer:
Name:	google.com
Address: 142.250.190.46
Name:	google.com
Address: 2607:f8b0:4004:800::200e`,
    explanation: 'Sends a DNS query directly to the specified nameserver (1.1.1.1 over UDP port 53) to verify resolution without relying on local OS DNS cache.',
    relatedLessonSlugs: ['dhcp-dns-overview'],
  },

  // 9. DNS Dig (Linux / macOS)
  {
    id: 'cmd-nix-dig',
    command: 'dig',
    operatingSystem: 'LINUX',
    category: 'DNS',
    purpose: 'Perform flexible, detailed DNS lookups displaying full response headers, TTLs, and authoritative flags.',
    syntax: 'dig [@server] [-t type] <name> [+short | +trace]',
    example: 'dig @8.8.8.8 netvision.edu +noall +answer',
    expectedOutput: `; <<>> DiG 9.18.18 <<>> @8.8.8.8 netvision.edu +noall +answer
netvision.edu.		300	IN	A	104.21.45.12
netvision.edu.		300	IN	A	172.67.182.90`,
    explanation: 'The industry-standard DNS diagnostic utility. Shows exact record TTL (300 seconds), query duration, and returned A/AAAA/TXT records.',
    relatedLessonSlugs: ['dhcp-dns-overview'],
  },

  // 10. Netstat / Active Connections (Cross-Platform)
  {
    id: 'cmd-all-netstat',
    command: 'netstat -ano',
    operatingSystem: 'WINDOWS',
    category: 'Connections',
    purpose: 'Display active TCP connections, listening ports, ethernet statistics, and process IDs (PID).',
    syntax: 'netstat [-a] [-n] [-o] [-p protocol] [-r] [-s]',
    example: 'netstat -ano | findstr :443',
    expectedOutput: `  Proto  Local Address          Foreign Address        State           PID
  TCP    0.0.0.0:443            0.0.0.0:0              LISTENING       4088
  TCP    192.168.1.105:54321    142.250.190.46:443     ESTABLISHED     12400
  TCP    192.168.1.105:54322    104.21.45.12:443       TIME_WAIT       0`,
    explanation: 'Lists socket endpoints (Local IP:Port -> Remote IP:Port) and TCP connection states (LISTENING, ESTABLISHED, TIME_WAIT, CLOSE_WAIT) along with owning process IDs.',
    relatedLessonSlugs: ['tcp-udp-transport-overview'],
  },

  // 11. Socket Statistics (ss - Linux)
  {
    id: 'cmd-nix-ss',
    command: 'ss -tulpn',
    operatingSystem: 'LINUX',
    category: 'Ports',
    purpose: 'Inspect active listening TCP and UDP sockets, buffer queues, and process associations.',
    syntax: 'ss [options] [filter]',
    example: 'ss -tulpn',
    expectedOutput: `Netid State  Recv-Q Send-Q Local Address:Port  Peer Address:Port Process
tcp   LISTEN 0      128    0.0.0.0:22          0.0.0.0:*     users:(("sshd",pid=850,fd=3))
tcp   LISTEN 0      511    0.0.0.0:4000        0.0.0.0:*     users:(("node",pid=2980,fd=21))
tcp   LISTEN 0      511    0.0.0.0:3000        0.0.0.0:*     users:(("next-server",pid=3100,fd=19))
udp   UNCONN 0      0      0.0.0.0:53          0.0.0.0:*     users:(("named",pid=912,fd=512))`,
    explanation: 'Modern high-performance Linux socket inspector replacing netstat. Fast query directly from kernel netlink interface.',
    relatedLessonSlugs: ['tcp-udp-transport-overview'],
  },

  // 12. Packet Capture (tcpdump - Linux / macOS)
  {
    id: 'cmd-nix-tcpdump',
    command: 'tcpdump',
    operatingSystem: 'LINUX',
    category: 'Troubleshooting',
    purpose: 'Capture and decode network packets on a live interface with Berkeley Packet Filters (BPF).',
    syntax: 'tcpdump [-i interface] [-nn] [-v] [-w file.pcap] [bpf_filter]',
    example: 'tcpdump -i eth0 -nn "port 80 or port 443" -c 3',
    expectedOutput: `listening on eth0, link-type EN10MB (Ethernet), snapshot length 262144 bytes
00:15:20.104210 IP 192.168.1.105.54320 > 93.184.216.34.80: Flags [S], seq 381029104, win 65535, options [mss 1460,sackOK,TS val 2819029 ecr 0], length 0
00:15:20.124110 IP 93.184.216.34.80 > 192.168.1.105.54320: Flags [S.], seq 94820194, ack 381029105, win 65535, options [mss 1460,sackOK,TS val 948201 ecr 2819029], length 0
00:15:20.124250 IP 192.168.1.105.54320 > 93.184.216.34.80: Flags [.], ack 1, win 65535, length 0
3 packets captured, 3 packets received by filter, 0 packets dropped by kernel`,
    explanation: 'Directly captures the 3-Way TCP Handshake (SYN [S], SYN-ACK [S.], ACK [.]). Essential for packet forensics, MTU mismatch diagnosis, and connection reset analysis.',
    warnings: 'Capturing at high packet rates can fill disk space rapidly. Always use capture filters and limit count (-c).',
    relatedLessonSlugs: ['tcp-udp-transport-overview', 'network-troubleshooting-overview'],
  },

  // 13. IP Route Table (Linux)
  {
    id: 'cmd-nix-ip-route',
    command: 'ip route show',
    operatingSystem: 'LINUX',
    category: 'Routing',
    purpose: 'Display the kernel IPv4 routing table and next-hop gateway definitions.',
    syntax: 'ip route [show | add | del | get]',
    example: 'ip route show',
    expectedOutput: `default via 192.168.1.1 dev eth0 proto dhcp src 192.168.1.105 metric 100 
10.0.0.0/8 via 192.168.1.254 dev eth0 metric 50 
192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.105 metric 100`,
    explanation: 'Lists matching prefixes with destination interface and next-hop gateway. Shows the default gateway (0.0.0.0/0 = default via 192.168.1.1) used for all non-local traffic.',
    relatedLessonSlugs: ['routing-fundamentals-overview'],
  },

  // 14. Network Mapper / Port Scanner (nmap)
  {
    id: 'cmd-all-nmap',
    command: 'nmap',
    operatingSystem: 'ALL',
    category: 'Troubleshooting',
    purpose: 'Perform security auditing, open port discovery, and OS fingerprinting on network hosts.',
    syntax: 'nmap [Scan Type(s)] [Options] {target specification}',
    example: 'nmap -sT -p 22,80,443,3000,4000 192.168.1.105',
    expectedOutput: `Starting Nmap 7.94 ( https://nmap.org ) at 2026-09-01 00:50 UTC
Nmap scan report for 192.168.1.105
Host is up (0.00042s latency).

PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   closed http
443/tcp  open  https
3000/tcp open  ppp
4000/tcp open  remoteanything

Nmap done: 1 IP address (1 host up) scanned in 0.12 seconds`,
    explanation: 'Initiates TCP connections across specified ports to determine service availability (OPEN, CLOSED, or FILTERED by firewall).',
    warnings: 'Only scan hosts and subnets that you own or have explicit authorized permission to test.',
    relatedLessonSlugs: ['network-security-basics-overview', 'firewalls-acls-overview'],
  },

  // 15. Curl (HTTP / API Inspection)
  {
    id: 'cmd-all-curl',
    command: 'curl',
    operatingSystem: 'ALL',
    category: 'Connectivity',
    purpose: 'Transfer data to/from a network server using HTTP, HTTPS, FTP, and inspect response headers.',
    syntax: 'curl [options] <URL>',
    example: 'curl -I https://netvision.edu/api/v1/health',
    expectedOutput: `HTTP/2 200 
date: Tue, 01 Sep 2026 00:50:00 GMT
content-type: application/json; charset=utf-8
content-length: 45
server: NetVision-Observatory-Proxy
x-frame-options: DENY
x-content-type-options: nosniff
strict-transport-security: max-age=31536000; includeSubDomains`,
    explanation: 'Sends an HTTP HEAD request (-I) to inspect HTTP status codes, TLS version, MIME types, and security headers without downloading response body.',
    relatedLessonSlugs: ['sdn-cloud-networking-overview'],
  },

  // 16. Flush DNS Cache (Windows)
  {
    id: 'cmd-win-flushdns',
    command: 'ipconfig /flushdns',
    operatingSystem: 'WINDOWS',
    category: 'DNS',
    purpose: 'Purge and reset the contents of the local client DNS resolver cache on Windows.',
    syntax: 'ipconfig /flushdns',
    example: 'ipconfig /flushdns',
    expectedOutput: `Windows IP Configuration

Successfully flushed the DNS Resolver Cache.`,
    explanation: 'Removes all cached domain-to-IP lookup records from local RAM. Forces the operating system to query upstream DNS servers on the next connection request.',
    relatedLessonSlugs: ['dhcp-dns-overview', 'network-troubleshooting-overview'],
  },
];

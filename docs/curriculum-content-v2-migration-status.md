# Curriculum Content Architecture V2 — Migration Status & Priority Audit

**Generated Date:** August 17, 2026  
**Status:** In Progress (Phase 5 / Benchmark Migration Completed)

---

## 1. Executive Summary & Inventory Counts

| Metric | Count / Percentage | Notes |
|---|---|---|
| **Total Active Production Lessons** | **30** | Benchmark & core interactive curriculum topics |
| **Lessons Migrated to `contentV2`** | **9** (30.0%) | 4 Benchmarks (NET-101, NET-203, NET-304, NET-403) + 5 Batch 1 Foundational (NET-102, NET-103) |
| **Lessons Using Legacy `stepMetadata`** | **21** (70.0%) | Functioning via backwards-compatible normalization |
| **Migration Percentage** | **30.0%** | 9 of 30 lessons fully converted |
| **Remaining P0 (Severe Bloat) Lessons** | **0** | **100% of P0 lessons successfully migrated in Batch 1!** |
| **Lessons with Forced/Unrelated Content** | **0** | All introductory lessons stripped of fake headers/CLI |

---

## 2. Active Lessons Converted to `contentV2` (9 / 30)

| Course | Slug | Lesson Title | Key V2 Components |
|---|---|---|---|
| **NET-101** | `net-101-bits-bytes-binary-hex` | Bits, Bytes, Binary & Hexadecimal | Base conversions, positional weights, `BINARY_CONVERTER`, practice, recap |
| **NET-102** | `level-0-what-is-a-computer-network` | What is a Computer Network? | 5 communication elements, duplex modes (Simplex/Half/Full), `NETWORK_GRAPH`, practice, recap |
| **NET-102** | `level-0-client-and-server-architecture` | Client-Server & Peer-to-Peer Architecture | Request/response cycle, P2P swarms, `CLIENT_SERVER_FLOW`, scaling example, recap |
| **NET-102** | `level-0-lan-wan-internet-boundaries` | Network Geographic Scopes & Internet Hierarchy | PAN to WAN scopes, Tier 1/2/3 ISPs, IXP direct peering, `INTERNET_HIERARCHY_MAP`, recap |
| **NET-102** | `network-topologies-overview` | Physical & Logical Network Topologies | Star, Bus, Ring, Mesh formula $N(N-1)/2$, `TOPOLOGY_SIMULATOR`, SPOF analysis, recap |
| **NET-103** | `level-0-network-protocols-standards` | Network Protocols, Standardization & RFC Architecture | Syntax/Semantics/Timing triad, IETF/IEEE/ISO bodies, RFC lifecycle, `STANDARDS_ECOSYSTEM`, recap |
| **NET-203** | `ipv6-foundations-overview` | IPv6 Addressing Architecture, SLAAC & Dual-Stack | 128-bit structure, RFC 5952 compression, SLAAC RS/RA/DAD, `IPV6_COMPRESSOR_ENGINE`, recap |
| **NET-304** | `net-304-multi-area-ospf-redistribution` | Multi-Area OSPF Architecture, LSA Flooding & Route Redistribution | Area 0 backbone, ABR/ASBR roles, LSA 1-5 scopes, `MULTI_AREA_OSPF_ENGINE`, troubleshooting, lab |
| **NET-403** | `net-403-network-automation-programmability-foundations` | Network Automation & Programmability Foundations | Idempotency, Declarative vs Imperative, REST APIs, JSON models, `NETWORK_AUTOMATION_PIPELINE`, API lab |

---

## 3. Legacy Lessons Classification & Migration Priority (26 / 30)

### Priority Definitions
- **P0 (Severe Bloat / Bad Scope):** Introductory or purely conceptual lessons burdened by forced 18-step boilerplate (fake packet headers, arbitrary CLI commands, synthetic labs).
- **P1 (Important Active Lessons):** High-traffic foundational/core protocol lessons that should be migrated to clean V2 structure with authentic domain components.
- **P2 (Acceptable Legacy Content):** Intermediate or advanced topics where the current 18-step sections are reasonably well-matched and function adequately through the V2 normalization layer.

---

## 4. Complete Legacy Lesson Priority Table

| # | Priority | Course | Slug | Title | Current Issue / Migration Target |
|---|---|---|---|---|---|
| 1 | **P0** | NET-102 | `level-0-what-is-a-computer-network` | What is a Computer Network? | Fake packet header ("Transmission Duplex Modes"), arbitrary `ping 127.0.0.1` CLI. |
| 2 | **P0** | NET-102 | `level-0-client-and-server-architecture` | Client-Server & Peer-to-Peer Architecture | Fake packet header ("Socket Binding"), arbitrary `curl` CLI. |
| 3 | **P0** | NET-102 | `level-0-lan-wan-internet-boundaries` | Network Geographic Scopes & Internet Hierarchy | Fake packet header ("AS Boundary"), arbitrary `tracert` CLI. |
| 4 | **P0** | NET-103 | `level-0-network-protocols-standards` | Network Protocols, Standardization & RFC Architecture | Fake packet header ("Standardization Hierarchy"), forced CLI and lab. |
| 5 | **P0** | NET-102 | `network-topologies-overview` | Physical & Logical Network Topologies | Fake packet header ("Topology Fault Tolerance"), arbitrary Cisco CDP CLI. |
| 6 | **P1** | NET-103 | `osi-model-7-layers` | The 7-Layer OSI Reference Model | Core lesson; strip forced packet header, focus on encapsulation PDUs and layer functions. |
| 7 | **P1** | NET-103 | `tcp-ip-4-layers` | The TCP/IP 4-Layer Architecture & Model Mapping | High-traffic topic; clean up layer mapping, remove synthetic CLI filler. |
| 8 | **P1** | NET-201 | `level-0-mac-addresses-physical-identity` | MAC Addresses & Physical Hardware Identity | Clean up OUI bit parser; remove fake packet header view. |
| 9 | **P1** | NET-201 | `ethernet-mac-addresses-overview` | Ethernet II Framing, Frame Formats & Transmission Mechanics | Core Layer 2 lesson; retain real Ethernet II header, clean up CLI. |
| 10 | **P1** | NET-202 | `net-202-ipv4-addressing-cidr` | IPv4 Addressing, Subnet Masks & CIDR Subnetting | Core benchmark lesson; optimize subnet calculation steps and practice. |
| 11 | **P1** | NET-202 | `level-0-ip-addresses-logical-location` | Special-Use IPv4 Ranges & Enterprise Allocation | Streamline RFC 1918, APIPA, and Loopback classification. |
| 12 | **P1** | NET-203 | `level-0-dns-internet-phonebook` | Domain Name System (DNS) & Name Resolution Architecture | Core DNS topic; keep real DNS query header, remove generic template filler. |
| 13 | **P1** | NET-203 | `level-0-dhcp-automatic-ip-allocation` | Dynamic Host Configuration Protocol (DHCP) & IP Leasing | Core DHCP topic; focus on DORA workflow and lease timing. |
| 14 | **P1** | NET-203 | `arp-protocol-overview` | Address Resolution Protocol (ARP) & Layer 2/3 Binding | Essential L2/L3 binding lesson; keep real ARP packet format and table CLI. |
| 15 | **P1** | NET-204 | `tcp-udp-transport-overview` | TCP & UDP Transport Protocols: Connection Management | High-priority; keep real TCP/UDP headers, 3-way handshake, and socket behavior. |
| 16 | **P1** | NET-204 | `level-0-network-ports-socket-boundaries` | Network Ports, Socket Endpoints & Layer 4 Multiplexing | Sockets & well-known port ranges; remove forced packet header. |
| 17 | **P1** | NET-302 | `net-302-spanning-tree-protocol-loop-prevention` | Spanning Tree Protocol (STP) & Layer-2 Loop Prevention | Core switching topic; retain BPDU structure, bridge ID election, and switch CLI. |
| 18 | **P1** | NET-304 | `net-304-single-area-ospf-routing` | Dynamic Routing Protocols & Single-Area OSPF | Core routing topic; keep Dijkstra algorithm, neighbor states, and OSPF CLI. |
| 19 | **P1** | NET-404 | `net-404-wireshark-packet-capture` | Wireshark Packet Capture Analysis | Core capture tool topic; retain display filters, pcap workflows, and analysis lab. |
| 20 | **P2** | NET-101 | `network-devices-overview` | Physical Network Interfaces, Media & Transceivers | Acceptable; copper/fiber comparisons and `show interface` CLI. |
| 21 | **P2** | NET-102 | `wireless-networking-overview` | Wireless Networking, RF Spectrum & Wi-Fi Standards | Acceptable; 802.11 standards, channels, and SSID configuration. |
| 22 | **P2** | NET-102 | `what-is-computer-networking` | Network Performance Metrics: Latency, Throughput & Packet Loss | Acceptable; bandwidth-delay product and ping/traceroute metrics. |
| 23 | **P2** | NET-202 | `ip-addressing-ipv4-overview` | Classful IPv4 History & The Architectural Necessity of CIDR | Acceptable; historical classful addressing and CIDR transition. |
| 24 | **P2** | NET-202 | `subnetting-cidr-overview` | VLSM Design & Multi-Department Address Allocation | Acceptable; VLSM allocation design and routing table aggregation. |
| 25 | **P2** | NET-203 | `dhcp-dns-overview` | The Integrated Host Boot-Up Lifecycle: Cold Boot to Web Request | Acceptable; comprehensive end-to-end trace from DHCP to HTTP. |
| 26 | **P2** | NET-204 | `level-0-network-packets-data-framing` | Transport Layer Segmentation, MTU & Path MTU Discovery | Acceptable; IP fragmentation, DF bit, and PMTUD. |

---

## 5. Top 15 Migration Priorities (Ranked Order)

1. **`level-0-what-is-a-computer-network` (P0)**: Remove fake duplex packet header and generic CLI; focus purely on the 5 elements of communication and transmission modes.
2. **`level-0-client-and-server-architecture` (P0)**: Remove fake socket header; focus on client-server vs P2P request-response paradigms.
3. **`level-0-lan-wan-internet-boundaries` (P0)**: Remove fake AS boundary header; focus on geographic domains (LAN, MAN, WAN) and ISP tiers.
4. **`level-0-network-protocols-standards` (P0)**: Remove fake standards header; focus on RFC lifecycle and standards organizations (IETF, IEEE).
5. **`network-topologies-overview` (P0)**: Remove fake topology header; focus on physical vs logical topologies and failure domains.
6. **`osi-model-7-layers` (P1)**: Remove synthetic packet headers; highlight 7-layer encapsulation/decapsulation and PDUs.
7. **`tcp-ip-4-layers` (P1)**: Streamline 4-layer DoD model vs OSI mapping without forced CLI boilerplate.
8. **`level-0-mac-addresses-physical-identity` (P1)**: Focus on 48-bit MAC anatomy, OUI lookup, I/G and U/L bits.
9. **`ethernet-mac-addresses-overview` (P1)**: Retain authentic Ethernet II 14-byte header and preamble mechanics.
10. **`net-202-ipv4-addressing-cidr` (P1)**: Streamline 32-bit IPv4 math, subnet mask bit boundaries, and CIDR prefix calculations.
11. **`level-0-ip-addresses-logical-location` (P1)**: Focus on RFC 1918 private ranges, APIPA link-local, and loopback isolation.
12. **`level-0-dns-internet-phonebook` (P1)**: Focus on 4-step hierarchy (Root, TLD, Auth) and A/AAAA/CNAME record resolution.
13. **`level-0-dhcp-automatic-ip-allocation` (P1)**: Focus on DHCP DORA exchange, lease timers, and relay agents.
14. **`arp-protocol-overview` (P1)**: Focus on Layer 2/3 binding, broadcast request / unicast reply, and ARP cache aging.
15. **`tcp-udp-transport-overview` (P1)**: Focus on TCP 3-way handshake, SYN/ACK flags, sliding window flow control vs UDP connectionless speed.

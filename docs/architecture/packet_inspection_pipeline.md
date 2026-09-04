# NetVision Packet Analytics & Protocol Inspection Pipeline

## Architecture Overview
NetVision implements deterministic client-side and server-side packet decoding pipelines:
1. **Ethernet II Layer**: Frame header decapsulation, MAC resolution, VLAN tag extraction (802.1Q).
2. **Network Layer (IPv4 / IPv6)**: TTL decrementing, CIDR prefix trie routing lookup, checksum verification.
3. **Transport Layer (TCP / UDP)**: Stream state machine (SYN, SYN-ACK, ACK, FIN-ACK), sequence number windowing, port multiplexing.
4. **Application Layer**: HTTP/1.1, DNS query response parsing, and PCAP raw binary dissection.

// PCAP / PCAPNG Packet Capture Replay and Dissector Engine

export interface CapturedPacket {
  id: number;
  timeOffsetMs: number;
  source: string;
  destination: string;
  protocol: 'DNS' | 'TCP' | 'TLS' | 'HTTP/2' | 'BGP' | 'ICMP';
  length: number;
  info: string;
  layers: {
    frame: { number: number; length: number; timestamp: string };
    ethernet: { srcMac: string; dstMac: string; ethertype: string };
    ip: { version: number; srcIp: string; dstIp: string; ttl: number; protocol: string };
    transport: { srcPort: number; dstPort: number; flags?: string; seq?: number; ack?: number };
    payloadHex: string;
    payloadAscii: string;
  };
}

export const SAMPLE_PCAP_STREAM: CapturedPacket[] = [
  {
    id: 1,
    timeOffsetMs: 0,
    source: '192.168.1.10',
    destination: '8.8.8.8',
    protocol: 'DNS',
    length: 74,
    info: 'Standard query 0x7a3f A netvision.io',
    layers: {
      frame: { number: 1, length: 74, timestamp: '2026-08-30 08:00:00.000000' },
      ethernet: { srcMac: '00:1a:2b:3c:4d:5e', dstMac: '00:aa:bb:cc:dd:ee', ethertype: 'IPv4 (0x0800)' },
      ip: { version: 4, srcIp: '192.168.1.10', dstIp: '8.8.8.8', ttl: 64, protocol: 'UDP (17)' },
      transport: { srcPort: 54321, dstPort: 53 },
      payloadHex: '7a 3f 01 00 00 01 00 00 00 00 00 00 09 6e 65 74 76 69 73 69 6f 6e 02 69 6f 00 00 01 00 01',
      payloadAscii: 'z?...........netvision.io....',
    },
  },
  {
    id: 2,
    timeOffsetMs: 14,
    source: '8.8.8.8',
    destination: '192.168.1.10',
    protocol: 'DNS',
    length: 90,
    info: 'Standard query response 0x7a3f A 104.21.55.2',
    layers: {
      frame: { number: 2, length: 90, timestamp: '2026-08-30 08:00:00.014120' },
      ethernet: { srcMac: '00:aa:bb:cc:dd:ee', dstMac: '00:1a:2b:3c:4d:5e', ethertype: 'IPv4 (0x0800)' },
      ip: { version: 4, srcIp: '8.8.8.8', dstIp: '192.168.1.10', ttl: 58, protocol: 'UDP (17)' },
      transport: { srcPort: 53, dstPort: 54321 },
      payloadHex: '7a 3f 81 80 00 01 00 01 00 00 00 00 09 6e 65 74 76 69 73 69 6f 6e 02 69 6f 00 00 01 00 01 c0 0c 00 01 00 01 00 00 01 2c 00 04 68 15 37 02',
      payloadAscii: 'z?...........netvision.io........,....h.7.',
    },
  },
  {
    id: 3,
    timeOffsetMs: 22,
    source: '192.168.1.10',
    destination: '104.21.55.2',
    protocol: 'TCP',
    length: 66,
    info: '52340 -> 443 [SYN] Seq=0 Win=65535 Len=0 MSS=1460 SACK_PERM',
    layers: {
      frame: { number: 3, length: 66, timestamp: '2026-08-30 08:00:00.022400' },
      ethernet: { srcMac: '00:1a:2b:3c:4d:5e', dstMac: '00:aa:bb:cc:dd:ee', ethertype: 'IPv4 (0x0800)' },
      ip: { version: 4, srcIp: '192.168.1.10', dstIp: '104.21.55.2', ttl: 64, protocol: 'TCP (6)' },
      transport: { srcPort: 52340, dstPort: 443, flags: 'SYN', seq: 0, ack: 0 },
      payloadHex: 'cc 74 01 bb 00 00 00 00 a0 02 ff ff 7a 12 00 00 02 04 05 b4 04 02 08 0a 01 23 45 67 00 00 00 00',
      payloadAscii: '.t..........z............#Eg....',
    },
  },
  {
    id: 4,
    timeOffsetMs: 38,
    source: '104.21.55.2',
    destination: '192.168.1.10',
    protocol: 'TCP',
    length: 66,
    info: '443 -> 52340 [SYN, ACK] Seq=0 Ack=1 Win=65535 Len=0 MSS=1460',
    layers: {
      frame: { number: 4, length: 66, timestamp: '2026-08-30 08:00:00.038100' },
      ethernet: { srcMac: '00:aa:bb:cc:dd:ee', dstMac: '00:1a:2b:3c:4d:5e', ethertype: 'IPv4 (0x0800)' },
      ip: { version: 4, srcIp: '104.21.55.2', dstIp: '192.168.1.10', ttl: 57, protocol: 'TCP (6)' },
      transport: { srcPort: 443, dstPort: 52340, flags: 'SYN, ACK', seq: 0, ack: 1 },
      payloadHex: '01 bb cc 74 38 92 10 24 00 00 00 01 a0 12 ff ff b8 12 00 00 02 04 05 b4 04 02 08 0a 44 55 66 77',
      payloadAscii: '...t8..$....................DUfw',
    },
  },
];

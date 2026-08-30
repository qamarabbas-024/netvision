/**
 * Standard Libpcap Binary File Generator (RFC PCAP Format)
 * Generates standard .pcap files directly in the browser that can be opened in Wireshark.
 */

export interface PcapPacketData {
  timestampMs: number;
  sourceMac: string;
  destMac: string;
  etherType?: number; // default 0x0800 (IPv4)
  sourceIp: string;
  destIp: string;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'DNS';
  srcPort?: number;
  dstPort?: number;
  payloadText?: string;
  seqNumber?: number;
  ackNumber?: number;
  flags?: { syn?: boolean; ack?: boolean; fin?: boolean; rst?: boolean };
}

function parseMac(mac: string): number[] {
  const parts = mac.split(/[:-]/).map((h) => parseInt(h, 16));
  while (parts.length < 6) parts.push(0);
  return parts.slice(0, 6);
}

function parseIpv4(ip: string): number[] {
  const cleanIp = ip.split('/')[0];
  const parts = cleanIp.split('.').map((d) => parseInt(d, 10));
  while (parts.length < 4) parts.push(0);
  return parts.slice(0, 4);
}

export function generatePcapBinary(packets: PcapPacketData[]): Uint8Array {
  const buffers: Uint8Array[] = [];

  // 1. Libpcap Global Header (24 bytes)
  // Magic: 0xa1b2c3d4, Version: 2.4, Zone: 0, Sigfigs: 0, Snaplen: 65535, Linktype: 1 (Ethernet)
  const globalHeader = new Uint8Array(24);
  const gView = new DataView(globalHeader.buffer);
  gView.setUint32(0, 0xa1b2c3d4, false); // Big endian magic
  gView.setUint16(4, 2, false); // Major version
  gView.setUint16(6, 4, false); // Minor version
  gView.setInt32(8, 0, false); // Timezone GMT
  gView.setUint32(12, 0, false); // Sigfigs
  gView.setUint32(16, 65535, false); // Snaplen
  gView.setUint32(20, 1, false); // Network: Ethernet (1)
  buffers.push(globalHeader);

  const baseTimeSec = Math.floor(Date.now() / 1000) - 60;

  // 2. Process each packet
  packets.forEach((pkt, idx) => {
    const rawPayload = pkt.payloadText
      ? new TextEncoder().encode(pkt.payloadText)
      : new TextEncoder().encode('GET /index.html HTTP/1.1\r\nHost: netvision.local\r\n\r\n');

    let l4HeaderSize = 8; // ICMP or UDP
    let ipProto = 1; // ICMP default

    if (pkt.protocol === 'TCP') {
      l4HeaderSize = 20;
      ipProto = 6;
    } else if (pkt.protocol === 'UDP' || pkt.protocol === 'DNS') {
      l4HeaderSize = 8;
      ipProto = 17;
    }

    const ipTotalLen = 20 + l4HeaderSize + rawPayload.length;
    const ethPacketLen = 14 + ipTotalLen;

    // Frame Buffer
    const frame = new Uint8Array(ethPacketLen);
    const fView = new DataView(frame.buffer);

    // Layer 2 Ethernet Header (14 bytes)
    const dstMacBytes = parseMac(pkt.destMac || 'FF:FF:FF:FF:FF:FF');
    const srcMacBytes = parseMac(pkt.sourceMac || '70:85:C2:54:19:A1');
    dstMacBytes.forEach((b, i) => fView.setUint8(i, b));
    srcMacBytes.forEach((b, i) => fView.setUint8(6 + i, b));
    fView.setUint16(12, pkt.etherType || 0x0800, false); // IPv4

    // Layer 3 IPv4 Header (20 bytes)
    const ipOffset = 14;
    fView.setUint8(ipOffset + 0, 0x45); // Version 4, IHL 5 (20 bytes)
    fView.setUint8(ipOffset + 1, 0x00); // DSCP/ECN
    fView.setUint16(ipOffset + 2, ipTotalLen, false); // Total Length
    fView.setUint16(ipOffset + 4, 0x1000 + idx, false); // Identification
    fView.setUint16(ipOffset + 6, 0x4000, false); // Flags: Don't Fragment
    fView.setUint8(ipOffset + 8, 64); // TTL
    fView.setUint8(ipOffset + 9, ipProto); // Protocol
    fView.setUint16(ipOffset + 10, 0x0000, false); // Checksum (simulated 0)

    const srcIpBytes = parseIpv4(pkt.sourceIp || '192.168.1.10');
    const dstIpBytes = parseIpv4(pkt.destIp || '142.250.72.14');
    srcIpBytes.forEach((b, i) => fView.setUint8(ipOffset + 12 + i, b));
    dstIpBytes.forEach((b, i) => fView.setUint8(ipOffset + 16 + i, b));

    // Layer 4 Transport Header
    const l4Offset = ipOffset + 20;
    const srcPort = pkt.srcPort || 49152 + idx;
    const dstPort = pkt.dstPort || (pkt.protocol === 'DNS' ? 53 : 443);

    if (pkt.protocol === 'TCP') {
      fView.setUint16(l4Offset + 0, srcPort, false);
      fView.setUint16(l4Offset + 2, dstPort, false);
      fView.setUint32(l4Offset + 4, pkt.seqNumber || 1000 + idx * 50, false);
      fView.setUint32(l4Offset + 8, pkt.ackNumber || 2000 + idx * 50, false);
      fView.setUint8(l4Offset + 12, 0x50); // Data offset 5 words (20 bytes)

      // TCP Flags: SYN=0x02, ACK=0x10, FIN=0x01
      let flagsByte = 0x10; // ACK default
      if (pkt.flags?.syn) flagsByte = 0x02;
      if (pkt.flags?.syn && pkt.flags?.ack) flagsByte = 0x12;
      fView.setUint8(l4Offset + 13, flagsByte);
      fView.setUint16(l4Offset + 14, 65535, false); // Window Size
      fView.setUint16(l4Offset + 16, 0x0000, false); // Checksum
      fView.setUint16(l4Offset + 18, 0x0000, false); // Urgent pointer

      // Payload
      frame.set(rawPayload, l4Offset + 20);
    } else if (pkt.protocol === 'UDP' || pkt.protocol === 'DNS') {
      fView.setUint16(l4Offset + 0, srcPort, false);
      fView.setUint16(l4Offset + 2, dstPort, false);
      fView.setUint16(l4Offset + 4, 8 + rawPayload.length, false); // UDP Length
      fView.setUint16(l4Offset + 6, 0x0000, false); // Checksum

      // Payload
      frame.set(rawPayload, l4Offset + 8);
    } else {
      // ICMP Echo
      fView.setUint8(l4Offset + 0, 8); // Echo Request
      fView.setUint8(l4Offset + 1, 0); // Code 0
      fView.setUint16(l4Offset + 2, 0x0000, false); // Checksum
      fView.setUint16(l4Offset + 4, 0x0001, false); // Identifier
      fView.setUint16(l4Offset + 6, idx + 1, false); // Sequence number
      frame.set(rawPayload, l4Offset + 8);
    }

    // Libpcap Packet Record Header (16 bytes)
    const pcapPktHeader = new Uint8Array(16);
    const pView = new DataView(pcapPktHeader.buffer);
    const pktSec = baseTimeSec + Math.floor((pkt.timestampMs || idx * 100) / 1000);
    const pktUsec = ((pkt.timestampMs || idx * 100) % 1000) * 1000;

    pView.setUint32(0, pktSec, false); // Timestamp seconds
    pView.setUint32(4, pktUsec, false); // Timestamp microseconds
    pView.setUint32(8, ethPacketLen, false); // Captured packet length
    pView.setUint32(12, ethPacketLen, false); // Original packet length

    buffers.push(pcapPktHeader);
    buffers.push(frame);
  });

  // Combine all buffers into single Uint8Array
  const totalLength = buffers.reduce((acc, b) => acc + b.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  buffers.forEach((b) => {
    result.set(b, offset);
    offset += b.length;
  });

  return result;
}

export function downloadPcapFile(packets: PcapPacketData[], filename: string = 'netvision-simulation.pcap'): void {
  const binaryData = generatePcapBinary(packets);
  const blob = new Blob([binaryData.buffer as ArrayBuffer], { type: 'application/vnd.tcpdump.pcap' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

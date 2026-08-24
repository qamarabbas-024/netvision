/**
 * NetVision MP-TCP (Multi-Path TCP RFC 8684) & QUIC (RFC 9000) Engine (Version 6.9)
 * Simulates dual-interface subflow bandwidth aggregation (Wi-Fi + 5G)
 * and seamless QUIC 0-RTT connection migration across mobile IP changes.
 */

export interface MptcpSubflow {
  id: string;
  interfaceName: string;
  ipAddress: string;
  bandwidthMbps: number;
  rttMs: number;
  status: 'ACTIVE' | 'STANDBY' | 'DISCONNECTED';
}

export class MptcpQuicEngine {
  public static getInitialSubflows(): MptcpSubflow[] {
    return [
      { id: 'sub-wifi', interfaceName: 'wlan0 (Wi-Fi 7)', ipAddress: '192.168.1.105', bandwidthMbps: 180, rttMs: 8.2, status: 'ACTIVE' },
      { id: 'sub-cellular', interfaceName: 'rmnet0 (5G NR)', ipAddress: '100.64.42.18', bandwidthMbps: 220, rttMs: 14.5, status: 'ACTIVE' },
    ];
  }
}

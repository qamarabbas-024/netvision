/**
 * NetVision Enterprise Data Center BGP EVPN & VXLAN Fabric Engine (Version 4.4)
 * Simulates Spine-Leaf ECMP underlay routing, VXLAN VTEP encapsulation (UDP port 4789),
 * and BGP EVPN Type-2 / Type-5 control-plane signaling.
 */

export interface EvpnRoute {
  routeType: 'TYPE_2_MAC_IP' | 'TYPE_5_PREFIX';
  rd: string; // Route Distinguisher e.g. 65001:100
  vni: number; // VXLAN Network Identifier e.g. 10001
  macAddress?: string;
  ipAddress: string;
  nextHopVtep: string; // Originating VTEP IP e.g. 10.0.0.11
  routerMac?: string;
}

export interface SpineLeafNode {
  id: string;
  name: string;
  role: 'SPINE' | 'LEAF' | 'WORKLOAD';
  asNumber: number;
  loopbackIp: string;
  vtepIp?: string;
  vnis?: number[];
  rackId?: string;
}

export interface VxlanPacketFrame {
  id: string;
  sourceWorkload: string;
  destWorkload: string;
  vni: number;
  underlaySourceIp: string;
  underlayDestIp: string;
  udpPort: number; // 4789
  innerSourceMac: string;
  innerDestMac: string;
  innerSourceIp: string;
  innerDestIp: string;
  selectedSpine: string;
  ecmpHash: string;
}

export class BgpEvpnFabricEngine {
  public static generateDefaultFabric() {
    const spines: SpineLeafNode[] = [
      { id: 'spine-1', name: 'Spine-01', role: 'SPINE', asNumber: 65000, loopbackIp: '10.0.0.1' },
      { id: 'spine-2', name: 'Spine-02', role: 'SPINE', asNumber: 65000, loopbackIp: '10.0.0.2' },
    ];

    const leafs: SpineLeafNode[] = [
      { id: 'leaf-1', name: 'Leaf-01 (Rack A)', role: 'LEAF', asNumber: 65001, loopbackIp: '10.0.0.11', vtepIp: '10.0.0.11', vnis: [10001, 10002], rackId: 'RACK-A' },
      { id: 'leaf-2', name: 'Leaf-02 (Rack B)', role: 'LEAF', asNumber: 65002, loopbackIp: '10.0.0.12', vtepIp: '10.0.0.12', vnis: [10001, 10002], rackId: 'RACK-B' },
      { id: 'leaf-3', name: 'Leaf-03 (Rack C)', role: 'LEAF', asNumber: 65003, loopbackIp: '10.0.0.13', vtepIp: '10.0.0.13', vnis: [10001, 10003], rackId: 'RACK-C' },
    ];

    const workloads: SpineLeafNode[] = [
      { id: 'vm-web-1', name: 'App-VM-01', role: 'WORKLOAD', asNumber: 0, loopbackIp: '192.168.10.11', rackId: 'RACK-A' },
      { id: 'vm-web-2', name: 'App-VM-02', role: 'WORKLOAD', asNumber: 0, loopbackIp: '192.168.10.12', rackId: 'RACK-B' },
      { id: 'vm-db-1', name: 'Database-01', role: 'WORKLOAD', asNumber: 0, loopbackIp: '192.168.20.21', rackId: 'RACK-C' },
    ];

    const evpnTable: EvpnRoute[] = [
      { routeType: 'TYPE_2_MAC_IP', rd: '65001:10001', vni: 10001, macAddress: '00:50:56:A1:01:01', ipAddress: '192.168.10.11', nextHopVtep: '10.0.0.11' },
      { routeType: 'TYPE_2_MAC_IP', rd: '65002:10001', vni: 10001, macAddress: '00:50:56:A1:01:02', ipAddress: '192.168.10.12', nextHopVtep: '10.0.0.12' },
      { routeType: 'TYPE_2_MAC_IP', rd: '65003:10003', vni: 10003, macAddress: '00:50:56:B2:02:01', ipAddress: '192.168.20.21', nextHopVtep: '10.0.0.13' },
      { routeType: 'TYPE_5_PREFIX', rd: '65000:100', vni: 10001, ipAddress: '192.168.10.0/24', nextHopVtep: '10.0.0.11', routerMac: '00:00:5E:00:01:01' },
    ];

    return { spines, leafs, workloads, evpnTable };
  }

  /**
   * Encapsulate Layer-2 frame into Layer-3 UDP VXLAN packet
   */
  public static createVxlanPacket(srcWorkloadId: string, dstWorkloadId: string): VxlanPacketFrame {
    const isEcmpSpine1 = Math.random() > 0.5;
    const selectedSpine = isEcmpSpine1 ? 'Spine-01' : 'Spine-02';
    const hashVal = Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, '0');

    return {
      id: `vxlan-${Date.now()}`,
      sourceWorkload: 'App-VM-01 (192.168.10.11)',
      destWorkload: 'App-VM-02 (192.168.10.12)',
      vni: 10001,
      underlaySourceIp: '10.0.0.11 (VTEP Leaf-01)',
      underlayDestIp: '10.0.0.12 (VTEP Leaf-02)',
      udpPort: 4789,
      innerSourceMac: '00:50:56:A1:01:01',
      innerDestMac: '00:50:56:A1:01:02',
      innerSourceIp: '192.168.10.11',
      innerDestIp: '192.168.10.12',
      selectedSpine,
      ecmpHash: `CRC32=0x${hashVal} (Port ${49152 + Math.floor(Math.random() * 1000)})`,
    };
  }
}

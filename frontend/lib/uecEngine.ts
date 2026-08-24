/**
 * NetVision Ultra Ethernet Consortium (UEC) Engine (Version 7.2)
 * Simulates UEC multi-path packet spraying, selective packet trimming,
 * out-of-order hardware reassembly, and In-Network Collective (INC) AllReduce.
 */

export interface UecSpinePath {
  pathId: string;
  spineName: string;
  packetsSprayed: number;
  latencyUs: number;
  inNetworkMathActive: boolean;
}

export interface UecTransportState {
  fabricStandard: 'UEC_V1' | 'STANDARD_ROCEV2';
  totalPacketsSprayed: number;
  trimmedPacketsRecovered: number;
  flowCollisions: number;
  spines: UecSpinePath[];
}

export class UecEngine {
  public static getInitialState(): UecTransportState {
    return {
      fabricStandard: 'UEC_V1',
      totalPacketsSprayed: 0,
      trimmedPacketsRecovered: 0,
      flowCollisions: 0,
      spines: [
        { pathId: 'spine-1', spineName: 'Spine-01 (800G)', packetsSprayed: 0, latencyUs: 1.2, inNetworkMathActive: true },
        { pathId: 'spine-2', spineName: 'Spine-02 (800G)', packetsSprayed: 0, latencyUs: 1.1, inNetworkMathActive: true },
        { pathId: 'spine-3', spineName: 'Spine-03 (800G)', packetsSprayed: 0, latencyUs: 1.3, inNetworkMathActive: true },
        { pathId: 'spine-4', spineName: 'Spine-04 (800G)', packetsSprayed: 0, latencyUs: 1.2, inNetworkMathActive: true },
      ],
    };
  }
}

import { EngineProtocol, PacketState, InspectionData } from '../types';

export class Packet {
  public id: string;
  public sourceIp: string;
  public targetIp: string;
  public sourceMac: string;
  public targetMac: string;
  public protocol: EngineProtocol;
  public payload: string;
  public ttl: number;
  public state: PacketState;
  public progressPercent: number;
  public flags: string[];

  constructor(
    id: string,
    sourceIp: string,
    targetIp: string,
    sourceMac: string,
    targetMac: string,
    protocol: EngineProtocol,
    payload: string,
    flags: string[] = ['SYN']
  ) {
    this.id = id;
    this.sourceIp = sourceIp;
    this.targetIp = targetIp;
    this.sourceMac = sourceMac;
    this.targetMac = targetMac;
    this.protocol = protocol;
    this.payload = payload;
    this.ttl = 64;
    this.state = 'idle';
    this.progressPercent = 0;
    this.flags = flags;
  }

  public getInspectionData(): InspectionData {
    return {
      layer2: {
        sourceMac: this.sourceMac,
        targetMac: this.targetMac,
        frameType: '0x0800 (IPv4)',
      },
      layer3: {
        sourceIp: this.sourceIp,
        targetIp: this.targetIp,
        protocol: this.protocol,
        ttl: this.ttl,
      },
      layer4: {
        sourcePort: 54321,
        targetPort: this.protocol === 'DNS' ? 53 : this.protocol === 'HTTP' ? 80 : 443,
        flags: this.flags,
        sequenceNumber: 100,
        ackNumber: 0,
      },
      layer7: {
        payload: this.payload,
      },
    };
  }
}

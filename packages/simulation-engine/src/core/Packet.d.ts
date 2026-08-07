import { EngineProtocol, PacketState, InspectionData } from '../types';
export declare class Packet {
    id: string;
    sourceIp: string;
    targetIp: string;
    sourceMac: string;
    targetMac: string;
    protocol: EngineProtocol;
    payload: string;
    ttl: number;
    state: PacketState;
    progressPercent: number;
    flags: string[];
    constructor(id: string, sourceIp: string, targetIp: string, sourceMac: string, targetMac: string, protocol: EngineProtocol, payload: string, flags?: string[]);
    getInspectionData(): InspectionData;
}

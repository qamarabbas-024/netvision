import { EngineNodeType, Position } from '../types';
import { Port } from './Port';
import { Packet } from './Packet';
export declare abstract class Node {
    id: string;
    name: string;
    type: EngineNodeType;
    ports: Port[];
    position: Position;
    isOnline: boolean;
    constructor(id: string, name: string, type: EngineNodeType, position?: Position);
    addPort(port: Port): void;
    abstract handlePacket(packet: Packet): Packet | null;
}
export declare class PCNode extends Node {
    constructor(id: string, name: string, ip: string, mac: string, pos?: Position);
    handlePacket(packet: Packet): Packet | null;
}
export declare class ServerNode extends Node {
    constructor(id: string, name: string, ip: string, mac: string, pos?: Position);
    handlePacket(packet: Packet): Packet | null;
}
export declare class RouterNode extends Node {
    routingTable: Map<string, string>;
    constructor(id: string, name: string, pos?: Position);
    handlePacket(packet: Packet): Packet | null;
}
export declare class SwitchNode extends Node {
    macTable: Map<string, string>;
    constructor(id: string, name: string, pos?: Position);
    handlePacket(packet: Packet): Packet | null;
}
export declare class FirewallNode extends Node {
    blockedPorts: Set<number>;
    constructor(id: string, name: string, pos?: Position);
    handlePacket(packet: Packet): Packet | null;
}

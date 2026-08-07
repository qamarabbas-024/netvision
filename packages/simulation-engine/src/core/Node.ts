import { EngineNodeType, Position } from '../types';
import { Port } from './Port';
import { Packet } from './Packet';

export abstract class Node {
  public id: string;
  public name: string;
  public type: EngineNodeType;
  public ports: Port[];
  public position: Position;
  public isOnline: boolean;

  constructor(id: string, name: string, type: EngineNodeType, position: Position = { x: 0, y: 0 }) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.ports = [];
    this.position = position;
    this.isOnline = true;
  }

  public addPort(port: Port) {
    this.ports.push(port);
  }

  public abstract handlePacket(packet: Packet): Packet | null;
}

export class PCNode extends Node {
  constructor(id: string, name: string, ip: string, mac: string, pos?: Position) {
    super(id, name, 'pc', pos);
    this.addPort(new Port(`${id}-eth0`, 'eth0', mac, ip));
  }

  public handlePacket(packet: Packet): Packet | null {
    if (packet.targetIp === this.ports[0].ipAddress) {
      packet.state = 'delivered';
      return null;
    }
    return packet;
  }
}

export class ServerNode extends Node {
  constructor(id: string, name: string, ip: string, mac: string, pos?: Position) {
    super(id, name, 'server', pos);
    this.addPort(new Port(`${id}-eth0`, 'eth0', mac, ip));
  }

  public handlePacket(packet: Packet): Packet | null {
    packet.state = 'delivered';
    return null;
  }
}

export class RouterNode extends Node {
  public routingTable: Map<string, string> = new Map();

  constructor(id: string, name: string, pos?: Position) {
    super(id, name, 'router', pos);
  }

  public handlePacket(packet: Packet): Packet | null {
    packet.ttl -= 1;
    if (packet.ttl <= 0) {
      packet.state = 'dropped';
      return null;
    }
    return packet;
  }
}

export class SwitchNode extends Node {
  public macTable: Map<string, string> = new Map();

  constructor(id: string, name: string, pos?: Position) {
    super(id, name, 'switch', pos);
  }

  public handlePacket(packet: Packet): Packet | null {
    this.macTable.set(packet.sourceMac, 'port-1');
    return packet;
  }
}

export class FirewallNode extends Node {
  public blockedPorts: Set<number> = new Set([23, 445]);

  constructor(id: string, name: string, pos?: Position) {
    super(id, name, 'firewall', pos);
  }

  public handlePacket(packet: Packet): Packet | null {
    if (this.blockedPorts.has(80)) {
      packet.state = 'blocked';
      return null;
    }
    return packet;
  }
}

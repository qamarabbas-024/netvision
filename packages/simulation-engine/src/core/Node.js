"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirewallNode = exports.SwitchNode = exports.RouterNode = exports.ServerNode = exports.PCNode = exports.Node = void 0;
const Port_1 = require("./Port");
class Node {
    constructor(id, name, type, position = { x: 0, y: 0 }) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.ports = [];
        this.position = position;
        this.isOnline = true;
    }
    addPort(port) {
        this.ports.push(port);
    }
}
exports.Node = Node;
class PCNode extends Node {
    constructor(id, name, ip, mac, pos) {
        super(id, name, 'pc', pos);
        this.addPort(new Port_1.Port(`${id}-eth0`, 'eth0', mac, ip));
    }
    handlePacket(packet) {
        if (packet.targetIp === this.ports[0].ipAddress) {
            packet.state = 'delivered';
            return null;
        }
        return packet;
    }
}
exports.PCNode = PCNode;
class ServerNode extends Node {
    constructor(id, name, ip, mac, pos) {
        super(id, name, 'server', pos);
        this.addPort(new Port_1.Port(`${id}-eth0`, 'eth0', mac, ip));
    }
    handlePacket(packet) {
        packet.state = 'delivered';
        return null;
    }
}
exports.ServerNode = ServerNode;
class RouterNode extends Node {
    constructor(id, name, pos) {
        super(id, name, 'router', pos);
        this.routingTable = new Map();
    }
    handlePacket(packet) {
        packet.ttl -= 1;
        if (packet.ttl <= 0) {
            packet.state = 'dropped';
            return null;
        }
        return packet;
    }
}
exports.RouterNode = RouterNode;
class SwitchNode extends Node {
    constructor(id, name, pos) {
        super(id, name, 'switch', pos);
        this.macTable = new Map();
    }
    handlePacket(packet) {
        this.macTable.set(packet.sourceMac, 'port-1');
        return packet;
    }
}
exports.SwitchNode = SwitchNode;
class FirewallNode extends Node {
    constructor(id, name, pos) {
        super(id, name, 'firewall', pos);
        this.blockedPorts = new Set([23, 445]);
    }
    handlePacket(packet) {
        if (this.blockedPorts.has(80)) {
            packet.state = 'blocked';
            return null;
        }
        return packet;
    }
}
exports.FirewallNode = FirewallNode;

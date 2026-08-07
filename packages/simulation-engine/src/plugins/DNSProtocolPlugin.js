"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DNSProtocolPlugin = void 0;
class DNSProtocolPlugin {
    constructor() {
        this.id = 'plugin-dns';
        this.name = 'DNS Domain Name System Protocol Plugin';
        this.protocolName = 'DNS';
        this.layer = 'Layer7';
    }
    processPacket(packet, node) {
        packet.payload = 'DNS A-Record Query: netvision.edu -> 172.16.0.5';
        return packet;
    }
}
exports.DNSProtocolPlugin = DNSProtocolPlugin;

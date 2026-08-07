"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TCPProtocolPlugin = void 0;
class TCPProtocolPlugin {
    constructor() {
        this.id = 'plugin-tcp';
        this.name = 'TCP Transmission Control Protocol Plugin';
        this.protocolName = 'TCP';
        this.layer = 'Layer4';
    }
    processPacket(packet, node) {
        if (packet.flags.includes('SYN')) {
            packet.payload = 'TCP SYN Handshake Request [Seq=100 Ack=0]';
        }
        else if (packet.flags.includes('SYN-ACK')) {
            packet.payload = 'TCP SYN-ACK Handshake Response [Seq=101 Ack=101]';
        }
        else if (packet.flags.includes('ACK')) {
            packet.payload = 'TCP ACK Handshake Established [Seq=101 Ack=101]';
        }
        return packet;
    }
}
exports.TCPProtocolPlugin = TCPProtocolPlugin;

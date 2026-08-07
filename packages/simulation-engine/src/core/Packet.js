"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Packet = void 0;
class Packet {
    constructor(id, sourceIp, targetIp, sourceMac, targetMac, protocol, payload, flags = ['SYN']) {
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
    getInspectionData() {
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
exports.Packet = Packet;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Network = void 0;
class Network {
    constructor() {
        this.nodes = new Map();
        this.cables = new Map();
        this.activePackets = [];
        this.isRunning = false;
        this.speedMultiplier = 1;
    }
    addNode(node) {
        this.nodes.set(node.id, node);
    }
    addCable(cable) {
        this.cables.set(cable.id, cable);
    }
    dispatchPacket(packet) {
        packet.state = 'in_flight';
        this.activePackets.push(packet);
        this.isRunning = true;
    }
    tick() {
        if (!this.isRunning)
            return this.activePackets;
        this.activePackets = this.activePackets.map((pkt) => {
            pkt.progressPercent += 2 * this.speedMultiplier;
            if (pkt.progressPercent >= 100) {
                pkt.progressPercent = 100;
                pkt.state = 'delivered';
            }
            return pkt;
        });
        if (this.activePackets.every((p) => p.state === 'delivered' || p.state === 'dropped' || p.state === 'blocked')) {
            this.isRunning = false;
        }
        return this.activePackets;
    }
    play() {
        this.isRunning = true;
    }
    pause() {
        this.isRunning = false;
    }
    setSpeed(multiplier) {
        this.speedMultiplier = multiplier;
    }
}
exports.Network = Network;

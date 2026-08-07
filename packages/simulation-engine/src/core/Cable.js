"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cable = void 0;
class Cable {
    constructor(id, portA, portB, bandwidthMbps = 1000, latencyMs = 1) {
        this.id = id;
        this.portA = portA;
        this.portB = portB;
        this.bandwidthMbps = bandwidthMbps;
        this.latencyMs = latencyMs;
        this.isConnected = true;
        this.activePacketsCount = 0;
        portA.isConnected = true;
        portB.isConnected = true;
    }
    detectCollision() {
        return this.activePacketsCount > 5;
    }
}
exports.Cable = Cable;

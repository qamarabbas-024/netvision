"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulationTimeline = void 0;
class SimulationTimeline {
    constructor(network) {
        this.history = [];
        this.currentFrameIndex = -1;
        this.network = network;
    }
    recordFrame() {
        const snapshot = {
            timestamp: Date.now(),
            packets: this.network.activePackets.map((p) => ({
                id: p.id,
                progressPercent: p.progressPercent,
                state: p.state,
            })),
        };
        this.history.push(snapshot);
        this.currentFrameIndex = this.history.length - 1;
        return snapshot;
    }
    stepForward() {
        if (this.currentFrameIndex < this.history.length - 1) {
            this.currentFrameIndex++;
            this.restoreSnapshot(this.history[this.currentFrameIndex]);
        }
    }
    stepBackward() {
        if (this.currentFrameIndex > 0) {
            this.currentFrameIndex--;
            this.restoreSnapshot(this.history[this.currentFrameIndex]);
        }
    }
    restoreSnapshot(snapshot) {
        this.network.activePackets = this.network.activePackets.map((p) => {
            const match = snapshot.packets.find((s) => s.id === p.id);
            if (match) {
                p.progressPercent = match.progressPercent;
                p.state = match.state;
            }
            return p;
        });
    }
    getSaveStateJson() {
        return JSON.stringify({
            history: this.history,
            currentFrameIndex: this.currentFrameIndex,
        });
    }
    loadSaveStateJson(jsonString) {
        try {
            const parsed = JSON.parse(jsonString);
            this.history = parsed.history || [];
            this.currentFrameIndex = parsed.currentFrameIndex || 0;
        }
        catch (err) {
            console.error('Failed to parse simulation state JSON:', err);
        }
    }
}
exports.SimulationTimeline = SimulationTimeline;

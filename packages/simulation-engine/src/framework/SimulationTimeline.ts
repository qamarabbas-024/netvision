import { Network } from '../core/Network';
import { PacketState } from '../types';

export interface NetworkSnapshot {
  timestamp: number;
  packets: {
    id: string;
    progressPercent: number;
    state: PacketState;
  }[];
}

export class SimulationTimeline {
  private network: Network;
  private history: NetworkSnapshot[] = [];
  private currentFrameIndex: number = -1;

  constructor(network: Network) {
    this.network = network;
  }

  public recordFrame(): NetworkSnapshot {
    const snapshot: NetworkSnapshot = {
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

  public stepForward() {
    if (this.currentFrameIndex < this.history.length - 1) {
      this.currentFrameIndex++;
      this.restoreSnapshot(this.history[this.currentFrameIndex]);
    }
  }

  public stepBackward() {
    if (this.currentFrameIndex > 0) {
      this.currentFrameIndex--;
      this.restoreSnapshot(this.history[this.currentFrameIndex]);
    }
  }

  public restoreSnapshot(snapshot: NetworkSnapshot) {
    this.network.activePackets = this.network.activePackets.map((p) => {
      const match = snapshot.packets.find((s) => s.id === p.id);
      if (match) {
        p.progressPercent = match.progressPercent;
        p.state = match.state;
      }
      return p;
    });
  }

  public getSaveStateJson(): string {
    return JSON.stringify({
      history: this.history,
      currentFrameIndex: this.currentFrameIndex,
    });
  }

  public loadSaveStateJson(jsonString: string) {
    try {
      const parsed = JSON.parse(jsonString);
      this.history = parsed.history || [];
      this.currentFrameIndex = parsed.currentFrameIndex || 0;
    } catch (err) {
      console.error('Failed to parse simulation state JSON:', err);
    }
  }
}

import { Node } from './Node';
import { Cable } from './Cable';
import { Packet } from './Packet';

export class Network {
  public nodes: Map<string, Node> = new Map();
  public cables: Map<string, Cable> = new Map();
  public activePackets: Packet[] = [];
  public isRunning: boolean = false;
  public speedMultiplier: number = 1;

  public addNode(node: Node) {
    this.nodes.set(node.id, node);
  }

  public addCable(cable: Cable) {
    this.cables.set(cable.id, cable);
  }

  public dispatchPacket(packet: Packet) {
    packet.state = 'in_flight';
    this.activePackets.push(packet);
    this.isRunning = true;
  }

  public tick(): Packet[] {
    if (!this.isRunning) return this.activePackets;

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

  public play() {
    this.isRunning = true;
  }

  public pause() {
    this.isRunning = false;
  }

  public setSpeed(multiplier: number) {
    this.speedMultiplier = multiplier;
  }
}

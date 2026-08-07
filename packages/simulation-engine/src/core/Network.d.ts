import { Node } from './Node';
import { Cable } from './Cable';
import { Packet } from './Packet';
export declare class Network {
    nodes: Map<string, Node>;
    cables: Map<string, Cable>;
    activePackets: Packet[];
    isRunning: boolean;
    speedMultiplier: number;
    addNode(node: Node): void;
    addCable(cable: Cable): void;
    dispatchPacket(packet: Packet): void;
    tick(): Packet[];
    play(): void;
    pause(): void;
    setSpeed(multiplier: number): void;
}

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
export declare class SimulationTimeline {
    private network;
    private history;
    private currentFrameIndex;
    constructor(network: Network);
    recordFrame(): NetworkSnapshot;
    stepForward(): void;
    stepBackward(): void;
    restoreSnapshot(snapshot: NetworkSnapshot): void;
    getSaveStateJson(): string;
    loadSaveStateJson(jsonString: string): void;
}

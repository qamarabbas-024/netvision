import { Port } from './Port';
export declare class Cable {
    id: string;
    portA: Port;
    portB: Port;
    bandwidthMbps: number;
    latencyMs: number;
    isConnected: boolean;
    activePacketsCount: number;
    constructor(id: string, portA: Port, portB: Port, bandwidthMbps?: number, latencyMs?: number);
    detectCollision(): boolean;
}

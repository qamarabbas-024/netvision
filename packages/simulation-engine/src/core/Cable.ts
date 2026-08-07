import { Port } from './Port';

export class Cable {
  public id: string;
  public portA: Port;
  public portB: Port;
  public bandwidthMbps: number;
  public latencyMs: number;
  public isConnected: boolean;
  public activePacketsCount: number;

  constructor(id: string, portA: Port, portB: Port, bandwidthMbps = 1000, latencyMs = 1) {
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

  public detectCollision(): boolean {
    return this.activePacketsCount > 5;
  }
}

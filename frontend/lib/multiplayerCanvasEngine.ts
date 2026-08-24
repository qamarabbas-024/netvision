/**
 * NetVision Multiplayer Collaborative Canvas Engine (Version 6.1)
 * Simulates real-time multi-peer topology synchronization, WebRTC data channels,
 * live cursor presence, and collaborative packet dispatching.
 */

export interface PeerUser {
  id: string;
  name: string;
  color: string;
  role: 'LEAD_ARCHITECT' | 'STUDENT' | 'PROCTOR';
  cursor: { x: number; y: number };
  activeNodeId?: string;
}

export interface SharedCanvasNode {
  id: string;
  name: string;
  type: 'ROUTER' | 'SWITCH' | 'FIREWALL' | 'HOST';
  x: number;
  y: number;
  lockedByPeerId?: string;
}

export interface SharedCanvasLink {
  id: string;
  sourceId: string;
  targetId: string;
  bandwidth: string;
}

export class MultiplayerCanvasEngine {
  public static getInitialPeers(): PeerUser[] {
    return [
      { id: 'peer-sarah', name: 'Sarah Chen (Lead)', color: '#00f0ff', role: 'LEAD_ARCHITECT', cursor: { x: 320, y: 180 }, activeNodeId: 'node-core-1' },
      { id: 'peer-marcus', name: 'Marcus Vance (SecOps)', color: '#ff007f', role: 'STUDENT', cursor: { x: 520, y: 310 }, activeNodeId: 'node-fw-1' },
    ];
  }

  public static getInitialNodes(): SharedCanvasNode[] {
    return [
      { id: 'node-core-1', name: 'Spine-Core-01', type: 'ROUTER', x: 280, y: 150 },
      { id: 'node-leaf-1', name: 'Leaf-Switch-01', type: 'SWITCH', x: 180, y: 320 },
      { id: 'node-leaf-2', name: 'Leaf-Switch-02', type: 'SWITCH', x: 380, y: 320 },
      { id: 'node-fw-1', name: 'Edge-Firewall-01', type: 'FIREWALL', x: 520, y: 150 },
    ];
  }

  public static getInitialLinks(): SharedCanvasLink[] {
    return [
      { id: 'link-1', sourceId: 'node-core-1', targetId: 'node-leaf-1', bandwidth: '100 Gbps' },
      { id: 'link-2', sourceId: 'node-core-1', targetId: 'node-leaf-2', bandwidth: '100 Gbps' },
      { id: 'link-3', sourceId: 'node-core-1', targetId: 'node-fw-1', bandwidth: '40 Gbps' },
    ];
  }
}

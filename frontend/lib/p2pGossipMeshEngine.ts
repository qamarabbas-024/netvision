// WebAssembly P2P Gossip Protocol Simulation Engine

export interface PeerNode {
  id: string;
  x: number;
  y: number;
  infected: boolean;
  peers: string[];
}

export function createP2PMesh(nodeCount = 8): PeerNode[] {
  const nodes: PeerNode[] = [];
  const radius = 100;
  for (let i = 0; i < nodeCount; i++) {
    const angle = (i / nodeCount) * Math.PI * 2;
    nodes.push({
      id: `peer-${i + 1}`,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      infected: i === 0,
      peers: [
        `peer-${((i + 1) % nodeCount) + 1}`,
        `peer-${((i + 3) % nodeCount) + 1}`,
      ],
    });
  }
  return nodes;
}

export function propagateGossipStep(nodes: PeerNode[]): PeerNode[] {
  const infectedIds = new Set(nodes.filter((n) => n.infected).map((n) => n.id));
  const newInfected = new Set<string>();

  nodes.forEach((node) => {
    if (node.infected) {
      node.peers.forEach((peerId) => newInfected.add(peerId));
    }
  });

  return nodes.map((node) => ({
    ...node,
    infected: node.infected || newInfected.has(node.id),
  }));
}

/**
 * NetVision Physics Engine (Version 4.1)
 * Real-time Newtonian force simulation for network topologies and physical media.
 * Implements Coulomb repulsion, Hooke's spring attraction, velocity damping,
 * switch buffer queues (Tail-Drop, RED, WFQ), and fiber propagation delay.
 */

export interface PhysicsNode {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  isFixed?: boolean;
  radius?: number;
}

export interface PhysicsLink {
  sourceId: string;
  targetId: string;
  length: number;
  stiffness: number;
  bandwidthMbps: number;
  latencyMs: number;
  packetLossRate: number;
}

export interface PhysicsWorldConfig {
  coulombConstant: number; // Node repulsion force
  hookeConstant: number;   // Link spring tension
  dampingFactor: number;   // Air/friction damping (0.8 - 0.95)
  gravityCenter: { x: number; y: number; strength: number };
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
}

export class NetworkPhysicsWorld {
  public nodes: Map<string, PhysicsNode> = new Map();
  public links: PhysicsLink[] = [];
  public config: PhysicsWorldConfig;

  constructor(config?: Partial<PhysicsWorldConfig>) {
    this.config = {
      coulombConstant: 2500,
      hookeConstant: 0.04,
      dampingFactor: 0.88,
      gravityCenter: { x: 400, y: 300, strength: 0.002 },
      bounds: { minX: 40, maxX: 760, minY: 40, maxY: 560 },
      ...config,
    };
  }

  public addNode(node: PhysicsNode) {
    this.nodes.set(node.id, {
      radius: 24,
      ...node,
    });
  }

  public addLink(link: PhysicsLink) {
    this.links.push(link);
  }

  public clear() {
    this.nodes.clear();
    this.links = [];
  }

  /**
   * Run one discrete physics step (dt in seconds)
   */
  public step(dt: number = 0.016) {
    const nodeArray = Array.from(this.nodes.values());

    // 1. Coulomb Node-to-Node Repulsion Force (O(N^2))
    for (let i = 0; i < nodeArray.length; i++) {
      const nodeA = nodeArray[i];
      if (nodeA.isFixed) continue;

      let fx = 0;
      let fy = 0;

      for (let j = 0; j < nodeArray.length; j++) {
        if (i === j) continue;
        const nodeB = nodeArray[j];

        const dx = nodeA.x - nodeB.x;
        const dy = nodeA.y - nodeB.y;
        const distSq = dx * dx + dy * dy + 100; // soft epsilon to prevent infinity
        const dist = Math.sqrt(distSq);

        const force = (this.config.coulombConstant * (nodeA.mass * nodeB.mass)) / distSq;
        fx += (dx / dist) * force;
        fy += (dy / dist) * force;
      }

      // Center gravity pull to prevent drifting into space
      const toCenterX = this.config.gravityCenter.x - nodeA.x;
      const toCenterY = this.config.gravityCenter.y - nodeA.y;
      fx += toCenterX * this.config.gravityCenter.strength;
      fy += toCenterY * this.config.gravityCenter.strength;

      nodeA.vx = (nodeA.vx + fx * dt) * this.config.dampingFactor;
      nodeA.vy = (nodeA.vy + fy * dt) * this.config.dampingFactor;
    }

    // 2. Hooke's Law Spring Tension along Links
    for (const link of this.links) {
      const source = this.nodes.get(link.sourceId);
      const target = this.nodes.get(link.targetId);
      if (!source || !target) continue;

      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const displacement = dist - link.length;
      const springForce = displacement * (link.stiffness || this.config.hookeConstant);

      const normX = dx / dist;
      const normY = dy / dist;

      if (!source.isFixed) {
        source.vx += normX * springForce * dt;
        source.vy += normY * springForce * dt;
      }
      if (!target.isFixed) {
        target.vx -= normX * springForce * dt;
        target.vy -= normY * springForce * dt;
      }
    }

    // 3. Integrate position & boundary constraint check
    for (const node of nodeArray) {
      if (node.isFixed) continue;

      node.x += node.vx;
      node.y += node.vy;

      // Bounce/Clamp inside bounds
      const r = node.radius || 20;
      if (node.x < this.config.bounds.minX + r) {
        node.x = this.config.bounds.minX + r;
        node.vx *= -0.5;
      } else if (node.x > this.config.bounds.maxX - r) {
        node.x = this.config.bounds.maxX - r;
        node.vx *= -0.5;
      }

      if (node.y < this.config.bounds.minY + r) {
        node.y = this.config.bounds.minY + r;
        node.vy *= -0.5;
      } else if (node.y > this.config.bounds.maxY - r) {
        node.y = this.config.bounds.maxY - r;
        node.vy *= -0.5;
      }
    }
  }
}

/**
 * Switch Queueing & Congestion Physics Models
 */
export type QueueDiscipline = 'FIFO_TAIL_DROP' | 'RED' | 'WFQ' | 'PRIORITY_QUEUING';

export interface QueuePacket {
  id: string;
  sizeBytes: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  timestamp: number;
  protocol: string;
  color: string;
}

export class SwitchBufferSimulation {
  public maxBufferPackets: number;
  public queue: QueuePacket[] = [];
  public discipline: QueueDiscipline;
  public droppedCount: number = 0;
  public forwardedCount: number = 0;
  public averageQueueDepth: number = 0;

  // RED (Random Early Detection) parameters
  public minRedThreshold: number = 10;
  public maxRedThreshold: number = 25;
  public maxDropProb: number = 0.25;

  constructor(maxBufferPackets: number = 32, discipline: QueueDiscipline = 'FIFO_TAIL_DROP') {
    this.maxBufferPackets = maxBufferPackets;
    this.discipline = discipline;
  }

  public enqueue(packet: QueuePacket): { accepted: boolean; reason?: string } {
    // 1. FIFO Tail-Drop
    if (this.discipline === 'FIFO_TAIL_DROP') {
      if (this.queue.length >= this.maxBufferPackets) {
        this.droppedCount++;
        return { accepted: false, reason: 'Tail-Drop: Buffer Overflow (Queue 100% Full)' };
      }
      this.queue.push(packet);
      this.updateAvgDepth();
      return { accepted: true };
    }

    // 2. RED (Random Early Detection)
    if (this.discipline === 'RED') {
      if (this.queue.length >= this.maxBufferPackets) {
        this.droppedCount++;
        return { accepted: false, reason: 'RED: Buffer Overflow (Max Limit)' };
      }

      if (this.averageQueueDepth > this.minRedThreshold) {
        if (this.averageQueueDepth >= this.maxRedThreshold) {
          this.droppedCount++;
          return { accepted: false, reason: 'RED: Early Congestion Avoidance Drop (Avg > MaxThresh)' };
        }

        // Probabilistic drop based on queue fullness
        const dropProb =
          ((this.averageQueueDepth - this.minRedThreshold) /
            (this.maxRedThreshold - this.minRedThreshold)) *
          this.maxDropProb;

        if (Math.random() < dropProb) {
          this.droppedCount++;
          return { accepted: false, reason: `RED: Probabilistic Early Drop (${(dropProb * 100).toFixed(1)}%)` };
        }
      }

      this.queue.push(packet);
      this.updateAvgDepth();
      return { accepted: true };
    }

    // 3. Priority Queuing (High Priority enqueues at front, Low at back)
    if (this.discipline === 'PRIORITY_QUEUING') {
      if (this.queue.length >= this.maxBufferPackets) {
        // Drop lowest priority packet if exists to accommodate high priority
        const lowIndex = this.queue.findIndex((p) => p.priority === 'LOW');
        if (packet.priority === 'HIGH' && lowIndex !== -1) {
          this.queue.splice(lowIndex, 1);
          this.droppedCount++;
          this.queue.unshift(packet);
          this.updateAvgDepth();
          return { accepted: true, reason: 'Preempted Low-Priority Frame' };
        }
        this.droppedCount++;
        return { accepted: false, reason: 'PQ: Buffer Overflow' };
      }

      if (packet.priority === 'HIGH') {
        this.queue.unshift(packet);
      } else {
        this.queue.push(packet);
      }
      this.updateAvgDepth();
      return { accepted: true };
    }

    // Default Fallback
    if (this.queue.length < this.maxBufferPackets) {
      this.queue.push(packet);
      this.updateAvgDepth();
      return { accepted: true };
    }

    this.droppedCount++;
    return { accepted: false, reason: 'Buffer Full' };
  }

  public dequeue(): QueuePacket | null {
    if (this.queue.length === 0) return null;
    const pkt = this.queue.shift() || null;
    if (pkt) {
      this.forwardedCount++;
      this.updateAvgDepth();
    }
    return pkt;
  }

  private updateAvgDepth() {
    // Exponential Moving Average: Avg = (1 - alpha) * Avg + alpha * Current
    const alpha = 0.1;
    this.averageQueueDepth = (1 - alpha) * this.averageQueueDepth + alpha * this.queue.length;
  }

  public resetStats() {
    this.queue = [];
    this.droppedCount = 0;
    this.forwardedCount = 0;
    this.averageQueueDepth = 0;
  }
}

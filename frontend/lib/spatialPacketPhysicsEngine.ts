// 3D Spatial Packet Particle Collision and Switch Buffer Queue Engine

export interface BufferQueueState {
  maxDepthPackets: number;
  currentDepthPackets: number;
  algorithm: 'FIFO_TAIL_DROP' | 'RED' | 'WFQ_STRICT_PRIORITY';
  droppedPackets: number;
  avgLatencyUs: number;
}

export interface PacketParticle {
  id: number;
  x: number;
  y: number;
  z: number;
  color: string;
  size: number;
  priority: 'HIGH' | 'NORMAL' | 'LOW';
  status: 'QUEUED' | 'TRANSMITTING' | 'DROPPED';
}

export function simulateBufferStep(
  particles: PacketParticle[],
  queue: BufferQueueState
): { particles: PacketParticle[]; queue: BufferQueueState } {
  const updatedQueue = { ...queue };
  const updatedParticles: PacketParticle[] = [];

  particles.forEach((p) => {
    if (p.status === 'TRANSMITTING') {
      p.x += 4;
      if (p.x < 180) updatedParticles.push(p);
    } else if (p.status === 'QUEUED') {
      p.x += 2;
      if (p.x >= 0) {
        if (updatedQueue.currentDepthPackets >= updatedQueue.maxDepthPackets) {
          p.status = 'DROPPED';
          updatedQueue.droppedPackets += 1;
          updatedParticles.push(p);
        } else {
          p.status = 'TRANSMITTING';
          updatedQueue.currentDepthPackets = Math.max(0, updatedQueue.currentDepthPackets - 1);
          updatedParticles.push(p);
        }
      } else {
        updatedParticles.push(p);
      }
    } else if (p.status === 'DROPPED') {
      p.y += 4;
      if (p.y < 120) updatedParticles.push(p);
    }
  });

  return { particles: updatedParticles, queue: updatedQueue };
}

import * as THREE from 'three';

export interface SpringConfig {
  stiffness: number; // Spring tension / stiffness (k)
  damping: number;   // Friction / resistance (c)
  mass: number;      // Inertial mass (m)
  precision?: number; // Distance threshold for resting state
}

/**
 * Default preset spring configurations for different transition archetypes
 */
export const SPRING_PRESETS = {
  // Balanced, tactile feel for general stage transitions
  standard: {
    stiffness: 48.0,
    damping: 13.5,
    mass: 1.0,
    precision: 0.0005,
  } as SpringConfig,

  // Macro precision spring: crisper deceleration and tactile cushion into packet inspection / hardware view
  tactileMacro: {
    stiffness: 58.0,
    damping: 15.2,
    mass: 1.0,
    precision: 0.0005,
  } as SpringConfig,

  // Wide aerial expansion: softer, buoyant glide returning to wide overview
  aerialOverview: {
    stiffness: 38.0,
    damping: 12.0,
    mass: 1.0,
    precision: 0.0005,
  } as SpringConfig,

  // Responsive FOV transition spring
  fovSpring: {
    stiffness: 42.0,
    damping: 13.0,
    mass: 1.0,
    precision: 0.001,
  } as SpringConfig,
};

/**
 * 3D Spring Vector state tracker for smooth camera position and lookAt interpolation
 */
export class Vector3Spring {
  current: THREE.Vector3;
  target: THREE.Vector3;
  velocity: THREE.Vector3;
  config: SpringConfig;

  constructor(initial: THREE.Vector3, config: SpringConfig = SPRING_PRESETS.standard) {
    this.current = initial.clone();
    this.target = initial.clone();
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.config = { ...config };
  }

  setTarget(target: THREE.Vector3, impulse?: THREE.Vector3) {
    this.target.copy(target);
    if (impulse) {
      this.velocity.add(impulse);
    }
  }

  setConfig(config: Partial<SpringConfig>) {
    this.config = { ...this.config, ...config };
  }

  /**
   * Update spring state using sub-stepped numerical integration for stability
   */
  update(deltaSeconds: number): boolean {
    const dt = Math.min(deltaSeconds, 0.08); // Clamp to prevent instability on frame drops
    if (dt <= 0) return false;

    const precision = this.config.precision ?? 0.0005;
    const subSteps = 4;
    const subDt = dt / subSteps;

    const k = this.config.stiffness;
    const c = this.config.damping;
    const m = Math.max(this.config.mass, 0.01);

    for (let step = 0; step < subSteps; step++) {
      // Spring force: F = -k*(x - x_target) - c*v
      const dispX = this.current.x - this.target.x;
      const dispY = this.current.y - this.target.y;
      const dispZ = this.current.z - this.target.z;

      const forceX = -k * dispX - c * this.velocity.x;
      const forceY = -k * dispY - c * this.velocity.y;
      const forceZ = -k * dispZ - c * this.velocity.z;

      const accelX = forceX / m;
      const accelY = forceY / m;
      const accelZ = forceZ / m;

      // Semi-implicit Euler integration
      this.velocity.x += accelX * subDt;
      this.velocity.y += accelY * subDt;
      this.velocity.z += accelZ * subDt;

      this.current.x += this.velocity.x * subDt;
      this.current.y += this.velocity.y * subDt;
      this.current.z += this.velocity.z * subDt;
    }

    // Check if settled within precision threshold
    const distSq = this.current.distanceToSquared(this.target);
    const velSq = this.velocity.lengthSq();

    if (distSq < precision * precision && velSq < precision * precision) {
      this.current.copy(this.target);
      this.velocity.set(0, 0, 0);
      return false; // Settled
    }

    return true; // Still active / moving
  }
}

/**
 * 1D Scalar Spring state tracker for smooth camera FOV transitions
 */
export class ScalarSpring {
  current: number;
  target: number;
  velocity: number;
  config: SpringConfig;

  constructor(initial: number, config: SpringConfig = SPRING_PRESETS.fovSpring) {
    this.current = initial;
    this.target = initial;
    this.velocity = 0;
    this.config = { ...config };
  }

  setTarget(target: number) {
    this.target = target;
  }

  update(deltaSeconds: number): boolean {
    const dt = Math.min(deltaSeconds, 0.08);
    if (dt <= 0) return false;

    const precision = this.config.precision ?? 0.001;
    const subSteps = 4;
    const subDt = dt / subSteps;

    const k = this.config.stiffness;
    const c = this.config.damping;
    const m = Math.max(this.config.mass, 0.01);

    for (let step = 0; step < subSteps; step++) {
      const disp = this.current - this.target;
      const force = -k * disp - c * this.velocity;
      const accel = force / m;

      this.velocity += accel * subDt;
      this.current += this.velocity * subDt;
    }

    if (Math.abs(this.current - this.target) < precision && Math.abs(this.velocity) < precision) {
      this.current = this.target;
      this.velocity = 0;
      return false;
    }

    return true;
  }
}

/**
 * Closed-form analytical spring easing function for normalized scroll progress [0, 1]
 * Provides tactile response, smooth acceleration, and cushioned deceleration
 */
export function springEasing(
  t: number,
  stiffness = 50.0,
  damping = 14.0
): number {
  const clampedT = Math.max(0, Math.min(1, t));
  if (clampedT === 0) return 0;
  if (clampedT === 1) return 1;

  // Damped harmonic oscillator analytical solution
  const mass = 1.0;
  const omega0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));

  if (zeta < 1) {
    // Underdamped (subtle tactile cushion with micro-settle)
    const omegaD = omega0 * Math.sqrt(1 - zeta * zeta);
    const decay = Math.exp(-zeta * omega0 * clampedT * 4.5);
    const oscillation = Math.cos(omegaD * clampedT * 4.5) + (zeta / Math.sqrt(1 - zeta * zeta)) * Math.sin(omegaD * clampedT * 4.5);
    return 1 - decay * oscillation;
  } else {
    // Critically damped or overdamped
    const decay = Math.exp(-omega0 * clampedT * 4.5);
    return 1 - decay * (1 + omega0 * clampedT * 4.5);
  }
}

/**
 * Interpolate 3D camera coordinates using spring-physics easing between Network Overview and Packet Inspection
 */
export function interpolateCameraCoordinates(
  overviewPos: [number, number, number],
  inspectionPos: [number, number, number],
  overviewLookAt: [number, number, number],
  inspectionLookAt: [number, number, number],
  overviewFov: number,
  inspectionFov: number,
  t: number,
  preset: 'tactileMacro' | 'aerialOverview' | 'standard' = 'tactileMacro'
): {
  position: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
} {
  const config = SPRING_PRESETS[preset];
  const easedT = springEasing(t, config.stiffness, config.damping);

  const posX = overviewPos[0] + (inspectionPos[0] - overviewPos[0]) * easedT;
  const posY = overviewPos[1] + (inspectionPos[1] - overviewPos[1]) * easedT;
  const posZ = overviewPos[2] + (inspectionPos[2] - overviewPos[2]) * easedT;

  const lookX = overviewLookAt[0] + (inspectionLookAt[0] - overviewLookAt[0]) * easedT;
  const lookY = overviewLookAt[1] + (inspectionLookAt[1] - overviewLookAt[1]) * easedT;
  const lookZ = overviewLookAt[2] + (inspectionLookAt[2] - overviewLookAt[2]) * easedT;

  const fov = overviewFov + (inspectionFov - overviewFov) * easedT;

  return {
    position: [posX, posY, posZ],
    lookAt: [lookX, lookY, lookZ],
    fov,
  };
}

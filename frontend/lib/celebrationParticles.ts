/**
 * NetVision Celebration Particle & Visual Effects Engine
 * Polished, high-performance canvas effects for course completion and mastery.
 *
 * Rules:
 * - Strict reduced-motion support: If prefers-reduced-motion is active, particle animations are suppressed.
 * - Non-blocking: Canvas operations run gracefully and clean up automatically.
 * - Mobile safe: Particle counts adjusted appropriately.
 */

import confetti from 'canvas-confetti';

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Triggers elegant flower petals and subtle luminous particles drifting from the top.
 * Used for Course Specialist completions (NET-101 through NET-501).
 */
export function triggerCoursePetals(): void {
  if (prefersReducedMotion()) return;

  const count = 45;
  const petalColors = ['#f472b6', '#fb7185', '#fbcfe8', '#38bdf8', '#34d399', '#fde047'];

  // Left drift wave
  confetti({
    particleCount: count,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: -0.05 },
    colors: petalColors,
    gravity: 0.5,
    drift: 0.2,
    scalar: 0.9,
    ticks: 250,
  });

  // Right drift wave
  confetti({
    particleCount: count,
    angle: 120,
    spread: 55,
    origin: { x: 1, y: -0.05 },
    colors: petalColors,
    gravity: 0.5,
    drift: -0.2,
    scalar: 0.9,
    ticks: 250,
  });

  // Center gentle cascade
  setTimeout(() => {
    if (prefersReducedMotion()) return;
    confetti({
      particleCount: 30,
      angle: 90,
      spread: 70,
      origin: { x: 0.5, y: -0.05 },
      colors: petalColors,
      gravity: 0.4,
      drift: 0,
      scalar: 1.1,
      ticks: 280,
    });
  }, 300);
}

/**
 * Triggers grand multi-stage fireworks and premium particle bursts.
 * Used for NetVision Network Mastery (NV-NET-MASTERY).
 */
export function triggerMasteryFireworks(): () => void {
  if (prefersReducedMotion()) {
    return () => {};
  }

  const duration = 3500;
  const animationEnd = Date.now() + duration;
  let animationFrameId: number | null = null;

  const masteryColors = ['#fbbf24', '#f59e0b', '#38bdf8', '#818cf8', '#c084fc', '#ffffff'];

  // Immediate central herald explosion
  confetti({
    particleCount: 80,
    spread: 100,
    origin: { y: 0.6 },
    colors: masteryColors,
    startVelocity: 45,
    gravity: 0.7,
    ticks: 300,
  });

  // Secondary firework bursts across screen
  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const particleCount = 40 * (timeLeft / duration);

    // Left cannon
    confetti({
      particleCount,
      angle: 60,
      spread: 55,
      origin: { x: 0.1, y: 0.7 },
      colors: masteryColors,
      startVelocity: 50,
      gravity: 0.6,
      ticks: 250,
    });

    // Right cannon
    confetti({
      particleCount,
      angle: 120,
      spread: 55,
      origin: { x: 0.9, y: 0.7 },
      colors: masteryColors,
      startVelocity: 50,
      gravity: 0.6,
      ticks: 250,
    });
  }, 400);

  // Return cancel handle
  return () => {
    clearInterval(interval);
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
    }
    try {
      confetti.reset();
    } catch {
      // Ignore reset failure
    }
  };
}

export function resetCelebrationParticles(): void {
  try {
    confetti.reset();
  } catch {
    // Ignore reset failure
  }
}

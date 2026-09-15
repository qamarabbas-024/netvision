/**
 * NetVision Celebration Audio Engine
 * Lightweight Web Audio API synthesizer for Course Specialist & Mastery fanfares.
 *
 * Rules:
 * - 0 external audio files (.mp3/.wav), eliminating network latency and 404s.
 * - AudioContext created strictly on user interaction (no autoplay policy violations).
 * - Persistent mute preference saved in localStorage.
 * - Fail-safe against missing AudioContext or restricted environments.
 */

const MUTE_STORAGE_KEY = 'netvision_celebration_muted';

export function isAudioMuted(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(MUTE_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setAudioMuted(muted: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MUTE_STORAGE_KEY, muted ? 'true' : 'false');
  } catch {
    // Ignore storage quota or access errors
  }
}

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
      sharedAudioCtx = new AudioCtx();
    }
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => null);
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

/**
 * Plays a gentle, celebratory chord for Course Specialist Certificate claims.
 * Progression: C5 (523.25Hz) -> E5 (659.25Hz) -> G5 (783.99Hz) -> C6 (1046.50Hz)
 */
export function playCourseCelebrationSound(): void {
  if (isAudioMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [
    { freq: 523.25, time: 0.0, duration: 0.4 }, // C5
    { freq: 659.25, time: 0.1, duration: 0.4 }, // E5
    { freq: 783.99, time: 0.2, duration: 0.5 }, // G5
    { freq: 1046.5, time: 0.3, duration: 0.8 }, // C6
  ];

  const now = ctx.currentTime;

  notes.forEach(({ freq, time, duration }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + time);

    // Warm envelope: quick attack, smooth exponential decay
    gain.gain.setValueAtTime(0.001, now + time);
    gain.gain.linearRampToValueAtTime(0.15, now + time + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + time + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + time);
    osc.stop(now + time + duration + 0.05);
  });
}

/**
 * Plays a rich, multi-stage orchestral fanfare for NetVision Network Mastery.
 * Stage 1: Tension riser hum (0.0s - 1.2s)
 * Stage 2: Majestic brass chord burst (1.2s - 2.8s)
 * Stage 3: Ascending starlight arpeggio (1.4s - 3.2s)
 */
export function playMasteryCelebrationFanfare(): void {
  if (isAudioMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Stage 1: Low atmospheric build riser
  const riserOsc = ctx.createOscillator();
  const riserGain = ctx.createGain();
  riserOsc.type = 'triangle';
  riserOsc.frequency.setValueAtTime(130.81, now); // C3
  riserOsc.frequency.exponentialRampToValueAtTime(392.0, now + 1.2); // G4

  riserGain.gain.setValueAtTime(0.001, now);
  riserGain.gain.linearRampToValueAtTime(0.08, now + 1.0);
  riserGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.25);

  riserOsc.connect(riserGain);
  riserGain.connect(ctx.destination);
  riserOsc.start(now);
  riserOsc.stop(now + 1.3);

  // Stage 2: Heroic Fanfare Triad (C4, E4, G4, C5)
  const fanfareChords = [
    { freq: 261.63, delay: 1.2, duration: 1.8, type: 'triangle' as OscillatorType, vol: 0.12 }, // C4
    { freq: 329.63, delay: 1.2, duration: 1.8, type: 'triangle' as OscillatorType, vol: 0.12 }, // E4
    { freq: 392.0, delay: 1.2, duration: 2.0, type: 'sine' as OscillatorType, vol: 0.14 },     // G4
    { freq: 523.25, delay: 1.2, duration: 2.2, type: 'sine' as OscillatorType, vol: 0.16 },    // C5
    { freq: 1046.5, delay: 1.2, duration: 2.0, type: 'sine' as OscillatorType, vol: 0.08 },    // C6 Octave shimmer
  ];

  fanfareChords.forEach(({ freq, delay, duration, type, vol }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now + delay);

    gain.gain.setValueAtTime(0.001, now + delay);
    gain.gain.linearRampToValueAtTime(vol, now + delay + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + delay);
    osc.stop(now + delay + duration + 0.1);
  });

  // Stage 3: Ascending starlight arpeggio
  const arpeggio = [
    { freq: 659.25, time: 1.5, dur: 0.5 },  // E5
    { freq: 783.99, time: 1.65, dur: 0.5 }, // G5
    { freq: 1046.5, time: 1.8, dur: 0.6 },  // C6
    { freq: 1318.5, time: 1.95, dur: 0.8 }, // E6
    { freq: 1567.98, time: 2.1, dur: 1.0 }, // G6
    { freq: 2093.0, time: 2.25, dur: 1.4 }, // C7
  ];

  arpeggio.forEach(({ freq, time, dur }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + time);

    gain.gain.setValueAtTime(0.001, now + time);
    gain.gain.linearRampToValueAtTime(0.1, now + time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + time);
    osc.stop(now + time + dur + 0.05);
  });
}

import { useEffect, useState, useRef } from 'react';
import { interpolateCameraCoordinates } from '@/lib/springPhysics';

export interface ProtocolTransitionState {
  id: string;
  name: 'DNS' | 'TCP' | 'IP' | 'HTTP3';
  opacity: number;
  scale: number;
  translateY: number;
  isActive: boolean;
  stageName: string;
}

export interface ScrollSyncState {
  scrollY: number;
  scrollProgress: number; // 0.0 to 1.0
  activeStage: 'Network Overview' | 'Packet Inspection' | 'Autonomous Routing';
  cameraPosition: [number, number, number];
  cameraLookAt: [number, number, number];
  cameraFov: number;
  protocols: {
    dns: ProtocolTransitionState;
    tcp: ProtocolTransitionState;
    ip: ProtocolTransitionState;
    http3: ProtocolTransitionState;
  };
}

/**
 * Smooth Hermite / Smoothstep transition curve: 3x^2 - 2x^3
 */
function smoothstep(min: number, max: number, value: number): number {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

/**
 * Calculates staggered fade-in / fade-out opacity and scale within a scroll progress window [start, peakStart, peakEnd, end]
 */
function computeStaggeredProtocolState(
  progress: number,
  id: string,
  name: 'DNS' | 'TCP' | 'IP' | 'HTTP3',
  stageName: string,
  range: { start: number; peakStart: number; peakEnd: number; end: number }
): ProtocolTransitionState {
  let opacity = 0;
  let scale = 0.9;
  let translateY = 10;

  if (progress >= range.start && progress <= range.end) {
    if (progress < range.peakStart) {
      // Fade in phase
      const t = smoothstep(range.start, range.peakStart, progress);
      opacity = t;
      scale = 0.9 + 0.1 * t;
      translateY = 10 * (1 - t);
    } else if (progress <= range.peakEnd) {
      // Peak active phase
      opacity = 1;
      scale = 1.0;
      translateY = 0;
    } else {
      // Fade out phase
      const t = smoothstep(range.peakEnd, range.end, progress);
      opacity = 1 - t;
      scale = 1.0 - 0.08 * t;
      translateY = -6 * t;
    }
  }

  const isActive = opacity > 0.35;

  return {
    id,
    name,
    opacity: Number(opacity.toFixed(3)),
    scale: Number(scale.toFixed(3)),
    translateY: Number(translateY.toFixed(2)),
    isActive,
    stageName,
  };
}

// Keyframe camera coordinates - Balanced cinematic framing
const CAMERA_KEYFRAMES = {
  // Stage 1: Network Overview (Hero aerial perspective)
  overview: {
    position: [0, 8.5, 14.5] as [number, number, number],
    lookAt: [0, 0.4, 0] as [number, number, number],
    fov: 38,
  },
  // Stage 2: Packet Inspection (Balanced perspective showing full topology flow without extreme zoom)
  packetInspection: {
    position: [0.4, 7.2, 12.8] as [number, number, number],
    lookAt: [0.2, 0.4, 0.1] as [number, number, number],
    fov: 37,
  },
  // Stage 3: Autonomous Cloud Routing (Balanced perspective view)
  autonomousRouting: {
    position: [1.8, 7.6, 13.5] as [number, number, number],
    lookAt: [0.8, 0.4, 0] as [number, number, number],
    fov: 37,
  },
};

/**
 * Unified scroll-sync hook mapping window scrollY progress to the 3D scene camera
 * coordinates and protocol sequence state transitions.
 */
export function useScrollSync(): ScrollSyncState {
  const [syncState, setSyncState] = useState<ScrollSyncState>(() => {
    return {
      scrollY: 0,
      scrollProgress: 0,
      activeStage: 'Network Overview',
      cameraPosition: CAMERA_KEYFRAMES.overview.position,
      cameraLookAt: CAMERA_KEYFRAMES.overview.lookAt,
      cameraFov: CAMERA_KEYFRAMES.overview.fov,
      protocols: {
        dns: computeStaggeredProtocolState(0, 'pkt-dns', 'DNS', 'Domain Resolution', {
          start: 0.0,
          peakStart: 0.08,
          peakEnd: 0.28,
          end: 0.42,
        }),
        tcp: computeStaggeredProtocolState(0, 'pkt-tcp-syn', 'TCP', '3-Way Handshake', {
          start: 0.18,
          peakStart: 0.30,
          peakEnd: 0.52,
          end: 0.65,
        }),
        ip: computeStaggeredProtocolState(0, 'pkt-ip', 'IP', 'IPv4/v6 Encapsulation', {
          start: 0.40,
          peakStart: 0.55,
          peakEnd: 0.78,
          end: 0.88,
        }),
        http3: computeStaggeredProtocolState(0, 'pkt-http3', 'HTTP3', 'QUIC Transport', {
          start: 0.62,
          peakStart: 0.75,
          peakEnd: 0.95,
          end: 1.0,
        }),
      },
    };
  });

  const rafRef = useRef<number | null>(null);
  const targetScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      targetScrollY.current = window.scrollY;

      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(updateScrollCoordinates);
      }
    };

    const updateScrollCoordinates = () => {
      rafRef.current = null;

      const currentScrollY = targetScrollY.current;
      const docHeight = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const progress = Math.max(0, Math.min(1, currentScrollY / docHeight));

      // Calculate camera coordinates with spring-physics easing between stages
      let activeStage: 'Network Overview' | 'Packet Inspection' | 'Autonomous Routing' = 'Network Overview';
      let currentPos = CAMERA_KEYFRAMES.overview.position;
      let currentLookAt = CAMERA_KEYFRAMES.overview.lookAt;
      let currentFov = CAMERA_KEYFRAMES.overview.fov;

      if (progress < 0.45) {
        // Transition from Overview to Packet Inspection
        const t = progress / 0.45;
        const interpolated = interpolateCameraCoordinates(
          CAMERA_KEYFRAMES.overview.position,
          CAMERA_KEYFRAMES.packetInspection.position,
          CAMERA_KEYFRAMES.overview.lookAt,
          CAMERA_KEYFRAMES.packetInspection.lookAt,
          CAMERA_KEYFRAMES.overview.fov,
          CAMERA_KEYFRAMES.packetInspection.fov,
          t,
          'tactileMacro'
        );
        currentPos = interpolated.position;
        currentLookAt = interpolated.lookAt;
        currentFov = interpolated.fov;
        activeStage = t > 0.5 ? 'Packet Inspection' : 'Network Overview';
      } else {
        // Transition from Packet Inspection to Autonomous Routing
        const t = (progress - 0.45) / 0.55;
        const interpolated = interpolateCameraCoordinates(
          CAMERA_KEYFRAMES.packetInspection.position,
          CAMERA_KEYFRAMES.autonomousRouting.position,
          CAMERA_KEYFRAMES.packetInspection.lookAt,
          CAMERA_KEYFRAMES.autonomousRouting.lookAt,
          CAMERA_KEYFRAMES.packetInspection.fov,
          CAMERA_KEYFRAMES.autonomousRouting.fov,
          t,
          'aerialOverview'
        );
        currentPos = interpolated.position;
        currentLookAt = interpolated.lookAt;
        currentFov = interpolated.fov;
        activeStage = 'Autonomous Routing';
      }

      // Sequence-based state transition controller for DNS, TCP, IP, HTTP/3
      const dns = computeStaggeredProtocolState(progress, 'pkt-dns', 'DNS', 'Domain Resolution', {
        start: 0.0,
        peakStart: 0.06,
        peakEnd: 0.28,
        end: 0.42,
      });

      const tcp = computeStaggeredProtocolState(progress, 'pkt-tcp-syn', 'TCP', '3-Way Handshake', {
        start: 0.16,
        peakStart: 0.30,
        peakEnd: 0.54,
        end: 0.68,
      });

      const ip = computeStaggeredProtocolState(progress, 'pkt-ip', 'IP', 'IPv4/v6 Encapsulation', {
        start: 0.38,
        peakStart: 0.52,
        peakEnd: 0.78,
        end: 0.88,
      });

      const http3 = computeStaggeredProtocolState(progress, 'pkt-http3', 'HTTP3', 'QUIC Transport', {
        start: 0.60,
        peakStart: 0.74,
        peakEnd: 0.96,
        end: 1.0,
      });

      setSyncState({
        scrollY: currentScrollY,
        scrollProgress: Number(progress.toFixed(4)),
        activeStage,
        cameraPosition: currentPos,
        cameraLookAt: currentLookAt,
        cameraFov: Number(currentFov.toFixed(2)),
        protocols: {
          dns,
          tcp,
          ip,
          http3,
        },
      });
    };

    // Passive listener for high performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial run

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return syncState;
}

'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  Award,
  Crown,
  Sparkles,
  CheckCircle2,
  X,
  Volume2,
  VolumeX,
  RotateCcw,
  ExternalLink,
  Download,
  ShieldCheck,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  playMasteryCelebrationFanfare,
  isAudioMuted,
  setAudioMuted,
} from '@/lib/celebrationAudio';
import {
  triggerMasteryFireworks,
  triggerCoursePetals,
  resetCelebrationParticles,
  prefersReducedMotion,
} from '@/lib/celebrationParticles';

export interface MasteryCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  credentialId?: string;
  onDownloadPdf?: (credentialId: string) => void;
}

export const MasteryCelebrationModal: React.FC<MasteryCelebrationProps> = ({
  isOpen,
  onClose,
  credentialId,
  onDownloadPdf,
}) => {
  const [muted, setMuted] = useState(false);
  const [hasReducedMotion, setHasReducedMotion] = useState(false);
  const [phase, setPhase] = useState<'BUILDUP' | 'CELEBRATION'>('BUILDUP');
  const cancelFireworksRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setMuted(isAudioMuted());
    setHasReducedMotion(prefersReducedMotion());
  }, []);

  const triggerCelebrationSequence = useCallback(() => {
    // If reduced motion is requested, skip dramatic buildup directly to celebration
    if (prefersReducedMotion()) {
      setPhase('CELEBRATION');
      playMasteryCelebrationFanfare();
      return;
    }

    setPhase('BUILDUP');
    playMasteryCelebrationFanfare();

    // 1.2s atmospheric buildup before full firework & petal reveal
    const timer = setTimeout(() => {
      setPhase('CELEBRATION');
      const cancelFn = triggerMasteryFireworks();
      cancelFireworksRef.current = cancelFn;
      // Also add gentle petal cascade
      triggerCoursePetals();
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const cleanup = triggerCelebrationSequence();
      return () => {
        if (cleanup) cleanup();
        if (cancelFireworksRef.current) cancelFireworksRef.current();
        resetCelebrationParticles();
      };
    } else {
      setPhase('BUILDUP');
      if (cancelFireworksRef.current) cancelFireworksRef.current();
      resetCelebrationParticles();
    }
  }, [isOpen, triggerCelebrationSequence]);

  // Keyboard accessibility: ESC closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const toggleMute = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    setAudioMuted(nextMuted);
  };

  const handleReplay = () => {
    if (cancelFireworksRef.current) cancelFireworksRef.current();
    resetCelebrationParticles();
    triggerCelebrationSequence();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mastery-celebration-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-xl overflow-y-auto"
    >
      {/* Screen Reader Announcement */}
      <div className="sr-only" aria-live="polite">
        Grand Achievement! 5 out of 5 courses completed. You have achieved NetVision Network Engineering Mastery. Credential identifier: {credentialId || 'Verified'}.
      </div>

      <div
        className={`relative w-full max-w-xl rounded-3xl bg-gradient-to-b from-[#12101e] via-[#0d0d18] to-[#07070f] border-2 border-amber-500/40 shadow-[0_0_80px_rgba(245,158,11,0.25)] p-6 sm:p-8 overflow-hidden text-slate-100 ${
          hasReducedMotion ? '' : 'animate-in fade-in zoom-in-95 duration-400'
        }`}
      >
        {/* Holographic Ambient Backlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-cyan-500/20 blur-3xl pointer-events-none" />

        {/* Top Controls: Replay, Mute, Skip */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-500/20 relative z-10">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleReplay}
              title="Replay Celebration"
              aria-label="Replay celebration fireworks and fanfare"
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800/60 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={toggleMute}
              title={muted ? 'Unmute Sound' : 'Mute Sound'}
              aria-label={muted ? 'Unmute fanfare sound' : 'Mute fanfare sound'}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800/60 transition-colors"
            >
              {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          <button
            onClick={onClose}
            aria-label="Skip or close celebration"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <span>Skip</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Buildup Stage Glow Indicator */}
        {phase === 'BUILDUP' && !hasReducedMotion && (
          <div className="my-10 flex flex-col items-center justify-center text-center space-y-4 py-8 relative z-10 animate-pulse">
            <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-400/60 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.5)]">
              <Crown className="w-10 h-10 text-amber-400" />
            </div>
            <p className="text-sm font-mono uppercase tracking-widest text-amber-300 font-bold">
              Synthesizing Authoritative Mastery Credential...
            </p>
          </div>
        )}

        {/* Celebration Reveal Body */}
        {(phase === 'CELEBRATION' || hasReducedMotion) && (
          <div className="mt-4 flex flex-col items-center text-center relative z-10">
            {/* Grand Crown Badge */}
            <div className="relative mb-3">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-600/30 via-amber-500/40 to-yellow-400/20 border-2 border-amber-400/60 flex items-center justify-center shadow-2xl shadow-amber-500/30">
                <Crown className="w-10 h-10 sm:w-12 sm:h-12 text-amber-300 drop-shadow-[0_0_16px_rgba(245,158,11,0.8)]" />
              </div>
              <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-emerald-500 text-black border-2 border-[#12101e] shadow-md">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            {/* Mastery Banner */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-400/50 text-[11px] sm:text-xs font-mono font-black text-amber-300 tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>5 / 5 COURSES COMPLETED — NETVISION NETWORK ENGINEERING MASTERY</span>
            </div>

            <h2
              id="mastery-celebration-title"
              className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight mt-1"
            >
              Distinguished Network Engineer
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md">
              Highest platform credential awarded for demonstrated mastery across foundational protocols, routing architecture, cybersecurity, and advanced automated networks.
            </p>

            {/* Credential Seal Card */}
            <div className="w-full mt-5 p-4 rounded-2xl bg-[#090812] border border-amber-500/30 flex items-center justify-between text-left shadow-inner">
              <div className="min-w-0 pr-3">
                <span className="text-[10px] font-mono text-amber-400/70 uppercase block font-semibold">
                  Cryptographic Seal &amp; Master ID
                </span>
                <span className="text-xs sm:text-sm font-mono font-bold text-amber-200 truncate block">
                  {credentialId || 'NV-NET-MASTERY-VERIFIED'}
                </span>
              </div>
              <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] font-mono font-bold text-amber-300">AUTHORITATIVE</span>
              </div>
            </div>

            {/* Highlights Grid */}
            <div className="w-full mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="font-mono font-bold text-amber-400 text-sm">5 / 5</div>
                <div className="text-[10px] text-slate-400">Certificates</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="font-mono font-bold text-emerald-400 text-sm">100%</div>
                <div className="text-[10px] text-slate-400">Capstone Pass</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="font-mono font-bold text-cyan-400 text-sm">LEVEL 6</div>
                <div className="text-[10px] text-slate-400">Mastery Rank</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {credentialId && (
                <Link
                  href={`/certificates/${encodeURIComponent(credentialId)}`}
                  className="w-full"
                >
                  <Button variant="outline" className="w-full justify-center gap-1.5 text-xs py-2.5 border-amber-500/40 hover:border-amber-400 text-amber-200">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>View Mastery Certificate</span>
                  </Button>
                </Link>
              )}

              {onDownloadPdf && credentialId ? (
                <Button
                  variant="outline"
                  onClick={() => onDownloadPdf(credentialId)}
                  className="w-full justify-center gap-1.5 text-xs py-2.5 border-amber-500/40 hover:border-amber-400 text-amber-200"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download Master PDF</span>
                </Button>
              ) : credentialId ? (
                <Link
                  href={`/certificates/verify/${encodeURIComponent(credentialId)}`}
                  className="w-full"
                >
                  <Button variant="outline" className="w-full justify-center gap-1.5 text-xs py-2.5 border-amber-500/40 hover:border-amber-400 text-amber-200">
                    <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                    <span>Verify in Public Registry</span>
                  </Button>
                </Link>
              ) : null}
            </div>

            <Button
              variant="primary"
              onClick={onClose}
              className="w-full mt-3 justify-center gap-2 py-3 text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black border-none shadow-lg shadow-amber-500/20"
            >
              <span>Return to Learning Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

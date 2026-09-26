'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Award,
  CheckCircle2,
  X,
  Volume2,
  VolumeX,
  RotateCcw,
  ExternalLink,
  Download,
  FileCheck2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useModalA11y } from '@/hooks/useModalA11y';
import {
  playCourseCelebrationSound,
  isAudioMuted,
  setAudioMuted,
} from '@/lib/celebrationAudio';
import {
  triggerCoursePetals,
  resetCelebrationParticles,
  prefersReducedMotion,
} from '@/lib/celebrationParticles';

export interface CourseCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  courseCode: string;
  courseTitle: string;
  credentialId: string;
  earnedCount: number; // 1 to 5
  totalRequired?: number;
  onDownloadPdf?: (credentialId: string, code: string) => void;
}

export const CourseCelebrationModal: React.FC<CourseCelebrationProps> = ({
  isOpen,
  onClose,
  courseCode,
  courseTitle,
  credentialId,
  earnedCount,
  totalRequired = 5,
  onDownloadPdf,
}) => {
  const [muted, setMuted] = useState(false);
  const [hasReducedMotion, setHasReducedMotion] = useState(false);

  // Initialize preferences
  useEffect(() => {
    setMuted(isAudioMuted());
    setHasReducedMotion(prefersReducedMotion());
  }, []);

  const triggerCelebration = useCallback(() => {
    playCourseCelebrationSound();
    triggerCoursePetals();
  }, []);

  // Trigger celebration upon open
  useEffect(() => {
    if (isOpen) {
      triggerCelebration();
    } else {
      resetCelebrationParticles();
    }
  }, [isOpen, triggerCelebration]);

  const modalRef = useModalA11y({ isOpen, onClose });

  const toggleMute = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    setAudioMuted(nextMuted);
  };

  const handleReplay = () => {
    triggerCelebration();
  };

  if (!isOpen) return null;

  const progressPercentage = Math.min(100, Math.round((earnedCount / totalRequired) * 100));

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-celebration-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      {/* Screen Reader Announcement */}
      <div className="sr-only" aria-live="polite">
        Congratulations! You have completed {courseCode}: {courseTitle}. You have earned {earnedCount} out of {totalRequired} required certifications towards NetVision Mastery.
      </div>

      <div
        className={`relative w-full max-w-lg rounded-2xl bg-[#0d1017] border border-cyan-500/30 shadow-[0_0_50px_rgba(56,189,248,0.15)] p-5 sm:p-7 overflow-hidden text-slate-100 ${
          hasReducedMotion ? '' : 'animate-in fade-in zoom-in-95 duration-300'
        }`}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-cyan-500/10 blur-3xl pointer-events-none" />

        {/* Header Controls: Replay, Mute, Close/Skip */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleReplay}
              title="Replay Celebration"
              aria-label="Replay celebration petals and fanfare"
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={toggleMute}
              title={muted ? 'Unmute Sound' : 'Mute Sound'}
              aria-label={muted ? 'Unmute celebration sound' : 'Mute celebration sound'}
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 transition-colors"
            >
              {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          <button
            onClick={onClose}
            aria-label="Skip or close celebration"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <span>Skip</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Certificate Reveal Body */}
        <div className="mt-4 flex flex-col items-center text-center relative z-10">
          {/* Animated Badge Icon */}
          <div className="relative mb-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-cyan-600/20 via-cyan-500/30 to-emerald-500/20 border border-cyan-400/40 flex items-center justify-center shadow-lg shadow-cyan-500/10">
              <Award className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]" />
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 p-1 rounded-full bg-emerald-500 text-black border-2 border-[#0d1017]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-mono font-bold text-cyan-400 mb-2">
            <Sparkles className="w-3 h-3" />
            <span>SPECIALIST CREDENTIAL MINTED</span>
          </div>

          <h2 id="course-celebration-title" className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {courseTitle}
          </h2>
          <p className="text-xs font-mono text-cyan-300 mt-1 uppercase tracking-wider">
            {courseCode} Specialist
          </p>

          {/* Credential ID Card */}
          <div className="w-full mt-4 p-3 rounded-xl bg-[#080b11] border border-slate-800 flex items-center justify-between text-left">
            <div className="min-w-0 pr-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Authoritative Credential ID</span>
              <span className="text-xs font-mono font-bold text-slate-200 truncate block">
                {credentialId}
              </span>
            </div>
            <div className="shrink-0 flex items-center gap-1">
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                VERIFIED
              </span>
            </div>
          </div>

          {/* Progress X / 5 Towards Mastery */}
          <div className="w-full mt-4 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-left">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-300">Mastery Track Progress</span>
              <span className="font-mono font-bold text-cyan-400">
                {earnedCount} / {totalRequired} Specialist Credentials
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              {earnedCount >= totalRequired ? (
                <span className="text-emerald-300 font-semibold">
                  All 5 specialist credentials unlocked! You are now eligible for the Master Capstone.
                </span>
              ) : (
                <span>
                  Earn <strong>{totalRequired - earnedCount} more specialist credential{totalRequired - earnedCount > 1 ? 's' : ''}</strong> to unlock the authoritative NetVision Master Capstone Examination.
                </span>
              )}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="w-full mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <Link
              href={`/certificates/${encodeURIComponent(credentialId)}`}
              className="w-full"
            >
              <Button variant="outline" className="w-full justify-center gap-1.5 text-xs py-2 border-slate-700 hover:border-cyan-400">
                <FileCheck2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>View Certificate</span>
              </Button>
            </Link>

            {onDownloadPdf ? (
              <Button
                variant="outline"
                onClick={() => onDownloadPdf(credentialId, courseCode)}
                className="w-full justify-center gap-1.5 text-xs py-2 border-slate-700 hover:border-cyan-400"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Download PDF</span>
              </Button>
            ) : (
              <Link
                href={`/certificates/verify/${encodeURIComponent(credentialId)}`}
                className="w-full"
              >
                <Button variant="outline" className="w-full justify-center gap-1.5 text-xs py-2 border-slate-700 hover:border-cyan-400">
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Public Registry</span>
                </Button>
              </Link>
            )}
          </div>

          <Button
            variant="primary"
            onClick={onClose}
            className="w-full mt-3 justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black border-none"
          >
            <span>Continue Journey</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

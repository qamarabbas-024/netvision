'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { PulsePacketLoader } from '@/components/ui/Loading';
import {
  Award,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  Lock,
  Clock,
  ExternalLink,
  RotateCcw,
  Sparkles,
  ArrowRight,
  AlertCircle,
  X,
  FileCheck2,
  FileText,
} from 'lucide-react';
import {
  getUserCertificatesApi,
  checkCourseEligibilityApi,
  checkMasteryEligibilityApi,
  claimCertificationCertificateApi,
  UserCertificateItem,
  CourseEligibilityResult,
  MasteryEligibilityResult,
} from '@/lib/api';
import { FLAGSHIP_5_COURSES } from '@netvision/shared';

interface DashboardCertificationsProps {
  isAuthenticated: boolean;
}

export const DashboardCertifications: React.FC<DashboardCertificationsProps> = ({ isAuthenticated }) => {
  const [userCertificates, setUserCertificates] = useState<UserCertificateItem[]>([]);
  const [courseEligibilities, setCourseEligibilities] = useState<Record<string, CourseEligibilityResult>>({});
  const [masteryEligibility, setMasteryEligibility] = useState<MasteryEligibilityResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [claimingCode, setClaimingCode] = useState<string | null>(null);
  const [claimFeedback, setClaimFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
    code: string;
    credentialId?: string;
  } | null>(null);

  const loadCertificationData = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError(null);

    try {
      // Execute all authoritative certification queries in parallel to eliminate API waterfalls
      const [userCertsResult, masteryResult, ...courseResults] = await Promise.allSettled([
        getUserCertificatesApi(),
        checkMasteryEligibilityApi(),
        ...FLAGSHIP_5_COURSES.map((course) => checkCourseEligibilityApi(course.code)),
      ]);

      if (userCertsResult.status === 'fulfilled') {
        setUserCertificates(userCertsResult.value);
      } else {
        console.warn('Could not fetch user certificates:', userCertsResult.reason);
      }

      if (masteryResult.status === 'fulfilled') {
        setMasteryEligibility(masteryResult.value);
      } else {
        console.warn('Could not fetch mastery eligibility:', masteryResult.reason);
      }

      const eligMap: Record<string, CourseEligibilityResult> = {};
      courseResults.forEach((result, idx) => {
        const course = FLAGSHIP_5_COURSES[idx];
        if (result.status === 'fulfilled' && result.value) {
          eligMap[course.code] = result.value;
        }
      });
      setCourseEligibilities(eligMap);

      // If every single call failed, report error
      if (
        userCertsResult.status === 'rejected' &&
        masteryResult.status === 'rejected' &&
        courseResults.every((r) => r.status === 'rejected')
      ) {
        setLoadError('Authoritative certification service unreachable. Please retry.');
      }
    } catch (err: any) {
      console.error('Error fetching certification registry:', err);
      setLoadError(err?.message || 'Failed to load certification telemetry.');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadCertificationData();
  }, [loadCertificationData]);

  const handleClaim = async (code: string) => {
    setClaimingCode(code);
    setClaimFeedback(null);

    try {
      const minted = await claimCertificationCertificateApi(code);
      setClaimFeedback({
        type: 'success',
        code,
        credentialId: minted.credentialId,
        message: `Certificate for ${minted.certificationCode || code} successfully minted! Credential ID: ${minted.credentialId}`,
      });
      // Refresh authoritative data immediately after minting
      await loadCertificationData();
    } catch (err: any) {
      console.warn(`[NetVision Claim] Claim request failed for ${code}:`, err);
      setClaimFeedback({
        type: 'error',
        code,
        message: err?.message || 'Certificate claim denied. You have not met the authoritative requirements.',
      });
    } finally {
      setClaimingCode(null);
    }
  };

  // State: Guest Learner
  if (!isAuthenticated) {
    return (
      <section aria-labelledby="certifications-heading" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold uppercase tracking-wider bg-[#14151a] text-[#38bdf8] border border-[#2a2e39] mb-1">
              <span>AUTHORITATIVE CREDENTIAL REGISTRY</span>
            </div>
            <h2 id="certifications-heading" className="text-lg sm:text-xl font-bold text-[#f4f5f7]">
              Professional Certifications &amp; Credentials
            </h2>
          </div>
        </div>

        <div className="surface-2 p-6 rounded-xl border border-[#2a2e39] text-center flex flex-col items-center gap-3 shadow-instrument">
          <Award className="w-8 h-8 text-[#646c7d]" />
          <div>
            <h3 className="text-sm font-bold text-[#f4f5f7] mb-1">Authenticated Credentials Required</h3>
            <p className="text-xs text-[#8e95a5] max-w-md mx-auto">
              Sign in or create a verified account to view your server-authoritative certification eligibility, earn course certificates, and qualify for the Master Capstone examination.
            </p>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Link href="/login">
              <Button variant="secondary" size="sm">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">Create Account</Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // State: Loading
  if (isLoading) {
    return (
      <section aria-labelledby="certifications-heading" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold uppercase tracking-wider bg-[#14151a] text-[#38bdf8] border border-[#2a2e39] mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
              <span>AUTHORITATIVE CREDENTIAL REGISTRY</span>
            </div>
            <h2 id="certifications-heading" className="text-lg sm:text-xl font-bold text-[#f4f5f7]">
              Professional Certifications &amp; Credentials
            </h2>
          </div>
        </div>
        <div className="surface-2 p-12 rounded-xl border border-[#2a2e39] flex flex-col items-center justify-center gap-3 shadow-instrument">
          <PulsePacketLoader label="Syncing Authoritative Credential Registry..." />
        </div>
      </section>
    );
  }

  // State: Error
  if (loadError) {
    return (
      <section aria-labelledby="certifications-heading" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 id="certifications-heading" className="text-lg sm:text-xl font-bold text-[#f4f5f7]">
            Professional Certifications &amp; Credentials
          </h2>
        </div>
        <div className="surface-2 p-6 rounded-xl border border-rose-500/30 bg-rose-500/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-white">Certification Telemetry Error</h3>
              <p className="text-xs text-rose-300/80">{loadError}</p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={loadCertificationData}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Retry Connection
          </Button>
        </div>
      </section>
    );
  }

  // Count active earned certificates
  const earnedCount = userCertificates.length;

  return (
    <section aria-labelledby="certifications-heading" className="flex flex-col gap-6">
      {/* Header & Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#2a2e39]">
        <div>
          <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold uppercase tracking-wider bg-[#14151a] text-[#38bdf8] border border-[#2a2e39] mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            <span>AUTHORITATIVE CREDENTIAL REGISTRY</span>
          </div>
          <h2 id="certifications-heading" className="text-lg sm:text-xl font-bold text-[#f4f5f7]">
            Professional Certifications &amp; Credentials
          </h2>
          <p className="text-xs text-[#8e95a5] mt-0.5">
            Server-authoritative credential tracking verified against cryptographic registry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-lg bg-[#14151a] border border-[#2a2e39] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#38bdf8]" />
            <span className="text-xs font-mono font-bold text-[#f4f5f7]">
              {earnedCount} / 6 Earned
            </span>
          </div>
          <Link href="/certificates">
            <Button variant="ghost" size="sm" className="text-xs text-[#38bdf8] hover:text-white">
              Public Directory →
            </Button>
          </Link>
        </div>
      </div>

      {/* Claim Feedback Banner */}
      {claimFeedback && (
        <div
          role="status"
          aria-live="polite"
          className={`p-4 rounded-xl border flex items-start sm:items-center justify-between gap-4 transition-all ${
            claimFeedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-3">
            {claimFeedback.type === 'success' ? (
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <div>
              <p className="text-xs sm:text-sm font-semibold">{claimFeedback.message}</p>
              {claimFeedback.credentialId && (
                <div className="mt-1">
                  <Link
                    href={`/certificates/verify/${encodeURIComponent(claimFeedback.credentialId)}`}
                    className="text-xs font-mono underline font-bold text-emerald-300 hover:text-white inline-flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" /> View Public Verification
                  </Link>
                </div>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setClaimFeedback(null)}
            aria-label="Dismiss notification"
            className="text-zinc-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. PINNACLE MASTERY CREDENTIAL (NV-NET-MASTERY)                            */}
      {/* ========================================================================= */}
      {(() => {
        const masteryCert = userCertificates.find(
          (c) => c.certificationCode === 'NV-NET-MASTERY'
        );
        const hasMasteryCert = !!masteryCert || !!masteryEligibility?.hasCertificate;
        const isMasteryEligible = !!masteryEligibility?.eligible && !hasMasteryCert;
        const breakdown = masteryEligibility?.breakdown;

        // Count course certificates acquired
        const acquiredCount = breakdown?.courseCertificates?.acquiredCodes?.length ?? 0;
        const lessonsPassed = breakdown?.flagshipLessons?.passed ?? false;
        const quizzesPassed = breakdown?.cumulativeAssessments?.passed ?? false;
        const labsPassed = breakdown?.flagshipLabs?.passed ?? false;
        const capstonePassed = breakdown?.masterCapstone?.passed ?? false;

        const isClaiming = claimingCode === 'NV-NET-MASTERY';

        return (
          <Card className="p-6 sm:p-8 rounded-2xl surface-2 border-2 border-[#818cf8]/40 bg-gradient-to-br from-[#121217] via-[#14141e] to-[#121217] shadow-elevated relative overflow-hidden">
            {/* Cybernetic Accent Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#818cf8]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col gap-6 relative z-10">
              {/* Header Row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#2a2e39]">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant="purple" className="font-mono text-[10px]">
                      NV-NET-MASTERY
                    </Badge>
                    <Badge variant="cyan" className="font-mono text-[10px]">
                      PINNACLE CREDENTIAL
                    </Badge>
                    {hasMasteryCert ? (
                      <Badge variant="emerald" dot={true} className="font-mono text-[10px]">
                        EARNED &amp; VERIFIED
                      </Badge>
                    ) : isMasteryEligible ? (
                      <Badge variant="cyan" dot={true} className="font-mono text-[10px]">
                        ELIGIBLE TO CLAIM
                      </Badge>
                    ) : (
                      <Badge variant="neutral" className="font-mono text-[10px]">
                        IN PROGRESS
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    NetVision Certified Network Engineering Master
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8e95a5] mt-1 max-w-2xl">
                    NetVision&apos;s highest tier credential. Requires earning all five foundational certifications, passing every practical lab, maintaining an 85%+ assessment average, and successfully completing the Master Capstone examination.
                  </p>
                </div>

                {/* Primary Action Button */}
                <div className="shrink-0 flex items-center gap-3">
                  {hasMasteryCert ? (
                    <div className="flex items-center gap-2">
                      <Link href={`/certificates/${encodeURIComponent(masteryCert?.credentialId || 'NV-NET-MASTERY')}`}>
                        <Button variant="secondary" size="sm" className="flex items-center gap-1.5 text-xs">
                          <FileText className="w-3.5 h-3.5" /> View Record
                        </Button>
                      </Link>
                      <Link href={`/certificates/verify/${encodeURIComponent(masteryCert?.credentialId || 'NV-NET-MASTERY')}`}>
                        <Button variant="primary" size="sm" className="flex items-center gap-1.5 text-xs">
                          <ShieldCheck className="w-3.5 h-3.5" /> Verify
                        </Button>
                      </Link>
                    </div>
                  ) : isMasteryEligible ? (
                    <Button
                      variant="cyan"
                      size="md"
                      isLoading={isClaiming}
                      onClick={() => handleClaim('NV-NET-MASTERY')}
                      className="flex items-center gap-2 shadow-glow font-bold"
                    >
                      <Sparkles className="w-4 h-4" /> Claim Mastery Credential
                    </Button>
                  ) : (
                    <div className="flex flex-col items-end gap-1.5">
                      <Link href="/certifications/capstone">
                        <Button variant="secondary" size="sm" className="text-xs font-semibold flex items-center gap-1.5 text-[#818cf8] hover:text-white">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Capstone Portal</span>
                        </Button>
                      </Link>
                      <span className="text-[10px] font-mono text-[#8e95a5]">
                        Prerequisites Tracking
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 5 Authoritative Criteria Pillars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {/* Pillar 1: 5 Course Certifications */}
                <div className="p-3.5 rounded-xl bg-[#14151a] border border-[#2a2e39] flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#8e95a5] uppercase block mb-1">
                      1. Course Certs
                    </span>
                    <span className="text-sm font-bold text-white font-mono block">
                      {acquiredCount} / 5 Acquired
                    </span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#2a2e39]/60 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#8e95a5]">All 5 Required</span>
                    {breakdown?.courseCertificates?.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                    ) : (
                      <Clock className="w-4 h-4 text-[#f59e0b]" />
                    )}
                  </div>
                </div>

                {/* Pillar 2: Flagship Lessons */}
                <div className="p-3.5 rounded-xl bg-[#14151a] border border-[#2a2e39] flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#8e95a5] uppercase block mb-1">
                      2. Flagship Lessons
                    </span>
                    <span className="text-sm font-bold text-white font-mono block">
                      {breakdown?.flagshipLessons?.completed ?? 0} / {breakdown?.flagshipLessons?.total ?? 30}
                    </span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#2a2e39]/60 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#8e95a5]">100% Required</span>
                    {lessonsPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                    ) : (
                      <Clock className="w-4 h-4 text-[#f59e0b]" />
                    )}
                  </div>
                </div>

                {/* Pillar 3: Cumulative Quiz Benchmark */}
                <div className="p-3.5 rounded-xl bg-[#14151a] border border-[#2a2e39] flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#8e95a5] uppercase block mb-1">
                      3. Assessment Avg
                    </span>
                    <span className="text-sm font-bold text-white font-mono block">
                      {breakdown?.cumulativeAssessments?.cumulativeAverage ?? 0}%
                    </span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#2a2e39]/60 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#8e95a5]">≥ 85% Benchmark</span>
                    {quizzesPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                    ) : (
                      <Clock className="w-4 h-4 text-[#f59e0b]" />
                    )}
                  </div>
                </div>

                {/* Pillar 4: Flagship Practical Labs */}
                <div className="p-3.5 rounded-xl bg-[#14151a] border border-[#2a2e39] flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#8e95a5] uppercase block mb-1">
                      4. Practical Labs
                    </span>
                    <span className="text-sm font-bold text-white font-mono block">
                      {breakdown?.flagshipLabs?.passedCount ?? 0} / {breakdown?.flagshipLabs?.total ?? 15}
                    </span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#2a2e39]/60 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#8e95a5]">100% Passed</span>
                    {labsPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                    ) : (
                      <Clock className="w-4 h-4 text-[#f59e0b]" />
                    )}
                  </div>
                </div>

                {/* Pillar 5: Master Capstone Exam */}
                <div className="p-3.5 rounded-xl bg-[#14151a] border border-[#2a2e39] flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#8e95a5] uppercase block mb-1">
                      5. Master Capstone
                    </span>
                    <span className="text-sm font-bold text-white font-mono block">
                      {capstonePassed
                        ? `${breakdown?.masterCapstone?.score ?? 85}%`
                        : breakdown?.masterCapstone?.score != null
                        ? `${breakdown?.masterCapstone?.score}%`
                        : 'Pending'}
                    </span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#2a2e39]/60 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#8e95a5]">≥ 85% Required</span>
                    {capstonePassed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                    ) : (
                      <Lock className="w-4 h-4 text-[#646c7d]" />
                    )}
                  </div>
                </div>
              </div>

              {/* Blocking Requirements (if any) */}
              {!hasMasteryCert && !isMasteryEligible && masteryEligibility?.blockingRequirements && masteryEligibility.blockingRequirements.length > 0 && (
                <div className="p-3.5 rounded-xl bg-[#09090b]/80 border border-[#2a2e39] text-xs text-[#8e95a5] flex flex-col gap-1 font-mono">
                  <span className="text-[10px] uppercase text-[#818cf8] font-bold">Outstanding Mastery Requirements:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                    {masteryEligibility.blockingRequirements.slice(0, 3).map((req, idx) => (
                      <li key={idx} className="truncate">{req}</li>
                    ))}
                    {masteryEligibility.blockingRequirements.length > 3 && (
                      <li className="text-[10px] text-zinc-500">
                        + {masteryEligibility.blockingRequirements.length - 3} additional requirements pending
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        );
      })()}

      {/* ========================================================================= */}
      {/* 2. FIVE FLAGSHIP COURSE CREDENTIAL CARDS (NV-NET-C01 to NV-NET-C05)      */}
      {/* ========================================================================= */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#f4f5f7] uppercase tracking-wider font-mono">
            Flagship Course Certifications (5 Programs)
          </h3>
          <span className="text-xs font-mono text-[#8e95a5]">
            4-Point Authoritative Verification
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FLAGSHIP_5_COURSES.map((course) => {
            const courseCode = course.code;
            const credCode = course.credentialCode;
            const elig = courseEligibilities[courseCode];

            // Check if active certificate exists in userCertificates or eligibility response
            const existingCert = userCertificates.find(
              (c) => c.certificationCode === credCode || c.courseCode === courseCode
            );
            const hasCert = !!existingCert || !!elig?.hasCertificate;
            const isEligible = !!elig?.eligible && !hasCert;

            // Determine status
            const breakdown = elig?.breakdown;
            const lessonsCompleted = breakdown?.lessons?.completed ?? 0;
            const lessonsTotal = breakdown?.lessons?.total ?? 1;
            const quizScoreAvg = breakdown?.assessments?.averageScore ?? 0;
            const labsPassed = breakdown?.labs?.passedCount ?? 0;
            const labsTotal = breakdown?.labs?.total ?? 0;

            const hasProgress =
              lessonsCompleted > 0 ||
              (breakdown?.assessments?.attemptedCount ?? 0) > 0 ||
              labsPassed > 0;

            const isClaiming = claimingCode === credCode;

            let statusVariant: 'emerald' | 'cyan' | 'amber' | 'neutral' = 'neutral';
            let statusText = 'LOCKED';

            if (hasCert) {
              statusVariant = 'emerald';
              statusText = 'EARNED';
            } else if (isEligible) {
              statusVariant = 'cyan';
              statusText = 'ELIGIBLE TO CLAIM';
            } else if (hasProgress) {
              statusVariant = 'amber';
              statusText = 'IN PROGRESS';
            }

            return (
              <Card
                key={courseCode}
                className="surface-2 p-5 rounded-xl border border-[#2a2e39] flex flex-col justify-between shadow-instrument hover:border-[#38bdf8]/40 transition-all"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-[#14151a] border border-[#2a2e39] text-[10px] font-mono font-bold text-[#38bdf8]">
                        {credCode}
                      </span>
                      <span className="text-[10px] font-mono text-[#8e95a5]">
                        {courseCode}
                      </span>
                    </div>
                    <Badge variant={statusVariant} dot={hasCert || isEligible || hasProgress}>
                      {statusText}
                    </Badge>
                  </div>

                  {/* Title & Description */}
                  <h4 className="text-base font-bold text-[#f4f5f7] mb-1 leading-snug">
                    {course.title}
                  </h4>
                  <p className="text-xs text-[#8e95a5] mb-4 line-clamp-2 leading-relaxed">
                    {course.tagline}
                  </p>

                  {/* Breakdown Telemetry */}
                  <div className="space-y-2.5 p-3 rounded-lg bg-[#14151a] border border-[#2a2e39] mb-4">
                    {/* Lessons */}
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#8e95a5]">Curriculum (100%)</span>
                      <span className="font-bold text-white">
                        {lessonsCompleted} / {lessonsTotal}
                      </span>
                    </div>

                    {/* Assessments */}
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#8e95a5]">Quiz Avg (≥80%)</span>
                      <span className="font-bold text-white">
                        {quizScoreAvg}%
                      </span>
                    </div>

                    {/* Labs */}
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#8e95a5]">Practical Labs</span>
                      <span className="font-bold text-white">
                        {labsPassed} / {labsTotal}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Area */}
                <div className="pt-3 border-t border-[#2a2e39] flex items-center justify-between gap-3">
                  {hasCert ? (
                    <Link
                      href={`/certificates/verify/${encodeURIComponent(existingCert?.credentialId || credCode)}`}
                      className="w-full"
                    >
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full flex items-center justify-center gap-1.5 text-xs text-[#10b981] hover:text-white"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verify Credential</span>
                      </Button>
                    </Link>
                  ) : isEligible ? (
                    <Button
                      variant="cyan"
                      size="sm"
                      isLoading={isClaiming}
                      onClick={() => handleClaim(credCode)}
                      className="w-full flex items-center justify-center gap-1.5 text-xs font-bold shadow-sm"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>Claim Certificate</span>
                    </Button>
                  ) : (
                    <Link href={`/courses/${course.slug}`} className="w-full">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full flex items-center justify-center gap-1.5 text-xs text-[#38bdf8] hover:bg-[#1f222c]"
                      >
                        <span>{hasProgress ? 'Continue Track' : 'Start Track'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

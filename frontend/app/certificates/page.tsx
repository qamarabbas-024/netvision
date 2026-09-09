'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { useAuthStore } from '@/stores/authStore';
import { PulsePacketLoader } from '@/components/ui/Loading';
import {
  Award,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Download,
  ExternalLink,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  X,
  FileText,
  FileCheck2,
} from 'lucide-react';
import {
  getUserCertificatesApi,
  checkCourseEligibilityApi,
  checkMasteryEligibilityApi,
  claimCertificationCertificateApi,
  downloadCertificatePdfApi,
  UserCertificateItem,
  CourseEligibilityResult,
  MasteryEligibilityResult,
} from '@/lib/api';
import { CANONICAL_CREDENTIALS, FLAGSHIP_5_COURSES } from '@netvision/shared';

export default function CertificatesCatalogPage() {
  const { isAuthenticated } = useAuthStore();
  const [userCertificates, setUserCertificates] = useState<UserCertificateItem[]>([]);
  const [courseEligibilities, setCourseEligibilities] = useState<Record<string, CourseEligibilityResult>>({});
  const [masteryEligibility, setMasteryEligibility] = useState<MasteryEligibilityResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Async action states
  const [claimingCode, setClaimingCode] = useState<string | null>(null);
  const [downloadingMap, setDownloadingMap] = useState<Record<string, boolean>>({});
  const [claimFeedback, setClaimFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
    code: string;
    credentialId?: string;
  } | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const loadAllData = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError(null);

    try {
      // Parallel fetch to avoid waterfalls
      const [certsResult, masteryResult, ...courseResults] = await Promise.allSettled([
        getUserCertificatesApi(),
        checkMasteryEligibilityApi(),
        ...FLAGSHIP_5_COURSES.map((c) => checkCourseEligibilityApi(c.code)),
      ]);

      if (certsResult.status === 'fulfilled' && Array.isArray(certsResult.value)) {
        setUserCertificates(certsResult.value);
      }

      if (masteryResult.status === 'fulfilled' && masteryResult.value) {
        setMasteryEligibility(masteryResult.value);
      }

      const courseMap: Record<string, CourseEligibilityResult> = {};
      courseResults.forEach((res, idx) => {
        const course = FLAGSHIP_5_COURSES[idx];
        if (res.status === 'fulfilled' && res.value) {
          courseMap[course.code] = res.value;
        }
      });
      setCourseEligibilities(courseMap);

      if (
        certsResult.status === 'rejected' &&
        masteryResult.status === 'rejected' &&
        courseResults.every((r) => r.status === 'rejected')
      ) {
        setLoadError('Unable to connect to certificate registry. Please check your connection.');
      }
    } catch (err: any) {
      console.error('Failed to load certificates:', err);
      setLoadError(err?.message || 'Failed to retrieve authoritative certificate records.');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Handle certificate claim
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
      await loadAllData();
    } catch (err: any) {
      console.warn(`[NetVision Claim] Claim request failed for ${code}:`, err);
      setClaimFeedback({
        type: 'error',
        code,
        message: err?.message || 'Certificate claim denied. Authoritative requirements not met.',
      });
    } finally {
      setClaimingCode(null);
    }
  };

  // Handle PDF download via authoritative backend endpoint
  const handleDownloadPdf = async (credentialId: string, certCode: string) => {
    if (downloadingMap[credentialId]) return;
    setDownloadingMap((prev) => ({ ...prev, [credentialId]: true }));
    setDownloadError(null);

    try {
      const blob = await downloadCertificatePdfApi(credentialId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `NetVision-${certCode}-${credentialId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      console.error(`Failed to download certificate PDF for ${credentialId}:`, err);
      setDownloadError(err?.message || `Failed to download certificate PDF for ${credentialId}.`);
    } finally {
      setDownloadingMap((prev) => ({ ...prev, [credentialId]: false }));
    }
  };

  const earnedCount = userCertificates.length;

  return (
    <ProtectedRoute>
      <div className="min-h-screen surface-0 text-[#f4f5f7] flex font-sans">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar />

          <main className="p-4 sm:p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
            {isLoading ? (
              <div className="py-24 flex justify-center items-center">
                <PulsePacketLoader label="Retrieving Cryptographic Credentials..." />
              </div>
            ) : loadError ? (
              <ErrorState
                title="Failed to Load Certificates"
                message={loadError}
                errorCode="ERR_CERTS_UNAVAILABLE"
                onRetry={loadAllData}
                className="max-w-md mx-auto my-auto"
              />
            ) : (
              <div className="max-w-6xl mx-auto flex flex-col gap-8">
                {/* Catalog Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2a2e39]">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold uppercase tracking-wider bg-[#14151a] text-[#38bdf8] border border-[#2a2e39] mb-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                      <span>AUTHORITATIVE CREDENTIAL REGISTRY</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#f4f5f7] tracking-tight">
                      Official Certifications &amp; Credentials
                    </h1>
                    <p className="text-xs sm:text-sm text-[#8e95a5] mt-1 max-w-2xl leading-relaxed">
                      Authoritative networking credentials backed by cryptographic ledger verification. Earn five foundational specialist certifications to unlock the Master Capstone.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="px-3.5 py-1.5 rounded-lg bg-[#14151a] border border-[#2a2e39] flex items-center gap-2.5">
                      <Award className="w-4 h-4 text-[#38bdf8]" />
                      <span className="text-xs font-mono font-bold text-[#f4f5f7]">
                        {earnedCount} / 6 Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notifications Banner (Claim / Download) */}
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
                          <div className="mt-1 flex items-center gap-4">
                            <Link
                              href={`/certificates/${encodeURIComponent(claimFeedback.credentialId)}`}
                              className="text-xs font-mono underline font-bold text-emerald-300 hover:text-white inline-flex items-center gap-1"
                            >
                              <FileText className="w-3 h-3" /> View Credential Record
                            </Link>
                            <Link
                              href={`/certificates/verify/${encodeURIComponent(claimFeedback.credentialId)}`}
                              className="text-xs font-mono underline font-bold text-emerald-300 hover:text-white inline-flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" /> Verify in Public Ledger
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

                {downloadError && (
                  <div
                    role="alert"
                    className="p-4 rounded-xl border bg-rose-500/10 border-rose-500/30 text-rose-300 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                      <p className="text-xs sm:text-sm font-semibold">{downloadError}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDownloadError(null)}
                      aria-label="Dismiss error"
                      className="text-zinc-400 hover:text-white p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* ========================================================================= */}
                {/* 1. EARNED CERTIFICATES SECTION                                           */}
                {/* ========================================================================= */}
                <section aria-labelledby="earned-certs-heading" className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 id="earned-certs-heading" className="text-lg font-bold text-[#f4f5f7]">
                        Your Earned Credentials
                      </h2>
                      <p className="text-xs text-[#8e95a5]">
                        Authoritative active certificates awarded to your verified profile.
                      </p>
                    </div>
                    {earnedCount > 0 && (
                      <Badge variant="emerald" dot={true}>
                        {earnedCount} Active Record{earnedCount > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>

                  {userCertificates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {userCertificates.map((c) => {
                        const issueDate = c.issuedAt
                          ? new Date(c.issuedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : 'Recently Issued';
                        const credentialId = c.credentialId || c.certificationCode;
                        const certTitle = c.certificationTitle || 'Computer Networking Certification';
                        const isDownloading = !!downloadingMap[credentialId];

                        return (
                          <Card
                            key={credentialId}
                            className="p-6 surface-2 border border-[#2a2e39] flex flex-col justify-between shadow-instrument hover:border-[#38bdf8]/40 transition-all"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <Badge variant="cyan" className="font-mono text-[10px]">
                                  {c.certificationCode}
                                </Badge>
                                <span className="text-xs font-mono flex items-center gap-1 font-bold text-[#10b981]">
                                  <ShieldCheck className="w-3.5 h-3.5" /> ACTIVE &amp; VERIFIED
                                </span>
                              </div>

                              <div className="flex items-start gap-3.5 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-[#14151a] border border-[#2a2e39] flex items-center justify-center text-[#38bdf8] shrink-0 mt-0.5">
                                  <Award className="w-5 h-5" />
                                </div>
                                <div>
                                  <h3 className="text-base sm:text-lg font-bold text-[#f4f5f7] leading-snug">
                                    {certTitle}
                                  </h3>
                                  {c.recipientName && (
                                    <p className="text-xs text-[#8e95a5] mt-0.5">
                                      Awarded to <span className="text-[#c4c9d4] font-semibold">{c.recipientName}</span>
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="p-3 rounded-lg bg-[#14151a] border border-[#2a2e39] font-mono text-xs text-[#8e95a5] mb-5 space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span>Issued:</span>
                                  <span className="text-[#f4f5f7] font-semibold">{issueDate}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Credential ID:</span>
                                  <span className="text-[#38bdf8] font-bold">{credentialId}</span>
                                </div>
                                {c.grade && (
                                  <div className="flex items-center justify-between">
                                    <span>Evaluation:</span>
                                    <span className="text-[#10b981] font-semibold">{c.grade}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Actions on Earned Certificate */}
                            <div className="pt-3 border-t border-[#2a2e39] flex flex-col sm:flex-row items-center gap-2.5">
                              <Link
                                href={`/certificates/${encodeURIComponent(credentialId)}`}
                                className="w-full sm:flex-1"
                              >
                                <Button
                                  variant="primary"
                                  size="sm"
                                  className="w-full justify-center text-xs font-bold"
                                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                                >
                                  View Record
                                </Button>
                              </Link>

                              <Link
                                href={`/certificates/verify/${encodeURIComponent(credentialId)}`}
                                className="w-full sm:w-auto"
                              >
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  className="w-full justify-center text-xs flex items-center gap-1.5"
                                >
                                  <ShieldCheck className="w-3.5 h-3.5 text-[#38bdf8]" />
                                  <span>Verify</span>
                                </Button>
                              </Link>

                              <Button
                                variant="secondary"
                                size="sm"
                                isLoading={isDownloading}
                                onClick={() => handleDownloadPdf(credentialId, c.certificationCode)}
                                className="w-full sm:w-auto justify-center text-xs flex items-center gap-1.5"
                                title="Download official PDF certificate from server"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>PDF</span>
                              </Button>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl surface-2 border border-[#2a2e39] flex flex-col items-center text-center gap-3 shadow-instrument">
                      <div className="w-12 h-12 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8]">
                        <Award className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-bold text-white">No Certificates Claimed Yet</h3>
                      <p className="text-xs text-[#8e95a5] max-w-md">
                        Complete 100% of curriculum lessons, pass all required practical labs, and achieve $\ge 80\%$ on diagnostic benchmark quizzes in a course track below to unlock your verifiable certificate.
                      </p>
                    </div>
                  )}
                </section>

                {/* ========================================================================= */}
                {/* 2. PINNACLE MASTERY CREDENTIAL (NV-NET-MASTERY)                            */}
                {/* ========================================================================= */}
                {(() => {
                  const masteryCert = userCertificates.find(
                    (c) => c.certificationCode === 'NV-NET-MASTERY'
                  );
                  const hasMasteryCert = !!masteryCert || !!masteryEligibility?.hasCertificate;
                  const isMasteryEligible = !!masteryEligibility?.eligible && !hasMasteryCert;
                  const breakdown = masteryEligibility?.breakdown;
                  const acquiredCount = breakdown?.courseCertificates?.acquiredCodes?.length ?? 0;
                  const isClaiming = claimingCode === 'NV-NET-MASTERY';
                  const masteryCredId = masteryCert?.credentialId || 'NV-NET-MASTERY';
                  const isDownloading = !!downloadingMap[masteryCredId];

                  return (
                    <section aria-labelledby="mastery-heading" className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 id="mastery-heading" className="text-lg font-bold text-[#f4f5f7]">
                            Master Network Engineer Credential
                          </h2>
                          <p className="text-xs text-[#8e95a5]">
                            The highest professional benchmark awarded by NetVision.
                          </p>
                        </div>
                        <Badge variant="purple" className="font-mono text-[10px]">
                          NV-NET-MASTERY
                        </Badge>
                      </div>

                      <Card className="p-6 sm:p-8 rounded-2xl surface-2 border-2 border-[#818cf8]/40 bg-gradient-to-br from-[#121217] via-[#14141e] to-[#121217] shadow-elevated relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-[#818cf8]/5 rounded-full blur-3xl pointer-events-none" />

                        <div className="flex flex-col gap-6 relative z-10">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#2a2e39]">
                            <div>
                              <div className="flex items-center gap-2 mb-1.5">
                                <Badge variant="purple" className="font-mono text-[10px]">
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
                                Proves holistic multi-domain mastery across physical signal architectures, enterprise switching, IP routing, stateful security, network automation, and the 120-minute timed Master Capstone.
                              </p>
                            </div>

                            <div className="shrink-0 flex items-center gap-3">
                              {hasMasteryCert ? (
                                <div className="flex items-center gap-2">
                                  <Link href={`/certificates/${encodeURIComponent(masteryCredId)}`}>
                                    <Button variant="primary" size="sm" className="flex items-center gap-1.5">
                                      <FileText className="w-3.5 h-3.5" /> View Record
                                    </Button>
                                  </Link>
                                  <Link href={`/certificates/verify/${encodeURIComponent(masteryCredId)}`}>
                                    <Button variant="secondary" size="sm" className="flex items-center gap-1.5">
                                      <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" /> Verify
                                    </Button>
                                  </Link>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    isLoading={isDownloading}
                                    onClick={() => handleDownloadPdf(masteryCredId, 'NV-NET-MASTERY')}
                                    className="flex items-center gap-1.5"
                                  >
                                    <Download className="w-3.5 h-3.5" /> PDF
                                  </Button>
                                </div>
                              ) : isMasteryEligible ? (
                                <Button
                                  variant="cyan"
                                  size="md"
                                  isLoading={isClaiming}
                                  onClick={() => handleClaim('NV-NET-MASTERY')}
                                  className="flex items-center gap-2 font-bold shadow-glow"
                                >
                                  <Sparkles className="w-4 h-4" /> Claim Mastery Credential
                                </Button>
                              ) : (
                                <div className="text-right">
                                  <span className="text-[11px] font-mono text-[#8e95a5] block">
                                    Mastery Status:
                                  </span>
                                  <span className="text-xs font-mono font-bold text-[#818cf8]">
                                    PREREQUISITES PENDING
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* 5-Pillar Breakdown */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
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
                                {breakdown?.flagshipLessons?.passed ? (
                                  <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                                ) : (
                                  <Clock className="w-4 h-4 text-[#f59e0b]" />
                                )}
                              </div>
                            </div>

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
                                {breakdown?.cumulativeAssessments?.passed ? (
                                  <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                                ) : (
                                  <Clock className="w-4 h-4 text-[#f59e0b]" />
                                )}
                              </div>
                            </div>

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
                                {breakdown?.flagshipLabs?.passed ? (
                                  <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                                ) : (
                                  <Clock className="w-4 h-4 text-[#f59e0b]" />
                                )}
                              </div>
                            </div>

                            <div className="p-3.5 rounded-xl bg-[#14151a] border border-[#2a2e39] flex flex-col justify-between">
                              <div>
                                <span className="text-[10px] font-mono text-[#8e95a5] uppercase block mb-1">
                                  5. Master Capstone
                                </span>
                                <span className="text-sm font-bold text-white font-mono block">
                                  {breakdown?.masterCapstone?.passed
                                    ? `${breakdown?.masterCapstone?.score ?? 85}%`
                                    : breakdown?.masterCapstone?.score != null
                                    ? `${breakdown?.masterCapstone?.score}%`
                                    : 'Pending'}
                                </span>
                              </div>
                              <div className="mt-3 pt-2 border-t border-[#2a2e39]/60 flex items-center justify-between">
                                <span className="text-[10px] font-mono text-[#8e95a5]">≥ 85% Required</span>
                                {breakdown?.masterCapstone?.passed ? (
                                  <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                                ) : (
                                  <Lock className="w-4 h-4 text-[#646c7d]" />
                                )}
                              </div>
                            </div>
                          </div>

                          {!hasMasteryCert && !isMasteryEligible && masteryEligibility?.blockingRequirements && masteryEligibility.blockingRequirements.length > 0 && (
                            <div className="p-3.5 rounded-xl bg-[#09090b]/80 border border-[#2a2e39] text-xs text-[#8e95a5] flex flex-col gap-1 font-mono">
                              <span className="text-[10px] uppercase text-[#818cf8] font-bold">Outstanding Mastery Requirements:</span>
                              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                                {masteryEligibility.blockingRequirements.slice(0, 3).map((req, idx) => (
                                  <li key={idx} className="truncate">{req}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </Card>
                    </section>
                  );
                })()}

                {/* ========================================================================= */}
                {/* 3. STANDARDIZED FLAGSHIP COURSE CREDENTIAL TRACKS (5 TRACKS)             */}
                {/* ========================================================================= */}
                <section aria-labelledby="flagship-heading" className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 id="flagship-heading" className="text-lg font-bold text-[#f4f5f7]">
                        Flagship Specialist Certifications (5 Programs)
                      </h2>
                      <p className="text-xs text-[#8e95a5]">
                        Prerequisite credential tracks leading to the Master Capstone examination.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FLAGSHIP_5_COURSES.map((course) => {
                      const courseCode = course.code;
                      const credCode = course.credentialCode;
                      const elig = courseEligibilities[courseCode];
                      const canonicalDef = CANONICAL_CREDENTIALS.find((c) => c.code === credCode);

                      const existingCert = userCertificates.find(
                        (c) => c.certificationCode === credCode || c.courseCode === courseCode
                      );
                      const hasCert = !!existingCert || !!elig?.hasCertificate;
                      const isEligible = !!elig?.eligible && !hasCert;

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
                      const credentialId = existingCert?.credentialId || credCode;
                      const isDownloading = !!downloadingMap[credentialId];

                      let statusVariant: 'emerald' | 'cyan' | 'amber' | 'neutral' = 'neutral';
                      let statusText = 'NOT STARTED';

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

                            <h3 className="text-base font-bold text-[#f4f5f7] mb-1 leading-snug">
                              {canonicalDef?.title || course.title}
                            </h3>
                            <p className="text-xs text-[#8e95a5] mb-4 line-clamp-2 leading-relaxed">
                              {canonicalDef?.description || course.tagline}
                            </p>

                            <div className="space-y-2 p-3 rounded-lg bg-[#14151a] border border-[#2a2e39] mb-4 text-xs font-mono">
                              <div className="flex items-center justify-between">
                                <span className="text-[#8e95a5]">Curriculum (100%):</span>
                                <span className="font-bold text-white">
                                  {lessonsCompleted} / {lessonsTotal}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-[#8e95a5]">Quiz Avg (≥80%):</span>
                                <span className="font-bold text-white">
                                  {quizScoreAvg}%
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-[#8e95a5]">Practical Labs:</span>
                                <span className="font-bold text-white">
                                  {labsPassed} / {labsTotal}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-[#2a2e39] flex items-center gap-2">
                            {hasCert ? (
                              <>
                                <Link
                                  href={`/certificates/${encodeURIComponent(credentialId)}`}
                                  className="flex-1"
                                >
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    className="w-full text-xs font-semibold flex items-center justify-center gap-1"
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                    <span>Record</span>
                                  </Button>
                                </Link>
                                <Link
                                  href={`/certificates/verify/${encodeURIComponent(credentialId)}`}
                                >
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    className="text-xs flex items-center gap-1"
                                    title="Verify in public ledger"
                                  >
                                    <ShieldCheck className="w-3.5 h-3.5 text-[#38bdf8]" />
                                  </Button>
                                </Link>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  isLoading={isDownloading}
                                  onClick={() => handleDownloadPdf(credentialId, credCode)}
                                  className="text-xs flex items-center gap-1"
                                  title="Download official PDF certificate"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </Button>
                              </>
                            ) : isEligible ? (
                              <Button
                                variant="cyan"
                                size="sm"
                                isLoading={isClaiming}
                                onClick={() => handleClaim(credCode)}
                                className="w-full text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                              >
                                <FileCheck2 className="w-3.5 h-3.5" />
                                <span>Claim Certificate</span>
                              </Button>
                            ) : (
                              <Link href={`/courses/${course.slug}`} className="w-full">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full text-xs text-[#38bdf8] flex items-center justify-center gap-1.5 hover:bg-[#1f222c]"
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
                </section>
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

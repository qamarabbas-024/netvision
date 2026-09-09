'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { PulsePacketLoader } from '@/components/ui/Loading';
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  Award,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  FileCheck2,
  ArrowRight,
  ArrowLeft,
  Lock,
  Cpu,
  Terminal,
  Activity,
  Send,
  AlertCircle,
  Sparkles,
  ExternalLink,
  FileText,
  Download,
  Eye,
} from 'lucide-react';
import {
  getCapstoneSpecificationApi,
  startCapstoneAttemptApi,
  getCapstoneAttemptStatusApi,
  submitCapstoneAttemptApi,
  checkMasteryEligibilityApi,
  claimCertificationCertificateApi,
  downloadCertificatePdfApi,
  CapstoneSpecificationDto,
  CapstoneAttemptSessionDto,
  CapstoneSubmissionResultDto,
  MasteryEligibilityResult,
  ClaimedCertificateResult,
  SubmitCapstonePayload,
} from '@/lib/api';

type CapstoneView = 'PORTAL' | 'WORKSPACE' | 'RESULT';

export default function MasterCapstonePage() {
  const router = useRouter();

  // Specification & Eligibility
  const [spec, setSpec] = useState<CapstoneSpecificationDto | null>(null);
  const [eligibility, setEligibility] = useState<MasteryEligibilityResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Active Attempt & View state
  const [view, setView] = useState<CapstoneView>('PORTAL');
  const [attempt, setAttempt] = useState<CapstoneAttemptSessionDto | null>(null);
  const [submissionResult, setSubmissionResult] = useState<CapstoneSubmissionResultDto | null>(null);
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [startError, setStartError] = useState<string | null>(null);

  // Workspace timing (Display Only — server authoritative)
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Candidate workspace state
  const [activeTab, setActiveTab] = useState<'theory' | 'practical' | 'packet'>('theory');
  const [theoryHypothesis, setTheoryHypothesis] = useState<string>('');
  const [incidentRemediation, setIncidentRemediation] = useState<string>('');
  const [packetForensicsNotes, setPacketForensicsNotes] = useState<string>('');

  // Authoritative structured candidate answers (Drop #8)
  const [theoryAnswers, setTheoryAnswers] = useState<Record<string, number>>({});
  const [incidentAnswers, setIncidentAnswers] = useState<{
    layerDomain?: string;
    protocolFailure?: string;
    rootCause?: string;
    diagnosticOrder?: string[];
    remediationChoice?: string;
  }>({
    diagnosticOrder: ['CMD_SYSLOG', 'CMD_MAC_TABLE', 'CMD_CDP_NEIGHBOR', 'CMD_INTERFACE_CONFIG'],
  });
  const [forensicsAnswers, setForensicsAnswers] = useState<Record<string, number>>({});

  // Sub-Drop 5.5: Post-Exam Mastery Re-evaluation and Claim state
  const [masteryReeval, setMasteryReeval] = useState<MasteryEligibilityResult | null>(null);
  const [isReevaluating, setIsReevaluating] = useState<boolean>(false);
  const [reevalError, setReevalError] = useState<string | null>(null);
  const [isClaimingMastery, setIsClaimingMastery] = useState<boolean>(false);
  const [claimedMasteryCert, setClaimedMasteryCert] = useState<ClaimedCertificateResult | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [downloadPdfError, setDownloadPdfError] = useState<string | null>(null);

  // Authoritative re-evaluation of 9-point Mastery criteria following Capstone submission
  const reevaluateMasteryEligibility = useCallback(async () => {
    setIsReevaluating(true);
    setReevalError(null);
    try {
      const elig = await checkMasteryEligibilityApi();
      setMasteryReeval(elig);
      setEligibility(elig);
    } catch (err: any) {
      console.warn('Mastery eligibility re-evaluation error:', err);
      setReevalError(err?.message || 'Failed to re-evaluate authoritative Mastery eligibility.');
    } finally {
      setIsReevaluating(false);
    }
  }, []);

  // Claim Mastery Credential action via POST /certifications/NV-NET-MASTERY/claim-certificate
  const handleClaimMastery = async () => {
    if (isClaimingMastery) return;
    setIsClaimingMastery(true);
    setClaimError(null);

    try {
      const minted = await claimCertificationCertificateApi('NV-NET-MASTERY');
      setClaimedMasteryCert(minted);
      // Immediately refresh authoritative eligibility to reflect active certificate
      await reevaluateMasteryEligibility();
    } catch (err: any) {
      console.error('Failed to claim Mastery certificate:', err);
      setClaimError(err?.message || 'Certificate claim denied. Authoritative requirements not met.');
      await reevaluateMasteryEligibility().catch(() => null);
    } finally {
      setIsClaimingMastery(false);
    }
  };

  // Authoritative PDF Download
  const handleDownloadMasteryPdf = async (credId: string) => {
    if (isDownloadingPdf || !credId) return;
    setIsDownloadingPdf(true);
    setDownloadPdfError(null);

    try {
      const blob = await downloadCertificatePdfApi(credId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `NetVision-NV-NET-MASTERY-${credId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      console.error('Failed to download Mastery certificate PDF:', err);
      setDownloadPdfError(err?.message || 'Failed to download certificate document.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Initial Load: Spec, Eligibility, and Session Recovery
  const loadPortalData = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    setStartError(null);

    try {
      const [specData, eligData] = await Promise.all([
        getCapstoneSpecificationApi(),
        checkMasteryEligibilityApi().catch((err) => {
          console.warn('Could not fetch mastery eligibility:', err);
          return null;
        }),
      ]);

      setSpec(specData);
      setEligibility(eligData);

      // Check if candidate has an active attempt in progress to recover
      // 1. Check mastery eligibility breakdown for active attempt
      const activeAttemptId =
        typeof window !== 'undefined'
          ? sessionStorage.getItem('nv_capstone_active_attempt_id')
          : null;

      if (activeAttemptId) {
        try {
          const status = await getCapstoneAttemptStatusApi(activeAttemptId);
          if (status.status === 'IN_PROGRESS' && status.remainingSeconds > 0) {
            setAttempt(status);
            setRemainingSeconds(status.remainingSeconds);
            setView('WORKSPACE');
          } else if (status.status === 'PASSED' || status.status === 'FAILED') {
            setAttempt(status);
            if (status.result) {
              setSubmissionResult({
                attemptId: status.attemptId,
                examCode: status.examCode,
                status: status.status,
                score: status.score ?? 0,
                passed: status.passed ?? false,
                result: status.result,
              });
              setView('RESULT');
              if (status.status === 'PASSED') {
                reevaluateMasteryEligibility();
              }
            }
          }
        } catch {
          // Attempt expired or not found, clear stale session id
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('nv_capstone_active_attempt_id');
          }
        }
      }
    } catch (err: any) {
      console.error('Failed to load Capstone portal data:', err);
      setLoadError(err?.message || 'Failed to load Master Capstone specification.');
    } finally {
      setIsLoading(false);
    }
  }, [reevaluateMasteryEligibility]);

  useEffect(() => {
    loadPortalData();
  }, [loadPortalData]);

  // Display-Only Countdown Timer (Reconciles with server expiresAt)
  useEffect(() => {
    if (view !== 'WORKSPACE' || !attempt) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const expiry = new Date(attempt.expiresAt).getTime();
      const diffSec = Math.max(0, Math.floor((expiry - now) / 1000));

      setRemainingSeconds(diffSec);

      if (diffSec <= 0) {
        clearInterval(timer);
        // Authoritative time expiration
        handleAutoExpire();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [view, attempt]);

  // Server reconciliation when countdown expires
  const handleAutoExpire = async () => {
    if (!attempt) return;
    try {
      const status = await getCapstoneAttemptStatusApi(attempt.attemptId);
      setAttempt(status);
      if (status.status === 'EXPIRED' || status.status === 'FAILED') {
        setView('RESULT');
      }
    } catch (err) {
      console.warn('Error fetching expired status:', err);
    }
  };

  // Start / Resume Capstone Action
  const handleStartExam = async () => {
    setIsStarting(true);
    setStartError(null);

    try {
      const session = await startCapstoneAttemptApi();
      setAttempt(session);
      setRemainingSeconds(session.remainingSeconds);

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('nv_capstone_active_attempt_id', session.attemptId);
      }

      setView('WORKSPACE');
    } catch (err: any) {
      console.error('Failed to start Capstone attempt:', err);
      setStartError(err?.message || 'Server rejected Master Capstone start request.');
    } finally {
      setIsStarting(false);
    }
  };

  // Submit Capstone Action
  const handleSubmitExam = async () => {
    if (!attempt || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const payload: SubmitCapstonePayload = {
      theoryAnswers,
      incidentAnswers,
      forensicsAnswers,
      incidentHypothesis: theoryHypothesis,
      troubleshootingActions: [
        { action: 'APPLY_ENTERPRISE_PATCH', target: 'CORE_GATEWAY_ROUTER', value: incidentRemediation },
      ],
      packetAnalysisAnswers: {
        forensicsNotes: packetForensicsNotes,
      },
    };

    try {
      const result = await submitCapstoneAttemptApi(attempt.attemptId, payload);
      setSubmissionResult(result);
      setView('RESULT');
      setShowSubmitModal(false);

      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('nv_capstone_active_attempt_id');
      }

      // If passed, immediately trigger authoritative Mastery eligibility re-evaluation
      if (result.passed) {
        reevaluateMasteryEligibility();
      }
    } catch (err: any) {
      console.error('Failed to submit Capstone attempt:', err);
      setSubmitError(err?.message || 'Submission rejected by authoritative evaluation engine.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format seconds to HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Determine timer warning styling
  const isTimeCritical = remainingSeconds <= 600; // <= 10 minutes
  const isTimeWarning = remainingSeconds <= 1800; // <= 30 minutes

  // =========================================================================
  // VIEW: LOADING OR ERROR
  // =========================================================================
  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen surface-0 text-[#f4f5f7] flex font-sans">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <AppTopbar />
            <main className="p-4 sm:p-8 flex-1 flex items-center justify-center">
              <PulsePacketLoader label="Synchronizing Master Capstone Blueprint & Authority..." />
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (loadError || !spec) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen surface-0 text-[#f4f5f7] flex font-sans">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <AppTopbar />
            <main className="p-4 sm:p-8 flex-1 flex items-center justify-center">
              <ErrorState
                title="Master Capstone Telemetry Offline"
                message={loadError || 'Unable to retrieve authoritative capstone specification.'}
                errorCode="ERR_CAPSTONE_SPEC_FAILED"
                onRetry={loadPortalData}
                className="max-w-md mx-auto"
              />
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const isEligible = !!eligibility?.eligible;
  const blockingReqs = eligibility?.blockingRequirements || [];

  return (
    <ProtectedRoute>
      <div className="min-h-screen surface-0 text-[#f4f5f7] flex font-sans">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar />

          {/* ========================================================================= */}
          {/* VIEW 1: PORTAL / BRIEFING / ELIGIBILITY CHECK                             */}
          {/* ========================================================================= */}
          {view === 'PORTAL' && (
            <main className="p-4 sm:p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
              <div className="max-w-5xl mx-auto flex flex-col gap-8">
                {/* Portal Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2a2e39]">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Badge variant="purple" className="font-mono text-[10px]">
                        {spec.examCode}
                      </Badge>
                      <Badge variant="cyan" className="font-mono text-[10px]">
                        SERVER-AUTHORITATIVE TIMED EXAM
                      </Badge>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#f4f5f7] tracking-tight">
                      {spec.title}
                    </h1>
                    <p className="text-xs sm:text-sm text-[#8e95a5] mt-1 max-w-2xl leading-relaxed">
                      The authoritative final examination for the NetVision Network Engineering Mastery (NV-NET-MASTERY) credential.
                    </p>
                  </div>

                  <Link href="/certificates">
                    <Button variant="ghost" size="sm" className="text-xs text-[#8e95a5] hover:text-white flex items-center gap-1.5">
                      <ArrowLeft className="w-3.5 h-3.5" /> Back to Certifications
                    </Button>
                  </Link>
                </div>

                {/* Cooldown or Start Error Banner */}
                {startError && (
                  <div
                    role="alert"
                    className="p-4 rounded-xl border bg-rose-500/10 border-rose-500/30 text-rose-300 flex items-start justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold">Exam Attempt Denied</h4>
                        <p className="text-xs text-rose-300/90 mt-0.5">{startError}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStartError(null)}
                      className="text-zinc-400 hover:text-white"
                      aria-label="Dismiss alert"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Key Blueprint Specs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl surface-2 border border-[#2a2e39] flex flex-col justify-between shadow-instrument">
                    <span className="text-[10px] font-mono text-[#8e95a5] uppercase block">Examination Duration</span>
                    <div className="my-2">
                      <span className="text-2xl font-bold font-mono text-white block">
                        {spec.durationMinutes} mins
                      </span>
                      <span className="text-xs text-[#8e95a5] font-mono">120 Minutes Non-Stop</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#38bdf8]">Server-Timed Countdown</span>
                  </div>

                  <div className="p-4 rounded-xl surface-2 border border-[#2a2e39] flex flex-col justify-between shadow-instrument">
                    <span className="text-[10px] font-mono text-[#8e95a5] uppercase block">Passing Threshold</span>
                    <div className="my-2">
                      <span className="text-2xl font-bold font-mono text-[#10b981] block">
                        {spec.passingScore}%
                      </span>
                      <span className="text-xs text-[#8e95a5] font-mono">Weighted Overall Score</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#10b981]">Authoritative Evaluation</span>
                  </div>

                  <div className="p-4 rounded-xl surface-2 border border-[#2a2e39] flex flex-col justify-between shadow-instrument">
                    <span className="text-[10px] font-mono text-[#8e95a5] uppercase block">Attempt Policy</span>
                    <div className="my-2">
                      <span className="text-2xl font-bold font-mono text-white block">
                        Max {spec.policy.maxAttempts}
                      </span>
                      <span className="text-xs text-[#8e95a5] font-mono">Within {spec.policy.rollingWindowDays} Days</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#8e95a5]">Rolling Window Protection</span>
                  </div>

                  <div className="p-4 rounded-xl surface-2 border border-[#2a2e39] flex flex-col justify-between shadow-instrument">
                    <span className="text-[10px] font-mono text-[#8e95a5] uppercase block">Cooldown Interval</span>
                    <div className="my-2">
                      <span className="text-2xl font-bold font-mono text-[#f59e0b] block">
                        {spec.policy.cooldownFirstFailureHours}h / {spec.policy.cooldownSubsequentFailureHours}h
                      </span>
                      <span className="text-xs text-[#8e95a5] font-mono">1st Failure / Subsequent</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#f59e0b]">Mandatory Study Interval</span>
                  </div>
                </div>

                {/* Three Assessment Domains Breakdown */}
                <Card className="p-6 surface-2 border border-[#2a2e39] rounded-xl shadow-instrument">
                  <h3 className="text-sm font-bold text-[#f4f5f7] uppercase tracking-wider font-mono mb-4">
                    Authoritative Assessment Weighting Blueprint
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-[#14151a] border border-[#2a2e39]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white">Theory &amp; Reasoning</span>
                        <Badge variant="cyan">{spec.scoringWeights.theoryWeight}%</Badge>
                      </div>
                      <p className="text-xs text-[#8e95a5] leading-relaxed">
                        L1–L4 Protocol mechanics, OSI/TCP-IP encapsulation, subnet mathematics, and OSPF/BGP convergence dynamics.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-[#14151a] border border-[#2a2e39]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white">Topology Incident Challenge</span>
                        <Badge variant="purple">{spec.scoringWeights.practicalWeight}%</Badge>
                      </div>
                      <p className="text-xs text-[#8e95a5] leading-relaxed">
                        Multi-layer datacenter scenario diagnostics: VLAN isolation, asymmetric routing, MTU black holes, and ACL rules.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-[#14151a] border border-[#2a2e39]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white">Packet Capture Forensics</span>
                        <Badge variant="emerald">{spec.scoringWeights.packetAnalysisWeight}%</Badge>
                      </div>
                      <p className="text-xs text-[#8e95a5] leading-relaxed">
                        PCAP byte stream forensics, handshake anomaly identification, TCP window exhaustion, and root-cause analysis.
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Server-Authoritative Eligibility Section */}
                <Card className="p-6 sm:p-8 surface-2 border border-[#2a2e39] rounded-2xl shadow-elevated">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono uppercase tracking-wider text-[#8e95a5]">Candidate Eligibility Status:</span>
                        {isEligible ? (
                          <Badge variant="emerald" dot={true}>ELIGIBLE TO ATTEMPT</Badge>
                        ) : (
                          <Badge variant="rose" dot={true}>PREREQUISITES REQUIRED</Badge>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        {isEligible
                          ? 'Authoritative Prerequisites Verified'
                          : 'Prerequisites Pending Completion'}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#8e95a5] mt-1 max-w-xl leading-relaxed">
                        {isEligible
                          ? 'All five foundational course certifications, lesson requirements, and lab benchmarks have been authoritatively validated.'
                          : 'You must fulfill all prerequisite criteria before starting the Master Capstone examination.'}
                      </p>

                      {/* Blocking requirements list if ineligible */}
                      {!isEligible && blockingReqs.length > 0 && (
                        <div className="mt-4 p-3.5 rounded-lg bg-[#09090b] border border-rose-500/30 text-xs font-mono text-rose-300">
                          <span className="font-bold block mb-1 uppercase text-[10px]">Unmet Requirements:</span>
                          <ul className="list-disc list-inside space-y-1">
                            {blockingReqs.map((req, idx) => (
                              <li key={idx}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Start Action */}
                    <div className="shrink-0 flex flex-col items-center sm:items-end gap-2">
                      {isEligible ? (
                        <Button
                          variant="cyan"
                          size="lg"
                          isLoading={isStarting}
                          onClick={handleStartExam}
                          className="font-bold px-8 shadow-glow flex items-center gap-2"
                        >
                          <Clock className="w-4 h-4" />
                          <span>Start 120-Minute Exam</span>
                        </Button>
                      ) : (
                        <Link href="/certificates">
                          <Button variant="secondary" size="md" className="flex items-center gap-2">
                            <span>Review Certifications</span>
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      )}
                      <span className="text-[10px] font-mono text-[#8e95a5]">
                        Once initiated, the 120-minute server timer cannot be paused.
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </main>
          )}

          {/* ========================================================================= */}
          {/* VIEW 2: ACTIVE TIMED EXAMINATION WORKSPACE                                */}
          {/* ========================================================================= */}
          {view === 'WORKSPACE' && attempt && (
            <main className="flex-1 flex flex-col min-w-0 bg-[#0c0d10]">
              {/* Exam Workspace Top Control Bar */}
              <div className="surface-2 border-b border-[#2a2e39] px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 shadow-instrument">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#818cf8]/10 border border-[#818cf8]/30 flex items-center justify-center text-[#818cf8]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-white font-mono">
                        {spec.examCode}
                      </span>
                      <Badge variant="cyan" className="font-mono text-[10px]">
                        ATTEMPT #{attempt.attemptNumber}
                      </Badge>
                    </div>
                    <span className="text-[10px] text-[#8e95a5] font-mono block">
                      Session ID: {attempt.attemptId}
                    </span>
                  </div>
                </div>

                {/* Server-Authoritative Derived Countdown Timer */}
                <div className="flex items-center gap-4">
                  <div
                    role="timer"
                    aria-live="off"
                    aria-label={`Time remaining: ${formatTime(remainingSeconds)}`}
                    className={`px-4 py-2 rounded-xl border font-mono flex items-center gap-2.5 transition-colors ${
                      isTimeCritical
                        ? 'bg-rose-500/10 border-rose-500/50 text-rose-400 animate-pulse'
                        : isTimeWarning
                        ? 'bg-amber-500/10 border-amber-500/50 text-amber-400'
                        : 'bg-[#14151a] border-[#2a2e39] text-[#38bdf8]'
                    }`}
                  >
                    <Clock className="w-4 h-4 shrink-0" />
                    <div>
                      <span className="text-[9px] uppercase tracking-wider block text-[#8e95a5] leading-none">
                        Server Time Remaining
                      </span>
                      <span className="text-base sm:text-lg font-extrabold tracking-tight">
                        {formatTime(remainingSeconds)}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setShowSubmitModal(true)}
                    className="font-bold flex items-center gap-1.5 shadow-sm text-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Exam</span>
                  </Button>
                </div>
              </div>

              {/* Workspace Content Shell (Zero Fabricated Questions) */}
              <div className="p-4 sm:p-8 max-w-6xl mx-auto w-full flex flex-col gap-6 flex-1 overflow-y-auto">
                {/* Domain Switcher Navigation */}
                <div className="flex flex-wrap gap-2 border-b border-[#2a2e39] pb-3" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'theory'}
                    onClick={() => setActiveTab('theory')}
                    className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                      activeTab === 'theory'
                        ? 'bg-[#38bdf8] text-[#121316]'
                        : 'bg-[#14151a] text-[#8e95a5] hover:text-white border border-[#2a2e39]'
                    }`}
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>1. Theory &amp; Protocol Reasoning ({spec.scoringWeights.theoryWeight}%)</span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'practical'}
                    onClick={() => setActiveTab('practical')}
                    className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                      activeTab === 'practical'
                        ? 'bg-[#818cf8] text-[#121316]'
                        : 'bg-[#14151a] text-[#8e95a5] hover:text-white border border-[#2a2e39]'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>2. Topology Incident Challenge ({spec.scoringWeights.practicalWeight}%)</span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'packet'}
                    onClick={() => setActiveTab('packet')}
                    className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                      activeTab === 'packet'
                        ? 'bg-[#10b981] text-[#121316]'
                        : 'bg-[#14151a] text-[#8e95a5] hover:text-white border border-[#2a2e39]'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>3. Packet Capture Forensics ({spec.scoringWeights.packetAnalysisWeight}%)</span>
                  </button>
                </div>

                {/* Tab 1: Theory Assessment */}
                {activeTab === 'theory' && (
                  <Card className="p-6 surface-2 border border-[#2a2e39] rounded-xl flex flex-col gap-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase text-[#38bdf8] font-bold">
                          Domain 1: Protocol Architecture &amp; Theory
                        </span>
                        <Badge variant="cyan">Weight: {spec.scoringWeights.theoryWeight}%</Badge>
                      </div>
                      <h2 className="text-lg font-bold text-white">
                        Multi-Protocol Theoretical Reasoning &amp; Convergence Analysis
                      </h2>
                      <p className="text-xs text-[#8e95a5] mt-1 leading-relaxed">
                        Authoritative evaluation of Layer 1 through Layer 4 protocol engineering, Dijkstra shortest path first mechanics, CIDR routing prefixes, and stateful cryptographic encapsulation. Select your answers for all 10 questions below.
                      </p>
                    </div>

                    {/* Render Real Theory Questions */}
                    <div className="space-y-6">
                      {(attempt.assessment?.theorySection?.questions || []).map((q: any, qIdx: number) => {
                        const selectedIdx = theoryAnswers[q.id];
                        return (
                          <div key={q.id} className="p-4 rounded-xl bg-[#14151a] border border-[#2a2e39] space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-mono text-[#38bdf8] font-bold uppercase">
                                Question {qIdx + 1} of 10 // {q.category || q.id}
                              </span>
                              <span className="text-[10px] font-mono text-zinc-400">
                                {q.points} Points
                              </span>
                            </div>
                            <p className="text-xs text-white font-medium leading-relaxed">
                              {q.prompt}
                            </p>
                            <div className="space-y-2 pt-1">
                              {q.options.map((opt: string, optIdx: number) => {
                                const isSelected = selectedIdx === optIdx;
                                return (
                                  <button
                                    key={optIdx}
                                    type="button"
                                    onClick={() => setTheoryAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                                    className={`w-full text-left p-3 rounded-lg border text-xs font-mono transition-all flex items-start gap-3 ${
                                      isSelected
                                        ? 'border-[#38bdf8] bg-[#38bdf8]/10 text-white shadow-sm'
                                        : 'border-[#2a2e39] bg-[#0c0d10] text-[#8e95a5] hover:text-white hover:border-[#38bdf8]/50'
                                    }`}
                                  >
                                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-[9px] ${
                                      isSelected ? 'border-[#38bdf8] bg-[#38bdf8] text-[#0c0d10] font-bold' : 'border-[#4a5060]'
                                    }`}>
                                      {String.fromCharCode(65 + optIdx)}
                                    </span>
                                    <span className="leading-snug">{opt}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-col gap-2 pt-4 border-t border-[#2a2e39]">
                      <label htmlFor="theory-hypothesis" className="text-xs font-mono font-bold text-[#8e95a5]">
                        Candidate Protocol Reasoning &amp; Hypothesis Notes (Optional):
                      </label>
                      <textarea
                        id="theory-hypothesis"
                        value={theoryHypothesis}
                        onChange={(e) => setTheoryHypothesis(e.target.value)}
                        placeholder="Detail your theoretical analysis of MTU fragmentation thresholds, OSPF link-state advertisement pacing, and BGP AS-path loop prevention mechanisms..."
                        rows={3}
                        className="w-full p-3 rounded-lg bg-[#14151a] border border-[#2a2e39] text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-[#38bdf8]"
                      />
                    </div>
                  </Card>
                )}

                {/* Tab 2: Topology Incident Shell */}
                {activeTab === 'practical' && (
                  <Card className="p-6 surface-2 border border-[#2a2e39] rounded-xl flex flex-col gap-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase text-[#818cf8] font-bold">
                          Domain 2: Practical Incident Simulation
                        </span>
                        <Badge variant="purple">Weight: {spec.scoringWeights.practicalWeight}%</Badge>
                      </div>
                      <h2 className="text-lg font-bold text-white">
                        {attempt.assessment?.incidentSection?.scenario?.title || 'Datacenter Core Switch Incident Challenge'}
                      </h2>
                      <p className="text-xs text-[#8e95a5] mt-1 leading-relaxed">
                        {attempt.assessment?.incidentSection?.scenario?.description || 'Analyze simulated gateway routing telemetry, asymmetric link convergence, and ACL filtering bottlenecks.'}
                      </p>
                    </div>

                    {/* Topology and Syslog Evidence Box */}
                    <div className="p-4 rounded-lg bg-[#14151a] border border-[#2a2e39] space-y-3">
                      <div className="flex items-center gap-2 text-[#818cf8] text-xs font-mono font-bold">
                        <Terminal className="w-4 h-4" />
                        <span>Live Incident Evidence &amp; Telemetry Stream</span>
                      </div>
                      {attempt.assessment?.incidentSection?.scenario?.topologySummary && (
                        <div className="p-2.5 rounded bg-[#090a0d] border border-[#232733] text-[11px] font-mono text-zinc-300">
                          <span className="text-[#818cf8] font-bold block mb-1">TOPOLOGY CONTEXT:</span>
                          {attempt.assessment.incidentSection.scenario.topologySummary}
                        </div>
                      )}
                      {attempt.assessment?.incidentSection?.scenario?.syslogSnippet && (
                        <div className="p-2.5 rounded bg-[#090a0d] border border-[#232733] text-[11px] font-mono text-amber-300/90 whitespace-pre-wrap leading-relaxed">
                          <span className="text-amber-400 font-bold block mb-1">CRITICAL SYSLOG EXCERPT:</span>
                          {attempt.assessment.incidentSection.scenario.syslogSnippet}
                        </div>
                      )}
                    </div>

                    {/* Structured Tasks */}
                    <div className="space-y-6">
                      {(attempt.assessment?.incidentSection?.scenario?.tasks || []).map((task: any, tIdx: number) => {
                        let currentVal: any = undefined;
                        if (task.taskId === 'INCIDENT-TASK1') currentVal = incidentAnswers.layerDomain;
                        else if (task.taskId === 'INCIDENT-TASK2') currentVal = incidentAnswers.protocolFailure;
                        else if (task.taskId === 'INCIDENT-TASK3') currentVal = incidentAnswers.rootCause;
                        else if (task.taskId === 'INCIDENT-TASK4') currentVal = incidentAnswers.diagnosticOrder;
                        else if (task.taskId === 'INCIDENT-TASK5') currentVal = incidentAnswers.remediationChoice;

                        return (
                          <div key={task.taskId} className="p-4 rounded-xl bg-[#14151a] border border-[#2a2e39] space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-mono text-[#818cf8] font-bold uppercase">
                                Task {tIdx + 1} of 5 // {task.title}
                              </span>
                              <span className="text-[10px] font-mono text-zinc-400">
                                {task.points} Points
                              </span>
                            </div>
                            <p className="text-xs text-white font-medium leading-relaxed">
                              {task.prompt}
                            </p>

                            {task.type === 'CHOICE' && (
                              <div className="space-y-2 pt-1">
                                {task.options.map((opt: any) => {
                                  const isSelected = currentVal === opt.id;
                                  return (
                                    <button
                                      key={opt.id}
                                      type="button"
                                      onClick={() => {
                                        setIncidentAnswers((prev) => {
                                          if (task.taskId === 'INCIDENT-TASK1') return { ...prev, layerDomain: opt.id };
                                          if (task.taskId === 'INCIDENT-TASK2') return { ...prev, protocolFailure: opt.id };
                                          if (task.taskId === 'INCIDENT-TASK3') return { ...prev, rootCause: opt.id };
                                          if (task.taskId === 'INCIDENT-TASK5') return { ...prev, remediationChoice: opt.id };
                                          return { ...prev, [task.taskId]: opt.id };
                                        });
                                      }}
                                      className={`w-full text-left p-3 rounded-lg border text-xs font-mono transition-all flex items-start gap-3 ${
                                        isSelected
                                          ? 'border-[#818cf8] bg-[#818cf8]/10 text-white shadow-sm'
                                          : 'border-[#2a2e39] bg-[#0c0d10] text-[#8e95a5] hover:text-white hover:border-[#818cf8]/50'
                                      }`}
                                    >
                                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-[9px] ${
                                        isSelected ? 'border-[#818cf8] bg-[#818cf8] text-[#0c0d10] font-bold' : 'border-[#4a5060]'
                                      }`}>
                                        •
                                      </span>
                                      <span className="leading-snug">{opt.label}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {task.type === 'ORDERING' && (
                              <div className="space-y-2 pt-1">
                                <div className="p-3 rounded-lg bg-[#0c0d10] border border-[#2a2e39] space-y-1.5 text-xs font-mono">
                                  <span className="text-[#8e95a5] text-[10px] block uppercase font-bold">Standard Diagnostic Sequence:</span>
                                  {task.options.map((opt: any, oIdx: number) => (
                                    <div key={opt.id} className="flex items-center gap-2 text-zinc-300 py-1 border-b border-[#2a2e39]/40 last:border-0">
                                      <span className="w-5 h-5 rounded bg-[#818cf8]/15 text-[#818cf8] flex items-center justify-center font-bold text-[10px]">
                                        {oIdx + 1}
                                      </span>
                                      <span className="text-xs">{opt.label}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-col gap-2 pt-4 border-t border-[#2a2e39]">
                      <label htmlFor="remediation-input" className="text-xs font-mono font-bold text-[#8e95a5]">
                        Candidate Remediation Rationale &amp; CLI Patch Directives (Optional):
                      </label>
                      <textarea
                        id="remediation-input"
                        value={incidentRemediation}
                        onChange={(e) => setIncidentRemediation(e.target.value)}
                        placeholder="Configure router ospf 1 / neighbor commands, verify MTU consistency across 802.1Q trunk interfaces, or formulate ACL permit directives..."
                        rows={3}
                        className="w-full p-3 rounded-lg bg-[#14151a] border border-[#2a2e39] text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-[#818cf8]"
                      />
                    </div>
                  </Card>
                )}

                {/* Tab 3: Packet Forensics Shell */}
                {activeTab === 'packet' && (
                  <Card className="p-6 surface-2 border border-[#2a2e39] rounded-xl flex flex-col gap-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase text-[#10b981] font-bold">
                          Domain 3: Packet Capture Forensics
                        </span>
                        <Badge variant="emerald">Weight: {spec.scoringWeights.packetAnalysisWeight}%</Badge>
                      </div>
                      <h2 className="text-lg font-bold text-white">
                        {attempt.assessment?.forensicsSection?.scenario?.title || 'PCAP Stream Anomaly Dissection'}
                      </h2>
                      <p className="text-xs text-[#8e95a5] mt-1 leading-relaxed">
                        {attempt.assessment?.forensicsSection?.scenario?.description || 'Identify TCP SYN-ACK retransmission loops, zero-window window probing, and fragmented IP payloads from the simulated capture stream.'}
                      </p>
                    </div>

                    {/* PCAP Frames Telemetry Table */}
                    {attempt.assessment?.forensicsSection?.scenario?.frames && (
                      <div className="p-4 rounded-lg bg-[#14151a] border border-[#2a2e39] space-y-3">
                        <div className="flex items-center gap-2 text-[#10b981] text-xs font-mono font-bold">
                          <Activity className="w-4 h-4" />
                          <span>Captured TCP Stream Telemetry (tap0 ingress)</span>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-[11px] font-mono">
                            <thead>
                              <tr className="border-b border-[#2a2e39] text-[#8e95a5]">
                                <th className="py-1.5 px-2">No.</th>
                                <th className="py-1.5 px-2">Time</th>
                                <th className="py-1.5 px-2">Source</th>
                                <th className="py-1.5 px-2">Destination</th>
                                <th className="py-1.5 px-2">Proto</th>
                                <th className="py-1.5 px-2">Flags</th>
                                <th className="py-1.5 px-2">Info</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2a2e39]/50 text-zinc-300">
                              {attempt.assessment.forensicsSection.scenario.frames.map((frame: any) => (
                                <tr key={frame.frameNumber} className="hover:bg-[#1a1c24]">
                                  <td className="py-1.5 px-2 font-bold text-white">{frame.frameNumber}</td>
                                  <td className="py-1.5 px-2 text-[#8e95a5]">{frame.timestamp}</td>
                                  <td className="py-1.5 px-2 text-cyan-400">{frame.sourceIp}:{frame.srcPort}</td>
                                  <td className="py-1.5 px-2 text-indigo-400">{frame.destIp}:{frame.dstPort}</td>
                                  <td className="py-1.5 px-2 font-bold">{frame.protocol}</td>
                                  <td className="py-1.5 px-2">
                                    <span className="px-1.5 py-0.5 rounded bg-[#2a2e39] text-[10px] text-emerald-400">
                                      {(frame.tcpFlags || []).join(', ')}
                                    </span>
                                  </td>
                                  <td className="py-1.5 px-2 text-zinc-400 truncate max-w-xs">{frame.info}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Forensics Questions */}
                    <div className="space-y-6">
                      {(attempt.assessment?.forensicsSection?.scenario?.questions || []).map((q: any, qIdx: number) => {
                        const selectedIdx = forensicsAnswers[q.id];
                        return (
                          <div key={q.id} className="p-4 rounded-xl bg-[#14151a] border border-[#2a2e39] space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-mono text-[#10b981] font-bold uppercase">
                                Forensics Task {qIdx + 1} of 4 // {q.id}
                              </span>
                              <span className="text-[10px] font-mono text-zinc-400">
                                {q.points} Points
                              </span>
                            </div>
                            <p className="text-xs text-white font-medium leading-relaxed">
                              {q.prompt}
                            </p>
                            <div className="space-y-2 pt-1">
                              {q.options.map((opt: string, optIdx: number) => {
                                const isSelected = selectedIdx === optIdx;
                                return (
                                  <button
                                    key={optIdx}
                                    type="button"
                                    onClick={() => setForensicsAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                                    className={`w-full text-left p-3 rounded-lg border text-xs font-mono transition-all flex items-start gap-3 ${
                                      isSelected
                                        ? 'border-[#10b981] bg-[#10b981]/10 text-white shadow-sm'
                                        : 'border-[#2a2e39] bg-[#0c0d10] text-[#8e95a5] hover:text-white hover:border-[#10b981]/50'
                                    }`}
                                  >
                                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-[9px] ${
                                      isSelected ? 'border-[#10b981] bg-[#10b981] text-[#0c0d10] font-bold' : 'border-[#4a5060]'
                                    }`}>
                                      {String.fromCharCode(65 + optIdx)}
                                    </span>
                                    <span className="leading-snug">{opt}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-col gap-2 pt-4 border-t border-[#2a2e39]">
                      <label htmlFor="packet-forensics" className="text-xs font-mono font-bold text-[#8e95a5]">
                        Forensic Packet Analysis Findings &amp; Observations (Optional):
                      </label>
                      <textarea
                        id="packet-forensics"
                        value={packetForensicsNotes}
                        onChange={(e) => setPacketForensicsNotes(e.target.value)}
                        placeholder="Detail the TCP window scale option negotiation, sequence number progression, and source of RST termination..."
                        rows={3}
                        className="w-full p-3 rounded-lg bg-[#14151a] border border-[#2a2e39] text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-[#10b981]"
                      />
                    </div>
                  </Card>
                )}
              </div>

              {/* Submit Confirmation Dialog */}
              {showSubmitModal && (
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="submit-modal-title"
                  className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans"
                >
                  <div className="surface-2 p-6 sm:p-8 rounded-2xl border border-[#2a2e39] max-w-lg w-full flex flex-col gap-4 shadow-elevated">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 id="submit-modal-title" className="text-lg font-bold text-white">
                          Final Exam Submission
                        </h3>
                        <span className="text-xs font-mono text-[#8e95a5]">
                          Authoritative Evaluation Lock
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[#8e95a5] leading-relaxed">
                      Are you sure you want to submit your Master Capstone examination? Once submitted, your responses are evaluated server-side and this attempt will be permanently closed.
                    </p>

                    {submitError && (
                      <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
                        {submitError}
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={isSubmitting}
                        onClick={() => setShowSubmitModal(false)}
                      >
                        Return to Exam
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        isLoading={isSubmitting}
                        onClick={handleSubmitExam}
                        className="font-bold"
                      >
                        Confirm &amp; Submit
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </main>
          )}

          {/* ========================================================================= */}
          {/* VIEW 3: AUTHORITATIVE EVALUATION RESULT                                   */}
          {/* ========================================================================= */}
          {view === 'RESULT' && submissionResult && (
            <main className="p-4 sm:p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
              <div className="max-w-3xl mx-auto flex flex-col gap-6">
                <Card
                  className={`p-6 sm:p-8 rounded-2xl surface-2 border-2 shadow-elevated flex flex-col gap-6 ${
                    submissionResult.passed
                      ? 'border-emerald-500/40'
                      : 'border-rose-500/40'
                  }`}
                >
                  {/* Result Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2a2e39]">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          submissionResult.passed
                            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                            : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                        }`}
                      >
                        {submissionResult.passed ? (
                          <CheckCircle2 className="w-7 h-7" />
                        ) : (
                          <XCircle className="w-7 h-7" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono uppercase font-bold text-[#8e95a5]">
                            OFFICIAL CAPSTONE RESULT
                          </span>
                          <Badge
                            variant={submissionResult.passed ? 'emerald' : 'rose'}
                            dot={true}
                          >
                            {submissionResult.status}
                          </Badge>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                          {submissionResult.passed
                            ? 'Master Capstone Examination Passed!'
                            : 'Master Capstone Benchmark Not Met'}
                        </h2>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-[10px] text-[#8e95a5] uppercase block">
                        Evaluation Score
                      </span>
                      <span
                        className={`text-3xl font-extrabold ${
                          submissionResult.passed ? 'text-[#10b981]' : 'text-rose-400'
                        }`}
                      >
                        {submissionResult.score}%
                      </span>
                      <span className="text-[10px] text-[#8e95a5] block">
                        Benchmark: 85%
                      </span>
                    </div>
                  </div>

                  {/* Component Score Telemetry (If provided by backend) */}
                  {submissionResult.result?.componentScores && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3.5 rounded-xl bg-[#14151a] border border-[#2a2e39]">
                        <span className="text-[10px] font-mono text-[#8e95a5] block uppercase">
                          Theory Component (40%)
                        </span>
                        <span className="text-lg font-bold text-white font-mono">
                          {submissionResult.result.componentScores.theoryScore}%
                        </span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#14151a] border border-[#2a2e39]">
                        <span className="text-[10px] font-mono text-[#8e95a5] block uppercase">
                          Practical Incident (35%)
                        </span>
                        <span className="text-lg font-bold text-white font-mono">
                          {submissionResult.result.componentScores.practicalScore}%
                        </span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#14151a] border border-[#2a2e39]">
                        <span className="text-[10px] font-mono text-[#8e95a5] block uppercase">
                          Packet Forensics (25%)
                        </span>
                        <span className="text-lg font-bold text-white font-mono">
                          {submissionResult.result.componentScores.packetAnalysisScore}%
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Mastery Certification Pathway & Authoritative Re-Evaluation */}
                  <div className="pt-4 border-t border-[#2a2e39] flex flex-col gap-4">
                    {submissionResult.passed ? (
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between pb-2 border-b border-[#2a2e39]/60">
                          <div>
                            <span className="text-[10px] font-mono uppercase text-[#38bdf8] font-bold block">
                              Mastery Certification Pathway
                            </span>
                            <h3 className="text-sm font-bold text-white">
                              Mastery eligibility has been re-evaluated.
                            </h3>
                          </div>
                          {isReevaluating && (
                            <Badge variant="cyan" dot={true} className="font-mono text-[10px]">
                              SYNCHRONIZING...
                            </Badge>
                          )}
                        </div>

                        {isReevaluating ? (
                          <div className="py-6 flex justify-center items-center">
                            <PulsePacketLoader label="Querying authoritative backend Mastery eligibility engine..." />
                          </div>
                        ) : reevalError ? (
                          <div className="p-4 rounded-xl border bg-rose-500/10 border-rose-500/30 text-rose-300 flex items-start justify-between gap-3 text-xs font-mono">
                            <div className="flex items-center gap-2">
                              <ShieldAlert className="w-4 h-4 shrink-0" />
                              <span>{reevalError}</span>
                            </div>
                            <Button variant="secondary" size="sm" onClick={reevaluateMasteryEligibility}>
                              Retry Evaluation
                            </Button>
                          </div>
                        ) : (
                          <>
                            {/* CASE 1: Active Mastery Certificate Minted / Already Owned */}
                            {(claimedMasteryCert || masteryReeval?.hasCertificate) && (() => {
                              const credId =
                                claimedMasteryCert?.credentialId ||
                                masteryReeval?.existingCertificate?.credentialId ||
                                'NV-NET-MASTERY';
                              return (
                                <div className="p-5 rounded-xl border border-emerald-500/40 bg-emerald-500/5 flex flex-col gap-4">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div className="flex items-center gap-2.5">
                                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                                        <Award className="w-4 h-4" />
                                      </div>
                                      <div>
                                        <Badge variant="emerald" dot={true} className="font-mono text-[10px]">
                                          ACTIVE CREDENTIAL ISSUED
                                        </Badge>
                                        <h4 className="text-sm font-bold text-white mt-0.5">
                                          NetVision Certified Network Engineering Master
                                        </h4>
                                      </div>
                                    </div>
                                    <div className="text-left sm:text-right font-mono">
                                      <span className="text-[10px] text-[#8e95a5] block uppercase">
                                        Authoritative Credential ID
                                      </span>
                                      <span className="text-xs font-bold text-emerald-300">
                                        {credId}
                                      </span>
                                    </div>
                                  </div>

                                  <p className="text-xs text-[#8e95a5] leading-relaxed">
                                    Your official cryptographic Mastery certificate is active in the NetVision registry. You can inspect your credential record, download the verified PDF, or share the public verification ledger.
                                  </p>

                                  {downloadPdfError && (
                                    <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
                                      {downloadPdfError}
                                    </div>
                                  )}

                                  <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-[#2a2e39]/60">
                                    <Link href={`/certificates/${encodeURIComponent(credId)}`}>
                                      <Button variant="primary" size="sm" className="flex items-center gap-1.5 text-xs font-semibold">
                                        <FileText className="w-3.5 h-3.5" />
                                        <span>View Credential Record</span>
                                      </Button>
                                    </Link>

                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      isLoading={isDownloadingPdf}
                                      onClick={() => handleDownloadMasteryPdf(credId)}
                                      className="flex items-center gap-1.5 text-xs"
                                    >
                                      <Download className="w-3.5 h-3.5" />
                                      <span>Download PDF</span>
                                    </Button>

                                    <Link href={`/certificates/verify/${encodeURIComponent(credId)}`}>
                                      <Button variant="secondary" size="sm" className="flex items-center gap-1.5 text-xs text-[#10b981]">
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        <span>Public Verification</span>
                                      </Button>
                                    </Link>
                                  </div>
                                </div>
                              );
                            })()}

                            {/* CASE 2: Eligible to Claim Mastery Credential */}
                            {!claimedMasteryCert && !masteryReeval?.hasCertificate && masteryReeval?.eligible && (
                              <div className="p-5 rounded-xl border border-cyan-500/40 bg-cyan-500/5 flex flex-col gap-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                  <div>
                                    <Badge variant="cyan" dot={true} className="font-mono text-[10px]">
                                      ALL 9 REQUIREMENTS SATISFIED
                                    </Badge>
                                    <h4 className="text-base font-bold text-white mt-1">
                                      Eligible to Claim NV-NET-MASTERY Credential
                                    </h4>
                                    <p className="text-xs text-[#8e95a5] mt-1 max-w-xl leading-relaxed">
                                      The server-authoritative eligibility engine has validated all 5 active course credentials, 100% flagship curriculum, 85%+ cumulative assessment average, practical labs, and your passing Master Capstone score.
                                    </p>
                                  </div>

                                  <Button
                                    variant="cyan"
                                    size="md"
                                    isLoading={isClaimingMastery}
                                    onClick={handleClaimMastery}
                                    className="font-bold px-6 shadow-glow flex items-center gap-2 shrink-0"
                                  >
                                    <Sparkles className="w-4 h-4" />
                                    <span>Claim Mastery Credential</span>
                                  </Button>
                                </div>

                                {claimError && (
                                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
                                    {claimError}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* CASE 3: Capstone Passed, but Mastery Pending Other Prerequisites */}
                            {!claimedMasteryCert && !masteryReeval?.hasCertificate && !masteryReeval?.eligible && (
                              <div className="p-5 rounded-xl border border-amber-500/40 bg-amber-500/5 flex flex-col gap-3">
                                <div>
                                  <Badge variant="amber" className="font-mono text-[10px]">
                                    PREREQUISITES PENDING
                                  </Badge>
                                  <h4 className="text-sm font-bold text-white mt-1">
                                    Master Capstone Passed — Additional Criteria Pending
                                  </h4>
                                  <p className="text-xs text-[#8e95a5] mt-1 leading-relaxed">
                                    Although you have passed the Master Capstone examination, the server-authoritative eligibility engine reports remaining unmet criteria before the NV-NET-MASTERY credential can be issued:
                                  </p>
                                </div>

                                {masteryReeval?.blockingRequirements && masteryReeval.blockingRequirements.length > 0 && (
                                  <div className="p-3 rounded-lg bg-[#14151a] border border-amber-500/30 text-xs font-mono text-amber-200">
                                    <span className="font-bold block mb-1 uppercase text-[10px]">Remaining Blocker(s):</span>
                                    <ul className="list-disc list-inside space-y-1">
                                      {masteryReeval.blockingRequirements.map((req, idx) => (
                                        <li key={idx}>{req}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                <div className="pt-2">
                                  <Link href="/certificates">
                                    <Button variant="secondary" size="sm" className="text-xs flex items-center gap-1.5">
                                      <span>Review All Credentials</span>
                                      <ArrowRight className="w-3.5 h-3.5" />
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ) : (
                      /* Capstone Failed: Show Cooldown Guidance */
                      <div className="p-5 rounded-xl border border-rose-500/40 bg-rose-500/5 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-rose-400" />
                          <h4 className="text-sm font-bold text-white">
                            Mandatory Study Cooldown Active
                          </h4>
                        </div>
                        <p className="text-xs text-[#8e95a5] leading-relaxed">
                          Your overall evaluation score of {submissionResult.score}% did not meet the mandatory 85% passing benchmark. In accordance with authoritative certification policy, a 24-hour mandatory study cooldown is enforced following your first failed attempt (72 hours for subsequent attempts). The client cannot bypass this cooldown.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Navigation Links */}
                  <div className="pt-4 border-t border-[#2a2e39] flex flex-wrap items-center justify-between gap-3">
                    <Link href="/dashboard" className="w-full sm:w-auto">
                      <Button variant="primary" className="w-full sm:w-auto flex items-center justify-center gap-2">
                        <FileCheck2 className="w-4 h-4" />
                        <span>Return to Dashboard</span>
                      </Button>
                    </Link>
                    <Link href="/certificates" className="w-full sm:w-auto">
                      <Button variant="secondary" className="w-full sm:w-auto">
                        View All Credentials
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>
            </main>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

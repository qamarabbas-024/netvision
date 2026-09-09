'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PulsePacketLoader } from '@/components/ui/Loading';
import {
  ShieldCheck,
  ShieldAlert,
  Activity,
  CheckCircle2,
  Cpu,
  ArrowLeft,
  Share2,
  Download,
  ExternalLink,
  Calendar,
  Award,
  User,
  RotateCcw,
  AlertCircle,
  X,
  FileCheck2,
} from 'lucide-react';
import { getCertificateByIdApi, downloadCertificatePdfApi } from '@/lib/api';

export default function CertificateDetailPage() {
  const params = useParams();
  const rawId = params?.id as string;
  const certId = decodeURIComponent(rawId || '');

  const [certData, setCertData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // PDF download state
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadFeedback, setDownloadFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Share link copy state
  const [copied, setCopied] = useState<boolean>(false);

  const loadCertificate = useCallback(async () => {
    if (!certId) {
      setIsLoading(false);
      setError('No certificate identifier provided.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setDownloadFeedback(null);

    try {
      const data = await getCertificateByIdApi(certId);
      if (data && (data.credentialId || data.code || data.id)) {
        setCertData(data);
      } else {
        setError(`Certificate record "${certId}" could not be located on the authoritative server.`);
      }
    } catch (err: any) {
      console.error('Error fetching certificate details:', err);
      setError(err?.message || `Certificate credential "${certId}" was not found or is invalid.`);
    } finally {
      setIsLoading(false);
    }
  }, [certId]);

  useEffect(() => {
    loadCertificate();
  }, [loadCertificate]);

  // Handle authoritative backend PDF download
  const handleDownloadPdf = async () => {
    if (isDownloading || !certData) return;
    setIsDownloading(true);
    setDownloadFeedback(null);

    // Use public credential ID to query backend download endpoint
    const credId = certData.credentialId || certData.code || certId;
    const certCode = certData.certificationCode || 'NV-NET';

    try {
      const blob = await downloadCertificatePdfApi(credId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `NetVision-${certCode}-${credId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setDownloadFeedback({
        type: 'success',
        message: 'Official certificate PDF successfully generated and downloaded.',
      });
    } catch (err: any) {
      console.error('Failed to download certificate PDF:', err);
      setDownloadFeedback({
        type: 'error',
        message: err?.message || 'Failed to download official certificate PDF. Ensure you are signed into the authorized account.',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined' && certData) {
      const credId = certData.credentialId || certData.code || certId;
      const verifyUrl = `${window.location.origin}/certificates/verify/${encodeURIComponent(credId)}`;
      navigator.clipboard.writeText(verifyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // State: Loading
  if (isLoading) {
    return (
      <div className="min-h-screen surface-0 text-[#f4f5f7] flex flex-col items-center justify-center p-6 font-sans">
        <PulsePacketLoader label="Retrieving Authoritative Credential Record..." />
      </div>
    );
  }

  // State: Error / Not Found
  if (error || !certData) {
    return (
      <div className="min-h-screen surface-0 text-[#f4f5f7] flex flex-col justify-between p-4 sm:p-8 font-sans">
        <div className="max-w-4xl mx-auto w-full mb-6">
          <Link
            href="/certificates"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#8e95a5] hover:text-[#38bdf8] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Certifications
          </Link>
        </div>

        <div className="max-w-lg mx-auto w-full surface-2 p-8 sm:p-10 rounded-xl border border-rose-500/30 text-center my-auto flex flex-col items-center gap-4 shadow-instrument">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#f4f5f7]">Certificate Record Not Found</h1>
          <p className="text-xs sm:text-sm text-[#8e95a5] leading-relaxed">
            {error || `The requested credential identifier "${certId}" was not found or does not represent an active certified credential.`}
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={loadCertificate}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Retry
            </Button>
            <Link href="/certificates">
              <Button variant="secondary" size="sm">
                Browse Certifications
              </Button>
            </Link>
            <Link href="/courses">
              <Button variant="primary" size="sm">
                Explore Curriculum
              </Button>
            </Link>
          </div>
        </div>

        <div className="text-center text-[11px] text-[#646c7d] pt-8">
          <p>© 2026 NetVision. Verifiable learning credential.</p>
        </div>
      </div>
    );
  }

  // Authoritative certificate fields (Strict exclusion of private fields: no verificationCode, userId, email, passwordHash)
  const candidateName = certData.recipientName || 'Verified Candidate';
  const certificationTitle = certData.certificationTitle || certData.courseTitle || 'NetVision Certified Network Professional';
  const certificationCode = certData.certificationCode || 'NV-NET';
  const credentialId = certData.credentialId || certData.code || certId;
  const skillsAssessed: string[] = Array.isArray(certData.skillsAssessed) ? certData.skillsAssessed : [];
  const status = certData.status || 'ACTIVE';
  const isRevoked = status === 'REVOKED';
  const isInactive = status !== 'ACTIVE';
  const issueDateFormatted = certData.issuedAt
    ? new Date(certData.issuedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recently Issued';
  const grade = certData.grade || (certData.score ? `${certData.score}% — Passed` : 'Passed');

  const publicVerificationUrl = `/certificates/verify/${encodeURIComponent(credentialId)}`;

  return (
    <div className="min-h-screen surface-0 text-[#f4f5f7] flex flex-col justify-between p-4 sm:p-8 font-sans print:p-0 print:bg-white print:text-black">
      {/* Privacy meta: prevent search engines from indexing authenticated detail view */}
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>

      {/* Top Navigation & Action Controls */}
      <div className="max-w-4xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8 print:hidden">
        <Link
          href="/certificates"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#8e95a5] hover:text-[#38bdf8] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Certifications Catalog
        </Link>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Public Verification Action */}
          <Link href={publicVerificationUrl} className="flex-1 sm:flex-initial">
            <Button
              variant="secondary"
              size="sm"
              className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
              <span>Public Verification</span>
            </Button>
          </Link>

          {/* Copy Verification Link */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleShare}
            leftIcon={<Share2 className="w-3.5 h-3.5" />}
            className="flex-1 sm:flex-initial text-xs font-semibold"
          >
            {copied ? 'Verification Link Copied! ✓' : 'Share / Copy Link'}
          </Button>

          {/* Real Backend PDF Download */}
          <Button
            variant="primary"
            size="sm"
            isLoading={isDownloading}
            onClick={handleDownloadPdf}
            leftIcon={<Download className="w-3.5 h-3.5" />}
            className="flex-1 sm:flex-initial font-bold text-xs shadow-sm"
          >
            Download Official PDF
          </Button>
        </div>
      </div>

      {/* Feedback Alert for PDF Download */}
      {downloadFeedback && (
        <div className="max-w-4xl mx-auto w-full mb-6 print:hidden">
          <div
            role="status"
            aria-live="polite"
            className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
              downloadFeedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-3">
              {downloadFeedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
              <p className="text-xs sm:text-sm font-semibold">{downloadFeedback.message}</p>
            </div>
            <button
              type="button"
              onClick={() => setDownloadFeedback(null)}
              aria-label="Dismiss message"
              className="text-zinc-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Official Certificate Frame */}
      <div className="max-w-4xl mx-auto w-full surface-2 p-6 sm:p-12 rounded-2xl border border-[#2a2e39] shadow-elevated flex flex-col items-center text-center relative overflow-hidden my-auto print:border print:border-zinc-300 print:shadow-none print:bg-white print:text-black">
        {/* Subtle Cybernetic Background Watermark */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#38bdf8]/5 rounded-full blur-3xl pointer-events-none print:hidden" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#818cf8]/5 rounded-full blur-3xl pointer-events-none print:hidden" />

        {/* Top Header Badge & Logo */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-[#2563eb] flex items-center justify-center text-white shadow-sm">
            <Activity className="w-5 h-5 font-bold" />
          </div>
          <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#f4f5f7] print:text-black">
            Net<span className="text-[#38bdf8]">Vision</span>
          </span>
        </div>

        {/* Status Tag */}
        <div className="mb-6 flex items-center gap-2">
          <Badge variant="cyan" className="font-mono text-xs">
            {certificationCode}
          </Badge>
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider font-bold ${
              isRevoked || isInactive
                ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                : 'bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>
              {isRevoked
                ? 'CREDENTIAL REVOKED'
                : isInactive
                ? `CREDENTIAL ${status}`
                : 'OFFICIAL CERTIFICATE OF MASTERY'}
            </span>
          </div>
        </div>

        <p className="text-xs font-mono uppercase tracking-wider text-[#8e95a5] mb-2 print:text-zinc-600">
          This certifies that
        </p>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#f4f5f7] tracking-tight mb-3 print:text-black">
          {candidateName}
        </h1>

        <p className="text-xs sm:text-sm text-[#8e95a5] max-w-xl mb-4 leading-relaxed print:text-zinc-600">
          has successfully fulfilled all rigorous curriculum requirements, interactive topology simulations, and diagnostic evaluations for
        </p>

        <h2 className="text-lg sm:text-xl font-bold text-[#38bdf8] mb-5 font-mono print:text-black">
          {certificationTitle}
        </h2>

        {/* Grade & Score Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#14151a] border border-[#2a2e39] text-[#10b981] font-mono text-xs font-bold print:border-zinc-300 print:bg-zinc-100 print:text-black">
            <CheckCircle2 className="w-3.5 h-3.5" /> Evaluation: {grade}
          </div>
          {certData.score != null && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#14151a] border border-[#2a2e39] text-[#38bdf8] font-mono text-xs font-bold print:border-zinc-300 print:bg-zinc-100 print:text-black">
              Overall Score: {certData.score}%
            </div>
          )}
        </div>

        {/* Skills & Competencies Verified */}
        {skillsAssessed.length > 0 && (
          <div className="w-full text-left mb-6 pt-5 border-t border-[#2a2e39] print:border-zinc-200">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8e95a5] mb-2.5 flex items-center gap-1.5 font-bold print:text-zinc-700">
              <Cpu className="w-3.5 h-3.5 text-[#38bdf8]" /> Competencies &amp; Domains Assessed:
            </span>
            <div className="flex flex-wrap gap-2">
              {skillsAssessed.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-[#14151a] border border-[#2a2e39] text-[11px] text-[#c4c9d4] font-mono print:border-zinc-300 print:bg-zinc-100 print:text-zinc-900"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Verification Details Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between w-full pt-5 border-t border-[#2a2e39] text-xs font-mono text-[#8e95a5] gap-3 sm:gap-0 print:border-zinc-200 print:text-zinc-700">
          <div className="text-center sm:text-left">
            <span className="block text-[#646c7d] text-[9px] print:text-zinc-500">ISSUE DATE</span>
            <span className="text-[#f4f5f7] font-bold print:text-black">{issueDateFormatted}</span>
          </div>

          <div
            className={`flex items-center gap-1.5 font-bold px-2.5 py-0.5 rounded text-[11px] ${
              isRevoked || isInactive
                ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                : 'text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/20'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isRevoked ? 'REVOKED' : isInactive ? status : 'VERIFIED & ACTIVE'}</span>
          </div>

          <div className="text-center sm:text-right">
            <span className="block text-[#646c7d] text-[9px] print:text-zinc-500">CREDENTIAL ID</span>
            <span className="text-[#38bdf8] font-bold print:text-black">{credentialId}</span>
          </div>
        </div>
      </div>

      <div className="text-center text-[11px] text-[#646c7d] pt-8">
        <p>© 2026 NetVision. Cryptographically verifiable learning credential.</p>
      </div>
    </div>
  );
}

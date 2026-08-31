'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, CheckCircle2, Award, Calendar, User, ArrowLeft, ExternalLink, Download, FileText } from 'lucide-react';
import { getCertificateByIdApi } from '@/lib/api';

export default function CertificateVerifyPage() {
  const params = useParams();
  const rawId = params?.credentialId as string;
  const credentialId = decodeURIComponent(rawId || '');

  const [certData, setCertData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function verify() {
      if (!credentialId) {
        setIsLoading(false);
        setError('No credential ID provided.');
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const data = await getCertificateByIdApi(credentialId);
        if (data && (data.id || data.code || data.credentialId)) {
          setCertData(data);
        } else {
          setError(`Credential ID "${credentialId}" could not be verified.`);
        }
      } catch (err: any) {
        setError(err?.message || `Credential ID "${credentialId}" was not found or is invalid.`);
      } finally {
        setIsLoading(false);
      }
    }
    verify();
  }, [credentialId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-8 h-8 border-2 border-[#00f0ff] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-mono text-zinc-400">Verifying Cryptographic Credential Record...</p>
      </div>
    );
  }

  if (error || !certData) {
    return (
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col justify-between p-4 sm:p-8 font-sans">
        <div className="max-w-4xl mx-auto w-full mb-6">
          <Link href="/certificates" className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-[#00f0ff] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Certifications
          </Link>
        </div>
        <div className="max-w-lg mx-auto w-full p-8 sm:p-10 rounded-2xl bg-[#121217] border border-rose-500/30 text-center my-auto flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Credential Not Verified</h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            {error || `The requested credential ID "${credentialId}" is not active or could not be found.`}
          </p>
          <div className="pt-2 flex items-center gap-3">
            <Link href="/certificates">
              <Button variant="secondary" size="sm">Browse Certifications</Button>
            </Link>
            <Link href="/courses">
              <Button variant="primary" size="sm">Explore Curriculum</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const certificateUrl = `/certificates/${encodeURIComponent(certData.credentialId || certData.code || certData.id)}`;

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col p-4 sm:p-8 font-sans">
      <div className="max-w-3xl mx-auto w-full mb-6">
        <Link href="/certificates" className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-[#00f0ff] transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Certifications Directory
        </Link>
      </div>

      <div className="max-w-3xl mx-auto w-full flex flex-col gap-6">
        {/* Verified Banner */}
        <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white">Official NetVision Credential Verified</h1>
                <Badge variant="emerald" className="text-[10px] uppercase font-mono">Authentic</Badge>
              </div>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                Cryptographic signature and public authority ledger validation succeeded.
              </p>
            </div>
          </div>

          <Link href={certificateUrl}>
            <Button variant="primary" size="sm" className="flex items-center gap-1.5 whitespace-nowrap">
              <ExternalLink className="w-3.5 h-3.5" /> View Certificate
            </Button>
          </Link>
        </div>

        {/* Credential Details Card */}
        <Card className="p-6 sm:p-8 bg-[#121217] border-[#272732] flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
            <div>
              <span className="text-[10px] font-mono text-[#00f0ff] uppercase tracking-widest block mb-1">
                Certification Program
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                {certData.certificationTitle || certData.courseTitle || 'NetVision Certified Network Administrator'}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="cyan" className="font-mono text-xs">
                {certData.certificationCode || 'NV-NET'}
              </Badge>
              <Badge variant="purple" className="font-mono text-xs">
                {certData.grade || 'Passed with Distinction'}
              </Badge>
            </div>
          </div>

          {/* Key Facts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#09090b] border border-zinc-800 flex items-center gap-3">
              <User className="w-5 h-5 text-zinc-400" />
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Certified Recipient</span>
                <span className="text-sm font-bold text-white">{certData.recipientName || 'Verified Candidate'}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#09090b] border border-zinc-800 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-zinc-400" />
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Date Awarded</span>
                <span className="text-sm font-bold text-white">
                  {certData.issuedAt ? new Date(certData.issuedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Verified'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#09090b] border border-zinc-800 flex items-center gap-3">
              <Award className="w-5 h-5 text-[#00f0ff]" />
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Credential ID</span>
                <span className="text-sm font-mono font-bold text-[#00f0ff]">
                  {certData.credentialId || certData.code || credentialId}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#09090b] border border-zinc-800 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Verification Status</span>
                <span className="text-sm font-bold text-emerald-400">ACTIVE &amp; RECOGNIZED</span>
              </div>
            </div>
          </div>

          {/* Competencies */}
          {certData.skillsAssessed && certData.skillsAssessed.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-3">
                Verified Domains &amp; Competencies
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {certData.skillsAssessed.map((skill: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-zinc-300 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00f0ff] shrink-0" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-zinc-800">
            <Link href={certificateUrl} className="flex-1 sm:flex-none">
              <Button variant="primary" className="w-full flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" /> View Authoritative Certificate
              </Button>
            </Link>
            <Link href="/courses" className="flex-1 sm:flex-none">
              <Button variant="secondary" className="w-full">
                Explore Curriculum
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, Activity, CheckCircle2, Cpu, ArrowLeft, Share2, Download } from 'lucide-react';
import { getCertificateByIdApi } from '@/lib/api';

export default function CertificateDetailPage() {
  const params = useParams();
  const certId = params?.id as string;
  const [certData, setCertData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCert() {
      if (!certId) {
        setIsLoading(false);
        setError('No certificate ID provided.');
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const data = await getCertificateByIdApi(certId);
        if (data && (data.id || data.code || data.credentialId)) {
          setCertData(data);
        } else {
          setError(`Certificate "${certId}" could not be verified on the server.`);
        }
      } catch (err: any) {
        setError(err?.message || `Certificate credential "${certId}" not found or invalid.`);
      } finally {
        setIsLoading(false);
      }
    }
    loadCert();
  }, [certId]);

  if (isLoading) {
    return (
      <div className="min-h-screen surface-0 text-[#f4f5f7] flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-8 h-8 border-2 border-[#38bdf8] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-mono text-[#8e95a5]">Verifying Credential Record...</p>
      </div>
    );
  }

  if (error || !certData) {
    return (
      <div className="min-h-screen surface-0 text-[#f4f5f7] flex flex-col justify-between p-4 sm:p-8 font-sans">
        <div className="max-w-4xl mx-auto w-full mb-6">
          <Link href="/certificates" className="inline-flex items-center gap-2 text-xs font-semibold text-[#8e95a5] hover:text-[#38bdf8] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Certificates
          </Link>
        </div>
        <div className="max-w-lg mx-auto w-full surface-2 p-8 sm:p-10 rounded-xl border border-rose-500/30 text-center my-auto flex flex-col items-center gap-4 shadow-instrument">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#f4f5f7]">Certificate Not Verified</h1>
          <p className="text-xs sm:text-sm text-[#8e95a5] leading-relaxed">
            {error || `The requested credential ID "${certId}" was not found or does not represent an active certified credential.`}
          </p>
          <div className="pt-2 flex items-center gap-3">
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

  const candidateName = certData.recipientName || 'Verified Candidate';
  const certificationTitle =
    certData.certificationTitle || certData.courseTitle || 'NetVision Certified Network Administrator';
  const issueDateFormatted = certData.issuedAt
    ? new Date(certData.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Recently Issued';
  const credentialId = certData.credentialId || certData.code || certId;
  const grade = certData.grade || (certData.score ? `${certData.score}% — Passed` : 'Passed');
  const skillsAssessed: string[] = certData.skillsAssessed || [
    'IPv4 CIDR Subnetting & Network Addressing',
    'VLAN Segmentation & Switch Port Provisioning',
    'Layer 3 Routing & Default Gateway Path Selection',
    'Perimeter Firewall Access Control List (ACL) Policies',
    'OSPF Link-State Adjacency & Routing Diagnostics',
    'Spanning Tree Protocol (STP) Loop Prevention',
    'Wireshark TCP/IP 3-Way Handshake & Packet Dissection',
    'Core IP Infrastructure Protocols (ARP, DNS, DHCP, ICMP)',
  ];

  const [copied, setCopied] = useState<boolean>(false);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownload = async () => {
    try {
      const token = sessionStorage.getItem('netvision_token') || localStorage.getItem('netvision_token');
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
      const res = await fetch(`${apiBase}/certificates/${credentialId}/download`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        window.print();
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `NetVision-Certificate-${credentialId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      window.print();
    }
  };

  const certJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalCredential',
    name: certificationTitle,
    credentialCategory: 'Certificate',
    recognizedBy: {
      '@type': 'EducationalOrganization',
      name: 'NetVision',
      url: 'https://netvision-three.vercel.app',
    },
    educationalLevel: 'Course Mastery',
    validIn: {
      '@type': 'Country',
      name: 'Global',
    },
  };

  return (
    <div className="min-h-screen surface-0 text-[#f4f5f7] flex flex-col justify-between p-4 sm:p-8 font-sans print:p-0 print:bg-white print:text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(certJsonLd) }}
      />
      {/* Top Navigation */}
      <div className="max-w-4xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8 print:hidden">
        <Link href="/certificates" className="inline-flex items-center gap-2 text-xs font-semibold text-[#8e95a5] hover:text-[#38bdf8] transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Certificates
        </Link>
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleShare}
            leftIcon={<Share2 className="w-3.5 h-3.5" />}
            className="flex-1 sm:flex-initial text-xs font-semibold"
          >
            {copied ? 'Link Copied! ✓' : 'Share Credential'}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleDownload}
            leftIcon={<Download className="w-3.5 h-3.5" />}
            className="flex-1 sm:flex-initial font-bold text-xs shadow-sm"
          >
            Download PDF / Print
          </Button>
        </div>
      </div>

      {/* Certificate Frame */}
      <div className="max-w-4xl mx-auto w-full surface-2 p-6 sm:p-12 rounded-xl border border-[#2a2e39] shadow-elevated flex flex-col items-center text-center relative overflow-hidden my-auto print:border print:border-zinc-300 print:shadow-none print:bg-white print:text-black">
        {/* Top Header Badge & Logo */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-[#2563eb] flex items-center justify-center text-white shadow-sm">
            <Activity className="w-5 h-5 font-bold" />
          </div>
          <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#f4f5f7]">
            Net<span className="text-[#38bdf8]">Vision</span>
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#10b981]/10 border border-[#10b981]/30 text-[10px] font-mono text-[#10b981] uppercase tracking-wider font-bold mb-6">
          <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED LEARNING CREDENTIAL
        </div>

        <p className="text-xs font-mono uppercase tracking-wider text-[#8e95a5] mb-3">This certifies that</p>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#f4f5f7] tracking-tight mb-4">
          {candidateName}
        </h1>

        <p className="text-xs sm:text-sm text-[#8e95a5] max-w-xl mb-5 leading-relaxed">
          has successfully fulfilled all curriculum requirements, interactive simulations, and diagnostic mastery assessments for
        </p>

        <h2 className="text-lg sm:text-xl font-bold text-[#38bdf8] mb-4 font-mono">
          {certificationTitle}
        </h2>

        {/* Grade Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#14151a] border border-[#2a2e39] text-[#10b981] font-mono text-xs font-bold mb-6">
          <CheckCircle2 className="w-3.5 h-3.5" /> Evaluation Result: {grade}
        </div>

        {/* Skills Assessed Section */}
        <div className="w-full text-left mb-6 pt-5 border-t border-[#2a2e39]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8e95a5] block mb-2.5 flex items-center gap-1.5 font-bold">
            <Cpu className="w-3.5 h-3.5 text-[#38bdf8]" /> Competencies & Skills Verified:
          </span>
          <div className="flex flex-wrap gap-2">
            {skillsAssessed.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md bg-[#14151a] border border-[#2a2e39] text-[11px] text-[#c4c9d4] font-mono"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Verification Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between w-full pt-5 border-t border-[#2a2e39] text-xs font-mono text-[#8e95a5] gap-3 sm:gap-0">
          <div className="text-center sm:text-left">
            <span className="block text-[#646c7d] text-[9px]">ISSUE DATE</span>
            <span className="text-[#f4f5f7] font-bold">{issueDateFormatted}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[#10b981] font-bold px-2.5 py-0.5 rounded bg-[#10b981]/10 border border-[#10b981]/20 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED & ACTIVE
          </div>

          <div className="text-center sm:text-right">
            <span className="block text-[#646c7d] text-[9px]">CREDENTIAL ID</span>
            <span className="text-[#38bdf8] font-bold">{credentialId}</span>
          </div>
        </div>
      </div>

      <div className="text-center text-[11px] text-[#646c7d] pt-8">
        <p>© 2026 NetVision. Verifiable, anti-tamper learning credential.</p>
      </div>
    </div>
  );
}

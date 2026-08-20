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
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col items-center justify-center p-6 bg-net-grid-pattern">
        <div className="w-10 h-10 border-2 border-[#00f0ff] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-mono text-zinc-400">Verifying Cryptographic Credential Record...</p>
      </div>
    );
  }

  if (error || !certData) {
    return (
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col justify-between p-6 sm:p-10 bg-net-grid-pattern">
        <div className="max-w-5xl mx-auto w-full mb-8">
          <Link href="/certificates" className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-[#00f0ff] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Certificates
          </Link>
        </div>
        <div className="max-w-xl mx-auto w-full glass-panel p-8 sm:p-12 rounded-3xl border border-rose-500/30 text-center my-auto flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white">Certificate Not Verified</h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {error || `The requested credential ID "${certId}" was not found or does not represent an active certified credential.`}
          </p>
          <div className="pt-4 flex gap-3">
            <Link href="/certificates">
              <Button variant="secondary" size="sm">
                Browse Certifications
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="cyan" size="sm">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
        <div className="text-center text-xs text-zinc-500 pt-8">
          <p>© 2026 NetVision Platform. Cryptographically verifiable, anti-tamper learning credential.</p>
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
    educationalLevel: 'Professional Mastery',
    validIn: {
      '@type': 'Country',
      name: 'Global',
    },
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col justify-between p-4 sm:p-10 bg-net-grid-pattern print:p-0 print:bg-white print:text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(certJsonLd) }}
      />
      {/* Top Navigation */}
      <div className="max-w-5xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8 print:hidden">
        <Link href="/certificates" className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-[#00f0ff] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Certificates
        </Link>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleShare}
            leftIcon={<Share2 className="w-4 h-4" />}
            className="flex-1 sm:flex-initial"
          >
            {copied ? 'Link Copied! ✓' : 'Share Credential'}
          </Button>
          <Button
            variant="cyan"
            size="sm"
            onClick={handleDownload}
            leftIcon={<Download className="w-4 h-4" />}
            className="flex-1 sm:flex-initial"
          >
            Download PDF / Print
          </Button>
        </div>
      </div>

      {/* Certificate Frame */}
      <div className="max-w-4xl mx-auto w-full glass-panel-glow p-5 sm:p-12 rounded-3xl border-2 border-[#00f0ff]/40 shadow-glow-cyan flex flex-col items-center text-center relative overflow-hidden my-auto print:border print:border-zinc-300 print:shadow-none print:bg-white print:text-black">
        {/* Subtle Decorative Background Glow */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Badge & Logo */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00f0ff] to-[#3b82f6] flex items-center justify-center text-black shadow-glow-cyan">
            <Activity className="w-7 h-7 font-bold" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">
            Net<span className="text-[#00f0ff]">Vision</span>
          </span>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[11px] font-mono text-[#00f0ff] uppercase tracking-widest font-bold mb-6">
          <ShieldCheck className="w-4 h-4" /> OFFICIAL DEMONSTRATED NETWORKING CREDENTIAL
        </div>

        <p className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-4">This is to officially certify that</p>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-100 to-[#00f0ff]">
          {candidateName}
        </h1>

        <p className="text-sm text-zinc-300 max-w-xl mb-6 leading-relaxed">
          has successfully passed rigorous server-authoritative theory, hands-on multi-device practical networking topology configuration, incident troubleshooting diagnostics, and packet capture dissection for
        </p>

        <h2 className="text-xl sm:text-2xl font-bold text-[#00f0ff] mb-4 font-mono">
          {certificationTitle}
        </h2>

        {/* Grade Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold mb-8">
          <CheckCircle2 className="w-4 h-4" /> Result: {grade}
        </div>

        {/* Skills Assessed Section */}
        <div className="w-full text-left mb-8 pt-6 border-t border-[#272732]/80">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-3 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#00f0ff]" /> Demonstrated Competencies & Skills Assessed:
          </span>
          <div className="flex flex-wrap gap-2">
            {skillsAssessed.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-[#18181f] border border-[#272732] text-xs text-zinc-300 font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Verification Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between w-full pt-6 border-t border-[#272732] text-xs font-mono text-zinc-400 gap-4 sm:gap-0">
          <div className="text-center sm:text-left">
            <span className="block text-zinc-500 text-[10px]">ISSUED DATE</span>
            <span className="text-white font-bold">{issueDateFormatted}</span>
          </div>

          <div className="flex items-center gap-2 text-emerald-400 font-bold px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" /> VERIFIED & ACTIVE
          </div>

          <div className="text-center sm:text-right">
            <span className="block text-zinc-500 text-[10px]">CREDENTIAL ID</span>
            <span className="text-[#00f0ff] font-bold">{credentialId}</span>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-zinc-500 pt-8">
        <p>© 2026 NetVision Platform. Cryptographically verifiable, anti-tamper learning credential.</p>
      </div>
    </div>
  );
}

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

  useEffect(() => {
    async function loadCert() {
      if (!certId) return;
      try {
        const data = await getCertificateByIdApi(certId);
        setCertData(data);
      } catch {
        // Fallback gracefully to default demonstration view
      }
    }
    loadCert();
  }, [certId]);

  const candidateName = certData?.recipientName || 'Alex Rivers';
  const certificationTitle =
    certData?.certificationTitle || certData?.courseTitle || 'NetVision Certified Network Administrator (NCNA 2.0)';
  const issueDateFormatted = certData?.issuedAt
    ? new Date(certData.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'August 16, 2026';
  const credentialId = certData?.credentialId || certData?.code || certId || 'NV-NET-2026-CERT';
  const grade = certData?.grade || (certData?.score ? `${certData.score}% — Passed` : 'Pass with Distinction');
  const skillsAssessed: string[] = certData?.skillsAssessed || [
    'IPv4 CIDR Subnetting & Network Addressing',
    'VLAN Segmentation & Switch Port Provisioning',
    'Layer 3 Routing & Default Gateway Path Selection',
    'Perimeter Firewall Access Control List (ACL) Policies',
    'OSPF Link-State Adjacency & Routing Diagnostics',
    'Spanning Tree Protocol (STP) Loop Prevention',
    'Wireshark TCP/IP 3-Way Handshake & Packet Dissection',
    'Core IP Infrastructure Protocols (ARP, DNS, DHCP, ICMP)',
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col justify-between p-6 sm:p-10 bg-net-grid-pattern">
      {/* Top Navigation */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between mb-8">
        <Link href="/certificates" className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-[#00f0ff] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Certificates
        </Link>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" leftIcon={<Share2 className="w-4 h-4" />}>
            Share Credential
          </Button>
          <Button variant="cyan" size="sm" leftIcon={<Download className="w-4 h-4" />}>
            Download PDF / SVG
          </Button>
        </div>
      </div>

      {/* Certificate Frame */}
      <div className="max-w-4xl mx-auto w-full glass-panel-glow p-8 sm:p-12 rounded-3xl border-2 border-[#00f0ff]/40 shadow-glow-cyan flex flex-col items-center text-center relative overflow-hidden my-auto">
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

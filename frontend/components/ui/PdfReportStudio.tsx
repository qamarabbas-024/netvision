'use client';

import React, { useState } from 'react';
import {
  Printer,
  FileText,
  Award,
  CheckCircle2,
  Download,
  Eye,
  Sliders,
  Sparkles,
  ShieldCheck,
  Activity,
  Layers,
} from 'lucide-react';
import { Button } from './Button';
import { VectorPdfGenerator, CertificatePdfData, LabReportPdfData } from '@/lib/pdfGenerator';

export interface PdfReportStudioProps {
  initialType?: 'certificate' | 'lab' | 'scorecard';
  certificateData?: Partial<CertificatePdfData>;
  labData?: Partial<LabReportPdfData>;
  isOpen?: boolean;
  onClose?: () => void;
}

export const PdfReportStudio: React.FC<PdfReportStudioProps> = ({
  initialType = 'certificate',
  certificateData,
  labData,
  isOpen = true,
  onClose,
}) => {
  const [docType, setDocType] = useState<'certificate' | 'lab' | 'scorecard'>(initialType);
  const [candidateName, setCandidateName] = useState<string>(certificateData?.candidateName || 'Alex Rivers');
  const [certTitle, setCertTitle] = useState<string>(certificateData?.certificationTitle || 'NV-NET 202: Certified IP Addressing & Subnetting Engineer');
  const [credentialId, setCredentialId] = useState<string>(certificateData?.credentialId || 'NV-NET-2026-8841');

  if (!isOpen) return null;

  const handleExportPdf = () => {
    if (docType === 'certificate') {
      VectorPdfGenerator.printCertificate({
        candidateName,
        certificationTitle: certTitle,
        credentialId,
        issueDate: certificateData?.issueDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        grade: certificateData?.grade || '94% — Passed with Distinction',
        skillsAssessed: certificateData?.skillsAssessed || [
          '32-Bit IPv4 Architecture',
          'VLSM Hierarchical Design',
          'CIDR Prefix Calculations',
          'RFC 1918 Private Addressing',
          'ARP Resolution Protocol',
          'IPv6 SLAAC Interface Autoconfiguration',
        ],
        verificationUrl: typeof window !== 'undefined' ? window.location.href : 'https://netvision-three.vercel.app/certificates/' + credentialId,
      });
    } else {
      VectorPdfGenerator.printLabReport({
        studentName: candidateName,
        labTitle: labData?.labTitle || 'Guided Practice: IPv4 CIDR Subnet Partitioning & Interface Provisioning',
        courseCode: labData?.courseCode || 'NET-202',
        completedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        score: 100,
        durationMinutes: 15,
        tasksCompleted: [
          'Calculate block size and assign /26 network boundaries.',
          'Configure GigabitEthernet0/0 interface IP with subnet mask 255.255.255.192.',
          'Provision host IP 192.168.10.50 on Server-1 with default gateway 192.168.10.1.',
          'Verify zero-loss ICMP connectivity across the subnet boundary.',
        ],
        topologySnapshot: 'Topology verified with 5 active endpoints',
        cliCommandLog: [
          'enable',
          'configure terminal',
          'interface GigabitEthernet0/0',
          'ip address 192.168.10.1 255.255.255.192',
          'no shutdown',
          'exit',
          'ping 192.168.10.50 (Success rate 100 percent)',
        ],
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-2xl bg-[#09090b] border border-[#272732] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#272732] bg-[#121217] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff]">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#00f0ff] uppercase tracking-wider font-bold block">
                Version 3.3 Vector Export Studio
              </span>
              <h3 className="text-base font-bold text-white leading-tight">High-Fidelity Document & PDF Generator</h3>
            </div>
          </div>

          {onClose && (
            <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-[#1a1a24] border border-[#272732]">
              ✕
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-5">
          {/* Document Type Selector */}
          <div className="flex bg-[#121217] p-1 rounded-xl border border-[#272732] gap-1">
            <button
              onClick={() => setDocType('certificate')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                docType === 'certificate' ? 'bg-[#00f0ff] text-black shadow-glow-cyan' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Certificate of Mastery</span>
            </button>

            <button
              onClick={() => setDocType('lab')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                docType === 'lab' ? 'bg-[#00f0ff] text-black shadow-glow-cyan' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Lab Diagnostic Report</span>
            </button>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-zinc-400 mb-1.5 block">Recipient / Student Name</label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#121217] border border-[#272732] text-xs font-semibold text-white focus:outline-none focus:border-[#00f0ff]"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-zinc-400 mb-1.5 block">Credential Verification ID</label>
              <input
                type="text"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#121217] border border-[#272732] font-mono text-xs text-[#00f0ff] focus:outline-none focus:border-[#00f0ff]"
              />
            </div>
          </div>

          {/* Live Document Preview Card */}
          <div className="p-4 rounded-xl bg-[#121217] border border-[#272732] flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-mono text-[11px] uppercase tracking-wider">Vector Print Quality</span>
              <span className="text-emerald-400 font-bold font-mono">300 DPI Vector SVG Engine</span>
            </div>
            <p className="text-xs text-zinc-300">
              Generates pixel-perfect vector geometry with embedded fonts, official guilloche security watermark, and direct browser-native vector print stream (zero screenshot blurriness).
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button
              variant="cyan"
              size="sm"
              onClick={handleExportPdf}
              leftIcon={<Download className="w-3.5 h-3.5" />}
              className="bg-[#00f0ff] text-black font-bold shadow-glow-cyan"
            >
              Export High-Resolution Vector PDF ➔
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

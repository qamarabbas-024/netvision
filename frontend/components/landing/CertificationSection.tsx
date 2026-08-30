'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ExternalLink, ShieldCheck, QrCode, Copy, Check } from 'lucide-react';

interface CertificationSectionProps {
  onStartLearning?: () => void;
}

export const CertificationSection: React.FC<CertificationSectionProps> = () => {
  const [showVerifiedBadge, setShowVerifiedBadge] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const certHash = '0x8F9C42A1E7B9045D813F60D29E11C4958A7308D64A5E82B63CD19F02';

  const handleCopyHash = () => {
    navigator.clipboard.writeText(certHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2500);
  };

  return (
    <section id="certifications-section" className="relative w-full bg-[#070a10] border-b border-[#1e293b]/70 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="space-y-2 max-w-3xl">
          <div className="text-xs font-bold font-mono text-[#38bdf8] uppercase tracking-wider">
            VERIFIED CERTIFICATE // INDUSTRY CREDENTIAL
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Prove Your Competence With Cryptographic Verification
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-normal">
            NetVision certificates come with cryptographic verification codes, verifiable configuration telemetry data, and dynamic on-chain validator hashes.
          </p>
        </div>

        {/* Main Grid: Left 2x2 Steps & Actions, Right Certificate Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: 2x2 Steps & Buttons */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* 2x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* 01. Learn */}
              <div className="p-4 rounded-xl bg-[#0b0f17] border border-slate-800 space-y-1.5">
                <div className="text-xs font-mono font-bold text-[#34d399]">01. Learn</div>
                <h4 className="text-sm font-bold text-slate-200">Interactive 3D Study</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Broaden intuition with interactive 3D simulations and active packet flows.
                </p>
              </div>

              {/* 02. Practice */}
              <div className="p-4 rounded-xl bg-[#0b0f17] border border-slate-800 space-y-1.5">
                <div className="text-xs font-mono font-bold text-[#38bdf8]">02. Practice</div>
                <h4 className="text-sm font-bold text-slate-200">Hands-on Scenarios</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Hands-on network scenarios and stress scenarios inside sandbox CLI.
                </p>
              </div>

              {/* 03. Prove */}
              <div className="p-4 rounded-xl bg-[#0b0f17] border border-slate-800 space-y-1.5">
                <div className="text-xs font-mono font-bold text-purple-400">03. Prove</div>
                <h4 className="text-sm font-bold text-slate-200">Real-Time Exam</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Pass real-time stress testing without accidental network failure.
                </p>
              </div>

              {/* 04. Earn */}
              <div className="p-4 rounded-xl bg-[#0b0f17] border border-slate-800 space-y-1.5">
                <div className="text-xs font-mono font-bold text-amber-400">04. Earn</div>
                <h4 className="text-sm font-bold text-slate-200">Verified Certificate</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Obtain cryptographically verified digital certificate for employers.
                </p>
              </div>

            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => setShowVerifiedBadge(!showVerifiedBadge)}
                className="px-5 py-3 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(2,132,199,0.3)] transition-all cursor-pointer"
              >
                <span>View Verified Credential</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <Link
                href="/certificates"
                className="px-5 py-3 rounded-xl bg-[#0f172a] hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-semibold text-xs transition-all flex items-center gap-2"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Certification Exam Center</span>
              </Link>
            </div>

            {showVerifiedBadge && (
              <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs font-mono text-emerald-300 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-bold">Public Key Signature Verified: VALID</span>
                  </div>
                  <button
                    onClick={handleCopyHash}
                    className="p-1 rounded bg-emerald-900/50 hover:bg-emerald-800 text-emerald-300 text-[10px] flex items-center gap-1 cursor-pointer"
                  >
                    {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedHash ? 'Copied' : 'Copy Hash'}</span>
                  </button>
                </div>
                <div className="text-[10px] text-slate-400 break-all bg-black/40 p-2 rounded border border-slate-800">
                  {certHash}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: High-Fidelity Certificate Mockup with QR Code & Seal */}
          <div className="lg:col-span-6">
            <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0c1322] via-[#090d16] to-[#0b101c] border border-slate-700/80 shadow-2xl space-y-6 font-sans overflow-hidden">
              
              {/* Top Header Row */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#10b981]/15 border border-[#10b981]/40 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#34d399]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M6 18V6l12 12V6" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white tracking-tight">NetVision Assembly</div>
                    <div className="text-[10px] font-mono text-slate-400">Verified Certificate (NV-NET)</div>
                  </div>
                </div>

                <div className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-bold flex items-center gap-1">
                  <span>+</span>
                  <span>VERIFIED</span>
                </div>
              </div>

              {/* Certificate Title with Hologram Seal & QR Code */}
              <div className="flex items-start justify-between gap-4 relative z-10">
                <div className="space-y-2 max-w-sm">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#38bdf8]">
                    OFFICIAL INDUSTRY CERTIFICATION
                  </div>
                  <h3 className="text-2xl font-extrabold text-white tracking-tight">
                    NV-NET Certified Associate
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Demonstrated deep understanding of core network topologies, switching, routing algorithms, and packet parsing under fault conditions.
                  </p>
                </div>

                {/* Right Badges: Hologram Seal & Scannable QR Code */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* Hologram Seal */}
                  <div className="hidden sm:block w-16 h-16 opacity-90 hover:opacity-100 transition-opacity">
                    <img
                      src="/certificate-seal.png"
                      alt="Cryptographic Verification Seal"
                      className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                    />
                  </div>

                  {/* Scannable SVG QR Code */}
                  <div
                    className="relative w-14 h-14 p-2 rounded-xl bg-[#070b12] border border-emerald-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.25)] group cursor-pointer hover:border-emerald-400 hover:scale-105 transition-all"
                    title="Scan to verify credential"
                  >
                    <div className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 border-t border-l border-emerald-400" />
                    <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 border-t border-r border-emerald-400" />
                    <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 border-b border-l border-emerald-400" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 border-b border-r border-emerald-400" />
                    <svg className="w-full h-full text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="2" y="2" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
                      <rect x="4.5" y="4.5" width="3" height="3" fill="currentColor" />
                      <rect x="14" y="2" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
                      <rect x="16.5" y="4.5" width="3" height="3" fill="currentColor" />
                      <rect x="2" y="14" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
                      <rect x="4.5" y="16.5" width="3" height="3" fill="currentColor" />
                      <rect x="14" y="14" width="3" height="3" fill="currentColor" />
                      <rect x="19" y="14" width="3" height="3" fill="currentColor" />
                      <rect x="14" y="19" width="3" height="3" fill="currentColor" />
                      <rect x="19" y="19" width="3" height="3" fill="currentColor" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Learner Info Card */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#060910] border border-slate-800/80 font-mono text-[11px] relative z-10">
                <div>
                  <div className="text-slate-500 text-[10px]">RECIPIENT</div>
                  <div className="text-slate-200 font-bold mt-0.5">Qualified Learner</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px]">CERTIFICATE ID</div>
                  <div className="text-[#38bdf8] font-bold mt-0.5">0x8F9C...42A1</div>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <div className="text-slate-500 text-[10px]">STATUS</div>
                  <div className="text-[#34d399] font-bold mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                    <span>Authenticated</span>
                  </div>
                </div>
              </div>

              {/* Certificate Footer */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500 relative z-10">
                <Link href="/certificates" className="flex items-center gap-1 text-slate-400 hover:text-[#38bdf8] transition-colors">
                  <ExternalLink className="w-3 h-3 text-[#38bdf8]" />
                  <span>Verify Credential Directory</span>
                </Link>
                <div className="text-emerald-400/80 font-semibold">
                  NV-NET Compliant
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

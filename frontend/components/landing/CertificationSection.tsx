'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, QrCode, Copy, Check, Lock, Award } from 'lucide-react';

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
                <span>{showVerifiedBadge ? 'Hide Verification Spec' : 'View Verified Credential'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <Link
                href="/certificates"
                className="px-5 py-3 rounded-xl bg-[#0f172a] hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Certification Registry</span>
              </Link>
            </div>

            {/* Live Verification Telemetry Dropdown */}
            {showVerifiedBadge && (
              <div className="p-4 rounded-xl bg-[#0b1320] border border-cyan-500/40 space-y-2.5 animate-fadeIn font-mono text-xs">
                <div className="flex items-center justify-between text-cyan-400 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" /> Cryptographic Proof Signature
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">VALIDATED</span>
                </div>
                <div className="p-2 bg-black/60 rounded-lg text-[10px] text-slate-300 break-all border border-slate-800">
                  {certHash}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Signer: NetVision Autonomous Root CA</span>
                  <button
                    onClick={handleCopyHash}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedHash ? 'Copied' : 'Copy Hash'}</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Premium Certificate Mockup Card */}
          <div className="lg:col-span-6 relative">
            <div className="relative p-7 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#0b1120] to-[#080d18] border border-slate-700/80 shadow-2xl space-y-6 overflow-hidden">
              
              {/* Corner Ribbon */}
              <div className="absolute top-0 right-0 p-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <Award className="w-6 h-6" />
                </div>
              </div>

              {/* Certificate Header */}
              <div className="space-y-1">
                <div className="text-[10px] font-mono tracking-widest text-[#38bdf8] uppercase font-bold">
                  NETVISION CERTIFIED ARCHITECT
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Advanced Enterprise Network Engineer
                </h3>
              </div>

              {/* Candidate Info */}
              <div className="py-2 border-y border-slate-800/80 grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">ISSUED TO</span>
                  <span className="text-slate-200 font-bold">Alex Morgan, NetOps</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">VERIFICATION ID</span>
                  <span className="text-emerald-400 font-bold">NV-9042-PRO</span>
                </div>
              </div>

              {/* Verified Competencies */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
                  Demonstrated Competencies:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Multi-AS BGP Route Engineering</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>OSPFv3 Area Convergence</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>VXLAN / EVPN Fabric Tunnels</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Stateful Firewall Triage</span>
                  </div>
                </div>
              </div>

              {/* Certificate Footer */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <div className="flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-slate-400" />
                  <span>Scan to verify on-chain</span>
                </div>
                <span className="text-emerald-400 font-semibold">100% Cryptographically Verified</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

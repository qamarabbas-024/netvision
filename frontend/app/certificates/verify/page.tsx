'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Search,
  ArrowLeft,
  ArrowRight,
  Award,
  Lock,
  FileCheck2,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CANONICAL_CREDENTIALS } from '@netvision/shared';

export default function CertificateVerificationPortalPage() {
  const router = useRouter();
  const [credentialId, setCredentialId] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = credentialId.trim();
    if (!trimmed) {
      setValidationError('Please enter a valid Credential ID (e.g., NV-NET-C01-XXXX or NV-NET-MASTERY-XXXX).');
      return;
    }
    setValidationError(null);
    router.push(`/certificates/verify/${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col font-sans">
      {/* Navigation Header */}
      <header className="border-b border-[#272732] bg-[#0c0d12]/80 backdrop-blur-md px-4 sm:px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-[#00f0ff] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to NetVision Home
          </Link>
          <div className="flex items-center gap-4 text-xs font-mono">
            <Link href="/courses" className="text-zinc-400 hover:text-white transition-colors">
              Curriculum
            </Link>
            <Link href="/certificates" className="text-zinc-400 hover:text-white transition-colors">
              Credential Catalog
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 bg-net-grid-pattern">
        <div className="max-w-3xl mx-auto w-full space-y-8 py-6">
          
          {/* Hero Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-xs font-mono text-[#00f0ff]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>PUBLIC VERIFICATION REGISTRY</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Verify Credential Authenticity
            </h1>
            <p className="text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
              Confirm the official status, issuance timestamp, and cryptographic seal of any NetVision specialist certification or Pinnacle Mastery credential.
            </p>
          </div>

          {/* Search Card */}
          <Card className="p-6 sm:p-8 bg-[#121217] border border-[#272732] rounded-2xl shadow-instrument">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label
                  htmlFor="credential-search-input"
                  className="block text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold mb-2"
                >
                  Authoritative Credential ID
                </label>
                <div className="relative flex items-center">
                  <Search className="absolute left-3.5 w-4 h-4 text-zinc-500 pointer-events-none" />
                  <input
                    id="credential-search-input"
                    type="text"
                    value={credentialId}
                    onChange={(e) => {
                      setCredentialId(e.target.value);
                      if (validationError) setValidationError(null);
                    }}
                    placeholder="e.g. NV-NET-C01-94A2B1 or NV-NET-MASTERY-883F"
                    className="w-full pl-10 pr-4 py-3 bg-[#0c0d12] border border-[#272732] focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] rounded-xl text-white font-mono text-sm placeholder:text-zinc-600 outline-none transition-all"
                  />
                </div>
                {validationError && (
                  <p className="mt-2 text-xs text-rose-400 font-medium" role="alert">
                    {validationError}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <span className="text-[11px] text-zinc-500 font-mono">
                  Credential IDs are case-sensitive and formatted as NV-NET-C[01-05]-XXXX or NV-NET-MASTERY-XXXX.
                </span>
                <Button
                  id="verify-submit-btn"
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto px-6 font-bold text-xs"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Verify Credential
                </Button>
              </div>
            </form>
          </Card>

          {/* Supported Credential Standards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#121217]/60 border border-[#272732] flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-white">Authoritative Registry</h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Real-time database validation directly against NetVision certification records.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#121217]/60 border border-[#272732] flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-white">Cryptographic Proof</h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Tamper-evident verification hash confirming credential integrity and grading tier.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#121217]/60 border border-[#272732] flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-white">Privacy Protected</h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Confirms competency and status without exposing private learner identification data.
                </p>
              </div>
            </div>
          </div>

          {/* Canonical Program Index */}
          <div className="border-t border-[#272732] pt-6 text-center space-y-2">
            <p className="text-xs text-zinc-500">
              Looking for our curriculum tracks? Explore our{' '}
              <Link href="/courses" className="text-[#00f0ff] hover:underline">
                5 Flagship Networking Courses
              </Link>{' '}
              or review the{' '}
              <Link href="/certificates" className="text-[#00f0ff] hover:underline">
                Credential Specification Catalog
              </Link>
              .
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Award, Download, Share2, ArrowLeft, ShieldCheck, Activity } from 'lucide-react';

export default function CertificateDetailPage() {
  const params = useParams();
  const certId = params?.id as string;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col justify-between p-8 bg-net-grid-pattern">
        {/* Top Header */}
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

        {/* Certificate Golden/Cyan Glowing Frame */}
        <div className="max-w-4xl mx-auto w-full glass-panel-glow p-12 rounded-3xl border-2 border-[#00f0ff]/40 shadow-glow-cyan flex flex-col items-center text-center relative overflow-hidden my-auto">
          {/* Top Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00f0ff] to-[#3b82f6] flex items-center justify-center text-black shadow-glow-cyan">
              <Activity className="w-7 h-7 font-bold" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">
              Net<span className="text-[#00f0ff]">Vision</span>
            </span>
          </div>

          <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest font-bold mb-2">
            OFFICIAL CERTIFICATE OF COMPLETION
          </span>

          <p className="text-xs text-zinc-400 mb-8">This is to certify that</p>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-[#00f0ff]">
            Alex Rivers
          </h1>

          <p className="text-sm text-zinc-300 max-w-lg mb-8 leading-relaxed">
            has successfully demonstrated hands-on mastery in visual packet analysis, IP subnetting, and protocol handshake simulations for
          </p>

          <h2 className="text-2xl font-bold text-[#00f0ff] mb-8 font-mono">
            TCP/IP Protocol Suite & Handshakes
          </h2>

          <div className="flex items-center justify-between w-full pt-8 border-t border-[#272732] text-xs font-mono text-zinc-400">
            <div className="text-left">
              <span className="block text-zinc-500 text-[10px]">ISSUED DATE</span>
              <span className="text-white font-bold">August 05, 2026</span>
            </div>

            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <ShieldCheck className="w-5 h-5" /> VERIFIED ON-CHAIN
            </div>

            <div className="text-right">
              <span className="block text-zinc-500 text-[10px]">CREDENTIAL ID</span>
              <span className="text-[#00f0ff] font-bold">{certId || 'cert-99231'}</span>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-zinc-500 pt-8">
          <p>© 2026 NetVision Platform. Cryptographically verifiable learning credential.</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}

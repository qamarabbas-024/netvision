'use client';

import React from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';
import { Award, ArrowRight, ShieldCheck, Lock } from 'lucide-react';

export default function CertificatesCatalogPage() {
  const { isAuthenticated } = useAuthStore();
  const certs = [
    {
      id: 'cert-88912',
      title: 'Computer Networking Fundamentals Specialist',
      issuedDate: 'August 01, 2026',
      hash: '0x4F89A...21B',
    },
    {
      id: 'cert-99231',
      title: 'TCP/IP Protocol Suite & Handshake Expert',
      issuedDate: 'August 05, 2026',
      hash: '0x99C21...E4F',
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar />

          <main className="p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
            <div className="max-w-6xl mx-auto flex flex-col gap-8">
              <div>
                <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest font-semibold block mb-1">
                  Cryptographic Credentials
                </span>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  Earned Certificates
                </h1>
              </div>

              {!isAuthenticated ? (
                <div className="p-8 glass-panel rounded-3xl border border-[#00f0ff]/30 text-center flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff]">
                    <Lock className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Account Required for Verified Certificates</h3>
                    <p className="text-sm text-zinc-400 max-w-md mx-auto">
                      Complete your course requirements and log in or create an account to claim your official verified course certificates.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <Link href="/login">
                      <Button variant="ghost">Log In</Button>
                    </Link>
                    <Link href="/register">
                      <Button variant="cyan">Create Account</Button>
                    </Link>
                  </div>
                </div>
              ) : (

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {certs.map((c) => (
                  <Card key={c.id} className="p-8 glass-panel-glow border-[#00f0ff]/30 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="cyan">VERIFIED CREDENTIAL</Badge>
                        <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="w-4 h-4" /> Active
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff]">
                          <Award className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-bold text-white leading-snug">{c.title}</h3>
                      </div>

                      <div className="p-3 rounded-xl bg-[#121217] border border-[#272732] font-mono text-xs text-zinc-400 mb-6">
                        <div>Issued: <span className="text-white">{c.issuedDate}</span></div>
                        <div>Verification Hash: <span className="text-[#00f0ff]">{c.hash}</span></div>
                      </div>
                    </div>

                    <Link href={`/certificates/${c.id}`}>
                      <Button variant="cyan" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                        View & Download Certificate
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

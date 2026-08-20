'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';
import { getUserCertificatesApi } from '@/lib/api';
import { Award, ArrowRight, ShieldCheck, Lock, BookOpen, AlertTriangle, RefreshCw } from 'lucide-react';
import { PulsePacketLoader } from '@/components/ui/Loading';

export default function CertificatesCatalogPage() {
  const { isAuthenticated } = useAuthStore();
  const [certs, setCerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadCertificates = async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await getUserCertificatesApi();
      if (Array.isArray(data)) {
        setCerts(data);
      }
    } catch (err: any) {
      console.error('Failed to load certificates:', err);
      setLoadError(err?.message || 'Failed to retrieve earned certificates.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, [isAuthenticated]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar />

          <main className="p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
            {isLoading ? (
              <div className="py-24 flex justify-center items-center">
                <PulsePacketLoader label="Retrieving Cryptographic Credentials..." />
              </div>
            ) : loadError ? (
              <div className="p-12 glass-panel rounded-3xl border border-rose-500/30 text-center flex flex-col items-center gap-4 max-w-md mx-auto my-auto">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Failed to Load Certificates</h3>
                <p className="text-xs text-zinc-400 mb-2">{loadError}</p>
                <Button variant="cyan" size="sm" onClick={loadCertificates} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
                  Retry Connection
                </Button>
              </div>
            ) : (
            <div className="max-w-6xl mx-auto flex flex-col gap-8">
              <div>
                <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest font-semibold block mb-1">
                  Cryptographic Credentials
                </span>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  Earned Certificates
                </h1>
                <p className="text-sm text-zinc-400 mt-1 max-w-xl">
                  Official, verifiable certificates earned by achieving passing mastery across comprehensive networking courses.
                </p>
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
              ) : certs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {certs.map((c) => {
                    const issueDate = c.issuedAt
                      ? new Date(c.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                      : 'Recently Issued';
                    const targetId = c.credentialId || c.code || c.id;

                    return (
                      <Card key={c.id} className="p-8 glass-panel-glow border-[#00f0ff]/30 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <Badge variant="cyan">VERIFIED CREDENTIAL</Badge>
                            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-bold">
                              <ShieldCheck className="w-4 h-4" /> {c.status || 'Active'}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff]">
                              <Award className="w-7 h-7" />
                            </div>
                            <h3 className="text-lg font-bold text-white leading-snug">{c.title}</h3>
                          </div>

                          <div className="p-3.5 rounded-xl bg-[#121217] border border-[#272732] font-mono text-xs text-zinc-400 mb-6 space-y-1">
                            <div>Recipient: <span className="text-white font-bold">{c.recipientName || 'Candidate'}</span></div>
                            <div>Issued: <span className="text-white">{issueDate}</span></div>
                            <div>Credential ID: <span className="text-[#00f0ff]">{targetId}</span></div>
                          </div>
                        </div>

                        <Link href={`/certificates/${targetId}`}>
                          <Button variant="cyan" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                            View & Download Certificate
                          </Button>
                        </Link>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="p-12 glass-panel rounded-3xl border border-[#272732] text-center flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-center text-zinc-400">
                    <Award className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">No Certificates Earned Yet</h3>
                    <p className="text-sm text-zinc-400 max-w-md mx-auto">
                      Complete 100% of required lessons and quizzes in a course with a passing grade of 80% or higher to earn and claim your official certificate.
                    </p>
                  </div>
                  <Link href="/courses" className="mt-2">
                    <Button variant="cyan" leftIcon={<BookOpen className="w-4 h-4" />}>
                      Browse Course Catalog →
                    </Button>
                  </Link>
                </div>
              )}
            </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

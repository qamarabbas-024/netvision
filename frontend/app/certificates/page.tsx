'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { useAuthStore } from '@/stores/authStore';
import { getUserCertificatesApi } from '@/lib/api';
import { Award, ArrowRight, ShieldCheck, Lock, BookOpen } from 'lucide-react';
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
      <div className="min-h-screen surface-0 text-[#f4f5f7] flex font-sans">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar />

          <main className="p-4 sm:p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
            {isLoading ? (
              <div className="py-24 flex justify-center items-center">
                <PulsePacketLoader label="Retrieving Cryptographic Credentials..." />
              </div>
            ) : loadError ? (
              <ErrorState
                title="Failed to Load Certificates"
                message={loadError}
                errorCode="ERR_CERTS_UNAVAILABLE"
                onRetry={loadCertificates}
                className="max-w-md mx-auto my-auto"
              />
            ) : (
            <div className="max-w-6xl mx-auto flex flex-col gap-6 sm:gap-8">
              <div>
                <span className="text-xs font-mono text-[#38bdf8] uppercase tracking-widest font-semibold block mb-1">
                  CRYPTOGRAPHIC CREDENTIALS
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#f4f5f7] tracking-tight">
                  Earned Certificates
                </h1>
                <p className="text-xs sm:text-sm text-[#8e95a5] mt-1 max-w-xl leading-relaxed">
                  Official, verifiable certificates earned by achieving passing mastery across comprehensive networking courses.
                </p>
              </div>

              {!isAuthenticated ? (
                <div className="p-8 surface-2 rounded-xl border border-[#2a2e39] text-center flex flex-col items-center gap-4 shadow-instrument">
                  <div className="w-12 h-12 rounded-lg bg-[#14151a] border border-[#2a2e39] flex items-center justify-center text-[#38bdf8]">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#f4f5f7] mb-1.5">Account Required for Verified Certificates</h3>
                    <p className="text-xs sm:text-sm text-[#8e95a5] max-w-md mx-auto leading-relaxed">
                      Complete your course requirements and log in or create an account to claim your official verified course certificates.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <Link href="/login">
                      <Button variant="secondary" size="sm">Log In</Button>
                    </Link>
                    <Link href="/register">
                      <Button variant="primary" size="sm">Create Account</Button>
                    </Link>
                  </div>
                </div>
              ) : certs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  {certs.map((c) => {
                    const issueDate = c.issuedAt
                      ? new Date(c.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                      : 'Recently Issued';
                    const targetId = c.credentialId || c.code || c.id;

                    return (
                      <Card key={c.id} className="p-6 surface-2 border border-[#2a2e39] flex flex-col justify-between shadow-instrument">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <Badge variant="cyan" dot={true}>VERIFIED CREDENTIAL</Badge>
                            <span className="text-xs font-mono text-[#10b981] flex items-center gap-1 font-bold">
                              <ShieldCheck className="w-4 h-4" /> {c.status || 'Active'}
                            </span>
                          </div>

                          <div className="flex items-center gap-3.5 mb-4">
                            <div className="w-11 h-11 rounded-lg bg-[#14151a] border border-[#2a2e39] flex items-center justify-center text-[#38bdf8]">
                              <Award className="w-6 h-6" />
                            </div>
                            <h3 className="text-base sm:text-lg font-bold text-[#f4f5f7] leading-snug">{c.title}</h3>
                          </div>

                          <div className="p-3 rounded-lg bg-[#14151a] border border-[#2a2e39] font-mono text-xs text-[#8e95a5] mb-5 space-y-1">
                            <div>Recipient: <span className="text-[#f4f5f7] font-semibold">{c.recipientName || 'Candidate'}</span></div>
                            <div>Issued: <span className="text-[#f4f5f7]">{issueDate}</span></div>
                            <div>Credential ID: <span className="text-[#38bdf8] font-bold">{targetId}</span></div>
                          </div>
                        </div>

                        <Link href={`/certificates/${targetId}`}>
                          <Button variant="primary" className="w-full justify-center" rightIcon={<ArrowRight className="w-4 h-4" />}>
                            View & Download Certificate
                          </Button>
                        </Link>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  title="No Certificates Earned Yet"
                  description="Complete 100% of required lessons and quizzes in a course with a passing grade of 80% or higher to earn and claim your official certificate."
                  actionLabel="Browse Course Catalog →"
                  onAction={() => { window.location.href = '/courses'; }}
                  statusTag="STATUS: CREDENTIALS_EMPTY"
                  icon={<Award className="w-6 h-6" />}
                />
              )}
            </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

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
                  ACADEMIC & PROFESSIONAL CREDENTIALS
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#f4f5f7] tracking-tight">
                  Earned Certifications
                </h1>
                <p className="text-xs sm:text-sm text-[#8e95a5] mt-1 max-w-xl leading-relaxed">
                  Official, verifiable certificates earned by demonstrating curriculum mastery and passing formal diagnostic assessments.
                </p>
              </div>

              {!isAuthenticated ? (
                <div className="p-8 surface-2 rounded-xl border border-[#2a2e39] text-center flex flex-col items-center gap-4 shadow-instrument">
                  <div className="w-12 h-12 rounded-lg bg-[#14151a] border border-[#2a2e39] flex items-center justify-center text-[#38bdf8]">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#f4f5f7] mb-1.5">Account Required to Claim Credentials</h3>
                    <p className="text-xs sm:text-sm text-[#8e95a5] max-w-md mx-auto leading-relaxed">
                      Complete your curriculum requirements and log in or create an account to claim and download your verified course credentials.
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
                    const certTitle = c.certificationTitle || c.title || 'Computer Networking Certification';

                    return (
                      <Card key={c.id} className="p-6 surface-2 border border-[#2a2e39] flex flex-col justify-between shadow-instrument hover:border-[#38bdf8]/40 transition-all">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-[11px] font-mono text-[#38bdf8] font-semibold uppercase tracking-wider">VERIFIED CREDENTIAL</span>
                            <span className={`text-xs font-mono flex items-center gap-1 font-bold ${c.status === 'ACTIVE' ? 'text-[#10b981]' : 'text-amber-400'}`}>
                              <ShieldCheck className="w-3.5 h-3.5" /> {c.status === 'ACTIVE' ? 'Verified & Active' : (c.status || 'Active')}
                            </span>
                          </div>

                          <div className="flex items-start gap-3.5 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-[#14151a] border border-[#2a2e39] flex items-center justify-center text-[#38bdf8] shrink-0 mt-0.5">
                              <Award className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="text-base sm:text-lg font-bold text-[#f4f5f7] leading-snug">{certTitle}</h3>
                              {c.recipientName && (
                                <p className="text-xs text-[#8e95a5] mt-0.5">Awarded to <span className="text-[#c4c9d4] font-semibold">{c.recipientName}</span></p>
                              )}
                            </div>
                          </div>

                          <div className="p-3 rounded-lg bg-[#14151a] border border-[#2a2e39] font-mono text-xs text-[#8e95a5] mb-5 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span>Issued:</span>
                              <span className="text-[#f4f5f7] font-semibold">{issueDate}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Credential ID:</span>
                              <span className="text-[#38bdf8] font-bold">{targetId}</span>
                            </div>
                          </div>
                        </div>

                        <Link href={`/certificates/${targetId}`}>
                          <Button variant="primary" className="w-full justify-center text-xs font-bold" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                            View Credential Record
                          </Button>
                        </Link>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-[#121217] border border-[#272732] flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff]">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">No Certificates Claimed Yet</h3>
                  <p className="text-xs text-zinc-400 max-w-md">
                    Complete 100% of required lessons and achieve $\ge 80\%$ on diagnostic benchmark quizzes in a credential track below to unlock your verifiable certificate.
                  </p>
                </div>
              )}

              {/* Official NV-NET Certification Matrix */}
              <div className="flex flex-col gap-5 pt-4">
                <div>
                  <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest font-semibold block mb-1">
                    STANDARDIZED CERTIFICATION MATRIX
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    NetVision Professional Credential Tracks
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
                    Industry-recognized certifications benchmarking technical proficiency from physical signal mechanics through autonomous network automation pipelines.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* NV-NET 101 */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-[#0f0f14] border border-[#272732] flex flex-col justify-between hover:border-[#00f0ff]/40 transition-all gap-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-md bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] font-mono text-[10px] font-bold uppercase">
                          NV-NET 101 Track
                        </span>
                        <span className="text-xs font-mono text-zinc-400">Foundational Level</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white">Certified Network Foundations Specialist</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Validates mastery over binary/hex conversions, physical media & SFP transceivers, OSI 7-layer encapsulation, TCP/IP stack, and RF spectrum fundamentals.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {['Binary Math', 'Physical Media', 'OSI 7 Layers', 'TCP/IP', 'Performance Metrics', '802.11 Wi-Fi'].map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded bg-[#181820] text-[10px] font-mono text-zinc-300 border border-zinc-800">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link href="/courses">
                      <Button variant="secondary" className="w-full justify-center text-xs font-bold" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        Explore Course & Begin Track
                      </Button>
                    </Link>
                  </div>

                  {/* NV-NET 202 */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-[#0f0f14] border border-[#272732] flex flex-col justify-between hover:border-sky-400/40 transition-all gap-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-md bg-sky-400/10 border border-sky-400/30 text-sky-400 font-mono text-[10px] font-bold uppercase">
                          NV-NET 202 Track
                        </span>
                        <span className="text-xs font-mono text-zinc-400">Intermediate Level</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white">Certified IP Addressing & Subnetting Engineer</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Demonstrates expertise in VLSM hierarchical subnet allocation, CIDR prefix masks, RFC 1918 private ranges, ARP resolution, IPv6 SLAAC, and TCP/UDP socket boundaries.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {['IPv4 CIDR', 'VLSM Design', 'RFC 1918', 'ARP Resolution', 'IPv6 SLAAC', 'TCP/UDP Sockets'].map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded bg-[#181820] text-[10px] font-mono text-zinc-300 border border-zinc-800">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link href="/courses">
                      <Button variant="secondary" className="w-full justify-center text-xs font-bold" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        Explore Course & Begin Track
                      </Button>
                    </Link>
                  </div>

                  {/* NV-NET 304 */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-[#0f0f14] border border-[#272732] flex flex-col justify-between hover:border-purple-400/40 transition-all gap-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-md bg-purple-400/10 border border-purple-400/30 text-purple-400 font-mono text-[10px] font-bold uppercase">
                          NV-NET 304 Track
                        </span>
                        <span className="text-xs font-mono text-zinc-400">Advanced Level</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white">Certified Enterprise Routing & Switching Architect</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Validates enterprise switching loop prevention with STP / RSTP (802.1w), Dijkstra Shortest Path First (SPF) algorithm, single and multi-area OSPF routing, and route redistribution.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {['STP / RSTP', 'Bridge ID & Ports', 'Dijkstra SPF', 'OSPF LSA Types', 'Multi-Area OSPF', 'Route Redistribution'].map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded bg-[#181820] text-[10px] font-mono text-zinc-300 border border-zinc-800">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link href="/courses">
                      <Button variant="secondary" className="w-full justify-center text-xs font-bold" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        Explore Course & Begin Track
                      </Button>
                    </Link>
                  </div>

                  {/* NV-NET 404 */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-[#0f0f14] border border-[#272732] flex flex-col justify-between hover:border-emerald-400/40 transition-all gap-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-md bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 font-mono text-[10px] font-bold uppercase">
                          NV-NET 404 Track
                        </span>
                        <span className="text-xs font-mono text-zinc-400">Expert Level</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white">Certified Packet Analysis & Network Automation Architect</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Advanced validation of promiscuous Wireshark PCAP byte dissection, BPF capture filters, RESTCONF/NETCONF programmability, Python automation scripts, and Scapy packet fabrication.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {['Wireshark PCAP', 'BPF Syntax', 'RESTCONF / NETCONF', 'Python Automation', 'Scapy Crafting', 'CI/CD Pipelines'].map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded bg-[#181820] text-[10px] font-mono text-zinc-300 border border-zinc-800">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link href="/courses">
                      <Button variant="secondary" className="w-full justify-center text-xs font-bold" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        Explore Course & Begin Track
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

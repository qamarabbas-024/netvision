import React from 'react';
import Link from 'next/link';
import { Shield, FileText, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Terms of Service | NetVision Platform',
  description: 'Terms of Service, Certification Integrity Standards, and Independent Educational Platform Disclaimers.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#070a10] text-[#e2e8f0] font-sans antialiased py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Navigation & Header */}
        <div className="space-y-4 border-b border-slate-800 pb-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
            <span className="text-[11px] font-mono text-slate-500">Effective Date: January 1, 2026</span>
          </div>
          
          <div className="flex items-center gap-3 pt-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Terms of Service & Educational Standards</h1>
              <p className="text-xs sm:text-sm text-slate-400">NetVision Learning & Autonomous Certification Platform</p>
            </div>
          </div>
        </div>

        {/* Section 1: Non-Affiliation / Vendor Disclaimers */}
        <section className="space-y-3 bg-[#0b0f17] border border-amber-500/30 rounded-xl p-6">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>1. Independent Educational Platform & Non-Affiliation Disclaimer</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            NetVision is an independent educational simulator, interactive training environment, and autonomous certification registry. NetVision is <strong>not affiliated with, sponsored by, authorized by, or endorsed by Cisco Systems, Inc., CompTIA, Juniper Networks, Amazon Web Services, or any other commercial equipment vendor or certification vendor</strong>.
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            All vendor names, brand names, product trademarks, and service marks mentioned across courses, topologies, command-line interfaces, and exam scenarios (e.g., Cisco, IOS, CCNA, CompTIA Network+) are the property of their respective owners. They are referenced strictly for nominative identification and comparative pedagogy under fair use. NetVision credentials (including NV-NET-C01 through NV-NET-C05 and NV-NET-MASTERY) certify mastery of skills evaluated exclusively on the NetVision platform.
          </p>
        </section>

        {/* Section 2: Certification Integrity & Academic Honesty */}
        <section className="space-y-4 bg-[#0b0f17] border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Shield className="w-4 h-4 shrink-0" />
            <span>2. Certification Integrity, Examination Standards & Honor Code</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            NetVision credentials represent demonstrated technical competence. By participating in course assessments, lab simulations, or the Master Capstone Examination, candidates agree to adhere to strict academic honesty standards:
          </p>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
              <span><strong>Independent Effort:</strong> All assessment answers, configuration commands, and forensics submissions must reflect the candidate&apos;s own work without real-time collusion, external answer banks, or proxy test-taking.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
              <span><strong>Authoritative Grading:</strong> Course certifications require a minimum passing score of 80%. The Master Capstone requires an authoritative composite score of 85% (40% Theory, 35% Incident Triage, 25% Forensics). Grading is computed authoritatively server-side.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
              <span><strong>Revocation Policy:</strong> NetVision reserves the unilateral right to invalidate and revoke any credential if post-hoc audit, telemetry analysis, or security review identifies cheating, automated script exploitation, or credential theft.</span>
            </li>
          </ul>
        </section>

        {/* Section 3: Acceptable Platform Use */}
        <section className="space-y-3 bg-[#0b0f17] border border-slate-800 rounded-xl p-6">
          <h2 className="text-sm font-bold text-white">3. Acceptable Use of Sandboxes & Simulation Engines</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            The NetVision 3D Observatory, Packet Simulator, and WebCLI are provided strictly for educational purposes within browser-isolated and container-isolated environments. Users must not:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-400 pl-2">
            <li>Attempt to break out of client sandboxes, intercept non-public API endpoints, or conduct denial-of-service attacks against NetVision infrastructure.</li>
            <li>Use platform tools, terminal emulators, or network packet generators to conduct unauthorized security scanning or attack third-party networks.</li>
            <li>Automate credential claims or artificially manipulate course progress records.</li>
          </ul>
        </section>

        {/* Section 4: Limitation of Liability */}
        <section className="space-y-3 bg-[#0b0f17] border border-slate-800 rounded-xl p-6">
          <h2 className="text-sm font-bold text-white">4. Disclaimer of Warranties & Limitation of Liability</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            THE NETVISION PLATFORM, SIMULATORS, AND DOCUMENTATION ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. NETVISION DOES NOT GUARANTEE EMPLOYMENT, COMMERCIAL CERTIFICATION PASSAGE, OR HARDWARE-IDENTICAL CONVERGENCE TIMINGS IN SIMULATED TOPOLOGIES. IN NO EVENT SHALL NETVISION OR ITS CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING FROM THE USE OF THE SERVICE.
          </p>
        </section>

        {/* Section 5: Modifications & Contact */}
        <section className="space-y-3 bg-[#0b0f17] border border-slate-800 rounded-xl p-6">
          <h2 className="text-sm font-bold text-white">5. Governing Terms & Inquiries</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            We reserve the right to revise these terms to reflect evolving technical standards, security policies, and regulatory requirements. For inquiries regarding institutional licensing, certification verification, or academic honor code matters, please contact <code className="text-cyan-400">compliance@netvision.internal</code>.
          </p>
        </section>

        {/* Footer Navigation */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
          <Link href="/privacy" className="text-cyan-400 hover:underline">
            Read our Privacy Policy &rarr;
          </Link>
          <Link href="/" className="hover:text-slate-400">
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}

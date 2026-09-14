import React from 'react';
import Link from 'next/link';
import { Lock, Eye, Database, CheckCircle, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | NetVision Platform',
  description: 'Privacy Policy, Credential Registry Transparency, and Data Retention Standards.',
};

export default function PrivacyPolicyPage() {
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
            <span className="text-[11px] font-mono text-slate-500">Last Updated: January 1, 2026</span>
          </div>
          
          <div className="flex items-center gap-3 pt-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Privacy Policy & Credential Transparency</h1>
              <p className="text-xs sm:text-sm text-slate-400">How NetVision collects, secures, and handles learner data</p>
            </div>
          </div>
        </div>

        {/* Section 1: Overview & Principles */}
        <section className="space-y-3 bg-[#0b0f17] border border-slate-800 rounded-xl p-6">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-400" />
            <span>1. Core Privacy Commitments</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            NetVision values user privacy and data security. We do not sell, rent, or trade your personal information to third-party data brokers or marketing aggregators. Learner data is collected strictly to deliver interactive simulator training, compute exam grading, and issue tamper-evident credentials.
          </p>
        </section>

        {/* Section 2: Information Collected */}
        <section className="space-y-4 bg-[#0b0f17] border border-slate-800 rounded-xl p-6">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>2. Categories of Information We Process</span>
          </h2>
          <div className="space-y-3 text-xs text-slate-300">
            <div>
              <span className="font-bold text-slate-100">Account Credentials:</span> Your registered email address, hashed passwords (salted and hashed via bcrypt/argon2), and designated display name.
            </div>
            <div>
              <span className="font-bold text-slate-100">Learning & Examination Telemetry:</span> Module completion states, quiz attempt answers, simulation configuration inputs, and capstone timestamps used to assess technical mastery.
            </div>
            <div>
              <span className="font-bold text-slate-100">Public Credential Records:</span> When a student earns an authoritative certificate (e.g., NV-NET-C01 or NV-NET-MASTERY), a public verification record is created. This record includes the candidate&apos;s name, credential code, issue date, and SHA-256 integrity signature. <em>Candidate emails and private user IDs are never exposed on public verification endpoints.</em>
            </div>
          </div>
        </section>

        {/* Section 3: Data Security & Session Protection */}
        <section className="space-y-3 bg-[#0b0f17] border border-slate-800 rounded-xl p-6">
          <h2 className="text-sm font-bold text-white">3. Cryptographic & Operational Security</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            All client-server communications occur over Transport Layer Security (TLS 1.3). User authentication utilizes JSON Web Tokens (JWT) with server-side validation. Credential records in PostgreSQL utilize unique immutable identifiers and cryptographic SHA-256 digests to ensure tamper evidence.
          </p>
        </section>

        {/* Section 4: Learner Rights (GDPR & CCPA) */}
        <section className="space-y-4 bg-[#0b0f17] border border-slate-800 rounded-xl p-6">
          <h2 className="text-sm font-bold text-white">4. Learner Rights & Data Control</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            In compliance with global data privacy frameworks (including GDPR, UK GDPR, and CCPA):
          </p>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
              <span><strong>Right of Access & Portability:</strong> You may review and export your learning progress, completed certifications, and account profile at any time.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
              <span><strong>Right to Rectification:</strong> You may correct display name errors or profile information from the user settings portal.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
              <span><strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> You may request account deletion. In order to preserve verification integrity for employers who have already been provided credential IDs, issued certificate records can either be anonymized or permanently revoked upon explicit student request.</span>
            </li>
          </ul>
        </section>

        {/* Section 5: Contact Information */}
        <section className="space-y-3 bg-[#0b0f17] border border-slate-800 rounded-xl p-6">
          <h2 className="text-sm font-bold text-white">5. Privacy Officer & Data Requests</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            For privacy inquiries, data subject access requests (DSAR), or certificate privacy toggles, contact our data protection team at <code className="text-emerald-400">privacy@netvision.internal</code>.
          </p>
        </section>

        {/* Footer Navigation */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
          <Link href="/terms" className="text-cyan-400 hover:underline">
            Review Terms of Service &rarr;
          </Link>
          <Link href="/" className="hover:text-slate-400">
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}

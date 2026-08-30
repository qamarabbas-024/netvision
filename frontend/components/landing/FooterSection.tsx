'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Github, Twitter, Linkedin, Check, ArrowRight, ShieldCheck, Mail, Radio } from 'lucide-react';
import { audioEngine } from '@/lib/audioEngine';

export const FooterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    audioEngine.playSuccessChime();
    setSubscribed(true);
  };

  return (
    <footer className="w-full bg-[#070a10] border-t border-[#1e293b]/80 pt-16 pb-20 text-slate-400 font-sans text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main 12-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Brand Info & Mission (4 Columns) */}
          <div className="md:col-span-12 lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group cursor-pointer inline-flex">
              <div className="w-8 h-8 rounded-lg bg-[#10b981]/15 border border-[#10b981]/40 flex items-center justify-center group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all">
                <svg className="w-4 h-4 text-[#34d399]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 18V6l12 12V6" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white tracking-tight group-hover:text-[#34d399] transition-colors">
                Net<span className="text-[#34d399]">Vision</span>
              </span>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Learn computer networking by seeing how it works. Free interactive 3D WebGL observatory, deterministic protocol packet simulators, and verified on-chain credentials.
            </p>

            {/* Social Links with Hover Glow */}
            <div className="flex items-center space-x-2.5 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-[#0c121e] border border-slate-800 text-slate-400 hover:text-white hover:border-emerald-500/50 hover:shadow-[0_0_12px_rgba(16,185,129,0.25)] transition-all cursor-pointer"
                title="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-[#0c121e] border border-slate-800 text-slate-400 hover:text-white hover:border-cyan-500/50 hover:shadow-[0_0_12px_rgba(6,182,212,0.25)] transition-all cursor-pointer"
                title="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-[#0c121e] border border-slate-800 text-slate-400 hover:text-white hover:border-emerald-500/50 hover:shadow-[0_0_12px_rgba(16,185,129,0.25)] transition-all cursor-pointer"
                title="LinkedIn Network"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Platform & Labs (2 Columns) */}
          <div className="md:col-span-6 lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-1.5">
              <span>Platform</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/courses" className="hover:text-[#34d399] transition-colors">Courses &amp; Syllabi</Link></li>
              <li><Link href="/simulations" className="hover:text-[#34d399] transition-colors">Protocol Simulations</Link></li>
              <li><Link href="/sandbox" className="hover:text-[#34d399] transition-colors">Topology Sandbox</Link></li>
              <li><Link href="/troubleshooting" className="hover:text-[#34d399] transition-colors">Incident Break-Fix</Link></li>
              <li><Link href="/commands" className="hover:text-[#34d399] transition-colors">CLI Commands Shell</Link></li>
              <li><Link href="/certificates" className="hover:text-[#34d399] transition-colors">Certifications &amp; Seals</Link></li>
            </ul>
          </div>

          {/* Column 2: Resources & Learning (2 Columns) */}
          <div className="md:col-span-6 lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-1.5">
              <span>Resources</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/docs/architecture" className="hover:text-[#38bdf8] transition-colors">Architecture Docs</Link></li>
              <li><Link href="/docs/design-system" className="hover:text-[#38bdf8] transition-colors">Design System Tokens</Link></li>
              <li><Link href="/docs/pedagogy-blueprint" className="hover:text-[#38bdf8] transition-colors">Pedagogy Blueprint</Link></li>
              <li><Link href="/flashcards" className="hover:text-[#38bdf8] transition-colors">Leitner Flashcards</Link></li>
              <li><Link href="/glossary" className="hover:text-[#38bdf8] transition-colors">RFC &amp; Terms Glossary</Link></li>
              <li><Link href="/challenges" className="hover:text-[#38bdf8] transition-colors">Speed Diagnostic Quizzes</Link></li>
            </ul>
          </div>

          {/* Column 3: Technical Updates & Newsletter (4 Columns) */}
          <div className="md:col-span-12 lg:col-span-4 space-y-3.5 bg-[#0c121e]/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>Technical Updates</span>
              </h4>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Monthly
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Subscribe for new protocol simulations, Wireshark lab captures, and incident case studies.
            </p>

            {subscribed ? (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs font-mono text-emerald-300 flex items-center gap-2 animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Subscribed! You&apos;ll receive new lab updates.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2 pt-1">
                <div className="relative flex items-center">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full px-3.5 py-2.5 bg-[#070b14] border border-slate-800 focus:border-[#10b981] rounded-xl text-slate-200 text-xs outline-none font-mono transition-all placeholder:text-slate-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#10b981] hover:bg-[#059669] text-[#051a14] font-bold font-mono text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
                >
                  <span>Subscribe to Updates</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar: Copyright, System Status & Legal */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <span>© 2026 NetVision Platform. Open-source educational project.</span>
          </div>

          <div className="flex items-center gap-2 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>All Systems Operational</span>
          </div>

          <div className="flex gap-5">
            <Link href="/docs" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link href="/docs" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
            <Link href="/docs/architecture" className="hover:text-slate-400 transition-colors">Security Specs</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export const Footer = FooterSection;

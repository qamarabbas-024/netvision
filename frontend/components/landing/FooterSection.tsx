'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Github, Twitter, Linkedin, Check } from 'lucide-react';

export const FooterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <footer className="w-full bg-[#070a10] border-t border-[#1e293b]/80 py-14 text-slate-400 font-sans text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#10b981]/15 border border-[#10b981]/40 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#34d399]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 18V6l12 12V6" />
                </svg>
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Net<span className="text-[#34d399]">Vision</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Learn networking by seeing how it works. Free interactive computer networking simulation and hands-on cloud packet networks.
            </p>
            <div className="flex items-center space-x-3 text-slate-400 pt-1">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-[#0f172a] hover:text-white hover:bg-slate-800 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-[#0f172a] hover:text-white hover:bg-slate-800 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-[#0f172a] hover:text-white hover:bg-slate-800 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column: Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">Platform</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link href="/courses" className="hover:text-slate-200 transition-colors">Course Listing</Link></li>
              <li><Link href="/simulations" className="hover:text-slate-200 transition-colors">Simulations</Link></li>
              <li><Link href="/sandbox" className="hover:text-slate-200 transition-colors">Sandbox Lab</Link></li>
              <li><Link href="/certificates" className="hover:text-slate-200 transition-colors">Certificates</Link></li>
            </ul>
          </div>

          {/* Column: Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">Resources</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link href="/docs" className="hover:text-slate-200 transition-colors">Architecture Docs</Link></li>
              <li><Link href="/docs" className="hover:text-slate-200 transition-colors">Design System</Link></li>
              <li><Link href="/docs" className="hover:text-slate-200 transition-colors">Packet Blueprint</Link></li>
              <li><Link href="/docs" className="hover:text-slate-200 transition-colors">Pedagogy Blueprint</Link></li>
            </ul>
          </div>

          {/* Column: Technical Updates */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">Technical Updates</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Subscribe to get new networking simulation releases and live topology lab guides.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-1.5 text-xs text-[#34d399] font-mono">
                <Check className="w-4 h-4" /> Subscribed successfully!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center gap-2 pt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 bg-[#0f172a] border border-slate-800 rounded-lg text-slate-200 text-xs focus:border-[#0284c7] outline-none font-mono"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs shrink-0 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom line */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <div>© 2026 NetVision Platform. Open-source educational project.</div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
            <a href="#" className="hover:text-slate-400">Security</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export const Footer = FooterSection;

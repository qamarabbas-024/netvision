'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, Github, Twitter, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const FooterSection: React.FC = () => {
  return (
    <footer className="border-t border-[#2a2e39] surface-1 pt-12 sm:pt-16 pb-8 sm:pb-12 text-sm text-[#8e95a5] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 sm:gap-12 mb-8 sm:mb-12">
        {/* Brand Column */}
        <div className="sm:col-span-2 md:col-span-4 flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2563eb] flex items-center justify-center text-white shadow-sm">
              <Activity className="w-4 h-4 font-bold" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-[#f4f5f7]">
              Net<span className="text-[#38bdf8]">Vision</span>
            </span>
          </Link>
          <p className="text-xs text-[#8e95a5] leading-relaxed max-w-sm">
            Learn networking by seeing how it works. Free interactive computer networking education and deterministic packet simulation.
          </p>
          <div className="flex items-center gap-2.5 text-[#8e95a5]">
            <a href="https://github.com/qamarabbas-024/netvision" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-[#14151a] border border-[#2a2e39] hover:text-[#f4f5f7] transition-colors" aria-label="GitHub">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-[#14151a] border border-[#2a2e39] hover:text-[#f4f5f7] transition-colors" aria-label="Twitter">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-[#14151a] border border-[#2a2e39] hover:text-[#f4f5f7] transition-colors" aria-label="LinkedIn">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="sm:col-span-1 md:col-span-2 flex flex-col gap-3">
          <h4 className="text-xs font-mono font-bold uppercase text-[#f4f5f7] tracking-wider">Platform</h4>
          <Link href="/courses" className="text-xs hover:text-[#38bdf8] transition-colors py-0.5">Course Catalog</Link>
          <Link href="/simulations" className="text-xs hover:text-[#38bdf8] transition-colors py-0.5">Simulations</Link>
          <Link href="/sandbox" className="text-xs hover:text-[#38bdf8] transition-colors py-0.5">Sandbox Lab</Link>
          <Link href="/certificates" className="text-xs hover:text-[#38bdf8] transition-colors py-0.5">Certificates</Link>
        </div>

        {/* Architecture & Docs */}
        <div className="sm:col-span-1 md:col-span-2 flex flex-col gap-3">
          <h4 className="text-xs font-mono font-bold uppercase text-[#f4f5f7] tracking-wider">Resources</h4>
          <Link href="/docs/architecture" className="text-xs hover:text-[#38bdf8] transition-colors py-0.5">Architecture Doc</Link>
          <Link href="/docs/design-system" className="text-xs hover:text-[#38bdf8] transition-colors py-0.5">Design System</Link>
          <Link href="/docs/pedagogy-blueprint" className="text-xs hover:text-[#38bdf8] transition-colors py-0.5">Pedagogy Blueprint</Link>
          <a href="https://github.com/qamarabbas-024/netvision" target="_blank" rel="noreferrer" className="text-xs hover:text-[#38bdf8] transition-colors py-0.5">GitHub Repository</a>
        </div>

        {/* Newsletter Signup */}
        <div className="sm:col-span-2 md:col-span-4 flex flex-col gap-3">
          <h4 className="text-xs font-mono font-bold uppercase text-[#f4f5f7] tracking-wider">Technical Updates</h4>
          <p className="text-xs text-[#8e95a5] leading-relaxed">Get notified when new networking simulation modules and protocol analyzers launch.</p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Input placeholder="Enter email address" className="py-2 text-xs w-full" />
            <Button variant="primary" size="sm" className="shrink-0 justify-center">Subscribe</Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-[#2a2e39] flex flex-col sm:flex-row items-center justify-between text-xs text-[#646c7d] gap-4 text-center sm:text-left">
        <p>© 2026 NetVision Platform. Open-source educational project.</p>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <a href="#" className="hover:text-[#8e95a5] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#8e95a5] transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-[#8e95a5] transition-colors">Security</a>
        </div>
      </div>
    </footer>
  );
};

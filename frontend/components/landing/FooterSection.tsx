'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, Github, Twitter, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const FooterSection: React.FC = () => {
  return (
    <footer className="border-t border-[#272732]/80 glass-panel pt-16 pb-12 text-sm text-zinc-400">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
        {/* Brand Column */}
        <div className="md:col-span-4 flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00f0ff] to-[#3b82f6] flex items-center justify-center shadow-glow-cyan">
              <Activity className="w-5 h-5 text-black font-bold" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              Net<span className="text-[#00f0ff]">Vision</span>
            </span>
          </Link>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
            Learn Networking by Seeing It. The world's premier free interactive computer networking learning platform.
          </p>
          <div className="flex items-center gap-3 text-zinc-400">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white/5 hover:text-white transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white/5 hover:text-white transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white/5 hover:text-white transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-2 flex flex-col gap-3">
          <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider">Platform</h4>
          <Link href="/courses" className="text-xs hover:text-[#00f0ff] transition-colors">Course Catalog</Link>
          <Link href="/simulations" className="text-xs hover:text-[#00f0ff] transition-colors">Simulations</Link>
          <Link href="/sandbox" className="text-xs hover:text-[#00f0ff] transition-colors">Sandbox Lab</Link>
          <Link href="/certificates" className="text-xs hover:text-[#00f0ff] transition-colors">Certificates</Link>
        </div>

        {/* Architecture & Docs */}
        <div className="md:col-span-2 flex flex-col gap-3">
          <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider">Resources</h4>
          <Link href="/docs/architecture" className="text-xs hover:text-[#00f0ff] transition-colors">Architecture Doc</Link>
          <Link href="/docs/design-system" className="text-xs hover:text-[#00f0ff] transition-colors">Design System</Link>
          <Link href="/docs/pedagogy-blueprint" className="text-xs hover:text-[#00f0ff] transition-colors">Pedagogy Blueprint</Link>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="text-xs hover:text-[#00f0ff] transition-colors">GitHub Repo</a>
        </div>

        {/* Newsletter Signup */}
        <div className="md:col-span-4 flex flex-col gap-3">
          <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider">Stay Updated</h4>
          <p className="text-xs text-zinc-400">Get notified when new networking simulations & security labs drop.</p>
          <div className="flex items-center gap-2">
            <Input placeholder="Enter your email" className="py-2 text-xs" />
            <Button variant="cyan" size="sm">Subscribe</Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-[#272732]/60 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
        <p>© 2026 NetVision Platform. Open-source educational project.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-zinc-300">Privacy Policy</a>
          <a href="#" className="hover:text-zinc-300">Terms of Service</a>
          <a href="#" className="hover:text-zinc-300">Security</a>
        </div>
      </div>
    </footer>
  );
};

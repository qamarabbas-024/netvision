'use client';

import React from 'react';
import Link from 'next/link';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { NetVisionLogoIcon } from '@/components/ui/Navigation';

export const FooterSection: React.FC = () => {
  return (
    <footer className="border-t border-[#1b2230] bg-[#070a10] pt-12 pb-8 text-xs text-[#94a3b8] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 mb-10">
        {/* Brand Column */}
        <div className="sm:col-span-2 md:col-span-4 flex flex-col gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#0c121e] border border-[#1e293b] flex items-center justify-center group-hover:border-[#22c55e]/50 transition-colors">
              <NetVisionLogoIcon className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-white font-sans">
              Net<span className="text-[#22c55e]">Vision</span>
            </span>
          </Link>
          <p className="text-xs text-[#94a3b8] leading-relaxed max-w-sm">
            Interactive networking education through real-time 3D visualization and hands-on labs.
          </p>
          <div className="flex items-center gap-2.5 text-[#94a3b8] pt-1">
            <a
              href="https://github.com/qamarabbas-024/netvision"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg bg-[#0f172a] border border-[#1e293b] hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg bg-[#0f172a] border border-[#1e293b] hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg bg-[#0f172a] border border-[#1e293b] hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Platform Column */}
        <div className="sm:col-span-1 md:col-span-2 flex flex-col gap-2.5">
          <h4 className="text-xs font-mono font-bold text-white tracking-wider">Platform</h4>
          <Link href="/courses" className="text-xs hover:text-white transition-colors">Courses</Link>
          <Link href="/simulations" className="text-xs hover:text-white transition-colors">Simulations</Link>
          <Link href="/sandbox" className="text-xs hover:text-white transition-colors">Sandbox Lab</Link>
          <Link href="/troubleshooting" className="text-xs hover:text-white transition-colors">Troubleshooting</Link>
          <Link href="/certificates" className="text-xs hover:text-white transition-colors">Certifications</Link>
          <Link href="/docs" className="text-xs hover:text-white transition-colors">Docs</Link>
        </div>

        {/* Resources Column */}
        <div className="sm:col-span-1 md:col-span-2 flex flex-col gap-2.5">
          <h4 className="text-xs font-mono font-bold text-white tracking-wider">Resources</h4>
          <Link href="/docs/architecture" className="text-xs hover:text-white transition-colors">Architecture Doc</Link>
          <Link href="/docs/design-system" className="text-xs hover:text-white transition-colors">Design System</Link>
          <Link href="/docs/pedagogy-blueprint" className="text-xs hover:text-white transition-colors">Pedagogy Blueprint</Link>
          <a href="https://github.com/qamarabbas-024/netvision" target="_blank" rel="noreferrer" className="text-xs hover:text-white transition-colors">GitHub Repository</a>
        </div>

        {/* Legal Column */}
        <div className="sm:col-span-1 md:col-span-1 flex flex-col gap-2.5">
          <h4 className="text-xs font-mono font-bold text-white tracking-wider">Legal</h4>
          <Link href="#" className="text-xs hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="#" className="text-xs hover:text-white transition-colors">Terms of Service</Link>
          <Link href="#" className="text-xs hover:text-white transition-colors">Security</Link>
        </div>

        {/* Stay Updated Signup */}
        <div className="sm:col-span-2 md:col-span-3 flex flex-col gap-2.5">
          <h4 className="text-xs font-mono font-bold text-white tracking-wider">Stay Updated</h4>
          <p className="text-xs text-[#94a3b8] leading-relaxed">Get notified when new simulations and courses launch.</p>
          <div className="flex items-center gap-2 pt-1">
            <Input placeholder="Enter your email" className="py-1.5 text-xs bg-[#0f172a] border-[#1e293b] text-white w-full" />
            <button
              type="button"
              className="px-3.5 py-1.5 rounded-lg bg-[#22c55e] text-[#062817] hover:bg-[#16a34a] font-bold text-xs shrink-0 cursor-pointer transition-colors"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-[#1b2230] flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748b] gap-3">
        <p>© 2026 NetVision Platform. Open-source educational project.</p>
      </div>
    </footer>
  );
};

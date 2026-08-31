'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  Menu,
  X,
  ChevronDown,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { SoundToggle } from '@/components/ui/SoundToggle';

interface NavigationProps {
  onOpenSignIn: () => void;
  onOpenTerminal: () => void;
  onExploreCurriculum: () => void;
  onScrollToCertifications: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  onOpenSignIn,
  onOpenTerminal,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCoursesDropdownOpen, setIsCoursesDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0b0f17]/95 backdrop-blur-md border-b border-[#1e293b]/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left: Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-[#10b981]/15 border border-[#10b981]/40 flex items-center justify-center group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all">
              <svg className="w-5 h-5 text-[#34d399]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 18V6l12 12V6" />
              </svg>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-[#34d399] transition-colors">
              Net<span className="text-[#34d399]">Vision</span>
            </span>
          </Link>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-sans text-sm font-medium text-slate-300">
            {/* Courses Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsCoursesDropdownOpen(true)}
              onMouseLeave={() => setIsCoursesDropdownOpen(false)}
            >
              <Link
                href="/courses"
                className="flex items-center gap-1 hover:text-[#34d399] transition-colors py-2"
              >
                <span>Courses</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              {isCoursesDropdownOpen && (
                <div className="absolute top-full left-0 w-64 p-2 bg-[#0b1320] border border-slate-800 rounded-xl shadow-2xl animate-fadeIn z-50">
                  <Link
                    href="/courses"
                    className="block p-2 rounded-lg hover:bg-slate-800/80 text-xs font-semibold text-white"
                  >
                    <div className="text-emerald-400 font-mono">Catalog Overview</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">Explore all 38 networking courses across 7 core pathways</div>
                  </Link>
                  <Link
                    href="/courses/net-101-digital-foundations"
                    className="block p-2 rounded-lg hover:bg-slate-800/80 text-xs font-semibold text-white"
                  >
                    <div className="text-cyan-400 font-mono">NET-101 Foundations</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">Digital &amp; Physical Network Foundations</div>
                  </Link>
                  <Link
                    href="/courses/net-201-layer2-ethernet"
                    className="block p-2 rounded-lg hover:bg-slate-800/80 text-xs font-semibold text-white"
                  >
                    <div className="text-purple-400 font-mono">NET-201 Switching</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">Layer 2 Ethernet &amp; Architecture</div>
                  </Link>
                </div>
              )}
            </div>

            <Link href="/simulations" className="hover:text-[#34d399] transition-colors">
              Simulations
            </Link>

            <Link href="/sandbox" className="hover:text-[#34d399] transition-colors">
              Sandbox Lab
            </Link>

            <Link href="/troubleshooting" className="hover:text-[#34d399] transition-colors">
              Troubleshooting
            </Link>

            <Link href="/certificates" className="hover:text-[#34d399] transition-colors">
              Certifications
            </Link>

            <Link href="/docs" className="hover:text-[#34d399] transition-colors">
              Docs
            </Link>
          </nav>

          {/* Right: Sound Toggle + Matrix Pulse Badge + Start Learning CTA */}
          <div className="hidden sm:flex items-center gap-3">
            {/* SFX Sound Toggle */}
            <SoundToggle />

            {/* Matrix Pulse Badge */}
            <button
              onClick={onOpenTerminal}
              className="px-3 py-1.5 rounded-full bg-[#06151b] hover:bg-[#09222b] border border-[#10b981]/50 hover:border-[#10b981] text-[#34d399] text-xs font-mono font-semibold flex items-center gap-2 shadow-[0_0_12px_rgba(16,185,129,0.2)] transition-all cursor-pointer"
              title="Launch interactive NetVision OS terminal"
            >
              <Activity className="w-3.5 h-3.5 text-[#34d399] animate-pulse" />
              <span>Matrix pulse</span>
            </button>

            {/* Start Learning Emerald CTA */}
            <Link
              href="/courses"
              className="px-5 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-[#051a14] hover:text-white font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Start Learning
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0b0f17] px-4 pt-4 pb-6 space-y-3 font-sans">
          <Link
            href="/courses"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-slate-200 hover:text-[#34d399] text-sm font-semibold"
          >
            Courses Catalog
          </Link>
          <Link
            href="/simulations"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-slate-200 hover:text-[#34d399] text-sm font-semibold"
          >
            Simulations
          </Link>
          <Link
            href="/sandbox"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-slate-200 hover:text-[#34d399] text-sm font-semibold"
          >
            Sandbox Lab
          </Link>
          <Link
            href="/troubleshooting"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-slate-200 hover:text-[#34d399] text-sm font-semibold"
          >
            Troubleshooting
          </Link>
          <Link
            href="/certificates"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-slate-200 hover:text-[#34d399] text-sm font-semibold"
          >
            Certifications
          </Link>
          <Link
            href="/docs"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-slate-200 hover:text-[#34d399] text-sm font-semibold"
          >
            Documentation
          </Link>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenTerminal();
              }}
              className="w-full py-2.5 rounded-xl bg-[#06151b] border border-[#10b981]/50 text-[#34d399] font-mono text-xs font-bold flex items-center justify-center gap-2"
            >
              <Terminal className="w-4 h-4" />
              <span>Launch Matrix Terminal</span>
            </button>
            <Link
              href="/courses"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#10b981] text-[#051a14] font-bold text-xs text-center"
            >
              Start Learning
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

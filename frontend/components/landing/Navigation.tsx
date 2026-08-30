'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, LayoutGrid } from 'lucide-react';

interface NavigationProps {
  onOpenSignIn: () => void;
  onOpenTerminal: () => void;
  onExploreCurriculum: () => void;
  onScrollToCertifications: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  onOpenSignIn,
  onOpenTerminal,
  onExploreCurriculum,
  onScrollToCertifications,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0f17]/95 backdrop-blur-md border-b border-[#1e293b]/70 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Stylized N glyph network icon */}
            <div className="relative w-7 h-7 rounded-lg bg-[#10b981]/15 border border-[#10b981]/40 flex items-center justify-center transition-transform group-hover:scale-105 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              <svg className="w-4 h-4 text-[#34d399]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 18V6l12 12V6" />
                <circle cx="6" cy="6" r="1.5" fill="#06b6d4" />
                <circle cx="6" cy="18" r="1.5" fill="#06b6d4" />
                <circle cx="18" cy="6" r="1.5" fill="#06b6d4" />
                <circle cx="18" cy="18" r="1.5" fill="#06b6d4" />
              </svg>
            </div>
            <span className="text-base font-bold tracking-tight text-white font-sans">
              Net<span className="text-[#34d399]">Vision</span>
            </span>
          </Link>
        </div>

        {/* Desktop Primary Nav Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-4 text-xs lg:text-sm font-medium text-slate-300">
          <button
            onClick={onExploreCurriculum}
            className="px-2.5 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            Courses
          </button>
          <a
            href="#live-observatory-section"
            className="px-2.5 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            Simulations
          </a>
          <button
            onClick={onOpenTerminal}
            className="px-2.5 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            Sandbox Lab
          </button>
          <a
            href="#live-observatory-section"
            className="px-2.5 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            Troubleshooting
          </a>
          <button
            onClick={onScrollToCertifications}
            className="px-2.5 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            Certifications
          </button>
          <Link
            href="/docs"
            className="px-2.5 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            Docs
          </Link>
        </nav>

        {/* Right Nav Utilities */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Matrix button */}
          <button
            onClick={onOpenTerminal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-slate-300 bg-[#0f172a] border border-slate-800 hover:border-slate-700 rounded-lg transition-colors shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
            <span>Matrix</span>
            <LayoutGrid className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Sign In */}
          <button
            id="nav-signin-btn"
            onClick={onOpenSignIn}
            className="px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
          >
            Sign In
          </button>

          {/* Start Learning (Emerald Accent) */}
          <button
            id="nav-start-learning-btn"
            onClick={onExploreCurriculum}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-[#10b981] hover:bg-[#059669] text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Start Learning
          </button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={onOpenTerminal}
            className="p-1.5 text-slate-300 bg-[#0f172a] border border-slate-800 rounded-lg text-xs"
          >
            <LayoutGrid className="w-4 h-4 text-emerald-400" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#1e293b] bg-[#0b0f17] px-4 pt-2 pb-6 space-y-3 font-sans">
          <button
            onClick={() => {
              onExploreCurriculum();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm text-slate-200 font-medium"
          >
            Courses
          </button>
          <a
            href="#live-observatory-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left py-2 text-sm text-slate-200 font-medium"
          >
            Simulations
          </a>
          <button
            onClick={() => {
              onOpenTerminal();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm text-slate-200 font-medium"
          >
            Sandbox Lab
          </button>
          <a
            href="#live-observatory-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left py-2 text-sm text-slate-200 font-medium"
          >
            Troubleshooting
          </a>
          <button
            onClick={() => {
              onScrollToCertifications();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm text-slate-200 font-medium"
          >
            Certifications
          </button>
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenSignIn();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-center text-sm font-semibold rounded-lg bg-slate-800 text-white"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                onExploreCurriculum();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-center text-sm font-bold rounded-lg bg-[#10b981] text-slate-950"
            >
              Start Learning
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

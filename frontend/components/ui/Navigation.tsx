'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { ThemeSwitcher } from './ThemeSwitcher';

export interface NavItem {
  label: string;
  href: string;
}

export const defaultNavItems: NavItem[] = [
  { label: 'Courses', href: '/courses' },
  { label: 'Simulations', href: '/simulations' },
  { label: 'Sandbox Lab', href: '/sandbox' },
  { label: 'Troubleshooting', href: '/troubleshooting' },
  { label: 'Certifications', href: '/certificates' },
  { label: 'Docs', href: '/docs' },
];

export const NetVisionLogoIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M6 24V8L16 18V8"
      stroke="#22c55e"
      strokeWidth="2.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 24V14L26 24V8"
      stroke="#22d3ee"
      strokeWidth="2.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="6" cy="8" r="2.25" fill="#22c55e" />
    <circle cx="16" cy="18" r="2.25" fill="#22d3ee" />
    <circle cx="26" cy="24" r="2.25" fill="#22c55e" />
    <circle cx="26" cy="8" r="2.25" fill="#22d3ee" />
  </svg>
);

export const Navbar: React.FC<{ items?: NavItem[] }> = ({ items = defaultNavItems }) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070a10]/95 backdrop-blur-md border-b border-[#1b2230] px-4 sm:px-6 py-2.5 transition-all font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#0c121e] border border-[#1e293b] flex items-center justify-center group-hover:border-[#22c55e]/50 transition-colors">
            <NetVisionLogoIcon className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-white font-sans">
            Net<span className="text-[#22c55e]">Vision</span>
          </span>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold font-mono">
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'transition-colors relative py-1',
                  isActive ? 'text-[#22c55e] font-bold' : 'text-[#94a3b8] hover:text-white'
                )}
              >
                {item.label}
                {isActive ? (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#22c55e] rounded-full" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Action CTAs + Theme Switcher */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeSwitcher />
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-[#94a3b8] hover:text-white border border-[#1e293b] hover:border-[#334155] bg-[#0c1017] px-3 py-1.5 rounded-lg"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/courses">
            <button
              type="button"
              className="px-4 py-1.5 rounded-lg bg-[#22c55e] text-[#062817] hover:bg-[#16a34a] font-bold text-xs transition-all shadow-sm cursor-pointer"
            >
              Start Learning
            </button>
          </Link>
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeSwitcher compact />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-[#94a3b8] hover:text-white p-2 rounded-lg bg-[#0c1017] border border-[#1e293b] cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden pt-4 pb-4 border-t border-[#1e293b] mt-3 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            {items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'text-xs font-semibold px-3 py-2.5 rounded-lg transition-all flex items-center justify-between font-mono',
                    isActive
                      ? 'bg-[#0c121e] text-[#22c55e] border border-[#22c55e]/30 font-bold'
                      : 'text-[#94a3b8] hover:text-white hover:bg-[#0c1017]'
                  )}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-[#1e293b]">
            <Link href="/login" onClick={() => setMobileOpen(false)}>
              <Button variant="secondary" size="sm" className="w-full justify-center text-xs">
                Sign In
              </Button>
            </Link>
            <Link href="/courses" onClick={() => setMobileOpen(false)}>
              <button
                type="button"
                className="w-full py-2.5 rounded-lg bg-[#22c55e] text-[#062817] hover:bg-[#16a34a] font-bold text-xs transition-colors cursor-pointer"
              >
                Start Learning
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

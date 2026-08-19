'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Menu, X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export interface NavItem {
  label: string;
  href: string;
}

export const defaultNavItems: NavItem[] = [
  { label: 'Courses', href: '/courses' },
  { label: 'Simulations', href: '/simulations' },
  { label: 'Sandbox Lab', href: '/sandbox' },
  { label: 'Docs', href: '/docs' },
];

export const Navbar: React.FC<{ items?: NavItem[] }> = ({ items = defaultNavItems }) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-[#272732]/60 px-4 sm:px-6 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-[#00f0ff] to-[#3b82f6] flex items-center justify-center shadow-glow-cyan group-hover:scale-105 transition-transform shrink-0">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-black font-bold" />
          </div>
          <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
            Net<span className="text-[#00f0ff]">Vision</span>
          </span>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'transition-colors relative py-1',
                  isActive ? 'text-[#00f0ff] font-semibold' : 'text-zinc-400 hover:text-white'
                )}
              >
                {item.label}
                {isActive ? (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00f0ff] shadow-glow-cyan rounded-full" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Action CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/courses">
            <Button variant="cyan" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Start Learning
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-zinc-400 hover:text-white p-2.5 rounded-xl bg-white/5 border border-[#272732]"
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden pt-4 pb-4 border-t border-[#272732] mt-3 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1">
            {items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'text-sm font-semibold px-3 py-2.5 rounded-xl transition-all min-h-[44px] flex items-center justify-between',
                    isActive
                      ? 'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5'
                  )}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#00f0ff]" />}
                </Link>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 pt-3 border-t border-[#272732]">
            <Link href="/login" onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" className="w-full justify-center min-h-[44px]">
                Sign In
              </Button>
            </Link>
            <Link href="/courses" onClick={() => setMobileOpen(false)}>
              <Button variant="cyan" className="w-full justify-center min-h-[44px]">
                Start Learning
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

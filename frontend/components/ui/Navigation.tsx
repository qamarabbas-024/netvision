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
  { label: 'Docs & Arch', href: '/docs' },
];

export const Navbar: React.FC<{ items?: NavItem[] }> = ({ items = defaultNavItems }) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-[#272732]/60 px-6 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00f0ff] to-[#3b82f6] flex items-center justify-center shadow-glow-cyan group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5 text-black font-bold" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">
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
          <Link href="/register">
            <Button variant="cyan" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Get Started Free
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-zinc-400 hover:text-white p-2"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden pt-4 pb-6 border-t border-[#272732] mt-4 flex flex-col gap-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="text-base text-zinc-300 hover:text-[#00f0ff] font-medium px-2 py-1"
            >
              {item.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#272732]">
            <Link href="/login" onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Sign In
              </Button>
            </Link>
            <Link href="/register" onClick={() => setMobileOpen(false)}>
              <Button variant="cyan" className="w-full justify-center">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

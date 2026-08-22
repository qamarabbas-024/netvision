'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Menu, X, ArrowRight } from 'lucide-react';
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
  { label: 'Docs', href: '/docs' },
];

export const Navbar: React.FC<{ items?: NavItem[] }> = ({ items = defaultNavItems }) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--surface-1)]/95 backdrop-blur-md border-b border-[var(--border-hairline)] px-4 sm:px-6 py-3 transition-all font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center shadow-sm group-hover:opacity-90 transition-opacity shrink-0">
            <Activity className="w-4 h-4 text-white font-bold" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-[var(--foreground)]">
            Net<span className="text-[var(--accent-cyan)]">Vision</span>
          </span>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider font-mono">
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'transition-colors relative py-1',
                  isActive ? 'text-[var(--accent-cyan)] font-bold' : 'text-[var(--text-muted)] hover:text-[var(--foreground)]'
                )}
              >
                {item.label}
                {isActive ? (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-cyan)] rounded-full" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Action CTAs + Theme Switcher */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeSwitcher />
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/courses">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Start Learning
            </Button>
          </Link>
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeSwitcher compact />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-[var(--text-muted)] hover:text-[var(--foreground)] p-2 rounded-lg bg-[var(--surface-3)] border border-[var(--border-hairline)] cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden pt-4 pb-4 border-t border-[var(--border-hairline)] mt-3 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            {items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'text-xs font-semibold px-3 py-2.5 rounded-lg transition-all flex items-center justify-between',
                    isActive
                      ? 'bg-[var(--surface-3)] text-[var(--accent-cyan)] border border-[var(--border-hairline)] font-bold'
                      : 'text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)]'
                  )}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border-hairline)]">
            <Link href="/login" onClick={() => setMobileOpen(false)}>
              <Button variant="secondary" size="sm" className="w-full justify-center">
                Sign In
              </Button>
            </Link>
            <Link href="/courses" onClick={() => setMobileOpen(false)}>
              <Button variant="primary" size="sm" className="w-full justify-center">
                Start Learning
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

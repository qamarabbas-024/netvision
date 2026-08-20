'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Cpu,
  Box,
  Award,
  User,
  Settings,
  ShieldAlert,
  Wrench,
  LogOut,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

export interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

export const sidebarItems: SidebarItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Course Catalog', href: '/courses', icon: <BookOpen className="w-4 h-4" /> },
  { label: 'Troubleshooting', href: '/troubleshooting', icon: <Wrench className="w-4 h-4" /> },
  { label: 'Command Library', href: '/commands', icon: <Cpu className="w-4 h-4" /> },
  { label: 'Practical Labs', href: '/labs', icon: <Box className="w-4 h-4" /> },
  { label: 'Simulations', href: '/simulations', icon: <Cpu className="w-4 h-4" /> },
  { label: 'Sandbox Lab', href: '/sandbox', icon: <Box className="w-4 h-4" /> },
  { label: 'Achievements', href: '/achievements', icon: <Award className="w-4 h-4" /> },
  { label: 'Profile', href: '/profile', icon: <User className="w-4 h-4" /> },
  { label: 'Settings', href: '/settings', icon: <Settings className="w-4 h-4" /> },
  { label: 'Admin Panel', href: '/admin', icon: <ShieldAlert className="w-4 h-4" />, adminOnly: true },
];

export const AppSidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const filteredItems = sidebarItems.filter(
    (item) => !item.adminOnly || (user && user.role === 'ADMIN')
  );

  return (
    <aside className="hidden md:flex w-64 h-screen sticky top-0 bg-[#16181f] border-r border-[#2a2e39] p-4 flex-col justify-between shrink-0 font-sans">
      <div className="flex flex-col gap-6">
        {/* Brand */}
        <Link href="/dashboard" className="flex items-center gap-3 px-2 py-1">
          <div className="w-8 h-8 rounded-lg bg-[#2563eb] flex items-center justify-center shadow-sm">
            <Cpu className="w-4 h-4 text-white font-bold" />
          </div>
          <span className="font-extrabold text-base text-[#f4f5f7] tracking-tight">NetVision</span>
        </Link>

        {/* Navigation Section */}
        <div className="flex flex-col gap-1">
          <span className="px-3 text-[10px] font-mono font-semibold uppercase text-[#646c7d] tracking-wider mb-1">
            NAVIGATION
          </span>
          {filteredItems.map((item) => {
            const isActive = !!pathname && (pathname === item.href || pathname.startsWith(item.href + '/'));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all',
                  isActive
                    ? 'bg-[#14151a] text-[#38bdf8] border border-[#2a2e39] font-bold shadow-inner'
                    : 'text-[#8e95a5] hover:text-[#f4f5f7] hover:bg-[#1b1e26] border border-transparent'
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Logout Action */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-[#f87171] hover:bg-[#ef4444]/10 transition-colors w-full cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span>Log Out</span>
      </button>
    </aside>
  );
};

export const MobileSidebarDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  if (!isOpen) return null;

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const filteredItems = sidebarItems.filter(
    (item) => !item.adminOnly || (user && user.role === 'ADMIN')
  );

  return (
    <div className="fixed inset-0 z-50 flex md:hidden font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-72 max-w-[85vw] h-full bg-[#16181f] border-r border-[#2a2e39] p-5 flex flex-col justify-between shadow-elevated z-10">
        <div className="flex flex-col gap-6">
          {/* Header with Close */}
          <div className="flex items-center justify-between">
            <Link href="/dashboard" onClick={onClose} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#2563eb] flex items-center justify-center">
                <Cpu className="w-4 h-4 text-white font-bold" />
              </div>
              <span className="font-extrabold text-base text-[#f4f5f7]">NetVision</span>
            </Link>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#14151a] border border-[#2a2e39] text-[#8e95a5] hover:text-[#f4f5f7]"
              aria-label="Close navigation menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-200px)]">
            <span className="px-3 text-[10px] font-mono font-semibold uppercase text-[#646c7d] tracking-wider mb-1">
              NAVIGATION
            </span>
            {filteredItems.map((item) => {
              const isActive = !!pathname && (pathname === item.href || pathname.startsWith(item.href + '/'));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all',
                    isActive
                      ? 'bg-[#14151a] text-[#38bdf8] border border-[#2a2e39] font-bold'
                      : 'text-[#8e95a5] hover:text-[#f4f5f7] hover:bg-[#1b1e26]'
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-[#f87171] hover:bg-[#ef4444]/10 transition-colors w-full cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

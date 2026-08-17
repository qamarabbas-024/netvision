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
    <aside className="hidden md:flex w-64 h-screen sticky top-0 glass-panel border-r border-[#272732]/60 p-4 flex-col justify-between shrink-0">
      <div className="flex flex-col gap-6">
        {/* Brand */}
        <Link href="/dashboard" className="flex items-center gap-3 px-2 py-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#00f0ff] to-[#3b82f6] flex items-center justify-center shadow-glow-cyan">
            <Cpu className="w-4 h-4 text-black font-bold" />
          </div>
          <span className="font-extrabold text-lg text-white">NetVision</span>
        </Link>

        {/* Navigation Section */}
        <div className="flex flex-col gap-1">
          <span className="px-3 text-[10px] font-semibold uppercase text-zinc-500 tracking-wider mb-1">
            Menu
          </span>
          {filteredItems.map((item) => {
            const isActive = !!pathname && (pathname === item.href || pathname.startsWith(item.href + '/'));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all',
                  isActive
                    ? 'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 shadow-glow-cyan'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
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
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors w-full cursor-pointer"
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
    <div className="fixed inset-0 z-50 md:hidden flex">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-72 max-w-[85vw] h-full bg-[#121217] border-r border-[#272732] p-5 flex flex-col justify-between z-10 overflow-y-auto">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" onClick={onClose} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#00f0ff] to-[#3b82f6] flex items-center justify-center shadow-glow-cyan">
                <Cpu className="w-4 h-4 text-black font-bold" />
              </div>
              <span className="font-extrabold text-lg text-white">NetVision</span>
            </Link>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <span className="px-3 text-[10px] font-semibold uppercase text-zinc-500 tracking-wider mb-1">
              Menu
            </span>
            {filteredItems.map((item) => {
              const isActive = !!pathname && (pathname === item.href || pathname.startsWith(item.href + '/'));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all',
                    isActive
                      ? 'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 shadow-glow-cyan'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors w-full cursor-pointer mt-6"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

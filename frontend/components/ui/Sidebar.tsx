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
  LogOut,
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
    <aside className="w-64 h-screen sticky top-0 glass-panel border-r border-[#272732]/60 p-4 flex flex-col justify-between shrink-0">
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
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
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

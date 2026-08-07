'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useAuthStore } from '@/stores/authStore';

export default function SettingsPage() {
  const { user } = useAuthStore();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar />

          <main className="p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
            <div className="max-w-4xl mx-auto flex flex-col gap-8">
              <div>
                <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest font-semibold block mb-1">
                  Preferences & Security
                </span>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  Account Settings
                </h1>
              </div>

              <Card className="p-8 flex flex-col gap-6">
                <h2 className="text-lg font-bold text-white border-b border-[#272732] pb-3">Profile Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Full Name" defaultValue={user?.fullName || 'Alex Rivers'} />
                  <Input label="Username" defaultValue={user?.username || 'alex_netrunner'} />
                  <Input label="Email Address" defaultValue={user?.email || 'alex@university.edu'} type="email" />
                </div>

                <div className="flex justify-end">
                  <Button variant="cyan">Save Changes</Button>
                </div>
              </Card>

              <Card className="p-8 flex flex-col gap-6">
                <h2 className="text-lg font-bold text-white border-b border-[#272732] pb-3">Theme & Appearance</h2>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Interface Theme Mode</h3>
                    <p className="text-xs text-zinc-400">Toggle between Dark Mode (Default) and Light Mode</p>
                  </div>
                  <ThemeToggle />
                </div>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

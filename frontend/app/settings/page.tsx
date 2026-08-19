'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useAuthStore } from '@/stores/authStore';
import { GuestProgressService } from '@/services/GuestProgressService';
import { ShieldCheck, User, LogOut, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [clearedGuest, setClearedGuest] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleClearGuestCache = () => {
    GuestProgressService.clearAllGuestData();
    GuestProgressService.resetLearnerId();
    setClearedGuest(true);
    setTimeout(() => setClearedGuest(false), 3000);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar />

          <main className="p-4 sm:p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
            <div className="max-w-4xl mx-auto flex flex-col gap-6 sm:gap-8">
              <div>
                <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest font-semibold block mb-1">
                  Preferences & Security
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Account & Session Settings
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Manage active authenticated session identity, interface themes, and local storage cache.
                </p>
              </div>

              {/* Profile Information */}
              <Card className="p-5 sm:p-8 flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-[#272732] pb-3">
                  <div className="flex items-center gap-2.5">
                    <User className="w-5 h-5 text-[#00f0ff]" />
                    <h2 className="text-base sm:text-lg font-bold text-white">Learner Identity</h2>
                  </div>
                  <Badge variant={isAuthenticated ? 'cyan' : 'neutral'}>
                    {isAuthenticated ? (user?.role === 'ADMIN' ? 'Administrator' : 'Verified Learner') : 'Guest Session'}
                  </Badge>
                </div>

                <form onSubmit={handleSavePreferences} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      defaultValue={user?.fullName || ''}
                      placeholder="Your full name"
                      disabled={!isAuthenticated}
                    />
                    <Input
                      label="Username"
                      defaultValue={user?.username || (isAuthenticated ? 'learner' : 'guest_user')}
                      placeholder="your_username"
                      disabled
                    />
                    <Input
                      label="Email Address"
                      defaultValue={user?.email || (isAuthenticated ? 'learner@netvision.internal' : 'guest@local.session')}
                      type="email"
                      placeholder="your.email@example.com"
                      disabled
                    />
                    <Input
                      label="Account Role"
                      defaultValue={user?.role || (isAuthenticated ? 'STUDENT' : 'GUEST')}
                      disabled
                    />
                  </div>

                  {saveSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Preferences updated successfully.
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button variant="cyan" type="submit" className="w-full sm:w-auto">
                      Save Profile
                    </Button>
                  </div>
                </form>
              </Card>

              {/* Theme & Appearance */}
              <Card className="p-5 sm:p-8 flex flex-col gap-6">
                <h2 className="text-base sm:text-lg font-bold text-white border-b border-[#272732] pb-3">Theme & Appearance</h2>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Interface Theme Mode</h3>
                    <p className="text-xs text-zinc-400">Toggle between Dark Technical Mode (Default) and Light Mode</p>
                  </div>
                  <ThemeToggle />
                </div>
              </Card>

              {/* Session Security & Authentication */}
              <Card className="p-5 sm:p-8 flex flex-col gap-6">
                <div className="flex items-center gap-2.5 border-b border-[#272732] pb-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-base sm:text-lg font-bold text-white">Security & Active Session</h2>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#121217] border border-[#272732]">
                  <div>
                    <div className="text-xs font-bold text-white">Current Session Status</div>
                    <div className="text-xs text-zinc-400 font-mono mt-0.5">
                      {isAuthenticated ? `Authenticated as ${user?.email || user?.username}` : 'Local Anonymous Guest Session'}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout} leftIcon={<LogOut className="w-4 h-4" />} className="text-rose-400 hover:text-rose-300">
                    Sign Out
                  </Button>
                </div>
              </Card>

              {/* Danger Zone */}
              <Card className="p-5 sm:p-8 flex flex-col gap-6 border-rose-500/30 bg-rose-500/5">
                <div className="flex items-center gap-2.5 border-b border-rose-500/20 pb-3">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                  <h2 className="text-base sm:text-lg font-bold text-white">Danger Zone</h2>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">Clear Local Guest Storage</h3>
                    <p className="text-xs text-zinc-400 max-w-md">
                      Purges local device storage cache and rotates anonymous guest session tokens.
                    </p>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleClearGuestCache}
                    leftIcon={<Trash2 className="w-4 h-4" />}
                    className="shrink-0"
                  >
                    {clearedGuest ? 'Cache Purged! ✓' : 'Clear Local Cache'}
                  </Button>
                </div>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}


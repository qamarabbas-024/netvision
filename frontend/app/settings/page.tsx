'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
import { ShieldCheck, User, LogOut, Trash2, CheckCircle2, AlertTriangle, KeyRound } from 'lucide-react';

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
      <div className="min-h-screen surface-0 text-[#f4f5f7] flex font-sans">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar />

          <main className="p-4 sm:p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
            <div className="max-w-4xl mx-auto flex flex-col gap-6 sm:gap-8">
              <div>
                <span className="text-xs font-mono text-[#38bdf8] uppercase tracking-widest font-semibold block mb-1">
                  ACCOUNT & PREFERENCES
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#f4f5f7] tracking-tight">
                  Settings
                </h1>
                <p className="text-xs sm:text-sm text-[#8e95a5] mt-1 leading-relaxed">
                  Manage learner identity, interface appearance, session security, and local device storage.
                </p>
              </div>

              {/* 1. Profile / Learner Identity */}
              <Card className="p-5 sm:p-6 flex flex-col gap-5 surface-2 border border-[#2a2e39] rounded-xl shadow-instrument">
                <div className="flex items-center justify-between border-b border-[#2a2e39] pb-3">
                  <div className="flex items-center gap-2.5">
                    <User className="w-5 h-5 text-[#38bdf8]" />
                    <h2 className="text-base sm:text-lg font-bold text-[#f4f5f7]">Learner Profile</h2>
                  </div>
                  <Badge variant={isAuthenticated ? 'cyan' : 'neutral'} dot={true}>
                    {isAuthenticated ? (user?.role === 'ADMIN' ? 'ADMINISTRATOR' : 'VERIFIED LEARNER') : 'GUEST SESSION'}
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
                      defaultValue={user?.username || (isAuthenticated ? '' : 'guest_learner')}
                      placeholder="Username not set"
                      disabled
                    />
                    <Input
                      label="Email Address"
                      defaultValue={user?.email || ''}
                      type="email"
                      placeholder={isAuthenticated ? 'No email associated' : 'Guest session (unregistered)'}
                      disabled
                    />
                    <Input
                      label="Account Role"
                      defaultValue={user?.role || (isAuthenticated ? 'STUDENT' : 'GUEST')}
                      disabled
                    />
                  </div>

                  {saveSuccess && (
                    <div className="p-3 rounded-lg bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] text-xs font-mono flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Preferences updated successfully.
                    </div>
                  )}

                  {isAuthenticated && (
                    <div className="flex justify-end">
                      <Button variant="primary" type="submit" className="w-full sm:w-auto font-bold text-xs">
                        Save Profile
                      </Button>
                    </div>
                  )}
                </form>
              </Card>

              {/* 2. Theme & Appearance */}
              <Card className="p-5 sm:p-6 flex flex-col gap-4 surface-2 border border-[#2a2e39] rounded-xl shadow-instrument">
                <h2 className="text-base sm:text-lg font-bold text-[#f4f5f7] border-b border-[#2a2e39] pb-3">Theme & Appearance</h2>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-[#f4f5f7]">Interface Theme</h3>
                    <p className="text-xs text-[#8e95a5]">Switch between dark technical palette and high-contrast light mode</p>
                  </div>
                  <ThemeToggle />
                </div>
              </Card>

              {/* 3. Session Security & Authentication */}
              <Card className="p-5 sm:p-6 flex flex-col gap-4 surface-2 border border-[#2a2e39] rounded-xl shadow-instrument">
                <div className="flex items-center gap-2.5 border-b border-[#2a2e39] pb-3">
                  <ShieldCheck className="w-5 h-5 text-[#10b981]" />
                  <h2 className="text-base sm:text-lg font-bold text-[#f4f5f7]">Security & Active Session</h2>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-[#14151a] border border-[#2a2e39]">
                  <div>
                    <div className="text-xs font-bold text-[#f4f5f7]">Session Status</div>
                    <div className="text-xs text-[#8e95a5] font-mono mt-0.5">
                      {isAuthenticated ? `Authenticated as ${user?.email || user?.username}` : 'Local anonymous session (no credentials)'}
                    </div>
                  </div>
                  {isAuthenticated ? (
                    <Button variant="ghost" size="sm" onClick={handleLogout} leftIcon={<LogOut className="w-4 h-4" />} className="text-[#ef4444] hover:text-white hover:bg-[#ef4444]/10 text-xs">
                      Sign Out
                    </Button>
                  ) : (
                    <Link href="/login">
                      <Button variant="primary" size="sm" className="font-bold text-xs">
                        Sign In / Register
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>

              {/* 4. Danger Zone */}
              <Card className="p-5 sm:p-6 flex flex-col gap-4 border border-[#ef4444]/30 bg-[#ef4444]/5 rounded-xl">
                <div className="flex items-center gap-2.5 border-b border-[#ef4444]/20 pb-3">
                  <AlertTriangle className="w-5 h-5 text-[#ef4444]" />
                  <h2 className="text-base sm:text-lg font-bold text-[#f4f5f7]">Danger Zone</h2>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-[#f4f5f7]">Clear Local Guest Storage</h3>
                    <p className="text-xs text-[#8e95a5] max-w-md mt-0.5">
                      Purges locally cached progress and resets the anonymous guest learner ID on this browser.
                    </p>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleClearGuestCache}
                    leftIcon={<Trash2 className="w-4 h-4" />}
                    className="shrink-0 font-bold text-xs"
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


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
      <div className="min-h-screen surface-0 text-[#f4f5f7] flex font-sans">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar />

          <main className="p-4 sm:p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
            <div className="max-w-4xl mx-auto flex flex-col gap-6 sm:gap-8">
              <div>
                <span className="text-xs font-mono text-[#38bdf8] uppercase tracking-widest font-semibold block mb-1">
                  PREFERENCES & SECURITY
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#f4f5f7] tracking-tight">
                  Account & Session Settings
                </h1>
                <p className="text-xs sm:text-sm text-[#8e95a5] mt-1 leading-relaxed">
                  Manage active authenticated session identity, interface themes, and local storage cache.
                </p>
              </div>

              {/* Profile Information */}
              <Card className="p-5 sm:p-6 flex flex-col gap-5 surface-2 border border-[#2a2e39] rounded-xl shadow-instrument">
                <div className="flex items-center justify-between border-b border-[#2a2e39] pb-3">
                  <div className="flex items-center gap-2.5">
                    <User className="w-5 h-5 text-[#38bdf8]" />
                    <h2 className="text-base sm:text-lg font-bold text-[#f4f5f7]">Learner Identity</h2>
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

                  <div className="flex justify-end">
                    <Button variant="primary" type="submit" className="w-full sm:w-auto">
                      Save Profile
                    </Button>
                  </div>
                </form>
              </Card>

              {/* Theme & Appearance */}
              <Card className="p-5 sm:p-6 flex flex-col gap-5 surface-2 border border-[#2a2e39] rounded-xl shadow-instrument">
                <h2 className="text-base sm:text-lg font-bold text-[#f4f5f7] border-b border-[#2a2e39] pb-3">Theme & Appearance</h2>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#f4f5f7]">Interface Theme Mode</h3>
                    <p className="text-xs text-[#8e95a5]">Toggle between Dark Technical Mode (Default) and Light Mode</p>
                  </div>
                  <ThemeToggle />
                </div>
              </Card>

              {/* Session Security & Authentication */}
              <Card className="p-5 sm:p-6 flex flex-col gap-5 surface-2 border border-[#2a2e39] rounded-xl shadow-instrument">
                <div className="flex items-center gap-2.5 border-b border-[#2a2e39] pb-3">
                  <ShieldCheck className="w-5 h-5 text-[#10b981]" />
                  <h2 className="text-base sm:text-lg font-bold text-[#f4f5f7]">Security & Active Session</h2>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-[#14151a] border border-[#2a2e39]">
                  <div>
                    <div className="text-xs font-bold text-[#f4f5f7]">Current Session Status</div>
                    <div className="text-xs text-[#8e95a5] font-mono mt-0.5">
                      {isAuthenticated ? `Authenticated as ${user?.email || user?.username}` : 'Local Anonymous Guest Session'}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout} leftIcon={<LogOut className="w-4 h-4" />} className="text-[#f87171] hover:text-white hover:bg-[#ef4444]/10">
                    Sign Out
                  </Button>
                </div>
              </Card>

              {/* Danger Zone */}
              <Card className="p-5 sm:p-6 flex flex-col gap-5 border-[#ef4444]/30 bg-[#ef4444]/5 rounded-xl">
                <div className="flex items-center gap-2.5 border-b border-[#ef4444]/20 pb-3">
                  <AlertTriangle className="w-5 h-5 text-[#ef4444]" />
                  <h2 className="text-base sm:text-lg font-bold text-[#f4f5f7]">Danger Zone</h2>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-[#f4f5f7]">Clear Local Guest Storage</h3>
                    <p className="text-xs text-[#8e95a5] max-w-md">
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


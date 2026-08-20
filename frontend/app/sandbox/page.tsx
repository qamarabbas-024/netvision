'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { SandboxCanvas } from '@/components/sandbox/SandboxCanvas';
import { Badge } from '@/components/ui/Badge';

export default function SandboxPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen surface-0 text-[#f4f5f7] flex font-sans">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar />

          <main className="p-4 sm:p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
            <div className="max-w-7xl mx-auto flex flex-col gap-6 sm:gap-8">
              {/* Sandbox Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-[#38bdf8] uppercase tracking-widest font-semibold block mb-1">
                    TOPOLOGY WORKBENCH
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#f4f5f7] tracking-tight">
                    Interactive Network Sandbox
                  </h1>
                  <p className="text-xs sm:text-sm text-[#8e95a5] mt-1 max-w-2xl leading-relaxed">
                    Build topologies, cable interfaces, configure IP subnets, dispatch test packet streams, and verify network connectivity.
                  </p>
                </div>

                <Badge variant="cyan" dot={true} className="self-start md:self-auto">Workbench Active</Badge>
              </div>

              {/* Sandbox Canvas Component */}
              <SandboxCanvas />
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

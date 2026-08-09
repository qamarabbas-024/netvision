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
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar />

          <main className="p-4 sm:p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
            <div className="max-w-7xl mx-auto flex flex-col gap-6 sm:gap-8">
              {/* Sandbox Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest font-semibold block mb-1">
                    Visual Topology Builder
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                    Networking Sandbox Lab
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    Drag networking devices, connect Ethernet cables, configure IPs, dispatch test packet streams, and break or repair network topologies.
                  </p>
                </div>

                <Badge variant="cyan" className="self-start md:self-auto">Drag & Drop Active</Badge>
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

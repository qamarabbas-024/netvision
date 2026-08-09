'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { SimulationEngineCanvas } from '@/components/simulation/SimulationEngineCanvas';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Cpu, ShieldCheck, Activity } from 'lucide-react';

export default function SimulationsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar />

          <main className="p-4 sm:p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
            <div className="max-w-7xl mx-auto flex flex-col gap-6 sm:gap-8">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest font-semibold block mb-1">
                    Visual Simulation Engine
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                    Interactive Protocol Simulator
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    Dispatch packet streams, pause time to inspect OSI layer headers, and reconfigure network nodes.
                  </p>
                </div>

                <Badge variant="cyan" className="self-start md:self-auto">60 FPS Engine Active</Badge>
              </div>

              {/* Main Simulation Engine Canvas */}
              <SimulationEngineCanvas />

              {/* Protocol Details Information Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Activity className="w-5 h-5 text-[#00f0ff]" />
                    <h3 className="text-base font-bold text-white">TCP 3-Way Handshake</h3>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Observe how connection sequence numbers and window sizes are synchronized between client and server nodes before data transmission.
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Cpu className="w-5 h-5 text-blue-400" />
                    <h3 className="text-base font-bold text-white">ARP Table Resolution</h3>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Watch Layer 2 MAC addresses get resolved dynamically using broadcast ARP queries and unicast replies across local switches.
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <ShieldCheck className="w-5 h-5 text-rose-400" />
                    <h3 className="text-base font-bold text-white">Stateful Firewall ACL</h3>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Test stateful packet filter rules that permit established TCP sessions while blocking unauthorized external probe attempts.
                  </p>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

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
      <div className="min-h-screen surface-0 text-[#f4f5f7] flex font-sans">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar />

          <main className="p-4 sm:p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
            <div className="max-w-7xl mx-auto flex flex-col gap-6 sm:gap-8">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-[#38bdf8] uppercase tracking-widest font-semibold block mb-1">
                    PROTOCOL DISSECTION
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#f4f5f7] tracking-tight">
                    Interactive Protocol Simulator
                  </h1>
                  <p className="text-xs sm:text-sm text-[#8e95a5] mt-1 max-w-2xl leading-relaxed">
                    Dispatch packet streams, pause time to inspect OSI layer headers, and observe hardware forwarding state.
                  </p>
                </div>

                <Badge variant="cyan" dot={true} className="self-start md:self-auto">Simulation Engine Ready</Badge>
              </div>

              {/* Main Simulation Engine Canvas */}
              <SimulationEngineCanvas />

              {/* Protocol Details Information Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-5 surface-2 border border-[#2a2e39] rounded-xl shadow-instrument">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <Activity className="w-5 h-5 text-[#38bdf8]" />
                    <h3 className="text-sm font-bold text-[#f4f5f7]">TCP 3-Way Handshake</h3>
                  </div>
                  <p className="text-xs text-[#8e95a5] leading-relaxed">
                    Observe how connection sequence numbers and window sizes are synchronized between client and server nodes before data transmission.
                  </p>
                </Card>

                <Card className="p-5 surface-2 border border-[#2a2e39] rounded-xl shadow-instrument">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <Cpu className="w-5 h-5 text-[#818cf8]" />
                    <h3 className="text-sm font-bold text-[#f4f5f7]">ARP Table Resolution</h3>
                  </div>
                  <p className="text-xs text-[#8e95a5] leading-relaxed">
                    Watch Layer 2 MAC addresses get resolved dynamically using broadcast ARP queries and unicast replies across local switches.
                  </p>
                </Card>

                <Card className="p-5 surface-2 border border-[#2a2e39] rounded-xl shadow-instrument">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <ShieldCheck className="w-5 h-5 text-[#10b981]" />
                    <h3 className="text-sm font-bold text-[#f4f5f7]">Stateful Firewall ACL</h3>
                  </div>
                  <p className="text-xs text-[#8e95a5] leading-relaxed">
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

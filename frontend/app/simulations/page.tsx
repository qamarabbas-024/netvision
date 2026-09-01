'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { SimulationEngineCanvas } from '@/components/simulation/SimulationEngineCanvas';
import { TimeTravelPacketScrubber } from '@/components/simulation/TimeTravelPacketScrubber';
import { MultimodalDiagramParser } from '@/components/simulation/MultimodalDiagramParser';
import { UniversalChatHistoryImporter } from '@/components/learning/UniversalChatHistoryImporter';
import { PdfReportStudio } from '@/components/ui/PdfReportStudio';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Cpu, ShieldCheck, Activity, Image as ImageIcon, Bot, Printer, Play, Zap } from 'lucide-react';

export default function SimulationsPage() {
  const [showDiagramParser, setShowDiagramParser] = React.useState<boolean>(false);
  const [showChatImporter, setShowChatImporter] = React.useState<boolean>(false);
  const [showPdfStudio, setShowPdfStudio] = React.useState<boolean>(false);
  const [activePreset, setActivePreset] = React.useState<string>('tcp_handshake');

  const simulationPresets = [
    { id: 'tcp_handshake', label: 'TCP 3-Way Handshake', protocol: 'TCP', color: 'border-cyan-500/40 text-cyan-300' },
    { id: 'arp_broadcast', label: 'ARP Address Resolution', protocol: 'ARP', color: 'border-emerald-500/40 text-emerald-300' },
    { id: 'dns_lookup', label: 'DNS Recursive Query', protocol: 'DNS', color: 'border-purple-500/40 text-purple-300' },
    { id: 'bgp_keepalive', label: 'BGP Route Advertisement', protocol: 'BGP', color: 'border-amber-500/40 text-amber-300' },
  ];

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
                    PROTOCOL DISSECTION &amp; SIMULATION
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#f4f5f7] tracking-tight">
                    Interactive Protocol Simulator
                  </h1>
                  <p className="text-xs sm:text-sm text-[#8e95a5] mt-1 max-w-2xl leading-relaxed">
                    Dispatch packet streams, pause time to inspect OSI layer headers, and observe hardware forwarding state in 3D.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowDiagramParser(true)}
                    leftIcon={<ImageIcon className="w-3.5 h-3.5 text-[#00f0ff]" />}
                    className="text-xs font-bold"
                  >
                    Import Diagram
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowChatImporter(true)}
                    leftIcon={<Bot className="w-3.5 h-3.5 text-purple-400" />}
                    className="text-xs font-bold"
                  >
                    Import AI Chat
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowPdfStudio(true)}
                    leftIcon={<Printer className="w-3.5 h-3.5 text-emerald-400" />}
                    className="text-xs font-bold"
                  >
                    PDF Export
                  </Button>
                </div>
              </div>

              {/* Simulation Flow Quick Presets Bar */}
              <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-[#0e1017] border border-[#2a2e39] font-mono text-xs">
                <span className="text-[#8e95a5] flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider mr-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Quick Flow:
                </span>
                {simulationPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setActivePreset(preset.id)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      activePreset === preset.id
                        ? 'bg-[#10b981]/20 border-[#10b981] text-[#34d399] shadow-sm'
                        : 'bg-[#161822] border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    <span>{preset.label}</span>
                    <Badge variant="neutral" className="text-[9px] py-0 px-1">{preset.protocol}</Badge>
                  </button>
                ))}
              </div>

              {/* Modals */}
              {showDiagramParser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                  <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                    <MultimodalDiagramParser onClose={() => setShowDiagramParser(false)} />
                  </div>
                </div>
              )}

              {showChatImporter && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                  <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                    <UniversalChatHistoryImporter onClose={() => setShowChatImporter(false)} />
                  </div>
                </div>
              )}

              {showPdfStudio && (
                <PdfReportStudio isOpen={showPdfStudio} onClose={() => setShowPdfStudio(false)} />
              )}

              {/* Main Simulation Engine Canvas */}
              <SimulationEngineCanvas />

              {/* Time-Travel Packet Scrubber & Wireshark PCAP Exporter */}
              <TimeTravelPacketScrubber />

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

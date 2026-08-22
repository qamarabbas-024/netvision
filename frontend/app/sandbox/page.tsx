'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { SandboxCanvas } from '@/components/sandbox/SandboxCanvas';
import { MultimodalDiagramParser } from '@/components/simulation/MultimodalDiagramParser';
import { UniversalChatHistoryImporter } from '@/components/learning/UniversalChatHistoryImporter';
import { PdfReportStudio } from '@/components/ui/PdfReportStudio';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Image as ImageIcon, Bot, Printer } from 'lucide-react';

export default function SandboxPage() {
  const [showDiagramParser, setShowDiagramParser] = React.useState<boolean>(false);
  const [showChatImporter, setShowChatImporter] = React.useState<boolean>(false);
  const [showPdfStudio, setShowPdfStudio] = React.useState<boolean>(false);

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
                    Build topologies, cable interfaces, configure IP subnets, dispatch test packet streams, and import diagrams.
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
                    Import Diagram Image
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
                    Export Vector PDF
                  </Button>
                </div>
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

              {/* Sandbox Canvas Component */}
              <SandboxCanvas />
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

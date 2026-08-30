'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { TroubleshootingWorkspace } from '@/components/troubleshooting/TroubleshootingWorkspace';
import { getTroubleshootingScenarioDetailApi } from '@/lib/api';
import { HISTORICAL_OUTAGES } from '@/data/historicalOutagesData';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function TroubleshootingScenarioPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [scenario, setScenario] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadScenario() {
      if (!slug) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await getTroubleshootingScenarioDetailApi(slug);
        setScenario(data);
      } catch (err: any) {
        // Fallback to client-side Historical Outages dataset
        const outage = HISTORICAL_OUTAGES.find((o) => o.slug === slug || o.id === slug);
        if (outage) {
          setScenario({
            id: outage.id,
            slug: outage.slug,
            title: outage.title,
            incidentDescription: `${outage.company} (${outage.year}) — ${outage.summary}`,
            category: outage.category,
            difficulty: outage.severity === 'CRITICAL' ? 'ADVANCED' : 'INTERMEDIATE',
            estimatedMinutes: 25,
            initialSymptoms: outage.initialSymptoms,
            networkingConcepts: [outage.category, 'Root Cause Analysis', 'Post-Mortem Verification'],
            topology: {
              nodes: outage.topologyNodes.map((n, i) => ({
                id: `node-${i + 1}`,
                name: n.name,
                type: n.role.toLowerCase().includes('bgp') || n.role.toLowerCase().includes('router') ? 'ROUTER' : n.role.toLowerCase().includes('dns') || n.role.toLowerCase().includes('server') ? 'SERVER' : 'WORKSTATION',
                ip: n.ip,
                status: 'WARNING',
              })),
              links: [
                { source: 'node-1', target: 'node-2', status: 'ACTIVE' },
                { source: 'node-2', target: 'node-3', status: 'DOWN' },
              ],
            },
            allowedCommands: [
              {
                command: outage.diagnosticCommandHint,
                description: 'Diagnostic query command',
                brokenOutput: `Diagnostic Output:\n- Root Cause: ${outage.rootCause}\n- Telemetry: Anomalous packet drop & state degradation.\n- Remediation Hint: Execute '${outage.solutionCommand.replace(/\n/g, ' ')}'`,
              },
            ],
            possibleDiagnoses: [
              { id: 'diag-1', label: outage.rootCause, isCorrect: true },
              { id: 'diag-2', label: 'Layer 1 Physical Cable Cut on Port eth0', isCorrect: false },
              { id: 'diag-3', label: 'Local DHCP Pool IP Address Exhaustion', isCorrect: false },
            ],
            remediationOptions: [
              { id: 'rem-1', label: `Apply configuration: ${outage.solutionCommand.replace(/\n/g, ' ')}`, isCorrect: true },
              { id: 'rem-2', label: 'Reboot all border gateways and clear local ARP cache', isCorrect: false },
            ],
            postMortem: {
              summary: outage.verificationCriteria,
            },
          });
        } else {
          console.error('Error fetching troubleshooting scenario:', err);
          setError('Failed to load incident scenario details. Please return to catalog.');
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadScenario();
  }, [slug]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar />

          <main className="p-4 sm:p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
            <div className="max-w-7xl mx-auto flex flex-col gap-6">
              {/* Back navigation */}
              <div className="flex items-center justify-between">
                <Link href="/troubleshooting">
                  <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                    Back to Incident Catalog
                  </Button>
                </Link>
              </div>

              {isLoading ? (
                <div className="py-24 flex justify-center text-zinc-500">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-[#00f0ff] border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-mono">Loading Incident Topology & Configuration...</span>
                  </div>
                </div>
              ) : error || !scenario ? (
                <div className="p-12 text-center text-zinc-400 glass-panel rounded-3xl border border-[#272732] flex flex-col items-center gap-4">
                  <ShieldAlert className="w-10 h-10 text-rose-500" />
                  <h2 className="text-lg font-bold text-white">Incident Scenario Not Found</h2>
                  <p className="text-xs text-zinc-400 max-w-md">{error || 'Could not locate the requested incident.'}</p>
                  <Link href="/troubleshooting">
                    <Button variant="cyan" size="sm">
                      Return to Troubleshooting Catalog
                    </Button>
                  </Link>
                </div>
              ) : (
                <TroubleshootingWorkspace scenario={scenario} />
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

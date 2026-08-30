'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getTroubleshootingScenariosApi } from '@/lib/api';
import { CollaborativeWarRoom } from '@/components/simulation/CollaborativeWarRoom';
import { HISTORICAL_OUTAGES } from '@/data/historicalOutagesData';
import {
  ShieldAlert,
  Terminal,
  Search,
  ArrowRight,
  Clock,
  Layers,
  Wrench,
  Activity,
  AlertTriangle,
  Flame,
  Users,
} from 'lucide-react';

export default function TroubleshootingCatalogPage() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'outages' | 'war_room'>('catalog');
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const loadScenarios = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await getTroubleshootingScenariosApi();
      setScenarios(data || []);
    } catch (err: any) {
      console.error('Failed to load troubleshooting scenarios:', err);
      setLoadError(err?.message || 'Failed to load troubleshooting scenarios from server.');
      setScenarios([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadScenarios();
  }, []);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDifficulty('ALL');
    setSelectedCategory('ALL');
  };

  const isFilteringActive = searchQuery.trim() !== '' || selectedDifficulty !== 'ALL' || selectedCategory !== 'ALL';

  const filteredScenarios = scenarios.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      s.title?.toLowerCase().includes(q) ||
      s.incidentDescription?.toLowerCase().includes(q) ||
      s.category?.toLowerCase().includes(q) ||
      s.difficulty?.toLowerCase().includes(q) ||
      s.initialSymptoms?.some((sym: string) => sym.toLowerCase().includes(q)) ||
      s.networkingConcepts?.some((c: string) => c.toLowerCase().includes(q));

    const matchesDifficulty =
      selectedDifficulty === 'ALL' || s.difficulty?.toUpperCase() === selectedDifficulty.toUpperCase();

    const matchesCategory =
      selectedCategory === 'ALL' || s.category === selectedCategory;

    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar />

          <main className="p-4 sm:p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">
              {/* Header Banner */}
              <div className="glass-panel p-8 rounded-3xl border border-[#272732] flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-rose-500/10 via-[#00f0ff]/10 to-transparent pointer-events-none rounded-full blur-3xl" />

                <div className="max-w-3xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-rose-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" /> Live Incident Simulation Engine
                    </span>
                    <Badge variant="rose">
                      {isLoading
                        ? 'Loading...'
                        : isFilteringActive
                        ? `${filteredScenarios.length} of ${scenarios.length} Scenarios`
                        : `${scenarios.length} ${scenarios.length === 1 ? 'Scenario' : 'Scenarios'} Ready`}
                    </Badge>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    Network Troubleshooting &amp; Break-Fix
                  </h1>
                  <p className="text-sm text-zinc-300 mt-2 leading-relaxed">
                    Investigate realistic enterprise network outages. Inspect symptoms, discover telemetry evidence, formulate root cause hypotheses, apply configuration fixes, and verify service restoration.
                  </p>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  <div className="p-3 rounded-2xl bg-black/40 border border-[#272732] flex items-center gap-3">
                    <Activity className="w-5 h-5 text-[#00f0ff]" />
                    <div className="text-xs">
                      <span className="font-bold text-white block">Anti-Guessing Scoring</span>
                      <span className="text-zinc-400">Evidence + Diagnosis + Fix</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex flex-wrap bg-[#121217] p-1 rounded-2xl border border-[#272732] gap-1 self-start">
                <button
                  onClick={() => setActiveTab('catalog')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'catalog'
                      ? 'bg-[#00f0ff] text-black shadow-glow-cyan'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Diagnostic Scenarios ({scenarios.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('outages')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'outages'
                      ? 'bg-rose-500 text-white shadow-glow-rose font-extrabold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-rose-300" />
                  <span>Outages That Broke The Internet (3)</span>
                </button>

                <button
                  onClick={() => setActiveTab('war_room')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'war_room'
                      ? 'bg-[#10b981] text-black shadow-glow-emerald'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Multiplayer War Room</span>
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'outages' ? (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2 text-rose-300">
                      <Flame className="w-4 h-4 text-rose-400" />
                      <span className="font-bold">HISTORICAL POST-MORTEM LABS: Real-world outages modeled with exact BGP &amp; DNS routing topologies.</span>
                    </div>
                    <Badge variant="rose">100% Deterministic</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {HISTORICAL_OUTAGES.map((outage) => (
                      <Card
                        key={outage.id}
                        className="p-6 flex flex-col justify-between border-rose-500/30 hover:border-rose-500/80 transition-all bg-[#0e0e12] rounded-2xl shadow-xl group"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between font-mono text-xs">
                            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                              {outage.year} // {outage.severity}
                            </span>
                            <span className="text-zinc-400 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> {outage.impactDuration}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                              {outage.company}
                            </span>
                            <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors leading-snug">
                              {outage.title}
                            </h3>
                            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                              {outage.summary}
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-black/50 border border-slate-800 font-mono text-[11px] space-y-1.5">
                            <div className="text-slate-500 text-[10px] uppercase font-bold">Root Cause:</div>
                            <div className="text-rose-300 text-[10px] leading-tight">{outage.rootCause}</div>
                          </div>

                          <div className="space-y-1 text-[11px] font-mono text-zinc-400">
                            <div className="text-slate-500 text-[10px] uppercase font-bold">Symptoms:</div>
                            {outage.initialSymptoms.map((sym, idx) => (
                              <div key={idx} className="flex items-start gap-1.5 text-[10px] text-zinc-300">
                                <span className="text-rose-400">•</span>
                                <span>{sym}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                          <Link
                            href={`/troubleshooting/${outage.slug}`}
                            className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-all cursor-pointer"
                          >
                            <span>Launch Post-Mortem Lab</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : activeTab === 'war_room' ? (
                <CollaborativeWarRoom />
              ) : (
                <>
                  {/* Search and Filters */}
                  <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
                    <div className="relative flex-1 max-w-md">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="text"
                        placeholder="Search incidents by concept, protocol, symptom..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#121217] border border-[#272732] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00f0ff] transition-all font-mono"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {isFilteringActive && (
                        <Button variant="secondary" size="sm" onClick={resetFilters} className="text-xs">
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Scenarios Grid */}
                  {isLoading ? (
                    <div className="py-20 flex justify-center text-zinc-500">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-[#00f0ff] border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs font-mono">Loading Troubleshooting Scenarios...</span>
                      </div>
                    </div>
                  ) : loadError ? (
                    <div className="p-12 text-center text-zinc-400 glass-panel rounded-3xl border border-rose-500/30 flex flex-col items-center gap-4">
                      <AlertTriangle className="w-10 h-10 text-rose-400" />
                      <div>
                        <h3 className="text-base font-bold text-white mb-1">Unable to Load Incidents</h3>
                        <p className="text-xs text-zinc-400">{loadError}</p>
                      </div>
                      <Button variant="cyan" size="sm" onClick={loadScenarios}>
                        Retry Connection
                      </Button>
                    </div>
                  ) : filteredScenarios.length === 0 ? (
                    <div className="p-12 text-center text-zinc-500 glass-panel rounded-3xl border border-[#272732] flex flex-col items-center gap-4">
                      <Wrench className="w-8 h-8 mx-auto opacity-50" />
                      <div>
                        <p className="text-sm font-semibold text-zinc-300">No troubleshooting incidents match your filter.</p>
                        <p className="text-xs text-zinc-500 mt-1">Try adjusting your search terms or difficulty selection.</p>
                      </div>
                      <Button variant="secondary" size="sm" onClick={resetFilters}>
                        Reset All Filters
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredScenarios.map((scen) => (
                        <Card
                          key={scen.id || scen.slug}
                          className="p-6 flex flex-col justify-between border-[#272732] hover:border-[#00f0ff]/40 transition-all group bg-[#0e0e12]"
                        >
                          <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                              <Badge
                                variant={
                                  scen.difficulty === 'ADVANCED'
                                    ? 'purple'
                                    : scen.difficulty === 'INTERMEDIATE'
                                    ? 'cyan'
                                    : 'neutral'
                                }
                              >
                                {scen.difficulty}
                              </Badge>
                              <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-zinc-500" /> {scen.estimatedMinutes}m
                              </span>
                            </div>

                            <div>
                              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">
                                {scen.category}
                              </span>
                              <h3 className="text-base font-bold text-white group-hover:text-[#00f0ff] transition-colors leading-snug">
                                {scen.title}
                              </h3>
                              <p className="text-xs text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                                {scen.incidentDescription}
                              </p>
                            </div>

                            {/* Reported Symptoms Preview */}
                            {scen.initialSymptoms && scen.initialSymptoms.length > 0 && (
                              <div className="p-2.5 rounded-xl bg-rose-500/5 border border-rose-500/10 text-[11px] text-rose-300 flex items-start gap-2">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                                <span className="line-clamp-2">{scen.initialSymptoms[0]}</span>
                              </div>
                            )}

                            {/* Concepts tags */}
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {scen.networkingConcepts?.slice(0, 3).map((c: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300 border border-zinc-700/50"
                                >
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="pt-6 border-t border-[#272732]/60 mt-4 flex items-center justify-between">
                            <span className="text-xs font-mono text-zinc-500 flex items-center gap-1">
                              <Layers className="w-3.5 h-3.5" /> {scen.nodeCount || 2} Nodes
                            </span>

                            <Link href={`/troubleshooting/${scen.slug || scen.id}`}>
                              <Button variant="cyan" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                                Investigate Incident
                              </Button>
                            </Link>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

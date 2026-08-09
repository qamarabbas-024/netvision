'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { CommandCard } from '@/components/learning/blocks/CommandCard';
import { Badge } from '@/components/ui/Badge';
import { getAllCommandsApi } from '@/lib/api';
import { Search, Terminal, Filter, Monitor, Cpu, Laptop, RefreshCw } from 'lucide-react';

export default function CommandsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOs, setSelectedOs] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [commands, setCommands] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const categories = [
    'ALL',
    'Network information',
    'Connectivity',
    'DNS',
    'Routing',
    'ARP',
    'Ports',
    'Connections',
    'Troubleshooting',
  ];

  useEffect(() => {
    let isMounted = true;
    async function loadCommands() {
      setIsLoading(true);
      try {
        const data = await getAllCommandsApi(
          selectedOs === 'ALL' ? undefined : selectedOs,
          selectedCategory === 'ALL' ? undefined : selectedCategory,
          searchQuery || undefined
        );
        if (isMounted) {
          setCommands(data || []);
        }
      } catch {
        if (isMounted) setCommands([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    const timer = setTimeout(loadCommands, 250);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchQuery, selectedOs, selectedCategory]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar />

          <main className="p-4 sm:p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
            <div className="max-w-6xl mx-auto flex flex-col gap-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest font-semibold block mb-1">
                    Central Knowledge Reference
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Networking Command & Cheatsheet System
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    Search, filter, and inspect CLI commands across Windows, Linux, and macOS with expected outputs and operational warnings.
                  </p>
                </div>

                <Badge variant="cyan" className="self-start sm:self-auto flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5" /> Single Source of Truth
                </Badge>
              </div>

              {/* Search Bar & Filters Card */}
              <div className="p-5 rounded-2xl glass-panel border border-[#272732] flex flex-col gap-4">
                {/* Search Input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by command (e.g. ipconfig, ping, tracert), purpose, or mechanics..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#00f0ff] transition-all font-mono"
                  />
                </div>

                {/* Platform OS Filter Pills */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-1 mr-1">
                    <Filter className="w-3 h-3 text-[#00f0ff]" /> Platform:
                  </span>
                  <button
                    onClick={() => setSelectedOs('ALL')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                      selectedOs === 'ALL'
                        ? 'bg-[#00f0ff] text-black shadow-glow-cyan'
                        : 'text-zinc-400 hover:text-white bg-white/5'
                    }`}
                  >
                    All OS
                  </button>
                  <button
                    onClick={() => setSelectedOs('WINDOWS')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1 ${
                      selectedOs === 'WINDOWS'
                        ? 'bg-[#00f0ff] text-black shadow-glow-cyan'
                        : 'text-zinc-400 hover:text-white bg-white/5'
                    }`}
                  >
                    <Monitor className="w-3 h-3" /> Windows
                  </button>
                  <button
                    onClick={() => setSelectedOs('LINUX')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1 ${
                      selectedOs === 'LINUX'
                        ? 'bg-purple-500 text-white shadow-glow-purple'
                        : 'text-zinc-400 hover:text-white bg-white/5'
                    }`}
                  >
                    <Cpu className="w-3 h-3" /> Linux
                  </button>
                  <button
                    onClick={() => setSelectedOs('MACOS')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1 ${
                      selectedOs === 'MACOS'
                        ? 'bg-emerald-500 text-white shadow-glow-emerald'
                        : 'text-zinc-400 hover:text-white bg-white/5'
                    }`}
                  >
                    <Laptop className="w-3 h-3" /> macOS
                  </button>
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5 border-t border-zinc-800/60 pt-3">
                  <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block mr-1">
                    Category:
                  </span>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-all ${
                        selectedCategory === cat
                          ? 'bg-white text-black font-bold'
                          : 'text-zinc-400 hover:text-white bg-white/5'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Commands List */}
              {isLoading ? (
                <div className="p-12 text-center text-zinc-500 font-mono text-xs flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#00f0ff]" /> Loading command reference data...
                </div>
              ) : commands.length === 0 ? (
                <div className="p-12 rounded-2xl border border-zinc-800 bg-[#121217] text-center flex flex-col items-center gap-3">
                  <Terminal className="w-8 h-8 text-zinc-600" />
                  <p className="text-sm font-semibold text-zinc-300">No commands match your filters.</p>
                  <p className="text-xs text-zinc-500">Try clearing your search query or choosing another platform filter.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedOs('ALL');
                      setSelectedCategory('ALL');
                    }}
                    className="mt-2 px-3 py-1.5 rounded-xl bg-white/10 text-xs font-mono text-white hover:bg-white/20 transition-all"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
                    <span>Showing {commands.length} Commands</span>
                    <span>Single Source of Truth Knowledge Engine</span>
                  </div>

                  {commands.map((cmd) => (
                    <CommandCard key={cmd.id || cmd.command} command={cmd} />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

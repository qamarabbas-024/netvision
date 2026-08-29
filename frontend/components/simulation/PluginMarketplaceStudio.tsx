'use client';

import React, { useState } from 'react';
import { Package, Download, Star, Check, ShieldCheck, Search, Filter, Trash2, Cpu } from 'lucide-react';
import { COMMUNITY_PLUGIN_CATALOG, ProtocolPluginPackage } from '@/lib/pluginMarketplaceEngine';

export const PluginMarketplaceStudio: React.FC = () => {
  const [plugins, setPlugins] = useState<ProtocolPluginPackage[]>(COMMUNITY_PLUGIN_CATALOG);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const filteredPlugins = plugins.filter((p) => {
    const matchesCat = activeCategory === 'ALL' || p.category === activeCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleToggleInstall = (id: string) => {
    setPlugins((prev) =>
      prev.map((p) => (p.id === id ? { ...p, installed: !p.installed } : p))
    );
  };

  return (
    <div className="surface-1 rounded-2xl border border-[#2a2e39] p-6 text-[#f4f5f7] font-sans shadow-instrument flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2e39] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#22c55e]">
              EPOCH XV // COMMUNITY PROTOCOL PLUGIN MARKETPLACE
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Global WASM Protocol Plugin Registry & Package Installer
          </h2>
          <p className="text-xs text-[#8e95a5]">
            Discover, install, and sandboxed-execute community protocol dissectors, tunneling engines, and quantum algorithms.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="relative">
            <input
              type="text"
              placeholder="Search plugins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1.5 pl-8 rounded-lg bg-[#090d14] border border-[#1e293b] text-white text-xs w-48 focus:border-[#22c55e] outline-none"
            />
            <Search className="w-3.5 h-3.5 text-[#64748b] absolute left-2.5 top-2.5" />
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 border-b border-[#2a2e39] pb-2 font-mono text-xs">
        {['ALL', 'TRANSPORT', 'IOT', 'QUANTUM'].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
              activeCategory === cat
                ? 'bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30'
                : 'text-[#8e95a5] hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Plugin Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        {filteredPlugins.map((plugin) => (
          <div key={plugin.id} className="p-4 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-[#1e293b] mb-2">
                <span className="px-2 py-0.5 rounded bg-[#1e293b] text-[10px] text-[#38bdf8] font-bold">
                  {plugin.category}
                </span>
                <div className="flex items-center gap-1 text-amber-400 font-bold text-[11px]">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{plugin.rating}</span>
                </div>
              </div>

              <h3 className="text-white font-bold text-sm mb-1">{plugin.name}</h3>
              <span className="text-[10px] text-[#64748b] block mb-2">
                by {plugin.author} • v{plugin.version}
              </span>
              <p className="text-[#8e95a5] text-xs leading-relaxed">{plugin.description}</p>
            </div>

            <div className="border-t border-[#1e293b] pt-3 flex items-center justify-between">
              <span className="text-[10px] text-[#64748b]">
                {plugin.downloads.toLocaleString()} downloads
              </span>

              <button
                type="button"
                onClick={() => handleToggleInstall(plugin.id)}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  plugin.installed
                    ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                    : 'bg-[#22c55e] text-[#062817] hover:bg-[#16a34a]'
                }`}
              >
                {plugin.installed ? (
                  <>
                    <Trash2 className="w-3 h-3" />
                    <span>Uninstall</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3 h-3" />
                    <span>1-Click Install</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

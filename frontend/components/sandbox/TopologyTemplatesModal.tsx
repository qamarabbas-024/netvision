'use client';

import React from 'react';
import { LayoutGrid, X, ArrowRight, ShieldCheck, Server, Globe, Cpu, Check } from 'lucide-react';
import { TOPOLOGY_TEMPLATES, TopologyTemplate } from '@/data/topologyTemplates';
import { audioEngine } from '@/lib/audioEngine';

interface TopologyTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: TopologyTemplate) => void;
}

export const TopologyTemplatesModal: React.FC<TopologyTemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-sans">
      <div className="w-full max-w-4xl bg-[#0b101d] border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <LayoutGrid className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Pre-Configured Topology Templates
              </h2>
              <p className="text-xs text-slate-400">
                Instantly load enterprise-grade network architectures into your sandbox workspace.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TOPOLOGY_TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              className="p-5 rounded-xl bg-[#070b14] border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
              onClick={() => {
                audioEngine.playClick();
                onSelectTemplate(tpl);
                onClose();
              }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-bold border border-cyan-500/30">
                    {tpl.category}
                  </span>
                  <span className="text-slate-400 font-semibold">{tpl.difficulty}</span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                    {tpl.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-3">
                    {tpl.description}
                  </p>
                </div>

                {/* Device Breakdown List */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80 font-mono text-[11px]">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Included Hardware:</div>
                  {tpl.devices.map((d, i) => (
                    <div key={i} className="flex items-center justify-between text-slate-300 text-[10px]">
                      <span className="truncate max-w-[130px]">{d.name}</span>
                      <span className="text-cyan-400 font-semibold">{d.ip}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-bold font-mono text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)] mt-2 cursor-pointer"
              >
                <span>Load Into Sandbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

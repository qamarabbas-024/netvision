'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Network, Terminal, Wrench, Award, ArrowUpRight } from 'lucide-react';
import { FEATURE_HIGHLIGHTS } from '@/data/curriculumData';

interface FeatureHighlightsProps {
  onOpenTerminal: () => void;
  onExploreCurriculum?: () => void;
  onScrollToCertifications?: () => void;
}

export const FeatureHighlights: React.FC<FeatureHighlightsProps> = ({
  onOpenTerminal,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Box':
        return <Box className="w-5 h-5 text-cyan-400" />;
      case 'Network':
        return <Network className="w-5 h-5 text-emerald-400" />;
      case 'Terminal':
        return <Terminal className="w-5 h-5 text-teal-400" />;
      case 'Wrench':
        return <Wrench className="w-5 h-5 text-indigo-400" />;
      case 'Award':
        return <Award className="w-5 h-5 text-purple-400" />;
      default:
        return <Box className="w-5 h-5 text-emerald-400" />;
    }
  };

  const getHref = (id: string): string | null => {
    if (id === 'packet-vis') return '/simulations';
    if (id === 'sandbox-lab') return '/sandbox';
    if (id === 'cli-terminal') return null; // opens modal
    if (id === 'troubleshooting') return '/troubleshooting';
    if (id === 'certification') return '/certificates';
    return '/courses';
  };

  return (
    <section className="relative w-full bg-[#0b0f17] border-b border-[#1e293b]/70 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 5-Column Feature Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {FEATURE_HIGHLIGHTS.map((feat) => {
            const href = getHref(feat.id);

            const cardContent = (
              <div className="group relative bg-[#0f172a]/70 hover:bg-[#111c30] border border-slate-800/80 hover:border-slate-700 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between shadow-sm h-full">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#090d16] border border-slate-800 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                    {getIcon(feat.iconName)}
                  </div>
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-white mb-2 leading-snug">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-500 group-hover:text-[#34d399] transition-colors">
                  <span>Explore Feature</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );

            if (href) {
              return (
                <Link key={feat.id} href={href} className="block h-full">
                  {cardContent}
                </Link>
              );
            }

            return (
              <div key={feat.id} onClick={onOpenTerminal} className="block h-full">
                {cardContent}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

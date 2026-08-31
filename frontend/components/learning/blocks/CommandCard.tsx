'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Terminal, Copy, Check, AlertTriangle, BookOpen, Monitor, Cpu, Laptop } from 'lucide-react';

export interface CommandCardProps {
  command: {
    id?: string;
    command: string;
    operatingSystem: 'WINDOWS' | 'LINUX' | 'MACOS' | 'ALL' | string;
    category: string;
    purpose: string;
    syntax: string;
    example: string;
    expectedOutput?: string | null;
    explanation: string;
    warnings?: string | null;
    relatedLessonSlugs?: string[];
  };
  compact?: boolean;
}

export const CommandCard: React.FC<CommandCardProps> = ({ command: item, compact = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.example || item.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderOsBadge = (os: string) => {
    const uppercaseOs = os.toUpperCase();
    if (uppercaseOs === 'WINDOWS') {
      return <Badge variant="cyan" className="flex items-center gap-1"><Monitor className="w-3 h-3" /> Windows</Badge>;
    }
    if (uppercaseOs === 'LINUX') {
      return <Badge variant="purple" className="flex items-center gap-1"><Cpu className="w-3 h-3" /> Linux</Badge>;
    }
    if (uppercaseOs === 'MACOS') {
      return <Badge variant="emerald" className="flex items-center gap-1"><Laptop className="w-3 h-3" /> macOS</Badge>;
    }
    return <Badge variant="cyan" className="flex items-center gap-1"><Terminal className="w-3 h-3" /> Cross-Platform (All)</Badge>;
  };

  return (
    <Card className="p-5 sm:p-6 border-[#272732] bg-[#121217] flex flex-col gap-4">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#272732] pb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff]">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-white font-mono break-all">{item.command}</h3>
            <span className="text-xs text-zinc-400 font-mono">{item.category}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {renderOsBadge(item.operatingSystem)}
          <button
            onClick={handleCopy}
            className="px-2.5 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-mono font-medium transition-colors flex items-center gap-1.5 border border-zinc-700 shrink-0"
            title="Copy command to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Purpose */}
      <div>
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-0.5">Purpose</span>
        <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium">{item.purpose}</p>
      </div>

      {/* Syntax & Example Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-[#09090b] border border-zinc-800 min-w-0">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">Command Syntax</span>
          <code className="text-[#00f0ff] font-bold block break-all">{item.syntax}</code>
        </div>
        <div className="p-3 rounded-xl bg-[#09090b] border border-zinc-800 min-w-0">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">Working Example</span>
          <code className="text-emerald-400 font-bold block break-all">{item.example}</code>
        </div>
      </div>

      {/* Expected Terminal Output */}
      {item.expectedOutput && !compact && (
        <div className="rounded-xl bg-[#09090b] border border-zinc-800/80 overflow-hidden font-mono text-xs">
          <div className="px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 text-[10px] text-zinc-400 uppercase tracking-wider flex items-center justify-between">
            <span>Expected Console Output</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <pre className="p-3 text-zinc-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {item.expectedOutput}
          </pre>
        </div>
      )}

      {/* Technical Explanation */}
      {item.explanation && (
        <div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">Technical Mechanics</span>
          <p className="text-xs text-zinc-400 leading-relaxed">{item.explanation}</p>
        </div>
      )}

      {/* Warnings Alert */}
      {item.warnings && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-200/90 leading-relaxed font-medium">{item.warnings}</p>
        </div>
      )}

      {/* Related Lessons */}
      {item.relatedLessonSlugs && item.relatedLessonSlugs.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#272732]/60">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-[#00f0ff]" /> Related Lessons:
          </span>
          {item.relatedLessonSlugs.map((slug, idx) => (
            <Link key={idx} href={`/courses/net-101-digital-foundations/lessons/${slug}`}>
              <Badge variant="cyan" className="cursor-pointer hover:underline text-[10px] font-mono">
                {slug.replace(/-/g, ' ')}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
};

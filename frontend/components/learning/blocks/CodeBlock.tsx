'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

export interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'bash',
  title = 'Networking CLI Command',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-[#272732] bg-[#09090b] overflow-hidden my-4">
      {/* Header */}
      <div className="px-4 py-2.5 bg-[#121217] border-b border-[#272732] flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-300">
          <Terminal className="w-4 h-4 text-[#00f0ff]" />
          <span>{title}</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-zinc-400 uppercase">{language}</span>
        </div>

        <button
          onClick={handleCopy}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy CLI Command</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <pre className="p-4 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed whitespace-pre-wrap">
        {code}
      </pre>
    </div>
  );
};

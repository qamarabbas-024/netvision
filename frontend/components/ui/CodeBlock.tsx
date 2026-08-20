import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'bash',
  title,
  showLineNumbers = false,
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const lines = code.trim().split('\n');

  return (
    <div className={cn('surface-3 rounded-xl border border-[#2a2e39] overflow-hidden font-mono text-xs shadow-inner', className)}>
      {/* Header Bezel */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#101115] border-b border-[#242731]">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span className="text-[11px] text-[#8e95a5] font-semibold uppercase tracking-wider">
            {title || language}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
          className="flex items-center gap-1 text-[10px] text-[#8e95a5] hover:text-[#f4f5f7] px-2 py-0.5 rounded bg-[#16181f] border border-[#2a2e39] hover:border-zinc-500 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-[#10b981]" />
              <span className="text-[#10b981]">COPIED</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>COPY</span>
            </>
          )}
        </button>
      </div>

      {/* Code Well */}
      <div className="p-3.5 overflow-x-auto bg-[#14151a]">
        <pre className="leading-relaxed text-[#e2e4e9]">
          {showLineNumbers ? (
            <div className="table w-full">
              {lines.map((line, idx) => (
                <div key={idx} className="table-row">
                  <span className="table-cell pr-4 text-right select-none text-[#646c7d] text-[11px]">
                    {idx + 1}
                  </span>
                  <span className="table-cell">{line}</span>
                </div>
              ))}
            </div>
          ) : (
            <code>{code}</code>
          )}
        </pre>
      </div>
    </div>
  );
};

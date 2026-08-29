'use client';

import React, { useState } from 'react';
import { Package, Download, Copy, Check, FileCode, FolderArchive, Terminal } from 'lucide-react';
import { generateEbpfProductionBundle, EbpfBundleFile } from '@/lib/ebpfBundleExportEngine';

export const EbpfBundleExportStudio: React.FC = () => {
  const [files] = useState<EbpfBundleFile[]>(generateEbpfProductionBundle());
  const [selectedFilename, setSelectedFilename] = useState<string>('Makefile');
  const [copied, setCopied] = useState<boolean>(false);

  const selectedFile = files.find((f) => f.filename === selectedFilename) || files[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = () => {
    const blob = new Blob([selectedFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="surface-1 rounded-2xl border border-[#2a2e39] p-6 text-[#f4f5f7] font-sans shadow-instrument flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2e39] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#22c55e]">
              EPOCH XIV // EBPF PRODUCTION BUNDLE EXPORTER
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            1-Click eBPF C Source, Makefile & Go Loader Project Exporter
          </h2>
          <p className="text-xs text-[#8e95a5]">
            Export a complete, turn-key eBPF production repository ready to compile with clang and deploy as a Linux systemd service.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-lg bg-[#1a1f2c] border border-[#2a2e39] hover:border-[#22c55e] text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer text-white"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy File'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadZip}
            className="px-3.5 py-1.5 rounded-lg bg-[#22c55e] text-[#062817] hover:bg-[#16a34a] text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download {selectedFile.filename}</span>
          </button>
        </div>
      </div>

      {/* File Tabs */}
      <div className="flex items-center gap-2 border-b border-[#2a2e39] pb-2 font-mono text-xs">
        {files.map((file) => (
          <button
            key={file.filename}
            type="button"
            onClick={() => setSelectedFilename(file.filename)}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold flex items-center gap-2 ${
              selectedFilename === file.filename
                ? 'bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30'
                : 'text-[#8e95a5] hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>{file.filename}</span>
          </button>
        ))}
      </div>

      {/* Code Viewer */}
      <div className="rounded-xl bg-[#090d14] border border-[#1e293b] p-4 font-mono text-xs text-[#38bdf8] overflow-x-auto leading-relaxed max-h-[380px]">
        <pre className="whitespace-pre">{selectedFile.content}</pre>
      </div>
    </div>
  );
};

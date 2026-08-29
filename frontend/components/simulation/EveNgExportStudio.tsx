'use client';

import React, { useState } from 'react';
import { Download, Copy, Check, Server, Share2, Layers } from 'lucide-react';
import { generateEveNgXml, generateGns3Json, EmulatorNode, EmulatorLink } from '@/lib/eveNgExportEngine';

export const EveNgExportStudio: React.FC = () => {
  const [labName, setLabName] = useState<string>('netvision-campus-core');
  const [format, setFormat] = useState<'eveng' | 'gns3'>('eveng');
  const [copied, setCopied] = useState<boolean>(false);

  const sampleNodes: EmulatorNode[] = [
    { id: 1, name: 'Core-R1', type: 'qemu', template: 'c8000v', image: 'c8000v-17.09.04a', cpu: 2, ram: 4096, left: 300, top: 150 },
    { id: 2, name: 'Core-R2', type: 'qemu', template: 'c8000v', image: 'c8000v-17.09.04a', cpu: 2, ram: 4096, left: 550, top: 150 },
    { id: 3, name: 'Dist-SW1', type: 'iol', template: 'ioll2', image: 'L2-ADVENTERPRISEK9-M-15.2-20150703', cpu: 1, ram: 1024, left: 300, top: 350 },
    { id: 4, name: 'Dist-SW2', type: 'iol', template: 'ioll2', image: 'L2-ADVENTERPRISEK9-M-15.2-20150703', cpu: 1, ram: 1024, left: 550, top: 350 },
  ];

  const sampleLinks: EmulatorLink[] = [
    { sourceNodeId: 1, sourcePort: 1, targetNodeId: 2, targetPort: 1 },
    { sourceNodeId: 1, sourcePort: 2, targetNodeId: 3, targetPort: 1 },
    { sourceNodeId: 2, sourcePort: 2, targetNodeId: 4, targetPort: 1 },
    { sourceNodeId: 3, sourcePort: 2, targetNodeId: 4, targetPort: 2 },
  ];

  const outputCode = format === 'eveng'
    ? generateEveNgXml(labName, sampleNodes, sampleLinks)
    : generateGns3Json(labName, sampleNodes, sampleLinks);

  const handleCopy = () => {
    navigator.clipboard.writeText(outputCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = format === 'eveng' ? 'unl' : 'gns3';
    const mime = format === 'eveng' ? 'application/xml' : 'application/json';
    const blob = new Blob([outputCode], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${labName}.${ext}`;
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
              EPOCH XI // EMULATOR TOPOLOGY CONVERTER
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            EVE-NG & GNS3 Topology Export Studio
          </h2>
          <p className="text-xs text-[#8e95a5]">
            Convert visual NetVision topologies directly into EVE-NG XML (.unl) and GNS3 JSON topology files.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-[#1a1f2c] border border-[#2a2e39] hover:border-[#22c55e] text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer text-white"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg bg-[#22c55e] text-[#062817] hover:bg-[#16a34a] text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download {format === 'eveng' ? '.unl' : '.gns3'}</span>
          </button>
        </div>
      </div>

      {/* Format Selector */}
      <div className="flex items-center gap-2 border-b border-[#2a2e39] pb-2 font-mono text-xs">
        <button
          type="button"
          onClick={() => setFormat('eveng')}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
            format === 'eveng' ? 'bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30' : 'text-[#8e95a5] hover:text-white'
          }`}
        >
          EVE-NG (.unl XML)
        </button>
        <button
          type="button"
          onClick={() => setFormat('gns3')}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
            format === 'gns3' ? 'bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30' : 'text-[#8e95a5] hover:text-white'
          }`}
        >
          GNS3 (.gns3 JSON)
        </button>
      </div>

      {/* Code Preview */}
      <div className="rounded-xl bg-[#090d14] border border-[#1e293b] p-4 font-mono text-xs text-[#38bdf8] overflow-x-auto leading-relaxed max-h-[380px]">
        <pre className="whitespace-pre">{outputCode}</pre>
      </div>
    </div>
  );
};

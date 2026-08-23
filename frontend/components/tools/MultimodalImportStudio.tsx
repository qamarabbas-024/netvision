'use client';

import React, { useState } from 'react';
import {
  UploadCloud,
  FileImage,
  MessageSquare,
  Download,
  Sparkles,
  Layers,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  MultimodalIngestionEngine,
  MultimodalIngestionResult,
} from '@/lib/multimodalIngestionEngine';
import {
  VectorPdfExportEngine,
  CertificatePdfPayload,
} from '@/lib/vectorPdfExportEngine';
import { SoundFx } from '@/lib/soundFx';

export const MultimodalImportStudio: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'IMAGE' | 'LLM_CHAT' | 'PDF_EXPORT'>('IMAGE');
  const [chatInput, setChatInput] = useState<string>(
    'User: Configure an edge router with DHCP pool 192.168.1.0/24 and link it to the core switch.'
  );
  const [ingestionResult, setIngestionResult] = useState<MultimodalIngestionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleProcessImage = () => {
    setIsProcessing(true);
    SoundFx.playPacketDispatch();

    setTimeout(() => {
      const res = MultimodalIngestionEngine.parseDiagramImage('corporate_datacenter_topology.png');
      setIngestionResult(res);
      setIsProcessing(false);
      SoundFx.playSuccessChime();
    }, 700);
  };

  const handleProcessLlmChat = () => {
    setIsProcessing(true);
    SoundFx.playPacketDispatch();

    setTimeout(() => {
      const res = MultimodalIngestionEngine.parseLlmChatLog(chatInput);
      setIngestionResult(res);
      setIsProcessing(false);
      SoundFx.playSuccessChime();
    }, 600);
  };

  const handleExportDiploma = () => {
    SoundFx.playTerminalKeyPress();
    const payload: CertificatePdfPayload = {
      candidateName: 'Alex Rivers',
      certCode: 'NV-NET-PRO',
      certTitle: 'NetVision Enterprise Network Architect',
      issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      sha256Signature: '0x9A4B8F72E1C3D5A60912E48A9C4F7B2D8E1A3C5B',
      scorePercent: 98,
    };
    const svg = VectorPdfExportEngine.generateCertificateSvg(payload);
    VectorPdfExportEngine.downloadSvgAsPdf(svg, 'NetVision_Official_Certificate_Alex_Rivers.svg');
    SoundFx.playSuccessChime();
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setIngestionResult(null);
    setIsProcessing(false);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff]">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
                Multimodal AI Engine
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30 text-[10px] font-mono font-bold">
                Image & LLM Chat Ingestion
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Diagram OCR, Chat Synthesizer & Vector PDF Exporter
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {ingestionResult && (
            <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              Reset Import
            </Button>
          )}
          <Button variant="primary" size="sm" onClick={handleExportDiploma} leftIcon={<Download className="w-3.5 h-3.5" />}>
            Export Vector Diploma (.svg/.pdf)
          </Button>
        </div>
      </div>

      {/* Main Grid: Import Modalities (Left) & Synthesized Topology Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 6 Cols: Ingestion Input Studio */}
        <div className="lg:col-span-6 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-[#121522] rounded-2xl border border-[#262c42]">
            <button
              onClick={() => {
                SoundFx.playTerminalKeyPress();
                setActiveMode('IMAGE');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeMode === 'IMAGE'
                  ? 'bg-[#00f0ff] text-black shadow-glow-cyan'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <FileImage className="w-3.5 h-3.5" /> Diagram Image
            </button>
            <button
              onClick={() => {
                SoundFx.playTerminalKeyPress();
                setActiveMode('LLM_CHAT');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeMode === 'LLM_CHAT'
                  ? 'bg-[#00f0ff] text-black shadow-glow-cyan'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> LLM Chat History
            </button>
          </div>

          {activeMode === 'IMAGE' ? (
            <div className="space-y-4">
              <div
                onClick={handleProcessImage}
                className="p-8 rounded-2xl border-2 border-dashed border-cyan-500/40 bg-cyan-950/10 hover:bg-cyan-950/20 cursor-pointer flex flex-col items-center justify-center gap-3 text-center transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-[#00f0ff]">
                  <FileImage className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-sm font-bold text-white block">Drop Network Diagram (PNG, JPEG, SVG)</span>
                  <span className="text-xs text-zinc-400">Click to simulate instant neural OCR topology extraction</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <span className="text-xs font-bold text-white block">Paste ChatGPT / Claude / Gemini Chat Export:</span>
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                rows={5}
                className="w-full p-3 rounded-xl bg-black/60 border border-[#262c42] text-xs font-mono text-cyan-300 resize-none focus:outline-none focus:border-[#00f0ff]"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handleProcessLlmChat}
                disabled={isProcessing}
                leftIcon={<Sparkles className="w-3.5 h-3.5" />}
              >
                {isProcessing ? 'Synthesizing Topology...' : 'Synthesize Topology from Chat'}
              </Button>
            </div>
          )}
        </div>

        {/* Right 6 Cols: Extracted Network Entities */}
        <div className="lg:col-span-6 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#00f0ff]" /> Extracted Topology Graph
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                ingestionResult
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
              }`}
            >
              {ingestionResult ? 'SYNTHESIS COMPLETE' : 'AWAITING INPUT'}
            </span>
          </div>

          {ingestionResult ? (
            <div className="space-y-3 animate-in fade-in">
              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs font-mono text-cyan-300">
                {ingestionResult.summary}
              </div>

              {/* Extracted Nodes */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">
                  Identified Devices ({ingestionResult.nodes.length})
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {ingestionResult.nodes.map((node) => (
                    <div key={node.id} className="p-2.5 rounded-xl bg-[#121522] border border-[#262c42] text-xs font-mono">
                      <div className="font-bold text-white">{node.name}</div>
                      <div className="text-[10px] text-zinc-400">{node.ipAddress} ({node.type})</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Extracted Config Snippets */}
              {ingestionResult.extractedConfigs.length > 0 && (
                <div className="space-y-1 pt-2 border-t border-[#202538]">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">
                    Synthesized Cisco IOS CLI Configuration
                  </span>
                  <pre className="p-3 rounded-xl bg-black/60 border border-zinc-800 text-[11px] font-mono text-emerald-300 overflow-x-auto">
                    <code>{ingestionResult.extractedConfigs.join('\n\n')}</code>
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center flex flex-col items-center justify-center text-zinc-500 text-xs font-mono gap-2 min-h-[220px]">
              <UploadCloud className="w-8 h-8 opacity-40 text-zinc-400" />
              <span>Upload a diagram image or paste an LLM chat log to extract topology models.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

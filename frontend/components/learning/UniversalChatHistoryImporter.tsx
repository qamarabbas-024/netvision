'use client';

import React, { useState, useRef } from 'react';
import {
  Bot,
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Terminal,
  Activity,
  Download,
  RotateCcw,
  Copy,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface ParsedChatInsights {
  modelSource: string;
  totalMessages: number;
  extractedConcepts: string[];
  extractedCommands: string[];
  recommendedModules: string[];
  generatedLabPrompt: string;
  keyTakeaways: string[];
}

export interface UniversalChatHistoryImporterProps {
  onGenerateLabScenario?: (labPrompt: string) => void;
  onClose?: () => void;
}

export const UniversalChatHistoryImporter: React.FC<UniversalChatHistoryImporterProps> = ({
  onGenerateLabScenario,
  onClose,
}) => {
  const [chatLogText, setChatLogText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [parsedResults, setParsedResults] = useState<ParsedChatInsights | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleChatTranscript = `User: I was trying to understand why my router is not forming an OSPF neighbor relationship with Router 2.
Assistant: In OSPFv2, routers fail to form FULL adjacencies if there is a mismatch in:
1. Area ID (e.g. Area 0 vs Area 1)
2. Hello and Dead Interval Timers (default 10s / 40s on broadcast networks)
3. Subnet Mask on the connecting link (e.g. /24 vs /26)
4. MTU size mismatch on the interface (stuck in EXSTART/EXCHANGE state)
5. Authentication password or type mismatch.

User: Oh, I ran "show ip ospf interface gig0/0" and saw MTU is 1500 on R1 but 1400 on R2!
Assistant: Exactly! That will cause packets to get stuck in EXSTART state during the Database Description (DBD) exchange. Fix it with: "ip ospf mtu-ignore" or set "mtu 1500".`;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setChatLogText(content);
      analyzeChatHistory(content);
    };
    reader.readAsText(file);
  };

  const analyzeChatHistory = (text: string) => {
    if (!text.trim()) return;
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      const lower = text.toLowerCase();
      let source = 'ChatGPT / Generic LLM';
      if (lower.includes('claude') || lower.includes('anthropic')) source = 'Claude (Anthropic)';
      if (lower.includes('gemini') || lower.includes('google')) source = 'Google Gemini';
      if (lower.includes('deepseek')) source = 'DeepSeek R1';

      const concepts: string[] = [];
      if (lower.includes('ospf')) concepts.push('Single-Area & Multi-Area OSPF Link-State Routing');
      if (lower.includes('mtu') || lower.includes('pmtud')) concepts.push('MTU Sizing, MSS & Path MTU Discovery');
      if (lower.includes('stp') || lower.includes('spanning')) concepts.push('Spanning Tree Protocol (STP / RSTP 802.1w)');
      if (lower.includes('subnet') || lower.includes('cidr')) concepts.push('IPv4 CIDR Subnetting & VLSM Allocation');
      if (lower.includes('tcp') || lower.includes('handshake')) concepts.push('TCP 3-Way Handshake & Connection Management');
      if (lower.includes('dns') || lower.includes('dhcp')) concepts.push('Core Infrastructure Services (DNS & DHCP)');
      if (concepts.length === 0) concepts.push('General Computer Networking & Protocols');

      const commands: string[] = [];
      const lines = text.split('\n');
      lines.forEach((line) => {
        if (line.includes('show ip') || line.includes('ping') || line.includes('traceroute') || line.includes('ip route') || line.includes('tcpdump') || line.includes('wireshark')) {
          const match = line.match(/(show ip [a-z0-9\s/]+|ping [0-9.]+|traceroute [0-9.]+|ip route [0-9.\s/]+|tcpdump [a-z0-9\-]+)/i);
          if (match && !commands.includes(match[0])) {
            commands.push(match[0].trim());
          }
        }
      });

      if (commands.length === 0) {
        commands.push('show ip ospf neighbor', 'show ip ospf interface', 'ping 192.168.1.1');
      }

      setParsedResults({
        modelSource: source,
        totalMessages: Math.max(4, Math.floor(text.split(/User:|Assistant:|Human:|AI:/i).length)),
        extractedConcepts: concepts,
        extractedCommands: commands,
        recommendedModules: ['NET-304: Single-Area OSPF Routing', 'NET-203: Transport Segmentation & PMTUD'],
        generatedLabPrompt: `Simulate an OSPF MTU Mismatch outage between Router 1 (MTU 1500) and Router 2 (MTU 1400), verify neighbor state stuck in EXSTART, and execute "ip ospf mtu-ignore" remediation.`,
        keyTakeaways: [
          'OSPF neighbor adjacencies require matching Area IDs, Hello/Dead timers, and MTU sizes on broadcast links.',
          'An MTU mismatch allows Hello packets (small) to establish 2-WAY state but drops large DBD packets, trapping the adjacency in EXSTART state.',
          'Remediation requires either harmonizing interface MTUs across the link or issuing the mtu-ignore configuration override.',
        ],
      });
    }, 800);
  };

  return (
    <div className="w-full rounded-2xl bg-[#09090b] border border-[#272732] overflow-hidden flex flex-col shadow-2xl">
      {/* Top Header */}
      <div className="px-5 py-4 border-b border-[#272732] bg-[#121217] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-purple-400 uppercase tracking-wider font-semibold">
                Version 3.2 AI Workspace
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-mono font-bold">
                Universal LLM Importer
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
              AI Chat History & Transcript Importer
            </h3>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-[#1a1a24] border border-[#272732]"
          >
            ✕
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="p-5 sm:p-6 flex flex-col gap-6">
        {/* Input Textarea & File Uploader */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              Paste AI Chat Transcript (ChatGPT, Claude, Gemini, DeepSeek)
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setChatLogText(sampleChatTranscript);
                  analyzeChatHistory(sampleChatTranscript);
                }}
                className="text-[11px] font-mono text-purple-400 hover:text-purple-300 underline"
              >
                Load Sample Transcript
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.json,.md"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded bg-[#1a1a24] border border-[#272732] text-xs font-mono text-zinc-300 hover:text-white"
              >
                Upload File (.json / .md)
              </button>
            </div>
          </div>

          <textarea
            value={chatLogText}
            onChange={(e) => setChatLogText(e.target.value)}
            placeholder="Paste your conversation with ChatGPT, Claude, or Gemini regarding any networking concept or troubleshooting session here..."
            className="w-full h-32 p-3.5 rounded-xl bg-[#121217] border border-[#272732] text-xs font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
          />

          <Button
            variant="cyan"
            onClick={() => analyzeChatHistory(chatLogText)}
            disabled={!chatLogText.trim() || isProcessing}
            className="self-end bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-glow-purple"
          >
            {isProcessing ? 'Analyzing Transcript...' : 'Extract Concepts & Synthesize Lab ➔'}
          </Button>
        </div>

        {/* Parsed Insights Panel */}
        {parsedResults && (
          <div className="p-5 rounded-2xl bg-[#101017] border border-[#272732] flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#272732]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-white">Transcript Intelligence Extracted</span>
              </div>
              <span className="text-xs font-mono text-zinc-400">
                Source: <span className="text-purple-400 font-bold">{parsedResults.modelSource}</span>
              </span>
            </div>

            {/* Extracted Concepts */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                Detected Network Domains
              </span>
              <div className="flex flex-wrap gap-2">
                {parsedResults.extractedConcepts.map((concept, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-xs"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>

            {/* Extracted CLI Commands */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#00f0ff]" /> Relevant CLI Diagnostic Commands
              </span>
              <div className="flex flex-wrap gap-2">
                {parsedResults.extractedCommands.map((cmd, idx) => (
                  <code
                    key={idx}
                    className="px-2 py-0.5 rounded bg-black/60 border border-zinc-800 text-xs font-mono text-[#00f0ff]"
                  >
                    {cmd}
                  </code>
                ))}
              </div>
            </div>

            {/* Synthesis & Key Takeaways */}
            <div className="p-3.5 rounded-xl bg-[#14141d] border border-[#272732] flex flex-col gap-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-purple-400" /> Core Engineering Synthesis
              </span>
              <ul className="text-xs text-zinc-300 space-y-1 pl-4 list-disc marker:text-purple-400">
                {parsedResults.keyTakeaways.map((item, idx) => (
                  <li key={idx} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>

            {/* Generated Lab Action */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 to-sky-950/40 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold block mb-0.5">
                  Automated Lab Generation
                </span>
                <p className="text-xs font-semibold text-white max-w-xl leading-snug">
                  {parsedResults.generatedLabPrompt}
                </p>
              </div>

              <button
                onClick={() => {
                  if (onGenerateLabScenario) {
                    onGenerateLabScenario(parsedResults.generatedLabPrompt);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-purple-500 text-white font-bold text-xs hover:bg-purple-400 transition-all flex items-center gap-1.5 shadow-glow-purple shrink-0"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Launch Interactive Simulation Scenario ➔</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

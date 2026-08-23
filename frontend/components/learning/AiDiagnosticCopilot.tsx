'use client';

import React, { useState, useEffect } from 'react';
import {
  Bot,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Wrench,
  Send,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  AiCopilotEngine,
  NetworkHealthReport,
  TopologyInspectionContext,
} from '@/lib/aiCopilotEngine';
import { SoundFx } from '@/lib/soundFx';

interface AiDiagnosticCopilotProps {
  context?: TopologyInspectionContext;
  onClose?: () => void;
}

export const AiDiagnosticCopilot: React.FC<AiDiagnosticCopilotProps> = ({
  context,
  onClose,
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [inputText, setInputText] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: 'AI' | 'USER'; text: string; timestamp: string }>
  >([
    {
      sender: 'AI',
      text: 'Greetings! I am your Autonomous Network Diagnostic Mentor. Speak or type a command to inspect your circuit topology.',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const defaultContext: TopologyInspectionContext = context || {
    nodes: [
      { id: 'h1', name: 'Host-Alpha', type: 'HOST', ip: '192.168.1.10', subnet: '192.168.1.0/24', gateway: '192.168.1.1' },
      { id: 'h2', name: 'Host-Beta', type: 'HOST', ip: '192.168.1.10', subnet: '192.168.1.0/24' }, // deliberate dup IP & missing GW for demo
      { id: 'sw1', name: 'Core-Switch', type: 'SWITCH' },
      { id: 'r1', name: 'Edge-Router', type: 'ROUTER', ip: '192.168.1.1' },
    ],
    links: [
      { source: 'h1', target: 'sw1' },
      { source: 'sw1', target: 'r1' },
      // h2 is intentionally disconnected
    ],
  };

  const [healthReport, setHealthReport] = useState<NetworkHealthReport>(() =>
    AiCopilotEngine.analyzeTopology(defaultContext)
  );

  useEffect(() => {
    const rep = AiCopilotEngine.analyzeTopology(defaultContext);
    setHealthReport(rep);
  }, []);

  const speakText = (text: string) => {
    if (!voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleQuery = (query: string) => {
    if (!query.trim()) return;
    SoundFx.playTerminalKeyPress();

    const userMsg = { sender: 'USER' as const, text: query, timestamp: new Date().toLocaleTimeString() };
    const responseText = AiCopilotEngine.generateCopilotResponse(query, healthReport);
    const aiMsg = { sender: 'AI' as const, text: responseText, timestamp: new Date().toLocaleTimeString() };

    setChatMessages((prev) => [...prev, userMsg, aiMsg]);
    setInputText('');
    speakText(responseText);
    SoundFx.playSuccessChime();
  };

  const toggleSpeechRecognition = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      handleQuery('Diagnose network health and report topology issues');
      return;
    }

    if (!isListening) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setIsListening(false);
          handleQuery(transcript);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognition.start();
      } catch {
        setIsListening(false);
      }
    } else {
      setIsListening(false);
    }
  };

  return (
    <div className="w-full rounded-3xl bg-[#0b0c10] border border-[#232738] shadow-2xl overflow-hidden flex flex-col">
      {/* Top Header */}
      <div className="px-6 py-4 bg-[#11131c] border-b border-[#232738] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">
                Version 4.2 AI Mentor
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold">
                Socratic Voice Copilot
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">Autonomous Diagnostic Tutor</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Health Score Pill */}
          <div className="px-3 py-1 rounded-xl bg-black/50 border border-[#232738] flex items-center gap-2">
            <span className="text-[10px] font-mono text-zinc-400 uppercase">Topology Grade</span>
            <span
              className={`text-sm font-mono font-black ${
                healthReport.grade === 'A+' || healthReport.grade === 'A'
                  ? 'text-emerald-400'
                  : healthReport.grade === 'B'
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {healthReport.grade} ({healthReport.score}%)
            </span>
          </div>

          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className="p-2 rounded-xl bg-[#1a1c29] border border-[#232738] text-zinc-400 hover:text-white transition-colors"
            title={voiceEnabled ? 'Mute AI Voice' : 'Enable AI Voice'}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4 text-purple-400" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#1a1c29] border border-[#232738] text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Chat Stream (Left) & Real-Time Socratic Issues (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#232738]">
        {/* Left 7 Cols: Chat Stream & Voice Controls */}
        <div className="lg:col-span-7 p-4 flex flex-col gap-4 bg-[#0e1017]">
          {/* Messages Stream */}
          <div className="flex-1 min-h-[260px] max-h-[320px] overflow-y-auto space-y-3 p-3 rounded-2xl bg-black/40 border border-[#232738]/60">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'USER' ? 'items-end' : 'items-start'} gap-1`}
              >
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500">
                  <span>{msg.sender === 'USER' ? 'Student' : 'AI Copilot'}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>
                <div
                  className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                    msg.sender === 'USER'
                      ? 'bg-purple-600 text-white rounded-tr-none'
                      : 'bg-[#181b26] border border-[#2a2f45] text-zinc-200 rounded-tl-none shadow-md'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Preset Socratic Quick-Actions */}
          <div className="flex flex-wrap gap-1.5">
            {[
              'Diagnose network health',
              'Check default gateway',
              'Inspect duplicate IPs',
              'Explain Socratic hints',
            ].map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleQuery(preset)}
                className="px-2.5 py-1 rounded-lg bg-[#181b28] hover:bg-purple-950/40 border border-[#2a2f45] hover:border-purple-500/50 text-[11px] font-mono text-purple-300 transition-all"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Voice & Text Input Bar */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSpeechRecognition}
              className={`p-2.5 rounded-2xl border transition-all ${
                isListening
                  ? 'bg-rose-500 border-rose-400 text-white animate-pulse shadow-glow-rose'
                  : 'bg-[#181b28] border-[#2a2f45] text-purple-400 hover:text-white'
              }`}
              title="Speak to AI Mentor"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuery(inputText)}
              placeholder="Ask AI Copilot or click microphone to speak..."
              className="flex-1 px-4 py-2.5 rounded-2xl bg-[#141622] border border-[#2a2f45] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-400"
            />

            <Button
              variant="primary"
              size="sm"
              onClick={() => handleQuery(inputText)}
              leftIcon={<Send className="w-4 h-4" />}
            >
              Ask
            </Button>
          </div>
        </div>

        {/* Right 5 Cols: Live Detected Issues & Socratic Guides */}
        <div className="lg:col-span-5 p-4 bg-[#0b0c10] flex flex-col gap-3 max-h-[440px] overflow-y-auto">
          <div className="flex items-center justify-between pb-2 border-b border-[#232738]">
            <span className="text-xs font-mono font-bold text-zinc-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" /> Detected Circuit Anomalies
            </span>
            <span className="text-[11px] font-mono text-purple-400 font-bold">
              {healthReport.issues.length} Issues
            </span>
          </div>

          {healthReport.issues.length === 0 ? (
            <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-center flex flex-col items-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-300">Clean Topology! Zero Issues Found</span>
              <p className="text-[11px] text-zinc-400">All links, subnets, and default gateways are valid.</p>
            </div>
          ) : (
            healthReport.issues.map((issue) => (
              <div
                key={issue.id}
                className="p-3 rounded-2xl bg-[#12141e] border border-[#282d42] flex flex-col gap-2 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle
                      className={`w-4 h-4 shrink-0 ${
                        issue.severity === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'
                      }`}
                    />
                    <span className="text-xs font-bold text-white">{issue.title}</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-zinc-800 text-zinc-300 uppercase">
                    {issue.category}
                  </span>
                </div>

                <p className="text-[11px] text-zinc-400">{issue.description}</p>

                {/* Socratic Hint Box */}
                <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/20 text-[11px] text-purple-300 flex items-start gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-purple-200">Socratic Hint: </span>
                    {issue.socraticHint}
                  </div>
                </div>

                {/* Suggested Fix */}
                <div className="p-2 rounded-xl bg-black/40 border border-zinc-800 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                  <Wrench className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Fix: {issue.suggestedFix}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

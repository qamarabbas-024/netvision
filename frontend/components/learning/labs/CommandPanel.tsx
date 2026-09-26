'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { executeLabCommandApi } from '@/lib/api';
import { Terminal, CornerDownLeft, ShieldCheck, Copy, Check } from 'lucide-react';

import type { VisualSimulationStateDto, SanitizedDiagnosticHintsDto } from '@netvision/shared';

export interface CommandPanelProps {
  labId: string;
  allowedCommands?: string[];
  clientStateVersion?: number;
  sessionId?: string;
  onCommandRun?: (
    cmd: string,
    output: string,
    visualState?: VisualSimulationStateDto,
    hints?: SanitizedDiagnosticHintsDto,
    newVersion?: number,
    newSessionId?: string
  ) => void;
}

export const CommandPanel: React.FC<CommandPanelProps> = ({
  labId,
  allowedCommands = ['ping 192.168.1.1', 'arp -a', 'nslookup netvision.edu', 'ipconfig /all', 'traceroute 8.8.8.8'],
  clientStateVersion,
  sessionId,
  onCommandRun,
}) => {
  const [command, setCommand] = useState<string>('ping 192.168.1.1');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [concurrencyNotice, setConcurrencyNotice] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{ cmd: string; output: string; time: string }>>([
    {
      cmd: 'ipconfig /all',
      output: `Ethernet adapter Local Area Connection:\n  IPv4 Address. . . . . . . . . . . : 192.168.1.50\n  Subnet Mask . . . . . . . . . . . : 255.255.255.0\n  Default Gateway . . . . . . . . . : 192.168.1.1\n  Physical Address (MAC)  . . . . . : 00-1A-2B-3C-4D-5E`,
      time: '12:00:00',
    },
  ]);

  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const terminalBottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard?.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleExecute = async (cmdToRun: string) => {
    const cleanCmd = cmdToRun.trim();
    if (!cleanCmd) return;

    setIsExecuting(true);
    setConcurrencyNotice(null);
    try {
      const res = await executeLabCommandApi(
        labId,
        cleanCmd,
        undefined,
        clientStateVersion,
        sessionId
      );
      const outText = res.result?.output || (typeof res === 'string' ? res : `Simulated execution of '${cleanCmd}'. Status: OK.`);
      const newEntry = {
        cmd: cleanCmd,
        output: outText,
        time: new Date().toLocaleTimeString(),
      };
      setHistory((prev) => [...prev, newEntry]);
      if (onCommandRun) {
        onCommandRun(
          cleanCmd,
          newEntry.output,
          res.visualState,
          res.hints,
          res.stateVersion,
          res.sessionId
        );
      }
    } catch (err: any) {
      if (err?.status === 409 || err?.message?.includes('Stale simulation state')) {
        setConcurrencyNotice('Concurrency notice: Server state was updated by another command. Interface resynchronized.');
      }
      // Fallback pattern execution if offline
      const lower = cleanCmd.toLowerCase();
      let output = `Executed simulated command '${cleanCmd}'.`;
      if (lower.startsWith('ping')) {
        output = `PING ${cleanCmd.split(' ')[1] || '192.168.1.1'}: 56 data bytes\n64 bytes from 192.168.1.1: icmp_seq=0 ttl=64 time=1.1ms\n64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=0.9ms\n--- 192.168.1.1 ping statistics ---\n2 packets transmitted, 2 received, 0% packet loss`;
      } else if (lower.startsWith('arp')) {
        output = `Interface: 192.168.1.50 --- 0x2\n  192.168.1.1           00-11-22-33-44-55     dynamic`;
      }
      const newEntry = { cmd: cleanCmd, output, time: new Date().toLocaleTimeString() };
      setHistory((prev) => [...prev, newEntry]);
      if (onCommandRun) onCommandRun(cleanCmd, output);
    } finally {
      setIsExecuting(false);
    }
  };

  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setCommand(history[nextIdx].cmd);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIdx = historyIndex + 1;
        if (nextIdx >= history.length) {
          setHistoryIndex(-1);
          setCommand('');
        } else {
          setHistoryIndex(nextIdx);
          setCommand(history[nextIdx].cmd);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleTabComplete();
    } else if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      handleInterrupt();
    }
  };

  const handleTabComplete = () => {
    const trimmed = command.trim();
    if (!trimmed) {
      if (allowedCommands.length > 0) setCommand(allowedCommands[0]);
      return;
    }
    const match = allowedCommands.find((c) => c.toLowerCase().startsWith(trimmed.toLowerCase()));
    if (match) {
      setCommand(match);
    }
  };

  const handleInterrupt = () => {
    if (command) {
      setHistory((prev) => [
        ...prev,
        { cmd: command + ' ^C', output: '[Command cancelled by user interrupt]', time: new Date().toLocaleTimeString() },
      ]);
      setCommand('');
      setHistoryIndex(-1);
    }
  };

  const handleClearScreen = () => {
    setHistory([]);
    setHistoryIndex(-1);
  };

  return (
    <Card className="p-4 sm:p-5 glass-panel-glow border-[#00f0ff]/30 flex flex-col gap-4 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#272732] pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="cyan">CLI TERMINAL</Badge>
          <span className="text-xs font-mono text-zinc-300">Simulated Network Socket Sandbox</span>
        </div>

        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" /> Secure Sandbox Enforced
        </span>
      </div>

      {concurrencyNotice && (
        <div 
          role="alert" 
          aria-live="polite"
          className="rounded-lg bg-amber-950/40 border border-amber-500/40 p-2.5 text-xs text-amber-300 font-mono flex items-center gap-2"
        >
          <span>{concurrencyNotice}</span>
        </div>
      )}

      {/* Allowed Command Presets */}
      <div className="flex flex-wrap gap-2">
        <span className="text-[11px] font-mono text-zinc-400 self-center">Allowed Commands:</span>
        {allowedCommands.map((c, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setCommand(c);
              handleExecute(c);
            }}
            className="min-h-[36px] px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-200 hover:text-[#00f0ff] font-mono text-xs border border-[#272732] transition-colors flex items-center gap-1 shrink-0 max-w-full truncate focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
            aria-label={`Execute preset command: ${c}`}
          >
            <span>{c}</span>
          </button>
        ))}
      </div>

      {/* Terminal History with Screen Reader Live Updates */}
      <div 
        role="log"
        aria-live="polite"
        aria-label="Terminal command history and output"
        tabIndex={0}
        className="p-3 sm:p-4 rounded-2xl bg-[#09090b] border border-[#272732] font-mono text-xs text-zinc-200 flex flex-col gap-3 min-h-[200px] max-h-[300px] overflow-y-auto focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500/50"
      >
        {history.map((h, idx) => (
          <div key={idx} className="space-y-1 relative group">
            <div className="flex flex-wrap items-center justify-between gap-1.5 text-[#00f0ff]">
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-400 text-[10px]">[{h.time}]</span>
                <span className="text-emerald-400 font-semibold">netvision@sandbox:~$</span>
                <span className="font-bold break-all text-white">{h.cmd}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(h.output, idx)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-cyan-300 p-1 rounded cursor-pointer"
                aria-label={`Copy output of command ${h.cmd}`}
              >
                {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <pre className="text-zinc-300 whitespace-pre-wrap text-[11px] leading-relaxed pl-3 border-l border-zinc-800 break-word-all">
              {h.output}
            </pre>
          </div>
        ))}
        <div ref={terminalBottomRef} />
      </div>

      {/* Mobile Terminal Helper Controls (Tab, Ctrl+C, History Arrows, Clear) */}
      <div className="flex items-center justify-between gap-1.5 py-1 px-1.5 rounded-lg bg-[#0e1017] border border-[#272732] text-xs font-mono">
        <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold pl-1">Mobile Helper:</span>
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            type="button"
            onClick={handleTabComplete}
            aria-label="Tab autocomplete command"
            className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-cyan-300 font-bold text-xs border border-zinc-700 transition-colors cursor-pointer"
          >
            Tab ⇥
          </button>
          <button
            type="button"
            onClick={handleInterrupt}
            aria-label="Send user interrupt signal Ctrl+C"
            className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-rose-950/60 text-rose-400 font-bold text-xs border border-zinc-700 hover:border-rose-500/50 transition-colors cursor-pointer"
          >
            Ctrl+C
          </button>
          <button
            type="button"
            onClick={() => {
              if (history.length > 0) {
                const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
                setHistoryIndex(nextIdx);
                setCommand(history[nextIdx].cmd);
              }
            }}
            aria-label="Previous command in history"
            className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs border border-zinc-700 transition-colors cursor-pointer"
          >
            ▲
          </button>
          <button
            type="button"
            onClick={() => {
              if (historyIndex !== -1) {
                const nextIdx = historyIndex + 1;
                if (nextIdx >= history.length) {
                  setHistoryIndex(-1);
                  setCommand('');
                } else {
                  setHistoryIndex(nextIdx);
                  setCommand(history[nextIdx].cmd);
                }
              }
            }}
            aria-label="Next command in history"
            className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs border border-zinc-700 transition-colors cursor-pointer"
          >
            ▼
          </button>
          <button
            type="button"
            onClick={handleClearScreen}
            aria-label="Clear terminal output"
            className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-xs border border-zinc-700 transition-colors cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Input Prompt Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleExecute(command);
        }}
        className="flex items-center gap-2"
      >
        <div className="flex-1 relative flex items-center">
          <label htmlFor="terminal-command-input" className="sr-only">Terminal command input</label>
          <span className="absolute left-3 text-emerald-400 font-mono text-xs" aria-hidden="true">$</span>
          <input
            id="terminal-command-input"
            type="text"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck="false"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDownInput}
            placeholder="Type terminal command (e.g. ping 192.168.1.1)..."
            className="w-full bg-[#09090b] border border-[#272732] focus:border-[#00f0ff] rounded-xl pl-8 pr-4 py-2.5 text-xs font-mono text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors"
          />
        </div>
        <Button 
          variant="cyan" 
          type="submit" 
          size="sm" 
          disabled={isExecuting} 
          rightIcon={<CornerDownLeft className="w-3.5 h-3.5" />}
          className="min-h-[38px]"
        >
          {isExecuting ? 'Running...' : 'Execute'}
        </Button>
      </form>
    </Card>
  );
};

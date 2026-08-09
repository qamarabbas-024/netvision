'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { executeLabCommandApi } from '@/lib/api';
import { Terminal, CornerDownLeft, ShieldCheck, Copy, Check } from 'lucide-react';

export interface CommandPanelProps {
  labId: string;
  allowedCommands?: string[];
  onCommandRun?: (cmd: string, output: string) => void;
}

export const CommandPanel: React.FC<CommandPanelProps> = ({
  labId,
  allowedCommands = ['ping 192.168.1.1', 'arp -a', 'nslookup netvision.edu', 'ipconfig /all', 'traceroute 8.8.8.8'],
  onCommandRun,
}) => {
  const [command, setCommand] = useState<string>('ping 192.168.1.1');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [history, setHistory] = useState<Array<{ cmd: string; output: string; time: string }>>([
    {
      cmd: 'ipconfig /all',
      output: `Ethernet adapter Local Area Connection:\n  IPv4 Address. . . . . . . . . . . : 192.168.1.50\n  Subnet Mask . . . . . . . . . . . : 255.255.255.0\n  Default Gateway . . . . . . . . . : 192.168.1.1\n  Physical Address (MAC)  . . . . . : 00-1A-2B-3C-4D-5E`,
      time: '12:00:00',
    },
  ]);

  const handleExecute = async (cmdToRun: string) => {
    const cleanCmd = cmdToRun.trim();
    if (!cleanCmd) return;

    setIsExecuting(true);
    try {
      const res = await executeLabCommandApi(labId, cleanCmd);
      const newEntry = {
        cmd: cleanCmd,
        output: res.output || `Simulated execution of '${cleanCmd}'. Status: OK.`,
        time: new Date().toLocaleTimeString(),
      };
      setHistory((prev) => [...prev, newEntry]);
      if (onCommandRun) onCommandRun(cleanCmd, newEntry.output);
    } catch (err) {
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

  return (
    <Card className="p-4 sm:p-5 glass-panel-glow border-[#00f0ff]/30 flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#272732] pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="cyan">CLI TERMINAL</Badge>
          <span className="text-xs font-mono text-zinc-400">Simulated Network Socket Sandbox</span>
        </div>

        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5" /> Secure Sandbox Enforced
        </span>
      </div>

      {/* Allowed Command Presets */}
      <div className="flex flex-wrap gap-2">
        <span className="text-[11px] font-mono text-zinc-500 self-center">Allowed Commands:</span>
        {allowedCommands.map((c, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCommand(c);
              handleExecute(c);
            }}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-[#00f0ff] font-mono text-xs border border-[#272732] transition-colors flex items-center gap-1 shrink-0 max-w-full truncate"
          >
            <span>{c}</span>
          </button>
        ))}
      </div>

      {/* Terminal History */}
      <div className="p-3 sm:p-4 rounded-2xl bg-[#09090b] border border-[#272732] font-mono text-xs text-zinc-300 flex flex-col gap-3 min-h-[200px] max-h-[300px] overflow-y-auto">
        {history.map((h, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex flex-wrap items-center gap-1.5 text-[#00f0ff]">
              <span className="text-zinc-500 text-[10px]">[{h.time}]</span>
              <span className="text-emerald-400">netvision@sandbox:~$</span>
              <span className="font-bold break-all">{h.cmd}</span>
            </div>
            <pre className="text-zinc-400 whitespace-pre-wrap text-[11px] leading-relaxed pl-3 border-l border-zinc-800 break-word-all">
              {h.output}
            </pre>
          </div>
        ))}
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
          <span className="absolute left-3 text-emerald-400 font-mono text-xs">$</span>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Type terminal command (e.g. ping 192.168.1.1)..."
            className="w-full bg-[#09090b] border border-[#272732] focus:border-[#00f0ff] rounded-xl pl-8 pr-4 py-2.5 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none transition-colors"
          />
        </div>
        <Button variant="cyan" type="submit" size="sm" disabled={isExecuting} rightIcon={<CornerDownLeft className="w-3.5 h-3.5" />}>
          {isExecuting ? 'Running...' : 'Execute'}
        </Button>
      </form>
    </Card>
  );
};

'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Terminal, Send, CheckCircle2, Play, CornerDownLeft } from 'lucide-react';


export interface GuidedPracticeTerminalProps {
  topicSlug: string;
  instructions?: string;
  defaultCommand?: string;
}

export const GuidedPracticeTerminal: React.FC<GuidedPracticeTerminalProps> = ({
  topicSlug,
  instructions,
  defaultCommand,
}) => {
  const [command, setCommand] = useState<string>(defaultCommand || `ping 192.168.1.1`);
  const [history, setHistory] = useState<Array<{ cmd: string; output: string; time: string }>>([
    {
      cmd: defaultCommand || `ping 192.168.1.1`,
      output: `PING 192.168.1.1 (192.168.1.1): 56 data bytes\n64 bytes from 192.168.1.1: icmp_seq=0 ttl=64 time=1.24 ms\n64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=0.98 ms\n64 bytes from 192.168.1.1: icmp_seq=2 ttl=64 time=1.05 ms\n--- 192.168.1.1 ping statistics ---\n3 packets transmitted, 3 packets received, 0.0% packet loss\nround-trip min/avg/max = 0.98/1.09/1.24 ms`,
      time: '12:00:01',
    },
  ]);

  const executeCommand = (cmdToRun: string) => {
    const cleanCmd = cmdToRun.trim();
    if (!cleanCmd) return;

    let output = '';
    const lower = cleanCmd.toLowerCase();

    if (lower.startsWith('ping')) {
      const target = cleanCmd.split(' ')[1] || '192.168.1.1';
      output = `PING ${target}: 56 data bytes\n64 bytes from ${target}: icmp_seq=0 ttl=64 time=1.42 ms\n64 bytes from ${target}: icmp_seq=1 ttl=64 time=1.11 ms\n64 bytes from ${target}: icmp_seq=2 ttl=64 time=1.05 ms\n--- ${target} ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss`;
    } else if (lower.startsWith('arp')) {
      output = `Interface: 192.168.1.50 --- 0x2\n  Internet Address      Physical Address      Type\n  192.168.1.1           00-11-22-33-44-55     dynamic\n  192.168.1.100         aa-bb-cc-dd-ee-ff     dynamic\n  192.168.1.255         ff-ff-ff-ff-ff-ff     static`;
    } else if (lower.startsWith('nslookup') || lower.startsWith('dig')) {
      output = `Server:  1.1.1.1\nAddress: 1.1.1.1#53\n\nNon-authoritative answer:\nName:    ${lower.split(' ')[1] || 'netvision.edu'}\nAddress: 104.21.48.12`;
    } else if (lower.startsWith('ipconfig') || lower.startsWith('ifconfig')) {
      output = `Ethernet adapter Local Area Connection:\n  IPv4 Address. . . . . . . . . . . : 192.168.1.50\n  Subnet Mask . . . . . . . . . . . : 255.255.255.0\n  Default Gateway . . . . . . . . . : 192.168.1.1\n  Physical Address (MAC)  . . . . . : 00-1A-2B-3C-4D-5E`;
    } else if (lower.startsWith('traceroute') || lower.startsWith('tracert')) {
      output = `traceroute to 8.8.8.8 (8.8.8.8), 30 hops max\n 1  192.168.1.1 (192.168.1.1)  1.21 ms\n 2  10.0.0.1 (10.0.0.1)  8.45 ms\n 3  72.14.212.1 (72.14.212.1)  14.20 ms\n 4  dns.google (8.8.8.8)  18.10 ms`;
    } else {
      output = `bash: ${cleanCmd}: command simulated. Execute 'ping', 'arp -a', 'nslookup', 'ipconfig', or 'traceroute'.`;
    }

    setHistory((prev) => [
      ...prev,
      { cmd: cleanCmd, output, time: new Date().toLocaleTimeString() },
    ]);
  };

  return (
    <Card className="p-6 glass-panel-glow border-[#00f0ff]/30 flex flex-col gap-5">
      <div className="flex items-center justify-between border-b border-[#272732] pb-3">
        <div className="flex items-center gap-2">
          <Badge variant="amber">STAGE 5: PRACTICE</Badge>
          <span className="text-xs font-mono text-zinc-400">Guided Hands-On CLI Simulation</span>
        </div>

        <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> Virtual Socket Connected
        </span>
      </div>

      {instructions && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 leading-relaxed flex items-start gap-3">
          <Terminal className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block mb-0.5">Practice Objective:</span>
            {instructions}
          </div>
        </div>
      )}

      {/* Preset Quick Commands */}
      <div className="flex flex-wrap gap-2">
        <span className="text-[11px] font-mono text-zinc-500 self-center">Quick Commands:</span>
        {['ping 192.168.1.1', 'arp -a', 'nslookup netvision.edu', 'ipconfig /all', 'traceroute 8.8.8.8'].map((c) => (
          <button
            key={c}
            onClick={() => {
              setCommand(c);
              executeCommand(c);
            }}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-[#00f0ff] font-mono text-xs border border-[#272732] transition-colors"
          >
            {c}
          </button>
        ))}
      </div>

      {/* Terminal Display */}
      <div className="p-4 rounded-2xl bg-[#09090b] border border-[#272732] font-mono text-xs text-zinc-300 flex flex-col gap-3 min-h-[220px] max-h-[320px] overflow-y-auto">
        {history.map((h, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center gap-2 text-[#00f0ff]">
              <span className="text-zinc-500">[{h.time}]</span>
              <span className="text-emerald-400">netvision@sandbox:~$</span>
              <span className="font-bold">{h.cmd}</span>
            </div>
            <pre className="text-zinc-400 whitespace-pre-wrap text-[11px] leading-relaxed pl-4 border-l border-zinc-800">
              {h.output}
            </pre>
          </div>
        ))}
      </div>

      {/* Input Command Line */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          executeCommand(command);
        }}
        className="flex items-center gap-2"
      >
        <div className="flex-1 relative flex items-center">
          <span className="absolute left-3 text-emerald-400 font-mono text-xs">$</span>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Type network command (e.g. ping 192.168.1.1, arp -a)..."
            className="w-full bg-[#09090b] border border-[#272732] focus:border-[#00f0ff] rounded-xl pl-8 pr-4 py-2.5 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none transition-colors"
          />
        </div>
        <Button variant="cyan" type="submit" size="sm" rightIcon={<CornerDownLeft className="w-3.5 h-3.5" />}>
          Run
        </Button>
      </form>
    </Card>
  );
};

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Sparkles, Play, RotateCcw, Copy, Check, Minimize2, Maximize2 } from 'lucide-react';

export interface TerminalLogLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system';
  text: string;
}

export const InteractiveNetworkTerminal: React.FC = () => {
  const [inputVal, setInputVal] = useState<string>('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [logs, setLogs] = useState<TerminalLogLine[]>([
    {
      id: 'init-1',
      type: 'system',
      text: 'NetVision Virtual Network OS (NV-NOS v3.6.0-release) [x86_64 Linux kernel 6.6-nv]',
    },
    {
      id: 'init-2',
      type: 'system',
      text: 'Type "help" for a list of available network diagnostics, or "help <cmd>" for syntax.',
    },
  ]);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    // Add to history
    setCommandHistory((prev) => [trimmed, ...prev]);
    setHistoryIndex(-1);

    // Record user command
    const newLogs: TerminalLogLine[] = [
      ...logs,
      { id: `cmd-${Date.now()}`, type: 'input', text: `admin@nv-edge-r1:~$ ${trimmed}` },
    ];

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case 'clear':
        setLogs([]);
        return;

      case 'help':
        newLogs.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `Available NetVision Diagnostic Commands:
  • ping <target> [-c count]        — ICMP Echo Request / RTT latency analysis
  • traceroute <target>             — Multi-hop IP path and TTL expiration trace
  • ip route / show ip route        — Display IPv4 kernel routing table & next-hops
  • arp -a / show ip arp            — Query Address Resolution Protocol cache
  • show ip ospf neighbor           — Inspect OSPF Area 0 link-state adjacencies
  • dig <domain> [A|AAAA|MX]        — DNS hierarchy query and authoritative records
  • tcpdump [-i eth0] [bpf_filter]  — Stream real-time network packet headers
  • curl -I <url>                   — Inspect HTTP/HTTPS response headers & TLS
  • ifconfig / ip addr              — List network interface configurations
  • clear                           — Clear terminal screen buffer`,
        });
        break;

      case 'ping': {
        const target = args[0] || '1.1.1.1';
        newLogs.push({
          id: `out-${Date.now()}-1`,
          type: 'output',
          text: `PING ${target} (${target}) 56(84) bytes of data.\n64 bytes from ${target}: icmp_seq=1 ttl=58 time=11.4 ms\n64 bytes from ${target}: icmp_seq=2 ttl=58 time=10.8 ms\n64 bytes from ${target}: icmp_seq=3 ttl=58 time=11.1 ms\n64 bytes from ${target}: icmp_seq=4 ttl=58 time=10.9 ms\n\n--- ${target} ping statistics ---\n4 packets transmitted, 4 received, 0% packet loss, time 3004ms\nrtt min/avg/max/mdev = 10.842/11.060/11.418/0.224 ms`,
        });
        break;
      }

      case 'traceroute': {
        const target = args[0] || '93.184.216.34';
        newLogs.push({
          id: `out-${Date.now()}-1`,
          type: 'output',
          text: `traceroute to ${target} (${target}), 30 hops max, 60 byte packets
 1  192.168.1.1 (192.168.1.1)  1.214 ms  0.984 ms  1.102 ms [Default Gateway]
 2  10.240.0.1 (10.240.0.1)  4.312 ms  4.110 ms  4.205 ms [ISP Aggregation PE-1]
 3  172.16.88.2 (172.16.88.2)  8.740 ms  8.550 ms  8.612 ms [Core Transit Backbone]
 4  93.184.216.34 (93.184.216.34)  14.201 ms  14.050 ms  14.112 ms [Target Host]`,
        });
        break;
      }

      case 'ip':
      case 'show': {
        const sub = (args.join(' ') || '').toLowerCase();
        if (sub.includes('route')) {
          newLogs.push({
            id: `out-${Date.now()}-1`,
            type: 'output',
            text: `Codes: C - connected, S - static, O - OSPF, B - BGP, * - candidate default

Gateway of last resort is 172.16.0.1 to network 0.0.0.0

S*    0.0.0.0/0 [1/0] via 172.16.0.1, GigabitEthernet0/0
C     192.168.1.0/24 is directly connected, GigabitEthernet0/1
C     172.16.0.0/30 is directly connected, GigabitEthernet0/0
O     10.0.0.0/16 [110/11] via 172.16.0.2, 01:24:18, GigabitEthernet0/0
O     10.50.0.0/24 [110/20] via 172.16.0.2, 00:45:02, GigabitEthernet0/0`,
          });
        } else if (sub.includes('ospf') && sub.includes('neighbor')) {
          newLogs.push({
            id: `out-${Date.now()}-1`,
            type: 'output',
            text: `Neighbor ID     Pri   State           Dead Time   Address         Interface
10.255.0.2        1   FULL/DR         00:00:34    172.16.0.2      GigabitEthernet0/0
10.255.0.3        1   FULL/BDR        00:00:36    172.16.0.3      GigabitEthernet0/0`,
          });
        } else if (sub.includes('arp')) {
          newLogs.push({
            id: `out-${Date.now()}-1`,
            type: 'output',
            text: `Protocol  Address          Age (min)  Hardware Addr   Type   Interface
Internet  192.168.1.1             -   00:1a:2b:gw:01:01  ARPA   GigabitEthernet0/1
Internet  192.168.1.50           12   00:1a:2b:11:22:33  ARPA   GigabitEthernet0/1
Internet  172.16.0.2              4   00:1a:2b:r2:00:01  ARPA   GigabitEthernet0/0`,
          });
        } else {
          newLogs.push({
            id: `out-${Date.now()}-1`,
            type: 'output',
            text: `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN\n    inet 127.0.0.1/8 scope host lo\n2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP\n    inet 192.168.1.1/24 brd 192.168.1.255 scope global eth0`,
          });
        }
        break;
      }

      case 'arp': {
        newLogs.push({
          id: `out-${Date.now()}-1`,
          type: 'output',
          text: `? (192.168.1.50) at 00:1a:2b:11:22:33 [ether] on eth0\n? (172.16.0.2) at 00:1a:2b:r2:00:01 [ether] on eth1`,
        });
        break;
      }

      case 'dig': {
        const domain = args[0] || 'netvision.io';
        newLogs.push({
          id: `out-${Date.now()}-1`,
          type: 'output',
          text: `; <<>> DiG 9.18.24 <<>> ${domain}
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 48210
;; flags: qr rd ra; QUERY: 1, ANSWER: 2, AUTHORITY: 0, ADDITIONAL: 1

;; QUESTION SECTION:
;${domain}.			IN	A

;; ANSWER SECTION:
${domain}.		300	IN	A	104.21.45.12
${domain}.		300	IN	A	172.67.180.99

;; Query time: 14 msec
;; SERVER: 1.1.1.1#53(1.1.1.1) (UDP)`,
        });
        break;
      }

      case 'curl': {
        const url = args.find((a) => !a.startsWith('-')) || 'https://netvision.io';
        newLogs.push({
          id: `out-${Date.now()}-1`,
          type: 'output',
          text: `HTTP/2 200 
date: Sun, 23 Aug 2026 01:50:00 GMT
content-type: text/html; charset=UTF-8
server: cloudflare
strict-transport-security: max-age=31536000; includeSubDomains; preload
x-content-type-options: nosniff
cf-cache-status: HIT`,
        });
        break;
      }

      case 'tcpdump': {
        newLogs.push({
          id: `out-${Date.now()}-1`,
          type: 'output',
          text: `tcpdump: verbose output suppressed, use -v[v]... for full protocol decode
listening on eth0, link-type EN10MB (Ethernet), snapshot length 262144 bytes
01:50:12.410214 IP 192.168.1.50.52140 > 93.184.216.34.443: Flags [S], seq 3892019482, win 64240, options [mss 1460,sackOK,TS val 182910 ecr 0], length 0
01:50:12.424102 IP 93.184.216.34.443 > 192.168.1.50.52140: Flags [S.], seq 48192011, ack 3892019483, win 65535, options [mss 1460,sackOK], length 0
01:50:12.424180 IP 192.168.1.50.52140 > 93.184.216.34.443: Flags [.], ack 1, win 64240, length 0
3 packets captured, 3 packets received by filter, 0 packets dropped by kernel`,
        });
        break;
      }

      default:
        newLogs.push({
          id: `err-${Date.now()}`,
          type: 'error',
          text: `nv-nos: command not found: "${cmd}". Type "help" to see available network diagnostic commands.`,
        });
        break;
    }

    setLogs(newLogs);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIdx = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    }
  };

  const handleCopyLogs = () => {
    const fullText = logs.map((l) => l.text).join('\n');
    navigator.clipboard.writeText(fullText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-2xl bg-[#09090b] border border-[#272732] overflow-hidden flex flex-col shadow-2xl font-mono">
      {/* Terminal Title Bar */}
      <div className="px-4 py-3 bg-[#121217] border-b border-[#272732] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span className="text-xs font-bold text-zinc-300">
              admin@nv-edge-r1:~ (Version 3.6 Diagnostic Shell)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLogs}
            className="p-1 rounded text-zinc-400 hover:text-white bg-[#1a1a24] border border-[#272732] text-xs flex items-center gap-1"
          >
            {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span className="text-[10px] hidden sm:inline">{isCopied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={() => setLogs([])}
            className="p-1 rounded text-zinc-400 hover:text-white bg-[#1a1a24] border border-[#272732] text-xs flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="text-[10px] hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Terminal Output Stream */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="p-4 bg-[#09090b] min-h-[260px] max-h-[360px] overflow-y-auto text-xs leading-relaxed text-zinc-300 flex flex-col gap-1 cursor-text"
      >
        {logs.map((log) => {
          if (log.type === 'input') {
            return (
              <div key={log.id} className="text-[#00f0ff] font-bold">
                {log.text}
              </div>
            );
          }
          if (log.type === 'error') {
            return (
              <div key={log.id} className="text-rose-400 whitespace-pre-wrap">
                {log.text}
              </div>
            );
          }
          if (log.type === 'system') {
            return (
              <div key={log.id} className="text-zinc-500 whitespace-pre-wrap">
                {log.text}
              </div>
            );
          }
          return (
            <div key={log.id} className="text-emerald-400/90 whitespace-pre-wrap">
              {log.text}
            </div>
          );
        })}
        <div ref={terminalEndRef} />
      </div>

      {/* Terminal Input Line */}
      <div className="px-4 py-2.5 bg-[#0e0e14] border-t border-[#272732] flex items-center gap-2">
        <span className="text-[#00f0ff] text-xs font-bold shrink-0">admin@nv-edge-r1:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Try "ping 8.8.8.8", "traceroute 93.184.216.34", "show ip route", "tcpdump", or "help"...'
          className="flex-1 bg-transparent text-xs font-mono text-white focus:outline-none placeholder:text-zinc-600"
          autoFocus
        />
        <button
          onClick={() => executeCommand(inputVal)}
          className="px-2.5 py-1 rounded bg-[#00f0ff] text-black font-bold text-xs hover:bg-[#00f0ff]/90 transition-all font-mono shrink-0"
        >
          Exec ↵
        </button>
      </div>
    </div>
  );
};

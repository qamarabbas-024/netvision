'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Terminal as TerminalIcon, CornerDownLeft, Sparkles } from 'lucide-react';
import { useModalA11y } from '@/hooks/useModalA11y';

interface InteractiveTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInjectFault?: (fault: string) => void;
}

export const InteractiveTerminalModal: React.FC<InteractiveTerminalModalProps> = ({
  isOpen,
  onClose,
  onInjectFault,
}) => {
  const [command, setCommand] = useState('');
  const [cmdList, setCmdList] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [history, setHistory] = useState<Array<{ cmd?: string; output: string | React.ReactNode; isError?: boolean }>>([
    {
      output: (
        <div className="text-slate-400 space-y-1">
          <div className="text-[#34d399] font-bold">NetVision Interactive Host Shell (v2.4-netlink)</div>
          <div>Type <span className="text-[#22d3ee] font-semibold">help</span> or click suggestions below for quick network diagnostics.</div>
          <div>Target Topology: <span className="text-slate-200">WORKSTATION (192.168.1.10) ⟷ SERVER (142.250.72.14)</span></div>
          <div className="border-b border-slate-800 my-2" />
        </div>
      ),
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useModalA11y({ isOpen, onClose, initialFocusRef: inputRef });

  const quickSuggestions = [
    'ping 142.250.72.14',
    'traceroute 142.250.72.14',
    'curl -I https://netvision.io',
    'ip route',
    'arp -a',
    'show mac',
    'drop-link',
    'recover',
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) return null;

  const runCommandDirect = (rawCmd: string) => {
    const cleanCmd = rawCmd.trim();
    if (!cleanCmd) return;

    setCmdList((prev) => [...prev, cleanCmd]);
    setHistoryIndex(-1);

    const lower = cleanCmd.toLowerCase();
    let res: React.ReactNode = '';

    if (lower === 'help') {
      res = (
        <div className="space-y-1 text-slate-300">
          <div className="text-[#34d399] font-semibold">Available Commands:</div>
          <div><span className="text-cyan-400 font-mono">ping &lt;ip&gt;</span> — Send ICMP Echo Request packets (e.g. ping 142.250.72.14)</div>
          <div><span className="text-cyan-400 font-mono">traceroute &lt;host&gt;</span> — Trace Layer 3 routing hops and latency</div>
          <div><span className="text-cyan-400 font-mono">curl -I &lt;url&gt;</span> — Perform HTTP/3 GET header handshake</div>
          <div><span className="text-cyan-400 font-mono">ip route</span> or <span className="text-cyan-400 font-mono">netstat -rn</span> — View Kernel routing table</div>
          <div><span className="text-cyan-400 font-mono">arp -a</span> — Inspect ARP resolution cache</div>
          <div><span className="text-cyan-400 font-mono">show mac</span> — Inspect Switch CAM forwarding table</div>
          <div><span className="text-cyan-400 font-mono">drop-link</span> — Inject physical cable failure on Router link</div>
          <div><span className="text-cyan-400 font-mono">recover</span> — Restore network health &amp; convergence</div>
          <div><span className="text-cyan-400 font-mono">clear</span> — Clear terminal output</div>
        </div>
      );
    } else if (lower.startsWith('ping')) {
      res = (
        <div className="space-y-0.5 text-slate-300 font-mono">
          <div>PING 142.250.72.14 (142.250.72.14): 56 data bytes</div>
          <div>64 bytes from 142.250.72.14: icmp_seq=0 ttl=63 time=0.412 ms</div>
          <div>64 bytes from 142.250.72.14: icmp_seq=1 ttl=63 time=0.389 ms</div>
          <div>64 bytes from 142.250.72.14: icmp_seq=2 ttl=63 time=0.435 ms</div>
          <div className="text-emerald-400 mt-1">--- 142.250.72.14 ping statistics ---</div>
          <div>3 packets transmitted, 3 packets received, 0.0% packet loss, rtt min/avg/max = 0.389/0.412/0.435 ms</div>
        </div>
      );
    } else if (lower.startsWith('traceroute')) {
      res = (
        <div className="space-y-0.5 text-slate-300 font-mono">
          <div>traceroute to 142.250.72.14 (142.250.72.14), 30 hops max, 60 byte packets</div>
          <div> 1  192.168.1.1 (L2-SWITCH ⟷ ROUTER)  0.182 ms  0.174 ms</div>
          <div> 2  10.0.0.2 (EDGE-GATEWAY-FIREWALL)  0.298 ms  0.312 ms</div>
          <div> 3  142.250.72.14 (PRIMARY-APP-SERVER)  0.420 ms  0.415 ms [TARGET REACHED]</div>
        </div>
      );
    } else if (lower.startsWith('curl')) {
      res = (
        <div className="space-y-0.5 text-slate-300 font-mono">
          <div className="text-emerald-400">HTTP/3 200 OK</div>
          <div>server: NetVision-Edge-v1.4</div>
          <div>content-type: text/html; charset=UTF-8</div>
          <div>content-length: 48210</div>
          <div>x-transport-quic: active (TLS 1.3 0-RTT)</div>
          <div>strict-transport-security: max-age=31536000; includeSubDomains</div>
        </div>
      );
    } else if (lower === 'ip route' || lower === 'netstat -rn') {
      res = (
        <div className="space-y-0.5 text-slate-300 font-mono">
          <div className="text-cyan-400 font-semibold">Kernel IP routing table</div>
          <div>Destination     Gateway         Genmask         Flags Metric Ref    Use Iface</div>
          <div>0.0.0.0         192.168.1.1     0.0.0.0         UG    100    0        0 eth0</div>
          <div>192.168.1.0     0.0.0.0         255.255.255.0   U     100    0        0 eth0</div>
          <div>10.0.0.0        192.168.1.1     255.255.0.0     UG    200    0        0 eth0</div>
        </div>
      );
    } else if (lower === 'arp -a') {
      res = (
        <div className="space-y-0.5 text-slate-300 font-mono">
          <div className="text-cyan-400 font-semibold">Address Resolution Protocol (ARP) Cache</div>
          <div>Interface: 192.168.1.10 on eth0</div>
          <div>  192.168.1.1       at 00:1a:2b:3c:4d:5e [ether] on eth0 (Default Gateway)</div>
          <div>  192.168.1.20      at 00:50:56:c0:00:08 [ether] on eth0 (Peer Host)</div>
        </div>
      );
    } else if (lower === 'show mac') {
      res = (
        <div className="space-y-0.5 text-slate-300 font-mono">
          <div className="text-cyan-400 font-semibold">Access Switch MAC Address Table</div>
          <div>Vlan    Mac Address       Type        Ports</div>
          <div>----    -----------       --------    -----</div>
          <div>1       001a.2b3c.4d5e    DYNAMIC     Gi0/1 (Router)</div>
          <div>1       0050.56c0.0008    DYNAMIC     Gi0/2 (Workstation)</div>
          <div>1       0050.56c0.0009    DYNAMIC     Gi0/24 (Uplink)</div>
        </div>
      );
    } else if (lower === 'drop-link') {
      if (onInjectFault) onInjectFault('packet_loss');
      res = (
        <div className="space-y-0.5 text-rose-400 font-mono">
          <div>[ALERT] Physical fiber degraded on link eth0 ⟷ Gi0/1!</div>
          <div>Carrier signal lost. 35% packet loss injected on active forwarding plane.</div>
        </div>
      );
    } else if (lower === 'recover') {
      if (onInjectFault) onInjectFault('healthy');
      res = (
        <div className="space-y-0.5 text-emerald-400 font-mono">
          <div>[RECOVERY] Line protocol UP. Physical carrier signal restored.</div>
          <div>Topology re-converged with 0.0% packet drop.</div>
        </div>
      );
    } else if (lower === 'clear') {
      setHistory([]);
      setCommand('');
      return;
    } else {
      res = (
        <div className="text-rose-400 font-mono">
          zsh: command not found: {cleanCmd}. Type <span className="text-cyan-400 underline">help</span> for available commands.
        </div>
      );
    }

    setHistory((prev) => [...prev, { cmd: cleanCmd, output: res }]);
    setCommand('');
  };

  const handleTabComplete = () => {
    const trimmed = command.trim();
    if (!trimmed) {
      if (quickSuggestions.length > 0) setCommand(quickSuggestions[0]);
      return;
    }
    const match = quickSuggestions.find((c) => c.toLowerCase().startsWith(trimmed.toLowerCase()));
    if (match) {
      setCommand(match);
    }
  };

  const handleInterrupt = () => {
    if (command) {
      setHistory((prev) => [
        ...prev,
        { cmd: command + ' ^C', output: <span className="text-rose-400 font-mono">[Command interrupted by user]</span> },
      ]);
      setCommand('');
      setHistoryIndex(-1);
    }
  };

  const handleClearScreen = () => {
    setHistory([]);
    setHistoryIndex(-1);
  };

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdList.length > 0) {
        const nextIdx = historyIndex === -1 ? cmdList.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setCommand(cmdList[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIdx = historyIndex + 1;
        if (nextIdx >= cmdList.length) {
          setHistoryIndex(-1);
          setCommand('');
        } else {
          setHistoryIndex(nextIdx);
          setCommand(cmdList[nextIdx]);
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="terminal-modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-[#090d16] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden font-mono flex flex-col h-[520px] max-h-[85dvh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#060a12] border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5 mr-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <TerminalIcon className="w-4 h-4 text-emerald-400" />
            <span id="terminal-modal-title" className="text-xs font-bold text-slate-200">
              guest@netvision-host: ~
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close interactive terminal"
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Terminal Screen Body with Screen Reader Live Updates */}
        <div
          role="log"
          aria-live="polite"
          aria-label="Interactive terminal output"
          tabIndex={0}
          className="flex-1 p-4 overflow-y-auto space-y-3 text-xs text-slate-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500/40"
        >
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              {item.cmd && (
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-emerald-400 font-bold">➜</span>
                  <span className="text-cyan-400 font-semibold">~</span>
                  <span className="text-white">{item.cmd}</span>
                </div>
              )}
              <div className="pl-4">{item.output}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-[#060a12] border-t border-slate-800/80 flex flex-wrap items-center gap-1.5 text-[10px]">
          <span className="text-slate-400 flex items-center gap-1 font-sans">
            <Sparkles className="w-3 h-3 text-emerald-400" /> Quick:
          </span>
          {quickSuggestions.map((cmdText) => (
            <button
              key={cmdText}
              type="button"
              onClick={() => runCommandDirect(cmdText)}
              className="px-2 py-0.5 rounded-md bg-[#0f172a] hover:bg-emerald-950/40 border border-slate-700/60 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 transition-all cursor-pointer font-mono focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
            >
              {cmdText}
            </button>
          ))}
        </div>

        {/* Mobile Helper Controls (Tab, Ctrl+C, Up/Down History, Clear) */}
        <div className="px-4 py-1.5 bg-[#0b101c] border-t border-slate-800/80 flex items-center justify-between gap-1 text-xs">
          <span className="text-[10px] text-slate-400 uppercase font-sans font-semibold">Mobile Helper:</span>
          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              type="button"
              onClick={handleTabComplete}
              aria-label="Tab autocomplete command"
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-slate-700 cursor-pointer"
            >
              Tab ⇥
            </button>
            <button
              type="button"
              onClick={handleInterrupt}
              aria-label="Send user interrupt signal Ctrl+C"
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-rose-950/60 text-rose-400 font-bold text-xs border border-slate-700 cursor-pointer"
            >
              Ctrl+C
            </button>
            <button
              type="button"
              onClick={() => {
                if (cmdList.length > 0) {
                  const nextIdx = historyIndex === -1 ? cmdList.length - 1 : Math.max(0, historyIndex - 1);
                  setHistoryIndex(nextIdx);
                  setCommand(cmdList[nextIdx]);
                }
              }}
              aria-label="Previous command in history"
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 cursor-pointer"
            >
              ▲
            </button>
            <button
              type="button"
              onClick={() => {
                if (historyIndex !== -1) {
                  const nextIdx = historyIndex + 1;
                  if (nextIdx >= cmdList.length) {
                    setHistoryIndex(-1);
                    setCommand('');
                  } else {
                    setHistoryIndex(nextIdx);
                    setCommand(cmdList[nextIdx]);
                  }
                }
              }}
              aria-label="Next command in history"
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 cursor-pointer"
            >
              ▼
            </button>
            <button
              type="button"
              onClick={handleClearScreen}
              aria-label="Clear terminal output screen"
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs border border-slate-700 cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Command Input Prompt */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            runCommandDirect(command);
          }}
          className="p-3 bg-[#070b13] border-t border-slate-800 flex items-center gap-2"
        >
          <span className="text-emerald-400 font-bold text-sm">➜</span>
          <span className="text-cyan-400 font-semibold text-sm">~</span>
          <input
            ref={inputRef}
            type="text"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck="false"
            aria-label="Terminal command prompt"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDownInput}
            placeholder="Type network command (e.g. ping, traceroute, help)..."
            className="flex-1 bg-transparent border-none text-xs text-white placeholder-slate-400 focus:outline-none font-mono"
          />
          <button
            type="submit"
            aria-label="Execute command"
            className="p-1.5 rounded-lg bg-[#10b981]/20 hover:bg-[#10b981]/30 text-[#34d399] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Terminal as TerminalIcon } from 'lucide-react';

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
  const [history, setHistory] = useState<Array<{ cmd?: string; output: string | React.ReactNode; isError?: boolean }>>([
    {
      output: (
        <div className="text-slate-400 space-y-1">
          <div className="text-[#34d399] font-bold">NetVision Interactive Host Shell (v2.4-netlink)</div>
          <div>Type <span className="text-[#22d3ee] font-semibold">help</span> for a list of available network commands.</div>
          <div>Target Topology: <span className="text-slate-200">WORKSTATION (192.168.1.10) ⟷ SERVER (142.250.72.14)</span></div>
          <div className="border-b border-slate-800 my-2" />
        </div>
      ),
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleRunCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCmd = command.trim();
    if (!cleanCmd) return;

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
          <div><span className="text-cyan-400 font-mono">recover</span> — Restore network health & convergence</div>
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
          <div>server: NetVision-Edge/2.4 (QUIC v1)</div>
          <div>date: Sat, 29 Aug 2026 21:30:00 GMT</div>
          <div>content-type: application/json; charset=utf-8</div>
          <div>content-length: 14528</div>
          <div>alt-svc: h3=&quot;:443&quot;; ma=86400</div>
          <div>strict-transport-security: max-age=31536000; includeSubDomains</div>
        </div>
      );
    } else if (lower.includes('arp')) {
      res = (
        <div className="space-y-0.5 text-slate-300 font-mono">
          <div>Address          HWtype  HWaddress           Flags Mask            Iface</div>
          <div>192.168.1.1      ether   00:0a:95:9d:68:16   C                     eth0</div>
          <div>192.168.1.2      ether   00:1b:67:8a:4f:01   C                     eth0</div>
        </div>
      );
    } else if (lower.includes('route') || lower.includes('netstat')) {
      res = (
        <div className="space-y-0.5 text-slate-300 font-mono">
          <div>Kernel IP routing table</div>
          <div>Destination     Gateway         Genmask         Flags Metric Ref    Use Iface</div>
          <div>0.0.0.0         192.168.1.1     0.0.0.0         UG    100    0        0 eth0</div>
          <div>192.168.1.0     0.0.0.0         255.255.255.0   U     0      0        0 eth0</div>
        </div>
      );
    } else if (lower.includes('mac')) {
      res = (
        <div className="space-y-0.5 text-slate-300 font-mono">
          <div>VLAN   Mac Address       Type       Ports</div>
          <div>----   ----------------- --------   -----</div>
          <div>10     70:85:c2:54:19:a1 DYNAMIC    Gi0/1</div>
          <div>10     00:0a:95:9d:68:16 DYNAMIC    Gi0/24</div>
        </div>
      );
    } else if (lower.includes('drop-link')) {
      onInjectFault?.('packet_loss');
      res = (
        <div className="text-amber-400 font-mono">
          [FAULT INJECTED] Link Gi0/1 (Router ⟷ Edge Gateway) state set to ADMIN DOWN.
          Packets will now experience timeouts and packet drops.
        </div>
      );
    } else if (lower.includes('recover')) {
      onInjectFault?.('healthy');
      res = (
        <div className="text-emerald-400 font-mono">
          [RECOVERY TRIGGERED] All physical links converged and operational. Zero packet loss.
        </div>
      );
    } else if (lower === 'clear') {
      setHistory([]);
      setCommand('');
      return;
    } else {
      res = (
        <div className="text-red-400 font-mono">
          command not found: {cleanCmd}. Type &apos;help&apos; to see available networking tools.
        </div>
      );
    }

    setHistory((prev) => [...prev, { cmd: cleanCmd, output: res }]);
    setCommand('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-3xl bg-[#090d16] border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden font-mono text-xs flex flex-col h-[560px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Titlebar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0f172a] border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5 mr-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
            </div>
            <TerminalIcon className="w-4 h-4 text-[#34d399]" />
            <span className="text-slate-200 font-bold tracking-wide">user@netvision-workstation: ~ (bash)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] bg-slate-800/80 text-slate-400 border border-slate-700 font-mono">
              ESC
            </span>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Terminal (ESC)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Output Canvas */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#070a10]">
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              {item.cmd && (
                <div className="flex items-center gap-2 text-slate-400 font-semibold">
                  <span className="text-[#34d399]">user@workstation:~$</span>
                  <span className="text-slate-100">{item.cmd}</span>
                </div>
              )}
              <div>{item.output}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <form onSubmit={handleRunCommand} className="flex items-center px-4 py-3 bg-[#0f172a] border-t border-slate-800 gap-2">
          <span className="text-[#34d399] font-bold">user@workstation:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Type 'ping 142.250.72.14', 'traceroute', 'curl', 'help'..."
            className="flex-1 bg-transparent border-none outline-none text-slate-100 placeholder-slate-600 font-mono text-xs"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-[#10b981] hover:bg-[#059669] text-slate-950 font-bold rounded text-[11px] transition-colors"
          >
            Execute
          </button>
        </form>
      </div>
    </div>
  );
};

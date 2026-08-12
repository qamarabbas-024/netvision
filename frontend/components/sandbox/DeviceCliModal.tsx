'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { NetworkNode } from '@/types';
import { Terminal, Send, Trash2, HelpCircle } from 'lucide-react';

export interface DeviceCliModalProps {
  node: NetworkNode | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DeviceCliModal: React.FC<DeviceCliModalProps> = ({
  node,
  isOpen,
  onClose,
}) => {
  const [commandInput, setCommandInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<
    Array<{ type: 'input' | 'output'; text: string }>
  >([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (node) {
      setTerminalHistory([
        {
          type: 'output',
          text: `NetVision Simulated Terminal OS [Version 12.6.0]\nConnected to ${node.name} (${node.ipAddress}) • Type 'help' for commands.\n`,
        },
      ]);
    }
  }, [node]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  if (!node) return null;

  const handleExecuteCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = commandInput.trim();
    if (!cmd) return;

    const newHistory = [
      ...terminalHistory,
      { type: 'input' as const, text: `${node.name}> ${cmd}` },
    ];

    const lowerCmd = cmd.toLowerCase();

    let outputText = '';

    if (lowerCmd === 'help') {
      outputText = `Available Simulated CLI Commands:\n  ping <ip>                - Verify ICMP connectivity to host\n  ipconfig / ifconfig       - Display active IPv4 configuration\n  arp -a                   - Display Address Resolution Protocol MAC table\n  route print / show route - Display Layer 3 IP routing table\n  show mac-address-table   - Display Layer 2 switch MAC forwarding table\n  clear                    - Clear terminal screen\n`;
    } else if (lowerCmd === 'clear' || lowerCmd === 'cls') {
      setTerminalHistory([]);
      setCommandInput('');
      return;
    } else if (lowerCmd.startsWith('ping')) {
      const parts = cmd.split(' ');
      const target = parts[1] || '8.8.8.8';
      outputText = `Pinging ${target} with 32 bytes of data:\nReply from ${target}: bytes=32 time=1.2ms TTL=64\nReply from ${target}: bytes=32 time=1.1ms TTL=64\nReply from ${target}: bytes=32 time=1.3ms TTL=64\nReply from ${target}: bytes=32 time=1.0ms TTL=64\n\nPing statistics for ${target}:\n    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)\nApproximate round trip times in milli-seconds:\n    Minimum = 1.0ms, Maximum = 1.3ms, Average = 1.15ms`;
    } else if (lowerCmd === 'ipconfig' || lowerCmd === 'ifconfig') {
      outputText = `Ethernet adapter eth0:\n   Connection-specific DNS Suffix  . : localdomain\n   IPv4 Address. . . . . . . . . . . : ${node.ipAddress}\n   Subnet Mask . . . . . . . . . . . : ${node.subnetMask || '255.255.255.0'}\n   Default Gateway . . . . . . . . . : ${node.defaultGateway || '192.168.1.1'}\n   Physical Address (MAC). . . . . . : ${node.macAddress}\n   Link Status . . . . . . . . . . . : UP (1000 Mbps)`;
    } else if (lowerCmd === 'arp -a' || lowerCmd === 'arp') {
      outputText = `Interface: ${node.ipAddress} --- 0x1\n  Internet Address      Physical Address      Type\n  192.168.1.1           00-1A-2B-00-00-01     dynamic\n  192.168.1.10          ${node.macAddress}     dynamic\n  10.0.0.1              00-1A-2B-77-88-99     dynamic`;
    } else if (
      lowerCmd === 'route print' ||
      lowerCmd === 'show route' ||
      lowerCmd === 'show ip route'
    ) {
      outputText = `IPv4 Route Table:\nActive Routes:\nNetwork Destination        Netmask          Gateway       Interface  Metric\n          0.0.0.0          0.0.0.0      ${node.defaultGateway || '192.168.1.1'}    ${node.ipAddress}      10\n      127.0.0.1    255.255.255.255        On-link         127.0.0.1     306\n    192.168.1.0    255.255.255.0         On-link       ${node.ipAddress}     266`;
    } else if (
      lowerCmd.includes('mac-address-table') ||
      lowerCmd.includes('mac address-table')
    ) {
      outputText = `Mac Address Table\n-------------------------------------------\nVlan    Mac Address       Type        Ports\n----    -----------       --------    -----\n   1    ${node.macAddress}    DYNAMIC     Eth0/1\n   1    001a.2b77.8899    DYNAMIC     Eth0/2\n   1    001a.2b11.2233    DYNAMIC     Eth0/3\nTotal Mac Addresses for this criterion: 3`;
    } else {
      outputText = `Command '${cmd}' not recognized. Type 'help' to view valid networking commands.`;
    }

    setTerminalHistory([
      ...newHistory,
      { type: 'output' as const, text: outputText },
    ]);
    setCommandInput('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Interactive CLI Terminal • ${node.name}`}
      description={`Device IP: ${node.ipAddress} • MAC: ${node.macAddress}`}
      className="max-w-2xl"
    >
      <div className="flex flex-col gap-3 font-mono text-xs">
        {/* Terminal Screen Window */}
        <div className="w-full h-80 bg-black/95 rounded-2xl border border-zinc-800 p-4 overflow-y-auto font-mono text-emerald-400 space-y-2 leading-relaxed">
          {terminalHistory.map((item, idx) => (
            <div key={idx} className={item.type === 'input' ? 'text-[#00f0ff] font-bold' : 'text-emerald-300'}>
              <pre className="whitespace-pre-wrap font-mono font-normal">{item.text}</pre>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Command Form */}
        <form onSubmit={handleExecuteCommand} className="flex items-center gap-2">
          <div className="flex-1 px-3 py-2 rounded-xl bg-[#121217] border border-[#272732] flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#00f0ff]" />
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="Type CLI command e.g. 'ping 192.168.1.1' or 'ipconfig'..."
              className="w-full bg-transparent text-white focus:outline-none text-xs font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#00f0ff] text-black font-bold hover:bg-[#00f0ff]/80 transition-colors shrink-0 flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" /> Execute
          </button>
        </form>
      </div>
    </Modal>
  );
};

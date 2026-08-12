'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { NetworkNode } from '@/types';
import { Link as LinkIcon, Cpu, ArrowRight } from 'lucide-react';

export interface PortSelectionModalProps {
  sourceNode: NetworkNode | null;
  targetNode: NetworkNode | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (sourcePort: string, targetPort: string, bandwidthMbps: number) => void;
}

export const PortSelectionModal: React.FC<PortSelectionModalProps> = ({
  sourceNode,
  targetNode,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!sourceNode || !targetNode) return null;

  const sourcePorts = sourceNode.interfaces?.map((i) => i.name) || ['eth0', 'eth1', 'ge0/0/0'];
  const targetPorts = targetNode.interfaces?.map((i) => i.name) || ['eth0', 'eth1', 'ge0/0/0'];

  const [selectedSourcePort, setSelectedSourcePort] = useState(sourcePorts[0] || 'eth0');
  const [selectedTargetPort, setSelectedTargetPort] = useState(targetPorts[0] || 'eth0');
  const [bandwidth, setBandwidth] = useState<number>(1000);

  const handleEstablishLink = () => {
    onConfirm(selectedSourcePort, selectedTargetPort, bandwidth);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Establish Cable Wiring Link"
      description={`Connect ${sourceNode.name} to ${targetNode.name}`}
      className="max-w-md"
    >
      <div className="flex flex-col gap-4 text-xs font-mono">
        <div className="p-4 rounded-2xl bg-[#121217] border border-[#272732] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#00f0ff]" />
            <span className="text-white font-bold">{sourceNode.name}</span>
          </div>

          <ArrowRight className="w-4 h-4 text-zinc-500" />

          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span className="text-white font-bold">{targetNode.name}</span>
          </div>
        </div>

        {/* Source Interface Port */}
        <div className="space-y-1">
          <label className="text-zinc-400 font-bold block">
            Select Source Port ({sourceNode.name}):
          </label>
          <select
            value={selectedSourcePort}
            onChange={(e) => setSelectedSourcePort(e.target.value)}
            className="w-full bg-[#121217] text-white border border-[#272732] rounded-xl px-3 py-2 text-xs font-mono"
          >
            {sourcePorts.map((p) => (
              <option key={p} value={p}>
                Port {p} (1000BASE-T Ethernet)
              </option>
            ))}
          </select>
        </div>

        {/* Target Interface Port */}
        <div className="space-y-1">
          <label className="text-zinc-400 font-bold block">
            Select Target Port ({targetNode.name}):
          </label>
          <select
            value={selectedTargetPort}
            onChange={(e) => setSelectedTargetPort(e.target.value)}
            className="w-full bg-[#121217] text-white border border-[#272732] rounded-xl px-3 py-2 text-xs font-mono"
          >
            {targetPorts.map((p) => (
              <option key={p} value={p}>
                Port {p} (1000BASE-T Ethernet)
              </option>
            ))}
          </select>
        </div>

        {/* Bandwidth Speed */}
        <div className="space-y-1">
          <label className="text-zinc-400 font-bold block">Physical Media Speed:</label>
          <div className="grid grid-cols-3 gap-2">
            {[100, 1000, 10000].map((b) => (
              <button
                key={b}
                onClick={() => setBandwidth(b)}
                className={`p-2 rounded-xl border text-center font-mono font-bold transition-all ${
                  bandwidth === b
                    ? 'bg-[#00f0ff] text-black border-[#00f0ff]'
                    : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
                }`}
              >
                {b >= 1000 ? `${b / 1000} Gbps` : `${b} Mbps`}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t border-[#272732]">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="cyan" onClick={handleEstablishLink} leftIcon={<LinkIcon className="w-4 h-4" />}>
            Establish Cable Link
          </Button>
        </div>
      </div>
    </Modal>
  );
};

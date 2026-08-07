'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { NetworkNode } from '@/types';

export interface DeviceConfigModalProps {
  node: NetworkNode | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedNode: NetworkNode) => void;
}

export const DeviceConfigModal: React.FC<DeviceConfigModalProps> = ({
  node,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!node) return null;

  const [ipAddress, setIpAddress] = useState(node.ipAddress);
  const [subnetMask, setSubnetMask] = useState(node.subnetMask || '255.255.255.0');
  const [defaultGateway, setDefaultGateway] = useState(node.defaultGateway || '192.168.1.1');

  const handleSave = () => {
    onSave({
      ...node,
      ipAddress,
      subnetMask,
      defaultGateway,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Configure ${node.name}`}
      description={`Device ID: ${node.id} • Type: ${node.type.toUpperCase()}`}
      className="max-w-md"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#121217] border border-[#272732]">
          <span className="text-xs font-mono text-zinc-400">MAC Address (Physical)</span>
          <span className="text-xs font-mono text-[#00f0ff] font-bold">{node.macAddress}</span>
        </div>

        <Input
          label="IPv4 Address"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
        />

        <Input
          label="Subnet Mask"
          value={subnetMask}
          onChange={(e) => setSubnetMask(e.target.value)}
        />

        <Input
          label="Default Gateway"
          value={defaultGateway}
          onChange={(e) => setDefaultGateway(e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-4 border-t border-[#272732]">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="cyan" onClick={handleSave}>
            Save Configuration
          </Button>
        </div>
      </div>
    </Modal>
  );
};

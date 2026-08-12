'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { NetworkNode, FirewallRule, NetworkInterface } from '@/types';
import { Cpu, Shield, Plus, Trash2, Power } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'general' | 'interfaces' | 'firewall'>('general');
  const [name, setName] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [subnetMask, setSubnetMask] = useState('');
  const [defaultGateway, setDefaultGateway] = useState('');
  const [status, setStatus] = useState<'online' | 'offline'>('online');
  const [interfaces, setInterfaces] = useState<NetworkInterface[]>([]);
  const [firewallRules, setFirewallRules] = useState<FirewallRule[]>([]);

  useEffect(() => {
    if (node) {
      setName(node.name || '');
      setIpAddress(node.ipAddress || '192.168.1.10');
      setSubnetMask(node.subnetMask || '255.255.255.0');
      setDefaultGateway(node.defaultGateway || '192.168.1.1');
      setStatus(node.status === 'offline' ? 'offline' : 'online');

      setInterfaces(
        node.interfaces || [
          { id: 'if-0', name: 'eth0', ipAddress: node.ipAddress, macAddress: node.macAddress, status: 'up' },
          { id: 'if-1', name: 'eth1', ipAddress: '10.0.0.1', macAddress: '00:1A:2B:FF:EE:DD', status: 'up' },
        ]
      );

      setFirewallRules(
        node.firewallRules || [
          { id: 'fw-1', action: 'ALLOW', protocol: 'TCP', port: 80, direction: 'INBOUND' },
          { id: 'fw-2', action: 'DENY', protocol: 'TCP', port: 23, direction: 'INBOUND' },
        ]
      );
    }
  }, [node]);

  if (!node) return null;

  const handleToggleInterfaceStatus = (ifId: string) => {
    setInterfaces((prev) =>
      prev.map((i) => (i.id === ifId ? { ...i, status: i.status === 'up' ? 'down' : 'up' } : i))
    );
  };

  const handleAddFirewallRule = () => {
    const newRule: FirewallRule = {
      id: `fw-${Date.now()}`,
      action: 'ALLOW',
      protocol: 'TCP',
      port: 443,
      direction: 'INBOUND',
    };
    setFirewallRules((prev) => [...prev, newRule]);
  };

  const handleDeleteFirewallRule = (id: string) => {
    setFirewallRules((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSave = () => {
    onSave({
      ...node,
      name,
      ipAddress,
      subnetMask,
      defaultGateway,
      status: status === 'offline' ? 'offline' : 'online',
      interfaces,
      firewallRules,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Device Manager • ${node.name}`}
      description={`Device ID: ${node.id} • Type: ${node.type.toUpperCase()}`}
      className="max-w-lg"
    >
      <div className="flex flex-col gap-4">
        {/* Tabs Row */}
        <div className="flex items-center gap-2 border-b border-[#272732] pb-2">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'general'
                ? 'bg-[#00f0ff] text-black shadow-glow-cyan'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            General Config
          </button>

          <button
            onClick={() => setActiveTab('interfaces')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'interfaces'
                ? 'bg-[#00f0ff] text-black shadow-glow-cyan'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Interfaces ({interfaces.length})
          </button>

          {node.type === 'firewall' && (
            <button
              onClick={() => setActiveTab('firewall')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'firewall'
                  ? 'bg-rose-500 text-white shadow-glow-rose'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Firewall Rules ({firewallRules.length})
            </button>
          )}
        </div>

        {/* Tab 1: General */}
        {activeTab === 'general' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#121217] border border-[#272732]">
              <span className="text-xs font-mono text-zinc-400">MAC Address (Hardware)</span>
              <span className="text-xs font-mono text-[#00f0ff] font-bold">{node.macAddress}</span>
            </div>

            <Input label="Device Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="IPv4 Address" value={ipAddress} onChange={(e) => setIpAddress(e.target.value)} />
            <Input label="Subnet Mask" value={subnetMask} onChange={(e) => setSubnetMask(e.target.value)} />
            <Input label="Default Gateway" value={defaultGateway} onChange={(e) => setDefaultGateway(e.target.value)} />

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-xs font-mono text-zinc-300 font-semibold">Device Power State</span>
              <button
                onClick={() => setStatus((s) => (s === 'online' ? 'offline' : 'online'))}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                  status === 'online'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                {status.toUpperCase()}
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Interfaces */}
        {activeTab === 'interfaces' && (
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono text-zinc-400">Physical Interface Status:</span>
            {interfaces.map((iface) => (
              <div
                key={iface.id}
                className="p-3 rounded-xl bg-[#121217] border border-[#272732] flex items-center justify-between gap-3 text-xs font-mono"
              >
                <div>
                  <span className="text-white font-bold block">{iface.name}</span>
                  <span className="text-zinc-500 text-[10px]">{iface.macAddress}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 text-[10px]">{iface.ipAddress || 'Unassigned'}</span>
                  <button
                    onClick={() => handleToggleInterfaceStatus(iface.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                      iface.status === 'up'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    LINK {iface.status.toUpperCase()}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Firewall Rules */}
        {activeTab === 'firewall' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400">Stateful Inspection Table:</span>
              <Button variant="cyan" size="sm" onClick={handleAddFirewallRule} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Add Rule
              </Button>
            </div>

            {firewallRules.map((rule) => (
              <div
                key={rule.id}
                className="p-3 rounded-xl bg-[#121217] border border-[#272732] flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      rule.action === 'ALLOW' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {rule.action}
                  </span>
                  <span className="text-white font-semibold">{rule.protocol}</span>
                  <span className="text-zinc-400">Port {rule.port || 'ANY'}</span>
                </div>

                <button
                  onClick={() => handleDeleteFirewallRule(rule.id)}
                  className="text-zinc-500 hover:text-rose-400 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Save Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t border-[#272732]">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="cyan" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
};

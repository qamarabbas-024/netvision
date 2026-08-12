'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { NetworkNode, FirewallRule, NetworkInterface, RouteEntry, VlanEntry } from '@/types';
import { Cpu, Shield, Plus, Trash2, Power, Layers, Radio, Globe } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'general' | 'interfaces' | 'routing' | 'firewall' | 'vlans' | 'services'>('general');
  const [name, setName] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [subnetMask, setSubnetMask] = useState('');
  const [defaultGateway, setDefaultGateway] = useState('');
  const [dnsServer, setDnsServer] = useState('');
  const [status, setStatus] = useState<'online' | 'offline'>('online');
  const [interfaces, setInterfaces] = useState<NetworkInterface[]>([]);
  const [firewallRules, setFirewallRules] = useState<FirewallRule[]>([]);
  const [routingTable, setRoutingTable] = useState<RouteEntry[]>([]);
  const [vlans, setVlans] = useState<VlanEntry[]>([]);
  const [services, setServices] = useState<string[]>([]);

  useEffect(() => {
    if (node) {
      setName(node.name || '');
      setIpAddress(node.ipAddress || '192.168.1.10');
      setSubnetMask(node.subnetMask || '255.255.255.0');
      setDefaultGateway(node.defaultGateway || '192.168.1.1');
      setDnsServer(node.dnsServer || '1.1.1.1');
      setStatus(node.status === 'offline' ? 'offline' : 'online');

      setInterfaces(
        node.interfaces || [
          { id: 'if-0', name: 'eth0', ipAddress: node.ipAddress, macAddress: node.macAddress, status: 'up' },
          { id: 'if-1', name: 'eth1', ipAddress: '10.0.0.1', macAddress: '00:1A:2B:FF:EE:DD', status: 'up' },
        ]
      );

      setRoutingTable(
        node.routingTable || [
          { destination: '0.0.0.0/0', netmask: '0.0.0.0', gateway: node.defaultGateway || '192.168.1.1', interfaceName: 'eth0' },
          { destination: '172.16.0.0/24', netmask: '255.255.255.0', gateway: '10.0.0.2', interfaceName: 'eth1' },
        ]
      );

      setFirewallRules(
        node.firewallRules || [
          { id: 'fw-1', action: 'ALLOW', protocol: 'TCP', port: 80, direction: 'INBOUND' },
          { id: 'fw-2', action: 'DENY', protocol: 'TCP', port: 23, direction: 'INBOUND' },
        ]
      );

      setVlans(
        node.vlans || [
          { id: 10, name: 'VLAN 10 Sales', ports: ['eth0/1', 'eth0/2'] },
          { id: 20, name: 'VLAN 20 Engineering', ports: ['eth0/3', 'eth0/4'] },
        ]
      );

      setServices(node.services || ['HTTP (Port 80)', 'HTTPS (Port 443)', 'DNS (Port 53)']);
    }
  }, [node]);

  if (!node) return null;

  const handleToggleInterfaceStatus = (ifId: string) => {
    setInterfaces((prev) =>
      prev.map((i) => (i.id === ifId ? { ...i, status: i.status === 'up' ? 'down' : 'up' } : i))
    );
  };

  const handleAddRoute = () => {
    const newRoute: RouteEntry = {
      destination: '10.200.0.0/16',
      netmask: '255.255.0.0',
      gateway: '10.0.0.1',
      interfaceName: 'eth0',
    };
    setRoutingTable((prev) => [...prev, newRoute]);
  };

  const handleDeleteRoute = (idx: number) => {
    setRoutingTable((prev) => prev.filter((_, i) => i !== idx));
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
      dnsServer,
      status: status === 'offline' ? 'offline' : 'online',
      interfaces,
      routingTable,
      firewallRules,
      vlans,
      services,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Configure ${node.name}`}
      description={`Device ID: ${node.id} • Type: ${node.type.toUpperCase()}`}
      className="max-w-xl"
    >
      <div className="flex flex-col gap-4">
        {/* Device-Specific Contextual Tabs */}
        <div className="flex items-center gap-1.5 border-b border-[#272732] pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'general' ? 'bg-[#00f0ff] text-black shadow-glow-cyan' : 'text-zinc-400 hover:text-white'
            }`}
          >
            General Config
          </button>

          <button
            onClick={() => setActiveTab('interfaces')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'interfaces' ? 'bg-[#00f0ff] text-black shadow-glow-cyan' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Interfaces ({interfaces.length})
          </button>

          {node.type === 'router' && (
            <button
              onClick={() => setActiveTab('routing')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'routing' ? 'bg-purple-500 text-white shadow-glow-purple' : 'text-zinc-400 hover:text-white'
              }`}
            >
              IP Routing ({routingTable.length})
            </button>
          )}

          {node.type === 'switch' && (
            <button
              onClick={() => setActiveTab('vlans')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'vlans' ? 'bg-blue-500 text-white shadow-glow-blue' : 'text-zinc-400 hover:text-white'
              }`}
            >
              VLAN Table ({vlans.length})
            </button>
          )}

          {node.type === 'firewall' && (
            <button
              onClick={() => setActiveTab('firewall')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'firewall' ? 'bg-rose-500 text-white shadow-glow-rose' : 'text-zinc-400 hover:text-white'
              }`}
            >
              ACL Rules ({firewallRules.length})
            </button>
          )}

          {node.type === 'server' && (
            <button
              onClick={() => setActiveTab('services')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'services' ? 'bg-emerald-500 text-black shadow-glow-emerald' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Active Services
            </button>
          )}
        </div>

        {/* Tab 1: General */}
        {activeTab === 'general' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#121217] border border-[#272732]">
              <span className="text-xs font-mono text-zinc-400">MAC Address (Physical)</span>
              <span className="text-xs font-mono text-[#00f0ff] font-bold">{node.macAddress}</span>
            </div>

            <Input label="Device Hostname" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="IPv4 Address" value={ipAddress} onChange={(e) => setIpAddress(e.target.value)} />
            <Input label="Subnet Mask" value={subnetMask} onChange={(e) => setSubnetMask(e.target.value)} />

            {(node.type === 'pc' || node.type === 'server') && (
              <>
                <Input label="Default Gateway" value={defaultGateway} onChange={(e) => setDefaultGateway(e.target.value)} />
                <Input label="Primary DNS Server" value={dnsServer} onChange={(e) => setDnsServer(e.target.value)} />
              </>
            )}

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

        {/* Tab 3: Router Static Routing */}
        {activeTab === 'routing' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400">L3 Static IP Route Entries:</span>
              <Button variant="cyan" size="sm" onClick={handleAddRoute} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Add Route
              </Button>
            </div>

            {routingTable.map((route, i) => (
              <div key={i} className="p-3 rounded-xl bg-[#121217] border border-[#272732] flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[#00f0ff] font-bold block">{route.destination}</span>
                  <span className="text-zinc-400 text-[10px]">Via Gateway {route.gateway} ({route.interfaceName})</span>
                </div>

                <button onClick={() => handleDeleteRoute(i)} className="text-zinc-500 hover:text-rose-400 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Switch VLAN Table */}
        {activeTab === 'vlans' && (
          <div className="flex flex-col gap-3 text-xs font-mono">
            <span className="text-zinc-400">VLAN Port Assignments:</span>
            {vlans.map((vlan) => (
              <div key={vlan.id} className="p-3 rounded-xl bg-[#121217] border border-[#272732] flex items-center justify-between">
                <div>
                  <span className="text-blue-400 font-bold block">{vlan.name} (VLAN {vlan.id})</span>
                  <span className="text-zinc-400 text-[10px]">Assigned Ports: {vlan.ports.join(', ')}</span>
                </div>
                <Badge variant="cyan">Active</Badge>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: Firewall Rules */}
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

                <button onClick={() => handleDeleteFirewallRule(rule.id)} className="text-zinc-500 hover:text-rose-400 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab 6: Server Active Services */}
        {activeTab === 'services' && (
          <div className="flex flex-col gap-3 text-xs font-mono">
            <span className="text-zinc-400">Hosted Network Daemon Services:</span>
            {services.map((srv, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[#121217] border border-[#272732] flex items-center justify-between">
                <span className="text-emerald-400 font-bold">{srv}</span>
                <Badge variant="emerald">RUNNING</Badge>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
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

'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ShieldAlert, CheckCircle2, PlayCircle, Wrench } from 'lucide-react';

export interface TroubleshootingScenario {
  id: string;
  title: string;
  category: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  symptom: string;
  goal: string;
  presetTopology: {
    nodes: any[];
    links: any[];
  };
}

export interface TroubleshootingScenariosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadScenario: (scenario: TroubleshootingScenario) => void;
}

export const SCENARIOS_CATALOG: TroubleshootingScenario[] = [
  {
    id: 'scen-1',
    title: 'PC Cannot Reach Local Gateway Router',
    category: 'Subnetting & Addressing',
    difficulty: 'BEGINNER',
    symptom: 'Client PC 1 receives "Destination Host Unreachable" when executing ping 192.168.1.1.',
    goal: 'Inspect PC 1 IPv4 configuration and resolve the subnet mask mismatch with gateway.',
    presetTopology: {
      nodes: [
        { id: 'sc1-pc1', name: 'Client PC 1', type: 'pc', ipAddress: '192.168.1.10', macAddress: '00:1A:2B:11:11:11', subnetMask: '255.255.0.0', defaultGateway: '192.168.1.1', status: 'online', position: { x: 150, y: 220 } },
        { id: 'sc1-[#00f0ff]', name: 'Gateway Router', type: 'router', ipAddress: '192.168.1.1', macAddress: '00:1A:2B:22:22:22', subnetMask: '255.255.255.0', status: 'online', position: { x: 550, y: 220 } },
      ],
      links: [
        { id: 'sc1-l1', sourceNodeId: 'sc1-pc1', targetNodeId: 'sc1-[#00f0ff]', bandwidthMbps: 1000, latencyMs: 1, status: 'connected' },
      ],
    },
  },
  {
    id: 'scen-2',
    title: 'Firewall Blocking HTTP Web Traffic',
    category: 'Cyber Security & Firewalls',
    difficulty: 'INTERMEDIATE',
    symptom: 'Client PC 1 ping succeeds to Web Server, but HTTP GET requests fail on Port 80.',
    goal: 'Open Firewall ACL rules configuration and add an ALLOW rule for TCP Port 80.',
    presetTopology: {
      nodes: [
        { id: 'sc2-pc1', name: 'Client PC 1', type: 'pc', ipAddress: '192.168.1.10', macAddress: '00:1A:2B:11:11:11', status: 'online', position: { x: 120, y: 220 } },
        { id: 'sc2-fw', name: 'Stateful Firewall', type: 'firewall', ipAddress: '192.168.1.1', macAddress: '00:1A:2B:22:22:22', status: 'online', position: { x: 450, y: 220 }, firewallRules: [{ id: 'rule-deny-80', action: 'DENY', protocol: 'TCP', port: 80, direction: 'INBOUND' }] },
        { id: 'sc2-[#00f0ff]', name: 'Web Server', type: 'server', ipAddress: '172.16.0.5', macAddress: '00:1A:2B:33:33:33', status: 'online', position: { x: 780, y: 220 } },
      ],
      links: [
        { id: 'sc2-l1', sourceNodeId: 'sc2-pc1', targetNodeId: 'sc2-fw', bandwidthMbps: 1000, latencyMs: 1, status: 'connected' },
        { id: 'sc2-l2', sourceNodeId: 'sc2-fw', targetNodeId: 'sc2-[#00f0ff]', bandwidthMbps: 1000, latencyMs: 5, status: 'connected' },
      ],
    },
  },
  {
    id: 'scen-3',
    title: 'Router Missing Static Route to Remote DMZ',
    category: 'IP Routing & Forwarding',
    difficulty: 'ADVANCED',
    symptom: 'Packets sent to Remote Server 172.16.0.5 drop at Core Router with "No Route to Host".',
    goal: 'Configure static route entry on Gateway Router pointing 172.16.0.0/24 to next-hop interface.',
    presetTopology: {
      nodes: [
        { id: 'sc3-pc1', name: 'Client PC 1', type: 'pc', ipAddress: '192.168.1.10', macAddress: '00:1A:2B:11:11:11', status: 'online', position: { x: 120, y: 220 } },
        { id: 'sc3-[#00f0ff]1', name: 'Core Router 1', type: 'router', ipAddress: '192.168.1.1', macAddress: '00:1A:2B:22:22:22', status: 'online', position: { x: 420, y: 220 } },
        { id: 'sc3-[#00f0ff]2', name: 'DMZ Router 2', type: 'router', ipAddress: '10.0.0.1', macAddress: '00:1A:2B:33:33:33', status: 'online', position: { x: 680, y: 220 } },
        { id: 'sc3-[#00f0ff]', name: 'DMZ Server', type: 'server', ipAddress: '172.16.0.5', macAddress: '00:1A:2B:44:44:44', status: 'online', position: { x: 900, y: 220 } },
      ],
      links: [
        { id: 'sc3-l1', sourceNodeId: 'sc3-pc1', targetNodeId: 'sc3-[#00f0ff]1', bandwidthMbps: 1000, latencyMs: 1, status: 'connected' },
        { id: 'sc3-l2', sourceNodeId: 'sc3-[#00f0ff]1', targetNodeId: 'sc3-[#00f0ff]2', bandwidthMbps: 1000, latencyMs: 2, status: 'connected' },
        { id: 'sc3-l3', sourceNodeId: 'sc3-[#00f0ff]2', targetNodeId: 'sc3-[#00f0ff]', bandwidthMbps: 1000, latencyMs: 5, status: 'connected' },
      ],
    },
  },
];

export const TroubleshootingScenariosModal: React.FC<TroubleshootingScenariosModalProps> = ({
  isOpen,
  onClose,
  onLoadScenario,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Troubleshooting Lab Scenarios Catalog"
      description="Select a diagnostic scenario to load broken topology and resolve technical issues."
      className="max-w-2xl"
    >
      <div className="flex flex-col gap-4">
        {SCENARIOS_CATALOG.map((scen) => (
          <div
            key={scen.id}
            className="p-5 rounded-2xl glass-panel border border-[#272732] hover:border-[#00f0ff]/40 transition-all flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant={scen.difficulty === 'ADVANCED' ? 'rose' : scen.difficulty === 'INTERMEDIATE' ? 'purple' : 'cyan'}>
                  {scen.difficulty}
                </Badge>
                <span className="text-xs font-mono text-zinc-400 font-semibold">{scen.category}</span>
              </div>

              <Button
                variant="cyan"
                size="sm"
                onClick={() => {
                  onLoadScenario(scen);
                  onClose();
                }}
                leftIcon={<PlayCircle className="w-4 h-4" />}
              >
                Launch Scenario →
              </Button>
            </div>

            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#00f0ff]" /> {scen.title}
            </h3>

            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
              <strong className="block text-white font-mono uppercase text-[10px] mb-0.5">Reported Symptom:</strong>
              {scen.symptom}
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
              <strong className="block text-white font-mono uppercase text-[10px] mb-0.5">Diagnostic Goal:</strong>
              {scen.goal}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

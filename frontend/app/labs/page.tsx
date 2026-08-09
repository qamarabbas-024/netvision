'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { PracticalLabEngine } from '@/components/learning/labs/PracticalLabEngine';
import { Badge } from '@/components/ui/Badge';
import { Wrench, HelpCircle, ShieldAlert, Target } from 'lucide-react';

export default function LabsPage() {
  const [activeType, setActiveType] = useState<'GUIDED' | 'ASSISTED' | 'CHALLENGE' | 'TROUBLESHOOTING_INCIDENT'>('GUIDED');

  const labData = {
    GUIDED: {
      id: 'lab-guided-1',
      title: 'Guided Practice: Find Your Local Gateway & IP Address',
      type: 'GUIDED',
      difficulty: 'Beginner',
      estimatedMinutes: 10,
      objectives: [
        'Execute ipconfig to observe IPv4 Address and Subnet Mask',
        'Verify ICMP gateway ping connectivity to 192.168.1.1',
      ],
      instructions: `Run: \`ipconfig\` in the CLI sandbox below.
Expected observations to locate:
- IPv4 Address (e.g. 192.168.1.50)
- Subnet Mask (e.g. 255.255.255.0)
- Default Gateway (e.g. 192.168.1.1)

Then test your gateway connection by running:
\`ping 192.168.1.1\``,
      commands: ['ipconfig /all', 'ping 192.168.1.1', 'arp -a', 'nslookup netvision.edu'],
      expectedObservations: [
        'IPv4 Address: 192.168.1.50',
        'Default Gateway: 192.168.1.1',
        'ICMP Echo Reply (0% loss)',
      ],
      hints: [
        'Hint 1: Type ipconfig /all to display all active adapter properties.',
        'Hint 2: Run ping 192.168.1.1 to confirm Layer 3 routing ICMP echo packets.',
      ],
    },
    ASSISTED: {
      id: 'lab-assisted-1',
      title: 'Assisted Practice: Inspect ARP Cache & Resolve Hostnames',
      type: 'ASSISTED',
      difficulty: 'Intermediate',
      estimatedMinutes: 15,
      objectives: [
        'Inspect local ARP cache to locate MAC addresses',
        'Perform DNS hostname lookup using nslookup',
      ],
      instructions: `Objective: Locate the physical MAC address for your default gateway and perform a DNS lookup for netvision.edu.
Fewer step-by-step instructions are provided. Use standard terminal diagnostic commands.`,
      commands: ['arp -a', 'nslookup netvision.edu', 'traceroute 8.8.8.8', 'show ip route'],
      expectedObservations: [
        'Gateway MAC Address in ARP table',
        'Resolved IPv4 address for netvision.edu',
      ],
      hints: [
        'Hint 1: Use arp -a to view cached IP-to-MAC address pairs.',
        'Hint 2: Use nslookup netvision.edu to query DNS resolvers.',
      ],
    },
    CHALLENGE: {
      id: 'lab-challenge-1',
      title: 'Challenge Lab: CIDR Subnet Partitioning & Path Diagnostics',
      type: 'CHALLENGE',
      difficulty: 'Hard',
      estimatedMinutes: 20,
      objectives: [
        'Verify point-to-point router hop count using traceroute',
        'Confirm routing table longest prefix match',
      ],
      instructions: `Problem Statement: A server on remote subnet 8.8.8.8 must be reached across 3 intermediate router hops.
Diagnose the path topology and confirm router forwarding behavior without guided instructions.`,
      commands: ['traceroute 8.8.8.8', 'show ip route', 'ping 8.8.8.8'],
      expectedObservations: [
        '3 router hop IPs in traceroute output',
        '0.0.0.0/0 default route match',
      ],
      hints: [
        'Hint 1: Execute traceroute 8.8.8.8 to trace intermediate gateway hops.',
      ],
    },
    TROUBLESHOOTING_INCIDENT: {
      id: 'lab-incident-1',
      title: 'Troubleshooting Incident: Internal Access OK, External Web Down',
      type: 'TROUBLESHOOTING_INCIDENT',
      difficulty: 'Expert',
      estimatedMinutes: 25,
      objectives: [
        'Diagnose why internal LAN pings succeed while external web browsing fails',
        'Identify whether DNS resolution or Default Gateway IP is misconfigured',
      ],
      instructions: `Incident Description: Users on the office floor report they can access internal file servers (192.168.1.100), but cannot load external websites.
Investigate the network configuration using CLI commands to isolate the fault.`,
      commands: ['ipconfig /all', 'ping 192.168.1.1', 'nslookup netvision.edu', 'ping 8.8.8.8'],
      expectedObservations: [
        'Local gateway ping 192.168.1.1 succeeds',
        'DNS resolution nslookup fails due to misconfigured DNS server IP',
      ],
      hints: [
        'Hint 1: Run ping 192.168.1.1 to confirm local LAN routing is operational.',
        'Hint 2: Run nslookup netvision.edu to test if DNS server IP 1.1.1.1 is reachable.',
      ],
    },
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar />

          <main className="p-4 sm:p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
            <div className="max-w-6xl mx-auto flex flex-col gap-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest font-semibold block mb-1">
                    Hands-On Networking Lab Engine
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Practical Networking Lab Architecture
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    Test all 4 lab modalities: Guided, Assisted, Challenge, and Troubleshooting Incident in a secure simulated sandbox environment.
                  </p>
                </div>

                <Badge variant="cyan" className="self-start sm:self-auto">4 Lab Modalities Active</Badge>
              </div>

              {/* Lab Type Selector Tabs */}
              <div className="flex flex-wrap gap-2 p-1.5 glass-panel rounded-2xl border border-[#272732]">
                <button
                  onClick={() => setActiveType('GUIDED')}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                    activeType === 'GUIDED'
                      ? 'bg-[#00f0ff] text-black shadow-glow-cyan'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Target className="w-3.5 h-3.5" /> 1. Guided Lab
                </button>

                <button
                  onClick={() => setActiveType('ASSISTED')}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                    activeType === 'ASSISTED'
                      ? 'bg-purple-500 text-white shadow-glow-purple'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" /> 2. Assisted Lab
                </button>

                <button
                  onClick={() => setActiveType('CHALLENGE')}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                    activeType === 'CHALLENGE'
                      ? 'bg-amber-500 text-black shadow-glow-amber'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" /> 3. Challenge Lab
                </button>

                <button
                  onClick={() => setActiveType('TROUBLESHOOTING_INCIDENT')}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                    activeType === 'TROUBLESHOOTING_INCIDENT'
                      ? 'bg-rose-500 text-white shadow-glow-rose'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" /> 4. Troubleshooting Incident
                </button>
              </div>

              {/* Active Lab Engine Instance */}
              <PracticalLabEngine lab={labData[activeType]} />
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

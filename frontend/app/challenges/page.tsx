'use client';

import React from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, Terminal, ArrowRight } from 'lucide-react';

export default function ChallengesPage() {
  const challenges = [
    {
      title: 'CTF Mission 1: The Broken BGP Peering Router',
      category: 'Level 3 Advanced Routing',
      difficulty: 'HARD',
      rewardXp: '+500 XP',
      desc: 'Diagnose why autonomous system AS65001 is rejecting BGP route announcements from AS65002.',
    },
    {
      title: 'CTF Mission 2: Firewall Rogue Port Bypass',
      category: 'Level 3 Cyber Security',
      difficulty: 'EXPERT',
      rewardXp: '+750 XP',
      desc: 'Inspect PCAP packet headers to locate the unauthorized covert SSH tunnel bypassing ACL rules.',
    },
    {
      title: 'CTF Mission 3: OSPF Area 0 Loop Troubleshooting',
      category: 'Level 3 Enterprise Architecture',
      difficulty: 'HARD',
      rewardXp: '+600 XP',
      desc: 'Repair a routing loop caused by misconfigured router priority costs in OSPF multi-area design.',
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar />

          <main className="p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
            <div className="max-w-6xl mx-auto flex flex-col gap-8">
              <div>
                <span className="text-xs font-mono text-rose-400 uppercase tracking-widest font-semibold block mb-1">
                  Level 3 Advanced Engineering
                </span>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  CTF & Troubleshooting Missions
                </h1>
                <p className="text-sm text-zinc-400 mt-1">
                  Real-world enterprise network break & repair scenarios for engineers and cybersecurity students.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {challenges.map((c, idx) => (
                  <Card key={idx} className="p-6 border-rose-500/30 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="rose">{c.difficulty}</Badge>
                        <span className="text-xs font-mono text-[#00f0ff] font-bold">{c.rewardXp}</span>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-2">{c.title}</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed mb-6">{c.desc}</p>
                    </div>

                    <Link href="/sandbox">
                      <Button variant="danger" size="sm" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                        Launch CTF Mission
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
